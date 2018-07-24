using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.KinesisFirehose.cloudformation.DeliveryStreamResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-extendeds3destinationconfiguration.html </remarks>
    [JsiiInterfaceProxy(typeof(IExtendedS3DestinationConfigurationProperty), "@aws-cdk/aws-kinesisfirehose.cloudformation.DeliveryStreamResource.ExtendedS3DestinationConfigurationProperty")]
    internal class ExtendedS3DestinationConfigurationPropertyProxy : DeputyBase, IExtendedS3DestinationConfigurationProperty
    {
        private ExtendedS3DestinationConfigurationPropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``DeliveryStreamResource.ExtendedS3DestinationConfigurationProperty.BucketARN``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-extendeds3destinationconfiguration.html#cfn-kinesisfirehose-deliverystream-extendeds3destinationconfiguration-bucketarn </remarks>
        [JsiiProperty("bucketArn", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object BucketArn
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``DeliveryStreamResource.ExtendedS3DestinationConfigurationProperty.BufferingHints``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-extendeds3destinationconfiguration.html#cfn-kinesisfirehose-deliverystream-extendeds3destinationconfiguration-bufferinghints </remarks>
        [JsiiProperty("bufferingHints", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-kinesisfirehose.cloudformation.DeliveryStreamResource.BufferingHintsProperty\"}]}}")]
        public virtual object BufferingHints
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``DeliveryStreamResource.ExtendedS3DestinationConfigurationProperty.CloudWatchLoggingOptions``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-extendeds3destinationconfiguration.html#cfn-kinesisfirehose-deliverystream-extendeds3destinationconfiguration-cloudwatchloggingoptions </remarks>
        [JsiiProperty("cloudWatchLoggingOptions", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-kinesisfirehose.cloudformation.DeliveryStreamResource.CloudWatchLoggingOptionsProperty\"}]},\"optional\":true}")]
        public virtual object CloudWatchLoggingOptions
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``DeliveryStreamResource.ExtendedS3DestinationConfigurationProperty.CompressionFormat``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-extendeds3destinationconfiguration.html#cfn-kinesisfirehose-deliverystream-extendeds3destinationconfiguration-compressionformat </remarks>
        [JsiiProperty("compressionFormat", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object CompressionFormat
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``DeliveryStreamResource.ExtendedS3DestinationConfigurationProperty.EncryptionConfiguration``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-extendeds3destinationconfiguration.html#cfn-kinesisfirehose-deliverystream-extendeds3destinationconfiguration-encryptionconfiguration </remarks>
        [JsiiProperty("encryptionConfiguration", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-kinesisfirehose.cloudformation.DeliveryStreamResource.EncryptionConfigurationProperty\"}]},\"optional\":true}")]
        public virtual object EncryptionConfiguration
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``DeliveryStreamResource.ExtendedS3DestinationConfigurationProperty.Prefix``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-extendeds3destinationconfiguration.html#cfn-kinesisfirehose-deliverystream-extendeds3destinationconfiguration-prefix </remarks>
        [JsiiProperty("prefix", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object Prefix
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``DeliveryStreamResource.ExtendedS3DestinationConfigurationProperty.ProcessingConfiguration``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-extendeds3destinationconfiguration.html#cfn-kinesisfirehose-deliverystream-extendeds3destinationconfiguration-processingconfiguration </remarks>
        [JsiiProperty("processingConfiguration", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-kinesisfirehose.cloudformation.DeliveryStreamResource.ProcessingConfigurationProperty\"}]},\"optional\":true}")]
        public virtual object ProcessingConfiguration
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``DeliveryStreamResource.ExtendedS3DestinationConfigurationProperty.RoleARN``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-extendeds3destinationconfiguration.html#cfn-kinesisfirehose-deliverystream-extendeds3destinationconfiguration-rolearn </remarks>
        [JsiiProperty("roleArn", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object RoleArn
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``DeliveryStreamResource.ExtendedS3DestinationConfigurationProperty.S3BackupConfiguration``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-extendeds3destinationconfiguration.html#cfn-kinesisfirehose-deliverystream-extendeds3destinationconfiguration-s3backupconfiguration </remarks>
        [JsiiProperty("s3BackupConfiguration", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-kinesisfirehose.cloudformation.DeliveryStreamResource.S3DestinationConfigurationProperty\"}]},\"optional\":true}")]
        public virtual object S3BackupConfiguration
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``DeliveryStreamResource.ExtendedS3DestinationConfigurationProperty.S3BackupMode``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-extendeds3destinationconfiguration.html#cfn-kinesisfirehose-deliverystream-extendeds3destinationconfiguration-s3backupmode </remarks>
        [JsiiProperty("s3BackupMode", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object S3BackupMode
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}