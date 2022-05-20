/* eslint-disable jest/no-export */
import * as schema from '../lib/schema';

export function validateSpecification(specification: schema.Specification) {
  validateResourceTypes(specification);
  validatePropertyTypes(specification);
}

function validateResourceTypes(specification: schema.Specification) {
  for (const typeName of Object.keys(specification.ResourceTypes)) {
    describe(typeName, () => {
      expect(typeName).toBeTruthy();
      const type = specification.ResourceTypes[typeName];
      expect(type.Documentation).not.toBeNull();
      if (type.ScrutinyType) {
        expect(schema.isResourceScrutinyType(type.ScrutinyType)).toBeTruthy();
      }
      if (type.Properties) { validateProperties(typeName, type.Properties, specification); }
      if (type.Attributes) { validateAttributes(typeName, type.Attributes, specification); }
    });
  }
}

function validatePropertyTypes(specification: schema.Specification) {
  for (const typeName of Object.keys(specification.PropertyTypes)) {
    describe(`PropertyType ${typeName}`, () => {
      expect(typeName).toBeTruthy();
      const type = specification.PropertyTypes[typeName];
      if (schema.isRecordType(type)) {
        validateProperties(typeName, type.Properties, specification);
      } else {
        validateProperties(typeName, { '<this>': type }, specification);
      }
    });
  }
}

function validateProperties(
  typeName: string,
  properties: { [name: string]: schema.Property },
  specification: schema.Specification) {
  const expectedKeys = ['Documentation', 'Required', 'UpdateType', 'ScrutinyType'];
  for (const name of Object.keys(properties)) {

    test(`Property ${name}`, () => {
      const property = properties[name];
      expect(property.Documentation).not.toEqual('');
      expect(!property.UpdateType || schema.isUpdateType(property.UpdateType)).toBeTruthy();
      if (property.ScrutinyType !== undefined) {
        expect(schema.isPropertyScrutinyType(property.ScrutinyType)).toBeTruthy();
      }

      if (schema.isPrimitiveProperty(property)) {
        expect(schema.isPrimitiveType(property.PrimitiveType)).toBeTruthy();
        expectedKeys.push('PrimitiveType');

      } else if (schema.isPrimitiveListProperty(property)) {
        expectedKeys.push('Type', 'DuplicatesAllowed', 'PrimitiveItemType');
        expect(schema.isPrimitiveType(property.PrimitiveItemType)).toBeTruthy();

      } else if (schema.isPrimitiveMapProperty(property)) {
        expectedKeys.push('Type', 'DuplicatesAllowed', 'PrimitiveItemType', 'Type');
        expect(schema.isPrimitiveType(property.PrimitiveItemType)).toBeTruthy();
        expect(property.DuplicatesAllowed).toBeFalsy();

      } else if (schema.isComplexListProperty(property)) {
        expectedKeys.push('Type', 'DuplicatesAllowed', 'ItemType', 'Type');
        expect(property.ItemType).toBeTruthy();
        if (property.ItemType !== 'Tag') {
          const fqn = `${typeName.split('.')[0]}.${property.ItemType}`;
          const resolvedType = specification.PropertyTypes && specification.PropertyTypes[fqn];
          expect(resolvedType).toBeTruthy();
        }

      } else if (schema.isMapOfStructsProperty(property)) {
        expectedKeys.push('Type', 'DuplicatesAllowed', 'ItemType', 'Type');
        expect(property.ItemType).toBeTruthy();
        const fqn = `${typeName.split('.')[0]}.${property.ItemType}`;
        const resolvedType = specification.PropertyTypes && specification.PropertyTypes[fqn];
        expect(resolvedType).toBeTruthy();
        expect(property.DuplicatesAllowed).toBeFalsy();

      } else if (schema.isMapOfListsOfPrimitivesProperty(property)) {
        expectedKeys.push('Type', 'DuplicatesAllowed', 'ItemType', 'PrimitiveItemItemType', 'Type');
        expect(schema.isPrimitiveType(property.PrimitiveItemItemType)).toBeTruthy();
        expect(property.DuplicatesAllowed).toBeFalsy();

      } else if (schema.isComplexProperty(property)) {
        expectedKeys.push('Type');
        expect(property.Type).toBeTruthy();
        const fqn = `${typeName.split('.')[0]}.${property.Type}`;
        const resolvedType = specification.PropertyTypes && specification.PropertyTypes[fqn];
        expect(resolvedType).toBeTruthy();

      } else if (schema.isUnionProperty(property)) {
        expectedKeys.push('PrimitiveTypes', 'PrimitiveItemTypes', 'ItemTypes', 'Types', 'InclusivePrimitiveItemTypes', 'InclusiveItemTypes', 'InclusiveItemPattern');
        if (property.PrimitiveTypes) {
          for (const type of property.PrimitiveTypes) {
            expect(schema.isPrimitiveType(type)).toBeTruthy();
          }
        }
        if (property.ItemTypes) {
          for (const type of property.ItemTypes) {
            const fqn = `${typeName.split('.')[0]}.${type}`;
            const resolvedType = specification.PropertyTypes && specification.PropertyTypes[fqn];
            expect(resolvedType).toBeTruthy();
          }
        }
        if (property.Types) {
          for (const type of property.Types) {
            const fqn = `${typeName.split('.')[0]}.${type}`;
            const resolvedType = specification.PropertyTypes && specification.PropertyTypes[fqn];
            expect(resolvedType).toBeTruthy();
          }
        }

      } else {
        // eslint-disable-next-line no-console
        console.error(`${typeName}.Properties.${name} does not declare a type. ` +
          `Property definition is: ${JSON.stringify(property, undefined, 2)}`);
        expect(false).toBeTruthy();
      }

      expect(without(Object.keys(property), expectedKeys)).toEqual([]);
    });
  }
}

