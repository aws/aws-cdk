export abstract class Condition {
    public static parse(_expression: string): Condition {
        throw new Error('Parsing not implemented yet!');
    }

    public static booleanEquals(variable: string, value: boolean): Condition {
        return new VariableComparison(variable, ComparisonOperator.BooleanEquals, value);
    }

    public static stringEquals(variable: string, value: string): Condition {
        return new VariableComparison(variable, ComparisonOperator.StringEquals, value);
    }

    public static stringLessThan(variable: string, value: string): Condition {
        return new VariableComparison(variable, ComparisonOperator.StringLessThan, value);
    }

    public static stringLessThanEquals(variable: string, value: string): Condition {
        return new VariableComparison(variable, ComparisonOperator.StringLessThanEquals, value);
    }

    public static stringGreaterThan(variable: string, value: string): Condition {
        return new VariableComparison(variable, ComparisonOperator.StringGreaterThan, value);
    }

    public static stringGreaterThanEquals(variable: string, value: string): Condition {
        return new VariableComparison(variable, ComparisonOperator.StringGreaterThanEquals, value);
    }

    public static numericEquals(variable: string, value: number): Condition {
        return new VariableComparison(variable, ComparisonOperator.NumericEquals, value);
    }

    public static numericLessThan(variable: string, value: number): Condition {
        return new VariableComparison(variable, ComparisonOperator.NumericLessThan, value);
    }

    public static numericLessThanEquals(variable: string, value: number): Condition {
        return new VariableComparison(variable, ComparisonOperator.NumericLessThanEquals, value);
    }

    public static numericGreaterThan(variable: string, value: number): Condition {
        return new VariableComparison(variable, ComparisonOperator.NumericGreaterThan, value);
    }

    public static numericGreaterThanEquals(variable: string, value: number): Condition {
        return new VariableComparison(variable, ComparisonOperator.NumericGreaterThanEquals, value);
    }

    public static timestampEquals(variable: string, value: string): Condition {
        return new VariableComparison(variable, ComparisonOperator.TimestampEquals, value);
    }

    public static timestampLessThan(variable: string, value: string): Condition {
        return new VariableComparison(variable, ComparisonOperator.TimestampLessThan, value);
    }

    public static timestampLessThanEquals(variable: string, value: string): Condition {
        return new VariableComparison(variable, ComparisonOperator.TimestampLessThanEquals, value);
    }

    public static timestampGreaterThan(variable: string, value: string): Condition {
        return new VariableComparison(variable, ComparisonOperator.TimestampGreaterThan, value);
    }

    public static timestampGreaterThanEquals(variable: string, value: string): Condition {
        return new VariableComparison(variable, ComparisonOperator.TimestampGreaterThanEquals, value);
    }

    public static and(...conditions: Condition[]): Condition {
        return new CompoundCondition(CompoundOperator.And, ...conditions);
    }

    public static or(...conditions: Condition[]): Condition {
        return new CompoundCondition(CompoundOperator.Or, ...conditions);
    }

    public static not(condition: Condition): Condition {
        return new NotCondition(condition);
    }

    public abstract renderCondition(): any;
}

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

enum CompoundOperator {
    And,
    Or,
}

class VariableComparison extends Condition {
    constructor(private readonly variable: string, private readonly comparisonOperator: ComparisonOperator, private readonly value: any) {
        super();
    }

    public renderCondition(): any {
        return {
            Variable: this.variable,
            [ComparisonOperator[this.comparisonOperator]]: this.value
        };
    }
}

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

class NotCondition extends Condition {
    constructor(private readonly comparisonOperation: Condition) {
        super();
    }

    public renderCondition(): any {
        return {
            Not: this.comparisonOperation
        };
    }
}