import { renderEnvExport } from './private/commands-factory';
import { makeCodePipelineOutput } from './private/outputs';
import type * as codebuild from '../../../aws-codebuild';
import type * as cpa from '../../../aws-codepipeline-actions';
import type * as ec2 from '../../../aws-ec2';
import type * as iam from '../../../aws-iam';
import type { CfnOutput } from '../../../core';
import { Token, UnscopedValidationError } from '../../../core';
import { lit } from '../../../core/lib/private/literal-string';
import type { FileSetLocation, IFileSetProducer } from '../blueprint';
import { FileSet, StackOutputReference, Step } from '../blueprint';
import { mapValues } from '../private/javascript';

/**
 * The maximum number of commands of a Commands action
 */
const MAX_COMMANDS = 50;

/**
 * The maximum length of a single command of a Commands action
 */
const MAX_COMMAND_LENGTH = 1000;

/**
 * The maximum number of input artifacts of a Commands action
 */
const MAX_INPUTS = 10;

/**
 * The maximum number of file patterns of an output artifact
 */
const MAX_OUTPUT_FILES = 10;

/**
 * The maximum number of output variables of a Commands action
 */
const MAX_OUTPUT_VARIABLES = 15;

/**
 * Construction properties for a `CommandsStep`
 */
export interface CommandsStepProps {
  /**
   * Shell commands to run
   *
   * Every command must be a single line. The Commands action runs at most 50
   * commands, including the commands that this step adds to set environment
   * variables (one per variable) and to link additional inputs (one per input).
   */
  readonly commands: string[];

  /**
   * FileSet to run these commands on
   *
   * The files in the FileSet will be placed in the working directory when
   * the commands are executed. Use `additionalInputs` to download file sets
   * to other directories as well.
   *
   * @default - the first artifact produced in the pipeline (normally the source)
   */
  readonly input?: IFileSetProducer;

  /**
   * Additional FileSets to put in other directories
   *
   * Specifies a mapping from directory name to FileSets. During the
   * execution of the commands, the FileSets will be available in the
   * directories indicated, which may be relative to the working directory
   * (for example `'../siblingdir'`).
   *
   * At most 9 additional inputs are supported, because the Commands
   * action accepts at most 10 input artifacts.
   *
   * @default - No additional inputs
   */
  readonly additionalInputs?: Record<string, IFileSetProducer>;

  /**
   * Files to export as the primary output of this step
   *
   * The patterns use the CodeBuild file pattern syntax (for example
   * `'report/**'`), relative to the working directory. Unlike the
   * `primaryOutputDirectory` of a `ShellStep`, the matching files keep their
   * path: a file `report/result.txt` is found at `report/result.txt` in the
   * output FileSet.
   *
   * Between 1 and 10 patterns can be specified.
   *
   * @default - No primary output
   */
  readonly outputFiles?: string[];

  /**
   * Names of the environment variables to export as CodePipeline variables
   *
   * Variables are also exported when you reference them with
   * `exportedVariable()`, so you only need this property for variables
   * that no step in this pipeline consumes. At most 15 variables can be exported.
   *
   * @default - Only the variables referenced with `exportedVariable()` are exported
   */
  readonly outputVariables?: string[];

  /**
   * Environment variables to set
   *
   * The values may reference CodePipeline variables, such as the
   * `exportedVariable()` of another step. The variables are set by
   * `export` commands that run before `commands`, so they count towards
   * the limit of 50 commands. Values that are resolved when the pipeline
   * runs (CodePipeline variables) must not contain single quotes.
   *
   * @default - No environment variables
   */
  readonly env?: Record<string, string>;

  /**
   * Set environment variables based on Stack Outputs
   *
   * `CommandsStep`s following stack or stage deployments may
   * access the `CfnOutput`s of those stacks to get access to
   * --for example--automatically generated resource names or
   * endpoint URLs. The same considerations as for `env` apply.
   *
   * @default - No environment variables created from stack outputs
   */
  readonly envFromCfnOutputs?: Record<string, CfnOutput>;

