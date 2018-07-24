using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.DynamoDB.cloudformation.TableResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-streamspecification.html </remarks>
    [JsiiInterface(typeof(IStreamSpecificationProperty), "@aws-cdk/aws-dynamodb.cloudformation.TableResource.StreamSpecificationProperty")]
    public interface IStreamSpecificationProperty
    {
        /// <summary>``TableResource.StreamSpecificationProperty.StreamViewType``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-streamspecification.html#cfn-dynamodb-streamspecification-streamviewtype </remarks>
        [JsiiProperty("streamViewType", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object StreamViewType
        {
            get;
            set;
        }
    }
}