import db from "@/lib/db/index"
import { chats, userSubscriptions} from "@/lib/db/schema"
import { CACHE_TAGS, revalidateDbCache } from "@/lib/cache"
import { eq } from "drizzle-orm"

export async function deleteUser(clerkUserId: string) {
  const [userSubscription, products] = await db.batch([
    db
      .delete(userSubscriptions)
      .where(eq(userSubscriptions.clerkUserId, clerkUserId))
      .returning({
        id: userSubscriptions.id,
      }),
    db
      .delete(chats)
      .where(eq(chats.clerkUserId, clerkUserId))
      .returning({
        id: chats.id,
      }),
  ])

  userSubscription.forEach(sub => {
    revalidateDbCache({
      tag: CACHE_TAGS.subscription,
      id: sub.id,
      userId: clerkUserId,
    })
  })

  products.forEach(chat => {
    revalidateDbCache({
      tag: CACHE_TAGS.chats,
      id: chat.id,
      userId: clerkUserId,
    })
  })

  return [userSubscription, products]
}