"use strict";
var _a, _b, _c, _d, _e, _f;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LegendPosition = exports.Color = exports.Shading = exports.CustomWidget = exports.SingleValueWidget = exports.GraphWidget = exports.GaugeWidget = exports.GraphWidgetView = exports.AlarmWidget = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const cdk = require("@aws-cdk/core");
const rendering_1 = require("./private/rendering");
const widget_1 = require("./widget");
/**
 * Display the metric associated with an alarm, including the alarm line
 */
class AlarmWidget extends widget_1.ConcreteWidget {
    constructor(props) {
        super(props.width || 6, props.height || 6);
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_cloudwatch_AlarmWidgetProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, AlarmWidget);
            }
            throw error;
        }
        this.props = props;
    }
    toJson() {
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
_a = JSII_RTTI_SYMBOL_1;
AlarmWidget[_a] = { fqn: "@aws-cdk/aws-cloudwatch.AlarmWidget", version: "0.0.0" };
exports.AlarmWidget = AlarmWidget;
/**
 * Types of view
 */
var GraphWidgetView;
(function (GraphWidgetView) {
    /**
     * Display as a line graph.
     */
    GraphWidgetView["TIME_SERIES"] = "timeSeries";
    /**
     * Display as a bar graph.
     */
    GraphWidgetView["BAR"] = "bar";
    /**
     * Display as a pie graph.
     */
    GraphWidgetView["PIE"] = "pie";
})(GraphWidgetView = exports.GraphWidgetView || (exports.GraphWidgetView = {}));
/**
 * A dashboard gauge widget that displays metrics
 */
class GaugeWidget extends widget_1.ConcreteWidget {
    constructor(props) {
        super(props.width || 6, props.height || 6);
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_cloudwatch_GaugeWidgetProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, GaugeWidget);
            }
            throw error;
        }
        this.props = props;
        this.metrics = props.metrics ?? [];
        this.copyMetricWarnings(...this.metrics);
    }
    /**
     * Add another metric to the left Y axis of the GaugeWidget
     *
     * @param metric the metric to add
     */
    addMetric(metric) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_cloudwatch_IMetric(metric);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.addMetric);
            }
            throw error;
        }
        this.metrics.push(metric);
        this.copyMetricWarnings(metric);
    }
    toJson() {
        const horizontalAnnotations = [
            ...(this.props.annotations || []).map(mapAnnotation('annotations')),
        ];
        const metrics = (0, rendering_1.allMetricsGraphJson)(this.metrics, []);
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
                    annotations: horizontalAnnotations.length > 0 ? { horizontal: horizontalAnnotations } : undefined,
                    yAxis: {
                        left: leftYAxis ?? undefined,
                    },
                    legend: this.props.legendPosition !== undefined ? { position: this.props.legendPosition } : undefined,
                    liveData: this.props.liveData,
                    setPeriodToTimeRange: this.props.setPeriodToTimeRange,
                    period: this.props.period?.toSeconds(),
                    stat: this.props.statistic,
                },
            }];
    }
}
_b = JSII_RTTI_SYMBOL_1;
GaugeWidget[_b] = { fqn: "@aws-cdk/aws-cloudwatch.GaugeWidget", version: "0.0.0" };
exports.GaugeWidget = GaugeWidget;
/**
 * A dashboard widget that displays metrics
 */
class GraphWidget extends widget_1.ConcreteWidget {
    constructor(props) {
        super(props.width || 6, props.height || 6);
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_cloudwatch_GraphWidgetProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, GraphWidget);
            }
            throw error;
        }
        this.props = props;
        this.leftMetrics = props.left ?? [];
        this.rightMetrics = props.right ?? [];
        this.copyMetricWarnings(...this.leftMetrics, ...this.rightMetrics);
    }
    /**
     * Add another metric to the left Y axis of the GraphWidget
     *
     * @param metric the metric to add
     */
    addLeftMetric(metric) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_cloudwatch_IMetric(metric);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.addLeftMetric);
            }
            throw error;
        }
        this.leftMetrics.push(metric);
        this.copyMetricWarnings(metric);
    }
    /**
     * Add another metric to the right Y axis of the GraphWidget
     *
     * @param metric the metric to add
     */
    addRightMetric(metric) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_cloudwatch_IMetric(metric);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.addRightMetric);
            }
            throw error;
        }
        this.rightMetrics.push(metric);
        this.copyMetricWarnings(metric);
    }
    toJson() {
        const horizontalAnnotations = [
            ...(this.props.leftAnnotations || []).map(mapAnnotation('left')),
            ...(this.props.rightAnnotations || []).map(mapAnnotation('right')),
        ];
        const metrics = (0, rendering_1.allMetricsGraphJson)(this.leftMetrics, this.rightMetrics);
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
                    annotations: horizontalAnnotations.length > 0 ? { horizontal: horizontalAnnotations } : undefined,
                    yAxis: {
                        left: this.props.leftYAxis ?? undefined,
                        right: this.props.rightYAxis ?? undefined,
                    },
                    legend: this.props.legendPosition !== undefined ? { position: this.props.legendPosition } : undefined,
                    liveData: this.props.liveData,
                    setPeriodToTimeRange: this.props.setPeriodToTimeRange,
                    period: this.props.period?.toSeconds(),
                    stat: this.props.statistic,
                },
            }];
    }
}
_c = JSII_RTTI_SYMBOL_1;
GraphWidget[_c] = { fqn: "@aws-cdk/aws-cloudwatch.GraphWidget", version: "0.0.0" };
exports.GraphWidget = GraphWidget;
/**
 * A dashboard widget that displays the most recent value for every metric
 */
class SingleValueWidget extends widget_1.ConcreteWidget {
    constructor(props) {
        super(props.width || 6, props.height || 3);
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_cloudwatch_SingleValueWidgetProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, SingleValueWidget);
            }
            throw error;
        }
        this.props = props;
        this.copyMetricWarnings(...props.metrics);
        if (props.setPeriodToTimeRange && props.sparkline) {
            throw new Error('You cannot use setPeriodToTimeRange with sparkline');
        }
    }
    toJson() {
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
                    metrics: (0, rendering_1.allMetricsGraphJson)(this.props.metrics, []),
                    setPeriodToTimeRange: this.props.setPeriodToTimeRange,
                    singleValueFullPrecision: this.props.fullPrecision,
                },
            }];
    }
}
_d = JSII_RTTI_SYMBOL_1;
SingleValueWidget[_d] = { fqn: "@aws-cdk/aws-cloudwatch.SingleValueWidget", version: "0.0.0" };
exports.SingleValueWidget = SingleValueWidget;
/**
 * A CustomWidget shows the result of a AWS lambda function
 */
