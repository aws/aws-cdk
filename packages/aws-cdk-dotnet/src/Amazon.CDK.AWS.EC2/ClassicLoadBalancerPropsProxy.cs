using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.EC2
{
    /// <summary>Construction properties for a ClassicLoadBalancer</summary>
    [JsiiInterfaceProxy(typeof(IClassicLoadBalancerProps), "@aws-cdk/aws-ec2.ClassicLoadBalancerProps")]
    internal class ClassicLoadBalancerPropsProxy : DeputyBase, IClassicLoadBalancerProps
    {
        private ClassicLoadBalancerPropsProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>VPC network of the fleet instances</summary>
        [JsiiProperty("vpc", "{\"fqn\":\"@aws-cdk/aws-ec2.VpcNetworkRef\"}")]
        public virtual VpcNetworkRef Vpc
        {
            get => GetInstanceProperty<VpcNetworkRef>();
            set => SetInstanceProperty(value);
        }

        /// <summary>
        /// Whether this is an internet-facing Load Balancer
        /// 
        /// This controls whether the LB has a public IP address assigned. It does
        /// not open up the Load Balancer's security groups to public internet access.
        /// </summary>
        /// <remarks>default: false</remarks>
        [JsiiProperty("internetFacing", "{\"primitive\":\"boolean\",\"optional\":true}")]
        public virtual bool? InternetFacing
        {
            get => GetInstanceProperty<bool? >();
            set => SetInstanceProperty(value);
        }

        /// <summary>
        /// What listeners to set up for the load balancer.
        /// 
        /// Can also be added by .addListener()
        /// </summary>
        [JsiiProperty("listeners", "{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"fqn\":\"@aws-cdk/aws-ec2.ClassicLoadBalancerListener\"}},\"optional\":true}")]
        public virtual IClassicLoadBalancerListener[] Listeners
        {
            get => GetInstanceProperty<IClassicLoadBalancerListener[]>();
            set => SetInstanceProperty(value);
        }

        /// <summary>
        /// What targets to load balance to.
        /// 
        /// Can also be added by .addTarget()
        /// </summary>
        [JsiiProperty("targets", "{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"fqn\":\"@aws-cdk/aws-ec2.IClassicLoadBalancerTarget\"}},\"optional\":true}")]
        public virtual IIClassicLoadBalancerTarget[] Targets
        {
            get => GetInstanceProperty<IIClassicLoadBalancerTarget[]>();
            set => SetInstanceProperty(value);
        }

        /// <summary>
        /// Health check settings for the load balancing targets.
        /// 
        /// Not required but recommended.
        /// </summary>
        [JsiiProperty("healthCheck", "{\"fqn\":\"@aws-cdk/aws-ec2.HealthCheck\",\"optional\":true}")]
        public virtual IHealthCheck HealthCheck
        {
            get => GetInstanceProperty<IHealthCheck>();
            set => SetInstanceProperty(value);
        }
    }
}