  /**
   * The operating system image of the build environment that runs the commands
   *
   * `env`, `envFromCfnOutputs` and `additionalInputs` require a Linux environment.
   *
   * @default - CodePipeline uses `LINUX_CONTAINER`
   */
  readonly environmentType?: cpa.CommandsEnvironmentType;

  /**
   * The compute type of the build environment that runs the commands
   *
   * Only `ComputeType.SMALL`, `ComputeType.MEDIUM` and `ComputeType.LARGE` are supported.
   *
   * The `codeBuildDefaults` of the pipeline do not apply to a `CommandsStep`.
   *
   * @default - CodePipeline uses `BUILD_GENERAL1_SMALL`
   */
  readonly computeType?: codebuild.ComputeType;

  /**
   * The VPC in which to run the commands
   *
   * The `codeBuildDefaults` of the pipeline do not apply to a `CommandsStep`.
   *
   * @default - the commands do not run in a VPC
   */
  readonly vpc?: ec2.IVpc;

  /**
   * Which subnets to use
   *
   * Only used if `vpc` is supplied.
   *
   * @default - All private subnets
   */
  readonly subnetSelection?: ec2.SubnetSelection;

  /**
   * The security groups to associate with the network interfaces of the build environment
   *
   * Only used if `vpc` is supplied.
   *
   * @default - a new security group that allows all outbound traffic is created
   */
  readonly securityGroups?: ec2.ISecurityGroup[];

  /**
   * Custom execution role for the Commands action
   *
   * The commands run with the credentials of this role.
   *
   * @default - A role is automatically created, or the pipeline role is used if `usePipelineRoleForActions` is set on the pipeline
   */
  readonly actionRole?: iam.IRole;

  /**
   * Policy statements to add to the role that the commands run with
   *
   * Can be used to allow the commands to call AWS APIs.
   *
   * @default - No policy statements are added
   */
  readonly rolePolicyStatements?: iam.PolicyStatement[];
}

/**
 * Run shell commands with the CodePipeline Commands action
 *
 * The commands run on CodeBuild compute that CodePipeline manages, without a
 * CodeBuild project. This step can only be used in pipelines of type
 * `PipelineType.V2`.
 *
 * Use a `ShellStep` or `CodeBuildStep` if you need a custom build image,
 * a build timeout other than 55 minutes, caching, privileged mode or
 * multiple output directories.
 *
 * @see https://docs.aws.amazon.com/codepipeline/latest/userguide/action-reference-Commands.html
 */
export class CommandsStep extends Step {
  /**
   * Commands to run
   */
  public readonly commands: string[];

  /**
   * Environment variables to set
   */
  public readonly env: Record<string, string>;

  /**
   * Environment variables set from Stack Outputs
   */
  public readonly envFromCfnOutputs: Record<string, StackOutputReference>;

  /**
   * Input FileSets
   *
   * A list of `(FileSet, directory)` pairs, which are a copy of the
   * input properties. This list should not be modified directly.
   */
  public readonly inputs: FileSetLocation[] = [];

  /**
   * Files exported as the primary output of this step
   *
   * @default - No primary output
   */
  public readonly outputFiles?: string[];

  /**
   * The operating system image of the build environment that runs the commands
   *
   * @default - CodePipeline uses `LINUX_CONTAINER`
   */
  public readonly environmentType?: cpa.CommandsEnvironmentType;

  /**
   * The compute type of the build environment that runs the commands
   *
   * @default - CodePipeline uses `BUILD_GENERAL1_SMALL`
   */
  public readonly computeType?: codebuild.ComputeType;

  /**
   * The VPC in which to run the commands
   *
   * @default - the commands do not run in a VPC
   */
  public readonly vpc?: ec2.IVpc;

  /**
   * Which subnets to use
   *
   * @default - All private subnets
   */
  public readonly subnetSelection?: ec2.SubnetSelection;

