/**
 * Conditions that can be applied to string attributes.
 */
export interface StringConditions {
    /**
     * Match one or more values.
     *
     * @deprecated use `allowlist`
     * @default - None
     */
    readonly whitelist?: string[];
    /**
     * Match any value that doesn't include any of the specified values.
     * @deprecated use `denylist`
     * @default - None
     */
    readonly blacklist?: string[];
    /**
     * Match one or more values.
     * @default - None
     */
    readonly allowlist?: string[];
    /**
     * Match any value that doesn't include any of the specified values.
     * @default - None
     */
    readonly denylist?: string[];
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
     * @deprecated use `allowlist`
     * @default - None
     */
    readonly whitelist?: number[];
    /**
     * Match one or more values.
     *
     * @default - None
     */
    readonly allowlist?: number[];
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
export declare class SubscriptionFilter {
    readonly conditions: any[];
    /**
     * Returns a subscription filter for a string attribute.
     */
    static stringFilter(stringConditions: StringConditions): SubscriptionFilter;
    /**
     * Returns a subscription filter for a numeric attribute.
     */
    static numericFilter(numericConditions: NumericConditions): SubscriptionFilter;
    /**
     * Returns a subscription filter for attribute key matching.
     */
    static existsFilter(): SubscriptionFilter;
    /**
     *
     * @param conditions conditions that specify the message attributes that should be included, excluded, matched, etc.
     */
    constructor(conditions?: any[]);
}
