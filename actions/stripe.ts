"use server"

import { PaidTierNames } from "@/lib/db/pricingplans"
import { getServerSidePricingPlans } from "@/lib/db/pricingplans.server"
import { auth, currentUser, User } from "@clerk/nextjs/server"
import { getUserSubscription } from "@/lib/db/subscriptions"
import { Stripe } from "stripe"
import { env as serverEnv } from "@/data/server"
import { env as clientEnv } from "@/data/client"
import { redirect } from "next/navigation"

const stripe = new Stripe(serverEnv.STRIPE_SECRET_KEY)

export async function createCancelSession() {
  const user = await currentUser()
  if (user == null) return { error: true }

  const subscription = await getUserSubscription(user.id)

  if (subscription == null) return { error: true }

  if (
    subscription.stripeCustomerId == null ||
    subscription.stripeSubscriptionId == null
  ) {
    return new Response(null, { status: 500 })
  }

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: subscription.stripeCustomerId,
    return_url: `${clientEnv.NEXT_PUBLIC_SERVER_URL}/subscriptions`,
    flow_data: {
      type: "subscription_cancel",
      subscription_cancel: {
        subscription: subscription.stripeSubscriptionId,
      },
    },
  })

  redirect(portalSession.url)
}

export async function createCustomerPortalSession() {
  const { userId } = await auth()

  if (userId == null) return { error: true }

  const subscription = await getUserSubscription(userId)

  if (subscription?.stripeCustomerId == null) {
    return { error: true }
  }

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: subscription.stripeCustomerId,
    return_url: `${clientEnv.NEXT_PUBLIC_SERVER_URL}/subscriptions`,
  })

  redirect(portalSession.url)
}

export async function createCheckoutSession(tier: PaidTierNames) {
  const user = await currentUser()
  if (user == null) return { error: true }

  const subscription = await getUserSubscription(user.id)

  if (subscription == null) return { error: true }

  if (subscription.stripeCustomerId == null) {
    const url = await getCheckoutSession(tier, user)
    if (url == null) return { error: true }
    redirect(url)
  } else {
    const url = await getSubscriptionUpgradeSession(tier, subscription)
    redirect(url)
  }
}

async function getCheckoutSession(tier: PaidTierNames, user: User) {
  const customerEmail = user.primaryEmailAddress?.emailAddress ?? undefined;

  if (!customerEmail) {
    throw new Error('User email is required.');
  }

  const serverPlans = getServerSidePricingPlans();
  const priceId = serverPlans[tier].stripePriceId;

  if (!priceId) {
    throw new Error(`Stripe Price ID is missing for the ${tier} plan.`);
  }

  const sessionParams: Stripe.Checkout.SessionCreateParams = {
    customer_email: customerEmail,
    subscription_data: {
      metadata: {
        clerkUserId: user.id,
      },
    },
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: "subscription",
    success_url: `${clientEnv.NEXT_PUBLIC_SERVER_URL}/subscriptions`,
    cancel_url: `${clientEnv.NEXT_PUBLIC_SERVER_URL}/subscriptions`,
  };

  const session = await stripe.checkout.sessions.create(sessionParams);

  return session.url;
}

async function getSubscriptionUpgradeSession(
  tier: PaidTierNames,
  subscription: {
    stripeCustomerId: string | null
    stripeSubscriptionId: string | null
    stripeSubscriptionItemId: string | null
  }
) {
  if (
    subscription.stripeCustomerId == null ||
    subscription.stripeSubscriptionId == null ||
    subscription.stripeSubscriptionItemId == null
  ) {
    throw new Error('Missing required subscription details.');
  }

  const serverPlans = getServerSidePricingPlans();
  const priceId = serverPlans[tier].stripePriceId;
  
  if (!priceId) {
    throw new Error(`Missing Stripe price ID for the ${tier} plan.`);
  }

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: subscription.stripeCustomerId,
    return_url: `${clientEnv.NEXT_PUBLIC_SERVER_URL}/subscriptions`,
    flow_data: {
      type: "subscription_update_confirm",
      subscription_update_confirm: {
        subscription: subscription.stripeSubscriptionId,
        items: [
          {
            id: subscription.stripeSubscriptionItemId,
            price: priceId,
            quantity: 1,
          },
        ],
      },
    },
  });

  return portalSession.url;
}