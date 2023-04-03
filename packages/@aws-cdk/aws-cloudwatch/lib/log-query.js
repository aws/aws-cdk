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
_a = JSII_RTTI_SYMBOL_1;
LogQueryWidget[_a] = { fqn: "@aws-cdk/aws-cloudwatch.LogQueryWidget", version: "0.0.0" };
exports.LogQueryWidget = LogQueryWidget;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9nLXF1ZXJ5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibG9nLXF1ZXJ5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLHFDQUFxQztBQUNyQyxxQ0FBMEM7QUFFMUM7O0dBRUc7QUFDSCxJQUFZLHlCQXFCWDtBQXJCRCxXQUFZLHlCQUF5QjtJQUNuQzs7T0FFRztJQUNILDRDQUFlLENBQUE7SUFDZjs7T0FFRztJQUNILDBDQUFhLENBQUE7SUFDYjs7T0FFRztJQUNILHdEQUEyQixDQUFBO0lBQzNCOztPQUVHO0lBQ0gsd0NBQVcsQ0FBQTtJQUNYOztPQUVHO0lBQ0gsd0NBQVcsQ0FBQTtBQUNiLENBQUMsRUFyQlcseUJBQXlCLEdBQXpCLGlDQUF5QixLQUF6QixpQ0FBeUIsUUFxQnBDO0FBa0VEOztHQUVHO0FBQ0gsTUFBYSxjQUFlLFNBQVEsdUJBQWM7SUFHaEQsWUFBWSxLQUEwQjtRQUNwQyxLQUFLLENBQUMsS0FBSyxDQUFDLEtBQUssSUFBSSxDQUFDLEVBQUUsS0FBSyxDQUFDLE1BQU0sSUFBSSxDQUFDLENBQUMsQ0FBQzs7Ozs7OytDQUpsQyxjQUFjOzs7O1FBS3ZCLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBRW5CLElBQUksS0FBSyxDQUFDLGFBQWEsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO1lBQ3BDLE1BQU0sSUFBSSxLQUFLLENBQUMsc0NBQXNDLENBQUMsQ0FBQztTQUN6RDtRQUVELElBQUksQ0FBQyxDQUFDLEtBQUssQ0FBQyxXQUFXLEtBQUssQ0FBQyxDQUFDLEtBQUssQ0FBQyxVQUFVLEVBQUU7WUFDOUMsTUFBTSxJQUFJLEtBQUssQ0FBQywyREFBMkQsQ0FBQyxDQUFDO1NBQzlFO0tBQ0Y7SUFFTSxNQUFNO1FBQ1gsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUMvRSxNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVU7WUFDakMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUM7WUFDcEMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDO1FBRTNCLE1BQU0sVUFBVSxHQUFRO1lBQ3RCLElBQUksRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQSxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLHlCQUF5QixDQUFDLEtBQUs7WUFDeEUsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSztZQUN2QixNQUFNLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLElBQUksR0FBRyxDQUFDLEdBQUcsQ0FBQyxNQUFNO1lBQzNDLEtBQUssRUFBRSxHQUFHLE9BQU8sTUFBTSxLQUFLLEVBQUU7U0FDL0IsQ0FBQztRQUVGLHlEQUF5RDtRQUN6RCxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxLQUFLLHlCQUF5QixDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksS0FBSyx5QkFBeUIsQ0FBQyxXQUFXLEVBQUU7WUFDbkgsc0VBQXNFO1lBQ3RFLFVBQVUsQ0FBQyxJQUFJLEdBQUcsWUFBWTtnQkFDOUIsVUFBVSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksS0FBSyx5QkFBeUIsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO1NBQy9GO1FBRUQsT0FBTyxDQUFDO2dCQUNOLElBQUksRUFBRSxLQUFLO2dCQUNYLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSztnQkFDakIsTUFBTSxFQUFFLElBQUksQ0FBQyxNQUFNO2dCQUNuQixDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7Z0JBQ1QsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO2dCQUNULFVBQVUsRUFBRSxVQUFVO2FBQ3ZCLENBQUMsQ0FBQztLQUNKOzs7O0FBNUNVLHdDQUFjIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgY2RrIGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgQ29uY3JldGVXaWRnZXQgfSBmcm9tICcuL3dpZGdldCc7XG5cbi8qKlxuICogVHlwZXMgb2Ygdmlld1xuICovXG5leHBvcnQgZW51bSBMb2dRdWVyeVZpc3VhbGl6YXRpb25UeXBlIHtcbiAgLyoqXG4gICAqIFRhYmxlIHZpZXdcbiAgICovXG4gIFRBQkxFID0gJ3RhYmxlJyxcbiAgLyoqXG4gICAqIExpbmUgdmlld1xuICAgKi9cbiAgTElORSA9ICdsaW5lJyxcbiAgLyoqXG4gICAqIFN0YWNrZWQgYXJlYSB2aWV3XG4gICAqL1xuICBTVEFDS0VEQVJFQSA9ICdzdGFja2VkYXJlYScsXG4gIC8qKlxuICAgKiBCYXIgdmlld1xuICAgKi9cbiAgQkFSID0gJ2JhcicsXG4gIC8qKlxuICAgKiBQaWUgdmlld1xuICAgKi9cbiAgUElFID0gJ3BpZScsXG59XG5cbi8qKlxuICogUHJvcGVydGllcyBmb3IgYSBRdWVyeSB3aWRnZXRcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBMb2dRdWVyeVdpZGdldFByb3BzIHtcbiAgLyoqXG4gICAqIFRpdGxlIGZvciB0aGUgd2lkZ2V0XG4gICAqXG4gICAqIEBkZWZhdWx0IE5vIHRpdGxlXG4gICAqL1xuICByZWFkb25seSB0aXRsZT86IHN0cmluZztcblxuICAvKipcbiAgICogTmFtZXMgb2YgbG9nIGdyb3VwcyB0byBxdWVyeVxuICAgKi9cbiAgcmVhZG9ubHkgbG9nR3JvdXBOYW1lczogc3RyaW5nW107XG5cbiAgLyoqXG4gICAqIEZ1bGwgcXVlcnkgc3RyaW5nIGZvciBsb2cgaW5zaWdodHNcbiAgICpcbiAgICogQmUgc3VyZSB0byBwcmVwZW5kIGV2ZXJ5IG5ldyBsaW5lIHdpdGggYSBuZXdsaW5lIGFuZCBwaXBlIGNoYXJhY3RlclxuICAgKiAoYFxcbnxgKS5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBFeGFjdGx5IG9uZSBvZiBgcXVlcnlTdHJpbmdgLCBgcXVlcnlMaW5lc2AgaXMgcmVxdWlyZWQuXG4gICAqL1xuICByZWFkb25seSBxdWVyeVN0cmluZz86IHN0cmluZztcblxuICAvKipcbiAgICogQSBzZXF1ZW5jZSBvZiBsaW5lcyB0byB1c2UgdG8gYnVpbGQgdGhlIHF1ZXJ5XG4gICAqXG4gICAqIFRoZSBxdWVyeSB3aWxsIGJlIGJ1aWx0IGJ5IGpvaW5pbmcgdGhlIGxpbmVzIHRvZ2V0aGVyIHVzaW5nIGBcXG58YC5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBFeGFjdGx5IG9uZSBvZiBgcXVlcnlTdHJpbmdgLCBgcXVlcnlMaW5lc2AgaXMgcmVxdWlyZWQuXG4gICAqL1xuICByZWFkb25seSBxdWVyeUxpbmVzPzogc3RyaW5nW107XG5cbiAgLyoqXG4gICAqIFRoZSByZWdpb24gdGhlIG1ldHJpY3Mgb2YgdGhpcyB3aWRnZXQgc2hvdWxkIGJlIHRha2VuIGZyb21cbiAgICpcbiAgICogQGRlZmF1bHQgQ3VycmVudCByZWdpb25cbiAgICovXG4gIHJlYWRvbmx5IHJlZ2lvbj86IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIHR5cGUgb2YgdmlldyB0byB1c2VcbiAgICpcbiAgICogQGRlZmF1bHQgTG9nUXVlcnlWaXN1YWxpemF0aW9uVHlwZS5UQUJMRVxuICAgKi9cbiAgcmVhZG9ubHkgdmlldz86IExvZ1F1ZXJ5VmlzdWFsaXphdGlvblR5cGU7XG5cbiAgLyoqXG4gICAqIFdpZHRoIG9mIHRoZSB3aWRnZXQsIGluIGEgZ3JpZCBvZiAyNCB1bml0cyB3aWRlXG4gICAqXG4gICAqIEBkZWZhdWx0IDZcbiAgICovXG4gIHJlYWRvbmx5IHdpZHRoPzogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBIZWlnaHQgb2YgdGhlIHdpZGdldFxuICAgKlxuICAgKiBAZGVmYXVsdCA2XG4gICAqL1xuICByZWFkb25seSBoZWlnaHQ/OiBudW1iZXI7XG59XG5cbi8qKlxuICogRGlzcGxheSBxdWVyeSByZXN1bHRzIGZyb20gTG9ncyBJbnNpZ2h0c1xuICovXG5leHBvcnQgY2xhc3MgTG9nUXVlcnlXaWRnZXQgZXh0ZW5kcyBDb25jcmV0ZVdpZGdldCB7XG4gIHByaXZhdGUgcmVhZG9ubHkgcHJvcHM6IExvZ1F1ZXJ5V2lkZ2V0UHJvcHM7XG5cbiAgY29uc3RydWN0b3IocHJvcHM6IExvZ1F1ZXJ5V2lkZ2V0UHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcy53aWR0aCB8fCA2LCBwcm9wcy5oZWlnaHQgfHwgNik7XG4gICAgdGhpcy5wcm9wcyA9IHByb3BzO1xuXG4gICAgaWYgKHByb3BzLmxvZ0dyb3VwTmFtZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1NwZWNpZnkgYXQgbGVhc3Qgb25lIGxvZyBncm91cCBuYW1lLicpO1xuICAgIH1cblxuICAgIGlmICghIXByb3BzLnF1ZXJ5U3RyaW5nID09PSAhIXByb3BzLnF1ZXJ5TGluZXMpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignU3BlY2lmeSBleGFjdGx5IG9uZSBvZiBcXCdxdWVyeVN0cmluZ1xcJyBhbmQgXFwncXVlcnlMaW5lc1xcJycpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyB0b0pzb24oKTogYW55W10ge1xuICAgIGNvbnN0IHNvdXJjZXMgPSB0aGlzLnByb3BzLmxvZ0dyb3VwTmFtZXMubWFwKGwgPT4gYFNPVVJDRSAnJHtsfSdgKS5qb2luKCcgfCAnKTtcbiAgICBjb25zdCBxdWVyeSA9IHRoaXMucHJvcHMucXVlcnlMaW5lc1xuICAgICAgPyB0aGlzLnByb3BzLnF1ZXJ5TGluZXMuam9pbignXFxufCAnKVxuICAgICAgOiB0aGlzLnByb3BzLnF1ZXJ5U3RyaW5nO1xuXG4gICAgY29uc3QgcHJvcGVydGllczogYW55ID0ge1xuICAgICAgdmlldzogdGhpcy5wcm9wcy52aWV3PyB0aGlzLnByb3BzLnZpZXcgOiBMb2dRdWVyeVZpc3VhbGl6YXRpb25UeXBlLlRBQkxFLFxuICAgICAgdGl0bGU6IHRoaXMucHJvcHMudGl0bGUsXG4gICAgICByZWdpb246IHRoaXMucHJvcHMucmVnaW9uIHx8IGNkay5Bd3MuUkVHSU9OLFxuICAgICAgcXVlcnk6IGAke3NvdXJjZXN9IHwgJHtxdWVyeX1gLFxuICAgIH07XG5cbiAgICAvLyBhZGRpbmcgc3RhY2tlZCBwcm9wZXJ0eSBpbiBjYXNlIG9mIExJTkUgb3IgU1RBQ0tFREFSRUFcbiAgICBpZiAodGhpcy5wcm9wcy52aWV3ID09PSBMb2dRdWVyeVZpc3VhbGl6YXRpb25UeXBlLkxJTkUgfHwgdGhpcy5wcm9wcy52aWV3ID09PSBMb2dRdWVyeVZpc3VhbGl6YXRpb25UeXBlLlNUQUNLRURBUkVBKSB7XG4gICAgICAvLyBhc3NpZ24gdGhlIHJpZ2h0IG5hdGl2ZSB2aWV3IHZhbHVlLiBib3RoIHR5cGVzIHNoYXJlIHRoZSBzYW1lIHZhbHVlXG4gICAgICBwcm9wZXJ0aWVzLnZpZXcgPSAndGltZVNlcmllcycsXG4gICAgICBwcm9wZXJ0aWVzLnN0YWNrZWQgPSB0aGlzLnByb3BzLnZpZXcgPT09IExvZ1F1ZXJ5VmlzdWFsaXphdGlvblR5cGUuU1RBQ0tFREFSRUEgPyB0cnVlIDogZmFsc2U7XG4gICAgfVxuXG4gICAgcmV0dXJuIFt7XG4gICAgICB0eXBlOiAnbG9nJyxcbiAgICAgIHdpZHRoOiB0aGlzLndpZHRoLFxuICAgICAgaGVpZ2h0OiB0aGlzLmhlaWdodCxcbiAgICAgIHg6IHRoaXMueCxcbiAgICAgIHk6IHRoaXMueSxcbiAgICAgIHByb3BlcnRpZXM6IHByb3BlcnRpZXMsXG4gICAgfV07XG4gIH1cbn1cbiJdfQ==