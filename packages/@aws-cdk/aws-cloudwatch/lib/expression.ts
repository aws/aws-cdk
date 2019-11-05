import {CfnAlarm} from "./cloudwatch.generated";
import {AlarmTimeSeriesProps, ITimeSeries, TimeSeriesJson, ToJsonProps} from "./timeseries";
import MetricDataQueryProperty = CfnAlarm.MetricDataQueryProperty;

/**
 * TODO
 */
export interface IExpression extends ITimeSeries {
    /**
     * Math or search expression
     */
    expression: string
    /**
     * Unique ID
     */
    id: string
    /**
     * Label for this expression when added to a Graph in a Dashboard
     */
    label?: string
}

/**
 * TODO
 */
export interface ExpressionProps {
    /**
     * TODO
     */
    readonly expression: string
    /**
     * TODO
     */
    readonly id: string
    /**
     * TODO
     * @default TODO
     */
    readonly label?: string
}

/**
 * TODOs
 */
export class Expression implements IExpression {
    /**
     * TODO
     */
    public expression: string;
    /**
     * TODO
     */
    public id: string;
    /**
     * TODO
     * @default TODO
     */
    public label?: string;

    constructor(props: ExpressionProps) {
        this.expression = props.expression;
        this.id = props.id;
        this.label = props.label;
    }

    public toJson(_props: ToJsonProps = {}): TimeSeriesJson {
        return [this];
    }

    public toAlarmTimeSeries(props: AlarmTimeSeriesProps = {}): MetricDataQueryProperty {
        return {
            ...this,
            returnData: props.returnData
        };
    }
}