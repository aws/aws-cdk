import { IResource, Resource } from '@aws-cdk/core';
import { Construct } from 'constructs';

/**
 * Represents an MSK cluster
 */
export interface ICluster extends IResource {
  /**
   * the ARN of the MSK cluster
   */
  readonly clusterArn: string;
}

/**
 * An MSK cluster
 */
export class Cluster {
  /**
   * Creates a Cluster construct that represents an existing MSK cluster.
   * @param scope
   * @param id
   * @param clusterArn
   */
  public static fromClusterArn(scope: Construct, id: string, clusterArn: string): ICluster {
    class Imported extends Resource implements ICluster {
      public readonly clusterArn: string;
      constructor() {
        super(scope, id);
        this.clusterArn = clusterArn;
      }
    }
    return new Imported();
  }
}