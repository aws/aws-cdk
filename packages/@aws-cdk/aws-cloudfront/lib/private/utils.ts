import { Stack } from '@aws-cdk/core';
import { IDistribution } from '..';

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
