import { Test } from 'nodeunit';
import schema = require('../lib/schema');
import { Specification } from '../lib/schema';

export function validateSpecification(test: Test, specification: Specification) {
  validateResourceTypes(test, specification);
  validatePropertyTypes(test, specification);
}

function validateResourceTypes(test: Test, specification: Specification) {
  for (const typeName of Object.keys(specification.ResourceTypes)) {
    test.ok(typeName, 'Resource type name is not empty');
    const type = specification.ResourceTypes[typeName];
    test.notEqual(type.Documentation, null, `${typeName} is documented`);
    if (type.Properties) { validateProperties(typeName, test, type.Properties, specification); }
    if (type.Attributes) { validateAttributes(typeName, test, type.Attributes, specification); }
  }
}

function validatePropertyTypes(test: Test, specification: Specification) {
  for (const typeName of Object.keys(specification.PropertyTypes)) {
    test.ok(typeName, 'Property type name is not empty');
    const type = specification.PropertyTypes[typeName];
    test.ok(type.Documentation, `${typeName} is documented`);
    validateProperties(typeName, test, type.Properties, specification);
  }
}

function validateProperties(typeName: string,
                            test: Test,
                            properties: { [name: string]: schema.Property },
                            specification: Specification) {
  const requiredKeys = ['Documentation', 'Required', 'UpdateType'];
  for (const name of Object.keys(properties)) {
    const property = properties[name];
    test.notEqual(property.Documentation, '', `${typeName}.Properties.${name} is documented`);
    test.ok(schema.isUpdateType(property.UpdateType), `${typeName}.Properties.${name} has valid UpdateType`);
    test.notEqual(property.Required, null, `${typeName}.Properties.${name} has required flag`);
    if (schema.isPrimitiveProperty(property)) {
      test.deepEqual(Object.keys(property).sort(),
               [...requiredKeys, 'PrimitiveType'].sort(),
               `${typeName}.Properties.${name} has no extra properties`);
      test.ok(schema.isPrimitiveType(property.PrimitiveType), `${typeName}.Properties.${name} has a valid PrimitiveType`);
    } else if (schema.isPrimitiveListProperty(property)) {
      // The DuplicatesAllowed key is optional (absent === false)
      const extraKeys = 'DuplicatesAllowed' in property ? ['DuplicatesAllowed'] : [];
      test.deepEqual(Object.keys(property).sort(),
               [...requiredKeys, ...extraKeys, 'PrimitiveItemType', 'Type'].sort(),
               `${typeName}.Properties.${name} has no extra properties`);
      test.ok(schema.isPrimitiveType(property.PrimitiveItemType), `${typeName}.Properties.${name} has a valid PrimitiveItemType`);
    } else if (schema.isPrimitiveMapProperty(property)) {
      // The DuplicatesAllowed key is optional (absent === false)
      const extraKeys = 'DuplicatesAllowed' in property ? ['DuplicatesAllowed'] : [];
      test.deepEqual(Object.keys(property).sort(),
               [...requiredKeys, ...extraKeys, 'PrimitiveItemType', 'Type'].sort(),
               `${typeName}.Properties.${name} has no extra properties`);
      test.ok(schema.isPrimitiveType(property.PrimitiveItemType), `${typeName}.Properties.${name} has a valid PrimitiveItemType`);
      test.ok(!property.DuplicatesAllowed, `${typeName}.Properties.${name} does not allow duplicates`);
    } else if (schema.isComplexListProperty(property)) {
      // The DuplicatesAllowed key is optional (absent === false)
      const extraKeys = 'DuplicatesAllowed' in property ? ['DuplicatesAllowed'] : [];
      test.deepEqual(Object.keys(property).sort(),
               [...requiredKeys, ...extraKeys, 'ItemType', 'Type'].sort(),
               `${typeName}.Properties.${name} has no extra properties`);
      test.ok(property.ItemType, `${typeName}.Properties.${name} has a valid ItemType`);
      if (property.ItemType !== 'Tag') {
        const fqn = `${typeName.split('.')[0]}.${property.ItemType}`;
        const resolvedType = specification.PropertyTypes && specification.PropertyTypes[fqn];
        test.ok(resolvedType, `${typeName}.Properties.${name} ItemType (${fqn}) resolves`);
      }
    } else if (schema.isComplexMapProperty(property)) {
      // The DuplicatesAllowed key is optional (absent === false)
      const extraKeys = 'DuplicatesAllowed' in property ? ['DuplicatesAllowed'] : [];
      test.deepEqual(Object.keys(property).sort(),
               [...requiredKeys, ...extraKeys, 'ItemType', 'Type'].sort(),
               `${typeName}.Properties.${name} has no extra properties`);
      test.ok(property.ItemType, `${typeName}.Properties.${name} has a valid ItemType`);
      const fqn = `${typeName.split('.')[0]}.${property.ItemType}`;
      const resolvedType = specification.PropertyTypes && specification.PropertyTypes[fqn];
      test.ok(resolvedType, `${typeName}.Properties.${name} ItemType (${fqn}) resolves`);
      test.ok(!property.DuplicatesAllowed, `${typeName}.Properties.${name} does not allow duplicates`);
    } else if (schema.isComplexProperty(property)) {
      test.ok(property.Type, `${typeName}.Properties.${name} has a valid type`);
      const fqn = `${typeName.split('.')[0]}.${property.Type}`;
      const resolvedType = specification.PropertyTypes && specification.PropertyTypes[fqn];
      test.ok(resolvedType, `${typeName}.Properties.${name} type (${fqn}) resolves`);
      test.deepEqual(Object.keys(property).sort(),
               [...requiredKeys, 'Type'].sort(),
               `${typeName}.Properties.${name} has no extra properties`);
    } else if (schema.isUnionProperty(property)) {
      if (property.PrimitiveTypes) {
        for (const type of property.PrimitiveTypes) {
          test.ok(schema.isPrimitiveType(type), `${typeName}.Properties.${name} has only valid PrimitiveTypes`);
        }
      }
      if (property.ItemTypes) {
        for (const type of property.ItemTypes) {
          const fqn = `${typeName.split('.')[0]}.${type}`;
          const resolvedType = specification.PropertyTypes && specification.PropertyTypes[fqn];
          test.ok(resolvedType, `${typeName}.Properties.${name} type (${fqn}) resolves`);
        }
      }
      if (property.Types) {
        for (const type of property.Types) {
          const fqn = `${typeName.split('.')[0]}.${type}`;
          const resolvedType = specification.PropertyTypes && specification.PropertyTypes[fqn];
          test.ok(resolvedType, `${typeName}.Properties.${name} type (${fqn}) resolves`);
        }
      }
    } else {
      test.ok(false, `${typeName}.Properties.${name} has known type`);
    }
  }
}

