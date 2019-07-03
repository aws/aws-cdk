import { BuiltInAttributes } from "./ec2/ec2-service";
import { CfnService } from "./ecs.generated";

/**
 * Instance resource used for bin packing
 */
export enum BinPackResource {
  /**
   * Fill up hosts' CPU allocations first
   */
  CPU = 'cpu',

  /**
   * Fill up hosts' memory allocations first
   */
  MEMORY = 'memory',
}

/**
 * An ECS placement strategy
 *
 * Tasks will preferentially be placed on instances that match these rules.
 */
export class PlacementStrategy {
  /**
   * Try to place tasks spread across instances
   */
  public static spreadAcrossInstances() {
    return new PlacementStrategy([{ type: 'spread', field: BuiltInAttributes.INSTANCE_ID }]);
  }

  /**
   * Try to place tasks spread across instances based on given attributes
   *
   * You can use one of the built-in attributes found on `BuiltInAttributes`
   * or supply your own custom instance attributes. If more than one attribute
   * is supplied, spreading is done in order.
   *
   * @default attributes instanceId
   */
  public static spreadAcross(...fields: string[]) {
    if (fields.length === 0) {
      throw new Error('spreadAcross: give at least one field to spread by');
    }
    return new PlacementStrategy(fields.map(field => ({ type: 'spread', field })));
  }

  /**
   * Try to place tasks on instances with the least amount of CPU
   *
   * This ensures the total consumption of CPU is lowest
   */
  public static packedByCpu() {
    return PlacementStrategy.packedBy(BinPackResource.CPU);
  }

  /**
   * Try to place tasks on instances with the least amount of memory
   *
   * This ensures the total consumption of memory is lowest
   */
  public static packedByMemory() {
    return PlacementStrategy.packedBy(BinPackResource.MEMORY);
  }

  /**
   * Try to place tasks on instances with the least amount of indicated resource available
   *
   * This ensures the total consumption of this resource is lowest.
   */
  public static packedBy(resource: BinPackResource) {
    return new PlacementStrategy([{ type: 'binpack', field: resource }]);
  }

  /**
   * Place tasks randomly across the available instances.
   */
  public static randomly() {
    return new PlacementStrategy([{ type: 'random' }]);
  }

  /**
   * Constructs a new instance of the PlacementStrategy class.
   */
  private constructor(private readonly json: CfnService.PlacementStrategyProperty[]) {
  }

  /**
   * Return the placement JSON
   */
  public toJson(): CfnService.PlacementStrategyProperty[] {
    return this.json;
  }
}

/**
 * An ECS placement constraint
 *
 * Tasks will only be placed on instances that match these rules.
 */
export class PlacementConstraint {
  /**
   * Place every task on a different instance
   */
  public static distinctInstances() {
    return new PlacementConstraint([{ type: 'distinctInstance' }]);
  }

  /**
   * Place tasks only on instances matching the given query expression
   *
   * You can specify multiple expressions in one call. The tasks will only
   * be placed on instances matching all expressions.
   *
   * @see https://docs.aws.amazon.com/AmazonECS/latest/developerguide/cluster-query-language.html
   */
  public static memberOf(...expressions: string[]) {
    return new PlacementConstraint(expressions.map(expression => ({ type: 'memberOf', expression })));
  }

  /**
   * Constructs a new instance of the PlacementConstraint class.
   */
  private constructor(private readonly json: CfnService.PlacementConstraintProperty[]) {
  }

  /**
   * Return the placement JSON
   */
  public toJson(): CfnService.PlacementConstraintProperty[] {
    return this.json;
  }
}