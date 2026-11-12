import type { IConstruct } from 'constructs';
import type { CfnDeliverySource } from 'aws-cdk-lib/aws-logs';
import { ConstructReflection } from 'aws-cdk-lib/core/lib/helpers-internal';

export function tryFindDeliverySourceForResource(source: IConstruct, sourceArn: string, logType: string): CfnDeliverySource | undefined {
  return ConstructReflection.of(source).findRelatedCfnResource({
    cfnResourceType: 'AWS::Logs::DeliverySource',
    matches: (candidate) => (candidate as CfnDeliverySource).resourceArn === sourceArn && (candidate as CfnDeliverySource).logType === logType,
  }) as CfnDeliverySource | undefined;
}
