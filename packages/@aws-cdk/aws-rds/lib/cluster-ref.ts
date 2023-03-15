import * as ec2 from '@aws-cdk/aws-ec2';
import * as secretsmanager from '@aws-cdk/aws-secretsmanager';
import { IResource } from '@aws-cdk/core';
import { IClusterEngine } from './cluster-engine';
import { Endpoint } from './endpoint';
import { DatabaseProxy, DatabaseProxyOptions } from './proxy';

/**
 * Create a clustered database with a given number of instances.
 */
export interface IDatabaseCluster extends IResource, ec2.IConnectable, secretsmanager.ISecretAttachmentTarget {
  /**
   * Identifier of the cluster
   */
  readonly clusterIdentifier: string;

  /**
   * The immutable identifier for the cluster; for example: cluster-ABCD1234EFGH5678IJKL90MNOP.
   *
   * This AWS Region-unique identifier is used in things like IAM authentication policies.
   */
  readonly clusterResourceIdentifier: string;

  /**
   * Identifiers of the replicas
   */
  readonly instanceIdentifiers: string[];

  /**
   * The endpoint to use for read/write operations
   * @attribute EndpointAddress,EndpointPort
   */
  readonly clusterEndpoint: Endpoint;

  /**
   * Endpoint to use for load-balanced read-only operations.
   * @attribute ReadEndpointAddress
   */
  readonly clusterReadEndpoint: Endpoint;

  /**
   * Endpoints which address each individual replica.
   */
  readonly instanceEndpoints: Endpoint[];

  /**
   * The engine of this Cluster.
   * May be not known for imported Clusters if it wasn't provided explicitly.
   */
  readonly engine?: IClusterEngine;

  /**
   * Add a new db proxy to this cluster.
   */
  addProxy(id: string, options: DatabaseProxyOptions): DatabaseProxy;
}

/**
 * Properties that describe an existing cluster instance
 */
export interface DatabaseClusterAttributes {
  /**
   * Identifier for the cluster
   */
  readonly clusterIdentifier: string;

  /**
   * The immutable identifier for the cluster; for example: cluster-ABCD1234EFGH5678IJKL90MNOP.
   *
   * This AWS Region-unique identifier is used to grant access to the cluster.
   *
   * @default none
   */
  readonly clusterResourceIdentifier?: string;

  /**
   * The database port
   *
   * @default - none
   */
  readonly port?: number;

  /**
   * The security groups of the database cluster
   *
   * @default - no security groups
   */
  readonly securityGroups?: ec2.ISecurityGroup[];

  /**
   * Identifier for the instances
   *
   * @default - no instance identifiers
   */
  readonly instanceIdentifiers?: string[];
  // Actual underlying type: DBInstanceId[], but we have to type it more loosely for Java's benefit.

  /**
   * Cluster endpoint address
   *
   * @default - no endpoint address
   */
  readonly clusterEndpointAddress?: string;

  /**
   * Reader endpoint address
   *
   * @default - no reader address
   */
  readonly readerEndpointAddress?: string;

  /**
   * Endpoint addresses of individual instances
   *
   * @default - no instance endpoints
   */
  readonly instanceEndpointAddresses?: string[];

  /**
   * The engine of the existing Cluster.
   *
   * @default - the imported Cluster's engine is unknown
   */
  readonly engine?: IClusterEngine;
}
