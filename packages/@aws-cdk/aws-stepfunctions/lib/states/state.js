"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderJsonPath = exports.renderList = exports.State = void 0;
const jsiiDeprecationWarnings = require("../../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const constructs_1 = require("constructs");
const fields_1 = require("../fields");
const types_1 = require("../types");
/**
 * Base class for all other state classes
 */
class State extends constructs_1.Construct {
    constructor(scope, id, props) {
        super(scope, id);
        this.branches = [];
        this.retries = [];
        this.catches = [];
        this.choices = [];
        this.prefixes = [];
        /**
         * States with references to this state.
         *
         * Used for finding complete connected graph that a state is part of.
         */
        this.incomingStates = [];
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_stepfunctions_StateProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, State);
            }
            throw error;
        }
        this.startState = this;
        this.comment = props.comment;
        this.inputPath = props.inputPath;
        this.parameters = props.parameters;
        this.outputPath = props.outputPath;
        this.resultPath = props.resultPath;
        this.resultSelector = props.resultSelector;
        this.node.addValidation({ validate: () => this.validateState() });
    }
    /**
     * Add a prefix to the stateId of all States found in a construct tree
     */
    static prefixStates(root, prefix) {
        const queue = [root];
        while (queue.length > 0) {
            const el = queue.splice(0, 1)[0];
            if (isPrefixable(el)) {
                el.addPrefix(prefix);
            }
            queue.push(...constructs_1.Node.of(el).children);
        }
    }
    /**
     * Find the set of states reachable through transitions from the given start state.
     * This does not retrieve states from within sub-graphs, such as states within a Parallel state's branch.
     */
    static findReachableStates(start, options = {}) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_stepfunctions_State(start);
            jsiiDeprecationWarnings._aws_cdk_aws_stepfunctions_FindStateOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.findReachableStates);
            }
            throw error;
        }
        const visited = new Set();
        const ret = new Set();
        const queue = [start];
        while (queue.length > 0) {
            const state = queue.splice(0, 1)[0];
            if (visited.has(state)) {
                continue;
            }
            visited.add(state);
            const outgoing = state.outgoingTransitions(options);
            queue.push(...outgoing);
            ret.add(state);
        }
        return Array.from(ret);
    }
    /**
     * Find the set of end states states reachable through transitions from the given start state
     */
    static findReachableEndStates(start, options = {}) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_stepfunctions_State(start);
            jsiiDeprecationWarnings._aws_cdk_aws_stepfunctions_FindStateOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.findReachableEndStates);
            }
            throw error;
        }
        const visited = new Set();
        const ret = new Set();
        const queue = [start];
        while (queue.length > 0) {
            const state = queue.splice(0, 1)[0];
            if (visited.has(state)) {
                continue;
            }
            visited.add(state);
            const outgoing = state.outgoingTransitions(options);
            if (outgoing.length > 0) {
                // We can continue
                queue.push(...outgoing);
            }
            else {
                // Terminal state
                ret.add(state);
            }
        }
        return Array.from(ret);
    }
    /**
     * Return only the states that allow chaining from an array of states
     */
    static filterNextables(states) {
        return states.filter(isNextable);
    }
    /**
     * Allows the state to validate itself.
     */
    validateState() {
        return [];
    }
    get id() {
        return this.node.id;
    }
    /**
     * Tokenized string that evaluates to the state's ID
     */
    get stateId() {
        return this.prefixes.concat(this.id).join('');
    }
    /**
     * Add a prefix to the stateId of this state
     */
    addPrefix(x) {
        if (x !== '') {
            this.prefixes.splice(0, 0, x);
        }
    }
    /**
     * Register this state as part of the given graph
     *
     * Don't call this. It will be called automatically when you work
     * with states normally.
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
        if (this.containingGraph === graph) {
            return;
        }
        if (this.containingGraph) {
            // eslint-disable-next-line max-len
            throw new Error(`Trying to use state '${this.stateId}' in ${graph}, but is already in ${this.containingGraph}. Every state can only be used in one graph.`);
        }
        this.containingGraph = graph;
        this.whenBoundToGraph(graph);
        for (const incoming of this.incomingStates) {
            incoming.bindToGraph(graph);
        }
        for (const outgoing of this.outgoingTransitions({ includeErrorHandlers: true })) {
            outgoing.bindToGraph(graph);
        }
        for (const branch of this.branches) {
            branch.registerSuperGraph(this.containingGraph);
        }
        if (!!this.iteration) {
            this.iteration.registerSuperGraph(this.containingGraph);
        }
    }
    /**
     * Add a retrier to the retry list of this state
     * @internal
     */
    _addRetry(props = {}) {
        validateErrors(props.errors);
        this.retries.push({
            ...props,
            errors: props.errors ?? [types_1.Errors.ALL],
        });
    }
    /**
     * Add an error handler to the catch list of this state
     * @internal
     */
    _addCatch(handler, props = {}) {
        validateErrors(props.errors);
        this.catches.push({
            next: handler,
            props: {
                errors: props.errors ?? [types_1.Errors.ALL],
                resultPath: props.resultPath,
            },
        });
        handler.addIncoming(this);
        if (this.containingGraph) {
            handler.bindToGraph(this.containingGraph);
        }
    }
    /**
     * Make the indicated state the default transition of this state
     */
    makeNext(next) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_stepfunctions_State(next);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.makeNext);
            }
            throw error;
        }
        // Can't be called 'setNext' because of JSII
        if (this._next) {
            throw new Error(`State '${this.id}' already has a next state`);
        }
        this._next = next;
        next.addIncoming(this);
        if (this.containingGraph) {
            next.bindToGraph(this.containingGraph);
        }
    }
    /**
     * Add a choice branch to this state
     */
    addChoice(condition, next) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_stepfunctions_Condition(condition);
            jsiiDeprecationWarnings._aws_cdk_aws_stepfunctions_State(next);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.addChoice);
            }
            throw error;
        }
        this.choices.push({ condition, next });
        next.startState.addIncoming(this);
        if (this.containingGraph) {
            next.startState.bindToGraph(this.containingGraph);
        }
    }
    /**
     * Add a paralle branch to this state
     */
    addBranch(branch) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_stepfunctions_StateGraph(branch);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.addBranch);
            }
            throw error;
        }
        this.branches.push(branch);
        if (this.containingGraph) {
            branch.registerSuperGraph(this.containingGraph);
        }
    }
    /**
     * Add a map iterator to this state
     */
    addIterator(iteration) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_stepfunctions_StateGraph(iteration);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.addIterator);
            }
            throw error;
        }
        this.iteration = iteration;
        if (this.containingGraph) {
            iteration.registerSuperGraph(this.containingGraph);
        }
    }
    /**
     * Make the indicated state the default choice transition of this state
     */
    makeDefault(def) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_stepfunctions_State(def);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.makeDefault);
            }
            throw error;
        }
        // Can't be called 'setDefault' because of JSII
        if (this.defaultChoice) {
            throw new Error(`Choice '${this.id}' already has a default next state`);
        }
        this.defaultChoice = def;
    }
    /**
     * Render the default next state in ASL JSON format
     */
    renderNextEnd() {
        if (this._next) {
            return { Next: this._next.stateId };
        }
        else {
            return { End: true };
        }
    }
    /**
     * Render the choices in ASL JSON format
     */
    renderChoices() {
        return {
            Choices: renderList(this.choices, renderChoice),
            Default: this.defaultChoice?.stateId,
        };
    }
    /**
     * Render InputPath/Parameters/OutputPath in ASL JSON format
     */
    renderInputOutput() {
        return {
            InputPath: renderJsonPath(this.inputPath),
            Parameters: this.parameters,
            OutputPath: renderJsonPath(this.outputPath),
        };
    }
    /**
     * Render parallel branches in ASL JSON format
     */
    renderBranches() {
        return {
            Branches: this.branches.map(b => b.toGraphJson()),
        };
    }
    /**
     * Render map iterator in ASL JSON format
     */
    renderIterator() {
        if (!this.iteration) {
            throw new Error('Iterator must not be undefined !');
        }
        return {
            Iterator: this.iteration.toGraphJson(),
        };
    }
    /**
     * Render error recovery options in ASL JSON format
     */
    renderRetryCatch() {
        return {
            Retry: renderList(this.retries, renderRetry, (a, b) => compareErrors(a.errors, b.errors)),
            Catch: renderList(this.catches, renderCatch, (a, b) => compareErrors(a.props.errors, b.props.errors)),
        };
    }
    /**
     * Render ResultSelector in ASL JSON format
     */
    renderResultSelector() {
        return fields_1.FieldUtils.renderObject({
            ResultSelector: this.resultSelector,
        });
    }
    /**
     * Called whenever this state is bound to a graph
     *
     * Can be overridden by subclasses.
     */
    whenBoundToGraph(graph) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_stepfunctions_StateGraph(graph);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.whenBoundToGraph);
            }
            throw error;
        }
        graph.registerState(this);
    }
    /**
     * Add a state to the incoming list
     */
    addIncoming(source) {
        this.incomingStates.push(source);
    }
    /**
     * Return all states this state can transition to
     */
    outgoingTransitions(options) {
        const ret = new Array();
        if (this._next) {
            ret.push(this._next);
        }
        if (this.defaultChoice) {
            ret.push(this.defaultChoice);
        }
        for (const c of this.choices) {
            ret.push(c.next);
        }
        if (options.includeErrorHandlers) {
            for (const c of this.catches) {
                ret.push(c.next);
            }
        }
        return ret;
    }
}
exports.State = State;
_a = JSII_RTTI_SYMBOL_1;
State[_a] = { fqn: "@aws-cdk/aws-stepfunctions.State", version: "0.0.0" };
/**
 * Render a choice transition
 */
