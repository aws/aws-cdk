import { Construct } from 'constructs';
import { Mixin } from '../../lib/mixins';

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

    const result = mixin.applyTo(construct);
    expect((result as any).mixinApplied).toBe(true);
  });
});

describe('Mixin', () => {
  test('isMixin returns true for Mixin instances', () => {
    const mixin = new TestMixin();
    expect(Mixin.isMixin(mixin)).toBe(true);
  });

  test('isMixin returns false for non-Mixin objects', () => {
    expect(Mixin.isMixin({})).toBe(false);
    expect(Mixin.isMixin(null)).toBe(false);
    expect(Mixin.isMixin(undefined)).toBe(false);
    expect(Mixin.isMixin('string')).toBe(false);
    expect(Mixin.isMixin(123)).toBe(false);
  });
});
