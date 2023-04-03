"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.JenkinsAction = exports.JenkinsActionType = void 0;
const jsiiDeprecationWarnings = require("../../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const codepipeline = require("@aws-cdk/aws-codepipeline");
const jenkins_provider_1 = require("./jenkins-provider");
const action_1 = require("../action");
/**
 * The type of the Jenkins Action that determines its CodePipeline Category -
 * Build, or Test.
 * Note that a Jenkins provider, even if it has the same name,
 * must be separately registered for each type.
 */
var JenkinsActionType;
(function (JenkinsActionType) {
    /**
     * The Action will have the Build Category.
     */
    JenkinsActionType[JenkinsActionType["BUILD"] = 0] = "BUILD";
    /**
     * The Action will have the Test Category.
     */
    JenkinsActionType[JenkinsActionType["TEST"] = 1] = "TEST";
})(JenkinsActionType = exports.JenkinsActionType || (exports.JenkinsActionType = {}));
/**
 * Jenkins build CodePipeline Action.
 *
 * @see https://docs.aws.amazon.com/codepipeline/latest/userguide/tutorials-four-stage-pipeline.html
 */
class JenkinsAction extends action_1.Action {
    constructor(props) {
        super({
            ...props,
            category: props.type === JenkinsActionType.BUILD
                ? codepipeline.ActionCategory.BUILD
                : codepipeline.ActionCategory.TEST,
            provider: props.jenkinsProvider.providerName,
            owner: 'Custom',
            artifactBounds: jenkins_provider_1.jenkinsArtifactsBounds,
            version: props.jenkinsProvider.version,
        });
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_codepipeline_actions_JenkinsActionProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, JenkinsAction);
            }
            throw error;
        }
        this.props = props;
    }
    bound(_scope, _stage, _options) {
        if (this.actionProperties.category === codepipeline.ActionCategory.BUILD) {
            this.props.jenkinsProvider._registerBuildProvider();
        }
        else {
            this.props.jenkinsProvider._registerTestProvider();
        }
        return {
            configuration: {
                ProjectName: this.props.projectName,
            },
        };
    }
}
exports.JenkinsAction = JenkinsAction;
_a = JSII_RTTI_SYMBOL_1;
JenkinsAction[_a] = { fqn: "@aws-cdk/aws-codepipeline-actions.JenkinsAction", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiamVua2lucy1hY3Rpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJqZW5raW5zLWFjdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSwwREFBMEQ7QUFFMUQseURBQThFO0FBQzlFLHNDQUFtQztBQUVuQzs7Ozs7R0FLRztBQUNILElBQVksaUJBVVg7QUFWRCxXQUFZLGlCQUFpQjtJQUMzQjs7T0FFRztJQUNILDJEQUFLLENBQUE7SUFFTDs7T0FFRztJQUNILHlEQUFJLENBQUE7QUFDTixDQUFDLEVBVlcsaUJBQWlCLEdBQWpCLHlCQUFpQixLQUFqQix5QkFBaUIsUUFVNUI7QUFtQ0Q7Ozs7R0FJRztBQUNILE1BQWEsYUFBYyxTQUFRLGVBQU07SUFHdkMsWUFBWSxLQUF5QjtRQUNuQyxLQUFLLENBQUM7WUFDSixHQUFHLEtBQUs7WUFDUixRQUFRLEVBQUUsS0FBSyxDQUFDLElBQUksS0FBSyxpQkFBaUIsQ0FBQyxLQUFLO2dCQUM5QyxDQUFDLENBQUMsWUFBWSxDQUFDLGNBQWMsQ0FBQyxLQUFLO2dCQUNuQyxDQUFDLENBQUMsWUFBWSxDQUFDLGNBQWMsQ0FBQyxJQUFJO1lBQ3BDLFFBQVEsRUFBRSxLQUFLLENBQUMsZUFBZSxDQUFDLFlBQVk7WUFDNUMsS0FBSyxFQUFFLFFBQVE7WUFDZixjQUFjLEVBQUUseUNBQXNCO1lBQ3RDLE9BQU8sRUFBRSxLQUFLLENBQUMsZUFBZSxDQUFDLE9BQU87U0FDdkMsQ0FBQyxDQUFDOzs7Ozs7K0NBYk0sYUFBYTs7OztRQWV0QixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztLQUNwQjtJQUVTLEtBQUssQ0FBQyxNQUFpQixFQUFFLE1BQTJCLEVBQUUsUUFBd0M7UUFFdEcsSUFBSSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxLQUFLLFlBQVksQ0FBQyxjQUFjLENBQUMsS0FBSyxFQUFFO1lBQ3hFLElBQUksQ0FBQyxLQUFLLENBQUMsZUFBZSxDQUFDLHNCQUFzQixFQUFFLENBQUM7U0FDckQ7YUFBTTtZQUNMLElBQUksQ0FBQyxLQUFLLENBQUMsZUFBZSxDQUFDLHFCQUFxQixFQUFFLENBQUM7U0FDcEQ7UUFFRCxPQUFPO1lBQ0wsYUFBYSxFQUFFO2dCQUNiLFdBQVcsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVc7YUFDcEM7U0FDRixDQUFDO0tBQ0g7O0FBL0JILHNDQWdDQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNvZGVwaXBlbGluZSBmcm9tICdAYXdzLWNkay9hd3MtY29kZXBpcGVsaW5lJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0IHsgSUplbmtpbnNQcm92aWRlciwgamVua2luc0FydGlmYWN0c0JvdW5kcyB9IGZyb20gJy4vamVua2lucy1wcm92aWRlcic7XG5pbXBvcnQgeyBBY3Rpb24gfSBmcm9tICcuLi9hY3Rpb24nO1xuXG4vKipcbiAqIFRoZSB0eXBlIG9mIHRoZSBKZW5raW5zIEFjdGlvbiB0aGF0IGRldGVybWluZXMgaXRzIENvZGVQaXBlbGluZSBDYXRlZ29yeSAtXG4gKiBCdWlsZCwgb3IgVGVzdC5cbiAqIE5vdGUgdGhhdCBhIEplbmtpbnMgcHJvdmlkZXIsIGV2ZW4gaWYgaXQgaGFzIHRoZSBzYW1lIG5hbWUsXG4gKiBtdXN0IGJlIHNlcGFyYXRlbHkgcmVnaXN0ZXJlZCBmb3IgZWFjaCB0eXBlLlxuICovXG5leHBvcnQgZW51bSBKZW5raW5zQWN0aW9uVHlwZSB7XG4gIC8qKlxuICAgKiBUaGUgQWN0aW9uIHdpbGwgaGF2ZSB0aGUgQnVpbGQgQ2F0ZWdvcnkuXG4gICAqL1xuICBCVUlMRCxcblxuICAvKipcbiAgICogVGhlIEFjdGlvbiB3aWxsIGhhdmUgdGhlIFRlc3QgQ2F0ZWdvcnkuXG4gICAqL1xuICBURVNUXG59XG5cbi8qKlxuICogQ29uc3RydWN0aW9uIHByb3BlcnRpZXMgb2YgYEplbmtpbnNBY3Rpb25gLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIEplbmtpbnNBY3Rpb25Qcm9wcyBleHRlbmRzIGNvZGVwaXBlbGluZS5Db21tb25BY3Rpb25Qcm9wcyB7XG4gIC8qKlxuICAgKiBUaGUgc291cmNlIHRvIHVzZSBhcyBpbnB1dCBmb3IgdGhpcyBidWlsZC5cbiAgICovXG4gIHJlYWRvbmx5IGlucHV0cz86IGNvZGVwaXBlbGluZS5BcnRpZmFjdFtdO1xuXG4gIC8qKlxuICAgKlxuICAgKi9cbiAgcmVhZG9ubHkgb3V0cHV0cz86IGNvZGVwaXBlbGluZS5BcnRpZmFjdFtdO1xuXG4gIC8qKlxuICAgKiBUaGUgSmVua2lucyBQcm92aWRlciBmb3IgdGhpcyBBY3Rpb24uXG4gICAqL1xuICByZWFkb25seSBqZW5raW5zUHJvdmlkZXI6IElKZW5raW5zUHJvdmlkZXI7XG5cbiAgLyoqXG4gICAqIFRoZSBuYW1lIG9mIHRoZSBwcm9qZWN0IChzb21ldGltZXMgYWxzbyBjYWxsZWQgam9iLCBvciB0YXNrKVxuICAgKiBvbiB5b3VyIEplbmtpbnMgaW5zdGFsbGF0aW9uIHRoYXQgd2lsbCBiZSBpbnZva2VkIGJ5IHRoaXMgQWN0aW9uLlxuICAgKlxuICAgKiBAZXhhbXBsZSAnTXlKb2InXG4gICAqL1xuICByZWFkb25seSBwcm9qZWN0TmFtZTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgdHlwZSBvZiB0aGUgQWN0aW9uIC0gQnVpbGQsIG9yIFRlc3QuXG4gICAqL1xuICByZWFkb25seSB0eXBlOiBKZW5raW5zQWN0aW9uVHlwZTtcbn1cblxuLyoqXG4gKiBKZW5raW5zIGJ1aWxkIENvZGVQaXBlbGluZSBBY3Rpb24uXG4gKlxuICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vY29kZXBpcGVsaW5lL2xhdGVzdC91c2VyZ3VpZGUvdHV0b3JpYWxzLWZvdXItc3RhZ2UtcGlwZWxpbmUuaHRtbFxuICovXG5leHBvcnQgY2xhc3MgSmVua2luc0FjdGlvbiBleHRlbmRzIEFjdGlvbiB7XG4gIHByaXZhdGUgcmVhZG9ubHkgcHJvcHM6IEplbmtpbnNBY3Rpb25Qcm9wcztcblxuICBjb25zdHJ1Y3Rvcihwcm9wczogSmVua2luc0FjdGlvblByb3BzKSB7XG4gICAgc3VwZXIoe1xuICAgICAgLi4ucHJvcHMsXG4gICAgICBjYXRlZ29yeTogcHJvcHMudHlwZSA9PT0gSmVua2luc0FjdGlvblR5cGUuQlVJTERcbiAgICAgICAgPyBjb2RlcGlwZWxpbmUuQWN0aW9uQ2F0ZWdvcnkuQlVJTERcbiAgICAgICAgOiBjb2RlcGlwZWxpbmUuQWN0aW9uQ2F0ZWdvcnkuVEVTVCxcbiAgICAgIHByb3ZpZGVyOiBwcm9wcy5qZW5raW5zUHJvdmlkZXIucHJvdmlkZXJOYW1lLFxuICAgICAgb3duZXI6ICdDdXN0b20nLFxuICAgICAgYXJ0aWZhY3RCb3VuZHM6IGplbmtpbnNBcnRpZmFjdHNCb3VuZHMsXG4gICAgICB2ZXJzaW9uOiBwcm9wcy5qZW5raW5zUHJvdmlkZXIudmVyc2lvbixcbiAgICB9KTtcblxuICAgIHRoaXMucHJvcHMgPSBwcm9wcztcbiAgfVxuXG4gIHByb3RlY3RlZCBib3VuZChfc2NvcGU6IENvbnN0cnVjdCwgX3N0YWdlOiBjb2RlcGlwZWxpbmUuSVN0YWdlLCBfb3B0aW9uczogY29kZXBpcGVsaW5lLkFjdGlvbkJpbmRPcHRpb25zKTpcbiAgY29kZXBpcGVsaW5lLkFjdGlvbkNvbmZpZyB7XG4gICAgaWYgKHRoaXMuYWN0aW9uUHJvcGVydGllcy5jYXRlZ29yeSA9PT0gY29kZXBpcGVsaW5lLkFjdGlvbkNhdGVnb3J5LkJVSUxEKSB7XG4gICAgICB0aGlzLnByb3BzLmplbmtpbnNQcm92aWRlci5fcmVnaXN0ZXJCdWlsZFByb3ZpZGVyKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMucHJvcHMuamVua2luc1Byb3ZpZGVyLl9yZWdpc3RlclRlc3RQcm92aWRlcigpO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICBjb25maWd1cmF0aW9uOiB7XG4gICAgICAgIFByb2plY3ROYW1lOiB0aGlzLnByb3BzLnByb2plY3ROYW1lLFxuICAgICAgfSxcbiAgICB9O1xuICB9XG59XG4iXX0=