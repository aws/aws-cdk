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
    const unresolvedTokens = components.filter(c => (0, encoding_1.unresolved)(c));
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
    const md5 = (0, md5_1.md5hash)(path.join(PATH_SEP));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidW5pcXVlaWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ1bmlxdWVpZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSx5Q0FBd0M7QUFDeEMsK0JBQWdDO0FBRWhDOzs7OztHQUtHO0FBQ0gsTUFBTSxvQkFBb0IsR0FBRyxVQUFVLENBQUM7QUFFeEM7O0dBRUc7QUFDSCxNQUFNLFNBQVMsR0FBRyxTQUFTLENBQUM7QUFFNUIsTUFBTSxRQUFRLEdBQUcsR0FBRyxDQUFDO0FBRXJCLE1BQU0sUUFBUSxHQUFHLENBQUMsQ0FBQztBQUNuQixNQUFNLGFBQWEsR0FBRyxHQUFHLENBQUMsQ0FBQyxvQkFBb0I7QUFDL0MsTUFBTSxVQUFVLEdBQUcsR0FBRyxDQUFDO0FBRXZCOzs7Ozs7OztHQVFHO0FBQ0gsU0FBZ0IsWUFBWSxDQUFDLFVBQW9CO0lBQy9DLFVBQVUsR0FBRyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxLQUFLLFNBQVMsQ0FBQyxDQUFDO0lBRXJELElBQUksVUFBVSxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7UUFDM0IsTUFBTSxJQUFJLEtBQUssQ0FBQyxnRUFBZ0UsQ0FBQyxDQUFDO0tBQ25GO0lBRUQsMkRBQTJEO0lBQzNELE1BQU0sZ0JBQWdCLEdBQUcsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUEscUJBQVUsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQy9ELElBQUksZ0JBQWdCLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtRQUMvQixNQUFNLElBQUksS0FBSyxDQUFDLG9EQUFvRCxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0tBQ25HO0lBRUQsMkVBQTJFO0lBQzNFLDJFQUEyRTtJQUMzRSxnQ0FBZ0M7SUFDaEMsSUFBSSxVQUFVLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtRQUMzQixxRUFBcUU7UUFDckUseUVBQXlFO1FBQ3pFLHdFQUF3RTtRQUN4RSxxRUFBcUU7UUFDckUsNkNBQTZDO1FBQzdDLE1BQU0sU0FBUyxHQUFHLHFCQUFxQixDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRXZELDBFQUEwRTtRQUMxRSxtQkFBbUI7UUFDbkIsSUFBSSxTQUFTLENBQUMsTUFBTSxJQUFJLFVBQVUsRUFBRTtZQUNsQyxPQUFPLFNBQVMsQ0FBQztTQUNsQjtLQUNGO0lBRUQsTUFBTSxJQUFJLEdBQUcsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQ2xDLE1BQU0sS0FBSyxHQUFHLFdBQVcsQ0FBQyxVQUFVLENBQUM7U0FDbEMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxLQUFLLG9CQUFvQixDQUFDO1NBQ3ZDLEdBQUcsQ0FBQyxxQkFBcUIsQ0FBQztTQUMxQixJQUFJLENBQUMsRUFBRSxDQUFDO1NBQ1IsS0FBSyxDQUFDLENBQUMsRUFBRSxhQUFhLENBQUMsQ0FBQztJQUUzQixPQUFPLEtBQUssR0FBRyxJQUFJLENBQUM7QUFDdEIsQ0FBQztBQXZDRCxvQ0F1Q0M7QUFFRDs7OztHQUlHO0FBQ0gsU0FBUyxRQUFRLENBQUMsSUFBYztJQUM5QixNQUFNLEdBQUcsR0FBRyxJQUFBLGFBQU8sRUFBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7SUFDekMsT0FBTyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQztBQUM5QyxDQUFDO0FBRUQ7O0dBRUc7QUFDSCxTQUFTLHFCQUFxQixDQUFDLENBQVM7SUFDdEMsT0FBTyxDQUFDLENBQUMsT0FBTyxDQUFDLGVBQWUsRUFBRSxFQUFFLENBQUMsQ0FBQztBQUN4QyxDQUFDO0FBRUQ7Ozs7O0dBS0c7QUFDSCxTQUFTLFdBQVcsQ0FBQyxJQUFjO0lBQ2pDLE1BQU0sR0FBRyxHQUFHLElBQUksS0FBSyxFQUFVLENBQUM7SUFFaEMsS0FBSyxNQUFNLFNBQVMsSUFBSSxJQUFJLEVBQUU7UUFDNUIsSUFBSSxHQUFHLENBQUMsTUFBTSxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsRUFBRTtZQUNoRSxHQUFHLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1NBQ3JCO0tBQ0Y7SUFFRCxPQUFPLEdBQUcsQ0FBQztBQUNiLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyB1bnJlc29sdmVkIH0gZnJvbSAnLi9lbmNvZGluZyc7XG5pbXBvcnQgeyBtZDVoYXNoIH0gZnJvbSAnLi9tZDUnO1xuXG4vKipcbiAqIFJlc291cmNlcyB3aXRoIHRoaXMgSUQgYXJlIGhpZGRlbiBmcm9tIGh1bWFuc1xuICpcbiAqIFRoZXkgZG8gbm90IGFwcGVhciBpbiB0aGUgaHVtYW4tcmVhZGFibGUgcGFydCBvZiB0aGUgbG9naWNhbCBJRCxcbiAqIGJ1dCB0aGV5IGFyZSBpbmNsdWRlZCBpbiB0aGUgaGFzaCBjYWxjdWxhdGlvbi5cbiAqL1xuY29uc3QgSElEREVOX0ZST01fSFVNQU5fSUQgPSAnUmVzb3VyY2UnO1xuXG4vKipcbiAqIFJlc291cmNlcyB3aXRoIHRoaXMgSUQgYXJlIGNvbXBsZXRlIGhpZGRlbiBmcm9tIHRoZSBsb2dpY2FsIElEIGNhbGN1bGF0aW9uLlxuICovXG5jb25zdCBISURERU5fSUQgPSAnRGVmYXVsdCc7XG5cbmNvbnN0IFBBVEhfU0VQID0gJy8nO1xuXG5jb25zdCBIQVNIX0xFTiA9IDg7XG5jb25zdCBNQVhfSFVNQU5fTEVOID0gMjQwOyAvLyBtYXggSUQgbGVuIGlzIDI1NVxuY29uc3QgTUFYX0lEX0xFTiA9IDI1NTtcblxuLyoqXG4gKiBDYWxjdWxhdGVzIGEgdW5pcXVlIElEIGZvciBhIHNldCBvZiB0ZXh0dWFsIGNvbXBvbmVudHMuXG4gKlxuICogVGhpcyBpcyBkb25lIGJ5IGNhbGN1bGF0aW5nIGEgaGFzaCBvbiB0aGUgZnVsbCBwYXRoIGFuZCB1c2luZyBpdCBhcyBhIHN1ZmZpeFxuICogb2YgYSBsZW5ndGgtbGltaXRlZCBcImh1bWFuXCIgcmVuZGl0aW9uIG9mIHRoZSBwYXRoIGNvbXBvbmVudHMuXG4gKlxuICogQHBhcmFtIGNvbXBvbmVudHMgVGhlIHBhdGggY29tcG9uZW50c1xuICogQHJldHVybnMgYSB1bmlxdWUgYWxwaGEtbnVtZXJpYyBpZGVudGlmaWVyIHdpdGggYSBtYXhpbXVtIGxlbmd0aCBvZiAyNTVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG1ha2VVbmlxdWVJZChjb21wb25lbnRzOiBzdHJpbmdbXSkge1xuICBjb21wb25lbnRzID0gY29tcG9uZW50cy5maWx0ZXIoeCA9PiB4ICE9PSBISURERU5fSUQpO1xuXG4gIGlmIChjb21wb25lbnRzLmxlbmd0aCA9PT0gMCkge1xuICAgIHRocm93IG5ldyBFcnJvcignVW5hYmxlIHRvIGNhbGN1bGF0ZSBhIHVuaXF1ZSBpZCBmb3IgYW4gZW1wdHkgc2V0IG9mIGNvbXBvbmVudHMnKTtcbiAgfVxuXG4gIC8vIExhenkgcmVxdWlyZSBpbiBvcmRlciB0byBicmVhayBhIG1vZHVsZSBkZXBlbmRlbmN5IGN5Y2xlXG4gIGNvbnN0IHVucmVzb2x2ZWRUb2tlbnMgPSBjb21wb25lbnRzLmZpbHRlcihjID0+IHVucmVzb2x2ZWQoYykpO1xuICBpZiAodW5yZXNvbHZlZFRva2Vucy5sZW5ndGggPiAwKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBJRCBjb21wb25lbnRzIG1heSBub3QgaW5jbHVkZSB1bnJlc29sdmVkIHRva2VuczogJHt1bnJlc29sdmVkVG9rZW5zLmpvaW4oJywnKX1gKTtcbiAgfVxuXG4gIC8vIHRvcC1sZXZlbCByZXNvdXJjZXMgd2lsbCBzaW1wbHkgdXNlIHRoZSBgbmFtZWAgYXMtaXMgaW4gb3JkZXIgdG8gc3VwcG9ydFxuICAvLyB0cmFuc3BhcmVudCBtaWdyYXRpb24gb2YgY2xvdWRmb3JtYXRpb24gdGVtcGxhdGVzIHRvIHRoZSBDREsgd2l0aG91dCB0aGVcbiAgLy8gbmVlZCB0byByZW5hbWUgYWxsIHJlc291cmNlcy5cbiAgaWYgKGNvbXBvbmVudHMubGVuZ3RoID09PSAxKSB7XG4gICAgLy8gd2UgZmlsdGVyIG91dCBub24tYWxwaGEgY2hhcmFjdGVycyBidXQgdGhhdCBpcyBhY3R1YWxseSBhIGJhZCBpZGVhXG4gICAgLy8gYmVjYXVzZSBpdCBjb3VsZCBjcmVhdGUgY29uZmxpY3RzIChcIkEtQlwiIGFuZCBcIkFCXCIgd2lsbCByZW5kZXIgdGhlIHNhbWVcbiAgICAvLyBsb2dpY2FsIElEKS4gc2FkbHksIGNoYW5naW5nIGl0IGluIHRoZSAxLnggdmVyc2lvbiBsaW5lIGlzIGltcG9zc2libGVcbiAgICAvLyBiZWNhdXNlIGl0IHdpbGwgYmUgYSBicmVha2luZyBjaGFuZ2UuIHdlIHNob3VsZCBjb25zaWRlciBmb3IgdjIuMC5cbiAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vYXdzL2F3cy1jZGsvaXNzdWVzLzY0MjFcbiAgICBjb25zdCBjYW5kaWRhdGUgPSByZW1vdmVOb25BbHBoYW51bWVyaWMoY29tcG9uZW50c1swXSk7XG5cbiAgICAvLyBpZiBvdXIgY2FuZGlkYXRlIGlzIHNob3J0IGVub3VnaCwgdXNlIGl0IGFzIGlzLiBvdGhlcndpc2UsIGZhbGwgYmFjayB0b1xuICAgIC8vIHRoZSBub3JtYWwgbW9kZS5cbiAgICBpZiAoY2FuZGlkYXRlLmxlbmd0aCA8PSBNQVhfSURfTEVOKSB7XG4gICAgICByZXR1cm4gY2FuZGlkYXRlO1xuICAgIH1cbiAgfVxuXG4gIGNvbnN0IGhhc2ggPSBwYXRoSGFzaChjb21wb25lbnRzKTtcbiAgY29uc3QgaHVtYW4gPSByZW1vdmVEdXBlcyhjb21wb25lbnRzKVxuICAgIC5maWx0ZXIoeCA9PiB4ICE9PSBISURERU5fRlJPTV9IVU1BTl9JRClcbiAgICAubWFwKHJlbW92ZU5vbkFscGhhbnVtZXJpYylcbiAgICAuam9pbignJylcbiAgICAuc2xpY2UoMCwgTUFYX0hVTUFOX0xFTik7XG5cbiAgcmV0dXJuIGh1bWFuICsgaGFzaDtcbn1cblxuLyoqXG4gKiBUYWtlIGEgaGFzaCBvZiB0aGUgZ2l2ZW4gcGF0aC5cbiAqXG4gKiBUaGUgaGFzaCBpcyBsaW1pdGVkIGluIHNpemUuXG4gKi9cbmZ1bmN0aW9uIHBhdGhIYXNoKHBhdGg6IHN0cmluZ1tdKTogc3RyaW5nIHtcbiAgY29uc3QgbWQ1ID0gbWQ1aGFzaChwYXRoLmpvaW4oUEFUSF9TRVApKTtcbiAgcmV0dXJuIG1kNS5zbGljZSgwLCBIQVNIX0xFTikudG9VcHBlckNhc2UoKTtcbn1cblxuLyoqXG4gKiBSZW1vdmVzIGFsbCBub24tYWxwaGFudW1lcmljIGNoYXJhY3RlcnMgaW4gYSBzdHJpbmcuXG4gKi9cbmZ1bmN0aW9uIHJlbW92ZU5vbkFscGhhbnVtZXJpYyhzOiBzdHJpbmcpIHtcbiAgcmV0dXJuIHMucmVwbGFjZSgvW15BLVphLXowLTldL2csICcnKTtcbn1cblxuLyoqXG4gKiBSZW1vdmUgZHVwbGljYXRlIFwidGVybXNcIiBmcm9tIHRoZSBwYXRoIGxpc3RcbiAqXG4gKiBJZiB0aGUgcHJldmlvdXMgcGF0aCBjb21wb25lbnQgbmFtZSBlbmRzIHdpdGggdGhpcyBjb21wb25lbnQgbmFtZSwgc2tpcCB0aGVcbiAqIGN1cnJlbnQgY29tcG9uZW50LlxuICovXG5mdW5jdGlvbiByZW1vdmVEdXBlcyhwYXRoOiBzdHJpbmdbXSk6IHN0cmluZ1tdIHtcbiAgY29uc3QgcmV0ID0gbmV3IEFycmF5PHN0cmluZz4oKTtcblxuICBmb3IgKGNvbnN0IGNvbXBvbmVudCBvZiBwYXRoKSB7XG4gICAgaWYgKHJldC5sZW5ndGggPT09IDAgfHwgIXJldFtyZXQubGVuZ3RoIC0gMV0uZW5kc1dpdGgoY29tcG9uZW50KSkge1xuICAgICAgcmV0LnB1c2goY29tcG9uZW50KTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gcmV0O1xufVxuIl19