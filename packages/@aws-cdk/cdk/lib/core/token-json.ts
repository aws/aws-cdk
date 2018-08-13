import { isIntrinsic } from "./engine-intrinsics";
import { ProvisioningEngine } from "./engine-strings";
import { resolve, Token } from "./tokens";
import { resolveMarkerSpans, splitOnMarkers } from "./util";

/**
 * Class for JSON routines that are framework-aware
 */
export class TokenJSON {
    /**
     * Turn an arbitrary structure potentially containing Tokens into JSON.
     */
    public static stringify(obj: any): any {
        let counter: number = 0;
        const allocatedIntrinsics: {[key: string]: JSONIntrinsic} = {};

        return new Token(() => {
            // General strategy: resolve the inner value, replace remaining intrinsics with objects
            // that override toJSON() to return a special marker string, then split on the
            // marker strings and restore the original intrinsics.
            const resolved = resolve(obj);
            const stringified = JSON.stringify(deepReplaceIntrinsics(resolved));
            const spans = splitOnMarkers(stringified, BEGIN_MARKER, "[a-zA-Z0-9.]+", END_MARKER);
            const fragments = resolveMarkerSpans(spans, (id) => {
                return allocatedIntrinsics[id].quotedIntrinsic();
            });
            return ProvisioningEngine.combineStringFragments(fragments);
        });

        /**
         * Recurse into a structure, replace all intrinsics with
         */
        function deepReplaceIntrinsics(x: any): any {
            if (isIntrinsic(x)) {
                return allocateIntrinsic(x);
            }

            if (Array.isArray(x)) {
                return x.map(deepReplaceIntrinsics);
            }

            if (typeof x === 'object') {
                for (const key of Object.keys(x)) {
                    x[key] = deepReplaceIntrinsics(x[key]);
                }
            }

            return x;
        }

        function allocateIntrinsic(intrinsic: any): JSONIntrinsic {
            counter++;
            const key = `INTRINSIC.${counter}`;
            return allocatedIntrinsics[key] = new JSONIntrinsic(key, intrinsic);
        }
    }
}

/**
 * Class to hold intrinsic values, returning special marker values in calling toJSON()
 */
class JSONIntrinsic {
    constructor(private readonly marker: string, private readonly intrinsic: any) {
    }

    /**
     * Return the intrinsic value, quoted for use within JSON context
     *
     * Because we know we're in a JSON context, deep recurse into the strings
     * inside the intrinsic, assume they're display strings, and escape them
     * for use in a JSON context.
     *
     * This is not entirely correct without knowing more about the structure of
     * the intrinsics themselves, but doesn't break as long as they don't
     * contain functional strings that break when passed through escaping.
     */
    public quotedIntrinsic(): any {
        return deepQuoteStringsForJSON(this.intrinsic);
    }

    /**
     * Return a special serialized marker string for this value
     */
    public toJSON(): any {
        return `${BEGIN_MARKER}${this.marker}${END_MARKER}`;
    }
}

const BEGIN_MARKER = "#{Json[";
const END_MARKER = "]}";

/**
 * Deep escape strings for use in a JSON context
 */
function deepQuoteStringsForJSON(x: any): any {
    if (typeof x === 'string') {
        // Whenever we escape a string we strip off the outermost quotes
        // since we're already in a quoted context.
        const stringified = JSON.stringify(x);
        return stringified.substring(1, stringified.length - 1);
    }

    if (Array.isArray(x)) {
        return x.map(deepQuoteStringsForJSON);
    }

    if (typeof x === 'object') {
        for (const key of Object.keys(x)) {
            x[key] = deepQuoteStringsForJSON(x[key]);
        }
    }

    return x;
}