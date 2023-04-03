"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Task = void 0;
const jsiiDeprecationWarnings = require("../../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const cloudwatch = require("@aws-cdk/aws-cloudwatch");
const state_type_1 = require("./private/state-type");
const state_1 = require("./state");
const chain_1 = require("../chain");
const fields_1 = require("../fields");
const util_1 = require("../util");
/**
 * Define a Task state in the state machine
 *
 * Reaching a Task state causes some work to be executed, represented by the
 * Task's resource property. Task constructs represent a generic Amazon
 * States Language Task.
 *
 * For some resource types, more specific subclasses of Task may be available
 * which are more convenient to use.
 *
 * @deprecated - replaced by service integration specific classes (i.e. LambdaInvoke, SnsPublish)
 */
class Task extends state_1.State {
    constructor(scope, id, props) {
        super(scope, id, props);
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-stepfunctions.Task", "- replaced by service integration specific classes (i.e. LambdaInvoke, SnsPublish)");
            jsiiDeprecationWarnings._aws_cdk_aws_stepfunctions_TaskProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, Task);
            }
            throw error;
        }
        this.timeout = props.timeout;
        const taskProps = props.task.bind(this);
        this.taskProps = {
            ...taskProps,
            parameters: util_1.noEmptyObject({ ...taskProps.parameters || {}, ...props.parameters || {} }),
        };
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
            jsiiDeprecationWarnings.print("@aws-cdk/aws-stepfunctions.Task#addRetry", "- replaced by service integration specific classes (i.e. LambdaInvoke, SnsPublish)");
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
            jsiiDeprecationWarnings.print("@aws-cdk/aws-stepfunctions.Task#addCatch", "- replaced by service integration specific classes (i.e. LambdaInvoke, SnsPublish)");
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
            jsiiDeprecationWarnings.print("@aws-cdk/aws-stepfunctions.Task#next", "- replaced by service integration specific classes (i.e. LambdaInvoke, SnsPublish)");
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
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-stepfunctions.Task#toStateJson", "- replaced by service integration specific classes (i.e. LambdaInvoke, SnsPublish)");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.toStateJson);
            }
            throw error;
        }
        return {
            ...this.renderNextEnd(),
            ...this.renderRetryCatch(),
            ...this.renderInputOutput(),
            Type: state_type_1.StateType.TASK,
            Comment: this.comment,
            Resource: this.taskProps.resourceArn,
            Parameters: this.taskProps.parameters && fields_1.FieldUtils.renderObject(this.taskProps.parameters),
            ResultPath: state_1.renderJsonPath(this.resultPath),
            TimeoutSeconds: this.timeout && this.timeout.toSeconds(),
            HeartbeatSeconds: this.taskProps.heartbeat && this.taskProps.heartbeat.toSeconds(),
        };
    }
    /**
     * Return the given named metric for this Task
     *
     * @default sum over 5 minutes
     */
    metric(metricName, props) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-stepfunctions.Task#metric", "- replaced by service integration specific classes (i.e. LambdaInvoke, SnsPublish)");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.metric);
            }
            throw error;
        }
        return new cloudwatch.Metric({
            namespace: 'AWS/States',
            metricName,
            dimensions: this.taskProps.metricDimensions,
            statistic: 'sum',
            ...props,
        }).attachTo(this);
    }
    /**
     * The interval, in milliseconds, between the time the Task starts and the time it closes.
     *
     * @default average over 5 minutes
     */
    metricRunTime(props) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-stepfunctions.Task#metricRunTime", "- replaced by service integration specific classes (i.e. LambdaInvoke, SnsPublish)");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.metricRunTime);
            }
            throw error;
        }
        return this.taskMetric(this.taskProps.metricPrefixSingular, 'RunTime', { statistic: 'avg', ...props });
    }
    /**
     * The interval, in milliseconds, for which the activity stays in the schedule state.
     *
     * @default average over 5 minutes
     */
    metricScheduleTime(props) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-stepfunctions.Task#metricScheduleTime", "- replaced by service integration specific classes (i.e. LambdaInvoke, SnsPublish)");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.metricScheduleTime);
            }
            throw error;
        }
        return this.taskMetric(this.taskProps.metricPrefixSingular, 'ScheduleTime', { statistic: 'avg', ...props });
    }
    /**
     * The interval, in milliseconds, between the time the activity is scheduled and the time it closes.
     *
     * @default average over 5 minutes
     */
    metricTime(props) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-stepfunctions.Task#metricTime", "- replaced by service integration specific classes (i.e. LambdaInvoke, SnsPublish)");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.metricTime);
            }
            throw error;
        }
        return this.taskMetric(this.taskProps.metricPrefixSingular, 'Time', { statistic: 'avg', ...props });
    }
    /**
     * Metric for the number of times this activity is scheduled
     *
     * @default sum over 5 minutes
     */
    metricScheduled(props) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-stepfunctions.Task#metricScheduled", "- replaced by service integration specific classes (i.e. LambdaInvoke, SnsPublish)");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.metricScheduled);
            }
            throw error;
        }
        return this.taskMetric(this.taskProps.metricPrefixPlural, 'Scheduled', props);
    }
    /**
     * Metric for the number of times this activity times out
     *
     * @default sum over 5 minutes
     */
    metricTimedOut(props) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-stepfunctions.Task#metricTimedOut", "- replaced by service integration specific classes (i.e. LambdaInvoke, SnsPublish)");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.metricTimedOut);
            }
            throw error;
        }
        return this.taskMetric(this.taskProps.metricPrefixPlural, 'TimedOut', props);
    }
    /**
     * Metric for the number of times this activity is started
     *
     * @default sum over 5 minutes
     */
    metricStarted(props) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-stepfunctions.Task#metricStarted", "- replaced by service integration specific classes (i.e. LambdaInvoke, SnsPublish)");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.metricStarted);
            }
            throw error;
        }
        return this.taskMetric(this.taskProps.metricPrefixPlural, 'Started', props);
    }
    /**
     * Metric for the number of times this activity succeeds
     *
     * @default sum over 5 minutes
     */
    metricSucceeded(props) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-stepfunctions.Task#metricSucceeded", "- replaced by service integration specific classes (i.e. LambdaInvoke, SnsPublish)");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.metricSucceeded);
            }
            throw error;
        }
        return this.taskMetric(this.taskProps.metricPrefixPlural, 'Succeeded', props);
    }
    /**
     * Metric for the number of times this activity fails
     *
     * @default sum over 5 minutes
     */
    metricFailed(props) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-stepfunctions.Task#metricFailed", "- replaced by service integration specific classes (i.e. LambdaInvoke, SnsPublish)");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.metricFailed);
            }
            throw error;
        }
        return this.taskMetric(this.taskProps.metricPrefixPlural, 'Failed', props);
    }
    /**
     * Metric for the number of times the heartbeat times out for this activity
     *
     * @default sum over 5 minutes
     */
    metricHeartbeatTimedOut(props) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-stepfunctions.Task#metricHeartbeatTimedOut", "- replaced by service integration specific classes (i.e. LambdaInvoke, SnsPublish)");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.metricHeartbeatTimedOut);
            }
            throw error;
        }
        return this.taskMetric(this.taskProps.metricPrefixPlural, 'HeartbeatTimedOut', props);
    }
    whenBoundToGraph(graph) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-stepfunctions.Task#whenBoundToGraph", "- replaced by service integration specific classes (i.e. LambdaInvoke, SnsPublish)");
            jsiiDeprecationWarnings._aws_cdk_aws_stepfunctions_StateGraph(graph);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.whenBoundToGraph);
            }
            throw error;
        }
        super.whenBoundToGraph(graph);
        for (const policyStatement of this.taskProps.policyStatements || []) {
            graph.registerPolicyStatement(policyStatement);
        }
    }
    taskMetric(prefix, suffix, props) {
        if (prefix === undefined) {
            throw new Error('This Task Resource does not expose metrics');
        }
        return this.metric(prefix + suffix, props);
    }
}
exports.Task = Task;
_a = JSII_RTTI_SYMBOL_1;
Task[_a] = { fqn: "@aws-cdk/aws-stepfunctions.Task", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFzay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInRhc2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsc0RBQXNEO0FBR3RELHFEQUFpRDtBQUNqRCxtQ0FBZ0Q7QUFDaEQsb0NBQWlDO0FBQ2pDLHNDQUF1QztBQUl2QyxrQ0FBd0M7QUFvRnhDOzs7Ozs7Ozs7OztHQVdHO0FBQ0gsTUFBYSxJQUFLLFNBQVEsYUFBSztJQUs3QixZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQWdCO1FBQ3hELEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDOzs7Ozs7OytDQU5mLElBQUk7Ozs7UUFRYixJQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUM7UUFDN0IsTUFBTSxTQUFTLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFeEMsSUFBSSxDQUFDLFNBQVMsR0FBRztZQUNmLEdBQUcsU0FBUztZQUNaLFVBQVUsRUFBRSxvQkFBYSxDQUFDLEVBQUUsR0FBRyxTQUFTLENBQUMsVUFBVSxJQUFJLEVBQUUsRUFBRSxHQUFHLEtBQUssQ0FBQyxVQUFVLElBQUksRUFBRSxFQUFFLENBQUM7U0FDeEYsQ0FBQztRQUNGLElBQUksQ0FBQyxTQUFTLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUN6QjtJQUVEOzs7OztPQUtHO0lBQ0ksUUFBUSxDQUFDLFFBQW9CLEVBQUU7Ozs7Ozs7Ozs7O1FBQ3BDLEtBQUssQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDdkIsT0FBTyxJQUFJLENBQUM7S0FDYjtJQUVEOzs7OztPQUtHO0lBQ0ksUUFBUSxDQUFDLE9BQW1CLEVBQUUsUUFBb0IsRUFBRTs7Ozs7Ozs7Ozs7O1FBQ3pELEtBQUssQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLFVBQVUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUMzQyxPQUFP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QztLQUM1Qzs7QUE5S0gsb0JBK0tDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgY2xvdWR3YXRjaCBmcm9tICdAYXdzLWNkay9hd3MtY2xvdWR3YXRjaCc7XG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCB7IFN0YXRlVHlwZSB9IGZyb20gJy4vcHJpdmF0ZS9zdGF0ZS10eXBlJztcbmltcG9ydCB7IHJlbmRlckpzb25QYXRoLCBTdGF0ZSB9IGZyb20gJy4vc3RhdGUnO1xuaW1wb3J0IHsgQ2hhaW4gfSBmcm9tICcuLi9jaGFpbic7XG5pbXBvcnQgeyBGaWVsZFV0aWxzIH0gZnJvbSAnLi4vZmllbGRzJztcbmltcG9ydCB7IFN0YXRlR3JhcGggfSBmcm9tICcuLi9zdGF0ZS1ncmFwaCc7XG5pbXBvcnQgeyBJU3RlcEZ1bmN0aW9uc1Rhc2ssIFN0ZXBGdW5jdGlvbnNUYXNrQ29uZmlnIH0gZnJvbSAnLi4vc3RlcC1mdW5jdGlvbnMtdGFzayc7XG5pbXBvcnQgeyBDYXRjaFByb3BzLCBJQ2hhaW5hYmxlLCBJTmV4dGFibGUsIFJldHJ5UHJvcHMgfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgeyBub0VtcHR5T2JqZWN0IH0gZnJvbSAnLi4vdXRpbCc7XG5cbi8qKlxuICogUHJvcHMgdGhhdCBhcmUgY29tbW9uIHRvIGFsbCB0YXNrc1xuICpcbiAqIEBkZXByZWNhdGVkIC0gcmVwbGFjZWQgYnkgc2VydmljZSBpbnRlZ3JhdGlvbiBzcGVjaWZpYyBjbGFzc2VzIChpLmUuIExhbWJkYUludm9rZSwgU25zUHVibGlzaClcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBUYXNrUHJvcHMge1xuICAvKipcbiAgICogQWN0dWFsIHRhc2sgdG8gYmUgaW52b2tlZCBpbiB0aGlzIHdvcmtmbG93XG4gICAqL1xuICByZWFkb25seSB0YXNrOiBJU3RlcEZ1bmN0aW9uc1Rhc2s7XG5cbiAgLyoqXG4gICAqIEFuIG9wdGlvbmFsIGRlc2NyaXB0aW9uIGZvciB0aGlzIHN0YXRlXG4gICAqXG4gICAqIEBkZWZhdWx0IE5vIGNvbW1lbnRcbiAgICovXG4gIHJlYWRvbmx5IGNvbW1lbnQ/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIEpTT05QYXRoIGV4cHJlc3Npb24gdG8gc2VsZWN0IHBhcnQgb2YgdGhlIHN0YXRlIHRvIGJlIHRoZSBpbnB1dCB0byB0aGlzIHN0YXRlLlxuICAgKlxuICAgKiBNYXkgYWxzbyBiZSB0aGUgc3BlY2lhbCB2YWx1ZSBKc29uUGF0aC5ESVNDQVJELCB3aGljaCB3aWxsIGNhdXNlIHRoZSBlZmZlY3RpdmVcbiAgICogaW5wdXQgdG8gYmUgdGhlIGVtcHR5IG9iamVjdCB7fS5cbiAgICpcbiAgICogQGRlZmF1bHQgJFxuICAgKi9cbiAgcmVhZG9ubHkgaW5wdXRQYXRoPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBKU09OUGF0aCBleHByZXNzaW9uIHRvIHNlbGVjdCBwYXJ0IG9mIHRoZSBzdGF0ZSB0byBiZSB0aGUgb3V0cHV0IHRvIHRoaXMgc3RhdGUuXG4gICAqXG4gICAqIE1heSBhbHNvIGJlIHRoZSBzcGVjaWFsIHZhbHVlIEpzb25QYXRoLkRJU0NBUkQsIHdoaWNoIHdpbGwgY2F1c2UgdGhlIGVmZmVjdGl2ZVxuICAgKiBvdXRwdXQgdG8gYmUgdGhlIGVtcHR5IG9iamVjdCB7fS5cbiAgICpcbiAgICogQGRlZmF1bHQgJFxuICAgKi9cbiAgcmVhZG9ubHkgb3V0cHV0UGF0aD86IHN0cmluZztcblxuICAvKipcbiAgICogSlNPTlBhdGggZXhwcmVzc2lvbiB0byBpbmRpY2F0ZSB3aGVyZSB0byBpbmplY3QgdGhlIHN0YXRlJ3Mgb3V0cHV0XG4gICAqXG4gICAqIE1heSBhbHNvIGJlIHRoZSBzcGVjaWFsIHZhbHVlIEpzb25QYXRoLkRJU0NBUkQsIHdoaWNoIHdpbGwgY2F1c2UgdGhlIHN0YXRlJ3NcbiAgICogaW5wdXQgdG8gYmVjb21lIGl0cyBvdXRwdXQuXG4gICAqXG4gICAqIEBkZWZhdWx0ICRcbiAgICovXG4gIHJlYWRvbmx5IHJlc3VsdFBhdGg/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFBhcmFtZXRlcnMgdG8gaW52b2tlIHRoZSB0YXNrIHdpdGhcbiAgICpcbiAgICogSXQgaXMgbm90IHJlY29tbWVuZGVkIHRvIHVzZSB0aGlzIGZpZWxkLiBUaGUgb2JqZWN0IHRoYXQgaXMgcGFzc2VkIGluXG4gICAqIHRoZSBgdGFza2AgcHJvcGVydHkgd2lsbCB0YWtlIGNhcmUgb2YgcmV0dXJuaW5nIHRoZSByaWdodCB2YWx1ZXMgZm9yIHRoZVxuICAgKiBgUGFyYW1ldGVyc2AgZmllbGQgaW4gdGhlIFN0ZXAgRnVuY3Rpb25zIGRlZmluaXRpb24uXG4gICAqXG4gICAqIFRoZSB2YXJpb3VzIGNsYXNzZXMgdGhhdCBpbXBsZW1lbnQgYElTdGVwRnVuY3Rpb25zVGFza2Agd2lsbCB0YWtlIGFcbiAgICogcHJvcGVydGllcyB3aGljaCBtYWtlIHNlbnNlIGZvciB0aGUgdGFzayB0eXBlLiBGb3IgZXhhbXBsZSwgZm9yXG4gICAqIGBJbnZva2VGdW5jdGlvbmAgdGhlIGZpZWxkIHRoYXQgcG9wdWxhdGVzIHRoZSBgcGFyYW1ldGVyc2AgZmllbGQgd2lsbCBiZVxuICAgKiBjYWxsZWQgYHBheWxvYWRgLCBhbmQgZm9yIHRoZSBgUHVibGlzaFRvVG9waWNgIHRoZSBgcGFyYW1ldGVyc2AgZmllbGRcbiAgICogd2lsbCBiZSBwb3B1bGF0ZWQgdmlhIGEgY29tYmluYXRpb24gb2YgdGhlIHJlZmVyZW5jZWQgdG9waWMsIHN1YmplY3QgYW5kXG4gICAqIG1lc3NhZ2UuXG4gICAqXG4gICAqIElmIHBhc3NlZCBhbnl3YXksIHRoZSBrZXlzIGluIHRoaXMgbWFwIHdpbGwgb3ZlcnJpZGUgdGhlIHBhcmFtZXRlcnNcbiAgICogcmV0dXJuZWQgYnkgdGhlIHRhc2sgb2JqZWN0LlxuICAgKlxuICAgKiBAc2VlXG4gICAqIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9zdGVwLWZ1bmN0aW9ucy9sYXRlc3QvZGcvaW5wdXQtb3V0cHV0LWlucHV0cGF0aC1wYXJhbXMuaHRtbCNpbnB1dC1vdXRwdXQtcGFyYW1ldGVyc1xuICAgKlxuICAgKiBAZGVmYXVsdCAtIFVzZSB0aGUgcGFyYW1ldGVycyBpbXBsaWVkIGJ5IHRoZSBgdGFza2AgcHJvcGVydHlcbiAgICovXG4gIHJlYWRvbmx5IHBhcmFtZXRlcnM/OiB7IFtuYW1lOiBzdHJpbmddOiBhbnkgfTtcblxuICAvKipcbiAgICogTWF4aW11bSBydW4gdGltZSBvZiB0aGlzIHN0YXRlXG4gICAqXG4gICAqIElmIHRoZSBzdGF0ZSB0YWtlcyBsb25nZXIgdGhhbiB0aGlzIGFtb3VudCBvZiB0aW1lIHRvIGNvbXBsZXRlLCBhICdUaW1lb3V0JyBlcnJvciBpcyByYWlzZWQuXG4gICAqXG4gICAqIEBkZWZhdWx0IDYwXG4gICAqL1xuICByZWFkb25seSB0aW1lb3V0PzogY2RrLkR1cmF0aW9uO1xufVxuXG4vKipcbiAqIERlZmluZSBhIFRhc2sgc3RhdGUgaW4gdGhlIHN0YXRlIG1hY2hpbmVcbiAqXG4gKiBSZWFjaGluZyBhIFRhc2sgc3RhdGUgY2F1c2VzIHNvbWUgd29yayB0byBiZSBleGVjdXRlZCwgcmVwcmVzZW50ZWQgYnkgdGhlXG4gKiBUYXNrJ3MgcmVzb3VyY2UgcHJvcGVydHkuIFRhc2sgY29uc3RydWN0cyByZXByZXNlbnQgYSBnZW5lcmljIEFtYXpvblxuICogU3RhdGVzIExhbmd1YWdlIFRhc2suXG4gKlxuICogRm9yIHNvbWUgcmVzb3VyY2UgdHlwZXMsIG1vcmUgc3BlY2lmaWMgc3ViY2xhc3NlcyBvZiBUYXNrIG1heSBiZSBhdmFpbGFibGVcbiAqIHdoaWNoIGFyZSBtb3JlIGNvbnZlbmllbnQgdG8gdXNlLlxuICpcbiAqIEBkZXByZWNhdGVkIC0gcmVwbGFjZWQgYnkgc2VydmljZSBpbnRlZ3JhdGlvbiBzcGVjaWZpYyBjbGFzc2VzIChpLmUuIExhbWJkYUludm9rZSwgU25zUHVibGlzaClcbiAqL1xuZXhwb3J0IGNsYXNzIFRhc2sgZXh0ZW5kcyBTdGF0ZSBpbXBsZW1lbnRzIElOZXh0YWJsZSB7XG4gIHB1YmxpYyByZWFkb25seSBlbmRTdGF0ZXM6IElOZXh0YWJsZVtdO1xuICBwcml2YXRlIHJlYWRvbmx5IHRpbWVvdXQ/OiBjZGsuRHVyYXRpb247XG4gIHByaXZhdGUgcmVhZG9ubHkgdGFza1Byb3BzOiBTdGVwRnVuY3Rpb25zVGFza0NvbmZpZztcblxuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogVGFza1Byb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCBwcm9wcyk7XG5cbiAgICB0aGlzLnRpbWVvdXQgPSBwcm9wcy50aW1lb3V0O1xuICAgIGNvbnN0IHRhc2tQcm9wcyA9IHByb3BzLnRhc2suYmluZCh0aGlzKTtcblxuICAgIHRoaXMudGFza1Byb3BzID0ge1xuICAgICAgLi4udGFza1Byb3BzLFxuICAgICAgcGFyYW1ldGVyczogbm9FbXB0eU9iamVjdCh7IC4uLnRhc2tQcm9wcy5wYXJhbWV0ZXJzIHx8IHt9LCAuLi5wcm9wcy5wYXJhbWV0ZXJzIHx8IHt9IH0pLFxuICAgIH07XG4gICAgdGhpcy5lbmRTdGF0ZXMgPSBbdGhpc107XG4gIH1cblxuICAvKipcbiAgICogQWRkIHJldHJ5IGNvbmZpZ3VyYXRpb24gZm9yIHRoaXMgc3RhdGVcbiAgICpcbiAgICogVGhpcyBjb250cm9scyBpZiBhbmQgaG93IHRoZSBleGVjdXRpb24gd2lsbCBiZSByZXRyaWVkIGlmIGEgcGFydGljdWxhclxuICAgKiBlcnJvciBvY2N1cnMuXG4gICAqL1xuICBwdWJsaWMgYWRkUmV0cnkocHJvcHM6IFJldHJ5UHJvcHMgPSB7fSk6IFRhc2sge1xuICAgIHN1cGVyLl9hZGRSZXRyeShwcm9wcyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogQWRkIGEgcmVjb3ZlcnkgaGFuZGxlciBmb3IgdGhpcyBzdGF0ZVxuICAgKlxuICAgKiBXaGVuIGEgcGFydGljdWxhciBlcnJvciBvY2N1cnMsIGV4ZWN1dGlvbiB3aWxsIGNvbnRpbnVlIGF0IHRoZSBlcnJvclxuICAgKiBoYW5kbGVyIGluc3RlYWQgb2YgZmFpbGluZyB0aGUgc3RhdGUgbWFjaGluZSBleGVjdXRpb24uXG4gICAqL1xuICBwdWJsaWMgYWRkQ2F0Y2goaGFuZGxlcjogSUNoYWluYWJsZSwgcHJvcHM6IENhdGNoUHJvcHMgPSB7fSk6IFRhc2sge1xuICAgIHN1cGVyLl9hZGRDYXRjaChoYW5kbGVyLnN0YXJ0U3RhdGUsIHByb3BzKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBDb250aW51ZSBub3JtYWwgZXhlY3V0aW9uIHdpdGggdGhlIGdpdmVuIHN0YXRlXG4gICAqL1xuICBwdWJsaWMgbmV4dChuZXh0OiBJQ2hhaW5hYmxlKTogQ2hhaW4ge1xuICAgIHN1cGVyLm1ha2VOZXh0KG5leHQuc3RhcnRTdGF0ZSk7XG4gICAgcmV0dXJuIENoYWluLnNlcXVlbmNlKHRoaXMsIG5leHQpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybiB0aGUgQW1hem9uIFN0YXRlcyBMYW5ndWFnZSBvYmplY3QgZm9yIHRoaXMgc3RhdGVcbiAgICovXG4gIHB1YmxpYyB0b1N0YXRlSnNvbigpOiBvYmplY3Qge1xuICAgIHJldHVybiB7XG4gICAgICAuLi50aGlzLnJlbmRlck5leHRFbmQoKSxcbiAgICAgIC4uLnRoaXMucmVuZGVyUmV0cnlDYXRjaCgpLFxuICAgICAgLi4udGhpcy5yZW5kZXJJbnB1dE91dHB1dCgpLFxuICAgICAgVHlwZTogU3RhdGVUeXBlLlRBU0ssXG4gICAgICBDb21tZW50OiB0aGlzLmNvbW1lbnQsXG4gICAgICBSZXNvdXJjZTogdGhpcy50YXNrUHJvcHMucmVzb3VyY2VBcm4sXG4gICAgICBQYXJhbWV0ZXJzOiB0aGlzLnRhc2tQcm9wcy5wYXJhbWV0ZXJzICYmIEZpZWxkVXRpbHMucmVuZGVyT2JqZWN0KHRoaXMudGFza1Byb3BzLnBhcmFtZXRlcnMpLFxuICAgICAgUmVzdWx0UGF0aDogcmVuZGVySnNvblBhdGgodGhpcy5yZXN1bHRQYXRoKSxcbiAgICAgIFRpbWVvdXRTZWNvbmRzOiB0aGlzLnRpbWVvdXQgJiYgdGhpcy50aW1lb3V0LnRvU2Vjb25kcygpLFxuICAgICAgSGVhcnRiZWF0U2Vjb25kczogdGhpcy50YXNrUHJvcHMuaGVhcnRiZWF0ICYmIHRoaXMudGFza1Byb3BzLmhlYXJ0YmVhdC50b1NlY29uZHMoKSxcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybiB0aGUgZ2l2ZW4gbmFtZWQgbWV0cmljIGZvciB0aGlzIFRhc2tcbiAgICpcbiAgICogQGRlZmF1bHQgc3VtIG92ZXIgNSBtaW51dGVzXG4gICAqL1xuICBwdWJsaWMgbWV0cmljKG1ldHJpY05hbWU6IHN0cmluZywgcHJvcHM/OiBjbG91ZHdhdGNoLk1ldHJpY09wdGlvbnMpOiBjbG91ZHdhdGNoLk1ldHJpYyB7XG4gICAgcmV0dXJuIG5ldyBjbG91ZHdhdGNoLk1ldHJpYyh7XG4gICAgICBuYW1lc3BhY2U6ICdBV1MvU3RhdGVzJyxcbiAgICAgIG1ldHJpY05hbWUsXG4gICAgICBkaW1lbnNpb25zOiB0aGlzLnRhc2tQcm9wcy5tZXRyaWNEaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnc3VtJyxcbiAgICAgIC4uLnByb3BzLFxuICAgIH0pLmF0dGFjaFRvKHRoaXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBpbnRlcnZhbCwgaW4gbWlsbGlzZWNvbmRzLCBiZXR3ZWVuIHRoZSB0aW1lIHRoZSBUYXNrIHN0YXJ0cyBhbmQgdGhlIHRpbWUgaXQgY2xvc2VzLlxuICAgKlxuICAgKiBAZGVmYXVsdCBhdmVyYWdlIG92ZXIgNSBtaW51dGVzXG4gICAqL1xuICBwdWJsaWMgbWV0cmljUnVuVGltZShwcm9wcz86IGNsb3Vkd2F0Y2guTWV0cmljT3B0aW9ucyk6IGNsb3Vkd2F0Y2guTWV0cmljIHtcbiAgICByZXR1cm4gdGhpcy50YXNrTWV0cmljKHRoaXMudGFza1Byb3BzLm1ldHJpY1ByZWZpeFNpbmd1bGFyLCAnUnVuVGltZScsIHsgc3RhdGlzdGljOiAnYXZnJywgLi4ucHJvcHMgfSk7XG4gIH1cblxuICAvKipcbiAgICogVGhlIGludGVydmFsLCBpbiBtaWxsaXNlY29uZHMsIGZvciB3aGljaCB0aGUgYWN0aXZpdHkgc3RheXMgaW4gdGhlIHNjaGVkdWxlIHN0YXRlLlxuICAgKlxuICAgKiBAZGVmYXVsdCBhdmVyYWdlIG92ZXIgNSBtaW51dGVzXG4gICAqL1xuICBwdWJsaWMgbWV0cmljU2NoZWR1bGVUaW1lKHByb3BzPzogY2xvdWR3YXRjaC5NZXRyaWNPcHRpb25zKTogY2xvdWR3YXRjaC5NZXRyaWMge1xuICAgIHJldHVybiB0aGlzLnRhc2tNZXRyaWModGhpcy50YXNrUHJvcHMubWV0cmljUHJlZml4U2luZ3VsYXIsICdTY2hlZHVsZVRpbWUnLCB7IHN0YXRpc3RpYzogJ2F2ZycsIC4uLnByb3BzIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBpbnRlcnZhbCwgaW4gbWlsbGlzZWNvbmRzLCBiZXR3ZWVuIHRoZSB0aW1lIHRoZSBhY3Rpdml0eSBpcyBzY2hlZHVsZWQgYW5kIHRoZSB0aW1lIGl0IGNsb3Nlcy5cbiAgICpcbiAgICogQGRlZmF1bHQgYXZlcmFnZSBvdmVyIDUgbWludXRlc1xuICAgKi9cbiAgcHVibGljIG1ldHJpY1RpbWUocHJvcHM/OiBjbG91ZHdhdGNoLk1ldHJpY09wdGlvbnMpOiBjbG91ZHdhdGNoLk1ldHJpYyB7XG4gICAgcmV0dXJuIHRoaXMudGFza01ldHJpYyh0aGlzLnRhc2tQcm9wcy5tZXRyaWNQcmVmaXhTaW5ndWxhciwgJ1RpbWUnLCB7IHN0YXRpc3RpYzogJ2F2ZycsIC4uLnByb3BzIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIE1ldHJpYyBmb3IgdGhlIG51bWJlciBvZiB0aW1lcyB0aGlzIGFjdGl2aXR5IGlzIHNjaGVkdWxlZFxuICAgKlxuICAgKiBAZGVmYXVsdCBzdW0gb3ZlciA1IG1pbnV0ZXNcbiAgICovXG4gIHB1YmxpYyBtZXRyaWNTY2hlZHVsZWQocHJvcHM/OiBjbG91ZHdhdGNoLk1ldHJpY09wdGlvbnMpOiBjbG91ZHdhdGNoLk1ldHJpYyB7XG4gICAgcmV0dXJuIHRoaXMudGFza01ldHJpYyh0aGlzLnRhc2tQcm9wcy5tZXRyaWNQcmVmaXhQbHVyYWwsICdTY2hlZHVsZWQnLCBwcm9wcyk7XG4gIH1cblxuICAvKipcbiAgICogTWV0cmljIGZvciB0aGUgbnVtYmVyIG9mIHRpbWVzIHRoaXMgYWN0aXZpdHkgdGltZXMgb3V0XG4gICAqXG4gICAqIEBkZWZhdWx0IHN1bSBvdmVyIDUgbWludXRlc1xuICAgKi9cbiAgcHVibGljIG1ldHJpY1RpbWVkT3V0KHByb3BzPzogY2xvdWR3YXRjaC5NZXRyaWNPcHRpb25zKTogY2xvdWR3YXRjaC5NZXRyaWMge1xuICAgIHJldHVybiB0aGlzLnRhc2tNZXRyaWModGhpcy50YXNrUHJvcHMubWV0cmljUHJlZml4UGx1cmFsLCAnVGltZWRPdXQnLCBwcm9wcyk7XG4gIH1cblxuICAvKipcbiAgICogTWV0cmljIGZvciB0aGUgbnVtYmVyIG9mIHRpbWVzIHRoaXMgYWN0aXZpdHkgaXMgc3RhcnRlZFxuICAgKlxuICAgKiBAZGVmYXVsdCBzdW0gb3ZlciA1IG1pbnV0ZXNcbiAgICovXG4gIHB1YmxpYyBtZXRyaWNTdGFydGVkKHByb3BzPzogY2xvdWR3YXRjaC5NZXRyaWNPcHRpb25zKTogY2xvdWR3YXRjaC5NZXRyaWMge1xuICAgIHJldHVybiB0aGlzLnRhc2tNZXRyaWModGhpcy50YXNrUHJvcHMubWV0cmljUHJlZml4UGx1cmFsLCAnU3RhcnRlZCcsIHByb3BzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBNZXRyaWMgZm9yIHRoZSBudW1iZXIgb2YgdGltZXMgdGhpcyBhY3Rpdml0eSBzdWNjZWVkc1xuICAgKlxuICAgKiBAZGVmYXVsdCBzdW0gb3ZlciA1IG1pbnV0ZXNcbiAgICovXG4gIHB1YmxpYyBtZXRyaWNTdWNjZWVkZWQocHJvcHM/OiBjbG91ZHdhdGNoLk1ldHJpY09wdGlvbnMpOiBjbG91ZHdhdGNoLk1ldHJpYyB7XG4gICAgcmV0dXJuIHRoaXMudGFza01ldHJpYyh0aGlzLnRhc2tQcm9wcy5tZXRyaWNQcmVmaXhQbHVyYWwsICdTdWNjZWVkZWQnLCBwcm9wcyk7XG4gIH1cblxuICAvKipcbiAgICogTWV0cmljIGZvciB0aGUgbnVtYmVyIG9mIHRpbWVzIHRoaXMgYWN0aXZpdHkgZmFpbHNcbiAgICpcbiAgICogQGRlZmF1bHQgc3VtIG92ZXIgNSBtaW51dGVzXG4gICAqL1xuICBwdWJsaWMgbWV0cmljRmFpbGVkKHByb3BzPzogY2xvdWR3YXRjaC5NZXRyaWNPcHRpb25zKTogY2xvdWR3YXRjaC5NZXRyaWMge1xuICAgIHJldHVybiB0aGlzLnRhc2tNZXRyaWModGhpcy50YXNrUHJvcHMubWV0cmljUHJlZml4UGx1cmFsLCAnRmFpbGVkJywgcHJvcHMpO1xuICB9XG5cbiAgLyoqXG4gICAqIE1ldHJpYyBmb3IgdGhlIG51bWJlciBvZiB0aW1lcyB0aGUgaGVhcnRiZWF0IHRpbWVzIG91dCBmb3IgdGhpcyBhY3Rpdml0eVxuICAgKlxuICAgKiBAZGVmYXVsdCBzdW0gb3ZlciA1IG1pbnV0ZXNcbiAgICovXG4gIHB1YmxpYyBtZXRyaWNIZWFydGJlYXRUaW1lZE91dChwcm9wcz86IGNsb3Vkd2F0Y2guTWV0cmljT3B0aW9ucyk6IGNsb3Vkd2F0Y2guTWV0cmljIHtcbiAgICByZXR1cm4gdGhpcy50YXNrTWV0cmljKHRoaXMudGFza1Byb3BzLm1ldHJpY1ByZWZpeFBsdXJhbCwgJ0hlYXJ0YmVhdFRpbWVkT3V0JywgcHJvcHMpO1xuICB9XG5cbiAgcHJvdGVjdGVkIHdoZW5Cb3VuZFRvR3JhcGgoZ3JhcGg6IFN0YXRlR3JhcGgpIHtcbiAgICBzdXBlci53aGVuQm91bmRUb0dyYXBoKGdyYXBoKTtcbiAgICBmb3IgKGNvbnN0IHBvbGljeVN0YXRlbWVudCBvZiB0aGlzLnRhc2tQcm9wcy5wb2xpY3lTdGF0ZW1lbnRzIHx8IFtdKSB7XG4gICAgICBncmFwaC5yZWdpc3RlclBvbGljeVN0YXRlbWVudChwb2xpY3lTdGF0ZW1lbnQpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgdGFza01ldHJpYyhwcmVmaXg6IHN0cmluZyB8IHVuZGVmaW5lZCwgc3VmZml4OiBzdHJpbmcsIHByb3BzPzogY2xvdWR3YXRjaC5NZXRyaWNPcHRpb25zKTogY2xvdWR3YXRjaC5NZXRyaWMge1xuICAgIGlmIChwcmVmaXggPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdUaGlzIFRhc2sgUmVzb3VyY2UgZG9lcyBub3QgZXhwb3NlIG1ldHJpY3MnKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMubWV0cmljKHByZWZpeCArIHN1ZmZpeCwgcHJvcHMpO1xuICB9XG59XG4iXX0=