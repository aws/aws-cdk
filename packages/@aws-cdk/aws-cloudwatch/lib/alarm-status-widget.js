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
exports.AlarmStatusWidget = AlarmStatusWidget;
_a = JSII_RTTI_SYMBOL_1;
AlarmStatusWidget[_a] = { fqn: "@aws-cdk/aws-cloudwatch.AlarmStatusWidget", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWxhcm0tc3RhdHVzLXdpZGdldC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImFsYXJtLXN0YXR1cy13aWRnZXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBRUEscUNBQTBDO0FBRzFDOztHQUVHO0FBQ0gsSUFBWSx1QkFvQlg7QUFwQkQsV0FBWSx1QkFBdUI7SUFFakM7O09BRUc7SUFDSCw4Q0FBbUIsQ0FBQTtJQUVuQjs7OztPQUlHO0lBQ0gsNEVBQWlELENBQUE7SUFFakQ7Ozs7T0FJRztJQUNILGtEQUF1QixDQUFBO0FBQ3pCLENBQUMsRUFwQlcsdUJBQXVCLEdBQXZCLCtCQUF1QixLQUF2QiwrQkFBdUIsUUFvQmxDO0FBZ0REOztHQUVHO0FBQ0gsTUFBYSxpQkFBa0IsU0FBUSx1QkFBYztJQUduRCxZQUFZLEtBQTZCO1FBQ3ZDLEtBQUssQ0FBQyxLQUFLLENBQUMsS0FBSyxJQUFJLENBQUMsRUFBRSxLQUFLLENBQUMsTUFBTSxJQUFJLENBQUMsQ0FBQyxDQUFDOzs7Ozs7K0NBSmxDLGlCQUFpQjs7OztRQUsxQixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztLQUNwQjtJQUVNLFFBQVEsQ0FBQyxDQUFTLEVBQUUsQ0FBUztRQUNsQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNYLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0tBQ1o7SUFFTSxNQUFNO1FBQ1gsT0FBTztZQUNMO2dCQUNFLElBQUksRUFBRSxPQUFPO2dCQUNiLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSztnQkFDakIsTUFBTSxFQUFFLElBQUksQ0FBQyxNQUFNO2dCQUNuQixDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7Z0JBQ1QsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO2dCQUNULFVBQVUsRUFBRTtvQkFDVixLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxjQUFjO29CQUMzRCxNQUFNLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDO29CQUN4RCxNQUFNLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNO29CQUN6QixNQUFNLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNO2lCQUMxQjthQUNGO1NBQ0YsQ0FBQztLQUNIOztBQTdCSCw4Q0E4QkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJQWxhcm0gfSBmcm9tICcuL2FsYXJtLWJhc2UnO1xuaW1wb3J0IHsgQWxhcm1TdGF0ZSB9IGZyb20gJy4vYWxhcm0tcnVsZSc7XG5pbXBvcnQgeyBDb25jcmV0ZVdpZGdldCB9IGZyb20gJy4vd2lkZ2V0JztcblxuXG4vKipcbiAqIFRoZSBzb3J0IHBvc3NpYmlsaXRpZXMgZm9yIEFsYXJtU3RhdHVzV2lkZ2V0c1xuICovXG5leHBvcnQgZW51bSBBbGFybVN0YXR1c1dpZGdldFNvcnRCeSB7XG5cbiAgLyoqXG4gICAqIENob29zZSBERUZBVUxUIHRvIHNvcnQgdGhlbSBpbiBhbHBoYWJldGljYWwgb3JkZXIgYnkgYWxhcm0gbmFtZS5cbiAgICovXG4gIERFRkFVTFQgPSAnZGVmYXVsdCcsXG5cbiAgLyoqXG4gICAqIENob29zZSBTVEFURV9VUERBVEVEX1RJTUVTVEFNUCB0byBzb3J0IHRoZW0gZmlyc3QgYnkgYWxhcm0gc3RhdGUsIHdpdGggYWxhcm1zIGluIEFMQVJNIHN0YXRlIGZpcnN0LFxuICAgKiBJTlNVRkZJQ0lFTlRfREFUQSBhbGFybXMgbmV4dCwgYW5kIE9LIGFsYXJtcyBsYXN0LlxuICAgKiBXaXRoaW4gZWFjaCBncm91cCwgdGhlIGFsYXJtcyBhcmUgc29ydGVkIGJ5IHdoZW4gdGhleSBsYXN0IGNoYW5nZWQgc3RhdGUsIHdpdGggbW9yZSByZWNlbnQgc3RhdGUgY2hhbmdlcyBsaXN0ZWQgZmlyc3QuXG4gICAqL1xuICBTVEFURV9VUERBVEVEX1RJTUVTVEFNUCA9ICdzdGF0ZVVwZGF0ZWRUaW1lc3RhbXAnLFxuXG4gIC8qKlxuICAgKiBDaG9vc2UgVElNRVNUQU1QIHRvIHNvcnQgdGhlbSBieSB0aGUgdGltZSB3aGVuIHRoZSBhbGFybXMgbW9zdCByZWNlbnRseSBjaGFuZ2VkIHN0YXRlLFxuICAgKiBubyBtYXR0ZXIgdGhlIGN1cnJlbnQgYWxhcm0gc3RhdGUuXG4gICAqIFRoZSBhbGFybSB0aGF0IGNoYW5nZWQgc3RhdGUgbW9zdCByZWNlbnRseSBpcyBsaXN0ZWQgZmlyc3QuXG4gICAqL1xuICBUSU1FU1RBTVAgPSAndGltZXN0YW1wJyxcbn1cblxuLyoqXG4gKiBQcm9wZXJ0aWVzIGZvciBhbiBBbGFybSBTdGF0dXMgV2lkZ2V0XG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQWxhcm1TdGF0dXNXaWRnZXRQcm9wcyB7XG4gIC8qKlxuICAgKiBDbG91ZFdhdGNoIEFsYXJtcyB0byBzaG93IGluIHdpZGdldFxuICAgKi9cbiAgcmVhZG9ubHkgYWxhcm1zOiBJQWxhcm1bXTtcbiAgLyoqXG4gICAqIFRoZSB0aXRsZSBvZiB0aGUgd2lkZ2V0XG4gICAqXG4gICAqIEBkZWZhdWx0ICdBbGFybSBTdGF0dXMnXG4gICAqL1xuICByZWFkb25seSB0aXRsZT86IHN0cmluZztcbiAgLyoqXG4gICAqIFdpZHRoIG9mIHRoZSB3aWRnZXQsIGluIGEgZ3JpZCBvZiAyNCB1bml0cyB3aWRlXG4gICAqXG4gICAqIEBkZWZhdWx0IDZcbiAgICovXG4gIHJlYWRvbmx5IHdpZHRoPzogbnVtYmVyO1xuICAvKipcbiAgICogSGVpZ2h0IG9mIHRoZSB3aWRnZXRcbiAgICpcbiAgICogQGRlZmF1bHQgM1xuICAgKi9cbiAgcmVhZG9ubHkgaGVpZ2h0PzogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBTcGVjaWZpZXMgaG93IHRvIHNvcnQgdGhlIGFsYXJtcyBpbiB0aGUgd2lkZ2V0LlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIGFscGhhYmV0aWNhbCBvcmRlclxuICAgKi9cbiAgcmVhZG9ubHkgc29ydEJ5PzogQWxhcm1TdGF0dXNXaWRnZXRTb3J0Qnk7XG5cbiAgLyoqXG4gICAqIFVzZSB0aGlzIGZpZWxkIHRvIGZpbHRlciB0aGUgbGlzdCBvZiBhbGFybXMgZGlzcGxheWVkIGluIHRoZSB3aWRnZXQgdG8gb25seSB0aG9zZSBhbGFybXMgY3VycmVudGx5IGluIHRoZSBzcGVjaWZpZWQgc3RhdGVzLlxuICAgKiBZb3UgY2FuIHNwZWNpZnkgb25lIG9yIG1vcmUgYWxhcm0gc3RhdGVzIGluIHRoZSB2YWx1ZSBmb3IgdGhpcyBmaWVsZC5cbiAgICogVGhlIGFsYXJtIHN0YXRlcyB0aGF0IHlvdSBjYW4gc3BlY2lmeSBhcmUgQUxBUk0sIElOU1VGRklDSUVOVF9EQVRBLCBhbmQgT0suXG4gICAqXG4gICAqIElmIHlvdSBvbWl0IHRoaXMgZmllbGQgb3Igc3BlY2lmeSBhbiBlbXB0eSBhcnJheSwgYWxsIHRoZSBhbGFybXMgc3BlY2lmZWQgaW4gYWxhcm1zIGFyZSBkaXNwbGF5ZWQuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gIGFsbCB0aGUgYWxhcm1zIHNwZWNpZmllZCBpbiBhbGFybXMgYXJlIGRpc3BsYXllZC5cbiAgICovXG4gIHJlYWRvbmx5IHN0YXRlcz86IEFsYXJtU3RhdGVbXTtcbn1cblxuLyoqXG4gKiBBIGRhc2hib2FyZCB3aWRnZXQgdGhhdCBkaXNwbGF5cyBhbGFybXMgaW4gYSBncmlkIHZpZXdcbiAqL1xuZXhwb3J0IGNsYXNzIEFsYXJtU3RhdHVzV2lkZ2V0IGV4dGVuZHMgQ29uY3JldGVXaWRnZXQge1xuICBwcml2YXRlIHJlYWRvbmx5IHByb3BzOiBBbGFybVN0YXR1c1dpZGdldFByb3BzO1xuXG4gIGNvbnN0cnVjdG9yKHByb3BzOiBBbGFybVN0YXR1c1dpZGdldFByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMud2lkdGggfHwgNiwgcHJvcHMuaGVpZ2h0IHx8IDMpO1xuICAgIHRoaXMucHJvcHMgPSBwcm9wcztcbiAgfVxuXG4gIHB1YmxpYyBwb3NpdGlvbih4OiBudW1iZXIsIHk6IG51bWJlcik6IHZvaWQge1xuICAgIHRoaXMueCA9IHg7XG4gICAgdGhpcy55ID0geTtcbiAgfVxuXG4gIHB1YmxpYyB0b0pzb24oKTogYW55W10ge1xuICAgIHJldHVybiBbXG4gICAgICB7XG4gICAgICAgIHR5cGU6ICdhbGFybScsXG4gICAgICAgIHdpZHRoOiB0aGlzLndpZHRoLFxuICAgICAgICBoZWlnaHQ6IHRoaXMuaGVpZ2h0LFxuICAgICAgICB4OiB0aGlzLngsXG4gICAgICAgIHk6IHRoaXMueSxcbiAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgIHRpdGxlOiB0aGlzLnByb3BzLnRpdGxlID8gdGhpcy5wcm9wcy50aXRsZSA6ICdBbGFybSBTdGF0dXMnLFxuICAgICAgICAgIGFsYXJtczogdGhpcy5wcm9wcy5hbGFybXMubWFwKChhbGFybSkgPT4gYWxhcm0uYWxhcm1Bcm4pLFxuICAgICAgICAgIHN0YXRlczogdGhpcy5wcm9wcy5zdGF0ZXMsXG4gICAgICAgICAgc29ydEJ5OiB0aGlzLnByb3BzLnNvcnRCeSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgXTtcbiAgfVxufVxuIl19