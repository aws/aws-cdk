/**
 * Filter events using an event pattern.
 *
 * @see https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-pipes-event-filtering.html
 */
export interface IFilterPattern {
  /**
   * Stringified version of the filter pattern
   */
  pattern: string;
}

/**
 * The collection of event patterns used to filter events.
 */
export interface ISourceFilter {
  /**
   * Filters for the source.
   */
  filters: IFilterPattern[];
}

/**
 * Generate a filter pattern from an input.
 */
export class GenericFilterPattern {
  /**
   * Generates a filter pattern from a JSON object.
   */
  static fromJson(patternObject: Record<string, any>): IFilterPattern {
    return { pattern: JSON.stringify(patternObject) };
  }
}

/**
 * The collection of event patterns used to filter events.
 */
export class SourceFilter implements ISourceFilter {
  /**
   * Filters for the source.
   */
  public filters: IFilterPattern[];

  constructor(filter: IFilterPattern[]) {
    this.filters = filter;
  }
}
