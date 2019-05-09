/**
 * Produce a CloudFormation expression to concat two arbitrary expressions when resolving
 */
export function cloudFormationConcat(left: any | undefined, right: any | undefined): any {
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

export class CloudFormationConcat implements IFragmentConcatenator {
  public join(left: any, right: any) {
    return cloudFormationConcat(left, right);
  }
}

import { IFragmentConcatenator } from "./encoding";
import { minimalCloudFormationJoin } from "./instrinsics";