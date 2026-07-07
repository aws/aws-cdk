import type { IConstruct } from 'constructs';
import { CfnBucket } from '../../../aws-s3';
import { App, Aspects, Stack } from '../../lib';
import type { IAspect } from '../../lib/aspect';
import { Mixin, Shims } from '../../lib/mixins';

class TrackingAspect implements IAspect {
  public visited: IConstruct[] = [];
  visit(node: IConstruct): void {
    this.visited.push(node);
  }
}

class BucketOnlyMixin extends Mixin {
  public applied: IConstruct[] = [];
  supports(construct: IConstruct): construct is CfnBucket {
    return construct instanceof CfnBucket;
  }
  applyTo(construct: IConstruct): void {
    this.applied.push(construct);
  }
}

class TrackingMixin extends Mixin {
  public applied: IConstruct[] = [];
  applyTo(construct: IConstruct): void {
    this.applied.push(construct);
  }
}

describe('Shims', () => {
  let app: App;
  let stack: Stack;

  beforeEach(() => {
    app = new App();
    stack = new Stack(app, 'TestStack');
  });

  describe('mixinFromAspect', () => {
    test('wraps an Aspect as a Mixin that visits every node', () => {
      const aspect = new TrackingAspect();
      const mixin = Shims.asMixin(aspect);

      new CfnBucket(stack, 'Bucket');
      stack.with(mixin);

      expect(aspect.visited.length).toBeGreaterThan(0);
      expect(aspect.visited.some(n => n instanceof CfnBucket)).toBe(true);
    });

    test('resulting Mixin supports all constructs', () => {
      const mixin = Shims.asMixin(new TrackingAspect());
      expect(mixin.supports(stack)).toBe(true);
    });
  });

  describe('aspectFromMixin', () => {
    test('wraps a Mixin as an Aspect that filters via supports()', () => {
      const mixin = new BucketOnlyMixin();
      const aspect = Shims.asAspect(mixin);

      new CfnBucket(stack, 'Bucket');
      Aspects.of(stack).add(aspect);
      app.synth();

      expect(mixin.applied.length).toBe(1);
      expect(mixin.applied[0]).toBeInstanceOf(CfnBucket);
    });

    test('skips unsupported constructs', () => {
      const mixin = new BucketOnlyMixin();
      const aspect = Shims.asAspect(mixin);

      // Stack has no CfnBucket children
      Aspects.of(stack).add(aspect);
      app.synth();

      expect(mixin.applied.length).toBe(0);
    });

    test('wraps a Mixin that supports all constructs', () => {
      const mixin = new TrackingMixin();
      const aspect = Shims.asAspect(mixin);

      new CfnBucket(stack, 'Bucket');
      Aspects.of(stack).add(aspect);
      app.synth();

      expect(mixin.applied.length).toBeGreaterThan(0);
    });
  });
});
