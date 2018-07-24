using Amazon.CDK;
using Amazon.CDK.AWS.ServiceDiscovery;
using AWS.Jsii.Runtime.Deputy;
using System.Collections.Generic;

namespace Amazon.CDK.AWS.ServiceDiscovery.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicediscovery-publicdnsnamespace.html </remarks>
    [JsiiClass(typeof(PublicDnsNamespaceResource), "@aws-cdk/aws-servicediscovery.cloudformation.PublicDnsNamespaceResource", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"properties\",\"type\":{\"fqn\":\"@aws-cdk/aws-servicediscovery.cloudformation.PublicDnsNamespaceResourceProps\"}}]")]
    public class PublicDnsNamespaceResource : Resource
    {
        public PublicDnsNamespaceResource(Construct parent, string name, IPublicDnsNamespaceResourceProps properties): base(new DeputyProps(new object[]{parent, name, properties}))
        {
        }

        protected PublicDnsNamespaceResource(ByRefValue reference): base(reference)
        {
        }

        protected PublicDnsNamespaceResource(DeputyProps props): base(props)
        {
        }

        /// <summary>The CloudFormation resource type name for this resource class.</summary>
        [JsiiProperty("resourceTypeName", "{\"primitive\":\"string\"}")]
        public static string ResourceTypeName
        {
            get;
        }

        = GetStaticProperty<string>(typeof(PublicDnsNamespaceResource));
        /// <remarks>cloudformation_attribute: Arn</remarks>
        [JsiiProperty("publicDnsNamespaceArn", "{\"fqn\":\"@aws-cdk/aws-servicediscovery.PublicDnsNamespaceArn\"}")]
        public virtual PublicDnsNamespaceArn PublicDnsNamespaceArn
        {
            get => GetInstanceProperty<PublicDnsNamespaceArn>();
        }

        /// <remarks>cloudformation_attribute: Id</remarks>
        [JsiiProperty("publicDnsNamespaceId", "{\"fqn\":\"@aws-cdk/aws-servicediscovery.PublicDnsNamespaceId\"}")]
        public virtual PublicDnsNamespaceId PublicDnsNamespaceId
        {
            get => GetInstanceProperty<PublicDnsNamespaceId>();
        }

        [JsiiMethod("renderProperties", "{\"collection\":{\"kind\":\"map\",\"elementtype\":{\"primitive\":\"any\"}}}", "[]")]
        protected override IDictionary<string, object> RenderProperties()
        {
            return InvokeInstanceMethod<IDictionary<string, object>>(new object[]{});
        }
    }
}