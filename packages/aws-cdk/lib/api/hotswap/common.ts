import * as cfn_diff from '@aws-cdk/cloudformation-diff';
import { ISDK } from '../aws-auth';

export const ICON = '✨';

/**
 * An interface that represents a change that can be deployed in a short-circuit manner.
 */
export interface HotswapOperation {
  /**
   * The name of the service being hotswapped.
   * Used to set a custom User-Agent for SDK calls.
   */
  readonly service: string;

  /**
   * The names of the resources being hotswapped.
   */
  readonly resourceNames: string[];

  apply(sdk: ISDK): Promise<any>;
}

/**
 * An enum that represents the result of detection whether a given change can be hotswapped.
 */
export enum ChangeHotswapImpact {
  /**
   * This result means that the given change cannot be hotswapped,
   * and requires a full deployment.
   */
  REQUIRES_FULL_DEPLOYMENT = 'requires-full-deployment',

  /**
   * This result means that the given change can be safely be ignored when determining
   * whether the given Stack can be hotswapped or not
   * (for example, it's a change to the CDKMetadata resource).
   */
  IRRELEVANT = 'irrelevant',
}

export type ChangeHotswapResult = HotswapOperation | ChangeHotswapImpact;

/**
 * Represents a change that can be hotswapped.
 */
export class HotswappableChangeCandidate {
  /**
   * The value the resource is being updated to.
   */
  public readonly newValue: cfn_diff.Resource;

  /**
   * The changes made to the resource properties.
   */
  public readonly propertyUpdates: { [key: string]: cfn_diff.PropertyDifference<any> };

  public constructor(newValue: cfn_diff.Resource, propertyUpdates: { [key: string]: cfn_diff.PropertyDifference<any> }) {
    this.newValue = newValue;
    this.propertyUpdates = propertyUpdates;
  }
}

/**
 * This function transforms all keys (recursively) in the provided `val` object.
 *
 * @param val The object whose keys need to be transformed.
 * @param transform The function that will be applied to each key.
 * @returns A new object with the same values as `val`, but with all keys transformed according to `transform`.
 */
export function transformObjectKeys(val: any, transform: (str: string) => string): any {
  if (val == null || typeof val !== 'object') {
    return val;
  }
  if (Array.isArray(val)) {
    return val.map((input: any) => transformObjectKeys(input, transform));
  }
  const ret: { [k: string]: any; } = {};
  for (const [k, v] of Object.entries(val)) {
    ret[transform(k)] = transformObjectKeys(v, transform);
  }
  return ret;
}

/**
 * This function lower cases the first character of the string provided.
 */
export function lowerCaseFirstCharacter(str: string): string {
  return str.length > 0 ? `${str[0].toLowerCase()}${str.slice(1)}` : str;
}
