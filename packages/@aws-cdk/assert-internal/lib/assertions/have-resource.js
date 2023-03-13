"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSuperObject = exports.ResourcePart = exports.HaveResourceAssertion = exports.haveResourceLike = exports.haveResource = exports.ABSENT = void 0;
const have_resource_matchers_1 = require("./have-resource-matchers");
const assertion_1 = require("../assertion");
/**
 * Magic value to signify that a certain key should be absent from the property bag.
 *
 * The property is either not present or set to `undefined.
 *
 * NOTE: `ABSENT` only works with the `haveResource()` and `haveResourceLike()`
 * assertions.
 */
exports.ABSENT = '{{ABSENT}}';
/**
 * An assertion to check whether a resource of a given type and with the given properties exists, disregarding properties
 *
 * @param resourceType the type of the resource that is expected to be present.
 * @param properties   the properties that the resource is expected to have. A function may be provided, in which case
 *                     it will be called with the properties of candidate resources and an ``InspectionFailure``
 *                     instance on which errors should be appended, and should return a truthy value to denote a match.
 * @param comparison   the entity that is being asserted against.
 * @param allowValueExtension if properties is an object, tells whether values must match exactly, or if they are
 *                     allowed to be supersets of the reference values. Meaningless if properties is a function.
 */
function haveResource(resourceType, properties, comparison, allowValueExtension = false) {
    return new HaveResourceAssertion(resourceType, properties, comparison, allowValueExtension);
}
exports.haveResource = haveResource;
/**
 * Sugar for calling ``haveResource`` with ``allowValueExtension`` set to ``true``.
 */
function haveResourceLike(resourceType, properties, comparison) {
    return haveResource(resourceType, properties, comparison, true);
}
exports.haveResourceLike = haveResourceLike;
class HaveResourceAssertion extends assertion_1.JestFriendlyAssertion {
    constructor(resourceType, properties, part, allowValueExtension = false) {
        super();
        this.resourceType = resourceType;
        this.inspected = [];
        this.matcher = isCallable(properties) ? properties :
            properties === undefined ? have_resource_matchers_1.anything() :
                allowValueExtension ? have_resource_matchers_1.deepObjectLike(properties) :
                    have_resource_matchers_1.objectLike(properties);
        this.part = part ?? ResourcePart.Properties;
    }
    assertUsing(inspector) {
        for (const logicalId of Object.keys(inspector.value.Resources || {})) {
            const resource = inspector.value.Resources[logicalId];
            if (resource.Type === this.resourceType) {
                const propsToCheck = this.part === ResourcePart.Properties ? (resource.Properties ?? {}) : resource;
                // Pass inspection object as 2nd argument, initialize failure with default string,
                // to maintain backwards compatibility with old predicate API.
                const inspection = { resource, failureReason: 'Object did not match predicate' };
                if (have_resource_matchers_1.match(propsToCheck, this.matcher, inspection)) {
                    return true;
                }
                this.inspected.push(inspection);
            }
        }
        return false;
    }
    generateErrorMessage() {
        const lines = [];
        lines.push(`None of ${this.inspected.length} resources matches ${this.description}.`);
        for (const inspected of this.inspected) {
            lines.push(`- ${inspected.failureReason} in:`);
            lines.push(indent(4, JSON.stringify(inspected.resource, null, 2)));
        }
        return lines.join('\n');
    }
    assertOrThrow(inspector) {
        if (!this.assertUsing(inspector)) {
            throw new Error(this.generateErrorMessage());
        }
    }
    get description() {
        // eslint-disable-next-line max-len
        return `resource '${this.resourceType}' with ${JSON.stringify(this.matcher, undefined, 2)}`;
    }
}
exports.HaveResourceAssertion = HaveResourceAssertion;
function indent(n, s) {
    const prefix = ' '.repeat(n);
    return prefix + s.replace(/\n/g, '\n' + prefix);
}
/**
 * What part of the resource to compare
 */
var ResourcePart;
(function (ResourcePart) {
    /**
     * Only compare the resource's properties
     */
    ResourcePart[ResourcePart["Properties"] = 0] = "Properties";
    /**
     * Check the entire CloudFormation config
     *
     * (including UpdateConfig, DependsOn, etc.)
     */
    ResourcePart[ResourcePart["CompleteDefinition"] = 1] = "CompleteDefinition";
})(ResourcePart = exports.ResourcePart || (exports.ResourcePart = {}));
/**
 * Whether a value is a callable
 */
