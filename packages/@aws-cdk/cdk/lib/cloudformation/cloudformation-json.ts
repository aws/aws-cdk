import { resolve, Token } from "../core/tokens";
import { CloudFormationToken, isIntrinsic } from "./cloudformation-token";

/**
 * Class for JSON routines that are framework-aware
 */
export class CloudFormationJSON {
    /**
     * Turn an arbitrary structure potentially containing Tokens into JSON.
     */
    public static stringify(obj: any): any {
        return new Token(() => {
            // Resolve inner value so that if they evaluate to literals, we maintain the type.
            //
            // Then replace intrinsics with a special sublcass of Token that overrides toJSON() to
            // and deep-escapes the intrinsic, so if we resolve() the strings again it evaluates
            // to the right string.
            const resolved = resolve(obj);

            // We can just directly return this value, since resolve() will be called
            // on our return value anyway.
            return JSON.stringify(deepReplaceIntrinsics(resolved));
        });

        /**
         * Recurse into a structure, replace all intrinsics with
         */
        function deepReplaceIntrinsics(x: any): any {
            if (isIntrinsic(x)) {
                return wrapIntrinsic(x);
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

        function wrapIntrinsic(intrinsic: any): IntrinsicToken {
            return new IntrinsicToken(() => deepQuoteStringsForJSON(intrinsic));
        }
    }
}

class IntrinsicToken extends CloudFormationToken {
    /**
     * Special handler that gets called when JSON.stringify() is used.
     */
    public toJSON() {
        return this.toString();
    }
}

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