using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.EMR.cloudformation.ClusterResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-ebsblockdeviceconfig.html </remarks>
    [JsiiInterfaceProxy(typeof(IEbsBlockDeviceConfigProperty), "@aws-cdk/aws-emr.cloudformation.ClusterResource.EbsBlockDeviceConfigProperty")]
    internal class EbsBlockDeviceConfigPropertyProxy : DeputyBase, Amazon.CDK.AWS.EMR.cloudformation.ClusterResource.IEbsBlockDeviceConfigProperty
    {
        private EbsBlockDeviceConfigPropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``ClusterResource.EbsBlockDeviceConfigProperty.VolumeSpecification``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-ebsblockdeviceconfig.html#cfn-elasticmapreduce-cluster-ebsblockdeviceconfig-volumespecification </remarks>
        [JsiiProperty("volumeSpecification", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-emr.cloudformation.ClusterResource.VolumeSpecificationProperty\"}]}}")]
        public virtual object VolumeSpecification
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``ClusterResource.EbsBlockDeviceConfigProperty.VolumesPerInstance``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-ebsblockdeviceconfig.html#cfn-elasticmapreduce-cluster-ebsblockdeviceconfig-volumesperinstance </remarks>
        [JsiiProperty("volumesPerInstance", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object VolumesPerInstance
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}