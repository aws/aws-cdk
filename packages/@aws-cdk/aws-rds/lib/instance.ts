import * as ec2 from '@aws-cdk/aws-ec2';
import * as events from '@aws-cdk/aws-events';
import * as iam from '@aws-cdk/aws-iam';
import * as kms from '@aws-cdk/aws-kms';
import * as lambda from '@aws-cdk/aws-lambda';
import * as logs from '@aws-cdk/aws-logs';
import * as secretsmanager from '@aws-cdk/aws-secretsmanager';
import { Construct, Duration, IResource, Lazy, RemovalPolicy, Resource, SecretValue, Stack, Token } from '@aws-cdk/core';
import { DatabaseSecret } from './database-secret';
import { Endpoint } from './endpoint';
import { IOptionGroup } from './option-group';
import { IParameterGroup } from './parameter-group';
import { DatabaseClusterEngine, RotationMultiUserOptions } from './props';
import { CfnDBInstance, CfnDBInstanceProps, CfnDBSubnetGroup } from './rds.generated';

/**
 * A database instance
 */
export interface IDatabaseInstance extends IResource, ec2.IConnectable, secretsmanager.ISecretAttachmentTarget {
  /**
   * The instance identifier.
   */
  readonly instanceIdentifier: string;

  /**
   * The instance arn.
   */
  readonly instanceArn: string;

  /**
   * The instance endpoint address.
   *
   * @attribute EndpointAddress
   */
  readonly dbInstanceEndpointAddress: string;

  /**
   * The instance endpoint port.
   *
   * @attribute EndpointPort
   */
  readonly dbInstanceEndpointPort: string;

  /**
   * The instance endpoint.
   */
  readonly instanceEndpoint: Endpoint;

  /**
   * Defines a CloudWatch event rule which triggers for instance events. Use
   * `rule.addEventPattern(pattern)` to specify a filter.
   */
  onEvent(id: string, options?: events.OnEventOptions): events.Rule;
}

/**
 * Properties that describe an existing instance
 */
export interface DatabaseInstanceAttributes {
  /**
   * The instance identifier.
   */
  readonly instanceIdentifier: string;

  /**
   * The endpoint address.
   */
  readonly instanceEndpointAddress: string;

  /**
   * The database port.
   */
  readonly port: number;

  /**
   * The security groups of the instance.
   */
  readonly securityGroups: ec2.ISecurityGroup[];
}

/**
 * A new or imported database instance.
 */
export abstract class DatabaseInstanceBase extends Resource implements IDatabaseInstance {
  /**
   * Import an existing database instance.
   */
  public static fromDatabaseInstanceAttributes(scope: Construct, id: string, attrs: DatabaseInstanceAttributes): IDatabaseInstance {
    class Import extends DatabaseInstanceBase implements IDatabaseInstance {
      public readonly defaultPort = ec2.Port.tcp(attrs.port);
      public readonly connections = new ec2.Connections({
        securityGroups: attrs.securityGroups,
        defaultPort: this.defaultPort,
      });
      public readonly instanceIdentifier = attrs.instanceIdentifier;
      public readonly dbInstanceEndpointAddress = attrs.instanceEndpointAddress;
      public readonly dbInstanceEndpointPort = attrs.port.toString();
      public readonly instanceEndpoint = new Endpoint(attrs.instanceEndpointAddress, attrs.port);
    }

    return new Import(scope, id);
  }

  public abstract readonly instanceIdentifier: string;
  public abstract readonly dbInstanceEndpointAddress: string;
  public abstract readonly dbInstanceEndpointPort: string;
  public abstract readonly instanceEndpoint: Endpoint;

  /**
   * Access to network connections.
   */
  public abstract readonly connections: ec2.Connections;

  /**
   * Defines a CloudWatch event rule which triggers for instance events. Use
   * `rule.addEventPattern(pattern)` to specify a filter.
   */
  public onEvent(id: string, options: events.OnEventOptions = {}) {
    const rule = new events.Rule(this, id, options);
    rule.addEventPattern({
      source: ['aws.rds'],
      resources: [this.instanceArn],
    });
    rule.addTarget(options.target);
    return rule;
  }

  /**
   * The instance arn.
   */
  public get instanceArn(): string {
    return Stack.of(this).formatArn({
      service: 'rds',
      resource: 'db',
      sep: ':',
      resourceName: this.instanceIdentifier,
    });
  }

  /**
   * Renders the secret attachment target specifications.
   */
  public asSecretAttachmentTarget(): secretsmanager.SecretAttachmentTargetProps {
    return {
      targetId: this.instanceIdentifier,
      targetType: secretsmanager.AttachmentTargetType.RDS_DB_INSTANCE,
    };
  }
}

/**
 * A database instance engine. Provides mapping to DatabaseEngine used for
 * secret rotation.
 */
