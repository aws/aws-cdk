export enum ComparisonOperator {
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
    And,
    Or,
    Not
}

export abstract class Condition {
    public static stringEquals(variable: string, value: string): Condition {
        return new StringEqualsComparisonOperation({ variable, value });
    }

    public abstract renderCondition(): any;
}

export interface BaseVariableComparisonOperationProps {
    comparisonOperator: ComparisonOperator,
    value: any,
    variable: string
}

export interface VariableComparisonOperationProps {
    /**
     * The value to be compared against.
     */
    value: any,

    /**
     * A Path to the value to be compared.
     */
    variable: string
}

export abstract class VariableComparisonOperation extends Condition {
    constructor(private readonly props: BaseVariableComparisonOperationProps) {
        super();
    }

    public renderCondition(): any {
        return {
            Variable: this.props.variable,
            [ComparisonOperator[this.props.comparisonOperator]]: this.props.value
        };
    }
}

class StringEqualsComparisonOperation extends VariableComparisonOperation {
    constructor(props: VariableComparisonOperationProps) {
        super({ ...props, ...{ comparisonOperator: ComparisonOperator.StringEquals } });
    }
}

export class StringLessThanComparisonOperation extends VariableComparisonOperation {
    constructor(props: VariableComparisonOperationProps) {
        super({ ...props, ...{ comparisonOperator: ComparisonOperator.StringLessThan } });
    }
}

export class StringGreaterThanComparisonOperation extends VariableComparisonOperation {
    constructor(props: VariableComparisonOperationProps) {
        super({ ...props, ...{ comparisonOperator: ComparisonOperator.StringGreaterThan } });
    }
}

export class StringLessThanEqualsComparisonOperation extends VariableComparisonOperation {
    constructor(props: VariableComparisonOperationProps) {
        super({ ...props, ...{ comparisonOperator: ComparisonOperator.StringLessThanEquals } });
    }
}

export class StringGreaterThanEqualsComparisonOperation extends VariableComparisonOperation {
    constructor(props: VariableComparisonOperationProps) {
        super({ ...props, ...{ comparisonOperator: ComparisonOperator.StringGreaterThanEquals } });
    }
}

export class NumericEqualsComparisonOperation extends VariableComparisonOperation {
    constructor(props: VariableComparisonOperationProps) {
        super({ ...props, ...{ comparisonOperator: ComparisonOperator.NumericEquals } });
    }
}

export class NumericLessThanComparisonOperation extends VariableComparisonOperation {
    constructor(props: VariableComparisonOperationProps) {
        super({ ...props, ...{ comparisonOperator: ComparisonOperator.NumericLessThan } });
    }
}

export class NumericGreaterThanComparisonOperation extends VariableComparisonOperation {
    constructor(props: VariableComparisonOperationProps) {
        super({ ...props, ...{ comparisonOperator: ComparisonOperator.NumericGreaterThan } });
    }
}

export class NumericLessThanEqualsComparisonOperation extends VariableComparisonOperation {
    constructor(props: VariableComparisonOperationProps) {
        super({ ...props, ...{ comparisonOperator: ComparisonOperator.NumericLessThanEquals } });
    }
}

export class NumericGreaterThanEqualsComparisonOperation extends VariableComparisonOperation {
    constructor(props: VariableComparisonOperationProps) {
        super({ ...props, ...{ comparisonOperator: ComparisonOperator.NumericGreaterThanEquals } });
    }
}

export class BooleanEqualsComparisonOperation extends VariableComparisonOperation {
    constructor(props: VariableComparisonOperationProps) {
        super({ ...props, ...{ comparisonOperator: ComparisonOperator.BooleanEquals } });
    }
}

export class TimestampEqualsComparisonOperation extends VariableComparisonOperation {
    constructor(props: VariableComparisonOperationProps) {
        super({ ...props, ...{ comparisonOperator: ComparisonOperator.TimestampEquals } });
    }
}

export class TimestampLessThanComparisonOperation extends VariableComparisonOperation {
    constructor(props: VariableComparisonOperationProps) {
        super({ ...props, ...{ comparisonOperator: ComparisonOperator.TimestampLessThan } });
    }
}

export class TimestampGreaterThanComparisonOperation extends VariableComparisonOperation {
    constructor(props: VariableComparisonOperationProps) {
        super({ ...props, ...{ comparisonOperator: ComparisonOperator.TimestampGreaterThan } });
    }
}

export class TimestampLessThanEqualsComparisonOperation extends VariableComparisonOperation {
    constructor(props: VariableComparisonOperationProps) {
        super({ ...props, ...{ comparisonOperator: ComparisonOperator.TimestampLessThanEquals } });
    }
}

export class TimestampGreaterThanEqualsComparisonOperation extends VariableComparisonOperation {
    constructor(props: VariableComparisonOperationProps) {
        super({ ...props, ...{ comparisonOperator: ComparisonOperator.TimestampGreaterThanEquals } });
    }
}

export interface ArrayComparisonOperationProps {
    comparisonOperator: ComparisonOperator,
    comparisonOperations: Condition[]
}

export abstract class ArrayComparisonOperation extends Condition {
    constructor(private readonly props: ArrayComparisonOperationProps) {
        super();
        if (props.comparisonOperations.length === 0) {
            throw new Error('\'comparisonOperations\' is empty. Must be non-empty array of ChoiceRules');
        }
    }

    public renderCondition(): any {
        return {
            [ComparisonOperator[this.props.comparisonOperator]]: this.props.comparisonOperations
        };
    }
}

export class AndComparisonOperation extends ArrayComparisonOperation {
    constructor(...comparisonOperations: Condition[]) {
        super({ comparisonOperator: ComparisonOperator.And, comparisonOperations });
    }
}

export class OrComparisonOperation extends ArrayComparisonOperation {
    constructor(...comparisonOperations: Condition[]) {
        super({ comparisonOperator: ComparisonOperator.Or, comparisonOperations });
    }
}

export class NotComparisonOperation extends Condition {
    constructor(private readonly comparisonOperation: Condition) {
        super();
    }

    public renderCondition(): any {
        return {
            [ComparisonOperator[ComparisonOperator.Not]]: this.comparisonOperation
        };
    }
}