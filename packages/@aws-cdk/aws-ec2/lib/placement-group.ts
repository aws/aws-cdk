import { IResource, Resource } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { CfnPlacementGroup } from './ec2.generated';

export interface IPlacementGroup extends IResource {
  /**
   * The number of partitions. Valid only when Strategy is set to partition.
   */
  partitions?: number;

  /**
   * Determines how this placement group spreads instances
   */
  spreadLevel?: PlacementGroupSpreadLevel;

  /**
   * Determines how this placement group launches instances
   */
  strategy?: PlacementGroupStrategy;

  /**
   * @attribute
   */
  readonly placementGroupName: string;
}

export interface PlacementGroupProps {
  /**
   * The number of partitions. Valid only when Strategy is set to partition.
   */
  readonly partitions?: number;

  /**
   * Determines how this placement group spreads instances
   */
  readonly spreadLevel?: PlacementGroupSpreadLevel;

  /**
   * Determines how this placement group launches instances
   *
   * @default PlacementGroupStrategy.CLUSTER
   */
  readonly strategy?: PlacementGroupStrategy;
}

export enum PlacementGroupSpreadLevel {
  HOST = 'host',
  RACK = 'rack',
}

export enum PlacementGroupStrategy {
  CLUSTER = 'cluster',
  PARTITION = 'partition',
  SPREAD = 'spread',
}

export class PlacementGroup extends Resource implements IPlacementGroup {
  /**
   * The number of partitions. Valid only when Strategy is set to partition.
   */
  partitions?: number;

  /**
   * Determines how this placement group spreads instances
   */
  spreadLevel?: PlacementGroupSpreadLevel;

  /**
   * Determines how this placement group launches instances
   */
  strategy?: PlacementGroupStrategy;

  public readonly placementGroupName: string;

  constructor(scope: Construct, id: string, props?: PlacementGroupProps) {
    super(scope, id);

    this.partitions = props?.partitions;
    this.spreadLevel = props?.spreadLevel;
    this.strategy = props?.strategy;

    if (this.partitions && this.strategy) {
      if (this.strategy !== PlacementGroupStrategy.PARTITION) {
        throw new Error(`PlacementGroup '${id}' can only specify 'partitions' with the 'PARTITION' strategy`);
      }
    } else if (this.partitions && !this.strategy) {
      this.strategy = PlacementGroupStrategy.PARTITION;
    }

    if (this.spreadLevel) {
      if (!this.strategy) {
        this.strategy = PlacementGroupStrategy.SPREAD;
      }
      if (this.strategy !== PlacementGroupStrategy.SPREAD) {
        throw new Error(`PlacementGroup '${id}' can only specify 'spreadLevel' with the 'SPREAD' strategy`);
      }
    }

    const resource = new CfnPlacementGroup(this, 'Resource', {
      partitionCount: this.partitions,
      spreadLevel: this.spreadLevel,
      strategy: this.strategy,
    });

    this.placementGroupName = this.getResourceArnAttribute(resource.attrGroupName, {
      service: 'batch',
      resource: 'compute-environment',
      resourceName: this.physicalName,
    });

  }
}
