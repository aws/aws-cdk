import * as cloudwatch from '@aws-cdk/aws-cloudwatch';
import * as iam from '@aws-cdk/aws-iam';
import * as logs from '@aws-cdk/aws-logs';
import { Duration, IResource, RemovalPolicy, Resource } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { IChainable } from './types';
/**
 * Two types of state machines are available in AWS Step Functions: EXPRESS AND STANDARD.
 *
 * @see https://docs.aws.amazon.com/step-functions/latest/dg/concepts-standard-vs-express.html
 *
 * @default STANDARD
 */
export declare enum StateMachineType {
    /**
     * Express Workflows are ideal for high-volume, event processing workloads.
     */
    EXPRESS = "EXPRESS",
    /**
     * Standard Workflows are ideal for long-running, durable, and auditable workflows.
     */
    STANDARD = "STANDARD"
}
/**
 * Defines which category of execution history events are logged.
 *
 * @see https://docs.aws.amazon.com/step-functions/latest/dg/cloudwatch-log-level.html
 *
 * @default ERROR
 */
export declare enum LogLevel {
    /**
     * No Logging
     */
    OFF = "OFF",
    /**
     * Log everything
     */
    ALL = "ALL",
    /**
     * Log all errors
     */
    ERROR = "ERROR",
    /**
     * Log fatal errors
     */
    FATAL = "FATAL"
}
/**
 * Defines what execution history events are logged and where they are logged.
 */
export interface LogOptions {
    /**
     * The log group where the execution history events will be logged.
     */
    readonly destination: logs.ILogGroup;
    /**
     * Determines whether execution data is included in your log.
     *
     * @default false
     */
    readonly includeExecutionData?: boolean;
    /**
     * Defines which category of execution history events are logged.
     *
     * @default ERROR
     */
    readonly level?: LogLevel;
}
/**
 * Properties for defining a State Machine
 */
export interface StateMachineProps {
    /**
     * A name for the state machine
     *
     * @default A name is automatically generated
     */
    readonly stateMachineName?: string;
    /**
     * Definition for this state machine
     */
    readonly definition: IChainable;
    /**
     * The execution role for the state machine service
     *
     * @default A role is automatically created
     */
    readonly role?: iam.IRole;
    /**
     * Maximum run time for this state machine
     *
     * @default No timeout
     */
    readonly timeout?: Duration;
    /**
     * Type of the state machine
     *
     * @default StateMachineType.STANDARD
     */
    readonly stateMachineType?: StateMachineType;
    /**
     * Defines what execution history events are logged and where they are logged.
     *
     * @default No logging
     */
    readonly logs?: LogOptions;
    /**
     * Specifies whether Amazon X-Ray tracing is enabled for this state machine.
     *
     * @default false
     */
    readonly tracingEnabled?: boolean;
    /**
     * The removal policy to apply to state machine
     *
     * @default RemovalPolicy.DESTROY
     */
    readonly removalPolicy?: RemovalPolicy;
}
/**
 * A new or imported state machine.
 */
declare abstract class StateMachineBase extends Resource implements IStateMachine {
    /**
     * Import a state machine
     */
    static fromStateMachineArn(scope: Construct, id: string, stateMachineArn: string): IStateMachine;
    /**
     * Import a state machine via resource name
     */
    static fromStateMachineName(scope: Construct, id: string, stateMachineName: string): IStateMachine;
    abstract readonly stateMachineArn: string;
    /**
     * The principal this state machine is running as
     */
    abstract readonly grantPrincipal: iam.IPrincipal;
    /**
     * Grant the given identity permissions to start an execution of this state
     * machine.
     */
    grantStartExecution(identity: iam.IGrantable): iam.Grant;
    /**
     * Grant the given identity permissions to start a synchronous execution of
     * this state machine.
     */
    grantStartSyncExecution(identity: iam.IGrantable): iam.Grant;
    /**
     * Grant the given identity permissions to read results from state
     * machine.
     */
    grantRead(identity: iam.IGrantable): iam.Grant;
    /**
     * Grant the given identity task response permissions on a state machine
     */
    grantTaskResponse(identity: iam.IGrantable): iam.Grant;
    /**
     * Grant the given identity permissions on all executions of the state machine
     */
    grantExecution(identity: iam.IGrantable, ...actions: string[]): iam.Grant;
    /**
     * Grant the given identity custom permissions
     */
    grant(identity: iam.IGrantable, ...actions: string[]): iam.Grant;
    /**
     * Return the given named metric for this State Machine's executions
     *
     * @default - sum over 5 minutes
     */
    metric(metricName: string, props?: cloudwatch.MetricOptions): cloudwatch.Metric;
    /**
     * Metric for the number of executions that failed
     *
     * @default - sum over 5 minutes
     */
    metricFailed(props?: cloudwatch.MetricOptions): cloudwatch.Metric;
    /**
     * Metric for the number of executions that were throttled
     *
     * @default - sum over 5 minutes
     */
    metricThrottled(props?: cloudwatch.MetricOptions): cloudwatch.Metric;
    /**
     * Metric for the number of executions that were aborted
     *
     * @default - sum over 5 minutes
     */
    metricAborted(props?: cloudwatch.MetricOptions): cloudwatch.Metric;
    /**
     * Metric for the number of executions that succeeded
     *
     * @default - sum over 5 minutes
     */
    metricSucceeded(props?: cloudwatch.MetricOptions): cloudwatch.Metric;
    /**
     * Metric for the number of executions that timed out
     *
     * @default - sum over 5 minutes
     */
    metricTimedOut(props?: cloudwatch.MetricOptions): cloudwatch.Metric;
    /**
     * Metric for the number of executions that were started
     *
     * @default - sum over 5 minutes
     */
    metricStarted(props?: cloudwatch.MetricOptions): cloudwatch.Metric;
    /**
     * Metric for the interval, in milliseconds, between the time the execution starts and the time it closes
     *
     * @default - average over 5 minutes
     */
    metricTime(props?: cloudwatch.MetricOptions): cloudwatch.Metric;
    /**
     * Returns the pattern for the execution ARN's of the state machine
     */
    private executionArn;
    private cannedMetric;
}
/**
 * Define a StepFunctions State Machine
 */
