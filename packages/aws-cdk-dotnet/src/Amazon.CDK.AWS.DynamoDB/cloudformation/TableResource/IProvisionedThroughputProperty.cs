using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.DynamoDB.cloudformation.TableResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-provisionedthroughput.html </remarks>
    [JsiiInterface(typeof(IProvisionedThroughputProperty), "@aws-cdk/aws-dynamodb.cloudformation.TableResource.ProvisionedThroughputProperty")]
    public interface IProvisionedThroughputProperty
    {
        /// <summary>``TableResource.ProvisionedThroughputProperty.ReadCapacityUnits``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-provisionedthroughput.html#cfn-dynamodb-provisionedthroughput-readcapacityunits </remarks>
        [JsiiProperty("readCapacityUnits", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object ReadCapacityUnits
        {
            get;
            set;
        }

        /// <summary>``TableResource.ProvisionedThroughputProperty.WriteCapacityUnits``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-provisionedthroughput.html#cfn-dynamodb-provisionedthroughput-writecapacityunits </remarks>
        [JsiiProperty("writeCapacityUnits", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object WriteCapacityUnits
        {
            get;
            set;
        }
    }
}