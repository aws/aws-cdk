"use strict";
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpaceDelimitedTextPattern = exports.FilterPattern = exports.JsonPattern = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
/**
 * Base class for patterns that only match JSON log events.
 */
class JsonPattern {
    // This is a separate class so we have some type safety where users can't
    // combine text patterns and JSON patterns with an 'and' operation.
    constructor(jsonPatternString) {
        this.jsonPatternString = jsonPatternString;
    }
    get logPatternString() {
        return '{ ' + this.jsonPatternString + ' }';
    }
}
exports.JsonPattern = JsonPattern;
_a = JSII_RTTI_SYMBOL_1;
JsonPattern[_a] = { fqn: "@aws-cdk/aws-logs.JsonPattern", version: "0.0.0" };
/**
 * A collection of static methods to generate appropriate ILogPatterns
 */
class FilterPattern {
    /**
     * Use the given string as log pattern.
     *
     * See https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/FilterAndPatternSyntax.html
     * for information on writing log patterns.
     *
     * @param logPatternString The pattern string to use.
     */
    static literal(logPatternString) {
        return new LiteralLogPattern(logPatternString);
    }
    /**
     * A log pattern that matches all events.
     */
    static allEvents() {
        return new LiteralLogPattern('');
    }
    /**
     * A log pattern that matches if all the strings given appear in the event.
     *
     * @param terms The words to search for. All terms must match.
     */
    static allTerms(...terms) {
        return new TextLogPattern([terms]);
    }
    /**
     * A log pattern that matches if any of the strings given appear in the event.
     *
     * @param terms The words to search for. Any terms must match.
     */
    static anyTerm(...terms) {
        return new TextLogPattern(terms.map(t => [t]));
    }
    /**
     * A log pattern that matches if any of the given term groups matches the event.
     *
     * A term group matches an event if all the terms in it appear in the event string.
     *
     * @param termGroups A list of term groups to search for. Any one of the clauses must match.
     */
    static anyTermGroup(...termGroups) {
        return new TextLogPattern(termGroups);
    }
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
    static stringValue(jsonField, comparison, value) {
        return new JSONStringPattern(jsonField, comparison, value);
    }
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
    static numberValue(jsonField, comparison, value) {
        return new JSONNumberPattern(jsonField, comparison, value);
    }
    /**
     * A JSON log pattern that matches if the field exists and has the special value 'null'.
     *
     * @param jsonField Field inside JSON. Example: "$.myField"
     */
    static isNull(jsonField) {
        return new JSONPostfixPattern(jsonField, 'IS NULL');
    }
    /**
     * A JSON log pattern that matches if the field does not exist.
     *
     * @param jsonField Field inside JSON. Example: "$.myField"
     */
    static notExists(jsonField) {
        return new JSONPostfixPattern(jsonField, 'NOT EXISTS');
    }
    /**
     * A JSON log patter that matches if the field exists.
     *
     * This is a readable convenience wrapper over 'field = *'
     *
     * @param jsonField Field inside JSON. Example: "$.myField"
     */
    static exists(jsonField) {
        return new JSONStringPattern(jsonField, '=', '*');
    }
    /**
     * A JSON log pattern that matches if the field exists and equals the boolean value.
     *
     * @param jsonField Field inside JSON. Example: "$.myField"
     * @param value The value to match
     */
    static booleanValue(jsonField, value) {
        return new JSONPostfixPattern(jsonField, value ? 'IS TRUE' : 'IS FALSE');
    }
    /**
     * A JSON log pattern that matches if all given JSON log patterns match
     */
    static all(...patterns) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_logs_JsonPattern(patterns);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.all);
            }
            throw error;
        }
        if (patterns.length === 0) {
            throw new Error('Must supply at least one pattern, or use allEvents() to match all events.');
        }
        if (patterns.length === 1) {
            return patterns[0];
        }
        return new JSONAggregatePattern('&&', patterns);
    }
    /**
     * A JSON log pattern that matches if any of the given JSON log patterns match
     */
    static any(...patterns) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_logs_JsonPattern(patterns);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.any);
            }
            throw error;
        }
        if (patterns.length === 0) {
            throw new Error('Must supply at least one pattern');
        }
        if (patterns.length === 1) {
            return patterns[0];
        }
        return new JSONAggregatePattern('||', patterns);
    }
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
    static spaceDelimited(...columns) {
        return SpaceDelimitedTextPattern.construct(columns);
    }
}
exports.FilterPattern = FilterPattern;
_b = JSII_RTTI_SYMBOL_1;
FilterPattern[_b] = { fqn: "@aws-cdk/aws-logs.FilterPattern", version: "0.0.0" };
/**
 * Use a string literal as a log pattern
 */
class LiteralLogPattern {
    constructor(logPatternString) {
        this.logPatternString = logPatternString;
    }
}
/**
 * Search for a set of set of terms
 */
class TextLogPattern {
    constructor(clauses) {
        const quotedClauses = clauses.map(terms => terms.map(quoteTerm).join(' '));
        if (quotedClauses.length === 1) {
            this.logPatternString = quotedClauses[0];
        }
        else {
            this.logPatternString = quotedClauses.map(alt => '?' + alt).join(' ');
        }
    }
}
/**
 * A string comparison for JSON values
 */
class JSONStringPattern extends JsonPattern {
    constructor(jsonField, comparison, value) {
        comparison = validateStringOperator(comparison);
        super(`${jsonField} ${comparison} ${quoteTerm(value)}`);
    }
}
/**
 * A number comparison for JSON values
 */
class JSONNumberPattern extends JsonPattern {
    constructor(jsonField, comparison, value) {
        comparison = validateNumericalOperator(comparison);
        super(`${jsonField} ${comparison} ${value}`);
    }
}
/**
 * A postfix operator for JSON patterns
 */
class JSONPostfixPattern extends JsonPattern {
    constructor(jsonField, postfix) {
        // No validation, we assume these are generated by trusted factory functions
        super(`${jsonField} ${postfix}`);
    }
}
/**
 * Combines multiple other JSON patterns with an operator
 */
class JSONAggregatePattern extends JsonPattern {
    constructor(operator, patterns) {
        if (operator !== '&&' && operator !== '||') {
            throw new Error('Operator must be one of && or ||');
        }
        const clauses = patterns.map(p => '(' + p.jsonPatternString + ')');
        super(clauses.join(` ${operator} `));
    }
}
const COL_ELLIPSIS = '...';
/**
 * Space delimited text pattern
 */
