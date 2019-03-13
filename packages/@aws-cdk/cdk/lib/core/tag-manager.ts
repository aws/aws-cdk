import { TagType } from '../cloudformation/resource';
import { CfnTag } from '../cloudformation/tag';

/**
 * Properties for a tag
 */
export interface TagProps {
  /**
   * Handles AutoScalingGroup PropagateAtLaunch property
   */
  applyToLaunchedInstances?: boolean;

  /**
   * An array of Resource Types that will not receive this tag
   *
   * An empty array will allow this tag to be applied to all resources. A
   * non-empty array will apply this tag only if the Resource type is not in
   * this array.
   * @default []
   */
  excludeResourceTypes?: string[];

  /**
   * An array of Resource Types that will receive this tag
   *
   * An empty array will match any Resource. A non-empty array will apply this
   * tag only to Resource types that are included in this array.
   * @default []
   */
  includeResourceTypes?: string[];

  /**
   * Higher or equal priority tags will take precedence
   *
   * Setting priority will enable the user to control tags when they need to not
   * follow the default precedence pattern of last applied and closest to the
   * construct in the tree.
   * Defaults are set in Tag and RemoveTag for priority.
   * @see Tag
   * @see RemoveTag
   * @default 0 when this class is used without aspects mentioned above.
   */
  priority?: number;
}

interface Tag {
  key: string;
  value: string;
  props: TagProps;
}

interface CfnAsgTag {
  key: string;
  value: string;
  propagateAtLaunch: boolean;
}

interface ITagFormatter {
  formatTags(tags: Tag[]): any;
  parseTags(cfnPropertyTags: any): Tag[];
}

class StandardFormatter implements ITagFormatter {
  public parseTags(cfnPropertyTags: any): Tag[] {
    const tags: Tag[] = [];
    if (Array.isArray(cfnPropertyTags)) {
      for (const tag of cfnPropertyTags) {
        if (tag.key === undefined || tag.value === undefined) {
          throw new Error(`Invalid tag input expected {key, value} have ${JSON.stringify(tag)}`);
        }
        // using interp to ensure Token is now string
        tags.push({key: `${tag.key}`, value: `${tag.value}`, props: {}});
      }
      return tags;
    }
    throw new Error(`Invalid tag input expected array of {key, value} have ${JSON.stringify(cfnPropertyTags)}`);
  }

  public formatTags(tags: Tag[]): any {
    const cfnTags: CfnTag[] = [];
    for (const tag of tags) {
      cfnTags.push({key: tag.key, value: tag.value});
    }
    return cfnTags.length === 0 ? undefined : cfnTags;
  }
}

class AsgFormatter implements ITagFormatter {
  public parseTags(cfnPropertyTags: any): Tag[] {
    const tags: Tag[] = [];
    if (Array.isArray(cfnPropertyTags)) {
      for (const tag of cfnPropertyTags) {
        if (tag.key === undefined ||
          tag.value === undefined ||
          tag.propagateAtLaunch === undefined) {
          throw new Error(`Invalid tag input expected {key, value, propagateAtLaunch} have ${JSON.stringify(tag)}`);
        }
        // using interp to ensure Token is now string
        tags.push({key: `${tag.key}`, value: `${tag.value}`, props: {
          applyToLaunchedInstances: tag.propagateAtLaunch}});
      }
      return tags;
    }
    throw new Error(`Invalid tag input expected array of {key, value, propagateAtLaunch} have ${JSON.stringify(cfnPropertyTags)}`);
  }
  public formatTags(tags: Tag[]): any {
    const cfnTags: CfnAsgTag[] = [];
    for (const tag of tags) {
      cfnTags.push({key: tag.key,
        value: tag.value,
        propagateAtLaunch: tag.props.applyToLaunchedInstances !== false});
    }
    return cfnTags.length === 0 ? undefined : cfnTags;
  }
}

class MapFormatter implements ITagFormatter {
  public parseTags(cfnPropertyTags: any): Tag[] {
    const tags: Tag[] = [];
    if (Array.isArray(cfnPropertyTags) || typeof(cfnPropertyTags) !== 'object') {
      throw new Error(`Invalid tag input expected map of {key: value} have ${JSON.stringify(cfnPropertyTags)}`);
    }

    for (const key of Object.keys(cfnPropertyTags)) {
      tags.push({key, value: cfnPropertyTags[key], props: {}});
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
/**
 * TagManager facilitates a common implementation of tagging for Constructs.
 */
export class TagManager {

  private readonly tags = new Map<string, {value: string, props: TagProps}>();
  private readonly priorities = new Map<string, number>();
  private readonly tagFormatter: ITagFormatter;
  private readonly resourceTypeName: string;
  private readonly initialTagPriority = 50;

  constructor(tagType: TagType, resourceTypeName: string, tags?: any) {
    this.resourceTypeName = resourceTypeName;
    this.tagFormatter = TAG_FORMATTERS[tagType];
    if (tags !== undefined) {
      const initialTags = this.tagFormatter.parseTags(tags);
      for (const tag of initialTags) {
        this.setTag(tag.key, tag.value, {priority: this.initialTagPriority});
      }
    }
  }

  /**
   * Adds the specified tag to the array of tags
   *
   * @param key The key value of the tag
   * @param value The value value of the tag
   * @param props A `TagProps` defaulted to applyToLaunchInstances true
   */
  public setTag(key: string, value: string, props?: TagProps): void {
    const tagProps: TagProps = props || {};
    tagProps.applyToLaunchedInstances = tagProps.applyToLaunchedInstances !== false;
    tagProps.priority = tagProps.priority === undefined ? 0 : tagProps.priority;

    if (!this.canApplyTag(key, tagProps)) {
      // can't apply tag so return doing nothing
      return;
    }
    this.tags.set(key, {value, props: tagProps});
    this.priorities.set(key, tagProps.priority);
  }

  /**
   * Removes the specified tag from the array if it exists
   *
   * @param key The key of the tag to remove
   */
  public removeTag(key: string, props?: TagProps): void {
    const tagProps = props || {};
    tagProps.priority = tagProps.priority === undefined ? 0 : tagProps.priority;
    if (!this.canApplyTag(key, tagProps)) {
      // can't apply tag so return doing nothing
      return;
    }
    this.tags.delete(key);
    this.priorities.set(key, tagProps.priority);
  }

  /**
   * Renders tags into the proper format based on TagType
   */
  public renderTags(): any {
    const tags: Tag[] = [];
    this.tags.forEach( (tag, key) => {
      tags.push({key, value: tag.value, props: tag.props});
    });
    return this.tagFormatter.formatTags(tags);
  }

  private canApplyTag(key: string, props: TagProps): boolean {
    const include = props.includeResourceTypes || [];
    const exclude = props.excludeResourceTypes || [];
    const priority = props.priority === undefined ? 0 : props.priority;

    if (exclude.length !== 0 &&
      exclude.indexOf(this.resourceTypeName) !== -1) {
      return false;
    }
    if (include.length !== 0 &&
      include.indexOf(this.resourceTypeName) === -1) {
      return false;
    }
    return priority >= (this.priorities.get(key) || 0);
  }
}
