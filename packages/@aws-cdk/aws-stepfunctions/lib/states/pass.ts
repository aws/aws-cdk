import { IStateChain } from '../asl-external-api';
import { IInternalState, StateBehavior, StateType } from '../asl-internal-api';
import { StateChain } from '../asl-state-chain';
import { State } from './state';
import { StateMachineDefinition } from './state-machine-definition';
import { renderNextEnd } from './util';

export interface PassProps {
    inputPath?: string;
    outputPath?: string;
    elidable?: boolean;
}

export class Pass extends State {
    private static Internals = class implements IInternalState {
        constructor(private readonly pass: Pass) {
        }

        public get stateId(): string {
            return this.pass.stateId;
        }

        public get stateBehavior(): StateBehavior {
            return {
                canHaveNext: true,
                canHaveCatch: false,
                elidable: this.pass.elidable
            };
        }

        public renderState() {
            const regularTransitions = this.pass.getTransitions(false);

            return {
                ...this.pass.renderBaseState(),
                ...renderNextEnd(regularTransitions),
            };
        }

        public next(targetState: IInternalState): void {
            this.pass.addNextTransition(targetState);
        }

        public catch(_targetState: IInternalState, _errors: string[]): void {
            throw new Error("Cannot catch errors on a Pass.");
        }
    };
    private readonly elidable: boolean;

    constructor(parent: StateMachineDefinition, id: string, props: PassProps = {}) {
        super(parent, id, {
            Type: StateType.Pass,
            InputPath: props.inputPath,
            OutputPath: props.outputPath
        });
        this.elidable = (props.elidable || false) && !props.inputPath && !props.outputPath;
    }

    public toStateChain(): IStateChain {
        return new StateChain(new Pass.Internals(this));
    }
}
