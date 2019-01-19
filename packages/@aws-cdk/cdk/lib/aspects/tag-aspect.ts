import { ITaggable, Resource } from '../cloudformation/resource';
import { IConstruct } from '../core/construct';
import { AspectVisitType, IAspect } from './aspect';

export interface TagAspectProps {
  /**
   * This applies specifically to AutoScalingGroup PropagateAtLaunch
   */
  applyToLaunchInstances?: boolean;

  /**
   * An array of Resource Types that will receive this tag
   *
   * An empty array will match any Resource. A non-empty array will apply this
   * tag only to Resource types that are included in this array.
   * @default []
   */
  include?: string[];

  /**
   * An array of Resource Types that will not receive this tag
   *
   * An empty array will allow this tag to be applied to all resources. A
   * non-empty array will apply this tag only if the Resource type is not in
   * this array.
   * @default []
   */
  exclude?: string[];
}

/**
 * The common functionality for Tag and Remove Tag Aspects
 */
export abstract class TagBase implements IAspect {

  /**
   * The string key for the tag
   */
  public readonly key: string;

  public readonly visitType: AspectVisitType = AspectVisitType.Single;
  private readonly include: string[];
  private readonly exclude: string[];

  constructor(key: string, props: TagAspectProps = {}) {
    this.key = key;

    this.include = props.include || [];
    this.exclude = props.exclude || [];
  }

  public visit(construct: IConstruct): void {
    if (!Resource.isResource(construct)) {
      return;
    }
    const resource = construct as Resource;
    if (Resource.isTaggable(resource)) {
      if (this.exclude.length !== 0 && this.exclude.indexOf(resource.resourceType) !== -1) {
        return;
      }
      if (this.include.length !== 0 && this.include.indexOf(resource.resourceType) === -1) {
        return;
      }
      this.applyTag(resource);
    }
  }

  protected abstract applyTag(resource: ITaggable): void;
}

/**
 * The Tag Aspect will handle adding a tag to this node and cascading tags to children
 */
export class Tag extends TagBase {

  /**
   * The string value of the tag
   */
  public readonly value: string;

  private readonly applyToLaunchInstances: boolean;

  constructor(key: string, value: string, props: TagAspectProps = {}) {
    super(key, {...props});
    this.applyToLaunchInstances = props.applyToLaunchInstances !== false;
    if (value === undefined) {
      throw new Error('Tag must have a value');
    }
    this.value = value;
  }

  protected applyTag(resource: ITaggable) {
    resource.tags.setTag(this.key, this.value!, {applyToLaunchInstances: this.applyToLaunchInstances});
  }
}

/**
 * The RemoveTag Aspect will handle removing tags from this node and children
 */
export class RemoveTag extends TagBase {

  constructor(key: string, props: TagAspectProps = {}) {
    super(key, props);
  }

  protected applyTag(resource: ITaggable): void {
    resource.tags.removeTag(this.key);
    return;
  }
}
