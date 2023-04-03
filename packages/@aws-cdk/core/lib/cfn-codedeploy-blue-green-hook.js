"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CfnCodeDeployBlueGreenHook = exports.CfnTrafficRoutingType = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const cfn_hook_1 = require("./cfn-hook");
const util_1 = require("./util");
/**
 * The possible types of traffic shifting for the blue-green deployment configuration.
 * The type of the `CfnTrafficRoutingConfig.type` property.
 */
var CfnTrafficRoutingType;
(function (CfnTrafficRoutingType) {
    /**
     * Switch from blue to green at once.
     */
    CfnTrafficRoutingType["ALL_AT_ONCE"] = "AllAtOnce";
    /**
     * Specifies a configuration that shifts traffic from blue to green in two increments.
     */
    CfnTrafficRoutingType["TIME_BASED_CANARY"] = "TimeBasedCanary";
    /**
     * Specifies a configuration that shifts traffic from blue to green in equal increments,
     * with an equal number of minutes between each increment.
     */
    CfnTrafficRoutingType["TIME_BASED_LINEAR"] = "TimeBasedLinear";
})(CfnTrafficRoutingType = exports.CfnTrafficRoutingType || (exports.CfnTrafficRoutingType = {}));
/**
 * A CloudFormation Hook for CodeDeploy blue-green ECS deployments.
 *
 * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/blue-green.html#blue-green-template-reference
 */