export class DatabaseInstanceEngine extends DatabaseClusterEngine {
  /* tslint:disable max-line-length */
  public static readonly MARIADB = new DatabaseInstanceEngine('mariadb', secretsmanager.SecretRotationApplication.MARIADB_ROTATION_SINGLE_USER, secretsmanager.SecretRotationApplication.MARIADB_ROTATION_MULTI_USER, [
    { engineMajorVersion: '10.0', parameterGroupFamily: 'mariadb10.0' },
    { engineMajorVersion: '10.1', parameterGroupFamily: 'mariadb10.1' },
    { engineMajorVersion: '10.2', parameterGroupFamily: 'mariadb10.2' },
    { engineMajorVersion: '10.3', parameterGroupFamily: 'mariadb10.3' },
  ]);

  public static readonly MYSQL = new DatabaseInstanceEngine('mysql', secretsmanager.SecretRotationApplication.MYSQL_ROTATION_SINGLE_USER, secretsmanager.SecretRotationApplication.MYSQL_ROTATION_MULTI_USER, [
    { engineMajorVersion: '5.6', parameterGroupFamily: 'mysql5.6' },
    { engineMajorVersion: '5.7', parameterGroupFamily: 'mysql5.7' },
    { engineMajorVersion: '8.0', parameterGroupFamily: 'mysql8.0' },
  ]);

  public static readonly ORACLE_EE = new DatabaseInstanceEngine('oracle-ee', secretsmanager.SecretRotationApplication.ORACLE_ROTATION_SINGLE_USER, secretsmanager.SecretRotationApplication.ORACLE_ROTATION_MULTI_USER, [
    { engineMajorVersion: '11.2', parameterGroupFamily: 'oracle-ee-11.2' },
    { engineMajorVersion: '12.1', parameterGroupFamily: 'oracle-ee-12.1' },
    { engineMajorVersion: '12.2', parameterGroupFamily: 'oracle-ee-12.2' },
    { engineMajorVersion: '18', parameterGroupFamily: 'oracle-ee-18' },
    { engineMajorVersion: '19', parameterGroupFamily: 'oracle-ee-19' },
  ]);

  public static readonly ORACLE_SE2 = new DatabaseInstanceEngine('oracle-se2', secretsmanager.SecretRotationApplication.ORACLE_ROTATION_SINGLE_USER, secretsmanager.SecretRotationApplication.ORACLE_ROTATION_MULTI_USER, [
    { engineMajorVersion: '12.1', parameterGroupFamily: 'oracle-se2-12.1' },
    { engineMajorVersion: '12.2', parameterGroupFamily: 'oracle-se2-12.2' },
    { engineMajorVersion: '18', parameterGroupFamily: 'oracle-se2-18' },
    { engineMajorVersion: '19', parameterGroupFamily: 'oracle-se2-19' },
  ]);

  public static readonly ORACLE_SE1 = new DatabaseInstanceEngine('oracle-se1', secretsmanager.SecretRotationApplication.ORACLE_ROTATION_SINGLE_USER, secretsmanager.SecretRotationApplication.ORACLE_ROTATION_MULTI_USER, [
    { engineMajorVersion: '11.2', parameterGroupFamily: 'oracle-se1-11.2' },
  ]);

  public static readonly ORACLE_SE = new DatabaseInstanceEngine('oracle-se', secretsmanager.SecretRotationApplication.ORACLE_ROTATION_SINGLE_USER, secretsmanager.SecretRotationApplication.ORACLE_ROTATION_MULTI_USER, [
    { engineMajorVersion: '11.2', parameterGroupFamily: 'oracle-se-11.2' },
  ]);

  public static readonly POSTGRES = new DatabaseInstanceEngine('postgres', secretsmanager.SecretRotationApplication.POSTGRES_ROTATION_SINGLE_USER, secretsmanager.SecretRotationApplication.POSTGRES_ROTATION_MULTI_USER, [
    { engineMajorVersion: '9.3', parameterGroupFamily: 'postgres9.3' },
    { engineMajorVersion: '9.4', parameterGroupFamily: 'postgres9.4' },
    { engineMajorVersion: '9.5', parameterGroupFamily: 'postgres9.5' },
    { engineMajorVersion: '9.6', parameterGroupFamily: 'postgres9.6' },
    { engineMajorVersion: '10', parameterGroupFamily: 'postgres10' },
    { engineMajorVersion: '11', parameterGroupFamily: 'postgres11' },
  ]);

