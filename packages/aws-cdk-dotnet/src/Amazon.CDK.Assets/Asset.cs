using Amazon.CDK;
using Amazon.CDK.AWS.IAM;
using Amazon.CDK.AWS.S3;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.Assets
{
    /// <summary>
    /// An asset represents a local file or directory, which is automatically uploaded to S3
    /// and then can be referenced within a CDK application.
    /// </summary>
    [JsiiClass(typeof(Asset), "@aws-cdk/assets.Asset", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"id\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"props\",\"type\":{\"fqn\":\"@aws-cdk/assets.GenericAssetProps\"}}]")]
    public class Asset : Construct
    {
        public Asset(Construct parent, string id, IGenericAssetProps props): base(new DeputyProps(new object[]{parent, id, props}))
        {
        }

        protected Asset(ByRefValue reference): base(reference)
        {
        }

        protected Asset(DeputyProps props): base(props)
        {
        }

        /// <summary>Attribute that represents the name of the bucket this asset exists in.</summary>
        [JsiiProperty("s3BucketName", "{\"fqn\":\"@aws-cdk/aws-s3.BucketName\"}")]
        public virtual BucketName S3BucketName
        {
            get => GetInstanceProperty<BucketName>();
        }

        /// <summary>Attribute which represents the S3 object key of this asset.</summary>
        [JsiiProperty("s3ObjectKey", "{\"fqn\":\"@aws-cdk/aws-s3.ObjectKey\"}")]
        public virtual ObjectKey S3ObjectKey
        {
            get => GetInstanceProperty<ObjectKey>();
        }

        /// <summary>Attribute which represents the S3 URL of this asset.</summary>
        /// <remarks>example: https://s3.us-west-1.amazonaws.com/bucket/key</remarks>
        [JsiiProperty("s3Url", "{\"fqn\":\"@aws-cdk/aws-s3.S3Url\"}")]
        public virtual S3Url S3Url
        {
            get => GetInstanceProperty<S3Url>();
        }

        /// <summary>Resolved full-path location of this asset.</summary>
        [JsiiProperty("assetPath", "{\"primitive\":\"string\"}")]
        public virtual string AssetPath
        {
            get => GetInstanceProperty<string>();
        }

        /// <summary>Grants read permissions to the principal on the asset's S3 object.</summary>
        [JsiiMethod("grantRead", null, "[{\"name\":\"principal\",\"type\":{\"fqn\":\"@aws-cdk/aws-iam.IPrincipal\",\"optional\":true}}]")]
        public virtual void GrantRead(IIPrincipal principal)
        {
            InvokeInstanceVoidMethod(new object[]{principal});
        }
    }
}