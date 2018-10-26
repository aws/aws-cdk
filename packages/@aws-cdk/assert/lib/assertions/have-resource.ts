import { Assertion } from "../assertion";
import { StackInspector } from "../inspector";

/**
 * An assertion to check whether a resource of a given type and with the given properties exists, disregarding properties
 *
 * Properties can be:
 *
 * - An object, in which case its properties will be compared to those of the actual resource found
 * - A callable, in which case it will be treated as a predicate that is applied to the Properties of the found resources.
 */
export function haveResource(resourceType: string, properties?: any, comparison?: ResourcePart): Assertion<StackInspector> {
  return new HaveResourceAssertion(resourceType, properties, comparison);
}

type PropertyPredicate = (props: any, inspection: InspectionFailure) => boolean;

class HaveResourceAssertion extends Assertion<StackInspector> {
  private inspected: InspectionFailure[] = [];
  private readonly part: ResourcePart;
  private readonly predicate: PropertyPredicate;

  constructor(private readonly resourceType: string,
              private readonly properties?: any,
              part?: ResourcePart) {
    super();

    this.predicate = typeof properties === 'function' ? properties : makeSuperObjectPredicate(properties);
    this.part = part !== undefined ? part : ResourcePart.Properties;
  }

  public assertUsing(inspector: StackInspector): boolean {
    for (const logicalId of Object.keys(inspector.value.Resources)) {
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

  public assertOrThrow(inspector: StackInspector) {
    if (!this.assertUsing(inspector)) {
      const lines: string[] = [];
      lines.push(`None of ${this.inspected.length} resources matches ${this.description}.`);

      for (const inspected of this.inspected) {
        lines.push(`- ${inspected.failureReason} in:`);
        lines.push(indent(4, JSON.stringify(inspected.resource, null, 2)));
      }

      throw new Error(lines.join('\n'));
    }
  }

  public get description(): string {
    // tslint:disable-next-line:max-line-length
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
function makeSuperObjectPredicate(obj: any) {
  return (resourceProps: any, inspection: InspectionFailure) => {
    const errors: string[] = [];
    const ret = isSuperObject(resourceProps, obj, errors);
    inspection.failureReason = errors.join(',');
    return ret;
  };
}

interface InspectionFailure {
  resource: any;
  failureReason: string;
}

/**
 * Return whether `superObj` is a super-object of `obj`.
 *
 * A super-object has the same or more property values, recursing into nested objects.
 */
export function isSuperObject(superObj: any, obj: any, errors: string[]): boolean {
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
      if (!isSuperObject(superObj[i], obj[i], [])) {
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

      if (!isSuperObject(superObj[key], obj[key], [])) {
        errors.push(`Field ${key} mismatch`);
      }
    }
    return errors.length === 0;
  }

  if (superObj !== obj) {
    errors.push('Different values');
  }
  return errors.length === 0;
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
