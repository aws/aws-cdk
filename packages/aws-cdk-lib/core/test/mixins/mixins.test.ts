import { Construct, type IMixin, type IConstruct } from 'constructs';
import { CfnLogGroup } from '../../../aws-logs';
import { CfnBucket } from '../../../aws-s3';
import { Stack, App } from '../../lib';
import { Mixin, Mixins } from '../../lib/mixins';

class Root extends Construct {
  constructor() {
    super(undefined as any, '');
  }
}

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

class SelectiveMixin implements IMixin {
  supports(_construct: any): boolean {
    return _construct instanceof CfnBucket;
  }

  applyTo(construct: any): any {
    (construct as any).selectiveMixinApplied = true;
    return construct;
  }
}

class ValidatingMixin implements IMixin {
  supports(_construct: any): boolean {
    return true;
  }

  validate(construct: any): string[] {
    if (!(construct as any).requiredProperty) {
      return ['Missing required property'];
    }
    return [];
  }

  applyTo(construct: any): any {
    return construct;
  }
}

describe('Core Mixins Framework', () => {
  let app: App;
  let stack: Stack;

  beforeEach(() => {
    app = new App();
    stack = new Stack(app, 'TestStack');
  });

  describe('IMixin', () => {
    test('mixin can be applied to supported construct', () => {
      const construct = new TestConstruct(stack, 'test');
      const mixin = new TestMixin();

      expect(mixin.supports(construct)).toBe(true);

      const result = mixin.applyTo(construct);
      expect((result as any).mixinApplied).toBe(true);
    });

    test('selective mixin only applies to supported constructs', () => {
      const bucket = new CfnBucket(stack, 'Bucket');
      const logGroup = new CfnLogGroup(stack, 'LogGroup');
      const mixin = new SelectiveMixin();

      expect(mixin.supports(bucket)).toBe(true);
      expect(mixin.supports(logGroup)).toBe(false);
    });

    test('validation errors are detected', () => {
      const construct = new TestConstruct(stack, 'test');
      const mixin = new ValidatingMixin();

      expect(mixin.validate(construct)).toEqual(['Missing required property']);

      (construct as any).requiredProperty = true;
      expect(mixin.validate(construct)).toEqual([]);
    });
  });

  describe('Mixins.of()', () => {
    test('applies mixin to single construct', () => {
      const construct = new TestConstruct(stack, 'test');
      const mixin = new TestMixin();

      Mixins.of(construct).apply(mixin);
      expect((construct as any).mixinApplied).toBe(true);
    });

    test('applies mixin to all constructs in scope', () => {
      const construct1 = new TestConstruct(stack, 'test1');
      const construct2 = new TestConstruct(stack, 'test2');
      const mixin = new TestMixin();

      Mixins.of(stack).apply(mixin);
      expect((construct1 as any).mixinApplied).toBe(true);
      expect((construct2 as any).mixinApplied).toBe(true);
    });

    test('skips unsupported constructs', () => {
      const bucket = new CfnBucket(stack, 'Bucket');
      const logGroup = new CfnLogGroup(stack, 'LogGroup');
      const mixin = new SelectiveMixin();

      Mixins.of(stack).apply(mixin);
      expect((bucket as any).selectiveMixinApplied).toBe(true);
      expect((logGroup as any).selectiveMixinApplied).toBeUndefined();
    });

    test('requireAny throws when no constructs match', () => {
      new CfnLogGroup(stack, 'LogGroup');
      const mixin = new SelectiveMixin();

      expect(() => {
        Mixins.of(stack).requireAny().apply(mixin);
      }).toThrow();
    });

    test('requireAll throws when some constructs do not support mixin', () => {
      new CfnBucket(stack, 'Bucket');
      new CfnLogGroup(stack, 'LogGroup');
      const mixin = new SelectiveMixin();

      expect(() => {
        Mixins.of(stack).requireAll().apply(mixin);
      }).toThrow();
    });

    test('report returns successful mixin applications', () => {
      const bucket = new CfnBucket(stack, 'Bucket');
      new CfnLogGroup(stack, 'LogGroup');
      const mixin = new SelectiveMixin();

      const applicator = Mixins.of(stack).apply(mixin);

      expect(applicator.report).toEqual([{ construct: bucket, mixin }]);
    });

    test('applies mixins in order, completing each mixin before the next', () => {
      const root = new Root();
      new Construct(root, 'child');

      const order: string[] = [];
      const mixin1 = {
        supports: () => true,
        applyTo: (c: IConstruct) => order.push(`m1:${c.node.id || 'root'}`),
      };
      const mixin2 = {
        supports: () => true,
        applyTo: (c: IConstruct) => order.push(`m2:${c.node.id || 'root'}`),
      };

      Mixins.of(root).apply(mixin1, mixin2);

      expect(order).toEqual(['m1:root', 'm1:child', 'm2:root', 'm2:child']);
    });

    test('does not apply mixins to constructs added by other mixins', () => {
      const root = new Root();

      const applied: string[] = [];
      const addingMixin = {
        supports: (c: IConstruct) => c.node.id === '',
        applyTo: (c: IConstruct) => new Construct(c, 'added-by-mixin'),
      };
      const trackingMixin = {
        supports: () => true,
        applyTo: (c: IConstruct) => applied.push(c.node.id || 'root'),
      };

      Mixins.of(root).apply(addingMixin, trackingMixin);

      expect(applied).toEqual(['root']);
      expect(root.node.findChild('added-by-mixin')).toBeDefined();
    });
  });

  describe('Mixin base class', () => {
    test('provides default implementations', () => {
      class SimpleMixin extends Mixin {
        applyTo(construct: any): any {
          return construct;
        }
      }

      const mixin = new SimpleMixin();
      const construct = new TestConstruct(stack, 'test');

      expect(mixin.supports(construct)).toBe(true);
      expect(mixin.applyTo(construct)).toBe(construct);
    });
  });
});
