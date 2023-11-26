"use strict";
// Classes and definitions that have to do with modeling and decisions around code generation
//
// Does not include the actual code generation itself.
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeDispatch = exports.specTypesToCodeTypes = exports.isPrimitive = exports.cloudFormationToScriptName = exports.attributeDefinition = exports.validatorName = exports.fromCfnFactoryName = exports.cfnMapperName = exports.packageName = exports.Attribute = exports.TOKEN_NAME = exports.TAG_NAME = exports.CodeName = exports.CFN_PARSE_NAMESPACE = exports.CORE_NAMESPACE = exports.CONSTRUCTS_NAMESPACE = void 0;
const cfnspec_1 = require("@aws-cdk/cfnspec");
const codemaker = require("codemaker");
const spec_utils_1 = require("./spec-utils");
const util = require("./util");
const RESOURCE_CLASS_PREFIX = 'Cfn';
exports.CONSTRUCTS_NAMESPACE = 'constructs';
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
    /* eslint-disable @typescript-eslint/no-shadow */
    constructor(packageName, namespace, className, specName, methodName) {
        this.packageName = packageName;
        this.namespace = namespace;
        this.className = className;
        this.specName = specName;
        this.methodName = methodName;
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
    let typeHint = 'STRING';
    if (attrType === 'number') {
        typeHint = 'NUMBER';
    }
    else if (attrType === 'string[]') {
        typeHint = 'STRING_LIST';
    }
    const constructorArguments = `this.getAtt('${attributeName}', cdk.ResolutionTypeHint.${typeHint})`;
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
    // Lightsail contains a property called "GetObject", which isn't a jsii-compliant name
    // as it conflicts with generated getters in other languages (e.g., Java, C#).
    // For now, hard-coding a replacement property name to something that's frankly better anyway.
    if (name === 'GetObject') {
        name = 'objectAccess';
    }
    // GuardDuty contains a property named "Equals", which isn't a jsii-compliant name as it
    // conflicts with standard Java/C# object methods.
    if (name === 'Equals') {
        name = 'equalTo';
    }
    const ret = codemaker.toCamelCase(name);
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const suffixes = { ARNs: 'Arns', MBs: 'MBs', AZs: 'AZs' };
    for (const suffix of Object.keys(suffixes)) {
        if (name.endsWith(suffix)) {
            return ret.slice(0, -suffix.length) + suffixes[suffix];
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
/**
 * @param resourceContext
 * @param type the name of the type
 * @param complexType whether the type is a complexType (true) or primitive type (false)
 */
function specTypeToCodeType(resourceContext, type, complexType) {
    if (type.endsWith('[]')) {
        const itemType = specTypeToCodeType(resourceContext, type.slice(0, -2), complexType);
        return CodeName.forPrimitive(`${itemType.className}[]`);
    }
    if (!complexType) {
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
 *
 * @param resourceContext
 * @param types name and whether the type is a complex type (true) or primitive type (false)
 */
function specTypesToCodeTypes(resourceContext, types) {
    return Object.entries(types).map(([name, complexType]) => specTypeToCodeType(resourceContext, name, complexType));
}
exports.specTypesToCodeTypes = specTypesToCodeTypes;
/**
 * Invoke the right visitor method for the given property, depending on its type
 *
 * We use the term "atom" in this context to mean a type that can only accept a single
 * value of a given type. This is to contrast it with collections and unions.
 */
function typeDispatch(resourceContext, spec, visitor) {
    const scalarTypes = specTypesToCodeTypes(resourceContext, (0, spec_utils_1.scalarTypeNames)(spec));
    const itemTypes = specTypesToCodeTypes(resourceContext, (0, spec_utils_1.itemTypeNames)(spec));
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
                const itemType = CodeName.forPrimitive(baseType.slice(0, -2));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2Vuc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImdlbnNwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLDZGQUE2RjtBQUM3RixFQUFFO0FBQ0Ysc0RBQXNEOzs7QUFFdEQsOENBQTBDO0FBQzFDLHVDQUF1QztBQUN2Qyw2Q0FBK0Y7QUFDL0YsK0JBQStCO0FBRS9CLE1BQU0scUJBQXFCLEdBQUcsS0FBSyxDQUFDO0FBRXZCLFFBQUEsb0JBQW9CLEdBQUcsWUFBWSxDQUFDO0FBQ3BDLFFBQUEsY0FBYyxHQUFHLEtBQUssQ0FBQztBQUN2QixRQUFBLG1CQUFtQixHQUFHLFdBQVcsQ0FBQztBQUUvQzs7Ozs7O0dBTUc7QUFDSCxNQUFhLFFBQVE7SUFDWixNQUFNLENBQUMsY0FBYyxDQUFDLFFBQWtCLEVBQUUsS0FBYTtRQUM1RCxNQUFNLFNBQVMsR0FBRyxxQkFBcUIsR0FBRyxRQUFRLENBQUMsWUFBWSxHQUFHLEtBQUssQ0FBQztRQUN4RSxPQUFPLElBQUksUUFBUSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsRUFBRSxFQUFFLEVBQUUsU0FBUyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQ3RFLENBQUM7SUFFTSxNQUFNLENBQUMscUJBQXFCLENBQUMsWUFBc0I7UUFDeEQsT0FBTyxJQUFJLFFBQVEsQ0FBQyxZQUFZLENBQUMsV0FBVyxFQUFFLFlBQVksQ0FBQyxTQUFTLEVBQUUsR0FBRyxZQUFZLENBQUMsU0FBUyxPQUFPLEVBQUUsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ2pJLENBQUM7SUFFTSxNQUFNLENBQUMsZUFBZSxDQUFDLFFBQStCLEVBQUUsYUFBdUI7UUFDcEYsa0NBQWtDO1FBQ2xDLElBQUksUUFBUSxDQUFDLFlBQVksS0FBSyxLQUFLLElBQUksUUFBUSxDQUFDLFlBQVksS0FBSyxFQUFFLEVBQUU7WUFDbkUsT0FBTyxnQkFBUSxDQUFDO1NBQ2pCO1FBRUQsb0RBQW9EO1FBQ3BELE9BQU8sSUFBSSxRQUFR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LHlCQUF5QjtJQUN6QixJQUFJLFdBQVcsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO1FBQzFCLE9BQU8sT0FBTyxDQUFDLGNBQWMsQ0FBQyxXQUFXLENBQUMsQ0FBQztLQUM1QztTQUFNO1FBQ0wsT0FBTyxPQUFPLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQzFDO0FBRUgsQ0FBQztBQXZDRCxvQ0F1Q0MiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDbGFzc2VzIGFuZCBkZWZpbml0aW9ucyB0aGF0IGhhdmUgdG8gZG8gd2l0aCBtb2RlbGluZyBhbmQgZGVjaXNpb25zIGFyb3VuZCBjb2RlIGdlbmVyYXRpb25cbi8vXG4vLyBEb2VzIG5vdCBpbmNsdWRlIHRoZSBhY3R1YWwgY29kZSBnZW5lcmF0aW9uIGl0c2VsZi5cblxuaW1wb3J0IHsgc2NoZW1hIH0gZnJvbSAnQGF3cy1jZGsvY2Zuc3BlYyc7XG5pbXBvcnQgKiBhcyBjb2RlbWFrZXIgZnJvbSAnY29kZW1ha2VyJztcbmltcG9ydCB7IGl0ZW1UeXBlTmFtZXMsIFByb3BlcnR5QXR0cmlidXRlTmFtZSwgc2NhbGFyVHlwZU5hbWVzLCBTcGVjTmFtZSB9IGZyb20gJy4vc3BlYy11dGlscyc7XG5pbXBvcnQgKiBhcyB1dGlsIGZyb20gJy4vdXRpbCc7XG5cbmNvbnN0IFJFU09VUkNFX0NMQVNTX1BSRUZJWCA9ICdDZm4nO1xuXG5leHBvcnQgY29uc3QgQ09OU1RSVUNUU19OQU1FU1BBQ0UgPSAnY29uc3RydWN0cyc7XG5leHBvcnQgY29uc3QgQ09SRV9OQU1FU1BBQ0UgPSAnY2RrJztcbmV4cG9ydCBjb25zdCBDRk5fUEFSU0VfTkFNRVNQQUNFID0gJ2Nmbl9wYXJzZSc7XG5cbi8qKlxuICogVGhlIG5hbWUgb2YgYSBjbGFzcyBvciBtZXRob2QgaW4gdGhlIGdlbmVyYXRlZCBjb2RlLlxuICpcbiAqIEhhcyBjb25zdHJ1Y3RvciBmdW5jdGlvbnMgdG8gZ2VuZXJhdGUgdGhlbSBmcm9tIHRoZSBDbG91ZEZvcm1hdGlvbiBzcGVjaWZpY2F0aW9uLlxuICpcbiAqIFRoaXMgcmVmZXJzIHRvIFR5cGVTY3JpcHQgY29uc3RydWN0cyAodHlwaWNhbGx5IGEgY2xhc3MpXG4gKi9cbmV4cG9ydCBjbGFzcyBDb2RlTmFtZSB7XG4gIHB1YmxpYyBzdGF0aWMgZm9yQ2ZuUmVzb3VyY2Uoc3BlY05hbWU6IFNwZWNOYW1lLCBhZmZpeDogc3RyaW5nKTogQ29kZU5hbWUge1xuICAgIGNvbnN0IGNsYXNzTmFtZSA9IFJFU09VUkNFX0NMQVNTX1BSRUZJWCArIHNwZWNOYW1lLnJlc291cmNlTmFtZSArIGFmZml4O1xuICAgIHJldHVybiBuZXcgQ29kZU5hbWUocGFja2FnZU5hbWUoc3BlY05hbWUpLCAnJywgY2xhc3NOYW1lLCBzcGVjTmFtZSk7XG4gIH1cblxuICBwdWJsaWMgc3RhdGljIGZvclJlc291cmNlUHJvcGVydGllcyhyZXNvdXJjZU5hbWU6IENvZGVOYW1lKTogQ29kZU5hbWUge1xuICAgIHJldHVybiBuZXcgQ29kZU5hbWUocmVzb3VyY2VOYW1lLnBhY2thZ2VOYW1lLCByZXNvdXJjZU5hbWUubmFtZXNwYWNlLCBgJHtyZXNvdXJjZU5hbWUuY2xhc3NOYW1lfVByb3BzYCwgcmVzb3VyY2VOYW1lLnNwZWNOYW1lKTtcbiAgfVxuXG4gIHB1YmxpYyBzdGF0aWMgZm9yUHJvcGVydHlUeXBlKHNwZWNOYW1lOiBQcm9wZXJ0eUF0dHJpYnV0ZU5hbWUsIHJlc291cmNlQ2xhc3M6IENvZGVOYW1lKTogQ29kZU5hbWUge1xuICAgIC8vIEV4Y2VwdGlvbiBmb3IgYW4gaW50cmluc2ljIHR5cGVcbiAgICBpZiAoc3BlY05hbWUucHJvcEF0dHJOYW1lID09PSAnVGFnJyAmJiBzcGVjTmFtZS5yZXNvdXJjZU5hbWUgPT09ICcnKSB7XG4gICAgICByZXR1cm4gVEFHX05BTUU7XG4gICAgfVxuXG4gICAgLy8gVGhlc2UgYXJlIGluIGEgbmFtZXNwYWNlIG5hbWVkIGFmdGVyIHRoZSByZXNvdXJjZVxuICAgIHJldHVybiBuZXcgQ29kZU5hbWUocGFja2FnZU5hbWUoc3BlY05hbWUpLCByZXNvdXJjZUNsYXNzLmNsYXNzTmFtZSwgYCR7c3BlY05hbWUucHJvcEF0dHJOYW1lfVByb3BlcnR5YCwgc3BlY05hbWUpO1xuICB9XG5cbiAgcHVibGljIHN0YXRpYyBmb3JQcmltaXRpdmUocHJpbWl0aXZlTmFtZTogc3RyaW5nKTogQ29kZU5hbWUge1xuICAgIHJldHVybiBuZXcgQ29kZU5hbWUoJycsICcnLCBwcmltaXRpdmVOYW1lKTtcbiAgfVxuXG4gIC8qIGVzbGludC1kaXNhYmxlIEB0eXBlc2NyaXB0LWVzbGludC9uby1zaGFkb3cgKi9cbiAgY29uc3RydWN0b3IoXG4gICAgcmVhZG9ubHkgcGFja2FnZU5hbWU6IHN0cmluZyxcbiAgICByZWFkb25seSBuYW1lc3BhY2U6IHN0cmluZyxcbiAgICByZWFkb25seSBjbGFzc05hbWU6IHN0cmluZyxcbiAgICByZWFkb25seSBzcGVjTmFtZT86IFNwZWNOYW1lLFxuICAgIHJlYWRvbmx5IG1ldGhvZE5hbWU/OiBzdHJpbmcpIHtcbiAgfVxuICAvKiBlc2xpbnQtZW5hYmxlIEB0eXBlc2NyaXB0LWVzbGludC9uby1zaGFkb3cgKi9cblxuICAvKipcbiAgICogQWxpYXMgZm9yIGNsYXNzTmFtZVxuICAgKlxuICAgKiBTaW1wbHkgcmV0dXJucyB0aGUgdG9wLWxldmVsIGRlY2xhcmF0aW9uIG5hbWUsICBidXQgcmVhZHMgYmV0dGVyIGF0IHRoZSBjYWxsIHNpdGUgaWZcbiAgICogd2UncmUgZ2VuZXJhdGluZyBhIGZ1bmN0aW9uIGluc3RlYWQgb2YgYSBjbGFzcy5cbiAgICovXG4gIHB1YmxpYyBnZXQgZnVuY3Rpb25OYW1lKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuY2xhc3NOYW1lO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybiB0aGUgZnVsbHkgcXVhbGlmaWVkIG5hbWUgb2YgdGhlIFR5cGVTY3JpcHQgb2JqZWN0XG4gICAqXG4gICAqIChXaGVuIHJlZmVycmVkIHRvIGl0IGZyb20gdGhlIHNhbWUgcGFja2FnZSlcbiAgICovXG4gIHB1YmxpYyBnZXQgZnFuKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHV0aWwuam9pbklmKHRoaXMubmFtZXNwYWNlLCAnLicsIHV0aWwuam9pbklmKHRoaXMuY2xhc3NOYW1lLCAnLicsIHRoaXMubWV0aG9kTmFtZSkpO1xuICB9XG5cbiAgcHVibGljIHJlZmVyVG9NZXRob2QobWV0aG9kTmFtZTogc3RyaW5nKTogQ29kZU5hbWUge1xuICAgIHJldHVybiBuZXcgQ29kZU5hbWUodGhpcy5wYWNrYWdlTmFtZSwgdGhpcy5uYW1lc3BhY2UsIHRoaXMuY2xhc3NOYW1lLCB0aGlzLnNwZWNOYW1lLCBtZXRob2ROYW1lKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm4gYSByZWxhdGl2ZSBuYW1lIGZyb20gYSBnaXZlbiBuYW1lIHRvIHRoaXMgbmFtZS5cbiAgICpcbiAgICogU3RyaXBzIG9mZiB0aGUgbmFtZXNwYWNlIGlmIHRoZXkncmUgdGhlIHNhbWUsIG90aGVyd2lzZSBsZWF2ZXMgdGhlIG5hbWVzcGFjZSBvbi5cbiAgICovXG4gIHB1YmxpYyByZWxhdGl2ZVRvKGZyb21OYW1lOiBDb2RlTmFtZSk6IENvZGVOYW1lIHtcbiAgICBpZiAodGhpcy5uYW1lc3BhY2UgPT09IGZyb21OYW1lLm5hbWVzcGFjZSkge1xuICAgICAgcmV0dXJuIG5ldyBDb2RlTmFtZSh0aGlzLnBhY2thZ2VOYW1lLCAnJywgdGhpcy5jbGFzc05hbWUsIHRoaXMuc3BlY05hbWUsIHRoaXMubWV0aG9kTmFtZSk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9XG59XG5cbmV4cG9ydCBjb25zdCBUQUdfTkFNRSA9IG5ldyBDb2RlTmFtZSgnJywgQ09SRV9OQU1FU1BBQ0UsICdDZm5UYWcnKTtcbmV4cG9ydCBjb25zdCBUT0tFTl9OQU1FID0gbmV3IENvZGVOYW1lKCcnLCBDT1JFX05BTUVTUEFDRSwgJ0lSZXNvbHZhYmxlJyk7XG5cbi8qKlxuICogUmVzb3VyY2UgYXR0cmlidXRlXG4gKi9cbmV4cG9ydCBjbGFzcyBBdHRyaWJ1dGUge1xuICBjb25zdHJ1Y3RvcihcbiAgICByZWFkb25seSBwcm9wZXJ0eU5hbWU6IHN0cmluZyxcbiAgICByZWFkb25seSBhdHRyaWJ1dGVUeXBlOiBzdHJpbmcsXG4gICAgcmVhZG9ubHkgY29uc3RydWN0b3JBcmd1bWVudHM6IHN0cmluZykge1xuICB9XG59XG5cbi8qKlxuICogUmV0dXJuIHRoZSBwYWNrYWdlIGluIHdoaWNoIHRoaXMgQ2ZuTmFtZSBzaG91bGQgYmUgc3RvcmVkXG4gKlxuICogVGhlIFwiYXdzLWNkay1cIiBwYXJ0IGlzIGltcGxpY2l0LlxuICpcbiAqIEV4YW1wbGU6IEFXUzo6RUMyIC0+IGVjMlxuICovXG5leHBvcnQgZnVuY3Rpb24gcGFja2FnZU5hbWUobW9kdWxlOiBTcGVjTmFtZSB8IHN0cmluZyk6IHN0cmluZyB7XG4gIGlmIChtb2R1bGUgaW5zdGFuY2VvZiBTcGVjTmFtZSkge1xuICAgIG1vZHVsZSA9IG1vZHVsZS5tb2R1bGU7XG4gIH1cblxuICBjb25zdCBwYXJ0cyA9IG1vZHVsZS5zcGxpdCgnOjonKTtcblxuICBpZiAoWydBV1MnLCAnQWxleGEnXS5pbmRleE9mKHBhcnRzWzBdKSA9PT0gLTEgfHwgcGFydHMubGVuZ3RoICE9PSAyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBNb2R1bGUgY29tcG9uZW50IG5hbWUgbXVzdCBiZSBcIkFXUzo6WHh4XCIgb3IgXCJBbGV4YTo6WHh4XCIgKG1vZHVsZTogJHttb2R1bGV9KWApO1xuICB9XG5cbiAgcmV0dXJuIG92ZXJyaWRlUGFja2FnZU5hbWUocGFydHNbcGFydHMubGVuZ3RoIC0gMV0udG9Mb3dlckNhc2UoKSk7XG59XG5cbi8qKlxuICogT3ZlcnJpZGVzIHNwZWNpYWwtY2FzZSBuYW1lc3BhY2VzIGxpa2Ugc2VydmVybGVzcz0+c2FtXG4gKi9cbmZ1bmN0aW9uIG92ZXJyaWRlUGFja2FnZU5hbWUobmFtZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgaWYgKG5hbWUgPT09ICdzZXJ2ZXJsZXNzJykge1xuICAgIHJldHVybiAnc2FtJztcbiAgfVxuICByZXR1cm4gbmFtZTtcbn1cblxuLyoqXG4gKiBSZXR1cm4gdGhlIG5hbWUgYnkgd2hpY2ggdGhlIGNsb3VkZm9ybWF0aW9uLXByb3BlcnR5IG1hcHBpbmcgZnVuY3Rpb24gd2lsbCBiZSBkZWZpbmVkXG4gKlxuICogSXQgd2lsbCBub3QgYmUgZGVmaW5lZCBpbiBhIG5hbWVzcGFjZSwgYmVjYXVzZSBvdGhlcndpc2Ugd2Ugd291bGQgaGF2ZSB0byBleHBvcnQgaXQgYW5kXG4gKiB3ZSBkb24ndCB3YW50IHRvIGV4cG9zZSBpdCB0byBjbGllbnRzLlxuICovXG5leHBvcnQgZnVuY3Rpb24gY2ZuTWFwcGVyTmFtZSh0eXBlTmFtZTogQ29kZU5hbWUpOiBDb2RlTmFtZSB7XG4gIGlmICghdHlwZU5hbWUucGFja2FnZU5hbWUpIHtcbiAgICAvLyBCdWlsdC1pbiBvciBpbnRyaW5zaWMgdHlwZSwgYnVpbHQtaW4gbWFwcGVyc1xuICAgIGNvbnN0IG1hcHBlZFR5cGUgPSB0eXBlTmFtZS5jbGFzc05hbWUgPT09ICdhbnknID8gJ29iamVjdCcgOiB0eXBlTmFtZS5jbGFzc05hbWU7XG4gICAgcmV0dXJuIG5ldyBDb2RlTmFtZSgnJywgQ09SRV9OQU1FU1BBQ0UsICcnLCB1bmRlZmluZWQsIHV0aWwuZG93bmNhc2VGaXJzdChgJHttYXBwZWRUeXBlfVRvQ2xvdWRGb3JtYXRpb25gKSk7XG4gIH1cblxuICByZXR1cm4gbmV3IENvZGVOYW1lKHR5cGVOYW1lLnBhY2thZ2VOYW1lLCAnJywgdXRpbC5kb3duY2FzZUZpcnN0KGAke3R5cGVOYW1lLm5hbWVzcGFjZX0ke3R5cGVOYW1lLmNsYXNzTmFtZX1Ub0Nsb3VkRm9ybWF0aW9uYCkpO1xufVxuXG4vKipcbiAqIFJldHVybiB0aGUgbmFtZSBvZiB0aGUgZnVuY3Rpb24gdGhhdCBjb252ZXJ0cyBhIHB1cmUgQ2xvdWRGb3JtYXRpb24gdmFsdWVcbiAqIHRvIHRoZSBhcHByb3ByaWF0ZSBDREsgc3RydWN0IGluc3RhbmNlLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZnJvbUNmbkZhY3RvcnlOYW1lKHR5cGVOYW1lOiBDb2RlTmFtZSk6IENvZGVOYW1lIHtcbiAgaWYgKGlzUHJpbWl0aXZlKHR5cGVOYW1lKSkge1xuICAgIC8vIHByaW1pdGl2ZSB0eXBlcyBhcmUgaGFuZGxlZCBieSBzcGVjaWFsaXplZCBmdW5jdGlvbnMgZnJvbSBAYXdzLWNkay9jb3JlXG4gICAgcmV0dXJuIG5ldyBDb2RlTmFtZSgnJywgQ0ZOX1BBUlNFX05BTUVTUEFDRSwgJ0Zyb21DbG91ZEZvcm1hdGlvbicsIHVuZGVmaW5lZCwgYGdldCR7dXRpbC51cGNhc2VGaXJzdCh0eXBlTmFtZS5jbGFzc05hbWUpfWApO1xuICB9IGVsc2UgaWYgKGlzQ2xvdWRGb3JtYXRpb25UYWdDb2RlTmFtZSh0eXBlTmFtZSkpIHtcbiAgICAvLyB0YWdzLCBzaW5jZSB0aGV5IGFyZSBzaGFyZWQsIGhhdmUgdGhlaXIgb3duIGZ1bmN0aW9uIGluIEBhd3MtY2RrL2NvcmVcbiAgICByZXR1cm4gbmV3IENvZGVOYW1lKCcnLCBDRk5fUEFSU0VfTkFNRVNQQUNFLCAnRnJvbUNsb3VkRm9ybWF0aW9uJywgdW5kZWZpbmVkLCAnZ2V0Q2ZuVGFnJyk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIG5ldyBDb2RlTmFtZSh0eXBlTmFtZS5wYWNrYWdlTmFtZSwgJycsIGAke3R5cGVOYW1lLm5hbWVzcGFjZX0ke3R5cGVOYW1lLmNsYXNzTmFtZX1Gcm9tQ2xvdWRGb3JtYXRpb25gKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBpc0Nsb3VkRm9ybWF0aW9uVGFnQ29kZU5hbWUoY29kZU5hbWU6IENvZGVOYW1lKTogYm9vbGVhbiB7XG4gIHJldHVybiBjb2RlTmFtZS5jbGFzc05hbWUgPT09IFRBR19OQU1FLmNsYXNzTmFtZSAmJlxuICAgIGNvZGVOYW1lLnBhY2thZ2VOYW1lID09PSBUQUdfTkFNRS5wYWNrYWdlTmFtZSAmJlxuICAgIGNvZGVOYW1lLm5hbWVzcGFjZSA9PT0gVEFHX05BTUUubmFtZXNwYWNlO1xufVxuXG4vKipcbiAqIFJldHVybiB0aGUgbmFtZSBmb3IgdGhlIHR5cGUtY2hlY2tpbmcgbWV0aG9kXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB2YWxpZGF0b3JOYW1lKHR5cGVOYW1lOiBDb2RlTmFtZSk6IENvZGVOYW1lIHtcbiAgaWYgKHR5cGVOYW1lLnBhY2thZ2VOYW1lID09PSAnJykge1xuICAgIC8vIEJ1aWx0LWluIG9yIGludHJpbnNpYyB0eXBlLCBidWlsdC1pbiB2YWxpZGF0b3JzXG4gICAgY29uc3QgdmFsaWRhdGVkVHlwZSA9IHR5cGVOYW1lLmNsYXNzTmFtZSA9PT0gJ2FueScgPyAnT2JqZWN0JyA6IGNvZGVtYWtlci50b1Bhc2NhbENhc2UodHlwZU5hbWUuY2xhc3NOYW1lKTtcbiAgICByZXR1cm4gbmV3IENvZGVOYW1lKCcnLCBDT1JFX05BTUVTUEFDRSwgJycsIHVuZGVmaW5lZCwgYHZhbGlkYXRlJHt2YWxpZGF0ZWRUeXBlfWApO1xuICB9XG5cbiAgcmV0dXJuIG5ldyBDb2RlTmFtZSh0eXBlTmFtZS5wYWNrYWdlTmFtZSwgJycsIGAke3V0aWwuam9pbklmKHR5cGVOYW1lLm5hbWVzcGFjZSwgJ18nLCB0eXBlTmFtZS5jbGFzc05hbWUpfVZhbGlkYXRvcmApO1xufVxuXG4vKipcbiAqIERldGVybWluZSBob3cgd2Ugd2lsbCByZW5kZXIgYSBDbG91ZEZvcm1hdGlvbiBhdHRyaWJ1dGUgaW4gdGhlIGNvZGVcbiAqXG4gKiBUaGlzIGNvbnNpc3RzIG9mOlxuICpcbiAqIC0gVGhlIHR5cGUgd2Ugd2lsbCBnZW5lcmF0ZSBmb3IgdGhlIGF0dHJpYnV0ZSwgaW5jbHVkaW5nIGl0cyBiYXNlIGNsYXNzIGFuZCBkb2NzLlxuICogLSBUaGUgcHJvcGVydHkgbmFtZSB3ZSB3aWxsIHVzZSB0byByZWZlciB0byB0aGUgYXR0cmlidXRlLlxuICovXG5leHBvcnQgZnVuY3Rpb24gYXR0cmlidXRlRGVmaW5pdGlvbihhdHRyaWJ1dGVOYW1lOiBzdHJpbmcsIHNwZWM6IHNjaGVtYS5BdHRyaWJ1dGUpOiBBdHRyaWJ1dGUge1xuICBjb25zdCBkZXNjcmlwdGl2ZU5hbWUgPSBhdHRyaWJ1dGVOYW1lLnJlcGxhY2UoL1xcLi9nLCAnJyk7XG4gIGNvbnN0IHN1ZmZpeE5hbWUgPSBjb2RlbWFrZXIudG9QYXNjYWxDYXNlKGNsb3VkRm9ybWF0aW9uVG9TY3JpcHROYW1lKGRlc2NyaXB0aXZlTmFtZSkpO1xuICBjb25zdCBwcm9wZXJ0eU5hbWUgPSBgYXR0ciR7c3VmZml4TmFtZX1gOyAvLyBcImF0dHJBcm5cIlxuXG4gIGxldCBhdHRyVHlwZTogc3RyaW5nO1xuICBpZiAoJ1ByaW1pdGl2ZVR5cGUnIGluIHNwZWMgJiYgc3BlYy5QcmltaXRpdmVUeXBlID09PSAnU3RyaW5nJykge1xuICAgIGF0dHJUeXBlID0gJ3N0cmluZyc7XG4gIH0gZWxzZSBpZiAoJ1ByaW1pdGl2ZVR5cGUnIGluIHNwZWMgJiYgc3BlYy5QcmltaXRpdmVUeXBlID09PSAnSW50ZWdlcicpIHtcbiAgICBhdHRyVHlwZSA9ICdudW1iZXInO1xuICB9IGVsc2UgaWYgKCdUeXBlJyBpbiBzcGVjICYmICdQcmltaXRpdmVJdGVtVHlwZScgaW4gc3BlYyAmJiBzcGVjLlR5cGUgPT09ICdMaXN0JyAmJiBzcGVjLlByaW1pdGl2ZUl0ZW1UeXBlID09PSAnU3RyaW5nJykge1xuICAgIGF0dHJUeXBlID0gJ3N0cmluZ1tdJztcbiAgfSBlbHNlIHtcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc29sZVxuICAgIGNvbnNvbGUuZXJyb3IoYFdBUk5JTkc6IFVuYWJsZSB0byByZXByZXNlbnQgYXR0cmlidXRlIHR5cGUgJHtKU09OLnN0cmluZ2lmeShzcGVjKX0gYXMgYSBuYXRpdmUgdHlwZWApO1xuICAgIGF0dHJUeXBlID0gVE9LRU5fTkFNRS5mcW47XG4gIH1cblxuICBsZXQgdHlwZUhpbnQgPSAnU1RSSU5HJztcbiAgaWYgKGF0dHJUeXBlID09PSAnbnVtYmVyJykge1xuICAgIHR5cGVIaW50ID0gJ05VTUJFUic7XG4gIH0gZWxzZSBpZiAoYXR0clR5cGUgPT09ICdzdHJpbmdbXScpIHtcbiAgICB0eXBlSGludCA9ICdTVFJJTkdfTElTVCc7XG4gIH1cbiAgY29uc3QgY29uc3RydWN0b3JBcmd1bWVudHMgPSBgdGhpcy5nZXRBdHQoJyR7YXR0cmlidXRlTmFtZX0nLCBjZGsuUmVzb2x1dGlvblR5cGVIaW50LiR7dHlwZUhpbnR9KWA7XG4gIHJldHVybiBuZXcgQXR0cmlidXRlKHByb3BlcnR5TmFtZSwgYXR0clR5cGUsIGNvbnN0cnVjdG9yQXJndW1lbnRzKTtcbn1cblxuLyoqXG4gKiBDb252ZXJ0IGEgQ2xvdWRGb3JtYXRpb24gbmFtZSB0byBhIG5pY2UgVHlwZVNjcmlwdCBuYW1lXG4gKlxuICogV2UgdXNlIGEgbGlicmFyeSB0byBjYW1lbGNhc2UsIGFuZCBmaXggdXAgc29tZSB0aGluZ3MgdGhhdCB0cmFuc2xhdGUgaW5jb3JyZWN0bHkuXG4gKlxuICogRm9yIGV4YW1wbGUsIHRoZSBsaWJyYXJ5IGJyZWFrcyB3aGVuIHBsdXJhbGl6aW5nIGFuIGFiYnJldmlhdGlvbiwgc3VjaCBhcyBcIlByb3ZpZGVyQVJOc1wiIC0+IFwicHJvdmlkZXJBck5zXCIuXG4gKlxuICogV2UgY3VycmVudGx5IHJlY29nbml6ZSBcIkFSTnNcIiwgXCJNQnNcIiBhbmQgXCJBWnNcIi5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNsb3VkRm9ybWF0aW9uVG9TY3JpcHROYW1lKG5hbWU6IHN0cmluZyk6IHN0cmluZyB7XG4gIGlmIChuYW1lID09PSAnVlBDcycpIHsgcmV0dXJuICd2cGNzJzsgfVxuXG4gIC8vIExpZ2h0c2FpbCBjb250YWlucyBhIHByb3BlcnR5IGNhbGxlZCBcIkdldE9iamVjdFwiLCB3aGljaCBpc24ndCBhIGpzaWktY29tcGxpYW50IG5hbWVcbiAgLy8gYXMgaXQgY29uZmxpY3RzIHdpdGggZ2VuZXJhdGVkIGdldHRlcnMgaW4gb3RoZXIgbGFuZ3VhZ2VzIChlLmcuLCBKYXZhLCBDIykuXG4gIC8vIEZvciBub3csIGhhcmQtY29kaW5nIGEgcmVwbGFjZW1lbnQgcHJvcGVydHkgbmFtZSB0byBzb21ldGhpbmcgdGhhdCdzIGZyYW5rbHkgYmV0dGVyIGFueXdheS5cbiAgaWYgKG5hbWUgPT09ICdHZXRPYmplY3QnKSB7XG4gICAgbmFtZSA9ICdvYmplY3RBY2Nlc3MnO1xuICB9XG5cbiAgLy8gR3VhcmREdXR5IGNvbnRhaW5zIGEgcHJvcGVydHkgbmFtZWQgXCJFcXVhbHNcIiwgd2hpY2ggaXNuJ3QgYSBqc2lpLWNvbXBsaWFudCBuYW1lIGFzIGl0XG4gIC8vIGNvbmZsaWN0cyB3aXRoIHN0YW5kYXJkIEphdmEvQyMgb2JqZWN0IG1ldGhvZHMuXG4gIGlmIChuYW1lID09PSAnRXF1YWxzJykge1xuICAgIG5hbWUgPSAnZXF1YWxUbyc7XG4gIH1cblxuICBjb25zdCByZXQgPSBjb2RlbWFrZXIudG9DYW1lbENhc2UobmFtZSk7XG5cbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uYW1pbmctY29udmVudGlvblxuICBjb25zdCBzdWZmaXhlczogeyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfSA9IHsgQVJOczogJ0FybnMnLCBNQnM6ICdNQnMnLCBBWnM6ICdBWnMnIH07XG5cbiAgZm9yIChjb25zdCBzdWZmaXggb2YgT2JqZWN0LmtleXMoc3VmZml4ZXMpKSB7XG4gICAgaWYgKG5hbWUuZW5kc1dpdGgoc3VmZml4KSkge1xuICAgICAgcmV0dXJuIHJldC5zbGljZSgwLCAtc3VmZml4Lmxlbmd0aCkgKyBzdWZmaXhlc1tzdWZmaXhdO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiByZXQ7XG59XG5cbmZ1bmN0aW9uIHNwZWNQcmltaXRpdmVUb0NvZGVQcmltaXRpdmUodHlwZTogc2NoZW1hLlByaW1pdGl2ZVR5cGUpOiBDb2RlTmFtZSB7XG4gIHN3aXRjaCAodHlwZSkge1xuICAgIGNhc2UgJ0Jvb2xlYW4nOiByZXR1cm4gQ29kZU5hbWUuZm9yUHJpbWl0aXZlKCdib29sZWFuJyk7XG4gICAgY2FzZSAnRG91YmxlJzogcmV0dXJuIENvZGVOYW1lLmZvclByaW1pdGl2ZSgnbnVtYmVyJyk7XG4gICAgY2FzZSAnSW50ZWdlcic6IHJldHVybiBDb2RlTmFtZS5mb3JQcmltaXRpdmUoJ251bWJlcicpO1xuICAgIGNhc2UgJ0pzb24nOiByZXR1cm4gQ29kZU5hbWUuZm9yUHJpbWl0aXZlKCdhbnknKTtcbiAgICBjYXNlICdMb25nJzogcmV0dXJuIENvZGVOYW1lLmZvclByaW1pdGl2ZSgnbnVtYmVyJyk7XG4gICAgY2FzZSAnU3RyaW5nJzogcmV0dXJuIENvZGVOYW1lLmZvclByaW1pdGl2ZSgnc3RyaW5nJyk7XG4gICAgY2FzZSAnVGltZXN0YW1wJzogcmV0dXJuIENvZGVOYW1lLmZvclByaW1pdGl2ZSgnRGF0ZScpO1xuICAgIGRlZmF1bHQ6IHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBwcmltaXRpdmUgdHlwZTogJHt0eXBlfWApO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc1ByaW1pdGl2ZSh0eXBlOiBDb2RlTmFtZSk6IGJvb2xlYW4ge1xuICByZXR1cm4gdHlwZS5jbGFzc05hbWUgPT09ICdib29sZWFuJ1xuICAgIHx8IHR5cGUuY2xhc3NOYW1lID09PSAnbnVtYmVyJ1xuICAgIHx8IHR5cGUuY2xhc3NOYW1lID09PSAnYW55J1xuICAgIHx8IHR5cGUuY2xhc3NOYW1lID09PSAnc3RyaW5nJ1xuICAgIHx8IHR5cGUuY2xhc3NOYW1lID09PSAnRGF0ZSc7XG59XG5cbi8qKlxuICogQHBhcmFtIHJlc291cmNlQ29udGV4dFxuICogQHBhcmFtIHR5cGUgdGhlIG5hbWUgb2YgdGhlIHR5cGVcbiAqIEBwYXJhbSBjb21wbGV4VHlwZSB3aGV0aGVyIHRoZSB0eXBlIGlzIGEgY29tcGxleFR5cGUgKHRydWUpIG9yIHByaW1pdGl2ZSB0eXBlIChmYWxzZSlcbiAqL1xuZnVuY3Rpb24gc3BlY1R5cGVUb0NvZGVUeXBlKHJlc291cmNlQ29udGV4dDogQ29kZU5hbWUsIHR5cGU6IHN0cmluZywgY29tcGxleFR5cGU6IGJvb2xlYW4pOiBDb2RlTmFtZSB7XG4gIGlmICh0eXBlLmVuZHNXaXRoKCdbXScpKSB7XG4gICAgY29uc3QgaXRlbVR5cGUgPSBzcGVjVHlwZVRvQ29kZVR5cGUocmVzb3VyY2VDb250ZXh0LCB0eXBlLnNsaWNlKDAsIC0yKSwgY29tcGxleFR5cGUpO1xuICAgIHJldHVybiBDb2RlTmFtZS5mb3JQcmltaXRpdmUoYCR7aXRlbVR5cGUuY2xhc3NOYW1lfVtdYCk7XG4gIH1cbiAgaWYgKCFjb21wbGV4VHlwZSkge1xuICAgIHJldHVybiBzcGVjUHJpbWl0aXZlVG9Db2RlUHJpbWl0aXZlKHR5cGUgYXMgc2NoZW1hLlByaW1pdGl2ZVR5cGUpO1xuICB9IGVsc2UgaWYgKHR5cGUgPT09ICdUYWcnKSB7XG4gICAgLy8gVGFncyBhcmUgbm90IGNvbnNpZGVyZWQgcHJpbWl0aXZlIGJ5IHRoZSBDbG91ZEZvcm1hdGlvbiBzcGVjIChldmVuIHRob3VnaCB0aGV5IGFyZSBpbnRyaW5zaWMpXG4gICAgLy8gc28gd2Ugd29uJ3QgY29uc2lkZXIgdGhlbSBwcmltaXRpdmUgZWl0aGVyLlxuICAgIHJldHVybiBUQUdfTkFNRTtcbiAgfVxuXG4gIGNvbnN0IHR5cGVOYW1lID0gcmVzb3VyY2VDb250ZXh0LnNwZWNOYW1lIS5yZWxhdGl2ZU5hbWUodHlwZSk7XG4gIHJldHVybiBDb2RlTmFtZS5mb3JQcm9wZXJ0eVR5cGUodHlwZU5hbWUsIHJlc291cmNlQ29udGV4dCk7XG59XG5cbi8qKlxuICogVHJhbnNsYXRlIGEgbGlzdCBvZiB0eXBlIHJlZmVyZW5jZXMgaW4gYSByZXNvdXJjZSBjb250ZXh0IHRvIGEgbGlzdCBvZiBjb2RlIG5hbWVzXG4gKlxuICogQHBhcmFtIHJlc291cmNlQ29udGV4dFxuICogQHBhcmFtIHR5cGVzIG5hbWUgYW5kIHdoZXRoZXIgdGhlIHR5cGUgaXMgYSBjb21wbGV4IHR5cGUgKHRydWUpIG9yIHByaW1pdGl2ZSB0eXBlIChmYWxzZSlcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNwZWNUeXBlc1RvQ29kZVR5cGVzKHJlc291cmNlQ29udGV4dDogQ29kZU5hbWUsIHR5cGVzOiB7IFtuYW1lOiBzdHJpbmddOiBib29sZWFuIH0pOiBDb2RlTmFtZVtdIHtcbiAgcmV0dXJuIE9iamVjdC5lbnRyaWVzKHR5cGVzKS5tYXAoKFtuYW1lLCBjb21wbGV4VHlwZV0pID0+IHNwZWNUeXBlVG9Db2RlVHlwZShyZXNvdXJjZUNvbnRleHQsIG5hbWUsIGNvbXBsZXhUeXBlKSk7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgUHJvcGVydHlWaXNpdG9yPFQ+IHtcblxuICAvKipcbiAgICogQSBzaW5nbGUgdHlwZSAoZWl0aGVyIGJ1aWx0LWluIG9yIGNvbXBsZXgpXG4gICAqL1xuICB2aXNpdEF0b20odHlwZTogQ29kZU5hbWUpOiBUO1xuXG4gIC8qKlxuICAgKiBBIHVuaW9uIG9mIGF0b21pYyB0eXBlc1xuICAgKi9cbiAgdmlzaXRBdG9tVW5pb24odHlwZXM6IENvZGVOYW1lW10pOiBUO1xuXG4gIC8qKlxuICAgKiBBIGxpc3Qgb2YgYXRvbXNcbiAgICovXG4gIHZpc2l0TGlzdChpdGVtVHlwZTogQ29kZU5hbWUpOiBUO1xuXG4gIC8qKlxuICAgKiBMaXN0IG9mIHVuaW9uc1xuICAgKi9cbiAgdmlzaXRVbmlvbkxpc3QoaXRlbVR5cGVzOiBDb2RlTmFtZVtdKTogVDtcblxuICAvKipcbiAgICogTWFwIG9mIGF0b21zXG4gICAqL1xuICB2aXNpdE1hcChpdGVtVHlwZTogQ29kZU5hbWUpOiBUO1xuXG4gIC8qKlxuICAgKiBNYXAgb2YgdW5pb25zXG4gICAqL1xuICB2aXNpdFVuaW9uTWFwKGl0ZW1UeXBlczogQ29kZU5hbWVbXSk6IFQ7XG5cbiAgLyoqXG4gICAqIE1hcCBvZiBsaXN0c1xuICAgKi9cbiAgdmlzaXRNYXBPZkxpc3RzKGl0ZW1UeXBlOiBDb2RlTmFtZSk6IFQ7XG5cbiAgLyoqXG4gICAqIFVuaW9uIG9mIGxpc3QgdHlwZSBhbmQgYXRvbSB0eXBlXG4gICAqL1xuICB2aXNpdExpc3RPckF0b20oc2NhbGFyVHlwZXM6IENvZGVOYW1lW10sIGl0ZW1UeXBlczogQ29kZU5hbWVbXSk6IGFueTtcbn1cblxuLyoqXG4gKiBJbnZva2UgdGhlIHJpZ2h0IHZpc2l0b3IgbWV0aG9kIGZvciB0aGUgZ2l2ZW4gcHJvcGVydHksIGRlcGVuZGluZyBvbiBpdHMgdHlwZVxuICpcbiAqIFdlIHVzZSB0aGUgdGVybSBcImF0b21cIiBpbiB0aGlzIGNvbnRleHQgdG8gbWVhbiBhIHR5cGUgdGhhdCBjYW4gb25seSBhY2NlcHQgYSBzaW5nbGVcbiAqIHZhbHVlIG9mIGEgZ2l2ZW4gdHlwZS4gVGhpcyBpcyB0byBjb250cmFzdCBpdCB3aXRoIGNvbGxlY3Rpb25zIGFuZCB1bmlvbnMuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB0eXBlRGlzcGF0Y2g8VD4ocmVzb3VyY2VDb250ZXh0OiBDb2RlTmFtZSwgc3BlYzogc2NoZW1hLlByb3BlcnR5LCB2aXNpdG9yOiBQcm9wZXJ0eVZpc2l0b3I8VD4pOiBUIHtcbiAgY29uc3Qgc2NhbGFyVHlwZXMgPSBzcGVjVHlwZXNUb0NvZGVUeXBlcyhyZXNvdXJjZUNvbnRleHQsIHNjYWxhclR5cGVOYW1lcyhzcGVjKSk7XG4gIGNvbnN0IGl0ZW1UeXBlcyA9IHNwZWNUeXBlc1RvQ29kZVR5cGVzKHJlc291cmNlQ29udGV4dCwgaXRlbVR5cGVOYW1lcyhzcGVjKSk7XG5cbiAgaWYgKHNjYWxhclR5cGVzLmxlbmd0aCAmJiBpdGVtVHlwZXMubGVuZ3RoKSB7XG4gICAgLy8gQ2FuIGFjY2VwdCBib3RoIGEgY29sbGVjdGlvbiBhL25kIGEgc2NhbGFyXG4gICAgcmV0dXJuIHZpc2l0b3IudmlzaXRMaXN0T3JBdG9tKHNjYWxhclR5cGVzLCBpdGVtVHlwZXMpO1xuICB9XG5cbiAgaWYgKHNjaGVtYS5pc0NvbGxlY3Rpb25Qcm9wZXJ0eShzcGVjKSkge1xuICAgIC8vIExpc3Qgb3IgbWFwLCBvZiBlaXRoZXIgYXRvbXMgb3IgdW5pb25zXG4gICAgaWYgKHNjaGVtYS5pc01hcFByb3BlcnR5KHNwZWMpKSB7XG4gICAgICBpZiAoc2NoZW1hLmlzTWFwT2ZMaXN0c09mUHJpbWl0aXZlc1Byb3BlcnR5KHNwZWMpKSB7XG4gICAgICAgIC8vIHJlbW92ZSB0aGUgJ1tdJyBmcm9tIHRoZSB0eXBlXG4gICAgICAgIGNvbnN0IGJhc2VUeXBlID0gaXRlbVR5cGVzWzBdLmNsYXNzTmFtZTtcbiAgICAgICAgY29uc3QgaXRlbVR5cGUgPSBDb2RlTmFtZS5mb3JQcmltaXRpdmUoYmFzZVR5cGUuc2xpY2UoMCwgLTIpKTtcbiAgICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRNYXBPZkxpc3RzKGl0ZW1UeXBlKTtcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtVHlwZXMubGVuZ3RoID4gMSkge1xuICAgICAgICByZXR1cm4gdmlzaXRvci52aXNpdFVuaW9uTWFwKGl0ZW1UeXBlcyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdmlzaXRvci52aXNpdE1hcChpdGVtVHlwZXNbMF0pO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoaXRlbVR5cGVzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRVbmlvbkxpc3QoaXRlbVR5cGVzKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0TGlzdChpdGVtVHlwZXNbMF0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8vIEF0b20gb3IgdW5pb24gb2YgYXRvbXNcbiAgaWYgKHNjYWxhclR5cGVzLmxlbmd0aCA+IDEpIHtcbiAgICByZXR1cm4gdmlzaXRvci52aXNpdEF0b21VbmlvbihzY2FsYXJUeXBlcyk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHZpc2l0b3IudmlzaXRBdG9tKHNjYWxhclR5cGVzWzBdKTtcbiAgfVxuXG59XG4iXX0=