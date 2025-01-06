// PageHeader.tsx
'use client'; // Ensure this is a client component

import Image from 'next/image';
import logo from '@/assets/images/yappy-logo-color.svg';
import SignInOutButton from './SignInOutButton';
import NavLinks from './NavLinks';
import Link from 'next/link';
import { useAuth } from '@clerk/nextjs';
import { usePathname } from 'next/navigation'; // Use this hook

const PageHeader = () => {
  const { isSignedIn } = useAuth();
  const pathname = usePathname(); // Get the current pathname

  // Determine if we are on the home page
  const isHomePage = pathname === '/';

  return (
    <header className="fixed left-0 top-0 z-50 w-full bg-white/95 backdrop-blur-md shadow-md">
      <div className="flex w-full max-w-screen-xl px-2 lg:px-20 md:px-10 mx-auto items-center justify-between">
        {/* Logo */}
        <div className="flex items-center sm:flex-shrink-0 p-6">
          <Link href="/" className="flex items-center">
            <Image src={logo} alt="Yappy-logo" width={150} height={150} className="cursor-pointer" />
          </Link>
        </div>

        {/* Centered links */}
          <NavLinks showNavLinks={isHomePage} /> {/* Pass the prop here */}

        {/* Sign in/out buttons and dashboard */}
        <div className="flex items-center flex-shrink-0 justify-end gap-6">
          {isSignedIn && (
            <Link href="/dashboard" className="hover:text-blue-500">
              <div className="font-bold">Dashboard</div>
            </Link>
          )}
          <SignInOutButton />
        </div>
      </div>
    </header>
  );
};

export default PageHeader;
