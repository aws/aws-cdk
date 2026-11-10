import type { Construct, IConstruct } from 'constructs';
import type { DBClusterStorageType } from './cluster';
import { DatabaseClusterBase } from './cluster';
import type { IClusterEngine } from './cluster-engine';
import { DatabaseClusterEngine } from './cluster-engine';
import { DatabaseInsightsMode } from './database-insights-mode';
import { Endpoint } from './endpoint';
import { defaultDeletionProtection } from './private/util';
import type { BackupProps } from './props';
import { PerformanceInsightRetention } from './props';
import type { DatabaseProxy, DatabaseProxyOptions } from './proxy';
import { CfnDBCluster } from './rds.generated';
import * as ec2 from '../../aws-ec2';
import type { IRole } from '../../aws-iam';
import type * as kms from '../../aws-kms';
import * as logs from '../../aws-logs';
import type * as secretsmanager from '../../aws-secretsmanager';
import type { Duration, IAspect } from '../../core';
import { Annotations, AspectPriority, Aspects, RemovalPolicy, Token } from '../../core';
import { ValidationError } from '../../core/lib/errors';
import { addConstructMetadata, MethodMetadata } from '../../core/lib/metadata-resource';
import { lit } from '../../core/lib/private/literal-string';
import { propertyInjectable } from '../../core/lib/prop-injectable';

/**
 * Properties for a new Aurora PostgreSQL cluster with express configuration.
 */
export interface ExpressClusterProps {
  /**
   * An optional identifier for the cluster.
   *
   * @default - A name is automatically generated.
   */
  readonly clusterIdentifier?: string;

  /**
   * The name of the master user.
   *
   * A cluster with express configuration supports IAM database authentication only,
   * so no password is set for this user. Use `grantConnect()` to allow an IAM principal to connect as this user.
   *
   * @default 'postgres'
   */
  readonly masterUsername?: string;

  /**
   * Backup settings.
   *
   * @default - Backup retention period of 1 day and the backup window is selected by RDS.
   * @see https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_WorkingWithAutomatedBackups.html#USER_WorkingWithAutomatedBackups.BackupWindow
   */
  readonly backup?: BackupProps;

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
   * The minimum number of Aurora capacity units (ACUs) for the Aurora Serverless writer instance.
   *
   * Valid values are 0 to 256 in increments of 0.5. A value of 0 lets the instance automatically pause.
   *
   * @default - 0 ACU when any of the Aurora Serverless v2 capacity settings is specified,
   * otherwise the express configuration default (0 ACU)
   */
  readonly serverlessV2MinCapacity?: number;

  /**
   * The maximum number of Aurora capacity units (ACUs) for the Aurora Serverless writer instance.
   *
   * Valid values are 1 to 256 in increments of 0.5.
   *
   * @default - 16 ACU when any of the Aurora Serverless v2 capacity settings is specified,
   * otherwise the express configuration default (16 ACU)
   */
  readonly serverlessV2MaxCapacity?: number;

  /**
   * The amount of time that the Aurora Serverless writer instance can be idle before it is automatically paused.
   *
   * Only used when `serverlessV2MinCapacity` is 0. Valid values are 5 minutes to 24 hours.
   *
   * @default - the express configuration default (5 minutes)
   */
  readonly serverlessV2AutoPauseDuration?: Duration;

  /**
   * The storage type of the cluster.
   *
   * @default - DBClusterStorageType.AURORA (Aurora Standard)
   */
  readonly storageType?: DBClusterStorageType;

  /**
   * The list of log types that need to be enabled for exporting to CloudWatch Logs.
   *
   * Valid values are 'postgresql', 'iam-db-auth-error' and 'instance'.
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
   * [disable-awslint:prefer-ref-interface] `logs.LogRetention` requires an `IRole`.
   *
   * @default - a new role is created.
   */
  readonly cloudwatchLogsRetentionRole?: IRole;

  /**
   * Whether to enable Performance Insights for the cluster.
   *
   * @default - false, unless `performanceInsightRetention` or `performanceInsightEncryptionKey` is set,
   * or `databaseInsightsMode` is set to `DatabaseInsightsMode.ADVANCED`.
   */
  readonly enablePerformanceInsights?: boolean;

