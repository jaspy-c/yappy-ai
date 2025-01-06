import { S3Client, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { env } from '@/data/client';

const s3Client = new S3Client({
  region: env.NEXT_PUBLIC_S3_REGION,
  credentials: {
    accessKeyId: env.NEXT_PUBLIC_S3_ACCESS_KEY_ID!,
    secretAccessKey: env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY!,
  },
});

export async function getPresignedUploadUrl(fileName: string) {
  const file_key = `uploads/${Date.now().toString()}-${fileName.replaceAll(' ', '-')}`;
  
  const command = new PutObjectCommand({
    Bucket: env.NEXT_PUBLIC_S3_BUCKET_NAME,
    Key: file_key,
  });

  const presignedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
  
  return {
    presignedUrl,
    file_key,
  };
}

export async function getPresignedDownloadUrl(file_key: string) {
  const command = new GetObjectCommand({
    Bucket: env.NEXT_PUBLIC_S3_BUCKET_NAME,
    Key: file_key,
  });

  return await getSignedUrl(s3Client, command, { expiresIn: 3600 });
}

export async function uploadToS3(file: File) {
  const res = await fetch('/api/s3/upload', {
    method: 'POST',
    body: JSON.stringify({ fileName: file.name }),
  });
  const { presignedUrl, file_key } = await res.json();

  await fetch(presignedUrl, {
    method: 'PUT',
    body: file,
    headers: { 'Content-Type': file.type },
  });

  return { file_key, file_name: file.name };
}

// client-side function to fetch presigned URL
export async function getS3Url(file_key: string) {
  // Use absolute URL if necessary (e.g., for local or production environments)
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || ''; // Ensure you define this environment variable for full URLs
  const url = `${baseUrl}/api/s3/download?file_key=${file_key}`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('Failed to fetch presigned URL');
  }

  const { presignedUrl } = await res.json();
  return presignedUrl;
}
