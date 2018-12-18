import { Metric } from "./metric";
// import { Alarm, AlarmProps } from "./alarm";

// https://docs.aws.amazon.com/AmazonCloudWatch/latest/APIReference/API_PutMetricAlarm.html

/*
S represents a scalar number, such as 2, -5, or 50.25.

TS is a time series (a series of values for a single CloudWatch metric over time).
For example, the CPUUtilization metric for instance i-1234567890abcdef0 over the last three days.

TS[] is an array of time series, such as the time series for multiple metrics.
*/

export class ExpressionContext {
  private readonly metrics: { [key: string]: Metric } = {};
  private counter = 1;

  public metric(metric: Metric): string {
    const id = 'm' + this.counter.toString();
    this.counter += 1;
    this.metrics[id] = metric;
    return id;
  }

  // public toAlarmProps(): AlarmProps {
  //   return {
  //     metric
  //   }
  // }
}

export abstract class Expression {
  public abstract render(context: ExpressionContext): string;

  public plus(expression: Expression | number): Plus {
    return new Plus(this, expression);
  }
  public minus(expression: Expression | number): Minus {
    return new Minus(this, expression);
  }
  public multiply(expression: Expression | number): Multiply {
    return new Multiply(this, expression);
  }
  public divide(expression: Expression | number): Divide {
    return new Divide(this, expression);
  }
  public pow(expression: Expression | number): Exponent {
    return new Exponent(this, expression);
  }
}

export class Scalar extends Expression {
  constructor(private readonly value: number) {
    super();
  }
  public render(_context: ExpressionContext): string {
    return this.value.toString();
  }
}
export class Literal extends Expression {
  constructor(private readonly value: string) {
    super();
  }
  public render(_context: ExpressionContext): string {
    return `"${this.value}"`;
  }
}

export class TimeSeries extends Expression {
  constructor(private readonly id: string) {
    super();
  }

  public render(_context: ExpressionContext): string {
    return this.id;
  }
}

export class TimeSeriesArray extends Expression {
  constructor(private readonly array: Expression[]) {
    super();
  }

  public render(context: ExpressionContext): string {
    return `[${this.array.map(a => a.render(context)).join(',')}]`;
  }
}

export abstract class Operator extends Expression {
  protected abstract readonly operator: string;
  constructor(private readonly lhs: Expression | number, private readonly rhs: Expression | number) {
    super();
  }

  public render(context: ExpressionContext): string {
    const lhs = typeof this.lhs === 'number' ? new Scalar(this.lhs) : this.lhs;
    const rhs = typeof this.rhs === 'number' ? new Scalar(this.rhs) : this.rhs;
    return `${lhs.render(context)} ${this.operator} ${rhs.render(context)}`;
  }
}

export class Plus extends Operator {
  protected readonly operator: string = '+';
}
export class Minus extends Operator {
  protected readonly operator: string = '+';
}
export class Multiply extends Operator {
  protected readonly operator: string = '*';
}
export class Divide extends Operator {
  protected readonly operator: string = '/';
}
export class Exponent extends Operator {
  protected readonly operator: string = '^';
}

export abstract class Function extends Expression {
  protected abstract readonly name: string;

  constructor(private readonly expressions: Expression[]) {
    super();
  }

  public render(context: ExpressionContext): string {
    return `${this.name}(${this.expressions.map(ex => ex.render(context)).join(',')})`;
  }
}
export abstract class Function1 extends Function {
  constructor(...expression: Expression[]) {
    if (expression.length > 1) {
      super([new TimeSeriesArray(expression)]);
    } else {
      super(expression);
    }
  }
}
export abstract class Function2 extends Function {
  constructor(expression1: Expression, expression2: Expression) {
    super([expression1, expression2]);
  }
}

export class Abs extends Function1 {
  protected readonly name: string = 'ABS';
}
export class Average extends Function1 {
  protected readonly name: string = 'AVG';
}
export class Ceil extends Function1 {
  protected readonly name: string = 'CEIL';
}
export class Fill extends Function2 {
  protected readonly name: string = 'CEIL';
}
export class Floor extends Function1 {
  protected readonly name: string = 'FLOOR';
}
export class Max extends Function1 {
  protected readonly name: string = 'MAX';
}
export class MetricCount extends Function1 {
  protected readonly name: string = 'METRIC_COUNT';
}
export class Metrics extends Function {
  protected readonly name: string = 'METRICS';

  constructor(filter?: string) {
    super(filter !== undefined ? [new Literal(filter)] : []);
  }
}
export class Min extends Function1 {
  protected readonly name: string = 'MIN';
}
export class Period extends Function1 {
  protected readonly name: string = 'PERIOD';
}
export class Rate extends Function1 {
  protected readonly name: string = 'RATE';
}
export class StdDev extends Function1 {
  protected readonly name: string = 'STDDEV';
}
export class Sum extends Function1 {
  protected readonly name: string = 'SUM';
}
