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
  applyToLaunchInstances: boolean;
}

/**
 * TagManager facilitates a common implementation of tagging for Constructs.
 */
export class TagManager {

  private readonly tags: Tags = {};

  constructor(private readonly tagType: TagType) { }

  /**
   * Adds the specified tag to the array of tags
   *
   * @param key The key value of the tag
   * @param value The value value of the tag
   * @param props A `TagProps` defaulted to applyToLaunchInstances true
   */
  public setTag(key: string, value: string, props: TagProps = {applyToLaunchInstances: true}): void {
    this.tags[key] = { value, props };
  }

  /**
   * Removes the specified tag from the array if it exists
   *
   * @param key The key of the tag to remove
   */
  public removeTag(key: string): void {
    delete this.tags[key];
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
            propagateAtLaunch: this.tags[key].props.applyToLaunchInstances}
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
}
