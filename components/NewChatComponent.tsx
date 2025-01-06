'use client';
import { Loader2, PlusCircle } from 'lucide-react';
import React from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'react-hot-toast';
import { uploadToS3 } from '@/lib/s3';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Button } from '@/components/ui/button';

// type Props = {
//   onChatCreated: () => void; // Callback for parent to refresh chats
// };

const NewChatComponent = () => {
  const router = useRouter();
  const [uploading, setUploading] = React.useState(false);

  const { mutate, isPending } = useMutation({
    mutationFn: async ({
      file_key,
      file_name,
    }: {
      file_key: string;
      file_name: string;
    }) => {
      try {
        const response = await axios.post('/api/create-chat', {
          file_key,
          file_name,
        });
        return response.data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error('Axios error:', error.response?.data);
          throw new Error(`Failed to create chat: ${error.response?.data?.message || error.message}`);
        } else {
          console.error('Unexpected error:', error);
          throw new Error('An unexpected error occurred while creating the chat');
        }
      }
    },
    onError: (error: Error) => {
      console.error('Mutation error:', error);
      toast.error(error.message || 'Error creating chat. Please try again.');
    },
  });

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
    },
    noKeyboard: true,
    maxFiles: 1,
    onDrop: async (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File size is too big');
        return;
      }

      try {
        setUploading(true);
        const data = await uploadToS3(file);
        if (!data?.file_key || !data?.file_name) {
          throw new Error('Invalid response from S3 upload');
        }

        mutate(data, {
          onSuccess: ({ chat_id }: { chat_id: string }) => {
            toast.success('Chat created successfully');
            router.push(`/dashboard/chat/${chat_id}`);
            router.refresh();
            // onChatCreated(); // Trigger parent refresh
          },
        });
      } catch (error) {
        console.error('Error in file upload process:', error);
        toast.error('Error uploading file. Please try again.');
      } finally {
        setUploading(false);
      }
    },
  });

  return (
    <div
      {...getRootProps()}
      className={`flex border-white border rounded-md flex-col items-center justify-center cursor-pointer hover:bg-slate-400 ${
        uploading || isPending ? 'pointer-events-none opacity-50' : ''
      }`}
    >
      <input {...getInputProps()} disabled={uploading || isPending} />
      {uploading || isPending ? (
        <Loader2 className="w-8 h-8 text-white animate-spin" />
      ) : (
        <Button className="w-full">
          <PlusCircle className="w-4 h-4 mr-2" />
          New Chat
        </Button>
      )}
    </div>
  );
};

export default NewChatComponent;
