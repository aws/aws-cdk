import * as ec2 from '@aws-cdk/aws-ec2';
import { IRole, ManagedPolicy, Role, ServicePrincipal } from '@aws-cdk/aws-iam';
import * as kms from '@aws-cdk/aws-kms';
import * as s3 from '@aws-cdk/aws-s3';
import * as secretsmanager from '@aws-cdk/aws-secretsmanager';
import { Construct, Duration, RemovalPolicy, Resource, Token } from '@aws-cdk/core';
import { DatabaseClusterAttributes, IDatabaseCluster } from './cluster-ref';
import { DatabaseSecret } from './database-secret';
import { Endpoint } from './endpoint';
import { ClusterParameterGroup, IParameterGroup } from './parameter-group';
import { BackupProps, DatabaseClusterEngine, InstanceProps, Login, RotationMultiUserOptions } from './props';
import { CfnDBCluster, CfnDBInstance, CfnDBSubnetGroup } from './rds.generated';

/**
 * Properties for a new database cluster
 */
export interface DatabaseClusterProps {
  /**
   * What kind of database to start
   */
  readonly engine: DatabaseClusterEngine;

  /**
   * What version of the database to start
   *
   * @default - The default for the engine is used.
   */
  readonly engineVersion?: string;

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
   * Username and password for the administrative user
   */
  readonly masterUser: Login;

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
   * Whether to enable storage encryption
   *
   * @default false
   */
  readonly storageEncrypted?: boolean

  /**
   * The KMS key for storage encryption. If specified `storageEncrypted`
   * will be set to `true`.
   *
   * @default - default master key.
   */
  readonly kmsKey?: kms.IKey;

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
   * @default - Retain cluster.
   */
  readonly removalPolicy?: RemovalPolicy

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
abstract class DatabaseClusterBase extends Resource implements IDatabaseCluster {
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
   * Security group identifier of this database
   */
  public abstract readonly securityGroupId: string;

  /**
   * Renders the secret attachment target specifications.
   */
  public asSecretAttachmentTarget(): secretsmanager.SecretAttachmentTargetProps {
    return {
      targetId: this.clusterIdentifier,
      targetType: secretsmanager.AttachmentTargetType.RDS_DB_CLUSTER
    };
  }
}

/**
 * Create a clustered database with a given number of instances.
 *
 * @resource AWS::RDS::DBCluster
 */
export class DatabaseCluster extends DatabaseClusterBase {
  /**
   * Import an existing DatabaseCluster from properties
   */
  public static fromDatabaseClusterAttributes(scope: Construct, id: string, attrs: DatabaseClusterAttributes): IDatabaseCluster {
    class Import extends DatabaseClusterBase implements IDatabaseCluster {
      public readonly defaultPort = ec2.Port.tcp(attrs.port);
      public readonly connections = new ec2.Connections({
        securityGroups: [attrs.securityGroup],
        defaultPort: this.defaultPort
      });
      public readonly clusterIdentifier = attrs.clusterIdentifier;
      public readonly instanceIdentifiers: string[] = [];
      public readonly clusterEndpoint = new Endpoint(attrs.clusterEndpointAddress, attrs.port);
      public readonly clusterReadEndpoint = new Endpoint(attrs.readerEndpointAddress, attrs.port);
      public readonly instanceEndpoints = attrs.instanceEndpointAddresses.map(a => new Endpoint(a, attrs.port));
      public readonly securityGroupId = attrs.securityGroup.securityGroupId;
    }

    return new Import(scope, id);
  }

  /**
   * Identifier of the cluster
   */
  public readonly clusterIdentifier: string;

  /**
   * Identifiers of the replicas
   */
  public readonly instanceIdentifiers: string[] = [];

  /**
   * The endpoint to use for read/write operations
   */
  public readonly clusterEndpoint: Endpoint;

  /**
   * Endpoint to use for load-balanced read-only operations.
   */
  public readonly clusterReadEndpoint: Endpoint;

  /**
   * Endpoints which address each individual replica.
   */
  public readonly instanceEndpoints: Endpoint[] = [];

  /**
   * Access to the network connections
   */
  public readonly connections: ec2.Connections;

  /**
   * Security group identifier of this database
   */
  public readonly securityGroupId: string;

  /**
   * The secret attached to this cluster
   */
  public readonly secret?: secretsmanager.ISecret;

  private readonly singleUserRotationApplication: secretsmanager.SecretRotationApplication;
  private readonly multiUserRotationApplication: secretsmanager.SecretRotationApplication;

  /**
   * The VPC where the DB subnet group is created.
   */
  private readonly vpc: ec2.IVpc;

