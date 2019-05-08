import ec2 = require('@aws-cdk/aws-ec2');
import ecs = require('@aws-cdk/aws-ecs');
import cdk = require('@aws-cdk/cdk');
import { CommonEcsRunTaskProps, EcsRunTaskBase } from './run-ecs-task-base';

/**
 * Properties to run an ECS task on EC2 in StepFunctionsan ECS
 */
export interface RunEcsEc2TaskProps extends CommonEcsRunTaskProps {
  /**
   * In what subnets to place the task's ENIs
   *
   * (Only applicable in case the TaskDefinition is configured for AwsVpc networking)
   *
   * @default Private subnets
   */
  readonly subnets?: ec2.SubnetSelection;

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
   * @default false
   */
  readonly placeOnDistinctInstances?: boolean;
}

/**
 * Run an ECS/EC2 Task in a StepFunctions workflow
 */
export class RunEcsEc2Task extends EcsRunTaskBase {
  private readonly constraints: any[];
  private readonly strategies: any[];

  constructor(props: RunEcsEc2TaskProps) {
    if (!props.taskDefinition.isEc2Compatible) {
      throw new Error('Supplied TaskDefinition is not configured for compatibility with EC2');
    }

    if (!props.cluster.hasEc2Capacity) {
      throw new Error('Cluster for this service needs Ec2 capacity. Call addXxxCapacity() on the cluster.');
    }

    if (!props.taskDefinition.defaultContainer) {
      throw new Error('A TaskDefinition must have at least one essential container');
    }

    super({
      ...props,
      parameters: {
        LaunchType: 'EC2',
        PlacementConstraints: new cdk.Token(() => this.constraints.length > 0 ? this.constraints : undefined),
        PlacementStrategy: new cdk.Token(() => this.constraints.length > 0 ? this.strategies : undefined),
      }
    });

    this.constraints = [];
    this.strategies = [];

    if (props.taskDefinition.networkMode === ecs.NetworkMode.AwsVpc) {
      this.configureAwsVpcNetworking(props.cluster.vpc, false, props.subnets, props.securityGroup);
    } else {
      // Either None, Bridge or Host networking. Copy SecurityGroup from ASG.
      validateNoNetworkingProps(props);
      this.connections.addSecurityGroup(...props.cluster.connections.securityGroups);
    }

    // False for now because I'm getting the error
    // StateMachine (StateMachine2E01A3A5) Invalid State Machine Definition:
    // 'SCHEMA_VALIDATION_FAILED: The value for 'PlacementConstraintType' must
    // be one of the values: [distinctInstance, memberOf] but was
    // 'distinctInstance' at /States/RunEc2/Parameters' (Service:
    // AWSStepFunctions; Status Code: 400; Error Code: InvalidDefinition;
    // Request ID: ad672a90-2558-11e9-ae36-d99a98e3de72)
    if (props.placeOnDistinctInstances) {
      this.constraints.push({ Type: 'distinctInstance' });
    }
  }

  /**
   * Place task only on instances matching the given query expression
   *
   * You can specify multiple expressions in one call. The tasks will only
   * be placed on instances matching all expressions.
   *
   * @see https://docs.aws.amazon.com/AmazonECS/latest/developerguide/cluster-query-language.html
   */
  public placeOnMemberOf(...expressions: string[]) {
    for (const expression of expressions) {
      this.constraints.push({ Type: 'memberOf', expression });
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
    if (fields.length === 0) {
      fields = [ecs.BuiltInAttributes.InstanceId];
    }
    for (const field of fields) {
      this.strategies.push({ Type: 'spread', Field: field });
    }
  }

  /**
   * Try to place tasks on instances with the least amount of indicated resource available
   *
   * This ensures the total consumption of this resource is lowest.
   */
  public placePackedBy(resource: ecs.BinPackResource) {
    this.strategies.push({ Type: 'binpack', Field: resource });
  }

  /**
   * Place tasks randomly across the available instances.
   */
  public placeRandomly() {
    this.strategies.push({ Type: 'random' });
  }
}

/**
 * Validate combinations of networking arguments
 */
function validateNoNetworkingProps(props: RunEcsEc2TaskProps) {
  if (props.subnets !== undefined || props.securityGroup !== undefined) {
    throw new Error('vpcPlacement and securityGroup can only be used in AwsVpc networking mode');
  }
}