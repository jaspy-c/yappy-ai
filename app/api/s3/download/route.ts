// Example: /app/api/s3/download/route.ts
import { NextResponse } from 'next/server';
import { getPresignedDownloadUrl } from '@/lib/s3';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const file_key = searchParams.get('file_key');
    if (!file_key) throw new Error('No file key provided');
    
    const presignedUrl = await getPresignedDownloadUrl(file_key);
    return NextResponse.json({ presignedUrl });
  } catch {
    return NextResponse.json({ error: 'Failed to get download URL' }, { status: 500 });
  }
}
