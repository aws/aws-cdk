import * as cdk from '@aws-cdk/core';
import { ConcreteWidget } from './widget';

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
export class LogQueryWidget extends ConcreteWidget {
  private readonly props: LogQueryWidgetProps;

  constructor(props: LogQueryWidgetProps) {
    super(props.width || 6, props.height || 6);
    this.props = props;

    if (props.logGroupNames.length === 0) {
      throw new Error('Specify at least one log group name.');
    }

    if (!!props.queryString === !!props.queryLines) {
      throw new Error('Specify exactly one of \'queryString\' and \'queryLines\'');
    }
  }

  public toJson(): any[] {
    const sources = this.props.logGroupNames.map(l => `SOURCE '${l}'`).join(' | ');
    const query = this.props.queryLines
      ? this.props.queryLines.join('\n| ')
      : this.props.queryString;

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
        query: `${sources} | ${query}`,
      },
    }];
  }
}
