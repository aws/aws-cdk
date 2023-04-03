"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Alarm = exports.TreatMissingData = exports.ComparisonOperator = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const core_1 = require("@aws-cdk/core");
const alarm_base_1 = require("./alarm-base");
const cloudwatch_generated_1 = require("./cloudwatch.generated");
const metric_util_1 = require("./private/metric-util");
const object_1 = require("./private/object");
const rendering_1 = require("./private/rendering");
const statistic_1 = require("./private/statistic");
/**
 * Comparison operator for evaluating alarms
 */
var ComparisonOperator;
(function (ComparisonOperator) {
    /**
     * Specified statistic is greater than or equal to the threshold
     */
    ComparisonOperator["GREATER_THAN_OR_EQUAL_TO_THRESHOLD"] = "GreaterThanOrEqualToThreshold";
    /**
     * Specified statistic is strictly greater than the threshold
     */
    ComparisonOperator["GREATER_THAN_THRESHOLD"] = "GreaterThanThreshold";
    /**
     * Specified statistic is strictly less than the threshold
     */
    ComparisonOperator["LESS_THAN_THRESHOLD"] = "LessThanThreshold";
    /**
     * Specified statistic is less than or equal to the threshold.
     */
    ComparisonOperator["LESS_THAN_OR_EQUAL_TO_THRESHOLD"] = "LessThanOrEqualToThreshold";
    /**
     * Specified statistic is lower than or greater than the anomaly model band.
     * Used only for alarms based on anomaly detection models
     */
    ComparisonOperator["LESS_THAN_LOWER_OR_GREATER_THAN_UPPER_THRESHOLD"] = "LessThanLowerOrGreaterThanUpperThreshold";
    /**
     * Specified statistic is greater than the anomaly model band.
     * Used only for alarms based on anomaly detection models
     */
    ComparisonOperator["GREATER_THAN_UPPER_THRESHOLD"] = "GreaterThanUpperThreshold";
    /**
     * Specified statistic is lower than the anomaly model band.
     * Used only for alarms based on anomaly detection models
     */
    ComparisonOperator["LESS_THAN_LOWER_THRESHOLD"] = "LessThanLowerThreshold";
})(ComparisonOperator = exports.ComparisonOperator || (exports.ComparisonOperator = {}));
const OPERATOR_SYMBOLS = {
    GreaterThanOrEqualToThreshold: '>=',
    GreaterThanThreshold: '>',
    LessThanThreshold: '<',
    LessThanOrEqualToThreshold: '<=',
};
/**
 * Specify how missing data points are treated during alarm evaluation
 */
var TreatMissingData;
(function (TreatMissingData) {
    /**
     * Missing data points are treated as breaching the threshold
     */
    TreatMissingData["BREACHING"] = "breaching";
    /**
     * Missing data points are treated as being within the threshold
     */
    TreatMissingData["NOT_BREACHING"] = "notBreaching";
    /**
     * The current alarm state is maintained
     */
    TreatMissingData["IGNORE"] = "ignore";
    /**
     * The alarm does not consider missing data points when evaluating whether to change state
     */
    TreatMissingData["MISSING"] = "missing";
})(TreatMissingData = exports.TreatMissingData || (exports.TreatMissingData = {}));
/**
 * An alarm on a CloudWatch metric
 */
