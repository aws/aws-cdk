import ec2 = require('@aws-cdk/aws-ec2');
import secretsmanager = require('@aws-cdk/aws-secretsmanager');
import cdk = require('@aws-cdk/cdk');
import { IClusterParameterGroup } from './cluster-parameter-group';
import { DatabaseClusterImportProps, Endpoint, IDatabaseCluster } from './cluster-ref';
import { DatabaseSecret } from './database-secret';
import { BackupProps, DatabaseClusterEngine, InstanceProps, Login } from './props';
import { CfnDBCluster, CfnDBInstance, CfnDBSubnetGroup } from './rds.generated';
import { DatabaseEngine, RotationSingleUser, RotationSingleUserOptions } from './rotation-single-user';

/**
 * Properties for a new database cluster
 */
export interface DatabaseClusterProps {
  /**
   * What kind of database to start
   */
  engine: DatabaseClusterEngine;

  /**
   * How many replicas/instances to create
   *
   * Has to be at least 1.
   *
   * @default 2
   */
  instances?: number;

  /**
   * Settings for the individual instances that are launched
   */
  instanceProps: InstanceProps;

  /**
   * Username and password for the administrative user
   */
  masterUser: Login;

  /**
   * Backup settings
   */
  backup?: BackupProps;

  /**
   * What port to listen on
   *
   * If not supplied, the default for the engine is used.
   */
  port?: number;

  /**
   * An optional identifier for the cluster
   *
   * If not supplied, a name is automatically generated.
   */
  clusterIdentifier?: string;

  /**
   * Base identifier for instances
   *
   * Every replica is named by appending the replica number to this string, 1-based.
   *
   * If not given, the clusterIdentifier is used with the word "Instance" appended.
   *
   * If clusterIdentifier is also not given, the identifier is automatically generated.
   */
  instanceIdentifierBase?: string;

  /**
   * Name of a database which is automatically created inside the cluster
   */
  defaultDatabaseName?: string;

  /**
   * ARN of KMS key if you want to enable storage encryption
   */
  kmsKeyArn?: string;

  /**
   * A daily time range in 24-hours UTC format in which backups preferably execute.
   *
   * Must be at least 30 minutes long.
   *
   * Example: '01:00-02:00'
   */
  preferredMaintenanceWindow?: string;

  /**
   * Additional parameters to pass to the database engine
   *
   * @default No parameter group
   */
  parameterGroup?: IClusterParameterGroup;
}

/**
 * A new or imported clustered database.
 */
export abstract class DatabaseClusterBase extends cdk.Construct implements IDatabaseCluster {
  /**
   * Import an existing DatabaseCluster from properties
   */
  public static import(scope: cdk.Construct, id: string, props: DatabaseClusterImportProps): IDatabaseCluster {
    return new ImportedDatabaseCluster(scope, id, props);
  }

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
  public abstract readonly readerEndpoint: Endpoint;

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

  public abstract export(): DatabaseClusterImportProps;

  /**
   * Renders the secret attachment target specifications.
   */
  public asSecretAttachmentTarget(): secretsmanager.SecretAttachmentTargetProps {
    return {
      targetId: this.clusterIdentifier,
      targetType: secretsmanager.AttachmentTargetType.Cluster
    };
  }
}

/**
 * Create a clustered database with a given number of instances.
 */
export class DatabaseCluster extends DatabaseClusterBase implements IDatabaseCluster {
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
  public readonly readerEndpoint: Endpoint;

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

  /**
   * The database engine of this cluster
   */
  public readonly engine: DatabaseClusterEngine;

  /**
   * The VPC where the DB subnet group is created.
   */
  private readonly vpc: ec2.IVpcNetwork;

  /**
   * The subnets used by the DB subnet group.
   */
  private readonly vpcSubnets?: ec2.SubnetSelection;

