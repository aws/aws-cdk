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

/**
 * Chcecks whether there has been any renaming and returns the corresponding
 * pairs.
 * TODO explain this better.
 */
export function checkRenaming(m1: any, m2: any): ResourceCorrespondence {
  return correspondence(index(m1), index(m2));
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
  const result: [Set<string>, Set<string>] = [new Set(), new Set()];

  // TODO remove duplication
  s0.forEach((s) => {
    if (!s1.has(s)) {
      result[0].add(s);
    }
  });

  s1.forEach((s) => {
    if (!s0.has(s)) {
      result[1].add(s);
    }
  });

  return result;
}

function hashObject(obj: any): string {
  const hash = createHash('sha256');

  function addToHash(value: any) {
    if (typeof value === 'object') {
      if (Array.isArray(value)) {
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

  if (obj.Metadata != null) {
    delete obj.Metadata;
  }
  addToHash(obj);
  return hash.digest('hex');
}
