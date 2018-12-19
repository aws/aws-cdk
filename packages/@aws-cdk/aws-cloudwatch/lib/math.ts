import { Metric } from "./metric";
// import { Alarm, AlarmProps } from "./alarm";

export interface IExpression {
  render(context: ExpressionContext): string;
}

export interface ITimeSeries extends IExpression {
  plus(operand: number | Scalar | ITimeSeries): ITimeSeries;
  plus(operand: ITimeSeriesArray): ITimeSeriesArray;
}

export abstract class AbstractTimeSeries implements ITimeSeries {
  public plus(operand: number | ITimeSeries | Scalar): ITimeSeries;
  public plus(operand: ITimeSeriesArray): ITimeSeriesArray;
  public plus(operand: any): any {
    return new Plus(this, operand);
  }

  public abstract render(context: ExpressionContext): string;
}

export interface ITimeSeriesArray extends IExpression {
  plus(operand: number | Scalar | ITimeSeriesArray | ITimeSeriesArray): ITimeSeriesArray;
}

export class ExpressionContext {
  private readonly metrics: { [key: string]: Metric } = {};
  private counter = 1;

  public nextId(): string {
    const id = 'm' + this.counter.toString();
    this.counter += 1;
    return id;
  }

  public metric(metric: Metric): string {
    const id = this.nextId();
    this.metrics[id] = metric;
    return id;
  }

  public toMetrics(): any {
    const metrics: any[] = [];
    Object.keys(this.metrics).forEach(id => {
      const metric = this.metrics[id];
      metrics.push({
        id,
        metric: {
          metricName: metric.metricName,
          namespace: metric.namespace,
          dimensions: metric.dimensionsAsList()
        },
        period: metric.periodSec,
        stat: metric.statistic,
        unit: metric.unit,
        returnData: false
      });
    });
    return metrics;
  }
}

export function compileExpression(ex: IExpression) {
  const context = new ExpressionContext();
  const expression = ex.render(context);
  const metrics = context.toMetrics();
  metrics.push({
    id: context.nextId(),
    expression,
    returnData: true
  });
  return metrics;
}

export class Scalar implements IExpression {
  constructor(private readonly value: number) {}

  public render(_context: ExpressionContext): string {
    return this.value.toString();
  }
}

export class Literal implements IExpression {
  constructor(private readonly value: string) {}

  public render(_context: ExpressionContext): string {
    return `"${this.value}"`;
  }
}

// export class TimeSeriesRef implements Expression, TimeSeries {
//   constructor(private readonly id: string) {}

//   public render(_context: ExpressionContext): string {
//     return this.id;
//   }

//   public plus(operand: number | TimeSeries | Scalar): TimeSeries;
//   public plus(operand: TimeSeriesArray): TimeSeriesArray;
//   public plus(operand: number | TimeSeries | Scalar | TimeSeriesArray): TimeSeries | TimeSeriesArray {
//     throw new Error("Method not implemented.");
//   }
// }

export class TimeSeriesArrayRef implements IExpression, ITimeSeriesArray {
  constructor(private readonly array: ITimeSeries[]) {}

  public render(context: ExpressionContext): string {
    return `[${this.array.map(a => a.render(context)).join(',')}]`;
  }

  public plus(_operand: number | Scalar | ITimeSeriesArray): ITimeSeriesArray {
    throw new Error("Method not implemented.");
  }
}

export abstract class Operator implements IExpression {
  protected abstract readonly operator: string;
  constructor(private readonly lhs: IExpression | number, private readonly rhs: IExpression | number) {}

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
export abstract class Function implements IExpression {
  protected abstract readonly name: string;

  constructor(private readonly expressions: IExpression[]) {}

  public render(context: ExpressionContext): string {
    return `${this.name}(${this.expressions.map(ex => ex.render(context)).join(',')})`;
  }
}
export abstract class Function1 extends Function {
  constructor(...expression: ITimeSeries[]) {
    if (expression.length === 1) {
      if (Array.isArray(expression[0])) {
        super([new TimeSeriesArrayRef(expression[0] as any)]);
      } else {
        super(expression);
      }
    } else {
      super([new TimeSeriesArrayRef(expression)]);
    }
  }
}
export abstract class Function2 extends Function {
  constructor(expression1: IExpression, expression2: IExpression) {
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

export function sum(ts: ITimeSeries): Scalar;
export function sum(...ts: ITimeSeries[]): ITimeSeries;
export function sum(ts: ITimeSeries[] | ITimeSeriesArray): ITimeSeries;
export function sum(...ts: any[]): any {
  return new Sum(...ts);
}

class Sum extends Function1 {
  protected readonly name: string = 'SUM';

  public plus(a: any): any {
    return new Plus(this, a);
  }
}
