using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.S3.cloudformation.BucketResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-bucketencryption.html </remarks>
    [JsiiInterfaceProxy(typeof(IBucketEncryptionProperty), "@aws-cdk/aws-s3.cloudformation.BucketResource.BucketEncryptionProperty")]
    internal class BucketEncryptionPropertyProxy : DeputyBase, IBucketEncryptionProperty
    {
        private BucketEncryptionPropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``BucketResource.BucketEncryptionProperty.ServerSideEncryptionConfiguration``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-bucketencryption.html#cfn-s3-bucket-bucketencryption-serversideencryptionconfiguration </remarks>
        [JsiiProperty("serverSideEncryptionConfiguration", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-s3.cloudformation.BucketResource.ServerSideEncryptionRuleProperty\"}]}}}}]}}")]
        public virtual object ServerSideEncryptionConfiguration
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}