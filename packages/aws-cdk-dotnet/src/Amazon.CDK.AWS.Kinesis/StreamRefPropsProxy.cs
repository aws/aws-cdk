using Amazon.CDK.AWS.KMS;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Kinesis
{
    /// <summary>
    /// A reference to a stream. The easiest way to instantiate is to call
    /// `stream.export()`. Then, the consumer can use `Stream.import(this, ref)` and
    /// get a `Stream`.
    /// </summary>
    [JsiiInterfaceProxy(typeof(IStreamRefProps), "@aws-cdk/aws-kinesis.StreamRefProps")]
    internal class StreamRefPropsProxy : DeputyBase, IStreamRefProps
    {
        private StreamRefPropsProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>The ARN of the stream.</summary>
        [JsiiProperty("streamArn", "{\"fqn\":\"@aws-cdk/aws-kinesis.StreamArn\"}")]
        public virtual StreamArn StreamArn
        {
            get => GetInstanceProperty<StreamArn>();
            set => SetInstanceProperty(value);
        }

        /// <summary>The KMS key securing the contents of the stream if encryption is enabled.</summary>
        [JsiiProperty("encryptionKey", "{\"fqn\":\"@aws-cdk/aws-kms.EncryptionKeyRefProps\",\"optional\":true}")]
        public virtual IEncryptionKeyRefProps EncryptionKey
        {
            get => GetInstanceProperty<IEncryptionKeyRefProps>();
            set => SetInstanceProperty(value);
        }
    }
}