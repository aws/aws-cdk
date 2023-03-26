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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhdGUtbWFjaGluZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInN0YXRlLW1hY2hpbmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsc0RBQXNEO0FBQ3RELHdDQUF3QztBQUV4Qyx3Q0FBNEY7QUFFNUYsK0NBQTJDO0FBQzNDLHFHQUF5RTtBQUN6RSx1RUFBNEQ7QUFHNUQ7Ozs7OztHQU1HO0FBQ0gsSUFBWSxnQkFVWDtBQVZELFdBQVksZ0JBQWdCO0lBQzFCOztPQUVHO0lBQ0gsdUNBQW1CLENBQUE7SUFFbkI7O09BRUc7SUFDSCx5Q0FBcUIsQ0FBQTtBQUN2QixDQUFDLEVBVlcsZ0JBQWdCLEdBQWhCLHdCQUFnQixLQUFoQix3QkFBZ0IsUUFVM0I7QUFFRDs7Ozs7O0dBTUc7QUFDSCxJQUFZLFFBaUJYO0FBakJELFdBQVksUUFBUTtJQUNsQjs7T0FFRztJQUNILHVCQUFXLENBQUE7SUFDWDs7T0FFRztJQUNILHVCQUFXLENBQUE7SUFDWDs7T0FFRztJQUNILDJCQUFlLENBQUE7SUFDZjs7T0FFRztJQUNILDJCQUFlLENBQUE7QUFDakIsQ0FBQyxFQWpCVyxRQUFRLEdBQVIsZ0JBQVEsS0FBUixnQkFBUSxRQWlCbkI7QUE4RUQ7O0dBRUc7QUFDSCxNQUFlLGdCQUFpQixTQUFRLGVBQVE7SUFFOUM7O09BRUc7SUFDSSxNQUFNLENBQUMsbUJBQW1CLENBQUMsS0FBZ0IsRUFBRSxFQUFVLEVBQUUsZUFBdUI7UUFDckYsTUFBTSxNQUFPLFNBQVEsZ0JBQWdCO1lBQXJDOztnQkFDa0Isb0JBQWUsR0FBRyxlQUFlLENBQUM7Z0JBQ2xDLG1CQUFjLEdBQUcsSUFBSSxHQUFHLENBQUMsZ0JBQWdCLENBQUMsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztZQUNoRixDQUFDO1NBQUE7UUFDRCxPQUFPLElBQUksTUFBTSxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUU7WUFDM0Isa0JBQWtCLEVBQUUsZUFBZTtTQUNwQyxD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S0FDRjtJQUVPLHlCQUF5QixDQUFDLFVBQXNCO1FBQ3RELDBGQUEwRjtRQUMxRixJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksR0FBRyxDQUFDLGVBQWUsQ0FBQztZQUMzQyxNQUFNLEVBQUUsR0FBRyxDQUFDLE1BQU0sQ0FBQyxLQUFLO1lBQ3hCLE9BQU8sRUFBRTtnQkFDUCx3QkFBd0I7Z0JBQ3hCLHFCQUFxQjtnQkFDckIsd0JBQXdCO2dCQUN4Qix3QkFBd0I7Z0JBQ3hCLHdCQUF3QjtnQkFDeEIsd0JBQXdCO2dCQUN4QiwrQkFBK0I7Z0JBQy9CLHdCQUF3QjthQUN6QjtZQUNELFNBQVMsRUFBRSxDQUFDLEdBQUcsQ0FBQztTQUNqQixDQUFDLENBQUMsQ0FBQztRQUVKLE9BQU87WUFDTCxZQUFZLEVBQUUsQ0FBQztvQkFDYixzQkFBc0IsRUFBRSxFQUFFLFdBQVcsRUFBRSxVQUFVLENBQUMsV0FBVyxDQUFDLFdBQVcsRUFBRTtpQkFDNUUsQ0FBQztZQUNGLG9CQUFvQixFQUFFLFVBQVUsQ0FBQyxvQkFBb0I7WUFDckQsS0FBSyxFQUFFLFVBQVUsQ0FBQyxLQUFLLElBQUksT0FBTztTQUNuQyxDQUFDO0tBQ0g7SUFFTyx5QkFBeUI7UUFDL0IsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxlQUFlLENBQUM7WUFDM0MseUhBQXlIO1lBQ3pILHFFQUFxRTtZQUNyRSxPQUFPLEVBQUU7Z0JBQ1AsdUJBQXVCO2dCQUN2QiwwQkFBMEI7Z0JBQzFCLHVCQUF1QjtnQkFDdkIseUJBQXlCO2FBQzFCO1lBQ0QsU0FBUyxFQUFFLENBQUMsR0FBRyxDQUFDO1NBQ2pCLENBQUMsQ0FBQyxDQUFDO1FBRUosT0FBTztZQUNMLE9BQU8sRUFBRSxJQUFJO1NBQ2QsQ0FBQztLQUNIOztBQXJJSCxvQ0FzSUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBjbG91ZHdhdGNoIGZyb20gJ0Bhd3MtY2RrL2F3cy1jbG91ZHdhdGNoJztcbmltcG9ydCAqIGFzIGlhbSBmcm9tICdAYXdzLWNkay9hd3MtaWFtJztcbmltcG9ydCAqIGFzIGxvZ3MgZnJvbSAnQGF3cy1jZGsvYXdzLWxvZ3MnO1xuaW1wb3J0IHsgQXJuLCBBcm5Gb3JtYXQsIER1cmF0aW9uLCBJUmVzb3VyY2UsIFJlc291cmNlLCBTdGFjaywgVG9rZW4gfSBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0IHsgU3RhdGVHcmFwaCB9IGZyb20gJy4vc3RhdGUtZ3JhcGgnO1xuaW1wb3J0IHsgU3RhdGVzTWV0cmljcyB9IGZyb20gJy4vc3RlcGZ1bmN0aW9ucy1jYW5uZWQtbWV0cmljcy5nZW5lcmF0ZWQnO1xuaW1wb3J0IHsgQ2ZuU3RhdGVNYWNoaW5lIH0gZnJvbSAnLi9zdGVwZnVuY3Rpb25zLmdlbmVyYXRlZCc7XG5pbXBvcnQgeyBJQ2hhaW5hYmxlIH0gZnJvbSAnLi90eXBlcyc7XG5cbi8qKlxuICogVHdvIHR5cGVzIG9mIHN0YXRlIG1hY2hpbmVzIGFyZSBhdmFpbGFibGUgaW4gQVdTIFN0ZXAgRnVuY3Rpb25zOiBFWFBSRVNTIEFORCBTVEFOREFSRC5cbiAqXG4gKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9zdGVwLWZ1bmN0aW9ucy9sYXRlc3QvZGcvY29uY2VwdHMtc3RhbmRhcmQtdnMtZXhwcmVzcy5odG1sXG4gKlxuICogQGRlZmF1bHQgU1RBTkRBUkRcbiAqL1xuZXhwb3J0IGVudW0gU3RhdGVNYWNoaW5lVHlwZSB7XG4gIC8qKlxuICAgKiBFeHByZXNzIFdvcmtmbG93cyBhcmUgaWRlYWwgZm9yIGhpZ2gtdm9sdW1lLCBldmVudCBwcm9jZXNzaW5nIHdvcmtsb2Fkcy5cbiAgICovXG4gIEVYUFJFU1MgPSAnRVhQUkVTUycsXG5cbiAgLyoqXG4gICAqIFN0YW5kYXJkIFdvcmtmbG93cyBhcmUgaWRlYWwgZm9yIGxvbmctcnVubmluZywgZHVyYWJsZSwgYW5kIGF1ZGl0YWJsZSB3b3JrZmxvd3MuXG4gICAqL1xuICBTVEFOREFSRCA9ICdTVEFOREFSRCdcbn1cblxuLyoqXG4gKiBEZWZpbmVzIHdoaWNoIGNhdGVnb3J5IG9mIGV4ZWN1dGlvbiBoaXN0b3J5IGV2ZW50cyBhcmUgbG9nZ2VkLlxuICpcbiAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL3N0ZXAtZnVuY3Rpb25zL2xhdGVzdC9kZy9jbG91ZHdhdGNoLWxvZy1sZXZlbC5odG1sXG4gKlxuICogQGRlZmF1bHQgRVJST1JcbiAqL1xuZXhwb3J0IGVudW0gTG9nTGV2ZWwge1xuICAvKipcbiAgICogTm8gTG9nZ2luZ1xuICAgKi9cbiAgT0ZGID0gJ09GRicsXG4gIC8qKlxuICAgKiBMb2cgZXZlcnl0aGluZ1xuICAgKi9cbiAgQUxMID0gJ0FMTCcsXG4gIC8qKlxuICAgKiBMb2cgYWxsIGVycm9yc1xuICAgKi9cbiAgRVJST1IgPSAnRVJST1InLFxuICAvKipcbiAgICogTG9nIGZhdGFsIGVycm9yc1xuICAgKi9cbiAgRkFUQUwgPSAnRkFUQUwnXG59XG5cbi8qKlxuICogRGVmaW5lcyB3aGF0IGV4ZWN1dGlvbiBoaXN0b3J5IGV2ZW50cyBhcmUgbG9nZ2VkIGFuZCB3aGVyZSB0aGV5IGFyZSBsb2dnZWQuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgTG9nT3B0aW9ucyB7XG4gIC8qKlxuICAgKiBUaGUgbG9nIGdyb3VwIHdoZXJlIHRoZSBleGVjdXRpb24gaGlzdG9yeSBldmVudHMgd2lsbCBiZSBsb2dnZWQuXG4gICAqL1xuICByZWFkb25seSBkZXN0aW5hdGlvbjogbG9ncy5JTG9nR3JvdXA7XG5cbiAgLyoqXG4gICAqIERldGVybWluZXMgd2hldGhlciBleGVjdXRpb24gZGF0YSBpcyBpbmNsdWRlZCBpbiB5b3VyIGxvZy5cbiAgICpcbiAgICogQGRlZmF1bHQgZmFsc2VcbiAgICovXG4gIHJlYWRvbmx5IGluY2x1ZGVFeGVjdXRpb25EYXRhPzogYm9vbGVhbjtcblxuICAvKipcbiAgICogRGVmaW5lcyB3aGljaCBjYXRlZ29yeSBvZiBleGVjdXRpb24gaGlzdG9yeSBldmVudHMgYXJlIGxvZ2dlZC5cbiAgICpcbiAgICogQGRlZmF1bHQgRVJST1JcbiAgICovXG4gIHJlYWRvbmx5IGxldmVsPzogTG9nTGV2ZWw7XG59XG5cbi8qKlxuICogUHJvcGVydGllcyBmb3IgZGVmaW5pbmcgYSBTdGF0ZSBNYWNoaW5lXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgU3RhdGVNYWNoaW5lUHJvcHMge1xuICAvKipcbiAgICogQSBuYW1lIGZvciB0aGUgc3RhdGUgbWFjaGluZVxuICAgKlxuICAgKiBAZGVmYXVsdCBBIG5hbWUgaXMgYXV0b21hdGljYWxseSBnZW5lcmF0ZWRcbiAgICovXG4gIHJlYWRvbmx5IHN0YXRlTWFjaGluZU5hbWU/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIERlZmluaXRpb24gZm9yIHRoaXMgc3RhdGUgbWFjaGluZVxuICAgKi9cbiAgcmVhZG9ubHkgZGVmaW5pdGlvbjogSUNoYWluYWJsZTtcblxuICAvKipcbiAgICogVGhlIGV4ZWN1dGlvbiByb2xlIGZvciB0aGUgc3RhdGUgbWFjaGluZSBzZXJ2aWNlXG4gICAqXG4gICAqIEBkZWZhdWx0IEEgcm9sZSBpcyBhdXRvbWF0aWNhbGx5IGNyZWF0ZWRcbiAgICovXG4gIHJlYWRvbmx5IHJvbGU/OiBpYW0uSVJvbGU7XG5cbiAgLyoqXG4gICAqIE1heGltdW0gcnVuIHRpbWUgZm9yIHRoaXMgc3RhdGUgbWFjaGluZVxuICAgKlxuICAgKiBAZGVmYXVsdCBObyB0aW1lb3V0XG4gICAqL1xuICByZWFkb25seSB0aW1lb3V0PzogRHVyYXRpb247XG5cbiAgLyoqXG4gICAqIFR5cGUgb2YgdGhlIHN0YXRlIG1hY2hpbmVcbiAgICpcbiAgICogQGRlZmF1bHQgU3RhdGVNYWNoaW5lVHlwZS5TVEFOREFSRFxuICAgKi9cbiAgcmVhZG9ubHkgc3RhdGVNYWNoaW5lVHlwZT86IFN0YXRlTWFjaGluZVR5cGU7XG5cbiAgLyoqXG4gICAqIERlZmluZXMgd2hhdCBleGVjdXRpb24gaGlzdG9yeSBldmVudHMgYXJlIGxvZ2dlZCBhbmQgd2hlcmUgdGhleSBhcmUgbG9nZ2VkLlxuICAgKlxuICAgKiBAZGVmYXVsdCBObyBsb2dnaW5nXG4gICAqL1xuICByZWFkb25seSBsb2dzPzogTG9nT3B0aW9ucztcblxuICAvKipcbiAgICogU3BlY2lmaWVzIHdoZXRoZXIgQW1hem9uIFgtUmF5IHRyYWNpbmcgaXMgZW5hYmxlZCBmb3IgdGhpcyBzdGF0ZSBtYWNoaW5lLlxuICAgKlxuICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgKi9cbiAgcmVhZG9ubHkgdHJhY2luZ0VuYWJsZWQ/OiBib29sZWFuO1xufVxuXG4vKipcbiAqIEEgbmV3IG9yIGltcG9ydGVkIHN0YXRlIG1hY2hpbmUuXG4gKi9cbmFic3RyYWN0IGNsYXNzIFN0YXRlTWFjaGluZUJhc2UgZXh0ZW5kcyBSZXNvdXJjZSBpbXBsZW1lbnRzIElTdGF0ZU1hY2hpbmUge1xuXG4gIC8qKlxuICAgKiBJbXBvcnQgYSBzdGF0ZSBtYWNoaW5lXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGZyb21TdGF0ZU1hY2hpbmVBcm4oc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgc3RhdGVNYWNoaW5lQXJuOiBzdHJpbmcpOiBJU3RhdGVNYWNoaW5lIHtcbiAgICBjbGFzcyBJbXBvcnQgZXh0ZW5kcyBTdGF0ZU1hY2hpbmVCYXNlIHtcbiAgICAgIHB1YmxpYyByZWFkb25seSBzdGF0ZU1hY2hpbmVBcm4gPSBzdGF0ZU1hY2hpbmVBcm47XG4gICAgICBwdWJsaWMgcmVhZG9ubHkgZ3JhbnRQcmluY2lwYWwgPSBuZXcgaWFtLlVua25vd25QcmluY2lwYWwoeyByZXNvdXJjZTogdGhpcyB9KTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBJbXBvcnQoc2NvcGUsIGlkLCB7XG4gICAgICBlbnZpcm9ubWVudEZyb21Bcm46IHN0YXRlTWFjaGluZUFybixcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbXBvcnQgYSBzdGF0ZSBtYWNoaW5lIHZpYSByZXNvdXJjZSBuYW1lXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGZyb21TdGF0ZU1hY2hpbmVOYW1lKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHN0YXRlTWFjaGluZU5hbWU6IHN0cmluZyk6IElTdGF0ZU1hY2hpbmUge1xuICAgIGNvbnN0IHN0YXRlTWFjaGluZUFybiA9IFN0YWNrLm9mKHNjb3BlKS5mb3JtYXRBcm4oe1xuICAgICAgc2VydmljZTogJ3N0YXRlcycsXG4gICAgICByZXNvdXJjZTogJ3N0YXRlTWFjaGluZScsXG4gICAgICBhcm5Gb3JtYXQ6IEFybkZvcm1hdC5DT0xPTl9SRVNPVVJDRV9OQU1FLFxuICAgICAgcmVzb3VyY2VOYW1lOiBzdGF0ZU1hY2hpbmVOYW1lLFxuICAgIH0pO1xuICAgIHJldHVybiB0aGlzLmZyb21TdGF0ZU1hY2hpbmVBcm4oc2NvcGUsIGlkLCBzdGF0ZU1hY2hpbmVBcm4pO1xuICB9XG5cbiAgcHVibGljIGFic3RyYWN0IHJlYWRvbmx5IHN0YXRlTWFjaGluZUFybjogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgcHJpbmNpcGFsIHRoaXMgc3RhdGUgbWFjaGluZSBpcyBydW5uaW5nIGFzXG4gICAqL1xuICBwdWJsaWMgYWJzdHJhY3QgcmVhZG9ubHkgZ3JhbnRQcmluY2lwYWw6IGlhbS5JUHJpbmNpcGFsO1xuXG4gIC8qKlxuICAgKiBHcmFudCB0aGUgZ2l2ZW4gaWRlbnRpdHkgcGVybWlzc2lvbnMgdG8gc3RhcnQgYW4gZXhlY3V0aW9uIG9mIHRoaXMgc3RhdGVcbiAgICogbWFjaGluZS5cbiAgICovXG4gIHB1YmxpYyBncmFudFN0YXJ0RXhlY3V0aW9uKGlkZW50aXR5OiBpYW0uSUdyYW50YWJsZSk6IGlhbS5HcmFudCB7XG4gICAgcmV0dXJuIGlhbS5HcmFudC5hZGRUb1ByaW5jaXBhbCh7XG4gICAgICBncmFudGVlOiBpZGVudGl0eSxcbiAgICAgIGFjdGlvbnM6IFsnc3RhdGVzOlN0YXJ0RXhlY3V0aW9uJ10sXG4gICAgICByZXNvdXJjZUFybnM6IFt0aGlzLnN0YXRlTWFjaGluZUFybl0sXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogR3JhbnQgdGhlIGdpdmVuIGlkZW50aXR5IHBlcm1pc3Npb25zIHRvIHN0YXJ0IGEgc3luY2hyb25vdXMgZXhlY3V0aW9uIG9mXG4gICAqIHRoaXMgc3RhdGUgbWFjaGluZS5cbiAgICovXG4gIHB1YmxpYyBncmFudFN0YXJ0U3luY0V4ZWN1dGlvbihpZGVudGl0eTogaWFtLklHcmFudGFibGUpOiBpYW0uR3JhbnQge1xuICAgIHJldHVybiBpYW0uR3JhbnQuYWRkVG9QcmluY2lwYWwoe1xuICAgICAgZ3JhbnRlZTogaWRlbnRpdHksXG4gICAgICBhY3Rpb25zOiBbJ3N0YXRlczpTdGFydFN5bmNFeGVjdXRpb24nXSxcbiAgICAgIHJlc291cmNlQXJuczogW3RoaXMuc3RhdGVNYWNoaW5lQXJuXSxcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHcmFudCB0aGUgZ2l2ZW4gaWRlbnRpdHkgcGVybWlzc2lvbnMgdG8gcmVhZCByZXN1bHRzIGZyb20gc3RhdGVcbiAgICogbWFjaGluZS5cbiAgICovXG4gIHB1YmxpYyBncmFudFJlYWQoaWRlbnRpdHk6IGlhbS5JR3JhbnRhYmxlKTogaWFtLkdyYW50IHtcbiAgICBpYW0uR3JhbnQuYWRkVG9QcmluY2lwYWwoe1xuICAgICAgZ3JhbnRlZTogaWRlbnRpdHksXG4gICAgICBhY3Rpb25zOiBbXG4gICAgICAgICdzdGF0ZXM6TGlzdEV4ZWN1dGlvbnMnLFxuICAgICAgICAnc3RhdGVzOkxpc3RTdGF0ZU1hY2hpbmVzJyxcbiAgICAgIF0sXG4gICAgICByZXNvdXJjZUFybnM6IFt0aGlzLnN0YXRlTWFjaGluZUFybl0sXG4gICAgfSk7XG4gICAgaWFtLkdyYW50LmFkZFRvUHJpbmNpcGFsKHtcbiAgICAgIGdyYW50ZWU6IGlkZW50aXR5LFxuICAgICAgYWN0aW9uczogW1xuICAgICAgICAnc3RhdGVzOkRlc2NyaWJlRXhlY3V0aW9uJyxcbiAgICAgICAgJ3N0YXRlczpEZXNjcmliZVN0YXRlTWFjaGluZUZvckV4ZWN1dGlvbicsXG4gICAgICAgICdzdGF0ZXM6R2V0RXhlY3V0aW9uSGlzdG9yeScsXG4gICAgICBdLFxuICAgICAgcmVzb3VyY2VBcm5zOiBbYCR7dGhpcy5leGVjdXRpb25Bcm4oKX06KmBdLFxuICAgIH0pO1xuICAgIHJldHVybiBpYW0uR3JhbnQuYWRkVG9QcmluY2lwYWwoe1xuICAgICAgZ3JhbnRlZTogaWRlbnRpdHksXG4gICAgICBhY3Rpb25zOiBbXG4gICAgICAgICdzdGF0ZXM6TGlzdEFjdGl2aXRpZXMnLFxuICAgICAgICAnc3RhdGVzOkRlc2NyaWJlU3RhdGVNYWNoaW5lJyxcbiAgICAgICAgJ3N0YXRlczpEZXNjcmliZUFjdGl2aXR5JyxcbiAgICAgIF0sXG4gICAgICByZXNvdXJjZUFybnM6IFsnKiddLFxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEdyYW50IHRoZSBnaXZlbiBpZGVudGl0eSB0YXNrIHJlc3BvbnNlIHBlcm1pc3Npb25zIG9uIGEgc3RhdGUgbWFjaGluZVxuICAgKi9cbiAgcHVibGljIGdyYW50VGFza1Jlc3BvbnNlKGlkZW50aXR5OiBpYW0uSUdyYW50YWJsZSk6IGlhbS5HcmFudCB7XG4gICAgcmV0dXJuIGlhbS5HcmFudC5hZGRUb1ByaW5jaXBhbCh7XG4gICAgICBncmFudGVlOiBpZGVudGl0eSxcbiAgICAgIGFjdGlvbnM6IFtcbiAgICAgICAgJ3N0YXRlczpTZW5kVGFza1N1Y2Nlc3MnLFxuICAgICAgICAnc3RhdGVzOlNlbmRUYXNrRmFpbHVyZScsXG4gICAgICAgICdzdGF0ZXM6U2VuZFRhc2tIZWFydGJlYXQnLFxuICAgICAgXSxcbiAgICAgIHJlc291cmNlQXJuczogW3RoaXMuc3RhdGVNYWNoaW5lQXJuXSxcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHcmFudCB0aGUgZ2l2ZW4gaWRlbnRpdHkgcGVybWlzc2lvbnMgb24gYWxsIGV4ZWN1dGlvbnMgb2YgdGhlIHN0YXRlIG1hY2hpbmVcbiAgICovXG4gIHB1YmxpYyBncmFudEV4ZWN1dGlvbihpZGVudGl0eTogaWFtLklHcmFudGFibGUsIC4uLmFjdGlvbnM6IHN0cmluZ1tdKSB7XG4gICAgcmV0dXJuIGlhbS5HcmFudC5hZGRUb1ByaW5jaXBhbCh7XG4gICAgICBncmFudGVlOiBpZGVudGl0eSxcbiAgICAgIGFjdGlvbnMsXG4gICAgICByZXNvdXJjZUFybnM6IFtgJHt0aGlzLmV4ZWN1dGlvbkFybigpfToqYF0sXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogR3JhbnQgdGhlIGdpdmVuIGlkZW50aXR5IGN1c3RvbSBwZXJtaXNzaW9uc1xuICAgKi9cbiAgcHVibGljIGdyYW50KGlkZW50aXR5OiBpYW0uSUdyYW50YWJsZSwgLi4uYWN0aW9uczogc3RyaW5nW10pOiBpYW0uR3JhbnQge1xuICAgIHJldHVybiBpYW0uR3JhbnQuYWRkVG9QcmluY2lwYWwoe1xuICAgICAgZ3JhbnRlZTogaWRlbnRpdHksXG4gICAgICBhY3Rpb25zLFxuICAgICAgcmVzb3VyY2VBcm5zOiBbdGhpcy5zdGF0ZU1hY2hpbmVBcm5dLFxuICAgIH0pO1xuICB9XG5cblxuICAvKipcbiAgICogUmV0dXJuIHRoZSBnaXZlbiBuYW1lZCBtZXRyaWMgZm9yIHRoaXMgU3RhdGUgTWFjaGluZSdzIGV4ZWN1dGlvbnNcbiAgICpcbiAgICogQGRlZmF1bHQgLSBzdW0gb3ZlciA1IG1pbnV0ZXNcbiAgICovXG4gIHB1YmxpYyBtZXRyaWMobWV0cmljTmFtZTogc3RyaW5nLCBwcm9wcz86IGNsb3Vkd2F0Y2guTWV0cmljT3B0aW9ucyk6IGNsb3Vkd2F0Y2guTWV0cmljIHtcbiAgICByZXR1cm4gbmV3IGNsb3Vkd2F0Y2guTWV0cmljKHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9TdGF0ZXMnLFxuICAgICAgbWV0cmljTmFtZSxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IHsgU3RhdGVNYWNoaW5lQXJuOiB0aGlzLnN0YXRlTWFjaGluZUFybiB9LFxuICAgICAgc3RhdGlzdGljOiAnc3VtJyxcbiAgICAgIC4uLnByb3BzLFxuICAgIH0pLmF0dGFjaFRvKHRoaXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIE1ldHJpYyBmb3IgdGhlIG51bWJlciBvZiBleGVjdXRpb25zIHRoYXQgZmFpbGVkXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gc3VtIG92ZXIgNSBtaW51dGVzXG4gICAqL1xuICBwdWJsaWMgbWV0cmljRmFpbGVkKHByb3BzPzogY2xvdWR3YXRjaC5NZXRyaWNPcHRpb25zKTogY2xvdWR3YXRjaC5NZXRyaWMge1xuICAgIHJldHVybiB0aGlzLmNhbm5lZE1ldHJpYyhTdGF0ZXNNZXRyaWNzLmV4ZWN1dGlvbnNGYWlsZWRTdW0sIHByb3BzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBNZXRyaWMgZm9yIHRoZSBudW1iZXIgb2YgZXhlY3V0aW9ucyB0aGF0IHdlcmUgdGhyb3R0bGVkXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gc3VtIG92ZXIgNSBtaW51dGVzXG4gICAqL1xuICBwdWJsaWMgbWV0cmljVGhyb3R0bGVkKHByb3BzPzogY2xvdWR3YXRjaC5NZXRyaWNPcHRpb25zKTogY2xvdWR3YXRjaC5NZXRyaWMge1xuICAgIC8vIFRoZXJlJ3MgYSB0eXBvIGluIHRoZSBcImNhbm5lZFwiIHZlcnNpb24gb2YgdGhpc1xuICAgIHJldHVybiB0aGlzLm1ldHJpYygnRXhlY3V0aW9uVGhyb3R0bGVkJywgcHJvcHMpO1xuICB9XG5cbiAgLyoqXG4gICAqIE1ldHJpYyBmb3IgdGhlIG51bWJlciBvZiBleGVjdXRpb25zIHRoYXQgd2VyZSBhYm9ydGVkXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gc3VtIG92ZXIgNSBtaW51dGVzXG4gICAqL1xuICBwdWJsaWMgbWV0cmljQWJvcnRlZChwcm9wcz86IGNsb3Vkd2F0Y2guTWV0cmljT3B0aW9ucyk6IGNsb3Vkd2F0Y2guTWV0cmljIHtcbiAgICByZXR1cm4gdGhpcy5jYW5uZWRNZXRyaWMoU3RhdGVzTWV0cmljcy5leGVjdXRpb25zQWJvcnRlZFN1bSwgcHJvcHMpO1xuICB9XG5cbiAgLyoqXG4gICAqIE1ldHJpYyBmb3IgdGhlIG51bWJlciBvZiBleGVjdXRpb25zIHRoYXQgc3VjY2VlZGVkXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gc3VtIG92ZXIgNSBtaW51dGVzXG4gICAqL1xuICBwdWJsaWMgbWV0cmljU3VjY2VlZGVkKHByb3BzPzogY2xvdWR3YXRjaC5NZXRyaWNPcHRpb25zKTogY2xvdWR3YXRjaC5NZXRyaWMge1xuICAgIHJldHVybiB0aGlzLmNhbm5lZE1ldHJpYyhTdGF0ZXNNZXRyaWNzLmV4ZWN1dGlvbnNTdWNjZWVkZWRTdW0sIHByb3BzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBNZXRyaWMgZm9yIHRoZSBudW1iZXIgb2YgZXhlY3V0aW9ucyB0aGF0IHRpbWVkIG91dFxuICAgKlxuICAgKiBAZGVmYXVsdCAtIHN1bSBvdmVyIDUgbWludXRlc1xuICAgKi9cbiAgcHVibGljIG1ldHJpY1RpbWVkT3V0KHByb3BzPzogY2xvdWR3YXRjaC5NZXRyaWNPcHRpb25zKTogY2xvdWR3YXRjaC5NZXRyaWMge1xuICAgIHJldHVybiB0aGlzLmNhbm5lZE1ldHJpYyhTdGF0ZXNNZXRyaWNzLmV4ZWN1dGlvbnNUaW1lZE91dFN1bSwgcHJvcHMpO1xuICB9XG5cbiAgLyoqXG4gICAqIE1ldHJpYyBmb3IgdGhlIG51bWJlciBvZiBleGVjdXRpb25zIHRoYXQgd2VyZSBzdGFydGVkXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gc3VtIG92ZXIgNSBtaW51dGVzXG4gICAqL1xuICBwdWJsaWMgbWV0cmljU3RhcnRlZChwcm9wcz86IGNsb3Vkd2F0Y2guTWV0cmljT3B0aW9ucyk6IGNsb3Vkd2F0Y2guTWV0cmljIHtcbiAgICByZXR1cm4gdGhpcy5tZXRyaWMoJ0V4ZWN1dGlvbnNTdGFydGVkJywgcHJvcHMpO1xuICB9XG5cbiAgLyoqXG4gICAqIE1ldHJpYyBmb3IgdGhlIGludGVydmFsLCBpbiBtaWxsaXNlY29uZHMsIGJldHdlZW4gdGhlIHRpbWUgdGhlIGV4ZWN1dGlvbiBzdGFydHMgYW5kIHRoZSB0aW1lIGl0IGNsb3Nlc1xuICAgKlxuICAgKiBAZGVmYXVsdCAtIGF2ZXJhZ2Ugb3ZlciA1IG1pbnV0ZXNcbiAgICovXG4gIHB1YmxpYyBtZXRyaWNUaW1lKHByb3BzPzogY2xvdWR3YXRjaC5NZXRyaWNPcHRpb25zKTogY2xvdWR3YXRjaC5NZXRyaWMge1xuICAgIHJldHVybiB0aGlzLmNhbm5lZE1ldHJpYyhTdGF0ZXNNZXRyaWNzLmV4ZWN1dGlvblRpbWVBdmVyYWdlLCBwcm9wcyk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgcGF0dGVybiBmb3IgdGhlIGV4ZWN1dGlvbiBBUk4ncyBvZiB0aGUgc3RhdGUgbWFjaGluZVxuICAgKi9cbiAgcHJpdmF0ZSBleGVjdXRpb25Bcm4oKTogc3RyaW5nIHtcbiAgICByZXR1cm4gU3RhY2sub2YodGhpcykuZm9ybWF0QXJuKHtcbiAgICAgIHJlc291cmNlOiAnZXhlY3V0aW9uJyxcbiAgICAgIHNlcnZpY2U6ICdzdGF0ZXMnLFxuICAgICAgcmVzb3VyY2VOYW1lOiBBcm4uc3BsaXQodGhpcy5zdGF0ZU1hY2hpbmVBcm4sIEFybkZvcm1hdC5DT0xPTl9SRVNPVVJDRV9OQU1FKS5yZXNvdXJjZU5hbWUsXG4gICAgICBhcm5Gb3JtYXQ6IEFybkZvcm1hdC5DT0xPTl9SRVNPVVJDRV9OQU1FLFxuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBjYW5uZWRNZXRyaWMoXG4gICAgZm46IChkaW1zOiB7IFN0YXRlTWFjaGluZUFybjogc3RyaW5nIH0pID0+IGNsb3Vkd2F0Y2guTWV0cmljUHJvcHMsXG4gICAgcHJvcHM/OiBjbG91ZHdhdGNoLk1ldHJpY09wdGlvbnMpOiBjbG91ZHdhdGNoLk1ldHJpYyB7XG4gICAgcmV0dXJuIG5ldyBjbG91ZHdhdGNoLk1ldHJpYyh7XG4gICAgICAuLi5mbih7IFN0YXRlTWFjaGluZUFybjogdGhpcy5zdGF0ZU1hY2hpbmVBcm4gfSksXG4gICAgICAuLi5wcm9wcyxcbiAgICB9KS5hdHRhY2hUbyh0aGlzKTtcbiAgfVxufVxuXG4vKipcbiAqIERlZmluZSBhIFN0ZXBGdW5jdGlvbnMgU3RhdGUgTWFjaGluZVxuICovXG5leHBvcnQgY2xhc3MgU3RhdGVNYWNoaW5lIGV4dGVuZHMgU3RhdGVNYWNoaW5lQmFzZSB7XG4gIC8qKlxuICAgKiBFeGVjdXRpb24gcm9sZSBvZiB0aGlzIHN0YXRlIG1hY2hpbmVcbiAgICovXG4gIHB1YmxpYyByZWFkb25seSByb2xlOiBpYW0uSVJvbGU7XG5cbiAgLyoqXG4gICAqIFRoZSBuYW1lIG9mIHRoZSBzdGF0ZSBtYWNoaW5lXG4gICAqIEBhdHRyaWJ1dGVcbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBzdGF0ZU1hY2hpbmVOYW1lOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBBUk4gb2YgdGhlIHN0YXRlIG1hY2hpbmVcbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBzdGF0ZU1hY2hpbmVBcm46IHN0cmluZztcblxuICAvKipcbiAgICogVHlwZSBvZiB0aGUgc3RhdGUgbWFjaGluZVxuICAgKiBAYXR0cmlidXRlXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgc3RhdGVNYWNoaW5lVHlwZTogU3RhdGVNYWNoaW5lVHlwZTtcblxuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogU3RhdGVNYWNoaW5lUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHtcbiAgICAgIHBoeXNpY2FsTmFtZTogcHJvcHMuc3RhdGVNYWNoaW5lTmFtZSxcbiAgICB9KTtcblxuICAgIGlmIChwcm9wcy5zdGF0ZU1hY2hpbmVOYW1lICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHRoaXMudmFsaWRhdGVTdGF0ZU1hY2hpbmVOYW1lKHByb3BzLnN0YXRlTWFjaGluZU5hbWUpO1xuICAgIH1cblxuICAgIHRoaXMucm9sZSA9IHByb3BzLnJvbGUgfHwgbmV3IGlhbS5Sb2xlKHRoaXMsICdSb2xlJywge1xuICAgICAgYXNzdW1lZEJ5OiBuZXcgaWFtLlNlcnZpY2VQcmluY2lwYWwoJ3N0YXRlcy5hbWF6b25hd3MuY29tJyksXG4gICAgfSk7XG5cbiAgICBjb25zdCBncmFwaCA9IG5ldyBTdGF0ZUdyYXBoKHByb3BzLmRlZmluaXRpb24uc3RhcnRTdGF0ZSwgYFN0YXRlIE1hY2hpbmUgJHtpZH0gZGVmaW5pdGlvbmApO1xuICAgIGdyYXBoLnRpbWVvdXQgPSBwcm9wcy50aW1lb3V0O1xuXG4gICAgdGhpcy5zdGF0ZU1hY2hpbmVUeXBlID0gcHJvcHMuc3RhdGVNYWNoaW5lVHlwZSA/PyBTdGF0ZU1hY2hpbmVUeXBlLlNUQU5EQVJEO1xuXG4gICAgY29uc3QgcmVzb3VyY2UgPSBuZXcgQ2ZuU3RhdGVNYWNoaW5lKHRoaXMsICdSZXNvdXJjZScsIHtcbiAgICAgIHN0YXRlTWFjaGluZU5hbWU6IHRoaXMucGh5c2ljYWxOYW1lLFxuICAgICAgc3RhdGVNYWNoaW5lVHlwZTogcHJvcHMuc3RhdGVNYWNoaW5lVHlwZSA/PyB1bmRlZmluZWQsXG4gICAgICByb2xlQXJuOiB0aGlzLnJvbGUucm9sZUFybixcbiAgICAgIGRlZmluaXRpb25TdHJpbmc6IFN0YWNrLm9mKHRoaXMpLnRvSnNvblN0cmluZyhncmFwaC50b0dyYXBoSnNvbigpKSxcbiAgICAgIGxvZ2dpbmdDb25maWd1cmF0aW9uOiBwcm9wcy5sb2dzID8gdGhpcy5idWlsZExvZ2dpbmdDb25maWd1cmF0aW9uKHByb3BzLmxvZ3MpIDogdW5kZWZpbmVkLFxuICAgICAgdHJhY2luZ0NvbmZpZ3VyYXRpb246IHByb3BzLnRyYWNpbmdFbmFibGVkID8gdGhpcy5idWlsZFRyYWNpbmdDb25maWd1cmF0aW9uKCkgOiB1bmRlZmluZWQsXG4gICAgfSk7XG5cbiAgICByZXNvdXJjZS5ub2RlLmFkZERlcGVuZGVuY3kodGhpcy5yb2xlKTtcblxuICAgIGZvciAoY29uc3Qgc3RhdGVtZW50IG9mIGdyYXBoLnBvbGljeVN0YXRlbWVudHMpIHtcbiAgICAgIHRoaXMuYWRkVG9Sb2xlUG9saWN5KHN0YXRlbWVudCk7XG4gICAgfVxuXG4gICAgdGhpcy5zdGF0ZU1hY2hpbmVOYW1lID0gdGhpcy5nZXRSZXNvdXJjZU5hbWVBdHRyaWJ1dGUocmVzb3VyY2UuYXR0ck5hbWUpO1xuICAgIHRoaXMuc3RhdGVNYWNoaW5lQXJuID0gdGhpcy5nZXRSZXNvdXJjZUFybkF0dHJpYnV0ZShyZXNvdXJjZS5yZWYsIHtcbiAgICAgIHNlcnZpY2U6ICdzdGF0ZXMnLFxuICAgICAgcmVzb3VyY2U6ICdzdGF0ZU1hY2hpbmUnLFxuICAgICAgcmVzb3VyY2VOYW1lOiB0aGlzLnBoeXNpY2FsTmFtZSxcbiAgICAgIGFybkZvcm1hdDogQXJuRm9ybWF0LkNPTE9OX1JFU09VUkNFX05BTUUsXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogVGhlIHByaW5jaXBhbCB0aGlzIHN0YXRlIG1hY2hpbmUgaXMgcnVubmluZyBhc1xuICAgKi9cbiAgcHVibGljIGdldCBncmFudFByaW5jaXBhbCgpIHtcbiAgICByZXR1cm4gdGhpcy5yb2xlLmdyYW50UHJpbmNpcGFsO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZCB0aGUgZ2l2ZW4gc3RhdGVtZW50IHRvIHRoZSByb2xlJ3MgcG9saWN5XG4gICAqL1xuICBwdWJsaWMgYWRkVG9Sb2xlUG9saWN5KHN0YXRlbWVudDogaWFtLlBvbGljeVN0YXRlbWVudCkge1xuICAgIHRoaXMucm9sZS5hZGRUb1ByaW5jaXBhbFBvbGljeShzdGF0ZW1lbnQpO1xuICB9XG5cbiAgcHJpdmF0ZSB2YWxpZGF0ZVN0YXRlTWFjaGluZU5hbWUoc3RhdGVNYWNoaW5lTmFtZTogc3RyaW5nKSB7XG4gICAgaWYgKCFUb2tlbi5pc1VucmVzb2x2ZWQoc3RhdGVNYWNoaW5lTmFtZSkpIHtcbiAgICAgIGlmIChzdGF0ZU1hY2hpbmVOYW1lLmxlbmd0aCA8IDEgfHwgc3RhdGVNYWNoaW5lTmFtZS5sZW5ndGggPiA4MCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFN0YXRlIE1hY2hpbmUgbmFtZSBtdXN0IGJlIGJldHdlZW4gMSBhbmQgODAgY2hhcmFjdGVycy4gUmVjZWl2ZWQ6ICR7c3RhdGVNYWNoaW5lTmFtZX1gKTtcbiAgICAgIH1cblxuICAgICAgaWYgKCFzdGF0ZU1hY2hpbmVOYW1lLm1hdGNoKC9eW2EtejAtOVxcK1xcIVxcQFxcLlxcKFxcKVxcLVxcPVxcX1xcJ10rJC9pKSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFN0YXRlIE1hY2hpbmUgbmFtZSBtdXN0IG1hdGNoIFwiXlthLXowLTkrIUAuKCktPV8nXSskL2lcIi4gUmVjZWl2ZWQ6ICR7c3RhdGVNYWNoaW5lTmFtZX1gKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGJ1aWxkTG9nZ2luZ0NvbmZpZ3VyYXRpb24obG9nT3B0aW9uczogTG9nT3B0aW9ucyk6IENmblN0YXRlTWFjaGluZS5Mb2dnaW5nQ29uZmlndXJhdGlvblByb3BlcnR5IHtcbiAgICAvLyBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vc3RlcC1mdW5jdGlvbnMvbGF0ZXN0L2RnL2N3LWxvZ3MuaHRtbCNjbG91ZHdhdGNoLWlhbS1wb2xpY3lcbiAgICB0aGlzLmFkZFRvUm9sZVBvbGljeShuZXcgaWFtLlBvbGljeVN0YXRlbWVudCh7XG4gICAgICBlZmZlY3Q6IGlhbS5FZmZlY3QuQUxMT1csXG4gICAgICBhY3Rpb25zOiBbXG4gICAgICAgICdsb2dzOkNyZWF0ZUxvZ0RlbGl2ZXJ5JyxcbiAgICAgICAgJ2xvZ3M6R2V0TG9nRGVsaXZlcnknLFxuICAgICAgICAnbG9nczpVcGRhdGVMb2dEZWxpdmVyeScsXG4gICAgICAgICdsb2dzOkRlbGV0ZUxvZ0RlbGl2ZXJ5JyxcbiAgICAgICAgJ2xvZ3M6TGlzdExvZ0RlbGl2ZXJpZXMnLFxuICAgICAgICAnbG9nczpQdXRSZXNvdXJjZVBvbGljeScsXG4gICAgICAgICdsb2dzOkRlc2NyaWJlUmVzb3VyY2VQb2xpY2llcycsXG4gICAgICAgICdsb2dzOkRlc2NyaWJlTG9nR3JvdXBzJyxcbiAgICAgIF0sXG4gICAgICByZXNvdXJjZXM6IFsnKiddLFxuICAgIH0pKTtcblxuICAgIHJldHVybiB7XG4gICAgICBkZXN0aW5hdGlvbnM6IFt7XG4gICAgICAgIGNsb3VkV2F0Y2hMb2dzTG9nR3JvdXA6IHsgbG9nR3JvdXBBcm46IGxvZ09wdGlvbnMuZGVzdGluYXRpb24ubG9nR3JvdXBBcm4gfSxcbiAgICAgIH1dLFxuICAgICAgaW5jbHVkZUV4ZWN1dGlvbkRhdGE6IGxvZ09wdGlvbnMuaW5jbHVkZUV4ZWN1dGlvbkRhdGEsXG4gICAgICBsZXZlbDogbG9nT3B0aW9ucy5sZXZlbCB8fCAnRVJST1InLFxuICAgIH07XG4gIH1cblxuICBwcml2YXRlIGJ1aWxkVHJhY2luZ0NvbmZpZ3VyYXRpb24oKTogQ2ZuU3RhdGVNYWNoaW5lLlRyYWNpbmdDb25maWd1cmF0aW9uUHJvcGVydHkge1xuICAgIHRoaXMuYWRkVG9Sb2xlUG9saWN5KG5ldyBpYW0uUG9saWN5U3RhdGVtZW50KHtcbiAgICAgIC8vIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS94cmF5L2xhdGVzdC9kZXZndWlkZS9zZWN1cml0eV9pYW1faWQtYmFzZWQtcG9saWN5LWV4YW1wbGVzLmh0bWwjeHJheS1wZXJtaXNzaW9ucy1yZXNvdXJjZXNcbiAgICAgIC8vIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9zdGVwLWZ1bmN0aW9ucy9sYXRlc3QvZGcveHJheS1pYW0uaHRtbFxuICAgICAgYWN0aW9uczogW1xuICAgICAgICAneHJheTpQdXRUcmFjZVNlZ21lbnRzJyxcbiAgICAgICAgJ3hyYXk6UHV0VGVsZW1ldHJ5UmVjb3JkcycsXG4gICAgICAgICd4cmF5OkdldFNhbXBsaW5nUnVsZXMnLFxuICAgICAgICAneHJheTpHZXRTYW1wbGluZ1RhcmdldHMnLFxuICAgICAgXSxcbiAgICAgIHJlc291cmNlczogWycqJ10sXG4gICAgfSkpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIGVuYWJsZWQ6IHRydWUsXG4gICAgfTtcbiAgfVxufVxuXG4vKipcbiAqIEEgU3RhdGUgTWFjaGluZVxuICovXG5leHBvcnQgaW50ZXJmYWNlIElTdGF0ZU1hY2hpbmUgZXh0ZW5kcyBJUmVzb3VyY2UsIGlhbS5JR3JhbnRhYmxlIHtcbiAgLyoqXG4gICAqIFRoZSBBUk4gb2YgdGhlIHN0YXRlIG1hY2hpbmVcbiAgICogQGF0dHJpYnV0ZVxuICAgKi9cbiAgcmVhZG9ubHkgc3RhdGVNYWNoaW5lQXJuOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIEdyYW50IHRoZSBnaXZlbiBpZGVudGl0eSBwZXJtaXNzaW9ucyB0byBzdGFydCBhbiBleGVjdXRpb24gb2YgdGhpcyBzdGF0ZVxuICAgKiBtYWNoaW5lLlxuICAgKlxuICAgKiBAcGFyYW0gaWRlbnRpdHkgVGhlIHByaW5jaXBhbFxuICAgKi9cbiAgZ3JhbnRTdGFydEV4ZWN1dGlvbihpZGVudGl0eTogaWFtLklHcmFudGFibGUpOiBpYW0uR3JhbnQ7XG5cbiAgLyoqXG4gICAqIEdyYW50IHRoZSBnaXZlbiBpZGVudGl0eSBwZXJtaXNzaW9ucyB0byBzdGFydCBhIHN5bmNocm9ub3VzIGV4ZWN1dGlvbiBvZlxuICAgKiB0aGlzIHN0YXRlIG1hY2hpbmUuXG4gICAqXG4gICAqIEBwYXJhbSBpZGVudGl0eSBUaGUgcHJpbmNpcGFsXG4gICAqL1xuICBncmFudFN0YXJ0U3luY0V4ZWN1dGlvbihpZGVudGl0eTogaWFtLklHcmFudGFibGUpOiBpYW0uR3JhbnQ7XG5cbiAgLyoqXG4gICAqIEdyYW50IHRoZSBnaXZlbiBpZGVudGl0eSByZWFkIHBlcm1pc3Npb25zIGZvciB0aGlzIHN0YXRlIG1hY2hpbmVcbiAgICpcbiAgICogQHBhcmFtIGlkZW50aXR5IFRoZSBwcmluY2lwYWxcbiAgICovXG4gIGdyYW50UmVhZChpZGVudGl0eTogaWFtLklHcmFudGFibGUpOiBpYW0uR3JhbnQ7XG5cbiAgLyoqXG4gICAqIEdyYW50IHRoZSBnaXZlbiBpZGVudGl0eSByZWFkIHBlcm1pc3Npb25zIGZvciB0aGlzIHN0YXRlIG1hY2hpbmVcbiAgICpcbiAgICogQHBhcmFtIGlkZW50aXR5IFRoZSBwcmluY2lwYWxcbiAgICovXG4gIGdyYW50VGFza1Jlc3BvbnNlKGlkZW50aXR5OiBpYW0uSUdyYW50YWJsZSk6IGlhbS5HcmFudDtcblxuICAvKipcbiAgICogR3JhbnQgdGhlIGdpdmVuIGlkZW50aXR5IHBlcm1pc3Npb25zIGZvciBhbGwgZXhlY3V0aW9ucyBvZiBhIHN0YXRlIG1hY2hpbmVcbiAgICpcbiAgICogQHBhcmFtIGlkZW50aXR5IFRoZSBwcmluY2lwYWxcbiAgICogQHBhcmFtIGFjdGlvbnMgVGhlIGxpc3Qgb2YgZGVzaXJlZCBhY3Rpb25zXG4gICAqL1xuICBncmFudEV4ZWN1dGlvbihpZGVudGl0eTogaWFtLklHcmFudGFibGUsIC4uLmFjdGlvbnM6IHN0cmluZ1tdKTogaWFtLkdyYW50O1xuXG4gIC8qKlxuICAgKiBHcmFudCB0aGUgZ2l2ZW4gaWRlbnRpdHkgY3VzdG9tIHBlcm1pc3Npb25zXG4gICAqXG4gICAqIEBwYXJhbSBpZGVudGl0eSBUaGUgcHJpbmNpcGFsXG4gICAqIEBwYXJhbSBhY3Rpb25zIFRoZSBsaXN0IG9mIGRlc2lyZWQgYWN0aW9uc1xuICAgKi9cbiAgZ3JhbnQoaWRlbnRpdHk6IGlhbS5JR3JhbnRhYmxlLCAuLi5hY3Rpb25zOiBzdHJpbmdbXSk6IGlhbS5HcmFudDtcblxuICAvKipcbiAgICogUmV0dXJuIHRoZSBnaXZlbiBuYW1lZCBtZXRyaWMgZm9yIHRoaXMgU3RhdGUgTWFjaGluZSdzIGV4ZWN1dGlvbnNcbiAgICpcbiAgICogQGRlZmF1bHQgLSBzdW0gb3ZlciA1IG1pbnV0ZXNcbiAgICovXG4gIG1ldHJpYyhtZXRyaWNOYW1lOiBzdHJpbmcsIHByb3BzPzogY2xvdWR3YXRjaC5NZXRyaWNPcHRpb25zKTogY2xvdWR3YXRjaC5NZXRyaWM7XG5cbiAgLyoqXG4gICAqIE1ldHJpYyBmb3IgdGhlIG51bWJlciBvZiBleGVjdXRpb25zIHRoYXQgZmFpbGVkXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gc3VtIG92ZXIgNSBtaW51dGVzXG4gICAqL1xuICBtZXRyaWNGYWlsZWQocHJvcHM/OiBjbG91ZHdhdGNoLk1ldHJpY09wdGlvbnMpOiBjbG91ZHdhdGNoLk1ldHJpYztcblxuICAvKipcbiAgICogTWV0cmljIGZvciB0aGUgbnVtYmVyIG9mIGV4ZWN1dGlvbnMgdGhhdCB3ZXJlIHRocm90dGxlZFxuICAgKlxuICAgKiBAZGVmYXVsdCBzdW0gb3ZlciA1IG1pbnV0ZXNcbiAgICovXG4gIG1ldHJpY1Rocm90dGxlZChwcm9wcz86IGNsb3Vkd2F0Y2guTWV0cmljT3B0aW9ucyk6IGNsb3Vkd2F0Y2guTWV0cmljO1xuXG4gIC8qKlxuICAgKiBNZXRyaWMgZm9yIHRoZSBudW1iZXIgb2YgZXhlY3V0aW9ucyB0aGF0IHdlcmUgYWJvcnRlZFxuICAgKlxuICAgKiBAZGVmYXVsdCAtIHN1bSBvdmVyIDUgbWludXRlc1xuICAgKi9cbiAgbWV0cmljQWJvcnRlZChwcm9wcz86IGNsb3Vkd2F0Y2guTWV0cmljT3B0aW9ucyk6IGNsb3Vkd2F0Y2guTWV0cmljO1xuXG4gIC8qKlxuICAgKiBNZXRyaWMgZm9yIHRoZSBudW1iZXIgb2YgZXhlY3V0aW9ucyB0aGF0IHN1Y2NlZWRlZFxuICAgKlxuICAgKiBAZGVmYXVsdCAtIHN1bSBvdmVyIDUgbWludXRlc1xuICAgKi9cbiAgbWV0cmljU3VjY2VlZGVkKHByb3BzPzogY2xvdWR3YXRjaC5NZXRyaWNPcHRpb25zKTogY2xvdWR3YXRjaC5NZXRyaWM7XG5cbiAgLyoqXG4gICAqIE1ldHJpYyBmb3IgdGhlIG51bWJlciBvZiBleGVjdXRpb25zIHRoYXQgdGltZWQgb3V0XG4gICAqXG4gICAqIEBkZWZhdWx0IC0gc3VtIG92ZXIgNSBtaW51dGVzXG4gICAqL1xuICBtZXRyaWNUaW1lZE91dChwcm9wcz86IGNsb3Vkd2F0Y2guTWV0cmljT3B0aW9ucyk6IGNsb3Vkd2F0Y2guTWV0cmljO1xuXG4gIC8qKlxuICAgKiBNZXRyaWMgZm9yIHRoZSBudW1iZXIgb2YgZXhlY3V0aW9ucyB0aGF0IHdlcmUgc3RhcnRlZFxuICAgKlxuICAgKiBAZGVmYXVsdCAtIHN1bSBvdmVyIDUgbWludXRlc1xuICAgKi9cbiAgbWV0cmljU3RhcnRlZChwcm9wcz86IGNsb3Vkd2F0Y2guTWV0cmljT3B0aW9ucyk6IGNsb3Vkd2F0Y2guTWV0cmljO1xuXG4gIC8qKlxuICAgKiBNZXRyaWMgZm9yIHRoZSBpbnRlcnZhbCwgaW4gbWlsbGlzZWNvbmRzLCBiZXR3ZWVuIHRoZSB0aW1lIHRoZSBleGVjdXRpb24gc3RhcnRzIGFuZCB0aGUgdGltZSBpdCBjbG9zZXNcbiAgICpcbiAgICogQGRlZmF1bHQgLSBzdW0gb3ZlciA1IG1pbnV0ZXNcbiAgICovXG4gIG1ldHJpY1RpbWUocHJvcHM/OiBjbG91ZHdhdGNoLk1ldHJpY09wdGlvbnMpOiBjbG91ZHdhdGNoLk1ldHJpYztcbn1cbiJdfQ==