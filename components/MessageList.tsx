import React from 'react'
import { Message } from 'ai/react'
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

type Props = {
  messages: Message[]
  isLoading: boolean
}

function MessageList({messages, isLoading}: Props) {
  if (isLoading) {
    return (
    <div className='flex justify-center items-center h-full'>
      <Loader2 className='w-10 h-10 animate-spin' />
    </div>)
  }
  if (!messages) return <></>
  return (
    <div className='flex flex-col gap-2 px-4'>
      {messages.map(message => {
        return (
          <div key={message.id} className={cn('flex' , 
            {'justify-end': message.role === 'user',
             'justify-start': message.role === 'system'
            })}>
              <div className={cn(
                'rounded-lg px-3 text-sm py-1 shadow-md ring-1 ring-gray-900/20 mt-2',
                {
                  'bg-blue-600 text-white': message.role  === 'user',
                  'bg-gray-50 text-black': message.role  ===  'system'
                }
                )}>  
                <p>{message.content}</p>
              </div>

        
          </div>
        )
        })}

    </div>
  )
}

export default MessageList