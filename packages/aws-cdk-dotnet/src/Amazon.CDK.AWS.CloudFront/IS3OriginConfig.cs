using Amazon.CDK.AWS.CloudFront.cloudformation;
using Amazon.CDK.AWS.S3;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CloudFront
{
    [JsiiInterface(typeof(IS3OriginConfig), "@aws-cdk/aws-cloudfront.S3OriginConfig")]
    public interface IS3OriginConfig
    {
        /// <summary>The source bucket to serve content from</summary>
        [JsiiProperty("s3BucketSource", "{\"fqn\":\"@aws-cdk/aws-s3.Bucket\"}")]
        Bucket S3BucketSource
        {
            get;
        }

        /// <summary>The optional origin identity cloudfront will use when calling your s3 bucket.</summary>
        [JsiiProperty("originAccessIdentity", "{\"fqn\":\"@aws-cdk/aws-cloudfront.cloudformation.CloudFrontOriginAccessIdentityResource\",\"optional\":true}")]
        CloudFrontOriginAccessIdentityResource_ OriginAccessIdentity
        {
            get;
        }
    }
}