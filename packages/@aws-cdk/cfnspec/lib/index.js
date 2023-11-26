"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.scrutinizableResourceTypes = exports.scrutinizablePropertyNames = exports.filteredSpecification = exports.namespaces = exports.resourceTypes = exports.propertySpecification = exports.cfnLintAnnotations = exports.resourceAugmentation = exports.typeDocs = exports.resourceSpecification = exports.docs = exports.specification = exports.schema = void 0;
const crypto = require("crypto");
const schema = require("./schema");
exports.schema = schema;
const schema_1 = require("./schema");
__exportStar(require("./canned-metrics"), exports);
/**
 * The complete AWS CloudFormation Resource specification, having any CDK patches and enhancements included in it.
 */
function specification() {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const spec = require('../spec/specification.json');
    // Modify spec in place, remove complex attributes
    for (const resource of Object.values(spec.ResourceTypes)) {
        resource.Attributes = Object.fromEntries(Object.entries(resource.Attributes ?? [])
            .filter(([_, attr]) => (0, schema_1.isPrimitiveAttribute)(attr) || (0, schema_1.isListAttribute)(attr) || (0, schema_1.isMapAttribute)(attr)));
    }
    return spec;
}
exports.specification = specification;
/**
 * The complete AWS CloudFormation Resource specification, having any CDK patches and enhancements included in it.
 */
function docs() {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return require('../spec/cfn-docs.json');
}
exports.docs = docs;
/**
 * Return the resource specification for the given typename
 *
 * Validates that the resource exists. If you don't want this validating behavior, read from
 * specification() directly.
 */
function resourceSpecification(typeName) {
    const ret = specification().ResourceTypes[typeName];
    if (!ret) {
        throw new Error(`No such resource type: ${typeName}`);
    }
    return ret;
}
exports.resourceSpecification = resourceSpecification;
/**
 * Return documentation for the given type
 */
function typeDocs(resourceName, propertyTypeName) {
    const key = propertyTypeName ? `${resourceName}.${propertyTypeName}` : resourceName;
    const ret = docs().Types[key];
    if (!ret) {
        return {
            description: '',
            properties: {},
        };
    }
    return ret;
}
exports.typeDocs = typeDocs;
/**
 * Get the resource augmentations for a given type
 */
function resourceAugmentation(typeName) {
    const fileName = typeName.replace(/::/g, '_');
    try {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        return require(`./augmentations/${fileName}.json`);
    }
    catch {
        return {};
    }
}
exports.resourceAugmentation = resourceAugmentation;
/**
 * Get the resource augmentations for a given type
 */
function cfnLintAnnotations(typeName) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const allAnnotations = require('../spec/cfn-lint.json');
    return {
        stateful: !!allAnnotations.StatefulResources.ResourceTypes[typeName],
        mustBeEmptyToDelete: allAnnotations.StatefulResources.ResourceTypes[typeName]?.DeleteRequiresEmptyResource ?? false,
    };
}
exports.cfnLintAnnotations = cfnLintAnnotations;
/**
 * Return the property specification for the given resource's property
 */
function propertySpecification(typeName, propertyName) {
    const ret = resourceSpecification(typeName).Properties[propertyName];
    if (!ret) {
        throw new Error(`Resource ${typeName} has no property: ${propertyName}`);
    }
    return ret;
}
exports.propertySpecification = propertySpecification;
/**
 * The list of resource type names defined in the ``specification``.
 */
function resourceTypes() {
    return Object.keys(specification().ResourceTypes);
}
exports.resourceTypes = resourceTypes;
/**
 * The list of namespaces defined in the ``specification``, that is resource name prefixes down to the second ``::``.
 */
function namespaces() {
    return Array.from(new Set(resourceTypes().map(n => n.split('::', 2).join('::'))));
}
exports.namespaces = namespaces;
/**
 * Obtain a filtered version of the AWS CloudFormation specification.
 *
 * @param filter the predicate to be used in order to filter which resource types from the ``Specification`` to extract.
 *         When passed as a ``string``, only the specified resource type will be extracted. When passed as a
 *         ``RegExp``, all matching resource types will be extracted. When passed as a ``function``, all resource
 *         types for which the function returned ``true`` will be extracted.
 *
 * @return a coherent sub-set of the AWS CloudFormation Resource specification, including all property types related
 *     to the selected resource types.
 */
