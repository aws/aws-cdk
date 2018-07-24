using Amazon.CDK.AWS.CloudFront.cloudformation;
using Amazon.CDK.AWS.S3;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CloudFront
{
    [JsiiInterfaceProxy(typeof(IS3OriginConfig), "@aws-cdk/aws-cloudfront.S3OriginConfig")]
    internal class S3OriginConfigProxy : DeputyBase, IS3OriginConfig
    {
        private S3OriginConfigProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>The source bucket to serve content from</summary>
        [JsiiProperty("s3BucketSource", "{\"fqn\":\"@aws-cdk/aws-s3.Bucket\"}")]
        public virtual Bucket S3BucketSource
        {
            get => GetInstanceProperty<Bucket>();
        }

        /// <summary>The optional origin identity cloudfront will use when calling your s3 bucket.</summary>
        [JsiiProperty("originAccessIdentity", "{\"fqn\":\"@aws-cdk/aws-cloudfront.cloudformation.CloudFrontOriginAccessIdentityResource\",\"optional\":true}")]
        public virtual CloudFrontOriginAccessIdentityResource_ OriginAccessIdentity
        {
            get => GetInstanceProperty<CloudFrontOriginAccessIdentityResource_>();
        }
    }
}