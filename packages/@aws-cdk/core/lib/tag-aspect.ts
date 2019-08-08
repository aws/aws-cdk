// import cxapi = require('@aws-cdk/cx-api');
import { IAspect } from './aspect';
import { Construct, IConstruct } from './construct';
import { ITaggable, TagManager } from './tag-manager';

/**
 * Properties for a tag
 */
export interface TagProps {
  /**
   * Whether the tag should be applied to instances in an AutoScalingGroup
   *
   * @default true
   */
  readonly applyToLaunchedInstances?: boolean;

  /**
   * An array of Resource Types that will not receive this tag
   *
   * An empty array will allow this tag to be applied to all resources. A
   * non-empty array will apply this tag only if the Resource type is not in
   * this array.
   * @default []
   */
  readonly excludeResourceTypes?: string[];

  /**
   * An array of Resource Types that will receive this tag
   *
   * An empty array will match any Resource. A non-empty array will apply this
   * tag only to Resource types that are included in this array.
   * @default []
   */
  readonly includeResourceTypes?: string[];

  /**
   * Priority of the tag operation
   *
   * Higher or equal priority tags will take precedence.
   *
   * Setting priority will enable the user to control tags when they need to not
   * follow the default precedence pattern of last applied and closest to the
   * construct in the tree.
   *
   * @default
   *
   * Default priorities:
   *
   * - 100 for {@link SetTag}
   * - 200 for {@link RemoveTag}
   * - 50 for tags added directly to CloudFormation resources
   *
   */
  readonly priority?: number;
}

/**
 * The common functionality for Tag and Remove Tag Aspects
 */
abstract class TagBase implements IAspect {

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
    if (TagManager.isTaggable(construct)) {
        this.applyTag(construct);
    }
  }

  protected abstract applyTag(resource: ITaggable): void;
}

/**
 * The Tag Aspect will handle adding a tag to this node and cascading tags to children
 */
export class Tag extends TagBase {

  /**
   * add tags to the node of a construct and all its the taggable children
   */
  public static add(scope: Construct, key: string, value: string, props: TagProps = {}) {
    scope.node.applyAspect(new Tag(key, value, props));
  }

  /**
   * remove tags to the node of a construct and all its the taggable children
   */
  public static remove(scope: Construct, key: string, props: TagProps = {}) {
    scope.node.applyAspect(new RemoveTag(key, props));
  }

  /**
   * The string value of the tag
   */
  public readonly value: string;

  private readonly defaultPriority = 100;

  constructor(key: string, value: string, props: TagProps = {}) {
    super(key, props);
    if (value === undefined) {
      throw new Error('Tag must have a value');
    }
    this.value = value;
  }

  protected applyTag(resource: ITaggable) {
    if (resource.tags.applyTagAspectHere(this.props.includeResourceTypes, this.props.excludeResourceTypes)) {
      resource.tags.setTag(
        this.key,
        this.value,
        this.props.priority !== undefined ? this.props.priority : this.defaultPriority,
        this.props.applyToLaunchedInstances !== false
      );
    }
  }
}

/**
 * The RemoveTag Aspect will handle removing tags from this node and children
 */
export class RemoveTag extends TagBase {

  private readonly defaultPriority = 200;

  constructor(key: string, props: TagProps = {}) {
    super(key, props);
  }

  protected applyTag(resource: ITaggable): void {
    if (resource.tags.applyTagAspectHere(this.props.includeResourceTypes, this.props.excludeResourceTypes)) {
      resource.tags.removeTag(this.key, this.props.priority !== undefined ? this.props.priority : this.defaultPriority);
    }
  }
}
