import appscaling = require('@aws-cdk/aws-applicationautoscaling');
import cloudwatch = require('@aws-cdk/aws-cloudwatch');
import ec2 = require('@aws-cdk/aws-ec2');
import elbv2 = require('@aws-cdk/aws-elasticloadbalancingv2');
import iam = require('@aws-cdk/aws-iam');
import cloudmap = require('@aws-cdk/aws-servicediscovery');
import { IResource, Lazy, Resource, Stack } from '@aws-cdk/cdk';
import cdk = require('@aws-cdk/cdk');
import { NetworkMode, TaskDefinition } from '../base/task-definition';
import { ICluster } from '../cluster';
import { CfnService } from '../ecs.generated';
import { ScalableTaskCount } from './scalable-task-count';

export interface IService extends IResource {
  /**
   * ARN of this service
   *
   * @attribute
   */
  readonly serviceArn: string;
}

/**
 * Basic service properties
 */
export interface BaseServiceProps {
  /**
   * Cluster where service will be deployed
   */
  readonly cluster: ICluster;

  /**
   * Number of desired copies of running tasks
   *
   * @default 1
   */
  readonly desiredCount?: number;

  /**
   * A name for the service.
   *
   * @default - CloudFormation-generated name.
   */
  readonly serviceName?: string;

  /**
   * The maximum number of tasks, specified as a percentage of the Amazon ECS
   * service's DesiredCount value, that can run in a service during a
   * deployment.
   *
   * @default - 100 if daemon, otherwise 200
   */
  readonly maximumPercent?: number;

  /**
   * The minimum number of tasks, specified as a percentage of
   * the Amazon ECS service's DesiredCount value, that must
   * continue to run and remain healthy during a deployment.
   *
   * @default - 0 if daemon, otherwise 50
   */
  readonly minimumHealthyPercent?: number;

  /**
   * Time after startup to ignore unhealthy load balancer checks.
   *
   * @default ??? FIXME
   */
  readonly healthCheckGracePeriodSeconds?: number;

  /**
   * Options for enabling AWS Cloud Map service discovery for the service
   *
   * @default - AWS Cloud Map service discovery is not enabled.
   */
  readonly serviceDiscoveryOptions?: ServiceDiscoveryOptions;

  /**
   * Whether the new long ARN format has been enabled on ECS services.
   * NOTE: This assumes customer has opted into the new format for the IAM role used for the service, and is a
   * workaround for a current bug in Cloudformation in which the service name is not correctly returned when long ARN is
   * enabled.
   *
   * Old ARN format: arn:aws:ecs:region:aws_account_id:service/service-name
   * New ARN format: arn:aws:ecs:region:aws_account_id:service/cluster-name/service-name
   *
   * See: https://docs.aws.amazon.com/AmazonECS/latest/userguide/ecs-resource-ids.html
   *
   * @default false
   */
  readonly longArnEnabled?: boolean;
}

/**
 * Base class for Ecs and Fargate services
 */
