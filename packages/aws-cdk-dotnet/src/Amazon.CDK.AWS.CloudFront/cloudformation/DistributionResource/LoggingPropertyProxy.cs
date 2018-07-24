using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CloudFront.cloudformation.DistributionResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-logging.html </remarks>
    [JsiiInterfaceProxy(typeof(ILoggingProperty), "@aws-cdk/aws-cloudfront.cloudformation.DistributionResource.LoggingProperty")]
    internal class LoggingPropertyProxy : DeputyBase, Amazon.CDK.AWS.CloudFront.cloudformation.DistributionResource.ILoggingProperty
    {
        private LoggingPropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``DistributionResource.LoggingProperty.Bucket``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-logging.html#cfn-cloudfront-distribution-logging-bucket </remarks>
        [JsiiProperty("bucket", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object Bucket
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``DistributionResource.LoggingProperty.IncludeCookies``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-logging.html#cfn-cloudfront-distribution-logging-includecookies </remarks>
        [JsiiProperty("includeCookies", "{\"union\":{\"types\":[{\"primitive\":\"boolean\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object IncludeCookies
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``DistributionResource.LoggingProperty.Prefix``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-logging.html#cfn-cloudfront-distribution-logging-prefix </remarks>
        [JsiiProperty("prefix", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object Prefix
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}