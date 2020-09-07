import * as ec2 from '@aws-cdk/aws-ec2';
import { IRole, ManagedPolicy, Role, ServicePrincipal } from '@aws-cdk/aws-iam';
import * as kms from '@aws-cdk/aws-kms';
import * as logs from '@aws-cdk/aws-logs';
import * as s3 from '@aws-cdk/aws-s3';
import * as secretsmanager from '@aws-cdk/aws-secretsmanager';
import { Annotations, CfnDeletionPolicy, Construct, Duration, RemovalPolicy, Resource, Token } from '@aws-cdk/core';
import { IClusterEngine } from './cluster-engine';
import { DatabaseClusterAttributes, IDatabaseCluster } from './cluster-ref';
import { DatabaseSecret } from './database-secret';
import { Endpoint } from './endpoint';
import { IParameterGroup } from './parameter-group';
import { BackupProps, InstanceProps, Login, PerformanceInsightRetention, RotationMultiUserOptions } from './props';
import { DatabaseProxy, DatabaseProxyOptions, ProxyTarget } from './proxy';
import { CfnDBCluster, CfnDBClusterProps, CfnDBInstance, CfnDBSubnetGroup } from './rds.generated';

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
   */
  readonly instances?: number;

  /**
   * Settings for the individual instances that are launched
   */
  readonly instanceProps: InstanceProps;

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
   * @default false
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
   *
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
   *
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
}

/**
 * A new or imported clustered database.
 */
export abstract class DatabaseClusterBase extends Resource implements IDatabaseCluster {
  /**
   * Identifier of the cluster
   */
  public abstract readonly clusterIdentifier: string;
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
}

/**
 * Abstract base for ``DatabaseCluster`` and ``DatabaseClusterFromSnapshot``
 */
abstract class DatabaseClusterNew extends DatabaseClusterBase {

  public readonly instanceIdentifiers: string[] = [];
  public readonly instanceEndpoints: Endpoint[] = [];

  protected readonly newCfnProps: CfnDBClusterProps;
  protected readonly subnetGroup: CfnDBSubnetGroup;
  protected readonly securityGroups: ec2.ISecurityGroup[];

  constructor(scope: Construct, id: string, props: DatabaseClusterBaseProps) {
    super(scope, id);

    const { subnetIds } = props.instanceProps.vpc.selectSubnets(props.instanceProps.vpcSubnets);

    // Cannot test whether the subnets are in different AZs, but at least we can test the amount.
    if (subnetIds.length < 2) {
      Annotations.of(this).addError(`Cluster requires at least 2 subnets, got ${subnetIds.length}`);
    }

    this.subnetGroup = new CfnDBSubnetGroup(this, 'Subnets', {
      dbSubnetGroupDescription: `Subnets for ${id} database`,
      subnetIds,
    });
    if (props.removalPolicy === RemovalPolicy.RETAIN) {
      this.subnetGroup.applyRemovalPolicy(RemovalPolicy.RETAIN);
    }

    this.securityGroups = props.instanceProps.securityGroups ?? [
      new ec2.SecurityGroup(this, 'SecurityGroup', {
        description: 'RDS security group',
        vpc: props.instanceProps.vpc,
      }),
    ];

    const clusterAssociatedRoles: CfnDBCluster.DBClusterRoleProperty[] = [];
    let { s3ImportRole, s3ExportRole } = this.setupS3ImportExport(props);
    if (s3ImportRole) {
      clusterAssociatedRoles.push({ roleArn: s3ImportRole.roleArn });
    }
    if (s3ExportRole) {
      clusterAssociatedRoles.push({ roleArn: s3ExportRole.roleArn });
    }

    // bind the engine to the Cluster
    const clusterEngineBindConfig = props.engine.bindToCluster(this, {
      s3ImportRole,
      s3ExportRole,
      parameterGroup: props.parameterGroup,
    });
    const clusterParameterGroup = props.parameterGroup ?? clusterEngineBindConfig.parameterGroup;
    const clusterParameterGroupConfig = clusterParameterGroup?.bindToCluster({});

    this.newCfnProps = {
      // Basic
      engine: props.engine.engineType,
      engineVersion: props.engine.engineVersion?.fullVersion,
      dbClusterIdentifier: props.clusterIdentifier,
      dbSubnetGroupName: this.subnetGroup.ref,
      vpcSecurityGroupIds: this.securityGroups.map(sg => sg.securityGroupId),
      port: props.port ?? clusterEngineBindConfig.port,
      dbClusterParameterGroupName: clusterParameterGroupConfig?.parameterGroupName,
      associatedRoles: clusterAssociatedRoles.length > 0 ? clusterAssociatedRoles : undefined,
      deletionProtection: props.deletionProtection,
      // Admin
      backupRetentionPeriod: props.backup?.retention?.toDays(),
      preferredBackupWindow: props.backup?.preferredWindow,
      preferredMaintenanceWindow: props.preferredMaintenanceWindow,
      databaseName: props.defaultDatabaseName,
      enableCloudwatchLogsExports: props.cloudwatchLogsExports,
    };
  }

