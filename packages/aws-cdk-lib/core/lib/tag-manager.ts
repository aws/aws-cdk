import { TagType } from './cfn-resource';
import { CfnTag } from './cfn-tag';
import { Lazy } from './lazy';
import { IResolvable } from './resolvable';

const TAG_MANAGER_SYM = Symbol.for('@aws-cdk/core.TagManager');

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
 * Modernized version of ITaggable
 *
 * `ITaggable` has a problem: for a number of L1 resources, we failed to generate
 * `tags: TagManager`, and generated `tags: CfnSomeResource.TagProperty[]` instead.
 *
 * To mark these resources as taggable, we need to put the `TagManager` in a new property
 * whose name is unlikely to conflict with any existing properties. Hence, a new interface
 * for that purpose. All future resources will implement `ITaggableV2`.
 */
export interface ITaggableV2 {
  /**
   * TagManager to set, remove and format tags
   */
  readonly cdkTagManager: TagManager;
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
 * class MyConstruct extends Resource implements ITaggable {
 *   public readonly tags = new TagManager(TagType.KEY_VALUE, 'Whatever::The::Type');
 *
 *   constructor(scope: Construct, id: string) {
 *     super(scope, id);
 *
 *     new CfnResource(this, 'Resource', {
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
    const tags = (construct as any).tags;
    return tags && typeof tags === 'object' && (tags as any)[TAG_MANAGER_SYM];
  }

  /**
   * Check whether the given construct is ITaggableV2
   */
  public static isTaggableV2(construct: any): construct is ITaggableV2 {
    return (construct as any).cdkTagManager !== undefined;
  }

  /**
   * Return the TagManager associated with the given construct, if any
   */
  public static of(construct: any): TagManager | undefined {
    return TagManager.isTaggableV2(construct) ? construct.cdkTagManager : TagManager.isTaggable(construct) ? construct.tags : undefined;
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
  private dynamicTags?: any;
  private readonly priorities = new Map<string, number>();
  private readonly tagFormatter: ITagFormatter;
  private readonly resourceTypeName: string;
  private readonly externalTagPriority = 50;
  private readonly didHaveInitialTags: boolean;

  constructor(tagType: TagType, resourceTypeName: string, initialTags?: any, options: TagManagerOptions = { }) {
    this.resourceTypeName = resourceTypeName;
    this.tagFormatter = TAG_FORMATTERS()[tagType];
    this.tagPropertyName = options.tagPropertyName || 'tags';
    this.parseExternalTags(initialTags);
    this.didHaveInitialTags = initialTags !== undefined;

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
  public renderTags(combineWithTags?: any): any {
    if (combineWithTags !== undefined && this.didHaveInitialTags) {
      throw new Error('Specify external tags either during the creation of TagManager, or as a parameter to renderTags(), but not both');
    }
    this.parseExternalTags(combineWithTags);
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

  /**
   * Parse external tags.
   *
   * Set the parseable ones into this tag manager. Save the rest (tokens, lazies) in `this.dynamicTags`.
   */
  private parseExternalTags(initialTags: any) {
    if (initialTags !== undefined) {
      const parseTagsResult = this.tagFormatter.parseTags(initialTags, this.externalTagPriority);
      this.dynamicTags = parseTagsResult.dynamicTags;
      this._setTag(...parseTagsResult.tags);
    }
  }
}
(TagManager.prototype as any)[TAG_MANAGER_SYM] = true;
