using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;
using System.Collections.Generic;

namespace Amazon.CDK.AWS.OpsWorks.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-elbattachment.html </remarks>
    [JsiiClass(typeof(ElasticLoadBalancerAttachmentResource), "@aws-cdk/aws-opsworks.cloudformation.ElasticLoadBalancerAttachmentResource", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"properties\",\"type\":{\"fqn\":\"@aws-cdk/aws-opsworks.cloudformation.ElasticLoadBalancerAttachmentResourceProps\"}}]")]
    public class ElasticLoadBalancerAttachmentResource : Resource
    {
        public ElasticLoadBalancerAttachmentResource(Construct parent, string name, IElasticLoadBalancerAttachmentResourceProps properties): base(new DeputyProps(new object[]{parent, name, properties}))
        {
        }

        protected ElasticLoadBalancerAttachmentResource(ByRefValue reference): base(reference)
        {
        }

        protected ElasticLoadBalancerAttachmentResource(DeputyProps props): base(props)
        {
        }

        /// <summary>The CloudFormation resource type name for this resource class.</summary>
        [JsiiProperty("resourceTypeName", "{\"primitive\":\"string\"}")]
        public static string ResourceTypeName
        {
            get;
        }

        = GetStaticProperty<string>(typeof(ElasticLoadBalancerAttachmentResource));
        [JsiiMethod("renderProperties", "{\"collection\":{\"kind\":\"map\",\"elementtype\":{\"primitive\":\"any\"}}}", "[]")]
        protected override IDictionary<string, object> RenderProperties()
        {
            return InvokeInstanceMethod<IDictionary<string, object>>(new object[]{});
        }
    }
}