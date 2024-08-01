import { Construct } from 'constructs';
import { IAuroraClusterInstance, IClusterInstance, InstanceType } from './aurora-cluster-instance';
import { IClusterEngine } from './cluster-engine';
import { DatabaseClusterAttributes, IDatabaseCluster } from './cluster-ref';
import { Endpoint } from './endpoint';
import { NetworkType } from './instance';
import { IParameterGroup, ParameterGroup } from './parameter-group';
import { DATA_API_ACTIONS } from './perms';
import { applyDefaultRotationOptions, defaultDeletionProtection, renderCredentials, setupS3ImportExport, helperRemovalPolicy, renderUnless, renderSnapshotCredentials } from './private/util';
import { BackupProps, Credentials, InstanceProps, PerformanceInsightRetention, RotationSingleUserOptions, RotationMultiUserOptions, SnapshotCredentials } from './props';
import { DatabaseProxy, DatabaseProxyOptions, ProxyTarget } from './proxy';
import { CfnDBCluster, CfnDBClusterProps, CfnDBInstance } from './rds.generated';
import { ISubnetGroup, SubnetGroup } from './subnet-group';
import * as cloudwatch from '../../aws-cloudwatch';
import * as ec2 from '../../aws-ec2';
import * as iam from '../../aws-iam';
import { IRole, ManagedPolicy, Role, ServicePrincipal } from '../../aws-iam';
import * as kms from '../../aws-kms';
import * as logs from '../../aws-logs';
import * as s3 from '../../aws-s3';
import * as secretsmanager from '../../aws-secretsmanager';
import { Annotations, ArnFormat, Duration, FeatureFlags, Lazy, RemovalPolicy, Resource, Stack, Token } from '../../core';
import * as cxapi from '../../cx-api';

/**
 * Common properties for a new database cluster or cluster from snapshot.
 */
interface DatabaseClusterBaseProps {
  /**
   * What kind of database to start
   */
  readonly engine: IClusterEngine;

  /**
   * How many replicas/instances to create
   *
   * Has to be at least 1.
   *
   * @default 2
   * @deprecated - use writer and readers instead
   */
  readonly instances?: number;

  /**
   * Settings for the individual instances that are launched
   *
   * @deprecated - use writer and readers instead
   */
  readonly instanceProps?: InstanceProps;

  /**
   * The instance to use for the cluster writer
   *
   * @default required if instanceProps is not provided
   */
  readonly writer?: IClusterInstance;

  /**
   * A list of instances to create as cluster reader instances
   *
   * @default - no readers are created. The cluster will have a single writer/reader
   */
  readonly readers?: IClusterInstance[];

  /**
   * The maximum number of Aurora capacity units (ACUs) for a DB instance in an Aurora Serverless v2 cluster.
   * You can specify ACU values in half-step increments, such as 40, 40.5, 41, and so on.
   * The largest value that you can use is 128 (256GB).
   *
   * The maximum capacity must be higher than 0.5 ACUs.
   * @see https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-serverless-v2.setting-capacity.html#aurora-serverless-v2.max_capacity_considerations
   *
   * @default 2
   */
  readonly serverlessV2MaxCapacity?: number;

  /**
   * The minimum number of Aurora capacity units (ACUs) for a DB instance in an Aurora Serverless v2 cluster.
   * You can specify ACU values in half-step increments, such as 8, 8.5, 9, and so on.
   * The smallest value that you can use is 0.5.
   *
   * @see https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-serverless-v2.setting-capacity.html#aurora-serverless-v2.max_capacity_considerations
   *
   * @default 0.5
   */
  readonly serverlessV2MinCapacity?: number;

  /**
   * What subnets to run the RDS instances in.
   *
   * Must be at least 2 subnets in two different AZs.
   */
  readonly vpc?: ec2.IVpc;

  /**
   * Where to place the instances within the VPC
   *
   * @default - the Vpc default strategy if not specified.
   */
  readonly vpcSubnets?: ec2.SubnetSelection;

  /**
   * Security group.
   *
   * @default a new security group is created.
   */
  readonly securityGroups?: ec2.ISecurityGroup[];

  /**
   * The ordering of updates for instances
   *
   * @default InstanceUpdateBehaviour.BULK
   */
  readonly instanceUpdateBehaviour?: InstanceUpdateBehaviour;

  /**
   * The number of seconds to set a cluster's target backtrack window to.
   * This feature is only supported by the Aurora MySQL database engine and
   * cannot be enabled on existing clusters.
   *
   * @see https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/AuroraMySQL.Managing.Backtrack.html
   * @default 0 seconds (no backtrack)
   */
  readonly backtrackWindow?: Duration;

  /**
   * Backup settings
   *
   * @default - Backup retention period for automated backups is 1 day.
   * Backup preferred window is set to a 30-minute window selected at random from an
   * 8-hour block of time for each AWS Region, occurring on a random day of the week.
   * @see https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_WorkingWithAutomatedBackups.html#USER_WorkingWithAutomatedBackups.BackupWindow
   */
  readonly backup?: BackupProps;

  /**
   * What port to listen on
   *
   * @default - The default for the engine is used.
   */
  readonly port?: number;

  /**
   * An optional identifier for the cluster
   *
   * @default - A name is automatically generated.
   */
  readonly clusterIdentifier?: string;

  /**
   * Base identifier for instances
   *
   * Every replica is named by appending the replica number to this string, 1-based.
   *
   * @default - clusterIdentifier is used with the word "Instance" appended.
   * If clusterIdentifier is not provided, the identifier is automatically generated.
   */
  readonly instanceIdentifierBase?: string;

  /**
   * Name of a database which is automatically created inside the cluster
   *
   * @default - Database is not created in cluster.
   */
  readonly defaultDatabaseName?: string;

  /**
   * Indicates whether the DB cluster should have deletion protection enabled.
   *
   * @default - true if `removalPolicy` is RETAIN, `undefined` otherwise, which will not enable deletion protection.
   * To disable deletion protection after it has been enabled, you must explicitly set this value to `false`.
   */
  readonly deletionProtection?: boolean;

  /**
   * A preferred maintenance window day/time range. Should be specified as a range ddd:hh24:mi-ddd:hh24:mi (24H Clock UTC).
   *
   * Example: 'Sun:23:45-Mon:00:15'
   *
   * @default - 30-minute window selected at random from an 8-hour block of time for
   * each AWS Region, occurring on a random day of the week.
   * @see https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/USER_UpgradeDBInstance.Maintenance.html#Concepts.DBMaintenance
   */
  readonly preferredMaintenanceWindow?: string;

  /**
   * Additional parameters to pass to the database engine
   *
   * @default - No parameter group.
   */
  readonly parameterGroup?: IParameterGroup;

  /**
   * The parameters in the DBClusterParameterGroup to create automatically
   *
   * You can only specify parameterGroup or parameters but not both.
   * You need to use a versioned engine to auto-generate a DBClusterParameterGroup.
   *
   * @default - None
   */
  readonly parameters?: { [key: string]: string };

  /**
   * The removal policy to apply when the cluster and its instances are removed
   * from the stack or replaced during an update.
   *
   * @default - RemovalPolicy.SNAPSHOT (remove the cluster and instances, but retain a snapshot of the data)
   */
  readonly removalPolicy?: RemovalPolicy;

