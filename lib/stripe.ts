import { env } from '@/data/server'
import Stripe from 'stripe'

export const stripe = new Stripe(env.STRIPE_SECRET_KEY || '', {
  typescript: true,
  apiVersion: '2024-11-20.acacia'
  }
)