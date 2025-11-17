import { Construct } from 'constructs';
import { Stack, App } from 'aws-cdk-lib/core';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as logs from 'aws-cdk-lib/aws-logs';
import type { IMixin } from '../../lib/core';
import {
  Mixin,
  Mixins,
} from '../../lib/core';

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
    return _construct instanceof s3.CfnBucket;
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
      expect(mixin.validate(construct)).toEqual([]);

      const result = mixin.applyTo(construct);
      expect((result as any).mixinApplied).toBe(true);
    });

    test('selective mixin only applies to supported constructs', () => {
      const bucket = new s3.CfnBucket(stack, 'Bucket');
      const logGroup = new logs.CfnLogGroup(stack, 'LogGroup');
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
      const bucket = new s3.CfnBucket(stack, 'Bucket');
      const logGroup = new logs.CfnLogGroup(stack, 'LogGroup');
      const mixin = new SelectiveMixin();

      Mixins.of(stack).apply(mixin);
      expect((bucket as any).selectiveMixinApplied).toBe(true);
      expect((logGroup as any).selectiveMixinApplied).toBeUndefined();
    });

    test('mustApply throws when no constructs match', () => {
      const logGroup = new logs.CfnLogGroup(stack, 'LogGroup');
      const mixin = new SelectiveMixin();

      expect(() => {
        Mixins.of(logGroup).mustApply(mixin);
      }).toThrow();
    });

    test('validation errors cause exceptions', () => {
      const construct = new TestConstruct(stack, 'test');
      const mixin = new ValidatingMixin();

      expect(() => {
        Mixins.of(construct).apply(mixin);
      }).toThrow();
    });

    test('mustApply succeeds when at least one construct matches', () => {
      const bucket = new s3.CfnBucket(stack, 'Bucket');
      new logs.CfnLogGroup(stack, 'LogGroup');
      const mixin = new SelectiveMixin();

      expect(() => {
        Mixins.of(stack).mustApply(mixin);
      }).not.toThrow();

      expect((bucket as any).selectiveMixinApplied).toBe(true);
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
      expect(mixin.validate(construct)).toEqual([]);
      expect(mixin.applyTo(construct)).toBe(construct);
    });
  });
});
