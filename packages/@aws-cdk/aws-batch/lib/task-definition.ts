import * as ecs from '@aws-cdk/aws-ecs';
import * as iam from '@aws-cdk/aws-iam';

/**
 * TaskDefinitionRole
 *
 * Defines the required properties of a Batch Job Definition.
 */
export interface TaskDefinitionProps {
  readonly executionRole: iam.IRole;
}

/**
 * Batch Job Task Definition
 *
 * Defines a Batch Job Task Definition. The properties of this task definition mirrors
 * those of an {@link ecs.ContainerDefinition}. This class is a wrapper on that structure.
 */
export class TaskDefinition {
  public readonly executionRole: iam.IRole;
  constructor(props: TaskDefinitionProps) {
    this.executionRole = props.executionRole;
  }

  // tslint:disable-next-line: no-empty
  public _linkContainer(_container: ecs.ContainerDefinition) {}

  public obtainExecutionRole(): iam.IRole {
    return this.executionRole;
  }
}
