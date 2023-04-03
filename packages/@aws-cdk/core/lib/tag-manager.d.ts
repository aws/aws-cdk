import { TagType } from './cfn-resource';
import { IResolvable } from './resolvable';
/**
 * Interface to implement tags.
 */
export interface ITaggable {
    /**
     * TagManager to set, remove and format tags
     */
    readonly tags: TagManager;
}
/**
 * Options to configure TagManager behavior
 */
export interface TagManagerOptions {
    /**
     * The name of the property in CloudFormation for these tags
     *
     * Normally this is `tags`, but Cognito UserPool uses UserPoolTags
     *
     * @default "tags"
     */
    readonly tagPropertyName?: string;
}
/**
 * TagManager facilitates a common implementation of tagging for Constructs
 *
 * Normally, you do not need to use this class, as the CloudFormation specification
 * will indicate which resources are taggable. However, sometimes you will need this
 * to make custom resources taggable. Used `tagManager.renderedTags` to obtain a
 * value that will resolve to the tags at synthesis time.
 *
 * @example
 * import * as cdk from '@aws-cdk/core';
 *
 * class MyConstruct extends cdk.Resource implements cdk.ITaggable {
 *   public readonly tags = new cdk.TagManager(cdk.TagType.KEY_VALUE, 'Whatever::The::Type');
 *
 *   constructor(scope: cdk.Construct, id: string) {
 *     super(scope, id);
 *
 *     new cdk.CfnResource(this, 'Resource', {
 *       type: 'Whatever::The::Type',
 *       properties: {
 *         // ...
 *         Tags: this.tags.renderedTags,
 *       },
 *     });
 *   }
 * }
 *
 */
export declare class TagManager {
    /**
     * Check whether the given construct is Taggable
     */
    static isTaggable(construct: any): construct is ITaggable;
    /**
     * The property name for tag values
     *
     * Normally this is `tags` but some resources choose a different name. Cognito
     * UserPool uses UserPoolTags
     */
    readonly tagPropertyName: string;
    /**
     * A lazy value that represents the rendered tags at synthesis time
     *
     * If you need to make a custom construct taggable, use the value of this
     * property to pass to the `tags` property of the underlying construct.
     */
    readonly renderedTags: IResolvable;
    private readonly tags;
    private readonly dynamicTags;
    private readonly priorities;
    private readonly tagFormatter;
    private readonly resourceTypeName;
    private readonly initialTagPriority;
    constructor(tagType: TagType, resourceTypeName: string, tagStructure?: any, options?: TagManagerOptions);
    /**
     * Adds the specified tag to the array of tags
     *
     */
    setTag(key: string, value: string, priority?: number, applyToLaunchedInstances?: boolean): void;
    /**
     * Removes the specified tag from the array if it exists
     *
     * @param key The tag to remove
     * @param priority The priority of the remove operation
     */
    removeTag(key: string, priority: number): void;
    /**
     * Renders tags into the proper format based on TagType
     *
     * This method will eagerly render the tags currently applied. In
     * most cases, you should be using `tagManager.renderedTags` instead,
     * which will return a `Lazy` value that will resolve to the correct
     * tags at synthesis time.
     */
    renderTags(): any;
    /**
     * Render the tags in a readable format
     */
    tagValues(): Record<string, string>;
    /**
     * Determine if the aspect applies here
     *
     * Looks at the include and exclude resourceTypeName arrays to determine if
     * the aspect applies here
     */
    applyTagAspectHere(include?: string[], exclude?: string[]): boolean;
    /**
     * Returns true if there are any tags defined
     */
    hasTags(): boolean;
    private _setTag;
    private get sortedTags();
}
