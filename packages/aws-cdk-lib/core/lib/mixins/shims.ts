import type { IConstruct, IMixin } from 'constructs';
import type { IAspect } from '../aspect';

/**
 * Converts between Mixins and Aspects.
 *
 * Since Mixins and Aspects are both implementations of the visitor pattern,
 * they can be converted from each other. Mixins are applied immediately (imperative),
 * while Aspects are applied during synthesis (declarative).
 */
export class Shims {
  /**
   * Wraps an Aspect as a Mixin.
   *
   * The resulting Mixin applies the Aspect's `visit()` immediately to every node.
   * The Aspect is applied to all constructs since Aspects don't have a `supports()` filter.
   *
   * @param aspect The Aspect to wrap
   */
  static asMixin(aspect: IAspect): IMixin {
    return {
      supports(_construct: IConstruct): boolean {
        return true;
      },
      applyTo(construct: IConstruct): void {
        aspect.visit(construct);
      },
    };
  }

  /**
   * Wraps a Mixin as an Aspect.
   *
   * The resulting Aspect defers the Mixin's application to the synthesis phase.
   * The Mixin's `supports()` method is used to filter which constructs are visited.
   *
   * @param mixin The Mixin to wrap
   */
  static asAspect(mixin: IMixin): IAspect {
    return {
      visit(node: IConstruct): void {
        if (mixin.supports(node)) {
          mixin.applyTo(node);
        }
      },
    };
  }

  private constructor() {}
}
