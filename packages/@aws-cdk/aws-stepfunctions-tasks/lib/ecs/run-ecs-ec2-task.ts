import * as ec2 from '@aws-cdk/aws-ec2';
import * as ecs from '@aws-cdk/aws-ecs';
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
 *
 * @deprecated - replaced by `EcsRunTask`
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
        PlacementConstraints: noEmpty(flatten((props.placementConstraints || []).map(c => c.toJson().map(uppercaseKeys)))),
        PlacementStrategy: noEmpty(flatten((props.placementStrategies || []).map(c => c.toJson().map(uppercaseKeys)))),
      },
    });

    if (props.taskDefinition.networkMode === ecs.NetworkMode.AWS_VPC) {
      this.configureAwsVpcNetworking(props.cluster.vpc, undefined, props.subnets, props.securityGroup);
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

function uppercaseKeys(obj: {[key: string]: any}): {[key: string]: any} {
  const ret: {[key: string]: any} = {};
  for (const key of Object.keys(obj)) {
    ret[key.slice(0, 1).toUpperCase() + key.slice(1)] = obj[key];
  }
  return ret;
}

function flatten<A>(xs: A[][]): A[] {
  return Array.prototype.concat([], ...xs);
}

function noEmpty<A>(xs: A[]): A[] | undefined {
  if (xs.length === 0) { return undefined; }
  return xs;
}
