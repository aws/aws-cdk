import ec2 = require('@aws-cdk/aws-ec2');
import cdk = require('@aws-cdk/cdk');
import { IClusterParameterGroup } from './cluster-parameter-group';
import { DatabaseClusterImportProps, Endpoint, IDatabaseCluster } from './cluster-ref';
import { BackupProps, DatabaseClusterEngine, InstanceProps, Login } from './props';
import { CfnDBCluster, CfnDBInstance, CfnDBSubnetGroup } from './rds.generated';

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
 * Create a clustered database with a given number of instances.
 */
export class DatabaseCluster extends cdk.Construct implements IDatabaseCluster {
  /**
   * Import an existing DatabaseCluster from properties
   */
  public static import(scope: cdk.Construct, id: string, props: DatabaseClusterImportProps): IDatabaseCluster {
    return new ImportedDatabaseCluster(scope, id, props);
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

  constructor(scope: cdk.Construct, id: string, props: DatabaseClusterProps) {
    super(scope, id);

    const subnets = props.instanceProps.vpc.subnets(props.instanceProps.vpcPlacement);

    // Cannot test whether the subnets are in different AZs, but at least we can test the amount.
    if (subnets.length < 2) {
      throw new Error(`Cluster requires at least 2 subnets, got ${subnets.length}`);
    }

    const subnetGroup = new CfnDBSubnetGroup(this, 'Subnets', {
      dbSubnetGroupDescription: `Subnets for ${id} database`,
      subnetIds: subnets.map(s => s.subnetId)
    });

    const securityGroup = new ec2.SecurityGroup(this, 'SecurityGroup', {
      description: 'RDS security group',
      vpc: props.instanceProps.vpc
    });
    this.securityGroupId = securityGroup.securityGroupId;

    const cluster = new CfnDBCluster(this, 'Resource', {
      // Basic
      engine: props.engine,
      dbClusterIdentifier: props.clusterIdentifier,
      dbSubnetGroupName: subnetGroup.ref,
      vpcSecurityGroupIds: [this.securityGroupId],
      port: props.port,
      dbClusterParameterGroupName: props.parameterGroup && props.parameterGroup.parameterGroupName,
      // Admin
      masterUsername: props.masterUser.username,
      masterUserPassword: props.masterUser.password,
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

    const instanceCount = props.instances != null ? props.instances : 2;
    if (instanceCount < 1) {
      throw new Error('At least one instance is required');
    }

    for (let i = 0; i < instanceCount; i++) {
      const instanceIndex = i + 1;

      const instanceIdentifier = props.instanceIdentifierBase != null ? `${props.instanceIdentifierBase}${instanceIndex}` :
                     props.clusterIdentifier != null ? `${props.clusterIdentifier}instance${instanceIndex}` :
                     undefined;

      const publiclyAccessible = props.instanceProps.vpcPlacement && props.instanceProps.vpcPlacement.subnetsToUse === ec2.SubnetType.Public;

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
      });

      // We must have a dependency on the NAT gateway provider here to create
      // things in the right order.
      instance.node.addDependency(...subnets.map(s => s.internetConnectivityEstablished));

      this.instanceIdentifiers.push(instance.ref);
      this.instanceEndpoints.push(new Endpoint(instance.dbInstanceEndpointAddress, instance.dbInstanceEndpointPort));
    }

    const defaultPortRange = new ec2.TcpPortFromAttribute(this.clusterEndpoint.port);
    this.connections = new ec2.Connections({ securityGroups: [securityGroup], defaultPortRange });
  }

  /**
   * Export a Database Cluster for importing in another stack
   */
  public export(): DatabaseClusterImportProps {
    // tslint:disable:max-line-length
    return {
      port: new cdk.Output(this, 'Port', { value: this.clusterEndpoint.port, }).makeImportValue().toString(),
      securityGroupId: new cdk.Output(this, 'SecurityGroupId', { value: this.securityGroupId, }).makeImportValue().toString(),
      clusterIdentifier: new cdk.Output(this, 'ClusterIdentifier', { value: this.clusterIdentifier, }).makeImportValue().toString(),
      instanceIdentifiers: new cdk.StringListOutput(this, 'InstanceIdentifiers', { values: this.instanceIdentifiers }).makeImportValues().map(x => x.toString()),
      clusterEndpointAddress: new cdk.Output(this, 'ClusterEndpointAddress', { value: this.clusterEndpoint.hostname, }).makeImportValue().toString(),
      readerEndpointAddress: new cdk.Output(this, 'ReaderEndpointAddress', { value: this.readerEndpoint.hostname, }).makeImportValue().toString(),
      instanceEndpointAddresses: new cdk.StringListOutput(this, 'InstanceEndpointAddresses', { values: this.instanceEndpoints.map(e => e.hostname) }).makeImportValues().map(x => x.toString()),
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
class ImportedDatabaseCluster extends cdk.Construct implements IDatabaseCluster {
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
