using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.S3.cloudformation.BucketResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-notificationconfig.html </remarks>
    [JsiiInterface(typeof(INotificationConfigurationProperty), "@aws-cdk/aws-s3.cloudformation.BucketResource.NotificationConfigurationProperty")]
    public interface INotificationConfigurationProperty
    {
        /// <summary>``BucketResource.NotificationConfigurationProperty.LambdaConfigurations``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-notificationconfig.html#cfn-s3-bucket-notificationconfig-lambdaconfig </remarks>
        [JsiiProperty("lambdaConfigurations", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-s3.cloudformation.BucketResource.LambdaConfigurationProperty\"}]}}}}]},\"optional\":true}")]
        object LambdaConfigurations
        {
            get;
            set;
        }

        /// <summary>``BucketResource.NotificationConfigurationProperty.QueueConfigurations``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-notificationconfig.html#cfn-s3-bucket-notificationconfig-queueconfig </remarks>
        [JsiiProperty("queueConfigurations", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-s3.cloudformation.BucketResource.QueueConfigurationProperty\"}]}}}}]},\"optional\":true}")]
        object QueueConfigurations
        {
            get;
            set;
        }

        /// <summary>``BucketResource.NotificationConfigurationProperty.TopicConfigurations``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-notificationconfig.html#cfn-s3-bucket-notificationconfig-topicconfig </remarks>
        [JsiiProperty("topicConfigurations", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-s3.cloudformation.BucketResource.TopicConfigurationProperty\"}]}}}}]},\"optional\":true}")]
        object TopicConfigurations
        {
            get;
            set;
        }
    }
}