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

  // tslint:enable:max-line-length

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
   * String to be used in the event data parameter passed to the Lambda
   * function
   *
   * See an example JSON event in the CodePipeline documentation.
   *
   * https://docs.aws.amazon.com/codepipeline/latest/userguide/actions-invoke-lambda-function.html#actions-invoke-lambda-function-json-event-example
   */
  readonly userParameters?: any;

  /**
   * Adds the "codepipeline:PutJobSuccessResult" and
   * "codepipeline:PutJobFailureResult" for '*' resource to the Lambda
   * execution role policy.
   *
   * NOTE: the reason we can't add the specific pipeline ARN as a resource is
   * to avoid a cyclic dependency between the pipeline and the Lambda function
   * (the pipeline references) the Lambda and the Lambda needs permissions on
   * the pipeline.
   *
   * @see https://docs.aws.amazon.com/codepipeline/latest/userguide/actions-invoke-lambda-function.html#actions-invoke-lambda-function-create-function
   *
   * @default true
   */
  readonly addPutJobResultPolicy?: boolean;

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
        UserParameters: props.userParameters
      }
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

    // allow lambda to put job results for this pipeline.
    const addToPolicy = this.props.addPutJobResultPolicy !== undefined ? this.props.addPutJobResultPolicy : true;
    if (addToPolicy) {
      this.props.lambda.addToRolePolicy(new iam.PolicyStatement()
        .addAllResources() // to avoid cycles (see docs)
        .addAction('codepipeline:PutJobSuccessResult')
        .addAction('codepipeline:PutJobFailureResult'));
    }
  }
}
