using Amazon.CDK;
using Amazon.CDK.AWS.CloudFront;
using AWS.Jsii.Runtime.Deputy;
using System.Collections.Generic;

namespace Amazon.CDK.AWS.CloudFront.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudfront-cloudfrontoriginaccessidentity.html </remarks>
    [JsiiClass(typeof(CloudFrontOriginAccessIdentityResource_), "@aws-cdk/aws-cloudfront.cloudformation.CloudFrontOriginAccessIdentityResource", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"properties\",\"type\":{\"fqn\":\"@aws-cdk/aws-cloudfront.cloudformation.CloudFrontOriginAccessIdentityResourceProps\"}}]")]
    public class CloudFrontOriginAccessIdentityResource_ : Resource
    {
        public CloudFrontOriginAccessIdentityResource_(Construct parent, string name, ICloudFrontOriginAccessIdentityResourceProps properties): base(new DeputyProps(new object[]{parent, name, properties}))
        {
        }

        protected CloudFrontOriginAccessIdentityResource_(ByRefValue reference): base(reference)
        {
        }

        protected CloudFrontOriginAccessIdentityResource_(DeputyProps props): base(props)
        {
        }

        /// <summary>The CloudFormation resource type name for this resource class.</summary>
        [JsiiProperty("resourceTypeName", "{\"primitive\":\"string\"}")]
        public static string ResourceTypeName
        {
            get;
        }

        = GetStaticProperty<string>(typeof(CloudFrontOriginAccessIdentityResource_));
        /// <remarks>cloudformation_attribute: S3CanonicalUserId</remarks>
        [JsiiProperty("cloudFrontOriginAccessIdentityS3CanonicalUserId", "{\"fqn\":\"@aws-cdk/aws-cloudfront.CloudFrontOriginAccessIdentityS3CanonicalUserId\"}")]
        public virtual CloudFrontOriginAccessIdentityS3CanonicalUserId CloudFrontOriginAccessIdentityS3CanonicalUserId
        {
            get => GetInstanceProperty<CloudFrontOriginAccessIdentityS3CanonicalUserId>();
        }

        [JsiiMethod("renderProperties", "{\"collection\":{\"kind\":\"map\",\"elementtype\":{\"primitive\":\"any\"}}}", "[]")]
        protected override IDictionary<string, object> RenderProperties()
        {
            return InvokeInstanceMethod<IDictionary<string, object>>(new object[]{});
        }
    }
}