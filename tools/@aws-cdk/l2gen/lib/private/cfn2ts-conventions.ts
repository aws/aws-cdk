import { schema, resourceSpecification, propertySpecification } from '@aws-cdk/cfnspec';
import { toCamelCase } from './camel';
import { IType, existingType } from '../type';
import { SourceFile } from '../source-module';
import { renderable } from '../cm2';

export function l1ClassName(cloudFormationResourceType: string) {
  const resourceName = cloudFormationResourceType.split('::')[2];
  return `Cfn${resourceName}`; // Has not been recased
}

export function l1PropertyName(specPropertyName: string) {
  return toCamelCase(specPropertyName);
}

export function isTagsProperty(prop: [string, schema.Property]) {
  return prop[0] === 'Tags';
}

export function genTypeForPropertyType(typeName: string, propertyTypeName: string): IType {
  return l1PropertyType(typeName, propertyTypeName);
}

export function genTypeForProperty(typeName: string, ...propertyPath: string[]): IType {
  const propPath = [...propertyPath];

  let spec: schema.ResourceType | schema.RecordProperty = resourceSpecification(typeName);
  while (propPath.length > 0) {
    const next = propPath.shift()!;
    const propDef = (spec.Properties ?? {})[next];
    if (!propDef) {
      throw new Error(`No property '${next}' in ${typeName}.${propertyPath}`);
    }

    if (propPath.length === 0) {
      // Only record types for now
      if (schema.isComplexProperty(propDef)) {
        return l1PropertyType(typeName, propDef.Type);
      } else {
        throw new Error(`Cannot return this one yet: ${JSON.stringify(propDef)}`);
      }
    }

    let nextType;
    if (schema.isComplexProperty(propDef)) {
      nextType = propDef.Type;
    } else if (schema.isComplexListProperty(propDef) || schema.isComplexMapProperty(propDef)) {
      nextType = propDef.ItemType;
    } else {
      throw new Error(`Property '${next}' in ${typeName}.${propertyPath} must be complex`);
    }

    spec = propertySpecification(typeName, nextType) as schema.RecordProperty; // Hope I'm not lying
  }

  throw new Error('Empty property path??');
}

export function l1ResourceType(cloudFormationResourceType: string) {
  return existingType(
    l1ClassName(cloudFormationResourceType),
    l1File(cloudFormationResourceType),
    () => renderable(['...']),
  );
}

export function l1PropertyType(cloudFormationResourceType: string, propTypeName: string) {
  return existingType(
    `${l1ClassName(cloudFormationResourceType)}.${propTypeName}Property`,
    l1File(cloudFormationResourceType),
    () => renderable(['...']),
    );
}

function l1File(cloudFormationResourceType: string) {
  const parts = cloudFormationResourceType.split('::');
  const svc = parts[1].toLowerCase();
  return new SourceFile(`./lib/${svc}.generated.ts`);
}


export function* resourceProperties(typeName: string) {
  const spec = resourceSpecification(typeName);
  for (const [name, definition] of Object.entries(spec.Properties ?? {})) {
    if (!isTagsProperty([name, definition])) {
      yield [name, definition] as const;
    }
  }
}
