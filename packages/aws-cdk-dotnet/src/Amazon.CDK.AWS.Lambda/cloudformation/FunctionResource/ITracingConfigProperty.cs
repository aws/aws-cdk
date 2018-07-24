using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Lambda.cloudformation.FunctionResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-function-tracingconfig.html </remarks>
    [JsiiInterface(typeof(ITracingConfigProperty), "@aws-cdk/aws-lambda.cloudformation.FunctionResource.TracingConfigProperty")]
    public interface ITracingConfigProperty
    {
        /// <summary>``FunctionResource.TracingConfigProperty.Mode``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-function-tracingconfig.html#cfn-lambda-function-tracingconfig-mode </remarks>
        [JsiiProperty("mode", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object Mode
        {
            get;
            set;
        }
    }
}