class SpaceDelimitedTextPattern {
    // TODO: Temporarily changed from private to protected to unblock build. We need to think
    //     about how to handle jsii types with private constructors.
    constructor(columns, restrictions) {
        this.columns = columns;
        this.restrictions = restrictions;
    }
    /**
     * Construct a new instance of a space delimited text pattern
     *
     * Since this class must be public, we can't rely on the user only creating it through
     * the `LogPattern.spaceDelimited()` factory function. We must therefore validate the
     * argument in the constructor. Since we're returning a copy on every mutation, and we
     * don't want to re-validate the same things on every construction, we provide a limited
     * set of mutator functions and only validate the new data every time.
     */
    static construct(columns) {
        // Validation happens here because a user could instantiate this object directly without
        // going through the factory
        for (const column of columns) {
            if (!validColumnName(column)) {
                throw new Error(`Invalid column name: ${column}`);
            }
        }
        if (sum(columns.map(c => c === COL_ELLIPSIS ? 1 : 0)) > 1) {
            throw new Error("Can use at most one '...' column");
        }
        return new SpaceDelimitedTextPattern(columns, {});
    }
    /**
     * Restrict where the pattern applies
     */
    whereString(columnName, comparison, value) {
        if (columnName === COL_ELLIPSIS) {
            throw new Error("Can't use '...' in a restriction");
        }
        if (this.columns.indexOf(columnName) === -1) {
            throw new Error(`Column in restrictions that is not in columns: ${columnName}`);
        }
        comparison = validateStringOperator(comparison);
        return new SpaceDelimitedTextPattern(this.columns, this.addRestriction(columnName, {
            comparison,
            stringValue: value,
        }));
    }
    /**
     * Restrict where the pattern applies
     */
    whereNumber(columnName, comparison, value) {
        if (columnName === COL_ELLIPSIS) {
            throw new Error("Can't use '...' in a restriction");
        }
        if (this.columns.indexOf(columnName) === -1) {
            throw new Error(`Column in restrictions that is not in columns: ${columnName}`);
        }
        comparison = validateNumericalOperator(comparison);
        return new SpaceDelimitedTextPattern(this.columns, this.addRestriction(columnName, {
            comparison,
            numberValue: value,
        }));
    }
    get logPatternString() {
        return '[' + this.columns.map(this.columnExpression.bind(this)).join(', ') + ']';
    }
    /**
     * Return the column expression for the given column
     */
    columnExpression(column) {
        const restrictions = this.restrictions[column];
        if (!restrictions) {
            return column;
        }
        return restrictions.map(r => renderRestriction(column, r)).join(' && ');
    }
    /**
     * Make a copy of the current restrictions and add one
     */
    addRestriction(columnName, restriction) {
        const ret = {};
        for (const key of Object.keys(this.restrictions)) {
            ret[key] = this.restrictions[key].slice();
        }
        if (!(columnName in ret)) {
            ret[columnName] = [];
        }
        ret[columnName].push(restriction);
        return ret;
    }
}
exports.SpaceDelimitedTextPattern = SpaceDelimitedTextPattern;
_c = JSII_RTTI_SYMBOL_1;
SpaceDelimitedTextPattern[_c] = { fqn: "@aws-cdk/aws-logs.SpaceDelimitedTextPattern", version: "0.0.0" };
/**
 * Quote a term for use in a pattern expression
 *
 * It's never wrong to quote a string term, and required if the term
 * contains non-alphanumerical characters, so we just always do it.
 *
 * Inner double quotes are escaped using a backslash.
 */
