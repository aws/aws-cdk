using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.S3
{
    /// <summary>Describes when noncurrent versions transition to a specified storage class.</summary>
    public class NoncurrentVersionTransition : DeputyBase, INoncurrentVersionTransition
    {
        /// <summary>The storage class to which you want the object to transition.</summary>
        [JsiiProperty("storageClass", "{\"fqn\":\"@aws-cdk/aws-s3.StorageClass\"}", true)]
        public StorageClass StorageClass
        {
            get;
            set;
        }

        /// <summary>Indicates the number of days after creation when objects are transitioned to the specified storage class.</summary>
        /// <remarks>default: No transition count.</remarks>
        [JsiiProperty("transitionInDays", "{\"primitive\":\"number\"}", true)]
        public double TransitionInDays
        {
            get;
            set;
        }
    }
}