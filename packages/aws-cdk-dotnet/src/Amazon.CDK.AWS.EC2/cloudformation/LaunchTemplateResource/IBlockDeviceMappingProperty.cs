using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.EC2.cloudformation.LaunchTemplateResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-launchtemplate-blockdevicemapping.html </remarks>
    [JsiiInterface(typeof(IBlockDeviceMappingProperty), "@aws-cdk/aws-ec2.cloudformation.LaunchTemplateResource.BlockDeviceMappingProperty")]
    public interface IBlockDeviceMappingProperty
    {
        /// <summary>``LaunchTemplateResource.BlockDeviceMappingProperty.DeviceName``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-launchtemplate-blockdevicemapping.html#cfn-ec2-launchtemplate-blockdevicemapping-devicename </remarks>
        [JsiiProperty("deviceName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object DeviceName
        {
            get;
            set;
        }

        /// <summary>``LaunchTemplateResource.BlockDeviceMappingProperty.Ebs``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-launchtemplate-blockdevicemapping.html#cfn-ec2-launchtemplate-blockdevicemapping-ebs </remarks>
        [JsiiProperty("ebs", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-ec2.cloudformation.LaunchTemplateResource.EbsProperty\"}]},\"optional\":true}")]
        object Ebs
        {
            get;
            set;
        }

        /// <summary>``LaunchTemplateResource.BlockDeviceMappingProperty.NoDevice``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-launchtemplate-blockdevicemapping.html#cfn-ec2-launchtemplate-blockdevicemapping-nodevice </remarks>
        [JsiiProperty("noDevice", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object NoDevice
        {
            get;
            set;
        }

        /// <summary>``LaunchTemplateResource.BlockDeviceMappingProperty.VirtualName``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-launchtemplate-blockdevicemapping.html#cfn-ec2-launchtemplate-blockdevicemapping-virtualname </remarks>
        [JsiiProperty("virtualName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object VirtualName
        {
            get;
            set;
        }
    }
}