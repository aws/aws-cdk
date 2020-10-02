import * as cdk from '@aws-cdk/core';
import { Service } from '../service';
import { ServiceExtension, ServiceBuild, EnvironmentCapacityType } from './extension-interfaces';

/**
 * Modifies the service to assign a public to each task.
 */
export class AssignPublicIpExtension extends ServiceExtension {
  constructor() {
    super('public-ip');
  }

  public prehook(service: Service, _scope: cdk.Construct) {
    if (service.capacityType != EnvironmentCapacityType.FARGATE) {
      throw new Error('AssignPublicIp only supports Fargate tasks');
    }
  }

  public modifyServiceProps(props: ServiceBuild) {
    return {
      ...props,
      assignPublicIp: true,
    } as ServiceBuild;
  }
}
