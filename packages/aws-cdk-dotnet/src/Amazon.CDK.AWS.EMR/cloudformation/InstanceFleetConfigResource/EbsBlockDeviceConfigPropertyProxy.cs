using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.EMR.cloudformation.InstanceFleetConfigResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-instancefleetconfig-ebsblockdeviceconfig.html </remarks>
    [JsiiInterfaceProxy(typeof(IEbsBlockDeviceConfigProperty), "@aws-cdk/aws-emr.cloudformation.InstanceFleetConfigResource.EbsBlockDeviceConfigProperty")]
    internal class EbsBlockDeviceConfigPropertyProxy : DeputyBase, Amazon.CDK.AWS.EMR.cloudformation.InstanceFleetConfigResource.IEbsBlockDeviceConfigProperty
    {
        private EbsBlockDeviceConfigPropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``InstanceFleetConfigResource.EbsBlockDeviceConfigProperty.VolumeSpecification``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-instancefleetconfig-ebsblockdeviceconfig.html#cfn-elasticmapreduce-instancefleetconfig-ebsblockdeviceconfig-volumespecification </remarks>
        [JsiiProperty("volumeSpecification", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-emr.cloudformation.InstanceFleetConfigResource.VolumeSpecificationProperty\"}]}}")]
        public virtual object VolumeSpecification
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``InstanceFleetConfigResource.EbsBlockDeviceConfigProperty.VolumesPerInstance``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-instancefleetconfig-ebsblockdeviceconfig.html#cfn-elasticmapreduce-instancefleetconfig-ebsblockdeviceconfig-volumesperinstance </remarks>
        [JsiiProperty("volumesPerInstance", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object VolumesPerInstance
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}