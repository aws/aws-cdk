using Amazon.CDK;
using Amazon.CDK.AWS.Elasticsearch;
using AWS.Jsii.Runtime.Deputy;
using System.Collections.Generic;

namespace Amazon.CDK.AWS.Elasticsearch.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticsearch-domain.html </remarks>
    [JsiiClass(typeof(DomainResource_), "@aws-cdk/aws-elasticsearch.cloudformation.DomainResource", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"properties\",\"type\":{\"fqn\":\"@aws-cdk/aws-elasticsearch.cloudformation.DomainResourceProps\",\"optional\":true}}]")]
    public class DomainResource_ : Resource
    {
        public DomainResource_(Construct parent, string name, IDomainResourceProps properties): base(new DeputyProps(new object[]{parent, name, properties}))
        {
        }

        protected DomainResource_(ByRefValue reference): base(reference)
        {
        }

        protected DomainResource_(DeputyProps props): base(props)
        {
        }

        /// <summary>The CloudFormation resource type name for this resource class.</summary>
        [JsiiProperty("resourceTypeName", "{\"primitive\":\"string\"}")]
        public static string ResourceTypeName
        {
            get;
        }

        = GetStaticProperty<string>(typeof(DomainResource_));
        /// <remarks>cloudformation_attribute: Arn</remarks>
        [JsiiProperty("domainArn", "{\"fqn\":\"@aws-cdk/aws-elasticsearch.DomainArn\"}")]
        public virtual DomainArn DomainArn
        {
            get => GetInstanceProperty<DomainArn>();
        }

        /// <remarks>cloudformation_attribute: DomainEndpoint</remarks>
        [JsiiProperty("domainEndpoint", "{\"fqn\":\"@aws-cdk/aws-elasticsearch.DomainEndpoint\"}")]
        public virtual DomainEndpoint DomainEndpoint
        {
            get => GetInstanceProperty<DomainEndpoint>();
        }

        [JsiiMethod("renderProperties", "{\"collection\":{\"kind\":\"map\",\"elementtype\":{\"primitive\":\"any\"}}}", "[]")]
        protected override IDictionary<string, object> RenderProperties()
        {
            return InvokeInstanceMethod<IDictionary<string, object>>(new object[]{});
        }
    }
}