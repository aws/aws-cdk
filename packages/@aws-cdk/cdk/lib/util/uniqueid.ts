// tslint:disable-next-line:no-var-requires
const md5 = require('./md5');

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

/**
 * Given a set of named path components, returns a unique alpha-numeric identifier
 * with a maximum length of 255. This is done by calculating a hash on the full path
 * and using it as a suffix of a length-limited "human" rendition of the path components.
 *
 * @param components The path components
 */
export function makeUniqueId(components: string[]) {
    components = components.filter(x => x !== HIDDEN_ID);

    if (components.length === 0) {
        throw new Error('Unable to calculate a unique ID for an empty path');
    }

    // top-level resources will simply use the `name` as-is in order to support
    // transparent migration of cloudformation templates to the CDK without the
    // need to rename all resources.
    if (components.length === 1) {
        return components[0];
    }

    const hash = pathHash(components);
    const human = removeDupes(components)
        .map(removeNonAlpha)
        .filter(x => x !== HIDDEN_FROM_HUMAN_ID)
        .join('')
        .slice(0, MAX_HUMAN_LEN);

    return human + hash;
}

/**
 * Take a hash of the given path.
 *
 * The hash is limited in size.
 */
function pathHash(path: string[]): string {
    return md5(path.join(PATH_SEP)).slice(0, HASH_LEN).toUpperCase();
}

/**
 * Removes all non-alphanumeric characters in a string.
 */
function removeNonAlpha(s: string) {
    return s.replace(/[^A-Za-z0-9]/g, '');
}

/**
 * Remove duplicate "terms" from the path list
 *
 * If a component name is completely the same as the suffix of
 * the previous component name, we get rid of it.
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