class Alarm extends alarm_base_1.AlarmBase {
    /**
     * Import an existing CloudWatch alarm provided an ARN
     *
     * @param scope The parent creating construct (usually `this`).
     * @param id The construct's name
     * @param alarmArn Alarm ARN (i.e. arn:aws:cloudwatch:<region>:<account-id>:alarm:Foo)
     */
    static fromAlarmArn(scope, id, alarmArn) {
        class Import extends alarm_base_1.AlarmBase {
            constructor() {
                super(...arguments);
                this.alarmArn = alarmArn;
                this.alarmName = core_1.Stack.of(scope).splitArn(alarmArn, core_1.ArnFormat.COLON_RESOURCE_NAME).resourceName;
            }
        }
        return new Import(scope, id);
    }
    constructor(scope, id, props) {
        super(scope, id, {
            physicalName: props.alarmName,
        });
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_cloudwatch_AlarmProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, Alarm);
            }
            throw error;
        }
        const comparisonOperator = props.comparisonOperator || ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD;
        // Render metric, process potential overrides from the alarm
        // (It would be preferable if the statistic etc. was worked into the metric,
        // but hey we're allowing overrides...)
        const metricProps = this.renderMetric(props.metric);
        if (props.period) {
            metricProps.period = props.period.toSeconds();
        }
        if (props.statistic) {
            // Will overwrite both fields if present
            Object.assign(metricProps, {
                statistic: renderIfSimpleStatistic(props.statistic),
                extendedStatistic: renderIfExtendedStatistic(props.statistic),
            });
        }
        const alarm = new cloudwatch_generated_1.CfnAlarm(this, 'Resource', {
            // Meta
            alarmDescription: props.alarmDescription,
            alarmName: this.physicalName,
            // Evaluation
            comparisonOperator,
            threshold: props.threshold,
            datapointsToAlarm: props.datapointsToAlarm,
            evaluateLowSampleCountPercentile: props.evaluateLowSampleCountPercentile,
            evaluationPeriods: props.evaluationPeriods,
            treatMissingData: props.treatMissingData,
            // Actions
            actionsEnabled: props.actionsEnabled,
            alarmActions: core_1.Lazy.list({ produce: () => this.alarmActionArns }),
            insufficientDataActions: core_1.Lazy.list({ produce: (() => this.insufficientDataActionArns) }),
            okActions: core_1.Lazy.list({ produce: () => this.okActionArns }),
            // Metric
            ...metricProps,
        });
        this.alarmArn = this.getResourceArnAttribute(alarm.attrArn, {
            service: 'cloudwatch',
            resource: 'alarm',
            resourceName: this.physicalName,
            arnFormat: core_1.ArnFormat.COLON_RESOURCE_NAME,
        });
        this.alarmName = this.getResourceNameAttribute(alarm.ref);
        this.metric = props.metric;
        const datapoints = props.datapointsToAlarm || props.evaluationPeriods;
        this.annotation = {
            // eslint-disable-next-line max-len
            label: `${this.metric} ${OPERATOR_SYMBOLS[comparisonOperator]} ${props.threshold} for ${datapoints} datapoints within ${describePeriod(props.evaluationPeriods * (0, metric_util_1.metricPeriod)(props.metric).toSeconds())}`,
            value: props.threshold,
        };
        for (const w of this.metric.warnings ?? []) {
            core_1.Annotations.of(this).addWarning(w);
        }
    }
    /**
     * Turn this alarm into a horizontal annotation
     *
     * This is useful if you want to represent an Alarm in a non-AlarmWidget.
     * An `AlarmWidget` can directly show an alarm, but it can only show a
     * single alarm and no other metrics. Instead, you can convert the alarm to
     * a HorizontalAnnotation and add it as an annotation to another graph.
     *
     * This might be useful if:
     *
     * - You want to show multiple alarms inside a single graph, for example if
     *   you have both a "small margin/long period" alarm as well as a
     *   "large margin/short period" alarm.
     *
     * - You want to show an Alarm line in a graph with multiple metrics in it.
     */
    toAnnotation() {
        return this.annotation;
    }
    /**
     * Trigger this action if the alarm fires
     *
     * Typically the ARN of an SNS topic or ARN of an AutoScaling policy.
     */
    addAlarmAction(...actions) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_cloudwatch_IAlarmAction(actions);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.addAlarmAction);
            }
            throw error;
        }
        if (this.alarmActionArns === undefined) {
            this.alarmActionArns = [];
        }
        this.alarmActionArns.push(...actions.map(a => this.validateActionArn(a.bind(this, this).alarmActionArn)));
    }
    validateActionArn(actionArn) {
        const ec2ActionsRegexp = /arn:aws[a-z0-9-]*:automate:[a-z|\d|-]+:ec2:[a-z]+/;
        if (ec2ActionsRegexp.test(actionArn)) {
            // Check per-instance metric
            const metricConfig = this.metric.toMetricConfig();
            if (metricConfig.metricStat?.dimensions?.length != 1 || metricConfig.metricStat?.dimensions[0].name != 'InstanceId') {
                throw new Error(`EC2 alarm actions requires an EC2 Per-Instance Metric. (${JSON.stringify(metricConfig)} does not have an 'InstanceId' dimension)`);
            }
        }
        return actionArn;
    }
    renderMetric(metric) {
        const self = this;
        return (0, metric_util_1.dispatchMetric)(metric, {
            withStat(stat, conf) {
                self.validateMetricStat(stat, metric);
                const canRenderAsLegacyMetric = conf.renderingProperties?.label == undefined && !self.requiresAccountId(stat);
                // Do this to disturb existing templates as little as possible
                if (canRenderAsLegacyMetric) {
                    return (0, object_1.dropUndefined)({
                        dimensions: stat.dimensions,
                        namespace: stat.namespace,
                        metricName: stat.metricName,
                        period: stat.period?.toSeconds(),
                        statistic: renderIfSimpleStatistic(stat.statistic),
                        extendedStatistic: renderIfExtendedStatistic(stat.statistic),
                        unit: stat.unitFilter,
                    });
                }
                return {
                    metrics: [
                        {
                            metricStat: {
                                metric: {
                                    metricName: stat.metricName,
                                    namespace: stat.namespace,
                                    dimensions: stat.dimensions,
                                },
                                period: stat.period.toSeconds(),
                                stat: stat.statistic,
                                unit: stat.unitFilter,
                            },
                            id: 'm1',
                            accountId: self.requiresAccountId(stat) ? stat.account : undefined,
                            label: conf.renderingProperties?.label,
                            returnData: true,
                        },
                    ],
                };
            },
            withExpression() {
                // Expand the math expression metric into a set
                const mset = new rendering_1.MetricSet();
                mset.addTopLevel(true, metric);
                let eid = 0;
                function uniqueMetricId() {
                    return `expr_${++eid}`;
                }
                return {
                    metrics: mset.entries.map(entry => (0, metric_util_1.dispatchMetric)(entry.metric, {
                        withStat(stat, conf) {
                            self.validateMetricStat(stat, entry.metric);
                            return {
                                metricStat: {
                                    metric: {
                                        metricName: stat.metricName,
                                        namespace: stat.namespace,
                                        dimensions: stat.dimensions,
                                    },
                                    period: stat.period.toSeconds(),
                                    stat: stat.statistic,
                                    unit: stat.unitFilter,
                                },
                                id: entry.id || uniqueMetricId(),
                                accountId: self.requiresAccountId(stat) ? stat.account : undefined,
                                label: conf.renderingProperties?.label,
                                returnData: entry.tag ? undefined : false, // entry.tag evaluates to true if the metric is the math expression the alarm is based on.
                            };
                        },
                        withExpression(expr, conf) {
                            const hasSubmetrics = mathExprHasSubmetrics(expr);
                            if (hasSubmetrics) {
                                assertSubmetricsCount(expr);
                            }
                            self.validateMetricExpression(expr);
                            return {
                                expression: expr.expression,
                                id: entry.id || uniqueMetricId(),
                                label: conf.renderingProperties?.label,
                                period: hasSubmetrics ? undefined : expr.period,
                                returnData: entry.tag ? undefined : false, // entry.tag evaluates to true if the metric is the math expression the alarm is based on.
                            };
                        },
                    })),
                };
            },
        });
    }
    /**
     * Validate that if a region is in the given stat config, they match the Alarm
     */
    validateMetricStat(stat, metric) {
        const stack = core_1.Stack.of(this);
        if (definitelyDifferent(stat.region, stack.region)) {
            throw new Error(`Cannot create an Alarm in region '${stack.region}' based on metric '${metric}' in '${stat.region}'`);
        }
    }
    /**
     * Validates that the expression config does not specify searchAccount or searchRegion props
     * as search expressions are not supported by Alarms.
     */
    validateMetricExpression(expr) {
        if (expr.searchAccount !== undefined || expr.searchRegion !== undefined) {
            throw new Error('Cannot create an Alarm based on a MathExpression which specifies a searchAccount or searchRegion');
        }
    }
    /**
     * Determine if the accountId property should be included in the metric.
     */
    requiresAccountId(stat) {
        const stackAccount = core_1.Stack.of(this).account;
        // if stat.account is undefined, it's by definition in the same account
        if (stat.account === undefined) {
            return false;
        }
        // Return true if they're different. The ACCOUNT_ID token is interned
        // so will always have the same string value (and even if we guess wrong
        // it will still work).
        return stackAccount !== stat.account;
    }
}
_a = JSII_RTTI_SYMBOL_1;
Alarm[_a] = { fqn: "@aws-cdk/aws-cloudwatch.Alarm", version: "0.0.0" };
exports.Alarm = Alarm;
function definitelyDifferent(x, y) {
    return x && !core_1.Token.isUnresolved(y) && x !== y;
}
/**
 * Return a human readable string for this period
 *
 * We know the seconds are always one of a handful of allowed values.
 */
