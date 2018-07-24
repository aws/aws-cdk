using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Serverless.cloudformation.SimpleTableResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-provisionedthroughput.html </remarks>
    [JsiiInterfaceProxy(typeof(IProvisionedThroughputProperty), "@aws-cdk/aws-serverless.cloudformation.SimpleTableResource.ProvisionedThroughputProperty")]
    internal class ProvisionedThroughputPropertyProxy : DeputyBase, IProvisionedThroughputProperty
    {
        private ProvisionedThroughputPropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``SimpleTableResource.ProvisionedThroughputProperty.ReadCapacityUnits``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-provisionedthroughput.html </remarks>
        [JsiiProperty("readCapacityUnits", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object ReadCapacityUnits
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``SimpleTableResource.ProvisionedThroughputProperty.WriteCapacityUnits``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-provisionedthroughput.html </remarks>
        [JsiiProperty("writeCapacityUnits", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object WriteCapacityUnits
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}