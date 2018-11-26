import cfnspec = require('@aws-cdk/cfnspec');
import { AssertionError } from 'assert';
import { IamChanges } from '../iam/iam-changes';
import { deepEqual } from './util';

export type PropertyMap = {[key: string]: any };

/** Semantic differences between two CloudFormation templates. */
export class TemplateDiff implements ITemplateDiff {
  public awsTemplateFormatVersion?: Difference<string>;
  public description?: Difference<string>;
  public transform?: Difference<string>;
  public conditions: DifferenceCollection<Condition, ConditionDifference>;
  public mappings: DifferenceCollection<Mapping, MappingDifference>;
  public metadata: DifferenceCollection<Metadata, MetadataDifference>;
  public outputs: DifferenceCollection<Output, OutputDifference>;
  public parameters: DifferenceCollection<Parameter, ParameterDifference>;
  public resources: DifferenceCollection<Resource, ResourceDifference>;
  /** The differences in unknown/unexpected parts of the template */
  public unknown: DifferenceCollection<any, Difference<any>>;

  /**
   * Changes to IAM policies
   */
  public readonly iamChanges: IamChanges;

  constructor(args: ITemplateDiff) {
    if (args.awsTemplateFormatVersion !== undefined) {
      this.awsTemplateFormatVersion = args.awsTemplateFormatVersion;
    }
    if (args.description !== undefined) {
      this.description = args.description;
    }
    if (args.transform !== undefined) {
      this.transform = args.transform;
    }

    this.conditions = args.conditions || new DifferenceCollection({});
    this.mappings = args.mappings || new DifferenceCollection({});
    this.metadata = args.metadata || new DifferenceCollection({});
    this.outputs = args.outputs || new DifferenceCollection({});
    this.parameters = args.parameters || new DifferenceCollection({});
    this.resources = args.resources || new DifferenceCollection({});
    this.unknown = args.unknown || new DifferenceCollection({});

    this.iamChanges = new IamChanges(
      this.scrutinizablePropertyChanges(cfnspec.schema.PropertyScrutinyType.IdentityPolicy),
      this.scrutinizablePropertyChanges(cfnspec.schema.PropertyScrutinyType.ResourcePolicy),
      this.scrutinizableResourceChanges(cfnspec.schema.ResourceScrutinyType.LambdaPermission),
      );
  }

  public get count() {
    let count = 0;

    if (this.awsTemplateFormatVersion !== undefined) {
      count += 1;
    }
    if (this.description !== undefined) {
      count += 1;
    }
    if (this.transform !== undefined) {
      count += 1;
    }

    count += this.conditions.count;
    count += this.mappings.count;
    count += this.metadata.count;
    count += this.outputs.count;
    count += this.parameters.count;
    count += this.resources.count;
    count += this.unknown.count;

    return count;
  }

  public get isEmpty(): boolean {
    return this.count === 0;
  }

  /**
   * Return all property changes of a given scrutiny type
   *
   * We don't just look at property updates; we also look at resource additions and deletions (in which
   * case there is no further detail on property values), and resource type changes.
   */
  public scrutinizablePropertyChanges(scrutinyType: cfnspec.schema.PropertyScrutinyType): PropertyChange[] {
    const ret = new Array<PropertyChange>();

    for (const [resourceLogicalId, resourceChange] of Object.entries(this.resources.changes)) {
      if (!resourceChange) { continue; }

      const props = cfnspec.scrutinizablePropertyNames(resourceChange.newResourceType!, scrutinyType);
      for (const propertyName of props) {
        ret.push({
          resourceLogicalId, propertyName,
          oldValue: resourceChange.oldProperties && resourceChange.oldProperties[propertyName],
          newValue: resourceChange.newProperties && resourceChange.newProperties[propertyName],
        });
      }
    }

    return ret;
  }

