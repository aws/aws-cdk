/* eslint-disable no-console */
// eslint-disable-next-line import/no-extraneous-dependencies
import { ApiCall } from '@aws-cdk/sdk-v2-to-v3-adapter';

interface AwsApiInput {
  readonly service: string;
  readonly action: string;
  readonly parameters?: {
    [param: string]: any,
  };
  readonly apiVersion?: string;
  readonly catchErrorPattern?: string;
}

export async function handler(event: AwsApiInput) {
  console.log('Event: %j', { ...event, ResponseURL: '...' });

  const apiCall = new ApiCall(event.service, event.action);
  console.log(`AWS SDK V3: ${apiCall.v3PackageName}`);

  try {
    const response = await apiCall.invoke({
      parameters: event.parameters ?? {},
      apiVersion: event.apiVersion,
    });

    delete response.$metadata;
    console.log('Response: %j', response);
  } catch (error: any) {
    console.log(error);
    if (!event.catchErrorPattern || !new RegExp(event.catchErrorPattern).test(error.name)) {
      throw error;
    }
  }
}
