using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.EC2.cloudformation.InstanceResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-blockdev-mapping.html </remarks>
    [JsiiInterfaceProxy(typeof(IBlockDeviceMappingProperty), "@aws-cdk/aws-ec2.cloudformation.InstanceResource.BlockDeviceMappingProperty")]
    internal class BlockDeviceMappingPropertyProxy : DeputyBase, Amazon.CDK.AWS.EC2.cloudformation.InstanceResource.IBlockDeviceMappingProperty
    {
        private BlockDeviceMappingPropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``InstanceResource.BlockDeviceMappingProperty.DeviceName``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-blockdev-mapping.html#cfn-ec2-blockdev-mapping-devicename </remarks>
        [JsiiProperty("deviceName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object DeviceName
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``InstanceResource.BlockDeviceMappingProperty.Ebs``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-blockdev-mapping.html#cfn-ec2-blockdev-mapping-ebs </remarks>
        [JsiiProperty("ebs", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-ec2.cloudformation.InstanceResource.EbsProperty\"}]},\"optional\":true}")]
        public virtual object Ebs
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``InstanceResource.BlockDeviceMappingProperty.NoDevice``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-blockdev-mapping.html#cfn-ec2-blockdev-mapping-nodevice </remarks>
        [JsiiProperty("noDevice", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-ec2.cloudformation.InstanceResource.NoDeviceProperty\"}]},\"optional\":true}")]
        public virtual object NoDevice
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``InstanceResource.BlockDeviceMappingProperty.VirtualName``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-blockdev-mapping.html#cfn-ec2-blockdev-mapping-virtualname </remarks>
        [JsiiProperty("virtualName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object VirtualName
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}