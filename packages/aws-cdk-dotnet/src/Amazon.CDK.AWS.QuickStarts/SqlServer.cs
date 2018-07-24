using Amazon.CDK;
using Amazon.CDK.AWS.EC2;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.QuickStarts
{
    /// <summary>An instance of Microsoft SQL server with associated security groups</summary>
    [JsiiClass(typeof(SqlServer), "@aws-cdk/aws-quickstarts.SqlServer", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"props\",\"type\":{\"fqn\":\"@aws-cdk/aws-quickstarts.SqlServerProps\"}}]")]
    public class SqlServer : Construct, IIConnectable
    {
        public SqlServer(Construct parent, string name, ISqlServerProps props): base(new DeputyProps(new object[]{parent, name, props}))
        {
        }

        protected SqlServer(ByRefValue reference): base(reference)
        {
        }

        protected SqlServer(DeputyProps props): base(props)
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