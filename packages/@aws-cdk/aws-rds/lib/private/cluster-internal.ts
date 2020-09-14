import * as ec2 from '@aws-cdk/aws-ec2';
import { IRole, Role, ServicePrincipal } from '@aws-cdk/aws-iam';
import * as logs from '@aws-cdk/aws-logs';
import * as s3 from '@aws-cdk/aws-s3';
import * as secretsmanager from '@aws-cdk/aws-secretsmanager';
import { Annotations, CfnDeletionPolicy, Construct, Duration, RemovalPolicy, Resource } from '@aws-cdk/core';
import { IClusterEngine } from '../cluster-engine';
import { DatabaseClusterAttributes, IDatabaseCluster } from '../cluster-ref';
import { Endpoint } from '../endpoint';
import { IParameterGroup } from '../parameter-group';
import { BackupProps, InstanceProps } from '../props';
import { DatabaseProxy, DatabaseProxyOptions, ProxyTarget } from '../proxy';
import { CfnDBCluster, CfnDBClusterProps, CfnDBSubnetGroup } from '../rds.generated';

/**
 * Common properties for a new database cluster or cluster from snapshot.
 * @internal
 */
export interface DatabaseClusterBaseProps {
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
 * @internal
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
 * @internal
 */
export abstract class DatabaseClusterNew extends DatabaseClusterBase {

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
 * Represents an imported database cluster.
 * @internal
 */
export class ImportedDatabaseCluster extends DatabaseClusterBase implements IDatabaseCluster {
  public readonly clusterIdentifier: string;
  public readonly connections: ec2.Connections;

  private readonly _clusterEndpoint?: Endpoint;
  private readonly _clusterReadEndpoint?: Endpoint;
  private readonly _instanceIdentifiers?: string[];
  private readonly _instanceEndpoints?: Endpoint[];

  constructor(scope: Construct, id: string, attrs: DatabaseClusterAttributes) {
    super(scope, id);

    this.clusterIdentifier = attrs.clusterIdentifier;

    const defaultPort = attrs.port ? ec2.Port.tcp(attrs.port) : undefined;
    this.connections = new ec2.Connections({
      securityGroups: attrs.securityGroups,
      defaultPort,
    });

    this._clusterEndpoint = (attrs.clusterEndpointAddress && attrs.port) ? new Endpoint(attrs.clusterEndpointAddress, attrs.port) : undefined;
    this._clusterReadEndpoint = (attrs.readerEndpointAddress && attrs.port) ? new Endpoint(attrs.readerEndpointAddress, attrs.port) : undefined;
    this._instanceIdentifiers = attrs.instanceIdentifiers;
    this._instanceEndpoints = (attrs.instanceEndpointAddresses && attrs.port)
      ? attrs.instanceEndpointAddresses.map(addr => new Endpoint(addr, attrs.port!))
      : undefined;
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
