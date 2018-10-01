import { Assertion } from "../assertion";
import { Inspector } from "../inspector";

export class AndAssertion<InspectorClass extends Inspector> extends Assertion<InspectorClass> {
  public description: string = 'Combined assertion';

  constructor(private readonly first: Assertion<InspectorClass>, private readonly second: Assertion<InspectorClass>) {
    super();
  }

  public assertUsing(_inspector: InspectorClass): boolean {
    throw new Error('This is never called');
  }

  public assertOrThrow(inspector: InspectorClass) {
    this.first.assertOrThrow(inspector);
    this.second.assertOrThrow(inspector);
  }
}
