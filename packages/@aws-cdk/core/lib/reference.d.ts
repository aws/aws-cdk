import { IConstruct } from 'constructs';
import { Intrinsic } from './private/intrinsic';
import { ResolutionTypeHint } from './type-hints';
/**
 * An intrinsic Token that represents a reference to a construct.
 *
 * References are recorded.
 */
export declare abstract class Reference extends Intrinsic {
    /**
     * Check whether this is actually a Reference
     */
    static isReference(x: any): x is Reference;
    readonly target: IConstruct;
    readonly displayName: string;
    constructor(value: any, target: IConstruct, displayName?: string, typeHint?: ResolutionTypeHint);
}
