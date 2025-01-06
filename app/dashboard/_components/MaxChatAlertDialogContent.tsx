// MaxChatAlertDialogContent.tsx
'use client';

import { 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogAction 
} from "@/components/ui/alert-dialog";
import { redirect } from "next/navigation";
import { useTransition } from "react";

export function MaxChatAlertDialogContent() {
  const [isUpgradePending, startUpgradeTransition] = useTransition();

  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>
          You have reached the maximum number of chats available for your current plan.
        </AlertDialogTitle>
        <AlertDialogDescription>
          Upgrade your account to create more chats.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction
          onClick={() => {
            startUpgradeTransition(() => {
              redirect('/#pricing-section'); // Redirect to pricing section directly
            });
          }}
          disabled={isUpgradePending}
        >
          Upgrade
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
}
