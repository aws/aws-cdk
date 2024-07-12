"use strict";
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RolloutStrategy = exports.DeploymentStrategyId = exports.GrowthType = exports.DeploymentStrategy = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const aws_cdk_lib_1 = require("aws-cdk-lib");
const aws_appconfig_1 = require("aws-cdk-lib/aws-appconfig");
/**
 * An AWS AppConfig deployment strategy.
 *
 * @resource AWS::AppConfig::DeploymentStrategy
 * @see https://docs.aws.amazon.com/appconfig/latest/userguide/appconfig-creating-deployment-strategy.html
 */
class DeploymentStrategy extends aws_cdk_lib_1.Resource {
    /**
     * Imports a deployment strategy into the CDK using its Amazon Resource Name (ARN).
     *
     * @param scope The parent construct
     * @param id The name of the deployment strategy construct
     * @param deploymentStrategyArn The Amazon Resource Name (ARN) of the deployment strategy
     */
    static fromDeploymentStrategyArn(scope, id, deploymentStrategyArn) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-appconfig-alpha.DeploymentStrategy#fromDeploymentStrategyArn", "");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.fromDeploymentStrategyArn);
            }
            throw error;
        }
        const parsedArn = aws_cdk_lib_1.Stack.of(scope).splitArn(deploymentStrategyArn, aws_cdk_lib_1.ArnFormat.SLASH_RESOURCE_NAME);
        const deploymentStrategyId = parsedArn.resourceName;
        if (!deploymentStrategyId) {
            throw new Error('Missing required deployment strategy id from deployment strategy ARN');
        }
        class Import extends aws_cdk_lib_1.Resource {
            constructor() {
                super(...arguments);
                this.deploymentStrategyId = deploymentStrategyId;
                this.deploymentStrategyArn = deploymentStrategyArn;
            }
        }
        return new Import(scope, id, {
            environmentFromArn: deploymentStrategyArn,
        });
    }
    /**
     * Imports a deployment strategy into the CDK using its ID.
     *
     * @param scope The parent construct
     * @param id The name of the deployment strategy construct
     * @param deploymentStrategyId The ID of the deployment strategy
     */
    static fromDeploymentStrategyId(scope, id, deploymentStrategyId) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-appconfig-alpha.DeploymentStrategy#fromDeploymentStrategyId", "");
            jsiiDeprecationWarnings._aws_cdk_aws_appconfig_alpha_DeploymentStrategyId(deploymentStrategyId);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.fromDeploymentStrategyId);
            }
            throw error;
        }
        const stack = aws_cdk_lib_1.Stack.of(scope);
        const deploymentStrategyArn = stack.formatArn({
            service: 'appconfig',
            resource: 'deploymentstrategy',
            resourceName: deploymentStrategyId.id,
        });
        class Import extends aws_cdk_lib_1.Resource {
            constructor() {
                super(...arguments);
                this.deploymentStrategyId = deploymentStrategyId.id;
                this.deploymentStrategyArn = deploymentStrategyArn;
            }
        }
        return new Import(scope, id, {
            environmentFromArn: deploymentStrategyArn,
        });
    }
    constructor(scope, id, props) {
        super(scope, id, {
            physicalName: props.deploymentStrategyName,
        });
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-appconfig-alpha.DeploymentStrategy", "");
            jsiiDeprecationWarnings._aws_cdk_aws_appconfig_alpha_DeploymentStrategyProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, DeploymentStrategy);
            }
            throw error;
        }
        this.deploymentDurationInMinutes = props.rolloutStrategy.deploymentDuration.toMinutes();
        this.growthFactor = props.rolloutStrategy.growthFactor;
        this.description = props.description;
        this.finalBakeTimeInMinutes = props.rolloutStrategy.finalBakeTime?.toMinutes();
        this.growthType = props.rolloutStrategy.growthType;
        this.name = props.deploymentStrategyName || aws_cdk_lib_1.Names.uniqueResourceName(this, {
            maxLength: 64,
            separator: '-',
        });
        const resource = new aws_appconfig_1.CfnDeploymentStrategy(this, 'Resource', {
            name: this.name,
            deploymentDurationInMinutes: this.deploymentDurationInMinutes,
            growthFactor: this.growthFactor,
            replicateTo: 'NONE',
            description: this.description,
            finalBakeTimeInMinutes: this.finalBakeTimeInMinutes,
            growthType: this.growthType,
        });
        this._cfnDeploymentStrategy = resource;
        this.deploymentStrategyId = this._cfnDeploymentStrategy.ref;
        this.deploymentStrategyArn = this.stack.formatArn({
            service: 'appconfig',
            resource: 'deploymentstrategy',
            resourceName: this.deploymentStrategyId,
        });
    }
}
exports.DeploymentStrategy = DeploymentStrategy;
_a = JSII_RTTI_SYMBOL_1;
DeploymentStrategy[_a] = { fqn: "@aws-cdk/aws-appconfig-alpha.DeploymentStrategy", version: "0.0.0" };
/**
 * Defines the growth type of the deployment strategy.
 */
var GrowthType;
(function (GrowthType) {
    /**
     * AWS AppConfig will process the deployment by increments of the growth factor
     * evenly distributed over the deployment.
     */
    GrowthType["LINEAR"] = "LINEAR";
    /**
     * AWS AppConfig will process the deployment exponentially using the following formula:
     * `G*(2^N)`. In this formula, `G` is the step percentage specified by the user and `N`
     * is the number of steps until the configuration is deployed to all targets.
     */
    GrowthType["EXPONENTIAL"] = "EXPONENTIAL";
})(GrowthType || (exports.GrowthType = GrowthType = {}));
/**
 * Defines the deployment strategy ID's of AWS AppConfig deployment strategies.
 *
 * @see https://docs.aws.amazon.com/appconfig/latest/userguide/appconfig-creating-deployment-strategy.html
 */
class DeploymentStrategyId {
    /**
     * Builds a deployment strategy ID from a string.
     *
     * @param deploymentStrategyId The deployment strategy ID.
     */
    static fromString(deploymentStrategyId) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-appconfig-alpha.DeploymentStrategyId#fromString", "");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.fromString);
            }
            throw error;
        }
        return {
            id: deploymentStrategyId,
        };
    }
}
exports.DeploymentStrategyId = DeploymentStrategyId;
_b = JSII_RTTI_SYMBOL_1;
DeploymentStrategyId[_b] = { fqn: "@aws-cdk/aws-appconfig-alpha.DeploymentStrategyId", version: "0.0.0" };
/**
 * **AWS Recommended**. This strategy processes the deployment exponentially using a 10% growth factor over 20 minutes.
 * AWS AppConfig recommends using this strategy for production deployments because it aligns with AWS best practices
 * for configuration deployments.
 */
DeploymentStrategyId.CANARY_10_PERCENT_20_MINUTES = DeploymentStrategyId.fromString('AppConfig.Canary10Percent20Minutes');
/**
 * **Testing/Demonstration**. This strategy deploys the configuration to half of all targets every 30 seconds for a
 * one-minute deployment. AWS AppConfig recommends using this strategy only for testing or demonstration purposes because
 * it has a short duration and bake time.
 */
DeploymentStrategyId.LINEAR_50_PERCENT_EVERY_30_SECONDS = DeploymentStrategyId.fromString('AppConfig.Linear50PercentEvery30Seconds');
/**
 * **AWS Recommended**. This strategy deploys the configuration to 20% of all targets every six minutes for a 30 minute deployment.
 * AWS AppConfig recommends using this strategy for production deployments because it aligns with AWS best practices
 * for configuration deployments.
 */
