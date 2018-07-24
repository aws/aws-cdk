using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.EC2.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-ebs-volumeattachment.html </remarks>
    [JsiiInterface(typeof(IVolumeAttachmentResourceProps), "@aws-cdk/aws-ec2.cloudformation.VolumeAttachmentResourceProps")]
    public interface IVolumeAttachmentResourceProps
    {
        /// <summary>``AWS::EC2::VolumeAttachment.Device``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-ebs-volumeattachment.html#cfn-ec2-ebs-volumeattachment-device </remarks>
        [JsiiProperty("device", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object Device
        {
            get;
            set;
        }

        /// <summary>``AWS::EC2::VolumeAttachment.InstanceId``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-ebs-volumeattachment.html#cfn-ec2-ebs-volumeattachment-instanceid </remarks>
        [JsiiProperty("instanceId", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object InstanceId
        {
            get;
            set;
        }

        /// <summary>``AWS::EC2::VolumeAttachment.VolumeId``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-ebs-volumeattachment.html#cfn-ec2-ebs-volumeattachment-volumeid </remarks>
        [JsiiProperty("volumeId", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object VolumeId
        {
            get;
            set;
        }
    }
}