  /**
   * The subnets used by the DB subnet group.
   */
  private readonly vpcSubnets?: ec2.SubnetSelection;

  constructor(scope: Construct, id: string, props: DatabaseClusterProps) {
    super(scope, id);

    this.vpc = props.instanceProps.vpc;
    this.vpcSubnets = props.instanceProps.vpcSubnets;

    const { subnetIds } = props.instanceProps.vpc.selectSubnets(props.instanceProps.vpcSubnets);

    // Cannot test whether the subnets are in different AZs, but at least we can test the amount.
    if (subnetIds.length < 2) {
      throw new Error(`Cluster requires at least 2 subnets, got ${subnetIds.length}`);
    }

    const subnetGroup = new CfnDBSubnetGroup(this, 'Subnets', {
      dbSubnetGroupDescription: `Subnets for ${id} database`,
      subnetIds,
    });

    const securityGroup = props.instanceProps.securityGroup !== undefined ?
    props.instanceProps.securityGroup : new ec2.SecurityGroup(this, 'SecurityGroup', {
      description: 'RDS security group',
      vpc: props.instanceProps.vpc
    });
    this.securityGroupId = securityGroup.securityGroupId;

    let secret: DatabaseSecret | undefined;
    if (!props.masterUser.password) {
      secret = new DatabaseSecret(this, 'Secret', {
        username: props.masterUser.username,
        encryptionKey: props.masterUser.kmsKey
      });
    }

    this.singleUserRotationApplication = props.engine.singleUserRotationApplication;
    this.multiUserRotationApplication = props.engine.multiUserRotationApplication;

    let s3ImportRole = props.s3ImportRole;
    if (props.s3ImportBuckets && props.s3ImportBuckets.length > 0) {
      if (props.s3ImportRole) {
        throw new Error(`Only one of s3ImportRole or s3ImportBuckets must be specified, not both.`);
      }

      s3ImportRole = new Role(this, "S3ImportRole", {
        assumedBy: new ServicePrincipal("rds.amazonaws.com")
      });
      for (const bucket of props.s3ImportBuckets) {
        bucket.grantRead(s3ImportRole);
      }
    }

    let s3ExportRole = props.s3ExportRole;
    if (props.s3ExportBuckets && props.s3ExportBuckets.length > 0) {
      if (props.s3ExportRole) {
        throw new Error(`Only one of s3ExportRole or s3ExportBuckets must be specified, not both.`);
      }

      s3ExportRole = new Role(this, "S3ExportRole", {
        assumedBy: new ServicePrincipal("rds.amazonaws.com"),
      });
      for (const bucket of props.s3ExportBuckets) {
        bucket.grantReadWrite(s3ExportRole);
      }
    }

    let clusterParameterGroup = props.parameterGroup;
    const clusterAssociatedRoles: CfnDBCluster.DBClusterRoleProperty[] = [];
    if (s3ImportRole || s3ExportRole) {
      if (s3ImportRole) {
        clusterAssociatedRoles.push({ roleArn: s3ImportRole.roleArn });
      }
      if (s3ExportRole) {
        clusterAssociatedRoles.push({ roleArn: s3ExportRole.roleArn });
      }

      // MySQL requires the associated roles to be specified as cluster parameters as well, PostgreSQL does not
      if (props.engine === DatabaseClusterEngine.AURORA || props.engine === DatabaseClusterEngine.AURORA_MYSQL) {
        if (!clusterParameterGroup) {
          const parameterGroupFamily = props.engine.parameterGroupFamily(props.engineVersion);
          if (!parameterGroupFamily) {
            throw new Error(`No parameter group family found for database engine ${props.engine.name} with version ${props.engineVersion}.` +
              'Failed to set the correct cluster parameters for s3 import and export roles.');
          }
          clusterParameterGroup = new ClusterParameterGroup(this, "ClusterParameterGroup", {
            family: parameterGroupFamily,
          });
        }

        if (clusterParameterGroup instanceof ClusterParameterGroup) { // ignore imported ClusterParameterGroup
          if (s3ImportRole) {
            clusterParameterGroup.addParameter('aurora_load_from_s3_role', s3ImportRole.roleArn);
          }
          if (s3ExportRole) {
            clusterParameterGroup.addParameter('aurora_select_into_s3_role', s3ExportRole.roleArn);
          }
        }
      }
    }

    const cluster = new CfnDBCluster(this, 'Resource', {
      // Basic
      engine: props.engine.name,
      engineVersion: props.engineVersion,
      dbClusterIdentifier: props.clusterIdentifier,
      dbSubnetGroupName: subnetGroup.ref,
      vpcSecurityGroupIds: [this.securityGroupId],
      port: props.port,
      dbClusterParameterGroupName: clusterParameterGroup && clusterParameterGroup.parameterGroupName,
      associatedRoles: clusterAssociatedRoles.length > 0 ? clusterAssociatedRoles : undefined,
      // Admin
      masterUsername: secret ? secret.secretValueFromJson('username').toString() : props.masterUser.username,
      masterUserPassword: secret
        ? secret.secretValueFromJson('password').toString()
        : (props.masterUser.password
            ? props.masterUser.password.toString()
            : undefined),
      backupRetentionPeriod: props.backup && props.backup.retention && props.backup.retention.toDays(),
      preferredBackupWindow: props.backup && props.backup.preferredWindow,
      preferredMaintenanceWindow: props.preferredMaintenanceWindow,
      databaseName: props.defaultDatabaseName,
      // Encryption
      kmsKeyId: props.kmsKey && props.kmsKey.keyArn,
      storageEncrypted: props.kmsKey ? true : props.storageEncrypted
    });

    cluster.applyRemovalPolicy(props.removalPolicy, {
      applyToUpdateReplacePolicy: true
    });

    this.clusterIdentifier = cluster.ref;

    // create a number token that represents the port of the cluster
    const portAttribute = Token.asNumber(cluster.attrEndpointPort);
    this.clusterEndpoint = new Endpoint(cluster.attrEndpointAddress, portAttribute);
    this.clusterReadEndpoint = new Endpoint(cluster.attrReadEndpointAddress, portAttribute);

    if (secret) {
      this.secret = secret.attach(this);
    }

    const instanceCount = props.instances != null ? props.instances : 2;
    if (instanceCount < 1) {
      throw new Error('At least one instance is required');
    }

    // Get the actual subnet objects so we can depend on internet connectivity.
    const internetConnected = props.instanceProps.vpc.selectSubnets(props.instanceProps.vpcSubnets).internetConnectivityEstablished;

    let monitoringRole;
    if (props.monitoringInterval && props.monitoringInterval.toSeconds()) {
      monitoringRole = props.monitoringRole || new Role(this, "MonitoringRole", {
        assumedBy: new ServicePrincipal("monitoring.rds.amazonaws.com"),
        managedPolicies: [
          ManagedPolicy.fromAwsManagedPolicyName('service-role/AmazonRDSEnhancedMonitoringRole')
        ]
      });
    }

    for (let i = 0; i < instanceCount; i++) {
      const instanceIndex = i + 1;

      const instanceIdentifier = props.instanceIdentifierBase != null ? `${props.instanceIdentifierBase}${instanceIndex}` :
                     props.clusterIdentifier != null ? `${props.clusterIdentifier}instance${instanceIndex}` :
                     undefined;

      const publiclyAccessible = props.instanceProps.vpcSubnets && props.instanceProps.vpcSubnets.subnetType === ec2.SubnetType.PUBLIC;

      const instance = new CfnDBInstance(this, `Instance${instanceIndex}`, {
        // Link to cluster
        engine: props.engine.name,
        engineVersion: props.engineVersion,
        dbClusterIdentifier: cluster.ref,
        dbInstanceIdentifier: instanceIdentifier,
        // Instance properties
        dbInstanceClass: databaseInstanceType(props.instanceProps.instanceType),
        publiclyAccessible,
        // This is already set on the Cluster. Unclear to me whether it should be repeated or not. Better yes.
        dbSubnetGroupName: subnetGroup.ref,
        dbParameterGroupName: props.instanceProps.parameterGroup && props.instanceProps.parameterGroup.parameterGroupName,
        monitoringInterval: props.monitoringInterval && props.monitoringInterval.toSeconds(),
        monitoringRoleArn: monitoringRole && monitoringRole.roleArn
      });

      instance.applyRemovalPolicy(props.removalPolicy, {
        applyToUpdateReplacePolicy: true
      });

      // We must have a dependency on the NAT gateway provider here to create
      // things in the right order.
      instance.node.addDependency(internetConnected);

      this.instanceIdentifiers.push(instance.ref);
      this.instanceEndpoints.push(new Endpoint(instance.attrEndpointAddress, portAttribute));
    }

    const defaultPort = ec2.Port.tcp(this.clusterEndpoint.port);
    this.connections = new ec2.Connections({ securityGroups: [securityGroup], defaultPort });
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
 * Turn a regular instance type into a database instance type
 */
function databaseInstanceType(instanceType: ec2.InstanceType) {
  return 'db.' + instanceType.toString();
}
