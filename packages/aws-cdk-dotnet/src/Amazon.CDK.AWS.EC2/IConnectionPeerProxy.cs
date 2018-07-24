using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.EC2
{
    /// <summary>Interface for classes that provide the peer-specification parts of a security group rule</summary>
    [JsiiInterfaceProxy(typeof(IIConnectionPeer), "@aws-cdk/aws-ec2.IConnectionPeer")]
    internal class IConnectionPeerProxy : DeputyBase, IIConnectionPeer
    {
        private IConnectionPeerProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>Whether the rule can be inlined into a SecurityGroup or not</summary>
        [JsiiProperty("canInlineRule", "{\"primitive\":\"boolean\"}")]
        public virtual bool CanInlineRule
        {
            get => GetInstanceProperty<bool>();
        }

        /// <summary>Produce the ingress rule JSON for the given connection</summary>
        [JsiiMethod("toIngressRuleJSON", "{\"primitive\":\"any\"}", "[]")]
        public virtual object ToIngressRuleJSON()
        {
            return InvokeInstanceMethod<object>(new object[]{});
        }

        /// <summary>Produce the egress rule JSON for the given connection</summary>
        [JsiiMethod("toEgressRuleJSON", "{\"primitive\":\"any\"}", "[]")]
        public virtual object ToEgressRuleJSON()
        {
            return InvokeInstanceMethod<object>(new object[]{});
        }
    }
}