"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.StateGraph = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
/**
 * A collection of connected states
 *
 * A StateGraph is used to keep track of all states that are connected (have
 * transitions between them). It does not include the substatemachines in
 * a Parallel's branches: those are their own StateGraphs, but the graphs
 * themselves have a hierarchical relationship as well.
 *
 * By assigning states to a definitive StateGraph, we verify that no state
 * machines are constructed. In particular:
 *
 * - Every state object can only ever be in 1 StateGraph, and not inadvertently
 *   be used in two graphs.
 * - Every stateId must be unique across all states in the entire state
 *   machine.
 *
 * All policy statements in all states in all substatemachines are bubbled so
 * that the top-level StateMachine instantiation can read them all and add
 * them to the IAM Role.
 *
 * You do not need to instantiate this class; it is used internally.
 */
class StateGraph {
    /**
     * @param startState state that gets executed when the state machine is launched
     * @param graphDescription description of the state machine
     */
    constructor(startState, graphDescription) {
        this.startState = startState;
        this.graphDescription = graphDescription;
        /**
         * The accumulated policy statements
         */
        this.policyStatements = new Array();
        /**
         * All states in this graph
         */
        this.allStates = new Set();
        /**
         * A mapping of stateId -> Graph for all states in this graph and subgraphs
         */
        this.allContainedStates = new Map();
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_stepfunctions_State(startState);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, StateGraph);
            }
            throw error;
        }
        this.allStates.add(startState);
        startState.bindToGraph(this);
    }
    /**
     * Register a state as part of this graph
     *
     * Called by State.bindToGraph().
     */
    registerState(state) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_stepfunctions_State(state);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.registerState);
            }
            throw error;
        }
        this.registerContainedState(state.stateId, this);
        this.allStates.add(state);
    }
    /**
     * Register a Policy Statement used by states in this graph
     */
    registerPolicyStatement(statement) {
        if (this.superGraph) {
            this.superGraph.registerPolicyStatement(statement);
        }
        else {
            this.policyStatements.push(statement);
        }
    }
    /**
     * Register this graph as a child of the given graph
     *
     * Resource changes will be bubbled up to the given graph.
     */
    registerSuperGraph(graph) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_stepfunctions_StateGraph(graph);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.registerSuperGraph);
            }
            throw error;
        }
        if (this.superGraph === graph) {
            return;
        }
        if (this.superGraph) {
            throw new Error('Every StateGraph can only be registered into one other StateGraph');
        }
        this.superGraph = graph;
        this.pushContainedStatesUp(graph);
        this.pushPolicyStatementsUp(graph);
    }
    /**
     * Return the Amazon States Language JSON for this graph
     */
    toGraphJson() {
        const states = {};
        for (const state of this.allStates) {
            states[state.stateId] = state.toStateJson();
        }
        return {
            StartAt: this.startState.stateId,
            States: states,
            TimeoutSeconds: this.timeout && this.timeout.toSeconds(),
        };
    }
    /**
     * Return a string description of this graph
     */
    toString() {
        const someNodes = Array.from(this.allStates).slice(0, 3).map(x => x.stateId);
        if (this.allStates.size > 3) {
            someNodes.push('...');
        }
        return `${this.graphDescription} (${someNodes.join(', ')})`;
    }
    /**
     * Register a stateId and graph where it was registered
     */
    registerContainedState(stateId, graph) {
        if (this.superGraph) {
            this.superGraph.registerContainedState(stateId, graph);
        }
        else {
            const existingGraph = this.allContainedStates.get(stateId);
            if (existingGraph) {
                throw new Error(`State with name '${stateId}' occurs in both ${graph} and ${existingGraph}. All states must have unique names.`);
            }
            this.allContainedStates.set(stateId, graph);
        }
    }
    /**
     * Push all contained state info up to the given super graph
     */
    pushContainedStatesUp(superGraph) {
        for (const [stateId, graph] of this.allContainedStates) {
            superGraph.registerContainedState(stateId, graph);
        }
    }
    /**
     * Push all policy statements to into the given super graph
     */
    pushPolicyStatementsUp(superGraph) {
        for (const policyStatement of this.policyStatements) {
            superGraph.registerPolicyStatement(policyStatement);
        }
    }
}
exports.StateGraph = StateGraph;
_a = JSII_RTTI_SYMBOL_1;
StateGraph[_a] = { fqn: "@aws-cdk/aws-stepfunctions.StateGraph", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhdGUtZ3JhcGguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzdGF0ZS1ncmFwaC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFJQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBcUJHO0FBQ0gsTUFBYSxVQUFVO0lBK0JyQjs7O09BR0c7SUFDSCxZQUE0QixVQUFpQixFQUFtQixnQkFBd0I7UUFBNUQsZUFBVSxHQUFWLFVBQVUsQ0FBTztRQUFtQixxQkFBZ0IsR0FBaEIsZ0JBQWdCLENBQVE7UUF4QnhGOztXQUVHO1FBQ2EscUJBQWdCLEdBQUcsSUFBSSxLQUFLLEVBQXVCLENBQUM7UUFFcEU7O1dBRUc7UUFDYyxjQUFTLEdBQUcsSUFBSSxHQUFHLEVBQVMsQ0FBQztRQUU5Qzs7V0FFRztRQUNjLHVCQUFrQixHQUFHLElBQUksR0FBRyxFQUFzQixDQUFDOzs7Ozs7K0NBeEJ6RCxVQUFVOzs7O1FBb0NuQixJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUMvQixVQUFVLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO0tBQzlCO0lBRUQ7Ozs7T0FJRztJQUNJLGFBQWEsQ0FBQyxLQUFZOzs7Ozs7Ozs7O1FBQy9CLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ2pELElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO0tBQzNCO0lBRUQ7O09BRUc7SUFDSSx1QkFBdUIsQ0FBQyxTQUE4QjtRQUMzRCxJQUFJLElBQUksQ0FBQyxVQUFVLEVBQUU7WUFDbkIsSUFBSSxDQUFDLFVBQVUsQ0FBQyx1QkFBdUIsQ0FBQyxTQUFTLENBQUMsQ0FBQztTQUNwRDthQUFNO1lBQ0wsSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztTQUN2QztLQUNGO0lBRUQ7Ozs7T0FJRztJQUNJLGtCQUFrQixDQUFDLEtBQWlCOzs7Ozs7Ozs7O1FBQ3pDLElBQUksSUFBSSxDQUFDLFVBQVUsS0FBSyxLQUFLLEVBQUU7WUFBRSxPQUFPO1NBQUU7UUFDMUMsSUFBSSxJQUFJLENBQUMsVUFBVSxFQUFFO1lBQ25CLE1BQU0sSUFBSSxLQUFLLENBQUMsbUVBQW1FLENBQUMsQ0FBQztTQUN0RjtRQUNELElBQUksQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDO1FBQ3hCLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNsQyxJQUFJLENBQUMsc0JBQXNCLENBQUMsS0FBSyxDQUFDLENBQUM7S0FDcEM7SUFFRDs7T0FFRztJQUNJLFdBQVc7UUFDaEIsTUFBTSxNQUFNLEdBQVEsRUFBRSxDQUFDO1FBQ3ZCLEtBQUssTUFBTSxLQUFLLElBQUksSUFBSSxDQUFDLFNBQVMsRUFBRTtZQUNsQyxNQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLEtBQUssQ0FBQyxXQUFXLEVBQUUsQ0FBQztTQUM3QztRQUVELE9BQU87WUFDTCxPQUFPLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPO1lBQ2hDLE1BQU0sRUFBRSxNQUFNO1lBQ2QsY0FBYyxFQUFFLElBQUksQ0FBQyxPQUFPLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUU7U0FDekQsQ0FBQztLQUNIO0lBRUQ7O09BRUc7SUFDSSxRQUFRO1FBQ2IsTUFBTSxTQUFTLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDN0UsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksR0FBRyxDQUFDLEVBQUU7WUFBRSxTQUFTLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQUU7UUFDdkQsT0FBTyxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsS0FBSyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUM7S0FDN0Q7SUFFRDs7T0FFRztJQUNLLHNCQUFzQixDQUFDLE9BQWUsRUFBRSxLQUFpQjtRQUMvRCxJQUFJLElBQUksQ0FBQyxVQUFVLEVBQUU7WUFDbkIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxzQkFBc0IsQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUM7U0FDeEQ7YUFBTTtZQUNMLE1BQU0sYUFBYSxHQUFHLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDM0QsSUFBSSxhQUFhLEVBQUU7Z0JBQ2pCLE1BQU0sSUFBSSxLQUFLLENBQUMsb0JBQW9CLE9BQU8sb0JBQW9CLEtBQUssUUFBUSxhQUFhLHNDQUFzQyxDQUFDLENBQUM7YUFDbEk7WUFFRCxJQUFJLENBQUMsa0JBQWtCLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQztTQUM3QztLQUNGO0lBRUQ7O09BRUc7SUFDSyxxQkFBcUIsQ0FBQyxVQUFzQjtRQUNsRCxLQUFLLE1BQU0sQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLElBQUksSUFBSSxDQUFDLGtCQUFrQixFQUFFO1lBQ3RELFVBQVUsQ0FBQyxzQkFBc0IsQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUM7U0FDbkQ7S0FDRjtJQUVEOztPQUVHO0lBQ0ssc0JBQXNCLENBQUMsVUFBc0I7UUFDbkQsS0FBSyxNQUFNLGVBQWUsSUFBSSxJQUFJLENBQUMsZ0JBQWdCLEVBQUU7WUFDbkQsVUFBVSxDQUFDLHVCQUF1QixDQUFDLGVBQWUsQ0FBQyxDQUFDO1NBQ3JEO0tBQ0Y7O0FBcklILGdDQXVJQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGlhbSBmcm9tICdAYXdzLWNkay9hd3MtaWFtJztcbmltcG9ydCB7IER1cmF0aW9uIH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBTdGF0ZSB9IGZyb20gJy4vc3RhdGVzL3N0YXRlJztcblxuLyoqXG4gKiBBIGNvbGxlY3Rpb24gb2YgY29ubmVjdGVkIHN0YXRlc1xuICpcbiAqIEEgU3RhdGVHcmFwaCBpcyB1c2VkIHRvIGtlZXAgdHJhY2sgb2YgYWxsIHN0YXRlcyB0aGF0IGFyZSBjb25uZWN0ZWQgKGhhdmVcbiAqIHRyYW5zaXRpb25zIGJldHdlZW4gdGhlbSkuIEl0IGRvZXMgbm90IGluY2x1ZGUgdGhlIHN1YnN0YXRlbWFjaGluZXMgaW5cbiAqIGEgUGFyYWxsZWwncyBicmFuY2hlczogdGhvc2UgYXJlIHRoZWlyIG93biBTdGF0ZUdyYXBocywgYnV0IHRoZSBncmFwaHNcbiAqIHRoZW1zZWx2ZXMgaGF2ZSBhIGhpZXJhcmNoaWNhbCByZWxhdGlvbnNoaXAgYXMgd2VsbC5cbiAqXG4gKiBCeSBhc3NpZ25pbmcgc3RhdGVzIHRvIGEgZGVmaW5pdGl2ZSBTdGF0ZUdyYXBoLCB3ZSB2ZXJpZnkgdGhhdCBubyBzdGF0ZVxuICogbWFjaGluZXMgYXJlIGNvbnN0cnVjdGVkLiBJbiBwYXJ0aWN1bGFyOlxuICpcbiAqIC0gRXZlcnkgc3RhdGUgb2JqZWN0IGNhbiBvbmx5IGV2ZXIgYmUgaW4gMSBTdGF0ZUdyYXBoLCBhbmQgbm90IGluYWR2ZXJ0ZW50bHlcbiAqICAgYmUgdXNlZCBpbiB0d28gZ3JhcGhzLlxuICogLSBFdmVyeSBzdGF0ZUlkIG11c3QgYmUgdW5pcXVlIGFjcm9zcyBhbGwgc3RhdGVzIGluIHRoZSBlbnRpcmUgc3RhdGVcbiAqICAgbWFjaGluZS5cbiAqXG4gKiBBbGwgcG9saWN5IHN0YXRlbWVudHMgaW4gYWxsIHN0YXRlcyBpbiBhbGwgc3Vic3RhdGVtYWNoaW5lcyBhcmUgYnViYmxlZCBzb1xuICogdGhhdCB0aGUgdG9wLWxldmVsIFN0YXRlTWFjaGluZSBpbnN0YW50aWF0aW9uIGNhbiByZWFkIHRoZW0gYWxsIGFuZCBhZGRcbiAqIHRoZW0gdG8gdGhlIElBTSBSb2xlLlxuICpcbiAqIFlvdSBkbyBub3QgbmVlZCB0byBpbnN0YW50aWF0ZSB0aGlzIGNsYXNzOyBpdCBpcyB1c2VkIGludGVybmFsbHkuXG4gKi9cbmV4cG9ydCBjbGFzcyBTdGF0ZUdyYXBoIHtcbiAgLyoqXG4gICAqIFNldCBhIHRpbWVvdXQgdG8gcmVuZGVyIGludG8gdGhlIGdyYXBoIEpTT04uXG4gICAqXG4gICAqIFJlYWQvd3JpdGUuIE9ubHkgbWFrZXMgc2Vuc2Ugb24gdGhlIHRvcC1sZXZlbCBncmFwaCwgc3ViZ3JhcGhzXG4gICAqIGRvIG5vdCBzdXBwb3J0IHRoaXMgZmVhdHVyZS5cbiAgICpcbiAgICogQGRlZmF1bHQgTm8gdGltZW91dFxuICAgKi9cbiAgcHVibGljIHRpbWVvdXQ/OiBEdXJhdGlvbjtcblxuICAvKipcbiAgICogVGhlIGFjY3VtdWxhdGVkIHBvbGljeSBzdGF0ZW1lbnRzXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgcG9saWN5U3RhdGVtZW50cyA9IG5ldyBBcnJheTxpYW0uUG9saWN5U3RhdGVtZW50PigpO1xuXG4gIC8qKlxuICAgKiBBbGwgc3RhdGVzIGluIHRoaXMgZ3JhcGhcbiAgICovXG4gIHByaXZhdGUgcmVhZG9ubHkgYWxsU3RhdGVzID0gbmV3IFNldDxTdGF0ZT4oKTtcblxuICAvKipcbiAgICogQSBtYXBwaW5nIG9mIHN0YXRlSWQgLT4gR3JhcGggZm9yIGFsbCBzdGF0ZXMgaW4gdGhpcyBncmFwaCBhbmQgc3ViZ3JhcGhzXG4gICAqL1xuICBwcml2YXRlIHJlYWRvbmx5IGFsbENvbnRhaW5lZFN0YXRlcyA9IG5ldyBNYXA8c3RyaW5nLCBTdGF0ZUdyYXBoPigpO1xuXG4gIC8qKlxuICAgKiBDb250YWluaW5nIGdyYXBoIG9mIHRoaXMgZ3JhcGhcbiAgICovXG4gIHByaXZhdGUgc3VwZXJHcmFwaD86IFN0YXRlR3JhcGg7XG5cbiAgLyoqXG4gICAqIEBwYXJhbSBzdGFydFN0YXRlIHN0YXRlIHRoYXQgZ2V0cyBleGVjdXRlZCB3aGVuIHRoZSBzdGF0ZSBtYWNoaW5lIGlzIGxhdW5jaGVkXG4gICAqIEBwYXJhbSBncmFwaERlc2NyaXB0aW9uIGRlc2NyaXB0aW9uIG9mIHRoZSBzdGF0ZSBtYWNoaW5lXG4gICAqL1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgcmVhZG9ubHkgc3RhcnRTdGF0ZTogU3RhdGUsIHByaXZhdGUgcmVhZG9ubHkgZ3JhcGhEZXNjcmlwdGlvbjogc3RyaW5nKSB7XG4gICAgdGhpcy5hbGxTdGF0ZXMuYWRkKHN0YXJ0U3RhdGUpO1xuICAgIHN0YXJ0U3RhdGUuYmluZFRvR3JhcGgodGhpcyk7XG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXIgYSBzdGF0ZSBhcyBwYXJ0IG9mIHRoaXMgZ3JhcGhcbiAgICpcbiAgICogQ2FsbGVkIGJ5IFN0YXRlLmJpbmRUb0dyYXBoKCkuXG4gICAqL1xuICBwdWJsaWMgcmVnaXN0ZXJTdGF0ZShzdGF0ZTogU3RhdGUpIHtcbiAgICB0aGlzLnJlZ2lzdGVyQ29udGFpbmVkU3RhdGUoc3RhdGUuc3RhdGVJZCwgdGhpcyk7XG4gICAgdGhpcy5hbGxTdGF0ZXMuYWRkKHN0YXRlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlciBhIFBvbGljeSBTdGF0ZW1lbnQgdXNlZCBieSBzdGF0ZXMgaW4gdGhpcyBncmFwaFxuICAgKi9cbiAgcHVibGljIHJlZ2lzdGVyUG9saWN5U3RhdGVtZW50KHN0YXRlbWVudDogaWFtLlBvbGljeVN0YXRlbWVudCkge1xuICAgIGlmICh0aGlzLnN1cGVyR3JhcGgpIHtcbiAgICAgIHRoaXMuc3VwZXJHcmFwaC5yZWdpc3RlclBvbGljeVN0YXRlbWVudChzdGF0ZW1lbnQpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnBvbGljeVN0YXRlbWVudHMucHVzaChzdGF0ZW1lbnQpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlciB0aGlzIGdyYXBoIGFzIGEgY2hpbGQgb2YgdGhlIGdpdmVuIGdyYXBoXG4gICAqXG4gICAqIFJlc291cmNlIGNoYW5nZXMgd2lsbCBiZSBidWJibGVkIHVwIHRvIHRoZSBnaXZlbiBncmFwaC5cbiAgICovXG4gIHB1YmxpYyByZWdpc3RlclN1cGVyR3JhcGgoZ3JhcGg6IFN0YXRlR3JhcGgpIHtcbiAgICBpZiAodGhpcy5zdXBlckdyYXBoID09PSBncmFwaCkgeyByZXR1cm47IH1cbiAgICBpZiAodGhpcy5zdXBlckdyYXBoKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0V2ZXJ5IFN0YXRlR3JhcGggY2FuIG9ubHkgYmUgcmVnaXN0ZXJlZCBpbnRvIG9uZSBvdGhlciBTdGF0ZUdyYXBoJyk7XG4gICAgfVxuICAgIHRoaXMuc3VwZXJHcmFwaCA9IGdyYXBoO1xuICAgIHRoaXMucHVzaENvbnRhaW5lZFN0YXRlc1VwKGdyYXBoKTtcbiAgICB0aGlzLnB1c2hQb2xpY3lTdGF0ZW1lbnRzVXAoZ3JhcGgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybiB0aGUgQW1hem9uIFN0YXRlcyBMYW5ndWFnZSBKU09OIGZvciB0aGlzIGdyYXBoXG4gICAqL1xuICBwdWJsaWMgdG9HcmFwaEpzb24oKTogb2JqZWN0IHtcbiAgICBjb25zdCBzdGF0ZXM6IGFueSA9IHt9O1xuICAgIGZvciAoY29uc3Qgc3RhdGUgb2YgdGhpcy5hbGxTdGF0ZXMpIHtcbiAgICAgIHN0YXRlc1tzdGF0ZS5zdGF0ZUlkXSA9IHN0YXRlLnRvU3RhdGVKc29uKCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIFN0YXJ0QXQ6IHRoaXMuc3RhcnRTdGF0ZS5zdGF0ZUlkLFxuICAgICAgU3RhdGVzOiBzdGF0ZXMsXG4gICAgICBUaW1lb3V0U2Vjb25kczogdGhpcy50aW1lb3V0ICYmIHRoaXMudGltZW91dC50b1NlY29uZHMoKSxcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybiBhIHN0cmluZyBkZXNjcmlwdGlvbiBvZiB0aGlzIGdyYXBoXG4gICAqL1xuICBwdWJsaWMgdG9TdHJpbmcoKSB7XG4gICAgY29uc3Qgc29tZU5vZGVzID0gQXJyYXkuZnJvbSh0aGlzLmFsbFN0YXRlcykuc2xpY2UoMCwgMykubWFwKHggPT4geC5zdGF0ZUlkKTtcbiAgICBpZiAodGhpcy5hbGxTdGF0ZXMuc2l6ZSA+IDMpIHsgc29tZU5vZGVzLnB1c2goJy4uLicpOyB9XG4gICAgcmV0dXJuIGAke3RoaXMuZ3JhcGhEZXNjcmlwdGlvbn0gKCR7c29tZU5vZGVzLmpvaW4oJywgJyl9KWA7XG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXIgYSBzdGF0ZUlkIGFuZCBncmFwaCB3aGVyZSBpdCB3YXMgcmVnaXN0ZXJlZFxuICAgKi9cbiAgcHJpdmF0ZSByZWdpc3RlckNvbnRhaW5lZFN0YXRlKHN0YXRlSWQ6IHN0cmluZywgZ3JhcGg6IFN0YXRlR3JhcGgpIHtcbiAgICBpZiAodGhpcy5zdXBlckdyYXBoKSB7XG4gICAgICB0aGlzLnN1cGVyR3JhcGgucmVnaXN0ZXJDb250YWluZWRTdGF0ZShzdGF0ZUlkLCBncmFwaCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IGV4aXN0aW5nR3JhcGggPSB0aGlzLmFsbENvbnRhaW5lZFN0YXRlcy5nZXQoc3RhdGVJZCk7XG4gICAgICBpZiAoZXhpc3RpbmdHcmFwaCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFN0YXRlIHdpdGggbmFtZSAnJHtzdGF0ZUlkfScgb2NjdXJzIGluIGJvdGggJHtncmFwaH0gYW5kICR7ZXhpc3RpbmdHcmFwaH0uIEFsbCBzdGF0ZXMgbXVzdCBoYXZlIHVuaXF1ZSBuYW1lcy5gKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5hbGxDb250YWluZWRTdGF0ZXMuc2V0KHN0YXRlSWQsIGdyYXBoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUHVzaCBhbGwgY29udGFpbmVkIHN0YXRlIGluZm8gdXAgdG8gdGhlIGdpdmVuIHN1cGVyIGdyYXBoXG4gICAqL1xuICBwcml2YXRlIHB1c2hDb250YWluZWRTdGF0ZXNVcChzdXBlckdyYXBoOiBTdGF0ZUdyYXBoKSB7XG4gICAgZm9yIChjb25zdCBbc3RhdGVJZCwgZ3JhcGhdIG9mIHRoaXMuYWxsQ29udGFpbmVkU3RhdGVzKSB7XG4gICAgICBzdXBlckdyYXBoLnJlZ2lzdGVyQ29udGFpbmVkU3RhdGUoc3RhdGVJZCwgZ3JhcGgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBQdXNoIGFsbCBwb2xpY3kgc3RhdGVtZW50cyB0byBpbnRvIHRoZSBnaXZlbiBzdXBlciBncmFwaFxuICAgKi9cbiAgcHJpdmF0ZSBwdXNoUG9saWN5U3RhdGVtZW50c1VwKHN1cGVyR3JhcGg6IFN0YXRlR3JhcGgpIHtcbiAgICBmb3IgKGNvbnN0IHBvbGljeVN0YXRlbWVudCBvZiB0aGlzLnBvbGljeVN0YXRlbWVudHMpIHtcbiAgICAgIHN1cGVyR3JhcGgucmVnaXN0ZXJQb2xpY3lTdGF0ZW1lbnQocG9saWN5U3RhdGVtZW50KTtcbiAgICB9XG4gIH1cblxufVxuIl19