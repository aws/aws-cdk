using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.DynamoDB.cloudformation.TableResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-table-pointintimerecoveryspecification.html </remarks>
    public class PointInTimeRecoverySpecificationProperty : DeputyBase, IPointInTimeRecoverySpecificationProperty
    {
        /// <summary>``TableResource.PointInTimeRecoverySpecificationProperty.PointInTimeRecoveryEnabled``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-table-pointintimerecoveryspecification.html#cfn-dynamodb-table-pointintimerecoveryspecification-pointintimerecoveryenabled </remarks>
        [JsiiProperty("pointInTimeRecoveryEnabled", "{\"union\":{\"types\":[{\"primitive\":\"boolean\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object PointInTimeRecoveryEnabled
        {
            get;
            set;
        }
    }
}