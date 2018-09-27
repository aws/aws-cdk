import { AssertionError } from 'assert';
import { deepEqual } from './util';

/** Semantic differences between two CloudFormation templates. */
export class TemplateDiff implements ITemplateDiff {
  public readonly awsTemplateFormatVersion?: Difference<string>;
  public readonly description?: Difference<string>;
  public readonly transform?: Difference<string>;
  public readonly conditions: DifferenceCollection<Condition, ConditionDifference>;
  public readonly mappings: DifferenceCollection<Mapping, MappingDifference>;
  public readonly metadata: DifferenceCollection<Metadata, MetadataDifference>;
  public readonly outputs: DifferenceCollection<Output, OutputDifference>;
  public readonly parameters: DifferenceCollection<Parameter, ParameterDifference>;
  public readonly resources: DifferenceCollection<Resource, ResourceDifference>;
  /** The differences in unknown/unexpected parts of the template */
  public readonly unknown: DifferenceCollection<any, Difference<any>>;

  public readonly count: number;

  constructor(args: ITemplateDiff) {
    let count = 0;
    if (args.awsTemplateFormatVersion !== undefined) {
      this.awsTemplateFormatVersion = args.awsTemplateFormatVersion;
      count += 1;
    }
    if (args.description !== undefined) {
      this.description = args.description;
      count += 1;
    }
    if (args.transform !== undefined) {
      this.transform = args.transform;
      count += 1;
    }

    this.conditions = args.conditions || new DifferenceCollection({});
    count += this.conditions.count;

    this.mappings = args.mappings || new DifferenceCollection({});
    count += this.mappings.count;

    this.metadata = args.metadata || new DifferenceCollection({});
    count += this.metadata.count;

    this.outputs = args.outputs || new DifferenceCollection({});
    count += this.outputs.count;

    this.parameters = args.parameters || new DifferenceCollection({});
    count += this.parameters.count;

    this.resources = args.resources || new DifferenceCollection({});
    count += this.resources.count;

    this.unknown = args.unknown || new DifferenceCollection({});
    count += this.unknown.count;

    this.count = count;
  }

  public get isEmpty(): boolean {
    return this.count === 0;
  }
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

  public forEach(cb: (logicalId: string, change: T) => any): void {
    for (const logicalId of this.logicalIds) {
      cb(logicalId, this.changes[logicalId]!);
    }
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
  /** The resource type (or old and new type if it has changed) */
  public readonly resourceType: string | { readonly oldType: string, readonly newType: string };
  /** Property-level changes on the resource */
  public readonly propertyChanges: { [key: string]: PropertyDifference<any> };
  /** Changes to non-property level attributes of the resource */
  public readonly otherChanges: { [key: string]: Difference<any> };

  constructor(oldValue: Resource | undefined,
              newValue: Resource | undefined,
              args: {
          resourceType: string | { oldType: string, newType: string },
          propertyChanges: { [key: string]: Difference<any> },
          otherChanges: { [key: string]: Difference<any> }
        }
  ) {
    super(oldValue, newValue);
    this.resourceType = args.resourceType;
    this.propertyChanges = args.propertyChanges;
    this.otherChanges = args.otherChanges;
  }

  public get changeImpact(): ResourceImpact {
    if (Object.keys(this.propertyChanges).length === 0) {
      if (typeof this.resourceType !== 'string') { return ResourceImpact.WILL_REPLACE; }
      if (!this.oldValue) { return ResourceImpact.WILL_CREATE; }
      return this.oldValue.DeletionPolicy === 'Retain'
        ? ResourceImpact.WILL_ORPHAN
        : ResourceImpact.WILL_DESTROY;
    }
    return Object.values(this.propertyChanges)
           .map(elt => elt.changeImpact)
           .reduce(worstImpact, ResourceImpact.WILL_UPDATE);
  }

  public get count(): number {
    return Object.keys(this.propertyChanges).length
      + Object.keys(this.otherChanges).length;
  }

  public forEach(cb: (type: 'Property' | 'Other', name: string, value: Difference<any> | PropertyDifference<any>) => any) {
    for (const key of Object.keys(this.propertyChanges).sort()) {
      cb('Property', key, this.propertyChanges[key]);
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
