import type { IConstruct } from 'constructs';
import type { ConstructSelector } from './selectors';
import { MixinApplicator } from './applicator';

// this will change when we update the interface to deliberately break compatibility checks
const MIXIN_SYMBOL = Symbol.for('@aws-cdk/mixins-preview.Mixin.pre1');

/**
 * Main entry point for applying mixins.
 */
export class Mixins {
  /**
   * Creates a MixinApplicator for the given scope.
   */
  static of(scope: IConstruct, selector?: ConstructSelector): MixinApplicator {
    return new MixinApplicator(scope, selector);
  }
}

/**
 * A mixin is a reusable piece of functionality that can be applied to constructs
 * to add behavior, properties, or modify existing functionality without inheritance.
 */
export interface IMixin {
  /**
   * Determines whether this mixin can be applied to the given construct.
   */
  supports(construct: IConstruct): boolean;

  /**
   * Validates the construct before applying the mixin.
   */
  validate?(construct: IConstruct): string[];

  /**
   * Applies the mixin functionality to the target construct.
   */
  applyTo(construct: IConstruct): IConstruct;
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

  public validate(_construct: IConstruct): string[] {
    return [];
  }

  abstract applyTo(construct: IConstruct): IConstruct;
}
