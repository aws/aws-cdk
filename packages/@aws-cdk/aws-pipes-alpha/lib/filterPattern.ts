import { IFilterPattern } from './filter';

/**
 * Generate a filter pattern from an input.
 */
export class FilterPattern {
  /**
   * Generates a filter pattern from a JSON object.
   */
  static fromJson(patternObject: Record<string, any>): IFilterPattern {
    return { pattern: JSON.stringify(patternObject) };
  }
}
