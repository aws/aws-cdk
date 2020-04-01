import * as cdk from '@aws-cdk/core';
import { ConcreteWidget } from './widget';

/**
 * Allows any object providing a logGroupName to be supplied to a QueryWidget such as an ILogGroup.
 */
export interface IQueryLogGroup {
  /**
   * The name of this log group
   * @attribute
   */
  readonly logGroupName: string;
}

/**
 * Properties for a Query widget
 */
export interface QueryWidgetProps {
  /**
   * Title for the widget
   *
   * @default No title
   */
  readonly title?: string;

  /**
   * Log group to query
   */
  readonly logGroup: IQueryLogGroup; // ILogGroup cannot be used without creating cyclic dependencies.

  /**
   * Query for log insights
   */
  readonly queryString: string;

  /**
   * The region the metrics of this widget should be taken from
   *
   * @default Current region
   */
  readonly region?: string;

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
export class QueryWidget extends ConcreteWidget {
  private readonly props: QueryWidgetProps;

  constructor(props: QueryWidgetProps) {
    super(props.width || 6, props.height || 6);
    this.props = props;
  }

  public toJson(): any[] {
    return [{
      type: 'log',
      width: this.width,
      height: this.height,
      x: this.x,
      y: this.y,
      properties: {
        view: 'table',
        title: this.props.title,
        region: this.props.region || cdk.Aws.REGION,
        query: `SOURCE '${this.props.logGroup.logGroupName}' | ${this.props.queryString}`,
      },
    }];
  }
}
