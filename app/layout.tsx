// layout.tsx
import { ClerkProvider } from '@clerk/nextjs';
import './globals.css';
import Providers from '@/components/Providers';
import { Toaster } from 'react-hot-toast';

export const metadata = {
  title: "Yappy AI | PDF Chatbot Analyzer",
  description: "AI Chatbot PDF Analyzer", // Optional
  icons: {
    icon: "/favicon.ico", // Path to your favicon file
  },
};

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
