"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogDrivers = void 0;
const jsiiDeprecationWarnings = require("../../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const aws_log_driver_1 = require("./aws-log-driver");
const firelens_log_driver_1 = require("./firelens-log-driver");
const fluentd_log_driver_1 = require("./fluentd-log-driver");
const gelf_log_driver_1 = require("./gelf-log-driver");
const journald_log_driver_1 = require("./journald-log-driver");
const json_file_log_driver_1 = require("./json-file-log-driver");
const splunk_log_driver_1 = require("./splunk-log-driver");
const syslog_log_driver_1 = require("./syslog-log-driver");
/**
 * The base class for log drivers.
 */
class LogDrivers {
    /**
     * Creates a log driver configuration that sends log information to CloudWatch Logs.
     */
    static awsLogs(props) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ecs_AwsLogDriverProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.awsLogs);
            }
            throw error;
        }
        return new aws_log_driver_1.AwsLogDriver(props);
    }
    /**
     * Creates a log driver configuration that sends log information to fluentd Logs.
     */
    static fluentd(props) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ecs_FluentdLogDriverProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.fluentd);
            }
            throw error;
        }
        return new fluentd_log_driver_1.FluentdLogDriver(props);
    }
    /**
     * Creates a log driver configuration that sends log information to gelf Logs.
     */
    static gelf(props) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ecs_GelfLogDriverProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.gelf);
            }
            throw error;
        }
        return new gelf_log_driver_1.GelfLogDriver(props);
    }
    /**
     * Creates a log driver configuration that sends log information to journald Logs.
     */
    static journald(props) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ecs_JournaldLogDriverProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.journald);
            }
            throw error;
        }
        return new journald_log_driver_1.JournaldLogDriver(props);
    }
    /**
     * Creates a log driver configuration that sends log information to json-file Logs.
     */
    static jsonFile(props) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ecs_JsonFileLogDriverProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.jsonFile);
            }
            throw error;
        }
        return new json_file_log_driver_1.JsonFileLogDriver(props);
    }
    /**
     * Creates a log driver configuration that sends log information to splunk Logs.
     */
    static splunk(props) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ecs_SplunkLogDriverProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.splunk);
            }
            throw error;
        }
        return new splunk_log_driver_1.SplunkLogDriver(props);
    }
    /**
     * Creates a log driver configuration that sends log information to syslog Logs.
     */
    static syslog(props) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ecs_SyslogLogDriverProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.syslog);
            }
            throw error;
        }
        return new syslog_log_driver_1.SyslogLogDriver(props);
    }
    /**
     * Creates a log driver configuration that sends log information to firelens log router.
     * For detail configurations, please refer to Amazon ECS FireLens Examples:
     * https://github.com/aws-samples/amazon-ecs-firelens-examples
     */
    static firelens(props) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ecs_FireLensLogDriverProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.firelens);
            }
            throw error;
        }
        return new firelens_log_driver_1.FireLensLogDriver(props);
    }
}
exports.LogDrivers = LogDrivers;
_a = JSII_RTTI_SYMBOL_1;
LogDrivers[_a] = { fqn: "@aws-cdk/aws-ecs.LogDrivers", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9nLWRyaXZlcnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJsb2ctZHJpdmVycy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxxREFBbUU7QUFDbkUsK0RBQWtGO0FBQ2xGLDZEQUErRTtBQUMvRSx1REFBc0U7QUFDdEUsK0RBQWtGO0FBQ2xGLGlFQUFtRjtBQUVuRiwyREFBNEU7QUFDNUUsMkRBQTRFO0FBRTVFOztHQUVHO0FBQ0gsTUFBYSxVQUFVO0lBQ3JCOztPQUVHO0lBQ0ksTUFBTSxDQUFDLE9BQU8sQ0FBQyxLQUF3Qjs7Ozs7Ozs7OztRQUM1QyxPQUFPLElBQUksNkJBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQztLQUNoQztJQUVEOztPQUVHO0lBQ0ksTUFBTSxDQUFDLE9BQU8sQ0FBQyxLQUE2Qjs7Ozs7Ozs7OztRQUNqRCxPQUFPLElBQUkscUNBQWdCLENBQUMsS0FBSyxDQUFDLENBQUM7S0FDcEM7SUFFRDs7T0FFRztJQUNJLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBeUI7Ozs7Ozs7Ozs7UUFDMUMsT0FBTyxJQUFJLCtCQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7S0FDakM7SUFFRDs7T0FFRztJQUNJLE1BQU0sQ0FBQyxRQUFRLENBQUMsS0FBOEI7Ozs7Ozs7Ozs7UUFDbkQsT0FBTyxJQUFJLHVDQUFpQixDQUFDLEtBQUssQ0FBQyxDQUFDO0tBQ3JDO0lBRUQ7O09BRUc7SUFDSSxNQUFNLENBQUMsUUFBUSxDQUFDLEtBQThCOzs7Ozs7Ozs7O1FBQ25ELE9BQU8sSUFBSSx3Q0FBaUIsQ0FBQyxLQUFLLENBQUMsQ0FBQztLQUNyQztJQUVEOztPQUVHO0lBQ0ksTUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUEyQjs7Ozs7Ozs7OztRQUM5QyxPQUFPLElBQUksbUNBQWUsQ0FBQyxLQUFLLENBQUMsQ0FBQztLQUNuQztJQUVEOztPQUVHO0lBQ0ksTUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUE0Qjs7Ozs7Ozs7OztRQUMvQyxPQUFPLElBQUksbUNBQWUsQ0FBQyxLQUFLLENBQUMsQ0FBQztLQUNuQztJQUVEOzs7O09BSUc7SUFDSSxNQUFNLENBQUMsUUFBUSxDQUFDLEtBQTZCOzs7Ozs7Ozs7O1FBQ2xELE9BQU8sSUFBSSx1Q0FBaUIsQ0FBQyxLQUFLLENBQUMsQ0FBQztLQUNyQzs7QUF6REgsZ0NBMERDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQXdzTG9nRHJpdmVyLCBBd3NMb2dEcml2ZXJQcm9wcyB9IGZyb20gJy4vYXdzLWxvZy1kcml2ZXInO1xuaW1wb3J0IHsgRmlyZUxlbnNMb2dEcml2ZXIsIEZpcmVMZW5zTG9nRHJpdmVyUHJvcHMgfSBmcm9tICcuL2ZpcmVsZW5zLWxvZy1kcml2ZXInO1xuaW1wb3J0IHsgRmx1ZW50ZExvZ0RyaXZlciwgRmx1ZW50ZExvZ0RyaXZlclByb3BzIH0gZnJvbSAnLi9mbHVlbnRkLWxvZy1kcml2ZXInO1xuaW1wb3J0IHsgR2VsZkxvZ0RyaXZlciwgR2VsZkxvZ0RyaXZlclByb3BzIH0gZnJvbSAnLi9nZWxmLWxvZy1kcml2ZXInO1xuaW1wb3J0IHsgSm91cm5hbGRMb2dEcml2ZXIsIEpvdXJuYWxkTG9nRHJpdmVyUHJvcHMgfSBmcm9tICcuL2pvdXJuYWxkLWxvZy1kcml2ZXInO1xuaW1wb3J0IHsgSnNvbkZpbGVMb2dEcml2ZXIsIEpzb25GaWxlTG9nRHJpdmVyUHJvcHMgfSBmcm9tICcuL2pzb24tZmlsZS1sb2ctZHJpdmVyJztcbmltcG9ydCB7IExvZ0RyaXZlciB9IGZyb20gJy4vbG9nLWRyaXZlcic7XG5pbXBvcnQgeyBTcGx1bmtMb2dEcml2ZXIsIFNwbHVua0xvZ0RyaXZlclByb3BzIH0gZnJvbSAnLi9zcGx1bmstbG9nLWRyaXZlcic7XG5pbXBvcnQgeyBTeXNsb2dMb2dEcml2ZXIsIFN5c2xvZ0xvZ0RyaXZlclByb3BzIH0gZnJvbSAnLi9zeXNsb2ctbG9nLWRyaXZlcic7XG5cbi8qKlxuICogVGhlIGJhc2UgY2xhc3MgZm9yIGxvZyBkcml2ZXJzLlxuICovXG5leHBvcnQgY2xhc3MgTG9nRHJpdmVycyB7XG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgbG9nIGRyaXZlciBjb25maWd1cmF0aW9uIHRoYXQgc2VuZHMgbG9nIGluZm9ybWF0aW9uIHRvIENsb3VkV2F0Y2ggTG9ncy5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgYXdzTG9ncyhwcm9wczogQXdzTG9nRHJpdmVyUHJvcHMpOiBMb2dEcml2ZXIge1xuICAgIHJldHVybiBuZXcgQXdzTG9nRHJpdmVyKHByb3BzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgbG9nIGRyaXZlciBjb25maWd1cmF0aW9uIHRoYXQgc2VuZHMgbG9nIGluZm9ybWF0aW9uIHRvIGZsdWVudGQgTG9ncy5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZmx1ZW50ZChwcm9wcz86IEZsdWVudGRMb2dEcml2ZXJQcm9wcyk6IExvZ0RyaXZlciB7XG4gICAgcmV0dXJuIG5ldyBGbHVlbnRkTG9nRHJpdmVyKHByb3BzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgbG9nIGRyaXZlciBjb25maWd1cmF0aW9uIHRoYXQgc2VuZHMgbG9nIGluZm9ybWF0aW9uIHRvIGdlbGYgTG9ncy5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZ2VsZihwcm9wczogR2VsZkxvZ0RyaXZlclByb3BzKTogTG9nRHJpdmVyIHtcbiAgICByZXR1cm4gbmV3IEdlbGZMb2dEcml2ZXIocHJvcHMpO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBsb2cgZHJpdmVyIGNvbmZpZ3VyYXRpb24gdGhhdCBzZW5kcyBsb2cgaW5mb3JtYXRpb24gdG8gam91cm5hbGQgTG9ncy5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgam91cm5hbGQocHJvcHM/OiBKb3VybmFsZExvZ0RyaXZlclByb3BzKTogTG9nRHJpdmVyIHtcbiAgICByZXR1cm4gbmV3IEpvdXJuYWxkTG9nRHJpdmVyKHByb3BzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgbG9nIGRyaXZlciBjb25maWd1cmF0aW9uIHRoYXQgc2VuZHMgbG9nIGluZm9ybWF0aW9uIHRvIGpzb24tZmlsZSBMb2dzLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBqc29uRmlsZShwcm9wcz86IEpzb25GaWxlTG9nRHJpdmVyUHJvcHMpOiBMb2dEcml2ZXIge1xuICAgIHJldHVybiBuZXcgSnNvbkZpbGVMb2dEcml2ZXIocHJvcHMpO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBsb2cgZHJpdmVyIGNvbmZpZ3VyYXRpb24gdGhhdCBzZW5kcyBsb2cgaW5mb3JtYXRpb24gdG8gc3BsdW5rIExvZ3MuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHNwbHVuayhwcm9wczogU3BsdW5rTG9nRHJpdmVyUHJvcHMpOiBMb2dEcml2ZXIge1xuICAgIHJldHVybiBuZXcgU3BsdW5rTG9nRHJpdmVyKHByb3BzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgbG9nIGRyaXZlciBjb25maWd1cmF0aW9uIHRoYXQgc2VuZHMgbG9nIGluZm9ybWF0aW9uIHRvIHN5c2xvZyBMb2dzLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBzeXNsb2cocHJvcHM/OiBTeXNsb2dMb2dEcml2ZXJQcm9wcyk6IExvZ0RyaXZlciB7XG4gICAgcmV0dXJuIG5ldyBTeXNsb2dMb2dEcml2ZXIocHJvcHMpO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBsb2cgZHJpdmVyIGNvbmZpZ3VyYXRpb24gdGhhdCBzZW5kcyBsb2cgaW5mb3JtYXRpb24gdG8gZmlyZWxlbnMgbG9nIHJvdXRlci5cbiAgICogRm9yIGRldGFpbCBjb25maWd1cmF0aW9ucywgcGxlYXNlIHJlZmVyIHRvIEFtYXpvbiBFQ1MgRmlyZUxlbnMgRXhhbXBsZXM6XG4gICAqIGh0dHBzOi8vZ2l0aHViLmNvbS9hd3Mtc2FtcGxlcy9hbWF6b24tZWNzLWZpcmVsZW5zLWV4YW1wbGVzXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGZpcmVsZW5zKHByb3BzOiBGaXJlTGVuc0xvZ0RyaXZlclByb3BzKTogTG9nRHJpdmVyIHtcbiAgICByZXR1cm4gbmV3IEZpcmVMZW5zTG9nRHJpdmVyKHByb3BzKTtcbiAgfVxufVxuIl19