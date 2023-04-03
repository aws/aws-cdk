"use strict";
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MathExpression = exports.Metric = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const iam = require("@aws-cdk/aws-iam");
const cdk = require("@aws-cdk/core");
const alarm_1 = require("./alarm");
const metric_util_1 = require("./private/metric-util");
const statistic_1 = require("./private/statistic");
const stats_1 = require("./stats");
/**
 * A metric emitted by a service
 *
 * The metric is a combination of a metric identifier (namespace, name and dimensions)
 * and an aggregation function (statistic, period and unit).
 *
 * It also contains metadata which is used only in graphs, such as color and label.
 * It makes sense to embed this in here, so that compound constructs can attach
 * that metadata to metrics they expose.
 *
 * This class does not represent a resource, so hence is not a construct. Instead,
 * Metric is an abstraction that makes it easy to specify metrics for use in both
 * alarms and graphs.
 */
class Metric {
    constructor(props) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_cloudwatch_MetricProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, Metric);
            }
            throw error;
        }
        this.period = props.period || cdk.Duration.minutes(5);
        const periodSec = this.period.toSeconds();
        if (periodSec !== 1 && periodSec !== 5 && periodSec !== 10 && periodSec !== 30 && periodSec % 60 !== 0) {
            throw new Error(`'period' must be 1, 5, 10, 30, or a multiple of 60 seconds, received ${periodSec}`);
        }
        this.warnings = undefined;
        this.dimensions = this.validateDimensions(props.dimensionsMap ?? props.dimensions);
        this.namespace = props.namespace;
        this.metricName = props.metricName;
        const parsedStat = statistic_1.parseStatistic(props.statistic || stats_1.Stats.AVERAGE);
        if (parsedStat.type === 'generic') {
            // Unrecognized statistic, do not throw, just warn
            // There may be a new statistic that this lib does not support yet
            const label = props.label ? `, label "${props.label}"` : '';
            this.warnings = [
                `Unrecognized statistic "${props.statistic}" for metric with namespace "${props.namespace}"${label} and metric name "${props.metricName}".` +
                    ' Preferably use the `aws_cloudwatch.Stats` helper class to specify a statistic.' +
                    ' You can ignore this warning if your statistic is valid but not yet supported by the `aws_cloudwatch.Stats` helper class.',
            ];
        }
        this.statistic = statistic_1.normalizeStatistic(parsedStat);
        this.label = props.label;
        this.color = props.color;
        this.unit = props.unit;
        this.account = props.account;
        this.region = props.region;
    }
    /**
     * Grant permissions to the given identity to write metrics.
     *
     * @param grantee The IAM identity to give permissions to.
     */
    static grantPutMetricData(grantee) {
        return iam.Grant.addToPrincipal({
            grantee,
            actions: ['cloudwatch:PutMetricData'],
            resourceArns: ['*'],
        });
    }
    /**
     * Return a copy of Metric `with` properties changed.
     *
     * All properties except namespace and metricName can be changed.
     *
     * @param props The set of properties to change.
     */
    with(props) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_cloudwatch_MetricOptions(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.with);
            }
            throw error;
        }
        // Short-circuit creating a new object if there would be no effective change
        if ((props.label === undefined || props.label === this.label)
            && (props.color === undefined || props.color === this.color)
            && (props.statistic === undefined || props.statistic === this.statistic)
            && (props.unit === undefined || props.unit === this.unit)
            && (props.account === undefined || props.account === this.account)
            && (props.region === undefined || props.region === this.region)
            // For these we're not going to do deep equality, misses some opportunity for optimization
            // but that's okay.
            && (props.dimensions === undefined)
            && (props.dimensionsMap === undefined)
            && (props.period === undefined || props.period.toSeconds() === this.period.toSeconds())) {
            return this;
        }
        return new Metric({
            dimensionsMap: props.dimensionsMap ?? props.dimensions ?? this.dimensions,
            namespace: this.namespace,
            metricName: this.metricName,
            period: ifUndefined(props.period, this.period),
            statistic: ifUndefined(props.statistic, this.statistic),
            unit: ifUndefined(props.unit, this.unit),
            label: ifUndefined(props.label, this.label),
            color: ifUndefined(props.color, this.color),
            account: ifUndefined(props.account, this.account),
            region: ifUndefined(props.region, this.region),
        });
    }
    /**
     * Attach the metric object to the given construct scope
     *
     * Returns a Metric object that uses the account and region from the Stack
     * the given construct is defined in. If the metric is subsequently used
     * in a Dashboard or Alarm in a different Stack defined in a different
     * account or region, the appropriate 'region' and 'account' fields
     * will be added to it.
     *
     * If the scope we attach to is in an environment-agnostic stack,
     * nothing is done and the same Metric object is returned.
     */
    attachTo(scope) {
        const stack = cdk.Stack.of(scope);
        return this.with({
            region: cdk.Token.isUnresolved(stack.region) ? undefined : stack.region,
            account: cdk.Token.isUnresolved(stack.account) ? undefined : stack.account,
        });
    }
    toMetricConfig() {
        const dims = this.dimensionsAsList();
        return {
            metricStat: {
                dimensions: dims.length > 0 ? dims : undefined,
                namespace: this.namespace,
                metricName: this.metricName,
                period: this.period,
                statistic: this.statistic,
                unitFilter: this.unit,
                account: this.account,
                region: this.region,
            },
            renderingProperties: {
                color: this.color,
                label: this.label,
            },
        };
    }
    /** @deprecated use toMetricConfig() */
    toAlarmConfig() {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-cloudwatch.Metric#toAlarmConfig", "use toMetricConfig()");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.toAlarmConfig);
            }
            throw error;
        }
        const metricConfig = this.toMetricConfig();
        if (metricConfig.metricStat === undefined) {
            throw new Error('Using a math expression is not supported here. Pass a \'Metric\' object instead');
        }
        const parsed = statistic_1.parseStatistic(metricConfig.metricStat.statistic);
        let extendedStatistic = undefined;
        if (parsed.type === 'single') {
            extendedStatistic = statistic_1.singleStatisticToString(parsed);
        }
        else if (parsed.type === 'pair') {
            extendedStatistic = statistic_1.pairStatisticToString(parsed);
        }
        return {
            dimensions: metricConfig.metricStat.dimensions,
            namespace: metricConfig.metricStat.namespace,
            metricName: metricConfig.metricStat.metricName,
            period: metricConfig.metricStat.period.toSeconds(),
            statistic: parsed.type === 'simple' ? parsed.statistic : undefined,
            extendedStatistic,
            unit: this.unit,
        };
    }
    /**
     * @deprecated use toMetricConfig()
     */
    toGraphConfig() {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-cloudwatch.Metric#toGraphConfig", "use toMetricConfig()");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.toGraphConfig);
            }
            throw error;
        }
        const metricConfig = this.toMetricConfig();
        if (metricConfig.metricStat === undefined) {
            throw new Error('Using a math expression is not supported here. Pass a \'Metric\' object instead');
        }
        return {
            dimensions: metricConfig.metricStat.dimensions,
            namespace: metricConfig.metricStat.namespace,
            metricName: metricConfig.metricStat.metricName,
            renderingProperties: {
                period: metricConfig.metricStat.period.toSeconds(),
                stat: metricConfig.metricStat.statistic,
                color: asString(metricConfig.renderingProperties?.color),
                label: asString(metricConfig.renderingProperties?.label),
            },
            // deprecated properties for backwards compatibility
            period: metricConfig.metricStat.period.toSeconds(),
            statistic: metricConfig.metricStat.statistic,
            color: asString(metricConfig.renderingProperties?.color),
            label: asString(metricConfig.renderingProperties?.label),
            unit: this.unit,
        };
    }
    /**
     * Make a new Alarm for this metric
     *
     * Combines both properties that may adjust the metric (aggregation) as well
     * as alarm properties.
     */
    createAlarm(scope, id, props) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_cloudwatch_CreateAlarmOptions(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.createAlarm);
            }
            throw error;
        }
        return new alarm_1.Alarm(scope, id, {
            metric: this.with({
                statistic: props.statistic,
                period: props.period,
            }),
            alarmName: props.alarmName,
            alarmDescription: props.alarmDescription,
            comparisonOperator: props.comparisonOperator,
            datapointsToAlarm: props.datapointsToAlarm,
            threshold: props.threshold,
            evaluationPeriods: props.evaluationPeriods,
            evaluateLowSampleCountPercentile: props.evaluateLowSampleCountPercentile,
            treatMissingData: props.treatMissingData,
            actionsEnabled: props.actionsEnabled,
        });
    }
    toString() {
        return this.label || this.metricName;
    }
    /**
     * Return the dimensions of this Metric as a list of Dimension.
     */
    dimensionsAsList() {
        const dims = this.dimensions;
        if (dims === undefined) {
            return [];
        }
        const list = Object.keys(dims).sort().map(key => ({ name: key, value: dims[key] }));
        return list;
    }
    validateDimensions(dims) {
        if (!dims) {
            return dims;
        }
        var dimsArray = Object.keys(dims);
        if (dimsArray?.length > 10) {
            throw new Error(`The maximum number of dimensions is 10, received ${dimsArray.length}`);
        }
        dimsArray.map(key => {
            if (dims[key] === undefined || dims[key] === null) {
                throw new Error(`Dimension value of '${dims[key]}' is invalid`);
            }
            ;
            if (key.length < 1 || key.length > 255) {
                throw new Error(`Dimension name must be at least 1 and no more than 255 characters; received ${key}`);
            }
            ;
            if (dims[key].length < 1 || dims[key].length > 255) {
                throw new Error(`Dimension value must be at least 1 and no more than 255 characters; received ${dims[key]}`);
            }
            ;
        });
        return dims;
    }
}
exports.Metric = Metric;
_a = JSII_RTTI_SYMBOL_1;
Metric[_a] = { fqn: "@aws-cdk/aws-cloudwatch.Metric", version: "0.0.0" };
function asString(x) {
    if (x === undefined) {
        return undefined;
    }
    if (typeof x !== 'string') {
        throw new Error(`Expected string, got ${x}`);
    }
    return x;
}
/**
 * A math expression built with metric(s) emitted by a service
 *
 * The math expression is a combination of an expression (x+y) and metrics to apply expression on.
 * It also contains metadata which is used only in graphs, such as color and label.
 * It makes sense to embed this in here, so that compound constructs can attach
 * that metadata to metrics they expose.
 *
 * MathExpression can also be used for search expressions. In this case,
 * it also optionally accepts a searchRegion and searchAccount property for cross-environment
 * search expressions.
 *
 * This class does not represent a resource, so hence is not a construct. Instead,
 * MathExpression is an abstraction that makes it easy to specify metrics for use in both
 * alarms and graphs.
 */
class MathExpression {
    constructor(props) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_cloudwatch_MathExpressionProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, MathExpression);
            }
            throw error;
        }
        this.period = props.period || cdk.Duration.minutes(5);
        this.expression = props.expression;
        this.usingMetrics = changeAllPeriods(props.usingMetrics ?? {}, this.period);
        this.label = props.label;
        this.color = props.color;
        this.searchAccount = props.searchAccount;
        this.searchRegion = props.searchRegion;
        const invalidVariableNames = Object.keys(this.usingMetrics).filter(x => !validVariableName(x));
        if (invalidVariableNames.length > 0) {
            throw new Error(`Invalid variable names in expression: ${invalidVariableNames}. Must start with lowercase letter and only contain alphanumerics.`);
        }
        this.validateNoIdConflicts();
        // Check that all IDs used in the expression are also in the `usingMetrics` map. We
        // can't throw on this anymore since we didn't use to do this validation from the start
        // and now there will be loads of people who are violating the expected contract, but
        // we can add warnings.
        const missingIdentifiers = allIdentifiersInExpression(this.expression).filter(i => !this.usingMetrics[i]);
        const warnings = [];
        if (!this.expression.toUpperCase().match('\\s*SELECT|SEARCH|METRICS\\s.*') && missingIdentifiers.length > 0) {
            warnings.push(`Math expression '${this.expression}' references unknown identifiers: ${missingIdentifiers.join(', ')}. Please add them to the 'usingMetrics' map.`);
        }
        // Also copy warnings from deeper levels so graphs, alarms only have to inspect the top-level objects
        for (const m of Object.values(this.usingMetrics)) {
            warnings.push(...m.warnings ?? []);
        }
        if (warnings.length > 0) {
            this.warnings = warnings;
        }
    }
    /**
     * Return a copy of Metric with properties changed.
     *
     * All properties except namespace and metricName can be changed.
     *
     * @param props The set of properties to change.
     */
    with(props) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_cloudwatch_MathExpressionOptions(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.with);
            }
            throw error;
        }
        // Short-circuit creating a new object if there would be no effective change
        if ((props.label === undefined || props.label === this.label)
            && (props.color === undefined || props.color === this.color)
            && (props.period === undefined || props.period.toSeconds() === this.period.toSeconds())
            && (props.searchAccount === undefined || props.searchAccount === this.searchAccount)
            && (props.searchRegion === undefined || props.searchRegion === this.searchRegion)) {
            return this;
        }
        return new MathExpression({
            expression: this.expression,
            usingMetrics: this.usingMetrics,
            label: ifUndefined(props.label, this.label),
            color: ifUndefined(props.color, this.color),
            period: ifUndefined(props.period, this.period),
            searchAccount: ifUndefined(props.searchAccount, this.searchAccount),
            searchRegion: ifUndefined(props.searchRegion, this.searchRegion),
        });
    }
    /**
     * @deprecated use toMetricConfig()
     */
    toAlarmConfig() {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-cloudwatch.MathExpression#toAlarmConfig", "use toMetricConfig()");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.toAlarmConfig);
            }
            throw error;
        }
        throw new Error('Using a math expression is not supported here. Pass a \'Metric\' object instead');
    }
    /**
     * @deprecated use toMetricConfig()
     */
    toGraphConfig() {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-cloudwatch.MathExpression#toGraphConfig", "use toMetricConfig()");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.toGraphConfig);
            }
            throw error;
        }
        throw new Error('Using a math expression is not supported here. Pass a \'Metric\' object instead');
    }
    toMetricConfig() {
        return {
            mathExpression: {
                period: this.period.toSeconds(),
                expression: this.expression,
                usingMetrics: this.usingMetrics,
                searchAccount: this.searchAccount,
                searchRegion: this.searchRegion,
            },
            renderingProperties: {
                label: this.label,
                color: this.color,
            },
        };
    }
    /**
     * Make a new Alarm for this metric
     *
     * Combines both properties that may adjust the metric (aggregation) as well
     * as alarm properties.
     */
    createAlarm(scope, id, props) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_cloudwatch_CreateAlarmOptions(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.createAlarm);
            }
            throw error;
        }
        return new alarm_1.Alarm(scope, id, {
            metric: this.with({
                period: props.period,
            }),
            alarmName: props.alarmName,
            alarmDescription: props.alarmDescription,
            comparisonOperator: props.comparisonOperator,
            datapointsToAlarm: props.datapointsToAlarm,
            threshold: props.threshold,
            evaluationPeriods: props.evaluationPeriods,
            evaluateLowSampleCountPercentile: props.evaluateLowSampleCountPercentile,
            treatMissingData: props.treatMissingData,
            actionsEnabled: props.actionsEnabled,
        });
    }
    toString() {
        return this.label || this.expression;
    }
    validateNoIdConflicts() {
        const seen = new Map();
        visit(this);
        function visit(metric) {
            metric_util_1.dispatchMetric(metric, {
                withStat() {
                    // Nothing
                },
                withExpression(expr) {
                    for (const [id, subMetric] of Object.entries(expr.usingMetrics)) {
                        const existing = seen.get(id);
                        if (existing && metric_util_1.metricKey(existing) !== metric_util_1.metricKey(subMetric)) {
                            throw new Error(`The ID '${id}' used for two metrics in the expression: '${subMetric}' and '${existing}'. Rename one.`);
                        }
                        seen.set(id, subMetric);
                        visit(subMetric);
                    }
                },
            });
        }
    }
}
exports.MathExpression = MathExpression;
_b = JSII_RTTI_SYMBOL_1;
MathExpression[_b] = { fqn: "@aws-cdk/aws-cloudwatch.MathExpression", version: "0.0.0" };
/**
 * Pattern for a variable name. Alphanum starting with lowercase.
 */
