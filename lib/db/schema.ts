import { pgTable, pgEnum, text, timestamp, boolean, uuid, index } from 'drizzle-orm/pg-core';
import { pricingPlans, TierNames } from '@/lib/db/pricingplans';

export const userSystemEnum = pgEnum('user_system_enum', ['user', 'system']);
export const planTypeEnum = pgEnum('plan_type', Object.keys(pricingPlans) as [TierNames]);

const createdAt = timestamp("created_at", { withTimezone: true })
  .notNull()
  .defaultNow()
const updatedAt = timestamp("updated_at", { withTimezone: true })
  .notNull()
  .defaultNow()
  .$onUpdate(() => new Date())

export const chats = pgTable('chats', {
  id: uuid('id').primaryKey().defaultRandom(),
  pdfName: text('pdf_name').notNull(),
  pdfUrl: text('pdf_url').notNull(),
  clerkUserId: text('clerk_user_id').notNull(),
  fileKey: text('file_key').notNull(),
  createdAt,
  updatedAt,
});

export type DrizzleChat = typeof chats.$inferSelect;

export const messages = pgTable('messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  chatId: uuid('chat_id')
    .references(() => chats.id, { onDelete: 'cascade' }) // Cascade delete messages if chat is deleted
    .notNull(),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  role: userSystemEnum('role').notNull(),
});

export const userSubscriptions = pgTable('user_subscriptions', {
  id: uuid('id').primaryKey().defaultRandom(),
  clerkUserId: text('clerk_user_id').notNull().unique(),
  stripeCustomerId: text('stripe_customer_id'),
  stripeSubscriptionId: text('stripe_subscription_id'),
  planType: planTypeEnum('plan_type').notNull().default('Free'),
  stripeSubscriptionItemId: text('stripe_subscription_item_id'),
  stripeSubscriptionStatus: text('stripe_subscription_status'),
  stripeCurrentPeriodStart: timestamp('stripe_current_period_start'),
  stripeCurrentPeriodEnd: timestamp('stripe_current_period_end'),
  stripeCancelAtPeriodEnd: boolean('stripe_cancel_at_period_end'),
  createdAt,
  updatedAt,
},
table => ({
  clerkUserIdIndex: index('user_subscriptions.clerk_user_id_index').on(
    table.clerkUserId
  ),
  stripeCustomerIdIndex: index(
    'user_subscriptions.stripe_customer_id_index'
  ).on(table.stripeCustomerId),
})
);

