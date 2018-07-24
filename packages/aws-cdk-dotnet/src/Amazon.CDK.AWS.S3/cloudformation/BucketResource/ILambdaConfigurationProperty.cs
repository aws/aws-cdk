using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.S3.cloudformation.BucketResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-notificationconfig-lambdaconfig.html </remarks>
    [JsiiInterface(typeof(ILambdaConfigurationProperty), "@aws-cdk/aws-s3.cloudformation.BucketResource.LambdaConfigurationProperty")]
    public interface ILambdaConfigurationProperty
    {
        /// <summary>``BucketResource.LambdaConfigurationProperty.Event``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-notificationconfig-lambdaconfig.html#cfn-s3-bucket-notificationconfig-lambdaconfig-event </remarks>
        [JsiiProperty("event", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object Event
        {
            get;
            set;
        }

        /// <summary>``BucketResource.LambdaConfigurationProperty.Filter``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-notificationconfig-lambdaconfig.html#cfn-s3-bucket-notificationconfig-lambdaconfig-filter </remarks>
        [JsiiProperty("filter", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-s3.cloudformation.BucketResource.NotificationFilterProperty\"}]},\"optional\":true}")]
        object Filter
        {
            get;
            set;
        }

        /// <summary>``BucketResource.LambdaConfigurationProperty.Function``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-notificationconfig-lambdaconfig.html#cfn-s3-bucket-notificationconfig-lambdaconfig-function </remarks>
        [JsiiProperty("function", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object Function
        {
            get;
            set;
        }
    }
}