using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.KinesisFirehose.cloudformation.DeliveryStreamResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-kmsencryptionconfig.html </remarks>
    [JsiiInterface(typeof(IKMSEncryptionConfigProperty), "@aws-cdk/aws-kinesisfirehose.cloudformation.DeliveryStreamResource.KMSEncryptionConfigProperty")]
    public interface IKMSEncryptionConfigProperty
    {
        /// <summary>``DeliveryStreamResource.KMSEncryptionConfigProperty.AWSKMSKeyARN``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-kmsencryptionconfig.html#cfn-kinesisfirehose-deliverystream-kmsencryptionconfig-awskmskeyarn </remarks>
        [JsiiProperty("awskmsKeyArn", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object AwskmsKeyArn
        {
            get;
            set;
        }
    }
}