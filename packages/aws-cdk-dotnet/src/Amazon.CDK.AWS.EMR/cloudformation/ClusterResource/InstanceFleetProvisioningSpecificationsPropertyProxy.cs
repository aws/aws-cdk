using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.EMR.cloudformation.ClusterResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-instancefleetprovisioningspecifications.html </remarks>
    [JsiiInterfaceProxy(typeof(IInstanceFleetProvisioningSpecificationsProperty), "@aws-cdk/aws-emr.cloudformation.ClusterResource.InstanceFleetProvisioningSpecificationsProperty")]
    internal class InstanceFleetProvisioningSpecificationsPropertyProxy : DeputyBase, Amazon.CDK.AWS.EMR.cloudformation.ClusterResource.IInstanceFleetProvisioningSpecificationsProperty
    {
        private InstanceFleetProvisioningSpecificationsPropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``ClusterResource.InstanceFleetProvisioningSpecificationsProperty.SpotSpecification``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-instancefleetprovisioningspecifications.html#cfn-elasticmapreduce-cluster-instancefleetprovisioningspecifications-spotspecification </remarks>
        [JsiiProperty("spotSpecification", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-emr.cloudformation.ClusterResource.SpotProvisioningSpecificationProperty\"}]}}")]
        public virtual object SpotSpecification
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}