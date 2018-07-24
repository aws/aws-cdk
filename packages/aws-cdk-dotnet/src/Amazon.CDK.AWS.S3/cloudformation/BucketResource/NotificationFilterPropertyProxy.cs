using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.S3.cloudformation.BucketResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-notificationconfiguration-config-filter.html </remarks>
    [JsiiInterfaceProxy(typeof(INotificationFilterProperty), "@aws-cdk/aws-s3.cloudformation.BucketResource.NotificationFilterProperty")]
    internal class NotificationFilterPropertyProxy : DeputyBase, INotificationFilterProperty
    {
        private NotificationFilterPropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``BucketResource.NotificationFilterProperty.S3Key``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-notificationconfiguration-config-filter.html#cfn-s3-bucket-notificationconfiguraiton-config-filter-s3key </remarks>
        [JsiiProperty("s3Key", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-s3.cloudformation.BucketResource.S3KeyFilterProperty\"}]}}")]
        public virtual object S3Key
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}