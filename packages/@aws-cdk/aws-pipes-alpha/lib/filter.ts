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
export interface IFilter {
  /**
   * Filters for the source.
   */
  filters: IFilterPattern[];
}

/**
 * The collection of event patterns used to filter events.
 */
export class Filter implements IFilter {
  /**
   * Filters for the source.
   */
  public filters: IFilterPattern[];

  constructor(filter: IFilterPattern[]) {
    this.filters = filter;
  }
}
