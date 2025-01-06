import { PlusCircle } from 'lucide-react'
import React from 'react'
import { Button } from './ui/button'

type Props = {
  disabled?: boolean; // Add disabled as an optional prop
}

const NewChatButton = ({ disabled = false }: Props) => {
  return (
    <div className={`flex bg-white rounded-md flex-col items-center justify-center ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
      <Button className='w-full' disabled={disabled}>
        <PlusCircle className='w-4 h-4 mr-2' />
        New Chat
      </Button>
    </div>
  )
}

export default NewChatButton;
