using Amazon.CDK.AWS.CloudFront.cloudformation.DistributionResource;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CloudFront
{
    /// <summary>A CloudFront behavior wrapper.</summary>
    public class Behavior : DeputyBase, IBehavior
    {
        /// <summary>If CloudFront should automatically compress some content types.</summary>
        /// <remarks>default: true</remarks>
        [JsiiProperty("compress", "{\"primitive\":\"boolean\",\"optional\":true}", true)]
        public bool? Compress
        {
            get;
            set;
        }

        /// <summary>
        /// If this behavior is the default behavior for the distribution.
        /// 
        /// You must specify exactly one default distribution per CloudFront distribution.
        /// The default behavior is allowed to omit the "path" property.
        /// </summary>
        [JsiiProperty("isDefaultBehavior", "{\"primitive\":\"boolean\",\"optional\":true}", true)]
        public bool? IsDefaultBehavior
        {
            get;
            set;
        }

        /// <summary>
        /// Trusted signers is how CloudFront allows you to serve private content.
        /// The signers are the account IDs that are allowed to sign cookies/presigned URLs for this distribution.
        /// 
        /// If you pass a non empty value, all requests for this behavior must be signed (no public access will be allowed)
        /// </summary>
        [JsiiProperty("trustedSigners", "{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"primitive\":\"string\"}},\"optional\":true}", true)]
        public string[] TrustedSigners
        {
            get;
            set;
        }

        /// <summary>
        /// The default amount of time CloudFront will cache an object.
        /// 
        /// This value applies only when your custom origin does not add HTTP headers,
        /// such as Cache-Control max-age, Cache-Control s-maxage, and Expires to objects.
        /// </summary>
        /// <remarks>default: 86400 (1 day)</remarks>
        [JsiiProperty("defaultTtlSeconds", "{\"primitive\":\"number\",\"optional\":true}", true)]
        public double? DefaultTtlSeconds
        {
            get;
            set;
        }

        /// <summary>The method this CloudFront distribution responds do.</summary>
        /// <remarks>default: GET_HEAD</remarks>
        [JsiiProperty("allowedMethods", "{\"fqn\":\"@aws-cdk/aws-cloudfront.CloudFrontAllowedMethods\",\"optional\":true}", true)]
        public CloudFrontAllowedMethods AllowedMethods
        {
            get;
            set;
        }

        /// <summary>
        /// The path this behavior responds to.
        /// Required for all non-default behaviors. (The default behavior implicitly has "*" as the path pattern. )
        /// </summary>
        [JsiiProperty("pathPattern", "{\"primitive\":\"string\",\"optional\":true}", true)]
        public string PathPattern
        {
            get;
            set;
        }

        /// <summary>Which methods are cached by CloudFront by default.</summary>
        /// <remarks>default: GET_HEAD</remarks>
        [JsiiProperty("cachedMethods", "{\"fqn\":\"@aws-cdk/aws-cloudfront.CloudFrontAllowedCachedMethods\",\"optional\":true}", true)]
        public CloudFrontAllowedCachedMethods CachedMethods
        {
            get;
            set;
        }

        /// <summary>The values CloudFront will forward to the origin when making a request.</summary>
        /// <remarks>default: none (no cookies - no headers)</remarks>
        [JsiiProperty("forwardedValues", "{\"fqn\":\"@aws-cdk/aws-cloudfront.cloudformation.DistributionResource.ForwardedValuesProperty\",\"optional\":true}", true)]
        public IForwardedValuesProperty ForwardedValues
        {
            get;
            set;
        }

        /// <summary>
        /// The minimum amount of time that you want objects to stay in the cache
        /// before CloudFront queries your origin.
        /// </summary>
        [JsiiProperty("minTtlSeconds", "{\"primitive\":\"number\",\"optional\":true}", true)]
        public double? MinTtlSeconds
        {
            get;
            set;
        }

        /// <summary>
        /// The max amount of time you want objects to stay in the cache
        /// before CloudFront queries your origin.
        /// </summary>
        /// <remarks>default: 31536000 (one year)</remarks>
        [JsiiProperty("maxTtlSeconds", "{\"primitive\":\"number\",\"optional\":true}", true)]
        public double? MaxTtlSeconds
        {
            get;
            set;
        }
    }
}