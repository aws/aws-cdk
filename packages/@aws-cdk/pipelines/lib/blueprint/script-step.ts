import { CfnOutput, Stack } from '@aws-cdk/core';
import { mapValues } from '../private/javascript';
import { FileSet, IFileSetProducer } from './file-set';
import { StackDeployment } from './stack-deployment';
import { Step } from './step';

/**
 * Construction properties for a `ScriptStep`.
 */
export interface ScriptStepProps {
  /**
   * Commands to run
   */
  readonly commands: string[];

  /**
   * Installation commands to run before the regular commands
   *
   * For deployment engines that support it, install commands will be classified
   * differently in the job history from the regular `commands`.
   *
   * @default - No installation commands
   */
  readonly installCommands?: string[];

  /**
   * Environment variables to set
   *
   * @default - No environment variables
   */
  readonly env?: Record<string, string>;

  /**
   * Set environment variables based on Stack Outputs
   *
   * `ScriptSteps` following stack or stage deployments may
   * access the `CfnOutput`s of those stacks to get access to
   * --for example--automatically generated resource names or
   * endpoint URLs.
   *
   * @default - No environment variables created from stack outputs
   */
  readonly envFromOutputs?: Record<string, CfnOutput>;

  /**
   * FileSet to run these scripts on
   *
   * The files in the FileSet will be in the working directory when
   * the script is executed.
   *
   * @default - No input specified
   */
  readonly input?: IFileSetProducer;

  /**
   * Additional FileSets to put in other directories
   *
   * Specifies a mapping from directory name to FileSets. During the
   * script execution, the FileSets will be available in the directories
   * indicated.
   *
   * The directory names may be relative. For example, you can put
   * the main input and an additional input side-by-side with the
   * following configuration:
   *
   * ```ts
   * const script = new ScriptStep('MainScript', {
   *   // ...
   *   input: MyEngineSource.gitHub('org/source1'),
   *   additionalInputs: {
   *     '../siblingdir': MyEngineSource.gitHub('org/source2'),
   *   }
   * });
   * ```
   *
   * @default - No additional inputs
   */
  readonly additionalInputs?: Record<string, IFileSetProducer>;

  /**
   * The directory that will contain the primary output fileset
   *
   * After running the script, the contents of the given directory
   * will be treated as the primary output of this Step.
   *
   * @default - No primary output
   */
  readonly primaryOutputDirectory?: string;

  /**
   * Additional directories that contain output FileSets.
   *
   * A map of output name to relative directory name (N.B.: this is
   * reversed from `additionalInputs`).
   *
   * After running the script, the contents of the given directory
   * will be exported as `FileSet`s. The `FileSet` objects can be
   * retrieved by calling `additionalOutut(name)`.
   *
   * The following example exports the `cdk.out` directory as primary
   * output, and the `integ` directory as an additional output
   * with the name `IntegrationTests`:
   *
   * ```ts
   * const script = new ScriptStep('MainScript', {
   *   // ...
   *   primaryOutputDirectory: 'cdk.out',
   *   additionalOutputDirectories: {
   *     IntegrationTests: 'integ',
   *   }
   * });
   * ```
   *
   * @default - No additional outputs
   */
  readonly additionalOutputDirectories?: Record<string, string>;
}

/**
 * Run shell script commands in the pipeline
 */
export class ScriptStep extends Step {
  public readonly primaryOutput?: FileSet | undefined;
  /**
   * Commands to run
   */
  public readonly commands: string[];

  /**
   * Installation commands to run before the regular commands
   *
   * For deployment engines that support it, install commands will be classified
   * differently in the job history from the regular `commands`.
   *
   * @default - No installation commands
   */
  public readonly installCommands: string[];

  /**
   * Environment variables to set
   *
   * @default - No environment variables
   */
  public readonly env: Record<string, string>;

  /**
   * Set environment variables based on Stack Outputs
   *
   * @default - No environment variables created from stack outputs
   */
  public readonly envFromOutputs: Record<string, StackOutputReference>;

  /**
   * Input FileSets
   *
   * A list of `(FileSet, directory)` pairs.
   */
  public readonly inputs: FileSetLocation[] = [];

  /**
   * Output FileSets
   *
   * A list of `(FileSet, directory)` pairs.
   */
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

  /**
   * Retrieve an additional output by name
   *
   * The name must have been configured by passing
   * `additionalOutputDirectories`.
   */
  public additionalOutput(name: string): FileSet {
    const fs = this._additionalOutputs[name];
    if (!fs) {
      throw new Error(`No additional output defined with name '${name}'. Define it by passing 'additionalOutputs'`);
    }
    return fs;
  }
}

/**
 * Location of a FileSet consumed or produced by a ScriptStep
 */
export interface FileSetLocation {
  /**
   * The (relative) directory where the FileSet is found
   */
  readonly directory: string;

  /**
   * The FileSet object
   */
  readonly fileSet: FileSet;
}

/**
 * A Reference to a Stack Output
 */
export class StackOutputReference {
  /**
   * Create a StackOutputReference that references the given CfnOutput
   */
  public static fromCfnOutput(output: CfnOutput) {
    const stack = Stack.of(output);
    return new StackOutputReference(stack.node.path, stack.artifactId, stack.resolve(output.logicalId));
  }

  private constructor(
    /** A human-readable description of the producing stack */
    public readonly stackDescription: string,
    /** Artifact id of the producing stack */
    private readonly stackArtifactId: string,
    /** Output name of the producing stack */
    public readonly outputName: string) {
  }

  /**
   * Whether or not this stack output is being produced by the given Stack deployment
   */
  public isProducedBy(stack: StackDeployment) {
    return stack.stackArtifactId === this.stackArtifactId;
  }
}