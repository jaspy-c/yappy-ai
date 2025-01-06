import { pricingPlans } from "@/lib/db/pricingplans";
import { CACHE_TAGS, dbCache, getUserTag, revalidateDbCache } from "../cache"
import db from "./index";
import { userSubscriptions } from "./schema";
import { SQL } from "drizzle-orm";

export async function createUserSubscription(
  data: typeof userSubscriptions.$inferInsert
) {
  const [newSubscription] = await db
    .insert(userSubscriptions)
    .values(data)
    .onConflictDoNothing({
      target: userSubscriptions.clerkUserId,
    })
    .returning({
      id: userSubscriptions.id,
      userId: userSubscriptions.clerkUserId,
    })

  if (newSubscription != null) {
    revalidateDbCache({
      tag: CACHE_TAGS.subscription,
      id: newSubscription.id,
      userId: newSubscription.userId,
    })
  }

  return newSubscription
}

export function getUserSubscription(userId:string) {
  const cacheFn = dbCache(getUserSubscriptionInternal, {
    tags: [getUserTag(userId, CACHE_TAGS.subscription)],
  })
  return cacheFn(userId)
}

export async function updateUserSubscription(
  where: SQL,
  data: Partial<typeof userSubscriptions.$inferInsert>
) {
  const [updatedSubscription] = await db
    .update(userSubscriptions)
    .set(data)
    .where(where)
    .returning({
      id: userSubscriptions.id,
      userId: userSubscriptions.clerkUserId,
    })

  if (updatedSubscription != null) {
    revalidateDbCache({
      tag: CACHE_TAGS.subscription,
      userId: updatedSubscription.userId,
      id: updatedSubscription.id,
    })
  }
}

export async function getUserSubscriptionTier(userId: string) {
  const subscription = await getUserSubscription(userId);
  if (subscription === null || subscription === undefined)
    throw new Error(`User has no subscription`);

  return pricingPlans[subscription.planType]

}

export function getUserSubscriptionInternal(userId:string) {
  return db.query.userSubscriptions.findFirst({
    where: ({ clerkUserId }, {eq}) => eq(clerkUserId, userId)
  })
}

export async function getMaxChatLimit(userId: string): Promise<number> {
  const tier = await getUserSubscriptionTier(userId)
  return tier.maxChatLimit ?? Infinity
}