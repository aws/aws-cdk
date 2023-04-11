/* eslint-disable no-console */
import { S3 } from 'aws-sdk'; // eslint-disable-line import/no-extraneous-dependencies
import delay from 'delay';

const s3 = new S3();

export async function handler() {
  console.log(s3);
  await delay(5);
}
