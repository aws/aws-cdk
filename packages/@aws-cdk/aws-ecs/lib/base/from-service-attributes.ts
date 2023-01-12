import { ArnFormat, FeatureFlags, Fn, Resource, Stack, Token } from '@aws-cdk/core';
import { ECS_ARN_FORMAT_INCLUDES_CLUSTER_NAME } from '@aws-cdk/cx-api';
import { Construct } from 'constructs';
import { IBaseService } from '../base/base-service';
import { ICluster } from '../cluster';

/**
 * The properties to import from the service.
 */
export interface ServiceAttributes {
  /**
   * The cluster that hosts the service.
   */
  readonly cluster: ICluster;

  /**
   * The service ARN.
   *
   * @default - either this, or `serviceName`, is required
   */
  readonly serviceArn?: string;

  /**
   * The name of the service.
   *
   * @default - either this, or `serviceArn`, is required
   */
  readonly serviceName?: string;
}

export function fromServiceAttributes(scope: Construct, id: string, attrs: ServiceAttributes): IBaseService {
  if ((attrs.serviceArn && attrs.serviceName) || (!attrs.serviceArn && !attrs.serviceName)) {
    throw new Error('You can only specify either serviceArn or serviceName.');
  }

  const newArnFormat = FeatureFlags.of(scope).isEnabled(ECS_ARN_FORMAT_INCLUDES_CLUSTER_NAME);

  const stack = Stack.of(scope);
  let name: string;
  let arn: string;
  if (attrs.serviceName) {
    name = attrs.serviceName as string;
    const resourceName = newArnFormat ? `${attrs.cluster.clusterName}/${attrs.serviceName}` : attrs.serviceName as string;
    arn = stack.formatArn({
      partition: stack.partition,
      service: 'ecs',
      region: stack.region,
      account: stack.account,
      resource: 'service',
      resourceName,
    });
  } else {
    arn = attrs.serviceArn as string;
    name = extractServiceNameFromArn(scope, arn);
  }
  class Import extends Resource implements IBaseService {
    public readonly serviceArn = arn;
    public readonly serviceName = name;
    public readonly cluster = attrs.cluster;
  }
  return new Import(scope, id, {
    environmentFromArn: arn,
  });
}

export function extractServiceNameFromArn(scope: Construct, arn: string): string {
  const newArnFormat = FeatureFlags.of(scope).isEnabled(ECS_ARN_FORMAT_INCLUDES_CLUSTER_NAME);
  const stack = Stack.of(scope);

  if (Token.isUnresolved(arn)) {
    if (newArnFormat) {
      const components = Fn.split(':', arn);
      const lastComponents = Fn.split('/', Fn.select(5, components));
      return Fn.select(2, lastComponents);
    } else {
      return stack.splitArn(arn, ArnFormat.SLASH_RESOURCE_NAME).resourceName as string;
    }
  } else {
    const resourceName = stack.splitArn(arn, ArnFormat.SLASH_RESOURCE_NAME).resourceName as string;
    const resourceNameSplit = resourceName.split('/');
    return resourceNameSplit.length === 1 ? resourceName : resourceNameSplit[1];
  }
}
