import { IAlarm } from './alarm-base';
import { IMetric } from './metric-types';
import { allMetricsGraphJson } from './private/rendering';
import { ConcreteWidget } from './widget';
import * as cdk from '../../core';

/**
 * Basic properties for widgets that display metrics
 */
export interface MetricWidgetProps {
  /**
   * Title for the graph
   *
   * @default - None
   */
  readonly title?: string;

  /**
   * The region the metrics of this graph should be taken from
   *
   * @default - Current region
   */
  readonly region?: string;

  /**
   * Width of the widget, in a grid of 24 units wide
   *
   * @default 6
   */
  readonly width?: number;

  /**
   * Height of the widget
   *
   * @default - 6 for Alarm and Graph widgets.
   *   3 for single value widgets where most recent value of a metric is displayed.
   */
  readonly height?: number;
}

/**
 * Properties for a Y-Axis
 */
export interface YAxisProps {
  /**
   * The min value
   *
   * @default 0
   */
  readonly min?: number;

  /**
   * The max value
   *
   * @default - No maximum value
   */
  readonly max?: number;

  /**
   * The label
   *
   * @default - No label
   */
  readonly label?: string;

  /**
   * Whether to show units
   *
   * @default true
   */
  readonly showUnits?: boolean;
}

/**
 * Properties for an AlarmWidget
 */
export interface AlarmWidgetProps extends MetricWidgetProps {
  /**
   * The alarm to show
   */
  readonly alarm: IAlarm;

  /**
   * Left Y axis
   *
   * @default - No minimum or maximum values for the left Y-axis
   */
  readonly leftYAxis?: YAxisProps;
}

/**
 * Display the metric associated with an alarm, including the alarm line
 */
export class AlarmWidget extends ConcreteWidget {
  private readonly props: AlarmWidgetProps;

  constructor(props: AlarmWidgetProps) {
    super(props.width || 6, props.height || 6);
    this.props = props;
  }

  public toJson(): any[] {
    return [{
      type: 'metric',
      width: this.width,
      height: this.height,
      x: this.x,
      y: this.y,
      properties: {
        view: 'timeSeries',
        title: this.props.title,
        region: this.props.region || cdk.Aws.REGION,
        annotations: {
          alarms: [this.props.alarm.alarmArn],
        },
        yAxis: {
          left: this.props.leftYAxis ?? undefined,
        },
      },
    }];
  }
}

/**
 * Types of view
 */
export enum GraphWidgetView {
  /**
   * Display as a line graph.
   */
  TIME_SERIES = 'timeSeries',
  /**
   * Display as a bar graph.
   */
  BAR = 'bar',
  /**
   * Display as a pie graph.
   */
  PIE = 'pie',
}

/**
 * Properties for a GaugeWidget
 */
export interface GaugeWidgetProps extends MetricWidgetProps {
  /**
   * Metrics to display on left Y axis
   *
   * @default - No metrics
   */
  readonly metrics?: IMetric[];

  /**
   * Annotations for the left Y axis
   *
   * @default - No annotations
   */
  readonly annotations?: HorizontalAnnotation[];

  /**
   * Left Y axis
   *
   * @default - None
   */
  readonly leftYAxis?: YAxisProps;

  /**
   * Position of the legend
   *
   * @default - bottom
   */
  readonly legendPosition?: LegendPosition;

  /**
   * Whether the graph should show live data
   *
   * @default false
   */
  readonly liveData?: boolean;

  /**
   * Whether to show the value from the entire time range. Only applicable for Bar and Pie charts.
   *
   * If false, values will be from the most recent period of your chosen time range;
   * if true, shows the value from the entire time range.
   *
   * @default false
   */
  readonly setPeriodToTimeRange?: boolean;

  /**
   * The default period for all metrics in this widget.
   * The period is the length of time represented by one data point on the graph.
   * This default can be overridden within each metric definition.
   *
   * @default cdk.Duration.seconds(300)
   */
  readonly period?: cdk.Duration;

  /**
   * The default statistic to be displayed for each metric.
   * This default can be overridden within the definition of each individual metric
   *
   * @default - The statistic for each metric is used
   */
  readonly statistic?: string;

