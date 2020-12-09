import * as crypto from 'crypto';
import * as schema from './schema';
export { schema };
export * from './canned-metrics';

/**
 * The complete AWS CloudFormation Resource specification, having any CDK patches and enhancements included in it.
 */
export function specification(): schema.Specification {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  return require('../spec/specification.json');
}

/**
 * Return the resource specification for the given typename
 *
 * Validates that the resource exists. If you don't want this validating behavior, read from
 * specification() directly.
 */
export function resourceSpecification(typeName: string): schema.ResourceType {
  const ret = specification().ResourceTypes[typeName];
  if (!ret) {
    throw new Error(`No such resource type: ${typeName}`);
  }
  return ret;
}

/**
 * Get the resource augmentations for a given type
 */
export function resourceAugmentation(typeName: string): schema.ResourceAugmentation {
  const fileName = typeName.replace(/::/g, '_');
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return require(`./augmentations/${fileName}.json`);
  } catch (e) {
    return {};
  }
}

/**
 * Return the property specification for the given resource's property
 */
export function propertySpecification(typeName: string, propertyName: string): schema.Property {
  const ret = resourceSpecification(typeName).Properties![propertyName];
  if (!ret) {
    throw new Error(`Resource ${typeName} has no property: ${propertyName}`);
  }
  return ret;
}

/**
 * The list of resource type names defined in the ``specification``.
 */
export function resourceTypes() {
  return Object.keys(specification().ResourceTypes);
}

/**
 * The list of namespaces defined in the ``specification``, that is resource name prefixes down to the second ``::``.
 */
export function namespaces() {
  return Array.from(new Set(resourceTypes().map(n => n.split('::', 2).join('::'))));
}

/**
 * Obtain a filtered version of the AWS CloudFormation specification.
 *
 * @param filter the predicate to be used in order to filter which resource types from the ``Specification`` to extract.
 *         When passed as a ``string``, only the specified resource type will be extracted. When passed as a
 *         ``RegExp``, all matching resource types will be extracted. When passed as a ``function``, all resource
 *         types for which the function returned ``true`` will be extracted.
 *
 * @return a coherent sub-set of the AWS CloudFormation Resource specification, including all property types related
 *     to the selected resource types.
 */
export function filteredSpecification(filter: string | RegExp | Filter): schema.Specification {
  const spec = specification();

  const result: schema.Specification = { ResourceTypes: {}, PropertyTypes: {}, Fingerprint: spec.Fingerprint };
  const predicate: Filter = makePredicate(filter);
  for (const type of resourceTypes()) {
    if (!predicate(type)) { continue; }
    result.ResourceTypes[type] = spec.ResourceTypes[type];
    const prefix = `${type}.`;
    for (const propType of Object.keys(spec.PropertyTypes!).filter(n => n.startsWith(prefix))) {
      result.PropertyTypes[propType] = spec.PropertyTypes![propType];
    }
  }
  result.Fingerprint = crypto.createHash('sha256').update(JSON.stringify(result)).digest('base64');
  return result;
}

export type Filter = (name: string) => boolean;

/**
 * Creates a predicate function from a given filter.
 *
 * @param filter when provided as a ``string``, performs an exact match comparison.
 *         when provided as a ``RegExp``, performs uses ``str.match(RegExp)``.
 *         when provided as a ``function``, use the function as-is.
 *
 * @returns a predicate function.
 */
function makePredicate(filter: string | RegExp | Filter): Filter {
  if (typeof filter === 'string') {
    return s => s === filter;
  } else if (typeof filter === 'function') {
    return filter as Filter;
  } else {
    return s => s.match(filter) != null;
  }
}

/**
 * Return the properties of the given type that require the given scrutiny type
 */
export function scrutinizablePropertyNames(resourceType: string, scrutinyTypes: schema.PropertyScrutinyType[]): string[] {
  const impl = specification().ResourceTypes[resourceType];
  if (!impl) { return []; }

  const ret = new Array<string>();

  for (const [propertyName, propertySpec] of Object.entries(impl.Properties || {})) {
    if (scrutinyTypes.includes(propertySpec.ScrutinyType || schema.PropertyScrutinyType.None)) {
      ret.push(propertyName);
    }
  }

  return ret;
}

/**
 * Return the names of the resource types that need to be subjected to additional scrutiny
 */
export function scrutinizableResourceTypes(scrutinyTypes: schema.ResourceScrutinyType[]): string[] {
  const ret = new Array<string>();
  for (const [resourceType, resourceSpec] of Object.entries(specification().ResourceTypes)) {
    if (scrutinyTypes.includes(resourceSpec.ScrutinyType || schema.ResourceScrutinyType.None)) {
      ret.push(resourceType);
    }
  }

  return ret;
}
