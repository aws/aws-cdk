import cloudwatch = require('@aws-cdk/aws-cloudwatch');
import iam = require('@aws-cdk/aws-iam');
import { Construct, IResource, Resource, Stack } from '@aws-cdk/cdk';
import { StateGraph } from './state-graph';
import { CfnStateMachine } from './stepfunctions.generated';
import { IChainable } from './types';

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
    readonly timeoutSec?: number;
}

/**
 * Define a StepFunctions State Machine
 */
export class StateMachine extends Resource implements IStateMachine {
    /**
     * Import a state machine
     */
    public static fromStateMachineArn(scope: Construct, id: string, stateMachineArn: string): IStateMachine {
        class Import extends Resource implements IStateMachine {
            public readonly stateMachineArn = stateMachineArn;
        }

        return new Import(scope, id);
    }

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

    constructor(scope: Construct, id: string, props: StateMachineProps) {
        super(scope, id);

        this.role = props.role || new iam.Role(this, 'Role', {
            assumedBy: new iam.ServicePrincipal(`states.${Stack.of(this).region}.amazonaws.com`),
        });

        const graph = new StateGraph(props.definition.startState, `State Machine ${id} definition`);
        graph.timeoutSeconds = props.timeoutSec;

        const resource = new CfnStateMachine(this, 'Resource', {
            stateMachineName: props.stateMachineName,
            roleArn: this.role.roleArn,
            definitionString: Stack.of(this).stringifyJson(graph.toGraphJson()),
        });

        for (const statement of graph.policyStatements) {
            this.addToRolePolicy(statement);
        }

        this.stateMachineName = resource.stateMachineName;
        this.stateMachineArn = resource.stateMachineArn;
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
