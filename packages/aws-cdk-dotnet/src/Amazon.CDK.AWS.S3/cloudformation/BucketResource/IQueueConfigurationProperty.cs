using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.S3.cloudformation.BucketResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-notificationconfig-queueconfig.html </remarks>
    [JsiiInterface(typeof(IQueueConfigurationProperty), "@aws-cdk/aws-s3.cloudformation.BucketResource.QueueConfigurationProperty")]
    public interface IQueueConfigurationProperty
    {
        /// <summary>``BucketResource.QueueConfigurationProperty.Event``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-notificationconfig-queueconfig.html#cfn-s3-bucket-notificationconfig-queueconfig-event </remarks>
        [JsiiProperty("event", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object Event
        {
            get;
            set;
        }

        /// <summary>``BucketResource.QueueConfigurationProperty.Filter``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-notificationconfig-queueconfig.html#cfn-s3-bucket-notificationconfig-queueconfig-filter </remarks>
        [JsiiProperty("filter", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-s3.cloudformation.BucketResource.NotificationFilterProperty\"}]},\"optional\":true}")]
        object Filter
        {
            get;
            set;
        }

        /// <summary>``BucketResource.QueueConfigurationProperty.Queue``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-notificationconfig-queueconfig.html#cfn-s3-bucket-notificationconfig-queueconfig-queue </remarks>
        [JsiiProperty("queue", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object Queue
        {
            get;
            set;
        }
    }
}