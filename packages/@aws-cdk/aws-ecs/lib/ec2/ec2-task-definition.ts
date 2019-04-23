import cdk = require('@aws-cdk/cdk');
import { CommonTaskDefinitionProps, Compatibility, NetworkMode, PlacementConstraint, TaskDefinition } from '../base/task-definition';

/**
 * Properties to define an ECS task definition
 */
export interface Ec2TaskDefinitionProps extends CommonTaskDefinitionProps {
  /**
   * The Docker networking mode to use for the containers in the task.
   *
   * On Fargate, the only supported networking mode is AwsVpc.
   *
   * @default NetworkMode.Bridge for EC2 tasks, AwsVpc for Fargate tasks.
   */
  readonly networkMode?: NetworkMode;

  /**
   * An array of placement constraint objects to use for the task. You can
   * specify a maximum of 10 constraints per task (this limit includes
   * constraints in the task definition and those specified at run time).
   *
   * Not supported in Fargate.
   */
  readonly placementConstraints?: PlacementConstraint[];
}

/**
 * Define Tasks to run on an ECS cluster
 */
export class Ec2TaskDefinition extends TaskDefinition {
  constructor(scope: cdk.Construct, id: string, props: Ec2TaskDefinitionProps = {}) {
    super(scope, id, {
      ...props,
      compatibility: Compatibility.Ec2,
      placementConstraints: props.placementConstraints,
    });
  }
}