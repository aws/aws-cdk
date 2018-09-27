import { Construct } from './construct';
import { Token } from './tokens';

/**
 * ITaggable indicates a entity manages tags via the `tags` property
 */
export interface ITaggable {
  readonly tags: TagManager,
}

/**
 * Properties Tags is a dictionary of tags as strings
 */
export type Tags = { [key: string]: string };

/**
 * An object of tags with value and properties
 *
 * This is used internally but not exported
 */
interface FullTags {
  [key: string]: {value: string, props?: TagProps};
}

/**
 * Properties for a tag
 */
export interface TagProps {
  /**
   * If true all child taggable `Constructs` will receive this tag
   *
   * @default true
   */
  propagate?: boolean;

  /**
   * If set propagated tags from parents will not overwrite the tag
   *
   * @default true
   */
  sticky?: boolean;

  /**
   * If set this tag will overwrite existing tags
   *
   * @default true
   */
  overwrite?: boolean;
}

/**
 * This is the interface for arguments to `tagFormatResolve` to enable extensions
 */
export interface TagGroups {
  /**
   * Tags that overwrite ancestor tags
   */
  stickyTags: Tags;

  /**
   * Tags that are overwritten by ancestor tags
   */
  nonStickyTags: Tags;

  /**
   * Tags with propagate true not from an ancestor
   */
  propagateTags: Tags;

  /**
   * Tags that are propagated from ancestors
   */
  ancestorTags: Tags;
}

/**
 * Properties for removing tags
 */
export interface RemoveProps {
  /**
   * If true prevent this tag form being set via propagation
   *
   * @default true
   */
  blockPropagate?: boolean;
}

/**
 * Properties for Tag Manager
 */
export interface TagManagerProps {
  /**
   * Initial tags to set on the tag manager using TAG_DEFAULTS
   */
  initialTags?: Tags;
}

/**
 * TagManager facilitates a common implementation of tagging for Constructs.
 *
 * Each construct that wants to support tags should implement the `ITaggable`
 * interface and properly pass tags to the `Resources` (Cloudformation) elements
 * the `Construct` creates. The `TagManager` extends `Token` the object can be
 * passed directly to `Resources` that support tag properties.
 *
 * There are a few standard use cases the `TagManager` supports for managing
 * tags across the resources in your stack.
 *
 * Propagation: If you tag a resource and it has children, by default those tags
 * will be propagated to the children. This is controlled by
 * `TagProps.propagate`.
 *
 * Default a tag unless an ancestor has a value: There are situations where a
 * construct author might want to set a tag value, but choose to take a parents
 * value. For example, you might default `{Key: "Compliance", Value: "None"}`,
 * but if a parent has `{Key: "Compliance", Value: "PCI"}` allow that parent to
 * override your tag. This is can be done by setting `TagProps.sticky` to false.
 * The default behavior is that child tags have precedence and `TagProps.sticky`
 * defaults to true to reflect this.
 *
 * Overwrite: Construct authors have the need to set a tag, but only if one was
 * not provided by the consumer. The most common example is the `Name` tag.
 * Overwrite is for this purpose and is controlled by `TagProps.overwrite`. The
 * default is `true`.
 *
 * Removing Tags: Tags can be removed from the local manager via `removeTag`. If
 * a parent also has a tag with the same name then it can be propagated to the
 * child (after removal). The user can control this `RemoveProps.blockPropagate`. By default
 * this is `true` and prevents a parent tag from propagating to the child after
 * the `removeTag` is invoked. However, if user wants the parent tag to
 * propagate, if it is provided by a parent this can be set to `false`.
 */
export class TagManager extends Token {

  /**
   * Checks if the object implements the `ITaggable` interface
   */
  public static isTaggable(taggable: ITaggable | any): taggable is ITaggable {
    return ((taggable as ITaggable).tags !== undefined);
  }

  private static readonly DEFAULT_TAG_PROPS: TagProps = {
    propagate: true,
    sticky: true,
    overwrite: true
  };

