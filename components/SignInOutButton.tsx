// SignInOutButton.tsx
'use client'; // Ensure this is a client component

import {
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { LogIn } from 'lucide-react';
import Link from "next/link";

const SignInOutButton = () => {
  return (
    <div className='flex items-center justify-center gap-3'>
      <SignedOut>
        <Link href="/sign-in">
          <Button>
            <LogIn className="mr-2" />
            Sign In
          </Button>
        </Link>
        <Link href="/sign-up">
          <Button className='bg-blue-600 hover:bg-blue-700'>
            Get Started
          </Button>
        </Link>
      </SignedOut>

      <SignedIn>
        <UserButton appearance={{
          elements: {
            userButtonAvatarBox: 'w-12 h-12',
          },
        }}/>
      </SignedIn>
    </div>
  );
};

export default SignInOutButton;
