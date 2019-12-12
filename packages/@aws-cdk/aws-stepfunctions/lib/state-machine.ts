import * as cloudwatch from '@aws-cdk/aws-cloudwatch';
import * as iam from '@aws-cdk/aws-iam';
import { Construct, Duration, IResource, Resource, Stack } from '@aws-cdk/core';
import { StateGraph } from './state-graph';
import { CfnStateMachine } from './stepfunctions.generated';
import { IChainable } from './types';

/**
 * Two types of state machines are available in AWS Step Functions: EXPRESS AND STANDARD.
 *
 * @see https://docs.aws.amazon.com/step-functions/latest/dg/concepts-standard-vs-express.html
 *
 * @default STANDARD
 */
export enum StateMachineType {
    /**
     * Express Workflows are ideal for high-volume, event processing workloads.
     */
    EXPRESS = 'EXPRESS',

    /**
     * Standard Workflows are ideal for long-running, durable, and auditable workflows.
     */
    STANDARD = 'STANDARD'
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
}

/**
 * A new or imported state machine.
 */
abstract class StateMachineBase extends Resource implements IStateMachine {
    /**
     * Import a state machine
     */
    public static fromStateMachineArn(scope: Construct, id: string, stateMachineArn: string): IStateMachine {
        class Import extends StateMachineBase {
            public readonly stateMachineArn = stateMachineArn;
        }

        return new Import(scope, id);
    }

    public abstract readonly stateMachineArn: string;

    /**
     * Grant the given identity permissions to start an execution of this state
     * machine.
     */
    public grantStartExecution(identity: iam.IGrantable): iam.Grant {
        return iam.Grant.addToPrincipal({
            grantee: identity,
            actions: ['states:StartExecution'],
            resourceArns: [this.stateMachineArn]
        });
    }
}

/**
 * Define a StepFunctions State Machine
 */
export class StateMachine extends StateMachineBase {
    /**
     * Execution role of this state machine
     */
    public readonly role: iam.IRole;

    /**
     * The name of the state machine
     * @attribute
     */
    public readonly stateMachineName: string;

    /**
     * The ARN of the state machine
     */
    public readonly stateMachineArn: string;

    /**
     * Type of the state machine
     * @attribute
     */
    public readonly stateMachineType: StateMachineType;

    constructor(scope: Construct, id: string, props: StateMachineProps) {
        super(scope, id, {
            physicalName: props.stateMachineName,
        });

        this.role = props.role || new iam.Role(this, 'Role', {
            assumedBy: new iam.ServicePrincipal('states.amazonaws.com'),
        });

        const graph = new StateGraph(props.definition.startState, `State Machine ${id} definition`);
        graph.timeout = props.timeout;

        this.stateMachineType = props.stateMachineType ? props.stateMachineType : StateMachineType.STANDARD;

        const resource = new CfnStateMachine(this, 'Resource', {
            stateMachineName: this.physicalName,
            stateMachineType: props.stateMachineType ? props.stateMachineType : undefined,
            roleArn: this.role.roleArn,
            definitionString: Stack.of(this).toJsonString(graph.toGraphJson()),
        });

        for (const statement of graph.policyStatements) {
            this.addToRolePolicy(statement);
        }

        this.stateMachineName = this.getResourceNameAttribute(resource.attrName);
        this.stateMachineArn = this.getResourceArnAttribute(resource.ref, {
          service: 'states',
          resource: 'stateMachine',
          resourceName: this.physicalName,
          sep: ':',
        });
    }

    /**
     * Add the given statement to the role's policy
     */
    public addToRolePolicy(statement: iam.PolicyStatement) {
        this.role.addToPolicy(statement);
    }

    /**
     * Return the given named metric for this State Machine's executions
     *
     * @default sum over 5 minutes
     */
    public metric(metricName: string, props?: cloudwatch.MetricOptions): cloudwatch.Metric {
        return new cloudwatch.Metric({
            namespace: 'AWS/States',
            metricName,
            dimensions: { StateMachineArn: this.stateMachineArn },
            statistic: 'sum',
            ...props
        });
    }

    /**
     * Metric for the number of executions that failed
     *
     * @default sum over 5 minutes
     */
    public metricFailed(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
        return this.metric('ExecutionsFailed', props);
    }

    /**
     * Metric for the number of executions that were throttled
     *
     * @default sum over 5 minutes
     */
    public metricThrottled(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
        return this.metric('ExecutionThrottled', props);
    }

    /**
     * Metric for the number of executions that were aborted
     *
     * @default sum over 5 minutes
     */
    public metricAborted(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
        return this.metric('ExecutionsAborted', props);
    }

    /**
     * Metric for the number of executions that succeeded
     *
     * @default sum over 5 minutes
     */
    public metricSucceeded(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
        return this.metric('ExecutionsSucceeded', props);
    }

    /**
     * Metric for the number of executions that succeeded
     *
     * @default sum over 5 minutes
     */
    public metricTimedOut(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
        return this.metric('ExecutionsTimedOut', props);
    }

    /**
     * Metric for the number of executions that were started
     *
     * @default sum over 5 minutes
     */
    public metricStarted(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
        return this.metric('ExecutionsStarted', props);
    }

    /**
     * Metric for the interval, in milliseconds, between the time the execution starts and the time it closes
     *
     * @default sum over 5 minutes
     */
    public metricTime(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
        return this.metric('ExecutionTime', props);
    }
}

/**
 * A State Machine
 */
export interface IStateMachine extends IResource {
    /**
     * The ARN of the state machine
     * @attribute
     */
    readonly stateMachineArn: string;
}