class CustomWidget extends widget_1.ConcreteWidget {
    constructor(props) {
        super(props.width ?? 6, props.height ?? 6);
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_cloudwatch_CustomWidgetProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, CustomWidget);
            }
            throw error;
        }
        this.props = props;
    }
    toJson() {
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
_e = JSII_RTTI_SYMBOL_1;
CustomWidget[_e] = { fqn: "@aws-cdk/aws-cloudwatch.CustomWidget", version: "0.0.0" };
exports.CustomWidget = CustomWidget;
/**
 * Fill shading options that will be used with an annotation
 */
var Shading;
(function (Shading) {
    /**
     * Don't add shading
     */
    Shading["NONE"] = "none";
    /**
     * Add shading above the annotation
     */
    Shading["ABOVE"] = "above";
    /**
     * Add shading below the annotation
     */
    Shading["BELOW"] = "below";
})(Shading = exports.Shading || (exports.Shading = {}));
/**
 * A set of standard colours that can be used in annotations in a GraphWidget.
 */
class Color {
    constructor() { }
}
_f = JSII_RTTI_SYMBOL_1;
Color[_f] = { fqn: "@aws-cdk/aws-cloudwatch.Color", version: "0.0.0" };
/** blue - hex #1f77b4 */
Color.BLUE = '#1f77b4';
/** brown - hex #8c564b */
Color.BROWN = '#8c564b';
/** green - hex #2ca02c */
Color.GREEN = '#2ca02c';
/** grey - hex #7f7f7f */
Color.GREY = '#7f7f7f';
/** orange - hex #ff7f0e */
Color.ORANGE = '#ff7f0e';
/** pink - hex #e377c2 */
Color.PINK = '#e377c2';
/** purple - hex #9467bd */
Color.PURPLE = '#9467bd';
/** red - hex #d62728 */
Color.RED = '#d62728';
exports.Color = Color;
/**
 * The position of the legend on a GraphWidget.
 */
var LegendPosition;
(function (LegendPosition) {
    /**
     * Legend appears below the graph (default).
     */
    LegendPosition["BOTTOM"] = "bottom";
    /**
     * Add shading above the annotation
     */
    LegendPosition["RIGHT"] = "right";
    /**
     * Add shading below the annotation
     */
    LegendPosition["HIDDEN"] = "hidden";
})(LegendPosition = exports.LegendPosition || (exports.LegendPosition = {}));
function mapAnnotation(yAxis) {
    return (a) => {
        return { ...a, yAxis };
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JhcGguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJncmFwaC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxxQ0FBcUM7QUFHckMsbURBQTBEO0FBQzFELHFDQUEwQztBQXNGMUM7O0dBRUc7QUFDSCxNQUFhLFdBQVksU0FBUSx1QkFBYztJQUc3QyxZQUFZLEtBQXVCO1FBQ2pDLEtBQUssQ0FBQyxLQUFLLENBQUMsS0FBSyxJQUFJLENBQUMsRUFBRSxLQUFLLENBQUMsTUFBTSxJQUFJLENBQUMsQ0FBQyxDQUFDOzs7Ozs7K0NBSmxDLFdBQVc7Ozs7UUFLcEIsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7S0FDcEI7SUFFTSxNQUFNO1FBQ1gsT0FBTyxDQUFDO2dCQUNOLElBQUksRUFBRSxRQUFRO2dCQUNkLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSztnQkFDakIsTUFBTSxFQUFFLElBQUksQ0FBQyxNQUFNO2dCQUNuQixDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7Z0JBQ1QsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO2dCQUNULFVBQVUsRUFBRTtvQkFDVixJQUFJLEVBQUUsWUFBWTtvQkFDbEIsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSztvQkFDdkIsTUFBTSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxJQUFJLEdBQUcsQ0FBQyxHQUFHLENBQUMsTUFBTTtvQkFDM0MsV0FBVyxFQUFFO3dCQUNYLE1BQU0sRUFBRSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQztxQkFDcEM7b0JBQ0QsS0FBSyxFQUFFO3dCQUNMLElBQUksRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsSUFBSSxTQUFTO3FCQUN4QztpQkFDRjthQUNGLENBQUMsQ0FBQztLQUNKOzs7O0FBM0JVLGtDQUFXO0FBOEJ4Qjs7R0FFRztBQUNILElBQVksZUFhWDtBQWJELFdBQVksZUFB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QTtBQUNuQixDQUFDLEVBZlcsY0FBYyxHQUFkLHNCQUFjLEtBQWQsc0JBQWMsUUFlekI7QUFFRCxTQUFTLGFBQWEsQ0FBQyxLQUFhO0lBQ2xDLE9BQU8sQ0FBQyxDQUF1QixFQUFFLEVBQUU7UUFDakMsT0FBTyxFQUFFLEdBQUcsQ0FBQyxFQUFFLEtBQUssRUFBRSxDQUFDO0lBQ3pCLENBQUMsQ0FBQztBQUNKLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBjZGsgZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBJQWxhcm0gfSBmcm9tICcuL2FsYXJtLWJhc2UnO1xuaW1wb3J0IHsgSU1ldHJpYyB9IGZyb20gJy4vbWV0cmljLXR5cGVzJztcbmltcG9ydCB7IGFsbE1ldHJpY3NHcmFwaEpzb24gfSBmcm9tICcuL3ByaXZhdGUvcmVuZGVyaW5nJztcbmltcG9ydCB7IENvbmNyZXRlV2lkZ2V0IH0gZnJvbSAnLi93aWRnZXQnO1xuXG4vKipcbiAqIEJhc2ljIHByb3BlcnRpZXMgZm9yIHdpZGdldHMgdGhhdCBkaXNwbGF5IG1ldHJpY3NcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBNZXRyaWNXaWRnZXRQcm9wcyB7XG4gIC8qKlxuICAgKiBUaXRsZSBmb3IgdGhlIGdyYXBoXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gTm9uZVxuICAgKi9cbiAgcmVhZG9ubHkgdGl0bGU/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSByZWdpb24gdGhlIG1ldHJpY3Mgb2YgdGhpcyBncmFwaCBzaG91bGQgYmUgdGFrZW4gZnJvbVxuICAgKlxuICAgKiBAZGVmYXVsdCAtIEN1cnJlbnQgcmVnaW9uXG4gICAqL1xuICByZWFkb25seSByZWdpb24/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFdpZHRoIG9mIHRoZSB3aWRnZXQsIGluIGEgZ3JpZCBvZiAyNCB1bml0cyB3aWRlXG4gICAqXG4gICAqIEBkZWZhdWx0IDZcbiAgICovXG4gIHJlYWRvbmx5IHdpZHRoPzogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBIZWlnaHQgb2YgdGhlIHdpZGdldFxuICAgKlxuICAgKiBAZGVmYXVsdCAtIDYgZm9yIEFsYXJtIGFuZCBHcmFwaCB3aWRnZXRzLlxuICAgKiAgIDMgZm9yIHNpbmdsZSB2YWx1ZSB3aWRnZXRzIHdoZXJlIG1vc3QgcmVjZW50IHZhbHVlIG9mIGEgbWV0cmljIGlzIGRpc3BsYXllZC5cbiAgICovXG4gIHJlYWRvbmx5IGhlaWdodD86IG51bWJlcjtcbn1cblxuLyoqXG4gKiBQcm9wZXJ0aWVzIGZvciBhIFktQXhpc1xuICovXG5leHBvcnQgaW50ZXJmYWNlIFlBeGlzUHJvcHMge1xuICAvKipcbiAgICogVGhlIG1pbiB2YWx1ZVxuICAgKlxuICAgKiBAZGVmYXVsdCAwXG4gICAqL1xuICByZWFkb25seSBtaW4/OiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIFRoZSBtYXggdmFsdWVcbiAgICpcbiAgICogQGRlZmF1bHQgLSBObyBtYXhpbXVtIHZhbHVlXG4gICAqL1xuICByZWFkb25seSBtYXg/OiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIFRoZSBsYWJlbFxuICAgKlxuICAgKiBAZGVmYXVsdCAtIE5vIGxhYmVsXG4gICAqL1xuICByZWFkb25seSBsYWJlbD86IHN0cmluZztcblxuICAvKipcbiAgICogV2hldGhlciB0byBzaG93IHVuaXRzXG4gICAqXG4gICAqIEBkZWZhdWx0IHRydWVcbiAgICovXG4gIHJlYWRvbmx5IHNob3dVbml0cz86IGJvb2xlYW47XG59XG5cbi8qKlxuICogUHJvcGVydGllcyBmb3IgYW4gQWxhcm1XaWRnZXRcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBBbGFybVdpZGdldFByb3BzIGV4dGVuZHMgTWV0cmljV2lkZ2V0UHJvcHMge1xuICAvKipcbiAgICogVGhlIGFsYXJtIHRvIHNob3dcbiAgICovXG4gIHJlYWRvbmx5IGFsYXJtOiBJQWxhcm07XG5cbiAgLyoqXG4gICAqIExlZnQgWSBheGlzXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gTm8gbWluaW11bSBvciBtYXhpbXVtIHZhbHVlcyBmb3IgdGhlIGxlZnQgWS1heGlzXG4gICAqL1xuICByZWFkb25seSBsZWZ0WUF4aXM/OiBZQXhpc1Byb3BzO1xufVxuXG4vKipcbiAqIERpc3BsYXkgdGhlIG1ldHJpYyBhc3NvY2lhdGVkIHdpdGggYW4gYWxhcm0sIGluY2x1ZGluZyB0aGUgYWxhcm0gbGluZVxuICovXG5leHBvcnQgY2xhc3MgQWxhcm1XaWRnZXQgZXh0ZW5kcyBDb25jcmV0ZVdpZGdldCB7XG4gIHByaXZhdGUgcmVhZG9ubHkgcHJvcHM6IEFsYXJtV2lkZ2V0UHJvcHM7XG5cbiAgY29uc3RydWN0b3IocHJvcHM6IEFsYXJtV2lkZ2V0UHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcy53aWR0aCB8fCA2LCBwcm9wcy5oZWlnaHQgfHwgNik7XG4gICAgdGhpcy5wcm9wcyA9IHByb3BzO1xuICB9XG5cbiAgcHVibGljIHRvSnNvbigpOiBhbnlbXSB7XG4gICAgcmV0dXJuIFt7XG4gICAgICB0eXBlOiAnbWV0cmljJyxcbiAgICAgIHdpZHRoOiB0aGlzLndpZHRoLFxuICAgICAgaGVpZ2h0OiB0aGlzLmhlaWdodCxcbiAgICAgIHg6IHRoaXMueCxcbiAgICAgIHk6IHRoaXMueSxcbiAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgdmlldzogJ3RpbWVTZXJpZXMnLFxuICAgICAgICB0aXRsZTogdGhpcy5wcm9wcy50aXRsZSxcbiAgICAgICAgcmVnaW9uOiB0aGlzLnByb3BzLnJlZ2lvbiB8fCBjZGsuQXdzLlJFR0lPTixcbiAgICAgICAgYW5ub3RhdGlvbnM6IHtcbiAgICAgICAgICBhbGFybXM6IFt0aGlzLnByb3BzLmFsYXJtLmFsYXJtQXJuXSxcbiAgICAgICAgfSxcbiAgICAgICAgeUF4aXM6IHtcbiAgICAgICAgICBsZWZ0OiB0aGlzLnByb3BzLmxlZnRZQXhpcyA/PyB1bmRlZmluZWQsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH1dO1xuICB9XG59XG5cbi8qKlxuICogVHlwZXMgb2Ygdmlld1xuICovXG5leHBvcnQgZW51bSBHcmFwaFdpZGdldFZpZXcge1xuICAvKipcbiAgICogRGlzcGxheSBhcyBhIGxpbmUgZ3JhcGguXG4gICAqL1xuICBUSU1FX1NFUklFUyA9ICd0aW1lU2VyaWVzJyxcbiAgLyoqXG4gICAqIERpc3BsYXkgYXMgYSBiYXIgZ3JhcGguXG4gICAqL1xuICBCQVIgPSAnYmFyJyxcbiAgLyoqXG4gICAqIERpc3BsYXkgYXMgYSBwaWUgZ3JhcGguXG4gICAqL1xuICBQSUUgPSAncGllJyxcbn1cblxuLyoqXG4gKiBQcm9wZXJ0aWVzIGZvciBhIEdhdWdlV2lkZ2V0XG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgR2F1Z2VXaWRnZXRQcm9wcyBleHRlbmRzIE1ldHJpY1dpZGdldFByb3BzIHtcbiAgLyoqXG4gICAqIE1ldHJpY3MgdG8gZGlzcGxheSBvbiBsZWZ0IFkgYXhpc1xuICAgKlxuICAgKiBAZGVmYXVsdCAtIE5vIG1ldHJpY3NcbiAgICovXG4gIHJlYWRvbmx5IG1ldHJpY3M/OiBJTWV0cmljW107XG5cbiAgLyoqXG4gICAqIEFubm90YXRpb25zIGZvciB0aGUgbGVmdCBZIGF4aXNcbiAgICpcbiAgICogQGRlZmF1bHQgLSBObyBhbm5vdGF0aW9uc1xuICAgKi9cbiAgcmVhZG9ubHkgYW5ub3RhdGlvbnM/OiBIb3Jpem9udGFsQW5ub3RhdGlvbltdO1xuXG4gIC8qKlxuICAgKiBMZWZ0IFkgYXhpc1xuICAgKlxuICAgKiBAZGVmYXVsdCAtIE5vbmVcbiAgICovXG4gIHJlYWRvbmx5IGxlZnRZQXhpcz86IFlBeGlzUHJvcHM7XG5cbiAgLyoqXG4gICAqIFBvc2l0aW9uIG9mIHRoZSBsZWdlbmRcbiAgICpcbiAgICogQGRlZmF1bHQgLSBib3R0b21cbiAgICovXG4gIHJlYWRvbmx5IGxlZ2VuZFBvc2l0aW9uPzogTGVnZW5kUG9zaXRpb247XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdGhlIGdyYXBoIHNob3VsZCBzaG93IGxpdmUgZGF0YVxuICAgKlxuICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgKi9cbiAgcmVhZG9ubHkgbGl2ZURhdGE/OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRvIHNob3cgdGhlIHZhbHVlIGZyb20gdGhlIGVudGlyZSB0aW1lIHJhbmdlLiBPbmx5IGFwcGxpY2FibGUgZm9yIEJhciBhbmQgUGllIGNoYXJ0cy5cbiAgICpcbiAgICogSWYgZmFsc2UsIHZhbHVlcyB3aWxsIGJlIGZyb20gdGhlIG1vc3QgcmVjZW50IHBlcmlvZCBvZiB5b3VyIGNob3NlbiB0aW1lIHJhbmdlO1xuICAgKiBpZiB0cnVlLCBzaG93cyB0aGUgdmFsdWUgZnJvbSB0aGUgZW50aXJlIHRpbWUgcmFuZ2UuXG4gICAqXG4gICAqIEBkZWZhdWx0IGZhbHNlXG4gICAqL1xuICByZWFkb25seSBzZXRQZXJpb2RUb1RpbWVSYW5nZT86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIFRoZSBkZWZhdWx0IHBlcmlvZCBmb3IgYWxsIG1ldHJpY3MgaW4gdGhpcyB3aWRnZXQuXG4gICAqIFRoZSBwZXJpb2QgaXMgdGhlIGxlbmd0aCBvZiB0aW1lIHJlcHJlc2VudGVkIGJ5IG9uZSBkYXRhIHBvaW50IG9uIHRoZSBncmFwaC5cbiAgICogVGhpcyBkZWZhdWx0IGNhbiBiZSBvdmVycmlkZGVuIHdpdGhpbiBlYWNoIG1ldHJpYyBkZWZpbml0aW9uLlxuICAgKlxuICAgKiBAZGVmYXVsdCBjZGsuRHVyYXRpb24uc2Vjb25kcygzMDApXG4gICAqL1xuICByZWFkb25seSBwZXJpb2Q/OiBjZGsuRHVyYXRpb247XG5cbiAgLyoqXG4gICAqIFRoZSBkZWZhdWx0IHN0YXRpc3RpYyB0byBiZSBkaXNwbGF5ZWQgZm9yIGVhY2ggbWV0cmljLlxuICAgKiBUaGlzIGRlZmF1bHQgY2FuIGJlIG92ZXJyaWRkZW4gd2l0aGluIHRoZSBkZWZpbml0aW9uIG9mIGVhY2ggaW5kaXZpZHVhbCBtZXRyaWNcbiAgICpcbiAgICogQGRlZmF1bHQgLSBUaGUgc3RhdGlzdGljIGZvciBlYWNoIG1ldHJpYyBpcyB1c2VkXG4gICAqL1xuICByZWFkb25seSBzdGF0aXN0aWM/OiBzdHJpbmc7XG59XG5cbi8qKlxuICogQSBkYXNoYm9hcmQgZ2F1Z2Ugd2lkZ2V0IHRoYXQgZGlzcGxheXMgbWV0cmljc1xuICovXG5leHBvcnQgY2xhc3MgR2F1Z2VXaWRnZXQgZXh0ZW5kcyBDb25jcmV0ZVdpZGdldCB7XG5cbiAgcHJpdmF0ZSByZWFkb25seSBwcm9wczogR2F1Z2VXaWRnZXRQcm9wcztcblxuICBwcml2YXRlIHJlYWRvbmx5IG1ldHJpY3M6IElNZXRyaWNbXTtcblxuICBjb25zdHJ1Y3Rvcihwcm9wczogR2F1Z2VXaWRnZXRQcm9wcykge1xuICAgIHN1cGVyKHByb3BzLndpZHRoIHx8IDYsIHByb3BzLmhlaWdodCB8fCA2KTtcbiAgICB0aGlzLnByb3BzID0gcHJvcHM7XG4gICAgdGhpcy5tZXRyaWNzID0gcHJvcHMubWV0cmljcyA/PyBbXTtcbiAgICB0aGlzLmNvcHlNZXRyaWNXYXJuaW5ncyguLi50aGlzLm1ldHJpY3MpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBhbm90aGVyIG1ldHJpYyB0byB0aGUgbGVmdCBZIGF4aXMgb2YgdGhlIEdhdWdlV2lkZ2V0XG4gICAqXG4gICAqIEBwYXJhbSBtZXRyaWMgdGhlIG1ldHJpYyB0byBhZGRcbiAgICovXG4gIHB1YmxpYyBhZGRNZXRyaWMobWV0cmljOiBJTWV0cmljKSB7XG4gICAgdGhpcy5tZXRyaWNzLnB1c2gobWV0cmljKTtcbiAgICB0aGlzLmNvcHlNZXRyaWNXYXJuaW5ncyhtZXRyaWMpO1xuICB9XG5cbiAgcHVibGljIHRvSnNvbigpOiBhbnlbXSB7XG4gICAgY29uc3QgaG9yaXpvbnRhbEFubm90YXRpb25zID0gW1xuICAgICAgLi4uKHRoaXMucHJvcHMuYW5ub3RhdGlvbnMgfHwgW10pLm1hcChtYXBBbm5vdGF0aW9uKCdhbm5vdGF0aW9ucycpKSxcbiAgICBdO1xuXG4gICAgY29uc3QgbWV0cmljcyA9IGFsbE1ldHJpY3NHcmFwaEpzb24odGhpcy5tZXRyaWNzLCBbXSk7XG4gICAgY29uc3QgbGVmdFlBeGlzID0ge1xuICAgICAgLi4udGhpcy5wcm9wcy5sZWZ0WUF4aXMsXG4gICAgICBtaW46IHRoaXMucHJvcHMubGVmdFlBeGlzPy5taW4gPz8gMCxcbiAgICAgIG1heDogdGhpcy5wcm9wcy5sZWZ0WUF4aXM/Lm1heCA/PyAxMDAsXG4gICAgfTtcbiAgICByZXR1cm4gW3tcbiAgICAgIHR5cGU6ICdtZXRyaWMnLFxuICAgICAgd2lkdGg6IHRoaXMud2lkdGgsXG4gICAgICBoZWlnaHQ6IHRoaXMuaGVpZ2h0LFxuICAgICAgeDogdGhpcy54LFxuICAgICAgeTogdGhpcy55LFxuICAgICAgcHJvcGVydGllczoge1xuICAgICAgICB2aWV3OiAnZ2F1Z2UnLFxuICAgICAgICB0aXRsZTogdGhpcy5wcm9wcy50aXRsZSxcbiAgICAgICAgcmVnaW9uOiB0aGlzLnByb3BzLnJlZ2lvbiB8fCBjZGsuQXdzLlJFR0lPTixcbiAgICAgICAgbWV0cmljczogbWV0cmljcy5sZW5ndGggPiAwID8gbWV0cmljcyA6IHVuZGVmaW5lZCxcbiAgICAgICAgYW5ub3RhdGlvbnM6IGhvcml6b250YWxBbm5vdGF0aW9ucy5sZW5ndGggPiAwID8geyBob3Jpem9udGFsOiBob3Jpem9udGFsQW5ub3RhdGlvbnMgfSA6IHVuZGVmaW5lZCxcbiAgICAgICAgeUF4aXM6IHtcbiAgICAgICAgICBsZWZ0OiBsZWZ0WUF4aXMgPz8gdW5kZWZpbmVkLFxuICAgICAgICB9LFxuICAgICAgICBsZWdlbmQ6IHRoaXMucHJvcHMubGVnZW5kUG9zaXRpb24gIT09IHVuZGVmaW5lZCA/IHsgcG9zaXRpb246IHRoaXMucHJvcHMubGVnZW5kUG9zaXRpb24gfSA6IHVuZGVmaW5lZCxcbiAgICAgICAgbGl2ZURhdGE6IHRoaXMucHJvcHMubGl2ZURhdGEsXG4gICAgICAgIHNldFBlcmlvZFRvVGltZVJhbmdlOiB0aGlzLnByb3BzLnNldFBlcmlvZFRvVGltZVJhbmdlLFxuICAgICAgICBwZXJpb2Q6IHRoaXMucHJvcHMucGVyaW9kPy50b1NlY29uZHMoKSxcbiAgICAgICAgc3RhdDogdGhpcy5wcm9wcy5zdGF0aXN0aWMsXG4gICAgICB9LFxuICAgIH1dO1xuICB9XG59XG5cbi8qKlxuICogUHJvcGVydGllcyBmb3IgYSBHcmFwaFdpZGdldFxuICovXG5leHBvcnQgaW50ZXJmYWNlIEdyYXBoV2lkZ2V0UHJvcHMgZXh0ZW5kcyBNZXRyaWNXaWRnZXRQcm9wcyB7XG4gIC8qKlxuICAgKiBNZXRyaWNzIHRvIGRpc3BsYXkgb24gbGVmdCBZIGF4aXNcbiAgICpcbiAgICogQGRlZmF1bHQgLSBObyBtZXRyaWNzXG4gICAqL1xuICByZWFkb25seSBsZWZ0PzogSU1ldHJpY1tdO1xuXG4gIC8qKlxuICAgKiBNZXRyaWNzIHRvIGRpc3BsYXkgb24gcmlnaHQgWSBheGlzXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gTm8gbWV0cmljc1xuICAgKi9cbiAgcmVhZG9ubHkgcmlnaHQ/OiBJTWV0cmljW107XG5cbiAgLyoqXG4gICAqIEFubm90YXRpb25zIGZvciB0aGUgbGVmdCBZIGF4aXNcbiAgICpcbiAgICogQGRlZmF1bHQgLSBObyBhbm5vdGF0aW9uc1xuICAgKi9cbiAgcmVhZG9ubHkgbGVmdEFubm90YXRpb25zPzogSG9yaXpvbnRhbEFubm90YXRpb25bXTtcblxuICAvKipcbiAgICogQW5ub3RhdGlvbnMgZm9yIHRoZSByaWdodCBZIGF4aXNcbiAgICpcbiAgICogQGRlZmF1bHQgLSBObyBhbm5vdGF0aW9uc1xuICAgKi9cbiAgcmVhZG9ubHkgcmlnaHRBbm5vdGF0aW9ucz86IEhvcml6b250YWxBbm5vdGF0aW9uW107XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdGhlIGdyYXBoIHNob3VsZCBiZSBzaG93biBhcyBzdGFja2VkIGxpbmVzXG4gICAqXG4gICAqIEBkZWZhdWx0IGZhbHNlXG4gICAqL1xuICByZWFkb25seSBzdGFja2VkPzogYm9vbGVhbjtcblxuICAvKipcbiAgICogTGVmdCBZIGF4aXNcbiAgICpcbiAgICogQGRlZmF1bHQgLSBOb25lXG4gICAqL1xuICByZWFkb25seSBsZWZ0WUF4aXM/OiBZQXhpc1Byb3BzO1xuXG4gIC8qKlxuICAgKiBSaWdodCBZIGF4aXNcbiAgICpcbiAgICogQGRlZmF1bHQgLSBOb25lXG4gICAqL1xuICByZWFkb25seSByaWdodFlBeGlzPzogWUF4aXNQcm9wcztcblxuICAvKipcbiAgICogUG9zaXRpb24gb2YgdGhlIGxlZ2VuZFxuICAgKlxuICAgKiBAZGVmYXVsdCAtIGJvdHRvbVxuICAgKi9cbiAgcmVhZG9ubHkgbGVnZW5kUG9zaXRpb24/OiBMZWdlbmRQb3NpdGlvbjtcblxuICAvKipcbiAgICogV2hldGhlciB0aGUgZ3JhcGggc2hvdWxkIHNob3cgbGl2ZSBkYXRhXG4gICAqXG4gICAqIEBkZWZhdWx0IGZhbHNlXG4gICAqL1xuICByZWFkb25seSBsaXZlRGF0YT86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIERpc3BsYXkgdGhpcyBtZXRyaWNcbiAgICpcbiAgICogQGRlZmF1bHQgVGltZVNlcmllc1xuICAgKi9cbiAgcmVhZG9ubHkgdmlldz86IEdyYXBoV2lkZ2V0VmlldztcblxuICAvKipcbiAgICogV2hldGhlciB0byBzaG93IHRoZSB2YWx1ZSBmcm9tIHRoZSBlbnRpcmUgdGltZSByYW5nZS4gT25seSBhcHBsaWNhYmxlIGZvciBCYXIgYW5kIFBpZSBjaGFydHMuXG4gICAqXG4gICAqIElmIGZhbHNlLCB2YWx1ZXMgd2lsbCBiZSBmcm9tIHRoZSBtb3N0IHJlY2VudCBwZXJpb2Qgb2YgeW91ciBjaG9zZW4gdGltZSByYW5nZTtcbiAgICogaWYgdHJ1ZSwgc2hvd3MgdGhlIHZhbHVlIGZyb20gdGhlIGVudGlyZSB0aW1lIHJhbmdlLlxuICAgKlxuICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgKi9cbiAgcmVhZG9ubHkgc2V0UGVyaW9kVG9UaW1lUmFuZ2U/OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBUaGUgZGVmYXVsdCBwZXJpb2QgZm9yIGFsbCBtZXRyaWNzIGluIHRoaXMgd2lkZ2V0LlxuICAgKiBUaGUgcGVyaW9kIGlzIHRoZSBsZW5ndGggb2YgdGltZSByZXByZXNlbnRlZCBieSBvbmUgZGF0YSBwb2ludCBvbiB0aGUgZ3JhcGguXG4gICAqIFRoaXMgZGVmYXVsdCBjYW4gYmUgb3ZlcnJpZGRlbiB3aXRoaW4gZWFjaCBtZXRyaWMgZGVmaW5pdGlvbi5cbiAgICpcbiAgICogQGRlZmF1bHQgY2RrLkR1cmF0aW9uLnNlY29uZHMoMzAwKVxuICAgKi9cbiAgcmVhZG9ubHkgcGVyaW9kPzogY2RrLkR1cmF0aW9uO1xuXG4gIC8qKlxuICAgKiBUaGUgZGVmYXVsdCBzdGF0aXN0aWMgdG8gYmUgZGlzcGxheWVkIGZvciBlYWNoIG1ldHJpYy5cbiAgICogVGhpcyBkZWZhdWx0IGNhbiBiZSBvdmVycmlkZGVuIHdpdGhpbiB0aGUgZGVmaW5pdGlvbiBvZiBlYWNoIGluZGl2aWR1YWwgbWV0cmljXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gVGhlIHN0YXRpc3RpYyBmb3IgZWFjaCBtZXRyaWMgaXMgdXNlZFxuICAgKi9cbiAgcmVhZG9ubHkgc3RhdGlzdGljPzogc3RyaW5nO1xufVxuXG4vKipcbiAqIEEgZGFzaGJvYXJkIHdpZGdldCB0aGF0IGRpc3BsYXlzIG1ldHJpY3NcbiAqL1xuZXhwb3J0IGNsYXNzIEdyYXBoV2lkZ2V0IGV4dGVuZHMgQ29uY3JldGVXaWRnZXQge1xuXG4gIHByaXZhdGUgcmVhZG9ubHkgcHJvcHM6IEdyYXBoV2lkZ2V0UHJvcHM7XG5cbiAgcHJpdmF0ZSByZWFkb25seSBsZWZ0TWV0cmljczogSU1ldHJpY1tdO1xuICBwcml2YXRlIHJlYWRvbmx5IHJpZ2h0TWV0cmljczogSU1ldHJpY1tdO1xuXG4gIGNvbnN0cnVjdG9yKHByb3BzOiBHcmFwaFdpZGdldFByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMud2lkdGggfHwgNiwgcHJvcHMuaGVpZ2h0IHx8IDYpO1xuICAgIHRoaXMucHJvcHMgPSBwcm9wcztcbiAgICB0aGlzLmxlZnRNZXRyaWNzID0gcHJvcHMubGVmdCA/PyBbXTtcbiAgICB0aGlzLnJpZ2h0TWV0cmljcyA9IHByb3BzLnJpZ2h0ID8/IFtdO1xuICAgIHRoaXMuY29weU1ldHJpY1dhcm5pbmdzKC4uLnRoaXMubGVmdE1ldHJpY3MsIC4uLnRoaXMucmlnaHRNZXRyaWNzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgYW5vdGhlciBtZXRyaWMgdG8gdGhlIGxlZnQgWSBheGlzIG9mIHRoZSBHcmFwaFdpZGdldFxuICAgKlxuICAgKiBAcGFyYW0gbWV0cmljIHRoZSBtZXRyaWMgdG8gYWRkXG4gICAqL1xuICBwdWJsaWMgYWRkTGVmdE1ldHJpYyhtZXRyaWM6IElNZXRyaWMpIHtcbiAgICB0aGlzLmxlZnRNZXRyaWNzLnB1c2gobWV0cmljKTtcbiAgICB0aGlzLmNvcHlNZXRyaWNXYXJuaW5ncyhtZXRyaWMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBhbm90aGVyIG1ldHJpYyB0byB0aGUgcmlnaHQgWSBheGlzIG9mIHRoZSBHcmFwaFdpZGdldFxuICAgKlxuICAgKiBAcGFyYW0gbWV0cmljIHRoZSBtZXRyaWMgdG8gYWRkXG4gICAqL1xuICBwdWJsaWMgYWRkUmlnaHRNZXRyaWMobWV0cmljOiBJTWV0cmljKSB7XG4gICAgdGhpcy5yaWdodE1ldHJpY3MucHVzaChtZXRyaWMpO1xuICAgIHRoaXMuY29weU1ldHJpY1dhcm5pbmdzKG1ldHJpYyk7XG4gIH1cblxuICBwdWJsaWMgdG9Kc29uKCk6IGFueVtdIHtcbiAgICBjb25zdCBob3Jpem9udGFsQW5ub3RhdGlvbnMgPSBbXG4gICAgICAuLi4odGhpcy5wcm9wcy5sZWZ0QW5ub3RhdGlvbnMgfHwgW10pLm1hcChtYXBBbm5vdGF0aW9uKCdsZWZ0JykpLFxuICAgICAgLi4uKHRoaXMucHJvcHMucmlnaHRBbm5vdGF0aW9ucyB8fCBbXSkubWFwKG1hcEFubm90YXRpb24oJ3JpZ2h0JykpLFxuICAgIF07XG5cbiAgICBjb25zdCBtZXRyaWNzID0gYWxsTWV0cmljc0dyYXBoSnNvbih0aGlzLmxlZnRNZXRyaWNzLCB0aGlzLnJpZ2h0TWV0cmljcyk7XG4gICAgcmV0dXJuIFt7XG4gICAgICB0eXBlOiAnbWV0cmljJyxcbiAgICAgIHdpZHRoOiB0aGlzLndpZHRoLFxuICAgICAgaGVpZ2h0OiB0aGlzLmhlaWdodCxcbiAgICAgIHg6IHRoaXMueCxcbiAgICAgIHk6IHRoaXMueSxcbiAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgdmlldzogdGhpcy5wcm9wcy52aWV3ID8/IEdyYXBoV2lkZ2V0Vmlldy5USU1FX1NFUklFUyxcbiAgICAgICAgdGl0bGU6IHRoaXMucHJvcHMudGl0bGUsXG4gICAgICAgIHJlZ2lvbjogdGhpcy5wcm9wcy5yZWdpb24gfHwgY2RrLkF3cy5SRUdJT04sXG4gICAgICAgIHN0YWNrZWQ6IHRoaXMucHJvcHMuc3RhY2tlZCxcbiAgICAgICAgbWV0cmljczogbWV0cmljcy5sZW5ndGggPiAwID8gbWV0cmljcyA6IHVuZGVmaW5lZCxcbiAgICAgICAgYW5ub3RhdGlvbnM6IGhvcml6b250YWxBbm5vdGF0aW9ucy5sZW5ndGggPiAwID8geyBob3Jpem9udGFsOiBob3Jpem9udGFsQW5ub3RhdGlvbnMgfSA6IHVuZGVmaW5lZCxcbiAgICAgICAgeUF4aXM6IHtcbiAgICAgICAgICBsZWZ0OiB0aGlzLnByb3BzLmxlZnRZQXhpcyA/PyB1bmRlZmluZWQsXG4gICAgICAgICAgcmlnaHQ6IHRoaXMucHJvcHMucmlnaHRZQXhpcyA/PyB1bmRlZmluZWQsXG4gICAgICAgIH0sXG4gICAgICAgIGxlZ2VuZDogdGhpcy5wcm9wcy5sZWdlbmRQb3NpdGlvbiAhPT0gdW5kZWZpbmVkID8geyBwb3NpdGlvbjogdGhpcy5wcm9wcy5sZWdlbmRQb3NpdGlvbiB9IDogdW5kZWZpbmVkLFxuICAgICAgICBsaXZlRGF0YTogdGhpcy5wcm9wcy5saXZlRGF0YSxcbiAgICAgICAgc2V0UGVyaW9kVG9UaW1lUmFuZ2U6IHRoaXMucHJvcHMuc2V0UGVyaW9kVG9UaW1lUmFuZ2UsXG4gICAgICAgIHBlcmlvZDogdGhpcy5wcm9wcy5wZXJpb2Q/LnRvU2Vjb25kcygpLFxuICAgICAgICBzdGF0OiB0aGlzLnByb3BzLnN0YXRpc3RpYyxcbiAgICAgIH0sXG4gICAgfV07XG4gIH1cbn1cblxuLyoqXG4gKiBQcm9wZXJ0aWVzIGZvciBhIFNpbmdsZVZhbHVlV2lkZ2V0XG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgU2luZ2xlVmFsdWVXaWRnZXRQcm9wcyBleHRlbmRzIE1ldHJpY1dpZGdldFByb3BzIHtcbiAgLyoqXG4gICAqIE1ldHJpY3MgdG8gZGlzcGxheVxuICAgKi9cbiAgcmVhZG9ubHkgbWV0cmljczogSU1ldHJpY1tdO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRvIHNob3cgdGhlIHZhbHVlIGZyb20gdGhlIGVudGlyZSB0aW1lIHJhbmdlLlxuICAgKlxuICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgKi9cbiAgcmVhZG9ubHkgc2V0UGVyaW9kVG9UaW1lUmFuZ2U/OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRvIHNob3cgYXMgbWFueSBkaWdpdHMgYXMgY2FuIGZpdCwgYmVmb3JlIHJvdW5kaW5nLlxuICAgKlxuICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgKi9cbiAgcmVhZG9ubHkgZnVsbFByZWNpc2lvbj86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdG8gc2hvdyBhIGdyYXBoIGJlbG93IHRoZSB2YWx1ZSBpbGx1c3RyYXRpbmcgdGhlIHZhbHVlIGZvciB0aGUgd2hvbGUgdGltZSByYW5nZS5cbiAgICogQ2Fubm90IGJlIHVzZWQgaW4gY29tYmluYXRpb24gd2l0aCBgc2V0UGVyaW9kVG9UaW1lUmFuZ2VgXG4gICAqXG4gICAqIEBkZWZhdWx0IGZhbHNlXG4gICAqL1xuICByZWFkb25seSBzcGFya2xpbmU/OiBib29sZWFuO1xufVxuXG4vKipcbiAqIEEgZGFzaGJvYXJkIHdpZGdldCB0aGF0IGRpc3BsYXlzIHRoZSBtb3N0IHJlY2VudCB2YWx1ZSBmb3IgZXZlcnkgbWV0cmljXG4gKi9cbmV4cG9ydCBjbGFzcyBTaW5nbGVWYWx1ZVdpZGdldCBleHRlbmRzIENvbmNyZXRlV2lkZ2V0IHtcbiAgcHJpdmF0ZSByZWFkb25seSBwcm9wczogU2luZ2xlVmFsdWVXaWRnZXRQcm9wcztcblxuICBjb25zdHJ1Y3Rvcihwcm9wczogU2luZ2xlVmFsdWVXaWRnZXRQcm9wcykge1xuICAgIHN1cGVyKHByb3BzLndpZHRoIHx8IDYsIHByb3BzLmhlaWdodCB8fCAzKTtcbiAgICB0aGlzLnByb3BzID0gcHJvcHM7XG4gICAgdGhpcy5jb3B5TWV0cmljV2FybmluZ3MoLi4ucHJvcHMubWV0cmljcyk7XG5cbiAgICBpZiAocHJvcHMuc2V0UGVyaW9kVG9UaW1lUmFuZ2UgJiYgcHJvcHMuc3BhcmtsaW5lKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1lvdSBjYW5ub3QgdXNlIHNldFBlcmlvZFRvVGltZVJhbmdlIHdpdGggc3BhcmtsaW5lJyk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIHRvSnNvbigpOiBhbnlbXSB7XG4gICAgcmV0dXJuIFt7XG4gICAgICB0eXBlOiAnbWV0cmljJyxcbiAgICAgIHdpZHRoOiB0aGlzLndpZHRoLFxuICAgICAgaGVpZ2h0OiB0aGlzLmhlaWdodCxcbiAgICAgIHg6IHRoaXMueCxcbiAgICAgIHk6IHRoaXMueSxcbiAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgdmlldzogJ3NpbmdsZVZhbHVlJyxcbiAgICAgICAgdGl0bGU6IHRoaXMucHJvcHMudGl0bGUsXG4gICAgICAgIHJlZ2lvbjogdGhpcy5wcm9wcy5yZWdpb24gfHwgY2RrLkF3cy5SRUdJT04sXG4gICAgICAgIHNwYXJrbGluZTogdGhpcy5wcm9wcy5zcGFya2xpbmUsXG4gICAgICAgIG1ldHJpY3M6IGFsbE1ldHJpY3NHcmFwaEpzb24odGhpcy5wcm9wcy5tZXRyaWNzLCBbXSksXG4gICAgICAgIHNldFBlcmlvZFRvVGltZVJhbmdlOiB0aGlzLnByb3BzLnNldFBlcmlvZFRvVGltZVJhbmdlLFxuICAgICAgICBzaW5nbGVWYWx1ZUZ1bGxQcmVjaXNpb246IHRoaXMucHJvcHMuZnVsbFByZWNpc2lvbixcbiAgICAgIH0sXG4gICAgfV07XG4gIH1cbn1cblxuLyoqXG4gKiBUaGUgcHJvcGVydGllcyBmb3IgYSBDdXN0b21XaWRnZXRcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBDdXN0b21XaWRnZXRQcm9wcyB7XG4gIC8qKlxuICAgKiBUaGUgQXJuIG9mIHRoZSBBV1MgTGFtYmRhIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyBIVE1MIG9yIEpTT04gdGhhdCB3aWxsIGJlIGRpc3BsYXllZCBpbiB0aGUgd2lkZ2V0XG4gICAqL1xuICByZWFkb25seSBmdW5jdGlvbkFybjogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBXaWR0aCBvZiB0aGUgd2lkZ2V0LCBpbiBhIGdyaWQgb2YgMjQgdW5pdHMgd2lkZVxuICAgKlxuICAgKiBAZGVmYXVsdCA2XG4gICAqL1xuICByZWFkb25seSB3aWR0aD86IG51bWJlcjtcblxuICAvKipcbiAgICogSGVpZ2h0IG9mIHRoZSB3aWRnZXRcbiAgICpcbiAgICogQGRlZmF1bHQgLSA2IGZvciBBbGFybSBhbmQgR3JhcGggd2lkZ2V0cy5cbiAgICogICAzIGZvciBzaW5nbGUgdmFsdWUgd2lkZ2V0cyB3aGVyZSBtb3N0IHJlY2VudCB2YWx1ZSBvZiBhIG1ldHJpYyBpcyBkaXNwbGF5ZWQuXG4gICAqL1xuICByZWFkb25seSBoZWlnaHQ/OiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIFRoZSB0aXRsZSBvZiB0aGUgd2lkZ2V0XG4gICAqL1xuICByZWFkb25seSB0aXRsZTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBVcGRhdGUgdGhlIHdpZGdldCBvbiByZWZyZXNoXG4gICAqXG4gICAqIEBkZWZhdWx0IHRydWVcbiAgICovXG4gIHJlYWRvbmx5IHVwZGF0ZU9uUmVmcmVzaD86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIFVwZGF0ZSB0aGUgd2lkZ2V0IG9uIHJlc2l6ZVxuICAgKlxuICAgKiBAZGVmYXVsdCB0cnVlXG4gICAqL1xuICByZWFkb25seSB1cGRhdGVPblJlc2l6ZT86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIFVwZGF0ZSB0aGUgd2lkZ2V0IG9uIHRpbWUgcmFuZ2UgY2hhbmdlXG4gICAqXG4gICAqIEBkZWZhdWx0IHRydWVcbiAgICovXG4gIHJlYWRvbmx5IHVwZGF0ZU9uVGltZVJhbmdlQ2hhbmdlPzogYm9vbGVhbjtcblxuICAvKipcbiAgICogUGFyYW1ldGVycyBwYXNzZWQgdG8gdGhlIGxhbWJkYSBmdW5jdGlvblxuICAgKlxuICAgKiBAZGVmYXVsdCAtIG5vIHBhcmFtZXRlcnMgYXJlIHBhc3NlZCB0byB0aGUgbGFtYmRhIGZ1bmN0aW9uXG4gICAqL1xuICByZWFkb25seSBwYXJhbXM/OiBhbnk7XG59XG5cbi8qKlxuICogQSBDdXN0b21XaWRnZXQgc2hvd3MgdGhlIHJlc3VsdCBvZiBhIEFXUyBsYW1iZGEgZnVuY3Rpb25cbiAqL1xuZXhwb3J0IGNsYXNzIEN1c3RvbVdpZGdldCBleHRlbmRzIENvbmNyZXRlV2lkZ2V0IHtcblxuICBwcml2YXRlIHJlYWRvbmx5IHByb3BzOiBDdXN0b21XaWRnZXRQcm9wcztcblxuICBwdWJsaWMgY29uc3RydWN0b3IocHJvcHM6IEN1c3RvbVdpZGdldFByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMud2lkdGggPz8gNiwgcHJvcHMuaGVpZ2h0ID8/IDYpO1xuICAgIHRoaXMucHJvcHMgPSBwcm9wcztcbiAgfVxuXG4gIHB1YmxpYyB0b0pzb24oKTogYW55W10ge1xuICAgIHJldHVybiBbe1xuICAgICAgdHlwZTogJ2N1c3RvbScsXG4gICAgICB3aWR0aDogdGhpcy53aWR0aCxcbiAgICAgIGhlaWdodDogdGhpcy5oZWlnaHQsXG4gICAgICB4OiB0aGlzLngsXG4gICAgICB5OiB0aGlzLnksXG4gICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIGVuZHBvaW50OiB0aGlzLnByb3BzLmZ1bmN0aW9uQXJuLFxuICAgICAgICBwYXJhbXM6IHRoaXMucHJvcHMucGFyYW1zLFxuICAgICAgICB0aXRsZTogdGhpcy5wcm9wcy50aXRsZSxcbiAgICAgICAgdXBkYXRlT246IHtcbiAgICAgICAgICByZWZyZXNoOiB0aGlzLnByb3BzLnVwZGF0ZU9uUmVmcmVzaCA/PyB0cnVlLFxuICAgICAgICAgIHJlc2l6ZTogdGhpcy5wcm9wcy51cGRhdGVPblJlc2l6ZSA/PyB0cnVlLFxuICAgICAgICAgIHRpbWVSYW5nZTogdGhpcy5wcm9wcy51cGRhdGVPblRpbWVSYW5nZUNoYW5nZSA/PyB0cnVlLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9XTtcbiAgfVxufVxuXG4vKipcbiAqIEhvcml6b250YWwgYW5ub3RhdGlvbiB0byBiZSBhZGRlZCB0byBhIGdyYXBoXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgSG9yaXpvbnRhbEFubm90YXRpb24ge1xuICAvKipcbiAgICogVGhlIHZhbHVlIG9mIHRoZSBhbm5vdGF0aW9uXG4gICAqL1xuICByZWFkb25seSB2YWx1ZTogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBMYWJlbCBmb3IgdGhlIGFubm90YXRpb25cbiAgICpcbiAgICogQGRlZmF1bHQgLSBObyBsYWJlbFxuICAgKi9cbiAgcmVhZG9ubHkgbGFiZWw/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBoZXggY29sb3IgY29kZSwgcHJlZml4ZWQgd2l0aCAnIycgKGUuZy4gJyMwMGZmMDAnKSwgdG8gYmUgdXNlZCBmb3IgdGhlIGFubm90YXRpb24uXG4gICAqIFRoZSBgQ29sb3JgIGNsYXNzIGhhcyBhIHNldCBvZiBzdGFuZGFyZCBjb2xvcnMgdGhhdCBjYW4gYmUgdXNlZCBoZXJlLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIEF1dG9tYXRpYyBjb2xvclxuICAgKi9cbiAgcmVhZG9ubHkgY29sb3I/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIEFkZCBzaGFkaW5nIGFib3ZlIG9yIGJlbG93IHRoZSBhbm5vdGF0aW9uXG4gICAqXG4gICAqIEBkZWZhdWx0IE5vIHNoYWRpbmdcbiAgICovXG4gIHJlYWRvbmx5IGZpbGw/OiBTaGFkaW5nO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRoZSBhbm5vdGF0aW9uIGlzIHZpc2libGVcbiAgICpcbiAgICogQGRlZmF1bHQgdHJ1ZVxuICAgKi9cbiAgcmVhZG9ubHkgdmlzaWJsZT86IGJvb2xlYW47XG59XG5cbi8qKlxuICogRmlsbCBzaGFkaW5nIG9wdGlvbnMgdGhhdCB3aWxsIGJlIHVzZWQgd2l0aCBhbiBhbm5vdGF0aW9uXG4gKi9cbmV4cG9ydCBlbnVtIFNoYWRpbmcge1xuICAvKipcbiAgICogRG9uJ3QgYWRkIHNoYWRpbmdcbiAgICovXG4gIE5PTkUgPSAnbm9uZScsXG5cbiAgLyoqXG4gICAqIEFkZCBzaGFkaW5nIGFib3ZlIHRoZSBhbm5vdGF0aW9uXG4gICAqL1xuICBBQk9WRSA9ICdhYm92ZScsXG5cbiAgLyoqXG4gICAqIEFkZCBzaGFkaW5nIGJlbG93IHRoZSBhbm5vdGF0aW9uXG4gICAqL1xuICBCRUxPVyA9ICdiZWxvdydcbn1cblxuLyoqXG4gKiBBIHNldCBvZiBzdGFuZGFyZCBjb2xvdXJzIHRoYXQgY2FuIGJlIHVzZWQgaW4gYW5ub3RhdGlvbnMgaW4gYSBHcmFwaFdpZGdldC5cbiAqL1xuZXhwb3J0IGNsYXNzIENvbG9yIHtcbiAgLyoqIGJsdWUgLSBoZXggIzFmNzdiNCAqL1xuICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IEJMVUUgPSAnIzFmNzdiNCc7XG5cbiAgLyoqIGJyb3duIC0gaGV4ICM4YzU2NGIgKi9cbiAgcHVibGljIHN0YXRpYyByZWFkb25seSBCUk9XTiA9ICcjOGM1NjRiJztcblxuICAvKiogZ3JlZW4gLSBoZXggIzJjYTAyYyAqL1xuICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IEdSRUVOID0gJyMyY2EwMmMnO1xuXG4gIC8qKiBncmV5IC0gaGV4ICM3ZjdmN2YgKi9cbiAgcHVibGljIHN0YXRpYyByZWFkb25seSBHUkVZID0gJyM3ZjdmN2YnO1xuXG4gIC8qKiBvcmFuZ2UgLSBoZXggI2ZmN2YwZSAqL1xuICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IE9SQU5HRSA9ICcjZmY3ZjBlJztcblxuICAvKiogcGluayAtIGhleCAjZTM3N2MyICovXG4gIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgUElOSyA9ICcjZTM3N2MyJztcblxuICAvKiogcHVycGxlIC0gaGV4ICM5NDY3YmQgKi9cbiAgcHVibGljIHN0YXRpYyByZWFkb25seSBQVVJQTEUgPSAnIzk0NjdiZCc7XG5cbiAgLyoqIHJlZCAtIGhleCAjZDYyNzI4ICovXG4gIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgUkVEID0gJyNkNjI3MjgnO1xuXG4gIHByaXZhdGUgY29uc3RydWN0b3IoKSB7fVxufVxuXG4vKipcbiAqIFRoZSBwb3NpdGlvbiBvZiB0aGUgbGVnZW5kIG9uIGEgR3JhcGhXaWRnZXQuXG4gKi9cbmV4cG9ydCBlbnVtIExlZ2VuZFBvc2l0aW9uIHtcbiAgLyoqXG4gICAqIExlZ2VuZCBhcHBlYXJzIGJlbG93IHRoZSBncmFwaCAoZGVmYXVsdCkuXG4gICAqL1xuICBCT1RUT00gPSAnYm90dG9tJyxcblxuICAvKipcbiAgICogQWRkIHNoYWRpbmcgYWJvdmUgdGhlIGFubm90YXRpb25cbiAgICovXG4gIFJJR0hUID0gJ3JpZ2h0JyxcblxuICAvKipcbiAgICogQWRkIHNoYWRpbmcgYmVsb3cgdGhlIGFubm90YXRpb25cbiAgICovXG4gIEhJRERFTiA9ICdoaWRkZW4nXG59XG5cbmZ1bmN0aW9uIG1hcEFubm90YXRpb24oeUF4aXM6IHN0cmluZyk6ICgoeDogSG9yaXpvbnRhbEFubm90YXRpb24pID0+IGFueSkge1xuICByZXR1cm4gKGE6IEhvcml6b250YWxBbm5vdGF0aW9uKSA9PiB7XG4gICAgcmV0dXJuIHsgLi4uYSwgeUF4aXMgfTtcbiAgfTtcbn1cbiJdfQ==