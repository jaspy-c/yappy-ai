'use client'
import { Button } from '@/components/ui/button'
import { createCustomerPortalSession } from '@/actions/stripe';
import { PricingPlan } from '@/lib/db/pricingplans';

type Props = {
  tier: PricingPlan;
};

export const ManageSubscription = ({tier}: Props) => {
  return (
  (tier.title == 'Free'  ? <></> :
    <Button onClick={() => createCustomerPortalSession()}>
      Manage Subscription
    </Button>
  ))
}
