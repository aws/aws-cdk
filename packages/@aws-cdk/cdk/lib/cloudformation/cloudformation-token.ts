import { resolve, Token, unresolved } from "../core/tokens";

/**
 * Base class for CloudFormation built-ins
 */
export class CloudFormationToken extends Token {
  public concat(left: any | undefined, right: any | undefined): Token {
    const parts = new Array<any>();
    if (left !== undefined) { parts.push(left); }
    parts.push(resolve(this));
    if (right !== undefined) { parts.push(right); }
    return new FnJoin('', parts);
  }
}

/**
 * Return whether the given value represents a CloudFormation intrinsic
 */
export function isIntrinsic(x: any) {
  if (Array.isArray(x) || x === null || typeof x !== 'object') { return false; }

  const keys = Object.keys(x);
  if (keys.length !== 1) { return false; }

  return keys[0] === 'Ref' || keys[0].startsWith('Fn::');
}

/**
 * The intrinsic function ``Fn::Join`` appends a set of values into a single value, separated by
 * the specified delimiter. If a delimiter is the empty string, the set of values are concatenated
 * with no delimiter.
 */
export class FnJoin extends CloudFormationToken {
  private readonly delimiter: string;
  private readonly listOfValues: any[];
  // Cache for the result of resolveValues() - since it otherwise would be computed several times
  private _resolvedValues?: any[];
  private canOptimize: boolean;

  /**
   * Creates an ``Fn::Join`` function.
   * @param delimiter The value you want to occur between fragments. The delimiter will occur between fragments only.
   *          It will not terminate the final value.
   * @param listOfValues The list of values you want combined.
   */
  constructor(delimiter: string, listOfValues: any[]) {
    if (listOfValues.length === 0) {
      throw new Error(`FnJoin requires at least one value to be provided`);
    }
    // Passing the values as a token, optimization requires resolving stringified tokens, we should be deferred until
    // this token is itself being resolved.
    super({ 'Fn::Join': [ delimiter, new Token(() => this.resolveValues()) ] });
    this.delimiter = delimiter;
    this.listOfValues = listOfValues;
    this.canOptimize = true;
  }

  public resolve(): any {
    const resolved = this.resolveValues();
    if (this.canOptimize && resolved.length === 1) {
      return resolved[0];
    }
    return super.resolve();
  }

  /**
   * Optimization: if an Fn::Join is nested in another one and they share the same delimiter, then flatten it up. Also,
   * if two concatenated elements are literal strings (not tokens), then pre-concatenate them with the delimiter, to
   * generate shorter output.
   */
  private resolveValues() {
    if (this._resolvedValues) { return this._resolvedValues; }

    if (unresolved(this.listOfValues)) {
      // This is a list token, don't resolve and also don't optimize.
      this.canOptimize = false;
      return this._resolvedValues = this.listOfValues;
    }

    const resolvedValues = [...this.listOfValues.map(e => resolve(e))];
    let i = 0;
    while (i < resolvedValues.length) {
      const el = resolvedValues[i];
      if (isFnJoinIntrinsicWithSameDelimiter.call(this, el)) {
        resolvedValues.splice(i, 1, ...el['Fn::Join'][1]);
      } else if (i > 0 && isPlainString(resolvedValues[i - 1]) && isPlainString(resolvedValues[i])) {
        resolvedValues[i - 1] += this.delimiter + resolvedValues[i];
        resolvedValues.splice(i, 1);
      } else {
        i += 1;
      }
    }

    return this._resolvedValues = resolvedValues;

    function isFnJoinIntrinsicWithSameDelimiter(this: FnJoin, obj: any): boolean {
      return isIntrinsic(obj)
        && Object.keys(obj)[0] === 'Fn::Join'
        && obj['Fn::Join'][0] === this.delimiter;
    }

    function isPlainString(obj: any): boolean {
      return typeof obj === 'string' && !unresolved(obj);
    }
  }
}
