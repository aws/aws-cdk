"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.StateMachine = exports.LogLevel = exports.StateMachineType = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const cloudwatch = require("@aws-cdk/aws-cloudwatch");
const iam = require("@aws-cdk/aws-iam");
const core_1 = require("@aws-cdk/core");
const state_graph_1 = require("./state-graph");
const stepfunctions_canned_metrics_generated_1 = require("./stepfunctions-canned-metrics.generated");
const stepfunctions_generated_1 = require("./stepfunctions.generated");
/**
 * Two types of state machines are available in AWS Step Functions: EXPRESS AND STANDARD.
 *
 * @see https://docs.aws.amazon.com/step-functions/latest/dg/concepts-standard-vs-express.html
 *
 * @default STANDARD
 */
var StateMachineType;
(function (StateMachineType) {
    /**
     * Express Workflows are ideal for high-volume, event processing workloads.
     */
    StateMachineType["EXPRESS"] = "EXPRESS";
    /**
     * Standard Workflows are ideal for long-running, durable, and auditable workflows.
     */
    StateMachineType["STANDARD"] = "STANDARD";
})(StateMachineType = exports.StateMachineType || (exports.StateMachineType = {}));
/**
 * Defines which category of execution history events are logged.
 *
 * @see https://docs.aws.amazon.com/step-functions/latest/dg/cloudwatch-log-level.html
 *
 * @default ERROR
 */
var LogLevel;
(function (LogLevel) {
    /**
     * No Logging
     */
    LogLevel["OFF"] = "OFF";
    /**
     * Log everything
     */
    LogLevel["ALL"] = "ALL";
    /**
     * Log all errors
     */
    LogLevel["ERROR"] = "ERROR";
    /**
     * Log fatal errors
     */
    LogLevel["FATAL"] = "FATAL";
})(LogLevel = exports.LogLevel || (exports.LogLevel = {}));
/**
 * A new or imported state machine.
 */
class StateMachineBase extends core_1.Resource {
    /**
     * Import a state machine
     */
    static fromStateMachineArn(scope, id, stateMachineArn) {
        class Import extends StateMachineBase {
            constructor() {
                super(...arguments);
                this.stateMachineArn = stateMachineArn;
                this.grantPrincipal = new iam.UnknownPrincipal({ resource: this });
            }
        }
        return new Import(scope, id, {
            environmentFromArn: stateMachineArn,
        });
    }
    /**
     * Import a state machine via resource name
     */
    static fromStateMachineName(scope, id, stateMachineName) {
        const stateMachineArn = core_1.Stack.of(scope).formatArn({
            service: 'states',
            resource: 'stateMachine',
            arnFormat: core_1.ArnFormat.COLON_RESOURCE_NAME,
            resourceName: stateMachineName,
        });
        return this.fromStateMachineArn(scope, id, stateMachineArn);
    }
    /**
     * Grant the given identity permissions to start an execution of this state
     * machine.
     */
    grantStartExecution(identity) {
        return iam.Grant.addToPrincipal({
            grantee: identity,
            actions: ['states:StartExecution'],
            resourceArns: [this.stateMachineArn],
        });
    }
    /**
     * Grant the given identity permissions to start a synchronous execution of
     * this state machine.
     */
    grantStartSyncExecution(identity) {
        return iam.Grant.addToPrincipal({
            grantee: identity,
            actions: ['states:StartSyncExecution'],
            resourceArns: [this.stateMachineArn],
        });
    }
    /**
     * Grant the given identity permissions to read results from state
     * machine.
     */
    grantRead(identity) {
        iam.Grant.addToPrincipal({
            grantee: identity,
            actions: [
                'states:ListExecutions',
                'states:ListStateMachines',
            ],
            resourceArns: [this.stateMachineArn],
        });
        iam.Grant.addToPrincipal({
            grantee: identity,
            actions: [
                'states:DescribeExecution',
                'states:DescribeStateMachineForExecution',
                'states:GetExecutionHistory',
            ],
            resourceArns: [`${this.executionArn()}:*`],
        });
        return iam.Grant.addToPrincipal({
            grantee: identity,
            actions: [
                'states:ListActivities',
                'states:DescribeStateMachine',
                'states:DescribeActivity',
            ],
            resourceArns: ['*'],
        });
    }
    /**
     * Grant the given identity task response permissions on a state machine
     */
    grantTaskResponse(identity) {
        return iam.Grant.addToPrincipal({
            grantee: identity,
            actions: [
                'states:SendTaskSuccess',
                'states:SendTaskFailure',
                'states:SendTaskHeartbeat',
            ],
            resourceArns: [this.stateMachineArn],
        });
    }
    /**
     * Grant the given identity permissions on all executions of the state machine
     */
    grantExecution(identity, ...actions) {
        return iam.Grant.addToPrincipal({
            grantee: identity,
            actions,
            resourceArns: [`${this.executionArn()}:*`],
        });
    }
    /**
     * Grant the given identity custom permissions
     */
    grant(identity, ...actions) {
        return iam.Grant.addToPrincipal({
            grantee: identity,
            actions,
            resourceArns: [this.stateMachineArn],
        });
    }
    /**
     * Return the given named metric for this State Machine's executions
     *
     * @default - sum over 5 minutes
     */
    metric(metricName, props) {
        return new cloudwatch.Metric({
            namespace: 'AWS/States',
            metricName,
            dimensionsMap: { StateMachineArn: this.stateMachineArn },
            statistic: 'sum',
            ...props,
        }).attachTo(this);
    }
    /**
     * Metric for the number of executions that failed
     *
     * @default - sum over 5 minutes
     */
    metricFailed(props) {
        return this.cannedMetric(stepfunctions_canned_metrics_generated_1.StatesMetrics.executionsFailedSum, props);
    }
    /**
     * Metric for the number of executions that were throttled
     *
     * @default - sum over 5 minutes
     */
    metricThrottled(props) {
        // There's a typo in the "canned" version of this
        return this.metric('ExecutionThrottled', props);
    }
    /**
     * Metric for the number of executions that were aborted
     *
     * @default - sum over 5 minutes
     */
    metricAborted(props) {
        return this.cannedMetric(stepfunctions_canned_metrics_generated_1.StatesMetrics.executionsAbortedSum, props);
    }
    /**
     * Metric for the number of executions that succeeded
     *
     * @default - sum over 5 minutes
     */
    metricSucceeded(props) {
        return this.cannedMetric(stepfunctions_canned_metrics_generated_1.StatesMetrics.executionsSucceededSum, props);
    }
    /**
     * Metric for the number of executions that timed out
     *
     * @default - sum over 5 minutes
     */
    metricTimedOut(props) {
        return this.cannedMetric(stepfunctions_canned_metrics_generated_1.StatesMetrics.executionsTimedOutSum, props);
    }
    /**
     * Metric for the number of executions that were started
     *
     * @default - sum over 5 minutes
     */
    metricStarted(props) {
        return this.metric('ExecutionsStarted', props);
    }
    /**
     * Metric for the interval, in milliseconds, between the time the execution starts and the time it closes
     *
     * @default - average over 5 minutes
     */
    metricTime(props) {
        return this.cannedMetric(stepfunctions_canned_metrics_generated_1.StatesMetrics.executionTimeAverage, props);
    }
    /**
     * Returns the pattern for the execution ARN's of the state machine
     */
    executionArn() {
        return core_1.Stack.of(this).formatArn({
            resource: 'execution',
            service: 'states',
            resourceName: core_1.Arn.split(this.stateMachineArn, core_1.ArnFormat.COLON_RESOURCE_NAME).resourceName,
            arnFormat: core_1.ArnFormat.COLON_RESOURCE_NAME,
        });
    }
    cannedMetric(fn, props) {
        return new cloudwatch.Metric({
            ...fn({ StateMachineArn: this.stateMachineArn }),
            ...props,
        }).attachTo(this);
    }
}
/**
 * Define a StepFunctions State Machine
 */
