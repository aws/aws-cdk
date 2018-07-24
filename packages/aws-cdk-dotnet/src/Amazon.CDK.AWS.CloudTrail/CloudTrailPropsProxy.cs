using Amazon.CDK.AWS.KMS;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CloudTrail
{
    [JsiiInterfaceProxy(typeof(ICloudTrailProps), "@aws-cdk/aws-cloudtrail.CloudTrailProps")]
    internal class CloudTrailPropsProxy : DeputyBase, ICloudTrailProps
    {
        private CloudTrailPropsProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>
        /// For most services, events are recorded in the region where the action occurred.
        /// For global services such as AWS Identity and Access Management (IAM), AWS STS, Amazon CloudFront, and Route 53,
        /// events are delivered to any trail that includes global services, and are logged as occurring in US East (N. Virginia) Region.
        /// </summary>
        /// <remarks>default: true</remarks>
        [JsiiProperty("includeGlobalServiceEvents", "{\"primitive\":\"boolean\",\"optional\":true}")]
        public virtual bool? IncludeGlobalServiceEvents
        {
            get => GetInstanceProperty<bool? >();
            set => SetInstanceProperty(value);
        }

        /// <summary>Whether or not this trail delivers log files from multiple regions to a single S3 bucket for a single account.</summary>
        /// <remarks>default: true</remarks>
        [JsiiProperty("isMultiRegionTrail", "{\"primitive\":\"boolean\",\"optional\":true}")]
        public virtual bool? IsMultiRegionTrail
        {
            get => GetInstanceProperty<bool? >();
            set => SetInstanceProperty(value);
        }

        /// <summary>
        /// When an event occurs in your account, CloudTrail evaluates whether the event matches the settings for your trails.
        /// Only events that match your trail settings are delivered to your Amazon S3 bucket and Amazon CloudWatch Logs log group.
        /// 
        /// This method sets the management configuration for this trail.
        /// 
        /// Management events provide insight into management operations that are performed on resources in your AWS account.
        /// These are also known as control plane operations.
        /// Management events can also include non-API events that occur in your account.
        /// For example, when a user logs in to your account, CloudTrail logs the ConsoleLogin event.
        /// 
        /// If managementEvents is undefined, we'll not log management events by default.
        /// </summary>
        [JsiiProperty("managementEvents", "{\"fqn\":\"@aws-cdk/aws-cloudtrail.ReadWriteType\",\"optional\":true}")]
        public virtual ReadWriteType ManagementEvents
        {
            get => GetInstanceProperty<ReadWriteType>();
            set => SetInstanceProperty(value);
        }

        /// <summary>
        /// To determine whether a log file was modified, deleted, or unchanged after CloudTrail delivered it,
        /// you can use CloudTrail log file integrity validation.
        /// This feature is built using industry standard algorithms: SHA-256 for hashing and SHA-256 with RSA for digital signing.
        /// This makes it computationally infeasible to modify, delete or forge CloudTrail log files without detection.
        /// You can use the AWS CLI to validate the files in the location where CloudTrail delivered them.
        /// </summary>
        /// <remarks>default: true</remarks>
        [JsiiProperty("enableFileValidation", "{\"primitive\":\"boolean\",\"optional\":true}")]
        public virtual bool? EnableFileValidation
        {
            get => GetInstanceProperty<bool? >();
            set => SetInstanceProperty(value);
        }

        /// <summary>
        /// If CloudTrail pushes logs to CloudWatch Logs in addition to S3.
        /// Disabled for cost out of the box.
        /// </summary>
        /// <remarks>default: false</remarks>
        [JsiiProperty("sendToCloudWatchLogs", "{\"primitive\":\"boolean\",\"optional\":true}")]
        public virtual bool? SendToCloudWatchLogs
        {
            get => GetInstanceProperty<bool? >();
            set => SetInstanceProperty(value);
        }

        /// <summary>
        /// How long to retain logs in CloudWatchLogs. Ignored if sendToCloudWatchLogs is false
        ///   
        /// </summary>
        /// <remarks>default: LogRetention.OneYear</remarks>
        [JsiiProperty("cloudWatchLogsRetentionTimeDays", "{\"fqn\":\"@aws-cdk/aws-cloudtrail.LogRetention\",\"optional\":true}")]
        public virtual LogRetention CloudWatchLogsRetentionTimeDays
        {
            get => GetInstanceProperty<LogRetention>();
            set => SetInstanceProperty(value);
        }

        /// <summary>The AWS Key Management Service (AWS KMS) key ID that you want to use to encrypt CloudTrail logs.</summary>
        /// <remarks>default: none</remarks>
        [JsiiProperty("kmsKey", "{\"fqn\":\"@aws-cdk/aws-kms.EncryptionKeyRef\",\"optional\":true}")]
        public virtual EncryptionKeyRef KmsKey
        {
            get => GetInstanceProperty<EncryptionKeyRef>();
            set => SetInstanceProperty(value);
        }

        /// <summary>The name of an Amazon SNS topic that is notified when new log files are published.</summary>
        /// <remarks>default: none</remarks>
        [JsiiProperty("snsTopic", "{\"primitive\":\"string\",\"optional\":true}")]
        public virtual string SnsTopic
        {
            get => GetInstanceProperty<string>();
            set => SetInstanceProperty(value);
        }

        /// <summary>The name of the trail. We recoomend customers do not set an explicit name.</summary>
        /// <remarks>default: the CloudFormation generated neme</remarks>
        [JsiiProperty("trailName", "{\"primitive\":\"string\",\"optional\":true}")]
        public virtual string TrailName
        {
            get => GetInstanceProperty<string>();
            set => SetInstanceProperty(value);
        }

        /// <summary>An Amazon S3 object key prefix that precedes the name of all log files.</summary>
        /// <remarks>default: none</remarks>
        [JsiiProperty("s3KeyPrefix", "{\"primitive\":\"string\",\"optional\":true}")]
        public virtual string S3KeyPrefix
        {
            get => GetInstanceProperty<string>();
            set => SetInstanceProperty(value);
        }
    }
}