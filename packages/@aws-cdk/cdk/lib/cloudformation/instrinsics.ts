/**
 * Do an intelligent CloudFormation join on the given values, producing a minimal expression
 */
export function minimalCloudFormationJoin(delimiter: string, values: any[]): any[] {
  let i = 0;
  while (i < values.length) {
    const el = values[i];
    if (isSplicableFnJoinInstrinsic(el)) {
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
    return typeof obj === 'string' && !unresolved(obj);
  }

  function isSplicableFnJoinInstrinsic(obj: any): boolean {
    return isIntrinsic(obj)
      && Object.keys(obj)[0] === 'Fn::Join'
      && obj['Fn::Join'][0] === delimiter;
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

import { unresolved } from "../core/tokens/unresolved";
