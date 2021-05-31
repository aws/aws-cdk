import { WorkflowAction, WorkflowArtifact, WorkflowNodeProps } from './index';

export interface ShellArtifact {
  readonly directory: string;
  readonly artifact: WorkflowArtifact;
}

export interface WorkflowShellActionProps extends WorkflowNodeProps {
  readonly installCommands?: string[];
  readonly commands?: string[];
  readonly environmentVariables?: Record<string, string>;
  readonly inputs?: ShellArtifact[];
  readonly outputs?: ShellArtifact[];
}

export class WorkflowShellAction extends WorkflowAction {
  public readonly installCommands: string[];
  public readonly commands: string[];
  public readonly inputs: ShellArtifact[];
  public readonly outputs: ShellArtifact[];
  public readonly environmentVariables: Record<string, string>;

  constructor(name: string, public readonly props: WorkflowShellActionProps) {
    super(name, props);

    this.inputs = props.inputs ?? [];
    this.outputs = props.outputs ?? [];
    this.installCommands = props.installCommands ?? [];
    this.commands = props.commands ?? [];
    this.environmentVariables = props.environmentVariables ?? {};

    this.dependOn(...this.inputs.map(i => i.artifact.producer));
    for (const output of this.outputs) {
      output.artifact.producedBy(this);
    }
  }
}
