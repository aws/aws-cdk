using Amazon.CDK;
using Amazon.CDK.AWS.S3;
using AWS.Jsii.Runtime.Deputy;
using System.Collections.Generic;

namespace Amazon.CDK.AWS.S3.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket.html </remarks>
    [JsiiClass(typeof(BucketResource_), "@aws-cdk/aws-s3.cloudformation.BucketResource", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"properties\",\"type\":{\"fqn\":\"@aws-cdk/aws-s3.cloudformation.BucketResourceProps\",\"optional\":true}}]")]
    public class BucketResource_ : Resource
    {
        public BucketResource_(Construct parent, string name, IBucketResourceProps properties): base(new DeputyProps(new object[]{parent, name, properties}))
        {
        }

        protected BucketResource_(ByRefValue reference): base(reference)
        {
        }

        protected BucketResource_(DeputyProps props): base(props)
        {
        }

        /// <summary>The CloudFormation resource type name for this resource class.</summary>
        [JsiiProperty("resourceTypeName", "{\"primitive\":\"string\"}")]
        public static string ResourceTypeName
        {
            get;
        }

        = GetStaticProperty<string>(typeof(BucketResource_));
        /// <remarks>cloudformation_attribute: Arn</remarks>
        [JsiiProperty("bucketArn", "{\"fqn\":\"@aws-cdk/aws-s3.BucketArn\"}")]
        public virtual BucketArn BucketArn
        {
            get => GetInstanceProperty<BucketArn>();
        }

        /// <remarks>cloudformation_attribute: DomainName</remarks>
        [JsiiProperty("bucketDomainName", "{\"fqn\":\"@aws-cdk/aws-s3.BucketDomainName\"}")]
        public virtual BucketDomainName BucketDomainName
        {
            get => GetInstanceProperty<BucketDomainName>();
        }

        /// <remarks>cloudformation_attribute: DualStackDomainName</remarks>
        [JsiiProperty("bucketDualStackDomainName", "{\"fqn\":\"@aws-cdk/aws-s3.BucketDualStackDomainName\"}")]
        public virtual BucketDualStackDomainName BucketDualStackDomainName
        {
            get => GetInstanceProperty<BucketDualStackDomainName>();
        }

        /// <remarks>cloudformation_attribute: WebsiteURL</remarks>
        [JsiiProperty("bucketWebsiteUrl", "{\"fqn\":\"@aws-cdk/aws-s3.BucketWebsiteUrl\"}")]
        public virtual BucketWebsiteUrl BucketWebsiteUrl
        {
            get => GetInstanceProperty<BucketWebsiteUrl>();
        }

        [JsiiMethod("renderProperties", "{\"collection\":{\"kind\":\"map\",\"elementtype\":{\"primitive\":\"any\"}}}", "[]")]
        protected override IDictionary<string, object> RenderProperties()
        {
            return InvokeInstanceMethod<IDictionary<string, object>>(new object[]{});
        }
    }
}