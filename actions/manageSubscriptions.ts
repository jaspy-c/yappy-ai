'use server'

import db from '@/lib/db'
import { userSubscriptions } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { env as serverEnv } from "@/data/server"
import { TierNames } from '@/lib/db/pricingplans'

export async function createSubscription({ stripeCustomerId, priceId } : { stripeCustomerId: string, priceId: string }) {
  let planType: TierNames ='Free'

  if (priceId === serverEnv.STRIPE_BASIC_PLAN_STRIPE_PRICE_ID) {
    planType = 'Basic'
  } else if (priceId === serverEnv.STRIPE_PRO_PLAN_STRIPE_PRICE_ID) {
    planType = 'Pro'
  }

  await db.update(userSubscriptions).set({
    planType: planType
  }).where(eq(userSubscriptions.stripeCustomerId, stripeCustomerId))
}

export async function cancelSubscription({ stripeCustomerId } : { stripeCustomerId: string }) {
  await db.update(userSubscriptions).set({
    planType: 'Free'
  }).where(eq(userSubscriptions.stripeCustomerId, stripeCustomerId))
}

export async function getSubscriptionType({ userId } : {userId:string}) {
  const userSubscription = await db.query.userSubscriptions.findFirst({
    where: eq(userSubscriptions.clerkUserId, userId)
  })
  return userSubscription?.planType
}