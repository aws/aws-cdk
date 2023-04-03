import { ConcreteWidget } from './widget';
/**
 * Types of view
 */
export declare enum LogQueryVisualizationType {
    /**
     * Table view
     */
    TABLE = "table",
    /**
     * Line view
     */
    LINE = "line",
    /**
     * Stacked area view
     */
    STACKEDAREA = "stackedarea",
    /**
     * Bar view
     */
    BAR = "bar",
    /**
     * Pie view
     */
    PIE = "pie"
}
/**
 * Properties for a Query widget
 */
export interface LogQueryWidgetProps {
    /**
     * Title for the widget
     *
     * @default No title
     */
    readonly title?: string;
    /**
     * Names of log groups to query
     */
    readonly logGroupNames: string[];
    /**
     * Full query string for log insights
     *
     * Be sure to prepend every new line with a newline and pipe character
     * (`\n|`).
     *
     * @default - Exactly one of `queryString`, `queryLines` is required.
     */
    readonly queryString?: string;
    /**
     * A sequence of lines to use to build the query
     *
     * The query will be built by joining the lines together using `\n|`.
     *
     * @default - Exactly one of `queryString`, `queryLines` is required.
     */
    readonly queryLines?: string[];
    /**
     * The region the metrics of this widget should be taken from
     *
     * @default Current region
     */
    readonly region?: string;
    /**
     * The type of view to use
     *
     * @default LogQueryVisualizationType.TABLE
     */
    readonly view?: LogQueryVisualizationType;
    /**
     * Width of the widget, in a grid of 24 units wide
     *
     * @default 6
     */
    readonly width?: number;
    /**
     * Height of the widget
     *
     * @default 6
     */
    readonly height?: number;
}
/**
 * Display query results from Logs Insights
 */
export declare class LogQueryWidget extends ConcreteWidget {
    private readonly props;
    constructor(props: LogQueryWidgetProps);
    toJson(): any[];
}
