using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.EC2
{
    /// <summary>
    /// Creates an Amazon EC2 security group within a VPC.
    /// 
    /// This class has an additional optimization over SecurityGroupRef that it can also create
    /// inline ingress and egress rule (which saves on the total number of resources inside
    /// the template).
    /// </summary>
    [JsiiClass(typeof(SecurityGroup), "@aws-cdk/aws-ec2.SecurityGroup", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"props\",\"type\":{\"fqn\":\"@aws-cdk/aws-ec2.SecurityGroupProps\"}}]")]
    public class SecurityGroup : SecurityGroupRef
    {
        public SecurityGroup(Construct parent, string name, ISecurityGroupProps props): base(new DeputyProps(new object[]{parent, name, props}))
        {
        }

        protected SecurityGroup(ByRefValue reference): base(reference)
        {
        }

        protected SecurityGroup(DeputyProps props): base(props)
        {
        }

        /// <summary>An attribute that represents the security group name.</summary>
        [JsiiProperty("groupName", "{\"fqn\":\"@aws-cdk/aws-ec2.SecurityGroupName\"}")]
        public virtual SecurityGroupName GroupName
        {
            get => GetInstanceProperty<SecurityGroupName>();
        }

        /// <summary>An attribute that represents the physical VPC ID this security group is part of.</summary>
        [JsiiProperty("vpcId", "{\"fqn\":\"@aws-cdk/aws-ec2.SecurityGroupVpcId\"}")]
        public virtual SecurityGroupVpcId VpcId
        {
            get => GetInstanceProperty<SecurityGroupVpcId>();
        }

        [JsiiMethod("addIngressRule", null, "[{\"name\":\"peer\",\"type\":{\"fqn\":\"@aws-cdk/aws-ec2.IConnectionPeer\"}},{\"name\":\"connection\",\"type\":{\"fqn\":\"@aws-cdk/aws-ec2.IPortRange\"}},{\"name\":\"description\",\"type\":{\"primitive\":\"string\"}}]")]
        public override void AddIngressRule(IIConnectionPeer peer, IIPortRange connection, string description)
        {
            InvokeInstanceVoidMethod(new object[]{peer, connection, description});
        }

        [JsiiMethod("addEgressRule", null, "[{\"name\":\"peer\",\"type\":{\"fqn\":\"@aws-cdk/aws-ec2.IConnectionPeer\"}},{\"name\":\"connection\",\"type\":{\"fqn\":\"@aws-cdk/aws-ec2.IPortRange\"}},{\"name\":\"description\",\"type\":{\"primitive\":\"string\"}}]")]
        public override void AddEgressRule(IIConnectionPeer peer, IIPortRange connection, string description)
        {
            InvokeInstanceVoidMethod(new object[]{peer, connection, description});
        }
    }
}