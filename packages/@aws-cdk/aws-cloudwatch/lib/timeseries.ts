import { CfnAlarm } from "./cloudwatch.generated";
import { IExpression } from "./expression";
import { yAxisType } from "./metric-types";
import MetricDataQueryProperty = CfnAlarm.MetricDataQueryProperty;

export type MetricJson = [string, string, ...any[]];
export type ExpressionJson = [IExpression];
export type TimeSeriesJson = ExpressionJson|MetricJson;

/**
 * TODO
 */
export interface ToJsonProps {
    /**
     * TODO
     * @default TODO
     */
    readonly yAxis?: yAxisType,

    /**
     * TODO
     * @default TODO
     */
    readonly visible?: boolean
}

/**
 * TODO
 */
export interface AlarmTimeSeriesProps {
    /**
     * TODO
     * @default TODO
     */
    readonly returnData?: boolean
}

/**
 * TODO
 */
export interface ITimeSeries {
    // TODO: should add properties?

    /**
     * Returns an the array representation of this timeseries.
     */
    toJson(props?: ToJsonProps): TimeSeriesJson
    /**
     * Returns a configuration entry suitable for alarms.Metrics
     */
    toAlarmTimeSeries(props?: AlarmTimeSeriesProps): MetricDataQueryProperty
}