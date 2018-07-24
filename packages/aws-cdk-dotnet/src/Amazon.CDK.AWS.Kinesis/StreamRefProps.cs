using Amazon.CDK.AWS.KMS;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Kinesis
{
    /// <summary>
    /// A reference to a stream. The easiest way to instantiate is to call
    /// `stream.export()`. Then, the consumer can use `Stream.import(this, ref)` and
    /// get a `Stream`.
    /// </summary>
    public class StreamRefProps : DeputyBase, IStreamRefProps
    {
        /// <summary>The ARN of the stream.</summary>
        [JsiiProperty("streamArn", "{\"fqn\":\"@aws-cdk/aws-kinesis.StreamArn\"}", true)]
        public StreamArn StreamArn
        {
            get;
            set;
        }

        /// <summary>The KMS key securing the contents of the stream if encryption is enabled.</summary>
        [JsiiProperty("encryptionKey", "{\"fqn\":\"@aws-cdk/aws-kms.EncryptionKeyRefProps\",\"optional\":true}", true)]
        public IEncryptionKeyRefProps EncryptionKey
        {
            get;
            set;
        }
    }
}