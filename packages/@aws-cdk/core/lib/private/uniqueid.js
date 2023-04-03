"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeUniqueId = void 0;
const encoding_1 = require("./encoding");
const md5_1 = require("./md5");
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
/**
 * Calculates a unique ID for a set of textual components.
 *
 * This is done by calculating a hash on the full path and using it as a suffix
 * of a length-limited "human" rendition of the path components.
 *
 * @param components The path components
 * @returns a unique alpha-numeric identifier with a maximum length of 255
 */
function makeUniqueId(components) {
    components = components.filter(x => x !== HIDDEN_ID);
    if (components.length === 0) {
        throw new Error('Unable to calculate a unique id for an empty set of components');
    }
    // Lazy require in order to break a module dependency cycle
    const unresolvedTokens = components.filter(c => encoding_1.unresolved(c));
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
    const human = removeDupes(components)
        .filter(x => x !== HIDDEN_FROM_HUMAN_ID)
        .map(removeNonAlphanumeric)
        .join('')
        .slice(0, MAX_HUMAN_LEN);
    return human + hash;
}
exports.makeUniqueId = makeUniqueId;
/**
 * Take a hash of the given path.
 *
 * The hash is limited in size.
 */
function pathHash(path) {
    const md5 = md5_1.md5hash(path.join(PATH_SEP));
    return md5.slice(0, HASH_LEN).toUpperCase();
}
/**
 * Removes all non-alphanumeric characters in a string.
 */
function removeNonAlphanumeric(s) {
    return s.replace(/[^A-Za-z0-9]/g, '');
}
/**
 * Remove duplicate "terms" from the path list
 *
 * If the previous path component name ends with this component name, skip the
 * current component.
 */
