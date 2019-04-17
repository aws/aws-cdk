import ec2 = require('@aws-cdk/aws-ec2');
import secretsmanager = require('@aws-cdk/aws-secretsmanager');
import { IResource } from '@aws-cdk/cdk';
import { Endpoint } from './endpoint';

/**
 * Create a clustered database with a given number of instances.
 */
export interface IDatabaseCluster extends IResource, ec2.IConnectable, secretsmanager.ISecretAttachmentTarget {
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
  readonly port: string;

  /**
   * The security group for this database cluster
   */
  readonly securityGroupId: string;

  /**
   * Identifier for the cluster
   */
  readonly clusterIdentifier: string;

  /**
   * Identifier for the instances
   */
  readonly instanceIdentifiers: string[];
  // Actual underlying type: DBInstanceId[], but we have to type it more loosely for Java's benefit.

  /**
   * Cluster endpoint address
   */
  readonly clusterEndpointAddress: string;

  /**
   * Reader endpoint address
   */
  readonly readerEndpointAddress: string;

  /**
   * Endpoint addresses of individual instances
   */
  readonly instanceEndpointAddresses: string[];
}
