import { IDistribution } from '..';
import * as iam from '../../../aws-iam';
import { Stack } from '../../../core';

/**
 * Format distribution ARN from stack and distribution ID.
 */
export function formatDistributionArn(dist: IDistribution) {
  return Stack.of(dist).formatArn({
    service: 'cloudfront',
    region: '',
    resource: 'distribution',
    resourceName: dist.distributionId,
  });
}

/**
 * Adds an IAM policy statement associated with this distribution to an IAM
 * principal's policy.
 */
export function grant(dist: IDistribution, grantee: iam.IGrantable, ...actions: string[]): iam.Grant {
  // cloudfront:List* can only use wildcard
  // https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/security_iam_service-with-iam.html#security_iam_service-with-iam-id-based-policies-resources
  const listActions = [];
  const otherActions = [];
  let listGrant: iam.Grant;
  let otherGrant: iam.Grant;

  for (const action of actions) {
    if (action.includes('cloudfront:List')) {
      listActions.push(action);
    } else {
      otherActions.push(action);
    }
  }

  if (listActions.length > 0) {
    listGrant = iam.Grant.addToPrincipal({
      grantee,
      actions: listActions,
      resourceArns: ['*'],
    });
  }

  if (otherActions.length > 0) {
    otherGrant = iam.Grant.addToPrincipal({
      grantee,
      actions: otherActions,
      resourceArns: [formatDistributionArn(dist)],
    });
  }

  if (listActions.length > 0 && otherActions.length > 0) {
    return otherGrant!.combine(listGrant!);
  }

  return listActions.length > 0 ? listGrant! : otherGrant!;
}
