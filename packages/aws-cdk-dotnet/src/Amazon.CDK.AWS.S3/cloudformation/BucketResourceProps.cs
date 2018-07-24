using Amazon.CDK;
using Amazon.CDK.AWS.S3.cloudformation.BucketResource;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.S3.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket.html </remarks>
    public class BucketResourceProps : DeputyBase, IBucketResourceProps
    {
        /// <summary>``AWS::S3::Bucket.AccelerateConfiguration``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket.html#cfn-s3-bucket-accelerateconfiguration </remarks>
        [JsiiProperty("accelerateConfiguration", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-s3.cloudformation.BucketResource.AccelerateConfigurationProperty\"}]},\"optional\":true}", true)]
        public object AccelerateConfiguration
        {
            get;
            set;
        }

        /// <summary>``AWS::S3::Bucket.AccessControl``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket.html#cfn-s3-bucket-accesscontrol </remarks>
        [JsiiProperty("accessControl", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object AccessControl
        {
            get;
            set;
        }

        /// <summary>``AWS::S3::Bucket.AnalyticsConfigurations``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket.html#cfn-s3-bucket-analyticsconfigurations </remarks>
        [JsiiProperty("analyticsConfigurations", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-s3.cloudformation.BucketResource.AnalyticsConfigurationProperty\"}]}}}}]},\"optional\":true}", true)]
        public object AnalyticsConfigurations
        {
            get;
            set;
        }

        /// <summary>``AWS::S3::Bucket.BucketEncryption``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket.html#cfn-s3-bucket-bucketencryption </remarks>
        [JsiiProperty("bucketEncryption", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-s3.cloudformation.BucketResource.BucketEncryptionProperty\"}]},\"optional\":true}", true)]
        public object BucketEncryption
        {
            get;
            set;
        }

        /// <summary>``AWS::S3::Bucket.BucketName``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket.html#cfn-s3-bucket-name </remarks>
        [JsiiProperty("bucketName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object BucketName
        {
            get;
            set;
        }

        /// <summary>``AWS::S3::Bucket.CorsConfiguration``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket.html#cfn-s3-bucket-crossoriginconfig </remarks>
        [JsiiProperty("corsConfiguration", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-s3.cloudformation.BucketResource.CorsConfigurationProperty\"}]},\"optional\":true}", true)]
        public object CorsConfiguration
        {
            get;
            set;
        }

        /// <summary>``AWS::S3::Bucket.InventoryConfigurations``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket.html#cfn-s3-bucket-inventoryconfigurations </remarks>
        [JsiiProperty("inventoryConfigurations", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-s3.cloudformation.BucketResource.InventoryConfigurationProperty\"}]}}}}]},\"optional\":true}", true)]
        public object InventoryConfigurations
        {
            get;
            set;
        }

        /// <summary>``AWS::S3::Bucket.LifecycleConfiguration``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket.html#cfn-s3-bucket-lifecycleconfig </remarks>
        [JsiiProperty("lifecycleConfiguration", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-s3.cloudformation.BucketResource.LifecycleConfigurationProperty\"}]},\"optional\":true}", true)]
        public object LifecycleConfiguration
        {
            get;
            set;
        }

        /// <summary>``AWS::S3::Bucket.LoggingConfiguration``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket.html#cfn-s3-bucket-loggingconfig </remarks>
        [JsiiProperty("loggingConfiguration", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-s3.cloudformation.BucketResource.LoggingConfigurationProperty\"}]},\"optional\":true}", true)]
        public object LoggingConfiguration
        {
            get;
            set;
        }

        /// <summary>``AWS::S3::Bucket.MetricsConfigurations``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket.html#cfn-s3-bucket-metricsconfigurations </remarks>
        [JsiiProperty("metricsConfigurations", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-s3.cloudformation.BucketResource.MetricsConfigurationProperty\"}]}}}}]},\"optional\":true}", true)]
        public object MetricsConfigurations
        {
            get;
            set;
        }

        /// <summary>``AWS::S3::Bucket.NotificationConfiguration``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket.html#cfn-s3-bucket-notification </remarks>
        [JsiiProperty("notificationConfiguration", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-s3.cloudformation.BucketResource.NotificationConfigurationProperty\"}]},\"optional\":true}", true)]
        public object NotificationConfiguration
        {
            get;
            set;
        }

        /// <summary>``AWS::S3::Bucket.ReplicationConfiguration``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket.html#cfn-s3-bucket-replicationconfiguration </remarks>
        [JsiiProperty("replicationConfiguration", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-s3.cloudformation.BucketResource.ReplicationConfigurationProperty\"}]},\"optional\":true}", true)]
        public object ReplicationConfiguration
        {
            get;
            set;
        }

        /// <summary>``AWS::S3::Bucket.Tags``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket.html#cfn-s3-bucket-tags </remarks>
        [JsiiProperty("tags", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/cdk.Tag\"}]}}}}]},\"optional\":true}", true)]
        public object Tags
        {
            get;
            set;
        }

        /// <summary>``AWS::S3::Bucket.VersioningConfiguration``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket.html#cfn-s3-bucket-versioning </remarks>
        [JsiiProperty("versioningConfiguration", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-s3.cloudformation.BucketResource.VersioningConfigurationProperty\"}]},\"optional\":true}", true)]
        public object VersioningConfiguration
        {
            get;
            set;
        }

        /// <summary>``AWS::S3::Bucket.WebsiteConfiguration``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket.html#cfn-s3-bucket-websiteconfiguration </remarks>
        [JsiiProperty("websiteConfiguration", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-s3.cloudformation.BucketResource.WebsiteConfigurationProperty\"}]},\"optional\":true}", true)]
        public object WebsiteConfiguration
        {
            get;
            set;
        }
    }
}