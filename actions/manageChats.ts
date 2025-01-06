'use server'

import { auth } from "@clerk/nextjs/server"
import { getChats as getChatsDb} from "@/lib/db/chats"
// import { getChat as getChatDb} from "@/lib/db/chats"
import { deleteChat as deleteChatDb } from "@/lib/db/chats";
import { createChat as createChatDb } from "@/lib/db/chats";
import { chats } from "@/lib/db/schema";

export async function getChats(userId:string) {
  // const { userId } = await auth()
  // const errorMessage = "There was an error retrieving the chats"
  // if (userId == null) {
  //   return { error: true, message: errorMessage }
  // }
  const _chats = await getChatsDb(userId)
  // const currentChat = _chats.find(chat => chat.id === chatId)
 
  // if (!currentChat) {
  //   return { _chats, error: true };
  // }

  return {_chats}
}

// export async function getChat(id:string) {
//   const { userId } = auth()
//   const errorMessage = "There was an error retrieving the chat"
//   if (userId == null) {
//     return { error: true, message: errorMessage }
//   }
//   const _chat = await getChatDb({ userId, id})
//   return {_chat}
// }

// export async function createChat(data: typeof chats.$inferInsert) {
//   const { userId } = auth()
//   if ( userId == null) {
//     return { error: true, message: "There was an error creating your chat" }
//   }

//   const newChat = await createChatDb({...data, clerkUserId: userId })
//   return newChat

// }

export async function deleteChat(chatId:string) {
  const { userId } = await auth()
  const errorMessage = "There was an error deleting the chat"
  
  if (userId == null || !chatId) {
    return { error: true, message: errorMessage }
  }

  const isSuccess = await deleteChatDb({ chatId, userId })

  return { 
    error: !isSuccess,
    message: isSuccess ? "Chat deleted successfully!" : errorMessage }
}