export abstract class BaseService extends Resource
  implements IService, elbv2.IApplicationLoadBalancerTarget, elbv2.INetworkLoadBalancerTarget {

  /**
   * Manage allowed network traffic for this service
   */
  public readonly connections: ec2.Connections = new ec2.Connections();

  /**
   * ARN of this service
   */
  public readonly serviceArn: string;

  /**
   * Name of this service
   *
   * @attribute
   */
  public readonly serviceName: string;

  /**
   * Name of this service's cluster
   */
  public readonly clusterName: string;

  /**
   * Task definition this service is associated with
   */
  public readonly taskDefinition: TaskDefinition;

  protected cloudmapService?: cloudmap.Service;
  protected cluster: ICluster;
  protected loadBalancers = new Array<CfnService.LoadBalancerProperty>();
  protected networkConfiguration?: CfnService.NetworkConfigurationProperty;
  protected serviceRegistries = new Array<CfnService.ServiceRegistryProperty>();

  private readonly resource: CfnService;
  private scalableTaskCount?: ScalableTaskCount;

  constructor(scope: cdk.Construct,
              id: string,
              props: BaseServiceProps,
              additionalProps: any,
              clusterName: string,
              taskDefinition: TaskDefinition) {
    super(scope, id);

    this.taskDefinition = taskDefinition;

    this.resource = new CfnService(this, "Service", {
      desiredCount: props.desiredCount,
      serviceName: props.serviceName,
      loadBalancers: Lazy.anyValue({ produce: () => this.loadBalancers }),
      deploymentConfiguration: {
        maximumPercent: props.maximumPercent || 200,
        minimumHealthyPercent: props.minimumHealthyPercent === undefined ? 50 : props.minimumHealthyPercent
      },
      healthCheckGracePeriodSeconds: props.healthCheckGracePeriodSeconds,
      /* role: never specified, supplanted by Service Linked Role */
      networkConfiguration: Lazy.anyValue({ produce: () => this.networkConfiguration }),
      serviceRegistries: Lazy.anyValue({ produce: () => this.serviceRegistries }),
      ...additionalProps
    });

    this.serviceArn = this.resource.serviceArn;

    // This is a workaround for CFN bug that returns the cluster name instead of the service name when long ARN formats
    // are enabled for the principal in a given region.
    const longArnEnabled = props.longArnEnabled !== undefined ? props.longArnEnabled : false;
    this.serviceName = longArnEnabled
      ? cdk.Fn.select(2, cdk.Fn.split('/', this.serviceArn))
      : this.resource.serviceName;

    this.clusterName = clusterName;
    this.cluster = props.cluster;

    if (props.serviceDiscoveryOptions) {
      this.enableServiceDiscovery(props.serviceDiscoveryOptions);
    }
  }

  /**
   * Called when the service is attached to an ALB
   *
   * Don't call this function directly. Instead, call listener.addTarget()
   * to add this service to a load balancer.
   */
  public attachToApplicationTargetGroup(targetGroup: elbv2.ApplicationTargetGroup): elbv2.LoadBalancerTargetProps {
    const ret = this.attachToELBv2(targetGroup);

    // Open up security groups. For dynamic port mapping, we won't know the port range
    // in advance so we need to open up all ports.
    const port = this.taskDefinition.defaultContainer!.ingressPort;
    const portRange = port === 0 ? EPHEMERAL_PORT_RANGE : new ec2.TcpPort(port);
    targetGroup.registerConnectable(this, portRange);

    return ret;
  }

  /**
   * Called when the service is attached to an NLB
   *
   * Don't call this function directly. Instead, call listener.addTarget()
   * to add this service to a load balancer.
   */
  public attachToNetworkTargetGroup(targetGroup: elbv2.NetworkTargetGroup): elbv2.LoadBalancerTargetProps {
    return this.attachToELBv2(targetGroup);
  }

  /**
   * Enable autoscaling for the number of tasks in this service
   */
  public autoScaleTaskCount(props: appscaling.EnableScalingProps) {
    if (this.scalableTaskCount) {
      throw new Error('AutoScaling of task count already enabled for this service');
    }

    return this.scalableTaskCount = new ScalableTaskCount(this, 'TaskCount', {
      serviceNamespace: appscaling.ServiceNamespace.Ecs,
      resourceId: `service/${this.clusterName}/${this.serviceName}`,
      dimension: 'ecs:service:DesiredCount',
      role: this.makeAutoScalingRole(),
      ...props
    });
  }

  /**
   * Return the given named metric for this Service
   */
  public metric(metricName: string, props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return new cloudwatch.Metric({
      namespace: 'AWS/ECS',
      metricName,
      dimensions: { ClusterName: this.clusterName, ServiceName: this.serviceName },
      ...props
    });
  }

  /**
   * Metric for cluster Memory utilization
   *
   * @default average over 5 minutes
   */
  public metricMemoryUtilization(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return this.metric('MemoryUtilization', props);
  }

  /**
   * Metric for cluster CPU utilization
   *
   * @default average over 5 minutes
   */
  public metricCpuUtilization(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return this.metric('CPUUtilization', props);
  }

  /**
   * Set up AWSVPC networking for this construct
   */
  // tslint:disable-next-line:max-line-length
  protected configureAwsVpcNetworking(vpc: ec2.IVpc, assignPublicIp?: boolean, vpcSubnets?: ec2.SubnetSelection, securityGroup?: ec2.ISecurityGroup) {
    if (vpcSubnets === undefined) {
      vpcSubnets = { subnetType: assignPublicIp ? ec2.SubnetType.Public : ec2.SubnetType.Private };
    }
    if (securityGroup === undefined) {
      securityGroup = new ec2.SecurityGroup(this, 'SecurityGroup', { vpc });
    }
    this.connections.addSecurityGroup(securityGroup);

    this.networkConfiguration = {
      awsvpcConfiguration: {
        assignPublicIp: assignPublicIp ? 'ENABLED' : 'DISABLED',
        subnets: vpc.selectSubnets(vpcSubnets).subnetIds,
        securityGroups: Lazy.listValue({ produce: () => [securityGroup!.securityGroupId] }),
      }
    };
  }

  private renderServiceRegistry(registry: ServiceRegistry): CfnService.ServiceRegistryProperty {
    return {
      registryArn: registry.arn,
      containerName: registry.containerName,
      containerPort: registry.containerPort,
    };
  }

  /**
   * Shared logic for attaching to an ELBv2
   */
  private attachToELBv2(targetGroup: elbv2.ITargetGroup): elbv2.LoadBalancerTargetProps {
    if (this.taskDefinition.networkMode === NetworkMode.None) {
      throw new Error("Cannot use a load balancer if NetworkMode is None. Use Bridge, Host or AwsVpc instead.");
    }

    this.loadBalancers.push({
      targetGroupArn: targetGroup.targetGroupArn,
      containerName: this.taskDefinition.defaultContainer!.node.id,
      containerPort: this.taskDefinition.defaultContainer!.containerPort,
    });

    // Service creation can only happen after the load balancer has
    // been associated with our target group(s), so add ordering dependency.
    this.resource.node.addDependency(targetGroup.loadBalancerAttached);

    const targetType = this.taskDefinition.networkMode === NetworkMode.AwsVpc ? elbv2.TargetType.Ip : elbv2.TargetType.Instance;
    return { targetType };
  }

  /**
   * Generate the role that will be used for autoscaling this service
   */
  private makeAutoScalingRole(): iam.IRole {
    // Use a Service Linked Role.
    return iam.Role.fromRoleArn(this, 'ScalingRole', Stack.of(this).formatArn({
      service: 'iam',
      resource: 'role/aws-service-role/ecs.application-autoscaling.amazonaws.com',
      resourceName: 'AWSServiceRoleForApplicationAutoScaling_ECSService',
    }));
  }

  /**
   * Associate Service Discovery (Cloud Map) service
   */
  private addServiceRegistry(registry: ServiceRegistry) {
    const sr = this.renderServiceRegistry(registry);
    this.serviceRegistries.push(sr);
  }

  /**
   * Enable CloudMap service discovery for the service
   */
  private enableServiceDiscovery(options: ServiceDiscoveryOptions): cloudmap.Service {
    const sdNamespace = this.cluster.defaultNamespace;
    if (sdNamespace === undefined) {
      throw new Error("Cannot enable service discovery if a Cloudmap Namespace has not been created in the cluster.");
    }

    // Determine DNS type based on network mode
    const networkMode = this.taskDefinition.networkMode;
    if (networkMode === NetworkMode.None) {
      throw new Error("Cannot use a service discovery if NetworkMode is None. Use Bridge, Host or AwsVpc instead.");
    }

    // Bridge or host network mode requires SRV records
    let dnsRecordType = options.dnsRecordType;

    if (networkMode === NetworkMode.Bridge || networkMode === NetworkMode.Host) {
      if (dnsRecordType ===  undefined) {
        dnsRecordType = cloudmap.DnsRecordType.SRV;
      }
      if (dnsRecordType !== cloudmap.DnsRecordType.SRV) {
        throw new Error("SRV records must be used when network mode is Bridge or Host.");
      }
    }

    // Default DNS record type for AwsVpc network mode is A Records
    if (networkMode === NetworkMode.AwsVpc) {
      if (dnsRecordType ===  undefined) {
        dnsRecordType = cloudmap.DnsRecordType.A;
      }
    }

    // If the task definition that your service task specifies uses the AWSVPC network mode and a type SRV DNS record is
    // used, you must specify a containerName and containerPort combination
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

    this.cloudmapService = cloudmapService;

    return cloudmapService;
  }
}

