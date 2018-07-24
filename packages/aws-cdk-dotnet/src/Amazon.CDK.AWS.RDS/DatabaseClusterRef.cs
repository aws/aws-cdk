using Amazon.CDK;
using Amazon.CDK.AWS.EC2;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.RDS
{
    /// <summary>Create a clustered database with a given number of instances.</summary>
    [JsiiClass(typeof(DatabaseClusterRef), "@aws-cdk/aws-rds.DatabaseClusterRef", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}}]")]
    public abstract class DatabaseClusterRef : Construct, IIDefaultConnectable
    {
        protected DatabaseClusterRef(Construct parent, string name): base(new DeputyProps(new object[]{parent, name}))
        {
        }

        protected DatabaseClusterRef(ByRefValue reference): base(reference)
        {
        }

        protected DatabaseClusterRef(DeputyProps props): base(props)
        {
        }

        /// <summary>Default port to connect to this database</summary>
        [JsiiProperty("defaultPortRange", "{\"fqn\":\"@aws-cdk/aws-ec2.IPortRange\"}")]
        public virtual IIPortRange DefaultPortRange
        {
            get => GetInstanceProperty<IIPortRange>();
        }

        /// <summary>Access to the network connections</summary>
        [JsiiProperty("connections", "{\"fqn\":\"@aws-cdk/aws-ec2.IConnections\"}")]
        public virtual IIConnections Connections
        {
            get => GetInstanceProperty<IIConnections>();
        }

        /// <summary>Identifier of the cluster</summary>
        [JsiiProperty("clusterIdentifier", "{\"fqn\":\"@aws-cdk/aws-rds.ClusterIdentifier\"}")]
        public virtual ClusterIdentifier ClusterIdentifier
        {
            get => GetInstanceProperty<ClusterIdentifier>();
        }

        /// <summary>Identifiers of the replicas</summary>
        [JsiiProperty("instanceIdentifiers", "{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"fqn\":\"@aws-cdk/aws-rds.InstanceIdentifier\"}}}")]
        public virtual InstanceIdentifier[] InstanceIdentifiers
        {
            get => GetInstanceProperty<InstanceIdentifier[]>();
        }

        /// <summary>The endpoint to use for read/write operations</summary>
        [JsiiProperty("clusterEndpoint", "{\"fqn\":\"@aws-cdk/aws-rds.Endpoint\"}")]
        public virtual Endpoint ClusterEndpoint
        {
            get => GetInstanceProperty<Endpoint>();
        }

        /// <summary>Endpoint to use for load-balanced read-only operations.</summary>
        [JsiiProperty("readerEndpoint", "{\"fqn\":\"@aws-cdk/aws-rds.Endpoint\"}")]
        public virtual Endpoint ReaderEndpoint
        {
            get => GetInstanceProperty<Endpoint>();
        }

        /// <summary>Endpoints which address each individual replica.</summary>
        [JsiiProperty("instanceEndpoints", "{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"fqn\":\"@aws-cdk/aws-rds.Endpoint\"}}}")]
        public virtual Endpoint[] InstanceEndpoints
        {
            get => GetInstanceProperty<Endpoint[]>();
        }

        /// <summary>The security group for this database cluster</summary>
        [JsiiProperty("securityGroupId", "{\"fqn\":\"@aws-cdk/aws-ec2.SecurityGroupId\"}")]
        protected virtual SecurityGroupId SecurityGroupId
        {
            get => GetInstanceProperty<SecurityGroupId>();
        }

        /// <summary>Import an existing DatabaseCluster from properties</summary>
        [JsiiMethod("import", "{\"fqn\":\"@aws-cdk/aws-rds.DatabaseClusterRef\"}", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"props\",\"type\":{\"fqn\":\"@aws-cdk/aws-rds.DatabaseClusterRefProps\"}}]")]
        public static DatabaseClusterRef Import(Construct parent, string name, IDatabaseClusterRefProps props)
        {
            return InvokeStaticMethod<DatabaseClusterRef>(typeof(DatabaseClusterRef), new object[]{parent, name, props});
        }

        /// <summary>Export a Database Cluster for importing in another stack</summary>
        [JsiiMethod("export", "{\"fqn\":\"@aws-cdk/aws-rds.DatabaseClusterRefProps\"}", "[]")]
        public virtual IDatabaseClusterRefProps Export()
        {
            return InvokeInstanceMethod<IDatabaseClusterRefProps>(new object[]{});
        }
    }
}