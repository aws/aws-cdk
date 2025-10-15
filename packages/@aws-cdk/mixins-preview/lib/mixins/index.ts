import { IConstruct } from 'constructs';

/**
 * A mixin is a reusable piece of functionality that can be applied to constructs
 * to add behavior, properties, or modify existing functionality without inheritance.
 *
 * Mixins follow a three-phase pattern:
 * 1. Check if the mixin supports the target construct (supports)
 * 2. Optionally validate the construct before applying (validate)
 * 3. Apply the mixin functionality to the construct (applyTo)
 */
export interface IMixin {
  /**
   * Determines whether this mixin can be applied to the given construct.
   *
   * This method should perform type checking and compatibility validation
   * to ensure the mixin can safely operate on the construct.
   *
   * @param construct - The construct to check for compatibility
   * @returns true if the mixin supports this construct type, false otherwise
   */
  supports(construct: IConstruct): boolean;

  /**
   * Validates the construct before applying the mixin.
   *
   * This optional method allows the mixin to perform additional validation
   * beyond basic type compatibility. It can check for required properties,
   * configuration constraints, or other preconditions.
   *
   * @param construct - The construct to validate
   * @returns An array of validation error messages, or empty array if valid
   */
  validate?(construct: IConstruct): string[];

  /**
   * Applies the mixin functionality to the target construct.
   *
   * This method performs the actual work of the mixin, such as:
   * - Adding new properties or methods
   * - Modifying existing behavior
   * - Setting up additional resources or configurations
   * - Establishing relationships with other constructs
   *
   * @param construct - The construct to apply the mixin to
   * @returns The modified construct (may be the same instance or a wrapper)
   */
  applyTo(construct: IConstruct): IConstruct;
}

/**
 * Abstract base class for mixins that provides default implementations
 * and simplifies mixin creation.
 */
export abstract class Mixin implements IMixin {
  /**
   * Default implementation that supports any construct.
   * Override this method to add type-specific support logic.
   */
  public supports(_construct: IConstruct): boolean {
    return true;
  }

  /**
   * Default validation implementation that returns no errors.
   * Override this method to add custom validation logic.
   */
  public validate(_construct: IConstruct): string[] {
    return [];
  }

  abstract applyTo(construct: IConstruct): IConstruct;
}
