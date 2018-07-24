using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.DynamoDB.cloudformation.TableResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-table-ssespecification.html </remarks>
    [JsiiInterface(typeof(ISSESpecificationProperty), "@aws-cdk/aws-dynamodb.cloudformation.TableResource.SSESpecificationProperty")]
    public interface ISSESpecificationProperty
    {
        /// <summary>``TableResource.SSESpecificationProperty.SSEEnabled``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-table-ssespecification.html#cfn-dynamodb-table-ssespecification-sseenabled </remarks>
        [JsiiProperty("sseEnabled", "{\"union\":{\"types\":[{\"primitive\":\"boolean\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object SseEnabled
        {
            get;
            set;
        }
    }
}