import { CfnOutput, Stack } from '@aws-cdk/core';
import { mapValues } from '../private/javascript';
import { FileSet, IFileSet } from './file-set';
import { StackDeployment } from './stack-deployment';
import { Step } from './step';

export interface ScriptStepProps {
  readonly commands: string[];
  readonly installCommands?: string[];
  readonly env?: Record<string, string>;
  readonly envFromOutputs?: Record<string, CfnOutput>;

  readonly input?: IFileSet;
  readonly additionalInputs?: Record<string, IFileSet>;

  readonly primaryOutputDirectory?: string;
  readonly additionalOutputDirectories?: Record<string, string>;
}

export class ScriptStep extends Step {
  public readonly primaryOutput?: FileSet | undefined;
  public readonly commands: string[];
  public readonly installCommands: string[];
  public readonly env: Record<string, string>;
  public readonly envFromOutputs: Record<string, StackOutputReference>;

  public readonly inputs: FileSetLocation[] = [];
  public readonly outputs: FileSetLocation[] = [];

  private readonly _additionalOutputs: Record<string, FileSet> = {};

  constructor(id: string, props: ScriptStepProps) {
    super(id);

    this.commands = props.commands;
    this.installCommands = props.installCommands ?? [];
    this.env = props.env ?? {};
    this.envFromOutputs = mapValues(props.envFromOutputs ?? {}, StackOutputReference.fromCfnOutput);

    // Inputs
    if (props.input) {
      const fileSet = props.input.primaryOutput;
      if (!fileSet) {
        throw new Error(`'${id}': primary input should be a step that produces a file set, got ${props.input}`);
      }
      this.requireFileSet(fileSet);
      this.inputs.push({ directory: '.', fileSet });
    }

    for (const [directory, step] of Object.entries(props.additionalInputs ?? {})) {
      if (directory === '.') {
        throw new Error(`'${id}': input for directory '.' should be passed via 'input' property`);
      }

      const fileSet = step.primaryOutput;
      if (!fileSet) {
        throw new Error(`'${id}': additionalInput for directory '${directory}' should be a step that produces a file set, got ${step}`);
      }
      this.requireFileSet(fileSet);
      this.inputs.push({ directory, fileSet });
    }

    // Outputs

    if (props.primaryOutputDirectory) {
      this.primaryOutput = new FileSet('Output', this);
      this.outputs.push({ directory: props.primaryOutputDirectory, fileSet: this.primaryOutput });
    }

    for (const [name, directory] of Object.entries(props.additionalOutputDirectories ?? {})) {
      const fileSet = new FileSet(directory, this);
      this._additionalOutputs[name] = fileSet;
      this.outputs.push({ directory, fileSet });
    }
  }

  public additionalOutput(name: string): FileSet {
    const fs = this._additionalOutputs[name];
    if (!fs) {
      throw new Error(`No additional output defined with name '${name}'. Define it by passing 'additionalOutputs'`);
    }
    return fs;
  }
}

export interface FileSetLocation {
  readonly directory: string;
  readonly fileSet: FileSet;
}

export class StackOutputReference {
  public static fromCfnOutput(output: CfnOutput) {
    const stack = Stack.of(output);
    return new StackOutputReference(stack.node.path, stack.artifactId, stack.resolve(output.logicalId));
  }

  private constructor(public readonly stackDescription: string, private readonly stackArtifactId: string, public readonly outputName: string) {
  }

  public isProducedBy(stack: StackDeployment) {
    return stack.stackArtifactId === this.stackArtifactId;
  }
}