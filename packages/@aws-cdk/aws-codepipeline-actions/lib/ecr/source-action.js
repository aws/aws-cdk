"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EcrSourceAction = void 0;
const jsiiDeprecationWarnings = require("../../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const codepipeline = require("@aws-cdk/aws-codepipeline");
const aws_events_1 = require("@aws-cdk/aws-events");
const targets = require("@aws-cdk/aws-events-targets");
const iam = require("@aws-cdk/aws-iam");
const core_1 = require("@aws-cdk/core");
const action_1 = require("../action");
const common_1 = require("../common");
/**
 * The ECR Repository source CodePipeline Action.
 *
 * Will trigger the pipeline as soon as the target tag in the repository
 * changes, but only if there is a CloudTrail Trail in the account that
 * captures the ECR event.
 */
class EcrSourceAction extends action_1.Action {
    constructor(props) {
        super({
            ...props,
            resource: props.repository,
            category: codepipeline.ActionCategory.SOURCE,
            provider: 'ECR',
            artifactBounds: common_1.sourceArtifactBounds(),
            outputs: [props.output],
        });
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_codepipeline_actions_EcrSourceActionProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, EcrSourceAction);
            }
            throw error;
        }
        this.props = props;
    }
    /** The variables emitted by this action. */
    get variables() {
        return {
            registryId: this.variableExpression('RegistryId'),
            repositoryName: this.variableExpression('RepositoryName'),
            imageDigest: this.variableExpression('ImageDigest'),
            imageTag: this.variableExpression('ImageTag'),
            imageUri: this.variableExpression('ImageURI'),
        };
    }
    bound(scope, stage, options) {
        options.role.addToPolicy(new iam.PolicyStatement({
            actions: ['ecr:DescribeImages'],
            resources: [this.props.repository.repositoryArn],
        }));
        new aws_events_1.Rule(scope, core_1.Names.nodeUniqueId(stage.pipeline.node) + 'SourceEventRule', {
            targets: [
                new targets.CodePipeline(stage.pipeline),
            ],
            eventPattern: {
                detailType: ['ECR Image Action'],
                source: ['aws.ecr'],
                detail: {
                    'result': ['SUCCESS'],
                    'repository-name': [this.props.repository.repositoryName],
                    'image-tag': [this.props.imageTag === '' ? undefined : (this.props.imageTag ?? 'latest')],
                    'action-type': ['PUSH'],
                },
            },
        });
        // the Action Role also needs to write to the Pipeline's bucket
        options.bucket.grantWrite(options.role);
        return {
            configuration: {
                RepositoryName: this.props.repository.repositoryName,
                ImageTag: this.props.imageTag ? this.props.imageTag : undefined,
            },
        };
    }
}
exports.EcrSourceAction = EcrSourceAction;
_a = JSII_RTTI_SYMBOL_1;
EcrSourceAction[_a] = { fqn: "@aws-cdk/aws-codepipeline-actions.EcrSourceAction", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic291cmNlLWFjdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInNvdXJjZS1hY3Rpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsMERBQTBEO0FBRTFELG9EQUEyQztBQUMzQyx1REFBdUQ7QUFDdkQsd0NBQXdDO0FBQ3hDLHdDQUFzQztBQUV0QyxzQ0FBbUM7QUFDbkMsc0NBQWlEO0FBOENqRDs7Ozs7O0dBTUc7QUFDSCxNQUFhLGVBQWdCLFNBQVEsZUFBTTtJQUd6QyxZQUFZLEtBQTJCO1FBQ3JDLEtBQUssQ0FBQztZQUNKLEdBQUcsS0FBSztZQUNSLFFBQVEsRUFBRSxLQUFLLENBQUMsVUFBVTtZQUMxQixRQUFRLEVBQUUsWUFBWSxDQUFDLGNBQWMsQ0FBQyxNQUFNO1lBQzVDLFFBQVEsRUFBRSxLQUFLO1lBQ2YsY0FBYyxFQUFFLDZCQUFvQixFQUFFO1lBQ3RDLE9BQU8sRUFBRSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUM7U0FDeEIsQ0FBQyxDQUFDOzs7Ozs7K0NBWE0sZUFBZTs7OztRQWF4QixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztLQUNwQjtJQUVELDRDQUE0QztJQUM1QyxJQUFXLFNBQVM7UUFDbEIsT0FBTztZQUNMLFVBQVUsRUFBRSxJQUFJLENBQUMsa0JBQWtCLENBQUMsWUFBWSxDQUFDO1lBQ2pELGNBQWMsRUFBRSxJQUFJLENBQUMsa0JBQWtCLENBQUMsZ0JBQWdCLENBQUM7WUFDekQsV0FBVyxFQUFFLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxhQUFhLENBQUM7WUFDbkQsUUFBUSxFQUFFLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxVQUFVLENBQUM7WUFDN0MsUUFBUSxFQUFFLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxVQUFVLENBQUM7U0FDOUMsQ0FBQztLQUNIO0lBRVMsS0FBSyxDQUFDLEtBQWdCLEVBQUUsS0FBMEIsRUFBRSxPQUF1QztRQUVuRyxPQUFPLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxlQUFlLENBQUM7WUFDL0MsT0FBTyxFQUFFLENBQUMsb0JBQW9CLENBQUM7WUFDL0IsU0FBUyxFQUFFLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFDO1NBQ2pELENBQUMsQ0FBQyxDQUFDO1FBRUosSUFBSSxpQkFBSSxDQUFDLEtBQUssRUFBRSxZQUFLLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEdBQUcsaUJBQWlCLEVBQUU7WUFDM0UsT0FBTyxFQUFFO2dCQUNQLElBQUksT0FBTyxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDO2FBQ3pDO1lBQ0QsWUFBWSxFQUFFO2dCQUNaLFVBQVUsRUFBRSxDQUFDLGtCQUFrQixDQUFDO2dCQUNoQyxNQUFNLEVBQUUsQ0FBQyxTQUFTLENBQUM7Z0JBQ25CLE1BQU0sRUFBRTtvQkFDTixRQUFRLEVBQUUsQ0FBQyxTQUFTLENBQUM7b0JBQ3JCLGlCQUFpQixFQUFFLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsY0FBYyxDQUFDO29CQUN6RCxXQUFXLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsSUFBSSxRQUFRLENBQUMsQ0FBQztvQkFDekYsYUFBYSxFQUFFLENBQUMsTUFBTSxDQUFDO2lCQUN4QjthQUNGO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsK0RBQStEO1FBQy9ELE9BQU8sQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUV4QyxPQUFPO1lBQ0wsYUFBYSxFQUFFO2dCQUNiLGNBQWMsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxjQUFjO2dCQUNwRCxRQUFRLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxTQUFTO2FBQ2hFO1NBQ0YsQ0FBQztLQUNIOztBQTNESCwwQ0E0REMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBjb2RlcGlwZWxpbmUgZnJvbSAnQGF3cy1jZGsvYXdzLWNvZGVwaXBlbGluZSc7XG5pbXBvcnQgKiBhcyBlY3IgZnJvbSAnQGF3cy1jZGsvYXdzLWVjcic7XG5pbXBvcnQgeyBSdWxlIH0gZnJvbSAnQGF3cy1jZGsvYXdzLWV2ZW50cyc7XG5pbXBvcnQgKiBhcyB0YXJnZXRzIGZyb20gJ0Bhd3MtY2RrL2F3cy1ldmVudHMtdGFyZ2V0cyc7XG5pbXBvcnQgKiBhcyBpYW0gZnJvbSAnQGF3cy1jZGsvYXdzLWlhbSc7XG5pbXBvcnQgeyBOYW1lcyB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgeyBBY3Rpb24gfSBmcm9tICcuLi9hY3Rpb24nO1xuaW1wb3J0IHsgc291cmNlQXJ0aWZhY3RCb3VuZHMgfSBmcm9tICcuLi9jb21tb24nO1xuXG4vKipcbiAqIFRoZSBDb2RlUGlwZWxpbmUgdmFyaWFibGVzIGVtaXR0ZWQgYnkgdGhlIEVDUiBzb3VyY2UgQWN0aW9uLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIEVjclNvdXJjZVZhcmlhYmxlcyB7XG4gIC8qKiBUaGUgaWRlbnRpZmllciBvZiB0aGUgcmVnaXN0cnkuIEluIEVDUiwgdGhpcyBpcyB1c3VhbGx5IHRoZSBJRCBvZiB0aGUgQVdTIGFjY291bnQgb3duaW5nIGl0LiAqL1xuICByZWFkb25seSByZWdpc3RyeUlkOiBzdHJpbmc7XG5cbiAgLyoqIFRoZSBwaHlzaWNhbCBuYW1lIG9mIHRoZSByZXBvc2l0b3J5IHRoYXQgdGhpcyBhY3Rpb24gdHJhY2tzLiAqL1xuICByZWFkb25seSByZXBvc2l0b3J5TmFtZTogc3RyaW5nO1xuXG4gIC8qKiBUaGUgZGlnZXN0IG9mIHRoZSBjdXJyZW50IGltYWdlLCBpbiB0aGUgZm9ybSAnPGRpZ2VzdCB0eXBlPjo8ZGlnZXN0IHZhbHVlPicuICovXG4gIHJlYWRvbmx5IGltYWdlRGlnZXN0OiBzdHJpbmc7XG5cbiAgLyoqIFRoZSBEb2NrZXIgdGFnIG9mIHRoZSBjdXJyZW50IGltYWdlLiAqL1xuICByZWFkb25seSBpbWFnZVRhZzogc3RyaW5nO1xuXG4gIC8qKiBUaGUgZnVsbCBFQ1IgRG9ja2VyIFVSSSBvZiB0aGUgY3VycmVudCBpbWFnZS4gKi9cbiAgcmVhZG9ubHkgaW1hZ2VVcmk6IHN0cmluZztcbn1cblxuLyoqXG4gKiBDb25zdHJ1Y3Rpb24gcHJvcGVydGllcyBvZiBgRWNyU291cmNlQWN0aW9uYC5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBFY3JTb3VyY2VBY3Rpb25Qcm9wcyBleHRlbmRzIGNvZGVwaXBlbGluZS5Db21tb25Bd3NBY3Rpb25Qcm9wcyB7XG4gIC8qKlxuICAgKiBUaGUgaW1hZ2UgdGFnIHRoYXQgd2lsbCBiZSBjaGVja2VkIGZvciBjaGFuZ2VzLlxuICAgKlxuICAgKiBJdCBpcyBub3QgcG9zc2libGUgdG8gdHJpZ2dlciBvbiBjaGFuZ2VzIHRvIG1vcmUgdGhhbiBvbmUgdGFnLlxuICAgKlxuICAgKiBAZGVmYXVsdCAnbGF0ZXN0J1xuICAgKi9cbiAgcmVhZG9ubHkgaW1hZ2VUYWc/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqXG4gICAqL1xuICByZWFkb25seSBvdXRwdXQ6IGNvZGVwaXBlbGluZS5BcnRpZmFjdDtcblxuICAvKipcbiAgICogVGhlIHJlcG9zaXRvcnkgdGhhdCB3aWxsIGJlIHdhdGNoZWQgZm9yIGNoYW5nZXMuXG4gICAqL1xuICByZWFkb25seSByZXBvc2l0b3J5OiBlY3IuSVJlcG9zaXRvcnk7XG59XG5cbi8qKlxuICogVGhlIEVDUiBSZXBvc2l0b3J5IHNvdXJjZSBDb2RlUGlwZWxpbmUgQWN0aW9uLlxuICpcbiAqIFdpbGwgdHJpZ2dlciB0aGUgcGlwZWxpbmUgYXMgc29vbiBhcyB0aGUgdGFyZ2V0IHRhZyBpbiB0aGUgcmVwb3NpdG9yeVxuICogY2hhbmdlcywgYnV0IG9ubHkgaWYgdGhlcmUgaXMgYSBDbG91ZFRyYWlsIFRyYWlsIGluIHRoZSBhY2NvdW50IHRoYXRcbiAqIGNhcHR1cmVzIHRoZSBFQ1IgZXZlbnQuXG4gKi9cbmV4cG9ydCBjbGFzcyBFY3JTb3VyY2VBY3Rpb24gZXh0ZW5kcyBBY3Rpb24ge1xuICBwcml2YXRlIHJlYWRvbmx5IHByb3BzOiBFY3JTb3VyY2VBY3Rpb25Qcm9wcztcblxuICBjb25zdHJ1Y3Rvcihwcm9wczogRWNyU291cmNlQWN0aW9uUHJvcHMpIHtcbiAgICBzdXBlcih7XG4gICAgICAuLi5wcm9wcyxcbiAgICAgIHJlc291cmNlOiBwcm9wcy5yZXBvc2l0b3J5LFxuICAgICAgY2F0ZWdvcnk6IGNvZGVwaXBlbGluZS5BY3Rpb25DYXRlZ29yeS5TT1VSQ0UsXG4gICAgICBwcm92aWRlcjogJ0VDUicsXG4gICAgICBhcnRpZmFjdEJvdW5kczogc291cmNlQXJ0aWZhY3RCb3VuZHMoKSxcbiAgICAgIG91dHB1dHM6IFtwcm9wcy5vdXRwdXRdLFxuICAgIH0pO1xuXG4gICAgdGhpcy5wcm9wcyA9IHByb3BzO1xuICB9XG5cbiAgLyoqIFRoZSB2YXJpYWJsZXMgZW1pdHRlZCBieSB0aGlzIGFjdGlvbi4gKi9cbiAgcHVibGljIGdldCB2YXJpYWJsZXMoKTogRWNyU291cmNlVmFyaWFibGVzIHtcbiAgICByZXR1cm4ge1xuICAgICAgcmVnaXN0cnlJZDogdGhpcy52YXJpYWJsZUV4cHJlc3Npb24oJ1JlZ2lzdHJ5SWQnKSxcbiAgICAgIHJlcG9zaXRvcnlOYW1lOiB0aGlzLnZhcmlhYmxlRXhwcmVzc2lvbignUmVwb3NpdG9yeU5hbWUnKSxcbiAgICAgIGltYWdlRGlnZXN0OiB0aGlzLnZhcmlhYmxlRXhwcmVzc2lvbignSW1hZ2VEaWdlc3QnKSxcbiAgICAgIGltYWdlVGFnOiB0aGlzLnZhcmlhYmxlRXhwcmVzc2lvbignSW1hZ2VUYWcnKSxcbiAgICAgIGltYWdlVXJpOiB0aGlzLnZhcmlhYmxlRXhwcmVzc2lvbignSW1hZ2VVUkknKSxcbiAgICB9O1xuICB9XG5cbiAgcHJvdGVjdGVkIGJvdW5kKHNjb3BlOiBDb25zdHJ1Y3QsIHN0YWdlOiBjb2RlcGlwZWxpbmUuSVN0YWdlLCBvcHRpb25zOiBjb2RlcGlwZWxpbmUuQWN0aW9uQmluZE9wdGlvbnMpOlxuICBjb2RlcGlwZWxpbmUuQWN0aW9uQ29uZmlnIHtcbiAgICBvcHRpb25zLnJvbGUuYWRkVG9Qb2xpY3kobmV3IGlhbS5Qb2xpY3lTdGF0ZW1lbnQoe1xuICAgICAgYWN0aW9uczogWydlY3I6RGVzY3JpYmVJbWFnZXMnXSxcbiAgICAgIHJlc291cmNlczogW3RoaXMucHJvcHMucmVwb3NpdG9yeS5yZXBvc2l0b3J5QXJuXSxcbiAgICB9KSk7XG5cbiAgICBuZXcgUnVsZShzY29wZSwgTmFtZXMubm9kZVVuaXF1ZUlkKHN0YWdlLnBpcGVsaW5lLm5vZGUpICsgJ1NvdXJjZUV2ZW50UnVsZScsIHtcbiAgICAgIHRhcmdldHM6IFtcbiAgICAgICAgbmV3IHRhcmdldHMuQ29kZVBpcGVsaW5lKHN0YWdlLnBpcGVsaW5lKSxcbiAgICAgIF0sXG4gICAgICBldmVudFBhdHRlcm46IHtcbiAgICAgICAgZGV0YWlsVHlwZTogWydFQ1IgSW1hZ2UgQWN0aW9uJ10sXG4gICAgICAgIHNvdXJjZTogWydhd3MuZWNyJ10sXG4gICAgICAgIGRldGFpbDoge1xuICAgICAgICAgICdyZXN1bHQnOiBbJ1NVQ0NFU1MnXSxcbiAgICAgICAgICAncmVwb3NpdG9yeS1uYW1lJzogW3RoaXMucHJvcHMucmVwb3NpdG9yeS5yZXBvc2l0b3J5TmFtZV0sXG4gICAgICAgICAgJ2ltYWdlLXRhZyc6IFt0aGlzLnByb3BzLmltYWdlVGFnID09PSAnJyA/IHVuZGVmaW5lZCA6ICh0aGlzLnByb3BzLmltYWdlVGFnID8/ICdsYXRlc3QnKV0sXG4gICAgICAgICAgJ2FjdGlvbi10eXBlJzogWydQVVNIJ10sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgLy8gdGhlIEFjdGlvbiBSb2xlIGFsc28gbmVlZHMgdG8gd3JpdGUgdG8gdGhlIFBpcGVsaW5lJ3MgYnVja2V0XG4gICAgb3B0aW9ucy5idWNrZXQuZ3JhbnRXcml0ZShvcHRpb25zLnJvbGUpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIGNvbmZpZ3VyYXRpb246IHtcbiAgICAgICAgUmVwb3NpdG9yeU5hbWU6IHRoaXMucHJvcHMucmVwb3NpdG9yeS5yZXBvc2l0b3J5TmFtZSxcbiAgICAgICAgSW1hZ2VUYWc6IHRoaXMucHJvcHMuaW1hZ2VUYWcgPyB0aGlzLnByb3BzLmltYWdlVGFnIDogdW5kZWZpbmVkLCAvLyBgJydgIGlzIGZhbHN5IGluIEpTL1RTXG4gICAgICB9LFxuICAgIH07XG4gIH1cbn1cbiJdfQ==