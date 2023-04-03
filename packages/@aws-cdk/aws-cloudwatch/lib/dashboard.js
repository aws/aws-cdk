"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dashboard = exports.PeriodOverride = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const core_1 = require("@aws-cdk/core");
const cloudwatch_generated_1 = require("./cloudwatch.generated");
const layout_1 = require("./layout");
/**
 * Specify the period for graphs when the CloudWatch dashboard loads
 */
var PeriodOverride;
(function (PeriodOverride) {
    /**
     * Period of all graphs on the dashboard automatically adapt to the time range of the dashboard.
     */
    PeriodOverride["AUTO"] = "auto";
    /**
     * Period set for each graph will be used
     */
    PeriodOverride["INHERIT"] = "inherit";
})(PeriodOverride = exports.PeriodOverride || (exports.PeriodOverride = {}));
/**
 * A CloudWatch dashboard
 */
class Dashboard extends core_1.Resource {
    constructor(scope, id, props = {}) {
        super(scope, id, {
            physicalName: props.dashboardName,
        });
        this.rows = [];
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_cloudwatch_DashboardProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, Dashboard);
            }
            throw error;
        }
        {
            const { dashboardName } = props;
            if (dashboardName && !core_1.Token.isUnresolved(dashboardName) && !dashboardName.match(/^[\w-]+$/)) {
                throw new Error([
                    `The value ${dashboardName} for field dashboardName contains invalid characters.`,
                    'It can only contain alphanumerics, dash (-) and underscore (_).',
                ].join(' '));
            }
        }
        const dashboard = new cloudwatch_generated_1.CfnDashboard(this, 'Resource', {
            dashboardName: this.physicalName,
            dashboardBody: core_1.Lazy.string({
                produce: () => {
                    const column = new layout_1.Column(...this.rows);
                    column.position(0, 0);
                    return core_1.Stack.of(this).toJsonString({
                        start: props.start,
                        end: props.end,
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
        this.dashboardArn = core_1.Stack.of(this).formatArn({
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
    addWidgets(...widgets) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_cloudwatch_IWidget(widgets);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.addWidgets);
            }
            throw error;
        }
        if (widgets.length === 0) {
            return;
        }
        const warnings = allWidgetsDeep(widgets).flatMap(w => w.warnings ?? []);
        for (const w of warnings) {
            core_1.Annotations.of(this).addWarning(w);
        }
        const w = widgets.length > 1 ? new layout_1.Row(...widgets) : widgets[0];
        this.rows.push(w);
    }
}
exports.Dashboard = Dashboard;
_a = JSII_RTTI_SYMBOL_1;
Dashboard[_a] = { fqn: "@aws-cdk/aws-cloudwatch.Dashboard", version: "0.0.0" };
function allWidgetsDeep(ws) {
    const ret = new Array();
    ws.forEach(recurse);
    return ret;
    function recurse(w) {
        ret.push(w);
        if (hasSubWidgets(w)) {
            w.widgets.forEach(recurse);
        }
    }
}
function hasSubWidgets(w) {
    return 'widgets' in w;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGFzaGJvYXJkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZGFzaGJvYXJkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLHdDQUEwRTtBQUUxRSxpRUFBc0Q7QUFDdEQscUNBQXVDO0FBR3ZDOztHQUVHO0FBQ0gsSUFBWSxjQVNYO0FBVEQsV0FBWSxjQUFjO0lBQ3hCOztPQUVHO0lBQ0gsK0JBQWEsQ0FBQTtJQUNiOztPQUVHO0lBQ0gscUNBQW1CLENBQUE7QUFDckIsQ0FBQyxFQVRXLGNBQWMsR0FBZCxzQkFBYyxLQUFkLHNCQUFjLFFBU3pCO0FBdUREOztHQUVHO0FBQ0gsTUFBYSxTQUFVLFNBQVEsZUFBUTtJQWtCckMsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxRQUF3QixFQUFFO1FBQ2xFLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFO1lBQ2YsWUFBWSxFQUFFLEtBQUssQ0FBQyxhQUFhO1NBQ2xDLENBQUMsQ0FBQztRQUxZLFNBQUksR0FBYyxFQUFFLENBQUM7Ozs7OzsrQ0FoQjNCLFNBQVM7Ozs7UUF1QmxCO1lBQ0UsTUFBTSxFQUFFLGFBQWEsRUFBRSxHQUFHLEtBQUssQ0FBQztZQUNoQyxJQUFJLGFBQWEsSUFBSSxDQUFDLFlBQUssQ0FBQyxZQUFZLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxFQUFFO2dCQUMzRixNQUFNLElBQUksS0FBSyxDQUFDO29CQUNkLGFBQWEsYUFBYSx1REFBdUQ7b0JBQ2pGLGlFQUFpRTtpQkFDbEUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQzthQUNkO1NBQ0Y7UUFFRCxNQUFNLFNBQVMsR0FBRyxJQUFJLG1DQUFZLENBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRTtZQUNuRCxhQUFhLEVBQUUsSUFBSSxDQUFDLFlBQVk7WUFDaEMsYUFBYSxFQUFFLFdBQUksQ0FBQyxNQUFNLENBQUM7Z0JBQ3pCLE9BQU8sRUFBRSxHQUFHLEVBQUU7b0JBQ1osTUFBTSxNQUFNLEdBQUcsSUFBSSxlQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ3hDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO29CQUN0QixPQUFPLFlBQUssQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsWUFBWSxDQUFDO3dCQUNqQyxLQUFLLEVBQUUsS0FBSyxDQUFDLEtBQUs7d0JBQ2xCLEdBQUcsRUFBRSxLQUFLLENBQUMsR0FBRzt3QkFDZCxjQUFjLEVBQUUsS0FBSyxDQUFDLGNBQWM7d0JBQ3BDLE9BQU8sRUFBRSxNQUFNLENBQUMsTUFBTSxFQUFFO3FCQUN6QixDQUFDLENBQUM7Z0JBQ0wsQ0FBQzthQUNGLENBQUM7U0FDSCxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUM7UUFFbEUsQ0FBQyxLQUFLLENBQUMsT0FBTyxJQUFJLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRTtZQUNsQyxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUM7UUFDMUIsQ0FBQyxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsWUFBWSxHQUFHLFlBQUssQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsU0FBUyxDQUFDO1lBQzNDLE9BQU8sRUFBRSxZQUFZO1lBQ3JCLFFBQVEsRUFBRSxXQUFXO1lBQ3JCLE1BQU0sRUFBRSxFQUFFO1lBQ1YsWUFBWSxFQUFFLElBQUksQ0FBQyxZQUFZO1NBQ2hDLENBQUMsQ0FBQztLQUNKO0lBRUQ7Ozs7Ozs7O09BUUc7SUFDSSxVQUFVLENBQUMsR0FBRyxPQUFrQjs7Ozs7Ozs7OztRQUNyQyxJQUFJLE9BQU8sQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO1lBQ3hCLE9BQU87U0FDUjtRQUVELE1BQU0sUUFBUSxHQUFHLGNBQWMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsUUFBUSxJQUFJLEVBQUUsQ0FBQyxDQUFDO1FBQ3hFLEtBQUssTUFBTSxDQUFDLElBQUksUUFBUSxFQUFFO1lBQ3hCLGtCQUFXLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUNwQztRQUVELE1BQU0sQ0FBQyxHQUFHLE9BQU8sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLFlBQUcsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDaEUsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDbkI7O0FBcEZILDhCQXFGQzs7O0FBRUQsU0FBUyxjQUFjLENBQUMsRUFBYTtJQUNuQyxNQUFNLEdBQUcsR0FBRyxJQUFJLEtBQUssRUFBVyxDQUFDO0lBQ2pDLEVBQUUsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDcEIsT0FBTyxHQUFHLENBQUM7SUFFWCxTQUFTLE9BQU8sQ0FBQyxDQUFVO1FBQ3pCLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDWixJQUFJLGFBQWEsQ0FBQyxDQUFDLENBQUMsRUFBRTtZQUNwQixDQUFDLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztTQUM1QjtJQUNILENBQUM7QUFDSCxDQUFDO0FBRUQsU0FBUyxhQUFhLENBQUMsQ0FBVTtJQUMvQixPQUFPLFNBQVMsSUFBSSxDQUFDLENBQUM7QUFDeEIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IExhenksIFJlc291cmNlLCBTdGFjaywgVG9rZW4sIEFubm90YXRpb25zIH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCB7IENmbkRhc2hib2FyZCB9IGZyb20gJy4vY2xvdWR3YXRjaC5nZW5lcmF0ZWQnO1xuaW1wb3J0IHsgQ29sdW1uLCBSb3cgfSBmcm9tICcuL2xheW91dCc7XG5pbXBvcnQgeyBJV2lkZ2V0IH0gZnJvbSAnLi93aWRnZXQnO1xuXG4vKipcbiAqIFNwZWNpZnkgdGhlIHBlcmlvZCBmb3IgZ3JhcGhzIHdoZW4gdGhlIENsb3VkV2F0Y2ggZGFzaGJvYXJkIGxvYWRzXG4gKi9cbmV4cG9ydCBlbnVtIFBlcmlvZE92ZXJyaWRlIHtcbiAgLyoqXG4gICAqIFBlcmlvZCBvZiBhbGwgZ3JhcGhzIG9uIHRoZSBkYXNoYm9hcmQgYXV0b21hdGljYWxseSBhZGFwdCB0byB0aGUgdGltZSByYW5nZSBvZiB0aGUgZGFzaGJvYXJkLlxuICAgKi9cbiAgQVVUTyA9ICdhdXRvJyxcbiAgLyoqXG4gICAqIFBlcmlvZCBzZXQgZm9yIGVhY2ggZ3JhcGggd2lsbCBiZSB1c2VkXG4gICAqL1xuICBJTkhFUklUID0gJ2luaGVyaXQnLFxufVxuXG4vKipcbiAqIFByb3BlcnRpZXMgZm9yIGRlZmluaW5nIGEgQ2xvdWRXYXRjaCBEYXNoYm9hcmRcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBEYXNoYm9hcmRQcm9wcyB7XG4gIC8qKlxuICAgKiBOYW1lIG9mIHRoZSBkYXNoYm9hcmQuXG4gICAqXG4gICAqIElmIHNldCwgbXVzdCBvbmx5IGNvbnRhaW4gYWxwaGFudW1lcmljcywgZGFzaCAoLSkgYW5kIHVuZGVyc2NvcmUgKF8pXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gYXV0b21hdGljYWxseSBnZW5lcmF0ZWQgbmFtZVxuICAgKi9cbiAgcmVhZG9ubHkgZGFzaGJvYXJkTmFtZT86IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIHN0YXJ0IG9mIHRoZSB0aW1lIHJhbmdlIHRvIHVzZSBmb3IgZWFjaCB3aWRnZXQgb24gdGhlIGRhc2hib2FyZC5cbiAgICogWW91IGNhbiBzcGVjaWZ5IHN0YXJ0IHdpdGhvdXQgc3BlY2lmeWluZyBlbmQgdG8gc3BlY2lmeSBhIHJlbGF0aXZlIHRpbWUgcmFuZ2UgdGhhdCBlbmRzIHdpdGggdGhlIGN1cnJlbnQgdGltZS5cbiAgICogSW4gdGhpcyBjYXNlLCB0aGUgdmFsdWUgb2Ygc3RhcnQgbXVzdCBiZWdpbiB3aXRoIC1QLCBhbmQgeW91IGNhbiB1c2UgTSwgSCwgRCwgVyBhbmQgTSBhcyBhYmJyZXZpYXRpb25zIGZvclxuICAgKiBtaW51dGVzLCBob3VycywgZGF5cywgd2Vla3MgYW5kIG1vbnRocy4gRm9yIGV4YW1wbGUsIC1QVDhIIHNob3dzIHRoZSBsYXN0IDggaG91cnMgYW5kIC1QM00gc2hvd3MgdGhlIGxhc3QgdGhyZWUgbW9udGhzLlxuICAgKiBZb3UgY2FuIGFsc28gdXNlIHN0YXJ0IGFsb25nIHdpdGggYW4gZW5kIGZpZWxkLCB0byBzcGVjaWZ5IGFuIGFic29sdXRlIHRpbWUgcmFuZ2UuXG4gICAqIFdoZW4gc3BlY2lmeWluZyBhbiBhYnNvbHV0ZSB0aW1lIHJhbmdlLCB1c2UgdGhlIElTTyA4NjAxIGZvcm1hdC4gRm9yIGV4YW1wbGUsIDIwMTgtMTItMTdUMDY6MDA6MDAuMDAwWi5cbiAgICpcbiAgICogQGRlZmF1bHQgV2hlbiB0aGUgZGFzaGJvYXJkIGxvYWRzLCB0aGUgc3RhcnQgdGltZSB3aWxsIGJlIHRoZSBkZWZhdWx0IHRpbWUgcmFuZ2UuXG4gICAqL1xuICByZWFkb25seSBzdGFydD86IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIGVuZCBvZiB0aGUgdGltZSByYW5nZSB0byB1c2UgZm9yIGVhY2ggd2lkZ2V0IG9uIHRoZSBkYXNoYm9hcmQgd2hlbiB0aGUgZGFzaGJvYXJkIGxvYWRzLlxuICAgKiBJZiB5b3Ugc3BlY2lmeSBhIHZhbHVlIGZvciBlbmQsIHlvdSBtdXN0IGFsc28gc3BlY2lmeSBhIHZhbHVlIGZvciBzdGFydC5cbiAgICogU3BlY2lmeSBhbiBhYnNvbHV0ZSB0aW1lIGluIHRoZSBJU08gODYwMSBmb3JtYXQuIEZvciBleGFtcGxlLCAyMDE4LTEyLTE3VDA2OjAwOjAwLjAwMFouXG4gICAqXG4gICAqIEBkZWZhdWx0IFdoZW4gdGhlIGRhc2hib2FyZCBsb2FkcywgdGhlIGVuZCBkYXRlIHdpbGwgYmUgdGhlIGN1cnJlbnQgdGltZS5cbiAgICovXG4gIHJlYWRvbmx5IGVuZD86IHN0cmluZztcblxuICAvKipcbiAgICogVXNlIHRoaXMgZmllbGQgdG8gc3BlY2lmeSB0aGUgcGVyaW9kIGZvciB0aGUgZ3JhcGhzIHdoZW4gdGhlIGRhc2hib2FyZCBsb2Fkcy5cbiAgICogU3BlY2lmeWluZyBgQXV0b2AgY2F1c2VzIHRoZSBwZXJpb2Qgb2YgYWxsIGdyYXBocyBvbiB0aGUgZGFzaGJvYXJkIHRvIGF1dG9tYXRpY2FsbHkgYWRhcHQgdG8gdGhlIHRpbWUgcmFuZ2Ugb2YgdGhlIGRhc2hib2FyZC5cbiAgICogU3BlY2lmeWluZyBgSW5oZXJpdGAgZW5zdXJlcyB0aGF0IHRoZSBwZXJpb2Qgc2V0IGZvciBlYWNoIGdyYXBoIGlzIGFsd2F5cyBvYmV5ZWQuXG4gICAqXG4gICAqIEBkZWZhdWx0IEF1dG9cbiAgICovXG4gIHJlYWRvbmx5IHBlcmlvZE92ZXJyaWRlPzogUGVyaW9kT3ZlcnJpZGU7XG5cbiAgLyoqXG4gICAqIEluaXRpYWwgc2V0IG9mIHdpZGdldHMgb24gdGhlIGRhc2hib2FyZFxuICAgKlxuICAgKiBPbmUgYXJyYXkgcmVwcmVzZW50cyBhIHJvdyBvZiB3aWRnZXRzLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIE5vIHdpZGdldHNcbiAgICovXG4gIHJlYWRvbmx5IHdpZGdldHM/OiBJV2lkZ2V0W11bXVxufVxuXG4vKipcbiAqIEEgQ2xvdWRXYXRjaCBkYXNoYm9hcmRcbiAqL1xuZXhwb3J0IGNsYXNzIERhc2hib2FyZCBleHRlbmRzIFJlc291cmNlIHtcblxuICAvKipcbiAgICogVGhlIG5hbWUgb2YgdGhpcyBkYXNoYm9hcmRcbiAgICpcbiAgICogQGF0dHJpYnV0ZVxuICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgZGFzaGJvYXJkTmFtZTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBBUk4gb2YgdGhpcyBkYXNoYm9hcmRcbiAgICpcbiAgICogQGF0dHJpYnV0ZVxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IGRhc2hib2FyZEFybjogc3RyaW5nO1xuXG4gIHByaXZhdGUgcmVhZG9ubHkgcm93czogSVdpZGdldFtdID0gW107XG5cbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IERhc2hib2FyZFByb3BzID0ge30pIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHtcbiAgICAgIHBoeXNpY2FsTmFtZTogcHJvcHMuZGFzaGJvYXJkTmFtZSxcbiAgICB9KTtcblxuICAgIHtcbiAgICAgIGNvbnN0IHsgZGFzaGJvYXJkTmFtZSB9ID0gcHJvcHM7XG4gICAgICBpZiAoZGFzaGJvYXJkTmFtZSAmJiAhVG9rZW4uaXNVbnJlc29sdmVkKGRhc2hib2FyZE5hbWUpICYmICFkYXNoYm9hcmROYW1lLm1hdGNoKC9eW1xcdy1dKyQvKSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoW1xuICAgICAgICAgIGBUaGUgdmFsdWUgJHtkYXNoYm9hcmROYW1lfSBmb3IgZmllbGQgZGFzaGJvYXJkTmFtZSBjb250YWlucyBpbnZhbGlkIGNoYXJhY3RlcnMuYCxcbiAgICAgICAgICAnSXQgY2FuIG9ubHkgY29udGFpbiBhbHBoYW51bWVyaWNzLCBkYXNoICgtKSBhbmQgdW5kZXJzY29yZSAoXykuJyxcbiAgICAgICAgXS5qb2luKCcgJykpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IGRhc2hib2FyZCA9IG5ldyBDZm5EYXNoYm9hcmQodGhpcywgJ1Jlc291cmNlJywge1xuICAgICAgZGFzaGJvYXJkTmFtZTogdGhpcy5waHlzaWNhbE5hbWUsXG4gICAgICBkYXNoYm9hcmRCb2R5OiBMYXp5LnN0cmluZyh7XG4gICAgICAgIHByb2R1Y2U6ICgpID0+IHtcbiAgICAgICAgICBjb25zdCBjb2x1bW4gPSBuZXcgQ29sdW1uKC4uLnRoaXMucm93cyk7XG4gICAgICAgICAgY29sdW1uLnBvc2l0aW9uKDAsIDApO1xuICAgICAgICAgIHJldHVybiBTdGFjay5vZih0aGlzKS50b0pzb25TdHJpbmcoe1xuICAgICAgICAgICAgc3RhcnQ6IHByb3BzLnN0YXJ0LFxuICAgICAgICAgICAgZW5kOiBwcm9wcy5lbmQsXG4gICAgICAgICAgICBwZXJpb2RPdmVycmlkZTogcHJvcHMucGVyaW9kT3ZlcnJpZGUsXG4gICAgICAgICAgICB3aWRnZXRzOiBjb2x1bW4udG9Kc29uKCksXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0sXG4gICAgICB9KSxcbiAgICB9KTtcblxuICAgIHRoaXMuZGFzaGJvYXJkTmFtZSA9IHRoaXMuZ2V0UmVzb3VyY2VOYW1lQXR0cmlidXRlKGRhc2hib2FyZC5yZWYpO1xuXG4gICAgKHByb3BzLndpZGdldHMgfHwgW10pLmZvckVhY2gocm93ID0+IHtcbiAgICAgIHRoaXMuYWRkV2lkZ2V0cyguLi5yb3cpO1xuICAgIH0pO1xuXG4gICAgdGhpcy5kYXNoYm9hcmRBcm4gPSBTdGFjay5vZih0aGlzKS5mb3JtYXRBcm4oe1xuICAgICAgc2VydmljZTogJ2Nsb3Vkd2F0Y2gnLFxuICAgICAgcmVzb3VyY2U6ICdkYXNoYm9hcmQnLFxuICAgICAgcmVnaW9uOiAnJyxcbiAgICAgIHJlc291cmNlTmFtZTogdGhpcy5waHlzaWNhbE5hbWUsXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQWRkIGEgd2lkZ2V0IHRvIHRoZSBkYXNoYm9hcmQuXG4gICAqXG4gICAqIFdpZGdldHMgZ2l2ZW4gaW4gbXVsdGlwbGUgY2FsbHMgdG8gYWRkKCkgd2lsbCBiZSBsYWlkIG91dCBzdGFja2VkIG9uXG4gICAqIHRvcCBvZiBlYWNoIG90aGVyLlxuICAgKlxuICAgKiBNdWx0aXBsZSB3aWRnZXRzIGFkZGVkIGluIHRoZSBzYW1lIGNhbGwgdG8gYWRkKCkgd2lsbCBiZSBsYWlkIG91dCBuZXh0XG4gICAqIHRvIGVhY2ggb3RoZXIuXG4gICAqL1xuICBwdWJsaWMgYWRkV2lkZ2V0cyguLi53aWRnZXRzOiBJV2lkZ2V0W10pIHtcbiAgICBpZiAod2lkZ2V0cy5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCB3YXJuaW5ncyA9IGFsbFdpZGdldHNEZWVwKHdpZGdldHMpLmZsYXRNYXAodyA9PiB3Lndhcm5pbmdzID8/IFtdKTtcbiAgICBmb3IgKGNvbnN0IHcgb2Ygd2FybmluZ3MpIHtcbiAgICAgIEFubm90YXRpb25zLm9mKHRoaXMpLmFkZFdhcm5pbmcodyk7XG4gICAgfVxuXG4gICAgY29uc3QgdyA9IHdpZGdldHMubGVuZ3RoID4gMSA/IG5ldyBSb3coLi4ud2lkZ2V0cykgOiB3aWRnZXRzWzBdO1xuICAgIHRoaXMucm93cy5wdXNoKHcpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGFsbFdpZGdldHNEZWVwKHdzOiBJV2lkZ2V0W10pIHtcbiAgY29uc3QgcmV0ID0gbmV3IEFycmF5PElXaWRnZXQ+KCk7XG4gIHdzLmZvckVhY2gocmVjdXJzZSk7XG4gIHJldHVybiByZXQ7XG5cbiAgZnVuY3Rpb24gcmVjdXJzZSh3OiBJV2lkZ2V0KSB7XG4gICAgcmV0LnB1c2godyk7XG4gICAgaWYgKGhhc1N1YldpZGdldHModykpIHtcbiAgICAgIHcud2lkZ2V0cy5mb3JFYWNoKHJlY3Vyc2UpO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBoYXNTdWJXaWRnZXRzKHc6IElXaWRnZXQpOiB3IGlzIElXaWRnZXQgJiB7IHdpZGdldHM6IElXaWRnZXRbXSB9IHtcbiAgcmV0dXJuICd3aWRnZXRzJyBpbiB3O1xufVxuIl19