using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.S3
{
    [JsiiInterfaceProxy(typeof(IBucketPolicyProps), "@aws-cdk/aws-s3.BucketPolicyProps")]
    internal class BucketPolicyPropsProxy : DeputyBase, IBucketPolicyProps
    {
        private BucketPolicyPropsProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>The Amazon S3 bucket that the policy applies to.</summary>
        [JsiiProperty("bucket", "{\"fqn\":\"@aws-cdk/aws-s3.BucketRef\"}")]
        public virtual BucketRef Bucket
        {
            get => GetInstanceProperty<BucketRef>();
            set => SetInstanceProperty(value);
        }
    }
}