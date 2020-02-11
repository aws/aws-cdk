import { Assertion } from "../assertion";
import { StackInspector } from "../inspector";

/**
 * An assertion to check whether a resource of a given type and with the given properties exists, disregarding properties
 */
export function countResources(resourceType: string, count = 1): Assertion<StackInspector> {
  return new CountResourcesAssertion(resourceType, count);
}

/**
 * An assertion to check whether a resource of a given type and with the given properties exists, considering properties
 */
export function countResourcesLike(resourceType: string, count = 1, props: any): Assertion<StackInspector> {
  return new CountResourcesAssertion(resourceType, count, props);
}

class CountResourcesAssertion extends Assertion<StackInspector> {
  private inspected: number = 0;
  private readonly props: any;

  constructor(private readonly resourceType: string,
              private readonly count: number,
              props: any = null) {
    super();
    this.props = props;
  }

  public assertUsing(inspector: StackInspector): boolean {
    let counted = 0;
    for (const logicalId of Object.keys(inspector.value.Resources || {})) {
      const resource = inspector.value.Resources[logicalId];
      if (resource.Type === this.resourceType) {
        if (this.props) {
          const propEntries = Object.entries(this.props);
          propEntries.forEach(([key, val]) => {
            if (resource.Properties && resource.Properties[key] && JSON.stringify(resource.Properties[key]) === JSON.stringify(val)) {
              counted++;
              this.inspected += 1;
            }
          });
        } else {
          counted++;
          this.inspected += 1;
        }
      }
    }

    return counted === this.count;
  }

  public get description(): string {
    return `stack only has ${this.inspected} resource of type ${this.resourceType}${this.props ? ' with specified properties' : ''} but we expected to find ${this.count}`;
  }
}
