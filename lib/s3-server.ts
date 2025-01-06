import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { writeFileSync } from 'fs';
import { join } from 'path';
import os from 'os';
import { env } from '@/data/client';
import fetch from 'node-fetch';

const s3Client = new S3Client({
  region: env.NEXT_PUBLIC_S3_REGION,
  credentials: {
    accessKeyId: env.NEXT_PUBLIC_S3_ACCESS_KEY_ID!,
    secretAccessKey: env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY!,
  },
});

export async function downloadFromS3(file_key: string) {
  try {
    const command = new GetObjectCommand({
      Bucket: env.NEXT_PUBLIC_S3_BUCKET_NAME,
      Key: file_key,
    });

    const presignedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    const response = await fetch(presignedUrl);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const tempDir = os.tmpdir();
    const file_name = join(tempDir, `pdf-${Date.now()}.pdf`);
    writeFileSync(file_name, buffer);
    
    return file_name;
  } catch (error) {
    console.error('Error in downloadFromS3:', error);
    throw new Error('Failed to download from S3');
  }
}