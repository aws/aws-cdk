using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.KinesisFirehose.cloudformation.DeliveryStreamResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-encryptionconfiguration.html </remarks>
    [JsiiInterfaceProxy(typeof(IEncryptionConfigurationProperty), "@aws-cdk/aws-kinesisfirehose.cloudformation.DeliveryStreamResource.EncryptionConfigurationProperty")]
    internal class EncryptionConfigurationPropertyProxy : DeputyBase, IEncryptionConfigurationProperty
    {
        private EncryptionConfigurationPropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``DeliveryStreamResource.EncryptionConfigurationProperty.KMSEncryptionConfig``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-encryptionconfiguration.html#cfn-kinesisfirehose-deliverystream-encryptionconfiguration-kmsencryptionconfig </remarks>
        [JsiiProperty("kmsEncryptionConfig", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-kinesisfirehose.cloudformation.DeliveryStreamResource.KMSEncryptionConfigProperty\"}]},\"optional\":true}")]
        public virtual object KmsEncryptionConfig
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``DeliveryStreamResource.EncryptionConfigurationProperty.NoEncryptionConfig``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-encryptionconfiguration.html#cfn-kinesisfirehose-deliverystream-encryptionconfiguration-noencryptionconfig </remarks>
        [JsiiProperty("noEncryptionConfig", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object NoEncryptionConfig
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}