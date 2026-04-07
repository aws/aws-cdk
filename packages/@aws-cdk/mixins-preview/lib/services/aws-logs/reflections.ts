import type { IConstruct } from 'constructs';
import type { CfnDeliverySource } from 'aws-cdk-lib/aws-logs';
import { findClosestRelatedResource } from 'aws-cdk-lib/core/lib/helpers-internal';

export function tryFindDeliverySourceForResource(source: IConstruct, sourceArn: string, logType: string): CfnDeliverySource | undefined {
  return findClosestRelatedResource<IConstruct, CfnDeliverySource>(
    source,
    'AWS::Logs::DeliverySource',
    (_, deliverySource) => deliverySource.resourceArn === sourceArn && deliverySource.logType === logType,
  );
}
