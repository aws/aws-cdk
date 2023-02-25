import { md5hash } from './md5';

/**
 * Options for creating a unique resource name.
*/
interface MakeUniqueResourceNameOptions {

  /**
   * The maximum length of the unique resource name.
   *
   * @default - 256
   */
  readonly maxLength?: number;

  /**
   * The separator used between the path components.
   *
   * @default - none
   */
  readonly separator?: string;

  /**
   * Non-alphanumeric characters allowed in the unique resource name.
   *
   * @default - none
   */
  readonly allowedSpecialCharacters?: string;
}

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

const MAX_LEN = 256;

const HASH_LEN = 8;

export function makeUniqueResourceName(components: string[], options: MakeUniqueResourceNameOptions) {
  const maxLength = options.maxLength ?? 256;
  const separator = options.separator ?? '';
  components = components.filter(x => x !== HIDDEN_ID);

  if (components.length === 0) {
    throw new Error('Unable to calculate a unique resource name for an empty set of components');
  }

  // top-level resources will simply use the `name` as-is if the name is also short enough
  // in order to support transparent migration of cloudformation templates to the CDK without the
  // need to rename all resources.
  if (components.length === 1) {
    const topLevelResource = removeNonAllowedSpecialCharacters(components[0], separator, options.allowedSpecialCharacters);

    if (topLevelResource.length <= maxLength) {
      return topLevelResource;
    }
  }

  // Calculate the hash from the full path, included unresolved tokens so the hash value is always unique
  const hash = pathHash(components);
  const human = removeDupes(components)
    .filter(pathElement => pathElement !== HIDDEN_FROM_HUMAN_ID)
    .map(pathElement => removeNonAllowedSpecialCharacters(pathElement, separator, options.allowedSpecialCharacters))
    .filter(pathElement => pathElement)
    .join(separator)
    .concat(separator);

  const maxhumanLength = maxLength - HASH_LEN;
  return human.length > maxhumanLength ? `${splitInMiddle(human, maxhumanLength)}${hash}`: `${human}${hash}`;
}

/**
 * Take a hash of the given path.
 *
 * The hash is limited in size.
 */
function pathHash(path: string[]): string {
  const md5 = md5hash(path.join(PATH_SEP));
  return md5.slice(0, HASH_LEN).toUpperCase();
}

/**
 * Removes all non-allowed special characters in a string.
 */
function removeNonAllowedSpecialCharacters(s: string, _separator: string, allowedSpecialCharacters?: string) {
  const pattern = allowedSpecialCharacters ? `[^A-Za-z0-9${allowedSpecialCharacters}]` : '[^A-Za-z0-9]';
  const regex = new RegExp(pattern, 'g');
  return s.replace(regex, '');
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

function splitInMiddle(s: string, maxLength: number = MAX_LEN - HASH_LEN) {
  const half = maxLength / 2;
  return s.slice(0, half) + s.slice(-half);
}