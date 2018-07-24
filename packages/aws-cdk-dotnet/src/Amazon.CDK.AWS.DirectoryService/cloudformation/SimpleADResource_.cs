using Amazon.CDK;
using Amazon.CDK.AWS.DirectoryService;
using AWS.Jsii.Runtime.Deputy;
using System.Collections.Generic;

namespace Amazon.CDK.AWS.DirectoryService.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-directoryservice-simplead.html </remarks>
    [JsiiClass(typeof(SimpleADResource_), "@aws-cdk/aws-directoryservice.cloudformation.SimpleADResource", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"properties\",\"type\":{\"fqn\":\"@aws-cdk/aws-directoryservice.cloudformation.SimpleADResourceProps\"}}]")]
    public class SimpleADResource_ : Resource
    {
        public SimpleADResource_(Construct parent, string name, ISimpleADResourceProps properties): base(new DeputyProps(new object[]{parent, name, properties}))
        {
        }

        protected SimpleADResource_(ByRefValue reference): base(reference)
        {
        }

        protected SimpleADResource_(DeputyProps props): base(props)
        {
        }

        /// <summary>The CloudFormation resource type name for this resource class.</summary>
        [JsiiProperty("resourceTypeName", "{\"primitive\":\"string\"}")]
        public static string ResourceTypeName
        {
            get;
        }

        = GetStaticProperty<string>(typeof(SimpleADResource_));
        /// <remarks>cloudformation_attribute: Alias</remarks>
        [JsiiProperty("simpleAdAlias", "{\"fqn\":\"@aws-cdk/aws-directoryservice.SimpleADAlias\"}")]
        public virtual SimpleADAlias SimpleAdAlias
        {
            get => GetInstanceProperty<SimpleADAlias>();
        }

        /// <remarks>cloudformation_attribute: DnsIpAddresses</remarks>
        [JsiiProperty("simpleAdDnsIpAddresses", "{\"fqn\":\"@aws-cdk/aws-directoryservice.SimpleADDnsIpAddresses\"}")]
        public virtual SimpleADDnsIpAddresses SimpleAdDnsIpAddresses
        {
            get => GetInstanceProperty<SimpleADDnsIpAddresses>();
        }

        [JsiiMethod("renderProperties", "{\"collection\":{\"kind\":\"map\",\"elementtype\":{\"primitive\":\"any\"}}}", "[]")]
        protected override IDictionary<string, object> RenderProperties()
        {
            return InvokeInstanceMethod<IDictionary<string, object>>(new object[]{});
        }
    }
}