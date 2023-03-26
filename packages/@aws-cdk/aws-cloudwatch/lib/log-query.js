"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogQueryWidget = exports.LogQueryVisualizationType = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const cdk = require("@aws-cdk/core");
const widget_1 = require("./widget");
/**
 * Types of view
 */
var LogQueryVisualizationType;
(function (LogQueryVisualizationType) {
    /**
     * Table view
     */
    LogQueryVisualizationType["TABLE"] = "table";
    /**
     * Line view
     */
    LogQueryVisualizationType["LINE"] = "line";
    /**
     * Stacked area view
     */
    LogQueryVisualizationType["STACKEDAREA"] = "stackedarea";
    /**
     * Bar view
     */
    LogQueryVisualizationType["BAR"] = "bar";
    /**
     * Pie view
     */
    LogQueryVisualizationType["PIE"] = "pie";
})(LogQueryVisualizationType = exports.LogQueryVisualizationType || (exports.LogQueryVisualizationType = {}));
/**
 * Display query results from Logs Insights
 */
class LogQueryWidget extends widget_1.ConcreteWidget {
    constructor(props) {
        super(props.width || 6, props.height || 6);
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_cloudwatch_LogQueryWidgetProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, LogQueryWidget);
            }
            throw error;
        }
        this.props = props;
        if (props.logGroupNames.length === 0) {
            throw new Error('Specify at least one log group name.');
        }
        if (!!props.queryString === !!props.queryLines) {
            throw new Error('Specify exactly one of \'queryString\' and \'queryLines\'');
        }
    }
    toJson() {
        const sources = this.props.logGroupNames.map(l => `SOURCE '${l}'`).join(' | ');
        const query = this.props.queryLines
            ? this.props.queryLines.join('\n| ')
            : this.props.queryString;
        const properties = {
            view: this.props.view ? this.props.view : LogQueryVisualizationType.TABLE,
            title: this.props.title,
            region: this.props.region || cdk.Aws.REGION,
            query: `${sources} | ${query}`,
        };
        // adding stacked property in case of LINE or STACKEDAREA
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
exports.LogQueryWidget = LogQueryWidget;
_a = JSII_RTTI_SYMBOL_1;
LogQueryWidget[_a] = { fqn: "@aws-cdk/aws-cloudwatch.LogQueryWidget", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9nLXF1ZXJ5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibG9nLXF1ZXJ5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLHFDQUFxQztBQUNyQyxxQ0FBMEM7QUFFMUM7O0dBRUc7QUFDSCxJQUFZLHlCQXFCWDtBQXJCRCxXQUFZLHlCQUF5QjtJQUNuQzs7T0FFRztJQUNILDRDQUFlLENBQUE7SUFDZjs7T0FFRztJQUNILDBDQUFhLENBQUE7SUFDYjs7T0FFRztJQUNILHdEQUEyQixDQUFBO0lBQzNCOztPQUVHO0lBQ0gsd0NBQVcsQ0FBQTtJQUNYOztPQUVHO0lBQ0gsd0NBQVcsQ0FBQTtBQUNiLENBQUMsRUFyQlcseUJBQXlCLEdBQXpCLGlDQUF5QixLQUF6QixpQ0FBeUIsUUFxQnBDO0FBa0VEOztHQUVHO0FBQ0gsTUFBYSxjQUFlLFNBQVEsdUJBQWM7SUFHaEQsWUFBWSxLQUEwQjtRQUNwQyxLQUFLLENBQUMsS0FBSyxDQUFDLEtBQUssSUFBSSxDQUFDLEVBQUUsS0FBSyxDQUFDLE1BQU0sSUFBSSxDQUFDLENBQUMsQ0FBQzs7Ozs7OytDQUpsQyxjQUFjOzs7O1FBS3ZCLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBRW5CLElBQUksS0FBSyxDQUFDLGFBQWEsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO1lBQ3BDLE1BQU0sSUFBSSxLQUFLLENBQUMsc0NBQXNDLENBQUMsQ0FBQztTQUN6RDtRQUVELElBQUksQ0FBQyxDQUFDLEtBQUssQ0FBQyxXQUFXLEtBQUssQ0FBQyxDQUFDLEtBQUssQ0FBQyxVQUFVLEVBQUU7WUFDOUMsTUFBTSxJQUFJLEtBQUssQ0FBQywyREFBMkQsQ0FBQyxDQUFDO1NBQzlFO0tBQ0Y7SUFFTSxNQUFNO1FBQ1gsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUMvRSxNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVU7WUFDakMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUM7WUFDcEMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDO1FBRTNCLE1BQU0sVUFBVSxHQUFRO1lBQ3RCLElBQUksRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQSxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLHlCQUF5QixDQUFDLEtBQUs7WUFDeEUsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSztZQUN2QixNQUFNLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLElBQUksR0FBRyxDQUFDLEdBQUcsQ0FBQyxNQUFNO1lBQzNDLEtBQUssRUFBRSxHQUFHLE9BQU8sTUFBTSxLQUFLLEVBQUU7U0FDL0IsQ0FBQztRQUVGLHlEQUF5RDtRQUN6RCxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxLQUFLLHlCQUF5QixDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksS0FBSyx5QkFBeUIsQ0FBQyxXQUFXLEVBQUU7WUFDbkgsc0VBQXNFO1lBQ3RFLFVBQVUsQ0FBQyxJQUFJLEdBQUcsWUFBWTtnQkFDOUIsVUFBVSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksS0FBSyx5QkFBeUIsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO1NBQy9GO1FBRUQsT0FBTyxDQUFDO2dCQUNOLElBQUksRUFBRSxLQUFLO2dCQUNYLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSztnQkFDakIsTUFBTSxFQUFFLElBQUksQ0FBQyxNQUFNO2dCQUNuQixDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7Z0JBQ1QsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO2dCQUNULFVBQVUsRUFBRSxVQUFVO2FBQ3ZCLENBQUMsQ0FBQztLQUNKOztBQTVDSCx3Q0E2Q0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBjZGsgZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBDb25jcmV0ZVdpZGdldCB9IGZyb20gJy4vd2lkZ2V0JztcblxuLyoqXG4gKiBUeXBlcyBvZiB2aWV3XG4gKi9cbmV4cG9ydCBlbnVtIExvZ1F1ZXJ5VmlzdWFsaXphdGlvblR5cGUge1xuICAvKipcbiAgICogVGFibGUgdmlld1xuICAgKi9cbiAgVEFCTEUgPSAndGFibGUnLFxuICAvKipcbiAgICogTGluZSB2aWV3XG4gICAqL1xuICBMSU5FID0gJ2xpbmUnLFxuICAvKipcbiAgICogU3RhY2tlZCBhcmVhIHZpZXdcbiAgICovXG4gIFNUQUNLRURBUkVBID0gJ3N0YWNrZWRhcmVhJyxcbiAgLyoqXG4gICAqIEJhciB2aWV3XG4gICAqL1xuICBCQVIgPSAnYmFyJyxcbiAgLyoqXG4gICAqIFBpZSB2aWV3XG4gICAqL1xuICBQSUUgPSAncGllJyxcbn1cblxuLyoqXG4gKiBQcm9wZXJ0aWVzIGZvciBhIFF1ZXJ5IHdpZGdldFxuICovXG5leHBvcnQgaW50ZXJmYWNlIExvZ1F1ZXJ5V2lkZ2V0UHJvcHMge1xuICAvKipcbiAgICogVGl0bGUgZm9yIHRoZSB3aWRnZXRcbiAgICpcbiAgICogQGRlZmF1bHQgTm8gdGl0bGVcbiAgICovXG4gIHJlYWRvbmx5IHRpdGxlPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBOYW1lcyBvZiBsb2cgZ3JvdXBzIHRvIHF1ZXJ5XG4gICAqL1xuICByZWFkb25seSBsb2dHcm91cE5hbWVzOiBzdHJpbmdbXTtcblxuICAvKipcbiAgICogRnVsbCBxdWVyeSBzdHJpbmcgZm9yIGxvZyBpbnNpZ2h0c1xuICAgKlxuICAgKiBCZSBzdXJlIHRvIHByZXBlbmQgZXZlcnkgbmV3IGxpbmUgd2l0aCBhIG5ld2xpbmUgYW5kIHBpcGUgY2hhcmFjdGVyXG4gICAqIChgXFxufGApLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIEV4YWN0bHkgb25lIG9mIGBxdWVyeVN0cmluZ2AsIGBxdWVyeUxpbmVzYCBpcyByZXF1aXJlZC5cbiAgICovXG4gIHJlYWRvbmx5IHF1ZXJ5U3RyaW5nPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBBIHNlcXVlbmNlIG9mIGxpbmVzIHRvIHVzZSB0byBidWlsZCB0aGUgcXVlcnlcbiAgICpcbiAgICogVGhlIHF1ZXJ5IHdpbGwgYmUgYnVpbHQgYnkgam9pbmluZyB0aGUgbGluZXMgdG9nZXRoZXIgdXNpbmcgYFxcbnxgLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIEV4YWN0bHkgb25lIG9mIGBxdWVyeVN0cmluZ2AsIGBxdWVyeUxpbmVzYCBpcyByZXF1aXJlZC5cbiAgICovXG4gIHJlYWRvbmx5IHF1ZXJ5TGluZXM/OiBzdHJpbmdbXTtcblxuICAvKipcbiAgICogVGhlIHJlZ2lvbiB0aGUgbWV0cmljcyBvZiB0aGlzIHdpZGdldCBzaG91bGQgYmUgdGFrZW4gZnJvbVxuICAgKlxuICAgKiBAZGVmYXVsdCBDdXJyZW50IHJlZ2lvblxuICAgKi9cbiAgcmVhZG9ubHkgcmVnaW9uPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgdHlwZSBvZiB2aWV3IHRvIHVzZVxuICAgKlxuICAgKiBAZGVmYXVsdCBMb2dRdWVyeVZpc3VhbGl6YXRpb25UeXBlLlRBQkxFXG4gICAqL1xuICByZWFkb25seSB2aWV3PzogTG9nUXVlcnlWaXN1YWxpemF0aW9uVHlwZTtcblxuICAvKipcbiAgICogV2lkdGggb2YgdGhlIHdpZGdldCwgaW4gYSBncmlkIG9mIDI0IHVuaXRzIHdpZGVcbiAgICpcbiAgICogQGRlZmF1bHQgNlxuICAgKi9cbiAgcmVhZG9ubHkgd2lkdGg/OiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIEhlaWdodCBvZiB0aGUgd2lkZ2V0XG4gICAqXG4gICAqIEBkZWZhdWx0IDZcbiAgICovXG4gIHJlYWRvbmx5IGhlaWdodD86IG51bWJlcjtcbn1cblxuLyoqXG4gKiBEaXNwbGF5IHF1ZXJ5IHJlc3VsdHMgZnJvbSBMb2dzIEluc2lnaHRzXG4gKi9cbmV4cG9ydCBjbGFzcyBMb2dRdWVyeVdpZGdldCBleHRlbmRzIENvbmNyZXRlV2lkZ2V0IHtcbiAgcHJpdmF0ZSByZWFkb25seSBwcm9wczogTG9nUXVlcnlXaWRnZXRQcm9wcztcblxuICBjb25zdHJ1Y3Rvcihwcm9wczogTG9nUXVlcnlXaWRnZXRQcm9wcykge1xuICAgIHN1cGVyKHByb3BzLndpZHRoIHx8IDYsIHByb3BzLmhlaWdodCB8fCA2KTtcbiAgICB0aGlzLnByb3BzID0gcHJvcHM7XG5cbiAgICBpZiAocHJvcHMubG9nR3JvdXBOYW1lcy5sZW5ndGggPT09IDApIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignU3BlY2lmeSBhdCBsZWFzdCBvbmUgbG9nIGdyb3VwIG5hbWUuJyk7XG4gICAgfVxuXG4gICAgaWYgKCEhcHJvcHMucXVlcnlTdHJpbmcgPT09ICEhcHJvcHMucXVlcnlMaW5lcykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdTcGVjaWZ5IGV4YWN0bHkgb25lIG9mIFxcJ3F1ZXJ5U3RyaW5nXFwnIGFuZCBcXCdxdWVyeUxpbmVzXFwnJyk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIHRvSnNvbigpOiBhbnlbXSB7XG4gICAgY29uc3Qgc291cmNlcyA9IHRoaXMucHJvcHMubG9nR3JvdXBOYW1lcy5tYXAobCA9PiBgU09VUkNFICcke2x9J2ApLmpvaW4oJyB8ICcpO1xuICAgIGNvbnN0IHF1ZXJ5ID0gdGhpcy5wcm9wcy5xdWVyeUxpbmVzXG4gICAgICA/IHRoaXMucHJvcHMucXVlcnlMaW5lcy5qb2luKCdcXG58ICcpXG4gICAgICA6IHRoaXMucHJvcHMucXVlcnlTdHJpbmc7XG5cbiAgICBjb25zdCBwcm9wZXJ0aWVzOiBhbnkgPSB7XG4gICAgICB2aWV3OiB0aGlzLnByb3BzLnZpZXc/IHRoaXMucHJvcHMudmlldyA6IExvZ1F1ZXJ5VmlzdWFsaXphdGlvblR5cGUuVEFCTEUsXG4gICAgICB0aXRsZTogdGhpcy5wcm9wcy50aXRsZSxcbiAgICAgIHJlZ2lvbjogdGhpcy5wcm9wcy5yZWdpb24gfHwgY2RrLkF3cy5SRUdJT04sXG4gICAgICBxdWVyeTogYCR7c291cmNlc30gfCAke3F1ZXJ5fWAsXG4gICAgfTtcblxuICAgIC8vIGFkZGluZyBzdGFja2VkIHByb3BlcnR5IGluIGNhc2Ugb2YgTElORSBvciBTVEFDS0VEQVJFQVxuICAgIGlmICh0aGlzLnByb3BzLnZpZXcgPT09IExvZ1F1ZXJ5VmlzdWFsaXphdGlvblR5cGUuTElORSB8fCB0aGlzLnByb3BzLnZpZXcgPT09IExvZ1F1ZXJ5VmlzdWFsaXphdGlvblR5cGUuU1RBQ0tFREFSRUEpIHtcbiAgICAgIC8vIGFzc2lnbiB0aGUgcmlnaHQgbmF0aXZlIHZpZXcgdmFsdWUuIGJvdGggdHlwZXMgc2hhcmUgdGhlIHNhbWUgdmFsdWVcbiAgICAgIHByb3BlcnRpZXMudmlldyA9ICd0aW1lU2VyaWVzJyxcbiAgICAgIHByb3BlcnRpZXMuc3RhY2tlZCA9IHRoaXMucHJvcHMudmlldyA9PT0gTG9nUXVlcnlWaXN1YWxpemF0aW9uVHlwZS5TVEFDS0VEQVJFQSA/IHRydWUgOiBmYWxzZTtcbiAgICB9XG5cbiAgICByZXR1cm4gW3tcbiAgICAgIHR5cGU6ICdsb2cnLFxuICAgICAgd2lkdGg6IHRoaXMud2lkdGgsXG4gICAgICBoZWlnaHQ6IHRoaXMuaGVpZ2h0LFxuICAgICAgeDogdGhpcy54LFxuICAgICAgeTogdGhpcy55LFxuICAgICAgcHJvcGVydGllczogcHJvcGVydGllcyxcbiAgICB9XTtcbiAgfVxufVxuIl19