function validateAttributes(
  typeName: string,
  attributes: { [name: string]: schema.Attribute },
  specification: schema.Specification) {
  for (const name of Object.keys(attributes)) {
    test(`Attribute ${name}`, () => {
      const attribute = attributes[name];
      expect(('Type' in attribute)).not.toEqual(('PrimitiveType' in attribute));
      if (schema.isPrimitiveAttribute(attribute)) {
        expect(schema.isListAttribute(attribute)).toBeFalsy();
        expect(schema.isPrimitiveType(attribute.PrimitiveType)).toBeTruthy();
        expect(('PrimitiveItemType' in attribute)).toBeFalsy();
        expect(('ItemType' in attribute)).toBeFalsy();
      } else if (schema.isPrimitiveListAttribute(attribute)) {
        expect(schema.isComplexListAttribute(attribute)).toBeFalsy();
        expect(schema.isPrimitiveType(attribute.PrimitiveItemType)).toBeTruthy();
        expect(('ItemType' in attribute)).toBeFalsy();
      } else if (schema.isComplexListAttribute(attribute)) {
        expect(attribute.ItemType).toBeTruthy();
        const fqn = `${typeName.split('.')[0]}.${attribute.ItemType}`;
        const resolvedType = specification.PropertyTypes && specification.PropertyTypes[fqn];
        expect(resolvedType).toBeTruthy();
        expect(('PrimitiveItemType' in attribute)).toBeFalsy();
      } else if (schema.isPrimitiveMapAttribute(attribute)) {
        expect(schema.isPrimitiveType(attribute.PrimitiveItemType)).toBeTruthy();
        expect(('ItemType' in attribute)).toBeFalsy();
      } else {
        expect(false).toBeTruthy(); // `${typeName}.Attributes.${name} has a valid type`);
      }
    });
  }
}

/**
 * Remove elements from a set
 */
function without<T>(xs: T[], ...sets: T[][]) {
  const ret = new Set(xs);

  for (const set of sets) {
    for (const element of set) {
      if (ret.has(element)) {
        ret.delete(element);
      }
    }
  }

  return Array.from(ret);
}
