using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.KinesisFirehose.cloudformation.DeliveryStreamResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-bufferinghints.html </remarks>
    [JsiiInterface(typeof(IBufferingHintsProperty), "@aws-cdk/aws-kinesisfirehose.cloudformation.DeliveryStreamResource.BufferingHintsProperty")]
    public interface IBufferingHintsProperty
    {
        /// <summary>``DeliveryStreamResource.BufferingHintsProperty.IntervalInSeconds``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-bufferinghints.html#cfn-kinesisfirehose-deliverystream-bufferinghints-intervalinseconds </remarks>
        [JsiiProperty("intervalInSeconds", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object IntervalInSeconds
        {
            get;
            set;
        }

        /// <summary>``DeliveryStreamResource.BufferingHintsProperty.SizeInMBs``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-bufferinghints.html#cfn-kinesisfirehose-deliverystream-bufferinghints-sizeinmbs </remarks>
        [JsiiProperty("sizeInMBs", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object SizeInMBs
        {
            get;
            set;
        }
    }
}