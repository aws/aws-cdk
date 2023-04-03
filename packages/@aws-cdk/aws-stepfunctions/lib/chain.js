"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Chain = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const parallel_1 = require("./states/parallel");
/**
 * A collection of states to chain onto
 *
 * A Chain has a start and zero or more chainable ends. If there are
 * zero ends, calling next() on the Chain will fail.
 */
class Chain {
    constructor(startState, endStates, lastAdded) {
        this.lastAdded = lastAdded;
        this.id = lastAdded.id;
        this.startState = startState;
        this.endStates = endStates;
    }
    /**
     * Begin a new Chain from one chainable
     */
    static start(state) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_stepfunctions_IChainable(state);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.start);
            }
            throw error;
        }
        return new Chain(state.startState, state.endStates, state);
    }
    /**
     * Make a Chain with the start from one chain and the ends from another
     */
    static sequence(start, next) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_stepfunctions_IChainable(start);
            jsiiDeprecationWarnings._aws_cdk_aws_stepfunctions_IChainable(next);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.sequence);
            }
            throw error;
        }
        return new Chain(start.startState, next.endStates, next);
    }
    /**
     * Make a Chain with specific start and end states, and a last-added Chainable
     */
    static custom(startState, endStates, lastAdded) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_stepfunctions_State(startState);
            jsiiDeprecationWarnings._aws_cdk_aws_stepfunctions_IChainable(lastAdded);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.custom);
            }
            throw error;
        }
        return new Chain(startState, endStates, lastAdded);
    }
    /**
     * Continue normal execution with the given state
     */
    next(next) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_stepfunctions_IChainable(next);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.next);
            }
            throw error;
        }
        if (this.endStates.length === 0) {
            throw new Error(`Cannot add to chain: last state in chain (${this.lastAdded.id}) does not allow it`);
        }
        for (const endState of this.endStates) {
            endState.next(next);
        }
        return new Chain(this.startState, next.endStates, next);
    }
    /**
     * Return a single state that encompasses all states in the chain
     *
     * This can be used to add error handling to a sequence of states.
     *
     * Be aware that this changes the result of the inner state machine
     * to be an array with the result of the state machine in it. Adjust
     * your paths accordingly. For example, change 'outputPath' to
     * '$[0]'.
     */
    toSingleState(id, props = {}) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_stepfunctions_ParallelProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.toSingleState);
            }
            throw error;
        }
        return new parallel_1.Parallel(this.startState, id, props).branch(this);
    }
}
exports.Chain = Chain;
_a = JSII_RTTI_SYMBOL_1;
Chain[_a] = { fqn: "@aws-cdk/aws-stepfunctions.Chain", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hhaW4uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJjaGFpbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxnREFBNEQ7QUFJNUQ7Ozs7O0dBS0c7QUFDSCxNQUFhLEtBQUs7SUFxQ2hCLFlBQW9CLFVBQWlCLEVBQUUsU0FBc0IsRUFBbUIsU0FBcUI7UUFBckIsY0FBUyxHQUFULFNBQVMsQ0FBWTtRQUNuRyxJQUFJLENBQUMsRUFBRSxHQUFHLFNBQVMsQ0FBQyxFQUFFLENBQUM7UUFDdkIsSUFBSSxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUM7UUFDN0IsSUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7S0FDNUI7SUF4Q0Q7O09BRUc7SUFDSSxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQWlCOzs7Ozs7Ozs7O1FBQ25DLE9BQU8sSUFBSSxLQUFLLENBQUMsS0FBSyxDQUFDLFVBQVUsRUFBRSxLQUFLLENBQUMsU0FBUyxFQUFFLEtBQUssQ0FBQyxDQUFDO0tBQzVEO0lBRUQ7O09BRUc7SUFDSSxNQUFNLENBQUMsUUFBUSxDQUFDLEtBQWlCLEVBQUUsSUFBZ0I7Ozs7Ozs7Ozs7O1FBQ3hELE9BQU8sSUFBSSxLQUFLLENBQUMsS0FBSyxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxDQUFDO0tBQzFEO0lBRUQ7O09BRUc7SUFDSSxNQUFNLENBQUMsTUFBTSxDQUFDLFVBQWlCLEVBQUUsU0FBc0IsRUFBRSxTQUFxQjs7Ozs7Ozs7Ozs7UUFDbkYsT0FBTyxJQUFJLEtBQUssQ0FBQyxVQUFVLEVBQUUsU0FBUyxFQUFFLFNBQVMsQ0FBQyxDQUFDO0tBQ3BEO0lBdUJEOztPQUVHO0lBQ0ksSUFBSSxDQUFDLElBQWdCOzs7Ozs7Ozs7O1FBQzFCLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO1lBQy9CLE1BQU0sSUFBSSxLQUFLLENBQUMsNkNBQTZDLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRSxxQkFBcUIsQ0FBQyxDQUFDO1NBQ3RHO1FBRUQsS0FBSyxNQUFNLFFBQVEsSUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFO1lBQ3JDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDckI7UUFFRCxPQUFPLElBQUksS0FBSyxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsQ0FBQztLQUN6RDtJQUVEOzs7Ozs7Ozs7T0FTRztJQUNJLGFBQWEsQ0FBQyxFQUFVLEVBQUUsUUFBdUIsRUFBRTs7Ozs7Ozs7OztRQUN4RCxPQUFPLElBQUksbUJBQVEsQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7S0FDOUQ7O0FBdEVILHNCQXVFQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFBhcmFsbGVsLCBQYXJhbGxlbFByb3BzIH0gZnJvbSAnLi9zdGF0ZXMvcGFyYWxsZWwnO1xuaW1wb3J0IHsgU3RhdGUgfSBmcm9tICcuL3N0YXRlcy9zdGF0ZSc7XG5pbXBvcnQgeyBJQ2hhaW5hYmxlLCBJTmV4dGFibGUgfSBmcm9tICcuL3R5cGVzJztcblxuLyoqXG4gKiBBIGNvbGxlY3Rpb24gb2Ygc3RhdGVzIHRvIGNoYWluIG9udG9cbiAqXG4gKiBBIENoYWluIGhhcyBhIHN0YXJ0IGFuZCB6ZXJvIG9yIG1vcmUgY2hhaW5hYmxlIGVuZHMuIElmIHRoZXJlIGFyZVxuICogemVybyBlbmRzLCBjYWxsaW5nIG5leHQoKSBvbiB0aGUgQ2hhaW4gd2lsbCBmYWlsLlxuICovXG5leHBvcnQgY2xhc3MgQ2hhaW4gaW1wbGVtZW50cyBJQ2hhaW5hYmxlIHtcbiAgLyoqXG4gICAqIEJlZ2luIGEgbmV3IENoYWluIGZyb20gb25lIGNoYWluYWJsZVxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBzdGFydChzdGF0ZTogSUNoYWluYWJsZSkge1xuICAgIHJldHVybiBuZXcgQ2hhaW4oc3RhdGUuc3RhcnRTdGF0ZSwgc3RhdGUuZW5kU3RhdGVzLCBzdGF0ZSk7XG4gIH1cblxuICAvKipcbiAgICogTWFrZSBhIENoYWluIHdpdGggdGhlIHN0YXJ0IGZyb20gb25lIGNoYWluIGFuZCB0aGUgZW5kcyBmcm9tIGFub3RoZXJcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgc2VxdWVuY2Uoc3RhcnQ6IElDaGFpbmFibGUsIG5leHQ6IElDaGFpbmFibGUpIHtcbiAgICByZXR1cm4gbmV3IENoYWluKHN0YXJ0LnN0YXJ0U3RhdGUsIG5leHQuZW5kU3RhdGVzLCBuZXh0KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBNYWtlIGEgQ2hhaW4gd2l0aCBzcGVjaWZpYyBzdGFydCBhbmQgZW5kIHN0YXRlcywgYW5kIGEgbGFzdC1hZGRlZCBDaGFpbmFibGVcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgY3VzdG9tKHN0YXJ0U3RhdGU6IFN0YXRlLCBlbmRTdGF0ZXM6IElOZXh0YWJsZVtdLCBsYXN0QWRkZWQ6IElDaGFpbmFibGUpIHtcbiAgICByZXR1cm4gbmV3IENoYWluKHN0YXJ0U3RhdGUsIGVuZFN0YXRlcywgbGFzdEFkZGVkKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJZGVudGlmeSB0aGlzIENoYWluXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgaWQ6IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIHN0YXJ0IHN0YXRlIG9mIHRoaXMgY2hhaW5cbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBzdGFydFN0YXRlOiBTdGF0ZTtcblxuICAvKipcbiAgICogVGhlIGNoYWluYWJsZSBlbmQgc3RhdGUocykgb2YgdGhpcyBjaGFpblxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IGVuZFN0YXRlczogSU5leHRhYmxlW107XG5cbiAgcHJpdmF0ZSBjb25zdHJ1Y3RvcihzdGFydFN0YXRlOiBTdGF0ZSwgZW5kU3RhdGVzOiBJTmV4dGFibGVbXSwgcHJpdmF0ZSByZWFkb25seSBsYXN0QWRkZWQ6IElDaGFpbmFibGUpIHtcbiAgICB0aGlzLmlkID0gbGFzdEFkZGVkLmlkO1xuICAgIHRoaXMuc3RhcnRTdGF0ZSA9IHN0YXJ0U3RhdGU7XG4gICAgdGhpcy5lbmRTdGF0ZXMgPSBlbmRTdGF0ZXM7XG4gIH1cblxuICAvKipcbiAgICogQ29udGludWUgbm9ybWFsIGV4ZWN1dGlvbiB3aXRoIHRoZSBnaXZlbiBzdGF0ZVxuICAgKi9cbiAgcHVibGljIG5leHQobmV4dDogSUNoYWluYWJsZSk6IENoYWluIHtcbiAgICBpZiAodGhpcy5lbmRTdGF0ZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYENhbm5vdCBhZGQgdG8gY2hhaW46IGxhc3Qgc3RhdGUgaW4gY2hhaW4gKCR7dGhpcy5sYXN0QWRkZWQuaWR9KSBkb2VzIG5vdCBhbGxvdyBpdGApO1xuICAgIH1cblxuICAgIGZvciAoY29uc3QgZW5kU3RhdGUgb2YgdGhpcy5lbmRTdGF0ZXMpIHtcbiAgICAgIGVuZFN0YXRlLm5leHQobmV4dCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBDaGFpbih0aGlzLnN0YXJ0U3RhdGUsIG5leHQuZW5kU3RhdGVzLCBuZXh0KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm4gYSBzaW5nbGUgc3RhdGUgdGhhdCBlbmNvbXBhc3NlcyBhbGwgc3RhdGVzIGluIHRoZSBjaGFpblxuICAgKlxuICAgKiBUaGlzIGNhbiBiZSB1c2VkIHRvIGFkZCBlcnJvciBoYW5kbGluZyB0byBhIHNlcXVlbmNlIG9mIHN0YXRlcy5cbiAgICpcbiAgICogQmUgYXdhcmUgdGhhdCB0aGlzIGNoYW5nZXMgdGhlIHJlc3VsdCBvZiB0aGUgaW5uZXIgc3RhdGUgbWFjaGluZVxuICAgKiB0byBiZSBhbiBhcnJheSB3aXRoIHRoZSByZXN1bHQgb2YgdGhlIHN0YXRlIG1hY2hpbmUgaW4gaXQuIEFkanVzdFxuICAgKiB5b3VyIHBhdGhzIGFjY29yZGluZ2x5LiBGb3IgZXhhbXBsZSwgY2hhbmdlICdvdXRwdXRQYXRoJyB0b1xuICAgKiAnJFswXScuXG4gICAqL1xuICBwdWJsaWMgdG9TaW5nbGVTdGF0ZShpZDogc3RyaW5nLCBwcm9wczogUGFyYWxsZWxQcm9wcyA9IHt9KTogUGFyYWxsZWwge1xuICAgIHJldHVybiBuZXcgUGFyYWxsZWwodGhpcy5zdGFydFN0YXRlLCBpZCwgcHJvcHMpLmJyYW5jaCh0aGlzKTtcbiAgfVxufSJdfQ==