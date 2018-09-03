import iam = require('@aws-cdk/aws-iam');
import cdk = require('@aws-cdk/cdk');
import { IChainable, IState, IStateChain } from "../asl-external-api";

export interface StateMachineDefinitionProps {
    timeoutSeconds?: number;
}

export class StateMachineDefinition extends cdk.Construct implements IChainable {
    /**
     * Used to find this Construct back in the construct tree
     */
    public readonly isStateMachine = true;

    private readonly timeoutSeconds?: number;
    private readonly policyStatements = new Array<cdk.PolicyStatement>();
    private readonly states = new Array<IState>();
    private startState?: IState;
    private policyRole?: iam.Role;
    private sm?: IStateChain;

    constructor(parent: cdk.Construct, id: string, props: StateMachineDefinitionProps = {}) {
        super(parent, id);
        this.timeoutSeconds = props.timeoutSeconds;
    }

    public start(state: IState): IStateChain {
        this.startState = state;
        return state.toStateChain();
    }

    public addToRolePolicy(statement: cdk.PolicyStatement) {
        // This may be called before and after attaching to a StateMachine.
        // Cache the policy statements added in this way if before attaching,
        // otherwise attach to role directly.
        if (this.policyRole) {
            this.policyRole.addToPolicy(statement);
        } else {
            this.policyStatements.push(statement);
        }
    }

    public addPolicyStatementsToRole(role: iam.Role) {
        // Add all cached policy statements, then remember the policy
        // for future additions.
        for (const s of this.policyStatements) {
            role.addToPolicy(s);
        }
        this.policyStatements.splice(0); // Clear array
        this.policyRole = role;
    }

    public toStateChain(): IStateChain {
        if (!this.sm) {
            throw new Error('No state machine define with .define()');
        }

        // FIXME: Use somewhere
        Array.isArray(this.timeoutSeconds);

        return this.sm;
    }

    public renderStateMachine(): any {
        return {};
    }

    public _addState(state: IState) {
        if (this.startState === undefined) {
            this.startState = state;
        }
        this.states.push(state);
    }
}
