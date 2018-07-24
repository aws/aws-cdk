using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Serverless.cloudformation.FunctionResource
{
    /// <remarks>link: https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#sns </remarks>
    [JsiiInterface(typeof(ISNSEventProperty), "@aws-cdk/aws-serverless.cloudformation.FunctionResource.SNSEventProperty")]
    public interface ISNSEventProperty
    {
        /// <summary>``FunctionResource.SNSEventProperty.Topic``</summary>
        /// <remarks>link: https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#sns </remarks>
        [JsiiProperty("topic", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object Topic
        {
            get;
            set;
        }
    }
}