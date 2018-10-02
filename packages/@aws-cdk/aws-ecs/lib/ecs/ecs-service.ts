import ec2 = require('@aws-cdk/aws-ec2');
import elb = require('@aws-cdk/aws-elasticloadbalancing');
import cdk = require('@aws-cdk/cdk');
import { BaseService, BaseServiceProps } from '../base/base-service';
import { BaseTaskDefinition, NetworkMode } from '../base/base-task-definition';
import { cloudformation } from '../ecs.generated';
import { EcsCluster } from './ecs-cluster';
import { EcsTaskDefinition } from './ecs-task-definition';

export interface EcsServiceProps extends BaseServiceProps {
  /**
   * Cluster where service will be deployed
   */
  cluster: EcsCluster; // should be required? do we assume 'default' exists?

  /**
   * Task Definition used for running tasks in the service
   */
  taskDefinition: EcsTaskDefinition;

  /**
   * In what subnets to place the task's ENIs
   *
   * (Only applicable in case the TaskDefinition is configured for AwsVpc networking)
   *
   * @default Private subnets
   */
  vpcPlacement?: ec2.VpcPlacementStrategy;

  /**
   * Existing security group to use for the task's ENIs
   *
   * (Only applicable in case the TaskDefinition is configured for AwsVpc networking)
   *
   * @default A new security group is created
   */
  securityGroup?: ec2.SecurityGroupRef;

  /**
   * Whether to start services on distinct instances
   *
   * @default true
   */
  placeOnDistinctInstances?: boolean;

  /**
   * Deploy exactly one task on each instance in your cluster.
   *
   * When using this strategy, do not specify a desired number of tasks or any
   * task placement strategies.
   *
   * @default false
   */
  daemon?: boolean;
}

export class EcsService extends BaseService implements elb.ILoadBalancerTarget {
  public readonly connections: ec2.Connections;
  protected readonly taskDef: BaseTaskDefinition;
  private readonly taskDefinition: EcsTaskDefinition;
  private readonly constraints: cloudformation.ServiceResource.PlacementConstraintProperty[];
  private readonly strategies: cloudformation.ServiceResource.PlacementStrategyProperty[];
  private readonly daemon: boolean;

  constructor(parent: cdk.Construct, name: string, props: EcsServiceProps) {
    if (props.daemon && props.desiredCount !== undefined) {
      throw new Error('Daemon mode launches one task on every instance. Don\'t supply desiredCount.');
    }

    super(parent, name, props, {
      cluster: props.cluster.clusterName,
      taskDefinition: props.taskDefinition.taskDefinitionArn,
      launchType: 'EC2',
      placementConstraints: new cdk.Token(() => this.constraints),
      placementStrategies: new cdk.Token(() => this.strategies),
      schedulingStrategy: props.daemon ? 'DAEMON' : 'REPLICA',
    });

    this.constraints = [];
    this.strategies = [];
    this.daemon = props.daemon || false;

    if (props.taskDefinition.networkMode === NetworkMode.AwsVpc) {
      this.configureAwsVpcNetworking(props.cluster.vpc, false, props.vpcPlacement, props.securityGroup);
    } else {
      // Either None, Bridge or Host networking. Copy SecurityGroup from ASG.
      validateNoNetworkingProps(props);
      this._securityGroup = props.cluster.autoScalingGroup.connections.securityGroup!;
    }

    this.connections = new ec2.Connections({ securityGroup: this.securityGroup });
    this.taskDefinition = props.taskDefinition;
    this.taskDef = props.taskDefinition;

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
    this.loadBalancers.push({
      loadBalancerName: loadBalancer.loadBalancerName,
      containerName: this.taskDefinition.defaultContainer!.name,
      containerPort: this.taskDefinition.defaultContainer!.loadBalancerPort(true),
    });
    this.createLoadBalancerRole();
  }
}

function validateNoNetworkingProps(props: EcsServiceProps) {
  if (props.vpcPlacement !== undefined || props.securityGroup !== undefined) {
    throw new Error('vpcPlacement and securityGroup can only be used in AwsVpc networking mode');
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