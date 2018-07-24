using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.EMR.cloudformation.InstanceFleetConfigResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-instancefleetconfig-ebsconfiguration.html </remarks>
    [JsiiInterface(typeof(IEbsConfigurationProperty), "@aws-cdk/aws-emr.cloudformation.InstanceFleetConfigResource.EbsConfigurationProperty")]
    public interface IEbsConfigurationProperty
    {
        /// <summary>``InstanceFleetConfigResource.EbsConfigurationProperty.EbsBlockDeviceConfigs``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-instancefleetconfig-ebsconfiguration.html#cfn-elasticmapreduce-instancefleetconfig-ebsconfiguration-ebsblockdeviceconfigs </remarks>
        [JsiiProperty("ebsBlockDeviceConfigs", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-emr.cloudformation.InstanceFleetConfigResource.EbsBlockDeviceConfigProperty\"}]}}}}]},\"optional\":true}")]
        object EbsBlockDeviceConfigs
        {
            get;
            set;
        }

        /// <summary>``InstanceFleetConfigResource.EbsConfigurationProperty.EbsOptimized``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-instancefleetconfig-ebsconfiguration.html#cfn-elasticmapreduce-instancefleetconfig-ebsconfiguration-ebsoptimized </remarks>
        [JsiiProperty("ebsOptimized", "{\"union\":{\"types\":[{\"primitive\":\"boolean\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object EbsOptimized
        {
            get;
            set;
        }
    }
}