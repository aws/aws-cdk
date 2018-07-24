using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.EC2
{
    /// <summary>An object that has a Connections object as well as a default port range.</summary>
    public class IDefaultConnectable : DeputyBase, IIDefaultConnectable
    {
        [JsiiProperty("defaultPortRange", "{\"fqn\":\"@aws-cdk/aws-ec2.IPortRange\"}", true)]
        public IIPortRange DefaultPortRange
        {
            get;
        }

        [JsiiProperty("connections", "{\"fqn\":\"@aws-cdk/aws-ec2.IConnections\"}", true)]
        public IIConnections Connections
        {
            get;
        }
    }
}