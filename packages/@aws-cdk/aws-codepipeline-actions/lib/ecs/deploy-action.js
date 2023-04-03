"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EcsDeployAction = void 0;
const jsiiDeprecationWarnings = require("../../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const codepipeline = require("@aws-cdk/aws-codepipeline");
const iam = require("@aws-cdk/aws-iam");
const action_1 = require("../action");
const common_1 = require("../common");
/**
 * CodePipeline Action to deploy an ECS Service.
 */
class EcsDeployAction extends action_1.Action {
    constructor(props) {
        super({
            ...props,
            category: codepipeline.ActionCategory.DEPLOY,
            provider: 'ECS',
            artifactBounds: common_1.deployArtifactBounds(),
            inputs: [determineInputArtifact(props)],
            resource: props.service,
        });
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_codepipeline_actions_EcsDeployActionProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, EcsDeployAction);
            }
            throw error;
        }
        const deploymentTimeout = props.deploymentTimeout?.toMinutes({ integral: true });
        if (deploymentTimeout !== undefined && (deploymentTimeout < 1 || deploymentTimeout > 60)) {
            throw new Error(`Deployment timeout must be between 1 and 60 minutes, got: ${deploymentTimeout}`);
        }
        this.props = props;
        this.deploymentTimeout = deploymentTimeout;
    }
    bound(_scope, _stage, options) {
        // permissions based on CodePipeline documentation:
        // https://docs.aws.amazon.com/codepipeline/latest/userguide/how-to-custom-role.html#how-to-update-role-new-services
        options.role.addToPolicy(new iam.PolicyStatement({
            actions: [
                'ecs:DescribeServices',
                'ecs:DescribeTaskDefinition',
                'ecs:DescribeTasks',
                'ecs:ListTasks',
                'ecs:RegisterTaskDefinition',
                'ecs:UpdateService',
            ],
            resources: ['*'],
        }));
        options.role.addToPolicy(new iam.PolicyStatement({
            actions: ['iam:PassRole'],
            resources: ['*'],
            conditions: {
                StringEqualsIfExists: {
                    'iam:PassedToService': [
                        'ec2.amazonaws.com',
                        'ecs-tasks.amazonaws.com',
                    ],
                },
            },
        }));
        options.bucket.grantRead(options.role);
        return {
            configuration: {
                ClusterName: this.props.service.cluster.clusterName,
                ServiceName: this.props.service.serviceName,
                FileName: this.props.imageFile?.fileName,
                DeploymentTimeout: this.deploymentTimeout,
            },
        };
    }
}
exports.EcsDeployAction = EcsDeployAction;
_a = JSII_RTTI_SYMBOL_1;
EcsDeployAction[_a] = { fqn: "@aws-cdk/aws-codepipeline-actions.EcsDeployAction", version: "0.0.0" };
function determineInputArtifact(props) {
    if (props.imageFile && props.input) {
        throw new Error("Exactly one of 'input' or 'imageFile' can be provided in the ECS deploy Action");
    }
    if (props.imageFile) {
        return props.imageFile.artifact;
    }
    if (props.input) {
        return props.input;
    }
    throw new Error("Specifying one of 'input' or 'imageFile' is required for the ECS deploy Action");
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVwbG95LWFjdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRlcGxveS1hY3Rpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsMERBQTBEO0FBRTFELHdDQUF3QztBQUd4QyxzQ0FBbUM7QUFDbkMsc0NBQWlEO0FBK0NqRDs7R0FFRztBQUNILE1BQWEsZUFBZ0IsU0FBUSxlQUFNO0lBSXpDLFlBQVksS0FBMkI7UUFDckMsS0FBSyxDQUFDO1lBQ0osR0FBRyxLQUFLO1lBQ1IsUUFBUSxFQUFFLFlBQVksQ0FBQyxjQUFjLENBQUMsTUFBTTtZQUM1QyxRQUFRLEVBQUUsS0FBSztZQUNmLGNBQWMsRUFBRSw2QkFBb0IsRUFBRTtZQUN0QyxNQUFNLEVBQUUsQ0FBQyxzQkFBc0IsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUN2QyxRQUFRLEVBQUUsS0FBSyxDQUFDLE9BQU87U0FDeEIsQ0FBQyxDQUFDOzs7Ozs7K0NBWk0sZUFBZTs7OztRQWN4QixNQUFNLGlCQUFpQixHQUFHLEtBQUssQ0FBQyxpQkFBaUIsRUFBRSxTQUFTLENBQUMsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztRQUNqRixJQUFJLGlCQUFpQixLQUFLLFNBQVMsSUFBSSxDQUFDLGlCQUFpQixHQUFHLENBQUMsSUFBSSxpQkFBaUIsR0FBRyxFQUFFLENBQUMsRUFBRTtZQUN4RixNQUFNLElBQUksS0FBSyxDQUFDLDZEQUE2RCxpQkFBaUIsRUFBRSxDQUFDLENBQUM7U0FDbkc7UUFFRCxJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUNuQixJQUFJLENBQUMsaUJBQWlCLEdBQUcsaUJBQWlCLENBQUM7S0FDNUM7SUFFUyxLQUFLLENBQUMsTUFBaUIsRUFBRSxNQUEyQixFQUFFLE9BQXVDO1FBRXJHLG1EQUFtRDtRQUNuRCxvSEFBb0g7UUFDcEgsT0FBTyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxHQUFHLENBQUMsZUFBZSxDQUFDO1lBQy9DLE9BQU8sRUFBRTtnQkFDUCxzQkFBc0I7Z0JBQ3RCLDRCQUE0QjtnQkFDNUIsbUJBQW1CO2dCQUNuQixlQUFlO2dCQUNmLDRCQUE0QjtnQkFDNUIsbUJBQW1CO2FBQ3BCO1lBQ0QsU0FBUyxFQUFFLENBQUMsR0FBRyxDQUFDO1NBQ2pCLENBQUMsQ0FBQyxDQUFDO1FBRUosT0FBTyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxHQUFHLENBQUMsZUFBZSxDQUFDO1lBQy9DLE9BQU8sRUFBRSxDQUFDLGNBQWMsQ0FBQztZQUN6QixTQUFTLEVBQUUsQ0FBQyxHQUFHLENBQUM7WUFDaEIsVUFBVSxFQUFFO2dCQUNWLG9CQUFvQixFQUFFO29CQUNwQixxQkFBcUIsRUFBRTt3QkFDckIsbUJBQW1CO3dCQUNuQix5QkFBeUI7cUJBQzFCO2lCQUNGO2FBQ0Y7U0FDRixDQUFDLENBQUMsQ0FBQztRQUVKLE9BQU8sQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUV2QyxPQUFPO1lBQ0wsYUFBYSxFQUFFO2dCQUNiLFdBQVcsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsV0FBVztnQkFDbkQsV0FBVyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLFdBQVc7Z0JBQzNDLFFBQVEsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsRUFBRSxRQUFRO2dCQUN4QyxpQkFBaUIsRUFBRSxJQUFJLENBQUMsaUJBQWlCO2FBQzFDO1NBQ0YsQ0FBQztLQUNIOztBQTlESCwwQ0ErREM7OztBQUVELFNBQVMsc0JBQXNCLENBQUMsS0FBMkI7SUFDekQsSUFBSSxLQUFLLENBQUMsU0FBUyxJQUFJLEtBQUssQ0FBQyxLQUFLLEVBQUU7UUFDbEMsTUFBTSxJQUFJLEtBQUssQ0FBQyxnRkFBZ0YsQ0FBQyxDQUFDO0tBQ25HO0lBQ0QsSUFBSSxLQUFLLENBQUMsU0FBUyxFQUFFO1FBQ25CLE9BQU8sS0FBSyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUM7S0FDakM7SUFDRCxJQUFJLEtBQUssQ0FBQyxLQUFLLEVBQUU7UUFDZixPQUFPLEtBQUssQ0FBQyxLQUFLLENBQUM7S0FDcEI7SUFDRCxNQUFNLElBQUksS0FBSyxDQUFDLGdGQUFnRixDQUFDLENBQUM7QUFDcEcsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNvZGVwaXBlbGluZSBmcm9tICdAYXdzLWNkay9hd3MtY29kZXBpcGVsaW5lJztcbmltcG9ydCAqIGFzIGVjcyBmcm9tICdAYXdzLWNkay9hd3MtZWNzJztcbmltcG9ydCAqIGFzIGlhbSBmcm9tICdAYXdzLWNkay9hd3MtaWFtJztcbmltcG9ydCB7IER1cmF0aW9uIH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCB7IEFjdGlvbiB9IGZyb20gJy4uL2FjdGlvbic7XG5pbXBvcnQgeyBkZXBsb3lBcnRpZmFjdEJvdW5kcyB9IGZyb20gJy4uL2NvbW1vbic7XG5cbi8qKlxuICogQ29uc3RydWN0aW9uIHByb3BlcnRpZXMgb2YgYEVjc0RlcGxveUFjdGlvbmAuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgRWNzRGVwbG95QWN0aW9uUHJvcHMgZXh0ZW5kcyBjb2RlcGlwZWxpbmUuQ29tbW9uQXdzQWN0aW9uUHJvcHMge1xuICAvKipcbiAgICogVGhlIGlucHV0IGFydGlmYWN0IHRoYXQgY29udGFpbnMgdGhlIEpTT04gaW1hZ2UgZGVmaW5pdGlvbnMgZmlsZSB0byB1c2UgZm9yIGRlcGxveW1lbnRzLlxuICAgKiBUaGUgSlNPTiBmaWxlIGlzIGEgbGlzdCBvZiBvYmplY3RzLFxuICAgKiBlYWNoIHdpdGggMiBrZXlzOiBgbmFtZWAgaXMgdGhlIG5hbWUgb2YgdGhlIGNvbnRhaW5lciBpbiB0aGUgVGFzayBEZWZpbml0aW9uLFxuICAgKiBhbmQgYGltYWdlVXJpYCBpcyB0aGUgRG9ja2VyIGltYWdlIFVSSSB5b3Ugd2FudCB0byB1cGRhdGUgeW91ciBzZXJ2aWNlIHdpdGguXG4gICAqIElmIHlvdSB1c2UgdGhpcyBwcm9wZXJ0eSwgaXQncyBhc3N1bWVkIHRoZSBmaWxlIGlzIGNhbGxlZCAnaW1hZ2VkZWZpbml0aW9ucy5qc29uJy5cbiAgICogSWYgeW91ciBidWlsZCB1c2VzIGEgZGlmZmVyZW50IGZpbGUsIGxlYXZlIHRoaXMgcHJvcGVydHkgZW1wdHksXG4gICAqIGFuZCB1c2UgdGhlIGBpbWFnZUZpbGVgIHByb3BlcnR5IGluc3RlYWQuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gb25lIG9mIHRoaXMgcHJvcGVydHksIG9yIGBpbWFnZUZpbGVgLCBpcyByZXF1aXJlZFxuICAgKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9jb2RlcGlwZWxpbmUvbGF0ZXN0L3VzZXJndWlkZS9waXBlbGluZXMtY3JlYXRlLmh0bWwjcGlwZWxpbmVzLWNyZWF0ZS1pbWFnZS1kZWZpbml0aW9uc1xuICAgKi9cbiAgcmVhZG9ubHkgaW5wdXQ/OiBjb2RlcGlwZWxpbmUuQXJ0aWZhY3Q7XG5cbiAgLyoqXG4gICAqIFRoZSBuYW1lIG9mIHRoZSBKU09OIGltYWdlIGRlZmluaXRpb25zIGZpbGUgdG8gdXNlIGZvciBkZXBsb3ltZW50cy5cbiAgICogVGhlIEpTT04gZmlsZSBpcyBhIGxpc3Qgb2Ygb2JqZWN0cyxcbiAgICogZWFjaCB3aXRoIDIga2V5czogYG5hbWVgIGlzIHRoZSBuYW1lIG9mIHRoZSBjb250YWluZXIgaW4gdGhlIFRhc2sgRGVmaW5pdGlvbixcbiAgICogYW5kIGBpbWFnZVVyaWAgaXMgdGhlIERvY2tlciBpbWFnZSBVUkkgeW91IHdhbnQgdG8gdXBkYXRlIHlvdXIgc2VydmljZSB3aXRoLlxuICAgKiBVc2UgdGhpcyBwcm9wZXJ0eSBpZiB5b3Ugd2FudCB0byB1c2UgYSBkaWZmZXJlbnQgbmFtZSBmb3IgdGhpcyBmaWxlIHRoYW4gdGhlIGRlZmF1bHQgJ2ltYWdlZGVmaW5pdGlvbnMuanNvbicuXG4gICAqIElmIHlvdSB1c2UgdGhpcyBwcm9wZXJ0eSwgeW91IGRvbid0IG5lZWQgdG8gc3BlY2lmeSB0aGUgYGlucHV0YCBwcm9wZXJ0eS5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBvbmUgb2YgdGhpcyBwcm9wZXJ0eSwgb3IgYGlucHV0YCwgaXMgcmVxdWlyZWRcbiAgICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vY29kZXBpcGVsaW5lL2xhdGVzdC91c2VyZ3VpZGUvcGlwZWxpbmVzLWNyZWF0ZS5odG1sI3BpcGVsaW5lcy1jcmVhdGUtaW1hZ2UtZGVmaW5pdGlvbnNcbiAgICovXG4gIHJlYWRvbmx5IGltYWdlRmlsZT86IGNvZGVwaXBlbGluZS5BcnRpZmFjdFBhdGg7XG5cbiAgLyoqXG4gICAqIFRoZSBFQ1MgU2VydmljZSB0byBkZXBsb3kuXG4gICAqL1xuICByZWFkb25seSBzZXJ2aWNlOiBlY3MuSUJhc2VTZXJ2aWNlO1xuXG4gIC8qKlxuICAgKiBUaW1lb3V0IGZvciB0aGUgRUNTIGRlcGxveW1lbnQgaW4gbWludXRlcy4gVmFsdWUgbXVzdCBiZSBiZXR3ZWVuIDEtNjAuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gNjAgbWludXRlc1xuICAgKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9jb2RlcGlwZWxpbmUvbGF0ZXN0L3VzZXJndWlkZS9hY3Rpb24tcmVmZXJlbmNlLUVDUy5odG1sXG4gICAqL1xuICByZWFkb25seSBkZXBsb3ltZW50VGltZW91dD86IER1cmF0aW9uO1xufVxuXG4vKipcbiAqIENvZGVQaXBlbGluZSBBY3Rpb24gdG8gZGVwbG95IGFuIEVDUyBTZXJ2aWNlLlxuICovXG5leHBvcnQgY2xhc3MgRWNzRGVwbG95QWN0aW9uIGV4dGVuZHMgQWN0aW9uIHtcbiAgcHJpdmF0ZSByZWFkb25seSBwcm9wczogRWNzRGVwbG95QWN0aW9uUHJvcHM7XG4gIHByaXZhdGUgcmVhZG9ubHkgZGVwbG95bWVudFRpbWVvdXQ/OiBudW1iZXJcblxuICBjb25zdHJ1Y3Rvcihwcm9wczogRWNzRGVwbG95QWN0aW9uUHJvcHMpIHtcbiAgICBzdXBlcih7XG4gICAgICAuLi5wcm9wcyxcbiAgICAgIGNhdGVnb3J5OiBjb2RlcGlwZWxpbmUuQWN0aW9uQ2F0ZWdvcnkuREVQTE9ZLFxuICAgICAgcHJvdmlkZXI6ICdFQ1MnLFxuICAgICAgYXJ0aWZhY3RCb3VuZHM6IGRlcGxveUFydGlmYWN0Qm91bmRzKCksXG4gICAgICBpbnB1dHM6IFtkZXRlcm1pbmVJbnB1dEFydGlmYWN0KHByb3BzKV0sXG4gICAgICByZXNvdXJjZTogcHJvcHMuc2VydmljZSxcbiAgICB9KTtcblxuICAgIGNvbnN0IGRlcGxveW1lbnRUaW1lb3V0ID0gcHJvcHMuZGVwbG95bWVudFRpbWVvdXQ/LnRvTWludXRlcyh7IGludGVncmFsOiB0cnVlIH0pO1xuICAgIGlmIChkZXBsb3ltZW50VGltZW91dCAhPT0gdW5kZWZpbmVkICYmIChkZXBsb3ltZW50VGltZW91dCA8IDEgfHwgZGVwbG95bWVudFRpbWVvdXQgPiA2MCkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgRGVwbG95bWVudCB0aW1lb3V0IG11c3QgYmUgYmV0d2VlbiAxIGFuZCA2MCBtaW51dGVzLCBnb3Q6ICR7ZGVwbG95bWVudFRpbWVvdXR9YCk7XG4gICAgfVxuXG4gICAgdGhpcy5wcm9wcyA9IHByb3BzO1xuICAgIHRoaXMuZGVwbG95bWVudFRpbWVvdXQgPSBkZXBsb3ltZW50VGltZW91dDtcbiAgfVxuXG4gIHByb3RlY3RlZCBib3VuZChfc2NvcGU6IENvbnN0cnVjdCwgX3N0YWdlOiBjb2RlcGlwZWxpbmUuSVN0YWdlLCBvcHRpb25zOiBjb2RlcGlwZWxpbmUuQWN0aW9uQmluZE9wdGlvbnMpOlxuICBjb2RlcGlwZWxpbmUuQWN0aW9uQ29uZmlnIHtcbiAgICAvLyBwZXJtaXNzaW9ucyBiYXNlZCBvbiBDb2RlUGlwZWxpbmUgZG9jdW1lbnRhdGlvbjpcbiAgICAvLyBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vY29kZXBpcGVsaW5lL2xhdGVzdC91c2VyZ3VpZGUvaG93LXRvLWN1c3RvbS1yb2xlLmh0bWwjaG93LXRvLXVwZGF0ZS1yb2xlLW5ldy1zZXJ2aWNlc1xuICAgIG9wdGlvbnMucm9sZS5hZGRUb1BvbGljeShuZXcgaWFtLlBvbGljeVN0YXRlbWVudCh7XG4gICAgICBhY3Rpb25zOiBbXG4gICAgICAgICdlY3M6RGVzY3JpYmVTZXJ2aWNlcycsXG4gICAgICAgICdlY3M6RGVzY3JpYmVUYXNrRGVmaW5pdGlvbicsXG4gICAgICAgICdlY3M6RGVzY3JpYmVUYXNrcycsXG4gICAgICAgICdlY3M6TGlzdFRhc2tzJyxcbiAgICAgICAgJ2VjczpSZWdpc3RlclRhc2tEZWZpbml0aW9uJyxcbiAgICAgICAgJ2VjczpVcGRhdGVTZXJ2aWNlJyxcbiAgICAgIF0sXG4gICAgICByZXNvdXJjZXM6IFsnKiddLFxuICAgIH0pKTtcblxuICAgIG9wdGlvbnMucm9sZS5hZGRUb1BvbGljeShuZXcgaWFtLlBvbGljeVN0YXRlbWVudCh7XG4gICAgICBhY3Rpb25zOiBbJ2lhbTpQYXNzUm9sZSddLFxuICAgICAgcmVzb3VyY2VzOiBbJyonXSxcbiAgICAgIGNvbmRpdGlvbnM6IHtcbiAgICAgICAgU3RyaW5nRXF1YWxzSWZFeGlzdHM6IHtcbiAgICAgICAgICAnaWFtOlBhc3NlZFRvU2VydmljZSc6IFtcbiAgICAgICAgICAgICdlYzIuYW1hem9uYXdzLmNvbScsXG4gICAgICAgICAgICAnZWNzLXRhc2tzLmFtYXpvbmF3cy5jb20nLFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pKTtcblxuICAgIG9wdGlvbnMuYnVja2V0LmdyYW50UmVhZChvcHRpb25zLnJvbGUpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIGNvbmZpZ3VyYXRpb246IHtcbiAgICAgICAgQ2x1c3Rlck5hbWU6IHRoaXMucHJvcHMuc2VydmljZS5jbHVzdGVyLmNsdXN0ZXJOYW1lLFxuICAgICAgICBTZXJ2aWNlTmFtZTogdGhpcy5wcm9wcy5zZXJ2aWNlLnNlcnZpY2VOYW1lLFxuICAgICAgICBGaWxlTmFtZTogdGhpcy5wcm9wcy5pbWFnZUZpbGU/LmZpbGVOYW1lLFxuICAgICAgICBEZXBsb3ltZW50VGltZW91dDogdGhpcy5kZXBsb3ltZW50VGltZW91dCxcbiAgICAgIH0sXG4gICAgfTtcbiAgfVxufVxuXG5mdW5jdGlvbiBkZXRlcm1pbmVJbnB1dEFydGlmYWN0KHByb3BzOiBFY3NEZXBsb3lBY3Rpb25Qcm9wcyk6IGNvZGVwaXBlbGluZS5BcnRpZmFjdCB7XG4gIGlmIChwcm9wcy5pbWFnZUZpbGUgJiYgcHJvcHMuaW5wdXQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJFeGFjdGx5IG9uZSBvZiAnaW5wdXQnIG9yICdpbWFnZUZpbGUnIGNhbiBiZSBwcm92aWRlZCBpbiB0aGUgRUNTIGRlcGxveSBBY3Rpb25cIik7XG4gIH1cbiAgaWYgKHByb3BzLmltYWdlRmlsZSkge1xuICAgIHJldHVybiBwcm9wcy5pbWFnZUZpbGUuYXJ0aWZhY3Q7XG4gIH1cbiAgaWYgKHByb3BzLmlucHV0KSB7XG4gICAgcmV0dXJuIHByb3BzLmlucHV0O1xuICB9XG4gIHRocm93IG5ldyBFcnJvcihcIlNwZWNpZnlpbmcgb25lIG9mICdpbnB1dCcgb3IgJ2ltYWdlRmlsZScgaXMgcmVxdWlyZWQgZm9yIHRoZSBFQ1MgZGVwbG95IEFjdGlvblwiKTtcbn1cbiJdfQ==