"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UntrustedCodeBoundaryPolicy = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const iam = require("@aws-cdk/aws-iam");
/**
 * Permissions Boundary for a CodeBuild Project running untrusted code
 *
 * This class is a Policy, intended to be used as a Permissions Boundary
 * for a CodeBuild project. It allows most of the actions necessary to run
 * the CodeBuild project, but disallows reading from Parameter Store
 * and Secrets Manager.
 *
 * Use this when your CodeBuild project is running untrusted code (for
 * example, if you are using one to automatically build Pull Requests
 * that anyone can submit), and you want to prevent your future self
 * from accidentally exposing Secrets to this build.
 *
 * (The reason you might want to do this is because otherwise anyone
 * who can submit a Pull Request to your project can write a script
 * to email those secrets to themselves).
 *
 * @example
 *
 * declare const project: codebuild.Project;
 * iam.PermissionsBoundary.of(project).apply(new codebuild.UntrustedCodeBoundaryPolicy(this, 'Boundary'));
 */
class UntrustedCodeBoundaryPolicy extends iam.ManagedPolicy {
    constructor(scope, id, props = {}) {
        super(scope, id, {
            managedPolicyName: props.managedPolicyName,
            description: 'Permissions Boundary Policy for CodeBuild Projects running untrusted code',
            statements: [
                new iam.PolicyStatement({
                    actions: [
                        // For logging
                        'logs:CreateLogGroup',
                        'logs:CreateLogStream',
                        'logs:PutLogEvents',
                        // For test reports
                        'codebuild:CreateReportGroup',
                        'codebuild:CreateReport',
                        'codebuild:UpdateReport',
                        'codebuild:BatchPutTestCases',
                        'codebuild:BatchPutCodeCoverages',
                        // For batch builds
                        'codebuild:StartBuild',
                        'codebuild:StopBuild',
                        'codebuild:RetryBuild',
                        // For pulling ECR images
                        'ecr:GetDownloadUrlForLayer',
                        'ecr:BatchGetImage',
                        'ecr:BatchCheckLayerAvailability',
                        // For running in a VPC
                        'ec2:CreateNetworkInterfacePermission',
                        'ec2:CreateNetworkInterface',
                        'ec2:DescribeNetworkInterfaces',
                        'ec2:DeleteNetworkInterface',
                        'ec2:DescribeSubnets',
                        'ec2:DescribeSecurityGroups',
                        'ec2:DescribeDhcpOptions',
                        'ec2:DescribeVpcs',
                    ],
                    resources: ['*'],
                }),
                ...props.additionalStatements ?? [],
            ],
        });
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_codebuild_UntrustedCodeBoundaryPolicyProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, UntrustedCodeBoundaryPolicy);
            }
            throw error;
        }
    }
}
exports.UntrustedCodeBoundaryPolicy = UntrustedCodeBoundaryPolicy;
_a = JSII_RTTI_SYMBOL_1;
UntrustedCodeBoundaryPolicy[_a] = { fqn: "@aws-cdk/aws-codebuild.UntrustedCodeBoundaryPolicy", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidW50cnVzdGVkLWNvZGUtYm91bmRhcnktcG9saWN5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsidW50cnVzdGVkLWNvZGUtYm91bmRhcnktcG9saWN5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLHdDQUF3QztBQXNCeEM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXFCRztBQUNILE1BQWEsMkJBQTRCLFNBQVEsR0FBRyxDQUFDLGFBQWE7SUFDaEUsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxRQUEwQyxFQUFFO1FBQ3BGLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFO1lBQ2YsaUJBQWlCLEVBQUUsS0FBSyxDQUFDLGlCQUFpQjtZQUMxQyxXQUFXLEVBQUUsMkVBQTJFO1lBQ3hGLFVBQVUsRUFBRTtnQkFDVixJQUFJLEdBQUcsQ0FBQyxlQUFlLENBQUM7b0JBQ3RCLE9BQU8sRUFBRTt3QkFDUCxjQUFjO3dCQUNkLHFCQUFxQjt3QkFDckIsc0JBQXNCO3dCQUN0QixtQkFBbUI7d0JBRW5CLG1CQUFtQjt3QkFDbkIsNkJBQTZCO3dCQUM3Qix3QkFBd0I7d0JBQ3hCLHdCQUF3Qjt3QkFDeEIsNkJBQTZCO3dCQUM3QixpQ0FBaUM7d0JBRWpDLG1CQUFtQjt3QkFDbkIsc0JBQXNCO3dCQUN0QixxQkFBcUI7d0JBQ3JCLHNCQUFzQjt3QkFFdEIseUJBQXlCO3dCQUN6Qiw0QkFBNEI7d0JBQzVCLG1CQUFtQjt3QkFDbkIsaUNBQWlDO3dCQUVqQyx1QkFBdUI7d0JBQ3ZCLHNDQUFzQzt3QkFDdEMsNEJBQTRCO3dCQUM1QiwrQkFBK0I7d0JBQy9CLDRCQUE0Qjt3QkFDNUIscUJBQXFCO3dCQUNyQiw0QkFBNEI7d0JBQzVCLHlCQUF5Qjt3QkFDekIsa0JBQWtCO3FCQUtuQjtvQkFDRCxTQUFTLEVBQUUsQ0FBQyxHQUFHLENBQUM7aUJBQ2pCLENBQUM7Z0JBQ0YsR0FBRyxLQUFLLENBQUMsb0JBQW9CLElBQUksRUFBRTthQUNwQztTQUNGLENBQUMsQ0FBQzs7Ozs7OytDQWhETSwyQkFBMkI7Ozs7S0FpRHJDOztBQWpESCxrRUFrREMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBpYW0gZnJvbSAnQGF3cy1jZGsvYXdzLWlhbSc7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcblxuLyoqXG4gKiBDb25zdHJ1Y3Rpb24gcHJvcGVydGllcyBmb3IgVW50cnVzdGVkQ29kZUJvdW5kYXJ5UG9saWN5XG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgVW50cnVzdGVkQ29kZUJvdW5kYXJ5UG9saWN5UHJvcHMge1xuICAvKipcbiAgICogVGhlIG5hbWUgb2YgdGhlIG1hbmFnZWQgcG9saWN5LlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIEEgbmFtZSBpcyBhdXRvbWF0aWNhbGx5IGdlbmVyYXRlZC5cbiAgICovXG4gIHJlYWRvbmx5IG1hbmFnZWRQb2xpY3lOYW1lPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBBZGRpdGlvbmFsIHN0YXRlbWVudHMgdG8gYWRkIHRvIHRoZSBkZWZhdWx0IHNldCBvZiBzdGF0ZW1lbnRzXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gTm8gYWRkaXRpb25hbCBzdGF0ZW1lbnRzXG4gICAqL1xuICByZWFkb25seSBhZGRpdGlvbmFsU3RhdGVtZW50cz86IGlhbS5Qb2xpY3lTdGF0ZW1lbnRbXTtcbn1cblxuLyoqXG4gKiBQZXJtaXNzaW9ucyBCb3VuZGFyeSBmb3IgYSBDb2RlQnVpbGQgUHJvamVjdCBydW5uaW5nIHVudHJ1c3RlZCBjb2RlXG4gKlxuICogVGhpcyBjbGFzcyBpcyBhIFBvbGljeSwgaW50ZW5kZWQgdG8gYmUgdXNlZCBhcyBhIFBlcm1pc3Npb25zIEJvdW5kYXJ5XG4gKiBmb3IgYSBDb2RlQnVpbGQgcHJvamVjdC4gSXQgYWxsb3dzIG1vc3Qgb2YgdGhlIGFjdGlvbnMgbmVjZXNzYXJ5IHRvIHJ1blxuICogdGhlIENvZGVCdWlsZCBwcm9qZWN0LCBidXQgZGlzYWxsb3dzIHJlYWRpbmcgZnJvbSBQYXJhbWV0ZXIgU3RvcmVcbiAqIGFuZCBTZWNyZXRzIE1hbmFnZXIuXG4gKlxuICogVXNlIHRoaXMgd2hlbiB5b3VyIENvZGVCdWlsZCBwcm9qZWN0IGlzIHJ1bm5pbmcgdW50cnVzdGVkIGNvZGUgKGZvclxuICogZXhhbXBsZSwgaWYgeW91IGFyZSB1c2luZyBvbmUgdG8gYXV0b21hdGljYWxseSBidWlsZCBQdWxsIFJlcXVlc3RzXG4gKiB0aGF0IGFueW9uZSBjYW4gc3VibWl0KSwgYW5kIHlvdSB3YW50IHRvIHByZXZlbnQgeW91ciBmdXR1cmUgc2VsZlxuICogZnJvbSBhY2NpZGVudGFsbHkgZXhwb3NpbmcgU2VjcmV0cyB0byB0aGlzIGJ1aWxkLlxuICpcbiAqIChUaGUgcmVhc29uIHlvdSBtaWdodCB3YW50IHRvIGRvIHRoaXMgaXMgYmVjYXVzZSBvdGhlcndpc2UgYW55b25lXG4gKiB3aG8gY2FuIHN1Ym1pdCBhIFB1bGwgUmVxdWVzdCB0byB5b3VyIHByb2plY3QgY2FuIHdyaXRlIGEgc2NyaXB0XG4gKiB0byBlbWFpbCB0aG9zZSBzZWNyZXRzIHRvIHRoZW1zZWx2ZXMpLlxuICpcbiAqIEBleGFtcGxlXG4gKlxuICogZGVjbGFyZSBjb25zdCBwcm9qZWN0OiBjb2RlYnVpbGQuUHJvamVjdDtcbiAqIGlhbS5QZXJtaXNzaW9uc0JvdW5kYXJ5Lm9mKHByb2plY3QpLmFwcGx5KG5ldyBjb2RlYnVpbGQuVW50cnVzdGVkQ29kZUJvdW5kYXJ5UG9saWN5KHRoaXMsICdCb3VuZGFyeScpKTtcbiAqL1xuZXhwb3J0IGNsYXNzIFVudHJ1c3RlZENvZGVCb3VuZGFyeVBvbGljeSBleHRlbmRzIGlhbS5NYW5hZ2VkUG9saWN5IHtcbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IFVudHJ1c3RlZENvZGVCb3VuZGFyeVBvbGljeVByb3BzID0ge30pIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHtcbiAgICAgIG1hbmFnZWRQb2xpY3lOYW1lOiBwcm9wcy5tYW5hZ2VkUG9saWN5TmFtZSxcbiAgICAgIGRlc2NyaXB0aW9uOiAnUGVybWlzc2lvbnMgQm91bmRhcnkgUG9saWN5IGZvciBDb2RlQnVpbGQgUHJvamVjdHMgcnVubmluZyB1bnRydXN0ZWQgY29kZScsXG4gICAgICBzdGF0ZW1lbnRzOiBbXG4gICAgICAgIG5ldyBpYW0uUG9saWN5U3RhdGVtZW50KHtcbiAgICAgICAgICBhY3Rpb25zOiBbXG4gICAgICAgICAgICAvLyBGb3IgbG9nZ2luZ1xuICAgICAgICAgICAgJ2xvZ3M6Q3JlYXRlTG9nR3JvdXAnLFxuICAgICAgICAgICAgJ2xvZ3M6Q3JlYXRlTG9nU3RyZWFtJyxcbiAgICAgICAgICAgICdsb2dzOlB1dExvZ0V2ZW50cycsXG5cbiAgICAgICAgICAgIC8vIEZvciB0ZXN0IHJlcG9ydHNcbiAgICAgICAgICAgICdjb2RlYnVpbGQ6Q3JlYXRlUmVwb3J0R3JvdXAnLFxuICAgICAgICAgICAgJ2NvZGVidWlsZDpDcmVhdGVSZXBvcnQnLFxuICAgICAgICAgICAgJ2NvZGVidWlsZDpVcGRhdGVSZXBvcnQnLFxuICAgICAgICAgICAgJ2NvZGVidWlsZDpCYXRjaFB1dFRlc3RDYXNlcycsXG4gICAgICAgICAgICAnY29kZWJ1aWxkOkJhdGNoUHV0Q29kZUNvdmVyYWdlcycsXG5cbiAgICAgICAgICAgIC8vIEZvciBiYXRjaCBidWlsZHNcbiAgICAgICAgICAgICdjb2RlYnVpbGQ6U3RhcnRCdWlsZCcsXG4gICAgICAgICAgICAnY29kZWJ1aWxkOlN0b3BCdWlsZCcsXG4gICAgICAgICAgICAnY29kZWJ1aWxkOlJldHJ5QnVpbGQnLFxuXG4gICAgICAgICAgICAvLyBGb3IgcHVsbGluZyBFQ1IgaW1hZ2VzXG4gICAgICAgICAgICAnZWNyOkdldERvd25sb2FkVXJsRm9yTGF5ZXInLFxuICAgICAgICAgICAgJ2VjcjpCYXRjaEdldEltYWdlJyxcbiAgICAgICAgICAgICdlY3I6QmF0Y2hDaGVja0xheWVyQXZhaWxhYmlsaXR5JyxcblxuICAgICAgICAgICAgLy8gRm9yIHJ1bm5pbmcgaW4gYSBWUENcbiAgICAgICAgICAgICdlYzI6Q3JlYXRlTmV0d29ya0ludGVyZmFjZVBlcm1pc3Npb24nLFxuICAgICAgICAgICAgJ2VjMjpDcmVhdGVOZXR3b3JrSW50ZXJmYWNlJyxcbiAgICAgICAgICAgICdlYzI6RGVzY3JpYmVOZXR3b3JrSW50ZXJmYWNlcycsXG4gICAgICAgICAgICAnZWMyOkRlbGV0ZU5ldHdvcmtJbnRlcmZhY2UnLFxuICAgICAgICAgICAgJ2VjMjpEZXNjcmliZVN1Ym5ldHMnLFxuICAgICAgICAgICAgJ2VjMjpEZXNjcmliZVNlY3VyaXR5R3JvdXBzJyxcbiAgICAgICAgICAgICdlYzI6RGVzY3JpYmVEaGNwT3B0aW9ucycsXG4gICAgICAgICAgICAnZWMyOkRlc2NyaWJlVnBjcycsXG5cbiAgICAgICAgICAgIC8vIE5PVEFCTFkgTUlTU0lORzpcbiAgICAgICAgICAgIC8vIC0gUmVhZGluZyBzZWNyZXRzXG4gICAgICAgICAgICAvLyAtIFJlYWRpbmcgcGFyYW1ldGVyc3RvcmVcbiAgICAgICAgICBdLFxuICAgICAgICAgIHJlc291cmNlczogWycqJ10sXG4gICAgICAgIH0pLFxuICAgICAgICAuLi5wcm9wcy5hZGRpdGlvbmFsU3RhdGVtZW50cyA/PyBbXSxcbiAgICAgIF0sXG4gICAgfSk7XG4gIH1cbn0iXX0=