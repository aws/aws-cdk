import iam = require('@aws-cdk/aws-iam');
import cdk = require('@aws-cdk/cdk');

import { asl } from './asl';
import { cloudformation, StateMachineName } from './stepfunctions.generated';

export interface StateMachineProps {
    /**
     * A name for the state machine
     *
     * @default A name is automatically generated
     */
    stateMachineName?: string;

    /**
     * The definition of this state machine
     */
    definition: asl.StateMachine;

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

    constructor(parent: cdk.Construct, id: string, props: StateMachineProps) {
        super(parent, id);

        this.role = props.role || new iam.Role(this, 'Role', {
            assumedBy: new cdk.ServicePrincipal('stepfunctions.amazonaws.com'),
        });

        const resource = new cloudformation.StateMachineResource(this, 'Resource', {
            stateMachineName: props.stateMachineName,
            roleArn: this.role.roleArn,
            definitionString: props.definition.definitionString()
        });

        this.stateMachineName = resource.stateMachineName;
    }
}