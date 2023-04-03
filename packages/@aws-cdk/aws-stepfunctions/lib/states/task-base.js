"use strict";
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Timeout = exports.IntegrationPattern = exports.TaskStateBase = void 0;
const jsiiDeprecationWarnings = require("../../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const cloudwatch = require("@aws-cdk/aws-cloudwatch");
const iam = require("@aws-cdk/aws-iam");
const state_1 = require("./state");
const chain_1 = require("../chain");
const fields_1 = require("../fields");
/**
 * Define a Task state in the state machine
 *
 * Reaching a Task state causes some work to be executed, represented by the
 * Task's resource property. Task constructs represent a generic Amazon
 * States Language Task.
 *
 * For some resource types, more specific subclasses of Task may be available
 * which are more convenient to use.
 */
class TaskStateBase extends state_1.State {
    constructor(scope, id, props) {
        super(scope, id, props);
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_stepfunctions_TaskStateBaseProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, TaskStateBase);
            }
            throw error;
        }
        this.endStates = [this];
        this.timeout = props.timeout;
        this.taskTimeout = props.taskTimeout;
        this.heartbeat = props.heartbeat;
        this.heartbeatTimeout = props.heartbeatTimeout;
        this.credentials = props.credentials;
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
     * Return the Amazon States Language object for this state
     */
    toStateJson() {
        return {
            ...this.renderNextEnd(),
            ...this.renderRetryCatch(),
            ...this.renderTaskBase(),
            ...this._renderTask(),
        };
    }
    /**
     * Return the given named metric for this Task
     *
     * @default - sum over 5 minutes
     */
    metric(metricName, props) {
        return new cloudwatch.Metric({
            namespace: 'AWS/States',
            metricName,
            dimensionsMap: this.taskMetrics?.metricDimensions,
            statistic: 'sum',
            ...props,
        }).attachTo(this);
    }
    /**
     * The interval, in milliseconds, between the time the Task starts and the time it closes.
     *
     * @default - average over 5 minutes
     */
    metricRunTime(props) {
        return this.taskMetric(this.taskMetrics?.metricPrefixSingular, 'RunTime', { statistic: 'avg', ...props });
    }
    /**
     * The interval, in milliseconds, for which the activity stays in the schedule state.
     *
     * @default - average over 5 minutes
     */
    metricScheduleTime(props) {
        return this.taskMetric(this.taskMetrics?.metricPrefixSingular, 'ScheduleTime', { statistic: 'avg', ...props });
    }
    /**
     * The interval, in milliseconds, between the time the activity is scheduled and the time it closes.
     *
     * @default - average over 5 minutes
     */
    metricTime(props) {
        return this.taskMetric(this.taskMetrics?.metricPrefixSingular, 'Time', { statistic: 'avg', ...props });
    }
    /**
     * Metric for the number of times this activity is scheduled
     *
     * @default - sum over 5 minutes
     */
    metricScheduled(props) {
        return this.taskMetric(this.taskMetrics?.metricPrefixPlural, 'Scheduled', props);
    }
    /**
     * Metric for the number of times this activity times out
     *
     * @default - sum over 5 minutes
     */
    metricTimedOut(props) {
        return this.taskMetric(this.taskMetrics?.metricPrefixPlural, 'TimedOut', props);
    }
    /**
     * Metric for the number of times this activity is started
     *
     * @default - sum over 5 minutes
     */
    metricStarted(props) {
        return this.taskMetric(this.taskMetrics?.metricPrefixPlural, 'Started', props);
    }
    /**
     * Metric for the number of times this activity succeeds
     *
     * @default - sum over 5 minutes
     */
    metricSucceeded(props) {
        return this.taskMetric(this.taskMetrics?.metricPrefixPlural, 'Succeeded', props);
    }
    /**
     * Metric for the number of times this activity fails
     *
     * @default - sum over 5 minutes
     */
    metricFailed(props) {
        return this.taskMetric(this.taskMetrics?.metricPrefixPlural, 'Failed', props);
    }
    /**
     * Metric for the number of times the heartbeat times out for this activity
     *
     * @default - sum over 5 minutes
     */
    metricHeartbeatTimedOut(props) {
        return this.taskMetric(this.taskMetrics?.metricPrefixPlural, 'HeartbeatTimedOut', props);
    }
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
        super.whenBoundToGraph(graph);
        for (const policyStatement of this.taskPolicies || []) {
            graph.registerPolicyStatement(policyStatement);
        }
        if (this.credentials) {
            graph.registerPolicyStatement(new iam.PolicyStatement({
                effect: iam.Effect.ALLOW,
                actions: ['sts:AssumeRole'],
                resources: [this.credentials.role.resource],
            }));
        }
    }
    taskMetric(prefix, suffix, props) {
        if (prefix === undefined) {
            throw new Error('Task does not expose metrics. Use the \'metric()\' function to add metrics.');
        }
        return this.metric(prefix + suffix, props);
    }
    renderCredentials() {
        return this.credentials ? fields_1.FieldUtils.renderObject({ Credentials: { RoleArn: this.credentials.role.roleArn } }) : undefined;
    }
    renderTaskBase() {
        return {
            Type: 'Task',
            Comment: this.comment,
            TimeoutSeconds: this.timeout?.toSeconds() ?? this.taskTimeout?.seconds,
            TimeoutSecondsPath: this.taskTimeout?.path,
            HeartbeatSeconds: this.heartbeat?.toSeconds() ?? this.heartbeatTimeout?.seconds,
            HeartbeatSecondsPath: this.heartbeatTimeout?.path,
            InputPath: state_1.renderJsonPath(this.inputPath),
            OutputPath: state_1.renderJsonPath(this.outputPath),
            ResultPath: state_1.renderJsonPath(this.resultPath),
            ...this.renderResultSelector(),
            ...this.renderCredentials(),
        };
    }
}
exports.TaskStateBase = TaskStateBase;
_a = JSII_RTTI_SYMBOL_1;
TaskStateBase[_a] = { fqn: "@aws-cdk/aws-stepfunctions.TaskStateBase", version: "0.0.0" };
/**
 *
 * AWS Step Functions integrates with services directly in the Amazon States Language.
 * You can control these AWS services using service integration patterns:
 *
 * @see https://docs.aws.amazon.com/step-functions/latest/dg/connect-to-resource.html
 *
 */
