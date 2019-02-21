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
   * @default 0 for Tag 1 for RemoveTag
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
  propagateAtLaunch?: boolean;
}

interface ITagFormatter {
  renderTags(tags: Tag[], propertyTags: CfnAsgTag[] | {[key: string]: string}): any;
}

class StandardFormatter implements ITagFormatter {
  public renderTags(tags: Tag[], propertyTags: any): any {
    const cfnTags: CfnTag[] = [];
    for (const tag of tags) {
      cfnTags.push({key: tag.key, value: tag.value});
    }
    const finalTags = mergeTags(propertyTags || [], cfnTags);
    return finalTags.length === 0 ? undefined : finalTags;
  }
}

class AsgFormatter implements ITagFormatter {
  public renderTags(tags: Tag[], propertyTags: any): any {
    const cfnTags: CfnAsgTag[] = [];
    for (const tag of tags) {
      cfnTags.push({key: tag.key,
        value: tag.value,
        propagateAtLaunch: tag.props.applyToLaunchedInstances !== false});
    }
    const finalTags = mergeTags(propertyTags || [], cfnTags);
    return finalTags.length === 0 ? undefined : finalTags;
  }
}

class MapFormatter implements ITagFormatter {
  public renderTags(tags: Tag[], propertyTags: {[key: string]: string}): any {
    const cfnTags: {[key: string]: string} = {};
    const propTags = propertyTags || {};
    for (const tag of tags) {
      cfnTags[tag.key] = tag.value;
    }
    if (Array.isArray(propertyTags) || typeof(propTags) !== 'object') {
      throw new Error(`Invalid usage. This resource uses a String Map for tags not (${JSON.stringify(propertyTags)})`);
    }
    const finalTags = Object.assign(propTags, cfnTags);
    return Object.keys(finalTags).length === 0 ? undefined : finalTags;
  }
}

class NoFormat implements ITagFormatter {
  public renderTags(_tags: Tag[], _propertyTags: any): any {
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
  private readonly removedTags = new Map<string, number>();
  private readonly tagFormatter: ITagFormatter;
  private readonly resourceTypeName: string;

  constructor(tagType: TagType, resourceTypeName: string) {
    this.resourceTypeName = resourceTypeName;
    this.tagFormatter = TAG_FORMATTERS[tagType];
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

    if (!this.canApplyTag(key, tagProps)) {
      // can't apply tag so return doing nothing
      return;
    }
    this.tags.set(key, {value, props: tagProps});
    // ensure nothing is left in removeTags
    this.removedTags.delete(key);
  }

  /**
   * Removes the specified tag from the array if it exists
   *
   * @param key The key of the tag to remove
   */
  public removeTag(key: string, props?: TagProps): void {
    const tagProps = props || {};
    const priority = tagProps.priority === undefined ? 0 : tagProps.priority;
    if (!this.canApplyTag(key, tagProps)) {
      // can't apply tag so return doing nothing
      return;
    }
    this.tags.delete(key);
    this.removedTags.set(key, priority);
  }

  /**
   * Renders tags into the proper format based on TagType
   */
  public renderTags(propertyTags?: any): any {
    const tags: Tag[] = [];
    this.tags.forEach( (tag, key) => {
      tags.push({key, value: tag.value, props: tag.props});
    });
    return this.tagFormatter.renderTags(tags, propertyTags);
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
    if (this.tags.has(key)) {
      const tag = this.tags.get(key);
      if (tag !== undefined && tag.props.priority !== undefined) {
        return priority >= tag.props.priority!;
      }
    }
    if (this.removedTags.has(key)) {
      const removePriority = this.removedTags.get(key);
      return priority >= (removePriority === undefined ? 0 : removePriority );
    }
    return true;
  }
}
function mergeTags(target: CfnAsgTag[], source: CfnAsgTag[]): CfnAsgTag[] {
  if (Array.isArray(target) && Array.isArray(source)) {
    const result = [...source];
    const keys = result.map( (tag) => (tag.key) );
    result.push(...target.filter( (tag) => (!keys.includes(tag.key))));
    return result;
  }
  throw new Error(`Invalid usage. Both source (${JSON.stringify(source)}) and target (${JSON.stringify(target)}) must both be arrays`);
}
