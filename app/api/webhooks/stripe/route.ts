import { env } from "@/data/server";
import { getServerSidePricingPlans } from "@/lib/db/pricingplans.server";
import { pricingPlans } from "@/lib/db/pricingplans";
import { userSubscriptions } from "@/lib/db/schema";
import { updateUserSubscription } from "@/lib/db/subscriptions";
import { eq } from "drizzle-orm";
import { NextRequest } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(env.STRIPE_SECRET_KEY);

export async function POST(request: NextRequest) {
  try {
    const event = await stripe.webhooks.constructEvent(
      await request.text(),
      request.headers.get("stripe-signature") as string,
      env.STRIPE_WEBHOOK_SECRET2
    );

    console.log(`Processing webhook event: ${event.type}`);

    let result;
    switch (event.type) {
      case "customer.subscription.deleted": {
        result = await handleDelete(event.data.object as Stripe.Subscription);
        break;
      }
      case "customer.subscription.updated": {
        result = await handleUpdate(event.data.object as Stripe.Subscription);
        break;
      }
      case "customer.subscription.created": {
        result = await handleCreate(event.data.object as Stripe.Subscription);
        break;
      }
    }

    console.log(`Webhook processed successfully: ${event.type}`, result);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Webhook error:", error);
    return new Response(
      JSON.stringify({ error: "Webhook handler failed" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

async function handleCreate(subscription: Stripe.Subscription) {
  try {
    const serverPlans = getServerSidePricingPlans();
    const priceId = subscription.items.data[0].price.id;
    const tier = Object.values(serverPlans).find(
      plan => plan.stripePriceId === priceId
    );
    const clerkUserId = subscription.metadata.clerkUserId;

    if (!clerkUserId || !tier) {
      throw new Error("Missing required subscription data");
    }

    const customer = subscription.customer;
    const customerId = typeof customer === "string" ? customer : customer.id;

    const result = await updateUserSubscription(
      eq(userSubscriptions.clerkUserId, clerkUserId),
      {
        stripeCustomerId: customerId,
        planType: tier.title,
        stripeSubscriptionId: subscription.id,
        stripeSubscriptionItemId: subscription.items.data[0].id,
        stripeCurrentPeriodStart: new Date(subscription.current_period_start * 1000),
        stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
        stripeSubscriptionStatus: subscription.status,
        stripeCancelAtPeriodEnd: subscription.cancel_at_period_end,
      }
    );

    console.log("Create subscription result:", result);
    return result;
  } catch (error) {
    console.error("Create subscription error:", error);
    throw error;
  }
}

async function handleUpdate(subscription: Stripe.Subscription) {
  try {
    const serverPlans = getServerSidePricingPlans();
    const priceId = subscription.items.data[0].price.id;
    const tier = Object.values(serverPlans).find(
      plan => plan.stripePriceId === priceId
    );
    const customer = subscription.customer;
    const customerId = typeof customer === "string" ? customer : customer.id;

    if (!tier) {
      throw new Error("Invalid subscription tier");
    }

    const result = await updateUserSubscription(
      eq(userSubscriptions.stripeCustomerId, customerId),
      {
        planType: tier.title,
        stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
        stripeSubscriptionStatus: subscription.status,
        stripeCancelAtPeriodEnd: subscription.cancel_at_period_end
      }
    );

    console.log("Update subscription result:", result);
    return result;
  } catch (error) {
    console.error("Update subscription error:", error);
    throw error;
  }
}

async function handleDelete(subscription: Stripe.Subscription) {
  try {
    const customer = subscription.customer;
    const customerId = typeof customer === "string" ? customer : customer.id;

    const result = await updateUserSubscription(
      eq(userSubscriptions.stripeCustomerId, customerId),
      {
        planType: pricingPlans.Free.title,
        stripeSubscriptionId: null,
        stripeSubscriptionItemId: null,
        stripeCurrentPeriodEnd: null,
        stripeSubscriptionStatus: "canceled",
        stripeCancelAtPeriodEnd: null
      }
    );

    console.log("Delete subscription result:", result);
    return result;
  } catch (error) {
    console.error("Delete subscription error:", error);
    throw error;
  }
}