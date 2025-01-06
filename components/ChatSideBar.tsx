import React from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Trash2Icon, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DeleteChatAlertDialogContent } from '@/app/dashboard/_components/DeleteChatAlertDialogContent';
import { AlertDialog, AlertDialogTrigger } from './ui/alert-dialog';
import NewChatComponent from './NewChatComponent';
import HasPermissionCreateChat from '@/components/HasPermissionCreateChat';
import { getChatsCountInternal, getChatsInternal } from '@/lib/db/chats';
import { auth } from '@clerk/nextjs/server';

export const dynamic = 'force-dynamic'

type Props = {
  chatId: string;
};

const ChatSideBar = async ({ chatId }: Props) => {
  
  const { userId, redirectToSignIn } = await auth()
  if (!userId) {
    return redirectToSignIn()
  }
  const chats = await getChatsInternal(userId!)
  const chatsCount = await getChatsCountInternal(userId!)

  return (
    <div className="w-full h-screen p-4 text-gray-200 bg-slate-900 flex flex-col">
      <HasPermissionCreateChat chatsCount={chatsCount} renderFallback={true}>
        <NewChatComponent /> {/* Refresh when a new chat is created */}
      </HasPermissionCreateChat>

      <div className="flex flex-col gap-2 mt-4 flex-grow overflow-y-auto max-h-[70vh]">
        {chats.map((chat) => (
          <div className="flex items-center group" key={chat.id}>
            <div
              className={cn(
                'w-full rounded-lg p-3 text-slate-300 flex items-center justify-between',
                {
                  'bg-blue-600 text-white': chat.id === chatId,
                  'hover:text-white': chat.id !== chatId,
                }
              )}
            >
              <Link
                href={`/dashboard/chat/${chat.id}`}
                className="flex items-center gap-2 flex-grow overflow-hidden"
              >
                <MessageCircle className="w-4 h-4" />
                <p className="overflow-hidden text-sm truncate whitespace-nowrap text-ellipsis">
                  {chat.pdfName || 'Untitled Chat'}
                </p>
              </Link>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Trash2Icon className="w-4 h-4 ml-2 text-red-500 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity" />
                </AlertDialogTrigger>
                <DeleteChatAlertDialogContent
                  id={chat.id}
                />
              </AlertDialog>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-auto">
        <Button className="text-black font-bold hover:bg-blue-600 bg-amber-100 transition-colors" asChild>
          <Link href="/subscriptions">
          Upgrade to Pro
          </Link>
        </Button>
        <div className="flex items-center justify-between gap-2 text-sm text-slate-300 mt-3">
          <Link className="hover:text-white" href="/">
            Home
          </Link>
          <Link className="hover:text-white" href="/#contact-section">
            Support
          </Link>
          <Link className="hover:text-white" href="/subscriptions">
            Manage Subscription
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ChatSideBar;

// 'use client';

// import React, { useState, useEffect } from 'react';
// import { DrizzleChat } from '@/lib/db/schema';
// import { Button } from '@/components/ui/button';
// import Link from 'next/link';
// import { Trash2Icon, MessageCircle } from 'lucide-react';
// import { cn } from '@/lib/utils';
// import { DeleteChatAlertDialogContent } from '@/app/dashboard/_components/DeleteChatAlertDialogContent';
// import { AlertDialog, AlertDialogTrigger } from './ui/alert-dialog';
// import NewChatComponent from './NewChatComponent';
// import HasPermissionCreateChat from '@/components/HasPermissionCreateChat';

// type Props = {
//   chatId: string;
//   userId: string;
// };

// const ChatSideBar = ({ chatId, userId }: Props) => {
//   const [chats, setChats] = useState<DrizzleChat[]>([]);
//   const [chatsCount, setChatsCount] = useState<number | null>(null);

//   // Fetch chats and count from API route
//   useEffect(() => {
//     const fetchChats = async () => {
//       try {
//         const response = await fetch(`/api/get-chats-count?userId=${userId}`);
//         const data = await response.json();
//         console.log(data)
//         if (response.ok) {
//           setChats(data.chats);
//           setChatsCount(data.count);
//         } else {
//           console.error('Error fetching chats:', data.message);
//         }
//       } catch (error) {
//         console.error('Error fetching chats:', error);
//       }
//     };
//     fetchChats();
//   }, [userId]);

//   // Callback to update state after a chat is deleted
//   const handleChatDeleted = async () => {
//     try {
//       const response = await fetch(`/api/get-chats-count?userId=${userId}`);
//       const data = await response.json();
//       if (response.ok) {
//         setChats(data.chats);
//         setChatsCount(data.count);
//       } else {
//         console.error('Error fetching updated chats:', data.message);
//       }
//     } catch (error) {
//       console.error('Error fetching updated chats:', error);
//     }
//   };

//   return (
//     <div className="w-full h-screen p-4 text-gray-200 bg-slate-900 flex flex-col">
//       <HasPermissionCreateChat chatsCount={chatsCount || 0} renderFallback={true}>
//         <NewChatComponent />
//       </HasPermissionCreateChat>

//       <div className="flex flex-col gap-2 mt-4 flex-grow overflow-y-auto max-h-[70vh]">
//         {chats.map((chat) => (
//           <div className="flex items-center group" key={chat.id}>
//             <div
//               className={cn(
//                 'w-full rounded-lg p-3 text-slate-300 flex items-center justify-between',
//                 {
//                   'bg-blue-600 text-white': chat.id === chatId,
//                   'hover:text-white': chat.id !== chatId,
//                 }
//               )}
//             >
//               <Link
//                 href={`/dashboard/chat/${chat.id}`}
//                 className="flex items-center gap-2 flex-grow overflow-hidden"
//               >
//                 <MessageCircle className="w-4 h-4" />
//                 <p className="overflow-hidden text-sm truncate whitespace-nowrap text-ellipsis">
//                   {chat.pdfName || 'Untitled Chat'}
//                 </p>
//               </Link>

//               <AlertDialog>
//                 <AlertDialogTrigger asChild>
//                   <Trash2Icon className="w-4 h-4 ml-2 text-red-500 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity" />
//                 </AlertDialogTrigger>
//                 <DeleteChatAlertDialogContent
//                   id={chat.id}
//                   onChatDeleted={handleChatDeleted} // Pass the callback here
//                 />
//               </AlertDialog>
//             </div>
//           </div>
//         ))}
//       </div>

//       <div className="mt-auto">
//         <Link href="/#pricing-section">
//           <Button className="text-black font-bold hover:bg-blue-600 bg-amber-100 transition-colors">
//             Upgrade to Pro
//           </Button>
//         </Link>
//         <div className="flex items-center justify-between gap-2 text-sm text-slate-300 mt-3">
//           <Link className="hover:text-white" href="/">
//             Home
//           </Link>
//           <Link className="hover:text-white" href="/#contact-section">
//             Support
//           </Link>
//           <Link className="hover:text-white" href="/payments">
//             Manage Subscription
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ChatSideBar;
