"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppMeshProxyConfiguration = void 0;
const jsiiDeprecationWarnings = require("../../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const proxy_configuration_1 = require("./proxy-configuration");
/**
 * The class for App Mesh proxy configurations.
 *
 * For tasks using the EC2 launch type, the container instances require at least version 1.26.0 of the container agent and at least version
 * 1.26.0-1 of the ecs-init package to enable a proxy configuration. If your container instances are launched from the Amazon ECS-optimized
 * AMI version 20190301 or later, then they contain the required versions of the container agent and ecs-init.
 * For more information, see [Amazon ECS-optimized AMIs](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/ecs-optimized_AMI.html).
 *
 * For tasks using the Fargate launch type, the task or service requires platform version 1.3.0 or later.
 */
class AppMeshProxyConfiguration extends proxy_configuration_1.ProxyConfiguration {
    /**
     * Constructs a new instance of the AppMeshProxyConfiguration class.
     */
    constructor(props) {
        super();
        this.props = props;
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ecs_AppMeshProxyConfigurationConfigProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, AppMeshProxyConfiguration);
            }
            throw error;
        }
        if (props.properties) {
            if (!props.properties.ignoredUID && !props.properties.ignoredGID) {
                throw new Error('At least one of ignoredUID or ignoredGID should be specified.');
            }
        }
    }
    /**
     * Called when the proxy configuration is configured on a task definition.
     */
    bind(_scope, _taskDefinition) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ecs_TaskDefinition(_taskDefinition);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.bind);
            }
            throw error;
        }
        const configProps = this.props.properties;
        const configType = 'APPMESH';
        return {
            containerName: this.props.containerName,
            proxyConfigurationProperties: renderProperties(configProps),
            type: configType,
        };
    }
}
exports.AppMeshProxyConfiguration = AppMeshProxyConfiguration;
_a = JSII_RTTI_SYMBOL_1;
AppMeshProxyConfiguration[_a] = { fqn: "@aws-cdk/aws-ecs.AppMeshProxyConfiguration", version: "0.0.0" };
function renderProperties(props) {
    const ret = new Array();
    for (const [k, v] of Object.entries(props)) {
        const key = String(k);
        const value = String(v);
        if (value !== 'undefined' && value !== '') {
            const capitalizedKey = key.charAt(0).toUpperCase() + key.slice(1);
            ret.push({ ['name']: capitalizedKey, ['value']: value });
        }
    }
    return ret;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLW1lc2gtcHJveHktY29uZmlndXJhdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImFwcC1tZXNoLXByb3h5LWNvbmZpZ3VyYXRpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQ0EsK0RBQTJEO0FBOEQzRDs7Ozs7Ozs7O0dBU0c7QUFDSCxNQUFhLHlCQUEwQixTQUFRLHdDQUFrQjtJQUMvRDs7T0FFRztJQUNILFlBQTZCLEtBQTJDO1FBQ3RFLEtBQUssRUFBRSxDQUFDO1FBRG1CLFVBQUssR0FBTCxLQUFLLENBQXNDOzs7Ozs7K0NBSjdELHlCQUF5Qjs7OztRQU1sQyxJQUFJLEtBQUssQ0FBQyxVQUFVLEVBQUU7WUFDcEIsSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsVUFBVSxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxVQUFVLEVBQUU7Z0JBQ2hFLE1BQU0sSUFBSSxLQUFLLENBQUMsK0RBQStELENBQUMsQ0FBQzthQUNsRjtTQUNGO0tBQ0Y7SUFFRDs7T0FFRztJQUNJLElBQUksQ0FBQyxNQUFpQixFQUFFLGVBQStCOzs7Ozs7Ozs7O1FBQzVELE1BQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDO1FBQzFDLE1BQU0sVUFBVSxHQUFHLFNBQVMsQ0FBQztRQUM3QixPQUFPO1lBQ0wsYUFBYSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYTtZQUN2Qyw0QkFBNEIsRUFBRSxnQkFBZ0IsQ0FBQyxXQUFXLENBQUM7WUFDM0QsSUFBSSxFQUFFLFVBQVU7U0FDakIsQ0FBQztLQUNIOztBQXhCSCw4REF5QkM7OztBQUVELFNBQVMsZ0JBQWdCLENBQUMsS0FBcUM7SUFDN0QsTUFBTSxHQUFHLEdBQUcsSUFBSSxLQUFLLEVBQTBDLENBQUM7SUFDaEUsS0FBSyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLE1BQU0sQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEVBQUU7UUFDMUMsTUFBTSxHQUFHLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3RCLE1BQU0sS0FBSyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN4QixJQUFJLEtBQUssS0FBSyxXQUFXLElBQUksS0FBSyxLQUFLLEVBQUUsRUFBRTtZQUN6QyxNQUFNLGNBQWMsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDbEUsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLEVBQUUsY0FBYyxFQUFFLENBQUMsT0FBTyxDQUFDLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQztTQUMxRDtLQUNGO0lBQ0QsT0FBTyxHQUFHLENBQUM7QUFDYixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgeyBQcm94eUNvbmZpZ3VyYXRpb24gfSBmcm9tICcuL3Byb3h5LWNvbmZpZ3VyYXRpb24nO1xuaW1wb3J0IHsgVGFza0RlZmluaXRpb24gfSBmcm9tICcuLi9iYXNlL3Rhc2stZGVmaW5pdGlvbic7XG5pbXBvcnQgeyBDZm5UYXNrRGVmaW5pdGlvbiB9IGZyb20gJy4uL2Vjcy5nZW5lcmF0ZWQnO1xuXG4vKipcbiAqIEludGVyZmFjZSBmb3Igc2V0dGluZyB0aGUgcHJvcGVydGllcyBvZiBwcm94eSBjb25maWd1cmF0aW9uLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIEFwcE1lc2hQcm94eUNvbmZpZ3VyYXRpb25Qcm9wcyB7XG4gIC8qKlxuICAgKiBUaGUgdXNlciBJRCAoVUlEKSBvZiB0aGUgcHJveHkgY29udGFpbmVyIGFzIGRlZmluZWQgYnkgdGhlIHVzZXIgcGFyYW1ldGVyIGluIGEgY29udGFpbmVyIGRlZmluaXRpb24uXG4gICAqIFRoaXMgaXMgdXNlZCB0byBlbnN1cmUgdGhlIHByb3h5IGlnbm9yZXMgaXRzIG93biB0cmFmZmljLiBJZiBJZ25vcmVkR0lEIGlzIHNwZWNpZmllZCwgdGhpcyBmaWVsZCBjYW4gYmUgZW1wdHkuXG4gICAqL1xuICByZWFkb25seSBpZ25vcmVkVUlEPzogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBUaGUgZ3JvdXAgSUQgKEdJRCkgb2YgdGhlIHByb3h5IGNvbnRhaW5lciBhcyBkZWZpbmVkIGJ5IHRoZSB1c2VyIHBhcmFtZXRlciBpbiBhIGNvbnRhaW5lciBkZWZpbml0aW9uLlxuICAgKiBUaGlzIGlzIHVzZWQgdG8gZW5zdXJlIHRoZSBwcm94eSBpZ25vcmVzIGl0cyBvd24gdHJhZmZpYy4gSWYgSWdub3JlZFVJRCBpcyBzcGVjaWZpZWQsIHRoaXMgZmllbGQgY2FuIGJlIGVtcHR5LlxuICAgKi9cbiAgcmVhZG9ubHkgaWdub3JlZEdJRD86IG51bWJlcjtcblxuICAvKipcbiAgICogVGhlIGxpc3Qgb2YgcG9ydHMgdGhhdCB0aGUgYXBwbGljYXRpb24gdXNlcy5cbiAgICogTmV0d29yayB0cmFmZmljIHRvIHRoZXNlIHBvcnRzIGlzIGZvcndhcmRlZCB0byB0aGUgUHJveHlJbmdyZXNzUG9ydCBhbmQgUHJveHlFZ3Jlc3NQb3J0LlxuICAgKi9cbiAgcmVhZG9ubHkgYXBwUG9ydHM6IG51bWJlcltdO1xuXG4gIC8qKlxuICAgKiBTcGVjaWZpZXMgdGhlIHBvcnQgdGhhdCBpbmNvbWluZyB0cmFmZmljIHRvIHRoZSBBcHBQb3J0cyBpcyBkaXJlY3RlZCB0by5cbiAgICovXG4gIHJlYWRvbmx5IHByb3h5SW5ncmVzc1BvcnQ6IG51bWJlcjtcblxuICAvKipcbiAgICogU3BlY2lmaWVzIHRoZSBwb3J0IHRoYXQgb3V0Z29pbmcgdHJhZmZpYyBmcm9tIHRoZSBBcHBQb3J0cyBpcyBkaXJlY3RlZCB0by5cbiAgICovXG4gIHJlYWRvbmx5IHByb3h5RWdyZXNzUG9ydDogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBUaGUgZWdyZXNzIHRyYWZmaWMgZ29pbmcgdG8gdGhlc2Ugc3BlY2lmaWVkIHBvcnRzIGlzIGlnbm9yZWQgYW5kIG5vdCByZWRpcmVjdGVkIHRvIHRoZSBQcm94eUVncmVzc1BvcnQuIEl0IGNhbiBiZSBhbiBlbXB0eSBsaXN0LlxuICAgKi9cbiAgcmVhZG9ubHkgZWdyZXNzSWdub3JlZFBvcnRzPzogbnVtYmVyW107XG5cbiAgLyoqXG4gICAqIFRoZSBlZ3Jlc3MgdHJhZmZpYyBnb2luZyB0byB0aGVzZSBzcGVjaWZpZWQgSVAgYWRkcmVzc2VzIGlzIGlnbm9yZWQgYW5kIG5vdCByZWRpcmVjdGVkIHRvIHRoZSBQcm94eUVncmVzc1BvcnQuIEl0IGNhbiBiZSBhbiBlbXB0eSBsaXN0LlxuICAgKi9cbiAgcmVhZG9ubHkgZWdyZXNzSWdub3JlZElQcz86IHN0cmluZ1tdO1xufVxuXG4vKipcbiAqIFRoZSBjb25maWd1cmF0aW9uIHRvIHVzZSB3aGVuIHNldHRpbmcgYW4gQXBwIE1lc2ggcHJveHkgY29uZmlndXJhdGlvbi5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBBcHBNZXNoUHJveHlDb25maWd1cmF0aW9uQ29uZmlnUHJvcHMge1xuICAvKipcbiAgICogVGhlIG5hbWUgb2YgdGhlIGNvbnRhaW5lciB0aGF0IHdpbGwgc2VydmUgYXMgdGhlIEFwcCBNZXNoIHByb3h5LlxuICAgKi9cbiAgcmVhZG9ubHkgY29udGFpbmVyTmFtZTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgc2V0IG9mIG5ldHdvcmsgY29uZmlndXJhdGlvbiBwYXJhbWV0ZXJzIHRvIHByb3ZpZGUgdGhlIENvbnRhaW5lciBOZXR3b3JrIEludGVyZmFjZSAoQ05JKSBwbHVnaW4uXG4gICAqL1xuICByZWFkb25seSBwcm9wZXJ0aWVzOiBBcHBNZXNoUHJveHlDb25maWd1cmF0aW9uUHJvcHM7XG59XG5cbi8qKlxuICogVGhlIGNsYXNzIGZvciBBcHAgTWVzaCBwcm94eSBjb25maWd1cmF0aW9ucy5cbiAqXG4gKiBGb3IgdGFza3MgdXNpbmcgdGhlIEVDMiBsYXVuY2ggdHlwZSwgdGhlIGNvbnRhaW5lciBpbnN0YW5jZXMgcmVxdWlyZSBhdCBsZWFzdCB2ZXJzaW9uIDEuMjYuMCBvZiB0aGUgY29udGFpbmVyIGFnZW50IGFuZCBhdCBsZWFzdCB2ZXJzaW9uXG4gKiAxLjI2LjAtMSBvZiB0aGUgZWNzLWluaXQgcGFja2FnZSB0byBlbmFibGUgYSBwcm94eSBjb25maWd1cmF0aW9uLiBJZiB5b3VyIGNvbnRhaW5lciBpbnN0YW5jZXMgYXJlIGxhdW5jaGVkIGZyb20gdGhlIEFtYXpvbiBFQ1Mtb3B0aW1pemVkXG4gKiBBTUkgdmVyc2lvbiAyMDE5MDMwMSBvciBsYXRlciwgdGhlbiB0aGV5IGNvbnRhaW4gdGhlIHJlcXVpcmVkIHZlcnNpb25zIG9mIHRoZSBjb250YWluZXIgYWdlbnQgYW5kIGVjcy1pbml0LlxuICogRm9yIG1vcmUgaW5mb3JtYXRpb24sIHNlZSBbQW1hem9uIEVDUy1vcHRpbWl6ZWQgQU1Jc10oaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FtYXpvbkVDUy9sYXRlc3QvZGV2ZWxvcGVyZ3VpZGUvZWNzLW9wdGltaXplZF9BTUkuaHRtbCkuXG4gKlxuICogRm9yIHRhc2tzIHVzaW5nIHRoZSBGYXJnYXRlIGxhdW5jaCB0eXBlLCB0aGUgdGFzayBvciBzZXJ2aWNlIHJlcXVpcmVzIHBsYXRmb3JtIHZlcnNpb24gMS4zLjAgb3IgbGF0ZXIuXG4gKi9cbmV4cG9ydCBjbGFzcyBBcHBNZXNoUHJveHlDb25maWd1cmF0aW9uIGV4dGVuZHMgUHJveHlDb25maWd1cmF0aW9uIHtcbiAgLyoqXG4gICAqIENvbnN0cnVjdHMgYSBuZXcgaW5zdGFuY2Ugb2YgdGhlIEFwcE1lc2hQcm94eUNvbmZpZ3VyYXRpb24gY2xhc3MuXG4gICAqL1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IHByb3BzOiBBcHBNZXNoUHJveHlDb25maWd1cmF0aW9uQ29uZmlnUHJvcHMpIHtcbiAgICBzdXBlcigpO1xuICAgIGlmIChwcm9wcy5wcm9wZXJ0aWVzKSB7XG4gICAgICBpZiAoIXByb3BzLnByb3BlcnRpZXMuaWdub3JlZFVJRCAmJiAhcHJvcHMucHJvcGVydGllcy5pZ25vcmVkR0lEKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignQXQgbGVhc3Qgb25lIG9mIGlnbm9yZWRVSUQgb3IgaWdub3JlZEdJRCBzaG91bGQgYmUgc3BlY2lmaWVkLicpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxsZWQgd2hlbiB0aGUgcHJveHkgY29uZmlndXJhdGlvbiBpcyBjb25maWd1cmVkIG9uIGEgdGFzayBkZWZpbml0aW9uLlxuICAgKi9cbiAgcHVibGljIGJpbmQoX3Njb3BlOiBDb25zdHJ1Y3QsIF90YXNrRGVmaW5pdGlvbjogVGFza0RlZmluaXRpb24pOiBDZm5UYXNrRGVmaW5pdGlvbi5Qcm94eUNvbmZpZ3VyYXRpb25Qcm9wZXJ0eSB7XG4gICAgY29uc3QgY29uZmlnUHJvcHMgPSB0aGlzLnByb3BzLnByb3BlcnRpZXM7XG4gICAgY29uc3QgY29uZmlnVHlwZSA9ICdBUFBNRVNIJztcbiAgICByZXR1cm4ge1xuICAgICAgY29udGFpbmVyTmFtZTogdGhpcy5wcm9wcy5jb250YWluZXJOYW1lLFxuICAgICAgcHJveHlDb25maWd1cmF0aW9uUHJvcGVydGllczogcmVuZGVyUHJvcGVydGllcyhjb25maWdQcm9wcyksXG4gICAgICB0eXBlOiBjb25maWdUeXBlLFxuICAgIH07XG4gIH1cbn1cblxuZnVuY3Rpb24gcmVuZGVyUHJvcGVydGllcyhwcm9wczogQXBwTWVzaFByb3h5Q29uZmlndXJhdGlvblByb3BzKTogQ2ZuVGFza0RlZmluaXRpb24uS2V5VmFsdWVQYWlyUHJvcGVydHlbXSB7XG4gIGNvbnN0IHJldCA9IG5ldyBBcnJheTxDZm5UYXNrRGVmaW5pdGlvbi5LZXlWYWx1ZVBhaXJQcm9wZXJ0eT4oKTtcbiAgZm9yIChjb25zdCBbaywgdl0gb2YgT2JqZWN0LmVudHJpZXMocHJvcHMpKSB7XG4gICAgY29uc3Qga2V5ID0gU3RyaW5nKGspO1xuICAgIGNvbnN0IHZhbHVlID0gU3RyaW5nKHYpO1xuICAgIGlmICh2YWx1ZSAhPT0gJ3VuZGVmaW5lZCcgJiYgdmFsdWUgIT09ICcnKSB7XG4gICAgICBjb25zdCBjYXBpdGFsaXplZEtleSA9IGtleS5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIGtleS5zbGljZSgxKTtcbiAgICAgIHJldC5wdXNoKHsgWyduYW1lJ106IGNhcGl0YWxpemVkS2V5LCBbJ3ZhbHVlJ106IHZhbHVlIH0pO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmV0O1xufSJdfQ==