import cloudwatch = require('@aws-cdk/aws-cloudwatch');
import events = require('@aws-cdk/aws-events');
import iam = require('@aws-cdk/aws-iam');
import cdk = require('@aws-cdk/cdk');
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
    stateMachineName?: string;

    /**
     * Definition for this state machine
     */
    definition: IChainable;

    /**
     * The execution role for the state machine service
     *
     * @default A role is automatically created
     */
    role?: iam.Role;

    /**
     * Maximum run time for this state machine
     *
     * @default No timeout
     */
    timeoutSec?: number;
}

/**
 * Define a StepFunctions State Machine
 */
export class StateMachine extends cdk.Construct implements IStateMachine, events.IEventRuleTarget {
    /**
     * Import a state machine
     */
    public static import(scope: cdk.Construct, id: string, props: StateMachineImportProps): IStateMachine {
        return new ImportedStateMachine(scope, id, props);
    }

    /**
     * Execution role of this state machine
     */
    public readonly role: iam.Role;

    /**
     * The name of the state machine
     */
    public readonly stateMachineName: string;

    /**
     * The ARN of the state machine
     */
    public readonly stateMachineArn: string;

    /**
     * A role used by CloudWatch events to start the State Machine
     */
    private eventsRole?: iam.Role;

    constructor(scope: cdk.Construct, id: string, props: StateMachineProps) {
        super(scope, id);

        this.role = props.role || new iam.Role(this, 'Role', {
            assumedBy: new iam.ServicePrincipal(`states.${this.node.stack.region}.amazonaws.com`),
        });

        const graph = new StateGraph(props.definition.startState, `State Machine ${id} definition`);
        graph.timeoutSeconds = props.timeoutSec;

        const resource = new CfnStateMachine(this, 'Resource', {
            stateMachineName: props.stateMachineName,
            roleArn: this.role.roleArn,
            definitionString: this.node.stringifyJson(graph.toGraphJson()),
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
     * Allows using state machines as event rule targets.
     */
    public asEventRuleTarget(_ruleArn: string, _ruleId: string): events.EventRuleTargetProps {
        if (!this.eventsRole) {
            this.eventsRole = new iam.Role(this, 'EventsRole', {
                assumedBy: new iam.ServicePrincipal('events.amazonaws.com')
            });

            this.eventsRole.addToPolicy(new iam.PolicyStatement()
                .addAction('states:StartExecution')
                .addResource(this.stateMachineArn));
        }

        return {
            id: this.node.id,
            arn: this.stateMachineArn,
            roleArn: this.eventsRole.roleArn,
        };
    }

    /**
     * Return the given named metric for this State Machine's executions
     *
     * @default sum over 5 minutes
     */
    public metric(metricName: string, props?: cloudwatch.MetricCustomization): cloudwatch.Metric {
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
    public metricFailed(props?: cloudwatch.MetricCustomization): cloudwatch.Metric {
        return this.metric('ExecutionsFailed', props);
    }

    /**
     * Metric for the number of executions that were throttled
     *
     * @default sum over 5 minutes
     */
    public metricThrottled(props?: cloudwatch.MetricCustomization): cloudwatch.Metric {
        return this.metric('ExecutionThrottled', props);
    }

    /**
     * Metric for the number of executions that were aborted
     *
     * @default sum over 5 minutes
     */
    public metricAborted(props?: cloudwatch.MetricCustomization): cloudwatch.Metric {
        return this.metric('ExecutionsAborted', props);
    }

    /**
     * Metric for the number of executions that succeeded
     *
     * @default sum over 5 minutes
     */
    public metricSucceeded(props?: cloudwatch.MetricCustomization): cloudwatch.Metric {
        return this.metric('ExecutionsSucceeded', props);
    }

    /**
     * Metric for the number of executions that succeeded
     *
     * @default sum over 5 minutes
     */
    public metricTimedOut(props?: cloudwatch.MetricCustomization): cloudwatch.Metric {
        return this.metric('ExecutionsTimedOut', props);
    }

    /**
     * Metric for the number of executions that were started
     *
     * @default sum over 5 minutes
     */
    public metricStarted(props?: cloudwatch.MetricCustomization): cloudwatch.Metric {
        return this.metric('ExecutionsStarted', props);
    }

    /**
     * Export this state machine
     */
    public export(): StateMachineImportProps {
        return {
            stateMachineArn: new cdk.CfnOutput(this, 'StateMachineArn', { value: this.stateMachineArn }).makeImportValue().toString(),
        };
    }
}

/**
 * A State Machine
 */
export interface IStateMachine extends cdk.IConstruct {
    /**
     * The ARN of the state machine
     */
    readonly stateMachineArn: string;

    /**
     * Export this state machine
     */
    export(): StateMachineImportProps;
}

/**
 * Properties for an imported state machine
 */
export interface StateMachineImportProps {
    /**
     * The ARN of the state machine
     */
    stateMachineArn: string;
}

class ImportedStateMachine extends cdk.Construct implements IStateMachine {
    public readonly stateMachineArn: string;
    constructor(scope: cdk.Construct, id: string, private readonly props: StateMachineImportProps) {
        super(scope, id);
        this.stateMachineArn = props.stateMachineArn;
    }

    public export() {
        return this.props;
    }
}
