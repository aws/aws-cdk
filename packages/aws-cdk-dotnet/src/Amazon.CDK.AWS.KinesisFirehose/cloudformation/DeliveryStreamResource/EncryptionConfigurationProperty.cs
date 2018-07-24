using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.KinesisFirehose.cloudformation.DeliveryStreamResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-encryptionconfiguration.html </remarks>
    public class EncryptionConfigurationProperty : DeputyBase, IEncryptionConfigurationProperty
    {
        /// <summary>``DeliveryStreamResource.EncryptionConfigurationProperty.KMSEncryptionConfig``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-encryptionconfiguration.html#cfn-kinesisfirehose-deliverystream-encryptionconfiguration-kmsencryptionconfig </remarks>
        [JsiiProperty("kmsEncryptionConfig", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-kinesisfirehose.cloudformation.DeliveryStreamResource.KMSEncryptionConfigProperty\"}]},\"optional\":true}", true)]
        public object KmsEncryptionConfig
        {
            get;
            set;
        }

        /// <summary>``DeliveryStreamResource.EncryptionConfigurationProperty.NoEncryptionConfig``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-encryptionconfiguration.html#cfn-kinesisfirehose-deliverystream-encryptionconfiguration-noencryptionconfig </remarks>
        [JsiiProperty("noEncryptionConfig", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object NoEncryptionConfig
        {
            get;
            set;
        }
    }
}