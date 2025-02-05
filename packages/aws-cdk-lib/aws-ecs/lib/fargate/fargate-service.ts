import { Construct } from 'constructs';
import * as ec2 from '../../../aws-ec2';
import * as elb from '../../../aws-elasticloadbalancing';
import * as cdk from '../../../core';
import { addConstructMetadata } from '../../../core/lib/metadata-resource';
import { AvailabilityZoneRebalancing } from '../availability-zone-rebalancing';
import { BaseService, BaseServiceOptions, DeploymentControllerType, IBaseService, IService, LaunchType } from '../base/base-service';
import { fromServiceAttributes, extractServiceNameFromArn } from '../base/from-service-attributes';
import { TaskDefinition } from '../base/task-definition';
import { ICluster } from '../cluster';

/**
 * The properties for defining a service using the Fargate launch type.
 */
export interface FargateServiceProps extends BaseServiceOptions {
  /**
   * The task definition to use for tasks in the service.
   *
   * [disable-awslint:ref-via-interface]
   */
  readonly taskDefinition: TaskDefinition;

  /**
   * Specifies whether the task's elastic network interface receives a public IP address.
   *
   * If true, each task will receive a public IP address.
   *
   * @default false
   */
  readonly assignPublicIp?: boolean;

  /**
   * The subnets to associate with the service.
   *
   * @default - Public subnets if `assignPublicIp` is set, otherwise the first available one of Private, Isolated, Public, in that order.
   */
  readonly vpcSubnets?: ec2.SubnetSelection;

  /**
   * The security groups to associate with the service. If you do not specify a security group, a new security group is created.
   *
   * @default - A new security group is created.
   * @deprecated use securityGroups instead.
   */
  readonly securityGroup?: ec2.ISecurityGroup;

  /**
   * The security groups to associate with the service. If you do not specify a security group, a new security group is created.
   *
   * @default - A new security group is created.
   */
  readonly securityGroups?: ec2.ISecurityGroup[];

  /**
   * The platform version on which to run your service.
   *
   * If one is not specified, the LATEST platform version is used by default. For more information, see
   * [AWS Fargate Platform Versions](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/platform_versions.html)
   * in the Amazon Elastic Container Service Developer Guide.
   *
   * @default Latest
   */
  readonly platformVersion?: FargatePlatformVersion;

  /**
   * Whether to use Availability Zone rebalancing for the service.
   *
   * If enabled, `maxHealthyPercent` must be greater than 100, and the service must not be a target
   * of a Classic Load Balancer.
   *
   * @see https://docs.aws.amazon.com/AmazonECS/latest/developerguide/service-rebalancing.html
   * @default AvailabilityZoneRebalancing.DISABLED
   */
  readonly availabilityZoneRebalancing?: AvailabilityZoneRebalancing;
}

/**
 * The interface for a service using the Fargate launch type on an ECS cluster.
 */
export interface IFargateService extends IService {

}

/**
 * The properties to import from the service using the Fargate launch type.
 */
export interface FargateServiceAttributes {
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

/**
 * This creates a service using the Fargate launch type on an ECS cluster.
 *
 * @resource AWS::ECS::Service
 */
export class FargateService extends BaseService implements IFargateService {
  /**
   * Imports from the specified service ARN.
   */
  public static fromFargateServiceArn(scope: Construct, id: string, fargateServiceArn: string): IFargateService {
    class Import extends cdk.Resource implements IFargateService {
      public readonly serviceArn = fargateServiceArn;
      public readonly serviceName = extractServiceNameFromArn(this, fargateServiceArn);
    }
    return new Import(scope, id);
  }

  /**
   * Imports from the specified service attributes.
   */
  public static fromFargateServiceAttributes(scope: Construct, id: string, attrs: FargateServiceAttributes): IBaseService {
    return fromServiceAttributes(scope, id, attrs);
  }

  private readonly availabilityZoneRebalancingEnabled: boolean;

