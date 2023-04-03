"use strict";
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemoveTag = exports.Tags = exports.Tag = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const annotations_1 = require("./annotations");
const aspect_1 = require("./aspect");
const tag_manager_1 = require("./tag-manager");
/**
 * The common functionality for Tag and Remove Tag Aspects
 */
class TagBase {
    constructor(key, props = {}) {
        this.key = key;
        this.props = props;
    }
    visit(construct) {
        if (tag_manager_1.TagManager.isTaggable(construct)) {
            this.applyTag(construct);
        }
    }
}
/**
 * The Tag Aspect will handle adding a tag to this node and cascading tags to children
 */
class Tag extends TagBase {
    constructor(key, value, props = {}) {
        super(key, props);
        this.defaultPriority = 100;
        try {
            jsiiDeprecationWarnings._aws_cdk_core_TagProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, Tag);
            }
            throw error;
        }
        if (value === undefined) {
            throw new Error('Tag must have a value');
        }
        this.value = value;
    }
    /**
     * DEPRECATED: add tags to the node of a construct and all its the taggable children
     *
     * @deprecated use `Tags.of(scope).add()`
     */
    static add(scope, key, value, props = {}) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/core.Tag#add", "use `Tags.of(scope).add()`");
            jsiiDeprecationWarnings._aws_cdk_core_TagProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.add);
            }
            throw error;
        }
        annotations_1.Annotations.of(scope).addDeprecation('@aws-cdk/core.Tag.add(scope,k,v)', 'Use "Tags.of(scope).add(k,v)" instead');
        Tags.of(scope).add(key, value, props);
    }
    /**
     * DEPRECATED: remove tags to the node of a construct and all its the taggable children
     *
     * @deprecated use `Tags.of(scope).remove()`
     */
    static remove(scope, key, props = {}) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/core.Tag#remove", "use `Tags.of(scope).remove()`");
            jsiiDeprecationWarnings._aws_cdk_core_TagProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.remove);
            }
            throw error;
        }
        annotations_1.Annotations.of(scope).addDeprecation('@aws-cdk/core.Tag.remove(scope,k,v)', 'Use "Tags.of(scope).remove(k,v)" instead');
        Tags.of(scope).remove(key, props);
    }
    applyTag(resource) {
        try {
            jsiiDeprecationWarnings._aws_cdk_core_ITaggable(resource);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.applyTag);
            }
            throw error;
        }
        if (resource.tags.applyTagAspectHere(this.props.includeResourceTypes, this.props.excludeResourceTypes)) {
            resource.tags.setTag(this.key, this.value, this.props.priority ?? this.defaultPriority, this.props.applyToLaunchedInstances !== false);
        }
    }
}
exports.Tag = Tag;
_a = JSII_RTTI_SYMBOL_1;
Tag[_a] = { fqn: "@aws-cdk/core.Tag", version: "0.0.0" };
/**
 * Manages AWS tags for all resources within a construct scope.
 */
class Tags {
    constructor(scope) {
        this.scope = scope;
    }
    /**
     * Returns the tags API for this scope.
     * @param scope The scope
     */
    static of(scope) {
        return new Tags(scope);
    }
    /**
     * add tags to the node of a construct and all its the taggable children
     */
    add(key, value, props = {}) {
        try {
            jsiiDeprecationWarnings._aws_cdk_core_TagProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.add);
            }
            throw error;
        }
        aspect_1.Aspects.of(this.scope).add(new Tag(key, value, props));
    }
    /**
     * remove tags to the node of a construct and all its the taggable children
     */
    remove(key, props = {}) {
        try {
            jsiiDeprecationWarnings._aws_cdk_core_TagProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.remove);
            }
            throw error;
        }
        aspect_1.Aspects.of(this.scope).add(new RemoveTag(key, props));
    }
}
exports.Tags = Tags;
_b = JSII_RTTI_SYMBOL_1;
Tags[_b] = { fqn: "@aws-cdk/core.Tags", version: "0.0.0" };
/**
 * The RemoveTag Aspect will handle removing tags from this node and children
 */