  protected setRemovalPolicy(cluster: CfnDBCluster, removalPolicy?: RemovalPolicy) {
    // if removalPolicy was not specified,
    // leave it as the default, which is Snapshot
    if (removalPolicy) {
      cluster.applyRemovalPolicy(removalPolicy);
    } else {
      // The CFN default makes sense for DeletionPolicy,
      // but doesn't cover UpdateReplacePolicy.
      // Fix that here.
      cluster.cfnOptions.updateReplacePolicy = CfnDeletionPolicy.SNAPSHOT;
    }
  }

  private setupS3ImportExport(props: DatabaseClusterBaseProps): { s3ImportRole?: IRole, s3ExportRole?: IRole } {
    let s3ImportRole = props.s3ImportRole;
    if (props.s3ImportBuckets && props.s3ImportBuckets.length > 0) {
      if (props.s3ImportRole) {
        throw new Error('Only one of s3ImportRole or s3ImportBuckets must be specified, not both.');
      }

      s3ImportRole = new Role(this, 'S3ImportRole', {
        assumedBy: new ServicePrincipal('rds.amazonaws.com'),
      });
      for (const bucket of props.s3ImportBuckets) {
        bucket.grantRead(s3ImportRole);
      }
    }

    let s3ExportRole = props.s3ExportRole;
    if (props.s3ExportBuckets && props.s3ExportBuckets.length > 0) {
      if (props.s3ExportRole) {
        throw new Error('Only one of s3ExportRole or s3ExportBuckets must be specified, not both.');
      }

      s3ExportRole = new Role(this, 'S3ExportRole', {
        assumedBy: new ServicePrincipal('rds.amazonaws.com'),
      });
      for (const bucket of props.s3ExportBuckets) {
        bucket.grantReadWrite(s3ExportRole);
      }
    }

    return { s3ImportRole, s3ExportRole };
  }
}

/**
 * Properties for a new database cluster
 */
export interface DatabaseClusterProps extends DatabaseClusterBaseProps {
  /**
   * Username and password for the administrative user
   */
  readonly masterUser: Login;

  /**
   * Whether to enable storage encryption.
   *
   * @default - true if storageEncryptionKey is provided, false otherwise
   */
  readonly storageEncrypted?: boolean

  /**
   * The KMS key for storage encryption.
   * If specified, {@link storageEncrypted} will be set to `true`.
   *
   * @default - if storageEncrypted is true then the default master key, no key otherwise
   */
  readonly storageEncryptionKey?: kms.IKey;
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
    class Import extends DatabaseClusterBase implements IDatabaseCluster {
      public readonly defaultPort = ec2.Port.tcp(attrs.port);
      public readonly connections = new ec2.Connections({
        securityGroups: attrs.securityGroups,
        defaultPort: this.defaultPort,
      });
      public readonly clusterIdentifier = attrs.clusterIdentifier;
      public readonly instanceIdentifiers: string[] = [];
      public readonly clusterEndpoint = new Endpoint(attrs.clusterEndpointAddress, attrs.port);
      public readonly clusterReadEndpoint = new Endpoint(attrs.readerEndpointAddress, attrs.port);
      public readonly instanceEndpoints = attrs.instanceEndpointAddresses.map(a => new Endpoint(a, attrs.port));
    }