function validateAttributes(typeName: string,
                            test: Test,
                            attributes: { [name: string]: schema.Attribute },
                            specification: Specification) {
  for (const name of Object.keys(attributes)) {
    const attribute = attributes[name];
    test.ok(('Type' in attribute) !== ('PrimitiveType' in attribute));
    if (schema.isPrimitiveAttribute(attribute)) {
      test.ok(!schema.isListAttribute(attribute), `${typeName}.Attributes.${name} is only a Primitive type`);
      test.ok(schema.isPrimitiveType(attribute.PrimitiveType), `${typeName}.Attributes.${name} has a valid PrimitiveType`);
      test.ok(!('PrimitiveItemType' in attribute), `${typeName}.Attributes.${name} has no PrimitiveItemType`);
      test.ok(!('ItemType' in attribute), `${typeName}.Attributes.${name} has no ItemType`);
    } else if (schema.isPrimitiveListAttribute(attribute)) {
      test.ok(!schema.isComplexListAttribute(attribute), `${typeName}.Attributes.${name} is only a List<Primitive> type`);
      test.ok(schema.isPrimitiveType(attribute.PrimitiveItemType), `${typeName}.Attributes.${name} has a valid PrimitiveItemType`);
      test.ok(!('ItemType' in attribute), `${typeName}.Attributes.${name} has no ItemType`);
    } else if (schema.isComplexListAttribute(attribute)) {
      test.ok(attribute.ItemType, `${typeName}.Attributes.${name} is a valid List<Complex> type`);
      const fqn = `${typeName.split('.')[0]}.${attribute.ItemType}`;
      const resolvedType = specification.PropertyTypes && specification.PropertyTypes[fqn];
      test.ok(resolvedType, `${typeName}.Attributes.${name} ItemType (${fqn}) resolves`);
      test.ok(!('PrimitiveItemType' in attribute), `${typeName}.Attributes.${name} has no PrimitiveItemType`);
    } else {
      test.ok(false, `${typeName}.Attributes.${name} has a valid type`);
    }
  }
}
