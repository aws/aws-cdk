import cdk = require('@aws-cdk/cdk');
import { INextable } from '../types';
import { State, StateType } from './state';

/**
 * Properties for defining a Succeed state
 */
export interface SucceedProps {
    /**
     * An optional description for this state
     *
     * @default No comment
     */
    comment?: string;

    /**
     * JSONPath expression to select part of the state to be the input to this state.
     *
     * May also be the special value DISCARD, which will cause the effective
     * input to be the empty object {}.
     *
     * @default $
     */
    inputPath?: string;

    /**
     * JSONPath expression to select part of the state to be the output to this state.
     *
     * May also be the special value DISCARD, which will cause the effective
     * output to be the empty object {}.
     *
     * @default $
     */
    outputPath?: string;

}

/**
 * Define a Succeed state in the state machine
 *
 * Reaching a Succeed state terminates the state execution in success.
 */
export class Succeed extends State {
    public readonly endStates: INextable[] = [];

    constructor(parent: cdk.Construct, id: string, props: SucceedProps = {}) {
        super(parent, id, props);
    }

    /**
     * Return the Amazon States Language object for this state
     */
    public toStateJson(): object {
        return {
            Type: StateType.Succeed,
            Comment: this.comment,
            ...this.renderInputOutput(),
        };
    }
}
