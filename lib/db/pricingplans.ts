// pricingplans.ts

export type TierNames = keyof typeof pricingPlans;
export type PaidTierNames = Exclude<TierNames, "Free">

export type PricingPlan = {
  title: string;
  price: number;
  period: string | null;
  description: string;
  isPopular: boolean;
  features: string[];
  url: string;
  maxChatLimit: number;
  stripePriceId?: string | null // Make optional since it will be populated server-side
};

// Function to generate subscription URLs
const generateUrl = (title: string): string => {
  return `/subscriptions/subscribe?plan=${encodeURIComponent(title)}`;
};

// Client-side pricing plans without stripe IDs
export const pricingPlans: Record<string, PricingPlan> = {
  Free: {
    title: 'Free',
    price: 0,
    period: null,
    description: 'Free plan for personal use. No credit card required.',
    isPopular: false,
    features: ['3 Chats', 'Priority Support'],
    url: '/dashboard',
    maxChatLimit: 3
  },
  Basic: {
    title: 'Basic',
    price: 7,
    period: 'month',
    description: 'Basic plan for unlimited chats. Includes priority support.',
    isPopular: true,
    features: ['Unlimited Chats', 'Priority Support'],
    url: generateUrl('Basic'),
    maxChatLimit: Infinity
  },
  Pro: {
    title: 'Pro',
    price: 50,
    period: 'year',
    description: 'Pro plan for more savings. Includes priority support.',
    isPopular: false,
    features: ['Unlimited Chats', 'Priority Support'],
    url: generateUrl('Pro'),
    maxChatLimit: Infinity
  }
}