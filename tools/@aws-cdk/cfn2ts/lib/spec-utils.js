"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scalarTypeNames = exports.itemTypeNames = exports.PropertyAttributeName = exports.SpecName = void 0;
const cfnspec_1 = require("@aws-cdk/cfnspec");
const util_1 = require("./util");
/**
 * Name of an object in the CloudFormation spec
 *
 * This refers to a Resource, parsed from a string like 'AWS::S3::Bucket'.
 */
class SpecName {
    /**
     * Parse a string representing a name from the CloudFormation spec to a CfnName object
     */
    static parse(cfnName) {
        const parts = cfnName.split('::');
        const module = parts.slice(0, parts.length - 1).join('::');
        const lastParts = parts[parts.length - 1].split('.');
        if (lastParts.length === 1) {
            // Resource name, looks like A::B::C
            return new SpecName(module, lastParts[0]);
        }
        throw new Error('Not a CloudFormation resource name: ' + cfnName);
    }
    constructor(module, resourceName) {
        this.module = module;
        this.resourceName = resourceName;
    }
    get fqn() {
        return this.module + '::' + this.resourceName;
    }
    relativeName(propName) {
        return new PropertyAttributeName(this.module, this.resourceName, propName);
    }
}
exports.SpecName = SpecName;
/**
 * Name of a property type or attribute in the CloudFormation spec.
 *
 * These are scoped to a resource, parsed from a string like 'AWS::S3::Bucket.LifecycleConfiguration'.
 */
class PropertyAttributeName extends SpecName {
    static parse(cfnName) {
        if (cfnName === 'Tag') {
            // Crazy
            return new PropertyAttributeName('', '', 'Tag');
        }
        const parts = cfnName.split('::');
        const module = parts.slice(0, parts.length - 1).join('::');
        const lastParts = parts[parts.length - 1].split('.');
        if (lastParts.length === 2) {
            // PropertyType name, looks like A::B::C.D
            return new PropertyAttributeName(module, lastParts[0], lastParts[1]);
        }
        throw new Error('Not a recognized PropertyType name: ' + cfnName);
    }
    constructor(module, resourceName, propAttrName) {
        super(module, resourceName);
        this.propAttrName = propAttrName;
    }
    get fqn() {
        return (0, util_1.joinIf)(super.fqn, '.', this.propAttrName);
    }
}
exports.PropertyAttributeName = PropertyAttributeName;
/**
 * Return a list of all allowable item types, separating out primitive and complex
 * types because sometimes a complex type can have the same name as a primitive type.
 * If we only return the names in this case then the primitive type will always override
 * the complex type (not what we want).
 *
 * @returns type name and whether the type is a complex type (true) or primitive type (false)
 */
function itemTypeNames(spec) {
    const types = complexItemTypeNames(spec).map(type => [type, true])
        .concat(primitiveItemTypeNames(spec).map(type => [type, false]));
    return Object.fromEntries(types);
}
exports.itemTypeNames = itemTypeNames;
function complexItemTypeNames(spec) {
    if (cfnspec_1.schema.isComplexListProperty(spec) || cfnspec_1.schema.isMapOfStructsProperty(spec)) {
        return [spec.ItemType];
    }
    else if (cfnspec_1.schema.isUnionProperty(spec)) {
        return spec.ItemTypes ?? spec.InclusiveItemTypes ?? [];
    }
    return [];
}
function primitiveItemTypeNames(spec) {
    if (cfnspec_1.schema.isMapOfListsOfPrimitivesProperty(spec)) {
        return [`${spec.PrimitiveItemItemType}[]`]; // <--- read in specTypeToCodeType()
    }
    else if (cfnspec_1.schema.isPrimitiveListProperty(spec) || cfnspec_1.schema.isPrimitiveMapProperty(spec)) {
        return [spec.PrimitiveItemType];
    }
    else if (cfnspec_1.schema.isUnionProperty(spec)) {
        return spec.PrimitiveItemTypes ?? spec.InclusivePrimitiveItemTypes ?? [];
    }
    return [];
}
/**
 * Return a list of all allowable item types, separating out primitive and complex
 * types because sometimes a complex type can have the same name as a primitive type.
 * If we only return the names in this case then the primitive type will always override
 * the complex type (not what we want).
 *
 * @returns type name and whether the type is a complex type (true) or primitive type (false)
 */
