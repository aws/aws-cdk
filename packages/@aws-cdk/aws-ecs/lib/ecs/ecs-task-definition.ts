import cdk = require('@aws-cdk/cdk');
import { BaseTaskDefinition, BaseTaskDefinitionProps, Compatibilities, NetworkMode } from '../base/base-task-definition';
import { cloudformation } from '../ecs.generated';

export interface EcsTaskDefinitionProps extends BaseTaskDefinitionProps {
  /**
   * The number of cpu units used by the task. If using the EC2 launch type,
   * this field is optional. Supported values are between 128 CPU units
   * (0.125 vCPUs) and 10240 CPU units (10 vCPUs).
   *
   * @default 256
   */
  cpu?: string;

  /**
   * The amount (in MiB) of memory used by the task. If using the EC2 launch type, this field is optional and any value
   * can be used.
   *
   * @default 512
   */
  memoryMiB?: string;

  /**
   * The Docker networking mode to use for the containers in the task.
   *
   * @default NetworkMode.Bridge
   */
  networkMode?: NetworkMode;

  /**
   * An array of placement constraint objects to use for the task. You can
   * specify a maximum of 10 constraints per task (this limit includes
   * constraints in the task definition and those specified at run time).
   *
   * Not supported in Fargate.
   */
  placementConstraints?: PlacementConstraint[];
}

export class EcsTaskDefinition extends BaseTaskDefinition {
  private readonly placementConstraints: cloudformation.TaskDefinitionResource.TaskDefinitionPlacementConstraintProperty[] = [];

  constructor(parent: cdk.Construct, name: string, props: EcsTaskDefinitionProps) {
    super(parent, name, props, {
      cpu: props.cpu,
      memoryMiB: props.memoryMiB,
      networkMode: props.networkMode || NetworkMode.Bridge,
      requiresCompatibilities: [Compatibilities.Ec2],
      placementConstraints: new cdk.Token(() => this.placementConstraints)
    });

    if (props.placementConstraints) {
      props.placementConstraints.forEach(pc => this.addPlacementConstraint(pc));
    }
  }

  /**
   * Constrain where tasks can be placed
   */
  private addPlacementConstraint(constraint: PlacementConstraint) {
    const pc = this.renderPlacementConstraint(constraint);
    this.placementConstraints.push(pc);
  }

  private renderPlacementConstraint(pc: PlacementConstraint): cloudformation.TaskDefinitionResource.TaskDefinitionPlacementConstraintProperty {
    return {
      type: pc.type,
      expression: pc.expression
    };
  }
}

export interface PlacementConstraint {
  expression?: string;
  type: PlacementConstraintType;
}

export enum PlacementConstraintType {
  DistinctInstance = "distinctInstance",
    MemberOf = "memberOf"
}
