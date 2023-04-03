function _aws_cdk_aws_cloudwatch_AlarmProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.metric))
            _aws_cdk_aws_cloudwatch_IMetric(p.metric);
        if (!visitedObjects.has(p.comparisonOperator))
            _aws_cdk_aws_cloudwatch_ComparisonOperator(p.comparisonOperator);
        if ("period" in p)
            print("@aws-cdk/aws-cloudwatch.CreateAlarmOptions#period", "Use `metric.with({ period: ... })` to encode the period into the Metric object");
        if ("statistic" in p)
            print("@aws-cdk/aws-cloudwatch.CreateAlarmOptions#statistic", "Use `metric.with({ statistic: ... })` to encode the period into the Metric object");
        if (!visitedObjects.has(p.treatMissingData))
            _aws_cdk_aws_cloudwatch_TreatMissingData(p.treatMissingData);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_cloudwatch_ComparisonOperator(p) {
}
function _aws_cdk_aws_cloudwatch_TreatMissingData(p) {
}
function _aws_cdk_aws_cloudwatch_Alarm(p) {
}
function _aws_cdk_aws_cloudwatch_IAlarmAction(p) {
}
function _aws_cdk_aws_cloudwatch_AlarmActionConfig(p) {
}
function _aws_cdk_aws_cloudwatch_IAlarmRule(p) {
}
function _aws_cdk_aws_cloudwatch_IAlarm(p) {
}
function _aws_cdk_aws_cloudwatch_AlarmBase(p) {
}
function _aws_cdk_aws_cloudwatch_AlarmState(p) {
}
function _aws_cdk_aws_cloudwatch_AlarmRule(p) {
}
function _aws_cdk_aws_cloudwatch_CompositeAlarmProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.alarmRule))
            _aws_cdk_aws_cloudwatch_IAlarmRule(p.alarmRule);
        if (!visitedObjects.has(p.actionsSuppressor))
            _aws_cdk_aws_cloudwatch_IAlarm(p.actionsSuppressor);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_cloudwatch_CompositeAlarm(p) {
}
function _aws_cdk_aws_cloudwatch_PeriodOverride(p) {
}
function _aws_cdk_aws_cloudwatch_DashboardProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.periodOverride))
            _aws_cdk_aws_cloudwatch_PeriodOverride(p.periodOverride);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_cloudwatch_Dashboard(p) {
}
function _aws_cdk_aws_cloudwatch_MetricWidgetProps(p) {
}
function _aws_cdk_aws_cloudwatch_YAxisProps(p) {
}
function _aws_cdk_aws_cloudwatch_AlarmWidgetProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.alarm))
            _aws_cdk_aws_cloudwatch_IAlarm(p.alarm);
        if (!visitedObjects.has(p.leftYAxis))
            _aws_cdk_aws_cloudwatch_YAxisProps(p.leftYAxis);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_cloudwatch_AlarmWidget(p) {
}
function _aws_cdk_aws_cloudwatch_GraphWidgetView(p) {
}
function _aws_cdk_aws_cloudwatch_GaugeWidgetProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (p.annotations != null)
            for (const o of p.annotations)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_cloudwatch_HorizontalAnnotation(o);
        if (!visitedObjects.has(p.leftYAxis))
            _aws_cdk_aws_cloudwatch_YAxisProps(p.leftYAxis);
        if (!visitedObjects.has(p.legendPosition))
            _aws_cdk_aws_cloudwatch_LegendPosition(p.legendPosition);
        if (p.metrics != null)
            for (const o of p.metrics)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_cloudwatch_IMetric(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_cloudwatch_GaugeWidget(p) {
}
function _aws_cdk_aws_cloudwatch_GraphWidgetProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (p.left != null)
            for (const o of p.left)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_cloudwatch_IMetric(o);
        if (p.leftAnnotations != null)
            for (const o of p.leftAnnotations)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_cloudwatch_HorizontalAnnotation(o);
        if (!visitedObjects.has(p.leftYAxis))
            _aws_cdk_aws_cloudwatch_YAxisProps(p.leftYAxis);
        if (!visitedObjects.has(p.legendPosition))
            _aws_cdk_aws_cloudwatch_LegendPosition(p.legendPosition);
        if (p.right != null)
            for (const o of p.right)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_cloudwatch_IMetric(o);
        if (p.rightAnnotations != null)
            for (const o of p.rightAnnotations)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_cloudwatch_HorizontalAnnotation(o);
        if (!visitedObjects.has(p.rightYAxis))
            _aws_cdk_aws_cloudwatch_YAxisProps(p.rightYAxis);
        if (!visitedObjects.has(p.view))
            _aws_cdk_aws_cloudwatch_GraphWidgetView(p.view);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_cloudwatch_GraphWidget(p) {
}
function _aws_cdk_aws_cloudwatch_SingleValueWidgetProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (p.metrics != null)
            for (const o of p.metrics)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_cloudwatch_IMetric(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_cloudwatch_SingleValueWidget(p) {
}
function _aws_cdk_aws_cloudwatch_CustomWidgetProps(p) {
}
function _aws_cdk_aws_cloudwatch_CustomWidget(p) {
}
function _aws_cdk_aws_cloudwatch_HorizontalAnnotation(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.fill))
            _aws_cdk_aws_cloudwatch_Shading(p.fill);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_cloudwatch_Shading(p) {
}
function _aws_cdk_aws_cloudwatch_Color(p) {
}
function _aws_cdk_aws_cloudwatch_LegendPosition(p) {
}
function _aws_cdk_aws_cloudwatch_Row(p) {
}
function _aws_cdk_aws_cloudwatch_Column(p) {
}
function _aws_cdk_aws_cloudwatch_SpacerProps(p) {
}
function _aws_cdk_aws_cloudwatch_Spacer(p) {
}
function _aws_cdk_aws_cloudwatch_CommonMetricOptions(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if ("dimensions" in p)
            print("@aws-cdk/aws-cloudwatch.CommonMetricOptions#dimensions", "Use 'dimensionsMap' instead.");
        if (!visitedObjects.has(p.unit))
            _aws_cdk_aws_cloudwatch_Unit(p.unit);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_cloudwatch_MetricProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if ("dimensions" in p)
            print("@aws-cdk/aws-cloudwatch.CommonMetricOptions#dimensions", "Use 'dimensionsMap' instead.");
        if (!visitedObjects.has(p.unit))
            _aws_cdk_aws_cloudwatch_Unit(p.unit);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_cloudwatch_MetricOptions(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if ("dimensions" in p)
            print("@aws-cdk/aws-cloudwatch.CommonMetricOptions#dimensions", "Use 'dimensionsMap' instead.");
        if (!visitedObjects.has(p.unit))
            _aws_cdk_aws_cloudwatch_Unit(p.unit);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_cloudwatch_MathExpressionOptions(p) {
}
function _aws_cdk_aws_cloudwatch_MathExpressionProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (p.usingMetrics != null)
            for (const o of Object.values(p.usingMetrics))
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_cloudwatch_IMetric(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_cloudwatch_Metric(p) {
}
function _aws_cdk_aws_cloudwatch_MathExpression(p) {
}
function _aws_cdk_aws_cloudwatch_CreateAlarmOptions(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.comparisonOperator))
            _aws_cdk_aws_cloudwatch_ComparisonOperator(p.comparisonOperator);
        if ("period" in p)
            print("@aws-cdk/aws-cloudwatch.CreateAlarmOptions#period", "Use `metric.with({ period: ... })` to encode the period into the Metric object");
        if ("statistic" in p)
            print("@aws-cdk/aws-cloudwatch.CreateAlarmOptions#statistic", "Use `metric.with({ statistic: ... })` to encode the period into the Metric object");
        if (!visitedObjects.has(p.treatMissingData))
            _aws_cdk_aws_cloudwatch_TreatMissingData(p.treatMissingData);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_cloudwatch_IMetric(p) {
}
function _aws_cdk_aws_cloudwatch_Dimension(p) {
}
function _aws_cdk_aws_cloudwatch_Statistic(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        print("@aws-cdk/aws-cloudwatch.Statistic", "Use one of the factory methods on `Stats` to produce statistics strings");
        const ns = require("./lib/metric-types.js");
        if (Object.values(ns.Statistic).filter(x => x === p).length > 1)
            return;
        if (p === ns.Statistic.SAMPLE_COUNT)
            print("@aws-cdk/aws-cloudwatch.Statistic#SAMPLE_COUNT", "");
        if (p === ns.Statistic.AVERAGE)
            print("@aws-cdk/aws-cloudwatch.Statistic#AVERAGE", "");
        if (p === ns.Statistic.SUM)
            print("@aws-cdk/aws-cloudwatch.Statistic#SUM", "");
        if (p === ns.Statistic.MINIMUM)
            print("@aws-cdk/aws-cloudwatch.Statistic#MINIMUM", "");
        if (p === ns.Statistic.MAXIMUM)
            print("@aws-cdk/aws-cloudwatch.Statistic#MAXIMUM", "");
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_cloudwatch_Unit(p) {
}
function _aws_cdk_aws_cloudwatch_MetricConfig(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.mathExpression))
            _aws_cdk_aws_cloudwatch_MetricExpressionConfig(p.mathExpression);
        if (!visitedObjects.has(p.metricStat))
            _aws_cdk_aws_cloudwatch_MetricStatConfig(p.metricStat);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_cloudwatch_MetricStatConfig(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (p.dimensions != null)
            for (const o of p.dimensions)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_cloudwatch_Dimension(o);
        if (!visitedObjects.has(p.unitFilter))
            _aws_cdk_aws_cloudwatch_Unit(p.unitFilter);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_cloudwatch_MetricExpressionConfig(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (p.usingMetrics != null)
            for (const o of Object.values(p.usingMetrics))
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_cloudwatch_IMetric(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_cloudwatch_MetricAlarmConfig(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if ("metricName" in p)
            print("@aws-cdk/aws-cloudwatch.MetricAlarmConfig#metricName", "Replaced by MetricConfig");
        if ("namespace" in p)
            print("@aws-cdk/aws-cloudwatch.MetricAlarmConfig#namespace", "Replaced by MetricConfig");
        if ("period" in p)
            print("@aws-cdk/aws-cloudwatch.MetricAlarmConfig#period", "Replaced by MetricConfig");
        if ("dimensions" in p)
            print("@aws-cdk/aws-cloudwatch.MetricAlarmConfig#dimensions", "Replaced by MetricConfig");
        if (p.dimensions != null)
            for (const o of p.dimensions)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_cloudwatch_Dimension(o);
        if ("extendedStatistic" in p)
            print("@aws-cdk/aws-cloudwatch.MetricAlarmConfig#extendedStatistic", "Replaced by MetricConfig");
        if ("statistic" in p)
            print("@aws-cdk/aws-cloudwatch.MetricAlarmConfig#statistic", "Replaced by MetricConfig");
        if (!visitedObjects.has(p.statistic))
            _aws_cdk_aws_cloudwatch_Statistic(p.statistic);
        if ("unit" in p)
            print("@aws-cdk/aws-cloudwatch.MetricAlarmConfig#unit", "Replaced by MetricConfig");
        if (!visitedObjects.has(p.unit))
            _aws_cdk_aws_cloudwatch_Unit(p.unit);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_cloudwatch_MetricGraphConfig(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if ("metricName" in p)
            print("@aws-cdk/aws-cloudwatch.MetricGraphConfig#metricName", "Replaced by MetricConfig");
        if ("namespace" in p)
            print("@aws-cdk/aws-cloudwatch.MetricGraphConfig#namespace", "Replaced by MetricConfig");
        if ("period" in p)
            print("@aws-cdk/aws-cloudwatch.MetricGraphConfig#period", "Use `period` in `renderingProperties`");
        if ("renderingProperties" in p)
            print("@aws-cdk/aws-cloudwatch.MetricGraphConfig#renderingProperties", "Replaced by MetricConfig");
        if (!visitedObjects.has(p.renderingProperties))
            _aws_cdk_aws_cloudwatch_MetricRenderingProperties(p.renderingProperties);
        if ("color" in p)
            print("@aws-cdk/aws-cloudwatch.MetricGraphConfig#color", "Use `color` in `renderingProperties`");
        if ("dimensions" in p)
            print("@aws-cdk/aws-cloudwatch.MetricGraphConfig#dimensions", "Replaced by MetricConfig");
        if (p.dimensions != null)
            for (const o of p.dimensions)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_cloudwatch_Dimension(o);
        if ("label" in p)
            print("@aws-cdk/aws-cloudwatch.MetricGraphConfig#label", "Use `label` in `renderingProperties`");
        if ("statistic" in p)
            print("@aws-cdk/aws-cloudwatch.MetricGraphConfig#statistic", "Use `stat` in `renderingProperties`");
        if ("unit" in p)
            print("@aws-cdk/aws-cloudwatch.MetricGraphConfig#unit", "not used in dashboard widgets");
        if (!visitedObjects.has(p.unit))
            _aws_cdk_aws_cloudwatch_Unit(p.unit);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_cloudwatch_MetricRenderingProperties(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if ("period" in p)
            print("@aws-cdk/aws-cloudwatch.MetricRenderingProperties#period", "Replaced by MetricConfig.");
        if ("color" in p)
            print("@aws-cdk/aws-cloudwatch.MetricRenderingProperties#color", "Replaced by MetricConfig.");
        if ("label" in p)
            print("@aws-cdk/aws-cloudwatch.MetricRenderingProperties#label", "Replaced by MetricConfig.");
        if ("stat" in p)
            print("@aws-cdk/aws-cloudwatch.MetricRenderingProperties#stat", "Replaced by MetricConfig.");
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_cloudwatch_LogQueryVisualizationType(p) {
}
function _aws_cdk_aws_cloudwatch_LogQueryWidgetProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.view))
            _aws_cdk_aws_cloudwatch_LogQueryVisualizationType(p.view);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_cloudwatch_LogQueryWidget(p) {
}
function _aws_cdk_aws_cloudwatch_TextWidgetBackground(p) {
}
function _aws_cdk_aws_cloudwatch_TextWidgetProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.background))
            _aws_cdk_aws_cloudwatch_TextWidgetBackground(p.background);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_cloudwatch_TextWidget(p) {
}
function _aws_cdk_aws_cloudwatch_IWidget(p) {
}
function _aws_cdk_aws_cloudwatch_ConcreteWidget(p) {
}
function _aws_cdk_aws_cloudwatch_AlarmStatusWidgetSortBy(p) {
}
function _aws_cdk_aws_cloudwatch_AlarmStatusWidgetProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (p.alarms != null)
            for (const o of p.alarms)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_cloudwatch_IAlarm(o);
        if (!visitedObjects.has(p.sortBy))
            _aws_cdk_aws_cloudwatch_AlarmStatusWidgetSortBy(p.sortBy);
        if (p.states != null)
            for (const o of p.states)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_cloudwatch_AlarmState(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_cloudwatch_AlarmStatusWidget(p) {
}
function _aws_cdk_aws_cloudwatch_Stats(p) {
}
function _aws_cdk_aws_cloudwatch_CfnAlarmProps(p) {
}
function _aws_cdk_aws_cloudwatch_CfnAlarm(p) {
}
function _aws_cdk_aws_cloudwatch_CfnAlarm_DimensionProperty(p) {
}
function _aws_cdk_aws_cloudwatch_CfnAlarm_MetricProperty(p) {
}
function _aws_cdk_aws_cloudwatch_CfnAlarm_MetricDataQueryProperty(p) {
}
function _aws_cdk_aws_cloudwatch_CfnAlarm_MetricStatProperty(p) {
}
function _aws_cdk_aws_cloudwatch_CfnAnomalyDetectorProps(p) {
}
function _aws_cdk_aws_cloudwatch_CfnAnomalyDetector(p) {
}
function _aws_cdk_aws_cloudwatch_CfnAnomalyDetector_ConfigurationProperty(p) {
}
function _aws_cdk_aws_cloudwatch_CfnAnomalyDetector_DimensionProperty(p) {
}
function _aws_cdk_aws_cloudwatch_CfnAnomalyDetector_MetricProperty(p) {
}
function _aws_cdk_aws_cloudwatch_CfnAnomalyDetector_MetricDataQueryProperty(p) {
}
function _aws_cdk_aws_cloudwatch_CfnAnomalyDetector_MetricMathAnomalyDetectorProperty(p) {
}
function _aws_cdk_aws_cloudwatch_CfnAnomalyDetector_MetricStatProperty(p) {
}
function _aws_cdk_aws_cloudwatch_CfnAnomalyDetector_RangeProperty(p) {
}
function _aws_cdk_aws_cloudwatch_CfnAnomalyDetector_SingleMetricAnomalyDetectorProperty(p) {
}
function _aws_cdk_aws_cloudwatch_CfnCompositeAlarmProps(p) {
}
function _aws_cdk_aws_cloudwatch_CfnCompositeAlarm(p) {
}
function _aws_cdk_aws_cloudwatch_CfnDashboardProps(p) {
}
function _aws_cdk_aws_cloudwatch_CfnDashboard(p) {
}
function _aws_cdk_aws_cloudwatch_CfnInsightRuleProps(p) {
}
function _aws_cdk_aws_cloudwatch_CfnInsightRule(p) {
}
function _aws_cdk_aws_cloudwatch_CfnMetricStreamProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (p.tags != null)
            for (const o of p.tags)
                if (!visitedObjects.has(o))
                    require("@aws-cdk/core/.warnings.jsii.js")._aws_cdk_core_CfnTag(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_cloudwatch_CfnMetricStream(p) {
}
function _aws_cdk_aws_cloudwatch_CfnMetricStream_MetricStreamFilterProperty(p) {
}
function _aws_cdk_aws_cloudwatch_CfnMetricStream_MetricStreamStatisticsConfigurationProperty(p) {
}
function _aws_cdk_aws_cloudwatch_CfnMetricStream_MetricStreamStatisticsMetricProperty(p) {
}
function print(name, deprecationMessage) {
    const deprecated = process.env.JSII_DEPRECATED;
    const deprecationMode = ["warn", "fail", "quiet"].includes(deprecated) ? deprecated : "warn";
    const message = `${name} is deprecated.\n  ${deprecationMessage.trim()}\n  This API will be removed in the next major release.`;
    switch (deprecationMode) {
        case "fail":
            throw new DeprecationError(message);
        case "warn":
            console.warn("[WARNING]", message);
            break;
    }
}
function getPropertyDescriptor(obj, prop) {
    const descriptor = Object.getOwnPropertyDescriptor(obj, prop);
    if (descriptor) {
        return descriptor;
    }
    const proto = Object.getPrototypeOf(obj);
    const prototypeDescriptor = proto && getPropertyDescriptor(proto, prop);
    if (prototypeDescriptor) {
        return prototypeDescriptor;
    }
    return {};
}
const visitedObjects = new Set();
class DeprecationError extends Error {
    constructor(...args) {
        super(...args);
        Object.defineProperty(this, "name", {
            configurable: false,
            enumerable: true,
            value: "DeprecationError",
            writable: false,
        });
    }
}
module.exports = { print, getPropertyDescriptor, DeprecationError, _aws_cdk_aws_cloudwatch_AlarmProps, _aws_cdk_aws_cloudwatch_ComparisonOperator, _aws_cdk_aws_cloudwatch_TreatMissingData, _aws_cdk_aws_cloudwatch_Alarm, _aws_cdk_aws_cloudwatch_IAlarmAction, _aws_cdk_aws_cloudwatch_AlarmActionConfig, _aws_cdk_aws_cloudwatch_IAlarmRule, _aws_cdk_aws_cloudwatch_IAlarm, _aws_cdk_aws_cloudwatch_AlarmBase, _aws_cdk_aws_cloudwatch_AlarmState, _aws_cdk_aws_cloudwatch_AlarmRule, _aws_cdk_aws_cloudwatch_CompositeAlarmProps, _aws_cdk_aws_cloudwatch_CompositeAlarm, _aws_cdk_aws_cloudwatch_PeriodOverride, _aws_cdk_aws_cloudwatch_DashboardProps, _aws_cdk_aws_cloudwatch_Dashboard, _aws_cdk_aws_cloudwatch_MetricWidgetProps, _aws_cdk_aws_cloudwatch_YAxisProps, _aws_cdk_aws_cloudwatch_AlarmWidgetProps, _aws_cdk_aws_cloudwatch_AlarmWidget, _aws_cdk_aws_cloudwatch_GraphWidgetView, _aws_cdk_aws_cloudwatch_GaugeWidgetProps, _aws_cdk_aws_cloudwatch_GaugeWidget, _aws_cdk_aws_cloudwatch_GraphWidgetProps, _aws_cdk_aws_cloudwatch_GraphWidget, _aws_cdk_aws_cloudwatch_SingleValueWidgetProps, _aws_cdk_aws_cloudwatch_SingleValueWidget, _aws_cdk_aws_cloudwatch_CustomWidgetProps, _aws_cdk_aws_cloudwatch_CustomWidget, _aws_cdk_aws_cloudwatch_HorizontalAnnotation, _aws_cdk_aws_cloudwatch_Shading, _aws_cdk_aws_cloudwatch_Color, _aws_cdk_aws_cloudwatch_LegendPosition, _aws_cdk_aws_cloudwatch_Row, _aws_cdk_aws_cloudwatch_Column, _aws_cdk_aws_cloudwatch_SpacerProps, _aws_cdk_aws_cloudwatch_Spacer, _aws_cdk_aws_cloudwatch_CommonMetricOptions, _aws_cdk_aws_cloudwatch_MetricProps, _aws_cdk_aws_cloudwatch_MetricOptions, _aws_cdk_aws_cloudwatch_MathExpressionOptions, _aws_cdk_aws_cloudwatch_MathExpressionProps, _aws_cdk_aws_cloudwatch_Metric, _aws_cdk_aws_cloudwatch_MathExpression, _aws_cdk_aws_cloudwatch_CreateAlarmOptions, _aws_cdk_aws_cloudwatch_IMetric, _aws_cdk_aws_cloudwatch_Dimension, _aws_cdk_aws_cloudwatch_Statistic, _aws_cdk_aws_cloudwatch_Unit, _aws_cdk_aws_cloudwatch_MetricConfig, _aws_cdk_aws_cloudwatch_MetricStatConfig, _aws_cdk_aws_cloudwatch_MetricExpressionConfig, _aws_cdk_aws_cloudwatch_MetricAlarmConfig, _aws_cdk_aws_cloudwatch_MetricGraphConfig, _aws_cdk_aws_cloudwatch_MetricRenderingProperties, _aws_cdk_aws_cloudwatch_LogQueryVisualizationType, _aws_cdk_aws_cloudwatch_LogQueryWidgetProps, _aws_cdk_aws_cloudwatch_LogQueryWidget, _aws_cdk_aws_cloudwatch_TextWidgetBackground, _aws_cdk_aws_cloudwatch_TextWidgetProps, _aws_cdk_aws_cloudwatch_TextWidget, _aws_cdk_aws_cloudwatch_IWidget, _aws_cdk_aws_cloudwatch_ConcreteWidget, _aws_cdk_aws_cloudwatch_AlarmStatusWidgetSortBy, _aws_cdk_aws_cloudwatch_AlarmStatusWidgetProps, _aws_cdk_aws_cloudwatch_AlarmStatusWidget, _aws_cdk_aws_cloudwatch_Stats, _aws_cdk_aws_cloudwatch_CfnAlarmProps, _aws_cdk_aws_cloudwatch_CfnAlarm, _aws_cdk_aws_cloudwatch_CfnAlarm_DimensionProperty, _aws_cdk_aws_cloudwatch_CfnAlarm_MetricProperty, _aws_cdk_aws_cloudwatch_CfnAlarm_MetricDataQueryProperty, _aws_cdk_aws_cloudwatch_CfnAlarm_MetricStatProperty, _aws_cdk_aws_cloudwatch_CfnAnomalyDetectorProps, _aws_cdk_aws_cloudwatch_CfnAnomalyDetector, _aws_cdk_aws_cloudwatch_CfnAnomalyDetector_ConfigurationProperty, _aws_cdk_aws_cloudwatch_CfnAnomalyDetector_DimensionProperty, _aws_cdk_aws_cloudwatch_CfnAnomalyDetector_MetricProperty, _aws_cdk_aws_cloudwatch_CfnAnomalyDetector_MetricDataQueryProperty, _aws_cdk_aws_cloudwatch_CfnAnomalyDetector_MetricMathAnomalyDetectorProperty, _aws_cdk_aws_cloudwatch_CfnAnomalyDetector_MetricStatProperty, _aws_cdk_aws_cloudwatch_CfnAnomalyDetector_RangeProperty, _aws_cdk_aws_cloudwatch_CfnAnomalyDetector_SingleMetricAnomalyDetectorProperty, _aws_cdk_aws_cloudwatch_CfnCompositeAlarmProps, _aws_cdk_aws_cloudwatch_CfnCompositeAlarm, _aws_cdk_aws_cloudwatch_CfnDashboardProps, _aws_cdk_aws_cloudwatch_CfnDashboard, _aws_cdk_aws_cloudwatch_CfnInsightRuleProps, _aws_cdk_aws_cloudwatch_CfnInsightRule, _aws_cdk_aws_cloudwatch_CfnMetricStreamProps, _aws_cdk_aws_cloudwatch_CfnMetricStream, _aws_cdk_aws_cloudwatch_CfnMetricStream_MetricStreamFilterProperty, _aws_cdk_aws_cloudwatch_CfnMetricStream_MetricStreamStatisticsConfigurationProperty, _aws_cdk_aws_cloudwatch_CfnMetricStream_MetricStreamStatisticsMetricProperty };
