import * as ec2 from '@aws-cdk/aws-ec2';
import * as secretsmanager from '@aws-cdk/aws-secretsmanager';
import { IResource } from '@aws-cdk/core';
import { Endpoint } from './endpoint';

/**
 * Create a Redshift Cluster with a given number of nodes.
 */
export interface ICluster extends IResource, ec2.IConnectable, secretsmanager.ISecretAttachmentTarget {
  /**
   * Name of the cluster
   * @attribute ClusterName
   */
  readonly clusterName: string;

  /**
   * The endpoint to use for read/write operations
   * @attribute EndpointAddress,EndpointPort
   */
  readonly clusterEndpoint: Endpoint;

  /**
   * The security group for this database cluster
   */
  readonly securityGroupIds: string[];
}

/**
 * Properties that describe an existing cluster instance
 */
export interface ClusterAttributes {
  /**
   * The security groups of the redshift cluster
   */
  readonly securityGroups: ec2.ISecurityGroup[];

  /**
   * Identifier for the cluster
   */
  readonly clusterName: string;

  /**
   * Cluster endpoint address
   */
  readonly clusterEndpointAddress: string;

  /**
   * Cluster endpoint port
   */
  readonly clusterEndpointPort: number;

}