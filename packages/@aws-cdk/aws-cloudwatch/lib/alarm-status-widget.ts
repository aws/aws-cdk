import { IAlarm } from './alarm-base';
import { ConcreteWidget } from './widget';

/**
 * Properties for an Alarm Status Widget
 */
export interface AlarmStatusWidgetProps {
  /**
   * CloudWatch Alarms to show in widget
   */
  readonly alarms: IAlarm[];
  /**
   * The title of the widget
   *
   * @default 'Alarm Status'
   */
  readonly title?: string;
  /**
   * Width of the widget, in a grid of 24 units wide
   *
   * @default 6
   */
  readonly width?: number;
  /**
   * Height of the widget
   *
   * @default 3
   */
  readonly height?: number;
}

/**
 * A dashboard widget that displays alarms in a grid view
 */
export class AlarmStatusWidget extends ConcreteWidget {
  private readonly props: AlarmStatusWidgetProps;

  constructor(props: AlarmStatusWidgetProps) {
    super(props.width || 6, props.height || 3);
    this.props = props;
  }

  public position(x: number, y: number): void {
    this.x = x;
    this.y = y;
  }

  public toJson(): any[] {
    return [
      {
        type: 'alarm',
        width: this.width,
        height: this.height,
        x: this.x,
        y: this.y,
        properties: {
          title: this.props.title ? this.props.title : 'Alarm Status',
          alarms: this.props.alarms.map((alarm) => alarm.alarmArn),
        },
      },
    ];
  }
}
