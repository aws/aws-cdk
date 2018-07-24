using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.DynamoDB.cloudformation.TableResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-table-pointintimerecoveryspecification.html </remarks>
    [JsiiInterface(typeof(IPointInTimeRecoverySpecificationProperty), "@aws-cdk/aws-dynamodb.cloudformation.TableResource.PointInTimeRecoverySpecificationProperty")]
    public interface IPointInTimeRecoverySpecificationProperty
    {
        /// <summary>``TableResource.PointInTimeRecoverySpecificationProperty.PointInTimeRecoveryEnabled``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-table-pointintimerecoveryspecification.html#cfn-dynamodb-table-pointintimerecoveryspecification-pointintimerecoveryenabled </remarks>
        [JsiiProperty("pointInTimeRecoveryEnabled", "{\"union\":{\"types\":[{\"primitive\":\"boolean\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object PointInTimeRecoveryEnabled
        {
            get;
            set;
        }
    }
}