class CfnCodeDeployBlueGreenHook extends cfn_hook_1.CfnHook {
    /**
     * Creates a new CodeDeploy blue-green ECS Hook.
     *
     * @param scope the scope to create the hook in (usually the containing Stack object)
     * @param id the identifier of the construct - will be used to generate the logical ID of the Hook
     * @param props the properties of the Hook
     */
    constructor(scope, id, props) {
        super(scope, id, {
            type: 'AWS::CodeDeploy::BlueGreen',
        });
        try {
            jsiiDeprecationWarnings._aws_cdk_core_CfnCodeDeployBlueGreenHookProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, CfnCodeDeployBlueGreenHook);
            }
            throw error;
        }
        this._serviceRole = props.serviceRole;
        this._applications = props.applications;
        this._trafficRoutingConfig = props.trafficRoutingConfig;
        this._additionalOptions = props.additionalOptions;
        this._lifecycleEventHooks = props.lifecycleEventHooks;
    }
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope, id, hookAttributes, options) {
        hookAttributes = hookAttributes || {};
        const hookProperties = options.parser.parseValue(hookAttributes.Properties);
        return new CfnCodeDeployBlueGreenHook(scope, id, {
            serviceRole: hookProperties?.ServiceRole,
            applications: hookProperties?.Applications?.map(applicationFromCloudFormation),
            trafficRoutingConfig: {
                type: hookProperties?.TrafficRoutingConfig?.Type,
                timeBasedCanary: {
                    stepPercentage: hookProperties?.TrafficRoutingConfig?.TimeBasedCanary?.StepPercentage,
                    bakeTimeMins: hookProperties?.TrafficRoutingConfig?.TimeBasedCanary?.BakeTimeMins,
                },
                timeBasedLinear: {
                    stepPercentage: hookProperties?.TrafficRoutingConfig?.TimeBasedLinear?.StepPercentage,
                    bakeTimeMins: hookProperties?.TrafficRoutingConfig?.TimeBasedLinear?.BakeTimeMins,
                },
            },
            additionalOptions: {
                terminationWaitTimeInMinutes: hookProperties?.AdditionalOptions?.TerminationWaitTimeInMinutes,
            },
            lifecycleEventHooks: {
                beforeInstall: hookProperties?.LifecycleEventHooks?.BeforeInstall,
                afterInstall: hookProperties?.LifecycleEventHooks?.AfterInstall,
                afterAllowTestTraffic: hookProperties?.LifecycleEventHooks?.AfterAllowTestTraffic,
                beforeAllowTraffic: hookProperties?.LifecycleEventHooks?.BeforeAllowTraffic,
                afterAllowTraffic: hookProperties?.LifecycleEventHooks?.AfterAllowTraffic,
            },
        });
        function applicationFromCloudFormation(app) {
            const target = findResource(app?.Target?.LogicalID);
            const taskDefinitions = app?.ECSAttributes?.TaskDefinitions?.map((td) => findResource(td));
            const taskSets = app?.ECSAttributes?.TaskSets?.map((ts) => findResource(ts));
            const prodTrafficRoute = findResource(app?.ECSAttributes?.TrafficRouting?.ProdTrafficRoute?.LogicalID);
            const testTrafficRoute = findResource(app?.ECSAttributes?.TrafficRouting?.TestTrafficRoute?.LogicalID);
            const targetGroups = app?.ECSAttributes?.TrafficRouting?.TargetGroups?.map((tg) => findResource(tg));
            return {
                target: {
                    type: app?.Target?.Type,
                    logicalId: target?.logicalId,
                },
                ecsAttributes: {
                    taskDefinitions: taskDefinitions?.map(td => td?.logicalId),
                    taskSets: taskSets?.map(ts => ts?.logicalId),
                    trafficRouting: {
                        prodTrafficRoute: {
                            type: app?.ECSAttributes?.TrafficRouting?.ProdTrafficRoute?.Type,
                            logicalId: prodTrafficRoute?.logicalId,
                        },
                        testTrafficRoute: {
                            type: app?.ECSAttributes?.TrafficRouting?.TestTrafficRoute?.Type,
                            logicalId: testTrafficRoute?.logicalId,
                        },
                        targetGroups: targetGroups?.map((tg) => tg?.logicalId),
                    },
                },
            };
        }
        function findResource(logicalId) {
            if (logicalId == null) {
                return undefined;
            }
            const ret = options.parser.finder.findResource(logicalId);
            if (!ret) {
                throw new Error(`Hook '${id}' references resource '${logicalId}' that was not found in the template`);
            }
            return ret;
        }
    }
    /**
     * The IAM Role for CloudFormation to use to perform blue-green deployments.
     */
    get serviceRole() {
        return this._serviceRole;
    }
    set serviceRole(serviceRole) {
        this._serviceRole = serviceRole;
    }
    /**
     * Properties of the Amazon ECS applications being deployed.
     */
    get applications() {
        return this._applications;
    }
    set applications(value) {
        this._applications = value;
    }
    /**
     * Traffic routing configuration settings.
     *
     * @default - time-based canary traffic shifting, with a 15% step percentage and a five minute bake time
     */
    get trafficRoutingConfig() {
        return this._trafficRoutingConfig;
    }
    set trafficRoutingConfig(value) {
        this._trafficRoutingConfig = value;
    }
    /**
     * Additional options for the blue/green deployment.
     *
     * @default - no additional options
     */
    get additionalOptions() {
        return this._additionalOptions;
    }
    set additionalOptions(value) {
        this._additionalOptions = value;
    }
    /**
     * Use lifecycle event hooks to specify a Lambda function that CodeDeploy can call to validate a deployment.
     * You can use the same function or a different one for deployment lifecycle events.
     * Following completion of the validation tests,
     * the Lambda `CfnCodeDeployBlueGreenLifecycleEventHooks.afterAllowTraffic`
     * function calls back CodeDeploy and delivers a result of 'Succeeded' or 'Failed'.
     *
     * @default - no lifecycle event hooks
     */
    get lifecycleEventHooks() {
        return this._lifecycleEventHooks;
    }
    set lifecycleEventHooks(value) {
        this._lifecycleEventHooks = value;
    }
    renderProperties(_props) {
        return {
            ServiceRole: this.serviceRole,
            Applications: this.applications.map((app) => ({
                Target: {
                    Type: app.target.type,
                    LogicalID: app.target.logicalId,
                },
                ECSAttributes: {
                    TaskDefinitions: app.ecsAttributes.taskDefinitions,
                    TaskSets: app.ecsAttributes.taskSets,
                    TrafficRouting: {
                        ProdTrafficRoute: {
                            Type: app.ecsAttributes.trafficRouting.prodTrafficRoute.type,
                            LogicalID: app.ecsAttributes.trafficRouting.prodTrafficRoute.logicalId,
                        },
                        TestTrafficRoute: {
                            Type: app.ecsAttributes.trafficRouting.testTrafficRoute.type,
                            LogicalID: app.ecsAttributes.trafficRouting.testTrafficRoute.logicalId,
                        },
                        TargetGroups: app.ecsAttributes.trafficRouting.targetGroups,
                    },
                },
            })),
            TrafficRoutingConfig: util_1.undefinedIfAllValuesAreEmpty({
                Type: this.trafficRoutingConfig?.type,
                TimeBasedCanary: util_1.undefinedIfAllValuesAreEmpty({
                    StepPercentage: this.trafficRoutingConfig?.timeBasedCanary?.stepPercentage,
                    BakeTimeMins: this.trafficRoutingConfig?.timeBasedCanary?.bakeTimeMins,
                }),
                TimeBasedLinear: util_1.undefinedIfAllValuesAreEmpty({
                    StepPercentage: this.trafficRoutingConfig?.timeBasedLinear?.stepPercentage,
                    BakeTimeMins: this.trafficRoutingConfig?.timeBasedLinear?.bakeTimeMins,
                }),
            }),
            AdditionalOptions: util_1.undefinedIfAllValuesAreEmpty({
                TerminationWaitTimeInMinutes: this.additionalOptions?.terminationWaitTimeInMinutes,
            }),
            LifecycleEventHooks: util_1.undefinedIfAllValuesAreEmpty({
                BeforeInstall: this.lifecycleEventHooks?.beforeInstall,
                AfterInstall: this.lifecycleEventHooks?.afterInstall,
                AfterAllowTestTraffic: this.lifecycleEventHooks?.afterAllowTestTraffic,
                BeforeAllowTraffic: this.lifecycleEventHooks?.beforeAllowTraffic,
                AfterAllowTraffic: this.lifecycleEventHooks?.afterAllowTraffic,
            }),
        };
    }
}
exports.CfnCodeDeployBlueGreenHook = CfnCodeDeployBlueGreenHook;
_a = JSII_RTTI_SYMBOL_1;
CfnCodeDeployBlueGreenHook[_a] = { fqn: "@aws-cdk/core.CfnCodeDeployBlueGreenHook", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2ZuLWNvZGVkZXBsb3ktYmx1ZS1ncmVlbi1ob29rLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY2ZuLWNvZGVkZXBsb3ktYmx1ZS1ncmVlbi1ob29rLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUNBLHlDQUFxQztBQUdyQyxpQ0FBc0Q7QUFFdEQ7OztHQUdHO0FBQ0gsSUFBWSxxQkFnQlg7QUFoQkQsV0FBWSxxQkFBcUI7SUFDL0I7O09BRUc7SUFDSCxrREFBeUIsQ0FBQTtJQUV6Qjs7T0FFRztJQUNILDhEQUFxQyxDQUFBO0lBRXJDOzs7T0FHRztJQUNILDhEQUFxQyxDQUFBO0FBQ3ZDLENBQUMsRUFoQlcscUJBQXFCLEdBQXJCLDZCQUFxQixLQUFyQiw2QkFBcUIsUUFnQmhDO0FBbVFEOzs7O0dBSUc7QUFDSCxNQUFhLDBCQUEyQixTQUFRLGtCQUFPO0lBMkZyRDs7Ozs7O09BTUc7SUFDSCxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQXNDO1FBQzlFLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFO1lBQ2YsSUFBSSxFQUFFLDRCQUE0QjtTQUVuQyxDQUFDLENBQUM7Ozs7OzsrQ0F0R00sMEJBQTBCOzs7O1FBd0duQyxJQUFJLENBQUMsWUFBWSxHQUFHLEtBQUssQ0FBQyxXQUFXLENBQUM7UUFDdEMsSUFBSSxDQUFDLGFBQWEsR0FBRyxLQUFLLENBQUMsWUFBWSxDQUFDO1FBQ3hDLElBQUksQ0FBQyxxQkFBcUIsR0FBRyxLQUFLLENBQUMsb0JBQW9CLENBQUM7UUFDeEQsSUFBSSxDQUFDLGtCQUFrQixHQUFHLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQztRQUNsRCxJQUFJLENBQUMsb0JBQW9CLEdBQUcsS0FBSyxDQUFDLG1CQUFtQixDQUFDO0tBQ3ZEO0lBNUdEOzs7Ozs7T0FNRztJQUNJLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxLQUFnQixFQUFFLEVBQVUsRUFBRSxjQUFtQixFQUNqRixPQUFrQztRQUVsQyxjQUFj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bUIsRUFBRSxZQUFZO2dCQUNwRCxxQkFBcUIsRUFBRSxJQUFJLENBQUMsbUJBQW1CLEVBQUUscUJBQXFCO2dCQUN0RSxrQkFBa0IsRUFBRSxJQUFJLENBQUMsbUJBQW1CLEVBQUUsa0JBQWtCO2dCQUNoRSxpQkFBaUIsRUFBRSxJQUFJLENBQUMsbUJBQW1CLEVBQUUsaUJBQWlCO2FBQy9ELENBQUM7U0FDSCxDQUFDO0tBQ0g7O0FBOU5ILGdFQStOQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0IHsgQ2ZuSG9vayB9IGZyb20gJy4vY2ZuLWhvb2snO1xuaW1wb3J0IHsgQ2ZuUmVzb3VyY2UgfSBmcm9tICcuL2Nmbi1yZXNvdXJjZSc7XG5pbXBvcnQgeyBGcm9tQ2xvdWRGb3JtYXRpb25PcHRpb25zIH0gZnJvbSAnLi9oZWxwZXJzLWludGVybmFsJztcbmltcG9ydCB7IHVuZGVmaW5lZElmQWxsVmFsdWVzQXJlRW1wdHkgfSBmcm9tICcuL3V0aWwnO1xuXG4vKipcbiAqIFRoZSBwb3NzaWJsZSB0eXBlcyBvZiB0cmFmZmljIHNoaWZ0aW5nIGZvciB0aGUgYmx1ZS1ncmVlbiBkZXBsb3ltZW50IGNvbmZpZ3VyYXRpb24uXG4gKiBUaGUgdHlwZSBvZiB0aGUgYENmblRyYWZmaWNSb3V0aW5nQ29uZmlnLnR5cGVgIHByb3BlcnR5LlxuICovXG5leHBvcnQgZW51bSBDZm5UcmFmZmljUm91dGluZ1R5cGUge1xuICAvKipcbiAgICogU3dpdGNoIGZyb20gYmx1ZSB0byBncmVlbiBhdCBvbmNlLlxuICAgKi9cbiAgQUxMX0FUX09OQ0UgPSAnQWxsQXRPbmNlJyxcblxuICAvKipcbiAgICogU3BlY2lmaWVzIGEgY29uZmlndXJhdGlvbiB0aGF0IHNoaWZ0cyB0cmFmZmljIGZyb20gYmx1ZSB0byBncmVlbiBpbiB0d28gaW5jcmVtZW50cy5cbiAgICovXG4gIFRJTUVfQkFTRURfQ0FOQVJZID0gJ1RpbWVCYXNlZENhbmFyeScsXG5cbiAgLyoqXG4gICAqIFNwZWNpZmllcyBhIGNvbmZpZ3VyYXRpb24gdGhhdCBzaGlmdHMgdHJhZmZpYyBmcm9tIGJsdWUgdG8gZ3JlZW4gaW4gZXF1YWwgaW5jcmVtZW50cyxcbiAgICogd2l0aCBhbiBlcXVhbCBudW1iZXIgb2YgbWludXRlcyBiZXR3ZWVuIGVhY2ggaW5jcmVtZW50LlxuICAgKi9cbiAgVElNRV9CQVNFRF9MSU5FQVIgPSAnVGltZUJhc2VkTGluZWFyJyxcbn1cblxuLyoqXG4gKiBUaGUgdHJhZmZpYyByb3V0aW5nIGNvbmZpZ3VyYXRpb24gaWYgYENmblRyYWZmaWNSb3V0aW5nQ29uZmlnLnR5cGVgXG4gKiBpcyBgQ2ZuVHJhZmZpY1JvdXRpbmdUeXBlLlRJTUVfQkFTRURfQ0FOQVJZYC5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBDZm5UcmFmZmljUm91dGluZ1RpbWVCYXNlZENhbmFyeSB7XG4gIC8qKlxuICAgKiBUaGUgcGVyY2VudGFnZSBvZiB0cmFmZmljIHRvIHNoaWZ0IGluIHRoZSBmaXJzdCBpbmNyZW1lbnQgb2YgYSB0aW1lLWJhc2VkIGNhbmFyeSBkZXBsb3ltZW50LlxuICAgKiBUaGUgc3RlcCBwZXJjZW50YWdlIG11c3QgYmUgMTQlIG9yIGdyZWF0ZXIuXG4gICAqXG4gICAqIEBkZWZhdWx0IDE1XG4gICAqL1xuICByZWFkb25seSBzdGVwUGVyY2VudGFnZT86IG51bWJlcjtcblxuICAvKipcbiAgICogVGhlIG51bWJlciBvZiBtaW51dGVzIGJldHdlZW4gdGhlIGZpcnN0IGFuZCBzZWNvbmQgdHJhZmZpYyBzaGlmdHMgb2YgYSB0aW1lLWJhc2VkIGNhbmFyeSBkZXBsb3ltZW50LlxuICAgKlxuICAgKiBAZGVmYXVsdCA1XG4gICAqL1xuICByZWFkb25seSBiYWtlVGltZU1pbnM/OiBudW1iZXI7XG59XG5cbi8qKlxuICogVGhlIHRyYWZmaWMgcm91dGluZyBjb25maWd1cmF0aW9uIGlmIGBDZm5UcmFmZmljUm91dGluZ0NvbmZpZy50eXBlYFxuICogaXMgYENmblRyYWZmaWNSb3V0aW5nVHlwZS5USU1FX0JBU0VEX0xJTkVBUmAuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQ2ZuVHJhZmZpY1JvdXRpbmdUaW1lQmFzZWRMaW5lYXIge1xuICAvKipcbiAgICogVGhlIHBlcmNlbnRhZ2Ugb2YgdHJhZmZpYyB0aGF0IGlzIHNoaWZ0ZWQgYXQgdGhlIHN0YXJ0IG9mIGVhY2ggaW5jcmVtZW50IG9mIGEgdGltZS1iYXNlZCBsaW5lYXIgZGVwbG95bWVudC5cbiAgICogVGhlIHN0ZXAgcGVyY2VudGFnZSBtdXN0IGJlIDE0JSBvciBncmVhdGVyLlxuICAgKlxuICAgKiBAZGVmYXVsdCAxNVxuICAgKi9cbiAgcmVhZG9ubHkgc3RlcFBlcmNlbnRhZ2U/OiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIFRoZSBudW1iZXIgb2YgbWludXRlcyBiZXR3ZWVuIHRoZSBmaXJzdCBhbmQgc2Vjb25kIHRyYWZmaWMgc2hpZnRzIG9mIGEgdGltZS1iYXNlZCBsaW5lYXIgZGVwbG95bWVudC5cbiAgICpcbiAgICogQGRlZmF1bHQgNVxuICAgKi9cbiAgcmVhZG9ubHkgYmFrZVRpbWVNaW5zPzogbnVtYmVyO1xufVxuXG4vKipcbiAqIFRyYWZmaWMgcm91dGluZyBjb25maWd1cmF0aW9uIHNldHRpbmdzLlxuICogVGhlIHR5cGUgb2YgdGhlIGBDZm5Db2RlRGVwbG95Qmx1ZUdyZWVuSG9va1Byb3BzLnRyYWZmaWNSb3V0aW5nQ29uZmlnYCBwcm9wZXJ0eS5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBDZm5UcmFmZmljUm91dGluZ0NvbmZpZyB7XG4gIC8qKlxuICAgKiBUaGUgdHlwZSBvZiB0cmFmZmljIHNoaWZ0aW5nIHVzZWQgYnkgdGhlIGJsdWUtZ3JlZW4gZGVwbG95bWVudCBjb25maWd1cmF0aW9uLlxuICAgKi9cbiAgcmVhZG9ubHkgdHlwZTogQ2ZuVHJhZmZpY1JvdXRpbmdUeXBlO1xuXG4gIC8qKlxuICAgKiBUaGUgY29uZmlndXJhdGlvbiBmb3IgdHJhZmZpYyByb3V0aW5nIHdoZW4gYHR5cGVgIGlzXG4gICAqIGBDZm5UcmFmZmljUm91dGluZ1R5cGUuVElNRV9CQVNFRF9DQU5BUllgLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIG5vbmVcbiAgICovXG4gIHJlYWRvbmx5IHRpbWVCYXNlZENhbmFyeT86IENmblRyYWZmaWNSb3V0aW5nVGltZUJhc2VkQ2FuYXJ5O1xuXG4gIC8qKlxuICAgKiBUaGUgY29uZmlndXJhdGlvbiBmb3IgdHJhZmZpYyByb3V0aW5nIHdoZW4gYHR5cGVgIGlzXG4gICAqIGBDZm5UcmFmZmljUm91dGluZ1R5cGUuVElNRV9CQVNFRF9MSU5FQVJgLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIG5vbmVcbiAgICovXG4gIHJlYWRvbmx5IHRpbWVCYXNlZExpbmVhcj86IENmblRyYWZmaWNSb3V0aW5nVGltZUJhc2VkTGluZWFyO1xufVxuXG4vKipcbiAqIEFkZGl0aW9uYWwgb3B0aW9ucyBmb3IgdGhlIGJsdWUvZ3JlZW4gZGVwbG95bWVudC5cbiAqIFRoZSB0eXBlIG9mIHRoZSBgQ2ZuQ29kZURlcGxveUJsdWVHcmVlbkhvb2tQcm9wcy5hZGRpdGlvbmFsT3B0aW9uc2AgcHJvcGVydHkuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQ2ZuQ29kZURlcGxveUJsdWVHcmVlbkFkZGl0aW9uYWxPcHRpb25zIHtcbiAgLyoqXG4gICAqIFNwZWNpZmllcyB0aW1lIHRvIHdhaXQsIGluIG1pbnV0ZXMsIGJlZm9yZSB0ZXJtaW5hdGluZyB0aGUgYmx1ZSByZXNvdXJjZXMuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gNSBtaW51dGVzXG4gICAqL1xuICByZWFkb25seSB0ZXJtaW5hdGlvbldhaXRUaW1lSW5NaW51dGVzPzogbnVtYmVyO1xufVxuXG4vKipcbiAqIExpZmVjeWNsZSBldmVudHMgZm9yIGJsdWUtZ3JlZW4gZGVwbG95bWVudHMuXG4gKiBUaGUgdHlwZSBvZiB0aGUgYENmbkNvZGVEZXBsb3lCbHVlR3JlZW5Ib29rUHJvcHMubGlmZWN5Y2xlRXZlbnRIb29rc2AgcHJvcGVydHkuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQ2ZuQ29kZURlcGxveUJsdWVHcmVlbkxpZmVjeWNsZUV2ZW50SG9va3Mge1xuICAvKipcbiAgICogRnVuY3Rpb24gdG8gdXNlIHRvIHJ1biB0YXNrcyBiZWZvcmUgdGhlIHJlcGxhY2VtZW50IHRhc2sgc2V0IGlzIGNyZWF0ZWQuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gbm9uZVxuICAgKi9cbiAgcmVhZG9ubHkgYmVmb3JlSW5zdGFsbD86IHN0cmluZztcblxuICAvKipcbiAgICogRnVuY3Rpb24gdG8gdXNlIHRvIHJ1biB0YXNrcyBhZnRlciB0aGUgcmVwbGFjZW1lbnQgdGFzayBzZXQgaXMgY3JlYXRlZCBhbmQgb25lIG9mIHRoZSB0YXJnZXQgZ3JvdXBzIGlzIGFzc29jaWF0ZWQgd2l0aCBpdC5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBub25lXG4gICAqL1xuICByZWFkb25seSBhZnRlckluc3RhbGw/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIEZ1bmN0aW9uIHRvIHVzZSB0byBydW4gdGFza3MgYWZ0ZXIgdGhlIHRlc3QgbGlzdGVuZXIgc2VydmVzIHRyYWZmaWMgdG8gdGhlIHJlcGxhY2VtZW50IHRhc2sgc2V0LlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIG5vbmVcbiAgICovXG4gIHJlYWRvbmx5IGFmdGVyQWxsb3dUZXN0VHJhZmZpYz86IHN0cmluZztcblxuICAvKipcbiAgICogRnVuY3Rpb24gdG8gdXNlIHRvIHJ1biB0YXNrcyBhZnRlciB0aGUgc2Vjb25kIHRhcmdldCBncm91cCBpcyBhc3NvY2lhdGVkIHdpdGggdGhlIHJlcGxhY2VtZW50IHRhc2sgc2V0LFxuICAgKiBidXQgYmVmb3JlIHRyYWZmaWMgaXMgc2hpZnRlZCB0byB0aGUgcmVwbGFjZW1lbnQgdGFzayBzZXQuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gbm9uZVxuICAgKi9cbiAgcmVhZG9ubHkgYmVmb3JlQWxsb3dUcmFmZmljPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBGdW5jdGlvbiB0byB1c2UgdG8gcnVuIHRhc2tzIGFmdGVyIHRoZSBzZWNvbmQgdGFyZ2V0IGdyb3VwIHNlcnZlcyB0cmFmZmljIHRvIHRoZSByZXBsYWNlbWVudCB0YXNrIHNldC5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBub25lXG4gICAqL1xuICByZWFkb25seSBhZnRlckFsbG93VHJhZmZpYz86IHN0cmluZztcbn1cblxuLyoqXG4gKiBUeXBlIG9mIHRoZSBgQ2ZuQ29kZURlcGxveUJsdWVHcmVlbkFwcGxpY2F0aW9uLnRhcmdldGAgcHJvcGVydHkuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQ2ZuQ29kZURlcGxveUJsdWVHcmVlbkFwcGxpY2F0aW9uVGFyZ2V0IHtcbiAgLyoqXG4gICAqIFRoZSByZXNvdXJjZSB0eXBlIG9mIHRoZSB0YXJnZXQgYmVpbmcgZGVwbG95ZWQuXG4gICAqIFJpZ2h0IG5vdywgdGhlIG9ubHkgYWxsb3dlZCB2YWx1ZSBpcyAnQVdTOjpFQ1M6OlNlcnZpY2UnLlxuICAgKi9cbiAgcmVhZG9ubHkgdHlwZTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgbG9naWNhbCBpZCBvZiB0aGUgdGFyZ2V0IHJlc291cmNlLlxuICAgKi9cbiAgcmVhZG9ubHkgbG9naWNhbElkOiBzdHJpbmc7XG59XG5cbi8qKlxuICogQSB0cmFmZmljIHJvdXRlLFxuICogcmVwcmVzZW50aW5nIHdoZXJlIHRoZSB0cmFmZmljIGlzIGJlaW5nIGRpcmVjdGVkIHRvLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIENmblRyYWZmaWNSb3V0ZSB7XG4gIC8qKlxuICAgKiBUaGUgcmVzb3VyY2UgdHlwZSBvZiB0aGUgcm91dGUuXG4gICAqIFRvZGF5LCB0aGUgb25seSBhbGxvd2VkIHZhbHVlIGlzICdBV1M6OkVsYXN0aWNMb2FkQmFsYW5jaW5nVjI6Okxpc3RlbmVyJy5cbiAgICovXG4gIHJlYWRvbmx5IHR5cGU6IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIGxvZ2ljYWwgaWQgb2YgdGhlIHRhcmdldCByZXNvdXJjZS5cbiAgICovXG4gIHJlYWRvbmx5IGxvZ2ljYWxJZDogc3RyaW5nO1xufVxuXG4vKipcbiAqIFR5cGUgb2YgdGhlIGBDZm5Db2RlRGVwbG95Qmx1ZUdyZWVuRWNzQXR0cmlidXRlcy50cmFmZmljUm91dGluZ2AgcHJvcGVydHkuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQ2ZuVHJhZmZpY1JvdXRpbmcge1xuICAvKipcbiAgICogVGhlIGxpc3RlbmVyIHRvIGJlIHVzZWQgYnkgeW91ciBsb2FkIGJhbGFuY2VyIHRvIGRpcmVjdCB0cmFmZmljIHRvIHlvdXIgdGFyZ2V0IGdyb3Vwcy5cbiAgICovXG4gIHJlYWRvbmx5IHByb2RUcmFmZmljUm91dGU6IENmblRyYWZmaWNSb3V0ZTtcblxuICAvKipcbiAgICogVGhlIGxpc3RlbmVyIHRvIGJlIHVzZWQgYnkgeW91ciBsb2FkIGJhbGFuY2VyIHRvIGRpcmVjdCB0cmFmZmljIHRvIHlvdXIgdGFyZ2V0IGdyb3Vwcy5cbiAgICovXG4gIHJlYWRvbmx5IHRlc3RUcmFmZmljUm91dGU6IENmblRyYWZmaWNSb3V0ZTtcblxuICAvKipcbiAgICogVGhlIGxvZ2ljYWwgSURzIG9mIHRoZSBibHVlIGFuZCBncmVlbiwgcmVzcGVjdGl2ZWx5LFxuICAgKiBBV1M6OkVsYXN0aWNMb2FkQmFsYW5jaW5nVjI6OlRhcmdldEdyb3VwIHRhcmdldCBncm91cHMuXG4gICAqL1xuICByZWFkb25seSB0YXJnZXRHcm91cHM6IHN0cmluZ1tdO1xufVxuXG4vKipcbiAqIFRoZSBhdHRyaWJ1dGVzIG9mIHRoZSBFQ1MgU2VydmljZSBiZWluZyBkZXBsb3llZC5cbiAqIFR5cGUgb2YgdGhlIGBDZm5Db2RlRGVwbG95Qmx1ZUdyZWVuQXBwbGljYXRpb24uZWNzQXR0cmlidXRlc2AgcHJvcGVydHkuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQ2ZuQ29kZURlcGxveUJsdWVHcmVlbkVjc0F0dHJpYnV0ZXMge1xuICAvKipcbiAgICogVGhlIGxvZ2ljYWwgSURzIG9mIHRoZSBibHVlIGFuZCBncmVlbiwgcmVzcGVjdGl2ZWx5LFxuICAgKiBBV1M6OkVDUzo6VGFza0RlZmluaXRpb24gdGFzayBkZWZpbml0aW9ucy5cbiAgICovXG4gIHJlYWRvbmx5IHRhc2tEZWZpbml0aW9uczogc3RyaW5nW107XG5cbiAgLyoqXG4gICAqIFRoZSBsb2dpY2FsIElEcyBvZiB0aGUgYmx1ZSBhbmQgZ3JlZW4sIHJlc3BlY3RpdmVseSxcbiAgICogQVdTOjpFQ1M6OlRhc2tTZXQgdGFzayBzZXRzLlxuICAgKi9cbiAgcmVhZG9ubHkgdGFza1NldHM6IHN0cmluZ1tdO1xuXG4gIC8qKlxuICAgKiBUaGUgdHJhZmZpYyByb3V0aW5nIGNvbmZpZ3VyYXRpb24uXG4gICAqL1xuICByZWFkb25seSB0cmFmZmljUm91dGluZzogQ2ZuVHJhZmZpY1JvdXRpbmc7XG59XG5cbi8qKlxuICogVGhlIGFwcGxpY2F0aW9uIGFjdHVhbGx5IGJlaW5nIGRlcGxveWVkLlxuICogVHlwZSBvZiB0aGUgYENmbkNvZGVEZXBsb3lCbHVlR3JlZW5Ib29rUHJvcHMuYXBwbGljYXRpb25zYCBwcm9wZXJ0eS5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBDZm5Db2RlRGVwbG95Qmx1ZUdyZWVuQXBwbGljYXRpb24ge1xuICAvKipcbiAgICogVGhlIHRhcmdldCB0aGF0IGlzIGJlaW5nIGRlcGxveWVkLlxuICAgKi9cbiAgcmVhZG9ubHkgdGFyZ2V0OiBDZm5Db2RlRGVwbG95Qmx1ZUdyZWVuQXBwbGljYXRpb25UYXJnZXQ7XG5cbiAgLyoqXG4gICAqIFRoZSBkZXRhaWxlZCBhdHRyaWJ1dGVzIG9mIHRoZSBkZXBsb3llZCB0YXJnZXQuXG4gICAqL1xuICByZWFkb25seSBlY3NBdHRyaWJ1dGVzOiBDZm5Db2RlRGVwbG95Qmx1ZUdyZWVuRWNzQXR0cmlidXRlcztcbn1cblxuLyoqXG4gKiBDb25zdHJ1Y3Rpb24gcHJvcGVydGllcyBvZiBgQ2ZuQ29kZURlcGxveUJsdWVHcmVlbkhvb2tgLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIENmbkNvZGVEZXBsb3lCbHVlR3JlZW5Ib29rUHJvcHMge1xuICAvKipcbiAgICogVGhlIElBTSBSb2xlIGZvciBDbG91ZEZvcm1hdGlvbiB0byB1c2UgdG8gcGVyZm9ybSBibHVlLWdyZWVuIGRlcGxveW1lbnRzLlxuICAgKi9cbiAgcmVhZG9ubHkgc2VydmljZVJvbGU6IHN0cmluZztcblxuICAvKipcbiAgICogUHJvcGVydGllcyBvZiB0aGUgQW1hem9uIEVDUyBhcHBsaWNhdGlvbnMgYmVpbmcgZGVwbG95ZWQuXG4gICAqL1xuICByZWFkb25seSBhcHBsaWNhdGlvbnM6IENmbkNvZGVEZXBsb3lCbHVlR3JlZW5BcHBsaWNhdGlvbltdO1xuXG4gIC8qKlxuICAgKiBUcmFmZmljIHJvdXRpbmcgY29uZmlndXJhdGlvbiBzZXR0aW5ncy5cbiAgICpcbiAgICogQGRlZmF1bHQgLSB0aW1lLWJhc2VkIGNhbmFyeSB0cmFmZmljIHNoaWZ0aW5nLCB3aXRoIGEgMTUlIHN0ZXAgcGVyY2VudGFnZSBhbmQgYSBmaXZlIG1pbnV0ZSBiYWtlIHRpbWVcbiAgICovXG4gIHJlYWRvbmx5IHRyYWZmaWNSb3V0aW5nQ29uZmlnPzogQ2ZuVHJhZmZpY1JvdXRpbmdDb25maWc7XG5cbiAgLyoqXG4gICAqIEFkZGl0aW9uYWwgb3B0aW9ucyBmb3IgdGhlIGJsdWUvZ3JlZW4gZGVwbG95bWVudC5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBubyBhZGRpdGlvbmFsIG9wdGlvbnNcbiAgICovXG4gIHJlYWRvbmx5IGFkZGl0aW9uYWxPcHRpb25zPzogQ2ZuQ29kZURlcGxveUJsdWVHcmVlbkFkZGl0aW9uYWxPcHRpb25zO1xuXG4gIC8qKlxuICAgKiBVc2UgbGlmZWN5Y2xlIGV2ZW50IGhvb2tzIHRvIHNwZWNpZnkgYSBMYW1iZGEgZnVuY3Rpb24gdGhhdCBDb2RlRGVwbG95IGNhbiBjYWxsIHRvIHZhbGlkYXRlIGEgZGVwbG95bWVudC5cbiAgICogWW91IGNhbiB1c2UgdGhlIHNhbWUgZnVuY3Rpb24gb3IgYSBkaWZmZXJlbnQgb25lIGZvciBkZXBsb3ltZW50IGxpZmVjeWNsZSBldmVudHMuXG4gICAqIEZvbGxvd2luZyBjb21wbGV0aW9uIG9mIHRoZSB2YWxpZGF0aW9uIHRlc3RzLFxuICAgKiB0aGUgTGFtYmRhIGBDZm5Db2RlRGVwbG95Qmx1ZUdyZWVuTGlmZWN5Y2xlRXZlbnRIb29rcy5hZnRlckFsbG93VHJhZmZpY2BcbiAgICogZnVuY3Rpb24gY2FsbHMgYmFjayBDb2RlRGVwbG95IGFuZCBkZWxpdmVycyBhIHJlc3VsdCBvZiAnU3VjY2VlZGVkJyBvciAnRmFpbGVkJy5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBubyBsaWZlY3ljbGUgZXZlbnQgaG9va3NcbiAgICovXG4gIHJlYWRvbmx5IGxpZmVjeWNsZUV2ZW50SG9va3M/OiBDZm5Db2RlRGVwbG95Qmx1ZUdyZWVuTGlmZWN5Y2xlRXZlbnRIb29rcztcbn1cblxuLyoqXG4gKiBBIENsb3VkRm9ybWF0aW9uIEhvb2sgZm9yIENvZGVEZXBsb3kgYmx1ZS1ncmVlbiBFQ1MgZGVwbG95bWVudHMuXG4gKlxuICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9ibHVlLWdyZWVuLmh0bWwjYmx1ZS1ncmVlbi10ZW1wbGF0ZS1yZWZlcmVuY2VcbiAqL1xuZXhwb3J0IGNsYXNzIENmbkNvZGVEZXBsb3lCbHVlR3JlZW5Ib29rIGV4dGVuZHMgQ2ZuSG9vayB7XG4gIC8qKlxuICAgKiBBIGZhY3RvcnkgbWV0aG9kIHRoYXQgY3JlYXRlcyBhIG5ldyBpbnN0YW5jZSBvZiB0aGlzIGNsYXNzIGZyb20gYW4gb2JqZWN0XG4gICAqIGNvbnRhaW5pbmcgdGhlIENsb3VkRm9ybWF0aW9uIHByb3BlcnRpZXMgb2YgdGhpcyByZXNvdXJjZS5cbiAgICogVXNlZCBpbiB0aGUgQGF3cy1jZGsvY2xvdWRmb3JtYXRpb24taW5jbHVkZSBtb2R1bGUuXG4gICAqXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBfZnJvbUNsb3VkRm9ybWF0aW9uKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIGhvb2tBdHRyaWJ1dGVzOiBhbnksXG4gICAgb3B0aW9uczogRnJvbUNsb3VkRm9ybWF0aW9uT3B0aW9ucyk6IENmbkNvZGVEZXBsb3lCbHVlR3JlZW5Ib29rIHtcblxuICAgIGhvb2tBdHRyaWJ1dGVzID0gaG9va0F0dHJpYnV0ZXMgfHwge307XG4gICAgY29uc3QgaG9va1Byb3BlcnRpZXMgPSBvcHRpb25zLnBhcnNlci5wYXJzZVZhbHVlKGhvb2tBdHRyaWJ1dGVzLlByb3BlcnRpZXMpO1xuICAgIHJldHVybiBuZXcgQ2ZuQ29kZURlcGxveUJsdWVHcmVlbkhvb2soc2NvcGUsIGlkLCB7XG4gICAgICBzZXJ2aWNlUm9sZTogaG9va1Byb3BlcnRpZXM/LlNlcnZpY2VSb2xlLFxuICAgICAgYXBwbGljYXRpb25zOiBob29rUHJvcGVydGllcz8uQXBwbGljYXRpb25zPy5tYXAoYXBwbGljYXRpb25Gcm9tQ2xvdWRGb3JtYXRpb24pLFxuICAgICAgdHJhZmZpY1JvdXRpbmdDb25maWc6IHtcbiAgICAgICAgdHlwZTogaG9va1Byb3BlcnRpZXM/LlRyYWZmaWNSb3V0aW5nQ29uZmlnPy5UeXBlLFxuICAgICAgICB0aW1lQmFzZWRDYW5hcnk6IHtcbiAgICAgICAgICBzdGVwUGVyY2VudGFnZTogaG9va1Byb3BlcnRpZXM/LlRyYWZmaWNSb3V0aW5nQ29uZmlnPy5UaW1lQmFzZWRDYW5hcnk/LlN0ZXBQZXJjZW50YWdlLFxuICAgICAgICAgIGJha2VUaW1lTWluczogaG9va1Byb3BlcnRpZXM/LlRyYWZmaWNSb3V0aW5nQ29uZmlnPy5UaW1lQmFzZWRDYW5hcnk/LkJha2VUaW1lTWlucyxcbiAgICAgICAgfSxcbiAgICAgICAgdGltZUJhc2VkTGluZWFyOiB7XG4gICAgICAgICAgc3RlcFBlcmNlbnRhZ2U6IGhvb2tQcm9wZXJ0aWVzPy5UcmFmZmljUm91dGluZ0NvbmZpZz8uVGltZUJhc2VkTGluZWFyPy5TdGVwUGVyY2VudGFnZSxcbiAgICAgICAgICBiYWtlVGltZU1pbnM6IGhvb2tQcm9wZXJ0aWVzPy5UcmFmZmljUm91dGluZ0NvbmZpZz8uVGltZUJhc2VkTGluZWFyPy5CYWtlVGltZU1pbnMsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgYWRkaXRpb25hbE9wdGlvbnM6IHtcbiAgICAgICAgdGVybWluYXRpb25XYWl0VGltZUluTWludXRlczogaG9va1Byb3BlcnRpZXM/LkFkZGl0aW9uYWxPcHRpb25zPy5UZXJtaW5hdGlvbldhaXRUaW1lSW5NaW51dGVzLFxuICAgICAgfSxcbiAgICAgIGxpZmVjeWNsZUV2ZW50SG9va3M6IHtcbiAgICAgICAgYmVmb3JlSW5zdGFsbDogaG9va1Byb3BlcnRpZXM/LkxpZmVjeWNsZUV2ZW50SG9va3M/LkJlZm9yZUluc3RhbGwsXG4gICAgICAgIGFmdGVySW5zdGFsbDogaG9va1Byb3BlcnRpZXM/LkxpZmVjeWNsZUV2ZW50SG9va3M/LkFmdGVySW5zdGFsbCxcbiAgICAgICAgYWZ0ZXJBbGxvd1Rlc3RUcmFmZmljOiBob29rUHJvcGVydGllcz8uTGlmZWN5Y2xlRXZlbnRIb29rcz8uQWZ0ZXJBbGxvd1Rlc3RUcmFmZmljLFxuICAgICAgICBiZWZvcmVBbGxvd1RyYWZmaWM6IGhvb2tQcm9wZXJ0aWVzPy5MaWZlY3ljbGVFdmVudEhvb2tzPy5CZWZvcmVBbGxvd1RyYWZmaWMsXG4gICAgICAgIGFmdGVyQWxsb3dUcmFmZmljOiBob29rUHJvcGVydGllcz8uTGlmZWN5Y2xlRXZlbnRIb29rcz8uQWZ0ZXJBbGxvd1RyYWZmaWMsXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgZnVuY3Rpb24gYXBwbGljYXRpb25Gcm9tQ2xvdWRGb3JtYXRpb24oYXBwOiBhbnkpIHtcbiAgICAgIGNvbnN0IHRhcmdldCA9IGZpbmRSZXNvdXJjZShhcHA/LlRhcmdldD8uTG9naWNhbElEKTtcbiAgICAgIGNvbnN0IHRhc2tEZWZpbml0aW9uczogQXJyYXk8Q2ZuUmVzb3VyY2UgfCB1bmRlZmluZWQ+IHwgdW5kZWZpbmVkID0gYXBwPy5FQ1NBdHRyaWJ1dGVzPy5UYXNrRGVmaW5pdGlvbnM/Lm1hcChcbiAgICAgICAgKHRkOiBhbnkpID0+IGZpbmRSZXNvdXJjZSh0ZCkpO1xuICAgICAgY29uc3QgdGFza1NldHM6IEFycmF5PENmblJlc291cmNlIHwgdW5kZWZpbmVkPiB8IHVuZGVmaW5lZCA9IGFwcD8uRUNTQXR0cmlidXRlcz8uVGFza1NldHM/Lm1hcChcbiAgICAgICAgKHRzOiBhbnkpID0+IGZpbmRSZXNvdXJjZSh0cykpO1xuICAgICAgY29uc3QgcHJvZFRyYWZmaWNSb3V0ZSA9IGZpbmRSZXNvdXJjZShhcHA/LkVDU0F0dHJpYnV0ZXM/LlRyYWZmaWNSb3V0aW5nPy5Qcm9kVHJhZmZpY1JvdXRlPy5Mb2dpY2FsSUQpO1xuICAgICAgY29uc3QgdGVzdFRyYWZmaWNSb3V0ZSA9IGZpbmRSZXNvdXJjZShhcHA/LkVDU0F0dHJpYnV0ZXM/LlRyYWZmaWNSb3V0aW5nPy5UZXN0VHJhZmZpY1JvdXRlPy5Mb2dpY2FsSUQpO1xuICAgICAgY29uc3QgdGFyZ2V0R3JvdXBzOiBBcnJheTxDZm5SZXNvdXJjZSB8IHVuZGVmaW5lZD4gfCB1bmRlZmluZWQgPSBhcHA/LkVDU0F0dHJpYnV0ZXM/LlRyYWZmaWNSb3V0aW5nPy5UYXJnZXRHcm91cHM/Lm1hcChcbiAgICAgICAgKHRnOiBhbnkpID0+IGZpbmRSZXNvdXJjZSh0ZykpO1xuXG4gICAgICByZXR1cm4ge1xuICAgICAgICB0YXJnZXQ6IHtcbiAgICAgICAgICB0eXBlOiBhcHA/LlRhcmdldD8uVHlwZSxcbiAgICAgICAgICBsb2dpY2FsSWQ6IHRhcmdldD8ubG9naWNhbElkLFxuICAgICAgICB9LFxuICAgICAgICBlY3NBdHRyaWJ1dGVzOiB7XG4gICAgICAgICAgdGFza0RlZmluaXRpb25zOiB0YXNrRGVmaW5pdGlvbnM/Lm1hcCh0ZCA9PiB0ZD8ubG9naWNhbElkKSxcbiAgICAgICAgICB0YXNrU2V0czogdGFza1NldHM/Lm1hcCh0cyA9PiB0cz8ubG9naWNhbElkKSxcbiAgICAgICAgICB0cmFmZmljUm91dGluZzoge1xuICAgICAgICAgICAgcHJvZFRyYWZmaWNSb3V0ZToge1xuICAgICAgICAgICAgICB0eXBlOiBhcHA/LkVDU0F0dHJpYnV0ZXM/LlRyYWZmaWNSb3V0aW5nPy5Qcm9kVHJhZmZpY1JvdXRlPy5UeXBlLFxuICAgICAgICAgICAgICBsb2dpY2FsSWQ6IHByb2RUcmFmZmljUm91dGU/LmxvZ2ljYWxJZCxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB0ZXN0VHJhZmZpY1JvdXRlOiB7XG4gICAgICAgICAgICAgIHR5cGU6IGFwcD8uRUNTQXR0cmlidXRlcz8uVHJhZmZpY1JvdXRpbmc/LlRlc3RUcmFmZmljUm91dGU/LlR5cGUsXG4gICAgICAgICAgICAgIGxvZ2ljYWxJZDogdGVzdFRyYWZmaWNSb3V0ZT8ubG9naWNhbElkLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHRhcmdldEdyb3VwczogdGFyZ2V0R3JvdXBzPy5tYXAoKHRnKSA9PiB0Zz8ubG9naWNhbElkKSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBmaW5kUmVzb3VyY2UobG9naWNhbElkOiBzdHJpbmcgfCB1bmRlZmluZWQpOiBDZm5SZXNvdXJjZSB8IHVuZGVmaW5lZCB7XG4gICAgICBpZiAobG9naWNhbElkID09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgIH1cbiAgICAgIGNvbnN0IHJldCA9IG9wdGlvbnMucGFyc2VyLmZpbmRlci5maW5kUmVzb3VyY2UobG9naWNhbElkKTtcbiAgICAgIGlmICghcmV0KSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgSG9vayAnJHtpZH0nIHJlZmVyZW5jZXMgcmVzb3VyY2UgJyR7bG9naWNhbElkfScgdGhhdCB3YXMgbm90IGZvdW5kIGluIHRoZSB0ZW1wbGF0ZWApO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJldDtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF9zZXJ2aWNlUm9sZTogc3RyaW5nO1xuICBwcml2YXRlIF9hcHBsaWNhdGlvbnM6IENmbkNvZGVEZXBsb3lCbHVlR3JlZW5BcHBsaWNhdGlvbltdO1xuICBwcml2YXRlIF90cmFmZmljUm91dGluZ0NvbmZpZz86IENmblRyYWZmaWNSb3V0aW5nQ29uZmlnO1xuICBwcml2YXRlIF9hZGRpdGlvbmFsT3B0aW9ucz86IENmbkNvZGVEZXBsb3lCbHVlR3JlZW5BZGRpdGlvbmFsT3B0aW9ucztcbiAgcHJpdmF0ZSBfbGlmZWN5Y2xlRXZlbnRIb29rcz86IENmbkNvZGVEZXBsb3lCbHVlR3JlZW5MaWZlY3ljbGVFdmVudEhvb2tzO1xuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgbmV3IENvZGVEZXBsb3kgYmx1ZS1ncmVlbiBFQ1MgSG9vay5cbiAgICpcbiAgICogQHBhcmFtIHNjb3BlIHRoZSBzY29wZSB0byBjcmVhdGUgdGhlIGhvb2sgaW4gKHVzdWFsbHkgdGhlIGNvbnRhaW5pbmcgU3RhY2sgb2JqZWN0KVxuICAgKiBAcGFyYW0gaWQgdGhlIGlkZW50aWZpZXIgb2YgdGhlIGNvbnN0cnVjdCAtIHdpbGwgYmUgdXNlZCB0byBnZW5lcmF0ZSB0aGUgbG9naWNhbCBJRCBvZiB0aGUgSG9va1xuICAgKiBAcGFyYW0gcHJvcHMgdGhlIHByb3BlcnRpZXMgb2YgdGhlIEhvb2tcbiAgICovXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBDZm5Db2RlRGVwbG95Qmx1ZUdyZWVuSG9va1Byb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCB7XG4gICAgICB0eXBlOiAnQVdTOjpDb2RlRGVwbG95OjpCbHVlR3JlZW4nLFxuICAgICAgLy8gd2UgcmVuZGVyIHRoZSBwcm9wZXJ0aWVzIG91cnNlbHZlc1xuICAgIH0pO1xuXG4gICAgdGhpcy5fc2VydmljZVJvbGUgPSBwcm9wcy5zZXJ2aWNlUm9sZTtcbiAgICB0aGlzLl9hcHBsaWNhdGlvbnMgPSBwcm9wcy5hcHBsaWNhdGlvbnM7XG4gICAgdGhpcy5fdHJhZmZpY1JvdXRpbmdDb25maWcgPSBwcm9wcy50cmFmZmljUm91dGluZ0NvbmZpZztcbiAgICB0aGlzLl9hZGRpdGlvbmFsT3B0aW9ucyA9IHByb3BzLmFkZGl0aW9uYWxPcHRpb25zO1xuICAgIHRoaXMuX2xpZmVjeWNsZUV2ZW50SG9va3MgPSBwcm9wcy5saWZlY3ljbGVFdmVudEhvb2tzO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBJQU0gUm9sZSBmb3IgQ2xvdWRGb3JtYXRpb24gdG8gdXNlIHRvIHBlcmZvcm0gYmx1ZS1ncmVlbiBkZXBsb3ltZW50cy5cbiAgICovXG4gIHB1YmxpYyBnZXQgc2VydmljZVJvbGUoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5fc2VydmljZVJvbGU7XG4gIH1cblxuICBwdWJsaWMgc2V0IHNlcnZpY2VSb2xlKHNlcnZpY2VSb2xlOiBzdHJpbmcpIHtcbiAgICB0aGlzLl9zZXJ2aWNlUm9sZSA9IHNlcnZpY2VSb2xlO1xuICB9XG5cbiAgLyoqXG4gICAqIFByb3BlcnRpZXMgb2YgdGhlIEFtYXpvbiBFQ1MgYXBwbGljYXRpb25zIGJlaW5nIGRlcGxveWVkLlxuICAgKi9cbiAgcHVibGljIGdldCBhcHBsaWNhdGlvbnMoKTogQ2ZuQ29kZURlcGxveUJsdWVHcmVlbkFwcGxpY2F0aW9uW10ge1xuICAgIHJldHVybiB0aGlzLl9hcHBsaWNhdGlvbnM7XG4gIH1cblxuICBwdWJsaWMgc2V0IGFwcGxpY2F0aW9ucyh2YWx1ZTogQ2ZuQ29kZURlcGxveUJsdWVHcmVlbkFwcGxpY2F0aW9uW10pIHtcbiAgICB0aGlzLl9hcHBsaWNhdGlvbnMgPSB2YWx1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUcmFmZmljIHJvdXRpbmcgY29uZmlndXJhdGlvbiBzZXR0aW5ncy5cbiAgICpcbiAgICogQGRlZmF1bHQgLSB0aW1lLWJhc2VkIGNhbmFyeSB0cmFmZmljIHNoaWZ0aW5nLCB3aXRoIGEgMTUlIHN0ZXAgcGVyY2VudGFnZSBhbmQgYSBmaXZlIG1pbnV0ZSBiYWtlIHRpbWVcbiAgICovXG4gIHB1YmxpYyBnZXQgdHJhZmZpY1JvdXRpbmdDb25maWcoKTogQ2ZuVHJhZmZpY1JvdXRpbmdDb25maWcgfCB1bmRlZmluZWQge1xuICAgIHJldHVybiB0aGlzLl90cmFmZmljUm91dGluZ0NvbmZpZztcbiAgfVxuXG4gIHB1YmxpYyBzZXQgdHJhZmZpY1JvdXRpbmdDb25maWcodmFsdWU6IENmblRyYWZmaWNSb3V0aW5nQ29uZmlnIHwgdW5kZWZpbmVkKSB7XG4gICAgdGhpcy5fdHJhZmZpY1JvdXRpbmdDb25maWcgPSB2YWx1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRpdGlvbmFsIG9wdGlvbnMgZm9yIHRoZSBibHVlL2dyZWVuIGRlcGxveW1lbnQuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gbm8gYWRkaXRpb25hbCBvcHRpb25zXG4gICAqL1xuICBwdWJsaWMgZ2V0IGFkZGl0aW9uYWxPcHRpb25zKCk6IENmbkNvZGVEZXBsb3lCbHVlR3JlZW5BZGRpdGlvbmFsT3B0aW9ucyB8IHVuZGVmaW5lZCB7XG4gICAgcmV0dXJuIHRoaXMuX2FkZGl0aW9uYWxPcHRpb25zO1xuICB9XG5cbiAgcHVibGljIHNldCBhZGRpdGlvbmFsT3B0aW9ucyh2YWx1ZTogQ2ZuQ29kZURlcGxveUJsdWVHcmVlbkFkZGl0aW9uYWxPcHRpb25zIHwgdW5kZWZpbmVkKSB7XG4gICAgdGhpcy5fYWRkaXRpb25hbE9wdGlvbnMgPSB2YWx1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVc2UgbGlmZWN5Y2xlIGV2ZW50IGhvb2tzIHRvIHNwZWNpZnkgYSBMYW1iZGEgZnVuY3Rpb24gdGhhdCBDb2RlRGVwbG95IGNhbiBjYWxsIHRvIHZhbGlkYXRlIGEgZGVwbG95bWVudC5cbiAgICogWW91IGNhbiB1c2UgdGhlIHNhbWUgZnVuY3Rpb24gb3IgYSBkaWZmZXJlbnQgb25lIGZvciBkZXBsb3ltZW50IGxpZmVjeWNsZSBldmVudHMuXG4gICAqIEZvbGxvd2luZyBjb21wbGV0aW9uIG9mIHRoZSB2YWxpZGF0aW9uIHRlc3RzLFxuICAgKiB0aGUgTGFtYmRhIGBDZm5Db2RlRGVwbG95Qmx1ZUdyZWVuTGlmZWN5Y2xlRXZlbnRIb29rcy5hZnRlckFsbG93VHJhZmZpY2BcbiAgICogZnVuY3Rpb24gY2FsbHMgYmFjayBDb2RlRGVwbG95IGFuZCBkZWxpdmVycyBhIHJlc3VsdCBvZiAnU3VjY2VlZGVkJyBvciAnRmFpbGVkJy5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBubyBsaWZlY3ljbGUgZXZlbnQgaG9va3NcbiAgICovXG4gIHB1YmxpYyBnZXQgbGlmZWN5Y2xlRXZlbnRIb29rcygpOiBDZm5Db2RlRGVwbG95Qmx1ZUdyZWVuTGlmZWN5Y2xlRXZlbnRIb29rcyB8IHVuZGVmaW5lZCB7XG4gICAgcmV0dXJuIHRoaXMuX2xpZmVjeWNsZUV2ZW50SG9va3M7XG4gIH1cblxuICBwdWJsaWMgc2V0IGxpZmVjeWNsZUV2ZW50SG9va3ModmFsdWU6IENmbkNvZGVEZXBsb3lCbHVlR3JlZW5MaWZlY3ljbGVFdmVudEhvb2tzIHwgdW5kZWZpbmVkKSB7XG4gICAgdGhpcy5fbGlmZWN5Y2xlRXZlbnRIb29rcyA9IHZhbHVlO1xuICB9XG5cbiAgcHJvdGVjdGVkIHJlbmRlclByb3BlcnRpZXMoX3Byb3BzPzogeyBbcDogc3RyaW5nXTogYW55IH0pOiB7IFtwOiBzdHJpbmddOiBhbnkgfSB8IHVuZGVmaW5lZCB7XG4gICAgcmV0dXJuIHtcbiAgICAgIFNlcnZpY2VSb2xlOiB0aGlzLnNlcnZpY2VSb2xlLFxuICAgICAgQXBwbGljYXRpb25zOiB0aGlzLmFwcGxpY2F0aW9ucy5tYXAoKGFwcCkgPT4gKHtcbiAgICAgICAgVGFyZ2V0OiB7XG4gICAgICAgICAgVHlwZTogYXBwLnRhcmdldC50eXBlLFxuICAgICAgICAgIExvZ2ljYWxJRDogYXBwLnRhcmdldC5sb2dpY2FsSWQsXG4gICAgICAgIH0sXG4gICAgICAgIEVDU0F0dHJpYnV0ZXM6IHtcbiAgICAgICAgICBUYXNrRGVmaW5pdGlvbnM6IGFwcC5lY3NBdHRyaWJ1dGVzLnRhc2tEZWZpbml0aW9ucyxcbiAgICAgICAgICBUYXNrU2V0czogYXBwLmVjc0F0dHJpYnV0ZXMudGFza1NldHMsXG4gICAgICAgICAgVHJhZmZpY1JvdXRpbmc6IHtcbiAgICAgICAgICAgIFByb2RUcmFmZmljUm91dGU6IHtcbiAgICAgICAgICAgICAgVHlwZTogYXBwLmVjc0F0dHJpYnV0ZXMudHJhZmZpY1JvdXRpbmcucHJvZFRyYWZmaWNSb3V0ZS50eXBlLFxuICAgICAgICAgICAgICBMb2dpY2FsSUQ6IGFwcC5lY3NBdHRyaWJ1dGVzLnRyYWZmaWNSb3V0aW5nLnByb2RUcmFmZmljUm91dGUubG9naWNhbElkLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFRlc3RUcmFmZmljUm91dGU6IHtcbiAgICAgICAgICAgICAgVHlwZTogYXBwLmVjc0F0dHJpYnV0ZXMudHJhZmZpY1JvdXRpbmcudGVzdFRyYWZmaWNSb3V0ZS50eXBlLFxuICAgICAgICAgICAgICBMb2dpY2FsSUQ6IGFwcC5lY3NBdHRyaWJ1dGVzLnRyYWZmaWNSb3V0aW5nLnRlc3RUcmFmZmljUm91dGUubG9naWNhbElkLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFRhcmdldEdyb3VwczogYXBwLmVjc0F0dHJpYnV0ZXMudHJhZmZpY1JvdXRpbmcudGFyZ2V0R3JvdXBzLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9KSksXG4gICAgICBUcmFmZmljUm91dGluZ0NvbmZpZzogdW5kZWZpbmVkSWZBbGxWYWx1ZXNBcmVFbXB0eSh7XG4gICAgICAgIFR5cGU6IHRoaXMudHJhZmZpY1JvdXRpbmdDb25maWc/LnR5cGUsXG4gICAgICAgIFRpbWVCYXNlZENhbmFyeTogdW5kZWZpbmVkSWZBbGxWYWx1ZXNBcmVFbXB0eSh7XG4gICAgICAgICAgU3RlcFBlcmNlbnRhZ2U6IHRoaXMudHJhZmZpY1JvdXRpbmdDb25maWc/LnRpbWVCYXNlZENhbmFyeT8uc3RlcFBlcmNlbnRhZ2UsXG4gICAgICAgICAgQmFrZVRpbWVNaW5zOiB0aGlzLnRyYWZmaWNSb3V0aW5nQ29uZmlnPy50aW1lQmFzZWRDYW5hcnk/LmJha2VUaW1lTWlucyxcbiAgICAgICAgfSksXG4gICAgICAgIFRpbWVCYXNlZExpbmVhcjogdW5kZWZpbmVkSWZBbGxWYWx1ZXNBcmVFbXB0eSh7XG4gICAgICAgICAgU3RlcFBlcmNlbnRhZ2U6IHRoaXMudHJhZmZpY1JvdXRpbmdDb25maWc/LnRpbWVCYXNlZExpbmVhcj8uc3RlcFBlcmNlbnRhZ2UsXG4gICAgICAgICAgQmFrZVRpbWVNaW5zOiB0aGlzLnRyYWZmaWNSb3V0aW5nQ29uZmlnPy50aW1lQmFzZWRMaW5lYXI/LmJha2VUaW1lTWlucyxcbiAgICAgICAgfSksXG4gICAgICB9KSxcbiAgICAgIEFkZGl0aW9uYWxPcHRpb25zOiB1bmRlZmluZWRJZkFsbFZhbHVlc0FyZUVtcHR5KHtcbiAgICAgICAgVGVybWluYXRpb25XYWl0VGltZUluTWludXRlczogdGhpcy5hZGRpdGlvbmFsT3B0aW9ucz8udGVybWluYXRpb25XYWl0VGltZUluTWludXRlcyxcbiAgICAgIH0pLFxuICAgICAgTGlmZWN5Y2xlRXZlbnRIb29rczogdW5kZWZpbmVkSWZBbGxWYWx1ZXNBcmVFbXB0eSh7XG4gICAgICAgIEJlZm9yZUluc3RhbGw6IHRoaXMubGlmZWN5Y2xlRXZlbnRIb29rcz8uYmVmb3JlSW5zdGFsbCxcbiAgICAgICAgQWZ0ZXJJbnN0YWxsOiB0aGlzLmxpZmVjeWNsZUV2ZW50SG9va3M/LmFmdGVySW5zdGFsbCxcbiAgICAgICAgQWZ0ZXJBbGxvd1Rlc3RUcmFmZmljOiB0aGlzLmxpZmVjeWNsZUV2ZW50SG9va3M/LmFmdGVyQWxsb3dUZXN0VHJhZmZpYyxcbiAgICAgICAgQmVmb3JlQWxsb3dUcmFmZmljOiB0aGlzLmxpZmVjeWNsZUV2ZW50SG9va3M/LmJlZm9yZUFsbG93VHJhZmZpYyxcbiAgICAgICAgQWZ0ZXJBbGxvd1RyYWZmaWM6IHRoaXMubGlmZWN5Y2xlRXZlbnRIb29rcz8uYWZ0ZXJBbGxvd1RyYWZmaWMsXG4gICAgICB9KSxcbiAgICB9O1xuICB9XG59XG4iXX0=