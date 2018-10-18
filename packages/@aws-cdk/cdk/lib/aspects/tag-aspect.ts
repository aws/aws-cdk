import { ITaggable, Resource } from '../cloudformation/resource';
import { IConstruct } from '../core/construct';
import { Aspect } from './aspect';

export interface TagBaseProps extends TagProperties {
  // TODO docs
  value?: string;
}

export interface TagProperties {
  // TODO docs
  applyToLaunchInstances?: boolean;
  include?: string[];
  exclude?: string[];
}

export abstract class TagBase extends Aspect {

  public static isResource(resource: any): resource is Resource {
    return resource.resourceType !== undefined;
  }

  public readonly type: string = 'taggable';

  public readonly key: string;
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

export class RemoveTag extends TagBase {

  constructor(key: string, props: TagProperties = {}) {
    super(key, props);
  }

  protected applyTag(resource: ITaggable): void {
    resource.tags.removeTag(this.key);
    return;
  }
}
