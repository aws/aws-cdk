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
   * Higher or equal priority tags will take precedence
   *
   * Setting priority will enable the user to control tags when they need to not
   * follow the default precedence pattern of last applied and closest to the
   * construct in the tree.
   * @default 0 for Tag 1 for Remove Tag
   */
  priority?: number;
}

/**
 * TagManager facilitates a common implementation of tagging for Constructs.
 */
export class TagManager {

  private readonly tags: Tags = {};

  private readonly removedTags: {[key: string]: number} = {};

  constructor(private readonly tagType: TagType) { }

  /**
   * Adds the specified tag to the array of tags
   *
   * @param key The key value of the tag
   * @param value The value value of the tag
   * @param props A `TagProps` defaulted to applyToLaunchInstances true
   */
  public setTag(key: string, value: string, props?: TagProps): void {
    const tagProps: TagProps = props || {};
    tagProps.priority = tagProps.priority === undefined ? 0 : tagProps.priority;

    if (!this.hasHigherPriority(key, tagProps.priority)) {
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
  public removeTag(key: string, priority: number = 0): void {
    if (!this.hasHigherPriority(key, priority)) {
      // tag is blocked by a remove
      return;
    }
    delete this.tags[key];
    this.removedTags[key] = priority;
  }

  /**
   * Renders tags into the proper format based on TagType
   */
  public renderTags(): any {
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

  private hasHigherPriority(key: string, priority: number): boolean {
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
}
