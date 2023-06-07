"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TargetGroupConfig = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const vpclattice = require("./index");
const constructs_1 = require("constructs");
/**
 * A TargetGroup Configuration
 */
class TargetGroupConfig extends constructs_1.Construct {
    constructor(scope, id, props) {
        super(scope, id);
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_vpclattice_alpha_TargetGroupConfigProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, TargetGroupConfig);
            }
            throw error;
        }
        // validate the ranges for the health check
        if (props.healthCheck?.healthCheckInterval) {
            if (props.healthCheck?.healthCheckInterval.toSeconds() < 5 || props.healthCheck?.healthCheckInterval.toSeconds() > 300) {
                throw new Error('HealthCheckInterval must be between 5 and 300 seconds');
            }
        }
        ;
        if (props.healthCheck?.healthCheckTimeout) {
            if (props.healthCheck?.healthCheckTimeout.toSeconds() < 1 || props.healthCheck?.healthCheckTimeout.toSeconds() > 120) {
                throw new Error('HealthCheckTimeout must be between 1 and 120seconds');
            }
        }
        ;
        if (props.healthCheck?.healthyThresholdCount) {
            if (props.healthCheck?.healthyThresholdCount < 1 || props.healthCheck?.healthyThresholdCount > 10) {
                throw new Error('HealthyThresholdCount must be between 1 and 10');
            }
        }
        ;
        // the enum returns a number, but we need a string, so convert
        let matcher = undefined;
        if (props.healthCheck?.matcher) {
            const codeAsString = props.healthCheck.matcher.toString();
            matcher = { httpCode: codeAsString };
        }
        ;
        // default for https is 443, otherwise 80
        var port = 80;
        if (!(props.healthCheck?.port) && props.healthCheck?.protocol) {
            if (props.healthCheck?.protocol === vpclattice.Protocol.HTTPS) {
                port = 443;
            }
        }
        ;
        if (props.protocolVersion) {
            if (props.protocolVersion === vpclattice.ProtocolVersion.GRPC) {
                throw new Error('GRPC is not supported');
            }
        }
        ;
        if (props.healthCheck?.unhealthyThresholdCount) {
            if (props.healthCheck?.unhealthyThresholdCount < 2 || props.healthCheck?.unhealthyThresholdCount > 10) {
                throw new Error('UnhealthyThresholdCount must be between 2 and 10');
            }
        }
        let targetHealthCheck = {
            enabled: props.healthCheck?.enabled ?? true,
            healthCheckIntervalSeconds: props.healthCheck?.healthCheckInterval?.toSeconds() ?? 30,
            healthCheckTimeoutSeconds: props.healthCheck?.healthCheckTimeout?.toSeconds() ?? 5,
            matcher: matcher,
            path: props.healthCheck?.path ?? '/',
            port: props.port ?? port,
            protocol: props.healthCheck?.protocol ?? 'HTTP',
            protocolVersion: props.healthCheck?.protocolVersion ?? 'HTTP1',
            unhealthyThresholdCount: props.healthCheck?.unhealthyThresholdCount ?? 2,
        };
        this.targetGroupCfg = {
            port: props.port,
            protocol: props.protocol,
            vpcIdentifier: props.vpc.vpcId,
            ipAddressType: props.ipAddressType ?? vpclattice.IpAddressType.IPV4,
            protocolVersion: props.protocolVersion ?? vpclattice.ProtocolVersion.HTTP1,
            healthCheck: targetHealthCheck,
        };
    }
}
_a = JSII_RTTI_SYMBOL_1;
TargetGroupConfig[_a] = { fqn: "@aws-cdk/aws-vpclattice-alpha.TargetGroupConfig", version: "0.0.0" };
exports.TargetGroupConfig = TargetGroupConfig;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFyZ2V0cy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInRhcmdldHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBU0Esc0NBQXNDO0FBQ3RDLDJDQUF1QztBQTBHdkM7O0dBRUc7QUFDSCxNQUFhLGlCQUFrQixTQUFRLHNCQUFTO0lBTzlDLFlBQVksS0FBMkIsRUFBRSxFQUFVLEVBQUUsS0FBNkI7UUFDaEYsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQzs7Ozs7OytDQVJSLGlCQUFpQjs7OztRQVUxQiwyQ0FBMkM7UUFDM0MsSUFBSSxLQUFLLENBQUMsV0FBVyxFQUFFLG1CQUFtQixFQUFFO1lBQzFDLElBQUksS0FBSyxDQUFDLFdBQVcsRUFBRSxtQkFBbUIsQ0FBQyxTQUFTLEVBQUUsR0FBRyxDQUFDLElBQUksS0FBSyxDQUFDLFdBQVcsRUFBRSxtQkFBbUIsQ0FBQyxTQUFTLEVBQUUsR0FBRyxHQUFHLEVBQUU7Z0JBQ3RILE1BQU0sSUFBSSxLQUFLLENBQUMsdURBQXVELENBQUMsQ0FBQzthQUMxRTtTQUNGO1FBQUEsQ0FBQztRQUVGLElBQUksS0FBSyxDQUFDLFdBQVcsRUFBRSxrQkFBa0IsRUFBRTtZQUN6QyxJQUFJLEtBQUssQ0FBQyxXQUFXLEVBQUUsa0JBQWtCLENBQUMsU0FBUyxFQUFFLEdBQUcsQ0FBQyxJQUFJLEtBQUssQ0FBQyxXQUFXLEVBQUUsa0JBQWtCLENBQUMsU0FBUyxFQUFFLEdBQUcsR0FBRyxFQUFFO2dCQUNwSCxNQUFNLElBQUksS0FBSyxDQUFDLHFEQUFxRCxDQUFDLENBQUM7YUFDeEU7U0FDRjtRQUFBLENBQUM7UUFFRixJQUFJLEtBQUssQ0FBQyxXQUFXLEVBQUUscUJBQXFCLEVBQUU7WUFDNUMsSUFBSSxLQUFLLENBQUMsV0FBVyxFQUFFLHFCQUFxQixHQUFHLENBQUMsSUFBSSxLQUFLLENBQUMsV0FBVyxFQUFFLHFCQUFxQixHQUFHLEVBQUUsRUFBRTtnQkFDakcsTUFBTSxJQUFJLEtBQUssQ0FBQyxnREFBZ0QsQ0FBQyxDQUFDO2FBQ25FO1NBQ0Y7UUFBQSxDQUFDO1FBQ0YsOERBQThEO1FBQzlELElBQUksT0FBTyxHQUE4RCxTQUFTLENBQUM7UUFDbkYsSUFBSSxLQUFLLENBQUMsV0FBVyxFQUFFLE9BQU8sRUFBRTtZQUM5QixNQUFNLFlBQVksR0FBRyxLQUFLLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsQ0FBQztZQUMxRCxPQUFPLEdBQUcsRUFBRSxRQUFRLEVBQUUsWUFBWSxFQUFFLENBQUM7U0FDdEM7UUFBQSxDQUFDO1FBRUYseUNBQXlDO1FBQ3pDLElBQUksSUFBSSxHQUFXLEVBQUUsQ0FBQztRQUN0QixJQUFJLENBQUMsQ0FBQyxLQUFLLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxJQUFJLEtBQUssQ0FBQyxXQUFXLEVBQUUsUUFBUSxFQUFFO1lBQzdELElBQUksS0FBSyxDQUFDLFdBQVcsRUFBRSxRQUFRLEtBQUssVUFBVSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUU7Z0JBQzdELElBQUksR0FBRyxHQUFHLENBQUM7YUFDWjtTQUNGO1FBQUEsQ0FBQztRQUVGLElBQUksS0FBSyxDQUFDLGVBQWUsRUFBRTtZQUN6QixJQUFJLEtBQUssQ0FBQyxlQUFlLEtBQUssVUFBVSxDQUFDLGVBQWUsQ0FBQyxJQUFJLEVBQUU7Z0JBQzdELE1BQU0sSUFBSSxLQUFLLENBQUMsdUJBQXVCLENBQUMsQ0FBQzthQUMxQztTQUNGO1FBQUEsQ0FBQztRQUVGLElBQUksS0FBSyxDQUFDLFdBQVcsRUFBRSx1QkFBdUIsRUFBRTtZQUM5QyxJQUFJLEtBQUssQ0FBQyxXQUFXLEVBQUUsdUJBQXVCLEdBQUcsQ0FBQyxJQUFJLEtBQUssQ0FBQyxXQUFXLEVBQUUsdUJBQXVCLEdBQUcsRUFBRSxFQUFFO2dCQUNyRyxNQUFNLElBQUksS0FBSyxDQUFDLGtEQUFrRCxDQUFDLENBQUM7YUFDckU7U0FDRjtRQUVELElBQUksaUJBQWlCLEdBQTREO1lBQy9FLE9BQU8sRUFBRSxLQUFLLENBQUMsV0FBVyxFQUFFLE9BQU8sSUFBSSxJQUFJO1lBQzNDLDBCQUEwQixFQUFFLEtBQUssQ0FBQyxXQUFXLEVBQUUsbUJBQW1CLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRTtZQUNyRix5QkFBeUIsRUFBRSxLQUFLLENBQUMsV0FBVyxFQUFFLGtCQUFrQixFQUFFLFNBQVMsRUFBRSxJQUFJLENBQUM7WUFDbEYsT0FBTyxFQUFFLE9BQU87WUFDaEIsSUFBSSxFQUFFLEtBQUssQ0FBQyxXQUFXLEVBQUUsSUFBSSxJQUFJLEdBQUc7WUFDcEMsSUFBSSxFQUFFLEtBQUssQ0FBQyxJQUFJLElBQUksSUFBSTtZQUN4QixRQUFRLEVBQUUsS0FBSyxDQUFDLFdBQVcsRUFBRSxRQUFRLElBQUksTUFBTTtZQUMvQyxlQUFlLEVBQUUsS0FBSyxDQUFDLFdBQVcsRUFBRSxlQUFlLElBQUksT0FBTztZQUM5RCx1QkFBdUIsRUFBRSxLQUFLLENBQUMsV0FBVyxFQUFFLHVCQUF1QixJQUFJLENBQUM7U0FDekUsQ0FBQztRQUVGLElBQUksQ0FBQyxjQUFjLEdBQUc7WUFDcEIsSUFBSSxFQUFFLEtBQUssQ0FBQyxJQUFJO1lBQ2hCLFFBQVEsRUFBRSxLQUFLLENBQUMsUUFBUTtZQUN4QixhQUFhLEVBQUUsS0FBSyxDQUFDLEdBQUcsQ0FBQyxLQUFLO1lBQzlCLGFBQWEsRUFBRSxLQUFLLENBQUMsYUFBYSxJQUFJLFVBQVUsQ0FBQyxhQUFhLENBQUMsSUFBSTtZQUNuRSxlQUFlLEVBQUUsS0FBSyxDQUFDLGVBQWUsSUFBSSxVQUFVLENBQUMsZUFBZSxDQUFDLEtBQUs7WUFDMUUsV0FBVyxFQUFFLGlCQUFpQjtTQUMvQixDQUFDO0tBQ0g7Ozs7QUEzRVUsOENBQWlCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgY29yZSBmcm9tICdhd3MtY2RrLWxpYic7XG5cbmltcG9ydCB7XG4gIGF3c192cGNsYXR0aWNlLFxuICBhd3NfZWMyIGFzIGVjMixcbn1cbiAgZnJvbSAnYXdzLWNkay1saWInO1xuXG5pbXBvcnQgKiBhcyBjb25zdHJ1Y3RzIGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0ICogYXMgdnBjbGF0dGljZSBmcm9tICcuL2luZGV4JztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuXG4vKipcbiAqIEEgd2VpZ2h0ZWQgdGFyZ2V0IGdyb3VwIGFkZHMgYSB3ZWlnaHRpbmcgdG8gYSB0YXJnZXQgZ3JvdXAuXG4gKiB3aGVuIG1vcmUgdGhhbiBvbmUgV2VpZ2h0ZWRUYXJnZXRHcm91cCBpcyBwcm92aWRlZCBhcyB0aGUgYWN0aW9uXG4gKiBmb3IgYSBsaXN0ZW5lciwgdGhlIHdlaWdodHMgYXJlIHVzZWQgdG8gZGV0ZXJtaW5lIHRoZSByZWxhdGl2ZSBwcm9wb3J0aW9uXG4gKiBvZiB0cmFmZmljIHRoYXQgaXMgc2VudCB0byB0aGUgdGFyZ2V0XG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgV2VpZ2h0ZWRUYXJnZXRHcm91cCB7XG4gIC8qKlxuICAgKiBBIHRhcmdldCBHcm91cFxuICAgKi9cbiAgcmVhZG9ubHkgdGFyZ2V0R3JvdXA6IHZwY2xhdHRpY2UuVGFyZ2V0R3JvdXAsXG4gIC8qKlxuICAqIEEgd2VpZ2h0IGZvciB0aGUgdGFyZ2V0IGdyb3VwLlxuICAqIEBkZWZhdWx0IDEwMFxuICAqL1xuICByZWFkb25seSB3ZWlnaHQ/OiBudW1iZXIgfCB1bmRlZmluZWRcbn1cbi8qKlxuICogQSBDb25maWd1cmF0aW9uIG9mIHRoZSBUYXJnZXRHcm91cCBIZWFsdGggQ2hlY2suXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgVGFyZ2V0R3JvdXBIZWFsdGhDaGVjayB7XG4gIC8qKlxuICAgKiBFbmFibGUgdGhpcyBIZWFsdGggQ2hlY2tcbiAgICogQGRlZmF1bHQgdHJ1ZVxuICAgKi9cbiAgcmVhZG9ubHkgZW5hYmxlZD86IGJvb2xlYW4gfCB1bmRlZmluZWQsXG4gIC8qKlxuICAgKiBIZWFsdGggQ2hlY2sgSW50ZXJ2YWxcbiAgICogQGRlZmF1bHQgMzAgc2Vjb25kc1xuICAgKi9cbiAgcmVhZG9ubHkgaGVhbHRoQ2hlY2tJbnRlcnZhbD86IGNvcmUuRHVyYXRpb24gfCB1bmRlZmluZWRcbiAgLyoqXG4gICAqIFRpbWVPdXQgUGVyaW9kXG4gICAqIEBkZWZhdWx0IDUgc2Vjb25kc1xuICAgKi9cbiAgcmVhZG9ubHkgaGVhbHRoQ2hlY2tUaW1lb3V0PzogY29yZS5EdXJhdGlvbiB8IHVuZGVmaW5lZFxuICAvKipcbiAgICogTnVtYmVyIG9mIEhlYWx0aHkgUmVzcG9uc2VzIGJlZm9yZSBUYXJnZXQgaXMgY29uc2lkZXJlZCBoZWFsdGh5XG4gICAqIEBkZWZhdWx0IDJcbiAgICovXG4gIHJlYWRvbmx5IGhlYWx0aHlUaHJlc2hvbGRDb3VudD86IG51bWJlciB8IHVuZGVmaW5lZFxuICAvKipcbiAgICogQ2hlY2sgYmFzZWQgb24gUmVzcG9uc2UgZnJvbSB0YXJnZXRcbiAgICogQGRlZmF1bHQgMjAwIE9LXG4gICAqL1xuICByZWFkb25seSBtYXRjaGVyPzogdnBjbGF0dGljZS5GaXhlZFJlc3BvbnNlIHwgdW5kZWZpbmVkXG4gIC8qKlxuICAgKiBQYXRoIHRvIHVzZSBmb3IgSGVhbHRoIENoZWNrXG4gICAqIEBkZWZhdWx0ICcvJ1xuICAgKi9cbiAgcmVhZG9ubHkgcGF0aD86IHN0cmluZyB8IHVuZGVmaW5lZFxuICAvKipcbiAgICogUG9ydCB0byB1c2UgZm9yIEhlYWx0aCBDaGVja1xuICAgKiBAZGVmYXVsdCA0NDNcbiAgICovXG4gIHJlYWRvbmx5IHBvcnQ/OiBudW1iZXIgfCB1bmRlZmluZWRcbiAgLyoqXG4gICAqIFByb3RvY29sIHRvIHVzZSBmb3IgSGVhbHRoIENoZWNrXG4gICAqIEBkZWZhdWx0IEhUVFBTXG4gICAqL1xuICByZWFkb25seSBwcm90b2NvbD86IHZwY2xhdHRpY2UuUHJvdG9jb2wgfCB1bmRlZmluZWRcbiAgLyoqXG4gICAqIFByb3RvY29sIHRvIHVzZSBmb3IgSGVhbHRoIENoZWNrXG4gICAqIEBkZWZhdWx0IEhUVFAyXG4gICAqL1xuICByZWFkb25seSBwcm90b2NvbFZlcnNpb24/OiB2cGNsYXR0aWNlLlByb3RvY29sVmVyc2lvbiB8IHVuZGVmaW5lZFxuICAvKipcbiAgICogTnVtYmVyIG9mIHVuaGVhbHR5IGV2ZW50cyBiZWZvcmUgVGFyZ2V0IGlzIGNvbnNpZGVyZWQgdW5oZWFsdGh5XG4gICAqIEBkZWZhdWx0IDFcbiAgICovXG4gIHJlYWRvbmx5IHVuaGVhbHRoeVRocmVzaG9sZENvdW50PzogbnVtYmVyIHwgdW5kZWZpbmVkXG59XG4vKipcbiAqIFRhcmdldCBHcm91cCBDb25maWd1cmF0aW9uIFByb3BlcnRpZXNcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBUYXJnZXRHcm91cENvbmZpZ1Byb3BzIHtcbiAgLyoqXG4gICAqIFRoZSBwb3J0IHRvIGxpc3RlbiBvblxuICAgKi9cbiAgcmVhZG9ubHkgcG9ydDogbnVtYmVyO1xuICAvKipcbiAgICogVGhlIHByb3RvY29sIHRvIGxpc3RlbiBvblxuICAgKi9cbiAgcmVhZG9ubHkgcHJvdG9jb2w6IHZwY2xhdHRpY2UuUHJvdG9jb2w7XG4gIC8qKlxuICAgKiBUaGUgVlBDIHRvIHVzZVxuICAgKi9cbiAgcmVhZG9ubHkgdnBjOiBlYzIuVnBjO1xuICAvKipcbiAgICogVGhlIElQIEFkZHJlc3MgVHlwZVxuICAgKiBAZGVmYXVsdCBpcHY0XG4gICAqL1xuICByZWFkb25seSBpcEFkZHJlc3NUeXBlPzogdnBjbGF0dGljZS5JcEFkZHJlc3NUeXBlIHwgdW5kZWZpbmVkO1xuICAvKipcbiAgICogVGhlIFByb3RvY29sIFZlcnNpb25zXG4gICAqIEBkZWZhdWx0IEhUVFAyXG4gICAqL1xuICByZWFkb25seSBwcm90b2NvbFZlcnNpb24/OiB2cGNsYXR0aWNlLlByb3RvY29sVmVyc2lvbiB8IHVuZGVmaW5lZDtcbiAgLyoqXG4gICAqIFRoZSBIZWFsdGggQ2hlY2sgdG8gdXNlXG4gICAqIEBkZWZhdWx0IG5vbmVcbiAgICovXG4gIHJlYWRvbmx5IGhlYWx0aENoZWNrPzogVGFyZ2V0R3JvdXBIZWFsdGhDaGVjayB8IHVuZGVmaW5lZDtcbn1cbi8qKlxuICogQSBUYXJnZXRHcm91cCBDb25maWd1cmF0aW9uXG4gKi9cbmV4cG9ydCBjbGFzcyBUYXJnZXRHcm91cENvbmZpZyBleHRlbmRzIENvbnN0cnVjdCB7XG5cbiAgLyoqXG4gICAqIFRoZSBjb25maWd1cmF0aW9uXG4gICAqL1xuICB0YXJnZXRHcm91cENmZzogYXdzX3ZwY2xhdHRpY2UuQ2ZuVGFyZ2V0R3JvdXAuVGFyZ2V0R3JvdXBDb25maWdQcm9wZXJ0eTtcblxuICBjb25zdHJ1Y3RvcihzY29wZTogY29uc3RydWN0cy5Db25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBUYXJnZXRHcm91cENvbmZpZ1Byb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkKTtcblxuICAgIC8vIHZhbGlkYXRlIHRoZSByYW5nZXMgZm9yIHRoZSBoZWFsdGggY2hlY2tcbiAgICBpZiAocHJvcHMuaGVhbHRoQ2hlY2s/LmhlYWx0aENoZWNrSW50ZXJ2YWwpIHtcbiAgICAgIGlmIChwcm9wcy5oZWFsdGhDaGVjaz8uaGVhbHRoQ2hlY2tJbnRlcnZhbC50b1NlY29uZHMoKSA8IDUgfHwgcHJvcHMuaGVhbHRoQ2hlY2s/LmhlYWx0aENoZWNrSW50ZXJ2YWwudG9TZWNvbmRzKCkgPiAzMDApIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdIZWFsdGhDaGVja0ludGVydmFsIG11c3QgYmUgYmV0d2VlbiA1IGFuZCAzMDAgc2Vjb25kcycpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBpZiAocHJvcHMuaGVhbHRoQ2hlY2s/LmhlYWx0aENoZWNrVGltZW91dCkge1xuICAgICAgaWYgKHByb3BzLmhlYWx0aENoZWNrPy5oZWFsdGhDaGVja1RpbWVvdXQudG9TZWNvbmRzKCkgPCAxIHx8IHByb3BzLmhlYWx0aENoZWNrPy5oZWFsdGhDaGVja1RpbWVvdXQudG9TZWNvbmRzKCkgPiAxMjApIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdIZWFsdGhDaGVja1RpbWVvdXQgbXVzdCBiZSBiZXR3ZWVuIDEgYW5kIDEyMHNlY29uZHMnKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgaWYgKHByb3BzLmhlYWx0aENoZWNrPy5oZWFsdGh5VGhyZXNob2xkQ291bnQpIHtcbiAgICAgIGlmIChwcm9wcy5oZWFsdGhDaGVjaz8uaGVhbHRoeVRocmVzaG9sZENvdW50IDwgMSB8fCBwcm9wcy5oZWFsdGhDaGVjaz8uaGVhbHRoeVRocmVzaG9sZENvdW50ID4gMTApIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdIZWFsdGh5VGhyZXNob2xkQ291bnQgbXVzdCBiZSBiZXR3ZWVuIDEgYW5kIDEwJyk7XG4gICAgICB9XG4gICAgfTtcbiAgICAvLyB0aGUgZW51bSByZXR1cm5zIGEgbnVtYmVyLCBidXQgd2UgbmVlZCBhIHN0cmluZywgc28gY29udmVydFxuICAgIGxldCBtYXRjaGVyOiBhd3NfdnBjbGF0dGljZS5DZm5UYXJnZXRHcm91cC5NYXRjaGVyUHJvcGVydHkgfCB1bmRlZmluZWQgPSB1bmRlZmluZWQ7XG4gICAgaWYgKHByb3BzLmhlYWx0aENoZWNrPy5tYXRjaGVyKSB7XG4gICAgICBjb25zdCBjb2RlQXNTdHJpbmcgPSBwcm9wcy5oZWFsdGhDaGVjay5tYXRjaGVyLnRvU3RyaW5nKCk7XG4gICAgICBtYXRjaGVyID0geyBodHRwQ29kZTogY29kZUFzU3RyaW5nIH07XG4gICAgfTtcblxuICAgIC8vIGRlZmF1bHQgZm9yIGh0dHBzIGlzIDQ0Mywgb3RoZXJ3aXNlIDgwXG4gICAgdmFyIHBvcnQ6IG51bWJlciA9IDgwO1xuICAgIGlmICghKHByb3BzLmhlYWx0aENoZWNrPy5wb3J0KSAmJiBwcm9wcy5oZWFsdGhDaGVjaz8ucHJvdG9jb2wpIHtcbiAgICAgIGlmIChwcm9wcy5oZWFsdGhDaGVjaz8ucHJvdG9jb2wgPT09IHZwY2xhdHRpY2UuUHJvdG9jb2wuSFRUUFMpIHtcbiAgICAgICAgcG9ydCA9IDQ0MztcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgaWYgKHByb3BzLnByb3RvY29sVmVyc2lvbikge1xuICAgICAgaWYgKHByb3BzLnByb3RvY29sVmVyc2lvbiA9PT0gdnBjbGF0dGljZS5Qcm90b2NvbFZlcnNpb24uR1JQQykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0dSUEMgaXMgbm90IHN1cHBvcnRlZCcpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBpZiAocHJvcHMuaGVhbHRoQ2hlY2s/LnVuaGVhbHRoeVRocmVzaG9sZENvdW50KSB7XG4gICAgICBpZiAocHJvcHMuaGVhbHRoQ2hlY2s/LnVuaGVhbHRoeVRocmVzaG9sZENvdW50IDwgMiB8fCBwcm9wcy5oZWFsdGhDaGVjaz8udW5oZWFsdGh5VGhyZXNob2xkQ291bnQgPiAxMCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1VuaGVhbHRoeVRocmVzaG9sZENvdW50IG11c3QgYmUgYmV0d2VlbiAyIGFuZCAxMCcpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGxldCB0YXJnZXRIZWFsdGhDaGVjazogYXdzX3ZwY2xhdHRpY2UuQ2ZuVGFyZ2V0R3JvdXAuSGVhbHRoQ2hlY2tDb25maWdQcm9wZXJ0eSA9IHtcbiAgICAgIGVuYWJsZWQ6IHByb3BzLmhlYWx0aENoZWNrPy5lbmFibGVkID8/IHRydWUsXG4gICAgICBoZWFsdGhDaGVja0ludGVydmFsU2Vjb25kczogcHJvcHMuaGVhbHRoQ2hlY2s/LmhlYWx0aENoZWNrSW50ZXJ2YWw/LnRvU2Vjb25kcygpID8/IDMwLFxuICAgICAgaGVhbHRoQ2hlY2tUaW1lb3V0U2Vjb25kczogcHJvcHMuaGVhbHRoQ2hlY2s/LmhlYWx0aENoZWNrVGltZW91dD8udG9TZWNvbmRzKCkgPz8gNSxcbiAgICAgIG1hdGNoZXI6IG1hdGNoZXIsXG4gICAgICBwYXRoOiBwcm9wcy5oZWFsdGhDaGVjaz8ucGF0aCA/PyAnLycsXG4gICAgICBwb3J0OiBwcm9wcy5wb3J0ID8/IHBvcnQsXG4gICAgICBwcm90b2NvbDogcHJvcHMuaGVhbHRoQ2hlY2s/LnByb3RvY29sID8/ICdIVFRQJyxcbiAgICAgIHByb3RvY29sVmVyc2lvbjogcHJvcHMuaGVhbHRoQ2hlY2s/LnByb3RvY29sVmVyc2lvbiA/PyAnSFRUUDEnLFxuICAgICAgdW5oZWFsdGh5VGhyZXNob2xkQ291bnQ6IHByb3BzLmhlYWx0aENoZWNrPy51bmhlYWx0aHlUaHJlc2hvbGRDb3VudCA/PyAyLFxuICAgIH07XG5cbiAgICB0aGlzLnRhcmdldEdyb3VwQ2ZnID0ge1xuICAgICAgcG9ydDogcHJvcHMucG9ydCxcbiAgICAgIHByb3RvY29sOiBwcm9wcy5wcm90b2NvbCxcbiAgICAgIHZwY0lkZW50aWZpZXI6IHByb3BzLnZwYy52cGNJZCxcbiAgICAgIGlwQWRkcmVzc1R5cGU6IHByb3BzLmlwQWRkcmVzc1R5cGUgPz8gdnBjbGF0dGljZS5JcEFkZHJlc3NUeXBlLklQVjQsXG4gICAgICBwcm90b2NvbFZlcnNpb246IHByb3BzLnByb3RvY29sVmVyc2lvbiA/PyB2cGNsYXR0aWNlLlByb3RvY29sVmVyc2lvbi5IVFRQMSxcbiAgICAgIGhlYWx0aENoZWNrOiB0YXJnZXRIZWFsdGhDaGVjayxcbiAgICB9O1xuICB9XG59Il19