  /**
   * The list of log types that need to be enabled for exporting to
   * CloudWatch Logs.
   *
   * @default - no log exports
   */
  readonly cloudwatchLogsExports?: string[];

  /**
   * The number of days log events are kept in CloudWatch Logs. When updating
   * this property, unsetting it doesn't remove the log retention policy. To
   * remove the retention policy, set the value to `Infinity`.
   *
   * @default - logs never expire
   */
  readonly cloudwatchLogsRetention?: logs.RetentionDays;

  /**
   * The IAM role for the Lambda function associated with the custom resource
   * that sets the retention policy.
   *
   * @default - a new role is created.
   */
  readonly cloudwatchLogsRetentionRole?: IRole;

  /**
   * The interval, in seconds, between points when Amazon RDS collects enhanced
   * monitoring metrics for the DB instances.
   *
   * @default no enhanced monitoring
   */
  readonly monitoringInterval?: Duration;

  /**
   * Role that will be used to manage DB instances monitoring.
   *
   * @default - A role is automatically created for you
   */
  readonly monitoringRole?: IRole;

  /**
   * Role that will be associated with this DB cluster to enable S3 import.
   * This feature is only supported by the Aurora database engine.
   *
   * This property must not be used if `s3ImportBuckets` is used.
   * To use this property with Aurora PostgreSQL, it must be configured with the S3 import feature enabled when creating the DatabaseClusterEngine
   * For MySQL:
   * @see https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/AuroraMySQL.Integrating.LoadFromS3.html
   *
   * For PostgreSQL:
   * @see https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/AuroraPostgreSQL.Migrating.html
   *
   * @default - New role is created if `s3ImportBuckets` is set, no role is defined otherwise
   */
  readonly s3ImportRole?: IRole;

  /**
   * S3 buckets that you want to load data from. This feature is only supported by the Aurora database engine.
   *
   * This property must not be used if `s3ImportRole` is used.
   *
   * For MySQL:
   * @see https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/AuroraMySQL.Integrating.LoadFromS3.html
   *
   * For PostgreSQL:
   * @see https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/AuroraPostgreSQL.Migrating.html
   *
   * @default - None
   */
  readonly s3ImportBuckets?: s3.IBucket[];

  /**
   * Role that will be associated with this DB cluster to enable S3 export.
   * This feature is only supported by the Aurora database engine.
   *
   * This property must not be used if `s3ExportBuckets` is used.
   * To use this property with Aurora PostgreSQL, it must be configured with the S3 export feature enabled when creating the DatabaseClusterEngine
   * For MySQL:
   * @see https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/AuroraMySQL.Integrating.SaveIntoS3.html
   *
   * For PostgreSQL:
   * @see https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/postgresql-s3-export.html
   *
   * @default - New role is created if `s3ExportBuckets` is set, no role is defined otherwise
   */
  readonly s3ExportRole?: IRole;

  /**
   * S3 buckets that you want to load data into. This feature is only supported by the Aurora database engine.
   *
   * This property must not be used if `s3ExportRole` is used.
   *
   * For MySQL:
   * @see https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/AuroraMySQL.Integrating.SaveIntoS3.html
   *
   * For PostgreSQL:
   * @see https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/postgresql-s3-export.html
   *
   * @default - None
   */
  readonly s3ExportBuckets?: s3.IBucket[];

  /**
   * Existing subnet group for the cluster.
   *
   * @default - a new subnet group will be created.
   */
  readonly subnetGroup?: ISubnetGroup;

  /**
   * Whether to enable mapping of AWS Identity and Access Management (IAM) accounts
   * to database accounts.
   *
   * @default false
   */
  readonly iamAuthentication?: boolean;

  /**
   * Whether to enable storage encryption.
   *
   * @default - true if storageEncryptionKey is provided, false otherwise
   */
  readonly storageEncrypted?: boolean;

  /**
   * The KMS key for storage encryption.
   * If specified, `storageEncrypted` will be set to `true`.
   *
   * @default - if storageEncrypted is true then the default master key, no key otherwise
   */
  readonly storageEncryptionKey?: kms.IKey;

  /**
   * The storage type to be associated with the DB cluster.
   *
   * @default - DBClusterStorageType.AURORA_IOPT1
   */
  readonly storageType?: DBClusterStorageType;

  /**
   * Whether to copy tags to the snapshot when a snapshot is created.
   *
   * @default - true
   */
  readonly copyTagsToSnapshot?: boolean;

  /**
   * The network type of the DB instance.
   *
   * @default - IPV4
   */
  readonly networkType?: NetworkType;

  /**
  * Directory ID for associating the DB cluster with a specific Active Directory.
  *
  * Necessary for enabling Kerberos authentication. If specified, the DB cluster joins the given Active Directory, enabling Kerberos authentication.
  * If not specified, the DB cluster will not be associated with any Active Directory, and Kerberos authentication will not be enabled.
  *
  * @default - DB cluster is not associated with an Active Directory; Kerberos authentication is not enabled.
  */
  readonly domain?: string;

  /**
   * The IAM role to be used when making API calls to the Directory Service. The role needs the AWS-managed policy
   * `AmazonRDSDirectoryServiceAccess` or equivalent.
   *
   * @default - If `DatabaseClusterBaseProps.domain` is specified, a role with the `AmazonRDSDirectoryServiceAccess` policy is automatically created.
   */
  readonly domainRole?: iam.IRole;

  /**
   * Whether to enable the Data API for the cluster.
   *
   * @default - false
   */
  readonly enableDataApi?: boolean;

  /**
   * Specifies whether to manage the master user password with AWS Secrets Manager.
   *
   * @default - false
   */
  readonly manageMasterUserPassword?: boolean;
}

/**
 * The storage type to be associated with the DB cluster.
 */
export enum DBClusterStorageType {
  /**
   * Storage type for Aurora DB standard clusters.
   */
  AURORA = 'aurora',

  /**
   * Storage type for Aurora DB I/O-Optimized clusters.
   */
  AURORA_IOPT1 = 'aurora-iopt1',
}

/**
 * The orchestration of updates of multiple instances
 */
export enum InstanceUpdateBehaviour {
  /**
   * In a bulk update, all instances of the cluster are updated at the same time.
   * This results in a faster update procedure.
   * During the update, however, all instances might be unavailable at the same time and thus a downtime might occur.
   */
  BULK = 'BULK',

  /**
   * In a rolling update, one instance after another is updated.
   * This results in at most one instance being unavailable during the update.
   * If your cluster consists of more than 1 instance, the downtime periods are limited to the time a primary switch needs.
   */
  ROLLING = 'ROLLING',
}

/**
 * A new or imported clustered database.
 */
export abstract class DatabaseClusterBase extends Resource implements IDatabaseCluster {
  // only required because of JSII bug: https://github.com/aws/jsii/issues/2040
  public abstract readonly engine?: IClusterEngine;

  /**
   * Identifier of the cluster
   */
  public abstract readonly clusterIdentifier: string;

  /**
   * The immutable identifier for the cluster; for example: cluster-ABCD1234EFGH5678IJKL90MNOP.
   *
   * This AWS Region-unique identifier is used in things like IAM authentication policies.
   */
  public abstract readonly clusterResourceIdentifier: string;