  /**
   * The start of the time range to use for each widget independently from those of the dashboard.
   * You can specify start without specifying end to specify a relative time range that ends with the current time.
   * In this case, the value of start must begin with -P, and you can use M, H, D, W and M as abbreviations for
   * minutes, hours, days, weeks and months. For example, -PT8H shows the last 8 hours and -P3M shows the last three months.
   * You can also use start along with an end field, to specify an absolute time range.
   * When specifying an absolute time range, use the ISO 8601 format. For example, 2018-12-17T06:00:00.000Z.
   *
   * @default When the dashboard loads, the start time will be the default time range.
   */
  readonly start?: string;

  /**
   * The end of the time range to use for each widget independently from those of the dashboard.
   * If you specify a value for end, you must also specify a value for start.
   * Specify an absolute time in the ISO 8601 format. For example, 2018-12-17T06:00:00.000Z.
   *
   * @default When the dashboard loads, the end date will be the current time.
   */
  readonly end?: string;
}

/**
 * A dashboard gauge widget that displays metrics
 */
export class GaugeWidget extends ConcreteWidget {

  private readonly props: GaugeWidgetProps;

  private readonly metrics: IMetric[];

  constructor(props: GaugeWidgetProps) {
    super(props.width || 6, props.height || 6);
    this.props = props;
    this.metrics = props.metrics ?? [];
    this.copyMetricWarnings(...this.metrics);

    if (props.end !== undefined && props.start === undefined) {
      throw new Error('If you specify a value for end, you must also specify a value for start.');
    }
  }

  /**
   * Add another metric to the left Y axis of the GaugeWidget
   *
   * @param metric the metric to add
   */
  public addMetric(metric: IMetric) {
    this.metrics.push(metric);
    this.copyMetricWarnings(metric);
  }

  public toJson(): any[] {

    const metrics = allMetricsGraphJson(this.metrics, []);
    const leftYAxis = {
      ...this.props.leftYAxis,
      min: this.props.leftYAxis?.min ?? 0,
      max: this.props.leftYAxis?.max ?? 100,
    };
    return [{
      type: 'metric',
      width: this.width,
      height: this.height,
      x: this.x,
      y: this.y,
      properties: {
        view: 'gauge',
        title: this.props.title,
        region: this.props.region || cdk.Aws.REGION,
        metrics: metrics.length > 0 ? metrics : undefined,
        annotations: (this.props.annotations ?? []).length > 0 ? { horizontal: this.props.annotations } : undefined,
        yAxis: {
          left: leftYAxis ?? undefined,
        },
        legend: this.props.legendPosition !== undefined ? { position: this.props.legendPosition } : undefined,
        liveData: this.props.liveData,
        setPeriodToTimeRange: this.props.setPeriodToTimeRange,
        period: this.props.period?.toSeconds(),
        stat: this.props.statistic,
        start: this.props.start,
        end: this.props.end,
      },
    }];
  }
}

/**
 * Properties for a GraphWidget
 */
export interface GraphWidgetProps extends MetricWidgetProps {
  /**
   * Metrics to display on left Y axis
   *
   * @default - No metrics
   */
  readonly left?: IMetric[];

  /**
   * Metrics to display on right Y axis
   *
   * @default - No metrics
   */
  readonly right?: IMetric[];

  /**
   * Annotations for the left Y axis
   *
   * @default - No annotations
   */
  readonly leftAnnotations?: HorizontalAnnotation[];

  /**
   * Annotations for the right Y axis
   *
   * @default - No annotations
   */
  readonly rightAnnotations?: HorizontalAnnotation[];

  /**
   * Annotations for the X axis
   *
   * @default - No annotations
   */
  readonly verticalAnnotations?: VerticalAnnotation[];

  /**
   * Whether the graph should be shown as stacked lines
   *
   * @default false
   */
  readonly stacked?: boolean;

  /**
   * Left Y axis
   *
   * @default - None
   */
  readonly leftYAxis?: YAxisProps;

  /**
   * Right Y axis
   *
   * @default - None
   */
  readonly rightYAxis?: YAxisProps;

  /**
   * Position of the legend
   *
   * @default - bottom
   */
  readonly legendPosition?: LegendPosition;

  /**
   * Whether the graph should show live data
   *
   * @default false
   */
  readonly liveData?: boolean;

  /**
   * Display this metric
   *
   * @default TimeSeries
   */
  readonly view?: GraphWidgetView;

