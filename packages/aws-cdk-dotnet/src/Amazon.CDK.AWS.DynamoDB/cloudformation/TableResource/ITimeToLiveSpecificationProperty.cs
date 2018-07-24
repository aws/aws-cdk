using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.DynamoDB.cloudformation.TableResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-timetolivespecification.html </remarks>
    [JsiiInterface(typeof(ITimeToLiveSpecificationProperty), "@aws-cdk/aws-dynamodb.cloudformation.TableResource.TimeToLiveSpecificationProperty")]
    public interface ITimeToLiveSpecificationProperty
    {
        /// <summary>``TableResource.TimeToLiveSpecificationProperty.AttributeName``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-timetolivespecification.html#cfn-dynamodb-timetolivespecification-attributename </remarks>
        [JsiiProperty("attributeName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object AttributeName
        {
            get;
            set;
        }

        /// <summary>``TableResource.TimeToLiveSpecificationProperty.Enabled``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-timetolivespecification.html#cfn-dynamodb-timetolivespecification-enabled </remarks>
        [JsiiProperty("enabled", "{\"union\":{\"types\":[{\"primitive\":\"boolean\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object Enabled
        {
            get;
            set;
        }
    }
}