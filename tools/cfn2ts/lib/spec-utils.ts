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

    throw new Error("Not a CloudFormation resource name: " + cfnName);
  }

  constructor(readonly module: string, readonly resourceName: string) {
  }

  public get fqn() {
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
    if (cfnName === "Tag") {
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

    throw new Error("Not a recognized PropertyType name: " + cfnName);
  }

  constructor(module: string, resourceName: string, readonly propAttrName: string) {
    super(module, resourceName);
  }

  public get fqn() {
    return joinIf(super.fqn, '.',  this.propAttrName);
  }
}

/**
 * Return a list of all allowable item types (either primitive or complex).
 */
export function itemTypeNames(spec: schema.CollectionProperty): string[] {
  return complexItemTypeNames(spec).concat(primitiveItemTypeNames(spec));
}

function complexItemTypeNames(spec: schema.CollectionProperty): string[] {
  if (schema.isComplexListProperty(spec) || schema.isComplexMapProperty(spec)) {
    return [spec.ItemType];
  } else if (schema.isUnionProperty(spec)) {
    return spec.ItemTypes || [];
  }
  return [];
}

function primitiveItemTypeNames(spec: schema.CollectionProperty): string[] {
  if (schema.isPrimitiveListProperty(spec) || schema.isPrimitiveMapProperty(spec)) {
    return [spec.PrimitiveItemType];
  } else if (schema.isUnionProperty(spec)) {
    return spec.PrimitiveItemTypes || [];
  }
  return [];
}

/**
 * Return a list of all allowable types (either primitive or complex).
 */
export function scalarTypeNames(spec: schema.ScalarProperty): string[] {
  return complexScalarTypeNames(spec).concat(primitiveScalarTypeNames(spec));
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
