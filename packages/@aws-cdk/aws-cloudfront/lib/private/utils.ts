import { Stack } from '@aws-cdk/core';
import { Construct } from 'constructs';

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
