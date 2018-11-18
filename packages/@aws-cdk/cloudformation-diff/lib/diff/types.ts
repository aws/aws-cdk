import { AssertionError } from 'assert';
import { deepEqual } from './util';

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
  /** Property-level changes on the resource */
  public readonly propertyChanges: { [key: string]: PropertyDifference<any> };
  /** Changes to non-property level attributes of the resource */
  public readonly otherChanges: { [key: string]: Difference<any> };

  /** The resource type (or old and new type if it has changed) */
  private readonly resourceType: { readonly oldType: string, readonly newType: string };

  constructor(oldValue: Resource | undefined,
              newValue: Resource | undefined,
              args: {
          resourceType: { oldType: string, newType: string },
          propertyChanges: { [key: string]: Difference<any> },
          otherChanges: { [key: string]: Difference<any> }
        }
  ) {
    super(oldValue, newValue);
    this.resourceType = args.resourceType;
    this.propertyChanges = args.propertyChanges;
    this.otherChanges = args.otherChanges;
  }

  public get oldResourceType(): string | undefined {
    return this.resourceType.oldType;
  }

  public get newResourceType(): string | undefined {
    return this.resourceType.newType;
  }

  public get changeImpact(): ResourceImpact {
    // Check the Type first
    if (this.resourceType.oldType !== this.resourceType.newType) {
      if (this.resourceType.oldType === undefined) { return ResourceImpact.WILL_CREATE; }
      if (this.resourceType.newType === undefined) {
        return this.oldValue!.DeletionPolicy === 'Retain'
          ? ResourceImpact.WILL_ORPHAN
          : ResourceImpact.WILL_DESTROY;
      }
      return ResourceImpact.WILL_REPLACE;
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
