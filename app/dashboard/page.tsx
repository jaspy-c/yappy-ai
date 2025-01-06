import React from 'react'
import ChatSideBar from '@/components/ChatSideBar'
import ChatComponent from '@/components/ChatComponent'
import { auth } from '@clerk/nextjs/server'

export const dynamic = 'force-dynamic'

type Props = {
  params: {
    chatId: string
  }
}

const ChatPage = async ({ params: { chatId } }: Props) => {
  const {userId, redirectToSignIn} = await auth()
  if (userId == null) { 
    return redirectToSignIn() 
  }
  
  return (
    <div className='flex w-full h-full hide-scrollbar bg-gradient-to-r from-amber-100 to-fuchsia-100'>
      <div className='flex w-full h-full overflow-auto'>
        <div className='flex-[2] max-w-xs'>
          <ChatSideBar chatId={chatId}/>
        </div>
        <div className='flex-[5] max-h-screen p-4 overflow-auto'>
          {/* <ClientFileUploadWrapper /> */}
        </div>
        <div className='flex-[2] border-1-4 border-1-slate-200 overflow-auto pl-2 pr-6'>
          <ChatComponent chatId={chatId} />
        </div>
      </div>
    </div>
  )
}

export default ChatPage
