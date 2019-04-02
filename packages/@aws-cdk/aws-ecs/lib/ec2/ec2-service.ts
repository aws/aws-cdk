import cloudwatch = require ('@aws-cdk/aws-cloudwatch');
import ec2 = require('@aws-cdk/aws-ec2');
import elb = require('@aws-cdk/aws-elasticloadbalancing');
import cloudmap = require('@aws-cdk/aws-servicediscovery');
import cdk = require('@aws-cdk/cdk');
import { BaseService, BaseServiceProps, ServiceDiscoveryOptions } from '../base/base-service';
import { NetworkMode, TaskDefinition } from '../base/task-definition';
import { CfnService } from '../ecs.generated';
import { isEc2Compatible } from '../util';

/**
 * Properties to define an ECS service
 */
export interface Ec2ServiceProps extends BaseServiceProps {
  /**
   * Task Definition used for running tasks in the service
   */
  readonly taskDefinition: TaskDefinition;

  /**
   * In what subnets to place the task's ENIs
   *
   * (Only applicable in case the TaskDefinition is configured for AwsVpc networking)
   *
   * @default Private subnets
   */
  readonly vpcSubnets?: ec2.SubnetSelection;

  /**
   * Existing security group to use for the task's ENIs
   *
   * (Only applicable in case the TaskDefinition is configured for AwsVpc networking)
   *
   * @default A new security group is created
   */
  readonly securityGroup?: ec2.ISecurityGroup;

  /**
   * Whether to start services on distinct instances
   *
   * @default true
   */
  readonly placeOnDistinctInstances?: boolean;

  /**
   * Deploy exactly one task on each instance in your cluster.
   *
   * When using this strategy, do not specify a desired number of tasks or any
   * task placement strategies.
   *
   * @default false
   */
  readonly daemon?: boolean;
}

/**
 * Start a service on an ECS cluster
 */
export class Ec2Service extends BaseService implements elb.ILoadBalancerTarget {
  /**
   * Name of the cluster
   */
  public readonly clusterName: string;

  private readonly constraints: CfnService.PlacementConstraintProperty[];
  private readonly strategies: CfnService.PlacementStrategyProperty[];
  private readonly daemon: boolean;

  constructor(scope: cdk.Construct, id: string, props: Ec2ServiceProps) {
    if (props.daemon && props.desiredCount !== undefined) {
      throw new Error('Daemon mode launches one task on every instance. Don\'t supply desiredCount.');
    }

    if (!isEc2Compatible(props.taskDefinition.compatibility)) {
      throw new Error('Supplied TaskDefinition is not configured for compatibility with EC2');
    }

    super(scope, id, {
      ...props,
      // If daemon, desiredCount must be undefined and that's what we want. Otherwise, default to 1.
      desiredCount: props.daemon || props.desiredCount !== undefined ? props.desiredCount : 1,
    },
    {
      cluster: props.cluster.clusterName,
      taskDefinition: props.taskDefinition.taskDefinitionArn,
      launchType: 'EC2',
      placementConstraints: new cdk.Token(() => this.constraints),
      placementStrategies: new cdk.Token(() => this.strategies),
      schedulingStrategy: props.daemon ? 'DAEMON' : 'REPLICA',
    }, props.cluster.clusterName, props.taskDefinition);

    this.clusterName = props.cluster.clusterName;
    this.constraints = [];
    this.strategies = [];
    this.daemon = props.daemon || false;

    if (props.taskDefinition.networkMode === NetworkMode.AwsVpc) {
      this.configureAwsVpcNetworking(props.cluster.vpc, false, props.vpcSubnets, props.securityGroup);
    } else {
      // Either None, Bridge or Host networking. Copy SecurityGroup from ASG.
      validateNoNetworkingProps(props);
      this.connections.addSecurityGroup(...props.cluster.connections.securityGroups);
    }

    if (props.placeOnDistinctInstances) {
      this.constraints.push({ type: 'distinctInstance' });
    }

    if (!this.taskDefinition.defaultContainer) {
      throw new Error('A TaskDefinition must have at least one essential container');
    }
  }

  /**
   * Place services only on instances matching the given query expression
   *
   * You can specify multiple expressions in one call. The tasks will only
   * be placed on instances matching all expressions.
   *
   * @see https://docs.aws.amazon.com/AmazonECS/latest/developerguide/cluster-query-language.html
   */
  public placeOnMemberOf(...expressions: string[]) {
    for (const expression of expressions) {
      this.constraints.push({ type: 'memberOf', expression });
    }
  }

