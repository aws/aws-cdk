import { Construct } from 'constructs';
import * as codepipeline from '../../../aws-codepipeline';
import * as iam from '../../../aws-iam';
import * as cdk from '../../../core';
import { Action } from '../action';

/**
 * Construction properties of the `CommandsAction`.
 */
export interface CommandsActionProps extends codepipeline.CommonAwsActionProps {
  /**
   * The source to use as input for this action.
   */
  readonly input: codepipeline.Artifact;

  /**
   * The list of additional input artifacts for this action.
   *
   * @default - no extra inputs
   */
  readonly extraInputs?: codepipeline.Artifact[];

  /**
   * The output artifact for this action.
   *
   * You can filter files that you want to export as the output artifact for the action.
   *
   * @example
   * new codepipeline.Artifact('CommandsArtifact', ['my-dir/**']);
   *
   * @default - no output artifact
   */
  readonly output?: codepipeline.Artifact;

  /**
   * The names of the variables in your environment that you want to export.
   *
   * These variables can be referenced in other actions by using the `variable` method
   * of this class.
   *
   * @see https://docs.aws.amazon.com/codebuild/latest/userguide/build-env-ref-env-vars.html
   * @default - No output variables are exported
   */
  readonly outputVariables?: string[];

  /**
   * Shell commands for the Commands action to run.
   *
   * All formats are supported except multi-line formats.
   *
   * The length of the commands array must be between 1 and 50.
   */
  readonly commands: string[];
}

/**
 * CodePipeline compute action that uses AWS Commands.
 */
export class CommandsAction extends Action {
  private readonly outputVariables: string[];
  constructor(props: CommandsActionProps) {
    super({
      ...props,
      category: codepipeline.ActionCategory.COMPUTE,
      provider: 'Commands',
      artifactBounds: { minInputs: 1, maxInputs: 10, minOutputs: 0, maxOutputs: 1 },
      inputs: [props.input, ...props.extraInputs || []],
      outputs: props.output ? [props.output] : [],
      commands: props.commands,
      outputVariables: props.outputVariables,
    });

    if (props.commands.length < 1 || props.commands.length > 50) {
      throw new cdk.UnscopedValidationError(`The length of the commands array must be between 1 and 50, got: ${props.commands.length}`);
    }

    if (props.outputVariables !== undefined && (props.outputVariables.length < 1 || props.outputVariables.length > 15)) {
      throw new cdk.UnscopedValidationError(`The length of the outputVariables array must be between 1 and 15, got: ${props.outputVariables.length}`);
    }

    this.outputVariables = props.outputVariables || [];
  }

  /**
   * Reference a CodePipeline variable exported in the Commands action.
   *
   * @param variableName the name of the variable exported by `outputVariables`
   * @see https://docs.aws.amazon.com/codebuild/latest/userguide/build-env-ref-env-vars.html
   */
  public variable(variableName: string): string {
    if (!this.outputVariables.includes(variableName)) {
      throw new cdk.UnscopedValidationError(`Variable '${variableName}' is not exported by \`outputVariables\`, exported variables: ${this.outputVariables.join(', ')}`);
    }
    return this.variableExpression(variableName);
  }

  protected bound(scope: Construct, stage: codepipeline.IStage, options: codepipeline.ActionBindOptions):
  codepipeline.ActionConfig {
    const logGroupArn = cdk.Stack.of(scope).formatArn({
      service: 'logs',
      resource: 'log-group',
      resourceName: `/aws/codepipeline/${stage.pipeline.pipelineName}`,
      arnFormat: cdk.ArnFormat.COLON_RESOURCE_NAME,
    });
    const logGroupArnWithWildcard = `${logGroupArn}:*`;

    // grant the Pipeline role the required permissions to put the logs in the log group
    // see: https://docs.aws.amazon.com/codepipeline/latest/userguide/action-reference-Commands.html#action-reference-Commands-policy
    options.role.addToPrincipalPolicy(new iam.PolicyStatement({
      resources: [logGroupArn, logGroupArnWithWildcard],
      actions: [
        'logs:CreateLogGroup',
        'logs:CreateLogStream',
        'logs:PutLogEvents',
      ],
    }));

    // grant the Pipeline role the required permissions to view the logs in the Commands action on the CodePipeline console
    // see: https://docs.aws.amazon.com/codepipeline/latest/userguide/security-iam-permissions-console-logs.html
    options.role.addToPrincipalPolicy(new iam.PolicyStatement({
      resources: [logGroupArnWithWildcard],
      actions: [
        'logs:GetLogEvents',
      ],
    }));

    // allow the Role access to the Bucket, if there are any inputs/outputs
    if ((this.actionProperties.inputs ?? []).length > 0) {
      options.bucket.grantRead(options.role);
    }
    if ((this.actionProperties.outputs ?? []).length > 0) {
      options.bucket.grantWrite(options.role);
    }

    // `CommandsAction` does not need the `configuration` in the `ActionConfig`.
    return {};
  }
}
