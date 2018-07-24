using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.KinesisFirehose.cloudformation.DeliveryStreamResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-bufferinghints.html </remarks>
    [JsiiInterfaceProxy(typeof(IBufferingHintsProperty), "@aws-cdk/aws-kinesisfirehose.cloudformation.DeliveryStreamResource.BufferingHintsProperty")]
    internal class BufferingHintsPropertyProxy : DeputyBase, IBufferingHintsProperty
    {
        private BufferingHintsPropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``DeliveryStreamResource.BufferingHintsProperty.IntervalInSeconds``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-bufferinghints.html#cfn-kinesisfirehose-deliverystream-bufferinghints-intervalinseconds </remarks>
        [JsiiProperty("intervalInSeconds", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object IntervalInSeconds
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``DeliveryStreamResource.BufferingHintsProperty.SizeInMBs``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-bufferinghints.html#cfn-kinesisfirehose-deliverystream-bufferinghints-sizeinmbs </remarks>
        [JsiiProperty("sizeInMBs", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object SizeInMBs
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}