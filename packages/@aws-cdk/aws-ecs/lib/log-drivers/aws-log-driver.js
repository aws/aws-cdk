"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AwsLogDriver = exports.AwsLogDriverMode = void 0;
const jsiiDeprecationWarnings = require("../../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const logs = require("@aws-cdk/aws-logs");
const log_driver_1 = require("./log-driver");
const utils_1 = require("./utils");
/**
 * awslogs provides two modes for delivering messages from the container to the log driver
 */
var AwsLogDriverMode;
(function (AwsLogDriverMode) {
    /**
     * (default) direct, blocking delivery from container to driver.
     */
    AwsLogDriverMode["BLOCKING"] = "blocking";
    /**
     * The non-blocking message delivery mode prevents applications from blocking due to logging back pressure.
     * Applications are likely to fail in unexpected ways when STDERR or STDOUT streams block.
     */
    AwsLogDriverMode["NON_BLOCKING"] = "non-blocking";
})(AwsLogDriverMode = exports.AwsLogDriverMode || (exports.AwsLogDriverMode = {}));
/**
 * A log driver that sends log information to CloudWatch Logs.
 */
class AwsLogDriver extends log_driver_1.LogDriver {
    /**
     * Constructs a new instance of the AwsLogDriver class.
     *
     * @param props the awslogs log driver configuration options.
     */
    constructor(props) {
        super();
        this.props = props;
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ecs_AwsLogDriverProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, AwsLogDriver);
            }
            throw error;
        }
        if (props.logGroup && props.logRetention) {
            throw new Error('Cannot specify both `logGroup` and `logRetentionDays`.');
        }
    }
    /**
     * Called when the log driver is configured on a container
     */
    bind(scope, containerDefinition) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ecs_ContainerDefinition(containerDefinition);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.bind);
            }
            throw error;
        }
        this.logGroup = this.props.logGroup || new logs.LogGroup(scope, 'LogGroup', {
            retention: this.props.logRetention || Infinity,
        });
        this.logGroup.grantWrite(containerDefinition.taskDefinition.obtainExecutionRole());
        return {
            logDriver: 'awslogs',
            options: utils_1.removeEmpty({
                'awslogs-group': this.logGroup.logGroupName,
                'awslogs-stream-prefix': this.props.streamPrefix,
                'awslogs-region': this.logGroup.env.region,
                'awslogs-datetime-format': this.props.datetimeFormat,
                'awslogs-multiline-pattern': this.props.multilinePattern,
                'mode': this.props.mode,
            }),
        };
    }
}
exports.AwsLogDriver = AwsLogDriver;
_a = JSII_RTTI_SYMBOL_1;
AwsLogDriver[_a] = { fqn: "@aws-cdk/aws-ecs.AwsLogDriver", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXdzLWxvZy1kcml2ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJhd3MtbG9nLWRyaXZlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSwwQ0FBMEM7QUFFMUMsNkNBQTBEO0FBQzFELG1DQUFzQztBQUd0Qzs7R0FFRztBQUNILElBQVksZ0JBWVg7QUFaRCxXQUFZLGdCQUFnQjtJQUUxQjs7T0FFRztJQUNILHlDQUFxQixDQUFBO0lBRXJCOzs7T0FHRztJQUNILGlEQUE2QixDQUFBO0FBQy9CLENBQUMsRUFaVyxnQkFBZ0IsR0FBaEIsd0JBQWdCLEtBQWhCLHdCQUFnQixRQVkzQjtBQWlFRDs7R0FFRztBQUNILE1BQWEsWUFBYSxTQUFRLHNCQUFTO0lBUXpDOzs7O09BSUc7SUFDSCxZQUE2QixLQUF3QjtRQUNuRCxLQUFLLEVBQUUsQ0FBQztRQURtQixVQUFLLEdBQUwsS0FBSyxDQUFtQjs7Ozs7OytDQWIxQyxZQUFZOzs7O1FBZ0JyQixJQUFJLEtBQUssQ0FBQyxRQUFRLElBQUksS0FBSyxDQUFDLFlBQVksRUFBRTtZQUN4QyxNQUFNLElBQUksS0FBSyxDQUFDLHdEQUF3RCxDQUFDLENBQUM7U0FDM0U7S0FDRjtJQUVEOztPQUVHO0lBQ0ksSUFBSSxDQUFDLEtBQWdCLEVBQUUsbUJBQXdDOzs7Ozs7Ozs7O1FBQ3BFLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLElBQUksSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxVQUFVLEVBQUU7WUFDMUUsU0FBUyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsWUFBWSxJQUFJLFFBQVE7U0FDL0MsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsbUJBQW1CLENBQUMsY0FBYyxDQUFDLG1CQUFtQixFQUFFLENBQUMsQ0FBQztRQUVuRixPQUFPO1lBQ0wsU0FBUyxFQUFFLFNBQVM7WUFDcEIsT0FBTyxFQUFFLG1CQUFXLENBQUM7Z0JBQ25CLGVBQWUsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLFlBQVk7Z0JBQzNDLHVCQUF1QixFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsWUFBWTtnQkFDaEQsZ0JBQWdCLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsTUFBTTtnQkFDMUMseUJBQXlCLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxjQUFjO2dCQUNwRCwyQkFBMkIsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLGdCQUFnQjtnQkFDeEQsTUFBTSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSTthQUN4QixDQUFDO1NBQ0gsQ0FBQztLQUNIOztBQTFDSCxvQ0E0Q0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBsb2dzIGZyb20gJ0Bhd3MtY2RrL2F3cy1sb2dzJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0IHsgTG9nRHJpdmVyLCBMb2dEcml2ZXJDb25maWcgfSBmcm9tICcuL2xvZy1kcml2ZXInO1xuaW1wb3J0IHsgcmVtb3ZlRW1wdHkgfSBmcm9tICcuL3V0aWxzJztcbmltcG9ydCB7IENvbnRhaW5lckRlZmluaXRpb24gfSBmcm9tICcuLi9jb250YWluZXItZGVmaW5pdGlvbic7XG5cbi8qKlxuICogYXdzbG9ncyBwcm92aWRlcyB0d28gbW9kZXMgZm9yIGRlbGl2ZXJpbmcgbWVzc2FnZXMgZnJvbSB0aGUgY29udGFpbmVyIHRvIHRoZSBsb2cgZHJpdmVyXG4gKi9cbmV4cG9ydCBlbnVtIEF3c0xvZ0RyaXZlck1vZGUge1xuXG4gIC8qKlxuICAgKiAoZGVmYXVsdCkgZGlyZWN0LCBibG9ja2luZyBkZWxpdmVyeSBmcm9tIGNvbnRhaW5lciB0byBkcml2ZXIuXG4gICAqL1xuICBCTE9DS0lORyA9ICdibG9ja2luZycsXG5cbiAgLyoqXG4gICAqIFRoZSBub24tYmxvY2tpbmcgbWVzc2FnZSBkZWxpdmVyeSBtb2RlIHByZXZlbnRzIGFwcGxpY2F0aW9ucyBmcm9tIGJsb2NraW5nIGR1ZSB0byBsb2dnaW5nIGJhY2sgcHJlc3N1cmUuXG4gICAqIEFwcGxpY2F0aW9ucyBhcmUgbGlrZWx5IHRvIGZhaWwgaW4gdW5leHBlY3RlZCB3YXlzIHdoZW4gU1RERVJSIG9yIFNURE9VVCBzdHJlYW1zIGJsb2NrLlxuICAgKi9cbiAgTk9OX0JMT0NLSU5HID0gJ25vbi1ibG9ja2luZydcbn1cblxuLyoqXG4gKiBTcGVjaWZpZXMgdGhlIGF3c2xvZ3MgbG9nIGRyaXZlciBjb25maWd1cmF0aW9uIG9wdGlvbnMuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQXdzTG9nRHJpdmVyUHJvcHMge1xuICAvKipcbiAgICogUHJlZml4IGZvciB0aGUgbG9nIHN0cmVhbXNcbiAgICpcbiAgICogVGhlIGF3c2xvZ3Mtc3RyZWFtLXByZWZpeCBvcHRpb24gYWxsb3dzIHlvdSB0byBhc3NvY2lhdGUgYSBsb2cgc3RyZWFtXG4gICAqIHdpdGggdGhlIHNwZWNpZmllZCBwcmVmaXgsIHRoZSBjb250YWluZXIgbmFtZSwgYW5kIHRoZSBJRCBvZiB0aGUgQW1hem9uXG4gICAqIEVDUyB0YXNrIHRvIHdoaWNoIHRoZSBjb250YWluZXIgYmVsb25ncy4gSWYgeW91IHNwZWNpZnkgYSBwcmVmaXggd2l0aFxuICAgKiB0aGlzIG9wdGlvbiwgdGhlbiB0aGUgbG9nIHN0cmVhbSB0YWtlcyB0aGUgZm9sbG93aW5nIGZvcm1hdDpcbiAgICpcbiAgICogICAgIHByZWZpeC1uYW1lL2NvbnRhaW5lci1uYW1lL2Vjcy10YXNrLWlkXG4gICAqL1xuICByZWFkb25seSBzdHJlYW1QcmVmaXg6IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIGxvZyBncm91cCB0byBsb2cgdG9cbiAgICpcbiAgICogQGRlZmF1bHQgLSBBIGxvZyBncm91cCBpcyBhdXRvbWF0aWNhbGx5IGNyZWF0ZWQuXG4gICAqL1xuICByZWFkb25seSBsb2dHcm91cD86IGxvZ3MuSUxvZ0dyb3VwO1xuXG4gIC8qKlxuICAgKiBUaGUgbnVtYmVyIG9mIGRheXMgbG9nIGV2ZW50cyBhcmUga2VwdCBpbiBDbG91ZFdhdGNoIExvZ3Mgd2hlbiB0aGUgbG9nXG4gICAqIGdyb3VwIGlzIGF1dG9tYXRpY2FsbHkgY3JlYXRlZCBieSB0aGlzIGNvbnN0cnVjdC5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBMb2dzIG5ldmVyIGV4cGlyZS5cbiAgICovXG4gIHJlYWRvbmx5IGxvZ1JldGVudGlvbj86IGxvZ3MuUmV0ZW50aW9uRGF5cztcblxuICAvKipcbiAgICogVGhpcyBvcHRpb24gZGVmaW5lcyBhIG11bHRpbGluZSBzdGFydCBwYXR0ZXJuIGluIFB5dGhvbiBzdHJmdGltZSBmb3JtYXQuXG4gICAqXG4gICAqIEEgbG9nIG1lc3NhZ2UgY29uc2lzdHMgb2YgYSBsaW5lIHRoYXQgbWF0Y2hlcyB0aGUgcGF0dGVybiBhbmQgYW55XG4gICAqIGZvbGxvd2luZyBsaW5lcyB0aGF0IGRvbuKAmXQgbWF0Y2ggdGhlIHBhdHRlcm4uIFRodXMgdGhlIG1hdGNoZWQgbGluZSBpc1xuICAgKiB0aGUgZGVsaW1pdGVyIGJldHdlZW4gbG9nIG1lc3NhZ2VzLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIE5vIG11bHRpbGluZSBtYXRjaGluZy5cbiAgICovXG4gIHJlYWRvbmx5IGRhdGV0aW1lRm9ybWF0Pzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGlzIG9wdGlvbiBkZWZpbmVzIGEgbXVsdGlsaW5lIHN0YXJ0IHBhdHRlcm4gdXNpbmcgYSByZWd1bGFyIGV4cHJlc3Npb24uXG4gICAqXG4gICAqIEEgbG9nIG1lc3NhZ2UgY29uc2lzdHMgb2YgYSBsaW5lIHRoYXQgbWF0Y2hlcyB0aGUgcGF0dGVybiBhbmQgYW55XG4gICAqIGZvbGxvd2luZyBsaW5lcyB0aGF0IGRvbuKAmXQgbWF0Y2ggdGhlIHBhdHRlcm4uIFRodXMgdGhlIG1hdGNoZWQgbGluZSBpc1xuICAgKiB0aGUgZGVsaW1pdGVyIGJldHdlZW4gbG9nIG1lc3NhZ2VzLlxuICAgKlxuICAgKiBUaGlzIG9wdGlvbiBpcyBpZ25vcmVkIGlmIGRhdGV0aW1lRm9ybWF0IGlzIGFsc28gY29uZmlndXJlZC5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBObyBtdWx0aWxpbmUgbWF0Y2hpbmcuXG4gICAqL1xuICByZWFkb25seSBtdWx0aWxpbmVQYXR0ZXJuPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgZGVsaXZlcnkgbW9kZSBvZiBsb2cgbWVzc2FnZXMgZnJvbSB0aGUgY29udGFpbmVyIHRvIGF3c2xvZ3MuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gQXdzTG9nRHJpdmVyTW9kZS5CTE9DS0lOR1xuICAgKi9cbiAgcmVhZG9ubHkgbW9kZT86IEF3c0xvZ0RyaXZlck1vZGU7XG59XG5cbi8qKlxuICogQSBsb2cgZHJpdmVyIHRoYXQgc2VuZHMgbG9nIGluZm9ybWF0aW9uIHRvIENsb3VkV2F0Y2ggTG9ncy5cbiAqL1xuZXhwb3J0IGNsYXNzIEF3c0xvZ0RyaXZlciBleHRlbmRzIExvZ0RyaXZlciB7XG4gIC8qKlxuICAgKiBUaGUgbG9nIGdyb3VwIHRvIHNlbmQgbG9nIHN0cmVhbXMgdG8uXG4gICAqXG4gICAqIE9ubHkgYXZhaWxhYmxlIGFmdGVyIHRoZSBMb2dEcml2ZXIgaGFzIGJlZW4gYm91bmQgdG8gYSBDb250YWluZXJEZWZpbml0aW9uLlxuICAgKi9cbiAgcHVibGljIGxvZ0dyb3VwPzogbG9ncy5JTG9nR3JvdXA7XG5cbiAgLyoqXG4gICAqIENvbnN0cnVjdHMgYSBuZXcgaW5zdGFuY2Ugb2YgdGhlIEF3c0xvZ0RyaXZlciBjbGFzcy5cbiAgICpcbiAgICogQHBhcmFtIHByb3BzIHRoZSBhd3Nsb2dzIGxvZyBkcml2ZXIgY29uZmlndXJhdGlvbiBvcHRpb25zLlxuICAgKi9cbiAgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSBwcm9wczogQXdzTG9nRHJpdmVyUHJvcHMpIHtcbiAgICBzdXBlcigpO1xuXG4gICAgaWYgKHByb3BzLmxvZ0dyb3VwICYmIHByb3BzLmxvZ1JldGVudGlvbikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3Qgc3BlY2lmeSBib3RoIGBsb2dHcm91cGAgYW5kIGBsb2dSZXRlbnRpb25EYXlzYC4nKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ2FsbGVkIHdoZW4gdGhlIGxvZyBkcml2ZXIgaXMgY29uZmlndXJlZCBvbiBhIGNvbnRhaW5lclxuICAgKi9cbiAgcHVibGljIGJpbmQoc2NvcGU6IENvbnN0cnVjdCwgY29udGFpbmVyRGVmaW5pdGlvbjogQ29udGFpbmVyRGVmaW5pdGlvbik6IExvZ0RyaXZlckNvbmZpZyB7XG4gICAgdGhpcy5sb2dHcm91cCA9IHRoaXMucHJvcHMubG9nR3JvdXAgfHwgbmV3IGxvZ3MuTG9nR3JvdXAoc2NvcGUsICdMb2dHcm91cCcsIHtcbiAgICAgIHJldGVudGlvbjogdGhpcy5wcm9wcy5sb2dSZXRlbnRpb24gfHwgSW5maW5pdHksXG4gICAgfSk7XG5cbiAgICB0aGlzLmxvZ0dyb3VwLmdyYW50V3JpdGUoY29udGFpbmVyRGVmaW5pdGlvbi50YXNrRGVmaW5pdGlvbi5vYnRhaW5FeGVjdXRpb25Sb2xlKCkpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIGxvZ0RyaXZlcjogJ2F3c2xvZ3MnLFxuICAgICAgb3B0aW9uczogcmVtb3ZlRW1wdHkoe1xuICAgICAgICAnYXdzbG9ncy1ncm91cCc6IHRoaXMubG9nR3JvdXAubG9nR3JvdXBOYW1lLFxuICAgICAgICAnYXdzbG9ncy1zdHJlYW0tcHJlZml4JzogdGhpcy5wcm9wcy5zdHJlYW1QcmVmaXgsXG4gICAgICAgICdhd3Nsb2dzLXJlZ2lvbic6IHRoaXMubG9nR3JvdXAuZW52LnJlZ2lvbixcbiAgICAgICAgJ2F3c2xvZ3MtZGF0ZXRpbWUtZm9ybWF0JzogdGhpcy5wcm9wcy5kYXRldGltZUZvcm1hdCxcbiAgICAgICAgJ2F3c2xvZ3MtbXVsdGlsaW5lLXBhdHRlcm4nOiB0aGlzLnByb3BzLm11bHRpbGluZVBhdHRlcm4sXG4gICAgICAgICdtb2RlJzogdGhpcy5wcm9wcy5tb2RlLFxuICAgICAgfSksXG4gICAgfTtcbiAgfVxuXG59XG4iXX0=