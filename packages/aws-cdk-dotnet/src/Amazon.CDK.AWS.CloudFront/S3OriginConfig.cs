using Amazon.CDK.AWS.CloudFront.cloudformation;
using Amazon.CDK.AWS.S3;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CloudFront
{
    public class S3OriginConfig : DeputyBase, IS3OriginConfig
    {
        /// <summary>The source bucket to serve content from</summary>
        [JsiiProperty("s3BucketSource", "{\"fqn\":\"@aws-cdk/aws-s3.Bucket\"}", true)]
        public Bucket S3BucketSource
        {
            get;
        }

        /// <summary>The optional origin identity cloudfront will use when calling your s3 bucket.</summary>
        [JsiiProperty("originAccessIdentity", "{\"fqn\":\"@aws-cdk/aws-cloudfront.cloudformation.CloudFrontOriginAccessIdentityResource\",\"optional\":true}", true)]
        public CloudFrontOriginAccessIdentityResource_ OriginAccessIdentity
        {
            get;
        }
    }
}