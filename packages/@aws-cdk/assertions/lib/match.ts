import { ABSENT } from './vendored/assert';

/**
 * Partial and special matching during template assertions
 */
export abstract class Match {
  /**
   * Use this matcher in the place of a field's value, if the field must not be present.
   */
  public static absentProperty(): string {
    return ABSENT;
  }

  public static isMatcher(x: any): x is Match {
    return x && x instanceof Match;
  }

  public abstract test(actual: any): boolean;
}