"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TagManager = void 0;
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
    /**
     * Check whether the given construct is Taggable
     */
    static isTaggable(construct) {
        return construct.tags !== undefined;
    }
    constructor(tagType, resourceTypeName, tagStructure, options = {}) {
        this.tags = new Map();
        this.priorities = new Map();
        this.initialTagPriority = 50;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFnLW1hbmFnZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ0YWctbWFuYWdlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxpREFBeUM7QUFFekMsaUNBQThCO0FBMkQ5Qjs7R0FFRztBQUNILE1BQU0saUJBQWlCO0lBQ2QsU0FBUyxDQUFDLGVBQW9CLEVBQUUsUUFBZ0I7UUFDckQsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsZUFBZSxDQUFDLEVBQUU7WUFDbkMsTUFBTSxJQUFJLEtBQUssQ0FBQyx5REFBeUQsSUFBSSxDQUFDLFNBQVMsQ0FBQyxlQUFlLENBQUMsRUFBRSxDQUFDLENBQUM7U0FDN0c7UUFFRCxNQUFNLElBQUksR0FBVSxFQUFFLENBQUM7UUFDdkIsTUFBTSxXQUFXLEdBQVEsRUFBRSxDQUFDO1FBQzVCLEtBQUssTUFBTSxHQUFHLElBQUksZUFBZSxFQUFFO1lBQ2pDLElBQUksR0FBRyxDQUFDLEdBQUcsS0FBSyxTQUFTLElBQUksR0FBRyxDQUFDLEtBQUssS0FBSyxTQUFTLEVBQUU7Z0JBQ3BELFdBQVcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7YUFDdkI7aUJBQU07Z0JBQ0wsNkNBQTZDO2dCQUM3QyxJQUFJLENBQUMsSUFBSSxDQUFDO29CQUNSLEdBQUcsRUFBRSxHQUFHLEdBQUcsQ0FBQyxHQUFHLEVBQUU7b0JBQ2pCLEtBQUssRUFBRSxHQUFHLEdBQUcsQ0FBQyxLQUFLLEVBQUU7b0JBQ3JCLFFBQVE7aUJBQ1QsQ0FBQyxDQUFDO2FBQ0o7U0FDRjtRQUNELE9BQU8sRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFLENBQUM7SUFDL0IsQ0FBQztJQUVNLFVBQVUsQ0FBQyxJQUFXO1FBQzNCLE1BQU0sT0FBTyxHQUFhLEVBQUUsQ0FBQztRQUM3QixLQUFLLE1BQU0sR0FBRyxJQUFJLElBQUksRUFBRTtZQUN0QixPQUFPLENBQUMsSUFBSSxDQUFDO2dCQUNYLEdBQUcsRUFBRSxHQUFHLENB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LElBQUksQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDO0lBQzVCLENBQUM7SUFFTyxPQUFPLENBQUMsR0FBRyxJQUFXO1FBQzVCLEtBQUssTUFBTSxHQUFHLElBQUksSUFBSSxFQUFFO1lBQ3RCLElBQUksR0FBRyxDQUFDLFFBQVEsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRTtnQkFDdkQsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztnQkFDNUIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7YUFDNUM7U0FDRjtJQUNILENBQUM7SUFFRCxJQUFZLFVBQVU7UUFDcEIsT0FBTyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7YUFDbEMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDaEQsQ0FBQztDQUNGO0FBdElELGdDQXNJQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFRhZ1R5cGUgfSBmcm9tICcuL2Nmbi1yZXNvdXJjZSc7XG5pbXBvcnQgeyBDZm5UYWcgfSBmcm9tICcuL2Nmbi10YWcnO1xuaW1wb3J0IHsgTGF6eSB9IGZyb20gJy4vbGF6eSc7XG5pbXBvcnQgeyBJUmVzb2x2YWJsZSB9IGZyb20gJy4vcmVzb2x2YWJsZSc7XG5cbmludGVyZmFjZSBUYWcge1xuICBrZXk6IHN0cmluZztcbiAgdmFsdWU6IHN0cmluZztcbiAgcHJpb3JpdHk6IG51bWJlcjtcblxuICAvKipcbiAgICogQGRlZmF1bHQgdHJ1ZVxuICAgKi9cbiAgYXBwbHlUb0xhdW5jaGVkSW5zdGFuY2VzPzogYm9vbGVhbjtcbn1cblxuaW50ZXJmYWNlIENmbkFzZ1RhZyB7XG4gIGtleTogc3RyaW5nO1xuICB2YWx1ZTogc3RyaW5nO1xuICBwcm9wYWdhdGVBdExhdW5jaDogYm9vbGVhbjtcbn1cblxuaW50ZXJmYWNlIFN0YWNrVGFnIHtcbiAgS2V5OiBzdHJpbmc7XG4gIFZhbHVlOiBzdHJpbmc7XG59XG5cbi8qKlxuICogVGhlIHJlc3VsdHMgb2YgcGFyc2luZyBUYWdzLlxuICovXG5pbnRlcmZhY2UgUGFyc2VUYWdzUmVzdWx0IHtcbiAgLyoqXG4gICAqIFRoZSBcInNpbXBsZVwiIChtZWFuaW5nLCBub3QgaW5jbHVkaW5nIGNvbXBsZXggQ2xvdWRGb3JtYXRpb24gZnVuY3Rpb25zKVxuICAgKiB0YWdzIHRoYXQgd2VyZSBmb3VuZC5cbiAgICovXG4gIHJlYWRvbmx5IHRhZ3M6IFRhZ1tdO1xuXG4gIC8qKlxuICAgKiBUaGUgY29sbGVjdGlvbiBvZiBcImR5bmFtaWNcIiAobWVhbmluZywgaW5jbHVkaW5nIGNvbXBsZXggQ2xvdWRGb3JtYXRpb24gZnVuY3Rpb25zKVxuICAgKiB0YWdzIHRoYXQgd2VyZSBmb3VuZC5cbiAgICovXG4gIHJlYWRvbmx5IGR5bmFtaWNUYWdzOiBhbnk7XG59XG5cbi8qKlxuICogSW50ZXJmYWNlIGZvciBjb252ZXJ0ZXIgYmV0d2VlbiBDbG91ZEZvcm1hdGlvbiBhbmQgaW50ZXJuYWwgdGFnIHJlcHJlc2VudGF0aW9uc1xuICovXG5pbnRlcmZhY2UgSVRhZ0Zvcm1hdHRlciB7XG4gIC8qKlxuICAgKiBGb3JtYXQgdGhlIGdpdmVuIHRhZ3MgYXMgQ2xvdWRGb3JtYXRpb24gdGFnc1xuICAgKi9cbiAgZm9ybWF0VGFncyh0YWdzOiBUYWdbXSk6IGFueTtcblxuICAvKipcbiAgICogUGFyc2UgdGhlIENsb3VkRm9ybWF0aW9uIHRhZyByZXByZXNlbnRhdGlvbiBpbnRvIGludGVybmFsIHJlcHJlc2VudGF0aW9uXG4gICAqXG4gICAqIFVzZSB0aGUgZ2l2ZW4gcHJpb3JpdHkuXG4gICAqL1xuICBwYXJzZVRhZ3MoY2ZuUHJvcGVydHlUYWdzOiBhbnksIHByaW9yaXR5OiBudW1iZXIpOiBQYXJzZVRhZ3NSZXN1bHQ7XG59XG5cbi8qKlxuICogU3RhbmRhcmQgdGFncyBhcmUgYSBsaXN0IG9mIHsga2V5LCB2YWx1ZSB9IG9iamVjdHNcbiAqL1xuY2xhc3MgU3RhbmRhcmRGb3JtYXR0ZXIgaW1wbGVtZW50cyBJVGFnRm9ybWF0dGVyIHtcbiAgcHVibGljIHBhcnNlVGFncyhjZm5Qcm9wZXJ0eVRhZ3M6IGFueSwgcHJpb3JpdHk6IG51bWJlcik6IFBhcnNlVGFnc1Jlc3VsdCB7XG4gICAgaWYgKCFBcnJheS5pc0FycmF5KGNmblByb3BlcnR5VGFncykpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgSW52YWxpZCB0YWcgaW5wdXQgZXhwZWN0ZWQgYXJyYXkgb2Yge2tleSwgdmFsdWV9IGhhdmUgJHtKU09OLnN0cmluZ2lmeShjZm5Qcm9wZXJ0eVRhZ3MpfWApO1xuICAgIH1cblxuICAgIGNvbnN0IHRhZ3M6IFRhZ1tdID0gW107XG4gICAgY29uc3QgZHluYW1pY1RhZ3M6IGFueSA9IFtdO1xuICAgIGZvciAoY29uc3QgdGFnIG9mIGNmblByb3BlcnR5VGFncykge1xuICAgICAgaWYgKHRhZy5rZXkgPT09IHVuZGVmaW5lZCB8fCB0YWcudmFsdWUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICBkeW5hbWljVGFncy5wdXNoKHRhZyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyB1c2luZyBpbnRlcnAgdG8gZW5zdXJlIFRva2VuIGlzIG5vdyBzdHJpbmdcbiAgICAgICAgdGFncy5wdXNoKHtcbiAgICAgICAgICBrZXk6IGAke3RhZy5rZXl9YCxcbiAgICAgICAgICB2YWx1ZTogYCR7dGFnLnZhbHVlfWAsXG4gICAgICAgICAgcHJpb3JpdHksXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4geyB0YWdzLCBkeW5hbWljVGFncyB9O1xuICB9XG5cbiAgcHVibGljIGZvcm1hdFRhZ3ModGFnczogVGFnW10pOiBhbnkge1xuICAgIGNvbnN0IGNmblRhZ3M6IENmblRhZ1tdID0gW107XG4gICAgZm9yIChjb25zdCB0YWcgb2YgdGFncykge1xuICAgICAgY2ZuVGFncy5wdXNoKHtcbiAgICAgICAga2V5OiB0YWcua2V5LFxuICAgICAgICB2YWx1ZTogdGFnLnZhbHVlLFxuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiBjZm5UYWdzO1xuICB9XG59XG5cbi8qKlxuICogQVNHIHRhZ3MgYXJlIGEgbGlzdCBvZiB7IGtleSwgdmFsdWUsIHByb3BhZ2F0ZUF0TGF1bmNoIH0gb2JqZWN0c1xuICovXG5jbGFzcyBBc2dGb3JtYXR0ZXIgaW1wbGVtZW50cyBJVGFnRm9ybWF0dGVyIHtcbiAgcHVibGljIHBhcnNlVGFncyhjZm5Qcm9wZXJ0eVRhZ3M6IGFueSwgcHJpb3JpdHk6IG51bWJlcik6IFBhcnNlVGFnc1Jlc3VsdCB7XG4gICAgaWYgKCFBcnJheS5pc0FycmF5KGNmblByb3BlcnR5VGFncykpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgSW52YWxpZCB0YWcgaW5wdXQgZXhwZWN0ZWQgYXJyYXkgb2Yge2tleSwgdmFsdWUsIHByb3BhZ2F0ZUF0TGF1bmNofSBoYXZlICR7SlNPTi5zdHJpbmdpZnkoY2ZuUHJvcGVydHlUYWdzKX1gKTtcbiAgICB9XG5cbiAgICBjb25zdCB0YWdzOiBUYWdbXSA9IFtdO1xuICAgIGNvbnN0IGR5bmFtaWNUYWdzOiBhbnkgPSBbXTtcbiAgICBmb3IgKGNvbnN0IHRhZyBvZiBjZm5Qcm9wZXJ0eVRhZ3MpIHtcbiAgICAgIGlmICh0YWcua2V5ID09PSB1bmRlZmluZWQgfHxcbiAgICAgICAgICB0YWcudmFsdWUgPT09IHVuZGVmaW5lZCB8fFxuICAgICAgICAgIHRhZy5wcm9wYWdhdGVBdExhdW5jaCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGR5bmFtaWNUYWdzLnB1c2godGFnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIHVzaW5nIGludGVycCB0byBlbnN1cmUgVG9rZW4gaXMgbm93IHN0cmluZ1xuICAgICAgICB0YWdzLnB1c2goe1xuICAgICAgICAgIGtleTogYCR7dGFnLmtleX1gLFxuICAgICAgICAgIHZhbHVlOiBgJHt0YWcudmFsdWV9YCxcbiAgICAgICAgICBwcmlvcml0eSxcbiAgICAgICAgICBhcHBseVRvTGF1bmNoZWRJbnN0YW5jZXM6ICEhdGFnLnByb3BhZ2F0ZUF0TGF1bmNoLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4geyB0YWdzLCBkeW5hbWljVGFncyB9O1xuICB9XG5cbiAgcHVibGljIGZvcm1hdFRhZ3ModGFnczogVGFnW10pOiBhbnkge1xuICAgIGNvbnN0IGNmblRhZ3M6IENmbkFzZ1RhZ1tdID0gW107XG4gICAgZm9yIChjb25zdCB0YWcgb2YgdGFncykge1xuICAgICAgY2ZuVGFncy5wdXNoKHtcbiAgICAgICAga2V5OiB0YWcua2V5LFxuICAgICAgICB2YWx1ZTogdGFnLnZhbHVlLFxuICAgICAgICBwcm9wYWdhdGVBdExhdW5jaDogdGFnLmFwcGx5VG9MYXVuY2hlZEluc3RhbmNlcyAhPT0gZmFsc2UsXG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIGNmblRhZ3M7XG4gIH1cbn1cblxuLyoqXG4gKiBTb21lIENsb3VkRm9ybWF0aW9uIGNvbnN0cnVjdHMgdXNlIGEgeyBrZXk6IHZhbHVlIH0gbWFwIGZvciB0YWdzXG4gKi9cbmNsYXNzIE1hcEZvcm1hdHRlciBpbXBsZW1lbnRzIElUYWdGb3JtYXR0ZXIge1xuICBwdWJsaWMgcGFyc2VUYWdzKGNmblByb3BlcnR5VGFnczogYW55LCBwcmlvcml0eTogbnVtYmVyKTogUGFyc2VUYWdzUmVzdWx0IHtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShjZm5Qcm9wZXJ0eVRhZ3MpIHx8IHR5cGVvZihjZm5Qcm9wZXJ0eVRhZ3MpICE9PSAnb2JqZWN0Jykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIHRhZyBpbnB1dCBleHBlY3RlZCBtYXAgb2Yge2tleTogdmFsdWV9IGhhdmUgJHtKU09OLnN0cmluZ2lmeShjZm5Qcm9wZXJ0eVRhZ3MpfWApO1xuICAgIH1cblxuICAgIGNvbnN0IHRhZ3M6IFRhZ1tdID0gW107XG4gICAgZm9yIChjb25zdCBba2V5LCB2YWx1ZV0gb2YgT2JqZWN0LmVudHJpZXMoY2ZuUHJvcGVydHlUYWdzKSkge1xuICAgICAgdGFncy5wdXNoKHtcbiAgICAgICAga2V5LFxuICAgICAgICB2YWx1ZTogYCR7dmFsdWV9YCxcbiAgICAgICAgcHJpb3JpdHksXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4geyB0YWdzLCBkeW5hbWljVGFnczogdW5kZWZpbmVkIH07XG4gIH1cblxuICBwdWJsaWMgZm9ybWF0VGFncyh0YWdzOiBUYWdbXSk6IGFueSB7XG4gICAgY29uc3QgY2ZuVGFnczogeyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfSA9IHt9O1xuICAgIGZvciAoY29uc3QgdGFnIG9mIHRhZ3MpIHtcbiAgICAgIGNmblRhZ3NbYCR7dGFnLmtleX1gXSA9IGAke3RhZy52YWx1ZX1gO1xuICAgIH1cbiAgICByZXR1cm4gY2ZuVGFncztcbiAgfVxufVxuXG4vKipcbiAqIFN0YWNrVGFncyBhcmUgb2YgdGhlIGZvcm1hdCB7IEtleToga2V5LCBWYWx1ZTogdmFsdWUgfVxuICovXG5jbGFzcyBLZXlWYWx1ZUZvcm1hdHRlciBpbXBsZW1lbnRzIElUYWdGb3JtYXR0ZXIge1xuICBwdWJsaWMgcGFyc2VUYWdzKGtleVZhbHVlVGFnczogYW55LCBwcmlvcml0eTogbnVtYmVyKTogUGFyc2VUYWdzUmVzdWx0IHtcbiAgICBjb25zdCB0YWdzOiBUYWdbXSA9IFtdO1xuICAgIGZvciAoY29uc3Qga2V5IGluIGtleVZhbHVlVGFncykge1xuICAgICAgaWYgKGtleVZhbHVlVGFncy5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgIGNvbnN0IHZhbHVlID0ga2V5VmFsdWVUYWdzW2tleV07XG4gICAgICAgIHRhZ3MucHVzaCh7XG4gICAgICAgICAga2V5LFxuICAgICAgICAgIHZhbHVlLFxuICAgICAgICAgIHByaW9yaXR5LFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHsgdGFncywgZHluYW1pY1RhZ3M6IHVuZGVmaW5lZCB9O1xuICB9XG5cbiAgcHVibGljIGZvcm1hdFRhZ3ModW5mb3JtYXR0ZWRUYWdzOiBUYWdbXSk6IGFueSB7XG4gICAgY29uc3QgdGFnczogU3RhY2tUYWdbXSA9IFtdO1xuICAgIHVuZm9ybWF0dGVkVGFncy5mb3JFYWNoKHRhZyA9PiB7XG4gICAgICB0YWdzLnB1c2goe1xuICAgICAgICBLZXk6IHRhZy5rZXksXG4gICAgICAgIFZhbHVlOiB0YWcudmFsdWUsXG4gICAgICB9KTtcbiAgICB9KTtcbiAgICByZXR1cm4gdGFncztcbiAgfVxufVxuXG5jbGFzcyBOb0Zvcm1hdCBpbXBsZW1lbnRzIElUYWdGb3JtYXR0ZXIge1xuICBwdWJsaWMgcGFyc2VUYWdzKF9jZm5Qcm9wZXJ0eVRhZ3M6IGFueSk6IFBhcnNlVGFnc1Jlc3VsdCB7XG4gICAgcmV0dXJuIHsgdGFnczogW10sIGR5bmFtaWNUYWdzOiB1bmRlZmluZWQgfTtcbiAgfVxuXG4gIHB1YmxpYyBmb3JtYXRUYWdzKF90YWdzOiBUYWdbXSk6IGFueSB7XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxufVxuXG5sZXQgX3RhZ0Zvcm1hdHRlcnNDYWNoZToge1trZXk6IHN0cmluZ106IElUYWdGb3JtYXR0ZXJ9IHwgdW5kZWZpbmVkO1xuXG4vKipcbiAqIEFjY2VzcyB0YWcgZm9ybWF0dGVycyB0YWJsZVxuICpcbiAqIEluIGEgZnVuY3Rpb24gYmVjYXVzZSB3ZSdyZSBpbiBhIGxvYWQgY3ljbGUgd2l0aCBjZm4tcmVzb3VyY2UgdGhhdCBkZWZpbmVzIGBUYWdUeXBlYC5cbiAqL1xuZnVuY3Rpb24gVEFHX0ZPUk1BVFRFUlMoKToge1trZXk6IHN0cmluZ106IElUYWdGb3JtYXR0ZXJ9IHtcbiAgcmV0dXJuIF90YWdGb3JtYXR0ZXJzQ2FjaGUgPz8gKF90YWdGb3JtYXR0ZXJzQ2FjaGUgPSB7XG4gICAgW1RhZ1R5cGUuQVVUT1NDQUxJTkdfR1JPVVBdOiBuZXcgQXNnRm9ybWF0dGVyKCksXG4gICAgW1RhZ1R5cGUuU1RBTkRBUkRdOiBuZXcgU3RhbmRhcmRGb3JtYXR0ZXIoKSxcbiAgICBbVGFnVHlwZS5NQVBdOiBuZXcgTWFwRm9ybWF0dGVyKCksXG4gICAgW1RhZ1R5cGUuS0VZX1ZBTFVFXTogbmV3IEtleVZhbHVlRm9ybWF0dGVyKCksXG4gICAgW1RhZ1R5cGUuTk9UX1RBR0dBQkxFXTogbmV3IE5vRm9ybWF0KCksXG4gIH0pO1xufVxuXG4vKipcbiAqIEludGVyZmFjZSB0byBpbXBsZW1lbnQgdGFncy5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBJVGFnZ2FibGUge1xuICAvKipcbiAgICogVGFnTWFuYWdlciB0byBzZXQsIHJlbW92ZSBhbmQgZm9ybWF0IHRhZ3NcbiAgICovXG4gIHJlYWRvbmx5IHRhZ3M6IFRhZ01hbmFnZXI7XG59XG5cbi8qKlxuICogT3B0aW9ucyB0byBjb25maWd1cmUgVGFnTWFuYWdlciBiZWhhdmlvclxuICovXG5leHBvcnQgaW50ZXJmYWNlIFRhZ01hbmFnZXJPcHRpb25zIHtcbiAgLyoqXG4gICAqIFRoZSBuYW1lIG9mIHRoZSBwcm9wZXJ0eSBpbiBDbG91ZEZvcm1hdGlvbiBmb3IgdGhlc2UgdGFnc1xuICAgKlxuICAgKiBOb3JtYWxseSB0aGlzIGlzIGB0YWdzYCwgYnV0IENvZ25pdG8gVXNlclBvb2wgdXNlcyBVc2VyUG9vbFRhZ3NcbiAgICpcbiAgICogQGRlZmF1bHQgXCJ0YWdzXCJcbiAgICovXG4gIHJlYWRvbmx5IHRhZ1Byb3BlcnR5TmFtZT86IHN0cmluZztcbn1cblxuLyoqXG4gKiBUYWdNYW5hZ2VyIGZhY2lsaXRhdGVzIGEgY29tbW9uIGltcGxlbWVudGF0aW9uIG9mIHRhZ2dpbmcgZm9yIENvbnN0cnVjdHNcbiAqXG4gKiBOb3JtYWxseSwgeW91IGRvIG5vdCBuZWVkIHRvIHVzZSB0aGlzIGNsYXNzLCBhcyB0aGUgQ2xvdWRGb3JtYXRpb24gc3BlY2lmaWNhdGlvblxuICogd2lsbCBpbmRpY2F0ZSB3aGljaCByZXNvdXJjZXMgYXJlIHRhZ2dhYmxlLiBIb3dldmVyLCBzb21ldGltZXMgeW91IHdpbGwgbmVlZCB0aGlzXG4gKiB0byBtYWtlIGN1c3RvbSByZXNvdXJjZXMgdGFnZ2FibGUuIFVzZWQgYHRhZ01hbmFnZXIucmVuZGVyZWRUYWdzYCB0byBvYnRhaW4gYVxuICogdmFsdWUgdGhhdCB3aWxsIHJlc29sdmUgdG8gdGhlIHRhZ3MgYXQgc3ludGhlc2lzIHRpbWUuXG4gKlxuICogQGV4YW1wbGVcbiAqIGltcG9ydCAqIGFzIGNkayBmcm9tICdAYXdzLWNkay9jb3JlJztcbiAqXG4gKiBjbGFzcyBNeUNvbnN0cnVjdCBleHRlbmRzIGNkay5SZXNvdXJjZSBpbXBsZW1lbnRzIGNkay5JVGFnZ2FibGUge1xuICogICBwdWJsaWMgcmVhZG9ubHkgdGFncyA9IG5ldyBjZGsuVGFnTWFuYWdlcihjZGsuVGFnVHlwZS5LRVlfVkFMVUUsICdXaGF0ZXZlcjo6VGhlOjpUeXBlJyk7XG4gKlxuICogICBjb25zdHJ1Y3RvcihzY29wZTogY2RrLkNvbnN0cnVjdCwgaWQ6IHN0cmluZykge1xuICogICAgIHN1cGVyKHNjb3BlLCBpZCk7XG4gKlxuICogICAgIG5ldyBjZGsuQ2ZuUmVzb3VyY2UodGhpcywgJ1Jlc291cmNlJywge1xuICogICAgICAgdHlwZTogJ1doYXRldmVyOjpUaGU6OlR5cGUnLFxuICogICAgICAgcHJvcGVydGllczoge1xuICogICAgICAgICAvLyAuLi5cbiAqICAgICAgICAgVGFnczogdGhpcy50YWdzLnJlbmRlcmVkVGFncyxcbiAqICAgICAgIH0sXG4gKiAgICAgfSk7XG4gKiAgIH1cbiAqIH1cbiAqXG4gKi9cbmV4cG9ydCBjbGFzcyBUYWdNYW5hZ2VyIHtcbiAgLyoqXG4gICAqIENoZWNrIHdoZXRoZXIgdGhlIGdpdmVuIGNvbnN0cnVjdCBpcyBUYWdnYWJsZVxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBpc1RhZ2dhYmxlKGNvbnN0cnVjdDogYW55KTogY29uc3RydWN0IGlzIElUYWdnYWJsZSB7XG4gICAgcmV0dXJuIChjb25zdHJ1Y3QgYXMgYW55KS50YWdzICE9PSB1bmRlZmluZWQ7XG4gIH1cblxuICAvKipcbiAgICogVGhlIHByb3BlcnR5IG5hbWUgZm9yIHRhZyB2YWx1ZXNcbiAgICpcbiAgICogTm9ybWFsbHkgdGhpcyBpcyBgdGFnc2AgYnV0IHNvbWUgcmVzb3VyY2VzIGNob29zZSBhIGRpZmZlcmVudCBuYW1lLiBDb2duaXRvXG4gICAqIFVzZXJQb29sIHVzZXMgVXNlclBvb2xUYWdzXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgdGFnUHJvcGVydHlOYW1lOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIEEgbGF6eSB2YWx1ZSB0aGF0IHJlcHJlc2VudHMgdGhlIHJlbmRlcmVkIHRhZ3MgYXQgc3ludGhlc2lzIHRpbWVcbiAgICpcbiAgICogSWYgeW91IG5lZWQgdG8gbWFrZSBhIGN1c3RvbSBjb25zdHJ1Y3QgdGFnZ2FibGUsIHVzZSB0aGUgdmFsdWUgb2YgdGhpc1xuICAgKiBwcm9wZXJ0eSB0byBwYXNzIHRvIHRoZSBgdGFnc2AgcHJvcGVydHkgb2YgdGhlIHVuZGVybHlpbmcgY29uc3RydWN0LlxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IHJlbmRlcmVkVGFnczogSVJlc29sdmFibGU7XG5cbiAgcHJpdmF0ZSByZWFkb25seSB0YWdzID0gbmV3IE1hcDxzdHJpbmcsIFRhZz4oKTtcbiAgcHJpdmF0ZSByZWFkb25seSBkeW5hbWljVGFnczogYW55O1xuICBwcml2YXRlIHJlYWRvbmx5IHByaW9yaXRpZXMgPSBuZXcgTWFwPHN0cmluZywgbnVtYmVyPigpO1xuICBwcml2YXRlIHJlYWRvbmx5IHRhZ0Zvcm1hdHRlcjogSVRhZ0Zvcm1hdHRlcjtcbiAgcHJpdmF0ZSByZWFkb25seSByZXNvdXJjZVR5cGVOYW1lOiBzdHJpbmc7XG4gIHByaXZhdGUgcmVhZG9ubHkgaW5pdGlhbFRhZ1ByaW9yaXR5ID0gNTA7XG5cbiAgY29uc3RydWN0b3IodGFnVHlwZTogVGFnVHlwZSwgcmVzb3VyY2VUeXBlTmFtZTogc3RyaW5nLCB0YWdTdHJ1Y3R1cmU/OiBhbnksIG9wdGlvbnM6IFRhZ01hbmFnZXJPcHRpb25zID0geyB9KSB7XG4gICAgdGhpcy5yZXNvdXJjZVR5cGVOYW1lID0gcmVzb3VyY2VUeXBlTmFtZTtcbiAgICB0aGlzLnRhZ0Zvcm1hdHRlciA9IFRBR19GT1JNQVRURVJTKClbdGFnVHlwZV07XG4gICAgaWYgKHRhZ1N0cnVjdHVyZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBjb25zdCBwYXJzZVRhZ3NSZXN1bHQgPSB0aGlzLnRhZ0Zvcm1hdHRlci5wYXJzZVRhZ3ModGFnU3RydWN0dXJlLCB0aGlzLmluaXRpYWxUYWdQcmlvcml0eSk7XG4gICAgICB0aGlzLmR5bmFtaWNUYWdzID0gcGFyc2VUYWdzUmVzdWx0LmR5bmFtaWNUYWdzO1xuICAgICAgdGhpcy5fc2V0VGFnKC4uLnBhcnNlVGFnc1Jlc3VsdC50YWdzKTtcbiAgICB9XG4gICAgdGhpcy50YWdQcm9wZXJ0eU5hbWUgPSBvcHRpb25zLnRhZ1Byb3BlcnR5TmFtZSB8fCAndGFncyc7XG5cbiAgICB0aGlzLnJlbmRlcmVkVGFncyA9IExhenkuYW55KHsgcHJvZHVjZTogKCkgPT4gdGhpcy5yZW5kZXJUYWdzKCkgfSk7XG4gIH1cblxuICAvKipcbiAgICogQWRkcyB0aGUgc3BlY2lmaWVkIHRhZyB0byB0aGUgYXJyYXkgb2YgdGFnc1xuICAgKlxuICAgKi9cbiAgcHVibGljIHNldFRhZyhrZXk6IHN0cmluZywgdmFsdWU6IHN0cmluZywgcHJpb3JpdHkgPSAwLCBhcHBseVRvTGF1bmNoZWRJbnN0YW5jZXMgPSB0cnVlKTogdm9pZCB7XG4gICAgLy8gVGhpcyBtZXRob2QgbW9zdGx5IGV4aXN0cyBiZWNhdXNlIHdlIGRvbid0IHdhbnQgdG8gZXhwb3NlIHRoZSAnVGFnJyB0eXBlIHVzZWQgKGl0IHdpbGwgYmUgY29uZnVzaW5nXG4gICAgLy8gdG8gdXNlcnMpLlxuICAgIHRoaXMuX3NldFRhZyh7IGtleSwgdmFsdWUsIHByaW9yaXR5LCBhcHBseVRvTGF1bmNoZWRJbnN0YW5jZXMgfSk7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlcyB0aGUgc3BlY2lmaWVkIHRhZyBmcm9tIHRoZSBhcnJheSBpZiBpdCBleGlzdHNcbiAgICpcbiAgICogQHBhcmFtIGtleSBUaGUgdGFnIHRvIHJlbW92ZVxuICAgKiBAcGFyYW0gcHJpb3JpdHkgVGhlIHByaW9yaXR5IG9mIHRoZSByZW1vdmUgb3BlcmF0aW9uXG4gICAqL1xuICBwdWJsaWMgcmVtb3ZlVGFnKGtleTogc3RyaW5nLCBwcmlvcml0eTogbnVtYmVyKTogdm9pZCB7XG4gICAgaWYgKHByaW9yaXR5ID49ICh0aGlzLnByaW9yaXRpZXMuZ2V0KGtleSkgfHwgMCkpIHtcbiAgICAgIHRoaXMudGFncy5kZWxldGUoa2V5KTtcbiAgICAgIHRoaXMucHJpb3JpdGllcy5zZXQoa2V5LCBwcmlvcml0eSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJlbmRlcnMgdGFncyBpbnRvIHRoZSBwcm9wZXIgZm9ybWF0IGJhc2VkIG9uIFRhZ1R5cGVcbiAgICpcbiAgICogVGhpcyBtZXRob2Qgd2lsbCBlYWdlcmx5IHJlbmRlciB0aGUgdGFncyBjdXJyZW50bHkgYXBwbGllZC4gSW5cbiAgICogbW9zdCBjYXNlcywgeW91IHNob3VsZCBiZSB1c2luZyBgdGFnTWFuYWdlci5yZW5kZXJlZFRhZ3NgIGluc3RlYWQsXG4gICAqIHdoaWNoIHdpbGwgcmV0dXJuIGEgYExhenlgIHZhbHVlIHRoYXQgd2lsbCByZXNvbHZlIHRvIHRoZSBjb3JyZWN0XG4gICAqIHRhZ3MgYXQgc3ludGhlc2lzIHRpbWUuXG4gICAqL1xuICBwdWJsaWMgcmVuZGVyVGFncygpOiBhbnkge1xuICAgIGNvbnN0IGZvcm1hdHRlZFRhZ3MgPSB0aGlzLnRhZ0Zvcm1hdHRlci5mb3JtYXRUYWdzKHRoaXMuc29ydGVkVGFncyk7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkoZm9ybWF0dGVkVGFncykgfHwgQXJyYXkuaXNBcnJheSh0aGlzLmR5bmFtaWNUYWdzKSkge1xuICAgICAgY29uc3QgcmV0ID0gWy4uLmZvcm1hdHRlZFRhZ3MgPz8gW10sIC4uLnRoaXMuZHluYW1pY1RhZ3MgPz8gW11dO1xuICAgICAgcmV0dXJuIHJldC5sZW5ndGggPiAwID8gcmV0IDogdW5kZWZpbmVkO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCByZXQgPSB7IC4uLmZvcm1hdHRlZFRhZ3MgPz8ge30sIC4uLnRoaXMuZHluYW1pY1RhZ3MgPz8ge30gfTtcbiAgICAgIHJldHVybiBPYmplY3Qua2V5cyhyZXQpLmxlbmd0aCA+IDAgPyByZXQgOiB1bmRlZmluZWQ7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJlbmRlciB0aGUgdGFncyBpbiBhIHJlYWRhYmxlIGZvcm1hdFxuICAgKi9cbiAgcHVibGljIHRhZ1ZhbHVlcygpOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+IHtcbiAgICBjb25zdCByZXQ6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7fTtcbiAgICBmb3IgKGNvbnN0IHRhZyBvZiB0aGlzLnNvcnRlZFRhZ3MpIHtcbiAgICAgIHJldFt0YWcua2V5XSA9IHRhZy52YWx1ZTtcbiAgICB9XG4gICAgcmV0dXJuIHJldDtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZXRlcm1pbmUgaWYgdGhlIGFzcGVjdCBhcHBsaWVzIGhlcmVcbiAgICpcbiAgICogTG9va3MgYXQgdGhlIGluY2x1ZGUgYW5kIGV4Y2x1ZGUgcmVzb3VyY2VUeXBlTmFtZSBhcnJheXMgdG8gZGV0ZXJtaW5lIGlmXG4gICAqIHRoZSBhc3BlY3QgYXBwbGllcyBoZXJlXG4gICAqL1xuICBwdWJsaWMgYXBwbHlUYWdBc3BlY3RIZXJlKGluY2x1ZGU/OiBzdHJpbmdbXSwgZXhjbHVkZT86IHN0cmluZ1tdKSB7XG4gICAgaWYgKGV4Y2x1ZGUgJiYgZXhjbHVkZS5sZW5ndGggPiAwICYmIGV4Y2x1ZGUuaW5kZXhPZih0aGlzLnJlc291cmNlVHlwZU5hbWUpICE9PSAtMSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBpZiAoaW5jbHVkZSAmJiBpbmNsdWRlLmxlbmd0aCA+IDAgJiYgaW5jbHVkZS5pbmRleE9mKHRoaXMucmVzb3VyY2VUeXBlTmFtZSkgPT09IC0xKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0cnVlIGlmIHRoZXJlIGFyZSBhbnkgdGFncyBkZWZpbmVkXG4gICAqL1xuICBwdWJsaWMgaGFzVGFncygpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy50YWdzLnNpemUgPiAwO1xuICB9XG5cbiAgcHJpdmF0ZSBfc2V0VGFnKC4uLnRhZ3M6IFRhZ1tdKSB7XG4gICAgZm9yIChjb25zdCB0YWcgb2YgdGFncykge1xuICAgICAgaWYgKHRhZy5wcmlvcml0eSA+PSAodGhpcy5wcmlvcml0aWVzLmdldCh0YWcua2V5KSB8fCAwKSkge1xuICAgICAgICB0aGlzLnRhZ3Muc2V0KHRhZy5rZXksIHRhZyk7XG4gICAgICAgIHRoaXMucHJpb3JpdGllcy5zZXQodGFnLmtleSwgdGFnLnByaW9yaXR5KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGdldCBzb3J0ZWRUYWdzKCk6IFRhZ1tdIHtcbiAgICByZXR1cm4gQXJyYXkuZnJvbSh0aGlzLnRhZ3MudmFsdWVzKCkpXG4gICAgICAuc29ydCgoYSwgYikgPT4gYS5rZXkubG9jYWxlQ29tcGFyZShiLmtleSkpO1xuICB9XG59XG4iXX0=