  /**
   * Identifiers of the replicas
   */
  public abstract readonly instanceIdentifiers: string[];

  /**
   * The endpoint to use for read/write operations
   */
  public abstract readonly clusterEndpoint: Endpoint;

  /**
   * Endpoint to use for load-balanced read-only operations.
   */
  public abstract readonly clusterReadEndpoint: Endpoint;

  /**
   * Endpoints which address each individual replica.
   */
  public abstract readonly instanceEndpoints: Endpoint[];

  /**
   * Access to the network connections
   */
  public abstract readonly connections: ec2.Connections;

  /**
   * The secret attached to this cluster
   */
  public abstract readonly secret?: secretsmanager.ISecret

  /**
   * Specifies whether to manage user password with AWS Secrets Manager.
   */
  public abstract readonly manageMasterUserPassword?: boolean;

  protected abstract enableDataApi?: boolean;

  /**
   * The ARN of the cluster
   */
  public get clusterArn(): string {
    return Stack.of(this).formatArn({
      service: 'rds',
      resource: 'cluster',
      arnFormat: ArnFormat.COLON_RESOURCE_NAME,
      resourceName: this.clusterIdentifier,
    });
  }

  /**
   * Add a new db proxy to this cluster.
   */
  public addProxy(id: string, options: DatabaseProxyOptions): DatabaseProxy {
    return new DatabaseProxy(this, id, {
      proxyTarget: ProxyTarget.fromCluster(this),
      ...options,
    });
  }

  /**
   * Renders the secret attachment target specifications.
   */
  public asSecretAttachmentTarget(): secretsmanager.SecretAttachmentTargetProps {
    return {
      targetId: this.clusterIdentifier,
      targetType: secretsmanager.AttachmentTargetType.RDS_DB_CLUSTER,
    };
  }

  public grantConnect(grantee: iam.IGrantable, dbUser: string): iam.Grant {
    return iam.Grant.addToPrincipal({
      actions: ['rds-db:connect'],
      grantee,
      resourceArns: [Stack.of(this).formatArn({
        service: 'rds-db',
        resource: 'dbuser',
        resourceName: `${this.clusterResourceIdentifier}/${dbUser}`,
        arnFormat: ArnFormat.COLON_RESOURCE_NAME,
      })],
    });
  }

  /**
   * Grant the given identity to access the Data API.
   */
  public grantDataApiAccess(grantee: iam.IGrantable): iam.Grant {
    if (this.enableDataApi === false) {
      throw new Error('Cannot grant Data API access when the Data API is disabled');
    }

    this.enableDataApi = true;
    const ret = iam.Grant.addToPrincipal({
      grantee,
      actions: DATA_API_ACTIONS,
      resourceArns: [this.clusterArn],
      scope: this,
    });
    this.secret?.grantRead(grantee);
    return ret;
  }
}

/**
 * Abstract base for ``DatabaseCluster`` and ``DatabaseClusterFromSnapshot``
 */
abstract class DatabaseClusterNew extends DatabaseClusterBase {
  /**
   * The engine for this Cluster.
   * Never undefined.
   */
  public readonly engine?: IClusterEngine;

  protected readonly newCfnProps: CfnDBClusterProps;
  protected readonly securityGroups: ec2.ISecurityGroup[];
  protected readonly subnetGroup: ISubnetGroup;

  private readonly domainId?: string;
  private readonly domainRole?: iam.IRole;

  /**
   * Secret in SecretsManager to store the database cluster user credentials.
   */
  public abstract readonly secret?: secretsmanager.ISecret;

  /**
   * The VPC network to place the cluster in.
   */
  public readonly vpc: ec2.IVpc;

  /**
   * The cluster's subnets.
   */
  public readonly vpcSubnets?: ec2.SubnetSelection;

  /**
   * The log group is created when `cloudwatchLogsExports` is set.
   *
   * Each export value will create a separate log group.
   */
  public readonly cloudwatchLogGroups: {[engine: string]: logs.ILogGroup};

  /**
   * Application for single user rotation of the master password to this cluster.
   */
  public readonly singleUserRotationApplication: secretsmanager.SecretRotationApplication;

  /**
   * Application for multi user rotation to this cluster.
   */
  public readonly multiUserRotationApplication: secretsmanager.SecretRotationApplication;

  protected readonly serverlessV2MinCapacity: number;
  protected readonly serverlessV2MaxCapacity: number;

  protected hasServerlessInstance?: boolean;
  protected enableDataApi?: boolean;

  public readonly manageMasterUserPassword?: boolean;

