import { resolve, Token } from "../core/tokens";
import { CloudFormationToken, isIntrinsic } from "./cloudformation-token";

/**
 * Class for JSON routines that are framework-aware
 */
export class CloudFormationJSON {
  /**
   * Turn an arbitrary structure potentially containing Tokens into a JSON string.
   *
   * Returns a Token which will evaluate to CloudFormation expression that
   * will be evaluated by CloudFormation to the JSON representation of the
   * input structure.
   *
   * All Tokens substituted in this way must return strings, or the evaluation
   * in CloudFormation will fail.
   */
  public static stringify(obj: any): Token {
    return new Token(() => {
      // Resolve inner value first so that if they evaluate to literals, we
      // maintain the type (and discard 'undefined's).
      //
      // Then replace intrinsics with a special subclass of Token that
      // overrides toJSON() to the marker string, so if we resolve() the
      // strings again it evaluates to the right string. It also
      // deep-escapes any strings inside the intrinsic, so that if literal
      // strings are used in {Fn::Join} or something, they will end up
      // escaped in the final JSON output.
      const resolved = resolve(obj);

      // We can just directly return this value, since resolve() will be called
      // on our return value anyway.
      return JSON.stringify(deepReplaceIntrinsics(resolved));
    });

    /**
     * Recurse into a structure, replace all intrinsics with IntrinsicTokens.
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

/**
 * Token that also stringifies in the toJSON() operation.
 */
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
