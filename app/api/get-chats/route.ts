import db from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { desc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export const runtime = 'edge';

export async function POST() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Retrieve chats from the database
    const _chats = await db
      .select()
      .from(chats)
      .where(eq(chats.clerkUserId, userId))
      .orderBy(desc(chats.createdAt));

    // Return empty array if no chats are found
    if (!_chats.length) {
      return NextResponse.json([], { status: 200 });
    }

    // Return the retrieved chats
    return NextResponse.json(_chats);

  } catch (error) {
    console.error("Error fetching chats:", error);
    return NextResponse.json({ error: 'Unable to fetch chats at the moment' }, { status: 500 });
  }
}
