using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.EMR.cloudformation.ClusterResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-spotprovisioningspecification.html </remarks>
    public class SpotProvisioningSpecificationProperty : DeputyBase, Amazon.CDK.AWS.EMR.cloudformation.ClusterResource.ISpotProvisioningSpecificationProperty
    {
        /// <summary>``ClusterResource.SpotProvisioningSpecificationProperty.BlockDurationMinutes``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-spotprovisioningspecification.html#cfn-elasticmapreduce-cluster-spotprovisioningspecification-blockdurationminutes </remarks>
        [JsiiProperty("blockDurationMinutes", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object BlockDurationMinutes
        {
            get;
            set;
        }

        /// <summary>``ClusterResource.SpotProvisioningSpecificationProperty.TimeoutAction``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-spotprovisioningspecification.html#cfn-elasticmapreduce-cluster-spotprovisioningspecification-timeoutaction </remarks>
        [JsiiProperty("timeoutAction", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}", true)]
        public object TimeoutAction
        {
            get;
            set;
        }

        /// <summary>``ClusterResource.SpotProvisioningSpecificationProperty.TimeoutDurationMinutes``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-spotprovisioningspecification.html#cfn-elasticmapreduce-cluster-spotprovisioningspecification-timeoutdurationminutes </remarks>
        [JsiiProperty("timeoutDurationMinutes", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}", true)]
        public object TimeoutDurationMinutes
        {
            get;
            set;
        }
    }
}