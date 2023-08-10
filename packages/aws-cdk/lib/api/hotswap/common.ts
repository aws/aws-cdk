import * as cfn_diff from '@aws-cdk/cloudformation-diff';
import { ISDK } from '../aws-auth';
import { CfnEvaluationException, EvaluateCloudFormationTemplate } from '../evaluate-cloudformation-template';

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
  /**
   * Whether or not to show this change when listing non-hotswappable changes in HOTSWAP_ONLY mode. Does not affect
   * listing in FALL_BACK mode.
   *
   * @default true
   */
  readonly hotswapOnlyVisible?: boolean;
}

export type ChangeHotswapResult = Array<HotswappableChange | NonHotswappableChange>;

export interface ClassifiedResourceChanges {
  hotswappableChanges: HotswappableChange[];
  nonHotswappableChanges: NonHotswappableChange[];
}

export enum HotswapMode {
  /**
   * Will fall back to CloudFormation when a non-hotswappable change is detected
   */
  FALL_BACK = 'fall-back',

  /**
   * Will not fall back to CloudFormation when a non-hotswappable change is detected
   */
  HOTSWAP_ONLY = 'hotswap-only',

  /**
   * Will not attempt to hotswap anything and instead go straight to CloudFormation
   */
  FULL_DEPLOYMENT = 'full-deployment',
}

/**
 * Represents a change that can be hotswapped.
 */
export class HotswappableChangeCandidate {
  /**
   * The logical ID of the resource which is being changed
   */
  public readonly logicalId: string;

  /**
   * The value the resource is being updated from
   */
  public readonly oldValue: cfn_diff.Resource;

  /**
   * The value the resource is being updated to
   */
  public readonly newValue: cfn_diff.Resource;

  /**
   * The changes made to the resource properties
   */
  public readonly propertyUpdates: PropDiffs;

