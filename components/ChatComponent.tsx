'use client'
import React, { useEffect, useRef } from 'react'
import { Input } from './ui/input'
import { useChat } from 'ai/react'
import { Button } from './ui/button'
import { Send, Loader2 } from 'lucide-react'
import MessageList from './MessageList'
import { Message } from 'ai'
import axios from 'axios'
import { useQuery } from '@tanstack/react-query'
import logo from '@/assets/images/yappy-logo-color.svg'
import Image from 'next/image'
import Link from 'next/link'
import { SignedIn, UserButton } from '@clerk/nextjs'
import toast from 'react-hot-toast'

type Props = { chatId: string | null }

const ChatComponent = ({ chatId }: Props) => {
  const messageContainerRef = useRef<HTMLDivElement | null>(null)

  const { data, isLoading } = useQuery({
    queryKey: ['create-message', chatId],
    queryFn: async () => {
      const response = await axios.post<Message[]>('/api/get-messages', { chatId })
      return response.data
    },
    enabled: !!chatId // Only fetch if chatId exists
  })

  const { input, handleInputChange, handleSubmit, messages } = useChat({
    api: '/api/create-message',
    body: {
      chatId
    },
    initialMessages: data || []
  })

  const safeHandleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    
    // Enforce checks to ensure safe form submission
    if (!chatId || isLoading || !input.trim()) {
      toast.error("Invalid submission. Please ensure chat is active and message is not empty.");
      return;
    }
    
    handleSubmit(event); // Call the original handleSubmit function if checks pass
  };

  // Scroll to the bottom of the chat when messages change
  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight
    }
  }, [messages])

  return (
    <div className='flex flex-col h-screen max-w-screen'>
      {/* Header */}
      <div className='p-2 h-[75px] flex-shrink-0 rounded-lg flex items-center'>
        <Link href="/" className='flex items-center'>
          <Image src={logo} alt="Yappy-logo" width={150} height={150} className="cursor-pointer" />
        </Link>
        <div className='flex ml-auto'>
          <SignedIn>
            <UserButton appearance={{
              elements: {
                userButtonAvatarBox: 'w-12 h-12',
              },
            }}/>
          </SignedIn>
        </div>
      </div>

      {/* Chat Area */}
      <div ref={messageContainerRef} className='flex-1 overflow-y-auto shadow-inner py-4 rounded-lg bg-white'>
        {!chatId ? (
          <div className='flex items-center justify-center h-full text-center'>
            <p className='text-gray-500'>Drop a PDF to start a Conversation</p>
          </div>
        ) : (
          <MessageList messages={messages} isLoading={isLoading} />
        )}
      </div>

      {/* Input Form */}
      <form onSubmit={safeHandleSubmit} className='py-4 flex-shrink-0 rounded-lg'>
        <div className='flex'>
          <Input
            value={input}
            onChange={handleInputChange}
            className='w-full bg-white'
            placeholder='Ask any question...'
            disabled={isLoading || !chatId} // Disable if loading or if no chatId
          />
          <Button
            type='submit'
            className='bg-blue-600 ml-2'
            disabled={isLoading || !input.trim() || !chatId} // Disable if loading, input is empty, or if no chatId
          >
            {isLoading ? <Loader2 className='h-4 w-4 animate-spin' /> : <Send className='h-4 w-4' />}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default ChatComponent
