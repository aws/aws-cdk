using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.EC2
{
    /// <summary>Construction properties for a ClassicLoadBalancer</summary>
    public class ClassicLoadBalancerProps : DeputyBase, IClassicLoadBalancerProps
    {
        /// <summary>VPC network of the fleet instances</summary>
        [JsiiProperty("vpc", "{\"fqn\":\"@aws-cdk/aws-ec2.VpcNetworkRef\"}", true)]
        public VpcNetworkRef Vpc
        {
            get;
            set;
        }

        /// <summary>
        /// Whether this is an internet-facing Load Balancer
        /// 
        /// This controls whether the LB has a public IP address assigned. It does
        /// not open up the Load Balancer's security groups to public internet access.
        /// </summary>
        /// <remarks>default: false</remarks>
        [JsiiProperty("internetFacing", "{\"primitive\":\"boolean\",\"optional\":true}", true)]
        public bool? InternetFacing
        {
            get;
            set;
        }

        /// <summary>
        /// What listeners to set up for the load balancer.
        /// 
        /// Can also be added by .addListener()
        /// </summary>
        [JsiiProperty("listeners", "{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"fqn\":\"@aws-cdk/aws-ec2.ClassicLoadBalancerListener\"}},\"optional\":true}", true)]
        public IClassicLoadBalancerListener[] Listeners
        {
            get;
            set;
        }

        /// <summary>
        /// What targets to load balance to.
        /// 
        /// Can also be added by .addTarget()
        /// </summary>
        [JsiiProperty("targets", "{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"fqn\":\"@aws-cdk/aws-ec2.IClassicLoadBalancerTarget\"}},\"optional\":true}", true)]
        public IIClassicLoadBalancerTarget[] Targets
        {
            get;
            set;
        }

        /// <summary>
        /// Health check settings for the load balancing targets.
        /// 
        /// Not required but recommended.
        /// </summary>
        [JsiiProperty("healthCheck", "{\"fqn\":\"@aws-cdk/aws-ec2.HealthCheck\",\"optional\":true}", true)]
        public IHealthCheck HealthCheck
        {
            get;
            set;
        }
    }
}