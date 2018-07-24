using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.EMR.cloudformation.InstanceGroupConfigResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-ebsconfiguration-ebsblockdeviceconfig.html </remarks>
    public class EbsBlockDeviceConfigProperty : DeputyBase, Amazon.CDK.AWS.EMR.cloudformation.InstanceGroupConfigResource.IEbsBlockDeviceConfigProperty
    {
        /// <summary>``InstanceGroupConfigResource.EbsBlockDeviceConfigProperty.VolumeSpecification``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-ebsconfiguration-ebsblockdeviceconfig.html#cfn-emr-ebsconfiguration-ebsblockdeviceconfig-volumespecification </remarks>
        [JsiiProperty("volumeSpecification", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-emr.cloudformation.InstanceGroupConfigResource.VolumeSpecificationProperty\"}]}}", true)]
        public object VolumeSpecification
        {
            get;
            set;
        }

        /// <summary>``InstanceGroupConfigResource.EbsBlockDeviceConfigProperty.VolumesPerInstance``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emr-ebsconfiguration-ebsblockdeviceconfig.html#cfn-emr-ebsconfiguration-ebsblockdeviceconfig-volumesperinstance </remarks>
        [JsiiProperty("volumesPerInstance", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object VolumesPerInstance
        {
            get;
            set;
        }
    }
}