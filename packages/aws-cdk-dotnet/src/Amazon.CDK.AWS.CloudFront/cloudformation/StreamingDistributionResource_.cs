using Amazon.CDK;
using Amazon.CDK.AWS.CloudFront;
using AWS.Jsii.Runtime.Deputy;
using System.Collections.Generic;

namespace Amazon.CDK.AWS.CloudFront.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudfront-streamingdistribution.html </remarks>
    [JsiiClass(typeof(StreamingDistributionResource_), "@aws-cdk/aws-cloudfront.cloudformation.StreamingDistributionResource", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"properties\",\"type\":{\"fqn\":\"@aws-cdk/aws-cloudfront.cloudformation.StreamingDistributionResourceProps\"}}]")]
    public class StreamingDistributionResource_ : Resource
    {
        public StreamingDistributionResource_(Construct parent, string name, IStreamingDistributionResourceProps properties): base(new DeputyProps(new object[]{parent, name, properties}))
        {
        }

        protected StreamingDistributionResource_(ByRefValue reference): base(reference)
        {
        }

        protected StreamingDistributionResource_(DeputyProps props): base(props)
        {
        }

        /// <summary>The CloudFormation resource type name for this resource class.</summary>
        [JsiiProperty("resourceTypeName", "{\"primitive\":\"string\"}")]
        public static string ResourceTypeName
        {
            get;
        }

        = GetStaticProperty<string>(typeof(StreamingDistributionResource_));
        /// <remarks>cloudformation_attribute: DomainName</remarks>
        [JsiiProperty("streamingDistributionDomainName", "{\"fqn\":\"@aws-cdk/aws-cloudfront.StreamingDistributionDomainName\"}")]
        public virtual StreamingDistributionDomainName StreamingDistributionDomainName
        {
            get => GetInstanceProperty<StreamingDistributionDomainName>();
        }

        [JsiiMethod("renderProperties", "{\"collection\":{\"kind\":\"map\",\"elementtype\":{\"primitive\":\"any\"}}}", "[]")]
        protected override IDictionary<string, object> RenderProperties()
        {
            return InvokeInstanceMethod<IDictionary<string, object>>(new object[]{});
        }
    }
}