  /**
   * Constructs a new instance of the FargateService class.
   */
  constructor(scope: Construct, id: string, props: FargateServiceProps) {
    if (!props.taskDefinition.isFargateCompatible) {
      throw new Error('Supplied TaskDefinition is not configured for compatibility with Fargate');
    }

    if (props.securityGroup !== undefined && props.securityGroups !== undefined) {
      throw new Error('Only one of SecurityGroup or SecurityGroups can be populated.');
    }

    if (props.availabilityZoneRebalancing === AvailabilityZoneRebalancing.ENABLED &&
      !cdk.Token.isUnresolved(props.maxHealthyPercent) &&
      props.maxHealthyPercent === 100) {
      throw new Error('AvailabilityZoneRebalancing.ENABLED requires maxHealthyPercent > 100');
    }

    // Platform versions not supporting referencesSecretJsonField, ephemeralStorageGiB, or pidMode on a task definition
    const unsupportedPlatformVersions = [
      FargatePlatformVersion.VERSION1_0,
      FargatePlatformVersion.VERSION1_1,
      FargatePlatformVersion.VERSION1_2,
      FargatePlatformVersion.VERSION1_3,
    ];
    const isUnsupportedPlatformVersion = props.platformVersion && unsupportedPlatformVersions.includes(props.platformVersion);

    if (props.taskDefinition.ephemeralStorageGiB && isUnsupportedPlatformVersion) {
      throw new Error(`The ephemeralStorageGiB feature requires platform version ${FargatePlatformVersion.VERSION1_4} or later, got ${props.platformVersion}.`);
    }

    if (props.taskDefinition.pidMode && isUnsupportedPlatformVersion) {
      throw new Error(`The pidMode feature requires platform version ${FargatePlatformVersion.VERSION1_4} or later, got ${props.platformVersion}.`);
    }

    super(scope, id, {
      ...props,
      desiredCount: props.desiredCount,
      launchType: LaunchType.FARGATE,
      capacityProviderStrategies: props.capacityProviderStrategies,
      enableECSManagedTags: props.enableECSManagedTags,
    }, {
      cluster: props.cluster.clusterName,
      taskDefinition: props.deploymentController?.type === DeploymentControllerType.EXTERNAL ? undefined : props.taskDefinition.taskDefinitionArn,
      platformVersion: props.platformVersion,
      availabilityZoneRebalancing: props.availabilityZoneRebalancing,
    }, props.taskDefinition);

    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);

    this.availabilityZoneRebalancingEnabled = props.availabilityZoneRebalancing === AvailabilityZoneRebalancing.ENABLED;

    let securityGroups;
    if (props.securityGroup !== undefined) {
      securityGroups = [props.securityGroup];
    } else if (props.securityGroups !== undefined) {
      securityGroups = props.securityGroups;
    }

    if (!props.deploymentController ||
      (props.deploymentController.type !== DeploymentControllerType.EXTERNAL)) {
      this.configureAwsVpcNetworkingWithSecurityGroups(props.cluster.vpc, props.assignPublicIp, props.vpcSubnets, securityGroups);
    }

    this.node.addValidation({
      validate: () => this.taskDefinition.referencesSecretJsonField && isUnsupportedPlatformVersion
        ? [`The task definition of this service uses at least one container that references a secret JSON field. This feature requires platform version ${FargatePlatformVersion.VERSION1_4} or later.`]
        : [],
    });

    this.node.addValidation({
      validate: () => !this.taskDefinition.defaultContainer ? ['A TaskDefinition must have at least one essential container'] : [],
    });
  }

  /**
   * Registers the service as a target of a Classic Load Balancer (CLB).
   *
   * Don't call this. Call `loadBalancer.addTarget()` instead.
   *
   * @override
   */
  public attachToClassicLB(loadBalancer: elb.LoadBalancer): void {
    if (this.availabilityZoneRebalancingEnabled) {
      throw new Error('AvailabilityZoneRebalancing.ENABLED disallows using the service as a target of a Classic Load Balancer');
    }
    super.attachToClassicLB(loadBalancer);
  }
}

/**
 * The platform version on which to run your service.
 *
 * @see https://docs.aws.amazon.com/AmazonECS/latest/developerguide/platform_versions.html
 */
export enum FargatePlatformVersion {
  /**
   * The latest, recommended platform version.
   */
  LATEST = 'LATEST',

  /**
   * Version 1.4.0
   *
   * Supports EFS endpoints, CAP_SYS_PTRACE Linux capability,
   * network performance metrics in CloudWatch Container Insights,
   * consolidated 20 GB ephemeral volume.
   */
  VERSION1_4 = '1.4.0',

  /**
   * Version 1.3.0
   *
   * Supports secrets, task recycling.
   */
  VERSION1_3 = '1.3.0',

  /**
   * Version 1.2.0
   *
   * Supports private registries.
   */
  VERSION1_2 = '1.2.0',

  /**
   * Version 1.1.0
   *
   * Supports task metadata, health checks, service discovery.
   */
  VERSION1_1 = '1.1.0',

  /**
   * Initial release
   *
   * Based on Amazon Linux 2017.09.
   */
  VERSION1_0 = '1.0.0',
}