  /*
   * Internally tags will have properties set
   */
  private readonly _tags: FullTags = {};

  /*
   * Tags that will be removed during `tags` method
   */
  private readonly blockedTags: string[] = [];

  constructor(private readonly parent: Construct, props: TagManagerProps  = {}) {
    super();

    const initialTags = props.initialTags || {};
    for (const key of Object.keys(initialTags)) {
      const tag = {
        value: initialTags[key],
        props: TagManager.DEFAULT_TAG_PROPS,
      };
      this._tags[key] = tag;
    }
  }

  /**
   * Converts the `tags` to a Token for use in lazy evaluation
   */
  public resolve(): any {
    // need this for scoping
    const blockedTags = this.blockedTags;
    function filterTags(_tags: FullTags, filter: TagProps = {}): Tags {
      const filteredTags: Tags = {};
      Object.keys(_tags).map( key => {
        let filterResult = true;
        const props: TagProps = _tags[key].props || {};
        if (filter.propagate !== undefined) {
          filterResult = filterResult && (filter.propagate === props.propagate);
        }
        if (filter.sticky !== undefined) {
          filterResult = filterResult &&
            (filter.sticky === props.sticky);
        }
        if (filter.overwrite !== undefined) {
          filterResult = filterResult && (filter.overwrite === props.overwrite);
        }
        if (filterResult) {
          filteredTags[key] = _tags[key].value;
        }
      });
      for (const key of blockedTags) { delete filteredTags[key]; }
      return filteredTags;
    }

    function propagatedTags(tagProviders: Construct[]): Tags {
      const parentTags: Tags = {};
      for (const ancestor of tagProviders) {
        if (TagManager.isTaggable(ancestor)) {
          const tagsFrom = filterTags(ancestor.tags._tags, {propagate: true});
          Object.assign(parentTags, tagsFrom);
        }
      }
      for (const key of blockedTags) { delete parentTags[key]; }
      return parentTags;
    }

    const nonStickyTags = filterTags(this._tags, {sticky: false});
    const stickyTags = filterTags(this._tags, {sticky: true});
    const ancestors = this.parent.ancestors();
    const ancestorTags = propagatedTags(ancestors);
    const propagateTags = filterTags(this._tags, {propagate: true});
    return this.tagFormatResolve( {
      ancestorTags,
      nonStickyTags,
      stickyTags,
      propagateTags,
    });
  }

  /**
   * Adds the specified tag to the array of tags
   *
   * @param key The key value of the tag
   * @param value The value value of the tag
   * @param props A `TagProps` object for the tag @default `TagManager.DEFAULT_TAG_PROPS`
   */
  public setTag(key: string, value: string, tagProps: TagProps = {}): void {
    const props = {...TagManager.DEFAULT_TAG_PROPS, ...tagProps};
    if (!props.overwrite) {
      this._tags[key] = this._tags[key] || {value, props};
    } else {
      this._tags[key] = {value, props};
    }
    const index = this.blockedTags.indexOf(key);
    if (index > -1) {
      this.blockedTags.splice(index, 1);
    }
  }

  /**
   * Removes the specified tag from the array if it exists
   *
   * @param key The key of the tag to remove
   * @param props The `RemoveProps` for the tag
   */
  public removeTag(key: string, props: RemoveProps = {blockPropagate: true}): void {
    if (props.blockPropagate) {
      this.blockedTags.push(key);
    }
    delete this._tags[key];
  }

  /**
   * Handles returning the tags in the desired format
   *
   * This function can be overridden to support another tag format. This was
   * specifically designed to enable AutoScalingGroup Tags that have an
   * additional CloudFormation key for `PropagateAtLaunch`
   */
  protected tagFormatResolve(tagGroups: TagGroups): any {
    const tags = {...tagGroups.nonStickyTags, ...tagGroups.ancestorTags, ...tagGroups.stickyTags};
    for (const key of this.blockedTags) { delete tags[key]; }
    return Object.keys(tags).map( key => ({key, value: tags[key]}));
  }
}
