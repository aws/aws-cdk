import { TagType } from './cfn-resource';
import { CfnTag } from './tag';

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
  parseTags(cfnPropertyTags: any, priority: number): Tag[];
}

/**
 * Standard tags are a list of { key, value } objects
 */
class StandardFormatter implements ITagFormatter {
  public parseTags(cfnPropertyTags: any, priority: number): Tag[] {
    if (!Array.isArray(cfnPropertyTags)) {
      throw new Error(`Invalid tag input expected array of {key, value} have ${JSON.stringify(cfnPropertyTags)}`);
    }

    const tags: Tag[] = [];
    for (const tag of cfnPropertyTags) {
      if (tag.key === undefined || tag.value === undefined) {
        throw new Error(`Invalid tag input expected {key, value} have ${JSON.stringify(tag)}`);
      }
      // using interp to ensure Token is now string
      tags.push({
        key: `${tag.key}`,
        value: `${tag.value}`,
        priority
      });
    }
    return tags;
  }

  public formatTags(tags: Tag[]): any {
    const cfnTags: CfnTag[] = [];
    for (const tag of tags) {
      cfnTags.push({
        key: tag.key,
        value: tag.value
      });
    }
    return cfnTags.length === 0 ? undefined : cfnTags;
  }
}

/**
 * ASG tags are a list of { key, value, propagateAtLaunch } objects
 */
class AsgFormatter implements ITagFormatter {
  public parseTags(cfnPropertyTags: any, priority: number): Tag[] {
    const tags: Tag[] = [];
    if (!Array.isArray(cfnPropertyTags)) {
      throw new Error(`Invalid tag input expected array of {key, value, propagateAtLaunch} have ${JSON.stringify(cfnPropertyTags)}`);
    }

    for (const tag of cfnPropertyTags) {
      if (tag.key === undefined ||
        tag.value === undefined ||
        tag.propagateAtLaunch === undefined) {
        throw new Error(`Invalid tag input expected {key, value, propagateAtLaunch} have ${JSON.stringify(tag)}`);
      }
      // using interp to ensure Token is now string
      tags.push({
        key: `${tag.key}`,
        value: `${tag.value}`,
        priority,
        applyToLaunchedInstances: !!tag.propagateAtLaunch
      });
    }

    return tags;
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
    return cfnTags.length === 0 ? undefined : cfnTags;
  }
}

/**
 * Some CloudFormation constructs use a { key: value } map for tags
 */
class MapFormatter implements ITagFormatter {
  public parseTags(cfnPropertyTags: any, priority: number): Tag[] {
    const tags: Tag[] = [];
    if (Array.isArray(cfnPropertyTags) || typeof(cfnPropertyTags) !== 'object') {
      throw new Error(`Invalid tag input expected map of {key: value} have ${JSON.stringify(cfnPropertyTags)}`);
    }

    for (const [key, value] of Object.entries(cfnPropertyTags)) {
      tags.push({
        key,
        value: `${value}`,
        priority
      });
    }

    return tags;
  }

  public formatTags(tags: Tag[]): any {
    const cfnTags: {[key: string]: string} = {};
    for (const tag of tags) {
      cfnTags[`${tag.key}`] = `${tag.value}`;
    }
    return Object.keys(cfnTags).length === 0 ? undefined : cfnTags;
  }
}

class NoFormat implements ITagFormatter {
  public parseTags(_cfnPropertyTags: any): Tag[] {
    return [];
  }
  public formatTags(_tags: Tag[]): any {
    return undefined;
  }
}

const TAG_FORMATTERS: {[key: string]: ITagFormatter} = {
  [TagType.AutoScalingGroup]: new AsgFormatter(),
  [TagType.Standard]: new StandardFormatter(),
  [TagType.Map]: new MapFormatter(),
  [TagType.NotTaggable]: new NoFormat(),
};

export interface ITaggable {
  /**
   * TagManager to set, remove and format tags
   */
  readonly tags: TagManager;
}

/**
 * TagManager facilitates a common implementation of tagging for Constructs.
 */
export class TagManager {
  private readonly tags = new Map<string, Tag>();
  private readonly priorities = new Map<string, number>();
  private readonly tagFormatter: ITagFormatter;
  private readonly resourceTypeName: string;
  private readonly initialTagPriority = 50;

  constructor(tagType: TagType, resourceTypeName: string, tagStructure?: any) {
    this.resourceTypeName = resourceTypeName;
    this.tagFormatter = TAG_FORMATTERS[tagType];
    if (tagStructure !== undefined) {
      this._setTag(...this.tagFormatter.parseTags(tagStructure, this.initialTagPriority));
    }
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
   */
  public renderTags(): any {
    return this.tagFormatter.formatTags(Array.from(this.tags.values()));
  }

  public applyTagAspectHere(include?: string[], exclude?: string[]) {
    if (exclude && exclude.length > 0 && exclude.indexOf(this.resourceTypeName) !== -1) {
      return false;
    }
    if (include && include.length > 0 && include.indexOf(this.resourceTypeName) === -1) {
      return false;
    }

    return true;
  }

  private _setTag(...tags: Tag[]) {
    for (const tag of tags) {
      if (tag.priority >= (this.priorities.get(tag.key) || 0)) {
        this.tags.set(tag.key, tag);
        this.priorities.set(tag.key, tag.priority);
      }
    }
  }
}
