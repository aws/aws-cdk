using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.EC2.cloudformation.InstanceResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-mount-point.html </remarks>
    [JsiiInterface(typeof(IVolumeProperty), "@aws-cdk/aws-ec2.cloudformation.InstanceResource.VolumeProperty")]
    public interface IVolumeProperty
    {
        /// <summary>``InstanceResource.VolumeProperty.Device``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-mount-point.html#cfn-ec2-mountpoint-device </remarks>
        [JsiiProperty("device", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object Device
        {
            get;
            set;
        }

        /// <summary>``InstanceResource.VolumeProperty.VolumeId``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-mount-point.html#cfn-ec2-mountpoint-volumeid </remarks>
        [JsiiProperty("volumeId", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object VolumeId
        {
            get;
            set;
        }
    }
}