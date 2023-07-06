// eslint-disable-next-line import/no-extraneous-dependencies
import { IsCompleteResponse } from 'aws-cdk-lib/custom-resources/lib/provider-framework/types';
// @aws-sdk/* modules available at runtime for lambdas >= Node18
// eslint-disable-next-line import/no-extraneous-dependencies
import { Amplify } from '@aws-sdk/client-amplify';
import { S3 } from '@aws-sdk/client-s3';
import { ResourceEvent } from './common';
import { AmplifyAssetDeploymentHandler } from './handler';

const AMPLIFY_ASSET_DEPLOYMENT_RESOURCE_TYPE = 'Custom::AmplifyAssetDeployment';

const sdkConfig = { logger: console };
const amplify = new Amplify(sdkConfig);
const s3 = new S3(sdkConfig);

export async function onEvent(event: ResourceEvent) {
  const provider = createResourceHandler(event);
  return provider.onEvent();
}

export async function isComplete(
  event: ResourceEvent,
): Promise<IsCompleteResponse> {
  const provider = createResourceHandler(event);
  return provider.isComplete();
}

function createResourceHandler(event: ResourceEvent) {
  switch (event.ResourceType) {
    case AMPLIFY_ASSET_DEPLOYMENT_RESOURCE_TYPE:
      return new AmplifyAssetDeploymentHandler(amplify, s3, event);
    default:
      throw new Error(`Unsupported resource type "${event.ResourceType}"`);
  }
}
