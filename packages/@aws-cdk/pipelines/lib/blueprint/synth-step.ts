import * as path from 'path';
import { toPosixPath } from '../private/fs';
import { mkdict } from '../private/javascript';
import { IFileSetProducer } from './file-set';
import { ScriptStep } from './script-step';

/**
 * Construction properties for a `SynthStep`
 */
export interface SynthStepProps {
  /**
   * Subdirectory of the input FileSet that contains the CDK app to synthesize
   *
   * The very first command executed will be a `cd` to the given subdirectory,
   * and all *output* fileset paths will be relative to the given subdirectory.
   *
   * If you want to change the value of `subdirectory`, you will typically need
   * to do so in multiple stages: first make the build succeed in both the old
   * and the new subdirectory, and only then change the property value.
   *
   * @default '.'
   */
  readonly subdirectory?: string;

  /**
   * Commands to run to synthesize a Cloud Assembly
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
   * FileSet with the CDK app source
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
   * Directory that contains the Cloud Assembly output
   *
   * @default 'cdk.out'
   */
  readonly cloudAssemblyOutputDirectory?: string;
}

/**
 * A `ScriptStep` that knows about CDK app synthesis
 *
 * This class adds some defaults on top of a regular `ScriptStep`:
 *
 * - It knows that the default output directory of a synth
 *   command is `cdk.out`.
 * - It supports a `subdirectory` property, which you can use
 *   if your CDK app lives somewhere other than the root of the
 *   repository.
 *
 * This is a convenience class you do not have to use; you can also use a
 * regular `ScriptStep` or `CodeBuildStep` instead. If you do, do not forget to
 * pass `primaryOutputDirectory: 'cdk.out'`.
 */
export class SynthStep extends ScriptStep {
  private readonly subdirectory: string;

  constructor(id: string, props: SynthStepProps) {
    const subdirectory = props.subdirectory ?? '.';

    super(id, {
      ...props,
      installCommands: [
        ...subdirectory !== '.' ? [`cd ${subdirectory}`] : [],
        ...props.installCommands ?? [],
      ],
      additionalInputs: mkdict(Object.entries(props.additionalInputs ?? {}).map(([dir, fileSet]) =>
        [toPosixPath(dir), fileSet] as const,
      )),
      primaryOutputDirectory: path.join(subdirectory, props.cloudAssemblyOutputDirectory ?? 'cdk.out'),
    });

    this.subdirectory = subdirectory;
  }

  public addOutputDirectory(directory: string) {
    return super.addOutputDirectory(path.join(this.subdirectory, directory));
  }
}