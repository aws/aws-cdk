using Amazon.CDK;
using Amazon.CDK.AWS.KMS;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.S3
{
    /// <summary>
    /// An S3 bucket with associated policy objects
    /// 
    /// This bucket does not yet have all features that exposed by the underlying
    /// BucketResource.
    /// </summary>
    [JsiiClass(typeof(Bucket), "@aws-cdk/aws-s3.Bucket", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"props\",\"type\":{\"fqn\":\"@aws-cdk/aws-s3.BucketProps\",\"optional\":true}}]")]
    public class Bucket : BucketRef
    {
        public Bucket(Construct parent, string name, IBucketProps props): base(new DeputyProps(new object[]{parent, name, props}))
        {
        }

        protected Bucket(ByRefValue reference): base(reference)
        {
        }

        protected Bucket(DeputyProps props): base(props)
        {
        }

        /// <summary>The ARN of the bucket.</summary>
        [JsiiProperty("bucketArn", "{\"fqn\":\"@aws-cdk/aws-s3.BucketArn\"}")]
        public override BucketArn BucketArn
        {
            get => GetInstanceProperty<BucketArn>();
        }

        /// <summary>The name of the bucket.</summary>
        [JsiiProperty("bucketName", "{\"fqn\":\"@aws-cdk/aws-s3.BucketName\"}")]
        public override BucketName BucketName
        {
            get => GetInstanceProperty<BucketName>();
        }

        [JsiiProperty("domainName", "{\"fqn\":\"@aws-cdk/aws-s3.BucketDomainName\"}")]
        public virtual BucketDomainName DomainName
        {
            get => GetInstanceProperty<BucketDomainName>();
        }

        [JsiiProperty("dualstackDomainName", "{\"fqn\":\"@aws-cdk/aws-s3.BucketDualStackDomainName\"}")]
        public virtual BucketDualStackDomainName DualstackDomainName
        {
            get => GetInstanceProperty<BucketDualStackDomainName>();
        }

        /// <summary>Optional KMS encryption key associated with this bucket.</summary>
        [JsiiProperty("encryptionKey", "{\"fqn\":\"@aws-cdk/aws-kms.EncryptionKeyRef\",\"optional\":true}")]
        public override EncryptionKeyRef EncryptionKey
        {
            get => GetInstanceProperty<EncryptionKeyRef>();
        }

        /// <summary>
        /// The resource policy assoicated with this bucket.
        /// 
        /// If `autoCreatePolicy` is true, a `BucketPolicy` will be created upon the
        /// first call to addToResourcePolicy(s).
        /// </summary>
        [JsiiProperty("policy", "{\"fqn\":\"@aws-cdk/aws-s3.BucketPolicy\",\"optional\":true}")]
        protected override BucketPolicy Policy
        {
            get => GetInstanceProperty<BucketPolicy>();
            set => SetInstanceProperty(value);
        }

        /// <summary>
        /// Indicates if a bucket resource policy should automatically created upon
        /// the first call to `addToResourcePolicy`.
        /// </summary>
        [JsiiProperty("autoCreatePolicy", "{\"primitive\":\"boolean\"}")]
        protected override bool AutoCreatePolicy
        {
            get => GetInstanceProperty<bool>();
            set => SetInstanceProperty(value);
        }

        /// <summary>Add a lifecycle rule to the bucket</summary>
        /// <param name = "rule">The rule to add</param>
        [JsiiMethod("addLifecycleRule", null, "[{\"name\":\"rule\",\"type\":{\"fqn\":\"@aws-cdk/aws-s3.LifecycleRule\"}}]")]
        public virtual void AddLifecycleRule(ILifecycleRule rule)
        {
            InvokeInstanceVoidMethod(new object[]{rule});
        }
    }
}