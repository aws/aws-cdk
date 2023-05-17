/* eslint-disable no-console */
// @ts-ignore
import { S3Client } from '@aws-sdk/client-s3'; // eslint-disable-line import/no-extraneous-dependencies, import/no-unresolved

const s3 = new S3Client();

export async function handler() {
  console.log(s3);
}
