"use strict";
// Classes and definitions that have to do with modeling and decisions around code generation
//
// Does not include the actual code generation itself.
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeDispatch = exports.specTypesToCodeTypes = exports.isPrimitive = exports.cloudFormationToScriptName = exports.attributeDefinition = exports.validatorName = exports.fromCfnFactoryName = exports.cfnMapperName = exports.packageName = exports.Attribute = exports.TOKEN_NAME = exports.TAG_NAME = exports.CodeName = exports.CFN_PARSE_NAMESPACE = exports.CORE_NAMESPACE = void 0;
const cfnspec_1 = require("@aws-cdk/cfnspec");
const codemaker = require("codemaker");
const spec_utils_1 = require("./spec-utils");
const util = require("./util");
const RESOURCE_CLASS_PREFIX = 'Cfn';
exports.CORE_NAMESPACE = 'cdk';
exports.CFN_PARSE_NAMESPACE = 'cfn_parse';
/**
 * The name of a class or method in the generated code.
 *
 * Has constructor functions to generate them from the CloudFormation specification.
 *
 * This refers to TypeScript constructs (typically a class)
 */
class CodeName {
    /* eslint-disable @typescript-eslint/no-shadow */
    constructor(packageName, namespace, className, specName, methodName) {
        this.packageName = packageName;
        this.namespace = namespace;
        this.className = className;
        this.specName = specName;
        this.methodName = methodName;
    }
    static forCfnResource(specName, affix) {
        const className = RESOURCE_CLASS_PREFIX + specName.resourceName + affix;
        return new CodeName(packageName(specName), '', className, specName);
    }
    static forResourceProperties(resourceName) {
        return new CodeName(resourceName.packageName, resourceName.namespace, `${resourceName.className}Props`, resourceName.specName);
    }
    static forPropertyType(specName, resourceClass) {
        // Exception for an intrinsic type
        if (specName.propAttrName === 'Tag' && specName.resourceName === '') {
            return exports.TAG_NAME;
        }
        // These are in a namespace named after the resource
        return new CodeName(packageName(specName), resourceClass.className, `${specName.propAttrName}Property`, specName);
    }
    static forPrimitive(primitiveName) {
        return new CodeName('', '', primitiveName);
    }
    /* eslint-enable @typescript-eslint/no-shadow */
    /**
     * Alias for className
     *
     * Simply returns the top-level declaration name,  but reads better at the call site if
     * we're generating a function instead of a class.
     */
    get functionName() {
        return this.className;
    }
    /**
     * Return the fully qualified name of the TypeScript object
     *
     * (When referred to it from the same package)
     */
    get fqn() {
        return util.joinIf(this.namespace, '.', util.joinIf(this.className, '.', this.methodName));
    }
    referToMethod(methodName) {
        return new CodeName(this.packageName, this.namespace, this.className, this.specName, methodName);
    }
    /**
     * Return a relative name from a given name to this name.
     *
     * Strips off the namespace if they're the same, otherwise leaves the namespace on.
     */
    relativeTo(fromName) {
        if (this.namespace === fromName.namespace) {
            return new CodeName(this.packageName, '', this.className, this.specName, this.methodName);
        }
        return this;
    }
}
exports.CodeName = CodeName;
exports.TAG_NAME = new CodeName('', exports.CORE_NAMESPACE, 'CfnTag');
exports.TOKEN_NAME = new CodeName('', exports.CORE_NAMESPACE, 'IResolvable');
/**
 * Resource attribute
 */
class Attribute {
    constructor(propertyName, attributeType, constructorArguments) {
        this.propertyName = propertyName;
        this.attributeType = attributeType;
        this.constructorArguments = constructorArguments;
    }
}
exports.Attribute = Attribute;
/**
 * Return the package in which this CfnName should be stored
 *
 * The "aws-cdk-" part is implicit.
 *
 * Example: AWS::EC2 -> ec2
 */
function packageName(module) {
    if (module instanceof spec_utils_1.SpecName) {
        module = module.module;
    }
    const parts = module.split('::');
    if (['AWS', 'Alexa'].indexOf(parts[0]) === -1 || parts.length !== 2) {
        throw new Error(`Module component name must be "AWS::Xxx" or "Alexa::Xxx" (module: ${module})`);
    }
    return overridePackageName(parts[parts.length - 1].toLowerCase());
}
exports.packageName = packageName;
/**
 * Overrides special-case namespaces like serverless=>sam
 */
function overridePackageName(name) {
    if (name === 'serverless') {
        return 'sam';
    }
    return name;
}
/**
 * Return the name by which the cloudformation-property mapping function will be defined
 *
 * It will not be defined in a namespace, because otherwise we would have to export it and
 * we don't want to expose it to clients.
 */
function cfnMapperName(typeName) {
    if (!typeName.packageName) {
        // Built-in or intrinsic type, built-in mappers
        const mappedType = typeName.className === 'any' ? 'object' : typeName.className;
        return new CodeName('', exports.CORE_NAMESPACE, '', undefined, util.downcaseFirst(`${mappedType}ToCloudFormation`));
    }
    return new CodeName(typeName.packageName, '', util.downcaseFirst(`${typeName.namespace}${typeName.className}ToCloudFormation`));
}
exports.cfnMapperName = cfnMapperName;
/**
 * Return the name of the function that converts a pure CloudFormation value
 * to the appropriate CDK struct instance.
 */
function fromCfnFactoryName(typeName) {
    if (isPrimitive(typeName)) {
        // primitive types are handled by specialized functions from @aws-cdk/core
        return new CodeName('', exports.CFN_PARSE_NAMESPACE, 'FromCloudFormation', undefined, `get${util.upcaseFirst(typeName.className)}`);
    }
    else if (isCloudFormationTagCodeName(typeName)) {
        // tags, since they are shared, have their own function in @aws-cdk/core
        return new CodeName('', exports.CFN_PARSE_NAMESPACE, 'FromCloudFormation', undefined, 'getCfnTag');
    }
    else {
        return new CodeName(typeName.packageName, '', `${typeName.namespace}${typeName.className}FromCloudFormation`);
    }
}
exports.fromCfnFactoryName = fromCfnFactoryName;
function isCloudFormationTagCodeName(codeName) {
    return codeName.className === exports.TAG_NAME.className &&
        codeName.packageName === exports.TAG_NAME.packageName &&
        codeName.namespace === exports.TAG_NAME.namespace;
}
/**
 * Return the name for the type-checking method
 */
function validatorName(typeName) {
    if (typeName.packageName === '') {
        // Built-in or intrinsic type, built-in validators
        const validatedType = typeName.className === 'any' ? 'Object' : codemaker.toPascalCase(typeName.className);
        return new CodeName('', exports.CORE_NAMESPACE, '', undefined, `validate${validatedType}`);
    }
    return new CodeName(typeName.packageName, '', `${util.joinIf(typeName.namespace, '_', typeName.className)}Validator`);
}
exports.validatorName = validatorName;
/**
 * Determine how we will render a CloudFormation attribute in the code
 *
 * This consists of:
 *
 * - The type we will generate for the attribute, including its base class and docs.
 * - The property name we will use to refer to the attribute.
 */
