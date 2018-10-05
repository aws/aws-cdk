import ec2 = require('@aws-cdk/aws-ec2');
import elbv2 = require('@aws-cdk/aws-elasticloadbalancingv2');
import cdk = require('@aws-cdk/cdk');
import { BaseTaskDefinition, NetworkMode } from '../base/base-task-definition';
import { cloudformation } from '../ecs.generated';

export interface BaseServiceProps {
  /**
   * Number of desired copies of running tasks
   *
   * @default 1
   */
  desiredCount?: number;

  /**
   * A name for the service.
   *
   * @default CloudFormation-generated name
   */
  serviceName?: string;

  /**
   * The maximum number of tasks, specified as a percentage of the Amazon ECS
   * service's DesiredCount value, that can run in a service during a
   * deployment.
   *
   * @default 200
   */
  maximumPercent?: number;

  /**
   * The minimum number of tasks, specified as a percentage of
   * the Amazon ECS service's DesiredCount value, that must
   * continue to run and remain healthy during a deployment.
   *
   * @default 50
   */
  minimumHealthyPercent?: number;

  /**
   * Time after startup to ignore unhealthy load balancer checks.
   *
   * @default ???
   */
  healthCheckGracePeriodSeconds?: number;

  /**
   * Fargate platform version to run this service on
   *
   * Unless you have specific compatibility requirements, you don't need to
   * specify this.
   *
   * @default Latest
   */
  platformVersion?: FargatePlatformVersion;
}

export abstract class BaseService extends cdk.Construct
    implements elbv2.IApplicationLoadBalancerTarget, elbv2.INetworkLoadBalancerTarget, cdk.IDependable {
  public readonly dependencyElements: cdk.IDependable[];
  public abstract readonly connections: ec2.Connections;
  protected loadBalancers = new Array<cloudformation.ServiceResource.LoadBalancerProperty>();
  protected networkConfiguration?: cloudformation.ServiceResource.NetworkConfigurationProperty;
  protected readonly abstract taskDef: BaseTaskDefinition;
  protected _securityGroup?: ec2.SecurityGroupRef;
  private readonly resource: cloudformation.ServiceResource;

  constructor(parent: cdk.Construct, name: string, props: BaseServiceProps, additionalProps: any) {
    super(parent, name);

    this.resource = new cloudformation.ServiceResource(this, "Service", {
      desiredCount: props.desiredCount || 1,
      serviceName: props.serviceName,
      loadBalancers: new cdk.Token(() => this.loadBalancers),
      deploymentConfiguration: {
        maximumPercent: props.maximumPercent,
        minimumHealthyPercent: props.minimumHealthyPercent
      },
      /* role: never specified, supplanted by Service Linked Role */
      networkConfiguration: new cdk.Token(() => this.networkConfiguration),
      platformVersion: props.platformVersion,
      ...additionalProps
    });

    this.dependencyElements = [this.resource];
  }

  public attachToApplicationTargetGroup(targetGroup: elbv2.ApplicationTargetGroup): elbv2.LoadBalancerTargetProps {
    const ret = this.attachToELBv2(targetGroup);

    // Open up security groups. For dynamic port mapping, we won't know the port range
    // in advance so we need to open up all ports.
    const port = this.containerPort;
    const portRange = port === 0 ? EPHEMERAL_PORT_RANGE : new ec2.TcpPort(port);
    targetGroup.registerConnectable(this, portRange);

    return ret;
  }

  public attachToNetworkTargetGroup(targetGroup: elbv2.NetworkTargetGroup): elbv2.LoadBalancerTargetProps {
    return this.attachToELBv2(targetGroup);
  }

  public get securityGroup(): ec2.SecurityGroupRef {
    return this._securityGroup!;
  }

  // tslint:disable-next-line:max-line-length
  protected configureAwsVpcNetworking(vpc: ec2.VpcNetworkRef, assignPublicIp?: boolean, vpcPlacement?: ec2.VpcPlacementStrategy, securityGroup?: ec2.SecurityGroupRef) {
    if (vpcPlacement === undefined) {
      vpcPlacement = { subnetsToUse: assignPublicIp ? ec2.SubnetType.Public : ec2.SubnetType.Private };
    }
    if (securityGroup === undefined) {
      securityGroup = new ec2.SecurityGroup(this, 'SecurityGroup', { vpc });
    }
    const subnets = vpc.subnets(vpcPlacement);
    this._securityGroup = securityGroup;

    this.networkConfiguration = {
      awsvpcConfiguration: {
        assignPublicIp : assignPublicIp ? 'ENABLED' : 'DISABLED',
        subnets: subnets.map(x => x.subnetId),
        securityGroups: new cdk.Token(() => [securityGroup!.securityGroupId]),
      }
    };
  }

  private attachToELBv2(targetGroup: elbv2.ITargetGroup): elbv2.LoadBalancerTargetProps {
    if (this.taskDef.networkMode === NetworkMode.None) {
      throw new Error("Cannot use a load balancer if NetworkMode is None. Use Host or AwsVpc instead.");
    }

    this.loadBalancers.push({
      targetGroupArn: targetGroup.targetGroupArn,
      containerName: this.taskDef.defaultContainer!.id,
      containerPort: this.containerPort,
    });

    this.resource.addDependency(targetGroup.listenerDependency());

    const targetType = this.taskDef.networkMode === NetworkMode.AwsVpc ? elbv2.TargetType.Ip : elbv2.TargetType.Instance;
    return { targetType };
  }

  /**
   * Return the port on which the load balancer will be listening
   */
  private get containerPort() {
    return this.taskDef.defaultContainer!.ingressPort;
  }
}

/**
 * The port range to open up for dynamic port mapping
 */
const EPHEMERAL_PORT_RANGE = new ec2.TcpPortRange(32768, 65535);

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
   * Version 1.2
   *
   * Supports private registries.
   */
  Version12 = '1.2.0',

  /**
   * Version 1.1.0
   *
   * Supports task metadata, health checks, service discovery.
   */
  Version11 = '1.1.0',

  /**
   * Initial release
   *
   * Based on Amazon Linux 2017.09.
   */
  Version10 = '1.0.0',
}
