import db from "@/lib/db/index";
import { chats } from "./schema";
import { and, count, desc, eq } from "drizzle-orm";
import { deleteVectorsfromPinecone } from "@/lib/pinecone";
import { CACHE_TAGS, dbCache, getUserTag, revalidateDbCache } from "../cache";
import { revalidatePath } from "next/cache";

export function getChats(userId:string) {
  const cacheFn = dbCache(getChatsInternal, {
    tags: [getUserTag(userId, CACHE_TAGS.chats)]
    })

    return cacheFn(userId)
}

export function getChatsCount( userId:string ) {
  const cacheFn = dbCache(getChatsCountInternal, {
    tags: [getUserTag(userId, CACHE_TAGS.counts)]
    })

    return cacheFn(userId)
}


export async function createChat(data: typeof chats.$inferInsert) {
  const [newChat] = await db
    .insert(chats)
    .values(data)
    .returning({
      insertedId: chats.id,
      userId: chats.clerkUserId
    })

  await Promise.all([    
  revalidateDbCache({
    tag: CACHE_TAGS.chats,
    userId: newChat.userId,
  }),
  revalidateDbCache({
    tag: CACHE_TAGS.counts,
    userId: newChat.userId,
  })])

  revalidatePath('/dashboard')
  // console.log(newChat.insertedId)
  revalidatePath(`/dashboard/chat/${newChat.insertedId}`)

  return newChat;
}

// chats.ts
export async function deleteChat({ chatId, userId }: { chatId: string, userId: string }) {
  // First, retrieve the fileKey for the chat record
  const chat = await db
    .select({ fileKey: chats.fileKey })
    .from(chats)
    .where(and(eq(chats.id, chatId), eq(chats.clerkUserId, userId)))
    .limit(1);

  if (chat.length === 0) {
    return false;
  }

  const fileKey = chat[0].fileKey;

  // Delete the chat record (cascade will handle messages deletion)
  const { rowCount } = await db
    .delete(chats)
    .where(and(eq(chats.id, chatId), eq(chats.clerkUserId, userId)));

  if (rowCount > 0) {
    await deleteVectorsfromPinecone(fileKey);
    // await Promise.all([
    //   revalidateDbCache({
    //       tag: CACHE_TAGS.chats,
    //       userId,
    //   }),
    //   revalidateDbCache({
    //       tag: CACHE_TAGS.counts,
    //       userId,
    //   })]);
  }

  revalidatePath('/dashboard')

  return rowCount > 0;
}

export function getChatInternal({ id, userId }: { id: string, userId: string }) {
  return db.query.chats.findFirst({
    where: ({ clerkUserId, id: idCol }, { eq, and }) =>
      and(eq( clerkUserId, userId), eq(idCol, id)),
  })
}

export function getChatsInternal(userId: string) {
  return db
    .select()
    .from(chats)
    .where(eq(chats.clerkUserId, userId))
    .orderBy(desc(chats.createdAt))
}

export async function getChatsCountInternal(userId:string){
  const counts = await db
  .select({ chatsCount: count() })
  .from(chats)
  .where(eq(chats.clerkUserId, userId))

  return counts[0]?.chatsCount ?? 0
}