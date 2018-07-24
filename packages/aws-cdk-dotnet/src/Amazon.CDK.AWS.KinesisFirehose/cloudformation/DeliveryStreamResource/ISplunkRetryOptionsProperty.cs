using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.KinesisFirehose.cloudformation.DeliveryStreamResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-splunkretryoptions.html </remarks>
    [JsiiInterface(typeof(ISplunkRetryOptionsProperty), "@aws-cdk/aws-kinesisfirehose.cloudformation.DeliveryStreamResource.SplunkRetryOptionsProperty")]
    public interface ISplunkRetryOptionsProperty
    {
        /// <summary>``DeliveryStreamResource.SplunkRetryOptionsProperty.DurationInSeconds``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-splunkretryoptions.html#cfn-kinesisfirehose-deliverystream-splunkretryoptions-durationinseconds </remarks>
        [JsiiProperty("durationInSeconds", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object DurationInSeconds
        {
            get;
            set;
        }
    }
}