'use server'

import { auth } from "@clerk/nextjs/server"
import { getMessagesFromChat as getMessagesFromChatDb } from "@/lib/db/messages";


export async function getMessagesFromChat(chatId:string){
  const { userId} = await auth()
  const errorMessage = "There was an error retrieving the messages"
  if (userId == null) {
    return { error: true, message: errorMessage }
  }
  const messages = await getMessagesFromChatDb(chatId)
  return {messages}
}
