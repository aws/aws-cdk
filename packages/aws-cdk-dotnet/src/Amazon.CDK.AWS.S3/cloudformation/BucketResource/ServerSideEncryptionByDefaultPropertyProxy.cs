using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.S3.cloudformation.BucketResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-serversideencryptionbydefault.html </remarks>
    [JsiiInterfaceProxy(typeof(IServerSideEncryptionByDefaultProperty), "@aws-cdk/aws-s3.cloudformation.BucketResource.ServerSideEncryptionByDefaultProperty")]
    internal class ServerSideEncryptionByDefaultPropertyProxy : DeputyBase, IServerSideEncryptionByDefaultProperty
    {
        private ServerSideEncryptionByDefaultPropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``BucketResource.ServerSideEncryptionByDefaultProperty.KMSMasterKeyID``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-serversideencryptionbydefault.html#cfn-s3-bucket-serversideencryptionbydefault-kmsmasterkeyid </remarks>
        [JsiiProperty("kmsMasterKeyId", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object KmsMasterKeyId
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``BucketResource.ServerSideEncryptionByDefaultProperty.SSEAlgorithm``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-serversideencryptionbydefault.html#cfn-s3-bucket-serversideencryptionbydefault-ssealgorithm </remarks>
        [JsiiProperty("sseAlgorithm", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object SseAlgorithm
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}