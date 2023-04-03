import { Reference } from '../reference';
/**
 * An enum that allows controlling how will the created reference
 * be rendered in the resulting CloudFormation template.
 */
export declare enum ReferenceRendering {
    /**
     * Used for rendering a reference inside Fn::Sub expressions,
     * which mean these must resolve to "${Sth}" instead of { Ref: "Sth" }.
     */
    FN_SUB = 0,
    /**
     * Used for rendering Fn::GetAtt with its arguments in string form
     * (as opposed to the more common arguments in array form, which we render by default).
     */
    GET_ATT_STRING = 1
}
/**
 * A Token that represents a CloudFormation reference to another resource
 *
 * If these references are used in a different stack from where they are
 * defined, appropriate CloudFormation `Export`s and `Fn::ImportValue`s will be
 * synthesized automatically instead of the regular CloudFormation references.
 *
 * Additionally, the dependency between the stacks will be recorded, and the toolkit
 * will make sure to deploy producing stack before the consuming stack.
 *
 * This magic happens in the prepare() phase, where consuming stacks will call
 * `consumeFromStack` on these Tokens and if they happen to be exported by a different
 * Stack, we'll register the dependency.
 */
export declare class CfnReference extends Reference {
    readonly target: IConstruct;
    /**
     * Check whether this is actually a Reference
     */
    static isCfnReference(x: IResolvable): x is CfnReference;
    /**
     * Return the CfnReference for the indicated target
     *
     * Will make sure that multiple invocations for the same target and intrinsic
     * return the same CfnReference. Because CfnReferences accumulate state in
     * the prepare() phase (for the purpose of cross-stack references), it's
     * important that the state isn't lost if it's lazily created, like so:
     *
     *     Lazy.string({ produce: () => new CfnReference(...) })
     *
     */
    static for(target: CfnElement, attribute: string, refRender?: ReferenceRendering, typeHint?: ResolutionTypeHint): CfnReference;
    /**
     * Return a CfnReference that references a pseudo referenced
     */
    static forPseudo(pseudoName: string, scope: Construct): CfnReference;
    /**
     * Static table where we keep singleton CfnReference instances
     */
    private static referenceTable;
    /**
     * Get or create the table.
     * Passing fnSub = true allows cloudformation-include to correctly handle Fn::Sub.
     */
    private static singletonReference;
    /**
     * The Tokens that should be returned for each consuming stack (as decided by the producing Stack)
     */
    private readonly replacementTokens;
    private readonly targetStack;
    protected constructor(value: any, displayName: string, target: IConstruct, typeHint?: ResolutionTypeHint);
    resolve(context: IResolveContext): any;
    hasValueForStack(stack: Stack): boolean;
    assignValueForStack(stack: Stack, value: IResolvable): void;
    /**
     * Implementation of toString() that will use the display name
     */
    toString(): string;
}
import { Construct, IConstruct } from 'constructs';
import { CfnElement } from '../cfn-element';
import { IResolvable, IResolveContext } from '../resolvable';
import { Stack } from '../stack';
import { ResolutionTypeHint } from '../type-hints';
