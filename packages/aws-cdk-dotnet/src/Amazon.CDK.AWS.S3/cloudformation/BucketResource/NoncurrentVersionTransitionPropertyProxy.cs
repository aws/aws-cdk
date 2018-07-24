using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.S3.cloudformation.BucketResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-lifecycleconfig-rule-noncurrentversiontransition.html </remarks>
    [JsiiInterfaceProxy(typeof(INoncurrentVersionTransitionProperty), "@aws-cdk/aws-s3.cloudformation.BucketResource.NoncurrentVersionTransitionProperty")]
    internal class NoncurrentVersionTransitionPropertyProxy : DeputyBase, INoncurrentVersionTransitionProperty
    {
        private NoncurrentVersionTransitionPropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``BucketResource.NoncurrentVersionTransitionProperty.StorageClass``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-lifecycleconfig-rule-noncurrentversiontransition.html#cfn-s3-bucket-lifecycleconfig-rule-noncurrentversiontransition-storageclass </remarks>
        [JsiiProperty("storageClass", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object StorageClass
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``BucketResource.NoncurrentVersionTransitionProperty.TransitionInDays``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-lifecycleconfig-rule-noncurrentversiontransition.html#cfn-s3-bucket-lifecycleconfig-rule-noncurrentversiontransition-transitionindays </remarks>
        [JsiiProperty("transitionInDays", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object TransitionInDays
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}