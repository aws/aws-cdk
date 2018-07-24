using Amazon.CDK.AWS.Lambda;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CodePipeline
{
    [JsiiInterfaceProxy(typeof(IInvokeLambdaProps), "@aws-cdk/aws-codepipeline.InvokeLambdaProps")]
    internal class InvokeLambdaPropsProxy : DeputyBase, IInvokeLambdaProps
    {
        private InvokeLambdaPropsProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>The lambda function to invoke.</summary>
        [JsiiProperty("lambda", "{\"fqn\":\"@aws-cdk/aws-lambda.LambdaRef\"}")]
        public virtual LambdaRef Lambda
        {
            get => GetInstanceProperty<LambdaRef>();
            set => SetInstanceProperty(value);
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
        public virtual object UserParameters
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
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
        public virtual bool? AddPutJobResultPolicy
        {
            get => GetInstanceProperty<bool? >();
            set => SetInstanceProperty(value);
        }
    }
}