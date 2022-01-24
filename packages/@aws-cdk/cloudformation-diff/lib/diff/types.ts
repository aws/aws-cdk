import { AssertionError } from 'assert';
import * as cfnspec from '@aws-cdk/cfnspec';
import * as chalk from 'chalk';
import { DiffableCollection } from '../diffable';
import { ManagedPolicyAttachment, ManagedPolicyJson } from '../iam/managed-policy';
import { parseLambdaPermission, parseStatements, Statement, StatementJson } from '../iam/statement';
import { RuleJson, SecurityGroupRule } from '../network/security-group-rule';
import { renderIntrinsics } from '../render-intrinsics';
import { deepRemoveUndefined, dropIfEmpty, flatMap, makeComparator } from '../util';
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
      if (!resourceChange) { continue; }

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

      // Even though it's not physically possible in CFN, let's pretend to handle a change of 'Type'.
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

export interface IamChangesProps {
  propertyChanges: PropertyChange[];
  resourceChanges: ResourceChange[];
}

/**
 * Changes to IAM statements
 */
export class IamChanges {
  public static IamPropertyScrutinies = [
    cfnspec.schema.PropertyScrutinyType.InlineIdentityPolicies,
    cfnspec.schema.PropertyScrutinyType.InlineResourcePolicy,
    cfnspec.schema.PropertyScrutinyType.ManagedPolicies,
  ];

  public static IamResourceScrutinies = [
    cfnspec.schema.ResourceScrutinyType.ResourcePolicyResource,
    cfnspec.schema.ResourceScrutinyType.IdentityPolicyResource,
    cfnspec.schema.ResourceScrutinyType.LambdaPermission,
  ];

  public readonly statements = new DiffableCollection<Statement>();
  public readonly managedPolicies = new DiffableCollection<ManagedPolicyAttachment>();

  constructor(props: IamChangesProps) {
    for (const propertyChange of props.propertyChanges) {
      this.readPropertyChange(propertyChange);
    }
    for (const resourceChange of props.resourceChanges) {
      this.readResourceChange(resourceChange);
    }

    this.statements.calculateDiff();
    this.managedPolicies.calculateDiff();
  }

  public get hasChanges() {
    return this.statements.hasChanges || this.managedPolicies.hasChanges;
  }

  /**
   * Return whether the changes include broadened permissions
   *
   * Permissions are broadened if positive statements are added or
   * negative statements are removed, or if managed policies are added.
   */
  public get permissionsBroadened(): boolean {
    return this.statements.additions.some(s => !s.isNegativeStatement)
        || this.statements.removals.some(s => s.isNegativeStatement)
        || this.managedPolicies.hasAdditions;
  }

  /**
   * Return a summary table of changes
   */
  public summarizeStatements(): string[][] {
    const ret: string[][] = [];

    const header = ['', 'Resource', 'Effect', 'Action', 'Principal', 'Condition'];

    // First generate all lines, then sort on Resource so that similar resources are together
    for (const statement of this.statements.additions) {
      const renderedStatement = statement.render();
      ret.push([
        '+',
        renderedStatement.resource,
        renderedStatement.effect,
        renderedStatement.action,
        renderedStatement.principal,
        renderedStatement.condition,
      ].map(s => chalk.green(s)));
    }
    for (const statement of this.statements.removals) {
      const renderedStatement = statement.render();
      ret.push([
        chalk.red('-'),
        renderedStatement.resource,
        renderedStatement.effect,
        renderedStatement.action,
        renderedStatement.principal,
        renderedStatement.condition,
      ].map(s => chalk.red(s)));
    }

    // Sort by 2nd column
    ret.sort(makeComparator((row: string[]) => [row[1]]));

    ret.splice(0, 0, header);

    return ret;
  }

