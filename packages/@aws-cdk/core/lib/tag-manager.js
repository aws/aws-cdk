"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TagManager = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const cfn_resource_1 = require("./cfn-resource");
const lazy_1 = require("./lazy");
/**
 * Standard tags are a list of { key, value } objects
 */
class StandardFormatter {
    parseTags(cfnPropertyTags, priority) {
        if (!Array.isArray(cfnPropertyTags)) {
            throw new Error(`Invalid tag input expected array of {key, value} have ${JSON.stringify(cfnPropertyTags)}`);
        }
        const tags = [];
        const dynamicTags = [];
        for (const tag of cfnPropertyTags) {
            if (tag.key === undefined || tag.value === undefined) {
                dynamicTags.push(tag);
            }
            else {
                // using interp to ensure Token is now string
                tags.push({
                    key: `${tag.key}`,
                    value: `${tag.value}`,
                    priority,
                });
            }
        }
        return { tags, dynamicTags };
    }
    formatTags(tags) {
        const cfnTags = [];
        for (const tag of tags) {
            cfnTags.push({
                key: tag.key,
                value: tag.value,
            });
        }
        return cfnTags;
    }
}
/**
 * ASG tags are a list of { key, value, propagateAtLaunch } objects
 */
class AsgFormatter {
    parseTags(cfnPropertyTags, priority) {
        if (!Array.isArray(cfnPropertyTags)) {
            throw new Error(`Invalid tag input expected array of {key, value, propagateAtLaunch} have ${JSON.stringify(cfnPropertyTags)}`);
        }
        const tags = [];
        const dynamicTags = [];
        for (const tag of cfnPropertyTags) {
            if (tag.key === undefined ||
                tag.value === undefined ||
                tag.propagateAtLaunch === undefined) {
                dynamicTags.push(tag);
            }
            else {
                // using interp to ensure Token is now string
                tags.push({
                    key: `${tag.key}`,
                    value: `${tag.value}`,
                    priority,
                    applyToLaunchedInstances: !!tag.propagateAtLaunch,
                });
            }
        }
        return { tags, dynamicTags };
    }
    formatTags(tags) {
        const cfnTags = [];
        for (const tag of tags) {
            cfnTags.push({
                key: tag.key,
                value: tag.value,
                propagateAtLaunch: tag.applyToLaunchedInstances !== false,
            });
        }
        return cfnTags;
    }
}
/**
 * Some CloudFormation constructs use a { key: value } map for tags
 */
class MapFormatter {
    parseTags(cfnPropertyTags, priority) {
        if (Array.isArray(cfnPropertyTags) || typeof (cfnPropertyTags) !== 'object') {
            throw new Error(`Invalid tag input expected map of {key: value} have ${JSON.stringify(cfnPropertyTags)}`);
        }
        const tags = [];
        for (const [key, value] of Object.entries(cfnPropertyTags)) {
            tags.push({
                key,
                value: `${value}`,
                priority,
            });
        }
        return { tags, dynamicTags: undefined };
    }
    formatTags(tags) {
        const cfnTags = {};
        for (const tag of tags) {
            cfnTags[`${tag.key}`] = `${tag.value}`;
        }
        return cfnTags;
    }
}
/**
 * StackTags are of the format { Key: key, Value: value }
 */
class KeyValueFormatter {
    parseTags(keyValueTags, priority) {
        const tags = [];
        for (const key in keyValueTags) {
            if (keyValueTags.hasOwnProperty(key)) {
                const value = keyValueTags[key];
                tags.push({
                    key,
                    value,
                    priority,
                });
            }
        }
        return { tags, dynamicTags: undefined };
    }
    formatTags(unformattedTags) {
        const tags = [];
        unformattedTags.forEach(tag => {
            tags.push({
                Key: tag.key,
                Value: tag.value,
            });
        });
        return tags;
    }
}
class NoFormat {
    parseTags(_cfnPropertyTags) {
        return { tags: [], dynamicTags: undefined };
    }
    formatTags(_tags) {
        return undefined;
    }
}
let _tagFormattersCache;
/**
 * Access tag formatters table
 *
 * In a function because we're in a load cycle with cfn-resource that defines `TagType`.
 */
function TAG_FORMATTERS() {
    return _tagFormattersCache ?? (_tagFormattersCache = {
        [cfn_resource_1.TagType.AUTOSCALING_GROUP]: new AsgFormatter(),
        [cfn_resource_1.TagType.STANDARD]: new StandardFormatter(),
        [cfn_resource_1.TagType.MAP]: new MapFormatter(),
        [cfn_resource_1.TagType.KEY_VALUE]: new KeyValueFormatter(),
        [cfn_resource_1.TagType.NOT_TAGGABLE]: new NoFormat(),
    });
}
/**
 * TagManager facilitates a common implementation of tagging for Constructs
 *
 * Normally, you do not need to use this class, as the CloudFormation specification
 * will indicate which resources are taggable. However, sometimes you will need this
 * to make custom resources taggable. Used `tagManager.renderedTags` to obtain a
 * value that will resolve to the tags at synthesis time.
 *
 * @example
 * import * as cdk from '@aws-cdk/core';
 *
 * class MyConstruct extends cdk.Resource implements cdk.ITaggable {
 *   public readonly tags = new cdk.TagManager(cdk.TagType.KEY_VALUE, 'Whatever::The::Type');
 *
 *   constructor(scope: cdk.Construct, id: string) {
 *     super(scope, id);
 *
 *     new cdk.CfnResource(this, 'Resource', {
 *       type: 'Whatever::The::Type',
 *       properties: {
 *         // ...
 *         Tags: this.tags.renderedTags,
 *       },
 *     });
 *   }
 * }
 *
 */
