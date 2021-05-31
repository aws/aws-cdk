import { WorkflowAction, WorkflowArtifact, WorkflowRole } from './index';

export interface CreateChangeSetActionProps {
  readonly stackName: string;
  readonly templateArtifact: WorkflowArtifact;
  readonly templatePath: string;

  readonly account?: string;
  readonly region?: string;
  readonly assumeRoleArn?: string;
  readonly executionRoleArn?: string;

  readonly templateConfigurationPath?: string;
}

export class CreateChangeSetAction extends WorkflowAction {
  constructor(name: string, public readonly props: CreateChangeSetActionProps) {
    super(name, { role: WorkflowRole.PREPARE_CHANGESET });

    this.dependOn(props.templateArtifact.producer);
  }
}

export interface ExecuteChangeSetActionProps {
  readonly stackName: string;

  readonly account?: string;
  readonly region?: string;
  readonly assumeRoleArn?: string;

  readonly outputArtifact?: WorkflowArtifact;
  readonly outputFileName?: string;
}

export class ExecuteChangeSetAction extends WorkflowAction {
  constructor(name: string, public readonly props: ExecuteChangeSetActionProps) {
    super(name, { role: WorkflowRole.EXECUTE_CHANGESET });

    props.outputArtifact?.producedBy(this);
  }
}