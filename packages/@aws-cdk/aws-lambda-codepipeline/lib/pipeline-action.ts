import codepipeline = require('@aws-cdk/aws-codepipeline');
import lambda = require('@aws-cdk/aws-lambda');
import cdk = require('@aws-cdk/cdk');

/**
 * Construction properties of the {@link InvokeAction Lambda invoke CodePipeline Action}.
 */
export interface InvokeActionProps {
    /**
     * The lambda function to invoke.
     */
    lambda: lambda.LambdaRef;

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
export class InvokeAction extends codepipeline.Action {
    constructor(parent: codepipeline.Stage, name: string, props: InvokeActionProps) {
        super(parent, name, {
            category: codepipeline.ActionCategory.Invoke,
            provider: 'Lambda',
            artifactBounds: codepipeline.defaultBounds(),
            configuration: {
                FunctionName: props.lambda.functionName,
                UserParameters: props.userParameters
            }
        });

        // allow pipeline to list functions
        parent.pipeline.addToRolePolicy(new cdk.PolicyStatement()
            .addAction('lambda:ListFunctions')
            .addResource('*'));

        // allow pipeline to invoke this lambda functionn
        parent.pipeline.addToRolePolicy(new cdk.PolicyStatement()
            .addAction('lambda:InvokeFunction')
            .addResource(props.lambda.functionArn));

        // allow lambda to put job results for this pipeline.
        const addToPolicy = props.addPutJobResultPolicy !== undefined ? props.addPutJobResultPolicy : true;
        if (addToPolicy) {
            props.lambda.addToRolePolicy(new cdk.PolicyStatement()
                .addResource('*') // to avoid cycles (see docs)
                .addAction('codepipeline:PutJobSuccessResult')
                .addAction('codepipeline:PutJobFailureResult'));
        }
    }

    /**
     * Add an input artifact
     * @param artifact
     */
    public addInputArtifact(artifact: codepipeline.Artifact): InvokeAction {
        super.addInputArtifact(artifact);
        return this;
    }
}
