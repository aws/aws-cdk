using Amazon.CDK.AWS.EC2;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.RDS
{
    /// <summary>Properties that describe an existing cluster instance</summary>
    [JsiiInterfaceProxy(typeof(IDatabaseClusterRefProps), "@aws-cdk/aws-rds.DatabaseClusterRefProps")]
    internal class DatabaseClusterRefPropsProxy : DeputyBase, IDatabaseClusterRefProps
    {
        private DatabaseClusterRefPropsProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>The database port</summary>
        [JsiiProperty("port", "{\"fqn\":\"@aws-cdk/aws-rds.Port\"}")]
        public virtual Port Port
        {
            get => GetInstanceProperty<Port>();
            set => SetInstanceProperty(value);
        }

        /// <summary>The security group for this database cluster</summary>
        [JsiiProperty("securityGroupId", "{\"fqn\":\"@aws-cdk/aws-ec2.SecurityGroupId\"}")]
        public virtual SecurityGroupId SecurityGroupId
        {
            get => GetInstanceProperty<SecurityGroupId>();
            set => SetInstanceProperty(value);
        }

        /// <summary>Identifier for the cluster</summary>
        [JsiiProperty("clusterIdentifier", "{\"fqn\":\"@aws-cdk/aws-rds.ClusterIdentifier\"}")]
        public virtual ClusterIdentifier ClusterIdentifier
        {
            get => GetInstanceProperty<ClusterIdentifier>();
            set => SetInstanceProperty(value);
        }

        /// <summary>Identifier for the instances</summary>
        [JsiiProperty("instanceIdentifiers", "{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"fqn\":\"@aws-cdk/aws-rds.InstanceIdentifier\"}}}")]
        public virtual InstanceIdentifier[] InstanceIdentifiers
        {
            get => GetInstanceProperty<InstanceIdentifier[]>();
            set => SetInstanceProperty(value);
        }

        /// <summary>Cluster endpoint address</summary>
        [JsiiProperty("clusterEndpointAddress", "{\"fqn\":\"@aws-cdk/aws-rds.DBClusterEndpointAddress\"}")]
        public virtual DBClusterEndpointAddress ClusterEndpointAddress
        {
            get => GetInstanceProperty<DBClusterEndpointAddress>();
            set => SetInstanceProperty(value);
        }

        /// <summary>Reader endpoint address</summary>
        [JsiiProperty("readerEndpointAddress", "{\"fqn\":\"@aws-cdk/aws-rds.DBClusterEndpointAddress\"}")]
        public virtual DBClusterEndpointAddress ReaderEndpointAddress
        {
            get => GetInstanceProperty<DBClusterEndpointAddress>();
            set => SetInstanceProperty(value);
        }

        /// <summary>Endpoint addresses of individual instances</summary>
        [JsiiProperty("instanceEndpointAddresses", "{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"fqn\":\"@aws-cdk/aws-rds.DBClusterEndpointAddress\"}}}")]
        public virtual DBClusterEndpointAddress[] InstanceEndpointAddresses
        {
            get => GetInstanceProperty<DBClusterEndpointAddress[]>();
            set => SetInstanceProperty(value);
        }
    }
}