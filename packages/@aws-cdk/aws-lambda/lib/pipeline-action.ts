import codepipeline = require('@aws-cdk/aws-codepipeline-api');
import iam = require('@aws-cdk/aws-iam');
import cdk = require('@aws-cdk/cdk');
import { IFunction } from './lambda-ref';

/**
 * Common properties for creating a {@link PipelineInvokeAction} -
 * either directly, through its constructor,
 * or through {@link IFunction#addToPipeline}.
 */
export interface CommonPipelineInvokeActionProps extends codepipeline.CommonActionProps {
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
  inputArtifacts?: codepipeline.Artifact[];

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
  outputArtifactNames?: string[];

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
 * Construction properties of the {@link PipelineInvokeAction Lambda invoke CodePipeline Action}.
 */
export interface PipelineInvokeActionProps extends CommonPipelineInvokeActionProps,
    codepipeline.CommonActionConstructProps {
  /**
   * The lambda function to invoke.
   */
  lambda: IFunction;
}

/**
 * CodePipeline invoke Action that is provided by an AWS Lambda function.
 *
 * @see https://docs.aws.amazon.com/codepipeline/latest/userguide/actions-invoke-lambda-function.html
 */
export class PipelineInvokeAction extends codepipeline.Action {
  constructor(scope: cdk.Construct, id: string, props: PipelineInvokeActionProps) {
    super(scope, id, {
      ...props,
      category: codepipeline.ActionCategory.Invoke,
      provider: 'Lambda',
      artifactBounds: codepipeline.defaultBounds(),
      configuration: {
        FunctionName: props.lambda.functionName,
        UserParameters: props.userParameters
      }
    });

    // handle input artifacts
    for (const inputArtifact of props.inputArtifacts || []) {
      this.addInputArtifact(inputArtifact);
    }

    // handle output artifacts
    for (const outputArtifactName of props.outputArtifactNames || []) {
      this.addOutputArtifact(outputArtifactName);
    }

    // allow pipeline to list functions
    props.stage.pipeline.role.addToPolicy(new iam.PolicyStatement()
      .addAction('lambda:ListFunctions')
      .addAllResources());

    // allow pipeline to invoke this lambda functionn
    props.stage.pipeline.role.addToPolicy(new iam.PolicyStatement()
      .addAction('lambda:InvokeFunction')
      .addResource(props.lambda.functionArn));

    // allow lambda to put job results for this pipeline.
    const addToPolicy = props.addPutJobResultPolicy !== undefined ? props.addPutJobResultPolicy : true;
    if (addToPolicy) {
      props.lambda.addToRolePolicy(new iam.PolicyStatement()
        .addAllResources() // to avoid cycles (see docs)
        .addAction('codepipeline:PutJobSuccessResult')
        .addAction('codepipeline:PutJobFailureResult'));
    }
  }

  public outputArtifacts(): codepipeline.Artifact[] {
    return this._outputArtifacts;
  }

  public outputArtifact(artifactName: string): codepipeline.Artifact {
    const result = this._outputArtifacts.find(a => (a.name === artifactName));
    if (result === undefined) {
      throw new Error(`Could not find the output Artifact with name '${artifactName}'`);
    } else {
      return result;
    }
  }
}
