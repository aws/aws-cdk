import { Lazy, Resource, Stack, Token, Annotations, Duration } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { CfnDashboard } from './cloudwatch.generated';
import { Column, Row } from './layout';
import { IWidget } from './widget';

/**
 * Specify the period for graphs when the CloudWatch dashboard loads
 */
export enum PeriodOverride {
  /**
   * Period of all graphs on the dashboard automatically adapt to the time range of the dashboard.
   */
  AUTO = 'auto',
  /**
   * Period set for each graph will be used
   */
  INHERIT = 'inherit',
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
   * Interval duration for metrics.
   * You can specify defaultInterval with the relative time(eg. cdk.Duration.days(7)).
   *
   * @default When the dashboard loads, the defaultInterval time will be the default time range.
   */
  readonly defaultInterval?: Duration

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
  readonly widgets?: IWidget[][]
}

/**
 * A CloudWatch dashboard
 */
export class Dashboard extends Resource {

  /**
   * The name of this dashboard
   *
   * @attribute
  */
  public readonly dashboardName: string;

  /**
   * ARN of this dashboard
   *
   * @attribute
   */
  public readonly dashboardArn: string;

  private readonly rows: IWidget[] = [];

  constructor(scope: Construct, id: string, props: DashboardProps = {}) {
    super(scope, id, {
      physicalName: props.dashboardName,
    });

    {
      const { dashboardName } = props;
      if (dashboardName && !Token.isUnresolved(dashboardName) && !dashboardName.match(/^[\w-]+$/)) {
        throw new Error([
          `The value ${dashboardName} for field dashboardName contains invalid characters.`,
          'It can only contain alphanumerics, dash (-) and underscore (_).',
        ].join(' '));
      }
    }

    if (props.start !== undefined && props.defaultInterval !== undefined) {
      throw ('both properties defaultInterval and start cannot be set at once');
    }

    const dashboard = new CfnDashboard(this, 'Resource', {
      dashboardName: this.physicalName,
      dashboardBody: Lazy.string({
        produce: () => {
          const column = new Column(...this.rows);
          column.position(0, 0);
          return Stack.of(this).toJsonString({
            start: props.defaultInterval !== undefined ? `-${props.defaultInterval?.toIsoString()}` : props.start,
            end: props.defaultInterval !== undefined ? undefined : props.end,
            periodOverride: props.periodOverride,
            widgets: column.toJson(),
          });
        },
      }),
    });

    this.dashboardName = this.getResourceNameAttribute(dashboard.ref);

    (props.widgets || []).forEach(row => {
      this.addWidgets(...row);
    });

    this.dashboardArn = Stack.of(this).formatArn({
      service: 'cloudwatch',
      resource: 'dashboard',
      region: '',
      resourceName: this.physicalName,
    });
  }

  /**
   * Add a widget to the dashboard.
   *
   * Widgets given in multiple calls to add() will be laid out stacked on
   * top of each other.
   *
   * Multiple widgets added in the same call to add() will be laid out next
   * to each other.
   */
  public addWidgets(...widgets: IWidget[]) {
    if (widgets.length === 0) {
      return;
    }

    const warnings = allWidgetsDeep(widgets).flatMap(w => w.warnings ?? []);
    for (const w of warnings) {
      Annotations.of(this).addWarning(w);
    }

    const w = widgets.length > 1 ? new Row(...widgets) : widgets[0];
    this.rows.push(w);
  }
}

function allWidgetsDeep(ws: IWidget[]) {
  const ret = new Array<IWidget>();
  ws.forEach(recurse);
  return ret;

  function recurse(w: IWidget) {
    ret.push(w);
    if (hasSubWidgets(w)) {
      w.widgets.forEach(recurse);
    }
  }
}

function hasSubWidgets(w: IWidget): w is IWidget & { widgets: IWidget[] } {
  return 'widgets' in w;
}
