"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parallel = void 0;
const jsiiDeprecationWarnings = require("../../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const chain_1 = require("../chain");
const state_graph_1 = require("../state-graph");
const state_type_1 = require("./private/state-type");
const state_1 = require("./state");
/**
 * Define a Parallel state in the state machine
 *
 * A Parallel state can be used to run one or more state machines at the same
 * time.
 *
 * The Result of a Parallel state is an array of the results of its substatemachines.
 */
class Parallel extends state_1.State {
    constructor(scope, id, props = {}) {
        super(scope, id, props);
        this._branches = [];
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_stepfunctions_ParallelProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, Parallel);
            }
            throw error;
        }
        this.endStates = [this];
    }
    /**
     * Add retry configuration for this state
     *
     * This controls if and how the execution will be retried if a particular
     * error occurs.
     */
    addRetry(props = {}) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_stepfunctions_RetryProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.addRetry);
            }
            throw error;
        }
        super._addRetry(props);
        return this;
    }
    /**
     * Add a recovery handler for this state
     *
     * When a particular error occurs, execution will continue at the error
     * handler instead of failing the state machine execution.
     */
    addCatch(handler, props = {}) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_stepfunctions_IChainable(handler);
            jsiiDeprecationWarnings._aws_cdk_aws_stepfunctions_CatchProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.addCatch);
            }
            throw error;
        }
        super._addCatch(handler.startState, props);
        return this;
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
        super.makeNext(next.startState);
        return chain_1.Chain.sequence(this, next);
    }
    /**
     * Define one or more branches to run in parallel
     */
    branch(...branches) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_stepfunctions_IChainable(branches);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.branch);
            }
            throw error;
        }
        // Store branches for late-bound stategraph creation when we call bindToGraph.
        this._branches.push(...branches);
        return this;
    }
    /**
     * Overwrites State.bindToGraph. Adds branches to
     * the Parallel state here so that any necessary
     * prefixes are appended first.
     */
    bindToGraph(graph) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_stepfunctions_StateGraph(graph);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.bindToGraph);
            }
            throw error;
        }
        for (const branch of this._branches) {
            const name = `Parallel '${this.stateId}' branch ${this.branches.length + 1}`;
            super.addBranch(new state_graph_1.StateGraph(branch.startState, name));
        }
        this._branches.splice(0, this._branches.length);
        return super.bindToGraph(graph);
    }
    /**
     * Return the Amazon States Language object for this state
     */
    toStateJson() {
        return {
            Type: state_type_1.StateType.PARALLEL,
            Comment: this.comment,
            ResultPath: state_1.renderJsonPath(this.resultPath),
            ...this.renderNextEnd(),
            ...this.renderInputOutput(),
            ...this.renderRetryCatch(),
            ...this.renderBranches(),
            ...this.renderResultSelector(),
        };
    }
    /**
     * Validate this state
     */
    validateState() {
        if (this.branches.length === 0) {
            return ['Parallel must have at least one branch'];
        }
        return [];
    }
}
exports.Parallel = Parallel;
_a = JSII_RTTI_SYMBOL_1;
Parallel[_a] = { fqn: "@aws-cdk/aws-stepfunctions.Parallel", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyYWxsZWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJwYXJhbGxlbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFDQSxvQ0FBaUM7QUFDakMsZ0RBQTRDO0FBRTVDLHFEQUFpRDtBQUNqRCxtQ0FBZ0Q7QUEwRGhEOzs7Ozs7O0dBT0c7QUFDSCxNQUFhLFFBQVMsU0FBUSxhQUFLO0lBSWpDLFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsUUFBdUIsRUFBRTtRQUNqRSxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUhULGNBQVMsR0FBaUIsRUFBRSxDQUFDOzs7Ozs7K0NBRm5DLFFBQVE7Ozs7UUFPakIsSUFBSSxDQUFDLFNBQVMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO0tBQ3pCO0lBRUQ7Ozs7O09BS0c7SUFDSSxRQUFRLENBQUMsUUFBb0IsRUFBRTs7Ozs7Ozs7OztRQUNwQyxLQUFLLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3ZCLE9BQU8sSUFBSSxDQUFDO0tBQ2I7SUFFRDs7Ozs7T0FLRztJQUNJLFFBQVEsQ0FBQyxPQUFtQixFQUFFLFFBQW9CLEVBQUU7Ozs7Ozs7Ozs7O1FBQ3pELEtBQUssQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLFVBQVUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUMzQyxPQUFPLElBQUksQ0FBQztLQUNiO0lBRUQ7O09BRUc7SUFDSSxJQUFJLENBQUMsSUFBZ0I7Ozs7Ozs7Ozs7UUFDMUIsS0FBSyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDaEMsT0FBTyxhQUFLLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztLQUNuQztJQUVEOztPQUVHO0lBQ0ksTUFBTSxDQUFDLEdBQUcsUUFBc0I7Ozs7Ozs7Ozs7UUFDckMsOEVBQThFO1FBQzlFLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEdBQUcsUUFBUSxDQUFDLENBQUM7UUFDakMsT0FBTyxJQUFJLENBQUM7S0FDYjtJQUVEOzs7O09BSUc7SUFDSSxXQUFXLENBQUMsS0FBaUI7Ozs7Ozs7Ozs7UUFDbEMsS0FBSyxNQUFNLE1BQU0sSUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFO1lBQ25DLE1BQU0sSUFBSSxHQUFHLGFBQWEsSUFBSSxDQUFDLE9BQU8sWUFBWSxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUUsQ0FBQztZQUM3RSxLQUFLLENBQUMsU0FBUyxDQUFDLElBQUksd0JBQVUsQ0FBQyxNQUFNLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7U0FDMUQ7UUFDRCxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNoRCxPQUFPLEtBQUssQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7S0FDakM7SUFFRDs7T0FFRztJQUNJLFdBQVc7UUFDaEIsT0FBTztZQUNMLElBQUksRUFBRSxzQkFBUyxDQUFDLFFBQVE7WUFDeEIsT0FBTyxFQUFFLElBQUksQ0FBQyxPQUFPO1lBQ3JCLFVBQVUsRUFBRSxzQkFBYyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUM7WUFDM0MsR0FBRyxJQUFJLENBQUMsYUFBYSxFQUFFO1lBQ3ZCLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixFQUFFO1lBQzNCLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixFQUFFO1lBQzFCLEdBQUcsSUFBSSxDQUFDLGNBQWMsRUFBRTtZQUN4QixHQUFHLElBQUksQ0FBQyxvQkFBb0IsRUFBRTtTQUMvQixDQUFDO0tBQ0g7SUFFRDs7T0FFRztJQUNPLGFBQWE7UUFDckIsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7WUFDOUIsT0FBTyxDQUFDLHdDQUF3QyxDQUFDLENBQUM7U0FDbkQ7UUFDRCxPQUFPLEVBQUUsQ0FBQztLQUNYOztBQXZGSCw0QkF3RkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCB7IENoYWluIH0gZnJvbSAnLi4vY2hhaW4nO1xuaW1wb3J0IHsgU3RhdGVHcmFwaCB9IGZyb20gJy4uL3N0YXRlLWdyYXBoJztcbmltcG9ydCB7IENhdGNoUHJvcHMsIElDaGFpbmFibGUsIElOZXh0YWJsZSwgUmV0cnlQcm9wcyB9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCB7IFN0YXRlVHlwZSB9IGZyb20gJy4vcHJpdmF0ZS9zdGF0ZS10eXBlJztcbmltcG9ydCB7IHJlbmRlckpzb25QYXRoLCBTdGF0ZSB9IGZyb20gJy4vc3RhdGUnO1xuXG4vKipcbiAqIFByb3BlcnRpZXMgZm9yIGRlZmluaW5nIGEgUGFyYWxsZWwgc3RhdGVcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBQYXJhbGxlbFByb3BzIHtcbiAgLyoqXG4gICAqIEFuIG9wdGlvbmFsIGRlc2NyaXB0aW9uIGZvciB0aGlzIHN0YXRlXG4gICAqXG4gICAqIEBkZWZhdWx0IE5vIGNvbW1lbnRcbiAgICovXG4gIHJlYWRvbmx5IGNvbW1lbnQ/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIEpTT05QYXRoIGV4cHJlc3Npb24gdG8gc2VsZWN0IHBhcnQgb2YgdGhlIHN0YXRlIHRvIGJlIHRoZSBpbnB1dCB0byB0aGlzIHN0YXRlLlxuICAgKlxuICAgKiBNYXkgYWxzbyBiZSB0aGUgc3BlY2lhbCB2YWx1ZSBKc29uUGF0aC5ESVNDQVJELCB3aGljaCB3aWxsIGNhdXNlIHRoZSBlZmZlY3RpdmVcbiAgICogaW5wdXQgdG8gYmUgdGhlIGVtcHR5IG9iamVjdCB7fS5cbiAgICpcbiAgICogQGRlZmF1bHQgJFxuICAgKi9cbiAgcmVhZG9ubHkgaW5wdXRQYXRoPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBKU09OUGF0aCBleHByZXNzaW9uIHRvIHNlbGVjdCBwYXJ0IG9mIHRoZSBzdGF0ZSB0byBiZSB0aGUgb3V0cHV0IHRvIHRoaXMgc3RhdGUuXG4gICAqXG4gICAqIE1heSBhbHNvIGJlIHRoZSBzcGVjaWFsIHZhbHVlIEpzb25QYXRoLkRJU0NBUkQsIHdoaWNoIHdpbGwgY2F1c2UgdGhlIGVmZmVjdGl2ZVxuICAgKiBvdXRwdXQgdG8gYmUgdGhlIGVtcHR5IG9iamVjdCB7fS5cbiAgICpcbiAgICogQGRlZmF1bHQgJFxuICAgKi9cbiAgcmVhZG9ubHkgb3V0cHV0UGF0aD86IHN0cmluZztcblxuICAvKipcbiAgICogSlNPTlBhdGggZXhwcmVzc2lvbiB0byBpbmRpY2F0ZSB3aGVyZSB0byBpbmplY3QgdGhlIHN0YXRlJ3Mgb3V0cHV0XG4gICAqXG4gICAqIE1heSBhbHNvIGJlIHRoZSBzcGVjaWFsIHZhbHVlIEpzb25QYXRoLkRJU0NBUkQsIHdoaWNoIHdpbGwgY2F1c2UgdGhlIHN0YXRlJ3NcbiAgICogaW5wdXQgdG8gYmVjb21lIGl0cyBvdXRwdXQuXG4gICAqXG4gICAqIEBkZWZhdWx0ICRcbiAgICovXG4gIHJlYWRvbmx5IHJlc3VsdFBhdGg/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBKU09OIHRoYXQgd2lsbCByZXBsYWNlIHRoZSBzdGF0ZSdzIHJhdyByZXN1bHQgYW5kIGJlY29tZSB0aGUgZWZmZWN0aXZlXG4gICAqIHJlc3VsdCBiZWZvcmUgUmVzdWx0UGF0aCBpcyBhcHBsaWVkLlxuICAgKlxuICAgKiBZb3UgY2FuIHVzZSBSZXN1bHRTZWxlY3RvciB0byBjcmVhdGUgYSBwYXlsb2FkIHdpdGggdmFsdWVzIHRoYXQgYXJlIHN0YXRpY1xuICAgKiBvciBzZWxlY3RlZCBmcm9tIHRoZSBzdGF0ZSdzIHJhdyByZXN1bHQuXG4gICAqXG4gICAqIEBzZWVcbiAgICogaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL3N0ZXAtZnVuY3Rpb25zL2xhdGVzdC9kZy9pbnB1dC1vdXRwdXQtaW5wdXRwYXRoLXBhcmFtcy5odG1sI2lucHV0LW91dHB1dC1yZXN1bHRzZWxlY3RvclxuICAgKlxuICAgKiBAZGVmYXVsdCAtIE5vbmVcbiAgICovXG4gIHJlYWRvbmx5IHJlc3VsdFNlbGVjdG9yPzogeyBba2V5OiBzdHJpbmddOiBhbnkgfTtcbn1cblxuLyoqXG4gKiBEZWZpbmUgYSBQYXJhbGxlbCBzdGF0ZSBpbiB0aGUgc3RhdGUgbWFjaGluZVxuICpcbiAqIEEgUGFyYWxsZWwgc3RhdGUgY2FuIGJlIHVzZWQgdG8gcnVuIG9uZSBvciBtb3JlIHN0YXRlIG1hY2hpbmVzIGF0IHRoZSBzYW1lXG4gKiB0aW1lLlxuICpcbiAqIFRoZSBSZXN1bHQgb2YgYSBQYXJhbGxlbCBzdGF0ZSBpcyBhbiBhcnJheSBvZiB0aGUgcmVzdWx0cyBvZiBpdHMgc3Vic3RhdGVtYWNoaW5lcy5cbiAqL1xuZXhwb3J0IGNsYXNzIFBhcmFsbGVsIGV4dGVuZHMgU3RhdGUgaW1wbGVtZW50cyBJTmV4dGFibGUge1xuICBwdWJsaWMgcmVhZG9ubHkgZW5kU3RhdGVzOiBJTmV4dGFibGVbXTtcbiAgcHJpdmF0ZSByZWFkb25seSBfYnJhbmNoZXM6IElDaGFpbmFibGVbXSA9IFtdO1xuXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBQYXJhbGxlbFByb3BzID0ge30pIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHByb3BzKTtcblxuICAgIHRoaXMuZW5kU3RhdGVzID0gW3RoaXNdO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZCByZXRyeSBjb25maWd1cmF0aW9uIGZvciB0aGlzIHN0YXRlXG4gICAqXG4gICAqIFRoaXMgY29udHJvbHMgaWYgYW5kIGhvdyB0aGUgZXhlY3V0aW9uIHdpbGwgYmUgcmV0cmllZCBpZiBhIHBhcnRpY3VsYXJcbiAgICogZXJyb3Igb2NjdXJzLlxuICAgKi9cbiAgcHVibGljIGFkZFJldHJ5KHByb3BzOiBSZXRyeVByb3BzID0ge30pOiBQYXJhbGxlbCB7XG4gICAgc3VwZXIuX2FkZFJldHJ5KHByb3BzKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgYSByZWNvdmVyeSBoYW5kbGVyIGZvciB0aGlzIHN0YXRlXG4gICAqXG4gICAqIFdoZW4gYSBwYXJ0aWN1bGFyIGVycm9yIG9jY3VycywgZXhlY3V0aW9uIHdpbGwgY29udGludWUgYXQgdGhlIGVycm9yXG4gICAqIGhhbmRsZXIgaW5zdGVhZCBvZiBmYWlsaW5nIHRoZSBzdGF0ZSBtYWNoaW5lIGV4ZWN1dGlvbi5cbiAgICovXG4gIHB1YmxpYyBhZGRDYXRjaChoYW5kbGVyOiBJQ2hhaW5hYmxlLCBwcm9wczogQ2F0Y2hQcm9wcyA9IHt9KTogUGFyYWxsZWwge1xuICAgIHN1cGVyLl9hZGRDYXRjaChoYW5kbGVyLnN0YXJ0U3RhdGUsIHByb3BzKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBDb250aW51ZSBub3JtYWwgZXhlY3V0aW9uIHdpdGggdGhlIGdpdmVuIHN0YXRlXG4gICAqL1xuICBwdWJsaWMgbmV4dChuZXh0OiBJQ2hhaW5hYmxlKTogQ2hhaW4ge1xuICAgIHN1cGVyLm1ha2VOZXh0KG5leHQuc3RhcnRTdGF0ZSk7XG4gICAgcmV0dXJuIENoYWluLnNlcXVlbmNlKHRoaXMsIG5leHQpO1xuICB9XG5cbiAgLyoqXG4gICAqIERlZmluZSBvbmUgb3IgbW9yZSBicmFuY2hlcyB0byBydW4gaW4gcGFyYWxsZWxcbiAgICovXG4gIHB1YmxpYyBicmFuY2goLi4uYnJhbmNoZXM6IElDaGFpbmFibGVbXSk6IFBhcmFsbGVsIHtcbiAgICAvLyBTdG9yZSBicmFuY2hlcyBmb3IgbGF0ZS1ib3VuZCBzdGF0ZWdyYXBoIGNyZWF0aW9uIHdoZW4gd2UgY2FsbCBiaW5kVG9HcmFwaC5cbiAgICB0aGlzLl9icmFuY2hlcy5wdXNoKC4uLmJyYW5jaGVzKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBPdmVyd3JpdGVzIFN0YXRlLmJpbmRUb0dyYXBoLiBBZGRzIGJyYW5jaGVzIHRvXG4gICAqIHRoZSBQYXJhbGxlbCBzdGF0ZSBoZXJlIHNvIHRoYXQgYW55IG5lY2Vzc2FyeVxuICAgKiBwcmVmaXhlcyBhcmUgYXBwZW5kZWQgZmlyc3QuXG4gICAqL1xuICBwdWJsaWMgYmluZFRvR3JhcGgoZ3JhcGg6IFN0YXRlR3JhcGgpIHtcbiAgICBmb3IgKGNvbnN0IGJyYW5jaCBvZiB0aGlzLl9icmFuY2hlcykge1xuICAgICAgY29uc3QgbmFtZSA9IGBQYXJhbGxlbCAnJHt0aGlzLnN0YXRlSWR9JyBicmFuY2ggJHt0aGlzLmJyYW5jaGVzLmxlbmd0aCArIDF9YDtcbiAgICAgIHN1cGVyLmFkZEJyYW5jaChuZXcgU3RhdGVHcmFwaChicmFuY2guc3RhcnRTdGF0ZSwgbmFtZSkpO1xuICAgIH1cbiAgICB0aGlzLl9icmFuY2hlcy5zcGxpY2UoMCwgdGhpcy5fYnJhbmNoZXMubGVuZ3RoKTtcbiAgICByZXR1cm4gc3VwZXIuYmluZFRvR3JhcGgoZ3JhcGgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybiB0aGUgQW1hem9uIFN0YXRlcyBMYW5ndWFnZSBvYmplY3QgZm9yIHRoaXMgc3RhdGVcbiAgICovXG4gIHB1YmxpYyB0b1N0YXRlSnNvbigpOiBvYmplY3Qge1xuICAgIHJldHVybiB7XG4gICAgICBUeXBlOiBTdGF0ZVR5cGUuUEFSQUxMRUwsXG4gICAgICBDb21tZW50OiB0aGlzLmNvbW1lbnQsXG4gICAgICBSZXN1bHRQYXRoOiByZW5kZXJKc29uUGF0aCh0aGlzLnJlc3VsdFBhdGgpLFxuICAgICAgLi4udGhpcy5yZW5kZXJOZXh0RW5kKCksXG4gICAgICAuLi50aGlzLnJlbmRlcklucHV0T3V0cHV0KCksXG4gICAgICAuLi50aGlzLnJlbmRlclJldHJ5Q2F0Y2goKSxcbiAgICAgIC4uLnRoaXMucmVuZGVyQnJhbmNoZXMoKSxcbiAgICAgIC4uLnRoaXMucmVuZGVyUmVzdWx0U2VsZWN0b3IoKSxcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIFZhbGlkYXRlIHRoaXMgc3RhdGVcbiAgICovXG4gIHByb3RlY3RlZCB2YWxpZGF0ZVN0YXRlKCk6IHN0cmluZ1tdIHtcbiAgICBpZiAodGhpcy5icmFuY2hlcy5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiBbJ1BhcmFsbGVsIG11c3QgaGF2ZSBhdCBsZWFzdCBvbmUgYnJhbmNoJ107XG4gICAgfVxuICAgIHJldHVybiBbXTtcbiAgfVxufVxuIl19