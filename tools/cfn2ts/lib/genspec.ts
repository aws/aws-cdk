// Classes and definitions that have to do with modeling and decisions around code generation
//
// Does not include the actual code generation itself.

import { schema } from '@aws-cdk/cfnspec';
import codemaker = require('codemaker');
import { itemTypeNames, PropertyAttributeName, scalarTypeNames, SpecName } from './spec-utils';
import util = require('./util');

const RESOURCE_CLASS_PREFIX = 'Cfn';

export const CORE_NAMESPACE = 'cdk';

/**
 * The name of a class or method in the generated code.
 *
 * Has constructor functions to generate them from the CloudFormation specification.
 *
 * This refers to TypeScript constructs (typically a class)
 */
export class CodeName {
  public static forCfnResource(specName: SpecName, affix: string): CodeName {
    const className = RESOURCE_CLASS_PREFIX + specName.resourceName + affix;
    return new CodeName(packageName(specName), '', className, specName);
  }

  public static forResourceProperties(resourceName: CodeName): CodeName {
    return new CodeName(resourceName.packageName, resourceName.namespace, `${resourceName.className}Props`, resourceName.specName);
  }

  public static forPropertyType(specName: PropertyAttributeName, resourceClass: CodeName): CodeName {
    // Exception for an intrinsic type
    if (specName.propAttrName === 'Tag' && specName.resourceName === '') {
      return TAG_NAME;
    }

    // These are in a namespace named after the resource
    return new CodeName(packageName(specName), resourceClass.className, `${specName.propAttrName}Property`, specName);
  }

  public static forPrimitive(primitiveName: string): CodeName {
    return new CodeName('', '', primitiveName);
  }

  // tslint:disable:no-shadowed-variable
  constructor(readonly packageName: string,
              readonly namespace: string,
              readonly className: string,
              readonly specName?: SpecName,
              readonly methodName?: string) {
  }
  // tslint:enable:no-shadowed-variable

  /**
   * Alias for className
   *
   * Simply returns the top-level declaration name,  but reads better at the call site if
   * we're generating a function instead of a class.
   */
  public get functionName() {
    return this.className;
  }

  /**
   * Return the fully qualified name of the TypeScript object
   *
   * (When referred to it from the same package)
   */
  public get fqn() {
    return util.joinIf(this.namespace, '.', util.joinIf(this.className, '.', this.methodName));
  }

  public referToMethod(methodName: string): CodeName {
    return new CodeName(this.packageName, this.namespace, this.className, this.specName, methodName);
  }

  /**
   * Return a relative name from a given name to this name.
   *
   * Strips off the namespace if they're the same, otherwise leaves the namespace on.
   */
  public relativeTo(fromName: CodeName): CodeName {
    if (this.namespace === fromName.namespace) {
      return new CodeName(this.packageName, '', this.className, this.specName, this.methodName);
    }
    return this;
  }
}

export const TAG_NAME = new CodeName('', CORE_NAMESPACE, 'CfnTag');
export const TOKEN_NAME = new CodeName('', CORE_NAMESPACE, 'IResolvable');

/**
 * Resource attribute
 */
export class Attribute {
  constructor(
    readonly propertyName: string,
    readonly attributeType: string,
    readonly constructorArguments: string) {
  }
}

/**
 * Return the package in which this CfnName should be stored
 *
 * The "aws-cdk-" part is implicit.
 *
 * Example: AWS::EC2 -> ec2
 */
export function packageName(module: SpecName | string): string {
  if (module instanceof SpecName) {
    module = module.module;
  }

  const parts = module.split('::');

  if (['AWS', 'Alexa'].indexOf(parts[0]) === -1 || parts.length !== 2) {
    throw new Error(`Module component name must be "AWS::Xxx" or "Alexa::Xxx" (module: ${module})`);
  }

  return overridePackageName(parts[parts.length - 1].toLowerCase());
}

