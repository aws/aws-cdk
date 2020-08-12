import { Assertion, JestFriendlyAssertion } from '../assertion';
import { StackInspector } from '../inspector';
import { isSuperObject } from './have-resource';

/**
 * An assertion to check whether a resource of a given type and with the given properties exists, disregarding properties
 */
export function countResources(resourceType: string, count = 1): JestFriendlyAssertion<StackInspector> {
  return new CountResourcesAssertion(resourceType, count);
}

/**
 * An assertion to check whether a resource of a given type and with the given properties exists, considering properties
 */
export function countResourcesLike(resourceType: string, count = 1, props: any): Assertion<StackInspector> {
  return new CountResourcesAssertion(resourceType, count, props);
}

class CountResourcesAssertion extends JestFriendlyAssertion<StackInspector> {
  private inspected: number = 0;
  private readonly props: any;

  constructor(
    private readonly resourceType: string,
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
          if (isSuperObject(resource.Properties, this.props, [], true)) {
            counted++;
            this.inspected += 1;
          }
        } else {
          counted++;
          this.inspected += 1;
        }
      }
    }

    return counted === this.count;
  }

  public generateErrorMessage(): string {
    return this.description;
  }

  public get description(): string {
    return `stack only has ${this.inspected} resource of type ${this.resourceType}${this.props ? ' with specified properties' : ''} but we expected to find ${this.count}`;
  }
}
