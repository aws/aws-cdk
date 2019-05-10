import { isIntrinsic, minimalCloudFormationJoin } from "./instrinsics";
import { DefaultTokenResolver } from "./resolve";
import { IResolveContext, Token } from "./token";

/**
 * Routines that know how to do operations at the CloudFormation document language level
 */
export class CloudFormationLang {
  /**
   * Turn an arbitrary structure potentially containing Tokens into a JSON string.
   *
   * Returns a Token which will evaluate to CloudFormation expression that
   * will be evaluated by CloudFormation to the JSON representation of the
   * input structure.
   *
   * All Tokens substituted in this way must return strings, or the evaluation
   * in CloudFormation will fail.
   *
   * @param obj The object to stringify
   * @param context The Construct from which to resolve any Tokens found in the object
   */
  public static toJSON(obj: any): string {
    // This works in two stages:
    //
    // First, resolve everything. This gets rid of the lazy evaluations, evaluation
    // to the real types of things (for example, would a function return a string, an
    // intrinsic, or a number? We have to resolve to know).
    //
    // We then to through the returned result, identify things that evaluated to
    // CloudFormation intrinsics, and re-wrap those in Tokens that have a
    // toJSON() method returning their string representation. If we then call
    // JSON.stringify() on that result, that gives us essentially the same
    // string that we started with, except with the non-token characters quoted.
    //
    //    {"field": "${TOKEN}"} --> {\"field\": \"${TOKEN}\"}
    //
    // A final resolve() on that string (done by the framework) will yield the string
    // we're after.


    return new Token((ctx: IResolveContext) => {
      // Resolve inner value first so that if they evaluate to literals, we
      // maintain the type (and discard 'undefined's).
      //
      // Then replace intrinsics with a special subclass of Token that
      // overrides toJSON() to the marker string, so if we resolve() the
      // strings again it evaluates to the right string. It also
      // deep-escapes any strings inside the intrinsic, so that if literal
      // strings are used in {Fn::Join} or something, they will end up
      // escaped in the final JSON output.
      const resolved = ctx.resolve(obj);

      // We can just directly return this value, since resolve() will be called
      // on our return value anyway.
      return JSON.stringify(deepReplaceIntrinsics(resolved));
    }).toString();

    /**
     * Recurse into a structure, replace all intrinsics with IntrinsicTokens.
     */
    function deepReplaceIntrinsics(x: any): any {
      if (x == null) { return x; }

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

  /**
   * Produce a CloudFormation expression to concat two arbitrary expressions when resolving
   */
  public static concat(left: any | undefined, right: any | undefined): any {
    if (left === undefined && right === undefined) { return ''; }

    const parts = new Array<any>();
    if (left !== undefined) { parts.push(left); }
    if (right !== undefined) { parts.push(right); }

    // Some case analysis to produce minimal expressions
    if (parts.length === 1) { return parts[0]; }
    if (parts.length === 2 && typeof parts[0] === 'string' && typeof parts[1] === 'string') {
      return parts[0] + parts[1];
    }

    // Otherwise return a Join intrinsic (already in the target document language to avoid taking
    // circular dependencies on FnJoin & friends)
    return { 'Fn::Join': ['', minimalCloudFormationJoin('', parts)] };
  }

}

/**
 * Token that also stringifies in the toJSON() operation.
 */
class IntrinsicToken extends Token {
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

/**
 * Default Token resolver for CloudFormation templates
 */
export const CLOUDFORMATION_TOKEN_RESOLVER = new DefaultTokenResolver({
  join(left: any, right: any) {
    return CloudFormationLang.concat(left, right);
  }
});