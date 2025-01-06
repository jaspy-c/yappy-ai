// app/api/s3/upload/route.ts
import { NextResponse } from 'next/server';
import { getPresignedUploadUrl } from '@/lib/s3';

export async function POST(req: Request) {
  try {
    const { fileName } = await req.json();
    const { presignedUrl, file_key } = await getPresignedUploadUrl(fileName);
    return NextResponse.json({ presignedUrl, file_key });
  } catch {
    return NextResponse.json({ error: 'Failed to get upload URL' }, { status: 500 });
  }
}