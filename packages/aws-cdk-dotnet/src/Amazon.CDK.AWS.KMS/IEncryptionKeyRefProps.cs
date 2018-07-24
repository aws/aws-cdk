using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.KMS
{
    [JsiiInterface(typeof(IEncryptionKeyRefProps), "@aws-cdk/aws-kms.EncryptionKeyRefProps")]
    public interface IEncryptionKeyRefProps
    {
        /// <summary>The ARN of the external KMS key.</summary>
        [JsiiProperty("keyArn", "{\"fqn\":\"@aws-cdk/aws-kms.KeyArn\"}")]
        KeyArn KeyArn
        {
            get;
            set;
        }
    }
}