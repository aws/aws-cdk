import cdk = require('@aws-cdk/cdk');
import { IChainable, IStateChain } from "../asl-external-api";
import { Transitions, TransitionType } from '../asl-internal-api';
import { StateMachineFragment } from './state-machine-fragment';

export abstract class State extends cdk.Construct implements IChainable {
    protected readonly transitions = new Transitions();

    constructor(parent: cdk.Construct, id: string, private readonly options: any) {
        super(parent, id);
    }

    public abstract toStateChain(): IStateChain;

    protected renderBaseState(): any {
        return this.options;
    }

    /**
     * Return the name of this state
     */
    protected get stateId(): string {
        const parentDefs: cdk.Construct[] = this.ancestors().filter(c => (isStateMachineFragment(c) && c.scopeStateNames) || c === this);
        return parentDefs.map(x => x.id).join('/');
    }

    protected accessibleStates(): IStateChain[] {
        return this.transitions.all().map(t => t.targetChain);
    }

    protected get hasNextTransition() {
        return this.transitions.has(TransitionType.Next);
    }

    protected addNextTransition(targetState: IStateChain): void {
        if (this.hasNextTransition) {
            throw new Error(`State ${this.stateId} already has a Next transition`);
        }
        this.transitions.add(TransitionType.Next, targetState);
    }
}

function isStateMachineFragment(construct: cdk.Construct): construct is StateMachineFragment {
    return (construct as any).isStateMachine;
}
