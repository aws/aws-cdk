"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Condition = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
/**
 * A Condition for use in a Choice state branch
 */
class Condition {
    /**
     * Matches if variable is present
     */
    static isPresent(variable) {
        return new VariableComparison(variable, ComparisonOperator.IsPresent, true);
    }
    /**
     * Matches if variable is not present
     */
    static isNotPresent(variable) {
        return new VariableComparison(variable, ComparisonOperator.IsPresent, false);
    }
    /**
     * Matches if variable is a string
     */
    static isString(variable) {
        return new VariableComparison(variable, ComparisonOperator.IsString, true);
    }
    /**
     * Matches if variable is not a string
     */
    static isNotString(variable) {
        return new VariableComparison(variable, ComparisonOperator.IsString, false);
    }
    /**
     * Matches if variable is numeric
     */
    static isNumeric(variable) {
        return new VariableComparison(variable, ComparisonOperator.IsNumeric, true);
    }
    /**
     * Matches if variable is not numeric
     */
    static isNotNumeric(variable) {
        return new VariableComparison(variable, ComparisonOperator.IsNumeric, false);
    }
    /**
     * Matches if variable is boolean
     */
    static isBoolean(variable) {
        return new VariableComparison(variable, ComparisonOperator.IsBoolean, true);
    }
    /**
     * Matches if variable is not boolean
     */
    static isNotBoolean(variable) {
        return new VariableComparison(variable, ComparisonOperator.IsBoolean, false);
    }
    /**
     * Matches if variable is a timestamp
     */
    static isTimestamp(variable) {
        return new VariableComparison(variable, ComparisonOperator.IsTimestamp, true);
    }
    /**
     * Matches if variable is not a timestamp
     */
    static isNotTimestamp(variable) {
        return new VariableComparison(variable, ComparisonOperator.IsTimestamp, false);
    }
    /**
     * Matches if variable is not null
     */
    static isNotNull(variable) {
        return new VariableComparison(variable, ComparisonOperator.IsNull, false);
    }
    /**
     * Matches if variable is Null
     */
    static isNull(variable) {
        return new VariableComparison(variable, ComparisonOperator.IsNull, true);
    }
    /**
     * Matches if a boolean field has the given value
     */
    static booleanEquals(variable, value) {
        return new VariableComparison(variable, ComparisonOperator.BooleanEquals, value);
    }
    /**
     * Matches if a boolean field equals to a value at a given mapping path
     */
    static booleanEqualsJsonPath(variable, value) {
        return new VariableComparison(variable, ComparisonOperator.BooleanEqualsPath, value);
    }
    /**
     * Matches if a string field equals to a value at a given mapping path
     */
    static stringEqualsJsonPath(variable, value) {
        return new VariableComparison(variable, ComparisonOperator.StringEqualsPath, value);
    }
    /**
     * Matches if a string field has the given value
     */
    static stringEquals(variable, value) {
        return new VariableComparison(variable, ComparisonOperator.StringEquals, value);
    }
    /**
     * Matches if a string field sorts before a given value
     */
    static stringLessThan(variable, value) {
        return new VariableComparison(variable, ComparisonOperator.StringLessThan, value);
    }
    /**
     * Matches if a string field sorts before a given value at a particular mapping
     */
    static stringLessThanJsonPath(variable, value) {
        return new VariableComparison(variable, ComparisonOperator.StringLessThanPath, value);
    }
    /**
     * Matches if a string field sorts equal to or before a given value
     */
    static stringLessThanEquals(variable, value) {
        return new VariableComparison(variable, ComparisonOperator.StringLessThanEquals, value);
    }
    /**
     * Matches if a string field sorts equal to or before a given mapping
     */
    static stringLessThanEqualsJsonPath(variable, value) {
        return new VariableComparison(variable, ComparisonOperator.StringLessThanEqualsPath, value);
    }
    /**
     * Matches if a string field sorts after a given value
     */
    static stringGreaterThan(variable, value) {
        return new VariableComparison(variable, ComparisonOperator.StringGreaterThan, value);
    }
    /**
     * Matches if a string field sorts after a value at a given mapping path
     */
    static stringGreaterThanJsonPath(variable, value) {
        return new VariableComparison(variable, ComparisonOperator.StringGreaterThanPath, value);
    }
    /**
     * Matches if a string field sorts after or equal to value at a given mapping path
     */
    static stringGreaterThanEqualsJsonPath(variable, value) {
        return new VariableComparison(variable, ComparisonOperator.StringGreaterThanEqualsPath, value);
    }
    /**
     * Matches if a string field sorts after or equal to a given value
     */
    static stringGreaterThanEquals(variable, value) {
        return new VariableComparison(variable, ComparisonOperator.StringGreaterThanEquals, value);
    }
    /**
     * Matches if a numeric field has the given value
     */
    static numberEquals(variable, value) {
        return new VariableComparison(variable, ComparisonOperator.NumericEquals, value);
    }
    /**
     * Matches if a numeric field has the value in a given mapping path
     */
    static numberEqualsJsonPath(variable, value) {
        return new VariableComparison(variable, ComparisonOperator.NumericEqualsPath, value);
    }
    /**
     * Matches if a numeric field is less than the given value
     */
    static numberLessThan(variable, value) {
        return new VariableComparison(variable, ComparisonOperator.NumericLessThan, value);
    }
    /**
     * Matches if a numeric field is less than the value at the given mapping path
     */
    static numberLessThanJsonPath(variable, value) {
        return new VariableComparison(variable, ComparisonOperator.NumericLessThanPath, value);
    }
    /**
     * Matches if a numeric field is less than or equal to the given value
     */
    static numberLessThanEquals(variable, value) {
        return new VariableComparison(variable, ComparisonOperator.NumericLessThanEquals, value);
    }
    /**
     * Matches if a numeric field is less than or equal to the numeric value at given mapping path
     */
    static numberLessThanEqualsJsonPath(variable, value) {
        return new VariableComparison(variable, ComparisonOperator.NumericLessThanEqualsPath, value);
    }
    /**
     * Matches if a numeric field is greater than the given value
     */
    static numberGreaterThan(variable, value) {
        return new VariableComparison(variable, ComparisonOperator.NumericGreaterThan, value);
    }
    /**
     * Matches if a numeric field is greater than the value at a given mapping path
     */
    static numberGreaterThanJsonPath(variable, value) {
        return new VariableComparison(variable, ComparisonOperator.NumericGreaterThanPath, value);
    }
    /**
     * Matches if a numeric field is greater than or equal to the given value
     */
    static numberGreaterThanEquals(variable, value) {
        return new VariableComparison(variable, ComparisonOperator.NumericGreaterThanEquals, value);
    }
    /**
     * Matches if a numeric field is greater than or equal to the value at a given mapping path
     */
    static numberGreaterThanEqualsJsonPath(variable, value) {
        return new VariableComparison(variable, ComparisonOperator.NumericGreaterThanEqualsPath, value);
    }
    /**
     * Matches if a timestamp field is the same time as the given timestamp
     */
    static timestampEquals(variable, value) {
        return new VariableComparison(variable, ComparisonOperator.TimestampEquals, value);
    }
    /**
     * Matches if a timestamp field is the same time as the timestamp at a given mapping path
     */
    static timestampEqualsJsonPath(variable, value) {
        return new VariableComparison(variable, ComparisonOperator.TimestampEqualsPath, value);
    }
    /**
     * Matches if a timestamp field is before the given timestamp
     */
    static timestampLessThan(variable, value) {
        return new VariableComparison(variable, ComparisonOperator.TimestampLessThan, value);
    }
    /**
     * Matches if a timestamp field is before the timestamp at a given mapping path
     */
    static timestampLessThanJsonPath(variable, value) {
        return new VariableComparison(variable, ComparisonOperator.TimestampLessThanPath, value);
    }
    /**
     * Matches if a timestamp field is before or equal to the given timestamp
     */
    static timestampLessThanEquals(variable, value) {
        return new VariableComparison(variable, ComparisonOperator.TimestampLessThanEquals, value);
    }
    /**
     * Matches if a timestamp field is before or equal to the timestamp at a given mapping path
     */
    static timestampLessThanEqualsJsonPath(variable, value) {
        return new VariableComparison(variable, ComparisonOperator.TimestampLessThanEqualsPath, value);
    }
    /**
     * Matches if a timestamp field is after the given timestamp
     */
    static timestampGreaterThan(variable, value) {
        return new VariableComparison(variable, ComparisonOperator.TimestampGreaterThan, value);
    }
    /**
     * Matches if a timestamp field is after the timestamp at a given mapping path
     */
    static timestampGreaterThanJsonPath(variable, value) {
        return new VariableComparison(variable, ComparisonOperator.TimestampGreaterThanPath, value);
    }
    /**
     * Matches if a timestamp field is after or equal to the given timestamp
     */
    static timestampGreaterThanEquals(variable, value) {
        return new VariableComparison(variable, ComparisonOperator.TimestampGreaterThanEquals, value);
    }
    /**
     * Matches if a timestamp field is after or equal to the timestamp at a given mapping path
     */
    static timestampGreaterThanEqualsJsonPath(variable, value) {
        return new VariableComparison(variable, ComparisonOperator.TimestampGreaterThanEqualsPath, value);
    }
    /**
     * Matches if a field matches a string pattern that can contain a wild card (*) e.g: log-*.txt or *LATEST*.
     * No other characters other than "*" have any special meaning - * can be escaped: \\*
     */
    static stringMatches(variable, value) {
        return new VariableComparison(variable, ComparisonOperator.StringMatches, value);
    }
    /**
     * Combine two or more conditions with a logical AND
     */
    static and(...conditions) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_stepfunctions_Condition(conditions);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.and);
            }
            throw error;
        }
        return new CompoundCondition(CompoundOperator.And, ...conditions);
    }
    /**
     * Combine two or more conditions with a logical OR
     */
    static or(...conditions) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_stepfunctions_Condition(conditions);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.or);
            }
            throw error;
        }
        return new CompoundCondition(CompoundOperator.Or, ...conditions);
    }
    /**
     * Negate a condition
     */
    static not(condition) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_stepfunctions_Condition(condition);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.not);
            }
            throw error;
        }
        return new NotCondition(condition);
    }
}
exports.Condition = Condition;
_a = JSII_RTTI_SYMBOL_1;
Condition[_a] = { fqn: "@aws-cdk/aws-stepfunctions.Condition", version: "0.0.0" };
/**
 * Comparison Operator types
 */
