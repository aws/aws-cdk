/**
 * A Condition for use in a Choice state branch
 */
export abstract class Condition {
    /**
     * Matches if a boolean field has the given value
     */
    public static booleanEquals(variable: string, value: boolean): Condition {
        return new VariableComparison(variable, ComparisonOperator.BooleanEquals, value);
    }

    /**
     * Matches if a string field has the given value
     */
    public static stringEquals(variable: string, value: string): Condition {
        return new VariableComparison(variable, ComparisonOperator.StringEquals, value);
    }

    /**
     * Matches if a string field sorts before a given value
     */
    public static stringLessThan(variable: string, value: string): Condition {
        return new VariableComparison(variable, ComparisonOperator.StringLessThan, value);
    }

    /**
     * Matches if a string field sorts equal to or before a given value
     */
    public static stringLessThanEquals(variable: string, value: string): Condition {
        return new VariableComparison(variable, ComparisonOperator.StringLessThanEquals, value);
    }

    /**
     * Matches if a string field sorts after a given value
     */
    public static stringGreaterThan(variable: string, value: string): Condition {
        return new VariableComparison(variable, ComparisonOperator.StringGreaterThan, value);
    }

    /**
     * Matches if a string field sorts after or equal to a given value
     */
    public static stringGreaterThanEquals(variable: string, value: string): Condition {
        return new VariableComparison(variable, ComparisonOperator.StringGreaterThanEquals, value);
    }

    /**
     * Matches if a numeric field has the given value
     */
    public static numberEquals(variable: string, value: number): Condition {
        return new VariableComparison(variable, ComparisonOperator.NumericEquals, value);
    }

    /**
     * Matches if a numeric field is less than the given value
     */
    public static numberLessThan(variable: string, value: number): Condition {
        return new VariableComparison(variable, ComparisonOperator.NumericLessThan, value);
    }

    /**
     * Matches if a numeric field is less than or equal to the given value
     */
    public static numberLessThanEquals(variable: string, value: number): Condition {
        return new VariableComparison(variable, ComparisonOperator.NumericLessThanEquals, value);
    }

    /**
     * Matches if a numeric field is greater than the given value
     */
    public static numberGreaterThan(variable: string, value: number): Condition {
        return new VariableComparison(variable, ComparisonOperator.NumericGreaterThan, value);
    }

    /**
     * Matches if a numeric field is greater than or equal to the given value
     */
    public static numberGreaterThanEquals(variable: string, value: number): Condition {
        return new VariableComparison(variable, ComparisonOperator.NumericGreaterThanEquals, value);
    }

    /**
     * Matches if a timestamp field is the same time as the given timestamp
     */
    public static timestampEquals(variable: string, value: string): Condition {
        return new VariableComparison(variable, ComparisonOperator.TimestampEquals, value);
    }

    /**
     * Matches if a timestamp field is before the given timestamp
     */
    public static timestampLessThan(variable: string, value: string): Condition {
        return new VariableComparison(variable, ComparisonOperator.TimestampLessThan, value);
    }

    /**
     * Matches if a timestamp field is before or equal to the given timestamp
     */
    public static timestampLessThanEquals(variable: string, value: string): Condition {
        return new VariableComparison(variable, ComparisonOperator.TimestampLessThanEquals, value);
    }

    /**
     * Matches if a timestamp field is after the given timestamp
     */
    public static timestampGreaterThan(variable: string, value: string): Condition {
        return new VariableComparison(variable, ComparisonOperator.TimestampGreaterThan, value);
    }

    /**
     * Matches if a timestamp field is after or equal to the given timestamp
     */
    public static timestampGreaterThanEquals(variable: string, value: string): Condition {
        return new VariableComparison(variable, ComparisonOperator.TimestampGreaterThanEquals, value);
    }

    /**
     * Combine two or more conditions with a logical AND
     */
    public static and(...conditions: Condition[]): Condition {
        return new CompoundCondition(CompoundOperator.And, ...conditions);
    }

    /**
     * Combine two or more conditions with a logical OR
     */
    public static or(...conditions: Condition[]): Condition {
        return new CompoundCondition(CompoundOperator.Or, ...conditions);
    }

    /**
     * Negate a condition
     */
    public static not(condition: Condition): Condition {
        return new NotCondition(condition);
    }

    /**
     * Render Amazon States Language JSON for the condition
     */
    public abstract renderCondition(): any;
}

/**
 * Comparison Operator types
 */
enum ComparisonOperator {
    StringEquals,
    StringLessThan,
    StringGreaterThan,
    StringLessThanEquals,
    StringGreaterThanEquals,
    NumericEquals,
    NumericLessThan,
    NumericGreaterThan,
    NumericLessThanEquals,
    NumericGreaterThanEquals,
    BooleanEquals,
    TimestampEquals,
    TimestampLessThan,
    TimestampGreaterThan,
    TimestampLessThanEquals,
    TimestampGreaterThanEquals,
}

/**
 * Compound Operator types
 */
enum CompoundOperator {
    And,
    Or,
}

/**
 * Scalar comparison
 */
class VariableComparison extends Condition {
    constructor(private readonly variable: string, private readonly comparisonOperator: ComparisonOperator, private readonly value: any) {
        super();
        if (!variable.startsWith('$.') && !variable.startsWith('$[')) {
            throw new Error(`Variable reference must start with '$.' or '$[', got '${variable}'`);
        }
    }

    public renderCondition(): any {
        return {
            Variable: this.variable,
            [ComparisonOperator[this.comparisonOperator]]: this.value
        };
    }
}

/**
 * Logical compound condition
 */
class CompoundCondition extends Condition {
    private readonly conditions: Condition[];

    constructor(private readonly operator: CompoundOperator, ...conditions: Condition[]) {
        super();
        this.conditions = conditions;
        if (conditions.length === 0) {
            throw new Error('Must supply at least one inner condition for a logical combination');
        }
    }

    public renderCondition(): any {
        return {
            [CompoundOperator[this.operator]]: this.conditions.map(c => c.renderCondition())
        };
    }
}

/**
 * Logical unary condition
 */
class NotCondition extends Condition {
    constructor(private readonly comparisonOperation: Condition) {
        super();
    }

    public renderCondition(): any {
        return {
            Not: this.comparisonOperation.renderCondition()
        };
    }
}
