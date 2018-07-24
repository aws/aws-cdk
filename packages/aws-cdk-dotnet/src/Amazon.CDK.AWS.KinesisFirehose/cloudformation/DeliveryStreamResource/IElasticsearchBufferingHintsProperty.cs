using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.KinesisFirehose.cloudformation.DeliveryStreamResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-elasticsearchbufferinghints.html </remarks>
    [JsiiInterface(typeof(IElasticsearchBufferingHintsProperty), "@aws-cdk/aws-kinesisfirehose.cloudformation.DeliveryStreamResource.ElasticsearchBufferingHintsProperty")]
    public interface IElasticsearchBufferingHintsProperty
    {
        /// <summary>``DeliveryStreamResource.ElasticsearchBufferingHintsProperty.IntervalInSeconds``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-elasticsearchbufferinghints.html#cfn-kinesisfirehose-deliverystream-elasticsearchbufferinghints-intervalinseconds </remarks>
        [JsiiProperty("intervalInSeconds", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object IntervalInSeconds
        {
            get;
            set;
        }

        /// <summary>``DeliveryStreamResource.ElasticsearchBufferingHintsProperty.SizeInMBs``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-elasticsearchbufferinghints.html#cfn-kinesisfirehose-deliverystream-elasticsearchbufferinghints-sizeinmbs </remarks>
        [JsiiProperty("sizeInMBs", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object SizeInMBs
        {
            get;
            set;
        }
    }
}