class StateMachine extends StateMachineBase {
    constructor(scope, id, props) {
        super(scope, id, {
            physicalName: props.stateMachineName,
        });
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_stepfunctions_StateMachineProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, StateMachine);
            }
            throw error;
        }
        if (props.stateMachineName !== undefined) {
            this.validateStateMachineName(props.stateMachineName);
        }
        this.role = props.role || new iam.Role(this, 'Role', {
            assumedBy: new iam.ServicePrincipal('states.amazonaws.com'),
        });
        const graph = new state_graph_1.StateGraph(props.definition.startState, `State Machine ${id} definition`);
        graph.timeout = props.timeout;
        this.stateMachineType = props.stateMachineType ?? StateMachineType.STANDARD;
        const resource = new stepfunctions_generated_1.CfnStateMachine(this, 'Resource', {
            stateMachineName: this.physicalName,
            stateMachineType: props.stateMachineType ?? undefined,
            roleArn: this.role.roleArn,
            definitionString: core_1.Stack.of(this).toJsonString(graph.toGraphJson()),
            loggingConfiguration: props.logs ? this.buildLoggingConfiguration(props.logs) : undefined,
            tracingConfiguration: props.tracingEnabled ? this.buildTracingConfiguration() : undefined,
        });
        resource.applyRemovalPolicy(props.removalPolicy, { default: core_1.RemovalPolicy.DESTROY });
        resource.node.addDependency(this.role);
        for (const statement of graph.policyStatements) {
            this.addToRolePolicy(statement);
        }
        this.stateMachineName = this.getResourceNameAttribute(resource.attrName);
        this.stateMachineArn = this.getResourceArnAttribute(resource.ref, {
            service: 'states',
            resource: 'stateMachine',
            resourceName: this.physicalName,
            arnFormat: core_1.ArnFormat.COLON_RESOURCE_NAME,
        });
    }
    /**
     * The principal this state machine is running as
     */
    get grantPrincipal() {
        return this.role.grantPrincipal;
    }
    /**
     * Add the given statement to the role's policy
     */
    addToRolePolicy(statement) {
        this.role.addToPrincipalPolicy(statement);
    }
    validateStateMachineName(stateMachineName) {
        if (!core_1.Token.isUnresolved(stateMachineName)) {
            if (stateMachineName.length < 1 || stateMachineName.length > 80) {
                throw new Error(`State Machine name must be between 1 and 80 characters. Received: ${stateMachineName}`);
            }
            if (!stateMachineName.match(/^[a-z0-9\+\!\@\.\(\)\-\=\_\']+$/i)) {
                throw new Error(`State Machine name must match "^[a-z0-9+!@.()-=_']+$/i". Received: ${stateMachineName}`);
            }
        }
    }
    buildLoggingConfiguration(logOptions) {
        // https://docs.aws.amazon.com/step-functions/latest/dg/cw-logs.html#cloudwatch-iam-policy
        this.addToRolePolicy(new iam.PolicyStatement({
            effect: iam.Effect.ALLOW,
            actions: [
                'logs:CreateLogDelivery',
                'logs:GetLogDelivery',
                'logs:UpdateLogDelivery',
                'logs:DeleteLogDelivery',
                'logs:ListLogDeliveries',
                'logs:PutResourcePolicy',
                'logs:DescribeResourcePolicies',
                'logs:DescribeLogGroups',
            ],
            resources: ['*'],
        }));
        return {
            destinations: [{
                    cloudWatchLogsLogGroup: { logGroupArn: logOptions.destination.logGroupArn },
                }],
            includeExecutionData: logOptions.includeExecutionData,
            level: logOptions.level || 'ERROR',
        };
    }
    buildTracingConfiguration() {
        this.addToRolePolicy(new iam.PolicyStatement({
            // https://docs.aws.amazon.com/xray/latest/devguide/security_iam_id-based-policy-examples.html#xray-permissions-resources
            // https://docs.aws.amazon.com/step-functions/latest/dg/xray-iam.html
            actions: [
                'xray:PutTraceSegments',
                'xray:PutTelemetryRecords',
                'xray:GetSamplingRules',
                'xray:GetSamplingTargets',
            ],
            resources: ['*'],
        }));
        return {
            enabled: true,
        };
    }
}
exports.StateMachine = StateMachine;
_a = JSII_RTTI_SYMBOL_1;
StateMachine[_a] = { fqn: "@aws-cdk/aws-stepfunctions.StateMachine", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhdGUtbWFjaGluZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInN0YXRlLW1hY2hpbmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsc0RBQXNEO0FBQ3RELHdDQUF3QztBQUV4Qyx3Q0FBMkc7QUFFM0csK0NBQTJDO0FBQzNDLHFHQUF5RTtBQUN6RSx1RUFBNEQ7QUFHNUQ7Ozs7OztHQU1HO0FBQ0gsSUFBWSxnQkFVWDtBQVZELFdBQVksZ0JBQWdCO0lBQzFCOztPQUVHO0lBQ0gsdUNBQW1CLENBQUE7SUFFbkI7O09BRUc7SUFDSCx5Q0FBcUIsQ0FBQTtBQUN2QixDQUFDLEVBVlcsZ0JBQWdCLEdBQWhCLHdCQUFnQixLQUFoQix3QkFBZ0IsUUFVM0I7QUFFRDs7Ozs7O0dBTUc7QUFDSCxJQUFZLFFBaUJYO0FBakJELFdBQVksUUFBUTtJQUNsQjs7T0FFRztJQUNILHVCQUFXLENBQUE7SUFDWDs7T0FFRztJQUNILHVCQUFXLENBQUE7SUFDWDs7T0FFRztJQUNILDJCQUFlLENBQUE7SUFDZjs7T0FFRztJQUNILDJCQUFlLENBQUE7QUFDakIsQ0FBQyxFQWpCVyxRQUFRLEdBQVIsZ0JBQVEsS0FBUixnQkFBUSxRQWlCbkI7QUFxRkQ7O0dBRUc7QUFDSCxNQUFlLGdCQUFpQixTQUFRLGVBQVE7SUFFOUM7O09BRUc7SUFDSSxNQUFNLENBQUMsbUJBQW1CLENBQUMsS0FBZ0IsRUFBRSxFQUFVLEVBQUUsZUFBdUI7UUFDckYsTUFBTSxNQUFPLFNBQVEsZ0JBQWdCO1lBQXJDOztnQkFDa0Isb0JBQWUsR0FBRyxlQUFlLENBQUM7Z0JBQ2xDLG1CQUFjLEdBQUcsSUFBSSxHQUFHLENBQUMsZ0JBQWdCLENBQUMsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztZQUNoRixDQUFDO1NBQUE7UUFDRCxPQUFPLElBQUksTUFBTSxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUU7WUFDM0Isa0JBQWtCLEVBQUUsZUFBZTtTQUNwQyxD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OlsiaW1wb3J0ICogYXMgY2xvdWR3YXRjaCBmcm9tICdAYXdzLWNkay9hd3MtY2xvdWR3YXRjaCc7XG5pbXBvcnQgKiBhcyBpYW0gZnJvbSAnQGF3cy1jZGsvYXdzLWlhbSc7XG5pbXBvcnQgKiBhcyBsb2dzIGZyb20gJ0Bhd3MtY2RrL2F3cy1sb2dzJztcbmltcG9ydCB7IEFybiwgQXJuRm9ybWF0LCBEdXJhdGlvbiwgSVJlc291cmNlLCBSZW1vdmFsUG9saWN5LCBSZXNvdXJjZSwgU3RhY2ssIFRva2VuIH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCB7IFN0YXRlR3JhcGggfSBmcm9tICcuL3N0YXRlLWdyYXBoJztcbmltcG9ydCB7IFN0YXRlc01ldHJpY3MgfSBmcm9tICcuL3N0ZXBmdW5jdGlvbnMtY2FubmVkLW1ldHJpY3MuZ2VuZXJhdGVkJztcbmltcG9ydCB7IENmblN0YXRlTWFjaGluZSB9IGZyb20gJy4vc3RlcGZ1bmN0aW9ucy5nZW5lcmF0ZWQnO1xuaW1wb3J0IHsgSUNoYWluYWJsZSB9IGZyb20gJy4vdHlwZXMnO1xuXG4vKipcbiAqIFR3byB0eXBlcyBvZiBzdGF0ZSBtYWNoaW5lcyBhcmUgYXZhaWxhYmxlIGluIEFXUyBTdGVwIEZ1bmN0aW9uczogRVhQUkVTUyBBTkQgU1RBTkRBUkQuXG4gKlxuICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vc3RlcC1mdW5jdGlvbnMvbGF0ZXN0L2RnL2NvbmNlcHRzLXN0YW5kYXJkLXZzLWV4cHJlc3MuaHRtbFxuICpcbiAqIEBkZWZhdWx0IFNUQU5EQVJEXG4gKi9cbmV4cG9ydCBlbnVtIFN0YXRlTWFjaGluZVR5cGUge1xuICAvKipcbiAgICogRXhwcmVzcyBXb3JrZmxvd3MgYXJlIGlkZWFsIGZvciBoaWdoLXZvbHVtZSwgZXZlbnQgcHJvY2Vzc2luZyB3b3JrbG9hZHMuXG4gICAqL1xuICBFWFBSRVNTID0gJ0VYUFJFU1MnLFxuXG4gIC8qKlxuICAgKiBTdGFuZGFyZCBXb3JrZmxvd3MgYXJlIGlkZWFsIGZvciBsb25nLXJ1bm5pbmcsIGR1cmFibGUsIGFuZCBhdWRpdGFibGUgd29ya2Zsb3dzLlxuICAgKi9cbiAgU1RBTkRBUkQgPSAnU1RBTkRBUkQnXG59XG5cbi8qKlxuICogRGVmaW5lcyB3aGljaCBjYXRlZ29yeSBvZiBleGVjdXRpb24gaGlzdG9yeSBldmVudHMgYXJlIGxvZ2dlZC5cbiAqXG4gKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9zdGVwLWZ1bmN0aW9ucy9sYXRlc3QvZGcvY2xvdWR3YXRjaC1sb2ctbGV2ZWwuaHRtbFxuICpcbiAqIEBkZWZhdWx0IEVSUk9SXG4gKi9cbmV4cG9ydCBlbnVtIExvZ0xldmVsIHtcbiAgLyoqXG4gICAqIE5vIExvZ2dpbmdcbiAgICovXG4gIE9GRiA9ICdPRkYnLFxuICAvKipcbiAgICogTG9nIGV2ZXJ5dGhpbmdcbiAgICovXG4gIEFMTCA9ICdBTEwnLFxuICAvKipcbiAgICogTG9nIGFsbCBlcnJvcnNcbiAgICovXG4gIEVSUk9SID0gJ0VSUk9SJyxcbiAgLyoqXG4gICAqIExvZyBmYXRhbCBlcnJvcnNcbiAgICovXG4gIEZBVEFMID0gJ0ZBVEFMJ1xufVxuXG4vKipcbiAqIERlZmluZXMgd2hhdCBleGVjdXRpb24gaGlzdG9yeSBldmVudHMgYXJlIGxvZ2dlZCBhbmQgd2hlcmUgdGhleSBhcmUgbG9nZ2VkLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIExvZ09wdGlvbnMge1xuICAvKipcbiAgICogVGhlIGxvZyBncm91cCB3aGVyZSB0aGUgZXhlY3V0aW9uIGhpc3RvcnkgZXZlbnRzIHdpbGwgYmUgbG9nZ2VkLlxuICAgKi9cbiAgcmVhZG9ubHkgZGVzdGluYXRpb246IGxvZ3MuSUxvZ0dyb3VwO1xuXG4gIC8qKlxuICAgKiBEZXRlcm1pbmVzIHdoZXRoZXIgZXhlY3V0aW9uIGRhdGEgaXMgaW5jbHVkZWQgaW4geW91ciBsb2cuXG4gICAqXG4gICAqIEBkZWZhdWx0IGZhbHNlXG4gICAqL1xuICByZWFkb25seSBpbmNsdWRlRXhlY3V0aW9uRGF0YT86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIERlZmluZXMgd2hpY2ggY2F0ZWdvcnkgb2YgZXhlY3V0aW9uIGhpc3RvcnkgZXZlbnRzIGFyZSBsb2dnZWQuXG4gICAqXG4gICAqIEBkZWZhdWx0IEVSUk9SXG4gICAqL1xuICByZWFkb25seSBsZXZlbD86IExvZ0xldmVsO1xufVxuXG4vKipcbiAqIFByb3BlcnRpZXMgZm9yIGRlZmluaW5nIGEgU3RhdGUgTWFjaGluZVxuICovXG5leHBvcnQgaW50ZXJmYWNlIFN0YXRlTWFjaGluZVByb3BzIHtcbiAgLyoqXG4gICAqIEEgbmFtZSBmb3IgdGhlIHN0YXRlIG1hY2hpbmVcbiAgICpcbiAgICogQGRlZmF1bHQgQSBuYW1lIGlzIGF1dG9tYXRpY2FsbHkgZ2VuZXJhdGVkXG4gICAqL1xuICByZWFkb25seSBzdGF0ZU1hY2hpbmVOYW1lPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBEZWZpbml0aW9uIGZvciB0aGlzIHN0YXRlIG1hY2hpbmVcbiAgICovXG4gIHJlYWRvbmx5IGRlZmluaXRpb246IElDaGFpbmFibGU7XG5cbiAgLyoqXG4gICAqIFRoZSBleGVjdXRpb24gcm9sZSBmb3IgdGhlIHN0YXRlIG1hY2hpbmUgc2VydmljZVxuICAgKlxuICAgKiBAZGVmYXVsdCBBIHJvbGUgaXMgYXV0b21hdGljYWxseSBjcmVhdGVkXG4gICAqL1xuICByZWFkb25seSByb2xlPzogaWFtLklSb2xlO1xuXG4gIC8qKlxuICAgKiBNYXhpbXVtIHJ1biB0aW1lIGZvciB0aGlzIHN0YXRlIG1hY2hpbmVcbiAgICpcbiAgICogQGRlZmF1bHQgTm8gdGltZW91dFxuICAgKi9cbiAgcmVhZG9ubHkgdGltZW91dD86IER1cmF0aW9uO1xuXG4gIC8qKlxuICAgKiBUeXBlIG9mIHRoZSBzdGF0ZSBtYWNoaW5lXG4gICAqXG4gICAqIEBkZWZhdWx0IFN0YXRlTWFjaGluZVR5cGUuU1RBTkRBUkRcbiAgICovXG4gIHJlYWRvbmx5IHN0YXRlTWFjaGluZVR5cGU/OiBTdGF0ZU1hY2hpbmVUeXBlO1xuXG4gIC8qKlxuICAgKiBEZWZpbmVzIHdoYXQgZXhlY3V0aW9uIGhpc3RvcnkgZXZlbnRzIGFyZSBsb2dnZWQgYW5kIHdoZXJlIHRoZXkgYXJlIGxvZ2dlZC5cbiAgICpcbiAgICogQGRlZmF1bHQgTm8gbG9nZ2luZ1xuICAgKi9cbiAgcmVhZG9ubHkgbG9ncz86IExvZ09wdGlvbnM7XG5cbiAgLyoqXG4gICAqIFNwZWNpZmllcyB3aGV0aGVyIEFtYXpvbiBYLVJheSB0cmFjaW5nIGlzIGVuYWJsZWQgZm9yIHRoaXMgc3RhdGUgbWFjaGluZS5cbiAgICpcbiAgICogQGRlZmF1bHQgZmFsc2VcbiAgICovXG4gIHJlYWRvbmx5IHRyYWNpbmdFbmFibGVkPzogYm9vbGVhbjtcblxuICAvKipcbiAgICogVGhlIHJlbW92YWwgcG9saWN5IHRvIGFwcGx5IHRvIHN0YXRlIG1hY2hpbmVcbiAgICpcbiAgICogQGRlZmF1bHQgUmVtb3ZhbFBvbGljeS5ERVNUUk9ZXG4gICAqL1xuICByZWFkb25seSByZW1vdmFsUG9saWN5PzogUmVtb3ZhbFBvbGljeTtcbn1cblxuLyoqXG4gKiBBIG5ldyBvciBpbXBvcnRlZCBzdGF0ZSBtYWNoaW5lLlxuICovXG5hYnN0cmFjdCBjbGFzcyBTdGF0ZU1hY2hpbmVCYXNlIGV4dGVuZHMgUmVzb3VyY2UgaW1wbGVtZW50cyBJU3RhdGVNYWNoaW5lIHtcblxuICAvKipcbiAgICogSW1wb3J0IGEgc3RhdGUgbWFjaGluZVxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBmcm9tU3RhdGVNYWNoaW5lQXJuKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHN0YXRlTWFjaGluZUFybjogc3RyaW5nKTogSVN0YXRlTWFjaGluZSB7XG4gICAgY2xhc3MgSW1wb3J0IGV4dGVuZHMgU3RhdGVNYWNoaW5lQmFzZSB7XG4gICAgICBwdWJsaWMgcmVhZG9ubHkgc3RhdGVNYWNoaW5lQXJuID0gc3RhdGVNYWNoaW5lQXJuO1xuICAgICAgcHVibGljIHJlYWRvbmx5IGdyYW50UHJpbmNpcGFsID0gbmV3IGlhbS5Vbmtub3duUHJpbmNpcGFsKHsgcmVzb3VyY2U6IHRoaXMgfSk7XG4gICAgfVxuICAgIHJldHVybiBuZXcgSW1wb3J0KHNjb3BlLCBpZCwge1xuICAgICAgZW52aXJvbm1lbnRGcm9tQXJuOiBzdGF0ZU1hY2hpbmVBcm4sXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogSW1wb3J0IGEgc3RhdGUgbWFjaGluZSB2aWEgcmVzb3VyY2UgbmFtZVxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBmcm9tU3RhdGVNYWNoaW5lTmFtZShzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBzdGF0ZU1hY2hpbmVOYW1lOiBzdHJpbmcpOiBJU3RhdGVNYWNoaW5lIHtcbiAgICBjb25zdCBzdGF0ZU1hY2hpbmVBcm4gPSBTdGFjay5vZihzY29wZSkuZm9ybWF0QXJuKHtcbiAgICAgIHNlcnZpY2U6ICdzdGF0ZXMnLFxuICAgICAgcmVzb3VyY2U6ICdzdGF0ZU1hY2hpbmUnLFxuICAgICAgYXJuRm9ybWF0OiBBcm5Gb3JtYXQuQ09MT05fUkVTT1VSQ0VfTkFNRSxcbiAgICAgIHJlc291cmNlTmFtZTogc3RhdGVNYWNoaW5lTmFtZSxcbiAgICB9KTtcbiAgICByZXR1cm4gdGhpcy5mcm9tU3RhdGVNYWNoaW5lQXJuKHNjb3BlLCBpZCwgc3RhdGVNYWNoaW5lQXJuKTtcbiAgfVxuXG4gIHB1YmxpYyBhYnN0cmFjdCByZWFkb25seSBzdGF0ZU1hY2hpbmVBcm46IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIHByaW5jaXBhbCB0aGlzIHN0YXRlIG1hY2hpbmUgaXMgcnVubmluZyBhc1xuICAgKi9cbiAgcHVibGljIGFic3RyYWN0IHJlYWRvbmx5IGdyYW50UHJpbmNpcGFsOiBpYW0uSVByaW5jaXBhbDtcblxuICAvKipcbiAgICogR3JhbnQgdGhlIGdpdmVuIGlkZW50aXR5IHBlcm1pc3Npb25zIHRvIHN0YXJ0IGFuIGV4ZWN1dGlvbiBvZiB0aGlzIHN0YXRlXG4gICAqIG1hY2hpbmUuXG4gICAqL1xuICBwdWJsaWMgZ3JhbnRTdGFydEV4ZWN1dGlvbihpZGVudGl0eTogaWFtLklHcmFudGFibGUpOiBpYW0uR3JhbnQge1xuICAgIHJldHVybiBpYW0uR3JhbnQuYWRkVG9QcmluY2lwYWwoe1xuICAgICAgZ3JhbnRlZTogaWRlbnRpdHksXG4gICAgICBhY3Rpb25zOiBbJ3N0YXRlczpTdGFydEV4ZWN1dGlvbiddLFxuICAgICAgcmVzb3VyY2VBcm5zOiBbdGhpcy5zdGF0ZU1hY2hpbmVBcm5dLFxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEdyYW50IHRoZSBnaXZlbiBpZGVudGl0eSBwZXJtaXNzaW9ucyB0byBzdGFydCBhIHN5bmNocm9ub3VzIGV4ZWN1dGlvbiBvZlxuICAgKiB0aGlzIHN0YXRlIG1hY2hpbmUuXG4gICAqL1xuICBwdWJsaWMgZ3JhbnRTdGFydFN5bmNFeGVjdXRpb24oaWRlbnRpdHk6IGlhbS5JR3JhbnRhYmxlKTogaWFtLkdyYW50IHtcbiAgICByZXR1cm4gaWFtLkdyYW50LmFkZFRvUHJpbmNpcGFsKHtcbiAgICAgIGdyYW50ZWU6IGlkZW50aXR5LFxuICAgICAgYWN0aW9uczogWydzdGF0ZXM6U3RhcnRTeW5jRXhlY3V0aW9uJ10sXG4gICAgICByZXNvdXJjZUFybnM6IFt0aGlzLnN0YXRlTWFjaGluZUFybl0sXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogR3JhbnQgdGhlIGdpdmVuIGlkZW50aXR5IHBlcm1pc3Npb25zIHRvIHJlYWQgcmVzdWx0cyBmcm9tIHN0YXRlXG4gICAqIG1hY2hpbmUuXG4gICAqL1xuICBwdWJsaWMgZ3JhbnRSZWFkKGlkZW50aXR5OiBpYW0uSUdyYW50YWJsZSk6IGlhbS5HcmFudCB7XG4gICAgaWFtLkdyYW50LmFkZFRvUHJpbmNpcGFsKHtcbiAgICAgIGdyYW50ZWU6IGlkZW50aXR5LFxuICAgICAgYWN0aW9uczogW1xuICAgICAgICAnc3RhdGVzOkxpc3RFeGVjdXRpb25zJyxcbiAgICAgICAgJ3N0YXRlczpMaXN0U3RhdGVNYWNoaW5lcycsXG4gICAgICBdLFxuICAgICAgcmVzb3VyY2VBcm5zOiBbdGhpcy5zdGF0ZU1hY2hpbmVBcm5dLFxuICAgIH0pO1xuICAgIGlhbS5HcmFudC5hZGRUb1ByaW5jaXBhbCh7XG4gICAgICBncmFudGVlOiBpZGVudGl0eSxcbiAgICAgIGFjdGlvbnM6IFtcbiAgICAgICAgJ3N0YXRlczpEZXNjcmliZUV4ZWN1dGlvbicsXG4gICAgICAgICdzdGF0ZXM6RGVzY3JpYmVTdGF0ZU1hY2hpbmVGb3JFeGVjdXRpb24nLFxuICAgICAgICAnc3RhdGVzOkdldEV4ZWN1dGlvbkhpc3RvcnknLFxuICAgICAgXSxcbiAgICAgIHJlc291cmNlQXJuczogW2Ake3RoaXMuZXhlY3V0aW9uQXJuKCl9OipgXSxcbiAgICB9KTtcbiAgICByZXR1cm4gaWFtLkdyYW50LmFkZFRvUHJpbmNpcGFsKHtcbiAgICAgIGdyYW50ZWU6IGlkZW50aXR5LFxuICAgICAgYWN0aW9uczogW1xuICAgICAgICAnc3RhdGVzOkxpc3RBY3Rpdml0aWVzJyxcbiAgICAgICAgJ3N0YXRlczpEZXNjcmliZVN0YXRlTWFjaGluZScsXG4gICAgICAgICdzdGF0ZXM6RGVzY3JpYmVBY3Rpdml0eScsXG4gICAgICBdLFxuICAgICAgcmVzb3VyY2VBcm5zOiBbJyonXSxcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHcmFudCB0aGUgZ2l2ZW4gaWRlbnRpdHkgdGFzayByZXNwb25zZSBwZXJtaXNzaW9ucyBvbiBhIHN0YXRlIG1hY2hpbmVcbiAgICovXG4gIHB1YmxpYyBncmFudFRhc2tSZXNwb25zZShpZGVudGl0eTogaWFtLklHcmFudGFibGUpOiBpYW0uR3JhbnQge1xuICAgIHJldHVybiBpYW0uR3JhbnQuYWRkVG9QcmluY2lwYWwoe1xuICAgICAgZ3JhbnRlZTogaWRlbnRpdHksXG4gICAgICBhY3Rpb25zOiBbXG4gICAgICAgICdzdGF0ZXM6U2VuZFRhc2tTdWNjZXNzJyxcbiAgICAgICAgJ3N0YXRlczpTZW5kVGFza0ZhaWx1cmUnLFxuICAgICAgICAnc3RhdGVzOlNlbmRUYXNrSGVhcnRiZWF0JyxcbiAgICAgIF0sXG4gICAgICByZXNvdXJjZUFybnM6IFt0aGlzLnN0YXRlTWFjaGluZUFybl0sXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogR3JhbnQgdGhlIGdpdmVuIGlkZW50aXR5IHBlcm1pc3Npb25zIG9uIGFsbCBleGVjdXRpb25zIG9mIHRoZSBzdGF0ZSBtYWNoaW5lXG4gICAqL1xuICBwdWJsaWMgZ3JhbnRFeGVjdXRpb24oaWRlbnRpdHk6IGlhbS5JR3JhbnRhYmxlLCAuLi5hY3Rpb25zOiBzdHJpbmdbXSkge1xuICAgIHJldHVybiBpYW0uR3JhbnQuYWRkVG9QcmluY2lwYWwoe1xuICAgICAgZ3JhbnRlZTogaWRlbnRpdHksXG4gICAgICBhY3Rpb25zLFxuICAgICAgcmVzb3VyY2VBcm5zOiBbYCR7dGhpcy5leGVjdXRpb25Bcm4oKX06KmBdLFxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEdyYW50IHRoZSBnaXZlbiBpZGVudGl0eSBjdXN0b20gcGVybWlzc2lvbnNcbiAgICovXG4gIHB1YmxpYyBncmFudChpZGVudGl0eTogaWFtLklHcmFudGFibGUsIC4uLmFjdGlvbnM6IHN0cmluZ1tdKTogaWFtLkdyYW50IHtcbiAgICByZXR1cm4gaWFtLkdyYW50LmFkZFRvUHJpbmNpcGFsKHtcbiAgICAgIGdyYW50ZWU6IGlkZW50aXR5LFxuICAgICAgYWN0aW9ucyxcbiAgICAgIHJlc291cmNlQXJuczogW3RoaXMuc3RhdGVNYWNoaW5lQXJuXSxcbiAgICB9KTtcbiAgfVxuXG5cbiAgLyoqXG4gICAqIFJldHVybiB0aGUgZ2l2ZW4gbmFtZWQgbWV0cmljIGZvciB0aGlzIFN0YXRlIE1hY2hpbmUncyBleGVjdXRpb25zXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gc3VtIG92ZXIgNSBtaW51dGVzXG4gICAqL1xuICBwdWJsaWMgbWV0cmljKG1ldHJpY05hbWU6IHN0cmluZywgcHJvcHM/OiBjbG91ZHdhdGNoLk1ldHJpY09wdGlvbnMpOiBjbG91ZHdhdGNoLk1ldHJpYyB7XG4gICAgcmV0dXJuIG5ldyBjbG91ZHdhdGNoLk1ldHJpYyh7XG4gICAgICBuYW1lc3BhY2U6ICdBV1MvU3RhdGVzJyxcbiAgICAgIG1ldHJpY05hbWUsXG4gICAgICBkaW1lbnNpb25zTWFwOiB7IFN0YXRlTWFjaGluZUFybjogdGhpcy5zdGF0ZU1hY2hpbmVBcm4gfSxcbiAgICAgIHN0YXRpc3RpYzogJ3N1bScsXG4gICAgICAuLi5wcm9wcyxcbiAgICB9KS5hdHRhY2hUbyh0aGlzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBNZXRyaWMgZm9yIHRoZSBudW1iZXIgb2YgZXhlY3V0aW9ucyB0aGF0IGZhaWxlZFxuICAgKlxuICAgKiBAZGVmYXVsdCAtIHN1bSBvdmVyIDUgbWludXRlc1xuICAgKi9cbiAgcHVibGljIG1ldHJpY0ZhaWxlZChwcm9wcz86IGNsb3Vkd2F0Y2guTWV0cmljT3B0aW9ucyk6IGNsb3Vkd2F0Y2guTWV0cmljIHtcbiAgICByZXR1cm4gdGhpcy5jYW5uZWRNZXRyaWMoU3RhdGVzTWV0cmljcy5leGVjdXRpb25zRmFpbGVkU3VtLCBwcm9wcyk7XG4gIH1cblxuICAvKipcbiAgICogTWV0cmljIGZvciB0aGUgbnVtYmVyIG9mIGV4ZWN1dGlvbnMgdGhhdCB3ZXJlIHRocm90dGxlZFxuICAgKlxuICAgKiBAZGVmYXVsdCAtIHN1bSBvdmVyIDUgbWludXRlc1xuICAgKi9cbiAgcHVibGljIG1ldHJpY1Rocm90dGxlZChwcm9wcz86IGNsb3Vkd2F0Y2guTWV0cmljT3B0aW9ucyk6IGNsb3Vkd2F0Y2guTWV0cmljIHtcbiAgICAvLyBUaGVyZSdzIGEgdHlwbyBpbiB0aGUgXCJjYW5uZWRcIiB2ZXJzaW9uIG9mIHRoaXNcbiAgICByZXR1cm4gdGhpcy5tZXRyaWMoJ0V4ZWN1dGlvblRocm90dGxlZCcsIHByb3BzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBNZXRyaWMgZm9yIHRoZSBudW1iZXIgb2YgZXhlY3V0aW9ucyB0aGF0IHdlcmUgYWJvcnRlZFxuICAgKlxuICAgKiBAZGVmYXVsdCAtIHN1bSBvdmVyIDUgbWludXRlc1xuICAgKi9cbiAgcHVibGljIG1ldHJpY0Fib3J0ZWQocHJvcHM/OiBjbG91ZHdhdGNoLk1ldHJpY09wdGlvbnMpOiBjbG91ZHdhdGNoLk1ldHJpYyB7XG4gICAgcmV0dXJuIHRoaXMuY2FubmVkTWV0cmljKFN0YXRlc01ldHJpY3MuZXhlY3V0aW9uc0Fib3J0ZWRTdW0sIHByb3BzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBNZXRyaWMgZm9yIHRoZSBudW1iZXIgb2YgZXhlY3V0aW9ucyB0aGF0IHN1Y2NlZWRlZFxuICAgKlxuICAgKiBAZGVmYXVsdCAtIHN1bSBvdmVyIDUgbWludXRlc1xuICAgKi9cbiAgcHVibGljIG1ldHJpY1N1Y2NlZWRlZChwcm9wcz86IGNsb3Vkd2F0Y2guTWV0cmljT3B0aW9ucyk6IGNsb3Vkd2F0Y2guTWV0cmljIHtcbiAgICByZXR1cm4gdGhpcy5jYW5uZWRNZXRyaWMoU3RhdGVzTWV0cmljcy5leGVjdXRpb25zU3VjY2VlZGVkU3VtLCBwcm9wcyk7XG4gIH1cblxuICAvKipcbiAgICogTWV0cmljIGZvciB0aGUgbnVtYmVyIG9mIGV4ZWN1dGlvbnMgdGhhdCB0aW1lZCBvdXRcbiAgICpcbiAgICogQGRlZmF1bHQgLSBzdW0gb3ZlciA1IG1pbnV0ZXNcbiAgICovXG4gIHB1YmxpYyBtZXRyaWNUaW1lZE91dChwcm9wcz86IGNsb3Vkd2F0Y2guTWV0cmljT3B0aW9ucyk6IGNsb3Vkd2F0Y2guTWV0cmljIHtcbiAgICByZXR1cm4gdGhpcy5jYW5uZWRNZXRyaWMoU3RhdGVzTWV0cmljcy5leGVjdXRpb25zVGltZWRPdXRTdW0sIHByb3BzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBNZXRyaWMgZm9yIHRoZSBudW1iZXIgb2YgZXhlY3V0aW9ucyB0aGF0IHdlcmUgc3RhcnRlZFxuICAgKlxuICAgKiBAZGVmYXVsdCAtIHN1bSBvdmVyIDUgbWludXRlc1xuICAgKi9cbiAgcHVibGljIG1ldHJpY1N0YXJ0ZWQocHJvcHM/OiBjbG91ZHdhdGNoLk1ldHJpY09wdGlvbnMpOiBjbG91ZHdhdGNoLk1ldHJpYyB7XG4gICAgcmV0dXJuIHRoaXMubWV0cmljKCdFeGVjdXRpb25zU3RhcnRlZCcsIHByb3BzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBNZXRyaWMgZm9yIHRoZSBpbnRlcnZhbCwgaW4gbWlsbGlzZWNvbmRzLCBiZXR3ZWVuIHRoZSB0aW1lIHRoZSBleGVjdXRpb24gc3RhcnRzIGFuZCB0aGUgdGltZSBpdCBjbG9zZXNcbiAgICpcbiAgICogQGRlZmF1bHQgLSBhdmVyYWdlIG92ZXIgNSBtaW51dGVzXG4gICAqL1xuICBwdWJsaWMgbWV0cmljVGltZShwcm9wcz86IGNsb3Vkd2F0Y2guTWV0cmljT3B0aW9ucyk6IGNsb3Vkd2F0Y2guTWV0cmljIHtcbiAgICByZXR1cm4gdGhpcy5jYW5uZWRNZXRyaWMoU3RhdGVzTWV0cmljcy5leGVjdXRpb25UaW1lQXZlcmFnZSwgcHJvcHMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIHBhdHRlcm4gZm9yIHRoZSBleGVjdXRpb24gQVJOJ3Mgb2YgdGhlIHN0YXRlIG1hY2hpbmVcbiAgICovXG4gIHByaXZhdGUgZXhlY3V0aW9uQXJuKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIFN0YWNrLm9mKHRoaXMpLmZvcm1hdEFybih7XG4gICAgICByZXNvdXJjZTogJ2V4ZWN1dGlvbicsXG4gICAgICBzZXJ2aWNlOiAnc3RhdGVzJyxcbiAgICAgIHJlc291cmNlTmFtZTogQXJuLnNwbGl0KHRoaXMuc3RhdGVNYWNoaW5lQXJuLCBBcm5Gb3JtYXQuQ09MT05fUkVTT1VSQ0VfTkFNRSkucmVzb3VyY2VOYW1lLFxuICAgICAgYXJuRm9ybWF0OiBBcm5Gb3JtYXQuQ09MT05fUkVTT1VSQ0VfTkFNRSxcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgY2FubmVkTWV0cmljKFxuICAgIGZuOiAoZGltczogeyBTdGF0ZU1hY2hpbmVBcm46IHN0cmluZyB9KSA9PiBjbG91ZHdhdGNoLk1ldHJpY1Byb3BzLFxuICAgIHByb3BzPzogY2xvdWR3YXRjaC5NZXRyaWNPcHRpb25zKTogY2xvdWR3YXRjaC5NZXRyaWMge1xuICAgIHJldHVybiBuZXcgY2xvdWR3YXRjaC5NZXRyaWMoe1xuICAgICAgLi4uZm4oeyBTdGF0ZU1hY2hpbmVBcm46IHRoaXMuc3RhdGVNYWNoaW5lQXJuIH0pLFxuICAgICAgLi4ucHJvcHMsXG4gICAgfSkuYXR0YWNoVG8odGhpcyk7XG4gIH1cbn1cblxuLyoqXG4gKiBEZWZpbmUgYSBTdGVwRnVuY3Rpb25zIFN0YXRlIE1hY2hpbmVcbiAqL1xuZXhwb3J0IGNsYXNzIFN0YXRlTWFjaGluZSBleHRlbmRzIFN0YXRlTWFjaGluZUJhc2Uge1xuICAvKipcbiAgICogRXhlY3V0aW9uIHJvbGUgb2YgdGhpcyBzdGF0ZSBtYWNoaW5lXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgcm9sZTogaWFtLklSb2xlO1xuXG4gIC8qKlxuICAgKiBUaGUgbmFtZSBvZiB0aGUgc3RhdGUgbWFjaGluZVxuICAgKiBAYXR0cmlidXRlXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgc3RhdGVNYWNoaW5lTmFtZTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgQVJOIG9mIHRoZSBzdGF0ZSBtYWNoaW5lXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgc3RhdGVNYWNoaW5lQXJuOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFR5cGUgb2YgdGhlIHN0YXRlIG1hY2hpbmVcbiAgICogQGF0dHJpYnV0ZVxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IHN0YXRlTWFjaGluZVR5cGU6IFN0YXRlTWFjaGluZVR5cGU7XG5cbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IFN0YXRlTWFjaGluZVByb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCB7XG4gICAgICBwaHlzaWNhbE5hbWU6IHByb3BzLnN0YXRlTWFjaGluZU5hbWUsXG4gICAgfSk7XG5cbiAgICBpZiAocHJvcHMuc3RhdGVNYWNoaW5lTmFtZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aGlzLnZhbGlkYXRlU3RhdGVNYWNoaW5lTmFtZShwcm9wcy5zdGF0ZU1hY2hpbmVOYW1lKTtcbiAgICB9XG5cbiAgICB0aGlzLnJvbGUgPSBwcm9wcy5yb2xlIHx8IG5ldyBpYW0uUm9sZSh0aGlzLCAnUm9sZScsIHtcbiAgICAgIGFzc3VtZWRCeTogbmV3IGlhbS5TZXJ2aWNlUHJpbmNpcGFsKCdzdGF0ZXMuYW1hem9uYXdzLmNvbScpLFxuICAgIH0pO1xuXG4gICAgY29uc3QgZ3JhcGggPSBuZXcgU3RhdGVHcmFwaChwcm9wcy5kZWZpbml0aW9uLnN0YXJ0U3RhdGUsIGBTdGF0ZSBNYWNoaW5lICR7aWR9IGRlZmluaXRpb25gKTtcbiAgICBncmFwaC50aW1lb3V0ID0gcHJvcHMudGltZW91dDtcblxuICAgIHRoaXMuc3RhdGVNYWNoaW5lVHlwZSA9IHByb3BzLnN0YXRlTWFjaGluZVR5cGUgPz8gU3RhdGVNYWNoaW5lVHlwZS5TVEFOREFSRDtcblxuICAgIGNvbnN0IHJlc291cmNlID0gbmV3IENmblN0YXRlTWFjaGluZSh0aGlzLCAnUmVzb3VyY2UnLCB7XG4gICAgICBzdGF0ZU1hY2hpbmVOYW1lOiB0aGlzLnBoeXNpY2FsTmFtZSxcbiAgICAgIHN0YXRlTWFjaGluZVR5cGU6IHByb3BzLnN0YXRlTWFjaGluZVR5cGUgPz8gdW5kZWZpbmVkLFxuICAgICAgcm9sZUFybjogdGhpcy5yb2xlLnJvbGVBcm4sXG4gICAgICBkZWZpbml0aW9uU3RyaW5nOiBTdGFjay5vZih0aGlzKS50b0pzb25TdHJpbmcoZ3JhcGgudG9HcmFwaEpzb24oKSksXG4gICAgICBsb2dnaW5nQ29uZmlndXJhdGlvbjogcHJvcHMubG9ncyA/IHRoaXMuYnVpbGRMb2dnaW5nQ29uZmlndXJhdGlvbihwcm9wcy5sb2dzKSA6IHVuZGVmaW5lZCxcbiAgICAgIHRyYWNpbmdDb25maWd1cmF0aW9uOiBwcm9wcy50cmFjaW5nRW5hYmxlZCA/IHRoaXMuYnVpbGRUcmFjaW5nQ29uZmlndXJhdGlvbigpIDogdW5kZWZpbmVkLFxuICAgIH0pO1xuICAgIHJlc291cmNlLmFwcGx5UmVtb3ZhbFBvbGljeShwcm9wcy5yZW1vdmFsUG9saWN5LCB7IGRlZmF1bHQ6IFJlbW92YWxQb2xpY3kuREVTVFJPWSB9KTtcblxuICAgIHJlc291cmNlLm5vZGUuYWRkRGVwZW5kZW5jeSh0aGlzLnJvbGUpO1xuXG4gICAgZm9yIChjb25zdCBzdGF0ZW1lbnQgb2YgZ3JhcGgucG9saWN5U3RhdGVtZW50cykge1xuICAgICAgdGhpcy5hZGRUb1JvbGVQb2xpY3koc3RhdGVtZW50KTtcbiAgICB9XG5cbiAgICB0aGlzLnN0YXRlTWFjaGluZU5hbWUgPSB0aGlzLmdldFJlc291cmNlTmFtZUF0dHJpYnV0ZShyZXNvdXJjZS5hdHRyTmFtZSk7XG4gICAgdGhpcy5zdGF0ZU1hY2hpbmVBcm4gPSB0aGlzLmdldFJlc291cmNlQXJuQXR0cmlidXRlKHJlc291cmNlLnJlZiwge1xuICAgICAgc2VydmljZTogJ3N0YXRlcycsXG4gICAgICByZXNvdXJjZTogJ3N0YXRlTWFjaGluZScsXG4gICAgICByZXNvdXJjZU5hbWU6IHRoaXMucGh5c2ljYWxOYW1lLFxuICAgICAgYXJuRm9ybWF0OiBBcm5Gb3JtYXQuQ09MT05fUkVTT1VSQ0VfTkFNRSxcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgcHJpbmNpcGFsIHRoaXMgc3RhdGUgbWFjaGluZSBpcyBydW5uaW5nIGFzXG4gICAqL1xuICBwdWJsaWMgZ2V0IGdyYW50UHJpbmNpcGFsKCkge1xuICAgIHJldHVybiB0aGlzLnJvbGUuZ3JhbnRQcmluY2lwYWw7XG4gIH1cblxuICAvKipcbiAgICogQWRkIHRoZSBnaXZlbiBzdGF0ZW1lbnQgdG8gdGhlIHJvbGUncyBwb2xpY3lcbiAgICovXG4gIHB1YmxpYyBhZGRUb1JvbGVQb2xpY3koc3RhdGVtZW50OiBpYW0uUG9saWN5U3RhdGVtZW50KSB7XG4gICAgdGhpcy5yb2xlLmFkZFRvUHJpbmNpcGFsUG9saWN5KHN0YXRlbWVudCk7XG4gIH1cblxuICBwcml2YXRlIHZhbGlkYXRlU3RhdGVNYWNoaW5lTmFtZShzdGF0ZU1hY2hpbmVOYW1lOiBzdHJpbmcpIHtcbiAgICBpZiAoIVRva2VuLmlzVW5yZXNvbHZlZChzdGF0ZU1hY2hpbmVOYW1lKSkge1xuICAgICAgaWYgKHN0YXRlTWFjaGluZU5hbWUubGVuZ3RoIDwgMSB8fCBzdGF0ZU1hY2hpbmVOYW1lLmxlbmd0aCA+IDgwKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgU3RhdGUgTWFjaGluZSBuYW1lIG11c3QgYmUgYmV0d2VlbiAxIGFuZCA4MCBjaGFyYWN0ZXJzLiBSZWNlaXZlZDogJHtzdGF0ZU1hY2hpbmVOYW1lfWApO1xuICAgICAgfVxuXG4gICAgICBpZiAoIXN0YXRlTWFjaGluZU5hbWUubWF0Y2goL15bYS16MC05XFwrXFwhXFxAXFwuXFwoXFwpXFwtXFw9XFxfXFwnXSskL2kpKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgU3RhdGUgTWFjaGluZSBuYW1lIG11c3QgbWF0Y2ggXCJeW2EtejAtOSshQC4oKS09XyddKyQvaVwiLiBSZWNlaXZlZDogJHtzdGF0ZU1hY2hpbmVOYW1lfWApO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgYnVpbGRMb2dnaW5nQ29uZmlndXJhdGlvbihsb2dPcHRpb25zOiBMb2dPcHRpb25zKTogQ2ZuU3RhdGVNYWNoaW5lLkxvZ2dpbmdDb25maWd1cmF0aW9uUHJvcGVydHkge1xuICAgIC8vIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9zdGVwLWZ1bmN0aW9ucy9sYXRlc3QvZGcvY3ctbG9ncy5odG1sI2Nsb3Vkd2F0Y2gtaWFtLXBvbGljeVxuICAgIHRoaXMuYWRkVG9Sb2xlUG9saWN5KG5ldyBpYW0uUG9saWN5U3RhdGVtZW50KHtcbiAgICAgIGVmZmVjdDogaWFtLkVmZmVjdC5BTExPVyxcbiAgICAgIGFjdGlvbnM6IFtcbiAgICAgICAgJ2xvZ3M6Q3JlYXRlTG9nRGVsaXZlcnknLFxuICAgICAgICAnbG9nczpHZXRMb2dEZWxpdmVyeScsXG4gICAgICAgICdsb2dzOlVwZGF0ZUxvZ0RlbGl2ZXJ5JyxcbiAgICAgICAgJ2xvZ3M6RGVsZXRlTG9nRGVsaXZlcnknLFxuICAgICAgICAnbG9nczpMaXN0TG9nRGVsaXZlcmllcycsXG4gICAgICAgICdsb2dzOlB1dFJlc291cmNlUG9saWN5JyxcbiAgICAgICAgJ2xvZ3M6RGVzY3JpYmVSZXNvdXJjZVBvbGljaWVzJyxcbiAgICAgICAgJ2xvZ3M6RGVzY3JpYmVMb2dHcm91cHMnLFxuICAgICAgXSxcbiAgICAgIHJlc291cmNlczogWycqJ10sXG4gICAgfSkpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIGRlc3RpbmF0aW9uczogW3tcbiAgICAgICAgY2xvdWRXYXRjaExvZ3NMb2dHcm91cDogeyBsb2dHcm91cEFybjogbG9nT3B0aW9ucy5kZXN0aW5hdGlvbi5sb2dHcm91cEFybiB9LFxuICAgICAgfV0sXG4gICAgICBpbmNsdWRlRXhlY3V0aW9uRGF0YTogbG9nT3B0aW9ucy5pbmNsdWRlRXhlY3V0aW9uRGF0YSxcbiAgICAgIGxldmVsOiBsb2dPcHRpb25zLmxldmVsIHx8ICdFUlJPUicsXG4gICAgfTtcbiAgfVxuXG4gIHByaXZhdGUgYnVpbGRUcmFjaW5nQ29uZmlndXJhdGlvbigpOiBDZm5TdGF0ZU1hY2hpbmUuVHJhY2luZ0NvbmZpZ3VyYXRpb25Qcm9wZXJ0eSB7XG4gICAgdGhpcy5hZGRUb1JvbGVQb2xpY3kobmV3IGlhbS5Qb2xpY3lTdGF0ZW1lbnQoe1xuICAgICAgLy8gaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL3hyYXkvbGF0ZXN0L2Rldmd1aWRlL3NlY3VyaXR5X2lhbV9pZC1iYXNlZC1wb2xpY3ktZXhhbXBsZXMuaHRtbCN4cmF5LXBlcm1pc3Npb25zLXJlc291cmNlc1xuICAgICAgLy8gaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL3N0ZXAtZnVuY3Rpb25zL2xhdGVzdC9kZy94cmF5LWlhbS5odG1sXG4gICAgICBhY3Rpb25zOiBbXG4gICAgICAgICd4cmF5OlB1dFRyYWNlU2VnbWVudHMnLFxuICAgICAgICAneHJheTpQdXRUZWxlbWV0cnlSZWNvcmRzJyxcbiAgICAgICAgJ3hyYXk6R2V0U2FtcGxpbmdSdWxlcycsXG4gICAgICAgICd4cmF5OkdldFNhbXBsaW5nVGFyZ2V0cycsXG4gICAgICBdLFxuICAgICAgcmVzb3VyY2VzOiBbJyonXSxcbiAgICB9KSk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgZW5hYmxlZDogdHJ1ZSxcbiAgICB9O1xuICB9XG59XG5cbi8qKlxuICogQSBTdGF0ZSBNYWNoaW5lXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgSVN0YXRlTWFjaGluZSBleHRlbmRzIElSZXNvdXJjZSwgaWFtLklHcmFudGFibGUge1xuICAvKipcbiAgICogVGhlIEFSTiBvZiB0aGUgc3RhdGUgbWFjaGluZVxuICAgKiBAYXR0cmlidXRlXG4gICAqL1xuICByZWFkb25seSBzdGF0ZU1hY2hpbmVBcm46IHN0cmluZztcblxuICAvKipcbiAgICogR3JhbnQgdGhlIGdpdmVuIGlkZW50aXR5IHBlcm1pc3Npb25zIHRvIHN0YXJ0IGFuIGV4ZWN1dGlvbiBvZiB0aGlzIHN0YXRlXG4gICAqIG1hY2hpbmUuXG4gICAqXG4gICAqIEBwYXJhbSBpZGVudGl0eSBUaGUgcHJpbmNpcGFsXG4gICAqL1xuICBncmFudFN0YXJ0RXhlY3V0aW9uKGlkZW50aXR5OiBpYW0uSUdyYW50YWJsZSk6IGlhbS5HcmFudDtcblxuICAvKipcbiAgICogR3JhbnQgdGhlIGdpdmVuIGlkZW50aXR5IHBlcm1pc3Npb25zIHRvIHN0YXJ0IGEgc3luY2hyb25vdXMgZXhlY3V0aW9uIG9mXG4gICAqIHRoaXMgc3RhdGUgbWFjaGluZS5cbiAgICpcbiAgICogQHBhcmFtIGlkZW50aXR5IFRoZSBwcmluY2lwYWxcbiAgICovXG4gIGdyYW50U3RhcnRTeW5jRXhlY3V0aW9uKGlkZW50aXR5OiBpYW0uSUdyYW50YWJsZSk6IGlhbS5HcmFudDtcblxuICAvKipcbiAgICogR3JhbnQgdGhlIGdpdmVuIGlkZW50aXR5IHJlYWQgcGVybWlzc2lvbnMgZm9yIHRoaXMgc3RhdGUgbWFjaGluZVxuICAgKlxuICAgKiBAcGFyYW0gaWRlbnRpdHkgVGhlIHByaW5jaXBhbFxuICAgKi9cbiAgZ3JhbnRSZWFkKGlkZW50aXR5OiBpYW0uSUdyYW50YWJsZSk6IGlhbS5HcmFudDtcblxuICAvKipcbiAgICogR3JhbnQgdGhlIGdpdmVuIGlkZW50aXR5IHJlYWQgcGVybWlzc2lvbnMgZm9yIHRoaXMgc3RhdGUgbWFjaGluZVxuICAgKlxuICAgKiBAcGFyYW0gaWRlbnRpdHkgVGhlIHByaW5jaXBhbFxuICAgKi9cbiAgZ3JhbnRUYXNrUmVzcG9uc2UoaWRlbnRpdHk6IGlhbS5JR3JhbnRhYmxlKTogaWFtLkdyYW50O1xuXG4gIC8qKlxuICAgKiBHcmFudCB0aGUgZ2l2ZW4gaWRlbnRpdHkgcGVybWlzc2lvbnMgZm9yIGFsbCBleGVjdXRpb25zIG9mIGEgc3RhdGUgbWFjaGluZVxuICAgKlxuICAgKiBAcGFyYW0gaWRlbnRpdHkgVGhlIHByaW5jaXBhbFxuICAgKiBAcGFyYW0gYWN0aW9ucyBUaGUgbGlzdCBvZiBkZXNpcmVkIGFjdGlvbnNcbiAgICovXG4gIGdyYW50RXhlY3V0aW9uKGlkZW50aXR5OiBpYW0uSUdyYW50YWJsZSwgLi4uYWN0aW9uczogc3RyaW5nW10pOiBpYW0uR3JhbnQ7XG5cbiAgLyoqXG4gICAqIEdyYW50IHRoZSBnaXZlbiBpZGVudGl0eSBjdXN0b20gcGVybWlzc2lvbnNcbiAgICpcbiAgICogQHBhcmFtIGlkZW50aXR5IFRoZSBwcmluY2lwYWxcbiAgICogQHBhcmFtIGFjdGlvbnMgVGhlIGxpc3Qgb2YgZGVzaXJlZCBhY3Rpb25zXG4gICAqL1xuICBncmFudChpZGVudGl0eTogaWFtLklHcmFudGFibGUsIC4uLmFjdGlvbnM6IHN0cmluZ1tdKTogaWFtLkdyYW50O1xuXG4gIC8qKlxuICAgKiBSZXR1cm4gdGhlIGdpdmVuIG5hbWVkIG1ldHJpYyBmb3IgdGhpcyBTdGF0ZSBNYWNoaW5lJ3MgZXhlY3V0aW9uc1xuICAgKlxuICAgKiBAZGVmYXVsdCAtIHN1bSBvdmVyIDUgbWludXRlc1xuICAgKi9cbiAgbWV0cmljKG1ldHJpY05hbWU6IHN0cmluZywgcHJvcHM/OiBjbG91ZHdhdGNoLk1ldHJpY09wdGlvbnMpOiBjbG91ZHdhdGNoLk1ldHJpYztcblxuICAvKipcbiAgICogTWV0cmljIGZvciB0aGUgbnVtYmVyIG9mIGV4ZWN1dGlvbnMgdGhhdCBmYWlsZWRcbiAgICpcbiAgICogQGRlZmF1bHQgLSBzdW0gb3ZlciA1IG1pbnV0ZXNcbiAgICovXG4gIG1ldHJpY0ZhaWxlZChwcm9wcz86IGNsb3Vkd2F0Y2guTWV0cmljT3B0aW9ucyk6IGNsb3Vkd2F0Y2guTWV0cmljO1xuXG4gIC8qKlxuICAgKiBNZXRyaWMgZm9yIHRoZSBudW1iZXIgb2YgZXhlY3V0aW9ucyB0aGF0IHdlcmUgdGhyb3R0bGVkXG4gICAqXG4gICAqIEBkZWZhdWx0IHN1bSBvdmVyIDUgbWludXRlc1xuICAgKi9cbiAgbWV0cmljVGhyb3R0bGVkKHByb3BzPzogY2xvdWR3YXRjaC5NZXRyaWNPcHRpb25zKTogY2xvdWR3YXRjaC5NZXRyaWM7XG5cbiAgLyoqXG4gICAqIE1ldHJpYyBmb3IgdGhlIG51bWJlciBvZiBleGVjdXRpb25zIHRoYXQgd2VyZSBhYm9ydGVkXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gc3VtIG92ZXIgNSBtaW51dGVzXG4gICAqL1xuICBtZXRyaWNBYm9ydGVkKHByb3BzPzogY2xvdWR3YXRjaC5NZXRyaWNPcHRpb25zKTogY2xvdWR3YXRjaC5NZXRyaWM7XG5cbiAgLyoqXG4gICAqIE1ldHJpYyBmb3IgdGhlIG51bWJlciBvZiBleGVjdXRpb25zIHRoYXQgc3VjY2VlZGVkXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gc3VtIG92ZXIgNSBtaW51dGVzXG4gICAqL1xuICBtZXRyaWNTdWNjZWVkZWQocHJvcHM/OiBjbG91ZHdhdGNoLk1ldHJpY09wdGlvbnMpOiBjbG91ZHdhdGNoLk1ldHJpYztcblxuICAvKipcbiAgICogTWV0cmljIGZvciB0aGUgbnVtYmVyIG9mIGV4ZWN1dGlvbnMgdGhhdCB0aW1lZCBvdXRcbiAgICpcbiAgICogQGRlZmF1bHQgLSBzdW0gb3ZlciA1IG1pbnV0ZXNcbiAgICovXG4gIG1ldHJpY1RpbWVkT3V0KHByb3BzPzogY2xvdWR3YXRjaC5NZXRyaWNPcHRpb25zKTogY2xvdWR3YXRjaC5NZXRyaWM7XG5cbiAgLyoqXG4gICAqIE1ldHJpYyBmb3IgdGhlIG51bWJlciBvZiBleGVjdXRpb25zIHRoYXQgd2VyZSBzdGFydGVkXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gc3VtIG92ZXIgNSBtaW51dGVzXG4gICAqL1xuICBtZXRyaWNTdGFydGVkKHByb3BzPzogY2xvdWR3YXRjaC5NZXRyaWNPcHRpb25zKTogY2xvdWR3YXRjaC5NZXRyaWM7XG5cbiAgLyoqXG4gICAqIE1ldHJpYyBmb3IgdGhlIGludGVydmFsLCBpbiBtaWxsaXNlY29uZHMsIGJldHdlZW4gdGhlIHRpbWUgdGhlIGV4ZWN1dGlvbiBzdGFydHMgYW5kIHRoZSB0aW1lIGl0IGNsb3Nlc1xuICAgKlxuICAgKiBAZGVmYXVsdCAtIHN1bSBvdmVyIDUgbWludXRlc1xuICAgKi9cbiAgbWV0cmljVGltZShwcm9wcz86IGNsb3Vkd2F0Y2guTWV0cmljT3B0aW9ucyk6IGNsb3Vkd2F0Y2guTWV0cmljO1xufVxuIl19