  /**
   * The amount of time, in days, to retain Performance Insights data.
   *
   * If you set `databaseInsightsMode` to `DatabaseInsightsMode.ADVANCED`, you must set this property to `PerformanceInsightRetention.MONTHS_15`.
   *
   * @default - 7 days if Performance Insights is enabled
   */
  readonly performanceInsightRetention?: PerformanceInsightRetention;

  /**
   * The AWS KMS key for encryption of Performance Insights data.
   *
   * @default - default master key
   */
  readonly performanceInsightEncryptionKey?: kms.IKeyRef;

  /**
   * The database insights mode.
   *
   * @default - DatabaseInsightsMode.STANDARD when Performance Insights is enabled, otherwise Database Insights is disabled.
   */
  readonly databaseInsightsMode?: DatabaseInsightsMode;

  /**
   * Whether to copy tags to the snapshot when a snapshot is created.
   *
   * @default - true
   */
  readonly copyTagsToSnapshot?: boolean;

  /**
   * Whether minor engine upgrades are applied automatically to the cluster during the maintenance window.
   *
   * @default true
   */
  readonly autoMinorVersionUpgrade?: boolean;

  /**
   * Indicates whether the DB cluster should have deletion protection enabled.
   *
   * @default - true if `removalPolicy` is RETAIN, `undefined` otherwise, which will not enable deletion protection.
   * To disable deletion protection after it has been enabled, you must explicitly set this value to `false`.
   */
  readonly deletionProtection?: boolean;

  /**
   * The removal policy to apply when the cluster is removed or replaced during a stack update,
   * or when the stack is deleted.
   *
   * @default - RemovalPolicy.SNAPSHOT (remove the cluster but retain a snapshot of the data)
   */
  readonly removalPolicy?: RemovalPolicy;
}

/**
 * Create an Aurora PostgreSQL cluster with express configuration.
 *
 * A cluster with express configuration is created in seconds with an Aurora Serverless writer instance,
 * the default engine version and parameter group, and IAM database authentication.
 * It is not associated with a VPC. Clients connect to it through an internet access gateway.
 *
 * @see https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/CHAP_GettingStartedAurora.AuroraPostgreSQL.ExpressConfig.html
 * @resource AWS::RDS::DBCluster
 */
@propertyInjectable
export class ExpressCluster extends DatabaseClusterBase {
  /**
   * Uniquely identifies this class.
   */
  public static readonly PROPERTY_INJECTION_ID: string = 'aws-cdk-lib.aws-rds.ExpressCluster';

  /**
   * The engine of this cluster, which is always the default version of Aurora PostgreSQL.
   */
  public readonly engine?: IClusterEngine = DatabaseClusterEngine.AURORA_POSTGRESQL;

  public readonly clusterIdentifier: string;
  public readonly clusterResourceIdentifier: string;
  public readonly clusterEndpoint: Endpoint;
  public readonly clusterReadEndpoint: Endpoint;

  /**
   * Identifiers of the instances.
   *
   * Always empty because the writer instance of a cluster with express configuration
   * is created by RDS and is not managed by this construct.
   */
  public readonly instanceIdentifiers: string[] = [];

  /**
   * Endpoints which address each individual instance.
   *
   * Always empty because the writer instance of a cluster with express configuration
   * is created by RDS and is not managed by this construct.
   */
  public readonly instanceEndpoints: Endpoint[] = [];

  /**
   * Access to the network connections.
   *
   * A cluster with express configuration is not associated with a VPC, so this has no security groups.
   */
  public readonly connections: ec2.Connections;

  /**
   * Always undefined because a cluster with express configuration supports IAM database authentication only.
   */
  public readonly secret?: secretsmanager.ISecret = undefined;

  /**
   * The log groups that receive the exported logs, keyed by log type.
   *
   * Populated only when both `cloudwatchLogsExports` and `cloudwatchLogsRetention` are set.
   */
  public readonly cloudwatchLogGroups: { [logType: string]: logs.ILogGroup } = {};

  /**
   * The Data API is not supported for a cluster with express configuration.
   */
  protected enableDataApi?: boolean = false;

