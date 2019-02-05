import { ITaggable, Resource } from '../cloudformation/resource';
import { IConstruct } from '../core/construct';
import { TagProps } from '../core/tag-manager';
import { IAspect } from './aspect';

/**
 * The common functionality for Tag and Remove Tag Aspects
 */
export abstract class TagBase implements IAspect {

  /**
   * The string key for the tag
   */
  public readonly key: string;

  protected readonly props: TagProps;

  constructor(key: string, props: TagProps = {}) {
    this.key = key;
    this.props = props;
  }

  public visit(construct: IConstruct): void {
    if (!Resource.isResource(construct)) {
      return;
    }
    const resource = construct as Resource;
    if (Resource.isTaggable(resource)) {
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

  constructor(key: string, value: string, props: TagProps = {}) {
    super(key, props);
    this.props.applyToLaunchedInstances = props.applyToLaunchedInstances !== false;
    this.props.priority = props.priority === undefined ? 0 : props.priority;
    if (value === undefined) {
      throw new Error('Tag must have a value');
    }
    this.value = value;
  }

  protected applyTag(resource: ITaggable) {
    resource.tags.setTag(this.key, this.value!, this.props);
  }
}

/**
 * The RemoveTag Aspect will handle removing tags from this node and children
 */
export class RemoveTag extends TagBase {

  constructor(key: string, props: TagProps = {}) {
    super(key, props);
    this.props.priority = props.priority === undefined ? 1 : props.priority;
  }

  protected applyTag(resource: ITaggable): void {
    resource.tags.removeTag(this.key, this.props);
    return;
  }
}
