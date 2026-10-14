import { makeCodePipelineOutput } from './private/outputs';
import type * as codebuild from '../../../aws-codebuild';
import type * as cpa from '../../../aws-codepipeline-actions';
import type * as ec2 from '../../../aws-ec2';
import type * as iam from '../../../aws-iam';
import { Token, UnscopedValidationError } from '../../../core';
import { lit } from '../../../core/lib/private/literal-string';
import type { FileSetLocation, IFileSetProducer } from '../blueprint';
import { FileSet, Step } from '../blueprint';

/**
 * The maximum number of commands of a Commands action
 */
const MAX_COMMANDS = 50;

/**
 * The maximum length of a single command of a Commands action
 */
const MAX_COMMAND_LENGTH = 1000;

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
   * Every command must be a single line, and the Commands action runs at most 50
   * commands.
   *
   * Environment variables are not supported yet. A command may reference the
   * `exportedVariable()` of another step: CodePipeline substitutes the value
   * of the variable into the command text before the command runs. Such values
   * are not quoted or escaped, so only reference variables whose values you
   * trust, and quote them as appropriate for the shell.
   */
  readonly commands: string[];

  /**
   * FileSet to run these commands on
   *
   * The files in the FileSet will be placed in the working directory when
   * the commands are executed.
   *
   * @default - the first artifact produced in the pipeline (normally the source)
   */
  readonly input?: IFileSetProducer;

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
   * The operating system image of the build environment that runs the commands
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
   * The statements are added to the role of the Commands action (`actionRole`,
   * a role created for the action, or the pipeline role if `usePipelineRoleForActions`
   * is set on the pipeline). This differs from `CodeBuildStep`, which adds its
   * `rolePolicyStatements` to the role of its CodeBuild project.
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
 * `PipelineType.V2`. The pipeline type is read from the `pipelineType`
 * property of the pipeline; a pipeline type set with
 * `addPropertyOverride('PipelineType', ...)` is not detected.
 *
 * Use a `ShellStep` or `CodeBuildStep` if you need a custom build image,
 * a build timeout other than 55 minutes, caching, privileged mode,
 * environment variables, additional inputs or multiple output directories.
 *
 * @see https://docs.aws.amazon.com/codepipeline/latest/userguide/action-reference-Commands.html
 */
export class CommandsStep extends Step {
  /**
   * Commands to run
   */
  public readonly commands: string[];

  /**
   * Input FileSets
   *
   * A list of `(FileSet, directory)` pairs, which are a copy of the
   * input properties. A `CommandsStep` has at most one input, in the
   * directory `'.'`. This list should not be modified directly.
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
   * Policy statements to add to the role of the Commands action
   *
   * @default - No policy statements are added
   */
  public readonly rolePolicyStatements?: iam.PolicyStatement[];

  private readonly _outputVariables = new Set<string>();
  private outputVariablesRendered = false;

  constructor(id: string, props: CommandsStepProps) {
    super(id);

    this.commands = props.commands;
    this.outputFiles = props.outputFiles;
    this.environmentType = props.environmentType;
    this.computeType = props.computeType;
    this.vpc = props.vpc;
    this.subnetSelection = props.subnetSelection;
    this.securityGroups = props.securityGroups;
    this.actionRole = props.actionRole;
    this.rolePolicyStatements = props.rolePolicyStatements;

    // The commands can reference outputs of other steps
    this.discoverReferencedOutputs({
      commands: this.commands,
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

    this.validateCommands(id);
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

    if (!this._outputVariables.has(variableName) && this._outputVariables.size >= MAX_OUTPUT_VARIABLES) {
      throw new UnscopedValidationError(lit`CommandsStepInvalidOutputVariablesLength`, `'${this.id}': a Commands action can export between 1 and ${MAX_OUTPUT_VARIABLES} output variables, got ${this._outputVariables.size + 1}`);
    }
    this._outputVariables.add(variableName);

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

  private validateCommands(id: string) {
    if (this.commands.length < 1 || this.commands.length > MAX_COMMANDS) {
      throw new UnscopedValidationError(lit`CommandsStepInvalidCommandsLength`, `'${id}': 'commands' must contain between 1 and ${MAX_COMMANDS} commands, got ${this.commands.length}`);
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
  }
}