function renderChoice(c) {
    return {
        ...c.condition.renderCondition(),
        Next: c.next.stateId,
    };
}
/**
 * Render a Retry object to ASL
 */
function renderRetry(retry) {
    return {
        ErrorEquals: retry.errors,
        IntervalSeconds: retry.interval && retry.interval.toSeconds(),
        MaxAttempts: retry.maxAttempts,
        BackoffRate: retry.backoffRate,
    };
}
/**
 * Render a Catch object to ASL
 */
function renderCatch(c) {
    return {
        ErrorEquals: c.props.errors,
        ResultPath: renderJsonPath(c.props.resultPath),
        Next: c.next.stateId,
    };
}
/**
 * Compares a list of Errors to move Errors.ALL last in a sort function
 */
function compareErrors(a, b) {
    if (a?.includes(types_1.Errors.ALL)) {
        return 1;
    }
    if (b?.includes(types_1.Errors.ALL)) {
        return -1;
    }
    return 0;
}
/**
 * Validates an errors list
 */
function validateErrors(errors) {
    if (errors?.includes(types_1.Errors.ALL) && errors.length > 1) {
        throw new Error(`${types_1.Errors.ALL} must appear alone in an error list`);
    }
}
/**
 * Render a list or return undefined for an empty list
 */
function renderList(xs, mapFn, sortFn) {
    if (xs.length === 0) {
        return undefined;
    }
    let list = xs;
    if (sortFn) {
        list = xs.sort(sortFn);
    }
    return list.map(mapFn);
}
exports.renderList = renderList;
/**
 * Render JSON path, respecting the special value DISCARD
 */
function renderJsonPath(jsonPath) {
    if (jsonPath === undefined) {
        return undefined;
    }
    if (jsonPath === fields_1.JsonPath.DISCARD) {
        return null;
    }
    if (!jsonPath.startsWith('$')) {
        throw new Error(`Expected JSON path to start with '$', got: ${jsonPath}`);
    }
    return jsonPath;
}
exports.renderJsonPath = renderJsonPath;
/**
 * Whether an object is a Prefixable
 */
function isPrefixable(x) {
    return typeof (x) === 'object' && x.addPrefix;
}
/**
 * Whether an object is INextable
 */
