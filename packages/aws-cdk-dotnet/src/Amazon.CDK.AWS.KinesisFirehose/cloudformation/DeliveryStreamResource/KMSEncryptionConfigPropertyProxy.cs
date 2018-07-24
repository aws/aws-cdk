using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.KinesisFirehose.cloudformation.DeliveryStreamResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-kmsencryptionconfig.html </remarks>
    [JsiiInterfaceProxy(typeof(IKMSEncryptionConfigProperty), "@aws-cdk/aws-kinesisfirehose.cloudformation.DeliveryStreamResource.KMSEncryptionConfigProperty")]
    internal class KMSEncryptionConfigPropertyProxy : DeputyBase, IKMSEncryptionConfigProperty
    {
        private KMSEncryptionConfigPropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``DeliveryStreamResource.KMSEncryptionConfigProperty.AWSKMSKeyARN``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-kmsencryptionconfig.html#cfn-kinesisfirehose-deliverystream-kmsencryptionconfig-awskmskeyarn </remarks>
        [JsiiProperty("awskmsKeyArn", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object AwskmsKeyArn
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}