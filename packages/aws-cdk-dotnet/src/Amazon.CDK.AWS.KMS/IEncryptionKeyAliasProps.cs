using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.KMS
{
    [JsiiInterface(typeof(IEncryptionKeyAliasProps), "@aws-cdk/aws-kms.EncryptionKeyAliasProps")]
    public interface IEncryptionKeyAliasProps
    {
        /// <summary>
        /// The name of the alias. The name must start with alias followed by a
        /// forward slash, such as alias/. You can't specify aliases that begin with
        /// alias/AWS. These aliases are reserved.
        /// </summary>
        [JsiiProperty("alias", "{\"primitive\":\"string\"}")]
        string Alias
        {
            get;
            set;
        }

        /// <summary>
        /// The ID of the key for which you are creating the alias. Specify the key's
        /// globally unique identifier or Amazon Resource Name (ARN). You can't
        /// specify another alias.
        /// </summary>
        [JsiiProperty("key", "{\"fqn\":\"@aws-cdk/aws-kms.EncryptionKeyRef\"}")]
        EncryptionKeyRef Key
        {
            get;
            set;
        }
    }
}