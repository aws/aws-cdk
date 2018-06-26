import { AwsRegion, Token } from "@aws-cdk/core";
import { Alarm } from "./alarm";
import { Metric } from "./metric";
import { ConcreteWidget } from "./widget";

/**
 * An AWS region
 */
export class Region extends Token {
}

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
    region?: Region;

    /**
     * Width of the widget, in a grid of 24 units wide
     *
     * @default 6
     */
    width?: number;

    /**
     * Height of the widget
     *
     * @default 6
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
     * Minimum of left Y axis
     *
     * @default 0
     */
    leftAxisMin?: number;

    /**
     * Maximum of left Y axis
     *
     * @default Automatic
     */
    leftAxisMax?: number;
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
                    left: {
                        min: this.props.leftAxisMin,
                        max: this.props.leftAxisMax
                    }
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
     * Minimum of left Y axis
     *
     * @default 0
     */
    leftAxisMin?: number;

    /**
     * Maximum of left Y axis
     *
     * @default Automatic
     */
    leftAxisMax?: number;

    /**
     * Minimum of right Y axis
     *
     * @default 0
     */
    rightAxisMin?: number;

    /**
     * Maximum of right Y axis
     *
     * @default Automatic
     */
    rightAxisMax?: number;
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
                metrics: (this.props.left || []).map(m => m.toGraphJson('left')).concat(
                         (this.props.right || []).map(m => m.toGraphJson('right'))),
                annotations: {
                    horizontal: (this.props.leftAnnotations || []).map(mapAnnotation('left')).concat(
                                (this.props.leftAnnotations || []).map(mapAnnotation('right')))
                },
                yAxis: {
                    left: {
                        min: this.props.leftAxisMin,
                        max: this.props.leftAxisMax
                    },
                    right: {
                        min: this.props.rightAxisMin,
                        max: this.props.rightAxisMax
                    },
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
                view: 'singleValue',
                title: this.props.title,
                region: this.props.region || new AwsRegion(),
                metrics: this.props.metrics.map(m => m.toGraphJson('left'))
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