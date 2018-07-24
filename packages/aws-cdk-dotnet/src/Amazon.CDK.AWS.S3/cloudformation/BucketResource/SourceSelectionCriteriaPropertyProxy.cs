using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.S3.cloudformation.BucketResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-sourceselectioncriteria.html </remarks>
    [JsiiInterfaceProxy(typeof(ISourceSelectionCriteriaProperty), "@aws-cdk/aws-s3.cloudformation.BucketResource.SourceSelectionCriteriaProperty")]
    internal class SourceSelectionCriteriaPropertyProxy : DeputyBase, ISourceSelectionCriteriaProperty
    {
        private SourceSelectionCriteriaPropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``BucketResource.SourceSelectionCriteriaProperty.SseKmsEncryptedObjects``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-sourceselectioncriteria.html#cfn-s3-bucket-sourceselectioncriteria-ssekmsencryptedobjects </remarks>
        [JsiiProperty("sseKmsEncryptedObjects", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-s3.cloudformation.BucketResource.SseKmsEncryptedObjectsProperty\"}]}}")]
        public virtual object SseKmsEncryptedObjects
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}