function attributeDefinition(attributeName, spec) {
    const descriptiveName = attributeName.replace(/\./g, '');
    const suffixName = codemaker.toPascalCase(cloudFormationToScriptName(descriptiveName));
    const propertyName = `attr${suffixName}`; // "attrArn"
    let attrType;
    if ('PrimitiveType' in spec && spec.PrimitiveType === 'String') {
        attrType = 'string';
    }
    else if ('PrimitiveType' in spec && spec.PrimitiveType === 'Integer') {
        attrType = 'number';
    }
    else if ('Type' in spec && 'PrimitiveItemType' in spec && spec.Type === 'List' && spec.PrimitiveItemType === 'String') {
        attrType = 'string[]';
    }
    else {
        // eslint-disable-next-line no-console
        console.error(`WARNING: Unable to represent attribute type ${JSON.stringify(spec)} as a native type`);
        attrType = exports.TOKEN_NAME.fqn;
    }
    const constructorArguments = `this.getAtt('${attributeName}')`;
    return new Attribute(propertyName, attrType, constructorArguments);
}
exports.attributeDefinition = attributeDefinition;
/**
 * Convert a CloudFormation name to a nice TypeScript name
 *
 * We use a library to camelcase, and fix up some things that translate incorrectly.
 *
 * For example, the library breaks when pluralizing an abbreviation, such as "ProviderARNs" -> "providerArNs".
 *
 * We currently recognize "ARNs", "MBs" and "AZs".
 */
function cloudFormationToScriptName(name) {
    if (name === 'VPCs') {
        return 'vpcs';
    }
    const ret = codemaker.toCamelCase(name);
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const suffixes = { ARNs: 'Arns', MBs: 'MBs', AZs: 'AZs' };
    for (const suffix of Object.keys(suffixes)) {
        if (name.endsWith(suffix)) {
            return ret.substr(0, ret.length - suffix.length) + suffixes[suffix];
        }
    }
    return ret;
}
exports.cloudFormationToScriptName = cloudFormationToScriptName;
function specPrimitiveToCodePrimitive(type) {
    switch (type) {
        case 'Boolean': return CodeName.forPrimitive('boolean');
        case 'Double': return CodeName.forPrimitive('number');
        case 'Integer': return CodeName.forPrimitive('number');
        case 'Json': return CodeName.forPrimitive('any');
        case 'Long': return CodeName.forPrimitive('number');
        case 'String': return CodeName.forPrimitive('string');
        case 'Timestamp': return CodeName.forPrimitive('Date');
        default: throw new Error(`Invalid primitive type: ${type}`);
    }
}
function isPrimitive(type) {
    return type.className === 'boolean'
        || type.className === 'number'
        || type.className === 'any'
        || type.className === 'string'
        || type.className === 'Date';
}
exports.isPrimitive = isPrimitive;
function specTypeToCodeType(resourceContext, type) {
    if (type.endsWith('[]')) {
        const itemType = specTypeToCodeType(resourceContext, type.substr(0, type.length - 2));
        return CodeName.forPrimitive(`${itemType.className}[]`);
    }
    if (cfnspec_1.schema.isPrimitiveType(type)) {
        return specPrimitiveToCodePrimitive(type);
    }
    else if (type === 'Tag') {
        // Tags are not considered primitive by the CloudFormation spec (even though they are intrinsic)
        // so we won't consider them primitive either.
        return exports.TAG_NAME;
    }
    const typeName = resourceContext.specName.relativeName(type);
    return CodeName.forPropertyType(typeName, resourceContext);
}
/**
 * Translate a list of type references in a resource context to a list of code names
 */
function specTypesToCodeTypes(resourceContext, types) {
    return types.map(type => specTypeToCodeType(resourceContext, type));
}
exports.specTypesToCodeTypes = specTypesToCodeTypes;
/**
 * Invoke the right visitor method for the given property, depending on its type
 *
 * We use the term "atom" in this context to mean a type that can only accept a single
 * value of a given type. This is to contrast it with collections and unions.
 */