  public summarizeManagedPolicies(): string[][] {
    const ret: string[][] = [];
    const header = ['', 'Resource', 'Managed Policy ARN'];

    for (const att of this.managedPolicies.additions) {
      ret.push([
        '+',
        att.identityArn,
        att.managedPolicyArn,
      ].map(s => chalk.green(s)));
    }
    for (const att of this.managedPolicies.removals) {
      ret.push([
        '-',
        att.identityArn,
        att.managedPolicyArn,
      ].map(s => chalk.red(s)));
    }

    // Sort by 2nd column
    ret.sort(makeComparator((row: string[]) => [row[1]]));

    ret.splice(0, 0, header);

    return ret;
  }

  /**
   * Return a machine-readable version of the changes.
   * This is only used in tests.
   *
   * @internal
   */
  public _toJson(): IamChangesJson {
    return deepRemoveUndefined({
      statementAdditions: dropIfEmpty(this.statements.additions.map(s => s._toJson())),
      statementRemovals: dropIfEmpty(this.statements.removals.map(s => s._toJson())),
      managedPolicyAdditions: dropIfEmpty(this.managedPolicies.additions.map(s => s._toJson())),
      managedPolicyRemovals: dropIfEmpty(this.managedPolicies.removals.map(s => s._toJson())),
    });
  }

  private readPropertyChange(propertyChange: PropertyChange) {
    switch (propertyChange.scrutinyType) {
      case cfnspec.schema.PropertyScrutinyType.InlineIdentityPolicies:
        // AWS::IAM::{ Role | User | Group }.Policies
        this.statements.addOld(...this.readIdentityPolicies(propertyChange.oldValue, propertyChange.resourceLogicalId));
        this.statements.addNew(...this.readIdentityPolicies(propertyChange.newValue, propertyChange.resourceLogicalId));
        break;
      case cfnspec.schema.PropertyScrutinyType.InlineResourcePolicy:
        // Any PolicyDocument on a resource (including AssumeRolePolicyDocument)
        this.statements.addOld(...this.readResourceStatements(propertyChange.oldValue, propertyChange.resourceLogicalId));
        this.statements.addNew(...this.readResourceStatements(propertyChange.newValue, propertyChange.resourceLogicalId));
        break;
      case cfnspec.schema.PropertyScrutinyType.ManagedPolicies:
        // Just a list of managed policies
        this.managedPolicies.addOld(...this.readManagedPolicies(propertyChange.oldValue, propertyChange.resourceLogicalId));
        this.managedPolicies.addNew(...this.readManagedPolicies(propertyChange.newValue, propertyChange.resourceLogicalId));
        break;
    }
  }

  private readResourceChange(resourceChange: ResourceChange) {
    switch (resourceChange.scrutinyType) {
      case cfnspec.schema.ResourceScrutinyType.IdentityPolicyResource:
        // AWS::IAM::Policy
        this.statements.addOld(...this.readIdentityPolicyResource(resourceChange.oldProperties));
        this.statements.addNew(...this.readIdentityPolicyResource(resourceChange.newProperties));
        break;
      case cfnspec.schema.ResourceScrutinyType.ResourcePolicyResource:
        // AWS::*::{Bucket,Queue,Topic}Policy
        this.statements.addOld(...this.readResourcePolicyResource(resourceChange.oldProperties));
        this.statements.addNew(...this.readResourcePolicyResource(resourceChange.newProperties));
        break;
      case cfnspec.schema.ResourceScrutinyType.LambdaPermission:
        this.statements.addOld(...this.readLambdaStatements(resourceChange.oldProperties));
        this.statements.addNew(...this.readLambdaStatements(resourceChange.newProperties));
        break;
    }
  }

  /**
   * Parse a list of policies on an identity
   */
  private readIdentityPolicies(policies: any, logicalId: string): Statement[] {
    if (policies === undefined) { return []; }

    const appliesToPrincipal = 'AWS:${' + logicalId + '}';

    return flatMap(policies, (policy: any) => {
      // check if the Policy itself is not an intrinsic, like an Fn::If
      const unparsedStatement = policy.PolicyDocument?.Statement
        ? policy.PolicyDocument.Statement
        : policy;
      return defaultPrincipal(appliesToPrincipal, parseStatements(renderIntrinsics(unparsedStatement)));
    });
  }

