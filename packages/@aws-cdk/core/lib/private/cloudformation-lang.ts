import { Lazy } from "../lazy";
import { Reference } from "../reference";
import { DefaultTokenResolver, IFragmentConcatenator, IPostProcessor, IResolvable, IResolveContext  } from "../resolvable";
import { TokenizedStringFragments } from "../string-fragments";
import { Token } from "../token";
import { Intrinsic } from "./intrinsic";
import { resolve } from "./resolve";

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
   * @param space Indentation to use (default: no pretty-printing)
   */
  public static toJSON(obj: any, space?: number): string {
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
    //
    // Resolving and wrapping are done in go using the resolver framework.
    class IntrinsincWrapper extends DefaultTokenResolver {
      constructor() {
        super(CLOUDFORMATION_CONCAT);
      }

      public resolveToken(t: IResolvable, context: IResolveContext, postProcess: IPostProcessor) {
        // Return References directly, so their type is maintained and the references will
        // continue to work. Only while preparing, because we do need the final value of the
        // token while resolving.
        if (Reference.isReference(t) && context.preparing) { return wrap(t); }

        // Deep-resolve and wrap. This is necessary for Lazy tokens so we can see "inside" them.
        return wrap(super.resolveToken(t, context, postProcess));
      }
      public resolveString(fragments: TokenizedStringFragments, context: IResolveContext) {
        return wrap(super.resolveString(fragments, context));
      }
      public resolveList(l: string[], context: IResolveContext) {
        return wrap(super.resolveList(l, context));
      }
    }

    // We need a ResolveContext to get started so return a Token
    return Lazy.stringValue({ produce: (ctx: IResolveContext) =>
      JSON.stringify(resolve(obj, {
        preparing: ctx.preparing,
        scope: ctx.scope,
        resolver: new IntrinsincWrapper()
      }), undefined, space)
    });

    function wrap(value: any): any {
      return isIntrinsic(value) ? new JsonToken(deepQuoteStringsForJSON(value)) : value;
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
class JsonToken extends Intrinsic {
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

const CLOUDFORMATION_CONCAT: IFragmentConcatenator = {
  join(left: any, right: any) {
    return CloudFormationLang.concat(left, right);
  }
};

/**
 * Default Token resolver for CloudFormation templates
 */
export const CLOUDFORMATION_TOKEN_RESOLVER = new DefaultTokenResolver(CLOUDFORMATION_CONCAT);

/**
 * Do an intelligent CloudFormation join on the given values, producing a minimal expression
 */
export function minimalCloudFormationJoin(delimiter: string, values: any[]): any[] {
  let i = 0;
  while (i < values.length) {
    const el = values[i];
    if (isSplicableFnJoinIntrinsic(el)) {
      values.splice(i, 1, ...el['Fn::Join'][1]);
    } else if (i > 0 && isPlainString(values[i - 1]) && isPlainString(values[i])) {
      values[i - 1] += delimiter + values[i];
      values.splice(i, 1);
    } else {
      i += 1;
    }
  }

  return values;

  function isPlainString(obj: any): boolean {
    return typeof obj === 'string' && !Token.isUnresolved(obj);
  }

  function isSplicableFnJoinIntrinsic(obj: any): boolean {
    return isIntrinsic(obj)
      && Object.keys(obj)[0] === 'Fn::Join'
      && obj['Fn::Join'][0] === delimiter;
  }
}

/**
 * Return whether the given value represents a CloudFormation intrinsic
 */
function isIntrinsic(x: any) {
  if (Array.isArray(x) || x === null || typeof x !== 'object') { return false; }

  const keys = Object.keys(x);
  if (keys.length !== 1) { return false; }

  return keys[0] === 'Ref' || isNameOfCloudFormationIntrinsic(keys[0]);
}

export function isNameOfCloudFormationIntrinsic(name: string): boolean {
  if (!name.startsWith('Fn::')) {
    return false;
  }
  // these are 'fake' intrinsics, only usable inside the parameter overrides of a CFN CodePipeline Action
  return name !== 'Fn::GetArtifactAtt' && name !== 'Fn::GetParam';
}
