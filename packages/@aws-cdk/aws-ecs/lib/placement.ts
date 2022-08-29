import { BuiltInAttributes } from './ec2/ec2-service';
import { CfnService } from './ecs.generated';

/**
 * Instance resource used for bin packing
 */
export enum BinPackResource {
  /**
   * Fill up hosts' CPU allocations first
   */
  CPU = 'CPU',

  /**
   * Fill up hosts' memory allocations first
   */
  MEMORY = 'MEMORY',
}

/**
 * The placement strategies to use for tasks in the service. For more information, see
 * [Amazon ECS Task Placement Strategies](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task-placement-strategies.html).
 *
 * Tasks will preferentially be placed on instances that match these rules.
 */
export class PlacementStrategy {
  /**
   * Places tasks evenly across all container instances in the cluster.
   */
  public static spreadAcrossInstances() {
    return new PlacementStrategy([{ type: 'spread', field: BuiltInAttributes.INSTANCE_ID }]);
  }

  /**
   * Places tasks evenly based on the specified value.
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
   * Places tasks on container instances with the least available amount of CPU capacity.
   *
   * This minimizes the number of instances in use.
   */
  public static packedByCpu() {
    return PlacementStrategy.packedBy(BinPackResource.CPU);
  }

  /**
   * Places tasks on container instances with the least available amount of memory capacity.
   *
   * This minimizes the number of instances in use.
   */
  public static packedByMemory() {
    return PlacementStrategy.packedBy(BinPackResource.MEMORY);
  }

  /**
   * Places tasks on the container instances with the least available capacity of the specified resource.
   */
  public static packedBy(resource: BinPackResource) {
    return new PlacementStrategy([{ type: 'binpack', field: resource }]);
  }

  /**
   * Places tasks randomly.
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
 * The placement constraints to use for tasks in the service. For more information, see
 * [Amazon ECS Task Placement Constraints](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task-placement-constraints.html).
 *
 * Tasks will only be placed on instances that match these rules.
 */
export class PlacementConstraint {
  /**
   * Use distinctInstance to ensure that each task in a particular group is running on a different container instance.
   */
  public static distinctInstances() {
    return new PlacementConstraint([{ type: 'distinctInstance' }]);
  }

  /**
   * Use memberOf to restrict the selection to a group of valid candidates specified by a query expression.
   *
   * Multiple expressions can be specified. For more information, see
   * [Cluster Query Language](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/cluster-query-language.html).
   *
   * You can specify multiple expressions in one call. The tasks will only be placed on instances matching all expressions.
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