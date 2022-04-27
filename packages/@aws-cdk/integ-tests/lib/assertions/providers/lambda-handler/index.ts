import { AssertionHandler } from './assertion';
import { ResultsCollectionHandler } from './results';
import { SdkHandler } from './sdk';
import * as types from './types';

export async function handler(event: AWSLambda.CloudFormationCustomResourceEvent, context: AWSLambda.Context) {
  const provider = createResourceHandler(event, context);
  await provider.handle();
}

function createResourceHandler(event: AWSLambda.CloudFormationCustomResourceEvent, context: AWSLambda.Context) {
  if (event.ResourceType.startsWith(types.SDK_RESOURCE_TYPE_PREFIX)) {
    return new SdkHandler(event, context);
  }
  switch (event.ResourceType) {
    case types.ASSERT_RESOURCE_TYPE: return new AssertionHandler(event, context);
    case types.RESULTS_RESOURCE_TYPE: return new ResultsCollectionHandler(event, context);
    default:
      throw new Error(`Unsupported resource type "${event.ResourceType}`);
  }
}
