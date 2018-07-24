using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.S3.cloudformation.BucketResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-accelerateconfiguration.html </remarks>
    [JsiiInterface(typeof(IAccelerateConfigurationProperty), "@aws-cdk/aws-s3.cloudformation.BucketResource.AccelerateConfigurationProperty")]
    public interface IAccelerateConfigurationProperty
    {
        /// <summary>``BucketResource.AccelerateConfigurationProperty.AccelerationStatus``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-accelerateconfiguration.html#cfn-s3-bucket-accelerateconfiguration-accelerationstatus </remarks>
        [JsiiProperty("accelerationStatus", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object AccelerationStatus
        {
            get;
            set;
        }
    }
}