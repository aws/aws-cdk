using Amazon.CDK;
using Amazon.CDK.AWS.ElasticLoadBalancing;
using AWS.Jsii.Runtime.Deputy;
using System.Collections.Generic;

namespace Amazon.CDK.AWS.ElasticLoadBalancing.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-elb.html </remarks>
    [JsiiClass(typeof(LoadBalancerResource_), "@aws-cdk/aws-elasticloadbalancing.cloudformation.LoadBalancerResource", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"properties\",\"type\":{\"fqn\":\"@aws-cdk/aws-elasticloadbalancing.cloudformation.LoadBalancerResourceProps\"}}]")]
    public class LoadBalancerResource_ : Resource
    {
        public LoadBalancerResource_(Construct parent, string name, ILoadBalancerResourceProps properties): base(new DeputyProps(new object[]{parent, name, properties}))
        {
        }

        protected LoadBalancerResource_(ByRefValue reference): base(reference)
        {
        }

        protected LoadBalancerResource_(DeputyProps props): base(props)
        {
        }

        /// <summary>The CloudFormation resource type name for this resource class.</summary>
        [JsiiProperty("resourceTypeName", "{\"primitive\":\"string\"}")]
        public static string ResourceTypeName
        {
            get;
        }

        = GetStaticProperty<string>(typeof(LoadBalancerResource_));
        /// <remarks>cloudformation_attribute: CanonicalHostedZoneName</remarks>
        [JsiiProperty("loadBalancerCanonicalHostedZoneName", "{\"fqn\":\"@aws-cdk/aws-elasticloadbalancing.LoadBalancerCanonicalHostedZoneName\"}")]
        public virtual LoadBalancerCanonicalHostedZoneName LoadBalancerCanonicalHostedZoneName
        {
            get => GetInstanceProperty<LoadBalancerCanonicalHostedZoneName>();
        }

        /// <remarks>cloudformation_attribute: CanonicalHostedZoneNameID</remarks>
        [JsiiProperty("loadBalancerCanonicalHostedZoneNameId", "{\"fqn\":\"@aws-cdk/aws-elasticloadbalancing.LoadBalancerCanonicalHostedZoneNameId\"}")]
        public virtual LoadBalancerCanonicalHostedZoneNameId LoadBalancerCanonicalHostedZoneNameId
        {
            get => GetInstanceProperty<LoadBalancerCanonicalHostedZoneNameId>();
        }

        /// <remarks>cloudformation_attribute: DNSName</remarks>
        [JsiiProperty("loadBalancerDnsName", "{\"fqn\":\"@aws-cdk/aws-elasticloadbalancing.LoadBalancerDnsName\"}")]
        public virtual LoadBalancerDnsName LoadBalancerDnsName
        {
            get => GetInstanceProperty<LoadBalancerDnsName>();
        }

        /// <remarks>cloudformation_attribute: SourceSecurityGroup.GroupName</remarks>
        [JsiiProperty("loadBalancerSourceSecurityGroupGroupName", "{\"fqn\":\"@aws-cdk/aws-elasticloadbalancing.LoadBalancerSourceSecurityGroupGroupName\"}")]
        public virtual LoadBalancerSourceSecurityGroupGroupName LoadBalancerSourceSecurityGroupGroupName
        {
            get => GetInstanceProperty<LoadBalancerSourceSecurityGroupGroupName>();
        }

        /// <remarks>cloudformation_attribute: SourceSecurityGroup.OwnerAlias</remarks>
        [JsiiProperty("loadBalancerSourceSecurityGroupOwnerAlias", "{\"fqn\":\"@aws-cdk/aws-elasticloadbalancing.LoadBalancerSourceSecurityGroupOwnerAlias\"}")]
        public virtual LoadBalancerSourceSecurityGroupOwnerAlias LoadBalancerSourceSecurityGroupOwnerAlias
        {
            get => GetInstanceProperty<LoadBalancerSourceSecurityGroupOwnerAlias>();
        }

        [JsiiMethod("renderProperties", "{\"collection\":{\"kind\":\"map\",\"elementtype\":{\"primitive\":\"any\"}}}", "[]")]
        protected override IDictionary<string, object> RenderProperties()
        {
            return InvokeInstanceMethod<IDictionary<string, object>>(new object[]{});
        }
    }
}