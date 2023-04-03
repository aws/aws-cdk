"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.JournaldLogDriver = void 0;
const jsiiDeprecationWarnings = require("../../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const log_driver_1 = require("./log-driver");
const utils_1 = require("./utils");
/**
 * A log driver that sends log information to journald Logs.
 */
class JournaldLogDriver extends log_driver_1.LogDriver {
    /**
     * Constructs a new instance of the JournaldLogDriver class.
     *
     * @param props the journald log driver configuration options.
     */
    constructor(props = {}) {
        super();
        this.props = props;
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ecs_JournaldLogDriverProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, JournaldLogDriver);
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
            logDriver: 'journald',
            options: utils_1.stringifyOptions({
                ...utils_1.renderCommonLogDriverOptions(this.props),
            }),
        };
    }
}
exports.JournaldLogDriver = JournaldLogDriver;
_a = JSII_RTTI_SYMBOL_1;
JournaldLogDriver[_a] = { fqn: "@aws-cdk/aws-ecs.JournaldLogDriver", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiam91cm5hbGQtbG9nLWRyaXZlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImpvdXJuYWxkLWxvZy1kcml2ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBRUEsNkNBQTBEO0FBQzFELG1DQUF5RTtBQVV6RTs7R0FFRztBQUNILE1BQWEsaUJBQWtCLFNBQVEsc0JBQVM7SUFDOUM7Ozs7T0FJRztJQUNILFlBQTZCLFFBQWdDLEVBQUU7UUFDN0QsS0FBSyxFQUFFLENBQUM7UUFEbUIsVUFBSyxHQUFMLEtBQUssQ0FBNkI7Ozs7OzsrQ0FOcEQsaUJBQWlCOzs7O0tBUTNCO0lBRUQ7O09BRUc7SUFDSSxJQUFJLENBQUMsTUFBaUIsRUFBRSxvQkFBeUM7Ozs7Ozs7Ozs7UUFDdEUsT0FBTztZQUNMLFNBQVMsRUFBRSxVQUFVO1lBQ3JCLE9BQU8sRUFBRSx3QkFBZ0IsQ0FBQztnQkFDeEIsR0FBRyxvQ0FBNEIsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDO2FBQzVDLENBQUM7U0FDSCxDQUFDO0tBQ0g7O0FBcEJILDhDQXFCQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0IHsgQmFzZUxvZ0RyaXZlclByb3BzIH0gZnJvbSAnLi9iYXNlLWxvZy1kcml2ZXInO1xuaW1wb3J0IHsgTG9nRHJpdmVyLCBMb2dEcml2ZXJDb25maWcgfSBmcm9tICcuL2xvZy1kcml2ZXInO1xuaW1wb3J0IHsgcmVuZGVyQ29tbW9uTG9nRHJpdmVyT3B0aW9ucywgc3RyaW5naWZ5T3B0aW9ucyB9IGZyb20gJy4vdXRpbHMnO1xuaW1wb3J0IHsgQ29udGFpbmVyRGVmaW5pdGlvbiB9IGZyb20gJy4uL2NvbnRhaW5lci1kZWZpbml0aW9uJztcblxuLyoqXG4gKiBTcGVjaWZpZXMgdGhlIGpvdXJuYWxkIGxvZyBkcml2ZXIgY29uZmlndXJhdGlvbiBvcHRpb25zLlxuICpcbiAqIFtTb3VyY2VdKGh0dHBzOi8vZG9jcy5kb2NrZXIuY29tL2NvbmZpZy9jb250YWluZXJzL2xvZ2dpbmcvam91cm5hbGQvKVxuICovXG5leHBvcnQgaW50ZXJmYWNlIEpvdXJuYWxkTG9nRHJpdmVyUHJvcHMgZXh0ZW5kcyBCYXNlTG9nRHJpdmVyUHJvcHMge31cblxuLyoqXG4gKiBBIGxvZyBkcml2ZXIgdGhhdCBzZW5kcyBsb2cgaW5mb3JtYXRpb24gdG8gam91cm5hbGQgTG9ncy5cbiAqL1xuZXhwb3J0IGNsYXNzIEpvdXJuYWxkTG9nRHJpdmVyIGV4dGVuZHMgTG9nRHJpdmVyIHtcbiAgLyoqXG4gICAqIENvbnN0cnVjdHMgYSBuZXcgaW5zdGFuY2Ugb2YgdGhlIEpvdXJuYWxkTG9nRHJpdmVyIGNsYXNzLlxuICAgKlxuICAgKiBAcGFyYW0gcHJvcHMgdGhlIGpvdXJuYWxkIGxvZyBkcml2ZXIgY29uZmlndXJhdGlvbiBvcHRpb25zLlxuICAgKi9cbiAgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSBwcm9wczogSm91cm5hbGRMb2dEcml2ZXJQcm9wcyA9IHt9KSB7XG4gICAgc3VwZXIoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxsZWQgd2hlbiB0aGUgbG9nIGRyaXZlciBpcyBjb25maWd1cmVkIG9uIGEgY29udGFpbmVyXG4gICAqL1xuICBwdWJsaWMgYmluZChfc2NvcGU6IENvbnN0cnVjdCwgX2NvbnRhaW5lckRlZmluaXRpb246IENvbnRhaW5lckRlZmluaXRpb24pOiBMb2dEcml2ZXJDb25maWcge1xuICAgIHJldHVybiB7XG4gICAgICBsb2dEcml2ZXI6ICdqb3VybmFsZCcsXG4gICAgICBvcHRpb25zOiBzdHJpbmdpZnlPcHRpb25zKHtcbiAgICAgICAgLi4ucmVuZGVyQ29tbW9uTG9nRHJpdmVyT3B0aW9ucyh0aGlzLnByb3BzKSxcbiAgICAgIH0pLFxuICAgIH07XG4gIH1cbn1cbiJdfQ==