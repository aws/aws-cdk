using Amazon.CDK;
using Amazon.CDK.AWS.DirectoryService;
using AWS.Jsii.Runtime.Deputy;
using System.Collections.Generic;

namespace Amazon.CDK.AWS.DirectoryService.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-directoryservice-microsoftad.html </remarks>
    [JsiiClass(typeof(MicrosoftADResource_), "@aws-cdk/aws-directoryservice.cloudformation.MicrosoftADResource", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"properties\",\"type\":{\"fqn\":\"@aws-cdk/aws-directoryservice.cloudformation.MicrosoftADResourceProps\"}}]")]
    public class MicrosoftADResource_ : Resource
    {
        public MicrosoftADResource_(Construct parent, string name, IMicrosoftADResourceProps properties): base(new DeputyProps(new object[]{parent, name, properties}))
        {
        }

        protected MicrosoftADResource_(ByRefValue reference): base(reference)
        {
        }

        protected MicrosoftADResource_(DeputyProps props): base(props)
        {
        }

        /// <summary>The CloudFormation resource type name for this resource class.</summary>
        [JsiiProperty("resourceTypeName", "{\"primitive\":\"string\"}")]
        public static string ResourceTypeName
        {
            get;
        }

        = GetStaticProperty<string>(typeof(MicrosoftADResource_));
        /// <remarks>cloudformation_attribute: Alias</remarks>
        [JsiiProperty("microsoftAdAlias", "{\"fqn\":\"@aws-cdk/aws-directoryservice.MicrosoftADAlias\"}")]
        public virtual MicrosoftADAlias MicrosoftAdAlias
        {
            get => GetInstanceProperty<MicrosoftADAlias>();
        }

        /// <remarks>cloudformation_attribute: DnsIpAddresses</remarks>
        [JsiiProperty("microsoftAdDnsIpAddresses", "{\"fqn\":\"@aws-cdk/aws-directoryservice.MicrosoftADDnsIpAddresses\"}")]
        public virtual MicrosoftADDnsIpAddresses MicrosoftAdDnsIpAddresses
        {
            get => GetInstanceProperty<MicrosoftADDnsIpAddresses>();
        }

        [JsiiMethod("renderProperties", "{\"collection\":{\"kind\":\"map\",\"elementtype\":{\"primitive\":\"any\"}}}", "[]")]
        protected override IDictionary<string, object> RenderProperties()
        {
            return InvokeInstanceMethod<IDictionary<string, object>>(new object[]{});
        }
    }
}