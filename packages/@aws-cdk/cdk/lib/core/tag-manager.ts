import { Tag } from '../cloudformation/tag';
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
 * A an object of tags with value and properties
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
 * the `Construct` creates using `toCloudformation()` for lazy evaluations
 */
export class TagManager extends Token {

    public static readonly DEFAULT_TAG_PROPS: TagProps = {
        propagate: true,
        sticky: true,
        overwrite: true
    };

    /**
     * Checks if the object implements the `ITaggable` interface
     */
    public static isTaggable(taggable: ITaggable | any): taggable is ITaggable {
        return ((taggable as ITaggable).tags !== undefined);
    }

    /*
     * Internally tags will have properties set
     */
    private readonly _tags: FullTags = {};

    /*
     * Tags that will be reomved during `tags` method
     */
    private readonly blockedTags: string[] = [];

    constructor(private readonly parent: Construct, initialTags: Tags  = {}) {
        super();
        for (const key of Object.keys(initialTags)) {
            const tag = {value: initialTags[key],
                props: {propagate: true, sticky: true}};
            this._tags[key] = tag;
        }
    }

    /**
     * Converts the `tags` to a Token for use in lazy evaluation
     */
    public resolve(): any {
        return this.toArray();
    }

    /**
     * Adds the specified tag to the array of tags
     *
     * @param key The key value of the tag
     * @param value The value value of the tag
     * @param props A `TagProps` object for the tag @default `TagManager.DEFAULT_TAG_PROPS`
     */
    public setTag(key: string, value: string, tagProps: TagProps = {} ): void {
        const props = {...TagManager.DEFAULT_TAG_PROPS, ...tagProps};
        if (props.overwrite === false) {
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
     * Check that a key exists including known propagated tags
     *
     * This checks the tags known at the time method of invocation. If tags are
     * added or removed after this method is invoked the result can change.
     *
     * @param key The key of the tag to check existence
     */
    public hasTag(key: string): boolean {
        return this.tags[key] !== undefined;
    }

    /**
     * Returns tags that meet the criteria of the filter
     *
     * The function operates only tags local to this contsturct. The function
     * provides the ability to filter tags baseed on the `TagProps`.
     *
     * @param filter The tag props to filter tags
     */
    private filterTags(filter: TagProps = {}): Tags {
        const tags: Tags = {};
        Object.keys(this._tags).map( key => {
            let filterResult = true;
            const props: TagProps = this._tags[key].props || {};
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
                tags[key] = this._tags[key].value;
            }
        });
        return tags;
    }

    /**
     * Returns a deep copy of the tags object and current propagated tags
     *
     * This takes into account blockedTags and propagationOverride tags.
     */
    private get tags(): Tags {
        const propOverwrite = this.filterTags({sticky: false});
        const nonOverwrite = this.filterTags({sticky: true});
        const tags = {...propOverwrite, ...this.propagatedTags(), ...nonOverwrite};
        for (const key of this.blockedTags) { delete tags[key]; }
        return tags;
    }

    /**
     * Returns a deep copy of the tags as `Array<{key: string, value: any}>`
     */
    private toArray(): Tag[] {
        const tags = this.tags;
        return Object.keys(tags).map( key => ({key, value: tags[key]}));
    }

    /**
     * Retrieve all propagated tags from all ancestors
     *
     * This retrieves tags from parents but not local tags
     */
    private propagatedTags(): Tags {
        const tags: Tags = {};
        const ancestors: Construct[] = this.parent.ancestors();
        ancestors.push(this.parent);
        for (const ancestor of ancestors) {
            if (TagManager.isTaggable(ancestor)) {
                const tagsFrom = ancestor.tags.filterTags({propagate: true});
                Object.assign(tags, tagsFrom);
            }
        }
        return tags;
    }
}
