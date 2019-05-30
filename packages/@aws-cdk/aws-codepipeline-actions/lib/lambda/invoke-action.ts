import codepipeline = require('@aws-cdk/aws-codepipeline');
import iam = require('@aws-cdk/aws-iam');
import lambda = require('@aws-cdk/aws-lambda');

/**
 * Construction properties of the {@link LambdaInvokeAction Lambda invoke CodePipeline Action}.
 */
export interface LambdaInvokeActionProps extends codepipeline.CommonActionProps {
  // because of @see links
  // tslint:disable:max-line-length

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
   * @see https://docs.aws.amazon.com/codepipeline/latest/userguide/actions-invoke-lambda-function.html#actions-invoke-lambda-function-json-event-example
   */
  readonly userParameters?: { [key: string]: any };

  // tslint:enable:max-line-length

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
export class LambdaInvokeAction extends codepipeline.Action {
  private readonly props: LambdaInvokeActionProps;

  constructor(props: LambdaInvokeActionProps) {
    super({
      ...props,
      category: codepipeline.ActionCategory.Invoke,
      provider: 'Lambda',
      artifactBounds: {
        minInputs: 0,
        maxInputs: 5,
        minOutputs: 0,
        maxOutputs: 5,
      },
      configuration: {
        FunctionName: props.lambda.functionName,
        UserParameters: props.lambda.node.stringifyJson(props.userParameters),
      },
    });

    this.props = props;
  }

  protected bind(info: codepipeline.ActionBind): void {
    // allow pipeline to list functions
    info.role.addToPolicy(new iam.PolicyStatement()
      .addAction('lambda:ListFunctions')
      .addAllResources());

    // allow pipeline to invoke this lambda functionn
    info.role.addToPolicy(new iam.PolicyStatement()
      .addAction('lambda:InvokeFunction')
      .addResource(this.props.lambda.functionArn));

    // allow lambda to put job results for this pipeline
    // CodePipeline requires this to be granted to '*'
    // (the Pipeline ARN will not be enough)
    this.props.lambda.addToRolePolicy(new iam.PolicyStatement()
      .addAllResources()
      .addAction('codepipeline:PutJobSuccessResult')
      .addAction('codepipeline:PutJobFailureResult'));
  }
}
