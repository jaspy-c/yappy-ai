'use client';
import { PricingCardNotLoggedIn } from '@/components/PricingCardNotLoggedIn';
import { pricingPlans } from '@/lib/db/pricingplans';

export const PricingSection = () => {
  return (
    <div className='flex flex-col items-center justify-between text-center'>
      <div className='text-6xl font-bold p-3 tracking-tight text-balance'>
        Simple, Transparent Pricing
      </div>
      <div className='text-xl font-bold text-balance'>
        No credit card required, cancel anytime
      </div>

      <div className='mt-10 grid items-center grid-cols-1 gap-6 max-w-sm lg:grid-cols-3 lg:max-w-screen-md'>
        {Object.values(pricingPlans).map((plan) => (
          <PricingCardNotLoggedIn
            key={plan.title}
            {...plan}
          />
        ))}
      </div>
    </div>
  );
};