  /**
   * Try to place tasks spread across instance attributes.
   *
   * You can use one of the built-in attributes found on `BuiltInAttributes`
   * or supply your own custom instance attributes. If more than one attribute
   * is supplied, spreading is done in order.
   *
   * @default attributes instanceId
   */
  public placeSpreadAcross(...fields: string[]) {
    if (this.daemon) {
      throw new Error("Can't configure spreading placement for a service with daemon=true");
    }

    if (fields.length === 0) {
      fields = [BuiltInAttributes.InstanceId];
    }
    for (const field of fields) {
      this.strategies.push({ type: 'spread', field });
    }
  }

  /**
   * Try to place tasks on instances with the least amount of indicated resource available
   *
   * This ensures the total consumption of this resource is lowest.
   */
  public placePackedBy(resource: BinPackResource) {
    if (this.daemon) {
      throw new Error("Can't configure packing placement for a service with daemon=true");
    }

    this.strategies.push({ type: 'binpack', field: resource });
  }

  /**
   * Place tasks randomly across the available instances.
   */
  public placeRandomly() {
    if (this.daemon) {
      throw new Error("Can't configure random placement for a service with daemon=true");
    }

    this.strategies.push({ type: 'random' });
  }

  /**
   * Register this service as the target of a Classic Load Balancer
   *
   * Don't call this. Call `loadBalancer.addTarget()` instead.
   */
  public attachToClassicLB(loadBalancer: elb.LoadBalancer): void {
    if (this.taskDefinition.networkMode === NetworkMode.Bridge) {
      throw new Error("Cannot use a Classic Load Balancer if NetworkMode is Bridge. Use Host or AwsVpc instead.");
    }
    if (this.taskDefinition.networkMode === NetworkMode.None) {
      throw new Error("Cannot use a load balancer if NetworkMode is None. Use Host or AwsVpc instead.");
    }

    this.loadBalancers.push({
      loadBalancerName: loadBalancer.loadBalancerName,
      containerName: this.taskDefinition.defaultContainer!.node.id,
      containerPort: this.taskDefinition.defaultContainer!.containerPort,
    });
  }

  /**
   * Enable CloudMap service discovery for the service
   */
  public enableServiceDiscovery(options: ServiceDiscoveryOptions): cloudmap.Service {
    const sdNamespace = this.cluster.serviceDiscoveryNamespace();
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

  /**
   * Return the given named metric for this Service
   */
  public metric(metricName: string, props?: cloudwatch.MetricCustomization): cloudwatch.Metric {
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
  public metricMemoryUtilization(props?: cloudwatch.MetricCustomization): cloudwatch.Metric {
    return this.metric('MemoryUtilization', props );
  }

  /**
   * Metric for cluster CPU utilization
   *
   * @default average over 5 minutes
   */
  public metricCpuUtilization(props?: cloudwatch.MetricCustomization): cloudwatch.Metric {
    return this.metric('CPUUtilization', props);
  }

  /**
   * Validate this Ec2Service
   */
  protected validate(): string[] {
    const ret = super.validate();
    if (!this.cluster.hasEc2Capacity) {
      ret.push('Cluster for this service needs Ec2 capacity. Call addXxxCapacity() on the cluster.');
    }
    return ret;
  }
}

/**
 * Validate combinations of networking arguments
 */
function validateNoNetworkingProps(props: Ec2ServiceProps) {
  if (props.vpcSubnets !== undefined || props.securityGroup !== undefined) {
    throw new Error('vpcSubnets and securityGroup can only be used in AwsVpc networking mode');
  }
}

/**
 * Built-in container instance attributes
 */
export class BuiltInAttributes {
  /**
   * The Instance ID of the instance
   */
  public static readonly InstanceId = 'instanceId';

  /**
   * The AZ where the instance is running
   */
  public static readonly AvailabilityZone = 'attribute:ecs.availability-zone';

  /**
   * The AMI ID of the instance
   */
  public static readonly AmiId = 'attribute:ecs.ami-id';

  /**
   * The instance type
   */
  public static readonly InstanceType = 'attribute:ecs.instance-type';

  /**
   * The OS type
   *
   * Either 'linux' or 'windows'.
   */
  public static readonly OsType = 'attribute:ecs.os-type';
}

/**
 * Instance resource used for bin packing
 */
export enum BinPackResource {
  /**
   * Fill up hosts' CPU allocations first
   */
  Cpu = 'cpu',

  /**
   * Fill up hosts' memory allocations first
   */
  Memory = 'memory',
}
