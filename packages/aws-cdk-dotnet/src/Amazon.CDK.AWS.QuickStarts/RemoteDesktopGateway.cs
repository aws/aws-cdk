using Amazon.CDK;
using Amazon.CDK.AWS.EC2;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.QuickStarts
{
    /// <summary>Embed the Remote Desktop Gateway AWS QuickStart</summary>
    [JsiiClass(typeof(RemoteDesktopGateway), "@aws-cdk/aws-quickstarts.RemoteDesktopGateway", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"props\",\"type\":{\"fqn\":\"@aws-cdk/aws-quickstarts.RemoteDesktopGatewayProps\"}}]")]
    public class RemoteDesktopGateway : Construct, IIDefaultConnectable
    {
        public RemoteDesktopGateway(Construct parent, string name, IRemoteDesktopGatewayProps props): base(new DeputyProps(new object[]{parent, name, props}))
        {
        }

        protected RemoteDesktopGateway(ByRefValue reference): base(reference)
        {
        }

        protected RemoteDesktopGateway(DeputyProps props): base(props)
        {
        }

        [JsiiProperty("connections", "{\"fqn\":\"@aws-cdk/aws-ec2.IConnections\"}")]
        public virtual IIConnections Connections
        {
            get => GetInstanceProperty<IIConnections>();
        }

        [JsiiProperty("defaultPortRange", "{\"fqn\":\"@aws-cdk/aws-ec2.IPortRange\"}")]
        public virtual IIPortRange DefaultPortRange
        {
            get => GetInstanceProperty<IIPortRange>();
        }
    }
}