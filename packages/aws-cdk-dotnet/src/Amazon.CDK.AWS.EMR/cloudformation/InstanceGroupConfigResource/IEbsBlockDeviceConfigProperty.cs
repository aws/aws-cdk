using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.EMR.cloudformation.InstanceGroupConfigResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-ebsconfiguration-ebsblockdeviceconfig.html </remarks>
    [JsiiInterface(typeof(IEbsBlockDeviceConfigProperty), "@aws-cdk/aws-emr.cloudformation.InstanceGroupConfigResource.EbsBlockDeviceConfigProperty")]
    public interface IEbsBlockDeviceConfigProperty
    {
        /// <summary>``InstanceGroupConfigResource.EbsBlockDeviceConfigProperty.VolumeSpecification``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-ebsconfiguration-ebsblockdeviceconfig.html#cfn-emr-ebsconfiguration-ebsblockdeviceconfig-volumespecification </remarks>
        [JsiiProperty("volumeSpecification", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-emr.cloudformation.InstanceGroupConfigResource.VolumeSpecificationProperty\"}]}}")]
        object VolumeSpecification
        {
            get;
            set;
        }

        /// <summary>``InstanceGroupConfigResource.EbsBlockDeviceConfigProperty.VolumesPerInstance``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-ebsconfiguration-ebsblockdeviceconfig.html#cfn-emr-ebsconfiguration-ebsblockdeviceconfig-volumesperinstance </remarks>
        [JsiiProperty("volumesPerInstance", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object VolumesPerInstance
        {
            get;
            set;
        }
    }
}