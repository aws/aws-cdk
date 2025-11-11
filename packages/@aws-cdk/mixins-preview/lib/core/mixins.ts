import type { IConstruct } from 'constructs';
import type { ConstructSelector } from './selectors';
import { MixinApplicator } from './applicator';

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
  public supports(_construct: IConstruct): boolean {
    return true;
  }

  public validate(_construct: IConstruct): string[] {
    return [];
  }

  abstract applyTo(construct: IConstruct): IConstruct;
}
