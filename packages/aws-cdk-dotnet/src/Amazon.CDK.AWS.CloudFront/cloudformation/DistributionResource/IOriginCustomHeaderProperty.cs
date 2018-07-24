using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CloudFront.cloudformation.DistributionResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-origincustomheader.html </remarks>
    [JsiiInterface(typeof(IOriginCustomHeaderProperty), "@aws-cdk/aws-cloudfront.cloudformation.DistributionResource.OriginCustomHeaderProperty")]
    public interface IOriginCustomHeaderProperty
    {
        /// <summary>``DistributionResource.OriginCustomHeaderProperty.HeaderName``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-origincustomheader.html#cfn-cloudfront-distribution-origincustomheader-headername </remarks>
        [JsiiProperty("headerName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object HeaderName
        {
            get;
            set;
        }

        /// <summary>``DistributionResource.OriginCustomHeaderProperty.HeaderValue``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-origincustomheader.html#cfn-cloudfront-distribution-origincustomheader-headervalue </remarks>
        [JsiiProperty("headerValue", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object HeaderValue
        {
            get;
            set;
        }
    }
}