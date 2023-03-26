"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegrationPattern = exports.TaskStateBase = void 0;
const jsiiDeprecationWarnings = require("../../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const cloudwatch = require("@aws-cdk/aws-cloudwatch");
const iam = require("@aws-cdk/aws-iam");
const chain_1 = require("../chain");
const fields_1 = require("../fields");
const state_1 = require("./state");
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
        this.heartbeat = props.heartbeat;
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
            TimeoutSeconds: this.timeout?.toSeconds(),
            HeartbeatSeconds: this.heartbeat?.toSeconds(),
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFzay1iYXNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsidGFzay1iYXNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLHNEQUFzRDtBQUN0RCx3Q0FBd0M7QUFHeEMsb0NBQWlDO0FBQ2pDLHNDQUF1QztBQUl2QyxtQ0FBZ0Q7QUFrR2hEOzs7Ozs7Ozs7R0FTRztBQUNILE1BQXNCLGFBQWMsU0FBUSxhQUFLO0lBVy9DLFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBeUI7UUFDakUsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7Ozs7OzsrQ0FaTixhQUFhOzs7O1FBYS9CLElBQUksQ0FBQyxTQUFTLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN4QixJQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUM7UUFDN0IsSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUMsU0FBUyxDQUFDO1FBQ2pDLElBQUksQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDLFdBQVcsQ0FBQztLQUN0QztJQUVEOzs7OztPQUtHO0lBQ0ksUUFBUSxDQUFDLFFBQW9CLEVBQUU7Ozs7Ozs7Ozs7UUFDcEMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUN2QixPQUFPLElBQUksQ0FBQztLQUNiO0lBRUQ7Ozs7O09BS0c7SUFDSSxRQUFRLENBQUMsT0FBbUIsRUFBRSxRQUFvQixFQUFFOzs7Ozs7Ozs7OztRQUN6RCxLQUFLLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDM0MsT0FBTyxJQUFJLENBQUM7S0FDYjtJQUVEOztPQUVHO0lBQ0ksSUFBSSxDQUFDLElBQWdCOzs7Ozs7Ozs7O1FBQzFCLEtBQUssQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ2hDLE9BQU8sYUFBSyxDQUFDLFFBQVEsQ0FB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QUFjLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQztZQUN6QyxVQUFVLEVBQUUsc0JBQWMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDO1lBQzNDLFVBQVUsRUFBRSxzQkFBYyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUM7WUFDM0MsR0FBRyxJQUFJLENBQUMsb0JBQW9CLEVBQUU7WUFDOUIsR0FBRyxJQUFJLENBQUMsaUJBQWlCLEVBQUU7U0FDNUIsQ0FBQztLQUNIOztBQXZNSCxzQ0F3TUM7OztBQTRCRDs7Ozs7OztHQU9HO0FBQ0gsSUFBWSxrQkFzQlg7QUF0QkQsV0FBWSxrQkFBa0I7SUFDNUI7Ozs7T0FJRztJQUNILDJEQUFxQyxDQUFBO0lBRXJDOzs7O09BSUc7SUFDSCx5Q0FBbUIsQ0FBQTtJQUVuQjs7Ozs7T0FLRztJQUNILGlFQUEyQyxDQUFBO0FBQzdDLENBQUMsRUF0Qlcsa0JBQWtCLEdBQWxCLDBCQUFrQixLQUFsQiwwQkFBa0IsUUFzQjdCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgY2xvdWR3YXRjaCBmcm9tICdAYXdzLWNkay9hd3MtY2xvdWR3YXRjaCc7XG5pbXBvcnQgKiBhcyBpYW0gZnJvbSAnQGF3cy1jZGsvYXdzLWlhbSc7XG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCB7IENoYWluIH0gZnJvbSAnLi4vY2hhaW4nO1xuaW1wb3J0IHsgRmllbGRVdGlscyB9IGZyb20gJy4uL2ZpZWxkcyc7XG5pbXBvcnQgeyBTdGF0ZUdyYXBoIH0gZnJvbSAnLi4vc3RhdGUtZ3JhcGgnO1xuaW1wb3J0IHsgQ3JlZGVudGlhbHMgfSBmcm9tICcuLi90YXNrLWNyZWRlbnRpYWxzJztcbmltcG9ydCB7IENhdGNoUHJvcHMsIElDaGFpbmFibGUsIElOZXh0YWJsZSwgUmV0cnlQcm9wcyB9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCB7IHJlbmRlckpzb25QYXRoLCBTdGF0ZSB9IGZyb20gJy4vc3RhdGUnO1xuXG5cbi8qKlxuICogUHJvcHMgdGhhdCBhcmUgY29tbW9uIHRvIGFsbCB0YXNrc1xuICovXG5leHBvcnQgaW50ZXJmYWNlIFRhc2tTdGF0ZUJhc2VQcm9wcyB7XG4gIC8qKlxuICAgKiBBbiBvcHRpb25hbCBkZXNjcmlwdGlvbiBmb3IgdGhpcyBzdGF0ZVxuICAgKlxuICAgKiBAZGVmYXVsdCAtIE5vIGNvbW1lbnRcbiAgICovXG4gIHJlYWRvbmx5IGNvbW1lbnQ/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIEpTT05QYXRoIGV4cHJlc3Npb24gdG8gc2VsZWN0IHBhcnQgb2YgdGhlIHN0YXRlIHRvIGJlIHRoZSBpbnB1dCB0byB0aGlzIHN0YXRlLlxuICAgKlxuICAgKiBNYXkgYWxzbyBiZSB0aGUgc3BlY2lhbCB2YWx1ZSBKc29uUGF0aC5ESVNDQVJELCB3aGljaCB3aWxsIGNhdXNlIHRoZSBlZmZlY3RpdmVcbiAgICogaW5wdXQgdG8gYmUgdGhlIGVtcHR5IG9iamVjdCB7fS5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBUaGUgZW50aXJlIHRhc2sgaW5wdXQgKEpTT04gcGF0aCAnJCcpXG4gICAqL1xuICByZWFkb25seSBpbnB1dFBhdGg/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIEpTT05QYXRoIGV4cHJlc3Npb24gdG8gc2VsZWN0IHNlbGVjdCBhIHBvcnRpb24gb2YgdGhlIHN0YXRlIG91dHB1dCB0byBwYXNzXG4gICAqIHRvIHRoZSBuZXh0IHN0YXRlLlxuICAgKlxuICAgKiBNYXkgYWxzbyBiZSB0aGUgc3BlY2lhbCB2YWx1ZSBKc29uUGF0aC5ESVNDQVJELCB3aGljaCB3aWxsIGNhdXNlIHRoZSBlZmZlY3RpdmVcbiAgICogb3V0cHV0IHRvIGJlIHRoZSBlbXB0eSBvYmplY3Qge30uXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gVGhlIGVudGlyZSBKU09OIG5vZGUgZGV0ZXJtaW5lZCBieSB0aGUgc3RhdGUgaW5wdXQsIHRoZSB0YXNrIHJlc3VsdCxcbiAgICogICBhbmQgcmVzdWx0UGF0aCBpcyBwYXNzZWQgdG8gdGhlIG5leHQgc3RhdGUgKEpTT04gcGF0aCAnJCcpXG4gICAqL1xuICByZWFkb25seSBvdXRwdXRQYXRoPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBKU09OUGF0aCBleHByZXNzaW9uIHRvIGluZGljYXRlIHdoZXJlIHRvIGluamVjdCB0aGUgc3RhdGUncyBvdXRwdXRcbiAgICpcbiAgICogTWF5IGFsc28gYmUgdGhlIHNwZWNpYWwgdmFsdWUgSnNvblBhdGguRElTQ0FSRCwgd2hpY2ggd2lsbCBjYXVzZSB0aGUgc3RhdGUnc1xuICAgKiBpbnB1dCB0byBiZWNvbWUgaXRzIG91dHB1dC5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBSZXBsYWNlcyB0aGUgZW50aXJlIGlucHV0IHdpdGggdGhlIHJlc3VsdCAoSlNPTiBwYXRoICckJylcbiAgICovXG4gIHJlYWRvbmx5IHJlc3VsdFBhdGg/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBKU09OIHRoYXQgd2lsbCByZXBsYWNlIHRoZSBzdGF0ZSdzIHJhdyByZXN1bHQgYW5kIGJlY29tZSB0aGUgZWZmZWN0aXZlXG4gICAqIHJlc3VsdCBiZWZvcmUgUmVzdWx0UGF0aCBpcyBhcHBsaWVkLlxuICAgKlxuICAgKiBZb3UgY2FuIHVzZSBSZXN1bHRTZWxlY3RvciB0byBjcmVhdGUgYSBwYXlsb2FkIHdpdGggdmFsdWVzIHRoYXQgYXJlIHN0YXRpY1xuICAgKiBvciBzZWxlY3RlZCBmcm9tIHRoZSBzdGF0ZSdzIHJhdyByZXN1bHQuXG4gICAqXG4gICAqIEBzZWVcbiAgICogaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL3N0ZXAtZnVuY3Rpb25zL2xhdGVzdC9kZy9pbnB1dC1vdXRwdXQtaW5wdXRwYXRoLXBhcmFtcy5odG1sI2lucHV0LW91dHB1dC1yZXN1bHRzZWxlY3RvclxuICAgKlxuICAgKiBAZGVmYXVsdCAtIE5vbmVcbiAgICovXG4gIHJlYWRvbmx5IHJlc3VsdFNlbGVjdG9yPzogeyBba2V5OiBzdHJpbmddOiBhbnkgfTtcblxuICAvKipcbiAgICogVGltZW91dCBmb3IgdGhlIHN0YXRlIG1hY2hpbmVcbiAgICpcbiAgICogQGRlZmF1bHQgLSBOb25lXG4gICAqL1xuICByZWFkb25seSB0aW1lb3V0PzogY2RrLkR1cmF0aW9uO1xuXG4gIC8qKlxuICAgKiBUaW1lb3V0IGZvciB0aGUgaGVhcnRiZWF0XG4gICAqXG4gICAqIEBkZWZhdWx0IC0gTm9uZVxuICAgKi9cbiAgcmVhZG9ubHkgaGVhcnRiZWF0PzogY2RrLkR1cmF0aW9uO1xuXG4gIC8qKlxuICAgKiBBV1MgU3RlcCBGdW5jdGlvbnMgaW50ZWdyYXRlcyB3aXRoIHNlcnZpY2VzIGRpcmVjdGx5IGluIHRoZSBBbWF6b24gU3RhdGVzIExhbmd1YWdlLlxuICAgKiBZb3UgY2FuIGNvbnRyb2wgdGhlc2UgQVdTIHNlcnZpY2VzIHVzaW5nIHNlcnZpY2UgaW50ZWdyYXRpb24gcGF0dGVybnNcbiAgICpcbiAgICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vc3RlcC1mdW5jdGlvbnMvbGF0ZXN0L2RnL2Nvbm5lY3QtdG8tcmVzb3VyY2UuaHRtbCNjb25uZWN0LXdhaXQtdG9rZW5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBgSW50ZWdyYXRpb25QYXR0ZXJuLlJFUVVFU1RfUkVTUE9OU0VgIGZvciBtb3N0IHRhc2tzLlxuICAgKiBgSW50ZWdyYXRpb25QYXR0ZXJuLlJVTl9KT0JgIGZvciB0aGUgZm9sbG93aW5nIGV4Y2VwdGlvbnM6XG4gICAqICBgQmF0Y2hTdWJtaXRKb2JgLCBgRW1yQWRkU3RlcGAsIGBFbXJDcmVhdGVDbHVzdGVyYCwgYEVtclRlcm1pbmF0aW9uQ2x1c3RlcmAsIGFuZCBgRW1yQ29udGFpbmVyc1N0YXJ0Sm9iUnVuYC5cbiAgICpcbiAgICovXG4gIHJlYWRvbmx5IGludGVncmF0aW9uUGF0dGVybj86IEludGVncmF0aW9uUGF0dGVybjtcblxuICAvKipcbiAgICogQ3JlZGVudGlhbHMgZm9yIGFuIElBTSBSb2xlIHRoYXQgdGhlIFN0YXRlIE1hY2hpbmUgYXNzdW1lcyBmb3IgZXhlY3V0aW5nIHRoZSB0YXNrLlxuICAgKiBUaGlzIGVuYWJsZXMgY3Jvc3MtYWNjb3VudCByZXNvdXJjZSBpbnZvY2F0aW9ucy5cbiAgICpcbiAgICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vc3RlcC1mdW5jdGlvbnMvbGF0ZXN0L2RnL2NvbmNlcHRzLWFjY2Vzcy1jcm9zcy1hY2N0LXJlc291cmNlcy5odG1sXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gTm9uZSAoVGFzayBpcyBleGVjdXRlZCB1c2luZyB0aGUgU3RhdGUgTWFjaGluZSdzIGV4ZWN1dGlvbiByb2xlKVxuICAgKi9cbiAgcmVhZG9ubHkgY3JlZGVudGlhbHM/OiBDcmVkZW50aWFscztcbn1cblxuLyoqXG4gKiBEZWZpbmUgYSBUYXNrIHN0YXRlIGluIHRoZSBzdGF0ZSBtYWNoaW5lXG4gKlxuICogUmVhY2hpbmcgYSBUYXNrIHN0YXRlIGNhdXNlcyBzb21lIHdvcmsgdG8gYmUgZXhlY3V0ZWQsIHJlcHJlc2VudGVkIGJ5IHRoZVxuICogVGFzaydzIHJlc291cmNlIHByb3BlcnR5LiBUYXNrIGNvbnN0cnVjdHMgcmVwcmVzZW50IGEgZ2VuZXJpYyBBbWF6b25cbiAqIFN0YXRlcyBMYW5ndWFnZSBUYXNrLlxuICpcbiAqIEZvciBzb21lIHJlc291cmNlIHR5cGVzLCBtb3JlIHNwZWNpZmljIHN1YmNsYXNzZXMgb2YgVGFzayBtYXkgYmUgYXZhaWxhYmxlXG4gKiB3aGljaCBhcmUgbW9yZSBjb252ZW5pZW50IHRvIHVzZS5cbiAqL1xuZXhwb3J0IGFic3RyYWN0IGNsYXNzIFRhc2tTdGF0ZUJhc2UgZXh0ZW5kcyBTdGF0ZSBpbXBsZW1lbnRzIElOZXh0YWJsZSB7XG5cbiAgcHVibGljIHJlYWRvbmx5IGVuZFN0YXRlczogSU5leHRhYmxlW107XG5cbiAgcHJvdGVjdGVkIGFic3RyYWN0IHJlYWRvbmx5IHRhc2tNZXRyaWNzPzogVGFza01ldHJpY3NDb25maWc7XG4gIHByb3RlY3RlZCBhYnN0cmFjdCByZWFkb25seSB0YXNrUG9saWNpZXM/OiBpYW0uUG9saWN5U3RhdGVtZW50W107XG5cbiAgcHJpdmF0ZSByZWFkb25seSB0aW1lb3V0PzogY2RrLkR1cmF0aW9uO1xuICBwcml2YXRlIHJlYWRvbmx5IGhlYXJ0YmVhdD86IGNkay5EdXJhdGlvbjtcbiAgcHJpdmF0ZSByZWFkb25seSBjcmVkZW50aWFscz86IENyZWRlbnRpYWxzO1xuXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBUYXNrU3RhdGVCYXNlUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHByb3BzKTtcbiAgICB0aGlzLmVuZFN0YXRlcyA9IFt0aGlzXTtcbiAgICB0aGlzLnRpbWVvdXQgPSBwcm9wcy50aW1lb3V0O1xuICAgIHRoaXMuaGVhcnRiZWF0ID0gcHJvcHMuaGVhcnRiZWF0O1xuICAgIHRoaXMuY3JlZGVudGlhbHMgPSBwcm9wcy5jcmVkZW50aWFscztcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgcmV0cnkgY29uZmlndXJhdGlvbiBmb3IgdGhpcyBzdGF0ZVxuICAgKlxuICAgKiBUaGlzIGNvbnRyb2xzIGlmIGFuZCBob3cgdGhlIGV4ZWN1dGlvbiB3aWxsIGJlIHJldHJpZWQgaWYgYSBwYXJ0aWN1bGFyXG4gICAqIGVycm9yIG9jY3Vycy5cbiAgICovXG4gIHB1YmxpYyBhZGRSZXRyeShwcm9wczogUmV0cnlQcm9wcyA9IHt9KTogVGFza1N0YXRlQmFzZSB7XG4gICAgc3VwZXIuX2FkZFJldHJ5KHByb3BzKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgYSByZWNvdmVyeSBoYW5kbGVyIGZvciB0aGlzIHN0YXRlXG4gICAqXG4gICAqIFdoZW4gYSBwYXJ0aWN1bGFyIGVycm9yIG9jY3VycywgZXhlY3V0aW9uIHdpbGwgY29udGludWUgYXQgdGhlIGVycm9yXG4gICAqIGhhbmRsZXIgaW5zdGVhZCBvZiBmYWlsaW5nIHRoZSBzdGF0ZSBtYWNoaW5lIGV4ZWN1dGlvbi5cbiAgICovXG4gIHB1YmxpYyBhZGRDYXRjaChoYW5kbGVyOiBJQ2hhaW5hYmxlLCBwcm9wczogQ2F0Y2hQcm9wcyA9IHt9KTogVGFza1N0YXRlQmFzZSB7XG4gICAgc3VwZXIuX2FkZENhdGNoKGhhbmRsZXIuc3RhcnRTdGF0ZSwgcHJvcHMpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIENvbnRpbnVlIG5vcm1hbCBleGVjdXRpb24gd2l0aCB0aGUgZ2l2ZW4gc3RhdGVcbiAgICovXG4gIHB1YmxpYyBuZXh0KG5leHQ6IElDaGFpbmFibGUpOiBDaGFpbiB7XG4gICAgc3VwZXIubWFrZU5leHQobmV4dC5zdGFydFN0YXRlKTtcbiAgICByZXR1cm4gQ2hhaW4uc2VxdWVuY2UodGhpcywgbmV4dCk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJuIHRoZSBBbWF6b24gU3RhdGVzIExhbmd1YWdlIG9iamVjdCBmb3IgdGhpcyBzdGF0ZVxuICAgKi9cbiAgcHVibGljIHRvU3RhdGVKc29uKCk6IG9iamVjdCB7XG4gICAgcmV0dXJuIHtcbiAgICAgIC4uLnRoaXMucmVuZGVyTmV4dEVuZCgpLFxuICAgICAgLi4udGhpcy5yZW5kZXJSZXRyeUNhdGNoKCksXG4gICAgICAuLi50aGlzLnJlbmRlclRhc2tCYXNlKCksXG4gICAgICAuLi50aGlzLl9yZW5kZXJUYXNrKCksXG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm4gdGhlIGdpdmVuIG5hbWVkIG1ldHJpYyBmb3IgdGhpcyBUYXNrXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gc3VtIG92ZXIgNSBtaW51dGVzXG4gICAqL1xuICBwdWJsaWMgbWV0cmljKG1ldHJpY05hbWU6IHN0cmluZywgcHJvcHM/OiBjbG91ZHdhdGNoLk1ldHJpY09wdGlvbnMpOiBjbG91ZHdhdGNoLk1ldHJpYyB7XG4gICAgcmV0dXJuIG5ldyBjbG91ZHdhdGNoLk1ldHJpYyh7XG4gICAgICBuYW1lc3BhY2U6ICdBV1MvU3RhdGVzJyxcbiAgICAgIG1ldHJpY05hbWUsXG4gICAgICBkaW1lbnNpb25zTWFwOiB0aGlzLnRhc2tNZXRyaWNzPy5tZXRyaWNEaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnc3VtJyxcbiAgICAgIC4uLnByb3BzLFxuICAgIH0pLmF0dGFjaFRvKHRoaXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBpbnRlcnZhbCwgaW4gbWlsbGlzZWNvbmRzLCBiZXR3ZWVuIHRoZSB0aW1lIHRoZSBUYXNrIHN0YXJ0cyBhbmQgdGhlIHRpbWUgaXQgY2xvc2VzLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIGF2ZXJhZ2Ugb3ZlciA1IG1pbnV0ZXNcbiAgICovXG4gIHB1YmxpYyBtZXRyaWNSdW5UaW1lKHByb3BzPzogY2xvdWR3YXRjaC5NZXRyaWNPcHRpb25zKTogY2xvdWR3YXRjaC5NZXRyaWMge1xuICAgIHJldHVybiB0aGlzLnRhc2tNZXRyaWModGhpcy50YXNrTWV0cmljcz8ubWV0cmljUHJlZml4U2luZ3VsYXIsICdSdW5UaW1lJywgeyBzdGF0aXN0aWM6ICdhdmcnLCAuLi5wcm9wcyB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgaW50ZXJ2YWwsIGluIG1pbGxpc2Vjb25kcywgZm9yIHdoaWNoIHRoZSBhY3Rpdml0eSBzdGF5cyBpbiB0aGUgc2NoZWR1bGUgc3RhdGUuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gYXZlcmFnZSBvdmVyIDUgbWludXRlc1xuICAgKi9cbiAgcHVibGljIG1ldHJpY1NjaGVkdWxlVGltZShwcm9wcz86IGNsb3Vkd2F0Y2guTWV0cmljT3B0aW9ucyk6IGNsb3Vkd2F0Y2guTWV0cmljIHtcbiAgICByZXR1cm4gdGhpcy50YXNrTWV0cmljKHRoaXMudGFza01ldHJpY3M/Lm1ldHJpY1ByZWZpeFNpbmd1bGFyLCAnU2NoZWR1bGVUaW1lJywgeyBzdGF0aXN0aWM6ICdhdmcnLCAuLi5wcm9wcyB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgaW50ZXJ2YWwsIGluIG1pbGxpc2Vjb25kcywgYmV0d2VlbiB0aGUgdGltZSB0aGUgYWN0aXZpdHkgaXMgc2NoZWR1bGVkIGFuZCB0aGUgdGltZSBpdCBjbG9zZXMuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gYXZlcmFnZSBvdmVyIDUgbWludXRlc1xuICAgKi9cbiAgcHVibGljIG1ldHJpY1RpbWUocHJvcHM/OiBjbG91ZHdhdGNoLk1ldHJpY09wdGlvbnMpOiBjbG91ZHdhdGNoLk1ldHJpYyB7XG4gICAgcmV0dXJuIHRoaXMudGFza01ldHJpYyh0aGlzLnRhc2tNZXRyaWNzPy5tZXRyaWNQcmVmaXhTaW5ndWxhciwgJ1RpbWUnLCB7IHN0YXRpc3RpYzogJ2F2ZycsIC4uLnByb3BzIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIE1ldHJpYyBmb3IgdGhlIG51bWJlciBvZiB0aW1lcyB0aGlzIGFjdGl2aXR5IGlzIHNjaGVkdWxlZFxuICAgKlxuICAgKiBAZGVmYXVsdCAtIHN1bSBvdmVyIDUgbWludXRlc1xuICAgKi9cbiAgcHVibGljIG1ldHJpY1NjaGVkdWxlZChwcm9wcz86IGNsb3Vkd2F0Y2guTWV0cmljT3B0aW9ucyk6IGNsb3Vkd2F0Y2guTWV0cmljIHtcbiAgICByZXR1cm4gdGhpcy50YXNrTWV0cmljKHRoaXMudGFza01ldHJpY3M/Lm1ldHJpY1ByZWZpeFBsdXJhbCwgJ1NjaGVkdWxlZCcsIHByb3BzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBNZXRyaWMgZm9yIHRoZSBudW1iZXIgb2YgdGltZXMgdGhpcyBhY3Rpdml0eSB0aW1lcyBvdXRcbiAgICpcbiAgICogQGRlZmF1bHQgLSBzdW0gb3ZlciA1IG1pbnV0ZXNcbiAgICovXG4gIHB1YmxpYyBtZXRyaWNUaW1lZE91dChwcm9wcz86IGNsb3Vkd2F0Y2guTWV0cmljT3B0aW9ucyk6IGNsb3Vkd2F0Y2guTWV0cmljIHtcbiAgICByZXR1cm4gdGhpcy50YXNrTWV0cmljKHRoaXMudGFza01ldHJpY3M/Lm1ldHJpY1ByZWZpeFBsdXJhbCwgJ1RpbWVkT3V0JywgcHJvcHMpO1xuICB9XG5cbiAgLyoqXG4gICAqIE1ldHJpYyBmb3IgdGhlIG51bWJlciBvZiB0aW1lcyB0aGlzIGFjdGl2aXR5IGlzIHN0YXJ0ZWRcbiAgICpcbiAgICogQGRlZmF1bHQgLSBzdW0gb3ZlciA1IG1pbnV0ZXNcbiAgICovXG4gIHB1YmxpYyBtZXRyaWNTdGFydGVkKHByb3BzPzogY2xvdWR3YXRjaC5NZXRyaWNPcHRpb25zKTogY2xvdWR3YXRjaC5NZXRyaWMge1xuICAgIHJldHVybiB0aGlzLnRhc2tNZXRyaWModGhpcy50YXNrTWV0cmljcz8ubWV0cmljUHJlZml4UGx1cmFsLCAnU3RhcnRlZCcsIHByb3BzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBNZXRyaWMgZm9yIHRoZSBudW1iZXIgb2YgdGltZXMgdGhpcyBhY3Rpdml0eSBzdWNjZWVkc1xuICAgKlxuICAgKiBAZGVmYXVsdCAtIHN1bSBvdmVyIDUgbWludXRlc1xuICAgKi9cbiAgcHVibGljIG1ldHJpY1N1Y2NlZWRlZChwcm9wcz86IGNsb3Vkd2F0Y2guTWV0cmljT3B0aW9ucyk6IGNsb3Vkd2F0Y2guTWV0cmljIHtcbiAgICByZXR1cm4gdGhpcy50YXNrTWV0cmljKHRoaXMudGFza01ldHJpY3M/Lm1ldHJpY1ByZWZpeFBsdXJhbCwgJ1N1Y2NlZWRlZCcsIHByb3BzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBNZXRyaWMgZm9yIHRoZSBudW1iZXIgb2YgdGltZXMgdGhpcyBhY3Rpdml0eSBmYWlsc1xuICAgKlxuICAgKiBAZGVmYXVsdCAtIHN1bSBvdmVyIDUgbWludXRlc1xuICAgKi9cbiAgcHVibGljIG1ldHJpY0ZhaWxlZChwcm9wcz86IGNsb3Vkd2F0Y2guTWV0cmljT3B0aW9ucyk6IGNsb3Vkd2F0Y2guTWV0cmljIHtcbiAgICByZXR1cm4gdGhpcy50YXNrTWV0cmljKHRoaXMudGFza01ldHJpY3M/Lm1ldHJpY1ByZWZpeFBsdXJhbCwgJ0ZhaWxlZCcsIHByb3BzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBNZXRyaWMgZm9yIHRoZSBudW1iZXIgb2YgdGltZXMgdGhlIGhlYXJ0YmVhdCB0aW1lcyBvdXQgZm9yIHRoaXMgYWN0aXZpdHlcbiAgICpcbiAgICogQGRlZmF1bHQgLSBzdW0gb3ZlciA1IG1pbnV0ZXNcbiAgICovXG4gIHB1YmxpYyBtZXRyaWNIZWFydGJlYXRUaW1lZE91dChwcm9wcz86IGNsb3Vkd2F0Y2guTWV0cmljT3B0aW9ucyk6IGNsb3Vkd2F0Y2guTWV0cmljIHtcbiAgICByZXR1cm4gdGhpcy50YXNrTWV0cmljKHRoaXMudGFza01ldHJpY3M/Lm1ldHJpY1ByZWZpeFBsdXJhbCwgJ0hlYXJ0YmVhdFRpbWVkT3V0JywgcHJvcHMpO1xuICB9XG5cbiAgcHJvdGVjdGVkIHdoZW5Cb3VuZFRvR3JhcGgoZ3JhcGg6IFN0YXRlR3JhcGgpIHtcbiAgICBzdXBlci53aGVuQm91bmRUb0dyYXBoKGdyYXBoKTtcbiAgICBmb3IgKGNvbnN0IHBvbGljeVN0YXRlbWVudCBvZiB0aGlzLnRhc2tQb2xpY2llcyB8fCBbXSkge1xuICAgICAgZ3JhcGgucmVnaXN0ZXJQb2xpY3lTdGF0ZW1lbnQocG9saWN5U3RhdGVtZW50KTtcbiAgICB9XG4gICAgaWYgKHRoaXMuY3JlZGVudGlhbHMpIHtcbiAgICAgIGdyYXBoLnJlZ2lzdGVyUG9saWN5U3RhdGVtZW50KG5ldyBpYW0uUG9saWN5U3RhdGVtZW50KHtcbiAgICAgICAgZWZmZWN0OiBpYW0uRWZmZWN0LkFMTE9XLFxuICAgICAgICBhY3Rpb25zOiBbJ3N0czpBc3N1bWVSb2xlJ10sXG4gICAgICAgIHJlc291cmNlczogW3RoaXMuY3JlZGVudGlhbHMucm9sZS5yZXNvdXJjZV0sXG4gICAgICB9KSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgcHJvdGVjdGVkIGFic3RyYWN0IF9yZW5kZXJUYXNrKCk6IGFueTtcblxuICBwcml2YXRlIHRhc2tNZXRyaWMocHJlZml4OiBzdHJpbmcgfCB1bmRlZmluZWQsIHN1ZmZpeDogc3RyaW5nLCBwcm9wcz86IGNsb3Vkd2F0Y2guTWV0cmljT3B0aW9ucyk6IGNsb3Vkd2F0Y2guTWV0cmljIHtcbiAgICBpZiAocHJlZml4ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignVGFzayBkb2VzIG5vdCBleHBvc2UgbWV0cmljcy4gVXNlIHRoZSBcXCdtZXRyaWMoKVxcJyBmdW5jdGlvbiB0byBhZGQgbWV0cmljcy4nKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMubWV0cmljKHByZWZpeCArIHN1ZmZpeCwgcHJvcHMpO1xuICB9XG5cbiAgcHJpdmF0ZSByZW5kZXJDcmVkZW50aWFscygpIHtcbiAgICByZXR1cm4gdGhpcy5jcmVkZW50aWFscyA/IEZpZWxkVXRpbHMucmVuZGVyT2JqZWN0KHsgQ3JlZGVudGlhbHM6IHsgUm9sZUFybjogdGhpcy5jcmVkZW50aWFscy5yb2xlLnJvbGVBcm4gfSB9KSA6IHVuZGVmaW5lZDtcbiAgfVxuXG4gIHByaXZhdGUgcmVuZGVyVGFza0Jhc2UoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIFR5cGU6ICdUYXNrJyxcbiAgICAgIENvbW1lbnQ6IHRoaXMuY29tbWVudCxcbiAgICAgIFRpbWVvdXRTZWNvbmRzOiB0aGlzLnRpbWVvdXQ/LnRvU2Vjb25kcygpLFxuICAgICAgSGVhcnRiZWF0U2Vjb25kczogdGhpcy5oZWFydGJlYXQ/LnRvU2Vjb25kcygpLFxuICAgICAgSW5wdXRQYXRoOiByZW5kZXJKc29uUGF0aCh0aGlzLmlucHV0UGF0aCksXG4gICAgICBPdXRwdXRQYXRoOiByZW5kZXJKc29uUGF0aCh0aGlzLm91dHB1dFBhdGgpLFxuICAgICAgUmVzdWx0UGF0aDogcmVuZGVySnNvblBhdGgodGhpcy5yZXN1bHRQYXRoKSxcbiAgICAgIC4uLnRoaXMucmVuZGVyUmVzdWx0U2VsZWN0b3IoKSxcbiAgICAgIC4uLnRoaXMucmVuZGVyQ3JlZGVudGlhbHMoKSxcbiAgICB9O1xuICB9XG59XG5cbi8qKlxuICogVGFzayBNZXRyaWNzXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgVGFza01ldHJpY3NDb25maWcge1xuICAvKipcbiAgICogUHJlZml4IGZvciBzaW5ndWxhciBtZXRyaWMgbmFtZXMgb2YgYWN0aXZpdHkgYWN0aW9uc1xuICAgKlxuICAgKiBAZGVmYXVsdCAtIE5vIHN1Y2ggbWV0cmljc1xuICAgKi9cbiAgcmVhZG9ubHkgbWV0cmljUHJlZml4U2luZ3VsYXI/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFByZWZpeCBmb3IgcGx1cmFsIG1ldHJpYyBuYW1lcyBvZiBhY3Rpdml0eSBhY3Rpb25zXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gTm8gc3VjaCBtZXRyaWNzXG4gICAqL1xuICByZWFkb25seSBtZXRyaWNQcmVmaXhQbHVyYWw/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBkaW1lbnNpb25zIHRvIGF0dGFjaCB0byBtZXRyaWNzXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gTm8gbWV0cmljc1xuICAgKi9cbiAgcmVhZG9ubHkgbWV0cmljRGltZW5zaW9ucz86IGNsb3Vkd2F0Y2guRGltZW5zaW9uSGFzaDtcbn1cblxuLyoqXG4gKlxuICogQVdTIFN0ZXAgRnVuY3Rpb25zIGludGVncmF0ZXMgd2l0aCBzZXJ2aWNlcyBkaXJlY3RseSBpbiB0aGUgQW1hem9uIFN0YXRlcyBMYW5ndWFnZS5cbiAqIFlvdSBjYW4gY29udHJvbCB0aGVzZSBBV1Mgc2VydmljZXMgdXNpbmcgc2VydmljZSBpbnRlZ3JhdGlvbiBwYXR0ZXJuczpcbiAqXG4gKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9zdGVwLWZ1bmN0aW9ucy9sYXRlc3QvZGcvY29ubmVjdC10by1yZXNvdXJjZS5odG1sXG4gKlxuICovXG5leHBvcnQgZW51bSBJbnRlZ3JhdGlvblBhdHRlcm4ge1xuICAvKipcbiAgICogU3RlcCBGdW5jdGlvbnMgd2lsbCB3YWl0IGZvciBhbiBIVFRQIHJlc3BvbnNlIGFuZCB0aGVuIHByb2dyZXNzIHRvIHRoZSBuZXh0IHN0YXRlLlxuICAgKlxuICAgKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9zdGVwLWZ1bmN0aW9ucy9sYXRlc3QvZGcvY29ubmVjdC10by1yZXNvdXJjZS5odG1sI2Nvbm5lY3QtZGVmYXVsdFxuICAgKi9cbiAgUkVRVUVTVF9SRVNQT05TRSA9ICdSRVFVRVNUX1JFU1BPTlNFJyxcblxuICAvKipcbiAgICogU3RlcCBGdW5jdGlvbnMgY2FuIHdhaXQgZm9yIGEgcmVxdWVzdCB0byBjb21wbGV0ZSBiZWZvcmUgcHJvZ3Jlc3NpbmcgdG8gdGhlIG5leHQgc3RhdGUuXG4gICAqXG4gICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL3N0ZXAtZnVuY3Rpb25zL2xhdGVzdC9kZy9jb25uZWN0LXRvLXJlc291cmNlLmh0bWwjY29ubmVjdC1zeW5jXG4gICAqL1xuICBSVU5fSk9CID0gJ1JVTl9KT0InLFxuXG4gIC8qKlxuICAgKiBDYWxsYmFjayB0YXNrcyBwcm92aWRlIGEgd2F5IHRvIHBhdXNlIGEgd29ya2Zsb3cgdW50aWwgYSB0YXNrIHRva2VuIGlzIHJldHVybmVkLlxuICAgKiBZb3UgbXVzdCBzZXQgYSB0YXNrIHRva2VuIHdoZW4gdXNpbmcgdGhlIGNhbGxiYWNrIHBhdHRlcm5cbiAgICpcbiAgICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vc3RlcC1mdW5jdGlvbnMvbGF0ZXN0L2RnL2Nvbm5lY3QtdG8tcmVzb3VyY2UuaHRtbCNjb25uZWN0LXdhaXQtdG9rZW5cbiAgICovXG4gIFdBSVRfRk9SX1RBU0tfVE9LRU4gPSAnV0FJVF9GT1JfVEFTS19UT0tFTidcbn1cbiJdfQ==