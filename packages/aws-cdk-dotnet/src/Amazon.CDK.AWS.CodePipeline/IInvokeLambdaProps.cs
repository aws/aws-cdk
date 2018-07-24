using Amazon.CDK.AWS.Lambda;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CodePipeline
{
    [JsiiInterface(typeof(IInvokeLambdaProps), "@aws-cdk/aws-codepipeline.InvokeLambdaProps")]
    public interface IInvokeLambdaProps
    {
        /// <summary>The lambda function to invoke.</summary>
        [JsiiProperty("lambda", "{\"fqn\":\"@aws-cdk/aws-lambda.LambdaRef\"}")]
        LambdaRef Lambda
        {
            get;
            set;
        }

        /// <summary>
        /// String to be used in the event data parameter passed to the Lambda
        /// function
        /// 
        /// See an example JSON event in the CodePipeline documentation.
        /// 
        /// https://docs.aws.amazon.com/codepipeline/latest/userguide/actions-invoke-lambda-function.html#actions-invoke-lambda-function-json-event-example
        /// </summary>
        [JsiiProperty("userParameters", "{\"primitive\":\"any\",\"optional\":true}")]
        object UserParameters
        {
            get;
            set;
        }

        /// <summary>
        /// Adds the "codepipeline:PutJobSuccessResult" and
        /// "codepipeline:PutJobFailureResult" for '*' resource to the Lambda
        /// execution role policy.
        /// 
        /// NOTE: the reason we can't add the specific pipeline ARN as a resource is
        /// to avoid a cyclic dependency between the pipeline and the Lambda function
        /// (the pipeline references) the Lambda and the Lambda needs permissions on
        /// the pipeline.
        /// </summary>
        /// <remarks>
        /// default: true
        /// see: https://docs.aws.amazon.com/codepipeline/latest/userguide/actions-invoke-lambda-function.html#actions-invoke-lambda-function-create-function
        /// </remarks>
        [JsiiProperty("addPutJobResultPolicy", "{\"primitive\":\"boolean\",\"optional\":true}")]
        bool? AddPutJobResultPolicy
        {
            get;
            set;
        }
    }
}