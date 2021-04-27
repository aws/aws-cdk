import * as ec2 from '@aws-cdk/aws-ec2';
import { IResource, RemovalPolicy, Resource } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { CfnSubnetGroup } from './elasticache.generated';

/**
 * Interface for a cache subnet group.
 */
export interface ICacheSubnetGroup extends IResource {
  /**
   * The name of the cluster subnet group.
   * @attribute
   */
  readonly cacheSubnetGroupName: string;
}

/**
 * Properties for creating a CacheSubnetGroup.
 */
export interface CacheSubnetGroupProps {
  /**
   * Name of the cache subnet group.
   *
   * @default undefined
   */
  readonly name?: string;

  /**
   * Description of the subnet group.
   */
  readonly description: string;

  /**
   * The VPC to place the subnet group in.
   */
  readonly vpc: ec2.IVpc;

  /**
   * Which subnets within the VPC to associate with this group.
   *
   * @default - private subnets
   */
  readonly vpcSubnets?: ec2.SubnetSelection;

  /**
   * The removal policy to apply when the subnet group are removed
   * from the stack or replaced during an update.
   *
   * @default RemovalPolicy.RETAIN
   */
  readonly removalPolicy?: RemovalPolicy;
}

/**
 * Class for creating a ElastiCache subnet group
 *
 * @resource AWS::ElastiCache::SubnetGroup
 */
export class SubnetGroup extends Resource implements ICacheSubnetGroup {
  /**
   * Imports an existing subnet group by name.
   */
  public static fromCacheSubnetGroupName(scope: Construct, id: string, cacheSubnetGroupName: string): ICacheSubnetGroup {
    return new (class extends Resource implements ICacheSubnetGroup {
      public readonly cacheSubnetGroupName = cacheSubnetGroupName;
    })(scope, id);
  }

  public readonly cacheSubnetGroupName: string;

  constructor(scope: Construct, id: string, props: CacheSubnetGroupProps) {
    super(scope, id);

    const { subnetIds } = props.vpc.selectSubnets(props.vpcSubnets ?? { subnetType: ec2.SubnetType.PRIVATE });

    const subnetGroup = new CfnSubnetGroup(this, 'Resource', {
      description: props.description,
      subnetIds,
      cacheSubnetGroupName: props.name,
    });
    subnetGroup.applyRemovalPolicy(props.removalPolicy ?? RemovalPolicy.RETAIN, {
      applyToUpdateReplacePolicy: true,
    });

    this.cacheSubnetGroupName = subnetGroup.ref;
  }
}
