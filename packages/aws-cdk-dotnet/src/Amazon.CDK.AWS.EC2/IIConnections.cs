using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.EC2
{
    /// <summary>
    /// An object that encapsulates connection logic
    /// 
    /// The IConnections object both has knowledge on what peer to use,
    /// as well as how to add connection rules.
    /// </summary>
    [JsiiInterface(typeof(IIConnections), "@aws-cdk/aws-ec2.IConnections")]
    public interface IIConnections
    {
        /// <summary>
        /// Access to the peer that we're connecting to
        /// 
        /// It's convenient to put this on the Connections object since
        /// all participants in this protocol have one anyway, and the Connections
        /// objects have access to it, so they don't need to implement two interfaces.
        /// </summary>
        [JsiiProperty("connectionPeer", "{\"fqn\":\"@aws-cdk/aws-ec2.IConnectionPeer\"}")]
        IIConnectionPeer ConnectionPeer
        {
            get;
        }

        /// <summary>Allow connections to the peer on the given port</summary>
        [JsiiMethod("allowTo", null, "[{\"name\":\"other\",\"type\":{\"fqn\":\"@aws-cdk/aws-ec2.IConnectable\"}},{\"name\":\"portRange\",\"type\":{\"fqn\":\"@aws-cdk/aws-ec2.IPortRange\"}},{\"name\":\"description\",\"type\":{\"primitive\":\"string\"}}]")]
        void AllowTo(IIConnectable other, IIPortRange portRange, string description);
        /// <summary>Allow connections from the peer on the given port</summary>
        [JsiiMethod("allowFrom", null, "[{\"name\":\"other\",\"type\":{\"fqn\":\"@aws-cdk/aws-ec2.IConnectable\"}},{\"name\":\"portRange\",\"type\":{\"fqn\":\"@aws-cdk/aws-ec2.IPortRange\"}},{\"name\":\"description\",\"type\":{\"primitive\":\"string\"}}]")]
        void AllowFrom(IIConnectable other, IIPortRange portRange, string description);
    }
}