// app/dashboard/_components/HasPermission.tsx

'use server';

import { auth } from "@clerk/nextjs/server";
import { getMaxChatLimit } from "@/lib/db/subscriptions";

export async function checkPermissionCount(chatsCount:number) {
  const { userId } = await auth();
  const errorMessage = "Something went wrong";
  if (userId == null) {
    return { error: true, message: errorMessage }
  }

  const maxChatLimit = await getMaxChatLimit(userId)
  return { hasPermission : (chatsCount < maxChatLimit)}
}
