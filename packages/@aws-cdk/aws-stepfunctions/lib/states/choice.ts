import { Condition } from '../asl-condition';
import { IChainable, IStateChain } from '../asl-external-api';
import { IInternalState, StateBehavior, StateType } from '../asl-internal-api';
import { StateChain } from '../asl-state-chain';
import { State } from './state';
import { StateMachineDefinition } from './state-machine-definition';

interface ChoiceBranch {
    condition: Condition;
    next: IChainable;
}

export interface ChoiceProps {
    inputPath?: string;
    outputPath?: string;
}

export class Choice extends State {
    private static Internals = class implements IInternalState {
        public readonly stateBehavior: StateBehavior = {
            canHaveCatch: false,
            canHaveNext: false,
            elidable: false
        };

        constructor(private readonly choice: Choice) {
        }

        public get stateId(): string {
            return this.choice.stateId;
        }

        public renderState() {
            const defaultTransitions = this.choice.transitions.filter(t => t.annotation === undefined);
            if (defaultTransitions.length > 1) {
                throw new Error('Can only have one default transition');
            }
            const choices = this.choice.transitions.filter(t => t.annotation !== undefined);

            return {
                ...this.choice.renderBaseState(),
                Choices: choices.map(c => ({
                    ...c.annotation,
                    Next: c.targetState.stateId
                })),
                Default: defaultTransitions.length > 0 ? defaultTransitions[0].targetState.stateId : undefined
            };
        }

        public next(_targetState: IInternalState): void {
            throw new Error("Cannot chain onto a Choice state. Use the state's .on() or .otherwise() instead.");
        }

        public catch(_targetState: IInternalState, _errors: string[]): void {
            throw new Error("Cannot catch errors on a Choice.");
        }
    };
    public readonly stateBehavior: StateBehavior = {
        canHaveCatch: false,
        canHaveNext: false,
        elidable: false
    };

    private readonly choices: ChoiceBranch[] = [];
    private hasDefault = false;

    constructor(parent: StateMachineDefinition, id: string, props: ChoiceProps = {}) {
        super(parent, id, {
            Type: StateType.Choice,
            InputPath: props.inputPath,
            OutputPath: props.outputPath,
        });
    }

    public on(condition: Condition, next: IChainable): Choice {
        this.choices.push({ condition, next });
        return this;
    }

    public otherwise(next: IChainable): Choice {
        if (this.hasDefault) {
            throw new Error('Can only have one default transition');
        }
        this.hasDefault = true;
        this.addTransition(next.toStateChain().startState, undefined);
        return this;
    }

    public toStateChain(): IStateChain {
        return new StateChain(new Choice.Internals(this));
    }
}
