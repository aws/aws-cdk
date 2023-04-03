"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProxyConfigurations = void 0;
const jsiiDeprecationWarnings = require("../../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const app_mesh_proxy_configuration_1 = require("./app-mesh-proxy-configuration");
/**
 * The base class for proxy configurations.
 */
class ProxyConfigurations {
    /**
     * Constructs a new instance of the ProxyConfiguration class.
     */
    static appMeshProxyConfiguration(props) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ecs_AppMeshProxyConfigurationConfigProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.appMeshProxyConfiguration);
            }
            throw error;
        }
        return new app_mesh_proxy_configuration_1.AppMeshProxyConfiguration(props);
    }
}
exports.ProxyConfigurations = ProxyConfigurations;
_a = JSII_RTTI_SYMBOL_1;
ProxyConfigurations[_a] = { fqn: "@aws-cdk/aws-ecs.ProxyConfigurations", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJveHktY29uZmlndXJhdGlvbnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJwcm94eS1jb25maWd1cmF0aW9ucy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxpRkFBaUg7QUFHakg7O0dBRUc7QUFDSCxNQUFhLG1CQUFtQjtJQUM5Qjs7T0FFRztJQUNJLE1BQU0sQ0FBQyx5QkFBeUIsQ0FBQyxLQUEyQzs7Ozs7Ozs7OztRQUNqRixPQUFPLElBQUksd0RBQXlCLENBQUMsS0FBSyxDQUFDLENBQUM7S0FDN0M7O0FBTkgsa0RBT0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBcHBNZXNoUHJveHlDb25maWd1cmF0aW9uLCBBcHBNZXNoUHJveHlDb25maWd1cmF0aW9uQ29uZmlnUHJvcHMgfSBmcm9tICcuL2FwcC1tZXNoLXByb3h5LWNvbmZpZ3VyYXRpb24nO1xuaW1wb3J0IHsgUHJveHlDb25maWd1cmF0aW9uIH0gZnJvbSAnLi9wcm94eS1jb25maWd1cmF0aW9uJztcblxuLyoqXG4gKiBUaGUgYmFzZSBjbGFzcyBmb3IgcHJveHkgY29uZmlndXJhdGlvbnMuXG4gKi9cbmV4cG9ydCBjbGFzcyBQcm94eUNvbmZpZ3VyYXRpb25zIHtcbiAgLyoqXG4gICAqIENvbnN0cnVjdHMgYSBuZXcgaW5zdGFuY2Ugb2YgdGhlIFByb3h5Q29uZmlndXJhdGlvbiBjbGFzcy5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgYXBwTWVzaFByb3h5Q29uZmlndXJhdGlvbihwcm9wczogQXBwTWVzaFByb3h5Q29uZmlndXJhdGlvbkNvbmZpZ1Byb3BzKTogUHJveHlDb25maWd1cmF0aW9uIHtcbiAgICByZXR1cm4gbmV3IEFwcE1lc2hQcm94eUNvbmZpZ3VyYXRpb24ocHJvcHMpO1xuICB9XG59Il19