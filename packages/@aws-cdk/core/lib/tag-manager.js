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
_a = JSII_RTTI_SYMBOL_1;
TagManager[_a] = { fqn: "@aws-cdk/core.TagManager", version: "0.0.0" };
exports.TagManager = TagManager;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFnLW1hbmFnZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ0YWctbWFuYWdlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxpREFBeUM7QUFFekMsaUNBQThCO0FBMkQ5Qjs7R0FFRztBQUNILE1BQU0saUJBQWlCO0lBQ2QsU0FBUyxDQUFDLGVBQW9CLEVBQUUsUUFBZ0I7UUFDckQsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsZUFBZSxDQUFDLEVBQUU7WUFDbkMsTUFBTSxJQUFJLEtBQUssQ0FBQyx5REFBeUQsSUFBSSxDQUFDLFNBQVMsQ0FBQyxlQUFlLENBQUMsRUFBRSxDQUFDLENBQUM7U0FDN0c7UUFFRCxNQUFNLElBQUksR0FBVSxFQUFFLENBQUM7UUFDdkIsTUFBTSxXQUFXLEdBQVEsRUFBRSxDQUFDO1FBQzVCLEtBQUssTUFBTSxHQUFHLElBQUksZUFBZSxFQUFFO1lBQ2pDLElBQUksR0FBRyxDQUFDLEdBQUcsS0FBSyxTQUFTLElBQUksR0FBRyxDQUFDLEtBQUssS0FBSyxTQUFTLEVBQUU7Z0JBQ3BELFdBQVcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7YUFDdkI7aUJBQU07Z0JBQ0wsNkNBQTZDO2dCQUM3QyxJQUFJLENBQUMsSUFBSSxDQUFDO29CQUNSLEdBQUcsRUFBRSxHQUFHLEdBQUcsQ0FBQyxHQUFHLEVBQUU7b0JBQ2pCLEtBQUssRUFBRSxHQUFHLEdBQUcsQ0FBQyxLQUFLLEVBQUU7b0JBQ3JCLFFBQVE7aUJBQ1QsQ0FBQyxDQUFDO2FBQ0o7U0FDRjtRQUNELE9BQU8sRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFLENBQUM7S0FDOUI7SUFFTSxVQUFVLENBQUMsSUFBVztRQUMzQixNQUFNLE9BQU8sR0FBYSxFQUFFLENBQUM7UUFDN0IsS0FBSyxNQUFNLEdBQUcsSUFBSSxJQUFJLEVBQUU7WUFDdEIsT0FBTyxDQUFDLElBQUksQ0FBQztnQkFDWCxHQUFHLEVBQUUsR0FBRyxDQUFD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QVc7UUFDNUIsS0FBSyxNQUFNLEdBQUcsSUFBSSxJQUFJLEVBQUU7WUFDdEIsSUFBSSxHQUFHLENBQUMsUUFBUSxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFO2dCQUN2RCxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO2dCQUM1QixJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQzthQUM1QztTQUNGO0tBQ0Y7SUFFRCxJQUFZLFVBQVU7UUFDcEIsT0FBTyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7YUFDbEMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7S0FDL0M7Ozs7QUFySVUsZ0NBQVUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBUYWdUeXBlIH0gZnJvbSAnLi9jZm4tcmVzb3VyY2UnO1xuaW1wb3J0IHsgQ2ZuVGFnIH0gZnJvbSAnLi9jZm4tdGFnJztcbmltcG9ydCB7IExhenkgfSBmcm9tICcuL2xhenknO1xuaW1wb3J0IHsgSVJlc29sdmFibGUgfSBmcm9tICcuL3Jlc29sdmFibGUnO1xuXG5pbnRlcmZhY2UgVGFnIHtcbiAga2V5OiBzdHJpbmc7XG4gIHZhbHVlOiBzdHJpbmc7XG4gIHByaW9yaXR5OiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIEBkZWZhdWx0IHRydWVcbiAgICovXG4gIGFwcGx5VG9MYXVuY2hlZEluc3RhbmNlcz86IGJvb2xlYW47XG59XG5cbmludGVyZmFjZSBDZm5Bc2dUYWcge1xuICBrZXk6IHN0cmluZztcbiAgdmFsdWU6IHN0cmluZztcbiAgcHJvcGFnYXRlQXRMYXVuY2g6IGJvb2xlYW47XG59XG5cbmludGVyZmFjZSBTdGFja1RhZyB7XG4gIEtleTogc3RyaW5nO1xuICBWYWx1ZTogc3RyaW5nO1xufVxuXG4vKipcbiAqIFRoZSByZXN1bHRzIG9mIHBhcnNpbmcgVGFncy5cbiAqL1xuaW50ZXJmYWNlIFBhcnNlVGFnc1Jlc3VsdCB7XG4gIC8qKlxuICAgKiBUaGUgXCJzaW1wbGVcIiAobWVhbmluZywgbm90IGluY2x1ZGluZyBjb21wbGV4IENsb3VkRm9ybWF0aW9uIGZ1bmN0aW9ucylcbiAgICogdGFncyB0aGF0IHdlcmUgZm91bmQuXG4gICAqL1xuICByZWFkb25seSB0YWdzOiBUYWdbXTtcblxuICAvKipcbiAgICogVGhlIGNvbGxlY3Rpb24gb2YgXCJkeW5hbWljXCIgKG1lYW5pbmcsIGluY2x1ZGluZyBjb21wbGV4IENsb3VkRm9ybWF0aW9uIGZ1bmN0aW9ucylcbiAgICogdGFncyB0aGF0IHdlcmUgZm91bmQuXG4gICAqL1xuICByZWFkb25seSBkeW5hbWljVGFnczogYW55O1xufVxuXG4vKipcbiAqIEludGVyZmFjZSBmb3IgY29udmVydGVyIGJldHdlZW4gQ2xvdWRGb3JtYXRpb24gYW5kIGludGVybmFsIHRhZyByZXByZXNlbnRhdGlvbnNcbiAqL1xuaW50ZXJmYWNlIElUYWdGb3JtYXR0ZXIge1xuICAvKipcbiAgICogRm9ybWF0IHRoZSBnaXZlbiB0YWdzIGFzIENsb3VkRm9ybWF0aW9uIHRhZ3NcbiAgICovXG4gIGZvcm1hdFRhZ3ModGFnczogVGFnW10pOiBhbnk7XG5cbiAgLyoqXG4gICAqIFBhcnNlIHRoZSBDbG91ZEZvcm1hdGlvbiB0YWcgcmVwcmVzZW50YXRpb24gaW50byBpbnRlcm5hbCByZXByZXNlbnRhdGlvblxuICAgKlxuICAgKiBVc2UgdGhlIGdpdmVuIHByaW9yaXR5LlxuICAgKi9cbiAgcGFyc2VUYWdzKGNmblByb3BlcnR5VGFnczogYW55LCBwcmlvcml0eTogbnVtYmVyKTogUGFyc2VUYWdzUmVzdWx0O1xufVxuXG4vKipcbiAqIFN0YW5kYXJkIHRhZ3MgYXJlIGEgbGlzdCBvZiB7IGtleSwgdmFsdWUgfSBvYmplY3RzXG4gKi9cbmNsYXNzIFN0YW5kYXJkRm9ybWF0dGVyIGltcGxlbWVudHMgSVRhZ0Zvcm1hdHRlciB7XG4gIHB1YmxpYyBwYXJzZVRhZ3MoY2ZuUHJvcGVydHlUYWdzOiBhbnksIHByaW9yaXR5OiBudW1iZXIpOiBQYXJzZVRhZ3NSZXN1bHQge1xuICAgIGlmICghQXJyYXkuaXNBcnJheShjZm5Qcm9wZXJ0eVRhZ3MpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgdGFnIGlucHV0IGV4cGVjdGVkIGFycmF5IG9mIHtrZXksIHZhbHVlfSBoYXZlICR7SlNPTi5zdHJpbmdpZnkoY2ZuUHJvcGVydHlUYWdzKX1gKTtcbiAgICB9XG5cbiAgICBjb25zdCB0YWdzOiBUYWdbXSA9IFtdO1xuICAgIGNvbnN0IGR5bmFtaWNUYWdzOiBhbnkgPSBbXTtcbiAgICBmb3IgKGNvbnN0IHRhZyBvZiBjZm5Qcm9wZXJ0eVRhZ3MpIHtcbiAgICAgIGlmICh0YWcua2V5ID09PSB1bmRlZmluZWQgfHwgdGFnLnZhbHVlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgZHluYW1pY1RhZ3MucHVzaCh0YWcpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gdXNpbmcgaW50ZXJwIHRvIGVuc3VyZSBUb2tlbiBpcyBub3cgc3RyaW5nXG4gICAgICAgIHRhZ3MucHVzaCh7XG4gICAgICAgICAga2V5OiBgJHt0YWcua2V5fWAsXG4gICAgICAgICAgdmFsdWU6IGAke3RhZy52YWx1ZX1gLFxuICAgICAgICAgIHByaW9yaXR5LFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHsgdGFncywgZHluYW1pY1RhZ3MgfTtcbiAgfVxuXG4gIHB1YmxpYyBmb3JtYXRUYWdzKHRhZ3M6IFRhZ1tdKTogYW55IHtcbiAgICBjb25zdCBjZm5UYWdzOiBDZm5UYWdbXSA9IFtdO1xuICAgIGZvciAoY29uc3QgdGFnIG9mIHRhZ3MpIHtcbiAgICAgIGNmblRhZ3MucHVzaCh7XG4gICAgICAgIGtleTogdGFnLmtleSxcbiAgICAgICAgdmFsdWU6IHRhZy52YWx1ZSxcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gY2ZuVGFncztcbiAgfVxufVxuXG4vKipcbiAqIEFTRyB0YWdzIGFyZSBhIGxpc3Qgb2YgeyBrZXksIHZhbHVlLCBwcm9wYWdhdGVBdExhdW5jaCB9IG9iamVjdHNcbiAqL1xuY2xhc3MgQXNnRm9ybWF0dGVyIGltcGxlbWVudHMgSVRhZ0Zvcm1hdHRlciB7XG4gIHB1YmxpYyBwYXJzZVRhZ3MoY2ZuUHJvcGVydHlUYWdzOiBhbnksIHByaW9yaXR5OiBudW1iZXIpOiBQYXJzZVRhZ3NSZXN1bHQge1xuICAgIGlmICghQXJyYXkuaXNBcnJheShjZm5Qcm9wZXJ0eVRhZ3MpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgdGFnIGlucHV0IGV4cGVjdGVkIGFycmF5IG9mIHtrZXksIHZhbHVlLCBwcm9wYWdhdGVBdExhdW5jaH0gaGF2ZSAke0pTT04uc3RyaW5naWZ5KGNmblByb3BlcnR5VGFncyl9YCk7XG4gICAgfVxuXG4gICAgY29uc3QgdGFnczogVGFnW10gPSBbXTtcbiAgICBjb25zdCBkeW5hbWljVGFnczogYW55ID0gW107XG4gICAgZm9yIChjb25zdCB0YWcgb2YgY2ZuUHJvcGVydHlUYWdzKSB7XG4gICAgICBpZiAodGFnLmtleSA9PT0gdW5kZWZpbmVkIHx8XG4gICAgICAgICAgdGFnLnZhbHVlID09PSB1bmRlZmluZWQgfHxcbiAgICAgICAgICB0YWcucHJvcGFnYXRlQXRMYXVuY2ggPT09IHVuZGVmaW5lZCkge1xuICAgICAgICBkeW5hbWljVGFncy5wdXNoKHRhZyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyB1c2luZyBpbnRlcnAgdG8gZW5zdXJlIFRva2VuIGlzIG5vdyBzdHJpbmdcbiAgICAgICAgdGFncy5wdXNoKHtcbiAgICAgICAgICBrZXk6IGAke3RhZy5rZXl9YCxcbiAgICAgICAgICB2YWx1ZTogYCR7dGFnLnZhbHVlfWAsXG4gICAgICAgICAgcHJpb3JpdHksXG4gICAgICAgICAgYXBwbHlUb0xhdW5jaGVkSW5zdGFuY2VzOiAhIXRhZy5wcm9wYWdhdGVBdExhdW5jaCxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHsgdGFncywgZHluYW1pY1RhZ3MgfTtcbiAgfVxuXG4gIHB1YmxpYyBmb3JtYXRUYWdzKHRhZ3M6IFRhZ1tdKTogYW55IHtcbiAgICBjb25zdCBjZm5UYWdzOiBDZm5Bc2dUYWdbXSA9IFtdO1xuICAgIGZvciAoY29uc3QgdGFnIG9mIHRhZ3MpIHtcbiAgICAgIGNmblRhZ3MucHVzaCh7XG4gICAgICAgIGtleTogdGFnLmtleSxcbiAgICAgICAgdmFsdWU6IHRhZy52YWx1ZSxcbiAgICAgICAgcHJvcGFnYXRlQXRMYXVuY2g6IHRhZy5hcHBseVRvTGF1bmNoZWRJbnN0YW5jZXMgIT09IGZhbHNlLFxuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiBjZm5UYWdzO1xuICB9XG59XG5cbi8qKlxuICogU29tZSBDbG91ZEZvcm1hdGlvbiBjb25zdHJ1Y3RzIHVzZSBhIHsga2V5OiB2YWx1ZSB9IG1hcCBmb3IgdGFnc1xuICovXG5jbGFzcyBNYXBGb3JtYXR0ZXIgaW1wbGVtZW50cyBJVGFnRm9ybWF0dGVyIHtcbiAgcHVibGljIHBhcnNlVGFncyhjZm5Qcm9wZXJ0eVRhZ3M6IGFueSwgcHJpb3JpdHk6IG51bWJlcik6IFBhcnNlVGFnc1Jlc3VsdCB7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkoY2ZuUHJvcGVydHlUYWdzKSB8fCB0eXBlb2YoY2ZuUHJvcGVydHlUYWdzKSAhPT0gJ29iamVjdCcpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgSW52YWxpZCB0YWcgaW5wdXQgZXhwZWN0ZWQgbWFwIG9mIHtrZXk6IHZhbHVlfSBoYXZlICR7SlNPTi5zdHJpbmdpZnkoY2ZuUHJvcGVydHlUYWdzKX1gKTtcbiAgICB9XG5cbiAgICBjb25zdCB0YWdzOiBUYWdbXSA9IFtdO1xuICAgIGZvciAoY29uc3QgW2tleSwgdmFsdWVdIG9mIE9iamVjdC5lbnRyaWVzKGNmblByb3BlcnR5VGFncykpIHtcbiAgICAgIHRhZ3MucHVzaCh7XG4gICAgICAgIGtleSxcbiAgICAgICAgdmFsdWU6IGAke3ZhbHVlfWAsXG4gICAgICAgIHByaW9yaXR5LFxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHsgdGFncywgZHluYW1pY1RhZ3M6IHVuZGVmaW5lZCB9O1xuICB9XG5cbiAgcHVibGljIGZvcm1hdFRhZ3ModGFnczogVGFnW10pOiBhbnkge1xuICAgIGNvbnN0IGNmblRhZ3M6IHsgW2tleTogc3RyaW5nXTogc3RyaW5nIH0gPSB7fTtcbiAgICBmb3IgKGNvbnN0IHRhZyBvZiB0YWdzKSB7XG4gICAgICBjZm5UYWdzW2Ake3RhZy5rZXl9YF0gPSBgJHt0YWcudmFsdWV9YDtcbiAgICB9XG4gICAgcmV0dXJuIGNmblRhZ3M7XG4gIH1cbn1cblxuLyoqXG4gKiBTdGFja1RhZ3MgYXJlIG9mIHRoZSBmb3JtYXQgeyBLZXk6IGtleSwgVmFsdWU6IHZhbHVlIH1cbiAqL1xuY2xhc3MgS2V5VmFsdWVGb3JtYXR0ZXIgaW1wbGVtZW50cyBJVGFnRm9ybWF0dGVyIHtcbiAgcHVibGljIHBhcnNlVGFncyhrZXlWYWx1ZVRhZ3M6IGFueSwgcHJpb3JpdHk6IG51bWJlcik6IFBhcnNlVGFnc1Jlc3VsdCB7XG4gICAgY29uc3QgdGFnczogVGFnW10gPSBbXTtcbiAgICBmb3IgKGNvbnN0IGtleSBpbiBrZXlWYWx1ZVRhZ3MpIHtcbiAgICAgIGlmIChrZXlWYWx1ZVRhZ3MuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICBjb25zdCB2YWx1ZSA9IGtleVZhbHVlVGFnc1trZXldO1xuICAgICAgICB0YWdzLnB1c2goe1xuICAgICAgICAgIGtleSxcbiAgICAgICAgICB2YWx1ZSxcbiAgICAgICAgICBwcmlvcml0eSxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB7IHRhZ3MsIGR5bmFtaWNUYWdzOiB1bmRlZmluZWQgfTtcbiAgfVxuXG4gIHB1YmxpYyBmb3JtYXRUYWdzKHVuZm9ybWF0dGVkVGFnczogVGFnW10pOiBhbnkge1xuICAgIGNvbnN0IHRhZ3M6IFN0YWNrVGFnW10gPSBbXTtcbiAgICB1bmZvcm1hdHRlZFRhZ3MuZm9yRWFjaCh0YWcgPT4ge1xuICAgICAgdGFncy5wdXNoKHtcbiAgICAgICAgS2V5OiB0YWcua2V5LFxuICAgICAgICBWYWx1ZTogdGFnLnZhbHVlLFxuICAgICAgfSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHRhZ3M7XG4gIH1cbn1cblxuY2xhc3MgTm9Gb3JtYXQgaW1wbGVtZW50cyBJVGFnRm9ybWF0dGVyIHtcbiAgcHVibGljIHBhcnNlVGFncyhfY2ZuUHJvcGVydHlUYWdzOiBhbnkpOiBQYXJzZVRhZ3NSZXN1bHQge1xuICAgIHJldHVybiB7IHRhZ3M6IFtdLCBkeW5hbWljVGFnczogdW5kZWZpbmVkIH07XG4gIH1cblxuICBwdWJsaWMgZm9ybWF0VGFncyhfdGFnczogVGFnW10pOiBhbnkge1xuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cbn1cblxubGV0IF90YWdGb3JtYXR0ZXJzQ2FjaGU6IHtba2V5OiBzdHJpbmddOiBJVGFnRm9ybWF0dGVyfSB8IHVuZGVmaW5lZDtcblxuLyoqXG4gKiBBY2Nlc3MgdGFnIGZvcm1hdHRlcnMgdGFibGVcbiAqXG4gKiBJbiBhIGZ1bmN0aW9uIGJlY2F1c2Ugd2UncmUgaW4gYSBsb2FkIGN5Y2xlIHdpdGggY2ZuLXJlc291cmNlIHRoYXQgZGVmaW5lcyBgVGFnVHlwZWAuXG4gKi9cbmZ1bmN0aW9uIFRBR19GT1JNQVRURVJTKCk6IHtba2V5OiBzdHJpbmddOiBJVGFnRm9ybWF0dGVyfSB7XG4gIHJldHVybiBfdGFnRm9ybWF0dGVyc0NhY2hlID8/IChfdGFnRm9ybWF0dGVyc0NhY2hlID0ge1xuICAgIFtUYWdUeXBlLkFVVE9TQ0FMSU5HX0dST1VQXTogbmV3IEFzZ0Zvcm1hdHRlcigpLFxuICAgIFtUYWdUeXBlLlNUQU5EQVJEXTogbmV3IFN0YW5kYXJkRm9ybWF0dGVyKCksXG4gICAgW1RhZ1R5cGUuTUFQXTogbmV3IE1hcEZvcm1hdHRlcigpLFxuICAgIFtUYWdUeXBlLktFWV9WQUxVRV06IG5ldyBLZXlWYWx1ZUZvcm1hdHRlcigpLFxuICAgIFtUYWdUeXBlLk5PVF9UQUdHQUJMRV06IG5ldyBOb0Zvcm1hdCgpLFxuICB9KTtcbn1cblxuLyoqXG4gKiBJbnRlcmZhY2UgdG8gaW1wbGVtZW50IHRhZ3MuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgSVRhZ2dhYmxlIHtcbiAgLyoqXG4gICAqIFRhZ01hbmFnZXIgdG8gc2V0LCByZW1vdmUgYW5kIGZvcm1hdCB0YWdzXG4gICAqL1xuICByZWFkb25seSB0YWdzOiBUYWdNYW5hZ2VyO1xufVxuXG4vKipcbiAqIE9wdGlvbnMgdG8gY29uZmlndXJlIFRhZ01hbmFnZXIgYmVoYXZpb3JcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBUYWdNYW5hZ2VyT3B0aW9ucyB7XG4gIC8qKlxuICAgKiBUaGUgbmFtZSBvZiB0aGUgcHJvcGVydHkgaW4gQ2xvdWRGb3JtYXRpb24gZm9yIHRoZXNlIHRhZ3NcbiAgICpcbiAgICogTm9ybWFsbHkgdGhpcyBpcyBgdGFnc2AsIGJ1dCBDb2duaXRvIFVzZXJQb29sIHVzZXMgVXNlclBvb2xUYWdzXG4gICAqXG4gICAqIEBkZWZhdWx0IFwidGFnc1wiXG4gICAqL1xuICByZWFkb25seSB0YWdQcm9wZXJ0eU5hbWU/OiBzdHJpbmc7XG59XG5cbi8qKlxuICogVGFnTWFuYWdlciBmYWNpbGl0YXRlcyBhIGNvbW1vbiBpbXBsZW1lbnRhdGlvbiBvZiB0YWdnaW5nIGZvciBDb25zdHJ1Y3RzXG4gKlxuICogTm9ybWFsbHksIHlvdSBkbyBub3QgbmVlZCB0byB1c2UgdGhpcyBjbGFzcywgYXMgdGhlIENsb3VkRm9ybWF0aW9uIHNwZWNpZmljYXRpb25cbiAqIHdpbGwgaW5kaWNhdGUgd2hpY2ggcmVzb3VyY2VzIGFyZSB0YWdnYWJsZS4gSG93ZXZlciwgc29tZXRpbWVzIHlvdSB3aWxsIG5lZWQgdGhpc1xuICogdG8gbWFrZSBjdXN0b20gcmVzb3VyY2VzIHRhZ2dhYmxlLiBVc2VkIGB0YWdNYW5hZ2VyLnJlbmRlcmVkVGFnc2AgdG8gb2J0YWluIGFcbiAqIHZhbHVlIHRoYXQgd2lsbCByZXNvbHZlIHRvIHRoZSB0YWdzIGF0IHN5bnRoZXNpcyB0aW1lLlxuICpcbiAqIEBleGFtcGxlXG4gKiBpbXBvcnQgKiBhcyBjZGsgZnJvbSAnQGF3cy1jZGsvY29yZSc7XG4gKlxuICogY2xhc3MgTXlDb25zdHJ1Y3QgZXh0ZW5kcyBjZGsuUmVzb3VyY2UgaW1wbGVtZW50cyBjZGsuSVRhZ2dhYmxlIHtcbiAqICAgcHVibGljIHJlYWRvbmx5IHRhZ3MgPSBuZXcgY2RrLlRhZ01hbmFnZXIoY2RrLlRhZ1R5cGUuS0VZX1ZBTFVFLCAnV2hhdGV2ZXI6OlRoZTo6VHlwZScpO1xuICpcbiAqICAgY29uc3RydWN0b3Ioc2NvcGU6IGNkay5Db25zdHJ1Y3QsIGlkOiBzdHJpbmcpIHtcbiAqICAgICBzdXBlcihzY29wZSwgaWQpO1xuICpcbiAqICAgICBuZXcgY2RrLkNmblJlc291cmNlKHRoaXMsICdSZXNvdXJjZScsIHtcbiAqICAgICAgIHR5cGU6ICdXaGF0ZXZlcjo6VGhlOjpUeXBlJyxcbiAqICAgICAgIHByb3BlcnRpZXM6IHtcbiAqICAgICAgICAgLy8gLi4uXG4gKiAgICAgICAgIFRhZ3M6IHRoaXMudGFncy5yZW5kZXJlZFRhZ3MsXG4gKiAgICAgICB9LFxuICogICAgIH0pO1xuICogICB9XG4gKiB9XG4gKlxuICovXG5leHBvcnQgY2xhc3MgVGFnTWFuYWdlciB7XG4gIC8qKlxuICAgKiBDaGVjayB3aGV0aGVyIHRoZSBnaXZlbiBjb25zdHJ1Y3QgaXMgVGFnZ2FibGVcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgaXNUYWdnYWJsZShjb25zdHJ1Y3Q6IGFueSk6IGNvbnN0cnVjdCBpcyBJVGFnZ2FibGUge1xuICAgIHJldHVybiAoY29uc3RydWN0IGFzIGFueSkudGFncyAhPT0gdW5kZWZpbmVkO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBwcm9wZXJ0eSBuYW1lIGZvciB0YWcgdmFsdWVzXG4gICAqXG4gICAqIE5vcm1hbGx5IHRoaXMgaXMgYHRhZ3NgIGJ1dCBzb21lIHJlc291cmNlcyBjaG9vc2UgYSBkaWZmZXJlbnQgbmFtZS4gQ29nbml0b1xuICAgKiBVc2VyUG9vbCB1c2VzIFVzZXJQb29sVGFnc1xuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IHRhZ1Byb3BlcnR5TmFtZTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBBIGxhenkgdmFsdWUgdGhhdCByZXByZXNlbnRzIHRoZSByZW5kZXJlZCB0YWdzIGF0IHN5bnRoZXNpcyB0aW1lXG4gICAqXG4gICAqIElmIHlvdSBuZWVkIHRvIG1ha2UgYSBjdXN0b20gY29uc3RydWN0IHRhZ2dhYmxlLCB1c2UgdGhlIHZhbHVlIG9mIHRoaXNcbiAgICogcHJvcGVydHkgdG8gcGFzcyB0byB0aGUgYHRhZ3NgIHByb3BlcnR5IG9mIHRoZSB1bmRlcmx5aW5nIGNvbnN0cnVjdC5cbiAgICovXG4gIHB1YmxpYyByZWFkb25seSByZW5kZXJlZFRhZ3M6IElSZXNvbHZhYmxlO1xuXG4gIHByaXZhdGUgcmVhZG9ubHkgdGFncyA9IG5ldyBNYXA8c3RyaW5nLCBUYWc+KCk7XG4gIHByaXZhdGUgcmVhZG9ubHkgZHluYW1pY1RhZ3M6IGFueTtcbiAgcHJpdmF0ZSByZWFkb25seSBwcmlvcml0aWVzID0gbmV3IE1hcDxzdHJpbmcsIG51bWJlcj4oKTtcbiAgcHJpdmF0ZSByZWFkb25seSB0YWdGb3JtYXR0ZXI6IElUYWdGb3JtYXR0ZXI7XG4gIHByaXZhdGUgcmVhZG9ubHkgcmVzb3VyY2VUeXBlTmFtZTogc3RyaW5nO1xuICBwcml2YXRlIHJlYWRvbmx5IGluaXRpYWxUYWdQcmlvcml0eSA9IDUwO1xuXG4gIGNvbnN0cnVjdG9yKHRhZ1R5cGU6IFRhZ1R5cGUsIHJlc291cmNlVHlwZU5hbWU6IHN0cmluZywgdGFnU3RydWN0dXJlPzogYW55LCBvcHRpb25zOiBUYWdNYW5hZ2VyT3B0aW9ucyA9IHsgfSkge1xuICAgIHRoaXMucmVzb3VyY2VUeXBlTmFtZSA9IHJlc291cmNlVHlwZU5hbWU7XG4gICAgdGhpcy50YWdGb3JtYXR0ZXIgPSBUQUdfRk9STUFUVEVSUygpW3RhZ1R5cGVdO1xuICAgIGlmICh0YWdTdHJ1Y3R1cmUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgY29uc3QgcGFyc2VUYWdzUmVzdWx0ID0gdGhpcy50YWdGb3JtYXR0ZXIucGFyc2VUYWdzKHRhZ1N0cnVjdHVyZSwgdGhpcy5pbml0aWFsVGFnUHJpb3JpdHkpO1xuICAgICAgdGhpcy5keW5hbWljVGFncyA9IHBhcnNlVGFnc1Jlc3VsdC5keW5hbWljVGFncztcbiAgICAgIHRoaXMuX3NldFRhZyguLi5wYXJzZVRhZ3NSZXN1bHQudGFncyk7XG4gICAgfVxuICAgIHRoaXMudGFnUHJvcGVydHlOYW1lID0gb3B0aW9ucy50YWdQcm9wZXJ0eU5hbWUgfHwgJ3RhZ3MnO1xuXG4gICAgdGhpcy5yZW5kZXJlZFRhZ3MgPSBMYXp5LmFueSh7IHByb2R1Y2U6ICgpID0+IHRoaXMucmVuZGVyVGFncygpIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgdGhlIHNwZWNpZmllZCB0YWcgdG8gdGhlIGFycmF5IG9mIHRhZ3NcbiAgICpcbiAgICovXG4gIHB1YmxpYyBzZXRUYWcoa2V5OiBzdHJpbmcsIHZhbHVlOiBzdHJpbmcsIHByaW9yaXR5ID0gMCwgYXBwbHlUb0xhdW5jaGVkSW5zdGFuY2VzID0gdHJ1ZSk6IHZvaWQge1xuICAgIC8vIFRoaXMgbWV0aG9kIG1vc3RseSBleGlzdHMgYmVjYXVzZSB3ZSBkb24ndCB3YW50IHRvIGV4cG9zZSB0aGUgJ1RhZycgdHlwZSB1c2VkIChpdCB3aWxsIGJlIGNvbmZ1c2luZ1xuICAgIC8vIHRvIHVzZXJzKS5cbiAgICB0aGlzLl9zZXRUYWcoeyBrZXksIHZhbHVlLCBwcmlvcml0eSwgYXBwbHlUb0xhdW5jaGVkSW5zdGFuY2VzIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZXMgdGhlIHNwZWNpZmllZCB0YWcgZnJvbSB0aGUgYXJyYXkgaWYgaXQgZXhpc3RzXG4gICAqXG4gICAqIEBwYXJhbSBrZXkgVGhlIHRhZyB0byByZW1vdmVcbiAgICogQHBhcmFtIHByaW9yaXR5IFRoZSBwcmlvcml0eSBvZiB0aGUgcmVtb3ZlIG9wZXJhdGlvblxuICAgKi9cbiAgcHVibGljIHJlbW92ZVRhZyhrZXk6IHN0cmluZywgcHJpb3JpdHk6IG51bWJlcik6IHZvaWQge1xuICAgIGlmIChwcmlvcml0eSA+PSAodGhpcy5wcmlvcml0aWVzLmdldChrZXkpIHx8IDApKSB7XG4gICAgICB0aGlzLnRhZ3MuZGVsZXRlKGtleSk7XG4gICAgICB0aGlzLnByaW9yaXRpZXMuc2V0KGtleSwgcHJpb3JpdHkpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZW5kZXJzIHRhZ3MgaW50byB0aGUgcHJvcGVyIGZvcm1hdCBiYXNlZCBvbiBUYWdUeXBlXG4gICAqXG4gICAqIFRoaXMgbWV0aG9kIHdpbGwgZWFnZXJseSByZW5kZXIgdGhlIHRhZ3MgY3VycmVudGx5IGFwcGxpZWQuIEluXG4gICAqIG1vc3QgY2FzZXMsIHlvdSBzaG91bGQgYmUgdXNpbmcgYHRhZ01hbmFnZXIucmVuZGVyZWRUYWdzYCBpbnN0ZWFkLFxuICAgKiB3aGljaCB3aWxsIHJldHVybiBhIGBMYXp5YCB2YWx1ZSB0aGF0IHdpbGwgcmVzb2x2ZSB0byB0aGUgY29ycmVjdFxuICAgKiB0YWdzIGF0IHN5bnRoZXNpcyB0aW1lLlxuICAgKi9cbiAgcHVibGljIHJlbmRlclRhZ3MoKTogYW55IHtcbiAgICBjb25zdCBmb3JtYXR0ZWRUYWdzID0gdGhpcy50YWdGb3JtYXR0ZXIuZm9ybWF0VGFncyh0aGlzLnNvcnRlZFRhZ3MpO1xuICAgIGlmIChBcnJheS5pc0FycmF5KGZvcm1hdHRlZFRhZ3MpIHx8IEFycmF5LmlzQXJyYXkodGhpcy5keW5hbWljVGFncykpIHtcbiAgICAgIGNvbnN0IHJldCA9IFsuLi5mb3JtYXR0ZWRUYWdzID8/IFtdLCAuLi50aGlzLmR5bmFtaWNUYWdzID8/IFtdXTtcbiAgICAgIHJldHVybiByZXQubGVuZ3RoID4gMCA/IHJldCA6IHVuZGVmaW5lZDtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgcmV0ID0geyAuLi5mb3JtYXR0ZWRUYWdzID8/IHt9LCAuLi50aGlzLmR5bmFtaWNUYWdzID8/IHt9IH07XG4gICAgICByZXR1cm4gT2JqZWN0LmtleXMocmV0KS5sZW5ndGggPiAwID8gcmV0IDogdW5kZWZpbmVkO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZW5kZXIgdGhlIHRhZ3MgaW4gYSByZWFkYWJsZSBmb3JtYXRcbiAgICovXG4gIHB1YmxpYyB0YWdWYWx1ZXMoKTogUmVjb3JkPHN0cmluZywgc3RyaW5nPiB7XG4gICAgY29uc3QgcmV0OiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge307XG4gICAgZm9yIChjb25zdCB0YWcgb2YgdGhpcy5zb3J0ZWRUYWdzKSB7XG4gICAgICByZXRbdGFnLmtleV0gPSB0YWcudmFsdWU7XG4gICAgfVxuICAgIHJldHVybiByZXQ7XG4gIH1cblxuICAvKipcbiAgICogRGV0ZXJtaW5lIGlmIHRoZSBhc3BlY3QgYXBwbGllcyBoZXJlXG4gICAqXG4gICAqIExvb2tzIGF0IHRoZSBpbmNsdWRlIGFuZCBleGNsdWRlIHJlc291cmNlVHlwZU5hbWUgYXJyYXlzIHRvIGRldGVybWluZSBpZlxuICAgKiB0aGUgYXNwZWN0IGFwcGxpZXMgaGVyZVxuICAgKi9cbiAgcHVibGljIGFwcGx5VGFnQXNwZWN0SGVyZShpbmNsdWRlPzogc3RyaW5nW10sIGV4Y2x1ZGU/OiBzdHJpbmdbXSkge1xuICAgIGlmIChleGNsdWRlICYmIGV4Y2x1ZGUubGVuZ3RoID4gMCAmJiBleGNsdWRlLmluZGV4T2YodGhpcy5yZXNvdXJjZVR5cGVOYW1lKSAhPT0gLTEpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgaWYgKGluY2x1ZGUgJiYgaW5jbHVkZS5sZW5ndGggPiAwICYmIGluY2x1ZGUuaW5kZXhPZih0aGlzLnJlc291cmNlVHlwZU5hbWUpID09PSAtMSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdHJ1ZSBpZiB0aGVyZSBhcmUgYW55IHRhZ3MgZGVmaW5lZFxuICAgKi9cbiAgcHVibGljIGhhc1RhZ3MoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMudGFncy5zaXplID4gMDtcbiAgfVxuXG4gIHByaXZhdGUgX3NldFRhZyguLi50YWdzOiBUYWdbXSkge1xuICAgIGZvciAoY29uc3QgdGFnIG9mIHRhZ3MpIHtcbiAgICAgIGlmICh0YWcucHJpb3JpdHkgPj0gKHRoaXMucHJpb3JpdGllcy5nZXQodGFnLmtleSkgfHwgMCkpIHtcbiAgICAgICAgdGhpcy50YWdzLnNldCh0YWcua2V5LCB0YWcpO1xuICAgICAgICB0aGlzLnByaW9yaXRpZXMuc2V0KHRhZy5rZXksIHRhZy5wcmlvcml0eSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBnZXQgc29ydGVkVGFncygpOiBUYWdbXSB7XG4gICAgcmV0dXJuIEFycmF5LmZyb20odGhpcy50YWdzLnZhbHVlcygpKVxuICAgICAgLnNvcnQoKGEsIGIpID0+IGEua2V5LmxvY2FsZUNvbXBhcmUoYi5rZXkpKTtcbiAgfVxufVxuIl19