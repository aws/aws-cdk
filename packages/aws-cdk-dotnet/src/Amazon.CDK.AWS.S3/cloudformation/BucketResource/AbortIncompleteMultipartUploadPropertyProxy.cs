using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.S3.cloudformation.BucketResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-abortincompletemultipartupload.html </remarks>
    [JsiiInterfaceProxy(typeof(IAbortIncompleteMultipartUploadProperty), "@aws-cdk/aws-s3.cloudformation.BucketResource.AbortIncompleteMultipartUploadProperty")]
    internal class AbortIncompleteMultipartUploadPropertyProxy : DeputyBase, IAbortIncompleteMultipartUploadProperty
    {
        private AbortIncompleteMultipartUploadPropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``BucketResource.AbortIncompleteMultipartUploadProperty.DaysAfterInitiation``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-abortincompletemultipartupload.html#cfn-s3-bucket-abortincompletemultipartupload-daysafterinitiation </remarks>
        [JsiiProperty("daysAfterInitiation", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object DaysAfterInitiation
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}