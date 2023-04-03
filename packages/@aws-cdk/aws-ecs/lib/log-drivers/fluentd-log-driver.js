"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FluentdLogDriver = void 0;
const jsiiDeprecationWarnings = require("../../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const log_driver_1 = require("./log-driver");
const utils_1 = require("./utils");
/**
 * A log driver that sends log information to journald Logs.
 */
class FluentdLogDriver extends log_driver_1.LogDriver {
    /**
     * Constructs a new instance of the FluentdLogDriver class.
     *
     * @param props the fluentd log driver configuration options.
     */
    constructor(props = {}) {
        super();
        this.props = props;
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ecs_FluentdLogDriverProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, FluentdLogDriver);
            }
            throw error;
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
            logDriver: 'fluentd',
            options: utils_1.stringifyOptions({
                'fluentd-address': this.props.address,
                'fluentd-async-connect': this.props.asyncConnect,
                'fluentd-buffer-limit': this.props.bufferLimit,
                'fluentd-retry-wait': this.props.retryWait && this.props.retryWait.toSeconds(),
                'fluentd-max-retries': this.props.maxRetries,
                'fluentd-sub-second-precision': this.props.subSecondPrecision,
                ...utils_1.renderCommonLogDriverOptions(this.props),
            }),
        };
    }
}
exports.FluentdLogDriver = FluentdLogDriver;
_a = JSII_RTTI_SYMBOL_1;
FluentdLogDriver[_a] = { fqn: "@aws-cdk/aws-ecs.FluentdLogDriver", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmx1ZW50ZC1sb2ctZHJpdmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZmx1ZW50ZC1sb2ctZHJpdmVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUdBLDZDQUEwRDtBQUMxRCxtQ0FBeUU7QUF1RHpFOztHQUVHO0FBQ0gsTUFBYSxnQkFBaUIsU0FBUSxzQkFBUztJQUM3Qzs7OztPQUlHO0lBQ0gsWUFBNkIsUUFBK0IsRUFBRTtRQUM1RCxLQUFLLEVBQUUsQ0FBQztRQURtQixVQUFLLEdBQUwsS0FBSyxDQUE0Qjs7Ozs7OytDQU5uRCxnQkFBZ0I7Ozs7S0FRMUI7SUFFRDs7T0FFRztJQUNJLElBQUksQ0FBQyxNQUFpQixFQUFFLG9CQUF5Qzs7Ozs7Ozs7OztRQUN0RSxPQUFPO1lBQ0wsU0FBUyxFQUFFLFNBQVM7WUFDcEIsT0FBTyxFQUFFLHdCQUFnQixDQUFDO2dCQUN4QixpQkFBaUIsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU87Z0JBQ3JDLHVCQUF1QixFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsWUFBWTtnQkFDaEQsc0JBQXNCLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXO2dCQUM5QyxvQkFBb0IsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxTQUFTLEVBQUU7Z0JBQzlFLHFCQUFxQixFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVTtnQkFDNUMsOEJBQThCLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxrQkFBa0I7Z0JBQzdELEdBQUcsb0NBQTRCLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQzthQUM1QyxDQUFDO1NBQ0gsQ0FBQztLQUNIOztBQTFCSCw0Q0EyQkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBEdXJhdGlvbiB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgeyBCYXNlTG9nRHJpdmVyUHJvcHMgfSBmcm9tICcuL2Jhc2UtbG9nLWRyaXZlcic7XG5pbXBvcnQgeyBMb2dEcml2ZXIsIExvZ0RyaXZlckNvbmZpZyB9IGZyb20gJy4vbG9nLWRyaXZlcic7XG5pbXBvcnQgeyByZW5kZXJDb21tb25Mb2dEcml2ZXJPcHRpb25zLCBzdHJpbmdpZnlPcHRpb25zIH0gZnJvbSAnLi91dGlscyc7XG5pbXBvcnQgeyBDb250YWluZXJEZWZpbml0aW9uIH0gZnJvbSAnLi4vY29udGFpbmVyLWRlZmluaXRpb24nO1xuXG4vKipcbiAqIFNwZWNpZmllcyB0aGUgZmx1ZW50ZCBsb2cgZHJpdmVyIGNvbmZpZ3VyYXRpb24gb3B0aW9ucy5cbiAqXG4gKiBbU291cmNlXShodHRwczovL2RvY3MuZG9ja2VyLmNvbS9jb25maWcvY29udGFpbmVycy9sb2dnaW5nL2ZsdWVudGQvKVxuICovXG5leHBvcnQgaW50ZXJmYWNlIEZsdWVudGRMb2dEcml2ZXJQcm9wcyBleHRlbmRzIEJhc2VMb2dEcml2ZXJQcm9wcyB7XG4gIC8qKlxuICAgKiBCeSBkZWZhdWx0LCB0aGUgbG9nZ2luZyBkcml2ZXIgY29ubmVjdHMgdG8gbG9jYWxob3N0OjI0MjI0LiBTdXBwbHkgdGhlXG4gICAqIGFkZHJlc3Mgb3B0aW9uIHRvIGNvbm5lY3QgdG8gYSBkaWZmZXJlbnQgYWRkcmVzcy4gdGNwKGRlZmF1bHQpIGFuZCB1bml4XG4gICAqIHNvY2tldHMgYXJlIHN1cHBvcnRlZC5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBhZGRyZXNzIG5vdCBzZXQuXG4gICAqL1xuICByZWFkb25seSBhZGRyZXNzPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBEb2NrZXIgY29ubmVjdHMgdG8gRmx1ZW50ZCBpbiB0aGUgYmFja2dyb3VuZC4gTWVzc2FnZXMgYXJlIGJ1ZmZlcmVkIHVudGlsXG4gICAqIHRoZSBjb25uZWN0aW9uIGlzIGVzdGFibGlzaGVkLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIGZhbHNlXG4gICAqL1xuICByZWFkb25seSBhc3luY0Nvbm5lY3Q/OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBUaGUgYW1vdW50IG9mIGRhdGEgdG8gYnVmZmVyIGJlZm9yZSBmbHVzaGluZyB0byBkaXNrLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIFRoZSBhbW91bnQgb2YgUkFNIGF2YWlsYWJsZSB0byB0aGUgY29udGFpbmVyLlxuICAgKi9cbiAgcmVhZG9ubHkgYnVmZmVyTGltaXQ/OiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIEhvdyBsb25nIHRvIHdhaXQgYmV0d2VlbiByZXRyaWVzLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIDEgc2Vjb25kXG4gICAqL1xuICByZWFkb25seSByZXRyeVdhaXQ/OiBEdXJhdGlvbjtcblxuICAvKipcbiAgICogVGhlIG1heGltdW0gbnVtYmVyIG9mIHJldHJpZXMuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gNDI5NDk2NzI5NSAoMioqMzIgLSAxKS5cbiAgICovXG4gIHJlYWRvbmx5IG1heFJldHJpZXM/OiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIEdlbmVyYXRlcyBldmVudCBsb2dzIGluIG5hbm9zZWNvbmQgcmVzb2x1dGlvbi5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBmYWxzZVxuICAgKi9cbiAgcmVhZG9ubHkgc3ViU2Vjb25kUHJlY2lzaW9uPzogYm9vbGVhbjtcbn1cblxuLyoqXG4gKiBBIGxvZyBkcml2ZXIgdGhhdCBzZW5kcyBsb2cgaW5mb3JtYXRpb24gdG8gam91cm5hbGQgTG9ncy5cbiAqL1xuZXhwb3J0IGNsYXNzIEZsdWVudGRMb2dEcml2ZXIgZXh0ZW5kcyBMb2dEcml2ZXIge1xuICAvKipcbiAgICogQ29uc3RydWN0cyBhIG5ldyBpbnN0YW5jZSBvZiB0aGUgRmx1ZW50ZExvZ0RyaXZlciBjbGFzcy5cbiAgICpcbiAgICogQHBhcmFtIHByb3BzIHRoZSBmbHVlbnRkIGxvZyBkcml2ZXIgY29uZmlndXJhdGlvbiBvcHRpb25zLlxuICAgKi9cbiAgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSBwcm9wczogRmx1ZW50ZExvZ0RyaXZlclByb3BzID0ge30pIHtcbiAgICBzdXBlcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIENhbGxlZCB3aGVuIHRoZSBsb2cgZHJpdmVyIGlzIGNvbmZpZ3VyZWQgb24gYSBjb250YWluZXJcbiAgICovXG4gIHB1YmxpYyBiaW5kKF9zY29wZTogQ29uc3RydWN0LCBfY29udGFpbmVyRGVmaW5pdGlvbjogQ29udGFpbmVyRGVmaW5pdGlvbik6IExvZ0RyaXZlckNvbmZpZyB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGxvZ0RyaXZlcjogJ2ZsdWVudGQnLFxuICAgICAgb3B0aW9uczogc3RyaW5naWZ5T3B0aW9ucyh7XG4gICAgICAgICdmbHVlbnRkLWFkZHJlc3MnOiB0aGlzLnByb3BzLmFkZHJlc3MsXG4gICAgICAgICdmbHVlbnRkLWFzeW5jLWNvbm5lY3QnOiB0aGlzLnByb3BzLmFzeW5jQ29ubmVjdCxcbiAgICAgICAgJ2ZsdWVudGQtYnVmZmVyLWxpbWl0JzogdGhpcy5wcm9wcy5idWZmZXJMaW1pdCxcbiAgICAgICAgJ2ZsdWVudGQtcmV0cnktd2FpdCc6IHRoaXMucHJvcHMucmV0cnlXYWl0ICYmIHRoaXMucHJvcHMucmV0cnlXYWl0LnRvU2Vjb25kcygpLFxuICAgICAgICAnZmx1ZW50ZC1tYXgtcmV0cmllcyc6IHRoaXMucHJvcHMubWF4UmV0cmllcyxcbiAgICAgICAgJ2ZsdWVudGQtc3ViLXNlY29uZC1wcmVjaXNpb24nOiB0aGlzLnByb3BzLnN1YlNlY29uZFByZWNpc2lvbixcbiAgICAgICAgLi4ucmVuZGVyQ29tbW9uTG9nRHJpdmVyT3B0aW9ucyh0aGlzLnByb3BzKSxcbiAgICAgIH0pLFxuICAgIH07XG4gIH1cbn1cbiJdfQ==