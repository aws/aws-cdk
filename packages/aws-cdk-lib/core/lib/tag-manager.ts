import { TagType } from './cfn-resource';
import { CfnTag } from './cfn-tag';
import { Lazy } from './lazy';
import { IResolvable } from './resolvable';

interface Tag {
  key: string;
  value: string;
  priority: number;

  /**
   * @default true
   */
  applyToLaunchedInstances?: boolean;
}

interface CfnAsgTag {
  key: string;
  value: string;
  propagateAtLaunch: boolean;
}

interface StackTag {
  Key: string;
  Value: string;
}

/**
 * The results of parsing Tags.
 */
interface ParseTagsResult {
  /**
   * The "simple" (meaning, not including complex CloudFormation functions)
   * tags that were found.
   */
  readonly tags: Tag[];

  /**
   * The collection of "dynamic" (meaning, including complex CloudFormation functions)
   * tags that were found.
   */
  readonly dynamicTags: any;
}

/**
 * Interface for converter between CloudFormation and internal tag representations
 */
interface ITagFormatter {
  /**
   * Format the given tags as CloudFormation tags
   */
  formatTags(tags: Tag[]): any;

  /**
   * Parse the CloudFormation tag representation into internal representation
   *
   * Use the given priority.
   */
  parseTags(cfnPropertyTags: any, priority: number): ParseTagsResult;
}

/**
 * Standard tags are a list of { key, value } objects
 */
class StandardFormatter implements ITagFormatter {
  public parseTags(cfnPropertyTags: any, priority: number): ParseTagsResult {
    if (!Array.isArray(cfnPropertyTags)) {
      throw new Error(`Invalid tag input expected array of {key, value} have ${JSON.stringify(cfnPropertyTags)}`);
    }

    const tags: Tag[] = [];
    const dynamicTags: any = [];
    for (const tag of cfnPropertyTags) {
      if (tag.key === undefined || tag.value === undefined) {
        dynamicTags.push(tag);
      } else {
        // using interp to ensure Token is now string
        tags.push({
          key: `${tag.key}`,
          value: `${tag.value}`,
          priority,
        });
      }
    }
    return { tags, dynamicTags };
  }

  public formatTags(tags: Tag[]): any {
    const cfnTags: CfnTag[] = [];
    for (const tag of tags) {
      cfnTags.push({
        key: tag.key,
        value: tag.value,
      });
    }
    return cfnTags;
  }
}

/**
 * ASG tags are a list of { key, value, propagateAtLaunch } objects
 */
class AsgFormatter implements ITagFormatter {
  public parseTags(cfnPropertyTags: any, priority: number): ParseTagsResult {
    if (!Array.isArray(cfnPropertyTags)) {
      throw new Error(`Invalid tag input expected array of {key, value, propagateAtLaunch} have ${JSON.stringify(cfnPropertyTags)}`);
    }

    const tags: Tag[] = [];
    const dynamicTags: any = [];
    for (const tag of cfnPropertyTags) {
      if (tag.key === undefined ||
          tag.value === undefined ||
          tag.propagateAtLaunch === undefined) {
        dynamicTags.push(tag);
      } else {
        // using interp to ensure Token is now string
        tags.push({
          key: `${tag.key}`,
          value: `${tag.value}`,
          priority,
          applyToLaunchedInstances: !!tag.propagateAtLaunch,
        });
      }
    }

    return { tags, dynamicTags };
  }

  public formatTags(tags: Tag[]): any {
    const cfnTags: CfnAsgTag[] = [];
    for (const tag of tags) {
      cfnTags.push({
        key: tag.key,
        value: tag.value,
        propagateAtLaunch: tag.applyToLaunchedInstances !== false,
      });
    }
    return cfnTags;
  }
}

/**
 * Some CloudFormation constructs use a { key: value } map for tags
 */
class MapFormatter implements ITagFormatter {
  public parseTags(cfnPropertyTags: any, priority: number): ParseTagsResult {
    if (Array.isArray(cfnPropertyTags) || typeof(cfnPropertyTags) !== 'object') {
      throw new Error(`Invalid tag input expected map of {key: value} have ${JSON.stringify(cfnPropertyTags)}`);
    }

    const tags: Tag[] = [];
    for (const [key, value] of Object.entries(cfnPropertyTags)) {
      tags.push({
        key,
        value: `${value}`,
        priority,
      });
    }

    return { tags, dynamicTags: undefined };
  }

  public formatTags(tags: Tag[]): any {
    const cfnTags: { [key: string]: string } = {};
    for (const tag of tags) {
      cfnTags[`${tag.key}`] = `${tag.value}`;
    }
    return cfnTags;
  }
}

/**
 * StackTags are of the format { Key: key, Value: value }
 */
class KeyValueFormatter implements ITagFormatter {
  public parseTags(keyValueTags: any, priority: number): ParseTagsResult {
    const tags: Tag[] = [];
    for (const key in keyValueTags) {
      if (keyValueTags.hasOwnProperty(key)) {
        const value = keyValueTags[key];
        tags.push({
          key,
          value,
          priority,
        });
      }
    }
    return { tags, dynamicTags: undefined };
  }

  public formatTags(unformattedTags: Tag[]): any {
    const tags: StackTag[] = [];
    unformattedTags.forEach(tag => {
      tags.push({
        Key: tag.key,
        Value: tag.value,
      });
    });
    return tags;
  }
}

