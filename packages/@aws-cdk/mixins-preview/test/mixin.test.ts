import { Construct } from 'constructs';
import { Mixin } from '../lib';

class TestConstruct extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);
  }
}

class TestMixin extends Mixin {
  applyTo(construct: any): any {
    (construct as any).mixinApplied = true;
    return construct;
  }
}

describe('IMixin', () => {
  test('mixin can be applied to supported construct', () => {
    const construct = new TestConstruct(new Construct(undefined as any, 'root'), 'test');
    const mixin = new TestMixin();

    expect(mixin.supports(construct)).toBe(true);
    expect(mixin.validate(construct)).toEqual([]);

    const result = mixin.applyTo(construct);
    expect((result as any).mixinApplied).toBe(true);
  });
});
