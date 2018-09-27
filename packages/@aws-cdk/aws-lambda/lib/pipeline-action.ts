import codepipeline = require('@aws-cdk/aws-codepipeline-api');
import cdk = require('@aws-cdk/cdk');
import { FunctionRef } from './lambda-ref';

/**
 * Construction properties of the {@link PipelineInvokeAction Lambda invoke CodePipeline Action}.
 */
export interface PipelineInvokeActionProps extends codepipeline.CommonActionProps {
  /**
   * The lambda function to invoke.
   */
  lambda: FunctionRef;

  /**
   * String to be used in the event data parameter passed to the Lambda
   * function
   *
   * See an example JSON event in the CodePipeline documentation.
   *
   * https://docs.aws.amazon.com/codepipeline/latest/userguide/actions-invoke-lambda-function.html#actions-invoke-lambda-function-json-event-example
   */
  userParameters?: any;

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
   * @see
   * https://docs.aws.amazon.com/codepipeline/latest/userguide/actions-invoke-lambda-function.html#actions-invoke-lambda-function-create-function
   *
   * @default true
   */
  addPutJobResultPolicy?: boolean;
}

/**
 * CodePipeline invoke Action that is provided by an AWS Lambda function.
 *
 * @see https://docs.aws.amazon.com/codepipeline/latest/userguide/actions-invoke-lambda-function.html
 */
export class PipelineInvokeAction extends codepipeline.Action {
  constructor(parent: cdk.Construct, name: string, props: PipelineInvokeActionProps) {
    super(parent, name, {
      stage: props.stage,
      category: codepipeline.ActionCategory.Invoke,
      provider: 'Lambda',
      artifactBounds: codepipeline.defaultBounds(),
      configuration: {
        FunctionName: props.lambda.functionName,
        UserParameters: props.userParameters
      }
    });

    // allow pipeline to list functions
    props.stage.pipelineRole.addToPolicy(new cdk.PolicyStatement()
      .addAction('lambda:ListFunctions')
      .addAllResources());

    // allow pipeline to invoke this lambda functionn
    props.stage.pipelineRole.addToPolicy(new cdk.PolicyStatement()
      .addAction('lambda:InvokeFunction')
      .addResource(props.lambda.functionArn));

    // allow lambda to put job results for this pipeline.
    const addToPolicy = props.addPutJobResultPolicy !== undefined ? props.addPutJobResultPolicy : true;
    if (addToPolicy) {
      props.lambda.addToRolePolicy(new cdk.PolicyStatement()
        .addAllResources() // to avoid cycles (see docs)
        .addAction('codepipeline:PutJobSuccessResult')
        .addAction('codepipeline:PutJobFailureResult'));
    }
  }

  /**
   * Add an input artifact
   * @param artifact
   */
  protected addInputArtifact(artifact: codepipeline.Artifact): codepipeline.Action {
    super.addInputArtifact(artifact);
    return this;
  }
}
