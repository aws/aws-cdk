using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.OpsWorks.cloudformation.LayerResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-layer-volumeconfiguration.html </remarks>
    [JsiiInterface(typeof(IVolumeConfigurationProperty), "@aws-cdk/aws-opsworks.cloudformation.LayerResource.VolumeConfigurationProperty")]
    public interface IVolumeConfigurationProperty
    {
        /// <summary>``LayerResource.VolumeConfigurationProperty.Iops``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-layer-volumeconfiguration.html#cfn-opsworks-layer-volconfig-iops </remarks>
        [JsiiProperty("iops", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object Iops
        {
            get;
            set;
        }

        /// <summary>``LayerResource.VolumeConfigurationProperty.MountPoint``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-layer-volumeconfiguration.html#cfn-opsworks-layer-volconfig-mountpoint </remarks>
        [JsiiProperty("mountPoint", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object MountPoint
        {
            get;
            set;
        }

        /// <summary>``LayerResource.VolumeConfigurationProperty.NumberOfDisks``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-layer-volumeconfiguration.html#cfn-opsworks-layer-volconfig-numberofdisks </remarks>
        [JsiiProperty("numberOfDisks", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object NumberOfDisks
        {
            get;
            set;
        }

        /// <summary>``LayerResource.VolumeConfigurationProperty.RaidLevel``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-layer-volumeconfiguration.html#cfn-opsworks-layer-volconfig-raidlevel </remarks>
        [JsiiProperty("raidLevel", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object RaidLevel
        {
            get;
            set;
        }

        /// <summary>``LayerResource.VolumeConfigurationProperty.Size``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-layer-volumeconfiguration.html#cfn-opsworks-layer-volconfig-size </remarks>
        [JsiiProperty("size", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object Size
        {
            get;
            set;
        }

        /// <summary>``LayerResource.VolumeConfigurationProperty.VolumeType``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-layer-volumeconfiguration.html#cfn-opsworks-layer-volconfig-volumetype </remarks>
        [JsiiProperty("volumeType", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object VolumeType
        {
            get;
            set;
        }
    }
}