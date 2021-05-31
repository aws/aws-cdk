import * as path from 'path';
import { toPosixPath } from '../../../private/fs';
import { WorkflowArtifact, WorkflowRole, WorkflowShellAction } from '../../workflow';
import { AddToWorkflowOptions, IArtifactable } from '../artifactable';
import { AdditionalBuildOutput } from './additional-outputs';

export interface CdkBuildProps {
  readonly input?: IArtifactable;
  readonly installCommands?: string[];
  readonly buildCommands?: string[];
  readonly testCommands?: string[];
  readonly subdirectory?: string;
  readonly environmentVariables?: Record<string, string>;
  readonly additionalOutputs?: Record<string, AdditionalBuildOutput>;
}

export class CdkBuild implements IArtifactable {
  public readonly primaryOutput = new WorkflowArtifact('CloudAssemblyArtifact');

  private readonly _additionalArtifacts: Record<string, WorkflowArtifact> = {};

  constructor(private readonly props: CdkBuildProps = {}) {
  }

  public additionalOutput(name: string) {
    if (!(name in this._additionalArtifacts)) {
      throw new Error(`No output defined with name '${name}'. Pass it in 'additionalBuildArtifacts'`);
    }
    return this._additionalArtifacts[name];
  }

  public addToWorkflow(options: AddToWorkflowOptions): void {
    this.props.input?.addToWorkflow(options);
    const inputArtifact = this.props.input?.primaryOutput;

    for (const name of Object.keys(this.props.additionalOutputs ?? {})) {
      this._additionalArtifacts[name] = new WorkflowArtifact(`Build:${name}`);
    }

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
        ...Object.entries(this.props.additionalOutputs ?? {}).map(([name, art]) => ({
          directory: toPosixPath(path.join(this.props.subdirectory ?? '.', art.baseDirectory)),
          artifact: this._additionalArtifacts[name],
        })),
      ],
    });

    options.parent.add(action);
    options.workflow.recordCloudAssemblyArtifact(this.primaryOutput);
  }
}
