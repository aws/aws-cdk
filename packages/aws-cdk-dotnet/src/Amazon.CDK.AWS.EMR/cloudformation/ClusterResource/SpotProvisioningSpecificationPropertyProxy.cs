using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.EMR.cloudformation.ClusterResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-spotprovisioningspecification.html </remarks>
    [JsiiInterfaceProxy(typeof(ISpotProvisioningSpecificationProperty), "@aws-cdk/aws-emr.cloudformation.ClusterResource.SpotProvisioningSpecificationProperty")]
    internal class SpotProvisioningSpecificationPropertyProxy : DeputyBase, Amazon.CDK.AWS.EMR.cloudformation.ClusterResource.ISpotProvisioningSpecificationProperty
    {
        private SpotProvisioningSpecificationPropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``ClusterResource.SpotProvisioningSpecificationProperty.BlockDurationMinutes``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-spotprovisioningspecification.html#cfn-elasticmapreduce-cluster-spotprovisioningspecification-blockdurationminutes </remarks>
        [JsiiProperty("blockDurationMinutes", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object BlockDurationMinutes
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``ClusterResource.SpotProvisioningSpecificationProperty.TimeoutAction``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-spotprovisioningspecification.html#cfn-elasticmapreduce-cluster-spotprovisioningspecification-timeoutaction </remarks>
        [JsiiProperty("timeoutAction", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object TimeoutAction
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``ClusterResource.SpotProvisioningSpecificationProperty.TimeoutDurationMinutes``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-spotprovisioningspecification.html#cfn-elasticmapreduce-cluster-spotprovisioningspecification-timeoutdurationminutes </remarks>
        [JsiiProperty("timeoutDurationMinutes", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object TimeoutDurationMinutes
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}