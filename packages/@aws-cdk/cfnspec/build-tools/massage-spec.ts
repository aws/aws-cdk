import { detectScrutinyTypes } from './scrutiny';
import { schema } from '../lib';

export function massageSpec(spec: schema.Specification) {
  detectScrutinyTypes(spec);
  replaceIncompleteTypes(spec);
  dropTypelessAttributes(spec);
}

/**
 * Fix incomplete type definitions in PropertyTypes
 *
 * Some user-defined types are defined to not have any properties, and not
 * be a collection of other types either. They have no definition at all.
 *
 * Add a property object type with empty properties.
 */
function replaceIncompleteTypes(spec: schema.Specification) {
  for (const [name, definition] of Object.entries(spec.PropertyTypes)) {
    if (!schema.isRecordType(definition)
    && !schema.isCollectionProperty(definition)
    && !schema.isScalarProperty(definition)
    && !schema.isPrimitiveProperty(definition)) {
      // eslint-disable-next-line no-console
      console.log(`[${name}] Incomplete type, adding empty "Properties" field`);

      (definition as unknown as schema.RecordProperty).Properties = {};
    }
  }
}

/**
 * Drop Attributes specified with the different ResourceTypes that have
 * no type specified.
 */
function dropTypelessAttributes(spec: schema.Specification) {
  const resourceTypes = spec.ResourceTypes;
  Object.values(resourceTypes).forEach((resourceType) => {
    const attributes = resourceType.Attributes ?? {};
    Object.keys(attributes).forEach((attrKey) => {
      const attrVal = attributes[attrKey];
      if (Object.keys(attrVal).length === 0) {
        delete attributes[attrKey];
      }
    });
  });
}

/**
 * Modifies the provided specification so that ``ResourceTypes`` and ``PropertyTypes`` are listed in alphabetical order.
 *
 * @param spec an AWS CloudFormation Resource Specification document.
 *
 * @returns ``spec``, after having sorted the ``ResourceTypes`` and ``PropertyTypes`` sections alphabetically.
 */
export function normalize(spec: schema.Specification): schema.Specification {
  spec.ResourceTypes = normalizeSection(spec.ResourceTypes);
  if (spec.PropertyTypes) {
    spec.PropertyTypes = normalizeSection(spec.PropertyTypes);
  }
  return spec;

  function normalizeSection<T>(section: { [name: string]: T }): { [name: string]: T } {
    const result: { [name: string]: T } = {};
    for (const key of Object.keys(section).sort()) {
      result[key] = section[key];
    }
    return result;
  }
}
