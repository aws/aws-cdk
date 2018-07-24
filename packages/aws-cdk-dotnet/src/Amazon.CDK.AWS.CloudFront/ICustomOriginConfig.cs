using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CloudFront
{
    /// <summary>A custom origin configuration</summary>
    [JsiiInterface(typeof(ICustomOriginConfig), "@aws-cdk/aws-cloudfront.CustomOriginConfig")]
    public interface ICustomOriginConfig
    {
        /// <summary>The domain name of the custom origin. Should not include the path - that should be in the parent SourceConfiguration</summary>
        [JsiiProperty("domainName", "{\"primitive\":\"string\"}")]
        string DomainName
        {
            get;
        }

        /// <summary>The origin HTTP port</summary>
        /// <remarks>default: 80</remarks>
        [JsiiProperty("httpPort", "{\"primitive\":\"number\",\"optional\":true}")]
        double? HttpPort
        {
            get;
        }

        /// <summary>The origin HTTPS port</summary>
        /// <remarks>default: 443</remarks>
        [JsiiProperty("httpsPort", "{\"primitive\":\"number\",\"optional\":true}")]
        double? HttpsPort
        {
            get;
        }

        /// <summary>The keep alive timeout when making calls in seconds.</summary>
        /// <remarks>default: : 5 seconds</remarks>
        [JsiiProperty("originKeepaliveTimeoutSeconds", "{\"primitive\":\"number\",\"optional\":true}")]
        double? OriginKeepaliveTimeoutSeconds
        {
            get;
        }

        /// <summary>The protocol (http or https) policy to use when interacting with the origin.</summary>
        /// <remarks>default: : HttpsOnly</remarks>
        [JsiiProperty("originProtocolPolicy", "{\"fqn\":\"@aws-cdk/aws-cloudfront.OriginProtocolPolicy\",\"optional\":true}")]
        OriginProtocolPolicy OriginProtocolPolicy
        {
            get;
        }

        /// <summary>The read timeout when calling the origin in seconds</summary>
        /// <remarks>default: 30 seconds</remarks>
        [JsiiProperty("originReadTimeoutSeconds", "{\"primitive\":\"number\",\"optional\":true}")]
        double? OriginReadTimeoutSeconds
        {
            get;
        }

        /// <summary>The SSL versions to use when interacting with the origin.</summary>
        /// <remarks>default: [TLSv1_2]</remarks>
        [JsiiProperty("allowedOriginSSLVersions", "{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"fqn\":\"@aws-cdk/aws-cloudfront.OriginSslPolicy\"}},\"optional\":true}")]
        OriginSslPolicy[] AllowedOriginSSLVersions
        {
            get;
        }
    }
}