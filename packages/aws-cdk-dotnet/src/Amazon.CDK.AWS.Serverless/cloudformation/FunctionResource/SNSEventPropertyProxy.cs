using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Serverless.cloudformation.FunctionResource
{
    /// <remarks>link: https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#sns </remarks>
    [JsiiInterfaceProxy(typeof(ISNSEventProperty), "@aws-cdk/aws-serverless.cloudformation.FunctionResource.SNSEventProperty")]
    internal class SNSEventPropertyProxy : DeputyBase, ISNSEventProperty
    {
        private SNSEventPropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``FunctionResource.SNSEventProperty.Topic``</summary>
        /// <remarks>link: https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#sns </remarks>
        [JsiiProperty("topic", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object Topic
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}