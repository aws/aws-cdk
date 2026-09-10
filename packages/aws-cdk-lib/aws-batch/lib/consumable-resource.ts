import type { Construct } from 'constructs';
import { CfnConsumableResource } from './batch.generated';
import type { IResource } from '../../core';
import { ArnFormat, Resource, Stack, Token, ValidationError } from '../../core';
import { memoizedGetter } from '../../core/lib/helpers-internal';
import { addConstructMetadata } from '../../core/lib/metadata-resource';
import { lit } from '../../core/lib/private/literal-string';
import { propertyInjectable } from '../../core/lib/prop-injectable';
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
 *
 * @resource AWS::Batch::ConsumableResource
 */
@propertyInjectable
export class ConsumableResource extends Resource implements IConsumableResource {
  /** Uniquely identifies this class. */
  public static readonly PROPERTY_INJECTION_ID: string = 'aws-cdk-lib.aws-batch.ConsumableResource';

  /**
   * Import an existing consumable resource from its ARN
   */
  public static fromConsumableResourceArn(scope: Construct, id: string, consumableResourceArn: string): IConsumableResource {
    if (Token.isUnresolved(consumableResourceArn)) {
      throw new ValidationError(lit`ConsumableResourceArnCannotBeUnresolvedToken`, 'consumableResourceArn cannot be an unresolved token', scope);
    }

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
    // `Ref` of AWS::Batch::ConsumableResource is the ARN, so the name has to be split out of it,
    // the same way `fromConsumableResourceArn` does for imported resources.
    return this.getResourceNameAttribute(
      Stack.of(this).splitArn(this.resource.ref, ArnFormat.SLASH_RESOURCE_NAME).resourceName!,
    );
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
    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);

    if (!Token.isUnresolved(props.totalQuantity) && props.totalQuantity < 0) {
      throw new ValidationError(lit`TotalQuantityMustBeNonNegative`, `totalQuantity must be non-negative, got ${props.totalQuantity}`, this);
    }

    this.resource = new CfnConsumableResource(this, 'Resource', {
      consumableResourceName: this.physicalName,
      resourceType: props.resourceType,
      totalQuantity: props.totalQuantity,
    });
  }
}
