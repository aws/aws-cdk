using Amazon.CDK;
using Amazon.CDK.AWS.ElasticLoadBalancing.cloudformation.LoadBalancerResource;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.ElasticLoadBalancing.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-elb.html </remarks>
    public class LoadBalancerResourceProps : DeputyBase, ILoadBalancerResourceProps
    {
        /// <summary>``AWS::ElasticLoadBalancing::LoadBalancer.Listeners``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-elb.html#cfn-ec2-elb-listeners </remarks>
        [JsiiProperty("listeners", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/aws-elasticloadbalancing.cloudformation.LoadBalancerResource.ListenersProperty\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}}}]}}", true)]
        public object Listeners
        {
            get;
            set;
        }

        /// <summary>``AWS::ElasticLoadBalancing::LoadBalancer.AccessLoggingPolicy``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-elb.html#cfn-ec2-elb-accessloggingpolicy </remarks>
        [JsiiProperty("accessLoggingPolicy", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-elasticloadbalancing.cloudformation.LoadBalancerResource.AccessLoggingPolicyProperty\"}]},\"optional\":true}", true)]
        public object AccessLoggingPolicy
        {
            get;
            set;
        }

        /// <summary>``AWS::ElasticLoadBalancing::LoadBalancer.AppCookieStickinessPolicy``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-elb.html#cfn-ec2-elb-appcookiestickinesspolicy </remarks>
        [JsiiProperty("appCookieStickinessPolicy", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-elasticloadbalancing.cloudformation.LoadBalancerResource.AppCookieStickinessPolicyProperty\"}]}}}}]},\"optional\":true}", true)]
        public object AppCookieStickinessPolicy
        {
            get;
            set;
        }

        /// <summary>``AWS::ElasticLoadBalancing::LoadBalancer.AvailabilityZones``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-elb.html#cfn-ec2-elb-availabilityzones </remarks>
        [JsiiProperty("availabilityZones", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}}}]},\"optional\":true}", true)]
        public object AvailabilityZones
        {
            get;
            set;
        }

        /// <summary>``AWS::ElasticLoadBalancing::LoadBalancer.ConnectionDrainingPolicy``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-elb.html#cfn-ec2-elb-connectiondrainingpolicy </remarks>
        [JsiiProperty("connectionDrainingPolicy", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-elasticloadbalancing.cloudformation.LoadBalancerResource.ConnectionDrainingPolicyProperty\"}]},\"optional\":true}", true)]
        public object ConnectionDrainingPolicy
        {
            get;
            set;
        }

        /// <summary>``AWS::ElasticLoadBalancing::LoadBalancer.ConnectionSettings``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-elb.html#cfn-ec2-elb-connectionsettings </remarks>
        [JsiiProperty("connectionSettings", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-elasticloadbalancing.cloudformation.LoadBalancerResource.ConnectionSettingsProperty\"}]},\"optional\":true}", true)]
        public object ConnectionSettings
        {
            get;
            set;
        }

        /// <summary>``AWS::ElasticLoadBalancing::LoadBalancer.CrossZone``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-elb.html#cfn-ec2-elb-crosszone </remarks>
        [JsiiProperty("crossZone", "{\"union\":{\"types\":[{\"primitive\":\"boolean\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object CrossZone
        {
            get;
            set;
        }

        /// <summary>``AWS::ElasticLoadBalancing::LoadBalancer.HealthCheck``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-elb.html#cfn-ec2-elb-healthcheck </remarks>
        [JsiiProperty("healthCheck", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-elasticloadbalancing.cloudformation.LoadBalancerResource.HealthCheckProperty\"}]},\"optional\":true}", true)]
        public object HealthCheck
        {
            get;
            set;
        }

        /// <summary>``AWS::ElasticLoadBalancing::LoadBalancer.Instances``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-elb.html#cfn-ec2-elb-instances </remarks>
        [JsiiProperty("instances", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}}}]},\"optional\":true}", true)]
        public object Instances
        {
            get;
            set;
        }

        /// <summary>``AWS::ElasticLoadBalancing::LoadBalancer.LBCookieStickinessPolicy``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-elb.html#cfn-ec2-elb-lbcookiestickinesspolicy </remarks>
        [JsiiProperty("lbCookieStickinessPolicy", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-elasticloadbalancing.cloudformation.LoadBalancerResource.LBCookieStickinessPolicyProperty\"}]}}}}]},\"optional\":true}", true)]
        public object LbCookieStickinessPolicy
        {
            get;
            set;
        }

        /// <summary>``AWS::ElasticLoadBalancing::LoadBalancer.LoadBalancerName``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-elb.html#cfn-ec2-elb-elbname </remarks>
        [JsiiProperty("loadBalancerName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object LoadBalancerName
        {
            get;
            set;
        }

        /// <summary>``AWS::ElasticLoadBalancing::LoadBalancer.Policies``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-elb.html#cfn-ec2-elb-policies </remarks>
        [JsiiProperty("policies", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-elasticloadbalancing.cloudformation.LoadBalancerResource.PoliciesProperty\"}]}}}}]},\"optional\":true}", true)]
        public object Policies
        {
            get;
            set;
        }

        /// <summary>``AWS::ElasticLoadBalancing::LoadBalancer.Scheme``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-elb.html#cfn-ec2-elb-scheme </remarks>
        [JsiiProperty("scheme", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object Scheme
        {
            get;
            set;
        }

        /// <summary>``AWS::ElasticLoadBalancing::LoadBalancer.SecurityGroups``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-elb.html#cfn-ec2-elb-securitygroups </remarks>
        [JsiiProperty("securityGroups", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}}}]},\"optional\":true}", true)]
        public object SecurityGroups
        {
            get;
            set;
        }

        /// <summary>``AWS::ElasticLoadBalancing::LoadBalancer.Subnets``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-elb.html#cfn-ec2-elb-subnets </remarks>
        [JsiiProperty("subnets", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}}}]},\"optional\":true}", true)]
        public object Subnets
        {
            get;
            set;
        }

        /// <summary>``AWS::ElasticLoadBalancing::LoadBalancer.Tags``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-elb.html#cfn-elasticloadbalancing-loadbalancer-tags </remarks>
        [JsiiProperty("tags", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/cdk.Tag\"}]}}}}]},\"optional\":true}", true)]
        public object Tags
        {
            get;
            set;
        }
    }
}