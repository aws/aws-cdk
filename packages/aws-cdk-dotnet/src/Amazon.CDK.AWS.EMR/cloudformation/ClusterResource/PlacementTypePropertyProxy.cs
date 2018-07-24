using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.EMR.cloudformation.ClusterResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-placementtype.html </remarks>
    [JsiiInterfaceProxy(typeof(IPlacementTypeProperty), "@aws-cdk/aws-emr.cloudformation.ClusterResource.PlacementTypeProperty")]
    internal class PlacementTypePropertyProxy : DeputyBase, IPlacementTypeProperty
    {
        private PlacementTypePropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``ClusterResource.PlacementTypeProperty.AvailabilityZone``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-placementtype.html#cfn-elasticmapreduce-cluster-placementtype-availabilityzone </remarks>
        [JsiiProperty("availabilityZone", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object AvailabilityZone
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}