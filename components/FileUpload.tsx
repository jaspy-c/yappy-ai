'use client'
import { Inbox, Loader2 } from 'lucide-react'
import React from 'react'
import { useDropzone } from 'react-dropzone'
import { toast } from 'react-hot-toast'
import { uploadToS3 } from '@/lib/s3'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import axios from 'axios'

const FileUpload = () => {
  const router = useRouter()
  const [uploading, setUploading] = React.useState(false)
  const { mutate, isPending } = useMutation({
    mutationFn: async ({
      file_key,
      file_name,
    }: {
      file_key: string,
      file_name: string
    }) => {
      try {
        const response = await axios.post('/api/create-chat', {
          file_key,
          file_name,
        })
        return response.data
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error('Axios error:', error.response?.data)
          console.error('Status:', error.response?.status)
          console.error('Headers:', error.response?.headers)
          throw new Error(`Failed to create chat: ${error.response?.data?.message || error.message}`)
        } else {
          console.error('Unexpected error:', error)
          throw new Error('An unexpected error occurred while creating the chat')
        }
      }
    },
    onError: (error: Error) => {
      console.error('Mutation error:', error)
      toast.error(error.message || 'Error creating chat. Please try again.')
    }
  })

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'application/pdf': ['.pdf']
    },
    noKeyboard: true,
    maxFiles: 1,
    onDrop: async (acceptedFiles) => {
      console.log(acceptedFiles)
      const file = acceptedFiles[0]
      if (file.size > 10 * 1024 * 1024) {
        toast('File size is too big')
        return
      }
      try {
        setUploading(true)
        const data = await uploadToS3(file)
        if (!data?.file_key || !data?.file_name) {
          throw new Error('Invalid response from S3 upload')
        }
        console.log('File uploaded to S3:', data)
        mutate(data, {
          onSuccess: ({ chat_id }: { chat_id: string }) => {
            console.log('Chat created successfully:', chat_id)
            toast.success("Chat created successfully")
            router.push(`/dashboard/chat/${chat_id}`)
          }
        })
      } catch (error) {
        console.error('Error in file upload process:', error)
        toast.error('Error uploading file. Please try again.')
      } finally {
        setUploading(false)
      }
    }
  })

  return (
    <div className='flex bg-white/70 rounded-md p-2 h-full w-full hover:bg-white transition-colors duration-300'>
      <div
        {...getRootProps()}
        className={`flex w-full h-full border-dashed border-2 border-gray-300 rounded-md p-4 flex-col items-center justify-center cursor-pointer ${
          uploading || isPending ? 'pointer-events-none opacity-50' : ''
        }`}
      >
        <input {...getInputProps()} disabled={uploading || isPending} />
        {uploading || isPending ? (
          <>
            <Loader2 className='w-10 h-10 text-blue-500 animate-spin' />
            <p className='text-blue-500'>Uploading...</p>
          </>
        ) : (
          <>
            <Inbox className='w-10 h-10 text-gray-500' />
            <p className='text-gray-500'>Drop a PDF file here or click to select a file</p>
          </>
        )}
      </div>

    </div>
  )
}

export default FileUpload
