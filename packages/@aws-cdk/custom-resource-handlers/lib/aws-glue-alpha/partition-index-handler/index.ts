/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies*/
import {
  IsCompleteRequest,
  OnEventRequest,
  OnEventResponse,
  IsCompleteResponse,
} from 'aws-cdk-lib/custom-resources/lib/provider-framework/types';

export async function onEventHandler(event: OnEventRequest): Promise<OnEventResponse> {
  console.log(`Event: ${JSON.stringify({ ...event, ResponseURL: '...' })}`);
}

export async function isCompleteHandler(event: IsCompleteRequest): Promise<IsCompleteResponse> {
  console.log(`Event: ${JSON.stringify({ ...event, ResponseURL: '...' })}`);
}