function typeDispatch(resourceContext, spec, visitor) {
    const scalarTypes = specTypesToCodeTypes(resourceContext, spec_utils_1.scalarTypeNames(spec));
    const itemTypes = specTypesToCodeTypes(resourceContext, spec_utils_1.itemTypeNames(spec));
    if (scalarTypes.length && itemTypes.length) {
        // Can accept both a collection a/nd a scalar
        return visitor.visitListOrAtom(scalarTypes, itemTypes);
    }
    if (cfnspec_1.schema.isCollectionProperty(spec)) {
        // List or map, of either atoms or unions
        if (cfnspec_1.schema.isMapProperty(spec)) {
            if (cfnspec_1.schema.isMapOfListsOfPrimitivesProperty(spec)) {
                // remove the '[]' from the type
                const baseType = itemTypes[0].className;
                const itemType = CodeName.forPrimitive(baseType.substr(0, baseType.length - 2));
                return visitor.visitMapOfLists(itemType);
            }
            if (itemTypes.length > 1) {
                return visitor.visitUnionMap(itemTypes);
            }
            else {
                return visitor.visitMap(itemTypes[0]);
            }
        }
        else {
            if (itemTypes.length > 1) {
                return visitor.visitUnionList(itemTypes);
            }
            else {
                return visitor.visitList(itemTypes[0]);
            }
        }
    }
    // Atom or union of atoms
    if (scalarTypes.length > 1) {
        return visitor.visitAtomUnion(scalarTypes);
    }
    else {
        return visitor.visitAtom(scalarTypes[0]);
    }
}
exports.typeDispatch = typeDispatch;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2Vuc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImdlbnNwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLDZGQUE2RjtBQUM3RixFQUFFO0FBQ0Ysc0RBQXNEOzs7QUFFdEQsOENBQTBDO0FBQzFDLHVDQUF1QztBQUN2Qyw2Q0FBK0Y7QUFDL0YsK0JBQStCO0FBRS9CLE1BQU0scUJBQXFCLEdBQUcsS0FBSyxDQUFDO0FBRXZCLFFBQUEsY0FBYyxHQUFHLEtBQUssQ0FBQztBQUN2QixRQUFBLG1CQUFtQixHQUFHLFdBQVcsQ0FBQztBQUUvQzs7Ozs7O0dBTUc7QUFDSCxNQUFhLFFBQVE7SUF3Qm5CLGlEQUFpRDtJQUNqRCxZQUNXLFdBQW1CLEVBQ25CLFNBQWlCLEVBQ2pCLFNBQWlCLEVBQ2pCLFFBQW1CLEVBQ25CLFVBQW1CO1FBSm5CLGdCQUFXLEdBQVgsV0FBVyxDQUFRO1FBQ25CLGNBQVMsR0FBVCxTQUFTLENBQVE7UUFDakIsY0FBUyxHQUFULFNBQVMsQ0FBUTtRQUNqQixhQUFRLEdBQVIsUUFBUSxDQUFXO1FBQ25CLGVBQVUsR0FBVixVQUFVLENBQVM7SUFDOUIsQ0FBQztJQTlCTSxNQUFNLENBQUMsY0FBYyxDQUFDLFFBQWtCLEVBQUUsS0FBYTtRQUM1RCxNQUFNLFNBQVMsR0FBRyxxQkFBcUIsR0FBRyxRQUFRLENBQUMsWUFBWSxHQUFHLEtBQUssQ0FBQztRQUN4RSxPQUFPLElBQUksUUFBUSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsRUFBRSxFQUFFLEVBQUUsU0FBUyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQ3RFLENBQUM7SUFFTSxNQUFNLENBQUMscUJBQXFCLENBQUMsWUFBc0I7UUFDeEQsT0FBTyxJQUFJLFFBQVEsQ0FBQyxZQUFZLENBQUMsV0FBVyxFQUFFLFlBQVksQ0FBQyxTQUFTLEVBQUUsR0FBRyxZQUFZLENBQUMsU0FBUyxPQUFPLEVBQUUsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ2pJLENB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TUFBTSxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2hGLE9BQU8sT0FBTyxDQUFDLGVBQWUsQ0FBQyxRQUFRLENBQUMsQ0FBQzthQUMxQztZQUNELElBQUksU0FBUyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7Z0JBQ3hCLE9BQU8sT0FBTyxDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUMsQ0FBQzthQUN6QztpQkFBTTtnQkFDTCxPQUFPLE9BQU8sQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDdkM7U0FDRjthQUFNO1lBQ0wsSUFBSSxTQUFTLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtnQkFDeEIsT0FBTyxPQUFPLENBQUMsY0FBYyxDQUFDLFNBQVMsQ0FBQyxDQUFDO2FBQzFDO2lCQUFNO2dCQUNMLE9BQU8sT0FBTyxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUN4QztTQUNGO0tBQ0Y7SUFFRCx5QkFBeUI7SUFDekIsSUFBSSxXQUFXLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtRQUMxQixPQUFPLE9BQU8sQ0FBQyxjQUFjLENBQUMsV0FBVyxDQUFDLENBQUM7S0FDNUM7U0FBTTtRQUNMLE9BQU8sT0FBTyxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUMxQztBQUVILENBQUM7QUF2Q0Qsb0NBdUNDIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQ2xhc3NlcyBhbmQgZGVmaW5pdGlvbnMgdGhhdCBoYXZlIHRvIGRvIHdpdGggbW9kZWxpbmcgYW5kIGRlY2lzaW9ucyBhcm91bmQgY29kZSBnZW5lcmF0aW9uXG4vL1xuLy8gRG9lcyBub3QgaW5jbHVkZSB0aGUgYWN0dWFsIGNvZGUgZ2VuZXJhdGlvbiBpdHNlbGYuXG5cbmltcG9ydCB7IHNjaGVtYSB9IGZyb20gJ0Bhd3MtY2RrL2NmbnNwZWMnO1xuaW1wb3J0ICogYXMgY29kZW1ha2VyIGZyb20gJ2NvZGVtYWtlcic7XG5pbXBvcnQgeyBpdGVtVHlwZU5hbWVzLCBQcm9wZXJ0eUF0dHJpYnV0ZU5hbWUsIHNjYWxhclR5cGVOYW1lcywgU3BlY05hbWUgfSBmcm9tICcuL3NwZWMtdXRpbHMnO1xuaW1wb3J0ICogYXMgdXRpbCBmcm9tICcuL3V0aWwnO1xuXG5jb25zdCBSRVNPVVJDRV9DTEFTU19QUkVGSVggPSAnQ2ZuJztcblxuZXhwb3J0IGNvbnN0IENPUkVfTkFNRVNQQUNFID0gJ2Nkayc7XG5leHBvcnQgY29uc3QgQ0ZOX1BBUlNFX05BTUVTUEFDRSA9ICdjZm5fcGFyc2UnO1xuXG4vKipcbiAqIFRoZSBuYW1lIG9mIGEgY2xhc3Mgb3IgbWV0aG9kIGluIHRoZSBnZW5lcmF0ZWQgY29kZS5cbiAqXG4gKiBIYXMgY29uc3RydWN0b3IgZnVuY3Rpb25zIHRvIGdlbmVyYXRlIHRoZW0gZnJvbSB0aGUgQ2xvdWRGb3JtYXRpb24gc3BlY2lmaWNhdGlvbi5cbiAqXG4gKiBUaGlzIHJlZmVycyB0byBUeXBlU2NyaXB0IGNvbnN0cnVjdHMgKHR5cGljYWxseSBhIGNsYXNzKVxuICovXG5leHBvcnQgY2xhc3MgQ29kZU5hbWUge1xuICBwdWJsaWMgc3RhdGljIGZvckNmblJlc291cmNlKHNwZWNOYW1lOiBTcGVjTmFtZSwgYWZmaXg6IHN0cmluZyk6IENvZGVOYW1lIHtcbiAgICBjb25zdCBjbGFzc05hbWUgPSBSRVNPVVJDRV9DTEFTU19QUkVGSVggKyBzcGVjTmFtZS5yZXNvdXJjZU5hbWUgKyBhZmZpeDtcbiAgICByZXR1cm4gbmV3IENvZGVOYW1lKHBhY2thZ2VOYW1lKHNwZWNOYW1lKSwgJycsIGNsYXNzTmFtZSwgc3BlY05hbWUpO1xuICB9XG5cbiAgcHVibGljIHN0YXRpYyBmb3JSZXNvdXJjZVByb3BlcnRpZXMocmVzb3VyY2VOYW1lOiBDb2RlTmFtZSk6IENvZGVOYW1lIHtcbiAgICByZXR1cm4gbmV3IENvZGVOYW1lKHJlc291cmNlTmFtZS5wYWNrYWdlTmFtZSwgcmVzb3VyY2VOYW1lLm5hbWVzcGFjZSwgYCR7cmVzb3VyY2VOYW1lLmNsYXNzTmFtZX1Qcm9wc2AsIHJlc291cmNlTmFtZS5zcGVjTmFtZSk7XG4gIH1cblxuICBwdWJsaWMgc3RhdGljIGZvclByb3BlcnR5VHlwZShzcGVjTmFtZTogUHJvcGVydHlBdHRyaWJ1dGVOYW1lLCByZXNvdXJjZUNsYXNzOiBDb2RlTmFtZSk6IENvZGVOYW1lIHtcbiAgICAvLyBFeGNlcHRpb24gZm9yIGFuIGludHJpbnNpYyB0eXBlXG4gICAgaWYgKHNwZWNOYW1lLnByb3BBdHRyTmFtZSA9PT0gJ1RhZycgJiYgc3BlY05hbWUucmVzb3VyY2VOYW1lID09PSAnJykge1xuICAgICAgcmV0dXJuIFRBR19OQU1FO1xuICAgIH1cblxuICAgIC8vIFRoZXNlIGFyZSBpbiBhIG5hbWVzcGFjZSBuYW1lZCBhZnRlciB0aGUgcmVzb3VyY2VcbiAgICByZXR1cm4gbmV3IENvZGVOYW1lKHBhY2thZ2VOYW1lKHNwZWNOYW1lKSwgcmVzb3VyY2VDbGFzcy5jbGFzc05hbWUsIGAke3NwZWNOYW1lLnByb3BBdHRyTmFtZX1Qcm9wZXJ0eWAsIHNwZWNOYW1lKTtcbiAgfVxuXG4gIHB1YmxpYyBzdGF0aWMgZm9yUHJpbWl0aXZlKHByaW1pdGl2ZU5hbWU6IHN0cmluZyk6IENvZGVOYW1lIHtcbiAgICByZXR1cm4gbmV3IENvZGVOYW1lKCcnLCAnJywgcHJpbWl0aXZlTmFtZSk7XG4gIH1cblxuICAvKiBlc2xpbnQtZGlzYWJsZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tc2hhZG93ICovXG4gIGNvbnN0cnVjdG9yKFxuICAgIHJlYWRvbmx5IHBhY2thZ2VOYW1lOiBzdHJpbmcsXG4gICAgcmVhZG9ubHkgbmFtZXNwYWNlOiBzdHJpbmcsXG4gICAgcmVhZG9ubHkgY2xhc3NOYW1lOiBzdHJpbmcsXG4gICAgcmVhZG9ubHkgc3BlY05hbWU/OiBTcGVjTmFtZSxcbiAgICByZWFkb25seSBtZXRob2ROYW1lPzogc3RyaW5nKSB7XG4gIH1cbiAgLyogZXNsaW50LWVuYWJsZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tc2hhZG93ICovXG5cbiAgLyoqXG4gICAqIEFsaWFzIGZvciBjbGFzc05hbWVcbiAgICpcbiAgICogU2ltcGx5IHJldHVybnMgdGhlIHRvcC1sZXZlbCBkZWNsYXJhdGlvbiBuYW1lLCAgYnV0IHJlYWRzIGJldHRlciBhdCB0aGUgY2FsbCBzaXRlIGlmXG4gICAqIHdlJ3JlIGdlbmVyYXRpbmcgYSBmdW5jdGlvbiBpbnN0ZWFkIG9mIGEgY2xhc3MuXG4gICAqL1xuICBwdWJsaWMgZ2V0IGZ1bmN0aW9uTmFtZSgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLmNsYXNzTmFtZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm4gdGhlIGZ1bGx5IHF1YWxpZmllZCBuYW1lIG9mIHRoZSBUeXBlU2NyaXB0IG9iamVjdFxuICAgKlxuICAgKiAoV2hlbiByZWZlcnJlZCB0byBpdCBmcm9tIHRoZSBzYW1lIHBhY2thZ2UpXG4gICAqL1xuICBwdWJsaWMgZ2V0IGZxbigpOiBzdHJpbmcge1xuICAgIHJldHVybiB1dGlsLmpvaW5JZih0aGlzLm5hbWVzcGFjZSwgJy4nLCB1dGlsLmpvaW5JZih0aGlzLmNsYXNzTmFtZSwgJy4nLCB0aGlzLm1ldGhvZE5hbWUpKTtcbiAgfVxuXG4gIHB1YmxpYyByZWZlclRvTWV0aG9kKG1ldGhvZE5hbWU6IHN0cmluZyk6IENvZGVOYW1lIHtcbiAgICByZXR1cm4gbmV3IENvZGVOYW1lKHRoaXMucGFja2FnZU5hbWUsIHRoaXMubmFtZXNwYWNlLCB0aGlzLmNsYXNzTmFtZSwgdGhpcy5zcGVjTmFtZSwgbWV0aG9kTmFtZSk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJuIGEgcmVsYXRpdmUgbmFtZSBmcm9tIGEgZ2l2ZW4gbmFtZSB0byB0aGlzIG5hbWUuXG4gICAqXG4gICAqIFN0cmlwcyBvZmYgdGhlIG5hbWVzcGFjZSBpZiB0aGV5J3JlIHRoZSBzYW1lLCBvdGhlcndpc2UgbGVhdmVzIHRoZSBuYW1lc3BhY2Ugb24uXG4gICAqL1xuICBwdWJsaWMgcmVsYXRpdmVUbyhmcm9tTmFtZTogQ29kZU5hbWUpOiBDb2RlTmFtZSB7XG4gICAgaWYgKHRoaXMubmFtZXNwYWNlID09PSBmcm9tTmFtZS5uYW1lc3BhY2UpIHtcbiAgICAgIHJldHVybiBuZXcgQ29kZU5hbWUodGhpcy5wYWNrYWdlTmFtZSwgJycsIHRoaXMuY2xhc3NOYW1lLCB0aGlzLnNwZWNOYW1lLCB0aGlzLm1ldGhvZE5hbWUpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfVxufVxuXG5leHBvcnQgY29uc3QgVEFHX05BTUUgPSBuZXcgQ29kZU5hbWUoJycsIENPUkVfTkFNRVNQQUNFLCAnQ2ZuVGFnJyk7XG5leHBvcnQgY29uc3QgVE9LRU5fTkFNRSA9IG5ldyBDb2RlTmFtZSgnJywgQ09SRV9OQU1FU1BBQ0UsICdJUmVzb2x2YWJsZScpO1xuXG4vKipcbiAqIFJlc291cmNlIGF0dHJpYnV0ZVxuICovXG5leHBvcnQgY2xhc3MgQXR0cmlidXRlIHtcbiAgY29uc3RydWN0b3IoXG4gICAgcmVhZG9ubHkgcHJvcGVydHlOYW1lOiBzdHJpbmcsXG4gICAgcmVhZG9ubHkgYXR0cmlidXRlVHlwZTogc3RyaW5nLFxuICAgIHJlYWRvbmx5IGNvbnN0cnVjdG9yQXJndW1lbnRzOiBzdHJpbmcpIHtcbiAgfVxufVxuXG4vKipcbiAqIFJldHVybiB0aGUgcGFja2FnZSBpbiB3aGljaCB0aGlzIENmbk5hbWUgc2hvdWxkIGJlIHN0b3JlZFxuICpcbiAqIFRoZSBcImF3cy1jZGstXCIgcGFydCBpcyBpbXBsaWNpdC5cbiAqXG4gKiBFeGFtcGxlOiBBV1M6OkVDMiAtPiBlYzJcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHBhY2thZ2VOYW1lKG1vZHVsZTogU3BlY05hbWUgfCBzdHJpbmcpOiBzdHJpbmcge1xuICBpZiAobW9kdWxlIGluc3RhbmNlb2YgU3BlY05hbWUpIHtcbiAgICBtb2R1bGUgPSBtb2R1bGUubW9kdWxlO1xuICB9XG5cbiAgY29uc3QgcGFydHMgPSBtb2R1bGUuc3BsaXQoJzo6Jyk7XG5cbiAgaWYgKFsnQVdTJywgJ0FsZXhhJ10uaW5kZXhPZihwYXJ0c1swXSkgPT09IC0xIHx8IHBhcnRzLmxlbmd0aCAhPT0gMikge1xuICAgIHRocm93IG5ldyBFcnJvcihgTW9kdWxlIGNvbXBvbmVudCBuYW1lIG11c3QgYmUgXCJBV1M6Olh4eFwiIG9yIFwiQWxleGE6Olh4eFwiIChtb2R1bGU6ICR7bW9kdWxlfSlgKTtcbiAgfVxuXG4gIHJldHVybiBvdmVycmlkZVBhY2thZ2VOYW1lKHBhcnRzW3BhcnRzLmxlbmd0aCAtIDFdLnRvTG93ZXJDYXNlKCkpO1xufVxuXG4vKipcbiAqIE92ZXJyaWRlcyBzcGVjaWFsLWNhc2UgbmFtZXNwYWNlcyBsaWtlIHNlcnZlcmxlc3M9PnNhbVxuICovXG5mdW5jdGlvbiBvdmVycmlkZVBhY2thZ2VOYW1lKG5hbWU6IHN0cmluZyk6IHN0cmluZyB7XG4gIGlmIChuYW1lID09PSAnc2VydmVybGVzcycpIHtcbiAgICByZXR1cm4gJ3NhbSc7XG4gIH1cbiAgcmV0dXJuIG5hbWU7XG59XG5cbi8qKlxuICogUmV0dXJuIHRoZSBuYW1lIGJ5IHdoaWNoIHRoZSBjbG91ZGZvcm1hdGlvbi1wcm9wZXJ0eSBtYXBwaW5nIGZ1bmN0aW9uIHdpbGwgYmUgZGVmaW5lZFxuICpcbiAqIEl0IHdpbGwgbm90IGJlIGRlZmluZWQgaW4gYSBuYW1lc3BhY2UsIGJlY2F1c2Ugb3RoZXJ3aXNlIHdlIHdvdWxkIGhhdmUgdG8gZXhwb3J0IGl0IGFuZFxuICogd2UgZG9uJ3Qgd2FudCB0byBleHBvc2UgaXQgdG8gY2xpZW50cy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNmbk1hcHBlck5hbWUodHlwZU5hbWU6IENvZGVOYW1lKTogQ29kZU5hbWUge1xuICBpZiAoIXR5cGVOYW1lLnBhY2thZ2VOYW1lKSB7XG4gICAgLy8gQnVpbHQtaW4gb3IgaW50cmluc2ljIHR5cGUsIGJ1aWx0LWluIG1hcHBlcnNcbiAgICBjb25zdCBtYXBwZWRUeXBlID0gdHlwZU5hbWUuY2xhc3NOYW1lID09PSAnYW55JyA/ICdvYmplY3QnIDogdHlwZU5hbWUuY2xhc3NOYW1lO1xuICAgIHJldHVybiBuZXcgQ29kZU5hbWUoJycsIENPUkVfTkFNRVNQQUNFLCAnJywgdW5kZWZpbmVkLCB1dGlsLmRvd25jYXNlRmlyc3QoYCR7bWFwcGVkVHlwZX1Ub0Nsb3VkRm9ybWF0aW9uYCkpO1xuICB9XG5cbiAgcmV0dXJuIG5ldyBDb2RlTmFtZSh0eXBlTmFtZS5wYWNrYWdlTmFtZSwgJycsIHV0aWwuZG93bmNhc2VGaXJzdChgJHt0eXBlTmFtZS5uYW1lc3BhY2V9JHt0eXBlTmFtZS5jbGFzc05hbWV9VG9DbG91ZEZvcm1hdGlvbmApKTtcbn1cblxuLyoqXG4gKiBSZXR1cm4gdGhlIG5hbWUgb2YgdGhlIGZ1bmN0aW9uIHRoYXQgY29udmVydHMgYSBwdXJlIENsb3VkRm9ybWF0aW9uIHZhbHVlXG4gKiB0byB0aGUgYXBwcm9wcmlhdGUgQ0RLIHN0cnVjdCBpbnN0YW5jZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZyb21DZm5GYWN0b3J5TmFtZSh0eXBlTmFtZTogQ29kZU5hbWUpOiBDb2RlTmFtZSB7XG4gIGlmIChpc1ByaW1pdGl2ZSh0eXBlTmFtZSkpIHtcbiAgICAvLyBwcmltaXRpdmUgdHlwZXMgYXJlIGhhbmRsZWQgYnkgc3BlY2lhbGl6ZWQgZnVuY3Rpb25zIGZyb20gQGF3cy1jZGsvY29yZVxuICAgIHJldHVybiBuZXcgQ29kZU5hbWUoJycsIENGTl9QQVJTRV9OQU1FU1BBQ0UsICdGcm9tQ2xvdWRGb3JtYXRpb24nLCB1bmRlZmluZWQsIGBnZXQke3V0aWwudXBjYXNlRmlyc3QodHlwZU5hbWUuY2xhc3NOYW1lKX1gKTtcbiAgfSBlbHNlIGlmIChpc0Nsb3VkRm9ybWF0aW9uVGFnQ29kZU5hbWUodHlwZU5hbWUpKSB7XG4gICAgLy8gdGFncywgc2luY2UgdGhleSBhcmUgc2hhcmVkLCBoYXZlIHRoZWlyIG93biBmdW5jdGlvbiBpbiBAYXdzLWNkay9jb3JlXG4gICAgcmV0dXJuIG5ldyBDb2RlTmFtZSgnJywgQ0ZOX1BBUlNFX05BTUVTUEFDRSwgJ0Zyb21DbG91ZEZvcm1hdGlvbicsIHVuZGVmaW5lZCwgJ2dldENmblRhZycpO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBuZXcgQ29kZU5hbWUodHlwZU5hbWUucGFja2FnZU5hbWUsICcnLCBgJHt0eXBlTmFtZS5uYW1lc3BhY2V9JHt0eXBlTmFtZS5jbGFzc05hbWV9RnJvbUNsb3VkRm9ybWF0aW9uYCk7XG4gIH1cbn1cblxuZnVuY3Rpb24gaXNDbG91ZEZvcm1hdGlvblRhZ0NvZGVOYW1lKGNvZGVOYW1lOiBDb2RlTmFtZSk6IGJvb2xlYW4ge1xuICByZXR1cm4gY29kZU5hbWUuY2xhc3NOYW1lID09PSBUQUdfTkFNRS5jbGFzc05hbWUgJiZcbiAgICBjb2RlTmFtZS5wYWNrYWdlTmFtZSA9PT0gVEFHX05BTUUucGFja2FnZU5hbWUgJiZcbiAgICBjb2RlTmFtZS5uYW1lc3BhY2UgPT09IFRBR19OQU1FLm5hbWVzcGFjZTtcbn1cblxuLyoqXG4gKiBSZXR1cm4gdGhlIG5hbWUgZm9yIHRoZSB0eXBlLWNoZWNraW5nIG1ldGhvZFxuICovXG5leHBvcnQgZnVuY3Rpb24gdmFsaWRhdG9yTmFtZSh0eXBlTmFtZTogQ29kZU5hbWUpOiBDb2RlTmFtZSB7XG4gIGlmICh0eXBlTmFtZS5wYWNrYWdlTmFtZSA9PT0gJycpIHtcbiAgICAvLyBCdWlsdC1pbiBvciBpbnRyaW5zaWMgdHlwZSwgYnVpbHQtaW4gdmFsaWRhdG9yc1xuICAgIGNvbnN0IHZhbGlkYXRlZFR5cGUgPSB0eXBlTmFtZS5jbGFzc05hbWUgPT09ICdhbnknID8gJ09iamVjdCcgOiBjb2RlbWFrZXIudG9QYXNjYWxDYXNlKHR5cGVOYW1lLmNsYXNzTmFtZSk7XG4gICAgcmV0dXJuIG5ldyBDb2RlTmFtZSgnJywgQ09SRV9OQU1FU1BBQ0UsICcnLCB1bmRlZmluZWQsIGB2YWxpZGF0ZSR7dmFsaWRhdGVkVHlwZX1gKTtcbiAgfVxuXG4gIHJldHVybiBuZXcgQ29kZU5hbWUodHlwZU5hbWUucGFja2FnZU5hbWUsICcnLCBgJHt1dGlsLmpvaW5JZih0eXBlTmFtZS5uYW1lc3BhY2UsICdfJywgdHlwZU5hbWUuY2xhc3NOYW1lKX1WYWxpZGF0b3JgKTtcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaG93IHdlIHdpbGwgcmVuZGVyIGEgQ2xvdWRGb3JtYXRpb24gYXR0cmlidXRlIGluIHRoZSBjb2RlXG4gKlxuICogVGhpcyBjb25zaXN0cyBvZjpcbiAqXG4gKiAtIFRoZSB0eXBlIHdlIHdpbGwgZ2VuZXJhdGUgZm9yIHRoZSBhdHRyaWJ1dGUsIGluY2x1ZGluZyBpdHMgYmFzZSBjbGFzcyBhbmQgZG9jcy5cbiAqIC0gVGhlIHByb3BlcnR5IG5hbWUgd2Ugd2lsbCB1c2UgdG8gcmVmZXIgdG8gdGhlIGF0dHJpYnV0ZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGF0dHJpYnV0ZURlZmluaXRpb24oYXR0cmlidXRlTmFtZTogc3RyaW5nLCBzcGVjOiBzY2hlbWEuQXR0cmlidXRlKTogQXR0cmlidXRlIHtcbiAgY29uc3QgZGVzY3JpcHRpdmVOYW1lID0gYXR0cmlidXRlTmFtZS5yZXBsYWNlKC9cXC4vZywgJycpO1xuICBjb25zdCBzdWZmaXhOYW1lID0gY29kZW1ha2VyLnRvUGFzY2FsQ2FzZShjbG91ZEZvcm1hdGlvblRvU2NyaXB0TmFtZShkZXNjcmlwdGl2ZU5hbWUpKTtcbiAgY29uc3QgcHJvcGVydHlOYW1lID0gYGF0dHIke3N1ZmZpeE5hbWV9YDsgLy8gXCJhdHRyQXJuXCJcblxuICBsZXQgYXR0clR5cGU6IHN0cmluZztcbiAgaWYgKCdQcmltaXRpdmVUeXBlJyBpbiBzcGVjICYmIHNwZWMuUHJpbWl0aXZlVHlwZSA9PT0gJ1N0cmluZycpIHtcbiAgICBhdHRyVHlwZSA9ICdzdHJpbmcnO1xuICB9IGVsc2UgaWYgKCdQcmltaXRpdmVUeXBlJyBpbiBzcGVjICYmIHNwZWMuUHJpbWl0aXZlVHlwZSA9PT0gJ0ludGVnZXInKSB7XG4gICAgYXR0clR5cGUgPSAnbnVtYmVyJztcbiAgfSBlbHNlIGlmICgnVHlwZScgaW4gc3BlYyAmJiAnUHJpbWl0aXZlSXRlbVR5cGUnIGluIHNwZWMgJiYgc3BlYy5UeXBlID09PSAnTGlzdCcgJiYgc3BlYy5QcmltaXRpdmVJdGVtVHlwZSA9PT0gJ1N0cmluZycpIHtcbiAgICBhdHRyVHlwZSA9ICdzdHJpbmdbXSc7XG4gIH0gZWxzZSB7XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnNvbGVcbiAgICBjb25zb2xlLmVycm9yKGBXQVJOSU5HOiBVbmFibGUgdG8gcmVwcmVzZW50IGF0dHJpYnV0ZSB0eXBlICR7SlNPTi5zdHJpbmdpZnkoc3BlYyl9IGFzIGEgbmF0aXZlIHR5cGVgKTtcbiAgICBhdHRyVHlwZSA9IFRPS0VOX05BTUUuZnFuO1xuICB9XG5cbiAgY29uc3QgY29uc3RydWN0b3JBcmd1bWVudHMgPSBgdGhpcy5nZXRBdHQoJyR7YXR0cmlidXRlTmFtZX0nKWA7XG4gIHJldHVybiBuZXcgQXR0cmlidXRlKHByb3BlcnR5TmFtZSwgYXR0clR5cGUsIGNvbnN0cnVjdG9yQXJndW1lbnRzKTtcbn1cblxuLyoqXG4gKiBDb252ZXJ0IGEgQ2xvdWRGb3JtYXRpb24gbmFtZSB0byBhIG5pY2UgVHlwZVNjcmlwdCBuYW1lXG4gKlxuICogV2UgdXNlIGEgbGlicmFyeSB0byBjYW1lbGNhc2UsIGFuZCBmaXggdXAgc29tZSB0aGluZ3MgdGhhdCB0cmFuc2xhdGUgaW5jb3JyZWN0bHkuXG4gKlxuICogRm9yIGV4YW1wbGUsIHRoZSBsaWJyYXJ5IGJyZWFrcyB3aGVuIHBsdXJhbGl6aW5nIGFuIGFiYnJldmlhdGlvbiwgc3VjaCBhcyBcIlByb3ZpZGVyQVJOc1wiIC0+IFwicHJvdmlkZXJBck5zXCIuXG4gKlxuICogV2UgY3VycmVudGx5IHJlY29nbml6ZSBcIkFSTnNcIiwgXCJNQnNcIiBhbmQgXCJBWnNcIi5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNsb3VkRm9ybWF0aW9uVG9TY3JpcHROYW1lKG5hbWU6IHN0cmluZyk6IHN0cmluZyB7XG4gIGlmIChuYW1lID09PSAnVlBDcycpIHsgcmV0dXJuICd2cGNzJzsgfVxuICBjb25zdCByZXQgPSBjb2RlbWFrZXIudG9DYW1lbENhc2UobmFtZSk7XG5cbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uYW1pbmctY29udmVudGlvblxuICBjb25zdCBzdWZmaXhlczogeyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfSA9IHsgQVJOczogJ0FybnMnLCBNQnM6ICdNQnMnLCBBWnM6ICdBWnMnIH07XG5cbiAgZm9yIChjb25zdCBzdWZmaXggb2YgT2JqZWN0LmtleXMoc3VmZml4ZXMpKSB7XG4gICAgaWYgKG5hbWUuZW5kc1dpdGgoc3VmZml4KSkge1xuICAgICAgcmV0dXJuIHJldC5zdWJzdHIoMCwgcmV0Lmxlbmd0aCAtIHN1ZmZpeC5sZW5ndGgpICsgc3VmZml4ZXNbc3VmZml4XTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gcmV0O1xufVxuXG5mdW5jdGlvbiBzcGVjUHJpbWl0aXZlVG9Db2RlUHJpbWl0aXZlKHR5cGU6IHNjaGVtYS5QcmltaXRpdmVUeXBlKTogQ29kZU5hbWUge1xuICBzd2l0Y2ggKHR5cGUpIHtcbiAgICBjYXNlICdCb29sZWFuJzogcmV0dXJuIENvZGVOYW1lLmZvclByaW1pdGl2ZSgnYm9vbGVhbicpO1xuICAgIGNhc2UgJ0RvdWJsZSc6IHJldHVybiBDb2RlTmFtZS5mb3JQcmltaXRpdmUoJ251bWJlcicpO1xuICAgIGNhc2UgJ0ludGVnZXInOiByZXR1cm4gQ29kZU5hbWUuZm9yUHJpbWl0aXZlKCdudW1iZXInKTtcbiAgICBjYXNlICdKc29uJzogcmV0dXJuIENvZGVOYW1lLmZvclByaW1pdGl2ZSgnYW55Jyk7XG4gICAgY2FzZSAnTG9uZyc6IHJldHVybiBDb2RlTmFtZS5mb3JQcmltaXRpdmUoJ251bWJlcicpO1xuICAgIGNhc2UgJ1N0cmluZyc6IHJldHVybiBDb2RlTmFtZS5mb3JQcmltaXRpdmUoJ3N0cmluZycpO1xuICAgIGNhc2UgJ1RpbWVzdGFtcCc6IHJldHVybiBDb2RlTmFtZS5mb3JQcmltaXRpdmUoJ0RhdGUnKTtcbiAgICBkZWZhdWx0OiB0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgcHJpbWl0aXZlIHR5cGU6ICR7dHlwZX1gKTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNQcmltaXRpdmUodHlwZTogQ29kZU5hbWUpOiBib29sZWFuIHtcbiAgcmV0dXJuIHR5cGUuY2xhc3NOYW1lID09PSAnYm9vbGVhbidcbiAgICB8fCB0eXBlLmNsYXNzTmFtZSA9PT0gJ251bWJlcidcbiAgICB8fCB0eXBlLmNsYXNzTmFtZSA9PT0gJ2FueSdcbiAgICB8fCB0eXBlLmNsYXNzTmFtZSA9PT0gJ3N0cmluZydcbiAgICB8fCB0eXBlLmNsYXNzTmFtZSA9PT0gJ0RhdGUnO1xufVxuXG5mdW5jdGlvbiBzcGVjVHlwZVRvQ29kZVR5cGUocmVzb3VyY2VDb250ZXh0OiBDb2RlTmFtZSwgdHlwZTogc3RyaW5nKTogQ29kZU5hbWUge1xuICBpZiAodHlwZS5lbmRzV2l0aCgnW10nKSkge1xuICAgIGNvbnN0IGl0ZW1UeXBlID0gc3BlY1R5cGVUb0NvZGVUeXBlKHJlc291cmNlQ29udGV4dCwgdHlwZS5zdWJzdHIoMCwgdHlwZS5sZW5ndGggLSAyKSk7XG4gICAgcmV0dXJuIENvZGVOYW1lLmZvclByaW1pdGl2ZShgJHtpdGVtVHlwZS5jbGFzc05hbWV9W11gKTtcbiAgfVxuICBpZiAoc2NoZW1hLmlzUHJpbWl0aXZlVHlwZSh0eXBlKSkge1xuICAgIHJldHVybiBzcGVjUHJpbWl0aXZlVG9Db2RlUHJpbWl0aXZlKHR5cGUpO1xuICB9IGVsc2UgaWYgKHR5cGUgPT09ICdUYWcnKSB7XG4gICAgLy8gVGFncyBhcmUgbm90IGNvbnNpZGVyZWQgcHJpbWl0aXZlIGJ5IHRoZSBDbG91ZEZvcm1hdGlvbiBzcGVjIChldmVuIHRob3VnaCB0aGV5IGFyZSBpbnRyaW5zaWMpXG4gICAgLy8gc28gd2Ugd29uJ3QgY29uc2lkZXIgdGhlbSBwcmltaXRpdmUgZWl0aGVyLlxuICAgIHJldHVybiBUQUdfTkFNRTtcbiAgfVxuXG4gIGNvbnN0IHR5cGVOYW1lID0gcmVzb3VyY2VDb250ZXh0LnNwZWNOYW1lIS5yZWxhdGl2ZU5hbWUodHlwZSk7XG4gIHJldHVybiBDb2RlTmFtZS5mb3JQcm9wZXJ0eVR5cGUodHlwZU5hbWUsIHJlc291cmNlQ29udGV4dCk7XG59XG5cbi8qKlxuICogVHJhbnNsYXRlIGEgbGlzdCBvZiB0eXBlIHJlZmVyZW5jZXMgaW4gYSByZXNvdXJjZSBjb250ZXh0IHRvIGEgbGlzdCBvZiBjb2RlIG5hbWVzXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzcGVjVHlwZXNUb0NvZGVUeXBlcyhyZXNvdXJjZUNvbnRleHQ6IENvZGVOYW1lLCB0eXBlczogc3RyaW5nW10pOiBDb2RlTmFtZVtdIHtcbiAgcmV0dXJuIHR5cGVzLm1hcCh0eXBlID0+IHNwZWNUeXBlVG9Db2RlVHlwZShyZXNvdXJjZUNvbnRleHQsIHR5cGUpKTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBQcm9wZXJ0eVZpc2l0b3I8VD4ge1xuXG4gIC8qKlxuICAgKiBBIHNpbmdsZSB0eXBlIChlaXRoZXIgYnVpbHQtaW4gb3IgY29tcGxleClcbiAgICovXG4gIHZpc2l0QXRvbSh0eXBlOiBDb2RlTmFtZSk6IFQ7XG5cbiAgLyoqXG4gICAqIEEgdW5pb24gb2YgYXRvbWljIHR5cGVzXG4gICAqL1xuICB2aXNpdEF0b21Vbmlvbih0eXBlczogQ29kZU5hbWVbXSk6IFQ7XG5cbiAgLyoqXG4gICAqIEEgbGlzdCBvZiBhdG9tc1xuICAgKi9cbiAgdmlzaXRMaXN0KGl0ZW1UeXBlOiBDb2RlTmFtZSk6IFQ7XG5cbiAgLyoqXG4gICAqIExpc3Qgb2YgdW5pb25zXG4gICAqL1xuICB2aXNpdFVuaW9uTGlzdChpdGVtVHlwZXM6IENvZGVOYW1lW10pOiBUO1xuXG4gIC8qKlxuICAgKiBNYXAgb2YgYXRvbXNcbiAgICovXG4gIHZpc2l0TWFwKGl0ZW1UeXBlOiBDb2RlTmFtZSk6IFQ7XG5cbiAgLyoqXG4gICAqIE1hcCBvZiB1bmlvbnNcbiAgICovXG4gIHZpc2l0VW5pb25NYXAoaXRlbVR5cGVzOiBDb2RlTmFtZVtdKTogVDtcblxuICAvKipcbiAgICogTWFwIG9mIGxpc3RzXG4gICAqL1xuICB2aXNpdE1hcE9mTGlzdHMoaXRlbVR5cGU6IENvZGVOYW1lKTogVDtcblxuICAvKipcbiAgICogVW5pb24gb2YgbGlzdCB0eXBlIGFuZCBhdG9tIHR5cGVcbiAgICovXG4gIHZpc2l0TGlzdE9yQXRvbShzY2FsYXJUeXBlczogQ29kZU5hbWVbXSwgaXRlbVR5cGVzOiBDb2RlTmFtZVtdKTogYW55O1xufVxuXG4vKipcbiAqIEludm9rZSB0aGUgcmlnaHQgdmlzaXRvciBtZXRob2QgZm9yIHRoZSBnaXZlbiBwcm9wZXJ0eSwgZGVwZW5kaW5nIG9uIGl0cyB0eXBlXG4gKlxuICogV2UgdXNlIHRoZSB0ZXJtIFwiYXRvbVwiIGluIHRoaXMgY29udGV4dCB0byBtZWFuIGEgdHlwZSB0aGF0IGNhbiBvbmx5IGFjY2VwdCBhIHNpbmdsZVxuICogdmFsdWUgb2YgYSBnaXZlbiB0eXBlLiBUaGlzIGlzIHRvIGNvbnRyYXN0IGl0IHdpdGggY29sbGVjdGlvbnMgYW5kIHVuaW9ucy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHR5cGVEaXNwYXRjaDxUPihyZXNvdXJjZUNvbnRleHQ6IENvZGVOYW1lLCBzcGVjOiBzY2hlbWEuUHJvcGVydHksIHZpc2l0b3I6IFByb3BlcnR5VmlzaXRvcjxUPik6IFQge1xuICBjb25zdCBzY2FsYXJUeXBlcyA9IHNwZWNUeXBlc1RvQ29kZVR5cGVzKHJlc291cmNlQ29udGV4dCwgc2NhbGFyVHlwZU5hbWVzKHNwZWMpKTtcbiAgY29uc3QgaXRlbVR5cGVzID0gc3BlY1R5cGVzVG9Db2RlVHlwZXMocmVzb3VyY2VDb250ZXh0LCBpdGVtVHlwZU5hbWVzKHNwZWMpKTtcblxuICBpZiAoc2NhbGFyVHlwZXMubGVuZ3RoICYmIGl0ZW1UeXBlcy5sZW5ndGgpIHtcbiAgICAvLyBDYW4gYWNjZXB0IGJvdGggYSBjb2xsZWN0aW9uIGEvbmQgYSBzY2FsYXJcbiAgICByZXR1cm4gdmlzaXRvci52aXNpdExpc3RPckF0b20oc2NhbGFyVHlwZXMsIGl0ZW1UeXBlcyk7XG4gIH1cblxuICBpZiAoc2NoZW1hLmlzQ29sbGVjdGlvblByb3BlcnR5KHNwZWMpKSB7XG4gICAgLy8gTGlzdCBvciBtYXAsIG9mIGVpdGhlciBhdG9tcyBvciB1bmlvbnNcbiAgICBpZiAoc2NoZW1hLmlzTWFwUHJvcGVydHkoc3BlYykpIHtcbiAgICAgIGlmIChzY2hlbWEuaXNNYXBPZkxpc3RzT2ZQcmltaXRpdmVzUHJvcGVydHkoc3BlYykpIHtcbiAgICAgICAgLy8gcmVtb3ZlIHRoZSAnW10nIGZyb20gdGhlIHR5cGVcbiAgICAgICAgY29uc3QgYmFzZVR5cGUgPSBpdGVtVHlwZXNbMF0uY2xhc3NOYW1lO1xuICAgICAgICBjb25zdCBpdGVtVHlwZSA9IENvZGVOYW1lLmZvclByaW1pdGl2ZShiYXNlVHlwZS5zdWJzdHIoMCwgYmFzZVR5cGUubGVuZ3RoIC0gMikpO1xuICAgICAgICByZXR1cm4gdmlzaXRvci52aXNpdE1hcE9mTGlzdHMoaXRlbVR5cGUpO1xuICAgICAgfVxuICAgICAgaWYgKGl0ZW1UeXBlcy5sZW5ndGggPiAxKSB7XG4gICAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0VW5pb25NYXAoaXRlbVR5cGVzKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0TWFwKGl0ZW1UeXBlc1swXSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChpdGVtVHlwZXMubGVuZ3RoID4gMSkge1xuICAgICAgICByZXR1cm4gdmlzaXRvci52aXNpdFVuaW9uTGlzdChpdGVtVHlwZXMpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRMaXN0KGl0ZW1UeXBlc1swXSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy8gQXRvbSBvciB1bmlvbiBvZiBhdG9tc1xuICBpZiAoc2NhbGFyVHlwZXMubGVuZ3RoID4gMSkge1xuICAgIHJldHVybiB2aXNpdG9yLnZpc2l0QXRvbVVuaW9uKHNjYWxhclR5cGVzKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gdmlzaXRvci52aXNpdEF0b20oc2NhbGFyVHlwZXNbMF0pO1xuICB9XG5cbn1cbiJdfQ==