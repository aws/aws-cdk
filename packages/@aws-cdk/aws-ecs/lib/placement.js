"use strict";
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlacementConstraint = exports.PlacementStrategy = exports.BinPackResource = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const ec2_service_1 = require("./ec2/ec2-service");
/**
 * Instance resource used for bin packing
 */
var BinPackResource;
(function (BinPackResource) {
    /**
     * Fill up hosts' CPU allocations first
     */
    BinPackResource["CPU"] = "CPU";
    /**
     * Fill up hosts' memory allocations first
     */
    BinPackResource["MEMORY"] = "MEMORY";
})(BinPackResource = exports.BinPackResource || (exports.BinPackResource = {}));
/**
 * The placement strategies to use for tasks in the service. For more information, see
 * [Amazon ECS Task Placement Strategies](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task-placement-strategies.html).
 *
 * Tasks will preferentially be placed on instances that match these rules.
 */
class PlacementStrategy {
    /**
     * Constructs a new instance of the PlacementStrategy class.
     */
    constructor(json) {
        this.json = json;
    }
    /**
     * Places tasks evenly across all container instances in the cluster.
     */
    static spreadAcrossInstances() {
        return new PlacementStrategy([{ type: 'spread', field: ec2_service_1.BuiltInAttributes.INSTANCE_ID }]);
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
    static spreadAcross(...fields) {
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
    static packedByCpu() {
        return PlacementStrategy.packedBy(BinPackResource.CPU);
    }
    /**
     * Places tasks on container instances with the least available amount of memory capacity.
     *
     * This minimizes the number of instances in use.
     */
    static packedByMemory() {
        return PlacementStrategy.packedBy(BinPackResource.MEMORY);
    }
    /**
     * Places tasks on the container instances with the least available capacity of the specified resource.
     */
    static packedBy(resource) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ecs_BinPackResource(resource);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.packedBy);
            }
            throw error;
        }
        return new PlacementStrategy([{ type: 'binpack', field: resource }]);
    }
    /**
     * Places tasks randomly.
     */
    static randomly() {
        return new PlacementStrategy([{ type: 'random' }]);
    }
    /**
     * Return the placement JSON
     */
    toJson() {
        return this.json;
    }
}
exports.PlacementStrategy = PlacementStrategy;
_a = JSII_RTTI_SYMBOL_1;
PlacementStrategy[_a] = { fqn: "@aws-cdk/aws-ecs.PlacementStrategy", version: "0.0.0" };
/**
 * The placement constraints to use for tasks in the service. For more information, see
 * [Amazon ECS Task Placement Constraints](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task-placement-constraints.html).
 *
 * Tasks will only be placed on instances that match these rules.
 */
