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
    constructor(module, resourceName) {
        this.module = module;
        this.resourceName = resourceName;
    }
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
    constructor(module, resourceName, propAttrName) {
        super(module, resourceName);
        this.propAttrName = propAttrName;
    }
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
    get fqn() {
        return util_1.joinIf(super.fqn, '.', this.propAttrName);
    }
}
exports.PropertyAttributeName = PropertyAttributeName;
/**
 * Return a list of all allowable item types (either primitive or complex).
 */
function itemTypeNames(spec) {
    return complexItemTypeNames(spec).concat(primitiveItemTypeNames(spec));
}
exports.itemTypeNames = itemTypeNames;
function complexItemTypeNames(spec) {
    if (cfnspec_1.schema.isComplexListProperty(spec) || cfnspec_1.schema.isMapOfStructsProperty(spec)) {
        return [spec.ItemType];
    }
    else if (cfnspec_1.schema.isUnionProperty(spec)) {
        return spec.ItemTypes || [];
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
        return spec.PrimitiveItemTypes || [];
    }
    return [];
}
/**
 * Return a list of all allowable types (either primitive or complex).
 */
function scalarTypeNames(spec) {
    return complexScalarTypeNames(spec).concat(primitiveScalarTypeNames(spec));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3BlYy11dGlscy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInNwZWMtdXRpbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsOENBQTBDO0FBQzFDLGlDQUFnQztBQUVoQzs7OztHQUlHO0FBQ0gsTUFBYSxRQUFRO0lBa0JuQixZQUFxQixNQUFjLEVBQVcsWUFBb0I7UUFBN0MsV0FBTSxHQUFOLE1BQU0sQ0FBUTtRQUFXLGlCQUFZLEdBQVosWUFBWSxDQUFRO0lBQ2xFLENBQUM7SUFsQkQ7O09BRUc7SUFDSSxNQUFNLENBQUMsS0FBSyxDQUFDLE9BQWU7UUFDakMsTUFBTSxLQUFLLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNsQyxNQUFNLE1BQU0sR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUUzRCxNQUFNLFNBQVMsR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7UUFFckQsSUFBSSxTQUFTLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtZQUMxQixvQ0FBb0M7WUFDcEMsT0FBTyxJQUFJLFFBQVEsQ0FBQyxNQUFNLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDM0M7UUFFRCxNQUFNLElBQUksS0FBSyxDQUFDLHNDQUFzQyxHQUFHLE9BQU8sQ0FBQyxDQUFDO0lBQ3BFLENBQUM7SUFLRCxJQUFXLEdBQUc7UUFDWixPQUFPLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUM7SUFDaEQsQ0FBQztJQUVNLFlBQVksQ0FBQyxRQUFnQjtRQUNsQyxPQUFPLElBQUkscUJBQXFCLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxJQUFJ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U0FBZ0IsZUFBZSxDQUFDLElBQTJCO0lBQ3pELE9BQU8sc0JBQXNCLENBQUMsSUFBSSxDQUFDLENBQUMsTUFBTSxDQUFDLHdCQUF3QixDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7QUFDN0UsQ0FBQztBQUZELDBDQUVDO0FBRUQsU0FBUyxzQkFBc0IsQ0FBQyxJQUEyQjtJQUN6RCxJQUFJLGdCQUFNLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxnQkFBTSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGdCQUFNLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxFQUFFO1FBQ2pHLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7S0FDcEI7U0FBTSxJQUFJLGdCQUFNLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxFQUFFO1FBQ3ZDLE9BQU8sSUFBSSxDQUFDLEtBQUssSUFBSSxFQUFFLENBQUM7S0FDekI7SUFDRCxPQUFPLEVBQUUsQ0FBQztBQUNaLENBQUM7QUFFRCxTQUFTLHdCQUF3QixDQUFDLElBQTJCO0lBQzNELElBQUksZ0JBQU0sQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsRUFBRTtRQUNwQyxPQUFPLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO0tBQzdCO1NBQU0sSUFBSSxnQkFBTSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsRUFBRTtRQUN2QyxPQUFPLElBQUksQ0FBQyxjQUFjLElBQUksRUFBRSxDQUFDO0tBQ2xDO0lBQ0QsT0FBTyxFQUFFLENBQUM7QUFDWixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgc2NoZW1hIH0gZnJvbSAnQGF3cy1jZGsvY2Zuc3BlYyc7XG5pbXBvcnQgeyBqb2luSWYgfSBmcm9tICcuL3V0aWwnO1xuXG4vKipcbiAqIE5hbWUgb2YgYW4gb2JqZWN0IGluIHRoZSBDbG91ZEZvcm1hdGlvbiBzcGVjXG4gKlxuICogVGhpcyByZWZlcnMgdG8gYSBSZXNvdXJjZSwgcGFyc2VkIGZyb20gYSBzdHJpbmcgbGlrZSAnQVdTOjpTMzo6QnVja2V0Jy5cbiAqL1xuZXhwb3J0IGNsYXNzIFNwZWNOYW1lIHtcbiAgLyoqXG4gICAqIFBhcnNlIGEgc3RyaW5nIHJlcHJlc2VudGluZyBhIG5hbWUgZnJvbSB0aGUgQ2xvdWRGb3JtYXRpb24gc3BlYyB0byBhIENmbk5hbWUgb2JqZWN0XG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHBhcnNlKGNmbk5hbWU6IHN0cmluZyk6IFNwZWNOYW1lIHtcbiAgICBjb25zdCBwYXJ0cyA9IGNmbk5hbWUuc3BsaXQoJzo6Jyk7XG4gICAgY29uc3QgbW9kdWxlID0gcGFydHMuc2xpY2UoMCwgcGFydHMubGVuZ3RoIC0gMSkuam9pbignOjonKTtcblxuICAgIGNvbnN0IGxhc3RQYXJ0cyA9IHBhcnRzW3BhcnRzLmxlbmd0aCAtIDFdLnNwbGl0KCcuJyk7XG5cbiAgICBpZiAobGFzdFBhcnRzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgLy8gUmVzb3VyY2UgbmFtZSwgbG9va3MgbGlrZSBBOjpCOjpDXG4gICAgICByZXR1cm4gbmV3IFNwZWNOYW1lKG1vZHVsZSwgbGFzdFBhcnRzWzBdKTtcbiAgICB9XG5cbiAgICB0aHJvdyBuZXcgRXJyb3IoJ05vdCBhIENsb3VkRm9ybWF0aW9uIHJlc291cmNlIG5hbWU6ICcgKyBjZm5OYW1lKTtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKHJlYWRvbmx5IG1vZHVsZTogc3RyaW5nLCByZWFkb25seSByZXNvdXJjZU5hbWU6IHN0cmluZykge1xuICB9XG5cbiAgcHVibGljIGdldCBmcW4oKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5tb2R1bGUgKyAnOjonICsgdGhpcy5yZXNvdXJjZU5hbWU7XG4gIH1cblxuICBwdWJsaWMgcmVsYXRpdmVOYW1lKHByb3BOYW1lOiBzdHJpbmcpOiBQcm9wZXJ0eUF0dHJpYnV0ZU5hbWUge1xuICAgIHJldHVybiBuZXcgUHJvcGVydHlBdHRyaWJ1dGVOYW1lKHRoaXMubW9kdWxlLCB0aGlzLnJlc291cmNlTmFtZSwgcHJvcE5hbWUpO1xuICB9XG59XG5cbi8qKlxuICogTmFtZSBvZiBhIHByb3BlcnR5IHR5cGUgb3IgYXR0cmlidXRlIGluIHRoZSBDbG91ZEZvcm1hdGlvbiBzcGVjLlxuICpcbiAqIFRoZXNlIGFyZSBzY29wZWQgdG8gYSByZXNvdXJjZSwgcGFyc2VkIGZyb20gYSBzdHJpbmcgbGlrZSAnQVdTOjpTMzo6QnVja2V0LkxpZmVjeWNsZUNvbmZpZ3VyYXRpb24nLlxuICovXG5leHBvcnQgY2xhc3MgUHJvcGVydHlBdHRyaWJ1dGVOYW1lIGV4dGVuZHMgU3BlY05hbWUge1xuICBwdWJsaWMgc3RhdGljIHBhcnNlKGNmbk5hbWU6IHN0cmluZyk6IFByb3BlcnR5QXR0cmlidXRlTmFtZSB7XG4gICAgaWYgKGNmbk5hbWUgPT09ICdUYWcnKSB7XG4gICAgICAvLyBDcmF6eVxuICAgICAgcmV0dXJuIG5ldyBQcm9wZXJ0eUF0dHJpYnV0ZU5hbWUoJycsICcnLCAnVGFnJyk7XG4gICAgfVxuXG4gICAgY29uc3QgcGFydHMgPSBjZm5OYW1lLnNwbGl0KCc6OicpO1xuICAgIGNvbnN0IG1vZHVsZSA9IHBhcnRzLnNsaWNlKDAsIHBhcnRzLmxlbmd0aCAtIDEpLmpvaW4oJzo6Jyk7XG5cbiAgICBjb25zdCBsYXN0UGFydHMgPSBwYXJ0c1twYXJ0cy5sZW5ndGggLSAxXS5zcGxpdCgnLicpO1xuXG4gICAgaWYgKGxhc3RQYXJ0cy5sZW5ndGggPT09IDIpIHtcbiAgICAgIC8vIFByb3BlcnR5VHlwZSBuYW1lLCBsb29rcyBsaWtlIEE6OkI6OkMuRFxuICAgICAgcmV0dXJuIG5ldyBQcm9wZXJ0eUF0dHJpYnV0ZU5hbWUobW9kdWxlLCBsYXN0UGFydHNbMF0sIGxhc3RQYXJ0c1sxXSk7XG4gICAgfVxuXG4gICAgdGhyb3cgbmV3IEVycm9yKCdOb3QgYSByZWNvZ25pemVkIFByb3BlcnR5VHlwZSBuYW1lOiAnICsgY2ZuTmFtZSk7XG4gIH1cblxuICBjb25zdHJ1Y3Rvcihtb2R1bGU6IHN0cmluZywgcmVzb3VyY2VOYW1lOiBzdHJpbmcsIHJlYWRvbmx5IHByb3BBdHRyTmFtZTogc3RyaW5nKSB7XG4gICAgc3VwZXIobW9kdWxlLCByZXNvdXJjZU5hbWUpO1xuICB9XG5cbiAgcHVibGljIGdldCBmcW4oKTogc3RyaW5nIHtcbiAgICByZXR1cm4gam9pbklmKHN1cGVyLmZxbiwgJy4nLCB0aGlzLnByb3BBdHRyTmFtZSk7XG4gIH1cbn1cblxuLyoqXG4gKiBSZXR1cm4gYSBsaXN0IG9mIGFsbCBhbGxvd2FibGUgaXRlbSB0eXBlcyAoZWl0aGVyIHByaW1pdGl2ZSBvciBjb21wbGV4KS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGl0ZW1UeXBlTmFtZXMoc3BlYzogc2NoZW1hLkNvbGxlY3Rpb25Qcm9wZXJ0eSk6IHN0cmluZ1tdIHtcbiAgcmV0dXJuIGNvbXBsZXhJdGVtVHlwZU5hbWVzKHNwZWMpLmNvbmNhdChwcmltaXRpdmVJdGVtVHlwZU5hbWVzKHNwZWMpKTtcbn1cblxuZnVuY3Rpb24gY29tcGxleEl0ZW1UeXBlTmFtZXMoc3BlYzogc2NoZW1hLkNvbGxlY3Rpb25Qcm9wZXJ0eSk6IHN0cmluZ1tdIHtcbiAgaWYgKHNjaGVtYS5pc0NvbXBsZXhMaXN0UHJvcGVydHkoc3BlYykgfHwgc2NoZW1hLmlzTWFwT2ZTdHJ1Y3RzUHJvcGVydHkoc3BlYykpIHtcbiAgICByZXR1cm4gW3NwZWMuSXRlbVR5cGVdO1xuICB9IGVsc2UgaWYgKHNjaGVtYS5pc1VuaW9uUHJvcGVydHkoc3BlYykpIHtcbiAgICByZXR1cm4gc3BlYy5JdGVtVHlwZXMgfHwgW107XG4gIH1cbiAgcmV0dXJuIFtdO1xufVxuXG5mdW5jdGlvbiBwcmltaXRpdmVJdGVtVHlwZU5hbWVzKHNwZWM6IHNjaGVtYS5Db2xsZWN0aW9uUHJvcGVydHkpOiBzdHJpbmdbXSB7XG4gIGlmIChzY2hlbWEuaXNNYXBPZkxpc3RzT2ZQcmltaXRpdmVzUHJvcGVydHkoc3BlYykpIHtcbiAgICByZXR1cm4gW2Ake3NwZWMuUHJpbWl0aXZlSXRlbUl0ZW1UeXBlfVtdYF07IC8vIDwtLS0gcmVhZCBpbiBzcGVjVHlwZVRvQ29kZVR5cGUoKVxuICB9IGVsc2UgaWYgKHNjaGVtYS5pc1ByaW1pdGl2ZUxpc3RQcm9wZXJ0eShzcGVjKSB8fCBzY2hlbWEuaXNQcmltaXRpdmVNYXBQcm9wZXJ0eShzcGVjKSkge1xuICAgIHJldHVybiBbc3BlYy5QcmltaXRpdmVJdGVtVHlwZV07XG4gIH0gZWxzZSBpZiAoc2NoZW1hLmlzVW5pb25Qcm9wZXJ0eShzcGVjKSkge1xuICAgIHJldHVybiBzcGVjLlByaW1pdGl2ZUl0ZW1UeXBlcyB8fCBbXTtcbiAgfVxuICByZXR1cm4gW107XG59XG5cbi8qKlxuICogUmV0dXJuIGEgbGlzdCBvZiBhbGwgYWxsb3dhYmxlIHR5cGVzIChlaXRoZXIgcHJpbWl0aXZlIG9yIGNvbXBsZXgpLlxuICovXG5leHBvcnQgZnVuY3Rpb24gc2NhbGFyVHlwZU5hbWVzKHNwZWM6IHNjaGVtYS5TY2FsYXJQcm9wZXJ0eSk6IHN0cmluZ1tdIHtcbiAgcmV0dXJuIGNvbXBsZXhTY2FsYXJUeXBlTmFtZXMoc3BlYykuY29uY2F0KHByaW1pdGl2ZVNjYWxhclR5cGVOYW1lcyhzcGVjKSk7XG59XG5cbmZ1bmN0aW9uIGNvbXBsZXhTY2FsYXJUeXBlTmFtZXMoc3BlYzogc2NoZW1hLlNjYWxhclByb3BlcnR5KTogc3RyaW5nW10ge1xuICBpZiAoc2NoZW1hLmlzQ29tcGxleFByb3BlcnR5KHNwZWMpICYmICFzY2hlbWEuaXNMaXN0UHJvcGVydHkoc3BlYykgJiYgIXNjaGVtYS5pc01hcFByb3BlcnR5KHNwZWMpKSB7XG4gICAgcmV0dXJuIFtzcGVjLlR5cGVdO1xuICB9IGVsc2UgaWYgKHNjaGVtYS5pc1VuaW9uUHJvcGVydHkoc3BlYykpIHtcbiAgICByZXR1cm4gc3BlYy5UeXBlcyB8fCBbXTtcbiAgfVxuICByZXR1cm4gW107XG59XG5cbmZ1bmN0aW9uIHByaW1pdGl2ZVNjYWxhclR5cGVOYW1lcyhzcGVjOiBzY2hlbWEuU2NhbGFyUHJvcGVydHkpOiBzdHJpbmdbXSB7XG4gIGlmIChzY2hlbWEuaXNQcmltaXRpdmVQcm9wZXJ0eShzcGVjKSkge1xuICAgIHJldHVybiBbc3BlYy5QcmltaXRpdmVUeXBlXTtcbiAgfSBlbHNlIGlmIChzY2hlbWEuaXNVbmlvblByb3BlcnR5KHNwZWMpKSB7XG4gICAgcmV0dXJuIHNwZWMuUHJpbWl0aXZlVHlwZXMgfHwgW107XG4gIH1cbiAgcmV0dXJuIFtdO1xufVxuIl19