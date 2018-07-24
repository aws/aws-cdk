using Amazon.CDK.AWS.KMS;
using Amazon.CDK.AWS.RDS;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Neptune
{
    /// <summary>Properties for a Neptune Graph Database Cluster</summary>
    [JsiiInterfaceProxy(typeof(INeptuneDatabaseProps), "@aws-cdk/aws-neptune.NeptuneDatabaseProps")]
    internal class NeptuneDatabasePropsProxy : DeputyBase, INeptuneDatabaseProps
    {
        private NeptuneDatabasePropsProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>
        /// How many replicas/instances to create
        /// 
        /// Has to be at least 1. Default is 2.
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

        /// <summary>What port to listen on</summary>
        /// <remarks>default: 3306</remarks>
        [JsiiProperty("port", "{\"primitive\":\"number\",\"optional\":true}")]
        public virtual double? Port
        {
            get => GetInstanceProperty<double? >();
            set => SetInstanceProperty(value);
        }

        /// <summary>
        /// An optional identifier for the cluster
        /// 
        /// If not given, a name is generated.
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

        /// <summary>
        /// Name of a database which is automatically created inside the cluster
        /// 
        /// If not given, no database is created.
        /// </summary>
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
        /// 
        /// If not given, an window is randomly.
        /// </summary>
        [JsiiProperty("preferredMaintenanceWindow", "{\"primitive\":\"string\",\"optional\":true}")]
        public virtual string PreferredMaintenanceWindow
        {
            get => GetInstanceProperty<string>();
            set => SetInstanceProperty(value);
        }
    }
}