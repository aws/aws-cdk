import { IConnectable, ISecurityGroup } from '@aws-cdk/aws-ec2';
import { ISecretAttachmentTarget } from '@aws-cdk/aws-secretsmanager';
import { IResource } from '@aws-cdk/core';
import { Endpoint } from './endpoint';

/**
 * Create a clustered database with a given number of instances.
 */
export interface IDatabaseCluster extends IResource, IConnectable, ISecretAttachmentTarget {
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
   * @attribute Endpoint,Port
   */
  readonly clusterEndpoint: Endpoint;

  /**
   * Endpoint to use for load-balanced read-only operations.
   * @attribute ReadEndpoint
   */
  readonly clusterReadEndpoint: Endpoint;

  /**
   * Endpoints which address each individual replica.
   */
  readonly instanceEndpoints: Endpoint[];

  /**
   * The security group for this database cluster
   */
  readonly securityGroupId: string;
}

/**
 * Properties that describe an existing cluster instance
 */
export interface DatabaseClusterAttributes {
  /**
   * The database port
   * @default - none
   */
  readonly port?: number;

  /**
   * The security group of the database cluster
   * @default - no security groups
   */
  readonly securityGroup?: ISecurityGroup;

  /**
   * Identifier for the cluster
   */
  readonly clusterIdentifier: string;

  /**
   * Identifier for the instances
   * @default - no instance identifiers
   */
  readonly instanceIdentifiers?: string[];
  // Actual underlying type: DBInstanceId[], but we have to type it more loosely for Java's benefit.

  /**
   * Cluster endpoint address
   * @default - no cluster endpoint address
   */
  readonly clusterEndpointAddress?: string;

  /**
   * Reader endpoint address
   * @default - no reader endpoint address
   */
  readonly readerEndpointAddress?: string;

  /**
   * Endpoint addresses of individual instances
   * @default - no instance endpoint addresses
   */
  readonly instanceEndpointAddresses?: string[];
}