function describePeriod(seconds) {
    if (seconds === 60) {
        return '1 minute';
    }
    if (seconds === 1) {
        return '1 second';
    }
    if (seconds > 60) {
        return (seconds / 60) + ' minutes';
    }
    return seconds + ' seconds';
}
function renderIfSimpleStatistic(statistic) {
    if (statistic === undefined) {
        return undefined;
    }
    const parsed = (0, statistic_1.parseStatistic)(statistic);
    if (parsed.type === 'simple') {
        return (0, statistic_1.normalizeStatistic)(parsed);
    }
    return undefined;
}
function renderIfExtendedStatistic(statistic) {
    if (statistic === undefined) {
        return undefined;
    }
    const parsed = (0, statistic_1.parseStatistic)(statistic);
    if (parsed.type === 'single' || parsed.type === 'pair') {
        return (0, statistic_1.normalizeStatistic)(parsed);
    }
    return undefined;
}
function mathExprHasSubmetrics(expr) {
    return Object.keys(expr.usingMetrics).length > 0;
}
function assertSubmetricsCount(expr) {
    if (Object.keys(expr.usingMetrics).length > 10) {
        // https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/AlarmThatSendsEmail.html#alarms-on-metric-math-expressions
        throw new Error('Alarms on math expressions cannot contain more than 10 individual metrics');
    }
    ;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWxhcm0uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJhbGFybS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSx3Q0FBMkU7QUFHM0UsNkNBQWlEO0FBQ2pELGlFQUFpRTtBQUlqRSx1REFBcUU7QUFDckUsNkNBQWlEO0FBQ2pELG1EQUFnRDtBQUNoRCxtREFBeUU7QUFlekU7O0dBRUc7QUFDSCxJQUFZLGtCQXNDWDtBQXRDRCxXQUFZLGtCQUFrQjtJQUM1Qjs7T0FFRztJQUNILDBGQUFvRSxDQUFBO0lBRXBFOztPQUVHO0lBQ0gscUVBQStDLENBQUE7SUFFL0M7O09BRUc7SUFDSCwrREFBeUMsQ0FBQTtJQUV6Qzs7T0FFRztJQUNILG9GQUE4RCxDQUFBO0lBRTlEOzs7T0FHRztJQUNILGtIQUE0RixDQUFBO0lBRTVGOzs7T0FHRztJQUNILGdGQUEwRCxDQUFBO0lBRTFEOzs7T0FHRztJQUNILDBFQUFvRCxDQUFBO0FBQ3RELENBQUMsRUF0Q1csa0JBQWtCLEdBQWxCLDBCQUFrQixLQUFsQiwwQkFBa0IsUUFzQzdCO0FBRUQsTUFBTSxnQkFBZ0IsR0FBNEI7SUFDaEQsNkJBQTZCLEVBQUUsSUFBSTtJQUNuQyxvQkFBb0IsRUFBRSxHQUFHO0lBQ3pCLGlCQUFpQixFQUFFLEdBQUc7SUFDdEIsMEJBQTBCLEVBQUUsSUFBSTtDQUNqQyxDQUFDO0FBRUY7O0dBRUc7QUFDSCxJQUFZLGdCQW9CWDtBQXBCRCxXQUFZLGdCQUFnQjtJQUMxQjs7T0FFRztJQUNILDJDQUF1QixDQUFBO0lBRXZCOztPQUVHO0lBQ0gsa0RBQThCLENBQUE7SUFFOUI7O09BRUc7SUFDSCxxQ0FBaUIsQ0FBQTtJQUVqQjs7T0FFRztJQUNILHVDQUFtQixDQUFBO0FBQ3JCLENBQUMsRUFwQlcsZ0JBQWdCLEdBQWhCLHdCQUFnQixLQUFoQix3QkFBZ0IsUUFvQjNCO0FBRUQ7O0dBRUc7QUFDSCxNQUFhLEtBQU0sU0FBUSxzQkFBUztJQUVsQzs7Ozs7O09BTUc7SUFD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QkFBa0IsRUFBQyxNQUFNLENBQUMsQ0FBQztLQUNuQztJQUNELE9BQU8sU0FBUyxDQUFDO0FBQ25CLENBQUM7QUFFRCxTQUFTLHlCQUF5QixDQUFDLFNBQWtCO0lBQ25ELElBQUksU0FBUyxLQUFLLFNBQVMsRUFBRTtRQUFFLE9BQU8sU0FBUyxDQUFDO0tBQUU7SUFFbEQsTUFBTSxNQUFNLEdBQUcsSUFBQSwwQkFBYyxFQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQ3pDLElBQUksTUFBTSxDQUFDLElBQUksS0FBSyxRQUFRLElBQUksTUFBTSxDQUFDLElBQUksS0FBSyxNQUFNLEVBQUU7UUFDdEQsT0FBTyxJQUFBLDhCQUFrQixFQUFDLE1BQU0sQ0FBQyxDQUFDO0tBQ25DO0lBQ0QsT0FBTyxTQUFTLENBQUM7QUFDbkIsQ0FBQztBQUVELFNBQVMscUJBQXFCLENBQUMsSUFBNEI7SUFDekQsT0FBTyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO0FBQ25ELENBQUM7QUFFRCxTQUFTLHFCQUFxQixDQUFDLElBQTRCO0lBQ3pELElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsTUFBTSxHQUFHLEVBQUUsRUFBRTtRQUM5Qyw0SEFBNEg7UUFDNUgsTUFBTSxJQUFJLEtBQUssQ0FBQywyRUFBMkUsQ0FBQyxDQUFDO0tBQzlGO0lBQUEsQ0FBQztBQUNKLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBcm5Gb3JtYXQsIExhenksIFN0YWNrLCBUb2tlbiwgQW5ub3RhdGlvbnMgfSBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0IHsgSUFsYXJtQWN0aW9uIH0gZnJvbSAnLi9hbGFybS1hY3Rpb24nO1xuaW1wb3J0IHsgQWxhcm1CYXNlLCBJQWxhcm0gfSBmcm9tICcuL2FsYXJtLWJhc2UnO1xuaW1wb3J0IHsgQ2ZuQWxhcm0sIENmbkFsYXJtUHJvcHMgfSBmcm9tICcuL2Nsb3Vkd2F0Y2guZ2VuZXJhdGVkJztcbmltcG9ydCB7IEhvcml6b250YWxBbm5vdGF0aW9uIH0gZnJvbSAnLi9ncmFwaCc7XG5pbXBvcnQgeyBDcmVhdGVBbGFybU9wdGlvbnMgfSBmcm9tICcuL21ldHJpYyc7XG5pbXBvcnQgeyBJTWV0cmljLCBNZXRyaWNFeHByZXNzaW9uQ29uZmlnLCBNZXRyaWNTdGF0Q29uZmlnIH0gZnJvbSAnLi9tZXRyaWMtdHlwZXMnO1xuaW1wb3J0IHsgZGlzcGF0Y2hNZXRyaWMsIG1ldHJpY1BlcmlvZCB9IGZyb20gJy4vcHJpdmF0ZS9tZXRyaWMtdXRpbCc7XG5pbXBvcnQgeyBkcm9wVW5kZWZpbmVkIH0gZnJvbSAnLi9wcml2YXRlL29iamVjdCc7XG5pbXBvcnQgeyBNZXRyaWNTZXQgfSBmcm9tICcuL3ByaXZhdGUvcmVuZGVyaW5nJztcbmltcG9ydCB7IG5vcm1hbGl6ZVN0YXRpc3RpYywgcGFyc2VTdGF0aXN0aWMgfSBmcm9tICcuL3ByaXZhdGUvc3RhdGlzdGljJztcblxuLyoqXG4gKiBQcm9wZXJ0aWVzIGZvciBBbGFybXNcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBBbGFybVByb3BzIGV4dGVuZHMgQ3JlYXRlQWxhcm1PcHRpb25zIHtcbiAgLyoqXG4gICAqIFRoZSBtZXRyaWMgdG8gYWRkIHRoZSBhbGFybSBvblxuICAgKlxuICAgKiBNZXRyaWMgb2JqZWN0cyBjYW4gYmUgb2J0YWluZWQgZnJvbSBtb3N0IHJlc291cmNlcywgb3IgeW91IGNhbiBjb25zdHJ1Y3RcbiAgICogY3VzdG9tIE1ldHJpYyBvYmplY3RzIGJ5IGluc3RhbnRpYXRpbmcgb25lLlxuICAgKi9cbiAgcmVhZG9ubHkgbWV0cmljOiBJTWV0cmljO1xufVxuXG4vKipcbiAqIENvbXBhcmlzb24gb3BlcmF0b3IgZm9yIGV2YWx1YXRpbmcgYWxhcm1zXG4gKi9cbmV4cG9ydCBlbnVtIENvbXBhcmlzb25PcGVyYXRvciB7XG4gIC8qKlxuICAgKiBTcGVjaWZpZWQgc3RhdGlzdGljIGlzIGdyZWF0ZXIgdGhhbiBvciBlcXVhbCB0byB0aGUgdGhyZXNob2xkXG4gICAqL1xuICBHUkVBVEVSX1RIQU5fT1JfRVFVQUxfVE9fVEhSRVNIT0xEID0gJ0dyZWF0ZXJUaGFuT3JFcXVhbFRvVGhyZXNob2xkJyxcblxuICAvKipcbiAgICogU3BlY2lmaWVkIHN0YXRpc3RpYyBpcyBzdHJpY3RseSBncmVhdGVyIHRoYW4gdGhlIHRocmVzaG9sZFxuICAgKi9cbiAgR1JFQVRFUl9USEFOX1RIUkVTSE9MRCA9ICdHcmVhdGVyVGhhblRocmVzaG9sZCcsXG5cbiAgLyoqXG4gICAqIFNwZWNpZmllZCBzdGF0aXN0aWMgaXMgc3RyaWN0bHkgbGVzcyB0aGFuIHRoZSB0aHJlc2hvbGRcbiAgICovXG4gIExFU1NfVEhBTl9USFJFU0hPTEQgPSAnTGVzc1RoYW5UaHJlc2hvbGQnLFxuXG4gIC8qKlxuICAgKiBTcGVjaWZpZWQgc3RhdGlzdGljIGlzIGxlc3MgdGhhbiBvciBlcXVhbCB0byB0aGUgdGhyZXNob2xkLlxuICAgKi9cbiAgTEVTU19USEFOX09SX0VRVUFMX1RPX1RIUkVTSE9MRCA9ICdMZXNzVGhhbk9yRXF1YWxUb1RocmVzaG9sZCcsXG5cbiAgLyoqXG4gICAqIFNwZWNpZmllZCBzdGF0aXN0aWMgaXMgbG93ZXIgdGhhbiBvciBncmVhdGVyIHRoYW4gdGhlIGFub21hbHkgbW9kZWwgYmFuZC5cbiAgICogVXNlZCBvbmx5IGZvciBhbGFybXMgYmFzZWQgb24gYW5vbWFseSBkZXRlY3Rpb24gbW9kZWxzXG4gICAqL1xuICBMRVNTX1RIQU5fTE9XRVJfT1JfR1JFQVRFUl9USEFOX1VQUEVSX1RIUkVTSE9MRCA9ICdMZXNzVGhhbkxvd2VyT3JHcmVhdGVyVGhhblVwcGVyVGhyZXNob2xkJyxcblxuICAvKipcbiAgICogU3BlY2lmaWVkIHN0YXRpc3RpYyBpcyBncmVhdGVyIHRoYW4gdGhlIGFub21hbHkgbW9kZWwgYmFuZC5cbiAgICogVXNlZCBvbmx5IGZvciBhbGFybXMgYmFzZWQgb24gYW5vbWFseSBkZXRlY3Rpb24gbW9kZWxzXG4gICAqL1xuICBHUkVBVEVSX1RIQU5fVVBQRVJfVEhSRVNIT0xEID0gJ0dyZWF0ZXJUaGFuVXBwZXJUaHJlc2hvbGQnLFxuXG4gIC8qKlxuICAgKiBTcGVjaWZpZWQgc3RhdGlzdGljIGlzIGxvd2VyIHRoYW4gdGhlIGFub21hbHkgbW9kZWwgYmFuZC5cbiAgICogVXNlZCBvbmx5IGZvciBhbGFybXMgYmFzZWQgb24gYW5vbWFseSBkZXRlY3Rpb24gbW9kZWxzXG4gICAqL1xuICBMRVNTX1RIQU5fTE9XRVJfVEhSRVNIT0xEID0gJ0xlc3NUaGFuTG93ZXJUaHJlc2hvbGQnLFxufVxuXG5jb25zdCBPUEVSQVRPUl9TWU1CT0xTOiB7W2tleTogc3RyaW5nXTogc3RyaW5nfSA9IHtcbiAgR3JlYXRlclRoYW5PckVxdWFsVG9UaHJlc2hvbGQ6ICc+PScsXG4gIEdyZWF0ZXJUaGFuVGhyZXNob2xkOiAnPicsXG4gIExlc3NUaGFuVGhyZXNob2xkOiAnPCcsXG4gIExlc3NUaGFuT3JFcXVhbFRvVGhyZXNob2xkOiAnPD0nLFxufTtcblxuLyoqXG4gKiBTcGVjaWZ5IGhvdyBtaXNzaW5nIGRhdGEgcG9pbnRzIGFyZSB0cmVhdGVkIGR1cmluZyBhbGFybSBldmFsdWF0aW9uXG4gKi9cbmV4cG9ydCBlbnVtIFRyZWF0TWlzc2luZ0RhdGEge1xuICAvKipcbiAgICogTWlzc2luZyBkYXRhIHBvaW50cyBhcmUgdHJlYXRlZCBhcyBicmVhY2hpbmcgdGhlIHRocmVzaG9sZFxuICAgKi9cbiAgQlJFQUNISU5HID0gJ2JyZWFjaGluZycsXG5cbiAgLyoqXG4gICAqIE1pc3NpbmcgZGF0YSBwb2ludHMgYXJlIHRyZWF0ZWQgYXMgYmVpbmcgd2l0aGluIHRoZSB0aHJlc2hvbGRcbiAgICovXG4gIE5PVF9CUkVBQ0hJTkcgPSAnbm90QnJlYWNoaW5nJyxcblxuICAvKipcbiAgICogVGhlIGN1cnJlbnQgYWxhcm0gc3RhdGUgaXMgbWFpbnRhaW5lZFxuICAgKi9cbiAgSUdOT1JFID0gJ2lnbm9yZScsXG5cbiAgLyoqXG4gICAqIFRoZSBhbGFybSBkb2VzIG5vdCBjb25zaWRlciBtaXNzaW5nIGRhdGEgcG9pbnRzIHdoZW4gZXZhbHVhdGluZyB3aGV0aGVyIHRvIGNoYW5nZSBzdGF0ZVxuICAgKi9cbiAgTUlTU0lORyA9ICdtaXNzaW5nJ1xufVxuXG4vKipcbiAqIEFuIGFsYXJtIG9uIGEgQ2xvdWRXYXRjaCBtZXRyaWNcbiAqL1xuZXhwb3J0IGNsYXNzIEFsYXJtIGV4dGVuZHMgQWxhcm1CYXNlIHtcblxuICAvKipcbiAgICogSW1wb3J0IGFuIGV4aXN0aW5nIENsb3VkV2F0Y2ggYWxhcm0gcHJvdmlkZWQgYW4gQVJOXG4gICAqXG4gICAqIEBwYXJhbSBzY29wZSBUaGUgcGFyZW50IGNyZWF0aW5nIGNvbnN0cnVjdCAodXN1YWxseSBgdGhpc2ApLlxuICAgKiBAcGFyYW0gaWQgVGhlIGNvbnN0cnVjdCdzIG5hbWVcbiAgICogQHBhcmFtIGFsYXJtQXJuIEFsYXJtIEFSTiAoaS5lLiBhcm46YXdzOmNsb3Vkd2F0Y2g6PHJlZ2lvbj46PGFjY291bnQtaWQ+OmFsYXJtOkZvbylcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZnJvbUFsYXJtQXJuKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIGFsYXJtQXJuOiBzdHJpbmcpOiBJQWxhcm0ge1xuICAgIGNsYXNzIEltcG9ydCBleHRlbmRzIEFsYXJtQmFzZSBpbXBsZW1lbnRzIElBbGFybSB7XG4gICAgICBwdWJsaWMgcmVhZG9ubHkgYWxhcm1Bcm4gPSBhbGFybUFybjtcbiAgICAgIHB1YmxpYyByZWFkb25seSBhbGFybU5hbWUgPSBTdGFjay5vZihzY29wZSkuc3BsaXRBcm4oYWxhcm1Bcm4sIEFybkZvcm1hdC5DT0xPTl9SRVNPVVJDRV9OQU1FKS5yZXNvdXJjZU5hbWUhO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IEltcG9ydChzY29wZSwgaWQpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFSTiBvZiB0aGlzIGFsYXJtXG4gICAqXG4gICAqIEBhdHRyaWJ1dGVcbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBhbGFybUFybjogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBOYW1lIG9mIHRoaXMgYWxhcm0uXG4gICAqXG4gICAqIEBhdHRyaWJ1dGVcbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBhbGFybU5hbWU6IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIG1ldHJpYyBvYmplY3QgdGhpcyBhbGFybSB3YXMgYmFzZWQgb25cbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBtZXRyaWM6IElNZXRyaWM7XG5cbiAgLyoqXG4gICAqIFRoaXMgbWV0cmljIGFzIGFuIGFubm90YXRpb25cbiAgICovXG4gIHByaXZhdGUgcmVhZG9ubHkgYW5ub3RhdGlvbjogSG9yaXpvbnRhbEFubm90YXRpb247XG5cbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IEFsYXJtUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHtcbiAgICAgIHBoeXNpY2FsTmFtZTogcHJvcHMuYWxhcm1OYW1lLFxuICAgIH0pO1xuXG4gICAgY29uc3QgY29tcGFyaXNvbk9wZXJhdG9yID0gcHJvcHMuY29tcGFyaXNvbk9wZXJhdG9yIHx8IENvbXBhcmlzb25PcGVyYXRvci5HUkVBVEVSX1RIQU5fT1JfRVFVQUxfVE9fVEhSRVNIT0xEO1xuXG4gICAgLy8gUmVuZGVyIG1ldHJpYywgcHJvY2VzcyBwb3RlbnRpYWwgb3ZlcnJpZGVzIGZyb20gdGhlIGFsYXJtXG4gICAgLy8gKEl0IHdvdWxkIGJlIHByZWZlcmFibGUgaWYgdGhlIHN0YXRpc3RpYyBldGMuIHdhcyB3b3JrZWQgaW50byB0aGUgbWV0cmljLFxuICAgIC8vIGJ1dCBoZXkgd2UncmUgYWxsb3dpbmcgb3ZlcnJpZGVzLi4uKVxuICAgIGNvbnN0IG1ldHJpY1Byb3BzOiBXcml0ZWFibGU8UGFydGlhbDxDZm5BbGFybVByb3BzPj4gPSB0aGlzLnJlbmRlck1ldHJpYyhwcm9wcy5tZXRyaWMpO1xuICAgIGlmIChwcm9wcy5wZXJpb2QpIHtcbiAgICAgIG1ldHJpY1Byb3BzLnBlcmlvZCA9IHByb3BzLnBlcmlvZC50b1NlY29uZHMoKTtcbiAgICB9XG4gICAgaWYgKHByb3BzLnN0YXRpc3RpYykge1xuICAgICAgLy8gV2lsbCBvdmVyd3JpdGUgYm90aCBmaWVsZHMgaWYgcHJlc2VudFxuICAgICAgT2JqZWN0LmFzc2lnbihtZXRyaWNQcm9wcywge1xuICAgICAgICBzdGF0aXN0aWM6IHJlbmRlcklmU2ltcGxlU3RhdGlzdGljKHByb3BzLnN0YXRpc3RpYyksXG4gICAgICAgIGV4dGVuZGVkU3RhdGlzdGljOiByZW5kZXJJZkV4dGVuZGVkU3RhdGlzdGljKHByb3BzLnN0YXRpc3RpYyksXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBjb25zdCBhbGFybSA9IG5ldyBDZm5BbGFybSh0aGlzLCAnUmVzb3VyY2UnLCB7XG4gICAgICAvLyBNZXRhXG4gICAgICBhbGFybURlc2NyaXB0aW9uOiBwcm9wcy5hbGFybURlc2NyaXB0aW9uLFxuICAgICAgYWxhcm1OYW1lOiB0aGlzLnBoeXNpY2FsTmFtZSxcblxuICAgICAgLy8gRXZhbHVhdGlvblxuICAgICAgY29tcGFyaXNvbk9wZXJhdG9yLFxuICAgICAgdGhyZXNob2xkOiBwcm9wcy50aHJlc2hvbGQsXG4gICAgICBkYXRhcG9pbnRzVG9BbGFybTogcHJvcHMuZGF0YXBvaW50c1RvQWxhcm0sXG4gICAgICBldmFsdWF0ZUxvd1NhbXBsZUNvdW50UGVyY2VudGlsZTogcHJvcHMuZXZhbHVhdGVMb3dTYW1wbGVDb3VudFBlcmNlbnRpbGUsXG4gICAgICBldmFsdWF0aW9uUGVyaW9kczogcHJvcHMuZXZhbHVhdGlvblBlcmlvZHMsXG4gICAgICB0cmVhdE1pc3NpbmdEYXRhOiBwcm9wcy50cmVhdE1pc3NpbmdEYXRhLFxuXG4gICAgICAvLyBBY3Rpb25zXG4gICAgICBhY3Rpb25zRW5hYmxlZDogcHJvcHMuYWN0aW9uc0VuYWJsZWQsXG4gICAgICBhbGFybUFjdGlvbnM6IExhenkubGlzdCh7IHByb2R1Y2U6ICgpID0+IHRoaXMuYWxhcm1BY3Rpb25Bcm5zIH0pLFxuICAgICAgaW5zdWZmaWNpZW50RGF0YUFjdGlvbnM6IExhenkubGlzdCh7IHByb2R1Y2U6ICgoKSA9PiB0aGlzLmluc3VmZmljaWVudERhdGFBY3Rpb25Bcm5zKSB9KSxcbiAgICAgIG9rQWN0aW9uczogTGF6eS5saXN0KHsgcHJvZHVjZTogKCkgPT4gdGhpcy5va0FjdGlvbkFybnMgfSksXG5cbiAgICAgIC8vIE1ldHJpY1xuICAgICAgLi4ubWV0cmljUHJvcHMsXG4gICAgfSk7XG5cbiAgICB0aGlzLmFsYXJtQXJuID0gdGhpcy5nZXRSZXNvdXJjZUFybkF0dHJpYnV0ZShhbGFybS5hdHRyQXJuLCB7XG4gICAgICBzZXJ2aWNlOiAnY2xvdWR3YXRjaCcsXG4gICAgICByZXNvdXJjZTogJ2FsYXJtJyxcbiAgICAgIHJlc291cmNlTmFtZTogdGhpcy5waHlzaWNhbE5hbWUsXG4gICAgICBhcm5Gb3JtYXQ6IEFybkZvcm1hdC5DT0xPTl9SRVNPVVJDRV9OQU1FLFxuICAgIH0pO1xuICAgIHRoaXMuYWxhcm1OYW1lID0gdGhpcy5nZXRSZXNvdXJjZU5hbWVBdHRyaWJ1dGUoYWxhcm0ucmVmKTtcblxuICAgIHRoaXMubWV0cmljID0gcHJvcHMubWV0cmljO1xuICAgIGNvbnN0IGRhdGFwb2ludHMgPSBwcm9wcy5kYXRhcG9pbnRzVG9BbGFybSB8fCBwcm9wcy5ldmFsdWF0aW9uUGVyaW9kcztcbiAgICB0aGlzLmFubm90YXRpb24gPSB7XG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbWF4LWxlblxuICAgICAgbGFiZWw6IGAke3RoaXMubWV0cmljfSAke09QRVJBVE9SX1NZTUJPTFNbY29tcGFyaXNvbk9wZXJhdG9yXX0gJHtwcm9wcy50aHJlc2hvbGR9IGZvciAke2RhdGFwb2ludHN9IGRhdGFwb2ludHMgd2l0aGluICR7ZGVzY3JpYmVQZXJpb2QocHJvcHMuZXZhbHVhdGlvblBlcmlvZHMgKiBtZXRyaWNQZXJpb2QocHJvcHMubWV0cmljKS50b1NlY29uZHMoKSl9YCxcbiAgICAgIHZhbHVlOiBwcm9wcy50aHJlc2hvbGQsXG4gICAgfTtcblxuICAgIGZvciAoY29uc3QgdyBvZiB0aGlzLm1ldHJpYy53YXJuaW5ncyA/PyBbXSkge1xuICAgICAgQW5ub3RhdGlvbnMub2YodGhpcykuYWRkV2FybmluZyh3KTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogVHVybiB0aGlzIGFsYXJtIGludG8gYSBob3Jpem9udGFsIGFubm90YXRpb25cbiAgICpcbiAgICogVGhpcyBpcyB1c2VmdWwgaWYgeW91IHdhbnQgdG8gcmVwcmVzZW50IGFuIEFsYXJtIGluIGEgbm9uLUFsYXJtV2lkZ2V0LlxuICAgKiBBbiBgQWxhcm1XaWRnZXRgIGNhbiBkaXJlY3RseSBzaG93IGFuIGFsYXJtLCBidXQgaXQgY2FuIG9ubHkgc2hvdyBhXG4gICAqIHNpbmdsZSBhbGFybSBhbmQgbm8gb3RoZXIgbWV0cmljcy4gSW5zdGVhZCwgeW91IGNhbiBjb252ZXJ0IHRoZSBhbGFybSB0b1xuICAgKiBhIEhvcml6b250YWxBbm5vdGF0aW9uIGFuZCBhZGQgaXQgYXMgYW4gYW5ub3RhdGlvbiB0byBhbm90aGVyIGdyYXBoLlxuICAgKlxuICAgKiBUaGlzIG1pZ2h0IGJlIHVzZWZ1bCBpZjpcbiAgICpcbiAgICogLSBZb3Ugd2FudCB0byBzaG93IG11bHRpcGxlIGFsYXJtcyBpbnNpZGUgYSBzaW5nbGUgZ3JhcGgsIGZvciBleGFtcGxlIGlmXG4gICAqICAgeW91IGhhdmUgYm90aCBhIFwic21hbGwgbWFyZ2luL2xvbmcgcGVyaW9kXCIgYWxhcm0gYXMgd2VsbCBhcyBhXG4gICAqICAgXCJsYXJnZSBtYXJnaW4vc2hvcnQgcGVyaW9kXCIgYWxhcm0uXG4gICAqXG4gICAqIC0gWW91IHdhbnQgdG8gc2hvdyBhbiBBbGFybSBsaW5lIGluIGEgZ3JhcGggd2l0aCBtdWx0aXBsZSBtZXRyaWNzIGluIGl0LlxuICAgKi9cbiAgcHVibGljIHRvQW5ub3RhdGlvbigpOiBIb3Jpem9udGFsQW5ub3RhdGlvbiB7XG4gICAgcmV0dXJuIHRoaXMuYW5ub3RhdGlvbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBUcmlnZ2VyIHRoaXMgYWN0aW9uIGlmIHRoZSBhbGFybSBmaXJlc1xuICAgKlxuICAgKiBUeXBpY2FsbHkgdGhlIEFSTiBvZiBhbiBTTlMgdG9waWMgb3IgQVJOIG9mIGFuIEF1dG9TY2FsaW5nIHBvbGljeS5cbiAgICovXG4gIHB1YmxpYyBhZGRBbGFybUFjdGlvbiguLi5hY3Rpb25zOiBJQWxhcm1BY3Rpb25bXSkge1xuICAgIGlmICh0aGlzLmFsYXJtQWN0aW9uQXJucyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aGlzLmFsYXJtQWN0aW9uQXJucyA9IFtdO1xuICAgIH1cblxuICAgIHRoaXMuYWxhcm1BY3Rpb25Bcm5zLnB1c2goLi4uYWN0aW9ucy5tYXAoYSA9PlxuICAgICAgdGhpcy52YWxpZGF0ZUFjdGlvbkFybihhLmJpbmQodGhpcywgdGhpcykuYWxhcm1BY3Rpb25Bcm4pLFxuICAgICkpO1xuICB9XG5cbiAgcHJpdmF0ZSB2YWxpZGF0ZUFjdGlvbkFybihhY3Rpb25Bcm46IHN0cmluZyk6IHN0cmluZyB7XG4gICAgY29uc3QgZWMyQWN0aW9uc1JlZ2V4cDogUmVnRXhwID0gL2Fybjphd3NbYS16MC05LV0qOmF1dG9tYXRlOlthLXp8XFxkfC1dKzplYzI6W2Etel0rLztcbiAgICBpZiAoZWMyQWN0aW9uc1JlZ2V4cC50ZXN0KGFjdGlvbkFybikpIHtcbiAgICAgIC8vIENoZWNrIHBlci1pbnN0YW5jZSBtZXRyaWNcbiAgICAgIGNvbnN0IG1ldHJpY0NvbmZpZyA9IHRoaXMubWV0cmljLnRvTWV0cmljQ29uZmlnKCk7XG4gICAgICBpZiAobWV0cmljQ29uZmlnLm1ldHJpY1N0YXQ/LmRpbWVuc2lvbnM/Lmxlbmd0aCAhPSAxIHx8IG1ldHJpY0NvbmZpZy5tZXRyaWNTdGF0Py5kaW1lbnNpb25zIVswXS5uYW1lICE9ICdJbnN0YW5jZUlkJykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEVDMiBhbGFybSBhY3Rpb25zIHJlcXVpcmVzIGFuIEVDMiBQZXItSW5zdGFuY2UgTWV0cmljLiAoJHtKU09OLnN0cmluZ2lmeShtZXRyaWNDb25maWcpfSBkb2VzIG5vdCBoYXZlIGFuICdJbnN0YW5jZUlkJyBkaW1lbnNpb24pYCk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBhY3Rpb25Bcm47XG4gIH1cblxuICBwcml2YXRlIHJlbmRlck1ldHJpYyhtZXRyaWM6IElNZXRyaWMpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICByZXR1cm4gZGlzcGF0Y2hNZXRyaWMobWV0cmljLCB7XG4gICAgICB3aXRoU3RhdChzdGF0LCBjb25mKSB7XG4gICAgICAgIHNlbGYudmFsaWRhdGVNZXRyaWNTdGF0KHN0YXQsIG1ldHJpYyk7XG4gICAgICAgIGNvbnN0IGNhblJlbmRlckFzTGVnYWN5TWV0cmljID0gY29uZi5yZW5kZXJpbmdQcm9wZXJ0aWVzPy5sYWJlbCA9PSB1bmRlZmluZWQgJiYgIXNlbGYucmVxdWlyZXNBY2NvdW50SWQoc3RhdCk7XG4gICAgICAgIC8vIERvIHRoaXMgdG8gZGlzdHVyYiBleGlzdGluZyB0ZW1wbGF0ZXMgYXMgbGl0dGxlIGFzIHBvc3NpYmxlXG4gICAgICAgIGlmIChjYW5SZW5kZXJBc0xlZ2FjeU1ldHJpYykge1xuICAgICAgICAgIHJldHVybiBkcm9wVW5kZWZpbmVkKHtcbiAgICAgICAgICAgIGRpbWVuc2lvbnM6IHN0YXQuZGltZW5zaW9ucyxcbiAgICAgICAgICAgIG5hbWVzcGFjZTogc3RhdC5uYW1lc3BhY2UsXG4gICAgICAgICAgICBtZXRyaWNOYW1lOiBzdGF0Lm1ldHJpY05hbWUsXG4gICAgICAgICAgICBwZXJpb2Q6IHN0YXQucGVyaW9kPy50b1NlY29uZHMoKSxcbiAgICAgICAgICAgIHN0YXRpc3RpYzogcmVuZGVySWZTaW1wbGVTdGF0aXN0aWMoc3RhdC5zdGF0aXN0aWMpLFxuICAgICAgICAgICAgZXh0ZW5kZWRTdGF0aXN0aWM6IHJlbmRlcklmRXh0ZW5kZWRTdGF0aXN0aWMoc3RhdC5zdGF0aXN0aWMpLFxuICAgICAgICAgICAgdW5pdDogc3RhdC51bml0RmlsdGVyLFxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBtZXRyaWNzOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIG1ldHJpY1N0YXQ6IHtcbiAgICAgICAgICAgICAgICBtZXRyaWM6IHtcbiAgICAgICAgICAgICAgICAgIG1ldHJpY05hbWU6IHN0YXQubWV0cmljTmFtZSxcbiAgICAgICAgICAgICAgICAgIG5hbWVzcGFjZTogc3RhdC5uYW1lc3BhY2UsXG4gICAgICAgICAgICAgICAgICBkaW1lbnNpb25zOiBzdGF0LmRpbWVuc2lvbnMsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBwZXJpb2Q6IHN0YXQucGVyaW9kLnRvU2Vjb25kcygpLFxuICAgICAgICAgICAgICAgIHN0YXQ6IHN0YXQuc3RhdGlzdGljLFxuICAgICAgICAgICAgICAgIHVuaXQ6IHN0YXQudW5pdEZpbHRlcixcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgaWQ6ICdtMScsXG4gICAgICAgICAgICAgIGFjY291bnRJZDogc2VsZi5yZXF1aXJlc0FjY291bnRJZChzdGF0KSA/IHN0YXQuYWNjb3VudCA6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgbGFiZWw6IGNvbmYucmVuZGVyaW5nUHJvcGVydGllcz8ubGFiZWwsXG4gICAgICAgICAgICAgIHJldHVybkRhdGE6IHRydWUsXG4gICAgICAgICAgICB9IGFzIENmbkFsYXJtLk1ldHJpY0RhdGFRdWVyeVByb3BlcnR5LFxuICAgICAgICAgIF0sXG4gICAgICAgIH07XG4gICAgICB9LFxuXG4gICAgICB3aXRoRXhwcmVzc2lvbigpIHtcbiAgICAgICAgLy8gRXhwYW5kIHRoZSBtYXRoIGV4cHJlc3Npb24gbWV0cmljIGludG8gYSBzZXRcbiAgICAgICAgY29uc3QgbXNldCA9IG5ldyBNZXRyaWNTZXQ8Ym9vbGVhbj4oKTtcbiAgICAgICAgbXNldC5hZGRUb3BMZXZlbCh0cnVlLCBtZXRyaWMpO1xuXG4gICAgICAgIGxldCBlaWQgPSAwO1xuICAgICAgICBmdW5jdGlvbiB1bmlxdWVNZXRyaWNJZCgpIHtcbiAgICAgICAgICByZXR1cm4gYGV4cHJfJHsrK2VpZH1gO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBtZXRyaWNzOiBtc2V0LmVudHJpZXMubWFwKGVudHJ5ID0+IGRpc3BhdGNoTWV0cmljKGVudHJ5Lm1ldHJpYywge1xuICAgICAgICAgICAgd2l0aFN0YXQoc3RhdCwgY29uZikge1xuICAgICAgICAgICAgICBzZWxmLnZhbGlkYXRlTWV0cmljU3RhdChzdGF0LCBlbnRyeS5tZXRyaWMpO1xuXG4gICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgbWV0cmljU3RhdDoge1xuICAgICAgICAgICAgICAgICAgbWV0cmljOiB7XG4gICAgICAgICAgICAgICAgICAgIG1ldHJpY05hbWU6IHN0YXQubWV0cmljTmFtZSxcbiAgICAgICAgICAgICAgICAgICAgbmFtZXNwYWNlOiBzdGF0Lm5hbWVzcGFjZSxcbiAgICAgICAgICAgICAgICAgICAgZGltZW5zaW9uczogc3RhdC5kaW1lbnNpb25zLFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgIHBlcmlvZDogc3RhdC5wZXJpb2QudG9TZWNvbmRzKCksXG4gICAgICAgICAgICAgICAgICBzdGF0OiBzdGF0LnN0YXRpc3RpYyxcbiAgICAgICAgICAgICAgICAgIHVuaXQ6IHN0YXQudW5pdEZpbHRlcixcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGlkOiBlbnRyeS5pZCB8fCB1bmlxdWVNZXRyaWNJZCgpLFxuICAgICAgICAgICAgICAgIGFjY291bnRJZDogc2VsZi5yZXF1aXJlc0FjY291bnRJZChzdGF0KSA/IHN0YXQuYWNjb3VudCA6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBsYWJlbDogY29uZi5yZW5kZXJpbmdQcm9wZXJ0aWVzPy5sYWJlbCxcbiAgICAgICAgICAgICAgICByZXR1cm5EYXRhOiBlbnRyeS50YWcgPyB1bmRlZmluZWQgOiBmYWxzZSwgLy8gZW50cnkudGFnIGV2YWx1YXRlcyB0byB0cnVlIGlmIHRoZSBtZXRyaWMgaXMgdGhlIG1hdGggZXhwcmVzc2lvbiB0aGUgYWxhcm0gaXMgYmFzZWQgb24uXG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgd2l0aEV4cHJlc3Npb24oZXhwciwgY29uZikge1xuXG4gICAgICAgICAgICAgIGNvbnN0IGhhc1N1Ym1ldHJpY3MgPSBtYXRoRXhwckhhc1N1Ym1ldHJpY3MoZXhwcik7XG5cbiAgICAgICAgICAgICAgaWYgKGhhc1N1Ym1ldHJpY3MpIHtcbiAgICAgICAgICAgICAgICBhc3NlcnRTdWJtZXRyaWNzQ291bnQoZXhwcik7XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICBzZWxmLnZhbGlkYXRlTWV0cmljRXhwcmVzc2lvbihleHByKTtcblxuICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIGV4cHJlc3Npb246IGV4cHIuZXhwcmVzc2lvbixcbiAgICAgICAgICAgICAgICBpZDogZW50cnkuaWQgfHwgdW5pcXVlTWV0cmljSWQoKSxcbiAgICAgICAgICAgICAgICBsYWJlbDogY29uZi5yZW5kZXJpbmdQcm9wZXJ0aWVzPy5sYWJlbCxcbiAgICAgICAgICAgICAgICBwZXJpb2Q6IGhhc1N1Ym1ldHJpY3MgPyB1bmRlZmluZWQgOiBleHByLnBlcmlvZCxcbiAgICAgICAgICAgICAgICByZXR1cm5EYXRhOiBlbnRyeS50YWcgPyB1bmRlZmluZWQgOiBmYWxzZSwgLy8gZW50cnkudGFnIGV2YWx1YXRlcyB0byB0cnVlIGlmIHRoZSBtZXRyaWMgaXMgdGhlIG1hdGggZXhwcmVzc2lvbiB0aGUgYWxhcm0gaXMgYmFzZWQgb24uXG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0pIGFzIENmbkFsYXJtLk1ldHJpY0RhdGFRdWVyeVByb3BlcnR5KSxcbiAgICAgICAgfTtcbiAgICAgIH0sXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogVmFsaWRhdGUgdGhhdCBpZiBhIHJlZ2lvbiBpcyBpbiB0aGUgZ2l2ZW4gc3RhdCBjb25maWcsIHRoZXkgbWF0Y2ggdGhlIEFsYXJtXG4gICAqL1xuICBwcml2YXRlIHZhbGlkYXRlTWV0cmljU3RhdChzdGF0OiBNZXRyaWNTdGF0Q29uZmlnLCBtZXRyaWM6IElNZXRyaWMpIHtcbiAgICBjb25zdCBzdGFjayA9IFN0YWNrLm9mKHRoaXMpO1xuXG4gICAgaWYgKGRlZmluaXRlbHlEaWZmZXJlbnQoc3RhdC5yZWdpb24sIHN0YWNrLnJlZ2lvbikpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgQ2Fubm90IGNyZWF0ZSBhbiBBbGFybSBpbiByZWdpb24gJyR7c3RhY2sucmVnaW9ufScgYmFzZWQgb24gbWV0cmljICcke21ldHJpY30nIGluICcke3N0YXQucmVnaW9ufSdgKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogVmFsaWRhdGVzIHRoYXQgdGhlIGV4cHJlc3Npb24gY29uZmlnIGRvZXMgbm90IHNwZWNpZnkgc2VhcmNoQWNjb3VudCBvciBzZWFyY2hSZWdpb24gcHJvcHNcbiAgICogYXMgc2VhcmNoIGV4cHJlc3Npb25zIGFyZSBub3Qgc3VwcG9ydGVkIGJ5IEFsYXJtcy5cbiAgICovXG4gIHByaXZhdGUgdmFsaWRhdGVNZXRyaWNFeHByZXNzaW9uKGV4cHI6IE1ldHJpY0V4cHJlc3Npb25Db25maWcpIHtcbiAgICBpZiAoZXhwci5zZWFyY2hBY2NvdW50ICE9PSB1bmRlZmluZWQgfHwgZXhwci5zZWFyY2hSZWdpb24gIT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3QgY3JlYXRlIGFuIEFsYXJtIGJhc2VkIG9uIGEgTWF0aEV4cHJlc3Npb24gd2hpY2ggc3BlY2lmaWVzIGEgc2VhcmNoQWNjb3VudCBvciBzZWFyY2hSZWdpb24nKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogRGV0ZXJtaW5lIGlmIHRoZSBhY2NvdW50SWQgcHJvcGVydHkgc2hvdWxkIGJlIGluY2x1ZGVkIGluIHRoZSBtZXRyaWMuXG4gICAqL1xuICBwcml2YXRlIHJlcXVpcmVzQWNjb3VudElkKHN0YXQ6IE1ldHJpY1N0YXRDb25maWcpOiBib29sZWFuIHtcbiAgICBjb25zdCBzdGFja0FjY291bnQgPSBTdGFjay5vZih0aGlzKS5hY2NvdW50O1xuXG4gICAgLy8gaWYgc3RhdC5hY2NvdW50IGlzIHVuZGVmaW5lZCwgaXQncyBieSBkZWZpbml0aW9uIGluIHRoZSBzYW1lIGFjY291bnRcbiAgICBpZiAoc3RhdC5hY2NvdW50ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICAvLyBSZXR1cm4gdHJ1ZSBpZiB0aGV5J3JlIGRpZmZlcmVudC4gVGhlIEFDQ09VTlRfSUQgdG9rZW4gaXMgaW50ZXJuZWRcbiAgICAvLyBzbyB3aWxsIGFsd2F5cyBoYXZlIHRoZSBzYW1lIHN0cmluZyB2YWx1ZSAoYW5kIGV2ZW4gaWYgd2UgZ3Vlc3Mgd3JvbmdcbiAgICAvLyBpdCB3aWxsIHN0aWxsIHdvcmspLlxuICAgIHJldHVybiBzdGFja0FjY291bnQgIT09IHN0YXQuYWNjb3VudDtcbiAgfVxufVxuXG5mdW5jdGlvbiBkZWZpbml0ZWx5RGlmZmVyZW50KHg6IHN0cmluZyB8IHVuZGVmaW5lZCwgeTogc3RyaW5nKSB7XG4gIHJldHVybiB4ICYmICFUb2tlbi5pc1VucmVzb2x2ZWQoeSkgJiYgeCAhPT0geTtcbn1cblxuLyoqXG4gKiBSZXR1cm4gYSBodW1hbiByZWFkYWJsZSBzdHJpbmcgZm9yIHRoaXMgcGVyaW9kXG4gKlxuICogV2Uga25vdyB0aGUgc2Vjb25kcyBhcmUgYWx3YXlzIG9uZSBvZiBhIGhhbmRmdWwgb2YgYWxsb3dlZCB2YWx1ZXMuXG4gKi9cbmZ1bmN0aW9uIGRlc2NyaWJlUGVyaW9kKHNlY29uZHM6IG51bWJlcikge1xuICBpZiAoc2Vjb25kcyA9PT0gNjApIHsgcmV0dXJuICcxIG1pbnV0ZSc7IH1cbiAgaWYgKHNlY29uZHMgPT09IDEpIHsgcmV0dXJuICcxIHNlY29uZCc7IH1cbiAgaWYgKHNlY29uZHMgPiA2MCkgeyByZXR1cm4gKHNlY29uZHMgLyA2MCkgKyAnIG1pbnV0ZXMnOyB9XG4gIHJldHVybiBzZWNvbmRzICsgJyBzZWNvbmRzJztcbn1cblxuZnVuY3Rpb24gcmVuZGVySWZTaW1wbGVTdGF0aXN0aWMoc3RhdGlzdGljPzogc3RyaW5nKTogc3RyaW5nIHwgdW5kZWZpbmVkIHtcbiAgaWYgKHN0YXRpc3RpYyA9PT0gdW5kZWZpbmVkKSB7IHJldHVybiB1bmRlZmluZWQ7IH1cblxuICBjb25zdCBwYXJzZWQgPSBwYXJzZVN0YXRpc3RpYyhzdGF0aXN0aWMpO1xuICBpZiAocGFyc2VkLnR5cGUgPT09ICdzaW1wbGUnKSB7XG4gICAgcmV0dXJuIG5vcm1hbGl6ZVN0YXRpc3RpYyhwYXJzZWQpO1xuICB9XG4gIHJldHVybiB1bmRlZmluZWQ7XG59XG5cbmZ1bmN0aW9uIHJlbmRlcklmRXh0ZW5kZWRTdGF0aXN0aWMoc3RhdGlzdGljPzogc3RyaW5nKTogc3RyaW5nIHwgdW5kZWZpbmVkIHtcbiAgaWYgKHN0YXRpc3RpYyA9PT0gdW5kZWZpbmVkKSB7IHJldHVybiB1bmRlZmluZWQ7IH1cblxuICBjb25zdCBwYXJzZWQgPSBwYXJzZVN0YXRpc3RpYyhzdGF0aXN0aWMpO1xuICBpZiAocGFyc2VkLnR5cGUgPT09ICdzaW5nbGUnIHx8IHBhcnNlZC50eXBlID09PSAncGFpcicpIHtcbiAgICByZXR1cm4gbm9ybWFsaXplU3RhdGlzdGljKHBhcnNlZCk7XG4gIH1cbiAgcmV0dXJuIHVuZGVmaW5lZDtcbn1cblxuZnVuY3Rpb24gbWF0aEV4cHJIYXNTdWJtZXRyaWNzKGV4cHI6IE1ldHJpY0V4cHJlc3Npb25Db25maWcpIHtcbiAgcmV0dXJuIE9iamVjdC5rZXlzKGV4cHIudXNpbmdNZXRyaWNzKS5sZW5ndGggPiAwO1xufVxuXG5mdW5jdGlvbiBhc3NlcnRTdWJtZXRyaWNzQ291bnQoZXhwcjogTWV0cmljRXhwcmVzc2lvbkNvbmZpZykge1xuICBpZiAoT2JqZWN0LmtleXMoZXhwci51c2luZ01ldHJpY3MpLmxlbmd0aCA+IDEwKSB7XG4gICAgLy8gaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FtYXpvbkNsb3VkV2F0Y2gvbGF0ZXN0L21vbml0b3JpbmcvQWxhcm1UaGF0U2VuZHNFbWFpbC5odG1sI2FsYXJtcy1vbi1tZXRyaWMtbWF0aC1leHByZXNzaW9uc1xuICAgIHRocm93IG5ldyBFcnJvcignQWxhcm1zIG9uIG1hdGggZXhwcmVzc2lvbnMgY2Fubm90IGNvbnRhaW4gbW9yZSB0aGFuIDEwIGluZGl2aWR1YWwgbWV0cmljcycpO1xuICB9O1xufVxuXG50eXBlIFdyaXRlYWJsZTxUPiA9IHsgLXJlYWRvbmx5IFtQIGluIGtleW9mIFRdOiBUW1BdIH07XG4iXX0=