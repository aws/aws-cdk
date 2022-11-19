/* eslint-disable no-console */
// @ts-ignore
import { S3 } from '@aws-sdk/client-s3'; // eslint-disable-line import/no-extraneous-dependencies, import/no-unresolved
import delay from 'delay';

const s3 = new S3();

export async function handler() {
  console.log(s3);
  await delay(5);
}
