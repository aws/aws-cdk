using Amazon.CDK.AWS.CloudFront.cloudformation.DistributionResource;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CloudFront
{
    public class CloudFrontWebDistributionProps : DeputyBase, ICloudFrontWebDistributionProps
    {
        /// <summary>AliasConfiguration is used to configured CloudFront to respond to requests on custom domain names.</summary>
        /// <remarks>default: none</remarks>
        [JsiiProperty("aliasConfiguration", "{\"fqn\":\"@aws-cdk/aws-cloudfront.AliasConfiguration\",\"optional\":true}", true)]
        public IAliasConfiguration AliasConfiguration
        {
            get;
            set;
        }

        /// <summary>A comment for this distribution in the cloud front console.</summary>
        [JsiiProperty("comment", "{\"primitive\":\"string\",\"optional\":true}", true)]
        public string Comment
        {
            get;
            set;
        }

        /// <summary>The default object to serve.</summary>
        /// <remarks>default: "index.html"</remarks>
        [JsiiProperty("defaultRootObject", "{\"primitive\":\"string\",\"optional\":true}", true)]
        public string DefaultRootObject
        {
            get;
            set;
        }

        /// <summary>If your distribution should have IPv6 enabled.</summary>
        /// <remarks>default: true</remarks>
        [JsiiProperty("enableIpV6", "{\"primitive\":\"boolean\",\"optional\":true}", true)]
        public bool? EnableIpV6
        {
            get;
            set;
        }

        /// <summary>The max supported HTTP Versions.</summary>
        /// <remarks>default: HttpVersion.HTTP2</remarks>
        [JsiiProperty("httpVersion", "{\"fqn\":\"@aws-cdk/aws-cloudfront.HttpVersion\",\"optional\":true}", true)]
        public HttpVersion HttpVersion
        {
            get;
            set;
        }

        /// <summary>The price class for the distribution (this impacts how many locations CloudFront uses for your distribution, and billing)</summary>
        /// <remarks>default: PriceClass_100: the cheapest option for CloudFront is picked by default.</remarks>
        [JsiiProperty("priceClass", "{\"fqn\":\"@aws-cdk/aws-cloudfront.PriceClass\",\"optional\":true}", true)]
        public PriceClass PriceClass
        {
            get;
            set;
        }

        /// <summary>The default viewer policy for incoming clients.</summary>
        /// <remarks>default: RedirectToHTTPs</remarks>
        [JsiiProperty("viewerProtocolPolicy", "{\"fqn\":\"@aws-cdk/aws-cloudfront.ViewerProtocolPolicy\",\"optional\":true}", true)]
        public ViewerProtocolPolicy ViewerProtocolPolicy
        {
            get;
            set;
        }

        /// <summary>The origin configurations for this distribution. Behaviors are a part of the origin.</summary>
        [JsiiProperty("originConfigs", "{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"fqn\":\"@aws-cdk/aws-cloudfront.SourceConfiguration\"}}}", true)]
        public ISourceConfiguration[] OriginConfigs
        {
            get;
            set;
        }

        /// <summary>
        /// Optional - if we should enable logging.
        /// You can pass an empty object ({}) to have us auto create a bucket for logging.
        /// Omission of this property indicates no logging is to be enabled.
        /// </summary>
        /// <remarks>default: : no logging is enabled by default.</remarks>
        [JsiiProperty("loggingConfig", "{\"fqn\":\"@aws-cdk/aws-cloudfront.LoggingConfiguration\",\"optional\":true}", true)]
        public ILoggingConfiguration LoggingConfig
        {
            get;
            set;
        }

        /// <summary>How CloudFront should handle requests that are no successful (eg PageNotFound)</summary>
        [JsiiProperty("errorConfigurations", "{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"fqn\":\"@aws-cdk/aws-cloudfront.cloudformation.DistributionResource.CustomErrorResponseProperty\"}},\"optional\":true}", true)]
        public ICustomErrorResponseProperty[] ErrorConfigurations
        {
            get;
            set;
        }
    }
}