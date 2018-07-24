using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.KinesisFirehose.cloudformation.DeliveryStreamResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-elasticsearchdestinationconfiguration.html </remarks>
    public class ElasticsearchDestinationConfigurationProperty : DeputyBase, IElasticsearchDestinationConfigurationProperty
    {
        /// <summary>``DeliveryStreamResource.ElasticsearchDestinationConfigurationProperty.BufferingHints``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-elasticsearchdestinationconfiguration.html#cfn-kinesisfirehose-deliverystream-elasticsearchdestinationconfiguration-bufferinghints </remarks>
        [JsiiProperty("bufferingHints", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-kinesisfirehose.cloudformation.DeliveryStreamResource.ElasticsearchBufferingHintsProperty\"}]}}", true)]
        public object BufferingHints
        {
            get;
            set;
        }

        /// <summary>``DeliveryStreamResource.ElasticsearchDestinationConfigurationProperty.CloudWatchLoggingOptions``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-elasticsearchdestinationconfiguration.html#cfn-kinesisfirehose-deliverystream-elasticsearchdestinationconfiguration-cloudwatchloggingoptions </remarks>
        [JsiiProperty("cloudWatchLoggingOptions", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-kinesisfirehose.cloudformation.DeliveryStreamResource.CloudWatchLoggingOptionsProperty\"}]},\"optional\":true}", true)]
        public object CloudWatchLoggingOptions
        {
            get;
            set;
        }

        /// <summary>``DeliveryStreamResource.ElasticsearchDestinationConfigurationProperty.DomainARN``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-elasticsearchdestinationconfiguration.html#cfn-kinesisfirehose-deliverystream-elasticsearchdestinationconfiguration-domainarn </remarks>
        [JsiiProperty("domainArn", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}", true)]
        public object DomainArn
        {
            get;
            set;
        }

        /// <summary>``DeliveryStreamResource.ElasticsearchDestinationConfigurationProperty.IndexName``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-elasticsearchdestinationconfiguration.html#cfn-kinesisfirehose-deliverystream-elasticsearchdestinationconfiguration-indexname </remarks>
        [JsiiProperty("indexName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}", true)]
        public object IndexName
        {
            get;
            set;
        }

        /// <summary>``DeliveryStreamResource.ElasticsearchDestinationConfigurationProperty.IndexRotationPeriod``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-elasticsearchdestinationconfiguration.html#cfn-kinesisfirehose-deliverystream-elasticsearchdestinationconfiguration-indexrotationperiod </remarks>
        [JsiiProperty("indexRotationPeriod", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}", true)]
        public object IndexRotationPeriod
        {
            get;
            set;
        }

        /// <summary>``DeliveryStreamResource.ElasticsearchDestinationConfigurationProperty.ProcessingConfiguration``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-elasticsearchdestinationconfiguration.html#cfn-kinesisfirehose-deliverystream-elasticsearchdestinationconfiguration-processingconfiguration </remarks>
        [JsiiProperty("processingConfiguration", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-kinesisfirehose.cloudformation.DeliveryStreamResource.ProcessingConfigurationProperty\"}]},\"optional\":true}", true)]
        public object ProcessingConfiguration
        {
            get;
            set;
        }

        /// <summary>``DeliveryStreamResource.ElasticsearchDestinationConfigurationProperty.RetryOptions``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-elasticsearchdestinationconfiguration.html#cfn-kinesisfirehose-deliverystream-elasticsearchdestinationconfiguration-retryoptions </remarks>
        [JsiiProperty("retryOptions", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-kinesisfirehose.cloudformation.DeliveryStreamResource.ElasticsearchRetryOptionsProperty\"}]}}", true)]
        public object RetryOptions
        {
            get;
            set;
        }

        /// <summary>``DeliveryStreamResource.ElasticsearchDestinationConfigurationProperty.RoleARN``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-elasticsearchdestinationconfiguration.html#cfn-kinesisfirehose-deliverystream-elasticsearchdestinationconfiguration-rolearn </remarks>
        [JsiiProperty("roleArn", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}", true)]
        public object RoleArn
        {
            get;
            set;
        }

        /// <summary>``DeliveryStreamResource.ElasticsearchDestinationConfigurationProperty.S3BackupMode``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-elasticsearchdestinationconfiguration.html#cfn-kinesisfirehose-deliverystream-elasticsearchdestinationconfiguration-s3backupmode </remarks>
        [JsiiProperty("s3BackupMode", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}", true)]
        public object S3BackupMode
        {
            get;
            set;
        }

        /// <summary>``DeliveryStreamResource.ElasticsearchDestinationConfigurationProperty.S3Configuration``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-elasticsearchdestinationconfiguration.html#cfn-kinesisfirehose-deliverystream-elasticsearchdestinationconfiguration-s3configuration </remarks>
        [JsiiProperty("s3Configuration", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-kinesisfirehose.cloudformation.DeliveryStreamResource.S3DestinationConfigurationProperty\"}]}}", true)]
        public object S3Configuration
        {
            get;
            set;
        }

        /// <summary>``DeliveryStreamResource.ElasticsearchDestinationConfigurationProperty.TypeName``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-elasticsearchdestinationconfiguration.html#cfn-kinesisfirehose-deliverystream-elasticsearchdestinationconfiguration-typename </remarks>
        [JsiiProperty("typeName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}", true)]
        public object TypeName
        {
            get;
            set;
        }
    }
}