function isCallable(x) {
    return x && {}.toString.call(x) === '[object Function]';
}
/**
 * Return whether `superObj` is a super-object of `obj`.
 *
 * A super-object has the same or more property values, recursing into sub properties if ``allowValueExtension`` is true.
 *
 * At any point in the object, a value may be replaced with a function which will be used to check that particular field.
 * The type of a matcher function is expected to be of type PropertyMatcher.
 *
 * @deprecated - Use `objectLike` or a literal object instead.
 */
function isSuperObject(superObj, pattern, errors = [], allowValueExtension = false) {
    const matcher = allowValueExtension ? have_resource_matchers_1.deepObjectLike(pattern) : have_resource_matchers_1.objectLike(pattern);
    const inspection = { resource: superObj, failureReason: '' };
    const ret = have_resource_matchers_1.match(superObj, matcher, inspection);
    if (!ret) {
        errors.push(inspection.failureReason);
    }
    return ret;
}
exports.isSuperObject = isSuperObject;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGF2ZS1yZXNvdXJjZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImhhdmUtcmVzb3VyY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEscUVBQXVGO0FBQ3ZGLDRDQUFnRTtBQUdoRTs7Ozs7OztHQU9HO0FBQ1UsUUFBQSxNQUFNLEdBQUcsWUFBWSxDQUFDO0FBRW5DOzs7Ozs7Ozs7O0dBVUc7QUFDSCxTQUFnQixZQUFZLENBQzFCLFlBQW9CLEVBQ3BCLFVBQWdCLEVBQ2hCLFVBQXlCLEVBQ3pCLHNCQUErQixLQUFLO0lBQ3BDLE9BQU8sSUFBSSxxQkFBcUIsQ0FBQyxZQUFZLEVBQUUsVUFBVSxFQUFFLFVBQVUsRUFBRSxtQkFBbUIsQ0FBQyxDQUFDO0FBQzlGLENBQUM7QUFORCxvQ0FNQztBQUVEOztHQUVHO0FBQ0gsU0FBZ0IsZ0JBQWdCLENBQzlCLFlBQW9CLEVBQ3BCLFVBQWdCLEVBQ2hCLFVBQXlCO0lBQ3pCLE9BQU8sWUFBWSxDQUFDLFlBQVksRUFBRSxVQUFVLEVBQUUsVUFBVSxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQ2xFLENBQUM7QUFMRCw0Q0FLQztBQUlELE1BQWEscUJBQXNCLFNBQVEsaUNBQXFDO0lBSzlFLFlBQ21CLFlBQW9CLEVBQ3JDLFVBQWdCLEVBQ2hCLElBQW1CLEVBQ25CLHNCQUErQixLQUFLO1FBQ3BDLEtBQUssRUFBRSxDQUFDO1FBSlMsaUJBQVksR0FBWixZQUFZLENBQVE7UUFMdEIsY0FBUyxHQUF3QixFQUFFLENBQUM7UUFXbkQsSUFBSSxDQUFDLE9BQU8sR0FBRyxVQUFVLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQ2xELFVBQVUsS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDLGlDQUFRLEVBQUUsQ0FBQyxDQUFDO2dCQUNyQyxtQkFBbUIsQ0FBQyxDQUFDLENBQUMsdUNBQWMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO29CQUNoRCxtQ0FBVSxDQUFDLFVB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QVMsVUFBVSxDQUFDLENBQU07SUFDeEIsT0FBTyxDQUFDLElBQUksRUFBRSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssbUJBQW1CLENBQUM7QUFDMUQsQ0FBQztBQUVEOzs7Ozs7Ozs7R0FTRztBQUNILFNBQWdCLGFBQWEsQ0FBQyxRQUFhLEVBQUUsT0FBWSxFQUFFLFNBQW1CLEVBQUUsRUFBRSxzQkFBK0IsS0FBSztJQUNwSCxNQUFNLE9BQU8sR0FBRyxtQkFBbUIsQ0FBQyxDQUFDLENBQUMsdUNBQWMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsbUNBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUVwRixNQUFNLFVBQVUsR0FBc0IsRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLGFBQWEsRUFBRSxFQUFFLEVBQUUsQ0FBQztJQUNoRixNQUFNLEdBQUcsR0FBRyw4QkFBSyxDQUFDLFFBQVEsRUFBRSxPQUFPLEVBQUUsVUFBVSxDQUFDLENBQUM7SUFDakQsSUFBSSxDQUFDLEdBQUcsRUFBRTtRQUNSLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLGFBQWEsQ0FBQyxDQUFDO0tBQ3ZDO0lBQ0QsT0FBTyxHQUFHLENBQUM7QUFDYixDQUFDO0FBVEQsc0NBU0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBhbnl0aGluZywgZGVlcE9iamVjdExpa2UsIG1hdGNoLCBvYmplY3RMaWtlIH0gZnJvbSAnLi9oYXZlLXJlc291cmNlLW1hdGNoZXJzJztcbmltcG9ydCB7IEFzc2VydGlvbiwgSmVzdEZyaWVuZGx5QXNzZXJ0aW9uIH0gZnJvbSAnLi4vYXNzZXJ0aW9uJztcbmltcG9ydCB7IFN0YWNrSW5zcGVjdG9yIH0gZnJvbSAnLi4vaW5zcGVjdG9yJztcblxuLyoqXG4gKiBNYWdpYyB2YWx1ZSB0byBzaWduaWZ5IHRoYXQgYSBjZXJ0YWluIGtleSBzaG91bGQgYmUgYWJzZW50IGZyb20gdGhlIHByb3BlcnR5IGJhZy5cbiAqXG4gKiBUaGUgcHJvcGVydHkgaXMgZWl0aGVyIG5vdCBwcmVzZW50IG9yIHNldCB0byBgdW5kZWZpbmVkLlxuICpcbiAqIE5PVEU6IGBBQlNFTlRgIG9ubHkgd29ya3Mgd2l0aCB0aGUgYGhhdmVSZXNvdXJjZSgpYCBhbmQgYGhhdmVSZXNvdXJjZUxpa2UoKWBcbiAqIGFzc2VydGlvbnMuXG4gKi9cbmV4cG9ydCBjb25zdCBBQlNFTlQgPSAne3tBQlNFTlR9fSc7XG5cbi8qKlxuICogQW4gYXNzZXJ0aW9uIHRvIGNoZWNrIHdoZXRoZXIgYSByZXNvdXJjZSBvZiBhIGdpdmVuIHR5cGUgYW5kIHdpdGggdGhlIGdpdmVuIHByb3BlcnRpZXMgZXhpc3RzLCBkaXNyZWdhcmRpbmcgcHJvcGVydGllc1xuICpcbiAqIEBwYXJhbSByZXNvdXJjZVR5cGUgdGhlIHR5cGUgb2YgdGhlIHJlc291cmNlIHRoYXQgaXMgZXhwZWN0ZWQgdG8gYmUgcHJlc2VudC5cbiAqIEBwYXJhbSBwcm9wZXJ0aWVzICAgdGhlIHByb3BlcnRpZXMgdGhhdCB0aGUgcmVzb3VyY2UgaXMgZXhwZWN0ZWQgdG8gaGF2ZS4gQSBmdW5jdGlvbiBtYXkgYmUgcHJvdmlkZWQsIGluIHdoaWNoIGNhc2VcbiAqICAgICAgICAgICAgICAgICAgICAgaXQgd2lsbCBiZSBjYWxsZWQgd2l0aCB0aGUgcHJvcGVydGllcyBvZiBjYW5kaWRhdGUgcmVzb3VyY2VzIGFuZCBhbiBgYEluc3BlY3Rpb25GYWlsdXJlYGBcbiAqICAgICAgICAgICAgICAgICAgICAgaW5zdGFuY2Ugb24gd2hpY2ggZXJyb3JzIHNob3VsZCBiZSBhcHBlbmRlZCwgYW5kIHNob3VsZCByZXR1cm4gYSB0cnV0aHkgdmFsdWUgdG8gZGVub3RlIGEgbWF0Y2guXG4gKiBAcGFyYW0gY29tcGFyaXNvbiAgIHRoZSBlbnRpdHkgdGhhdCBpcyBiZWluZyBhc3NlcnRlZCBhZ2FpbnN0LlxuICogQHBhcmFtIGFsbG93VmFsdWVFeHRlbnNpb24gaWYgcHJvcGVydGllcyBpcyBhbiBvYmplY3QsIHRlbGxzIHdoZXRoZXIgdmFsdWVzIG11c3QgbWF0Y2ggZXhhY3RseSwgb3IgaWYgdGhleSBhcmVcbiAqICAgICAgICAgICAgICAgICAgICAgYWxsb3dlZCB0byBiZSBzdXBlcnNldHMgb2YgdGhlIHJlZmVyZW5jZSB2YWx1ZXMuIE1lYW5pbmdsZXNzIGlmIHByb3BlcnRpZXMgaXMgYSBmdW5jdGlvbi5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGhhdmVSZXNvdXJjZShcbiAgcmVzb3VyY2VUeXBlOiBzdHJpbmcsXG4gIHByb3BlcnRpZXM/OiBhbnksXG4gIGNvbXBhcmlzb24/OiBSZXNvdXJjZVBhcnQsXG4gIGFsbG93VmFsdWVFeHRlbnNpb246IGJvb2xlYW4gPSBmYWxzZSk6IEFzc2VydGlvbjxTdGFja0luc3BlY3Rvcj4ge1xuICByZXR1cm4gbmV3IEhhdmVSZXNvdXJjZUFzc2VydGlvbihyZXNvdXJjZVR5cGUsIHByb3BlcnRpZXMsIGNvbXBhcmlzb24sIGFsbG93VmFsdWVFeHRlbnNpb24pO1xufVxuXG4vKipcbiAqIFN1Z2FyIGZvciBjYWxsaW5nIGBgaGF2ZVJlc291cmNlYGAgd2l0aCBgYGFsbG93VmFsdWVFeHRlbnNpb25gYCBzZXQgdG8gYGB0cnVlYGAuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBoYXZlUmVzb3VyY2VMaWtlKFxuICByZXNvdXJjZVR5cGU6IHN0cmluZyxcbiAgcHJvcGVydGllcz86IGFueSxcbiAgY29tcGFyaXNvbj86IFJlc291cmNlUGFydCkge1xuICByZXR1cm4gaGF2ZVJlc291cmNlKHJlc291cmNlVHlwZSwgcHJvcGVydGllcywgY29tcGFyaXNvbiwgdHJ1ZSk7XG59XG5cbmV4cG9ydCB0eXBlIFByb3BlcnR5TWF0Y2hlciA9IChwcm9wczogYW55LCBpbnNwZWN0aW9uOiBJbnNwZWN0aW9uRmFpbHVyZSkgPT4gYm9vbGVhbjtcblxuZXhwb3J0IGNsYXNzIEhhdmVSZXNvdXJjZUFzc2VydGlvbiBleHRlbmRzIEplc3RGcmllbmRseUFzc2VydGlvbjxTdGFja0luc3BlY3Rvcj4ge1xuICBwcml2YXRlIHJlYWRvbmx5IGluc3BlY3RlZDogSW5zcGVjdGlvbkZhaWx1cmVbXSA9IFtdO1xuICBwcml2YXRlIHJlYWRvbmx5IHBhcnQ6IFJlc291cmNlUGFydDtcbiAgcHJpdmF0ZSByZWFkb25seSBtYXRjaGVyOiBhbnk7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSByZWFkb25seSByZXNvdXJjZVR5cGU6IHN0cmluZyxcbiAgICBwcm9wZXJ0aWVzPzogYW55LFxuICAgIHBhcnQ/OiBSZXNvdXJjZVBhcnQsXG4gICAgYWxsb3dWYWx1ZUV4dGVuc2lvbjogYm9vbGVhbiA9IGZhbHNlKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIHRoaXMubWF0Y2hlciA9IGlzQ2FsbGFibGUocHJvcGVydGllcykgPyBwcm9wZXJ0aWVzIDpcbiAgICAgIHByb3BlcnRpZXMgPT09IHVuZGVmaW5lZCA/IGFueXRoaW5nKCkgOlxuICAgICAgICBhbGxvd1ZhbHVlRXh0ZW5zaW9uID8gZGVlcE9iamVjdExpa2UocHJvcGVydGllcykgOlxuICAgICAgICAgIG9iamVjdExpa2UocHJvcGVydGllcyk7XG4gICAgdGhpcy5wYXJ0ID0gcGFydCA/PyBSZXNvdXJjZVBhcnQuUHJvcGVydGllcztcbiAgfVxuXG4gIHB1YmxpYyBhc3NlcnRVc2luZyhpbnNwZWN0b3I6IFN0YWNrSW5zcGVjdG9yKTogYm9vbGVhbiB7XG4gICAgZm9yIChjb25zdCBsb2dpY2FsSWQgb2YgT2JqZWN0LmtleXMoaW5zcGVjdG9yLnZhbHVlLlJlc291cmNlcyB8fCB7fSkpIHtcbiAgICAgIGNvbnN0IHJlc291cmNlID0gaW5zcGVjdG9yLnZhbHVlLlJlc291cmNlc1tsb2dpY2FsSWRdO1xuICAgICAgaWYgKHJlc291cmNlLlR5cGUgPT09IHRoaXMucmVzb3VyY2VUeXBlKSB7XG4gICAgICAgIGNvbnN0IHByb3BzVG9DaGVjayA9IHRoaXMucGFydCA9PT0gUmVzb3VyY2VQYXJ0LlByb3BlcnRpZXMgPyAocmVzb3VyY2UuUHJvcGVydGllcyA/PyB7fSkgOiByZXNvdXJjZTtcblxuICAgICAgICAvLyBQYXNzIGluc3BlY3Rpb24gb2JqZWN0IGFzIDJuZCBhcmd1bWVudCwgaW5pdGlhbGl6ZSBmYWlsdXJlIHdpdGggZGVmYXVsdCBzdHJpbmcsXG4gICAgICAgIC8vIHRvIG1haW50YWluIGJhY2t3YXJkcyBjb21wYXRpYmlsaXR5IHdpdGggb2xkIHByZWRpY2F0ZSBBUEkuXG4gICAgICAgIGNvbnN0IGluc3BlY3Rpb24gPSB7IHJlc291cmNlLCBmYWlsdXJlUmVhc29uOiAnT2JqZWN0IGRpZCBub3QgbWF0Y2ggcHJlZGljYXRlJyB9O1xuXG4gICAgICAgIGlmIChtYXRjaChwcm9wc1RvQ2hlY2ssIHRoaXMubWF0Y2hlciwgaW5zcGVjdGlvbikpIHtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuaW5zcGVjdGVkLnB1c2goaW5zcGVjdGlvbik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcHVibGljIGdlbmVyYXRlRXJyb3JNZXNzYWdlKCkge1xuICAgIGNvbnN0IGxpbmVzOiBzdHJpbmdbXSA9IFtdO1xuICAgIGxpbmVzLnB1c2goYE5vbmUgb2YgJHt0aGlzLmluc3BlY3RlZC5sZW5ndGh9IHJlc291cmNlcyBtYXRjaGVzICR7dGhpcy5kZXNjcmlwdGlvbn0uYCk7XG5cbiAgICBmb3IgKGNvbnN0IGluc3BlY3RlZCBvZiB0aGlzLmluc3BlY3RlZCkge1xuICAgICAgbGluZXMucHVzaChgLSAke2luc3BlY3RlZC5mYWlsdXJlUmVhc29ufSBpbjpgKTtcbiAgICAgIGxpbmVzLnB1c2goaW5kZW50KDQsIEpTT04uc3RyaW5naWZ5KGluc3BlY3RlZC5yZXNvdXJjZSwgbnVsbCwgMikpKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbGluZXMuam9pbignXFxuJyk7XG4gIH1cblxuICBwdWJsaWMgYXNzZXJ0T3JUaHJvdyhpbnNwZWN0b3I6IFN0YWNrSW5zcGVjdG9yKSB7XG4gICAgaWYgKCF0aGlzLmFzc2VydFVzaW5nKGluc3BlY3RvcikpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcih0aGlzLmdlbmVyYXRlRXJyb3JNZXNzYWdlKCkpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBnZXQgZGVzY3JpcHRpb24oKTogc3RyaW5nIHtcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbWF4LWxlblxuICAgIHJldHVybiBgcmVzb3VyY2UgJyR7dGhpcy5yZXNvdXJjZVR5cGV9JyB3aXRoICR7SlNPTi5zdHJpbmdpZnkodGhpcy5tYXRjaGVyLCB1bmRlZmluZWQsIDIpfWA7XG4gIH1cbn1cblxuZnVuY3Rpb24gaW5kZW50KG46IG51bWJlciwgczogc3RyaW5nKSB7XG4gIGNvbnN0IHByZWZpeCA9ICcgJy5yZXBlYXQobik7XG4gIHJldHVybiBwcmVmaXggKyBzLnJlcGxhY2UoL1xcbi9nLCAnXFxuJyArIHByZWZpeCk7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgSW5zcGVjdGlvbkZhaWx1cmUge1xuICByZXNvdXJjZTogYW55O1xuICBmYWlsdXJlUmVhc29uOiBzdHJpbmc7XG59XG5cbi8qKlxuICogV2hhdCBwYXJ0IG9mIHRoZSByZXNvdXJjZSB0byBjb21wYXJlXG4gKi9cbmV4cG9ydCBlbnVtIFJlc291cmNlUGFydCB7XG4gIC8qKlxuICAgKiBPbmx5IGNvbXBhcmUgdGhlIHJlc291cmNlJ3MgcHJvcGVydGllc1xuICAgKi9cbiAgUHJvcGVydGllcyxcblxuICAvKipcbiAgICogQ2hlY2sgdGhlIGVudGlyZSBDbG91ZEZvcm1hdGlvbiBjb25maWdcbiAgICpcbiAgICogKGluY2x1ZGluZyBVcGRhdGVDb25maWcsIERlcGVuZHNPbiwgZXRjLilcbiAgICovXG4gIENvbXBsZXRlRGVmaW5pdGlvblxufVxuXG4vKipcbiAqIFdoZXRoZXIgYSB2YWx1ZSBpcyBhIGNhbGxhYmxlXG4gKi9cbmZ1bmN0aW9uIGlzQ2FsbGFibGUoeDogYW55KTogeCBpcyAoKC4uLmFyZ3M6IGFueVtdKSA9PiBhbnkpIHtcbiAgcmV0dXJuIHggJiYge30udG9TdHJpbmcuY2FsbCh4KSA9PT0gJ1tvYmplY3QgRnVuY3Rpb25dJztcbn1cblxuLyoqXG4gKiBSZXR1cm4gd2hldGhlciBgc3VwZXJPYmpgIGlzIGEgc3VwZXItb2JqZWN0IG9mIGBvYmpgLlxuICpcbiAqIEEgc3VwZXItb2JqZWN0IGhhcyB0aGUgc2FtZSBvciBtb3JlIHByb3BlcnR5IHZhbHVlcywgcmVjdXJzaW5nIGludG8gc3ViIHByb3BlcnRpZXMgaWYgYGBhbGxvd1ZhbHVlRXh0ZW5zaW9uYGAgaXMgdHJ1ZS5cbiAqXG4gKiBBdCBhbnkgcG9pbnQgaW4gdGhlIG9iamVjdCwgYSB2YWx1ZSBtYXkgYmUgcmVwbGFjZWQgd2l0aCBhIGZ1bmN0aW9uIHdoaWNoIHdpbGwgYmUgdXNlZCB0byBjaGVjayB0aGF0IHBhcnRpY3VsYXIgZmllbGQuXG4gKiBUaGUgdHlwZSBvZiBhIG1hdGNoZXIgZnVuY3Rpb24gaXMgZXhwZWN0ZWQgdG8gYmUgb2YgdHlwZSBQcm9wZXJ0eU1hdGNoZXIuXG4gKlxuICogQGRlcHJlY2F0ZWQgLSBVc2UgYG9iamVjdExpa2VgIG9yIGEgbGl0ZXJhbCBvYmplY3QgaW5zdGVhZC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzU3VwZXJPYmplY3Qoc3VwZXJPYmo6IGFueSwgcGF0dGVybjogYW55LCBlcnJvcnM6IHN0cmluZ1tdID0gW10sIGFsbG93VmFsdWVFeHRlbnNpb246IGJvb2xlYW4gPSBmYWxzZSk6IGJvb2xlYW4ge1xuICBjb25zdCBtYXRjaGVyID0gYWxsb3dWYWx1ZUV4dGVuc2lvbiA/IGRlZXBPYmplY3RMaWtlKHBhdHRlcm4pIDogb2JqZWN0TGlrZShwYXR0ZXJuKTtcblxuICBjb25zdCBpbnNwZWN0aW9uOiBJbnNwZWN0aW9uRmFpbHVyZSA9IHsgcmVzb3VyY2U6IHN1cGVyT2JqLCBmYWlsdXJlUmVhc29uOiAnJyB9O1xuICBjb25zdCByZXQgPSBtYXRjaChzdXBlck9iaiwgbWF0Y2hlciwgaW5zcGVjdGlvbik7XG4gIGlmICghcmV0KSB7XG4gICAgZXJyb3JzLnB1c2goaW5zcGVjdGlvbi5mYWlsdXJlUmVhc29uKTtcbiAgfVxuICByZXR1cm4gcmV0O1xufVxuIl19