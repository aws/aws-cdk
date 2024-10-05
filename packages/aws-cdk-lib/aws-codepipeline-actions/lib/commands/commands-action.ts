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
   * The list of additional input Artifacts for this action.
   *
   * @default - no extra inputs
   */
  readonly extraInputs?: codepipeline.Artifact[];

  /**
   * The list of output Artifacts for this action.
   *
   * @default - the action will not have any outputs
   */
  readonly output?: codepipeline.Artifact;

  /**
   * The names of the variables in your environment that you want to export.
   *
   * @see https://docs.aws.amazon.com/codebuild/latest/userguide/build-env-ref-env-vars.html
   * @default - No output variables are exported
   */
  readonly outputVariables?: string[];

  /**
   * Shell commands for the Commands action to run.
   *
   * All formats are supported except multi-line formats.
   */
  readonly commands: string[];
}

/**
 * CodePipeline compute action that uses AWS Commands.
 */
export class CommandsAction extends Action {
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
  }

  /**
   * Reference a CodePipeline variable exported in the Commands action.
   *
   * @param variableName the name of the variable to reference
   * @see https://docs.aws.amazon.com/codebuild/latest/userguide/build-env-ref-env-vars.html
   */
  public variable(variableName: string): string {
    return this.variableExpression(variableName);
  }

  protected bound(scope: Construct, _stage: codepipeline.IStage, options: codepipeline.ActionBindOptions):
  codepipeline.ActionConfig {
    const logGroupArn = cdk.Stack.of(scope).formatArn({
      service: 'logs',
      resource: 'log-group',
      resourceName: `/aws/codepipeline/${_stage.pipeline.pipelineName}:*`,
      arnFormat: cdk.ArnFormat.COLON_RESOURCE_NAME,
    });

    // grant the Pipeline role the required permissions to the log group
    options.role.addToPrincipalPolicy(new iam.PolicyStatement({
      resources: [logGroupArn],
      actions: [
        // To put the logs in the log group
        // see: https://docs.aws.amazon.com/codepipeline/latest/userguide/action-reference-Commands.html#action-reference-Commands-policy
        'logs:CreateLogGroup',
        'logs:CreateLogStream',
        'logs:PutLogEvents',
        // To view the logs in the Commands action on the CodePipeline console
        // see: https://docs.aws.amazon.com/codepipeline/latest/userguide/security-iam-permissions-console-logs.html
        'logs:GetLogEvents',
      ],
    }));

    // `CommandsAction` does not need the `configuration` in the `ActionConfig`.
    return {};
  }
}