  public static readonly SQL_SERVER_EE = new DatabaseInstanceEngine('sqlserver-ee', secretsmanager.SecretRotationApplication.SQLSERVER_ROTATION_SINGLE_USER, secretsmanager.SecretRotationApplication.SQLSERVER_ROTATION_MULTI_USER, [
    { engineMajorVersion: '11', parameterGroupFamily: 'sqlserver-ee-11.0' },
    { engineMajorVersion: '12', parameterGroupFamily: 'sqlserver-ee-12.0' },
    { engineMajorVersion: '13', parameterGroupFamily: 'sqlserver-ee-13.0' },
    { engineMajorVersion: '14', parameterGroupFamily: 'sqlserver-ee-14.0' },
  ]);

  public static readonly SQL_SERVER_SE = new DatabaseInstanceEngine('sqlserver-se', secretsmanager.SecretRotationApplication.SQLSERVER_ROTATION_SINGLE_USER, secretsmanager.SecretRotationApplication.SQLSERVER_ROTATION_MULTI_USER, [
    { engineMajorVersion: '11', parameterGroupFamily: 'sqlserver-se-11.0' },
    { engineMajorVersion: '12', parameterGroupFamily: 'sqlserver-se-12.0' },
    { engineMajorVersion: '13', parameterGroupFamily: 'sqlserver-se-13.0' },
    { engineMajorVersion: '14', parameterGroupFamily: 'sqlserver-se-14.0' },
  ]);

  public static readonly SQL_SERVER_EX = new DatabaseInstanceEngine('sqlserver-ex', secretsmanager.SecretRotationApplication.SQLSERVER_ROTATION_SINGLE_USER, secretsmanager.SecretRotationApplication.SQLSERVER_ROTATION_MULTI_USER, [
    { engineMajorVersion: '11', parameterGroupFamily: 'sqlserver-ex-11.0' },
    { engineMajorVersion: '12', parameterGroupFamily: 'sqlserver-ex-12.0' },
    { engineMajorVersion: '13', parameterGroupFamily: 'sqlserver-ex-13.0' },
    { engineMajorVersion: '14', parameterGroupFamily: 'sqlserver-ex-14.0' },
  ]);

  public static readonly SQL_SERVER_WEB = new DatabaseInstanceEngine('sqlserver-web', secretsmanager.SecretRotationApplication.SQLSERVER_ROTATION_SINGLE_USER, secretsmanager.SecretRotationApplication.SQLSERVER_ROTATION_MULTI_USER, [
    { engineMajorVersion: '11', parameterGroupFamily: 'sqlserver-web-11.0' },
    { engineMajorVersion: '12', parameterGroupFamily: 'sqlserver-web-12.0' },
    { engineMajorVersion: '13', parameterGroupFamily: 'sqlserver-web-13.0' },
    { engineMajorVersion: '14', parameterGroupFamily: 'sqlserver-web-14.0' },
  ]);
  /* tslint:enable max-line-length */

  /** To make it a compile-time error to pass a DatabaseClusterEngine where a DatabaseInstanceEngine is expected. */
  public readonly isDatabaseInstanceEngine = true;
}

/**
 * The license model.
 */
export enum LicenseModel {
  /**
   * License included.
   */
  LICENSE_INCLUDED = 'license-included',

  /**
   * Bring your own licencse.
   */
  BRING_YOUR_OWN_LICENSE = 'bring-your-own-license',

  /**
   * General public license.
   */
  GENERAL_PUBLIC_LICENSE = 'general-public-license'
}

/**
 * The processor features.
 */
export interface ProcessorFeatures {
  /**
   * The number of CPU core.
   *
   * @default - the default number of CPU cores for the chosen instance class.
   */
  readonly coreCount?: number;

  /**
   * The number of threads per core.
   *
   * @default - the default number of threads per core for the chosen instance class.
   */
  readonly threadsPerCore?: number;
}

/**
 * The type of storage.
 */
export enum StorageType {
  /**
   * Standard.
   */
  STANDARD = 'standard',

  /**
   * General purpose (SSD).
   */
  GP2 = 'gp2',

  /**
   * Provisioned IOPS (SSD).
   */
  IO1 = 'io1'
}

/**
 * The retention period for Performance Insight.
 */
export enum PerformanceInsightRetention {
  /**
   * Default retention period of 7 days.
   */
  DEFAULT = 7,

  /**
   * Long term retention period of 2 years.
   */
  LONG_TERM = 731
}

/**
 * Construction properties for a DatabaseInstanceNew
 */
export interface DatabaseInstanceNewProps {
  /**
   * The name of the compute and memory capacity classes.
   */
  readonly instanceClass: ec2.InstanceType;

  /**
   * Specifies if the database instance is a multiple Availability Zone deployment.
   *
   * @default false
   */
  readonly multiAz?: boolean;

  /**
   * The name of the Availability Zone where the DB instance will be located.
   *
   * @default - no preference
   */
  readonly availabilityZone?: string;

  /**
   * The storage type.
   *
   * @default GP2
   */
  readonly storageType?: StorageType;

