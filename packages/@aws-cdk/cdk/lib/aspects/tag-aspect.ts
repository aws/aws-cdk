import { ITaggable, Resource } from '../cloudformation/resource';
import { IConstruct } from '../core/construct';
import { Aspect } from './aspect';

export interface TagBaseProps extends TagProperties {
  /**
   * The value of the tag
   */
  value?: string;
}

export interface TagProperties {
  /**
   * This applies specifically to AutoScalingGroup PropagateAtLaunch
   */
  applyToLaunchInstances?: boolean;

  /**
   * An array of Resource Types that will receive this tag
   */
  include?: string[];

  /**
   * An array of Resource Types that will not receive this tag
   */
  exclude?: string[];
}

/**
 * The common functionality for Tag and Remove Tag Aspects
 */
export abstract class TagBase extends Aspect {

  /**
   * Test if the construct is a CloudFormation Resource
   */
  public static isResource(resource: any): resource is Resource {
    return resource.resourceType !== undefined;
  }

  /**
   * The ``taggable`` type for these aspects
   */
  public readonly type: string = 'taggable';

  /**
   * The string key for the tag
   */
  public readonly key: string;

  /**
   * The string value of the tag
   */
  public readonly value?: string;

  private readonly include: string[];
  private readonly exclude: string[];

  constructor(key: string, props: TagBaseProps = {}) {
    super();
    this.key = key;

    this.value = props.value;
    this.include = props.include || [];
    this.exclude = props.exclude || [];
  }

  protected visitAction(construct: IConstruct): void {
    if (!TagBase.isResource(construct)) {
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

  private readonly applyToLaunchInstances: boolean;

  constructor(key: string, value: string, props: TagProperties = {}) {
    super(key, {value, ...props});
    this.applyToLaunchInstances = props.applyToLaunchInstances !== false;
    if (this.value === undefined) {
      throw new Error('Tag must have a value');
    }
  }

  protected applyTag(resource: ITaggable) {
    resource.tags.setTag(this.key, this.value!, {applyToLaunchInstances: this.applyToLaunchInstances});
  }
}

/**
 * The RemoveTag Aspect will handle removing tags from this node and children
 */
export class RemoveTag extends TagBase {

  constructor(key: string, props: TagProperties = {}) {
    super(key, props);
  }

  protected applyTag(resource: ITaggable): void {
    resource.tags.removeTag(this.key);
    return;
  }
}
