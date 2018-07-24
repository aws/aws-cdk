using AWS.Jsii.Runtime.Deputy;
using System;
using System.Collections.Generic;

namespace Amazon.CDK.AWS.S3
{
    /// <summary>Declaration of a Life cycle rule</summary>
    [JsiiInterface(typeof(ILifecycleRule), "@aws-cdk/aws-s3.LifecycleRule")]
    public interface ILifecycleRule
    {
        /// <summary>A unique identifier for this rule. The value cannot be more than 255 characters.</summary>
        [JsiiProperty("id", "{\"primitive\":\"string\",\"optional\":true}")]
        string Id
        {
            get;
            set;
        }

        /// <summary>Whether this rule is enabled.</summary>
        /// <remarks>default: true</remarks>
        [JsiiProperty("enabled", "{\"primitive\":\"boolean\",\"optional\":true}")]
        bool? Enabled
        {
            get;
            set;
        }

        /// <summary>
        /// Specifies a lifecycle rule that aborts incomplete multipart uploads to an Amazon S3 bucket.
        /// 
        /// The AbortIncompleteMultipartUpload property type creates a lifecycle
        /// rule that aborts incomplete multipart uploads to an Amazon S3 bucket.
        /// When Amazon S3 aborts a multipart upload, it deletes all parts
        /// associated with the multipart upload.
        /// </summary>
        /// <remarks>default: Incomplete uploads are never aborted</remarks>
        [JsiiProperty("abortIncompleteMultipartUploadAfterDays", "{\"primitive\":\"number\",\"optional\":true}")]
        double? AbortIncompleteMultipartUploadAfterDays
        {
            get;
            set;
        }

        /// <summary>
        /// Indicates when objects are deleted from Amazon S3 and Amazon Glacier.
        /// 
        /// The date value must be in ISO 8601 format. The time is always midnight UTC.
        /// 
        /// If you specify an expiration and transition time, you must use the same
        /// time unit for both properties (either in days or by date). The
        /// expiration time must also be later than the transition time.
        /// </summary>
        /// <remarks>default: No expiration date</remarks>
        [JsiiProperty("expirationDate", "{\"primitive\":\"date\",\"optional\":true}")]
        DateTime? ExpirationDate
        {
            get;
            set;
        }

        /// <summary>
        /// Indicates the number of days after creation when objects are deleted from Amazon S3 and Amazon Glacier.
        /// 
        /// If you specify an expiration and transition time, you must use the same
        /// time unit for both properties (either in days or by date). The
        /// expiration time must also be later than the transition time.
        /// </summary>
        /// <remarks>default: No expiration timeout</remarks>
        [JsiiProperty("expirationInDays", "{\"primitive\":\"number\",\"optional\":true}")]
        double? ExpirationInDays
        {
            get;
            set;
        }

        /// <summary>
        /// Time between when a new version of the object is uploaded to the bucket and when old versions of the object expire.
        /// 
        /// For buckets with versioning enabled (or suspended), specifies the time,
        /// in days, between when a new version of the object is uploaded to the
        /// bucket and when old versions of the object expire. When object versions
        /// expire, Amazon S3 permanently deletes them. If you specify a transition
        /// and expiration time, the expiration time must be later than the
        /// transition time.
        /// </summary>
        /// <remarks>default: No noncurrent version expiration</remarks>
        [JsiiProperty("noncurrentVersionExpirationInDays", "{\"primitive\":\"number\",\"optional\":true}")]
        double? NoncurrentVersionExpirationInDays
        {
            get;
            set;
        }

        /// <summary>
        /// One or more transition rules that specify when non-current objects transition to a specified storage class.
        /// 
        /// Only for for buckets with versioning enabled (or suspended).
        /// 
        /// If you specify a transition and expiration time, the expiration time
        /// must be later than the transition time.
        /// </summary>
        [JsiiProperty("noncurrentVersionTransitions", "{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"fqn\":\"@aws-cdk/aws-s3.NoncurrentVersionTransition\"}},\"optional\":true}")]
        INoncurrentVersionTransition[] NoncurrentVersionTransitions
        {
            get;
            set;
        }

        /// <summary>
        /// One or more transition rules that specify when an object transitions to a specified storage class.
        /// 
        /// If you specify an expiration and transition time, you must use the same
        /// time unit for both properties (either in days or by date). The
        /// expiration time must also be later than the transition time.
        /// </summary>
        /// <remarks>default: No transition rules</remarks>
        [JsiiProperty("transitions", "{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"fqn\":\"@aws-cdk/aws-s3.Transition\"}},\"optional\":true}")]
        ITransition[] Transitions
        {
            get;
            set;
        }

        /// <summary>Object key prefix that identifies one or more objects to which this rule applies.</summary>
        /// <remarks>default: Rule applies to all objects</remarks>
        [JsiiProperty("prefix", "{\"primitive\":\"string\",\"optional\":true}")]
        string Prefix
        {
            get;
            set;
        }

        /// <summary>The TagFilter property type specifies tags to use to identify a subset of objects for an Amazon S3 bucket.</summary>
        /// <remarks>default: Rule applies to all objects</remarks>
        [JsiiProperty("tagFilters", "{\"collection\":{\"kind\":\"map\",\"elementtype\":{\"primitive\":\"any\"}},\"optional\":true}")]
        IDictionary<string, object> TagFilters
        {
            get;
            set;
        }
    }
}