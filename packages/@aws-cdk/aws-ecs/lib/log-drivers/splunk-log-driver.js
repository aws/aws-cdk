"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SplunkLogDriver = exports.SplunkLogFormat = void 0;
const jsiiDeprecationWarnings = require("../../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const log_driver_1 = require("./log-driver");
const utils_1 = require("./utils");
/**
 * Log Message Format
 */
var SplunkLogFormat;
(function (SplunkLogFormat) {
    SplunkLogFormat["INLINE"] = "inline";
    SplunkLogFormat["JSON"] = "json";
    SplunkLogFormat["RAW"] = "raw";
})(SplunkLogFormat = exports.SplunkLogFormat || (exports.SplunkLogFormat = {}));
/**
 * A log driver that sends log information to splunk Logs.
 */
class SplunkLogDriver extends log_driver_1.LogDriver {
    /**
     * Constructs a new instance of the SplunkLogDriver class.
     *
     * @param props the splunk log driver configuration options.
     */
    constructor(props) {
        super();
        this.props = props;
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ecs_SplunkLogDriverProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, SplunkLogDriver);
            }
            throw error;
        }
        if (!props.token && !props.secretToken) {
            throw new Error('Please provide either token or secretToken.');
        }
        if (props.gzipLevel) {
            utils_1.ensureInRange(props.gzipLevel, -1, 9);
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
        const options = utils_1.stringifyOptions({
            'splunk-token': this.props.token?.unsafeUnwrap(),
            'splunk-url': this.props.url,
            'splunk-source': this.props.source,
            'splunk-sourcetype': this.props.sourceType,
            'splunk-index': this.props.index,
            'splunk-capath': this.props.caPath,
            'splunk-caname': this.props.caName,
            'splunk-insecureskipverify': this.props.insecureSkipVerify,
            'splunk-format': this.props.format,
            'splunk-verify-connection': this.props.verifyConnection,
            'splunk-gzip': this.props.gzip,
            'splunk-gzip-level': this.props.gzipLevel,
            ...utils_1.renderCommonLogDriverOptions(this.props),
        });
        return {
            logDriver: 'splunk',
            options,
            secretOptions: this.props.secretToken && utils_1.renderLogDriverSecretOptions({ 'splunk-token': this.props.secretToken }, _containerDefinition.taskDefinition),
        };
    }
}
exports.SplunkLogDriver = SplunkLogDriver;
_a = JSII_RTTI_SYMBOL_1;
SplunkLogDriver[_a] = { fqn: "@aws-cdk/aws-ecs.SplunkLogDriver", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3BsdW5rLWxvZy1kcml2ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzcGx1bmstbG9nLWRyaXZlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFHQSw2Q0FBMEQ7QUFDMUQsbUNBQXNIO0FBR3RIOztHQUVHO0FBQ0gsSUFBWSxlQUlYO0FBSkQsV0FBWSxlQUFlO0lBQ3pCLG9DQUFpQixDQUFBO0lBQ2pCLGdDQUFhLENBQUE7SUFDYiw4QkFBVyxDQUFBO0FBQ2IsQ0FBQyxFQUpXLGVBQWUsR0FBZix1QkFBZSxLQUFmLHVCQUFlLFFBSTFCO0FBNkdEOztHQUVHO0FBQ0gsTUFBYSxlQUFnQixTQUFRLHNCQUFTO0lBQzVDOzs7O09BSUc7SUFDSCxZQUE2QixLQUEyQjtRQUN0RCxLQUFLLEVBQUUsQ0FBQztRQURtQixVQUFLLEdBQUwsS0FBSyxDQUFzQjs7Ozs7OytDQU43QyxlQUFlOzs7O1FBU3hCLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsRUFBRTtZQUN0QyxNQUFNLElBQUksS0FBSyxDQUFDLDZDQUE2QyxDQUFDLENBQUM7U0FDaEU7UUFDRCxJQUFJLEtBQUssQ0FBQyxTQUFTLEVBQUU7WUFDbkIscUJBQWEsQ0FBQyxLQUFLLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1NBQ3ZDO0tBQ0Y7SUFFRDs7T0FFRztJQUNJLElBQUksQ0FBQyxNQUFpQixFQUFFLG9CQUF5Qzs7Ozs7Ozs7OztRQUN0RSxNQUFNLE9BQU8sR0FBRyx3QkFBZ0IsQ0FBQztZQUMvQixjQUFjLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsWUFBWSxFQUFFO1lBQ2hELFlBQVksRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUc7WUFDNUIsZUFBZSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTTtZQUNsQyxtQkFBbUIsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVU7WUFDMUMsY0FBYyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSztZQUNoQyxlQUFlLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNO1lBQ2xDLGVBQWUsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU07WUFDbEMsMkJBQTJCLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxrQkFBa0I7WUFDMUQsZUFBZSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTTtZQUNsQywwQkFBMEIsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLGdCQUFnQjtZQUN2RCxhQUFhLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJO1lBQzlCLG1CQUFtQixFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUztZQUN6QyxHQUFHLG9DQUE0QixDQUFDLElBQUksQ0FBQyxLQUFLLENBQUM7U0FDNUMsQ0FBQyxDQUFDO1FBRUgsT0FBTztZQUNMLFNBQVMsRUFBRSxRQUFRO1lBQ25CLE9BQU87WUFDUCxhQUFhLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLElBQUksb0NBQTRCLENBQUMsRUFBRSxjQUFjLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLEVBQUUsRUFBRSxvQkFBb0IsQ0FBQyxjQUFjLENBQUM7U0FDdkosQ0FBQztLQUNIOztBQTFDSCwwQ0EyQ0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBTZWNyZXRWYWx1ZSB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgeyBCYXNlTG9nRHJpdmVyUHJvcHMgfSBmcm9tICcuL2Jhc2UtbG9nLWRyaXZlcic7XG5pbXBvcnQgeyBMb2dEcml2ZXIsIExvZ0RyaXZlckNvbmZpZyB9IGZyb20gJy4vbG9nLWRyaXZlcic7XG5pbXBvcnQgeyBlbnN1cmVJblJhbmdlLCByZW5kZXJDb21tb25Mb2dEcml2ZXJPcHRpb25zLCByZW5kZXJMb2dEcml2ZXJTZWNyZXRPcHRpb25zLCBzdHJpbmdpZnlPcHRpb25zIH0gZnJvbSAnLi91dGlscyc7XG5pbXBvcnQgeyBDb250YWluZXJEZWZpbml0aW9uLCBTZWNyZXQgfSBmcm9tICcuLi9jb250YWluZXItZGVmaW5pdGlvbic7XG5cbi8qKlxuICogTG9nIE1lc3NhZ2UgRm9ybWF0XG4gKi9cbmV4cG9ydCBlbnVtIFNwbHVua0xvZ0Zvcm1hdCB7XG4gIElOTElORSA9ICdpbmxpbmUnLFxuICBKU09OID0gJ2pzb24nLFxuICBSQVcgPSAncmF3J1xufVxuXG4vKipcbiAqIFNwZWNpZmllcyB0aGUgc3BsdW5rIGxvZyBkcml2ZXIgY29uZmlndXJhdGlvbiBvcHRpb25zLlxuICpcbiAqIFtTb3VyY2VdKGh0dHBzOi8vZG9jcy5kb2NrZXIuY29tL2NvbmZpZy9jb250YWluZXJzL2xvZ2dpbmcvc3BsdW5rLylcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBTcGx1bmtMb2dEcml2ZXJQcm9wcyBleHRlbmRzIEJhc2VMb2dEcml2ZXJQcm9wcyB7XG4gIC8qKlxuICAgKiBTcGx1bmsgSFRUUCBFdmVudCBDb2xsZWN0b3IgdG9rZW4uXG4gICAqXG4gICAqIFRoZSBzcGx1bmstdG9rZW4gaXMgYWRkZWQgdG8gdGhlIE9wdGlvbnMgcHJvcGVydHkgb2YgdGhlIExvZyBEcml2ZXIgQ29uZmlndXJhdGlvbi4gU28gdGhlIHNlY3JldCB2YWx1ZSB3aWxsIGJlIHJlc29sdmVkIGFuZFxuICAgKiB2aWV3YWJsZSBpbiBwbGFpbiB0ZXh0IGluIHRoZSBjb25zb2xlLlxuICAgKlxuICAgKiBQbGVhc2UgcHJvdmlkZSBhdCBsZWFzdCBvbmUgb2YgYHRva2VuYCBvciBgc2VjcmV0VG9rZW5gLlxuICAgKiBAZGVwcmVjYXRlZCBVc2UgYFNwbHVua0xvZ0RyaXZlclByb3BzLnNlY3JldFRva2VuYCBpbnN0ZWFkLlxuICAgKiBAZGVmYXVsdCAtIHRva2VuIG5vdCBwcm92aWRlZC5cbiAgICovXG4gIHJlYWRvbmx5IHRva2VuPzogU2VjcmV0VmFsdWU7XG5cbiAgLyoqXG4gICAqIFNwbHVuayBIVFRQIEV2ZW50IENvbGxlY3RvciB0b2tlbiAoU2VjcmV0KS5cbiAgICpcbiAgICogVGhlIHNwbHVuay10b2tlbiBpcyBhZGRlZCB0byB0aGUgU2VjcmV0T3B0aW9ucyBwcm9wZXJ0eSBvZiB0aGUgTG9nIERyaXZlciBDb25maWd1cmF0aW9uLiBTbyB0aGUgc2VjcmV0IHZhbHVlIHdpbGwgbm90IGJlXG4gICAqIHJlc29sdmVkIG9yIHZpZXdhYmxlIGFzIHBsYWluIHRleHQuXG4gICAqL1xuICByZWFkb25seSBzZWNyZXRUb2tlbjogU2VjcmV0O1xuXG4gIC8qKlxuICAgKiBQYXRoIHRvIHlvdXIgU3BsdW5rIEVudGVycHJpc2UsIHNlbGYtc2VydmljZSBTcGx1bmsgQ2xvdWQgaW5zdGFuY2UsIG9yIFNwbHVua1xuICAgKiBDbG91ZCBtYW5hZ2VkIGNsdXN0ZXIgKGluY2x1ZGluZyBwb3J0IGFuZCBzY2hlbWUgdXNlZCBieSBIVFRQIEV2ZW50IENvbGxlY3RvcilcbiAgICogaW4gb25lIG9mIHRoZSBmb2xsb3dpbmcgZm9ybWF0czogaHR0cHM6Ly95b3VyX3NwbHVua19pbnN0YW5jZTo4MDg4IG9yXG4gICAqIGh0dHBzOi8vaW5wdXQtcHJkLXAtWFhYWFhYWC5jbG91ZC5zcGx1bmsuY29tOjgwODggb3IgaHR0cHM6Ly9odHRwLWlucHV0cy1YWFhYWFhYWC5zcGx1bmtjbG91ZC5jb20uXG4gICAqL1xuICByZWFkb25seSB1cmw6IHN0cmluZztcblxuICAvKipcbiAgICogRXZlbnQgc291cmNlLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIHNvdXJjZSBub3Qgc2V0LlxuICAgKi9cbiAgcmVhZG9ubHkgc291cmNlPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBFdmVudCBzb3VyY2UgdHlwZS5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBzb3VyY2VUeXBlIG5vdCBzZXQuXG4gICAqL1xuICByZWFkb25seSBzb3VyY2VUeXBlPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBFdmVudCBpbmRleC5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBpbmRleCBub3Qgc2V0LlxuICAgKi9cbiAgcmVhZG9ubHkgaW5kZXg/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFBhdGggdG8gcm9vdCBjZXJ0aWZpY2F0ZS5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBjYVBhdGggbm90IHNldC5cbiAgICovXG4gIHJlYWRvbmx5IGNhUGF0aD86IHN0cmluZztcblxuICAvKipcbiAgICogTmFtZSB0byB1c2UgZm9yIHZhbGlkYXRpbmcgc2VydmVyIGNlcnRpZmljYXRlLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIFRoZSBob3N0bmFtZSBvZiB0aGUgc3BsdW5rLXVybFxuICAgKi9cbiAgcmVhZG9ubHkgY2FOYW1lPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBJZ25vcmUgc2VydmVyIGNlcnRpZmljYXRlIHZhbGlkYXRpb24uXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gaW5zZWN1cmVTa2lwVmVyaWZ5IG5vdCBzZXQuXG4gICAqL1xuICByZWFkb25seSBpbnNlY3VyZVNraXBWZXJpZnk/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIE1lc3NhZ2UgZm9ybWF0LiBDYW4gYmUgaW5saW5lLCBqc29uIG9yIHJhdy5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBpbmxpbmVcbiAgICovXG4gIHJlYWRvbmx5IGZvcm1hdD86IFNwbHVua0xvZ0Zvcm1hdDtcblxuICAvKipcbiAgICogVmVyaWZ5IG9uIHN0YXJ0LCB0aGF0IGRvY2tlciBjYW4gY29ubmVjdCB0byBTcGx1bmsgc2VydmVyLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIHRydWVcbiAgICovXG4gIHJlYWRvbmx5IHZlcmlmeUNvbm5lY3Rpb24/OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBFbmFibGUvZGlzYWJsZSBnemlwIGNvbXByZXNzaW9uIHRvIHNlbmQgZXZlbnRzIHRvIFNwbHVuayBFbnRlcnByaXNlIG9yIFNwbHVua1xuICAgKiBDbG91ZCBpbnN0YW5jZS5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBmYWxzZVxuICAgKi9cbiAgcmVhZG9ubHkgZ3ppcD86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIFNldCBjb21wcmVzc2lvbiBsZXZlbCBmb3IgZ3ppcC4gVmFsaWQgdmFsdWVzIGFyZSAtMSAoZGVmYXVsdCksIDAgKG5vIGNvbXByZXNzaW9uKSxcbiAgICogMSAoYmVzdCBzcGVlZCkgLi4uIDkgKGJlc3QgY29tcHJlc3Npb24pLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIC0xIChEZWZhdWx0IENvbXByZXNzaW9uKVxuICAgKi9cbiAgcmVhZG9ubHkgZ3ppcExldmVsPzogbnVtYmVyO1xufVxuXG4vKipcbiAqIEEgbG9nIGRyaXZlciB0aGF0IHNlbmRzIGxvZyBpbmZvcm1hdGlvbiB0byBzcGx1bmsgTG9ncy5cbiAqL1xuZXhwb3J0IGNsYXNzIFNwbHVua0xvZ0RyaXZlciBleHRlbmRzIExvZ0RyaXZlciB7XG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RzIGEgbmV3IGluc3RhbmNlIG9mIHRoZSBTcGx1bmtMb2dEcml2ZXIgY2xhc3MuXG4gICAqXG4gICAqIEBwYXJhbSBwcm9wcyB0aGUgc3BsdW5rIGxvZyBkcml2ZXIgY29uZmlndXJhdGlvbiBvcHRpb25zLlxuICAgKi9cbiAgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSBwcm9wczogU3BsdW5rTG9nRHJpdmVyUHJvcHMpIHtcbiAgICBzdXBlcigpO1xuXG4gICAgaWYgKCFwcm9wcy50b2tlbiAmJiAhcHJvcHMuc2VjcmV0VG9rZW4pIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignUGxlYXNlIHByb3ZpZGUgZWl0aGVyIHRva2VuIG9yIHNlY3JldFRva2VuLicpO1xuICAgIH1cbiAgICBpZiAocHJvcHMuZ3ppcExldmVsKSB7XG4gICAgICBlbnN1cmVJblJhbmdlKHByb3BzLmd6aXBMZXZlbCwgLTEsIDkpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxsZWQgd2hlbiB0aGUgbG9nIGRyaXZlciBpcyBjb25maWd1cmVkIG9uIGEgY29udGFpbmVyXG4gICAqL1xuICBwdWJsaWMgYmluZChfc2NvcGU6IENvbnN0cnVjdCwgX2NvbnRhaW5lckRlZmluaXRpb246IENvbnRhaW5lckRlZmluaXRpb24pOiBMb2dEcml2ZXJDb25maWcge1xuICAgIGNvbnN0IG9wdGlvbnMgPSBzdHJpbmdpZnlPcHRpb25zKHtcbiAgICAgICdzcGx1bmstdG9rZW4nOiB0aGlzLnByb3BzLnRva2VuPy51bnNhZmVVbndyYXAoKSwgLy8gU2FmZSB1c2FnZVxuICAgICAgJ3NwbHVuay11cmwnOiB0aGlzLnByb3BzLnVybCxcbiAgICAgICdzcGx1bmstc291cmNlJzogdGhpcy5wcm9wcy5zb3VyY2UsXG4gICAgICAnc3BsdW5rLXNvdXJjZXR5cGUnOiB0aGlzLnByb3BzLnNvdXJjZVR5cGUsXG4gICAgICAnc3BsdW5rLWluZGV4JzogdGhpcy5wcm9wcy5pbmRleCxcbiAgICAgICdzcGx1bmstY2FwYXRoJzogdGhpcy5wcm9wcy5jYVBhdGgsXG4gICAgICAnc3BsdW5rLWNhbmFtZSc6IHRoaXMucHJvcHMuY2FOYW1lLFxuICAgICAgJ3NwbHVuay1pbnNlY3VyZXNraXB2ZXJpZnknOiB0aGlzLnByb3BzLmluc2VjdXJlU2tpcFZlcmlmeSxcbiAgICAgICdzcGx1bmstZm9ybWF0JzogdGhpcy5wcm9wcy5mb3JtYXQsXG4gICAgICAnc3BsdW5rLXZlcmlmeS1jb25uZWN0aW9uJzogdGhpcy5wcm9wcy52ZXJpZnlDb25uZWN0aW9uLFxuICAgICAgJ3NwbHVuay1nemlwJzogdGhpcy5wcm9wcy5nemlwLFxuICAgICAgJ3NwbHVuay1nemlwLWxldmVsJzogdGhpcy5wcm9wcy5nemlwTGV2ZWwsXG4gICAgICAuLi5yZW5kZXJDb21tb25Mb2dEcml2ZXJPcHRpb25zKHRoaXMucHJvcHMpLFxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIGxvZ0RyaXZlcjogJ3NwbHVuaycsXG4gICAgICBvcHRpb25zLFxuICAgICAgc2VjcmV0T3B0aW9uczogdGhpcy5wcm9wcy5zZWNyZXRUb2tlbiAmJiByZW5kZXJMb2dEcml2ZXJTZWNyZXRPcHRpb25zKHsgJ3NwbHVuay10b2tlbic6IHRoaXMucHJvcHMuc2VjcmV0VG9rZW4gfSwgX2NvbnRhaW5lckRlZmluaXRpb24udGFza0RlZmluaXRpb24pLFxuICAgIH07XG4gIH1cbn1cbiJdfQ==