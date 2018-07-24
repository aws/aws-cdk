using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.S3.cloudformation.BucketResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-ssekmsencryptedobjects.html </remarks>
    [JsiiInterfaceProxy(typeof(ISseKmsEncryptedObjectsProperty), "@aws-cdk/aws-s3.cloudformation.BucketResource.SseKmsEncryptedObjectsProperty")]
    internal class SseKmsEncryptedObjectsPropertyProxy : DeputyBase, ISseKmsEncryptedObjectsProperty
    {
        private SseKmsEncryptedObjectsPropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``BucketResource.SseKmsEncryptedObjectsProperty.Status``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-ssekmsencryptedobjects.html#cfn-s3-bucket-ssekmsencryptedobjects-status </remarks>
        [JsiiProperty("status", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object Status
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}