var ComparisonOperator;
(function (ComparisonOperator) {
    ComparisonOperator[ComparisonOperator["StringEquals"] = 0] = "StringEquals";
    ComparisonOperator[ComparisonOperator["StringEqualsPath"] = 1] = "StringEqualsPath";
    ComparisonOperator[ComparisonOperator["StringLessThan"] = 2] = "StringLessThan";
    ComparisonOperator[ComparisonOperator["StringLessThanPath"] = 3] = "StringLessThanPath";
    ComparisonOperator[ComparisonOperator["StringGreaterThan"] = 4] = "StringGreaterThan";
    ComparisonOperator[ComparisonOperator["StringGreaterThanPath"] = 5] = "StringGreaterThanPath";
    ComparisonOperator[ComparisonOperator["StringLessThanEquals"] = 6] = "StringLessThanEquals";
    ComparisonOperator[ComparisonOperator["StringLessThanEqualsPath"] = 7] = "StringLessThanEqualsPath";
    ComparisonOperator[ComparisonOperator["StringGreaterThanEquals"] = 8] = "StringGreaterThanEquals";
    ComparisonOperator[ComparisonOperator["StringGreaterThanEqualsPath"] = 9] = "StringGreaterThanEqualsPath";
    ComparisonOperator[ComparisonOperator["NumericEquals"] = 10] = "NumericEquals";
    ComparisonOperator[ComparisonOperator["NumericEqualsPath"] = 11] = "NumericEqualsPath";
    ComparisonOperator[ComparisonOperator["NumericLessThan"] = 12] = "NumericLessThan";
    ComparisonOperator[ComparisonOperator["NumericLessThanPath"] = 13] = "NumericLessThanPath";
    ComparisonOperator[ComparisonOperator["NumericGreaterThan"] = 14] = "NumericGreaterThan";
    ComparisonOperator[ComparisonOperator["NumericGreaterThanPath"] = 15] = "NumericGreaterThanPath";
    ComparisonOperator[ComparisonOperator["NumericLessThanEquals"] = 16] = "NumericLessThanEquals";
    ComparisonOperator[ComparisonOperator["NumericLessThanEqualsPath"] = 17] = "NumericLessThanEqualsPath";
    ComparisonOperator[ComparisonOperator["NumericGreaterThanEquals"] = 18] = "NumericGreaterThanEquals";
    ComparisonOperator[ComparisonOperator["NumericGreaterThanEqualsPath"] = 19] = "NumericGreaterThanEqualsPath";
    ComparisonOperator[ComparisonOperator["BooleanEquals"] = 20] = "BooleanEquals";
    ComparisonOperator[ComparisonOperator["BooleanEqualsPath"] = 21] = "BooleanEqualsPath";
    ComparisonOperator[ComparisonOperator["TimestampEquals"] = 22] = "TimestampEquals";
    ComparisonOperator[ComparisonOperator["TimestampEqualsPath"] = 23] = "TimestampEqualsPath";
    ComparisonOperator[ComparisonOperator["TimestampLessThan"] = 24] = "TimestampLessThan";
    ComparisonOperator[ComparisonOperator["TimestampLessThanPath"] = 25] = "TimestampLessThanPath";
    ComparisonOperator[ComparisonOperator["TimestampGreaterThan"] = 26] = "TimestampGreaterThan";
    ComparisonOperator[ComparisonOperator["TimestampGreaterThanPath"] = 27] = "TimestampGreaterThanPath";
    ComparisonOperator[ComparisonOperator["TimestampLessThanEquals"] = 28] = "TimestampLessThanEquals";
    ComparisonOperator[ComparisonOperator["TimestampLessThanEqualsPath"] = 29] = "TimestampLessThanEqualsPath";
    ComparisonOperator[ComparisonOperator["TimestampGreaterThanEquals"] = 30] = "TimestampGreaterThanEquals";
    ComparisonOperator[ComparisonOperator["TimestampGreaterThanEqualsPath"] = 31] = "TimestampGreaterThanEqualsPath";
    ComparisonOperator[ComparisonOperator["IsNull"] = 32] = "IsNull";
    ComparisonOperator[ComparisonOperator["IsBoolean"] = 33] = "IsBoolean";
    ComparisonOperator[ComparisonOperator["IsNumeric"] = 34] = "IsNumeric";
    ComparisonOperator[ComparisonOperator["IsString"] = 35] = "IsString";
    ComparisonOperator[ComparisonOperator["IsTimestamp"] = 36] = "IsTimestamp";
    ComparisonOperator[ComparisonOperator["IsPresent"] = 37] = "IsPresent";
    ComparisonOperator[ComparisonOperator["StringMatches"] = 38] = "StringMatches";
})(ComparisonOperator || (ComparisonOperator = {}));
/**
 * Compound Operator types
 */
