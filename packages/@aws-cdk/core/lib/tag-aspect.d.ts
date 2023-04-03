import { Construct, IConstruct } from 'constructs';
import { IAspect } from './aspect';
import { ITaggable } from './tag-manager';
/**
 * Properties for a tag
 */
export interface TagProps {
    /**
     * Whether the tag should be applied to instances in an AutoScalingGroup
     *
     * @default true
     */
    readonly applyToLaunchedInstances?: boolean;
    /**
     * An array of Resource Types that will not receive this tag
     *
     * An empty array will allow this tag to be applied to all resources. A
     * non-empty array will apply this tag only if the Resource type is not in
     * this array.
     * @default []
     */
    readonly excludeResourceTypes?: string[];
    /**
     * An array of Resource Types that will receive this tag
     *
     * An empty array will match any Resource. A non-empty array will apply this
     * tag only to Resource types that are included in this array.
     * @default []
     */
    readonly includeResourceTypes?: string[];
    /**
     * Priority of the tag operation
     *
     * Higher or equal priority tags will take precedence.
     *
     * Setting priority will enable the user to control tags when they need to not
     * follow the default precedence pattern of last applied and closest to the
     * construct in the tree.
     *
     * @default
     *
     * Default priorities:
     *
     * - 100 for `SetTag`
     * - 200 for `RemoveTag`
     * - 50 for tags added directly to CloudFormation resources
     *
     */
    readonly priority?: number;
}
/**
 * The common functionality for Tag and Remove Tag Aspects
 */
declare abstract class TagBase implements IAspect {
    /**
     * The string key for the tag
     */
    readonly key: string;
    protected readonly props: TagProps;
    constructor(key: string, props?: TagProps);
    visit(construct: IConstruct): void;
    protected abstract applyTag(resource: ITaggable): void;
}
/**
 * The Tag Aspect will handle adding a tag to this node and cascading tags to children
 */
export declare class Tag extends TagBase {
    /**
     * DEPRECATED: add tags to the node of a construct and all its the taggable children
     *
     * @deprecated use `Tags.of(scope).add()`
     */
    static add(scope: Construct, key: string, value: string, props?: TagProps): void;
    /**
     * DEPRECATED: remove tags to the node of a construct and all its the taggable children
     *
     * @deprecated use `Tags.of(scope).remove()`
     */
    static remove(scope: Construct, key: string, props?: TagProps): void;
    /**
     * The string value of the tag
     */
    readonly value: string;
    private readonly defaultPriority;
    constructor(key: string, value: string, props?: TagProps);
    protected applyTag(resource: ITaggable): void;
}
/**
 * Manages AWS tags for all resources within a construct scope.
 */
export declare class Tags {
    private readonly scope;
    /**
     * Returns the tags API for this scope.
     * @param scope The scope
     */
    static of(scope: IConstruct): Tags;
    private constructor();
    /**
     * add tags to the node of a construct and all its the taggable children
     */
    add(key: string, value: string, props?: TagProps): void;
    /**
     * remove tags to the node of a construct and all its the taggable children
     */
    remove(key: string, props?: TagProps): void;
}
/**
 * The RemoveTag Aspect will handle removing tags from this node and children
 */
export declare class RemoveTag extends TagBase {
    private readonly defaultPriority;
    constructor(key: string, props?: TagProps);
    protected applyTag(resource: ITaggable): void;
}
export {};
