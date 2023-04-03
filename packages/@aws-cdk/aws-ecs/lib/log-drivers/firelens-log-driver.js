"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FireLensLogDriver = void 0;
const jsiiDeprecationWarnings = require("../../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const log_driver_1 = require("./log-driver");
const utils_1 = require("./utils");
/**
 * FireLens enables you to use task definition parameters to route logs to an AWS service
 *  or AWS Partner Network (APN) destination for log storage and analytics
 */
class FireLensLogDriver extends log_driver_1.LogDriver {
    /**
     * Constructs a new instance of the FireLensLogDriver class.
     * @param props the awsfirelens log driver configuration options.
     */
    constructor(props) {
        super();
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ecs_FireLensLogDriverProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, FireLensLogDriver);
            }
            throw error;
        }
        this.options = props.options;
        this.secretOptions = props.secretOptions;
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
            logDriver: 'awsfirelens',
            ...(this.options && { options: utils_1.removeEmpty(this.options) }),
            secretOptions: this.secretOptions && utils_1.renderLogDriverSecretOptions(this.secretOptions, _containerDefinition.taskDefinition),
        };
    }
}
exports.FireLensLogDriver = FireLensLogDriver;
_a = JSII_RTTI_SYMBOL_1;
FireLensLogDriver[_a] = { fqn: "@aws-cdk/aws-ecs.FireLensLogDriver", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlyZWxlbnMtbG9nLWRyaXZlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImZpcmVsZW5zLWxvZy1kcml2ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBRUEsNkNBQTBEO0FBQzFELG1DQUFvRTtBQW9CcEU7OztHQUdHO0FBQ0gsTUFBYSxpQkFBa0IsU0FBUSxzQkFBUztJQWE5Qzs7O09BR0c7SUFDSCxZQUFZLEtBQTZCO1FBQ3ZDLEtBQUssRUFBRSxDQUFDOzs7Ozs7K0NBbEJDLGlCQUFpQjs7OztRQW9CMUIsSUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDO1FBQzdCLElBQUksQ0FBQyxhQUFhLEdBQUcsS0FBSyxDQUFDLGFBQWEsQ0FBQztLQUMxQztJQUVEOztPQUVHO0lBQ0ksSUFBSSxDQUFDLE1BQWlCLEVBQUUsb0JBQXlDOzs7Ozs7Ozs7O1FBQ3RFLE9BQU87WUFDTCxTQUFTLEVBQUUsYUFBYTtZQUN4QixHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sSUFBSSxFQUFFLE9BQU8sRUFBRSxtQkFBVyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDO1lBQzNELGFBQWEsRUFBRSxJQUFJLENBQUMsYUFBYSxJQUFJLG9DQUE0QixDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsb0JBQW9CLENBQUMsY0FBYyxDQUFDO1NBQzNILENBQUM7S0FDSDs7QUFqQ0gsOENBa0NDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgeyBCYXNlTG9nRHJpdmVyUHJvcHMgfSBmcm9tICcuL2Jhc2UtbG9nLWRyaXZlcic7XG5pbXBvcnQgeyBMb2dEcml2ZXIsIExvZ0RyaXZlckNvbmZpZyB9IGZyb20gJy4vbG9nLWRyaXZlcic7XG5pbXBvcnQgeyByZW1vdmVFbXB0eSwgcmVuZGVyTG9nRHJpdmVyU2VjcmV0T3B0aW9ucyB9IGZyb20gJy4vdXRpbHMnO1xuaW1wb3J0IHsgQ29udGFpbmVyRGVmaW5pdGlvbiwgU2VjcmV0IH0gZnJvbSAnLi4vY29udGFpbmVyLWRlZmluaXRpb24nO1xuXG4vKipcbiAqIFNwZWNpZmllcyB0aGUgZmlyZWxlbnMgbG9nIGRyaXZlciBjb25maWd1cmF0aW9uIG9wdGlvbnMuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgRmlyZUxlbnNMb2dEcml2ZXJQcm9wcyBleHRlbmRzIEJhc2VMb2dEcml2ZXJQcm9wcyB7XG4gIC8qKlxuICAgKiBUaGUgY29uZmlndXJhdGlvbiBvcHRpb25zIHRvIHNlbmQgdG8gdGhlIGxvZyBkcml2ZXIuXG4gICAqIEBkZWZhdWx0IC0gdGhlIGxvZyBkcml2ZXIgb3B0aW9uc1xuICAgKi9cbiAgcmVhZG9ubHkgb3B0aW9ucz86IHsgW2tleTogc3RyaW5nXTogc3RyaW5nIH07XG5cbiAgLyoqXG4gICAqIFRoZSBzZWNyZXRzIHRvIHBhc3MgdG8gdGhlIGxvZyBjb25maWd1cmF0aW9uLlxuICAgKiBAZGVmYXVsdCAtIE5vIHNlY3JldCBvcHRpb25zIHByb3ZpZGVkLlxuICAgKi9cbiAgcmVhZG9ubHkgc2VjcmV0T3B0aW9ucz86IHsgW2tleTogc3RyaW5nXTogU2VjcmV0IH07XG59XG5cbi8qKlxuICogRmlyZUxlbnMgZW5hYmxlcyB5b3UgdG8gdXNlIHRhc2sgZGVmaW5pdGlvbiBwYXJhbWV0ZXJzIHRvIHJvdXRlIGxvZ3MgdG8gYW4gQVdTIHNlcnZpY2VcbiAqICBvciBBV1MgUGFydG5lciBOZXR3b3JrIChBUE4pIGRlc3RpbmF0aW9uIGZvciBsb2cgc3RvcmFnZSBhbmQgYW5hbHl0aWNzXG4gKi9cbmV4cG9ydCBjbGFzcyBGaXJlTGVuc0xvZ0RyaXZlciBleHRlbmRzIExvZ0RyaXZlciB7XG4gIC8qKlxuICAgKiBUaGUgY29uZmlndXJhdGlvbiBvcHRpb25zIHRvIHNlbmQgdG8gdGhlIGxvZyBkcml2ZXIuXG4gICAqIEBkZWZhdWx0IC0gdGhlIGxvZyBkcml2ZXIgb3B0aW9uc1xuICAgKi9cbiAgcHJpdmF0ZSBvcHRpb25zPzogeyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfTtcblxuICAvKipcbiAgICogVGhlIHNlY3JldHMgdG8gcGFzcyB0byB0aGUgbG9nIGNvbmZpZ3VyYXRpb24uXG4gICAqIEBkZWZhdWx0IC0gTm8gc2VjcmV0IG9wdGlvbnMgcHJvdmlkZWQuXG4gICAqL1xuICBwcml2YXRlIHNlY3JldE9wdGlvbnM/OiB7IFtrZXk6IHN0cmluZ106IFNlY3JldCB9O1xuXG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RzIGEgbmV3IGluc3RhbmNlIG9mIHRoZSBGaXJlTGVuc0xvZ0RyaXZlciBjbGFzcy5cbiAgICogQHBhcmFtIHByb3BzIHRoZSBhd3NmaXJlbGVucyBsb2cgZHJpdmVyIGNvbmZpZ3VyYXRpb24gb3B0aW9ucy5cbiAgICovXG4gIGNvbnN0cnVjdG9yKHByb3BzOiBGaXJlTGVuc0xvZ0RyaXZlclByb3BzKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIHRoaXMub3B0aW9ucyA9IHByb3BzLm9wdGlvbnM7XG4gICAgdGhpcy5zZWNyZXRPcHRpb25zID0gcHJvcHMuc2VjcmV0T3B0aW9ucztcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxsZWQgd2hlbiB0aGUgbG9nIGRyaXZlciBpcyBjb25maWd1cmVkIG9uIGEgY29udGFpbmVyXG4gICAqL1xuICBwdWJsaWMgYmluZChfc2NvcGU6IENvbnN0cnVjdCwgX2NvbnRhaW5lckRlZmluaXRpb246IENvbnRhaW5lckRlZmluaXRpb24pOiBMb2dEcml2ZXJDb25maWcge1xuICAgIHJldHVybiB7XG4gICAgICBsb2dEcml2ZXI6ICdhd3NmaXJlbGVucycsXG4gICAgICAuLi4odGhpcy5vcHRpb25zICYmIHsgb3B0aW9uczogcmVtb3ZlRW1wdHkodGhpcy5vcHRpb25zKSB9KSxcbiAgICAgIHNlY3JldE9wdGlvbnM6IHRoaXMuc2VjcmV0T3B0aW9ucyAmJiByZW5kZXJMb2dEcml2ZXJTZWNyZXRPcHRpb25zKHRoaXMuc2VjcmV0T3B0aW9ucywgX2NvbnRhaW5lckRlZmluaXRpb24udGFza0RlZmluaXRpb24pLFxuICAgIH07XG4gIH1cbn1cbiJdfQ==