using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.KMS
{
    [JsiiClass(typeof(EncryptionKeyRef), "@aws-cdk/aws-kms.EncryptionKeyRef", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}}]")]
    public abstract class EncryptionKeyRef : Construct
    {
        protected EncryptionKeyRef(Construct parent, string name): base(new DeputyProps(new object[]{parent, name}))
        {
        }

        protected EncryptionKeyRef(ByRefValue reference): base(reference)
        {
        }

        protected EncryptionKeyRef(DeputyProps props): base(props)
        {
        }

        /// <summary>The ARN of the key.</summary>
        [JsiiProperty("keyArn", "{\"fqn\":\"@aws-cdk/aws-kms.KeyArn\"}")]
        public virtual KeyArn KeyArn
        {
            get => GetInstanceProperty<KeyArn>();
        }

        /// <summary>
        /// Optional policy document that represents the resource policy of this key.
        /// 
        /// If specified, addToResourcePolicy can be used to edit this policy.
        /// Otherwise this method will no-op.
        /// </summary>
        [JsiiProperty("policy", "{\"fqn\":\"@aws-cdk/cdk.PolicyDocument\",\"optional\":true}")]
        protected virtual PolicyDocument Policy
        {
            get => GetInstanceProperty<PolicyDocument>();
        }

        /// <summary>
        /// Defines an imported encryption key.
        /// 
        /// `ref` can be obtained either via a call to `key.export()` or using
        /// literals.
        /// 
        /// For example:
        /// 
        ///      const keyRefProps = key.export();
        ///      const keyRef1 = EncryptionKeyRef.import(this, 'MyImportedKey1', keyRefProps);
        ///      const keyRef2 = EncryptionKeyRef.import(this, 'MyImportedKey2', {
        ///          keyArn: new KeyArn('arn:aws:kms:...')
        ///      });
        /// </summary>
        /// <param name = "parent">The parent construct.</param>
        /// <param name = "name">The name of the construct.</param>
        /// <param name = "props">The key reference.</param>
        [JsiiMethod("import", "{\"fqn\":\"@aws-cdk/aws-kms.EncryptionKeyRef\"}", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"props\",\"type\":{\"fqn\":\"@aws-cdk/aws-kms.EncryptionKeyRefProps\"}}]")]
        public static EncryptionKeyRef Import(Construct parent, string name, IEncryptionKeyRefProps props)
        {
            return InvokeStaticMethod<EncryptionKeyRef>(typeof(EncryptionKeyRef), new object[]{parent, name, props});
        }

        /// <summary>Defines a new alias for the key.</summary>
        [JsiiMethod("addAlias", "{\"fqn\":\"@aws-cdk/aws-kms.EncryptionKeyAlias\"}", "[{\"name\":\"alias\",\"type\":{\"primitive\":\"string\"}}]")]
        public virtual EncryptionKeyAlias AddAlias(string alias)
        {
            return InvokeInstanceMethod<EncryptionKeyAlias>(new object[]{alias});
        }

        /// <summary>Adds a statement to the KMS key resource policy.</summary>
        [JsiiMethod("addToResourcePolicy", null, "[{\"name\":\"statement\",\"type\":{\"fqn\":\"@aws-cdk/cdk.PolicyStatement\"}}]")]
        public virtual void AddToResourcePolicy(PolicyStatement statement)
        {
            InvokeInstanceVoidMethod(new object[]{statement});
        }

        /// <summary>Exports this key from the current stack.</summary>
        /// <returns>a key ref which can be used in a call to `EncryptionKey.import(ref)`.</returns>
        [JsiiMethod("export", "{\"fqn\":\"@aws-cdk/aws-kms.EncryptionKeyRefProps\"}", "[]")]
        public virtual IEncryptionKeyRefProps Export()
        {
            return InvokeInstanceMethod<IEncryptionKeyRefProps>(new object[]{});
        }
    }
}