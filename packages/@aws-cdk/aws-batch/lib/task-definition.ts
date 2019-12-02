import * as ecs from '@aws-cdk/aws-ecs';
import * as iam from '@aws-cdk/aws-iam';

export interface TaskDefinitionProps {
  readonly executionRole: iam.IRole;
}

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
