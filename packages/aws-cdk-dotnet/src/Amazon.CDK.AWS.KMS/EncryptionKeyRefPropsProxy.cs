using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.KMS
{
    [JsiiInterfaceProxy(typeof(IEncryptionKeyRefProps), "@aws-cdk/aws-kms.EncryptionKeyRefProps")]
    internal class EncryptionKeyRefPropsProxy : DeputyBase, IEncryptionKeyRefProps
    {
        private EncryptionKeyRefPropsProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>The ARN of the external KMS key.</summary>
        [JsiiProperty("keyArn", "{\"fqn\":\"@aws-cdk/aws-kms.KeyArn\"}")]
        public virtual KeyArn KeyArn
        {
            get => GetInstanceProperty<KeyArn>();
            set => SetInstanceProperty(value);
        }
    }
}