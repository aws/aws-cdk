import { Resource } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { IWidget } from './widget';
/**
 * Specify the period for graphs when the CloudWatch dashboard loads
 */
export declare enum PeriodOverride {
    /**
     * Period of all graphs on the dashboard automatically adapt to the time range of the dashboard.
     */
    AUTO = "auto",
    /**
     * Period set for each graph will be used
     */
    INHERIT = "inherit"
}
/**
 * Properties for defining a CloudWatch Dashboard
 */
export interface DashboardProps {
    /**
     * Name of the dashboard.
     *
     * If set, must only contain alphanumerics, dash (-) and underscore (_)
     *
     * @default - automatically generated name
     */
    readonly dashboardName?: string;
    /**
     * The start of the time range to use for each widget on the dashboard.
     * You can specify start without specifying end to specify a relative time range that ends with the current time.
     * In this case, the value of start must begin with -P, and you can use M, H, D, W and M as abbreviations for
     * minutes, hours, days, weeks and months. For example, -PT8H shows the last 8 hours and -P3M shows the last three months.
     * You can also use start along with an end field, to specify an absolute time range.
     * When specifying an absolute time range, use the ISO 8601 format. For example, 2018-12-17T06:00:00.000Z.
     *
     * @default When the dashboard loads, the start time will be the default time range.
     */
    readonly start?: string;
    /**
     * The end of the time range to use for each widget on the dashboard when the dashboard loads.
     * If you specify a value for end, you must also specify a value for start.
     * Specify an absolute time in the ISO 8601 format. For example, 2018-12-17T06:00:00.000Z.
     *
     * @default When the dashboard loads, the end date will be the current time.
     */
    readonly end?: string;
    /**
     * Use this field to specify the period for the graphs when the dashboard loads.
     * Specifying `Auto` causes the period of all graphs on the dashboard to automatically adapt to the time range of the dashboard.
     * Specifying `Inherit` ensures that the period set for each graph is always obeyed.
     *
     * @default Auto
     */
    readonly periodOverride?: PeriodOverride;
    /**
     * Initial set of widgets on the dashboard
     *
     * One array represents a row of widgets.
     *
     * @default - No widgets
     */
    readonly widgets?: IWidget[][];
}
/**
 * A CloudWatch dashboard
 */
export declare class Dashboard extends Resource {
    /**
     * The name of this dashboard
     *
     * @attribute
    */
    readonly dashboardName: string;
    /**
     * ARN of this dashboard
     *
     * @attribute
     */
    readonly dashboardArn: string;
    private readonly rows;
    constructor(scope: Construct, id: string, props?: DashboardProps);
    /**
     * Add a widget to the dashboard.
     *
     * Widgets given in multiple calls to add() will be laid out stacked on
     * top of each other.
     *
     * Multiple widgets added in the same call to add() will be laid out next
     * to each other.
     */
    addWidgets(...widgets: IWidget[]): void;
}
