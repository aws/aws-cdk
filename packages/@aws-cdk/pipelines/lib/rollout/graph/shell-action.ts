import { ComputeType } from '../shared';
import { CommandImage } from '../shared/image';
import { ExecutionAction, ExecutionArtifact } from './index';

export interface ShellArtifact {
  readonly directory: string;
  readonly artifact: ExecutionArtifact;
}

export interface ExecutionShellActionProps {
  readonly installCommands?: string[];
  readonly buildCommands?: string[];
  readonly image?: CommandImage;
  readonly computeType?: ComputeType;
  readonly buildsDockerImages?: boolean;
  readonly testReports?: boolean;
  readonly environmentVariables?: Record<string, string>;
  readonly inputs?: ShellArtifact[];
  readonly outputs?: ShellArtifact[];
}

export class ExecutionShellAction extends ExecutionAction {
  public readonly installCommands: string[];
  public readonly buildCommands: string[];
  public readonly inputs: ShellArtifact[];
  public readonly outputs: ShellArtifact[];
  public readonly image: CommandImage;
  public readonly buildsDockerImages: boolean;
  public readonly environmentVariables: Record<string, string>;
  public readonly computeType: ComputeType;

  constructor(name: string, public readonly props: ExecutionShellActionProps) {
    super(name);

    this.inputs = props.inputs ?? [];
    this.outputs = props.outputs ?? [];
    this.installCommands = props.installCommands ?? [];
    this.buildCommands = props.buildCommands ?? [];
    this.image = props.image ?? CommandImage.GENERIC_LINUX;
    this.computeType = props.computeType ?? ComputeType.default;
    this.buildsDockerImages = props.buildsDockerImages ?? false;
    this.environmentVariables = props.environmentVariables ?? {};

    this.dependOn(...this.inputs.map(i => i.artifact.producer));
    for (const output of this.outputs) {
      output.artifact.producedBy(this);
    }
  }
}
