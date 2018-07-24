using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Lambda.cloudformation.FunctionResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-function-tracingconfig.html </remarks>
    [JsiiInterfaceProxy(typeof(ITracingConfigProperty), "@aws-cdk/aws-lambda.cloudformation.FunctionResource.TracingConfigProperty")]
    internal class TracingConfigPropertyProxy : DeputyBase, ITracingConfigProperty
    {
        private TracingConfigPropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``FunctionResource.TracingConfigProperty.Mode``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-function-tracingconfig.html#cfn-lambda-function-tracingconfig-mode </remarks>
        [JsiiProperty("mode", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object Mode
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}