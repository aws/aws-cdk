import { Assertion } from '../assertion';
import { Inspector } from '../inspector';

export class NegatedAssertion<I extends Inspector> extends Assertion<I> {
  constructor(private readonly negated: Assertion<I>) {
    super();
  }

  public assertUsing(inspector: I): boolean {
    return !this.negated.assertUsing(inspector);
  }

  public get description(): string {
    return `not ${this.negated.description}`;
  }
}