  constructor(scope: Construct, id: string, props: DatabaseClusterBaseProps) {
    super(scope, id);

    if ((props.vpc && props.instanceProps?.vpc) || (!props.vpc && !props.instanceProps?.vpc)) {
      throw new Error('Provide either vpc or instanceProps.vpc, but not both');
    }
    if ((props.vpcSubnets && props.instanceProps?.vpcSubnets)) {
      throw new Error('Provide either vpcSubnets or instanceProps.vpcSubnets, but not both');
    }
    this.vpc = props.instanceProps?.vpc ?? props.vpc!;
    this.vpcSubnets = props.instanceProps?.vpcSubnets ?? props.vpcSubnets;

    this.cloudwatchLogGroups = {};

    this.singleUserRotationApplication = props.engine.singleUserRotationApplication;
    this.multiUserRotationApplication = props.engine.multiUserRotationApplication;

    this.manageMasterUserPassword = props.manageMasterUserPassword;

    this.serverlessV2MaxCapacity = props.serverlessV2MaxCapacity ?? 2;
    this.serverlessV2MinCapacity = props.serverlessV2MinCapacity ?? 0.5;
    this.validateServerlessScalingConfig();

    this.enableDataApi = props.enableDataApi;

    const { subnetIds } = this.vpc.selectSubnets(this.vpcSubnets);

    // Cannot test whether the subnets are in different AZs, but at least we can test the amount.
    if (subnetIds.length < 2) {
      Annotations.of(this).addError(`Cluster requires at least 2 subnets, got ${subnetIds.length}`);
    }

    this.subnetGroup = props.subnetGroup ?? new SubnetGroup(this, 'Subnets', {
      description: `Subnets for ${id} database`,
      vpc: this.vpc,
      vpcSubnets: this.vpcSubnets,
      removalPolicy: renderUnless(helperRemovalPolicy(props.removalPolicy), RemovalPolicy.DESTROY),
    });

    this.securityGroups = props.instanceProps?.securityGroups ?? props.securityGroups ?? [
      new ec2.SecurityGroup(this, 'SecurityGroup', {
        description: 'RDS security group',
        vpc: this.vpc,
      }),
    ];

    const combineRoles = props.engine.combineImportAndExportRoles ?? false;
    let { s3ImportRole, s3ExportRole } = setupS3ImportExport(this, props, combineRoles);

    if (props.parameterGroup && props.parameters) {
      throw new Error('You cannot specify both parameterGroup and parameters');
    }
    const parameterGroup = props.parameterGroup ?? (
      props.parameters
        ? new ParameterGroup(this, 'ParameterGroup', {
          engine: props.engine,
          parameters: props.parameters,
        })
        : undefined
    );
    // bind the engine to the Cluster
    const clusterEngineBindConfig = props.engine.bindToCluster(this, {
      s3ImportRole,
      s3ExportRole,
      parameterGroup,
    });

    const clusterAssociatedRoles: CfnDBCluster.DBClusterRoleProperty[] = [];
    if (s3ImportRole) {
      clusterAssociatedRoles.push({ roleArn: s3ImportRole.roleArn, featureName: clusterEngineBindConfig.features?.s3Import });
    }
    if (s3ExportRole &&
        // only add the second associated Role if it's different than the first
        // (duplicates in the associated Roles array are not allowed by the RDS service)
        (s3ExportRole !== s3ImportRole ||
        clusterEngineBindConfig.features?.s3Import !== clusterEngineBindConfig.features?.s3Export)) {
      clusterAssociatedRoles.push({ roleArn: s3ExportRole.roleArn, featureName: clusterEngineBindConfig.features?.s3Export });
    }

    const clusterParameterGroup = props.parameterGroup ?? clusterEngineBindConfig.parameterGroup;
    const clusterParameterGroupConfig = clusterParameterGroup?.bindToCluster({});
    this.engine = props.engine;

    const clusterIdentifier = FeatureFlags.of(this).isEnabled(cxapi.RDS_LOWERCASE_DB_IDENTIFIER) && !Token.isUnresolved(props.clusterIdentifier)
      ? props.clusterIdentifier?.toLowerCase()
      : props.clusterIdentifier;

    if (props.domain) {
      this.domainId = props.domain;
      this.domainRole = props.domainRole ?? new iam.Role(this, 'RDSClusterDirectoryServiceRole', {
        assumedBy: new iam.CompositePrincipal(
          new iam.ServicePrincipal('rds.amazonaws.com'),
          new iam.ServicePrincipal('directoryservice.rds.amazonaws.com'),
        ),
        managedPolicies: [
          iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AmazonRDSDirectoryServiceAccess'),
        ],
      });
    }

    this.newCfnProps = {
      // Basic
      engine: props.engine.engineType,
      engineVersion: props.engine.engineVersion?.fullVersion,
      dbClusterIdentifier: clusterIdentifier,
      dbSubnetGroupName: this.subnetGroup.subnetGroupName,
      vpcSecurityGroupIds: this.securityGroups.map(sg => sg.securityGroupId),
      port: props.port ?? clusterEngineBindConfig.port,
      dbClusterParameterGroupName: clusterParameterGroupConfig?.parameterGroupName,
      associatedRoles: clusterAssociatedRoles.length > 0 ? clusterAssociatedRoles : undefined,
      deletionProtection: defaultDeletionProtection(props.deletionProtection, props.removalPolicy),
      enableIamDatabaseAuthentication: props.iamAuthentication,
      enableHttpEndpoint: Lazy.any({ produce: () => this.enableDataApi }),
      networkType: props.networkType,
      serverlessV2ScalingConfiguration: Lazy.any({
        produce: () => {
          if (this.hasServerlessInstance) {
            return {
              minCapacity: this.serverlessV2MinCapacity,
              maxCapacity: this.serverlessV2MaxCapacity,
            };
          }
          return undefined;
        },
      }),
      storageType: props.storageType?.toString(),
      ...(this.manageMasterUserPassword && {
        manageMasterUserPassword: props.manageMasterUserPassword,
      }),
      // Admin
      backtrackWindow: props.backtrackWindow?.toSeconds(),
      backupRetentionPeriod: props.backup?.retention?.toDays(),
      preferredBackupWindow: props.backup?.preferredWindow,
      preferredMaintenanceWindow: props.preferredMaintenanceWindow,
      databaseName: props.defaultDatabaseName,
      enableCloudwatchLogsExports: props.cloudwatchLogsExports,
      // Encryption
      kmsKeyId: props.storageEncryptionKey?.keyArn,
      storageEncrypted: props.storageEncryptionKey ? true : props.storageEncrypted,
      // Tags
      copyTagsToSnapshot: props.copyTagsToSnapshot ?? true,
      domain: this.domainId,
      domainIamRoleName: this.domainRole?.roleName,
    };
  }

  /**
   * Create cluster instances
   *
   * @internal
   */
  protected _createInstances(cluster: DatabaseClusterNew, props: DatabaseClusterProps): InstanceConfig {
    const instanceEndpoints: Endpoint[] = [];
    const instanceIdentifiers: string[] = [];
    const readers: IAuroraClusterInstance[] = [];

    let monitoringRole = props.monitoringRole;
    if (!props.monitoringRole && props.monitoringInterval && props.monitoringInterval.toSeconds()) {
      monitoringRole = new Role(cluster, 'MonitoringRole', {
        assumedBy: new ServicePrincipal('monitoring.rds.amazonaws.com'),
        managedPolicies: [
          ManagedPolicy.fromAwsManagedPolicyName('service-role/AmazonRDSEnhancedMonitoringRole'),
        ],
      });
    }

    // need to create the writer first since writer is determined by what instance is first
    const writer = props.writer!.bind(this, this, {
      monitoringInterval: props.monitoringInterval,
      monitoringRole: monitoringRole,
      removalPolicy: props.removalPolicy ?? RemovalPolicy.SNAPSHOT,
      subnetGroup: this.subnetGroup,
      promotionTier: 0, // override the promotion tier so that writers are always 0
    });
    instanceIdentifiers.push(writer.instanceIdentifier);
    instanceEndpoints.push(new Endpoint(writer.dbInstanceEndpointAddress, this.clusterEndpoint.port));

    (props.readers ?? []).forEach(instance => {
      const clusterInstance = instance.bind(this, this, {
        monitoringInterval: props.monitoringInterval,
        monitoringRole: monitoringRole,
        removalPolicy: props.removalPolicy ?? RemovalPolicy.SNAPSHOT,
        subnetGroup: this.subnetGroup,
      });
      readers.push(clusterInstance);
      // this makes sure the readers would always be created after the writer
      clusterInstance.node.addDependency(writer);

      if (clusterInstance.tier < 2) {
        this.validateReaderInstance(writer, clusterInstance);
      }
      instanceEndpoints.push(new Endpoint(clusterInstance.dbInstanceEndpointAddress, this.clusterEndpoint.port));
      instanceIdentifiers.push(clusterInstance.instanceIdentifier);
    });
    this.validateClusterInstances(writer, readers);

    return {
      instanceEndpoints,
      instanceIdentifiers,
    };
  }

