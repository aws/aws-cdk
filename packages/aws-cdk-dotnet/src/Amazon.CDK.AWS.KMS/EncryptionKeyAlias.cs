using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.KMS
{
    /// <summary>
    /// Defines a display name for a customer master key (CMK) in AWS Key Management
    /// Service (AWS KMS). Using an alias to refer to a key can help you simplify key
    /// management. For example, when rotating keys, you can just update the alias
    /// mapping instead of tracking and changing key IDs. For more information, see
    /// Working with Aliases in the AWS Key Management Service Developer Guide.
    /// 
    /// You can also add an alias for a key by calling `key.addAlias(alias)`.
    /// </summary>
    [JsiiClass(typeof(EncryptionKeyAlias), "@aws-cdk/aws-kms.EncryptionKeyAlias", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"props\",\"type\":{\"fqn\":\"@aws-cdk/aws-kms.EncryptionKeyAliasProps\"}}]")]
    public class EncryptionKeyAlias : Construct
    {
        public EncryptionKeyAlias(Construct parent, string name, IEncryptionKeyAliasProps props): base(new DeputyProps(new object[]{parent, name, props}))
        {
        }

        protected EncryptionKeyAlias(ByRefValue reference): base(reference)
        {
        }

        protected EncryptionKeyAlias(DeputyProps props): base(props)
        {
        }

        /// <summary>The name of the alias.</summary>
        [JsiiProperty("aliasName", "{\"fqn\":\"@aws-cdk/aws-kms.AliasName\"}")]
        public virtual AliasName AliasName
        {
            get => GetInstanceProperty<AliasName>();
            set => SetInstanceProperty(value);
        }
    }
}