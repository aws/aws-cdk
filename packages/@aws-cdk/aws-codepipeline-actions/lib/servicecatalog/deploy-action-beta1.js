"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceCatalogDeployActionBeta1 = void 0;
const jsiiDeprecationWarnings = require("../../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const codepipeline = require("@aws-cdk/aws-codepipeline");
const iam = require("@aws-cdk/aws-iam");
const action_1 = require("../action");
/**
 * CodePipeline action to connect to an existing ServiceCatalog product.
 *
 * **Note**: this class is still experimental, and may have breaking changes in the future!
 */
class ServiceCatalogDeployActionBeta1 extends action_1.Action {
    constructor(props) {
        super({
            ...props,
            provider: 'ServiceCatalog',
            category: codepipeline.ActionCategory.DEPLOY,
            artifactBounds: {
                minInputs: 1,
                maxInputs: 1,
                minOutputs: 0,
                maxOutputs: 0,
            },
            inputs: [props.templatePath.artifact],
        });
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_codepipeline_actions_ServiceCatalogDeployActionBeta1Props(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, ServiceCatalogDeployActionBeta1);
            }
            throw error;
        }
        this.templatePath = props.templatePath.fileName;
        this.productVersionName = props.productVersionName;
        this.productVersionDescription = props.productVersionDescription;
        this.productId = props.productId;
        this.productType = 'CLOUD_FORMATION_TEMPLATE';
    }
    bound(_scope, _stage, options) {
        options.role.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('AWSServiceCatalogAdminFullAccess'));
        // Attempt at least privilege; using this alone fails with "invalid template".
        // Should construct ARN: 'arn:aws:catalog:<region>:<accountID>:product/' + this.scProductId
        // options.role.addToPolicy(new PolicyStatement({
        //   resources: ['*'],
        //   actions: ['servicecatalog:UpdateProduct', 'servicecatalog:ListProvisioningArtifacts', 'servicecatalog:CreateProvisioningArtifact'],
        // }));
        // the Action's Role needs to read from the Bucket to get artifacts
        options.bucket.grantRead(options.role);
        return {
            configuration: {
                TemplateFilePath: this.templatePath,
                ProductVersionName: this.productVersionName,
                ProductVersionDescription: this.productVersionDescription,
                ProductType: this.productType,
                ProductId: this.productId,
            },
        };
    }
}
exports.ServiceCatalogDeployActionBeta1 = ServiceCatalogDeployActionBeta1;
_a = JSII_RTTI_SYMBOL_1;
ServiceCatalogDeployActionBeta1[_a] = { fqn: "@aws-cdk/aws-codepipeline-actions.ServiceCatalogDeployActionBeta1", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVwbG95LWFjdGlvbi1iZXRhMS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRlcGxveS1hY3Rpb24tYmV0YTEudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsMERBQTBEO0FBQzFELHdDQUF3QztBQUV4QyxzQ0FBbUM7QUE0Qm5DOzs7O0dBSUc7QUFDSCxNQUFhLCtCQUFnQyxTQUFRLGVBQU07SUFPekQsWUFBWSxLQUEyQztRQUNyRCxLQUFLLENBQUM7WUFDSixHQUFHLEtBQUs7WUFDUixRQUFRLEVBQUUsZ0JBQWdCO1lBQzFCLFFBQVEsRUFBRSxZQUFZLENBQUMsY0FBYyxDQUFDLE1BQU07WUFDNUMsY0FBYyxFQUFFO2dCQUNkLFNBQVMsRUFBRSxDQUFDO2dCQUNaLFNBQVMsRUFBRSxDQUFDO2dCQUNaLFVBQVUsRUFBRSxDQUFDO2dCQUNiLFVBQVUsRUFBRSxDQUFDO2FBQ2Q7WUFDRCxNQUFNLEVBQUUsQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQztTQUN0QyxDQUFDLENBQUM7Ozs7OzsrQ0FuQk0sK0JBQStCOzs7O1FBb0J4QyxJQUFJLENBQUMsWUFBWSxHQUFHLEtBQUssQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDO1FBQ2hELElBQUksQ0FBQyxrQkFBa0IsR0FBRyxLQUFLLENBQUMsa0JBQWtCLENBQUM7UUFDbkQsSUFBSSxDQUFDLHlCQUF5QixHQUFHLEtBQUssQ0FBQyx5QkFBeUIsQ0FBQztRQUNqRSxJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUM7UUFDakMsSUFBSSxDQUFDLFdBQVcsR0FBRywwQkFBMEIsQ0FBQztLQUMvQztJQUVTLEtBQUssQ0FBQyxNQUFpQixFQUFFLE1BQTJCLEVBQUUsT0FBdUM7UUFHckcsT0FBTyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLHdCQUF3QixDQUFDLGtDQUFrQyxDQUFDLENBQUMsQ0FBQztRQUU5Ryw4RUFBOEU7UUFDOUUsMkZBQTJGO1FBQzNGLGlEQUFpRDtRQUNqRCxzQkFBc0I7UUFDdEIsd0lBQXdJO1FBQ3hJLE9BQU87UUFFUCxtRUFBbUU7UUFDbkUsT0FBTyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRXZDLE9BQU87WUFDTCxhQUFhLEVBQUU7Z0JBQ2IsZ0JBQWdCLEVBQUUsSUFBSSxDQUFDLFlBQVk7Z0JBQ25DLGtCQUFrQixFQUFFLElBQUksQ0FBQyxrQkFBa0I7Z0JBQzNDLHlCQUF5QixFQUFFLElBQUksQ0FBQyx5QkFBeUI7Z0JBQ3pELFdBQVcsRUFBRSxJQUFJLENBQUMsV0FBVztnQkFDN0IsU0FBUyxFQUFFLElBQUksQ0FBQyxTQUFTO2FBQzFCO1NBQ0YsQ0FBQztLQUNIOztBQW5ESCwwRUFvREMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBjb2RlcGlwZWxpbmUgZnJvbSAnQGF3cy1jZGsvYXdzLWNvZGVwaXBlbGluZSc7XG5pbXBvcnQgKiBhcyBpYW0gZnJvbSAnQGF3cy1jZGsvYXdzLWlhbSc7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCB7IEFjdGlvbiB9IGZyb20gJy4uL2FjdGlvbic7XG5cbi8qKlxuICogQ29uc3RydWN0aW9uIHByb3BlcnRpZXMgb2YgdGhlIGBTZXJ2aWNlQ2F0YWxvZ0RlcGxveUFjdGlvbkJldGExIFNlcnZpY2VDYXRhbG9nIGRlcGxveSBDb2RlUGlwZWxpbmUgQWN0aW9uYC5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBTZXJ2aWNlQ2F0YWxvZ0RlcGxveUFjdGlvbkJldGExUHJvcHMgZXh0ZW5kcyBjb2RlcGlwZWxpbmUuQ29tbW9uQXdzQWN0aW9uUHJvcHMge1xuICAvKipcbiAgICogVGhlIHBhdGggdG8gdGhlIGNsb3VkZm9ybWF0aW9uIGFydGlmYWN0LlxuICAgKi9cbiAgcmVhZG9ubHkgdGVtcGxhdGVQYXRoOiBjb2RlcGlwZWxpbmUuQXJ0aWZhY3RQYXRoO1xuXG4gIC8qKlxuICAgKiBUaGUgbmFtZSBvZiB0aGUgdmVyc2lvbiBvZiB0aGUgU2VydmljZSBDYXRhbG9nIHByb2R1Y3QgdG8gYmUgZGVwbG95ZWQuXG4gICAqL1xuICByZWFkb25seSBwcm9kdWN0VmVyc2lvbk5hbWU6IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIG9wdGlvbmFsIGRlc2NyaXB0aW9uIG9mIHRoaXMgdmVyc2lvbiBvZiB0aGUgU2VydmljZSBDYXRhbG9nIHByb2R1Y3QuXG4gICAqIEBkZWZhdWx0ICcnXG4gICAqL1xuICByZWFkb25seSBwcm9kdWN0VmVyc2lvbkRlc2NyaXB0aW9uPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgaWRlbnRpZmllciBvZiB0aGUgcHJvZHVjdCBpbiB0aGUgU2VydmljZSBDYXRhbG9nLiBUaGlzIHByb2R1Y3QgbXVzdCBhbHJlYWR5IGV4aXN0LlxuICAgKi9cbiAgcmVhZG9ubHkgcHJvZHVjdElkOiBzdHJpbmc7XG59XG5cbi8qKlxuICogQ29kZVBpcGVsaW5lIGFjdGlvbiB0byBjb25uZWN0IHRvIGFuIGV4aXN0aW5nIFNlcnZpY2VDYXRhbG9nIHByb2R1Y3QuXG4gKlxuICogKipOb3RlKio6IHRoaXMgY2xhc3MgaXMgc3RpbGwgZXhwZXJpbWVudGFsLCBhbmQgbWF5IGhhdmUgYnJlYWtpbmcgY2hhbmdlcyBpbiB0aGUgZnV0dXJlIVxuICovXG5leHBvcnQgY2xhc3MgU2VydmljZUNhdGFsb2dEZXBsb3lBY3Rpb25CZXRhMSBleHRlbmRzIEFjdGlvbiB7XG4gIHByaXZhdGUgcmVhZG9ubHkgdGVtcGxhdGVQYXRoOiBzdHJpbmc7XG4gIHByaXZhdGUgcmVhZG9ubHkgcHJvZHVjdFZlcnNpb25OYW1lOiBzdHJpbmc7XG4gIHByaXZhdGUgcmVhZG9ubHkgcHJvZHVjdFZlcnNpb25EZXNjcmlwdGlvbj86IHN0cmluZztcbiAgcHJpdmF0ZSByZWFkb25seSBwcm9kdWN0SWQ6IHN0cmluZztcbiAgcHJpdmF0ZSByZWFkb25seSBwcm9kdWN0VHlwZTogc3RyaW5nO1xuXG4gIGNvbnN0cnVjdG9yKHByb3BzOiBTZXJ2aWNlQ2F0YWxvZ0RlcGxveUFjdGlvbkJldGExUHJvcHMpIHtcbiAgICBzdXBlcih7XG4gICAgICAuLi5wcm9wcyxcbiAgICAgIHByb3ZpZGVyOiAnU2VydmljZUNhdGFsb2cnLFxuICAgICAgY2F0ZWdvcnk6IGNvZGVwaXBlbGluZS5BY3Rpb25DYXRlZ29yeS5ERVBMT1ksXG4gICAgICBhcnRpZmFjdEJvdW5kczoge1xuICAgICAgICBtaW5JbnB1dHM6IDEsXG4gICAgICAgIG1heElucHV0czogMSxcbiAgICAgICAgbWluT3V0cHV0czogMCxcbiAgICAgICAgbWF4T3V0cHV0czogMCxcbiAgICAgIH0sXG4gICAgICBpbnB1dHM6IFtwcm9wcy50ZW1wbGF0ZVBhdGguYXJ0aWZhY3RdLFxuICAgIH0pO1xuICAgIHRoaXMudGVtcGxhdGVQYXRoID0gcHJvcHMudGVtcGxhdGVQYXRoLmZpbGVOYW1lO1xuICAgIHRoaXMucHJvZHVjdFZlcnNpb25OYW1lID0gcHJvcHMucHJvZHVjdFZlcnNpb25OYW1lO1xuICAgIHRoaXMucHJvZHVjdFZlcnNpb25EZXNjcmlwdGlvbiA9IHByb3BzLnByb2R1Y3RWZXJzaW9uRGVzY3JpcHRpb247XG4gICAgdGhpcy5wcm9kdWN0SWQgPSBwcm9wcy5wcm9kdWN0SWQ7XG4gICAgdGhpcy5wcm9kdWN0VHlwZSA9ICdDTE9VRF9GT1JNQVRJT05fVEVNUExBVEUnO1xuICB9XG5cbiAgcHJvdGVjdGVkIGJvdW5kKF9zY29wZTogQ29uc3RydWN0LCBfc3RhZ2U6IGNvZGVwaXBlbGluZS5JU3RhZ2UsIG9wdGlvbnM6IGNvZGVwaXBlbGluZS5BY3Rpb25CaW5kT3B0aW9ucyk6XG4gIGNvZGVwaXBlbGluZS5BY3Rpb25Db25maWcge1xuXG4gICAgb3B0aW9ucy5yb2xlLmFkZE1hbmFnZWRQb2xpY3koaWFtLk1hbmFnZWRQb2xpY3kuZnJvbUF3c01hbmFnZWRQb2xpY3lOYW1lKCdBV1NTZXJ2aWNlQ2F0YWxvZ0FkbWluRnVsbEFjY2VzcycpKTtcblxuICAgIC8vIEF0dGVtcHQgYXQgbGVhc3QgcHJpdmlsZWdlOyB1c2luZyB0aGlzIGFsb25lIGZhaWxzIHdpdGggXCJpbnZhbGlkIHRlbXBsYXRlXCIuXG4gICAgLy8gU2hvdWxkIGNvbnN0cnVjdCBBUk46ICdhcm46YXdzOmNhdGFsb2c6PHJlZ2lvbj46PGFjY291bnRJRD46cHJvZHVjdC8nICsgdGhpcy5zY1Byb2R1Y3RJZFxuICAgIC8vIG9wdGlvbnMucm9sZS5hZGRUb1BvbGljeShuZXcgUG9saWN5U3RhdGVtZW50KHtcbiAgICAvLyAgIHJlc291cmNlczogWycqJ10sXG4gICAgLy8gICBhY3Rpb25zOiBbJ3NlcnZpY2VjYXRhbG9nOlVwZGF0ZVByb2R1Y3QnLCAnc2VydmljZWNhdGFsb2c6TGlzdFByb3Zpc2lvbmluZ0FydGlmYWN0cycsICdzZXJ2aWNlY2F0YWxvZzpDcmVhdGVQcm92aXNpb25pbmdBcnRpZmFjdCddLFxuICAgIC8vIH0pKTtcblxuICAgIC8vIHRoZSBBY3Rpb24ncyBSb2xlIG5lZWRzIHRvIHJlYWQgZnJvbSB0aGUgQnVja2V0IHRvIGdldCBhcnRpZmFjdHNcbiAgICBvcHRpb25zLmJ1Y2tldC5ncmFudFJlYWQob3B0aW9ucy5yb2xlKTtcblxuICAgIHJldHVybiB7XG4gICAgICBjb25maWd1cmF0aW9uOiB7XG4gICAgICAgIFRlbXBsYXRlRmlsZVBhdGg6IHRoaXMudGVtcGxhdGVQYXRoLFxuICAgICAgICBQcm9kdWN0VmVyc2lvbk5hbWU6IHRoaXMucHJvZHVjdFZlcnNpb25OYW1lLFxuICAgICAgICBQcm9kdWN0VmVyc2lvbkRlc2NyaXB0aW9uOiB0aGlzLnByb2R1Y3RWZXJzaW9uRGVzY3JpcHRpb24sXG4gICAgICAgIFByb2R1Y3RUeXBlOiB0aGlzLnByb2R1Y3RUeXBlLFxuICAgICAgICBQcm9kdWN0SWQ6IHRoaXMucHJvZHVjdElkLFxuICAgICAgfSxcbiAgICB9O1xuICB9XG59XG4iXX0=