  /**
   * Perform validations on the cluster instances
   */
  private validateClusterInstances(writer: IAuroraClusterInstance, readers: IAuroraClusterInstance[]): void {
    if (writer.type === InstanceType.SERVERLESS_V2) {
      this.hasServerlessInstance = true;
    }
    if (readers.length > 0) {
      const sortedReaders = readers.sort((a, b) => a.tier - b.tier);
      const highestTierReaders: IAuroraClusterInstance[] = [];
      const highestTier = sortedReaders[0].tier;
      let hasProvisionedReader = false;
      let noFailoverTierInstances = true;
      let serverlessInHighestTier = false;
      let hasServerlessReader = false;
      const someProvisionedReadersDontMatchWriter: IAuroraClusterInstance[] = [];
      for (const reader of sortedReaders) {
        if (reader.type === InstanceType.SERVERLESS_V2) {
          hasServerlessReader = true;
          this.hasServerlessInstance = true;
        } else {
          hasProvisionedReader = true;
          if (reader.instanceSize !== writer.instanceSize) {
            someProvisionedReadersDontMatchWriter.push(reader);
          }
        }
        if (reader.tier === highestTier) {
          if (reader.type === InstanceType.SERVERLESS_V2) {
            serverlessInHighestTier = true;
          }
          highestTierReaders.push(reader);
        }
        if (reader.tier <= 1) {
          noFailoverTierInstances = false;
        }
      }
      const hasOnlyServerlessReaders = hasServerlessReader && !hasProvisionedReader;
      if (hasOnlyServerlessReaders) {
        if (noFailoverTierInstances) {
          Annotations.of(this).addWarningV2(
            '@aws-cdk/aws-rds:noFailoverServerlessReaders',
            `Cluster ${this.node.id} only has serverless readers and no reader is in promotion tier 0-1.`+
            'Serverless readers in promotion tiers >= 2 will NOT scale with the writer, which can lead to '+
            'availability issues if a failover event occurs. It is recommended that at least one reader '+
            'has `scaleWithWriter` set to true',
          );

        }
      } else {
        if (serverlessInHighestTier && highestTier > 1) {
          Annotations.of(this).addWarningV2(
            '@aws-cdk/aws-rds:serverlessInHighestTier2-15',
            `There are serverlessV2 readers in tier ${highestTier}. Since there are no instances in a higher tier, `+
            'any instance in this tier is a failover target. Since this tier is > 1 the serverless reader will not scale '+
            'with the writer which could lead to availability issues during failover.',
          );
        }
        if (someProvisionedReadersDontMatchWriter.length > 0 && writer.type === InstanceType.PROVISIONED) {
          Annotations.of(this).addWarningV2(
            '@aws-cdk/aws-rds:provisionedReadersDontMatchWriter',
            `There are provisioned readers in the highest promotion tier ${highestTier} that do not have the same `+
            'InstanceSize as the writer. Any of these instances could be chosen as the new writer in the event '+
            'of a failover.\n'+
            `Writer InstanceSize: ${writer.instanceSize}\n`+
            `Reader InstanceSizes: ${someProvisionedReadersDontMatchWriter.map(reader => reader.instanceSize).join(', ')}`,
          );
        }
      }
    }
  }

  /**
   * Perform validations on the reader instance
   */
  private validateReaderInstance(writer: IAuroraClusterInstance, reader: IAuroraClusterInstance): void {
    if (writer.type === InstanceType.PROVISIONED) {
      if (reader.type === InstanceType.SERVERLESS_V2) {
        if (!instanceSizeSupportedByServerlessV2(writer.instanceSize!, this.serverlessV2MaxCapacity)) {
          Annotations.of(this).addWarningV2('@aws-cdk/aws-rds:serverlessInstanceCantScaleWithWriter',
            'For high availability any serverless instances in promotion tiers 0-1 '+
            'should be able to scale to match the provisioned instance capacity.\n'+
            `Serverless instance ${reader.node.id} is in promotion tier ${reader.tier},\n`+
            `But can not scale to match the provisioned writer instance (${writer.instanceSize})`,
          );
        }
      }
    }
  }

  /**
   * As a cluster-level metric, it represents the average of the ServerlessDatabaseCapacity
   * values of all the Aurora Serverless v2 DB instances in the cluster.
   */
  public metricServerlessDatabaseCapacity(props?: cloudwatch.MetricOptions) {
    return this.metric('ServerlessDatabaseCapacity', { statistic: 'Average', ...props });
  }

  /**
   * This value is represented as a percentage. It's calculated as the value of the
   * ServerlessDatabaseCapacity metric divided by the maximum ACU value of the DB cluster.
   *
   * If this metric approaches a value of 100.0, the DB instance has scaled up as high as it can.
   * Consider increasing the maximum ACU setting for the cluster.
   */
  public metricACUUtilization(props?: cloudwatch.MetricOptions) {
    return this.metric('ACUUtilization', { statistic: 'Average', ...props });
  }

  private validateServerlessScalingConfig(): void {
    if (this.serverlessV2MaxCapacity > 128 || this.serverlessV2MaxCapacity < 0.5) {
      throw new Error('serverlessV2MaxCapacity must be >= 0.5 & <= 128');
    }

    if (this.serverlessV2MinCapacity > 128 || this.serverlessV2MinCapacity < 0.5) {
      throw new Error('serverlessV2MinCapacity must be >= 0.5 & <= 128');
    }

    if (this.serverlessV2MaxCapacity < this.serverlessV2MinCapacity) {
      throw new Error('serverlessV2MaxCapacity must be greater than serverlessV2MinCapacity');
    }

    if (this.serverlessV2MaxCapacity === 0.5 && this.serverlessV2MinCapacity === 0.5) {
      throw new Error('If serverlessV2MinCapacity === 0.5 then serverlessV2MaxCapacity must be >=1');
    }
    const regexp = new RegExp(/^[0-9]+\.?5?$/);
    if (!regexp.test(this.serverlessV2MaxCapacity.toString()) || !regexp.test(this.serverlessV2MinCapacity.toString())) {
      throw new Error('serverlessV2MinCapacity & serverlessV2MaxCapacity must be in 0.5 step increments, received '+
      `min: ${this.serverlessV2MaxCapacity}, max: ${this.serverlessV2MaxCapacity}`);

    }
  }

  /**
   * Adds the single user rotation of the master password to this cluster.
   * See [Single user rotation strategy](https://docs.aws.amazon.com/secretsmanager/latest/userguide/rotating-secrets_strategies.html#rotating-secrets-one-user-one-password)
   */
  public addRotationSingleUser(options: RotationSingleUserOptions = {}): secretsmanager.SecretRotation {
    if (!this.secret) {
      throw new Error('Cannot add a single user rotation for a cluster without a secret.');
    }

    const id = 'RotationSingleUser';
    const existing = this.node.tryFindChild(id);
    if (existing) {
      throw new Error('A single user rotation was already added to this cluster.');
    }

    return new secretsmanager.SecretRotation(this, id, {
      ...applyDefaultRotationOptions(options, this.vpcSubnets),
      secret: this.secret,
      application: this.singleUserRotationApplication,
      vpc: this.vpc,
      target: this,
    });
  }

  /**
   * Adds the multi user rotation to this cluster.
   * See [Alternating users rotation strategy](https://docs.aws.amazon.com/secretsmanager/latest/userguide/rotating-secrets_strategies.html#rotating-secrets-two-users)
   */
  public addRotationMultiUser(id: string, options: RotationMultiUserOptions): secretsmanager.SecretRotation {
    if (!this.secret) {
      throw new Error('Cannot add a multi user rotation for a cluster without a secret.');
    }

    return new secretsmanager.SecretRotation(this, id, {
      ...applyDefaultRotationOptions(options, this.vpcSubnets),
      secret: options.secret,
      masterSecret: this.secret,
      application: this.multiUserRotationApplication,
      vpc: this.vpc,
      target: this,
    });
  }
}

/**
 * Represents an imported database cluster.
 */
