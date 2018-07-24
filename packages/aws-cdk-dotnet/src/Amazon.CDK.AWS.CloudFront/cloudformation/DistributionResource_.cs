using Amazon.CDK;
using Amazon.CDK.AWS.CloudFront;
using AWS.Jsii.Runtime.Deputy;
using System.Collections.Generic;

namespace Amazon.CDK.AWS.CloudFront.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudfront-distribution.html </remarks>
    [JsiiClass(typeof(DistributionResource_), "@aws-cdk/aws-cloudfront.cloudformation.DistributionResource", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"properties\",\"type\":{\"fqn\":\"@aws-cdk/aws-cloudfront.cloudformation.DistributionResourceProps\"}}]")]
    public class DistributionResource_ : Resource
    {
        public DistributionResource_(Construct parent, string name, IDistributionResourceProps properties): base(new DeputyProps(new object[]{parent, name, properties}))
        {
        }

        protected DistributionResource_(ByRefValue reference): base(reference)
        {
        }

        protected DistributionResource_(DeputyProps props): base(props)
        {
        }

        /// <summary>The CloudFormation resource type name for this resource class.</summary>
        [JsiiProperty("resourceTypeName", "{\"primitive\":\"string\"}")]
        public static string ResourceTypeName
        {
            get;
        }

        = GetStaticProperty<string>(typeof(DistributionResource_));
        /// <remarks>cloudformation_attribute: DomainName</remarks>
        [JsiiProperty("distributionDomainName", "{\"fqn\":\"@aws-cdk/aws-cloudfront.DistributionDomainName\"}")]
        public virtual DistributionDomainName DistributionDomainName
        {
            get => GetInstanceProperty<DistributionDomainName>();
        }

        [JsiiMethod("renderProperties", "{\"collection\":{\"kind\":\"map\",\"elementtype\":{\"primitive\":\"any\"}}}", "[]")]
        protected override IDictionary<string, object> RenderProperties()
        {
            return InvokeInstanceMethod<IDictionary<string, object>>(new object[]{});
        }
    }
}