function filteredSpecification(filter) {
    const spec = specification();
    const result = { ResourceTypes: {}, PropertyTypes: {}, Fingerprint: spec.Fingerprint };
    const predicate = makePredicate(filter);
    for (const type of resourceTypes()) {
        if (!predicate(type)) {
            continue;
        }
        result.ResourceTypes[type] = spec.ResourceTypes[type];
        const prefix = `${type}.`;
        for (const propType of Object.keys(spec.PropertyTypes).filter(n => n.startsWith(prefix))) {
            result.PropertyTypes[propType] = spec.PropertyTypes[propType];
        }
    }
    result.Fingerprint = crypto.createHash('sha256').update(JSON.stringify(result)).digest('base64');
    return result;
}
exports.filteredSpecification = filteredSpecification;
/**
 * Creates a predicate function from a given filter.
 *
 * @param filter when provided as a ``string``, performs an exact match comparison.
 *         when provided as a ``RegExp``, performs uses ``str.match(RegExp)``.
 *         when provided as a ``function``, use the function as-is.
 *
 * @returns a predicate function.
 */
function makePredicate(filter) {
    if (typeof filter === 'string') {
        return s => s === filter;
    }
    else if (typeof filter === 'function') {
        return filter;
    }
    else {
        return s => s.match(filter) != null;
    }
}
/**
 * Return the properties of the given type that require the given scrutiny type
 */
function scrutinizablePropertyNames(resourceType, scrutinyTypes) {
    const impl = specification().ResourceTypes[resourceType];
    if (!impl) {
        return [];
    }
    const ret = new Array();
    for (const [propertyName, propertySpec] of Object.entries(impl.Properties || {})) {
        if (scrutinyTypes.includes(propertySpec.ScrutinyType || schema.PropertyScrutinyType.None)) {
            ret.push(propertyName);
        }
    }
    return ret;
}
exports.scrutinizablePropertyNames = scrutinizablePropertyNames;
/**
 * Return the names of the resource types that need to be subjected to additional scrutiny
 */
