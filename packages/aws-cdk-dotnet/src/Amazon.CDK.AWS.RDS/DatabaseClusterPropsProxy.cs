using Amazon.CDK.AWS.KMS;
using AWS.Jsii.Runtime.Deputy;
using System.Collections.Generic;

namespace Amazon.CDK.AWS.RDS
{
    /// <summary>Properties for a new database cluster</summary>
    [JsiiInterfaceProxy(typeof(IDatabaseClusterProps), "@aws-cdk/aws-rds.DatabaseClusterProps")]
    internal class DatabaseClusterPropsProxy : DeputyBase, IDatabaseClusterProps
    {
        private DatabaseClusterPropsProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>What kind of database to start</summary>
        [JsiiProperty("engine", "{\"fqn\":\"@aws-cdk/aws-rds.DatabaseClusterEngine\"}")]
        public virtual DatabaseClusterEngine Engine
        {
            get => GetInstanceProperty<DatabaseClusterEngine>();
            set => SetInstanceProperty(value);
        }

        /// <summary>
        /// How many replicas/instances to create
        /// 
        /// Has to be at least 1.
        /// </summary>
        /// <remarks>default: 2</remarks>
        [JsiiProperty("instances", "{\"primitive\":\"number\",\"optional\":true}")]
        public virtual double? Instances
        {
            get => GetInstanceProperty<double? >();
            set => SetInstanceProperty(value);
        }

        /// <summary>Settings for the individual instances that are launched</summary>
        [JsiiProperty("instanceProps", "{\"fqn\":\"@aws-cdk/aws-rds.InstanceProps\"}")]
        public virtual IInstanceProps InstanceProps
        {
            get => GetInstanceProperty<IInstanceProps>();
            set => SetInstanceProperty(value);
        }

        /// <summary>Username and password for the administrative user</summary>
        [JsiiProperty("masterUser", "{\"fqn\":\"@aws-cdk/aws-rds.Login\"}")]
        public virtual ILogin MasterUser
        {
            get => GetInstanceProperty<ILogin>();
            set => SetInstanceProperty(value);
        }

        /// <summary>Backup settings</summary>
        [JsiiProperty("backup", "{\"fqn\":\"@aws-cdk/aws-rds.BackupProps\",\"optional\":true}")]
        public virtual IBackupProps Backup
        {
            get => GetInstanceProperty<IBackupProps>();
            set => SetInstanceProperty(value);
        }

        /// <summary>
        /// What port to listen on
        /// 
        /// If not supplied, the default for the engine is used.
        /// </summary>
        [JsiiProperty("port", "{\"primitive\":\"number\",\"optional\":true}")]
        public virtual double? Port
        {
            get => GetInstanceProperty<double? >();
            set => SetInstanceProperty(value);
        }

        /// <summary>
        /// An optional identifier for the cluster
        /// 
        /// If not supplied, a name is automatically generated.
        /// </summary>
        [JsiiProperty("clusterIdentifier", "{\"primitive\":\"string\",\"optional\":true}")]
        public virtual string ClusterIdentifier
        {
            get => GetInstanceProperty<string>();
            set => SetInstanceProperty(value);
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
        public virtual string InstanceIdentifierBase
        {
            get => GetInstanceProperty<string>();
            set => SetInstanceProperty(value);
        }

        /// <summary>Name of a database which is automatically created inside the cluster</summary>
        [JsiiProperty("defaultDatabaseName", "{\"primitive\":\"string\",\"optional\":true}")]
        public virtual string DefaultDatabaseName
        {
            get => GetInstanceProperty<string>();
            set => SetInstanceProperty(value);
        }

        /// <summary>ARN of KMS key if you want to enable storage encryption</summary>
        [JsiiProperty("kmsKeyArn", "{\"fqn\":\"@aws-cdk/aws-kms.KeyArn\",\"optional\":true}")]
        public virtual KeyArn KmsKeyArn
        {
            get => GetInstanceProperty<KeyArn>();
            set => SetInstanceProperty(value);
        }

        /// <summary>
        /// A daily time range in 24-hours UTC format in which backups preferably execute.
        /// 
        /// Must be at least 30 minutes long.
        /// 
        /// Example: '01:00-02:00'
        /// </summary>
        [JsiiProperty("preferredMaintenanceWindow", "{\"primitive\":\"string\",\"optional\":true}")]
        public virtual string PreferredMaintenanceWindow
        {
            get => GetInstanceProperty<string>();
            set => SetInstanceProperty(value);
        }

        /// <summary>Additional parameters to pass to the database engine</summary>
        [JsiiProperty("parameters", "{\"collection\":{\"kind\":\"map\",\"elementtype\":{\"primitive\":\"any\"}},\"optional\":true}")]
        public virtual IDictionary<string, object> Parameters
        {
            get => GetInstanceProperty<IDictionary<string, object>>();
            set => SetInstanceProperty(value);
        }
    }
}