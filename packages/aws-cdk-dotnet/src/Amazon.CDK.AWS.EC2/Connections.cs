using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.EC2
{
    /// <summary>Connections for an object that does not have default ports</summary>
    [JsiiClass(typeof(Connections), "@aws-cdk/aws-ec2.Connections", "[{\"name\":\"securityGroup\",\"type\":{\"fqn\":\"@aws-cdk/aws-ec2.ISecurityGroup\"}}]")]
    public class Connections : DeputyBase, IIConnections
    {
        public Connections(IISecurityGroup securityGroup): base(new DeputyProps(new object[]{securityGroup}))
        {
        }

        protected Connections(ByRefValue reference): base(reference)
        {
        }

        protected Connections(DeputyProps props): base(props)
        {
        }

        /// <summary>
        /// Access to the peer that we're connecting to
        /// 
        /// It's convenient to put this on the Connections object since
        /// all participants in this protocol have one anyway, and the Connections
        /// objects have access to it, so they don't need to implement two interfaces.
        /// </summary>
        [JsiiProperty("connectionPeer", "{\"fqn\":\"@aws-cdk/aws-ec2.IConnectionPeer\"}")]
        public virtual IIConnectionPeer ConnectionPeer
        {
            get => GetInstanceProperty<IIConnectionPeer>();
        }

        /// <summary>Allow connections to the peer on their default port</summary>
        [JsiiMethod("allowToDefaultPort", null, "[{\"name\":\"other\",\"type\":{\"fqn\":\"@aws-cdk/aws-ec2.IDefaultConnectable\"}},{\"name\":\"description\",\"type\":{\"primitive\":\"string\"}}]")]
        public virtual void AllowToDefaultPort(IIDefaultConnectable other, string description)
        {
            InvokeInstanceVoidMethod(new object[]{other, description});
        }

        /// <summary>Allow connections to the peer on the given port</summary>
        [JsiiMethod("allowTo", null, "[{\"name\":\"other\",\"type\":{\"fqn\":\"@aws-cdk/aws-ec2.IConnectable\"}},{\"name\":\"portRange\",\"type\":{\"fqn\":\"@aws-cdk/aws-ec2.IPortRange\"}},{\"name\":\"description\",\"type\":{\"primitive\":\"string\"}}]")]
        public virtual void AllowTo(IIConnectable other, IIPortRange portRange, string description)
        {
            InvokeInstanceVoidMethod(new object[]{other, portRange, description});
        }

        /// <summary>Allow connections from the peer on the given port</summary>
        [JsiiMethod("allowFrom", null, "[{\"name\":\"other\",\"type\":{\"fqn\":\"@aws-cdk/aws-ec2.IConnectable\"}},{\"name\":\"portRange\",\"type\":{\"fqn\":\"@aws-cdk/aws-ec2.IPortRange\"}},{\"name\":\"description\",\"type\":{\"primitive\":\"string\"}}]")]
        public virtual void AllowFrom(IIConnectable other, IIPortRange portRange, string description)
        {
            InvokeInstanceVoidMethod(new object[]{other, portRange, description});
        }

        /// <summary>Allow hosts inside the security group to connect to each other on the given port</summary>
        [JsiiMethod("allowInternally", null, "[{\"name\":\"portRange\",\"type\":{\"fqn\":\"@aws-cdk/aws-ec2.IPortRange\"}},{\"name\":\"description\",\"type\":{\"primitive\":\"string\"}}]")]
        public virtual void AllowInternally(IIPortRange portRange, string description)
        {
            InvokeInstanceVoidMethod(new object[]{portRange, description});
        }

        /// <summary>Allow to all IPv4 ranges</summary>
        [JsiiMethod("allowToAnyIpv4", null, "[{\"name\":\"portRange\",\"type\":{\"fqn\":\"@aws-cdk/aws-ec2.IPortRange\"}},{\"name\":\"description\",\"type\":{\"primitive\":\"string\"}}]")]
        public virtual void AllowToAnyIpv4(IIPortRange portRange, string description)
        {
            InvokeInstanceVoidMethod(new object[]{portRange, description});
        }

        /// <summary>Allow from any IPv4 ranges</summary>
        [JsiiMethod("allowFromAnyIpv4", null, "[{\"name\":\"portRange\",\"type\":{\"fqn\":\"@aws-cdk/aws-ec2.IPortRange\"}},{\"name\":\"description\",\"type\":{\"primitive\":\"string\"}}]")]
        public virtual void AllowFromAnyIpv4(IIPortRange portRange, string description)
        {
            InvokeInstanceVoidMethod(new object[]{portRange, description});
        }
    }
}