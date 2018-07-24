using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.DynamoDB.cloudformation.TableResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-provisionedthroughput.html </remarks>
    [JsiiInterfaceProxy(typeof(IProvisionedThroughputProperty), "@aws-cdk/aws-dynamodb.cloudformation.TableResource.ProvisionedThroughputProperty")]
    internal class ProvisionedThroughputPropertyProxy : DeputyBase, IProvisionedThroughputProperty
    {
        private ProvisionedThroughputPropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``TableResource.ProvisionedThroughputProperty.ReadCapacityUnits``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-provisionedthroughput.html#cfn-dynamodb-provisionedthroughput-readcapacityunits </remarks>
        [JsiiProperty("readCapacityUnits", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object ReadCapacityUnits
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``TableResource.ProvisionedThroughputProperty.WriteCapacityUnits``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-provisionedthroughput.html#cfn-dynamodb-provisionedthroughput-writecapacityunits </remarks>
        [JsiiProperty("writeCapacityUnits", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object WriteCapacityUnits
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}