class ImportedDatabaseCluster extends DatabaseClusterBase implements IDatabaseCluster {
  public readonly clusterIdentifier: string;
  public readonly connections: ec2.Connections;
  public readonly engine?: IClusterEngine;
  public readonly secret?: secretsmanager.ISecret;
  public readonly manageMasterUserPassword?: boolean;

  private readonly _clusterResourceIdentifier?: string;
  private readonly _clusterEndpoint?: Endpoint;
  private readonly _clusterReadEndpoint?: Endpoint;
  private readonly _instanceIdentifiers?: string[];
  private readonly _instanceEndpoints?: Endpoint[];

  protected readonly enableDataApi = false;

  constructor(scope: Construct, id: string, attrs: DatabaseClusterAttributes) {
    super(scope, id);

    this.clusterIdentifier = attrs.clusterIdentifier;
    this._clusterResourceIdentifier = attrs.clusterResourceIdentifier;

    const defaultPort = attrs.port ? ec2.Port.tcp(attrs.port) : undefined;
    this.connections = new ec2.Connections({
      securityGroups: attrs.securityGroups,
      defaultPort,
    });
    this.engine = attrs.engine;
    this.secret = attrs.secret;

    this._clusterEndpoint = (attrs.clusterEndpointAddress && attrs.port) ? new Endpoint(attrs.clusterEndpointAddress, attrs.port) : undefined;
    this._clusterReadEndpoint = (attrs.readerEndpointAddress && attrs.port) ? new Endpoint(attrs.readerEndpointAddress, attrs.port) : undefined;
    this._instanceIdentifiers = attrs.instanceIdentifiers;
    this._instanceEndpoints = (attrs.instanceEndpointAddresses && attrs.port)
      ? attrs.instanceEndpointAddresses.map(addr => new Endpoint(addr, attrs.port!))
      : undefined;
  }

  public get clusterResourceIdentifier() {
    if (!this._clusterResourceIdentifier) {
      throw new Error('Cannot access `clusterResourceIdentifier` of an imported cluster without a clusterResourceIdentifier');
    }
    return this._clusterResourceIdentifier;
  }

  public get clusterEndpoint() {
    if (!this._clusterEndpoint) {
      throw new Error('Cannot access `clusterEndpoint` of an imported cluster without an endpoint address and port');
    }
    return this._clusterEndpoint;
  }

  public get clusterReadEndpoint() {
    if (!this._clusterReadEndpoint) {
      throw new Error('Cannot access `clusterReadEndpoint` of an imported cluster without a readerEndpointAddress and port');
    }
    return this._clusterReadEndpoint;
  }

  public get instanceIdentifiers() {
    if (!this._instanceIdentifiers) {
      throw new Error('Cannot access `instanceIdentifiers` of an imported cluster without provided instanceIdentifiers');
    }
    return this._instanceIdentifiers;
  }

  public get instanceEndpoints() {
    if (!this._instanceEndpoints) {
      throw new Error('Cannot access `instanceEndpoints` of an imported cluster without instanceEndpointAddresses and port');
    }
    return this._instanceEndpoints;
  }
}

/**
 * Properties for a new database cluster
 */
export interface DatabaseClusterProps extends DatabaseClusterBaseProps {
  /**
   * Credentials for the administrative user
   *
   * @default - A username of 'admin' (or 'postgres' for PostgreSQL) and SecretsManager-generated password
   */
  readonly credentials?: Credentials;
}

/**
 * Create a clustered database with a given number of instances.
 *
 * @resource AWS::RDS::DBCluster
 */
export class DatabaseCluster extends DatabaseClusterNew {
  /**
   * Import an existing DatabaseCluster from properties
   */
  public static fromDatabaseClusterAttributes(scope: Construct, id: string, attrs: DatabaseClusterAttributes): IDatabaseCluster {
    return new ImportedDatabaseCluster(scope, id, attrs);
  }

  public readonly clusterIdentifier: string;
  public readonly clusterResourceIdentifier: string;
  public readonly clusterEndpoint: Endpoint;
  public readonly clusterReadEndpoint: Endpoint;
  public readonly connections: ec2.Connections;
  public readonly instanceIdentifiers: string[];
  public readonly instanceEndpoints: Endpoint[];

  /**
   * The secret attached to this cluster
   */
  public readonly secret?: secretsmanager.ISecret;

  constructor(scope: Construct, id: string, props: DatabaseClusterProps) {
    super(scope, id, props);

    let cluster: CfnDBCluster;
    if (!props.manageMasterUserPassword) {
      const credentials = renderCredentials(this, props.engine, props.credentials);
      const secret = credentials.secret;

      cluster = new CfnDBCluster(this, 'Resource', {
        ...this.newCfnProps,
        // Admin
        masterUsername: credentials.username,
        masterUserPassword: credentials.password?.unsafeUnwrap(),
      });

      this.clusterIdentifier = cluster.ref;
      this.clusterResourceIdentifier = cluster.attrDbClusterResourceId;

      if (secret) {
        this.secret = secret.attach(this);
      }
    } else {
      cluster = new CfnDBCluster(this, 'Resource', {
        ...this.newCfnProps,
        // Admin
        // Don't set password if RDS is managing credentials.
        masterUsername: props.credentials?.username ?? Credentials.fromUsername(props.engine.defaultUsername ?? 'admin').username,
        // Define kms key the RDS Managed Secret will use.
        ...props.credentials?.encryptionKey !== undefined && {
          masterUserSecret: {
            kmsKeyId: props.credentials.encryptionKey.keyId,
          },
        },
      });

      this.clusterIdentifier = cluster.ref;
      this.clusterResourceIdentifier = cluster.attrDbClusterResourceId;
    }

    // create a number token that represents the port of the cluster
    const portAttribute = Token.asNumber(cluster.attrEndpointPort);
    this.clusterEndpoint = new Endpoint(cluster.attrEndpointAddress, portAttribute);
    this.clusterReadEndpoint = new Endpoint(cluster.attrReadEndpointAddress, portAttribute);
    this.connections = new ec2.Connections({
      securityGroups: this.securityGroups,
      defaultPort: ec2.Port.tcp(this.clusterEndpoint.port),
    });

    cluster.applyRemovalPolicy(props.removalPolicy ?? RemovalPolicy.SNAPSHOT);

    setLogRetention(this, props);
    if ((props.writer || props.readers) && (props.instances || props.instanceProps)) {
      throw new Error('Cannot provide writer or readers if instances or instanceProps are provided');
    }

    if (!props.instanceProps && !props.writer) {
      throw new Error('writer must be provided');
    }

    const createdInstances = props.writer ? this._createInstances(this, props) : legacyCreateInstances(this, props, this.subnetGroup);
    this.instanceIdentifiers = createdInstances.instanceIdentifiers;
    this.instanceEndpoints = createdInstances.instanceEndpoints;
  }

}

/**
 * Mapping of instance type to memory setting on the xlarge size
 * The memory is predictable based on the xlarge size. For example
 * if m5.xlarge has 16GB memory then
 *   - m5.2xlarge will have 32 (16*2)
 *   - m5.4xlarge will have 62 (16*4)
 *   - m5.24xlarge will have 384 (16*24)
 */