  /**
   * Whether to show the value from the entire time range. Only applicable for Bar and Pie charts.
   *
   * If false, values will be from the most recent period of your chosen time range;
   * if true, shows the value from the entire time range.
   *
   * @default false
   */
  readonly setPeriodToTimeRange?: boolean;

  /**
   * The default period for all metrics in this widget.
   * The period is the length of time represented by one data point on the graph.
   * This default can be overridden within each metric definition.
   *
   * @default cdk.Duration.seconds(300)
   */
  readonly period?: cdk.Duration;

  /**
   * The default statistic to be displayed for each metric.
   * This default can be overridden within the definition of each individual metric
   *
   * @default - The statistic for each metric is used
   */
  readonly statistic?: string;

  /**
   * The start of the time range to use for each widget independently from those of the dashboard.
   * You can specify start without specifying end to specify a relative time range that ends with the current time.
   * In this case, the value of start must begin with -P, and you can use M, H, D, W and M as abbreviations for
   * minutes, hours, days, weeks and months. For example, -PT8H shows the last 8 hours and -P3M shows the last three months.
   * You can also use start along with an end field, to specify an absolute time range.
   * When specifying an absolute time range, use the ISO 8601 format. For example, 2018-12-17T06:00:00.000Z.
   *
   * @default When the dashboard loads, the start time will be the default time range.
   */
  readonly start?: string;

  /**
   * The end of the time range to use for each widget independently from those of the dashboard.
   * If you specify a value for end, you must also specify a value for start.
   * Specify an absolute time in the ISO 8601 format. For example, 2018-12-17T06:00:00.000Z.
   *
   * @default When the dashboard loads, the end date will be the current time.
   */
  readonly end?: string;
}

/**
 * A dashboard widget that displays metrics
 */
export class GraphWidget extends ConcreteWidget {

  private static readonly ISO8601_REGEX = /^(-?(?:[1-9][0-9]*)?[0-9]{4})-(1[0-2]|0[1-9])-(3[01]|0[1-9]|[12][0-9])T(2[0-3]|[01][0-9]):([0-5][0-9]):([0-5][0-9])(.[0-9]+)?(Z)?$/;

  private static isIso8601(date: string): boolean {
    return this.ISO8601_REGEX.test(date);
  }

  private readonly props: GraphWidgetProps;

  private readonly leftMetrics: IMetric[];
  private readonly rightMetrics: IMetric[];

  constructor(props: GraphWidgetProps) {
    super(props.width || 6, props.height || 6);
    props.verticalAnnotations?.forEach(annotation => {
      const date = annotation.date;
      if (!GraphWidget.isIso8601(date)) {
        throw new Error(`Given date ${date} is not in ISO 8601 format`);
      }
    });
    this.props = props;
    this.leftMetrics = props.left ?? [];
    this.rightMetrics = props.right ?? [];
    this.copyMetricWarnings(...this.leftMetrics, ...this.rightMetrics);

    if (props.end !== undefined && props.start === undefined) {
      throw new Error('If you specify a value for end, you must also specify a value for start.');
    }
  }

  /**
   * Add another metric to the left Y axis of the GraphWidget
   *
   * @param metric the metric to add
   */
  public addLeftMetric(metric: IMetric) {
    this.leftMetrics.push(metric);
    this.copyMetricWarnings(metric);
  }

  /**
   * Add another metric to the right Y axis of the GraphWidget
   *
   * @param metric the metric to add
   */
  public addRightMetric(metric: IMetric) {
    this.rightMetrics.push(metric);
    this.copyMetricWarnings(metric);
  }

