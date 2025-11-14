import type { IConstruct } from 'constructs';
import type { IMixin } from '../core';
import { Mixins, ConstructSelector } from '../core';

/**
 * Adds mixin functionality to constructs.
 * This is the implementation for the .with() syntactic sugar.
 */
function withMixin(construct: IConstruct, mixin: IMixin): IConstruct {
  Mixins.of(construct, ConstructSelector.cfnResource()).apply(mixin);
  return construct;
}

/**
 * Helper class that provides the .with() method for constructs.
 * Use this as a wrapper when you want fluent mixin application.
 */
class MixinWrapper {
  constructor(private readonly construct: IConstruct) {}

  /**
   * Applies a mixin to the wrapped construct.
   */
  with(mixin: IMixin): MixinWrapper {
    withMixin(this.construct, mixin);
    return this;
  }

  /**
   * Returns the wrapped construct.
   */
  unwrap(): IConstruct {
    return this.construct;
  }
}

/**
 * Wraps a construct to enable fluent mixin application.
 */
export function wrap(construct: IConstruct): MixinWrapper {
  return new MixinWrapper(construct);
}
