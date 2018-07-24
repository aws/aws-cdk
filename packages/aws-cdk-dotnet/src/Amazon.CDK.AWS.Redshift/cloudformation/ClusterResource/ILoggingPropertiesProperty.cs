using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Redshift.cloudformation.ClusterResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-redshift-cluster-loggingproperties.html </remarks>
    [JsiiInterface(typeof(ILoggingPropertiesProperty), "@aws-cdk/aws-redshift.cloudformation.ClusterResource.LoggingPropertiesProperty")]
    public interface ILoggingPropertiesProperty
    {
        /// <summary>``ClusterResource.LoggingPropertiesProperty.BucketName``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-redshift-cluster-loggingproperties.html#cfn-redshift-cluster-loggingproperties-bucketname </remarks>
        [JsiiProperty("bucketName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object BucketName
        {
            get;
            set;
        }

        /// <summary>``ClusterResource.LoggingPropertiesProperty.S3KeyPrefix``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-redshift-cluster-loggingproperties.html#cfn-redshift-cluster-loggingproperties-s3keyprefix </remarks>
        [JsiiProperty("s3KeyPrefix", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object S3KeyPrefix
        {
            get;
            set;
        }
    }
}