using Amazon.CDK.AWS.S3;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CloudFront
{
    /// <summary>
    /// CloudFront supports logging of incoming requests and can log details to a given S3 Bucket.
    /// 
    /// If you wish to configure logging you can configure details about it.
    /// </summary>
    /// <remarks>default: prefix: no prefix is set by default.</remarks>
    [JsiiInterfaceProxy(typeof(ILoggingConfiguration), "@aws-cdk/aws-cloudfront.LoggingConfiguration")]
    internal class LoggingConfigurationProxy : DeputyBase, ILoggingConfiguration
    {
        private LoggingConfigurationProxy(ByRefValue reference): base(reference)
        {
        }

        [JsiiProperty("bucket", "{\"fqn\":\"@aws-cdk/aws-s3.BucketRef\",\"optional\":true}")]
        public virtual BucketRef Bucket
        {
            get => GetInstanceProperty<BucketRef>();
        }

        [JsiiProperty("includeCookies", "{\"primitive\":\"boolean\",\"optional\":true}")]
        public virtual bool? IncludeCookies
        {
            get => GetInstanceProperty<bool? >();
        }

        [JsiiProperty("prefix", "{\"primitive\":\"string\",\"optional\":true}")]
        public virtual string Prefix
        {
            get => GetInstanceProperty<string>();
        }
    }
}