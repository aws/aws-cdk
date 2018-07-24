using AWS.Jsii.Runtime.Deputy;
using System;

namespace Amazon.CDK.AWS.S3
{
    /// <summary>Describes when an object transitions to a specified storage class.</summary>
    [JsiiInterfaceProxy(typeof(ITransition), "@aws-cdk/aws-s3.Transition")]
    internal class TransitionProxy : DeputyBase, ITransition
    {
        private TransitionProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>The storage class to which you want the object to transition.</summary>
        [JsiiProperty("storageClass", "{\"fqn\":\"@aws-cdk/aws-s3.StorageClass\"}")]
        public virtual StorageClass StorageClass
        {
            get => GetInstanceProperty<StorageClass>();
            set => SetInstanceProperty(value);
        }

        /// <summary>
        /// Indicates when objects are transitioned to the specified storage class.
        /// 
        /// The date value must be in ISO 8601 format. The time is always midnight UTC.
        /// </summary>
        /// <remarks>default: No transition date.</remarks>
        [JsiiProperty("transitionDate", "{\"primitive\":\"date\",\"optional\":true}")]
        public virtual DateTime? TransitionDate
        {
            get => GetInstanceProperty<DateTime? >();
            set => SetInstanceProperty(value);
        }

        /// <summary>Indicates the number of days after creation when objects are transitioned to the specified storage class.</summary>
        /// <remarks>default: No transition count.</remarks>
        [JsiiProperty("transitionInDays", "{\"primitive\":\"number\",\"optional\":true}")]
        public virtual double? TransitionInDays
        {
            get => GetInstanceProperty<double? >();
            set => SetInstanceProperty(value);
        }
    }
}