/**
 * Overrides special-case namespaces like serverless=>sam
 */
function overridePackageName(name: string) {
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
export function cfnMapperName(typeName: CodeName): CodeName {
  if (!typeName.packageName) {
    // Built-in or intrinsic type, built-in mappers
    return new CodeName('', CORE_NAMESPACE, '', undefined, util.downcaseFirst(`${typeName.className}ToCloudFormation`));
  }

  return new CodeName(typeName.packageName, '', util.downcaseFirst(`${typeName.namespace}${typeName.className}ToCloudFormation`));
}

/**
 * Return the name for the type-checking method
 */
export function validatorName(typeName: CodeName): CodeName {
  if (typeName.packageName === '') {
    // Built-in or intrinsic type, built-in validators
    return new CodeName('', CORE_NAMESPACE, '', undefined, `validate${codemaker.toPascalCase(typeName.className)}`);
  }

  return new CodeName(typeName.packageName, '', `${util.joinIf(typeName.namespace, '_', typeName.className)}Validator`);
}

/**
 * Determine how we will render a CloudFormation attribute in the code
 *
 * This consists of:
 *
 * - The type we will generate for the attribute, including its base class and docs.
 * - The property name we will use to refer to the attribute.
 */
export function attributeDefinition(resourceName: CodeName, attributeName: string, spec: schema.Attribute): Attribute {
  const descriptiveName = descriptiveAttributeName(resourceName, attributeName);  // "BucketArn"
  const propertyName = cloudFormationToScriptName(descriptiveName);      // "bucketArn"

  let attrType: string;
  if ('PrimitiveType' in spec && spec.PrimitiveType === 'String') {
    attrType = 'string';
  } else if ('PrimitiveType' in spec && spec.PrimitiveType === 'Integer') {
    attrType = 'number';
  } else if ('Type' in spec && 'PrimitiveItemType' in spec && spec.Type === 'List' && spec.PrimitiveItemType === 'String') {
    attrType = 'string[]';
  } else {
    // tslint:disable-next-line:no-console
    console.error(`WARNING: Unable to represent attribute type ${JSON.stringify(spec)} as a native type`);
    attrType = TOKEN_NAME.fqn;
  }

  const constructorArguments = `this.getAtt('${attributeName}')`;
  return new Attribute(propertyName, attrType, constructorArguments);
}

/**
 * Return an attribute definition name for the RefKind for this class
 */
export function refAttributeDefinition(resourceName: CodeName, refKind: string): Attribute {
  const propertyName = codemaker.toCamelCase(descriptiveAttributeName(resourceName, refKind));

  const constructorArguments = 'this.ref';

  return new Attribute(propertyName, 'string', constructorArguments);
}

/**
 * In the CDK, attribute names will be prefixed with the name of the resource (unless they already
 * have the name of the resource as a prefix). There are a few reasons for that, mainly to avoid name
 * collisions with base class properties, but also to allow certain constructs to expose multiple attributes
 * of different sub-resources using the same names (i.e. 'bucketArn' and 'topicArn' can co-exist while 'arn' and 'arn' cannot).
 */
function descriptiveAttributeName(resourceName: CodeName, attributeName: string): string {
  // remove '.'s
  attributeName = attributeName.replace(/\./g, '');

  const resName = resourceName.specName!.resourceName;

  // special case (someone was smart)
  if (resName === 'SecurityGroup' && attributeName === 'GroupId') {
    attributeName = 'SecurityGroupId';
  }

  // if property name already starts with the resource name, then just use it as-is
  // otherwise, prepend the resource name
  if (!attributeName.toLowerCase().startsWith(resName.toLowerCase())) {
    attributeName = `${resName}${codemaker.toPascalCase(attributeName)}`;
  }

  return attributeName;
}

/**
 * Convert a CloudFormation name to a nice TypeScript name
 *
 * We use a library to camelcase, and fix up some things that translate incorrectly.
 *
 * For example, the library breaks when pluralizing an abbreviation, such as "ProviderARNs" -> "providerArNs".
 *
 * We currently recognize "ARNs", "MBs" and "AZs".
 */
export function cloudFormationToScriptName(name: string): string {
  if (name === 'VPCs') { return 'vpcs'; }
  const ret = codemaker.toCamelCase(name);

  const suffixes: { [key: string]: string } = { ARNs: 'Arns', MBs: 'MBs', AZs: 'AZs' };

  for (const suffix of Object.keys(suffixes)) {
    if (name.endsWith(suffix)) {
      return ret.substr(0, ret.length - suffix.length) + suffixes[suffix];
    }
  }

  return ret;
}

function specPrimitiveToCodePrimitive(type: schema.PrimitiveType): CodeName {
  switch (type) {
    case 'Boolean': return CodeName.forPrimitive('boolean');
    case 'Double': return CodeName.forPrimitive('number');
    case 'Integer': return CodeName.forPrimitive('number');
    case 'Json': return CodeName.forPrimitive('object');
    case 'Long': return CodeName.forPrimitive('number');
    case 'String': return CodeName.forPrimitive('string');
    case 'Timestamp': return CodeName.forPrimitive('Date');
    default: throw new Error(`Invalid primitive type: ${type}`);
  }
}

export function isPrimitive(type: CodeName): boolean {
  return type.className === 'boolean'
    || type.className === 'number'
    || type.className === 'object'
    || type.className === 'string'
    || type.className === 'Date';
}

function specTypeToCodeType(resourceContext: CodeName, type: string): CodeName {
  if (schema.isPrimitiveType(type)) {
    return specPrimitiveToCodePrimitive(type);
  } else if (type === 'Tag') {
    // Tags are not considered primitive by the CloudFormation spec (even though they are intrinsic)
    // so we won't consider them primitive either.
    return TAG_NAME;
  }

  const typeName = resourceContext.specName!.relativeName(type);
  return CodeName.forPropertyType(typeName, resourceContext);
}

/**
 * Translate a list of type references in a resource context to a list of code names
 */
export function specTypesToCodeTypes(resourceContext: CodeName, types: string[]): CodeName[] {
  return types.map(type => specTypeToCodeType(resourceContext, type));
}

export interface PropertyVisitor<T> {
  visitScalar(type: CodeName): T;
  visitUnionScalar(types: CodeName[]): T;
  visitList(itemType: CodeName): T;
  visitUnionList(itemTypes: CodeName[]): T;
  visitMap(itemType: CodeName): T;
  visitUnionMap(itemTypes: CodeName[]): T;
  visitListOrScalar(scalarTypes: CodeName[], itemTypes: CodeName[]): any;
}

export function typeDispatch<T>(resourceContext: CodeName, spec: schema.Property, visitor: PropertyVisitor<T>): T {
  const scalarTypes = specTypesToCodeTypes(resourceContext, scalarTypeNames(spec));
  const itemTypes = specTypesToCodeTypes(resourceContext, itemTypeNames(spec));

  if (scalarTypes.length && itemTypes.length) {
    // Can accept both a list and a scalar
    return visitor.visitListOrScalar(scalarTypes, itemTypes);
  } else if (schema.isCollectionProperty(spec)) {
    if (schema.isMapProperty(spec)) {
      if (itemTypes.length > 1) {
        return visitor.visitUnionMap(itemTypes);
      } else {
        return visitor.visitMap(itemTypes[0]);
      }
    } else {
      if (itemTypes.length > 1) {
        return visitor.visitUnionList(itemTypes);
      } else {
        return visitor.visitList(itemTypes[0]);
      }
    }
  } else {
    if (scalarTypes.length > 1) {
      return visitor.visitUnionScalar(scalarTypes);
    } else {
      return visitor.visitScalar(scalarTypes[0]);
    }
  }
}
