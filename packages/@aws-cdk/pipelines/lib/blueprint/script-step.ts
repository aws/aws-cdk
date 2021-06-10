import { FileSet, IFileSet } from './file-set';
import { Step } from './step';

export interface ScriptStepProps {
  readonly commands: string[];
  readonly installCommands?: string[];
  readonly env?: Record<string, string>;

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

  public readonly inputs: FileSetLocation[] = [];
  public readonly outputs: FileSetLocation[] = [];

  private readonly _additionalOutputs: Record<string, FileSet> = {};

  constructor(id: string, props: ScriptStepProps) {
    super(id);

    this.commands = props.commands;
    this.installCommands = props.installCommands ?? [];
    this.env = props.env ?? {};

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