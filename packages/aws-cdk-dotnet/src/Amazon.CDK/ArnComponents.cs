using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK
{
    public class ArnComponents : DeputyBase, IArnComponents
    {
        /// <summary>
        /// The partition that the resource is in. For standard AWS regions, the
        /// partition is aws. If you have resources in other partitions, the
        /// partition is aws-partitionname. For example, the partition for resources
        /// in the China (Beijing) region is aws-cn.
        /// </summary>
        /// <remarks>default: The AWS partition the stack is deployed to.</remarks>
        [JsiiProperty("partition", "{\"primitive\":\"any\",\"optional\":true}", true)]
        public object Partition
        {
            get;
            set;
        }

        /// <summary>
        /// The service namespace that identifies the AWS product (for example,
        /// 's3', 'iam', 'codepipline').
        /// </summary>
        [JsiiProperty("service", "{\"primitive\":\"any\"}", true)]
        public object Service
        {
            get;
            set;
        }

        /// <summary>
        /// The region the resource resides in. Note that the ARNs for some resources
        /// do not require a region, so this component might be omitted.
        /// </summary>
        /// <remarks>default: The region the stack is deployed to.</remarks>
        [JsiiProperty("region", "{\"primitive\":\"any\",\"optional\":true}", true)]
        public object Region
        {
            get;
            set;
        }

        /// <summary>
        /// The ID of the AWS account that owns the resource, without the hyphens.
        /// For example, 123456789012. Note that the ARNs for some resources don't
        /// require an account number, so this component might be omitted.
        /// </summary>
        /// <remarks>default: The account the stack is deployed to.</remarks>
        [JsiiProperty("account", "{\"primitive\":\"any\",\"optional\":true}", true)]
        public object Account
        {
            get;
            set;
        }

        /// <summary>
        /// Resource type (e.g. "table", "autoScalingGroup", "certificate").
        /// For some resource types, e.g. S3 buckets, this field defines the bucket name.
        /// </summary>
        [JsiiProperty("resource", "{\"primitive\":\"any\"}", true)]
        public object Resource
        {
            get;
            set;
        }

        /// <summary>
        /// Separator between resource type and the resource.
        /// 
        /// Can be either '/' or ':'. Will only be used if path is defined.
        /// </summary>
        /// <remarks>default: '/'</remarks>
        [JsiiProperty("sep", "{\"primitive\":\"string\",\"optional\":true}", true)]
        public string Sep
        {
            get;
            set;
        }

        /// <summary>
        /// Resource name or path within the resource (i.e. S3 bucket object key) or
        /// a wildcard such as ``"*"``. This is service-dependent.
        /// </summary>
        [JsiiProperty("resourceName", "{\"primitive\":\"any\",\"optional\":true}", true)]
        public object ResourceName
        {
            get;
            set;
        }
    }
}