/**
 * A Condition for use in a Choice state branch
 */
export declare abstract class Condition {
    /**
     * Matches if variable is present
     */
    static isPresent(variable: string): Condition;
    /**
     * Matches if variable is not present
     */
    static isNotPresent(variable: string): Condition;
    /**
     * Matches if variable is a string
     */
    static isString(variable: string): Condition;
    /**
     * Matches if variable is not a string
     */
    static isNotString(variable: string): Condition;
    /**
     * Matches if variable is numeric
     */
    static isNumeric(variable: string): Condition;
    /**
     * Matches if variable is not numeric
     */
    static isNotNumeric(variable: string): Condition;
    /**
     * Matches if variable is boolean
     */
    static isBoolean(variable: string): Condition;
    /**
     * Matches if variable is not boolean
     */
    static isNotBoolean(variable: string): Condition;
    /**
     * Matches if variable is a timestamp
     */
    static isTimestamp(variable: string): Condition;
    /**
     * Matches if variable is not a timestamp
     */
    static isNotTimestamp(variable: string): Condition;
    /**
     * Matches if variable is not null
     */
    static isNotNull(variable: string): Condition;
    /**
     * Matches if variable is Null
     */
    static isNull(variable: string): Condition;
    /**
     * Matches if a boolean field has the given value
     */
    static booleanEquals(variable: string, value: boolean): Condition;
    /**
     * Matches if a boolean field equals to a value at a given mapping path
     */
    static booleanEqualsJsonPath(variable: string, value: string): Condition;
    /**
     * Matches if a string field equals to a value at a given mapping path
     */
    static stringEqualsJsonPath(variable: string, value: string): Condition;
    /**
     * Matches if a string field has the given value
     */
    static stringEquals(variable: string, value: string): Condition;
    /**
     * Matches if a string field sorts before a given value
     */
    static stringLessThan(variable: string, value: string): Condition;
    /**
     * Matches if a string field sorts before a given value at a particular mapping
     */
    static stringLessThanJsonPath(variable: string, value: string): Condition;
    /**
     * Matches if a string field sorts equal to or before a given value
     */
    static stringLessThanEquals(variable: string, value: string): Condition;
    /**
     * Matches if a string field sorts equal to or before a given mapping
     */
    static stringLessThanEqualsJsonPath(variable: string, value: string): Condition;
    /**
     * Matches if a string field sorts after a given value
     */
    static stringGreaterThan(variable: string, value: string): Condition;
    /**
     * Matches if a string field sorts after a value at a given mapping path
     */
    static stringGreaterThanJsonPath(variable: string, value: string): Condition;
    /**
     * Matches if a string field sorts after or equal to value at a given mapping path
     */
    static stringGreaterThanEqualsJsonPath(variable: string, value: string): Condition;
    /**
     * Matches if a string field sorts after or equal to a given value
     */
    static stringGreaterThanEquals(variable: string, value: string): Condition;
    /**
     * Matches if a numeric field has the given value
     */
    static numberEquals(variable: string, value: number): Condition;
    /**
     * Matches if a numeric field has the value in a given mapping path
     */
    static numberEqualsJsonPath(variable: string, value: string): Condition;
    /**
     * Matches if a numeric field is less than the given value
     */
    static numberLessThan(variable: string, value: number): Condition;
    /**
     * Matches if a numeric field is less than the value at the given mapping path
     */
    static numberLessThanJsonPath(variable: string, value: string): Condition;
    /**
     * Matches if a numeric field is less than or equal to the given value
     */
    static numberLessThanEquals(variable: string, value: number): Condition;
    /**
     * Matches if a numeric field is less than or equal to the numeric value at given mapping path
     */
    static numberLessThanEqualsJsonPath(variable: string, value: string): Condition;
    /**
     * Matches if a numeric field is greater than the given value
     */
    static numberGreaterThan(variable: string, value: number): Condition;
    /**
     * Matches if a numeric field is greater than the value at a given mapping path
     */
    static numberGreaterThanJsonPath(variable: string, value: string): Condition;
    /**
     * Matches if a numeric field is greater than or equal to the given value
     */
    static numberGreaterThanEquals(variable: string, value: number): Condition;
    /**
     * Matches if a numeric field is greater than or equal to the value at a given mapping path
     */
    static numberGreaterThanEqualsJsonPath(variable: string, value: string): Condition;
    /**
     * Matches if a timestamp field is the same time as the given timestamp
     */
    static timestampEquals(variable: string, value: string): Condition;
    /**
     * Matches if a timestamp field is the same time as the timestamp at a given mapping path
     */
    static timestampEqualsJsonPath(variable: string, value: string): Condition;
    /**
     * Matches if a timestamp field is before the given timestamp
     */
    static timestampLessThan(variable: string, value: string): Condition;
    /**
     * Matches if a timestamp field is before the timestamp at a given mapping path
     */
    static timestampLessThanJsonPath(variable: string, value: string): Condition;
    /**
     * Matches if a timestamp field is before or equal to the given timestamp
     */
    static timestampLessThanEquals(variable: string, value: string): Condition;
    /**
     * Matches if a timestamp field is before or equal to the timestamp at a given mapping path
     */
    static timestampLessThanEqualsJsonPath(variable: string, value: string): Condition;
    /**
     * Matches if a timestamp field is after the given timestamp
     */
    static timestampGreaterThan(variable: string, value: string): Condition;
    /**
     * Matches if a timestamp field is after the timestamp at a given mapping path
     */
    static timestampGreaterThanJsonPath(variable: string, value: string): Condition;
    /**
     * Matches if a timestamp field is after or equal to the given timestamp
     */
    static timestampGreaterThanEquals(variable: string, value: string): Condition;
    /**
     * Matches if a timestamp field is after or equal to the timestamp at a given mapping path
     */
    static timestampGreaterThanEqualsJsonPath(variable: string, value: string): Condition;
    /**
     * Matches if a field matches a string pattern that can contain a wild card (*) e.g: log-*.txt or *LATEST*.
     * No other characters other than "*" have any special meaning - * can be escaped: \\*
     */
    static stringMatches(variable: string, value: string): Condition;
    /**
     * Combine two or more conditions with a logical AND
     */
    static and(...conditions: Condition[]): Condition;
    /**
     * Combine two or more conditions with a logical OR
     */
    static or(...conditions: Condition[]): Condition;
    /**
     * Negate a condition
     */
    static not(condition: Condition): Condition;
    /**
     * Render Amazon States Language JSON for the condition
     */
    abstract renderCondition(): any;
}
