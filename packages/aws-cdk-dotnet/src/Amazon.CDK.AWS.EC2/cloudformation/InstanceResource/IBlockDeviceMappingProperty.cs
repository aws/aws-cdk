using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.EC2.cloudformation.InstanceResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-blockdev-mapping.html </remarks>
    [JsiiInterface(typeof(IBlockDeviceMappingProperty), "@aws-cdk/aws-ec2.cloudformation.InstanceResource.BlockDeviceMappingProperty")]
    public interface IBlockDeviceMappingProperty
    {
        /// <summary>``InstanceResource.BlockDeviceMappingProperty.DeviceName``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-blockdev-mapping.html#cfn-ec2-blockdev-mapping-devicename </remarks>
        [JsiiProperty("deviceName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object DeviceName
        {
            get;
            set;
        }

        /// <summary>``InstanceResource.BlockDeviceMappingProperty.Ebs``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-blockdev-mapping.html#cfn-ec2-blockdev-mapping-ebs </remarks>
        [JsiiProperty("ebs", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-ec2.cloudformation.InstanceResource.EbsProperty\"}]},\"optional\":true}")]
        object Ebs
        {
            get;
            set;
        }

        /// <summary>``InstanceResource.BlockDeviceMappingProperty.NoDevice``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-blockdev-mapping.html#cfn-ec2-blockdev-mapping-nodevice </remarks>
        [JsiiProperty("noDevice", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-ec2.cloudformation.InstanceResource.NoDeviceProperty\"}]},\"optional\":true}")]
        object NoDevice
        {
            get;
            set;
        }

        /// <summary>``InstanceResource.BlockDeviceMappingProperty.VirtualName``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-blockdev-mapping.html#cfn-ec2-blockdev-mapping-virtualname </remarks>
        [JsiiProperty("virtualName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object VirtualName
        {
            get;
            set;
        }
    }
}