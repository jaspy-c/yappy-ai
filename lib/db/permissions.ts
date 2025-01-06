import { getChatsCountInternal } from "./chats"
import { getMaxChatLimit} from "./subscriptions"

export async function canCreateChatsUnlimited(userId: string | null) {
  if (userId == null) 
    return false

  const maxChatLimit = await getMaxChatLimit(userId)
  const chatCount = await getChatsCountInternal(userId)
  
  return chatCount < maxChatLimit
}