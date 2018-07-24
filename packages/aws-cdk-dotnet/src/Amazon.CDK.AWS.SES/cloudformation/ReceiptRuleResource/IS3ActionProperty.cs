using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.SES.cloudformation.ReceiptRuleResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ses-receiptrule-s3action.html </remarks>
    [JsiiInterface(typeof(IS3ActionProperty), "@aws-cdk/aws-ses.cloudformation.ReceiptRuleResource.S3ActionProperty")]
    public interface IS3ActionProperty
    {
        /// <summary>``ReceiptRuleResource.S3ActionProperty.BucketName``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ses-receiptrule-s3action.html#cfn-ses-receiptrule-s3action-bucketname </remarks>
        [JsiiProperty("bucketName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object BucketName
        {
            get;
            set;
        }

        /// <summary>``ReceiptRuleResource.S3ActionProperty.KmsKeyArn``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ses-receiptrule-s3action.html#cfn-ses-receiptrule-s3action-kmskeyarn </remarks>
        [JsiiProperty("kmsKeyArn", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object KmsKeyArn
        {
            get;
            set;
        }

        /// <summary>``ReceiptRuleResource.S3ActionProperty.ObjectKeyPrefix``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ses-receiptrule-s3action.html#cfn-ses-receiptrule-s3action-objectkeyprefix </remarks>
        [JsiiProperty("objectKeyPrefix", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object ObjectKeyPrefix
        {
            get;
            set;
        }

        /// <summary>``ReceiptRuleResource.S3ActionProperty.TopicArn``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ses-receiptrule-s3action.html#cfn-ses-receiptrule-s3action-topicarn </remarks>
        [JsiiProperty("topicArn", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object TopicArn
        {
            get;
            set;
        }
    }
}