DeploymentStrategyId.LINEAR_20_PERCENT_EVERY_6_MINUTES = DeploymentStrategyId.fromString('AppConfig.Linear20PercentEvery6Minutes');
/**
 * **Quick**. This strategy deploys the configuration to all targets immediately.
 */
DeploymentStrategyId.ALL_AT_ONCE = DeploymentStrategyId.fromString('AppConfig.AllAtOnce');
/**
 * Defines the rollout strategy for a deployment strategy and includes the growth factor,
 * deployment duration, growth type, and optionally final bake time.
 *
 * @see https://docs.aws.amazon.com/appconfig/latest/userguide/appconfig-creating-deployment-strategy.html
 */
class RolloutStrategy {
    /**
     * Build your own linear rollout strategy.
     */
    static linear(props) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-appconfig-alpha.RolloutStrategy#linear", "");
            jsiiDeprecationWarnings._aws_cdk_aws_appconfig_alpha_RolloutStrategyProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.linear);
            }
            throw error;
        }
        return {
            growthFactor: props.growthFactor,
            deploymentDuration: props.deploymentDuration,
            growthType: GrowthType.LINEAR,
            finalBakeTime: props.finalBakeTime,
        };
    }
    /**
     * Build your own exponential rollout strategy.
     */
    static exponential(props) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-appconfig-alpha.RolloutStrategy#exponential", "");
            jsiiDeprecationWarnings._aws_cdk_aws_appconfig_alpha_RolloutStrategyProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.exponential);
            }
            throw error;
        }
        return {
            growthFactor: props.growthFactor,
            deploymentDuration: props.deploymentDuration,
            growthType: GrowthType.EXPONENTIAL,
            finalBakeTime: props.finalBakeTime,
        };
    }
}
exports.RolloutStrategy = RolloutStrategy;
_c = JSII_RTTI_SYMBOL_1;
RolloutStrategy[_c] = { fqn: "@aws-cdk/aws-appconfig-alpha.RolloutStrategy", version: "0.0.0" };
/**
 * **AWS Recommended**. This strategy processes the deployment exponentially using a 10% growth factor over 20 minutes.
 * AWS AppConfig recommends using this strategy for production deployments because it aligns with AWS best practices
 * for configuration deployments.
 */
RolloutStrategy.CANARY_10_PERCENT_20_MINUTES = RolloutStrategy.exponential({
    growthFactor: 10,
    deploymentDuration: aws_cdk_lib_1.Duration.minutes(20),
    finalBakeTime: aws_cdk_lib_1.Duration.minutes(10),
});
/**
 * **Testing/Demonstration**. This strategy deploys the configuration to half of all targets every 30 seconds for a
 * one-minute deployment. AWS AppConfig recommends using this strategy only for testing or demonstration purposes because
 * it has a short duration and bake time.
 */
RolloutStrategy.LINEAR_50_PERCENT_EVERY_30_SECONDS = RolloutStrategy.linear({
    growthFactor: 50,
    deploymentDuration: aws_cdk_lib_1.Duration.minutes(1),
    finalBakeTime: aws_cdk_lib_1.Duration.minutes(1),
});
/**
 * **AWS Recommended**. This strategy deploys the configuration to 20% of all targets every six minutes for a 30 minute deployment.
 * AWS AppConfig recommends using this strategy for production deployments because it aligns with AWS best practices
 * for configuration deployments.
 */
RolloutStrategy.LINEAR_20_PERCENT_EVERY_6_MINUTES = RolloutStrategy.linear({
    growthFactor: 20,
    deploymentDuration: aws_cdk_lib_1.Duration.minutes(30),
    finalBakeTime: aws_cdk_lib_1.Duration.minutes(30),
});
/**
 * **Quick**. This strategy deploys the configuration to all targets immediately.
 */
