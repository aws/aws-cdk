import type { Construct } from 'constructs';
import { ConsumableResourceGrants } from './batch-grants.generated';
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
   * The name must be unique within the account and Region. Changing it replaces
   * the resource.
   *
   * @default - CloudFormation-generated name
   */
  readonly consumableResourceName?: string;

  /**
   * The type of consumable resource
   *
   * Changing this property replaces the resource. Because the name must be unique
   * within the account and Region, changing the type of a resource that has a
   * `consumableResourceName` fails the deployment unless the name is changed as well.
   *
   * @default ConsumableResourceType.REPLENISHABLE
   */
  readonly resourceType?: ConsumableResourceType;

  /**
   * The total quantity of the consumable resource
   *
   * Must be a non-negative integer.
   */
  readonly totalQuantity: number;

  /**
   * Tags to apply to the consumable resource
   *
   * @default - no tags
   */
  readonly tags?: { [key: string]: string };
}

abstract class ConsumableResourceBase extends Resource implements IConsumableResource {
  public abstract readonly consumableResourceArn: string;
  public abstract readonly consumableResourceName: string;

  /**
   * Collection of grant methods for a ConsumableResource
   */
  public readonly grants = ConsumableResourceGrants.fromConsumableResource(this);

  public get consumableResourceRef(): ConsumableResourceReference {
    return {
      consumableResourceArn: this.consumableResourceArn,
    };
  }
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
export class ConsumableResource extends ConsumableResourceBase {
  /** Uniquely identifies this class. */
  public static readonly PROPERTY_INJECTION_ID: string = 'aws-cdk-lib.aws-batch.ConsumableResource';

  /**
   * Import an existing consumable resource from its ARN
   */
  public static fromConsumableResourceArn(scope: Construct, id: string, consumableResourceArn: string): IConsumableResource {
    const stack = Stack.of(scope);
    class Import extends ConsumableResourceBase {
      public readonly consumableResourceArn = consumableResourceArn;
      public readonly consumableResourceName = stack.splitArn(consumableResourceArn, ArnFormat.SLASH_RESOURCE_NAME).resourceName!;
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

  constructor(scope: Construct, id: string, props: ConsumableResourceProps) {
    super(scope, id, {
      physicalName: props.consumableResourceName,
    });
    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);

    if (!Token.isUnresolved(props.totalQuantity) && (!Number.isInteger(props.totalQuantity) || props.totalQuantity < 0)) {
      throw new ValidationError(lit`TotalQuantityMustBeNonNegativeInteger`, `totalQuantity must be a non-negative integer, got ${props.totalQuantity}`, this);
    }

    this.resource = new CfnConsumableResource(this, 'Resource', {
      consumableResourceName: this.physicalName,
      resourceType: props.resourceType ?? ConsumableResourceType.REPLENISHABLE,
      totalQuantity: props.totalQuantity,
      tags: props.tags,
    });
  }
}
