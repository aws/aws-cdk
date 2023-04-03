"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ElasticBeanstalkDeployAction = void 0;
const jsiiDeprecationWarnings = require("../../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const codepipeline = require("@aws-cdk/aws-codepipeline");
const action_1 = require("../action");
const common_1 = require("../common");
/**
 * CodePipeline action to deploy an AWS ElasticBeanstalk Application.
 */
class ElasticBeanstalkDeployAction extends action_1.Action {
    constructor(props) {
        super({
            ...props,
            category: codepipeline.ActionCategory.DEPLOY,
            provider: 'ElasticBeanstalk',
            artifactBounds: common_1.deployArtifactBounds(),
            inputs: [props.input],
        });
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_codepipeline_actions_ElasticBeanstalkDeployActionProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, ElasticBeanstalkDeployAction);
            }
            throw error;
        }
        this.applicationName = props.applicationName;
        this.environmentName = props.environmentName;
    }
    bound(_scope, _stage, options) {
        // Per https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/AWSHowTo.iam.managed-policies.html
        // it doesn't seem we can scope this down further for the codepipeline action.
        options.role.addManagedPolicy({ managedPolicyArn: 'arn:aws:iam::aws:policy/AdministratorAccess-AWSElasticBeanstalk' });
        // the Action's Role needs to read from the Bucket to get artifacts
        options.bucket.grantRead(options.role);
        return {
            configuration: {
                ApplicationName: this.applicationName,
                EnvironmentName: this.environmentName,
            },
        };
    }
}
exports.ElasticBeanstalkDeployAction = ElasticBeanstalkDeployAction;
_a = JSII_RTTI_SYMBOL_1;
ElasticBeanstalkDeployAction[_a] = { fqn: "@aws-cdk/aws-codepipeline-actions.ElasticBeanstalkDeployAction", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVwbG95LWFjdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRlcGxveS1hY3Rpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsMERBQTBEO0FBRTFELHNDQUFtQztBQUNuQyxzQ0FBaUQ7QUFzQmpEOztHQUVHO0FBQ0gsTUFBYSw0QkFBNkIsU0FBUSxlQUFNO0lBSXRELFlBQVksS0FBd0M7UUFDbEQsS0FBSyxDQUFDO1lBQ0osR0FBRyxLQUFLO1lBQ1IsUUFBUSxFQUFFLFlBQVksQ0FBQyxjQUFjLENBQUMsTUFBTTtZQUM1QyxRQUFRLEVBQUUsa0JBQWtCO1lBQzVCLGNBQWMsRUFBRSw2QkFBb0IsRUFBRTtZQUN0QyxNQUFNLEVBQUUsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDO1NBQ3RCLENBQUMsQ0FBQzs7Ozs7OytDQVhNLDRCQUE0Qjs7OztRQWFyQyxJQUFJLENBQUMsZUFBZSxHQUFHLEtBQUssQ0FBQyxlQUFlLENBQUM7UUFDN0MsSUFBSSxDQUFDLGVBQWUsR0FBRyxLQUFLLENBQUMsZUFBZSxDQUFDO0tBQzlDO0lBRVMsS0FBSyxDQUNiLE1BQWlCLEVBQ2pCLE1BQTJCLEVBQzNCLE9BQXVDO1FBR3ZDLGdHQUFnRztRQUNoRyw4RUFBOEU7UUFDOUUsT0FBTyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxFQUFFLGdCQUFnQixFQUFFLGlFQUFpRSxFQUFFLENBQUMsQ0FBQztRQUV2SCxtRUFBbUU7UUFDbkUsT0FBTyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRXZDLE9BQU87WUFDTCxhQUFhLEVBQUU7Z0JBQ2IsZUFBZSxFQUFFLElBQUksQ0FBQyxlQUFlO2dCQUNyQyxlQUFlLEVBQUUsSUFBSSxDQUFDLGVBQWU7YUFDdEM7U0FDRixDQUFDO0tBQ0g7O0FBcENILG9FQXFDQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNvZGVwaXBlbGluZSBmcm9tICdAYXdzLWNkay9hd3MtY29kZXBpcGVsaW5lJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0IHsgQWN0aW9uIH0gZnJvbSAnLi4vYWN0aW9uJztcbmltcG9ydCB7IGRlcGxveUFydGlmYWN0Qm91bmRzIH0gZnJvbSAnLi4vY29tbW9uJztcblxuLyoqXG4gKiBDb25zdHJ1Y3Rpb24gcHJvcGVydGllcyBvZiB0aGUgYEVsYXN0aWNCZWFuc3RhbGtEZXBsb3lBY3Rpb24gRWxhc3RpYyBCZWFuc3RhbGsgZGVwbG95IENvZGVQaXBlbGluZSBBY3Rpb25gLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIEVsYXN0aWNCZWFuc3RhbGtEZXBsb3lBY3Rpb25Qcm9wcyBleHRlbmRzIGNvZGVwaXBlbGluZS5Db21tb25Bd3NBY3Rpb25Qcm9wcyB7XG4gIC8qKlxuICAgKiBUaGUgc291cmNlIHRvIHVzZSBhcyBpbnB1dCBmb3IgZGVwbG95bWVudC5cbiAgICovXG4gIHJlYWRvbmx5IGlucHV0OiBjb2RlcGlwZWxpbmUuQXJ0aWZhY3Q7XG5cbiAgLyoqXG4gICAqIFRoZSBuYW1lIG9mIHRoZSBBV1MgRWxhc3RpYyBCZWFuc3RhbGsgYXBwbGljYXRpb24gdG8gZGVwbG95LlxuICAgKi9cbiAgcmVhZG9ubHkgYXBwbGljYXRpb25OYW1lOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBuYW1lIG9mIHRoZSBBV1MgRWxhc3RpYyBCZWFuc3RhbGsgZW52aXJvbm1lbnQgdG8gZGVwbG95IHRvLlxuICAgKi9cbiAgcmVhZG9ubHkgZW52aXJvbm1lbnROYW1lOiBzdHJpbmc7XG59XG5cbi8qKlxuICogQ29kZVBpcGVsaW5lIGFjdGlvbiB0byBkZXBsb3kgYW4gQVdTIEVsYXN0aWNCZWFuc3RhbGsgQXBwbGljYXRpb24uXG4gKi9cbmV4cG9ydCBjbGFzcyBFbGFzdGljQmVhbnN0YWxrRGVwbG95QWN0aW9uIGV4dGVuZHMgQWN0aW9uIHtcbiAgcHJpdmF0ZSByZWFkb25seSBhcHBsaWNhdGlvbk5hbWU6IHN0cmluZztcbiAgcHJpdmF0ZSByZWFkb25seSBlbnZpcm9ubWVudE5hbWU6IHN0cmluZztcblxuICBjb25zdHJ1Y3Rvcihwcm9wczogRWxhc3RpY0JlYW5zdGFsa0RlcGxveUFjdGlvblByb3BzKSB7XG4gICAgc3VwZXIoe1xuICAgICAgLi4ucHJvcHMsXG4gICAgICBjYXRlZ29yeTogY29kZXBpcGVsaW5lLkFjdGlvbkNhdGVnb3J5LkRFUExPWSxcbiAgICAgIHByb3ZpZGVyOiAnRWxhc3RpY0JlYW5zdGFsaycsXG4gICAgICBhcnRpZmFjdEJvdW5kczogZGVwbG95QXJ0aWZhY3RCb3VuZHMoKSxcbiAgICAgIGlucHV0czogW3Byb3BzLmlucHV0XSxcbiAgICB9KTtcblxuICAgIHRoaXMuYXBwbGljYXRpb25OYW1lID0gcHJvcHMuYXBwbGljYXRpb25OYW1lO1xuICAgIHRoaXMuZW52aXJvbm1lbnROYW1lID0gcHJvcHMuZW52aXJvbm1lbnROYW1lO1xuICB9XG5cbiAgcHJvdGVjdGVkIGJvdW5kKFxuICAgIF9zY29wZTogQ29uc3RydWN0LFxuICAgIF9zdGFnZTogY29kZXBpcGVsaW5lLklTdGFnZSxcbiAgICBvcHRpb25zOiBjb2RlcGlwZWxpbmUuQWN0aW9uQmluZE9wdGlvbnMsXG4gICk6IGNvZGVwaXBlbGluZS5BY3Rpb25Db25maWcge1xuXG4gICAgLy8gUGVyIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9lbGFzdGljYmVhbnN0YWxrL2xhdGVzdC9kZy9BV1NIb3dUby5pYW0ubWFuYWdlZC1wb2xpY2llcy5odG1sXG4gICAgLy8gaXQgZG9lc24ndCBzZWVtIHdlIGNhbiBzY29wZSB0aGlzIGRvd24gZnVydGhlciBmb3IgdGhlIGNvZGVwaXBlbGluZSBhY3Rpb24uXG4gICAgb3B0aW9ucy5yb2xlLmFkZE1hbmFnZWRQb2xpY3koeyBtYW5hZ2VkUG9saWN5QXJuOiAnYXJuOmF3czppYW06OmF3czpwb2xpY3kvQWRtaW5pc3RyYXRvckFjY2Vzcy1BV1NFbGFzdGljQmVhbnN0YWxrJyB9KTtcblxuICAgIC8vIHRoZSBBY3Rpb24ncyBSb2xlIG5lZWRzIHRvIHJlYWQgZnJvbSB0aGUgQnVja2V0IHRvIGdldCBhcnRpZmFjdHNcbiAgICBvcHRpb25zLmJ1Y2tldC5ncmFudFJlYWQob3B0aW9ucy5yb2xlKTtcblxuICAgIHJldHVybiB7XG4gICAgICBjb25maWd1cmF0aW9uOiB7XG4gICAgICAgIEFwcGxpY2F0aW9uTmFtZTogdGhpcy5hcHBsaWNhdGlvbk5hbWUsXG4gICAgICAgIEVudmlyb25tZW50TmFtZTogdGhpcy5lbnZpcm9ubWVudE5hbWUsXG4gICAgICB9LFxuICAgIH07XG4gIH1cbn1cbiJdfQ==