  /**
   * The security groups to associate with the network interfaces of the build environment
   *
   * @default - a new security group that allows all outbound traffic is created
   */
  public readonly securityGroups?: ec2.ISecurityGroup[];

  /**
   * Custom execution role for the Commands action
   *
   * @default - A role is automatically created
   */
  public readonly actionRole?: iam.IRole;

  /**
   * Policy statements to add to the role that the commands run with
   *
   * @default - No policy statements are added
   */
  public readonly rolePolicyStatements?: iam.PolicyStatement[];

  private readonly _outputVariables = new Set<string>();
  private outputVariablesRendered = false;

  constructor(id: string, props: CommandsStepProps) {
    super(id);

    this.commands = props.commands;
    this.env = props.env ?? {};
    this.envFromCfnOutputs = mapValues(props.envFromCfnOutputs ?? {}, x => StackOutputReference.fromCfnOutput(x));
    this.outputFiles = props.outputFiles;
    this.environmentType = props.environmentType;
    this.computeType = props.computeType;
    this.vpc = props.vpc;
    this.subnetSelection = props.subnetSelection;
    this.securityGroups = props.securityGroups;
    this.actionRole = props.actionRole;
    this.rolePolicyStatements = props.rolePolicyStatements;

    // Both the commands and the environment variables can reference outputs of other steps
    this.discoverReferencedOutputs({
      commands: this.commands,
      env: this.env,
    });

    // Inputs
    if (props.input) {
      const fileSet = props.input.primaryOutput;
      if (!fileSet) {
        throw new UnscopedValidationError(lit`CommandsStepInputNoFileSet`, `'${id}': primary input should be a step that has produced a file set, got ${props.input}`);
      }
      this.addDependencyFileSet(fileSet);
      this.inputs.push({ directory: '.', fileSet });
    }

    const additionalInputs = Object.entries(props.additionalInputs ?? {});
    if (additionalInputs.length > MAX_INPUTS - 1) {
      throw new UnscopedValidationError(lit`CommandsStepTooManyInputs`, `'${id}': the Commands action supports at most ${MAX_INPUTS - 1} additional inputs, got ${additionalInputs.length}`);
    }
    for (const [directory, step] of additionalInputs) {
      if (directory === '.') {
        throw new UnscopedValidationError(lit`CommandsStepInputDirectory`, `'${id}': input for directory '.' should be passed via 'input' property`);
      }
      const fileSet = step.primaryOutput;
      if (!fileSet) {
        throw new UnscopedValidationError(lit`CommandsStepAdditionalInputNoFileSet`, `'${id}': additionalInput for directory '${directory}' should be a step that has produced a file set, got ${step}`);
      }
      this.addDependencyFileSet(fileSet);
      this.inputs.push({ directory, fileSet });
    }

    // Outputs
    if (props.outputFiles !== undefined) {
      if (props.outputFiles.length < 1 || props.outputFiles.length > MAX_OUTPUT_FILES) {
        throw new UnscopedValidationError(lit`CommandsStepInvalidOutputFilesLength`, `'${id}': 'outputFiles' must contain between 1 and ${MAX_OUTPUT_FILES} patterns, got ${props.outputFiles.length}`);
      }
      this.configurePrimaryOutput(new FileSet('Output', this));
    }

    for (const variableName of props.outputVariables ?? []) {
      this._outputVariables.add(variableName);
    }
    if (props.outputVariables !== undefined) {
      this.validateOutputVariables();
    }

    this.validateCommands(id, additionalInputs.length);
  }

  /**
   * Reference a CodePipeline variable exported by this step
   *
   * The variable must be set in the shell by the `commands` of this step,
   * for example with `export MY_VAR=hello`. It is added to the output variables
   * of the Commands action.
   *
   * @param variableName the name of the environment variable to export
   */
  public exportedVariable(variableName: string): string {
    if (this.outputVariablesRendered && !this._outputVariables.has(variableName)) {
      throw new UnscopedValidationError(lit`CommandsStepExportedVariableAfterRender`, 'exportedVariable(): Pipeline has already been produced, cannot call this function anymore');
    }

    this._outputVariables.add(variableName);
    this.validateOutputVariables();

    return makeCodePipelineOutput(this, variableName);
  }

