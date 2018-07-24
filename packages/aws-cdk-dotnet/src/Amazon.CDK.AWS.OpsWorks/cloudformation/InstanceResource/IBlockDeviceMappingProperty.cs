using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.OpsWorks.cloudformation.InstanceResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-instance-blockdevicemapping.html </remarks>
    [JsiiInterface(typeof(IBlockDeviceMappingProperty), "@aws-cdk/aws-opsworks.cloudformation.InstanceResource.BlockDeviceMappingProperty")]
    public interface IBlockDeviceMappingProperty
    {
        /// <summary>``InstanceResource.BlockDeviceMappingProperty.DeviceName``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-instance-blockdevicemapping.html#cfn-opsworks-instance-blockdevicemapping-devicename </remarks>
        [JsiiProperty("deviceName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object DeviceName
        {
            get;
            set;
        }

        /// <summary>``InstanceResource.BlockDeviceMappingProperty.Ebs``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-instance-blockdevicemapping.html#cfn-opsworks-instance-blockdevicemapping-ebs </remarks>
        [JsiiProperty("ebs", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-opsworks.cloudformation.InstanceResource.EbsBlockDeviceProperty\"}]},\"optional\":true}")]
        object Ebs
        {
            get;
            set;
        }

        /// <summary>``InstanceResource.BlockDeviceMappingProperty.NoDevice``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-instance-blockdevicemapping.html#cfn-opsworks-instance-blockdevicemapping-nodevice </remarks>
        [JsiiProperty("noDevice", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object NoDevice
        {
            get;
            set;
        }

        /// <summary>``InstanceResource.BlockDeviceMappingProperty.VirtualName``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-instance-blockdevicemapping.html#cfn-opsworks-instance-blockdevicemapping-virtualname </remarks>
        [JsiiProperty("virtualName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object VirtualName
        {
            get;
            set;
        }
    }
}