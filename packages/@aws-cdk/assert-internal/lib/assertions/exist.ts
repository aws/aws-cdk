import { Assertion } from '../assertion';
import { StackPathInspector } from '../inspector';

class ExistingResourceAssertion extends Assertion<StackPathInspector> {
  public description: string = 'an existing resource';

  constructor() {
    super();
  }

  public async assertUsing(inspector: StackPathInspector): Promise<boolean> {
    return await inspector.value !== undefined;
  }
}

export function exist(): Assertion<StackPathInspector> {
  return new ExistingResourceAssertion();
}