var CompoundOperator;
(function (CompoundOperator) {
    CompoundOperator[CompoundOperator["And"] = 0] = "And";
    CompoundOperator[CompoundOperator["Or"] = 1] = "Or";
})(CompoundOperator || (CompoundOperator = {}));
/**
 * Scalar comparison
 */
class VariableComparison extends Condition {
    constructor(variable, comparisonOperator, value) {
        super();
        this.variable = variable;
        this.comparisonOperator = comparisonOperator;
        this.value = value;
        if (!/^\$|(\$[.[])/.test(variable)) {
            throw new Error(`Variable reference must be '$', start with '$.', or start with '$[', got '${variable}'`);
        }
    }
    renderCondition() {
        return {
            Variable: this.variable,
            [ComparisonOperator[this.comparisonOperator]]: this.value,
        };
    }
}
/**
 * Logical compound condition
 */
class CompoundCondition extends Condition {
    constructor(operator, ...conditions) {
        super();
        this.operator = operator;
        this.conditions = conditions;
        if (conditions.length === 0) {
            throw new Error('Must supply at least one inner condition for a logical combination');
        }
    }
    renderCondition() {
        return {
            [CompoundOperator[this.operator]]: this.conditions.map(c => c.renderCondition()),
        };
    }
}
/**
 * Logical unary condition
 */
class NotCondition extends Condition {
    constructor(comparisonOperation) {
        super();
        this.comparisonOperation = comparisonOperation;
    }
    renderCondition() {
        return {
            Not: this.comparisonOperation.renderCondition(),
        };
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZGl0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY29uZGl0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBOztHQUVHO0FBQ0gsTUFBc0IsU0FBUztJQUU3Qjs7T0FFRztJQUNJLE1BQU0sQ0FBQyxTQUFTLENBQUMsUUFBZ0I7UUFDdEMsT0FBTyxJQUFJLGtCQUFrQixDQUFDLFFBQVEsRUFBRSxrQkFBa0IsQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLENBQUM7S0FDN0U7SUFFRDs7T0FFRztJQUNJLE1BQU0sQ0FBQyxZQUFZLENBQUMsUUFBZ0I7UUFDekMsT0FBTyxJQUFJLGtCQUFrQixDQUFDLFFBQVEsRUFBRSxrQkFBa0IsQ0FBQyxTQUFTLEVBQUUsS0FBSyxDQUFDLENBQUM7S0FDOUU7SUFFRDs7T0FFRztJQUNJLE1BQU0sQ0FBQyxRQUFRLENBQUMsUUFBZ0I7UUFDckMsT0FBTyxJQUFJLGtCQUFrQixDQUFDLFFBQVEsRUFBRSxrQkFBa0IsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLENBQUM7S0FDNUU7SUFFRDs7T0FFRztJQUNJLE1BQU0sQ0FBQyxXQUFXLENBQUMsUUFBZ0I7UUFDeEMsT0FBTyxJQUFJLGtCQUFrQixDQUFDLFFBQVEsRUFBRSxrQkFBa0IsQ0FBQyxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUM7S0FDN0U7SUFFRDs7T0FFRztJQUNJLE1BQU0sQ0FBQyxTQUFTLENBQUMsUUFBZ0I7UUFDdEMsT0FBTyxJQUFJLGtCQUFrQixDQUFDLFFBQVEsRUFBRSxrQkFBa0IsQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLENBQUM7S0FDN0U7SUFFRDs7T0FFRztJQUNJLE1BQU0sQ0FBQyxZQUFZLENBQUMsUUFBZ0I7UUFDekMsT0FBTyxJQUFJLGtCQUFrQixDQUFDLFFBQVEsRUFBRSxrQkFBa0IsQ0FBQyxTQUFTLEVBQUUsS0FBSyxDQUFDLENBQUM7S0FDOUU7SUFFRDs7T0FFRztJQUNJLE1BQU0sQ0FBQyxT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QUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsZUFBZSxFQUFFLENBQUM7U0FDakYsQ0FBQztLQUNIO0NBQ0Y7QUFFRDs7R0FFRztBQUNILE1BQU0sWUFBYSxTQUFRLFNBQVM7SUFDbEMsWUFBNkIsbUJBQThCO1FBQ3pELEtBQUssRUFBRSxDQUFDO1FBRG1CLHdCQUFtQixHQUFuQixtQkFBbUIsQ0FBVztLQUUxRDtJQUVNLGVBQWU7UUFDcEIsT0FBTztZQUNMLEdBQUcsRUFBRSxJQUFJLENBQUMsbUJBQW1CLENBQUMsZUFBZSxFQUFFO1NBQ2hELENBQUM7S0FDSDtDQUNGIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBBIENvbmRpdGlvbiBmb3IgdXNlIGluIGEgQ2hvaWNlIHN0YXRlIGJyYW5jaFxuICovXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgQ29uZGl0aW9uIHtcblxuICAvKipcbiAgICogTWF0Y2hlcyBpZiB2YXJpYWJsZSBpcyBwcmVzZW50XG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGlzUHJlc2VudCh2YXJpYWJsZTogc3RyaW5nKTogQ29uZGl0aW9uIHtcbiAgICByZXR1cm4gbmV3IFZhcmlhYmxlQ29tcGFyaXNvbih2YXJpYWJsZSwgQ29tcGFyaXNvbk9wZXJhdG9yLklzUHJlc2VudCwgdHJ1ZSk7XG4gIH1cblxuICAvKipcbiAgICogTWF0Y2hlcyBpZiB2YXJpYWJsZSBpcyBub3QgcHJlc2VudFxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBpc05vdFByZXNlbnQodmFyaWFibGU6IHN0cmluZyk6IENvbmRpdGlvbiB7XG4gICAgcmV0dXJuIG5ldyBWYXJpYWJsZUNvbXBhcmlzb24odmFyaWFibGUsIENvbXBhcmlzb25PcGVyYXRvci5Jc1ByZXNlbnQsIGZhbHNlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBNYXRjaGVzIGlmIHZhcmlhYmxlIGlzIGEgc3RyaW5nXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGlzU3RyaW5nKHZhcmlhYmxlOiBzdHJpbmcpOiBDb25kaXRpb24ge1xuICAgIHJldHVybiBuZXcgVmFyaWFibGVDb21wYXJpc29uKHZhcmlhYmxlLCBDb21wYXJpc29uT3BlcmF0b3IuSXNTdHJpbmcsIHRydWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIE1hdGNoZXMgaWYgdmFyaWFibGUgaXMgbm90IGEgc3RyaW5nXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGlzTm90U3RyaW5nKHZhcmlhYmxlOiBzdHJpbmcpOiBDb25kaXRpb24ge1xuICAgIHJldHVybiBuZXcgVmFyaWFibGVDb21wYXJpc29uKHZhcmlhYmxlLCBDb21wYXJpc29uT3BlcmF0b3IuSXNTdHJpbmcsIGZhbHNlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBNYXRjaGVzIGlmIHZhcmlhYmxlIGlzIG51bWVyaWNcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgaXNOdW1lcmljKHZhcmlhYmxlOiBzdHJpbmcpOiBDb25kaXRpb24ge1xuICAgIHJldHVybiBuZXcgVmFyaWFibGVDb21wYXJpc29uKHZhcmlhYmxlLCBDb21wYXJpc29uT3BlcmF0b3IuSXNOdW1lcmljLCB0cnVlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBNYXRjaGVzIGlmIHZhcmlhYmxlIGlzIG5vdCBudW1lcmljXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGlzTm90TnVtZXJpYyh2YXJpYWJsZTogc3RyaW5nKTogQ29uZGl0aW9uIHtcbiAgICByZXR1cm4gbmV3IFZhcmlhYmxlQ29tcGFyaXNvbih2YXJpYWJsZSwgQ29tcGFyaXNvbk9wZXJhdG9yLklzTnVtZXJpYywgZmFsc2UpO1xuICB9XG5cbiAgLyoqXG4gICAqIE1hdGNoZXMgaWYgdmFyaWFibGUgaXMgYm9vbGVhblxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBpc0Jvb2xlYW4odmFyaWFibGU6IHN0cmluZyk6IENvbmRpdGlvbiB7XG4gICAgcmV0dXJuIG5ldyBWYXJpYWJsZUNvbXBhcmlzb24odmFyaWFibGUsIENvbXBhcmlzb25PcGVyYXRvci5Jc0Jvb2xlYW4sIHRydWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIE1hdGNoZXMgaWYgdmFyaWFibGUgaXMgbm90IGJvb2xlYW5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgaXNOb3RCb29sZWFuKHZhcmlhYmxlOiBzdHJpbmcpOiBDb25kaXRpb24ge1xuICAgIHJldHVybiBuZXcgVmFyaWFibGVDb21wYXJpc29uKHZhcmlhYmxlLCBDb21wYXJpc29uT3BlcmF0b3IuSXNCb29sZWFuLCBmYWxzZSk7XG4gIH1cblxuICAvKipcbiAgICogTWF0Y2hlcyBpZiB2YXJpYWJsZSBpcyBhIHRpbWVzdGFtcFxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBpc1RpbWVzdGFtcCh2YXJpYWJsZTogc3RyaW5nKTogQ29uZGl0aW9uIHtcbiAgICByZXR1cm4gbmV3IFZhcmlhYmxlQ29tcGFyaXNvbih2YXJpYWJsZSwgQ29tcGFyaXNvbk9wZXJhdG9yLklzVGltZXN0YW1wLCB0cnVlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBNYXRjaGVzIGlmIHZhcmlhYmxlIGlzIG5vdCBhIHRpbWVzdGFtcFxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBpc05vdFRpbWVzdGFtcCh2YXJpYWJsZTogc3RyaW5nKTogQ29uZGl0aW9uIHtcbiAgICByZXR1cm4gbmV3IFZhcmlhYmxlQ29tcGFyaXNvbih2YXJpYWJsZSwgQ29tcGFyaXNvbk9wZXJhdG9yLklzVGltZXN0YW1wLCBmYWxzZSk7XG4gIH1cblxuICAvKipcbiAgICogTWF0Y2hlcyBpZiB2YXJpYWJsZSBpcyBub3QgbnVsbFxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBpc05vdE51bGwodmFyaWFibGU6IHN0cmluZyk6IENvbmRpdGlvbiB7XG4gICAgcmV0dXJuIG5ldyBWYXJpYWJsZUNvbXBhcmlzb24odmFyaWFibGUsIENvbXBhcmlzb25PcGVyYXRvci5Jc051bGwsIGZhbHNlKTtcbiAgfVxuICAvKipcbiAgICogTWF0Y2hlcyBpZiB2YXJpYWJsZSBpcyBOdWxsXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGlzTnVsbCh2YXJpYWJsZTogc3RyaW5nKTogQ29uZGl0aW9uIHtcbiAgICByZXR1cm4gbmV3IFZhcmlhYmxlQ29tcGFyaXNvbih2YXJpYWJsZSwgQ29tcGFyaXNvbk9wZXJhdG9yLklzTnVsbCwgdHJ1ZSk7XG4gIH1cbiAgLyoqXG4gICAqIE1hdGNoZXMgaWYgYSBib29sZWFuIGZpZWxkIGhhcyB0aGUgZ2l2ZW4gdmFsdWVcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgYm9vbGVhbkVxdWFscyh2YXJpYWJsZTogc3RyaW5nLCB2YWx1ZTogYm9vbGVhbik6IENvbmRpdGlvbiB7XG4gICAgcmV0dXJuIG5ldyBWYXJpYWJsZUNvbXBhcmlzb24odmFyaWFibGUsIENvbXBhcmlzb25PcGVyYXRvci5Cb29sZWFuRXF1YWxzLCB2YWx1ZSk7XG4gIH1cblxuICAvKipcbiAgICogTWF0Y2hlcyBpZiBhIGJvb2xlYW4gZmllbGQgZXF1YWxzIHRvIGEgdmFsdWUgYXQgYSBnaXZlbiBtYXBwaW5nIHBhdGhcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgYm9vbGVhbkVxdWFsc0pzb25QYXRoKHZhcmlhYmxlOiBzdHJpbmcsIHZhbHVlOiBzdHJpbmcpOiBDb25kaXRpb24ge1xuICAgIHJldHVybiBuZXcgVmFyaWFibGVDb21wYXJpc29uKHZhcmlhYmxlLCBDb21wYXJpc29uT3BlcmF0b3IuQm9vbGVhbkVxdWFsc1BhdGgsIHZhbHVlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBNYXRjaGVzIGlmIGEgc3RyaW5nIGZpZWxkIGVxdWFscyB0byBhIHZhbHVlIGF0IGEgZ2l2ZW4gbWFwcGluZyBwYXRoXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHN0cmluZ0VxdWFsc0pzb25QYXRoKHZhcmlhYmxlOiBzdHJpbmcsIHZhbHVlOiBzdHJpbmcpOiBDb25kaXRpb24ge1xuICAgIHJldHVybiBuZXcgVmFyaWFibGVDb21wYXJpc29uKHZhcmlhYmxlLCBDb21wYXJpc29uT3BlcmF0b3IuU3RyaW5nRXF1YWxzUGF0aCwgdmFsdWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIE1hdGNoZXMgaWYgYSBzdHJpbmcgZmllbGQgaGFzIHRoZSBnaXZlbiB2YWx1ZVxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBzdHJpbmdFcXVhbHModmFyaWFibGU6IHN0cmluZywgdmFsdWU6IHN0cmluZyk6IENvbmRpdGlvbiB7XG4gICAgcmV0dXJuIG5ldyBWYXJpYWJsZUNvbXBhcmlzb24odmFyaWFibGUsIENvbXBhcmlzb25PcGVyYXRvci5TdHJpbmdFcXVhbHMsIHZhbHVlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBNYXRjaGVzIGlmIGEgc3RyaW5nIGZpZWxkIHNvcnRzIGJlZm9yZSBhIGdpdmVuIHZhbHVlXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHN0cmluZ0xlc3NUaGFuKHZhcmlhYmxlOiBzdHJpbmcsIHZhbHVlOiBzdHJpbmcpOiBDb25kaXRpb24ge1xuICAgIHJldHVybiBuZXcgVmFyaWFibGVDb21wYXJpc29uKHZhcmlhYmxlLCBDb21wYXJpc29uT3BlcmF0b3IuU3RyaW5nTGVzc1RoYW4sIHZhbHVlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBNYXRjaGVzIGlmIGEgc3RyaW5nIGZpZWxkIHNvcnRzIGJlZm9yZSBhIGdpdmVuIHZhbHVlIGF0IGEgcGFydGljdWxhciBtYXBwaW5nXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHN0cmluZ0xlc3NUaGFuSnNvblBhdGgodmFyaWFibGU6IHN0cmluZywgdmFsdWU6IHN0cmluZyk6IENvbmRpdGlvbiB7XG4gICAgcmV0dXJuIG5ldyBWYXJpYWJsZUNvbXBhcmlzb24odmFyaWFibGUsIENvbXBhcmlzb25PcGVyYXRvci5TdHJpbmdMZXNzVGhhblBhdGgsIHZhbHVlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBNYXRjaGVzIGlmIGEgc3RyaW5nIGZpZWxkIHNvcnRzIGVxdWFsIHRvIG9yIGJlZm9yZSBhIGdpdmVuIHZhbHVlXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHN0cmluZ0xlc3NUaGFuRXF1YWxzKHZhcmlhYmxlOiBzdHJpbmcsIHZhbHVlOiBzdHJpbmcpOiBDb25kaXRpb24ge1xuICAgIHJldHVybiBuZXcgVmFyaWFibGVDb21wYXJpc29uKHZhcmlhYmxlLCBDb21wYXJpc29uT3BlcmF0b3IuU3RyaW5nTGVzc1RoYW5FcXVhbHMsIHZhbHVlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBNYXRjaGVzIGlmIGEgc3RyaW5nIGZpZWxkIHNvcnRzIGVxdWFsIHRvIG9yIGJlZm9yZSBhIGdpdmVuIG1hcHBpbmdcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgc3RyaW5nTGVzc1RoYW5FcXVhbHNKc29uUGF0aCh2YXJpYWJsZTogc3RyaW5nLCB2YWx1ZTogc3RyaW5nKTogQ29uZGl0aW9uIHtcbiAgICByZXR1cm4gbmV3IFZhcmlhYmxlQ29tcGFyaXNvbih2YXJpYWJsZSwgQ29tcGFyaXNvbk9wZXJhdG9yLlN0cmluZ0xlc3NUaGFuRXF1YWxzUGF0aCwgdmFsdWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIE1hdGNoZXMgaWYgYSBzdHJpbmcgZmllbGQgc29ydHMgYWZ0ZXIgYSBnaXZlbiB2YWx1ZVxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBzdHJpbmdHcmVhdGVyVGhhbih2YXJpYWJsZTogc3RyaW5nLCB2YWx1ZTogc3RyaW5nKTogQ29uZGl0aW9uIHtcbiAgICByZXR1cm4gbmV3IFZhcmlhYmxlQ29tcGFyaXNvbih2YXJpYWJsZSwgQ29tcGFyaXNvbk9wZXJhdG9yLlN0cmluZ0dyZWF0ZXJUaGFuLCB2YWx1ZSk7XG4gIH1cblxuICAvKipcbiAgICogTWF0Y2hlcyBpZiBhIHN0cmluZyBmaWVsZCBzb3J0cyBhZnRlciBhIHZhbHVlIGF0IGEgZ2l2ZW4gbWFwcGluZyBwYXRoXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHN0cmluZ0dyZWF0ZXJUaGFuSnNvblBhdGgodmFyaWFibGU6IHN0cmluZywgdmFsdWU6IHN0cmluZyk6IENvbmRpdGlvbiB7XG4gICAgcmV0dXJuIG5ldyBWYXJpYWJsZUNvbXBhcmlzb24odmFyaWFibGUsIENvbXBhcmlzb25PcGVyYXRvci5TdHJpbmdHcmVhdGVyVGhhblBhdGgsIHZhbHVlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBNYXRjaGVzIGlmIGEgc3RyaW5nIGZpZWxkIHNvcnRzIGFmdGVyIG9yIGVxdWFsIHRvIHZhbHVlIGF0IGEgZ2l2ZW4gbWFwcGluZyBwYXRoXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHN0cmluZ0dyZWF0ZXJUaGFuRXF1YWxzSnNvblBhdGgodmFyaWFibGU6IHN0cmluZywgdmFsdWU6IHN0cmluZyk6IENvbmRpdGlvbiB7XG4gICAgcmV0dXJuIG5ldyBWYXJpYWJsZUNvbXBhcmlzb24odmFyaWFibGUsIENvbXBhcmlzb25PcGVyYXRvci5TdHJpbmdHcmVhdGVyVGhhbkVxdWFsc1BhdGgsIHZhbHVlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBNYXRjaGVzIGlmIGEgc3RyaW5nIGZpZWxkIHNvcnRzIGFmdGVyIG9yIGVxdWFsIHRvIGEgZ2l2ZW4gdmFsdWVcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgc3RyaW5nR3JlYXRlclRoYW5FcXVhbHModmFyaWFibGU6IHN0cmluZywgdmFsdWU6IHN0cmluZyk6IENvbmRpdGlvbiB7XG4gICAgcmV0dXJuIG5ldyBWYXJpYWJsZUNvbXBhcmlzb24odmFyaWFibGUsIENvbXBhcmlzb25PcGVyYXRvci5TdHJpbmdHcmVhdGVyVGhhbkVxdWFscywgdmFsdWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIE1hdGNoZXMgaWYgYSBudW1lcmljIGZpZWxkIGhhcyB0aGUgZ2l2ZW4gdmFsdWVcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgbnVtYmVyRXF1YWxzKHZhcmlhYmxlOiBzdHJpbmcsIHZhbHVlOiBudW1iZXIpOiBDb25kaXRpb24ge1xuICAgIHJldHVybiBuZXcgVmFyaWFibGVDb21wYXJpc29uKHZhcmlhYmxlLCBDb21wYXJpc29uT3BlcmF0b3IuTnVtZXJpY0VxdWFscywgdmFsdWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIE1hdGNoZXMgaWYgYSBudW1lcmljIGZpZWxkIGhhcyB0aGUgdmFsdWUgaW4gYSBnaXZlbiBtYXBwaW5nIHBhdGhcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgbnVtYmVyRXF1YWxzSnNvblBhdGgodmFyaWFibGU6IHN0cmluZywgdmFsdWU6IHN0cmluZyk6IENvbmRpdGlvbiB7XG4gICAgcmV0dXJuIG5ldyBWYXJpYWJsZUNvbXBhcmlzb24odmFyaWFibGUsIENvbXBhcmlzb25PcGVyYXRvci5OdW1lcmljRXF1YWxzUGF0aCwgdmFsdWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIE1hdGNoZXMgaWYgYSBudW1lcmljIGZpZWxkIGlzIGxlc3MgdGhhbiB0aGUgZ2l2ZW4gdmFsdWVcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgbnVtYmVyTGVzc1RoYW4odmFyaWFibGU6IHN0cmluZywgdmFsdWU6IG51bWJlcik6IENvbmRpdGlvbiB7XG4gICAgcmV0dXJuIG5ldyBWYXJpYWJsZUNvbXBhcmlzb24odmFyaWFibGUsIENvbXBhcmlzb25PcGVyYXRvci5OdW1lcmljTGVzc1RoYW4sIHZhbHVlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBNYXRjaGVzIGlmIGEgbnVtZXJpYyBmaWVsZCBpcyBsZXNzIHRoYW4gdGhlIHZhbHVlIGF0IHRoZSBnaXZlbiBtYXBwaW5nIHBhdGhcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgbnVtYmVyTGVzc1RoYW5Kc29uUGF0aCh2YXJpYWJsZTogc3RyaW5nLCB2YWx1ZTogc3RyaW5nKTogQ29uZGl0aW9uIHtcbiAgICByZXR1cm4gbmV3IFZhcmlhYmxlQ29tcGFyaXNvbih2YXJpYWJsZSwgQ29tcGFyaXNvbk9wZXJhdG9yLk51bWVyaWNMZXNzVGhhblBhdGgsIHZhbHVlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBNYXRjaGVzIGlmIGEgbnVtZXJpYyBmaWVsZCBpcyBsZXNzIHRoYW4gb3IgZXF1YWwgdG8gdGhlIGdpdmVuIHZhbHVlXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIG51bWJlckxlc3NUaGFuRXF1YWxzKHZhcmlhYmxlOiBzdHJpbmcsIHZhbHVlOiBudW1iZXIpOiBDb25kaXRpb24ge1xuICAgIHJldHVybiBuZXcgVmFyaWFibGVDb21wYXJpc29uKHZhcmlhYmxlLCBDb21wYXJpc29uT3BlcmF0b3IuTnVtZXJpY0xlc3NUaGFuRXF1YWxzLCB2YWx1ZSk7XG4gIH1cblxuICAvKipcbiAgICogTWF0Y2hlcyBpZiBhIG51bWVyaWMgZmllbGQgaXMgbGVzcyB0aGFuIG9yIGVxdWFsIHRvIHRoZSBudW1lcmljIHZhbHVlIGF0IGdpdmVuIG1hcHBpbmcgcGF0aFxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBudW1iZXJMZXNzVGhhbkVxdWFsc0pzb25QYXRoKHZhcmlhYmxlOiBzdHJpbmcsIHZhbHVlOiBzdHJpbmcpOiBDb25kaXRpb24ge1xuICAgIHJldHVybiBuZXcgVmFyaWFibGVDb21wYXJpc29uKHZhcmlhYmxlLCBDb21wYXJpc29uT3BlcmF0b3IuTnVtZXJpY0xlc3NUaGFuRXF1YWxzUGF0aCwgdmFsdWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIE1hdGNoZXMgaWYgYSBudW1lcmljIGZpZWxkIGlzIGdyZWF0ZXIgdGhhbiB0aGUgZ2l2ZW4gdmFsdWVcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgbnVtYmVyR3JlYXRlclRoYW4odmFyaWFibGU6IHN0cmluZywgdmFsdWU6IG51bWJlcik6IENvbmRpdGlvbiB7XG4gICAgcmV0dXJuIG5ldyBWYXJpYWJsZUNvbXBhcmlzb24odmFyaWFibGUsIENvbXBhcmlzb25PcGVyYXRvci5OdW1lcmljR3JlYXRlclRoYW4sIHZhbHVlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBNYXRjaGVzIGlmIGEgbnVtZXJpYyBmaWVsZCBpcyBncmVhdGVyIHRoYW4gdGhlIHZhbHVlIGF0IGEgZ2l2ZW4gbWFwcGluZyBwYXRoXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIG51bWJlckdyZWF0ZXJUaGFuSnNvblBhdGgodmFyaWFibGU6IHN0cmluZywgdmFsdWU6IHN0cmluZyk6IENvbmRpdGlvbiB7XG4gICAgcmV0dXJuIG5ldyBWYXJpYWJsZUNvbXBhcmlzb24odmFyaWFibGUsIENvbXBhcmlzb25PcGVyYXRvci5OdW1lcmljR3JlYXRlclRoYW5QYXRoLCB2YWx1ZSk7XG4gIH1cblxuICAvKipcbiAgICogTWF0Y2hlcyBpZiBhIG51bWVyaWMgZmllbGQgaXMgZ3JlYXRlciB0aGFuIG9yIGVxdWFsIHRvIHRoZSBnaXZlbiB2YWx1ZVxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBudW1iZXJHcmVhdGVyVGhhbkVxdWFscyh2YXJpYWJsZTogc3RyaW5nLCB2YWx1ZTogbnVtYmVyKTogQ29uZGl0aW9uIHtcbiAgICByZXR1cm4gbmV3IFZhcmlhYmxlQ29tcGFyaXNvbih2YXJpYWJsZSwgQ29tcGFyaXNvbk9wZXJhdG9yLk51bWVyaWNHcmVhdGVyVGhhbkVxdWFscywgdmFsdWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIE1hdGNoZXMgaWYgYSBudW1lcmljIGZpZWxkIGlzIGdyZWF0ZXIgdGhhbiBvciBlcXVhbCB0byB0aGUgdmFsdWUgYXQgYSBnaXZlbiBtYXBwaW5nIHBhdGhcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgbnVtYmVyR3JlYXRlclRoYW5FcXVhbHNKc29uUGF0aCh2YXJpYWJsZTogc3RyaW5nLCB2YWx1ZTogc3RyaW5nKTogQ29uZGl0aW9uIHtcbiAgICByZXR1cm4gbmV3IFZhcmlhYmxlQ29tcGFyaXNvbih2YXJpYWJsZSwgQ29tcGFyaXNvbk9wZXJhdG9yLk51bWVyaWNHcmVhdGVyVGhhbkVxdWFsc1BhdGgsIHZhbHVlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBNYXRjaGVzIGlmIGEgdGltZXN0YW1wIGZpZWxkIGlzIHRoZSBzYW1lIHRpbWUgYXMgdGhlIGdpdmVuIHRpbWVzdGFtcFxuICAgKi9cbiAgcHVibGljIHN0YXRpYyB0aW1lc3RhbXBFcXVhbHModmFyaWFibGU6IHN0cmluZywgdmFsdWU6IHN0cmluZyk6IENvbmRpdGlvbiB7XG4gICAgcmV0dXJuIG5ldyBWYXJpYWJsZUNvbXBhcmlzb24odmFyaWFibGUsIENvbXBhcmlzb25PcGVyYXRvci5UaW1lc3RhbXBFcXVhbHMsIHZhbHVlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBNYXRjaGVzIGlmIGEgdGltZXN0YW1wIGZpZWxkIGlzIHRoZSBzYW1lIHRpbWUgYXMgdGhlIHRpbWVzdGFtcCBhdCBhIGdpdmVuIG1hcHBpbmcgcGF0aFxuICAgKi9cbiAgcHVibGljIHN0YXRpYyB0aW1lc3RhbXBFcXVhbHNKc29uUGF0aCh2YXJpYWJsZTogc3RyaW5nLCB2YWx1ZTogc3RyaW5nKTogQ29uZGl0aW9uIHtcbiAgICByZXR1cm4gbmV3IFZhcmlhYmxlQ29tcGFyaXNvbih2YXJpYWJsZSwgQ29tcGFyaXNvbk9wZXJhdG9yLlRpbWVzdGFtcEVxdWFsc1BhdGgsIHZhbHVlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBNYXRjaGVzIGlmIGEgdGltZXN0YW1wIGZpZWxkIGlzIGJlZm9yZSB0aGUgZ2l2ZW4gdGltZXN0YW1wXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHRpbWVzdGFtcExlc3NUaGFuKHZhcmlhYmxlOiBzdHJpbmcsIHZhbHVlOiBzdHJpbmcpOiBDb25kaXRpb24ge1xuICAgIHJldHVybiBuZXcgVmFyaWFibGVDb21wYXJpc29uKHZhcmlhYmxlLCBDb21wYXJpc29uT3BlcmF0b3IuVGltZXN0YW1wTGVzc1RoYW4sIHZhbHVlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBNYXRjaGVzIGlmIGEgdGltZXN0YW1wIGZpZWxkIGlzIGJlZm9yZSB0aGUgdGltZXN0YW1wIGF0IGEgZ2l2ZW4gbWFwcGluZyBwYXRoXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHRpbWVzdGFtcExlc3NUaGFuSnNvblBhdGgodmFyaWFibGU6IHN0cmluZywgdmFsdWU6IHN0cmluZyk6IENvbmRpdGlvbiB7XG4gICAgcmV0dXJuIG5ldyBWYXJpYWJsZUNvbXBhcmlzb24odmFyaWFibGUsIENvbXBhcmlzb25PcGVyYXRvci5UaW1lc3RhbXBMZXNzVGhhblBhdGgsIHZhbHVlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBNYXRjaGVzIGlmIGEgdGltZXN0YW1wIGZpZWxkIGlzIGJlZm9yZSBvciBlcXVhbCB0byB0aGUgZ2l2ZW4gdGltZXN0YW1wXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHRpbWVzdGFtcExlc3NUaGFuRXF1YWxzKHZhcmlhYmxlOiBzdHJpbmcsIHZhbHVlOiBzdHJpbmcpOiBDb25kaXRpb24ge1xuICAgIHJldHVybiBuZXcgVmFyaWFibGVDb21wYXJpc29uKHZhcmlhYmxlLCBDb21wYXJpc29uT3BlcmF0b3IuVGltZXN0YW1wTGVzc1RoYW5FcXVhbHMsIHZhbHVlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBNYXRjaGVzIGlmIGEgdGltZXN0YW1wIGZpZWxkIGlzIGJlZm9yZSBvciBlcXVhbCB0byB0aGUgdGltZXN0YW1wIGF0IGEgZ2l2ZW4gbWFwcGluZyBwYXRoXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHRpbWVzdGFtcExlc3NUaGFuRXF1YWxzSnNvblBhdGgodmFyaWFibGU6IHN0cmluZywgdmFsdWU6IHN0cmluZyk6IENvbmRpdGlvbiB7XG4gICAgcmV0dXJuIG5ldyBWYXJpYWJsZUNvbXBhcmlzb24odmFyaWFibGUsIENvbXBhcmlzb25PcGVyYXRvci5UaW1lc3RhbXBMZXNzVGhhbkVxdWFsc1BhdGgsIHZhbHVlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBNYXRjaGVzIGlmIGEgdGltZXN0YW1wIGZpZWxkIGlzIGFmdGVyIHRoZSBnaXZlbiB0aW1lc3RhbXBcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgdGltZXN0YW1wR3JlYXRlclRoYW4odmFyaWFibGU6IHN0cmluZywgdmFsdWU6IHN0cmluZyk6IENvbmRpdGlvbiB7XG4gICAgcmV0dXJuIG5ldyBWYXJpYWJsZUNvbXBhcmlzb24odmFyaWFibGUsIENvbXBhcmlzb25PcGVyYXRvci5UaW1lc3RhbXBHcmVhdGVyVGhhbiwgdmFsdWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIE1hdGNoZXMgaWYgYSB0aW1lc3RhbXAgZmllbGQgaXMgYWZ0ZXIgdGhlIHRpbWVzdGFtcCBhdCBhIGdpdmVuIG1hcHBpbmcgcGF0aFxuICAgKi9cbiAgcHVibGljIHN0YXRpYyB0aW1lc3RhbXBHcmVhdGVyVGhhbkpzb25QYXRoKHZhcmlhYmxlOiBzdHJpbmcsIHZhbHVlOiBzdHJpbmcpOiBDb25kaXRpb24ge1xuICAgIHJldHVybiBuZXcgVmFyaWFibGVDb21wYXJpc29uKHZhcmlhYmxlLCBDb21wYXJpc29uT3BlcmF0b3IuVGltZXN0YW1wR3JlYXRlclRoYW5QYXRoLCB2YWx1ZSk7XG4gIH1cblxuICAvKipcbiAgICogTWF0Y2hlcyBpZiBhIHRpbWVzdGFtcCBmaWVsZCBpcyBhZnRlciBvciBlcXVhbCB0byB0aGUgZ2l2ZW4gdGltZXN0YW1wXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHRpbWVzdGFtcEdyZWF0ZXJUaGFuRXF1YWxzKHZhcmlhYmxlOiBzdHJpbmcsIHZhbHVlOiBzdHJpbmcpOiBDb25kaXRpb24ge1xuICAgIHJldHVybiBuZXcgVmFyaWFibGVDb21wYXJpc29uKHZhcmlhYmxlLCBDb21wYXJpc29uT3BlcmF0b3IuVGltZXN0YW1wR3JlYXRlclRoYW5FcXVhbHMsIHZhbHVlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBNYXRjaGVzIGlmIGEgdGltZXN0YW1wIGZpZWxkIGlzIGFmdGVyIG9yIGVxdWFsIHRvIHRoZSB0aW1lc3RhbXAgYXQgYSBnaXZlbiBtYXBwaW5nIHBhdGhcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgdGltZXN0YW1wR3JlYXRlclRoYW5FcXVhbHNKc29uUGF0aCh2YXJpYWJsZTogc3RyaW5nLCB2YWx1ZTogc3RyaW5nKTogQ29uZGl0aW9uIHtcbiAgICByZXR1cm4gbmV3IFZhcmlhYmxlQ29tcGFyaXNvbih2YXJpYWJsZSwgQ29tcGFyaXNvbk9wZXJhdG9yLlRpbWVzdGFtcEdyZWF0ZXJUaGFuRXF1YWxzUGF0aCwgdmFsdWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIE1hdGNoZXMgaWYgYSBmaWVsZCBtYXRjaGVzIGEgc3RyaW5nIHBhdHRlcm4gdGhhdCBjYW4gY29udGFpbiBhIHdpbGQgY2FyZCAoKikgZS5nOiBsb2ctKi50eHQgb3IgKkxBVEVTVCouXG4gICAqIE5vIG90aGVyIGNoYXJhY3RlcnMgb3RoZXIgdGhhbiBcIipcIiBoYXZlIGFueSBzcGVjaWFsIG1lYW5pbmcgLSAqIGNhbiBiZSBlc2NhcGVkOiBcXFxcKlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBzdHJpbmdNYXRjaGVzKHZhcmlhYmxlOiBzdHJpbmcsIHZhbHVlOiBzdHJpbmcpOiBDb25kaXRpb24ge1xuICAgIHJldHVybiBuZXcgVmFyaWFibGVDb21wYXJpc29uKHZhcmlhYmxlLCBDb21wYXJpc29uT3BlcmF0b3IuU3RyaW5nTWF0Y2hlcywgdmFsdWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIENvbWJpbmUgdHdvIG9yIG1vcmUgY29uZGl0aW9ucyB3aXRoIGEgbG9naWNhbCBBTkRcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgYW5kKC4uLmNvbmRpdGlvbnM6IENvbmRpdGlvbltdKTogQ29uZGl0aW9uIHtcbiAgICByZXR1cm4gbmV3IENvbXBvdW5kQ29uZGl0aW9uKENvbXBvdW5kT3BlcmF0b3IuQW5kLCAuLi5jb25kaXRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb21iaW5lIHR3byBvciBtb3JlIGNvbmRpdGlvbnMgd2l0aCBhIGxvZ2ljYWwgT1JcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgb3IoLi4uY29uZGl0aW9uczogQ29uZGl0aW9uW10pOiBDb25kaXRpb24ge1xuICAgIHJldHVybiBuZXcgQ29tcG91bmRDb25kaXRpb24oQ29tcG91bmRPcGVyYXRvci5PciwgLi4uY29uZGl0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogTmVnYXRlIGEgY29uZGl0aW9uXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIG5vdChjb25kaXRpb246IENvbmRpdGlvbik6IENvbmRpdGlvbiB7XG4gICAgcmV0dXJuIG5ldyBOb3RDb25kaXRpb24oY29uZGl0aW9uKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW5kZXIgQW1hem9uIFN0YXRlcyBMYW5ndWFnZSBKU09OIGZvciB0aGUgY29uZGl0aW9uXG4gICAqL1xuICBwdWJsaWMgYWJzdHJhY3QgcmVuZGVyQ29uZGl0aW9uKCk6IGFueTtcbn1cblxuLyoqXG4gKiBDb21wYXJpc29uIE9wZXJhdG9yIHR5cGVzXG4gKi9cbmVudW0gQ29tcGFyaXNvbk9wZXJhdG9yIHtcbiAgU3RyaW5nRXF1YWxzLFxuICBTdHJpbmdFcXVhbHNQYXRoLFxuICBTdHJpbmdMZXNzVGhhbixcbiAgU3RyaW5nTGVzc1RoYW5QYXRoLFxuICBTdHJpbmdHcmVhdGVyVGhhbixcbiAgU3RyaW5nR3JlYXRlclRoYW5QYXRoLFxuICBTdHJpbmdMZXNzVGhhbkVxdWFscyxcbiAgU3RyaW5nTGVzc1RoYW5FcXVhbHNQYXRoLFxuICBTdHJpbmdHcmVhdGVyVGhhbkVxdWFscyxcbiAgU3RyaW5nR3JlYXRlclRoYW5FcXVhbHNQYXRoLFxuICBOdW1lcmljRXF1YWxzLFxuICBOdW1lcmljRXF1YWxzUGF0aCxcbiAgTnVtZXJpY0xlc3NUaGFuLFxuICBOdW1lcmljTGVzc1RoYW5QYXRoLFxuICBOdW1lcmljR3JlYXRlclRoYW4sXG4gIE51bWVyaWNHcmVhdGVyVGhhblBhdGgsXG4gIE51bWVyaWNMZXNzVGhhbkVxdWFscyxcbiAgTnVtZXJpY0xlc3NUaGFuRXF1YWxzUGF0aCxcbiAgTnVtZXJpY0dyZWF0ZXJUaGFuRXF1YWxzLFxuICBOdW1lcmljR3JlYXRlclRoYW5FcXVhbHNQYXRoLFxuICBCb29sZWFuRXF1YWxzLFxuICBCb29sZWFuRXF1YWxzUGF0aCxcbiAgVGltZXN0YW1wRXF1YWxzLFxuICBUaW1lc3RhbXBFcXVhbHNQYXRoLFxuICBUaW1lc3RhbXBMZXNzVGhhbixcbiAgVGltZXN0YW1wTGVzc1RoYW5QYXRoLFxuICBUaW1lc3RhbXBHcmVhdGVyVGhhbixcbiAgVGltZXN0YW1wR3JlYXRlclRoYW5QYXRoLFxuICBUaW1lc3RhbXBMZXNzVGhhbkVxdWFscyxcbiAgVGltZXN0YW1wTGVzc1RoYW5FcXVhbHNQYXRoLFxuICBUaW1lc3RhbXBHcmVhdGVyVGhhbkVxdWFscyxcbiAgVGltZXN0YW1wR3JlYXRlclRoYW5FcXVhbHNQYXRoLFxuICBJc051bGwsXG4gIElzQm9vbGVhbixcbiAgSXNOdW1lcmljLFxuICBJc1N0cmluZyxcbiAgSXNUaW1lc3RhbXAsXG4gIElzUHJlc2VudCxcbiAgU3RyaW5nTWF0Y2hlcyxcblxufVxuXG4vKipcbiAqIENvbXBvdW5kIE9wZXJhdG9yIHR5cGVzXG4gKi9cbmVudW0gQ29tcG91bmRPcGVyYXRvciB7XG4gIEFuZCxcbiAgT3IsXG59XG5cbi8qKlxuICogU2NhbGFyIGNvbXBhcmlzb25cbiAqL1xuY2xhc3MgVmFyaWFibGVDb21wYXJpc29uIGV4dGVuZHMgQ29uZGl0aW9uIHtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSB2YXJpYWJsZTogc3RyaW5nLCBwcml2YXRlIHJlYWRvbmx5IGNvbXBhcmlzb25PcGVyYXRvcjogQ29tcGFyaXNvbk9wZXJhdG9yLCBwcml2YXRlIHJlYWRvbmx5IHZhbHVlOiBhbnkpIHtcbiAgICBzdXBlcigpO1xuICAgIGlmICghL15cXCR8KFxcJFsuW10pLy50ZXN0KHZhcmlhYmxlKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBWYXJpYWJsZSByZWZlcmVuY2UgbXVzdCBiZSAnJCcsIHN0YXJ0IHdpdGggJyQuJywgb3Igc3RhcnQgd2l0aCAnJFsnLCBnb3QgJyR7dmFyaWFibGV9J2ApO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyByZW5kZXJDb25kaXRpb24oKTogYW55IHtcbiAgICByZXR1cm4ge1xuICAgICAgVmFyaWFibGU6IHRoaXMudmFyaWFibGUsXG4gICAgICBbQ29tcGFyaXNvbk9wZXJhdG9yW3RoaXMuY29tcGFyaXNvbk9wZXJhdG9yXV06IHRoaXMudmFsdWUsXG4gICAgfTtcbiAgfVxufVxuXG4vKipcbiAqIExvZ2ljYWwgY29tcG91bmQgY29uZGl0aW9uXG4gKi9cbmNsYXNzIENvbXBvdW5kQ29uZGl0aW9uIGV4dGVuZHMgQ29uZGl0aW9uIHtcbiAgcHJpdmF0ZSByZWFkb25seSBjb25kaXRpb25zOiBDb25kaXRpb25bXTtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IG9wZXJhdG9yOiBDb21wb3VuZE9wZXJhdG9yLCAuLi5jb25kaXRpb25zOiBDb25kaXRpb25bXSkge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5jb25kaXRpb25zID0gY29uZGl0aW9ucztcbiAgICBpZiAoY29uZGl0aW9ucy5sZW5ndGggPT09IDApIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignTXVzdCBzdXBwbHkgYXQgbGVhc3Qgb25lIGlubmVyIGNvbmRpdGlvbiBmb3IgYSBsb2dpY2FsIGNvbWJpbmF0aW9uJyk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIHJlbmRlckNvbmRpdGlvbigpOiBhbnkge1xuICAgIHJldHVybiB7XG4gICAgICBbQ29tcG91bmRPcGVyYXRvclt0aGlzLm9wZXJhdG9yXV06IHRoaXMuY29uZGl0aW9ucy5tYXAoYyA9PiBjLnJlbmRlckNvbmRpdGlvbigpKSxcbiAgICB9O1xuICB9XG59XG5cbi8qKlxuICogTG9naWNhbCB1bmFyeSBjb25kaXRpb25cbiAqL1xuY2xhc3MgTm90Q29uZGl0aW9uIGV4dGVuZHMgQ29uZGl0aW9uIHtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSBjb21wYXJpc29uT3BlcmF0aW9uOiBDb25kaXRpb24pIHtcbiAgICBzdXBlcigpO1xuICB9XG5cbiAgcHVibGljIHJlbmRlckNvbmRpdGlvbigpOiBhbnkge1xuICAgIHJldHVybiB7XG4gICAgICBOb3Q6IHRoaXMuY29tcGFyaXNvbk9wZXJhdGlvbi5yZW5kZXJDb25kaXRpb24oKSxcbiAgICB9O1xuICB9XG59XG4iXX0=