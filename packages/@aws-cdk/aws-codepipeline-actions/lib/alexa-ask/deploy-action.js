"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlexaSkillDeployAction = void 0;
const jsiiDeprecationWarnings = require("../../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const codepipeline = require("@aws-cdk/aws-codepipeline");
const action_1 = require("../action");
/**
 * Deploys the skill to Alexa
 */
class AlexaSkillDeployAction extends action_1.Action {
    constructor(props) {
        super({
            ...props,
            category: codepipeline.ActionCategory.DEPLOY,
            owner: 'ThirdParty',
            provider: 'AlexaSkillsKit',
            artifactBounds: {
                minInputs: 1,
                maxInputs: 2,
                minOutputs: 0,
                maxOutputs: 0,
            },
            inputs: getInputs(props),
        });
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_codepipeline_actions_AlexaSkillDeployActionProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, AlexaSkillDeployAction);
            }
            throw error;
        }
        this.props = props;
    }
    bound(_scope, _stage, _options) {
        return {
            configuration: {
                ClientId: this.props.clientId,
                ClientSecret: this.props.clientSecret.unsafeUnwrap(),
                RefreshToken: this.props.refreshToken.unsafeUnwrap(),
                SkillId: this.props.skillId,
            },
        };
    }
}
exports.AlexaSkillDeployAction = AlexaSkillDeployAction;
_a = JSII_RTTI_SYMBOL_1;
AlexaSkillDeployAction[_a] = { fqn: "@aws-cdk/aws-codepipeline-actions.AlexaSkillDeployAction", version: "0.0.0" };
function getInputs(props) {
    const ret = [props.input];
    if (props.parameterOverridesArtifact) {
        ret.push(props.parameterOverridesArtifact);
    }
    return ret;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVwbG95LWFjdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRlcGxveS1hY3Rpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsMERBQTBEO0FBRzFELHNDQUFtQztBQXFDbkM7O0dBRUc7QUFDSCxNQUFhLHNCQUF1QixTQUFRLGVBQU07SUFHaEQsWUFBWSxLQUFrQztRQUM1QyxLQUFLLENBQUM7WUFDSixHQUFHLEtBQUs7WUFDUixRQUFRLEVBQUUsWUFBWSxDQUFDLGNBQWMsQ0FBQyxNQUFNO1lBQzVDLEtBQUssRUFBRSxZQUFZO1lBQ25CLFFBQVEsRUFBRSxnQkFBZ0I7WUFDMUIsY0FBYyxFQUFFO2dCQUNkLFNBQVMsRUFBRSxDQUFDO2dCQUNaLFNBQVMsRUFBRSxDQUFDO2dCQUNaLFVBQVUsRUFBRSxDQUFDO2dCQUNiLFVBQVUsRUFBRSxDQUFDO2FBQ2Q7WUFDRCxNQUFNLEVBQUUsU0FBUyxDQUFDLEtBQUssQ0FBQztTQUN6QixDQUFDLENBQUM7Ozs7OzsrQ0FoQk0sc0JBQXNCOzs7O1FBa0IvQixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztLQUNwQjtJQUVTLEtBQUssQ0FBQyxNQUFpQixFQUFFLE1BQTJCLEVBQUUsUUFBd0M7UUFFdEcsT0FBTztZQUNMLGFBQWEsRUFBRTtnQkFDYixRQUFRLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRO2dCQUM3QixZQUFZLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsWUFBWSxFQUFFO2dCQUNwRCxZQUFZLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsWUFBWSxFQUFFO2dCQUNwRCxPQUFPLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPO2FBQzVCO1NBQ0YsQ0FBQztLQUNIOztBQS9CSCx3REFnQ0M7OztBQUVELFNBQVMsU0FBUyxDQUFDLEtBQWtDO0lBQ25ELE1BQU0sR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQzFCLElBQUksS0FBSyxDQUFDLDBCQUEwQixFQUFFO1FBQ3BDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLDBCQUEwQixDQUFDLENBQUM7S0FDNUM7SUFDRCxPQUFPLEdBQUcsQ0FBQztBQUNiLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBjb2RlcGlwZWxpbmUgZnJvbSAnQGF3cy1jZGsvYXdzLWNvZGVwaXBlbGluZSc7XG5pbXBvcnQgeyBTZWNyZXRWYWx1ZSB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgeyBBY3Rpb24gfSBmcm9tICcuLi9hY3Rpb24nO1xuXG4vKipcbiAqIENvbnN0cnVjdGlvbiBwcm9wZXJ0aWVzIG9mIHRoZSBgQWxleGFTa2lsbERlcGxveUFjdGlvbiBBbGV4YSBkZXBsb3kgQWN0aW9uYC5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBBbGV4YVNraWxsRGVwbG95QWN0aW9uUHJvcHMgZXh0ZW5kcyBjb2RlcGlwZWxpbmUuQ29tbW9uQWN0aW9uUHJvcHMge1xuICAvKipcbiAgICogVGhlIGNsaWVudCBpZCBvZiB0aGUgZGV2ZWxvcGVyIGNvbnNvbGUgdG9rZW5cbiAgICovXG4gIHJlYWRvbmx5IGNsaWVudElkOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBjbGllbnQgc2VjcmV0IG9mIHRoZSBkZXZlbG9wZXIgY29uc29sZSB0b2tlblxuICAgKi9cbiAgcmVhZG9ubHkgY2xpZW50U2VjcmV0OiBTZWNyZXRWYWx1ZTtcblxuICAvKipcbiAgICogVGhlIHJlZnJlc2ggdG9rZW4gb2YgdGhlIGRldmVsb3BlciBjb25zb2xlIHRva2VuXG4gICAqL1xuICByZWFkb25seSByZWZyZXNoVG9rZW46IFNlY3JldFZhbHVlO1xuXG4gIC8qKlxuICAgKiBUaGUgQWxleGEgc2tpbGwgaWRcbiAgICovXG4gIHJlYWRvbmx5IHNraWxsSWQ6IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIHNvdXJjZSBhcnRpZmFjdCBjb250YWluaW5nIHRoZSB2b2ljZSBtb2RlbCBhbmQgc2tpbGwgbWFuaWZlc3RcbiAgICovXG4gIHJlYWRvbmx5IGlucHV0OiBjb2RlcGlwZWxpbmUuQXJ0aWZhY3Q7XG5cbiAgLyoqXG4gICAqIEFuIG9wdGlvbmFsIGFydGlmYWN0IGNvbnRhaW5pbmcgb3ZlcnJpZGVzIGZvciB0aGUgc2tpbGwgbWFuaWZlc3RcbiAgICovXG4gIHJlYWRvbmx5IHBhcmFtZXRlck92ZXJyaWRlc0FydGlmYWN0PzogY29kZXBpcGVsaW5lLkFydGlmYWN0O1xufVxuXG4vKipcbiAqIERlcGxveXMgdGhlIHNraWxsIHRvIEFsZXhhXG4gKi9cbmV4cG9ydCBjbGFzcyBBbGV4YVNraWxsRGVwbG95QWN0aW9uIGV4dGVuZHMgQWN0aW9uIHtcbiAgcHJpdmF0ZSByZWFkb25seSBwcm9wczogQWxleGFTa2lsbERlcGxveUFjdGlvblByb3BzO1xuXG4gIGNvbnN0cnVjdG9yKHByb3BzOiBBbGV4YVNraWxsRGVwbG95QWN0aW9uUHJvcHMpIHtcbiAgICBzdXBlcih7XG4gICAgICAuLi5wcm9wcyxcbiAgICAgIGNhdGVnb3J5OiBjb2RlcGlwZWxpbmUuQWN0aW9uQ2F0ZWdvcnkuREVQTE9ZLFxuICAgICAgb3duZXI6ICdUaGlyZFBhcnR5JyxcbiAgICAgIHByb3ZpZGVyOiAnQWxleGFTa2lsbHNLaXQnLFxuICAgICAgYXJ0aWZhY3RCb3VuZHM6IHtcbiAgICAgICAgbWluSW5wdXRzOiAxLFxuICAgICAgICBtYXhJbnB1dHM6IDIsXG4gICAgICAgIG1pbk91dHB1dHM6IDAsXG4gICAgICAgIG1heE91dHB1dHM6IDAsXG4gICAgICB9LFxuICAgICAgaW5wdXRzOiBnZXRJbnB1dHMocHJvcHMpLFxuICAgIH0pO1xuXG4gICAgdGhpcy5wcm9wcyA9IHByb3BzO1xuICB9XG5cbiAgcHJvdGVjdGVkIGJvdW5kKF9zY29wZTogQ29uc3RydWN0LCBfc3RhZ2U6IGNvZGVwaXBlbGluZS5JU3RhZ2UsIF9vcHRpb25zOiBjb2RlcGlwZWxpbmUuQWN0aW9uQmluZE9wdGlvbnMpOlxuICBjb2RlcGlwZWxpbmUuQWN0aW9uQ29uZmlnIHtcbiAgICByZXR1cm4ge1xuICAgICAgY29uZmlndXJhdGlvbjoge1xuICAgICAgICBDbGllbnRJZDogdGhpcy5wcm9wcy5jbGllbnRJZCxcbiAgICAgICAgQ2xpZW50U2VjcmV0OiB0aGlzLnByb3BzLmNsaWVudFNlY3JldC51bnNhZmVVbndyYXAoKSwgLy8gU2FmZSB1c2FnZVxuICAgICAgICBSZWZyZXNoVG9rZW46IHRoaXMucHJvcHMucmVmcmVzaFRva2VuLnVuc2FmZVVud3JhcCgpLCAvLyBTYWZlIHVzYWdlXG4gICAgICAgIFNraWxsSWQ6IHRoaXMucHJvcHMuc2tpbGxJZCxcbiAgICAgIH0sXG4gICAgfTtcbiAgfVxufVxuXG5mdW5jdGlvbiBnZXRJbnB1dHMocHJvcHM6IEFsZXhhU2tpbGxEZXBsb3lBY3Rpb25Qcm9wcyk6IGNvZGVwaXBlbGluZS5BcnRpZmFjdFtdIHtcbiAgY29uc3QgcmV0ID0gW3Byb3BzLmlucHV0XTtcbiAgaWYgKHByb3BzLnBhcmFtZXRlck92ZXJyaWRlc0FydGlmYWN0KSB7XG4gICAgcmV0LnB1c2gocHJvcHMucGFyYW1ldGVyT3ZlcnJpZGVzQXJ0aWZhY3QpO1xuICB9XG4gIHJldHVybiByZXQ7XG59XG4iXX0=