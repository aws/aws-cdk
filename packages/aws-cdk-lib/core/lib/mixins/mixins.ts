import type { IConstruct, IMixin } from 'constructs';
import { MixinApplicator } from './applicator';
import type { IConstructSelector } from './selectors';

const MIXIN_SYMBOL = Symbol.for('@aws-cdk/core.Mixin');

/**
 * Main entry point for applying mixins.
 */
export class Mixins {
  /**
   * Creates a MixinApplicator for the given scope.
   */
  static of(scope: IConstruct, selector?: IConstructSelector): MixinApplicator {
    return new MixinApplicator(scope, selector);
  }
}

/**
 * Abstract base class for mixins that provides default implementations.
 */
export abstract class Mixin implements IMixin {
  /**
   * Checks if `x` is a Mixin.
   *
   * @param x Any object
   * @returns true if `x` is an object created from a class which extends `Mixin`.
   */
  static isMixin(x: any): x is Mixin {
    return x != null && typeof x === 'object' && MIXIN_SYMBOL in x;
  }

  constructor() {
    Object.defineProperty(this, MIXIN_SYMBOL, { value: true });
  }

  public supports(_construct: IConstruct): boolean {
    return true;
  }

  abstract applyTo(construct: IConstruct): void;
}
