using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.EMR.cloudformation.InstanceGroupConfigResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-ebsconfiguration-ebsblockdeviceconfig.html </remarks>
    [JsiiInterfaceProxy(typeof(IEbsBlockDeviceConfigProperty), "@aws-cdk/aws-emr.cloudformation.InstanceGroupConfigResource.EbsBlockDeviceConfigProperty")]
    internal class EbsBlockDeviceConfigPropertyProxy : DeputyBase, Amazon.CDK.AWS.EMR.cloudformation.InstanceGroupConfigResource.IEbsBlockDeviceConfigProperty
    {
        private EbsBlockDeviceConfigPropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``InstanceGroupConfigResource.EbsBlockDeviceConfigProperty.VolumeSpecification``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-ebsconfiguration-ebsblockdeviceconfig.html#cfn-emr-ebsconfiguration-ebsblockdeviceconfig-volumespecification </remarks>
        [JsiiProperty("volumeSpecification", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-emr.cloudformation.InstanceGroupConfigResource.VolumeSpecificationProperty\"}]}}")]
        public virtual object VolumeSpecification
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``InstanceGroupConfigResource.EbsBlockDeviceConfigProperty.VolumesPerInstance``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-ebsconfiguration-ebsblockdeviceconfig.html#cfn-emr-ebsconfiguration-ebsblockdeviceconfig-volumesperinstance </remarks>
        [JsiiProperty("volumesPerInstance", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object VolumesPerInstance
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}