  /**
   * The number of I/O operations per second (IOPS) that the database provisions.
   * The value must be equal to or greater than 1000.
   *
   * @default - no provisioned iops
   */
  readonly iops?: number;

  /**
   * The number of CPU cores and the number of threads per core.
   *
   * @default - the default number of CPU cores and threads per core for the
   * chosen instance class.
   *
   * See https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Concepts.DBInstanceClass.html#USER_ConfigureProcessor
   */
  readonly processorFeatures?: ProcessorFeatures;

  /**
   * A name for the DB instance. If you specify a name, AWS CloudFormation
   * converts it to lowercase.
   *
   * @default - a CloudFormation generated name
   */
  readonly instanceIdentifier?: string;

  /**
   * The VPC network where the DB subnet group should be created.
   */
  readonly vpc: ec2.IVpc;

  /**
   * The type of subnets to add to the created DB subnet group.
   *
   * @default - private subnets
   */
  readonly vpcPlacement?: ec2.SubnetSelection;

  /**
   * The security groups to assign to the DB instance.
   *
   * @default - a new security group is created
   */
  readonly securityGroups?: ec2.ISecurityGroup[];

  /**
   * The port for the instance.
   *
   * @default - the default port for the chosen engine.
   */
  readonly port?: number;

  /**
   * The option group to associate with the instance.
   *
   * @default - no option group
   */
  readonly optionGroup?: IOptionGroup;

  /**
   * Whether to enable mapping of AWS Identity and Access Management (IAM) accounts
   * to database accounts.
   *
   * @default false
   */
  readonly iamAuthentication?: boolean;

  /**
   * The number of days during which automatic DB snapshots are retained. Set
   * to zero to disable backups.
   *
   * @default Duration.days(1)
   */
  readonly backupRetention?: Duration;

  /**
   * The daily time range during which automated backups are performed.
   *
   * Constraints:
   * - Must be in the format `hh24:mi-hh24:mi`.
   * - Must be in Universal Coordinated Time (UTC).
   * - Must not conflict with the preferred maintenance window.
   * - Must be at least 30 minutes.
   *
   * @default - a 30-minute window selected at random from an 8-hour block of
   * time for each AWS Region. To see the time blocks available, see
   * https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_WorkingWithAutomatedBackups.html#USER_WorkingWithAutomatedBackups.BackupWindow
   */
  readonly preferredBackupWindow?: string;

  /**
   * Indicates whether to copy all of the user-defined tags from the
   * DB instance to snapshots of the DB instance.
   *
   * @default true
   */
  readonly copyTagsToSnapshot?: boolean;

  /**
   * Indicates whether automated backups should be deleted or retained when
   * you delete a DB instance.
   *
   * @default false
   */
  readonly deleteAutomatedBackups?: boolean;

  /**
   * The interval, in seconds, between points when Amazon RDS collects enhanced
   * monitoring metrics for the DB instance.
   *
   * @default - no enhanced monitoring
   */
  readonly monitoringInterval?: Duration;

  /**
   * Role that will be used to manage DB instance monitoring.
   *
   * @default - A role is automatically created for you
   */
  readonly monitoringRole?: iam.IRole;

  /**
   * Whether to enable Performance Insights for the DB instance.
   *
   * @default false
   */
  readonly enablePerformanceInsights?: boolean;

  /**
   * The amount of time, in days, to retain Performance Insights data.
   *
   * @default 7
   */
  readonly performanceInsightRetention?: PerformanceInsightRetention;

  /**
   * The AWS KMS key for encryption of Performance Insights data.
   *
   * @default - default master key
   */
  readonly performanceInsightKmsKey?: kms.IKey;

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
  readonly cloudwatchLogsRetentionRole?: iam.IRole;

  /**
   * Indicates that minor engine upgrades are applied automatically to the
   * DB instance during the maintenance window.
   *
   * @default true
   */
  readonly autoMinorVersionUpgrade?: boolean;

  // tslint:disable:max-line-length
  /**
   * The weekly time range (in UTC) during which system maintenance can occur.
   *
   * Format: `ddd:hh24:mi-ddd:hh24:mi`
   * Constraint: Minimum 30-minute window
   *
   * @default - a 30-minute window selected at random from an 8-hour block of
   * time for each AWS Region, occurring on a random day of the week. To see
   * the time blocks available, see https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_UpgradeDBInstance.Maintenance.html#Concepts.DBMaintenance
   */
  // tslint:enable:max-line-length
  readonly preferredMaintenanceWindow?: string;

  /**
   * Indicates whether the DB instance should have deletion protection enabled.
   *
   * @default true
   */
  readonly deletionProtection?: boolean;