  constructor(scope: cdk.Construct, id: string, props: DatabaseClusterProps) {
    super(scope, id);

    this.vpc = props.instanceProps.vpc;
    this.vpcSubnets = props.instanceProps.vpcSubnets;

    const subnetIds = props.instanceProps.vpc.subnetIds(props.instanceProps.vpcSubnets);

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

    let secret;
    if (!props.masterUser.password) {
      secret = new DatabaseSecret(this, 'Secret', {
        username: props.masterUser.username,
        encryptionKey: props.masterUser.kmsKey
      });
    }

    this.engine = props.engine;

    const cluster = new CfnDBCluster(this, 'Resource', {
      // Basic
      engine: this.engine,
      dbClusterIdentifier: props.clusterIdentifier,
      dbSubnetGroupName: subnetGroup.ref,
      vpcSecurityGroupIds: [this.securityGroupId],
      port: props.port,
      dbClusterParameterGroupName: props.parameterGroup && props.parameterGroup.parameterGroupName,
      // Admin
      masterUsername: secret ? secret.jsonFieldValue('username') : props.masterUser.username,
      masterUserPassword: secret ? secret.jsonFieldValue('password') : props.masterUser.password,
      backupRetentionPeriod: props.backup && props.backup.retentionDays,
      preferredBackupWindow: props.backup && props.backup.preferredWindow,
      preferredMaintenanceWindow: props.preferredMaintenanceWindow,
      databaseName: props.defaultDatabaseName,
      // Encryption
      kmsKeyId: props.kmsKeyArn,
      storageEncrypted: props.kmsKeyArn ? true : false,
    });

    this.clusterIdentifier = cluster.ref;
    this.clusterEndpoint = new Endpoint(cluster.dbClusterEndpointAddress, cluster.dbClusterEndpointPort);
    this.readerEndpoint = new Endpoint(cluster.dbClusterReadEndpointAddress, cluster.dbClusterEndpointPort);

    if (secret) {
      this.secret = secret.addTargetAttachment('AttachedSecret', {
        target: this
      });
    }

    const instanceCount = props.instances != null ? props.instances : 2;
    if (instanceCount < 1) {
      throw new Error('At least one instance is required');
    }

    // Get the actual subnet objects so we can depend on internet connectivity.
    const internetConnected = props.instanceProps.vpc.subnetInternetDependencies(props.instanceProps.vpcSubnets);
    for (let i = 0; i < instanceCount; i++) {
      const instanceIndex = i + 1;

      const instanceIdentifier = props.instanceIdentifierBase != null ? `${props.instanceIdentifierBase}${instanceIndex}` :
                     props.clusterIdentifier != null ? `${props.clusterIdentifier}instance${instanceIndex}` :
                     undefined;

      const publiclyAccessible = props.instanceProps.vpcSubnets && props.instanceProps.vpcSubnets.subnetType === ec2.SubnetType.Public;

      const instanceParameterGroupName = props.instanceProps.parameterGroup && props.instanceProps.parameterGroup.parameterGroupName;

      const instance = new CfnDBInstance(this, `Instance${instanceIndex}`, {
        // Link to cluster
        engine: props.engine,
        dbClusterIdentifier: cluster.ref,
        dbInstanceIdentifier: instanceIdentifier,
        // Instance properties
        dbInstanceClass: databaseInstanceType(props.instanceProps.instanceType),
        publiclyAccessible,
        // This is already set on the Cluster. Unclear to me whether it should be repeated or not. Better yes.
        dbSubnetGroupName: subnetGroup.ref,
        dbParameterGroupName: instanceParameterGroupName,
      });

      // We must have a dependency on the NAT gateway provider here to create
      // things in the right order.
      instance.node.addDependency(internetConnected);

      this.instanceIdentifiers.push(instance.ref);
      this.instanceEndpoints.push(new Endpoint(instance.dbInstanceEndpointAddress, instance.dbInstanceEndpointPort));
    }

    const defaultPortRange = new ec2.TcpPortFromAttribute(this.clusterEndpoint.port);
    this.connections = new ec2.Connections({ securityGroups: [securityGroup], defaultPortRange });
  }