class RemoveTag extends TagBase {
    constructor(key, props = {}) {
        super(key, props);
        this.defaultPriority = 200;
        try {
            jsiiDeprecationWarnings._aws_cdk_core_TagProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, RemoveTag);
            }
            throw error;
        }
    }
    applyTag(resource) {
        try {
            jsiiDeprecationWarnings._aws_cdk_core_ITaggable(resource);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.applyTag);
            }
            throw error;
        }
        if (resource.tags.applyTagAspectHere(this.props.includeResourceTypes, this.props.excludeResourceTypes)) {
            resource.tags.removeTag(this.key, this.props.priority ?? this.defaultPriority);
        }
    }
}
exports.RemoveTag = RemoveTag;
_c = JSII_RTTI_SYMBOL_1;
RemoveTag[_c] = { fqn: "@aws-cdk/core.RemoveTag", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFnLWFzcGVjdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInRhZy1hc3BlY3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQ0EsK0NBQTRDO0FBQzVDLHFDQUE0QztBQUM1QywrQ0FBc0Q7QUFxRHREOztHQUVHO0FBQ0gsTUFBZSxPQUFPO0lBU3BCLFlBQVksR0FBVyxFQUFFLFFBQWtCLEVBQUU7UUFDM0MsSUFBSSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUM7UUFDZixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztLQUNwQjtJQUVNLEtBQUssQ0FBQyxTQUFxQjtRQUNoQyxJQUFJLHdCQUFVLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxFQUFFO1lBQ3BDLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUM7U0FDMUI7S0FDRjtDQUdGO0FBRUQ7O0dBRUc7QUFDSCxNQUFhLEdBQUksU0FBUSxPQUFPO0lBNkI5QixZQUFZLEdBQVcsRUFBRSxLQUFhLEVBQUUsUUFBa0IsRUFBRTtRQUMxRCxLQUFLLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBSEgsb0JBQWUsR0FBRyxHQUFHLENBQUM7Ozs7OzsrQ0EzQjVCLEdBQUc7Ozs7UUErQlosSUFBSSxLQUFLLEtBQUssU0FBUyxFQUFFO1lBQ3ZCLE1BQU0sSUFBSSxLQUFLLENBQUMsdUJBQXVCLENBQUMsQ0FBQztTQUMxQztRQUNELElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO0tBQ3BCO0lBakNEOzs7O09BSUc7SUFDSSxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQWdCLEVBQUUsR0FBVyxFQUFFLEtBQWEsRUFBRSxRQUFrQixFQUFFOzs7Ozs7Ozs7OztRQUNsRix5QkFBVyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxjQUFjLENBQUMsa0NBQWtDLEVBQUUsdUNBQXVDLENBQUMsQ0FBQztRQUNsSCxJQUFJLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO0tBQ3ZDO0lBRUQ7Ozs7T0FJRztJQUNJLE1BQU0sQ0FBQyxNQUFNLENBQUMsS0FBZ0IsRUFBRSxHQUFXLEVBQUUsUUFBa0IsRUFBRTs7Ozs7Ozs7Ozs7UUFDdEUseUJBQVcsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsY0FBYyxDQUFDLHFDQUFxQyxFQUFFLDBDQUEwQyxDQUFDLENBQUM7UUFDeEgsSUFBSSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUFDO0tBQ25DO0lBaUJTLFFBQVEsQ0FBQyxRQUFtQjs7Ozs7Ozs7OztRQUNwQyxJQUFJLFFBQVEsQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxvQkFBb0IsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLG9CQUFvQixDQUFDLEVBQUU7WUFDdEcsUUFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQ2xCLElBQUksQ0FBQyxHQUFHLEVBQ1IsSUFBSSxDQUFDLEtBQUssRUFDVixJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsSUFBSSxJQUFJLENBQUMsZUFBZSxFQUMzQyxJQUFJLENBQUMsS0FBSyxDQUFDLHdCQUF3QixLQUFLLEtBQUssQ0FDOUMsQ0FBQztTQUNIO0tBQ0Y7O0FBOUNILGtCQStDQzs7O0FBRUQ7O0dBRUc7QUFDSCxNQUFhLElBQUk7SUFTZixZQUFxQyxLQUFpQjtRQUFqQixVQUFLLEdBQUwsS0FBSyxDQUFZO0tBQUs7SUFSM0Q7OztPQUdHO0lBQ0ksTUFBTSxDQUFDLEVBQUUsQ0FBQyxLQUFpQjtRQUNoQyxPQUFPLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0tBQ3hCO0lBSUQ7O09BRUc7SUFDSSxHQUFHLENBQUMsR0FBVyxFQUFFLEtBQWEsRUFBRSxRQUFrQixFQUFFOzs7Ozs7Ozs7O1FBQ3pELGdCQUFPLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxHQUFHLENBQUMsR0FBRyxFQUFFLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDO0tBQ3hEO0lBRUQ7O09BRUc7SUFDSSxNQUFNLENBQUMsR0FBVyxFQUFFLFFBQWtCLEVBQUU7Ozs7Ozs7Ozs7UUFDN0MsZ0JBQU8sQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLFNBQVMsQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQztLQUN2RDs7QUF2Qkgsb0JBd0JDOzs7QUFFRDs7R0FFRztBQUNILE1BQWEsU0FBVSxTQUFRLE9BQU87SUFJcEMsWUFBWSxHQUFXLEVBQUUsUUFBa0IsRUFBRTtRQUMzQyxLQUFLLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBSEgsb0JBQWUsR0FBRyxHQUFHLENBQUM7Ozs7OzsrQ0FGNUIsU0FBUzs7OztLQU1uQjtJQUVTLFFBQVEsQ0FBQyxRQUFtQjs7Ozs7Ozs7OztRQUNwQyxJQUFJLFFBQVEsQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxvQkFBb0IsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLG9CQUFvQixDQUFDLEVBQUU7WUFDdEcsUUFBUSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsSUFBSSxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUM7U0FDaEY7S0FDRjs7QUFaSCw4QkFhQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbnN0cnVjdCwgSUNvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0IHsgQW5ub3RhdGlvbnMgfSBmcm9tICcuL2Fubm90YXRpb25zJztcbmltcG9ydCB7IElBc3BlY3QsIEFzcGVjdHMgfSBmcm9tICcuL2FzcGVjdCc7XG5pbXBvcnQgeyBJVGFnZ2FibGUsIFRhZ01hbmFnZXIgfSBmcm9tICcuL3RhZy1tYW5hZ2VyJztcblxuLyoqXG4gKiBQcm9wZXJ0aWVzIGZvciBhIHRhZ1xuICovXG5leHBvcnQgaW50ZXJmYWNlIFRhZ1Byb3BzIHtcbiAgLyoqXG4gICAqIFdoZXRoZXIgdGhlIHRhZyBzaG91bGQgYmUgYXBwbGllZCB0byBpbnN0YW5jZXMgaW4gYW4gQXV0b1NjYWxpbmdHcm91cFxuICAgKlxuICAgKiBAZGVmYXVsdCB0cnVlXG4gICAqL1xuICByZWFkb25seSBhcHBseVRvTGF1bmNoZWRJbnN0YW5jZXM/OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBBbiBhcnJheSBvZiBSZXNvdXJjZSBUeXBlcyB0aGF0IHdpbGwgbm90IHJlY2VpdmUgdGhpcyB0YWdcbiAgICpcbiAgICogQW4gZW1wdHkgYXJyYXkgd2lsbCBhbGxvdyB0aGlzIHRhZyB0byBiZSBhcHBsaWVkIHRvIGFsbCByZXNvdXJjZXMuIEFcbiAgICogbm9uLWVtcHR5IGFycmF5IHdpbGwgYXBwbHkgdGhpcyB0YWcgb25seSBpZiB0aGUgUmVzb3VyY2UgdHlwZSBpcyBub3QgaW5cbiAgICogdGhpcyBhcnJheS5cbiAgICogQGRlZmF1bHQgW11cbiAgICovXG4gIHJlYWRvbmx5IGV4Y2x1ZGVSZXNvdXJjZVR5cGVzPzogc3RyaW5nW107XG5cbiAgLyoqXG4gICAqIEFuIGFycmF5IG9mIFJlc291cmNlIFR5cGVzIHRoYXQgd2lsbCByZWNlaXZlIHRoaXMgdGFnXG4gICAqXG4gICAqIEFuIGVtcHR5IGFycmF5IHdpbGwgbWF0Y2ggYW55IFJlc291cmNlLiBBIG5vbi1lbXB0eSBhcnJheSB3aWxsIGFwcGx5IHRoaXNcbiAgICogdGFnIG9ubHkgdG8gUmVzb3VyY2UgdHlwZXMgdGhhdCBhcmUgaW5jbHVkZWQgaW4gdGhpcyBhcnJheS5cbiAgICogQGRlZmF1bHQgW11cbiAgICovXG4gIHJlYWRvbmx5IGluY2x1ZGVSZXNvdXJjZVR5cGVzPzogc3RyaW5nW107XG5cbiAgLyoqXG4gICAqIFByaW9yaXR5IG9mIHRoZSB0YWcgb3BlcmF0aW9uXG4gICAqXG4gICAqIEhpZ2hlciBvciBlcXVhbCBwcmlvcml0eSB0YWdzIHdpbGwgdGFrZSBwcmVjZWRlbmNlLlxuICAgKlxuICAgKiBTZXR0aW5nIHByaW9yaXR5IHdpbGwgZW5hYmxlIHRoZSB1c2VyIHRvIGNvbnRyb2wgdGFncyB3aGVuIHRoZXkgbmVlZCB0byBub3RcbiAgICogZm9sbG93IHRoZSBkZWZhdWx0IHByZWNlZGVuY2UgcGF0dGVybiBvZiBsYXN0IGFwcGxpZWQgYW5kIGNsb3Nlc3QgdG8gdGhlXG4gICAqIGNvbnN0cnVjdCBpbiB0aGUgdHJlZS5cbiAgICpcbiAgICogQGRlZmF1bHRcbiAgICpcbiAgICogRGVmYXVsdCBwcmlvcml0aWVzOlxuICAgKlxuICAgKiAtIDEwMCBmb3IgYFNldFRhZ2BcbiAgICogLSAyMDAgZm9yIGBSZW1vdmVUYWdgXG4gICAqIC0gNTAgZm9yIHRhZ3MgYWRkZWQgZGlyZWN0bHkgdG8gQ2xvdWRGb3JtYXRpb24gcmVzb3VyY2VzXG4gICAqXG4gICAqL1xuICByZWFkb25seSBwcmlvcml0eT86IG51bWJlcjtcbn1cblxuLyoqXG4gKiBUaGUgY29tbW9uIGZ1bmN0aW9uYWxpdHkgZm9yIFRhZyBhbmQgUmVtb3ZlIFRhZyBBc3BlY3RzXG4gKi9cbmFic3RyYWN0IGNsYXNzIFRhZ0Jhc2UgaW1wbGVtZW50cyBJQXNwZWN0IHtcblxuICAvKipcbiAgICogVGhlIHN0cmluZyBrZXkgZm9yIHRoZSB0YWdcbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBrZXk6IHN0cmluZztcblxuICBwcm90ZWN0ZWQgcmVhZG9ubHkgcHJvcHM6IFRhZ1Byb3BzO1xuXG4gIGNvbnN0cnVjdG9yKGtleTogc3RyaW5nLCBwcm9wczogVGFnUHJvcHMgPSB7fSkge1xuICAgIHRoaXMua2V5ID0ga2V5O1xuICAgIHRoaXMucHJvcHMgPSBwcm9wcztcbiAgfVxuXG4gIHB1YmxpYyB2aXNpdChjb25zdHJ1Y3Q6IElDb25zdHJ1Y3QpOiB2b2lkIHtcbiAgICBpZiAoVGFnTWFuYWdlci5pc1RhZ2dhYmxlKGNvbnN0cnVjdCkpIHtcbiAgICAgIHRoaXMuYXBwbHlUYWcoY29uc3RydWN0KTtcbiAgICB9XG4gIH1cblxuICBwcm90ZWN0ZWQgYWJzdHJhY3QgYXBwbHlUYWcocmVzb3VyY2U6IElUYWdnYWJsZSk6IHZvaWQ7XG59XG5cbi8qKlxuICogVGhlIFRhZyBBc3BlY3Qgd2lsbCBoYW5kbGUgYWRkaW5nIGEgdGFnIHRvIHRoaXMgbm9kZSBhbmQgY2FzY2FkaW5nIHRhZ3MgdG8gY2hpbGRyZW5cbiAqL1xuZXhwb3J0IGNsYXNzIFRhZyBleHRlbmRzIFRhZ0Jhc2Uge1xuXG4gIC8qKlxuICAgKiBERVBSRUNBVEVEOiBhZGQgdGFncyB0byB0aGUgbm9kZSBvZiBhIGNvbnN0cnVjdCBhbmQgYWxsIGl0cyB0aGUgdGFnZ2FibGUgY2hpbGRyZW5cbiAgICpcbiAgICogQGRlcHJlY2F0ZWQgdXNlIGBUYWdzLm9mKHNjb3BlKS5hZGQoKWBcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgYWRkKHNjb3BlOiBDb25zdHJ1Y3QsIGtleTogc3RyaW5nLCB2YWx1ZTogc3RyaW5nLCBwcm9wczogVGFnUHJvcHMgPSB7fSkge1xuICAgIEFubm90YXRpb25zLm9mKHNjb3BlKS5hZGREZXByZWNhdGlvbignQGF3cy1jZGsvY29yZS5UYWcuYWRkKHNjb3BlLGssdiknLCAnVXNlIFwiVGFncy5vZihzY29wZSkuYWRkKGssdilcIiBpbnN0ZWFkJyk7XG4gICAgVGFncy5vZihzY29wZSkuYWRkKGtleSwgdmFsdWUsIHByb3BzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBERVBSRUNBVEVEOiByZW1vdmUgdGFncyB0byB0aGUgbm9kZSBvZiBhIGNvbnN0cnVjdCBhbmQgYWxsIGl0cyB0aGUgdGFnZ2FibGUgY2hpbGRyZW5cbiAgICpcbiAgICogQGRlcHJlY2F0ZWQgdXNlIGBUYWdzLm9mKHNjb3BlKS5yZW1vdmUoKWBcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgcmVtb3ZlKHNjb3BlOiBDb25zdHJ1Y3QsIGtleTogc3RyaW5nLCBwcm9wczogVGFnUHJvcHMgPSB7fSkge1xuICAgIEFubm90YXRpb25zLm9mKHNjb3BlKS5hZGREZXByZWNhdGlvbignQGF3cy1jZGsvY29yZS5UYWcucmVtb3ZlKHNjb3BlLGssdiknLCAnVXNlIFwiVGFncy5vZihzY29wZSkucmVtb3ZlKGssdilcIiBpbnN0ZWFkJyk7XG4gICAgVGFncy5vZihzY29wZSkucmVtb3ZlKGtleSwgcHJvcHMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBzdHJpbmcgdmFsdWUgb2YgdGhlIHRhZ1xuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IHZhbHVlOiBzdHJpbmc7XG5cbiAgcHJpdmF0ZSByZWFkb25seSBkZWZhdWx0UHJpb3JpdHkgPSAxMDA7XG5cbiAgY29uc3RydWN0b3Ioa2V5OiBzdHJpbmcsIHZhbHVlOiBzdHJpbmcsIHByb3BzOiBUYWdQcm9wcyA9IHt9KSB7XG4gICAgc3VwZXIoa2V5LCBwcm9wcyk7XG4gICAgaWYgKHZhbHVlID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignVGFnIG11c3QgaGF2ZSBhIHZhbHVlJyk7XG4gICAgfVxuICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgfVxuXG4gIHByb3RlY3RlZCBhcHBseVRhZyhyZXNvdXJjZTogSVRhZ2dhYmxlKSB7XG4gICAgaWYgKHJlc291cmNlLnRhZ3MuYXBwbHlUYWdBc3BlY3RIZXJlKHRoaXMucHJvcHMuaW5jbHVkZVJlc291cmNlVHlwZXMsIHRoaXMucHJvcHMuZXhjbHVkZVJlc291cmNlVHlwZXMpKSB7XG4gICAgICByZXNvdXJjZS50YWdzLnNldFRhZyhcbiAgICAgICAgdGhpcy5rZXksXG4gICAgICAgIHRoaXMudmFsdWUsXG4gICAgICAgIHRoaXMucHJvcHMucHJpb3JpdHkgPz8gdGhpcy5kZWZhdWx0UHJpb3JpdHksXG4gICAgICAgIHRoaXMucHJvcHMuYXBwbHlUb0xhdW5jaGVkSW5zdGFuY2VzICE9PSBmYWxzZSxcbiAgICAgICk7XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogTWFuYWdlcyBBV1MgdGFncyBmb3IgYWxsIHJlc291cmNlcyB3aXRoaW4gYSBjb25zdHJ1Y3Qgc2NvcGUuXG4gKi9cbmV4cG9ydCBjbGFzcyBUYWdzIHtcbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIHRhZ3MgQVBJIGZvciB0aGlzIHNjb3BlLlxuICAgKiBAcGFyYW0gc2NvcGUgVGhlIHNjb3BlXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIG9mKHNjb3BlOiBJQ29uc3RydWN0KTogVGFncyB7XG4gICAgcmV0dXJuIG5ldyBUYWdzKHNjb3BlKTtcbiAgfVxuXG4gIHByaXZhdGUgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSBzY29wZTogSUNvbnN0cnVjdCkgeyB9XG5cbiAgLyoqXG4gICAqIGFkZCB0YWdzIHRvIHRoZSBub2RlIG9mIGEgY29uc3RydWN0IGFuZCBhbGwgaXRzIHRoZSB0YWdnYWJsZSBjaGlsZHJlblxuICAgKi9cbiAgcHVibGljIGFkZChrZXk6IHN0cmluZywgdmFsdWU6IHN0cmluZywgcHJvcHM6IFRhZ1Byb3BzID0ge30pIHtcbiAgICBBc3BlY3RzLm9mKHRoaXMuc2NvcGUpLmFkZChuZXcgVGFnKGtleSwgdmFsdWUsIHByb3BzKSk7XG4gIH1cblxuICAvKipcbiAgICogcmVtb3ZlIHRhZ3MgdG8gdGhlIG5vZGUgb2YgYSBjb25zdHJ1Y3QgYW5kIGFsbCBpdHMgdGhlIHRhZ2dhYmxlIGNoaWxkcmVuXG4gICAqL1xuICBwdWJsaWMgcmVtb3ZlKGtleTogc3RyaW5nLCBwcm9wczogVGFnUHJvcHMgPSB7fSkge1xuICAgIEFzcGVjdHMub2YodGhpcy5zY29wZSkuYWRkKG5ldyBSZW1vdmVUYWcoa2V5LCBwcm9wcykpO1xuICB9XG59XG5cbi8qKlxuICogVGhlIFJlbW92ZVRhZyBBc3BlY3Qgd2lsbCBoYW5kbGUgcmVtb3ZpbmcgdGFncyBmcm9tIHRoaXMgbm9kZSBhbmQgY2hpbGRyZW5cbiAqL1xuZXhwb3J0IGNsYXNzIFJlbW92ZVRhZyBleHRlbmRzIFRhZ0Jhc2Uge1xuXG4gIHByaXZhdGUgcmVhZG9ubHkgZGVmYXVsdFByaW9yaXR5ID0gMjAwO1xuXG4gIGNvbnN0cnVjdG9yKGtleTogc3RyaW5nLCBwcm9wczogVGFnUHJvcHMgPSB7fSkge1xuICAgIHN1cGVyKGtleSwgcHJvcHMpO1xuICB9XG5cbiAgcHJvdGVjdGVkIGFwcGx5VGFnKHJlc291cmNlOiBJVGFnZ2FibGUpOiB2b2lkIHtcbiAgICBpZiAocmVzb3VyY2UudGFncy5hcHBseVRhZ0FzcGVjdEhlcmUodGhpcy5wcm9wcy5pbmNsdWRlUmVzb3VyY2VUeXBlcywgdGhpcy5wcm9wcy5leGNsdWRlUmVzb3VyY2VUeXBlcykpIHtcbiAgICAgIHJlc291cmNlLnRhZ3MucmVtb3ZlVGFnKHRoaXMua2V5LCB0aGlzLnByb3BzLnByaW9yaXR5ID8/IHRoaXMuZGVmYXVsdFByaW9yaXR5KTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==