class NoFormat implements ITagFormatter {
  public parseTags(_cfnPropertyTags: any): ParseTagsResult {
    return { tags: [], dynamicTags: undefined };
  }

  public formatTags(_tags: Tag[]): any {
    return undefined;
  }
}

let _tagFormattersCache: {[key: string]: ITagFormatter} | undefined;

/**
 * Access tag formatters table
 *
 * In a function because we're in a load cycle with cfn-resource that defines `TagType`.
 */
function TAG_FORMATTERS(): {[key: string]: ITagFormatter} {
  return _tagFormattersCache ?? (_tagFormattersCache = {
    [TagType.AUTOSCALING_GROUP]: new AsgFormatter(),
    [TagType.STANDARD]: new StandardFormatter(),
    [TagType.MAP]: new MapFormatter(),
    [TagType.KEY_VALUE]: new KeyValueFormatter(),
    [TagType.NOT_TAGGABLE]: new NoFormat(),
  });
}

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
export class TagManager {
  /**
   * Check whether the given construct is Taggable
   */
  public static isTaggable(construct: any): construct is ITaggable {
    return (construct as any).tags !== undefined;
  }

  /**
   * The property name for tag values
   *
   * Normally this is `tags` but some resources choose a different name. Cognito
   * UserPool uses UserPoolTags
   */
  public readonly tagPropertyName: string;

  /**
   * A lazy value that represents the rendered tags at synthesis time
   *
   * If you need to make a custom construct taggable, use the value of this
   * property to pass to the `tags` property of the underlying construct.
   */
  public readonly renderedTags: IResolvable;

  private readonly tags = new Map<string, Tag>();
  private readonly dynamicTags: any;
  private readonly priorities = new Map<string, number>();
  private readonly tagFormatter: ITagFormatter;
  private readonly resourceTypeName: string;
  private readonly initialTagPriority = 50;

  constructor(tagType: TagType, resourceTypeName: string, tagStructure?: any, options: TagManagerOptions = { }) {
    this.resourceTypeName = resourceTypeName;
    this.tagFormatter = TAG_FORMATTERS()[tagType];
    if (tagStructure !== undefined) {
      const parseTagsResult = this.tagFormatter.parseTags(tagStructure, this.initialTagPriority);
      this.dynamicTags = parseTagsResult.dynamicTags;
      this._setTag(...parseTagsResult.tags);
    }
    this.tagPropertyName = options.tagPropertyName || 'tags';

    this.renderedTags = Lazy.any({ produce: () => this.renderTags() });
  }

  /**
   * Adds the specified tag to the array of tags
   *
   */
  public setTag(key: string, value: string, priority = 0, applyToLaunchedInstances = true): void {
    // This method mostly exists because we don't want to expose the 'Tag' type used (it will be confusing
    // to users).
    this._setTag({ key, value, priority, applyToLaunchedInstances });
  }

  /**
   * Removes the specified tag from the array if it exists
   *
   * @param key The tag to remove
   * @param priority The priority of the remove operation
   */
  public removeTag(key: string, priority: number): void {
    if (priority >= (this.priorities.get(key) || 0)) {
      this.tags.delete(key);
      this.priorities.set(key, priority);
    }
  }

  /**
   * Renders tags into the proper format based on TagType
   *
   * This method will eagerly render the tags currently applied. In
   * most cases, you should be using `tagManager.renderedTags` instead,
   * which will return a `Lazy` value that will resolve to the correct
   * tags at synthesis time.
   */
  public renderTags(): any {
    const formattedTags = this.tagFormatter.formatTags(this.sortedTags);
    if (Array.isArray(formattedTags) || Array.isArray(this.dynamicTags)) {
      const ret = [...formattedTags ?? [], ...this.dynamicTags ?? []];
      return ret.length > 0 ? ret : undefined;
    } else {
      const ret = { ...formattedTags ?? {}, ...this.dynamicTags ?? {} };
      return Object.keys(ret).length > 0 ? ret : undefined;
    }
  }

  /**
   * Render the tags in a readable format
   */
  public tagValues(): Record<string, string> {
    const ret: Record<string, string> = {};
    for (const tag of this.sortedTags) {
      ret[tag.key] = tag.value;
    }
    return ret;
  }

  /**
   * Determine if the aspect applies here
   *
   * Looks at the include and exclude resourceTypeName arrays to determine if
   * the aspect applies here
   */
  public applyTagAspectHere(include?: string[], exclude?: string[]) {
    if (exclude && exclude.length > 0 && exclude.indexOf(this.resourceTypeName) !== -1) {
      return false;
    }
    if (include && include.length > 0 && include.indexOf(this.resourceTypeName) === -1) {
      return false;
    }

    return true;
  }

  /**
   * Returns true if there are any tags defined
   */
  public hasTags(): boolean {
    return this.tags.size > 0;
  }

  private _setTag(...tags: Tag[]) {
    for (const tag of tags) {
      if (tag.priority >= (this.priorities.get(tag.key) || 0)) {
        this.tags.set(tag.key, tag);
        this.priorities.set(tag.key, tag.priority);
      }
    }
  }

  private get sortedTags(): Tag[] {
    return Array.from(this.tags.values())
      .sort((a, b) => a.key.localeCompare(b.key));
  }
}
