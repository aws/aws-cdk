/* eslint-disable no-console */
import { S3Client } from '@aws-sdk/client-s3';

const s3 = new S3Client({});

export async function handler() {
  console.log(s3);
}
