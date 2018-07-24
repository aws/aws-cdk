using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.EC2
{
    /// <summary>A class to orchestrate connections that already has default ports</summary>
    [JsiiClass(typeof(DefaultConnections), "@aws-cdk/aws-ec2.DefaultConnections", "[{\"name\":\"securityGroup\",\"type\":{\"fqn\":\"@aws-cdk/aws-ec2.ISecurityGroup\"}},{\"name\":\"defaultPortRangeProvider\",\"type\":{\"fqn\":\"@aws-cdk/aws-ec2.IDefaultConnectable\"}}]")]
    public class DefaultConnections : Connections
    {
        public DefaultConnections(IISecurityGroup securityGroup, IIDefaultConnectable defaultPortRangeProvider): base(new DeputyProps(new object[]{securityGroup, defaultPortRangeProvider}))
        {
        }

        protected DefaultConnections(ByRefValue reference): base(reference)
        {
        }

        protected DefaultConnections(DeputyProps props): base(props)
        {
        }

        [JsiiProperty("defaultPortRange", "{\"fqn\":\"@aws-cdk/aws-ec2.IPortRange\"}")]
        public virtual IIPortRange DefaultPortRange
        {
            get => GetInstanceProperty<IIPortRange>();
        }

        /// <summary>
        /// Allow connections from the peer on our default port
        /// 
        /// Even if the peer has a default port, we will always use our default port.
        /// </summary>
        [JsiiMethod("allowDefaultPortFrom", null, "[{\"name\":\"other\",\"type\":{\"fqn\":\"@aws-cdk/aws-ec2.IConnectable\"}},{\"name\":\"description\",\"type\":{\"primitive\":\"string\"}}]")]
        public virtual void AllowDefaultPortFrom(IIConnectable other, string description)
        {
            InvokeInstanceVoidMethod(new object[]{other, description});
        }

        /// <summary>Allow hosts inside the security group to connect to each other</summary>
        [JsiiMethod("allowDefaultPortInternally", null, "[{\"name\":\"description\",\"type\":{\"primitive\":\"string\"}}]")]
        public virtual void AllowDefaultPortInternally(string description)
        {
            InvokeInstanceVoidMethod(new object[]{description});
        }

        /// <summary>Allow default connections from all IPv4 ranges</summary>
        [JsiiMethod("allowDefaultPortFromAnyIpv4", null, "[{\"name\":\"description\",\"type\":{\"primitive\":\"string\"}}]")]
        public virtual void AllowDefaultPortFromAnyIpv4(string description)
        {
            InvokeInstanceVoidMethod(new object[]{description});
        }
    }
}