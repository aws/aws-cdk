using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Serverless.cloudformation.FunctionResource
{
    /// <remarks>link: https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#sns </remarks>
    public class SNSEventProperty : DeputyBase, ISNSEventProperty
    {
        /// <summary>``FunctionResource.SNSEventProperty.Topic``</summary>
        /// <remarks>link: https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#sns </remarks>
        [JsiiProperty("topic", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}", true)]
        public object Topic
        {
            get;
            set;
        }
    }
}