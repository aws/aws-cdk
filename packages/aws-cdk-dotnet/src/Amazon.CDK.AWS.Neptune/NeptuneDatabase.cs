using Amazon.CDK;
using Amazon.CDK.AWS.EC2;
using Amazon.CDK.AWS.RDS;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Neptune
{
    /// <summary>
    /// Neptune Graph Database cluster
    /// 
    /// Creates a new Neptune database cluster with a given number of replicas.
    /// </summary>
    [JsiiClass(typeof(NeptuneDatabase), "@aws-cdk/aws-neptune.NeptuneDatabase", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"props\",\"type\":{\"fqn\":\"@aws-cdk/aws-neptune.NeptuneDatabaseProps\"}}]")]
    public class NeptuneDatabase : Construct, IIConnectable
    {
        public NeptuneDatabase(Construct parent, string name, INeptuneDatabaseProps props): base(new DeputyProps(new object[]{parent, name, props}))
        {
        }

        protected NeptuneDatabase(ByRefValue reference): base(reference)
        {
        }

        protected NeptuneDatabase(DeputyProps props): base(props)
        {
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

        [JsiiProperty("connections", "{\"fqn\":\"@aws-cdk/aws-ec2.IConnections\"}")]
        public virtual IIConnections Connections
        {
            get => GetInstanceProperty<IIConnections>();
        }
    }
}