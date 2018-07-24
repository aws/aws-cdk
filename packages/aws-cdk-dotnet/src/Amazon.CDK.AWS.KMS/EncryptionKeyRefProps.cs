using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.KMS
{
    public class EncryptionKeyRefProps : DeputyBase, IEncryptionKeyRefProps
    {
        /// <summary>The ARN of the external KMS key.</summary>
        [JsiiProperty("keyArn", "{\"fqn\":\"@aws-cdk/aws-kms.KeyArn\"}", true)]
        public KeyArn KeyArn
        {
            get;
            set;
        }
    }
}