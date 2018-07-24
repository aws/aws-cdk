using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.KinesisFirehose.cloudformation.DeliveryStreamResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-elasticsearchretryoptions.html </remarks>
    [JsiiInterfaceProxy(typeof(IElasticsearchRetryOptionsProperty), "@aws-cdk/aws-kinesisfirehose.cloudformation.DeliveryStreamResource.ElasticsearchRetryOptionsProperty")]
    internal class ElasticsearchRetryOptionsPropertyProxy : DeputyBase, IElasticsearchRetryOptionsProperty
    {
        private ElasticsearchRetryOptionsPropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``DeliveryStreamResource.ElasticsearchRetryOptionsProperty.DurationInSeconds``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-elasticsearchretryoptions.html#cfn-kinesisfirehose-deliverystream-elasticsearchretryoptions-durationinseconds </remarks>
        [JsiiProperty("durationInSeconds", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object DurationInSeconds
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}