  constructor(scope: Construct, id: string, props: ExpressClusterProps = {}) {
    super(scope, id);
    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);

    const engine = DatabaseClusterEngine.AURORA_POSTGRESQL;
    const unsupportedLogTypes = (props.cloudwatchLogsExports ?? []).filter(logType => !engine.supportedLogTypes.includes(logType));
    if (unsupportedLogTypes.length > 0) {
      throw new ValidationError(lit`ExpressClusterUnsupportedLogTypes`, `unsupported log types for a cluster with express configuration: ${JSON.stringify(unsupportedLogTypes)}, supported log types are ${JSON.stringify(engine.supportedLogTypes)}`, this);
    }

    const enablePerformanceInsights = props.enablePerformanceInsights
      || props.performanceInsightRetention !== undefined
      || props.performanceInsightEncryptionKey !== undefined
      || props.databaseInsightsMode === DatabaseInsightsMode.ADVANCED;
    if (props.enablePerformanceInsights === false && enablePerformanceInsights) {
      throw new ValidationError(lit`ExpressClusterPerformanceInsightsDisabled`, '`enablePerformanceInsights` cannot be false when `performanceInsightRetention` or `performanceInsightEncryptionKey` is set, or `databaseInsightsMode` is `DatabaseInsightsMode.ADVANCED`', this);
    }
    if (props.databaseInsightsMode === DatabaseInsightsMode.ADVANCED
      && props.performanceInsightRetention !== undefined
      && props.performanceInsightRetention !== PerformanceInsightRetention.MONTHS_15) {
      throw new ValidationError(lit`ExpressClusterAdvancedDatabaseInsightsRetention`, `\`performanceInsightRetention\` must be \`PerformanceInsightRetention.MONTHS_15\` when \`databaseInsightsMode\` is \`DatabaseInsightsMode.ADVANCED\`, got ${props.performanceInsightRetention} days`, this);
    }
    const performanceInsightRetention = enablePerformanceInsights
      ? (props.performanceInsightRetention ?? (props.databaseInsightsMode === DatabaseInsightsMode.ADVANCED
        ? PerformanceInsightRetention.MONTHS_15
        : PerformanceInsightRetention.DEFAULT))
      : undefined;

    const cluster = new CfnDBCluster(this, 'Resource', {
      engine: engine.engineType,
      withExpressConfiguration: true,
      dbClusterIdentifier: props.clusterIdentifier,
      masterUsername: props.masterUsername,
      serverlessV2ScalingConfiguration: this.renderServerlessV2ScalingConfiguration(props),
      storageType: props.storageType,
      backupRetentionPeriod: props.backup?.retention.toDays(),
      preferredBackupWindow: props.backup?.preferredWindow,
      preferredMaintenanceWindow: props.preferredMaintenanceWindow,
      enableCloudwatchLogsExports: props.cloudwatchLogsExports,
      performanceInsightsEnabled: enablePerformanceInsights || props.enablePerformanceInsights,
      performanceInsightsRetentionPeriod: performanceInsightRetention,
      performanceInsightsKmsKeyId: props.performanceInsightEncryptionKey?.keyRef.keyArn,
      databaseInsightsMode: props.databaseInsightsMode,
      copyTagsToSnapshot: props.copyTagsToSnapshot ?? true,
      autoMinorVersionUpgrade: props.autoMinorVersionUpgrade,
      deletionProtection: defaultDeletionProtection(props.deletionProtection, props.removalPolicy),
    });

    this.clusterIdentifier = cluster.ref;
    this.clusterResourceIdentifier = cluster.attrDbClusterResourceId;

    // create a number token that represents the port of the cluster
    const portAttribute = Token.asNumber(cluster.attrEndpointPort);
    this.clusterEndpoint = new Endpoint(cluster.attrEndpointAddress, portAttribute);
    this.clusterReadEndpoint = new Endpoint(cluster.attrReadEndpointAddress, portAttribute);
    this.connections = new ec2.Connections({
      defaultPort: ec2.Port.tcp(this.clusterEndpoint.port),
    });

    cluster.applyRemovalPolicy(props.removalPolicy ?? RemovalPolicy.SNAPSHOT);

