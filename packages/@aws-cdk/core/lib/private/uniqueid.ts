import * as crypto from 'crypto';
import { unresolved } from './encoding';

/**
 * Resources with this ID are hidden from humans
 *
 * They do not appear in the human-readable part of the logical ID,
 * but they are included in the hash calculation.
 */
const HIDDEN_FROM_HUMAN_ID = 'Resource';

/**
 * Resources with this ID are complete hidden from the logical ID calculation.
 */
const HIDDEN_ID = 'Default';

const PATH_SEP = '/';

const HASH_LEN = 8;
const MAX_HUMAN_LEN = 240; // max ID len is 255
const MAX_ID_LEN = 255;

function findLongestDuplicatedSubstring(str: string) {
  let j = 1;
  let start = 0;
  let end = -1;

  for (let i = 0; i < str.length; i++) {
    let longest = str.slice(i, i + j);
    const rest = str.slice(i+1);

    while (rest.includes(longest)) {
      j += 1;
      longest = str.slice(i, i+j);
      start = i;
      end = i + j - 1;
    }
  }

  return {
    start,
    end,
  };
}

/**
 * Calculates a unique ID for a set of textual components.
 *
 * This is done by calculating a hash on the full path and using it as a suffix
 * of a length-limited "human" rendition of the path components.
 *
 * @param components The path components
 * @param maxLength The maximum length of the return value
 * @returns a unique alpha-numeric identifier with a maximum length of 255 or the maxLength parameter
 */
export function makeUniqueId(components: string[], maxLength?: number) {
  components = components.filter(x => x !== HIDDEN_ID);

  if (components.length === 0) {
    throw new Error('Unable to calculate a unique id for an empty set of components');
  }

  // Lazy require in order to break a module dependency cycle
  const unresolvedTokens = components.filter(c => unresolved(c));
  if (unresolvedTokens.length > 0) {
    throw new Error(`ID components may not include unresolved tokens: ${unresolvedTokens.join(',')}`);
  }

  // top-level resources will simply use the `name` as-is in order to support
  // transparent migration of cloudformation templates to the CDK without the
  // need to rename all resources.
  if (components.length === 1) {
    // we filter out non-alpha characters but that is actually a bad idea
    // because it could create conflicts ("A-B" and "AB" will render the same
    // logical ID). sadly, changing it in the 1.x version line is impossible
    // because it will be a breaking change. we should consider for v2.0.
    // https://github.com/aws/aws-cdk/issues/6421
    const candidate = removeNonAlphanumeric(components[0]);

    // if our candidate is short enough, use it as is. otherwise, fall back to
    // the normal mode.
    if (candidate.length <= MAX_ID_LEN) {
      return candidate;
    }
  }

  const hash = pathHash(components);
  let human = removeDupes(components)
    .filter(x => x !== HIDDEN_FROM_HUMAN_ID)
    .map(removeNonAlphanumeric)
    .join('')
    .slice(0, MAX_HUMAN_LEN);

  if (maxLength && human.length + hash.length > maxLength) {
    const indices = findLongestDuplicatedSubstring(human);
    if (indices.end > -1) {
      human = human.slice(0, indices.start) + human.slice(indices.end);
      if (human.length + hash.length <= maxLength) {
        return human + hash;
      }
    }

    return human.slice(0, maxLength - hash.length) + hash;
  }

  return human + hash;
}

/**
 * Take a hash of the given path.
 *
 * The hash is limited in size.
 */
function pathHash(path: string[]): string {
  const md5 = crypto.createHash('md5').update(path.join(PATH_SEP)).digest('hex');
  return md5.slice(0, HASH_LEN).toUpperCase();
}

/**
 * Removes all non-alphanumeric characters in a string.
 */
function removeNonAlphanumeric(s: string) {
  return s.replace(/[^A-Za-z0-9]/g, '');
}

/**
 * Remove duplicate "terms" from the path list
 *
 * If the previous path component name ends with this component name, skip the
 * current component.
 */
function removeDupes(path: string[]): string[] {
  const ret = new Array<string>();

  for (const component of path) {
    if (ret.length === 0 || !ret[ret.length - 1].endsWith(component)) {
      ret.push(component);
    }
  }

  return ret;
}
