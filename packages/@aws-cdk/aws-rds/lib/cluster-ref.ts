import ec2 = require('@aws-cdk/aws-ec2');

/**
 * Create a clustered database with a given number of instances.
 */
export interface IDatabaseCluster extends ec2.IConnectable {
  /**
   * Identifier of the cluster
   */
  readonly clusterIdentifier: string;

  /**
   * Identifiers of the replicas
   */
  readonly instanceIdentifiers: string[];

  /**
   * The endpoint to use for read/write operations
   */
  readonly clusterEndpoint: Endpoint;

  /**
   * Endpoint to use for load-balanced read-only operations.
   */
  readonly readerEndpoint: Endpoint;

  /**
   * Endpoints which address each individual replica.
   */
  readonly instanceEndpoints: Endpoint[];

  /**
   * The security group for this database cluster
   */
  readonly securityGroupId: string;

  /**
   * Export a Database Cluster for importing in another stack
   */
  export(): DatabaseClusterImportProps;
}

/**
 * Properties that describe an existing cluster instance
 */
export interface DatabaseClusterImportProps {
  /**
   * The database port
   */
  port: string;

  /**
   * The security group for this database cluster
   */
  securityGroupId: string;

  /**
   * Identifier for the cluster
   */
  clusterIdentifier: string;

  /**
   * Identifier for the instances
   */
  instanceIdentifiers: string[];
  // Actual underlying type: DBInstanceId[], but we have to type it more loosely for Java's benefit.

  /**
   * Cluster endpoint address
   */
  clusterEndpointAddress: string;

  /**
   * Reader endpoint address
   */
  readerEndpointAddress: string;

  /**
   * Endpoint addresses of individual instances
   */
  instanceEndpointAddresses: string[];
}

/**
 * Connection endpoint of a database cluster or instance
 *
 * Consists of a combination of hostname and port.
 */
export class Endpoint {
  /**
   * The hostname of the endpoint
   */
  public readonly hostname: string;

  /**
   * The port of the endpoint
   */
  public readonly port: string;

  /**
   * The combination of "HOSTNAME:PORT" for this endpoint
   */
  public readonly socketAddress: string;

  constructor(address: string, port: string) {
    this.hostname = address;
    this.port = port;
    this.socketAddress = `${address}:${port}`;
  }
}