export declare class StateMachine extends StateMachineBase {
    /**
     * Execution role of this state machine
     */
    readonly role: iam.IRole;
    /**
     * The name of the state machine
     * @attribute
     */
    readonly stateMachineName: string;
    /**
     * The ARN of the state machine
     */
    readonly stateMachineArn: string;
    /**
     * Type of the state machine
     * @attribute
     */
    readonly stateMachineType: StateMachineType;
    constructor(scope: Construct, id: string, props: StateMachineProps);
    /**
     * The principal this state machine is running as
     */
    get grantPrincipal(): iam.IPrincipal;
    /**
     * Add the given statement to the role's policy
     */
    addToRolePolicy(statement: iam.PolicyStatement): void;
    private validateStateMachineName;
    private buildLoggingConfiguration;
    private buildTracingConfiguration;
}
/**
 * A State Machine
 */
export interface IStateMachine extends IResource, iam.IGrantable {
    /**
     * The ARN of the state machine
     * @attribute
     */
    readonly stateMachineArn: string;
    /**
     * Grant the given identity permissions to start an execution of this state
     * machine.
     *
     * @param identity The principal
     */
    grantStartExecution(identity: iam.IGrantable): iam.Grant;
    /**
     * Grant the given identity permissions to start a synchronous execution of
     * this state machine.
     *
     * @param identity The principal
     */
    grantStartSyncExecution(identity: iam.IGrantable): iam.Grant;
    /**
     * Grant the given identity read permissions for this state machine
     *
     * @param identity The principal
     */
    grantRead(identity: iam.IGrantable): iam.Grant;
    /**
     * Grant the given identity read permissions for this state machine
     *
     * @param identity The principal
     */
    grantTaskResponse(identity: iam.IGrantable): iam.Grant;
    /**
     * Grant the given identity permissions for all executions of a state machine
     *
     * @param identity The principal
     * @param actions The list of desired actions
     */
    grantExecution(identity: iam.IGrantable, ...actions: string[]): iam.Grant;
    /**
     * Grant the given identity custom permissions
     *
     * @param identity The principal
     * @param actions The list of desired actions
     */
    grant(identity: iam.IGrantable, ...actions: string[]): iam.Grant;
    /**
     * Return the given named metric for this State Machine's executions
     *
     * @default - sum over 5 minutes
     */
    metric(metricName: string, props?: cloudwatch.MetricOptions): cloudwatch.Metric;
    /**
     * Metric for the number of executions that failed
     *
     * @default - sum over 5 minutes
     */
    metricFailed(props?: cloudwatch.MetricOptions): cloudwatch.Metric;
    /**
     * Metric for the number of executions that were throttled
     *
     * @default sum over 5 minutes
     */
    metricThrottled(props?: cloudwatch.MetricOptions): cloudwatch.Metric;
    /**
     * Metric for the number of executions that were aborted
     *
     * @default - sum over 5 minutes
     */
    metricAborted(props?: cloudwatch.MetricOptions): cloudwatch.Metric;
    /**
     * Metric for the number of executions that succeeded
     *
     * @default - sum over 5 minutes
     */
    metricSucceeded(props?: cloudwatch.MetricOptions): cloudwatch.Metric;
    /**
     * Metric for the number of executions that timed out
     *
     * @default - sum over 5 minutes
     */
    metricTimedOut(props?: cloudwatch.MetricOptions): cloudwatch.Metric;
    /**
     * Metric for the number of executions that were started
     *
     * @default - sum over 5 minutes
     */
    metricStarted(props?: cloudwatch.MetricOptions): cloudwatch.Metric;
    /**
     * Metric for the interval, in milliseconds, between the time the execution starts and the time it closes
     *
     * @default - sum over 5 minutes
     */
    metricTime(props?: cloudwatch.MetricOptions): cloudwatch.Metric;
}
export {};