  public constructor(logicalId: string, oldValue: cfn_diff.Resource, newValue: cfn_diff.Resource, propertyUpdates: PropDiffs) {
    this.logicalId = logicalId;
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

/**
 * This function upper cases the first character of the string provided.
 */
export function upperCaseFirstCharacter(str: string): string {
  return str.length > 0 ? `${str[0].toUpperCase()}${str.slice(1)}` : str;
}

export type PropDiffs = Record<string, cfn_diff.PropertyDifference<any>>;

export class ClassifiedChanges {
  public constructor(
    public readonly change: HotswappableChangeCandidate,
    public readonly hotswappableProps: PropDiffs,
    public readonly nonHotswappableProps: PropDiffs,
  ) { }

  public reportNonHotswappablePropertyChanges(ret: ChangeHotswapResult):void {
    const nonHotswappablePropNames = Object.keys(this.nonHotswappableProps);
    if (nonHotswappablePropNames.length > 0) {
      const tagOnlyChange = nonHotswappablePropNames.length === 1 && nonHotswappablePropNames[0] === 'Tags';
      reportNonHotswappableChange(
        ret,
        this.change,
        this.nonHotswappableProps,
        tagOnlyChange ? 'Tags are not hotswappable' : `resource properties '${nonHotswappablePropNames}' are not hotswappable on this resource type`,
      );
    }
  }

  public get namesOfHotswappableProps(): string[] {
    return Object.keys(this.hotswappableProps);
  }
}

export function classifyChanges(
  xs: HotswappableChangeCandidate,
  hotswappablePropNames: string[],
): ClassifiedChanges {
  const hotswappableProps: PropDiffs = {};
  const nonHotswappableProps: PropDiffs = {};

  for (const [name, propDiff] of Object.entries(xs.propertyUpdates)) {
    if (hotswappablePropNames.includes(name)) {
      hotswappableProps[name] = propDiff;
    } else {
      nonHotswappableProps[name] = propDiff;
    }
  }

  return new ClassifiedChanges(xs, hotswappableProps, nonHotswappableProps);
}

export function reportNonHotswappableChange(
  ret: ChangeHotswapResult,
  change: HotswappableChangeCandidate,
  nonHotswappableProps?: PropDiffs,
  reason?: string,
  hotswapOnlyVisible?: boolean,
): void {
  let hotswapOnlyVisibility = true;
  if (hotswapOnlyVisible === false) {
    hotswapOnlyVisibility = false;
  }
  ret.push({
    hotswappable: false,
    rejectedChanges: Object.keys(nonHotswappableProps ?? change.propertyUpdates),
    logicalId: change.logicalId,
    resourceType: change.newValue.Type,
    reason,
    hotswapOnlyVisible: hotswapOnlyVisibility,
  });
}

export function reportNonHotswappableResource(
  change: HotswappableChangeCandidate,
  reason?: string,
): ChangeHotswapResult {
  return [{
    hotswappable: false,
    rejectedChanges: Object.keys(change.propertyUpdates),
    logicalId: change.logicalId,
    resourceType: change.newValue.Type,
    reason,
  }];
}

type ChangedProps = {
  /**
   * Array to specify the property from an object.
   * e.g. Given this object `{ 'a': { 'b': 1 } }`, the key array for the element `1` will be `['a', 'b']`
   */
  key: string[];

  /**
   * Whether the property is added (also modified) or removed.
   */
  type: 'removed' | 'added';

  /**
   * evaluated value of the property.
   * undefined if type == 'removed'
   */
  value?: any
};

function detectChangedProps(next: any, prev: any): ChangedProps[] {
  const changedProps: ChangedProps[] = [];
  changedProps.push(...detectAdditions(next, prev));
  changedProps.push(...detectRemovals(next, prev));
  return changedProps;
}

function detectAdditions(next: any, prev: any, keys: string[] = []): ChangedProps[] {
  // Compare each value of two objects, detect additions (added or modified properties)
  // If we encounter CFn intrinsic (key.startsWith('Fn::') || key == 'Ref'), stop recursion

  if (typeof next !== 'object') {
    if (next !== prev) {
      // there is an addition or change to the property
      return [{ key: new Array(...keys), type: 'added' }];
    } else {
      return [];
    }
  }

  if (typeof prev !== 'object') {
    // there is an addition or change to the property
    return [{ key: new Array(...keys), type: 'added' }];
  }

  // If the next is a CFn intrinsic, don't recurse further.
  const childKeys = Object.keys(next);
  if (childKeys.length === 1 && (childKeys[0].startsWith('Fn::') || childKeys[0] === 'Ref')) {
    if (!deepCompareObject(prev, next)) {
      // there is an addition or change to the property
      return [{ key: new Array(...keys), type: 'added' }];
    } else {
      return [];
    }
  }

  const changedProps: ChangedProps[] = [];
  // compare children
  for (const key of childKeys) {
    keys.push(key);
    changedProps.push(...detectAdditions((next as any)[key], (prev as any)[key], keys));
    keys.pop();
  }
  return changedProps;
}

function detectRemovals(next: any, prev: any, keys: string[] = []): ChangedProps[] {
  // Compare each value of two objects, detect removed properties
  // To do this, find any keys that exist only in prev object.
  // If we encounter CFn intrinsic (key.startsWith('Fn::') || key == 'Ref'), stop recursion
  if (next === undefined) {
    return [{ key: new Array(...keys), type: 'removed' }];
  }

  if (typeof prev !== 'object' || typeof next !== 'object') {
    // either prev or next is not an object nor undefined, then the property is not removed
    return [];
  }

  // If the prev is a CFn intrinsic, don't recurse further.
  const childKeys = Object.keys(prev);
  if (childKeys.length === 1 && (childKeys[0].startsWith('Fn::') || childKeys[0] === 'Ref')) {
    // next is not undefined here, so it is at least not removed
    return [];
  }

  const changedProps: ChangedProps[] = [];
  // compare children
  for (const key of childKeys) {
    keys.push(key);
    changedProps.push(...detectRemovals((next as any)[key], (prev as any)[key], keys));
    keys.pop();
  }
  return changedProps;
}

/**
 * return true when two objects are identical
 */
function deepCompareObject(lhs: any, rhs: any): boolean {
  if (typeof lhs !== 'object') {
    return lhs === rhs;
  }
  if (typeof rhs !== 'object') {
    return false;
  }
  if (Object.keys(lhs).length != Object.keys(rhs).length) {
    return false;
  }
  for (const key of Object.keys(lhs)) {
    if (!deepCompareObject((lhs as any)[key], (rhs as any)[key])) {
      return false;
    }
  }
  return true;
}

interface EvaluatedPropertyUpdates {
  readonly updates: ChangedProps[];
  readonly unevaluatableUpdates: ChangedProps[];
}

/**
 * Diff each property of the changes, and check if each diff can be actually hotswapped (i.e. evaluated by EvaluateCloudFormationTemplate.)
 * If any diff cannot be evaluated, they are reported by unevaluatableUpdates.
 * This method works on more granular level than HotswappableChangeCandidate.propertyUpdates.
 *
 * If propertiesToInclude is specified, we only compare properties that are under keys in the argument.
 */
export async function evaluatableProperties(
  evaluate: EvaluateCloudFormationTemplate,
  change: HotswappableChangeCandidate,
  propertiesToInclude?: string[],
): Promise<EvaluatedPropertyUpdates> {
  const prev = change.oldValue.Properties!;
  const next = change.newValue.Properties!;
  const changedProps = detectChangedProps(next, prev).filter(
    prop => propertiesToInclude?.includes(prop.key[0]) ?? true,
  );
  const evaluatedUpdates = await Promise.all(
    changedProps
      .filter((prop) => prop.type === 'added')
      .map(async (prop) => {
        const val = getPropertyFromKey(prop.key, next);
        try {
          const evaluated = await evaluate.evaluateCfnExpression(val);
          return {
            ...prop,
            value: evaluated,
          };
        } catch (e) {
          if (e instanceof CfnEvaluationException) {
            return prop;
          }
          throw e;
        }
      }));
  const unevaluatableUpdates = evaluatedUpdates.filter(update => update.value === undefined);
  evaluatedUpdates.push(...changedProps.filter(prop => prop.type == 'removed'));

  return {
    updates: evaluatedUpdates,
    unevaluatableUpdates,
  };
}

function getPropertyFromKey(key: string[], obj: object) {
  return key.reduce((prev, cur) => (prev as any)?.[cur], obj);
}

function overwriteProperty(key: string[], newValue: any, target: object) {
  for (const next of key.slice(0, -1)) {
    if (next in target) {
      target = (target as any)[next];
    } else if (Array.isArray(target)) {
      // When an element is added to an array, we need explicitly allocate the new element.
      target = {};
      (target as any)[next] = {};
    } else {
      // This is an unexpected condition. Perhaps the deployed task definition is modified outside of CFn.
      return false;
    }
  }
  if (newValue === undefined) {
    delete (target as any)[key[key.length - 1]];
  } else {
    (target as any)[key[key.length - 1]] = newValue;
  }
  return true;
}

/**
 * Take the old template and property updates, and synthesize a new template.
 */
export function applyPropertyUpdates(patches: ChangedProps[], target: any) {
  target = JSON.parse(JSON.stringify(target));
  for (const patch of patches) {
    const res = overwriteProperty(patch.key, patch.value, target);
    if (!res) {
      throw new Error(`failed to applying patch to ${patch.key.join('.')}. Please try deploying without hotswap first.`);
    }
  }
  return target;
}
