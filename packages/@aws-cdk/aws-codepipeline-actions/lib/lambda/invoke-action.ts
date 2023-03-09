import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as iam from '@aws-cdk/aws-iam';
import * as lambda from '@aws-cdk/aws-lambda';
import { Stack } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { Action } from '../action';

/**
 * Construction properties of the `LambdaInvokeAction Lambda invoke CodePipeline Action`.
 */
export interface LambdaInvokeActionProps extends codepipeline.CommonAwsActionProps {
  /**
   * The optional input Artifacts of the Action.
   * A Lambda Action can have up to 5 inputs.
   * The inputs will appear in the event passed to the Lambda,
   * under the `'CodePipeline.job'.data.inputArtifacts` path.
   *
   * @default the Action will not have any inputs
   * @see https://docs.aws.amazon.com/codepipeline/latest/userguide/actions-invoke-lambda-function.html#actions-invoke-lambda-function-json-event-example
   */
  readonly inputs?: codepipeline.Artifact[];

  /**
   * The optional names of the output Artifacts of the Action.
   * A Lambda Action can have up to 5 outputs.
   * The outputs will appear in the event passed to the Lambda,
   * under the `'CodePipeline.job'.data.outputArtifacts` path.
   * It is the responsibility of the Lambda to upload ZIP files with the Artifact contents to the provided locations.
   *
   * @default the Action will not have any outputs
   */
  readonly outputs?: codepipeline.Artifact[];

  /**
   * A set of key-value pairs that will be accessible to the invoked Lambda
   * inside the event that the Pipeline will call it with.
   *
   * Only one of `userParameters` or `userParametersString` can be specified.
   *
   * @see https://docs.aws.amazon.com/codepipeline/latest/userguide/actions-invoke-lambda-function.html#actions-invoke-lambda-function-json-event-example
   * @default - no user parameters will be passed
   */
  readonly userParameters?: { [key: string]: any };

  /**
   * The string representation of the user parameters that will be
   * accessible to the invoked Lambda inside the event
   * that the Pipeline will call it with.
   *
   * Only one of `userParametersString` or `userParameters` can be specified.
   *
   * @default - no user parameters will be passed
   */
  readonly userParametersString?: string;

  /**
   * The lambda function to invoke.
   */
  readonly lambda: lambda.IFunction;
}

/**
 * CodePipeline invoke Action that is provided by an AWS Lambda function.
 *
 * @see https://docs.aws.amazon.com/codepipeline/latest/userguide/actions-invoke-lambda-function.html
 */
export class LambdaInvokeAction extends Action {
  private readonly props: LambdaInvokeActionProps;

  constructor(props: LambdaInvokeActionProps) {
    super({
      ...props,
      resource: props.lambda,
      category: codepipeline.ActionCategory.INVOKE,
      provider: 'Lambda',
      artifactBounds: {
        minInputs: 0,
        maxInputs: 5,
        minOutputs: 0,
        maxOutputs: 5,
      },
    });

    this.props = props;

    if (props.userParameters && props.userParametersString) {
      throw new Error('Only one of userParameters or userParametersString can be specified');
    }
  }

  /**
   * Reference a CodePipeline variable defined by the Lambda function this action points to.
   * Variables in Lambda invoke actions are defined by calling the PutJobSuccessResult CodePipeline API call
   * with the 'outputVariables' property filled.
   *
   * @param variableName the name of the variable to reference.
   *   A variable by this name must be present in the 'outputVariables' section of the PutJobSuccessResult
   *   request that the Lambda function calls when the action is invoked
   *
   * @see https://docs.aws.amazon.com/codepipeline/latest/APIReference/API_PutJobSuccessResult.html
   */
  public variable(variableName: string): string {
    return this.variableExpression(variableName);
  }

  protected bound(scope: Construct, _stage: codepipeline.IStage, options: codepipeline.ActionBindOptions):
  codepipeline.ActionConfig {
    // allow pipeline to list functions
    options.role.addToPolicy(new iam.PolicyStatement({
      actions: ['lambda:ListFunctions'],
      resources: ['*'],
    }));

    // allow pipeline to invoke this lambda functionn
    this.props.lambda.grantInvoke(options.role);

    // allow the Role access to the Bucket, if there are any inputs/outputs
    if ((this.actionProperties.inputs || []).length > 0) {
      options.bucket.grantRead(options.role);
    }
    if ((this.actionProperties.outputs || []).length > 0) {
      options.bucket.grantWrite(options.role);
    }

    // allow lambda to put job results for this pipeline
    // CodePipeline requires this to be granted to '*'
    // (the Pipeline ARN will not be enough)
    this.props.lambda.addToRolePolicy(new iam.PolicyStatement({
      resources: ['*'],
      actions: ['codepipeline:PutJobSuccessResult', 'codepipeline:PutJobFailureResult'],
    }));

    return {
      configuration: {
        FunctionName: this.props.lambda.functionName,
        UserParameters: this.props.userParametersString ?? Stack.of(scope).toJsonString(this.props.userParameters),
      },
    };
  }
}
