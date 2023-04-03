"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlarmStatusWidget = exports.AlarmStatusWidgetSortBy = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const widget_1 = require("./widget");
/**
 * The sort possibilities for AlarmStatusWidgets
 */
var AlarmStatusWidgetSortBy;
(function (AlarmStatusWidgetSortBy) {
    /**
     * Choose DEFAULT to sort them in alphabetical order by alarm name.
     */
    AlarmStatusWidgetSortBy["DEFAULT"] = "default";
    /**
     * Choose STATE_UPDATED_TIMESTAMP to sort them first by alarm state, with alarms in ALARM state first,
     * INSUFFICIENT_DATA alarms next, and OK alarms last.
     * Within each group, the alarms are sorted by when they last changed state, with more recent state changes listed first.
     */
    AlarmStatusWidgetSortBy["STATE_UPDATED_TIMESTAMP"] = "stateUpdatedTimestamp";
    /**
     * Choose TIMESTAMP to sort them by the time when the alarms most recently changed state,
     * no matter the current alarm state.
     * The alarm that changed state most recently is listed first.
     */
    AlarmStatusWidgetSortBy["TIMESTAMP"] = "timestamp";
})(AlarmStatusWidgetSortBy = exports.AlarmStatusWidgetSortBy || (exports.AlarmStatusWidgetSortBy = {}));
/**
 * A dashboard widget that displays alarms in a grid view
 */
