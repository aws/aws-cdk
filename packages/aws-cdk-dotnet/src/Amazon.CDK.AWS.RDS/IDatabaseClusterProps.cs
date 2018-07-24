using Amazon.CDK.AWS.KMS;
using AWS.Jsii.Runtime.Deputy;
using System.Collections.Generic;

namespace Amazon.CDK.AWS.RDS
{
    /// <summary>Properties for a new database cluster</summary>
    [JsiiInterface(typeof(IDatabaseClusterProps), "@aws-cdk/aws-rds.DatabaseClusterProps")]
    public interface IDatabaseClusterProps
    {
        /// <summary>What kind of database to start</summary>
        [JsiiProperty("engine", "{\"fqn\":\"@aws-cdk/aws-rds.DatabaseClusterEngine\"}")]
        DatabaseClusterEngine Engine
        {
            get;
            set;
        }

        /// <summary>
        /// How many replicas/instances to create
        /// 
        /// Has to be at least 1.
        /// </summary>
        /// <remarks>default: 2</remarks>
        [JsiiProperty("instances", "{\"primitive\":\"number\",\"optional\":true}")]
        double? Instances
        {
            get;
            set;
        }

        /// <summary>Settings for the individual instances that are launched</summary>
        [JsiiProperty("instanceProps", "{\"fqn\":\"@aws-cdk/aws-rds.InstanceProps\"}")]
        IInstanceProps InstanceProps
        {
            get;
            set;
        }

        /// <summary>Username and password for the administrative user</summary>
        [JsiiProperty("masterUser", "{\"fqn\":\"@aws-cdk/aws-rds.Login\"}")]
        ILogin MasterUser
        {
            get;
            set;
        }

        /// <summary>Backup settings</summary>
        [JsiiProperty("backup", "{\"fqn\":\"@aws-cdk/aws-rds.BackupProps\",\"optional\":true}")]
        IBackupProps Backup
        {
            get;
            set;
        }

        /// <summary>
        /// What port to listen on
        /// 
        /// If not supplied, the default for the engine is used.
        /// </summary>
        [JsiiProperty("port", "{\"primitive\":\"number\",\"optional\":true}")]
        double? Port
        {
            get;
            set;
        }

        /// <summary>
        /// An optional identifier for the cluster
        /// 
        /// If not supplied, a name is automatically generated.
        /// </summary>
        [JsiiProperty("clusterIdentifier", "{\"primitive\":\"string\",\"optional\":true}")]
        string ClusterIdentifier
        {
            get;
            set;
        }

        /// <summary>
        /// Base identifier for instances
        /// 
        /// Every replica is named by appending the replica number to this string, 1-based.
        /// 
        /// If not given, the clusterIdentifier is used with the word "Instance" appended.
        /// 
        /// If clusterIdentifier is also not given, the identifier is automatically generated.
        /// </summary>
        [JsiiProperty("instanceIdentifierBase", "{\"primitive\":\"string\",\"optional\":true}")]
        string InstanceIdentifierBase
        {
            get;
            set;
        }

        /// <summary>Name of a database which is automatically created inside the cluster</summary>
        [JsiiProperty("defaultDatabaseName", "{\"primitive\":\"string\",\"optional\":true}")]
        string DefaultDatabaseName
        {
            get;
            set;
        }

        /// <summary>ARN of KMS key if you want to enable storage encryption</summary>
        [JsiiProperty("kmsKeyArn", "{\"fqn\":\"@aws-cdk/aws-kms.KeyArn\",\"optional\":true}")]
        KeyArn KmsKeyArn
        {
            get;
            set;
        }

        /// <summary>
        /// A daily time range in 24-hours UTC format in which backups preferably execute.
        /// 
        /// Must be at least 30 minutes long.
        /// 
        /// Example: '01:00-02:00'
        /// </summary>
        [JsiiProperty("preferredMaintenanceWindow", "{\"primitive\":\"string\",\"optional\":true}")]
        string PreferredMaintenanceWindow
        {
            get;
            set;
        }

        /// <summary>Additional parameters to pass to the database engine</summary>
        [JsiiProperty("parameters", "{\"collection\":{\"kind\":\"map\",\"elementtype\":{\"primitive\":\"any\"}},\"optional\":true}")]
        IDictionary<string, object> Parameters
        {
            get;
            set;
        }
    }
}