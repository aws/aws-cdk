import * as path from 'path';
import { toPosixPath } from '../../../private/fs';
import { WorkflowArtifact, WorkflowRole, WorkflowShellAction } from '../../workflow';
import { AddToWorkflowOptions, IArtifactable } from '../artifactable';

export interface CdkBuildProps {
  readonly input?: IArtifactable;
  readonly installCommands?: string[];
  readonly buildCommands?: string[];
  readonly testCommands?: string[];
  readonly subdirectory?: string;
  readonly environmentVariables?: Record<string, string>;
}

export class CdkBuild implements IArtifactable {
  public readonly primaryOutput = new WorkflowArtifact('CloudAssemblyArtifact');

  constructor(private readonly props: CdkBuildProps = {}) {
  }

  public addToWorkflow(options: AddToWorkflowOptions): void {
    this.props.input?.addToWorkflow(options);
    const inputArtifact = this.props.input?.primaryOutput;

    const action = new WorkflowShellAction('Synth', {
      role: WorkflowRole.BUILD,
      installCommands: [
        ...this.props.subdirectory ? [`cd ${this.props.subdirectory}`] : [],
        ...this.props.installCommands ?? [],
      ],
      commands: [
        ...this.props.buildCommands ?? [],
        ...this.props.testCommands ?? [],
      ],
      environmentVariables: this.props.environmentVariables,
      inputs: [
        ...inputArtifact ? [{ artifact: inputArtifact, directory: '.' }] : [],
      ],
      outputs: [
        {
          directory: toPosixPath(path.join(this.props.subdirectory ?? '.', 'cdk.out')),
          artifact: this.primaryOutput,
        },
      ],
    });

    options.parent.add(action);
    options.workflow.recordCloudAssemblyArtifact(this.primaryOutput);
  }
}
