"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resourceProperties = exports.l1PropertyType = exports.l1ResourceType = exports.genTypeForProperty = exports.isTagsProperty = exports.l1PropertyName = exports.l1ClassName = void 0;
const cfnspec_1 = require("@aws-cdk/cfnspec");
const codemaker_1 = require("codemaker");
const type_1 = require("../type");
const source_module_1 = require("../source-module");
function l1ClassName(cloudFormationResourceType) {
    const resourceName = cloudFormationResourceType.split('::')[2];
    return `Cfn${resourceName}`; // Has not been recased
}
exports.l1ClassName = l1ClassName;
function l1PropertyName(specPropertyName) {
    return codemaker_1.toCamelCase(specPropertyName);
}
exports.l1PropertyName = l1PropertyName;
function isTagsProperty(prop) {
    return prop[0] === 'Tags';
}
exports.isTagsProperty = isTagsProperty;
function genTypeForProperty(typeName, ...propertyPath) {
    const propPath = [...propertyPath];
    let spec = cfnspec_1.resourceSpecification(typeName);
    while (propPath.length > 0) {
        const next = propPath.shift();
        const propDef = (spec.Properties ?? {})[next];
        if (!propDef) {
            throw new Error(`No property '${next}' in ${typeName}.${propertyPath}`);
        }
        if (propPath.length === 0) {
            // Only record types for now
            if (cfnspec_1.schema.isComplexProperty(propDef)) {
                return l1PropertyType(typeName, propDef.Type);
            }
            else {
                throw new Error(`Cannot return this one yet: ${JSON.stringify(propDef)}`);
            }
        }
        let nextType;
        if (cfnspec_1.schema.isComplexProperty(propDef)) {
            nextType = propDef.Type;
        }
        else if (cfnspec_1.schema.isComplexListProperty(propDef) || cfnspec_1.schema.isComplexMapProperty(propDef)) {
            nextType = propDef.ItemType;
        }
        else {
            throw new Error(`Property '${next}' in ${typeName}.${propertyPath} must be complex`);
        }
        spec = cfnspec_1.propertySpecification(typeName, nextType); // Hope I'm not lying
    }
    throw new Error('Empty property path??');
}
exports.genTypeForProperty = genTypeForProperty;
function l1ResourceType(cloudFormationResourceType) {
    return type_1.existingType(l1ClassName(cloudFormationResourceType), l1File(cloudFormationResourceType));
}
exports.l1ResourceType = l1ResourceType;
function l1PropertyType(cloudFormationResourceType, propTypeName) {
    return type_1.existingType(`${l1ClassName(cloudFormationResourceType)}.${propTypeName}Property`, l1File(cloudFormationResourceType));
}
exports.l1PropertyType = l1PropertyType;
function l1File(cloudFormationResourceType) {
    const parts = cloudFormationResourceType.split('::');
    const svc = parts[1].toLowerCase();
    return new source_module_1.SourceFile(`./lib/${svc}.generated.ts`);
}
function* resourceProperties(typeName) {
    const spec = cfnspec_1.resourceSpecification(typeName);
    for (const [name, definition] of Object.entries(spec.Properties ?? {})) {
        if (!isTagsProperty([name, definition])) {
            yield [name, definition];
        }
    }
}
exports.resourceProperties = resourceProperties;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2ZuMnRzLWNvbnZlbnRpb25zLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY2ZuMnRzLWNvbnZlbnRpb25zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDhDQUF3RjtBQUN4Rix5Q0FBd0M7QUFDeEMsa0NBQThDO0FBQzlDLG9EQUE4QztBQUU5QyxTQUFnQixXQUFXLENBQUMsMEJBQWtDO0lBQzVELE1BQU0sWUFBWSxHQUFHLDBCQUEwQixDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUMvRCxPQUFPLE1BQU0sWUFBWSxFQUFFLENBQUMsQ0FBQyx1QkFBdUI7QUFDdEQsQ0FBQztBQUhELGtDQUdDO0FBRUQsU0FBZ0IsY0FBYyxDQUFDLGdCQUF3QjtJQUNyRCxPQUFPLHVCQUFXLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztBQUN2QyxDQUFDO0FBRkQsd0NBRUM7QUFFRCxTQUFnQixjQUFjLENBQUMsSUFBK0I7SUFDNUQsT0FBTyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssTUFBTSxDQUFDO0FBQzVCLENBQUM7QUFGRCx3Q0FFQztBQUVELFNBQWdCLGtCQUFrQixDQUFDLFFBQWdCLEVBQUUsR0FBRyxZQUFzQjtJQUM1RSxNQUFNLFFBQVEsR0FBRyxDQUFDLEdBQUcsWUFBWSxDQUFDLENBQUM7SUFFbkMsSUFBSSxJQUFJLEdBQWdELCtCQUFxQixDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ3hGLE9BQU8sUUFBUSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7UUFDMUIsTUFBTSxJQUFJLEdBQUcsUUFBUSxDQUFDLEtBQUssRUFBRyxDQUFDO1FBQy9CLE1BQU0sT0FBTyxHQUFHLENBQUMsSUFBSSxDQUFDLFVBQVUsSUFBSSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUM5QyxJQUFJLENBQUMsT0FBTyxFQUFFO1lBQ1osTUFBTSxJQUFJLEtBQUssQ0FBQyxnQkFBZ0IsSUFBSSxRQUFRLFFBQVEs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