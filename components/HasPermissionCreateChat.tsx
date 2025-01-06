'use client'

import React, { useState, useEffect } from 'react';
import { AwaitedReactNode } from 'react';
import { 
  AlertDialog,
  AlertDialogTrigger 
} from '@/components/ui/alert-dialog';
import { MaxChatAlertDialogContent } from '@/app/dashboard/_components/MaxChatAlertDialogContent';
import { checkPermissionCount } from '@/actions/managePermissions';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

export default function HasPermissionCreateChat({
  chatsCount = 0,
  renderFallback = false,
  children,
}: {
  chatsCount: number
  renderFallback?: boolean;
  children: AwaitedReactNode;
}) {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
  
    const fetchPermission = async () => {
      try {
        const { hasPermission } = await checkPermissionCount(chatsCount);
        if (mounted) {
          setHasPermission(hasPermission ?? null);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error checking permission:', error);
        if (mounted) {
          setHasPermission(false);
          setIsLoading(false);
        }
      }
    };
  
    fetchPermission();
  
    return () => {
      mounted = false;
    };
  }, [chatsCount]); // Add chatsCount here
  

  // Always render the button during loading if renderFallback is true
  if (isLoading && renderFallback) {
    return (
      <div className='flex border-white border rounded-md flex-col items-center justify-center cursor-not-allowed'>
        <Button className='w-full' disabled>
          <PlusCircle className='w-4 h-4 mr-2' />
          New Chat
        </Button>
      </div>
    );
  }

  // Show spinner only if we're loading and not showing the fallback
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (hasPermission) {
    return <>{children}</>;
  }

  if (renderFallback) {
    return (
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogTrigger asChild>
          <div className='flex border-white border rounded-md flex-col items-center justify-center cursor-pointer'>
            <Button className='w-full'>
              <PlusCircle className='w-4 h-4 mr-2' />
              New Chat
            </Button>
          </div>
        </AlertDialogTrigger>
        <MaxChatAlertDialogContent />
      </AlertDialog>
    );
  }

  return null;
}