class AlarmStatusWidget extends widget_1.ConcreteWidget {
    constructor(props) {
        super(props.width || 6, props.height || 3);
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_cloudwatch_AlarmStatusWidgetProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, AlarmStatusWidget);
            }
            throw error;
        }
        this.props = props;
    }
    position(x, y) {
        this.x = x;
        this.y = y;
    }
    toJson() {
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
                    states: this.props.states,
                    sortBy: this.props.sortBy,
                },
            },
        ];
    }
}
_a = JSII_RTTI_SYMBOL_1;
AlarmStatusWidget[_a] = { fqn: "@aws-cdk/aws-cloudwatch.AlarmStatusWidget", version: "0.0.0" };
exports.AlarmStatusWidget = AlarmStatusWidget;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWxhcm0tc3RhdHVzLXdpZGdldC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImFsYXJtLXN0YXR1cy13aWRnZXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBRUEscUNBQTBDO0FBRzFDOztHQUVHO0FBQ0gsSUFBWSx1QkFvQlg7QUFwQkQsV0FBWSx1QkFBdUI7SUFFakM7O09BRUc7SUFDSCw4Q0FBbUIsQ0FBQTtJQUVuQjs7OztPQUlHO0lBQ0gsNEVBQWlELENBQUE7SUFFakQ7Ozs7T0FJRztJQUNILGtEQUF1QixDQUFBO0FBQ3pCLENBQUMsRUFwQlcsdUJBQXVCLEdBQXZCLCtCQUF1QixLQUF2QiwrQkFBdUIsUUFvQmxDO0FBZ0REOztHQUVHO0FBQ0gsTUFBYSxpQkFBa0IsU0FBUSx1QkFBYztJQUduRCxZQUFZLEtBQTZCO1FBQ3ZDLEtBQUssQ0FBQyxLQUFLLENBQUMsS0FBSyxJQUFJLENBQUMsRUFBRSxLQUFLLENBQUMsTUFBTSxJQUFJLENBQUMsQ0FBQyxDQUFDOzs7Ozs7K0NBSmxDLGlCQUFpQjs7OztRQUsxQixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztLQUNwQjtJQUVNLFFBQVEsQ0FBQyxDQUFTLEVBQUUsQ0FBUztRQUNsQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNYLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0tBQ1o7SUFFTSxNQUFNO1FBQ1gsT0FBTztZQUNMO2dCQUNFLElBQUksRUFBRSxPQUFPO2dCQUNiLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSztnQkFDakIsTUFBTSxFQUFFLElBQUksQ0FBQyxNQUFNO2dCQUNuQixDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7Z0JBQ1QsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO2dCQUNULFVBQVUsRUFBRTtvQkFDVixLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxjQUFjO29CQUMzRCxNQUFNLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDO29CQUN4RCxNQUFNLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNO29CQUN6QixNQUFNLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNO2lCQUMxQjthQUNGO1NBQ0YsQ0FBQztLQUNIOzs7O0FBN0JVLDhDQUFpQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IElBbGFybSB9IGZyb20gJy4vYWxhcm0tYmFzZSc7XG5pbXBvcnQgeyBBbGFybVN0YXRlIH0gZnJvbSAnLi9hbGFybS1ydWxlJztcbmltcG9ydCB7IENvbmNyZXRlV2lkZ2V0IH0gZnJvbSAnLi93aWRnZXQnO1xuXG5cbi8qKlxuICogVGhlIHNvcnQgcG9zc2liaWxpdGllcyBmb3IgQWxhcm1TdGF0dXNXaWRnZXRzXG4gKi9cbmV4cG9ydCBlbnVtIEFsYXJtU3RhdHVzV2lkZ2V0U29ydEJ5IHtcblxuICAvKipcbiAgICogQ2hvb3NlIERFRkFVTFQgdG8gc29ydCB0aGVtIGluIGFscGhhYmV0aWNhbCBvcmRlciBieSBhbGFybSBuYW1lLlxuICAgKi9cbiAgREVGQVVMVCA9ICdkZWZhdWx0JyxcblxuICAvKipcbiAgICogQ2hvb3NlIFNUQVRFX1VQREFURURfVElNRVNUQU1QIHRvIHNvcnQgdGhlbSBmaXJzdCBieSBhbGFybSBzdGF0ZSwgd2l0aCBhbGFybXMgaW4gQUxBUk0gc3RhdGUgZmlyc3QsXG4gICAqIElOU1VGRklDSUVOVF9EQVRBIGFsYXJtcyBuZXh0LCBhbmQgT0sgYWxhcm1zIGxhc3QuXG4gICAqIFdpdGhpbiBlYWNoIGdyb3VwLCB0aGUgYWxhcm1zIGFyZSBzb3J0ZWQgYnkgd2hlbiB0aGV5IGxhc3QgY2hhbmdlZCBzdGF0ZSwgd2l0aCBtb3JlIHJlY2VudCBzdGF0ZSBjaGFuZ2VzIGxpc3RlZCBmaXJzdC5cbiAgICovXG4gIFNUQVRFX1VQREFURURfVElNRVNUQU1QID0gJ3N0YXRlVXBkYXRlZFRpbWVzdGFtcCcsXG5cbiAgLyoqXG4gICAqIENob29zZSBUSU1FU1RBTVAgdG8gc29ydCB0aGVtIGJ5IHRoZSB0aW1lIHdoZW4gdGhlIGFsYXJtcyBtb3N0IHJlY2VudGx5IGNoYW5nZWQgc3RhdGUsXG4gICAqIG5vIG1hdHRlciB0aGUgY3VycmVudCBhbGFybSBzdGF0ZS5cbiAgICogVGhlIGFsYXJtIHRoYXQgY2hhbmdlZCBzdGF0ZSBtb3N0IHJlY2VudGx5IGlzIGxpc3RlZCBmaXJzdC5cbiAgICovXG4gIFRJTUVTVEFNUCA9ICd0aW1lc3RhbXAnLFxufVxuXG4vKipcbiAqIFByb3BlcnRpZXMgZm9yIGFuIEFsYXJtIFN0YXR1cyBXaWRnZXRcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBBbGFybVN0YXR1c1dpZGdldFByb3BzIHtcbiAgLyoqXG4gICAqIENsb3VkV2F0Y2ggQWxhcm1zIHRvIHNob3cgaW4gd2lkZ2V0XG4gICAqL1xuICByZWFkb25seSBhbGFybXM6IElBbGFybVtdO1xuICAvKipcbiAgICogVGhlIHRpdGxlIG9mIHRoZSB3aWRnZXRcbiAgICpcbiAgICogQGRlZmF1bHQgJ0FsYXJtIFN0YXR1cydcbiAgICovXG4gIHJlYWRvbmx5IHRpdGxlPzogc3RyaW5nO1xuICAvKipcbiAgICogV2lkdGggb2YgdGhlIHdpZGdldCwgaW4gYSBncmlkIG9mIDI0IHVuaXRzIHdpZGVcbiAgICpcbiAgICogQGRlZmF1bHQgNlxuICAgKi9cbiAgcmVhZG9ubHkgd2lkdGg/OiBudW1iZXI7XG4gIC8qKlxuICAgKiBIZWlnaHQgb2YgdGhlIHdpZGdldFxuICAgKlxuICAgKiBAZGVmYXVsdCAzXG4gICAqL1xuICByZWFkb25seSBoZWlnaHQ/OiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIFNwZWNpZmllcyBob3cgdG8gc29ydCB0aGUgYWxhcm1zIGluIHRoZSB3aWRnZXQuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gYWxwaGFiZXRpY2FsIG9yZGVyXG4gICAqL1xuICByZWFkb25seSBzb3J0Qnk/OiBBbGFybVN0YXR1c1dpZGdldFNvcnRCeTtcblxuICAvKipcbiAgICogVXNlIHRoaXMgZmllbGQgdG8gZmlsdGVyIHRoZSBsaXN0IG9mIGFsYXJtcyBkaXNwbGF5ZWQgaW4gdGhlIHdpZGdldCB0byBvbmx5IHRob3NlIGFsYXJtcyBjdXJyZW50bHkgaW4gdGhlIHNwZWNpZmllZCBzdGF0ZXMuXG4gICAqIFlvdSBjYW4gc3BlY2lmeSBvbmUgb3IgbW9yZSBhbGFybSBzdGF0ZXMgaW4gdGhlIHZhbHVlIGZvciB0aGlzIGZpZWxkLlxuICAgKiBUaGUgYWxhcm0gc3RhdGVzIHRoYXQgeW91IGNhbiBzcGVjaWZ5IGFyZSBBTEFSTSwgSU5TVUZGSUNJRU5UX0RBVEEsIGFuZCBPSy5cbiAgICpcbiAgICogSWYgeW91IG9taXQgdGhpcyBmaWVsZCBvciBzcGVjaWZ5IGFuIGVtcHR5IGFycmF5LCBhbGwgdGhlIGFsYXJtcyBzcGVjaWZlZCBpbiBhbGFybXMgYXJlIGRpc3BsYXllZC5cbiAgICpcbiAgICogQGRlZmF1bHQgLSAgYWxsIHRoZSBhbGFybXMgc3BlY2lmaWVkIGluIGFsYXJtcyBhcmUgZGlzcGxheWVkLlxuICAgKi9cbiAgcmVhZG9ubHkgc3RhdGVzPzogQWxhcm1TdGF0ZVtdO1xufVxuXG4vKipcbiAqIEEgZGFzaGJvYXJkIHdpZGdldCB0aGF0IGRpc3BsYXlzIGFsYXJtcyBpbiBhIGdyaWQgdmlld1xuICovXG5leHBvcnQgY2xhc3MgQWxhcm1TdGF0dXNXaWRnZXQgZXh0ZW5kcyBDb25jcmV0ZVdpZGdldCB7XG4gIHByaXZhdGUgcmVhZG9ubHkgcHJvcHM6IEFsYXJtU3RhdHVzV2lkZ2V0UHJvcHM7XG5cbiAgY29uc3RydWN0b3IocHJvcHM6IEFsYXJtU3RhdHVzV2lkZ2V0UHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcy53aWR0aCB8fCA2LCBwcm9wcy5oZWlnaHQgfHwgMyk7XG4gICAgdGhpcy5wcm9wcyA9IHByb3BzO1xuICB9XG5cbiAgcHVibGljIHBvc2l0aW9uKHg6IG51bWJlciwgeTogbnVtYmVyKTogdm9pZCB7XG4gICAgdGhpcy54ID0geDtcbiAgICB0aGlzLnkgPSB5O1xuICB9XG5cbiAgcHVibGljIHRvSnNvbigpOiBhbnlbXSB7XG4gICAgcmV0dXJuIFtcbiAgICAgIHtcbiAgICAgICAgdHlwZTogJ2FsYXJtJyxcbiAgICAgICAgd2lkdGg6IHRoaXMud2lkdGgsXG4gICAgICAgIGhlaWdodDogdGhpcy5oZWlnaHQsXG4gICAgICAgIHg6IHRoaXMueCxcbiAgICAgICAgeTogdGhpcy55LFxuICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgdGl0bGU6IHRoaXMucHJvcHMudGl0bGUgPyB0aGlzLnByb3BzLnRpdGxlIDogJ0FsYXJtIFN0YXR1cycsXG4gICAgICAgICAgYWxhcm1zOiB0aGlzLnByb3BzLmFsYXJtcy5tYXAoKGFsYXJtKSA9PiBhbGFybS5hbGFybUFybiksXG4gICAgICAgICAgc3RhdGVzOiB0aGlzLnByb3BzLnN0YXRlcyxcbiAgICAgICAgICBzb3J0Qnk6IHRoaXMucHJvcHMuc29ydEJ5LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICBdO1xuICB9XG59XG4iXX0=