RolloutStrategy.ALL_AT_ONCE = RolloutStrategy.linear({
    growthFactor: 100,
    deploymentDuration: aws_cdk_lib_1.Duration.minutes(0),
    finalBakeTime: aws_cdk_lib_1.Duration.minutes(10),
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVwbG95bWVudC1zdHJhdGVneS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRlcGxveW1lbnQtc3RyYXRlZ3kudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsNkNBQXFGO0FBQ3JGLDZEQUFrRTtBQTZCbEU7Ozs7O0dBS0c7QUFDSCxNQUFhLGtCQUFtQixTQUFRLHNCQUFRO0lBQzlDOzs7Ozs7T0FNRztJQUNJLE1BQU0sQ0FBQyx5QkFBeUIsQ0FBQyxLQUFnQixFQUFFLEVBQVUsRUFBRSxxQkFBNkI7Ozs7Ozs7Ozs7UUFDakcsTUFBTSxTQUFTLEdBQUcsbUJBQUssQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsUUFBUSxDQUFDLHFCQUFxQixFQUFFLHVCQUFTLENBQUMsbUJBQW1CLENBQUMsQ0FBQztRQUNqRyxNQUFNLG9CQUFvQixHQUFHLFNBQVMsQ0FBQyxZQUFZLENBQUM7UUFDcEQsSUFBSSxDQUFDLG9CQUFvQixFQUFFLENBQUM7WUFDMUIsTUFBTSxJQUFJLEtBQUssQ0FBQyxzRUFBc0UsQ0FBQyxDQUFDO1FBQzFGLENBQUM7UUFFRCxNQUFNLE1BQU8sU0FBUSxzQkFBUTtZQUE3Qjs7Z0JBQ2tCLHlCQUFvQixHQUFHLG9CQUFxQixDQUFDO2dCQUM3QywwQkFBcUIsR0FBRyxxQkFBcUIsQ0FBQztZQUNoRSxDQUFDO1NBQUE7UUFFRCxPQUFPLElBQUksTUFBTSxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUU7WUFDM0Isa0JBQWtCLEVBQUUscUJBQXFCO1NBQzFDLENBQUMsQ0FBQztLQUNKO0lBRUQ7Ozs7OztPQU1HO0lBQ0ksTUFBTSxDQUFDLHdCQUF3QixDQUFDLEtBQWdCLEVBQUUsRUFBVSxFQUFFLG9CQUEwQzs7Ozs7Ozs7Ozs7UUFDN0csTUFBTSxLQUFLLEdBQUcsbUJBQUssQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDOUIsTUFBTSxxQkFBcUIsR0FBRyxLQUFLLENBQUMsU0FBUyxDQUFDO1lBQzVDLE9BQU8sRUFBRSxXQUFXO1lBQ3BCLFFBQVEsRUFBRSxvQkFBb0I7WUFDOUIsWUFBWSxFQUFFLG9CQUFvQixDQUFDLEVBQUU7U0FDdEMsQ0FBQyxDQUFDO1FBRUgsTUFBTSxNQUFPLFNBQVEsc0JBQVE7WUFBN0I7O2dCQUNrQix5QkFBb0IsR0FBRyxvQkFBb0IsQ0FBQyxFQUFFLENBQUM7Z0JBQy9DLDBCQUFxQixHQUFHLHFCQUFxQixDQUFDO1lBQ2hFLENBQUM7U0FBQTtRQUVELE9BQU8sSUFBSSxNQUFNLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRTtZQUMzQixrQkFBa0IsRUFBRSxxQkFBcUI7U0FDMUMsQ0FBQyxDQUFDO0tBQ0o7SUE4Q0QsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUE4QjtRQUN0RSxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRTtZQUNmLFlBQVksRUFBRSxLQUFLLENBQUMsc0JBQXNCO1NBQzNDLENBQUMsQ0FBQzs7Ozs7OzsrQ0FqR00sa0JBQWtCOzs7O1FBbUczQixJQUFJLENBQUMsMkJBQTJCLEdBQUcsS0FBSyxDQUFDLGVBQWUsQ0FBQyxrQkFBa0IsQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUN4RixJQUFJLENBQUMsWUFBWSxHQUFHLEtBQUssQ0FBQyxlQUFlLENBQUMsWUFBWSxDQUFDO1FBQ3ZELElBQUksQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDLFdBQVcsQ0FBQztRQUNyQyxJQUFJLENBQUMsc0JBQXNCLEdBQUcsS0FBSyxDQUFDLGVBQWUsQ0FBQyxhQUFhLEVBQUUsU0FBUyxFQUFFLENBQUM7UUFDL0UsSUFBSSxDQUFDLFVBQVUsR0FBRyxLQUFLLENBQUMsZUFBZSxDQUFDLFVBQVUsQ0FBQztRQUNuRCxJQUFJLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQyxzQkFBc0IsSUFBSSxtQkFBSyxDQUFDLGtCQUFrQixDQUFDLElBQUksRUFBRTtZQUN6RSxTQUFTLEVBQUUsRUFBRTtZQUNiLFNBQVMsRUFBRSxHQUFHO1NBQ2YsQ0FBQyxDQUFDO1FBRUgsTUFBTSxRQUFRLEdBQUcsSUFBSSxxQ0FBcUIsQ0FBQyxJQUFJLEVBQUUsVUFBVSxFQUFFO1lBQzNELElBQUksRUFBRSxJQUFJLENBQUMsSUFBSTtZQUNmLDJCQUEyQixFQUFFLElBQUksQ0FBQywyQkFBMkI7WUFDN0QsWUFBWSxFQUFFLElBQUksQ0FBQyxZQUFZO1lBQy9CLFdBQVcsRUFBRSxNQUFNO1lBQ25CLFdBQVcsRUFBRSxJQUFJLENBQUMsV0FBVztZQUM3QixzQkFBc0IsRUFBRSxJQUFJLENBQUMsc0JBQXNCO1lBQ25ELFVBQVUsRUFBRSxJQUFJLENBQUMsVUFBVTtTQUM1QixDQUFDLENBQUM7UUFDSCxJQUFJLENBQUMsc0JBQXNCLEdBQUcsUUFBUSxDQUFDO1FBRXZDLElBQUksQ0FBQyxvQkFBb0IsR0FBRyxJQUFJLENBQUMsc0JBQXNCLENBQUMsR0FBRyxDQUFDO1FBQzVELElBQUksQ0FBQyxxQkFBcUIsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQztZQUNoRCxPQUFPLEVBQUUsV0FBVztZQUNwQixRQUFRLEVBQUUsb0JBQW9CO1lBQzlCLFlBQVksRUFBRSxJQUFJLENBQUMsb0JBQW9CO1NBQ3hDLENBQUMsQ0FBQztLQUNKOztBQTlISCxnREErSEM7OztBQUVEOztHQUVHO0FBQ0gsSUFBWSxVQWFYO0FBYkQsV0FBWSxVQUFVO0lBQ3BCOzs7T0FHRztJQUNILCtCQUFpQixDQUFBO0lBRWpCOzs7O09BSUc7SUFDSCx5Q0FBMkIsQ0FBQTtBQUM3QixDQUFDLEVBYlcsVUFBVSwwQkFBVixVQUFVLFFBYXJCO0FBRUQ7Ozs7R0FJRztBQUNILE1BQXNCLG9CQUFvQjtJQTJCeEM7Ozs7T0FJRztJQUNJLE1BQU0sQ0FBQyxVQUFVLENBQUMsb0JBQTRCOzs7Ozs7Ozs7O1FBQ25ELE9BQU87WUFDTCxFQUFFLEVBQUUsb0JBQW9CO1NBQ3pCLENBQUM7S0FDSDs7QUFwQ0gsb0RBMENDOzs7QUF6Q0M7Ozs7R0FJRztBQUNvQixpREFBNEIsR0FBRyxvQkFBb0IsQ0FBQyxVQUFVLENBQUMsb0NBQW9DLENBQUMsQ0FBQztBQUU1SDs7OztHQUlHO0FBQ29CLHVEQUFrQyxHQUFHLG9CQUFvQixDQUFDLFVBQVUsQ0FBQyx5Q0FBeUMsQ0FBQyxDQUFDO0FBRXZJOzs7O0dBSUc7QUFDb0Isc0RBQWlDLEdBQUcsb0JBQW9CLENBQUMsVUFBVSxDQUFDLHdDQUF3QyxDQUFDLENBQUM7QUFFckk7O0dBRUc7QUFDb0IsZ0NBQVcsR0FBRyxvQkFBb0IsQ0FBQyxVQUFVLENBQUMscUJBQXFCLENBQUMsQ0FBQztBQWtEOUY7Ozs7O0dBS0c7QUFDSCxNQUFzQixlQUFlO0lBMkNuQzs7T0FFRztJQUNJLE1BQU0sQ0FBQyxNQUFNLENBQUMsS0FBMkI7Ozs7Ozs7Ozs7O1FBQzlDLE9BQU87WUFDTCxZQUFZLEVBQUUsS0FBSyxDQUFDLFlBQVk7WUFDaEMsa0JBQWtCLEVBQUUsS0FBSyxDQUFDLGtCQUFrQjtZQUM1QyxVQUFVLEVBQUUsVUFBVSxDQUFDLE1BQU07WUFDN0IsYUFBYSxFQUFFLEtBQUssQ0FBQyxhQUFhO1NBQ25DLENBQUM7S0FDSDtJQUVEOztPQUVHO0lBQ0ksTUFBTSxDQUFDLFdBQVcsQ0FBQyxLQUEyQjs7Ozs7Ozs7Ozs7UUFDbkQsT0FBTztZQUNMLFlBQVksRUFBRSxLQUFLLENBQUMsWUFBWTtZQUNoQyxrQkFBa0IsRUFBRSxLQUFLLENBQUMsa0JBQWtCO1lBQzVDLFVBQVUsRUFBRSxVQUFVLENBQUMsV0FBVztZQUNsQyxhQUFhLEVBQUUsS0FBSyxDQUFDLGFBQWE7U0FDbkMsQ0FBQztLQUNIOztBQWpFSCwwQ0FzRkM7OztBQXJGQzs7OztHQUlHO0FBQ29CLDRDQUE0QixHQUFHLGVBQWUsQ0FBQyxXQUFXLENBQUM7SUFDaEYsWUFBWSxFQUFFLEVBQUU7SUFDaEIsa0JBQWtCLEVBQUUsc0JBQVEsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDO0lBQ3hDLGFBQWEsRUFBRSxzQkFBUSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUM7Q0FDcEMsQ0FBQyxDQUFDO0FBRUg7Ozs7R0FJRztBQUNvQixrREFBa0MsR0FBRyxlQUFlLENBQUMsTUFBTSxDQUFDO0lBQ2pGLFlBQVksRUFBRSxFQUFFO0lBQ2hCLGtCQUFrQixFQUFFLHNCQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztJQUN2QyxhQUFhLEVBQUUsc0JBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO0NBQ25DLENBQUMsQ0FBQztBQUVIOzs7O0dBSUc7QUFDb0IsaURBQWlDLEdBQUcsZUFBZSxDQUFDLE1BQU0sQ0FBQztJQUNoRixZQUFZLEVBQUUsRUFBRTtJQUNoQixrQkFBa0IsRUFBRSxzQkFBUSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUM7SUFDeEMsYUFBYSxFQUFFLHNCQUFRLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQztDQUNwQyxDQUFDLENBQUM7QUFFSDs7R0FFRztBQUNvQiwyQkFBVyxHQUFHLGVBQWUsQ0FBQyxNQUFNLENBQUM7SUFDMUQsWUFBWSxFQUFFLEdBQUc7SUFDakIsa0JBQWtCLEVBQUUsc0JBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO0lBQ3ZDLGFBQWEsRUFBRSxzQkFBUSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUM7Q0FDcEMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUmVzb3VyY2UsIElSZXNvdXJjZSwgU3RhY2ssIEFybkZvcm1hdCwgTmFtZXMsIER1cmF0aW9uIH0gZnJvbSAnYXdzLWNkay1saWInO1xuaW1wb3J0IHsgQ2ZuRGVwbG95bWVudFN0cmF0ZWd5IH0gZnJvbSAnYXdzLWNkay1saWIvYXdzLWFwcGNvbmZpZyc7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcblxuLyoqXG4gKiBQcm9wZXJ0aWVzIGZvciBEZXBsb3ltZW50U3RyYXRlZ3kuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgRGVwbG95bWVudFN0cmF0ZWd5UHJvcHMge1xuICAvKipcbiAgICogVGhlIHJvbGxvdXQgc3RyYXRlZ3kgZm9yIHRoZSBkZXBsb3ltZW50IHN0cmF0ZWd5LiBZb3UgY2FuIHVzZSBwcmVkZWZpbmVkIGRlcGxveW1lbnRcbiAgICogc3RyYXRlZ2llcywgc3VjaCBhcyBSb2xsb3V0U3RyYXRlZ3kuQUxMX0FUX09OQ0UsIFJvbGxvdXRTdHJhdGVneS5MSU5FQVJfNTBfUEVSQ0VOVF9FVkVSWV8zMF9TRUNPTkRTLFxuICAgKiBvciBSb2xsb3V0U3RyYXRlZ3kuQ0FOQVJZXzEwX1BFUkNFTlRfMjBfTUlOVVRFUy5cbiAgICovXG4gIHJlYWRvbmx5IHJvbGxvdXRTdHJhdGVneTogUm9sbG91dFN0cmF0ZWd5O1xuXG4gIC8qKlxuICAgKiBBIG5hbWUgZm9yIHRoZSBkZXBsb3ltZW50IHN0cmF0ZWd5LlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIEEgbmFtZSBpcyBnZW5lcmF0ZWQuXG4gICAqL1xuICByZWFkb25seSBkZXBsb3ltZW50U3RyYXRlZ3lOYW1lPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBBIGRlc2NyaXB0aW9uIG9mIHRoZSBkZXBsb3ltZW50IHN0cmF0ZWd5LlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIE5vIGRlc2NyaXB0aW9uLlxuICAgKi9cbiAgcmVhZG9ubHkgZGVzY3JpcHRpb24/OiBzdHJpbmc7XG59XG5cbi8qKlxuICogQW4gQVdTIEFwcENvbmZpZyBkZXBsb3ltZW50IHN0cmF0ZWd5LlxuICpcbiAqIEByZXNvdXJjZSBBV1M6OkFwcENvbmZpZzo6RGVwbG95bWVudFN0cmF0ZWd5XG4gKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9hcHBjb25maWcvbGF0ZXN0L3VzZXJndWlkZS9hcHBjb25maWctY3JlYXRpbmctZGVwbG95bWVudC1zdHJhdGVneS5odG1sXG4gKi9cbmV4cG9ydCBjbGFzcyBEZXBsb3ltZW50U3RyYXRlZ3kgZXh0ZW5kcyBSZXNvdXJjZSBpbXBsZW1lbnRzIElEZXBsb3ltZW50U3RyYXRlZ3kge1xuICAvKipcbiAgICogSW1wb3J0cyBhIGRlcGxveW1lbnQgc3RyYXRlZ3kgaW50byB0aGUgQ0RLIHVzaW5nIGl0cyBBbWF6b24gUmVzb3VyY2UgTmFtZSAoQVJOKS5cbiAgICpcbiAgICogQHBhcmFtIHNjb3BlIFRoZSBwYXJlbnQgY29uc3RydWN0XG4gICAqIEBwYXJhbSBpZCBUaGUgbmFtZSBvZiB0aGUgZGVwbG95bWVudCBzdHJhdGVneSBjb25zdHJ1Y3RcbiAgICogQHBhcmFtIGRlcGxveW1lbnRTdHJhdGVneUFybiBUaGUgQW1hem9uIFJlc291cmNlIE5hbWUgKEFSTikgb2YgdGhlIGRlcGxveW1lbnQgc3RyYXRlZ3lcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZnJvbURlcGxveW1lbnRTdHJhdGVneUFybihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBkZXBsb3ltZW50U3RyYXRlZ3lBcm46IHN0cmluZyk6IElEZXBsb3ltZW50U3RyYXRlZ3kge1xuICAgIGNvbnN0IHBhcnNlZEFybiA9IFN0YWNrLm9mKHNjb3BlKS5zcGxpdEFybihkZXBsb3ltZW50U3RyYXRlZ3lBcm4sIEFybkZvcm1hdC5TTEFTSF9SRVNPVVJDRV9OQU1FKTtcbiAgICBjb25zdCBkZXBsb3ltZW50U3RyYXRlZ3lJZCA9IHBhcnNlZEFybi5yZXNvdXJjZU5hbWU7XG4gICAgaWYgKCFkZXBsb3ltZW50U3RyYXRlZ3lJZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdNaXNzaW5nIHJlcXVpcmVkIGRlcGxveW1lbnQgc3RyYXRlZ3kgaWQgZnJvbSBkZXBsb3ltZW50IHN0cmF0ZWd5IEFSTicpO1xuICAgIH1cblxuICAgIGNsYXNzIEltcG9ydCBleHRlbmRzIFJlc291cmNlIGltcGxlbWVudHMgSURlcGxveW1lbnRTdHJhdGVneSB7XG4gICAgICBwdWJsaWMgcmVhZG9ubHkgZGVwbG95bWVudFN0cmF0ZWd5SWQgPSBkZXBsb3ltZW50U3RyYXRlZ3lJZCE7XG4gICAgICBwdWJsaWMgcmVhZG9ubHkgZGVwbG95bWVudFN0cmF0ZWd5QXJuID0gZGVwbG95bWVudFN0cmF0ZWd5QXJuO1xuICAgIH1cblxuICAgIHJldHVybiBuZXcgSW1wb3J0KHNjb3BlLCBpZCwge1xuICAgICAgZW52aXJvbm1lbnRGcm9tQXJuOiBkZXBsb3ltZW50U3RyYXRlZ3lBcm4sXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogSW1wb3J0cyBhIGRlcGxveW1lbnQgc3RyYXRlZ3kgaW50byB0aGUgQ0RLIHVzaW5nIGl0cyBJRC5cbiAgICpcbiAgICogQHBhcmFtIHNjb3BlIFRoZSBwYXJlbnQgY29uc3RydWN0XG4gICAqIEBwYXJhbSBpZCBUaGUgbmFtZSBvZiB0aGUgZGVwbG95bWVudCBzdHJhdGVneSBjb25zdHJ1Y3RcbiAgICogQHBhcmFtIGRlcGxveW1lbnRTdHJhdGVneUlkIFRoZSBJRCBvZiB0aGUgZGVwbG95bWVudCBzdHJhdGVneVxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBmcm9tRGVwbG95bWVudFN0cmF0ZWd5SWQoc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgZGVwbG95bWVudFN0cmF0ZWd5SWQ6IERlcGxveW1lbnRTdHJhdGVneUlkKTogSURlcGxveW1lbnRTdHJhdGVneSB7XG4gICAgY29uc3Qgc3RhY2sgPSBTdGFjay5vZihzY29wZSk7XG4gICAgY29uc3QgZGVwbG95bWVudFN0cmF0ZWd5QXJuID0gc3RhY2suZm9ybWF0QXJuKHtcbiAgICAgIHNlcnZpY2U6ICdhcHBjb25maWcnLFxuICAgICAgcmVzb3VyY2U6ICdkZXBsb3ltZW50c3RyYXRlZ3knLFxuICAgICAgcmVzb3VyY2VOYW1lOiBkZXBsb3ltZW50U3RyYXRlZ3lJZC5pZCxcbiAgICB9KTtcblxuICAgIGNsYXNzIEltcG9ydCBleHRlbmRzIFJlc291cmNlIGltcGxlbWVudHMgSURlcGxveW1lbnRTdHJhdGVneSB7XG4gICAgICBwdWJsaWMgcmVhZG9ubHkgZGVwbG95bWVudFN0cmF0ZWd5SWQgPSBkZXBsb3ltZW50U3RyYXRlZ3lJZC5pZDtcbiAgICAgIHB1YmxpYyByZWFkb25seSBkZXBsb3ltZW50U3RyYXRlZ3lBcm4gPSBkZXBsb3ltZW50U3RyYXRlZ3lBcm47XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBJbXBvcnQoc2NvcGUsIGlkLCB7XG4gICAgICBlbnZpcm9ubWVudEZyb21Bcm46IGRlcGxveW1lbnRTdHJhdGVneUFybixcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgbmFtZSBvZiB0aGUgZGVwbG95bWVudCBzdHJhdGVneS5cbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBuYW1lPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgZGVwbG95bWVudCBkdXJhdGlvbiBpbiBtaW51dGVzIG9mIHRoZSBkZXBsb3ltZW50IHN0cmF0ZWd5LlxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IGRlcGxveW1lbnREdXJhdGlvbkluTWludXRlcz86IG51bWJlcjtcblxuICAvKipcbiAgICogVGhlIGdyb3d0aCBmYWN0b3Igb2YgdGhlIGRlcGxveW1lbnQgc3RyYXRlZ3kuXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgZ3Jvd3RoRmFjdG9yPzogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBUaGUgZGVzY3JpcHRpb24gb2YgdGhlIGRlcGxveW1lbnQgc3RyYXRlZ3kuXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgZGVzY3JpcHRpb24/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBmaW5hbCBiYWtlIHRpbWUgaW4gbWludXRlcyBvZiB0aGUgZGVwbG95bWVudCBzdHJhdGVneS5cbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBmaW5hbEJha2VUaW1lSW5NaW51dGVzPzogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBUaGUgZ3Jvd3RoIHR5cGUgb2YgdGhlIGRlcGxveW1lbnQgc3RyYXRlZ3kuXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgZ3Jvd3RoVHlwZT86IEdyb3d0aFR5cGU7XG5cbiAgLyoqXG4gICAqIFRoZSBJRCBvZiB0aGUgZGVwbG95bWVudCBzdHJhdGVneS5cbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBkZXBsb3ltZW50U3RyYXRlZ3lJZDogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgQW1hem9uIFJlc291cmNlIE5hbWUgKEFSTikgb2YgdGhlIGRlcGxveW1lbnQgc3RyYXRlZ3kuXG4gICAqXG4gICAqIEBhdHRyaWJ1dGVcbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBkZXBsb3ltZW50U3RyYXRlZ3lBcm46IHN0cmluZztcblxuICBwcml2YXRlIHJlYWRvbmx5IF9jZm5EZXBsb3ltZW50U3RyYXRlZ3k6IENmbkRlcGxveW1lbnRTdHJhdGVneTtcblxuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogRGVwbG95bWVudFN0cmF0ZWd5UHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHtcbiAgICAgIHBoeXNpY2FsTmFtZTogcHJvcHMuZGVwbG95bWVudFN0cmF0ZWd5TmFtZSxcbiAgICB9KTtcblxuICAgIHRoaXMuZGVwbG95bWVudER1cmF0aW9uSW5NaW51dGVzID0gcHJvcHMucm9sbG91dFN0cmF0ZWd5LmRlcGxveW1lbnREdXJhdGlvbi50b01pbnV0ZXMoKTtcbiAgICB0aGlzLmdyb3d0aEZhY3RvciA9IHByb3BzLnJvbGxvdXRTdHJhdGVneS5ncm93dGhGYWN0b3I7XG4gICAgdGhpcy5kZXNjcmlwdGlvbiA9IHByb3BzLmRlc2NyaXB0aW9uO1xuICAgIHRoaXMuZmluYWxCYWtlVGltZUluTWludXRlcyA9IHByb3BzLnJvbGxvdXRTdHJhdGVneS5maW5hbEJha2VUaW1lPy50b01pbnV0ZXMoKTtcbiAgICB0aGlzLmdyb3d0aFR5cGUgPSBwcm9wcy5yb2xsb3V0U3RyYXRlZ3kuZ3Jvd3RoVHlwZTtcbiAgICB0aGlzLm5hbWUgPSBwcm9wcy5kZXBsb3ltZW50U3RyYXRlZ3lOYW1lIHx8IE5hbWVzLnVuaXF1ZVJlc291cmNlTmFtZSh0aGlzLCB7XG4gICAgICBtYXhMZW5ndGg6IDY0LFxuICAgICAgc2VwYXJhdG9yOiAnLScsXG4gICAgfSk7XG5cbiAgICBjb25zdCByZXNvdXJjZSA9IG5ldyBDZm5EZXBsb3ltZW50U3RyYXRlZ3kodGhpcywgJ1Jlc291cmNlJywge1xuICAgICAgbmFtZTogdGhpcy5uYW1lLFxuICAgICAgZGVwbG95bWVudER1cmF0aW9uSW5NaW51dGVzOiB0aGlzLmRlcGxveW1lbnREdXJhdGlvbkluTWludXRlcyxcbiAgICAgIGdyb3d0aEZhY3RvcjogdGhpcy5ncm93dGhGYWN0b3IsXG4gICAgICByZXBsaWNhdGVUbzogJ05PTkUnLFxuICAgICAgZGVzY3JpcHRpb246IHRoaXMuZGVzY3JpcHRpb24sXG4gICAgICBmaW5hbEJha2VUaW1lSW5NaW51dGVzOiB0aGlzLmZpbmFsQmFrZVRpbWVJbk1pbnV0ZXMsXG4gICAgICBncm93dGhUeXBlOiB0aGlzLmdyb3d0aFR5cGUsXG4gICAgfSk7XG4gICAgdGhpcy5fY2ZuRGVwbG95bWVudFN0cmF0ZWd5ID0gcmVzb3VyY2U7XG5cbiAgICB0aGlzLmRlcGxveW1lbnRTdHJhdGVneUlkID0gdGhpcy5fY2ZuRGVwbG95bWVudFN0cmF0ZWd5LnJlZjtcbiAgICB0aGlzLmRlcGxveW1lbnRTdHJhdGVneUFybiA9IHRoaXMuc3RhY2suZm9ybWF0QXJuKHtcbiAgICAgIHNlcnZpY2U6ICdhcHBjb25maWcnLFxuICAgICAgcmVzb3VyY2U6ICdkZXBsb3ltZW50c3RyYXRlZ3knLFxuICAgICAgcmVzb3VyY2VOYW1lOiB0aGlzLmRlcGxveW1lbnRTdHJhdGVneUlkLFxuICAgIH0pO1xuICB9XG59XG5cbi8qKlxuICogRGVmaW5lcyB0aGUgZ3Jvd3RoIHR5cGUgb2YgdGhlIGRlcGxveW1lbnQgc3RyYXRlZ3kuXG4gKi9cbmV4cG9ydCBlbnVtIEdyb3d0aFR5cGUge1xuICAvKipcbiAgICogQVdTIEFwcENvbmZpZyB3aWxsIHByb2Nlc3MgdGhlIGRlcGxveW1lbnQgYnkgaW5jcmVtZW50cyBvZiB0aGUgZ3Jvd3RoIGZhY3RvclxuICAgKiBldmVubHkgZGlzdHJpYnV0ZWQgb3ZlciB0aGUgZGVwbG95bWVudC5cbiAgICovXG4gIExJTkVBUiA9ICdMSU5FQVInLFxuXG4gIC8qKlxuICAgKiBBV1MgQXBwQ29uZmlnIHdpbGwgcHJvY2VzcyB0aGUgZGVwbG95bWVudCBleHBvbmVudGlhbGx5IHVzaW5nIHRoZSBmb2xsb3dpbmcgZm9ybXVsYTpcbiAgICogYEcqKDJeTilgLiBJbiB0aGlzIGZvcm11bGEsIGBHYCBpcyB0aGUgc3RlcCBwZXJjZW50YWdlIHNwZWNpZmllZCBieSB0aGUgdXNlciBhbmQgYE5gXG4gICAqIGlzIHRoZSBudW1iZXIgb2Ygc3RlcHMgdW50aWwgdGhlIGNvbmZpZ3VyYXRpb24gaXMgZGVwbG95ZWQgdG8gYWxsIHRhcmdldHMuXG4gICAqL1xuICBFWFBPTkVOVElBTCA9ICdFWFBPTkVOVElBTCcsXG59XG5cbi8qKlxuICogRGVmaW5lcyB0aGUgZGVwbG95bWVudCBzdHJhdGVneSBJRCdzIG9mIEFXUyBBcHBDb25maWcgZGVwbG95bWVudCBzdHJhdGVnaWVzLlxuICpcbiAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL2FwcGNvbmZpZy9sYXRlc3QvdXNlcmd1aWRlL2FwcGNvbmZpZy1jcmVhdGluZy1kZXBsb3ltZW50LXN0cmF0ZWd5Lmh0bWxcbiAqL1xuZXhwb3J0IGFic3RyYWN0IGNsYXNzIERlcGxveW1lbnRTdHJhdGVneUlkIHtcbiAgLyoqXG4gICAqICoqQVdTIFJlY29tbWVuZGVkKiouIFRoaXMgc3RyYXRlZ3kgcHJvY2Vzc2VzIHRoZSBkZXBsb3ltZW50IGV4cG9uZW50aWFsbHkgdXNpbmcgYSAxMCUgZ3Jvd3RoIGZhY3RvciBvdmVyIDIwIG1pbnV0ZXMuXG4gICAqIEFXUyBBcHBDb25maWcgcmVjb21tZW5kcyB1c2luZyB0aGlzIHN0cmF0ZWd5IGZvciBwcm9kdWN0aW9uIGRlcGxveW1lbnRzIGJlY2F1c2UgaXQgYWxpZ25zIHdpdGggQVdTIGJlc3QgcHJhY3RpY2VzXG4gICAqIGZvciBjb25maWd1cmF0aW9uIGRlcGxveW1lbnRzLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyByZWFkb25seSBDQU5BUllfMTBfUEVSQ0VOVF8yMF9NSU5VVEVTID0gRGVwbG95bWVudFN0cmF0ZWd5SWQuZnJvbVN0cmluZygnQXBwQ29uZmlnLkNhbmFyeTEwUGVyY2VudDIwTWludXRlcycpO1xuXG4gIC8qKlxuICAgKiAqKlRlc3RpbmcvRGVtb25zdHJhdGlvbioqLiBUaGlzIHN0cmF0ZWd5IGRlcGxveXMgdGhlIGNvbmZpZ3VyYXRpb24gdG8gaGFsZiBvZiBhbGwgdGFyZ2V0cyBldmVyeSAzMCBzZWNvbmRzIGZvciBhXG4gICAqIG9uZS1taW51dGUgZGVwbG95bWVudC4gQVdTIEFwcENvbmZpZyByZWNvbW1lbmRzIHVzaW5nIHRoaXMgc3RyYXRlZ3kgb25seSBmb3IgdGVzdGluZyBvciBkZW1vbnN0cmF0aW9uIHB1cnBvc2VzIGJlY2F1c2VcbiAgICogaXQgaGFzIGEgc2hvcnQgZHVyYXRpb24gYW5kIGJha2UgdGltZS5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgTElORUFSXzUwX1BFUkNFTlRfRVZFUllfMzBfU0VDT05EUyA9IERlcGxveW1lbnRTdHJhdGVneUlkLmZyb21TdHJpbmcoJ0FwcENvbmZpZy5MaW5lYXI1MFBlcmNlbnRFdmVyeTMwU2Vjb25kcycpO1xuXG4gIC8qKlxuICAgKiAqKkFXUyBSZWNvbW1lbmRlZCoqLiBUaGlzIHN0cmF0ZWd5IGRlcGxveXMgdGhlIGNvbmZpZ3VyYXRpb24gdG8gMjAlIG9mIGFsbCB0YXJnZXRzIGV2ZXJ5IHNpeCBtaW51dGVzIGZvciBhIDMwIG1pbnV0ZSBkZXBsb3ltZW50LlxuICAgKiBBV1MgQXBwQ29uZmlnIHJlY29tbWVuZHMgdXNpbmcgdGhpcyBzdHJhdGVneSBmb3IgcHJvZHVjdGlvbiBkZXBsb3ltZW50cyBiZWNhdXNlIGl0IGFsaWducyB3aXRoIEFXUyBiZXN0IHByYWN0aWNlc1xuICAgKiBmb3IgY29uZmlndXJhdGlvbiBkZXBsb3ltZW50cy5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgTElORUFSXzIwX1BFUkNFTlRfRVZFUllfNl9NSU5VVEVTID0gRGVwbG95bWVudFN0cmF0ZWd5SWQuZnJvbVN0cmluZygnQXBwQ29uZmlnLkxpbmVhcjIwUGVyY2VudEV2ZXJ5Nk1pbnV0ZXMnKTtcblxuICAvKipcbiAgICogKipRdWljayoqLiBUaGlzIHN0cmF0ZWd5IGRlcGxveXMgdGhlIGNvbmZpZ3VyYXRpb24gdG8gYWxsIHRhcmdldHMgaW1tZWRpYXRlbHkuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IEFMTF9BVF9PTkNFID0gRGVwbG95bWVudFN0cmF0ZWd5SWQuZnJvbVN0cmluZygnQXBwQ29uZmlnLkFsbEF0T25jZScpO1xuXG4gIC8qKlxuICAgKiBCdWlsZHMgYSBkZXBsb3ltZW50IHN0cmF0ZWd5IElEIGZyb20gYSBzdHJpbmcuXG4gICAqXG4gICAqIEBwYXJhbSBkZXBsb3ltZW50U3RyYXRlZ3lJZCBUaGUgZGVwbG95bWVudCBzdHJhdGVneSBJRC5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZnJvbVN0cmluZyhkZXBsb3ltZW50U3RyYXRlZ3lJZDogc3RyaW5nKTogRGVwbG95bWVudFN0cmF0ZWd5SWQge1xuICAgIHJldHVybiB7XG4gICAgICBpZDogZGVwbG95bWVudFN0cmF0ZWd5SWQsXG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgZGVwbG95bWVudCBzdHJhdGVneSBJRC5cbiAgICovXG4gIHB1YmxpYyBhYnN0cmFjdCByZWFkb25seSBpZDogc3RyaW5nO1xufVxuXG4vKipcbiAqIFByb3BlcnRpZXMgZm9yIHRoZSBSb2xsb3V0IFN0cmF0ZWd5LlxuICovXG5leHBvcnQgaW50ZXJmYWNlIFJvbGxvdXRTdHJhdGVneVByb3BzIHtcbiAgLyoqXG4gICAqIFRoZSBncm93dGggZmFjdG9yIG9mIHRoZSBkZXBsb3ltZW50IHN0cmF0ZWd5LiBUaGlzIGRlZmluZXNcbiAgICogdGhlIHBlcmNlbnRhZ2Ugb2YgdGFyZ2V0cyB0byByZWNlaXZlIGEgZGVwbG95ZWQgY29uZmlndXJhdGlvblxuICAgKiBkdXJpbmcgZWFjaCBpbnRlcnZhbC5cbiAgICovXG4gIHJlYWRvbmx5IGdyb3d0aEZhY3RvcjogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBUaGUgZGVwbG95bWVudCBkdXJhdGlvbiBvZiB0aGUgZGVwbG95bWVudCBzdHJhdGVneS4gVGhpcyBkZWZpbmVzXG4gICAqIHRoZSB0b3RhbCBhbW91bnQgb2YgdGltZSBmb3IgYSBkZXBsb3ltZW50IHRvIGxhc3QuXG4gICAqL1xuICByZWFkb25seSBkZXBsb3ltZW50RHVyYXRpb246IER1cmF0aW9uO1xuXG4gIC8qKlxuICAgKiBUaGUgZmluYWwgYmFrZSB0aW1lIG9mIHRoZSBkZXBsb3ltZW50IHN0cmF0ZWd5LlxuICAgKlxuICAgKiBUaGlzIHNldHRpbmcgc3BlY2lmaWVzIHRoZSBhbW91bnQgb2YgdGltZSBBV1MgQXBwQ29uZmlnIG1vbml0b3JzIGZvciBBbWF6b25cbiAgICogQ2xvdWRXYXRjaCBhbGFybXMgYWZ0ZXIgdGhlIGNvbmZpZ3VyYXRpb24gaGFzIGJlZW4gZGVwbG95ZWQgdG9cbiAgICogMTAwJSBvZiBpdHMgdGFyZ2V0cywgYmVmb3JlIGNvbnNpZGVyaW5nIHRoZSBkZXBsb3ltZW50IHRvIGJlIGNvbXBsZXRlLlxuICAgKiBJZiBhbiBhbGFybSBpcyB0cmlnZ2VyZWQgZHVyaW5nIHRoaXMgdGltZSwgQVdTIEFwcENvbmZpZyByb2xscyBiYWNrXG4gICAqIHRoZSBkZXBsb3ltZW50LlxuICAgKlxuICAgKiBAZGVmYXVsdCBEdXJhdGlvbi5taW51dGVzKDApXG4gICAqL1xuICByZWFkb25seSBmaW5hbEJha2VUaW1lPzogRHVyYXRpb247XG59XG5cbi8qKlxuICogRGVmaW5lcyB0aGUgcm9sbG91dCBzdHJhdGVneSBmb3IgYSBkZXBsb3ltZW50IHN0cmF0ZWd5IGFuZCBpbmNsdWRlcyB0aGUgZ3Jvd3RoIGZhY3RvcixcbiAqIGRlcGxveW1lbnQgZHVyYXRpb24sIGdyb3d0aCB0eXBlLCBhbmQgb3B0aW9uYWxseSBmaW5hbCBiYWtlIHRpbWUuXG4gKlxuICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vYXBwY29uZmlnL2xhdGVzdC91c2VyZ3VpZGUvYXBwY29uZmlnLWNyZWF0aW5nLWRlcGxveW1lbnQtc3RyYXRlZ3kuaHRtbFxuICovXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgUm9sbG91dFN0cmF0ZWd5IHtcbiAgLyoqXG4gICAqICoqQVdTIFJlY29tbWVuZGVkKiouIFRoaXMgc3RyYXRlZ3kgcHJvY2Vzc2VzIHRoZSBkZXBsb3ltZW50IGV4cG9uZW50aWFsbHkgdXNpbmcgYSAxMCUgZ3Jvd3RoIGZhY3RvciBvdmVyIDIwIG1pbnV0ZXMuXG4gICAqIEFXUyBBcHBDb25maWcgcmVjb21tZW5kcyB1c2luZyB0aGlzIHN0cmF0ZWd5IGZvciBwcm9kdWN0aW9uIGRlcGxveW1lbnRzIGJlY2F1c2UgaXQgYWxpZ25zIHdpdGggQVdTIGJlc3QgcHJhY3RpY2VzXG4gICAqIGZvciBjb25maWd1cmF0aW9uIGRlcGxveW1lbnRzLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyByZWFkb25seSBDQU5BUllfMTBfUEVSQ0VOVF8yMF9NSU5VVEVTID0gUm9sbG91dFN0cmF0ZWd5LmV4cG9uZW50aWFsKHtcbiAgICBncm93dGhGYWN0b3I6IDEwLFxuICAgIGRlcGxveW1lbnREdXJhdGlvbjogRHVyYXRpb24ubWludXRlcygyMCksXG4gICAgZmluYWxCYWtlVGltZTogRHVyYXRpb24ubWludXRlcygxMCksXG4gIH0pO1xuXG4gIC8qKlxuICAgKiAqKlRlc3RpbmcvRGVtb25zdHJhdGlvbioqLiBUaGlzIHN0cmF0ZWd5IGRlcGxveXMgdGhlIGNvbmZpZ3VyYXRpb24gdG8gaGFsZiBvZiBhbGwgdGFyZ2V0cyBldmVyeSAzMCBzZWNvbmRzIGZvciBhXG4gICAqIG9uZS1taW51dGUgZGVwbG95bWVudC4gQVdTIEFwcENvbmZpZyByZWNvbW1lbmRzIHVzaW5nIHRoaXMgc3RyYXRlZ3kgb25seSBmb3IgdGVzdGluZyBvciBkZW1vbnN0cmF0aW9uIHB1cnBvc2VzIGJlY2F1c2VcbiAgICogaXQgaGFzIGEgc2hvcnQgZHVyYXRpb24gYW5kIGJha2UgdGltZS5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgTElORUFSXzUwX1BFUkNFTlRfRVZFUllfMzBfU0VDT05EUyA9IFJvbGxvdXRTdHJhdGVneS5saW5lYXIoe1xuICAgIGdyb3d0aEZhY3RvcjogNTAsXG4gICAgZGVwbG95bWVudER1cmF0aW9uOiBEdXJhdGlvbi5taW51dGVzKDEpLFxuICAgIGZpbmFsQmFrZVRpbWU6IER1cmF0aW9uLm1pbnV0ZXMoMSksXG4gIH0pO1xuXG4gIC8qKlxuICAgKiAqKkFXUyBSZWNvbW1lbmRlZCoqLiBUaGlzIHN0cmF0ZWd5IGRlcGxveXMgdGhlIGNvbmZpZ3VyYXRpb24gdG8gMjAlIG9mIGFsbCB0YXJnZXRzIGV2ZXJ5IHNpeCBtaW51dGVzIGZvciBhIDMwIG1pbnV0ZSBkZXBsb3ltZW50LlxuICAgKiBBV1MgQXBwQ29uZmlnIHJlY29tbWVuZHMgdXNpbmcgdGhpcyBzdHJhdGVneSBmb3IgcHJvZHVjdGlvbiBkZXBsb3ltZW50cyBiZWNhdXNlIGl0IGFsaWducyB3aXRoIEFXUyBiZXN0IHByYWN0aWNlc1xuICAgKiBmb3IgY29uZmlndXJhdGlvbiBkZXBsb3ltZW50cy5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgTElORUFSXzIwX1BFUkNFTlRfRVZFUllfNl9NSU5VVEVTID0gUm9sbG91dFN0cmF0ZWd5LmxpbmVhcih7XG4gICAgZ3Jvd3RoRmFjdG9yOiAyMCxcbiAgICBkZXBsb3ltZW50RHVyYXRpb246IER1cmF0aW9uLm1pbnV0ZXMoMzApLFxuICAgIGZpbmFsQmFrZVRpbWU6IER1cmF0aW9uLm1pbnV0ZXMoMzApLFxuICB9KTtcblxuICAvKipcbiAgICogKipRdWljayoqLiBUaGlzIHN0cmF0ZWd5IGRlcGxveXMgdGhlIGNvbmZpZ3VyYXRpb24gdG8gYWxsIHRhcmdldHMgaW1tZWRpYXRlbHkuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IEFMTF9BVF9PTkNFID0gUm9sbG91dFN0cmF0ZWd5LmxpbmVhcih7XG4gICAgZ3Jvd3RoRmFjdG9yOiAxMDAsXG4gICAgZGVwbG95bWVudER1cmF0aW9uOiBEdXJhdGlvbi5taW51dGVzKDApLFxuICAgIGZpbmFsQmFrZVRpbWU6IER1cmF0aW9uLm1pbnV0ZXMoMTApLFxuICB9KTtcblxuICAvKipcbiAgICogQnVpbGQgeW91ciBvd24gbGluZWFyIHJvbGxvdXQgc3RyYXRlZ3kuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGxpbmVhcihwcm9wczogUm9sbG91dFN0cmF0ZWd5UHJvcHMpOiBSb2xsb3V0U3RyYXRlZ3kge1xuICAgIHJldHVybiB7XG4gICAgICBncm93dGhGYWN0b3I6IHByb3BzLmdyb3d0aEZhY3RvcixcbiAgICAgIGRlcGxveW1lbnREdXJhdGlvbjogcHJvcHMuZGVwbG95bWVudER1cmF0aW9uLFxuICAgICAgZ3Jvd3RoVHlwZTogR3Jvd3RoVHlwZS5MSU5FQVIsXG4gICAgICBmaW5hbEJha2VUaW1lOiBwcm9wcy5maW5hbEJha2VUaW1lLFxuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogQnVpbGQgeW91ciBvd24gZXhwb25lbnRpYWwgcm9sbG91dCBzdHJhdGVneS5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZXhwb25lbnRpYWwocHJvcHM6IFJvbGxvdXRTdHJhdGVneVByb3BzKTogUm9sbG91dFN0cmF0ZWd5IHtcbiAgICByZXR1cm4ge1xuICAgICAgZ3Jvd3RoRmFjdG9yOiBwcm9wcy5ncm93dGhGYWN0b3IsXG4gICAgICBkZXBsb3ltZW50RHVyYXRpb246IHByb3BzLmRlcGxveW1lbnREdXJhdGlvbixcbiAgICAgIGdyb3d0aFR5cGU6IEdyb3d0aFR5cGUuRVhQT05FTlRJQUwsXG4gICAgICBmaW5hbEJha2VUaW1lOiBwcm9wcy5maW5hbEJha2VUaW1lLFxuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogVGhlIGdyb3d0aCBmYWN0b3Igb2YgdGhlIHJvbGxvdXQgc3RyYXRlZ3kuXG4gICAqL1xuICBwdWJsaWMgYWJzdHJhY3QgcmVhZG9ubHkgZ3Jvd3RoRmFjdG9yOiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIFRoZSBkZXBsb3ltZW50IGR1cmF0aW9uIG9mIHRoZSByb2xsb3V0IHN0cmF0ZWd5LlxuICAgKi9cbiAgcHVibGljIGFic3RyYWN0IHJlYWRvbmx5IGRlcGxveW1lbnREdXJhdGlvbjogRHVyYXRpb247XG5cbiAgLyoqXG4gICAqIFRoZSBncm93dGggdHlwZSBvZiB0aGUgcm9sbG91dCBzdHJhdGVneS5cbiAgICovXG4gIHB1YmxpYyBhYnN0cmFjdCByZWFkb25seSBncm93dGhUeXBlPzogR3Jvd3RoVHlwZTtcblxuICAvKipcbiAgICogVGhlIGZpbmFsIGJha2UgdGltZSBvZiB0aGUgZGVwbG95bWVudCBzdHJhdGVneS5cbiAgICovXG4gIHB1YmxpYyBhYnN0cmFjdCByZWFkb25seSBmaW5hbEJha2VUaW1lPzogRHVyYXRpb247XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgSURlcGxveW1lbnRTdHJhdGVneSBleHRlbmRzIElSZXNvdXJjZSB7XG4gIC8qKlxuICAgKiBUaGUgbmFtZSBvZiB0aGUgZGVwbG95bWVudCBzdHJhdGVneS5cbiAgICovXG4gIHJlYWRvbmx5IG5hbWU/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBkZXBsb3ltZW50IGR1cmF0aW9uIGluIG1pbnV0ZXMuXG4gICAqL1xuICByZWFkb25seSBkZXBsb3ltZW50RHVyYXRpb25Jbk1pbnV0ZXM/OiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIFRoZSBncm93dGggZmFjdG9yIG9mIHRoZSBkZXBsb3ltZW50IHN0cmF0ZWd5LlxuICAgKi9cbiAgcmVhZG9ubHkgZ3Jvd3RoRmFjdG9yPzogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBUaGUgZGVzY3JpcHRpb24gb2YgdGhlIGRlcGxveW1lbnQgc3RyYXRlZ3kuXG4gICAqL1xuICByZWFkb25seSBkZXNjcmlwdGlvbj86IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIGZpbmFsIGJha2UgdGltZSBpbiBtaW51dGVzLlxuICAgKi9cbiAgcmVhZG9ubHkgZmluYWxCYWtlVGltZUluTWludXRlcz86IG51bWJlcjtcblxuICAvKipcbiAgICogVGhlIGdyb3d0aCB0eXBlIG9mIHRoZSBkZXBsb3ltZW50IHN0cmF0ZWd5LlxuICAgKi9cbiAgcmVhZG9ubHkgZ3Jvd3RoVHlwZT86IEdyb3d0aFR5cGU7XG5cbiAgLyoqXG4gICAqIFRoZSBJRCBvZiB0aGUgZGVwbG95bWVudCBzdHJhdGVneS5cbiAgICogQGF0dHJpYnV0ZVxuICAgKi9cbiAgcmVhZG9ubHkgZGVwbG95bWVudFN0cmF0ZWd5SWQ6IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIEFtYXpvbiBSZXNvdXJjZSBOYW1lIChBUk4pIG9mIHRoZSBkZXBsb3ltZW50IHN0cmF0ZWd5LlxuICAgKiBAYXR0cmlidXRlXG4gICAqL1xuICByZWFkb25seSBkZXBsb3ltZW50U3RyYXRlZ3lBcm46IHN0cmluZztcbn1cbiJdfQ==