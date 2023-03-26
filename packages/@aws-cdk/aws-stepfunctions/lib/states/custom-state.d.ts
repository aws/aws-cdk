import { Construct } from 'constructs';
import { Chain } from '..';
import { IChainable, INextable } from '../types';
import { State } from './state';
/**
 * Properties for defining a custom state definition
 */
export interface CustomStateProps {
    /**
     * Amazon States Language (JSON-based) definition of the state
     *
     * @see https://docs.aws.amazon.com/step-functions/latest/dg/concepts-amazon-states-language.html
     */
    readonly stateJson: {
        [key: string]: any;
    };
}
/**
 * State defined by supplying Amazon States Language (ASL) in the state machine.
 *
 */
export declare class CustomState extends State implements IChainable, INextable {
    readonly endStates: INextable[];
    /**
     * Amazon States Language (JSON-based) definition of the state
     */
    private readonly stateJson;
    constructor(scope: Construct, id: string, props: CustomStateProps);
    /**
     * Continue normal execution with the given state
     */
    next(next: IChainable): Chain;
    /**
     * Returns the Amazon States Language object for this state
     */
    toStateJson(): object;
}
