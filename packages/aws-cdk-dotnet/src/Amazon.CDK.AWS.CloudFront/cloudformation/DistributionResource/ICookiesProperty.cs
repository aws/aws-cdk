using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CloudFront.cloudformation.DistributionResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-cookies.html </remarks>
    [JsiiInterface(typeof(ICookiesProperty), "@aws-cdk/aws-cloudfront.cloudformation.DistributionResource.CookiesProperty")]
    public interface ICookiesProperty
    {
        /// <summary>``DistributionResource.CookiesProperty.Forward``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-cookies.html#cfn-cloudfront-distribution-cookies-forward </remarks>
        [JsiiProperty("forward", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object Forward
        {
            get;
            set;
        }

        /// <summary>``DistributionResource.CookiesProperty.WhitelistedNames``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-cookies.html#cfn-cloudfront-distribution-cookies-whitelistednames </remarks>
        [JsiiProperty("whitelistedNames", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}}}]},\"optional\":true}")]
        object WhitelistedNames
        {
            get;
            set;
        }
    }
}