class PlacementConstraint {
    /**
     * Constructs a new instance of the PlacementConstraint class.
     */
    constructor(json) {
        this.json = json;
    }
    /**
     * Use distinctInstance to ensure that each task in a particular group is running on a different container instance.
     */
    static distinctInstances() {
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
    static memberOf(...expressions) {
        return new PlacementConstraint(expressions.map(expression => ({ type: 'memberOf', expression })));
    }
    /**
     * Return the placement JSON
     */
    toJson() {
        return this.json;
    }
}
exports.PlacementConstraint = PlacementConstraint;
_b = JSII_RTTI_SYMBOL_1;
PlacementConstraint[_b] = { fqn: "@aws-cdk/aws-ecs.PlacementConstraint", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGxhY2VtZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicGxhY2VtZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLG1EQUFzRDtBQUd0RDs7R0FFRztBQUNILElBQVksZUFVWDtBQVZELFdBQVksZUFBZTtJQUN6Qjs7T0FFRztJQUNILDhCQUFXLENBQUE7SUFFWDs7T0FFRztJQUNILG9DQUFpQixDQUFBO0FBQ25CLENBQUMsRUFWVyxlQUFlLEdBQWYsdUJBQWUsS0FBZix1QkFBZSxRQVUxQjtBQUVEOzs7OztHQUtHO0FBQ0gsTUFBYSxpQkFBaUI7SUF3RDVCOztPQUVHO0lBQ0gsWUFBcUMsSUFBNEM7UUFBNUMsU0FBSSxHQUFKLElBQUksQ0FBd0M7S0FDaEY7SUEzREQ7O09BRUc7SUFDSSxNQUFNLENBQUMscUJBQXFCO1FBQ2pDLE9BQU8sSUFBSSxpQkFBaUIsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUUsK0JBQWlCLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQyxDQUFDO0tBQzFGO0lBRUQ7Ozs7Ozs7O09BUUc7SUFDSSxNQUFNLENBQUMsWUFBWSxDQUFDLEdBQUcsTUFBZ0I7UUFDNUMsSUFBSSxNQUFNLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtZQUN2QixNQUFNLElBQUksS0FBSyxDQUFDLG9EQUFvRCxDQUFDLENBQUM7U0FDdkU7UUFDRCxPQUFPLElBQUksaUJBQWlCLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQ2hGO0lBRUQ7Ozs7T0FJRztJQUNJLE1BQU0sQ0FBQyxXQUFXO1FBQ3ZCLE9BQU8saUJBQWlCLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsQ0FBQztLQUN4RDtJQUVEOzs7O09BSUc7SUFDSSxNQUFNLENBQUMsY0FBYztRQUMxQixPQUFPLGlCQUFpQixDQUFDLFFBQVEsQ0FBQyxlQUFlLENBQUMsTUFBTSxDQUFDLENBQUM7S0FDM0Q7SUFFRDs7T0FFRztJQUNJLE1BQU0sQ0FBQyxRQUFRLENBQUMsUUFBeUI7Ozs7Ozs7Ozs7UUFDOUMsT0FBTyxJQUFJLGlCQUFpQixDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUM7S0FDdEU7SUFFRDs7T0FFRztJQUNJLE1BQU0sQ0FBQyxRQUFRO1FBQ3BCLE9BQU8sSUFBSSxpQkFBaUIsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQztLQUNwRDtJQVFEOztPQUVHO0lBQ0ksTUFBTTtRQUNYLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQztLQUNsQjs7QUFuRUgsOENBb0VDOzs7QUFFRDs7Ozs7R0FLRztBQUNILE1BQWEsbUJBQW1CO0lBc0I5Qjs7T0FFRztJQUNILFlBQXFDLElBQThDO1FBQTlDLFNBQUksR0FBSixJQUFJLENBQTBDO0tBQ2xGO0lBekJEOztPQUVHO0lBQ0ksTUFBTSxDQUFDLGlCQUFpQjtRQUM3QixPQUFPLElBQUksbUJBQW1CLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxrQkFBa0IsRUFBRSxDQUFDLENBQUMsQ0FBQztLQUNoRTtJQUVEOzs7Ozs7Ozs7T0FTRztJQUNJLE1BQU0sQ0FBQyxRQUFRLENBQUMsR0FBRyxXQUFxQjtRQUM3QyxPQUFPLElBQUksbUJBQW1CLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQ25HO0lBUUQ7O09BRUc7SUFDSSxNQUFNO1FBQ1gsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDO0tBQ2xCOztBQWpDSCxrREFrQ0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBCdWlsdEluQXR0cmlidXRlcyB9IGZyb20gJy4vZWMyL2VjMi1zZXJ2aWNlJztcbmltcG9ydCB7IENmblNlcnZpY2UgfSBmcm9tICcuL2Vjcy5nZW5lcmF0ZWQnO1xuXG4vKipcbiAqIEluc3RhbmNlIHJlc291cmNlIHVzZWQgZm9yIGJpbiBwYWNraW5nXG4gKi9cbmV4cG9ydCBlbnVtIEJpblBhY2tSZXNvdXJjZSB7XG4gIC8qKlxuICAgKiBGaWxsIHVwIGhvc3RzJyBDUFUgYWxsb2NhdGlvbnMgZmlyc3RcbiAgICovXG4gIENQVSA9ICdDUFUnLFxuXG4gIC8qKlxuICAgKiBGaWxsIHVwIGhvc3RzJyBtZW1vcnkgYWxsb2NhdGlvbnMgZmlyc3RcbiAgICovXG4gIE1FTU9SWSA9ICdNRU1PUlknLFxufVxuXG4vKipcbiAqIFRoZSBwbGFjZW1lbnQgc3RyYXRlZ2llcyB0byB1c2UgZm9yIHRhc2tzIGluIHRoZSBzZXJ2aWNlLiBGb3IgbW9yZSBpbmZvcm1hdGlvbiwgc2VlXG4gKiBbQW1hem9uIEVDUyBUYXNrIFBsYWNlbWVudCBTdHJhdGVnaWVzXShodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQW1hem9uRUNTL2xhdGVzdC9kZXZlbG9wZXJndWlkZS90YXNrLXBsYWNlbWVudC1zdHJhdGVnaWVzLmh0bWwpLlxuICpcbiAqIFRhc2tzIHdpbGwgcHJlZmVyZW50aWFsbHkgYmUgcGxhY2VkIG9uIGluc3RhbmNlcyB0aGF0IG1hdGNoIHRoZXNlIHJ1bGVzLlxuICovXG5leHBvcnQgY2xhc3MgUGxhY2VtZW50U3RyYXRlZ3kge1xuICAvKipcbiAgICogUGxhY2VzIHRhc2tzIGV2ZW5seSBhY3Jvc3MgYWxsIGNvbnRhaW5lciBpbnN0YW5jZXMgaW4gdGhlIGNsdXN0ZXIuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHNwcmVhZEFjcm9zc0luc3RhbmNlcygpIHtcbiAgICByZXR1cm4gbmV3IFBsYWNlbWVudFN0cmF0ZWd5KFt7IHR5cGU6ICdzcHJlYWQnLCBmaWVsZDogQnVpbHRJbkF0dHJpYnV0ZXMuSU5TVEFOQ0VfSUQgfV0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFBsYWNlcyB0YXNrcyBldmVubHkgYmFzZWQgb24gdGhlIHNwZWNpZmllZCB2YWx1ZS5cbiAgICpcbiAgICogWW91IGNhbiB1c2Ugb25lIG9mIHRoZSBidWlsdC1pbiBhdHRyaWJ1dGVzIGZvdW5kIG9uIGBCdWlsdEluQXR0cmlidXRlc2BcbiAgICogb3Igc3VwcGx5IHlvdXIgb3duIGN1c3RvbSBpbnN0YW5jZSBhdHRyaWJ1dGVzLiBJZiBtb3JlIHRoYW4gb25lIGF0dHJpYnV0ZVxuICAgKiBpcyBzdXBwbGllZCwgc3ByZWFkaW5nIGlzIGRvbmUgaW4gb3JkZXIuXG4gICAqXG4gICAqIEBkZWZhdWx0IGF0dHJpYnV0ZXMgaW5zdGFuY2VJZFxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBzcHJlYWRBY3Jvc3MoLi4uZmllbGRzOiBzdHJpbmdbXSkge1xuICAgIGlmIChmaWVsZHMubGVuZ3RoID09PSAwKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ3NwcmVhZEFjcm9zczogZ2l2ZSBhdCBsZWFzdCBvbmUgZmllbGQgdG8gc3ByZWFkIGJ5Jyk7XG4gICAgfVxuICAgIHJldHVybiBuZXcgUGxhY2VtZW50U3RyYXRlZ3koZmllbGRzLm1hcChmaWVsZCA9PiAoeyB0eXBlOiAnc3ByZWFkJywgZmllbGQgfSkpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBQbGFjZXMgdGFza3Mgb24gY29udGFpbmVyIGluc3RhbmNlcyB3aXRoIHRoZSBsZWFzdCBhdmFpbGFibGUgYW1vdW50IG9mIENQVSBjYXBhY2l0eS5cbiAgICpcbiAgICogVGhpcyBtaW5pbWl6ZXMgdGhlIG51bWJlciBvZiBpbnN0YW5jZXMgaW4gdXNlLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBwYWNrZWRCeUNwdSgpIHtcbiAgICByZXR1cm4gUGxhY2VtZW50U3RyYXRlZ3kucGFja2VkQnkoQmluUGFja1Jlc291cmNlLkNQVSk7XG4gIH1cblxuICAvKipcbiAgICogUGxhY2VzIHRhc2tzIG9uIGNvbnRhaW5lciBpbnN0YW5jZXMgd2l0aCB0aGUgbGVhc3QgYXZhaWxhYmxlIGFtb3VudCBvZiBtZW1vcnkgY2FwYWNpdHkuXG4gICAqXG4gICAqIFRoaXMgbWluaW1pemVzIHRoZSBudW1iZXIgb2YgaW5zdGFuY2VzIGluIHVzZS5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgcGFja2VkQnlNZW1vcnkoKSB7XG4gICAgcmV0dXJuIFBsYWNlbWVudFN0cmF0ZWd5LnBhY2tlZEJ5KEJpblBhY2tSZXNvdXJjZS5NRU1PUlkpO1xuICB9XG5cbiAgLyoqXG4gICAqIFBsYWNlcyB0YXNrcyBvbiB0aGUgY29udGFpbmVyIGluc3RhbmNlcyB3aXRoIHRoZSBsZWFzdCBhdmFpbGFibGUgY2FwYWNpdHkgb2YgdGhlIHNwZWNpZmllZCByZXNvdXJjZS5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgcGFja2VkQnkocmVzb3VyY2U6IEJpblBhY2tSZXNvdXJjZSkge1xuICAgIHJldHVybiBuZXcgUGxhY2VtZW50U3RyYXRlZ3koW3sgdHlwZTogJ2JpbnBhY2snLCBmaWVsZDogcmVzb3VyY2UgfV0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFBsYWNlcyB0YXNrcyByYW5kb21seS5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgcmFuZG9tbHkoKSB7XG4gICAgcmV0dXJuIG5ldyBQbGFjZW1lbnRTdHJhdGVneShbeyB0eXBlOiAncmFuZG9tJyB9XSk7XG4gIH1cblxuICAvKipcbiAgICogQ29uc3RydWN0cyBhIG5ldyBpbnN0YW5jZSBvZiB0aGUgUGxhY2VtZW50U3RyYXRlZ3kgY2xhc3MuXG4gICAqL1xuICBwcml2YXRlIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkganNvbjogQ2ZuU2VydmljZS5QbGFjZW1lbnRTdHJhdGVneVByb3BlcnR5W10pIHtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm4gdGhlIHBsYWNlbWVudCBKU09OXG4gICAqL1xuICBwdWJsaWMgdG9Kc29uKCk6IENmblNlcnZpY2UuUGxhY2VtZW50U3RyYXRlZ3lQcm9wZXJ0eVtdIHtcbiAgICByZXR1cm4gdGhpcy5qc29uO1xuICB9XG59XG5cbi8qKlxuICogVGhlIHBsYWNlbWVudCBjb25zdHJhaW50cyB0byB1c2UgZm9yIHRhc2tzIGluIHRoZSBzZXJ2aWNlLiBGb3IgbW9yZSBpbmZvcm1hdGlvbiwgc2VlXG4gKiBbQW1hem9uIEVDUyBUYXNrIFBsYWNlbWVudCBDb25zdHJhaW50c10oaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FtYXpvbkVDUy9sYXRlc3QvZGV2ZWxvcGVyZ3VpZGUvdGFzay1wbGFjZW1lbnQtY29uc3RyYWludHMuaHRtbCkuXG4gKlxuICogVGFza3Mgd2lsbCBvbmx5IGJlIHBsYWNlZCBvbiBpbnN0YW5jZXMgdGhhdCBtYXRjaCB0aGVzZSBydWxlcy5cbiAqL1xuZXhwb3J0IGNsYXNzIFBsYWNlbWVudENvbnN0cmFpbnQge1xuICAvKipcbiAgICogVXNlIGRpc3RpbmN0SW5zdGFuY2UgdG8gZW5zdXJlIHRoYXQgZWFjaCB0YXNrIGluIGEgcGFydGljdWxhciBncm91cCBpcyBydW5uaW5nIG9uIGEgZGlmZmVyZW50IGNvbnRhaW5lciBpbnN0YW5jZS5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZGlzdGluY3RJbnN0YW5jZXMoKSB7XG4gICAgcmV0dXJuIG5ldyBQbGFjZW1lbnRDb25zdHJhaW50KFt7IHR5cGU6ICdkaXN0aW5jdEluc3RhbmNlJyB9XSk7XG4gIH1cblxuICAvKipcbiAgICogVXNlIG1lbWJlck9mIHRvIHJlc3RyaWN0IHRoZSBzZWxlY3Rpb24gdG8gYSBncm91cCBvZiB2YWxpZCBjYW5kaWRhdGVzIHNwZWNpZmllZCBieSBhIHF1ZXJ5IGV4cHJlc3Npb24uXG4gICAqXG4gICAqIE11bHRpcGxlIGV4cHJlc3Npb25zIGNhbiBiZSBzcGVjaWZpZWQuIEZvciBtb3JlIGluZm9ybWF0aW9uLCBzZWVcbiAgICogW0NsdXN0ZXIgUXVlcnkgTGFuZ3VhZ2VdKGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BbWF6b25FQ1MvbGF0ZXN0L2RldmVsb3Blcmd1aWRlL2NsdXN0ZXItcXVlcnktbGFuZ3VhZ2UuaHRtbCkuXG4gICAqXG4gICAqIFlvdSBjYW4gc3BlY2lmeSBtdWx0aXBsZSBleHByZXNzaW9ucyBpbiBvbmUgY2FsbC4gVGhlIHRhc2tzIHdpbGwgb25seSBiZSBwbGFjZWQgb24gaW5zdGFuY2VzIG1hdGNoaW5nIGFsbCBleHByZXNzaW9ucy5cbiAgICpcbiAgICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQW1hem9uRUNTL2xhdGVzdC9kZXZlbG9wZXJndWlkZS9jbHVzdGVyLXF1ZXJ5LWxhbmd1YWdlLmh0bWxcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgbWVtYmVyT2YoLi4uZXhwcmVzc2lvbnM6IHN0cmluZ1tdKSB7XG4gICAgcmV0dXJuIG5ldyBQbGFjZW1lbnRDb25zdHJhaW50KGV4cHJlc3Npb25zLm1hcChleHByZXNzaW9uID0+ICh7IHR5cGU6ICdtZW1iZXJPZicsIGV4cHJlc3Npb24gfSkpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RzIGEgbmV3IGluc3RhbmNlIG9mIHRoZSBQbGFjZW1lbnRDb25zdHJhaW50IGNsYXNzLlxuICAgKi9cbiAgcHJpdmF0ZSBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IGpzb246IENmblNlcnZpY2UuUGxhY2VtZW50Q29uc3RyYWludFByb3BlcnR5W10pIHtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm4gdGhlIHBsYWNlbWVudCBKU09OXG4gICAqL1xuICBwdWJsaWMgdG9Kc29uKCk6IENmblNlcnZpY2UuUGxhY2VtZW50Q29uc3RyYWludFByb3BlcnR5W10ge1xuICAgIHJldHVybiB0aGlzLmpzb247XG4gIH1cbn0iXX0=