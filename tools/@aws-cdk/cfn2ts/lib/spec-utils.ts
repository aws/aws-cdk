import { schema } from '@aws-cdk/cfnspec';
import { joinIf } from './util';

/**
 * Name of an object in the CloudFormation spec
 *
 * This refers to a Resource, parsed from a string like 'AWS::S3::Bucket'.
 */
export class SpecName {
  /**
   * Parse a string representing a name from the CloudFormation spec to a CfnName object
   */
  public static parse(cfnName: string): SpecName {
    const parts = cfnName.split('::');
    const module = parts.slice(0, parts.length - 1).join('::');

    const lastParts = parts[parts.length - 1].split('.');

    if (lastParts.length === 1) {
      // Resource name, looks like A::B::C
      return new SpecName(module, lastParts[0]);
    }

    throw new Error('Not a CloudFormation resource name: ' + cfnName);
  }

  constructor(readonly module: string, readonly resourceName: string) {
  }

  public get fqn(): string {
    return this.module + '::' + this.resourceName;
  }

  public relativeName(propName: string): PropertyAttributeName {
    return new PropertyAttributeName(this.module, this.resourceName, propName);
  }
}

/**
 * Name of a property type or attribute in the CloudFormation spec.
 *
 * These are scoped to a resource, parsed from a string like 'AWS::S3::Bucket.LifecycleConfiguration'.
 */
export class PropertyAttributeName extends SpecName {
  public static parse(cfnName: string): PropertyAttributeName {
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

  constructor(module: string, resourceName: string, readonly propAttrName: string) {
    super(module, resourceName);
  }

  public get fqn(): string {
    return joinIf(super.fqn, '.', this.propAttrName);
  }
}

/**
 * Return a list of all allowable item types, separating out primitive and complex
 * types because sometimes a complex type can have the same name as a primitive type.
 * If we only return the names in this case then the primitive type will always override
 * the complex type (not what we want).
 *
 * @returns type name and whether the type is a complex type (true) or primitive type (false)
 */
export function itemTypeNames(spec: schema.CollectionProperty): { [name: string]: boolean } {
  const types = complexItemTypeNames(spec).map(type => [type, true])
    .concat(primitiveItemTypeNames(spec).map(type => [type, false]));

  return Object.fromEntries(types);
}

function complexItemTypeNames(spec: schema.CollectionProperty): string[] {
  if (schema.isComplexListProperty(spec) || schema.isMapOfStructsProperty(spec)) {
    return [spec.ItemType];
  } else if (schema.isUnionProperty(spec)) {
    return spec.ItemTypes ?? spec.InclusiveItemTypes ?? [];
  }
  return [];
}

function primitiveItemTypeNames(spec: schema.CollectionProperty): string[] {
  if (schema.isMapOfListsOfPrimitivesProperty(spec)) {
    return [`${spec.PrimitiveItemItemType}[]`]; // <--- read in specTypeToCodeType()
  } else if (schema.isPrimitiveListProperty(spec) || schema.isPrimitiveMapProperty(spec)) {
    return [spec.PrimitiveItemType];
  } else if (schema.isUnionProperty(spec)) {
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
export function scalarTypeNames(spec: schema.ScalarProperty): { [name: string]: boolean } {
  const types = complexScalarTypeNames(spec).map(type => [type, true] )
    .concat(primitiveScalarTypeNames(spec).map(type => [type, false]));

  return Object.fromEntries(types);
}

function complexScalarTypeNames(spec: schema.ScalarProperty): string[] {
  if (schema.isComplexProperty(spec) && !schema.isListProperty(spec) && !schema.isMapProperty(spec)) {
    return [spec.Type];
  } else if (schema.isUnionProperty(spec)) {
    return spec.Types || [];
  }
  return [];
}

function primitiveScalarTypeNames(spec: schema.ScalarProperty): string[] {
  if (schema.isPrimitiveProperty(spec)) {
    return [spec.PrimitiveType];
  } else if (schema.isUnionProperty(spec)) {
    return spec.PrimitiveTypes || [];
  }
  return [];
}
