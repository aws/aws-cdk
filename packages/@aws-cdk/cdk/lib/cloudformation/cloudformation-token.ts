import { resolve, Token } from "../core/tokens";

/**
 * Base class for CloudFormation built-ins
 */
export class CloudFormationToken extends Token {
  public concat(left: any | undefined, right: any | undefined): Token {
    const parts = new Array<any>();
    if (left !== undefined) { parts.push(left); }
    parts.push(resolve(this));
    if (right !== undefined) { parts.push(right); }
    return new FnConcat(...parts);
  }
}

import { FnConcat } from "./fn";

/**
 * Return whether the given value represents a CloudFormation intrinsic
 */
export function isIntrinsic(x: any) {
  if (Array.isArray(x) || x === null || typeof x !== 'object') { return false; }

  const keys = Object.keys(x);
  if (keys.length !== 1) { return false; }

  return keys[0] === 'Ref' || keys[0].startsWith('Fn::');
}
