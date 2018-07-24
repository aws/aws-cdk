using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.S3.cloudformation.BucketResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-loggingconfig.html </remarks>
    [JsiiInterface(typeof(ILoggingConfigurationProperty), "@aws-cdk/aws-s3.cloudformation.BucketResource.LoggingConfigurationProperty")]
    public interface ILoggingConfigurationProperty
    {
        /// <summary>``BucketResource.LoggingConfigurationProperty.DestinationBucketName``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-loggingconfig.html#cfn-s3-bucket-loggingconfig-destinationbucketname </remarks>
        [JsiiProperty("destinationBucketName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object DestinationBucketName
        {
            get;
            set;
        }

        /// <summary>``BucketResource.LoggingConfigurationProperty.LogFilePrefix``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-loggingconfig.html#cfn-s3-bucket-loggingconfig-logfileprefix </remarks>
        [JsiiProperty("logFilePrefix", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object LogFilePrefix
        {
            get;
            set;
        }
    }
}