    if (props.cloudwatchLogsExports && props.cloudwatchLogsRetention) {
      for (const logType of props.cloudwatchLogsExports) {
        const logGroupName = `/aws/rds/cluster/${this.clusterIdentifier}/${logType}`;
        new logs.LogRetention(this, `LogRetention${logType}`, {
          logGroupName,
          retention: props.cloudwatchLogsRetention,
          role: props.cloudwatchLogsRetentionRole,
        });
        this.cloudwatchLogGroups[logType] = logs.LogGroup.fromLogGroupName(this, `LogGroup${logType}`, logGroupName);
      }
    }

    // Creating a cluster with express configuration through CloudFormation currently fails
    // with an internal error from RDS unless the cluster has at least one user-defined tag.
    Aspects.of(this).add(new ExpressClusterTagCheck(cluster), { priority: AspectPriority.READONLY });
  }

  /**
   * RDS Proxy is not supported for a cluster with express configuration.
   */
  @MethodMetadata()
  public addProxy(_id: string, _options: DatabaseProxyOptions): DatabaseProxy {
    throw new ValidationError(lit`ExpressClusterProxyNotSupported`, 'RDS Proxy is not supported for a cluster with express configuration', this);
  }

  private renderServerlessV2ScalingConfiguration(props: ExpressClusterProps): CfnDBCluster.ServerlessV2ScalingConfigurationProperty | undefined {
    const { serverlessV2MinCapacity: minCapacity, serverlessV2MaxCapacity: maxCapacity, serverlessV2AutoPauseDuration: autoPause } = props;
    if (minCapacity === undefined && maxCapacity === undefined && autoPause === undefined) {
      return undefined;
    }

    const min = minCapacity ?? 0;
    const max = maxCapacity ?? 16;
    if (!Token.isUnresolved(min) && (min < 0 || min > 256 || !Number.isInteger(min * 2))) {
      throw new ValidationError(lit`ExpressClusterInvalidServerlessV2MinCapacity`, `\`serverlessV2MinCapacity\` must be between 0 and 256 in 0.5 increments, got ${min}`, this);
    }
    if (!Token.isUnresolved(max) && (max < 1 || max > 256 || !Number.isInteger(max * 2))) {
      throw new ValidationError(lit`ExpressClusterInvalidServerlessV2MaxCapacity`, `\`serverlessV2MaxCapacity\` must be between 1 and 256 in 0.5 increments, got ${max}`, this);
    }
    if (!Token.isUnresolved(min) && !Token.isUnresolved(max) && max < min) {
      throw new ValidationError(lit`ExpressClusterServerlessV2MaxCapacityTooLow`, `\`serverlessV2MaxCapacity\` (${max}) must be greater than or equal to \`serverlessV2MinCapacity\` (${min})`, this);
    }
    if (autoPause !== undefined && !autoPause.isUnresolved() && (autoPause.toSeconds() < 300 || autoPause.toSeconds() > 86400)) {
      throw new ValidationError(lit`ExpressClusterInvalidServerlessV2AutoPauseDuration`, `\`serverlessV2AutoPauseDuration\` must be between 300 seconds (5 minutes) and 86,400 seconds (24 hours), got ${autoPause.toSeconds()} seconds`, this);
    }

    return {
      minCapacity: min,
      maxCapacity: max,
      secondsUntilAutoPause: autoPause?.toSeconds(),
    };
  }
}

/**
 * Warns when a cluster with express configuration has no user-defined tags.
 */
class ExpressClusterTagCheck implements IAspect {
  constructor(private readonly cluster: CfnDBCluster) {}

  public visit(node: IConstruct): void {
    if (node !== this.cluster) {
      return;
    }
    if (!this.cluster.tags.hasTags()) {
      Annotations.of(this.cluster.node.scope ?? this.cluster).addWarningV2(
        '@aws-cdk/aws-rds:expressClusterRequiresTags',
        'Creating a cluster with express configuration through CloudFormation currently fails with an internal error unless the cluster has at least one tag. ' +
        'Add a tag with `Tags.of(cluster).add(key, value)`.',
      );
    }
  }
}
