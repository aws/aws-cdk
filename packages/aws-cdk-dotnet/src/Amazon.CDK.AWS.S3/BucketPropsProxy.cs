using Amazon.CDK;
using Amazon.CDK.AWS.KMS;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.S3
{
    [JsiiInterfaceProxy(typeof(IBucketProps), "@aws-cdk/aws-s3.BucketProps")]
    internal class BucketPropsProxy : DeputyBase, IBucketProps
    {
        private BucketPropsProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>
        /// The kind of server-side encryption to apply to this bucket.
        /// 
        /// If you choose KMS, you can specify a KMS key via `encryptionKey`. If
        /// encryption key is not specified, a key will automatically be created.
        /// </summary>
        /// <remarks>default: Unencrypted</remarks>
        [JsiiProperty("encryption", "{\"fqn\":\"@aws-cdk/aws-s3.BucketEncryption\",\"optional\":true}")]
        public virtual BucketEncryption Encryption
        {
            get => GetInstanceProperty<BucketEncryption>();
            set => SetInstanceProperty(value);
        }

        /// <summary>
        /// External KMS key to use for bucket encryption.
        /// 
        /// The 'encryption' property must be either not specified or set to "Kms".
        /// An error will be emitted if encryption is set to "Unencrypted" or
        /// "Managed".
        /// </summary>
        /// <remarks>
        /// default: If encryption is set to "Kms" and this property is undefined, a
        /// new KMS key will be created and associated with this bucket.
        /// </remarks>
        [JsiiProperty("encryptionKey", "{\"fqn\":\"@aws-cdk/aws-kms.EncryptionKeyRef\",\"optional\":true}")]
        public virtual EncryptionKeyRef EncryptionKey
        {
            get => GetInstanceProperty<EncryptionKeyRef>();
            set => SetInstanceProperty(value);
        }

        /// <summary>Physical name of this bucket.</summary>
        /// <remarks>default: Assigned by CloudFormation (recommended)</remarks>
        [JsiiProperty("bucketName", "{\"primitive\":\"string\",\"optional\":true}")]
        public virtual string BucketName
        {
            get => GetInstanceProperty<string>();
            set => SetInstanceProperty(value);
        }

        /// <summary>Policy to apply when the bucket is removed from this stack.</summary>
        /// <remarks>default: By default, the bucket will be destroyed if it is removed from the stack.</remarks>
        [JsiiProperty("removalPolicy", "{\"fqn\":\"@aws-cdk/cdk.RemovalPolicy\",\"optional\":true}")]
        public virtual RemovalPolicy RemovalPolicy
        {
            get => GetInstanceProperty<RemovalPolicy>();
            set => SetInstanceProperty(value);
        }

        /// <summary>The bucket policy associated with this bucket.</summary>
        /// <remarks>
        /// default: A bucket policy will be created automatically in the first call
        /// to addToPolicy.
        /// </remarks>
        [JsiiProperty("policy", "{\"fqn\":\"@aws-cdk/aws-s3.BucketPolicy\",\"optional\":true}")]
        public virtual BucketPolicy Policy
        {
            get => GetInstanceProperty<BucketPolicy>();
            set => SetInstanceProperty(value);
        }

        /// <summary>Whether this bucket should have versioning turned on or not.</summary>
        /// <remarks>default: false</remarks>
        [JsiiProperty("versioned", "{\"primitive\":\"boolean\",\"optional\":true}")]
        public virtual bool? Versioned
        {
            get => GetInstanceProperty<bool? >();
            set => SetInstanceProperty(value);
        }

        /// <summary>Rules that define how Amazon S3 manages objects during their lifetime.</summary>
        /// <remarks>default: No lifecycle rules</remarks>
        [JsiiProperty("lifecycleRules", "{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"fqn\":\"@aws-cdk/aws-s3.LifecycleRule\"}},\"optional\":true}")]
        public virtual ILifecycleRule[] LifecycleRules
        {
            get => GetInstanceProperty<ILifecycleRule[]>();
            set => SetInstanceProperty(value);
        }
    }
}