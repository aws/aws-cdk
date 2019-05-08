import ec2 = require('@aws-cdk/aws-ec2');
import ecs = require('@aws-cdk/aws-ecs');
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
   * Placement constraints
   *
   * @default No constraints
   */
  readonly placementConstraints?: ecs.PlacementConstraint[];

  /**
   * Placement strategies
   *
   * @default No strategies
   */
  readonly placementStrategies?: ecs.PlacementStrategy[];
}

/**
 * Run an ECS/EC2 Task in a StepFunctions workflow
 */
export class RunEcsEc2Task extends EcsRunTaskBase {
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
        PlacementConstraints: mapArray(props.placementConstraints, c => c._json),
        PlacementStrategy: mapArray(props.placementStrategies, c => c._json),
      }
    });

    if (props.taskDefinition.networkMode === ecs.NetworkMode.AwsVpc) {
      this.configureAwsVpcNetworking(props.cluster.vpc, false, props.subnets, props.securityGroup);
    } else {
      // Either None, Bridge or Host networking. Copy SecurityGroup from ASG.
      validateNoNetworkingProps(props);
      this.connections.addSecurityGroup(...props.cluster.connections.securityGroups);
    }
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

function mapArray<A, B>(xs: A[] | undefined, fn: (x: A) => B): B[] | undefined {
  if (xs === undefined || xs.length === 0) { return undefined; }
  return xs.map(fn);
}