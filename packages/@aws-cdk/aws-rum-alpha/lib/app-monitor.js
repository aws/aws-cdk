"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppMonitor = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const aws_cdk_lib_1 = require("aws-cdk-lib");
const logs = require("aws-cdk-lib/aws-logs");
const rum = require("aws-cdk-lib/aws-rum");
const errors_1 = require("aws-cdk-lib/core/lib/errors");
/**
 * A RUM App Monitor
 *
 * @resource AWS::RUM::AppMonitor
 */
class AppMonitor extends aws_cdk_lib_1.Resource {
    /**
     * Import an existing RUM App Monitor
     */
    static fromAppMonitorAttributes(scope, id, attrs) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_rum_alpha_AppMonitorAttributes(attrs);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.fromAppMonitorAttributes);
            }
            throw error;
        }
        class Import extends aws_cdk_lib_1.Resource {
            constructor() {
                super(...arguments);
                this.appMonitorId = attrs.appMonitorId;
                this.appMonitorName = attrs.appMonitorName;
                this.cwLogEnabled = attrs.cwLogEnabled ?? false;
            }
            get logGroup() {
                if (!this.cwLogEnabled) {
                    return undefined;
                }
                if (!this._logGroup) {
                    const logGroupName = aws_cdk_lib_1.Fn.sub('RUMService_${Name}${Id}', {
                        Name: this.appMonitorName,
                        Id: aws_cdk_lib_1.Fn.select(0, aws_cdk_lib_1.Fn.split('-', this.appMonitorId)),
                    });
                    this._logGroup = logs.LogGroup.fromLogGroupName(this, 'LogGroup', logGroupName);
                }
                return this._logGroup;
            }
        }
        return new Import(scope, id);
    }
    constructor(scope, id, props) {
        super(scope, id);
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_rum_alpha_AppMonitorProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, AppMonitor);
            }
            throw error;
        }
        this.appMonitor = new rum.CfnAppMonitor(this, 'Resource', {
            name: props.appMonitorName,
            domain: props.domain,
            cwLogEnabled: props.cwLogEnabled,
            appMonitorConfiguration: props.appMonitorConfiguration ?
                this.renderAppMonitorConfiguration(props.appMonitorConfiguration) : undefined,
            customEvents: props.customEvents ? this.renderCustomEvents(props.customEvents) : undefined,
            deobfuscationConfiguration: props.deobfuscationConfiguration ?
                this.renderDeobfuscationConfiguration(props.deobfuscationConfiguration) : undefined,
        });
        this.appMonitorId = this.appMonitor.attrId;
        this.appMonitorName = props.appMonitorName ?? this.appMonitor.name;
    }
    /**
     * Convert L2 AppMonitorConfiguration to L1 property
     */
    renderAppMonitorConfiguration(config) {
        return {
            allowCookies: config.allowCookies,
            enableXRay: config.enableXRay,
            sessionSampleRate: config.sessionSampleRate,
        };
    }
    /**
     * Convert L2 CustomEventsConfig to L1 property
     */
    renderCustomEvents(config) {
        return {
            status: config.enabled === true ? 'ENABLED' : 'DISABLED',
        };
    }
    /**
     * Convert L2 DeobfuscationConfig to L1 property
     */
    renderDeobfuscationConfiguration(config) {
        return {
            javaScriptSourceMaps: config.javaScriptSourceMaps ? this.renderJavaScriptSourceMaps(config.javaScriptSourceMaps) : undefined,
        };
    }
    /**
     * Convert L2 JavaScriptSourceMapsConfig to L1 property
     */
    renderJavaScriptSourceMaps(config) {
        if (config.enabled && !config.s3Uri) {
            throw new errors_1.ValidationError('s3Uri is required when JavaScript source maps are enabled', this);
        }
        return {
            status: config.enabled ? 'ENABLED' : 'DISABLED',
            ...(config.s3Uri && { s3Uri: config.s3Uri }),
        };
    }
    /**
     * The CloudWatch log group for this RUM app monitor.
     *
     * Only available when `cwLogEnabled` is set to `true`.
     * Returns `undefined` when `cwLogEnabled` is `false`.
     */
    get logGroup() {
        if (!this.appMonitor.cwLogEnabled) {
            return undefined;
        }
        // Cache the log group instance (lazy evaluation)
        if (!this._logGroup) {
            const logGroupName = aws_cdk_lib_1.Fn.sub('RUMService_${Name}${Id}', {
                Name: this.appMonitorName,
                Id: aws_cdk_lib_1.Fn.select(0, aws_cdk_lib_1.Fn.split('-', this.appMonitorId)),
            });
            this._logGroup = logs.LogGroup.fromLogGroupName(this, 'LogGroup', logGroupName);
        }
        return this._logGroup;
    }
}
exports.AppMonitor = AppMonitor;
_a = JSII_RTTI_SYMBOL_1;
AppMonitor[_a] = { fqn: "@aws-cdk/aws-rum-alpha.AppMonitor", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLW1vbml0b3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJhcHAtbW9uaXRvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSw2Q0FBc0Q7QUFDdEQsNkNBQTZDO0FBQzdDLDJDQUEyQztBQUMzQyx3REFBOEQ7QUFzSzlEOzs7O0dBSUc7QUFDSCxNQUFhLFVBQVcsU0FBUSxzQkFBUTtJQUN0Qzs7T0FFRztJQUNJLE1BQU0sQ0FBQyx3QkFBd0IsQ0FBQyxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUEyQjs7Ozs7Ozs7OztRQUM5RixNQUFNLE1BQU8sU0FBUSxzQkFBUTtZQUE3Qjs7Z0JBQ2tCLGlCQUFZLEdBQUcsS0FBSyxDQUFDLFlBQVksQ0FBQztnQkFDbEMsbUJBQWMsR0FBRyxLQUFLLENBQUMsY0FBYyxDQUFDO2dCQUNyQyxpQkFBWSxHQUFHLEtBQUssQ0FBQyxZQUFZLElBQUksS0FBSyxDQUFDO1lBd0I5RCxDQUFDO1lBcEJDLElBQVcsUUFBUTtnQkFDakIsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztvQkFDdkIsT0FBTyxTQUFTLENBQUM7Z0JBQ25CLENBQUM7Z0JBRUQsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztvQkFDcEIsTUFBTSxZQUFZLEdBQUcsZ0JBQUUsQ0FBQyxHQUFHLENBQUMseUJBQXlCLEVBQUU7d0JBQ3JELElBQUksRUFBRSxJQUFJLENBQUMsY0FBYzt3QkFDekIsRUFBRSxFQUFFLGdCQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxnQkFBRSxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO3FCQUNuRCxDQUFDLENBQUM7b0JBRUgsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLGdCQUFnQixDQUM3QyxJQUFJLEVBQ0osVUFBVSxFQUNWLFlBQVksQ0FDYixDQUFDO2dCQUNKLENBQUM7Z0JBRUQs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QUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztZQUNwQixNQUFNLFlBQVksR0FBRyxnQkFBRSxDQUFDLEdBQUcsQ0FBQyx5QkFBeUIsRUFBRTtnQkFDckQsSUFBSSxFQUFFLElBQUksQ0FBQyxjQUFjO2dCQUN6QixFQUFFLEVBQUUsZ0JBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLGdCQUFFLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7YUFDbkQsQ0FBQyxDQUFDO1lBRUgsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLGdCQUFnQixDQUM3QyxJQUFJLEVBQ0osVUFBVSxFQUNWLFlBQVksQ0FDYixDQUFDO1FBQ0osQ0FBQztRQUVELE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQztLQUN2Qjs7QUFsSkgsZ0NBbUpDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSVJlc291cmNlLCBSZXNvdXJjZSwgRm4gfSBmcm9tICdhd3MtY2RrLWxpYic7XG5pbXBvcnQgKiBhcyBsb2dzIGZyb20gJ2F3cy1jZGstbGliL2F3cy1sb2dzJztcbmltcG9ydCAqIGFzIHJ1bSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtcnVtJztcbmltcG9ydCB7IFZhbGlkYXRpb25FcnJvciB9IGZyb20gJ2F3cy1jZGstbGliL2NvcmUvbGliL2Vycm9ycyc7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcblxuLyoqXG4gKiBSZXByZXNlbnRzIGEgUlVNIEFwcCBNb25pdG9yXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgSUFwcE1vbml0b3IgZXh0ZW5kcyBJUmVzb3VyY2Uge1xuICAvKipcbiAgICogVGhlIElEIG9mIHRoZSBhcHAgbW9uaXRvclxuICAgKiBAYXR0cmlidXRlXG4gICAqL1xuICByZWFkb25seSBhcHBNb25pdG9ySWQ6IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIG5hbWUgb2YgdGhlIGFwcCBtb25pdG9yXG4gICAqIEBhdHRyaWJ1dGVcbiAgICovXG4gIHJlYWRvbmx5IGFwcE1vbml0b3JOYW1lOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBDbG91ZFdhdGNoIGxvZyBncm91cCBmb3IgdGhpcyBSVU0gYXBwIG1vbml0b3IuXG4gICAqXG4gICAqIE9ubHkgYXZhaWxhYmxlIHdoZW4gYGN3TG9nRW5hYmxlZGAgaXMgc2V0IHRvIGB0cnVlYC5cbiAgICogUmV0dXJucyBgdW5kZWZpbmVkYCB3aGVuIGBjd0xvZ0VuYWJsZWRgIGlzIGBmYWxzZWAuXG4gICAqL1xuICByZWFkb25seSBsb2dHcm91cD86IGxvZ3MuSUxvZ0dyb3VwO1xufVxuXG4vKipcbiAqIEN1c3RvbSBldmVudHMgY29uZmlndXJhdGlvbiBmb3IgUlVNIEFwcCBNb25pdG9yXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQ3VzdG9tRXZlbnRzQ29uZmlnIHtcbiAgLyoqXG4gICAqIFdoZXRoZXIgY3VzdG9tIGV2ZW50cyBhcmUgZW5hYmxlZFxuICAgKlxuICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgKi9cbiAgcmVhZG9ubHkgZW5hYmxlZD86IGJvb2xlYW47XG59XG5cbi8qKlxuICogSmF2YVNjcmlwdCBzb3VyY2UgbWFwcyBjb25maWd1cmF0aW9uXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgSmF2YVNjcmlwdFNvdXJjZU1hcHNDb25maWcge1xuICAvKipcbiAgICogV2hldGhlciBKYXZhU2NyaXB0IHNvdXJjZSBtYXBzIGFyZSBlbmFibGVkXG4gICAqL1xuICByZWFkb25seSBlbmFibGVkOiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBUaGUgUzMgVVJJIG9mIHRoZSBidWNrZXQgb3IgZm9sZGVyIHRoYXQgc3RvcmVzIHRoZSBzb3VyY2UgbWFwIGZpbGVzXG4gICAqIFJlcXVpcmVkIGlmIGVuYWJsZWQgaXMgdHJ1ZVxuICAgKlxuICAgKiBAZGVmYXVsdCAtIE5vIFMzIFVSSSBwcm92aWRlZFxuICAgKi9cbiAgcmVhZG9ubHkgczNVcmk/OiBzdHJpbmc7XG59XG5cbi8qKlxuICogRGVvYmZ1c2NhdGlvbiBjb25maWd1cmF0aW9uIGZvciBSVU0gQXBwIE1vbml0b3JcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBEZW9iZnVzY2F0aW9uQ29uZmlnIHtcbiAgLyoqXG4gICAqIEphdmFTY3JpcHQgc291cmNlIG1hcHMgY29uZmlndXJhdGlvblxuICAgKlxuICAgKiBAZGVmYXVsdCAtIE5vIEphdmFTY3JpcHQgc291cmNlIG1hcHMgY29uZmlndXJhdGlvblxuICAgKi9cbiAgcmVhZG9ubHkgamF2YVNjcmlwdFNvdXJjZU1hcHM/OiBKYXZhU2NyaXB0U291cmNlTWFwc0NvbmZpZztcbn1cblxuLyoqXG4gKiBBcHAgTW9uaXRvciBjb25maWd1cmF0aW9uIGZvciBSVU1cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBBcHBNb25pdG9yQ29uZmlndXJhdGlvbiB7XG4gIC8qKlxuICAgKiBXaGV0aGVyIHRvIGFsbG93IGNvb2tpZXMgZm9yIHRyYWNraW5nIHVzZXIgc2Vzc2lvbnNcbiAgICpcbiAgICogQGRlZmF1bHQgZmFsc2VcbiAgICovXG4gIHJlYWRvbmx5IGFsbG93Q29va2llcz86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdG8gZW5hYmxlIFgtUmF5IHRyYWNpbmdcbiAgICpcbiAgICogQGRlZmF1bHQgZmFsc2VcbiAgICovXG4gIHJlYWRvbmx5IGVuYWJsZVhSYXk/OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBQb3J0aW9uIG9mIHVzZXIgc2Vzc2lvbnMgdG8gc2FtcGxlIGZvciBkYXRhIGNvbGxlY3Rpb25cbiAgICogUmFuZ2U6IDAgdG8gMSBpbmNsdXNpdmVcbiAgICpcbiAgICogQGRlZmF1bHQgMC4xXG4gICAqL1xuICByZWFkb25seSBzZXNzaW9uU2FtcGxlUmF0ZT86IG51bWJlcjtcbn1cblxuLyoqXG4gKiBQcm9wZXJ0aWVzIGZvciBkZWZpbmluZyBhIFJVTSBBcHAgTW9uaXRvclxuICovXG5leHBvcnQgaW50ZXJmYWNlIEFwcE1vbml0b3JQcm9wcyB7XG4gIC8qKlxuICAgKiBBIG5hbWUgZm9yIHRoZSBhcHAgbW9uaXRvci5cbiAgICogVGhpcyBwYXJhbWV0ZXIgaXMgcmVxdWlyZWQuXG4gICAqL1xuICByZWFkb25seSBhcHBNb25pdG9yTmFtZTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgdG9wLWxldmVsIGludGVybmV0IGRvbWFpbiBuYW1lIGZvciB3aGljaCB5b3VyIGFwcGxpY2F0aW9uIGhhcyBhZG1pbmlzdHJhdGl2ZSBhdXRob3JpdHkuXG4gICAqIEVpdGhlciB0aGlzIHBhcmFtZXRlciBvciBkb21haW5MaXN0IGlzIHJlcXVpcmVkLlxuICAgKi9cbiAgcmVhZG9ubHkgZG9tYWluOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIERhdGEgY29sbGVjdGVkIGJ5IFJVTSBpcyBrZXB0IGJ5IFJVTSBmb3IgMzAgZGF5cyBhbmQgdGhlbiBkZWxldGVkLlxuICAgKiBUaGlzIHBhcmFtZXRlciBzcGVjaWZpZXMgd2hldGhlciBSVU0gc2VuZHMgYSBjb3B5IG9mIHRoaXMgdGVsZW1ldHJ5IGRhdGFcbiAgICogdG8gQW1hem9uIENsb3VkV2F0Y2ggTG9ncyBpbiB5b3VyIGFjY291bnQuXG4gICAqXG4gICAqIEBkZWZhdWx0IGZhbHNlXG4gICAqL1xuICByZWFkb25seSBjd0xvZ0VuYWJsZWQ/OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBDb25maWd1cmF0aW9uIGRhdGEgZm9yIHRoZSBhcHAgbW9uaXRvci5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBObyBjb25maWd1cmF0aW9uXG4gICAqL1xuICByZWFkb25seSBhcHBNb25pdG9yQ29uZmlndXJhdGlvbj86IEFwcE1vbml0b3JDb25maWd1cmF0aW9uO1xuXG4gIC8qKlxuICAgKiBDdXN0b20gZXZlbnRzIGNvbmZpZ3VyYXRpb24gZm9yIHRoZSBhcHAgbW9uaXRvci5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBDdXN0b20gZXZlbnRzIGFyZSBkaXNhYmxlZFxuICAgKi9cbiAgcmVhZG9ubHkgY3VzdG9tRXZlbnRzPzogQ3VzdG9tRXZlbnRzQ29uZmlnO1xuXG4gIC8qKlxuICAgKiBEZW9iZnVzY2F0aW9uIGNvbmZpZ3VyYXRpb24gZm9yIHN0YWNrIHRyYWNlIHByb2Nlc3NpbmcuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gTm8gZGVvYmZ1c2NhdGlvbiBjb25maWd1cmF0aW9uXG4gICAqL1xuICByZWFkb25seSBkZW9iZnVzY2F0aW9uQ29uZmlndXJhdGlvbj86IERlb2JmdXNjYXRpb25Db25maWc7XG59XG5cbi8qKlxuICogQXR0cmlidXRlcyBmb3IgaW1wb3J0aW5nIGFuIGV4aXN0aW5nIFJVTSBBcHAgTW9uaXRvclxuICovXG5leHBvcnQgaW50ZXJmYWNlIEFwcE1vbml0b3JBdHRyaWJ1dGVzIHtcbiAgLyoqXG4gICAqIFRoZSBJRCBvZiB0aGUgYXBwIG1vbml0b3JcbiAgICovXG4gIHJlYWRvbmx5IGFwcE1vbml0b3JJZDogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgbmFtZSBvZiB0aGUgYXBwIG1vbml0b3JcbiAgICovXG4gIHJlYWRvbmx5IGFwcE1vbml0b3JOYW1lOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgQ2xvdWRXYXRjaCBsb2dzIGFyZSBlbmFibGVkIGZvciB0aGlzIGFwcCBtb25pdG9yXG4gICAqXG4gICAqIEBkZWZhdWx0IGZhbHNlXG4gICAqL1xuICByZWFkb25seSBjd0xvZ0VuYWJsZWQ/OiBib29sZWFuO1xufVxuXG4vKipcbiAqIEEgUlVNIEFwcCBNb25pdG9yXG4gKlxuICogQHJlc291cmNlIEFXUzo6UlVNOjpBcHBNb25pdG9yXG4gKi9cbmV4cG9ydCBjbGFzcyBBcHBNb25pdG9yIGV4dGVuZHMgUmVzb3VyY2UgaW1wbGVtZW50cyBJQXBwTW9uaXRvciB7XG4gIC8qKlxuICAgKiBJbXBvcnQgYW4gZXhpc3RpbmcgUlVNIEFwcCBNb25pdG9yXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGZyb21BcHBNb25pdG9yQXR0cmlidXRlcyhzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBhdHRyczogQXBwTW9uaXRvckF0dHJpYnV0ZXMpOiBJQXBwTW9uaXRvciB7XG4gICAgY2xhc3MgSW1wb3J0IGV4dGVuZHMgUmVzb3VyY2UgaW1wbGVtZW50cyBJQXBwTW9uaXRvciB7XG4gICAgICBwdWJsaWMgcmVhZG9ubHkgYXBwTW9uaXRvcklkID0gYXR0cnMuYXBwTW9uaXRvcklkO1xuICAgICAgcHVibGljIHJlYWRvbmx5IGFwcE1vbml0b3JOYW1lID0gYXR0cnMuYXBwTW9uaXRvck5hbWU7XG4gICAgICBwcml2YXRlIHJlYWRvbmx5IGN3TG9nRW5hYmxlZCA9IGF0dHJzLmN3TG9nRW5hYmxlZCA/PyBmYWxzZTtcblxuICAgICAgcHJpdmF0ZSBfbG9nR3JvdXA/OiBsb2dzLklMb2dHcm91cDtcblxuICAgICAgcHVibGljIGdldCBsb2dHcm91cCgpOiBsb2dzLklMb2dHcm91cCB8IHVuZGVmaW5lZCB7XG4gICAgICAgIGlmICghdGhpcy5jd0xvZ0VuYWJsZWQpIHtcbiAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCF0aGlzLl9sb2dHcm91cCkge1xuICAgICAgICAgIGNvbnN0IGxvZ0dyb3VwTmFtZSA9IEZuLnN1YignUlVNU2VydmljZV8ke05hbWV9JHtJZH0nLCB7XG4gICAgICAgICAgICBOYW1lOiB0aGlzLmFwcE1vbml0b3JOYW1lLFxuICAgICAgICAgICAgSWQ6IEZuLnNlbGVjdCgwLCBGbi5zcGxpdCgnLScsIHRoaXMuYXBwTW9uaXRvcklkKSksXG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICB0aGlzLl9sb2dHcm91cCA9IGxvZ3MuTG9nR3JvdXAuZnJvbUxvZ0dyb3VwTmFtZShcbiAgICAgICAgICAgIHRoaXMsXG4gICAgICAgICAgICAnTG9nR3JvdXAnLFxuICAgICAgICAgICAgbG9nR3JvdXBOYW1lLFxuICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcy5fbG9nR3JvdXA7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBJbXBvcnQoc2NvcGUsIGlkKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgSUQgb2YgdGhlIGFwcCBtb25pdG9yXG4gICAqIEBhdHRyaWJ1dGVcbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBhcHBNb25pdG9ySWQ6IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIG5hbWUgb2YgdGhlIGFwcCBtb25pdG9yXG4gICAqIEBhdHRyaWJ1dGVcbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBhcHBNb25pdG9yTmFtZTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgdW5kZXJseWluZyBDZm5BcHBNb25pdG9yIHJlc291cmNlXG4gICAqL1xuICBwcml2YXRlIHJlYWRvbmx5IGFwcE1vbml0b3I6IHJ1bS5DZm5BcHBNb25pdG9yO1xuXG4gIC8qKlxuICAgKiBDYWNoZWQgbG9nIGdyb3VwIGluc3RhbmNlIGZvciBsYXp5IGV2YWx1YXRpb25cbiAgICovXG4gIHByaXZhdGUgX2xvZ0dyb3VwPzogbG9ncy5JTG9nR3JvdXA7XG5cbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IEFwcE1vbml0b3JQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCk7XG5cbiAgICB0aGlzLmFwcE1vbml0b3IgPSBuZXcgcnVtLkNmbkFwcE1vbml0b3IodGhpcywgJ1Jlc291cmNlJywge1xuICAgICAgbmFtZTogcHJvcHMuYXBwTW9uaXRvck5hbWUsXG4gICAgICBkb21haW46IHByb3BzLmRvbWFpbixcbiAgICAgIGN3TG9nRW5hYmxlZDogcHJvcHMuY3dMb2dFbmFibGVkLFxuICAgICAgYXBwTW9uaXRvckNvbmZpZ3VyYXRpb246IHByb3BzLmFwcE1vbml0b3JDb25maWd1cmF0aW9uID9cbiAgICAgICAgdGhpcy5yZW5kZXJBcHBNb25pdG9yQ29uZmlndXJhdGlvbihwcm9wcy5hcHBNb25pdG9yQ29uZmlndXJhdGlvbikgOiB1bmRlZmluZWQsXG4gICAgICBjdXN0b21FdmVudHM6IHByb3BzLmN1c3RvbUV2ZW50cyA/IHRoaXMucmVuZGVyQ3VzdG9tRXZlbnRzKHByb3BzLmN1c3RvbUV2ZW50cykgOiB1bmRlZmluZWQsXG4gICAgICBkZW9iZnVzY2F0aW9uQ29uZmlndXJhdGlvbjogcHJvcHMuZGVvYmZ1c2NhdGlvbkNvbmZpZ3VyYXRpb24gP1xuICAgICAgICB0aGlzLnJlbmRlckRlb2JmdXNjYXRpb25Db25maWd1cmF0aW9uKHByb3BzLmRlb2JmdXNjYXRpb25Db25maWd1cmF0aW9uKSA6IHVuZGVmaW5lZCxcbiAgICB9KTtcblxuICAgIHRoaXMuYXBwTW9uaXRvcklkID0gdGhpcy5hcHBNb25pdG9yLmF0dHJJZDtcbiAgICB0aGlzLmFwcE1vbml0b3JOYW1lID0gcHJvcHMuYXBwTW9uaXRvck5hbWUgPz8gdGhpcy5hcHBNb25pdG9yLm5hbWUhO1xuICB9XG5cbiAgLyoqXG4gICAqIENvbnZlcnQgTDIgQXBwTW9uaXRvckNvbmZpZ3VyYXRpb24gdG8gTDEgcHJvcGVydHlcbiAgICovXG4gIHByaXZhdGUgcmVuZGVyQXBwTW9uaXRvckNvbmZpZ3VyYXRpb24oY29uZmlnOiBBcHBNb25pdG9yQ29uZmlndXJhdGlvbik6IHJ1bS5DZm5BcHBNb25pdG9yLkFwcE1vbml0b3JDb25maWd1cmF0aW9uUHJvcGVydHkge1xuICAgIHJldHVybiB7XG4gICAgICBhbGxvd0Nvb2tpZXM6IGNvbmZpZy5hbGxvd0Nvb2tpZXMsXG4gICAgICBlbmFibGVYUmF5OiBjb25maWcuZW5hYmxlWFJheSxcbiAgICAgIHNlc3Npb25TYW1wbGVSYXRlOiBjb25maWcuc2Vzc2lvblNhbXBsZVJhdGUsXG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb252ZXJ0IEwyIEN1c3RvbUV2ZW50c0NvbmZpZyB0byBMMSBwcm9wZXJ0eVxuICAgKi9cbiAgcHJpdmF0ZSByZW5kZXJDdXN0b21FdmVudHMoY29uZmlnOiBDdXN0b21FdmVudHNDb25maWcpOiBydW0uQ2ZuQXBwTW9uaXRvci5DdXN0b21FdmVudHNQcm9wZXJ0eSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHN0YXR1czogY29uZmlnLmVuYWJsZWQgPT09IHRydWUgPyAnRU5BQkxFRCcgOiAnRElTQUJMRUQnLFxuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogQ29udmVydCBMMiBEZW9iZnVzY2F0aW9uQ29uZmlnIHRvIEwxIHByb3BlcnR5XG4gICAqL1xuICBwcml2YXRlIHJlbmRlckRlb2JmdXNjYXRpb25Db25maWd1cmF0aW9uKGNvbmZpZzogRGVvYmZ1c2NhdGlvbkNvbmZpZyk6IHJ1bS5DZm5BcHBNb25pdG9yLkRlb2JmdXNjYXRpb25Db25maWd1cmF0aW9uUHJvcGVydHkge1xuICAgIHJldHVybiB7XG4gICAgICBqYXZhU2NyaXB0U291cmNlTWFwczogY29uZmlnLmphdmFTY3JpcHRTb3VyY2VNYXBzID8gdGhpcy5yZW5kZXJKYXZhU2NyaXB0U291cmNlTWFwcyhjb25maWcuamF2YVNjcmlwdFNvdXJjZU1hcHMpIDogdW5kZWZpbmVkLFxuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogQ29udmVydCBMMiBKYXZhU2NyaXB0U291cmNlTWFwc0NvbmZpZyB0byBMMSBwcm9wZXJ0eVxuICAgKi9cbiAgcHJpdmF0ZSByZW5kZXJKYXZhU2NyaXB0U291cmNlTWFwcyhjb25maWc6IEphdmFTY3JpcHRTb3VyY2VNYXBzQ29uZmlnKTogcnVtLkNmbkFwcE1vbml0b3IuSmF2YVNjcmlwdFNvdXJjZU1hcHNQcm9wZXJ0eSB7XG4gICAgaWYgKGNvbmZpZy5lbmFibGVkICYmICFjb25maWcuczNVcmkpIHtcbiAgICAgIHRocm93IG5ldyBWYWxpZGF0aW9uRXJyb3IoJ3MzVXJpIGlzIHJlcXVpcmVkIHdoZW4gSmF2YVNjcmlwdCBzb3VyY2UgbWFwcyBhcmUgZW5hYmxlZCcsIHRoaXMpO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICBzdGF0dXM6IGNvbmZpZy5lbmFibGVkID8gJ0VOQUJMRUQnIDogJ0RJU0FCTEVEJyxcbiAgICAgIC4uLihjb25maWcuczNVcmkgJiYgeyBzM1VyaTogY29uZmlnLnMzVXJpIH0pLFxuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogVGhlIENsb3VkV2F0Y2ggbG9nIGdyb3VwIGZvciB0aGlzIFJVTSBhcHAgbW9uaXRvci5cbiAgICpcbiAgICogT25seSBhdmFpbGFibGUgd2hlbiBgY3dMb2dFbmFibGVkYCBpcyBzZXQgdG8gYHRydWVgLlxuICAgKiBSZXR1cm5zIGB1bmRlZmluZWRgIHdoZW4gYGN3TG9nRW5hYmxlZGAgaXMgYGZhbHNlYC5cbiAgICovXG4gIHB1YmxpYyBnZXQgbG9nR3JvdXAoKTogbG9ncy5JTG9nR3JvdXAgfCB1bmRlZmluZWQge1xuICAgIGlmICghdGhpcy5hcHBNb25pdG9yLmN3TG9nRW5hYmxlZCkge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICAvLyBDYWNoZSB0aGUgbG9nIGdyb3VwIGluc3RhbmNlIChsYXp5IGV2YWx1YXRpb24pXG4gICAgaWYgKCF0aGlzLl9sb2dHcm91cCkge1xuICAgICAgY29uc3QgbG9nR3JvdXBOYW1lID0gRm4uc3ViKCdSVU1TZXJ2aWNlXyR7TmFtZX0ke0lkfScsIHtcbiAgICAgICAgTmFtZTogdGhpcy5hcHBNb25pdG9yTmFtZSxcbiAgICAgICAgSWQ6IEZuLnNlbGVjdCgwLCBGbi5zcGxpdCgnLScsIHRoaXMuYXBwTW9uaXRvcklkKSksXG4gICAgICB9KTtcblxuICAgICAgdGhpcy5fbG9nR3JvdXAgPSBsb2dzLkxvZ0dyb3VwLmZyb21Mb2dHcm91cE5hbWUoXG4gICAgICAgIHRoaXMsXG4gICAgICAgICdMb2dHcm91cCcsXG4gICAgICAgIGxvZ0dyb3VwTmFtZSxcbiAgICAgICk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuX2xvZ0dyb3VwO1xuICB9XG59XG4iXX0=