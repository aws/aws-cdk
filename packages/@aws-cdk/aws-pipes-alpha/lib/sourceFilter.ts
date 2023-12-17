/**
 * Filter events using an event pattern.
 *
 * @see https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-pipes-event-filtering.html
 */
export interface IPipeFilterPattern {
  /**
   * Stringified version of the filter pattern
   */
  pattern: string;
}

/**
 * The collection of event patterns used to filter events.
 */
export interface IPipeSourceFilter {
  /**
   * Filters for the source.
   */
  filters: IPipeFilterPattern[];
}

/**
 * Generate a filter pattern from an input.
 */
export class PipeGenericFilterPattern {
  /**
   * Generates a filter pattern from a JSON object.
   */
  static fromJson(patternObject: Record<string, any>): IPipeFilterPattern {
    return { pattern: JSON.stringify(patternObject) };
  }
}

/**
 * The collection of event patterns used to filter events.
 */
export class PipeSourceFilter implements IPipeSourceFilter {
  /**
   * Filters for the source.
   */
  public filters: IPipeFilterPattern[];

  constructor(filter: IPipeFilterPattern[]) {
    this.filters = filter;
  }
}
