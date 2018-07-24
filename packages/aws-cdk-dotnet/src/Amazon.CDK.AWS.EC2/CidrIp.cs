using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.EC2
{
    /// <summary>A connection to and from a given IP range</summary>
    [JsiiClass(typeof(CidrIp), "@aws-cdk/aws-ec2.CidrIp", "[{\"name\":\"cidrIp\",\"type\":{\"primitive\":\"string\"}}]")]
    public class CidrIp : DeputyBase, IIConnectionPeer, IIConnectable
    {
        public CidrIp(string cidrIp): base(new DeputyProps(new object[]{cidrIp}))
        {
        }

        protected CidrIp(ByRefValue reference): base(reference)
        {
        }

        protected CidrIp(DeputyProps props): base(props)
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