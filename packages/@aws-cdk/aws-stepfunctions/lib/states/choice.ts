import cdk = require('@aws-cdk/cdk');
import { Condition } from '../asl-condition';
import { IChainable, IStateChain } from '../asl-external-api';
import { IInternalState, StateType, TransitionType } from '../asl-internal-api';
import { StateChain } from '../asl-state-chain';
import { State } from './state';

export interface ChoiceProps {
    inputPath?: string;
    outputPath?: string;
}

export class Choice extends State {
    private static Internals = class implements IInternalState {
        public readonly canHaveCatch = false;
        public readonly hasOpenNextTransition = false;
        public readonly stateId: string;
        public readonly policyStatements = new Array<cdk.PolicyStatement>();

        constructor(private readonly choice: Choice) {
            this.stateId = choice.stateId;
        }

        public renderState() {
            return {
                ...this.choice.renderBaseState(),
                ...this.choice.transitions.renderList(TransitionType.Choice),
                ...this.choice.transitions.renderSingle(TransitionType.Default),
            };
        }

        public addNext(_targetState: IInternalState): void {
            throw new Error("Cannot chain onto a Choice state. Use the state's .on() or .otherwise() instead.");
        }

        public addCatch(_targetState: IInternalState, _errors: string[]): void {
            throw new Error("Cannot catch errors on a Choice.");
        }

        public accessibleStates() {
            return this.choice.accessibleStates();
        }
    };

    constructor(parent: cdk.Construct, id: string, props: ChoiceProps = {}) {
        super(parent, id, {
            Type: StateType.Choice,
            InputPath: props.inputPath,
            OutputPath: props.outputPath,
        });
    }

    public on(condition: Condition, next: IChainable): Choice {
        this.transitions.add(TransitionType.Choice, next.toStateChain().startState, condition.renderCondition());
        return this;
    }

    public otherwise(next: IChainable): Choice {
        // We use the "next" transition to store the Default, even though the meaning is different.
        if (this.transitions.has(TransitionType.Default)) {
            throw new Error('Can only have one Default transition');
        }
        this.transitions.add(TransitionType.Default, next.toStateChain().startState);
        return this;
    }

    public toStateChain(): IStateChain {
        return new StateChain(new Choice.Internals(this));
    }

    public closure(): IStateChain {
        return this.toStateChain().closure();
    }
}