  /**
   * Parse an IAM::Policy resource
   */
  private readIdentityPolicyResource(properties: any): Statement[] {
    if (properties === undefined) { return []; }

    properties = renderIntrinsics(properties);

    const principals = (properties.Groups || []).concat(properties.Users || []).concat(properties.Roles || []);
    return flatMap(principals, (principal: string) => {
      const ref = 'AWS:' + principal;
      return defaultPrincipal(ref, parseStatements(properties.PolicyDocument.Statement));
    });
  }

  private readResourceStatements(policy: any, logicalId: string): Statement[] {
    if (policy === undefined) { return []; }

    const appliesToResource = '${' + logicalId + '.Arn}';
    return defaultResource(appliesToResource, parseStatements(renderIntrinsics(policy.Statement)));
  }

  /**
   * Parse an AWS::*::{Bucket,Topic,Queue}policy
   */
  private readResourcePolicyResource(properties: any): Statement[] {
    if (properties === undefined) { return []; }

    properties = renderIntrinsics(properties);

    const policyKeys = Object.keys(properties).filter(key => key.indexOf('Policy') > -1);

    // Find the key that identifies the resource(s) this policy applies to
    const resourceKeys = Object.keys(properties).filter(key => !policyKeys.includes(key) && !key.endsWith('Name'));
    let resources = resourceKeys.length === 1 ? properties[resourceKeys[0]] : ['???'];

    // For some resources, this is a singleton string, for some it's an array
    if (!Array.isArray(resources)) {
      resources = [resources];
    }

    return flatMap(resources, (resource: string) => {
      return defaultResource(resource, parseStatements(properties[policyKeys[0]].Statement));
    });
  }

  private readManagedPolicies(policyArns: any, logicalId: string): ManagedPolicyAttachment[] {
    if (!policyArns) { return []; }

    const rep = '${' + logicalId + '}';
    return ManagedPolicyAttachment.parseManagedPolicies(rep, renderIntrinsics(policyArns));
  }

  private readLambdaStatements(properties?: PropertyMap): Statement[] {
    if (!properties) { return []; }

    return [parseLambdaPermission(renderIntrinsics(properties))];
  }
}

/**
 * Set an undefined or wildcarded principal on these statements
 */
function defaultPrincipal(principal: string, statements: Statement[]) {
  statements.forEach(s => s.principals.replaceEmpty(principal));
  statements.forEach(s => s.principals.replaceStar(principal));
  return statements;
}

/**
 * Set an undefined or wildcarded resource on these statements
 */
function defaultResource(resource: string, statements: Statement[]) {
  statements.forEach(s => s.resources.replaceEmpty(resource));
  statements.forEach(s => s.resources.replaceStar(resource));
  return statements;
}

export interface IamChangesJson {
  statementAdditions?: StatementJson[];
  statementRemovals?: StatementJson[];
  managedPolicyAdditions?: ManagedPolicyJson[];
  managedPolicyRemovals?: ManagedPolicyJson[];
}

export interface SecurityGroupChangesProps {
  ingressRulePropertyChanges: PropertyChange[];
  ingressRuleResourceChanges: ResourceChange[];
  egressRuleResourceChanges: ResourceChange[];
  egressRulePropertyChanges: PropertyChange[];
}

/**
 * Changes to IAM statements
 */
export class SecurityGroupChanges {
  public readonly ingress = new DiffableCollection<SecurityGroupRule>();
  public readonly egress = new DiffableCollection<SecurityGroupRule>();