  /**
   * Return all resource changes of a given scrutiny type
   *
   * We don't just look at resource updates; we also look at resource additions and deletions (in which
   * case there is no further detail on property values), and resource type changes.
   */
  public scrutinizableResourceChanges(scrutinyType: cfnspec.schema.ResourceScrutinyType): ResourceChange[] {
    const ret = new Array<ResourceChange>();

    const scrutinizableTypes = new Set(cfnspec.scrutinizableResourceTypes(scrutinyType));

    for (const [resourceLogicalId, resourceChange] of Object.entries(this.resources.changes)) {
      if (!resourceChange) { continue; }

      // Even though it's not physically possible in CFN, let's pretend to handle a change of 'Type'.
      if (resourceChange.resourceTypeChanged) {
        // Treat as DELETE+ADD
        if (scrutinizableTypes.has(resourceChange.oldResourceType!)) {
          ret.push({
            oldProperties: resourceChange.oldProperties,
            resourceLogicalId,
            resourceType: resourceChange.oldResourceType!
          });
        }
        if (scrutinizableTypes.has(resourceChange.newResourceType!)) {
          ret.push({
            newProperties: resourceChange.newProperties,
            resourceLogicalId,
            resourceType: resourceChange.newResourceType!
          });
        }
      } else {
        if (scrutinizableTypes.has(resourceChange.resourceType)) {
          ret.push({
            oldProperties: resourceChange.oldProperties,
            newProperties: resourceChange.newProperties,
            resourceLogicalId,
            resourceType: resourceChange.resourceType
          });
        }
      }
    }

    return ret;
  }
}

/**
 * A change in property values
 *
 * Not necessarily an update, it could be that there used to be no value there
 * because there was no resource, and now there is (or vice versa).
 *
 * Therefore, we just contain plain values and not a PropertyDifference<any>.
 */
export interface PropertyChange {
  /**
   * Logical ID of the resource where this property change was found
   */
  resourceLogicalId: string;

  /**
   * Name of the property that is changing
   */
  propertyName: string;

  /**
   * The old property value
   */
  oldValue?: any;

  /**
   * The new property value
   */
  newValue?: any;
}

/**
 * A resource change
 *
 * Either a creation, deletion or update.
 */
export interface ResourceChange {
  /**
   * Logical ID of the resource where this property change was found
   */
  resourceLogicalId: string;

  /**
   * The type of the resource
   */
  resourceType: string;

  /**
   * The old properties value (might be undefined in case of creation)
   */
  oldProperties?: PropertyMap;

  /**
   * The new properties value (might be undefined in case of deletion)
   */
  newProperties?: PropertyMap;
}

/**
 * Models an entity that changed between two versions of a CloudFormation template.
 */
export class Difference<ValueType> {
  /**
   * @param oldValue the old value, cannot be equal (to the sense of +deepEqual+) to +newValue+.
   * @param newValue the new value, cannot be equal (to the sense of +deepEqual+) to +oldValue+.
   */
  constructor(public readonly oldValue: ValueType | undefined, public readonly newValue: ValueType | undefined) {
    if (oldValue === undefined && newValue === undefined) {
      throw new AssertionError({ message: 'oldValue and newValue are both undefined!' });
    }
    if (deepEqual(oldValue, newValue)) {
      const oldStr = JSON.stringify(oldValue);
      const newStr = JSON.stringify(newValue);
      throw new NoDifferenceError(`oldValue (${oldStr}) and newValue (${newStr}) are equal!`);
    }
  }

  /** @returns +true+ if the element is new to the template. */
  public get isAddition(): boolean {
    return this.oldValue === undefined;
  }

  /** @returns +true+ if the element was removed from the template. */
  public get isRemoval(): boolean {
    return this.newValue === undefined;
  }

  /** @returns +true+ if the element was already in the template and is updated. */
  public get isUpdate(): boolean {
    return this.oldValue !== undefined
      && this.newValue !== undefined;
  }
}

export class PropertyDifference<ValueType> extends Difference<ValueType> {
  public readonly changeImpact?: ResourceImpact;

  constructor(oldValue: ValueType | undefined, newValue: ValueType | undefined, args: { changeImpact?: ResourceImpact }) {
    super(oldValue, newValue);
    this.changeImpact = args.changeImpact;
  }
}

export class DifferenceCollection<V, T extends Difference<V>> {
  constructor(public readonly changes: { [logicalId: string]: T | undefined }) {}

  public get count(): number {
    return this.logicalIds.length;
  }

  public get logicalIds(): string[] {
    return Object.keys(this.changes);
  }

