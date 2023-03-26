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
     * Creates a new CodeDeploy blue-green ECS Hook.
     *
     * @param scope the scope to create the hook in (usually the containing Stack object)
     * @param id the identifier of the construct - will be used to generate the logical ID of the Hook
     * @param props the properties of the Hook
     */
    constructor(scope, id, props) {
        super(scope, id, {
            type: 'AWS::CodeDeploy::BlueGreen',
            // we render the properties ourselves
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
            TrafficRoutingConfig: (0, util_1.undefinedIfAllValuesAreEmpty)({
                Type: this.trafficRoutingConfig?.type,
                TimeBasedCanary: (0, util_1.undefinedIfAllValuesAreEmpty)({
                    StepPercentage: this.trafficRoutingConfig?.timeBasedCanary?.stepPercentage,
                    BakeTimeMins: this.trafficRoutingConfig?.timeBasedCanary?.bakeTimeMins,
                }),
                TimeBasedLinear: (0, util_1.undefinedIfAllValuesAreEmpty)({
                    StepPercentage: this.trafficRoutingConfig?.timeBasedLinear?.stepPercentage,
                    BakeTimeMins: this.trafficRoutingConfig?.timeBasedLinear?.bakeTimeMins,
                }),
            }),
            AdditionalOptions: (0, util_1.undefinedIfAllValuesAreEmpty)({
                TerminationWaitTimeInMinutes: this.additionalOptions?.terminationWaitTimeInMinutes,
            }),
            LifecycleEventHooks: (0, util_1.undefinedIfAllValuesAreEmpty)({
                BeforeInstall: this.lifecycleEventHooks?.beforeInstall,
                AfterInstall: this.lifecycleEventHooks?.afterInstall,
                AfterAllowTestTraffic: this.lifecycleEventHooks?.afterAllowTestTraffic,
                BeforeAllowTraffic: this.lifecycleEventHooks?.beforeAllowTraffic,
                AfterAllowTraffic: this.lifecycleEventHooks?.afterAllowTraffic,
            }),
        };
    }
}
_a = JSII_RTTI_SYMBOL_1;
CfnCodeDeployBlueGreenHook[_a] = { fqn: "@aws-cdk/core.CfnCodeDeployBlueGreenHook", version: "0.0.0" };
exports.CfnCodeDeployBlueGreenHook = CfnCodeDeployBlueGreenHook;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2ZuLWNvZGVkZXBsb3ktYmx1ZS1ncmVlbi1ob29rLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY2ZuLWNvZGVkZXBsb3ktYmx1ZS1ncmVlbi1ob29rLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUNBLHlDQUFxQztBQUdyQyxpQ0FBc0Q7QUFFdEQ7OztHQUdHO0FBQ0gsSUFBWSxxQkFnQlg7QUFoQkQsV0FBWSxxQkFBcUI7SUFDL0I7O09BRUc7SUFDSCxrREFBeUIsQ0FBQTtJQUV6Qjs7T0FFRztJQUNILDhEQUFxQyxDQUFBO0lBRXJDOzs7T0FHRztJQUNILDhEQUFxQyxDQUFBO0FBQ3ZDLENBQUMsRUFoQlcscUJBQXFCLEdBQXJCLDZCQUFxQixLQUFyQiw2QkFBcUIsUUFnQmhDO0FBbVFEOzs7O0dBSUc7QUFDSCxNQUFhLDBCQUEyQixTQUFRLGtCQUFPO0lBQ3JEOzs7Ozs7T0FNRztJQUNJLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxLQUFnQixFQUFFLEVBQVUsRUFBRSxjQUFtQixFQUNqRixPQUFrQztRQUVsQyxjQUFjLEdBQUcsY0FBYyxJQUFJLEVBQUUsQ0FBQztRQUN0QyxNQUFNLGNBQWMsR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxjQUFjLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDNUUsT0FBTyxJQUFJLDBCQUEwQixDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUU7WUFDL0MsV0FBVyxFQUFFLGNBQWMsRUFBRSxXQUFXO1lBQ3hDLFlBQVksRUFBRSxjQUFjLEVBQUUsWUFBWSxFQUFFLEdBQUcsQ0FBQyw2QkFBNkIsQ0FBQztZQUM5RSxvQkFBb0IsRUFBRTtnQkFDcEIsSUFBSSxFQUFFLGNBQWMsRUFBRSxvQkFBb0IsRUFBRSxJQUFJO2dCQUNoRCxlQUFlLEVBQUU7b0JBQ2YsY0FBYyxFQUFFLGNBQWMsRUFBRSxvQkFBb0IsRUFBRSxlQUFlLEVBQUUsY0FBYztvQkFDckYsWUFBWSxFQUFFLGNBQWMsRUFBRSxv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QUFhO2dCQUN0RCxZQUFZLEVBQUUsSUFBSSxDQUFDLG1CQUFtQixFQUFFLFlBQVk7Z0JBQ3BELHFCQUFxQixFQUFFLElBQUksQ0FBQyxtQkFBbUIsRUFBRSxxQkFBcUI7Z0JBQ3RFLGtCQUFrQixFQUFFLElBQUksQ0FBQyxtQkFBbUIsRUFBRSxrQkFBa0I7Z0JBQ2hFLGlCQUFpQixFQUFFLElBQUksQ0FBQyxtQkFBbUIsRUFBRSxpQkFBaUI7YUFDL0QsQ0FBQztTQUNILENBQUM7S0FDSDs7OztBQTlOVSxnRUFBMEIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCB7IENmbkhvb2sgfSBmcm9tICcuL2Nmbi1ob29rJztcbmltcG9ydCB7IENmblJlc291cmNlIH0gZnJvbSAnLi9jZm4tcmVzb3VyY2UnO1xuaW1wb3J0IHsgRnJvbUNsb3VkRm9ybWF0aW9uT3B0aW9ucyB9IGZyb20gJy4vaGVscGVycy1pbnRlcm5hbCc7XG5pbXBvcnQgeyB1bmRlZmluZWRJZkFsbFZhbHVlc0FyZUVtcHR5IH0gZnJvbSAnLi91dGlsJztcblxuLyoqXG4gKiBUaGUgcG9zc2libGUgdHlwZXMgb2YgdHJhZmZpYyBzaGlmdGluZyBmb3IgdGhlIGJsdWUtZ3JlZW4gZGVwbG95bWVudCBjb25maWd1cmF0aW9uLlxuICogVGhlIHR5cGUgb2YgdGhlIGBDZm5UcmFmZmljUm91dGluZ0NvbmZpZy50eXBlYCBwcm9wZXJ0eS5cbiAqL1xuZXhwb3J0IGVudW0gQ2ZuVHJhZmZpY1JvdXRpbmdUeXBlIHtcbiAgLyoqXG4gICAqIFN3aXRjaCBmcm9tIGJsdWUgdG8gZ3JlZW4gYXQgb25jZS5cbiAgICovXG4gIEFMTF9BVF9PTkNFID0gJ0FsbEF0T25jZScsXG5cbiAgLyoqXG4gICAqIFNwZWNpZmllcyBhIGNvbmZpZ3VyYXRpb24gdGhhdCBzaGlmdHMgdHJhZmZpYyBmcm9tIGJsdWUgdG8gZ3JlZW4gaW4gdHdvIGluY3JlbWVudHMuXG4gICAqL1xuICBUSU1FX0JBU0VEX0NBTkFSWSA9ICdUaW1lQmFzZWRDYW5hcnknLFxuXG4gIC8qKlxuICAgKiBTcGVjaWZpZXMgYSBjb25maWd1cmF0aW9uIHRoYXQgc2hpZnRzIHRyYWZmaWMgZnJvbSBibHVlIHRvIGdyZWVuIGluIGVxdWFsIGluY3JlbWVudHMsXG4gICAqIHdpdGggYW4gZXF1YWwgbnVtYmVyIG9mIG1pbnV0ZXMgYmV0d2VlbiBlYWNoIGluY3JlbWVudC5cbiAgICovXG4gIFRJTUVfQkFTRURfTElORUFSID0gJ1RpbWVCYXNlZExpbmVhcicsXG59XG5cbi8qKlxuICogVGhlIHRyYWZmaWMgcm91dGluZyBjb25maWd1cmF0aW9uIGlmIGBDZm5UcmFmZmljUm91dGluZ0NvbmZpZy50eXBlYFxuICogaXMgYENmblRyYWZmaWNSb3V0aW5nVHlwZS5USU1FX0JBU0VEX0NBTkFSWWAuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQ2ZuVHJhZmZpY1JvdXRpbmdUaW1lQmFzZWRDYW5hcnkge1xuICAvKipcbiAgICogVGhlIHBlcmNlbnRhZ2Ugb2YgdHJhZmZpYyB0byBzaGlmdCBpbiB0aGUgZmlyc3QgaW5jcmVtZW50IG9mIGEgdGltZS1iYXNlZCBjYW5hcnkgZGVwbG95bWVudC5cbiAgICogVGhlIHN0ZXAgcGVyY2VudGFnZSBtdXN0IGJlIDE0JSBvciBncmVhdGVyLlxuICAgKlxuICAgKiBAZGVmYXVsdCAxNVxuICAgKi9cbiAgcmVhZG9ubHkgc3RlcFBlcmNlbnRhZ2U/OiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIFRoZSBudW1iZXIgb2YgbWludXRlcyBiZXR3ZWVuIHRoZSBmaXJzdCBhbmQgc2Vjb25kIHRyYWZmaWMgc2hpZnRzIG9mIGEgdGltZS1iYXNlZCBjYW5hcnkgZGVwbG95bWVudC5cbiAgICpcbiAgICogQGRlZmF1bHQgNVxuICAgKi9cbiAgcmVhZG9ubHkgYmFrZVRpbWVNaW5zPzogbnVtYmVyO1xufVxuXG4vKipcbiAqIFRoZSB0cmFmZmljIHJvdXRpbmcgY29uZmlndXJhdGlvbiBpZiBgQ2ZuVHJhZmZpY1JvdXRpbmdDb25maWcudHlwZWBcbiAqIGlzIGBDZm5UcmFmZmljUm91dGluZ1R5cGUuVElNRV9CQVNFRF9MSU5FQVJgLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIENmblRyYWZmaWNSb3V0aW5nVGltZUJhc2VkTGluZWFyIHtcbiAgLyoqXG4gICAqIFRoZSBwZXJjZW50YWdlIG9mIHRyYWZmaWMgdGhhdCBpcyBzaGlmdGVkIGF0IHRoZSBzdGFydCBvZiBlYWNoIGluY3JlbWVudCBvZiBhIHRpbWUtYmFzZWQgbGluZWFyIGRlcGxveW1lbnQuXG4gICAqIFRoZSBzdGVwIHBlcmNlbnRhZ2UgbXVzdCBiZSAxNCUgb3IgZ3JlYXRlci5cbiAgICpcbiAgICogQGRlZmF1bHQgMTVcbiAgICovXG4gIHJlYWRvbmx5IHN0ZXBQZXJjZW50YWdlPzogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBUaGUgbnVtYmVyIG9mIG1pbnV0ZXMgYmV0d2VlbiB0aGUgZmlyc3QgYW5kIHNlY29uZCB0cmFmZmljIHNoaWZ0cyBvZiBhIHRpbWUtYmFzZWQgbGluZWFyIGRlcGxveW1lbnQuXG4gICAqXG4gICAqIEBkZWZhdWx0IDVcbiAgICovXG4gIHJlYWRvbmx5IGJha2VUaW1lTWlucz86IG51bWJlcjtcbn1cblxuLyoqXG4gKiBUcmFmZmljIHJvdXRpbmcgY29uZmlndXJhdGlvbiBzZXR0aW5ncy5cbiAqIFRoZSB0eXBlIG9mIHRoZSBgQ2ZuQ29kZURlcGxveUJsdWVHcmVlbkhvb2tQcm9wcy50cmFmZmljUm91dGluZ0NvbmZpZ2AgcHJvcGVydHkuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQ2ZuVHJhZmZpY1JvdXRpbmdDb25maWcge1xuICAvKipcbiAgICogVGhlIHR5cGUgb2YgdHJhZmZpYyBzaGlmdGluZyB1c2VkIGJ5IHRoZSBibHVlLWdyZWVuIGRlcGxveW1lbnQgY29uZmlndXJhdGlvbi5cbiAgICovXG4gIHJlYWRvbmx5IHR5cGU6IENmblRyYWZmaWNSb3V0aW5nVHlwZTtcblxuICAvKipcbiAgICogVGhlIGNvbmZpZ3VyYXRpb24gZm9yIHRyYWZmaWMgcm91dGluZyB3aGVuIGB0eXBlYCBpc1xuICAgKiBgQ2ZuVHJhZmZpY1JvdXRpbmdUeXBlLlRJTUVfQkFTRURfQ0FOQVJZYC5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBub25lXG4gICAqL1xuICByZWFkb25seSB0aW1lQmFzZWRDYW5hcnk/OiBDZm5UcmFmZmljUm91dGluZ1RpbWVCYXNlZENhbmFyeTtcblxuICAvKipcbiAgICogVGhlIGNvbmZpZ3VyYXRpb24gZm9yIHRyYWZmaWMgcm91dGluZyB3aGVuIGB0eXBlYCBpc1xuICAgKiBgQ2ZuVHJhZmZpY1JvdXRpbmdUeXBlLlRJTUVfQkFTRURfTElORUFSYC5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBub25lXG4gICAqL1xuICByZWFkb25seSB0aW1lQmFzZWRMaW5lYXI/OiBDZm5UcmFmZmljUm91dGluZ1RpbWVCYXNlZExpbmVhcjtcbn1cblxuLyoqXG4gKiBBZGRpdGlvbmFsIG9wdGlvbnMgZm9yIHRoZSBibHVlL2dyZWVuIGRlcGxveW1lbnQuXG4gKiBUaGUgdHlwZSBvZiB0aGUgYENmbkNvZGVEZXBsb3lCbHVlR3JlZW5Ib29rUHJvcHMuYWRkaXRpb25hbE9wdGlvbnNgIHByb3BlcnR5LlxuICovXG5leHBvcnQgaW50ZXJmYWNlIENmbkNvZGVEZXBsb3lCbHVlR3JlZW5BZGRpdGlvbmFsT3B0aW9ucyB7XG4gIC8qKlxuICAgKiBTcGVjaWZpZXMgdGltZSB0byB3YWl0LCBpbiBtaW51dGVzLCBiZWZvcmUgdGVybWluYXRpbmcgdGhlIGJsdWUgcmVzb3VyY2VzLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIDUgbWludXRlc1xuICAgKi9cbiAgcmVhZG9ubHkgdGVybWluYXRpb25XYWl0VGltZUluTWludXRlcz86IG51bWJlcjtcbn1cblxuLyoqXG4gKiBMaWZlY3ljbGUgZXZlbnRzIGZvciBibHVlLWdyZWVuIGRlcGxveW1lbnRzLlxuICogVGhlIHR5cGUgb2YgdGhlIGBDZm5Db2RlRGVwbG95Qmx1ZUdyZWVuSG9va1Byb3BzLmxpZmVjeWNsZUV2ZW50SG9va3NgIHByb3BlcnR5LlxuICovXG5leHBvcnQgaW50ZXJmYWNlIENmbkNvZGVEZXBsb3lCbHVlR3JlZW5MaWZlY3ljbGVFdmVudEhvb2tzIHtcbiAgLyoqXG4gICAqIEZ1bmN0aW9uIHRvIHVzZSB0byBydW4gdGFza3MgYmVmb3JlIHRoZSByZXBsYWNlbWVudCB0YXNrIHNldCBpcyBjcmVhdGVkLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIG5vbmVcbiAgICovXG4gIHJlYWRvbmx5IGJlZm9yZUluc3RhbGw/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIEZ1bmN0aW9uIHRvIHVzZSB0byBydW4gdGFza3MgYWZ0ZXIgdGhlIHJlcGxhY2VtZW50IHRhc2sgc2V0IGlzIGNyZWF0ZWQgYW5kIG9uZSBvZiB0aGUgdGFyZ2V0IGdyb3VwcyBpcyBhc3NvY2lhdGVkIHdpdGggaXQuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gbm9uZVxuICAgKi9cbiAgcmVhZG9ubHkgYWZ0ZXJJbnN0YWxsPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBGdW5jdGlvbiB0byB1c2UgdG8gcnVuIHRhc2tzIGFmdGVyIHRoZSB0ZXN0IGxpc3RlbmVyIHNlcnZlcyB0cmFmZmljIHRvIHRoZSByZXBsYWNlbWVudCB0YXNrIHNldC5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBub25lXG4gICAqL1xuICByZWFkb25seSBhZnRlckFsbG93VGVzdFRyYWZmaWM/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIEZ1bmN0aW9uIHRvIHVzZSB0byBydW4gdGFza3MgYWZ0ZXIgdGhlIHNlY29uZCB0YXJnZXQgZ3JvdXAgaXMgYXNzb2NpYXRlZCB3aXRoIHRoZSByZXBsYWNlbWVudCB0YXNrIHNldCxcbiAgICogYnV0IGJlZm9yZSB0cmFmZmljIGlzIHNoaWZ0ZWQgdG8gdGhlIHJlcGxhY2VtZW50IHRhc2sgc2V0LlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIG5vbmVcbiAgICovXG4gIHJlYWRvbmx5IGJlZm9yZUFsbG93VHJhZmZpYz86IHN0cmluZztcblxuICAvKipcbiAgICogRnVuY3Rpb24gdG8gdXNlIHRvIHJ1biB0YXNrcyBhZnRlciB0aGUgc2Vjb25kIHRhcmdldCBncm91cCBzZXJ2ZXMgdHJhZmZpYyB0byB0aGUgcmVwbGFjZW1lbnQgdGFzayBzZXQuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gbm9uZVxuICAgKi9cbiAgcmVhZG9ubHkgYWZ0ZXJBbGxvd1RyYWZmaWM/OiBzdHJpbmc7XG59XG5cbi8qKlxuICogVHlwZSBvZiB0aGUgYENmbkNvZGVEZXBsb3lCbHVlR3JlZW5BcHBsaWNhdGlvbi50YXJnZXRgIHByb3BlcnR5LlxuICovXG5leHBvcnQgaW50ZXJmYWNlIENmbkNvZGVEZXBsb3lCbHVlR3JlZW5BcHBsaWNhdGlvblRhcmdldCB7XG4gIC8qKlxuICAgKiBUaGUgcmVzb3VyY2UgdHlwZSBvZiB0aGUgdGFyZ2V0IGJlaW5nIGRlcGxveWVkLlxuICAgKiBSaWdodCBub3csIHRoZSBvbmx5IGFsbG93ZWQgdmFsdWUgaXMgJ0FXUzo6RUNTOjpTZXJ2aWNlJy5cbiAgICovXG4gIHJlYWRvbmx5IHR5cGU6IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIGxvZ2ljYWwgaWQgb2YgdGhlIHRhcmdldCByZXNvdXJjZS5cbiAgICovXG4gIHJlYWRvbmx5IGxvZ2ljYWxJZDogc3RyaW5nO1xufVxuXG4vKipcbiAqIEEgdHJhZmZpYyByb3V0ZSxcbiAqIHJlcHJlc2VudGluZyB3aGVyZSB0aGUgdHJhZmZpYyBpcyBiZWluZyBkaXJlY3RlZCB0by5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBDZm5UcmFmZmljUm91dGUge1xuICAvKipcbiAgICogVGhlIHJlc291cmNlIHR5cGUgb2YgdGhlIHJvdXRlLlxuICAgKiBUb2RheSwgdGhlIG9ubHkgYWxsb3dlZCB2YWx1ZSBpcyAnQVdTOjpFbGFzdGljTG9hZEJhbGFuY2luZ1YyOjpMaXN0ZW5lcicuXG4gICAqL1xuICByZWFkb25seSB0eXBlOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBsb2dpY2FsIGlkIG9mIHRoZSB0YXJnZXQgcmVzb3VyY2UuXG4gICAqL1xuICByZWFkb25seSBsb2dpY2FsSWQ6IHN0cmluZztcbn1cblxuLyoqXG4gKiBUeXBlIG9mIHRoZSBgQ2ZuQ29kZURlcGxveUJsdWVHcmVlbkVjc0F0dHJpYnV0ZXMudHJhZmZpY1JvdXRpbmdgIHByb3BlcnR5LlxuICovXG5leHBvcnQgaW50ZXJmYWNlIENmblRyYWZmaWNSb3V0aW5nIHtcbiAgLyoqXG4gICAqIFRoZSBsaXN0ZW5lciB0byBiZSB1c2VkIGJ5IHlvdXIgbG9hZCBiYWxhbmNlciB0byBkaXJlY3QgdHJhZmZpYyB0byB5b3VyIHRhcmdldCBncm91cHMuXG4gICAqL1xuICByZWFkb25seSBwcm9kVHJhZmZpY1JvdXRlOiBDZm5UcmFmZmljUm91dGU7XG5cbiAgLyoqXG4gICAqIFRoZSBsaXN0ZW5lciB0byBiZSB1c2VkIGJ5IHlvdXIgbG9hZCBiYWxhbmNlciB0byBkaXJlY3QgdHJhZmZpYyB0byB5b3VyIHRhcmdldCBncm91cHMuXG4gICAqL1xuICByZWFkb25seSB0ZXN0VHJhZmZpY1JvdXRlOiBDZm5UcmFmZmljUm91dGU7XG5cbiAgLyoqXG4gICAqIFRoZSBsb2dpY2FsIElEcyBvZiB0aGUgYmx1ZSBhbmQgZ3JlZW4sIHJlc3BlY3RpdmVseSxcbiAgICogQVdTOjpFbGFzdGljTG9hZEJhbGFuY2luZ1YyOjpUYXJnZXRHcm91cCB0YXJnZXQgZ3JvdXBzLlxuICAgKi9cbiAgcmVhZG9ubHkgdGFyZ2V0R3JvdXBzOiBzdHJpbmdbXTtcbn1cblxuLyoqXG4gKiBUaGUgYXR0cmlidXRlcyBvZiB0aGUgRUNTIFNlcnZpY2UgYmVpbmcgZGVwbG95ZWQuXG4gKiBUeXBlIG9mIHRoZSBgQ2ZuQ29kZURlcGxveUJsdWVHcmVlbkFwcGxpY2F0aW9uLmVjc0F0dHJpYnV0ZXNgIHByb3BlcnR5LlxuICovXG5leHBvcnQgaW50ZXJmYWNlIENmbkNvZGVEZXBsb3lCbHVlR3JlZW5FY3NBdHRyaWJ1dGVzIHtcbiAgLyoqXG4gICAqIFRoZSBsb2dpY2FsIElEcyBvZiB0aGUgYmx1ZSBhbmQgZ3JlZW4sIHJlc3BlY3RpdmVseSxcbiAgICogQVdTOjpFQ1M6OlRhc2tEZWZpbml0aW9uIHRhc2sgZGVmaW5pdGlvbnMuXG4gICAqL1xuICByZWFkb25seSB0YXNrRGVmaW5pdGlvbnM6IHN0cmluZ1tdO1xuXG4gIC8qKlxuICAgKiBUaGUgbG9naWNhbCBJRHMgb2YgdGhlIGJsdWUgYW5kIGdyZWVuLCByZXNwZWN0aXZlbHksXG4gICAqIEFXUzo6RUNTOjpUYXNrU2V0IHRhc2sgc2V0cy5cbiAgICovXG4gIHJlYWRvbmx5IHRhc2tTZXRzOiBzdHJpbmdbXTtcblxuICAvKipcbiAgICogVGhlIHRyYWZmaWMgcm91dGluZyBjb25maWd1cmF0aW9uLlxuICAgKi9cbiAgcmVhZG9ubHkgdHJhZmZpY1JvdXRpbmc6IENmblRyYWZmaWNSb3V0aW5nO1xufVxuXG4vKipcbiAqIFRoZSBhcHBsaWNhdGlvbiBhY3R1YWxseSBiZWluZyBkZXBsb3llZC5cbiAqIFR5cGUgb2YgdGhlIGBDZm5Db2RlRGVwbG95Qmx1ZUdyZWVuSG9va1Byb3BzLmFwcGxpY2F0aW9uc2AgcHJvcGVydHkuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQ2ZuQ29kZURlcGxveUJsdWVHcmVlbkFwcGxpY2F0aW9uIHtcbiAgLyoqXG4gICAqIFRoZSB0YXJnZXQgdGhhdCBpcyBiZWluZyBkZXBsb3llZC5cbiAgICovXG4gIHJlYWRvbmx5IHRhcmdldDogQ2ZuQ29kZURlcGxveUJsdWVHcmVlbkFwcGxpY2F0aW9uVGFyZ2V0O1xuXG4gIC8qKlxuICAgKiBUaGUgZGV0YWlsZWQgYXR0cmlidXRlcyBvZiB0aGUgZGVwbG95ZWQgdGFyZ2V0LlxuICAgKi9cbiAgcmVhZG9ubHkgZWNzQXR0cmlidXRlczogQ2ZuQ29kZURlcGxveUJsdWVHcmVlbkVjc0F0dHJpYnV0ZXM7XG59XG5cbi8qKlxuICogQ29uc3RydWN0aW9uIHByb3BlcnRpZXMgb2YgYENmbkNvZGVEZXBsb3lCbHVlR3JlZW5Ib29rYC5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBDZm5Db2RlRGVwbG95Qmx1ZUdyZWVuSG9va1Byb3BzIHtcbiAgLyoqXG4gICAqIFRoZSBJQU0gUm9sZSBmb3IgQ2xvdWRGb3JtYXRpb24gdG8gdXNlIHRvIHBlcmZvcm0gYmx1ZS1ncmVlbiBkZXBsb3ltZW50cy5cbiAgICovXG4gIHJlYWRvbmx5IHNlcnZpY2VSb2xlOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFByb3BlcnRpZXMgb2YgdGhlIEFtYXpvbiBFQ1MgYXBwbGljYXRpb25zIGJlaW5nIGRlcGxveWVkLlxuICAgKi9cbiAgcmVhZG9ubHkgYXBwbGljYXRpb25zOiBDZm5Db2RlRGVwbG95Qmx1ZUdyZWVuQXBwbGljYXRpb25bXTtcblxuICAvKipcbiAgICogVHJhZmZpYyByb3V0aW5nIGNvbmZpZ3VyYXRpb24gc2V0dGluZ3MuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gdGltZS1iYXNlZCBjYW5hcnkgdHJhZmZpYyBzaGlmdGluZywgd2l0aCBhIDE1JSBzdGVwIHBlcmNlbnRhZ2UgYW5kIGEgZml2ZSBtaW51dGUgYmFrZSB0aW1lXG4gICAqL1xuICByZWFkb25seSB0cmFmZmljUm91dGluZ0NvbmZpZz86IENmblRyYWZmaWNSb3V0aW5nQ29uZmlnO1xuXG4gIC8qKlxuICAgKiBBZGRpdGlvbmFsIG9wdGlvbnMgZm9yIHRoZSBibHVlL2dyZWVuIGRlcGxveW1lbnQuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gbm8gYWRkaXRpb25hbCBvcHRpb25zXG4gICAqL1xuICByZWFkb25seSBhZGRpdGlvbmFsT3B0aW9ucz86IENmbkNvZGVEZXBsb3lCbHVlR3JlZW5BZGRpdGlvbmFsT3B0aW9ucztcblxuICAvKipcbiAgICogVXNlIGxpZmVjeWNsZSBldmVudCBob29rcyB0byBzcGVjaWZ5IGEgTGFtYmRhIGZ1bmN0aW9uIHRoYXQgQ29kZURlcGxveSBjYW4gY2FsbCB0byB2YWxpZGF0ZSBhIGRlcGxveW1lbnQuXG4gICAqIFlvdSBjYW4gdXNlIHRoZSBzYW1lIGZ1bmN0aW9uIG9yIGEgZGlmZmVyZW50IG9uZSBmb3IgZGVwbG95bWVudCBsaWZlY3ljbGUgZXZlbnRzLlxuICAgKiBGb2xsb3dpbmcgY29tcGxldGlvbiBvZiB0aGUgdmFsaWRhdGlvbiB0ZXN0cyxcbiAgICogdGhlIExhbWJkYSBgQ2ZuQ29kZURlcGxveUJsdWVHcmVlbkxpZmVjeWNsZUV2ZW50SG9va3MuYWZ0ZXJBbGxvd1RyYWZmaWNgXG4gICAqIGZ1bmN0aW9uIGNhbGxzIGJhY2sgQ29kZURlcGxveSBhbmQgZGVsaXZlcnMgYSByZXN1bHQgb2YgJ1N1Y2NlZWRlZCcgb3IgJ0ZhaWxlZCcuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gbm8gbGlmZWN5Y2xlIGV2ZW50IGhvb2tzXG4gICAqL1xuICByZWFkb25seSBsaWZlY3ljbGVFdmVudEhvb2tzPzogQ2ZuQ29kZURlcGxveUJsdWVHcmVlbkxpZmVjeWNsZUV2ZW50SG9va3M7XG59XG5cbi8qKlxuICogQSBDbG91ZEZvcm1hdGlvbiBIb29rIGZvciBDb2RlRGVwbG95IGJsdWUtZ3JlZW4gRUNTIGRlcGxveW1lbnRzLlxuICpcbiAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYmx1ZS1ncmVlbi5odG1sI2JsdWUtZ3JlZW4tdGVtcGxhdGUtcmVmZXJlbmNlXG4gKi9cbmV4cG9ydCBjbGFzcyBDZm5Db2RlRGVwbG95Qmx1ZUdyZWVuSG9vayBleHRlbmRzIENmbkhvb2sge1xuICAvKipcbiAgICogQSBmYWN0b3J5IG1ldGhvZCB0aGF0IGNyZWF0ZXMgYSBuZXcgaW5zdGFuY2Ugb2YgdGhpcyBjbGFzcyBmcm9tIGFuIG9iamVjdFxuICAgKiBjb250YWluaW5nIHRoZSBDbG91ZEZvcm1hdGlvbiBwcm9wZXJ0aWVzIG9mIHRoaXMgcmVzb3VyY2UuXG4gICAqIFVzZWQgaW4gdGhlIEBhd3MtY2RrL2Nsb3VkZm9ybWF0aW9uLWluY2x1ZGUgbW9kdWxlLlxuICAgKlxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgX2Zyb21DbG91ZEZvcm1hdGlvbihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBob29rQXR0cmlidXRlczogYW55LFxuICAgIG9wdGlvbnM6IEZyb21DbG91ZEZvcm1hdGlvbk9wdGlvbnMpOiBDZm5Db2RlRGVwbG95Qmx1ZUdyZWVuSG9vayB7XG5cbiAgICBob29rQXR0cmlidXRlcyA9IGhvb2tBdHRyaWJ1dGVzIHx8IHt9O1xuICAgIGNvbnN0IGhvb2tQcm9wZXJ0aWVzID0gb3B0aW9ucy5wYXJzZXIucGFyc2VWYWx1ZShob29rQXR0cmlidXRlcy5Qcm9wZXJ0aWVzKTtcbiAgICByZXR1cm4gbmV3IENmbkNvZGVEZXBsb3lCbHVlR3JlZW5Ib29rKHNjb3BlLCBpZCwge1xuICAgICAgc2VydmljZVJvbGU6IGhvb2tQcm9wZXJ0aWVzPy5TZXJ2aWNlUm9sZSxcbiAgICAgIGFwcGxpY2F0aW9uczogaG9va1Byb3BlcnRpZXM/LkFwcGxpY2F0aW9ucz8ubWFwKGFwcGxpY2F0aW9uRnJvbUNsb3VkRm9ybWF0aW9uKSxcbiAgICAgIHRyYWZmaWNSb3V0aW5nQ29uZmlnOiB7XG4gICAgICAgIHR5cGU6IGhvb2tQcm9wZXJ0aWVzPy5UcmFmZmljUm91dGluZ0NvbmZpZz8uVHlwZSxcbiAgICAgICAgdGltZUJhc2VkQ2FuYXJ5OiB7XG4gICAgICAgICAgc3RlcFBlcmNlbnRhZ2U6IGhvb2tQcm9wZXJ0aWVzPy5UcmFmZmljUm91dGluZ0NvbmZpZz8uVGltZUJhc2VkQ2FuYXJ5Py5TdGVwUGVyY2VudGFnZSxcbiAgICAgICAgICBiYWtlVGltZU1pbnM6IGhvb2tQcm9wZXJ0aWVzPy5UcmFmZmljUm91dGluZ0NvbmZpZz8uVGltZUJhc2VkQ2FuYXJ5Py5CYWtlVGltZU1pbnMsXG4gICAgICAgIH0sXG4gICAgICAgIHRpbWVCYXNlZExpbmVhcjoge1xuICAgICAgICAgIHN0ZXBQZXJjZW50YWdlOiBob29rUHJvcGVydGllcz8uVHJhZmZpY1JvdXRpbmdDb25maWc/LlRpbWVCYXNlZExpbmVhcj8uU3RlcFBlcmNlbnRhZ2UsXG4gICAgICAgICAgYmFrZVRpbWVNaW5zOiBob29rUHJvcGVydGllcz8uVHJhZmZpY1JvdXRpbmdDb25maWc/LlRpbWVCYXNlZExpbmVhcj8uQmFrZVRpbWVNaW5zLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIGFkZGl0aW9uYWxPcHRpb25zOiB7XG4gICAgICAgIHRlcm1pbmF0aW9uV2FpdFRpbWVJbk1pbnV0ZXM6IGhvb2tQcm9wZXJ0aWVzPy5BZGRpdGlvbmFsT3B0aW9ucz8uVGVybWluYXRpb25XYWl0VGltZUluTWludXRlcyxcbiAgICAgIH0sXG4gICAgICBsaWZlY3ljbGVFdmVudEhvb2tzOiB7XG4gICAgICAgIGJlZm9yZUluc3RhbGw6IGhvb2tQcm9wZXJ0aWVzPy5MaWZlY3ljbGVFdmVudEhvb2tzPy5CZWZvcmVJbnN0YWxsLFxuICAgICAgICBhZnRlckluc3RhbGw6IGhvb2tQcm9wZXJ0aWVzPy5MaWZlY3ljbGVFdmVudEhvb2tzPy5BZnRlckluc3RhbGwsXG4gICAgICAgIGFmdGVyQWxsb3dUZXN0VHJhZmZpYzogaG9va1Byb3BlcnRpZXM/LkxpZmVjeWNsZUV2ZW50SG9va3M/LkFmdGVyQWxsb3dUZXN0VHJhZmZpYyxcbiAgICAgICAgYmVmb3JlQWxsb3dUcmFmZmljOiBob29rUHJvcGVydGllcz8uTGlmZWN5Y2xlRXZlbnRIb29rcz8uQmVmb3JlQWxsb3dUcmFmZmljLFxuICAgICAgICBhZnRlckFsbG93VHJhZmZpYzogaG9va1Byb3BlcnRpZXM/LkxpZmVjeWNsZUV2ZW50SG9va3M/LkFmdGVyQWxsb3dUcmFmZmljLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIGZ1bmN0aW9uIGFwcGxpY2F0aW9uRnJvbUNsb3VkRm9ybWF0aW9uKGFwcDogYW55KSB7XG4gICAgICBjb25zdCB0YXJnZXQgPSBmaW5kUmVzb3VyY2UoYXBwPy5UYXJnZXQ/LkxvZ2ljYWxJRCk7XG4gICAgICBjb25zdCB0YXNrRGVmaW5pdGlvbnM6IEFycmF5PENmblJlc291cmNlIHwgdW5kZWZpbmVkPiB8IHVuZGVmaW5lZCA9IGFwcD8uRUNTQXR0cmlidXRlcz8uVGFza0RlZmluaXRpb25zPy5tYXAoXG4gICAgICAgICh0ZDogYW55KSA9PiBmaW5kUmVzb3VyY2UodGQpKTtcbiAgICAgIGNvbnN0IHRhc2tTZXRzOiBBcnJheTxDZm5SZXNvdXJjZSB8IHVuZGVmaW5lZD4gfCB1bmRlZmluZWQgPSBhcHA/LkVDU0F0dHJpYnV0ZXM/LlRhc2tTZXRzPy5tYXAoXG4gICAgICAgICh0czogYW55KSA9PiBmaW5kUmVzb3VyY2UodHMpKTtcbiAgICAgIGNvbnN0IHByb2RUcmFmZmljUm91dGUgPSBmaW5kUmVzb3VyY2UoYXBwPy5FQ1NBdHRyaWJ1dGVzPy5UcmFmZmljUm91dGluZz8uUHJvZFRyYWZmaWNSb3V0ZT8uTG9naWNhbElEKTtcbiAgICAgIGNvbnN0IHRlc3RUcmFmZmljUm91dGUgPSBmaW5kUmVzb3VyY2UoYXBwPy5FQ1NBdHRyaWJ1dGVzPy5UcmFmZmljUm91dGluZz8uVGVzdFRyYWZmaWNSb3V0ZT8uTG9naWNhbElEKTtcbiAgICAgIGNvbnN0IHRhcmdldEdyb3VwczogQXJyYXk8Q2ZuUmVzb3VyY2UgfCB1bmRlZmluZWQ+IHwgdW5kZWZpbmVkID0gYXBwPy5FQ1NBdHRyaWJ1dGVzPy5UcmFmZmljUm91dGluZz8uVGFyZ2V0R3JvdXBzPy5tYXAoXG4gICAgICAgICh0ZzogYW55KSA9PiBmaW5kUmVzb3VyY2UodGcpKTtcblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdGFyZ2V0OiB7XG4gICAgICAgICAgdHlwZTogYXBwPy5UYXJnZXQ/LlR5cGUsXG4gICAgICAgICAgbG9naWNhbElkOiB0YXJnZXQ/LmxvZ2ljYWxJZCxcbiAgICAgICAgfSxcbiAgICAgICAgZWNzQXR0cmlidXRlczoge1xuICAgICAgICAgIHRhc2tEZWZpbml0aW9uczogdGFza0RlZmluaXRpb25zPy5tYXAodGQgPT4gdGQ/LmxvZ2ljYWxJZCksXG4gICAgICAgICAgdGFza1NldHM6IHRhc2tTZXRzPy5tYXAodHMgPT4gdHM/LmxvZ2ljYWxJZCksXG4gICAgICAgICAgdHJhZmZpY1JvdXRpbmc6IHtcbiAgICAgICAgICAgIHByb2RUcmFmZmljUm91dGU6IHtcbiAgICAgICAgICAgICAgdHlwZTogYXBwPy5FQ1NBdHRyaWJ1dGVzPy5UcmFmZmljUm91dGluZz8uUHJvZFRyYWZmaWNSb3V0ZT8uVHlwZSxcbiAgICAgICAgICAgICAgbG9naWNhbElkOiBwcm9kVHJhZmZpY1JvdXRlPy5sb2dpY2FsSWQsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdGVzdFRyYWZmaWNSb3V0ZToge1xuICAgICAgICAgICAgICB0eXBlOiBhcHA/LkVDU0F0dHJpYnV0ZXM/LlRyYWZmaWNSb3V0aW5nPy5UZXN0VHJhZmZpY1JvdXRlPy5UeXBlLFxuICAgICAgICAgICAgICBsb2dpY2FsSWQ6IHRlc3RUcmFmZmljUm91dGU/LmxvZ2ljYWxJZCxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB0YXJnZXRHcm91cHM6IHRhcmdldEdyb3Vwcz8ubWFwKCh0ZykgPT4gdGc/LmxvZ2ljYWxJZCksXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZmluZFJlc291cmNlKGxvZ2ljYWxJZDogc3RyaW5nIHwgdW5kZWZpbmVkKTogQ2ZuUmVzb3VyY2UgfCB1bmRlZmluZWQge1xuICAgICAgaWYgKGxvZ2ljYWxJZCA9PSBudWxsKSB7XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICB9XG4gICAgICBjb25zdCByZXQgPSBvcHRpb25zLnBhcnNlci5maW5kZXIuZmluZFJlc291cmNlKGxvZ2ljYWxJZCk7XG4gICAgICBpZiAoIXJldCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEhvb2sgJyR7aWR9JyByZWZlcmVuY2VzIHJlc291cmNlICcke2xvZ2ljYWxJZH0nIHRoYXQgd2FzIG5vdCBmb3VuZCBpbiB0aGUgdGVtcGxhdGVgKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXQ7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfc2VydmljZVJvbGU6IHN0cmluZztcbiAgcHJpdmF0ZSBfYXBwbGljYXRpb25zOiBDZm5Db2RlRGVwbG95Qmx1ZUdyZWVuQXBwbGljYXRpb25bXTtcbiAgcHJpdmF0ZSBfdHJhZmZpY1JvdXRpbmdDb25maWc/OiBDZm5UcmFmZmljUm91dGluZ0NvbmZpZztcbiAgcHJpdmF0ZSBfYWRkaXRpb25hbE9wdGlvbnM/OiBDZm5Db2RlRGVwbG95Qmx1ZUdyZWVuQWRkaXRpb25hbE9wdGlvbnM7XG4gIHByaXZhdGUgX2xpZmVjeWNsZUV2ZW50SG9va3M/OiBDZm5Db2RlRGVwbG95Qmx1ZUdyZWVuTGlmZWN5Y2xlRXZlbnRIb29rcztcblxuICAvKipcbiAgICogQ3JlYXRlcyBhIG5ldyBDb2RlRGVwbG95IGJsdWUtZ3JlZW4gRUNTIEhvb2suXG4gICAqXG4gICAqIEBwYXJhbSBzY29wZSB0aGUgc2NvcGUgdG8gY3JlYXRlIHRoZSBob29rIGluICh1c3VhbGx5IHRoZSBjb250YWluaW5nIFN0YWNrIG9iamVjdClcbiAgICogQHBhcmFtIGlkIHRoZSBpZGVudGlmaWVyIG9mIHRoZSBjb25zdHJ1Y3QgLSB3aWxsIGJlIHVzZWQgdG8gZ2VuZXJhdGUgdGhlIGxvZ2ljYWwgSUQgb2YgdGhlIEhvb2tcbiAgICogQHBhcmFtIHByb3BzIHRoZSBwcm9wZXJ0aWVzIG9mIHRoZSBIb29rXG4gICAqL1xuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogQ2ZuQ29kZURlcGxveUJsdWVHcmVlbkhvb2tQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwge1xuICAgICAgdHlwZTogJ0FXUzo6Q29kZURlcGxveTo6Qmx1ZUdyZWVuJyxcbiAgICAgIC8vIHdlIHJlbmRlciB0aGUgcHJvcGVydGllcyBvdXJzZWx2ZXNcbiAgICB9KTtcblxuICAgIHRoaXMuX3NlcnZpY2VSb2xlID0gcHJvcHMuc2VydmljZVJvbGU7XG4gICAgdGhpcy5fYXBwbGljYXRpb25zID0gcHJvcHMuYXBwbGljYXRpb25zO1xuICAgIHRoaXMuX3RyYWZmaWNSb3V0aW5nQ29uZmlnID0gcHJvcHMudHJhZmZpY1JvdXRpbmdDb25maWc7XG4gICAgdGhpcy5fYWRkaXRpb25hbE9wdGlvbnMgPSBwcm9wcy5hZGRpdGlvbmFsT3B0aW9ucztcbiAgICB0aGlzLl9saWZlY3ljbGVFdmVudEhvb2tzID0gcHJvcHMubGlmZWN5Y2xlRXZlbnRIb29rcztcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgSUFNIFJvbGUgZm9yIENsb3VkRm9ybWF0aW9uIHRvIHVzZSB0byBwZXJmb3JtIGJsdWUtZ3JlZW4gZGVwbG95bWVudHMuXG4gICAqL1xuICBwdWJsaWMgZ2V0IHNlcnZpY2VSb2xlKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuX3NlcnZpY2VSb2xlO1xuICB9XG5cbiAgcHVibGljIHNldCBzZXJ2aWNlUm9sZShzZXJ2aWNlUm9sZTogc3RyaW5nKSB7XG4gICAgdGhpcy5fc2VydmljZVJvbGUgPSBzZXJ2aWNlUm9sZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBQcm9wZXJ0aWVzIG9mIHRoZSBBbWF6b24gRUNTIGFwcGxpY2F0aW9ucyBiZWluZyBkZXBsb3llZC5cbiAgICovXG4gIHB1YmxpYyBnZXQgYXBwbGljYXRpb25zKCk6IENmbkNvZGVEZXBsb3lCbHVlR3JlZW5BcHBsaWNhdGlvbltdIHtcbiAgICByZXR1cm4gdGhpcy5fYXBwbGljYXRpb25zO1xuICB9XG5cbiAgcHVibGljIHNldCBhcHBsaWNhdGlvbnModmFsdWU6IENmbkNvZGVEZXBsb3lCbHVlR3JlZW5BcHBsaWNhdGlvbltdKSB7XG4gICAgdGhpcy5fYXBwbGljYXRpb25zID0gdmFsdWU7XG4gIH1cblxuICAvKipcbiAgICogVHJhZmZpYyByb3V0aW5nIGNvbmZpZ3VyYXRpb24gc2V0dGluZ3MuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gdGltZS1iYXNlZCBjYW5hcnkgdHJhZmZpYyBzaGlmdGluZywgd2l0aCBhIDE1JSBzdGVwIHBlcmNlbnRhZ2UgYW5kIGEgZml2ZSBtaW51dGUgYmFrZSB0aW1lXG4gICAqL1xuICBwdWJsaWMgZ2V0IHRyYWZmaWNSb3V0aW5nQ29uZmlnKCk6IENmblRyYWZmaWNSb3V0aW5nQ29uZmlnIHwgdW5kZWZpbmVkIHtcbiAgICByZXR1cm4gdGhpcy5fdHJhZmZpY1JvdXRpbmdDb25maWc7XG4gIH1cblxuICBwdWJsaWMgc2V0IHRyYWZmaWNSb3V0aW5nQ29uZmlnKHZhbHVlOiBDZm5UcmFmZmljUm91dGluZ0NvbmZpZyB8IHVuZGVmaW5lZCkge1xuICAgIHRoaXMuX3RyYWZmaWNSb3V0aW5nQ29uZmlnID0gdmFsdWU7XG4gIH1cblxuICAvKipcbiAgICogQWRkaXRpb25hbCBvcHRpb25zIGZvciB0aGUgYmx1ZS9ncmVlbiBkZXBsb3ltZW50LlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIG5vIGFkZGl0aW9uYWwgb3B0aW9uc1xuICAgKi9cbiAgcHVibGljIGdldCBhZGRpdGlvbmFsT3B0aW9ucygpOiBDZm5Db2RlRGVwbG95Qmx1ZUdyZWVuQWRkaXRpb25hbE9wdGlvbnMgfCB1bmRlZmluZWQge1xuICAgIHJldHVybiB0aGlzLl9hZGRpdGlvbmFsT3B0aW9ucztcbiAgfVxuXG4gIHB1YmxpYyBzZXQgYWRkaXRpb25hbE9wdGlvbnModmFsdWU6IENmbkNvZGVEZXBsb3lCbHVlR3JlZW5BZGRpdGlvbmFsT3B0aW9ucyB8IHVuZGVmaW5lZCkge1xuICAgIHRoaXMuX2FkZGl0aW9uYWxPcHRpb25zID0gdmFsdWU7XG4gIH1cblxuICAvKipcbiAgICogVXNlIGxpZmVjeWNsZSBldmVudCBob29rcyB0byBzcGVjaWZ5IGEgTGFtYmRhIGZ1bmN0aW9uIHRoYXQgQ29kZURlcGxveSBjYW4gY2FsbCB0byB2YWxpZGF0ZSBhIGRlcGxveW1lbnQuXG4gICAqIFlvdSBjYW4gdXNlIHRoZSBzYW1lIGZ1bmN0aW9uIG9yIGEgZGlmZmVyZW50IG9uZSBmb3IgZGVwbG95bWVudCBsaWZlY3ljbGUgZXZlbnRzLlxuICAgKiBGb2xsb3dpbmcgY29tcGxldGlvbiBvZiB0aGUgdmFsaWRhdGlvbiB0ZXN0cyxcbiAgICogdGhlIExhbWJkYSBgQ2ZuQ29kZURlcGxveUJsdWVHcmVlbkxpZmVjeWNsZUV2ZW50SG9va3MuYWZ0ZXJBbGxvd1RyYWZmaWNgXG4gICAqIGZ1bmN0aW9uIGNhbGxzIGJhY2sgQ29kZURlcGxveSBhbmQgZGVsaXZlcnMgYSByZXN1bHQgb2YgJ1N1Y2NlZWRlZCcgb3IgJ0ZhaWxlZCcuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gbm8gbGlmZWN5Y2xlIGV2ZW50IGhvb2tzXG4gICAqL1xuICBwdWJsaWMgZ2V0IGxpZmVjeWNsZUV2ZW50SG9va3MoKTogQ2ZuQ29kZURlcGxveUJsdWVHcmVlbkxpZmVjeWNsZUV2ZW50SG9va3MgfCB1bmRlZmluZWQge1xuICAgIHJldHVybiB0aGlzLl9saWZlY3ljbGVFdmVudEhvb2tzO1xuICB9XG5cbiAgcHVibGljIHNldCBsaWZlY3ljbGVFdmVudEhvb2tzKHZhbHVlOiBDZm5Db2RlRGVwbG95Qmx1ZUdyZWVuTGlmZWN5Y2xlRXZlbnRIb29rcyB8IHVuZGVmaW5lZCkge1xuICAgIHRoaXMuX2xpZmVjeWNsZUV2ZW50SG9va3MgPSB2YWx1ZTtcbiAgfVxuXG4gIHByb3RlY3RlZCByZW5kZXJQcm9wZXJ0aWVzKF9wcm9wcz86IHsgW3A6IHN0cmluZ106IGFueSB9KTogeyBbcDogc3RyaW5nXTogYW55IH0gfCB1bmRlZmluZWQge1xuICAgIHJldHVybiB7XG4gICAgICBTZXJ2aWNlUm9sZTogdGhpcy5zZXJ2aWNlUm9sZSxcbiAgICAgIEFwcGxpY2F0aW9uczogdGhpcy5hcHBsaWNhdGlvbnMubWFwKChhcHApID0+ICh7XG4gICAgICAgIFRhcmdldDoge1xuICAgICAgICAgIFR5cGU6IGFwcC50YXJnZXQudHlwZSxcbiAgICAgICAgICBMb2dpY2FsSUQ6IGFwcC50YXJnZXQubG9naWNhbElkLFxuICAgICAgICB9LFxuICAgICAgICBFQ1NBdHRyaWJ1dGVzOiB7XG4gICAgICAgICAgVGFza0RlZmluaXRpb25zOiBhcHAuZWNzQXR0cmlidXRlcy50YXNrRGVmaW5pdGlvbnMsXG4gICAgICAgICAgVGFza1NldHM6IGFwcC5lY3NBdHRyaWJ1dGVzLnRhc2tTZXRzLFxuICAgICAgICAgIFRyYWZmaWNSb3V0aW5nOiB7XG4gICAgICAgICAgICBQcm9kVHJhZmZpY1JvdXRlOiB7XG4gICAgICAgICAgICAgIFR5cGU6IGFwcC5lY3NBdHRyaWJ1dGVzLnRyYWZmaWNSb3V0aW5nLnByb2RUcmFmZmljUm91dGUudHlwZSxcbiAgICAgICAgICAgICAgTG9naWNhbElEOiBhcHAuZWNzQXR0cmlidXRlcy50cmFmZmljUm91dGluZy5wcm9kVHJhZmZpY1JvdXRlLmxvZ2ljYWxJZCxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBUZXN0VHJhZmZpY1JvdXRlOiB7XG4gICAgICAgICAgICAgIFR5cGU6IGFwcC5lY3NBdHRyaWJ1dGVzLnRyYWZmaWNSb3V0aW5nLnRlc3RUcmFmZmljUm91dGUudHlwZSxcbiAgICAgICAgICAgICAgTG9naWNhbElEOiBhcHAuZWNzQXR0cmlidXRlcy50cmFmZmljUm91dGluZy50ZXN0VHJhZmZpY1JvdXRlLmxvZ2ljYWxJZCxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBUYXJnZXRHcm91cHM6IGFwcC5lY3NBdHRyaWJ1dGVzLnRyYWZmaWNSb3V0aW5nLnRhcmdldEdyb3VwcyxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSkpLFxuICAgICAgVHJhZmZpY1JvdXRpbmdDb25maWc6IHVuZGVmaW5lZElmQWxsVmFsdWVzQXJlRW1wdHkoe1xuICAgICAgICBUeXBlOiB0aGlzLnRyYWZmaWNSb3V0aW5nQ29uZmlnPy50eXBlLFxuICAgICAgICBUaW1lQmFzZWRDYW5hcnk6IHVuZGVmaW5lZElmQWxsVmFsdWVzQXJlRW1wdHkoe1xuICAgICAgICAgIFN0ZXBQZXJjZW50YWdlOiB0aGlzLnRyYWZmaWNSb3V0aW5nQ29uZmlnPy50aW1lQmFzZWRDYW5hcnk/LnN0ZXBQZXJjZW50YWdlLFxuICAgICAgICAgIEJha2VUaW1lTWluczogdGhpcy50cmFmZmljUm91dGluZ0NvbmZpZz8udGltZUJhc2VkQ2FuYXJ5Py5iYWtlVGltZU1pbnMsXG4gICAgICAgIH0pLFxuICAgICAgICBUaW1lQmFzZWRMaW5lYXI6IHVuZGVmaW5lZElmQWxsVmFsdWVzQXJlRW1wdHkoe1xuICAgICAgICAgIFN0ZXBQZXJjZW50YWdlOiB0aGlzLnRyYWZmaWNSb3V0aW5nQ29uZmlnPy50aW1lQmFzZWRMaW5lYXI/LnN0ZXBQZXJjZW50YWdlLFxuICAgICAgICAgIEJha2VUaW1lTWluczogdGhpcy50cmFmZmljUm91dGluZ0NvbmZpZz8udGltZUJhc2VkTGluZWFyPy5iYWtlVGltZU1pbnMsXG4gICAgICAgIH0pLFxuICAgICAgfSksXG4gICAgICBBZGRpdGlvbmFsT3B0aW9uczogdW5kZWZpbmVkSWZBbGxWYWx1ZXNBcmVFbXB0eSh7XG4gICAgICAgIFRlcm1pbmF0aW9uV2FpdFRpbWVJbk1pbnV0ZXM6IHRoaXMuYWRkaXRpb25hbE9wdGlvbnM/LnRlcm1pbmF0aW9uV2FpdFRpbWVJbk1pbnV0ZXMsXG4gICAgICB9KSxcbiAgICAgIExpZmVjeWNsZUV2ZW50SG9va3M6IHVuZGVmaW5lZElmQWxsVmFsdWVzQXJlRW1wdHkoe1xuICAgICAgICBCZWZvcmVJbnN0YWxsOiB0aGlzLmxpZmVjeWNsZUV2ZW50SG9va3M/LmJlZm9yZUluc3RhbGwsXG4gICAgICAgIEFmdGVySW5zdGFsbDogdGhpcy5saWZlY3ljbGVFdmVudEhvb2tzPy5hZnRlckluc3RhbGwsXG4gICAgICAgIEFmdGVyQWxsb3dUZXN0VHJhZmZpYzogdGhpcy5saWZlY3ljbGVFdmVudEhvb2tzPy5hZnRlckFsbG93VGVzdFRyYWZmaWMsXG4gICAgICAgIEJlZm9yZUFsbG93VHJhZmZpYzogdGhpcy5saWZlY3ljbGVFdmVudEhvb2tzPy5iZWZvcmVBbGxvd1RyYWZmaWMsXG4gICAgICAgIEFmdGVyQWxsb3dUcmFmZmljOiB0aGlzLmxpZmVjeWNsZUV2ZW50SG9va3M/LmFmdGVyQWxsb3dUcmFmZmljLFxuICAgICAgfSksXG4gICAgfTtcbiAgfVxufVxuIl19