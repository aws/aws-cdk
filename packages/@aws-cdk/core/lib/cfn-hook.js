"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CfnHook = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const cfn_element_1 = require("./cfn-element");
const util_1 = require("./util");
/**
 * Represents a CloudFormation resource.
 */
class CfnHook extends cfn_element_1.CfnElement {
    /**
     * Creates a new Hook object.
     */
    constructor(scope, id, props) {
        super(scope, id);
        try {
            jsiiDeprecationWarnings._aws_cdk_core_CfnHookProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, CfnHook);
            }
            throw error;
        }
        this.type = props.type;
        this._cfnHookProperties = props.properties;
    }
    /** @internal */
    _toCloudFormation() {
        return {
            Hooks: {
                [this.logicalId]: {
                    Type: this.type,
                    Properties: (0, util_1.ignoreEmpty)(this.renderProperties(this._cfnHookProperties)),
                },
            },
        };
    }
    renderProperties(props) {
        return props;
    }
}
_a = JSII_RTTI_SYMBOL_1;
CfnHook[_a] = { fqn: "@aws-cdk/core.CfnHook", version: "0.0.0" };
exports.CfnHook = CfnHook;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2ZuLWhvb2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJjZm4taG9vay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFDQSwrQ0FBMkM7QUFDM0MsaUNBQXFDO0FBb0JyQzs7R0FFRztBQUNILE1BQWEsT0FBUSxTQUFRLHdCQUFVO0lBU3JDOztPQUVHO0lBQ0gsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUFtQjtRQUMzRCxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDOzs7Ozs7K0NBYlIsT0FBTzs7OztRQWVoQixJQUFJLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUM7UUFDdkIsSUFBSSxDQUFDLGtCQUFrQixHQUFHLEtBQUssQ0FBQyxVQUFVLENBQUM7S0FDNUM7SUFFRCxnQkFBZ0I7SUFDVCxpQkFBaUI7UUFDdEIsT0FBTztZQUNMLEtBQUssRUFBRTtnQkFDTCxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRTtvQkFDaEIsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJO29CQUNmLFVBQVUsRUFBRSxJQUFBLGtCQUFXLEVBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO2lCQUN4RTthQUNGO1NBQ0YsQ0FBQztLQUNIO0lBRVMsZ0JBQWdCLENBQUMsS0FBNEI7UUFDckQsT0FBTyxLQUFLLENBQUM7S0FDZDs7OztBQWpDVSwwQkFBTyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0IHsgQ2ZuRWxlbWVudCB9IGZyb20gJy4vY2ZuLWVsZW1lbnQnO1xuaW1wb3J0IHsgaWdub3JlRW1wdHkgfSBmcm9tICcuL3V0aWwnO1xuXG4vKipcbiAqIENvbnN0cnVjdGlvbiBwcm9wZXJ0aWVzIG9mIGBDZm5Ib29rYC5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBDZm5Ib29rUHJvcHMge1xuICAvKipcbiAgICogVGhlIHR5cGUgb2YgdGhlIGhvb2tcbiAgICogKGZvciBleGFtcGxlLCBcIkFXUzo6Q29kZURlcGxveTo6Qmx1ZUdyZWVuXCIpLlxuICAgKi9cbiAgcmVhZG9ubHkgdHlwZTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgcHJvcGVydGllcyBvZiB0aGUgaG9vay5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBubyBwcm9wZXJ0aWVzXG4gICAqL1xuICByZWFkb25seSBwcm9wZXJ0aWVzPzogeyBbbmFtZTogc3RyaW5nXTogYW55IH07XG59XG5cbi8qKlxuICogUmVwcmVzZW50cyBhIENsb3VkRm9ybWF0aW9uIHJlc291cmNlLlxuICovXG5leHBvcnQgY2xhc3MgQ2ZuSG9vayBleHRlbmRzIENmbkVsZW1lbnQge1xuICAvKipcbiAgICogVGhlIHR5cGUgb2YgdGhlIGhvb2tcbiAgICogKGZvciBleGFtcGxlLCBcIkFXUzo6Q29kZURlcGxveTo6Qmx1ZUdyZWVuXCIpLlxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IHR5cGU6IHN0cmluZztcblxuICBwcml2YXRlIHJlYWRvbmx5IF9jZm5Ib29rUHJvcGVydGllcz86IHsgW25hbWU6IHN0cmluZ106IGFueSB9O1xuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgbmV3IEhvb2sgb2JqZWN0LlxuICAgKi9cbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IENmbkhvb2tQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCk7XG5cbiAgICB0aGlzLnR5cGUgPSBwcm9wcy50eXBlO1xuICAgIHRoaXMuX2Nmbkhvb2tQcm9wZXJ0aWVzID0gcHJvcHMucHJvcGVydGllcztcbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgcHVibGljIF90b0Nsb3VkRm9ybWF0aW9uKCk6IG9iamVjdCB7XG4gICAgcmV0dXJuIHtcbiAgICAgIEhvb2tzOiB7XG4gICAgICAgIFt0aGlzLmxvZ2ljYWxJZF06IHtcbiAgICAgICAgICBUeXBlOiB0aGlzLnR5cGUsXG4gICAgICAgICAgUHJvcGVydGllczogaWdub3JlRW1wdHkodGhpcy5yZW5kZXJQcm9wZXJ0aWVzKHRoaXMuX2Nmbkhvb2tQcm9wZXJ0aWVzKSksXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH07XG4gIH1cblxuICBwcm90ZWN0ZWQgcmVuZGVyUHJvcGVydGllcyhwcm9wcz86IHtba2V5OiBzdHJpbmddOiBhbnl9KTogeyBba2V5OiBzdHJpbmddOiBhbnkgfSB8IHVuZGVmaW5lZCB7XG4gICAgcmV0dXJuIHByb3BzO1xuICB9XG59XG4iXX0=