  /**
   * The CloudFormation policy to apply when the instance is removed from the
   * stack or replaced during an update.
   *
   * @default RemovalPolicy.Retain
   */
  readonly removalPolicy?: RemovalPolicy

  /**
   * Upper limit to which RDS can scale the storage in GiB(Gibibyte).
   * @see https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_PIOPS.StorageTypes.html#USER_PIOPS.Autoscaling
   * @default - No autoscaling of RDS instance
   */
  readonly maxAllocatedStorage?: number;
}

/**
 * A new database instance.
 */
abstract class DatabaseInstanceNew extends DatabaseInstanceBase implements IDatabaseInstance {
  /**
   * The VPC where this database instance is deployed.
   */
  public readonly vpc: ec2.IVpc;

  public readonly connections: ec2.Connections;

  protected readonly vpcPlacement?: ec2.SubnetSelection;
  protected readonly newCfnProps: CfnDBInstanceProps;

  private readonly cloudwatchLogsExports?: string[];
  private readonly cloudwatchLogsRetention?: logs.RetentionDays;
  private readonly cloudwatchLogsRetentionRole?: iam.IRole;

  constructor(scope: Construct, id: string, props: DatabaseInstanceNewProps) {
    super(scope, id);

    this.vpc = props.vpc;
    this.vpcPlacement = props.vpcPlacement;

    const { subnetIds } = props.vpc.selectSubnets(props.vpcPlacement);

    const subnetGroup = new CfnDBSubnetGroup(this, 'SubnetGroup', {
      dbSubnetGroupDescription: `Subnet group for ${this.node.id} database`,
      subnetIds,
    });

    const securityGroups = props.securityGroups || [new ec2.SecurityGroup(this, 'SecurityGroup', {
      description: `Security group for ${this.node.id} database`,
      vpc: props.vpc,
    })];

    this.connections = new ec2.Connections({
      securityGroups,
      defaultPort: ec2.Port.tcp(Lazy.numberValue({ produce: () => this.instanceEndpoint.port })),
    });

    let monitoringRole;
    if (props.monitoringInterval && props.monitoringInterval.toSeconds()) {
      monitoringRole = props.monitoringRole || new iam.Role(this, 'MonitoringRole', {
        assumedBy: new iam.ServicePrincipal('monitoring.rds.amazonaws.com'),
        managedPolicies: [iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AmazonRDSEnhancedMonitoringRole')],
      });
    }

    const deletionProtection = props.deletionProtection !== undefined ? props.deletionProtection : true;
    const storageType = props.storageType || StorageType.GP2;
    const iops = storageType === StorageType.IO1 ? (props.iops || 1000) : undefined;

    this.cloudwatchLogsExports = props.cloudwatchLogsExports;
    this.cloudwatchLogsRetention = props.cloudwatchLogsRetention;
    this.cloudwatchLogsRetentionRole = props.cloudwatchLogsRetentionRole;

    this.newCfnProps = {
      autoMinorVersionUpgrade: props.autoMinorVersionUpgrade,
      availabilityZone: props.multiAz ? undefined : props.availabilityZone,
      backupRetentionPeriod: props.backupRetention ? props.backupRetention.toDays() : undefined,
      copyTagsToSnapshot: props.copyTagsToSnapshot !== undefined ? props.copyTagsToSnapshot : true,
      dbInstanceClass: `db.${props.instanceClass}`,
      dbInstanceIdentifier: props.instanceIdentifier,
      dbSubnetGroupName: subnetGroup.ref,
      deleteAutomatedBackups: props.deleteAutomatedBackups,
      deletionProtection,
      enableCloudwatchLogsExports: this.cloudwatchLogsExports,
      enableIamDatabaseAuthentication: props.iamAuthentication,
      enablePerformanceInsights: props.enablePerformanceInsights,
      iops,
      monitoringInterval: props.monitoringInterval && props.monitoringInterval.toSeconds(),
      monitoringRoleArn: monitoringRole && monitoringRole.roleArn,
      multiAz: props.multiAz,
      optionGroupName: props.optionGroup && props.optionGroup.optionGroupName,
      performanceInsightsKmsKeyId: props.enablePerformanceInsights
        ? props.performanceInsightKmsKey && props.performanceInsightKmsKey.keyArn
        : undefined,
      performanceInsightsRetentionPeriod: props.enablePerformanceInsights
        ? (props.performanceInsightRetention || PerformanceInsightRetention.DEFAULT)
        : undefined,
      port: props.port ? props.port.toString() : undefined,
      preferredBackupWindow: props.preferredBackupWindow,
      preferredMaintenanceWindow: props.preferredMaintenanceWindow,
      processorFeatures: props.processorFeatures && renderProcessorFeatures(props.processorFeatures),
      publiclyAccessible: props.vpcPlacement && props.vpcPlacement.subnetType === ec2.SubnetType.PUBLIC,
      storageType,
      vpcSecurityGroups: securityGroups.map(s => s.securityGroupId),
      maxAllocatedStorage: props.maxAllocatedStorage,
    };
  }

  protected setLogRetention() {
    if (this.cloudwatchLogsExports && this.cloudwatchLogsRetention) {
      for (const log of this.cloudwatchLogsExports) {
        new lambda.LogRetention(this, `LogRetention${log}`, {
          logGroupName: `/aws/rds/instance/${this.instanceIdentifier}/${log}`,
          retention: this.cloudwatchLogsRetention,
          role: this.cloudwatchLogsRetentionRole,
        });
      }
    }
  }
}

/**
 * Construction properties for a DatabaseInstanceSource
 */
export interface DatabaseInstanceSourceProps extends DatabaseInstanceNewProps {
  /**
   * The database engine.
   */
  readonly engine: DatabaseInstanceEngine;

