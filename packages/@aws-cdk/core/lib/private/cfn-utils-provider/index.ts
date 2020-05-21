import { CfnUtilsResourceType } from './consts';

/**
 * Parses the value of "Value" and reflects it back as attribute.
 */
export async function handler(event: AWSLambda.CloudFormationCustomResourceEvent) {

  // dispatch based on resource type
  if (event.ResourceType === CfnUtilsResourceType.CFN_JSON) {
    return cfnJsonHandler(event);
  }

  throw new Error(`unexpected resource type "${event.ResourceType}`);
}

function cfnJsonHandler(event: AWSLambda.CloudFormationCustomResourceEvent) {
  return {
    Data: {
      Value: JSON.parse(event.ResourceProperties.Value),
    },
  };
}
