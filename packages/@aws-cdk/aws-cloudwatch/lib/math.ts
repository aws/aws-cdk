import { Metric } from "./metric";

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
    const metricArr: any[] = [];
    Object.keys(this.metrics).forEach(id => {
      const metric = this.metrics[id];
      metricArr.push({
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
    return metricArr;
  }
}

export function compileExpression(ex: IExpression) {
  const context = new ExpressionContext();
  const expression = ex.render(context);
  const metricArr = context.toMetrics();
  metricArr.push({
    id: context.nextId(),
    expression,
    returnData: true
  });
  return metricArr;
}

export enum DataType {
  Scalar = 'S',
  TimeSeries = 'TS',
  TimeSeriesArray = 'TS[]'
}

export interface IExpression {
  render(context: ExpressionContext): string;
}

export interface IScalar extends IExpression {
  readonly type: DataType.Scalar;
}

export interface ITimeSeries extends IExpression {
  readonly type: DataType.TimeSeries;

  plus(operand: number | IScalar | ITimeSeries): ITimeSeries;
  plus(operand: ITimeSeriesArray): ITimeSeriesArray;

  minus(operand: number | IScalar | ITimeSeries): ITimeSeries;
  minus(operand: ITimeSeriesArray): ITimeSeriesArray;

  multiply(operand: number | IScalar | ITimeSeries): ITimeSeries;
  multiply(operand: ITimeSeriesArray): ITimeSeriesArray;

  divide(operand: number | IScalar | ITimeSeries): ITimeSeries;
  divide(operand: ITimeSeriesArray): ITimeSeriesArray;

  pow(operand: number | IScalar | ITimeSeries): ITimeSeries;
  pow(operand: ITimeSeriesArray): ITimeSeriesArray;
}

export interface ITimeSeriesArray extends IExpression {
  readonly type: DataType.TimeSeriesArray;

  plus(operand: number | IScalar | ITimeSeriesArray | ITimeSeriesArray): ITimeSeriesArray;
  minus(operand: number | IScalar | ITimeSeriesArray | ITimeSeriesArray): ITimeSeriesArray;
  multiply(operand: number | IScalar | ITimeSeriesArray | ITimeSeriesArray): ITimeSeriesArray;
  divide(operand: number | IScalar | ITimeSeriesArray | ITimeSeriesArray): ITimeSeriesArray;
  pow(operand: number | IScalar | ITimeSeriesArray | ITimeSeriesArray): ITimeSeriesArray;
}

export function abs(ts: ITimeSeries): IScalar;
export function abs(...ts: ITimeSeries[]): ITimeSeries;
export function abs(ts: ITimeSeries[] | ITimeSeriesArray): ITimeSeriesArray;
export function abs(...ts: any[]): any {
  return new Function('ABS', ...ts);
}

export function avg(ts: ITimeSeries): IScalar;
export function avg(...ts: ITimeSeries[]): ITimeSeries;
export function avg(ts: ITimeSeries[] | ITimeSeriesArray): ITimeSeries;
export function avg(...ts: any[]): any {
  return new Function('AVG', ...ts);
}

export function ceil(ts: ITimeSeries): IScalar;
export function ceil(...ts: ITimeSeries[]): ITimeSeries;
export function ceil(ts: ITimeSeries[] | ITimeSeriesArray): ITimeSeriesArray;
export function ceil(...ts: any[]): any {
  return new Function('CEIL', ...ts);
}

export function fill(ts: ITimeSeries, value: ITimeSeries | IScalar | number): ITimeSeries;
export function fill(ts: ITimeSeries[] | ITimeSeriesArray, value: ITimeSeries | IScalar | number): ITimeSeriesArray;
export function fill(ts: any, value: any): any {
  return new Function('FILL', [ts, value]);
}

export function floor(ts: ITimeSeries): IScalar;
export function floor(...ts: ITimeSeries[]): ITimeSeries;
export function floor(ts: ITimeSeries[] | ITimeSeriesArray): ITimeSeriesArray;
export function floor(...ts: any[]): any {
  return new Function('FLOOR', ...ts);
}

export function max(ts: ITimeSeries): IScalar;
export function max(...ts: ITimeSeries[]): ITimeSeries;
export function max(ts: ITimeSeries[] | ITimeSeriesArray): ITimeSeries;
export function max(...ts: any[]): any {
  return new Function('MAX', ...ts);
}

export function metricCount(): IScalar {
  return new Function('METRIC_COUNT', []) as any;
}

export function metrics(filter?: string): ITimeSeriesArray {
  if (filter) {
    return new Function('METRICS', new StringLiteral(filter)) as any;
  }
  return new Function('METRICS') as any;
}

export function min(ts: ITimeSeries): IScalar;
export function min(...ts: ITimeSeries[]): ITimeSeries;
export function min(ts: ITimeSeries[] | ITimeSeriesArray): ITimeSeries;
export function min(...ts: any[]): any {
  return new Function('MIN', ...ts);
}

export function period(ts: ITimeSeries): IScalar {
  return new ScalarWrapper(new Function('PERIOD', ts));
}

export function rate(ts: ITimeSeries): IScalar;
export function rate(...ts: ITimeSeries[]): ITimeSeries;
export function rate(ts: ITimeSeries[] | ITimeSeriesArray): ITimeSeriesArray;
export function rate(...ts: any[]): any {
  return new Function('RATE', ...ts);
}

export function stddev(ts: ITimeSeries): IScalar;
export function stddev(...ts: ITimeSeries[]): ITimeSeries;
export function stddev(ts: ITimeSeries[] | ITimeSeriesArray): ITimeSeries;
export function stddev(...ts: any[]): any {
  return new Function('STDDEV', ...ts);
}

export function sum(ts: ITimeSeries): IScalar;
export function sum(...ts: ITimeSeries[]): ITimeSeries;
export function sum(ts: ITimeSeries[] | ITimeSeriesArray): ITimeSeries;
export function sum(...ts: any[]): any {
  return new Function('SUM', ...ts);
}

export abstract class AbstractExpression implements IExpression {
  public plus(operand: any): any {
    return new Operator('+', this, operand);
  }
  public minus(operand: any): any {
    return new Operator('-', this, operand);
  }
  public multiply(operand: any): any {
    return new Operator('*', this, operand);
  }
  public divide(operand: any): any {
    return new Operator('/', this, operand);
  }
  public pow(operand: any): any {
    return new Operator('^', this, operand);
  }

  public abstract render(context: ExpressionContext): string;
}

export abstract class AbstractTimeSeries extends AbstractExpression implements ITimeSeries {
  public readonly type = DataType.TimeSeries;

  public abstract render(context: ExpressionContext): string;
}

class Scalar extends AbstractExpression implements IScalar {
  public readonly type = DataType.Scalar;

  constructor(private readonly value: number) {
    super();
  }

  public render(_context: ExpressionContext): string {
    return this.value.toString();
  }
}

class ScalarWrapper extends AbstractExpression implements IScalar {
  public readonly type = DataType.Scalar;

  constructor(private readonly delegate: IExpression) {
    super();
  }

  public render(context: ExpressionContext): string {
    return this.delegate.render(context);
  }
}

class StringLiteral implements IExpression {
  constructor(private readonly value: string) {}

  public render(_context: ExpressionContext): string {
    return `"${this.value}"`;
  }
}

class TimeSeriesArrayRef extends AbstractExpression implements ITimeSeriesArray {
  public readonly type = DataType.TimeSeriesArray;

  constructor(private readonly array: ITimeSeries[]) {
    super();
  }

  public render(context: ExpressionContext): string {
    return `[${this.array.map(a => a.render(context)).join(',')}]`;
  }
}

class Operator extends AbstractExpression {
  constructor(private readonly operator: string, private readonly lhs: IExpression | number, private readonly rhs: IExpression | number) {
    super();
  }

  public render(context: ExpressionContext): string {
    const lhs = typeof this.lhs === 'number' ? new Scalar(this.lhs) : this.lhs;
    const rhs = typeof this.rhs === 'number' ? new Scalar(this.rhs) : this.rhs;
    return `${lhs.render(context)} ${this.operator} ${rhs.render(context)}`;
  }
}

class Function extends AbstractExpression {
  private readonly expressions: IExpression[];
  constructor(private readonly name: string, ...expressions: any[]) {
    super();
    if (expressions.length === 1) {
      if (Array.isArray(expressions[0])) {
        this.expressions = [new TimeSeriesArrayRef(expressions[0] as any)];
      } else {
        this.expressions = expressions;
      }
    } else {
      this.expressions = [new TimeSeriesArrayRef(expressions)];
    }
  }

  public render(context: ExpressionContext): string {
    return `${this.name}(${this.expressions.map(ex => ex.render(context)).join(',')})`;
  }
}