  /**
   * Returns a new TemplateDiff which only contains changes for which `predicate`
   * returns `true`.
   */
  public filter(predicate: (diff: T | undefined) => boolean): DifferenceCollection<V, T> {
    const newChanges: { [logicalId: string]: T | undefined } = { };
    for (const id of Object.keys(this.changes)) {
      const diff = this.changes[id];

      if (predicate(diff)) {
        newChanges[id] = diff;
      }
    }

    return new DifferenceCollection<V, T>(newChanges);
  }

  /**
   * Invokes `cb` for all changes in this collection.
   *
   * Changes will be sorted as follows:
   *  - Removed
   *  - Added
   *  - Updated
   *  - Others
   *
   * @param cb
   */
  public forEach(cb: (logicalId: string, change: T) => any): void {
    const removed = new Array<{ logicalId: string, change: T }>();
    const added = new Array<{ logicalId: string, change: T }>();
    const updated = new Array<{ logicalId: string, change: T }>();
    const others = new Array<{ logicalId: string, change: T }>();

    for (const logicalId of this.logicalIds) {
      const change: T = this.changes[logicalId]!;
      if (change.isAddition) {
        added.push({ logicalId, change });
      } else if (change.isRemoval) {
        removed.push({ logicalId, change });
      } else if (change.isUpdate) {
        updated.push({ logicalId, change });
      } else {
        others.push({ logicalId, change });
      }
    }

    removed.forEach(v => cb(v.logicalId, v.change));
    added.forEach(v => cb(v.logicalId, v.change));
    updated.forEach(v => cb(v.logicalId, v.change));
    others.forEach(v => cb(v.logicalId, v.change));
  }
}

/**
 * Arguments expected by the constructor of +TemplateDiff+, extracted as an interface for the sake
 * of (relative) conciseness of the constructor's signature.
 */
export interface ITemplateDiff {
  awsTemplateFormatVersion?: Difference<string>;
  description?: Difference<string>;
  transform?: Difference<string>;

  conditions?: DifferenceCollection<Condition, ConditionDifference>;
  mappings?: DifferenceCollection<Mapping, MappingDifference>;
  metadata?: DifferenceCollection<Metadata, MetadataDifference>;
  outputs?: DifferenceCollection<Output, OutputDifference>;
  parameters?: DifferenceCollection<Parameter, ParameterDifference>;
  resources?: DifferenceCollection<Resource, ResourceDifference>;

  unknown?: DifferenceCollection<any, Difference<any>>;
}

export type Condition = any;
export class ConditionDifference extends Difference<Condition> {
  // TODO: define specific difference attributes
}

export type Mapping = any;
export class MappingDifference extends Difference<Mapping> {
  // TODO: define specific difference attributes
}

export type Metadata = any;
export class MetadataDifference extends Difference<Metadata> {
  // TODO: define specific difference attributes
}

export type Output = any;
export class OutputDifference extends Difference<Output> {
  // TODO: define specific difference attributes
}

export type Parameter = any;
export class ParameterDifference extends Difference<Parameter> {
  // TODO: define specific difference attributes
}

export enum ResourceImpact {
  /** The existing physical resource will be updated */
  WILL_UPDATE = 'WILL_UPDATE',
  /** A new physical resource will be created */
  WILL_CREATE = 'WILL_CREATE',
  /** The existing physical resource will be replaced */
  WILL_REPLACE = 'WILL_REPLACE',
  /** The existing physical resource may be replaced */
  MAY_REPLACE = 'MAY_REPLACE',
  /** The existing physical resource will be destroyed */
  WILL_DESTROY = 'WILL_DESTROY',
  /** The existing physical resource will be removed from CloudFormation supervision */
  WILL_ORPHAN = 'WILL_ORPHAN'
}

/**
 * This function can be used as a reducer to obtain the resource-level impact of a list
 * of property-level impacts.
 * @param one the current worst impact so far.
 * @param two the new impact being considered (can be undefined, as we may not always be
 *      able to determine some peroperty's impact).
 */
