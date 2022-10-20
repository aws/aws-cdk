import * as iam from '@aws-cdk/aws-iam';
import { Stack } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { IDistribution } from '..';

/**
 * Format distribution ARN from stack and distribution ID.
 */
export function formatDistributionArn(scope: Construct, distributionId: string) {
  return Stack.of(scope).formatArn({
    service: 'cloudfront',
    region: '',
    resource: 'distribution',
    resourceName: distributionId,
  });
}

export function grantCreateInvalidation(distribution: IDistribution, grantee: iam.IGrantable) {
  return iam.Grant.addToPrincipal({
    grantee,
    actions: ['cloudfront:CreateInvalidation'],
    resourceArns: [distribution.distributionArn],
  });
}
