"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalize = exports.massageSpec = void 0;
const scrutiny_1 = require("./scrutiny");
const lib_1 = require("../lib");
function massageSpec(spec) {
    (0, scrutiny_1.detectScrutinyTypes)(spec);
    replaceIncompleteTypes(spec);
    dropTypelessAttributes(spec);
}
exports.massageSpec = massageSpec;
/**
 * Fix incomplete type definitions in PropertyTypes
 *
 * Some user-defined types are defined to not have any properties, and not
 * be a collection of other types either. They have no definition at all.
 *
 * Add a property object type with empty properties.
 */
function replaceIncompleteTypes(spec) {
    for (const [name, definition] of Object.entries(spec.PropertyTypes)) {
        if (!definition) {
            // eslint-disable-next-line no-console
            console.log(`[${name}] **ERROR** Nullish type definition: a patch probably copied a nonexistent value!`);
            process.exitCode = 1;
            continue;
        }
        if (!lib_1.schema.isRecordType(definition)
            && !lib_1.schema.isCollectionProperty(definition)
            && !lib_1.schema.isScalarProperty(definition)
            && !lib_1.schema.isPrimitiveProperty(definition)) {
            // eslint-disable-next-line no-console
            console.log(`[${name}] Incomplete type, adding empty "Properties" field`);
            definition.Properties = {};
        }
    }
}
/**
 * Drop Attributes specified with the different ResourceTypes that have
 * no type specified.
 */
function dropTypelessAttributes(spec) {
    const resourceTypes = spec.ResourceTypes;
    Object.values(resourceTypes).forEach((resourceType) => {
        const attributes = resourceType.Attributes ?? {};
        Object.keys(attributes).forEach((attrKey) => {
            const attrVal = attributes[attrKey];
            if (Object.keys(attrVal).length === 0) {
                delete attributes[attrKey];
            }
        });
    });
}
/**
 * Modifies the provided specification so that ``ResourceTypes`` and ``PropertyTypes`` are listed in alphabetical order.
 *
 * @param spec an AWS CloudFormation Resource Specification document.
 *
 * @returns ``spec``, after having sorted the ``ResourceTypes`` and ``PropertyTypes`` sections alphabetically.
 */
