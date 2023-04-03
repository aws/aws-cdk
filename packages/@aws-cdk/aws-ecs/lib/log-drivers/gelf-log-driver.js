"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GelfLogDriver = exports.GelfCompressionType = void 0;
const jsiiDeprecationWarnings = require("../../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const log_driver_1 = require("./log-driver");
const utils_1 = require("./utils");
/**
 * The type of compression the GELF driver uses to compress each log message.
 */
var GelfCompressionType;
(function (GelfCompressionType) {
    GelfCompressionType["GZIP"] = "gzip";
    GelfCompressionType["ZLIB"] = "zlib";
    GelfCompressionType["NONE"] = "none";
})(GelfCompressionType = exports.GelfCompressionType || (exports.GelfCompressionType = {}));
/**
 * A log driver that sends log information to journald Logs.
 */
class GelfLogDriver extends log_driver_1.LogDriver {
    /**
     * Constructs a new instance of the GelfLogDriver class.
     *
     * @param props the gelf log driver configuration options.
     */
    constructor(props) {
        super();
        this.props = props;
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ecs_GelfLogDriverProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, GelfLogDriver);
            }
            throw error;
        }
        // Validation
        if (props.compressionLevel) {
            utils_1.ensureInRange(props.compressionLevel, -1, 9);
        }
        if (props.tcpMaxReconnect) {
            utils_1.ensurePositiveInteger(props.tcpMaxReconnect);
        }
    }
    /**
     * Called when the log driver is configured on a container
     */
    bind(_scope, _containerDefinition) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ecs_ContainerDefinition(_containerDefinition);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.bind);
            }
            throw error;
        }
        return {
            logDriver: 'gelf',
            options: utils_1.stringifyOptions({
                'gelf-address': this.props.address,
                'gelf-compression-type': this.props.compressionType,
                'gelf-compression-level': this.props.compressionLevel,
                'gelf-tcp-max-reconnect': this.props.tcpMaxReconnect,
                'gelf-tcp-reconnect-delay': this.props.tcpReconnectDelay && this.props.tcpReconnectDelay.toSeconds(),
                ...utils_1.renderCommonLogDriverOptions(this.props),
            }),
        };
    }
}
exports.GelfLogDriver = GelfLogDriver;
_a = JSII_RTTI_SYMBOL_1;
GelfLogDriver[_a] = { fqn: "@aws-cdk/aws-ecs.GelfLogDriver", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VsZi1sb2ctZHJpdmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZ2VsZi1sb2ctZHJpdmVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUdBLDZDQUEwRDtBQUMxRCxtQ0FBK0c7QUFHL0c7O0dBRUc7QUFDSCxJQUFZLG1CQUlYO0FBSkQsV0FBWSxtQkFBbUI7SUFDN0Isb0NBQWEsQ0FBQTtJQUNiLG9DQUFhLENBQUE7SUFDYixvQ0FBYSxDQUFBO0FBQ2YsQ0FBQyxFQUpXLG1CQUFtQixHQUFuQiwyQkFBbUIsS0FBbkIsMkJBQW1CLFFBSTlCO0FBZ0REOztHQUVHO0FBQ0gsTUFBYSxhQUFjLFNBQVEsc0JBQVM7SUFDMUM7Ozs7T0FJRztJQUNILFlBQTZCLEtBQXlCO1FBQ3BELEtBQUssRUFBRSxDQUFDO1FBRG1CLFVBQUssR0FBTCxLQUFLLENBQW9COzs7Ozs7K0NBTjNDLGFBQWE7Ozs7UUFTdEIsYUFBYTtRQUNiLElBQUksS0FBSyxDQUFDLGdCQUFnQixFQUFFO1lBQzFCLHFCQUFhLENBQUMsS0FBSyxDQUFDLGdCQUFnQixFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1NBQzlDO1FBRUQsSUFBSSxLQUFLLENBQUMsZUFBZSxFQUFFO1lBQ3pCLDZCQUFxQixDQUFDLEtBQUssQ0FBQyxlQUFlLENBQUMsQ0FBQztTQUM5QztLQUNGO0lBRUQ7O09BRUc7SUFDSSxJQUFJLENBQUMsTUFBaUIsRUFBRSxvQkFBeUM7Ozs7Ozs7Ozs7UUFDdEUsT0FBTztZQUNMLFNBQVMsRUFBRSxNQUFNO1lBQ2pCLE9BQU8sRUFBRSx3QkFBZ0IsQ0FBQztnQkFDeEIsY0FBYyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTztnQkFDbEMsdUJBQXVCLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxlQUFlO2dCQUNuRCx3QkFBd0IsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLGdCQUFnQjtnQkFDckQsd0JBQXdCLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxlQUFlO2dCQUNwRCwwQkFBMEIsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLGlCQUFpQixJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsaUJBQWlCLENBQUMsU0FBUyxFQUFFO2dCQUNwRyxHQUFHLG9DQUE0QixDQUFDLElBQUksQ0FBQyxLQUFLLENBQUM7YUFDNUMsQ0FBQztTQUNILENBQUM7S0FDSDs7QUFsQ0gsc0NBbUNDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRHVyYXRpb24gfSBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0IHsgQmFzZUxvZ0RyaXZlclByb3BzIH0gZnJvbSAnLi9iYXNlLWxvZy1kcml2ZXInO1xuaW1wb3J0IHsgTG9nRHJpdmVyLCBMb2dEcml2ZXJDb25maWcgfSBmcm9tICcuL2xvZy1kcml2ZXInO1xuaW1wb3J0IHsgZW5zdXJlSW5SYW5nZSwgZW5zdXJlUG9zaXRpdmVJbnRlZ2VyLCByZW5kZXJDb21tb25Mb2dEcml2ZXJPcHRpb25zLCBzdHJpbmdpZnlPcHRpb25zIH0gZnJvbSAnLi91dGlscyc7XG5pbXBvcnQgeyBDb250YWluZXJEZWZpbml0aW9uIH0gZnJvbSAnLi4vY29udGFpbmVyLWRlZmluaXRpb24nO1xuXG4vKipcbiAqIFRoZSB0eXBlIG9mIGNvbXByZXNzaW9uIHRoZSBHRUxGIGRyaXZlciB1c2VzIHRvIGNvbXByZXNzIGVhY2ggbG9nIG1lc3NhZ2UuXG4gKi9cbmV4cG9ydCBlbnVtIEdlbGZDb21wcmVzc2lvblR5cGUge1xuICBHWklQID0gJ2d6aXAnLFxuICBaTElCID0gJ3psaWInLFxuICBOT05FID0gJ25vbmUnXG59XG5cbi8qKlxuICogU3BlY2lmaWVzIHRoZSBqb3VybmFsZCBsb2cgZHJpdmVyIGNvbmZpZ3VyYXRpb24gb3B0aW9ucy5cbiAqXG4gKiBbU291cmNlXShodHRwczovL2RvY3MuZG9ja2VyLmNvbS9jb25maWcvY29udGFpbmVycy9sb2dnaW5nL2dlbGYvKVxuICovXG5leHBvcnQgaW50ZXJmYWNlIEdlbGZMb2dEcml2ZXJQcm9wcyBleHRlbmRzIEJhc2VMb2dEcml2ZXJQcm9wcyB7XG4gIC8qKlxuICAgKiBUaGUgYWRkcmVzcyBvZiB0aGUgR0VMRiBzZXJ2ZXIuIHRjcCBhbmQgdWRwIGFyZSB0aGUgb25seSBzdXBwb3J0ZWQgVVJJXG4gICAqIHNwZWNpZmllciBhbmQgeW91IG11c3Qgc3BlY2lmeSB0aGUgcG9ydC5cbiAgICovXG4gIHJlYWRvbmx5IGFkZHJlc3M6IHN0cmluZztcblxuICAvKipcbiAgICogVURQIE9ubHkgVGhlIHR5cGUgb2YgY29tcHJlc3Npb24gdGhlIEdFTEYgZHJpdmVyIHVzZXMgdG8gY29tcHJlc3MgZWFjaFxuICAgKiBsb2cgbWVzc2FnZS4gQWxsb3dlZCB2YWx1ZXMgYXJlIGd6aXAsIHpsaWIgYW5kIG5vbmUuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gZ3ppcFxuICAgKi9cbiAgcmVhZG9ubHkgY29tcHJlc3Npb25UeXBlPzogR2VsZkNvbXByZXNzaW9uVHlwZTtcblxuICAvKipcbiAgICogVURQIE9ubHkgVGhlIGxldmVsIG9mIGNvbXByZXNzaW9uIHdoZW4gZ3ppcCBvciB6bGliIGlzIHRoZSBnZWxmLWNvbXByZXNzaW9uLXR5cGUuXG4gICAqIEFuIGludGVnZXIgaW4gdGhlIHJhbmdlIG9mIC0xIHRvIDkgKEJlc3RDb21wcmVzc2lvbikuIEhpZ2hlciBsZXZlbHMgcHJvdmlkZSBtb3JlXG4gICAqIGNvbXByZXNzaW9uIGF0IGxvd2VyIHNwZWVkLiBFaXRoZXIgLTEgb3IgMCBkaXNhYmxlcyBjb21wcmVzc2lvbi5cbiAgICpcbiAgICogQGRlZmF1bHQgLSAxXG4gICAqL1xuICByZWFkb25seSBjb21wcmVzc2lvbkxldmVsPzogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBUQ1AgT25seSBUaGUgbWF4aW11bSBudW1iZXIgb2YgcmVjb25uZWN0aW9uIGF0dGVtcHRzIHdoZW4gdGhlIGNvbm5lY3Rpb24gZHJvcC5cbiAgICogQSBwb3NpdGl2ZSBpbnRlZ2VyLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIDNcbiAgICovXG4gIHJlYWRvbmx5IHRjcE1heFJlY29ubmVjdD86IG51bWJlcjtcblxuICAvKipcbiAgICogVENQIE9ubHkgVGhlIG51bWJlciBvZiBzZWNvbmRzIHRvIHdhaXQgYmV0d2VlbiByZWNvbm5lY3Rpb24gYXR0ZW1wdHMuXG4gICAqIEEgcG9zaXRpdmUgaW50ZWdlci5cbiAgICpcbiAgICogQGRlZmF1bHQgLSAxXG4gICAqL1xuICByZWFkb25seSB0Y3BSZWNvbm5lY3REZWxheT86IER1cmF0aW9uO1xufVxuXG4vKipcbiAqIEEgbG9nIGRyaXZlciB0aGF0IHNlbmRzIGxvZyBpbmZvcm1hdGlvbiB0byBqb3VybmFsZCBMb2dzLlxuICovXG5leHBvcnQgY2xhc3MgR2VsZkxvZ0RyaXZlciBleHRlbmRzIExvZ0RyaXZlciB7XG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RzIGEgbmV3IGluc3RhbmNlIG9mIHRoZSBHZWxmTG9nRHJpdmVyIGNsYXNzLlxuICAgKlxuICAgKiBAcGFyYW0gcHJvcHMgdGhlIGdlbGYgbG9nIGRyaXZlciBjb25maWd1cmF0aW9uIG9wdGlvbnMuXG4gICAqL1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IHByb3BzOiBHZWxmTG9nRHJpdmVyUHJvcHMpIHtcbiAgICBzdXBlcigpO1xuXG4gICAgLy8gVmFsaWRhdGlvblxuICAgIGlmIChwcm9wcy5jb21wcmVzc2lvbkxldmVsKSB7XG4gICAgICBlbnN1cmVJblJhbmdlKHByb3BzLmNvbXByZXNzaW9uTGV2ZWwsIC0xLCA5KTtcbiAgICB9XG5cbiAgICBpZiAocHJvcHMudGNwTWF4UmVjb25uZWN0KSB7XG4gICAgICBlbnN1cmVQb3NpdGl2ZUludGVnZXIocHJvcHMudGNwTWF4UmVjb25uZWN0KTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ2FsbGVkIHdoZW4gdGhlIGxvZyBkcml2ZXIgaXMgY29uZmlndXJlZCBvbiBhIGNvbnRhaW5lclxuICAgKi9cbiAgcHVibGljIGJpbmQoX3Njb3BlOiBDb25zdHJ1Y3QsIF9jb250YWluZXJEZWZpbml0aW9uOiBDb250YWluZXJEZWZpbml0aW9uKTogTG9nRHJpdmVyQ29uZmlnIHtcbiAgICByZXR1cm4ge1xuICAgICAgbG9nRHJpdmVyOiAnZ2VsZicsXG4gICAgICBvcHRpb25zOiBzdHJpbmdpZnlPcHRpb25zKHtcbiAgICAgICAgJ2dlbGYtYWRkcmVzcyc6IHRoaXMucHJvcHMuYWRkcmVzcyxcbiAgICAgICAgJ2dlbGYtY29tcHJlc3Npb24tdHlwZSc6IHRoaXMucHJvcHMuY29tcHJlc3Npb25UeXBlLFxuICAgICAgICAnZ2VsZi1jb21wcmVzc2lvbi1sZXZlbCc6IHRoaXMucHJvcHMuY29tcHJlc3Npb25MZXZlbCxcbiAgICAgICAgJ2dlbGYtdGNwLW1heC1yZWNvbm5lY3QnOiB0aGlzLnByb3BzLnRjcE1heFJlY29ubmVjdCxcbiAgICAgICAgJ2dlbGYtdGNwLXJlY29ubmVjdC1kZWxheSc6IHRoaXMucHJvcHMudGNwUmVjb25uZWN0RGVsYXkgJiYgdGhpcy5wcm9wcy50Y3BSZWNvbm5lY3REZWxheS50b1NlY29uZHMoKSxcbiAgICAgICAgLi4ucmVuZGVyQ29tbW9uTG9nRHJpdmVyT3B0aW9ucyh0aGlzLnByb3BzKSxcbiAgICAgIH0pLFxuICAgIH07XG4gIH1cbn1cbiJdfQ==