  constructor(props: SecurityGroupChangesProps) {
    // Group rules
    for (const ingressProp of props.ingressRulePropertyChanges) {
      this.ingress.addOld(...this.readInlineRules(ingressProp.oldValue, ingressProp.resourceLogicalId));
      this.ingress.addNew(...this.readInlineRules(ingressProp.newValue, ingressProp.resourceLogicalId));
    }
    for (const egressProp of props.egressRulePropertyChanges) {
      this.egress.addOld(...this.readInlineRules(egressProp.oldValue, egressProp.resourceLogicalId));
      this.egress.addNew(...this.readInlineRules(egressProp.newValue, egressProp.resourceLogicalId));
    }

    // Rule resources
    for (const ingressRes of props.ingressRuleResourceChanges) {
      this.ingress.addOld(...this.readRuleResource(ingressRes.oldProperties));
      this.ingress.addNew(...this.readRuleResource(ingressRes.newProperties));
    }
    for (const egressRes of props.egressRuleResourceChanges) {
      this.egress.addOld(...this.readRuleResource(egressRes.oldProperties));
      this.egress.addNew(...this.readRuleResource(egressRes.newProperties));
    }

    this.ingress.calculateDiff();
    this.egress.calculateDiff();
  }

  public get hasChanges() {
    return this.ingress.hasChanges || this.egress.hasChanges;
  }

  /**
   * Return a summary table of changes
   */
  public summarize(): string[][] {
    const ret: string[][] = [];

    const header = ['', 'Group', 'Dir', 'Protocol', 'Peer'];

    const inWord = 'In';
    const outWord = 'Out';

    // Render a single rule to the table (curried function so we can map it across rules easily--thank you JavaScript!)
    const renderRule = (plusMin: string, inOut: string) => (rule: SecurityGroupRule) => [
      plusMin,
      rule.groupId,
      inOut,
      rule.describeProtocol(),
      rule.describePeer(),
    ].map(s => plusMin === '+' ? chalk.green(s) : chalk.red(s));

    // First generate all lines, sort later
    ret.push(...this.ingress.additions.map(renderRule('+', inWord)));
    ret.push(...this.egress.additions.map(renderRule('+', outWord)));
    ret.push(...this.ingress.removals.map(renderRule('-', inWord)));
    ret.push(...this.egress.removals.map(renderRule('-', outWord)));

    // Sort by group name then ingress/egress (ingress first)
    ret.sort(makeComparator((row: string[]) => [row[1], row[2].indexOf(inWord) > -1 ? 0 : 1]));

    ret.splice(0, 0, header);

    return ret;
  }

  public toJson(): SecurityGroupChangesJson {
    return deepRemoveUndefined({
      ingressRuleAdditions: dropIfEmpty(this.ingress.additions.map(s => s.toJson())),
      ingressRuleRemovals: dropIfEmpty(this.ingress.removals.map(s => s.toJson())),
      egressRuleAdditions: dropIfEmpty(this.egress.additions.map(s => s.toJson())),
      egressRuleRemovals: dropIfEmpty(this.egress.removals.map(s => s.toJson())),
    });
  }

  public get rulesAdded(): boolean {
    return this.ingress.hasAdditions
        || this.egress.hasAdditions;
  }

  private readInlineRules(rules: any, logicalId: string): SecurityGroupRule[] {
    if (!rules) { return []; }

    // UnCloudFormation so the parser works in an easier domain

    const ref = '${' + logicalId + '.GroupId}';
    return rules.map((r: any) => new SecurityGroupRule(renderIntrinsics(r), ref));
  }

  private readRuleResource(resource: any): SecurityGroupRule[] {
    if (!resource) { return []; }

    // UnCloudFormation so the parser works in an easier domain

    return [new SecurityGroupRule(renderIntrinsics(resource))];
  }
}

export interface SecurityGroupChangesJson {
  ingressRuleAdditions?: RuleJson[];
  ingressRuleRemovals?: RuleJson[];
  egressRuleAdditions?: RuleJson[];
  egressRuleRemovals?: RuleJson[];
}
