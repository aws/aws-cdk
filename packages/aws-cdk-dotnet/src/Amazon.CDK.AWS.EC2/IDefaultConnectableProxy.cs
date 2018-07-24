using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.EC2
{
    /// <summary>An object that has a Connections object as well as a default port range.</summary>
    [JsiiInterfaceProxy(typeof(IIDefaultConnectable), "@aws-cdk/aws-ec2.IDefaultConnectable")]
    internal class IDefaultConnectableProxy : DeputyBase, IIDefaultConnectable
    {
        private IDefaultConnectableProxy(ByRefValue reference): base(reference)
        {
        }

        [JsiiProperty("defaultPortRange", "{\"fqn\":\"@aws-cdk/aws-ec2.IPortRange\"}")]
        public virtual IIPortRange DefaultPortRange
        {
            get => GetInstanceProperty<IIPortRange>();
        }

        [JsiiProperty("connections", "{\"fqn\":\"@aws-cdk/aws-ec2.IConnections\"}")]
        public virtual IIConnections Connections
        {
            get => GetInstanceProperty<IIConnections>();
        }
    }
}