function worstImpact(one: ResourceImpact, two?: ResourceImpact): ResourceImpact {
  if (!two) { return one; }
  const badness = {
    [ResourceImpact.WILL_UPDATE]: 0,
    [ResourceImpact.WILL_CREATE]: 1,
    [ResourceImpact.WILL_ORPHAN]: 2,
    [ResourceImpact.MAY_REPLACE]: 3,
    [ResourceImpact.WILL_REPLACE]: 4,
    [ResourceImpact.WILL_DESTROY]: 5,
  };
  return badness[one] > badness[two] ? one : two;
}

export interface Resource {
  Type: string;
  Properties?: { [name: string]: any };

  [key: string]: any;
}
export class ResourceDifference extends Difference<Resource> {
  /**
   * Old property values
   */
  public readonly oldProperties?: PropertyMap;

  /**
   * New property values
   */
  public readonly newProperties?: PropertyMap;

  /** Property-level changes on the resource */
  public readonly propertyUpdates: { [key: string]: PropertyDifference<any> };
  /** Changes to non-property level attributes of the resource */
  public readonly otherChanges: { [key: string]: Difference<any> };

  /** The resource type (or old and new type if it has changed) */
  private readonly resourceTypes: { readonly oldType?: string, readonly newType?: string };

  constructor(oldValue: Resource | undefined,
              newValue: Resource | undefined,
              args: {
          resourceType: { oldType?: string, newType?: string },
          oldProperties?: PropertyMap,
          newProperties?: PropertyMap,
          propertyUpdates: { [key: string]: PropertyDifference<any> },
          otherChanges: { [key: string]: Difference<any> }
        }
  ) {
    super(oldValue, newValue);
    this.resourceTypes = args.resourceType;
    this.propertyUpdates = args.propertyUpdates;
    this.otherChanges = args.otherChanges;
    this.oldProperties = args.oldProperties;
    this.newProperties = args.newProperties;
  }

  public get oldResourceType(): string | undefined {
    return this.resourceTypes.oldType;
  }

  public get newResourceType(): string | undefined {
    return this.resourceTypes.newType;
  }

  /**
   * Return whether the resource type was changed in this diff
   *
   * This is not a valid operation in CloudFormation but to be defensive we're going
   * to be aware of it anyway.
   */
  public get resourceTypeChanged(): boolean {
    return (this.resourceTypes.oldType !== undefined
        && this.resourceTypes.newType !== undefined
        && this.resourceTypes.oldType !== this.resourceTypes.newType);
  }

  /**
   * Return the resource type if it was unchanged
   *
   * If the resource type was changed, it's an error to call this.
   */
  public get resourceType(): string {
    if (this.resourceTypeChanged) {
      throw new Error('Cannot get .resourceType, because the type was changed');
    }
    return this.resourceTypes.oldType || this.resourceTypes.newType!;
  }

  public get changeImpact(): ResourceImpact {
    // Check the Type first
    if (this.resourceTypes.oldType !== this.resourceTypes.newType) {
      if (this.resourceTypes.oldType === undefined) { return ResourceImpact.WILL_CREATE; }
      if (this.resourceTypes.newType === undefined) {
        return this.oldValue!.DeletionPolicy === 'Retain'
          ? ResourceImpact.WILL_ORPHAN
          : ResourceImpact.WILL_DESTROY;
      }
      return ResourceImpact.WILL_REPLACE;
    }

    return Object.values(this.propertyUpdates)
           .map(elt => elt.changeImpact)
           .reduce(worstImpact, ResourceImpact.WILL_UPDATE);
  }

  public get count(): number {
    return Object.keys(this.propertyUpdates).length
      + Object.keys(this.otherChanges).length;
  }

  public forEach(cb: (type: 'Property' | 'Other', name: string, value: Difference<any> | PropertyDifference<any>) => any) {
    for (const key of Object.keys(this.propertyUpdates).sort()) {
      cb('Property', key, this.propertyUpdates[key]);
    }
    for (const key of Object.keys(this.otherChanges).sort()) {
      cb('Other', key, this.otherChanges[key]);
    }
  }
}

export function isPropertyDifference<T>(diff: Difference<T>): diff is PropertyDifference<T> {
  return (diff as PropertyDifference<T>).changeImpact !== undefined;
}

class NoDifferenceError extends Error {
  constructor(message: string) {
    super(`No difference: ${message}`);
  }
}