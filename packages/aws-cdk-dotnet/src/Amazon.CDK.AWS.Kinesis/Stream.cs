using Amazon.CDK;
using Amazon.CDK.AWS.KMS;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Kinesis
{
    /// <summary>A Kinesis stream. Can be encrypted with a KMS key.</summary>
    [JsiiClass(typeof(Stream), "@aws-cdk/aws-kinesis.Stream", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"props\",\"type\":{\"fqn\":\"@aws-cdk/aws-kinesis.StreamProps\",\"optional\":true}}]")]
    public class Stream : StreamRef
    {
        public Stream(Construct parent, string name, IStreamProps props): base(new DeputyProps(new object[]{parent, name, props}))
        {
        }

        protected Stream(ByRefValue reference): base(reference)
        {
        }

        protected Stream(DeputyProps props): base(props)
        {
        }

        /// <summary>The ARN of the stream.</summary>
        [JsiiProperty("streamArn", "{\"fqn\":\"@aws-cdk/aws-kinesis.StreamArn\"}")]
        public override StreamArn StreamArn
        {
            get => GetInstanceProperty<StreamArn>();
        }

        /// <summary>The name of the stream</summary>
        [JsiiProperty("streamName", "{\"fqn\":\"@aws-cdk/aws-kinesis.StreamName\"}")]
        public override StreamName StreamName
        {
            get => GetInstanceProperty<StreamName>();
        }

        /// <summary>Optional KMS encryption key associated with this stream.</summary>
        [JsiiProperty("encryptionKey", "{\"fqn\":\"@aws-cdk/aws-kms.EncryptionKeyRef\",\"optional\":true}")]
        public override EncryptionKeyRef EncryptionKey
        {
            get => GetInstanceProperty<EncryptionKeyRef>();
        }
    }
}