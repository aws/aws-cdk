import crypto = require('crypto');
import schema = require('./schema');
export { schema };

/**
 * The complete AWS CloudFormation Resource specification, having any CDK patches and enhancements included in it.
 */
// tslint:disable-next-line:no-var-requires
export const specification: schema.Specification = require('../spec/specification.json');

/**
 * The list of resource type names defined in the ``specification``.
 */
export const resourceTypes = Object.keys(specification.ResourceTypes);

/**
 * The list of namespaces defined in the ``specification``, that is resource name prefixes down to the second ``::``.
 */
export const namespaces = Array.from(new Set(resourceTypes.map(n => n.split('::', 2).join('::'))));

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
  const result: schema.Specification = { ResourceTypes: {}, PropertyTypes: {}, Fingerprint: specification.Fingerprint };
  const predicate: Filter = makePredicate(filter);
  for (const type of resourceTypes) {
    if (!predicate(type)) { continue; }
    result.ResourceTypes[type] = specification.ResourceTypes[type];
    const prefix = `${type}.`;
    for (const propType of Object.keys(specification.PropertyTypes!).filter(n => n.startsWith(prefix))) {
      result.PropertyTypes[propType] = specification.PropertyTypes![propType];
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
