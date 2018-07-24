using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CloudFront.cloudformation.DistributionResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-distributionconfig.html </remarks>
    [JsiiInterface(typeof(IDistributionConfigProperty), "@aws-cdk/aws-cloudfront.cloudformation.DistributionResource.DistributionConfigProperty")]
    public interface IDistributionConfigProperty
    {
        /// <summary>``DistributionResource.DistributionConfigProperty.Aliases``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-distributionconfig.html#cfn-cloudfront-distribution-distributionconfig-aliases </remarks>
        [JsiiProperty("aliases", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}}}]},\"optional\":true}")]
        object Aliases
        {
            get;
            set;
        }

        /// <summary>``DistributionResource.DistributionConfigProperty.CacheBehaviors``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-distributionconfig.html#cfn-cloudfront-distribution-distributionconfig-cachebehaviors </remarks>
        [JsiiProperty("cacheBehaviors", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-cloudfront.cloudformation.DistributionResource.CacheBehaviorProperty\"}]}}}}]},\"optional\":true}")]
        object CacheBehaviors
        {
            get;
            set;
        }

        /// <summary>``DistributionResource.DistributionConfigProperty.Comment``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-distributionconfig.html#cfn-cloudfront-distribution-distributionconfig-comment </remarks>
        [JsiiProperty("comment", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object Comment
        {
            get;
            set;
        }

        /// <summary>``DistributionResource.DistributionConfigProperty.CustomErrorResponses``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-distributionconfig.html#cfn-cloudfront-distribution-distributionconfig-customerrorresponses </remarks>
        [JsiiProperty("customErrorResponses", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/aws-cloudfront.cloudformation.DistributionResource.CustomErrorResponseProperty\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}}}]},\"optional\":true}")]
        object CustomErrorResponses
        {
            get;
            set;
        }

        /// <summary>``DistributionResource.DistributionConfigProperty.DefaultCacheBehavior``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-distributionconfig.html#cfn-cloudfront-distribution-distributionconfig-defaultcachebehavior </remarks>
        [JsiiProperty("defaultCacheBehavior", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-cloudfront.cloudformation.DistributionResource.DefaultCacheBehaviorProperty\"}]},\"optional\":true}")]
        object DefaultCacheBehavior
        {
            get;
            set;
        }

        /// <summary>``DistributionResource.DistributionConfigProperty.DefaultRootObject``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-distributionconfig.html#cfn-cloudfront-distribution-distributionconfig-defaultrootobject </remarks>
        [JsiiProperty("defaultRootObject", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object DefaultRootObject
        {
            get;
            set;
        }

        /// <summary>``DistributionResource.DistributionConfigProperty.Enabled``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-distributionconfig.html#cfn-cloudfront-distribution-distributionconfig-enabled </remarks>
        [JsiiProperty("enabled", "{\"union\":{\"types\":[{\"primitive\":\"boolean\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object Enabled
        {
            get;
            set;
        }

        /// <summary>``DistributionResource.DistributionConfigProperty.HttpVersion``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-distributionconfig.html#cfn-cloudfront-distribution-distributionconfig-httpversion </remarks>
        [JsiiProperty("httpVersion", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object HttpVersion
        {
            get;
            set;
        }

        /// <summary>``DistributionResource.DistributionConfigProperty.IPV6Enabled``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-distributionconfig.html#cfn-cloudfront-distribution-distributionconfig-ipv6enabled </remarks>
        [JsiiProperty("ipv6Enabled", "{\"union\":{\"types\":[{\"primitive\":\"boolean\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object Ipv6Enabled
        {
            get;
            set;
        }

        /// <summary>``DistributionResource.DistributionConfigProperty.Logging``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-distributionconfig.html#cfn-cloudfront-distribution-distributionconfig-logging </remarks>
        [JsiiProperty("logging", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-cloudfront.cloudformation.DistributionResource.LoggingProperty\"}]},\"optional\":true}")]
        object Logging
        {
            get;
            set;
        }

        /// <summary>``DistributionResource.DistributionConfigProperty.Origins``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-distributionconfig.html#cfn-cloudfront-distribution-distributionconfig-origins </remarks>
        [JsiiProperty("origins", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-cloudfront.cloudformation.DistributionResource.OriginProperty\"}]}}}}]},\"optional\":true}")]
        object Origins
        {
            get;
            set;
        }

        /// <summary>``DistributionResource.DistributionConfigProperty.PriceClass``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-distributionconfig.html#cfn-cloudfront-distribution-distributionconfig-priceclass </remarks>
        [JsiiProperty("priceClass", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object PriceClass
        {
            get;
            set;
        }

        /// <summary>``DistributionResource.DistributionConfigProperty.Restrictions``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-distributionconfig.html#cfn-cloudfront-distribution-distributionconfig-restrictions </remarks>
        [JsiiProperty("restrictions", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-cloudfront.cloudformation.DistributionResource.RestrictionsProperty\"}]},\"optional\":true}")]
        object Restrictions
        {
            get;
            set;
        }

        /// <summary>``DistributionResource.DistributionConfigProperty.ViewerCertificate``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-distributionconfig.html#cfn-cloudfront-distribution-distributionconfig-viewercertificate </remarks>
        [JsiiProperty("viewerCertificate", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-cloudfront.cloudformation.DistributionResource.ViewerCertificateProperty\"}]},\"optional\":true}")]
        object ViewerCertificate
        {
            get;
            set;
        }

        /// <summary>``DistributionResource.DistributionConfigProperty.WebACLId``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-distributionconfig.html#cfn-cloudfront-distribution-distributionconfig-webaclid </remarks>
        [JsiiProperty("webAclId", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object WebAclId
        {
            get;
            set;
        }
    }
}