abstract class Filter {
  /**
   * The conditions of the filter.
   * Conditions are `OR`ed.
   */
  public readonly conditions: any[] = [];
}

/**
 * Filter for a string attribute.
 */
export class StringFilter extends Filter {
  /**
   * Match one or more values.
   * Can be chained with other conditions.
   */
  public whitelist(...values: string[]) {
    this.conditions.push(...values);
    return this;
  }

  /**
   * Match any value that doesn't include any of the specified values.
   * Can be chained with other conditions.
   */
  public blacklist(...values: string[]) {
    this.conditions.push({ 'anything-but': values });
    return this;
  }

  /**
   * Matches values that begins with the specified prefixes.
   * Can be chained with other conditions.
   */
  public matchPrefixes(...prefixes: string[]) {
    this.conditions.push(...prefixes.map(p => ({ prefix: p })));
    return this;
  }
}

export class NumericFilter extends Filter {
  /**
   * Match one or more values.
   * Can be chained with other conditions.
   */
  public whitelist(...values: number[]) {
    this.conditions.push(...values.map(v => ({ numeric: ['=', v] })));
    return this;
  }

  /**
   * Match values that are greater than the specified value.
   * Can be chained with other conditions.
   */
  public greaterThan(value: number) {
    this.conditions.push({ numeric: ['>', value] });
    return this;
  }

  /**
   * Match values that are greater than or equal to the specified value.
   * Can be chained with other conditions.
   */
  public greaterThanOrEqualTo(value: number) {
    this.conditions.push({ numeric: ['>=', value] });
    return this;
  }

  /**
   * Match values that are less than the specified value.
   * Can be chained with other conditions.
   */
  public lessThan(value: number) {
    this.conditions.push({ numeric: ['<', value] });
    return this;
  }

  /**
   * Match values that are less than or equal to the specified value.
   * Can be chained with other conditions.
   */
  public lessThanOrEqualTo(value: number) {
    this.conditions.push({ numeric: ['<=', value] });
    return this;
  }

  /**
   * Match values that are between the specified values.
   * Can be chained with other conditions.
   */
  public between(start: number, stop: number) {
    this.conditions.push({ numeric: ['>=', start, '<=', stop ]});
    return this;
  }

  /**
   * Match values that are strictly between the specified values.
   * Can be chained with other conditions.
   */
  public betweenStrict(start: number, stop: number) {
    this.conditions.push({ numeric: ['>', start, '<', stop ]});
    return this;
  }
}

/**
 * A SNS subscription filter policy.
 */
export class SubscriptionFilterPolicy {
  private readonly policy: { [name: string]: any[] } = {};

  /**
   * Add a filter on a string attribute.
   *
   * @param name the attribute name
   */
  public addStringFilter(name: string): StringFilter {
    const filter = new StringFilter();
    this.policy[name] = filter.conditions;
    return filter;
  }

  /**
   * Add a filter on a numeric attribute.
   *
   * @param name the attribute name
   */
  public addNumericFilter(name: string): NumericFilter {
    const filter = new NumericFilter();
    this.policy[name] = filter.conditions;
    return filter;
  }

  /**
   * Renders the policy.
   */
  public render() {
    if (Object.keys(this.policy).length > 5) {
      throw new Error('A filter policy can have a maximum of 5 attribute names.');
    }

    let total = 1;
    Object.values(this.policy).forEach(filter => { total *= filter.length; });
    if (total > 100) {
      throw new Error(`The total combination of values (${total}) must not exceed 100.`);
    }

    return this.policy;
  }
}
