using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.EC2
{
    /// <summary>A SecurityGroup that is not created in this template</summary>
    [JsiiClass(typeof(SecurityGroupRef), "@aws-cdk/aws-ec2.SecurityGroupRef", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"props\",\"type\":{\"fqn\":\"@aws-cdk/aws-ec2.SecurityGroupRefProps\"}}]")]
    public class SecurityGroupRef : Construct, IISecurityGroup
    {
        public SecurityGroupRef(Construct parent, string name, ISecurityGroupRefProps props): base(new DeputyProps(new object[]{parent, name, props}))
        {
        }

        protected SecurityGroupRef(ByRefValue reference): base(reference)
        {
        }

        protected SecurityGroupRef(DeputyProps props): base(props)
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