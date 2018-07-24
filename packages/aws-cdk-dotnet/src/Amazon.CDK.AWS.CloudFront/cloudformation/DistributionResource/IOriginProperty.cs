using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CloudFront.cloudformation.DistributionResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-origin.html </remarks>
    [JsiiInterface(typeof(IOriginProperty), "@aws-cdk/aws-cloudfront.cloudformation.DistributionResource.OriginProperty")]
    public interface IOriginProperty
    {
        /// <summary>``DistributionResource.OriginProperty.CustomOriginConfig``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-origin.html#cfn-cloudfront-distribution-origin-customoriginconfig </remarks>
        [JsiiProperty("customOriginConfig", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-cloudfront.cloudformation.DistributionResource.CustomOriginConfigProperty\"}]},\"optional\":true}")]
        object CustomOriginConfig
        {
            get;
            set;
        }

        /// <summary>``DistributionResource.OriginProperty.DomainName``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-origin.html#cfn-cloudfront-distribution-origin-domainname </remarks>
        [JsiiProperty("domainName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object DomainName
        {
            get;
            set;
        }

        /// <summary>``DistributionResource.OriginProperty.Id``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-origin.html#cfn-cloudfront-distribution-origin-id </remarks>
        [JsiiProperty("id", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object Id
        {
            get;
            set;
        }

        /// <summary>``DistributionResource.OriginProperty.OriginCustomHeaders``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-origin.html#cfn-cloudfront-distribution-origin-origincustomheaders </remarks>
        [JsiiProperty("originCustomHeaders", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-cloudfront.cloudformation.DistributionResource.OriginCustomHeaderProperty\"}]}}}}]},\"optional\":true}")]
        object OriginCustomHeaders
        {
            get;
            set;
        }

        /// <summary>``DistributionResource.OriginProperty.OriginPath``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-origin.html#cfn-cloudfront-distribution-origin-originpath </remarks>
        [JsiiProperty("originPath", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object OriginPath
        {
            get;
            set;
        }

        /// <summary>``DistributionResource.OriginProperty.S3OriginConfig``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-origin.html#cfn-cloudfront-distribution-origin-s3originconfig </remarks>
        [JsiiProperty("s3OriginConfig", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-cloudfront.cloudformation.DistributionResource.S3OriginConfigProperty\"}]},\"optional\":true}")]
        object S3OriginConfig
        {
            get;
            set;
        }
    }
}