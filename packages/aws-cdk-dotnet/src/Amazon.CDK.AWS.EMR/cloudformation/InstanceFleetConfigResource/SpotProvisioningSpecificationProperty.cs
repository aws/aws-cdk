using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.EMR.cloudformation.InstanceFleetConfigResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-instancefleetconfig-spotprovisioningspecification.html </remarks>
    public class SpotProvisioningSpecificationProperty : DeputyBase, Amazon.CDK.AWS.EMR.cloudformation.InstanceFleetConfigResource.ISpotProvisioningSpecificationProperty
    {
        /// <summary>``InstanceFleetConfigResource.SpotProvisioningSpecificationProperty.BlockDurationMinutes``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-instancefleetconfig-spotprovisioningspecification.html#cfn-elasticmapreduce-instancefleetconfig-spotprovisioningspecification-blockdurationminutes </remarks>
        [JsiiProperty("blockDurationMinutes", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object BlockDurationMinutes
        {
            get;
            set;
        }

        /// <summary>``InstanceFleetConfigResource.SpotProvisioningSpecificationProperty.TimeoutAction``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-instancefleetconfig-spotprovisioningspecification.html#cfn-elasticmapreduce-instancefleetconfig-spotprovisioningspecification-timeoutaction </remarks>
        [JsiiProperty("timeoutAction", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}", true)]
        public object TimeoutAction
        {
            get;
            set;
        }

        /// <summary>``InstanceFleetConfigResource.SpotProvisioningSpecificationProperty.TimeoutDurationMinutes``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-instancefleetconfig-spotprovisioningspecification.html#cfn-elasticmapreduce-instancefleetconfig-spotprovisioningspecification-timeoutdurationminutes </remarks>
        [JsiiProperty("timeoutDurationMinutes", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}", true)]
        public object TimeoutDurationMinutes
        {
            get;
            set;
        }
    }
}