  /**
   * The license model.
   *
   * @default - RDS default license model
   */
  readonly licenseModel?: LicenseModel;

  /**
   * The engine version. To prevent automatic upgrades, be sure to specify the
   * full version number.
   *
   * @default - RDS default engine version
   */
  readonly engineVersion?: string;

  /**
   * Whether to allow major version upgrades.
   *
   * @default false
   */
  readonly allowMajorVersionUpgrade?: boolean;

  /**
   * The time zone of the instance. This is currently supported only by Microsoft Sql Server.
   *
   * @default - RDS default timezone
   */
  readonly timezone?: string;

  /**
   * The allocated storage size, specified in gigabytes (GB).
   *
   * @default 100
   */
  readonly allocatedStorage?: number;

  /**
   * The master user password.
   *
   * @default - a Secrets Manager generated password
   */
  readonly masterUserPassword?: SecretValue;

  /**
   * The KMS key to use to encrypt the secret for the master user password.
   *
   * @default - default master key
   */
  readonly secretKmsKey?: kms.IKey;

  /**
   * The name of the database.
   *
   * @default - no name
   */
  readonly databaseName?: string;

  /**
   * The DB parameter group to associate with the instance.
   *
   * @default - no parameter group
   */
  readonly parameterGroup?: IParameterGroup;
}

/**
 * A new source database instance (not a read replica)
 */
abstract class DatabaseInstanceSource extends DatabaseInstanceNew implements IDatabaseInstance {
  /**
   * The AWS Secrets Manager secret attached to the instance.
   */
  public abstract readonly secret?: secretsmanager.ISecret;

  protected readonly sourceCfnProps: CfnDBInstanceProps;

  private readonly singleUserRotationApplication: secretsmanager.SecretRotationApplication;
  private readonly multiUserRotationApplication: secretsmanager.SecretRotationApplication;

  constructor(scope: Construct, id: string, props: DatabaseInstanceSourceProps) {
    super(scope, id, props);

    this.singleUserRotationApplication = props.engine.singleUserRotationApplication;
    this.multiUserRotationApplication = props.engine.multiUserRotationApplication;

    const timezoneSupport = [ DatabaseInstanceEngine.SQL_SERVER_EE, DatabaseInstanceEngine.SQL_SERVER_EX,
      DatabaseInstanceEngine.SQL_SERVER_SE, DatabaseInstanceEngine.SQL_SERVER_WEB ];
    if (props.timezone && !timezoneSupport.includes(props.engine)) {
      throw new Error(`timezone property can be configured only for Microsoft SQL Server, not ${props.engine.name}`);
    }

    this.sourceCfnProps = {
      ...this.newCfnProps,
      allocatedStorage: props.allocatedStorage ? props.allocatedStorage.toString() : '100',
      allowMajorVersionUpgrade: props.allowMajorVersionUpgrade,
      dbName: props.databaseName,
      dbParameterGroupName: props.parameterGroup && props.parameterGroup.parameterGroupName,
      engine: props.engine.name,
      engineVersion: props.engineVersion,
      licenseModel: props.licenseModel,
      timezone: props.timezone,
    };
  }

  /**
   * Adds the single user rotation of the master password to this instance.
   *
   * @param [automaticallyAfter=Duration.days(30)] Specifies the number of days after the previous rotation
   * before Secrets Manager triggers the next automatic rotation.
   */
  public addRotationSingleUser(automaticallyAfter?: Duration): secretsmanager.SecretRotation {
    if (!this.secret) {
      throw new Error('Cannot add single user rotation for an instance without secret.');
    }

    const id = 'RotationSingleUser';
    const existing = this.node.tryFindChild(id);
    if (existing) {
      throw new Error('A single user rotation was already added to this instance.');
    }

    return new secretsmanager.SecretRotation(this, id, {
      secret: this.secret,
      automaticallyAfter,
      application: this.singleUserRotationApplication,
      vpc: this.vpc,
      vpcSubnets: this.vpcPlacement,
      target: this,
    });
  }

