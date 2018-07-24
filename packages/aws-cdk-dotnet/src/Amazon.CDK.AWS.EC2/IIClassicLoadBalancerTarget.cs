using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.EC2
{
    /// <summary>Interface that is going to be implemented by constructs that you can load balance to</summary>
    [JsiiInterface(typeof(IIClassicLoadBalancerTarget), "@aws-cdk/aws-ec2.IClassicLoadBalancerTarget")]
    public interface IIClassicLoadBalancerTarget : IIConnectable
    {
        /// <summary>Attach load-balanced target to a classic ELB</summary>
        [JsiiMethod("attachToClassicLB", null, "[{\"name\":\"loadBalancer\",\"type\":{\"fqn\":\"@aws-cdk/aws-ec2.ClassicLoadBalancer\"}}]")]
        void AttachToClassicLB(ClassicLoadBalancer loadBalancer);
    }
}