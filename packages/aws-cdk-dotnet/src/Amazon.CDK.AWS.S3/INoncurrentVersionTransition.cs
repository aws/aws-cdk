using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.S3
{
    /// <summary>Describes when noncurrent versions transition to a specified storage class.</summary>
    [JsiiInterface(typeof(INoncurrentVersionTransition), "@aws-cdk/aws-s3.NoncurrentVersionTransition")]
    public interface INoncurrentVersionTransition
    {
        /// <summary>The storage class to which you want the object to transition.</summary>
        [JsiiProperty("storageClass", "{\"fqn\":\"@aws-cdk/aws-s3.StorageClass\"}")]
        StorageClass StorageClass
        {
            get;
            set;
        }

        /// <summary>Indicates the number of days after creation when objects are transitioned to the specified storage class.</summary>
        /// <remarks>default: No transition count.</remarks>
        [JsiiProperty("transitionInDays", "{\"primitive\":\"number\"}")]
        double TransitionInDays
        {
            get;
            set;
        }
    }
}