var IntegrationPattern;
(function (IntegrationPattern) {
    /**
     * Step Functions will wait for an HTTP response and then progress to the next state.
     *
     * @see https://docs.aws.amazon.com/step-functions/latest/dg/connect-to-resource.html#connect-default
     */
    IntegrationPattern["REQUEST_RESPONSE"] = "REQUEST_RESPONSE";
    /**
     * Step Functions can wait for a request to complete before progressing to the next state.
     *
     * @see https://docs.aws.amazon.com/step-functions/latest/dg/connect-to-resource.html#connect-sync
     */
    IntegrationPattern["RUN_JOB"] = "RUN_JOB";
    /**
     * Callback tasks provide a way to pause a workflow until a task token is returned.
     * You must set a task token when using the callback pattern
     *
     * @see https://docs.aws.amazon.com/step-functions/latest/dg/connect-to-resource.html#connect-wait-token
     */
    IntegrationPattern["WAIT_FOR_TASK_TOKEN"] = "WAIT_FOR_TASK_TOKEN";
})(IntegrationPattern = exports.IntegrationPattern || (exports.IntegrationPattern = {}));
/**
 * Timeout for a task or heartbeat
 */
class Timeout {
    /**
     * Use a duration as timeout
     */
    static duration(duration) {
        return { seconds: duration.toSeconds() };
    }
    /**
     * Use a dynamic timeout specified by a path in the state input.
     *
     * The path must select a field whose value is a positive integer.
     */
    static at(path) {
        return { path };
    }
}
exports.Timeout = Timeout;
_b = JSII_RTTI_SYMBOL_1;
Timeout[_b] = { fqn: "@aws-cdk/aws-stepfunctions.Timeout", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFzay1iYXNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsidGFzay1iYXNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLHNEQUFzRDtBQUN0RCx3Q0FBd0M7QUFHeEMsbUNBQWdEO0FBQ2hELG9DQUFpQztBQUNqQyxzQ0FBdUM7QUEySHZDOzs7Ozs7Ozs7R0FTRztBQUNILE1BQXNCLGFBQWMsU0FBUSxhQUFLO0lBYS9DLFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBeUI7UUFDakUsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7Ozs7OzsrQ0FkTixhQUFhOzs7O1FBZ0IvQixJQUFJLENBQUMsU0FBUyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDeEIsSUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDO1FBQzdCLElBQUksQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDLFdBQVcsQ0FBQztRQUNyQyxJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUM7UUFDakMsSUFBSSxDQUFDLGdCQUFnQixHQUFHLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQztRQUMvQyxJQUFJLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQyxXQUFXLENBQUM7S0FDdEM7SUFFRDs7Ozs7T0FLRztJQUNJLFFBQVEsQ0FBQyxRQUFvQixFQUFFOzs7Ozs7Ozs7O1FBQ3BDLEtBQUssQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDdkIsT0FBTyxJQUFJLENBQUM7S0FDYjtJQUVEOzs7OztPQUtHO0lBQ0ksUUFBUSxDQUFDLE9BQW1CLEVBQUUsUUFBb0IsRUFBRTs7Ozs7Ozs7Ozs7UUFDekQsS0FBSyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsVUFBVSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQzNDLE9BQU8sSUFBSSxDQUFDO0tBQ2I7SUFFRDs7T0FFRztJQUNJLElBQUksQ0FB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dXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNsb3Vkd2F0Y2ggZnJvbSAnQGF3cy1jZGsvYXdzLWNsb3Vkd2F0Y2gnO1xuaW1wb3J0ICogYXMgaWFtIGZyb20gJ0Bhd3MtY2RrL2F3cy1pYW0nO1xuaW1wb3J0ICogYXMgY2RrIGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgeyByZW5kZXJKc29uUGF0aCwgU3RhdGUgfSBmcm9tICcuL3N0YXRlJztcbmltcG9ydCB7IENoYWluIH0gZnJvbSAnLi4vY2hhaW4nO1xuaW1wb3J0IHsgRmllbGRVdGlscyB9IGZyb20gJy4uL2ZpZWxkcyc7XG5pbXBvcnQgeyBTdGF0ZUdyYXBoIH0gZnJvbSAnLi4vc3RhdGUtZ3JhcGgnO1xuaW1wb3J0IHsgQ3JlZGVudGlhbHMgfSBmcm9tICcuLi90YXNrLWNyZWRlbnRpYWxzJztcbmltcG9ydCB7IENhdGNoUHJvcHMsIElDaGFpbmFibGUsIElOZXh0YWJsZSwgUmV0cnlQcm9wcyB9IGZyb20gJy4uL3R5cGVzJztcblxuXG4vKipcbiAqIFByb3BzIHRoYXQgYXJlIGNvbW1vbiB0byBhbGwgdGFza3NcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBUYXNrU3RhdGVCYXNlUHJvcHMge1xuICAvKipcbiAgICogQW4gb3B0aW9uYWwgZGVzY3JpcHRpb24gZm9yIHRoaXMgc3RhdGVcbiAgICpcbiAgICogQGRlZmF1bHQgLSBObyBjb21tZW50XG4gICAqL1xuICByZWFkb25seSBjb21tZW50Pzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBKU09OUGF0aCBleHByZXNzaW9uIHRvIHNlbGVjdCBwYXJ0IG9mIHRoZSBzdGF0ZSB0byBiZSB0aGUgaW5wdXQgdG8gdGhpcyBzdGF0ZS5cbiAgICpcbiAgICogTWF5IGFsc28gYmUgdGhlIHNwZWNpYWwgdmFsdWUgSnNvblBhdGguRElTQ0FSRCwgd2hpY2ggd2lsbCBjYXVzZSB0aGUgZWZmZWN0aXZlXG4gICAqIGlucHV0IHRvIGJlIHRoZSBlbXB0eSBvYmplY3Qge30uXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gVGhlIGVudGlyZSB0YXNrIGlucHV0IChKU09OIHBhdGggJyQnKVxuICAgKi9cbiAgcmVhZG9ubHkgaW5wdXRQYXRoPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBKU09OUGF0aCBleHByZXNzaW9uIHRvIHNlbGVjdCBzZWxlY3QgYSBwb3J0aW9uIG9mIHRoZSBzdGF0ZSBvdXRwdXQgdG8gcGFzc1xuICAgKiB0byB0aGUgbmV4dCBzdGF0ZS5cbiAgICpcbiAgICogTWF5IGFsc28gYmUgdGhlIHNwZWNpYWwgdmFsdWUgSnNvblBhdGguRElTQ0FSRCwgd2hpY2ggd2lsbCBjYXVzZSB0aGUgZWZmZWN0aXZlXG4gICAqIG91dHB1dCB0byBiZSB0aGUgZW1wdHkgb2JqZWN0IHt9LlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIFRoZSBlbnRpcmUgSlNPTiBub2RlIGRldGVybWluZWQgYnkgdGhlIHN0YXRlIGlucHV0LCB0aGUgdGFzayByZXN1bHQsXG4gICAqICAgYW5kIHJlc3VsdFBhdGggaXMgcGFzc2VkIHRvIHRoZSBuZXh0IHN0YXRlIChKU09OIHBhdGggJyQnKVxuICAgKi9cbiAgcmVhZG9ubHkgb3V0cHV0UGF0aD86IHN0cmluZztcblxuICAvKipcbiAgICogSlNPTlBhdGggZXhwcmVzc2lvbiB0byBpbmRpY2F0ZSB3aGVyZSB0byBpbmplY3QgdGhlIHN0YXRlJ3Mgb3V0cHV0XG4gICAqXG4gICAqIE1heSBhbHNvIGJlIHRoZSBzcGVjaWFsIHZhbHVlIEpzb25QYXRoLkRJU0NBUkQsIHdoaWNoIHdpbGwgY2F1c2UgdGhlIHN0YXRlJ3NcbiAgICogaW5wdXQgdG8gYmVjb21lIGl0cyBvdXRwdXQuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gUmVwbGFjZXMgdGhlIGVudGlyZSBpbnB1dCB3aXRoIHRoZSByZXN1bHQgKEpTT04gcGF0aCAnJCcpXG4gICAqL1xuICByZWFkb25seSByZXN1bHRQYXRoPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgSlNPTiB0aGF0IHdpbGwgcmVwbGFjZSB0aGUgc3RhdGUncyByYXcgcmVzdWx0IGFuZCBiZWNvbWUgdGhlIGVmZmVjdGl2ZVxuICAgKiByZXN1bHQgYmVmb3JlIFJlc3VsdFBhdGggaXMgYXBwbGllZC5cbiAgICpcbiAgICogWW91IGNhbiB1c2UgUmVzdWx0U2VsZWN0b3IgdG8gY3JlYXRlIGEgcGF5bG9hZCB3aXRoIHZhbHVlcyB0aGF0IGFyZSBzdGF0aWNcbiAgICogb3Igc2VsZWN0ZWQgZnJvbSB0aGUgc3RhdGUncyByYXcgcmVzdWx0LlxuICAgKlxuICAgKiBAc2VlXG4gICAqIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9zdGVwLWZ1bmN0aW9ucy9sYXRlc3QvZGcvaW5wdXQtb3V0cHV0LWlucHV0cGF0aC1wYXJhbXMuaHRtbCNpbnB1dC1vdXRwdXQtcmVzdWx0c2VsZWN0b3JcbiAgICpcbiAgICogQGRlZmF1bHQgLSBOb25lXG4gICAqL1xuICByZWFkb25seSByZXN1bHRTZWxlY3Rvcj86IHsgW2tleTogc3RyaW5nXTogYW55IH07XG5cbiAgLyoqXG4gICAqIFRpbWVvdXQgZm9yIHRoZSB0YXNrXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gTm9uZVxuICAgKiBAZGVwcmVjYXRlZCB1c2UgYHRhc2tUaW1lb3V0YFxuICAgKi9cbiAgcmVhZG9ubHkgdGltZW91dD86IGNkay5EdXJhdGlvbjtcblxuICAvKipcbiAgICogVGltZW91dCBmb3IgdGhlIHRhc2tcbiAgICpcbiAgICogW2Rpc2FibGUtYXdzbGludDpkdXJhdGlvbi1wcm9wLXR5cGVdIGlzIG5lZWRlZCBiZWNhdXNlIGFsbCBwcm9wcyBpbnRlcmZhY2UgaW5cbiAgICogYXdzLXN0ZXBmdW5jdGlvbnMtdGFza3MgZXh0ZW5kIHRoaXMgaW50ZXJmYWNlXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gTm9uZVxuICAgKi9cbiAgcmVhZG9ubHkgdGFza1RpbWVvdXQ/OiBUaW1lb3V0O1xuXG4gIC8qKlxuICAgKiBUaW1lb3V0IGZvciB0aGUgaGVhcnRiZWF0XG4gICAqXG4gICAqIEBkZWZhdWx0IC0gTm9uZVxuICAgKiBAZGVwcmVjYXRlZCB1c2UgYGhlYXJ0YmVhdFRpbWVvdXRgXG4gICAqL1xuICByZWFkb25seSBoZWFydGJlYXQ/OiBjZGsuRHVyYXRpb247XG5cbiAgLyoqXG4gICAqIFRpbWVvdXQgZm9yIHRoZSBoZWFydGJlYXRcbiAgICpcbiAgICogW2Rpc2FibGUtYXdzbGludDpkdXJhdGlvbi1wcm9wLXR5cGVdIGlzIG5lZWRlZCBiZWNhdXNlIGFsbCBwcm9wcyBpbnRlcmZhY2UgaW5cbiAgICogYXdzLXN0ZXBmdW5jdGlvbnMtdGFza3MgZXh0ZW5kIHRoaXMgaW50ZXJmYWNlXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gTm9uZVxuICAgKi9cbiAgcmVhZG9ubHkgaGVhcnRiZWF0VGltZW91dD86IFRpbWVvdXQ7XG5cbiAgLyoqXG4gICAqIEFXUyBTdGVwIEZ1bmN0aW9ucyBpbnRlZ3JhdGVzIHdpdGggc2VydmljZXMgZGlyZWN0bHkgaW4gdGhlIEFtYXpvbiBTdGF0ZXMgTGFuZ3VhZ2UuXG4gICAqIFlvdSBjYW4gY29udHJvbCB0aGVzZSBBV1Mgc2VydmljZXMgdXNpbmcgc2VydmljZSBpbnRlZ3JhdGlvbiBwYXR0ZXJuc1xuICAgKlxuICAgKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9zdGVwLWZ1bmN0aW9ucy9sYXRlc3QvZGcvY29ubmVjdC10by1yZXNvdXJjZS5odG1sI2Nvbm5lY3Qtd2FpdC10b2tlblxuICAgKlxuICAgKiBAZGVmYXVsdCAtIGBJbnRlZ3JhdGlvblBhdHRlcm4uUkVRVUVTVF9SRVNQT05TRWAgZm9yIG1vc3QgdGFza3MuXG4gICAqIGBJbnRlZ3JhdGlvblBhdHRlcm4uUlVOX0pPQmAgZm9yIHRoZSBmb2xsb3dpbmcgZXhjZXB0aW9uczpcbiAgICogIGBCYXRjaFN1Ym1pdEpvYmAsIGBFbXJBZGRTdGVwYCwgYEVtckNyZWF0ZUNsdXN0ZXJgLCBgRW1yVGVybWluYXRpb25DbHVzdGVyYCwgYW5kIGBFbXJDb250YWluZXJzU3RhcnRKb2JSdW5gLlxuICAgKlxuICAgKi9cbiAgcmVhZG9ubHkgaW50ZWdyYXRpb25QYXR0ZXJuPzogSW50ZWdyYXRpb25QYXR0ZXJuO1xuXG4gIC8qKlxuICAgKiBDcmVkZW50aWFscyBmb3IgYW4gSUFNIFJvbGUgdGhhdCB0aGUgU3RhdGUgTWFjaGluZSBhc3N1bWVzIGZvciBleGVjdXRpbmcgdGhlIHRhc2suXG4gICAqIFRoaXMgZW5hYmxlcyBjcm9zcy1hY2NvdW50IHJlc291cmNlIGludm9jYXRpb25zLlxuICAgKlxuICAgKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9zdGVwLWZ1bmN0aW9ucy9sYXRlc3QvZGcvY29uY2VwdHMtYWNjZXNzLWNyb3NzLWFjY3QtcmVzb3VyY2VzLmh0bWxcbiAgICpcbiAgICogQGRlZmF1bHQgLSBOb25lIChUYXNrIGlzIGV4ZWN1dGVkIHVzaW5nIHRoZSBTdGF0ZSBNYWNoaW5lJ3MgZXhlY3V0aW9uIHJvbGUpXG4gICAqL1xuICByZWFkb25seSBjcmVkZW50aWFscz86IENyZWRlbnRpYWxzO1xufVxuXG4vKipcbiAqIERlZmluZSBhIFRhc2sgc3RhdGUgaW4gdGhlIHN0YXRlIG1hY2hpbmVcbiAqXG4gKiBSZWFjaGluZyBhIFRhc2sgc3RhdGUgY2F1c2VzIHNvbWUgd29yayB0byBiZSBleGVjdXRlZCwgcmVwcmVzZW50ZWQgYnkgdGhlXG4gKiBUYXNrJ3MgcmVzb3VyY2UgcHJvcGVydHkuIFRhc2sgY29uc3RydWN0cyByZXByZXNlbnQgYSBnZW5lcmljIEFtYXpvblxuICogU3RhdGVzIExhbmd1YWdlIFRhc2suXG4gKlxuICogRm9yIHNvbWUgcmVzb3VyY2UgdHlwZXMsIG1vcmUgc3BlY2lmaWMgc3ViY2xhc3NlcyBvZiBUYXNrIG1heSBiZSBhdmFpbGFibGVcbiAqIHdoaWNoIGFyZSBtb3JlIGNvbnZlbmllbnQgdG8gdXNlLlxuICovXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgVGFza1N0YXRlQmFzZSBleHRlbmRzIFN0YXRlIGltcGxlbWVudHMgSU5leHRhYmxlIHtcblxuICBwdWJsaWMgcmVhZG9ubHkgZW5kU3RhdGVzOiBJTmV4dGFibGVbXTtcblxuICBwcm90ZWN0ZWQgYWJzdHJhY3QgcmVhZG9ubHkgdGFza01ldHJpY3M/OiBUYXNrTWV0cmljc0NvbmZpZztcbiAgcHJvdGVjdGVkIGFic3RyYWN0IHJlYWRvbmx5IHRhc2tQb2xpY2llcz86IGlhbS5Qb2xpY3lTdGF0ZW1lbnRbXTtcblxuICBwcml2YXRlIHJlYWRvbmx5IHRpbWVvdXQ/OiBjZGsuRHVyYXRpb247XG4gIHByaXZhdGUgcmVhZG9ubHkgdGFza1RpbWVvdXQ/OiBUaW1lb3V0O1xuICBwcml2YXRlIHJlYWRvbmx5IGhlYXJ0YmVhdD86IGNkay5EdXJhdGlvbjtcbiAgcHJpdmF0ZSByZWFkb25seSBoZWFydGJlYXRUaW1lb3V0PzogVGltZW91dDtcbiAgcHJpdmF0ZSByZWFkb25seSBjcmVkZW50aWFscz86IENyZWRlbnRpYWxzO1xuXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBUYXNrU3RhdGVCYXNlUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHByb3BzKTtcblxuICAgIHRoaXMuZW5kU3RhdGVzID0gW3RoaXNdO1xuICAgIHRoaXMudGltZW91dCA9IHByb3BzLnRpbWVvdXQ7XG4gICAgdGhpcy50YXNrVGltZW91dCA9IHByb3BzLnRhc2tUaW1lb3V0O1xuICAgIHRoaXMuaGVhcnRiZWF0ID0gcHJvcHMuaGVhcnRiZWF0O1xuICAgIHRoaXMuaGVhcnRiZWF0VGltZW91dCA9IHByb3BzLmhlYXJ0YmVhdFRpbWVvdXQ7XG4gICAgdGhpcy5jcmVkZW50aWFscyA9IHByb3BzLmNyZWRlbnRpYWxzO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZCByZXRyeSBjb25maWd1cmF0aW9uIGZvciB0aGlzIHN0YXRlXG4gICAqXG4gICAqIFRoaXMgY29udHJvbHMgaWYgYW5kIGhvdyB0aGUgZXhlY3V0aW9uIHdpbGwgYmUgcmV0cmllZCBpZiBhIHBhcnRpY3VsYXJcbiAgICogZXJyb3Igb2NjdXJzLlxuICAgKi9cbiAgcHVibGljIGFkZFJldHJ5KHByb3BzOiBSZXRyeVByb3BzID0ge30pOiBUYXNrU3RhdGVCYXNlIHtcbiAgICBzdXBlci5fYWRkUmV0cnkocHJvcHMpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBhIHJlY292ZXJ5IGhhbmRsZXIgZm9yIHRoaXMgc3RhdGVcbiAgICpcbiAgICogV2hlbiBhIHBhcnRpY3VsYXIgZXJyb3Igb2NjdXJzLCBleGVjdXRpb24gd2lsbCBjb250aW51ZSBhdCB0aGUgZXJyb3JcbiAgICogaGFuZGxlciBpbnN0ZWFkIG9mIGZhaWxpbmcgdGhlIHN0YXRlIG1hY2hpbmUgZXhlY3V0aW9uLlxuICAgKi9cbiAgcHVibGljIGFkZENhdGNoKGhhbmRsZXI6IElDaGFpbmFibGUsIHByb3BzOiBDYXRjaFByb3BzID0ge30pOiBUYXNrU3RhdGVCYXNlIHtcbiAgICBzdXBlci5fYWRkQ2F0Y2goaGFuZGxlci5zdGFydFN0YXRlLCBwcm9wcyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogQ29udGludWUgbm9ybWFsIGV4ZWN1dGlvbiB3aXRoIHRoZSBnaXZlbiBzdGF0ZVxuICAgKi9cbiAgcHVibGljIG5leHQobmV4dDogSUNoYWluYWJsZSk6IENoYWluIHtcbiAgICBzdXBlci5tYWtlTmV4dChuZXh0LnN0YXJ0U3RhdGUpO1xuICAgIHJldHVybiBDaGFpbi5zZXF1ZW5jZSh0aGlzLCBuZXh0KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm4gdGhlIEFtYXpvbiBTdGF0ZXMgTGFuZ3VhZ2Ugb2JqZWN0IGZvciB0aGlzIHN0YXRlXG4gICAqL1xuICBwdWJsaWMgdG9TdGF0ZUpzb24oKTogb2JqZWN0IHtcbiAgICByZXR1cm4ge1xuICAgICAgLi4udGhpcy5yZW5kZXJOZXh0RW5kKCksXG4gICAgICAuLi50aGlzLnJlbmRlclJldHJ5Q2F0Y2goKSxcbiAgICAgIC4uLnRoaXMucmVuZGVyVGFza0Jhc2UoKSxcbiAgICAgIC4uLnRoaXMuX3JlbmRlclRhc2soKSxcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybiB0aGUgZ2l2ZW4gbmFtZWQgbWV0cmljIGZvciB0aGlzIFRhc2tcbiAgICpcbiAgICogQGRlZmF1bHQgLSBzdW0gb3ZlciA1IG1pbnV0ZXNcbiAgICovXG4gIHB1YmxpYyBtZXRyaWMobWV0cmljTmFtZTogc3RyaW5nLCBwcm9wcz86IGNsb3Vkd2F0Y2guTWV0cmljT3B0aW9ucyk6IGNsb3Vkd2F0Y2guTWV0cmljIHtcbiAgICByZXR1cm4gbmV3IGNsb3Vkd2F0Y2guTWV0cmljKHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9TdGF0ZXMnLFxuICAgICAgbWV0cmljTmFtZSxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IHRoaXMudGFza01ldHJpY3M/Lm1ldHJpY0RpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdzdW0nLFxuICAgICAgLi4ucHJvcHMsXG4gICAgfSkuYXR0YWNoVG8odGhpcyk7XG4gIH1cblxuICAvKipcbiAgICogVGhlIGludGVydmFsLCBpbiBtaWxsaXNlY29uZHMsIGJldHdlZW4gdGhlIHRpbWUgdGhlIFRhc2sgc3RhcnRzIGFuZCB0aGUgdGltZSBpdCBjbG9zZXMuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gYXZlcmFnZSBvdmVyIDUgbWludXRlc1xuICAgKi9cbiAgcHVibGljIG1ldHJpY1J1blRpbWUocHJvcHM/OiBjbG91ZHdhdGNoLk1ldHJpY09wdGlvbnMpOiBjbG91ZHdhdGNoLk1ldHJpYyB7XG4gICAgcmV0dXJuIHRoaXMudGFza01ldHJpYyh0aGlzLnRhc2tNZXRyaWNzPy5tZXRyaWNQcmVmaXhTaW5ndWxhciwgJ1J1blRpbWUnLCB7IHN0YXRpc3RpYzogJ2F2ZycsIC4uLnByb3BzIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBpbnRlcnZhbCwgaW4gbWlsbGlzZWNvbmRzLCBmb3Igd2hpY2ggdGhlIGFjdGl2aXR5IHN0YXlzIGluIHRoZSBzY2hlZHVsZSBzdGF0ZS5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBhdmVyYWdlIG92ZXIgNSBtaW51dGVzXG4gICAqL1xuICBwdWJsaWMgbWV0cmljU2NoZWR1bGVUaW1lKHByb3BzPzogY2xvdWR3YXRjaC5NZXRyaWNPcHRpb25zKTogY2xvdWR3YXRjaC5NZXRyaWMge1xuICAgIHJldHVybiB0aGlzLnRhc2tNZXRyaWModGhpcy50YXNrTWV0cmljcz8ubWV0cmljUHJlZml4U2luZ3VsYXIsICdTY2hlZHVsZVRpbWUnLCB7IHN0YXRpc3RpYzogJ2F2ZycsIC4uLnByb3BzIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBpbnRlcnZhbCwgaW4gbWlsbGlzZWNvbmRzLCBiZXR3ZWVuIHRoZSB0aW1lIHRoZSBhY3Rpdml0eSBpcyBzY2hlZHVsZWQgYW5kIHRoZSB0aW1lIGl0IGNsb3Nlcy5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBhdmVyYWdlIG92ZXIgNSBtaW51dGVzXG4gICAqL1xuICBwdWJsaWMgbWV0cmljVGltZShwcm9wcz86IGNsb3Vkd2F0Y2guTWV0cmljT3B0aW9ucyk6IGNsb3Vkd2F0Y2guTWV0cmljIHtcbiAgICByZXR1cm4gdGhpcy50YXNrTWV0cmljKHRoaXMudGFza01ldHJpY3M/Lm1ldHJpY1ByZWZpeFNpbmd1bGFyLCAnVGltZScsIHsgc3RhdGlzdGljOiAnYXZnJywgLi4ucHJvcHMgfSk7XG4gIH1cblxuICAvKipcbiAgICogTWV0cmljIGZvciB0aGUgbnVtYmVyIG9mIHRpbWVzIHRoaXMgYWN0aXZpdHkgaXMgc2NoZWR1bGVkXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gc3VtIG92ZXIgNSBtaW51dGVzXG4gICAqL1xuICBwdWJsaWMgbWV0cmljU2NoZWR1bGVkKHByb3BzPzogY2xvdWR3YXRjaC5NZXRyaWNPcHRpb25zKTogY2xvdWR3YXRjaC5NZXRyaWMge1xuICAgIHJldHVybiB0aGlzLnRhc2tNZXRyaWModGhpcy50YXNrTWV0cmljcz8ubWV0cmljUHJlZml4UGx1cmFsLCAnU2NoZWR1bGVkJywgcHJvcHMpO1xuICB9XG5cbiAgLyoqXG4gICAqIE1ldHJpYyBmb3IgdGhlIG51bWJlciBvZiB0aW1lcyB0aGlzIGFjdGl2aXR5IHRpbWVzIG91dFxuICAgKlxuICAgKiBAZGVmYXVsdCAtIHN1bSBvdmVyIDUgbWludXRlc1xuICAgKi9cbiAgcHVibGljIG1ldHJpY1RpbWVkT3V0KHByb3BzPzogY2xvdWR3YXRjaC5NZXRyaWNPcHRpb25zKTogY2xvdWR3YXRjaC5NZXRyaWMge1xuICAgIHJldHVybiB0aGlzLnRhc2tNZXRyaWModGhpcy50YXNrTWV0cmljcz8ubWV0cmljUHJlZml4UGx1cmFsLCAnVGltZWRPdXQnLCBwcm9wcyk7XG4gIH1cblxuICAvKipcbiAgICogTWV0cmljIGZvciB0aGUgbnVtYmVyIG9mIHRpbWVzIHRoaXMgYWN0aXZpdHkgaXMgc3RhcnRlZFxuICAgKlxuICAgKiBAZGVmYXVsdCAtIHN1bSBvdmVyIDUgbWludXRlc1xuICAgKi9cbiAgcHVibGljIG1ldHJpY1N0YXJ0ZWQocHJvcHM/OiBjbG91ZHdhdGNoLk1ldHJpY09wdGlvbnMpOiBjbG91ZHdhdGNoLk1ldHJpYyB7XG4gICAgcmV0dXJuIHRoaXMudGFza01ldHJpYyh0aGlzLnRhc2tNZXRyaWNzPy5tZXRyaWNQcmVmaXhQbHVyYWwsICdTdGFydGVkJywgcHJvcHMpO1xuICB9XG5cbiAgLyoqXG4gICAqIE1ldHJpYyBmb3IgdGhlIG51bWJlciBvZiB0aW1lcyB0aGlzIGFjdGl2aXR5IHN1Y2NlZWRzXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gc3VtIG92ZXIgNSBtaW51dGVzXG4gICAqL1xuICBwdWJsaWMgbWV0cmljU3VjY2VlZGVkKHByb3BzPzogY2xvdWR3YXRjaC5NZXRyaWNPcHRpb25zKTogY2xvdWR3YXRjaC5NZXRyaWMge1xuICAgIHJldHVybiB0aGlzLnRhc2tNZXRyaWModGhpcy50YXNrTWV0cmljcz8ubWV0cmljUHJlZml4UGx1cmFsLCAnU3VjY2VlZGVkJywgcHJvcHMpO1xuICB9XG5cbiAgLyoqXG4gICAqIE1ldHJpYyBmb3IgdGhlIG51bWJlciBvZiB0aW1lcyB0aGlzIGFjdGl2aXR5IGZhaWxzXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gc3VtIG92ZXIgNSBtaW51dGVzXG4gICAqL1xuICBwdWJsaWMgbWV0cmljRmFpbGVkKHByb3BzPzogY2xvdWR3YXRjaC5NZXRyaWNPcHRpb25zKTogY2xvdWR3YXRjaC5NZXRyaWMge1xuICAgIHJldHVybiB0aGlzLnRhc2tNZXRyaWModGhpcy50YXNrTWV0cmljcz8ubWV0cmljUHJlZml4UGx1cmFsLCAnRmFpbGVkJywgcHJvcHMpO1xuICB9XG5cbiAgLyoqXG4gICAqIE1ldHJpYyBmb3IgdGhlIG51bWJlciBvZiB0aW1lcyB0aGUgaGVhcnRiZWF0IHRpbWVzIG91dCBmb3IgdGhpcyBhY3Rpdml0eVxuICAgKlxuICAgKiBAZGVmYXVsdCAtIHN1bSBvdmVyIDUgbWludXRlc1xuICAgKi9cbiAgcHVibGljIG1ldHJpY0hlYXJ0YmVhdFRpbWVkT3V0KHByb3BzPzogY2xvdWR3YXRjaC5NZXRyaWNPcHRpb25zKTogY2xvdWR3YXRjaC5NZXRyaWMge1xuICAgIHJldHVybiB0aGlzLnRhc2tNZXRyaWModGhpcy50YXNrTWV0cmljcz8ubWV0cmljUHJlZml4UGx1cmFsLCAnSGVhcnRiZWF0VGltZWRPdXQnLCBwcm9wcyk7XG4gIH1cblxuICBwcm90ZWN0ZWQgd2hlbkJvdW5kVG9HcmFwaChncmFwaDogU3RhdGVHcmFwaCkge1xuICAgIHN1cGVyLndoZW5Cb3VuZFRvR3JhcGgoZ3JhcGgpO1xuICAgIGZvciAoY29uc3QgcG9saWN5U3RhdGVtZW50IG9mIHRoaXMudGFza1BvbGljaWVzIHx8IFtdKSB7XG4gICAgICBncmFwaC5yZWdpc3RlclBvbGljeVN0YXRlbWVudChwb2xpY3lTdGF0ZW1lbnQpO1xuICAgIH1cbiAgICBpZiAodGhpcy5jcmVkZW50aWFscykge1xuICAgICAgZ3JhcGgucmVnaXN0ZXJQb2xpY3lTdGF0ZW1lbnQobmV3IGlhbS5Qb2xpY3lTdGF0ZW1lbnQoe1xuICAgICAgICBlZmZlY3Q6IGlhbS5FZmZlY3QuQUxMT1csXG4gICAgICAgIGFjdGlvbnM6IFsnc3RzOkFzc3VtZVJvbGUnXSxcbiAgICAgICAgcmVzb3VyY2VzOiBbdGhpcy5jcmVkZW50aWFscy5yb2xlLnJlc291cmNlXSxcbiAgICAgIH0pKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQGludGVybmFsXG4gICAqL1xuICBwcm90ZWN0ZWQgYWJzdHJhY3QgX3JlbmRlclRhc2soKTogYW55O1xuXG4gIHByaXZhdGUgdGFza01ldHJpYyhwcmVmaXg6IHN0cmluZyB8IHVuZGVmaW5lZCwgc3VmZml4OiBzdHJpbmcsIHByb3BzPzogY2xvdWR3YXRjaC5NZXRyaWNPcHRpb25zKTogY2xvdWR3YXRjaC5NZXRyaWMge1xuICAgIGlmIChwcmVmaXggPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdUYXNrIGRvZXMgbm90IGV4cG9zZSBtZXRyaWNzLiBVc2UgdGhlIFxcJ21ldHJpYygpXFwnIGZ1bmN0aW9uIHRvIGFkZCBtZXRyaWNzLicpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5tZXRyaWMocHJlZml4ICsgc3VmZml4LCBwcm9wcyk7XG4gIH1cblxuICBwcml2YXRlIHJlbmRlckNyZWRlbnRpYWxzKCkge1xuICAgIHJldHVybiB0aGlzLmNyZWRlbnRpYWxzID8gRmllbGRVdGlscy5yZW5kZXJPYmplY3QoeyBDcmVkZW50aWFsczogeyBSb2xlQXJuOiB0aGlzLmNyZWRlbnRpYWxzLnJvbGUucm9sZUFybiB9IH0pIDogdW5kZWZpbmVkO1xuICB9XG5cbiAgcHJpdmF0ZSByZW5kZXJUYXNrQmFzZSgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgVHlwZTogJ1Rhc2snLFxuICAgICAgQ29tbWVudDogdGhpcy5jb21tZW50LFxuICAgICAgVGltZW91dFNlY29uZHM6IHRoaXMudGltZW91dD8udG9TZWNvbmRzKCkgPz8gdGhpcy50YXNrVGltZW91dD8uc2Vjb25kcyxcbiAgICAgIFRpbWVvdXRTZWNvbmRzUGF0aDogdGhpcy50YXNrVGltZW91dD8ucGF0aCxcbiAgICAgIEhlYXJ0YmVhdFNlY29uZHM6IHRoaXMuaGVhcnRiZWF0Py50b1NlY29uZHMoKSA/PyB0aGlzLmhlYXJ0YmVhdFRpbWVvdXQ/LnNlY29uZHMsXG4gICAgICBIZWFydGJlYXRTZWNvbmRzUGF0aDogdGhpcy5oZWFydGJlYXRUaW1lb3V0Py5wYXRoLFxuICAgICAgSW5wdXRQYXRoOiByZW5kZXJKc29uUGF0aCh0aGlzLmlucHV0UGF0aCksXG4gICAgICBPdXRwdXRQYXRoOiByZW5kZXJKc29uUGF0aCh0aGlzLm91dHB1dFBhdGgpLFxuICAgICAgUmVzdWx0UGF0aDogcmVuZGVySnNvblBhdGgodGhpcy5yZXN1bHRQYXRoKSxcbiAgICAgIC4uLnRoaXMucmVuZGVyUmVzdWx0U2VsZWN0b3IoKSxcbiAgICAgIC4uLnRoaXMucmVuZGVyQ3JlZGVudGlhbHMoKSxcbiAgICB9O1xuICB9XG59XG5cbi8qKlxuICogVGFzayBNZXRyaWNzXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgVGFza01ldHJpY3NDb25maWcge1xuICAvKipcbiAgICogUHJlZml4IGZvciBzaW5ndWxhciBtZXRyaWMgbmFtZXMgb2YgYWN0aXZpdHkgYWN0aW9uc1xuICAgKlxuICAgKiBAZGVmYXVsdCAtIE5vIHN1Y2ggbWV0cmljc1xuICAgKi9cbiAgcmVhZG9ubHkgbWV0cmljUHJlZml4U2luZ3VsYXI/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFByZWZpeCBmb3IgcGx1cmFsIG1ldHJpYyBuYW1lcyBvZiBhY3Rpdml0eSBhY3Rpb25zXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gTm8gc3VjaCBtZXRyaWNzXG4gICAqL1xuICByZWFkb25seSBtZXRyaWNQcmVmaXhQbHVyYWw/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBkaW1lbnNpb25zIHRvIGF0dGFjaCB0byBtZXRyaWNzXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gTm8gbWV0cmljc1xuICAgKi9cbiAgcmVhZG9ubHkgbWV0cmljRGltZW5zaW9ucz86IGNsb3Vkd2F0Y2guRGltZW5zaW9uSGFzaDtcbn1cblxuLyoqXG4gKlxuICogQVdTIFN0ZXAgRnVuY3Rpb25zIGludGVncmF0ZXMgd2l0aCBzZXJ2aWNlcyBkaXJlY3RseSBpbiB0aGUgQW1hem9uIFN0YXRlcyBMYW5ndWFnZS5cbiAqIFlvdSBjYW4gY29udHJvbCB0aGVzZSBBV1Mgc2VydmljZXMgdXNpbmcgc2VydmljZSBpbnRlZ3JhdGlvbiBwYXR0ZXJuczpcbiAqXG4gKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9zdGVwLWZ1bmN0aW9ucy9sYXRlc3QvZGcvY29ubmVjdC10by1yZXNvdXJjZS5odG1sXG4gKlxuICovXG5leHBvcnQgZW51bSBJbnRlZ3JhdGlvblBhdHRlcm4ge1xuICAvKipcbiAgICogU3RlcCBGdW5jdGlvbnMgd2lsbCB3YWl0IGZvciBhbiBIVFRQIHJlc3BvbnNlIGFuZCB0aGVuIHByb2dyZXNzIHRvIHRoZSBuZXh0IHN0YXRlLlxuICAgKlxuICAgKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9zdGVwLWZ1bmN0aW9ucy9sYXRlc3QvZGcvY29ubmVjdC10by1yZXNvdXJjZS5odG1sI2Nvbm5lY3QtZGVmYXVsdFxuICAgKi9cbiAgUkVRVUVTVF9SRVNQT05TRSA9ICdSRVFVRVNUX1JFU1BPTlNFJyxcblxuICAvKipcbiAgICogU3RlcCBGdW5jdGlvbnMgY2FuIHdhaXQgZm9yIGEgcmVxdWVzdCB0byBjb21wbGV0ZSBiZWZvcmUgcHJvZ3Jlc3NpbmcgdG8gdGhlIG5leHQgc3RhdGUuXG4gICAqXG4gICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL3N0ZXAtZnVuY3Rpb25zL2xhdGVzdC9kZy9jb25uZWN0LXRvLXJlc291cmNlLmh0bWwjY29ubmVjdC1zeW5jXG4gICAqL1xuICBSVU5fSk9CID0gJ1JVTl9KT0InLFxuXG4gIC8qKlxuICAgKiBDYWxsYmFjayB0YXNrcyBwcm92aWRlIGEgd2F5IHRvIHBhdXNlIGEgd29ya2Zsb3cgdW50aWwgYSB0YXNrIHRva2VuIGlzIHJldHVybmVkLlxuICAgKiBZb3UgbXVzdCBzZXQgYSB0YXNrIHRva2VuIHdoZW4gdXNpbmcgdGhlIGNhbGxiYWNrIHBhdHRlcm5cbiAgICpcbiAgICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vc3RlcC1mdW5jdGlvbnMvbGF0ZXN0L2RnL2Nvbm5lY3QtdG8tcmVzb3VyY2UuaHRtbCNjb25uZWN0LXdhaXQtdG9rZW5cbiAgICovXG4gIFdBSVRfRk9SX1RBU0tfVE9LRU4gPSAnV0FJVF9GT1JfVEFTS19UT0tFTidcbn1cblxuLyoqXG4gKiBUaW1lb3V0IGZvciBhIHRhc2sgb3IgaGVhcnRiZWF0XG4gKi9cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBUaW1lb3V0IHtcbiAgLyoqXG4gICAqIFVzZSBhIGR1cmF0aW9uIGFzIHRpbWVvdXRcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZHVyYXRpb24oZHVyYXRpb246IGNkay5EdXJhdGlvbik6IFRpbWVvdXQge1xuICAgIHJldHVybiB7IHNlY29uZHM6IGR1cmF0aW9uLnRvU2Vjb25kcygpIH07XG4gIH1cblxuICAvKipcbiAgICogVXNlIGEgZHluYW1pYyB0aW1lb3V0IHNwZWNpZmllZCBieSBhIHBhdGggaW4gdGhlIHN0YXRlIGlucHV0LlxuICAgKlxuICAgKiBUaGUgcGF0aCBtdXN0IHNlbGVjdCBhIGZpZWxkIHdob3NlIHZhbHVlIGlzIGEgcG9zaXRpdmUgaW50ZWdlci5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgYXQocGF0aDogc3RyaW5nKTogVGltZW91dCB7XG4gICAgcmV0dXJuIHsgcGF0aCB9O1xuICB9XG5cbiAgLyoqXG4gICAqIFNlY29uZHMgZm9yIHRoaXMgdGltZW91dFxuICAgKi9cbiAgcHVibGljIGFic3RyYWN0IHJlYWRvbmx5IHNlY29uZHM/OiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIFBhdGggZm9yIHRoaXMgdGltZW91dFxuICAgKi9cbiAgcHVibGljIGFic3RyYWN0IHJlYWRvbmx5IHBhdGg/OiBzdHJpbmc7XG59XG4iXX0=