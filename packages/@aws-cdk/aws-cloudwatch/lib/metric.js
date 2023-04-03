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
        const parsedStat = (0, statistic_1.parseStatistic)(props.statistic || stats_1.Stats.AVERAGE);
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
        this.statistic = (0, statistic_1.normalizeStatistic)(parsedStat);
        this.label = props.label;
        this.color = props.color;
        this.unit = props.unit;
        this.account = props.account;
        this.region = props.region;
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
        const parsed = (0, statistic_1.parseStatistic)(metricConfig.metricStat.statistic);
        let extendedStatistic = undefined;
        if (parsed.type === 'single') {
            extendedStatistic = (0, statistic_1.singleStatisticToString)(parsed);
        }
        else if (parsed.type === 'pair') {
            extendedStatistic = (0, statistic_1.pairStatisticToString)(parsed);
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
_a = JSII_RTTI_SYMBOL_1;
Metric[_a] = { fqn: "@aws-cdk/aws-cloudwatch.Metric", version: "0.0.0" };
exports.Metric = Metric;
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
            (0, metric_util_1.dispatchMetric)(metric, {
                withStat() {
                    // Nothing
                },
                withExpression(expr) {
                    for (const [id, subMetric] of Object.entries(expr.usingMetrics)) {
                        const existing = seen.get(id);
                        if (existing && (0, metric_util_1.metricKey)(existing) !== (0, metric_util_1.metricKey)(subMetric)) {
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
_b = JSII_RTTI_SYMBOL_1;
MathExpression[_b] = { fqn: "@aws-cdk/aws-cloudwatch.MathExpression", version: "0.0.0" };
exports.MathExpression = MathExpression;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWV0cmljLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibWV0cmljLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLHdDQUF3QztBQUN4QyxxQ0FBcUM7QUFFckMsbUNBQXNFO0FBRXRFLHVEQUFrRTtBQUNsRSxtREFBeUg7QUFDekgsbUNBQWdDO0FBa09oQzs7Ozs7Ozs7Ozs7OztHQWFHO0FBQ0gsTUFBYSxNQUFNO0lBQ2pCOzs7O09BSUc7SUFDSSxNQUFNLENBQUMsa0JBQWtCLENBQUMsT0FBdUI7UUFDdEQsT0FBTyxHQUFHLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQztZQUM5QixPQUFPO1lBQ1AsT0FBTyxFQUFFLENBQUMsMEJBQTBCLENBQUM7WUFDckMsWUFBWSxFQUFFLENBQUMsR0FBRyxDQUFDO1NBQ3BCLENBQUMsQ0FBQztLQUNKO0lBNkJELFlBQVksS0FBa0I7Ozs7OzsrQ0F6Q25CLE1BQU07Ozs7UUEwQ2YsSUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUMsTUFBTSxJQUFJLEdBQUcsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3RELE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFLENBQUM7UUFDMUMsSUFBSSxTQUFTLEtBQUssQ0FBQyxJQUFJLFNBQVMsS0FBSyxDQUFDLElBQUksU0FBUyxLQUFLLEVBQUUsSUFBSSxTQUFTLEtBQUssRUFBRSxJQUFJLFNBQVMsR0FBRyxFQUFFLEtBQUssQ0FBQyxFQUFFO1lBQ3RHLE1BQU0sSUFBSSxLQUFLLENBQUMsd0VBQXdFLFNBQVMsRUFBRSxDQUFDLENBQUM7U0FDdEc7UUFFRCxJQUFJLENBQUMsUUFBUSxHQUFHLFNBQVMsQ0FBQztRQUMxQixJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxLQUFLLENBQUMsYUFBYSxJQUFJLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUNuRixJ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QW9CO0lBQ3pELElBQUksa0JBQWtCLENBQUMsTUFBTSxDQUFDLEVBQUU7UUFDOUIsT0FBTyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQztLQUNoQztJQUVELE1BQU0sSUFBSSxLQUFLLENBQUMsK0NBQStDLE1BQU0sRUFBRSxDQUFDLENBQUM7QUFDM0UsQ0FBQztBQXdCRCxTQUFTLGtCQUFrQixDQUFDLENBQU07SUFDaEMsT0FBTyxPQUFPLENBQUMsS0FBSyxRQUFRLElBQUksQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztBQUN6RCxDQUFDO0FBRUQsdUNBQXVDO0FBQ3ZDLFNBQVMsUUFBUSxDQUFDLENBQVMsRUFBRSxFQUFVO0lBQ3JDLE1BQU0sR0FBRyxHQUFHLElBQUksS0FBSyxFQUFvQixDQUFDO0lBQzFDLElBQUksQ0FBeUIsQ0FBQztJQUM5QixPQUFPLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFO1FBQ3JCLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDYjtJQUNELE9BQU8sR0FBRyxDQUFDO0FBQ2IsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGlhbSBmcm9tICdAYXdzLWNkay9hd3MtaWFtJztcbmltcG9ydCAqIGFzIGNkayBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IENvbnN0cnVjdCwgSUNvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0IHsgQWxhcm0sIENvbXBhcmlzb25PcGVyYXRvciwgVHJlYXRNaXNzaW5nRGF0YSB9IGZyb20gJy4vYWxhcm0nO1xuaW1wb3J0IHsgRGltZW5zaW9uLCBJTWV0cmljLCBNZXRyaWNBbGFybUNvbmZpZywgTWV0cmljQ29uZmlnLCBNZXRyaWNHcmFwaENvbmZpZywgU3RhdGlzdGljLCBVbml0IH0gZnJvbSAnLi9tZXRyaWMtdHlwZXMnO1xuaW1wb3J0IHsgZGlzcGF0Y2hNZXRyaWMsIG1ldHJpY0tleSB9IGZyb20gJy4vcHJpdmF0ZS9tZXRyaWMtdXRpbCc7XG5pbXBvcnQgeyBub3JtYWxpemVTdGF0aXN0aWMsIHBhaXJTdGF0aXN0aWNUb1N0cmluZywgcGFyc2VTdGF0aXN0aWMsIHNpbmdsZVN0YXRpc3RpY1RvU3RyaW5nIH0gZnJvbSAnLi9wcml2YXRlL3N0YXRpc3RpYyc7XG5pbXBvcnQgeyBTdGF0cyB9IGZyb20gJy4vc3RhdHMnO1xuXG5leHBvcnQgdHlwZSBEaW1lbnNpb25IYXNoID0geyBbZGltOiBzdHJpbmddOiBhbnkgfTtcblxuZXhwb3J0IHR5cGUgRGltZW5zaW9uc01hcCA9IHsgW2RpbTogc3RyaW5nXTogc3RyaW5nIH07XG5cbi8qKlxuICogT3B0aW9ucyBzaGFyZWQgYnkgbW9zdCBtZXRob2RzIGFjY2VwdGluZyBtZXRyaWMgb3B0aW9uc1xuICovXG5leHBvcnQgaW50ZXJmYWNlIENvbW1vbk1ldHJpY09wdGlvbnMge1xuICAvKipcbiAgICogVGhlIHBlcmlvZCBvdmVyIHdoaWNoIHRoZSBzcGVjaWZpZWQgc3RhdGlzdGljIGlzIGFwcGxpZWQuXG4gICAqXG4gICAqIEBkZWZhdWx0IER1cmF0aW9uLm1pbnV0ZXMoNSlcbiAgICovXG4gIHJlYWRvbmx5IHBlcmlvZD86IGNkay5EdXJhdGlvbjtcblxuICAvKipcbiAgICogV2hhdCBmdW5jdGlvbiB0byB1c2UgZm9yIGFnZ3JlZ2F0aW5nLlxuICAgKlxuICAgKiBVc2UgdGhlIGBhd3NfY2xvdWR3YXRjaC5TdGF0c2AgaGVscGVyIGNsYXNzIHRvIGNvbnN0cnVjdCB2YWxpZCBpbnB1dCBzdHJpbmdzLlxuICAgKlxuICAgKiBDYW4gYmUgb25lIG9mIHRoZSBmb2xsb3dpbmc6XG4gICAqXG4gICAqIC0gXCJNaW5pbXVtXCIgfCBcIm1pblwiXG4gICAqIC0gXCJNYXhpbXVtXCIgfCBcIm1heFwiXG4gICAqIC0gXCJBdmVyYWdlXCIgfCBcImF2Z1wiXG4gICAqIC0gXCJTdW1cIiB8IFwic3VtXCJcbiAgICogLSBcIlNhbXBsZUNvdW50IHwgXCJuXCJcbiAgICogLSBcInBOTi5OTlwiXG4gICAqIC0gXCJ0bU5OLk5OXCIgfCBcInRtKE5OLk5OJTpOTi5OTiUpXCJcbiAgICogLSBcImlxbVwiXG4gICAqIC0gXCJ3bU5OLk5OXCIgfCBcIndtKE5OLk5OJTpOTi5OTiUpXCJcbiAgICogLSBcInRjTk4uTk5cIiB8IFwidGMoTk4uTk4lOk5OLk5OJSlcIlxuICAgKiAtIFwidHNOTi5OTlwiIHwgXCJ0cyhOTi5OTiU6Tk4uTk4lKVwiXG4gICAqXG4gICAqIEBkZWZhdWx0IEF2ZXJhZ2VcbiAgICovXG4gIHJlYWRvbmx5IHN0YXRpc3RpYz86IHN0cmluZztcblxuICAvKipcbiAgICogRGltZW5zaW9ucyBvZiB0aGUgbWV0cmljXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gTm8gZGltZW5zaW9ucy5cbiAgICpcbiAgICogQGRlcHJlY2F0ZWQgVXNlICdkaW1lbnNpb25zTWFwJyBpbnN0ZWFkLlxuICAgKi9cbiAgcmVhZG9ubHkgZGltZW5zaW9ucz86IERpbWVuc2lvbkhhc2g7XG5cbiAgLyoqXG4gICAqIERpbWVuc2lvbnMgb2YgdGhlIG1ldHJpY1xuICAgKlxuICAgKiBAZGVmYXVsdCAtIE5vIGRpbWVuc2lvbnMuXG4gICAqL1xuICByZWFkb25seSBkaW1lbnNpb25zTWFwPzogRGltZW5zaW9uc01hcDtcblxuICAvKipcbiAgICogVW5pdCB1c2VkIHRvIGZpbHRlciB0aGUgbWV0cmljIHN0cmVhbVxuICAgKlxuICAgKiBPbmx5IHJlZmVyIHRvIGRhdHVtcyBlbWl0dGVkIHRvIHRoZSBtZXRyaWMgc3RyZWFtIHdpdGggdGhlIGdpdmVuIHVuaXQgYW5kXG4gICAqIGlnbm9yZSBhbGwgb3RoZXJzLiBPbmx5IHVzZWZ1bCB3aGVuIGRhdHVtcyBhcmUgYmVpbmcgZW1pdHRlZCB0byB0aGUgc2FtZVxuICAgKiBtZXRyaWMgc3RyZWFtIHVuZGVyIGRpZmZlcmVudCB1bml0cy5cbiAgICpcbiAgICogVGhlIGRlZmF1bHQgaXMgdG8gdXNlIGFsbCBtYXRyaWMgZGF0dW1zIGluIHRoZSBzdHJlYW0sIHJlZ2FyZGxlc3Mgb2YgdW5pdCxcbiAgICogd2hpY2ggaXMgcmVjb21tZW5kZWQgaW4gbmVhcmx5IGFsbCBjYXNlcy5cbiAgICpcbiAgICogQ2xvdWRXYXRjaCBkb2VzIG5vdCBob25vciB0aGlzIHByb3BlcnR5IGZvciBncmFwaHMuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gQWxsIG1ldHJpYyBkYXR1bXMgaW4gdGhlIGdpdmVuIG1ldHJpYyBzdHJlYW1cbiAgICovXG4gIHJlYWRvbmx5IHVuaXQ/OiBVbml0O1xuXG4gIC8qKlxuICAgKiBMYWJlbCBmb3IgdGhpcyBtZXRyaWMgd2hlbiBhZGRlZCB0byBhIEdyYXBoIGluIGEgRGFzaGJvYXJkXG4gICAqXG4gICAqIFlvdSBjYW4gdXNlIFtkeW5hbWljIGxhYmVsc10oaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FtYXpvbkNsb3VkV2F0Y2gvbGF0ZXN0L21vbml0b3JpbmcvZ3JhcGgtZHluYW1pYy1sYWJlbHMuaHRtbClcbiAgICogdG8gc2hvdyBzdW1tYXJ5IGluZm9ybWF0aW9uIGFib3V0IHRoZSBlbnRpcmUgZGlzcGxheWVkIHRpbWUgc2VyaWVzXG4gICAqIGluIHRoZSBsZWdlbmQuIEZvciBleGFtcGxlLCBpZiB5b3UgdXNlOlxuICAgKlxuICAgKiBgYGBcbiAgICogW21heDogJHtNQVh9XSBNeU1ldHJpY1xuICAgKiBgYGBcbiAgICpcbiAgICogQXMgdGhlIG1ldHJpYyBsYWJlbCwgdGhlIG1heGltdW0gdmFsdWUgaW4gdGhlIHZpc2libGUgcmFuZ2Ugd2lsbFxuICAgKiBiZSBzaG93biBuZXh0IHRvIHRoZSB0aW1lIHNlcmllcyBuYW1lIGluIHRoZSBncmFwaCdzIGxlZ2VuZC5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBObyBsYWJlbFxuICAgKi9cbiAgcmVhZG9ubHkgbGFiZWw/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBoZXggY29sb3IgY29kZSwgcHJlZml4ZWQgd2l0aCAnIycgKGUuZy4gJyMwMGZmMDAnKSwgdG8gdXNlIHdoZW4gdGhpcyBtZXRyaWMgaXMgcmVuZGVyZWQgb24gYSBncmFwaC5cbiAgICogVGhlIGBDb2xvcmAgY2xhc3MgaGFzIGEgc2V0IG9mIHN0YW5kYXJkIGNvbG9ycyB0aGF0IGNhbiBiZSB1c2VkIGhlcmUuXG4gICAqIEBkZWZhdWx0IC0gQXV0b21hdGljIGNvbG9yXG4gICAqL1xuICByZWFkb25seSBjb2xvcj86IHN0cmluZztcblxuICAvKipcbiAgICogQWNjb3VudCB3aGljaCB0aGlzIG1ldHJpYyBjb21lcyBmcm9tLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIERlcGxveW1lbnQgYWNjb3VudC5cbiAgICovXG4gIHJlYWRvbmx5IGFjY291bnQ/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFJlZ2lvbiB3aGljaCB0aGlzIG1ldHJpYyBjb21lcyBmcm9tLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIERlcGxveW1lbnQgcmVnaW9uLlxuICAgKi9cbiAgcmVhZG9ubHkgcmVnaW9uPzogc3RyaW5nO1xufVxuXG4vKipcbiAqIFByb3BlcnRpZXMgZm9yIGEgbWV0cmljXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgTWV0cmljUHJvcHMgZXh0ZW5kcyBDb21tb25NZXRyaWNPcHRpb25zIHtcbiAgLyoqXG4gICAqIE5hbWVzcGFjZSBvZiB0aGUgbWV0cmljLlxuICAgKi9cbiAgcmVhZG9ubHkgbmFtZXNwYWNlOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIE5hbWUgb2YgdGhlIG1ldHJpYy5cbiAgICovXG4gIHJlYWRvbmx5IG1ldHJpY05hbWU6IHN0cmluZztcbn1cblxuLyoqXG4gKiBQcm9wZXJ0aWVzIG9mIGEgbWV0cmljIHRoYXQgY2FuIGJlIGNoYW5nZWRcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBNZXRyaWNPcHRpb25zIGV4dGVuZHMgQ29tbW9uTWV0cmljT3B0aW9ucyB7XG59XG5cbi8qKlxuICogQ29uZmlndXJhYmxlIG9wdGlvbnMgZm9yIE1hdGhFeHByZXNzaW9uc1xuICovXG5leHBvcnQgaW50ZXJmYWNlIE1hdGhFeHByZXNzaW9uT3B0aW9ucyB7XG4gIC8qKlxuICAgKiBMYWJlbCBmb3IgdGhpcyBleHByZXNzaW9uIHdoZW4gYWRkZWQgdG8gYSBHcmFwaCBpbiBhIERhc2hib2FyZFxuICAgKlxuICAgKiBJZiB0aGlzIGV4cHJlc3Npb24gZXZhbHVhdGVzIHRvIG1vcmUgdGhhbiBvbmUgdGltZSBzZXJpZXMgKGZvclxuICAgKiBleGFtcGxlLCB0aHJvdWdoIHRoZSB1c2Ugb2YgYE1FVFJJQ1MoKWAgb3IgYFNFQVJDSCgpYCBleHByZXNzaW9ucyksXG4gICAqIGVhY2ggdGltZSBzZXJpZXMgd2lsbCBhcHBlYXIgaW4gdGhlIGdyYXBoIHVzaW5nIGEgY29tYmluYXRpb24gb2YgdGhlXG4gICAqIGV4cHJlc3Npb24gbGFiZWwgYW5kIHRoZSBpbmRpdmlkdWFsIG1ldHJpYyBsYWJlbC4gU3BlY2lmeSB0aGUgZW1wdHlcbiAgICogc3RyaW5nIChgJydgKSB0byBzdXBwcmVzcyB0aGUgZXhwcmVzc2lvbiBsYWJlbCBhbmQgb25seSBrZWVwIHRoZVxuICAgKiBtZXRyaWMgbGFiZWwuXG4gICAqXG4gICAqIFlvdSBjYW4gdXNlIFtkeW5hbWljIGxhYmVsc10oaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FtYXpvbkNsb3VkV2F0Y2gvbGF0ZXN0L21vbml0b3JpbmcvZ3JhcGgtZHluYW1pYy1sYWJlbHMuaHRtbClcbiAgICogdG8gc2hvdyBzdW1tYXJ5IGluZm9ybWF0aW9uIGFib3V0IHRoZSBkaXNwbGF5ZWQgdGltZSBzZXJpZXNcbiAgICogaW4gdGhlIGxlZ2VuZC4gRm9yIGV4YW1wbGUsIGlmIHlvdSB1c2U6XG4gICAqXG4gICAqIGBgYFxuICAgKiBbbWF4OiAke01BWH1dIE15TWV0cmljXG4gICAqIGBgYFxuICAgKlxuICAgKiBBcyB0aGUgbWV0cmljIGxhYmVsLCB0aGUgbWF4aW11bSB2YWx1ZSBpbiB0aGUgdmlzaWJsZSByYW5nZSB3aWxsXG4gICAqIGJlIHNob3duIG5leHQgdG8gdGhlIHRpbWUgc2VyaWVzIG5hbWUgaW4gdGhlIGdyYXBoJ3MgbGVnZW5kLiBJZiB0aGVcbiAgICogbWF0aCBleHByZXNzaW9uIHByb2R1Y2VzIG1vcmUgdGhhbiBvbmUgdGltZSBzZXJpZXMsIHRoZSBtYXhpbXVtXG4gICAqIHdpbGwgYmUgc2hvd24gZm9yIGVhY2ggaW5kaXZpZHVhbCB0aW1lIHNlcmllcyBwcm9kdWNlIGJ5IHRoaXNcbiAgICogbWF0aCBleHByZXNzaW9uLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIEV4cHJlc3Npb24gdmFsdWUgaXMgdXNlZCBhcyBsYWJlbFxuICAgKi9cbiAgcmVhZG9ubHkgbGFiZWw/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIENvbG9yIGZvciB0aGlzIG1ldHJpYyB3aGVuIGFkZGVkIHRvIGEgR3JhcGggaW4gYSBEYXNoYm9hcmRcbiAgICpcbiAgICogQGRlZmF1bHQgLSBBdXRvbWF0aWMgY29sb3JcbiAgICovXG4gIHJlYWRvbmx5IGNvbG9yPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgcGVyaW9kIG92ZXIgd2hpY2ggdGhlIGV4cHJlc3Npb24ncyBzdGF0aXN0aWNzIGFyZSBhcHBsaWVkLlxuICAgKlxuICAgKiBUaGlzIHBlcmlvZCBvdmVycmlkZXMgYWxsIHBlcmlvZHMgaW4gdGhlIG1ldHJpY3MgdXNlZCBpbiB0aGlzXG4gICAqIG1hdGggZXhwcmVzc2lvbi5cbiAgICpcbiAgICogQGRlZmF1bHQgRHVyYXRpb24ubWludXRlcyg1KVxuICAgKi9cbiAgcmVhZG9ubHkgcGVyaW9kPzogY2RrLkR1cmF0aW9uO1xuXG4gIC8qKlxuICAgKiBBY2NvdW50IHRvIGV2YWx1YXRlIHNlYXJjaCBleHByZXNzaW9ucyB3aXRoaW4uXG4gICAqXG4gICAqIFNwZWNpZnlpbmcgYSBzZWFyY2hBY2NvdW50IGhhcyBubyBlZmZlY3QgdG8gdGhlIGFjY291bnQgdXNlZFxuICAgKiBmb3IgbWV0cmljcyB3aXRoaW4gdGhlIGV4cHJlc3Npb24gKHBhc3NlZCB2aWEgdXNpbmdNZXRyaWNzKS5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBEZXBsb3ltZW50IGFjY291bnQuXG4gICAqL1xuICByZWFkb25seSBzZWFyY2hBY2NvdW50Pzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBSZWdpb24gdG8gZXZhbHVhdGUgc2VhcmNoIGV4cHJlc3Npb25zIHdpdGhpbi5cbiAgICpcbiAgICogU3BlY2lmeWluZyBhIHNlYXJjaFJlZ2lvbiBoYXMgbm8gZWZmZWN0IHRvIHRoZSByZWdpb24gdXNlZFxuICAgKiBmb3IgbWV0cmljcyB3aXRoaW4gdGhlIGV4cHJlc3Npb24gKHBhc3NlZCB2aWEgdXNpbmdNZXRyaWNzKS5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBEZXBsb3ltZW50IHJlZ2lvbi5cbiAgICovXG4gIHJlYWRvbmx5IHNlYXJjaFJlZ2lvbj86IHN0cmluZztcbn1cblxuLyoqXG4gKiBQcm9wZXJ0aWVzIGZvciBhIE1hdGhFeHByZXNzaW9uXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgTWF0aEV4cHJlc3Npb25Qcm9wcyBleHRlbmRzIE1hdGhFeHByZXNzaW9uT3B0aW9ucyB7XG4gIC8qKlxuICAgKiBUaGUgZXhwcmVzc2lvbiBkZWZpbmluZyB0aGUgbWV0cmljLlxuICAgKlxuICAgKiBXaGVuIGFuIGV4cHJlc3Npb24gY29udGFpbnMgYSBTRUFSQ0ggZnVuY3Rpb24sIGl0IGNhbm5vdCBiZSB1c2VkXG4gICAqIHdpdGhpbiBhbiBBbGFybS5cbiAgICovXG4gIHJlYWRvbmx5IGV4cHJlc3Npb246IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIG1ldHJpY3MgdXNlZCBpbiB0aGUgZXhwcmVzc2lvbiwgaW4gYSBtYXAuXG4gICAqXG4gICAqIFRoZSBrZXkgaXMgdGhlIGlkZW50aWZpZXIgdGhhdCByZXByZXNlbnRzIHRoZSBnaXZlbiBtZXRyaWMgaW4gdGhlXG4gICAqIGV4cHJlc3Npb24sIGFuZCB0aGUgdmFsdWUgaXMgdGhlIGFjdHVhbCBNZXRyaWMgb2JqZWN0LlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIEVtcHR5IG1hcC5cbiAgICovXG4gIHJlYWRvbmx5IHVzaW5nTWV0cmljcz86IFJlY29yZDxzdHJpbmcsIElNZXRyaWM+O1xufVxuXG4vKipcbiAqIEEgbWV0cmljIGVtaXR0ZWQgYnkgYSBzZXJ2aWNlXG4gKlxuICogVGhlIG1ldHJpYyBpcyBhIGNvbWJpbmF0aW9uIG9mIGEgbWV0cmljIGlkZW50aWZpZXIgKG5hbWVzcGFjZSwgbmFtZSBhbmQgZGltZW5zaW9ucylcbiAqIGFuZCBhbiBhZ2dyZWdhdGlvbiBmdW5jdGlvbiAoc3RhdGlzdGljLCBwZXJpb2QgYW5kIHVuaXQpLlxuICpcbiAqIEl0IGFsc28gY29udGFpbnMgbWV0YWRhdGEgd2hpY2ggaXMgdXNlZCBvbmx5IGluIGdyYXBocywgc3VjaCBhcyBjb2xvciBhbmQgbGFiZWwuXG4gKiBJdCBtYWtlcyBzZW5zZSB0byBlbWJlZCB0aGlzIGluIGhlcmUsIHNvIHRoYXQgY29tcG91bmQgY29uc3RydWN0cyBjYW4gYXR0YWNoXG4gKiB0aGF0IG1ldGFkYXRhIHRvIG1ldHJpY3MgdGhleSBleHBvc2UuXG4gKlxuICogVGhpcyBjbGFzcyBkb2VzIG5vdCByZXByZXNlbnQgYSByZXNvdXJjZSwgc28gaGVuY2UgaXMgbm90IGEgY29uc3RydWN0LiBJbnN0ZWFkLFxuICogTWV0cmljIGlzIGFuIGFic3RyYWN0aW9uIHRoYXQgbWFrZXMgaXQgZWFzeSB0byBzcGVjaWZ5IG1ldHJpY3MgZm9yIHVzZSBpbiBib3RoXG4gKiBhbGFybXMgYW5kIGdyYXBocy5cbiAqL1xuZXhwb3J0IGNsYXNzIE1ldHJpYyBpbXBsZW1lbnRzIElNZXRyaWMge1xuICAvKipcbiAgICogR3JhbnQgcGVybWlzc2lvbnMgdG8gdGhlIGdpdmVuIGlkZW50aXR5IHRvIHdyaXRlIG1ldHJpY3MuXG4gICAqXG4gICAqIEBwYXJhbSBncmFudGVlIFRoZSBJQU0gaWRlbnRpdHkgdG8gZ2l2ZSBwZXJtaXNzaW9ucyB0by5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZ3JhbnRQdXRNZXRyaWNEYXRhKGdyYW50ZWU6IGlhbS5JR3JhbnRhYmxlKTogaWFtLkdyYW50IHtcbiAgICByZXR1cm4gaWFtLkdyYW50LmFkZFRvUHJpbmNpcGFsKHtcbiAgICAgIGdyYW50ZWUsXG4gICAgICBhY3Rpb25zOiBbJ2Nsb3Vkd2F0Y2g6UHV0TWV0cmljRGF0YSddLFxuICAgICAgcmVzb3VyY2VBcm5zOiBbJyonXSxcbiAgICB9KTtcbiAgfVxuXG4gIC8qKiBEaW1lbnNpb25zIG9mIHRoaXMgbWV0cmljICovXG4gIHB1YmxpYyByZWFkb25seSBkaW1lbnNpb25zPzogRGltZW5zaW9uSGFzaDtcbiAgLyoqIE5hbWVzcGFjZSBvZiB0aGlzIG1ldHJpYyAqL1xuICBwdWJsaWMgcmVhZG9ubHkgbmFtZXNwYWNlOiBzdHJpbmc7XG4gIC8qKiBOYW1lIG9mIHRoaXMgbWV0cmljICovXG4gIHB1YmxpYyByZWFkb25seSBtZXRyaWNOYW1lOiBzdHJpbmc7XG4gIC8qKiBQZXJpb2Qgb2YgdGhpcyBtZXRyaWMgKi9cbiAgcHVibGljIHJlYWRvbmx5IHBlcmlvZDogY2RrLkR1cmF0aW9uO1xuICAvKiogU3RhdGlzdGljIG9mIHRoaXMgbWV0cmljICovXG4gIHB1YmxpYyByZWFkb25seSBzdGF0aXN0aWM6IHN0cmluZztcbiAgLyoqIExhYmVsIGZvciB0aGlzIG1ldHJpYyB3aGVuIGFkZGVkIHRvIGEgR3JhcGggaW4gYSBEYXNoYm9hcmQgKi9cbiAgcHVibGljIHJlYWRvbmx5IGxhYmVsPzogc3RyaW5nO1xuICAvKiogVGhlIGhleCBjb2xvciBjb2RlIHVzZWQgd2hlbiB0aGlzIG1ldHJpYyBpcyByZW5kZXJlZCBvbiBhIGdyYXBoLiAqL1xuICBwdWJsaWMgcmVhZG9ubHkgY29sb3I/OiBzdHJpbmc7XG5cbiAgLyoqIFVuaXQgb2YgdGhlIG1ldHJpYy4gKi9cbiAgcHVibGljIHJlYWRvbmx5IHVuaXQ/OiBVbml0O1xuXG4gIC8qKiBBY2NvdW50IHdoaWNoIHRoaXMgbWV0cmljIGNvbWVzIGZyb20gKi9cbiAgcHVibGljIHJlYWRvbmx5IGFjY291bnQ/OiBzdHJpbmc7XG5cbiAgLyoqIFJlZ2lvbiB3aGljaCB0aGlzIG1ldHJpYyBjb21lcyBmcm9tLiAqL1xuICBwdWJsaWMgcmVhZG9ubHkgcmVnaW9uPzogc3RyaW5nO1xuXG4gIC8qKiBXYXJuaW5ncyBhdHRhY2hlZCB0byB0aGlzIG1ldHJpYy4gKi9cbiAgcHVibGljIHJlYWRvbmx5IHdhcm5pbmdzPzogc3RyaW5nW107XG5cbiAgY29uc3RydWN0b3IocHJvcHM6IE1ldHJpY1Byb3BzKSB7XG4gICAgdGhpcy5wZXJpb2QgPSBwcm9wcy5wZXJpb2QgfHwgY2RrLkR1cmF0aW9uLm1pbnV0ZXMoNSk7XG4gICAgY29uc3QgcGVyaW9kU2VjID0gdGhpcy5wZXJpb2QudG9TZWNvbmRzKCk7XG4gICAgaWYgKHBlcmlvZFNlYyAhPT0gMSAmJiBwZXJpb2RTZWMgIT09IDUgJiYgcGVyaW9kU2VjICE9PSAxMCAmJiBwZXJpb2RTZWMgIT09IDMwICYmIHBlcmlvZFNlYyAlIDYwICE9PSAwKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYCdwZXJpb2QnIG11c3QgYmUgMSwgNSwgMTAsIDMwLCBvciBhIG11bHRpcGxlIG9mIDYwIHNlY29uZHMsIHJlY2VpdmVkICR7cGVyaW9kU2VjfWApO1xuICAgIH1cblxuICAgIHRoaXMud2FybmluZ3MgPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5kaW1lbnNpb25zID0gdGhpcy52YWxpZGF0ZURpbWVuc2lvbnMocHJvcHMuZGltZW5zaW9uc01hcCA/PyBwcm9wcy5kaW1lbnNpb25zKTtcbiAgICB0aGlzLm5hbWVzcGFjZSA9IHByb3BzLm5hbWVzcGFjZTtcbiAgICB0aGlzLm1ldHJpY05hbWUgPSBwcm9wcy5tZXRyaWNOYW1lO1xuXG4gICAgY29uc3QgcGFyc2VkU3RhdCA9IHBhcnNlU3RhdGlzdGljKHByb3BzLnN0YXRpc3RpYyB8fCBTdGF0cy5BVkVSQUdFKTtcbiAgICBpZiAocGFyc2VkU3RhdC50eXBlID09PSAnZ2VuZXJpYycpIHtcbiAgICAgIC8vIFVucmVjb2duaXplZCBzdGF0aXN0aWMsIGRvIG5vdCB0aHJvdywganVzdCB3YXJuXG4gICAgICAvLyBUaGVyZSBtYXkgYmUgYSBuZXcgc3RhdGlzdGljIHRoYXQgdGhpcyBsaWIgZG9lcyBub3Qgc3VwcG9ydCB5ZXRcbiAgICAgIGNvbnN0IGxhYmVsID0gcHJvcHMubGFiZWwgPyBgLCBsYWJlbCBcIiR7cHJvcHMubGFiZWx9XCJgOiAnJztcbiAgICAgIHRoaXMud2FybmluZ3MgPSBbXG4gICAgICAgIGBVbnJlY29nbml6ZWQgc3RhdGlzdGljIFwiJHtwcm9wcy5zdGF0aXN0aWN9XCIgZm9yIG1ldHJpYyB3aXRoIG5hbWVzcGFjZSBcIiR7cHJvcHMubmFtZXNwYWNlfVwiJHtsYWJlbH0gYW5kIG1ldHJpYyBuYW1lIFwiJHtwcm9wcy5tZXRyaWNOYW1lfVwiLmAgK1xuICAgICAgICAgICcgUHJlZmVyYWJseSB1c2UgdGhlIGBhd3NfY2xvdWR3YXRjaC5TdGF0c2AgaGVscGVyIGNsYXNzIHRvIHNwZWNpZnkgYSBzdGF0aXN0aWMuJyArXG4gICAgICAgICAgJyBZb3UgY2FuIGlnbm9yZSB0aGlzIHdhcm5pbmcgaWYgeW91ciBzdGF0aXN0aWMgaXMgdmFsaWQgYnV0IG5vdCB5ZXQgc3VwcG9ydGVkIGJ5IHRoZSBgYXdzX2Nsb3Vkd2F0Y2guU3RhdHNgIGhlbHBlciBjbGFzcy4nLFxuICAgICAgXTtcbiAgICB9XG4gICAgdGhpcy5zdGF0aXN0aWMgPSBub3JtYWxpemVTdGF0aXN0aWMocGFyc2VkU3RhdCk7XG5cbiAgICB0aGlzLmxhYmVsID0gcHJvcHMubGFiZWw7XG4gICAgdGhpcy5jb2xvciA9IHByb3BzLmNvbG9yO1xuICAgIHRoaXMudW5pdCA9IHByb3BzLnVuaXQ7XG4gICAgdGhpcy5hY2NvdW50ID0gcHJvcHMuYWNjb3VudDtcbiAgICB0aGlzLnJlZ2lvbiA9IHByb3BzLnJlZ2lvbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm4gYSBjb3B5IG9mIE1ldHJpYyBgd2l0aGAgcHJvcGVydGllcyBjaGFuZ2VkLlxuICAgKlxuICAgKiBBbGwgcHJvcGVydGllcyBleGNlcHQgbmFtZXNwYWNlIGFuZCBtZXRyaWNOYW1lIGNhbiBiZSBjaGFuZ2VkLlxuICAgKlxuICAgKiBAcGFyYW0gcHJvcHMgVGhlIHNldCBvZiBwcm9wZXJ0aWVzIHRvIGNoYW5nZS5cbiAgICovXG4gIHB1YmxpYyB3aXRoKHByb3BzOiBNZXRyaWNPcHRpb25zKTogTWV0cmljIHtcbiAgICAvLyBTaG9ydC1jaXJjdWl0IGNyZWF0aW5nIGEgbmV3IG9iamVjdCBpZiB0aGVyZSB3b3VsZCBiZSBubyBlZmZlY3RpdmUgY2hhbmdlXG4gICAgaWYgKChwcm9wcy5sYWJlbCA9PT0gdW5kZWZpbmVkIHx8IHByb3BzLmxhYmVsID09PSB0aGlzLmxhYmVsKVxuICAgICAgJiYgKHByb3BzLmNvbG9yID09PSB1bmRlZmluZWQgfHwgcHJvcHMuY29sb3IgPT09IHRoaXMuY29sb3IpXG4gICAgICAmJiAocHJvcHMuc3RhdGlzdGljID09PSB1bmRlZmluZWQgfHwgcHJvcHMuc3RhdGlzdGljID09PSB0aGlzLnN0YXRpc3RpYylcbiAgICAgICYmIChwcm9wcy51bml0ID09PSB1bmRlZmluZWQgfHwgcHJvcHMudW5pdCA9PT0gdGhpcy51bml0KVxuICAgICAgJiYgKHByb3BzLmFjY291bnQgPT09IHVuZGVmaW5lZCB8fCBwcm9wcy5hY2NvdW50ID09PSB0aGlzLmFjY291bnQpXG4gICAgICAmJiAocHJvcHMucmVnaW9uID09PSB1bmRlZmluZWQgfHwgcHJvcHMucmVnaW9uID09PSB0aGlzLnJlZ2lvbilcbiAgICAgIC8vIEZvciB0aGVzZSB3ZSdyZSBub3QgZ29pbmcgdG8gZG8gZGVlcCBlcXVhbGl0eSwgbWlzc2VzIHNvbWUgb3Bwb3J0dW5pdHkgZm9yIG9wdGltaXphdGlvblxuICAgICAgLy8gYnV0IHRoYXQncyBva2F5LlxuICAgICAgJiYgKHByb3BzLmRpbWVuc2lvbnMgPT09IHVuZGVmaW5lZClcbiAgICAgICYmIChwcm9wcy5kaW1lbnNpb25zTWFwID09PSB1bmRlZmluZWQpXG4gICAgICAmJiAocHJvcHMucGVyaW9kID09PSB1bmRlZmluZWQgfHwgcHJvcHMucGVyaW9kLnRvU2Vjb25kcygpID09PSB0aGlzLnBlcmlvZC50b1NlY29uZHMoKSkpIHtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHJldHVybiBuZXcgTWV0cmljKHtcbiAgICAgIGRpbWVuc2lvbnNNYXA6IHByb3BzLmRpbWVuc2lvbnNNYXAgPz8gcHJvcHMuZGltZW5zaW9ucyA/PyB0aGlzLmRpbWVuc2lvbnMsXG4gICAgICBuYW1lc3BhY2U6IHRoaXMubmFtZXNwYWNlLFxuICAgICAgbWV0cmljTmFtZTogdGhpcy5tZXRyaWNOYW1lLFxuICAgICAgcGVyaW9kOiBpZlVuZGVmaW5lZChwcm9wcy5wZXJpb2QsIHRoaXMucGVyaW9kKSxcbiAgICAgIHN0YXRpc3RpYzogaWZVbmRlZmluZWQocHJvcHMuc3RhdGlzdGljLCB0aGlzLnN0YXRpc3RpYyksXG4gICAgICB1bml0OiBpZlVuZGVmaW5lZChwcm9wcy51bml0LCB0aGlzLnVuaXQpLFxuICAgICAgbGFiZWw6IGlmVW5kZWZpbmVkKHByb3BzLmxhYmVsLCB0aGlzLmxhYmVsKSxcbiAgICAgIGNvbG9yOiBpZlVuZGVmaW5lZChwcm9wcy5jb2xvciwgdGhpcy5jb2xvciksXG4gICAgICBhY2NvdW50OiBpZlVuZGVmaW5lZChwcm9wcy5hY2NvdW50LCB0aGlzLmFjY291bnQpLFxuICAgICAgcmVnaW9uOiBpZlVuZGVmaW5lZChwcm9wcy5yZWdpb24sIHRoaXMucmVnaW9uKSxcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBdHRhY2ggdGhlIG1ldHJpYyBvYmplY3QgdG8gdGhlIGdpdmVuIGNvbnN0cnVjdCBzY29wZVxuICAgKlxuICAgKiBSZXR1cm5zIGEgTWV0cmljIG9iamVjdCB0aGF0IHVzZXMgdGhlIGFjY291bnQgYW5kIHJlZ2lvbiBmcm9tIHRoZSBTdGFja1xuICAgKiB0aGUgZ2l2ZW4gY29uc3RydWN0IGlzIGRlZmluZWQgaW4uIElmIHRoZSBtZXRyaWMgaXMgc3Vic2VxdWVudGx5IHVzZWRcbiAgICogaW4gYSBEYXNoYm9hcmQgb3IgQWxhcm0gaW4gYSBkaWZmZXJlbnQgU3RhY2sgZGVmaW5lZCBpbiBhIGRpZmZlcmVudFxuICAgKiBhY2NvdW50IG9yIHJlZ2lvbiwgdGhlIGFwcHJvcHJpYXRlICdyZWdpb24nIGFuZCAnYWNjb3VudCcgZmllbGRzXG4gICAqIHdpbGwgYmUgYWRkZWQgdG8gaXQuXG4gICAqXG4gICAqIElmIHRoZSBzY29wZSB3ZSBhdHRhY2ggdG8gaXMgaW4gYW4gZW52aXJvbm1lbnQtYWdub3N0aWMgc3RhY2ssXG4gICAqIG5vdGhpbmcgaXMgZG9uZSBhbmQgdGhlIHNhbWUgTWV0cmljIG9iamVjdCBpcyByZXR1cm5lZC5cbiAgICovXG4gIHB1YmxpYyBhdHRhY2hUbyhzY29wZTogSUNvbnN0cnVjdCk6IE1ldHJpYyB7XG4gICAgY29uc3Qgc3RhY2sgPSBjZGsuU3RhY2sub2Yoc2NvcGUpO1xuXG4gICAgcmV0dXJuIHRoaXMud2l0aCh7XG4gICAgICByZWdpb246IGNkay5Ub2tlbi5pc1VucmVzb2x2ZWQoc3RhY2sucmVnaW9uKSA/IHVuZGVmaW5lZCA6IHN0YWNrLnJlZ2lvbixcbiAgICAgIGFjY291bnQ6IGNkay5Ub2tlbi5pc1VucmVzb2x2ZWQoc3RhY2suYWNjb3VudCkgPyB1bmRlZmluZWQgOiBzdGFjay5hY2NvdW50LFxuICAgIH0pO1xuICB9XG5cbiAgcHVibGljIHRvTWV0cmljQ29uZmlnKCk6IE1ldHJpY0NvbmZpZyB7XG4gICAgY29uc3QgZGltcyA9IHRoaXMuZGltZW5zaW9uc0FzTGlzdCgpO1xuICAgIHJldHVybiB7XG4gICAgICBtZXRyaWNTdGF0OiB7XG4gICAgICAgIGRpbWVuc2lvbnM6IGRpbXMubGVuZ3RoID4gMCA/IGRpbXMgOiB1bmRlZmluZWQsXG4gICAgICAgIG5hbWVzcGFjZTogdGhpcy5uYW1lc3BhY2UsXG4gICAgICAgIG1ldHJpY05hbWU6IHRoaXMubWV0cmljTmFtZSxcbiAgICAgICAgcGVyaW9kOiB0aGlzLnBlcmlvZCxcbiAgICAgICAgc3RhdGlzdGljOiB0aGlzLnN0YXRpc3RpYyxcbiAgICAgICAgdW5pdEZpbHRlcjogdGhpcy51bml0LFxuICAgICAgICBhY2NvdW50OiB0aGlzLmFjY291bnQsXG4gICAgICAgIHJlZ2lvbjogdGhpcy5yZWdpb24sXG4gICAgICB9LFxuICAgICAgcmVuZGVyaW5nUHJvcGVydGllczoge1xuICAgICAgICBjb2xvcjogdGhpcy5jb2xvcixcbiAgICAgICAgbGFiZWw6IHRoaXMubGFiZWwsXG4gICAgICB9LFxuICAgIH07XG4gIH1cblxuICAvKiogQGRlcHJlY2F0ZWQgdXNlIHRvTWV0cmljQ29uZmlnKCkgKi9cbiAgcHVibGljIHRvQWxhcm1Db25maWcoKTogTWV0cmljQWxhcm1Db25maWcge1xuICAgIGNvbnN0IG1ldHJpY0NvbmZpZyA9IHRoaXMudG9NZXRyaWNDb25maWcoKTtcbiAgICBpZiAobWV0cmljQ29uZmlnLm1ldHJpY1N0YXQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdVc2luZyBhIG1hdGggZXhwcmVzc2lvbiBpcyBub3Qgc3VwcG9ydGVkIGhlcmUuIFBhc3MgYSBcXCdNZXRyaWNcXCcgb2JqZWN0IGluc3RlYWQnKTtcbiAgICB9XG5cbiAgICBjb25zdCBwYXJzZWQgPSBwYXJzZVN0YXRpc3RpYyhtZXRyaWNDb25maWcubWV0cmljU3RhdC5zdGF0aXN0aWMpO1xuXG4gICAgbGV0IGV4dGVuZGVkU3RhdGlzdGljOiBzdHJpbmcgfCB1bmRlZmluZWQgPSB1bmRlZmluZWQ7XG4gICAgaWYgKHBhcnNlZC50eXBlID09PSAnc2luZ2xlJykge1xuICAgICAgZXh0ZW5kZWRTdGF0aXN0aWMgPSBzaW5nbGVTdGF0aXN0aWNUb1N0cmluZyhwYXJzZWQpO1xuICAgIH0gZWxzZSBpZiAocGFyc2VkLnR5cGUgPT09ICdwYWlyJykge1xuICAgICAgZXh0ZW5kZWRTdGF0aXN0aWMgPSBwYWlyU3RhdGlzdGljVG9TdHJpbmcocGFyc2VkKTtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgZGltZW5zaW9uczogbWV0cmljQ29uZmlnLm1ldHJpY1N0YXQuZGltZW5zaW9ucyxcbiAgICAgIG5hbWVzcGFjZTogbWV0cmljQ29uZmlnLm1ldHJpY1N0YXQubmFtZXNwYWNlLFxuICAgICAgbWV0cmljTmFtZTogbWV0cmljQ29uZmlnLm1ldHJpY1N0YXQubWV0cmljTmFtZSxcbiAgICAgIHBlcmlvZDogbWV0cmljQ29uZmlnLm1ldHJpY1N0YXQucGVyaW9kLnRvU2Vjb25kcygpLFxuICAgICAgc3RhdGlzdGljOiBwYXJzZWQudHlwZSA9PT0gJ3NpbXBsZScgPyBwYXJzZWQuc3RhdGlzdGljIGFzIFN0YXRpc3RpYyA6IHVuZGVmaW5lZCxcbiAgICAgIGV4dGVuZGVkU3RhdGlzdGljLFxuICAgICAgdW5pdDogdGhpcy51bml0LFxuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogQGRlcHJlY2F0ZWQgdXNlIHRvTWV0cmljQ29uZmlnKClcbiAgICovXG4gIHB1YmxpYyB0b0dyYXBoQ29uZmlnKCk6IE1ldHJpY0dyYXBoQ29uZmlnIHtcbiAgICBjb25zdCBtZXRyaWNDb25maWcgPSB0aGlzLnRvTWV0cmljQ29uZmlnKCk7XG4gICAgaWYgKG1ldHJpY0NvbmZpZy5tZXRyaWNTdGF0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignVXNpbmcgYSBtYXRoIGV4cHJlc3Npb24gaXMgbm90IHN1cHBvcnRlZCBoZXJlLiBQYXNzIGEgXFwnTWV0cmljXFwnIG9iamVjdCBpbnN0ZWFkJyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIGRpbWVuc2lvbnM6IG1ldHJpY0NvbmZpZy5tZXRyaWNTdGF0LmRpbWVuc2lvbnMsXG4gICAgICBuYW1lc3BhY2U6IG1ldHJpY0NvbmZpZy5tZXRyaWNTdGF0Lm5hbWVzcGFjZSxcbiAgICAgIG1ldHJpY05hbWU6IG1ldHJpY0NvbmZpZy5tZXRyaWNTdGF0Lm1ldHJpY05hbWUsXG4gICAgICByZW5kZXJpbmdQcm9wZXJ0aWVzOiB7XG4gICAgICAgIHBlcmlvZDogbWV0cmljQ29uZmlnLm1ldHJpY1N0YXQucGVyaW9kLnRvU2Vjb25kcygpLFxuICAgICAgICBzdGF0OiBtZXRyaWNDb25maWcubWV0cmljU3RhdC5zdGF0aXN0aWMsXG4gICAgICAgIGNvbG9yOiBhc1N0cmluZyhtZXRyaWNDb25maWcucmVuZGVyaW5nUHJvcGVydGllcz8uY29sb3IpLFxuICAgICAgICBsYWJlbDogYXNTdHJpbmcobWV0cmljQ29uZmlnLnJlbmRlcmluZ1Byb3BlcnRpZXM/LmxhYmVsKSxcbiAgICAgIH0sXG4gICAgICAvLyBkZXByZWNhdGVkIHByb3BlcnRpZXMgZm9yIGJhY2t3YXJkcyBjb21wYXRpYmlsaXR5XG4gICAgICBwZXJpb2Q6IG1ldHJpY0NvbmZpZy5tZXRyaWNTdGF0LnBlcmlvZC50b1NlY29uZHMoKSxcbiAgICAgIHN0YXRpc3RpYzogbWV0cmljQ29uZmlnLm1ldHJpY1N0YXQuc3RhdGlzdGljLFxuICAgICAgY29sb3I6IGFzU3RyaW5nKG1ldHJpY0NvbmZpZy5yZW5kZXJpbmdQcm9wZXJ0aWVzPy5jb2xvciksXG4gICAgICBsYWJlbDogYXNTdHJpbmcobWV0cmljQ29uZmlnLnJlbmRlcmluZ1Byb3BlcnRpZXM/LmxhYmVsKSxcbiAgICAgIHVuaXQ6IHRoaXMudW5pdCxcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIE1ha2UgYSBuZXcgQWxhcm0gZm9yIHRoaXMgbWV0cmljXG4gICAqXG4gICAqIENvbWJpbmVzIGJvdGggcHJvcGVydGllcyB0aGF0IG1heSBhZGp1c3QgdGhlIG1ldHJpYyAoYWdncmVnYXRpb24pIGFzIHdlbGxcbiAgICogYXMgYWxhcm0gcHJvcGVydGllcy5cbiAgICovXG4gIHB1YmxpYyBjcmVhdGVBbGFybShzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogQ3JlYXRlQWxhcm1PcHRpb25zKTogQWxhcm0ge1xuICAgIHJldHVybiBuZXcgQWxhcm0oc2NvcGUsIGlkLCB7XG4gICAgICBtZXRyaWM6IHRoaXMud2l0aCh7XG4gICAgICAgIHN0YXRpc3RpYzogcHJvcHMuc3RhdGlzdGljLFxuICAgICAgICBwZXJpb2Q6IHByb3BzLnBlcmlvZCxcbiAgICAgIH0pLFxuICAgICAgYWxhcm1OYW1lOiBwcm9wcy5hbGFybU5hbWUsXG4gICAgICBhbGFybURlc2NyaXB0aW9uOiBwcm9wcy5hbGFybURlc2NyaXB0aW9uLFxuICAgICAgY29tcGFyaXNvbk9wZXJhdG9yOiBwcm9wcy5jb21wYXJpc29uT3BlcmF0b3IsXG4gICAgICBkYXRhcG9pbnRzVG9BbGFybTogcHJvcHMuZGF0YXBvaW50c1RvQWxhcm0sXG4gICAgICB0aHJlc2hvbGQ6IHByb3BzLnRocmVzaG9sZCxcbiAgICAgIGV2YWx1YXRpb25QZXJpb2RzOiBwcm9wcy5ldmFsdWF0aW9uUGVyaW9kcyxcbiAgICAgIGV2YWx1YXRlTG93U2FtcGxlQ291bnRQZXJjZW50aWxlOiBwcm9wcy5ldmFsdWF0ZUxvd1NhbXBsZUNvdW50UGVyY2VudGlsZSxcbiAgICAgIHRyZWF0TWlzc2luZ0RhdGE6IHByb3BzLnRyZWF0TWlzc2luZ0RhdGEsXG4gICAgICBhY3Rpb25zRW5hYmxlZDogcHJvcHMuYWN0aW9uc0VuYWJsZWQsXG4gICAgfSk7XG4gIH1cblxuICBwdWJsaWMgdG9TdHJpbmcoKSB7XG4gICAgcmV0dXJuIHRoaXMubGFiZWwgfHwgdGhpcy5tZXRyaWNOYW1lO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybiB0aGUgZGltZW5zaW9ucyBvZiB0aGlzIE1ldHJpYyBhcyBhIGxpc3Qgb2YgRGltZW5zaW9uLlxuICAgKi9cbiAgcHJpdmF0ZSBkaW1lbnNpb25zQXNMaXN0KCk6IERpbWVuc2lvbltdIHtcbiAgICBjb25zdCBkaW1zID0gdGhpcy5kaW1lbnNpb25zO1xuXG4gICAgaWYgKGRpbXMgPT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIFtdO1xuICAgIH1cblxuICAgIGNvbnN0IGxpc3QgPSBPYmplY3Qua2V5cyhkaW1zKS5zb3J0KCkubWFwKGtleSA9PiAoeyBuYW1lOiBrZXksIHZhbHVlOiBkaW1zW2tleV0gfSkpO1xuXG4gICAgcmV0dXJuIGxpc3Q7XG4gIH1cblxuICBwcml2YXRlIHZhbGlkYXRlRGltZW5zaW9ucyhkaW1zPzogRGltZW5zaW9uSGFzaCk6IERpbWVuc2lvbkhhc2ggfCB1bmRlZmluZWQge1xuICAgIGlmICghZGltcykge1xuICAgICAgcmV0dXJuIGRpbXM7XG4gICAgfVxuXG4gICAgdmFyIGRpbXNBcnJheSA9IE9iamVjdC5rZXlzKGRpbXMpO1xuICAgIGlmIChkaW1zQXJyYXk/Lmxlbmd0aCA+IDEwKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFRoZSBtYXhpbXVtIG51bWJlciBvZiBkaW1lbnNpb25zIGlzIDEwLCByZWNlaXZlZCAke2RpbXNBcnJheS5sZW5ndGh9YCk7XG4gICAgfVxuXG4gICAgZGltc0FycmF5Lm1hcChrZXkgPT4ge1xuICAgICAgaWYgKGRpbXNba2V5XSA9PT0gdW5kZWZpbmVkIHx8IGRpbXNba2V5XSA9PT0gbnVsbCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYERpbWVuc2lvbiB2YWx1ZSBvZiAnJHtkaW1zW2tleV19JyBpcyBpbnZhbGlkYCk7XG4gICAgICB9O1xuICAgICAgaWYgKGtleS5sZW5ndGggPCAxIHx8IGtleS5sZW5ndGggPiAyNTUpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBEaW1lbnNpb24gbmFtZSBtdXN0IGJlIGF0IGxlYXN0IDEgYW5kIG5vIG1vcmUgdGhhbiAyNTUgY2hhcmFjdGVyczsgcmVjZWl2ZWQgJHtrZXl9YCk7XG4gICAgICB9O1xuXG4gICAgICBpZiAoZGltc1trZXldLmxlbmd0aCA8IDEgfHwgZGltc1trZXldLmxlbmd0aCA+IDI1NSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYERpbWVuc2lvbiB2YWx1ZSBtdXN0IGJlIGF0IGxlYXN0IDEgYW5kIG5vIG1vcmUgdGhhbiAyNTUgY2hhcmFjdGVyczsgcmVjZWl2ZWQgJHtkaW1zW2tleV19YCk7XG4gICAgICB9O1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIGRpbXM7XG4gIH1cbn1cblxuZnVuY3Rpb24gYXNTdHJpbmcoeD86IHVua25vd24pOiBzdHJpbmcgfCB1bmRlZmluZWQge1xuICBpZiAoeCA9PT0gdW5kZWZpbmVkKSB7IHJldHVybiB1bmRlZmluZWQ7IH1cbiAgaWYgKHR5cGVvZiB4ICE9PSAnc3RyaW5nJykge1xuICAgIHRocm93IG5ldyBFcnJvcihgRXhwZWN0ZWQgc3RyaW5nLCBnb3QgJHt4fWApO1xuICB9XG4gIHJldHVybiB4O1xufVxuXG4vKipcbiAqIEEgbWF0aCBleHByZXNzaW9uIGJ1aWx0IHdpdGggbWV0cmljKHMpIGVtaXR0ZWQgYnkgYSBzZXJ2aWNlXG4gKlxuICogVGhlIG1hdGggZXhwcmVzc2lvbiBpcyBhIGNvbWJpbmF0aW9uIG9mIGFuIGV4cHJlc3Npb24gKHgreSkgYW5kIG1ldHJpY3MgdG8gYXBwbHkgZXhwcmVzc2lvbiBvbi5cbiAqIEl0IGFsc28gY29udGFpbnMgbWV0YWRhdGEgd2hpY2ggaXMgdXNlZCBvbmx5IGluIGdyYXBocywgc3VjaCBhcyBjb2xvciBhbmQgbGFiZWwuXG4gKiBJdCBtYWtlcyBzZW5zZSB0byBlbWJlZCB0aGlzIGluIGhlcmUsIHNvIHRoYXQgY29tcG91bmQgY29uc3RydWN0cyBjYW4gYXR0YWNoXG4gKiB0aGF0IG1ldGFkYXRhIHRvIG1ldHJpY3MgdGhleSBleHBvc2UuXG4gKlxuICogTWF0aEV4cHJlc3Npb24gY2FuIGFsc28gYmUgdXNlZCBmb3Igc2VhcmNoIGV4cHJlc3Npb25zLiBJbiB0aGlzIGNhc2UsXG4gKiBpdCBhbHNvIG9wdGlvbmFsbHkgYWNjZXB0cyBhIHNlYXJjaFJlZ2lvbiBhbmQgc2VhcmNoQWNjb3VudCBwcm9wZXJ0eSBmb3IgY3Jvc3MtZW52aXJvbm1lbnRcbiAqIHNlYXJjaCBleHByZXNzaW9ucy5cbiAqXG4gKiBUaGlzIGNsYXNzIGRvZXMgbm90IHJlcHJlc2VudCBhIHJlc291cmNlLCBzbyBoZW5jZSBpcyBub3QgYSBjb25zdHJ1Y3QuIEluc3RlYWQsXG4gKiBNYXRoRXhwcmVzc2lvbiBpcyBhbiBhYnN0cmFjdGlvbiB0aGF0IG1ha2VzIGl0IGVhc3kgdG8gc3BlY2lmeSBtZXRyaWNzIGZvciB1c2UgaW4gYm90aFxuICogYWxhcm1zIGFuZCBncmFwaHMuXG4gKi9cbmV4cG9ydCBjbGFzcyBNYXRoRXhwcmVzc2lvbiBpbXBsZW1lbnRzIElNZXRyaWMge1xuICAvKipcbiAgICogVGhlIGV4cHJlc3Npb24gZGVmaW5pbmcgdGhlIG1ldHJpYy5cbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBleHByZXNzaW9uOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBtZXRyaWNzIHVzZWQgaW4gdGhlIGV4cHJlc3Npb24gYXMgS2V5VmFsdWVQYWlyIDxpZCwgbWV0cmljPi5cbiAgICovXG4gIHB1YmxpYyByZWFkb25seSB1c2luZ01ldHJpY3M6IFJlY29yZDxzdHJpbmcsIElNZXRyaWM+O1xuXG4gIC8qKlxuICAgKiBMYWJlbCBmb3IgdGhpcyBtZXRyaWMgd2hlbiBhZGRlZCB0byBhIEdyYXBoLlxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IGxhYmVsPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgaGV4IGNvbG9yIGNvZGUsIHByZWZpeGVkIHdpdGggJyMnIChlLmcuICcjMDBmZjAwJyksIHRvIHVzZSB3aGVuIHRoaXMgbWV0cmljIGlzIHJlbmRlcmVkIG9uIGEgZ3JhcGguXG4gICAqIFRoZSBgQ29sb3JgIGNsYXNzIGhhcyBhIHNldCBvZiBzdGFuZGFyZCBjb2xvcnMgdGhhdCBjYW4gYmUgdXNlZCBoZXJlLlxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IGNvbG9yPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBBZ2dyZWdhdGlvbiBwZXJpb2Qgb2YgdGhpcyBtZXRyaWNcbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBwZXJpb2Q6IGNkay5EdXJhdGlvbjtcblxuICAvKipcbiAgICogQWNjb3VudCB0byBldmFsdWF0ZSBzZWFyY2ggZXhwcmVzc2lvbnMgd2l0aGluLlxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IHNlYXJjaEFjY291bnQ/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFJlZ2lvbiB0byBldmFsdWF0ZSBzZWFyY2ggZXhwcmVzc2lvbnMgd2l0aGluLlxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IHNlYXJjaFJlZ2lvbj86IHN0cmluZztcblxuICAvKipcbiAgICogV2FybmluZ3MgZ2VuZXJhdGVkIGJ5IHRoaXMgbWF0aCBleHByZXNzaW9uXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgd2FybmluZ3M/OiBzdHJpbmdbXTtcblxuICBjb25zdHJ1Y3Rvcihwcm9wczogTWF0aEV4cHJlc3Npb25Qcm9wcykge1xuICAgIHRoaXMucGVyaW9kID0gcHJvcHMucGVyaW9kIHx8IGNkay5EdXJhdGlvbi5taW51dGVzKDUpO1xuICAgIHRoaXMuZXhwcmVzc2lvbiA9IHByb3BzLmV4cHJlc3Npb247XG4gICAgdGhpcy51c2luZ01ldHJpY3MgPSBjaGFuZ2VBbGxQZXJpb2RzKHByb3BzLnVzaW5nTWV0cmljcyA/PyB7fSwgdGhpcy5wZXJpb2QpO1xuICAgIHRoaXMubGFiZWwgPSBwcm9wcy5sYWJlbDtcbiAgICB0aGlzLmNvbG9yID0gcHJvcHMuY29sb3I7XG4gICAgdGhpcy5zZWFyY2hBY2NvdW50ID0gcHJvcHMuc2VhcmNoQWNjb3VudDtcbiAgICB0aGlzLnNlYXJjaFJlZ2lvbiA9IHByb3BzLnNlYXJjaFJlZ2lvbjtcblxuICAgIGNvbnN0IGludmFsaWRWYXJpYWJsZU5hbWVzID0gT2JqZWN0LmtleXModGhpcy51c2luZ01ldHJpY3MpLmZpbHRlcih4ID0+ICF2YWxpZFZhcmlhYmxlTmFtZSh4KSk7XG4gICAgaWYgKGludmFsaWRWYXJpYWJsZU5hbWVzLmxlbmd0aCA+IDApIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgSW52YWxpZCB2YXJpYWJsZSBuYW1lcyBpbiBleHByZXNzaW9uOiAke2ludmFsaWRWYXJpYWJsZU5hbWVzfS4gTXVzdCBzdGFydCB3aXRoIGxvd2VyY2FzZSBsZXR0ZXIgYW5kIG9ubHkgY29udGFpbiBhbHBoYW51bWVyaWNzLmApO1xuICAgIH1cblxuICAgIHRoaXMudmFsaWRhdGVOb0lkQ29uZmxpY3RzKCk7XG5cbiAgICAvLyBDaGVjayB0aGF0IGFsbCBJRHMgdXNlZCBpbiB0aGUgZXhwcmVzc2lvbiBhcmUgYWxzbyBpbiB0aGUgYHVzaW5nTWV0cmljc2AgbWFwLiBXZVxuICAgIC8vIGNhbid0IHRocm93IG9uIHRoaXMgYW55bW9yZSBzaW5jZSB3ZSBkaWRuJ3QgdXNlIHRvIGRvIHRoaXMgdmFsaWRhdGlvbiBmcm9tIHRoZSBzdGFydFxuICAgIC8vIGFuZCBub3cgdGhlcmUgd2lsbCBiZSBsb2FkcyBvZiBwZW9wbGUgd2hvIGFyZSB2aW9sYXRpbmcgdGhlIGV4cGVjdGVkIGNvbnRyYWN0LCBidXRcbiAgICAvLyB3ZSBjYW4gYWRkIHdhcm5pbmdzLlxuICAgIGNvbnN0IG1pc3NpbmdJZGVudGlmaWVycyA9IGFsbElkZW50aWZpZXJzSW5FeHByZXNzaW9uKHRoaXMuZXhwcmVzc2lvbikuZmlsdGVyKGkgPT4gIXRoaXMudXNpbmdNZXRyaWNzW2ldKTtcblxuICAgIGNvbnN0IHdhcm5pbmdzOiBzdHJpbmdbXSA9IFtdO1xuXG4gICAgaWYgKCF0aGlzLmV4cHJlc3Npb24udG9VcHBlckNhc2UoKS5tYXRjaCgnXFxcXHMqU0VMRUNUfFNFQVJDSHxNRVRSSUNTXFxcXHMuKicpICYmIG1pc3NpbmdJZGVudGlmaWVycy5sZW5ndGggPiAwKSB7XG4gICAgICB3YXJuaW5ncy5wdXNoKGBNYXRoIGV4cHJlc3Npb24gJyR7dGhpcy5leHByZXNzaW9ufScgcmVmZXJlbmNlcyB1bmtub3duIGlkZW50aWZpZXJzOiAke21pc3NpbmdJZGVudGlmaWVycy5qb2luKCcsICcpfS4gUGxlYXNlIGFkZCB0aGVtIHRvIHRoZSAndXNpbmdNZXRyaWNzJyBtYXAuYCk7XG4gICAgfVxuXG4gICAgLy8gQWxzbyBjb3B5IHdhcm5pbmdzIGZyb20gZGVlcGVyIGxldmVscyBzbyBncmFwaHMsIGFsYXJtcyBvbmx5IGhhdmUgdG8gaW5zcGVjdCB0aGUgdG9wLWxldmVsIG9iamVjdHNcbiAgICBmb3IgKGNvbnN0IG0gb2YgT2JqZWN0LnZhbHVlcyh0aGlzLnVzaW5nTWV0cmljcykpIHtcbiAgICAgIHdhcm5pbmdzLnB1c2goLi4ubS53YXJuaW5ncyA/PyBbXSk7XG4gICAgfVxuXG4gICAgaWYgKHdhcm5pbmdzLmxlbmd0aCA+IDApIHtcbiAgICAgIHRoaXMud2FybmluZ3MgPSB3YXJuaW5ncztcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJuIGEgY29weSBvZiBNZXRyaWMgd2l0aCBwcm9wZXJ0aWVzIGNoYW5nZWQuXG4gICAqXG4gICAqIEFsbCBwcm9wZXJ0aWVzIGV4Y2VwdCBuYW1lc3BhY2UgYW5kIG1ldHJpY05hbWUgY2FuIGJlIGNoYW5nZWQuXG4gICAqXG4gICAqIEBwYXJhbSBwcm9wcyBUaGUgc2V0IG9mIHByb3BlcnRpZXMgdG8gY2hhbmdlLlxuICAgKi9cbiAgcHVibGljIHdpdGgocHJvcHM6IE1hdGhFeHByZXNzaW9uT3B0aW9ucyk6IE1hdGhFeHByZXNzaW9uIHtcbiAgICAvLyBTaG9ydC1jaXJjdWl0IGNyZWF0aW5nIGEgbmV3IG9iamVjdCBpZiB0aGVyZSB3b3VsZCBiZSBubyBlZmZlY3RpdmUgY2hhbmdlXG4gICAgaWYgKChwcm9wcy5sYWJlbCA9PT0gdW5kZWZpbmVkIHx8IHByb3BzLmxhYmVsID09PSB0aGlzLmxhYmVsKVxuICAgICAgJiYgKHByb3BzLmNvbG9yID09PSB1bmRlZmluZWQgfHwgcHJvcHMuY29sb3IgPT09IHRoaXMuY29sb3IpXG4gICAgICAmJiAocHJvcHMucGVyaW9kID09PSB1bmRlZmluZWQgfHwgcHJvcHMucGVyaW9kLnRvU2Vjb25kcygpID09PSB0aGlzLnBlcmlvZC50b1NlY29uZHMoKSlcbiAgICAgICYmIChwcm9wcy5zZWFyY2hBY2NvdW50ID09PSB1bmRlZmluZWQgfHwgcHJvcHMuc2VhcmNoQWNjb3VudCA9PT0gdGhpcy5zZWFyY2hBY2NvdW50KVxuICAgICAgJiYgKHByb3BzLnNlYXJjaFJlZ2lvbiA9PT0gdW5kZWZpbmVkIHx8IHByb3BzLnNlYXJjaFJlZ2lvbiA9PT0gdGhpcy5zZWFyY2hSZWdpb24pKSB7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IE1hdGhFeHByZXNzaW9uKHtcbiAgICAgIGV4cHJlc3Npb246IHRoaXMuZXhwcmVzc2lvbixcbiAgICAgIHVzaW5nTWV0cmljczogdGhpcy51c2luZ01ldHJpY3MsXG4gICAgICBsYWJlbDogaWZVbmRlZmluZWQocHJvcHMubGFiZWwsIHRoaXMubGFiZWwpLFxuICAgICAgY29sb3I6IGlmVW5kZWZpbmVkKHByb3BzLmNvbG9yLCB0aGlzLmNvbG9yKSxcbiAgICAgIHBlcmlvZDogaWZVbmRlZmluZWQocHJvcHMucGVyaW9kLCB0aGlzLnBlcmlvZCksXG4gICAgICBzZWFyY2hBY2NvdW50OiBpZlVuZGVmaW5lZChwcm9wcy5zZWFyY2hBY2NvdW50LCB0aGlzLnNlYXJjaEFjY291bnQpLFxuICAgICAgc2VhcmNoUmVnaW9uOiBpZlVuZGVmaW5lZChwcm9wcy5zZWFyY2hSZWdpb24sIHRoaXMuc2VhcmNoUmVnaW9uKSxcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAZGVwcmVjYXRlZCB1c2UgdG9NZXRyaWNDb25maWcoKVxuICAgKi9cbiAgcHVibGljIHRvQWxhcm1Db25maWcoKTogTWV0cmljQWxhcm1Db25maWcge1xuICAgIHRocm93IG5ldyBFcnJvcignVXNpbmcgYSBtYXRoIGV4cHJlc3Npb24gaXMgbm90IHN1cHBvcnRlZCBoZXJlLiBQYXNzIGEgXFwnTWV0cmljXFwnIG9iamVjdCBpbnN0ZWFkJyk7XG4gIH1cblxuICAvKipcbiAgICogQGRlcHJlY2F0ZWQgdXNlIHRvTWV0cmljQ29uZmlnKClcbiAgICovXG4gIHB1YmxpYyB0b0dyYXBoQ29uZmlnKCk6IE1ldHJpY0dyYXBoQ29uZmlnIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1VzaW5nIGEgbWF0aCBleHByZXNzaW9uIGlzIG5vdCBzdXBwb3J0ZWQgaGVyZS4gUGFzcyBhIFxcJ01ldHJpY1xcJyBvYmplY3QgaW5zdGVhZCcpO1xuICB9XG5cbiAgcHVibGljIHRvTWV0cmljQ29uZmlnKCk6IE1ldHJpY0NvbmZpZyB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG1hdGhFeHByZXNzaW9uOiB7XG4gICAgICAgIHBlcmlvZDogdGhpcy5wZXJpb2QudG9TZWNvbmRzKCksXG4gICAgICAgIGV4cHJlc3Npb246IHRoaXMuZXhwcmVzc2lvbixcbiAgICAgICAgdXNpbmdNZXRyaWNzOiB0aGlzLnVzaW5nTWV0cmljcyxcbiAgICAgICAgc2VhcmNoQWNjb3VudDogdGhpcy5zZWFyY2hBY2NvdW50LFxuICAgICAgICBzZWFyY2hSZWdpb246IHRoaXMuc2VhcmNoUmVnaW9uLFxuICAgICAgfSxcbiAgICAgIHJlbmRlcmluZ1Byb3BlcnRpZXM6IHtcbiAgICAgICAgbGFiZWw6IHRoaXMubGFiZWwsXG4gICAgICAgIGNvbG9yOiB0aGlzLmNvbG9yLFxuICAgICAgfSxcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIE1ha2UgYSBuZXcgQWxhcm0gZm9yIHRoaXMgbWV0cmljXG4gICAqXG4gICAqIENvbWJpbmVzIGJvdGggcHJvcGVydGllcyB0aGF0IG1heSBhZGp1c3QgdGhlIG1ldHJpYyAoYWdncmVnYXRpb24pIGFzIHdlbGxcbiAgICogYXMgYWxhcm0gcHJvcGVydGllcy5cbiAgICovXG4gIHB1YmxpYyBjcmVhdGVBbGFybShzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogQ3JlYXRlQWxhcm1PcHRpb25zKTogQWxhcm0ge1xuICAgIHJldHVybiBuZXcgQWxhcm0oc2NvcGUsIGlkLCB7XG4gICAgICBtZXRyaWM6IHRoaXMud2l0aCh7XG4gICAgICAgIHBlcmlvZDogcHJvcHMucGVyaW9kLFxuICAgICAgfSksXG4gICAgICBhbGFybU5hbWU6IHByb3BzLmFsYXJtTmFtZSxcbiAgICAgIGFsYXJtRGVzY3JpcHRpb246IHByb3BzLmFsYXJtRGVzY3JpcHRpb24sXG4gICAgICBjb21wYXJpc29uT3BlcmF0b3I6IHByb3BzLmNvbXBhcmlzb25PcGVyYXRvcixcbiAgICAgIGRhdGFwb2ludHNUb0FsYXJtOiBwcm9wcy5kYXRhcG9pbnRzVG9BbGFybSxcbiAgICAgIHRocmVzaG9sZDogcHJvcHMudGhyZXNob2xkLFxuICAgICAgZXZhbHVhdGlvblBlcmlvZHM6IHByb3BzLmV2YWx1YXRpb25QZXJpb2RzLFxuICAgICAgZXZhbHVhdGVMb3dTYW1wbGVDb3VudFBlcmNlbnRpbGU6IHByb3BzLmV2YWx1YXRlTG93U2FtcGxlQ291bnRQZXJjZW50aWxlLFxuICAgICAgdHJlYXRNaXNzaW5nRGF0YTogcHJvcHMudHJlYXRNaXNzaW5nRGF0YSxcbiAgICAgIGFjdGlvbnNFbmFibGVkOiBwcm9wcy5hY3Rpb25zRW5hYmxlZCxcbiAgICB9KTtcbiAgfVxuXG4gIHB1YmxpYyB0b1N0cmluZygpIHtcbiAgICByZXR1cm4gdGhpcy5sYWJlbCB8fCB0aGlzLmV4cHJlc3Npb247XG4gIH1cblxuICBwcml2YXRlIHZhbGlkYXRlTm9JZENvbmZsaWN0cygpIHtcbiAgICBjb25zdCBzZWVuID0gbmV3IE1hcDxzdHJpbmcsIElNZXRyaWM+KCk7XG4gICAgdmlzaXQodGhpcyk7XG5cbiAgICBmdW5jdGlvbiB2aXNpdChtZXRyaWM6IElNZXRyaWMpIHtcbiAgICAgIGRpc3BhdGNoTWV0cmljKG1ldHJpYywge1xuICAgICAgICB3aXRoU3RhdCgpIHtcbiAgICAgICAgICAvLyBOb3RoaW5nXG4gICAgICAgIH0sXG4gICAgICAgIHdpdGhFeHByZXNzaW9uKGV4cHIpIHtcbiAgICAgICAgICBmb3IgKGNvbnN0IFtpZCwgc3ViTWV0cmljXSBvZiBPYmplY3QuZW50cmllcyhleHByLnVzaW5nTWV0cmljcykpIHtcbiAgICAgICAgICAgIGNvbnN0IGV4aXN0aW5nID0gc2Vlbi5nZXQoaWQpO1xuICAgICAgICAgICAgaWYgKGV4aXN0aW5nICYmIG1ldHJpY0tleShleGlzdGluZykgIT09IG1ldHJpY0tleShzdWJNZXRyaWMpKSB7XG4gICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgVGhlIElEICcke2lkfScgdXNlZCBmb3IgdHdvIG1ldHJpY3MgaW4gdGhlIGV4cHJlc3Npb246ICcke3N1Yk1ldHJpY30nIGFuZCAnJHtleGlzdGluZ30nLiBSZW5hbWUgb25lLmApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc2Vlbi5zZXQoaWQsIHN1Yk1ldHJpYyk7XG4gICAgICAgICAgICB2aXNpdChzdWJNZXRyaWMpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIFBhdHRlcm4gZm9yIGEgdmFyaWFibGUgbmFtZS4gQWxwaGFudW0gc3RhcnRpbmcgd2l0aCBsb3dlcmNhc2UuXG4gKi9cbmNvbnN0IFZBUklBQkxFX1BBVCA9ICdbYS16XVthLXpBLVowLTlfXSonO1xuXG5jb25zdCBWQUxJRF9WQVJJQUJMRSA9IG5ldyBSZWdFeHAoYF4ke1ZBUklBQkxFX1BBVH0kYCk7XG5jb25zdCBGSU5EX1ZBUklBQkxFID0gbmV3IFJlZ0V4cChWQVJJQUJMRV9QQVQsICdnJyk7XG5cbmZ1bmN0aW9uIHZhbGlkVmFyaWFibGVOYW1lKHg6IHN0cmluZykge1xuICByZXR1cm4gVkFMSURfVkFSSUFCTEUudGVzdCh4KTtcbn1cblxuLyoqXG4gKiBSZXR1cm4gYWxsIHZhcmlhYmxlIG5hbWVzIHVzZWQgaW4gYW4gZXhwcmVzc2lvblxuICovXG5mdW5jdGlvbiBhbGxJZGVudGlmaWVyc0luRXhwcmVzc2lvbih4OiBzdHJpbmcpIHtcbiAgcmV0dXJuIEFycmF5LmZyb20obWF0Y2hBbGwoeCwgRklORF9WQVJJQUJMRSkpLm1hcChtID0+IG1bMF0pO1xufVxuXG4vKipcbiAqIFByb3BlcnRpZXMgbmVlZGVkIHRvIG1ha2UgYW4gYWxhcm0gZnJvbSBhIG1ldHJpY1xuICovXG5leHBvcnQgaW50ZXJmYWNlIENyZWF0ZUFsYXJtT3B0aW9ucyB7XG4gIC8qKlxuICAgKiBUaGUgcGVyaW9kIG92ZXIgd2hpY2ggdGhlIHNwZWNpZmllZCBzdGF0aXN0aWMgaXMgYXBwbGllZC5cbiAgICpcbiAgICogQ2Fubm90IGJlIHVzZWQgd2l0aCBgTWF0aEV4cHJlc3Npb25gIG9iamVjdHMuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gVGhlIHBlcmlvZCBmcm9tIHRoZSBtZXRyaWNcbiAgICogQGRlcHJlY2F0ZWQgVXNlIGBtZXRyaWMud2l0aCh7IHBlcmlvZDogLi4uIH0pYCB0byBlbmNvZGUgdGhlIHBlcmlvZCBpbnRvIHRoZSBNZXRyaWMgb2JqZWN0XG4gICAqL1xuICByZWFkb25seSBwZXJpb2Q/OiBjZGsuRHVyYXRpb247XG5cbiAgLyoqXG4gICAqIFdoYXQgZnVuY3Rpb24gdG8gdXNlIGZvciBhZ2dyZWdhdGluZy5cbiAgICpcbiAgICogQ2FuIGJlIG9uZSBvZiB0aGUgZm9sbG93aW5nOlxuICAgKlxuICAgKiAtIFwiTWluaW11bVwiIHwgXCJtaW5cIlxuICAgKiAtIFwiTWF4aW11bVwiIHwgXCJtYXhcIlxuICAgKiAtIFwiQXZlcmFnZVwiIHwgXCJhdmdcIlxuICAgKiAtIFwiU3VtXCIgfCBcInN1bVwiXG4gICAqIC0gXCJTYW1wbGVDb3VudCB8IFwiblwiXG4gICAqIC0gXCJwTk4uTk5cIlxuICAgKlxuICAgKiBDYW5ub3QgYmUgdXNlZCB3aXRoIGBNYXRoRXhwcmVzc2lvbmAgb2JqZWN0cy5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBUaGUgc3RhdGlzdGljIGZyb20gdGhlIG1ldHJpY1xuICAgKiBAZGVwcmVjYXRlZCBVc2UgYG1ldHJpYy53aXRoKHsgc3RhdGlzdGljOiAuLi4gfSlgIHRvIGVuY29kZSB0aGUgcGVyaW9kIGludG8gdGhlIE1ldHJpYyBvYmplY3RcbiAgICovXG4gIHJlYWRvbmx5IHN0YXRpc3RpYz86IHN0cmluZztcblxuICAvKipcbiAgICogTmFtZSBvZiB0aGUgYWxhcm1cbiAgICpcbiAgICogQGRlZmF1bHQgQXV0b21hdGljYWxseSBnZW5lcmF0ZWQgbmFtZVxuICAgKi9cbiAgcmVhZG9ubHkgYWxhcm1OYW1lPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBEZXNjcmlwdGlvbiBmb3IgdGhlIGFsYXJtXG4gICAqXG4gICAqIEBkZWZhdWx0IE5vIGRlc2NyaXB0aW9uXG4gICAqL1xuICByZWFkb25seSBhbGFybURlc2NyaXB0aW9uPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBDb21wYXJpc29uIHRvIHVzZSB0byBjaGVjayBpZiBtZXRyaWMgaXMgYnJlYWNoaW5nXG4gICAqXG4gICAqIEBkZWZhdWx0IEdyZWF0ZXJUaGFuT3JFcXVhbFRvVGhyZXNob2xkXG4gICAqL1xuICByZWFkb25seSBjb21wYXJpc29uT3BlcmF0b3I/OiBDb21wYXJpc29uT3BlcmF0b3I7XG5cbiAgLyoqXG4gICAqIFRoZSB2YWx1ZSBhZ2FpbnN0IHdoaWNoIHRoZSBzcGVjaWZpZWQgc3RhdGlzdGljIGlzIGNvbXBhcmVkLlxuICAgKi9cbiAgcmVhZG9ubHkgdGhyZXNob2xkOiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIFRoZSBudW1iZXIgb2YgcGVyaW9kcyBvdmVyIHdoaWNoIGRhdGEgaXMgY29tcGFyZWQgdG8gdGhlIHNwZWNpZmllZCB0aHJlc2hvbGQuXG4gICAqL1xuICByZWFkb25seSBldmFsdWF0aW9uUGVyaW9kczogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBTcGVjaWZpZXMgd2hldGhlciB0byBldmFsdWF0ZSB0aGUgZGF0YSBhbmQgcG90ZW50aWFsbHkgY2hhbmdlIHRoZSBhbGFybSBzdGF0ZSBpZiB0aGVyZSBhcmUgdG9vIGZldyBkYXRhIHBvaW50cyB0byBiZSBzdGF0aXN0aWNhbGx5IHNpZ25pZmljYW50LlxuICAgKlxuICAgKiBVc2VkIG9ubHkgZm9yIGFsYXJtcyB0aGF0IGFyZSBiYXNlZCBvbiBwZXJjZW50aWxlcy5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBOb3QgY29uZmlndXJlZC5cbiAgICovXG4gIHJlYWRvbmx5IGV2YWx1YXRlTG93U2FtcGxlQ291bnRQZXJjZW50aWxlPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBTZXRzIGhvdyB0aGlzIGFsYXJtIGlzIHRvIGhhbmRsZSBtaXNzaW5nIGRhdGEgcG9pbnRzLlxuICAgKlxuICAgKiBAZGVmYXVsdCBUcmVhdE1pc3NpbmdEYXRhLk1pc3NpbmdcbiAgICovXG4gIHJlYWRvbmx5IHRyZWF0TWlzc2luZ0RhdGE/OiBUcmVhdE1pc3NpbmdEYXRhO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRoZSBhY3Rpb25zIGZvciB0aGlzIGFsYXJtIGFyZSBlbmFibGVkXG4gICAqXG4gICAqIEBkZWZhdWx0IHRydWVcbiAgICovXG4gIHJlYWRvbmx5IGFjdGlvbnNFbmFibGVkPzogYm9vbGVhbjtcblxuICAvKipcbiAgICogVGhlIG51bWJlciBvZiBkYXRhcG9pbnRzIHRoYXQgbXVzdCBiZSBicmVhY2hpbmcgdG8gdHJpZ2dlciB0aGUgYWxhcm0uIFRoaXMgaXMgdXNlZCBvbmx5IGlmIHlvdSBhcmUgc2V0dGluZyBhbiBcIk1cbiAgICogb3V0IG9mIE5cIiBhbGFybS4gSW4gdGhhdCBjYXNlLCB0aGlzIHZhbHVlIGlzIHRoZSBNLiBGb3IgbW9yZSBpbmZvcm1hdGlvbiwgc2VlIEV2YWx1YXRpbmcgYW4gQWxhcm0gaW4gdGhlIEFtYXpvblxuICAgKiBDbG91ZFdhdGNoIFVzZXIgR3VpZGUuXG4gICAqXG4gICAqIEBkZWZhdWx0IGBgZXZhbHVhdGlvblBlcmlvZHNgYFxuICAgKlxuICAgKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BbWF6b25DbG91ZFdhdGNoL2xhdGVzdC9tb25pdG9yaW5nL0FsYXJtVGhhdFNlbmRzRW1haWwuaHRtbCNhbGFybS1ldmFsdWF0aW9uXG4gICAqL1xuICByZWFkb25seSBkYXRhcG9pbnRzVG9BbGFybT86IG51bWJlcjtcbn1cblxuZnVuY3Rpb24gaWZVbmRlZmluZWQ8VD4oeDogVCB8IHVuZGVmaW5lZCwgZGVmOiBUIHwgdW5kZWZpbmVkKTogVCB8IHVuZGVmaW5lZCB7XG4gIGlmICh4ICE9PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm4geDtcbiAgfVxuICByZXR1cm4gZGVmO1xufVxuXG4vKipcbiAqIENoYW5nZSBwZXJpb2RzIG9mIGFsbCBtZXRyaWNzIGluIHRoZSBtYXBcbiAqL1xuZnVuY3Rpb24gY2hhbmdlQWxsUGVyaW9kcyhtZXRyaWNzOiBSZWNvcmQ8c3RyaW5nLCBJTWV0cmljPiwgcGVyaW9kOiBjZGsuRHVyYXRpb24pOiBSZWNvcmQ8c3RyaW5nLCBJTWV0cmljPiB7XG4gIGNvbnN0IHJldDogUmVjb3JkPHN0cmluZywgSU1ldHJpYz4gPSB7fTtcbiAgZm9yIChjb25zdCBbaWQsIG1ldHJpY10gb2YgT2JqZWN0LmVudHJpZXMobWV0cmljcykpIHtcbiAgICByZXRbaWRdID0gY2hhbmdlUGVyaW9kKG1ldHJpYywgcGVyaW9kKTtcbiAgfVxuICByZXR1cm4gcmV0O1xufVxuXG4vKipcbiAqIFJldHVybiBhIG5ldyBtZXRyaWMgb2JqZWN0IHdoaWNoIGlzIHRoZSBzYW1lIHR5cGUgYXMgdGhlIGlucHV0IG9iamVjdCwgYnV0IHdpdGggdGhlIHBlcmlvZCBjaGFuZ2VkXG4gKlxuICogUmVsaWVzIG9uIHRoZSBmYWN0IHRoYXQgaW1wbGVtZW50YXRpb25zIG9mIGBJTWV0cmljYCBhcmUgYWxzbyBzdXBwb3NlZCB0byBoYXZlXG4gKiBhbiBpbXBsZW1lbnRhdGlvbiBvZiBgd2l0aGAgdGhhdCBhY2NlcHRzIGFuIGFyZ3VtZW50IGNhbGxlZCBgcGVyaW9kYC4gU2VlIGBJTW9kaWZpYWJsZU1ldHJpY2AuXG4gKi9cbmZ1bmN0aW9uIGNoYW5nZVBlcmlvZChtZXRyaWM6IElNZXRyaWMsIHBlcmlvZDogY2RrLkR1cmF0aW9uKTogSU1ldHJpYyB7XG4gIGlmIChpc01vZGlmaWFibGVNZXRyaWMobWV0cmljKSkge1xuICAgIHJldHVybiBtZXRyaWMud2l0aCh7IHBlcmlvZCB9KTtcbiAgfVxuXG4gIHRocm93IG5ldyBFcnJvcihgTWV0cmljIG9iamVjdCBzaG91bGQgYWxzbyBpbXBsZW1lbnQgJ3dpdGgnOiAke21ldHJpY31gKTtcbn1cblxuLyoqXG4gKiBQcml2YXRlIHByb3RvY29sIGZvciBtZXRyaWNzXG4gKlxuICogTWV0cmljIHR5cGVzIHVzZWQgaW4gYSBNYXRoRXhwcmVzc2lvbiBuZWVkIHRvIGltcGxlbWVudCBhdCBsZWFzdCB0aGlzOlxuICogYSBgd2l0aGAgbWV0aG9kIHRoYXQgdGFrZXMgYXQgbGVhc3QgYSBgcGVyaW9kYCBhbmQgcmV0dXJucyBhIG1vZGlmaWVkIGNvcHlcbiAqIG9mIHRoZSBtZXRyaWMgb2JqZWN0LlxuICpcbiAqIFdlIHB1dCBpdCBoZXJlIGluc3RlYWQgb2Ygb24gYElNZXRyaWNgIGJlY2F1c2UgdGhlcmUgaXMgbm8gd2F5IHRvIHR5cGVcbiAqIGl0IGluIGpzaWkgaW4gYSB3YXkgdGhhdCBjb25jcmV0ZSBpbXBsZW1lbnRhdGlvbnMgYE1ldHJpY2AgYW5kIGBNYXRoRXhwcmVzc2lvbmBcbiAqIGNhbiBiZSBzdGF0aWNhbGx5IHR5cGFibGUgYWJvdXQgdGhlIGZpZWxkcyB0aGF0IGFyZSBjaGFuZ2VhYmxlOiBhbGxcbiAqIGB3aXRoYCBtZXRob2RzIHdvdWxkIG5lZWQgdG8gdGFrZSB0aGUgc2FtZSBhcmd1bWVudCB0eXBlLCBidXQgbm90IGFsbFxuICogY2xhc3NlcyBoYXZlIHRoZSBzYW1lIGB3aXRoYC1hYmxlIHByb3BlcnRpZXMuXG4gKlxuICogVGhpcyBjbGFzcyBleGlzdHMgdG8gcHJldmVudCBoYXZpbmcgdG8gdXNlIGBpbnN0YW5jZW9mYCBpbiB0aGUgYGNoYW5nZVBlcmlvZGBcbiAqIGZ1bmN0aW9uLCBzbyB0aGF0IHdlIGhhdmUgYSBzeXN0ZW0gd2hlcmUgaW4gcHJpbmNpcGxlIG5ldyBpbXBsZW1lbnRhdGlvbnNcbiAqIG9mIGBJTWV0cmljYCBjYW4gYmUgYWRkZWQuIEJlY2F1c2UgaXQgd2lsbCBiZSByYXJlLCB0aGUgbWVjaGFuaXNtIGRvZXNuJ3QgaGF2ZVxuICogdG8gYmUgZXhwb3NlZCB2ZXJ5IHdlbGwsIGp1c3QgaGFzIHRvIGJlIHBvc3NpYmxlLlxuICovXG5pbnRlcmZhY2UgSU1vZGlmaWFibGVNZXRyaWMge1xuICB3aXRoKG9wdGlvbnM6IHsgcGVyaW9kPzogY2RrLkR1cmF0aW9uIH0pOiBJTWV0cmljO1xufVxuXG5mdW5jdGlvbiBpc01vZGlmaWFibGVNZXRyaWMobTogYW55KTogbSBpcyBJTW9kaWZpYWJsZU1ldHJpYyB7XG4gIHJldHVybiB0eXBlb2YgbSA9PT0gJ29iamVjdCcgJiYgbSAhPT0gbnVsbCAmJiAhIW0ud2l0aDtcbn1cblxuLy8gUG9seWZpbGwgZm9yIHN0cmluZy5tYXRjaEFsbChyZWdleHApXG5mdW5jdGlvbiBtYXRjaEFsbCh4OiBzdHJpbmcsIHJlOiBSZWdFeHApOiBSZWdFeHBNYXRjaEFycmF5W10ge1xuICBjb25zdCByZXQgPSBuZXcgQXJyYXk8UmVnRXhwTWF0Y2hBcnJheT4oKTtcbiAgbGV0IG06IFJlZ0V4cEV4ZWNBcnJheSB8IG51bGw7XG4gIHdoaWxlIChtID0gcmUuZXhlYyh4KSkge1xuICAgIHJldC5wdXNoKG0pO1xuICB9XG4gIHJldHVybiByZXQ7XG59XG4iXX0=