function isNextable(x) {
    return typeof (x) === 'object' && x.next;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhdGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzdGF0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSwyQ0FBeUQ7QUFFekQsc0NBQWlEO0FBRWpELG9DQUFpRjtBQW9FakY7O0dBRUc7QUFDSCxNQUFzQixLQUFNLFNBQVEsc0JBQVM7SUFtSDNDLFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBaUI7UUFDekQsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztRQTdCQSxhQUFRLEdBQWlCLEVBQUUsQ0FBQztRQVM5QixZQUFPLEdBQWlCLEVBQUUsQ0FBQztRQUMzQixZQUFPLEdBQXNCLEVBQUUsQ0FBQztRQUNoQyxZQUFPLEdBQXVCLEVBQUUsQ0FBQztRQUNqQyxhQUFRLEdBQWEsRUFBRSxDQUFDO1FBU3pDOzs7O1dBSUc7UUFDYyxtQkFBYyxHQUFZLEVBQUUsQ0FBQzs7Ozs7OytDQWpIMUIsS0FBSzs7OztRQXNIdkIsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7UUFFdkIsSUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDO1FBQzdCLElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDLFNBQVMsQ0FBQztRQUNqQyxJQUFJLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQyxVQUFVLENBQUM7UUFDbkMsSUFBSSxDQUFDLFVBQVUsR0FBRyxLQUFLLENBQUMsVUFBVSxDQUFDO1FBQ25DLElBQUksQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDLFVBQVUsQ0FBQztRQUNuQyxJQUFJLENBQUMsY0FBYyxHQUFHLEtBQUssQ0FBQyxjQUFjLENBQUM7UUFFM0MsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsRUFBRSxRQUFRLEVBQUUsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxFQUFFLENBQUMsQ0FBQztLQUNuRTtJQS9IRDs7T0FFRztJQUNJLE1BQU0sQ0FBQyxZ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S0FBRTtJQUNqRCxJQUFJLFFBQVEsS0FBSyxpQkFBUSxDQUFDLE9BQU8sRUFBRTtRQUFFLE9BQU8sSUFBSSxDQUFDO0tBQUU7SUFFbkQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLEVBQUU7UUFDN0IsTUFBTSxJQUFJLEtBQUssQ0FBQyw4Q0FBOEMsUUFBUSxFQUFFLENBQUMsQ0FBQztLQUMzRTtJQUNELE9BQU8sUUFBUSxDQUFDO0FBQ2xCLENBQUM7QUFSRCx3Q0FRQztBQVNEOztHQUVHO0FBQ0gsU0FBUyxZQUFZLENBQUMsQ0FBTTtJQUMxQixPQUFPLE9BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxRQUFRLElBQUksQ0FBQyxDQUFDLFNBQVMsQ0FBQztBQUMvQyxDQUFDO0FBRUQ7O0dBRUc7QUFDSCxTQUFTLFVBQVUsQ0FBQyxDQUFNO0lBQ3hCLE9BQU8sT0FBTSxDQUFDLENBQUMsQ0FBQyxLQUFLLFFBQVEsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDO0FBQzFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJQ29uc3RydWN0LCBDb25zdHJ1Y3QsIE5vZGUgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCB7IENvbmRpdGlvbiB9IGZyb20gJy4uL2NvbmRpdGlvbic7XG5pbXBvcnQgeyBGaWVsZFV0aWxzLCBKc29uUGF0aCB9IGZyb20gJy4uL2ZpZWxkcyc7XG5pbXBvcnQgeyBTdGF0ZUdyYXBoIH0gZnJvbSAnLi4vc3RhdGUtZ3JhcGgnO1xuaW1wb3J0IHsgQ2F0Y2hQcm9wcywgRXJyb3JzLCBJQ2hhaW5hYmxlLCBJTmV4dGFibGUsIFJldHJ5UHJvcHMgfSBmcm9tICcuLi90eXBlcyc7XG5cbi8qKlxuICogUHJvcGVydGllcyBzaGFyZWQgYnkgYWxsIHN0YXRlc1xuICovXG5leHBvcnQgaW50ZXJmYWNlIFN0YXRlUHJvcHMge1xuICAvKipcbiAgICogQSBjb21tZW50IGRlc2NyaWJpbmcgdGhpcyBzdGF0ZVxuICAgKlxuICAgKiBAZGVmYXVsdCBObyBjb21tZW50XG4gICAqL1xuICByZWFkb25seSBjb21tZW50Pzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBKU09OUGF0aCBleHByZXNzaW9uIHRvIHNlbGVjdCBwYXJ0IG9mIHRoZSBzdGF0ZSB0byBiZSB0aGUgaW5wdXQgdG8gdGhpcyBzdGF0ZS5cbiAgICpcbiAgICogTWF5IGFsc28gYmUgdGhlIHNwZWNpYWwgdmFsdWUgSnNvblBhdGguRElTQ0FSRCwgd2hpY2ggd2lsbCBjYXVzZSB0aGUgZWZmZWN0aXZlXG4gICAqIGlucHV0IHRvIGJlIHRoZSBlbXB0eSBvYmplY3Qge30uXG4gICAqXG4gICAqIEBkZWZhdWx0ICRcbiAgICovXG4gIHJlYWRvbmx5IGlucHV0UGF0aD86IHN0cmluZztcblxuICAvKipcbiAgICogUGFyYW1ldGVycyBwYXNzIGEgY29sbGVjdGlvbiBvZiBrZXktdmFsdWUgcGFpcnMsIGVpdGhlciBzdGF0aWMgdmFsdWVzIG9yIEpTT05QYXRoIGV4cHJlc3Npb25zIHRoYXQgc2VsZWN0IGZyb20gdGhlIGlucHV0LlxuICAgKlxuICAgKiBAc2VlXG4gICAqIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9zdGVwLWZ1bmN0aW9ucy9sYXRlc3QvZGcvaW5wdXQtb3V0cHV0LWlucHV0cGF0aC1wYXJhbXMuaHRtbCNpbnB1dC1vdXRwdXQtcGFyYW1ldGVyc1xuICAgKlxuICAgKiBAZGVmYXVsdCBObyBwYXJhbWV0ZXJzXG4gICAqL1xuICByZWFkb25seSBwYXJhbWV0ZXJzPzogeyBbbmFtZTogc3RyaW5nXTogYW55IH07XG5cbiAgLyoqXG4gICAqIEpTT05QYXRoIGV4cHJlc3Npb24gdG8gc2VsZWN0IHBhcnQgb2YgdGhlIHN0YXRlIHRvIGJlIHRoZSBvdXRwdXQgdG8gdGhpcyBzdGF0ZS5cbiAgICpcbiAgICogTWF5IGFsc28gYmUgdGhlIHNwZWNpYWwgdmFsdWUgSnNvblBhdGguRElTQ0FSRCwgd2hpY2ggd2lsbCBjYXVzZSB0aGUgZWZmZWN0aXZlXG4gICAqIG91dHB1dCB0byBiZSB0aGUgZW1wdHkgb2JqZWN0IHt9LlxuICAgKlxuICAgKiBAZGVmYXVsdCAkXG4gICAqL1xuICByZWFkb25seSBvdXRwdXRQYXRoPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBKU09OUGF0aCBleHByZXNzaW9uIHRvIGluZGljYXRlIHdoZXJlIHRvIGluamVjdCB0aGUgc3RhdGUncyBvdXRwdXRcbiAgICpcbiAgICogTWF5IGFsc28gYmUgdGhlIHNwZWNpYWwgdmFsdWUgSnNvblBhdGguRElTQ0FSRCwgd2hpY2ggd2lsbCBjYXVzZSB0aGUgc3RhdGUnc1xuICAgKiBpbnB1dCB0byBiZWNvbWUgaXRzIG91dHB1dC5cbiAgICpcbiAgICogQGRlZmF1bHQgJFxuICAgKi9cbiAgcmVhZG9ubHkgcmVzdWx0UGF0aD86IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIEpTT04gdGhhdCB3aWxsIHJlcGxhY2UgdGhlIHN0YXRlJ3MgcmF3IHJlc3VsdCBhbmQgYmVjb21lIHRoZSBlZmZlY3RpdmVcbiAgICogcmVzdWx0IGJlZm9yZSBSZXN1bHRQYXRoIGlzIGFwcGxpZWQuXG4gICAqXG4gICAqIFlvdSBjYW4gdXNlIFJlc3VsdFNlbGVjdG9yIHRvIGNyZWF0ZSBhIHBheWxvYWQgd2l0aCB2YWx1ZXMgdGhhdCBhcmUgc3RhdGljXG4gICAqIG9yIHNlbGVjdGVkIGZyb20gdGhlIHN0YXRlJ3MgcmF3IHJlc3VsdC5cbiAgICpcbiAgICogQHNlZVxuICAgKiBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vc3RlcC1mdW5jdGlvbnMvbGF0ZXN0L2RnL2lucHV0LW91dHB1dC1pbnB1dHBhdGgtcGFyYW1zLmh0bWwjaW5wdXQtb3V0cHV0LXJlc3VsdHNlbGVjdG9yXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gTm9uZVxuICAgKi9cbiAgcmVhZG9ubHkgcmVzdWx0U2VsZWN0b3I/OiB7IFtrZXk6IHN0cmluZ106IGFueSB9O1xufVxuXG4vKipcbiAqIEJhc2UgY2xhc3MgZm9yIGFsbCBvdGhlciBzdGF0ZSBjbGFzc2VzXG4gKi9cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBTdGF0ZSBleHRlbmRzIENvbnN0cnVjdCBpbXBsZW1lbnRzIElDaGFpbmFibGUge1xuICAvKipcbiAgICogQWRkIGEgcHJlZml4IHRvIHRoZSBzdGF0ZUlkIG9mIGFsbCBTdGF0ZXMgZm91bmQgaW4gYSBjb25zdHJ1Y3QgdHJlZVxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBwcmVmaXhTdGF0ZXMocm9vdDogSUNvbnN0cnVjdCwgcHJlZml4OiBzdHJpbmcpIHtcbiAgICBjb25zdCBxdWV1ZSA9IFtyb290XTtcbiAgICB3aGlsZSAocXVldWUubGVuZ3RoID4gMCkge1xuICAgICAgY29uc3QgZWwgPSBxdWV1ZS5zcGxpY2UoMCwgMSlbMF0hO1xuICAgICAgaWYgKGlzUHJlZml4YWJsZShlbCkpIHtcbiAgICAgICAgZWwuYWRkUHJlZml4KHByZWZpeCk7XG4gICAgICB9XG4gICAgICBxdWV1ZS5wdXNoKC4uLk5vZGUub2YoZWwpLmNoaWxkcmVuKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogRmluZCB0aGUgc2V0IG9mIHN0YXRlcyByZWFjaGFibGUgdGhyb3VnaCB0cmFuc2l0aW9ucyBmcm9tIHRoZSBnaXZlbiBzdGFydCBzdGF0ZS5cbiAgICogVGhpcyBkb2VzIG5vdCByZXRyaWV2ZSBzdGF0ZXMgZnJvbSB3aXRoaW4gc3ViLWdyYXBocywgc3VjaCBhcyBzdGF0ZXMgd2l0aGluIGEgUGFyYWxsZWwgc3RhdGUncyBicmFuY2guXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGZpbmRSZWFjaGFibGVTdGF0ZXMoc3RhcnQ6IFN0YXRlLCBvcHRpb25zOiBGaW5kU3RhdGVPcHRpb25zID0ge30pOiBTdGF0ZVtdIHtcbiAgICBjb25zdCB2aXNpdGVkID0gbmV3IFNldDxTdGF0ZT4oKTtcbiAgICBjb25zdCByZXQgPSBuZXcgU2V0PFN0YXRlPigpO1xuICAgIGNvbnN0IHF1ZXVlID0gW3N0YXJ0XTtcbiAgICB3aGlsZSAocXVldWUubGVuZ3RoID4gMCkge1xuICAgICAgY29uc3Qgc3RhdGUgPSBxdWV1ZS5zcGxpY2UoMCwgMSlbMF0hO1xuICAgICAgaWYgKHZpc2l0ZWQuaGFzKHN0YXRlKSkgeyBjb250aW51ZTsgfVxuICAgICAgdmlzaXRlZC5hZGQoc3RhdGUpO1xuICAgICAgY29uc3Qgb3V0Z29pbmcgPSBzdGF0ZS5vdXRnb2luZ1RyYW5zaXRpb25zKG9wdGlvbnMpO1xuICAgICAgcXVldWUucHVzaCguLi5vdXRnb2luZyk7XG4gICAgICByZXQuYWRkKHN0YXRlKTtcbiAgICB9XG4gICAgcmV0dXJuIEFycmF5LmZyb20ocmV0KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBGaW5kIHRoZSBzZXQgb2YgZW5kIHN0YXRlcyBzdGF0ZXMgcmVhY2hhYmxlIHRocm91Z2ggdHJhbnNpdGlvbnMgZnJvbSB0aGUgZ2l2ZW4gc3RhcnQgc3RhdGVcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZmluZFJlYWNoYWJsZUVuZFN0YXRlcyhzdGFydDogU3RhdGUsIG9wdGlvbnM6IEZpbmRTdGF0ZU9wdGlvbnMgPSB7fSk6IFN0YXRlW10ge1xuICAgIGNvbnN0IHZpc2l0ZWQgPSBuZXcgU2V0PFN0YXRlPigpO1xuICAgIGNvbnN0IHJldCA9IG5ldyBTZXQ8U3RhdGU+KCk7XG4gICAgY29uc3QgcXVldWUgPSBbc3RhcnRdO1xuICAgIHdoaWxlIChxdWV1ZS5sZW5ndGggPiAwKSB7XG4gICAgICBjb25zdCBzdGF0ZSA9IHF1ZXVlLnNwbGljZSgwLCAxKVswXSE7XG4gICAgICBpZiAodmlzaXRlZC5oYXMoc3RhdGUpKSB7IGNvbnRpbnVlOyB9XG4gICAgICB2aXNpdGVkLmFkZChzdGF0ZSk7XG5cbiAgICAgIGNvbnN0IG91dGdvaW5nID0gc3RhdGUub3V0Z29pbmdUcmFuc2l0aW9ucyhvcHRpb25zKTtcblxuICAgICAgaWYgKG91dGdvaW5nLmxlbmd0aCA+IDApIHtcbiAgICAgICAgLy8gV2UgY2FuIGNvbnRpbnVlXG4gICAgICAgIHF1ZXVlLnB1c2goLi4ub3V0Z29pbmcpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gVGVybWluYWwgc3RhdGVcbiAgICAgICAgcmV0LmFkZChzdGF0ZSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBBcnJheS5mcm9tKHJldCk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJuIG9ubHkgdGhlIHN0YXRlcyB0aGF0IGFsbG93IGNoYWluaW5nIGZyb20gYW4gYXJyYXkgb2Ygc3RhdGVzXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGZpbHRlck5leHRhYmxlcyhzdGF0ZXM6IFN0YXRlW10pOiBJTmV4dGFibGVbXSB7XG4gICAgcmV0dXJuIHN0YXRlcy5maWx0ZXIoaXNOZXh0YWJsZSkgYXMgYW55O1xuICB9XG5cbiAgLyoqXG4gICAqIEZpcnN0IHN0YXRlIG9mIHRoaXMgQ2hhaW5hYmxlXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgc3RhcnRTdGF0ZTogU3RhdGU7XG5cbiAgLyoqXG4gICAqIENvbnRpbnVhYmxlIHN0YXRlcyBvZiB0aGlzIENoYWluYWJsZVxuICAgKi9cbiAgcHVibGljIGFic3RyYWN0IHJlYWRvbmx5IGVuZFN0YXRlczogSU5leHRhYmxlW107XG5cbiAgLy8gVGhpcyBjbGFzcyBoYXMgYSBzdXBlcnNldCBvZiBtb3N0IG9mIHRoZSBmZWF0dXJlcyBvZiB0aGUgb3RoZXIgc3RhdGVzLFxuICAvLyBhbmQgdGhlIHN1YmNsYXNzZXMgZGVjaWRlIHdoaWNoIHBhcnQgb2YgdGhlIGZlYXR1cmVzIHRvIGV4cG9zZS4gTW9zdFxuICAvLyBmZWF0dXJlcyBhcmUgc2hhcmVkIGJ5IGEgY291cGxlIG9mIHN0YXRlcywgYW5kIGl0IGJlY29tZXMgY3VtYmVyc29tZSB0b1xuICAvLyBzbGljZSBpdCBvdXQgYWNyb3NzIGFsbCBzdGF0ZXMuIFRoaXMgaXMgbm90IGdyZWF0IGRlc2lnbiwgYnV0IGl0IGlzXG4gIC8vIHByYWdtYXRpYyFcbiAgcHJvdGVjdGVkIHJlYWRvbmx5IGNvbW1lbnQ/OiBzdHJpbmc7XG4gIHByb3RlY3RlZCByZWFkb25seSBpbnB1dFBhdGg/OiBzdHJpbmc7XG4gIHByb3RlY3RlZCByZWFkb25seSBwYXJhbWV0ZXJzPzogb2JqZWN0O1xuICBwcm90ZWN0ZWQgcmVhZG9ubHkgb3V0cHV0UGF0aD86IHN0cmluZztcbiAgcHJvdGVjdGVkIHJlYWRvbmx5IHJlc3VsdFBhdGg/OiBzdHJpbmc7XG4gIHByb3RlY3RlZCByZWFkb25seSByZXN1bHRTZWxlY3Rvcj86IG9iamVjdDtcbiAgcHJvdGVjdGVkIHJlYWRvbmx5IGJyYW5jaGVzOiBTdGF0ZUdyYXBoW10gPSBbXTtcbiAgcHJvdGVjdGVkIGl0ZXJhdGlvbj86IFN0YXRlR3JhcGg7XG4gIHByb3RlY3RlZCBkZWZhdWx0Q2hvaWNlPzogU3RhdGU7XG5cbiAgLyoqXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgcHJvdGVjdGVkIF9uZXh0PzogU3RhdGU7XG5cbiAgcHJpdmF0ZSByZWFkb25seSByZXRyaWVzOiBSZXRyeVByb3BzW10gPSBbXTtcbiAgcHJpdmF0ZSByZWFkb25seSBjYXRjaGVzOiBDYXRjaFRyYW5zaXRpb25bXSA9IFtdO1xuICBwcml2YXRlIHJlYWRvbmx5IGNob2ljZXM6IENob2ljZVRyYW5zaXRpb25bXSA9IFtdO1xuICBwcml2YXRlIHJlYWRvbmx5IHByZWZpeGVzOiBzdHJpbmdbXSA9IFtdO1xuXG4gIC8qKlxuICAgKiBUaGUgZ3JhcGggdGhhdCB0aGlzIHN0YXRlIGlzIHBhcnQgb2YuXG4gICAqXG4gICAqIFVzZWQgZm9yIGd1YXJhbnRlZWluZyBjb25zaXN0ZW5jeSBiZXR3ZWVuIGdyYXBocyBhbmQgZ3JhcGggY29tcG9uZW50cy5cbiAgICovXG4gIHByaXZhdGUgY29udGFpbmluZ0dyYXBoPzogU3RhdGVHcmFwaDtcblxuICAvKipcbiAgICogU3RhdGVzIHdpdGggcmVmZXJlbmNlcyB0byB0aGlzIHN0YXRlLlxuICAgKlxuICAgKiBVc2VkIGZvciBmaW5kaW5nIGNvbXBsZXRlIGNvbm5lY3RlZCBncmFwaCB0aGF0IGEgc3RhdGUgaXMgcGFydCBvZi5cbiAgICovXG4gIHByaXZhdGUgcmVhZG9ubHkgaW5jb21pbmdTdGF0ZXM6IFN0YXRlW10gPSBbXTtcblxuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogU3RhdGVQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCk7XG5cbiAgICB0aGlzLnN0YXJ0U3RhdGUgPSB0aGlzO1xuXG4gICAgdGhpcy5jb21tZW50ID0gcHJvcHMuY29tbWVudDtcbiAgICB0aGlzLmlucHV0UGF0aCA9IHByb3BzLmlucHV0UGF0aDtcbiAgICB0aGlzLnBhcmFtZXRlcnMgPSBwcm9wcy5wYXJhbWV0ZXJzO1xuICAgIHRoaXMub3V0cHV0UGF0aCA9IHByb3BzLm91dHB1dFBhdGg7XG4gICAgdGhpcy5yZXN1bHRQYXRoID0gcHJvcHMucmVzdWx0UGF0aDtcbiAgICB0aGlzLnJlc3VsdFNlbGVjdG9yID0gcHJvcHMucmVzdWx0U2VsZWN0b3I7XG5cbiAgICB0aGlzLm5vZGUuYWRkVmFsaWRhdGlvbih7IHZhbGlkYXRlOiAoKSA9PiB0aGlzLnZhbGlkYXRlU3RhdGUoKSB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBbGxvd3MgdGhlIHN0YXRlIHRvIHZhbGlkYXRlIGl0c2VsZi5cbiAgICovXG4gIHByb3RlY3RlZCB2YWxpZGF0ZVN0YXRlKCk6IHN0cmluZ1tdIHtcbiAgICByZXR1cm4gW107XG4gIH1cblxuICBwdWJsaWMgZ2V0IGlkKCkge1xuICAgIHJldHVybiB0aGlzLm5vZGUuaWQ7XG4gIH1cblxuICAvKipcbiAgICogVG9rZW5pemVkIHN0cmluZyB0aGF0IGV2YWx1YXRlcyB0byB0aGUgc3RhdGUncyBJRFxuICAgKi9cbiAgcHVibGljIGdldCBzdGF0ZUlkKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMucHJlZml4ZXMuY29uY2F0KHRoaXMuaWQpLmpvaW4oJycpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBhIHByZWZpeCB0byB0aGUgc3RhdGVJZCBvZiB0aGlzIHN0YXRlXG4gICAqL1xuICBwdWJsaWMgYWRkUHJlZml4KHg6IHN0cmluZykge1xuICAgIGlmICh4ICE9PSAnJykge1xuICAgICAgdGhpcy5wcmVmaXhlcy5zcGxpY2UoMCwgMCwgeCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVyIHRoaXMgc3RhdGUgYXMgcGFydCBvZiB0aGUgZ2l2ZW4gZ3JhcGhcbiAgICpcbiAgICogRG9uJ3QgY2FsbCB0aGlzLiBJdCB3aWxsIGJlIGNhbGxlZCBhdXRvbWF0aWNhbGx5IHdoZW4geW91IHdvcmtcbiAgICogd2l0aCBzdGF0ZXMgbm9ybWFsbHkuXG4gICAqL1xuICBwdWJsaWMgYmluZFRvR3JhcGgoZ3JhcGg6IFN0YXRlR3JhcGgpIHtcbiAgICBpZiAodGhpcy5jb250YWluaW5nR3JhcGggPT09IGdyYXBoKSB7IHJldHVybjsgfVxuXG4gICAgaWYgKHRoaXMuY29udGFpbmluZ0dyYXBoKSB7XG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbWF4LWxlblxuICAgICAgdGhyb3cgbmV3IEVycm9yKGBUcnlpbmcgdG8gdXNlIHN0YXRlICcke3RoaXMuc3RhdGVJZH0nIGluICR7Z3JhcGh9LCBidXQgaXMgYWxyZWFkeSBpbiAke3RoaXMuY29udGFpbmluZ0dyYXBofS4gRXZlcnkgc3RhdGUgY2FuIG9ubHkgYmUgdXNlZCBpbiBvbmUgZ3JhcGguYCk7XG4gICAgfVxuXG4gICAgdGhpcy5jb250YWluaW5nR3JhcGggPSBncmFwaDtcbiAgICB0aGlzLndoZW5Cb3VuZFRvR3JhcGgoZ3JhcGgpO1xuXG4gICAgZm9yIChjb25zdCBpbmNvbWluZyBvZiB0aGlzLmluY29taW5nU3RhdGVzKSB7XG4gICAgICBpbmNvbWluZy5iaW5kVG9HcmFwaChncmFwaCk7XG4gICAgfVxuICAgIGZvciAoY29uc3Qgb3V0Z29pbmcgb2YgdGhpcy5vdXRnb2luZ1RyYW5zaXRpb25zKHsgaW5jbHVkZUVycm9ySGFuZGxlcnM6IHRydWUgfSkpIHtcbiAgICAgIG91dGdvaW5nLmJpbmRUb0dyYXBoKGdyYXBoKTtcbiAgICB9XG4gICAgZm9yIChjb25zdCBicmFuY2ggb2YgdGhpcy5icmFuY2hlcykge1xuICAgICAgYnJhbmNoLnJlZ2lzdGVyU3VwZXJHcmFwaCh0aGlzLmNvbnRhaW5pbmdHcmFwaCk7XG4gICAgfVxuICAgIGlmICghIXRoaXMuaXRlcmF0aW9uKSB7XG4gICAgICB0aGlzLml0ZXJhdGlvbi5yZWdpc3RlclN1cGVyR3JhcGgodGhpcy5jb250YWluaW5nR3JhcGgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZW5kZXIgdGhlIHN0YXRlIGFzIEpTT05cbiAgICovXG4gIHB1YmxpYyBhYnN0cmFjdCB0b1N0YXRlSnNvbigpOiBvYmplY3Q7XG5cbiAgLyoqXG4gICAqIEFkZCBhIHJldHJpZXIgdG8gdGhlIHJldHJ5IGxpc3Qgb2YgdGhpcyBzdGF0ZVxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIHByb3RlY3RlZCBfYWRkUmV0cnkocHJvcHM6IFJldHJ5UHJvcHMgPSB7fSkge1xuICAgIHZhbGlkYXRlRXJyb3JzKHByb3BzLmVycm9ycyk7XG5cbiAgICB0aGlzLnJldHJpZXMucHVzaCh7XG4gICAgICAuLi5wcm9wcyxcbiAgICAgIGVycm9yczogcHJvcHMuZXJyb3JzID8/IFtFcnJvcnMuQUxMXSxcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgYW4gZXJyb3IgaGFuZGxlciB0byB0aGUgY2F0Y2ggbGlzdCBvZiB0aGlzIHN0YXRlXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgcHJvdGVjdGVkIF9hZGRDYXRjaChoYW5kbGVyOiBTdGF0ZSwgcHJvcHM6IENhdGNoUHJvcHMgPSB7fSkge1xuICAgIHZhbGlkYXRlRXJyb3JzKHByb3BzLmVycm9ycyk7XG5cbiAgICB0aGlzLmNhdGNoZXMucHVzaCh7XG4gICAgICBuZXh0OiBoYW5kbGVyLFxuICAgICAgcHJvcHM6IHtcbiAgICAgICAgZXJyb3JzOiBwcm9wcy5lcnJvcnMgPz8gW0Vycm9ycy5BTExdLFxuICAgICAgICByZXN1bHRQYXRoOiBwcm9wcy5yZXN1bHRQYXRoLFxuICAgICAgfSxcbiAgICB9KTtcbiAgICBoYW5kbGVyLmFkZEluY29taW5nKHRoaXMpO1xuICAgIGlmICh0aGlzLmNvbnRhaW5pbmdHcmFwaCkge1xuICAgICAgaGFuZGxlci5iaW5kVG9HcmFwaCh0aGlzLmNvbnRhaW5pbmdHcmFwaCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIE1ha2UgdGhlIGluZGljYXRlZCBzdGF0ZSB0aGUgZGVmYXVsdCB0cmFuc2l0aW9uIG9mIHRoaXMgc3RhdGVcbiAgICovXG4gIHByb3RlY3RlZCBtYWtlTmV4dChuZXh0OiBTdGF0ZSkge1xuICAgIC8vIENhbid0IGJlIGNhbGxlZCAnc2V0TmV4dCcgYmVjYXVzZSBvZiBKU0lJXG4gICAgaWYgKHRoaXMuX25leHQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgU3RhdGUgJyR7dGhpcy5pZH0nIGFscmVhZHkgaGFzIGEgbmV4dCBzdGF0ZWApO1xuICAgIH1cbiAgICB0aGlzLl9uZXh0ID0gbmV4dDtcbiAgICBuZXh0LmFkZEluY29taW5nKHRoaXMpO1xuICAgIGlmICh0aGlzLmNvbnRhaW5pbmdHcmFwaCkge1xuICAgICAgbmV4dC5iaW5kVG9HcmFwaCh0aGlzLmNvbnRhaW5pbmdHcmFwaCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBhIGNob2ljZSBicmFuY2ggdG8gdGhpcyBzdGF0ZVxuICAgKi9cbiAgcHJvdGVjdGVkIGFkZENob2ljZShjb25kaXRpb246IENvbmRpdGlvbiwgbmV4dDogU3RhdGUpIHtcbiAgICB0aGlzLmNob2ljZXMucHVzaCh7IGNvbmRpdGlvbiwgbmV4dCB9KTtcbiAgICBuZXh0LnN0YXJ0U3RhdGUuYWRkSW5jb21pbmcodGhpcyk7XG4gICAgaWYgKHRoaXMuY29udGFpbmluZ0dyYXBoKSB7XG4gICAgICBuZXh0LnN0YXJ0U3RhdGUuYmluZFRvR3JhcGgodGhpcy5jb250YWluaW5nR3JhcGgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgYSBwYXJhbGxlIGJyYW5jaCB0byB0aGlzIHN0YXRlXG4gICAqL1xuICBwcm90ZWN0ZWQgYWRkQnJhbmNoKGJyYW5jaDogU3RhdGVHcmFwaCkge1xuICAgIHRoaXMuYnJhbmNoZXMucHVzaChicmFuY2gpO1xuICAgIGlmICh0aGlzLmNvbnRhaW5pbmdHcmFwaCkge1xuICAgICAgYnJhbmNoLnJlZ2lzdGVyU3VwZXJHcmFwaCh0aGlzLmNvbnRhaW5pbmdHcmFwaCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBhIG1hcCBpdGVyYXRvciB0byB0aGlzIHN0YXRlXG4gICAqL1xuICBwcm90ZWN0ZWQgYWRkSXRlcmF0b3IoaXRlcmF0aW9uOiBTdGF0ZUdyYXBoKSB7XG4gICAgdGhpcy5pdGVyYXRpb24gPSBpdGVyYXRpb247XG4gICAgaWYgKHRoaXMuY29udGFpbmluZ0dyYXBoKSB7XG4gICAgICBpdGVyYXRpb24ucmVnaXN0ZXJTdXBlckdyYXBoKHRoaXMuY29udGFpbmluZ0dyYXBoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogTWFrZSB0aGUgaW5kaWNhdGVkIHN0YXRlIHRoZSBkZWZhdWx0IGNob2ljZSB0cmFuc2l0aW9uIG9mIHRoaXMgc3RhdGVcbiAgICovXG4gIHByb3RlY3RlZCBtYWtlRGVmYXVsdChkZWY6IFN0YXRlKSB7XG4gICAgLy8gQ2FuJ3QgYmUgY2FsbGVkICdzZXREZWZhdWx0JyBiZWNhdXNlIG9mIEpTSUlcbiAgICBpZiAodGhpcy5kZWZhdWx0Q2hvaWNlKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYENob2ljZSAnJHt0aGlzLmlkfScgYWxyZWFkeSBoYXMgYSBkZWZhdWx0IG5leHQgc3RhdGVgKTtcbiAgICB9XG4gICAgdGhpcy5kZWZhdWx0Q2hvaWNlID0gZGVmO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbmRlciB0aGUgZGVmYXVsdCBuZXh0IHN0YXRlIGluIEFTTCBKU09OIGZvcm1hdFxuICAgKi9cbiAgcHJvdGVjdGVkIHJlbmRlck5leHRFbmQoKTogYW55IHtcbiAgICBpZiAodGhpcy5fbmV4dCkge1xuICAgICAgcmV0dXJuIHsgTmV4dDogdGhpcy5fbmV4dC5zdGF0ZUlkIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB7IEVuZDogdHJ1ZSB9O1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZW5kZXIgdGhlIGNob2ljZXMgaW4gQVNMIEpTT04gZm9ybWF0XG4gICAqL1xuICBwcm90ZWN0ZWQgcmVuZGVyQ2hvaWNlcygpOiBhbnkge1xuICAgIHJldHVybiB7XG4gICAgICBDaG9pY2VzOiByZW5kZXJMaXN0KHRoaXMuY2hvaWNlcywgcmVuZGVyQ2hvaWNlKSxcbiAgICAgIERlZmF1bHQ6IHRoaXMuZGVmYXVsdENob2ljZT8uc3RhdGVJZCxcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbmRlciBJbnB1dFBhdGgvUGFyYW1ldGVycy9PdXRwdXRQYXRoIGluIEFTTCBKU09OIGZvcm1hdFxuICAgKi9cbiAgcHJvdGVjdGVkIHJlbmRlcklucHV0T3V0cHV0KCk6IGFueSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIElucHV0UGF0aDogcmVuZGVySnNvblBhdGgodGhpcy5pbnB1dFBhdGgpLFxuICAgICAgUGFyYW1ldGVyczogdGhpcy5wYXJhbWV0ZXJzLFxuICAgICAgT3V0cHV0UGF0aDogcmVuZGVySnNvblBhdGgodGhpcy5vdXRwdXRQYXRoKSxcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbmRlciBwYXJhbGxlbCBicmFuY2hlcyBpbiBBU0wgSlNPTiBmb3JtYXRcbiAgICovXG4gIHByb3RlY3RlZCByZW5kZXJCcmFuY2hlcygpOiBhbnkge1xuICAgIHJldHVybiB7XG4gICAgICBCcmFuY2hlczogdGhpcy5icmFuY2hlcy5tYXAoYiA9PiBiLnRvR3JhcGhKc29uKCkpLFxuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogUmVuZGVyIG1hcCBpdGVyYXRvciBpbiBBU0wgSlNPTiBmb3JtYXRcbiAgICovXG4gIHByb3RlY3RlZCByZW5kZXJJdGVyYXRvcigpOiBhbnkge1xuICAgIGlmICghdGhpcy5pdGVyYXRpb24pIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignSXRlcmF0b3IgbXVzdCBub3QgYmUgdW5kZWZpbmVkICEnKTtcbiAgICB9XG4gICAgcmV0dXJuIHtcbiAgICAgIEl0ZXJhdG9yOiB0aGlzLml0ZXJhdGlvbi50b0dyYXBoSnNvbigpLFxuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogUmVuZGVyIGVycm9yIHJlY292ZXJ5IG9wdGlvbnMgaW4gQVNMIEpTT04gZm9ybWF0XG4gICAqL1xuICBwcm90ZWN0ZWQgcmVuZGVyUmV0cnlDYXRjaCgpOiBhbnkge1xuICAgIHJldHVybiB7XG4gICAgICBSZXRyeTogcmVuZGVyTGlzdCh0aGlzLnJldHJpZXMsIHJlbmRlclJldHJ5LCAoYSwgYikgPT4gY29tcGFyZUVycm9ycyhhLmVycm9ycywgYi5lcnJvcnMpKSxcbiAgICAgIENhdGNoOiByZW5kZXJMaXN0KHRoaXMuY2F0Y2hlcywgcmVuZGVyQ2F0Y2gsIChhLCBiKSA9PiBjb21wYXJlRXJyb3JzKGEucHJvcHMuZXJyb3JzLCBiLnByb3BzLmVycm9ycykpLFxuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogUmVuZGVyIFJlc3VsdFNlbGVjdG9yIGluIEFTTCBKU09OIGZvcm1hdFxuICAgKi9cbiAgcHJvdGVjdGVkIHJlbmRlclJlc3VsdFNlbGVjdG9yKCk6IGFueSB7XG4gICAgcmV0dXJuIEZpZWxkVXRpbHMucmVuZGVyT2JqZWN0KHtcbiAgICAgIFJlc3VsdFNlbGVjdG9yOiB0aGlzLnJlc3VsdFNlbGVjdG9yLFxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIENhbGxlZCB3aGVuZXZlciB0aGlzIHN0YXRlIGlzIGJvdW5kIHRvIGEgZ3JhcGhcbiAgICpcbiAgICogQ2FuIGJlIG92ZXJyaWRkZW4gYnkgc3ViY2xhc3Nlcy5cbiAgICovXG4gIHByb3RlY3RlZCB3aGVuQm91bmRUb0dyYXBoKGdyYXBoOiBTdGF0ZUdyYXBoKSB7XG4gICAgZ3JhcGgucmVnaXN0ZXJTdGF0ZSh0aGlzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgYSBzdGF0ZSB0byB0aGUgaW5jb21pbmcgbGlzdFxuICAgKi9cbiAgcHJpdmF0ZSBhZGRJbmNvbWluZyhzb3VyY2U6IFN0YXRlKSB7XG4gICAgdGhpcy5pbmNvbWluZ1N0YXRlcy5wdXNoKHNvdXJjZSk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJuIGFsbCBzdGF0ZXMgdGhpcyBzdGF0ZSBjYW4gdHJhbnNpdGlvbiB0b1xuICAgKi9cbiAgcHJpdmF0ZSBvdXRnb2luZ1RyYW5zaXRpb25zKG9wdGlvbnM6IEZpbmRTdGF0ZU9wdGlvbnMpOiBTdGF0ZVtdIHtcbiAgICBjb25zdCByZXQgPSBuZXcgQXJyYXk8U3RhdGU+KCk7XG4gICAgaWYgKHRoaXMuX25leHQpIHsgcmV0LnB1c2godGhpcy5fbmV4dCk7IH1cbiAgICBpZiAodGhpcy5kZWZhdWx0Q2hvaWNlKSB7IHJldC5wdXNoKHRoaXMuZGVmYXVsdENob2ljZSk7IH1cbiAgICBmb3IgKGNvbnN0IGMgb2YgdGhpcy5jaG9pY2VzKSB7XG4gICAgICByZXQucHVzaChjLm5leHQpO1xuICAgIH1cbiAgICBpZiAob3B0aW9ucy5pbmNsdWRlRXJyb3JIYW5kbGVycykge1xuICAgICAgZm9yIChjb25zdCBjIG9mIHRoaXMuY2F0Y2hlcykge1xuICAgICAgICByZXQucHVzaChjLm5leHQpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmV0O1xuICB9XG59XG5cbi8qKlxuICogT3B0aW9ucyBmb3IgZmluZGluZyByZWFjaGFibGUgc3RhdGVzXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgRmluZFN0YXRlT3B0aW9ucyB7XG4gIC8qKlxuICAgKiBXaGV0aGVyIG9yIG5vdCB0byBmb2xsb3cgZXJyb3ItaGFuZGxpbmcgdHJhbnNpdGlvbnNcbiAgICpcbiAgICogQGRlZmF1bHQgZmFsc2VcbiAgICovXG4gIHJlYWRvbmx5IGluY2x1ZGVFcnJvckhhbmRsZXJzPzogYm9vbGVhbjtcbn1cblxuLyoqXG4gKiBBIENob2ljZSBUcmFuc2l0aW9uXG4gKi9cbmludGVyZmFjZSBDaG9pY2VUcmFuc2l0aW9uIHtcbiAgLyoqXG4gICAqIFN0YXRlIHRvIHRyYW5zaXRpb24gdG9cbiAgICovXG4gIG5leHQ6IFN0YXRlO1xuXG4gIC8qKlxuICAgKiBDb25kaXRpb24gZm9yIHRoaXMgdHJhbnNpdGlvblxuICAgKi9cbiAgY29uZGl0aW9uOiBDb25kaXRpb247XG59XG5cbi8qKlxuICogUmVuZGVyIGEgY2hvaWNlIHRyYW5zaXRpb25cbiAqL1xuZnVuY3Rpb24gcmVuZGVyQ2hvaWNlKGM6IENob2ljZVRyYW5zaXRpb24pIHtcbiAgcmV0dXJuIHtcbiAgICAuLi5jLmNvbmRpdGlvbi5yZW5kZXJDb25kaXRpb24oKSxcbiAgICBOZXh0OiBjLm5leHQuc3RhdGVJZCxcbiAgfTtcbn1cblxuLyoqXG4gKiBBIENhdGNoIFRyYW5zaXRpb25cbiAqL1xuaW50ZXJmYWNlIENhdGNoVHJhbnNpdGlvbiB7XG4gIC8qKlxuICAgKiBTdGF0ZSB0byB0cmFuc2l0aW9uIHRvXG4gICAqL1xuICBuZXh0OiBTdGF0ZTtcblxuICAvKipcbiAgICogQWRkaXRpb25hbCBwcm9wZXJ0aWVzIGZvciB0aGlzIHRyYW5zaXRpb25cbiAgICovXG4gIHByb3BzOiBDYXRjaFByb3BzO1xufVxuXG4vKipcbiAqIFJlbmRlciBhIFJldHJ5IG9iamVjdCB0byBBU0xcbiAqL1xuZnVuY3Rpb24gcmVuZGVyUmV0cnkocmV0cnk6IFJldHJ5UHJvcHMpIHtcbiAgcmV0dXJuIHtcbiAgICBFcnJvckVxdWFsczogcmV0cnkuZXJyb3JzLFxuICAgIEludGVydmFsU2Vjb25kczogcmV0cnkuaW50ZXJ2YWwgJiYgcmV0cnkuaW50ZXJ2YWwudG9TZWNvbmRzKCksXG4gICAgTWF4QXR0ZW1wdHM6IHJldHJ5Lm1heEF0dGVtcHRzLFxuICAgIEJhY2tvZmZSYXRlOiByZXRyeS5iYWNrb2ZmUmF0ZSxcbiAgfTtcbn1cblxuLyoqXG4gKiBSZW5kZXIgYSBDYXRjaCBvYmplY3QgdG8gQVNMXG4gKi9cbmZ1bmN0aW9uIHJlbmRlckNhdGNoKGM6IENhdGNoVHJhbnNpdGlvbikge1xuICByZXR1cm4ge1xuICAgIEVycm9yRXF1YWxzOiBjLnByb3BzLmVycm9ycyxcbiAgICBSZXN1bHRQYXRoOiByZW5kZXJKc29uUGF0aChjLnByb3BzLnJlc3VsdFBhdGgpLFxuICAgIE5leHQ6IGMubmV4dC5zdGF0ZUlkLFxuICB9O1xufVxuXG4vKipcbiAqIENvbXBhcmVzIGEgbGlzdCBvZiBFcnJvcnMgdG8gbW92ZSBFcnJvcnMuQUxMIGxhc3QgaW4gYSBzb3J0IGZ1bmN0aW9uXG4gKi9cbmZ1bmN0aW9uIGNvbXBhcmVFcnJvcnMoYT86IHN0cmluZ1tdLCBiPzogc3RyaW5nW10pIHtcbiAgaWYgKGE/LmluY2x1ZGVzKEVycm9ycy5BTEwpKSB7XG4gICAgcmV0dXJuIDE7XG4gIH1cbiAgaWYgKGI/LmluY2x1ZGVzKEVycm9ycy5BTEwpKSB7XG4gICAgcmV0dXJuIC0xO1xuICB9XG4gIHJldHVybiAwO1xufVxuXG4vKipcbiAqIFZhbGlkYXRlcyBhbiBlcnJvcnMgbGlzdFxuICovXG5mdW5jdGlvbiB2YWxpZGF0ZUVycm9ycyhlcnJvcnM/OiBzdHJpbmdbXSkge1xuICBpZiAoZXJyb3JzPy5pbmNsdWRlcyhFcnJvcnMuQUxMKSAmJiBlcnJvcnMubGVuZ3RoID4gMSkge1xuICAgIHRocm93IG5ldyBFcnJvcihgJHtFcnJvcnMuQUxMfSBtdXN0IGFwcGVhciBhbG9uZSBpbiBhbiBlcnJvciBsaXN0YCk7XG4gIH1cbn1cblxuLyoqXG4gKiBSZW5kZXIgYSBsaXN0IG9yIHJldHVybiB1bmRlZmluZWQgZm9yIGFuIGVtcHR5IGxpc3RcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJlbmRlckxpc3Q8VD4oeHM6IFRbXSwgbWFwRm46ICh4OiBUKSA9PiBhbnksIHNvcnRGbj86IChhOiBULCBiOiBUKSA9PiBudW1iZXIpOiBhbnkge1xuICBpZiAoeHMubGVuZ3RoID09PSAwKSB7IHJldHVybiB1bmRlZmluZWQ7IH1cbiAgbGV0IGxpc3QgPSB4cztcbiAgaWYgKHNvcnRGbikge1xuICAgIGxpc3QgPSB4cy5zb3J0KHNvcnRGbik7XG4gIH1cbiAgcmV0dXJuIGxpc3QubWFwKG1hcEZuKTtcbn1cblxuLyoqXG4gKiBSZW5kZXIgSlNPTiBwYXRoLCByZXNwZWN0aW5nIHRoZSBzcGVjaWFsIHZhbHVlIERJU0NBUkRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJlbmRlckpzb25QYXRoKGpzb25QYXRoPzogc3RyaW5nKTogdW5kZWZpbmVkIHwgbnVsbCB8IHN0cmluZyB7XG4gIGlmIChqc29uUGF0aCA9PT0gdW5kZWZpbmVkKSB7IHJldHVybiB1bmRlZmluZWQ7IH1cbiAgaWYgKGpzb25QYXRoID09PSBKc29uUGF0aC5ESVNDQVJEKSB7IHJldHVybiBudWxsOyB9XG5cbiAgaWYgKCFqc29uUGF0aC5zdGFydHNXaXRoKCckJykpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYEV4cGVjdGVkIEpTT04gcGF0aCB0byBzdGFydCB3aXRoICckJywgZ290OiAke2pzb25QYXRofWApO1xuICB9XG4gIHJldHVybiBqc29uUGF0aDtcbn1cblxuLyoqXG4gKiBJbnRlcmZhY2UgZm9yIHN0cnVjdHVyYWwgZmVhdHVyZSB0ZXN0aW5nICh0byBtYWtlIFR5cGVTY3JpcHQgaGFwcHkpXG4gKi9cbmludGVyZmFjZSBQcmVmaXhhYmxlIHtcbiAgYWRkUHJlZml4KHg6IHN0cmluZyk6IHZvaWQ7XG59XG5cbi8qKlxuICogV2hldGhlciBhbiBvYmplY3QgaXMgYSBQcmVmaXhhYmxlXG4gKi9cbmZ1bmN0aW9uIGlzUHJlZml4YWJsZSh4OiBhbnkpOiB4IGlzIFByZWZpeGFibGUge1xuICByZXR1cm4gdHlwZW9mKHgpID09PSAnb2JqZWN0JyAmJiB4LmFkZFByZWZpeDtcbn1cblxuLyoqXG4gKiBXaGV0aGVyIGFuIG9iamVjdCBpcyBJTmV4dGFibGVcbiAqL1xuZnVuY3Rpb24gaXNOZXh0YWJsZSh4OiBhbnkpOiB4IGlzIElOZXh0YWJsZSB7XG4gIHJldHVybiB0eXBlb2YoeCkgPT09ICdvYmplY3QnICYmIHgubmV4dDtcbn1cbiJdfQ==