function normalize(spec) {
    spec.ResourceTypes = normalizeSection(spec.ResourceTypes);
    if (spec.PropertyTypes) {
        spec.PropertyTypes = normalizeSection(spec.PropertyTypes);
    }
    return spec;
    function normalizeSection(section) {
        const result = {};
        for (const key of Object.keys(section).sort()) {
            result[key] = section[key];
        }
        return result;
    }
}
exports.normalize = normalize;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFzc2FnZS1zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibWFzc2FnZS1zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHlDQUFpRDtBQUNqRCxnQ0FBZ0M7QUFFaEMsU0FBZ0IsV0FBVyxDQUFDLElBQTBCO0lBQ3BELElBQUEsOEJBQW1CLEVBQUMsSUFBSSxDQUFDLENBQUM7SUFDMUIsc0JBQXNCLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDN0Isc0JBQXNCLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDL0IsQ0FBQztBQUpELGtDQUlDO0FBRUQ7Ozs7Ozs7R0FPRztBQUNILFNBQVMsc0JBQXNCLENBQUMsSUFBMEI7SUFDeEQsS0FBSyxNQUFNLENBQUMsSUFBSSxFQUFFLFVBQVUsQ0FBQyxJQUFJLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxFQUFFO1FBQ25FLElBQUksQ0FBQyxVQUFVLEVBQUU7WUFDZixzQ0FBc0M7WUFDdEMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLElBQUksbUZBQW1GLENBQUMsQ0FBQztZQUN6RyxPQUFPLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQztZQUNyQixTQUFTO1NBQ1Y7UUFFRCxJQUFJLENBQUMsWUFBTSxDQUFDLFlBQVksQ0FBQyxVQUFVLENBQUM7ZUFDakMsQ0FBQyxZQUFNLENBQUMsb0JBQW9CLENBQUMsVUFBVSxDQUFDO2VBQ3hDLENBQUMsWUFBTSxDQUFDLGdCQUFnQixDQUFDLFVBQVUsQ0FBQztlQUNwQyxDQUFDLFlBQU0sQ0FBQyxtQkFBbUIsQ0FBQyxVQUFVLENBQUMsRUFBRTtZQUMxQyxzQ0FBc0M7WUFDdEMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLElBQUksb0RBQW9ELENBQUMsQ0FBQztZQUV6RSxVQUErQyxDQUFDLFVBQVUsR0FBRyxFQUFFLENBQUM7U0FDbEU7S0FDRjtBQUNILENBQUM7QUFFRDs7O0dBR0c7QUFDSCxTQUFTLHNCQUFzQixDQUFDLElBQTBCO0lBQ3hELE1BQU0sYUFBYSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUM7SUFDekMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxZQUFZLEVBQUUsRUFBRTtRQUNwRCxNQUFNLFVBQVUsR0FBRyxZQUFZLENBQUMsVUFBVSxJQUFJLEVBQUUsQ0FBQztRQUNqRCxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLE9BQU8sRUFBRSxFQUFFO1lBQzFDLE1BQU0sT0FBTyxHQUFHLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUNwQyxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtnQkFDckMsT0FBTyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUM7YUFDNUI7UUFDSCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQUVEOzs7Ozs7R0FNRztBQUNILFNBQWdCLFNBQVMsQ0FBQyxJQUEwQjtJQUNsRCxJQUFJLENBQUMsYUFBYSxHQUFHLGdCQUFnQixDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztJQUMxRCxJQUFJLElBQUksQ0FBQyxhQUFhLEVBQUU7UUFDdEIsSUFBSSxDQUFDLGFBQWEsR0FBRyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7S0FDM0Q7SUFDRCxPQUFPLElBQUksQ0FBQztJQUVaLFNBQVMsZ0JBQWdCLENBQUksT0FBOEI7UUFDekQsTUFBTSxNQUFNLEdBQTBCLEVBQUUsQ0FBQztRQUN6QyxLQUFLLE1BQU0sR0FBRyxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUU7WUFDN0MsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUM1QjtRQUNELE9BQU8sTUFBTSxDQUFDO0lBQ2hCLENBQUM7QUFDSCxDQUFDO0FBZEQsOEJBY0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBkZXRlY3RTY3J1dGlueVR5cGVzIH0gZnJvbSAnLi9zY3J1dGlueSc7XG5pbXBvcnQgeyBzY2hlbWEgfSBmcm9tICcuLi9saWInO1xuXG5leHBvcnQgZnVuY3Rpb24gbWFzc2FnZVNwZWMoc3BlYzogc2NoZW1hLlNwZWNpZmljYXRpb24pIHtcbiAgZGV0ZWN0U2NydXRpbnlUeXBlcyhzcGVjKTtcbiAgcmVwbGFjZUluY29tcGxldGVUeXBlcyhzcGVjKTtcbiAgZHJvcFR5cGVsZXNzQXR0cmlidXRlcyhzcGVjKTtcbn1cblxuLyoqXG4gKiBGaXggaW5jb21wbGV0ZSB0eXBlIGRlZmluaXRpb25zIGluIFByb3BlcnR5VHlwZXNcbiAqXG4gKiBTb21lIHVzZXItZGVmaW5lZCB0eXBlcyBhcmUgZGVmaW5lZCB0byBub3QgaGF2ZSBhbnkgcHJvcGVydGllcywgYW5kIG5vdFxuICogYmUgYSBjb2xsZWN0aW9uIG9mIG90aGVyIHR5cGVzIGVpdGhlci4gVGhleSBoYXZlIG5vIGRlZmluaXRpb24gYXQgYWxsLlxuICpcbiAqIEFkZCBhIHByb3BlcnR5IG9iamVjdCB0eXBlIHdpdGggZW1wdHkgcHJvcGVydGllcy5cbiAqL1xuZnVuY3Rpb24gcmVwbGFjZUluY29tcGxldGVUeXBlcyhzcGVjOiBzY2hlbWEuU3BlY2lmaWNhdGlvbikge1xuICBmb3IgKGNvbnN0IFtuYW1lLCBkZWZpbml0aW9uXSBvZiBPYmplY3QuZW50cmllcyhzcGVjLlByb3BlcnR5VHlwZXMpKSB7XG4gICAgaWYgKCFkZWZpbml0aW9uKSB7XG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc29sZVxuICAgICAgY29uc29sZS5sb2coYFske25hbWV9XSAqKkVSUk9SKiogTnVsbGlzaCB0eXBlIGRlZmluaXRpb246IGEgcGF0Y2ggcHJvYmFibHkgY29waWVkIGEgbm9uZXhpc3RlbnQgdmFsdWUhYCk7XG4gICAgICBwcm9jZXNzLmV4aXRDb2RlID0gMTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIGlmICghc2NoZW1hLmlzUmVjb3JkVHlwZShkZWZpbml0aW9uKVxuICAgICYmICFzY2hlbWEuaXNDb2xsZWN0aW9uUHJvcGVydHkoZGVmaW5pdGlvbilcbiAgICAmJiAhc2NoZW1hLmlzU2NhbGFyUHJvcGVydHkoZGVmaW5pdGlvbilcbiAgICAmJiAhc2NoZW1hLmlzUHJpbWl0aXZlUHJvcGVydHkoZGVmaW5pdGlvbikpIHtcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zb2xlXG4gICAgICBjb25zb2xlLmxvZyhgWyR7bmFtZX1dIEluY29tcGxldGUgdHlwZSwgYWRkaW5nIGVtcHR5IFwiUHJvcGVydGllc1wiIGZpZWxkYCk7XG5cbiAgICAgIChkZWZpbml0aW9uIGFzIHVua25vd24gYXMgc2NoZW1hLlJlY29yZFByb3BlcnR5KS5Qcm9wZXJ0aWVzID0ge307XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogRHJvcCBBdHRyaWJ1dGVzIHNwZWNpZmllZCB3aXRoIHRoZSBkaWZmZXJlbnQgUmVzb3VyY2VUeXBlcyB0aGF0IGhhdmVcbiAqIG5vIHR5cGUgc3BlY2lmaWVkLlxuICovXG5mdW5jdGlvbiBkcm9wVHlwZWxlc3NBdHRyaWJ1dGVzKHNwZWM6IHNjaGVtYS5TcGVjaWZpY2F0aW9uKSB7XG4gIGNvbnN0IHJlc291cmNlVHlwZXMgPSBzcGVjLlJlc291cmNlVHlwZXM7XG4gIE9iamVjdC52YWx1ZXMocmVzb3VyY2VUeXBlcykuZm9yRWFjaCgocmVzb3VyY2VUeXBlKSA9PiB7XG4gICAgY29uc3QgYXR0cmlidXRlcyA9IHJlc291cmNlVHlwZS5BdHRyaWJ1dGVzID8/IHt9O1xuICAgIE9iamVjdC5rZXlzKGF0dHJpYnV0ZXMpLmZvckVhY2goKGF0dHJLZXkpID0+IHtcbiAgICAgIGNvbnN0IGF0dHJWYWwgPSBhdHRyaWJ1dGVzW2F0dHJLZXldO1xuICAgICAgaWYgKE9iamVjdC5rZXlzKGF0dHJWYWwpLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICBkZWxldGUgYXR0cmlidXRlc1thdHRyS2V5XTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSk7XG59XG5cbi8qKlxuICogTW9kaWZpZXMgdGhlIHByb3ZpZGVkIHNwZWNpZmljYXRpb24gc28gdGhhdCBgYFJlc291cmNlVHlwZXNgYCBhbmQgYGBQcm9wZXJ0eVR5cGVzYGAgYXJlIGxpc3RlZCBpbiBhbHBoYWJldGljYWwgb3JkZXIuXG4gKlxuICogQHBhcmFtIHNwZWMgYW4gQVdTIENsb3VkRm9ybWF0aW9uIFJlc291cmNlIFNwZWNpZmljYXRpb24gZG9jdW1lbnQuXG4gKlxuICogQHJldHVybnMgYGBzcGVjYGAsIGFmdGVyIGhhdmluZyBzb3J0ZWQgdGhlIGBgUmVzb3VyY2VUeXBlc2BgIGFuZCBgYFByb3BlcnR5VHlwZXNgYCBzZWN0aW9ucyBhbHBoYWJldGljYWxseS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG5vcm1hbGl6ZShzcGVjOiBzY2hlbWEuU3BlY2lmaWNhdGlvbik6IHNjaGVtYS5TcGVjaWZpY2F0aW9uIHtcbiAgc3BlYy5SZXNvdXJjZVR5cGVzID0gbm9ybWFsaXplU2VjdGlvbihzcGVjLlJlc291cmNlVHlwZXMpO1xuICBpZiAoc3BlYy5Qcm9wZXJ0eVR5cGVzKSB7XG4gICAgc3BlYy5Qcm9wZXJ0eVR5cGVzID0gbm9ybWFsaXplU2VjdGlvbihzcGVjLlByb3BlcnR5VHlwZXMpO1xuICB9XG4gIHJldHVybiBzcGVjO1xuXG4gIGZ1bmN0aW9uIG5vcm1hbGl6ZVNlY3Rpb248VD4oc2VjdGlvbjogeyBbbmFtZTogc3RyaW5nXTogVCB9KTogeyBbbmFtZTogc3RyaW5nXTogVCB9IHtcbiAgICBjb25zdCByZXN1bHQ6IHsgW25hbWU6IHN0cmluZ106IFQgfSA9IHt9O1xuICAgIGZvciAoY29uc3Qga2V5IG9mIE9iamVjdC5rZXlzKHNlY3Rpb24pLnNvcnQoKSkge1xuICAgICAgcmVzdWx0W2tleV0gPSBzZWN0aW9uW2tleV07XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn1cbiJdfQ==