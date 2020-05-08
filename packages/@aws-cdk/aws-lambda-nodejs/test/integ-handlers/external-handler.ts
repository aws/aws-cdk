import { S3 } from 'aws-sdk'; // eslint-disable-line import/no-extraneous-dependencies

const s3 = new S3({});

export async function handler(): Promise<void> {
  console.log(s3); // tslint:disable-line no-console
}
