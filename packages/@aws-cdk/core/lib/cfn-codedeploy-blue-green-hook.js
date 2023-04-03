"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CfnCodeDeployBlueGreenHook = exports.CfnTrafficRoutingType = void 0;
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
exports.CfnCodeDeployBlueGreenHook = CfnCodeDeployBlueGreenHook;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2ZuLWNvZGVkZXBsb3ktYmx1ZS1ncmVlbi1ob29rLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY2ZuLWNvZGVkZXBsb3ktYmx1ZS1ncmVlbi1ob29rLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLHlDQUFxQztBQUdyQyxpQ0FBc0Q7QUFFdEQ7OztHQUdHO0FBQ0gsSUFBWSxxQkFnQlg7QUFoQkQsV0FBWSxxQkFBcUI7SUFDL0I7O09BRUc7SUFDSCxrREFBeUIsQ0FBQTtJQUV6Qjs7T0FFRztJQUNILDhEQUFxQyxDQUFBO0lBRXJDOzs7T0FHRztJQUNILDhEQUFxQyxDQUFBO0FBQ3ZDLENBQUMsRUFoQlcscUJBQXFCLEdBQXJCLDZCQUFxQixLQUFyQiw2QkFBcUIsUUFnQmhDO0FBbVFEOzs7O0dBSUc7QUFDSCxNQUFhLDBCQUEyQixTQUFRLGtCQUFPO0lBQ3JEOzs7Ozs7T0FNRztJQUNJLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxLQUFnQixFQUFFLEVBQVUsRUFBRSxjQUFtQixFQUNqRixPQUFrQztRQUVsQyxjQUFjLEdBQUcsY0FBYyxJQUFJLEVBQUUsQ0FBQztRQUN0QyxNQUFNLGNBQWMsR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxjQUFjLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDNUUsT0FBTyxJQUFJLDBCQUEwQixDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUU7WUFDL0MsV0FBVyxFQUFFLGNBQWMsRUFBRSxXQUFXO1lBQ3hDLFlBQVksRUFBRSxjQUFjLEVBQUUsWUFBWSxFQUFFLEdBQUcsQ0FBQyw2QkFBNkIsQ0FBQztZQUM5RSxvQkFBb0IsRUFBRTtnQkFDcEIsSUFBSSxFQUFFLGNBQWMsRUFBRSxvQkFBb0IsRUFBRSxJQUFJO2dCQUNoRCxlQUFlLEVBQUU7b0JBQ2YsY0FBYyxFQUFFLGNBQWMsRUFBRSxvQkFBb0IsRUFBRSxlQUFlLEVBQUUsY0FBYztvQkFDckYsWUFBWSxFQUFFLGNBQWMsRUFBRSxvQkFB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YUFBYSxFQUFFLElBQUksQ0FBQyxtQkFBbUIsRUFBRSxhQUFhO2dCQUN0RCxZQUFZLEVBQUUsSUFBSSxDQUFDLG1CQUFtQixFQUFFLFlBQVk7Z0JBQ3BELHFCQUFxQixFQUFFLElBQUksQ0FBQyxtQkFBbUIsRUFBRSxxQkFBcUI7Z0JBQ3RFLGtCQUFrQixFQUFFLElBQUksQ0FBQyxtQkFBbUIsRUFBRSxrQkFBa0I7Z0JBQ2hFLGlCQUFpQixFQUFFLElBQUksQ0FBQyxtQkFBbUIsRUFBRSxpQkFBaUI7YUFDL0QsQ0FBQztTQUNILENBQUM7SUFDSixDQUFDO0NBQ0Y7QUEvTkQsZ0VBK05DIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgeyBDZm5Ib29rIH0gZnJvbSAnLi9jZm4taG9vayc7XG5pbXBvcnQgeyBDZm5SZXNvdXJjZSB9IGZyb20gJy4vY2ZuLXJlc291cmNlJztcbmltcG9ydCB7IEZyb21DbG91ZEZvcm1hdGlvbk9wdGlvbnMgfSBmcm9tICcuL2hlbHBlcnMtaW50ZXJuYWwnO1xuaW1wb3J0IHsgdW5kZWZpbmVkSWZBbGxWYWx1ZXNBcmVFbXB0eSB9IGZyb20gJy4vdXRpbCc7XG5cbi8qKlxuICogVGhlIHBvc3NpYmxlIHR5cGVzIG9mIHRyYWZmaWMgc2hpZnRpbmcgZm9yIHRoZSBibHVlLWdyZWVuIGRlcGxveW1lbnQgY29uZmlndXJhdGlvbi5cbiAqIFRoZSB0eXBlIG9mIHRoZSBgQ2ZuVHJhZmZpY1JvdXRpbmdDb25maWcudHlwZWAgcHJvcGVydHkuXG4gKi9cbmV4cG9ydCBlbnVtIENmblRyYWZmaWNSb3V0aW5nVHlwZSB7XG4gIC8qKlxuICAgKiBTd2l0Y2ggZnJvbSBibHVlIHRvIGdyZWVuIGF0IG9uY2UuXG4gICAqL1xuICBBTExfQVRfT05DRSA9ICdBbGxBdE9uY2UnLFxuXG4gIC8qKlxuICAgKiBTcGVjaWZpZXMgYSBjb25maWd1cmF0aW9uIHRoYXQgc2hpZnRzIHRyYWZmaWMgZnJvbSBibHVlIHRvIGdyZWVuIGluIHR3byBpbmNyZW1lbnRzLlxuICAgKi9cbiAgVElNRV9CQVNFRF9DQU5BUlkgPSAnVGltZUJhc2VkQ2FuYXJ5JyxcblxuICAvKipcbiAgICogU3BlY2lmaWVzIGEgY29uZmlndXJhdGlvbiB0aGF0IHNoaWZ0cyB0cmFmZmljIGZyb20gYmx1ZSB0byBncmVlbiBpbiBlcXVhbCBpbmNyZW1lbnRzLFxuICAgKiB3aXRoIGFuIGVxdWFsIG51bWJlciBvZiBtaW51dGVzIGJldHdlZW4gZWFjaCBpbmNyZW1lbnQuXG4gICAqL1xuICBUSU1FX0JBU0VEX0xJTkVBUiA9ICdUaW1lQmFzZWRMaW5lYXInLFxufVxuXG4vKipcbiAqIFRoZSB0cmFmZmljIHJvdXRpbmcgY29uZmlndXJhdGlvbiBpZiBgQ2ZuVHJhZmZpY1JvdXRpbmdDb25maWcudHlwZWBcbiAqIGlzIGBDZm5UcmFmZmljUm91dGluZ1R5cGUuVElNRV9CQVNFRF9DQU5BUllgLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIENmblRyYWZmaWNSb3V0aW5nVGltZUJhc2VkQ2FuYXJ5IHtcbiAgLyoqXG4gICAqIFRoZSBwZXJjZW50YWdlIG9mIHRyYWZmaWMgdG8gc2hpZnQgaW4gdGhlIGZpcnN0IGluY3JlbWVudCBvZiBhIHRpbWUtYmFzZWQgY2FuYXJ5IGRlcGxveW1lbnQuXG4gICAqIFRoZSBzdGVwIHBlcmNlbnRhZ2UgbXVzdCBiZSAxNCUgb3IgZ3JlYXRlci5cbiAgICpcbiAgICogQGRlZmF1bHQgMTVcbiAgICovXG4gIHJlYWRvbmx5IHN0ZXBQZXJjZW50YWdlPzogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBUaGUgbnVtYmVyIG9mIG1pbnV0ZXMgYmV0d2VlbiB0aGUgZmlyc3QgYW5kIHNlY29uZCB0cmFmZmljIHNoaWZ0cyBvZiBhIHRpbWUtYmFzZWQgY2FuYXJ5IGRlcGxveW1lbnQuXG4gICAqXG4gICAqIEBkZWZhdWx0IDVcbiAgICovXG4gIHJlYWRvbmx5IGJha2VUaW1lTWlucz86IG51bWJlcjtcbn1cblxuLyoqXG4gKiBUaGUgdHJhZmZpYyByb3V0aW5nIGNvbmZpZ3VyYXRpb24gaWYgYENmblRyYWZmaWNSb3V0aW5nQ29uZmlnLnR5cGVgXG4gKiBpcyBgQ2ZuVHJhZmZpY1JvdXRpbmdUeXBlLlRJTUVfQkFTRURfTElORUFSYC5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBDZm5UcmFmZmljUm91dGluZ1RpbWVCYXNlZExpbmVhciB7XG4gIC8qKlxuICAgKiBUaGUgcGVyY2VudGFnZSBvZiB0cmFmZmljIHRoYXQgaXMgc2hpZnRlZCBhdCB0aGUgc3RhcnQgb2YgZWFjaCBpbmNyZW1lbnQgb2YgYSB0aW1lLWJhc2VkIGxpbmVhciBkZXBsb3ltZW50LlxuICAgKiBUaGUgc3RlcCBwZXJjZW50YWdlIG11c3QgYmUgMTQlIG9yIGdyZWF0ZXIuXG4gICAqXG4gICAqIEBkZWZhdWx0IDE1XG4gICAqL1xuICByZWFkb25seSBzdGVwUGVyY2VudGFnZT86IG51bWJlcjtcblxuICAvKipcbiAgICogVGhlIG51bWJlciBvZiBtaW51dGVzIGJldHdlZW4gdGhlIGZpcnN0IGFuZCBzZWNvbmQgdHJhZmZpYyBzaGlmdHMgb2YgYSB0aW1lLWJhc2VkIGxpbmVhciBkZXBsb3ltZW50LlxuICAgKlxuICAgKiBAZGVmYXVsdCA1XG4gICAqL1xuICByZWFkb25seSBiYWtlVGltZU1pbnM/OiBudW1iZXI7XG59XG5cbi8qKlxuICogVHJhZmZpYyByb3V0aW5nIGNvbmZpZ3VyYXRpb24gc2V0dGluZ3MuXG4gKiBUaGUgdHlwZSBvZiB0aGUgYENmbkNvZGVEZXBsb3lCbHVlR3JlZW5Ib29rUHJvcHMudHJhZmZpY1JvdXRpbmdDb25maWdgIHByb3BlcnR5LlxuICovXG5leHBvcnQgaW50ZXJmYWNlIENmblRyYWZmaWNSb3V0aW5nQ29uZmlnIHtcbiAgLyoqXG4gICAqIFRoZSB0eXBlIG9mIHRyYWZmaWMgc2hpZnRpbmcgdXNlZCBieSB0aGUgYmx1ZS1ncmVlbiBkZXBsb3ltZW50IGNvbmZpZ3VyYXRpb24uXG4gICAqL1xuICByZWFkb25seSB0eXBlOiBDZm5UcmFmZmljUm91dGluZ1R5cGU7XG5cbiAgLyoqXG4gICAqIFRoZSBjb25maWd1cmF0aW9uIGZvciB0cmFmZmljIHJvdXRpbmcgd2hlbiBgdHlwZWAgaXNcbiAgICogYENmblRyYWZmaWNSb3V0aW5nVHlwZS5USU1FX0JBU0VEX0NBTkFSWWAuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gbm9uZVxuICAgKi9cbiAgcmVhZG9ubHkgdGltZUJhc2VkQ2FuYXJ5PzogQ2ZuVHJhZmZpY1JvdXRpbmdUaW1lQmFzZWRDYW5hcnk7XG5cbiAgLyoqXG4gICAqIFRoZSBjb25maWd1cmF0aW9uIGZvciB0cmFmZmljIHJvdXRpbmcgd2hlbiBgdHlwZWAgaXNcbiAgICogYENmblRyYWZmaWNSb3V0aW5nVHlwZS5USU1FX0JBU0VEX0xJTkVBUmAuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gbm9uZVxuICAgKi9cbiAgcmVhZG9ubHkgdGltZUJhc2VkTGluZWFyPzogQ2ZuVHJhZmZpY1JvdXRpbmdUaW1lQmFzZWRMaW5lYXI7XG59XG5cbi8qKlxuICogQWRkaXRpb25hbCBvcHRpb25zIGZvciB0aGUgYmx1ZS9ncmVlbiBkZXBsb3ltZW50LlxuICogVGhlIHR5cGUgb2YgdGhlIGBDZm5Db2RlRGVwbG95Qmx1ZUdyZWVuSG9va1Byb3BzLmFkZGl0aW9uYWxPcHRpb25zYCBwcm9wZXJ0eS5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBDZm5Db2RlRGVwbG95Qmx1ZUdyZWVuQWRkaXRpb25hbE9wdGlvbnMge1xuICAvKipcbiAgICogU3BlY2lmaWVzIHRpbWUgdG8gd2FpdCwgaW4gbWludXRlcywgYmVmb3JlIHRlcm1pbmF0aW5nIHRoZSBibHVlIHJlc291cmNlcy5cbiAgICpcbiAgICogQGRlZmF1bHQgLSA1IG1pbnV0ZXNcbiAgICovXG4gIHJlYWRvbmx5IHRlcm1pbmF0aW9uV2FpdFRpbWVJbk1pbnV0ZXM/OiBudW1iZXI7XG59XG5cbi8qKlxuICogTGlmZWN5Y2xlIGV2ZW50cyBmb3IgYmx1ZS1ncmVlbiBkZXBsb3ltZW50cy5cbiAqIFRoZSB0eXBlIG9mIHRoZSBgQ2ZuQ29kZURlcGxveUJsdWVHcmVlbkhvb2tQcm9wcy5saWZlY3ljbGVFdmVudEhvb2tzYCBwcm9wZXJ0eS5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBDZm5Db2RlRGVwbG95Qmx1ZUdyZWVuTGlmZWN5Y2xlRXZlbnRIb29rcyB7XG4gIC8qKlxuICAgKiBGdW5jdGlvbiB0byB1c2UgdG8gcnVuIHRhc2tzIGJlZm9yZSB0aGUgcmVwbGFjZW1lbnQgdGFzayBzZXQgaXMgY3JlYXRlZC5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBub25lXG4gICAqL1xuICByZWFkb25seSBiZWZvcmVJbnN0YWxsPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBGdW5jdGlvbiB0byB1c2UgdG8gcnVuIHRhc2tzIGFmdGVyIHRoZSByZXBsYWNlbWVudCB0YXNrIHNldCBpcyBjcmVhdGVkIGFuZCBvbmUgb2YgdGhlIHRhcmdldCBncm91cHMgaXMgYXNzb2NpYXRlZCB3aXRoIGl0LlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIG5vbmVcbiAgICovXG4gIHJlYWRvbmx5IGFmdGVySW5zdGFsbD86IHN0cmluZztcblxuICAvKipcbiAgICogRnVuY3Rpb24gdG8gdXNlIHRvIHJ1biB0YXNrcyBhZnRlciB0aGUgdGVzdCBsaXN0ZW5lciBzZXJ2ZXMgdHJhZmZpYyB0byB0aGUgcmVwbGFjZW1lbnQgdGFzayBzZXQuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gbm9uZVxuICAgKi9cbiAgcmVhZG9ubHkgYWZ0ZXJBbGxvd1Rlc3RUcmFmZmljPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBGdW5jdGlvbiB0byB1c2UgdG8gcnVuIHRhc2tzIGFmdGVyIHRoZSBzZWNvbmQgdGFyZ2V0IGdyb3VwIGlzIGFzc29jaWF0ZWQgd2l0aCB0aGUgcmVwbGFjZW1lbnQgdGFzayBzZXQsXG4gICAqIGJ1dCBiZWZvcmUgdHJhZmZpYyBpcyBzaGlmdGVkIHRvIHRoZSByZXBsYWNlbWVudCB0YXNrIHNldC5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBub25lXG4gICAqL1xuICByZWFkb25seSBiZWZvcmVBbGxvd1RyYWZmaWM/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIEZ1bmN0aW9uIHRvIHVzZSB0byBydW4gdGFza3MgYWZ0ZXIgdGhlIHNlY29uZCB0YXJnZXQgZ3JvdXAgc2VydmVzIHRyYWZmaWMgdG8gdGhlIHJlcGxhY2VtZW50IHRhc2sgc2V0LlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIG5vbmVcbiAgICovXG4gIHJlYWRvbmx5IGFmdGVyQWxsb3dUcmFmZmljPzogc3RyaW5nO1xufVxuXG4vKipcbiAqIFR5cGUgb2YgdGhlIGBDZm5Db2RlRGVwbG95Qmx1ZUdyZWVuQXBwbGljYXRpb24udGFyZ2V0YCBwcm9wZXJ0eS5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBDZm5Db2RlRGVwbG95Qmx1ZUdyZWVuQXBwbGljYXRpb25UYXJnZXQge1xuICAvKipcbiAgICogVGhlIHJlc291cmNlIHR5cGUgb2YgdGhlIHRhcmdldCBiZWluZyBkZXBsb3llZC5cbiAgICogUmlnaHQgbm93LCB0aGUgb25seSBhbGxvd2VkIHZhbHVlIGlzICdBV1M6OkVDUzo6U2VydmljZScuXG4gICAqL1xuICByZWFkb25seSB0eXBlOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBsb2dpY2FsIGlkIG9mIHRoZSB0YXJnZXQgcmVzb3VyY2UuXG4gICAqL1xuICByZWFkb25seSBsb2dpY2FsSWQ6IHN0cmluZztcbn1cblxuLyoqXG4gKiBBIHRyYWZmaWMgcm91dGUsXG4gKiByZXByZXNlbnRpbmcgd2hlcmUgdGhlIHRyYWZmaWMgaXMgYmVpbmcgZGlyZWN0ZWQgdG8uXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQ2ZuVHJhZmZpY1JvdXRlIHtcbiAgLyoqXG4gICAqIFRoZSByZXNvdXJjZSB0eXBlIG9mIHRoZSByb3V0ZS5cbiAgICogVG9kYXksIHRoZSBvbmx5IGFsbG93ZWQgdmFsdWUgaXMgJ0FXUzo6RWxhc3RpY0xvYWRCYWxhbmNpbmdWMjo6TGlzdGVuZXInLlxuICAgKi9cbiAgcmVhZG9ubHkgdHlwZTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgbG9naWNhbCBpZCBvZiB0aGUgdGFyZ2V0IHJlc291cmNlLlxuICAgKi9cbiAgcmVhZG9ubHkgbG9naWNhbElkOiBzdHJpbmc7XG59XG5cbi8qKlxuICogVHlwZSBvZiB0aGUgYENmbkNvZGVEZXBsb3lCbHVlR3JlZW5FY3NBdHRyaWJ1dGVzLnRyYWZmaWNSb3V0aW5nYCBwcm9wZXJ0eS5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBDZm5UcmFmZmljUm91dGluZyB7XG4gIC8qKlxuICAgKiBUaGUgbGlzdGVuZXIgdG8gYmUgdXNlZCBieSB5b3VyIGxvYWQgYmFsYW5jZXIgdG8gZGlyZWN0IHRyYWZmaWMgdG8geW91ciB0YXJnZXQgZ3JvdXBzLlxuICAgKi9cbiAgcmVhZG9ubHkgcHJvZFRyYWZmaWNSb3V0ZTogQ2ZuVHJhZmZpY1JvdXRlO1xuXG4gIC8qKlxuICAgKiBUaGUgbGlzdGVuZXIgdG8gYmUgdXNlZCBieSB5b3VyIGxvYWQgYmFsYW5jZXIgdG8gZGlyZWN0IHRyYWZmaWMgdG8geW91ciB0YXJnZXQgZ3JvdXBzLlxuICAgKi9cbiAgcmVhZG9ubHkgdGVzdFRyYWZmaWNSb3V0ZTogQ2ZuVHJhZmZpY1JvdXRlO1xuXG4gIC8qKlxuICAgKiBUaGUgbG9naWNhbCBJRHMgb2YgdGhlIGJsdWUgYW5kIGdyZWVuLCByZXNwZWN0aXZlbHksXG4gICAqIEFXUzo6RWxhc3RpY0xvYWRCYWxhbmNpbmdWMjo6VGFyZ2V0R3JvdXAgdGFyZ2V0IGdyb3Vwcy5cbiAgICovXG4gIHJlYWRvbmx5IHRhcmdldEdyb3Vwczogc3RyaW5nW107XG59XG5cbi8qKlxuICogVGhlIGF0dHJpYnV0ZXMgb2YgdGhlIEVDUyBTZXJ2aWNlIGJlaW5nIGRlcGxveWVkLlxuICogVHlwZSBvZiB0aGUgYENmbkNvZGVEZXBsb3lCbHVlR3JlZW5BcHBsaWNhdGlvbi5lY3NBdHRyaWJ1dGVzYCBwcm9wZXJ0eS5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBDZm5Db2RlRGVwbG95Qmx1ZUdyZWVuRWNzQXR0cmlidXRlcyB7XG4gIC8qKlxuICAgKiBUaGUgbG9naWNhbCBJRHMgb2YgdGhlIGJsdWUgYW5kIGdyZWVuLCByZXNwZWN0aXZlbHksXG4gICAqIEFXUzo6RUNTOjpUYXNrRGVmaW5pdGlvbiB0YXNrIGRlZmluaXRpb25zLlxuICAgKi9cbiAgcmVhZG9ubHkgdGFza0RlZmluaXRpb25zOiBzdHJpbmdbXTtcblxuICAvKipcbiAgICogVGhlIGxvZ2ljYWwgSURzIG9mIHRoZSBibHVlIGFuZCBncmVlbiwgcmVzcGVjdGl2ZWx5LFxuICAgKiBBV1M6OkVDUzo6VGFza1NldCB0YXNrIHNldHMuXG4gICAqL1xuICByZWFkb25seSB0YXNrU2V0czogc3RyaW5nW107XG5cbiAgLyoqXG4gICAqIFRoZSB0cmFmZmljIHJvdXRpbmcgY29uZmlndXJhdGlvbi5cbiAgICovXG4gIHJlYWRvbmx5IHRyYWZmaWNSb3V0aW5nOiBDZm5UcmFmZmljUm91dGluZztcbn1cblxuLyoqXG4gKiBUaGUgYXBwbGljYXRpb24gYWN0dWFsbHkgYmVpbmcgZGVwbG95ZWQuXG4gKiBUeXBlIG9mIHRoZSBgQ2ZuQ29kZURlcGxveUJsdWVHcmVlbkhvb2tQcm9wcy5hcHBsaWNhdGlvbnNgIHByb3BlcnR5LlxuICovXG5leHBvcnQgaW50ZXJmYWNlIENmbkNvZGVEZXBsb3lCbHVlR3JlZW5BcHBsaWNhdGlvbiB7XG4gIC8qKlxuICAgKiBUaGUgdGFyZ2V0IHRoYXQgaXMgYmVpbmcgZGVwbG95ZWQuXG4gICAqL1xuICByZWFkb25seSB0YXJnZXQ6IENmbkNvZGVEZXBsb3lCbHVlR3JlZW5BcHBsaWNhdGlvblRhcmdldDtcblxuICAvKipcbiAgICogVGhlIGRldGFpbGVkIGF0dHJpYnV0ZXMgb2YgdGhlIGRlcGxveWVkIHRhcmdldC5cbiAgICovXG4gIHJlYWRvbmx5IGVjc0F0dHJpYnV0ZXM6IENmbkNvZGVEZXBsb3lCbHVlR3JlZW5FY3NBdHRyaWJ1dGVzO1xufVxuXG4vKipcbiAqIENvbnN0cnVjdGlvbiBwcm9wZXJ0aWVzIG9mIGBDZm5Db2RlRGVwbG95Qmx1ZUdyZWVuSG9va2AuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQ2ZuQ29kZURlcGxveUJsdWVHcmVlbkhvb2tQcm9wcyB7XG4gIC8qKlxuICAgKiBUaGUgSUFNIFJvbGUgZm9yIENsb3VkRm9ybWF0aW9uIHRvIHVzZSB0byBwZXJmb3JtIGJsdWUtZ3JlZW4gZGVwbG95bWVudHMuXG4gICAqL1xuICByZWFkb25seSBzZXJ2aWNlUm9sZTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBQcm9wZXJ0aWVzIG9mIHRoZSBBbWF6b24gRUNTIGFwcGxpY2F0aW9ucyBiZWluZyBkZXBsb3llZC5cbiAgICovXG4gIHJlYWRvbmx5IGFwcGxpY2F0aW9uczogQ2ZuQ29kZURlcGxveUJsdWVHcmVlbkFwcGxpY2F0aW9uW107XG5cbiAgLyoqXG4gICAqIFRyYWZmaWMgcm91dGluZyBjb25maWd1cmF0aW9uIHNldHRpbmdzLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIHRpbWUtYmFzZWQgY2FuYXJ5IHRyYWZmaWMgc2hpZnRpbmcsIHdpdGggYSAxNSUgc3RlcCBwZXJjZW50YWdlIGFuZCBhIGZpdmUgbWludXRlIGJha2UgdGltZVxuICAgKi9cbiAgcmVhZG9ubHkgdHJhZmZpY1JvdXRpbmdDb25maWc/OiBDZm5UcmFmZmljUm91dGluZ0NvbmZpZztcblxuICAvKipcbiAgICogQWRkaXRpb25hbCBvcHRpb25zIGZvciB0aGUgYmx1ZS9ncmVlbiBkZXBsb3ltZW50LlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIG5vIGFkZGl0aW9uYWwgb3B0aW9uc1xuICAgKi9cbiAgcmVhZG9ubHkgYWRkaXRpb25hbE9wdGlvbnM/OiBDZm5Db2RlRGVwbG95Qmx1ZUdyZWVuQWRkaXRpb25hbE9wdGlvbnM7XG5cbiAgLyoqXG4gICAqIFVzZSBsaWZlY3ljbGUgZXZlbnQgaG9va3MgdG8gc3BlY2lmeSBhIExhbWJkYSBmdW5jdGlvbiB0aGF0IENvZGVEZXBsb3kgY2FuIGNhbGwgdG8gdmFsaWRhdGUgYSBkZXBsb3ltZW50LlxuICAgKiBZb3UgY2FuIHVzZSB0aGUgc2FtZSBmdW5jdGlvbiBvciBhIGRpZmZlcmVudCBvbmUgZm9yIGRlcGxveW1lbnQgbGlmZWN5Y2xlIGV2ZW50cy5cbiAgICogRm9sbG93aW5nIGNvbXBsZXRpb24gb2YgdGhlIHZhbGlkYXRpb24gdGVzdHMsXG4gICAqIHRoZSBMYW1iZGEgYENmbkNvZGVEZXBsb3lCbHVlR3JlZW5MaWZlY3ljbGVFdmVudEhvb2tzLmFmdGVyQWxsb3dUcmFmZmljYFxuICAgKiBmdW5jdGlvbiBjYWxscyBiYWNrIENvZGVEZXBsb3kgYW5kIGRlbGl2ZXJzIGEgcmVzdWx0IG9mICdTdWNjZWVkZWQnIG9yICdGYWlsZWQnLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIG5vIGxpZmVjeWNsZSBldmVudCBob29rc1xuICAgKi9cbiAgcmVhZG9ubHkgbGlmZWN5Y2xlRXZlbnRIb29rcz86IENmbkNvZGVEZXBsb3lCbHVlR3JlZW5MaWZlY3ljbGVFdmVudEhvb2tzO1xufVxuXG4vKipcbiAqIEEgQ2xvdWRGb3JtYXRpb24gSG9vayBmb3IgQ29kZURlcGxveSBibHVlLWdyZWVuIEVDUyBkZXBsb3ltZW50cy5cbiAqXG4gKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2JsdWUtZ3JlZW4uaHRtbCNibHVlLWdyZWVuLXRlbXBsYXRlLXJlZmVyZW5jZVxuICovXG5leHBvcnQgY2xhc3MgQ2ZuQ29kZURlcGxveUJsdWVHcmVlbkhvb2sgZXh0ZW5kcyBDZm5Ib29rIHtcbiAgLyoqXG4gICAqIEEgZmFjdG9yeSBtZXRob2QgdGhhdCBjcmVhdGVzIGEgbmV3IGluc3RhbmNlIG9mIHRoaXMgY2xhc3MgZnJvbSBhbiBvYmplY3RcbiAgICogY29udGFpbmluZyB0aGUgQ2xvdWRGb3JtYXRpb24gcHJvcGVydGllcyBvZiB0aGlzIHJlc291cmNlLlxuICAgKiBVc2VkIGluIHRoZSBAYXdzLWNkay9jbG91ZGZvcm1hdGlvbi1pbmNsdWRlIG1vZHVsZS5cbiAgICpcbiAgICogQGludGVybmFsXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIF9mcm9tQ2xvdWRGb3JtYXRpb24oc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgaG9va0F0dHJpYnV0ZXM6IGFueSxcbiAgICBvcHRpb25zOiBGcm9tQ2xvdWRGb3JtYXRpb25PcHRpb25zKTogQ2ZuQ29kZURlcGxveUJsdWVHcmVlbkhvb2sge1xuXG4gICAgaG9va0F0dHJpYnV0ZXMgPSBob29rQXR0cmlidXRlcyB8fCB7fTtcbiAgICBjb25zdCBob29rUHJvcGVydGllcyA9IG9wdGlvbnMucGFyc2VyLnBhcnNlVmFsdWUoaG9va0F0dHJpYnV0ZXMuUHJvcGVydGllcyk7XG4gICAgcmV0dXJuIG5ldyBDZm5Db2RlRGVwbG95Qmx1ZUdyZWVuSG9vayhzY29wZSwgaWQsIHtcbiAgICAgIHNlcnZpY2VSb2xlOiBob29rUHJvcGVydGllcz8uU2VydmljZVJvbGUsXG4gICAgICBhcHBsaWNhdGlvbnM6IGhvb2tQcm9wZXJ0aWVzPy5BcHBsaWNhdGlvbnM/Lm1hcChhcHBsaWNhdGlvbkZyb21DbG91ZEZvcm1hdGlvbiksXG4gICAgICB0cmFmZmljUm91dGluZ0NvbmZpZzoge1xuICAgICAgICB0eXBlOiBob29rUHJvcGVydGllcz8uVHJhZmZpY1JvdXRpbmdDb25maWc/LlR5cGUsXG4gICAgICAgIHRpbWVCYXNlZENhbmFyeToge1xuICAgICAgICAgIHN0ZXBQZXJjZW50YWdlOiBob29rUHJvcGVydGllcz8uVHJhZmZpY1JvdXRpbmdDb25maWc/LlRpbWVCYXNlZENhbmFyeT8uU3RlcFBlcmNlbnRhZ2UsXG4gICAgICAgICAgYmFrZVRpbWVNaW5zOiBob29rUHJvcGVydGllcz8uVHJhZmZpY1JvdXRpbmdDb25maWc/LlRpbWVCYXNlZENhbmFyeT8uQmFrZVRpbWVNaW5zLFxuICAgICAgICB9LFxuICAgICAgICB0aW1lQmFzZWRMaW5lYXI6IHtcbiAgICAgICAgICBzdGVwUGVyY2VudGFnZTogaG9va1Byb3BlcnRpZXM/LlRyYWZmaWNSb3V0aW5nQ29uZmlnPy5UaW1lQmFzZWRMaW5lYXI/LlN0ZXBQZXJjZW50YWdlLFxuICAgICAgICAgIGJha2VUaW1lTWluczogaG9va1Byb3BlcnRpZXM/LlRyYWZmaWNSb3V0aW5nQ29uZmlnPy5UaW1lQmFzZWRMaW5lYXI/LkJha2VUaW1lTWlucyxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICBhZGRpdGlvbmFsT3B0aW9uczoge1xuICAgICAgICB0ZXJtaW5hdGlvbldhaXRUaW1lSW5NaW51dGVzOiBob29rUHJvcGVydGllcz8uQWRkaXRpb25hbE9wdGlvbnM/LlRlcm1pbmF0aW9uV2FpdFRpbWVJbk1pbnV0ZXMsXG4gICAgICB9LFxuICAgICAgbGlmZWN5Y2xlRXZlbnRIb29rczoge1xuICAgICAgICBiZWZvcmVJbnN0YWxsOiBob29rUHJvcGVydGllcz8uTGlmZWN5Y2xlRXZlbnRIb29rcz8uQmVmb3JlSW5zdGFsbCxcbiAgICAgICAgYWZ0ZXJJbnN0YWxsOiBob29rUHJvcGVydGllcz8uTGlmZWN5Y2xlRXZlbnRIb29rcz8uQWZ0ZXJJbnN0YWxsLFxuICAgICAgICBhZnRlckFsbG93VGVzdFRyYWZmaWM6IGhvb2tQcm9wZXJ0aWVzPy5MaWZlY3ljbGVFdmVudEhvb2tzPy5BZnRlckFsbG93VGVzdFRyYWZmaWMsXG4gICAgICAgIGJlZm9yZUFsbG93VHJhZmZpYzogaG9va1Byb3BlcnRpZXM/LkxpZmVjeWNsZUV2ZW50SG9va3M/LkJlZm9yZUFsbG93VHJhZmZpYyxcbiAgICAgICAgYWZ0ZXJBbGxvd1RyYWZmaWM6IGhvb2tQcm9wZXJ0aWVzPy5MaWZlY3ljbGVFdmVudEhvb2tzPy5BZnRlckFsbG93VHJhZmZpYyxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBmdW5jdGlvbiBhcHBsaWNhdGlvbkZyb21DbG91ZEZvcm1hdGlvbihhcHA6IGFueSkge1xuICAgICAgY29uc3QgdGFyZ2V0ID0gZmluZFJlc291cmNlKGFwcD8uVGFyZ2V0Py5Mb2dpY2FsSUQpO1xuICAgICAgY29uc3QgdGFza0RlZmluaXRpb25zOiBBcnJheTxDZm5SZXNvdXJjZSB8IHVuZGVmaW5lZD4gfCB1bmRlZmluZWQgPSBhcHA/LkVDU0F0dHJpYnV0ZXM/LlRhc2tEZWZpbml0aW9ucz8ubWFwKFxuICAgICAgICAodGQ6IGFueSkgPT4gZmluZFJlc291cmNlKHRkKSk7XG4gICAgICBjb25zdCB0YXNrU2V0czogQXJyYXk8Q2ZuUmVzb3VyY2UgfCB1bmRlZmluZWQ+IHwgdW5kZWZpbmVkID0gYXBwPy5FQ1NBdHRyaWJ1dGVzPy5UYXNrU2V0cz8ubWFwKFxuICAgICAgICAodHM6IGFueSkgPT4gZmluZFJlc291cmNlKHRzKSk7XG4gICAgICBjb25zdCBwcm9kVHJhZmZpY1JvdXRlID0gZmluZFJlc291cmNlKGFwcD8uRUNTQXR0cmlidXRlcz8uVHJhZmZpY1JvdXRpbmc/LlByb2RUcmFmZmljUm91dGU/LkxvZ2ljYWxJRCk7XG4gICAgICBjb25zdCB0ZXN0VHJhZmZpY1JvdXRlID0gZmluZFJlc291cmNlKGFwcD8uRUNTQXR0cmlidXRlcz8uVHJhZmZpY1JvdXRpbmc/LlRlc3RUcmFmZmljUm91dGU/LkxvZ2ljYWxJRCk7XG4gICAgICBjb25zdCB0YXJnZXRHcm91cHM6IEFycmF5PENmblJlc291cmNlIHwgdW5kZWZpbmVkPiB8IHVuZGVmaW5lZCA9IGFwcD8uRUNTQXR0cmlidXRlcz8uVHJhZmZpY1JvdXRpbmc/LlRhcmdldEdyb3Vwcz8ubWFwKFxuICAgICAgICAodGc6IGFueSkgPT4gZmluZFJlc291cmNlKHRnKSk7XG5cbiAgICAgIHJldHVybiB7XG4gICAgICAgIHRhcmdldDoge1xuICAgICAgICAgIHR5cGU6IGFwcD8uVGFyZ2V0Py5UeXBlLFxuICAgICAgICAgIGxvZ2ljYWxJZDogdGFyZ2V0Py5sb2dpY2FsSWQsXG4gICAgICAgIH0sXG4gICAgICAgIGVjc0F0dHJpYnV0ZXM6IHtcbiAgICAgICAgICB0YXNrRGVmaW5pdGlvbnM6IHRhc2tEZWZpbml0aW9ucz8ubWFwKHRkID0+IHRkPy5sb2dpY2FsSWQpLFxuICAgICAgICAgIHRhc2tTZXRzOiB0YXNrU2V0cz8ubWFwKHRzID0+IHRzPy5sb2dpY2FsSWQpLFxuICAgICAgICAgIHRyYWZmaWNSb3V0aW5nOiB7XG4gICAgICAgICAgICBwcm9kVHJhZmZpY1JvdXRlOiB7XG4gICAgICAgICAgICAgIHR5cGU6IGFwcD8uRUNTQXR0cmlidXRlcz8uVHJhZmZpY1JvdXRpbmc/LlByb2RUcmFmZmljUm91dGU/LlR5cGUsXG4gICAgICAgICAgICAgIGxvZ2ljYWxJZDogcHJvZFRyYWZmaWNSb3V0ZT8ubG9naWNhbElkLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHRlc3RUcmFmZmljUm91dGU6IHtcbiAgICAgICAgICAgICAgdHlwZTogYXBwPy5FQ1NBdHRyaWJ1dGVzPy5UcmFmZmljUm91dGluZz8uVGVzdFRyYWZmaWNSb3V0ZT8uVHlwZSxcbiAgICAgICAgICAgICAgbG9naWNhbElkOiB0ZXN0VHJhZmZpY1JvdXRlPy5sb2dpY2FsSWQsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdGFyZ2V0R3JvdXBzOiB0YXJnZXRHcm91cHM/Lm1hcCgodGcpID0+IHRnPy5sb2dpY2FsSWQpLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGZpbmRSZXNvdXJjZShsb2dpY2FsSWQ6IHN0cmluZyB8IHVuZGVmaW5lZCk6IENmblJlc291cmNlIHwgdW5kZWZpbmVkIHtcbiAgICAgIGlmIChsb2dpY2FsSWQgPT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgfVxuICAgICAgY29uc3QgcmV0ID0gb3B0aW9ucy5wYXJzZXIuZmluZGVyLmZpbmRSZXNvdXJjZShsb2dpY2FsSWQpO1xuICAgICAgaWYgKCFyZXQpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBIb29rICcke2lkfScgcmVmZXJlbmNlcyByZXNvdXJjZSAnJHtsb2dpY2FsSWR9JyB0aGF0IHdhcyBub3QgZm91bmQgaW4gdGhlIHRlbXBsYXRlYCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gcmV0O1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX3NlcnZpY2VSb2xlOiBzdHJpbmc7XG4gIHByaXZhdGUgX2FwcGxpY2F0aW9uczogQ2ZuQ29kZURlcGxveUJsdWVHcmVlbkFwcGxpY2F0aW9uW107XG4gIHByaXZhdGUgX3RyYWZmaWNSb3V0aW5nQ29uZmlnPzogQ2ZuVHJhZmZpY1JvdXRpbmdDb25maWc7XG4gIHByaXZhdGUgX2FkZGl0aW9uYWxPcHRpb25zPzogQ2ZuQ29kZURlcGxveUJsdWVHcmVlbkFkZGl0aW9uYWxPcHRpb25zO1xuICBwcml2YXRlIF9saWZlY3ljbGVFdmVudEhvb2tzPzogQ2ZuQ29kZURlcGxveUJsdWVHcmVlbkxpZmVjeWNsZUV2ZW50SG9va3M7XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBuZXcgQ29kZURlcGxveSBibHVlLWdyZWVuIEVDUyBIb29rLlxuICAgKlxuICAgKiBAcGFyYW0gc2NvcGUgdGhlIHNjb3BlIHRvIGNyZWF0ZSB0aGUgaG9vayBpbiAodXN1YWxseSB0aGUgY29udGFpbmluZyBTdGFjayBvYmplY3QpXG4gICAqIEBwYXJhbSBpZCB0aGUgaWRlbnRpZmllciBvZiB0aGUgY29uc3RydWN0IC0gd2lsbCBiZSB1c2VkIHRvIGdlbmVyYXRlIHRoZSBsb2dpY2FsIElEIG9mIHRoZSBIb29rXG4gICAqIEBwYXJhbSBwcm9wcyB0aGUgcHJvcGVydGllcyBvZiB0aGUgSG9va1xuICAgKi9cbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IENmbkNvZGVEZXBsb3lCbHVlR3JlZW5Ib29rUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHtcbiAgICAgIHR5cGU6ICdBV1M6OkNvZGVEZXBsb3k6OkJsdWVHcmVlbicsXG4gICAgICAvLyB3ZSByZW5kZXIgdGhlIHByb3BlcnRpZXMgb3Vyc2VsdmVzXG4gICAgfSk7XG5cbiAgICB0aGlzLl9zZXJ2aWNlUm9sZSA9IHByb3BzLnNlcnZpY2VSb2xlO1xuICAgIHRoaXMuX2FwcGxpY2F0aW9ucyA9IHByb3BzLmFwcGxpY2F0aW9ucztcbiAgICB0aGlzLl90cmFmZmljUm91dGluZ0NvbmZpZyA9IHByb3BzLnRyYWZmaWNSb3V0aW5nQ29uZmlnO1xuICAgIHRoaXMuX2FkZGl0aW9uYWxPcHRpb25zID0gcHJvcHMuYWRkaXRpb25hbE9wdGlvbnM7XG4gICAgdGhpcy5fbGlmZWN5Y2xlRXZlbnRIb29rcyA9IHByb3BzLmxpZmVjeWNsZUV2ZW50SG9va3M7XG4gIH1cblxuICAvKipcbiAgICogVGhlIElBTSBSb2xlIGZvciBDbG91ZEZvcm1hdGlvbiB0byB1c2UgdG8gcGVyZm9ybSBibHVlLWdyZWVuIGRlcGxveW1lbnRzLlxuICAgKi9cbiAgcHVibGljIGdldCBzZXJ2aWNlUm9sZSgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLl9zZXJ2aWNlUm9sZTtcbiAgfVxuXG4gIHB1YmxpYyBzZXQgc2VydmljZVJvbGUoc2VydmljZVJvbGU6IHN0cmluZykge1xuICAgIHRoaXMuX3NlcnZpY2VSb2xlID0gc2VydmljZVJvbGU7XG4gIH1cblxuICAvKipcbiAgICogUHJvcGVydGllcyBvZiB0aGUgQW1hem9uIEVDUyBhcHBsaWNhdGlvbnMgYmVpbmcgZGVwbG95ZWQuXG4gICAqL1xuICBwdWJsaWMgZ2V0IGFwcGxpY2F0aW9ucygpOiBDZm5Db2RlRGVwbG95Qmx1ZUdyZWVuQXBwbGljYXRpb25bXSB7XG4gICAgcmV0dXJuIHRoaXMuX2FwcGxpY2F0aW9ucztcbiAgfVxuXG4gIHB1YmxpYyBzZXQgYXBwbGljYXRpb25zKHZhbHVlOiBDZm5Db2RlRGVwbG95Qmx1ZUdyZWVuQXBwbGljYXRpb25bXSkge1xuICAgIHRoaXMuX2FwcGxpY2F0aW9ucyA9IHZhbHVlO1xuICB9XG5cbiAgLyoqXG4gICAqIFRyYWZmaWMgcm91dGluZyBjb25maWd1cmF0aW9uIHNldHRpbmdzLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIHRpbWUtYmFzZWQgY2FuYXJ5IHRyYWZmaWMgc2hpZnRpbmcsIHdpdGggYSAxNSUgc3RlcCBwZXJjZW50YWdlIGFuZCBhIGZpdmUgbWludXRlIGJha2UgdGltZVxuICAgKi9cbiAgcHVibGljIGdldCB0cmFmZmljUm91dGluZ0NvbmZpZygpOiBDZm5UcmFmZmljUm91dGluZ0NvbmZpZyB8IHVuZGVmaW5lZCB7XG4gICAgcmV0dXJuIHRoaXMuX3RyYWZmaWNSb3V0aW5nQ29uZmlnO1xuICB9XG5cbiAgcHVibGljIHNldCB0cmFmZmljUm91dGluZ0NvbmZpZyh2YWx1ZTogQ2ZuVHJhZmZpY1JvdXRpbmdDb25maWcgfCB1bmRlZmluZWQpIHtcbiAgICB0aGlzLl90cmFmZmljUm91dGluZ0NvbmZpZyA9IHZhbHVlO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZGl0aW9uYWwgb3B0aW9ucyBmb3IgdGhlIGJsdWUvZ3JlZW4gZGVwbG95bWVudC5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBubyBhZGRpdGlvbmFsIG9wdGlvbnNcbiAgICovXG4gIHB1YmxpYyBnZXQgYWRkaXRpb25hbE9wdGlvbnMoKTogQ2ZuQ29kZURlcGxveUJsdWVHcmVlbkFkZGl0aW9uYWxPcHRpb25zIHwgdW5kZWZpbmVkIHtcbiAgICByZXR1cm4gdGhpcy5fYWRkaXRpb25hbE9wdGlvbnM7XG4gIH1cblxuICBwdWJsaWMgc2V0IGFkZGl0aW9uYWxPcHRpb25zKHZhbHVlOiBDZm5Db2RlRGVwbG95Qmx1ZUdyZWVuQWRkaXRpb25hbE9wdGlvbnMgfCB1bmRlZmluZWQpIHtcbiAgICB0aGlzLl9hZGRpdGlvbmFsT3B0aW9ucyA9IHZhbHVlO1xuICB9XG5cbiAgLyoqXG4gICAqIFVzZSBsaWZlY3ljbGUgZXZlbnQgaG9va3MgdG8gc3BlY2lmeSBhIExhbWJkYSBmdW5jdGlvbiB0aGF0IENvZGVEZXBsb3kgY2FuIGNhbGwgdG8gdmFsaWRhdGUgYSBkZXBsb3ltZW50LlxuICAgKiBZb3UgY2FuIHVzZSB0aGUgc2FtZSBmdW5jdGlvbiBvciBhIGRpZmZlcmVudCBvbmUgZm9yIGRlcGxveW1lbnQgbGlmZWN5Y2xlIGV2ZW50cy5cbiAgICogRm9sbG93aW5nIGNvbXBsZXRpb24gb2YgdGhlIHZhbGlkYXRpb24gdGVzdHMsXG4gICAqIHRoZSBMYW1iZGEgYENmbkNvZGVEZXBsb3lCbHVlR3JlZW5MaWZlY3ljbGVFdmVudEhvb2tzLmFmdGVyQWxsb3dUcmFmZmljYFxuICAgKiBmdW5jdGlvbiBjYWxscyBiYWNrIENvZGVEZXBsb3kgYW5kIGRlbGl2ZXJzIGEgcmVzdWx0IG9mICdTdWNjZWVkZWQnIG9yICdGYWlsZWQnLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIG5vIGxpZmVjeWNsZSBldmVudCBob29rc1xuICAgKi9cbiAgcHVibGljIGdldCBsaWZlY3ljbGVFdmVudEhvb2tzKCk6IENmbkNvZGVEZXBsb3lCbHVlR3JlZW5MaWZlY3ljbGVFdmVudEhvb2tzIHwgdW5kZWZpbmVkIHtcbiAgICByZXR1cm4gdGhpcy5fbGlmZWN5Y2xlRXZlbnRIb29rcztcbiAgfVxuXG4gIHB1YmxpYyBzZXQgbGlmZWN5Y2xlRXZlbnRIb29rcyh2YWx1ZTogQ2ZuQ29kZURlcGxveUJsdWVHcmVlbkxpZmVjeWNsZUV2ZW50SG9va3MgfCB1bmRlZmluZWQpIHtcbiAgICB0aGlzLl9saWZlY3ljbGVFdmVudEhvb2tzID0gdmFsdWU7XG4gIH1cblxuICBwcm90ZWN0ZWQgcmVuZGVyUHJvcGVydGllcyhfcHJvcHM/OiB7IFtwOiBzdHJpbmddOiBhbnkgfSk6IHsgW3A6IHN0cmluZ106IGFueSB9IHwgdW5kZWZpbmVkIHtcbiAgICByZXR1cm4ge1xuICAgICAgU2VydmljZVJvbGU6IHRoaXMuc2VydmljZVJvbGUsXG4gICAgICBBcHBsaWNhdGlvbnM6IHRoaXMuYXBwbGljYXRpb25zLm1hcCgoYXBwKSA9PiAoe1xuICAgICAgICBUYXJnZXQ6IHtcbiAgICAgICAgICBUeXBlOiBhcHAudGFyZ2V0LnR5cGUsXG4gICAgICAgICAgTG9naWNhbElEOiBhcHAudGFyZ2V0LmxvZ2ljYWxJZCxcbiAgICAgICAgfSxcbiAgICAgICAgRUNTQXR0cmlidXRlczoge1xuICAgICAgICAgIFRhc2tEZWZpbml0aW9uczogYXBwLmVjc0F0dHJpYnV0ZXMudGFza0RlZmluaXRpb25zLFxuICAgICAgICAgIFRhc2tTZXRzOiBhcHAuZWNzQXR0cmlidXRlcy50YXNrU2V0cyxcbiAgICAgICAgICBUcmFmZmljUm91dGluZzoge1xuICAgICAgICAgICAgUHJvZFRyYWZmaWNSb3V0ZToge1xuICAgICAgICAgICAgICBUeXBlOiBhcHAuZWNzQXR0cmlidXRlcy50cmFmZmljUm91dGluZy5wcm9kVHJhZmZpY1JvdXRlLnR5cGUsXG4gICAgICAgICAgICAgIExvZ2ljYWxJRDogYXBwLmVjc0F0dHJpYnV0ZXMudHJhZmZpY1JvdXRpbmcucHJvZFRyYWZmaWNSb3V0ZS5sb2dpY2FsSWQsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgVGVzdFRyYWZmaWNSb3V0ZToge1xuICAgICAgICAgICAgICBUeXBlOiBhcHAuZWNzQXR0cmlidXRlcy50cmFmZmljUm91dGluZy50ZXN0VHJhZmZpY1JvdXRlLnR5cGUsXG4gICAgICAgICAgICAgIExvZ2ljYWxJRDogYXBwLmVjc0F0dHJpYnV0ZXMudHJhZmZpY1JvdXRpbmcudGVzdFRyYWZmaWNSb3V0ZS5sb2dpY2FsSWQsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgVGFyZ2V0R3JvdXBzOiBhcHAuZWNzQXR0cmlidXRlcy50cmFmZmljUm91dGluZy50YXJnZXRHcm91cHMsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0pKSxcbiAgICAgIFRyYWZmaWNSb3V0aW5nQ29uZmlnOiB1bmRlZmluZWRJZkFsbFZhbHVlc0FyZUVtcHR5KHtcbiAgICAgICAgVHlwZTogdGhpcy50cmFmZmljUm91dGluZ0NvbmZpZz8udHlwZSxcbiAgICAgICAgVGltZUJhc2VkQ2FuYXJ5OiB1bmRlZmluZWRJZkFsbFZhbHVlc0FyZUVtcHR5KHtcbiAgICAgICAgICBTdGVwUGVyY2VudGFnZTogdGhpcy50cmFmZmljUm91dGluZ0NvbmZpZz8udGltZUJhc2VkQ2FuYXJ5Py5zdGVwUGVyY2VudGFnZSxcbiAgICAgICAgICBCYWtlVGltZU1pbnM6IHRoaXMudHJhZmZpY1JvdXRpbmdDb25maWc/LnRpbWVCYXNlZENhbmFyeT8uYmFrZVRpbWVNaW5zLFxuICAgICAgICB9KSxcbiAgICAgICAgVGltZUJhc2VkTGluZWFyOiB1bmRlZmluZWRJZkFsbFZhbHVlc0FyZUVtcHR5KHtcbiAgICAgICAgICBTdGVwUGVyY2VudGFnZTogdGhpcy50cmFmZmljUm91dGluZ0NvbmZpZz8udGltZUJhc2VkTGluZWFyPy5zdGVwUGVyY2VudGFnZSxcbiAgICAgICAgICBCYWtlVGltZU1pbnM6IHRoaXMudHJhZmZpY1JvdXRpbmdDb25maWc/LnRpbWVCYXNlZExpbmVhcj8uYmFrZVRpbWVNaW5zLFxuICAgICAgICB9KSxcbiAgICAgIH0pLFxuICAgICAgQWRkaXRpb25hbE9wdGlvbnM6IHVuZGVmaW5lZElmQWxsVmFsdWVzQXJlRW1wdHkoe1xuICAgICAgICBUZXJtaW5hdGlvbldhaXRUaW1lSW5NaW51dGVzOiB0aGlzLmFkZGl0aW9uYWxPcHRpb25zPy50ZXJtaW5hdGlvbldhaXRUaW1lSW5NaW51dGVzLFxuICAgICAgfSksXG4gICAgICBMaWZlY3ljbGVFdmVudEhvb2tzOiB1bmRlZmluZWRJZkFsbFZhbHVlc0FyZUVtcHR5KHtcbiAgICAgICAgQmVmb3JlSW5zdGFsbDogdGhpcy5saWZlY3ljbGVFdmVudEhvb2tzPy5iZWZvcmVJbnN0YWxsLFxuICAgICAgICBBZnRlckluc3RhbGw6IHRoaXMubGlmZWN5Y2xlRXZlbnRIb29rcz8uYWZ0ZXJJbnN0YWxsLFxuICAgICAgICBBZnRlckFsbG93VGVzdFRyYWZmaWM6IHRoaXMubGlmZWN5Y2xlRXZlbnRIb29rcz8uYWZ0ZXJBbGxvd1Rlc3RUcmFmZmljLFxuICAgICAgICBCZWZvcmVBbGxvd1RyYWZmaWM6IHRoaXMubGlmZWN5Y2xlRXZlbnRIb29rcz8uYmVmb3JlQWxsb3dUcmFmZmljLFxuICAgICAgICBBZnRlckFsbG93VHJhZmZpYzogdGhpcy5saWZlY3ljbGVFdmVudEhvb2tzPy5hZnRlckFsbG93VHJhZmZpYyxcbiAgICAgIH0pLFxuICAgIH07XG4gIH1cbn1cbiJdfQ==