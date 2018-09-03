import iam = require('@aws-cdk/aws-iam');
import cdk = require('@aws-cdk/cdk');
import { StateMachineDefinition } from './asl-states';
import { cloudformation, StateMachineArn, StateMachineName } from './stepfunctions.generated';

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
    definition: StateMachineDefinition;

    /**
     * The execution role for the state machine service
     *
     * @default A role is automatically created
     */
    role?: iam.Role;
}

/**
 * Define a StepFunctions State Machine
 */
export class StateMachine extends cdk.Construct {
    public readonly role: iam.Role;
    public readonly stateMachineName: StateMachineName;
    public readonly stateMachineArn: StateMachineArn;

    constructor(parent: cdk.Construct, id: string, props: StateMachineProps) {
        super(parent, id);

        this.role = props.role || new iam.Role(this, 'Role', {
            assumedBy: new cdk.ServicePrincipal(new cdk.FnConcat('states.', new cdk.AwsRegion(), '.amazonaws.com').toString()),
        });

        const resource = new cloudformation.StateMachineResource(this, 'Resource', {
            stateMachineName: props.stateMachineName,
            roleArn: this.role.roleArn,
            // Depending on usage, definition may change after our instantiation
            // (because we're organized like a mutable object tree)
            definitionString: new cdk.Token(() => cdk.CloudFormationJSON.stringify(props.definition.toStateMachine()))
        });

        this.stateMachineName = resource.stateMachineName;
        this.stateMachineArn = resource.ref;
    }

    public addToRolePolicy(statement: cdk.PolicyStatement) {
        this.role.addToPolicy(statement);
    }
}