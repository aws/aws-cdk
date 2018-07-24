using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.EC2
{
    /// <summary>
    /// This object is used by peers who don't allow reverse connections
    /// 
    /// It still has an associated connection peer, but that peer does not
    /// have any security groups to add connections to.
    /// </summary>
    [JsiiClass(typeof(SecurityGrouplessConnections), "@aws-cdk/aws-ec2.SecurityGrouplessConnections", "[{\"name\":\"connectionPeer\",\"type\":{\"fqn\":\"@aws-cdk/aws-ec2.IConnectionPeer\"}}]")]
    public class SecurityGrouplessConnections : DeputyBase, IIConnections
    {
        public SecurityGrouplessConnections(IIConnectionPeer connectionPeer): base(new DeputyProps(new object[]{connectionPeer}))
        {
        }

        protected SecurityGrouplessConnections(ByRefValue reference): base(reference)
        {
        }

        protected SecurityGrouplessConnections(DeputyProps props): base(props)
        {
        }

        [JsiiProperty("connectionPeer", "{\"fqn\":\"@aws-cdk/aws-ec2.IConnectionPeer\"}")]
        public virtual IIConnectionPeer ConnectionPeer
        {
            get => GetInstanceProperty<IIConnectionPeer>();
        }

        /// <summary>Allow connections to the peer on the given port</summary>
        [JsiiMethod("allowTo", null, "[{\"name\":\"_other\",\"type\":{\"fqn\":\"@aws-cdk/aws-ec2.IConnectable\"}},{\"name\":\"_connection\",\"type\":{\"fqn\":\"@aws-cdk/aws-ec2.IPortRange\"}},{\"name\":\"_description\",\"type\":{\"primitive\":\"string\"}}]")]
        public virtual void AllowTo(IIConnectable _other, IIPortRange _connection, string _description)
        {
            InvokeInstanceVoidMethod(new object[]{_other, _connection, _description});
        }

        /// <summary>Allow connections from the peer on the given port</summary>
        [JsiiMethod("allowFrom", null, "[{\"name\":\"_other\",\"type\":{\"fqn\":\"@aws-cdk/aws-ec2.IConnectable\"}},{\"name\":\"_connection\",\"type\":{\"fqn\":\"@aws-cdk/aws-ec2.IPortRange\"}},{\"name\":\"_description\",\"type\":{\"primitive\":\"string\"}}]")]
        public virtual void AllowFrom(IIConnectable _other, IIPortRange _connection, string _description)
        {
            InvokeInstanceVoidMethod(new object[]{_other, _connection, _description});
        }
    }
}