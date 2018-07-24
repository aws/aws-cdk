using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.S3.cloudformation.BucketResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-serversideencryptionbydefault.html </remarks>
    public class ServerSideEncryptionByDefaultProperty : DeputyBase, IServerSideEncryptionByDefaultProperty
    {
        /// <summary>``BucketResource.ServerSideEncryptionByDefaultProperty.KMSMasterKeyID``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-serversideencryptionbydefault.html#cfn-s3-bucket-serversideencryptionbydefault-kmsmasterkeyid </remarks>
        [JsiiProperty("kmsMasterKeyId", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object KmsMasterKeyId
        {
            get;
            set;
        }

        /// <summary>``BucketResource.ServerSideEncryptionByDefaultProperty.SSEAlgorithm``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-serversideencryptionbydefault.html#cfn-s3-bucket-serversideencryptionbydefault-ssealgorithm </remarks>
        [JsiiProperty("sseAlgorithm", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}", true)]
        public object SseAlgorithm
        {
            get;
            set;
        }
    }
}