using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CloudFront.cloudformation.DistributionResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-customoriginconfig.html </remarks>
    [JsiiInterface(typeof(ICustomOriginConfigProperty), "@aws-cdk/aws-cloudfront.cloudformation.DistributionResource.CustomOriginConfigProperty")]
    public interface ICustomOriginConfigProperty
    {
        /// <summary>``DistributionResource.CustomOriginConfigProperty.HTTPPort``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-customoriginconfig.html#cfn-cloudfront-distribution-customoriginconfig-httpport </remarks>
        [JsiiProperty("httpPort", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object HttpPort
        {
            get;
            set;
        }

        /// <summary>``DistributionResource.CustomOriginConfigProperty.HTTPSPort``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-customoriginconfig.html#cfn-cloudfront-distribution-customoriginconfig-httpsport </remarks>
        [JsiiProperty("httpsPort", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object HttpsPort
        {
            get;
            set;
        }

        /// <summary>``DistributionResource.CustomOriginConfigProperty.OriginKeepaliveTimeout``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-customoriginconfig.html#cfn-cloudfront-distribution-customoriginconfig-originkeepalivetimeout </remarks>
        [JsiiProperty("originKeepaliveTimeout", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object OriginKeepaliveTimeout
        {
            get;
            set;
        }

        /// <summary>``DistributionResource.CustomOriginConfigProperty.OriginProtocolPolicy``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-customoriginconfig.html#cfn-cloudfront-distribution-customoriginconfig-originprotocolpolicy </remarks>
        [JsiiProperty("originProtocolPolicy", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object OriginProtocolPolicy
        {
            get;
            set;
        }

        /// <summary>``DistributionResource.CustomOriginConfigProperty.OriginReadTimeout``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-customoriginconfig.html#cfn-cloudfront-distribution-customoriginconfig-originreadtimeout </remarks>
        [JsiiProperty("originReadTimeout", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object OriginReadTimeout
        {
            get;
            set;
        }

        /// <summary>``DistributionResource.CustomOriginConfigProperty.OriginSSLProtocols``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-customoriginconfig.html#cfn-cloudfront-distribution-customoriginconfig-originsslprotocols </remarks>
        [JsiiProperty("originSslProtocols", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}}}]},\"optional\":true}")]
        object OriginSslProtocols
        {
            get;
            set;
        }
    }
}