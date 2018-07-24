using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.KinesisFirehose.cloudformation.DeliveryStreamResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-splunkdestinationconfiguration.html </remarks>
    [JsiiInterface(typeof(ISplunkDestinationConfigurationProperty), "@aws-cdk/aws-kinesisfirehose.cloudformation.DeliveryStreamResource.SplunkDestinationConfigurationProperty")]
    public interface ISplunkDestinationConfigurationProperty
    {
        /// <summary>``DeliveryStreamResource.SplunkDestinationConfigurationProperty.CloudWatchLoggingOptions``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-splunkdestinationconfiguration.html#cfn-kinesisfirehose-deliverystream-splunkdestinationconfiguration-cloudwatchloggingoptions </remarks>
        [JsiiProperty("cloudWatchLoggingOptions", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-kinesisfirehose.cloudformation.DeliveryStreamResource.CloudWatchLoggingOptionsProperty\"}]},\"optional\":true}")]
        object CloudWatchLoggingOptions
        {
            get;
            set;
        }

        /// <summary>``DeliveryStreamResource.SplunkDestinationConfigurationProperty.HECAcknowledgmentTimeoutInSeconds``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-splunkdestinationconfiguration.html#cfn-kinesisfirehose-deliverystream-splunkdestinationconfiguration-hecacknowledgmenttimeoutinseconds </remarks>
        [JsiiProperty("hecAcknowledgmentTimeoutInSeconds", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object HecAcknowledgmentTimeoutInSeconds
        {
            get;
            set;
        }

        /// <summary>``DeliveryStreamResource.SplunkDestinationConfigurationProperty.HECEndpoint``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-splunkdestinationconfiguration.html#cfn-kinesisfirehose-deliverystream-splunkdestinationconfiguration-hecendpoint </remarks>
        [JsiiProperty("hecEndpoint", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object HecEndpoint
        {
            get;
            set;
        }

        /// <summary>``DeliveryStreamResource.SplunkDestinationConfigurationProperty.HECEndpointType``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-splunkdestinationconfiguration.html#cfn-kinesisfirehose-deliverystream-splunkdestinationconfiguration-hecendpointtype </remarks>
        [JsiiProperty("hecEndpointType", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object HecEndpointType
        {
            get;
            set;
        }

        /// <summary>``DeliveryStreamResource.SplunkDestinationConfigurationProperty.HECToken``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-splunkdestinationconfiguration.html#cfn-kinesisfirehose-deliverystream-splunkdestinationconfiguration-hectoken </remarks>
        [JsiiProperty("hecToken", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object HecToken
        {
            get;
            set;
        }

        /// <summary>``DeliveryStreamResource.SplunkDestinationConfigurationProperty.ProcessingConfiguration``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-splunkdestinationconfiguration.html#cfn-kinesisfirehose-deliverystream-splunkdestinationconfiguration-processingconfiguration </remarks>
        [JsiiProperty("processingConfiguration", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-kinesisfirehose.cloudformation.DeliveryStreamResource.ProcessingConfigurationProperty\"}]},\"optional\":true}")]
        object ProcessingConfiguration
        {
            get;
            set;
        }

        /// <summary>``DeliveryStreamResource.SplunkDestinationConfigurationProperty.RetryOptions``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-splunkdestinationconfiguration.html#cfn-kinesisfirehose-deliverystream-splunkdestinationconfiguration-retryoptions </remarks>
        [JsiiProperty("retryOptions", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-kinesisfirehose.cloudformation.DeliveryStreamResource.SplunkRetryOptionsProperty\"}]},\"optional\":true}")]
        object RetryOptions
        {
            get;
            set;
        }

        /// <summary>``DeliveryStreamResource.SplunkDestinationConfigurationProperty.S3BackupMode``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-splunkdestinationconfiguration.html#cfn-kinesisfirehose-deliverystream-splunkdestinationconfiguration-s3backupmode </remarks>
        [JsiiProperty("s3BackupMode", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object S3BackupMode
        {
            get;
            set;
        }

        /// <summary>``DeliveryStreamResource.SplunkDestinationConfigurationProperty.S3Configuration``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-splunkdestinationconfiguration.html#cfn-kinesisfirehose-deliverystream-splunkdestinationconfiguration-s3configuration </remarks>
        [JsiiProperty("s3Configuration", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-kinesisfirehose.cloudformation.DeliveryStreamResource.S3DestinationConfigurationProperty\"}]}}")]
        object S3Configuration
        {
            get;
            set;
        }
    }
}