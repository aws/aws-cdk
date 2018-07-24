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
    public class LoggingConfiguration : DeputyBase, ILoggingConfiguration
    {
        [JsiiProperty("bucket", "{\"fqn\":\"@aws-cdk/aws-s3.BucketRef\",\"optional\":true}", true)]
        public BucketRef Bucket
        {
            get;
        }

        [JsiiProperty("includeCookies", "{\"primitive\":\"boolean\",\"optional\":true}", true)]
        public bool? IncludeCookies
        {
            get;
        }

        [JsiiProperty("prefix", "{\"primitive\":\"string\",\"optional\":true}", true)]
        public string Prefix
        {
            get;
        }
    }
}