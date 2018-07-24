using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Lambda.cloudformation.FunctionResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-function-deadletterconfig.html </remarks>
    [JsiiInterfaceProxy(typeof(IDeadLetterConfigProperty), "@aws-cdk/aws-lambda.cloudformation.FunctionResource.DeadLetterConfigProperty")]
    internal class DeadLetterConfigPropertyProxy : DeputyBase, IDeadLetterConfigProperty
    {
        private DeadLetterConfigPropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``FunctionResource.DeadLetterConfigProperty.TargetArn``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-function-deadletterconfig.html#cfn-lambda-function-deadletterconfig-targetarn </remarks>
        [JsiiProperty("targetArn", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object TargetArn
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}