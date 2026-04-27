import type { Construct } from 'constructs';
import { CfnConsumableResource } from './batch.generated';
import type { IResource } from '../../core';
import { ArnFormat, Resource, Stack, ValidationError } from '../../core';
import { memoizedGetter } from '../../core/lib/helpers-internal';
import type { IConsumableResourceRef, ConsumableResourceReference } from '../../interfaces/generated/aws-batch-interfaces.generated';

/**
 * Represents a Batch Consumable Resource
 */
export interface IConsumableResource extends IResource, IConsumableResourceRef {
  /**
   * The ARN of this consumable resource
   *
   * @attribute
   */
  readonly consumableResourceArn: string;

  /**
   * The name of this consumable resource
   *
   * @attribute
   */
  readonly consumableResourceName: string;
}

/**
 * The type of consumable resource
 */
export enum ConsumableResourceType {
  /**
   * Resource can be re-used after a job completes
   */
  REPLENISHABLE = 'REPLENISHABLE',

  /**
   * Resource cannot be re-used after a job completes
   */
  NON_REPLENISHABLE = 'NON_REPLENISHABLE',
}

/**
 * Properties for defining a Batch Consumable Resource
 */
export interface ConsumableResourceProps {
  /**
   * The name of the consumable resource
   *
   * @default - CloudFormation-generated name
   */
  readonly consumableResourceName?: string;

  /**
   * The type of consumable resource
   */
  readonly resourceType: ConsumableResourceType;

  /**
   * The total quantity of the consumable resource
   */
  readonly totalQuantity: number;
}

/**
 * A Batch Consumable Resource
 *
 * Consumable resources are finite resources that are consumed by jobs,
 * such as third-party software licenses or API rate limits.
 */
export class ConsumableResource extends Resource implements IConsumableResource {
  /**
   * Import an existing consumable resource from its ARN
   */
  public static fromConsumableResourceArn(scope: Construct, id: string, consumableResourceArn: string): IConsumableResource {
    const stack = Stack.of(scope);
    class Import extends Resource implements IConsumableResource {
      public readonly consumableResourceArn = consumableResourceArn;
      public readonly consumableResourceName = stack.splitArn(consumableResourceArn, ArnFormat.SLASH_RESOURCE_NAME).resourceName!;
      public get consumableResourceRef(): ConsumableResourceReference {
        return {
          consumableResourceArn: this.consumableResourceArn,
        };
      }
    }
    return new Import(scope, id);
  }

  private readonly resource: CfnConsumableResource;

  @memoizedGetter
  public get consumableResourceArn(): string {
    return this.getResourceArnAttribute(this.resource.ref, {
      service: 'batch',
      resource: 'consumable-resource',
      resourceName: this.physicalName,
    });
  }

  @memoizedGetter
  public get consumableResourceName(): string {
    return this.getResourceNameAttribute(this.resource.ref);
  }

  public get consumableResourceRef(): ConsumableResourceReference {
    return {
      consumableResourceArn: this.consumableResourceArn,
    };
  }

  constructor(scope: Construct, id: string, props: ConsumableResourceProps) {
    super(scope, id, {
      physicalName: props.consumableResourceName,
    });

    if (props.totalQuantity < 1) {
      throw new ValidationError(`totalQuantity must be at least 1, got ${props.totalQuantity}`, this);
    }

    this.resource = new CfnConsumableResource(this, 'Resource', {
      consumableResourceName: this.physicalName,
      resourceType: props.resourceType,
      totalQuantity: props.totalQuantity,
    });
  }
}
