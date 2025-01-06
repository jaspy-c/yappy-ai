// pricingplans.server.ts
import { env } from '@/data/server'
import { pricingPlans } from './pricingplans'
import type { PricingPlan } from './pricingplans'

// Server-side only function to get plans with Stripe IDs
export function getServerSidePricingPlans(): Record<string, PricingPlan> {
  return {
    ...pricingPlans,
    Basic: {
      ...pricingPlans.Basic,
      stripePriceId: env.STRIPE_BASIC_PLAN_STRIPE_PRICE_ID
    },
    Pro: {
      ...pricingPlans.Pro,
      stripePriceId: env.STRIPE_PRO_PLAN_STRIPE_PRICE_ID
    }
  }
}

export function getTierByPriceId(stripePriceId: string) {
  const plansWithStripeIds = getServerSidePricingPlans()
  return Object.values(plansWithStripeIds).find(
    tier => tier.stripePriceId === stripePriceId
  )
}