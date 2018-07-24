using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.S3.cloudformation.BucketResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-encryptionconfiguration.html </remarks>
    [JsiiInterface(typeof(IEncryptionConfigurationProperty), "@aws-cdk/aws-s3.cloudformation.BucketResource.EncryptionConfigurationProperty")]
    public interface IEncryptionConfigurationProperty
    {
        /// <summary>``BucketResource.EncryptionConfigurationProperty.ReplicaKmsKeyID``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-encryptionconfiguration.html#cfn-s3-bucket-encryptionconfiguration-replicakmskeyid </remarks>
        [JsiiProperty("replicaKmsKeyId", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object ReplicaKmsKeyId
        {
            get;
            set;
        }
    }
}