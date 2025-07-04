import { ConcreteWidget } from './widget';
import * as cdk from '../../core';

/**
 * Types of view
 */
export enum LogQueryVisualizationType {
  /**
   * Table view
   */
  TABLE = 'table',
  /**
   * Line view
   */
  LINE = 'line',
  /**
   * Stacked area view
   */
  STACKEDAREA = 'stackedarea',
  /**
   * Bar view
   */
  BAR = 'bar',
  /**
   * Pie view
   */
  PIE = 'pie',
}
/**
 * Logs Query Language
 */
export enum LogQueryLanguage {
  /** Logs Insights QL */
  LOGS_INSIGHTS = 'Logs',
  /** OpenSearch SQL */
  SQL = 'SQL',
  /** OpenSearch PPL */
  PPL = 'PPL',
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
   * The query language to use for the query.
   * @default LogQueryLanguage.LOGS_INSIGHTS
   */
  readonly queryLanguage?: LogQueryLanguage;

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

  /**
   * The AWS account ID where the log groups are located.
   *
   * This enables cross-account functionality for CloudWatch dashboards.
   * Before using this feature, ensure that proper cross-account sharing is configured
   * between the monitoring account and source account.
   *
   * For more information, see:
   * https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Unified-Cross-Account.html
   *
   * @default - Current account
   */
  readonly accountId?: string;

}

/**
 * Display query results from Logs Insights
 */
export class LogQueryWidget extends ConcreteWidget {
  private readonly props: LogQueryWidgetProps;

  constructor(props: LogQueryWidgetProps) {
    super(props.width || 6, props.height || 6);
    this.props = props;

    if (props.logGroupNames.length === 0) {
      throw new cdk.UnscopedValidationError('Specify at least one log group name.');
    }

    if (!!props.queryString === !!props.queryLines) {
      throw new cdk.UnscopedValidationError('Specify exactly one of \'queryString\' and \'queryLines\'');
    }
  }
  public toJson(): any[] {
    const sources = this.props.logGroupNames.map(l => `SOURCE '${l}'`).join(' | ');
    const query = this.props.queryLines
      ? this.props.queryLines.join('\n| ')
      : this.props.queryString;

    const properties: any = {
      view: this.props.view ? this.props.view : LogQueryVisualizationType.TABLE,
      title: this.props.title,
      region: this.props.region || cdk.Aws.REGION,
      accountId: this.props.accountId,
      query: `${sources} | ${query}`,
    };

    // Add queryLanguage property if specified
    if (this.props.queryLanguage) {
      properties.queryLanguage = this.props.queryLanguage;
    }

    // Add stacked property in case of LINE or STACKEDAREA
    if (this.props.view === LogQueryVisualizationType.LINE || this.props.view === LogQueryVisualizationType.STACKEDAREA) {
      // assign the right native view value. both types share the same value
      properties.view = 'timeSeries',
      properties.stacked = this.props.view === LogQueryVisualizationType.STACKEDAREA ? true : false;
    }

    return [{
      type: 'log',
      width: this.width,
      height: this.height,
      x: this.x,
      y: this.y,
      properties: properties,
    }];
  }
}
