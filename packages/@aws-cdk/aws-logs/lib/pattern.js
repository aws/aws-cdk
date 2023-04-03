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
_a = JSII_RTTI_SYMBOL_1;
JsonPattern[_a] = { fqn: "@aws-cdk/aws-logs.JsonPattern", version: "0.0.0" };
exports.JsonPattern = JsonPattern;
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
_b = JSII_RTTI_SYMBOL_1;
FilterPattern[_b] = { fqn: "@aws-cdk/aws-logs.FilterPattern", version: "0.0.0" };
exports.FilterPattern = FilterPattern;
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
    // TODO: Temporarily changed from private to protected to unblock build. We need to think
    //     about how to handle jsii types with private constructors.
    constructor(columns, restrictions) {
        this.columns = columns;
        this.restrictions = restrictions;
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
_c = JSII_RTTI_SYMBOL_1;
SpaceDelimitedTextPattern[_c] = { fqn: "@aws-cdk/aws-logs.SpaceDelimitedTextPattern", version: "0.0.0" };
exports.SpaceDelimitedTextPattern = SpaceDelimitedTextPattern;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGF0dGVybi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInBhdHRlcm4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBU0E7O0dBRUc7QUFDSCxNQUFzQixXQUFXO0lBQy9CLHlFQUF5RTtJQUN6RSxtRUFBbUU7SUFDbkUsWUFBNEIsaUJBQXlCO1FBQXpCLHNCQUFpQixHQUFqQixpQkFBaUIsQ0FBUTtLQUFLO0lBRTFELElBQVcsZ0JBQWdCO1FBQ3pCLE9BQU8sSUFBSSxHQUFHLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLENBQUM7S0FDN0M7Ozs7QUFQbUIsa0NBQVc7QUFVakM7O0dBRUc7QUFDSCxNQUFhLGFBQWE7SUFFeEI7Ozs7Ozs7T0FPRztJQUNJLE1BQU0sQ0FBQyxPQUFPLENBQUMsZ0JBQXdCO1FBQzVDLE9BQU8sSUFBSSxpQkFBaUIsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0tBQ2hEO0lBRUQ7O09BRUc7SUFDSSxNQUFNLENBQUMsU0FBUztRQUNyQixPQUFPLElBQUksaUJBQWlCLENBQUMsRUFBRSxDQUFDLENBQUM7S0FDbEM7SUFFRDs7OztPQUlHO0lBQ0ksTUFBTSxDQUFDLFFBQVEsQ0FBQyxHQUFHLEtBQWU7UUFDdkMsT0FBTyxJQUFJLGNBQWMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7S0FDcEM7SUFFRDs7OztPQUlHO0lBQ0ksTUFBTSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEtBQWU7UUFDdEMsT0FBTyxJQUFJLGNBQWMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDaEQ7SUFFRDs7Ozs7O09BTUc7SUFDSSxNQUFNLENBQUMsWUFBWSxDQUFDLEdBQUcsVUFBc0I7UUFDbEQsT0FBTyxJQUFJLGNBQWMsQ0FBQyxVQUFVLENBQUMsQ0FBQztLQUN2QztJQUVEOzs7Ozs7Ozs7Ozs7Ozs7OztPQWlCRztJQUNJLE1BQU0s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LE9BQU8sR0FBRyxNQUFNLElBQUksV0FBVyxDQUFDLFVBQVUsSUFBSSxTQUFTLENBQUMsV0FBVyxDQUFDLFdBQVcsQ0FBQyxFQUFFLENBQUM7S0FDcEY7U0FBTTtRQUNMLE1BQU0sSUFBSSxLQUFLLENBQUMscUJBQXFCLENBQUMsQ0FBQztLQUN4QztBQUNILENBQUM7QUFFRCxTQUFTLEdBQUcsQ0FBQyxFQUFZO0lBQ3ZCLE9BQU8sRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDdkMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8vIEltcGxlbWVudGF0aW9uIG9mIG1ldHJpYyBwYXR0ZXJuc1xuXG4vKipcbiAqIEludGVyZmFjZSBmb3Igb2JqZWN0cyB0aGF0IGNhbiByZW5kZXIgdGhlbXNlbHZlcyB0byBsb2cgcGF0dGVybnMuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgSUZpbHRlclBhdHRlcm4ge1xuICByZWFkb25seSBsb2dQYXR0ZXJuU3RyaW5nOiBzdHJpbmc7XG59XG5cbi8qKlxuICogQmFzZSBjbGFzcyBmb3IgcGF0dGVybnMgdGhhdCBvbmx5IG1hdGNoIEpTT04gbG9nIGV2ZW50cy5cbiAqL1xuZXhwb3J0IGFic3RyYWN0IGNsYXNzIEpzb25QYXR0ZXJuIGltcGxlbWVudHMgSUZpbHRlclBhdHRlcm4ge1xuICAvLyBUaGlzIGlzIGEgc2VwYXJhdGUgY2xhc3Mgc28gd2UgaGF2ZSBzb21lIHR5cGUgc2FmZXR5IHdoZXJlIHVzZXJzIGNhbid0XG4gIC8vIGNvbWJpbmUgdGV4dCBwYXR0ZXJucyBhbmQgSlNPTiBwYXR0ZXJucyB3aXRoIGFuICdhbmQnIG9wZXJhdGlvbi5cbiAgY29uc3RydWN0b3IocHVibGljIHJlYWRvbmx5IGpzb25QYXR0ZXJuU3RyaW5nOiBzdHJpbmcpIHsgfVxuXG4gIHB1YmxpYyBnZXQgbG9nUGF0dGVyblN0cmluZygpOiBzdHJpbmcge1xuICAgIHJldHVybiAneyAnICsgdGhpcy5qc29uUGF0dGVyblN0cmluZyArICcgfSc7XG4gIH1cbn1cblxuLyoqXG4gKiBBIGNvbGxlY3Rpb24gb2Ygc3RhdGljIG1ldGhvZHMgdG8gZ2VuZXJhdGUgYXBwcm9wcmlhdGUgSUxvZ1BhdHRlcm5zXG4gKi9cbmV4cG9ydCBjbGFzcyBGaWx0ZXJQYXR0ZXJuIHtcblxuICAvKipcbiAgICogVXNlIHRoZSBnaXZlbiBzdHJpbmcgYXMgbG9nIHBhdHRlcm4uXG4gICAqXG4gICAqIFNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQW1hem9uQ2xvdWRXYXRjaC9sYXRlc3QvbG9ncy9GaWx0ZXJBbmRQYXR0ZXJuU3ludGF4Lmh0bWxcbiAgICogZm9yIGluZm9ybWF0aW9uIG9uIHdyaXRpbmcgbG9nIHBhdHRlcm5zLlxuICAgKlxuICAgKiBAcGFyYW0gbG9nUGF0dGVyblN0cmluZyBUaGUgcGF0dGVybiBzdHJpbmcgdG8gdXNlLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBsaXRlcmFsKGxvZ1BhdHRlcm5TdHJpbmc6IHN0cmluZyk6IElGaWx0ZXJQYXR0ZXJuIHtcbiAgICByZXR1cm4gbmV3IExpdGVyYWxMb2dQYXR0ZXJuKGxvZ1BhdHRlcm5TdHJpbmcpO1xuICB9XG5cbiAgLyoqXG4gICAqIEEgbG9nIHBhdHRlcm4gdGhhdCBtYXRjaGVzIGFsbCBldmVudHMuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGFsbEV2ZW50cygpOiBJRmlsdGVyUGF0dGVybiB7XG4gICAgcmV0dXJuIG5ldyBMaXRlcmFsTG9nUGF0dGVybignJyk7XG4gIH1cblxuICAvKipcbiAgICogQSBsb2cgcGF0dGVybiB0aGF0IG1hdGNoZXMgaWYgYWxsIHRoZSBzdHJpbmdzIGdpdmVuIGFwcGVhciBpbiB0aGUgZXZlbnQuXG4gICAqXG4gICAqIEBwYXJhbSB0ZXJtcyBUaGUgd29yZHMgdG8gc2VhcmNoIGZvci4gQWxsIHRlcm1zIG11c3QgbWF0Y2guXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGFsbFRlcm1zKC4uLnRlcm1zOiBzdHJpbmdbXSk6IElGaWx0ZXJQYXR0ZXJuIHtcbiAgICByZXR1cm4gbmV3IFRleHRMb2dQYXR0ZXJuKFt0ZXJtc10pO1xuICB9XG5cbiAgLyoqXG4gICAqIEEgbG9nIHBhdHRlcm4gdGhhdCBtYXRjaGVzIGlmIGFueSBvZiB0aGUgc3RyaW5ncyBnaXZlbiBhcHBlYXIgaW4gdGhlIGV2ZW50LlxuICAgKlxuICAgKiBAcGFyYW0gdGVybXMgVGhlIHdvcmRzIHRvIHNlYXJjaCBmb3IuIEFueSB0ZXJtcyBtdXN0IG1hdGNoLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBhbnlUZXJtKC4uLnRlcm1zOiBzdHJpbmdbXSk6IElGaWx0ZXJQYXR0ZXJuIHtcbiAgICByZXR1cm4gbmV3IFRleHRMb2dQYXR0ZXJuKHRlcm1zLm1hcCh0ID0+IFt0XSkpO1xuICB9XG5cbiAgLyoqXG4gICAqIEEgbG9nIHBhdHRlcm4gdGhhdCBtYXRjaGVzIGlmIGFueSBvZiB0aGUgZ2l2ZW4gdGVybSBncm91cHMgbWF0Y2hlcyB0aGUgZXZlbnQuXG4gICAqXG4gICAqIEEgdGVybSBncm91cCBtYXRjaGVzIGFuIGV2ZW50IGlmIGFsbCB0aGUgdGVybXMgaW4gaXQgYXBwZWFyIGluIHRoZSBldmVudCBzdHJpbmcuXG4gICAqXG4gICAqIEBwYXJhbSB0ZXJtR3JvdXBzIEEgbGlzdCBvZiB0ZXJtIGdyb3VwcyB0byBzZWFyY2ggZm9yLiBBbnkgb25lIG9mIHRoZSBjbGF1c2VzIG11c3QgbWF0Y2guXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGFueVRlcm1Hcm91cCguLi50ZXJtR3JvdXBzOiBzdHJpbmdbXVtdKTogSUZpbHRlclBhdHRlcm4ge1xuICAgIHJldHVybiBuZXcgVGV4dExvZ1BhdHRlcm4odGVybUdyb3Vwcyk7XG4gIH1cblxuICAvKipcbiAgICogQSBKU09OIGxvZyBwYXR0ZXJuIHRoYXQgY29tcGFyZXMgc3RyaW5nIHZhbHVlcy5cbiAgICpcbiAgICogVGhpcyBwYXR0ZXJuIG9ubHkgbWF0Y2hlcyBpZiB0aGUgZXZlbnQgaXMgYSBKU09OIGV2ZW50LCBhbmQgdGhlIGluZGljYXRlZCBmaWVsZCBpbnNpZGVcbiAgICogY29tcGFyZXMgd2l0aCB0aGUgc3RyaW5nIHZhbHVlLlxuICAgKlxuICAgKiBVc2UgJyQnIHRvIGluZGljYXRlIHRoZSByb290IG9mIHRoZSBKU09OIHN0cnVjdHVyZS4gVGhlIGNvbXBhcmlzb24gb3BlcmF0b3IgY2FuIG9ubHlcbiAgICogY29tcGFyZSBlcXVhbGl0eSBvciBpbmVxdWFsaXR5LiBUaGUgJyonIHdpbGRjYXJkIG1heSBhcHBlYXIgaW4gdGhlIHZhbHVlIG1heSBhdCB0aGVcbiAgICogc3RhcnQgb3IgYXQgdGhlIGVuZC5cbiAgICpcbiAgICogRm9yIG1vcmUgaW5mb3JtYXRpb24sIHNlZTpcbiAgICpcbiAgICogaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FtYXpvbkNsb3VkV2F0Y2gvbGF0ZXN0L2xvZ3MvRmlsdGVyQW5kUGF0dGVyblN5bnRheC5odG1sXG4gICAqXG4gICAqIEBwYXJhbSBqc29uRmllbGQgRmllbGQgaW5zaWRlIEpTT04uIEV4YW1wbGU6IFwiJC5teUZpZWxkXCJcbiAgICogQHBhcmFtIGNvbXBhcmlzb24gQ29tcGFyaXNvbiB0byBjYXJyeSBvdXQuIEVpdGhlciA9IG9yICE9LlxuICAgKiBAcGFyYW0gdmFsdWUgVGhlIHN0cmluZyB2YWx1ZSB0byBjb21wYXJlIHRvLiBNYXkgdXNlICcqJyBhcyB3aWxkY2FyZCBhdCBzdGFydCBvciBlbmQgb2Ygc3RyaW5nLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBzdHJpbmdWYWx1ZShqc29uRmllbGQ6IHN0cmluZywgY29tcGFyaXNvbjogc3RyaW5nLCB2YWx1ZTogc3RyaW5nKTogSnNvblBhdHRlcm4ge1xuICAgIHJldHVybiBuZXcgSlNPTlN0cmluZ1BhdHRlcm4oanNvbkZpZWxkLCBjb21wYXJpc29uLCB2YWx1ZSk7XG4gIH1cblxuICAvKipcbiAgICogQSBKU09OIGxvZyBwYXR0ZXJuIHRoYXQgY29tcGFyZXMgbnVtZXJpY2FsIHZhbHVlcy5cbiAgICpcbiAgICogVGhpcyBwYXR0ZXJuIG9ubHkgbWF0Y2hlcyBpZiB0aGUgZXZlbnQgaXMgYSBKU09OIGV2ZW50LCBhbmQgdGhlIGluZGljYXRlZCBmaWVsZCBpbnNpZGVcbiAgICogY29tcGFyZXMgd2l0aCB0aGUgdmFsdWUgaW4gdGhlIGluZGljYXRlZCB3YXkuXG4gICAqXG4gICAqIFVzZSAnJCcgdG8gaW5kaWNhdGUgdGhlIHJvb3Qgb2YgdGhlIEpTT04gc3RydWN0dXJlLiBUaGUgY29tcGFyaXNvbiBvcGVyYXRvciBjYW4gb25seVxuICAgKiBjb21wYXJlIGVxdWFsaXR5IG9yIGluZXF1YWxpdHkuIFRoZSAnKicgd2lsZGNhcmQgbWF5IGFwcGVhciBpbiB0aGUgdmFsdWUgbWF5IGF0IHRoZVxuICAgKiBzdGFydCBvciBhdCB0aGUgZW5kLlxuICAgKlxuICAgKiBGb3IgbW9yZSBpbmZvcm1hdGlvbiwgc2VlOlxuICAgKlxuICAgKiBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQW1hem9uQ2xvdWRXYXRjaC9sYXRlc3QvbG9ncy9GaWx0ZXJBbmRQYXR0ZXJuU3ludGF4Lmh0bWxcbiAgICpcbiAgICogQHBhcmFtIGpzb25GaWVsZCBGaWVsZCBpbnNpZGUgSlNPTi4gRXhhbXBsZTogXCIkLm15RmllbGRcIlxuICAgKiBAcGFyYW0gY29tcGFyaXNvbiBDb21wYXJpc29uIHRvIGNhcnJ5IG91dC4gT25lIG9mID0sICE9LCA8LCA8PSwgPiwgPj0uXG4gICAqIEBwYXJhbSB2YWx1ZSBUaGUgbnVtZXJpY2FsIHZhbHVlIHRvIGNvbXBhcmUgdG9cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgbnVtYmVyVmFsdWUoanNvbkZpZWxkOiBzdHJpbmcsIGNvbXBhcmlzb246IHN0cmluZywgdmFsdWU6IG51bWJlcik6IEpzb25QYXR0ZXJuIHtcbiAgICByZXR1cm4gbmV3IEpTT05OdW1iZXJQYXR0ZXJuKGpzb25GaWVsZCwgY29tcGFyaXNvbiwgdmFsdWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIEEgSlNPTiBsb2cgcGF0dGVybiB0aGF0IG1hdGNoZXMgaWYgdGhlIGZpZWxkIGV4aXN0cyBhbmQgaGFzIHRoZSBzcGVjaWFsIHZhbHVlICdudWxsJy5cbiAgICpcbiAgICogQHBhcmFtIGpzb25GaWVsZCBGaWVsZCBpbnNpZGUgSlNPTi4gRXhhbXBsZTogXCIkLm15RmllbGRcIlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBpc051bGwoanNvbkZpZWxkOiBzdHJpbmcpOiBKc29uUGF0dGVybiB7XG4gICAgcmV0dXJuIG5ldyBKU09OUG9zdGZpeFBhdHRlcm4oanNvbkZpZWxkLCAnSVMgTlVMTCcpO1xuICB9XG5cbiAgLyoqXG4gICAqIEEgSlNPTiBsb2cgcGF0dGVybiB0aGF0IG1hdGNoZXMgaWYgdGhlIGZpZWxkIGRvZXMgbm90IGV4aXN0LlxuICAgKlxuICAgKiBAcGFyYW0ganNvbkZpZWxkIEZpZWxkIGluc2lkZSBKU09OLiBFeGFtcGxlOiBcIiQubXlGaWVsZFwiXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIG5vdEV4aXN0cyhqc29uRmllbGQ6IHN0cmluZyk6IEpzb25QYXR0ZXJuIHtcbiAgICByZXR1cm4gbmV3IEpTT05Qb3N0Zml4UGF0dGVybihqc29uRmllbGQsICdOT1QgRVhJU1RTJyk7XG4gIH1cblxuICAvKipcbiAgICogQSBKU09OIGxvZyBwYXR0ZXIgdGhhdCBtYXRjaGVzIGlmIHRoZSBmaWVsZCBleGlzdHMuXG4gICAqXG4gICAqIFRoaXMgaXMgYSByZWFkYWJsZSBjb252ZW5pZW5jZSB3cmFwcGVyIG92ZXIgJ2ZpZWxkID0gKidcbiAgICpcbiAgICogQHBhcmFtIGpzb25GaWVsZCBGaWVsZCBpbnNpZGUgSlNPTi4gRXhhbXBsZTogXCIkLm15RmllbGRcIlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBleGlzdHMoanNvbkZpZWxkOiBzdHJpbmcpOiBKc29uUGF0dGVybiB7XG4gICAgcmV0dXJuIG5ldyBKU09OU3RyaW5nUGF0dGVybihqc29uRmllbGQsICc9JywgJyonKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBIEpTT04gbG9nIHBhdHRlcm4gdGhhdCBtYXRjaGVzIGlmIHRoZSBmaWVsZCBleGlzdHMgYW5kIGVxdWFscyB0aGUgYm9vbGVhbiB2YWx1ZS5cbiAgICpcbiAgICogQHBhcmFtIGpzb25GaWVsZCBGaWVsZCBpbnNpZGUgSlNPTi4gRXhhbXBsZTogXCIkLm15RmllbGRcIlxuICAgKiBAcGFyYW0gdmFsdWUgVGhlIHZhbHVlIHRvIG1hdGNoXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGJvb2xlYW5WYWx1ZShqc29uRmllbGQ6IHN0cmluZywgdmFsdWU6IGJvb2xlYW4pOiBKc29uUGF0dGVybiB7XG4gICAgcmV0dXJuIG5ldyBKU09OUG9zdGZpeFBhdHRlcm4oanNvbkZpZWxkLCB2YWx1ZSA/ICdJUyBUUlVFJyA6ICdJUyBGQUxTRScpO1xuICB9XG5cbiAgLyoqXG4gICAqIEEgSlNPTiBsb2cgcGF0dGVybiB0aGF0IG1hdGNoZXMgaWYgYWxsIGdpdmVuIEpTT04gbG9nIHBhdHRlcm5zIG1hdGNoXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGFsbCguLi5wYXR0ZXJuczogSnNvblBhdHRlcm5bXSk6IEpzb25QYXR0ZXJuIHtcbiAgICBpZiAocGF0dGVybnMubGVuZ3RoID09PSAwKSB7IHRocm93IG5ldyBFcnJvcignTXVzdCBzdXBwbHkgYXQgbGVhc3Qgb25lIHBhdHRlcm4sIG9yIHVzZSBhbGxFdmVudHMoKSB0byBtYXRjaCBhbGwgZXZlbnRzLicpOyB9XG4gICAgaWYgKHBhdHRlcm5zLmxlbmd0aCA9PT0gMSkgeyByZXR1cm4gcGF0dGVybnNbMF07IH1cbiAgICByZXR1cm4gbmV3IEpTT05BZ2dyZWdhdGVQYXR0ZXJuKCcmJicsIHBhdHRlcm5zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBIEpTT04gbG9nIHBhdHRlcm4gdGhhdCBtYXRjaGVzIGlmIGFueSBvZiB0aGUgZ2l2ZW4gSlNPTiBsb2cgcGF0dGVybnMgbWF0Y2hcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgYW55KC4uLnBhdHRlcm5zOiBKc29uUGF0dGVybltdKTogSnNvblBhdHRlcm4ge1xuICAgIGlmIChwYXR0ZXJucy5sZW5ndGggPT09IDApIHsgdGhyb3cgbmV3IEVycm9yKCdNdXN0IHN1cHBseSBhdCBsZWFzdCBvbmUgcGF0dGVybicpOyB9XG4gICAgaWYgKHBhdHRlcm5zLmxlbmd0aCA9PT0gMSkgeyByZXR1cm4gcGF0dGVybnNbMF07IH1cbiAgICByZXR1cm4gbmV3IEpTT05BZ2dyZWdhdGVQYXR0ZXJuKCd8fCcsIHBhdHRlcm5zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBIHNwYWNlIGRlbGltaXRlZCBsb2cgcGF0dGVybiBtYXRjaGVyLlxuICAgKlxuICAgKiBUaGUgbG9nIGV2ZW50IGlzIGRpdmlkZWQgaW50byBzcGFjZS1kZWxpbWl0ZWQgY29sdW1ucyAob3B0aW9uYWxseVxuICAgKiBlbmNsb3NlZCBieSBcIlwiIG9yIFtdIHRvIGNhcHR1cmUgc3BhY2VzIGludG8gY29sdW1uIHZhbHVlcyksIGFuZCBuYW1lc1xuICAgKiBhcmUgZ2l2ZW4gdG8gZWFjaCBjb2x1bW4uXG4gICAqXG4gICAqICcuLi4nIG1heSBiZSBzcGVjaWZpZWQgb25jZSB0byBtYXRjaCBhbnkgbnVtYmVyIG9mIGNvbHVtbnMuXG4gICAqXG4gICAqIEFmdGVyd2FyZHMsIGNvbmRpdGlvbnMgbWF5IGJlIGFkZGVkIHRvIGluZGl2aWR1YWwgY29sdW1ucy5cbiAgICpcbiAgICogQHBhcmFtIGNvbHVtbnMgVGhlIGNvbHVtbnMgaW4gdGhlIHNwYWNlLWRlbGltaXRlZCBsb2cgc3RyZWFtLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBzcGFjZURlbGltaXRlZCguLi5jb2x1bW5zOiBzdHJpbmdbXSk6IFNwYWNlRGVsaW1pdGVkVGV4dFBhdHRlcm4ge1xuICAgIHJldHVybiBTcGFjZURlbGltaXRlZFRleHRQYXR0ZXJuLmNvbnN0cnVjdChjb2x1bW5zKTtcbiAgfVxufVxuXG4vKipcbiAqIFVzZSBhIHN0cmluZyBsaXRlcmFsIGFzIGEgbG9nIHBhdHRlcm5cbiAqL1xuY2xhc3MgTGl0ZXJhbExvZ1BhdHRlcm4gaW1wbGVtZW50cyBJRmlsdGVyUGF0dGVybiB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyByZWFkb25seSBsb2dQYXR0ZXJuU3RyaW5nOiBzdHJpbmcpIHtcbiAgfVxufVxuXG4vKipcbiAqIFNlYXJjaCBmb3IgYSBzZXQgb2Ygc2V0IG9mIHRlcm1zXG4gKi9cbmNsYXNzIFRleHRMb2dQYXR0ZXJuIGltcGxlbWVudHMgSUZpbHRlclBhdHRlcm4ge1xuICBwdWJsaWMgcmVhZG9ubHkgbG9nUGF0dGVyblN0cmluZzogc3RyaW5nO1xuXG4gIGNvbnN0cnVjdG9yKGNsYXVzZXM6IHN0cmluZ1tdW10pIHtcbiAgICBjb25zdCBxdW90ZWRDbGF1c2VzID0gY2xhdXNlcy5tYXAodGVybXMgPT4gdGVybXMubWFwKHF1b3RlVGVybSkuam9pbignICcpKTtcbiAgICBpZiAocXVvdGVkQ2xhdXNlcy5sZW5ndGggPT09IDEpIHtcbiAgICAgIHRoaXMubG9nUGF0dGVyblN0cmluZyA9IHF1b3RlZENsYXVzZXNbMF07XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMubG9nUGF0dGVyblN0cmluZyA9IHF1b3RlZENsYXVzZXMubWFwKGFsdCA9PiAnPycgKyBhbHQpLmpvaW4oJyAnKTtcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBBIHN0cmluZyBjb21wYXJpc29uIGZvciBKU09OIHZhbHVlc1xuICovXG5jbGFzcyBKU09OU3RyaW5nUGF0dGVybiBleHRlbmRzIEpzb25QYXR0ZXJuIHtcbiAgcHVibGljIGNvbnN0cnVjdG9yKGpzb25GaWVsZDogc3RyaW5nLCBjb21wYXJpc29uOiBzdHJpbmcsIHZhbHVlOiBzdHJpbmcpIHtcbiAgICBjb21wYXJpc29uID0gdmFsaWRhdGVTdHJpbmdPcGVyYXRvcihjb21wYXJpc29uKTtcbiAgICBzdXBlcihgJHtqc29uRmllbGR9ICR7Y29tcGFyaXNvbn0gJHtxdW90ZVRlcm0odmFsdWUpfWApO1xuICB9XG59XG5cbi8qKlxuICogQSBudW1iZXIgY29tcGFyaXNvbiBmb3IgSlNPTiB2YWx1ZXNcbiAqL1xuY2xhc3MgSlNPTk51bWJlclBhdHRlcm4gZXh0ZW5kcyBKc29uUGF0dGVybiB7XG4gIHB1YmxpYyBjb25zdHJ1Y3Rvcihqc29uRmllbGQ6IHN0cmluZywgY29tcGFyaXNvbjogc3RyaW5nLCB2YWx1ZTogbnVtYmVyKSB7XG4gICAgY29tcGFyaXNvbiA9IHZhbGlkYXRlTnVtZXJpY2FsT3BlcmF0b3IoY29tcGFyaXNvbik7XG4gICAgc3VwZXIoYCR7anNvbkZpZWxkfSAke2NvbXBhcmlzb259ICR7dmFsdWV9YCk7XG4gIH1cbn1cblxuLyoqXG4gKiBBIHBvc3RmaXggb3BlcmF0b3IgZm9yIEpTT04gcGF0dGVybnNcbiAqL1xuY2xhc3MgSlNPTlBvc3RmaXhQYXR0ZXJuIGV4dGVuZHMgSnNvblBhdHRlcm4ge1xuICBwdWJsaWMgY29uc3RydWN0b3IoanNvbkZpZWxkOiBzdHJpbmcsIHBvc3RmaXg6IHN0cmluZykge1xuICAgIC8vIE5vIHZhbGlkYXRpb24sIHdlIGFzc3VtZSB0aGVzZSBhcmUgZ2VuZXJhdGVkIGJ5IHRydXN0ZWQgZmFjdG9yeSBmdW5jdGlvbnNcbiAgICBzdXBlcihgJHtqc29uRmllbGR9ICR7cG9zdGZpeH1gKTtcbiAgfVxufVxuXG4vKipcbiAqIENvbWJpbmVzIG11bHRpcGxlIG90aGVyIEpTT04gcGF0dGVybnMgd2l0aCBhbiBvcGVyYXRvclxuICovXG5jbGFzcyBKU09OQWdncmVnYXRlUGF0dGVybiBleHRlbmRzIEpzb25QYXR0ZXJuIHtcbiAgcHVibGljIGNvbnN0cnVjdG9yKG9wZXJhdG9yOiBzdHJpbmcsIHBhdHRlcm5zOiBKc29uUGF0dGVybltdKSB7XG4gICAgaWYgKG9wZXJhdG9yICE9PSAnJiYnICYmIG9wZXJhdG9yICE9PSAnfHwnKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ09wZXJhdG9yIG11c3QgYmUgb25lIG9mICYmIG9yIHx8Jyk7XG4gICAgfVxuXG4gICAgY29uc3QgY2xhdXNlcyA9IHBhdHRlcm5zLm1hcChwID0+ICcoJyArIHAuanNvblBhdHRlcm5TdHJpbmcgKyAnKScpO1xuXG4gICAgc3VwZXIoY2xhdXNlcy5qb2luKGAgJHtvcGVyYXRvcn0gYCkpO1xuICB9XG59XG5cbmV4cG9ydCB0eXBlIFJlc3RyaWN0aW9uTWFwID0ge1tjb2x1bW46IHN0cmluZ106IENvbHVtblJlc3RyaWN0aW9uW119O1xuXG5jb25zdCBDT0xfRUxMSVBTSVMgPSAnLi4uJztcblxuLyoqXG4gKiBTcGFjZSBkZWxpbWl0ZWQgdGV4dCBwYXR0ZXJuXG4gKi9cbmV4cG9ydCBjbGFzcyBTcGFjZURlbGltaXRlZFRleHRQYXR0ZXJuIGltcGxlbWVudHMgSUZpbHRlclBhdHRlcm4ge1xuICAvKipcbiAgICogQ29uc3RydWN0IGEgbmV3IGluc3RhbmNlIG9mIGEgc3BhY2UgZGVsaW1pdGVkIHRleHQgcGF0dGVyblxuICAgKlxuICAgKiBTaW5jZSB0aGlzIGNsYXNzIG11c3QgYmUgcHVibGljLCB3ZSBjYW4ndCByZWx5IG9uIHRoZSB1c2VyIG9ubHkgY3JlYXRpbmcgaXQgdGhyb3VnaFxuICAgKiB0aGUgYExvZ1BhdHRlcm4uc3BhY2VEZWxpbWl0ZWQoKWAgZmFjdG9yeSBmdW5jdGlvbi4gV2UgbXVzdCB0aGVyZWZvcmUgdmFsaWRhdGUgdGhlXG4gICAqIGFyZ3VtZW50IGluIHRoZSBjb25zdHJ1Y3Rvci4gU2luY2Ugd2UncmUgcmV0dXJuaW5nIGEgY29weSBvbiBldmVyeSBtdXRhdGlvbiwgYW5kIHdlXG4gICAqIGRvbid0IHdhbnQgdG8gcmUtdmFsaWRhdGUgdGhlIHNhbWUgdGhpbmdzIG9uIGV2ZXJ5IGNvbnN0cnVjdGlvbiwgd2UgcHJvdmlkZSBhIGxpbWl0ZWRcbiAgICogc2V0IG9mIG11dGF0b3IgZnVuY3Rpb25zIGFuZCBvbmx5IHZhbGlkYXRlIHRoZSBuZXcgZGF0YSBldmVyeSB0aW1lLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBjb25zdHJ1Y3QoY29sdW1uczogc3RyaW5nW10pIHtcbiAgICAvLyBWYWxpZGF0aW9uIGhhcHBlbnMgaGVyZSBiZWNhdXNlIGEgdXNlciBjb3VsZCBpbnN0YW50aWF0ZSB0aGlzIG9iamVjdCBkaXJlY3RseSB3aXRob3V0XG4gICAgLy8gZ29pbmcgdGhyb3VnaCB0aGUgZmFjdG9yeVxuICAgIGZvciAoY29uc3QgY29sdW1uIG9mIGNvbHVtbnMpIHtcbiAgICAgIGlmICghdmFsaWRDb2x1bW5OYW1lKGNvbHVtbikpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIGNvbHVtbiBuYW1lOiAke2NvbHVtbn1gKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoc3VtKGNvbHVtbnMubWFwKGMgPT4gYyA9PT0gQ09MX0VMTElQU0lTID8gMSA6IDApKSA+IDEpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkNhbiB1c2UgYXQgbW9zdCBvbmUgJy4uLicgY29sdW1uXCIpO1xuICAgIH1cblxuICAgIHJldHVybiBuZXcgU3BhY2VEZWxpbWl0ZWRUZXh0UGF0dGVybihjb2x1bW5zLCB7fSk7XG4gIH1cblxuICAvLyBUT0RPOiBUZW1wb3JhcmlseSBjaGFuZ2VkIGZyb20gcHJpdmF0ZSB0byBwcm90ZWN0ZWQgdG8gdW5ibG9jayBidWlsZC4gV2UgbmVlZCB0byB0aGlua1xuICAvLyAgICAgYWJvdXQgaG93IHRvIGhhbmRsZSBqc2lpIHR5cGVzIHdpdGggcHJpdmF0ZSBjb25zdHJ1Y3RvcnMuXG4gIHByb3RlY3RlZCBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IGNvbHVtbnM6IHN0cmluZ1tdLCBwcml2YXRlIHJlYWRvbmx5IHJlc3RyaWN0aW9uczogUmVzdHJpY3Rpb25NYXApIHtcbiAgICAvLyBQcml2YXRlIGNvbnN0cnVjdG9yIHNvIHdlIHZhbGlkYXRlIGluIHRoZSAuY29uc3RydWN0KCkgZmFjdG9yeSBmdW5jdGlvblxuICB9XG5cbiAgLyoqXG4gICAqIFJlc3RyaWN0IHdoZXJlIHRoZSBwYXR0ZXJuIGFwcGxpZXNcbiAgICovXG4gIHB1YmxpYyB3aGVyZVN0cmluZyhjb2x1bW5OYW1lOiBzdHJpbmcsIGNvbXBhcmlzb246IHN0cmluZywgdmFsdWU6IHN0cmluZyk6IFNwYWNlRGVsaW1pdGVkVGV4dFBhdHRlcm4ge1xuICAgIGlmIChjb2x1bW5OYW1lID09PSBDT0xfRUxMSVBTSVMpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkNhbid0IHVzZSAnLi4uJyBpbiBhIHJlc3RyaWN0aW9uXCIpO1xuICAgIH1cbiAgICBpZiAodGhpcy5jb2x1bW5zLmluZGV4T2YoY29sdW1uTmFtZSkgPT09IC0xKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYENvbHVtbiBpbiByZXN0cmljdGlvbnMgdGhhdCBpcyBub3QgaW4gY29sdW1uczogJHtjb2x1bW5OYW1lfWApO1xuICAgIH1cblxuICAgIGNvbXBhcmlzb24gPSB2YWxpZGF0ZVN0cmluZ09wZXJhdG9yKGNvbXBhcmlzb24pO1xuXG4gICAgcmV0dXJuIG5ldyBTcGFjZURlbGltaXRlZFRleHRQYXR0ZXJuKHRoaXMuY29sdW1ucywgdGhpcy5hZGRSZXN0cmljdGlvbihjb2x1bW5OYW1lLCB7XG4gICAgICBjb21wYXJpc29uLFxuICAgICAgc3RyaW5nVmFsdWU6IHZhbHVlLFxuICAgIH0pKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXN0cmljdCB3aGVyZSB0aGUgcGF0dGVybiBhcHBsaWVzXG4gICAqL1xuICBwdWJsaWMgd2hlcmVOdW1iZXIoY29sdW1uTmFtZTogc3RyaW5nLCBjb21wYXJpc29uOiBzdHJpbmcsIHZhbHVlOiBudW1iZXIpOiBTcGFjZURlbGltaXRlZFRleHRQYXR0ZXJuIHtcbiAgICBpZiAoY29sdW1uTmFtZSA9PT0gQ09MX0VMTElQU0lTKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDYW4ndCB1c2UgJy4uLicgaW4gYSByZXN0cmljdGlvblwiKTtcbiAgICB9XG4gICAgaWYgKHRoaXMuY29sdW1ucy5pbmRleE9mKGNvbHVtbk5hbWUpID09PSAtMSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBDb2x1bW4gaW4gcmVzdHJpY3Rpb25zIHRoYXQgaXMgbm90IGluIGNvbHVtbnM6ICR7Y29sdW1uTmFtZX1gKTtcbiAgICB9XG5cbiAgICBjb21wYXJpc29uID0gdmFsaWRhdGVOdW1lcmljYWxPcGVyYXRvcihjb21wYXJpc29uKTtcblxuICAgIHJldHVybiBuZXcgU3BhY2VEZWxpbWl0ZWRUZXh0UGF0dGVybih0aGlzLmNvbHVtbnMsIHRoaXMuYWRkUmVzdHJpY3Rpb24oY29sdW1uTmFtZSwge1xuICAgICAgY29tcGFyaXNvbixcbiAgICAgIG51bWJlclZhbHVlOiB2YWx1ZSxcbiAgICB9KSk7XG4gIH1cblxuICBwdWJsaWMgZ2V0IGxvZ1BhdHRlcm5TdHJpbmcoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gJ1snICsgdGhpcy5jb2x1bW5zLm1hcCh0aGlzLmNvbHVtbkV4cHJlc3Npb24uYmluZCh0aGlzKSkuam9pbignLCAnKSArICddJztcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm4gdGhlIGNvbHVtbiBleHByZXNzaW9uIGZvciB0aGUgZ2l2ZW4gY29sdW1uXG4gICAqL1xuICBwcml2YXRlIGNvbHVtbkV4cHJlc3Npb24oY29sdW1uOiBzdHJpbmcpIHtcbiAgICBjb25zdCByZXN0cmljdGlvbnMgPSB0aGlzLnJlc3RyaWN0aW9uc1tjb2x1bW5dO1xuICAgIGlmICghcmVzdHJpY3Rpb25zKSB7IHJldHVybiBjb2x1bW47IH1cblxuICAgIHJldHVybiByZXN0cmljdGlvbnMubWFwKHIgPT4gcmVuZGVyUmVzdHJpY3Rpb24oY29sdW1uLCByKSkuam9pbignICYmICcpO1xuICB9XG5cbiAgLyoqXG4gICAqIE1ha2UgYSBjb3B5IG9mIHRoZSBjdXJyZW50IHJlc3RyaWN0aW9ucyBhbmQgYWRkIG9uZVxuICAgKi9cbiAgcHJpdmF0ZSBhZGRSZXN0cmljdGlvbihjb2x1bW5OYW1lOiBzdHJpbmcsIHJlc3RyaWN0aW9uOiBDb2x1bW5SZXN0cmljdGlvbikge1xuICAgIGNvbnN0IHJldDogUmVzdHJpY3Rpb25NYXAgPSB7fTtcbiAgICBmb3IgKGNvbnN0IGtleSBvZiBPYmplY3Qua2V5cyh0aGlzLnJlc3RyaWN0aW9ucykpIHtcbiAgICAgIHJldFtrZXldID0gdGhpcy5yZXN0cmljdGlvbnNba2V5XS5zbGljZSgpO1xuICAgIH1cbiAgICBpZiAoIShjb2x1bW5OYW1lIGluIHJldCkpIHsgcmV0W2NvbHVtbk5hbWVdID0gW107IH1cbiAgICByZXRbY29sdW1uTmFtZV0ucHVzaChyZXN0cmljdGlvbik7XG4gICAgcmV0dXJuIHJldDtcbiAgfVxufVxuXG5leHBvcnQgaW50ZXJmYWNlIENvbHVtblJlc3RyaWN0aW9uIHtcbiAgLyoqXG4gICAqIENvbXBhcmlzb24gb3BlcmF0b3IgdG8gdXNlXG4gICAqL1xuICByZWFkb25seSBjb21wYXJpc29uOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFN0cmluZyB2YWx1ZSB0byBjb21wYXJlIHRvXG4gICAqXG4gICAqIEV4YWN0bHkgb25lIG9mICdzdHJpbmdWYWx1ZScgYW5kICdudW1iZXJWYWx1ZScgbXVzdCBiZSBzZXQuXG4gICAqL1xuICByZWFkb25seSBzdHJpbmdWYWx1ZT86IHN0cmluZztcblxuICAvKipcbiAgICogTnVtYmVyIHZhbHVlIHRvIGNvbXBhcmUgdG9cbiAgICpcbiAgICogRXhhY3RseSBvbmUgb2YgJ3N0cmluZ1ZhbHVlJyBhbmQgJ251bWJlclZhbHVlJyBtdXN0IGJlIHNldC5cbiAgICovXG4gIHJlYWRvbmx5IG51bWJlclZhbHVlPzogbnVtYmVyO1xufVxuXG4vKipcbiAqIFF1b3RlIGEgdGVybSBmb3IgdXNlIGluIGEgcGF0dGVybiBleHByZXNzaW9uXG4gKlxuICogSXQncyBuZXZlciB3cm9uZyB0byBxdW90ZSBhIHN0cmluZyB0ZXJtLCBhbmQgcmVxdWlyZWQgaWYgdGhlIHRlcm1cbiAqIGNvbnRhaW5zIG5vbi1hbHBoYW51bWVyaWNhbCBjaGFyYWN0ZXJzLCBzbyB3ZSBqdXN0IGFsd2F5cyBkbyBpdC5cbiAqXG4gKiBJbm5lciBkb3VibGUgcXVvdGVzIGFyZSBlc2NhcGVkIHVzaW5nIGEgYmFja3NsYXNoLlxuICovXG5mdW5jdGlvbiBxdW90ZVRlcm0odGVybTogc3RyaW5nKTogc3RyaW5nIHtcbiAgcmV0dXJuICdcIicgKyB0ZXJtLnJlcGxhY2UoL1xcXFwvZywgJ1xcXFxcXFxcJykucmVwbGFjZSgvXCIvZywgJ1xcXFxcIicpICsgJ1wiJztcbn1cblxuLyoqXG4gKiBSZXR1cm4gd2hldGhlciB0aGUgZ2l2ZW4gY29sdW1uIG5hbWUgaXMgdmFsaWQgaW4gYSBzcGFjZS1kZWxpbWl0ZWQgdGFibGVcbiAqL1xuZnVuY3Rpb24gdmFsaWRDb2x1bW5OYW1lKGNvbHVtbjogc3RyaW5nKSB7XG4gIHJldHVybiBjb2x1bW4gPT09IENPTF9FTExJUFNJUyB8fCAvXlthLXpBLVowLTlfLV0rJC8uZXhlYyhjb2x1bW4pO1xufVxuXG4vKipcbiAqIFZhbGlkYXRlIGFuZCBub3JtYWxpemUgdGhlIHN0cmluZyBjb21wYXJpc29uIG9wZXJhdG9yXG4gKlxuICogQ29ycmVjdCBmb3IgYSBjb21tb24gdHlwby9jb25mdXNpb24sIHRyZWF0ICc9PScgYXMgJz0nXG4gKi9cbmZ1bmN0aW9uIHZhbGlkYXRlU3RyaW5nT3BlcmF0b3Iob3BlcmF0b3I6IHN0cmluZykge1xuICBpZiAob3BlcmF0b3IgPT09ICc9PScpIHsgb3BlcmF0b3IgPSAnPSc7IH1cblxuICBpZiAob3BlcmF0b3IgIT09ICc9JyAmJiBvcGVyYXRvciAhPT0gJyE9Jykge1xuICAgIHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBjb21wYXJpc29uIG9wZXJhdG9yICgnJHtvcGVyYXRvcn0nKSwgbXVzdCBiZSBlaXRoZXIgJz0nIG9yICchPSdgKTtcbiAgfVxuXG4gIHJldHVybiBvcGVyYXRvcjtcbn1cblxuY29uc3QgVkFMSURfT1BFUkFUT1JTID0gWyc9JywgJyE9JywgJzwnLCAnPD0nLCAnPicsICc+PSddO1xuXG4vKipcbiAqIFZhbGlkYXRlIGFuZCBub3JtYWxpemUgbnVtZXJpY2FsIGNvbXBhcmlzb24gb3BlcmF0b3JzXG4gKlxuICogQ29ycmVjdCBmb3IgYSBjb21tb24gdHlwby9jb25mdXNpb24sIHRyZWF0ICc9PScgYXMgJz0nXG4gKi9cbmZ1bmN0aW9uIHZhbGlkYXRlTnVtZXJpY2FsT3BlcmF0b3Iob3BlcmF0b3I6IHN0cmluZykge1xuICAvLyBDb3JyZWN0IGZvciBhIGNvbW1vbiB0eXBvLCB0cmVhdCAnPT0nIGFzICc9J1xuICBpZiAob3BlcmF0b3IgPT09ICc9PScpIHsgb3BlcmF0b3IgPSAnPSc7IH1cblxuICBpZiAoVkFMSURfT1BFUkFUT1JTLmluZGV4T2Yob3BlcmF0b3IpID09PSAtMSkge1xuICAgIHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBjb21wYXJpc29uIG9wZXJhdG9yICgnJHtvcGVyYXRvcn0nKSwgbXVzdCBiZSBvbmUgb2YgJHtWQUxJRF9PUEVSQVRPUlMuam9pbignLCAnKX1gKTtcbiAgfVxuXG4gIHJldHVybiBvcGVyYXRvcjtcbn1cblxuLyoqXG4gKiBSZW5kZXIgYSB0YWJsZSByZXN0cmljdGlvblxuICovXG5mdW5jdGlvbiByZW5kZXJSZXN0cmljdGlvbihjb2x1bW46IHN0cmluZywgcmVzdHJpY3Rpb246IENvbHVtblJlc3RyaWN0aW9uKSB7XG4gIGlmIChyZXN0cmljdGlvbi5udW1iZXJWYWx1ZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuIGAke2NvbHVtbn0gJHtyZXN0cmljdGlvbi5jb21wYXJpc29ufSAke3Jlc3RyaWN0aW9uLm51bWJlclZhbHVlfWA7XG4gIH0gZWxzZSBpZiAocmVzdHJpY3Rpb24uc3RyaW5nVmFsdWUpIHtcbiAgICByZXR1cm4gYCR7Y29sdW1ufSAke3Jlc3RyaWN0aW9uLmNvbXBhcmlzb259ICR7cXVvdGVUZXJtKHJlc3RyaWN0aW9uLnN0cmluZ1ZhbHVlKX1gO1xuICB9IGVsc2Uge1xuICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCByZXN0cmljdGlvbicpO1xuICB9XG59XG5cbmZ1bmN0aW9uIHN1bSh4czogbnVtYmVyW10pOiBudW1iZXIge1xuICByZXR1cm4geHMucmVkdWNlKChhLCBjKSA9PiBhICsgYywgMCk7XG59XG4iXX0=