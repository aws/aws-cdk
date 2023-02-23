import { AssertionError } from 'assert';
import * as cfnspec from '@aws-cdk/cfnspec';
import { deepEqual } from './util';
import { IamChanges } from '../iam/iam-changes';
import { SecurityGroupChanges } from '../network/security-group-changes';

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

  /**
   * Changes to Security Group ingress and egress rules
   */
  public readonly securityGroupChanges: SecurityGroupChanges;

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

    this.iamChanges = new IamChanges({
      propertyChanges: this.scrutinizablePropertyChanges(IamChanges.IamPropertyScrutinies),
      resourceChanges: this.scrutinizableResourceChanges(IamChanges.IamResourceScrutinies),
    });

    this.securityGroupChanges = new SecurityGroupChanges({
      egressRulePropertyChanges: this.scrutinizablePropertyChanges([cfnspec.schema.PropertyScrutinyType.EgressRules]),
      ingressRulePropertyChanges: this.scrutinizablePropertyChanges([cfnspec.schema.PropertyScrutinyType.IngressRules]),
      egressRuleResourceChanges: this.scrutinizableResourceChanges([cfnspec.schema.ResourceScrutinyType.EgressRuleResource]),
      ingressRuleResourceChanges: this.scrutinizableResourceChanges([cfnspec.schema.ResourceScrutinyType.IngressRuleResource]),
    });
  }

  public get differenceCount() {
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

    count += this.conditions.differenceCount;
    count += this.mappings.differenceCount;
    count += this.metadata.differenceCount;
    count += this.outputs.differenceCount;
    count += this.parameters.differenceCount;
    count += this.resources.differenceCount;
    count += this.unknown.differenceCount;

    return count;
  }

  public get isEmpty(): boolean {
    return this.differenceCount === 0;
  }

  /**
   * Return true if any of the permissions objects involve a broadening of permissions
   */
  public get permissionsBroadened(): boolean {
    return this.iamChanges.permissionsBroadened || this.securityGroupChanges.rulesAdded;
  }

  /**
   * Return true if any of the permissions objects have changed
   */
  public get permissionsAnyChanges(): boolean {
    return this.iamChanges.hasChanges || this.securityGroupChanges.hasChanges;
  }

  /**
   * Return all property changes of a given scrutiny type
   *
   * We don't just look at property updates; we also look at resource additions and deletions (in which
   * case there is no further detail on property values), and resource type changes.
   */
  private scrutinizablePropertyChanges(scrutinyTypes: cfnspec.schema.PropertyScrutinyType[]): PropertyChange[] {
    const ret = new Array<PropertyChange>();

    for (const [resourceLogicalId, resourceChange] of Object.entries(this.resources.changes)) {
      if (resourceChange.resourceTypeChanged) {
        // we ignore resource type changes here, and handle them in scrutinizableResourceChanges()
        continue;
      }

      const props = cfnspec.scrutinizablePropertyNames(resourceChange.newResourceType!, scrutinyTypes);
      for (const propertyName of props) {
        ret.push({
          resourceLogicalId,
          propertyName,
          resourceType: resourceChange.resourceType,
          scrutinyType: cfnspec.propertySpecification(resourceChange.resourceType, propertyName).ScrutinyType!,
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
  private scrutinizableResourceChanges(scrutinyTypes: cfnspec.schema.ResourceScrutinyType[]): ResourceChange[] {
    const ret = new Array<ResourceChange>();

    const scrutinizableTypes = new Set(cfnspec.scrutinizableResourceTypes(scrutinyTypes));

    for (const [resourceLogicalId, resourceChange] of Object.entries(this.resources.changes)) {
      if (!resourceChange) { continue; }

      const commonProps = {
        oldProperties: resourceChange.oldProperties,
        newProperties: resourceChange.newProperties,
        resourceLogicalId,
      };

      // changes to the Type of resources can happen when migrating from CFN templates that use Transforms
      if (resourceChange.resourceTypeChanged) {
        // Treat as DELETE+ADD
        if (scrutinizableTypes.has(resourceChange.oldResourceType!)) {
          ret.push({
            ...commonProps,
            newProperties: undefined,
            resourceType: resourceChange.oldResourceType!,
            scrutinyType: cfnspec.resourceSpecification(resourceChange.oldResourceType!).ScrutinyType!,
          });
        }
        if (scrutinizableTypes.has(resourceChange.newResourceType!)) {
          ret.push({
            ...commonProps,
            oldProperties: undefined,
            resourceType: resourceChange.newResourceType!,
            scrutinyType: cfnspec.resourceSpecification(resourceChange.newResourceType!).ScrutinyType!,
          });
        }
      } else {
        if (scrutinizableTypes.has(resourceChange.resourceType)) {
          ret.push({
            ...commonProps,
            resourceType: resourceChange.resourceType,
            scrutinyType: cfnspec.resourceSpecification(resourceChange.resourceType).ScrutinyType!,
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
   * Type of the resource
   */
  resourceType: string;

  /**
   * Scrutiny type for this property change
   */
  scrutinyType: cfnspec.schema.PropertyScrutinyType;

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
   * Scrutiny type for this resource change
   */
  scrutinyType: cfnspec.schema.ResourceScrutinyType;

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

export interface IDifference<ValueType> {
  readonly oldValue: ValueType | undefined;
  readonly newValue: ValueType | undefined;
  readonly isDifferent: boolean;
  readonly isAddition: boolean;
  readonly isRemoval: boolean;
  readonly isUpdate: boolean;
}

/**
 * Models an entity that changed between two versions of a CloudFormation template.
 */
export class Difference<ValueType> implements IDifference<ValueType> {
  /**
   * Whether this is an actual different or the values are actually the same
   *
   * isDifferent => (isUpdate | isRemoved | isUpdate)
   */
  public readonly isDifferent: boolean;

  /**
   * @param oldValue the old value, cannot be equal (to the sense of +deepEqual+) to +newValue+.
   * @param newValue the new value, cannot be equal (to the sense of +deepEqual+) to +oldValue+.
   */
  constructor(public readonly oldValue: ValueType | undefined, public readonly newValue: ValueType | undefined) {
    if (oldValue === undefined && newValue === undefined) {
      throw new AssertionError({ message: 'oldValue and newValue are both undefined!' });
    }
    this.isDifferent = !deepEqual(oldValue, newValue);
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

  constructor(oldValue: ValueType | undefined, newValue: ValueType | undefined, args: { changeImpact?: ResourceImpact }) {
    super(oldValue, newValue);
    this.changeImpact = args.changeImpact;
  }
}

export class DifferenceCollection<V, T extends IDifference<V>> {
  constructor(private readonly diffs: { [logicalId: string]: T }) {}

  public get changes(): { [logicalId: string]: T } {
    return onlyChanges(this.diffs);
  }

  public get differenceCount(): number {
    return Object.values(this.changes).length;
  }

  public get(logicalId: string): T {
    const ret = this.diffs[logicalId];
    if (!ret) { throw new Error(`No object with logical ID '${logicalId}'`); }
    return ret;
  }

  public get logicalIds(): string[] {
    return Object.keys(this.changes);
  }

  /**
   * Returns a new TemplateDiff which only contains changes for which `predicate`
   * returns `true`.
   */
  public filter(predicate: (diff: T | undefined) => boolean): DifferenceCollection<V, T> {
    const newChanges: { [logicalId: string]: T } = { };
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
  public forEachDifference(cb: (logicalId: string, change: T) => any): void {
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
      } else if (change.isDifferent) {
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
  awsTemplateFormatVersion?: IDifference<string>;
  description?: IDifference<string>;
  transform?: IDifference<string>;

  conditions?: DifferenceCollection<Condition, ConditionDifference>;
  mappings?: DifferenceCollection<Mapping, MappingDifference>;
  metadata?: DifferenceCollection<Metadata, MetadataDifference>;
  outputs?: DifferenceCollection<Output, OutputDifference>;
  parameters?: DifferenceCollection<Parameter, ParameterDifference>;
  resources?: DifferenceCollection<Resource, ResourceDifference>;

  unknown?: DifferenceCollection<any, IDifference<any>>;
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
  WILL_ORPHAN = 'WILL_ORPHAN',
  /** There is no change in this resource */
  NO_CHANGE = 'NO_CHANGE',
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
    [ResourceImpact.NO_CHANGE]: 0,
    [ResourceImpact.WILL_UPDATE]: 1,
    [ResourceImpact.WILL_CREATE]: 2,
    [ResourceImpact.WILL_ORPHAN]: 3,
    [ResourceImpact.MAY_REPLACE]: 4,
    [ResourceImpact.WILL_REPLACE]: 5,
    [ResourceImpact.WILL_DESTROY]: 6,
  };
  return badness[one] > badness[two] ? one : two;
}

export interface Resource {
  Type: string;
  Properties?: { [name: string]: any };

  [key: string]: any;
}

/**
 * Change to a single resource between two CloudFormation templates
 *
 * This class can be mutated after construction.
 */
export class ResourceDifference implements IDifference<Resource> {
  /**
   * Whether this resource was added
   */
  public readonly isAddition: boolean;

  /**
   * Whether this resource was removed
   */
  public readonly isRemoval: boolean;

  /** Property-level changes on the resource */
  private readonly propertyDiffs: { [key: string]: PropertyDifference<any> };

  /** Changes to non-property level attributes of the resource */
  private readonly otherDiffs: { [key: string]: Difference<any> };

  /** The resource type (or old and new type if it has changed) */
  private readonly resourceTypes: { readonly oldType?: string, readonly newType?: string };

  constructor(
    public readonly oldValue: Resource | undefined,
    public readonly newValue: Resource | undefined,
    args: {
      resourceType: { oldType?: string, newType?: string },
      propertyDiffs: { [key: string]: PropertyDifference<any> },
      otherDiffs: { [key: string]: Difference<any> }
    },
  ) {
    this.resourceTypes = args.resourceType;
    this.propertyDiffs = args.propertyDiffs;
    this.otherDiffs = args.otherDiffs;

    this.isAddition = oldValue === undefined;
    this.isRemoval = newValue === undefined;
  }

  public get oldProperties(): PropertyMap | undefined {
    return this.oldValue && this.oldValue.Properties;
  }

  public get newProperties(): PropertyMap | undefined {
    return this.newValue && this.newValue.Properties;
  }

  /**
   * Whether this resource was modified at all
   */
  public get isDifferent(): boolean {
    return this.differenceCount > 0 || this.oldResourceType !== this.newResourceType;
  }

  /**
   * Whether the resource was updated in-place
   */
  public get isUpdate(): boolean {
    return this.isDifferent && !this.isAddition && !this.isRemoval;
  }

  public get oldResourceType(): string | undefined {
    return this.resourceTypes.oldType;
  }

  public get newResourceType(): string | undefined {
    return this.resourceTypes.newType;
  }

  /**
   * All actual property updates
   */
  public get propertyUpdates(): { [key: string]: PropertyDifference<any> } {
    return onlyChanges(this.propertyDiffs);
  }

  /**
   * All actual "other" updates
   */
  public get otherChanges(): { [key: string]: Difference<any> } {
    return onlyChanges(this.otherDiffs);
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

  /**
   * Replace a PropertyChange in this object
   *
   * This affects the property diff as it is summarized to users, but it DOES
   * NOT affect either the "oldValue" or "newValue" values; those still contain
   * the actual template values as provided by the user (they might still be
   * used for downstream processing).
   */
  public setPropertyChange(propertyName: string, change: PropertyDifference<any>) {
    this.propertyDiffs[propertyName] = change;
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

    // Base impact (before we mix in the worst of the property impacts);
    // WILL_UPDATE if we have "other" changes, NO_CHANGE if there are no "other" changes.
    const baseImpact = Object.keys(this.otherChanges).length > 0 ? ResourceImpact.WILL_UPDATE : ResourceImpact.NO_CHANGE;

    return Object.values(this.propertyDiffs)
      .map(elt => elt.changeImpact)
      .reduce(worstImpact, baseImpact);
  }

  /**
   * Count of actual differences (not of elements)
   */
  public get differenceCount(): number {
    return Object.values(this.propertyUpdates).length
      + Object.values(this.otherChanges).length;
  }

  /**
   * Invoke a callback for each actual difference
   */
  public forEachDifference(cb: (type: 'Property' | 'Other', name: string, value: Difference<any> | PropertyDifference<any>) => any) {
    for (const key of Object.keys(this.propertyUpdates).sort()) {
      cb('Property', key, this.propertyUpdates[key]);
    }
    for (const key of Object.keys(this.otherChanges).sort()) {
      cb('Other', key, this.otherDiffs[key]);
    }
  }
}

export function isPropertyDifference<T>(diff: Difference<T>): diff is PropertyDifference<T> {
  return (diff as PropertyDifference<T>).changeImpact !== undefined;
}

/**
 * Filter a map of IDifferences down to only retain the actual changes
 */
function onlyChanges<V, T extends IDifference<V>>(xs: {[key: string]: T}): {[key: string]: T} {
  const ret: { [key: string]: T } = {};
  for (const [key, diff] of Object.entries(xs)) {
    if (diff.isDifferent) {
      ret[key] = diff;
    }
  }
  return ret;
}
