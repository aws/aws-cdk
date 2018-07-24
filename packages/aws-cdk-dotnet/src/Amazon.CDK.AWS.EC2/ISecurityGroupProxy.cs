using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.EC2
{
    /// <summary>Basic interface for security groups</summary>
    [JsiiInterfaceProxy(typeof(IISecurityGroup), "@aws-cdk/aws-ec2.ISecurityGroup")]
    internal class ISecurityGroupProxy : DeputyBase, IISecurityGroup
    {
        private ISecurityGroupProxy(ByRefValue reference): base(reference)
        {
        }

        [JsiiProperty("securityGroupId", "{\"fqn\":\"@aws-cdk/aws-ec2.SecurityGroupId\"}")]
        public virtual SecurityGroupId SecurityGroupId
        {
            get => GetInstanceProperty<SecurityGroupId>();
        }

        /// <summary>Whether the rule can be inlined into a SecurityGroup or not</summary>
        [JsiiProperty("canInlineRule", "{\"primitive\":\"boolean\"}")]
        public virtual bool CanInlineRule
        {
            get => GetInstanceProperty<bool>();
        }

        [JsiiMethod("addIngressRule", null, "[{\"name\":\"peer\",\"type\":{\"fqn\":\"@aws-cdk/aws-ec2.IConnectionPeer\"}},{\"name\":\"connection\",\"type\":{\"fqn\":\"@aws-cdk/aws-ec2.IPortRange\"}},{\"name\":\"description\",\"type\":{\"primitive\":\"string\"}}]")]
        public virtual void AddIngressRule(IIConnectionPeer peer, IIPortRange connection, string description)
        {
            InvokeInstanceVoidMethod(new object[]{peer, connection, description});
        }

        [JsiiMethod("addEgressRule", null, "[{\"name\":\"peer\",\"type\":{\"fqn\":\"@aws-cdk/aws-ec2.IConnectionPeer\"}},{\"name\":\"connection\",\"type\":{\"fqn\":\"@aws-cdk/aws-ec2.IPortRange\"}},{\"name\":\"description\",\"type\":{\"primitive\":\"string\"}}]")]
        public virtual void AddEgressRule(IIConnectionPeer peer, IIPortRange connection, string description)
        {
            InvokeInstanceVoidMethod(new object[]{peer, connection, description});
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