  /**
   * Adds the multi user rotation to this instance.
   */
  public addRotationMultiUser(id: string, options: RotationMultiUserOptions): secretsmanager.SecretRotation {
    if (!this.secret) {
      throw new Error('Cannot add multi user rotation for an instance without secret.');
    }
    return new secretsmanager.SecretRotation(this, id, {
      secret: options.secret,
      masterSecret: this.secret,
      automaticallyAfter: options.automaticallyAfter,
      application: this.multiUserRotationApplication,
      vpc: this.vpc,
      vpcSubnets: this.vpcPlacement,
      target: this,
    });
  }
}

/**
 * Construction properties for a DatabaseInstance.
 */
export interface DatabaseInstanceProps extends DatabaseInstanceSourceProps {
  /**
   * The master user name.
   */
  readonly masterUsername: string;

  /**
   * For supported engines, specifies the character set to associate with the
   * DB instance.
   *
   * @default - RDS default character set name
   */
  readonly characterSetName?: string;

  /**
   * Indicates whether the DB instance is encrypted.
   *
   * @default false
   */
  readonly storageEncrypted?: boolean;

  /**
   * The master key that's used to encrypt the DB instance.
   *
   * @default - default master key
   */
  readonly kmsKey?: kms.IKey;
}

/**
 * A database instance
 *
 * @resource AWS::RDS::DBInstance
 */
export class DatabaseInstance extends DatabaseInstanceSource implements IDatabaseInstance {
  public readonly instanceIdentifier: string;
  public readonly dbInstanceEndpointAddress: string;
  public readonly dbInstanceEndpointPort: string;
  public readonly instanceEndpoint: Endpoint;
  public readonly secret?: secretsmanager.ISecret;

  constructor(scope: Construct, id: string, props: DatabaseInstanceProps) {
    super(scope, id, props);

    let secret: DatabaseSecret | undefined;
    if (!props.masterUserPassword) {
      secret = new DatabaseSecret(this, 'Secret', {
        username: props.masterUsername,
        encryptionKey: props.secretKmsKey,
      });
    }

    const instance = new CfnDBInstance(this, 'Resource', {
      ...this.sourceCfnProps,
      characterSetName: props.characterSetName,
      kmsKeyId: props.kmsKey && props.kmsKey.keyArn,
      masterUsername: secret ? secret.secretValueFromJson('username').toString() : props.masterUsername,
      masterUserPassword: secret
        ? secret.secretValueFromJson('password').toString()
        : props.masterUserPassword && props.masterUserPassword.toString(),
      storageEncrypted: props.kmsKey ? true : props.storageEncrypted,
    });

    this.instanceIdentifier = instance.ref;
    this.dbInstanceEndpointAddress = instance.attrEndpointAddress;
    this.dbInstanceEndpointPort = instance.attrEndpointPort;

    // create a number token that represents the port of the instance
    const portAttribute = Token.asNumber(instance.attrEndpointPort);
    this.instanceEndpoint = new Endpoint(instance.attrEndpointAddress, portAttribute);

    instance.applyRemovalPolicy(props.removalPolicy, {
      applyToUpdateReplacePolicy: true,
    });

    if (secret) {
      this.secret = secret.attach(this);
    }

    this.setLogRetention();
  }
}

/**
 * Construction properties for a DatabaseInstanceFromSnapshot.
 */
export interface DatabaseInstanceFromSnapshotProps extends DatabaseInstanceSourceProps {
  /**
   * The name or Amazon Resource Name (ARN) of the DB snapshot that's used to
   * restore the DB instance. If you're restoring from a shared manual DB
   * snapshot, you must specify the ARN of the snapshot.
   */
  readonly snapshotIdentifier: string;

  /**
   * The master user name.
   *
   * Specify this prop with the **current** master user name of the snapshot
   * only when generating a new master user password with `generateMasterUserPassword`.
   * The value will be set in the generated secret attached to the instance.
   *
   * It is not possible to change the master user name of a RDS instance.
   *
   * @default - inherited from the snapshot
   */
  readonly masterUsername?: string;

  /**
   * Whether to generate a new master user password and store it in
   * Secrets Manager. `masterUsername` must be specified with the **current**
   * master user name of the snapshot when this property is set to true.
   *
   * @default false
   */
  readonly generateMasterUserPassword?: boolean;
}

/**
 * A database instance restored from a snapshot.
 *
 * @resource AWS::RDS::DBInstance
 */
export class DatabaseInstanceFromSnapshot extends DatabaseInstanceSource implements IDatabaseInstance {
  public readonly instanceIdentifier: string;
  public readonly dbInstanceEndpointAddress: string;
  public readonly dbInstanceEndpointPort: string;
  public readonly instanceEndpoint: Endpoint;
  public readonly secret?: secretsmanager.ISecret;

