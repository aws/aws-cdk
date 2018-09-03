import cdk = require('@aws-cdk/cdk');
import { IChainable, IStateChain } from "../asl-external-api";
import { IInternalState, Transition } from '../asl-internal-api';
import { StateMachineDefinition } from './state-machine-definition';

export abstract class State extends cdk.Construct implements IChainable {
    protected readonly transitions = new Array<Transition>();

    constructor(parent: StateMachineDefinition, id: string, private readonly options: any) {
        super(parent, id);

        parent._addState(this);
    }

    public abstract toStateChain(): IStateChain;

    /**
     * Convenience function to immediately go into State Machine mode
     */
    public then(sm: IChainable): IStateChain {
        return this.toStateChain().then(sm);
    }

    public catch(handler: IChainable, ...errors: string[]): IStateChain {
        return this.toStateChain().catch(handler, ...errors);
    }

    /**
     * Find the top-level StateMachine we're part of
     */
    protected containingStateMachine(): StateMachineDefinition {
        let curr: cdk.Construct | undefined = this;
        while (curr && !isStateMachine(curr)) {
            curr = curr.parent;
        }
        if (!curr) {
            throw new Error('Could not find encompassing StateMachine');
        }
        return curr;
    }

    protected renderBaseState(): any {
        return this.options;
    }

    /**
     * Return the name of this state
     */
    protected get stateId(): string {
        return this.ancestors(this.containingStateMachine()).map(x => x.id).join('/');
    }

    protected addTransition(targetState: IInternalState, annotation?: any) {
        this.transitions.push({ targetState, annotation });
    }

    protected getTransitions(withAnnotation: boolean): Transition[] {
        return this.transitions.filter(t => (t.annotation === undefined) === withAnnotation);
    }

    protected addNextTransition(targetState: IInternalState): void {
        if (this.getTransitions(false).length > 0) {
            throw new Error(`State ${this.stateId} already has a Next transition`);
        }
        this.addTransition(targetState);
    }
}

function isStateMachine(construct: cdk.Construct): construct is StateMachineDefinition {
    return (construct as any).isStateMachine;
}
