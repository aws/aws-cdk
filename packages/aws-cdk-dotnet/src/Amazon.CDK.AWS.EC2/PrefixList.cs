using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.EC2
{
    /// <summary>
    /// A prefix list
    /// 
    /// Prefix lists are used to allow traffic to VPC-local service endpoints.
    /// 
    /// For more information, see this page:
    /// 
    /// https://docs.aws.amazon.com/AmazonVPC/latest/UserGuide/vpc-endpoints.html
    /// </summary>
    [JsiiClass(typeof(PrefixList), "@aws-cdk/aws-ec2.PrefixList", "[{\"name\":\"prefixListId\",\"type\":{\"primitive\":\"string\"}}]")]
    public class PrefixList : DeputyBase, IIConnectionPeer, IIConnectable
    {
        public PrefixList(string prefixListId): base(new DeputyProps(new object[]{prefixListId}))
        {
        }

        protected PrefixList(ByRefValue reference): base(reference)
        {
        }

        protected PrefixList(DeputyProps props): base(props)
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