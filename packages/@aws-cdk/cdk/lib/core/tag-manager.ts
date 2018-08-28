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

    constructor(private readonly parent: Construct, initialTags: Tags  = {}) {
        super();
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
            return parentTags;
        }

        const propOverwrite = filterTags(this._tags, {sticky: false});
        const nonOverwrite = filterTags(this._tags, {sticky: true});
        const ancestors = this.parent.ancestors();
        ancestors.push(this.parent);
        const tags = {...propOverwrite, ...propagatedTags(ancestors), ...nonOverwrite};
        for (const key of this.blockedTags) { delete tags[key]; }

        return Object.keys(tags).map( key => ({key, value: tags[key]}));
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
     */
    public removeTag(key: string, props: RemoveProps = {blockPropagate: true}): void {
        if (props.blockPropagate) {
            this.blockedTags.push(key);
        }
        delete this._tags[key];
    }

    /**
     * Retrieve all propagated tags from all ancestors
     *
     * This retrieves tags from parents but not local tags
     */
}
