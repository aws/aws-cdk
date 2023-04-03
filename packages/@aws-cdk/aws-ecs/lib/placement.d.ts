import { CfnService } from './ecs.generated';
/**
 * Instance resource used for bin packing
 */
export declare enum BinPackResource {
    /**
     * Fill up hosts' CPU allocations first
     */
    CPU = "CPU",
    /**
     * Fill up hosts' memory allocations first
     */
    MEMORY = "MEMORY"
}
/**
 * The placement strategies to use for tasks in the service. For more information, see
 * [Amazon ECS Task Placement Strategies](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task-placement-strategies.html).
 *
 * Tasks will preferentially be placed on instances that match these rules.
 */
export declare class PlacementStrategy {
    private readonly json;
    /**
     * Places tasks evenly across all container instances in the cluster.
     */
    static spreadAcrossInstances(): PlacementStrategy;
    /**
     * Places tasks evenly based on the specified value.
     *
     * You can use one of the built-in attributes found on `BuiltInAttributes`
     * or supply your own custom instance attributes. If more than one attribute
     * is supplied, spreading is done in order.
     *
     * @default attributes instanceId
     */
    static spreadAcross(...fields: string[]): PlacementStrategy;
    /**
     * Places tasks on container instances with the least available amount of CPU capacity.
     *
     * This minimizes the number of instances in use.
     */
    static packedByCpu(): PlacementStrategy;
    /**
     * Places tasks on container instances with the least available amount of memory capacity.
     *
     * This minimizes the number of instances in use.
     */
    static packedByMemory(): PlacementStrategy;
    /**
     * Places tasks on the container instances with the least available capacity of the specified resource.
     */
    static packedBy(resource: BinPackResource): PlacementStrategy;
    /**
     * Places tasks randomly.
     */
    static randomly(): PlacementStrategy;
    /**
     * Constructs a new instance of the PlacementStrategy class.
     */
    private constructor();
    /**
     * Return the placement JSON
     */
    toJson(): CfnService.PlacementStrategyProperty[];
}
/**
 * The placement constraints to use for tasks in the service. For more information, see
 * [Amazon ECS Task Placement Constraints](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task-placement-constraints.html).
 *
 * Tasks will only be placed on instances that match these rules.
 */
export declare class PlacementConstraint {
    private readonly json;
    /**
     * Use distinctInstance to ensure that each task in a particular group is running on a different container instance.
     */
    static distinctInstances(): PlacementConstraint;
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
    static memberOf(...expressions: string[]): PlacementConstraint;
    /**
     * Constructs a new instance of the PlacementConstraint class.
     */
    private constructor();
    /**
     * Return the placement JSON
     */
    toJson(): CfnService.PlacementConstraintProperty[];
}
