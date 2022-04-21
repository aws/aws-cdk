import { Assertion } from '../assertion';
import { Inspector } from '../inspector';

export class AndAssertion<InspectorClass extends Inspector> extends Assertion<InspectorClass> {
  public description: string = 'Combined assertion';

  constructor(private readonly first: Assertion<InspectorClass>, private readonly second: Assertion<InspectorClass>) {
    super();
  }

  public async assertUsing(_inspector: InspectorClass): Promise<boolean> {
    throw new Error('This is never called');
  }

  public async assertOrThrow(inspector: InspectorClass): Promise<any> {
    await this.first.assertOrThrow(inspector);
    await this.second.assertOrThrow(inspector);
  }
}
