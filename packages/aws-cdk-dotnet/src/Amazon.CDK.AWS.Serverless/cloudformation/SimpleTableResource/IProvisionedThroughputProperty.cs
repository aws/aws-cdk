using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Serverless.cloudformation.SimpleTableResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-provisionedthroughput.html </remarks>
    [JsiiInterface(typeof(IProvisionedThroughputProperty), "@aws-cdk/aws-serverless.cloudformation.SimpleTableResource.ProvisionedThroughputProperty")]
    public interface IProvisionedThroughputProperty
    {
        /// <summary>``SimpleTableResource.ProvisionedThroughputProperty.ReadCapacityUnits``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-provisionedthroughput.html </remarks>
        [JsiiProperty("readCapacityUnits", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object ReadCapacityUnits
        {
            get;
            set;
        }

        /// <summary>``SimpleTableResource.ProvisionedThroughputProperty.WriteCapacityUnits``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-provisionedthroughput.html </remarks>
        [JsiiProperty("writeCapacityUnits", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object WriteCapacityUnits
        {
            get;
            set;
        }
    }
}