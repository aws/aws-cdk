using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CloudFront.cloudformation.StreamingDistributionResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-streamingdistribution-s3origin.html </remarks>
    [JsiiInterface(typeof(IS3OriginProperty), "@aws-cdk/aws-cloudfront.cloudformation.StreamingDistributionResource.S3OriginProperty")]
    public interface IS3OriginProperty
    {
        /// <summary>``StreamingDistributionResource.S3OriginProperty.DomainName``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-streamingdistribution-s3origin.html#cfn-cloudfront-streamingdistribution-s3origin-domainname </remarks>
        [JsiiProperty("domainName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object DomainName
        {
            get;
            set;
        }

        /// <summary>``StreamingDistributionResource.S3OriginProperty.OriginAccessIdentity``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-streamingdistribution-s3origin.html#cfn-cloudfront-streamingdistribution-s3origin-originaccessidentity </remarks>
        [JsiiProperty("originAccessIdentity", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object OriginAccessIdentity
        {
            get;
            set;
        }
    }
}