using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.S3
{
    [JsiiInterface(typeof(IBucketPolicyProps), "@aws-cdk/aws-s3.BucketPolicyProps")]
    public interface IBucketPolicyProps
    {
        /// <summary>The Amazon S3 bucket that the policy applies to.</summary>
        [JsiiProperty("bucket", "{\"fqn\":\"@aws-cdk/aws-s3.BucketRef\"}")]
        BucketRef Bucket
        {
            get;
            set;
        }
    }
}