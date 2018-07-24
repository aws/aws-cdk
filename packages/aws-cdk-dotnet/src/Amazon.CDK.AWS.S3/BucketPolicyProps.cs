using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.S3
{
    public class BucketPolicyProps : DeputyBase, IBucketPolicyProps
    {
        /// <summary>The Amazon S3 bucket that the policy applies to.</summary>
        [JsiiProperty("bucket", "{\"fqn\":\"@aws-cdk/aws-s3.BucketRef\"}", true)]
        public BucketRef Bucket
        {
            get;
            set;
        }
    }
}