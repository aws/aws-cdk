import * as ecs from '@aws-cdk/aws-ecs';
import * as route53 from '@aws-cdk/aws-route53';
import * as cdk from '@aws-cdk/core';
import { Service } from '../../service';
import { ServiceExtension, ServiceBuild, EnvironmentCapacityType } from '../extension-interfaces';
import { TaskRecordManager } from './task-record-manager';

export interface AssignPublicIpExtensionOptions {
  /**
   * DNS Zone to expose expose a record to. If specified, `dnsRecordName` is
   * required.
   */
  dnsZone?: route53.IHostedZone;

  /**
   * Name of the record to add to the zone and in which to add the task IP
   * addresses to. If specified, `dnsZone` is required.
   *
   * @example 'myservice'
   */
  dnsRecordName?: string;
}

/**
 * Modifies the service to assign a public to each task.
 */
export class AssignPublicIpExtension extends ServiceExtension {
  dnsRecordName?: string;
  dnsZone?: route53.IHostedZone;

  constructor(options?: AssignPublicIpExtensionOptions) {
    super('public-ip');

    if ((options?.dnsZone || options?.dnsRecordName) && !(options?.dnsZone && options?.dnsRecordName)) {
      throw new Error('Both `dnsZone` and `dnsRecordName` must be set or neither');
    }

    this.dnsZone = options?.dnsZone;
    this.dnsRecordName = options?.dnsRecordName;
  }

  private hasDns() {
    return Boolean(this.dnsZone);
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

  public useService(service: ecs.Ec2Service | ecs.FargateService) {
    if (this.hasDns()) {
      new TaskRecordManager(service, 'TaskRecordManager', {
        cluster: service.cluster,
        service: service,
        dnsZone: this.dnsZone!,
        dnsRecordName: this.dnsRecordName!,
      });
    }
  }
}
