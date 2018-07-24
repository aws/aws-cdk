using Amazon.CDK;
using Amazon.CDK.AWS.Route53;
using AWS.Jsii.Runtime.Deputy;
using System.Collections.Generic;

namespace Amazon.CDK.AWS.Route53.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-route53-hostedzone.html </remarks>
    [JsiiClass(typeof(HostedZoneResource_), "@aws-cdk/aws-route53.cloudformation.HostedZoneResource", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"properties\",\"type\":{\"fqn\":\"@aws-cdk/aws-route53.cloudformation.HostedZoneResourceProps\"}}]")]
    public class HostedZoneResource_ : Resource
    {
        public HostedZoneResource_(Construct parent, string name, IHostedZoneResourceProps properties): base(new DeputyProps(new object[]{parent, name, properties}))
        {
        }

        protected HostedZoneResource_(ByRefValue reference): base(reference)
        {
        }

        protected HostedZoneResource_(DeputyProps props): base(props)
        {
        }

        /// <summary>The CloudFormation resource type name for this resource class.</summary>
        [JsiiProperty("resourceTypeName", "{\"primitive\":\"string\"}")]
        public static string ResourceTypeName
        {
            get;
        }

        = GetStaticProperty<string>(typeof(HostedZoneResource_));
        /// <remarks>cloudformation_attribute: NameServers</remarks>
        [JsiiProperty("hostedZoneNameServers", "{\"fqn\":\"@aws-cdk/aws-route53.HostedZoneNameServers\"}")]
        public virtual HostedZoneNameServers HostedZoneNameServers
        {
            get => GetInstanceProperty<HostedZoneNameServers>();
        }

        [JsiiMethod("renderProperties", "{\"collection\":{\"kind\":\"map\",\"elementtype\":{\"primitive\":\"any\"}}}", "[]")]
        protected override IDictionary<string, object> RenderProperties()
        {
            return InvokeInstanceMethod<IDictionary<string, object>>(new object[]{});
        }
    }
}