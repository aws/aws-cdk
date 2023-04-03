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
        if (props.start !== undefined && props.defaultInterval !== undefined) {
            throw ('both properties defaultInterval and start cannot be set at once');
        }
        const dashboard = new cloudwatch_generated_1.CfnDashboard(this, 'Resource', {
            dashboardName: this.physicalName,
            dashboardBody: core_1.Lazy.string({
                produce: () => {
                    const column = new layout_1.Column(...this.rows);
                    column.position(0, 0);
                    return core_1.Stack.of(this).toJsonString({
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
_a = JSII_RTTI_SYMBOL_1;
Dashboard[_a] = { fqn: "@aws-cdk/aws-cloudwatch.Dashboard", version: "0.0.0" };
exports.Dashboard = Dashboard;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGFzaGJvYXJkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZGFzaGJvYXJkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLHdDQUFvRjtBQUVwRixpRUFBc0Q7QUFDdEQscUNBQXVDO0FBR3ZDOztHQUVHO0FBQ0gsSUFBWSxjQVNYO0FBVEQsV0FBWSxjQUFjO0lBQ3hCOztPQUVHO0lBQ0gsK0JBQWEsQ0FBQTtJQUNiOztPQUVHO0lBQ0gscUNBQW1CLENBQUE7QUFDckIsQ0FBQyxFQVRXLGNBQWMsR0FBZCxzQkFBYyxLQUFkLHNCQUFjLFFBU3pCO0FBK0REOztHQUVHO0FBQ0gsTUFBYSxTQUFVLFNBQVEsZUFBUTtJQWtCckMsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxRQUF3QixFQUFFO1FBQ2xFLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFO1lBQ2YsWUFBWSxFQUFFLEtBQUssQ0FBQyxhQUFhO1NBQ2xDLENBQUMsQ0FBQztRQUxZLFNBQUksR0FBYyxFQUFFLENBQUM7Ozs7OzsrQ0FoQjNCLFNBQVM7Ozs7UUF1QmxCO1lBQ0UsTUFBTSxFQUFFLGFBQWEsRUFBRSxHQUFHLEtBQUssQ0FBQztZQUNoQyxJQUFJLGFBQWEsSUFBSSxDQUFDLFlBQUssQ0FBQyxZQUFZLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxFQUFFO2dCQUMzRixNQUFNLElBQUksS0FBSyxDQUFDO29CQUNkLGFBQWEsYUFBYSx1REFBdUQ7b0JBQ2pGLGlFQUFpRTtpQkFDbEUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQzthQUNkO1NBQ0Y7UUFFRCxJQUFJLEtBQUssQ0FBQyxLQUFLLEtBQUssU0FBUyxJQUFJLEtBQUssQ0FBQyxlQUFlLEtBQUssU0FBUyxFQUFFO1lBQ3BFLE1BQU0sQ0FBQyxpRUFBaUUsQ0FBQyxDQUFDO1NBQzNFO1FBRUQsTUFBTSxTQUFTLEdBQUcsSUFBSSxt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LENBQUMsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1NBQzVCO0lBQ0gsQ0FBQztBQUNILENBQUM7QUFFRCxTQUFTLGFBQWEsQ0FBQyxDQUFVO0lBQy9CLE9BQU8sU0FBUyxJQUFJLENBQUMsQ0FBQztBQUN4QixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTGF6eSwgUmVzb3VyY2UsIFN0YWNrLCBUb2tlbiwgQW5ub3RhdGlvbnMsIER1cmF0aW9uIH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCB7IENmbkRhc2hib2FyZCB9IGZyb20gJy4vY2xvdWR3YXRjaC5nZW5lcmF0ZWQnO1xuaW1wb3J0IHsgQ29sdW1uLCBSb3cgfSBmcm9tICcuL2xheW91dCc7XG5pbXBvcnQgeyBJV2lkZ2V0IH0gZnJvbSAnLi93aWRnZXQnO1xuXG4vKipcbiAqIFNwZWNpZnkgdGhlIHBlcmlvZCBmb3IgZ3JhcGhzIHdoZW4gdGhlIENsb3VkV2F0Y2ggZGFzaGJvYXJkIGxvYWRzXG4gKi9cbmV4cG9ydCBlbnVtIFBlcmlvZE92ZXJyaWRlIHtcbiAgLyoqXG4gICAqIFBlcmlvZCBvZiBhbGwgZ3JhcGhzIG9uIHRoZSBkYXNoYm9hcmQgYXV0b21hdGljYWxseSBhZGFwdCB0byB0aGUgdGltZSByYW5nZSBvZiB0aGUgZGFzaGJvYXJkLlxuICAgKi9cbiAgQVVUTyA9ICdhdXRvJyxcbiAgLyoqXG4gICAqIFBlcmlvZCBzZXQgZm9yIGVhY2ggZ3JhcGggd2lsbCBiZSB1c2VkXG4gICAqL1xuICBJTkhFUklUID0gJ2luaGVyaXQnLFxufVxuXG4vKipcbiAqIFByb3BlcnRpZXMgZm9yIGRlZmluaW5nIGEgQ2xvdWRXYXRjaCBEYXNoYm9hcmRcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBEYXNoYm9hcmRQcm9wcyB7XG4gIC8qKlxuICAgKiBOYW1lIG9mIHRoZSBkYXNoYm9hcmQuXG4gICAqXG4gICAqIElmIHNldCwgbXVzdCBvbmx5IGNvbnRhaW4gYWxwaGFudW1lcmljcywgZGFzaCAoLSkgYW5kIHVuZGVyc2NvcmUgKF8pXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gYXV0b21hdGljYWxseSBnZW5lcmF0ZWQgbmFtZVxuICAgKi9cbiAgcmVhZG9ubHkgZGFzaGJvYXJkTmFtZT86IHN0cmluZztcblxuICAvKipcbiAgICogSW50ZXJ2YWwgZHVyYXRpb24gZm9yIG1ldHJpY3MuXG4gICAqIFlvdSBjYW4gc3BlY2lmeSBkZWZhdWx0SW50ZXJ2YWwgd2l0aCB0aGUgcmVsYXRpdmUgdGltZShlZy4gY2RrLkR1cmF0aW9uLmRheXMoNykpLlxuICAgKlxuICAgKiBAZGVmYXVsdCBXaGVuIHRoZSBkYXNoYm9hcmQgbG9hZHMsIHRoZSBkZWZhdWx0SW50ZXJ2YWwgdGltZSB3aWxsIGJlIHRoZSBkZWZhdWx0IHRpbWUgcmFuZ2UuXG4gICAqL1xuICByZWFkb25seSBkZWZhdWx0SW50ZXJ2YWw/OiBEdXJhdGlvblxuXG4gIC8qKlxuICAgKiBUaGUgc3RhcnQgb2YgdGhlIHRpbWUgcmFuZ2UgdG8gdXNlIGZvciBlYWNoIHdpZGdldCBvbiB0aGUgZGFzaGJvYXJkLlxuICAgKiBZb3UgY2FuIHNwZWNpZnkgc3RhcnQgd2l0aG91dCBzcGVjaWZ5aW5nIGVuZCB0byBzcGVjaWZ5IGEgcmVsYXRpdmUgdGltZSByYW5nZSB0aGF0IGVuZHMgd2l0aCB0aGUgY3VycmVudCB0aW1lLlxuICAgKiBJbiB0aGlzIGNhc2UsIHRoZSB2YWx1ZSBvZiBzdGFydCBtdXN0IGJlZ2luIHdpdGggLVAsIGFuZCB5b3UgY2FuIHVzZSBNLCBILCBELCBXIGFuZCBNIGFzIGFiYnJldmlhdGlvbnMgZm9yXG4gICAqIG1pbnV0ZXMsIGhvdXJzLCBkYXlzLCB3ZWVrcyBhbmQgbW9udGhzLiBGb3IgZXhhbXBsZSwgLVBUOEggc2hvd3MgdGhlIGxhc3QgOCBob3VycyBhbmQgLVAzTSBzaG93cyB0aGUgbGFzdCB0aHJlZSBtb250aHMuXG4gICAqIFlvdSBjYW4gYWxzbyB1c2Ugc3RhcnQgYWxvbmcgd2l0aCBhbiBlbmQgZmllbGQsIHRvIHNwZWNpZnkgYW4gYWJzb2x1dGUgdGltZSByYW5nZS5cbiAgICogV2hlbiBzcGVjaWZ5aW5nIGFuIGFic29sdXRlIHRpbWUgcmFuZ2UsIHVzZSB0aGUgSVNPIDg2MDEgZm9ybWF0LiBGb3IgZXhhbXBsZSwgMjAxOC0xMi0xN1QwNjowMDowMC4wMDBaLlxuICAgKlxuICAgKiBAZGVmYXVsdCBXaGVuIHRoZSBkYXNoYm9hcmQgbG9hZHMsIHRoZSBzdGFydCB0aW1lIHdpbGwgYmUgdGhlIGRlZmF1bHQgdGltZSByYW5nZS5cbiAgICovXG4gIHJlYWRvbmx5IHN0YXJ0Pzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgZW5kIG9mIHRoZSB0aW1lIHJhbmdlIHRvIHVzZSBmb3IgZWFjaCB3aWRnZXQgb24gdGhlIGRhc2hib2FyZCB3aGVuIHRoZSBkYXNoYm9hcmQgbG9hZHMuXG4gICAqIElmIHlvdSBzcGVjaWZ5IGEgdmFsdWUgZm9yIGVuZCwgeW91IG11c3QgYWxzbyBzcGVjaWZ5IGEgdmFsdWUgZm9yIHN0YXJ0LlxuICAgKiBTcGVjaWZ5IGFuIGFic29sdXRlIHRpbWUgaW4gdGhlIElTTyA4NjAxIGZvcm1hdC4gRm9yIGV4YW1wbGUsIDIwMTgtMTItMTdUMDY6MDA6MDAuMDAwWi5cbiAgICpcbiAgICogQGRlZmF1bHQgV2hlbiB0aGUgZGFzaGJvYXJkIGxvYWRzLCB0aGUgZW5kIGRhdGUgd2lsbCBiZSB0aGUgY3VycmVudCB0aW1lLlxuICAgKi9cbiAgcmVhZG9ubHkgZW5kPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBVc2UgdGhpcyBmaWVsZCB0byBzcGVjaWZ5IHRoZSBwZXJpb2QgZm9yIHRoZSBncmFwaHMgd2hlbiB0aGUgZGFzaGJvYXJkIGxvYWRzLlxuICAgKiBTcGVjaWZ5aW5nIGBBdXRvYCBjYXVzZXMgdGhlIHBlcmlvZCBvZiBhbGwgZ3JhcGhzIG9uIHRoZSBkYXNoYm9hcmQgdG8gYXV0b21hdGljYWxseSBhZGFwdCB0byB0aGUgdGltZSByYW5nZSBvZiB0aGUgZGFzaGJvYXJkLlxuICAgKiBTcGVjaWZ5aW5nIGBJbmhlcml0YCBlbnN1cmVzIHRoYXQgdGhlIHBlcmlvZCBzZXQgZm9yIGVhY2ggZ3JhcGggaXMgYWx3YXlzIG9iZXllZC5cbiAgICpcbiAgICogQGRlZmF1bHQgQXV0b1xuICAgKi9cbiAgcmVhZG9ubHkgcGVyaW9kT3ZlcnJpZGU/OiBQZXJpb2RPdmVycmlkZTtcblxuICAvKipcbiAgICogSW5pdGlhbCBzZXQgb2Ygd2lkZ2V0cyBvbiB0aGUgZGFzaGJvYXJkXG4gICAqXG4gICAqIE9uZSBhcnJheSByZXByZXNlbnRzIGEgcm93IG9mIHdpZGdldHMuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gTm8gd2lkZ2V0c1xuICAgKi9cbiAgcmVhZG9ubHkgd2lkZ2V0cz86IElXaWRnZXRbXVtdXG59XG5cbi8qKlxuICogQSBDbG91ZFdhdGNoIGRhc2hib2FyZFxuICovXG5leHBvcnQgY2xhc3MgRGFzaGJvYXJkIGV4dGVuZHMgUmVzb3VyY2Uge1xuXG4gIC8qKlxuICAgKiBUaGUgbmFtZSBvZiB0aGlzIGRhc2hib2FyZFxuICAgKlxuICAgKiBAYXR0cmlidXRlXG4gICovXG4gIHB1YmxpYyByZWFkb25seSBkYXNoYm9hcmROYW1lOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIEFSTiBvZiB0aGlzIGRhc2hib2FyZFxuICAgKlxuICAgKiBAYXR0cmlidXRlXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgZGFzaGJvYXJkQXJuOiBzdHJpbmc7XG5cbiAgcHJpdmF0ZSByZWFkb25seSByb3dzOiBJV2lkZ2V0W10gPSBbXTtcblxuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogRGFzaGJvYXJkUHJvcHMgPSB7fSkge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwge1xuICAgICAgcGh5c2ljYWxOYW1lOiBwcm9wcy5kYXNoYm9hcmROYW1lLFxuICAgIH0pO1xuXG4gICAge1xuICAgICAgY29uc3QgeyBkYXNoYm9hcmROYW1lIH0gPSBwcm9wcztcbiAgICAgIGlmIChkYXNoYm9hcmROYW1lICYmICFUb2tlbi5pc1VucmVzb2x2ZWQoZGFzaGJvYXJkTmFtZSkgJiYgIWRhc2hib2FyZE5hbWUubWF0Y2goL15bXFx3LV0rJC8pKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihbXG4gICAgICAgICAgYFRoZSB2YWx1ZSAke2Rhc2hib2FyZE5hbWV9IGZvciBmaWVsZCBkYXNoYm9hcmROYW1lIGNvbnRhaW5zIGludmFsaWQgY2hhcmFjdGVycy5gLFxuICAgICAgICAgICdJdCBjYW4gb25seSBjb250YWluIGFscGhhbnVtZXJpY3MsIGRhc2ggKC0pIGFuZCB1bmRlcnNjb3JlIChfKS4nLFxuICAgICAgICBdLmpvaW4oJyAnKSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHByb3BzLnN0YXJ0ICE9PSB1bmRlZmluZWQgJiYgcHJvcHMuZGVmYXVsdEludGVydmFsICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHRocm93ICgnYm90aCBwcm9wZXJ0aWVzIGRlZmF1bHRJbnRlcnZhbCBhbmQgc3RhcnQgY2Fubm90IGJlIHNldCBhdCBvbmNlJyk7XG4gICAgfVxuXG4gICAgY29uc3QgZGFzaGJvYXJkID0gbmV3IENmbkRhc2hib2FyZCh0aGlzLCAnUmVzb3VyY2UnLCB7XG4gICAgICBkYXNoYm9hcmROYW1lOiB0aGlzLnBoeXNpY2FsTmFtZSxcbiAgICAgIGRhc2hib2FyZEJvZHk6IExhenkuc3RyaW5nKHtcbiAgICAgICAgcHJvZHVjZTogKCkgPT4ge1xuICAgICAgICAgIGNvbnN0IGNvbHVtbiA9IG5ldyBDb2x1bW4oLi4udGhpcy5yb3dzKTtcbiAgICAgICAgICBjb2x1bW4ucG9zaXRpb24oMCwgMCk7XG4gICAgICAgICAgcmV0dXJuIFN0YWNrLm9mKHRoaXMpLnRvSnNvblN0cmluZyh7XG4gICAgICAgICAgICBzdGFydDogcHJvcHMuZGVmYXVsdEludGVydmFsICE9PSB1bmRlZmluZWQgPyBgLSR7cHJvcHMuZGVmYXVsdEludGVydmFsPy50b0lzb1N0cmluZygpfWAgOiBwcm9wcy5zdGFydCxcbiAgICAgICAgICAgIGVuZDogcHJvcHMuZGVmYXVsdEludGVydmFsICE9PSB1bmRlZmluZWQgPyB1bmRlZmluZWQgOiBwcm9wcy5lbmQsXG4gICAgICAgICAgICBwZXJpb2RPdmVycmlkZTogcHJvcHMucGVyaW9kT3ZlcnJpZGUsXG4gICAgICAgICAgICB3aWRnZXRzOiBjb2x1bW4udG9Kc29uKCksXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0sXG4gICAgICB9KSxcbiAgICB9KTtcblxuICAgIHRoaXMuZGFzaGJvYXJkTmFtZSA9IHRoaXMuZ2V0UmVzb3VyY2VOYW1lQXR0cmlidXRlKGRhc2hib2FyZC5yZWYpO1xuXG4gICAgKHByb3BzLndpZGdldHMgfHwgW10pLmZvckVhY2gocm93ID0+IHtcbiAgICAgIHRoaXMuYWRkV2lkZ2V0cyguLi5yb3cpO1xuICAgIH0pO1xuXG4gICAgdGhpcy5kYXNoYm9hcmRBcm4gPSBTdGFjay5vZih0aGlzKS5mb3JtYXRBcm4oe1xuICAgICAgc2VydmljZTogJ2Nsb3Vkd2F0Y2gnLFxuICAgICAgcmVzb3VyY2U6ICdkYXNoYm9hcmQnLFxuICAgICAgcmVnaW9uOiAnJyxcbiAgICAgIHJlc291cmNlTmFtZTogdGhpcy5waHlzaWNhbE5hbWUsXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQWRkIGEgd2lkZ2V0IHRvIHRoZSBkYXNoYm9hcmQuXG4gICAqXG4gICAqIFdpZGdldHMgZ2l2ZW4gaW4gbXVsdGlwbGUgY2FsbHMgdG8gYWRkKCkgd2lsbCBiZSBsYWlkIG91dCBzdGFja2VkIG9uXG4gICAqIHRvcCBvZiBlYWNoIG90aGVyLlxuICAgKlxuICAgKiBNdWx0aXBsZSB3aWRnZXRzIGFkZGVkIGluIHRoZSBzYW1lIGNhbGwgdG8gYWRkKCkgd2lsbCBiZSBsYWlkIG91dCBuZXh0XG4gICAqIHRvIGVhY2ggb3RoZXIuXG4gICAqL1xuICBwdWJsaWMgYWRkV2lkZ2V0cyguLi53aWRnZXRzOiBJV2lkZ2V0W10pIHtcbiAgICBpZiAod2lkZ2V0cy5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCB3YXJuaW5ncyA9IGFsbFdpZGdldHNEZWVwKHdpZGdldHMpLmZsYXRNYXAodyA9PiB3Lndhcm5pbmdzID8/IFtdKTtcbiAgICBmb3IgKGNvbnN0IHcgb2Ygd2FybmluZ3MpIHtcbiAgICAgIEFubm90YXRpb25zLm9mKHRoaXMpLmFkZFdhcm5pbmcodyk7XG4gICAgfVxuXG4gICAgY29uc3QgdyA9IHdpZGdldHMubGVuZ3RoID4gMSA/IG5ldyBSb3coLi4ud2lkZ2V0cykgOiB3aWRnZXRzWzBdO1xuICAgIHRoaXMucm93cy5wdXNoKHcpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGFsbFdpZGdldHNEZWVwKHdzOiBJV2lkZ2V0W10pIHtcbiAgY29uc3QgcmV0ID0gbmV3IEFycmF5PElXaWRnZXQ+KCk7XG4gIHdzLmZvckVhY2gocmVjdXJzZSk7XG4gIHJldHVybiByZXQ7XG5cbiAgZnVuY3Rpb24gcmVjdXJzZSh3OiBJV2lkZ2V0KSB7XG4gICAgcmV0LnB1c2godyk7XG4gICAgaWYgKGhhc1N1YldpZGdldHModykpIHtcbiAgICAgIHcud2lkZ2V0cy5mb3JFYWNoKHJlY3Vyc2UpO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBoYXNTdWJXaWRnZXRzKHc6IElXaWRnZXQpOiB3IGlzIElXaWRnZXQgJiB7IHdpZGdldHM6IElXaWRnZXRbXSB9IHtcbiAgcmV0dXJuICd3aWRnZXRzJyBpbiB3O1xufVxuIl19