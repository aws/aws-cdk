import * as cdk from '@aws-cdk/core';

/**
 * Given an opaque (token) ARN, returns a CloudFormation expression that extracts the fleet
 * identifier from the ARN.
 *
 * Fleet ARNs look like this:
 *
 *   arn:aws:gamelift:region:account-id:fleet/fleet-identifier
 *
 * ..which means that in order to extract the `fleet-identifier` component from the ARN, we can
 * split the ARN using ":" and select the component in index 5 then split using "/" and select the component in index 1.
 *
 * @returns the fleet identifier from his ARN
 */
function extractIdFromArn(arn: string) {
  const splitValue = cdk.Fn.select(5, cdk.Fn.split(':', arn));
  return cdk.Fn.select(1, cdk.Fn.split('/', splitValue));
}