const VARIABLE_PAT = '[a-z][a-zA-Z0-9_]*';
const VALID_VARIABLE = new RegExp(`^${VARIABLE_PAT}$`);
const FIND_VARIABLE = new RegExp(VARIABLE_PAT, 'g');
function validVariableName(x) {
    return VALID_VARIABLE.test(x);
}
/**
 * Return all variable names used in an expression
 */
function allIdentifiersInExpression(x) {
    return Array.from(matchAll(x, FIND_VARIABLE)).map(m => m[0]);
}
function ifUndefined(x, def) {
    if (x !== undefined) {
        return x;
    }
    return def;
}
/**
 * Change periods of all metrics in the map
 */
function changeAllPeriods(metrics, period) {
    const ret = {};
    for (const [id, metric] of Object.entries(metrics)) {
        ret[id] = changePeriod(metric, period);
    }
    return ret;
}
/**
 * Return a new metric object which is the same type as the input object, but with the period changed
 *
 * Relies on the fact that implementations of `IMetric` are also supposed to have
 * an implementation of `with` that accepts an argument called `period`. See `IModifiableMetric`.
 */
function changePeriod(metric, period) {
    if (isModifiableMetric(metric)) {
        return metric.with({ period });
    }
    throw new Error(`Metric object should also implement 'with': ${metric}`);
}
function isModifiableMetric(m) {
    return typeof m === 'object' && m !== null && !!m.with;
}
// Polyfill for string.matchAll(regexp)
function matchAll(x, re) {
    const ret = new Array();
    let m;
    while (m = re.exec(x)) {
        ret.push(m);
    }
    return ret;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWV0cmljLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibWV0cmljLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLHdDQUF3QztBQUN4QyxxQ0FBcUM7QUFFckMsbUNBQXNFO0FBRXRFLHVEQUFrRTtBQUNsRSxtREFBeUg7QUFDekgsbUNBQWdDO0FBa09oQzs7Ozs7Ozs7Ozs7OztHQWFHO0FBQ0gsTUFBYSxNQUFNO0lBeUNqQixZQUFZLEtBQWtCOzs7Ozs7K0NBekNuQixNQUFNOzs7O1FBMENmLElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDLE1BQU0sSUFBSSxHQUFHLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN0RCxNQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQzFDLElBQUksU0FBUyxLQUFLLENBQUMsSUFBSSxTQUFTLEtBQUssQ0FBQyxJQUFJLFNBQVMsS0FBSyxFQUFFLElBQUksU0FBUyxLQUFLLEVBQUUsSUFBSSxTQUFTLEdBQUcsRUFBRSxLQUFLLENBQUMsRUFBRTtZQUN0RyxNQUFNLElBQUksS0FBSyxDQUFDLHdFQUF3RSxTQUFTLEVBQUUsQ0FBQyxDQUFDO1NBQ3RHO1FBRUQsSUFBSSxDQUFDLFFBQVEsR0FBRyxTQUFTLENBQUM7UUFDMUIsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsa0JBQWtCLENBQUMsS0FBSyxDQUFDLGFBQWEsSUFBSSxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDbkYsSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUMsU0FBUyxDQUFDO1FBQ2pDLElBQUksQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDLFVBQVUsQ0FBQztRQUVuQyxNQUFNLFVBQVUsR0FBRywwQkFBYyxDQUFDLEtBQUssQ0FBQyxTQUFTLElBQUksYUFBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3BFLElBQUksVUFBVSxDQUFD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RTtRQUM5QixPQUFPLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxNQUFNLEVBQUUsQ0FBQyxDQUFDO0tBQ2hDO0lBRUQsTUFBTSxJQUFJLEtBQUssQ0FBQywrQ0FBK0MsTUFBTSxFQUFFLENBQUMsQ0FBQztBQUMzRSxDQUFDO0FBd0JELFNBQVMsa0JBQWtCLENBQUMsQ0FBTTtJQUNoQyxPQUFPLE9BQU8sQ0FBQyxLQUFLLFFBQVEsSUFBSSxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO0FBQ3pELENBQUM7QUFFRCx1Q0FBdUM7QUFDdkMsU0FBUyxRQUFRLENBQUMsQ0FBUyxFQUFFLEVBQVU7SUFDckMsTUFBTSxHQUFHLEdBQUcsSUFBSSxLQUFLLEVBQW9CLENBQUM7SUFDMUMsSUFBSSxDQUF5QixDQUFDO0lBQzlCLE9BQU8sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUU7UUFDckIsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUNiO0lBQ0QsT0FBTyxHQUFHLENBQUM7QUFDYixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgaWFtIGZyb20gJ0Bhd3MtY2RrL2F3cy1pYW0nO1xuaW1wb3J0ICogYXMgY2RrIGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgQ29uc3RydWN0LCBJQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgeyBBbGFybSwgQ29tcGFyaXNvbk9wZXJhdG9yLCBUcmVhdE1pc3NpbmdEYXRhIH0gZnJvbSAnLi9hbGFybSc7XG5pbXBvcnQgeyBEaW1lbnNpb24sIElNZXRyaWMsIE1ldHJpY0FsYXJtQ29uZmlnLCBNZXRyaWNDb25maWcsIE1ldHJpY0dyYXBoQ29uZmlnLCBTdGF0aXN0aWMsIFVuaXQgfSBmcm9tICcuL21ldHJpYy10eXBlcyc7XG5pbXBvcnQgeyBkaXNwYXRjaE1ldHJpYywgbWV0cmljS2V5IH0gZnJvbSAnLi9wcml2YXRlL21ldHJpYy11dGlsJztcbmltcG9ydCB7IG5vcm1hbGl6ZVN0YXRpc3RpYywgcGFpclN0YXRpc3RpY1RvU3RyaW5nLCBwYXJzZVN0YXRpc3RpYywgc2luZ2xlU3RhdGlzdGljVG9TdHJpbmcgfSBmcm9tICcuL3ByaXZhdGUvc3RhdGlzdGljJztcbmltcG9ydCB7IFN0YXRzIH0gZnJvbSAnLi9zdGF0cyc7XG5cbmV4cG9ydCB0eXBlIERpbWVuc2lvbkhhc2ggPSB7IFtkaW06IHN0cmluZ106IGFueSB9O1xuXG5leHBvcnQgdHlwZSBEaW1lbnNpb25zTWFwID0geyBbZGltOiBzdHJpbmddOiBzdHJpbmcgfTtcblxuLyoqXG4gKiBPcHRpb25zIHNoYXJlZCBieSBtb3N0IG1ldGhvZHMgYWNjZXB0aW5nIG1ldHJpYyBvcHRpb25zXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQ29tbW9uTWV0cmljT3B0aW9ucyB7XG4gIC8qKlxuICAgKiBUaGUgcGVyaW9kIG92ZXIgd2hpY2ggdGhlIHNwZWNpZmllZCBzdGF0aXN0aWMgaXMgYXBwbGllZC5cbiAgICpcbiAgICogQGRlZmF1bHQgRHVyYXRpb24ubWludXRlcyg1KVxuICAgKi9cbiAgcmVhZG9ubHkgcGVyaW9kPzogY2RrLkR1cmF0aW9uO1xuXG4gIC8qKlxuICAgKiBXaGF0IGZ1bmN0aW9uIHRvIHVzZSBmb3IgYWdncmVnYXRpbmcuXG4gICAqXG4gICAqIFVzZSB0aGUgYGF3c19jbG91ZHdhdGNoLlN0YXRzYCBoZWxwZXIgY2xhc3MgdG8gY29uc3RydWN0IHZhbGlkIGlucHV0IHN0cmluZ3MuXG4gICAqXG4gICAqIENhbiBiZSBvbmUgb2YgdGhlIGZvbGxvd2luZzpcbiAgICpcbiAgICogLSBcIk1pbmltdW1cIiB8IFwibWluXCJcbiAgICogLSBcIk1heGltdW1cIiB8IFwibWF4XCJcbiAgICogLSBcIkF2ZXJhZ2VcIiB8IFwiYXZnXCJcbiAgICogLSBcIlN1bVwiIHwgXCJzdW1cIlxuICAgKiAtIFwiU2FtcGxlQ291bnQgfCBcIm5cIlxuICAgKiAtIFwicE5OLk5OXCJcbiAgICogLSBcInRtTk4uTk5cIiB8IFwidG0oTk4uTk4lOk5OLk5OJSlcIlxuICAgKiAtIFwiaXFtXCJcbiAgICogLSBcIndtTk4uTk5cIiB8IFwid20oTk4uTk4lOk5OLk5OJSlcIlxuICAgKiAtIFwidGNOTi5OTlwiIHwgXCJ0YyhOTi5OTiU6Tk4uTk4lKVwiXG4gICAqIC0gXCJ0c05OLk5OXCIgfCBcInRzKE5OLk5OJTpOTi5OTiUpXCJcbiAgICpcbiAgICogQGRlZmF1bHQgQXZlcmFnZVxuICAgKi9cbiAgcmVhZG9ubHkgc3RhdGlzdGljPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBEaW1lbnNpb25zIG9mIHRoZSBtZXRyaWNcbiAgICpcbiAgICogQGRlZmF1bHQgLSBObyBkaW1lbnNpb25zLlxuICAgKlxuICAgKiBAZGVwcmVjYXRlZCBVc2UgJ2RpbWVuc2lvbnNNYXAnIGluc3RlYWQuXG4gICAqL1xuICByZWFkb25seSBkaW1lbnNpb25zPzogRGltZW5zaW9uSGFzaDtcblxuICAvKipcbiAgICogRGltZW5zaW9ucyBvZiB0aGUgbWV0cmljXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gTm8gZGltZW5zaW9ucy5cbiAgICovXG4gIHJlYWRvbmx5IGRpbWVuc2lvbnNNYXA/OiBEaW1lbnNpb25zTWFwO1xuXG4gIC8qKlxuICAgKiBVbml0IHVzZWQgdG8gZmlsdGVyIHRoZSBtZXRyaWMgc3RyZWFtXG4gICAqXG4gICAqIE9ubHkgcmVmZXIgdG8gZGF0dW1zIGVtaXR0ZWQgdG8gdGhlIG1ldHJpYyBzdHJlYW0gd2l0aCB0aGUgZ2l2ZW4gdW5pdCBhbmRcbiAgICogaWdub3JlIGFsbCBvdGhlcnMuIE9ubHkgdXNlZnVsIHdoZW4gZGF0dW1zIGFyZSBiZWluZyBlbWl0dGVkIHRvIHRoZSBzYW1lXG4gICAqIG1ldHJpYyBzdHJlYW0gdW5kZXIgZGlmZmVyZW50IHVuaXRzLlxuICAgKlxuICAgKiBUaGUgZGVmYXVsdCBpcyB0byB1c2UgYWxsIG1hdHJpYyBkYXR1bXMgaW4gdGhlIHN0cmVhbSwgcmVnYXJkbGVzcyBvZiB1bml0LFxuICAgKiB3aGljaCBpcyByZWNvbW1lbmRlZCBpbiBuZWFybHkgYWxsIGNhc2VzLlxuICAgKlxuICAgKiBDbG91ZFdhdGNoIGRvZXMgbm90IGhvbm9yIHRoaXMgcHJvcGVydHkgZm9yIGdyYXBocy5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBBbGwgbWV0cmljIGRhdHVtcyBpbiB0aGUgZ2l2ZW4gbWV0cmljIHN0cmVhbVxuICAgKi9cbiAgcmVhZG9ubHkgdW5pdD86IFVuaXQ7XG5cbiAgLyoqXG4gICAqIExhYmVsIGZvciB0aGlzIG1ldHJpYyB3aGVuIGFkZGVkIHRvIGEgR3JhcGggaW4gYSBEYXNoYm9hcmRcbiAgICpcbiAgICogWW91IGNhbiB1c2UgW2R5bmFtaWMgbGFiZWxzXShodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQW1hem9uQ2xvdWRXYXRjaC9sYXRlc3QvbW9uaXRvcmluZy9ncmFwaC1keW5hbWljLWxhYmVscy5odG1sKVxuICAgKiB0byBzaG93IHN1bW1hcnkgaW5mb3JtYXRpb24gYWJvdXQgdGhlIGVudGlyZSBkaXNwbGF5ZWQgdGltZSBzZXJpZXNcbiAgICogaW4gdGhlIGxlZ2VuZC4gRm9yIGV4YW1wbGUsIGlmIHlvdSB1c2U6XG4gICAqXG4gICAqIGBgYFxuICAgKiBbbWF4OiAke01BWH1dIE15TWV0cmljXG4gICAqIGBgYFxuICAgKlxuICAgKiBBcyB0aGUgbWV0cmljIGxhYmVsLCB0aGUgbWF4aW11bSB2YWx1ZSBpbiB0aGUgdmlzaWJsZSByYW5nZSB3aWxsXG4gICAqIGJlIHNob3duIG5leHQgdG8gdGhlIHRpbWUgc2VyaWVzIG5hbWUgaW4gdGhlIGdyYXBoJ3MgbGVnZW5kLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIE5vIGxhYmVsXG4gICAqL1xuICByZWFkb25seSBsYWJlbD86IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIGhleCBjb2xvciBjb2RlLCBwcmVmaXhlZCB3aXRoICcjJyAoZS5nLiAnIzAwZmYwMCcpLCB0byB1c2Ugd2hlbiB0aGlzIG1ldHJpYyBpcyByZW5kZXJlZCBvbiBhIGdyYXBoLlxuICAgKiBUaGUgYENvbG9yYCBjbGFzcyBoYXMgYSBzZXQgb2Ygc3RhbmRhcmQgY29sb3JzIHRoYXQgY2FuIGJlIHVzZWQgaGVyZS5cbiAgICogQGRlZmF1bHQgLSBBdXRvbWF0aWMgY29sb3JcbiAgICovXG4gIHJlYWRvbmx5IGNvbG9yPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBBY2NvdW50IHdoaWNoIHRoaXMgbWV0cmljIGNvbWVzIGZyb20uXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gRGVwbG95bWVudCBhY2NvdW50LlxuICAgKi9cbiAgcmVhZG9ubHkgYWNjb3VudD86IHN0cmluZztcblxuICAvKipcbiAgICogUmVnaW9uIHdoaWNoIHRoaXMgbWV0cmljIGNvbWVzIGZyb20uXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gRGVwbG95bWVudCByZWdpb24uXG4gICAqL1xuICByZWFkb25seSByZWdpb24/OiBzdHJpbmc7XG59XG5cbi8qKlxuICogUHJvcGVydGllcyBmb3IgYSBtZXRyaWNcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBNZXRyaWNQcm9wcyBleHRlbmRzIENvbW1vbk1ldHJpY09wdGlvbnMge1xuICAvKipcbiAgICogTmFtZXNwYWNlIG9mIHRoZSBtZXRyaWMuXG4gICAqL1xuICByZWFkb25seSBuYW1lc3BhY2U6IHN0cmluZztcblxuICAvKipcbiAgICogTmFtZSBvZiB0aGUgbWV0cmljLlxuICAgKi9cbiAgcmVhZG9ubHkgbWV0cmljTmFtZTogc3RyaW5nO1xufVxuXG4vKipcbiAqIFByb3BlcnRpZXMgb2YgYSBtZXRyaWMgdGhhdCBjYW4gYmUgY2hhbmdlZFxuICovXG5leHBvcnQgaW50ZXJmYWNlIE1ldHJpY09wdGlvbnMgZXh0ZW5kcyBDb21tb25NZXRyaWNPcHRpb25zIHtcbn1cblxuLyoqXG4gKiBDb25maWd1cmFibGUgb3B0aW9ucyBmb3IgTWF0aEV4cHJlc3Npb25zXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgTWF0aEV4cHJlc3Npb25PcHRpb25zIHtcbiAgLyoqXG4gICAqIExhYmVsIGZvciB0aGlzIGV4cHJlc3Npb24gd2hlbiBhZGRlZCB0byBhIEdyYXBoIGluIGEgRGFzaGJvYXJkXG4gICAqXG4gICAqIElmIHRoaXMgZXhwcmVzc2lvbiBldmFsdWF0ZXMgdG8gbW9yZSB0aGFuIG9uZSB0aW1lIHNlcmllcyAoZm9yXG4gICAqIGV4YW1wbGUsIHRocm91Z2ggdGhlIHVzZSBvZiBgTUVUUklDUygpYCBvciBgU0VBUkNIKClgIGV4cHJlc3Npb25zKSxcbiAgICogZWFjaCB0aW1lIHNlcmllcyB3aWxsIGFwcGVhciBpbiB0aGUgZ3JhcGggdXNpbmcgYSBjb21iaW5hdGlvbiBvZiB0aGVcbiAgICogZXhwcmVzc2lvbiBsYWJlbCBhbmQgdGhlIGluZGl2aWR1YWwgbWV0cmljIGxhYmVsLiBTcGVjaWZ5IHRoZSBlbXB0eVxuICAgKiBzdHJpbmcgKGAnJ2ApIHRvIHN1cHByZXNzIHRoZSBleHByZXNzaW9uIGxhYmVsIGFuZCBvbmx5IGtlZXAgdGhlXG4gICAqIG1ldHJpYyBsYWJlbC5cbiAgICpcbiAgICogWW91IGNhbiB1c2UgW2R5bmFtaWMgbGFiZWxzXShodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQW1hem9uQ2xvdWRXYXRjaC9sYXRlc3QvbW9uaXRvcmluZy9ncmFwaC1keW5hbWljLWxhYmVscy5odG1sKVxuICAgKiB0byBzaG93IHN1bW1hcnkgaW5mb3JtYXRpb24gYWJvdXQgdGhlIGRpc3BsYXllZCB0aW1lIHNlcmllc1xuICAgKiBpbiB0aGUgbGVnZW5kLiBGb3IgZXhhbXBsZSwgaWYgeW91IHVzZTpcbiAgICpcbiAgICogYGBgXG4gICAqIFttYXg6ICR7TUFYfV0gTXlNZXRyaWNcbiAgICogYGBgXG4gICAqXG4gICAqIEFzIHRoZSBtZXRyaWMgbGFiZWwsIHRoZSBtYXhpbXVtIHZhbHVlIGluIHRoZSB2aXNpYmxlIHJhbmdlIHdpbGxcbiAgICogYmUgc2hvd24gbmV4dCB0byB0aGUgdGltZSBzZXJpZXMgbmFtZSBpbiB0aGUgZ3JhcGgncyBsZWdlbmQuIElmIHRoZVxuICAgKiBtYXRoIGV4cHJlc3Npb24gcHJvZHVjZXMgbW9yZSB0aGFuIG9uZSB0aW1lIHNlcmllcywgdGhlIG1heGltdW1cbiAgICogd2lsbCBiZSBzaG93biBmb3IgZWFjaCBpbmRpdmlkdWFsIHRpbWUgc2VyaWVzIHByb2R1Y2UgYnkgdGhpc1xuICAgKiBtYXRoIGV4cHJlc3Npb24uXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gRXhwcmVzc2lvbiB2YWx1ZSBpcyB1c2VkIGFzIGxhYmVsXG4gICAqL1xuICByZWFkb25seSBsYWJlbD86IHN0cmluZztcblxuICAvKipcbiAgICogQ29sb3IgZm9yIHRoaXMgbWV0cmljIHdoZW4gYWRkZWQgdG8gYSBHcmFwaCBpbiBhIERhc2hib2FyZFxuICAgKlxuICAgKiBAZGVmYXVsdCAtIEF1dG9tYXRpYyBjb2xvclxuICAgKi9cbiAgcmVhZG9ubHkgY29sb3I/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBwZXJpb2Qgb3ZlciB3aGljaCB0aGUgZXhwcmVzc2lvbidzIHN0YXRpc3RpY3MgYXJlIGFwcGxpZWQuXG4gICAqXG4gICAqIFRoaXMgcGVyaW9kIG92ZXJyaWRlcyBhbGwgcGVyaW9kcyBpbiB0aGUgbWV0cmljcyB1c2VkIGluIHRoaXNcbiAgICogbWF0aCBleHByZXNzaW9uLlxuICAgKlxuICAgKiBAZGVmYXVsdCBEdXJhdGlvbi5taW51dGVzKDUpXG4gICAqL1xuICByZWFkb25seSBwZXJpb2Q/OiBjZGsuRHVyYXRpb247XG5cbiAgLyoqXG4gICAqIEFjY291bnQgdG8gZXZhbHVhdGUgc2VhcmNoIGV4cHJlc3Npb25zIHdpdGhpbi5cbiAgICpcbiAgICogU3BlY2lmeWluZyBhIHNlYXJjaEFjY291bnQgaGFzIG5vIGVmZmVjdCB0byB0aGUgYWNjb3VudCB1c2VkXG4gICAqIGZvciBtZXRyaWNzIHdpdGhpbiB0aGUgZXhwcmVzc2lvbiAocGFzc2VkIHZpYSB1c2luZ01ldHJpY3MpLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIERlcGxveW1lbnQgYWNjb3VudC5cbiAgICovXG4gIHJlYWRvbmx5IHNlYXJjaEFjY291bnQ/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFJlZ2lvbiB0byBldmFsdWF0ZSBzZWFyY2ggZXhwcmVzc2lvbnMgd2l0aGluLlxuICAgKlxuICAgKiBTcGVjaWZ5aW5nIGEgc2VhcmNoUmVnaW9uIGhhcyBubyBlZmZlY3QgdG8gdGhlIHJlZ2lvbiB1c2VkXG4gICAqIGZvciBtZXRyaWNzIHdpdGhpbiB0aGUgZXhwcmVzc2lvbiAocGFzc2VkIHZpYSB1c2luZ01ldHJpY3MpLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIERlcGxveW1lbnQgcmVnaW9uLlxuICAgKi9cbiAgcmVhZG9ubHkgc2VhcmNoUmVnaW9uPzogc3RyaW5nO1xufVxuXG4vKipcbiAqIFByb3BlcnRpZXMgZm9yIGEgTWF0aEV4cHJlc3Npb25cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBNYXRoRXhwcmVzc2lvblByb3BzIGV4dGVuZHMgTWF0aEV4cHJlc3Npb25PcHRpb25zIHtcbiAgLyoqXG4gICAqIFRoZSBleHByZXNzaW9uIGRlZmluaW5nIHRoZSBtZXRyaWMuXG4gICAqXG4gICAqIFdoZW4gYW4gZXhwcmVzc2lvbiBjb250YWlucyBhIFNFQVJDSCBmdW5jdGlvbiwgaXQgY2Fubm90IGJlIHVzZWRcbiAgICogd2l0aGluIGFuIEFsYXJtLlxuICAgKi9cbiAgcmVhZG9ubHkgZXhwcmVzc2lvbjogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgbWV0cmljcyB1c2VkIGluIHRoZSBleHByZXNzaW9uLCBpbiBhIG1hcC5cbiAgICpcbiAgICogVGhlIGtleSBpcyB0aGUgaWRlbnRpZmllciB0aGF0IHJlcHJlc2VudHMgdGhlIGdpdmVuIG1ldHJpYyBpbiB0aGVcbiAgICogZXhwcmVzc2lvbiwgYW5kIHRoZSB2YWx1ZSBpcyB0aGUgYWN0dWFsIE1ldHJpYyBvYmplY3QuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gRW1wdHkgbWFwLlxuICAgKi9cbiAgcmVhZG9ubHkgdXNpbmdNZXRyaWNzPzogUmVjb3JkPHN0cmluZywgSU1ldHJpYz47XG59XG5cbi8qKlxuICogQSBtZXRyaWMgZW1pdHRlZCBieSBhIHNlcnZpY2VcbiAqXG4gKiBUaGUgbWV0cmljIGlzIGEgY29tYmluYXRpb24gb2YgYSBtZXRyaWMgaWRlbnRpZmllciAobmFtZXNwYWNlLCBuYW1lIGFuZCBkaW1lbnNpb25zKVxuICogYW5kIGFuIGFnZ3JlZ2F0aW9uIGZ1bmN0aW9uIChzdGF0aXN0aWMsIHBlcmlvZCBhbmQgdW5pdCkuXG4gKlxuICogSXQgYWxzbyBjb250YWlucyBtZXRhZGF0YSB3aGljaCBpcyB1c2VkIG9ubHkgaW4gZ3JhcGhzLCBzdWNoIGFzIGNvbG9yIGFuZCBsYWJlbC5cbiAqIEl0IG1ha2VzIHNlbnNlIHRvIGVtYmVkIHRoaXMgaW4gaGVyZSwgc28gdGhhdCBjb21wb3VuZCBjb25zdHJ1Y3RzIGNhbiBhdHRhY2hcbiAqIHRoYXQgbWV0YWRhdGEgdG8gbWV0cmljcyB0aGV5IGV4cG9zZS5cbiAqXG4gKiBUaGlzIGNsYXNzIGRvZXMgbm90IHJlcHJlc2VudCBhIHJlc291cmNlLCBzbyBoZW5jZSBpcyBub3QgYSBjb25zdHJ1Y3QuIEluc3RlYWQsXG4gKiBNZXRyaWMgaXMgYW4gYWJzdHJhY3Rpb24gdGhhdCBtYWtlcyBpdCBlYXN5IHRvIHNwZWNpZnkgbWV0cmljcyBmb3IgdXNlIGluIGJvdGhcbiAqIGFsYXJtcyBhbmQgZ3JhcGhzLlxuICovXG5leHBvcnQgY2xhc3MgTWV0cmljIGltcGxlbWVudHMgSU1ldHJpYyB7XG4gIC8qKlxuICAgKiBHcmFudCBwZXJtaXNzaW9ucyB0byB0aGUgZ2l2ZW4gaWRlbnRpdHkgdG8gd3JpdGUgbWV0cmljcy5cbiAgICpcbiAgICogQHBhcmFtIGdyYW50ZWUgVGhlIElBTSBpZGVudGl0eSB0byBnaXZlIHBlcm1pc3Npb25zIHRvLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBncmFudFB1dE1ldHJpY0RhdGEoZ3JhbnRlZTogaWFtLklHcmFudGFibGUpOiBpYW0uR3JhbnQge1xuICAgIHJldHVybiBpYW0uR3JhbnQuYWRkVG9QcmluY2lwYWwoe1xuICAgICAgZ3JhbnRlZSxcbiAgICAgIGFjdGlvbnM6IFsnY2xvdWR3YXRjaDpQdXRNZXRyaWNEYXRhJ10sXG4gICAgICByZXNvdXJjZUFybnM6IFsnKiddLFxuICAgIH0pO1xuICB9XG5cbiAgLyoqIERpbWVuc2lvbnMgb2YgdGhpcyBtZXRyaWMgKi9cbiAgcHVibGljIHJlYWRvbmx5IGRpbWVuc2lvbnM/OiBEaW1lbnNpb25IYXNoO1xuICAvKiogTmFtZXNwYWNlIG9mIHRoaXMgbWV0cmljICovXG4gIHB1YmxpYyByZWFkb25seSBuYW1lc3BhY2U6IHN0cmluZztcbiAgLyoqIE5hbWUgb2YgdGhpcyBtZXRyaWMgKi9cbiAgcHVibGljIHJlYWRvbmx5IG1ldHJpY05hbWU6IHN0cmluZztcbiAgLyoqIFBlcmlvZCBvZiB0aGlzIG1ldHJpYyAqL1xuICBwdWJsaWMgcmVhZG9ubHkgcGVyaW9kOiBjZGsuRHVyYXRpb247XG4gIC8qKiBTdGF0aXN0aWMgb2YgdGhpcyBtZXRyaWMgKi9cbiAgcHVibGljIHJlYWRvbmx5IHN0YXRpc3RpYzogc3RyaW5nO1xuICAvKiogTGFiZWwgZm9yIHRoaXMgbWV0cmljIHdoZW4gYWRkZWQgdG8gYSBHcmFwaCBpbiBhIERhc2hib2FyZCAqL1xuICBwdWJsaWMgcmVhZG9ubHkgbGFiZWw/OiBzdHJpbmc7XG4gIC8qKiBUaGUgaGV4IGNvbG9yIGNvZGUgdXNlZCB3aGVuIHRoaXMgbWV0cmljIGlzIHJlbmRlcmVkIG9uIGEgZ3JhcGguICovXG4gIHB1YmxpYyByZWFkb25seSBjb2xvcj86IHN0cmluZztcblxuICAvKiogVW5pdCBvZiB0aGUgbWV0cmljLiAqL1xuICBwdWJsaWMgcmVhZG9ubHkgdW5pdD86IFVuaXQ7XG5cbiAgLyoqIEFjY291bnQgd2hpY2ggdGhpcyBtZXRyaWMgY29tZXMgZnJvbSAqL1xuICBwdWJsaWMgcmVhZG9ubHkgYWNjb3VudD86IHN0cmluZztcblxuICAvKiogUmVnaW9uIHdoaWNoIHRoaXMgbWV0cmljIGNvbWVzIGZyb20uICovXG4gIHB1YmxpYyByZWFkb25seSByZWdpb24/OiBzdHJpbmc7XG5cbiAgLyoqIFdhcm5pbmdzIGF0dGFjaGVkIHRvIHRoaXMgbWV0cmljLiAqL1xuICBwdWJsaWMgcmVhZG9ubHkgd2FybmluZ3M/OiBzdHJpbmdbXTtcblxuICBjb25zdHJ1Y3Rvcihwcm9wczogTWV0cmljUHJvcHMpIHtcbiAgICB0aGlzLnBlcmlvZCA9IHByb3BzLnBlcmlvZCB8fCBjZGsuRHVyYXRpb24ubWludXRlcyg1KTtcbiAgICBjb25zdCBwZXJpb2RTZWMgPSB0aGlzLnBlcmlvZC50b1NlY29uZHMoKTtcbiAgICBpZiAocGVyaW9kU2VjICE9PSAxICYmIHBlcmlvZFNlYyAhPT0gNSAmJiBwZXJpb2RTZWMgIT09IDEwICYmIHBlcmlvZFNlYyAhPT0gMzAgJiYgcGVyaW9kU2VjICUgNjAgIT09IDApIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgJ3BlcmlvZCcgbXVzdCBiZSAxLCA1LCAxMCwgMzAsIG9yIGEgbXVsdGlwbGUgb2YgNjAgc2Vjb25kcywgcmVjZWl2ZWQgJHtwZXJpb2RTZWN9YCk7XG4gICAgfVxuXG4gICAgdGhpcy53YXJuaW5ncyA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLmRpbWVuc2lvbnMgPSB0aGlzLnZhbGlkYXRlRGltZW5zaW9ucyhwcm9wcy5kaW1lbnNpb25zTWFwID8/IHByb3BzLmRpbWVuc2lvbnMpO1xuICAgIHRoaXMubmFtZXNwYWNlID0gcHJvcHMubmFtZXNwYWNlO1xuICAgIHRoaXMubWV0cmljTmFtZSA9IHByb3BzLm1ldHJpY05hbWU7XG5cbiAgICBjb25zdCBwYXJzZWRTdGF0ID0gcGFyc2VTdGF0aXN0aWMocHJvcHMuc3RhdGlzdGljIHx8IFN0YXRzLkFWRVJBR0UpO1xuICAgIGlmIChwYXJzZWRTdGF0LnR5cGUgPT09ICdnZW5lcmljJykge1xuICAgICAgLy8gVW5yZWNvZ25pemVkIHN0YXRpc3RpYywgZG8gbm90IHRocm93LCBqdXN0IHdhcm5cbiAgICAgIC8vIFRoZXJlIG1heSBiZSBhIG5ldyBzdGF0aXN0aWMgdGhhdCB0aGlzIGxpYiBkb2VzIG5vdCBzdXBwb3J0IHlldFxuICAgICAgY29uc3QgbGFiZWwgPSBwcm9wcy5sYWJlbCA/IGAsIGxhYmVsIFwiJHtwcm9wcy5sYWJlbH1cImA6ICcnO1xuICAgICAgdGhpcy53YXJuaW5ncyA9IFtcbiAgICAgICAgYFVucmVjb2duaXplZCBzdGF0aXN0aWMgXCIke3Byb3BzLnN0YXRpc3RpY31cIiBmb3IgbWV0cmljIHdpdGggbmFtZXNwYWNlIFwiJHtwcm9wcy5uYW1lc3BhY2V9XCIke2xhYmVsfSBhbmQgbWV0cmljIG5hbWUgXCIke3Byb3BzLm1ldHJpY05hbWV9XCIuYCArXG4gICAgICAgICAgJyBQcmVmZXJhYmx5IHVzZSB0aGUgYGF3c19jbG91ZHdhdGNoLlN0YXRzYCBoZWxwZXIgY2xhc3MgdG8gc3BlY2lmeSBhIHN0YXRpc3RpYy4nICtcbiAgICAgICAgICAnIFlvdSBjYW4gaWdub3JlIHRoaXMgd2FybmluZyBpZiB5b3VyIHN0YXRpc3RpYyBpcyB2YWxpZCBidXQgbm90IHlldCBzdXBwb3J0ZWQgYnkgdGhlIGBhd3NfY2xvdWR3YXRjaC5TdGF0c2AgaGVscGVyIGNsYXNzLicsXG4gICAgICBdO1xuICAgIH1cbiAgICB0aGlzLnN0YXRpc3RpYyA9IG5vcm1hbGl6ZVN0YXRpc3RpYyhwYXJzZWRTdGF0KTtcblxuICAgIHRoaXMubGFiZWwgPSBwcm9wcy5sYWJlbDtcbiAgICB0aGlzLmNvbG9yID0gcHJvcHMuY29sb3I7XG4gICAgdGhpcy51bml0ID0gcHJvcHMudW5pdDtcbiAgICB0aGlzLmFjY291bnQgPSBwcm9wcy5hY2NvdW50O1xuICAgIHRoaXMucmVnaW9uID0gcHJvcHMucmVnaW9uO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybiBhIGNvcHkgb2YgTWV0cmljIGB3aXRoYCBwcm9wZXJ0aWVzIGNoYW5nZWQuXG4gICAqXG4gICAqIEFsbCBwcm9wZXJ0aWVzIGV4Y2VwdCBuYW1lc3BhY2UgYW5kIG1ldHJpY05hbWUgY2FuIGJlIGNoYW5nZWQuXG4gICAqXG4gICAqIEBwYXJhbSBwcm9wcyBUaGUgc2V0IG9mIHByb3BlcnRpZXMgdG8gY2hhbmdlLlxuICAgKi9cbiAgcHVibGljIHdpdGgocHJvcHM6IE1ldHJpY09wdGlvbnMpOiBNZXRyaWMge1xuICAgIC8vIFNob3J0LWNpcmN1aXQgY3JlYXRpbmcgYSBuZXcgb2JqZWN0IGlmIHRoZXJlIHdvdWxkIGJlIG5vIGVmZmVjdGl2ZSBjaGFuZ2VcbiAgICBpZiAoKHByb3BzLmxhYmVsID09PSB1bmRlZmluZWQgfHwgcHJvcHMubGFiZWwgPT09IHRoaXMubGFiZWwpXG4gICAgICAmJiAocHJvcHMuY29sb3IgPT09IHVuZGVmaW5lZCB8fCBwcm9wcy5jb2xvciA9PT0gdGhpcy5jb2xvcilcbiAgICAgICYmIChwcm9wcy5zdGF0aXN0aWMgPT09IHVuZGVmaW5lZCB8fCBwcm9wcy5zdGF0aXN0aWMgPT09IHRoaXMuc3RhdGlzdGljKVxuICAgICAgJiYgKHByb3BzLnVuaXQgPT09IHVuZGVmaW5lZCB8fCBwcm9wcy51bml0ID09PSB0aGlzLnVuaXQpXG4gICAgICAmJiAocHJvcHMuYWNjb3VudCA9PT0gdW5kZWZpbmVkIHx8IHByb3BzLmFjY291bnQgPT09IHRoaXMuYWNjb3VudClcbiAgICAgICYmIChwcm9wcy5yZWdpb24gPT09IHVuZGVmaW5lZCB8fCBwcm9wcy5yZWdpb24gPT09IHRoaXMucmVnaW9uKVxuICAgICAgLy8gRm9yIHRoZXNlIHdlJ3JlIG5vdCBnb2luZyB0byBkbyBkZWVwIGVxdWFsaXR5LCBtaXNzZXMgc29tZSBvcHBvcnR1bml0eSBmb3Igb3B0aW1pemF0aW9uXG4gICAgICAvLyBidXQgdGhhdCdzIG9rYXkuXG4gICAgICAmJiAocHJvcHMuZGltZW5zaW9ucyA9PT0gdW5kZWZpbmVkKVxuICAgICAgJiYgKHByb3BzLmRpbWVuc2lvbnNNYXAgPT09IHVuZGVmaW5lZClcbiAgICAgICYmIChwcm9wcy5wZXJpb2QgPT09IHVuZGVmaW5lZCB8fCBwcm9wcy5wZXJpb2QudG9TZWNvbmRzKCkgPT09IHRoaXMucGVyaW9kLnRvU2Vjb25kcygpKSkge1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBNZXRyaWMoe1xuICAgICAgZGltZW5zaW9uc01hcDogcHJvcHMuZGltZW5zaW9uc01hcCA/PyBwcm9wcy5kaW1lbnNpb25zID8/IHRoaXMuZGltZW5zaW9ucyxcbiAgICAgIG5hbWVzcGFjZTogdGhpcy5uYW1lc3BhY2UsXG4gICAgICBtZXRyaWNOYW1lOiB0aGlzLm1ldHJpY05hbWUsXG4gICAgICBwZXJpb2Q6IGlmVW5kZWZpbmVkKHByb3BzLnBlcmlvZCwgdGhpcy5wZXJpb2QpLFxuICAgICAgc3RhdGlzdGljOiBpZlVuZGVmaW5lZChwcm9wcy5zdGF0aXN0aWMsIHRoaXMuc3RhdGlzdGljKSxcbiAgICAgIHVuaXQ6IGlmVW5kZWZpbmVkKHByb3BzLnVuaXQsIHRoaXMudW5pdCksXG4gICAgICBsYWJlbDogaWZVbmRlZmluZWQocHJvcHMubGFiZWwsIHRoaXMubGFiZWwpLFxuICAgICAgY29sb3I6IGlmVW5kZWZpbmVkKHByb3BzLmNvbG9yLCB0aGlzLmNvbG9yKSxcbiAgICAgIGFjY291bnQ6IGlmVW5kZWZpbmVkKHByb3BzLmFjY291bnQsIHRoaXMuYWNjb3VudCksXG4gICAgICByZWdpb246IGlmVW5kZWZpbmVkKHByb3BzLnJlZ2lvbiwgdGhpcy5yZWdpb24pLFxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEF0dGFjaCB0aGUgbWV0cmljIG9iamVjdCB0byB0aGUgZ2l2ZW4gY29uc3RydWN0IHNjb3BlXG4gICAqXG4gICAqIFJldHVybnMgYSBNZXRyaWMgb2JqZWN0IHRoYXQgdXNlcyB0aGUgYWNjb3VudCBhbmQgcmVnaW9uIGZyb20gdGhlIFN0YWNrXG4gICAqIHRoZSBnaXZlbiBjb25zdHJ1Y3QgaXMgZGVmaW5lZCBpbi4gSWYgdGhlIG1ldHJpYyBpcyBzdWJzZXF1ZW50bHkgdXNlZFxuICAgKiBpbiBhIERhc2hib2FyZCBvciBBbGFybSBpbiBhIGRpZmZlcmVudCBTdGFjayBkZWZpbmVkIGluIGEgZGlmZmVyZW50XG4gICAqIGFjY291bnQgb3IgcmVnaW9uLCB0aGUgYXBwcm9wcmlhdGUgJ3JlZ2lvbicgYW5kICdhY2NvdW50JyBmaWVsZHNcbiAgICogd2lsbCBiZSBhZGRlZCB0byBpdC5cbiAgICpcbiAgICogSWYgdGhlIHNjb3BlIHdlIGF0dGFjaCB0byBpcyBpbiBhbiBlbnZpcm9ubWVudC1hZ25vc3RpYyBzdGFjayxcbiAgICogbm90aGluZyBpcyBkb25lIGFuZCB0aGUgc2FtZSBNZXRyaWMgb2JqZWN0IGlzIHJldHVybmVkLlxuICAgKi9cbiAgcHVibGljIGF0dGFjaFRvKHNjb3BlOiBJQ29uc3RydWN0KTogTWV0cmljIHtcbiAgICBjb25zdCBzdGFjayA9IGNkay5TdGFjay5vZihzY29wZSk7XG5cbiAgICByZXR1cm4gdGhpcy53aXRoKHtcbiAgICAgIHJlZ2lvbjogY2RrLlRva2VuLmlzVW5yZXNvbHZlZChzdGFjay5yZWdpb24pID8gdW5kZWZpbmVkIDogc3RhY2sucmVnaW9uLFxuICAgICAgYWNjb3VudDogY2RrLlRva2VuLmlzVW5yZXNvbHZlZChzdGFjay5hY2NvdW50KSA/IHVuZGVmaW5lZCA6IHN0YWNrLmFjY291bnQsXG4gICAgfSk7XG4gIH1cblxuICBwdWJsaWMgdG9NZXRyaWNDb25maWcoKTogTWV0cmljQ29uZmlnIHtcbiAgICBjb25zdCBkaW1zID0gdGhpcy5kaW1lbnNpb25zQXNMaXN0KCk7XG4gICAgcmV0dXJuIHtcbiAgICAgIG1ldHJpY1N0YXQ6IHtcbiAgICAgICAgZGltZW5zaW9uczogZGltcy5sZW5ndGggPiAwID8gZGltcyA6IHVuZGVmaW5lZCxcbiAgICAgICAgbmFtZXNwYWNlOiB0aGlzLm5hbWVzcGFjZSxcbiAgICAgICAgbWV0cmljTmFtZTogdGhpcy5tZXRyaWNOYW1lLFxuICAgICAgICBwZXJpb2Q6IHRoaXMucGVyaW9kLFxuICAgICAgICBzdGF0aXN0aWM6IHRoaXMuc3RhdGlzdGljLFxuICAgICAgICB1bml0RmlsdGVyOiB0aGlzLnVuaXQsXG4gICAgICAgIGFjY291bnQ6IHRoaXMuYWNjb3VudCxcbiAgICAgICAgcmVnaW9uOiB0aGlzLnJlZ2lvbixcbiAgICAgIH0sXG4gICAgICByZW5kZXJpbmdQcm9wZXJ0aWVzOiB7XG4gICAgICAgIGNvbG9yOiB0aGlzLmNvbG9yLFxuICAgICAgICBsYWJlbDogdGhpcy5sYWJlbCxcbiAgICAgIH0sXG4gICAgfTtcbiAgfVxuXG4gIC8qKiBAZGVwcmVjYXRlZCB1c2UgdG9NZXRyaWNDb25maWcoKSAqL1xuICBwdWJsaWMgdG9BbGFybUNvbmZpZygpOiBNZXRyaWNBbGFybUNvbmZpZyB7XG4gICAgY29uc3QgbWV0cmljQ29uZmlnID0gdGhpcy50b01ldHJpY0NvbmZpZygpO1xuICAgIGlmIChtZXRyaWNDb25maWcubWV0cmljU3RhdCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1VzaW5nIGEgbWF0aCBleHByZXNzaW9uIGlzIG5vdCBzdXBwb3J0ZWQgaGVyZS4gUGFzcyBhIFxcJ01ldHJpY1xcJyBvYmplY3QgaW5zdGVhZCcpO1xuICAgIH1cblxuICAgIGNvbnN0IHBhcnNlZCA9IHBhcnNlU3RhdGlzdGljKG1ldHJpY0NvbmZpZy5tZXRyaWNTdGF0LnN0YXRpc3RpYyk7XG5cbiAgICBsZXQgZXh0ZW5kZWRTdGF0aXN0aWM6IHN0cmluZyB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZDtcbiAgICBpZiAocGFyc2VkLnR5cGUgPT09ICdzaW5nbGUnKSB7XG4gICAgICBleHRlbmRlZFN0YXRpc3RpYyA9IHNpbmdsZVN0YXRpc3RpY1RvU3RyaW5nKHBhcnNlZCk7XG4gICAgfSBlbHNlIGlmIChwYXJzZWQudHlwZSA9PT0gJ3BhaXInKSB7XG4gICAgICBleHRlbmRlZFN0YXRpc3RpYyA9IHBhaXJTdGF0aXN0aWNUb1N0cmluZyhwYXJzZWQpO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICBkaW1lbnNpb25zOiBtZXRyaWNDb25maWcubWV0cmljU3RhdC5kaW1lbnNpb25zLFxuICAgICAgbmFtZXNwYWNlOiBtZXRyaWNDb25maWcubWV0cmljU3RhdC5uYW1lc3BhY2UsXG4gICAgICBtZXRyaWNOYW1lOiBtZXRyaWNDb25maWcubWV0cmljU3RhdC5tZXRyaWNOYW1lLFxuICAgICAgcGVyaW9kOiBtZXRyaWNDb25maWcubWV0cmljU3RhdC5wZXJpb2QudG9TZWNvbmRzKCksXG4gICAgICBzdGF0aXN0aWM6IHBhcnNlZC50eXBlID09PSAnc2ltcGxlJyA/IHBhcnNlZC5zdGF0aXN0aWMgYXMgU3RhdGlzdGljIDogdW5kZWZpbmVkLFxuICAgICAgZXh0ZW5kZWRTdGF0aXN0aWMsXG4gICAgICB1bml0OiB0aGlzLnVuaXQsXG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAZGVwcmVjYXRlZCB1c2UgdG9NZXRyaWNDb25maWcoKVxuICAgKi9cbiAgcHVibGljIHRvR3JhcGhDb25maWcoKTogTWV0cmljR3JhcGhDb25maWcge1xuICAgIGNvbnN0IG1ldHJpY0NvbmZpZyA9IHRoaXMudG9NZXRyaWNDb25maWcoKTtcbiAgICBpZiAobWV0cmljQ29uZmlnLm1ldHJpY1N0YXQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdVc2luZyBhIG1hdGggZXhwcmVzc2lvbiBpcyBub3Qgc3VwcG9ydGVkIGhlcmUuIFBhc3MgYSBcXCdNZXRyaWNcXCcgb2JqZWN0IGluc3RlYWQnKTtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgZGltZW5zaW9uczogbWV0cmljQ29uZmlnLm1ldHJpY1N0YXQuZGltZW5zaW9ucyxcbiAgICAgIG5hbWVzcGFjZTogbWV0cmljQ29uZmlnLm1ldHJpY1N0YXQubmFtZXNwYWNlLFxuICAgICAgbWV0cmljTmFtZTogbWV0cmljQ29uZmlnLm1ldHJpY1N0YXQubWV0cmljTmFtZSxcbiAgICAgIHJlbmRlcmluZ1Byb3BlcnRpZXM6IHtcbiAgICAgICAgcGVyaW9kOiBtZXRyaWNDb25maWcubWV0cmljU3RhdC5wZXJpb2QudG9TZWNvbmRzKCksXG4gICAgICAgIHN0YXQ6IG1ldHJpY0NvbmZpZy5tZXRyaWNTdGF0LnN0YXRpc3RpYyxcbiAgICAgICAgY29sb3I6IGFzU3RyaW5nKG1ldHJpY0NvbmZpZy5yZW5kZXJpbmdQcm9wZXJ0aWVzPy5jb2xvciksXG4gICAgICAgIGxhYmVsOiBhc1N0cmluZyhtZXRyaWNDb25maWcucmVuZGVyaW5nUHJvcGVydGllcz8ubGFiZWwpLFxuICAgICAgfSxcbiAgICAgIC8vIGRlcHJlY2F0ZWQgcHJvcGVydGllcyBmb3IgYmFja3dhcmRzIGNvbXBhdGliaWxpdHlcbiAgICAgIHBlcmlvZDogbWV0cmljQ29uZmlnLm1ldHJpY1N0YXQucGVyaW9kLnRvU2Vjb25kcygpLFxuICAgICAgc3RhdGlzdGljOiBtZXRyaWNDb25maWcubWV0cmljU3RhdC5zdGF0aXN0aWMsXG4gICAgICBjb2xvcjogYXNTdHJpbmcobWV0cmljQ29uZmlnLnJlbmRlcmluZ1Byb3BlcnRpZXM/LmNvbG9yKSxcbiAgICAgIGxhYmVsOiBhc1N0cmluZyhtZXRyaWNDb25maWcucmVuZGVyaW5nUHJvcGVydGllcz8ubGFiZWwpLFxuICAgICAgdW5pdDogdGhpcy51bml0LFxuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogTWFrZSBhIG5ldyBBbGFybSBmb3IgdGhpcyBtZXRyaWNcbiAgICpcbiAgICogQ29tYmluZXMgYm90aCBwcm9wZXJ0aWVzIHRoYXQgbWF5IGFkanVzdCB0aGUgbWV0cmljIChhZ2dyZWdhdGlvbikgYXMgd2VsbFxuICAgKiBhcyBhbGFybSBwcm9wZXJ0aWVzLlxuICAgKi9cbiAgcHVibGljIGNyZWF0ZUFsYXJtKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBDcmVhdGVBbGFybU9wdGlvbnMpOiBBbGFybSB7XG4gICAgcmV0dXJuIG5ldyBBbGFybShzY29wZSwgaWQsIHtcbiAgICAgIG1ldHJpYzogdGhpcy53aXRoKHtcbiAgICAgICAgc3RhdGlzdGljOiBwcm9wcy5zdGF0aXN0aWMsXG4gICAgICAgIHBlcmlvZDogcHJvcHMucGVyaW9kLFxuICAgICAgfSksXG4gICAgICBhbGFybU5hbWU6IHByb3BzLmFsYXJtTmFtZSxcbiAgICAgIGFsYXJtRGVzY3JpcHRpb246IHByb3BzLmFsYXJtRGVzY3JpcHRpb24sXG4gICAgICBjb21wYXJpc29uT3BlcmF0b3I6IHByb3BzLmNvbXBhcmlzb25PcGVyYXRvcixcbiAgICAgIGRhdGFwb2ludHNUb0FsYXJtOiBwcm9wcy5kYXRhcG9pbnRzVG9BbGFybSxcbiAgICAgIHRocmVzaG9sZDogcHJvcHMudGhyZXNob2xkLFxuICAgICAgZXZhbHVhdGlvblBlcmlvZHM6IHByb3BzLmV2YWx1YXRpb25QZXJpb2RzLFxuICAgICAgZXZhbHVhdGVMb3dTYW1wbGVDb3VudFBlcmNlbnRpbGU6IHByb3BzLmV2YWx1YXRlTG93U2FtcGxlQ291bnRQZXJjZW50aWxlLFxuICAgICAgdHJlYXRNaXNzaW5nRGF0YTogcHJvcHMudHJlYXRNaXNzaW5nRGF0YSxcbiAgICAgIGFjdGlvbnNFbmFibGVkOiBwcm9wcy5hY3Rpb25zRW5hYmxlZCxcbiAgICB9KTtcbiAgfVxuXG4gIHB1YmxpYyB0b1N0cmluZygpIHtcbiAgICByZXR1cm4gdGhpcy5sYWJlbCB8fCB0aGlzLm1ldHJpY05hbWU7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJuIHRoZSBkaW1lbnNpb25zIG9mIHRoaXMgTWV0cmljIGFzIGEgbGlzdCBvZiBEaW1lbnNpb24uXG4gICAqL1xuICBwcml2YXRlIGRpbWVuc2lvbnNBc0xpc3QoKTogRGltZW5zaW9uW10ge1xuICAgIGNvbnN0IGRpbXMgPSB0aGlzLmRpbWVuc2lvbnM7XG5cbiAgICBpZiAoZGltcyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gW107XG4gICAgfVxuXG4gICAgY29uc3QgbGlzdCA9IE9iamVjdC5rZXlzKGRpbXMpLnNvcnQoKS5tYXAoa2V5ID0+ICh7IG5hbWU6IGtleSwgdmFsdWU6IGRpbXNba2V5XSB9KSk7XG5cbiAgICByZXR1cm4gbGlzdDtcbiAgfVxuXG4gIHByaXZhdGUgdmFsaWRhdGVEaW1lbnNpb25zKGRpbXM/OiBEaW1lbnNpb25IYXNoKTogRGltZW5zaW9uSGFzaCB8IHVuZGVmaW5lZCB7XG4gICAgaWYgKCFkaW1zKSB7XG4gICAgICByZXR1cm4gZGltcztcbiAgICB9XG5cbiAgICB2YXIgZGltc0FycmF5ID0gT2JqZWN0LmtleXMoZGltcyk7XG4gICAgaWYgKGRpbXNBcnJheT8ubGVuZ3RoID4gMTApIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgVGhlIG1heGltdW0gbnVtYmVyIG9mIGRpbWVuc2lvbnMgaXMgMTAsIHJlY2VpdmVkICR7ZGltc0FycmF5Lmxlbmd0aH1gKTtcbiAgICB9XG5cbiAgICBkaW1zQXJyYXkubWFwKGtleSA9PiB7XG4gICAgICBpZiAoZGltc1trZXldID09PSB1bmRlZmluZWQgfHwgZGltc1trZXldID09PSBudWxsKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgRGltZW5zaW9uIHZhbHVlIG9mICcke2RpbXNba2V5XX0nIGlzIGludmFsaWRgKTtcbiAgICAgIH07XG4gICAgICBpZiAoa2V5Lmxlbmd0aCA8IDEgfHwga2V5Lmxlbmd0aCA+IDI1NSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYERpbWVuc2lvbiBuYW1lIG11c3QgYmUgYXQgbGVhc3QgMSBhbmQgbm8gbW9yZSB0aGFuIDI1NSBjaGFyYWN0ZXJzOyByZWNlaXZlZCAke2tleX1gKTtcbiAgICAgIH07XG5cbiAgICAgIGlmIChkaW1zW2tleV0ubGVuZ3RoIDwgMSB8fCBkaW1zW2tleV0ubGVuZ3RoID4gMjU1KSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgRGltZW5zaW9uIHZhbHVlIG11c3QgYmUgYXQgbGVhc3QgMSBhbmQgbm8gbW9yZSB0aGFuIDI1NSBjaGFyYWN0ZXJzOyByZWNlaXZlZCAke2RpbXNba2V5XX1gKTtcbiAgICAgIH07XG4gICAgfSk7XG5cbiAgICByZXR1cm4gZGltcztcbiAgfVxufVxuXG5mdW5jdGlvbiBhc1N0cmluZyh4PzogdW5rbm93bik6IHN0cmluZyB8IHVuZGVmaW5lZCB7XG4gIGlmICh4ID09PSB1bmRlZmluZWQpIHsgcmV0dXJuIHVuZGVmaW5lZDsgfVxuICBpZiAodHlwZW9mIHggIT09ICdzdHJpbmcnKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBFeHBlY3RlZCBzdHJpbmcsIGdvdCAke3h9YCk7XG4gIH1cbiAgcmV0dXJuIHg7XG59XG5cbi8qKlxuICogQSBtYXRoIGV4cHJlc3Npb24gYnVpbHQgd2l0aCBtZXRyaWMocykgZW1pdHRlZCBieSBhIHNlcnZpY2VcbiAqXG4gKiBUaGUgbWF0aCBleHByZXNzaW9uIGlzIGEgY29tYmluYXRpb24gb2YgYW4gZXhwcmVzc2lvbiAoeCt5KSBhbmQgbWV0cmljcyB0byBhcHBseSBleHByZXNzaW9uIG9uLlxuICogSXQgYWxzbyBjb250YWlucyBtZXRhZGF0YSB3aGljaCBpcyB1c2VkIG9ubHkgaW4gZ3JhcGhzLCBzdWNoIGFzIGNvbG9yIGFuZCBsYWJlbC5cbiAqIEl0IG1ha2VzIHNlbnNlIHRvIGVtYmVkIHRoaXMgaW4gaGVyZSwgc28gdGhhdCBjb21wb3VuZCBjb25zdHJ1Y3RzIGNhbiBhdHRhY2hcbiAqIHRoYXQgbWV0YWRhdGEgdG8gbWV0cmljcyB0aGV5IGV4cG9zZS5cbiAqXG4gKiBNYXRoRXhwcmVzc2lvbiBjYW4gYWxzbyBiZSB1c2VkIGZvciBzZWFyY2ggZXhwcmVzc2lvbnMuIEluIHRoaXMgY2FzZSxcbiAqIGl0IGFsc28gb3B0aW9uYWxseSBhY2NlcHRzIGEgc2VhcmNoUmVnaW9uIGFuZCBzZWFyY2hBY2NvdW50IHByb3BlcnR5IGZvciBjcm9zcy1lbnZpcm9ubWVudFxuICogc2VhcmNoIGV4cHJlc3Npb25zLlxuICpcbiAqIFRoaXMgY2xhc3MgZG9lcyBub3QgcmVwcmVzZW50IGEgcmVzb3VyY2UsIHNvIGhlbmNlIGlzIG5vdCBhIGNvbnN0cnVjdC4gSW5zdGVhZCxcbiAqIE1hdGhFeHByZXNzaW9uIGlzIGFuIGFic3RyYWN0aW9uIHRoYXQgbWFrZXMgaXQgZWFzeSB0byBzcGVjaWZ5IG1ldHJpY3MgZm9yIHVzZSBpbiBib3RoXG4gKiBhbGFybXMgYW5kIGdyYXBocy5cbiAqL1xuZXhwb3J0IGNsYXNzIE1hdGhFeHByZXNzaW9uIGltcGxlbWVudHMgSU1ldHJpYyB7XG4gIC8qKlxuICAgKiBUaGUgZXhwcmVzc2lvbiBkZWZpbmluZyB0aGUgbWV0cmljLlxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IGV4cHJlc3Npb246IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIG1ldHJpY3MgdXNlZCBpbiB0aGUgZXhwcmVzc2lvbiBhcyBLZXlWYWx1ZVBhaXIgPGlkLCBtZXRyaWM+LlxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IHVzaW5nTWV0cmljczogUmVjb3JkPHN0cmluZywgSU1ldHJpYz47XG5cbiAgLyoqXG4gICAqIExhYmVsIGZvciB0aGlzIG1ldHJpYyB3aGVuIGFkZGVkIHRvIGEgR3JhcGguXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgbGFiZWw/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBoZXggY29sb3IgY29kZSwgcHJlZml4ZWQgd2l0aCAnIycgKGUuZy4gJyMwMGZmMDAnKSwgdG8gdXNlIHdoZW4gdGhpcyBtZXRyaWMgaXMgcmVuZGVyZWQgb24gYSBncmFwaC5cbiAgICogVGhlIGBDb2xvcmAgY2xhc3MgaGFzIGEgc2V0IG9mIHN0YW5kYXJkIGNvbG9ycyB0aGF0IGNhbiBiZSB1c2VkIGhlcmUuXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgY29sb3I/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIEFnZ3JlZ2F0aW9uIHBlcmlvZCBvZiB0aGlzIG1ldHJpY1xuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IHBlcmlvZDogY2RrLkR1cmF0aW9uO1xuXG4gIC8qKlxuICAgKiBBY2NvdW50IHRvIGV2YWx1YXRlIHNlYXJjaCBleHByZXNzaW9ucyB3aXRoaW4uXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgc2VhcmNoQWNjb3VudD86IHN0cmluZztcblxuICAvKipcbiAgICogUmVnaW9uIHRvIGV2YWx1YXRlIHNlYXJjaCBleHByZXNzaW9ucyB3aXRoaW4uXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgc2VhcmNoUmVnaW9uPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBXYXJuaW5ncyBnZW5lcmF0ZWQgYnkgdGhpcyBtYXRoIGV4cHJlc3Npb25cbiAgICovXG4gIHB1YmxpYyByZWFkb25seSB3YXJuaW5ncz86IHN0cmluZ1tdO1xuXG4gIGNvbnN0cnVjdG9yKHByb3BzOiBNYXRoRXhwcmVzc2lvblByb3BzKSB7XG4gICAgdGhpcy5wZXJpb2QgPSBwcm9wcy5wZXJpb2QgfHwgY2RrLkR1cmF0aW9uLm1pbnV0ZXMoNSk7XG4gICAgdGhpcy5leHByZXNzaW9uID0gcHJvcHMuZXhwcmVzc2lvbjtcbiAgICB0aGlzLnVzaW5nTWV0cmljcyA9IGNoYW5nZUFsbFBlcmlvZHMocHJvcHMudXNpbmdNZXRyaWNzID8/IHt9LCB0aGlzLnBlcmlvZCk7XG4gICAgdGhpcy5sYWJlbCA9IHByb3BzLmxhYmVsO1xuICAgIHRoaXMuY29sb3IgPSBwcm9wcy5jb2xvcjtcbiAgICB0aGlzLnNlYXJjaEFjY291bnQgPSBwcm9wcy5zZWFyY2hBY2NvdW50O1xuICAgIHRoaXMuc2VhcmNoUmVnaW9uID0gcHJvcHMuc2VhcmNoUmVnaW9uO1xuXG4gICAgY29uc3QgaW52YWxpZFZhcmlhYmxlTmFtZXMgPSBPYmplY3Qua2V5cyh0aGlzLnVzaW5nTWV0cmljcykuZmlsdGVyKHggPT4gIXZhbGlkVmFyaWFibGVOYW1lKHgpKTtcbiAgICBpZiAoaW52YWxpZFZhcmlhYmxlTmFtZXMubGVuZ3RoID4gMCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIHZhcmlhYmxlIG5hbWVzIGluIGV4cHJlc3Npb246ICR7aW52YWxpZFZhcmlhYmxlTmFtZXN9LiBNdXN0IHN0YXJ0IHdpdGggbG93ZXJjYXNlIGxldHRlciBhbmQgb25seSBjb250YWluIGFscGhhbnVtZXJpY3MuYCk7XG4gICAgfVxuXG4gICAgdGhpcy52YWxpZGF0ZU5vSWRDb25mbGljdHMoKTtcblxuICAgIC8vIENoZWNrIHRoYXQgYWxsIElEcyB1c2VkIGluIHRoZSBleHByZXNzaW9uIGFyZSBhbHNvIGluIHRoZSBgdXNpbmdNZXRyaWNzYCBtYXAuIFdlXG4gICAgLy8gY2FuJ3QgdGhyb3cgb24gdGhpcyBhbnltb3JlIHNpbmNlIHdlIGRpZG4ndCB1c2UgdG8gZG8gdGhpcyB2YWxpZGF0aW9uIGZyb20gdGhlIHN0YXJ0XG4gICAgLy8gYW5kIG5vdyB0aGVyZSB3aWxsIGJlIGxvYWRzIG9mIHBlb3BsZSB3aG8gYXJlIHZpb2xhdGluZyB0aGUgZXhwZWN0ZWQgY29udHJhY3QsIGJ1dFxuICAgIC8vIHdlIGNhbiBhZGQgd2FybmluZ3MuXG4gICAgY29uc3QgbWlzc2luZ0lkZW50aWZpZXJzID0gYWxsSWRlbnRpZmllcnNJbkV4cHJlc3Npb24odGhpcy5leHByZXNzaW9uKS5maWx0ZXIoaSA9PiAhdGhpcy51c2luZ01ldHJpY3NbaV0pO1xuXG4gICAgY29uc3Qgd2FybmluZ3M6IHN0cmluZ1tdID0gW107XG5cbiAgICBpZiAoIXRoaXMuZXhwcmVzc2lvbi50b1VwcGVyQ2FzZSgpLm1hdGNoKCdcXFxccypTRUxFQ1R8U0VBUkNIfE1FVFJJQ1NcXFxccy4qJykgJiYgbWlzc2luZ0lkZW50aWZpZXJzLmxlbmd0aCA+IDApIHtcbiAgICAgIHdhcm5pbmdzLnB1c2goYE1hdGggZXhwcmVzc2lvbiAnJHt0aGlzLmV4cHJlc3Npb259JyByZWZlcmVuY2VzIHVua25vd24gaWRlbnRpZmllcnM6ICR7bWlzc2luZ0lkZW50aWZpZXJzLmpvaW4oJywgJyl9LiBQbGVhc2UgYWRkIHRoZW0gdG8gdGhlICd1c2luZ01ldHJpY3MnIG1hcC5gKTtcbiAgICB9XG5cbiAgICAvLyBBbHNvIGNvcHkgd2FybmluZ3MgZnJvbSBkZWVwZXIgbGV2ZWxzIHNvIGdyYXBocywgYWxhcm1zIG9ubHkgaGF2ZSB0byBpbnNwZWN0IHRoZSB0b3AtbGV2ZWwgb2JqZWN0c1xuICAgIGZvciAoY29uc3QgbSBvZiBPYmplY3QudmFsdWVzKHRoaXMudXNpbmdNZXRyaWNzKSkge1xuICAgICAgd2FybmluZ3MucHVzaCguLi5tLndhcm5pbmdzID8/IFtdKTtcbiAgICB9XG5cbiAgICBpZiAod2FybmluZ3MubGVuZ3RoID4gMCkge1xuICAgICAgdGhpcy53YXJuaW5ncyA9IHdhcm5pbmdzO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm4gYSBjb3B5IG9mIE1ldHJpYyB3aXRoIHByb3BlcnRpZXMgY2hhbmdlZC5cbiAgICpcbiAgICogQWxsIHByb3BlcnRpZXMgZXhjZXB0IG5hbWVzcGFjZSBhbmQgbWV0cmljTmFtZSBjYW4gYmUgY2hhbmdlZC5cbiAgICpcbiAgICogQHBhcmFtIHByb3BzIFRoZSBzZXQgb2YgcHJvcGVydGllcyB0byBjaGFuZ2UuXG4gICAqL1xuICBwdWJsaWMgd2l0aChwcm9wczogTWF0aEV4cHJlc3Npb25PcHRpb25zKTogTWF0aEV4cHJlc3Npb24ge1xuICAgIC8vIFNob3J0LWNpcmN1aXQgY3JlYXRpbmcgYSBuZXcgb2JqZWN0IGlmIHRoZXJlIHdvdWxkIGJlIG5vIGVmZmVjdGl2ZSBjaGFuZ2VcbiAgICBpZiAoKHByb3BzLmxhYmVsID09PSB1bmRlZmluZWQgfHwgcHJvcHMubGFiZWwgPT09IHRoaXMubGFiZWwpXG4gICAgICAmJiAocHJvcHMuY29sb3IgPT09IHVuZGVmaW5lZCB8fCBwcm9wcy5jb2xvciA9PT0gdGhpcy5jb2xvcilcbiAgICAgICYmIChwcm9wcy5wZXJpb2QgPT09IHVuZGVmaW5lZCB8fCBwcm9wcy5wZXJpb2QudG9TZWNvbmRzKCkgPT09IHRoaXMucGVyaW9kLnRvU2Vjb25kcygpKVxuICAgICAgJiYgKHByb3BzLnNlYXJjaEFjY291bnQgPT09IHVuZGVmaW5lZCB8fCBwcm9wcy5zZWFyY2hBY2NvdW50ID09PSB0aGlzLnNlYXJjaEFjY291bnQpXG4gICAgICAmJiAocHJvcHMuc2VhcmNoUmVnaW9uID09PSB1bmRlZmluZWQgfHwgcHJvcHMuc2VhcmNoUmVnaW9uID09PSB0aGlzLnNlYXJjaFJlZ2lvbikpIHtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHJldHVybiBuZXcgTWF0aEV4cHJlc3Npb24oe1xuICAgICAgZXhwcmVzc2lvbjogdGhpcy5leHByZXNzaW9uLFxuICAgICAgdXNpbmdNZXRyaWNzOiB0aGlzLnVzaW5nTWV0cmljcyxcbiAgICAgIGxhYmVsOiBpZlVuZGVmaW5lZChwcm9wcy5sYWJlbCwgdGhpcy5sYWJlbCksXG4gICAgICBjb2xvcjogaWZVbmRlZmluZWQocHJvcHMuY29sb3IsIHRoaXMuY29sb3IpLFxuICAgICAgcGVyaW9kOiBpZlVuZGVmaW5lZChwcm9wcy5wZXJpb2QsIHRoaXMucGVyaW9kKSxcbiAgICAgIHNlYXJjaEFjY291bnQ6IGlmVW5kZWZpbmVkKHByb3BzLnNlYXJjaEFjY291bnQsIHRoaXMuc2VhcmNoQWNjb3VudCksXG4gICAgICBzZWFyY2hSZWdpb246IGlmVW5kZWZpbmVkKHByb3BzLnNlYXJjaFJlZ2lvbiwgdGhpcy5zZWFyY2hSZWdpb24pLFxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEBkZXByZWNhdGVkIHVzZSB0b01ldHJpY0NvbmZpZygpXG4gICAqL1xuICBwdWJsaWMgdG9BbGFybUNvbmZpZygpOiBNZXRyaWNBbGFybUNvbmZpZyB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdVc2luZyBhIG1hdGggZXhwcmVzc2lvbiBpcyBub3Qgc3VwcG9ydGVkIGhlcmUuIFBhc3MgYSBcXCdNZXRyaWNcXCcgb2JqZWN0IGluc3RlYWQnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAZGVwcmVjYXRlZCB1c2UgdG9NZXRyaWNDb25maWcoKVxuICAgKi9cbiAgcHVibGljIHRvR3JhcGhDb25maWcoKTogTWV0cmljR3JhcGhDb25maWcge1xuICAgIHRocm93IG5ldyBFcnJvcignVXNpbmcgYSBtYXRoIGV4cHJlc3Npb24gaXMgbm90IHN1cHBvcnRlZCBoZXJlLiBQYXNzIGEgXFwnTWV0cmljXFwnIG9iamVjdCBpbnN0ZWFkJyk7XG4gIH1cblxuICBwdWJsaWMgdG9NZXRyaWNDb25maWcoKTogTWV0cmljQ29uZmlnIHtcbiAgICByZXR1cm4ge1xuICAgICAgbWF0aEV4cHJlc3Npb246IHtcbiAgICAgICAgcGVyaW9kOiB0aGlzLnBlcmlvZC50b1NlY29uZHMoKSxcbiAgICAgICAgZXhwcmVzc2lvbjogdGhpcy5leHByZXNzaW9uLFxuICAgICAgICB1c2luZ01ldHJpY3M6IHRoaXMudXNpbmdNZXRyaWNzLFxuICAgICAgICBzZWFyY2hBY2NvdW50OiB0aGlzLnNlYXJjaEFjY291bnQsXG4gICAgICAgIHNlYXJjaFJlZ2lvbjogdGhpcy5zZWFyY2hSZWdpb24sXG4gICAgICB9LFxuICAgICAgcmVuZGVyaW5nUHJvcGVydGllczoge1xuICAgICAgICBsYWJlbDogdGhpcy5sYWJlbCxcbiAgICAgICAgY29sb3I6IHRoaXMuY29sb3IsXG4gICAgICB9LFxuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogTWFrZSBhIG5ldyBBbGFybSBmb3IgdGhpcyBtZXRyaWNcbiAgICpcbiAgICogQ29tYmluZXMgYm90aCBwcm9wZXJ0aWVzIHRoYXQgbWF5IGFkanVzdCB0aGUgbWV0cmljIChhZ2dyZWdhdGlvbikgYXMgd2VsbFxuICAgKiBhcyBhbGFybSBwcm9wZXJ0aWVzLlxuICAgKi9cbiAgcHVibGljIGNyZWF0ZUFsYXJtKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBDcmVhdGVBbGFybU9wdGlvbnMpOiBBbGFybSB7XG4gICAgcmV0dXJuIG5ldyBBbGFybShzY29wZSwgaWQsIHtcbiAgICAgIG1ldHJpYzogdGhpcy53aXRoKHtcbiAgICAgICAgcGVyaW9kOiBwcm9wcy5wZXJpb2QsXG4gICAgICB9KSxcbiAgICAgIGFsYXJtTmFtZTogcHJvcHMuYWxhcm1OYW1lLFxuICAgICAgYWxhcm1EZXNjcmlwdGlvbjogcHJvcHMuYWxhcm1EZXNjcmlwdGlvbixcbiAgICAgIGNvbXBhcmlzb25PcGVyYXRvcjogcHJvcHMuY29tcGFyaXNvbk9wZXJhdG9yLFxuICAgICAgZGF0YXBvaW50c1RvQWxhcm06IHByb3BzLmRhdGFwb2ludHNUb0FsYXJtLFxuICAgICAgdGhyZXNob2xkOiBwcm9wcy50aHJlc2hvbGQsXG4gICAgICBldmFsdWF0aW9uUGVyaW9kczogcHJvcHMuZXZhbHVhdGlvblBlcmlvZHMsXG4gICAgICBldmFsdWF0ZUxvd1NhbXBsZUNvdW50UGVyY2VudGlsZTogcHJvcHMuZXZhbHVhdGVMb3dTYW1wbGVDb3VudFBlcmNlbnRpbGUsXG4gICAgICB0cmVhdE1pc3NpbmdEYXRhOiBwcm9wcy50cmVhdE1pc3NpbmdEYXRhLFxuICAgICAgYWN0aW9uc0VuYWJsZWQ6IHByb3BzLmFjdGlvbnNFbmFibGVkLFxuICAgIH0pO1xuICB9XG5cbiAgcHVibGljIHRvU3RyaW5nKCkge1xuICAgIHJldHVybiB0aGlzLmxhYmVsIHx8IHRoaXMuZXhwcmVzc2lvbjtcbiAgfVxuXG4gIHByaXZhdGUgdmFsaWRhdGVOb0lkQ29uZmxpY3RzKCkge1xuICAgIGNvbnN0IHNlZW4gPSBuZXcgTWFwPHN0cmluZywgSU1ldHJpYz4oKTtcbiAgICB2aXNpdCh0aGlzKTtcblxuICAgIGZ1bmN0aW9uIHZpc2l0KG1ldHJpYzogSU1ldHJpYykge1xuICAgICAgZGlzcGF0Y2hNZXRyaWMobWV0cmljLCB7XG4gICAgICAgIHdpdGhTdGF0KCkge1xuICAgICAgICAgIC8vIE5vdGhpbmdcbiAgICAgICAgfSxcbiAgICAgICAgd2l0aEV4cHJlc3Npb24oZXhwcikge1xuICAgICAgICAgIGZvciAoY29uc3QgW2lkLCBzdWJNZXRyaWNdIG9mIE9iamVjdC5lbnRyaWVzKGV4cHIudXNpbmdNZXRyaWNzKSkge1xuICAgICAgICAgICAgY29uc3QgZXhpc3RpbmcgPSBzZWVuLmdldChpZCk7XG4gICAgICAgICAgICBpZiAoZXhpc3RpbmcgJiYgbWV0cmljS2V5KGV4aXN0aW5nKSAhPT0gbWV0cmljS2V5KHN1Yk1ldHJpYykpIHtcbiAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBUaGUgSUQgJyR7aWR9JyB1c2VkIGZvciB0d28gbWV0cmljcyBpbiB0aGUgZXhwcmVzc2lvbjogJyR7c3ViTWV0cmljfScgYW5kICcke2V4aXN0aW5nfScuIFJlbmFtZSBvbmUuYCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzZWVuLnNldChpZCwgc3ViTWV0cmljKTtcbiAgICAgICAgICAgIHZpc2l0KHN1Yk1ldHJpYyk7XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogUGF0dGVybiBmb3IgYSB2YXJpYWJsZSBuYW1lLiBBbHBoYW51bSBzdGFydGluZyB3aXRoIGxvd2VyY2FzZS5cbiAqL1xuY29uc3QgVkFSSUFCTEVfUEFUID0gJ1thLXpdW2EtekEtWjAtOV9dKic7XG5cbmNvbnN0IFZBTElEX1ZBUklBQkxFID0gbmV3IFJlZ0V4cChgXiR7VkFSSUFCTEVfUEFUfSRgKTtcbmNvbnN0IEZJTkRfVkFSSUFCTEUgPSBuZXcgUmVnRXhwKFZBUklBQkxFX1BBVCwgJ2cnKTtcblxuZnVuY3Rpb24gdmFsaWRWYXJpYWJsZU5hbWUoeDogc3RyaW5nKSB7XG4gIHJldHVybiBWQUxJRF9WQVJJQUJMRS50ZXN0KHgpO1xufVxuXG4vKipcbiAqIFJldHVybiBhbGwgdmFyaWFibGUgbmFtZXMgdXNlZCBpbiBhbiBleHByZXNzaW9uXG4gKi9cbmZ1bmN0aW9uIGFsbElkZW50aWZpZXJzSW5FeHByZXNzaW9uKHg6IHN0cmluZykge1xuICByZXR1cm4gQXJyYXkuZnJvbShtYXRjaEFsbCh4LCBGSU5EX1ZBUklBQkxFKSkubWFwKG0gPT4gbVswXSk7XG59XG5cbi8qKlxuICogUHJvcGVydGllcyBuZWVkZWQgdG8gbWFrZSBhbiBhbGFybSBmcm9tIGEgbWV0cmljXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQ3JlYXRlQWxhcm1PcHRpb25zIHtcbiAgLyoqXG4gICAqIFRoZSBwZXJpb2Qgb3ZlciB3aGljaCB0aGUgc3BlY2lmaWVkIHN0YXRpc3RpYyBpcyBhcHBsaWVkLlxuICAgKlxuICAgKiBDYW5ub3QgYmUgdXNlZCB3aXRoIGBNYXRoRXhwcmVzc2lvbmAgb2JqZWN0cy5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBUaGUgcGVyaW9kIGZyb20gdGhlIG1ldHJpY1xuICAgKiBAZGVwcmVjYXRlZCBVc2UgYG1ldHJpYy53aXRoKHsgcGVyaW9kOiAuLi4gfSlgIHRvIGVuY29kZSB0aGUgcGVyaW9kIGludG8gdGhlIE1ldHJpYyBvYmplY3RcbiAgICovXG4gIHJlYWRvbmx5IHBlcmlvZD86IGNkay5EdXJhdGlvbjtcblxuICAvKipcbiAgICogV2hhdCBmdW5jdGlvbiB0byB1c2UgZm9yIGFnZ3JlZ2F0aW5nLlxuICAgKlxuICAgKiBDYW4gYmUgb25lIG9mIHRoZSBmb2xsb3dpbmc6XG4gICAqXG4gICAqIC0gXCJNaW5pbXVtXCIgfCBcIm1pblwiXG4gICAqIC0gXCJNYXhpbXVtXCIgfCBcIm1heFwiXG4gICAqIC0gXCJBdmVyYWdlXCIgfCBcImF2Z1wiXG4gICAqIC0gXCJTdW1cIiB8IFwic3VtXCJcbiAgICogLSBcIlNhbXBsZUNvdW50IHwgXCJuXCJcbiAgICogLSBcInBOTi5OTlwiXG4gICAqXG4gICAqIENhbm5vdCBiZSB1c2VkIHdpdGggYE1hdGhFeHByZXNzaW9uYCBvYmplY3RzLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIFRoZSBzdGF0aXN0aWMgZnJvbSB0aGUgbWV0cmljXG4gICAqIEBkZXByZWNhdGVkIFVzZSBgbWV0cmljLndpdGgoeyBzdGF0aXN0aWM6IC4uLiB9KWAgdG8gZW5jb2RlIHRoZSBwZXJpb2QgaW50byB0aGUgTWV0cmljIG9iamVjdFxuICAgKi9cbiAgcmVhZG9ubHkgc3RhdGlzdGljPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBOYW1lIG9mIHRoZSBhbGFybVxuICAgKlxuICAgKiBAZGVmYXVsdCBBdXRvbWF0aWNhbGx5IGdlbmVyYXRlZCBuYW1lXG4gICAqL1xuICByZWFkb25seSBhbGFybU5hbWU/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIERlc2NyaXB0aW9uIGZvciB0aGUgYWxhcm1cbiAgICpcbiAgICogQGRlZmF1bHQgTm8gZGVzY3JpcHRpb25cbiAgICovXG4gIHJlYWRvbmx5IGFsYXJtRGVzY3JpcHRpb24/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIENvbXBhcmlzb24gdG8gdXNlIHRvIGNoZWNrIGlmIG1ldHJpYyBpcyBicmVhY2hpbmdcbiAgICpcbiAgICogQGRlZmF1bHQgR3JlYXRlclRoYW5PckVxdWFsVG9UaHJlc2hvbGRcbiAgICovXG4gIHJlYWRvbmx5IGNvbXBhcmlzb25PcGVyYXRvcj86IENvbXBhcmlzb25PcGVyYXRvcjtcblxuICAvKipcbiAgICogVGhlIHZhbHVlIGFnYWluc3Qgd2hpY2ggdGhlIHNwZWNpZmllZCBzdGF0aXN0aWMgaXMgY29tcGFyZWQuXG4gICAqL1xuICByZWFkb25seSB0aHJlc2hvbGQ6IG51bWJlcjtcblxuICAvKipcbiAgICogVGhlIG51bWJlciBvZiBwZXJpb2RzIG92ZXIgd2hpY2ggZGF0YSBpcyBjb21wYXJlZCB0byB0aGUgc3BlY2lmaWVkIHRocmVzaG9sZC5cbiAgICovXG4gIHJlYWRvbmx5IGV2YWx1YXRpb25QZXJpb2RzOiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIFNwZWNpZmllcyB3aGV0aGVyIHRvIGV2YWx1YXRlIHRoZSBkYXRhIGFuZCBwb3RlbnRpYWxseSBjaGFuZ2UgdGhlIGFsYXJtIHN0YXRlIGlmIHRoZXJlIGFyZSB0b28gZmV3IGRhdGEgcG9pbnRzIHRvIGJlIHN0YXRpc3RpY2FsbHkgc2lnbmlmaWNhbnQuXG4gICAqXG4gICAqIFVzZWQgb25seSBmb3IgYWxhcm1zIHRoYXQgYXJlIGJhc2VkIG9uIHBlcmNlbnRpbGVzLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIE5vdCBjb25maWd1cmVkLlxuICAgKi9cbiAgcmVhZG9ubHkgZXZhbHVhdGVMb3dTYW1wbGVDb3VudFBlcmNlbnRpbGU/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFNldHMgaG93IHRoaXMgYWxhcm0gaXMgdG8gaGFuZGxlIG1pc3NpbmcgZGF0YSBwb2ludHMuXG4gICAqXG4gICAqIEBkZWZhdWx0IFRyZWF0TWlzc2luZ0RhdGEuTWlzc2luZ1xuICAgKi9cbiAgcmVhZG9ubHkgdHJlYXRNaXNzaW5nRGF0YT86IFRyZWF0TWlzc2luZ0RhdGE7XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdGhlIGFjdGlvbnMgZm9yIHRoaXMgYWxhcm0gYXJlIGVuYWJsZWRcbiAgICpcbiAgICogQGRlZmF1bHQgdHJ1ZVxuICAgKi9cbiAgcmVhZG9ubHkgYWN0aW9uc0VuYWJsZWQ/OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBUaGUgbnVtYmVyIG9mIGRhdGFwb2ludHMgdGhhdCBtdXN0IGJlIGJyZWFjaGluZyB0byB0cmlnZ2VyIHRoZSBhbGFybS4gVGhpcyBpcyB1c2VkIG9ubHkgaWYgeW91IGFyZSBzZXR0aW5nIGFuIFwiTVxuICAgKiBvdXQgb2YgTlwiIGFsYXJtLiBJbiB0aGF0IGNhc2UsIHRoaXMgdmFsdWUgaXMgdGhlIE0uIEZvciBtb3JlIGluZm9ybWF0aW9uLCBzZWUgRXZhbHVhdGluZyBhbiBBbGFybSBpbiB0aGUgQW1hem9uXG4gICAqIENsb3VkV2F0Y2ggVXNlciBHdWlkZS5cbiAgICpcbiAgICogQGRlZmF1bHQgYGBldmFsdWF0aW9uUGVyaW9kc2BgXG4gICAqXG4gICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FtYXpvbkNsb3VkV2F0Y2gvbGF0ZXN0L21vbml0b3JpbmcvQWxhcm1UaGF0U2VuZHNFbWFpbC5odG1sI2FsYXJtLWV2YWx1YXRpb25cbiAgICovXG4gIHJlYWRvbmx5IGRhdGFwb2ludHNUb0FsYXJtPzogbnVtYmVyO1xufVxuXG5mdW5jdGlvbiBpZlVuZGVmaW5lZDxUPih4OiBUIHwgdW5kZWZpbmVkLCBkZWY6IFQgfCB1bmRlZmluZWQpOiBUIHwgdW5kZWZpbmVkIHtcbiAgaWYgKHggIT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybiB4O1xuICB9XG4gIHJldHVybiBkZWY7XG59XG5cbi8qKlxuICogQ2hhbmdlIHBlcmlvZHMgb2YgYWxsIG1ldHJpY3MgaW4gdGhlIG1hcFxuICovXG5mdW5jdGlvbiBjaGFuZ2VBbGxQZXJpb2RzKG1ldHJpY3M6IFJlY29yZDxzdHJpbmcsIElNZXRyaWM+LCBwZXJpb2Q6IGNkay5EdXJhdGlvbik6IFJlY29yZDxzdHJpbmcsIElNZXRyaWM+IHtcbiAgY29uc3QgcmV0OiBSZWNvcmQ8c3RyaW5nLCBJTWV0cmljPiA9IHt9O1xuICBmb3IgKGNvbnN0IFtpZCwgbWV0cmljXSBvZiBPYmplY3QuZW50cmllcyhtZXRyaWNzKSkge1xuICAgIHJldFtpZF0gPSBjaGFuZ2VQZXJpb2QobWV0cmljLCBwZXJpb2QpO1xuICB9XG4gIHJldHVybiByZXQ7XG59XG5cbi8qKlxuICogUmV0dXJuIGEgbmV3IG1ldHJpYyBvYmplY3Qgd2hpY2ggaXMgdGhlIHNhbWUgdHlwZSBhcyB0aGUgaW5wdXQgb2JqZWN0LCBidXQgd2l0aCB0aGUgcGVyaW9kIGNoYW5nZWRcbiAqXG4gKiBSZWxpZXMgb24gdGhlIGZhY3QgdGhhdCBpbXBsZW1lbnRhdGlvbnMgb2YgYElNZXRyaWNgIGFyZSBhbHNvIHN1cHBvc2VkIHRvIGhhdmVcbiAqIGFuIGltcGxlbWVudGF0aW9uIG9mIGB3aXRoYCB0aGF0IGFjY2VwdHMgYW4gYXJndW1lbnQgY2FsbGVkIGBwZXJpb2RgLiBTZWUgYElNb2RpZmlhYmxlTWV0cmljYC5cbiAqL1xuZnVuY3Rpb24gY2hhbmdlUGVyaW9kKG1ldHJpYzogSU1ldHJpYywgcGVyaW9kOiBjZGsuRHVyYXRpb24pOiBJTWV0cmljIHtcbiAgaWYgKGlzTW9kaWZpYWJsZU1ldHJpYyhtZXRyaWMpKSB7XG4gICAgcmV0dXJuIG1ldHJpYy53aXRoKHsgcGVyaW9kIH0pO1xuICB9XG5cbiAgdGhyb3cgbmV3IEVycm9yKGBNZXRyaWMgb2JqZWN0IHNob3VsZCBhbHNvIGltcGxlbWVudCAnd2l0aCc6ICR7bWV0cmljfWApO1xufVxuXG4vKipcbiAqIFByaXZhdGUgcHJvdG9jb2wgZm9yIG1ldHJpY3NcbiAqXG4gKiBNZXRyaWMgdHlwZXMgdXNlZCBpbiBhIE1hdGhFeHByZXNzaW9uIG5lZWQgdG8gaW1wbGVtZW50IGF0IGxlYXN0IHRoaXM6XG4gKiBhIGB3aXRoYCBtZXRob2QgdGhhdCB0YWtlcyBhdCBsZWFzdCBhIGBwZXJpb2RgIGFuZCByZXR1cm5zIGEgbW9kaWZpZWQgY29weVxuICogb2YgdGhlIG1ldHJpYyBvYmplY3QuXG4gKlxuICogV2UgcHV0IGl0IGhlcmUgaW5zdGVhZCBvZiBvbiBgSU1ldHJpY2AgYmVjYXVzZSB0aGVyZSBpcyBubyB3YXkgdG8gdHlwZVxuICogaXQgaW4ganNpaSBpbiBhIHdheSB0aGF0IGNvbmNyZXRlIGltcGxlbWVudGF0aW9ucyBgTWV0cmljYCBhbmQgYE1hdGhFeHByZXNzaW9uYFxuICogY2FuIGJlIHN0YXRpY2FsbHkgdHlwYWJsZSBhYm91dCB0aGUgZmllbGRzIHRoYXQgYXJlIGNoYW5nZWFibGU6IGFsbFxuICogYHdpdGhgIG1ldGhvZHMgd291bGQgbmVlZCB0byB0YWtlIHRoZSBzYW1lIGFyZ3VtZW50IHR5cGUsIGJ1dCBub3QgYWxsXG4gKiBjbGFzc2VzIGhhdmUgdGhlIHNhbWUgYHdpdGhgLWFibGUgcHJvcGVydGllcy5cbiAqXG4gKiBUaGlzIGNsYXNzIGV4aXN0cyB0byBwcmV2ZW50IGhhdmluZyB0byB1c2UgYGluc3RhbmNlb2ZgIGluIHRoZSBgY2hhbmdlUGVyaW9kYFxuICogZnVuY3Rpb24sIHNvIHRoYXQgd2UgaGF2ZSBhIHN5c3RlbSB3aGVyZSBpbiBwcmluY2lwbGUgbmV3IGltcGxlbWVudGF0aW9uc1xuICogb2YgYElNZXRyaWNgIGNhbiBiZSBhZGRlZC4gQmVjYXVzZSBpdCB3aWxsIGJlIHJhcmUsIHRoZSBtZWNoYW5pc20gZG9lc24ndCBoYXZlXG4gKiB0byBiZSBleHBvc2VkIHZlcnkgd2VsbCwganVzdCBoYXMgdG8gYmUgcG9zc2libGUuXG4gKi9cbmludGVyZmFjZSBJTW9kaWZpYWJsZU1ldHJpYyB7XG4gIHdpdGgob3B0aW9uczogeyBwZXJpb2Q/OiBjZGsuRHVyYXRpb24gfSk6IElNZXRyaWM7XG59XG5cbmZ1bmN0aW9uIGlzTW9kaWZpYWJsZU1ldHJpYyhtOiBhbnkpOiBtIGlzIElNb2RpZmlhYmxlTWV0cmljIHtcbiAgcmV0dXJuIHR5cGVvZiBtID09PSAnb2JqZWN0JyAmJiBtICE9PSBudWxsICYmICEhbS53aXRoO1xufVxuXG4vLyBQb2x5ZmlsbCBmb3Igc3RyaW5nLm1hdGNoQWxsKHJlZ2V4cClcbmZ1bmN0aW9uIG1hdGNoQWxsKHg6IHN0cmluZywgcmU6IFJlZ0V4cCk6IFJlZ0V4cE1hdGNoQXJyYXlbXSB7XG4gIGNvbnN0IHJldCA9IG5ldyBBcnJheTxSZWdFeHBNYXRjaEFycmF5PigpO1xuICBsZXQgbTogUmVnRXhwRXhlY0FycmF5IHwgbnVsbDtcbiAgd2hpbGUgKG0gPSByZS5leGVjKHgpKSB7XG4gICAgcmV0LnB1c2gobSk7XG4gIH1cbiAgcmV0dXJuIHJldDtcbn1cbiJdfQ==