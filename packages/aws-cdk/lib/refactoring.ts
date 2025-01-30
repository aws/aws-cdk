import { createHash } from 'crypto';

/**
 * The Resources section of a CFN template
 */
export type ResourceMap = Map<string, any>

/**
 * Map of resource hashes to sets of logical IDs
 */
export type ResourceIndex = Map<string, Set<string>>

/**
 * Correspondence between sets of logical IDs.
 * Both sets are names for the same resource
 */
export type ResourceCorrespondence = [Set<string>, Set<string>][]

export function formatCorrespondence(corr: ResourceCorrespondence, oldResources: ResourceMap, newResources: ResourceMap): string {
  function toMetadataUsing(set: Set<string>, resources: Record<string, any>): Set<string> {
    return new Set([...set].map(s => resources[s].Metadata?.['aws:cdk:path'] as string ?? s));
  }

  let text = corr
    .map(([before, after]) => ([
      toMetadataUsing(before, oldResources),
      toMetadataUsing(after, newResources),
    ]))
    .map(([before, after]) => {
      if (before.size === 1 && after.size === 1) {
        return `${[...before][0]} -> ${[...after][0]}`;
      } else {
        return `{${[...before].join(', ')}} -> {${[...after].join(', ')}}`;
      }
    })
    .map(x => `  - ${x}`)
    .join('\n');

  return `\n${text}\n`;
}

/**
 * Given two records of (logical ID -> object), finds a list of objects that
 * are present in both records but have different logical IDs. For each of
 * these objects, this function returns a pair of sets of logical IDs. The
 * first set coming from the first record, and the second set, from the
 * second object. For example:
 *
 *     const corr = checkRenaming({a: {x: 0}}, {b: {x: 0}});
 *
 * `corr` should be `[new Set('a'), new Set('b')]`
 *
 */
export function checkRenaming(m1: Record<string, any>, m2: Record<string, any>): ResourceCorrespondence {
  if (m1 == null || m2 == null) {
    return [];
  }
  return correspondence(
    index(new Map(Object.entries(m1))),
    index(new Map(Object.entries(m2))),
  );
}

function index(resourceMap: ResourceMap): ResourceIndex {
  const result: ResourceIndex = new Map();
  resourceMap.forEach((resource, logicalId) => {
    const h = hashObject(resource);
    if (!result.has(h)) {
      result.set(h, new Set());
    }
    result.get(h)?.add(logicalId);
  });
  return result;
}

function correspondence(index1: ResourceIndex, index2: ResourceIndex): ResourceCorrespondence {
  const result: ResourceCorrespondence = [];

  const keyUnion = new Set([...index1.keys(), ...index2.keys()]);
  keyUnion.forEach((key) => {
    if (index1.has(key) && index2.has(key) && index1.get(key) !== index2.get(key)) {
      result.push(partitionedSymmetricDifference(index1.get(key)!, index2.get(key)!));
    }
  });

  return result.filter(c => c[0].size > 0 && c[1].size > 0);
}

/**
 * Returns a pair [s0 \ s1, s1 \ s0].
 */
function partitionedSymmetricDifference(s0: Set<string>, s1: Set<string>): [Set<string>, Set<string>] {
  return [difference(s0, s1), difference(s1, s0)];
}

function hashObject(obj: any): string {
  const hash = createHash('sha256');

  function addToHash(value: any) {
    if (typeof value === 'object') {
      if (value == null) {
        addToHash('null');
      } else if (Array.isArray(value)) {
        value.forEach(addToHash);
      } else {
        Object.keys(value).sort().forEach(key => {
          hash.update(key);
          addToHash(value[key]);
        });
      }
    } else {
      hash.update(typeof value + value.toString());
    }
  }

  const { Metadata, ...rest } = obj;
  addToHash(rest);

  return hash.digest('hex');
}

function difference<A>(xs: Set<A>, ys: Set<A>): Set<A> {
  return new Set([...xs].filter(x => !ys.has(x)));
}
