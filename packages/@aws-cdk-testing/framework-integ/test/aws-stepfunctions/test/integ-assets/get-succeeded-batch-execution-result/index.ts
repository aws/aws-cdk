/* eslint-disable no-console */

import {
  S3Client,
  ListObjectsV2Command,
  GetObjectCommand,
} from '@aws-sdk/client-s3';

const client = new S3Client({});

type ResultObject ={
  ExecutionArn: string;
  Input: string;
  InputDetails: { Included: boolean };
  Name: string;
  Output: string;
  OutputDetails: { Included: boolean };
  RedriveCount: number;
  RedriveStatus: string;
  RedriveStatusReason: string;
  StartDate: string;
  StateMachineArn: string;
  Status: string;
  StopDate: string;
};

export async function handler(event: { bucket: string; prefix: string }) {
  console.log('handling event', event);

  console.log('getting key for results writer succeeded file');
  const listObjectsCommandOutput = await client.send(new ListObjectsV2Command({
    Bucket: event.bucket,
    Prefix: event.prefix,
  }));

  if (!listObjectsCommandOutput.Contents) {
    throw new Error('No objects found');
  }

  const succeedKey = listObjectsCommandOutput.Contents.find((object) => object?.Key?.endsWith('SUCCEEDED_0.json'));

  if (!succeedKey) {
    throw new Error('No SUCCEEDED_0.json found');
  }
  console.log('found key', succeedKey.Key);

  console.log('getting object');
  const object = await client.send(new GetObjectCommand({
    Bucket: event.bucket,
    Key: succeedKey.Key,
  }));

  if (!object?.Body) {
    throw new Error('No object body found');
  }

  const body: ResultObject[] = JSON.parse(await object.Body.transformToString());
  console.log('got succeeded object body', body);

  return JSON.parse(body[0].Input);
}
