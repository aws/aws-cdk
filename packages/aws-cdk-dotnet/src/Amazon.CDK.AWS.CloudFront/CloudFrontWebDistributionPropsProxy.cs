using Amazon.CDK.AWS.CloudFront.cloudformation.DistributionResource;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CloudFront
{
    [JsiiInterfaceProxy(typeof(ICloudFrontWebDistributionProps), "@aws-cdk/aws-cloudfront.CloudFrontWebDistributionProps")]
    internal class CloudFrontWebDistributionPropsProxy : DeputyBase, ICloudFrontWebDistributionProps
    {
        private CloudFrontWebDistributionPropsProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>AliasConfiguration is used to configured CloudFront to respond to requests on custom domain names.</summary>
        /// <remarks>default: none</remarks>
        [JsiiProperty("aliasConfiguration", "{\"fqn\":\"@aws-cdk/aws-cloudfront.AliasConfiguration\",\"optional\":true}")]
        public virtual IAliasConfiguration AliasConfiguration
        {
            get => GetInstanceProperty<IAliasConfiguration>();
            set => SetInstanceProperty(value);
        }

        /// <summary>A comment for this distribution in the cloud front console.</summary>
        [JsiiProperty("comment", "{\"primitive\":\"string\",\"optional\":true}")]
        public virtual string Comment
        {
            get => GetInstanceProperty<string>();
            set => SetInstanceProperty(value);
        }

        /// <summary>The default object to serve.</summary>
        /// <remarks>default: "index.html"</remarks>
        [JsiiProperty("defaultRootObject", "{\"primitive\":\"string\",\"optional\":true}")]
        public virtual string DefaultRootObject
        {
            get => GetInstanceProperty<string>();
            set => SetInstanceProperty(value);
        }

        /// <summary>If your distribution should have IPv6 enabled.</summary>
        /// <remarks>default: true</remarks>
        [JsiiProperty("enableIpV6", "{\"primitive\":\"boolean\",\"optional\":true}")]
        public virtual bool? EnableIpV6
        {
            get => GetInstanceProperty<bool? >();
            set => SetInstanceProperty(value);
        }

        /// <summary>The max supported HTTP Versions.</summary>
        /// <remarks>default: HttpVersion.HTTP2</remarks>
        [JsiiProperty("httpVersion", "{\"fqn\":\"@aws-cdk/aws-cloudfront.HttpVersion\",\"optional\":true}")]
        public virtual HttpVersion HttpVersion
        {
            get => GetInstanceProperty<HttpVersion>();
            set => SetInstanceProperty(value);
        }

        /// <summary>The price class for the distribution (this impacts how many locations CloudFront uses for your distribution, and billing)</summary>
        /// <remarks>default: PriceClass_100: the cheapest option for CloudFront is picked by default.</remarks>
        [JsiiProperty("priceClass", "{\"fqn\":\"@aws-cdk/aws-cloudfront.PriceClass\",\"optional\":true}")]
        public virtual PriceClass PriceClass
        {
            get => GetInstanceProperty<PriceClass>();
            set => SetInstanceProperty(value);
        }

        /// <summary>The default viewer policy for incoming clients.</summary>
        /// <remarks>default: RedirectToHTTPs</remarks>
        [JsiiProperty("viewerProtocolPolicy", "{\"fqn\":\"@aws-cdk/aws-cloudfront.ViewerProtocolPolicy\",\"optional\":true}")]
        public virtual ViewerProtocolPolicy ViewerProtocolPolicy
        {
            get => GetInstanceProperty<ViewerProtocolPolicy>();
            set => SetInstanceProperty(value);
        }

        /// <summary>The origin configurations for this distribution. Behaviors are a part of the origin.</summary>
        [JsiiProperty("originConfigs", "{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"fqn\":\"@aws-cdk/aws-cloudfront.SourceConfiguration\"}}}")]
        public virtual ISourceConfiguration[] OriginConfigs
        {
            get => GetInstanceProperty<ISourceConfiguration[]>();
            set => SetInstanceProperty(value);
        }

        /// <summary>
        /// Optional - if we should enable logging.
        /// You can pass an empty object ({}) to have us auto create a bucket for logging.
        /// Omission of this property indicates no logging is to be enabled.
        /// </summary>
        /// <remarks>default: : no logging is enabled by default.</remarks>
        [JsiiProperty("loggingConfig", "{\"fqn\":\"@aws-cdk/aws-cloudfront.LoggingConfiguration\",\"optional\":true}")]
        public virtual ILoggingConfiguration LoggingConfig
        {
            get => GetInstanceProperty<ILoggingConfiguration>();
            set => SetInstanceProperty(value);
        }

        /// <summary>How CloudFront should handle requests that are no successful (eg PageNotFound)</summary>
        [JsiiProperty("errorConfigurations", "{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"fqn\":\"@aws-cdk/aws-cloudfront.cloudformation.DistributionResource.CustomErrorResponseProperty\"}},\"optional\":true}")]
        public virtual ICustomErrorResponseProperty[] ErrorConfigurations
        {
            get => GetInstanceProperty<ICustomErrorResponseProperty[]>();
            set => SetInstanceProperty(value);
        }
    }
}