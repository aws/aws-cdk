import * as cdk from '@aws-cdk/core';
import { IAlarm } from "./alarm";
import { IMetric } from "./metric-types";
import { ConcreteWidget } from "./widget";

/**
 * Basic properties for widgets that display metrics
 */
export interface MetricWidgetProps {
  /**
   * Title for the graph
   */
  readonly title?: string;

  /**
   * The region the metrics of this graph should be taken from
   *
   * @default Current region
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
   * @default Depends on the type of widget
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
   * @default No maximum value
   */
  readonly max?: number;

  /**
   * The label
   *
   * @default No label
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
          alarms: [this.props.alarm.alarmArn]
        },
        yAxis: {
          left: this.props.leftYAxis !== undefined ? this.props.leftYAxis : undefined
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
  readonly left?: IMetric[];

  /**
   * Metrics to display on right Y axis
   */
  readonly right?: IMetric[];

  /**
   * Annotations for the left Y axis
   */
  readonly leftAnnotations?: HorizontalAnnotation[];

  /**
   * Annotations for the right Y axis
   */
  readonly rightAnnotations?: HorizontalAnnotation[];

  /**
   * Whether the graph should be shown as stacked lines
   */
  readonly stacked?: boolean;

  /**
   * Left Y axis
   */
  readonly leftYAxis?: YAxisProps;

  /**
   * Right Y axis
   */
  readonly rightYAxis?: YAxisProps;
}

/**
 * A dashboard widget that displays metrics
 */
export class GraphWidget extends ConcreteWidget {
  private readonly props: GraphWidgetProps;

  constructor(props: GraphWidgetProps) {
    super(props.width || 6, props.height || 6);
    this.props = props;
  }

  public toJson(): any[] {
    const horizontalAnnoations =  (this.props.leftAnnotations || []).map(mapAnnotation('left')).concat(
      (this.props.rightAnnotations || []).map(mapAnnotation('right')));
    const metrics = (this.props.left || []).map(m => metricJson(m, 'left')).concat(
      (this.props.right || []).map(m => metricJson(m, 'right')));
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
        stacked: this.props.stacked,
        metrics: metrics.length > 0 ? metrics : undefined,
        annotations: horizontalAnnoations.length > 0 ? { horizontal: horizontalAnnoations } : undefined,
        yAxis: {
          left: this.props.leftYAxis !== undefined ? this.props.leftYAxis : undefined,
          right: this.props.rightYAxis !== undefined ? this.props.rightYAxis : undefined,
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
  readonly metrics: IMetric[];

  /**
   * Whether to show the value from the entire time range.
   *
   * @default false
   */
  readonly setPeriodToTimeRange?: boolean;
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
        region: this.props.region || cdk.Aws.REGION,
        metrics: this.props.metrics.map(m => metricJson(m, 'left')),
        setPeriodToTimeRange: this.props.setPeriodToTimeRange
      }
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
   * @default No label
   */
  readonly label?: string;

  /**
   * Hex color code to be used for the annotation
   *
   * @default Automatic color
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
  BELOW = 'below'
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
function metricJson(metric: IMetric, yAxis: string): any[] {
  const config = metric.toGraphConfig();

  // Namespace and metric Name
  const ret: any[] = [
    config.namespace,
    config.metricName,
  ];

  // Dimensions
  for (const dim of (config.dimensions || [])) {
    ret.push(dim.name, dim.value);
  }

  // Options
  ret.push({ yAxis, ...config.renderingProperties });

  return ret;
}
