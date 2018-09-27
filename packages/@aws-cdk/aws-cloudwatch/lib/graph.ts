import { AwsRegion } from "@aws-cdk/cdk";
import { Alarm } from "./alarm";
import { Metric } from "./metric";
import { parseStatistic } from './util.statistic';
import { ConcreteWidget } from "./widget";

/**
 * Basic properties for widgets that display metrics
 */
export interface MetricWidgetProps {
  /**
   * Title for the graph
   */
  title?: string;

  /**
   * The region the metrics of this graph should be taken from
   *
   * @default Current region
   */
  region?: string;

  /**
   * Width of the widget, in a grid of 24 units wide
   *
   * @default 6
   */
  width?: number;

  /**
   * Height of the widget
   *
   * @default Depends on the type of widget
   */
  height?: number;
}

/**
 * Properties for an AlarmWidget
 */
export interface AlarmWidgetProps extends MetricWidgetProps {
  /**
   * The alarm to show
   */
  alarm: Alarm;

  /**
   * Range of left Y axis
   *
   * @default 0..automatic
   */
  leftAxisRange?: YAxisRange;
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
        region: this.props.region || new AwsRegion(),
        annotations: {
          alarms: [this.props.alarm.alarmArn]
        },
        yAxis: {
          left: this.props.leftAxisRange !== undefined ? this.props.leftAxisRange : { min: 0 }
        }
      }
    }];
  }
}

/**
 * Properties for a GraphWidget
 */
export interface GraphWidgetProps extends MetricWidgetProps {
  /**
   * Metrics to display on left Y axis
   */
  left?: Metric[];

  /**
   * Metrics to display on right Y axis
   */
  right?: Metric[];

  /**
   * Annotations for the left Y axis
   */
  leftAnnotations?: HorizontalAnnotation[];

  /**
   * Annotations for the right Y axis
   */
  rightAnnotations?: HorizontalAnnotation[];

  /**
   * Whether the graph should be shown as stacked lines
   */
  stacked?: boolean;

  /**
   * Range of left Y axis
   *
   * @default 0..automatic
   */
  leftAxisRange?: YAxisRange;

  /**
   * Range of right Y axis
   *
   * @default 0..automatic
   */
  rightAxisRange?: YAxisRange;
}

/**
 * A dashboard widget that displays MarkDown
 */
export class GraphWidget extends ConcreteWidget {
  private readonly props: GraphWidgetProps;

  constructor(props: GraphWidgetProps) {
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
        region: this.props.region || new AwsRegion(),
        metrics: (this.props.left || []).map(m => metricJson(m, 'left')).concat(
             (this.props.right || []).map(m => metricJson(m, 'right'))),
        annotations: {
          horizontal: (this.props.leftAnnotations || []).map(mapAnnotation('left')).concat(
                (this.props.rightAnnotations || []).map(mapAnnotation('right')))
        },
        yAxis: {
          left: this.props.leftAxisRange !== undefined ? this.props.leftAxisRange : { min: 0 },
          right: this.props.rightAxisRange !== undefined ? this.props.rightAxisRange : { min: 0 },
        }
      }
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
  metrics: Metric[];
}

/**
 * A dashboard widget that displays the most recent value for every metric
 */
export class SingleValueWidget extends ConcreteWidget {
  private readonly props: SingleValueWidgetProps;

  constructor(props: SingleValueWidgetProps) {
    super(props.width || 6, props.height || 3);
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
        view: 'singleValue',
        title: this.props.title,
        region: this.props.region || new AwsRegion(),
        metrics: this.props.metrics.map(m => metricJson(m, 'left'))
      }
    }];
  }
}

/**
 * A minimum and maximum value for either the left or right Y axis
 */
export interface YAxisRange {
  /**
   * The minimum value
   *
   * @default Automatic
   */
  min?: number;

  /**
   * The maximum value
   *
   * @default Automatic
   */
  max?: number;
}

/**
 * Horizontal annotation to be added to a graph
 */
export interface HorizontalAnnotation {
  /**
   * The value of the annotation
   */
  value: number;

  /**
   * Label for the annotation
   *
   * @default No label
   */
  label?: string;

  /**
   * Hex color code to be used for the annotation
   *
   * @default Automatic color
   */
  color?: string;

  /**
   * Add shading above or below the annotation
   *
   * @default No shading
   */
  fill?: Shading;

  /**
   * Whether the annotation is visible
   *
   * @default true
   */
  visible?: boolean;
}

export enum Shading {
  /**
   * Don't add shading
   */
  None = 'none',

  /**
   * Add shading above the annotation
   */
  Above = 'above',

  /**
   * Add shading below the annotation
   */
  Below = 'below'
}

function mapAnnotation(yAxis: string): ((x: HorizontalAnnotation) => any) {
  return (a: HorizontalAnnotation) => {
    return { ...a, yAxis };
  };
}

/**
 * Return the JSON structure which represents this metric in a graph
 *
 * This will be called by GraphWidget, no need for clients to call this.
 */
function metricJson(metric: Metric, yAxis: string): any[] {
  // Namespace and metric Name
  const ret: any[] = [
    metric.namespace,
    metric.metricName,
  ];

  // Dimensions
  for (const dim of metric.dimensionsAsList()) {
    ret.push(dim.name, dim.value);
  }

  // Options
  const stat = parseStatistic(metric.statistic);
  ret.push({
    yAxis,
    label: metric.label,
    color: metric.color,
    period: metric.periodSec,
    stat: stat.type === 'simple' ? stat.statistic : 'p' + stat.percentile.toString(),
  });

  return ret;
}