const INSTANCE_TYPE_XLARGE_MEMORY_MAPPING: { [instanceType: string]: number } = {
  m5: 16,
  m5d: 16,
  m6g: 16,
  t4g: 16,
  t3: 16,
  m4: 16,
  r6g: 32,
  r5: 32,
  r5b: 32,
  r5d: 32,
  r4: 30.5,
  x2g: 64,
  x1e: 122,
  x1: 61,
  z1d: 32,
};

/**
 * This validates that the instance size falls within the maximum configured serverless capacity.
 *
 * @param instanceSize the instance size of the provisioned writer, e.g. r5.xlarge
 * @param serverlessV2MaxCapacity the maxCapacity configured on the cluster
 * @returns true if the instance size is supported by serverless v2 instances
 */
function instanceSizeSupportedByServerlessV2(instanceSize: string, serverlessV2MaxCapacity: number): boolean {

  const serverlessMaxMem = serverlessV2MaxCapacity*2;
  // i.e. r5.xlarge
  const sizeParts = instanceSize.split('.');
  if (sizeParts.length === 2) {
    const type = sizeParts[0];
    const size = sizeParts[1];
    const xlargeMem = INSTANCE_TYPE_XLARGE_MEMORY_MAPPING[type];
    if (size.endsWith('xlarge')) {
      const instanceMem = size === 'xlarge'
        ? xlargeMem
        : Number(size.slice(0, -6))*xlargeMem;
      if (instanceMem > serverlessMaxMem) {
        return false;
      }
    // smaller than xlarge
    } else {
      return true;
    }
  } else {
    // some weird non-standard instance types
    // not sure how to add automation around this so for now
    // just handling as one offs
    const unSupportedSizes = [
      'db.r5.2xlarge.tpc2.mem8x',
      'db.r5.4xlarge.tpc2.mem3x',
      'db.r5.4xlarge.tpc2.mem4x',
      'db.r5.6xlarge.tpc2.mem4x',
      'db.r5.8xlarge.tpc2.mem3x',
      'db.r5.12xlarge.tpc2.mem2x',
    ];
    if (unSupportedSizes.includes(instanceSize)) {
      return false;
    }
  }
  return true;
}

/**
 * Properties for ``DatabaseClusterFromSnapshot``
 */
export interface DatabaseClusterFromSnapshotProps extends DatabaseClusterBaseProps {
  /**
   * The identifier for the DB instance snapshot or DB cluster snapshot to restore from.
   * You can use either the name or the Amazon Resource Name (ARN) to specify a DB cluster snapshot.
   * However, you can use only the ARN to specify a DB instance snapshot.
   */
  readonly snapshotIdentifier: string;

  /**
   * Credentials for the administrative user
   *
   * Note - using this prop only works with `Credentials.fromPassword()` with the
   * username of the snapshot, `Credentials.fromUsername()` with the username and
   * password of the snapshot or `Credentials.fromSecret()` with a secret containing
   * the username and password of the snapshot.
   *
   * @default - A username of 'admin' (or 'postgres' for PostgreSQL) and SecretsManager-generated password
   * that **will not be applied** to the cluster, use `snapshotCredentials` for the correct behavior.
   *
   * @deprecated use `snapshotCredentials` which allows to generate a new password
   */
  readonly credentials?: Credentials;

  /**
   * Master user credentials.
   *
   * Note - It is not possible to change the master username for a snapshot;
   * however, it is possible to provide (or generate) a new password.
   *
   * @default - The existing username and password from the snapshot will be used.
   */
  readonly snapshotCredentials?: SnapshotCredentials;
}

/**
 * A database cluster restored from a snapshot.
 *
 * @resource AWS::RDS::DBCluster
 */
export class DatabaseClusterFromSnapshot extends DatabaseClusterNew {
  public readonly clusterIdentifier: string;
  public readonly clusterResourceIdentifier: string;
  public readonly clusterEndpoint: Endpoint;
  public readonly clusterReadEndpoint: Endpoint;
  public readonly connections: ec2.Connections;
  public readonly instanceIdentifiers: string[];
  public readonly instanceEndpoints: Endpoint[];

  /**
   * The secret attached to this cluster
   */
  public readonly secret?: secretsmanager.ISecret;

  constructor(scope: Construct, id: string, props: DatabaseClusterFromSnapshotProps) {
    super(scope, id, props);

    if (props.credentials && !props.credentials.password && !props.credentials.secret) {
      Annotations.of(this).addWarningV2('@aws-cdk/aws-rds:useSnapshotCredentials', 'Use `snapshotCredentials` to modify password of a cluster created from a snapshot.');
    }
    if (!props.credentials && !props.snapshotCredentials) {
      Annotations.of(this).addWarningV2('@aws-cdk/aws-rds:generatedCredsNotApplied', 'Generated credentials will not be applied to cluster. Use `snapshotCredentials` instead. `addRotationSingleUser()` and `addRotationMultiUser()` cannot be used on this cluster.');
    }

    const deprecatedCredentials = !FeatureFlags.of(this).isEnabled(cxapi.RDS_PREVENT_RENDERING_DEPRECATED_CREDENTIALS)
      ? renderCredentials(this, props.engine, props.credentials)
      : undefined;

    const credentials = renderSnapshotCredentials(this, props.snapshotCredentials);

    const cluster = new CfnDBCluster(this, 'Resource', {
      ...this.newCfnProps,
      snapshotIdentifier: props.snapshotIdentifier,
      masterUserPassword: credentials?.secret?.secretValueFromJson('password')?.unsafeUnwrap() ?? credentials?.password?.unsafeUnwrap(), // Safe usage
    });

    this.clusterIdentifier = cluster.ref;
    this.clusterResourceIdentifier = cluster.attrDbClusterResourceId;

    if (credentials?.secret) {
      this.secret = credentials.secret.attach(this);
    }

    if (deprecatedCredentials?.secret) {
      const deprecatedSecret = deprecatedCredentials.secret.attach(this);
      if (!this.secret) {
        this.secret = deprecatedSecret;
      }
    }

    // create a number token that represents the port of the cluster
    const portAttribute = Token.asNumber(cluster.attrEndpointPort);
    this.clusterEndpoint = new Endpoint(cluster.attrEndpointAddress, portAttribute);
    this.clusterReadEndpoint = new Endpoint(cluster.attrReadEndpointAddress, portAttribute);
    this.connections = new ec2.Connections({
      securityGroups: this.securityGroups,
      defaultPort: ec2.Port.tcp(this.clusterEndpoint.port),
    });

    cluster.applyRemovalPolicy(props.removalPolicy ?? RemovalPolicy.SNAPSHOT);

    setLogRetention(this, props);
    if ((props.writer || props.readers) && (props.instances || props.instanceProps)) {
      throw new Error('Cannot provide clusterInstances if instances or instanceProps are provided');
    }
    const createdInstances = props.writer ? this._createInstances(this, props) : legacyCreateInstances(this, props, this.subnetGroup);
    this.instanceIdentifiers = createdInstances.instanceIdentifiers;
    this.instanceEndpoints = createdInstances.instanceEndpoints;
  }
}

/**
 * Sets up CloudWatch log retention if configured.
 * A function rather than protected member to prevent exposing ``DatabaseClusterBaseProps``.
 */