function scrutinizableResourceTypes(scrutinyTypes) {
    const ret = new Array();
    for (const [resourceType, resourceSpec] of Object.entries(specification().ResourceTypes)) {
        if (scrutinyTypes.includes(resourceSpec.ScrutinyType || schema.ResourceScrutinyType.None)) {
            ret.push(resourceType);
        }
    }
    return ret;
}
exports.scrutinizableResourceTypes = scrutinizableResourceTypes;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLGlDQUFpQztBQUVqQyxtQ0FBbUM7QUFFMUIsd0JBQU07QUFEZixxQ0FBaUY7QUFFakYsbURBQWlDO0FBRWpDOztHQUVHO0FBQ0gsU0FBZ0IsYUFBYTtJQUMzQixpRUFBaUU7SUFDakUsTUFBTSxJQUFJLEdBQXlCLE9BQU8sQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDO0lBRXpFLGtEQUFrRDtJQUNsRCxLQUFLLE1BQU0sUUFBUSxJQUFJLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxFQUFFO1FBQ3hELFFBQVEsQ0FBQyxVQUFVLEdBQUcsTUFBTSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxVQUFVLElBQUksRUFBRSxDQUFDO2FBQy9FLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxFQUFFLEVBQUUsQ0FBQyxJQUFBLDZCQUFvQixFQUFDLElBQUksQ0FBQyxJQUFJLElBQUEsd0JBQWUsRUFBQyxJQUFJLENBQUMsSUFBSSxJQUFBLHVCQUFjLEVBQUMsSUFBSSxDQUFDLENBQUUsQ0FBQyxDQUFDO0tBQ3pHO0lBRUQsT0FBTyxJQUFJLENBQUM7QUFDZCxDQUFDO0FBWEQsc0NBV0M7QUFFRDs7R0FFRztBQUNILFNBQWdCLElBQUk7SUFDbEIsaUVBQWlFO0lBQ2pFLE9BQU8sT0FBTyxDQUFDLHVCQUF1QixDQUFDLENBQUM7QUFDMUMsQ0FBQztBQUhELG9CQUdDO0FBRUQ7Ozs7O0dBS0c7QUFDSCxTQUFnQixxQkFBcUIsQ0FBQyxRQUFnQjtJQUNwRCxNQUFNLEdBQUcsR0FBRyxhQUFhLEVBQUUsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDcEQsSUFBSSxDQUFDLEdBQUcsRUFBRTtRQUNSLE1BQU0sSUFBSSxL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IHsgQ2ZuTGludEZpbGVTY2hlbWEgfSBmcm9tICcuL19wcml2YXRlX3NjaGVtYS9jZm4tbGludCc7XG5pbXBvcnQgKiBhcyBzY2hlbWEgZnJvbSAnLi9zY2hlbWEnO1xuaW1wb3J0IHsgaXNQcmltaXRpdmVBdHRyaWJ1dGUsIGlzTGlzdEF0dHJpYnV0ZSwgaXNNYXBBdHRyaWJ1dGUgfSBmcm9tICcuL3NjaGVtYSc7XG5leHBvcnQgeyBzY2hlbWEgfTtcbmV4cG9ydCAqIGZyb20gJy4vY2FubmVkLW1ldHJpY3MnO1xuXG4vKipcbiAqIFRoZSBjb21wbGV0ZSBBV1MgQ2xvdWRGb3JtYXRpb24gUmVzb3VyY2Ugc3BlY2lmaWNhdGlvbiwgaGF2aW5nIGFueSBDREsgcGF0Y2hlcyBhbmQgZW5oYW5jZW1lbnRzIGluY2x1ZGVkIGluIGl0LlxuICovXG5leHBvcnQgZnVuY3Rpb24gc3BlY2lmaWNhdGlvbigpOiBzY2hlbWEuU3BlY2lmaWNhdGlvbiB7XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tcmVxdWlyZS1pbXBvcnRzXG4gIGNvbnN0IHNwZWM6IHNjaGVtYS5TcGVjaWZpY2F0aW9uID0gcmVxdWlyZSgnLi4vc3BlYy9zcGVjaWZpY2F0aW9uLmpzb24nKTtcblxuICAvLyBNb2RpZnkgc3BlYyBpbiBwbGFjZSwgcmVtb3ZlIGNvbXBsZXggYXR0cmlidXRlc1xuICBmb3IgKGNvbnN0IHJlc291cmNlIG9mIE9iamVjdC52YWx1ZXMoc3BlYy5SZXNvdXJjZVR5cGVzKSkge1xuICAgIHJlc291cmNlLkF0dHJpYnV0ZXMgPSBPYmplY3QuZnJvbUVudHJpZXMoT2JqZWN0LmVudHJpZXMocmVzb3VyY2UuQXR0cmlidXRlcyA/PyBbXSlcbiAgICAgIC5maWx0ZXIoKFtfLCBhdHRyXSkgPT4gaXNQcmltaXRpdmVBdHRyaWJ1dGUoYXR0cikgfHwgaXNMaXN0QXR0cmlidXRlKGF0dHIpIHx8IGlzTWFwQXR0cmlidXRlKGF0dHIpICkpO1xuICB9XG5cbiAgcmV0dXJuIHNwZWM7XG59XG5cbi8qKlxuICogVGhlIGNvbXBsZXRlIEFXUyBDbG91ZEZvcm1hdGlvbiBSZXNvdXJjZSBzcGVjaWZpY2F0aW9uLCBoYXZpbmcgYW55IENESyBwYXRjaGVzIGFuZCBlbmhhbmNlbWVudHMgaW5jbHVkZWQgaW4gaXQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBkb2NzKCk6IHNjaGVtYS5DbG91ZEZvcm1hdGlvbkRvY3NGaWxlIHtcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1yZXF1aXJlLWltcG9ydHNcbiAgcmV0dXJuIHJlcXVpcmUoJy4uL3NwZWMvY2ZuLWRvY3MuanNvbicpO1xufVxuXG4vKipcbiAqIFJldHVybiB0aGUgcmVzb3VyY2Ugc3BlY2lmaWNhdGlvbiBmb3IgdGhlIGdpdmVuIHR5cGVuYW1lXG4gKlxuICogVmFsaWRhdGVzIHRoYXQgdGhlIHJlc291cmNlIGV4aXN0cy4gSWYgeW91IGRvbid0IHdhbnQgdGhpcyB2YWxpZGF0aW5nIGJlaGF2aW9yLCByZWFkIGZyb21cbiAqIHNwZWNpZmljYXRpb24oKSBkaXJlY3RseS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJlc291cmNlU3BlY2lmaWNhdGlvbih0eXBlTmFtZTogc3RyaW5nKTogc2NoZW1hLlJlc291cmNlVHlwZSB7XG4gIGNvbnN0IHJldCA9IHNwZWNpZmljYXRpb24oKS5SZXNvdXJjZVR5cGVzW3R5cGVOYW1lXTtcbiAgaWYgKCFyZXQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYE5vIHN1Y2ggcmVzb3VyY2UgdHlwZTogJHt0eXBlTmFtZX1gKTtcbiAgfVxuICByZXR1cm4gcmV0O1xufVxuXG4vKipcbiAqIFJldHVybiBkb2N1bWVudGF0aW9uIGZvciB0aGUgZ2l2ZW4gdHlwZVxuICovXG5leHBvcnQgZnVuY3Rpb24gdHlwZURvY3MocmVzb3VyY2VOYW1lOiBzdHJpbmcsIHByb3BlcnR5VHlwZU5hbWU/OiBzdHJpbmcpOiBzY2hlbWEuQ2xvdWRGb3JtYXRpb25UeXBlRG9jcyB7XG4gIGNvbnN0IGtleSA9IHByb3BlcnR5VHlwZU5hbWUgPyBgJHtyZXNvdXJjZU5hbWV9LiR7cHJvcGVydHlUeXBlTmFtZX1gIDogcmVzb3VyY2VOYW1lO1xuICBjb25zdCByZXQgPSBkb2NzKCkuVHlwZXNba2V5XTtcbiAgaWYgKCFyZXQpIHtcbiAgICByZXR1cm4ge1xuICAgICAgZGVzY3JpcHRpb246ICcnLFxuICAgICAgcHJvcGVydGllczoge30sXG4gICAgfTtcbiAgfVxuICByZXR1cm4gcmV0O1xufVxuXG4vKipcbiAqIEdldCB0aGUgcmVzb3VyY2UgYXVnbWVudGF0aW9ucyBmb3IgYSBnaXZlbiB0eXBlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByZXNvdXJjZUF1Z21lbnRhdGlvbih0eXBlTmFtZTogc3RyaW5nKTogc2NoZW1hLlJlc291cmNlQXVnbWVudGF0aW9uIHtcbiAgY29uc3QgZmlsZU5hbWUgPSB0eXBlTmFtZS5yZXBsYWNlKC86Oi9nLCAnXycpO1xuICB0cnkge1xuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tcmVxdWlyZS1pbXBvcnRzXG4gICAgcmV0dXJuIHJlcXVpcmUoYC4vYXVnbWVudGF0aW9ucy8ke2ZpbGVOYW1lfS5qc29uYCk7XG4gIH0gY2F0Y2gge1xuICAgIHJldHVybiB7fTtcbiAgfVxufVxuXG4vKipcbiAqIEdldCB0aGUgcmVzb3VyY2UgYXVnbWVudGF0aW9ucyBmb3IgYSBnaXZlbiB0eXBlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjZm5MaW50QW5ub3RhdGlvbnModHlwZU5hbWU6IHN0cmluZyk6IHNjaGVtYS5DZm5MaW50UmVzb3VyY2VBbm5vdGF0aW9ucyB7XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tcmVxdWlyZS1pbXBvcnRzXG4gIGNvbnN0IGFsbEFubm90YXRpb25zOiBDZm5MaW50RmlsZVNjaGVtYSA9IHJlcXVpcmUoJy4uL3NwZWMvY2ZuLWxpbnQuanNvbicpO1xuXG4gIHJldHVybiB7XG4gICAgc3RhdGVmdWw6ICEhYWxsQW5ub3RhdGlvbnMuU3RhdGVmdWxSZXNvdXJjZXMuUmVzb3VyY2VUeXBlc1t0eXBlTmFtZV0sXG4gICAgbXVzdEJlRW1wdHlUb0RlbGV0ZTogYWxsQW5ub3RhdGlvbnMuU3RhdGVmdWxSZXNvdXJjZXMuUmVzb3VyY2VUeXBlc1t0eXBlTmFtZV0/LkRlbGV0ZVJlcXVpcmVzRW1wdHlSZXNvdXJjZSA/PyBmYWxzZSxcbiAgfTtcbn1cblxuLyoqXG4gKiBSZXR1cm4gdGhlIHByb3BlcnR5IHNwZWNpZmljYXRpb24gZm9yIHRoZSBnaXZlbiByZXNvdXJjZSdzIHByb3BlcnR5XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBwcm9wZXJ0eVNwZWNpZmljYXRpb24odHlwZU5hbWU6IHN0cmluZywgcHJvcGVydHlOYW1lOiBzdHJpbmcpOiBzY2hlbWEuUHJvcGVydHkge1xuICBjb25zdCByZXQgPSByZXNvdXJjZVNwZWNpZmljYXRpb24odHlwZU5hbWUpLlByb3BlcnRpZXMhW3Byb3BlcnR5TmFtZV07XG4gIGlmICghcmV0KSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBSZXNvdXJjZSAke3R5cGVOYW1lfSBoYXMgbm8gcHJvcGVydHk6ICR7cHJvcGVydHlOYW1lfWApO1xuICB9XG4gIHJldHVybiByZXQ7XG59XG5cbi8qKlxuICogVGhlIGxpc3Qgb2YgcmVzb3VyY2UgdHlwZSBuYW1lcyBkZWZpbmVkIGluIHRoZSBgYHNwZWNpZmljYXRpb25gYC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJlc291cmNlVHlwZXMoKSB7XG4gIHJldHVybiBPYmplY3Qua2V5cyhzcGVjaWZpY2F0aW9uKCkuUmVzb3VyY2VUeXBlcyk7XG59XG5cbi8qKlxuICogVGhlIGxpc3Qgb2YgbmFtZXNwYWNlcyBkZWZpbmVkIGluIHRoZSBgYHNwZWNpZmljYXRpb25gYCwgdGhhdCBpcyByZXNvdXJjZSBuYW1lIHByZWZpeGVzIGRvd24gdG8gdGhlIHNlY29uZCBgYDo6YGAuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBuYW1lc3BhY2VzKCkge1xuICByZXR1cm4gQXJyYXkuZnJvbShuZXcgU2V0KHJlc291cmNlVHlwZXMoKS5tYXAobiA9PiBuLnNwbGl0KCc6OicsIDIpLmpvaW4oJzo6JykpKSk7XG59XG5cbi8qKlxuICogT2J0YWluIGEgZmlsdGVyZWQgdmVyc2lvbiBvZiB0aGUgQVdTIENsb3VkRm9ybWF0aW9uIHNwZWNpZmljYXRpb24uXG4gKlxuICogQHBhcmFtIGZpbHRlciB0aGUgcHJlZGljYXRlIHRvIGJlIHVzZWQgaW4gb3JkZXIgdG8gZmlsdGVyIHdoaWNoIHJlc291cmNlIHR5cGVzIGZyb20gdGhlIGBgU3BlY2lmaWNhdGlvbmBgIHRvIGV4dHJhY3QuXG4gKiAgICAgICAgIFdoZW4gcGFzc2VkIGFzIGEgYGBzdHJpbmdgYCwgb25seSB0aGUgc3BlY2lmaWVkIHJlc291cmNlIHR5cGUgd2lsbCBiZSBleHRyYWN0ZWQuIFdoZW4gcGFzc2VkIGFzIGFcbiAqICAgICAgICAgYGBSZWdFeHBgYCwgYWxsIG1hdGNoaW5nIHJlc291cmNlIHR5cGVzIHdpbGwgYmUgZXh0cmFjdGVkLiBXaGVuIHBhc3NlZCBhcyBhIGBgZnVuY3Rpb25gYCwgYWxsIHJlc291cmNlXG4gKiAgICAgICAgIHR5cGVzIGZvciB3aGljaCB0aGUgZnVuY3Rpb24gcmV0dXJuZWQgYGB0cnVlYGAgd2lsbCBiZSBleHRyYWN0ZWQuXG4gKlxuICogQHJldHVybiBhIGNvaGVyZW50IHN1Yi1zZXQgb2YgdGhlIEFXUyBDbG91ZEZvcm1hdGlvbiBSZXNvdXJjZSBzcGVjaWZpY2F0aW9uLCBpbmNsdWRpbmcgYWxsIHByb3BlcnR5IHR5cGVzIHJlbGF0ZWRcbiAqICAgICB0byB0aGUgc2VsZWN0ZWQgcmVzb3VyY2UgdHlwZXMuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBmaWx0ZXJlZFNwZWNpZmljYXRpb24oZmlsdGVyOiBzdHJpbmcgfCBSZWdFeHAgfCBGaWx0ZXIpOiBzY2hlbWEuU3BlY2lmaWNhdGlvbiB7XG4gIGNvbnN0IHNwZWMgPSBzcGVjaWZpY2F0aW9uKCk7XG5cbiAgY29uc3QgcmVzdWx0OiBzY2hlbWEuU3BlY2lmaWNhdGlvbiA9IHsgUmVzb3VyY2VUeXBlczoge30sIFByb3BlcnR5VHlwZXM6IHt9LCBGaW5nZXJwcmludDogc3BlYy5GaW5nZXJwcmludCB9O1xuICBjb25zdCBwcmVkaWNhdGU6IEZpbHRlciA9IG1ha2VQcmVkaWNhdGUoZmlsdGVyKTtcbiAgZm9yIChjb25zdCB0eXBlIG9mIHJlc291cmNlVHlwZXMoKSkge1xuICAgIGlmICghcHJlZGljYXRlKHR5cGUpKSB7IGNvbnRpbnVlOyB9XG4gICAgcmVzdWx0LlJlc291cmNlVHlwZXNbdHlwZV0gPSBzcGVjLlJlc291cmNlVHlwZXNbdHlwZV07XG4gICAgY29uc3QgcHJlZml4ID0gYCR7dHlwZX0uYDtcbiAgICBmb3IgKGNvbnN0IHByb3BUeXBlIG9mIE9iamVjdC5rZXlzKHNwZWMuUHJvcGVydHlUeXBlcyEpLmZpbHRlcihuID0+IG4uc3RhcnRzV2l0aChwcmVmaXgpKSkge1xuICAgICAgcmVzdWx0LlByb3BlcnR5VHlwZXNbcHJvcFR5cGVdID0gc3BlYy5Qcm9wZXJ0eVR5cGVzIVtwcm9wVHlwZV07XG4gICAgfVxuICB9XG4gIHJlc3VsdC5GaW5nZXJwcmludCA9IGNyeXB0by5jcmVhdGVIYXNoKCdzaGEyNTYnKS51cGRhdGUoSlNPTi5zdHJpbmdpZnkocmVzdWx0KSkuZGlnZXN0KCdiYXNlNjQnKTtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZXhwb3J0IHR5cGUgRmlsdGVyID0gKG5hbWU6IHN0cmluZykgPT4gYm9vbGVhbjtcblxuLyoqXG4gKiBDcmVhdGVzIGEgcHJlZGljYXRlIGZ1bmN0aW9uIGZyb20gYSBnaXZlbiBmaWx0ZXIuXG4gKlxuICogQHBhcmFtIGZpbHRlciB3aGVuIHByb3ZpZGVkIGFzIGEgYGBzdHJpbmdgYCwgcGVyZm9ybXMgYW4gZXhhY3QgbWF0Y2ggY29tcGFyaXNvbi5cbiAqICAgICAgICAgd2hlbiBwcm92aWRlZCBhcyBhIGBgUmVnRXhwYGAsIHBlcmZvcm1zIHVzZXMgYGBzdHIubWF0Y2goUmVnRXhwKWBgLlxuICogICAgICAgICB3aGVuIHByb3ZpZGVkIGFzIGEgYGBmdW5jdGlvbmBgLCB1c2UgdGhlIGZ1bmN0aW9uIGFzLWlzLlxuICpcbiAqIEByZXR1cm5zIGEgcHJlZGljYXRlIGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBtYWtlUHJlZGljYXRlKGZpbHRlcjogc3RyaW5nIHwgUmVnRXhwIHwgRmlsdGVyKTogRmlsdGVyIHtcbiAgaWYgKHR5cGVvZiBmaWx0ZXIgPT09ICdzdHJpbmcnKSB7XG4gICAgcmV0dXJuIHMgPT4gcyA9PT0gZmlsdGVyO1xuICB9IGVsc2UgaWYgKHR5cGVvZiBmaWx0ZXIgPT09ICdmdW5jdGlvbicpIHtcbiAgICByZXR1cm4gZmlsdGVyIGFzIEZpbHRlcjtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gcyA9PiBzLm1hdGNoKGZpbHRlcikgIT0gbnVsbDtcbiAgfVxufVxuXG4vKipcbiAqIFJldHVybiB0aGUgcHJvcGVydGllcyBvZiB0aGUgZ2l2ZW4gdHlwZSB0aGF0IHJlcXVpcmUgdGhlIGdpdmVuIHNjcnV0aW55IHR5cGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNjcnV0aW5pemFibGVQcm9wZXJ0eU5hbWVzKHJlc291cmNlVHlwZTogc3RyaW5nLCBzY3J1dGlueVR5cGVzOiBzY2hlbWEuUHJvcGVydHlTY3J1dGlueVR5cGVbXSk6IHN0cmluZ1tdIHtcbiAgY29uc3QgaW1wbCA9IHNwZWNpZmljYXRpb24oKS5SZXNvdXJjZVR5cGVzW3Jlc291cmNlVHlwZV07XG4gIGlmICghaW1wbCkgeyByZXR1cm4gW107IH1cblxuICBjb25zdCByZXQgPSBuZXcgQXJyYXk8c3RyaW5nPigpO1xuXG4gIGZvciAoY29uc3QgW3Byb3BlcnR5TmFtZSwgcHJvcGVydHlTcGVjXSBvZiBPYmplY3QuZW50cmllcyhpbXBsLlByb3BlcnRpZXMgfHwge30pKSB7XG4gICAgaWYgKHNjcnV0aW55VHlwZXMuaW5jbHVkZXMocHJvcGVydHlTcGVjLlNjcnV0aW55VHlwZSB8fCBzY2hlbWEuUHJvcGVydHlTY3J1dGlueVR5cGUuTm9uZSkpIHtcbiAgICAgIHJldC5wdXNoKHByb3BlcnR5TmFtZSk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHJldDtcbn1cblxuLyoqXG4gKiBSZXR1cm4gdGhlIG5hbWVzIG9mIHRoZSByZXNvdXJjZSB0eXBlcyB0aGF0IG5lZWQgdG8gYmUgc3ViamVjdGVkIHRvIGFkZGl0aW9uYWwgc2NydXRpbnlcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNjcnV0aW5pemFibGVSZXNvdXJjZVR5cGVzKHNjcnV0aW55VHlwZXM6IHNjaGVtYS5SZXNvdXJjZVNjcnV0aW55VHlwZVtdKTogc3RyaW5nW10ge1xuICBjb25zdCByZXQgPSBuZXcgQXJyYXk8c3RyaW5nPigpO1xuICBmb3IgKGNvbnN0IFtyZXNvdXJjZVR5cGUsIHJlc291cmNlU3BlY10gb2YgT2JqZWN0LmVudHJpZXMoc3BlY2lmaWNhdGlvbigpLlJlc291cmNlVHlwZXMpKSB7XG4gICAgaWYgKHNjcnV0aW55VHlwZXMuaW5jbHVkZXMocmVzb3VyY2VTcGVjLlNjcnV0aW55VHlwZSB8fCBzY2hlbWEuUmVzb3VyY2VTY3J1dGlueVR5cGUuTm9uZSkpIHtcbiAgICAgIHJldC5wdXNoKHJlc291cmNlVHlwZSk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHJldDtcbn1cbiJdfQ==