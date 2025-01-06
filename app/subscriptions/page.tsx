import { auth } from '@clerk/nextjs/server'
import { pricingPlans } from '@/lib/db/pricingplans'
import { ManageSubscription } from './ManageSubscription'
import PageHeader from '@/components/PageHeader'
import { PricingCard } from '@/components/PricingCard'
import { getUserSubscription, getUserSubscriptionTier } from '@/lib/db/subscriptions'

const SubscriptionPage = async () => {
  const {userId, redirectToSignIn} = await auth()
  if (userId == null) { 
    return redirectToSignIn() 
  }
  const tier = await getUserSubscriptionTier(userId)
  const subscription = await getUserSubscription(userId)

  return (
    <>
      <PageHeader />
      <div className='grid w-full min-h-screen items-center justify-center p-4 border rounded-md bg-gradient-to-r from-amber-100 to-fuchsia-100'>
        <div className='max-w-screen-md'>
          <div className='flex flex-col bg-white shadow-lg rounded p-8 mt-20'>
            <h1 className='text-3xl mb-3 font-bold'>Subscription Details</h1>
            <p className='mb-2 text-lg font-semibold'>Current Plan: {tier.title}</p>
            
            {tier.title !== 'Free' && (
              <>
                <p className='mb-2 text-lg'>
                  Subscription Start Period: {subscription?.stripeCurrentPeriodStart 
                    ? new Date(subscription.stripeCurrentPeriodStart).toLocaleDateString() 
                    : 'N/A'}
                </p>
                <p className='mb-2 text-lg'>
                  Subscription End Period: {subscription?.stripeCurrentPeriodEnd 
                    ? new Date(subscription.stripeCurrentPeriodEnd).toLocaleDateString() 
                    : 'N/A'}
                </p>

                <p className='mb-2 text-lg'>
                    Auto-Renew: {subscription?.stripeCancelAtPeriodEnd 
                      ? (
                        <>
                          Off <span className="text-red-500">(Current Plan Valid until Subscription End Period)</span>
                        </>
                      ) 
                      : 'On'}
                  </p>
              </>
            )}

            <ManageSubscription tier={tier}/>
          </div>
          <div className='mt-10 grid items-center grid-cols-1 gap-6 lg:grid-cols-3'>
              {
                Object.values(pricingPlans).map(plan => (
                  <PricingCard key={plan.title} currentTierName={tier.title} currentPeriodEnd={subscription?.stripeCurrentPeriodEnd || null} // Pass current period end
                  cancelAtPeriodEnd={subscription?.stripeCancelAtPeriodEnd || undefined}{...plan} />
                ))
              }

          </div>
        </div>
      </div>
    </>
  );
};

export default SubscriptionPage;