function removeDupes(path) {
    const ret = new Array();
    for (const component of path) {
        if (ret.length === 0 || !ret[ret.length - 1].endsWith(component)) {
            ret.push(component);
        }
    }
    return ret;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidW5pcXVlaWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ1bmlxdWVpZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSx5Q0FBd0M7QUFDeEMsK0JBQWdDO0FBRWhDOzs7OztHQUtHO0FBQ0gsTUFBTSxvQkFBb0IsR0FBRyxVQUFVLENBQUM7QUFFeEM7O0dBRUc7QUFDSCxNQUFNLFNBQVMsR0FBRyxTQUFTLENBQUM7QUFFNUIsTUFBTSxRQUFRLEdBQUcsR0FBRyxDQUFDO0FBRXJCLE1BQU0sUUFBUSxHQUFHLENBQUMsQ0FBQztBQUNuQixNQUFNLGFBQWEsR0FBRyxHQUFHLENBQUMsQ0FBQyxvQkFBb0I7QUFDL0MsTUFBTSxVQUFVLEdBQUcsR0FBRyxDQUFDO0FBRXZCOzs7Ozs7OztHQVFHO0FBQ0gsU0FBZ0IsWUFBWSxDQUFDLFVBQW9CO0lBQy9DLFVBQVUsR0FBRyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxLQUFLLFNBQVMsQ0FBQyxDQUFDO0lBRXJELElBQUksVUFBVSxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7UUFDM0IsTUFBTSxJQUFJLEtBQUssQ0FBQyxnRUFBZ0UsQ0FBQyxDQUFDO0tBQ25GO0lBRUQsMkRBQTJEO0lBQzNELE1BQU0sZ0JBQWdCLEdBQUcsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLHFCQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUMvRCxJQUFJLGdCQUFnQixDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7UUFDL0IsTUFBTSxJQUFJLEtBQUssQ0FBQyxvREFBb0QsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQztLQUNuRztJQUVELDJFQUEyRTtJQUMzRSwyRUFBMkU7SUFDM0UsZ0NBQWdDO0lBQ2hDLElBQUksVUFBVSxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7UUFDM0IscUVBQXFFO1FBQ3JFLHlFQUF5RTtRQUN6RSx3RUFBd0U7UUFDeEUscUVBQXFFO1FBQ3JFLDZDQUE2QztRQUM3QyxNQUFNLFNBQVMsR0FBRyxxQkFBcUIsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUV2RCwwRUFBMEU7UUFDMUUsbUJBQW1CO1FBQ25CLElBQUksU0FBUyxDQUFDLE1BQU0sSUFBSSxVQUFVLEVBQUU7WUFDbEMsT0FBTyxTQUFTLENBQUM7U0FDbEI7S0FDRjtJQUVELE1BQU0sSUFBSSxHQUFHLFFBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUNsQyxNQUFNLEtBQUssR0FBRyxXQUFXLENBQUMsVUFBVSxDQUFDO1NBQ2xDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsS0FBSyxvQkFBb0IsQ0FBQztTQUN2QyxHQUFHLENBQUMscUJBQXFCLENBQUM7U0FDMUIsSUFBSSxDQUFDLEVBQUUsQ0FBQztTQUNSLEtBQUssQ0FBQyxDQUFDLEVBQUUsYUFBYSxDQUFDLENBQUM7SUFFM0IsT0FBTyxLQUFLLEdBQUcsSUFBSSxDQUFDO0FBQ3RCLENBQUM7QUF2Q0Qsb0NBdUNDO0FBRUQ7Ozs7R0FJRztBQUNILFNBQVMsUUFBUSxDQUFDLElBQWM7SUFDOUIsTUFBTSxHQUFHLEdBQUcsYUFBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztJQUN6QyxPQUFPLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDO0FBQzlDLENBQUM7QUFFRDs7R0FFRztBQUNILFNBQVMscUJBQXFCLENBQUMsQ0FBUztJQUN0QyxPQUFPLENBQUMsQ0FBQyxPQUFPLENBQUMsZUFBZSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0FBQ3hDLENBQUM7QUFFRDs7Ozs7R0FLRztBQUNILFNBQVMsV0FBVyxDQUFDLElBQWM7SUFDakMsTUFBTSxHQUFHLEdBQUcsSUFBSSxLQUFLLEVBQVUsQ0FBQztJQUVoQyxLQUFLLE1BQU0sU0FBUyxJQUFJLElBQUksRUFBRTtRQUM1QixJQUFJLEdBQUcsQ0FBQyxNQUFNLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxFQUFFO1lBQ2hFLEdBQUcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7U0FDckI7S0FDRjtJQUVELE9BQU8sR0FBRyxDQUFDO0FBQ2IsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHVucmVzb2x2ZWQgfSBmcm9tICcuL2VuY29kaW5nJztcbmltcG9ydCB7IG1kNWhhc2ggfSBmcm9tICcuL21kNSc7XG5cbi8qKlxuICogUmVzb3VyY2VzIHdpdGggdGhpcyBJRCBhcmUgaGlkZGVuIGZyb20gaHVtYW5zXG4gKlxuICogVGhleSBkbyBub3QgYXBwZWFyIGluIHRoZSBodW1hbi1yZWFkYWJsZSBwYXJ0IG9mIHRoZSBsb2dpY2FsIElELFxuICogYnV0IHRoZXkgYXJlIGluY2x1ZGVkIGluIHRoZSBoYXNoIGNhbGN1bGF0aW9uLlxuICovXG5jb25zdCBISURERU5fRlJPTV9IVU1BTl9JRCA9ICdSZXNvdXJjZSc7XG5cbi8qKlxuICogUmVzb3VyY2VzIHdpdGggdGhpcyBJRCBhcmUgY29tcGxldGUgaGlkZGVuIGZyb20gdGhlIGxvZ2ljYWwgSUQgY2FsY3VsYXRpb24uXG4gKi9cbmNvbnN0IEhJRERFTl9JRCA9ICdEZWZhdWx0JztcblxuY29uc3QgUEFUSF9TRVAgPSAnLyc7XG5cbmNvbnN0IEhBU0hfTEVOID0gODtcbmNvbnN0IE1BWF9IVU1BTl9MRU4gPSAyNDA7IC8vIG1heCBJRCBsZW4gaXMgMjU1XG5jb25zdCBNQVhfSURfTEVOID0gMjU1O1xuXG4vKipcbiAqIENhbGN1bGF0ZXMgYSB1bmlxdWUgSUQgZm9yIGEgc2V0IG9mIHRleHR1YWwgY29tcG9uZW50cy5cbiAqXG4gKiBUaGlzIGlzIGRvbmUgYnkgY2FsY3VsYXRpbmcgYSBoYXNoIG9uIHRoZSBmdWxsIHBhdGggYW5kIHVzaW5nIGl0IGFzIGEgc3VmZml4XG4gKiBvZiBhIGxlbmd0aC1saW1pdGVkIFwiaHVtYW5cIiByZW5kaXRpb24gb2YgdGhlIHBhdGggY29tcG9uZW50cy5cbiAqXG4gKiBAcGFyYW0gY29tcG9uZW50cyBUaGUgcGF0aCBjb21wb25lbnRzXG4gKiBAcmV0dXJucyBhIHVuaXF1ZSBhbHBoYS1udW1lcmljIGlkZW50aWZpZXIgd2l0aCBhIG1heGltdW0gbGVuZ3RoIG9mIDI1NVxuICovXG5leHBvcnQgZnVuY3Rpb24gbWFrZVVuaXF1ZUlkKGNvbXBvbmVudHM6IHN0cmluZ1tdKSB7XG4gIGNvbXBvbmVudHMgPSBjb21wb25lbnRzLmZpbHRlcih4ID0+IHggIT09IEhJRERFTl9JRCk7XG5cbiAgaWYgKGNvbXBvbmVudHMubGVuZ3RoID09PSAwKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdVbmFibGUgdG8gY2FsY3VsYXRlIGEgdW5pcXVlIGlkIGZvciBhbiBlbXB0eSBzZXQgb2YgY29tcG9uZW50cycpO1xuICB9XG5cbiAgLy8gTGF6eSByZXF1aXJlIGluIG9yZGVyIHRvIGJyZWFrIGEgbW9kdWxlIGRlcGVuZGVuY3kgY3ljbGVcbiAgY29uc3QgdW5yZXNvbHZlZFRva2VucyA9IGNvbXBvbmVudHMuZmlsdGVyKGMgPT4gdW5yZXNvbHZlZChjKSk7XG4gIGlmICh1bnJlc29sdmVkVG9rZW5zLmxlbmd0aCA+IDApIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYElEIGNvbXBvbmVudHMgbWF5IG5vdCBpbmNsdWRlIHVucmVzb2x2ZWQgdG9rZW5zOiAke3VucmVzb2x2ZWRUb2tlbnMuam9pbignLCcpfWApO1xuICB9XG5cbiAgLy8gdG9wLWxldmVsIHJlc291cmNlcyB3aWxsIHNpbXBseSB1c2UgdGhlIGBuYW1lYCBhcy1pcyBpbiBvcmRlciB0byBzdXBwb3J0XG4gIC8vIHRyYW5zcGFyZW50IG1pZ3JhdGlvbiBvZiBjbG91ZGZvcm1hdGlvbiB0ZW1wbGF0ZXMgdG8gdGhlIENESyB3aXRob3V0IHRoZVxuICAvLyBuZWVkIHRvIHJlbmFtZSBhbGwgcmVzb3VyY2VzLlxuICBpZiAoY29tcG9uZW50cy5sZW5ndGggPT09IDEpIHtcbiAgICAvLyB3ZSBmaWx0ZXIgb3V0IG5vbi1hbHBoYSBjaGFyYWN0ZXJzIGJ1dCB0aGF0IGlzIGFjdHVhbGx5IGEgYmFkIGlkZWFcbiAgICAvLyBiZWNhdXNlIGl0IGNvdWxkIGNyZWF0ZSBjb25mbGljdHMgKFwiQS1CXCIgYW5kIFwiQUJcIiB3aWxsIHJlbmRlciB0aGUgc2FtZVxuICAgIC8vIGxvZ2ljYWwgSUQpLiBzYWRseSwgY2hhbmdpbmcgaXQgaW4gdGhlIDEueCB2ZXJzaW9uIGxpbmUgaXMgaW1wb3NzaWJsZVxuICAgIC8vIGJlY2F1c2UgaXQgd2lsbCBiZSBhIGJyZWFraW5nIGNoYW5nZS4gd2Ugc2hvdWxkIGNvbnNpZGVyIGZvciB2Mi4wLlxuICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9hd3MvYXdzLWNkay9pc3N1ZXMvNjQyMVxuICAgIGNvbnN0IGNhbmRpZGF0ZSA9IHJlbW92ZU5vbkFscGhhbnVtZXJpYyhjb21wb25lbnRzWzBdKTtcblxuICAgIC8vIGlmIG91ciBjYW5kaWRhdGUgaXMgc2hvcnQgZW5vdWdoLCB1c2UgaXQgYXMgaXMuIG90aGVyd2lzZSwgZmFsbCBiYWNrIHRvXG4gICAgLy8gdGhlIG5vcm1hbCBtb2RlLlxuICAgIGlmIChjYW5kaWRhdGUubGVuZ3RoIDw9IE1BWF9JRF9MRU4pIHtcbiAgICAgIHJldHVybiBjYW5kaWRhdGU7XG4gICAgfVxuICB9XG5cbiAgY29uc3QgaGFzaCA9IHBhdGhIYXNoKGNvbXBvbmVudHMpO1xuICBjb25zdCBodW1hbiA9IHJlbW92ZUR1cGVzKGNvbXBvbmVudHMpXG4gICAgLmZpbHRlcih4ID0+IHggIT09IEhJRERFTl9GUk9NX0hVTUFOX0lEKVxuICAgIC5tYXAocmVtb3ZlTm9uQWxwaGFudW1lcmljKVxuICAgIC5qb2luKCcnKVxuICAgIC5zbGljZSgwLCBNQVhfSFVNQU5fTEVOKTtcblxuICByZXR1cm4gaHVtYW4gKyBoYXNoO1xufVxuXG4vKipcbiAqIFRha2UgYSBoYXNoIG9mIHRoZSBnaXZlbiBwYXRoLlxuICpcbiAqIFRoZSBoYXNoIGlzIGxpbWl0ZWQgaW4gc2l6ZS5cbiAqL1xuZnVuY3Rpb24gcGF0aEhhc2gocGF0aDogc3RyaW5nW10pOiBzdHJpbmcge1xuICBjb25zdCBtZDUgPSBtZDVoYXNoKHBhdGguam9pbihQQVRIX1NFUCkpO1xuICByZXR1cm4gbWQ1LnNsaWNlKDAsIEhBU0hfTEVOKS50b1VwcGVyQ2FzZSgpO1xufVxuXG4vKipcbiAqIFJlbW92ZXMgYWxsIG5vbi1hbHBoYW51bWVyaWMgY2hhcmFjdGVycyBpbiBhIHN0cmluZy5cbiAqL1xuZnVuY3Rpb24gcmVtb3ZlTm9uQWxwaGFudW1lcmljKHM6IHN0cmluZykge1xuICByZXR1cm4gcy5yZXBsYWNlKC9bXkEtWmEtejAtOV0vZywgJycpO1xufVxuXG4vKipcbiAqIFJlbW92ZSBkdXBsaWNhdGUgXCJ0ZXJtc1wiIGZyb20gdGhlIHBhdGggbGlzdFxuICpcbiAqIElmIHRoZSBwcmV2aW91cyBwYXRoIGNvbXBvbmVudCBuYW1lIGVuZHMgd2l0aCB0aGlzIGNvbXBvbmVudCBuYW1lLCBza2lwIHRoZVxuICogY3VycmVudCBjb21wb25lbnQuXG4gKi9cbmZ1bmN0aW9uIHJlbW92ZUR1cGVzKHBhdGg6IHN0cmluZ1tdKTogc3RyaW5nW10ge1xuICBjb25zdCByZXQgPSBuZXcgQXJyYXk8c3RyaW5nPigpO1xuXG4gIGZvciAoY29uc3QgY29tcG9uZW50IG9mIHBhdGgpIHtcbiAgICBpZiAocmV0Lmxlbmd0aCA9PT0gMCB8fCAhcmV0W3JldC5sZW5ndGggLSAxXS5lbmRzV2l0aChjb21wb25lbnQpKSB7XG4gICAgICByZXQucHVzaChjb21wb25lbnQpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiByZXQ7XG59XG4iXX0=