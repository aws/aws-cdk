using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.EC2
{
    /// <summary>Interface that is going to be implemented by constructs that you can load balance to</summary>
    [JsiiInterfaceProxy(typeof(IIClassicLoadBalancerTarget), "@aws-cdk/aws-ec2.IClassicLoadBalancerTarget")]
    internal class IClassicLoadBalancerTargetProxy : DeputyBase, IIClassicLoadBalancerTarget
    {
        private IClassicLoadBalancerTargetProxy(ByRefValue reference): base(reference)
        {
        }

        [JsiiProperty("connections", "{\"fqn\":\"@aws-cdk/aws-ec2.IConnections\"}")]
        public virtual IIConnections Connections
        {
            get => GetInstanceProperty<IIConnections>();
        }

        /// <summary>Attach load-balanced target to a classic ELB</summary>
        [JsiiMethod("attachToClassicLB", null, "[{\"name\":\"loadBalancer\",\"type\":{\"fqn\":\"@aws-cdk/aws-ec2.ClassicLoadBalancer\"}}]")]
        public virtual void AttachToClassicLB(ClassicLoadBalancer loadBalancer)
        {
            InvokeInstanceVoidMethod(new object[]{loadBalancer});
        }
    }
}