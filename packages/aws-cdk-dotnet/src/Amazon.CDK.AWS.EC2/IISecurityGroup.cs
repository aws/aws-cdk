using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.EC2
{
    /// <summary>Basic interface for security groups</summary>
    [JsiiInterface(typeof(IISecurityGroup), "@aws-cdk/aws-ec2.ISecurityGroup")]
    public interface IISecurityGroup : IIConnectionPeer
    {
        [JsiiProperty("securityGroupId", "{\"fqn\":\"@aws-cdk/aws-ec2.SecurityGroupId\"}")]
        SecurityGroupId SecurityGroupId
        {
            get;
        }

        [JsiiMethod("addIngressRule", null, "[{\"name\":\"peer\",\"type\":{\"fqn\":\"@aws-cdk/aws-ec2.IConnectionPeer\"}},{\"name\":\"connection\",\"type\":{\"fqn\":\"@aws-cdk/aws-ec2.IPortRange\"}},{\"name\":\"description\",\"type\":{\"primitive\":\"string\"}}]")]
        void AddIngressRule(IIConnectionPeer peer, IIPortRange connection, string description);
        [JsiiMethod("addEgressRule", null, "[{\"name\":\"peer\",\"type\":{\"fqn\":\"@aws-cdk/aws-ec2.IConnectionPeer\"}},{\"name\":\"connection\",\"type\":{\"fqn\":\"@aws-cdk/aws-ec2.IPortRange\"}},{\"name\":\"description\",\"type\":{\"primitive\":\"string\"}}]")]
        void AddEgressRule(IIConnectionPeer peer, IIPortRange connection, string description);
    }
}