    return new Import(scope, id);
  }

  public readonly clusterIdentifier: string;
  public readonly clusterEndpoint: Endpoint;
  public readonly clusterReadEndpoint: Endpoint;
  public readonly connections: ec2.Connections;

  /**
   * The secret attached to this cluster
   */
  public readonly secret?: secretsmanager.ISecret;

  private readonly vpc: ec2.IVpc;
  private readonly vpcSubnets?: ec2.SubnetSelection;

  private readonly singleUserRotationApplication: secretsmanager.SecretRotationApplication;
  private readonly multiUserRotationApplication: secretsmanager.SecretRotationApplication;

  constructor(scope: Construct, id: string, props: DatabaseClusterProps) {
    super(scope, id, props);

    this.vpc = props.instanceProps.vpc;
    this.vpcSubnets = props.instanceProps.vpcSubnets;

    this.singleUserRotationApplication = props.engine.singleUserRotationApplication;
    this.multiUserRotationApplication = props.engine.multiUserRotationApplication;

    let secret: DatabaseSecret | undefined;
    if (!props.masterUser.password) {
      secret = new DatabaseSecret(this, 'Secret', {
        username: props.masterUser.username,
        encryptionKey: props.masterUser.encryptionKey,
      });
    }

    const cluster = new CfnDBCluster(this, 'Resource', {
      ...this.newCfnProps,
      // Admin
      masterUsername: secret ? secret.secretValueFromJson('username').toString() : props.masterUser.username,
      masterUserPassword: secret
        ? secret.secretValueFromJson('password').toString()
        : (props.masterUser.password
          ? props.masterUser.password.toString()
          : undefined),
      // Encryption
      kmsKeyId: props.storageEncryptionKey?.keyArn,
      storageEncrypted: props.storageEncryptionKey ? true : props.storageEncrypted,
    });

    this.clusterIdentifier = cluster.ref;

    // create a number token that represents the port of the cluster
    const portAttribute = Token.asNumber(cluster.attrEndpointPort);
    this.clusterEndpoint = new Endpoint(cluster.attrEndpointAddress, portAttribute);
    this.clusterReadEndpoint = new Endpoint(cluster.attrReadEndpointAddress, portAttribute);
    this.connections = new ec2.Connections({
      securityGroups: this.securityGroups,
      defaultPort: ec2.Port.tcp(this.clusterEndpoint.port),
    });

    this.setRemovalPolicy(cluster, props.removalPolicy);

    if (secret) {
      this.secret = secret.attach(this);
    }

    setLogRetention(this, props);
    createInstances(this, props, this.subnetGroup);
  }

  /**
   * Adds the single user rotation of the master password to this cluster.
   *
   * @param [automaticallyAfter=Duration.days(30)] Specifies the number of days after the previous rotation
   * before Secrets Manager triggers the next automatic rotation.
   */
  public addRotationSingleUser(automaticallyAfter?: Duration): secretsmanager.SecretRotation {
    if (!this.secret) {
      throw new Error('Cannot add single user rotation for a cluster without secret.');
    }

    const id = 'RotationSingleUser';
    const existing = this.node.tryFindChild(id);
    if (existing) {
      throw new Error('A single user rotation was already added to this cluster.');
    }

    return new secretsmanager.SecretRotation(this, id, {
      secret: this.secret,
      automaticallyAfter,
      application: this.singleUserRotationApplication,
      vpc: this.vpc,
      vpcSubnets: this.vpcSubnets,
      target: this,
    });
  }

  /**
   * Adds the multi user rotation to this cluster.
   */
  public addRotationMultiUser(id: string, options: RotationMultiUserOptions): secretsmanager.SecretRotation {
    if (!this.secret) {
      throw new Error('Cannot add multi user rotation for a cluster without secret.');
    }
    return new secretsmanager.SecretRotation(this, id, {
      secret: options.secret,
      masterSecret: this.secret,
      automaticallyAfter: options.automaticallyAfter,
      application: this.multiUserRotationApplication,
      vpc: this.vpc,
      vpcSubnets: this.vpcSubnets,
      target: this,
    });
  }
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
}

/**
 * A database cluster restored from a snapshot.
 *
 * @resource AWS::RDS::DBInstance
 */
export class DatabaseClusterFromSnapshot extends DatabaseClusterNew {
  public readonly clusterIdentifier: string;
  public readonly clusterEndpoint: Endpoint;
  public readonly clusterReadEndpoint: Endpoint;
  public readonly connections: ec2.Connections;

