using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.SSM.cloudformation.AssociationResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-association-s3outputlocation.html </remarks>
    [JsiiInterface(typeof(IS3OutputLocationProperty), "@aws-cdk/aws-ssm.cloudformation.AssociationResource.S3OutputLocationProperty")]
    public interface IS3OutputLocationProperty
    {
        /// <summary>``AssociationResource.S3OutputLocationProperty.OutputS3BucketName``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-association-s3outputlocation.html#cfn-ssm-association-s3outputlocation-outputs3bucketname </remarks>
        [JsiiProperty("outputS3BucketName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object OutputS3BucketName
        {
            get;
            set;
        }

        /// <summary>``AssociationResource.S3OutputLocationProperty.OutputS3KeyPrefix``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-association-s3outputlocation.html#cfn-ssm-association-s3outputlocation-outputs3keyprefix </remarks>
        [JsiiProperty("outputS3KeyPrefix", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object OutputS3KeyPrefix
        {
            get;
            set;
        }
    }
}