  /**
   * The names of the variables exported by this step
   *
   * @default - No variables are exported
   */
  public get outputVariables(): string[] | undefined {
    return this._outputVariables.size > 0 ? Array.from(this._outputVariables) : undefined;
  }

  public get consumedStackOutputs(): StackOutputReference[] {
    return Object.values(this.envFromCfnOutputs);
  }

  /**
   * Return the output variables and prevent further additions
   *
   * @internal
   */
  public _renderOutputVariables(): string[] | undefined {
    this.outputVariablesRendered = true;
    return this.outputVariables;
  }

  private validateOutputVariables() {
    if (this._outputVariables.size < 1 || this._outputVariables.size > MAX_OUTPUT_VARIABLES) {
      throw new UnscopedValidationError(lit`CommandsStepInvalidOutputVariablesLength`, `'${this.id}': a Commands action can export between 1 and ${MAX_OUTPUT_VARIABLES} output variables, got ${this._outputVariables.size}`);
    }
  }

  private validateCommands(id: string, additionalInputCount: number) {
    if (this.commands.length < 1) {
      throw new UnscopedValidationError(lit`CommandsStepNoCommands`, `'${id}': 'commands' must contain at least one command`);
    }
    for (const command of this.commands) {
      if (Token.isUnresolved(command)) {
        continue;
      }
      if (/[\r\n]/.test(command)) {
        throw new UnscopedValidationError(lit`CommandsStepMultiLineCommand`, `'${id}': the Commands action does not support multi-line commands, got: ${JSON.stringify(command)}`);
      }
      if (command.length > MAX_COMMAND_LENGTH) {
        throw new UnscopedValidationError(lit`CommandsStepCommandTooLong`, `'${id}': a command of the Commands action can be at most ${MAX_COMMAND_LENGTH} characters long, got ${command.length} characters`);
      }
    }

    const envNames = [...Object.keys(this.env), ...Object.keys(this.envFromCfnOutputs)];
    for (const name of envNames) {
      if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(name)) {
        throw new UnscopedValidationError(lit`CommandsStepInvalidEnvName`, `'${id}': environment variable names must start with a letter or underscore and contain only letters, digits and underscores, got: ${JSON.stringify(name)}`);
      }
    }
    for (const [name, value] of Object.entries(this.env)) {
      if (Token.isUnresolved(value) || value.includes('#{')) {
        continue;
      }
      const length = renderEnvExport(name, value).length;
      if (length > MAX_COMMAND_LENGTH) {
        throw new UnscopedValidationError(lit`CommandsStepEnvTooLong`, `'${id}': the value of environment variable '${name}' is too long, the command that sets it can be at most ${MAX_COMMAND_LENGTH} characters long, got ${length} characters`);
      }
    }

    const generatedCommands = envNames.length + additionalInputCount;
    if (generatedCommands > 0 && this.environmentType && this.environmentType.value.startsWith('WINDOWS')) {
      throw new UnscopedValidationError(lit`CommandsStepWindowsGeneratedCommands`, `'${id}': 'env', 'envFromCfnOutputs' and 'additionalInputs' are only supported in a Linux environment, got environment type ${this.environmentType.value}`);
    }

    const total = this.commands.length + generatedCommands;
    if (total > MAX_COMMANDS) {
      throw new UnscopedValidationError(lit`CommandsStepTooManyCommands`, `'${id}': the Commands action supports at most ${MAX_COMMANDS} commands, got ${total} (${this.commands.length} commands, ${envNames.length} environment variables and ${additionalInputCount} additional inputs, which add one command each)`);
    }
  }
}
