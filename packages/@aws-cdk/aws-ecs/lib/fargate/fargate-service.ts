import ec2 = require('@aws-cdk/aws-ec2');
import cloudmap = require('@aws-cdk/aws-servicediscovery');
import cdk = require('@aws-cdk/cdk');
import { BaseService, BaseServiceProps, ServiceDiscoveryOptions } from '../base/base-service';
import { TaskDefinition } from '../base/task-definition';
import { isFargateCompatible } from '../util';

/**
 * Properties to define a Fargate service
 */
export interface FargateServiceProps extends BaseServiceProps {
  /**
   * Cluster where service will be deployed
   */
  readonly cluster: ICluster; // should be required? do we assume 'default' exists?

  /**
   * Task Definition used for running tasks in the service
   */
  readonly taskDefinition: TaskDefinition;

  /**
   * Assign public IP addresses to each task
   *
   * @default false
   */
  readonly assignPublicIp?: boolean;

  /**
   * In what subnets to place the task's ENIs
   *
   * @default Private subnet if assignPublicIp, public subnets otherwise
   */
  readonly vpcSubnets?: ec2.SubnetSelection;

  /**
   * Existing security group to use for the tasks
   *
   * @default A new security group is created
   */
  readonly securityGroup?: ec2.ISecurityGroup;

  /**
   * Fargate platform version to run this service on
   *
   * Unless you have specific compatibility requirements, you don't need to
   * specify this.
   *
   * @default Latest
   */
  readonly platformVersion?: FargatePlatformVersion;
}

/**
 * Start a service on an ECS cluster
 */
export class FargateService extends BaseService {
  constructor(scope: cdk.Construct, id: string, props: FargateServiceProps) {
    if (!isFargateCompatible(props.taskDefinition.compatibility)) {
      throw new Error('Supplied TaskDefinition is not configured for compatibility with Fargate');
    }

    super(scope, id, {
      ...props,
      desiredCount: props.desiredCount !== undefined ? props.desiredCount : 1,
    }, {
      cluster: props.cluster.clusterName,
      taskDefinition: props.taskDefinition.taskDefinitionArn,
      launchType: 'FARGATE',
      platformVersion: props.platformVersion,
    }, props.cluster.clusterName, props.taskDefinition);

    this.configureAwsVpcNetworking(props.cluster.vpc, props.assignPublicIp, props.vpcSubnets, props.securityGroup);

    if (!props.taskDefinition.defaultContainer) {
      throw new Error('A TaskDefinition must have at least one essential container');
    }
  }

  public enableServiceDiscovery(options: ServiceDiscoveryOptions): cloudmap.Service {
    const sdNamespace = this.cluster.serviceDiscoveryNamespace();
    if (sdNamespace === undefined) {
      throw new Error("Cannot enable service discovery if a Cloudmap Namespace has not been created in the cluster.");
    }

    const dnsRecordType = options.dnsRecordType === undefined
     ? cloudmap.DnsRecordType.A : options.dnsRecordType;

    // If the task definition that your service task specifies uses the awsvpc network mode and a type SRV DNS record
    // is used, you must specify a containerName and containerPort combination
    const containerName = dnsRecordType === cloudmap.DnsRecordType.SRV ? this.taskDefinition.defaultContainer!.node.id : undefined;
    const containerPort = dnsRecordType === cloudmap.DnsRecordType.SRV ? this.taskDefinition.defaultContainer!.containerPort : undefined;

    const cloudmapService = new cloudmap.Service(this, 'CloudmapService', {
      namespace: sdNamespace,
      name: options.name,
      dnsRecordType: dnsRecordType!,
      customHealthCheck: { failureThreshold: options.failureThreshold || 1 }
    });

    const serviceArn = cloudmapService.serviceArn;

    // add Cloudmap service to the ECS Service's serviceRegistry
    this.addServiceRegistry({
      arn: serviceArn,
      containerName,
      containerPort
    });

    return cloudmapService;
  }
}

/**
 * Fargate platform version
 *
 * @see https://docs.aws.amazon.com/AmazonECS/latest/developerguide/platform_versions.html
 */
export enum FargatePlatformVersion {
  /**
   * The latest, recommended platform version
   */
  Latest = 'LATEST',

  /**
   * Version 1.3.0
   *
   * Supports secrets, task recycling.
   */
  Version1_3 = '1.3.0',

  /**
   * Version 1.2.0
   *
   * Supports private registries.
   */
  Version1_2 = '1.2.0',

  /**
   * Version 1.1.0
   *
   * Supports task metadata, health checks, service discovery.
   */
  Version1_1 = '1.1.0',

  /**
   * Initial release
   *
   * Based on Amazon Linux 2017.09.
   */
  Version1_0 = '1.0.0',
}
