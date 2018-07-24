using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.KinesisFirehose.cloudformation.DeliveryStreamResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-elasticsearchbufferinghints.html </remarks>
    [JsiiInterfaceProxy(typeof(IElasticsearchBufferingHintsProperty), "@aws-cdk/aws-kinesisfirehose.cloudformation.DeliveryStreamResource.ElasticsearchBufferingHintsProperty")]
    internal class ElasticsearchBufferingHintsPropertyProxy : DeputyBase, IElasticsearchBufferingHintsProperty
    {
        private ElasticsearchBufferingHintsPropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``DeliveryStreamResource.ElasticsearchBufferingHintsProperty.IntervalInSeconds``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-elasticsearchbufferinghints.html#cfn-kinesisfirehose-deliverystream-elasticsearchbufferinghints-intervalinseconds </remarks>
        [JsiiProperty("intervalInSeconds", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object IntervalInSeconds
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``DeliveryStreamResource.ElasticsearchBufferingHintsProperty.SizeInMBs``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-elasticsearchbufferinghints.html#cfn-kinesisfirehose-deliverystream-elasticsearchbufferinghints-sizeinmbs </remarks>
        [JsiiProperty("sizeInMBs", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object SizeInMBs
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}