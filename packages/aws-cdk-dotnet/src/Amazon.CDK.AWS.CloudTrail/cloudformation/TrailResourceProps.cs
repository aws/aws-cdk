using Amazon.CDK;
using Amazon.CDK.AWS.CloudTrail.cloudformation.TrailResource;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CloudTrail.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudtrail-trail.html </remarks>
    public class TrailResourceProps : DeputyBase, ITrailResourceProps
    {
        /// <summary>``AWS::CloudTrail::Trail.IsLogging``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudtrail-trail.html#cfn-cloudtrail-trail-islogging </remarks>
        [JsiiProperty("isLogging", "{\"union\":{\"types\":[{\"primitive\":\"boolean\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}", true)]
        public object IsLogging
        {
            get;
            set;
        }

        /// <summary>``AWS::CloudTrail::Trail.S3BucketName``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudtrail-trail.html#cfn-cloudtrail-trail-s3bucketname </remarks>
        [JsiiProperty("s3BucketName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}", true)]
        public object S3BucketName
        {
            get;
            set;
        }

        /// <summary>``AWS::CloudTrail::Trail.CloudWatchLogsLogGroupArn``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudtrail-trail.html#cfn-cloudtrail-trail-cloudwatchlogsloggrouparn </remarks>
        [JsiiProperty("cloudWatchLogsLogGroupArn", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object CloudWatchLogsLogGroupArn
        {
            get;
            set;
        }

        /// <summary>``AWS::CloudTrail::Trail.CloudWatchLogsRoleArn``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudtrail-trail.html#cfn-cloudtrail-trail-cloudwatchlogsrolearn </remarks>
        [JsiiProperty("cloudWatchLogsRoleArn", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object CloudWatchLogsRoleArn
        {
            get;
            set;
        }

        /// <summary>``AWS::CloudTrail::Trail.EnableLogFileValidation``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudtrail-trail.html#cfn-cloudtrail-trail-enablelogfilevalidation </remarks>
        [JsiiProperty("enableLogFileValidation", "{\"union\":{\"types\":[{\"primitive\":\"boolean\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object EnableLogFileValidation
        {
            get;
            set;
        }

        /// <summary>``AWS::CloudTrail::Trail.EventSelectors``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudtrail-trail.html#cfn-cloudtrail-trail-eventselectors </remarks>
        [JsiiProperty("eventSelectors", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-cloudtrail.cloudformation.TrailResource.EventSelectorProperty\"}]}}}}]},\"optional\":true}", true)]
        public object EventSelectors
        {
            get;
            set;
        }

        /// <summary>``AWS::CloudTrail::Trail.IncludeGlobalServiceEvents``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudtrail-trail.html#cfn-cloudtrail-trail-includeglobalserviceevents </remarks>
        [JsiiProperty("includeGlobalServiceEvents", "{\"union\":{\"types\":[{\"primitive\":\"boolean\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object IncludeGlobalServiceEvents
        {
            get;
            set;
        }

        /// <summary>``AWS::CloudTrail::Trail.IsMultiRegionTrail``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudtrail-trail.html#cfn-cloudtrail-trail-ismultiregiontrail </remarks>
        [JsiiProperty("isMultiRegionTrail", "{\"union\":{\"types\":[{\"primitive\":\"boolean\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object IsMultiRegionTrail
        {
            get;
            set;
        }

        /// <summary>``AWS::CloudTrail::Trail.KMSKeyId``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudtrail-trail.html#cfn-cloudtrail-trail-kmskeyid </remarks>
        [JsiiProperty("kmsKeyId", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object KmsKeyId
        {
            get;
            set;
        }

        /// <summary>``AWS::CloudTrail::Trail.S3KeyPrefix``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudtrail-trail.html#cfn-cloudtrail-trail-s3keyprefix </remarks>
        [JsiiProperty("s3KeyPrefix", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object S3KeyPrefix
        {
            get;
            set;
        }

        /// <summary>``AWS::CloudTrail::Trail.SnsTopicName``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudtrail-trail.html#cfn-cloudtrail-trail-snstopicname </remarks>
        [JsiiProperty("snsTopicName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object SnsTopicName
        {
            get;
            set;
        }

        /// <summary>``AWS::CloudTrail::Trail.Tags``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudtrail-trail.html#cfn-cloudtrail-trail-tags </remarks>
        [JsiiProperty("tags", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/cdk.Tag\"}]}}}}]},\"optional\":true}", true)]
        public object Tags
        {
            get;
            set;
        }

        /// <summary>``AWS::CloudTrail::Trail.TrailName``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudtrail-trail.html#cfn-cloudtrail-trail-trailname </remarks>
        [JsiiProperty("trailName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object TrailName
        {
            get;
            set;
        }
    }
}