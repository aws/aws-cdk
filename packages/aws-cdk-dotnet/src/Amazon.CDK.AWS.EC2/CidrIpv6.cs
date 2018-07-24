using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.EC2
{
    /// <summary>A connection to a from a given IPv6 range</summary>
    [JsiiClass(typeof(CidrIpv6), "@aws-cdk/aws-ec2.CidrIpv6", "[{\"name\":\"cidrIpv6\",\"type\":{\"primitive\":\"string\"}}]")]
    public class CidrIpv6 : DeputyBase, IIConnectionPeer, IIConnectable
    {
        public CidrIpv6(string cidrIpv6): base(new DeputyProps(new object[]{cidrIpv6}))
        {
        }

        protected CidrIpv6(ByRefValue reference): base(reference)
        {
        }

        protected CidrIpv6(DeputyProps props): base(props)
        {
        }

        /// <summary>Whether the rule can be inlined into a SecurityGroup or not</summary>
        [JsiiProperty("canInlineRule", "{\"primitive\":\"boolean\"}")]
        public virtual bool CanInlineRule
        {
            get => GetInstanceProperty<bool>();
        }

        [JsiiProperty("connections", "{\"fqn\":\"@aws-cdk/aws-ec2.IConnections\"}")]
        public virtual IIConnections Connections
        {
            get => GetInstanceProperty<IIConnections>();
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