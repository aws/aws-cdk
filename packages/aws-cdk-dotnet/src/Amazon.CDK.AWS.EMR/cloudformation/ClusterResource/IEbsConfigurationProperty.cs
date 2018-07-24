using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.EMR.cloudformation.ClusterResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-ebsconfiguration.html </remarks>
    [JsiiInterface(typeof(IEbsConfigurationProperty), "@aws-cdk/aws-emr.cloudformation.ClusterResource.EbsConfigurationProperty")]
    public interface IEbsConfigurationProperty
    {
        /// <summary>``ClusterResource.EbsConfigurationProperty.EbsBlockDeviceConfigs``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-ebsconfiguration.html#cfn-elasticmapreduce-cluster-ebsconfiguration-ebsblockdeviceconfigs </remarks>
        [JsiiProperty("ebsBlockDeviceConfigs", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-emr.cloudformation.ClusterResource.EbsBlockDeviceConfigProperty\"}]}}}}]},\"optional\":true}")]
        object EbsBlockDeviceConfigs
        {
            get;
            set;
        }

        /// <summary>``ClusterResource.EbsConfigurationProperty.EbsOptimized``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-ebsconfiguration.html#cfn-elasticmapreduce-cluster-ebsconfiguration-ebsoptimized </remarks>
        [JsiiProperty("ebsOptimized", "{\"union\":{\"types\":[{\"primitive\":\"boolean\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object EbsOptimized
        {
            get;
            set;
        }
    }
}