"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SyslogLogDriver = void 0;
const jsiiDeprecationWarnings = require("../../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const log_driver_1 = require("./log-driver");
const utils_1 = require("./utils");
/**
 * A log driver that sends log information to syslog Logs.
 */
class SyslogLogDriver extends log_driver_1.LogDriver {
    /**
     * Constructs a new instance of the SyslogLogDriver class.
     *
     * @param props the syslog log driver configuration options.
     */
    constructor(props = {}) {
        super();
        this.props = props;
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ecs_SyslogLogDriverProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, SyslogLogDriver);
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
            logDriver: 'syslog',
            options: utils_1.stringifyOptions({
                'syslog-address': this.props.address,
                'syslog-facility': this.props.facility,
                'syslog-tls-ca-cert': this.props.tlsCaCert,
                'syslog-tls-cert': this.props.tlsCert,
                'syslog-tls-key': this.props.tlsKey,
                'syslog-tls-skip-verify': this.props.tlsSkipVerify,
                'syslog-format': this.props.format,
                ...utils_1.renderCommonLogDriverOptions(this.props),
            }),
        };
    }
}
exports.SyslogLogDriver = SyslogLogDriver;
_a = JSII_RTTI_SYMBOL_1;
SyslogLogDriver[_a] = { fqn: "@aws-cdk/aws-ecs.SyslogLogDriver", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3lzbG9nLWxvZy1kcml2ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzeXNsb2ctbG9nLWRyaXZlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFFQSw2Q0FBMEQ7QUFDMUQsbUNBQXlFO0FBcUV6RTs7R0FFRztBQUNILE1BQWEsZUFBZ0IsU0FBUSxzQkFBUztJQUM1Qzs7OztPQUlHO0lBQ0gsWUFBNkIsUUFBOEIsRUFBRTtRQUMzRCxLQUFLLEVBQUUsQ0FBQztRQURtQixVQUFLLEdBQUwsS0FBSyxDQUEyQjs7Ozs7OytDQU5sRCxlQUFlOzs7O0tBUXpCO0lBRUQ7O09BRUc7SUFDSSxJQUFJLENBQUMsTUFBaUIsRUFBRSxvQkFBeUM7Ozs7Ozs7Ozs7UUFDdEUsT0FBTztZQUNMLFNBQVMsRUFBRSxRQUFRO1lBQ25CLE9BQU8sRUFBRSx3QkFBZ0IsQ0FBQztnQkFDeEIsZ0JBQWdCLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPO2dCQUNwQyxpQkFBaUIsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVE7Z0JBQ3RDLG9CQUFvQixFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUztnQkFDMUMsaUJBQWlCLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPO2dCQUNyQyxnQkFBZ0IsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU07Z0JBQ25DLHdCQUF3QixFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYTtnQkFDbEQsZUFBZSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTTtnQkFDbEMsR0FBRyxvQ0FBNEIsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDO2FBQzVDLENBQUM7U0FDSCxDQUFDO0tBQ0g7O0FBM0JILDBDQTRCQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0IHsgQmFzZUxvZ0RyaXZlclByb3BzIH0gZnJvbSAnLi9iYXNlLWxvZy1kcml2ZXInO1xuaW1wb3J0IHsgTG9nRHJpdmVyLCBMb2dEcml2ZXJDb25maWcgfSBmcm9tICcuL2xvZy1kcml2ZXInO1xuaW1wb3J0IHsgcmVuZGVyQ29tbW9uTG9nRHJpdmVyT3B0aW9ucywgc3RyaW5naWZ5T3B0aW9ucyB9IGZyb20gJy4vdXRpbHMnO1xuaW1wb3J0IHsgQ29udGFpbmVyRGVmaW5pdGlvbiB9IGZyb20gJy4uL2NvbnRhaW5lci1kZWZpbml0aW9uJztcblxuLyoqXG4gKiBTcGVjaWZpZXMgdGhlIHN5c2xvZyBsb2cgZHJpdmVyIGNvbmZpZ3VyYXRpb24gb3B0aW9ucy5cbiAqXG4gKiBbU291cmNlXShodHRwczovL2RvY3MuZG9ja2VyLmNvbS9jb25maWcvY29udGFpbmVycy9sb2dnaW5nL3N5c2xvZy8pXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgU3lzbG9nTG9nRHJpdmVyUHJvcHMgZXh0ZW5kcyBCYXNlTG9nRHJpdmVyUHJvcHMge1xuICAvKipcbiAgICogVGhlIGFkZHJlc3Mgb2YgYW4gZXh0ZXJuYWwgc3lzbG9nIHNlcnZlci4gVGhlIFVSSSBzcGVjaWZpZXIgbWF5IGJlXG4gICAqIFt0Y3B8dWRwfHRjcCt0bHNdOi8vaG9zdDpwb3J0LCB1bml4Oi8vcGF0aCwgb3IgdW5peGdyYW06Ly9wYXRoLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIElmIHRoZSB0cmFuc3BvcnQgaXMgdGNwLCB1ZHAsIG9yIHRjcCt0bHMsIHRoZSBkZWZhdWx0IHBvcnQgaXMgNTE0LlxuICAgKi9cbiAgcmVhZG9ubHkgYWRkcmVzcz86IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIHN5c2xvZyBmYWNpbGl0eSB0byB1c2UuIENhbiBiZSB0aGUgbnVtYmVyIG9yIG5hbWUgZm9yIGFueSB2YWxpZFxuICAgKiBzeXNsb2cgZmFjaWxpdHkuIFNlZSB0aGUgc3lzbG9nIGRvY3VtZW50YXRpb246XG4gICAqIGh0dHBzOi8vdG9vbHMuaWV0Zi5vcmcvaHRtbC9yZmM1NDI0I3NlY3Rpb24tNi4yLjEuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gZmFjaWxpdHkgbm90IHNldFxuICAgKi9cbiAgcmVhZG9ubHkgZmFjaWxpdHk/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBhYnNvbHV0ZSBwYXRoIHRvIHRoZSB0cnVzdCBjZXJ0aWZpY2F0ZXMgc2lnbmVkIGJ5IHRoZSBDQS4gSWdub3JlZFxuICAgKiBpZiB0aGUgYWRkcmVzcyBwcm90b2NvbCBpcyBub3QgdGNwK3Rscy5cbiAgICpcbiAgICogQGRlZmF1bHQgLSB0bHNDYUNlcnQgbm90IHNldFxuICAgKi9cbiAgcmVhZG9ubHkgdGxzQ2FDZXJ0Pzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgYWJzb2x1dGUgcGF0aCB0byB0aGUgVExTIGNlcnRpZmljYXRlIGZpbGUuIElnbm9yZWQgaWYgdGhlIGFkZHJlc3NcbiAgICogcHJvdG9jb2wgaXMgbm90IHRjcCt0bHMuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gdGxzQ2VydCBub3Qgc2V0XG4gICAqL1xuICByZWFkb25seSB0bHNDZXJ0Pzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgYWJzb2x1dGUgcGF0aCB0byB0aGUgVExTIGtleSBmaWxlLiBJZ25vcmVkIGlmIHRoZSBhZGRyZXNzIHByb3RvY29sXG4gICAqIGlzIG5vdCB0Y3ArdGxzLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIHRsc0tleSBub3Qgc2V0XG4gICAqL1xuICByZWFkb25seSB0bHNLZXk/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIElmIHNldCB0byB0cnVlLCBUTFMgdmVyaWZpY2F0aW9uIGlzIHNraXBwZWQgd2hlbiBjb25uZWN0aW5nIHRvIHRoZSBzeXNsb2dcbiAgICogZGFlbW9uLiBJZ25vcmVkIGlmIHRoZSBhZGRyZXNzIHByb3RvY29sIGlzIG5vdCB0Y3ArdGxzLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIGZhbHNlXG4gICAqL1xuICByZWFkb25seSB0bHNTa2lwVmVyaWZ5PzogYm9vbGVhbjtcblxuICAvKipcbiAgICogVGhlIHN5c2xvZyBtZXNzYWdlIGZvcm1hdCB0byB1c2UuIElmIG5vdCBzcGVjaWZpZWQgdGhlIGxvY2FsIFVOSVggc3lzbG9nXG4gICAqIGZvcm1hdCBpcyB1c2VkLCB3aXRob3V0IGEgc3BlY2lmaWVkIGhvc3RuYW1lLiBTcGVjaWZ5IHJmYzMxNjQgZm9yIHRoZSBSRkMtMzE2NFxuICAgKiBjb21wYXRpYmxlIGZvcm1hdCwgcmZjNTQyNCBmb3IgUkZDLTU0MjQgY29tcGF0aWJsZSBmb3JtYXQsIG9yIHJmYzU0MjRtaWNyb1xuICAgKiBmb3IgUkZDLTU0MjQgY29tcGF0aWJsZSBmb3JtYXQgd2l0aCBtaWNyb3NlY29uZCB0aW1lc3RhbXAgcmVzb2x1dGlvbi5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBmb3JtYXQgbm90IHNldFxuICAgKi9cbiAgcmVhZG9ubHkgZm9ybWF0Pzogc3RyaW5nO1xufVxuXG4vKipcbiAqIEEgbG9nIGRyaXZlciB0aGF0IHNlbmRzIGxvZyBpbmZvcm1hdGlvbiB0byBzeXNsb2cgTG9ncy5cbiAqL1xuZXhwb3J0IGNsYXNzIFN5c2xvZ0xvZ0RyaXZlciBleHRlbmRzIExvZ0RyaXZlciB7XG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RzIGEgbmV3IGluc3RhbmNlIG9mIHRoZSBTeXNsb2dMb2dEcml2ZXIgY2xhc3MuXG4gICAqXG4gICAqIEBwYXJhbSBwcm9wcyB0aGUgc3lzbG9nIGxvZyBkcml2ZXIgY29uZmlndXJhdGlvbiBvcHRpb25zLlxuICAgKi9cbiAgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSBwcm9wczogU3lzbG9nTG9nRHJpdmVyUHJvcHMgPSB7fSkge1xuICAgIHN1cGVyKCk7XG4gIH1cblxuICAvKipcbiAgICogQ2FsbGVkIHdoZW4gdGhlIGxvZyBkcml2ZXIgaXMgY29uZmlndXJlZCBvbiBhIGNvbnRhaW5lclxuICAgKi9cbiAgcHVibGljIGJpbmQoX3Njb3BlOiBDb25zdHJ1Y3QsIF9jb250YWluZXJEZWZpbml0aW9uOiBDb250YWluZXJEZWZpbml0aW9uKTogTG9nRHJpdmVyQ29uZmlnIHtcbiAgICByZXR1cm4ge1xuICAgICAgbG9nRHJpdmVyOiAnc3lzbG9nJyxcbiAgICAgIG9wdGlvbnM6IHN0cmluZ2lmeU9wdGlvbnMoe1xuICAgICAgICAnc3lzbG9nLWFkZHJlc3MnOiB0aGlzLnByb3BzLmFkZHJlc3MsXG4gICAgICAgICdzeXNsb2ctZmFjaWxpdHknOiB0aGlzLnByb3BzLmZhY2lsaXR5LFxuICAgICAgICAnc3lzbG9nLXRscy1jYS1jZXJ0JzogdGhpcy5wcm9wcy50bHNDYUNlcnQsXG4gICAgICAgICdzeXNsb2ctdGxzLWNlcnQnOiB0aGlzLnByb3BzLnRsc0NlcnQsXG4gICAgICAgICdzeXNsb2ctdGxzLWtleSc6IHRoaXMucHJvcHMudGxzS2V5LFxuICAgICAgICAnc3lzbG9nLXRscy1za2lwLXZlcmlmeSc6IHRoaXMucHJvcHMudGxzU2tpcFZlcmlmeSxcbiAgICAgICAgJ3N5c2xvZy1mb3JtYXQnOiB0aGlzLnByb3BzLmZvcm1hdCxcbiAgICAgICAgLi4ucmVuZGVyQ29tbW9uTG9nRHJpdmVyT3B0aW9ucyh0aGlzLnByb3BzKSxcbiAgICAgIH0pLFxuICAgIH07XG4gIH1cbn1cbiJdfQ==