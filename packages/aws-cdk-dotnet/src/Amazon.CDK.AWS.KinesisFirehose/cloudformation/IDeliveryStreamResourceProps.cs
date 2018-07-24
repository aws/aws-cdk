using Amazon.CDK;
using Amazon.CDK.AWS.KinesisFirehose.cloudformation.DeliveryStreamResource;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.KinesisFirehose.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kinesisfirehose-deliverystream.html </remarks>
    [JsiiInterface(typeof(IDeliveryStreamResourceProps), "@aws-cdk/aws-kinesisfirehose.cloudformation.DeliveryStreamResourceProps")]
    public interface IDeliveryStreamResourceProps
    {
        /// <summary>``AWS::KinesisFirehose::DeliveryStream.DeliveryStreamName``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kinesisfirehose-deliverystream.html#cfn-kinesisfirehose-deliverystream-deliverystreamname </remarks>
        [JsiiProperty("deliveryStreamName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object DeliveryStreamName
        {
            get;
            set;
        }

        /// <summary>``AWS::KinesisFirehose::DeliveryStream.DeliveryStreamType``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kinesisfirehose-deliverystream.html#cfn-kinesisfirehose-deliverystream-deliverystreamtype </remarks>
        [JsiiProperty("deliveryStreamType", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object DeliveryStreamType
        {
            get;
            set;
        }

        /// <summary>``AWS::KinesisFirehose::DeliveryStream.ElasticsearchDestinationConfiguration``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kinesisfirehose-deliverystream.html#cfn-kinesisfirehose-deliverystream-elasticsearchdestinationconfiguration </remarks>
        [JsiiProperty("elasticsearchDestinationConfiguration", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-kinesisfirehose.cloudformation.DeliveryStreamResource.ElasticsearchDestinationConfigurationProperty\"}]},\"optional\":true}")]
        object ElasticsearchDestinationConfiguration
        {
            get;
            set;
        }

        /// <summary>``AWS::KinesisFirehose::DeliveryStream.ExtendedS3DestinationConfiguration``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kinesisfirehose-deliverystream.html#cfn-kinesisfirehose-deliverystream-extendeds3destinationconfiguration </remarks>
        [JsiiProperty("extendedS3DestinationConfiguration", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-kinesisfirehose.cloudformation.DeliveryStreamResource.ExtendedS3DestinationConfigurationProperty\"}]},\"optional\":true}")]
        object ExtendedS3DestinationConfiguration
        {
            get;
            set;
        }

        /// <summary>``AWS::KinesisFirehose::DeliveryStream.KinesisStreamSourceConfiguration``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kinesisfirehose-deliverystream.html#cfn-kinesisfirehose-deliverystream-kinesisstreamsourceconfiguration </remarks>
        [JsiiProperty("kinesisStreamSourceConfiguration", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-kinesisfirehose.cloudformation.DeliveryStreamResource.KinesisStreamSourceConfigurationProperty\"}]},\"optional\":true}")]
        object KinesisStreamSourceConfiguration
        {
            get;
            set;
        }

        /// <summary>``AWS::KinesisFirehose::DeliveryStream.RedshiftDestinationConfiguration``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kinesisfirehose-deliverystream.html#cfn-kinesisfirehose-deliverystream-redshiftdestinationconfiguration </remarks>
        [JsiiProperty("redshiftDestinationConfiguration", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-kinesisfirehose.cloudformation.DeliveryStreamResource.RedshiftDestinationConfigurationProperty\"}]},\"optional\":true}")]
        object RedshiftDestinationConfiguration
        {
            get;
            set;
        }

        /// <summary>``AWS::KinesisFirehose::DeliveryStream.S3DestinationConfiguration``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kinesisfirehose-deliverystream.html#cfn-kinesisfirehose-deliverystream-s3destinationconfiguration </remarks>
        [JsiiProperty("s3DestinationConfiguration", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-kinesisfirehose.cloudformation.DeliveryStreamResource.S3DestinationConfigurationProperty\"}]},\"optional\":true}")]
        object S3DestinationConfiguration
        {
            get;
            set;
        }

        /// <summary>``AWS::KinesisFirehose::DeliveryStream.SplunkDestinationConfiguration``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kinesisfirehose-deliverystream.html#cfn-kinesisfirehose-deliverystream-splunkdestinationconfiguration </remarks>
        [JsiiProperty("splunkDestinationConfiguration", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-kinesisfirehose.cloudformation.DeliveryStreamResource.SplunkDestinationConfigurationProperty\"}]},\"optional\":true}")]
        object SplunkDestinationConfiguration
        {
            get;
            set;
        }
    }
}