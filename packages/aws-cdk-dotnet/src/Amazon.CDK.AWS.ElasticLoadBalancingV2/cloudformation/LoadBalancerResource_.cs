using Amazon.CDK;
using Amazon.CDK.AWS.ElasticLoadBalancingV2;
using AWS.Jsii.Runtime.Deputy;
using System.Collections.Generic;

namespace Amazon.CDK.AWS.ElasticLoadBalancingV2.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-loadbalancer.html </remarks>
    [JsiiClass(typeof(LoadBalancerResource_), "@aws-cdk/aws-elasticloadbalancingv2.cloudformation.LoadBalancerResource", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"properties\",\"type\":{\"fqn\":\"@aws-cdk/aws-elasticloadbalancingv2.cloudformation.LoadBalancerResourceProps\",\"optional\":true}}]")]
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
        /// <remarks>cloudformation_attribute: CanonicalHostedZoneID</remarks>
        [JsiiProperty("loadBalancerCanonicalHostedZoneId", "{\"fqn\":\"@aws-cdk/aws-elasticloadbalancingv2.LoadBalancerCanonicalHostedZoneId\"}")]
        public virtual LoadBalancerCanonicalHostedZoneId LoadBalancerCanonicalHostedZoneId
        {
            get => GetInstanceProperty<LoadBalancerCanonicalHostedZoneId>();
        }

        /// <remarks>cloudformation_attribute: DNSName</remarks>
        [JsiiProperty("loadBalancerDnsName", "{\"fqn\":\"@aws-cdk/aws-elasticloadbalancingv2.LoadBalancerDnsName\"}")]
        public virtual LoadBalancerDnsName LoadBalancerDnsName
        {
            get => GetInstanceProperty<LoadBalancerDnsName>();
        }

        /// <remarks>cloudformation_attribute: LoadBalancerFullName</remarks>
        [JsiiProperty("loadBalancerFullName", "{\"fqn\":\"@aws-cdk/aws-elasticloadbalancingv2.LoadBalancerFullName\"}")]
        public virtual LoadBalancerFullName LoadBalancerFullName
        {
            get => GetInstanceProperty<LoadBalancerFullName>();
        }

        /// <remarks>cloudformation_attribute: LoadBalancerName</remarks>
        [JsiiProperty("loadBalancerName", "{\"fqn\":\"@aws-cdk/aws-elasticloadbalancingv2.LoadBalancerName\"}")]
        public virtual LoadBalancerName LoadBalancerName
        {
            get => GetInstanceProperty<LoadBalancerName>();
        }

        /// <remarks>cloudformation_attribute: SecurityGroups</remarks>
        [JsiiProperty("loadBalancerSecurityGroups", "{\"fqn\":\"@aws-cdk/aws-elasticloadbalancingv2.LoadBalancerSecurityGroups\"}")]
        public virtual LoadBalancerSecurityGroups LoadBalancerSecurityGroups
        {
            get => GetInstanceProperty<LoadBalancerSecurityGroups>();
        }

        [JsiiMethod("renderProperties", "{\"collection\":{\"kind\":\"map\",\"elementtype\":{\"primitive\":\"any\"}}}", "[]")]
        protected override IDictionary<string, object> RenderProperties()
        {
            return InvokeInstanceMethod<IDictionary<string, object>>(new object[]{});
        }
    }
}