function setLogRetention(cluster: DatabaseClusterNew, props: DatabaseClusterBaseProps) {
  if (props.cloudwatchLogsExports) {
    const unsupportedLogTypes = props.cloudwatchLogsExports.filter(logType => !props.engine.supportedLogTypes.includes(logType));
    if (unsupportedLogTypes.length > 0) {
      throw new Error(`Unsupported logs for the current engine type: ${unsupportedLogTypes.join(',')}`);
    }

    if (props.cloudwatchLogsRetention) {
      for (const log of props.cloudwatchLogsExports) {
        const logGroupName = `/aws/rds/cluster/${cluster.clusterIdentifier}/${log}`;
        new logs.LogRetention(cluster, `LogRetention${log}`, {
          logGroupName,
          retention: props.cloudwatchLogsRetention,
          role: props.cloudwatchLogsRetentionRole,
        });
        cluster.cloudwatchLogGroups[log] = logs.LogGroup.fromLogGroupName(cluster, `LogGroup${cluster.clusterIdentifier}${log}`, logGroupName);
      }
    }
  }
}

/** Output from the createInstances method; used to set instance identifiers and endpoints */
interface InstanceConfig {
  readonly instanceIdentifiers: string[];
  readonly instanceEndpoints: Endpoint[];
}

/**
 * Creates the instances for the cluster.
 * A function rather than a protected method on ``DatabaseClusterNew`` to avoid exposing
 * ``DatabaseClusterNew`` and ``DatabaseClusterBaseProps`` in the API.
 */
function legacyCreateInstances(cluster: DatabaseClusterNew, props: DatabaseClusterBaseProps, subnetGroup: ISubnetGroup): InstanceConfig {
  const instanceCount = props.instances != null ? props.instances : 2;
  const instanceUpdateBehaviour = props.instanceUpdateBehaviour ?? InstanceUpdateBehaviour.BULK;
  if (Token.isUnresolved(instanceCount)) {
    throw new Error('The number of instances an RDS Cluster consists of cannot be provided as a deploy-time only value!');
  }
  if (instanceCount < 1) {
    throw new Error('At least one instance is required');
  }

  const instanceIdentifiers: string[] = [];
  const instanceEndpoints: Endpoint[] = [];
  const portAttribute = cluster.clusterEndpoint.port;
  const instanceProps = props.instanceProps!;

  // Get the actual subnet objects so we can depend on internet connectivity.
  const internetConnected = instanceProps.vpc.selectSubnets(instanceProps.vpcSubnets).internetConnectivityEstablished;

  let monitoringRole;
  if (props.monitoringInterval && props.monitoringInterval.toSeconds()) {
    monitoringRole = props.monitoringRole || new Role(cluster, 'MonitoringRole', {
      assumedBy: new ServicePrincipal('monitoring.rds.amazonaws.com'),
      managedPolicies: [
        ManagedPolicy.fromAwsManagedPolicyName('service-role/AmazonRDSEnhancedMonitoringRole'),
      ],
    });
  }

  const enablePerformanceInsights = instanceProps.enablePerformanceInsights
    || instanceProps.performanceInsightRetention !== undefined || instanceProps.performanceInsightEncryptionKey !== undefined;
  if (enablePerformanceInsights && instanceProps.enablePerformanceInsights === false) {
    throw new Error('`enablePerformanceInsights` disabled, but `performanceInsightRetention` or `performanceInsightEncryptionKey` was set');
  }

  const instanceType = instanceProps.instanceType ?? ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MEDIUM);

  if (instanceProps.parameterGroup && instanceProps.parameters) {
    throw new Error('You cannot specify both parameterGroup and parameters');
  }

  const instanceParameterGroup = instanceProps.parameterGroup ?? (
    instanceProps.parameters
      ? new ParameterGroup(cluster, 'InstanceParameterGroup', {
        engine: props.engine,
        parameters: instanceProps.parameters,
      })
      : undefined
  );
  const instanceParameterGroupConfig = instanceParameterGroup?.bindToInstance({});

  const instances: CfnDBInstance[] = [];

  for (let i = 0; i < instanceCount; i++) {
    const instanceIndex = i + 1;
    const instanceIdentifier = props.instanceIdentifierBase != null ? `${props.instanceIdentifierBase}${instanceIndex}` :
      props.clusterIdentifier != null ? `${props.clusterIdentifier}instance${instanceIndex}` :
        undefined;

    const instance = new CfnDBInstance(cluster, `Instance${instanceIndex}`, {
      // Link to cluster
      engine: props.engine.engineType,
      dbClusterIdentifier: cluster.clusterIdentifier,
      dbInstanceIdentifier: instanceIdentifier,
      // Instance properties
      dbInstanceClass: databaseInstanceType(instanceType),
      publiclyAccessible: instanceProps.publiclyAccessible ??
        (instanceProps.vpcSubnets && instanceProps.vpcSubnets.subnetType === ec2.SubnetType.PUBLIC),
      enablePerformanceInsights: enablePerformanceInsights || instanceProps.enablePerformanceInsights, // fall back to undefined if not set
      performanceInsightsKmsKeyId: instanceProps.performanceInsightEncryptionKey?.keyArn,
      performanceInsightsRetentionPeriod: enablePerformanceInsights
        ? (instanceProps.performanceInsightRetention || PerformanceInsightRetention.DEFAULT)
        : undefined,
      // This is already set on the Cluster. Unclear to me whether it should be repeated or not. Better yes.
      dbSubnetGroupName: subnetGroup.subnetGroupName,
      dbParameterGroupName: instanceParameterGroupConfig?.parameterGroupName,
      monitoringInterval: props.monitoringInterval && props.monitoringInterval.toSeconds(),
      monitoringRoleArn: monitoringRole && monitoringRole.roleArn,
      autoMinorVersionUpgrade: instanceProps.autoMinorVersionUpgrade,
      allowMajorVersionUpgrade: instanceProps.allowMajorVersionUpgrade,
      deleteAutomatedBackups: instanceProps.deleteAutomatedBackups,
      preferredMaintenanceWindow: instanceProps.preferredMaintenanceWindow,
    });

    // For instances that are part of a cluster:
    //
    //  Cluster DESTROY or SNAPSHOT -> DESTROY (snapshot is good enough to recreate)
    //  Cluster RETAIN              -> RETAIN (otherwise cluster state will disappear)
    instance.applyRemovalPolicy(helperRemovalPolicy(props.removalPolicy));

    // We must have a dependency on the NAT gateway provider here to create
    // things in the right order.
    instance.node.addDependency(internetConnected);

    instanceIdentifiers.push(instance.ref);
    instanceEndpoints.push(new Endpoint(instance.attrEndpointAddress, portAttribute));
    instances.push(instance);
  }

  // Adding dependencies here to ensure that the instances are updated one after the other.
  if (instanceUpdateBehaviour === InstanceUpdateBehaviour.ROLLING) {
    for (let i = 1; i < instanceCount; i++) {
      instances[i].node.addDependency(instances[i-1]);
    }
  }

  return { instanceEndpoints, instanceIdentifiers };
}

/**
 * Turn a regular instance type into a database instance type
 */
function databaseInstanceType(instanceType: ec2.InstanceType) {
  return 'db.' + instanceType.toString();
}
