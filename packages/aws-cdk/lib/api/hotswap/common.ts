import * as cfn_diff from '@aws-cdk/cloudformation-diff';
import { ISDK } from '../aws-auth';

export const ICON = '✨';

export interface HotswappableChange {
  readonly hotswappable: true;
  readonly resourceType: string;
  readonly propsChanged: Array<string>;
  /**
   * The name of the service being hotswapped.
   * Used to set a custom User-Agent for SDK calls.
   */
  readonly service: string;

  /**
   * The names of the resources being hotswapped.
   */
  readonly resourceNames: string[];

  readonly apply: (sdk: ISDK) => Promise<void>;
}

export interface NonHotswappableChange {
  readonly hotswappable: false;
  readonly resourceType: string;
  readonly rejectedChanges: Array<string>;
  readonly logicalId: string;
  /**
   * Tells the user exactly why this change was deemed non-hotswappable and what its logical ID is.
   * If not specified, `reason` will be autofilled to state that the properties listed in `rejectedChanges` are not hotswappable.
   */
  readonly reason?: string;
}

export type ChangeHotswapResult = Array<HotswappableChange | NonHotswappableChange>;

export interface AllChanges {
  hotswappableChanges: HotswappableChange[];
  nonHotswappableChanges: NonHotswappableChange[];
  metadataChanged: boolean;
}

export enum HotswapMode {
  /**
   * Will fall back to CloudFormation when a non-hotswappable change is detected
   */
  CLASSIC = 'classic',

  /**
   * Will not fall back to CloudFormation when a non-hotswappable change is detected
   */
  HOTSWAP_ONLY = 'hotswap-only',
}

/**
 * Represents a change that can be hotswapped.
 */
export class HotswappableChangeCandidate {
  /**
   * The value the resource is being updated from.
   */
  public readonly oldValue: cfn_diff.Resource;
  /**
   * The value the resource is being updated to.
   */
  public readonly newValue: cfn_diff.Resource;

  /**
   * The changes made to the resource properties.
   */
  public readonly propertyUpdates: PropDiffs;

  public constructor(oldValue: cfn_diff.Resource, newValue: cfn_diff.Resource, propertyUpdates: PropDiffs) {
    this.oldValue = oldValue;
    this.newValue = newValue;
    this.propertyUpdates = propertyUpdates;
  }
}

type Exclude = { [key: string]: Exclude | true }

/**
 * This function transforms all keys (recursively) in the provided `val` object.
 *
 * @param val The object whose keys need to be transformed.
 * @param transform The function that will be applied to each key.
 * @param exclude The keys that will not be transformed and copied to output directly
 * @returns A new object with the same values as `val`, but with all keys transformed according to `transform`.
 */
export function transformObjectKeys(val: any, transform: (str: string) => string, exclude: Exclude = {}): any {
  if (val == null || typeof val !== 'object') {
    return val;
  }
  if (Array.isArray(val)) {
    // For arrays we just pass parent's exclude object directly
    // since it makes no sense to specify different exclude options for each array element
    return val.map((input: any) => transformObjectKeys(input, transform, exclude));
  }
  const ret: { [k: string]: any; } = {};
  for (const [k, v] of Object.entries(val)) {
    const childExclude = exclude[k];
    if (childExclude === true) {
      // we don't transform this object if the key is specified in exclude
      ret[transform(k)] = v;
    } else {
      ret[transform(k)] = transformObjectKeys(v, transform, childExclude);
    }
  }
  return ret;
}

/**
 * This function lower cases the first character of the string provided.
 */
export function lowerCaseFirstCharacter(str: string): string {
  return str.length > 0 ? `${str[0].toLowerCase()}${str.slice(1)}` : str;
}

export type PropDiffs = Record<string, cfn_diff.PropertyDifference<any>>;
export type ClassifiedChanges = { hotswappableProps: PropDiffs, nonHotswappableProps: PropDiffs }

export function classifyChanges(xs: HotswappableChangeCandidate, hotswappablePropNames: string[]): ClassifiedChanges {
  const hotswappableProps: PropDiffs = {};
  const nonHotswappableProps: PropDiffs = {};

  for (const [name, propDiff] of Object.entries(xs.propertyUpdates)) {
    if (hotswappablePropNames.includes(name)) {
      hotswappableProps[name] = propDiff;
    } else {
      nonHotswappableProps[name] = propDiff;
    }
  }

  return { hotswappableProps, nonHotswappableProps };
}
