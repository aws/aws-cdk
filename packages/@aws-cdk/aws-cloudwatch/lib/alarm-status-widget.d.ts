import { IAlarm } from './alarm-base';
import { AlarmState } from './alarm-rule';
import { ConcreteWidget } from './widget';
/**
 * The sort possibilities for AlarmStatusWidgets
 */
export declare enum AlarmStatusWidgetSortBy {
    /**
     * Choose DEFAULT to sort them in alphabetical order by alarm name.
     */
    DEFAULT = "default",
    /**
     * Choose STATE_UPDATED_TIMESTAMP to sort them first by alarm state, with alarms in ALARM state first,
     * INSUFFICIENT_DATA alarms next, and OK alarms last.
     * Within each group, the alarms are sorted by when they last changed state, with more recent state changes listed first.
     */
    STATE_UPDATED_TIMESTAMP = "stateUpdatedTimestamp",
    /**
     * Choose TIMESTAMP to sort them by the time when the alarms most recently changed state,
     * no matter the current alarm state.
     * The alarm that changed state most recently is listed first.
     */
    TIMESTAMP = "timestamp"
}
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
    /**
     * Specifies how to sort the alarms in the widget.
     *
     * @default - alphabetical order
     */
    readonly sortBy?: AlarmStatusWidgetSortBy;
    /**
     * Use this field to filter the list of alarms displayed in the widget to only those alarms currently in the specified states.
     * You can specify one or more alarm states in the value for this field.
     * The alarm states that you can specify are ALARM, INSUFFICIENT_DATA, and OK.
     *
     * If you omit this field or specify an empty array, all the alarms specifed in alarms are displayed.
     *
     * @default -  all the alarms specified in alarms are displayed.
     */
    readonly states?: AlarmState[];
}
/**
 * A dashboard widget that displays alarms in a grid view
 */
export declare class AlarmStatusWidget extends ConcreteWidget {
    private readonly props;
    constructor(props: AlarmStatusWidgetProps);
    position(x: number, y: number): void;
    toJson(): any[];
}