  constructor(scope: Construct, id: string, props: DatabaseInstanceFromSnapshotProps) {
    super(scope, id, props);

    let secret: DatabaseSecret | undefined;

    if (props.generateMasterUserPassword) {
      if (!props.masterUsername) { // We need the master username to include it in the generated secret
        throw new Error('`masterUsername` must be specified when `generateMasterUserPassword` is set to true.');
      }

      if (props.masterUserPassword) {
        throw new Error('Cannot specify `masterUserPassword` when `generateMasterUserPassword` is set to true.');
      }

      secret = new DatabaseSecret(this, 'Secret', {
        username: props.masterUsername,
        encryptionKey: props.secretKmsKey,
      });
    } else {
      if (props.masterUsername) { // It's not possible to change the master username of a RDS instance
        throw new Error('Cannot specify `masterUsername` when `generateMasterUserPassword` is set to false.');
      }
    }

    const instance = new CfnDBInstance(this, 'Resource', {
      ...this.sourceCfnProps,
      dbSnapshotIdentifier: props.snapshotIdentifier,
      masterUserPassword: secret
        ? secret.secretValueFromJson('password').toString()
        : props.masterUserPassword && props.masterUserPassword.toString(),
    });

    this.instanceIdentifier = instance.ref;
    this.dbInstanceEndpointAddress = instance.attrEndpointAddress;
    this.dbInstanceEndpointPort = instance.attrEndpointPort;

    // create a number token that represents the port of the instance
    const portAttribute = Token.asNumber(instance.attrEndpointPort);
    this.instanceEndpoint = new Endpoint(instance.attrEndpointAddress, portAttribute);

    instance.applyRemovalPolicy(props.removalPolicy, {
      applyToUpdateReplacePolicy: true,
    });

    if (secret) {
      this.secret = secret.attach(this);
    }

    this.setLogRetention();
  }
}

/**
 * Construction properties for a DatabaseInstanceReadReplica.
 */
export interface DatabaseInstanceReadReplicaProps extends DatabaseInstanceSourceProps {
  /**
   * The source database instance.
   *
   * Each DB instance can have a limited number of read replicas. For more
   * information, see https://docs.aws.amazon.com/AmazonRDS/latest/DeveloperGuide/USER_ReadRepl.html.
   *
   */
  readonly sourceDatabaseInstance: IDatabaseInstance;

  /**
   * Indicates whether the DB instance is encrypted.
   *
   * @default false
   */
  readonly storageEncrypted?: boolean;

  /**
   * The master key that's used to encrypt the DB instance.
   *
   * @default - default master key
   */
  readonly kmsKey?: kms.IKey;
}

/**
 * A read replica database instance.
 *
 * @resource AWS::RDS::DBInstance
 */
export class DatabaseInstanceReadReplica extends DatabaseInstanceNew implements IDatabaseInstance {
  public readonly instanceIdentifier: string;
  public readonly dbInstanceEndpointAddress: string;
  public readonly dbInstanceEndpointPort: string;
  public readonly instanceEndpoint: Endpoint;

  constructor(scope: Construct, id: string, props: DatabaseInstanceReadReplicaProps) {
    super(scope, id, props);

    const instance = new CfnDBInstance(this, 'Resource', {
      ...this.newCfnProps,
      // this must be ARN, not ID, because of https://github.com/terraform-providers/terraform-provider-aws/issues/528#issuecomment-391169012
      sourceDbInstanceIdentifier: props.sourceDatabaseInstance.instanceArn,
      kmsKeyId: props.kmsKey && props.kmsKey.keyArn,
      storageEncrypted: props.kmsKey ? true : props.storageEncrypted,
    });

    this.instanceIdentifier = instance.ref;
    this.dbInstanceEndpointAddress = instance.attrEndpointAddress;
    this.dbInstanceEndpointPort = instance.attrEndpointPort;

    // create a number token that represents the port of the instance
    const portAttribute = Token.asNumber(instance.attrEndpointPort);
    this.instanceEndpoint = new Endpoint(instance.attrEndpointAddress, portAttribute);

    instance.applyRemovalPolicy(props.removalPolicy, {
      applyToUpdateReplacePolicy: true,
    });

    this.setLogRetention();
  }
}

/**
 * Renders the processor features specifications
 *
 * @param features the processor features
 */
function renderProcessorFeatures(features: ProcessorFeatures): CfnDBInstance.ProcessorFeatureProperty[] | undefined {
  const featuresList = Object.entries(features).map(([name, value]) => ({ name, value: value.toString() }));

  return featuresList.length === 0 ? undefined : featuresList;
}
