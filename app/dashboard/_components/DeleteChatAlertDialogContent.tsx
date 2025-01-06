'use client';

import { deleteChat } from "@/actions/manageChats";
import {
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { useTransition } from "react";
import { toast } from "react-hot-toast";

type DeleteChatAlertDialogContentProps = {
  id: string;
};

export function DeleteChatAlertDialogContent({
  id
}: DeleteChatAlertDialogContentProps) {
  const [isDeletePending, startDeleteTransition] = useTransition();

  const handleDelete = () => {
    startDeleteTransition(async () => {
      try {
        const data = await deleteChat(id);
        if (data.message && !data.error) {
          toast.success(data.message || 'Chat deleted successfully!');
          window.location.reload()
        } else {
          toast.error(data.message || 'An unknown error occurred');
        }
      } catch (error) {
        console.error('Delete chat error:', error);
        toast.error('Failed to delete chat. Please try again.');
      }
    });
  };

  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
        <AlertDialogDescription>
          This action cannot be undone. This will permanently delete this chat.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction onClick={handleDelete} disabled={isDeletePending}>
          {isDeletePending ? 'Deleting...' : 'Delete'}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
}