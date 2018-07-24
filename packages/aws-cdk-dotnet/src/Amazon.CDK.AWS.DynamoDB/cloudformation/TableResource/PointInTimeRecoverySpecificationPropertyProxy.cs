using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.DynamoDB.cloudformation.TableResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-table-pointintimerecoveryspecification.html </remarks>
    [JsiiInterfaceProxy(typeof(IPointInTimeRecoverySpecificationProperty), "@aws-cdk/aws-dynamodb.cloudformation.TableResource.PointInTimeRecoverySpecificationProperty")]
    internal class PointInTimeRecoverySpecificationPropertyProxy : DeputyBase, IPointInTimeRecoverySpecificationProperty
    {
        private PointInTimeRecoverySpecificationPropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``TableResource.PointInTimeRecoverySpecificationProperty.PointInTimeRecoveryEnabled``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-table-pointintimerecoveryspecification.html#cfn-dynamodb-table-pointintimerecoveryspecification-pointintimerecoveryenabled </remarks>
        [JsiiProperty("pointInTimeRecoveryEnabled", "{\"union\":{\"types\":[{\"primitive\":\"boolean\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object PointInTimeRecoveryEnabled
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}