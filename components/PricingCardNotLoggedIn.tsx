'use client'
import { Check } from 'lucide-react';
import { pricingPlans } from '@/lib/db/pricingplans';
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';

export type PricingPlan = typeof pricingPlans[keyof typeof pricingPlans];

export function PricingCardNotLoggedIn ({ title, price, description, features, period, isPopular }: PricingPlan) {

  const router = useRouter()

  // Find the specific plans by name for savings calculation
  const basicPlan = pricingPlans.Basic;
  const proPlan = pricingPlans.Pro;

  // Calculate savings percentage if both monthly and yearly plans are available
  let savingsPercentage: number | null = null;
  if (basicPlan && proPlan) {
    const yearlyEquivalent = basicPlan.price * 12;
    savingsPercentage = Math.round(((yearlyEquivalent - proPlan.price) / yearlyEquivalent) * 100);
  }

  return (
    <div className='border flex flex-col bg-white/80 justify-between rounded-lg h-full p-6 hover:shadow-md hover:bg-white text-left relative transition-colors duration-300'>
      {isPopular && (
        <div className='absolute top-0 right-0 bg-slate-900 text-white px-2 py-1 rounded-bl-lg rounded-tr-lg'> Popular </div>
      )}
      {title === 'Pro' && savingsPercentage !== null && (
        <div className='absolute top-0 right-0 bg-slate-900 text-white px-2 py-1 rounded-bl-lg rounded-tr-lg'> Save {savingsPercentage}% </div>
      )}
      <div>
        <div className='inline-flex items-end'>
          <h1 className='font-extrabold text-3xl'>${price}</h1>
          {period && <h3 className='ml-2 font-semibold text-gray-700'> / {period}</h3>}
        </div>

        <h2 className='font-bold text-xl my-2'>{title}</h2>
        <p>{description}</p>
        <div className='flex-grow border-t border-gray-400 opacity-25 my-4'></div>
        <ul>
          {features.map((feature, index) => (
            <li key={index} className='flex flex-row items-center text-gray-700 gap-2 my-2'>
              <div className='rounded-full flex items-center justify-center w-4 h-4 bg-green-500 mr-3'>
                <Check className='text-white' width={10} height={10} />
              </div>
              <p>{feature}</p>
            </li>
          ))}
        </ul>
      </div>
      <Button
      className="w-full mt-2 hover:bg-blue-700"
      onClick={() => {
        router.push('/subscriptions'); // Client-side navigation
      }}
    >
      {title === 'Free' ? 'Get Started' : 'Select Plan'}
      </Button>
    </div>
  );
};
