import * as ecs from '@aws-cdk/aws-ecs';
import * as route53 from '@aws-cdk/aws-route53';
import * as cdk from '@aws-cdk/core';
import { Service } from '../../service';
import { ServiceExtension, ServiceBuild, EnvironmentCapacityType } from '../extension-interfaces';
import { TaskRecordManager } from './task-record-manager';

export interface AssignPublicIpExtensionOptions {

  dns?: AssignPublicIpDnsOptions;
}

export interface AssignPublicIpDnsOptions {
  /**
   * A DNS Zone to expose task IPs in.
   */
  zone: route53.IHostedZone;

  /**
   * Name of the record to add to the zone and in which to add the task IP
   * addresses to.
   *
   * @example 'myservice'
   */
  recordName: string;
}

/**
 * Modifies the service to assign a public to each task.
 */
export class AssignPublicIpExtension extends ServiceExtension {
  dns?: AssignPublicIpDnsOptions;

  constructor(options?: AssignPublicIpExtensionOptions) {
    super('public-ip');

    this.dns = options?.dns;
  }

  private hasDns() {
    return Boolean(this.dns);
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
        dnsZone: this.dns!.zone,
        dnsRecordName: this.dns!.recordName,
      });
    }
  }
}
