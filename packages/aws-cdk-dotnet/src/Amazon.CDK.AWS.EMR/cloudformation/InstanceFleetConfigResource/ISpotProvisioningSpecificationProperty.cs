using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.EMR.cloudformation.InstanceFleetConfigResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-instancefleetconfig-spotprovisioningspecification.html </remarks>
    [JsiiInterface(typeof(ISpotProvisioningSpecificationProperty), "@aws-cdk/aws-emr.cloudformation.InstanceFleetConfigResource.SpotProvisioningSpecificationProperty")]
    public interface ISpotProvisioningSpecificationProperty
    {
        /// <summary>``InstanceFleetConfigResource.SpotProvisioningSpecificationProperty.BlockDurationMinutes``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-instancefleetconfig-spotprovisioningspecification.html#cfn-elasticmapreduce-instancefleetconfig-spotprovisioningspecification-blockdurationminutes </remarks>
        [JsiiProperty("blockDurationMinutes", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object BlockDurationMinutes
        {
            get;
            set;
        }

        /// <summary>``InstanceFleetConfigResource.SpotProvisioningSpecificationProperty.TimeoutAction``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-instancefleetconfig-spotprovisioningspecification.html#cfn-elasticmapreduce-instancefleetconfig-spotprovisioningspecification-timeoutaction </remarks>
        [JsiiProperty("timeoutAction", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object TimeoutAction
        {
            get;
            set;
        }

        /// <summary>``InstanceFleetConfigResource.SpotProvisioningSpecificationProperty.TimeoutDurationMinutes``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-instancefleetconfig-spotprovisioningspecification.html#cfn-elasticmapreduce-instancefleetconfig-spotprovisioningspecification-timeoutdurationminutes </remarks>
        [JsiiProperty("timeoutDurationMinutes", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object TimeoutDurationMinutes
        {
            get;
            set;
        }
    }
}