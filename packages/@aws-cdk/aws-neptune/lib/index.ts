import ec2 = require('@aws-cdk/aws-ec2');
import rds = require('@aws-cdk/aws-rds');
import cdk = require('@aws-cdk/cdk');

/**
 * Properties for a Neptune Graph Database Cluster
 */
export interface NeptuneDatabaseProps {
  /**
   * How many replicas/instances to create
   *
   * Has to be at least 1. Default is 2.
   *
   * @default 2
   */
  instances?: number;

  /**
   * Settings for the individual instances that are launched
   */
  instanceProps: rds.InstanceProps;

  /**
   * Username and password for the administrative user
   */
  masterUser: rds.Login;

  /**
   * What port to listen on
   *
   * @default 3306
   */
  port?: number;

  /**
   * An optional identifier for the cluster
   *
   * If not given, a name is generated.
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
   *
   * If not given, no database is created.
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
   *
   * If not given, an window is randomly.
   */
  preferredMaintenanceWindow?: string;

  /**
   * Parameter group with Neptune settings
   *
   * @default No parameter group
   */
  parameterGroup?: rds.ClusterParameterGroupRef;
}

/**
 * Neptune Graph Database cluster
 *
 * Creates a new Neptune database cluster with a given number of replicas.
 */
export class NeptuneDatabase extends cdk.Construct implements ec2.IConnectable {
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
  public readonly clusterEndpoint: rds.Endpoint;

  /**
   * Endpoint to use for load-balanced read-only operations.
   */
  public readonly readerEndpoint: rds.Endpoint;

  /**
   * Endpoints which address each individual replica.
   */
  public readonly instanceEndpoints: rds.Endpoint[] = [];

  public readonly connections: ec2.Connections;

  private readonly cluster: rds.DatabaseCluster;

  constructor(parent: cdk.Construct, name: string, props: NeptuneDatabaseProps) {
    super(parent, name);

    this.cluster = new rds.DatabaseCluster(this, 'Cluster', {
      engine: rds.DatabaseClusterEngine.Aurora,
      instances: props.instances,
      instanceProps: props.instanceProps,
      masterUser: props.masterUser,
      port: props.port,
      clusterIdentifier: props.clusterIdentifier,
      instanceIdentifierBase: props.instanceIdentifierBase,
      defaultDatabaseName: props.defaultDatabaseName,
      kmsKeyArn: props.kmsKeyArn,
      preferredMaintenanceWindow: props.preferredMaintenanceWindow,
      parameterGroup: props.parameterGroup,
    });

    this.clusterIdentifier = this.cluster.clusterIdentifier;
    this.instanceIdentifiers = this.cluster.instanceIdentifiers;
    this.clusterEndpoint = this.cluster.clusterEndpoint;
    this.readerEndpoint = this.cluster.readerEndpoint;
    this.connections = this.cluster.connections;
  }
}
