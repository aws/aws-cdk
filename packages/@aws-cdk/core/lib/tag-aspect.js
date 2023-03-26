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
_a = JSII_RTTI_SYMBOL_1;
Tag[_a] = { fqn: "@aws-cdk/core.Tag", version: "0.0.0" };
exports.Tag = Tag;
/**
 * Manages AWS tags for all resources within a construct scope.
 */
class Tags {
    /**
     * Returns the tags API for this scope.
     * @param scope The scope
     */
    static of(scope) {
        return new Tags(scope);
    }
    constructor(scope) {
        this.scope = scope;
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
_b = JSII_RTTI_SYMBOL_1;
Tags[_b] = { fqn: "@aws-cdk/core.Tags", version: "0.0.0" };
exports.Tags = Tags;
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
_c = JSII_RTTI_SYMBOL_1;
RemoveTag[_c] = { fqn: "@aws-cdk/core.RemoveTag", version: "0.0.0" };
exports.RemoveTag = RemoveTag;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFnLWFzcGVjdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInRhZy1hc3BlY3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQ0EsK0NBQTRDO0FBQzVDLHFDQUE0QztBQUM1QywrQ0FBc0Q7QUFxRHREOztHQUVHO0FBQ0gsTUFBZSxPQUFPO0lBU3BCLFlBQVksR0FBVyxFQUFFLFFBQWtCLEVBQUU7UUFDM0MsSUFBSSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUM7UUFDZixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztLQUNwQjtJQUVNLEtBQUssQ0FBQyxTQUFxQjtRQUNoQyxJQUFJLHdCQUFVLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxFQUFFO1lBQ3BDLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUM7U0FDMUI7S0FDRjtDQUdGO0FBRUQ7O0dBRUc7QUFDSCxNQUFhLEdBQUksU0FBUSxPQUFPO0lBRTlCOzs7O09BSUc7SUFDSSxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQWdCLEVBQUUsR0FBVyxFQUFFLEtBQWEsRUFBRSxRQUFrQixFQUFFOzs7Ozs7Ozs7OztRQUNsRix5QkFBVyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxjQUFjLENBQUMsa0NBQWtDLEVBQUUsdUNBQXVDLENBQUMsQ0FBQztRQUNsSCxJQUFJLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO0tBQ3ZDO0lBRUQ7Ozs7T0FJRztJQUNJLE1BQU0sQ0FBQyxNQUFNLENBQUMsS0FBZ0IsRUFBRSxHQUFXLEVBQUUsUUFBa0IsRUFBRTs7Ozs7Ozs7Ozs7UUFDdEUseUJBQVcsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsY0FBYyxDQUFDLHFDQUFxQyxFQUFFLDBDQUEwQyxDQUFDLENBQUM7UUFDeEgsSUFBSSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUFDO0tBQ25DO0lBU0QsWUFBWSxHQUFXLEVBQUUsS0FBYSxFQUFFLFFBQWtCLEVBQUU7UUFDMUQsS0FBSyxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUhILG9CQUFlLEdBQUcsR0FBRyxDQUFDOzs7Ozs7K0NBM0I1QixHQUFHOzs7O1FBK0JaLElBQUksS0FBSyxLQUFLLFNBQVMsRUFBRTtZQUN2QixNQUFNLElBQUksS0FBSyxDQUFDLHVCQUF1QixDQUFDLENBQUM7U0FDMUM7UUFDRCxJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztLQUNwQjtJQUVTLFFBQVEsQ0FBQyxRQUFtQjs7Ozs7Ozs7OztRQUNwQyxJQUFJLFFBQVEsQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxvQkFBb0IsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLG9CQUFvQixDQUFDLEVBQUU7WUFDdEcsUUFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQ2xCLElBQUksQ0FBQyxHQUFHLEVBQ1IsSUFBSSxDQUFDLEtBQUssRUFDVixJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsSUFBSSxJQUFJLENBQUMsZUFBZSxFQUMzQyxJQUFJLENBQUMsS0FBSyxDQUFDLHdCQUF3QixLQUFLLEtBQUssQ0FDOUMsQ0FBQztTQUNIO0tBQ0Y7Ozs7QUE5Q1Usa0JBQUc7QUFpRGhCOztHQUVHO0FBQ0gsTUFBYSxJQUFJO0lBQ2Y7OztPQUdHO0lBQ0ksTUFBTSxDQUFDLEVBQUUsQ0FBQyxLQUFpQjtRQUNoQyxPQUFPLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0tBQ3hCO0lBRUQsWUFBcUMsS0FBaUI7UUFBakIsVUFBSyxHQUFMLEtBQUssQ0FBWTtLQUFLO0lBRTNEOztPQUVHO0lBQ0ksR0FBRyxDQUFDLEdBQVcsRUFBRSxLQUFhLEVBQUUsUUFBa0IsRUFBRTs7Ozs7Ozs7OztRQUN6RCxnQkFBTyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksR0FBRyxDQUFDLEdBQUcsRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQztLQUN4RDtJQUVEOztPQUVHO0lBQ0ksTUFBTSxDQUFDLEdBQVcsRUFBRSxRQUFrQixFQUFFOzs7Ozs7Ozs7O1FBQzdDLGdCQUFPLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxTQUFTLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUM7S0FDdkQ7Ozs7QUF2QlUsb0JBQUk7QUEwQmpCOztHQUVHO0FBQ0gsTUFBYSxTQUFVLFNBQVEsT0FBTztJQUlwQyxZQUFZLEdBQVcsRUFBRSxRQUFrQixFQUFFO1FBQzNDLEtBQUssQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFISCxvQkFBZSxHQUFHLEdBQUcsQ0FBQzs7Ozs7OytDQUY1QixTQUFTOzs7O0tBTW5CO0lBRVMsUUFBUSxDQUFDLFFBQW1COzs7Ozs7Ozs7O1FBQ3BDLElBQUksUUFBUSxDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLG9CQUFvQixFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsb0JBQW9CLENBQUMsRUFBRTtZQUN0RyxRQUFRLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxJQUFJLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQztTQUNoRjtLQUNGOzs7O0FBWlUsOEJBQVMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb25zdHJ1Y3QsIElDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCB7IEFubm90YXRpb25zIH0gZnJvbSAnLi9hbm5vdGF0aW9ucyc7XG5pbXBvcnQgeyBJQXNwZWN0LCBBc3BlY3RzIH0gZnJvbSAnLi9hc3BlY3QnO1xuaW1wb3J0IHsgSVRhZ2dhYmxlLCBUYWdNYW5hZ2VyIH0gZnJvbSAnLi90YWctbWFuYWdlcic7XG5cbi8qKlxuICogUHJvcGVydGllcyBmb3IgYSB0YWdcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBUYWdQcm9wcyB7XG4gIC8qKlxuICAgKiBXaGV0aGVyIHRoZSB0YWcgc2hvdWxkIGJlIGFwcGxpZWQgdG8gaW5zdGFuY2VzIGluIGFuIEF1dG9TY2FsaW5nR3JvdXBcbiAgICpcbiAgICogQGRlZmF1bHQgdHJ1ZVxuICAgKi9cbiAgcmVhZG9ubHkgYXBwbHlUb0xhdW5jaGVkSW5zdGFuY2VzPzogYm9vbGVhbjtcblxuICAvKipcbiAgICogQW4gYXJyYXkgb2YgUmVzb3VyY2UgVHlwZXMgdGhhdCB3aWxsIG5vdCByZWNlaXZlIHRoaXMgdGFnXG4gICAqXG4gICAqIEFuIGVtcHR5IGFycmF5IHdpbGwgYWxsb3cgdGhpcyB0YWcgdG8gYmUgYXBwbGllZCB0byBhbGwgcmVzb3VyY2VzLiBBXG4gICAqIG5vbi1lbXB0eSBhcnJheSB3aWxsIGFwcGx5IHRoaXMgdGFnIG9ubHkgaWYgdGhlIFJlc291cmNlIHR5cGUgaXMgbm90IGluXG4gICAqIHRoaXMgYXJyYXkuXG4gICAqIEBkZWZhdWx0IFtdXG4gICAqL1xuICByZWFkb25seSBleGNsdWRlUmVzb3VyY2VUeXBlcz86IHN0cmluZ1tdO1xuXG4gIC8qKlxuICAgKiBBbiBhcnJheSBvZiBSZXNvdXJjZSBUeXBlcyB0aGF0IHdpbGwgcmVjZWl2ZSB0aGlzIHRhZ1xuICAgKlxuICAgKiBBbiBlbXB0eSBhcnJheSB3aWxsIG1hdGNoIGFueSBSZXNvdXJjZS4gQSBub24tZW1wdHkgYXJyYXkgd2lsbCBhcHBseSB0aGlzXG4gICAqIHRhZyBvbmx5IHRvIFJlc291cmNlIHR5cGVzIHRoYXQgYXJlIGluY2x1ZGVkIGluIHRoaXMgYXJyYXkuXG4gICAqIEBkZWZhdWx0IFtdXG4gICAqL1xuICByZWFkb25seSBpbmNsdWRlUmVzb3VyY2VUeXBlcz86IHN0cmluZ1tdO1xuXG4gIC8qKlxuICAgKiBQcmlvcml0eSBvZiB0aGUgdGFnIG9wZXJhdGlvblxuICAgKlxuICAgKiBIaWdoZXIgb3IgZXF1YWwgcHJpb3JpdHkgdGFncyB3aWxsIHRha2UgcHJlY2VkZW5jZS5cbiAgICpcbiAgICogU2V0dGluZyBwcmlvcml0eSB3aWxsIGVuYWJsZSB0aGUgdXNlciB0byBjb250cm9sIHRhZ3Mgd2hlbiB0aGV5IG5lZWQgdG8gbm90XG4gICAqIGZvbGxvdyB0aGUgZGVmYXVsdCBwcmVjZWRlbmNlIHBhdHRlcm4gb2YgbGFzdCBhcHBsaWVkIGFuZCBjbG9zZXN0IHRvIHRoZVxuICAgKiBjb25zdHJ1Y3QgaW4gdGhlIHRyZWUuXG4gICAqXG4gICAqIEBkZWZhdWx0XG4gICAqXG4gICAqIERlZmF1bHQgcHJpb3JpdGllczpcbiAgICpcbiAgICogLSAxMDAgZm9yIGBTZXRUYWdgXG4gICAqIC0gMjAwIGZvciBgUmVtb3ZlVGFnYFxuICAgKiAtIDUwIGZvciB0YWdzIGFkZGVkIGRpcmVjdGx5IHRvIENsb3VkRm9ybWF0aW9uIHJlc291cmNlc1xuICAgKlxuICAgKi9cbiAgcmVhZG9ubHkgcHJpb3JpdHk/OiBudW1iZXI7XG59XG5cbi8qKlxuICogVGhlIGNvbW1vbiBmdW5jdGlvbmFsaXR5IGZvciBUYWcgYW5kIFJlbW92ZSBUYWcgQXNwZWN0c1xuICovXG5hYnN0cmFjdCBjbGFzcyBUYWdCYXNlIGltcGxlbWVudHMgSUFzcGVjdCB7XG5cbiAgLyoqXG4gICAqIFRoZSBzdHJpbmcga2V5IGZvciB0aGUgdGFnXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkga2V5OiBzdHJpbmc7XG5cbiAgcHJvdGVjdGVkIHJlYWRvbmx5IHByb3BzOiBUYWdQcm9wcztcblxuICBjb25zdHJ1Y3RvcihrZXk6IHN0cmluZywgcHJvcHM6IFRhZ1Byb3BzID0ge30pIHtcbiAgICB0aGlzLmtleSA9IGtleTtcbiAgICB0aGlzLnByb3BzID0gcHJvcHM7XG4gIH1cblxuICBwdWJsaWMgdmlzaXQoY29uc3RydWN0OiBJQ29uc3RydWN0KTogdm9pZCB7XG4gICAgaWYgKFRhZ01hbmFnZXIuaXNUYWdnYWJsZShjb25zdHJ1Y3QpKSB7XG4gICAgICB0aGlzLmFwcGx5VGFnKGNvbnN0cnVjdCk7XG4gICAgfVxuICB9XG5cbiAgcHJvdGVjdGVkIGFic3RyYWN0IGFwcGx5VGFnKHJlc291cmNlOiBJVGFnZ2FibGUpOiB2b2lkO1xufVxuXG4vKipcbiAqIFRoZSBUYWcgQXNwZWN0IHdpbGwgaGFuZGxlIGFkZGluZyBhIHRhZyB0byB0aGlzIG5vZGUgYW5kIGNhc2NhZGluZyB0YWdzIHRvIGNoaWxkcmVuXG4gKi9cbmV4cG9ydCBjbGFzcyBUYWcgZXh0ZW5kcyBUYWdCYXNlIHtcblxuICAvKipcbiAgICogREVQUkVDQVRFRDogYWRkIHRhZ3MgdG8gdGhlIG5vZGUgb2YgYSBjb25zdHJ1Y3QgYW5kIGFsbCBpdHMgdGhlIHRhZ2dhYmxlIGNoaWxkcmVuXG4gICAqXG4gICAqIEBkZXByZWNhdGVkIHVzZSBgVGFncy5vZihzY29wZSkuYWRkKClgXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGFkZChzY29wZTogQ29uc3RydWN0LCBrZXk6IHN0cmluZywgdmFsdWU6IHN0cmluZywgcHJvcHM6IFRhZ1Byb3BzID0ge30pIHtcbiAgICBBbm5vdGF0aW9ucy5vZihzY29wZSkuYWRkRGVwcmVjYXRpb24oJ0Bhd3MtY2RrL2NvcmUuVGFnLmFkZChzY29wZSxrLHYpJywgJ1VzZSBcIlRhZ3Mub2Yoc2NvcGUpLmFkZChrLHYpXCIgaW5zdGVhZCcpO1xuICAgIFRhZ3Mub2Yoc2NvcGUpLmFkZChrZXksIHZhbHVlLCBwcm9wcyk7XG4gIH1cblxuICAvKipcbiAgICogREVQUkVDQVRFRDogcmVtb3ZlIHRhZ3MgdG8gdGhlIG5vZGUgb2YgYSBjb25zdHJ1Y3QgYW5kIGFsbCBpdHMgdGhlIHRhZ2dhYmxlIGNoaWxkcmVuXG4gICAqXG4gICAqIEBkZXByZWNhdGVkIHVzZSBgVGFncy5vZihzY29wZSkucmVtb3ZlKClgXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHJlbW92ZShzY29wZTogQ29uc3RydWN0LCBrZXk6IHN0cmluZywgcHJvcHM6IFRhZ1Byb3BzID0ge30pIHtcbiAgICBBbm5vdGF0aW9ucy5vZihzY29wZSkuYWRkRGVwcmVjYXRpb24oJ0Bhd3MtY2RrL2NvcmUuVGFnLnJlbW92ZShzY29wZSxrLHYpJywgJ1VzZSBcIlRhZ3Mub2Yoc2NvcGUpLnJlbW92ZShrLHYpXCIgaW5zdGVhZCcpO1xuICAgIFRhZ3Mub2Yoc2NvcGUpLnJlbW92ZShrZXksIHByb3BzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgc3RyaW5nIHZhbHVlIG9mIHRoZSB0YWdcbiAgICovXG4gIHB1YmxpYyByZWFkb25seSB2YWx1ZTogc3RyaW5nO1xuXG4gIHByaXZhdGUgcmVhZG9ubHkgZGVmYXVsdFByaW9yaXR5ID0gMTAwO1xuXG4gIGNvbnN0cnVjdG9yKGtleTogc3RyaW5nLCB2YWx1ZTogc3RyaW5nLCBwcm9wczogVGFnUHJvcHMgPSB7fSkge1xuICAgIHN1cGVyKGtleSwgcHJvcHMpO1xuICAgIGlmICh2YWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RhZyBtdXN0IGhhdmUgYSB2YWx1ZScpO1xuICAgIH1cbiAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gIH1cblxuICBwcm90ZWN0ZWQgYXBwbHlUYWcocmVzb3VyY2U6IElUYWdnYWJsZSkge1xuICAgIGlmIChyZXNvdXJjZS50YWdzLmFwcGx5VGFnQXNwZWN0SGVyZSh0aGlzLnByb3BzLmluY2x1ZGVSZXNvdXJjZVR5cGVzLCB0aGlzLnByb3BzLmV4Y2x1ZGVSZXNvdXJjZVR5cGVzKSkge1xuICAgICAgcmVzb3VyY2UudGFncy5zZXRUYWcoXG4gICAgICAgIHRoaXMua2V5LFxuICAgICAgICB0aGlzLnZhbHVlLFxuICAgICAgICB0aGlzLnByb3BzLnByaW9yaXR5ID8/IHRoaXMuZGVmYXVsdFByaW9yaXR5LFxuICAgICAgICB0aGlzLnByb3BzLmFwcGx5VG9MYXVuY2hlZEluc3RhbmNlcyAhPT0gZmFsc2UsXG4gICAgICApO1xuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIE1hbmFnZXMgQVdTIHRhZ3MgZm9yIGFsbCByZXNvdXJjZXMgd2l0aGluIGEgY29uc3RydWN0IHNjb3BlLlxuICovXG5leHBvcnQgY2xhc3MgVGFncyB7XG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSB0YWdzIEFQSSBmb3IgdGhpcyBzY29wZS5cbiAgICogQHBhcmFtIHNjb3BlIFRoZSBzY29wZVxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBvZihzY29wZTogSUNvbnN0cnVjdCk6IFRhZ3Mge1xuICAgIHJldHVybiBuZXcgVGFncyhzY29wZSk7XG4gIH1cblxuICBwcml2YXRlIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgc2NvcGU6IElDb25zdHJ1Y3QpIHsgfVxuXG4gIC8qKlxuICAgKiBhZGQgdGFncyB0byB0aGUgbm9kZSBvZiBhIGNvbnN0cnVjdCBhbmQgYWxsIGl0cyB0aGUgdGFnZ2FibGUgY2hpbGRyZW5cbiAgICovXG4gIHB1YmxpYyBhZGQoa2V5OiBzdHJpbmcsIHZhbHVlOiBzdHJpbmcsIHByb3BzOiBUYWdQcm9wcyA9IHt9KSB7XG4gICAgQXNwZWN0cy5vZih0aGlzLnNjb3BlKS5hZGQobmV3IFRhZyhrZXksIHZhbHVlLCBwcm9wcykpO1xuICB9XG5cbiAgLyoqXG4gICAqIHJlbW92ZSB0YWdzIHRvIHRoZSBub2RlIG9mIGEgY29uc3RydWN0IGFuZCBhbGwgaXRzIHRoZSB0YWdnYWJsZSBjaGlsZHJlblxuICAgKi9cbiAgcHVibGljIHJlbW92ZShrZXk6IHN0cmluZywgcHJvcHM6IFRhZ1Byb3BzID0ge30pIHtcbiAgICBBc3BlY3RzLm9mKHRoaXMuc2NvcGUpLmFkZChuZXcgUmVtb3ZlVGFnKGtleSwgcHJvcHMpKTtcbiAgfVxufVxuXG4vKipcbiAqIFRoZSBSZW1vdmVUYWcgQXNwZWN0IHdpbGwgaGFuZGxlIHJlbW92aW5nIHRhZ3MgZnJvbSB0aGlzIG5vZGUgYW5kIGNoaWxkcmVuXG4gKi9cbmV4cG9ydCBjbGFzcyBSZW1vdmVUYWcgZXh0ZW5kcyBUYWdCYXNlIHtcblxuICBwcml2YXRlIHJlYWRvbmx5IGRlZmF1bHRQcmlvcml0eSA9IDIwMDtcblxuICBjb25zdHJ1Y3RvcihrZXk6IHN0cmluZywgcHJvcHM6IFRhZ1Byb3BzID0ge30pIHtcbiAgICBzdXBlcihrZXksIHByb3BzKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBhcHBseVRhZyhyZXNvdXJjZTogSVRhZ2dhYmxlKTogdm9pZCB7XG4gICAgaWYgKHJlc291cmNlLnRhZ3MuYXBwbHlUYWdBc3BlY3RIZXJlKHRoaXMucHJvcHMuaW5jbHVkZVJlc291cmNlVHlwZXMsIHRoaXMucHJvcHMuZXhjbHVkZVJlc291cmNlVHlwZXMpKSB7XG4gICAgICByZXNvdXJjZS50YWdzLnJlbW92ZVRhZyh0aGlzLmtleSwgdGhpcy5wcm9wcy5wcmlvcml0eSA/PyB0aGlzLmRlZmF1bHRQcmlvcml0eSk7XG4gICAgfVxuICB9XG59XG4iXX0=