  public toJson(): any[] {
    const horizontalAnnotations = [
      ...(this.props.leftAnnotations || []).map(mapAnnotation('left')),
      ...(this.props.rightAnnotations || []).map(mapAnnotation('right')),
    ];
    const verticalAnnotations = (this.props.verticalAnnotations || []).map(({ date, ...rest }) => ({
      value: date,
      ...rest,
    }));
    const annotations = horizontalAnnotations.length > 0 || verticalAnnotations.length > 0 ? ({
      horizontal: horizontalAnnotations.length > 0 ? horizontalAnnotations : undefined,
      vertical: verticalAnnotations.length > 0 ? verticalAnnotations : undefined,
    }) : undefined;
    const metrics = allMetricsGraphJson(this.leftMetrics, this.rightMetrics);
    return [{
      type: 'metric',
      width: this.width,
      height: this.height,
      x: this.x,
      y: this.y,
      properties: {
        view: this.props.view ?? GraphWidgetView.TIME_SERIES,
        title: this.props.title,
        region: this.props.region || cdk.Aws.REGION,
        stacked: this.props.stacked,
        metrics: metrics.length > 0 ? metrics : undefined,
        annotations,
        yAxis: {
          left: this.props.leftYAxis ?? undefined,
          right: this.props.rightYAxis ?? undefined,
        },
        legend: this.props.legendPosition !== undefined ? { position: this.props.legendPosition } : undefined,
        liveData: this.props.liveData,
        setPeriodToTimeRange: this.props.setPeriodToTimeRange,
        period: this.props.period?.toSeconds(),
        stat: this.props.statistic,
        start: this.props.start,
        end: this.props.end,
      },
    }];
  }
}

/**
 * Layout for TableWidget
 */
export enum TableLayout {
  /**
   * Data points are laid out in columns
   */
  HORIZONTAL = 'horizontal',

  /**
   * Data points are laid out in rows
   */
  VERTICAL = 'vertical',
}

/**
 * Standard table summary columns
 */
export enum TableSummaryColumn {
  /**
   * Minimum of all data points
   */
  MINIMUM = 'MIN',

  /**
   * Maximum of all data points
   */
  MAXIMUM = 'MAX',

  /**
   * Sum of all data points
   */
  SUM = 'SUM',

  /**
   * Average of all data points
   */
  AVERAGE = 'AVG',
}

/**
 * Properties for TableWidget's summary columns
 */
export interface TableSummaryProps {
  /**
   * Summary columns
   * @see TableSummary
   *
   * @default - No summary columns will be shown
   */
  readonly columns?: TableSummaryColumn[];

  /**
   * Make the summary columns sticky, so that they remain in view while scrolling
   *
   * @default - false
   */
  readonly sticky?: boolean;

  /**
   * Prevent the columns of datapoints from being displayed, so that only the label and summary columns are displayed
   *
   * @default - false
   */
  readonly hideNonSummaryColumns?: boolean;
}

/**
 * Thresholds for highlighting cells in TableWidget
 */
export class TableThreshold {

  /**
   * A threshold for highlighting and coloring cells above the specified value
   *
   * @param value lower bound of threshold range
   * @param color cell color for values within threshold range
   */
  public static above(value: number, color?: string): TableThreshold {
    return new TableThreshold(value, undefined, color, Shading.ABOVE);
  }

  /**
   * A threshold for highlighting and coloring cells below the specified value
   *
   * @param value upper bound of threshold range
   * @param color cell color for values within threshold range
   */
  public static below(value: number, color?: string): TableThreshold {
    return new TableThreshold(value, undefined, color, Shading.BELOW);
  }

  /**
   * A threshold for highlighting and coloring cells within the specified values
   *
   * @param lowerBound lower bound of threshold range
   * @param upperBound upper bound of threshold range
   * @param color cell color for values within threshold range
   */
  public static between(lowerBound: number, upperBound: number, color?: string): TableThreshold {
    return new TableThreshold(lowerBound, upperBound, color);
  }

  private readonly lowerBound: number;
  private readonly upperBound?: number;
  private readonly color?: string;
  private readonly comparator?: Shading;

  private constructor(lowerBound: number, upperBound?: number, color?: string, comparator?: Shading) {
    this.lowerBound = lowerBound;
    this.upperBound = upperBound;
    this.color = color;
    this.comparator = comparator;
  }

  public toJson(): any {
    if (this.upperBound) {
      return [
        { value: this.lowerBound, color: this.color },
        { value: this.upperBound },
      ];
    }
    return { value: this.lowerBound, color: this.color, fill: this.comparator };
  }
}

/**
 * Properties for a TableWidget
 */
export interface TableWidgetProps extends MetricWidgetProps {
  /**
   * Table layout
   *
   * @default - TableLayout.HORIZONTAL
   */
  readonly layout?: TableLayout;

  /**
   * Properties for displaying summary columns
   *
   * @default - no summary columns are shown
   */
  readonly summary?: TableSummaryProps;

  /**
   * Thresholds for highlighting table cells
   *
   * @default - No thresholds
   */
  readonly thresholds?: TableThreshold[];

