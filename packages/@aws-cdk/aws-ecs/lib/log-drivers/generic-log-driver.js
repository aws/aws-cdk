"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenericLogDriver = void 0;
const jsiiDeprecationWarnings = require("../../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const log_driver_1 = require("./log-driver");
const utils_1 = require("./utils");
/**
 * A log driver that sends logs to the specified driver.
 */
class GenericLogDriver extends log_driver_1.LogDriver {
    /**
     * Constructs a new instance of the GenericLogDriver class.
     *
     * @param props the generic log driver configuration options.
     */
    constructor(props) {
        super();
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ecs_GenericLogDriverProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, GenericLogDriver);
            }
            throw error;
        }
        this.logDriver = props.logDriver;
        this.options = props.options || {};
        this.secretOptions = props.secretOptions;
    }
    /**
     * Called when the log driver is configured on a container.
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
            logDriver: this.logDriver,
            options: utils_1.removeEmpty(this.options),
            secretOptions: this.secretOptions && utils_1.renderLogDriverSecretOptions(this.secretOptions, _containerDefinition.taskDefinition),
        };
    }
}
exports.GenericLogDriver = GenericLogDriver;
_a = JSII_RTTI_SYMBOL_1;
GenericLogDriver[_a] = { fqn: "@aws-cdk/aws-ecs.GenericLogDriver", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJpYy1sb2ctZHJpdmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZ2VuZXJpYy1sb2ctZHJpdmVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUNBLDZDQUEwRDtBQUMxRCxtQ0FBb0U7QUFpQ3BFOztHQUVHO0FBQ0gsTUFBYSxnQkFBaUIsU0FBUSxzQkFBUztJQXNCN0M7Ozs7T0FJRztJQUNILFlBQVksS0FBNEI7UUFDdEMsS0FBSyxFQUFFLENBQUM7Ozs7OzsrQ0E1QkMsZ0JBQWdCOzs7O1FBOEJ6QixJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUM7UUFDakMsSUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUMsT0FBTyxJQUFJLEVBQUUsQ0FBQztRQUNuQyxJQUFJLENBQUMsYUFBYSxHQUFHLEtBQUssQ0FBQyxhQUFhLENBQUM7S0FDMUM7SUFFRDs7T0FFRztJQUNJLElBQUksQ0FBQyxNQUFpQixFQUFFLG9CQUF5Qzs7Ozs7Ozs7OztRQUN0RSxPQUFPO1lBQ0wsU0FBUyxFQUFFLElBQUksQ0FBQyxTQUFTO1lBQ3pCLE9BQU8sRUFBRSxtQkFBVyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUM7WUFDbEMsYUFBYSxFQUFFLElBQUksQ0FBQyxhQUFhLElBQUksb0NBQTRCLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxvQkFBb0IsQ0FBQyxjQUFjLENBQUM7U0FDM0gsQ0FBQztLQUNIOztBQTVDSCw0Q0E2Q0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCB7IExvZ0RyaXZlciwgTG9nRHJpdmVyQ29uZmlnIH0gZnJvbSAnLi9sb2ctZHJpdmVyJztcbmltcG9ydCB7IHJlbW92ZUVtcHR5LCByZW5kZXJMb2dEcml2ZXJTZWNyZXRPcHRpb25zIH0gZnJvbSAnLi91dGlscyc7XG5pbXBvcnQgeyBDb250YWluZXJEZWZpbml0aW9uLCBTZWNyZXQgfSBmcm9tICcuLi9jb250YWluZXItZGVmaW5pdGlvbic7XG5cbi8qKlxuICogVGhlIGNvbmZpZ3VyYXRpb24gdG8gdXNlIHdoZW4gY3JlYXRpbmcgYSBsb2cgZHJpdmVyLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIEdlbmVyaWNMb2dEcml2ZXJQcm9wcyB7XG4gIC8qKlxuICAgKiBUaGUgbG9nIGRyaXZlciB0byB1c2UgZm9yIHRoZSBjb250YWluZXIuIFRoZSB2YWxpZCB2YWx1ZXMgbGlzdGVkIGZvciB0aGlzIHBhcmFtZXRlciBhcmUgbG9nIGRyaXZlcnNcbiAgICogdGhhdCB0aGUgQW1hem9uIEVDUyBjb250YWluZXIgYWdlbnQgY2FuIGNvbW11bmljYXRlIHdpdGggYnkgZGVmYXVsdC5cbiAgICpcbiAgICogRm9yIHRhc2tzIHVzaW5nIHRoZSBGYXJnYXRlIGxhdW5jaCB0eXBlLCB0aGUgc3VwcG9ydGVkIGxvZyBkcml2ZXJzIGFyZSBhd3Nsb2dzIGFuZCBzcGx1bmsuXG4gICAqIEZvciB0YXNrcyB1c2luZyB0aGUgRUMyIGxhdW5jaCB0eXBlLCB0aGUgc3VwcG9ydGVkIGxvZyBkcml2ZXJzIGFyZSBhd3Nsb2dzLCBzeXNsb2csIGdlbGYsIGZsdWVudGQsIHNwbHVuaywgam91cm5hbGQsIGFuZCBqc29uLWZpbGUuXG4gICAqXG4gICAqIEZvciBtb3JlIGluZm9ybWF0aW9uIGFib3V0IHVzaW5nIHRoZSBhd3Nsb2dzIGxvZyBkcml2ZXIsIHNlZVxuICAgKiBbVXNpbmcgdGhlIGF3c2xvZ3MgTG9nIERyaXZlcl0oaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FtYXpvbkVDUy9sYXRlc3QvZGV2ZWxvcGVyZ3VpZGUvdXNpbmdfYXdzbG9ncy5odG1sKVxuICAgKiBpbiB0aGUgQW1hem9uIEVsYXN0aWMgQ29udGFpbmVyIFNlcnZpY2UgRGV2ZWxvcGVyIEd1aWRlLlxuICAgKi9cbiAgcmVhZG9ubHkgbG9nRHJpdmVyOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBjb25maWd1cmF0aW9uIG9wdGlvbnMgdG8gc2VuZCB0byB0aGUgbG9nIGRyaXZlci5cbiAgICogQGRlZmF1bHQgLSB0aGUgbG9nIGRyaXZlciBvcHRpb25zLlxuICAgKi9cbiAgcmVhZG9ubHkgb3B0aW9ucz86IHsgW2tleTogc3RyaW5nXTogc3RyaW5nIH07XG5cbiAgLyoqXG4gICAqIFRoZSBzZWNyZXRzIHRvIHBhc3MgdG8gdGhlIGxvZyBjb25maWd1cmF0aW9uLlxuICAgKiBAZGVmYXVsdCAtIG5vIHNlY3JldCBvcHRpb25zIHByb3ZpZGVkLlxuICAgKi9cbiAgcmVhZG9ubHkgc2VjcmV0T3B0aW9ucz86IHsgW2tleTogc3RyaW5nXTogU2VjcmV0IH07XG59XG5cbi8qKlxuICogQSBsb2cgZHJpdmVyIHRoYXQgc2VuZHMgbG9ncyB0byB0aGUgc3BlY2lmaWVkIGRyaXZlci5cbiAqL1xuZXhwb3J0IGNsYXNzIEdlbmVyaWNMb2dEcml2ZXIgZXh0ZW5kcyBMb2dEcml2ZXIge1xuICAvKipcbiAgICogVGhlIGxvZyBkcml2ZXIgdG8gdXNlIGZvciB0aGUgY29udGFpbmVyLiBUaGUgdmFsaWQgdmFsdWVzIGxpc3RlZCBmb3IgdGhpcyBwYXJhbWV0ZXIgYXJlIGxvZyBkcml2ZXJzXG4gICAqIHRoYXQgdGhlIEFtYXpvbiBFQ1MgY29udGFpbmVyIGFnZW50IGNhbiBjb21tdW5pY2F0ZSB3aXRoIGJ5IGRlZmF1bHQuIFlvdSBjYW5ub3QgdXNlIGF3c2xvZ3Mgd2l0aCB0aGUgR2VuZXJpY0xvZ0RyaXZlci5cbiAgICogWW91IG11c3QgdXNlIHRoZSBBd3NMb2dEcml2ZXIgaWYgeW91IHdhbnQgdG8gdXNlIGF3c2xvZ3MuXG4gICAqXG4gICAqIEZvciB0YXNrcyB1c2luZyB0aGUgRmFyZ2F0ZSBsYXVuY2ggdHlwZSwgdGhlIHN1cHBvcnRlZCBsb2cgZHJpdmVycyBhcmUgYXdzbG9ncyBhbmQgc3BsdW5rLlxuICAgKiBGb3IgdGFza3MgdXNpbmcgdGhlIEVDMiBsYXVuY2ggdHlwZSwgdGhlIHN1cHBvcnRlZCBsb2cgZHJpdmVycyBhcmUgYXdzbG9ncywgc3lzbG9nLCBnZWxmLCBmbHVlbnRkLCBzcGx1bmssIGpvdXJuYWxkLCBhbmQganNvbi1maWxlLlxuICAgKlxuICAgKi9cbiAgcHJpdmF0ZSBsb2dEcml2ZXI6IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIGNvbmZpZ3VyYXRpb24gb3B0aW9ucyB0byBzZW5kIHRvIHRoZSBsb2cgZHJpdmVyLlxuICAgKi9cbiAgcHJpdmF0ZSBvcHRpb25zOiB7IFtrZXk6IHN0cmluZ106IHN0cmluZyB9O1xuXG4gIC8qKlxuICAgKiBUaGUgc2VjcmV0cyB0byBwYXNzIHRvIHRoZSBsb2cgY29uZmlndXJhdGlvbi5cbiAgICovXG4gIHByaXZhdGUgc2VjcmV0T3B0aW9ucz86IHsgW2tleTogc3RyaW5nXTogU2VjcmV0IH07XG5cbiAgLyoqXG4gICAqIENvbnN0cnVjdHMgYSBuZXcgaW5zdGFuY2Ugb2YgdGhlIEdlbmVyaWNMb2dEcml2ZXIgY2xhc3MuXG4gICAqXG4gICAqIEBwYXJhbSBwcm9wcyB0aGUgZ2VuZXJpYyBsb2cgZHJpdmVyIGNvbmZpZ3VyYXRpb24gb3B0aW9ucy5cbiAgICovXG4gIGNvbnN0cnVjdG9yKHByb3BzOiBHZW5lcmljTG9nRHJpdmVyUHJvcHMpIHtcbiAgICBzdXBlcigpO1xuXG4gICAgdGhpcy5sb2dEcml2ZXIgPSBwcm9wcy5sb2dEcml2ZXI7XG4gICAgdGhpcy5vcHRpb25zID0gcHJvcHMub3B0aW9ucyB8fCB7fTtcbiAgICB0aGlzLnNlY3JldE9wdGlvbnMgPSBwcm9wcy5zZWNyZXRPcHRpb25zO1xuICB9XG5cbiAgLyoqXG4gICAqIENhbGxlZCB3aGVuIHRoZSBsb2cgZHJpdmVyIGlzIGNvbmZpZ3VyZWQgb24gYSBjb250YWluZXIuXG4gICAqL1xuICBwdWJsaWMgYmluZChfc2NvcGU6IENvbnN0cnVjdCwgX2NvbnRhaW5lckRlZmluaXRpb246IENvbnRhaW5lckRlZmluaXRpb24pOiBMb2dEcml2ZXJDb25maWcge1xuICAgIHJldHVybiB7XG4gICAgICBsb2dEcml2ZXI6IHRoaXMubG9nRHJpdmVyLFxuICAgICAgb3B0aW9uczogcmVtb3ZlRW1wdHkodGhpcy5vcHRpb25zKSxcbiAgICAgIHNlY3JldE9wdGlvbnM6IHRoaXMuc2VjcmV0T3B0aW9ucyAmJiByZW5kZXJMb2dEcml2ZXJTZWNyZXRPcHRpb25zKHRoaXMuc2VjcmV0T3B0aW9ucywgX2NvbnRhaW5lckRlZmluaXRpb24udGFza0RlZmluaXRpb24pLFxuICAgIH07XG4gIH1cbn1cbiJdfQ==