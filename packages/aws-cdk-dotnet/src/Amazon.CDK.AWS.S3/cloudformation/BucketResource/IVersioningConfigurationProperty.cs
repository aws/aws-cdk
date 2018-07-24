using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.S3.cloudformation.BucketResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-versioningconfig.html </remarks>
    [JsiiInterface(typeof(IVersioningConfigurationProperty), "@aws-cdk/aws-s3.cloudformation.BucketResource.VersioningConfigurationProperty")]
    public interface IVersioningConfigurationProperty
    {
        /// <summary>``BucketResource.VersioningConfigurationProperty.Status``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-versioningconfig.html#cfn-s3-bucket-versioningconfig-status </remarks>
        [JsiiProperty("status", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object Status
        {
            get;
            set;
        }
    }
}