using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.S3
{
    /// <summary>Describes when noncurrent versions transition to a specified storage class.</summary>
    [JsiiInterfaceProxy(typeof(INoncurrentVersionTransition), "@aws-cdk/aws-s3.NoncurrentVersionTransition")]
    internal class NoncurrentVersionTransitionProxy : DeputyBase, INoncurrentVersionTransition
    {
        private NoncurrentVersionTransitionProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>The storage class to which you want the object to transition.</summary>
        [JsiiProperty("storageClass", "{\"fqn\":\"@aws-cdk/aws-s3.StorageClass\"}")]
        public virtual StorageClass StorageClass
        {
            get => GetInstanceProperty<StorageClass>();
            set => SetInstanceProperty(value);
        }

        /// <summary>Indicates the number of days after creation when objects are transitioned to the specified storage class.</summary>
        /// <remarks>default: No transition count.</remarks>
        [JsiiProperty("transitionInDays", "{\"primitive\":\"number\"}")]
        public virtual double TransitionInDays
        {
            get => GetInstanceProperty<double>();
            set => SetInstanceProperty(value);
        }
    }
}