import cdk = require('@aws-cdk/cdk');
import { BaseTaskDefinition, BaseTaskDefinitionProps, Compatibilities, NetworkMode } from '../base/base-task-definition';
import { cloudformation } from '../ecs.generated';

export interface EcsTaskDefinitionProps extends BaseTaskDefinitionProps {
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
  public readonly networkMode: NetworkMode;
  private readonly placementConstraints: cloudformation.TaskDefinitionResource.TaskDefinitionPlacementConstraintProperty[];

  constructor(parent: cdk.Construct, name: string, props: EcsTaskDefinitionProps = {}) {
    const networkMode = props.networkMode || NetworkMode.Bridge;

    super(parent, name, props, {
      networkMode,
      requiresCompatibilities: [Compatibilities.Ec2],
      placementConstraints: new cdk.Token(() => this.placementConstraints)
    });

    this.networkMode = networkMode;
    this.placementConstraints = [];

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
