import { IConstruct } from 'constructs';
/**
 * Represents an Aspect
 */
export interface IAspect {
    /**
     * All aspects can visit an IConstruct
     */
    visit(node: IConstruct): void;
}
/**
 * Aspects can be applied to CDK tree scopes and can operate on the tree before
 * synthesis.
 */
export declare class Aspects {
    /**
     * Returns the `Aspects` object associated with a construct scope.
     * @param scope The scope for which these aspects will apply.
     */
    static of(scope: IConstruct): Aspects;
    private readonly _aspects;
    private constructor();
    /**
     * Adds an aspect to apply this scope before synthesis.
     * @param aspect The aspect to add.
     */
    add(aspect: IAspect): void;
    /**
     * The list of aspects which were directly applied on this scope.
     */
    get all(): IAspect[];
}
