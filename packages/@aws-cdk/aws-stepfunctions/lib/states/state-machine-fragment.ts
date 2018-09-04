import cdk = require('@aws-cdk/cdk');
import { IChainable, IStateChain } from "../asl-external-api";

export interface StateMachineFragmentProps {
    /**
     * Whether to add the fragment name to the states defined within
     *
     * @default true
     */
    scopeStateNames?: boolean;
}

export class StateMachineFragment extends cdk.Construct implements IChainable {
    /**
     * Used to find this Construct back in the construct tree
     */
    public readonly isStateMachine = true;

    public readonly scopeStateNames: boolean;

    private _startState?: IChainable;
    private chain?: IStateChain;

    constructor(parent: cdk.Construct, id: string, props: StateMachineFragmentProps = {}) {
        super(parent, id);
        this.scopeStateNames = props.scopeStateNames !== undefined ? props.scopeStateNames : true;
    }

    /**
     * Explicitly set a start state
     */
    public start(state: IChainable): IStateChain {
        this._startState = state;
        return state.toStateChain();
    }

    public toStateChain(): IStateChain {
        this.freeze();
        return this.chain!;
    }

    public next(sm: IChainable): IStateChain {
        return this.toStateChain().next(sm);
    }

    protected freeze() {
        if (this.chain === undefined) {
            // If we're converting a state machine definition to a state chain, grab the whole of it.
            // We need to cache this value; because of the .closure(), it may change
            // depending on whether states get chained onto the states in this fragment.
            this.chain = this.startState.toStateChain().closure();
        }
    }

    private get startState(): IChainable {
        if (this._startState) {
            return this._startState;
        }

        // If no explicit start state given, find the first child that is a state
        const firstStateChild = this.children.find(isChainable);
        if (!isChainable(firstStateChild)) {
            throw new Error('State Machine definition does not contain any states');
        }

        return firstStateChild as IChainable;
    }
}

function isChainable(x: any): x is IChainable {
    return x && x.toStateChain !== undefined;
}
