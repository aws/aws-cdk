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

export interface ITag {
  key: string;
  value: string;
  props: TagProps;
}

export interface ITagFormatter {
  renderTags(tags: ITag[], propertyTags: any): any;
}

/**
 * TagManager facilitates a common implementation of tagging for Constructs.
 */
export class TagManager {

  private readonly tags: ITag[] = [];
  private readonly tagSet: {[key: string]: number} = {};
  private readonly removedTags: {[key: string]: number} = {};
  private readonly tagType: TagType;
  private readonly resourceTypeName: string;

  constructor(tagType: TagType, resourceTypeName: string) {
    this.tagType = tagType;
    this.resourceTypeName = resourceTypeName;
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

    if (!this.canApplyTag(key, tagProps)) {
      // tag is blocked by a remove
      return;
    }
    tagProps.applyToLaunchedInstances = tagProps.applyToLaunchedInstances !== false;
    const index = this.tags.push({key, value, props: tagProps});
    this.tagSet[key] = index - 1;
    // ensure nothing is left in removeTags
    delete this.removedTags[key];
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
      // tag is blocked by a remove
      return;
    }
    delete this.tagSet[key];
    this.removedTags[key] = priority;
  }

  /**
   * Renders tags into the proper format based on TagType
   */
  public renderTags(propertyTags?: any): any {
    const formatter = this.tagFormatter();
    const tags: ITag[] = [];
    for (const key of Object.keys(this.tagSet)) {
      tags.push(this.tags[this.tagSet[key]]);
    }
    return formatter.renderTags(tags, propertyTags);
  }

  private tagFormatter(): ITagFormatter {
    switch (this.tagType) {
      case TagType.AutoScalingGroup:
        return new AsgFormatter();
        break;
      case TagType.Map:
        return new MapFormatter();
        break;
      case TagType.Standard:
        return new StandardFormatter();
        break;
      default:
        return new NoFormat();
        break;
    }
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
    if (this.tagSet[key] >= 0) {
      const tag = this.tags[this.tagSet[key]];
      if (tag.props.priority !== undefined) {
        return priority >= tag.props.priority!;
      }
    }
    if (this.removedTags[key]) {
      return priority >= this.removedTags[key];
    }
    return true;
  }
}

export class StandardFormatter implements ITagFormatter {
  public renderTags(tags: ITag[], propertyTags: any): any {
    const cfnTags: CfnTag[] = [];
    for (const tag of tags) {
      cfnTags.push({key: tag.key, value: tag.value});
    }
    const finalTags = mergeTags(propertyTags || [], cfnTags);
    return finalTags.length === 0 ? undefined : finalTags;
  }
}

interface AsgTag {
  key: string;
  value: string;
  propagateAtLaunch?: boolean;
}

export class AsgFormatter implements ITagFormatter {
  public renderTags(tags: ITag[], propertyTags: any): any {
    const cfnTags: AsgTag[] = [];
    for (const tag of tags) {
      cfnTags.push({key: tag.key,
        value: tag.value,
        propagateAtLaunch: tag.props.applyToLaunchedInstances !== false});
    }
    const finalTags = mergeTags(propertyTags || [], cfnTags);
    return finalTags.length === 0 ? undefined : finalTags;
  }
}

export class MapFormatter implements ITagFormatter {
  public renderTags(tags: ITag[], propertyTags: any): any {
    const cfnTags: {[key: string]: string} = {};
    for (const tag of tags) {
      cfnTags[tag.key] = tag.value;
    }
    const finalTags = mergeTags(propertyTags || {}, cfnTags);
    return Object.keys(finalTags).length === 0 ? undefined : finalTags;
  }
}

export class NoFormat implements ITagFormatter {
  public renderTags(_tags: ITag[], _propertyTags: any): any {
    return undefined;
  }
}

function mergeTags(target: any, source: any): any {
  if (Array.isArray(target) && Array.isArray(source)) {
    const result = [...source];
    const keys = result.map( (tag) => (tag.key) );
    result.push(...target.filter( (tag) => (!keys.includes(tag.key))));
    return result;
  }
  if (typeof(target) === 'object' && typeof(source) === 'object' &&
    !Array.isArray(target) && !Array.isArray(source)) {
    return Object.assign(target, source);
  }
  throw new Error(`Invalid usage. Both source (${JSON.stringify(source)}) and target (${JSON.stringify(target)}) must both be string maps or arrays`);
}