function quoteTerm(term) {
    return '"' + term.replace(/\\/g, '\\\\').replace(/"/g, '\\"') + '"';
}
/**
 * Return whether the given column name is valid in a space-delimited table
 */
function validColumnName(column) {
    return column === COL_ELLIPSIS || /^[a-zA-Z0-9_-]+$/.exec(column);
}
/**
 * Validate and normalize the string comparison operator
 *
 * Correct for a common typo/confusion, treat '==' as '='
 */
function validateStringOperator(operator) {
    if (operator === '==') {
        operator = '=';
    }
    if (operator !== '=' && operator !== '!=') {
        throw new Error(`Invalid comparison operator ('${operator}'), must be either '=' or '!='`);
    }
    return operator;
}
const VALID_OPERATORS = ['=', '!=', '<', '<=', '>', '>='];
/**
 * Validate and normalize numerical comparison operators
 *
 * Correct for a common typo/confusion, treat '==' as '='
 */
function validateNumericalOperator(operator) {
    // Correct for a common typo, treat '==' as '='
    if (operator === '==') {
        operator = '=';
    }
    if (VALID_OPERATORS.indexOf(operator) === -1) {
        throw new Error(`Invalid comparison operator ('${operator}'), must be one of ${VALID_OPERATORS.join(', ')}`);
    }
    return operator;
}
/**
 * Render a table restriction
 */
function renderRestriction(column, restriction) {
    if (restriction.numberValue !== undefined) {
        return `${column} ${restriction.comparison} ${restriction.numberValue}`;
    }
    else if (restriction.stringValue) {
        return `${column} ${restriction.comparison} ${quoteTerm(restriction.stringValue)}`;
    }
    else {
        throw new Error('Invalid restriction');
    }
}
function sum(xs) {
    return xs.reduce((a, c) => a + c, 0);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGF0dGVybi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInBhdHRlcm4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBU0E7O0dBRUc7QUFDSCxNQUFzQixXQUFXO0lBQy9CLHlFQUF5RTtJQUN6RSxtRUFBbUU7SUFDbkUsWUFBNEIsaUJBQXlCO1FBQXpCLHNCQUFpQixHQUFqQixpQkFBaUIsQ0FBUTtLQUFLO0lBRTFELElBQVcsZ0JBQWdCO1FBQ3pCLE9BQU8sSUFBSSxHQUFHLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLENBQUM7S0FDN0M7O0FBUEgsa0NBUUM7OztBQUVEOztHQUVHO0FBQ0gsTUFBYSxhQUFhO0lBRXhCOzs7Ozs7O09BT0c7SUFDSSxNQUFNLENBQUMsT0FBTyxDQUFDLGdCQUF3QjtRQUM1QyxPQUFPLElBQUksaUJBQWlCLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztLQUNoRDtJQUVEOztPQUVHO0lBQ0ksTUFBTSxDQUFDLFNBQVM7UUFDckIsT0FBTyxJQUFJLGlCQUFpQixDQUFDLEVBQUUsQ0FBQyxDQUFDO0tBQ2xDO0lBRUQ7Ozs7T0FJRztJQUNJLE1BQU0sQ0FBQyxRQUFRLENBQUMsR0FBRyxLQUFlO1FBQ3ZDLE9BQU8sSUFBSSxjQUFjLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0tBQ3BDO0lBRUQ7Ozs7T0FJRztJQUNJLE1BQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxLQUFlO1FBQ3RDLE9BQU8sSUFBSSxjQUFjLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQ2hEO0lBRUQ7Ozs7OztPQU1HO0lBQ0ksTUFBTSxDQUFDLFlBQVksQ0FBQyxHQUFHLFVBQXNCO1FBQ2xELE9BQU8sSUFBSSxjQUFjLENBQUMsVUFBVSxDQUFDLENBQUM7S0FDdkM7SUFFRDs7Ozs7Ozs7Ozs7Ozs7Ozs7T0FpQkc7SUFDSSxNQUFNLENB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QUFPLEdBQUcsTUFBTSxJQUFJLFdBQVcsQ0FBQyxVQUFVLElBQUksU0FBUyxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDO0tBQ3BGO1NBQU07UUFDTCxNQUFNLElBQUksS0FBSyxDQUFDLHFCQUFxQixDQUFDLENBQUM7S0FDeEM7QUFDSCxDQUFDO0FBRUQsU0FBUyxHQUFHLENBQUMsRUFBWTtJQUN2QixPQUFPLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ3ZDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBJbXBsZW1lbnRhdGlvbiBvZiBtZXRyaWMgcGF0dGVybnNcblxuLyoqXG4gKiBJbnRlcmZhY2UgZm9yIG9iamVjdHMgdGhhdCBjYW4gcmVuZGVyIHRoZW1zZWx2ZXMgdG8gbG9nIHBhdHRlcm5zLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIElGaWx0ZXJQYXR0ZXJuIHtcbiAgcmVhZG9ubHkgbG9nUGF0dGVyblN0cmluZzogc3RyaW5nO1xufVxuXG4vKipcbiAqIEJhc2UgY2xhc3MgZm9yIHBhdHRlcm5zIHRoYXQgb25seSBtYXRjaCBKU09OIGxvZyBldmVudHMuXG4gKi9cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBKc29uUGF0dGVybiBpbXBsZW1lbnRzIElGaWx0ZXJQYXR0ZXJuIHtcbiAgLy8gVGhpcyBpcyBhIHNlcGFyYXRlIGNsYXNzIHNvIHdlIGhhdmUgc29tZSB0eXBlIHNhZmV0eSB3aGVyZSB1c2VycyBjYW4ndFxuICAvLyBjb21iaW5lIHRleHQgcGF0dGVybnMgYW5kIEpTT04gcGF0dGVybnMgd2l0aCBhbiAnYW5kJyBvcGVyYXRpb24uXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyByZWFkb25seSBqc29uUGF0dGVyblN0cmluZzogc3RyaW5nKSB7IH1cblxuICBwdWJsaWMgZ2V0IGxvZ1BhdHRlcm5TdHJpbmcoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gJ3sgJyArIHRoaXMuanNvblBhdHRlcm5TdHJpbmcgKyAnIH0nO1xuICB9XG59XG5cbi8qKlxuICogQSBjb2xsZWN0aW9uIG9mIHN0YXRpYyBtZXRob2RzIHRvIGdlbmVyYXRlIGFwcHJvcHJpYXRlIElMb2dQYXR0ZXJuc1xuICovXG5leHBvcnQgY2xhc3MgRmlsdGVyUGF0dGVybiB7XG5cbiAgLyoqXG4gICAqIFVzZSB0aGUgZ2l2ZW4gc3RyaW5nIGFzIGxvZyBwYXR0ZXJuLlxuICAgKlxuICAgKiBTZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FtYXpvbkNsb3VkV2F0Y2gvbGF0ZXN0L2xvZ3MvRmlsdGVyQW5kUGF0dGVyblN5bnRheC5odG1sXG4gICAqIGZvciBpbmZvcm1hdGlvbiBvbiB3cml0aW5nIGxvZyBwYXR0ZXJucy5cbiAgICpcbiAgICogQHBhcmFtIGxvZ1BhdHRlcm5TdHJpbmcgVGhlIHBhdHRlcm4gc3RyaW5nIHRvIHVzZS5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgbGl0ZXJhbChsb2dQYXR0ZXJuU3RyaW5nOiBzdHJpbmcpOiBJRmlsdGVyUGF0dGVybiB7XG4gICAgcmV0dXJuIG5ldyBMaXRlcmFsTG9nUGF0dGVybihsb2dQYXR0ZXJuU3RyaW5nKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBIGxvZyBwYXR0ZXJuIHRoYXQgbWF0Y2hlcyBhbGwgZXZlbnRzLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBhbGxFdmVudHMoKTogSUZpbHRlclBhdHRlcm4ge1xuICAgIHJldHVybiBuZXcgTGl0ZXJhbExvZ1BhdHRlcm4oJycpO1xuICB9XG5cbiAgLyoqXG4gICAqIEEgbG9nIHBhdHRlcm4gdGhhdCBtYXRjaGVzIGlmIGFsbCB0aGUgc3RyaW5ncyBnaXZlbiBhcHBlYXIgaW4gdGhlIGV2ZW50LlxuICAgKlxuICAgKiBAcGFyYW0gdGVybXMgVGhlIHdvcmRzIHRvIHNlYXJjaCBmb3IuIEFsbCB0ZXJtcyBtdXN0IG1hdGNoLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBhbGxUZXJtcyguLi50ZXJtczogc3RyaW5nW10pOiBJRmlsdGVyUGF0dGVybiB7XG4gICAgcmV0dXJuIG5ldyBUZXh0TG9nUGF0dGVybihbdGVybXNdKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBIGxvZyBwYXR0ZXJuIHRoYXQgbWF0Y2hlcyBpZiBhbnkgb2YgdGhlIHN0cmluZ3MgZ2l2ZW4gYXBwZWFyIGluIHRoZSBldmVudC5cbiAgICpcbiAgICogQHBhcmFtIHRlcm1zIFRoZSB3b3JkcyB0byBzZWFyY2ggZm9yLiBBbnkgdGVybXMgbXVzdCBtYXRjaC5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgYW55VGVybSguLi50ZXJtczogc3RyaW5nW10pOiBJRmlsdGVyUGF0dGVybiB7XG4gICAgcmV0dXJuIG5ldyBUZXh0TG9nUGF0dGVybih0ZXJtcy5tYXAodCA9PiBbdF0pKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBIGxvZyBwYXR0ZXJuIHRoYXQgbWF0Y2hlcyBpZiBhbnkgb2YgdGhlIGdpdmVuIHRlcm0gZ3JvdXBzIG1hdGNoZXMgdGhlIGV2ZW50LlxuICAgKlxuICAgKiBBIHRlcm0gZ3JvdXAgbWF0Y2hlcyBhbiBldmVudCBpZiBhbGwgdGhlIHRlcm1zIGluIGl0IGFwcGVhciBpbiB0aGUgZXZlbnQgc3RyaW5nLlxuICAgKlxuICAgKiBAcGFyYW0gdGVybUdyb3VwcyBBIGxpc3Qgb2YgdGVybSBncm91cHMgdG8gc2VhcmNoIGZvci4gQW55IG9uZSBvZiB0aGUgY2xhdXNlcyBtdXN0IG1hdGNoLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBhbnlUZXJtR3JvdXAoLi4udGVybUdyb3Vwczogc3RyaW5nW11bXSk6IElGaWx0ZXJQYXR0ZXJuIHtcbiAgICByZXR1cm4gbmV3IFRleHRMb2dQYXR0ZXJuKHRlcm1Hcm91cHMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEEgSlNPTiBsb2cgcGF0dGVybiB0aGF0IGNvbXBhcmVzIHN0cmluZyB2YWx1ZXMuXG4gICAqXG4gICAqIFRoaXMgcGF0dGVybiBvbmx5IG1hdGNoZXMgaWYgdGhlIGV2ZW50IGlzIGEgSlNPTiBldmVudCwgYW5kIHRoZSBpbmRpY2F0ZWQgZmllbGQgaW5zaWRlXG4gICAqIGNvbXBhcmVzIHdpdGggdGhlIHN0cmluZyB2YWx1ZS5cbiAgICpcbiAgICogVXNlICckJyB0byBpbmRpY2F0ZSB0aGUgcm9vdCBvZiB0aGUgSlNPTiBzdHJ1Y3R1cmUuIFRoZSBjb21wYXJpc29uIG9wZXJhdG9yIGNhbiBvbmx5XG4gICAqIGNvbXBhcmUgZXF1YWxpdHkgb3IgaW5lcXVhbGl0eS4gVGhlICcqJyB3aWxkY2FyZCBtYXkgYXBwZWFyIGluIHRoZSB2YWx1ZSBtYXkgYXQgdGhlXG4gICAqIHN0YXJ0IG9yIGF0IHRoZSBlbmQuXG4gICAqXG4gICAqIEZvciBtb3JlIGluZm9ybWF0aW9uLCBzZWU6XG4gICAqXG4gICAqIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BbWF6b25DbG91ZFdhdGNoL2xhdGVzdC9sb2dzL0ZpbHRlckFuZFBhdHRlcm5TeW50YXguaHRtbFxuICAgKlxuICAgKiBAcGFyYW0ganNvbkZpZWxkIEZpZWxkIGluc2lkZSBKU09OLiBFeGFtcGxlOiBcIiQubXlGaWVsZFwiXG4gICAqIEBwYXJhbSBjb21wYXJpc29uIENvbXBhcmlzb24gdG8gY2Fycnkgb3V0LiBFaXRoZXIgPSBvciAhPS5cbiAgICogQHBhcmFtIHZhbHVlIFRoZSBzdHJpbmcgdmFsdWUgdG8gY29tcGFyZSB0by4gTWF5IHVzZSAnKicgYXMgd2lsZGNhcmQgYXQgc3RhcnQgb3IgZW5kIG9mIHN0cmluZy5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgc3RyaW5nVmFsdWUoanNvbkZpZWxkOiBzdHJpbmcsIGNvbXBhcmlzb246IHN0cmluZywgdmFsdWU6IHN0cmluZyk6IEpzb25QYXR0ZXJuIHtcbiAgICByZXR1cm4gbmV3IEpTT05TdHJpbmdQYXR0ZXJuKGpzb25GaWVsZCwgY29tcGFyaXNvbiwgdmFsdWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIEEgSlNPTiBsb2cgcGF0dGVybiB0aGF0IGNvbXBhcmVzIG51bWVyaWNhbCB2YWx1ZXMuXG4gICAqXG4gICAqIFRoaXMgcGF0dGVybiBvbmx5IG1hdGNoZXMgaWYgdGhlIGV2ZW50IGlzIGEgSlNPTiBldmVudCwgYW5kIHRoZSBpbmRpY2F0ZWQgZmllbGQgaW5zaWRlXG4gICAqIGNvbXBhcmVzIHdpdGggdGhlIHZhbHVlIGluIHRoZSBpbmRpY2F0ZWQgd2F5LlxuICAgKlxuICAgKiBVc2UgJyQnIHRvIGluZGljYXRlIHRoZSByb290IG9mIHRoZSBKU09OIHN0cnVjdHVyZS4gVGhlIGNvbXBhcmlzb24gb3BlcmF0b3IgY2FuIG9ubHlcbiAgICogY29tcGFyZSBlcXVhbGl0eSBvciBpbmVxdWFsaXR5LiBUaGUgJyonIHdpbGRjYXJkIG1heSBhcHBlYXIgaW4gdGhlIHZhbHVlIG1heSBhdCB0aGVcbiAgICogc3RhcnQgb3IgYXQgdGhlIGVuZC5cbiAgICpcbiAgICogRm9yIG1vcmUgaW5mb3JtYXRpb24sIHNlZTpcbiAgICpcbiAgICogaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FtYXpvbkNsb3VkV2F0Y2gvbGF0ZXN0L2xvZ3MvRmlsdGVyQW5kUGF0dGVyblN5bnRheC5odG1sXG4gICAqXG4gICAqIEBwYXJhbSBqc29uRmllbGQgRmllbGQgaW5zaWRlIEpTT04uIEV4YW1wbGU6IFwiJC5teUZpZWxkXCJcbiAgICogQHBhcmFtIGNvbXBhcmlzb24gQ29tcGFyaXNvbiB0byBjYXJyeSBvdXQuIE9uZSBvZiA9LCAhPSwgPCwgPD0sID4sID49LlxuICAgKiBAcGFyYW0gdmFsdWUgVGhlIG51bWVyaWNhbCB2YWx1ZSB0byBjb21wYXJlIHRvXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIG51bWJlclZhbHVlKGpzb25GaWVsZDogc3RyaW5nLCBjb21wYXJpc29uOiBzdHJpbmcsIHZhbHVlOiBudW1iZXIpOiBKc29uUGF0dGVybiB7XG4gICAgcmV0dXJuIG5ldyBKU09OTnVtYmVyUGF0dGVybihqc29uRmllbGQsIGNvbXBhcmlzb24sIHZhbHVlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBIEpTT04gbG9nIHBhdHRlcm4gdGhhdCBtYXRjaGVzIGlmIHRoZSBmaWVsZCBleGlzdHMgYW5kIGhhcyB0aGUgc3BlY2lhbCB2YWx1ZSAnbnVsbCcuXG4gICAqXG4gICAqIEBwYXJhbSBqc29uRmllbGQgRmllbGQgaW5zaWRlIEpTT04uIEV4YW1wbGU6IFwiJC5teUZpZWxkXCJcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgaXNOdWxsKGpzb25GaWVsZDogc3RyaW5nKTogSnNvblBhdHRlcm4ge1xuICAgIHJldHVybiBuZXcgSlNPTlBvc3RmaXhQYXR0ZXJuKGpzb25GaWVsZCwgJ0lTIE5VTEwnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBIEpTT04gbG9nIHBhdHRlcm4gdGhhdCBtYXRjaGVzIGlmIHRoZSBmaWVsZCBkb2VzIG5vdCBleGlzdC5cbiAgICpcbiAgICogQHBhcmFtIGpzb25GaWVsZCBGaWVsZCBpbnNpZGUgSlNPTi4gRXhhbXBsZTogXCIkLm15RmllbGRcIlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBub3RFeGlzdHMoanNvbkZpZWxkOiBzdHJpbmcpOiBKc29uUGF0dGVybiB7XG4gICAgcmV0dXJuIG5ldyBKU09OUG9zdGZpeFBhdHRlcm4oanNvbkZpZWxkLCAnTk9UIEVYSVNUUycpO1xuICB9XG5cbiAgLyoqXG4gICAqIEEgSlNPTiBsb2cgcGF0dGVyIHRoYXQgbWF0Y2hlcyBpZiB0aGUgZmllbGQgZXhpc3RzLlxuICAgKlxuICAgKiBUaGlzIGlzIGEgcmVhZGFibGUgY29udmVuaWVuY2Ugd3JhcHBlciBvdmVyICdmaWVsZCA9IConXG4gICAqXG4gICAqIEBwYXJhbSBqc29uRmllbGQgRmllbGQgaW5zaWRlIEpTT04uIEV4YW1wbGU6IFwiJC5teUZpZWxkXCJcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZXhpc3RzKGpzb25GaWVsZDogc3RyaW5nKTogSnNvblBhdHRlcm4ge1xuICAgIHJldHVybiBuZXcgSlNPTlN0cmluZ1BhdHRlcm4oanNvbkZpZWxkLCAnPScsICcqJyk7XG4gIH1cblxuICAvKipcbiAgICogQSBKU09OIGxvZyBwYXR0ZXJuIHRoYXQgbWF0Y2hlcyBpZiB0aGUgZmllbGQgZXhpc3RzIGFuZCBlcXVhbHMgdGhlIGJvb2xlYW4gdmFsdWUuXG4gICAqXG4gICAqIEBwYXJhbSBqc29uRmllbGQgRmllbGQgaW5zaWRlIEpTT04uIEV4YW1wbGU6IFwiJC5teUZpZWxkXCJcbiAgICogQHBhcmFtIHZhbHVlIFRoZSB2YWx1ZSB0byBtYXRjaFxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBib29sZWFuVmFsdWUoanNvbkZpZWxkOiBzdHJpbmcsIHZhbHVlOiBib29sZWFuKTogSnNvblBhdHRlcm4ge1xuICAgIHJldHVybiBuZXcgSlNPTlBvc3RmaXhQYXR0ZXJuKGpzb25GaWVsZCwgdmFsdWUgPyAnSVMgVFJVRScgOiAnSVMgRkFMU0UnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBIEpTT04gbG9nIHBhdHRlcm4gdGhhdCBtYXRjaGVzIGlmIGFsbCBnaXZlbiBKU09OIGxvZyBwYXR0ZXJucyBtYXRjaFxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBhbGwoLi4ucGF0dGVybnM6IEpzb25QYXR0ZXJuW10pOiBKc29uUGF0dGVybiB7XG4gICAgaWYgKHBhdHRlcm5zLmxlbmd0aCA9PT0gMCkgeyB0aHJvdyBuZXcgRXJyb3IoJ011c3Qgc3VwcGx5IGF0IGxlYXN0IG9uZSBwYXR0ZXJuLCBvciB1c2UgYWxsRXZlbnRzKCkgdG8gbWF0Y2ggYWxsIGV2ZW50cy4nKTsgfVxuICAgIGlmIChwYXR0ZXJucy5sZW5ndGggPT09IDEpIHsgcmV0dXJuIHBhdHRlcm5zWzBdOyB9XG4gICAgcmV0dXJuIG5ldyBKU09OQWdncmVnYXRlUGF0dGVybignJiYnLCBwYXR0ZXJucyk7XG4gIH1cblxuICAvKipcbiAgICogQSBKU09OIGxvZyBwYXR0ZXJuIHRoYXQgbWF0Y2hlcyBpZiBhbnkgb2YgdGhlIGdpdmVuIEpTT04gbG9nIHBhdHRlcm5zIG1hdGNoXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGFueSguLi5wYXR0ZXJuczogSnNvblBhdHRlcm5bXSk6IEpzb25QYXR0ZXJuIHtcbiAgICBpZiAocGF0dGVybnMubGVuZ3RoID09PSAwKSB7IHRocm93IG5ldyBFcnJvcignTXVzdCBzdXBwbHkgYXQgbGVhc3Qgb25lIHBhdHRlcm4nKTsgfVxuICAgIGlmIChwYXR0ZXJucy5sZW5ndGggPT09IDEpIHsgcmV0dXJuIHBhdHRlcm5zWzBdOyB9XG4gICAgcmV0dXJuIG5ldyBKU09OQWdncmVnYXRlUGF0dGVybignfHwnLCBwYXR0ZXJucyk7XG4gIH1cblxuICAvKipcbiAgICogQSBzcGFjZSBkZWxpbWl0ZWQgbG9nIHBhdHRlcm4gbWF0Y2hlci5cbiAgICpcbiAgICogVGhlIGxvZyBldmVudCBpcyBkaXZpZGVkIGludG8gc3BhY2UtZGVsaW1pdGVkIGNvbHVtbnMgKG9wdGlvbmFsbHlcbiAgICogZW5jbG9zZWQgYnkgXCJcIiBvciBbXSB0byBjYXB0dXJlIHNwYWNlcyBpbnRvIGNvbHVtbiB2YWx1ZXMpLCBhbmQgbmFtZXNcbiAgICogYXJlIGdpdmVuIHRvIGVhY2ggY29sdW1uLlxuICAgKlxuICAgKiAnLi4uJyBtYXkgYmUgc3BlY2lmaWVkIG9uY2UgdG8gbWF0Y2ggYW55IG51bWJlciBvZiBjb2x1bW5zLlxuICAgKlxuICAgKiBBZnRlcndhcmRzLCBjb25kaXRpb25zIG1heSBiZSBhZGRlZCB0byBpbmRpdmlkdWFsIGNvbHVtbnMuXG4gICAqXG4gICAqIEBwYXJhbSBjb2x1bW5zIFRoZSBjb2x1bW5zIGluIHRoZSBzcGFjZS1kZWxpbWl0ZWQgbG9nIHN0cmVhbS5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgc3BhY2VEZWxpbWl0ZWQoLi4uY29sdW1uczogc3RyaW5nW10pOiBTcGFjZURlbGltaXRlZFRleHRQYXR0ZXJuIHtcbiAgICByZXR1cm4gU3BhY2VEZWxpbWl0ZWRUZXh0UGF0dGVybi5jb25zdHJ1Y3QoY29sdW1ucyk7XG4gIH1cbn1cblxuLyoqXG4gKiBVc2UgYSBzdHJpbmcgbGl0ZXJhbCBhcyBhIGxvZyBwYXR0ZXJuXG4gKi9cbmNsYXNzIExpdGVyYWxMb2dQYXR0ZXJuIGltcGxlbWVudHMgSUZpbHRlclBhdHRlcm4ge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgcmVhZG9ubHkgbG9nUGF0dGVyblN0cmluZzogc3RyaW5nKSB7XG4gIH1cbn1cblxuLyoqXG4gKiBTZWFyY2ggZm9yIGEgc2V0IG9mIHNldCBvZiB0ZXJtc1xuICovXG5jbGFzcyBUZXh0TG9nUGF0dGVybiBpbXBsZW1lbnRzIElGaWx0ZXJQYXR0ZXJuIHtcbiAgcHVibGljIHJlYWRvbmx5IGxvZ1BhdHRlcm5TdHJpbmc6IHN0cmluZztcblxuICBjb25zdHJ1Y3RvcihjbGF1c2VzOiBzdHJpbmdbXVtdKSB7XG4gICAgY29uc3QgcXVvdGVkQ2xhdXNlcyA9IGNsYXVzZXMubWFwKHRlcm1zID0+IHRlcm1zLm1hcChxdW90ZVRlcm0pLmpvaW4oJyAnKSk7XG4gICAgaWYgKHF1b3RlZENsYXVzZXMubGVuZ3RoID09PSAxKSB7XG4gICAgICB0aGlzLmxvZ1BhdHRlcm5TdHJpbmcgPSBxdW90ZWRDbGF1c2VzWzBdO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmxvZ1BhdHRlcm5TdHJpbmcgPSBxdW90ZWRDbGF1c2VzLm1hcChhbHQgPT4gJz8nICsgYWx0KS5qb2luKCcgJyk7XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogQSBzdHJpbmcgY29tcGFyaXNvbiBmb3IgSlNPTiB2YWx1ZXNcbiAqL1xuY2xhc3MgSlNPTlN0cmluZ1BhdHRlcm4gZXh0ZW5kcyBKc29uUGF0dGVybiB7XG4gIHB1YmxpYyBjb25zdHJ1Y3Rvcihqc29uRmllbGQ6IHN0cmluZywgY29tcGFyaXNvbjogc3RyaW5nLCB2YWx1ZTogc3RyaW5nKSB7XG4gICAgY29tcGFyaXNvbiA9IHZhbGlkYXRlU3RyaW5nT3BlcmF0b3IoY29tcGFyaXNvbik7XG4gICAgc3VwZXIoYCR7anNvbkZpZWxkfSAke2NvbXBhcmlzb259ICR7cXVvdGVUZXJtKHZhbHVlKX1gKTtcbiAgfVxufVxuXG4vKipcbiAqIEEgbnVtYmVyIGNvbXBhcmlzb24gZm9yIEpTT04gdmFsdWVzXG4gKi9cbmNsYXNzIEpTT05OdW1iZXJQYXR0ZXJuIGV4dGVuZHMgSnNvblBhdHRlcm4ge1xuICBwdWJsaWMgY29uc3RydWN0b3IoanNvbkZpZWxkOiBzdHJpbmcsIGNvbXBhcmlzb246IHN0cmluZywgdmFsdWU6IG51bWJlcikge1xuICAgIGNvbXBhcmlzb24gPSB2YWxpZGF0ZU51bWVyaWNhbE9wZXJhdG9yKGNvbXBhcmlzb24pO1xuICAgIHN1cGVyKGAke2pzb25GaWVsZH0gJHtjb21wYXJpc29ufSAke3ZhbHVlfWApO1xuICB9XG59XG5cbi8qKlxuICogQSBwb3N0Zml4IG9wZXJhdG9yIGZvciBKU09OIHBhdHRlcm5zXG4gKi9cbmNsYXNzIEpTT05Qb3N0Zml4UGF0dGVybiBleHRlbmRzIEpzb25QYXR0ZXJuIHtcbiAgcHVibGljIGNvbnN0cnVjdG9yKGpzb25GaWVsZDogc3RyaW5nLCBwb3N0Zml4OiBzdHJpbmcpIHtcbiAgICAvLyBObyB2YWxpZGF0aW9uLCB3ZSBhc3N1bWUgdGhlc2UgYXJlIGdlbmVyYXRlZCBieSB0cnVzdGVkIGZhY3RvcnkgZnVuY3Rpb25zXG4gICAgc3VwZXIoYCR7anNvbkZpZWxkfSAke3Bvc3RmaXh9YCk7XG4gIH1cbn1cblxuLyoqXG4gKiBDb21iaW5lcyBtdWx0aXBsZSBvdGhlciBKU09OIHBhdHRlcm5zIHdpdGggYW4gb3BlcmF0b3JcbiAqL1xuY2xhc3MgSlNPTkFnZ3JlZ2F0ZVBhdHRlcm4gZXh0ZW5kcyBKc29uUGF0dGVybiB7XG4gIHB1YmxpYyBjb25zdHJ1Y3RvcihvcGVyYXRvcjogc3RyaW5nLCBwYXR0ZXJuczogSnNvblBhdHRlcm5bXSkge1xuICAgIGlmIChvcGVyYXRvciAhPT0gJyYmJyAmJiBvcGVyYXRvciAhPT0gJ3x8Jykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdPcGVyYXRvciBtdXN0IGJlIG9uZSBvZiAmJiBvciB8fCcpO1xuICAgIH1cblxuICAgIGNvbnN0IGNsYXVzZXMgPSBwYXR0ZXJucy5tYXAocCA9PiAnKCcgKyBwLmpzb25QYXR0ZXJuU3RyaW5nICsgJyknKTtcblxuICAgIHN1cGVyKGNsYXVzZXMuam9pbihgICR7b3BlcmF0b3J9IGApKTtcbiAgfVxufVxuXG5leHBvcnQgdHlwZSBSZXN0cmljdGlvbk1hcCA9IHtbY29sdW1uOiBzdHJpbmddOiBDb2x1bW5SZXN0cmljdGlvbltdfTtcblxuY29uc3QgQ09MX0VMTElQU0lTID0gJy4uLic7XG5cbi8qKlxuICogU3BhY2UgZGVsaW1pdGVkIHRleHQgcGF0dGVyblxuICovXG5leHBvcnQgY2xhc3MgU3BhY2VEZWxpbWl0ZWRUZXh0UGF0dGVybiBpbXBsZW1lbnRzIElGaWx0ZXJQYXR0ZXJuIHtcbiAgLyoqXG4gICAqIENvbnN0cnVjdCBhIG5ldyBpbnN0YW5jZSBvZiBhIHNwYWNlIGRlbGltaXRlZCB0ZXh0IHBhdHRlcm5cbiAgICpcbiAgICogU2luY2UgdGhpcyBjbGFzcyBtdXN0IGJlIHB1YmxpYywgd2UgY2FuJ3QgcmVseSBvbiB0aGUgdXNlciBvbmx5IGNyZWF0aW5nIGl0IHRocm91Z2hcbiAgICogdGhlIGBMb2dQYXR0ZXJuLnNwYWNlRGVsaW1pdGVkKClgIGZhY3RvcnkgZnVuY3Rpb24uIFdlIG11c3QgdGhlcmVmb3JlIHZhbGlkYXRlIHRoZVxuICAgKiBhcmd1bWVudCBpbiB0aGUgY29uc3RydWN0b3IuIFNpbmNlIHdlJ3JlIHJldHVybmluZyBhIGNvcHkgb24gZXZlcnkgbXV0YXRpb24sIGFuZCB3ZVxuICAgKiBkb24ndCB3YW50IHRvIHJlLXZhbGlkYXRlIHRoZSBzYW1lIHRoaW5ncyBvbiBldmVyeSBjb25zdHJ1Y3Rpb24sIHdlIHByb3ZpZGUgYSBsaW1pdGVkXG4gICAqIHNldCBvZiBtdXRhdG9yIGZ1bmN0aW9ucyBhbmQgb25seSB2YWxpZGF0ZSB0aGUgbmV3IGRhdGEgZXZlcnkgdGltZS5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgY29uc3RydWN0KGNvbHVtbnM6IHN0cmluZ1tdKSB7XG4gICAgLy8gVmFsaWRhdGlvbiBoYXBwZW5zIGhlcmUgYmVjYXVzZSBhIHVzZXIgY291bGQgaW5zdGFudGlhdGUgdGhpcyBvYmplY3QgZGlyZWN0bHkgd2l0aG91dFxuICAgIC8vIGdvaW5nIHRocm91Z2ggdGhlIGZhY3RvcnlcbiAgICBmb3IgKGNvbnN0IGNvbHVtbiBvZiBjb2x1bW5zKSB7XG4gICAgICBpZiAoIXZhbGlkQ29sdW1uTmFtZShjb2x1bW4pKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBjb2x1bW4gbmFtZTogJHtjb2x1bW59YCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHN1bShjb2x1bW5zLm1hcChjID0+IGMgPT09IENPTF9FTExJUFNJUyA/IDEgOiAwKSkgPiAxKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDYW4gdXNlIGF0IG1vc3Qgb25lICcuLi4nIGNvbHVtblwiKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IFNwYWNlRGVsaW1pdGVkVGV4dFBhdHRlcm4oY29sdW1ucywge30pO1xuICB9XG5cbiAgLy8gVE9ETzogVGVtcG9yYXJpbHkgY2hhbmdlZCBmcm9tIHByaXZhdGUgdG8gcHJvdGVjdGVkIHRvIHVuYmxvY2sgYnVpbGQuIFdlIG5lZWQgdG8gdGhpbmtcbiAgLy8gICAgIGFib3V0IGhvdyB0byBoYW5kbGUganNpaSB0eXBlcyB3aXRoIHByaXZhdGUgY29uc3RydWN0b3JzLlxuICBwcm90ZWN0ZWQgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSBjb2x1bW5zOiBzdHJpbmdbXSwgcHJpdmF0ZSByZWFkb25seSByZXN0cmljdGlvbnM6IFJlc3RyaWN0aW9uTWFwKSB7XG4gICAgLy8gUHJpdmF0ZSBjb25zdHJ1Y3RvciBzbyB3ZSB2YWxpZGF0ZSBpbiB0aGUgLmNvbnN0cnVjdCgpIGZhY3RvcnkgZnVuY3Rpb25cbiAgfVxuXG4gIC8qKlxuICAgKiBSZXN0cmljdCB3aGVyZSB0aGUgcGF0dGVybiBhcHBsaWVzXG4gICAqL1xuICBwdWJsaWMgd2hlcmVTdHJpbmcoY29sdW1uTmFtZTogc3RyaW5nLCBjb21wYXJpc29uOiBzdHJpbmcsIHZhbHVlOiBzdHJpbmcpOiBTcGFjZURlbGltaXRlZFRleHRQYXR0ZXJuIHtcbiAgICBpZiAoY29sdW1uTmFtZSA9PT0gQ09MX0VMTElQU0lTKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDYW4ndCB1c2UgJy4uLicgaW4gYSByZXN0cmljdGlvblwiKTtcbiAgICB9XG4gICAgaWYgKHRoaXMuY29sdW1ucy5pbmRleE9mKGNvbHVtbk5hbWUpID09PSAtMSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBDb2x1bW4gaW4gcmVzdHJpY3Rpb25zIHRoYXQgaXMgbm90IGluIGNvbHVtbnM6ICR7Y29sdW1uTmFtZX1gKTtcbiAgICB9XG5cbiAgICBjb21wYXJpc29uID0gdmFsaWRhdGVTdHJpbmdPcGVyYXRvcihjb21wYXJpc29uKTtcblxuICAgIHJldHVybiBuZXcgU3BhY2VEZWxpbWl0ZWRUZXh0UGF0dGVybih0aGlzLmNvbHVtbnMsIHRoaXMuYWRkUmVzdHJpY3Rpb24oY29sdW1uTmFtZSwge1xuICAgICAgY29tcGFyaXNvbixcbiAgICAgIHN0cmluZ1ZhbHVlOiB2YWx1ZSxcbiAgICB9KSk7XG4gIH1cblxuICAvKipcbiAgICogUmVzdHJpY3Qgd2hlcmUgdGhlIHBhdHRlcm4gYXBwbGllc1xuICAgKi9cbiAgcHVibGljIHdoZXJlTnVtYmVyKGNvbHVtbk5hbWU6IHN0cmluZywgY29tcGFyaXNvbjogc3RyaW5nLCB2YWx1ZTogbnVtYmVyKTogU3BhY2VEZWxpbWl0ZWRUZXh0UGF0dGVybiB7XG4gICAgaWYgKGNvbHVtbk5hbWUgPT09IENPTF9FTExJUFNJUykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQ2FuJ3QgdXNlICcuLi4nIGluIGEgcmVzdHJpY3Rpb25cIik7XG4gICAgfVxuICAgIGlmICh0aGlzLmNvbHVtbnMuaW5kZXhPZihjb2x1bW5OYW1lKSA9PT0gLTEpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgQ29sdW1uIGluIHJlc3RyaWN0aW9ucyB0aGF0IGlzIG5vdCBpbiBjb2x1bW5zOiAke2NvbHVtbk5hbWV9YCk7XG4gICAgfVxuXG4gICAgY29tcGFyaXNvbiA9IHZhbGlkYXRlTnVtZXJpY2FsT3BlcmF0b3IoY29tcGFyaXNvbik7XG5cbiAgICByZXR1cm4gbmV3IFNwYWNlRGVsaW1pdGVkVGV4dFBhdHRlcm4odGhpcy5jb2x1bW5zLCB0aGlzLmFkZFJlc3RyaWN0aW9uKGNvbHVtbk5hbWUsIHtcbiAgICAgIGNvbXBhcmlzb24sXG4gICAgICBudW1iZXJWYWx1ZTogdmFsdWUsXG4gICAgfSkpO1xuICB9XG5cbiAgcHVibGljIGdldCBsb2dQYXR0ZXJuU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuICdbJyArIHRoaXMuY29sdW1ucy5tYXAodGhpcy5jb2x1bW5FeHByZXNzaW9uLmJpbmQodGhpcykpLmpvaW4oJywgJykgKyAnXSc7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJuIHRoZSBjb2x1bW4gZXhwcmVzc2lvbiBmb3IgdGhlIGdpdmVuIGNvbHVtblxuICAgKi9cbiAgcHJpdmF0ZSBjb2x1bW5FeHByZXNzaW9uKGNvbHVtbjogc3RyaW5nKSB7XG4gICAgY29uc3QgcmVzdHJpY3Rpb25zID0gdGhpcy5yZXN0cmljdGlvbnNbY29sdW1uXTtcbiAgICBpZiAoIXJlc3RyaWN0aW9ucykgeyByZXR1cm4gY29sdW1uOyB9XG5cbiAgICByZXR1cm4gcmVzdHJpY3Rpb25zLm1hcChyID0+IHJlbmRlclJlc3RyaWN0aW9uKGNvbHVtbiwgcikpLmpvaW4oJyAmJiAnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBNYWtlIGEgY29weSBvZiB0aGUgY3VycmVudCByZXN0cmljdGlvbnMgYW5kIGFkZCBvbmVcbiAgICovXG4gIHByaXZhdGUgYWRkUmVzdHJpY3Rpb24oY29sdW1uTmFtZTogc3RyaW5nLCByZXN0cmljdGlvbjogQ29sdW1uUmVzdHJpY3Rpb24pIHtcbiAgICBjb25zdCByZXQ6IFJlc3RyaWN0aW9uTWFwID0ge307XG4gICAgZm9yIChjb25zdCBrZXkgb2YgT2JqZWN0LmtleXModGhpcy5yZXN0cmljdGlvbnMpKSB7XG4gICAgICByZXRba2V5XSA9IHRoaXMucmVzdHJpY3Rpb25zW2tleV0uc2xpY2UoKTtcbiAgICB9XG4gICAgaWYgKCEoY29sdW1uTmFtZSBpbiByZXQpKSB7IHJldFtjb2x1bW5OYW1lXSA9IFtdOyB9XG4gICAgcmV0W2NvbHVtbk5hbWVdLnB1c2gocmVzdHJpY3Rpb24pO1xuICAgIHJldHVybiByZXQ7XG4gIH1cbn1cblxuZXhwb3J0IGludGVyZmFjZSBDb2x1bW5SZXN0cmljdGlvbiB7XG4gIC8qKlxuICAgKiBDb21wYXJpc29uIG9wZXJhdG9yIHRvIHVzZVxuICAgKi9cbiAgcmVhZG9ubHkgY29tcGFyaXNvbjogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBTdHJpbmcgdmFsdWUgdG8gY29tcGFyZSB0b1xuICAgKlxuICAgKiBFeGFjdGx5IG9uZSBvZiAnc3RyaW5nVmFsdWUnIGFuZCAnbnVtYmVyVmFsdWUnIG11c3QgYmUgc2V0LlxuICAgKi9cbiAgcmVhZG9ubHkgc3RyaW5nVmFsdWU/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIE51bWJlciB2YWx1ZSB0byBjb21wYXJlIHRvXG4gICAqXG4gICAqIEV4YWN0bHkgb25lIG9mICdzdHJpbmdWYWx1ZScgYW5kICdudW1iZXJWYWx1ZScgbXVzdCBiZSBzZXQuXG4gICAqL1xuICByZWFkb25seSBudW1iZXJWYWx1ZT86IG51bWJlcjtcbn1cblxuLyoqXG4gKiBRdW90ZSBhIHRlcm0gZm9yIHVzZSBpbiBhIHBhdHRlcm4gZXhwcmVzc2lvblxuICpcbiAqIEl0J3MgbmV2ZXIgd3JvbmcgdG8gcXVvdGUgYSBzdHJpbmcgdGVybSwgYW5kIHJlcXVpcmVkIGlmIHRoZSB0ZXJtXG4gKiBjb250YWlucyBub24tYWxwaGFudW1lcmljYWwgY2hhcmFjdGVycywgc28gd2UganVzdCBhbHdheXMgZG8gaXQuXG4gKlxuICogSW5uZXIgZG91YmxlIHF1b3RlcyBhcmUgZXNjYXBlZCB1c2luZyBhIGJhY2tzbGFzaC5cbiAqL1xuZnVuY3Rpb24gcXVvdGVUZXJtKHRlcm06IHN0cmluZyk6IHN0cmluZyB7XG4gIHJldHVybiAnXCInICsgdGVybS5yZXBsYWNlKC9cXFxcL2csICdcXFxcXFxcXCcpLnJlcGxhY2UoL1wiL2csICdcXFxcXCInKSArICdcIic7XG59XG5cbi8qKlxuICogUmV0dXJuIHdoZXRoZXIgdGhlIGdpdmVuIGNvbHVtbiBuYW1lIGlzIHZhbGlkIGluIGEgc3BhY2UtZGVsaW1pdGVkIHRhYmxlXG4gKi9cbmZ1bmN0aW9uIHZhbGlkQ29sdW1uTmFtZShjb2x1bW46IHN0cmluZykge1xuICByZXR1cm4gY29sdW1uID09PSBDT0xfRUxMSVBTSVMgfHwgL15bYS16QS1aMC05Xy1dKyQvLmV4ZWMoY29sdW1uKTtcbn1cblxuLyoqXG4gKiBWYWxpZGF0ZSBhbmQgbm9ybWFsaXplIHRoZSBzdHJpbmcgY29tcGFyaXNvbiBvcGVyYXRvclxuICpcbiAqIENvcnJlY3QgZm9yIGEgY29tbW9uIHR5cG8vY29uZnVzaW9uLCB0cmVhdCAnPT0nIGFzICc9J1xuICovXG5mdW5jdGlvbiB2YWxpZGF0ZVN0cmluZ09wZXJhdG9yKG9wZXJhdG9yOiBzdHJpbmcpIHtcbiAgaWYgKG9wZXJhdG9yID09PSAnPT0nKSB7IG9wZXJhdG9yID0gJz0nOyB9XG5cbiAgaWYgKG9wZXJhdG9yICE9PSAnPScgJiYgb3BlcmF0b3IgIT09ICchPScpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgY29tcGFyaXNvbiBvcGVyYXRvciAoJyR7b3BlcmF0b3J9JyksIG11c3QgYmUgZWl0aGVyICc9JyBvciAnIT0nYCk7XG4gIH1cblxuICByZXR1cm4gb3BlcmF0b3I7XG59XG5cbmNvbnN0IFZBTElEX09QRVJBVE9SUyA9IFsnPScsICchPScsICc8JywgJzw9JywgJz4nLCAnPj0nXTtcblxuLyoqXG4gKiBWYWxpZGF0ZSBhbmQgbm9ybWFsaXplIG51bWVyaWNhbCBjb21wYXJpc29uIG9wZXJhdG9yc1xuICpcbiAqIENvcnJlY3QgZm9yIGEgY29tbW9uIHR5cG8vY29uZnVzaW9uLCB0cmVhdCAnPT0nIGFzICc9J1xuICovXG5mdW5jdGlvbiB2YWxpZGF0ZU51bWVyaWNhbE9wZXJhdG9yKG9wZXJhdG9yOiBzdHJpbmcpIHtcbiAgLy8gQ29ycmVjdCBmb3IgYSBjb21tb24gdHlwbywgdHJlYXQgJz09JyBhcyAnPSdcbiAgaWYgKG9wZXJhdG9yID09PSAnPT0nKSB7IG9wZXJhdG9yID0gJz0nOyB9XG5cbiAgaWYgKFZBTElEX09QRVJBVE9SUy5pbmRleE9mKG9wZXJhdG9yKSA9PT0gLTEpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgY29tcGFyaXNvbiBvcGVyYXRvciAoJyR7b3BlcmF0b3J9JyksIG11c3QgYmUgb25lIG9mICR7VkFMSURfT1BFUkFUT1JTLmpvaW4oJywgJyl9YCk7XG4gIH1cblxuICByZXR1cm4gb3BlcmF0b3I7XG59XG5cbi8qKlxuICogUmVuZGVyIGEgdGFibGUgcmVzdHJpY3Rpb25cbiAqL1xuZnVuY3Rpb24gcmVuZGVyUmVzdHJpY3Rpb24oY29sdW1uOiBzdHJpbmcsIHJlc3RyaWN0aW9uOiBDb2x1bW5SZXN0cmljdGlvbikge1xuICBpZiAocmVzdHJpY3Rpb24ubnVtYmVyVmFsdWUgIT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybiBgJHtjb2x1bW59ICR7cmVzdHJpY3Rpb24uY29tcGFyaXNvbn0gJHtyZXN0cmljdGlvbi5udW1iZXJWYWx1ZX1gO1xuICB9IGVsc2UgaWYgKHJlc3RyaWN0aW9uLnN0cmluZ1ZhbHVlKSB7XG4gICAgcmV0dXJuIGAke2NvbHVtbn0gJHtyZXN0cmljdGlvbi5jb21wYXJpc29ufSAke3F1b3RlVGVybShyZXN0cmljdGlvbi5zdHJpbmdWYWx1ZSl9YDtcbiAgfSBlbHNlIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgcmVzdHJpY3Rpb24nKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBzdW0oeHM6IG51bWJlcltdKTogbnVtYmVyIHtcbiAgcmV0dXJuIHhzLnJlZHVjZSgoYSwgYykgPT4gYSArIGMsIDApO1xufVxuIl19