import { Construct } from 'constructs';
/**
 * An element of a CloudFormation stack.
 */
export declare abstract class CfnElement extends Construct {
    /**
     * Returns `true` if a construct is a stack element (i.e. part of the
     * synthesized cloudformation template).
     *
     * Uses duck-typing instead of `instanceof` to allow stack elements from different
     * versions of this library to be included in the same stack.
     *
     * @returns The construct as a stack element or undefined if it is not a stack element.
     */
    static isCfnElement(x: any): x is CfnElement;
    /**
     * The logical ID for this CloudFormation stack element. The logical ID of the element
     * is calculated from the path of the resource node in the construct tree.
     *
     * To override this value, use `overrideLogicalId(newLogicalId)`.
     *
     * @returns the logical ID as a stringified token. This value will only get
     * resolved during synthesis.
     */
    readonly logicalId: string;
    /**
     * The stack in which this element is defined. CfnElements must be defined within a stack scope (directly or indirectly).
     */
    readonly stack: Stack;
    /**
     * An explicit logical ID provided by `overrideLogicalId`.
     */
    private _logicalIdOverride?;
    /**
     * If the logicalId is locked then it can no longer be overridden.
     * This is needed for cases where the logicalId is consumed prior to synthesis
     * (i.e. Stack.exportValue).
     */
    private _logicalIdLocked?;
    /**
     * Creates an entity and binds it to a tree.
     * Note that the root of the tree must be a Stack object (not just any Root).
     *
     * @param scope The parent construct
     * @param props Construct properties
     */
    constructor(scope: Construct, id: string);
    /**
     * Overrides the auto-generated logical ID with a specific ID.
     * @param newLogicalId The new logical ID to use for this stack element.
     */
    overrideLogicalId(newLogicalId: string): void;
    /**
     * Lock the logicalId of the element and do not allow
     * any updates (e.g. via overrideLogicalId)
     *
     * This is needed in cases where you are consuming the LogicalID
     * of an element prior to synthesis and you need to not allow future
     * changes to the id since doing so would cause the value you just
     * consumed to differ from the synth time value of the logicalId.
     *
     * For example:
     *
     * const bucket = new Bucket(stack, 'Bucket');
     * stack.exportValue(bucket.bucketArn) <--- consuming the logicalId
     * bucket.overrideLogicalId('NewLogicalId') <--- updating logicalId
     *
     * You should most likely never need to use this method, and if
     * you are implementing a feature that requires this, make sure
     * you actually require it.
     *
     * @internal
     */
    _lockLogicalId(): void;
    /**
     * @returns the stack trace of the point where this Resource was created from, sourced
     *      from the +metadata+ entry typed +aws:cdk:logicalId+, and with the bottom-most
     *      node +internal+ entries filtered.
     */
    get creationStack(): string[];
    /**
     * Returns the CloudFormation 'snippet' for this entity. The snippet will only be merged
     * at the root level to ensure there are no identity conflicts.
     *
     * For example, a Resource class will return something like:
     * {
     *   Resources: {
     *     [this.logicalId]: {
     *       Type: this.resourceType,
     *       Properties: this.props,
     *       Condition: this.condition
     *     }
     *   }
     * }
     *
     * @internal
     */
    abstract _toCloudFormation(): object;
    /**
     * Called during synthesize to render the logical ID of this element. If
     * `overrideLogicalId` was it will be used, otherwise, we will allocate the
     * logical ID through the stack.
     */
    private synthesizeLogicalId;
}
/**
 * Base class for referencable CloudFormation constructs which are not Resources
 *
 * These constructs are things like Conditions and Parameters, can be
 * referenced by taking the `.ref` attribute.
 *
 * Resource constructs do not inherit from CfnRefElement because they have their
 * own, more specific types returned from the .ref attribute. Also, some
 * resources aren't referencable at all (such as BucketPolicies or GatewayAttachments).
 */
export declare abstract class CfnRefElement extends CfnElement {
    /**
     * Return a string that will be resolved to a CloudFormation `{ Ref }` for this element.
     *
     * If, by any chance, the intrinsic reference of a resource is not a string, you could
     * coerce it to an IResolvable through `Lazy.any({ produce: resource.ref })`.
     */
    get ref(): string;
}
import { Stack } from './stack';
