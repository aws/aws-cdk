/**
 * Conditions that can be applied to string attributes.
 */
export interface StringConditions {
  /**
   * Match one or more values.
   *
   * @default - None
   */
  readonly whitelist?: string[];

  /**
   * Match any value that doesn't include any of the specified values.
   *
   * @default - None
   */
  readonly blacklist?: string[];

  /**
   * Matches values that begins with the specified prefixes.
   *
   * @default - None
   */
  readonly matchPrefixes?: string[];
}

/**
 * Between condition for a numeric attribute.
 */
export interface BetweenCondition {
  /**
   * The start value.
   */
  readonly start: number;

  /**
   * The stop value.
   */
  readonly stop: number;
}

/**
 * Conditions that can be applied to numeric attributes.
 */
export interface NumericConditions {
  /**
   * Match one or more values.
   *
   * @default - None
   */
  readonly whitelist?: number[];

  /**
   * Match values that are greater than the specified value.
   *
   * @default - None
   */
  readonly greaterThan?: number;

  /**
   * Match values that are greater than or equal to the specified value.
   *
   * @default - None
   */
  readonly greaterThanOrEqualTo?: number;

  /**
   * Match values that are less than the specified value.
   *
   * @default - None
   */
  readonly lessThan?: number;

  /**
   * Match values that are less than or equal to the specified value.
   *
   * @default - None
   */
  readonly lessThanOrEqualTo?: number;

  /**
   * Match values that are between the specified values.
   *
   * @default - None
   */
  readonly between?: BetweenCondition;

  /**
   * Match values that are strictly between the specified values.
   *
   * @default - None
   */
  readonly betweenStrict?: BetweenCondition;
}

/**
 * A subscription filter for an attribute.
 */
export class SubscriptionFilter {
  /**
   * Returns a subscription filter for a string attribute.
   */
  public static stringFilter(stringConditions: StringConditions) {
    const conditions = new Array<any>();

    if (stringConditions.whitelist) {
      conditions.push(...stringConditions.whitelist);
    }

    if (stringConditions.blacklist) {
      conditions.push({ 'anything-but': stringConditions.blacklist });
    }

    if (stringConditions.matchPrefixes) {
      conditions.push(...stringConditions.matchPrefixes.map(p => ({ prefix: p })));
    }

    return new SubscriptionFilter(conditions);
  }

  /**
   * Returns a subscription filter for a numeric attribute.
   */
  public static numericFilter(numericConditions: NumericConditions) {
    const conditions = new Array<any>();

    if (numericConditions.whitelist) {
      conditions.push(...numericConditions.whitelist.map(v => ({ numeric: ['=', v] })));
    }

    if (numericConditions.greaterThan) {
      conditions.push({ numeric: ['>', numericConditions.greaterThan] });
    }

    if (numericConditions.greaterThanOrEqualTo) {
      conditions.push({ numeric: ['>=', numericConditions.greaterThanOrEqualTo] });
    }

    if (numericConditions.lessThan) {
      conditions.push({ numeric: ['<', numericConditions.lessThan] });
    }

    if (numericConditions.lessThanOrEqualTo) {
      conditions.push({ numeric: ['<=', numericConditions.lessThanOrEqualTo] });
    }

    if (numericConditions.between) {
      conditions.push({ numeric: ['>=', numericConditions.between.start, '<=', numericConditions.between.stop] });
    }

    if (numericConditions.betweenStrict) {
      conditions.push({ numeric: ['>', numericConditions.betweenStrict.start, '<', numericConditions.betweenStrict.stop] });
    }

    return new SubscriptionFilter(conditions);
  }

  /**
   * Returns a subscription filter for attribute key matching.
   */
  public static existsFilter() {
    return new SubscriptionFilter([{ exists: true }]);
  }

  /**
   *
   * @param conditions conditions that specify the message attributes that should be included, excluded, matched, etc.
   */
  constructor(public readonly conditions: any[] = []) {}
}
