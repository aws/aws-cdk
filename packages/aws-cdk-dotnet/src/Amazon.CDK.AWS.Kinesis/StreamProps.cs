using Amazon.CDK.AWS.KMS;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Kinesis
{
    public class StreamProps : DeputyBase, IStreamProps
    {
        /// <summary>Enforces a particular physical stream name.</summary>
        /// <remarks>default: &lt;generated&gt;</remarks>
        [JsiiProperty("streamName", "{\"primitive\":\"string\",\"optional\":true}", true)]
        public string StreamName
        {
            get;
            set;
        }

        /// <summary>The number of hours for the data records that are stored in shards to remain accessible.</summary>
        /// <remarks>default: 24</remarks>
        [JsiiProperty("retentionPeriodHours", "{\"primitive\":\"number\",\"optional\":true}", true)]
        public double? RetentionPeriodHours
        {
            get;
            set;
        }

        /// <summary>The number of shards for the stream.</summary>
        /// <remarks>default: 1</remarks>
        [JsiiProperty("shardCount", "{\"primitive\":\"number\",\"optional\":true}", true)]
        public double? ShardCount
        {
            get;
            set;
        }

        /// <summary>
        /// The kind of server-side encryption to apply to this stream.
        /// 
        /// If you choose KMS, you can specify a KMS key via `encryptionKey`. If
        /// encryption key is not specified, a key will automatically be created.
        /// </summary>
        /// <remarks>default: Unencrypted</remarks>
        [JsiiProperty("encryption", "{\"fqn\":\"@aws-cdk/aws-kinesis.StreamEncryption\",\"optional\":true}", true)]
        public StreamEncryption Encryption
        {
            get;
            set;
        }

        /// <summary>
        /// External KMS key to use for stream encryption.
        /// 
        /// The 'encryption' property must be set to "Kms".
        /// </summary>
        /// <remarks>
        /// default: If encryption is set to "Kms" and this property is undefined, a
        /// new KMS key will be created and associated with this stream.
        /// </remarks>
        [JsiiProperty("encryptionKey", "{\"fqn\":\"@aws-cdk/aws-kms.EncryptionKeyRef\",\"optional\":true}", true)]
        public EncryptionKeyRef EncryptionKey
        {
            get;
            set;
        }
    }
}