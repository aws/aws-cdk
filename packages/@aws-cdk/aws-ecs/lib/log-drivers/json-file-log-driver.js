"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonFileLogDriver = void 0;
const jsiiDeprecationWarnings = require("../../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const log_driver_1 = require("./log-driver");
const utils_1 = require("./utils");
/**
 * A log driver that sends log information to json-file Logs.
 */
class JsonFileLogDriver extends log_driver_1.LogDriver {
    /**
     * Constructs a new instance of the JsonFileLogDriver class.
     *
     * @param props the json-file log driver configuration options.
     */
    constructor(props = {}) {
        super();
        this.props = props;
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ecs_JsonFileLogDriverProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, JsonFileLogDriver);
            }
            throw error;
        }
        // Validation
        if (props.maxFile && props.maxFile < 0) {
            throw new Error('`maxFile` must be a positive integer.');
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
            logDriver: 'json-file',
            options: utils_1.stringifyOptions({
                'max-size': this.props.maxSize,
                'max-file': this.props.maxFile,
                'compress': this.props.compress,
                'labels': utils_1.joinWithCommas(this.props.labels),
                'env': utils_1.joinWithCommas(this.props.env),
                'env-regex': this.props.envRegex,
            }),
        };
    }
}
exports.JsonFileLogDriver = JsonFileLogDriver;
_a = JSII_RTTI_SYMBOL_1;
JsonFileLogDriver[_a] = { fqn: "@aws-cdk/aws-ecs.JsonFileLogDriver", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianNvbi1maWxlLWxvZy1kcml2ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJqc29uLWZpbGUtbG9nLWRyaXZlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFFQSw2Q0FBMEQ7QUFDMUQsbUNBQTJEO0FBa0MzRDs7R0FFRztBQUNILE1BQWEsaUJBQWtCLFNBQVEsc0JBQVM7SUFDOUM7Ozs7T0FJRztJQUNILFlBQTZCLFFBQWdDLEVBQUU7UUFDN0QsS0FBSyxFQUFFLENBQUM7UUFEbUIsVUFBSyxHQUFMLEtBQUssQ0FBNkI7Ozs7OzsrQ0FOcEQsaUJBQWlCOzs7O1FBUzFCLGFBQWE7UUFDYixJQUFJLEtBQUssQ0FBQyxPQUFPLElBQUksS0FBSyxDQUFDLE9BQU8sR0FBRyxDQUFDLEVBQUU7WUFDdEMsTUFBTSxJQUFJLEtBQUssQ0FBQyx1Q0FBdUMsQ0FBQyxDQUFDO1NBQzFEO0tBQ0Y7SUFFRDs7T0FFRztJQUNJLElBQUksQ0FBQyxNQUFpQixFQUFFLG9CQUF5Qzs7Ozs7Ozs7OztRQUN0RSxPQUFPO1lBQ0wsU0FBUyxFQUFFLFdBQVc7WUFDdEIsT0FBTyxFQUFFLHdCQUFnQixDQUFDO2dCQUN4QixVQUFVLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPO2dCQUM5QixVQUFVLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPO2dCQUM5QixVQUFVLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRO2dCQUMvQixRQUFRLEVBQUUsc0JBQWMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQztnQkFDM0MsS0FBSyxFQUFFLHNCQUFjLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUM7Z0JBQ3JDLFdBQVcsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVE7YUFDakMsQ0FBQztTQUNILENBQUM7S0FDSDs7QUE5QkgsOENBK0JDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgeyBCYXNlTG9nRHJpdmVyUHJvcHMgfSBmcm9tICcuL2Jhc2UtbG9nLWRyaXZlcic7XG5pbXBvcnQgeyBMb2dEcml2ZXIsIExvZ0RyaXZlckNvbmZpZyB9IGZyb20gJy4vbG9nLWRyaXZlcic7XG5pbXBvcnQgeyBqb2luV2l0aENvbW1hcywgc3RyaW5naWZ5T3B0aW9ucyB9IGZyb20gJy4vdXRpbHMnO1xuaW1wb3J0IHsgQ29udGFpbmVyRGVmaW5pdGlvbiB9IGZyb20gJy4uL2NvbnRhaW5lci1kZWZpbml0aW9uJztcblxuLyoqXG4gKiBTcGVjaWZpZXMgdGhlIGpzb24tZmlsZSBsb2cgZHJpdmVyIGNvbmZpZ3VyYXRpb24gb3B0aW9ucy5cbiAqXG4gKiBbU291cmNlXShodHRwczovL2RvY3MuZG9ja2VyLmNvbS9jb25maWcvY29udGFpbmVycy9sb2dnaW5nL2pzb24tZmlsZS8pXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgSnNvbkZpbGVMb2dEcml2ZXJQcm9wcyBleHRlbmRzIEJhc2VMb2dEcml2ZXJQcm9wcyB7XG4gIC8qKlxuICAgKiBUaGUgbWF4aW11bSBzaXplIG9mIHRoZSBsb2cgYmVmb3JlIGl0IGlzIHJvbGxlZC4gQSBwb3NpdGl2ZSBpbnRlZ2VyIHBsdXMgYSBtb2RpZmllclxuICAgKiByZXByZXNlbnRpbmcgdGhlIHVuaXQgb2YgbWVhc3VyZSAoaywgbSwgb3IgZykuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gLTEgKHVubGltaXRlZClcbiAgICovXG4gIHJlYWRvbmx5IG1heFNpemU/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBtYXhpbXVtIG51bWJlciBvZiBsb2cgZmlsZXMgdGhhdCBjYW4gYmUgcHJlc2VudC4gSWYgcm9sbGluZyB0aGUgbG9ncyBjcmVhdGVzXG4gICAqIGV4Y2VzcyBmaWxlcywgdGhlIG9sZGVzdCBmaWxlIGlzIHJlbW92ZWQuIE9ubHkgZWZmZWN0aXZlIHdoZW4gbWF4LXNpemUgaXMgYWxzbyBzZXQuXG4gICAqIEEgcG9zaXRpdmUgaW50ZWdlci5cbiAgICpcbiAgICogQGRlZmF1bHQgLSAxXG4gICAqL1xuICByZWFkb25seSBtYXhGaWxlPzogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBUb2dnbGVzIGNvbXByZXNzaW9uIGZvciByb3RhdGVkIGxvZ3MuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gZmFsc2VcbiAgICovXG4gIHJlYWRvbmx5IGNvbXByZXNzPzogYm9vbGVhbjtcbn1cblxuLyoqXG4gKiBBIGxvZyBkcml2ZXIgdGhhdCBzZW5kcyBsb2cgaW5mb3JtYXRpb24gdG8ganNvbi1maWxlIExvZ3MuXG4gKi9cbmV4cG9ydCBjbGFzcyBKc29uRmlsZUxvZ0RyaXZlciBleHRlbmRzIExvZ0RyaXZlciB7XG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RzIGEgbmV3IGluc3RhbmNlIG9mIHRoZSBKc29uRmlsZUxvZ0RyaXZlciBjbGFzcy5cbiAgICpcbiAgICogQHBhcmFtIHByb3BzIHRoZSBqc29uLWZpbGUgbG9nIGRyaXZlciBjb25maWd1cmF0aW9uIG9wdGlvbnMuXG4gICAqL1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IHByb3BzOiBKc29uRmlsZUxvZ0RyaXZlclByb3BzID0ge30pIHtcbiAgICBzdXBlcigpO1xuXG4gICAgLy8gVmFsaWRhdGlvblxuICAgIGlmIChwcm9wcy5tYXhGaWxlICYmIHByb3BzLm1heEZpbGUgPCAwKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2BtYXhGaWxlYCBtdXN0IGJlIGEgcG9zaXRpdmUgaW50ZWdlci4nKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ2FsbGVkIHdoZW4gdGhlIGxvZyBkcml2ZXIgaXMgY29uZmlndXJlZCBvbiBhIGNvbnRhaW5lclxuICAgKi9cbiAgcHVibGljIGJpbmQoX3Njb3BlOiBDb25zdHJ1Y3QsIF9jb250YWluZXJEZWZpbml0aW9uOiBDb250YWluZXJEZWZpbml0aW9uKTogTG9nRHJpdmVyQ29uZmlnIHtcbiAgICByZXR1cm4ge1xuICAgICAgbG9nRHJpdmVyOiAnanNvbi1maWxlJyxcbiAgICAgIG9wdGlvbnM6IHN0cmluZ2lmeU9wdGlvbnMoe1xuICAgICAgICAnbWF4LXNpemUnOiB0aGlzLnByb3BzLm1heFNpemUsXG4gICAgICAgICdtYXgtZmlsZSc6IHRoaXMucHJvcHMubWF4RmlsZSxcbiAgICAgICAgJ2NvbXByZXNzJzogdGhpcy5wcm9wcy5jb21wcmVzcyxcbiAgICAgICAgJ2xhYmVscyc6IGpvaW5XaXRoQ29tbWFzKHRoaXMucHJvcHMubGFiZWxzKSxcbiAgICAgICAgJ2Vudic6IGpvaW5XaXRoQ29tbWFzKHRoaXMucHJvcHMuZW52KSxcbiAgICAgICAgJ2Vudi1yZWdleCc6IHRoaXMucHJvcHMuZW52UmVnZXgsXG4gICAgICB9KSxcbiAgICB9O1xuICB9XG59XG4iXX0=