class TagManager {
    constructor(tagType, resourceTypeName, tagStructure, options = {}) {
        this.tags = new Map();
        this.priorities = new Map();
        this.initialTagPriority = 50;
        try {
            jsiiDeprecationWarnings._aws_cdk_core_TagType(tagType);
            jsiiDeprecationWarnings._aws_cdk_core_TagManagerOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, TagManager);
            }
            throw error;
        }
        this.resourceTypeName = resourceTypeName;
        this.tagFormatter = TAG_FORMATTERS()[tagType];
        if (tagStructure !== undefined) {
            const parseTagsResult = this.tagFormatter.parseTags(tagStructure, this.initialTagPriority);
            this.dynamicTags = parseTagsResult.dynamicTags;
            this._setTag(...parseTagsResult.tags);
        }
        this.tagPropertyName = options.tagPropertyName || 'tags';
        this.renderedTags = lazy_1.Lazy.any({ produce: () => this.renderTags() });
    }
    /**
     * Check whether the given construct is Taggable
     */
    static isTaggable(construct) {
        return construct.tags !== undefined;
    }
    /**
     * Adds the specified tag to the array of tags
     *
     */
    setTag(key, value, priority = 0, applyToLaunchedInstances = true) {
        // This method mostly exists because we don't want to expose the 'Tag' type used (it will be confusing
        // to users).
        this._setTag({ key, value, priority, applyToLaunchedInstances });
    }
    /**
     * Removes the specified tag from the array if it exists
     *
     * @param key The tag to remove
     * @param priority The priority of the remove operation
     */
    removeTag(key, priority) {
        if (priority >= (this.priorities.get(key) || 0)) {
            this.tags.delete(key);
            this.priorities.set(key, priority);
        }
    }
    /**
     * Renders tags into the proper format based on TagType
     *
     * This method will eagerly render the tags currently applied. In
     * most cases, you should be using `tagManager.renderedTags` instead,
     * which will return a `Lazy` value that will resolve to the correct
     * tags at synthesis time.
     */
    renderTags() {
        const formattedTags = this.tagFormatter.formatTags(this.sortedTags);
        if (Array.isArray(formattedTags) || Array.isArray(this.dynamicTags)) {
            const ret = [...formattedTags ?? [], ...this.dynamicTags ?? []];
            return ret.length > 0 ? ret : undefined;
        }
        else {
            const ret = { ...formattedTags ?? {}, ...this.dynamicTags ?? {} };
            return Object.keys(ret).length > 0 ? ret : undefined;
        }
    }
    /**
     * Render the tags in a readable format
     */
    tagValues() {
        const ret = {};
        for (const tag of this.sortedTags) {
            ret[tag.key] = tag.value;
        }
        return ret;
    }
    /**
     * Determine if the aspect applies here
     *
     * Looks at the include and exclude resourceTypeName arrays to determine if
     * the aspect applies here
     */
    applyTagAspectHere(include, exclude) {
        if (exclude && exclude.length > 0 && exclude.indexOf(this.resourceTypeName) !== -1) {
            return false;
        }
        if (include && include.length > 0 && include.indexOf(this.resourceTypeName) === -1) {
            return false;
        }
        return true;
    }
    /**
     * Returns true if there are any tags defined
     */
    hasTags() {
        return this.tags.size > 0;
    }
    _setTag(...tags) {
        for (const tag of tags) {
            if (tag.priority >= (this.priorities.get(tag.key) || 0)) {
                this.tags.set(tag.key, tag);
                this.priorities.set(tag.key, tag.priority);
            }
        }
    }
    get sortedTags() {
        return Array.from(this.tags.values())
            .sort((a, b) => a.key.localeCompare(b.key));
    }
}
exports.TagManager = TagManager;
_a = JSII_RTTI_SYMBOL_1;
TagManager[_a] = { fqn: "@aws-cdk/core.TagManager", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFnLW1hbmFnZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ0YWctbWFuYWdlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxpREFBeUM7QUFFekMsaUNBQThCO0FBMkQ5Qjs7R0FFRztBQUNILE1BQU0saUJBQWlCO0lBQ2QsU0FBUyxDQUFDLGVBQW9CLEVBQUUsUUFBZ0I7UUFDckQsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsZUFBZSxDQUFDLEVBQUU7WUFDbkMsTUFBTSxJQUFJLEtBQUssQ0FBQyx5REFBeUQsSUFBSSxDQUFDLFNBQVMsQ0FBQyxlQUFlLENBQUMsRUFBRSxDQUFDLENBQUM7U0FDN0c7UUFFRCxNQUFNLElBQUksR0FBVSxFQUFFLENBQUM7UUFDdkIsTUFBTSxXQUFXLEdBQVEsRUFBRSxDQUFDO1FBQzVCLEtBQUssTUFBTSxHQUFHLElBQUksZUFBZSxFQUFFO1lBQ2pDLElBQUksR0FBRyxDQUFDLEdBQUcsS0FBSyxTQUFTLElBQUksR0FBRyxDQUFDLEtBQUssS0FBSyxTQUFTLEVBQUU7Z0JBQ3BELFdBQVcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7YUFDdkI7aUJBQU07Z0JBQ0wsNkNBQTZDO2dCQUM3QyxJQUFJLENBQUMsSUFBSSxDQUFDO29CQUNSLEdBQUcsRUFBRSxHQUFHLEdBQUcsQ0FBQyxHQUFHLEVBQUU7b0JBQ2pCLEtBQUssRUFBRSxHQUFHLEdBQUcsQ0FBQyxLQUFLLEVBQUU7b0JBQ3JCLFFBQVE7aUJBQ1QsQ0FBQyxDQUFDO2FBQ0o7U0FDRjtRQUNELE9BQU8sRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFLENBQUM7S0FDOUI7SUFFTSxVQUFVLENBQUMsSUFBVztRQUMzQixNQUFNLE9BQU8sR0FBYSxFQUFFLENBQUM7UUFDN0IsS0FBSyxNQUFNLEdBQUcsSUFBSSxJQUFJLEVBQUU7WUFDdEIsT0FBTyxDQUFDLElBQUksQ0FBQztnQkFDWCxHQUFHLEVBQUUsR0FBRyxDQUFD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SUFBVztRQUM1QixLQUFLLE1BQU0sR0FBRyxJQUFJLElBQUksRUFBRTtZQUN0QixJQUFJLEdBQUcsQ0FBQyxRQUFRLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUU7Z0JBQ3ZELElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7Z0JBQzVCLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO2FBQzVDO1NBQ0Y7S0FDRjtJQUVELElBQVksVUFBVTtRQUNwQixPQUFPLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQzthQUNsQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztLQUMvQzs7QUFySUgsZ0NBc0lDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgVGFnVHlwZSB9IGZyb20gJy4vY2ZuLXJlc291cmNlJztcbmltcG9ydCB7IENmblRhZyB9IGZyb20gJy4vY2ZuLXRhZyc7XG5pbXBvcnQgeyBMYXp5IH0gZnJvbSAnLi9sYXp5JztcbmltcG9ydCB7IElSZXNvbHZhYmxlIH0gZnJvbSAnLi9yZXNvbHZhYmxlJztcblxuaW50ZXJmYWNlIFRhZyB7XG4gIGtleTogc3RyaW5nO1xuICB2YWx1ZTogc3RyaW5nO1xuICBwcmlvcml0eTogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBAZGVmYXVsdCB0cnVlXG4gICAqL1xuICBhcHBseVRvTGF1bmNoZWRJbnN0YW5jZXM/OiBib29sZWFuO1xufVxuXG5pbnRlcmZhY2UgQ2ZuQXNnVGFnIHtcbiAga2V5OiBzdHJpbmc7XG4gIHZhbHVlOiBzdHJpbmc7XG4gIHByb3BhZ2F0ZUF0TGF1bmNoOiBib29sZWFuO1xufVxuXG5pbnRlcmZhY2UgU3RhY2tUYWcge1xuICBLZXk6IHN0cmluZztcbiAgVmFsdWU6IHN0cmluZztcbn1cblxuLyoqXG4gKiBUaGUgcmVzdWx0cyBvZiBwYXJzaW5nIFRhZ3MuXG4gKi9cbmludGVyZmFjZSBQYXJzZVRhZ3NSZXN1bHQge1xuICAvKipcbiAgICogVGhlIFwic2ltcGxlXCIgKG1lYW5pbmcsIG5vdCBpbmNsdWRpbmcgY29tcGxleCBDbG91ZEZvcm1hdGlvbiBmdW5jdGlvbnMpXG4gICAqIHRhZ3MgdGhhdCB3ZXJlIGZvdW5kLlxuICAgKi9cbiAgcmVhZG9ubHkgdGFnczogVGFnW107XG5cbiAgLyoqXG4gICAqIFRoZSBjb2xsZWN0aW9uIG9mIFwiZHluYW1pY1wiIChtZWFuaW5nLCBpbmNsdWRpbmcgY29tcGxleCBDbG91ZEZvcm1hdGlvbiBmdW5jdGlvbnMpXG4gICAqIHRhZ3MgdGhhdCB3ZXJlIGZvdW5kLlxuICAgKi9cbiAgcmVhZG9ubHkgZHluYW1pY1RhZ3M6IGFueTtcbn1cblxuLyoqXG4gKiBJbnRlcmZhY2UgZm9yIGNvbnZlcnRlciBiZXR3ZWVuIENsb3VkRm9ybWF0aW9uIGFuZCBpbnRlcm5hbCB0YWcgcmVwcmVzZW50YXRpb25zXG4gKi9cbmludGVyZmFjZSBJVGFnRm9ybWF0dGVyIHtcbiAgLyoqXG4gICAqIEZvcm1hdCB0aGUgZ2l2ZW4gdGFncyBhcyBDbG91ZEZvcm1hdGlvbiB0YWdzXG4gICAqL1xuICBmb3JtYXRUYWdzKHRhZ3M6IFRhZ1tdKTogYW55O1xuXG4gIC8qKlxuICAgKiBQYXJzZSB0aGUgQ2xvdWRGb3JtYXRpb24gdGFnIHJlcHJlc2VudGF0aW9uIGludG8gaW50ZXJuYWwgcmVwcmVzZW50YXRpb25cbiAgICpcbiAgICogVXNlIHRoZSBnaXZlbiBwcmlvcml0eS5cbiAgICovXG4gIHBhcnNlVGFncyhjZm5Qcm9wZXJ0eVRhZ3M6IGFueSwgcHJpb3JpdHk6IG51bWJlcik6IFBhcnNlVGFnc1Jlc3VsdDtcbn1cblxuLyoqXG4gKiBTdGFuZGFyZCB0YWdzIGFyZSBhIGxpc3Qgb2YgeyBrZXksIHZhbHVlIH0gb2JqZWN0c1xuICovXG5jbGFzcyBTdGFuZGFyZEZvcm1hdHRlciBpbXBsZW1lbnRzIElUYWdGb3JtYXR0ZXIge1xuICBwdWJsaWMgcGFyc2VUYWdzKGNmblByb3BlcnR5VGFnczogYW55LCBwcmlvcml0eTogbnVtYmVyKTogUGFyc2VUYWdzUmVzdWx0IHtcbiAgICBpZiAoIUFycmF5LmlzQXJyYXkoY2ZuUHJvcGVydHlUYWdzKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIHRhZyBpbnB1dCBleHBlY3RlZCBhcnJheSBvZiB7a2V5LCB2YWx1ZX0gaGF2ZSAke0pTT04uc3RyaW5naWZ5KGNmblByb3BlcnR5VGFncyl9YCk7XG4gICAgfVxuXG4gICAgY29uc3QgdGFnczogVGFnW10gPSBbXTtcbiAgICBjb25zdCBkeW5hbWljVGFnczogYW55ID0gW107XG4gICAgZm9yIChjb25zdCB0YWcgb2YgY2ZuUHJvcGVydHlUYWdzKSB7XG4gICAgICBpZiAodGFnLmtleSA9PT0gdW5kZWZpbmVkIHx8IHRhZy52YWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGR5bmFtaWNUYWdzLnB1c2godGFnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIHVzaW5nIGludGVycCB0byBlbnN1cmUgVG9rZW4gaXMgbm93IHN0cmluZ1xuICAgICAgICB0YWdzLnB1c2goe1xuICAgICAgICAgIGtleTogYCR7dGFnLmtleX1gLFxuICAgICAgICAgIHZhbHVlOiBgJHt0YWcudmFsdWV9YCxcbiAgICAgICAgICBwcmlvcml0eSxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB7IHRhZ3MsIGR5bmFtaWNUYWdzIH07XG4gIH1cblxuICBwdWJsaWMgZm9ybWF0VGFncyh0YWdzOiBUYWdbXSk6IGFueSB7XG4gICAgY29uc3QgY2ZuVGFnczogQ2ZuVGFnW10gPSBbXTtcbiAgICBmb3IgKGNvbnN0IHRhZyBvZiB0YWdzKSB7XG4gICAgICBjZm5UYWdzLnB1c2goe1xuICAgICAgICBrZXk6IHRhZy5rZXksXG4gICAgICAgIHZhbHVlOiB0YWcudmFsdWUsXG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIGNmblRhZ3M7XG4gIH1cbn1cblxuLyoqXG4gKiBBU0cgdGFncyBhcmUgYSBsaXN0IG9mIHsga2V5LCB2YWx1ZSwgcHJvcGFnYXRlQXRMYXVuY2ggfSBvYmplY3RzXG4gKi9cbmNsYXNzIEFzZ0Zvcm1hdHRlciBpbXBsZW1lbnRzIElUYWdGb3JtYXR0ZXIge1xuICBwdWJsaWMgcGFyc2VUYWdzKGNmblByb3BlcnR5VGFnczogYW55LCBwcmlvcml0eTogbnVtYmVyKTogUGFyc2VUYWdzUmVzdWx0IHtcbiAgICBpZiAoIUFycmF5LmlzQXJyYXkoY2ZuUHJvcGVydHlUYWdzKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIHRhZyBpbnB1dCBleHBlY3RlZCBhcnJheSBvZiB7a2V5LCB2YWx1ZSwgcHJvcGFnYXRlQXRMYXVuY2h9IGhhdmUgJHtKU09OLnN0cmluZ2lmeShjZm5Qcm9wZXJ0eVRhZ3MpfWApO1xuICAgIH1cblxuICAgIGNvbnN0IHRhZ3M6IFRhZ1tdID0gW107XG4gICAgY29uc3QgZHluYW1pY1RhZ3M6IGFueSA9IFtdO1xuICAgIGZvciAoY29uc3QgdGFnIG9mIGNmblByb3BlcnR5VGFncykge1xuICAgICAgaWYgKHRhZy5rZXkgPT09IHVuZGVmaW5lZCB8fFxuICAgICAgICAgIHRhZy52YWx1ZSA9PT0gdW5kZWZpbmVkIHx8XG4gICAgICAgICAgdGFnLnByb3BhZ2F0ZUF0TGF1bmNoID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgZHluYW1pY1RhZ3MucHVzaCh0YWcpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gdXNpbmcgaW50ZXJwIHRvIGVuc3VyZSBUb2tlbiBpcyBub3cgc3RyaW5nXG4gICAgICAgIHRhZ3MucHVzaCh7XG4gICAgICAgICAga2V5OiBgJHt0YWcua2V5fWAsXG4gICAgICAgICAgdmFsdWU6IGAke3RhZy52YWx1ZX1gLFxuICAgICAgICAgIHByaW9yaXR5LFxuICAgICAgICAgIGFwcGx5VG9MYXVuY2hlZEluc3RhbmNlczogISF0YWcucHJvcGFnYXRlQXRMYXVuY2gsXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB7IHRhZ3MsIGR5bmFtaWNUYWdzIH07XG4gIH1cblxuICBwdWJsaWMgZm9ybWF0VGFncyh0YWdzOiBUYWdbXSk6IGFueSB7XG4gICAgY29uc3QgY2ZuVGFnczogQ2ZuQXNnVGFnW10gPSBbXTtcbiAgICBmb3IgKGNvbnN0IHRhZyBvZiB0YWdzKSB7XG4gICAgICBjZm5UYWdzLnB1c2goe1xuICAgICAgICBrZXk6IHRhZy5rZXksXG4gICAgICAgIHZhbHVlOiB0YWcudmFsdWUsXG4gICAgICAgIHByb3BhZ2F0ZUF0TGF1bmNoOiB0YWcuYXBwbHlUb0xhdW5jaGVkSW5zdGFuY2VzICE9PSBmYWxzZSxcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gY2ZuVGFncztcbiAgfVxufVxuXG4vKipcbiAqIFNvbWUgQ2xvdWRGb3JtYXRpb24gY29uc3RydWN0cyB1c2UgYSB7IGtleTogdmFsdWUgfSBtYXAgZm9yIHRhZ3NcbiAqL1xuY2xhc3MgTWFwRm9ybWF0dGVyIGltcGxlbWVudHMgSVRhZ0Zvcm1hdHRlciB7XG4gIHB1YmxpYyBwYXJzZVRhZ3MoY2ZuUHJvcGVydHlUYWdzOiBhbnksIHByaW9yaXR5OiBudW1iZXIpOiBQYXJzZVRhZ3NSZXN1bHQge1xuICAgIGlmIChBcnJheS5pc0FycmF5KGNmblByb3BlcnR5VGFncykgfHwgdHlwZW9mKGNmblByb3BlcnR5VGFncykgIT09ICdvYmplY3QnKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgdGFnIGlucHV0IGV4cGVjdGVkIG1hcCBvZiB7a2V5OiB2YWx1ZX0gaGF2ZSAke0pTT04uc3RyaW5naWZ5KGNmblByb3BlcnR5VGFncyl9YCk7XG4gICAgfVxuXG4gICAgY29uc3QgdGFnczogVGFnW10gPSBbXTtcbiAgICBmb3IgKGNvbnN0IFtrZXksIHZhbHVlXSBvZiBPYmplY3QuZW50cmllcyhjZm5Qcm9wZXJ0eVRhZ3MpKSB7XG4gICAgICB0YWdzLnB1c2goe1xuICAgICAgICBrZXksXG4gICAgICAgIHZhbHVlOiBgJHt2YWx1ZX1gLFxuICAgICAgICBwcmlvcml0eSxcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiB7IHRhZ3MsIGR5bmFtaWNUYWdzOiB1bmRlZmluZWQgfTtcbiAgfVxuXG4gIHB1YmxpYyBmb3JtYXRUYWdzKHRhZ3M6IFRhZ1tdKTogYW55IHtcbiAgICBjb25zdCBjZm5UYWdzOiB7IFtrZXk6IHN0cmluZ106IHN0cmluZyB9ID0ge307XG4gICAgZm9yIChjb25zdCB0YWcgb2YgdGFncykge1xuICAgICAgY2ZuVGFnc1tgJHt0YWcua2V5fWBdID0gYCR7dGFnLnZhbHVlfWA7XG4gICAgfVxuICAgIHJldHVybiBjZm5UYWdzO1xuICB9XG59XG5cbi8qKlxuICogU3RhY2tUYWdzIGFyZSBvZiB0aGUgZm9ybWF0IHsgS2V5OiBrZXksIFZhbHVlOiB2YWx1ZSB9XG4gKi9cbmNsYXNzIEtleVZhbHVlRm9ybWF0dGVyIGltcGxlbWVudHMgSVRhZ0Zvcm1hdHRlciB7XG4gIHB1YmxpYyBwYXJzZVRhZ3Moa2V5VmFsdWVUYWdzOiBhbnksIHByaW9yaXR5OiBudW1iZXIpOiBQYXJzZVRhZ3NSZXN1bHQge1xuICAgIGNvbnN0IHRhZ3M6IFRhZ1tdID0gW107XG4gICAgZm9yIChjb25zdCBrZXkgaW4ga2V5VmFsdWVUYWdzKSB7XG4gICAgICBpZiAoa2V5VmFsdWVUYWdzLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgY29uc3QgdmFsdWUgPSBrZXlWYWx1ZVRhZ3Nba2V5XTtcbiAgICAgICAgdGFncy5wdXNoKHtcbiAgICAgICAgICBrZXksXG4gICAgICAgICAgdmFsdWUsXG4gICAgICAgICAgcHJpb3JpdHksXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4geyB0YWdzLCBkeW5hbWljVGFnczogdW5kZWZpbmVkIH07XG4gIH1cblxuICBwdWJsaWMgZm9ybWF0VGFncyh1bmZvcm1hdHRlZFRhZ3M6IFRhZ1tdKTogYW55IHtcbiAgICBjb25zdCB0YWdzOiBTdGFja1RhZ1tdID0gW107XG4gICAgdW5mb3JtYXR0ZWRUYWdzLmZvckVhY2godGFnID0+IHtcbiAgICAgIHRhZ3MucHVzaCh7XG4gICAgICAgIEtleTogdGFnLmtleSxcbiAgICAgICAgVmFsdWU6IHRhZy52YWx1ZSxcbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIHJldHVybiB0YWdzO1xuICB9XG59XG5cbmNsYXNzIE5vRm9ybWF0IGltcGxlbWVudHMgSVRhZ0Zvcm1hdHRlciB7XG4gIHB1YmxpYyBwYXJzZVRhZ3MoX2NmblByb3BlcnR5VGFnczogYW55KTogUGFyc2VUYWdzUmVzdWx0IHtcbiAgICByZXR1cm4geyB0YWdzOiBbXSwgZHluYW1pY1RhZ3M6IHVuZGVmaW5lZCB9O1xuICB9XG5cbiAgcHVibGljIGZvcm1hdFRhZ3MoX3RhZ3M6IFRhZ1tdKTogYW55IHtcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG59XG5cbmxldCBfdGFnRm9ybWF0dGVyc0NhY2hlOiB7W2tleTogc3RyaW5nXTogSVRhZ0Zvcm1hdHRlcn0gfCB1bmRlZmluZWQ7XG5cbi8qKlxuICogQWNjZXNzIHRhZyBmb3JtYXR0ZXJzIHRhYmxlXG4gKlxuICogSW4gYSBmdW5jdGlvbiBiZWNhdXNlIHdlJ3JlIGluIGEgbG9hZCBjeWNsZSB3aXRoIGNmbi1yZXNvdXJjZSB0aGF0IGRlZmluZXMgYFRhZ1R5cGVgLlxuICovXG5mdW5jdGlvbiBUQUdfRk9STUFUVEVSUygpOiB7W2tleTogc3RyaW5nXTogSVRhZ0Zvcm1hdHRlcn0ge1xuICByZXR1cm4gX3RhZ0Zvcm1hdHRlcnNDYWNoZSA/PyAoX3RhZ0Zvcm1hdHRlcnNDYWNoZSA9IHtcbiAgICBbVGFnVHlwZS5BVVRPU0NBTElOR19HUk9VUF06IG5ldyBBc2dGb3JtYXR0ZXIoKSxcbiAgICBbVGFnVHlwZS5TVEFOREFSRF06IG5ldyBTdGFuZGFyZEZvcm1hdHRlcigpLFxuICAgIFtUYWdUeXBlLk1BUF06IG5ldyBNYXBGb3JtYXR0ZXIoKSxcbiAgICBbVGFnVHlwZS5LRVlfVkFMVUVdOiBuZXcgS2V5VmFsdWVGb3JtYXR0ZXIoKSxcbiAgICBbVGFnVHlwZS5OT1RfVEFHR0FCTEVdOiBuZXcgTm9Gb3JtYXQoKSxcbiAgfSk7XG59XG5cbi8qKlxuICogSW50ZXJmYWNlIHRvIGltcGxlbWVudCB0YWdzLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIElUYWdnYWJsZSB7XG4gIC8qKlxuICAgKiBUYWdNYW5hZ2VyIHRvIHNldCwgcmVtb3ZlIGFuZCBmb3JtYXQgdGFnc1xuICAgKi9cbiAgcmVhZG9ubHkgdGFnczogVGFnTWFuYWdlcjtcbn1cblxuLyoqXG4gKiBPcHRpb25zIHRvIGNvbmZpZ3VyZSBUYWdNYW5hZ2VyIGJlaGF2aW9yXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgVGFnTWFuYWdlck9wdGlvbnMge1xuICAvKipcbiAgICogVGhlIG5hbWUgb2YgdGhlIHByb3BlcnR5IGluIENsb3VkRm9ybWF0aW9uIGZvciB0aGVzZSB0YWdzXG4gICAqXG4gICAqIE5vcm1hbGx5IHRoaXMgaXMgYHRhZ3NgLCBidXQgQ29nbml0byBVc2VyUG9vbCB1c2VzIFVzZXJQb29sVGFnc1xuICAgKlxuICAgKiBAZGVmYXVsdCBcInRhZ3NcIlxuICAgKi9cbiAgcmVhZG9ubHkgdGFnUHJvcGVydHlOYW1lPzogc3RyaW5nO1xufVxuXG4vKipcbiAqIFRhZ01hbmFnZXIgZmFjaWxpdGF0ZXMgYSBjb21tb24gaW1wbGVtZW50YXRpb24gb2YgdGFnZ2luZyBmb3IgQ29uc3RydWN0c1xuICpcbiAqIE5vcm1hbGx5LCB5b3UgZG8gbm90IG5lZWQgdG8gdXNlIHRoaXMgY2xhc3MsIGFzIHRoZSBDbG91ZEZvcm1hdGlvbiBzcGVjaWZpY2F0aW9uXG4gKiB3aWxsIGluZGljYXRlIHdoaWNoIHJlc291cmNlcyBhcmUgdGFnZ2FibGUuIEhvd2V2ZXIsIHNvbWV0aW1lcyB5b3Ugd2lsbCBuZWVkIHRoaXNcbiAqIHRvIG1ha2UgY3VzdG9tIHJlc291cmNlcyB0YWdnYWJsZS4gVXNlZCBgdGFnTWFuYWdlci5yZW5kZXJlZFRhZ3NgIHRvIG9idGFpbiBhXG4gKiB2YWx1ZSB0aGF0IHdpbGwgcmVzb2x2ZSB0byB0aGUgdGFncyBhdCBzeW50aGVzaXMgdGltZS5cbiAqXG4gKiBAZXhhbXBsZVxuICogaW1wb3J0ICogYXMgY2RrIGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuICpcbiAqIGNsYXNzIE15Q29uc3RydWN0IGV4dGVuZHMgY2RrLlJlc291cmNlIGltcGxlbWVudHMgY2RrLklUYWdnYWJsZSB7XG4gKiAgIHB1YmxpYyByZWFkb25seSB0YWdzID0gbmV3IGNkay5UYWdNYW5hZ2VyKGNkay5UYWdUeXBlLktFWV9WQUxVRSwgJ1doYXRldmVyOjpUaGU6OlR5cGUnKTtcbiAqXG4gKiAgIGNvbnN0cnVjdG9yKHNjb3BlOiBjZGsuQ29uc3RydWN0LCBpZDogc3RyaW5nKSB7XG4gKiAgICAgc3VwZXIoc2NvcGUsIGlkKTtcbiAqXG4gKiAgICAgbmV3IGNkay5DZm5SZXNvdXJjZSh0aGlzLCAnUmVzb3VyY2UnLCB7XG4gKiAgICAgICB0eXBlOiAnV2hhdGV2ZXI6OlRoZTo6VHlwZScsXG4gKiAgICAgICBwcm9wZXJ0aWVzOiB7XG4gKiAgICAgICAgIC8vIC4uLlxuICogICAgICAgICBUYWdzOiB0aGlzLnRhZ3MucmVuZGVyZWRUYWdzLFxuICogICAgICAgfSxcbiAqICAgICB9KTtcbiAqICAgfVxuICogfVxuICpcbiAqL1xuZXhwb3J0IGNsYXNzIFRhZ01hbmFnZXIge1xuICAvKipcbiAgICogQ2hlY2sgd2hldGhlciB0aGUgZ2l2ZW4gY29uc3RydWN0IGlzIFRhZ2dhYmxlXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGlzVGFnZ2FibGUoY29uc3RydWN0OiBhbnkpOiBjb25zdHJ1Y3QgaXMgSVRhZ2dhYmxlIHtcbiAgICByZXR1cm4gKGNvbnN0cnVjdCBhcyBhbnkpLnRhZ3MgIT09IHVuZGVmaW5lZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgcHJvcGVydHkgbmFtZSBmb3IgdGFnIHZhbHVlc1xuICAgKlxuICAgKiBOb3JtYWxseSB0aGlzIGlzIGB0YWdzYCBidXQgc29tZSByZXNvdXJjZXMgY2hvb3NlIGEgZGlmZmVyZW50IG5hbWUuIENvZ25pdG9cbiAgICogVXNlclBvb2wgdXNlcyBVc2VyUG9vbFRhZ3NcbiAgICovXG4gIHB1YmxpYyByZWFkb25seSB0YWdQcm9wZXJ0eU5hbWU6IHN0cmluZztcblxuICAvKipcbiAgICogQSBsYXp5IHZhbHVlIHRoYXQgcmVwcmVzZW50cyB0aGUgcmVuZGVyZWQgdGFncyBhdCBzeW50aGVzaXMgdGltZVxuICAgKlxuICAgKiBJZiB5b3UgbmVlZCB0byBtYWtlIGEgY3VzdG9tIGNvbnN0cnVjdCB0YWdnYWJsZSwgdXNlIHRoZSB2YWx1ZSBvZiB0aGlzXG4gICAqIHByb3BlcnR5IHRvIHBhc3MgdG8gdGhlIGB0YWdzYCBwcm9wZXJ0eSBvZiB0aGUgdW5kZXJseWluZyBjb25zdHJ1Y3QuXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgcmVuZGVyZWRUYWdzOiBJUmVzb2x2YWJsZTtcblxuICBwcml2YXRlIHJlYWRvbmx5IHRhZ3MgPSBuZXcgTWFwPHN0cmluZywgVGFnPigpO1xuICBwcml2YXRlIHJlYWRvbmx5IGR5bmFtaWNUYWdzOiBhbnk7XG4gIHByaXZhdGUgcmVhZG9ubHkgcHJpb3JpdGllcyA9IG5ldyBNYXA8c3RyaW5nLCBudW1iZXI+KCk7XG4gIHByaXZhdGUgcmVhZG9ubHkgdGFnRm9ybWF0dGVyOiBJVGFnRm9ybWF0dGVyO1xuICBwcml2YXRlIHJlYWRvbmx5IHJlc291cmNlVHlwZU5hbWU6IHN0cmluZztcbiAgcHJpdmF0ZSByZWFkb25seSBpbml0aWFsVGFnUHJpb3JpdHkgPSA1MDtcblxuICBjb25zdHJ1Y3Rvcih0YWdUeXBlOiBUYWdUeXBlLCByZXNvdXJjZVR5cGVOYW1lOiBzdHJpbmcsIHRhZ1N0cnVjdHVyZT86IGFueSwgb3B0aW9uczogVGFnTWFuYWdlck9wdGlvbnMgPSB7IH0pIHtcbiAgICB0aGlzLnJlc291cmNlVHlwZU5hbWUgPSByZXNvdXJjZVR5cGVOYW1lO1xuICAgIHRoaXMudGFnRm9ybWF0dGVyID0gVEFHX0ZPUk1BVFRFUlMoKVt0YWdUeXBlXTtcbiAgICBpZiAodGFnU3RydWN0dXJlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGNvbnN0IHBhcnNlVGFnc1Jlc3VsdCA9IHRoaXMudGFnRm9ybWF0dGVyLnBhcnNlVGFncyh0YWdTdHJ1Y3R1cmUsIHRoaXMuaW5pdGlhbFRhZ1ByaW9yaXR5KTtcbiAgICAgIHRoaXMuZHluYW1pY1RhZ3MgPSBwYXJzZVRhZ3NSZXN1bHQuZHluYW1pY1RhZ3M7XG4gICAgICB0aGlzLl9zZXRUYWcoLi4ucGFyc2VUYWdzUmVzdWx0LnRhZ3MpO1xuICAgIH1cbiAgICB0aGlzLnRhZ1Byb3BlcnR5TmFtZSA9IG9wdGlvbnMudGFnUHJvcGVydHlOYW1lIHx8ICd0YWdzJztcblxuICAgIHRoaXMucmVuZGVyZWRUYWdzID0gTGF6eS5hbnkoeyBwcm9kdWNlOiAoKSA9PiB0aGlzLnJlbmRlclRhZ3MoKSB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIHRoZSBzcGVjaWZpZWQgdGFnIHRvIHRoZSBhcnJheSBvZiB0YWdzXG4gICAqXG4gICAqL1xuICBwdWJsaWMgc2V0VGFnKGtleTogc3RyaW5nLCB2YWx1ZTogc3RyaW5nLCBwcmlvcml0eSA9IDAsIGFwcGx5VG9MYXVuY2hlZEluc3RhbmNlcyA9IHRydWUpOiB2b2lkIHtcbiAgICAvLyBUaGlzIG1ldGhvZCBtb3N0bHkgZXhpc3RzIGJlY2F1c2Ugd2UgZG9uJ3Qgd2FudCB0byBleHBvc2UgdGhlICdUYWcnIHR5cGUgdXNlZCAoaXQgd2lsbCBiZSBjb25mdXNpbmdcbiAgICAvLyB0byB1c2VycykuXG4gICAgdGhpcy5fc2V0VGFnKHsga2V5LCB2YWx1ZSwgcHJpb3JpdHksIGFwcGx5VG9MYXVuY2hlZEluc3RhbmNlcyB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmVzIHRoZSBzcGVjaWZpZWQgdGFnIGZyb20gdGhlIGFycmF5IGlmIGl0IGV4aXN0c1xuICAgKlxuICAgKiBAcGFyYW0ga2V5IFRoZSB0YWcgdG8gcmVtb3ZlXG4gICAqIEBwYXJhbSBwcmlvcml0eSBUaGUgcHJpb3JpdHkgb2YgdGhlIHJlbW92ZSBvcGVyYXRpb25cbiAgICovXG4gIHB1YmxpYyByZW1vdmVUYWcoa2V5OiBzdHJpbmcsIHByaW9yaXR5OiBudW1iZXIpOiB2b2lkIHtcbiAgICBpZiAocHJpb3JpdHkgPj0gKHRoaXMucHJpb3JpdGllcy5nZXQoa2V5KSB8fCAwKSkge1xuICAgICAgdGhpcy50YWdzLmRlbGV0ZShrZXkpO1xuICAgICAgdGhpcy5wcmlvcml0aWVzLnNldChrZXksIHByaW9yaXR5KTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmVuZGVycyB0YWdzIGludG8gdGhlIHByb3BlciBmb3JtYXQgYmFzZWQgb24gVGFnVHlwZVxuICAgKlxuICAgKiBUaGlzIG1ldGhvZCB3aWxsIGVhZ2VybHkgcmVuZGVyIHRoZSB0YWdzIGN1cnJlbnRseSBhcHBsaWVkLiBJblxuICAgKiBtb3N0IGNhc2VzLCB5b3Ugc2hvdWxkIGJlIHVzaW5nIGB0YWdNYW5hZ2VyLnJlbmRlcmVkVGFnc2AgaW5zdGVhZCxcbiAgICogd2hpY2ggd2lsbCByZXR1cm4gYSBgTGF6eWAgdmFsdWUgdGhhdCB3aWxsIHJlc29sdmUgdG8gdGhlIGNvcnJlY3RcbiAgICogdGFncyBhdCBzeW50aGVzaXMgdGltZS5cbiAgICovXG4gIHB1YmxpYyByZW5kZXJUYWdzKCk6IGFueSB7XG4gICAgY29uc3QgZm9ybWF0dGVkVGFncyA9IHRoaXMudGFnRm9ybWF0dGVyLmZvcm1hdFRhZ3ModGhpcy5zb3J0ZWRUYWdzKTtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShmb3JtYXR0ZWRUYWdzKSB8fCBBcnJheS5pc0FycmF5KHRoaXMuZHluYW1pY1RhZ3MpKSB7XG4gICAgICBjb25zdCByZXQgPSBbLi4uZm9ybWF0dGVkVGFncyA/PyBbXSwgLi4udGhpcy5keW5hbWljVGFncyA/PyBbXV07XG4gICAgICByZXR1cm4gcmV0Lmxlbmd0aCA+IDAgPyByZXQgOiB1bmRlZmluZWQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IHJldCA9IHsgLi4uZm9ybWF0dGVkVGFncyA/PyB7fSwgLi4udGhpcy5keW5hbWljVGFncyA/PyB7fSB9O1xuICAgICAgcmV0dXJuIE9iamVjdC5rZXlzKHJldCkubGVuZ3RoID4gMCA/IHJldCA6IHVuZGVmaW5lZDtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmVuZGVyIHRoZSB0YWdzIGluIGEgcmVhZGFibGUgZm9ybWF0XG4gICAqL1xuICBwdWJsaWMgdGFnVmFsdWVzKCk6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4ge1xuICAgIGNvbnN0IHJldDogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHt9O1xuICAgIGZvciAoY29uc3QgdGFnIG9mIHRoaXMuc29ydGVkVGFncykge1xuICAgICAgcmV0W3RhZy5rZXldID0gdGFnLnZhbHVlO1xuICAgIH1cbiAgICByZXR1cm4gcmV0O1xuICB9XG5cbiAgLyoqXG4gICAqIERldGVybWluZSBpZiB0aGUgYXNwZWN0IGFwcGxpZXMgaGVyZVxuICAgKlxuICAgKiBMb29rcyBhdCB0aGUgaW5jbHVkZSBhbmQgZXhjbHVkZSByZXNvdXJjZVR5cGVOYW1lIGFycmF5cyB0byBkZXRlcm1pbmUgaWZcbiAgICogdGhlIGFzcGVjdCBhcHBsaWVzIGhlcmVcbiAgICovXG4gIHB1YmxpYyBhcHBseVRhZ0FzcGVjdEhlcmUoaW5jbHVkZT86IHN0cmluZ1tdLCBleGNsdWRlPzogc3RyaW5nW10pIHtcbiAgICBpZiAoZXhjbHVkZSAmJiBleGNsdWRlLmxlbmd0aCA+IDAgJiYgZXhjbHVkZS5pbmRleE9mKHRoaXMucmVzb3VyY2VUeXBlTmFtZSkgIT09IC0xKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGlmIChpbmNsdWRlICYmIGluY2x1ZGUubGVuZ3RoID4gMCAmJiBpbmNsdWRlLmluZGV4T2YodGhpcy5yZXNvdXJjZVR5cGVOYW1lKSA9PT0gLTEpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRydWUgaWYgdGhlcmUgYXJlIGFueSB0YWdzIGRlZmluZWRcbiAgICovXG4gIHB1YmxpYyBoYXNUYWdzKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLnRhZ3Muc2l6ZSA+IDA7XG4gIH1cblxuICBwcml2YXRlIF9zZXRUYWcoLi4udGFnczogVGFnW10pIHtcbiAgICBmb3IgKGNvbnN0IHRhZyBvZiB0YWdzKSB7XG4gICAgICBpZiAodGFnLnByaW9yaXR5ID49ICh0aGlzLnByaW9yaXRpZXMuZ2V0KHRhZy5rZXkpIHx8IDApKSB7XG4gICAgICAgIHRoaXMudGFncy5zZXQodGFnLmtleSwgdGFnKTtcbiAgICAgICAgdGhpcy5wcmlvcml0aWVzLnNldCh0YWcua2V5LCB0YWcucHJpb3JpdHkpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgZ2V0IHNvcnRlZFRhZ3MoKTogVGFnW10ge1xuICAgIHJldHVybiBBcnJheS5mcm9tKHRoaXMudGFncy52YWx1ZXMoKSlcbiAgICAgIC5zb3J0KChhLCBiKSA9PiBhLmtleS5sb2NhbGVDb21wYXJlKGIua2V5KSk7XG4gIH1cbn1cbiJdfQ==