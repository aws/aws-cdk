using AWS.Jsii.Runtime.Deputy;
using System;

namespace Amazon.CDK.AWS.S3
{
    /// <summary>Describes when an object transitions to a specified storage class.</summary>
    public class Transition : DeputyBase, ITransition
    {
        /// <summary>The storage class to which you want the object to transition.</summary>
        [JsiiProperty("storageClass", "{\"fqn\":\"@aws-cdk/aws-s3.StorageClass\"}", true)]
        public StorageClass StorageClass
        {
            get;
            set;
        }

        /// <summary>
        /// Indicates when objects are transitioned to the specified storage class.
        /// 
        /// The date value must be in ISO 8601 format. The time is always midnight UTC.
        /// </summary>
        /// <remarks>default: No transition date.</remarks>
        [JsiiProperty("transitionDate", "{\"primitive\":\"date\",\"optional\":true}", true)]
        public DateTime? TransitionDate
        {
            get;
            set;
        }

        /// <summary>Indicates the number of days after creation when objects are transitioned to the specified storage class.</summary>
        /// <remarks>default: No transition count.</remarks>
        [JsiiProperty("transitionInDays", "{\"primitive\":\"number\",\"optional\":true}", true)]
        public double? TransitionInDays
        {
            get;
            set;
        }
    }
}