"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Map = exports.isPositiveInteger = void 0;
const jsiiDeprecationWarnings = require("../../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const core_1 = require("@aws-cdk/core");
const chain_1 = require("../chain");
const fields_1 = require("../fields");
const state_graph_1 = require("../state-graph");
const state_type_1 = require("./private/state-type");
const state_1 = require("./state");
/**
 * Returns true if the value passed is a positive integer
 * @param value the value ti validate
 */
exports.isPositiveInteger = (value) => {
    const isFloat = Math.floor(value) !== value;
    const isNotPositiveInteger = value < 0 || value > Number.MAX_SAFE_INTEGER;
    return !isFloat && !isNotPositiveInteger;
};
/**
 * Define a Map state in the state machine
 *
 * A `Map` state can be used to run a set of steps for each element of an input array.
 * A Map state will execute the same steps for multiple entries of an array in the state input.
 *
 * While the Parallel state executes multiple branches of steps using the same input, a Map state
 * will execute the same steps for multiple entries of an array in the state input.
 *
 * @see https://docs.aws.amazon.com/step-functions/latest/dg/amazon-states-language-map-state.html
 */
class Map extends state_1.State {
    constructor(scope, id, props = {}) {
        super(scope, id, props);
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_stepfunctions_MapProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, Map);
            }
            throw error;
        }
        this.endStates = [this];
        this.maxConcurrency = props.maxConcurrency;
        this.itemsPath = props.itemsPath;
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
     * Define iterator state machine in Map
     */
    iterator(iterator) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_stepfunctions_IChainable(iterator);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.iterator);
            }
            throw error;
        }
        const name = `Map ${this.stateId} Iterator`;
        super.addIterator(new state_graph_1.StateGraph(iterator.startState, name));
        return this;
    }
    /**
     * Return the Amazon States Language object for this state
     */
    toStateJson() {
        return {
            Type: state_type_1.StateType.MAP,
            Comment: this.comment,
            ResultPath: state_1.renderJsonPath(this.resultPath),
            ...this.renderNextEnd(),
            ...this.renderInputOutput(),
            ...this.renderParameters(),
            ...this.renderResultSelector(),
            ...this.renderRetryCatch(),
            ...this.renderIterator(),
            ...this.renderItemsPath(),
            MaxConcurrency: this.maxConcurrency,
        };
    }
    /**
     * Validate this state
     */
    validateState() {
        const errors = [];
        if (this.iteration === undefined) {
            errors.push('Map state must have a non-empty iterator');
        }
        if (this.maxConcurrency !== undefined && !core_1.Token.isUnresolved(this.maxConcurrency) && !exports.isPositiveInteger(this.maxConcurrency)) {
            errors.push('maxConcurrency has to be a positive integer');
        }
        return errors;
    }
    renderItemsPath() {
        return {
            ItemsPath: state_1.renderJsonPath(this.itemsPath),
        };
    }
    /**
     * Render Parameters in ASL JSON format
     */
    renderParameters() {
        return fields_1.FieldUtils.renderObject({
            Parameters: this.parameters,
        });
    }
}
exports.Map = Map;
_a = JSII_RTTI_SYMBOL_1;
Map[_a] = { fqn: "@aws-cdk/aws-stepfunctions.Map", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibWFwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLHdDQUFzQztBQUV0QyxvQ0FBaUM7QUFDakMsc0NBQXVDO0FBQ3ZDLGdEQUE0QztBQUU1QyxxREFBaUQ7QUFDakQsbUNBQWdEO0FBaUZoRDs7O0dBR0c7QUFFVSxRQUFBLGlCQUFpQixHQUFHLENBQUMsS0FBYSxFQUFFLEVBQUU7SUFDakQsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsS0FBSyxLQUFLLENBQUM7SUFFNUMsTUFBTSxvQkFBb0IsR0FBRyxLQUFLLEdBQUcsQ0FBQyxJQUFJLEtBQUssR0FBRyxNQUFNLENBQUMsZ0JBQWdCLENBQUM7SUFFMUUsT0FBTyxDQUFDLE9BQU8sSUFBSSxDQUFDLG9CQUFvQixDQUFDO0FBQzNDLENBQUMsQ0FBQztBQUVGOzs7Ozs7Ozs7O0dBVUc7QUFDSCxNQUFhLEdBQUksU0FBUSxhQUFLO0lBTTVCLFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsUUFBa0IsRUFBRTtRQUM1RCxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQzs7Ozs7OytDQVBmLEdBQUc7Ozs7UUFRWixJQUFJLENBQUMsU0FBUyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDeEIsSUFBSSxDQUFDLGNBQWMsR0FBRyxLQUFLLENBQUMsY0FBYyxDQUFDO1FBQzNDLElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDLFNBQVMsQ0FBQztLQUNsQztJQUVEOzs7OztPQUtHO0lBQ0ksUUFBUSxDQUFDLFFBQW9CLEVBQUU7Ozs7Ozs7Ozs7UUFDcEMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUN2QixPQUFPLElBQUksQ0FBQztLQUNiO0lBRUQ7Ozs7O09BS0c7SUFDSSxRQUFRLENBQUMsT0FBbUIsRUFBRSxRQUFvQixFQUFFOzs7Ozs7Ozs7OztRQUN6RCxLQUFLLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDM0MsT0FBTyxJQUFJLENBQUM7S0FDYjtJQUVEOztPQUVHO0lBQ0ksSUFBSSxDQUFDLElBQWdCOzs7Ozs7Ozs7O1FBQzFCLEtBQUssQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ2hDLE9BQU8sYUFBSyxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7S0FDbkM7SUFFRDs7T0FFRztJQUNJLFFBQVEsQ0FBQyxRQUFvQjs7Ozs7Ozs7OztRQUNsQyxNQUFNLElBQUksR0FBRyxPQUFPLElBQUksQ0FBQyxPQUFPLFdBQVcsQ0FBQztRQUM1QyxLQUFLLENBQUMsV0FBVyxDQUFDLElBQUksd0JBQVUsQ0FBQyxRQUFRLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDN0QsT0FBTyxJQUFJLENBQUM7S0FDYjtJQUVEOztPQUVHO0lBQ0ksV0FBVztRQUNoQixPQUFPO1lBQ0wsSUFBSSxFQUFFLHNCQUFTLENBQUMsR0FBRztZQUNuQixPQUFPLEVBQUUsSUFBSSxDQUFDLE9BQU87WUFDckIsVUFBVSxFQUFFLHNCQUFjLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQztZQUMzQyxHQUFHLElBQUksQ0FBQyxhQUFhLEVBQUU7WUFDdkIsR0FBRyxJQUFJLENBQUMsaUJBQWlCLEVBQUU7WUFDM0IsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLEVBQUU7WUFDMUIsR0FBRyxJQUFJLENBQUMsb0JBQW9CLEVBQUU7WUFDOUIsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLEVBQUU7WUFDMUIsR0FBRyxJQUFJLENBQUMsY0FBYyxFQUFFO1lBQ3hCLEdBQUcsSUFBSSxDQUFDLGVBQWUsRUFBRTtZQUN6QixjQUFjLEVBQUUsSUFBSSxDQUFDLGNBQWM7U0FDcEMsQ0FBQztLQUNIO0lBRUQ7O09BRUc7SUFDTyxhQUFhO1FBQ3JCLE1BQU0sTUFBTSxHQUFhLEVBQUUsQ0FBQztRQUU1QixJQUFJLElBQUksQ0FBQyxTQUFTLEtBQUssU0FBUyxFQUFFO1lBQ2hDLE1BQU0sQ0FBQyxJQUFJLENBQUMsMENBQTBDLENBQUMsQ0FBQztTQUN6RDtRQUVELElBQUksSUFBSSxDQUFDLGNBQWMsS0FBSyxTQUFTLElBQUksQ0FBQyxZQUFLLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLHlCQUFpQixDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsRUFBRTtZQUM1SCxNQUFNLENBQUMsSUFBSSxDQUFDLDZDQUE2QyxDQUFDLENBQUM7U0FDNUQ7UUFFRCxPQUFPLE1BQU0sQ0FBQztLQUNmO0lBRU8sZUFBZTtRQUNyQixPQUFPO1lBQ0wsU0FBUyxFQUFFLHNCQUFjLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQztTQUMxQyxDQUFDO0tBQ0g7SUFFRDs7T0FFRztJQUNLLGdCQUFnQjtRQUN0QixPQUFPLG1CQUFVLENBQUMsWUFBWSxDQUFDO1lBQzdCLFVBQVUsRUFBRSxJQUFJLENBQUMsVUFBVTtTQUM1QixDQUFDLENBQUM7S0FDSjs7QUFyR0gsa0JBc0dDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgVG9rZW4gfSBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0IHsgQ2hhaW4gfSBmcm9tICcuLi9jaGFpbic7XG5pbXBvcnQgeyBGaWVsZFV0aWxzIH0gZnJvbSAnLi4vZmllbGRzJztcbmltcG9ydCB7IFN0YXRlR3JhcGggfSBmcm9tICcuLi9zdGF0ZS1ncmFwaCc7XG5pbXBvcnQgeyBDYXRjaFByb3BzLCBJQ2hhaW5hYmxlLCBJTmV4dGFibGUsIFJldHJ5UHJvcHMgfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgeyBTdGF0ZVR5cGUgfSBmcm9tICcuL3ByaXZhdGUvc3RhdGUtdHlwZSc7XG5pbXBvcnQgeyByZW5kZXJKc29uUGF0aCwgU3RhdGUgfSBmcm9tICcuL3N0YXRlJztcblxuLyoqXG4gKiBQcm9wZXJ0aWVzIGZvciBkZWZpbmluZyBhIE1hcCBzdGF0ZVxuICovXG5leHBvcnQgaW50ZXJmYWNlIE1hcFByb3BzIHtcbiAgLyoqXG4gICAqIEFuIG9wdGlvbmFsIGRlc2NyaXB0aW9uIGZvciB0aGlzIHN0YXRlXG4gICAqXG4gICAqIEBkZWZhdWx0IE5vIGNvbW1lbnRcbiAgICovXG4gIHJlYWRvbmx5IGNvbW1lbnQ/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIEpTT05QYXRoIGV4cHJlc3Npb24gdG8gc2VsZWN0IHBhcnQgb2YgdGhlIHN0YXRlIHRvIGJlIHRoZSBpbnB1dCB0byB0aGlzIHN0YXRlLlxuICAgKlxuICAgKiBNYXkgYWxzbyBiZSB0aGUgc3BlY2lhbCB2YWx1ZSBKc29uUGF0aC5ESVNDQVJELCB3aGljaCB3aWxsIGNhdXNlIHRoZSBlZmZlY3RpdmVcbiAgICogaW5wdXQgdG8gYmUgdGhlIGVtcHR5IG9iamVjdCB7fS5cbiAgICpcbiAgICogQGRlZmF1bHQgJFxuICAgKi9cbiAgcmVhZG9ubHkgaW5wdXRQYXRoPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBKU09OUGF0aCBleHByZXNzaW9uIHRvIHNlbGVjdCBwYXJ0IG9mIHRoZSBzdGF0ZSB0byBiZSB0aGUgb3V0cHV0IHRvIHRoaXMgc3RhdGUuXG4gICAqXG4gICAqIE1heSBhbHNvIGJlIHRoZSBzcGVjaWFsIHZhbHVlIEpzb25QYXRoLkRJU0NBUkQsIHdoaWNoIHdpbGwgY2F1c2UgdGhlIGVmZmVjdGl2ZVxuICAgKiBvdXRwdXQgdG8gYmUgdGhlIGVtcHR5IG9iamVjdCB7fS5cbiAgICpcbiAgICogQGRlZmF1bHQgJFxuICAgKi9cbiAgcmVhZG9ubHkgb3V0cHV0UGF0aD86IHN0cmluZztcblxuICAvKipcbiAgICogSlNPTlBhdGggZXhwcmVzc2lvbiB0byBpbmRpY2F0ZSB3aGVyZSB0byBpbmplY3QgdGhlIHN0YXRlJ3Mgb3V0cHV0XG4gICAqXG4gICAqIE1heSBhbHNvIGJlIHRoZSBzcGVjaWFsIHZhbHVlIEpzb25QYXRoLkRJU0NBUkQsIHdoaWNoIHdpbGwgY2F1c2UgdGhlIHN0YXRlJ3NcbiAgICogaW5wdXQgdG8gYmVjb21lIGl0cyBvdXRwdXQuXG4gICAqXG4gICAqIEBkZWZhdWx0ICRcbiAgICovXG4gIHJlYWRvbmx5IHJlc3VsdFBhdGg/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIEpTT05QYXRoIGV4cHJlc3Npb24gdG8gc2VsZWN0IHRoZSBhcnJheSB0byBpdGVyYXRlIG92ZXJcbiAgICpcbiAgICogQGRlZmF1bHQgJFxuICAgKi9cbiAgcmVhZG9ubHkgaXRlbXNQYXRoPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgSlNPTiB0aGF0IHlvdSB3YW50IHRvIG92ZXJyaWRlIHlvdXIgZGVmYXVsdCBpdGVyYXRpb24gaW5wdXRcbiAgICpcbiAgICogQGRlZmF1bHQgJFxuICAgKi9cbiAgcmVhZG9ubHkgcGFyYW1ldGVycz86IHsgW2tleTogc3RyaW5nXTogYW55IH07XG5cbiAgLyoqXG4gICAqIFRoZSBKU09OIHRoYXQgd2lsbCByZXBsYWNlIHRoZSBzdGF0ZSdzIHJhdyByZXN1bHQgYW5kIGJlY29tZSB0aGUgZWZmZWN0aXZlXG4gICAqIHJlc3VsdCBiZWZvcmUgUmVzdWx0UGF0aCBpcyBhcHBsaWVkLlxuICAgKlxuICAgKiBZb3UgY2FuIHVzZSBSZXN1bHRTZWxlY3RvciB0byBjcmVhdGUgYSBwYXlsb2FkIHdpdGggdmFsdWVzIHRoYXQgYXJlIHN0YXRpY1xuICAgKiBvciBzZWxlY3RlZCBmcm9tIHRoZSBzdGF0ZSdzIHJhdyByZXN1bHQuXG4gICAqXG4gICAqIEBzZWVcbiAgICogaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL3N0ZXAtZnVuY3Rpb25zL2xhdGVzdC9kZy9pbnB1dC1vdXRwdXQtaW5wdXRwYXRoLXBhcmFtcy5odG1sI2lucHV0LW91dHB1dC1yZXN1bHRzZWxlY3RvclxuICAgKlxuICAgKiBAZGVmYXVsdCAtIE5vbmVcbiAgICovXG4gIHJlYWRvbmx5IHJlc3VsdFNlbGVjdG9yPzogeyBba2V5OiBzdHJpbmddOiBhbnkgfTtcblxuICAvKipcbiAgICogTWF4Q29uY3VycmVuY3lcbiAgICpcbiAgICogQW4gdXBwZXIgYm91bmQgb24gdGhlIG51bWJlciBvZiBpdGVyYXRpb25zIHlvdSB3YW50IHJ1bm5pbmcgYXQgb25jZS5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBmdWxsIGNvbmN1cnJlbmN5XG4gICAqL1xuICByZWFkb25seSBtYXhDb25jdXJyZW5jeT86IG51bWJlcjtcbn1cblxuLyoqXG4gKiBSZXR1cm5zIHRydWUgaWYgdGhlIHZhbHVlIHBhc3NlZCBpcyBhIHBvc2l0aXZlIGludGVnZXJcbiAqIEBwYXJhbSB2YWx1ZSB0aGUgdmFsdWUgdGkgdmFsaWRhdGVcbiAqL1xuXG5leHBvcnQgY29uc3QgaXNQb3NpdGl2ZUludGVnZXIgPSAodmFsdWU6IG51bWJlcikgPT4ge1xuICBjb25zdCBpc0Zsb2F0ID0gTWF0aC5mbG9vcih2YWx1ZSkgIT09IHZhbHVlO1xuXG4gIGNvbnN0IGlzTm90UG9zaXRpdmVJbnRlZ2VyID0gdmFsdWUgPCAwIHx8IHZhbHVlID4gTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVI7XG5cbiAgcmV0dXJuICFpc0Zsb2F0ICYmICFpc05vdFBvc2l0aXZlSW50ZWdlcjtcbn07XG5cbi8qKlxuICogRGVmaW5lIGEgTWFwIHN0YXRlIGluIHRoZSBzdGF0ZSBtYWNoaW5lXG4gKlxuICogQSBgTWFwYCBzdGF0ZSBjYW4gYmUgdXNlZCB0byBydW4gYSBzZXQgb2Ygc3RlcHMgZm9yIGVhY2ggZWxlbWVudCBvZiBhbiBpbnB1dCBhcnJheS5cbiAqIEEgTWFwIHN0YXRlIHdpbGwgZXhlY3V0ZSB0aGUgc2FtZSBzdGVwcyBmb3IgbXVsdGlwbGUgZW50cmllcyBvZiBhbiBhcnJheSBpbiB0aGUgc3RhdGUgaW5wdXQuXG4gKlxuICogV2hpbGUgdGhlIFBhcmFsbGVsIHN0YXRlIGV4ZWN1dGVzIG11bHRpcGxlIGJyYW5jaGVzIG9mIHN0ZXBzIHVzaW5nIHRoZSBzYW1lIGlucHV0LCBhIE1hcCBzdGF0ZVxuICogd2lsbCBleGVjdXRlIHRoZSBzYW1lIHN0ZXBzIGZvciBtdWx0aXBsZSBlbnRyaWVzIG9mIGFuIGFycmF5IGluIHRoZSBzdGF0ZSBpbnB1dC5cbiAqXG4gKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9zdGVwLWZ1bmN0aW9ucy9sYXRlc3QvZGcvYW1hem9uLXN0YXRlcy1sYW5ndWFnZS1tYXAtc3RhdGUuaHRtbFxuICovXG5leHBvcnQgY2xhc3MgTWFwIGV4dGVuZHMgU3RhdGUgaW1wbGVtZW50cyBJTmV4dGFibGUge1xuICBwdWJsaWMgcmVhZG9ubHkgZW5kU3RhdGVzOiBJTmV4dGFibGVbXTtcblxuICBwcml2YXRlIHJlYWRvbmx5IG1heENvbmN1cnJlbmN5OiBudW1iZXIgfCB1bmRlZmluZWQ7XG4gIHByaXZhdGUgcmVhZG9ubHkgaXRlbXNQYXRoPzogc3RyaW5nO1xuXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBNYXBQcm9wcyA9IHt9KSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCBwcm9wcyk7XG4gICAgdGhpcy5lbmRTdGF0ZXMgPSBbdGhpc107XG4gICAgdGhpcy5tYXhDb25jdXJyZW5jeSA9IHByb3BzLm1heENvbmN1cnJlbmN5O1xuICAgIHRoaXMuaXRlbXNQYXRoID0gcHJvcHMuaXRlbXNQYXRoO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZCByZXRyeSBjb25maWd1cmF0aW9uIGZvciB0aGlzIHN0YXRlXG4gICAqXG4gICAqIFRoaXMgY29udHJvbHMgaWYgYW5kIGhvdyB0aGUgZXhlY3V0aW9uIHdpbGwgYmUgcmV0cmllZCBpZiBhIHBhcnRpY3VsYXJcbiAgICogZXJyb3Igb2NjdXJzLlxuICAgKi9cbiAgcHVibGljIGFkZFJldHJ5KHByb3BzOiBSZXRyeVByb3BzID0ge30pOiBNYXAge1xuICAgIHN1cGVyLl9hZGRSZXRyeShwcm9wcyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogQWRkIGEgcmVjb3ZlcnkgaGFuZGxlciBmb3IgdGhpcyBzdGF0ZVxuICAgKlxuICAgKiBXaGVuIGEgcGFydGljdWxhciBlcnJvciBvY2N1cnMsIGV4ZWN1dGlvbiB3aWxsIGNvbnRpbnVlIGF0IHRoZSBlcnJvclxuICAgKiBoYW5kbGVyIGluc3RlYWQgb2YgZmFpbGluZyB0aGUgc3RhdGUgbWFjaGluZSBleGVjdXRpb24uXG4gICAqL1xuICBwdWJsaWMgYWRkQ2F0Y2goaGFuZGxlcjogSUNoYWluYWJsZSwgcHJvcHM6IENhdGNoUHJvcHMgPSB7fSk6IE1hcCB7XG4gICAgc3VwZXIuX2FkZENhdGNoKGhhbmRsZXIuc3RhcnRTdGF0ZSwgcHJvcHMpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIENvbnRpbnVlIG5vcm1hbCBleGVjdXRpb24gd2l0aCB0aGUgZ2l2ZW4gc3RhdGVcbiAgICovXG4gIHB1YmxpYyBuZXh0KG5leHQ6IElDaGFpbmFibGUpOiBDaGFpbiB7XG4gICAgc3VwZXIubWFrZU5leHQobmV4dC5zdGFydFN0YXRlKTtcbiAgICByZXR1cm4gQ2hhaW4uc2VxdWVuY2UodGhpcywgbmV4dCk7XG4gIH1cblxuICAvKipcbiAgICogRGVmaW5lIGl0ZXJhdG9yIHN0YXRlIG1hY2hpbmUgaW4gTWFwXG4gICAqL1xuICBwdWJsaWMgaXRlcmF0b3IoaXRlcmF0b3I6IElDaGFpbmFibGUpOiBNYXAge1xuICAgIGNvbnN0IG5hbWUgPSBgTWFwICR7dGhpcy5zdGF0ZUlkfSBJdGVyYXRvcmA7XG4gICAgc3VwZXIuYWRkSXRlcmF0b3IobmV3IFN0YXRlR3JhcGgoaXRlcmF0b3Iuc3RhcnRTdGF0ZSwgbmFtZSkpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybiB0aGUgQW1hem9uIFN0YXRlcyBMYW5ndWFnZSBvYmplY3QgZm9yIHRoaXMgc3RhdGVcbiAgICovXG4gIHB1YmxpYyB0b1N0YXRlSnNvbigpOiBvYmplY3Qge1xuICAgIHJldHVybiB7XG4gICAgICBUeXBlOiBTdGF0ZVR5cGUuTUFQLFxuICAgICAgQ29tbWVudDogdGhpcy5jb21tZW50LFxuICAgICAgUmVzdWx0UGF0aDogcmVuZGVySnNvblBhdGgodGhpcy5yZXN1bHRQYXRoKSxcbiAgICAgIC4uLnRoaXMucmVuZGVyTmV4dEVuZCgpLFxuICAgICAgLi4udGhpcy5yZW5kZXJJbnB1dE91dHB1dCgpLFxuICAgICAgLi4udGhpcy5yZW5kZXJQYXJhbWV0ZXJzKCksXG4gICAgICAuLi50aGlzLnJlbmRlclJlc3VsdFNlbGVjdG9yKCksXG4gICAgICAuLi50aGlzLnJlbmRlclJldHJ5Q2F0Y2goKSxcbiAgICAgIC4uLnRoaXMucmVuZGVySXRlcmF0b3IoKSxcbiAgICAgIC4uLnRoaXMucmVuZGVySXRlbXNQYXRoKCksXG4gICAgICBNYXhDb25jdXJyZW5jeTogdGhpcy5tYXhDb25jdXJyZW5jeSxcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIFZhbGlkYXRlIHRoaXMgc3RhdGVcbiAgICovXG4gIHByb3RlY3RlZCB2YWxpZGF0ZVN0YXRlKCk6IHN0cmluZ1tdIHtcbiAgICBjb25zdCBlcnJvcnM6IHN0cmluZ1tdID0gW107XG5cbiAgICBpZiAodGhpcy5pdGVyYXRpb24gPT09IHVuZGVmaW5lZCkge1xuICAgICAgZXJyb3JzLnB1c2goJ01hcCBzdGF0ZSBtdXN0IGhhdmUgYSBub24tZW1wdHkgaXRlcmF0b3InKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5tYXhDb25jdXJyZW5jeSAhPT0gdW5kZWZpbmVkICYmICFUb2tlbi5pc1VucmVzb2x2ZWQodGhpcy5tYXhDb25jdXJyZW5jeSkgJiYgIWlzUG9zaXRpdmVJbnRlZ2VyKHRoaXMubWF4Q29uY3VycmVuY3kpKSB7XG4gICAgICBlcnJvcnMucHVzaCgnbWF4Q29uY3VycmVuY3kgaGFzIHRvIGJlIGEgcG9zaXRpdmUgaW50ZWdlcicpO1xuICAgIH1cblxuICAgIHJldHVybiBlcnJvcnM7XG4gIH1cblxuICBwcml2YXRlIHJlbmRlckl0ZW1zUGF0aCgpOiBhbnkge1xuICAgIHJldHVybiB7XG4gICAgICBJdGVtc1BhdGg6IHJlbmRlckpzb25QYXRoKHRoaXMuaXRlbXNQYXRoKSxcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbmRlciBQYXJhbWV0ZXJzIGluIEFTTCBKU09OIGZvcm1hdFxuICAgKi9cbiAgcHJpdmF0ZSByZW5kZXJQYXJhbWV0ZXJzKCk6IGFueSB7XG4gICAgcmV0dXJuIEZpZWxkVXRpbHMucmVuZGVyT2JqZWN0KHtcbiAgICAgIFBhcmFtZXRlcnM6IHRoaXMucGFyYW1ldGVycyxcbiAgICB9KTtcbiAgfVxufVxuIl19