  /**
   * Show the metrics units in the label column
   *
   * @default - false
   */
  readonly showUnitsInLabel?: boolean;

  /**
   * Metrics to display in the table
   *
   * @default - No metrics
   */
  readonly metrics?: IMetric[];

  /**
   * Whether the graph should show live data
   *
   * @default false
   */
  readonly liveData?: boolean;

  /**
   * Whether to show as many digits as can fit, before rounding.
   *
   * @default false
   */
  readonly fullPrecision?: boolean;

  /**
   * Whether to show the value from the entire time range. Only applicable for Bar and Pie charts.
   *
   * If false, values will be from the most recent period of your chosen time range;
   * if true, shows the value from the entire time range.
   *
   * @default false
   */
  readonly setPeriodToTimeRange?: boolean;

  /**
   * The default period for all metrics in this widget.
   * The period is the length of time represented by one data point on the graph.
   * This default can be overridden within each metric definition.
   *
   * @default cdk.Duration.seconds(300)
   */
  readonly period?: cdk.Duration;

  /**
   * The default statistic to be displayed for each metric.
   * This default can be overridden within the definition of each individual metric
   *
   * @default - The statistic for each metric is used
   */
  readonly statistic?: string;

  /**
   * The start of the time range to use for each widget independently from those of the dashboard.
   * You can specify start without specifying end to specify a relative time range that ends with the current time.
   * In this case, the value of start must begin with -P, and you can use M, H, D, W and M as abbreviations for
   * minutes, hours, days, weeks and months. For example, -PT8H shows the last 8 hours and -P3M shows the last three months.
   * You can also use start along with an end field, to specify an absolute time range.
   * When specifying an absolute time range, use the ISO 8601 format. For example, 2018-12-17T06:00:00.000Z.
   *
   * @default When the dashboard loads, the start time will be the default time range.
   */
  readonly start?: string;

  /**
   * The end of the time range to use for each widget independently from those of the dashboard.
   * If you specify a value for end, you must also specify a value for start.
   * Specify an absolute time in the ISO 8601 format. For example, 2018-12-17T06:00:00.000Z.
   *
   * @default When the dashboard loads, the end date will be the current time.
   */
  readonly end?: string;
}

/**
 * A dashboard widget that displays metrics
 */
export class TableWidget extends ConcreteWidget {

  private readonly props: TableWidgetProps;

  private readonly metrics: IMetric[];

  constructor(props: TableWidgetProps) {
    super(props.width || 6, props.height || 6);

    this.props = props;
    this.metrics = props.metrics ?? [];
    this.copyMetricWarnings(...this.metrics);

    if (props.end !== undefined && props.start === undefined) {
      throw new Error('If you specify a value for end, you must also specify a value for start.');
    }
  }

  /**
   * Add another metric
   *
   * @param metric the metric to add
   */
  public addMetric(metric: IMetric) {
    this.metrics.push(metric);
    this.copyMetricWarnings(metric);
  }

  public toJson(): any[] {
    const horizontalAnnotations = (this.props.thresholds ?? []).map(threshold => threshold.toJson());
    const annotations = horizontalAnnotations.length > 0 ? ({
      horizontal: horizontalAnnotations,
    }) : undefined;
    const metrics = allMetricsGraphJson(this.metrics, []);
    return [{
      type: 'metric',
      width: this.width,
      height: this.height,
      x: this.x,
      y: this.y,
      properties: {
        title: this.props.title,
        view: 'table',
        table: {
          layout: this.props.layout ?? TableLayout.HORIZONTAL,
          showTimeSeriesData: !(this.props.summary?.hideNonSummaryColumns ?? false),
          stickySummary: this.props.summary?.sticky ?? false,
          summaryColumns: this.props.summary?.columns ?? [],
        },
        region: this.props.region || cdk.Aws.REGION,
        metrics: metrics.length > 0 ? metrics : undefined,
        annotations,
        yAxis: {
          left: this.props.showUnitsInLabel ? {
            showUnits: true,
          } : undefined,
        },
        liveData: this.props.liveData,
        singleValueFullPrecision: this.props.fullPrecision,
        setPeriodToTimeRange: this.props.setPeriodToTimeRange,
        period: this.props.period?.toSeconds(),
        stat: this.props.statistic,
        start: this.props.start,
        end: this.props.end,
      },
    }];
  }
}

