// eslint-disable-next-line import/no-extraneous-dependencies
import { IsCompleteResponse } from '@aws-cdk/custom-resources/lib/provider-framework/types';
// aws-sdk available at runtime for lambdas
// eslint-disable-next-line import/no-extraneous-dependencies
import { Amplify, S3, config } from 'aws-sdk';
import { ResourceEvent } from './common';
import { AmplifyAssetDeploymentHandler } from './handler';

const AMPLIFY_ASSET_DEPLOYMENT_RESOURCE_TYPE = 'Custom::AmplifyAssetDeployment';

config.logger = console;

const amplify = new Amplify();
const s3 = new S3({ signatureVersion: 'v4' });

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
