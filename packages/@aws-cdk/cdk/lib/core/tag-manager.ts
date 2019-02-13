import { TagType } from '../cloudformation/resource';

/**
 * Properties Tags is a dictionary of tags as strings
 */
type Tags = { [key: string]: {value: string, props: TagProps }};

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

/**
 * TagManager facilitates a common implementation of tagging for Constructs.
 */
export class TagManager {

  private readonly tags: Tags = {};

  private readonly removedTags: {[key: string]: number} = {};

  constructor(private readonly tagType: TagType, private readonly resourceTypeName: string) { }

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
    this.tags[key] = { value, props: tagProps };
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
    delete this.tags[key];
    this.removedTags[key] = priority;
  }

  /**
   * Renders tags into the proper format based on TagType
   */
  public renderTags(propertyTags?: any): any {
    this.mergeFrom(propertyTags);
    const keys = Object.keys(this.tags);
    switch (this.tagType) {
      case TagType.Standard: {
        const tags: Array<{key: string, value: string}> = [];
        for (const key of keys) {
          tags.push({key, value: this.tags[key].value});
        }
        return tags.length === 0 ? undefined : tags;
      }
      case TagType.AutoScalingGroup: {
        const tags: Array<{key: string, value: string, propagateAtLaunch: boolean}> = [];
        for (const key of keys) {
          tags.push({
            key,
            value: this.tags[key].value,
            propagateAtLaunch: this.tags[key].props.applyToLaunchedInstances !== false}
          );
        }
        return tags.length === 0 ? undefined : tags;
      }
      case TagType.Map: {
        const tags: {[key: string]: string} = {};
        for (const key of keys) {
          tags[key] = this.tags[key].value;
        }
        return Object.keys(tags).length === 0 ? undefined : tags;
      }
      case TagType.NotTaggable: {
        return undefined;
      }
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
    if (this.tags[key]) {
      if (this.tags[key].props.priority !== undefined) {
        return priority >= this.tags[key].props.priority!;
      }
    }
    if (this.removedTags[key]) {
      return priority >= this.removedTags[key];
    }
    return true;
  }

  private mergeFrom(propertyTags: any): void {
    if (propertyTags === undefined) {
      return;
    }
    const keys = Object.keys(this.tags);
    switch (this.tagType) {
      case TagType.Standard: {
        if (Array.isArray(propertyTags)) {
          for (const tag of propertyTags) {
            if (!keys.includes(tag.key)) {
              this.setTag(tag.key, tag.value);
            }
          }
        } else {
          throw new Error(`${this.resourceTypeName} expects a tags array of key value pairs, received [ ${JSON.stringify(propertyTags)} ]`);
        }
        break;
      }
      case TagType.AutoScalingGroup: {
        if (Array.isArray(propertyTags)) {
          for (const tag of propertyTags) {
            if (!keys.includes(tag.key)) {
              this.setTag(tag.key, tag.value, {applyToLaunchedInstances: tag.propagateAtLaunch});
            }
          }
        } else {
          throw new Error(`${this.resourceTypeName} expects a tags array of key value pairs, received [ ${JSON.stringify(propertyTags)} ]`);
        }
        break;
      }
      case TagType.Map: {
        for (const key of Object.keys(propertyTags)) {
          if (!keys.includes(key)) {
            this.setTag(key, propertyTags[key]);
          }
        }
        break;
      }
    }
  }
}
