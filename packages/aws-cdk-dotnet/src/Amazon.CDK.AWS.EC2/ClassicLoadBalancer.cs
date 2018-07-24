using Amazon.CDK;
using Amazon.CDK.AWS.ElasticLoadBalancing;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.EC2
{
    /// <summary>
    /// A load balancer with a single listener
    /// 
    /// Routes to a fleet of of instances in a VPC.
    /// </summary>
    [JsiiClass(typeof(ClassicLoadBalancer), "@aws-cdk/aws-ec2.ClassicLoadBalancer", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"props\",\"type\":{\"fqn\":\"@aws-cdk/aws-ec2.ClassicLoadBalancerProps\"}}]")]
    public class ClassicLoadBalancer : Construct, IIConnectable
    {
        public ClassicLoadBalancer(Construct parent, string name, IClassicLoadBalancerProps props): base(new DeputyProps(new object[]{parent, name, props}))
        {
        }

        protected ClassicLoadBalancer(ByRefValue reference): base(reference)
        {
        }

        protected ClassicLoadBalancer(DeputyProps props): base(props)
        {
        }

        /// <summary>Control all connections from and to this load balancer</summary>
        [JsiiProperty("connections", "{\"fqn\":\"@aws-cdk/aws-ec2.IConnections\"}")]
        public virtual IIConnections Connections
        {
            get => GetInstanceProperty<IIConnections>();
        }

        [JsiiProperty("connectionPeer", "{\"fqn\":\"@aws-cdk/aws-ec2.IConnectionPeer\"}")]
        public virtual IIConnectionPeer ConnectionPeer
        {
            get => GetInstanceProperty<IIConnectionPeer>();
        }

        /// <summary>An object controlling specifically the connections for each listener added to this load balancer</summary>
        [JsiiProperty("listenerPorts", "{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"fqn\":\"@aws-cdk/aws-ec2.ClassicListenerPort\"}}}")]
        public virtual ClassicListenerPort[] ListenerPorts
        {
            get => GetInstanceProperty<ClassicListenerPort[]>();
        }

        [JsiiProperty("loadBalancerName", "{\"fqn\":\"@aws-cdk/cdk.Token\"}")]
        public virtual Token LoadBalancerName
        {
            get => GetInstanceProperty<Token>();
        }

        [JsiiProperty("loadBalancerCanonicalHostedZoneName", "{\"fqn\":\"@aws-cdk/aws-elasticloadbalancing.LoadBalancerCanonicalHostedZoneName\"}")]
        public virtual LoadBalancerCanonicalHostedZoneName LoadBalancerCanonicalHostedZoneName
        {
            get => GetInstanceProperty<LoadBalancerCanonicalHostedZoneName>();
        }

        [JsiiProperty("loadBalancerDnsName", "{\"fqn\":\"@aws-cdk/aws-elasticloadbalancing.LoadBalancerDnsName\"}")]
        public virtual LoadBalancerDnsName LoadBalancerDnsName
        {
            get => GetInstanceProperty<LoadBalancerDnsName>();
        }

        [JsiiProperty("loadBalancerSourceSecurityGroupGroupName", "{\"fqn\":\"@aws-cdk/aws-elasticloadbalancing.LoadBalancerSourceSecurityGroupGroupName\"}")]
        public virtual LoadBalancerSourceSecurityGroupGroupName LoadBalancerSourceSecurityGroupGroupName
        {
            get => GetInstanceProperty<LoadBalancerSourceSecurityGroupGroupName>();
        }

        [JsiiProperty("loadBalancerSourceSecurityGroupOwnerAlias", "{\"fqn\":\"@aws-cdk/aws-elasticloadbalancing.LoadBalancerSourceSecurityGroupOwnerAlias\"}")]
        public virtual LoadBalancerSourceSecurityGroupOwnerAlias LoadBalancerSourceSecurityGroupOwnerAlias
        {
            get => GetInstanceProperty<LoadBalancerSourceSecurityGroupOwnerAlias>();
        }

        /// <summary>Add a backend to the load balancer</summary>
        /// <returns>A ClassicListenerPort object that controls connections to the listener port</returns>
        [JsiiMethod("addListener", "{\"fqn\":\"@aws-cdk/aws-ec2.ClassicListenerPort\"}", "[{\"name\":\"listener\",\"type\":{\"fqn\":\"@aws-cdk/aws-ec2.ClassicLoadBalancerListener\"}}]")]
        public virtual ClassicListenerPort AddListener(IClassicLoadBalancerListener listener)
        {
            return InvokeInstanceMethod<ClassicListenerPort>(new object[]{listener});
        }

        [JsiiMethod("addTarget", null, "[{\"name\":\"target\",\"type\":{\"fqn\":\"@aws-cdk/aws-ec2.IClassicLoadBalancerTarget\"}}]")]
        public virtual void AddTarget(IIClassicLoadBalancerTarget target)
        {
            InvokeInstanceVoidMethod(new object[]{target});
        }
    }
}