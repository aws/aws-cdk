using Amazon.CDK;
using Amazon.CDK.AWS.IAM;
using Amazon.CDK.AWS.KMS;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.S3
{
    /// <summary>
    /// Represents an S3 Bucket.
    /// 
    /// Buckets can be either defined within this stack:
    /// 
    ///      new Bucket(this, 'MyBucket', { props });
    /// 
    /// Or imported from an existing bucket:
    /// 
    ///      BucketRef.import(this, 'MyImportedBucket', { bucketArn: ... });
    /// 
    /// You can also export a bucket and import it into another stack:
    /// 
    ///      const ref = myBucket.export();
    ///      BucketRef.import(this, 'MyImportedBucket', ref);
    /// </summary>
    [JsiiClass(typeof(BucketRef), "@aws-cdk/aws-s3.BucketRef", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}}]")]
    public abstract class BucketRef : Construct
    {
        protected BucketRef(Construct parent, string name): base(new DeputyProps(new object[]{parent, name}))
        {
        }

        protected BucketRef(ByRefValue reference): base(reference)
        {
        }

        protected BucketRef(DeputyProps props): base(props)
        {
        }

        /// <summary>The ARN of the bucket.</summary>
        [JsiiProperty("bucketArn", "{\"fqn\":\"@aws-cdk/aws-s3.BucketArn\"}")]
        public virtual BucketArn BucketArn
        {
            get => GetInstanceProperty<BucketArn>();
        }

        /// <summary>The name of the bucket.</summary>
        [JsiiProperty("bucketName", "{\"fqn\":\"@aws-cdk/aws-s3.BucketName\"}")]
        public virtual BucketName BucketName
        {
            get => GetInstanceProperty<BucketName>();
        }

        /// <summary>Optional KMS encryption key associated with this bucket.</summary>
        [JsiiProperty("encryptionKey", "{\"fqn\":\"@aws-cdk/aws-kms.EncryptionKeyRef\",\"optional\":true}")]
        public virtual EncryptionKeyRef EncryptionKey
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
        protected virtual BucketPolicy Policy
        {
            get => GetInstanceProperty<BucketPolicy>();
            set => SetInstanceProperty(value);
        }

        /// <summary>
        /// Indicates if a bucket resource policy should automatically created upon
        /// the first call to `addToResourcePolicy`.
        /// </summary>
        [JsiiProperty("autoCreatePolicy", "{\"primitive\":\"boolean\"}")]
        protected virtual bool AutoCreatePolicy
        {
            get => GetInstanceProperty<bool>();
            set => SetInstanceProperty(value);
        }

        /// <summary>The https:// URL of this bucket.</summary>
        /// <remarks>
        /// example: https://s3.us-west-1.amazonaws.com/onlybucket
        /// Similar to calling `urlForObject` with no object key.
        /// </remarks>
        [JsiiProperty("bucketUrl", "{\"fqn\":\"@aws-cdk/aws-s3.S3Url\"}")]
        public virtual S3Url BucketUrl
        {
            get => GetInstanceProperty<S3Url>();
        }

        /// <summary>Creates a Bucket construct that represents an external bucket.</summary>
        /// <param name = "parent">The parent creating construct (usually `this`).</param>
        /// <param name = "name">The construct's name.</param>
        [JsiiMethod("import", "{\"fqn\":\"@aws-cdk/aws-s3.BucketRef\"}", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"props\",\"type\":{\"fqn\":\"@aws-cdk/aws-s3.BucketRefProps\"}}]")]
        public static BucketRef Import(Construct parent, string name, IBucketRefProps props)
        {
            return InvokeStaticMethod<BucketRef>(typeof(BucketRef), new object[]{parent, name, props});
        }

        /// <summary>Exports this bucket from the stack.</summary>
        [JsiiMethod("export", "{\"fqn\":\"@aws-cdk/aws-s3.BucketRefProps\"}", "[]")]
        public virtual IBucketRefProps Export()
        {
            return InvokeInstanceMethod<IBucketRefProps>(new object[]{});
        }

        /// <summary>
        /// Adds a statement to the resource policy for a principal (i.e.
        /// account/role/service) to perform actions on this bucket and/or it's
        /// contents. Use `bucketArn` and `arnForObjects(keys)` to obtain ARNs for
        /// this bucket or objects.
        /// </summary>
        [JsiiMethod("addToResourcePolicy", null, "[{\"name\":\"permission\",\"type\":{\"fqn\":\"@aws-cdk/cdk.PolicyStatement\"}}]")]
        public virtual void AddToResourcePolicy(PolicyStatement permission)
        {
            InvokeInstanceVoidMethod(new object[]{permission});
        }

        /// <summary>The https URL of an S3 object. For example:</summary>
        /// <param name = "key">
        /// The S3 key of the object. If not specified, the URL of the
        /// bucket is returned.
        /// </param>
        /// <returns>an ObjectS3Url token</returns>
        /// <remarks>example: https://s3.cn-north-1.amazonaws.com.cn/china-bucket/mykey</remarks>
        [JsiiMethod("urlForObject", "{\"fqn\":\"@aws-cdk/aws-s3.S3Url\"}", "[{\"name\":\"key\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
        public virtual S3Url UrlForObject(object key)
        {
            return InvokeInstanceMethod<S3Url>(new object[]{key});
        }

        /// <summary>
        /// Returns an ARN that represents all objects within the bucket that match
        /// the key pattern specified. To represent all keys, specify ``"*"``.
        /// 
        /// If you specify multiple components for keyPattern, they will be concatenated::
        /// 
        ///      arnForObjects('home/', team, '/', user, '/*')
        /// </summary>
        [JsiiMethod("arnForObjects", "{\"fqn\":\"@aws-cdk/cdk.Arn\"}", "[{\"name\":\"keyPattern\",\"type\":{\"primitive\":\"any\"}}]")]
        public virtual Arn ArnForObjects(object keyPattern)
        {
            return InvokeInstanceMethod<Arn>(new object[]{keyPattern});
        }

        /// <summary>
        /// Temporary API for granting read permissions for this bucket and it's
        /// contents to an IAM principal (Role/Group/User).
        /// 
        /// If an encryption key is used, permission to ues the key to decrypt the
        /// contents of the bucket will also be granted.
        /// </summary>
        [JsiiMethod("grantRead", null, "[{\"name\":\"identity\",\"type\":{\"fqn\":\"@aws-cdk/aws-iam.IPrincipal\",\"optional\":true}},{\"name\":\"objectsKeyPattern\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
        public virtual void GrantRead(IIPrincipal identity, object objectsKeyPattern)
        {
            InvokeInstanceVoidMethod(new object[]{identity, objectsKeyPattern});
        }

        /// <summary>
        /// Grants read/write permissions for this bucket and it's contents to an IAM
        /// principal (Role/Group/User).
        /// 
        /// If an encryption key is used, permission to use the key for
        /// encrypt/decrypt will also be granted.
        /// </summary>
        [JsiiMethod("grantReadWrite", null, "[{\"name\":\"identity\",\"type\":{\"fqn\":\"@aws-cdk/aws-iam.IPrincipal\",\"optional\":true}},{\"name\":\"objectsKeyPattern\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
        public virtual void GrantReadWrite(IIPrincipal identity, object objectsKeyPattern)
        {
            InvokeInstanceVoidMethod(new object[]{identity, objectsKeyPattern});
        }
    }
}