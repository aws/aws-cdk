/**
 * Interface for objects that can render themselves to log patterns.
 */
export interface IFilterPattern {
    readonly logPatternString: string;
}
/**
 * Base class for patterns that only match JSON log events.
 */
export declare abstract class JsonPattern implements IFilterPattern {
    readonly jsonPatternString: string;
    constructor(jsonPatternString: string);
    get logPatternString(): string;
}
/**
 * A collection of static methods to generate appropriate ILogPatterns
 */
export declare class FilterPattern {
    /**
     * Use the given string as log pattern.
     *
     * See https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/FilterAndPatternSyntax.html
     * for information on writing log patterns.
     *
     * @param logPatternString The pattern string to use.
     */
    static literal(logPatternString: string): IFilterPattern;
    /**
     * A log pattern that matches all events.
     */
    static allEvents(): IFilterPattern;
    /**
     * A log pattern that matches if all the strings given appear in the event.
     *
     * @param terms The words to search for. All terms must match.
     */
    static allTerms(...terms: string[]): IFilterPattern;
    /**
     * A log pattern that matches if any of the strings given appear in the event.
     *
     * @param terms The words to search for. Any terms must match.
     */
    static anyTerm(...terms: string[]): IFilterPattern;
    /**
     * A log pattern that matches if any of the given term groups matches the event.
     *
     * A term group matches an event if all the terms in it appear in the event string.
     *
     * @param termGroups A list of term groups to search for. Any one of the clauses must match.
     */
    static anyTermGroup(...termGroups: string[][]): IFilterPattern;
    /**
     * A JSON log pattern that compares string values.
     *
     * This pattern only matches if the event is a JSON event, and the indicated field inside
     * compares with the string value.
     *
     * Use '$' to indicate the root of the JSON structure. The comparison operator can only
     * compare equality or inequality. The '*' wildcard may appear in the value may at the
     * start or at the end.
     *
     * For more information, see:
     *
     * https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/FilterAndPatternSyntax.html
     *
     * @param jsonField Field inside JSON. Example: "$.myField"
     * @param comparison Comparison to carry out. Either = or !=.
     * @param value The string value to compare to. May use '*' as wildcard at start or end of string.
     */
    static stringValue(jsonField: string, comparison: string, value: string): JsonPattern;
    /**
     * A JSON log pattern that compares numerical values.
     *
     * This pattern only matches if the event is a JSON event, and the indicated field inside
     * compares with the value in the indicated way.
     *
     * Use '$' to indicate the root of the JSON structure. The comparison operator can only
     * compare equality or inequality. The '*' wildcard may appear in the value may at the
     * start or at the end.
     *
     * For more information, see:
     *
     * https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/FilterAndPatternSyntax.html
     *
     * @param jsonField Field inside JSON. Example: "$.myField"
     * @param comparison Comparison to carry out. One of =, !=, <, <=, >, >=.
     * @param value The numerical value to compare to
     */
    static numberValue(jsonField: string, comparison: string, value: number): JsonPattern;
    /**
     * A JSON log pattern that matches if the field exists and has the special value 'null'.
     *
     * @param jsonField Field inside JSON. Example: "$.myField"
     */
    static isNull(jsonField: string): JsonPattern;
    /**
     * A JSON log pattern that matches if the field does not exist.
     *
     * @param jsonField Field inside JSON. Example: "$.myField"
     */
    static notExists(jsonField: string): JsonPattern;
    /**
     * A JSON log patter that matches if the field exists.
     *
     * This is a readable convenience wrapper over 'field = *'
     *
     * @param jsonField Field inside JSON. Example: "$.myField"
     */
    static exists(jsonField: string): JsonPattern;
    /**
     * A JSON log pattern that matches if the field exists and equals the boolean value.
     *
     * @param jsonField Field inside JSON. Example: "$.myField"
     * @param value The value to match
     */
    static booleanValue(jsonField: string, value: boolean): JsonPattern;
    /**
     * A JSON log pattern that matches if all given JSON log patterns match
     */
    static all(...patterns: JsonPattern[]): JsonPattern;
    /**
     * A JSON log pattern that matches if any of the given JSON log patterns match
     */
    static any(...patterns: JsonPattern[]): JsonPattern;
    /**
     * A space delimited log pattern matcher.
     *
     * The log event is divided into space-delimited columns (optionally
     * enclosed by "" or [] to capture spaces into column values), and names
     * are given to each column.
     *
     * '...' may be specified once to match any number of columns.
     *
     * Afterwards, conditions may be added to individual columns.
     *
     * @param columns The columns in the space-delimited log stream.
     */
    static spaceDelimited(...columns: string[]): SpaceDelimitedTextPattern;
}
export type RestrictionMap = {
    [column: string]: ColumnRestriction[];
};
/**
 * Space delimited text pattern
 */
export declare class SpaceDelimitedTextPattern implements IFilterPattern {
    private readonly columns;
    private readonly restrictions;
    /**
     * Construct a new instance of a space delimited text pattern
     *
     * Since this class must be public, we can't rely on the user only creating it through
     * the `LogPattern.spaceDelimited()` factory function. We must therefore validate the
     * argument in the constructor. Since we're returning a copy on every mutation, and we
     * don't want to re-validate the same things on every construction, we provide a limited
     * set of mutator functions and only validate the new data every time.
     */
    static construct(columns: string[]): SpaceDelimitedTextPattern;
    protected constructor(columns: string[], restrictions: RestrictionMap);
    /**
     * Restrict where the pattern applies
     */
    whereString(columnName: string, comparison: string, value: string): SpaceDelimitedTextPattern;
    /**
     * Restrict where the pattern applies
     */
    whereNumber(columnName: string, comparison: string, value: number): SpaceDelimitedTextPattern;
    get logPatternString(): string;
    /**
     * Return the column expression for the given column
     */
    private columnExpression;
    /**
     * Make a copy of the current restrictions and add one
     */
    private addRestriction;
}
export interface ColumnRestriction {
    /**
     * Comparison operator to use
     */
    readonly comparison: string;
    /**
     * String value to compare to
     *
     * Exactly one of 'stringValue' and 'numberValue' must be set.
     */
    readonly stringValue?: string;
    /**
     * Number value to compare to
     *
     * Exactly one of 'stringValue' and 'numberValue' must be set.
     */
    readonly numberValue?: number;
}