/**
 * The port range to open up for dynamic port mapping
 */
const EPHEMERAL_PORT_RANGE = new ec2.TcpPortRange(32768, 65535);

/**
 * Options for enabling service discovery on an ECS service
 */
export interface ServiceDiscoveryOptions {
  /**
   * Name of the cloudmap service to attach to the ECS Service
   *
   * @default CloudFormation-generated name
   */
  readonly name?: string,

  /**
   * The DNS type of the record that you want AWS Cloud Map to create. Supported record types include A or SRV.
   *
   * @default: A
   */
  readonly dnsRecordType?: cloudmap.DnsRecordType.A | cloudmap.DnsRecordType.SRV,

  /**
   * The amount of time, in seconds, that you want DNS resolvers to cache the settings for this record.
   *
   * @default 60
   */
  readonly dnsTtlSec?: number;

  /**
   * The number of 30-second intervals that you want Cloud Map to wait after receiving an
   * UpdateInstanceCustomHealthStatus request before it changes the health status of a service instance.
   * NOTE: This is used for HealthCheckCustomConfig
   */
  readonly failureThreshold?: number,
}

/**
 * Service Registry for ECS service
 */
export interface ServiceRegistry {
  /**
   * Arn of the Cloud Map Service that will register a Cloud Map Instance for your ECS Service
   */
  readonly arn: string;

  /**
   * The container name value, already specified in the task definition, to be used for your service discovery service.
   * If the task definition that your service task specifies uses the bridge or host network mode,
   * you must specify a containerName and containerPort combination from the task definition.
   * If the task definition that your service task specifies uses the awsvpc network mode and a type SRV DNS record is
   * used, you must specify either a containerName and containerPort combination or a port value, but not both.
   */
  readonly containerName?: string;

  /**
   * The container port value, already specified in the task definition, to be used for your service discovery service.
   * If the task definition that your service task specifies uses the bridge or host network mode,
   * you must specify a containerName and containerPort combination from the task definition.
   * If the task definition that your service task specifies uses the awsvpc network mode and a type SRV DNS record is
   * used, you must specify either a containerName and containerPort combination or a port value, but not both.
   */
  readonly containerPort?: number;
}
