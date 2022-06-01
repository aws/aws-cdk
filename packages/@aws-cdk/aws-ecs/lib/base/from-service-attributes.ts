import { ArnFormat, Resource, Stack } from '@aws-cdk/core';
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
   * @default - either this, or {@link serviceName}, is required
   */
  readonly serviceArn?: string;

  /**
   * The name of the service.
   *
   * @default - either this, or {@link serviceArn}, is required
   */
  readonly serviceName?: string;
}

export function fromServiceAttributes(scope: Construct, id: string, attrs: ServiceAttributes): IBaseService {
  if ((attrs.serviceArn && attrs.serviceName) || (!attrs.serviceArn && !attrs.serviceName)) {
    throw new Error('You can only specify either serviceArn or serviceName.');
  }

  const stack = Stack.of(scope);
  let name: string;
  let arn: string;
  if (attrs.serviceName) {
    name = attrs.serviceName as string;
    arn = stack.formatArn({
      partition: stack.partition,
      service: 'ecs',
      region: stack.region,
      account: stack.account,
      resource: 'service',
      resourceName: name,
    });
  } else {
    arn = attrs.serviceArn as string;
    name = stack.splitArn(arn, ArnFormat.SLASH_RESOURCE_NAME).resourceName as string;
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
