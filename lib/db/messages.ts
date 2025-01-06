import db from "@/lib/db/index";
import { messages } from "./schema";
import { eq } from "drizzle-orm";
import { CACHE_TAGS, dbCache, getIdTag } from "../cache";

export function getMessagesFromChat(chatId: string) {
  const cacheFn = dbCache(getMessagesFromChatInternal, {
    tags: [getIdTag(chatId, CACHE_TAGS.messages)],
  });

  return cacheFn(chatId);
}

export async function createMessage(data: typeof messages.$inferInsert) {
  const [newMessage] = await db
    .insert(messages)
    .values(data)
    .returning({
      insertedId: messages.id,
      chatId: messages.chatId,
    });

    // revalidateDbCache({
    //   tag: CACHE_TAGS.messages,
    //   chatId: newMessage.chatId,
    //   messageId: newMessage.insertedId,
    // });
    
    // revalidatePath(`/dashboard/chat/${newMessage.chatId}`)
  return newMessage;
}

// Internal function to fetch messages directly from the database

async function getMessagesFromChatInternal(chatId: string) {
  const messagesFromDb = await db
    .select()
    .from(messages)
    .where(eq(messages.chatId, chatId))
    .orderBy(messages.createdAt);

  console.log("Messages fetched directly from the database:", messagesFromDb);
  return messagesFromDb;
}

// function getMessagesFromChatInternal(chatId:number) {
//   return db.query.messages.findMany({
//     where: eq(messages.chatId, chatId),
//     orderBy: [asc(messages.createdAt)],
//   })
// }

