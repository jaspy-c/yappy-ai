'use client'

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

type Props = {
  pdf_url: string;
  cacheTime?: number; // Time in minutes to cache the PDF
};

const CACHE_PREFIX = 'pdf-cache-';
const DEFAULT_CACHE_TIME = 60; // 600 minutes default cache time

const PDFViewer = ({ pdf_url, cacheTime = DEFAULT_CACHE_TIME }: Props) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cachedUrl, setCachedUrl] = useState<string | null>(null);

  const MAX_RETRIES = 3;
  const cacheKey = `${CACHE_PREFIX}${pdf_url}`;

  // Use ref to track retry count instead of state
  const retryCountRef = useRef(0);

  // Memoizing the fetchAndCachePDF function
  const fetchAndCachePDF = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Check if Cache API is available
      if ('caches' in window) {
        // Try to get from cache first
        const cache = await caches.open(cacheKey);
        const cachedResponse = await cache.match(pdf_url);

        if (cachedResponse) {
          const blob = await cachedResponse.blob();
          const objectUrl = URL.createObjectURL(blob);
          setCachedUrl(objectUrl);
          setIsLoading(false);
          return;
        }
      }

      // Fetch new if not in cache
      const response = await fetch(pdf_url, {
        headers: {
          'Cache-Control': `max-age=${cacheTime * 60}`, // Convert minutes to seconds
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to load PDF: ${response.statusText}`);
      }

      const blob = await response.blob();
      
      // Cache the response if Cache API is available
      if ('caches' in window) {
        const cache = await caches.open(cacheKey);
        await cache.put(pdf_url, new Response(blob));
      }

      const objectUrl = URL.createObjectURL(blob);
      setCachedUrl(objectUrl);

    } catch (err) {
      if (retryCountRef.current < MAX_RETRIES) {
        retryCountRef.current += 1;
        fetchAndCachePDF(); // Retry the request
      } else {
        setError(err instanceof Error ? err.message : 'Failed to load PDF');
      }
    } finally {
      setIsLoading(false);
    }
  }, [pdf_url, cacheTime]);

  useEffect(() => {
    fetchAndCachePDF();

    return () => {
      // Cleanup object URL when component unmounts
      if (cachedUrl) {
        URL.revokeObjectURL(cachedUrl);
      }
    };
  }, [fetchAndCachePDF]); // Depend only on the fetchAndCachePDF function

  // Memoize the iframe to prevent unnecessary re-renders
  const pdfIframe = useMemo(() => (
    <iframe
      src={cachedUrl || pdf_url}
      className="w-full h-full rounded-lg"
      title="PDF Viewer"
    />
  ), [cachedUrl, pdf_url]);

  if (error) {
    return (
      <Alert variant="destructive" className="h-full flex items-center justify-center">
        <AlertDescription>
          {error}
          <button
            className="underline ml-2 text-blue-500"
            onClick={() => {
              retryCountRef.current = 0; // Reset retry count on retry
              fetchAndCachePDF(); // Retry the request
            }}
          >
            Retry
          </button>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="w-full h-full">
      {isLoading ? (
        <div className="flex items-center justify-center h-full">
          <Loader2 className="w-10 h-10 animate-spin" />
        </div>
      ) : pdfIframe}
    </div>
  );
};

export default PDFViewer;

// 'use client';

// import React, { useState, useEffect } from 'react';
// import { Loader2 } from 'lucide-react';

// type Props = {
//   pdf_url: string;
// };

// const PDFViewer = ({ pdf_url }: Props) => {
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(false);
//   const [retryCount, setRetryCount] = useState(0); // Track retries

//   const MAX_RETRIES = 3;

//   useEffect(() => {
//     const checkPDF = async () => {
//       try {
//         setIsLoading(true);
//         setError(false);

//         const response = await fetch(pdf_url);
//         if (!response.ok) {
//           throw new Error('PDF not found');
//         }
//       } catch (err) {
//         if (retryCount < MAX_RETRIES) {
//           setRetryCount((prevCount) => prevCount + 1);
//         } else {
//           setError(true);
//         }
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     checkPDF();
//   }, [pdf_url, retryCount]); // Retry logic when URL changes or retry is triggered

//   if (error) {
//     return (
//       <div className="flex items-center justify-center h-full text-red-500">
//         Error loading PDF. Please check the URL or{' '}
//         <button
//           className="underline ml-2"
//           onClick={() => setRetryCount(0)} // Reset retries to try again
//         >
//           Retry
//         </button>
//       </div>
//     );
//   }

//   return (
//     <>
//       {isLoading ? (
//         <div className="flex items-center justify-center h-full">
//           <Loader2 className="w-10 h-10 animate-spin" />
//         </div>
//       ) : (
//         <iframe
//           src={pdf_url}
//           className="w-full h-full rounded-lg"
//           title="PDF Viewer"
//         />
//       )}
//     </>
//   );
// };

// export default PDFViewer;