  constructor(scope: Construct, id: string, props: DatabaseClusterFromSnapshotProps) {
    super(scope, id, props);

    const cluster = new CfnDBCluster(this, 'Resource', {
      ...this.newCfnProps,
      snapshotIdentifier: props.snapshotIdentifier,
    });

    this.clusterIdentifier = cluster.ref;

    // create a number token that represents the port of the cluster
    const portAttribute = Token.asNumber(cluster.attrEndpointPort);
    this.clusterEndpoint = new Endpoint(cluster.attrEndpointAddress, portAttribute);
    this.clusterReadEndpoint = new Endpoint(cluster.attrReadEndpointAddress, portAttribute);
    this.connections = new ec2.Connections({
      securityGroups: this.securityGroups,
      defaultPort: ec2.Port.tcp(this.clusterEndpoint.port),
    });

    this.setRemovalPolicy(cluster, props.removalPolicy);

    setLogRetention(this, props);
    createInstances(this, props, this.subnetGroup);
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
        new logs.LogRetention(cluster, `LogRetention${log}`, {
          logGroupName: `/aws/rds/cluster/${cluster.clusterIdentifier}/${log}`,
          retention: props.cloudwatchLogsRetention,
          role: props.cloudwatchLogsRetentionRole,
        });
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
function createInstances(cluster: DatabaseClusterNew, props: DatabaseClusterBaseProps, subnetGroup: CfnDBSubnetGroup): InstanceConfig {
  const instanceCount = props.instances != null ? props.instances : 2;
  if (instanceCount < 1) {
    throw new Error('At least one instance is required');
  }

  const instanceIdentifiers: string[] = [];
  const instanceEndpoints: Endpoint[] = [];
  const portAttribute = cluster.clusterEndpoint.port;
  const instanceProps = props.instanceProps;

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
  const instanceParameterGroupConfig = instanceProps.parameterGroup?.bindToInstance({});
  for (let i = 0; i < instanceCount; i++) {
    const instanceIndex = i + 1;
    const instanceIdentifier = props.instanceIdentifierBase != null ? `${props.instanceIdentifierBase}${instanceIndex}` :
      props.clusterIdentifier != null ? `${props.clusterIdentifier}instance${instanceIndex}` :
        undefined;

    const publiclyAccessible = instanceProps.vpcSubnets && instanceProps.vpcSubnets.subnetType === ec2.SubnetType.PUBLIC;

    const instance = new CfnDBInstance(cluster, `Instance${instanceIndex}`, {
      // Link to cluster
      engine: props.engine.engineType,
      engineVersion: props.engine.engineVersion?.fullVersion,
      dbClusterIdentifier: cluster.clusterIdentifier,
      dbInstanceIdentifier: instanceIdentifier,
      // Instance properties
      dbInstanceClass: databaseInstanceType(instanceType),
      publiclyAccessible,
      enablePerformanceInsights: enablePerformanceInsights || instanceProps.enablePerformanceInsights, // fall back to undefined if not set
      performanceInsightsKmsKeyId: instanceProps.performanceInsightEncryptionKey?.keyArn,
      performanceInsightsRetentionPeriod: enablePerformanceInsights
        ? (instanceProps.performanceInsightRetention || PerformanceInsightRetention.DEFAULT)
        : undefined,
      // This is already set on the Cluster. Unclear to me whether it should be repeated or not. Better yes.
      dbSubnetGroupName: subnetGroup.ref,
      dbParameterGroupName: instanceParameterGroupConfig?.parameterGroupName,
      monitoringInterval: props.monitoringInterval && props.monitoringInterval.toSeconds(),
      monitoringRoleArn: monitoringRole && monitoringRole.roleArn,
    });

    // If removalPolicy isn't explicitly set,
    // it's Snapshot for Cluster.
    // Because of that, in this case,
    // we can safely use the CFN default of Delete for DbInstances with dbClusterIdentifier set.
    if (props.removalPolicy) {
      instance.applyRemovalPolicy(props.removalPolicy);
    }

    // We must have a dependency on the NAT gateway provider here to create
    // things in the right order.
    instance.node.addDependency(internetConnected);

    instanceIdentifiers.push(instance.ref);
    instanceEndpoints.push(new Endpoint(instance.attrEndpointAddress, portAttribute));
  }

  return { instanceEndpoints, instanceIdentifiers };
}

/**
 * Turn a regular instance type into a database instance type
 */
function databaseInstanceType(instanceType: ec2.InstanceType) {
  return 'db.' + instanceType.toString();
}
