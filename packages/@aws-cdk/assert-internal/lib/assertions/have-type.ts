import { Assertion } from '../assertion';
import { StackPathInspector } from '../inspector';

export function haveType(type: string): Assertion<StackPathInspector> {
  return new StackPathHasTypeAssertion(type);
}

class StackPathHasTypeAssertion extends Assertion<StackPathInspector> {
  constructor(private readonly type: string) {
    super();
  }

  public assertUsing(inspector: StackPathInspector): boolean {
    const resource = inspector.value;
    return resource !== undefined && resource.Type === this.type;
  }

  public get description(): string {
    return `resource of type ${this.type}`;
  }
}
