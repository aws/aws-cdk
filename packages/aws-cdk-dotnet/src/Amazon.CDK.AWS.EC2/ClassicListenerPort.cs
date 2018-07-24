using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.EC2
{
    /// <summary>
    /// Reference to a listener's port just created
    /// 
    /// This class exists to make it convenient to add port ranges to the load
    /// balancer's security group just for the port ranges that are involved in the
    /// listener.
    /// </summary>
    [JsiiClass(typeof(ClassicListenerPort), "@aws-cdk/aws-ec2.ClassicListenerPort", "[{\"name\":\"securityGroup\",\"type\":{\"fqn\":\"@aws-cdk/aws-ec2.ISecurityGroup\"}},{\"name\":\"defaultPortRange\",\"type\":{\"fqn\":\"@aws-cdk/aws-ec2.IPortRange\"}}]")]
    public class ClassicListenerPort : DeputyBase, IIDefaultConnectable
    {
        public ClassicListenerPort(IISecurityGroup securityGroup, IIPortRange defaultPortRange): base(new DeputyProps(new object[]{securityGroup, defaultPortRange}))
        {
        }

        protected ClassicListenerPort(ByRefValue reference): base(reference)
        {
        }

        protected ClassicListenerPort(DeputyProps props): base(props)
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