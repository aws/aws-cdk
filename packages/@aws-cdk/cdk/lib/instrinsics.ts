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

  return keys[0] === 'Ref' || isNameOfCloudFormationIntrinsic(keys[0]);
}

export function isNameOfCloudFormationIntrinsic(name: string): boolean {
  if (!name.startsWith('Fn::')) {
    return false;
  }
  // these are 'fake' intrinsics, only usable inside the parameter overrides of a CFN CodePipeline Action
  return name !== 'Fn::GetArtifactAtt' && name !== 'Fn::GetParam';
}

/**
 * Return whether this is an intrinsic that could potentially (or definitely) evaluate to a list
 */
export function canEvaluateToList(x: any) {
  return isIntrinsic(x) && ['Ref', 'Fn::GetAtt', 'Fn::GetAZs', 'Fn::Split', 'Fn::FindInMap', 'Fn::ImportValue'].includes(Object.keys(x)[0]);
}

import { unresolved } from "./unresolved";