/**
 * Properties for a SingleValueWidget
 */
export interface SingleValueWidgetProps extends MetricWidgetProps {
  /**
   * Metrics to display
   */
  readonly metrics: IMetric[];

  /**
   * The default period for all metrics in this widget.
   * The period is the length of time represented by one data point on the graph.
   * This default can be overridden within each metric definition.
   *
   * @default cdk.Duration.seconds(300)
   */
  readonly period?: cdk.Duration;

  /**
   * Whether to show the value from the entire time range.
   *
   * @default false
   */
  readonly setPeriodToTimeRange?: boolean;

  /**
   * Whether to show as many digits as can fit, before rounding.
   *
   * @default false
   */
  readonly fullPrecision?: boolean;

  /**
   * Whether to show a graph below the value illustrating the value for the whole time range.
   * Cannot be used in combination with `setPeriodToTimeRange`
   *
   * @default false
   */
  readonly sparkline?: boolean;

  /**
   * The start of the time range to use for each widget independently from those of the dashboard.
   * You can specify start without specifying end to specify a relative time range that ends with the current time.
   * In this case, the value of start must begin with -P, and you can use M, H, D, W and M as abbreviations for
   * minutes, hours, days, weeks and months. For example, -PT8H shows the last 8 hours and -P3M shows the last three months.
   * You can also use start along with an end field, to specify an absolute time range.
   * When specifying an absolute time range, use the ISO 8601 format. For example, 2018-12-17T06:00:00.000Z.
   *
   * @default When the dashboard loads, the start time will be the default time range.
   */
  readonly start?: string;

  /**
   * The end of the time range to use for each widget independently from those of the dashboard.
   * If you specify a value for end, you must also specify a value for start.
   * Specify an absolute time in the ISO 8601 format. For example, 2018-12-17T06:00:00.000Z.
   *
   * @default When the dashboard loads, the end date will be the current time.
   */
  readonly end?: string;
}

/**
 * A dashboard widget that displays the most recent value for every metric
 */
export class SingleValueWidget extends ConcreteWidget {
  private readonly props: SingleValueWidgetProps;

  constructor(props: SingleValueWidgetProps) {
    super(props.width || 6, props.height || 3);
    this.props = props;
    this.copyMetricWarnings(...props.metrics);

    if (props.setPeriodToTimeRange && props.sparkline) {
      throw new Error('You cannot use setPeriodToTimeRange with sparkline');
    }

    if (props.end !== undefined && props.start === undefined) {
      throw new Error('If you specify a value for end, you must also specify a value for start.');
    }
  }

  public toJson(): any[] {
    return [{
      type: 'metric',
      width: this.width,
      height: this.height,
      x: this.x,
      y: this.y,
      properties: {
        view: 'singleValue',
        title: this.props.title,
        region: this.props.region || cdk.Aws.REGION,
        sparkline: this.props.sparkline,
        metrics: allMetricsGraphJson(this.props.metrics, []),
        setPeriodToTimeRange: this.props.setPeriodToTimeRange,
        singleValueFullPrecision: this.props.fullPrecision,
        period: this.props.period?.toSeconds(),
        start: this.props.start,
        end: this.props.end,
      },
    }];
  }
}

/**
 * The properties for a CustomWidget
 */
export interface CustomWidgetProps {
  /**
   * The Arn of the AWS Lambda function that returns HTML or JSON that will be displayed in the widget
   */
  readonly functionArn: string;

  /**
   * Width of the widget, in a grid of 24 units wide
   *
   * @default 6
   */
  readonly width?: number;

  /**
   * Height of the widget
   *
   * @default - 6 for Alarm and Graph widgets.
   *   3 for single value widgets where most recent value of a metric is displayed.
   */
  readonly height?: number;

  /**
   * The title of the widget
   */
  readonly title: string;

  /**
   * Update the widget on refresh
   *
   * @default true
   */
  readonly updateOnRefresh?: boolean;

  /**
   * Update the widget on resize
   *
   * @default true
   */
  readonly updateOnResize?: boolean;

  /**
   * Update the widget on time range change
   *
   * @default true
   */
  readonly updateOnTimeRangeChange?: boolean;

  /**
   * Parameters passed to the lambda function
   *
   * @default - no parameters are passed to the lambda function
   */
  readonly params?: any;
}

