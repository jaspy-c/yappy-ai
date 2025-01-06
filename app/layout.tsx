// layout.tsx
import { ClerkProvider } from '@clerk/nextjs';
import './globals.css';
import Providers from '@/components/Providers';
import { Toaster } from 'react-hot-toast';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider dynamic>
        <Providers>
          <html lang="en">
            <body>
              {children}
              <Toaster />
            </body>
          </html>
        </Providers>
    </ClerkProvider>
  );
}
