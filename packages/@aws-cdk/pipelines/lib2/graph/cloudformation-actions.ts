import { ExecutionAction, ExecutionArtifact } from './index';

export interface CreateChangeSetActionProps {
  readonly stackName: string;
  readonly templateArtifact: ExecutionArtifact;
  readonly templatePath: string;

  readonly account?: string;
  readonly region?: string;
  readonly assumeRoleArn?: string;
  readonly executionRoleArn?: string;

  readonly templateConfigurationPath?: string;
}

export class CreateChangeSetAction extends ExecutionAction {
  constructor(name: string, public readonly props: CreateChangeSetActionProps) {
    super(name);

    this.dependOn(props.templateArtifact.producer);
  }
}

export interface ExecuteChangeSetActionProps {
  readonly stackName: string;

  readonly account?: string;
  readonly region?: string;
  readonly assumeRoleArn?: string;

  readonly outputArtifact?: ExecutionArtifact;
  readonly outputFileName?: string;
}

export class ExecuteChangeSetAction extends ExecutionAction {
  constructor(name: string, public readonly props: ExecuteChangeSetActionProps) {
    super(name);

    props.outputArtifact?.producedBy(this);
  }
}