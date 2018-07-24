using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.KMS
{
    /// <summary>Definews a KMS key.</summary>
    [JsiiClass(typeof(EncryptionKey), "@aws-cdk/aws-kms.EncryptionKey", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"props\",\"type\":{\"fqn\":\"@aws-cdk/aws-kms.EncryptionKeyProps\",\"optional\":true}}]")]
    public class EncryptionKey : EncryptionKeyRef
    {
        public EncryptionKey(Construct parent, string name, IEncryptionKeyProps props): base(new DeputyProps(new object[]{parent, name, props}))
        {
        }

        protected EncryptionKey(ByRefValue reference): base(reference)
        {
        }

        protected EncryptionKey(DeputyProps props): base(props)
        {
        }

        /// <summary>The ARN of the key.</summary>
        [JsiiProperty("keyArn", "{\"fqn\":\"@aws-cdk/aws-kms.KeyArn\"}")]
        public override KeyArn KeyArn
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
        protected override PolicyDocument Policy
        {
            get => GetInstanceProperty<PolicyDocument>();
        }
    }
}