import { Inspector } from "./inspector";

export abstract class Assertion<InspectorClass extends Inspector> {
  public abstract readonly description: string;

  public abstract assertUsing(inspector: InspectorClass): boolean;

  /**
   * Assert this thing and another thing
   */
  public and(assertion: Assertion<InspectorClass>): Assertion<InspectorClass> {
    // Needs to delegate to a function so that we can import mutually dependent classes in the right order
    return and(this, assertion);
  }

  public assertOrThrow(inspector: InspectorClass) {
    if (!this.assertUsing(inspector)) {
      throw new Error(`${JSON.stringify(inspector.value, null, 2)} does not match ${this.description}`);
    }
  }
}

import { AndAssertion } from "./assertions/and-assertion";

function and<I extends Inspector>(left: Assertion<I>, right: Assertion<I>): Assertion<I> {
  return new AndAssertion(left, right);
}

import { NegatedAssertion } from "./assertions/negated-assertion";

export function not<T extends Inspector>(assertion: Assertion<T>): Assertion<T> {
  return new NegatedAssertion(assertion);
}