/**
 * A CustomWidget shows the result of a AWS lambda function
 */
export class CustomWidget extends ConcreteWidget {

  private readonly props: CustomWidgetProps;

  public constructor(props: CustomWidgetProps) {
    super(props.width ?? 6, props.height ?? 6);
    this.props = props;
  }

  public toJson(): any[] {
    return [{
      type: 'custom',
      width: this.width,
      height: this.height,
      x: this.x,
      y: this.y,
      properties: {
        endpoint: this.props.functionArn,
        params: this.props.params,
        title: this.props.title,
        updateOn: {
          refresh: this.props.updateOnRefresh ?? true,
          resize: this.props.updateOnResize ?? true,
          timeRange: this.props.updateOnTimeRangeChange ?? true,
        },
      },
    }];
  }
}

/**
 * Horizontal annotation to be added to a graph
 */
export interface HorizontalAnnotation {
  /**
   * The value of the annotation
   */
  readonly value: number;

  /**
   * Label for the annotation
   *
   * @default - No label
   */
  readonly label?: string;

  /**
   * The hex color code, prefixed with '#' (e.g. '#00ff00'), to be used for the annotation.
   * The `Color` class has a set of standard colors that can be used here.
   *
   * @default - Automatic color
   */
  readonly color?: string;

  /**
   * Add shading above or below the annotation
   *
   * @default No shading
   */
  readonly fill?: Shading;

  /**
   * Whether the annotation is visible
   *
   * @default true
   */
  readonly visible?: boolean;
}

/**
 * Vertical annotation to be added to a graph
 */
export interface VerticalAnnotation {
  /**
   * The date and time (in ISO 8601 format) in the graph where the vertical annotation line is to appear
   */
  readonly date: string;

  /**
   * Label for the annotation
   *
   * @default - No label
   */
  readonly label?: string;

  /**
   * The hex color code, prefixed with '#' (e.g. '#00ff00'), to be used for the annotation.
   * The `Color` class has a set of standard colors that can be used here.
   *
   * @default - Automatic color
   */
  readonly color?: string;

  /**
   * Add shading before or after the annotation
   *
   * @default No shading
   */
  readonly fill?: VerticalShading;

  /**
   * Whether the annotation is visible
   *
   * @default true
   */
  readonly visible?: boolean;
}

/**
 * Fill shading options that will be used with a horizontal annotation
 */
export enum Shading {
  /**
   * Don't add shading
   */
  NONE = 'none',

  /**
   * Add shading above the annotation
   */
  ABOVE = 'above',

  /**
   * Add shading below the annotation
   */
  BELOW = 'below',
}

/**
 * Fill shading options that will be used with a vertical annotation
 */
export enum VerticalShading {
  /**
   * Don't add shading
   */
  NONE = 'none',

  /**
   * Add shading before the annotation
   */
  BEFORE = 'before',

  /**
   * Add shading after the annotation
   */
  AFTER = 'after',
}

/**
 * A set of standard colours that can be used in annotations in a GraphWidget.
 */
export class Color {
  /** blue - hex #1f77b4 */
  public static readonly BLUE = '#1f77b4';

  /** brown - hex #8c564b */
  public static readonly BROWN = '#8c564b';

  /** green - hex #2ca02c */
  public static readonly GREEN = '#2ca02c';

  /** grey - hex #7f7f7f */
  public static readonly GREY = '#7f7f7f';

  /** orange - hex #ff7f0e */
  public static readonly ORANGE = '#ff7f0e';

  /** pink - hex #e377c2 */
  public static readonly PINK = '#e377c2';

  /** purple - hex #9467bd */
  public static readonly PURPLE = '#9467bd';

  /** red - hex #d62728 */
  public static readonly RED = '#d62728';

  private constructor() {}
}

/**
 * The position of the legend on a GraphWidget.
 */
export enum LegendPosition {
  /**
   * Legend appears below the graph (default).
   */
  BOTTOM = 'bottom',

  /**
   * Add shading above the annotation
   */
  RIGHT = 'right',

  /**
   * Add shading below the annotation
   */
  HIDDEN = 'hidden',
}

function mapAnnotation(yAxis: string): ((x: HorizontalAnnotation) => any) {
  return (a: HorizontalAnnotation) => {
    return { ...a, yAxis };
  };
}
