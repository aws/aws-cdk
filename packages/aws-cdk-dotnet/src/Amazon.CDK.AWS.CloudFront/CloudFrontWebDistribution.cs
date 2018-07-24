using Amazon.CDK;
using Amazon.CDK.AWS.S3;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CloudFront
{
    /// <summary>
    /// Amazon CloudFront is a global content delivery network (CDN) service that securely delivers data, videos,
    /// applications, and APIs to your viewers with low latency and high transfer speeds.
    /// CloudFront fronts user provided content and caches it at edge locations across the world.
    /// 
    /// Here's how you can use this construct:
    /// 
    /// ```ts
    ///  * import { CloudFront } from '@aws-cdk/aws-cloudfront'
    ///  *
    ///  * const sourceBucket = new Bucket(this, 'Bucket');
    ///  *
    ///  * const distribution = new CloudFrontDistribution(this, 'MyDistribution', {
    ///  *  originConfigs: [
    ///  *      {
    ///  *          s3OriginSource: {
    ///  *            s3BucketSource: sourceBucket
    ///  *          },
    ///  *          behaviors : [ {isDefaultBehavior}]
    ///  *      }
    ///  *  ]
    ///  * });
    ///  * ```
    /// 
    /// This will create a CloudFront distribution that uses your S3Bucket as it's origin.
    /// 
    /// You can customize the distribution using additional properties from the CloudFrontWebDistributionProps interface.
    /// </summary>
    [JsiiClass(typeof(CloudFrontWebDistribution), "@aws-cdk/aws-cloudfront.CloudFrontWebDistribution", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"props\",\"type\":{\"fqn\":\"@aws-cdk/aws-cloudfront.CloudFrontWebDistributionProps\"}}]")]
    public class CloudFrontWebDistribution : Construct
    {
        public CloudFrontWebDistribution(Construct parent, string name, ICloudFrontWebDistributionProps props): base(new DeputyProps(new object[]{parent, name, props}))
        {
        }

        protected CloudFrontWebDistribution(ByRefValue reference): base(reference)
        {
        }

        protected CloudFrontWebDistribution(DeputyProps props): base(props)
        {
        }

        /// <summary>
        /// The hosted zone Id if using an alias record in Route53.
        /// This value never changes.
        /// </summary>
        [JsiiProperty("aliasHostedZoneId", "{\"primitive\":\"string\"}")]
        public virtual string AliasHostedZoneId
        {
            get => GetInstanceProperty<string>();
        }

        /// <summary>
        /// The logging bucket for this CloudFront distribution.
        /// If logging is not enabled for this distribution - this property will be undefined.
        /// </summary>
        [JsiiProperty("loggingBucket", "{\"fqn\":\"@aws-cdk/aws-s3.BucketRef\",\"optional\":true}")]
        public virtual BucketRef LoggingBucket
        {
            get => GetInstanceProperty<BucketRef>();
        }

        /// <summary>
        /// The domain name created by CloudFront for this distribution.
        /// If you are using aliases for your distribution, this is the domainName your DNS records should point to.
        /// (In Route53, you could create an ALIAS record to this value, for example. )
        /// </summary>
        [JsiiProperty("domainName", "{\"fqn\":\"@aws-cdk/aws-cloudfront.DistributionDomainName\"}")]
        public virtual DistributionDomainName DomainName
        {
            get => GetInstanceProperty<DistributionDomainName>();
        }
    }
}