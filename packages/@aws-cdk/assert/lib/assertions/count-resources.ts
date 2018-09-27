import { Assertion } from "../assertion";
import { StackInspector } from "../inspector";

/**
 * An assertion to check whether a resource of a given type and with the given properties exists, disregarding properties
 */
export function countResources(resourceType: string, count = 1): Assertion<StackInspector> {
  return new CountResourcesAssertion(resourceType, count);
}

class CountResourcesAssertion extends Assertion<StackInspector> {
  private inspected: number = 0;

  constructor(private readonly resourceType: string,
              private readonly count: number) {
    super();
  }

  public assertUsing(inspector: StackInspector): boolean {
    let counted = 0;
    for (const logicalId of Object.keys(inspector.value.Resources || {})) {
      const resource = inspector.value.Resources[logicalId];
      if (resource.Type === this.resourceType) {
        counted++;
        this.inspected += 1;
      }
    }

    return counted === this.count;
  }

  public get description(): string {
    return `stack only has ${this.inspected} resource of type ${this.resourceType} but we expected to find ${this.count}`;
  }
}
