import { IResource } from '@aws-cdk/core';
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
   */
  readonly strategy?: PlacementGroupStrategy;
}

export enum PlacementGroupSpreadLevel {
  HOST = 'Host',
  RACK = 'Rack',
}

export enum PlacementGroupStrategy {
  CLUSTER = 'cluster',
  PARTITION = 'partition',
  SPREAD = 'spread',
}

export class PlacementGroup extends Construct {
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

  constructor(scope: Construct, id: string, props?: PlacementGroupProps) {
    super(scope, id);

    this.partitions = props?.partitions;
    this.spreadLevel = props?.spreadLevel;
    this.strategy = props?.strategy;

    new CfnPlacementGroup(this, 'Resource', {

    });
  }
}
