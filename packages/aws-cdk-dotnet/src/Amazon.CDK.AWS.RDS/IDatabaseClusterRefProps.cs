using Amazon.CDK.AWS.EC2;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.RDS
{
    /// <summary>Properties that describe an existing cluster instance</summary>
    [JsiiInterface(typeof(IDatabaseClusterRefProps), "@aws-cdk/aws-rds.DatabaseClusterRefProps")]
    public interface IDatabaseClusterRefProps
    {
        /// <summary>The database port</summary>
        [JsiiProperty("port", "{\"fqn\":\"@aws-cdk/aws-rds.Port\"}")]
        Port Port
        {
            get;
            set;
        }

        /// <summary>The security group for this database cluster</summary>
        [JsiiProperty("securityGroupId", "{\"fqn\":\"@aws-cdk/aws-ec2.SecurityGroupId\"}")]
        SecurityGroupId SecurityGroupId
        {
            get;
            set;
        }

        /// <summary>Identifier for the cluster</summary>
        [JsiiProperty("clusterIdentifier", "{\"fqn\":\"@aws-cdk/aws-rds.ClusterIdentifier\"}")]
        ClusterIdentifier ClusterIdentifier
        {
            get;
            set;
        }

        /// <summary>Identifier for the instances</summary>
        [JsiiProperty("instanceIdentifiers", "{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"fqn\":\"@aws-cdk/aws-rds.InstanceIdentifier\"}}}")]
        InstanceIdentifier[] InstanceIdentifiers
        {
            get;
            set;
        }

        /// <summary>Cluster endpoint address</summary>
        [JsiiProperty("clusterEndpointAddress", "{\"fqn\":\"@aws-cdk/aws-rds.DBClusterEndpointAddress\"}")]
        DBClusterEndpointAddress ClusterEndpointAddress
        {
            get;
            set;
        }

        /// <summary>Reader endpoint address</summary>
        [JsiiProperty("readerEndpointAddress", "{\"fqn\":\"@aws-cdk/aws-rds.DBClusterEndpointAddress\"}")]
        DBClusterEndpointAddress ReaderEndpointAddress
        {
            get;
            set;
        }

        /// <summary>Endpoint addresses of individual instances</summary>
        [JsiiProperty("instanceEndpointAddresses", "{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"fqn\":\"@aws-cdk/aws-rds.DBClusterEndpointAddress\"}}}")]
        DBClusterEndpointAddress[] InstanceEndpointAddresses
        {
            get;
            set;
        }
    }
}