using Amazon.CDK;
using Amazon.CDK.AWS.ServiceDiscovery;
using AWS.Jsii.Runtime.Deputy;
using System.Collections.Generic;

namespace Amazon.CDK.AWS.ServiceDiscovery.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicediscovery-privatednsnamespace.html </remarks>
    [JsiiClass(typeof(PrivateDnsNamespaceResource), "@aws-cdk/aws-servicediscovery.cloudformation.PrivateDnsNamespaceResource", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"properties\",\"type\":{\"fqn\":\"@aws-cdk/aws-servicediscovery.cloudformation.PrivateDnsNamespaceResourceProps\"}}]")]
    public class PrivateDnsNamespaceResource : Resource
    {
        public PrivateDnsNamespaceResource(Construct parent, string name, IPrivateDnsNamespaceResourceProps properties): base(new DeputyProps(new object[]{parent, name, properties}))
        {
        }

        protected PrivateDnsNamespaceResource(ByRefValue reference): base(reference)
        {
        }

        protected PrivateDnsNamespaceResource(DeputyProps props): base(props)
        {
        }

        /// <summary>The CloudFormation resource type name for this resource class.</summary>
        [JsiiProperty("resourceTypeName", "{\"primitive\":\"string\"}")]
        public static string ResourceTypeName
        {
            get;
        }

        = GetStaticProperty<string>(typeof(PrivateDnsNamespaceResource));
        /// <remarks>cloudformation_attribute: Arn</remarks>
        [JsiiProperty("privateDnsNamespaceArn", "{\"fqn\":\"@aws-cdk/aws-servicediscovery.PrivateDnsNamespaceArn\"}")]
        public virtual PrivateDnsNamespaceArn PrivateDnsNamespaceArn
        {
            get => GetInstanceProperty<PrivateDnsNamespaceArn>();
        }

        /// <remarks>cloudformation_attribute: Id</remarks>
        [JsiiProperty("privateDnsNamespaceId", "{\"fqn\":\"@aws-cdk/aws-servicediscovery.PrivateDnsNamespaceId\"}")]
        public virtual PrivateDnsNamespaceId PrivateDnsNamespaceId
        {
            get => GetInstanceProperty<PrivateDnsNamespaceId>();
        }

        [JsiiMethod("renderProperties", "{\"collection\":{\"kind\":\"map\",\"elementtype\":{\"primitive\":\"any\"}}}", "[]")]
        protected override IDictionary<string, object> RenderProperties()
        {
            return InvokeInstanceMethod<IDictionary<string, object>>(new object[]{});
        }
    }
}