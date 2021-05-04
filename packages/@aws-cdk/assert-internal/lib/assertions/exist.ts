import { Assertion } from '../assertion';
import { StackPathInspector } from '../inspector';

class ExistingResourceAssertion extends Assertion<StackPathInspector> {
  public description: string = 'an existing resource';

  constructor() {
    super();
  }

  public assertUsing(inspector: StackPathInspector): boolean {
    return inspector.value !== undefined;
  }
}

export function exist(): Assertion<StackPathInspector> {
  return new ExistingResourceAssertion();
}
