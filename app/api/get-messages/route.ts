import db from "@/lib/db";
import { messages } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export const runtime = 'edge'

export async function POST(req: Request) {
  const {userId} = await auth()
  if (!userId) {
    return NextResponse.json({error: 'Unauthorized'}, {status: 401})
  }
  try {
    const { chatId } = await req.json();

    // Ensure chatId is valid
    if (!chatId) {
      return NextResponse.json({ error: "chatId is required" }, { status: 400 });
    }

    // Retrieve messages from the database
    const _messages = await db
      .select()
      .from(messages)
      .where(eq(messages.chatId, chatId));

    if (_messages == undefined || _messages.length === 0) {
      return NextResponse.json([], { status: 200 }) // Return empty array instead of 404
    }
    

    // Return the retrieved messages
    return NextResponse.json(_messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
};
