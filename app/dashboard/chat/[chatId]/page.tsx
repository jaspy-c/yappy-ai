import React from 'react'
import ChatSideBar from '@/components/ChatSideBar'
import PDFViewer from '@/components/PDFViewer'
import ChatComponent from '@/components/ChatComponent'
import { getChatsInternal } from  '@/lib/db/chats'
import { redirect } from 'next/navigation'
import { auth } from '@clerk/nextjs/server'

export const dynamic = 'force-dynamic'

type Props = {
  params:{
    chatId: string
  }
}

const ChatPage = async ({params: {chatId}}: Props) => {
  const {userId, redirectToSignIn} = await auth()
  if (userId == null) { 
    return redirectToSignIn() 
  }

  const _chats = await getChatsInternal(userId);

  if (!_chats) {
    redirect('/dashboard');  // Uncomment if you prefer client-side redirect
  } 

  const currentChat = _chats.find((chat) => chat.id === chatId)
  if (!currentChat) {
    redirect('/dashboard');  // Uncomment if you prefer client-side redirect
  } 


  return (
    <div className='flex w-full h-full hide-scrollbar bg-gradient-to-r from-amber-100 to-fuchsia-100'>
      <div className='flex w-full h-full overflow-auto'>
        <div className= 'flex-[2] max-w-xs'>
          <ChatSideBar chatId={chatId} />
        </div>
        <div className='max-h-screen p-4 flex-[5] overflow-auto'>
          <PDFViewer pdf_url={currentChat?.pdfUrl || ''}  />
        </div>
        <div className='flex-[2] border-1-4 border-1-slate-200 overflow-auto pl-2 pr-6'>
          <ChatComponent chatId={chatId}  />
        </div>
      </div>
    </div>
  )
}

export default ChatPage