import { Assertion } from "../assertion";
import { StackInspector } from "../inspector";

/**
 * An assertion to check whether a resource of a given type and with the given properties exists, disregarding properties
 *
 * @param resourceType the type of the resource that is expected to be present.
 * @param properties   the properties that the resource is expected to have. A function may be provided, in which case
 *                     it will be called with the properties of candidate resources and an ``InspectionFailure``
 *                     instance on which errors should be appended, and should return a truthy value to denote a match.
 * @param comparison   the entity that is being asserted against.
 * @param allowValueExtension if properties is an object, tells whether values must match exactly, or if they are
 *                     allowed to be supersets of the reference values. Meaningless if properties is a function.
 */
export function haveResource(resourceType: string,
                             properties?: any,
                             comparison?: ResourcePart,
                             allowValueExtension: boolean = false): Assertion<StackInspector> {
  return new HaveResourceAssertion(resourceType, properties, comparison, allowValueExtension);
}

/**
 * Sugar for calling ``haveResources`` with ``allowValueExtension`` set to ``true``.
 */
export function haveResourceLike(resourceType: string,
                                 properties?: any,
                                 comparison?: ResourcePart) {
  return haveResource(resourceType, properties, comparison, true);
}

type PropertyPredicate = (props: any, inspection: InspectionFailure) => boolean;

export class HaveResourceAssertion extends Assertion<StackInspector> {
  private inspected: InspectionFailure[] = [];
  private readonly part: ResourcePart;
  private readonly predicate: PropertyPredicate;

  constructor(private readonly resourceType: string,
              private readonly properties?: any,
              part?: ResourcePart,
              allowValueExtension: boolean = false) {
    super();

    this.predicate = typeof properties === 'function' ? properties : makeSuperObjectPredicate(properties, allowValueExtension);
    this.part = part !== undefined ? part : ResourcePart.Properties;
  }

  public assertUsing(inspector: StackInspector): boolean {
    for (const logicalId of Object.keys(inspector.value.Resources || {})) {
      const resource = inspector.value.Resources[logicalId];
      if (resource.Type === this.resourceType) {
        const propsToCheck = this.part === ResourcePart.Properties ? resource.Properties : resource;

        // Pass inspection object as 2nd argument, initialize failure with default string,
        // to maintain backwards compatibility with old predicate API.
        const inspection = { resource, failureReason: 'Object did not match predicate' };

        if (this.predicate(propsToCheck, inspection)) {
          return true;
        }

        this.inspected.push(inspection);
      }
    }

    return false;
  }

  public generateErrorMessage() {
    const lines: string[] = [];
    lines.push(`None of ${this.inspected.length} resources matches ${this.description}.`);

    for (const inspected of this.inspected) {
      lines.push(`- ${inspected.failureReason} in:`);
      lines.push(indent(4, JSON.stringify(inspected.resource, null, 2)));
    }

    return lines.join('\n');
  }

  public assertOrThrow(inspector: StackInspector) {
    if (!this.assertUsing(inspector)) {
      throw new Error(this.generateErrorMessage());
    }
  }

  public get description(): string {
    return `resource '${this.resourceType}' with properties ${JSON.stringify(this.properties, undefined, 2)}`;
  }
}

function indent(n: number, s: string) {
  const prefix = ' '.repeat(n);
  return prefix + s.replace(/\n/g, '\n' + prefix);
}

/**
 * Make a predicate that checks property superset
 */
function makeSuperObjectPredicate(obj: any, allowValueExtension: boolean) {
  return (resourceProps: any, inspection: InspectionFailure) => {
    const errors: string[] = [];
    const ret = isSuperObject(resourceProps, obj, errors, allowValueExtension);
    inspection.failureReason = errors.join(',');
    return ret;
  };
}

export interface InspectionFailure {
  resource: any;
  failureReason: string;
}

/**
 * Return whether `superObj` is a super-object of `obj`.
 *
 * A super-object has the same or more property values, recursing into sub properties if ``allowValueExtension`` is true.
 */
export function isSuperObject(superObj: any, obj: any, errors: string[] = [], allowValueExtension: boolean = false): boolean {
  if (obj == null) { return true; }
  if (Array.isArray(superObj) !== Array.isArray(obj)) {
    errors.push('Array type mismatch');
    return false;
  }
  if (Array.isArray(superObj)) {
    if (obj.length !== superObj.length) {
      errors.push('Array length mismatch');
      return false;
    }

    // Do isSuperObject comparison for individual objects
    for (let i = 0; i < obj.length; i++) {
      if (!isSuperObject(superObj[i], obj[i], [], allowValueExtension)) {
        errors.push(`Array element ${i} mismatch`);
      }
    }
    return errors.length === 0;
  }
  if ((typeof superObj === 'object') !== (typeof obj === 'object')) {
    errors.push('Object type mismatch');
    return false;
  }
  if (typeof obj === 'object') {
    for (const key of Object.keys(obj)) {
      if (!(key in superObj)) {
        errors.push(`Field ${key} missing`);
        continue;
      }

      const valueMatches = allowValueExtension
                         ? isSuperObject(superObj[key], obj[key], [], allowValueExtension)
                         : isStrictlyEqual(superObj[key], obj[key]);
      if (!valueMatches) {
        errors.push(`Field ${key} mismatch`);
      }
    }
    return errors.length === 0;
  }

  if (superObj !== obj) {
    errors.push('Different values');
  }
  return errors.length === 0;

  function isStrictlyEqual(left: any, right: any): boolean {
    if (left === right) { return true; }
    if (typeof left !== typeof right) { return false; }
    if (typeof left === 'object' && typeof right === 'object') {
      if (Array.isArray(left) !== Array.isArray(right)) { return false; }
      const allKeys = new Set<string>([...Object.keys(left), ...Object.keys(right)]);
      for (const key of allKeys) {
        if (!isStrictlyEqual(left[key], right[key])) {
          return false;
        }
      }
      return true;
    }
    return false;
  }
}

/**
 * What part of the resource to compare
 */
export enum ResourcePart {
  /**
   * Only compare the resource's properties
   */
  Properties,

  /**
   * Check the entire CloudFormation config
   *
   * (including UpdateConfig, DependsOn, etc.)
   */
  CompleteDefinition
}