  /**
   * Adds the single user rotation of the master password to this cluster.
   */
  public addRotationSingleUser(id: string, options: RotationSingleUserOptions = {}): RotationSingleUser {
    if (!this.secret) {
      throw new Error('Cannot add single user rotation for a cluster without secret.');
    }
    return new RotationSingleUser(this, id, {
      secret: this.secret,
      engine: toDatabaseEngine(this.engine),
      vpc: this.vpc,
      vpcSubnets: this.vpcSubnets,
      target: this,
      ...options
    });
  }

  /**
   * Export a Database Cluster for importing in another stack
   */
  public export(): DatabaseClusterImportProps {
    // tslint:disable:max-line-length
    return {
      port: new cdk.CfnOutput(this, 'Port', { value: this.clusterEndpoint.port, }).makeImportValue().toString(),
      securityGroupId: new cdk.CfnOutput(this, 'SecurityGroupId', { value: this.securityGroupId, }).makeImportValue().toString(),
      clusterIdentifier: new cdk.CfnOutput(this, 'ClusterIdentifier', { value: this.clusterIdentifier, }).makeImportValue().toString(),
      instanceIdentifiers: new cdk.StringListCfnOutput(this, 'InstanceIdentifiers', { values: this.instanceIdentifiers }).makeImportValues().map(x => x.toString()),
      clusterEndpointAddress: new cdk.CfnOutput(this, 'ClusterEndpointAddress', { value: this.clusterEndpoint.hostname, }).makeImportValue().toString(),
      readerEndpointAddress: new cdk.CfnOutput(this, 'ReaderEndpointAddress', { value: this.readerEndpoint.hostname, }).makeImportValue().toString(),
      instanceEndpointAddresses: new cdk.StringListCfnOutput(this, 'InstanceEndpointAddresses', { values: this.instanceEndpoints.map(e => e.hostname) }).makeImportValues().map(x => x.toString()),
    };
    // tslint:enable:max-line-length
  }
}

/**
 * Turn a regular instance type into a database instance type
 */
function databaseInstanceType(instanceType: ec2.InstanceType) {
  return 'db.' + instanceType.toString();
}

/**
 * An imported Database Cluster
 */
class ImportedDatabaseCluster extends DatabaseClusterBase implements IDatabaseCluster {
  /**
   * Default port to connect to this database
   */
  public readonly defaultPortRange: ec2.IPortRange;

  /**
   * Access to the network connections
   */
  public readonly connections: ec2.Connections;

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
  public readonly readerEndpoint: Endpoint;

  /**
   * Endpoints which address each individual replica.
   */
  public readonly instanceEndpoints: Endpoint[] = [];

  /**
   * Security group identifier of this database
   */
  public readonly securityGroupId: string;

  constructor(scope: cdk.Construct, name: string, private readonly props: DatabaseClusterImportProps) {
    super(scope, name);

    this.securityGroupId = props.securityGroupId;
    this.defaultPortRange = new ec2.TcpPortFromAttribute(props.port);
    this.connections = new ec2.Connections({
      securityGroups: [ec2.SecurityGroup.import(this, 'SecurityGroup', props)],
      defaultPortRange: this.defaultPortRange
    });
    this.clusterIdentifier = props.clusterIdentifier;
    this.clusterEndpoint = new Endpoint(props.clusterEndpointAddress, props.port);
    this.readerEndpoint = new Endpoint(props.readerEndpointAddress, props.port);
    this.instanceEndpoints = props.instanceEndpointAddresses.map(a => new Endpoint(a, props.port));
  }

  public export() {
    return this.props;
  }
}

/**
 * Transforms a DatbaseClusterEngine to a DatabaseEngine.
 *
 * @param engine the engine to transform
 */
function toDatabaseEngine(engine: DatabaseClusterEngine): DatabaseEngine {
  switch (engine) {
    case DatabaseClusterEngine.Aurora:
    case DatabaseClusterEngine.AuroraMysql:
      return DatabaseEngine.Mysql;
    case DatabaseClusterEngine.AuroraPostgresql:
      return DatabaseEngine.Postgres;
    default:
      throw new Error('Unknown engine');
  }
}
