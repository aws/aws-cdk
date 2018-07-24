using Amazon.CDK;
using Amazon.CDK.AWS.EC2;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.RDS
{
    /// <summary>Create a clustered database with a given number of instances.</summary>
    [JsiiClass(typeof(DatabaseCluster), "@aws-cdk/aws-rds.DatabaseCluster", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"props\",\"type\":{\"fqn\":\"@aws-cdk/aws-rds.DatabaseClusterProps\"}}]")]
    public class DatabaseCluster : DatabaseClusterRef
    {
        public DatabaseCluster(Construct parent, string name, IDatabaseClusterProps props): base(new DeputyProps(new object[]{parent, name, props}))
        {
        }

        protected DatabaseCluster(ByRefValue reference): base(reference)
        {
        }

        protected DatabaseCluster(DeputyProps props): base(props)
        {
        }

        /// <summary>Identifier of the cluster</summary>
        [JsiiProperty("clusterIdentifier", "{\"fqn\":\"@aws-cdk/aws-rds.ClusterIdentifier\"}")]
        public override ClusterIdentifier ClusterIdentifier
        {
            get => GetInstanceProperty<ClusterIdentifier>();
        }

        /// <summary>Identifiers of the replicas</summary>
        [JsiiProperty("instanceIdentifiers", "{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"fqn\":\"@aws-cdk/aws-rds.InstanceIdentifier\"}}}")]
        public override InstanceIdentifier[] InstanceIdentifiers
        {
            get => GetInstanceProperty<InstanceIdentifier[]>();
        }

        /// <summary>The endpoint to use for read/write operations</summary>
        [JsiiProperty("clusterEndpoint", "{\"fqn\":\"@aws-cdk/aws-rds.Endpoint\"}")]
        public override Endpoint ClusterEndpoint
        {
            get => GetInstanceProperty<Endpoint>();
        }

        /// <summary>Endpoint to use for load-balanced read-only operations.</summary>
        [JsiiProperty("readerEndpoint", "{\"fqn\":\"@aws-cdk/aws-rds.Endpoint\"}")]
        public override Endpoint ReaderEndpoint
        {
            get => GetInstanceProperty<Endpoint>();
        }

        /// <summary>Endpoints which address each individual replica.</summary>
        [JsiiProperty("instanceEndpoints", "{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"fqn\":\"@aws-cdk/aws-rds.Endpoint\"}}}")]
        public override Endpoint[] InstanceEndpoints
        {
            get => GetInstanceProperty<Endpoint[]>();
        }

        /// <summary>Default port to connect to this database</summary>
        [JsiiProperty("defaultPortRange", "{\"fqn\":\"@aws-cdk/aws-ec2.IPortRange\"}")]
        public override IIPortRange DefaultPortRange
        {
            get => GetInstanceProperty<IIPortRange>();
        }

        /// <summary>Access to the network connections</summary>
        [JsiiProperty("connections", "{\"fqn\":\"@aws-cdk/aws-ec2.IConnections\"}")]
        public override IIConnections Connections
        {
            get => GetInstanceProperty<IIConnections>();
        }

        /// <summary>Security group identifier of this database</summary>
        [JsiiProperty("securityGroupId", "{\"fqn\":\"@aws-cdk/aws-ec2.SecurityGroupId\"}")]
        protected override SecurityGroupId SecurityGroupId
        {
            get => GetInstanceProperty<SecurityGroupId>();
        }
    }
}