function scalarTypeNames(spec) {
    const types = complexScalarTypeNames(spec).map(type => [type, true])
        .concat(primitiveScalarTypeNames(spec).map(type => [type, false]));
    return Object.fromEntries(types);
}
exports.scalarTypeNames = scalarTypeNames;
function complexScalarTypeNames(spec) {
    if (cfnspec_1.schema.isComplexProperty(spec) && !cfnspec_1.schema.isListProperty(spec) && !cfnspec_1.schema.isMapProperty(spec)) {
        return [spec.Type];
    }
    else if (cfnspec_1.schema.isUnionProperty(spec)) {
        return spec.Types || [];
    }
    return [];
}
function primitiveScalarTypeNames(spec) {
    if (cfnspec_1.schema.isPrimitiveProperty(spec)) {
        return [spec.PrimitiveType];
    }
    else if (cfnspec_1.schema.isUnionProperty(spec)) {
        return spec.PrimitiveTypes || [];
    }
    return [];
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3BlYy11dGlscy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInNwZWMtdXRpbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsOENBQTBDO0FBQzFDLGlDQUFnQztBQUVoQzs7OztHQUlHO0FBQ0gsTUFBYSxRQUFRO0lBQ25COztPQUVHO0lBQ0ksTUFBTSxDQUFDLEtBQUssQ0FBQyxPQUFlO1FBQ2pDLE1BQU0sS0FBSyxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDbEMsTUFBTSxNQUFNLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFM0QsTUFBTSxTQUFTLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBRXJELElBQUksU0FBUyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7WUFDMUIsb0NBQW9DO1lBQ3BDLE9BQU8sSUFBSSxRQUFRLENBQUMsTUFBTSxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQzNDO1FBRUQsTUFBTSxJQUFJLEtBQUssQ0FBQyxzQ0FBc0MsR0FBRyxPQUFPLENBQUMsQ0FBQztJQUNwRSxDQUFDO0lBRUQsWUFBcUIsTUFBYyxFQUFXLFlBQW9CO1FBQTdDLFdBQU0sR0FBTixNQUFNLENBQVE7UUFBVyxpQkFBWSxHQUFaLFlBQVksQ0FBUTtJQUNsRSxDQUFDO0lBRUQsSUFBVyxHQUFHO1FBQ1osT0FBTyxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDO0lBQ2hELENBQUM7SUFFTSxZQUFZLENBQUMsUUFBZ0I7UUFDbEMsT0FBTyxJQUFJLHFCQUFxQixDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsSUFBSSxD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QUFDLElBQTJCO0lBQzNELElBQUksZ0JBQU0sQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsRUFBRTtRQUNwQyxPQUFPLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO0tBQzdCO1NBQU0sSUFBSSxnQkFBTSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsRUFBRTtRQUN2QyxPQUFPLElBQUksQ0FBQyxjQUFjLElBQUksRUFBRSxDQUFDO0tBQ2xDO0lBQ0QsT0FBTyxFQUFFLENBQUM7QUFDWixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgc2NoZW1hIH0gZnJvbSAnQGF3cy1jZGsvY2Zuc3BlYyc7XG5pbXBvcnQgeyBqb2luSWYgfSBmcm9tICcuL3V0aWwnO1xuXG4vKipcbiAqIE5hbWUgb2YgYW4gb2JqZWN0IGluIHRoZSBDbG91ZEZvcm1hdGlvbiBzcGVjXG4gKlxuICogVGhpcyByZWZlcnMgdG8gYSBSZXNvdXJjZSwgcGFyc2VkIGZyb20gYSBzdHJpbmcgbGlrZSAnQVdTOjpTMzo6QnVja2V0Jy5cbiAqL1xuZXhwb3J0IGNsYXNzIFNwZWNOYW1lIHtcbiAgLyoqXG4gICAqIFBhcnNlIGEgc3RyaW5nIHJlcHJlc2VudGluZyBhIG5hbWUgZnJvbSB0aGUgQ2xvdWRGb3JtYXRpb24gc3BlYyB0byBhIENmbk5hbWUgb2JqZWN0XG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHBhcnNlKGNmbk5hbWU6IHN0cmluZyk6IFNwZWNOYW1lIHtcbiAgICBjb25zdCBwYXJ0cyA9IGNmbk5hbWUuc3BsaXQoJzo6Jyk7XG4gICAgY29uc3QgbW9kdWxlID0gcGFydHMuc2xpY2UoMCwgcGFydHMubGVuZ3RoIC0gMSkuam9pbignOjonKTtcblxuICAgIGNvbnN0IGxhc3RQYXJ0cyA9IHBhcnRzW3BhcnRzLmxlbmd0aCAtIDFdLnNwbGl0KCcuJyk7XG5cbiAgICBpZiAobGFzdFBhcnRzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgLy8gUmVzb3VyY2UgbmFtZSwgbG9va3MgbGlrZSBBOjpCOjpDXG4gICAgICByZXR1cm4gbmV3IFNwZWNOYW1lKG1vZHVsZSwgbGFzdFBhcnRzWzBdKTtcbiAgICB9XG5cbiAgICB0aHJvdyBuZXcgRXJyb3IoJ05vdCBhIENsb3VkRm9ybWF0aW9uIHJlc291cmNlIG5hbWU6ICcgKyBjZm5OYW1lKTtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKHJlYWRvbmx5IG1vZHVsZTogc3RyaW5nLCByZWFkb25seSByZXNvdXJjZU5hbWU6IHN0cmluZykge1xuICB9XG5cbiAgcHVibGljIGdldCBmcW4oKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5tb2R1bGUgKyAnOjonICsgdGhpcy5yZXNvdXJjZU5hbWU7XG4gIH1cblxuICBwdWJsaWMgcmVsYXRpdmVOYW1lKHByb3BOYW1lOiBzdHJpbmcpOiBQcm9wZXJ0eUF0dHJpYnV0ZU5hbWUge1xuICAgIHJldHVybiBuZXcgUHJvcGVydHlBdHRyaWJ1dGVOYW1lKHRoaXMubW9kdWxlLCB0aGlzLnJlc291cmNlTmFtZSwgcHJvcE5hbWUpO1xuICB9XG59XG5cbi8qKlxuICogTmFtZSBvZiBhIHByb3BlcnR5IHR5cGUgb3IgYXR0cmlidXRlIGluIHRoZSBDbG91ZEZvcm1hdGlvbiBzcGVjLlxuICpcbiAqIFRoZXNlIGFyZSBzY29wZWQgdG8gYSByZXNvdXJjZSwgcGFyc2VkIGZyb20gYSBzdHJpbmcgbGlrZSAnQVdTOjpTMzo6QnVja2V0LkxpZmVjeWNsZUNvbmZpZ3VyYXRpb24nLlxuICovXG5leHBvcnQgY2xhc3MgUHJvcGVydHlBdHRyaWJ1dGVOYW1lIGV4dGVuZHMgU3BlY05hbWUge1xuICBwdWJsaWMgc3RhdGljIHBhcnNlKGNmbk5hbWU6IHN0cmluZyk6IFByb3BlcnR5QXR0cmlidXRlTmFtZSB7XG4gICAgaWYgKGNmbk5hbWUgPT09ICdUYWcnKSB7XG4gICAgICAvLyBDcmF6eVxuICAgICAgcmV0dXJuIG5ldyBQcm9wZXJ0eUF0dHJpYnV0ZU5hbWUoJycsICcnLCAnVGFnJyk7XG4gICAgfVxuXG4gICAgY29uc3QgcGFydHMgPSBjZm5OYW1lLnNwbGl0KCc6OicpO1xuICAgIGNvbnN0IG1vZHVsZSA9IHBhcnRzLnNsaWNlKDAsIHBhcnRzLmxlbmd0aCAtIDEpLmpvaW4oJzo6Jyk7XG5cbiAgICBjb25zdCBsYXN0UGFydHMgPSBwYXJ0c1twYXJ0cy5sZW5ndGggLSAxXS5zcGxpdCgnLicpO1xuXG4gICAgaWYgKGxhc3RQYXJ0cy5sZW5ndGggPT09IDIpIHtcbiAgICAgIC8vIFByb3BlcnR5VHlwZSBuYW1lLCBsb29rcyBsaWtlIEE6OkI6OkMuRFxuICAgICAgcmV0dXJuIG5ldyBQcm9wZXJ0eUF0dHJpYnV0ZU5hbWUobW9kdWxlLCBsYXN0UGFydHNbMF0sIGxhc3RQYXJ0c1sxXSk7XG4gICAgfVxuXG4gICAgdGhyb3cgbmV3IEVycm9yKCdOb3QgYSByZWNvZ25pemVkIFByb3BlcnR5VHlwZSBuYW1lOiAnICsgY2ZuTmFtZSk7XG4gIH1cblxuICBjb25zdHJ1Y3Rvcihtb2R1bGU6IHN0cmluZywgcmVzb3VyY2VOYW1lOiBzdHJpbmcsIHJlYWRvbmx5IHByb3BBdHRyTmFtZTogc3RyaW5nKSB7XG4gICAgc3VwZXIobW9kdWxlLCByZXNvdXJjZU5hbWUpO1xuICB9XG5cbiAgcHVibGljIGdldCBmcW4oKTogc3RyaW5nIHtcbiAgICByZXR1cm4gam9pbklmKHN1cGVyLmZxbiwgJy4nLCB0aGlzLnByb3BBdHRyTmFtZSk7XG4gIH1cbn1cblxuLyoqXG4gKiBSZXR1cm4gYSBsaXN0IG9mIGFsbCBhbGxvd2FibGUgaXRlbSB0eXBlcywgc2VwYXJhdGluZyBvdXQgcHJpbWl0aXZlIGFuZCBjb21wbGV4XG4gKiB0eXBlcyBiZWNhdXNlIHNvbWV0aW1lcyBhIGNvbXBsZXggdHlwZSBjYW4gaGF2ZSB0aGUgc2FtZSBuYW1lIGFzIGEgcHJpbWl0aXZlIHR5cGUuXG4gKiBJZiB3ZSBvbmx5IHJldHVybiB0aGUgbmFtZXMgaW4gdGhpcyBjYXNlIHRoZW4gdGhlIHByaW1pdGl2ZSB0eXBlIHdpbGwgYWx3YXlzIG92ZXJyaWRlXG4gKiB0aGUgY29tcGxleCB0eXBlIChub3Qgd2hhdCB3ZSB3YW50KS5cbiAqXG4gKiBAcmV0dXJucyB0eXBlIG5hbWUgYW5kIHdoZXRoZXIgdGhlIHR5cGUgaXMgYSBjb21wbGV4IHR5cGUgKHRydWUpIG9yIHByaW1pdGl2ZSB0eXBlIChmYWxzZSlcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGl0ZW1UeXBlTmFtZXMoc3BlYzogc2NoZW1hLkNvbGxlY3Rpb25Qcm9wZXJ0eSk6IHsgW25hbWU6IHN0cmluZ106IGJvb2xlYW4gfSB7XG4gIGNvbnN0IHR5cGVzID0gY29tcGxleEl0ZW1UeXBlTmFtZXMoc3BlYykubWFwKHR5cGUgPT4gW3R5cGUsIHRydWVdKVxuICAgIC5jb25jYXQocHJpbWl0aXZlSXRlbVR5cGVOYW1lcyhzcGVjKS5tYXAodHlwZSA9PiBbdHlwZSwgZmFsc2VdKSk7XG5cbiAgcmV0dXJuIE9iamVjdC5mcm9tRW50cmllcyh0eXBlcyk7XG59XG5cbmZ1bmN0aW9uIGNvbXBsZXhJdGVtVHlwZU5hbWVzKHNwZWM6IHNjaGVtYS5Db2xsZWN0aW9uUHJvcGVydHkpOiBzdHJpbmdbXSB7XG4gIGlmIChzY2hlbWEuaXNDb21wbGV4TGlzdFByb3BlcnR5KHNwZWMpIHx8IHNjaGVtYS5pc01hcE9mU3RydWN0c1Byb3BlcnR5KHNwZWMpKSB7XG4gICAgcmV0dXJuIFtzcGVjLkl0ZW1UeXBlXTtcbiAgfSBlbHNlIGlmIChzY2hlbWEuaXNVbmlvblByb3BlcnR5KHNwZWMpKSB7XG4gICAgcmV0dXJuIHNwZWMuSXRlbVR5cGVzID8/IHNwZWMuSW5jbHVzaXZlSXRlbVR5cGVzID8/IFtdO1xuICB9XG4gIHJldHVybiBbXTtcbn1cblxuZnVuY3Rpb24gcHJpbWl0aXZlSXRlbVR5cGVOYW1lcyhzcGVjOiBzY2hlbWEuQ29sbGVjdGlvblByb3BlcnR5KTogc3RyaW5nW10ge1xuICBpZiAoc2NoZW1hLmlzTWFwT2ZMaXN0c09mUHJpbWl0aXZlc1Byb3BlcnR5KHNwZWMpKSB7XG4gICAgcmV0dXJuIFtgJHtzcGVjLlByaW1pdGl2ZUl0ZW1JdGVtVHlwZX1bXWBdOyAvLyA8LS0tIHJlYWQgaW4gc3BlY1R5cGVUb0NvZGVUeXBlKClcbiAgfSBlbHNlIGlmIChzY2hlbWEuaXNQcmltaXRpdmVMaXN0UHJvcGVydHkoc3BlYykgfHwgc2NoZW1hLmlzUHJpbWl0aXZlTWFwUHJvcGVydHkoc3BlYykpIHtcbiAgICByZXR1cm4gW3NwZWMuUHJpbWl0aXZlSXRlbVR5cGVdO1xuICB9IGVsc2UgaWYgKHNjaGVtYS5pc1VuaW9uUHJvcGVydHkoc3BlYykpIHtcbiAgICByZXR1cm4gc3BlYy5QcmltaXRpdmVJdGVtVHlwZXMgPz8gc3BlYy5JbmNsdXNpdmVQcmltaXRpdmVJdGVtVHlwZXMgPz8gW107XG4gIH1cbiAgcmV0dXJuIFtdO1xufVxuXG4vKipcbiAqIFJldHVybiBhIGxpc3Qgb2YgYWxsIGFsbG93YWJsZSBpdGVtIHR5cGVzLCBzZXBhcmF0aW5nIG91dCBwcmltaXRpdmUgYW5kIGNvbXBsZXhcbiAqIHR5cGVzIGJlY2F1c2Ugc29tZXRpbWVzIGEgY29tcGxleCB0eXBlIGNhbiBoYXZlIHRoZSBzYW1lIG5hbWUgYXMgYSBwcmltaXRpdmUgdHlwZS5cbiAqIElmIHdlIG9ubHkgcmV0dXJuIHRoZSBuYW1lcyBpbiB0aGlzIGNhc2UgdGhlbiB0aGUgcHJpbWl0aXZlIHR5cGUgd2lsbCBhbHdheXMgb3ZlcnJpZGVcbiAqIHRoZSBjb21wbGV4IHR5cGUgKG5vdCB3aGF0IHdlIHdhbnQpLlxuICpcbiAqIEByZXR1cm5zIHR5cGUgbmFtZSBhbmQgd2hldGhlciB0aGUgdHlwZSBpcyBhIGNvbXBsZXggdHlwZSAodHJ1ZSkgb3IgcHJpbWl0aXZlIHR5cGUgKGZhbHNlKVxuICovXG5leHBvcnQgZnVuY3Rpb24gc2NhbGFyVHlwZU5hbWVzKHNwZWM6IHNjaGVtYS5TY2FsYXJQcm9wZXJ0eSk6IHsgW25hbWU6IHN0cmluZ106IGJvb2xlYW4gfSB7XG4gIGNvbnN0IHR5cGVzID0gY29tcGxleFNjYWxhclR5cGVOYW1lcyhzcGVjKS5tYXAodHlwZSA9PiBbdHlwZSwgdHJ1ZV0gKVxuICAgIC5jb25jYXQocHJpbWl0aXZlU2NhbGFyVHlwZU5hbWVzKHNwZWMpLm1hcCh0eXBlID0+IFt0eXBlLCBmYWxzZV0pKTtcblxuICByZXR1cm4gT2JqZWN0LmZyb21FbnRyaWVzKHR5cGVzKTtcbn1cblxuZnVuY3Rpb24gY29tcGxleFNjYWxhclR5cGVOYW1lcyhzcGVjOiBzY2hlbWEuU2NhbGFyUHJvcGVydHkpOiBzdHJpbmdbXSB7XG4gIGlmIChzY2hlbWEuaXNDb21wbGV4UHJvcGVydHkoc3BlYykgJiYgIXNjaGVtYS5pc0xpc3RQcm9wZXJ0eShzcGVjKSAmJiAhc2NoZW1hLmlzTWFwUHJvcGVydHkoc3BlYykpIHtcbiAgICByZXR1cm4gW3NwZWMuVHlwZV07XG4gIH0gZWxzZSBpZiAoc2NoZW1hLmlzVW5pb25Qcm9wZXJ0eShzcGVjKSkge1xuICAgIHJldHVybiBzcGVjLlR5cGVzIHx8IFtdO1xuICB9XG4gIHJldHVybiBbXTtcbn1cblxuZnVuY3Rpb24gcHJpbWl0aXZlU2NhbGFyVHlwZU5hbWVzKHNwZWM6IHNjaGVtYS5TY2FsYXJQcm9wZXJ0eSk6IHN0cmluZ1tdIHtcbiAgaWYgKHNjaGVtYS5pc1ByaW1pdGl2ZVByb3BlcnR5KHNwZWMpKSB7XG4gICAgcmV0dXJuIFtzcGVjLlByaW1pdGl2ZVR5cGVdO1xuICB9IGVsc2UgaWYgKHNjaGVtYS5pc1VuaW9uUHJvcGVydHkoc3BlYykpIHtcbiAgICByZXR1cm4gc3BlYy5QcmltaXRpdmVUeXBlcyB8fCBbXTtcbiAgfVxuICByZXR1cm4gW107XG59XG4iXX0=