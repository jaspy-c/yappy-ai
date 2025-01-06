import { NextResponse } from 'next/server'
import { loadS3IntoPinecone } from '@/lib/pinecone'
import { getS3Url } from '@/lib/s3'
import { auth } from '@clerk/nextjs/server'
import { createChat } from '@/lib/db/chats'

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) {
    return new NextResponse('Unauthorized', {status: 401})
  }
  
  try {
    const body = await req.json()
    const { file_key, file_name } = body

    await loadS3IntoPinecone(file_key)

    const pdfUrl = await getS3Url(file_key)

    const newChat = await createChat({
      fileKey: file_key,
      pdfName: file_name,
      pdfUrl,
      clerkUserId: userId
    })

    return NextResponse.json(
      {
        chat_id: newChat.insertedId,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error(error)
    return NextResponse.json( {error:'Error creating chat'}, { status: 500 })
  }
}