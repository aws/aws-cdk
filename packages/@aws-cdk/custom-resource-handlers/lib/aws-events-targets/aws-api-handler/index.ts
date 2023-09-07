/* eslint-disable no-console */
// eslint-disable-next-line import/no-extraneous-dependencies
import { getV3Client, getV3Command, loadV3ClientPackage } from '@aws-cdk/sdk-v2-to-v3-adapter';

interface AwsApiInput {
  readonly service: string;
  readonly action: string;
  readonly parameters?: any;
  readonly apiVersion?: string;
  readonly catchErrorPattern?: string;
}

export async function handler(event: AwsApiInput) {
  console.log('Event: %j', { ...event, ResponseURL: '...' });

  const awsSdk = loadV3ClientPackage(event.service);
  console.log(`AWS SDK V3: ${awsSdk.packageName}@${awsSdk.packageVersion}`);

  const client = getV3Client(awsSdk, { apiVersion: event.apiVersion });
  const Command = getV3Command(awsSdk, event.action);
  const commandInput = event.parameters ?? {};

  try {
    const response = await client.send(new Command(commandInput));
    delete response.$metadata;
    console.log('Response: %j', response);
  } catch (error: any) {
    console.log(error);
    if (!event.catchErrorPattern || !new RegExp(event.catchErrorPattern).test(error.name)) {
      throw error;
    }
  }
}
