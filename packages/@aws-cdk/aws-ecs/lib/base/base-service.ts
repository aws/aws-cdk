import ec2 = require('@aws-cdk/aws-ec2');
import elbv2 = require('@aws-cdk/aws-elasticloadbalancingv2');
import iam = require('@aws-cdk/aws-iam');
import cdk = require('@aws-cdk/cdk');
import { BaseTaskDefinition } from '../base/base-task-definition';
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
   * Role used by ECS agent to register containers with the Load Balancer
   *
   * @default A role will be created for you
   */
  role?: iam.Role;

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
  private role?: iam.Role;
  private readonly resource: cloudformation.ServiceResource;

  constructor(parent: cdk.Construct, name: string, props: BaseServiceProps, additionalProps: any) {
    super(parent, name);

    this.role = props.role;

    this.resource = new cloudformation.ServiceResource(this, "Service", {
      desiredCount: props.desiredCount,
      serviceName: props.serviceName,
      loadBalancers: new cdk.Token(() => this.loadBalancers),
      deploymentConfiguration: {
        maximumPercent: props.maximumPercent,
        minimumHealthyPercent: props.minimumHealthyPercent
      },
      role: new cdk.Token(() => this.role && this.role.roleArn),
      networkConfiguration: this.networkConfiguration,
      platformVersion: props.platformVersion,
      ...additionalProps
    });

    this.dependencyElements = [this.resource];
  }

  public attachToApplicationTargetGroup(targetGroup: elbv2.ApplicationTargetGroup): elbv2.LoadBalancerTargetProps {
    this.loadBalancers.push({
      targetGroupArn: targetGroup.targetGroupArn,
      containerName: this.taskDef.defaultContainer!.name,
      containerPort: this.taskDef.defaultContainer!.loadBalancerPort(false),
    });
    this.createLoadBalancerRole();

    return { targetType: elbv2.TargetType.SelfRegistering };
  }

  public attachToNetworkTargetGroup(targetGroup: elbv2.NetworkTargetGroup): elbv2.LoadBalancerTargetProps {
    this.loadBalancers.push({
      targetGroupArn: targetGroup.targetGroupArn,
      containerName: this.taskDef.defaultContainer!.name,
      containerPort: this.taskDef.defaultContainer!.loadBalancerPort(false),
    });
    this.createLoadBalancerRole();

    return { targetType: elbv2.TargetType.SelfRegistering };
  }

  public get securityGroup(): ec2.SecurityGroupRef {
    return this._securityGroup!;
  }

  protected createLoadBalancerRole() {
    if (!this.role) {
      this.role = new iam.Role(this, 'Role', {
        assumedBy: new cdk.ServicePrincipal('ecs-tasks.amazonaws.com'),
      });
      this.role.attachManagedPolicy(new iam.AwsManagedPolicy('service-role/AmazonEC2ContainerServiceRole').policyArn);
      this.resource.addDependency(this.role);
    }
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