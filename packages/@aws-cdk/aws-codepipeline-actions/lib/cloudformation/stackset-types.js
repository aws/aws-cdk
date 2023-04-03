"use strict";
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", { value: true });
exports.StackSetOrganizationsAutoDeployment = exports.StackSetDeploymentModel = exports.StackSetParameters = exports.StackInstances = exports.StackSetTemplate = void 0;
const jsiiDeprecationWarnings = require("../../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const iam = require("@aws-cdk/aws-iam");
const cdk = require("@aws-cdk/core");
/**
 * The source of a StackSet template
 */
class StackSetTemplate {
    /**
     * Use a file in an artifact as Stack Template.
     */
    static fromArtifactPath(artifactPath) {
        return new class extends StackSetTemplate {
            constructor() {
                super(...arguments);
                this._artifactsReferenced = [artifactPath.artifact];
            }
            _render() {
                return artifactPath.location;
            }
        }();
    }
}
exports.StackSetTemplate = StackSetTemplate;
_a = JSII_RTTI_SYMBOL_1;
StackSetTemplate[_a] = { fqn: "@aws-cdk/aws-codepipeline-actions.StackSetTemplate", version: "0.0.0" };
/**
 * Where Stack Instances will be created from the StackSet
 */
class StackInstances {
    /**
     * Create stack instances in a set of accounts and regions passed as literal lists
     *
     * Stack Instances will be created in every combination of region and account.
     *
     * > NOTE: `StackInstances.inAccounts()` and `StackInstances.inOrganizationalUnits()`
     * > have exactly the same behavior, and you can use them interchangeably if you want.
     * > The only difference between them is that your code clearly indicates what entity
     * > it's working with.
     */
    static inAccounts(accounts, regions) {
        return StackInstances.fromList(accounts, regions);
    }
    /**
     * Create stack instances in all accounts in a set of Organizational Units (OUs) and regions passed as literal lists
     *
     * If you want to deploy to Organization Units, you must choose have created the StackSet
     * with `deploymentModel: DeploymentModel.organizations()`.
     *
     * Stack Instances will be created in every combination of region and account.
     *
     * > NOTE: `StackInstances.inAccounts()` and `StackInstances.inOrganizationalUnits()`
     * > have exactly the same behavior, and you can use them interchangeably if you want.
     * > The only difference between them is that your code clearly indicates what entity
     * > it's working with.
     */
    static inOrganizationalUnits(ous, regions) {
        return StackInstances.fromList(ous, regions);
    }
    /**
     * Create stack instances in a set of accounts or organizational units taken from the pipeline artifacts, and a set of regions
     *
     * The file must be a JSON file containing a list of strings. For example:
     *
     * ```json
     * [
     *   "111111111111",
     *   "222222222222",
     *   "333333333333"
     * ]
     * ```
     *
     * Stack Instances will be created in every combination of region and account, or region and
     * Organizational Units (OUs).
     *
     * If this is set of Organizational Units, you must have selected `StackSetDeploymentModel.organizations()`
     * as deployment model.
     */
    static fromArtifactPath(artifactPath, regions) {
        if (regions.length === 0) {
            throw new Error("'regions' may not be an empty list");
        }
        return new class extends StackInstances {
            constructor() {
                super(...arguments);
                this._artifactsReferenced = [artifactPath.artifact];
            }
            _bind(_scope) {
                return {
                    stackSetConfiguration: {
                        DeploymentTargets: artifactPath.location,
                        Regions: regions.join(','),
                    },
                };
            }
        }();
    }
    /**
     * Create stack instances in a literal set of accounts or organizational units, and a set of regions
     *
     * Stack Instances will be created in every combination of region and account, or region and
     * Organizational Units (OUs).
     *
     * If this is set of Organizational Units, you must have selected `StackSetDeploymentModel.organizations()`
     * as deployment model.
     */
    static fromList(targets, regions) {
        if (targets.length === 0) {
            throw new Error("'targets' may not be an empty list");
        }
        if (regions.length === 0) {
            throw new Error("'regions' may not be an empty list");
        }
        return new class extends StackInstances {
            _bind(_scope) {
                return {
                    stackSetConfiguration: {
                        DeploymentTargets: targets.join(','),
                        Regions: regions.join(','),
                    },
                };
            }
        }();
    }
}
exports.StackInstances = StackInstances;
_b = JSII_RTTI_SYMBOL_1;
StackInstances[_b] = { fqn: "@aws-cdk/aws-codepipeline-actions.StackInstances", version: "0.0.0" };
/**
 * Base parameters for the StackSet
 */
class StackSetParameters {
    /**
     * A list of template parameters for your stack set.
     *
     * You must specify all template parameters. Parameters you don't specify will revert
     * to their `Default` values as specified in the template.
     *
     * Specify the names of parameters you want to retain their existing values,
     * without specifying what those values are, in an array in the second
     * argument to this function. Use of this feature is discouraged. CDK is for
     * specifying desired-state infrastructure, and use of this feature makes the
     * parameter values unmanaged.
     *
     * @example
     *
     * const parameters = codepipeline_actions.StackSetParameters.fromLiteral({
     *  BucketName: 'my-bucket',
     *  Asset1: 'true',
     * });
     */
    static fromLiteral(parameters, usePreviousValues) {
        return new class extends StackSetParameters {
            constructor() {
                super(...arguments);
                this._artifactsReferenced = [];
            }
            _render() {
                return [
                    ...Object.entries(parameters).map(([key, value]) => `ParameterKey=${key},ParameterValue=${value}`),
                    ...(usePreviousValues ?? []).map((key) => `ParameterKey=${key},UsePreviousValue=true`),
                ].join(' ');
            }
        }();
    }
    /**
     * Read the parameters from a JSON file from one of the pipeline's artifacts
     *
     * The file needs to contain a list of `{ ParameterKey, ParameterValue, UsePreviousValue }` objects, like
     * this:
     *
     * ```
     * [
     *     {
     *         "ParameterKey": "BucketName",
     *         "ParameterValue": "my-bucket"
     *     },
     *     {
     *         "ParameterKey": "Asset1",
     *         "ParameterValue": "true"
     *     },
     *     {
     *         "ParameterKey": "Asset2",
     *         "UsePreviousValue": true
     *     }
     * ]
     * ```
     *
     * You must specify all template parameters. Parameters you don't specify will revert
     * to their `Default` values as specified in the template.
     *
     * For of parameters you want to retain their existing values
     * without specifying what those values are, set `UsePreviousValue: true`.
     * Use of this feature is discouraged. CDK is for
     * specifying desired-state infrastructure, and use of this feature makes the
     * parameter values unmanaged.
     */
    static fromArtifactPath(artifactPath) {
        return new class extends StackSetParameters {
            constructor() {
                super(...arguments);
                this._artifactsReferenced = [artifactPath.artifact];
            }
            _render() {
                return artifactPath.location;
            }
        }();
    }
}
exports.StackSetParameters = StackSetParameters;
_c = JSII_RTTI_SYMBOL_1;
StackSetParameters[_c] = { fqn: "@aws-cdk/aws-codepipeline-actions.StackSetParameters", version: "0.0.0" };
/**
 * Determines how IAM roles are created and managed.
 */
class StackSetDeploymentModel {
    /**
     * Deploy to AWS Organizations accounts.
     *
     * AWS CloudFormation StackSets automatically creates the IAM roles required
     * to deploy to accounts managed by AWS Organizations. This requires an
     * account to be a member of an Organization.
     *
     * Using this deployment model, you can specify either AWS Account Ids or
     * Organization Unit Ids in the `stackInstances` parameter.
     */
    static organizations(props = {}) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_codepipeline_actions_OrganizationsDeploymentProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.organizations);
            }
            throw error;
        }
        return new class extends StackSetDeploymentModel {
            _bind() {
                return {
                    stackSetConfiguration: {
                        PermissionModel: 'SERVICE_MANAGED',
                        OrganizationsAutoDeployment: props.autoDeployment,
                    },
                };
            }
        }();
    }
    /**
     * Deploy to AWS Accounts not managed by AWS Organizations
     *
     * You are responsible for creating Execution Roles in every account you will
     * be deploying to in advance to create the actual stack instances. Unless you
     * specify overrides, StackSets expects the execution roles you create to have
     * the default name `AWSCloudFormationStackSetExecutionRole`. See the [Grant
     * self-managed
     * permissions](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/stacksets-prereqs-self-managed.html)
     * section of the CloudFormation documentation.
     *
     * The CDK will automatically create the central Administration Role in the
     * Pipeline account which will be used to assume the Execution Role in each of
     * the target accounts.
     *
     * If you wish to use a pre-created Administration Role, use `Role.fromRoleName()`
     * or `Role.fromRoleArn()` to import it, and pass it to this function:
     *
     * ```ts
     * const existingAdminRole = iam.Role.fromRoleName(this, 'AdminRole', 'AWSCloudFormationStackSetAdministrationRole');
     *
     * const deploymentModel = codepipeline_actions.StackSetDeploymentModel.selfManaged({
     *   // Use an existing Role. Leave this out to create a new Role.
     *   administrationRole: existingAdminRole,
     * });
     * ```
     *
     * Using this deployment model, you can only specify AWS Account Ids in the
     * `stackInstances` parameter.
     *
     * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/stacksets-prereqs-self-managed.html
     */
    static selfManaged(props = {}) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_codepipeline_actions_SelfManagedDeploymentProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.selfManaged);
            }
            throw error;
        }
        return new class extends StackSetDeploymentModel {
            _bind(scope) {
                let administrationRole = props.administrationRole;
                if (!administrationRole) {
                    administrationRole = new iam.Role(scope, 'StackSetAdministrationRole', {
                        assumedBy: new iam.ServicePrincipal('cloudformation.amazonaws.com', {
                            conditions: {
                                // Confused deputy protection
                                StringLike: {
                                    'aws:SourceArn': `arn:${cdk.Aws.PARTITION}:cloudformation:*:${cdk.Aws.ACCOUNT_ID}:stackset/*`,
                                },
                            },
                        }),
                    });
                    administrationRole.addToPrincipalPolicy(new iam.PolicyStatement({
                        actions: ['sts:AssumeRole'],
                        resources: [`arn:${cdk.Aws.PARTITION}:iam::*:role/${props.executionRoleName ?? 'AWSCloudFormationStackSetExecutionRole'}`],
                    }));
                }
                return {
                    stackSetConfiguration: {
                        PermissionModel: 'SELF_MANAGED',
                        AdministrationRoleArn: administrationRole.roleArn,
                        ExecutionRoleName: props.executionRoleName,
                    },
                    passedRoles: [administrationRole],
                };
            }
        }();
    }
}
exports.StackSetDeploymentModel = StackSetDeploymentModel;
_d = JSII_RTTI_SYMBOL_1;
StackSetDeploymentModel[_d] = { fqn: "@aws-cdk/aws-codepipeline-actions.StackSetDeploymentModel", version: "0.0.0" };
/**
 * Describes whether AWS CloudFormation StackSets automatically deploys to AWS Organizations accounts that are added to a target organization or
 * organizational unit (OU).
 */
var StackSetOrganizationsAutoDeployment;
(function (StackSetOrganizationsAutoDeployment) {
    /**
     * StackSets automatically deploys additional stack instances to AWS Organizations accounts that are added to a target organization or
     * organizational unit (OU) in the specified Regions. If an account is removed from a target organization or OU, AWS CloudFormation StackSets
     * deletes stack instances from the account in the specified Regions.
     */
    StackSetOrganizationsAutoDeployment["ENABLED"] = "Enabled";
    /**
     * StackSets does not automatically deploy additional stack instances to AWS Organizations accounts that are added to a target organization or
     * organizational unit (OU) in the specified Regions.
     */
    StackSetOrganizationsAutoDeployment["DISABLED"] = "Disabled";
    /**
     * Stack resources are retained when an account is removed from a target organization or OU.
     */
    StackSetOrganizationsAutoDeployment["ENABLED_WITH_STACK_RETENTION"] = "EnabledWithStackRetention";
})(StackSetOrganizationsAutoDeployment = exports.StackSetOrganizationsAutoDeployment || (exports.StackSetOrganizationsAutoDeployment = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhY2tzZXQtdHlwZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzdGFja3NldC10eXBlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFDQSx3Q0FBd0M7QUFDeEMscUNBQXFDO0FBd0NyQzs7R0FFRztBQUNILE1BQXNCLGdCQUFnQjtJQUNwQzs7T0FFRztJQUNJLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxZQUF1QztRQUNwRSxPQUFPLElBQUksS0FBTSxTQUFRLGdCQUFnQjtZQUE5Qjs7Z0JBQ08seUJBQW9CLEdBQXlDLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBS3ZHLENBQUM7WUFIUSxPQUFPO2dCQUNaLE9BQU8sWUFBWSxDQUFDLFFBQVEsQ0FBQztZQUMvQixDQUFDO1NBQ0YsRUFBRSxDQUFDO0tBQ0w7O0FBWkgsNENBK0JDOzs7QUFFRDs7R0FFRztBQUNILE1BQXNCLGNBQWM7SUFDbEM7Ozs7Ozs7OztPQVNHO0lBQ0ksTUFBTSxDQUFDLFVBQVUsQ0FBQyxRQUFrQixFQUFFLE9BQWlCO1FBQzVELE9BQU8sY0FBYyxDQUFDLFFBQVEsQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUM7S0FDbkQ7SUFFRDs7Ozs7Ozs7Ozs7O09BWUc7SUFDSSxNQUFNLENBQUMscUJBQXFCLENBQUMsR0FBYSxFQUFFLE9BQWlCO1FBQ2xFLE9BQU8sY0FBYyxDQUFDLFFBQVEsQ0FBQyxHQUFHLEVBQUUsT0FBTyxDQUFDLENBQUM7S0FDOUM7SUFFRDs7Ozs7Ozs7Ozs7Ozs7Ozs7O09Ba0JHO0lBQ0ksTUFBTSxDQUFDLGdCQUFnQixDQUFDLFlBQXVDLEVBQUUsT0FBaUI7UUFDdkYsSUFBSSxPQUFPLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtZQUN4QixNQUFNLElBQUksS0FBSyxDQUFDLG9DQUFvQyxDQUFDLENBQUM7U0FDdkQ7UUFFRCxPQUFPLElBQUksS0FBTSxTQUFRLGNBQWM7WUFBNUI7O2dCQUNPLHlCQUFvQixHQUF5QyxD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O0FBQ0gsSUFBWSxtQ0FrQlg7QUFsQkQsV0FBWSxtQ0FBbUM7SUFDN0M7Ozs7T0FJRztJQUNILDBEQUFtQixDQUFBO0lBRW5COzs7T0FHRztJQUNILDREQUFxQixDQUFBO0lBRXJCOztPQUVHO0lBQ0gsaUdBQTBELENBQUE7QUFDNUQsQ0FBQyxFQWxCVyxtQ0FBbUMsR0FBbkMsMkNBQW1DLEtBQW5DLDJDQUFtQyxRQWtCOUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBjb2RlcGlwZWxpbmUgZnJvbSAnQGF3cy1jZGsvYXdzLWNvZGVwaXBlbGluZSc7XG5pbXBvcnQgKiBhcyBpYW0gZnJvbSAnQGF3cy1jZGsvYXdzLWlhbSc7XG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcblxuLyoqXG4gKiBPcHRpb25zIGluIGNvbW1vbiBiZXR3ZWVuIGJvdGggU3RhY2tTZXQgYWN0aW9uc1xuICovXG5leHBvcnQgaW50ZXJmYWNlIENvbW1vbkNsb3VkRm9ybWF0aW9uU3RhY2tTZXRPcHRpb25zIHtcblxuICAvKipcbiAgICogVGhlIHBlcmNlbnRhZ2Ugb2YgYWNjb3VudHMgcGVyIFJlZ2lvbiBmb3Igd2hpY2ggdGhpcyBzdGFjayBvcGVyYXRpb24gY2FuIGZhaWwgYmVmb3JlIEFXUyBDbG91ZEZvcm1hdGlvbiBzdG9wcyB0aGUgb3BlcmF0aW9uIGluIHRoYXQgUmVnaW9uLiBJZlxuICAgKiB0aGUgb3BlcmF0aW9uIGlzIHN0b3BwZWQgaW4gYSBSZWdpb24sIEFXUyBDbG91ZEZvcm1hdGlvbiBkb2Vzbid0IGF0dGVtcHQgdGhlIG9wZXJhdGlvbiBpbiBzdWJzZXF1ZW50IFJlZ2lvbnMuIFdoZW4gY2FsY3VsYXRpbmcgdGhlIG51bWJlclxuICAgKiBvZiBhY2NvdW50cyBiYXNlZCBvbiB0aGUgc3BlY2lmaWVkIHBlcmNlbnRhZ2UsIEFXUyBDbG91ZEZvcm1hdGlvbiByb3VuZHMgZG93biB0byB0aGUgbmV4dCB3aG9sZSBudW1iZXIuXG4gICAqXG4gICAqIEBkZWZhdWx0IDAlXG4gICAqL1xuICByZWFkb25seSBmYWlsdXJlVG9sZXJhbmNlUGVyY2VudGFnZT86IG51bWJlcjtcblxuICAvKipcbiAgICogVGhlIG1heGltdW0gcGVyY2VudGFnZSBvZiBhY2NvdW50cyBpbiB3aGljaCB0byBwZXJmb3JtIHRoaXMgb3BlcmF0aW9uIGF0IG9uZSB0aW1lLiBXaGVuIGNhbGN1bGF0aW5nIHRoZSBudW1iZXIgb2YgYWNjb3VudHMgYmFzZWQgb24gdGhlIHNwZWNpZmllZFxuICAgKiBwZXJjZW50YWdlLCBBV1MgQ2xvdWRGb3JtYXRpb24gcm91bmRzIGRvd24gdG8gdGhlIG5leHQgd2hvbGUgbnVtYmVyLiBJZiByb3VuZGluZyBkb3duIHdvdWxkIHJlc3VsdCBpbiB6ZXJvLCBBV1MgQ2xvdWRGb3JtYXRpb24gc2V0cyB0aGUgbnVtYmVyIGFzXG4gICAqIG9uZSBpbnN0ZWFkLiBBbHRob3VnaCB5b3UgdXNlIHRoaXMgc2V0dGluZyB0byBzcGVjaWZ5IHRoZSBtYXhpbXVtLCBmb3IgbGFyZ2UgZGVwbG95bWVudHMgdGhlIGFjdHVhbCBudW1iZXIgb2YgYWNjb3VudHMgYWN0ZWQgdXBvbiBjb25jdXJyZW50bHlcbiAgICogbWF5IGJlIGxvd2VyIGR1ZSB0byBzZXJ2aWNlIHRocm90dGxpbmcuXG4gICAqXG4gICAqIEBkZWZhdWx0IDElXG4gICAqL1xuICByZWFkb25seSBtYXhBY2NvdW50Q29uY3VycmVuY3lQZXJjZW50YWdlPzogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBUaGUgQVdTIFJlZ2lvbiB0aGUgU3RhY2tTZXQgaXMgaW4uXG4gICAqXG4gICAqIE5vdGUgdGhhdCBhIGNyb3NzLXJlZ2lvbiBQaXBlbGluZSByZXF1aXJlcyByZXBsaWNhdGlvbiBidWNrZXRzIHRvIGZ1bmN0aW9uIGNvcnJlY3RseS5cbiAgICogWW91IGNhbiBwcm92aWRlIHRoZWlyIG5hbWVzIHdpdGggdGhlIGBQaXBlbGluZVByb3BzLmNyb3NzUmVnaW9uUmVwbGljYXRpb25CdWNrZXRzYCBwcm9wZXJ0eS5cbiAgICogSWYgeW91IGRvbid0LCB0aGUgQ29kZVBpcGVsaW5lIENvbnN0cnVjdCB3aWxsIGNyZWF0ZSBuZXcgU3RhY2tzIGluIHlvdXIgQ0RLIGFwcCBjb250YWluaW5nIHRob3NlIGJ1Y2tldHMsXG4gICAqIHRoYXQgeW91IHdpbGwgbmVlZCB0byBgY2RrIGRlcGxveWAgYmVmb3JlIGRlcGxveWluZyB0aGUgbWFpbiwgUGlwZWxpbmUtY29udGFpbmluZyBTdGFjay5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBzYW1lIHJlZ2lvbiBhcyB0aGUgUGlwZWxpbmVcbiAgICovXG4gIHJlYWRvbmx5IHN0YWNrU2V0UmVnaW9uPzogc3RyaW5nO1xufVxuXG4vKipcbiAqIFRoZSBzb3VyY2Ugb2YgYSBTdGFja1NldCB0ZW1wbGF0ZVxuICovXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgU3RhY2tTZXRUZW1wbGF0ZSB7XG4gIC8qKlxuICAgKiBVc2UgYSBmaWxlIGluIGFuIGFydGlmYWN0IGFzIFN0YWNrIFRlbXBsYXRlLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBmcm9tQXJ0aWZhY3RQYXRoKGFydGlmYWN0UGF0aDogY29kZXBpcGVsaW5lLkFydGlmYWN0UGF0aCk6IFN0YWNrU2V0VGVtcGxhdGUge1xuICAgIHJldHVybiBuZXcgY2xhc3MgZXh0ZW5kcyBTdGFja1NldFRlbXBsYXRlIHtcbiAgICAgIHB1YmxpYyByZWFkb25seSBfYXJ0aWZhY3RzUmVmZXJlbmNlZD86IGNvZGVwaXBlbGluZS5BcnRpZmFjdFtdIHwgdW5kZWZpbmVkID0gW2FydGlmYWN0UGF0aC5hcnRpZmFjdF07XG5cbiAgICAgIHB1YmxpYyBfcmVuZGVyKCkge1xuICAgICAgICByZXR1cm4gYXJ0aWZhY3RQYXRoLmxvY2F0aW9uO1xuICAgICAgfVxuICAgIH0oKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBXaGljaCBhcnRpZmFjdHMgYXJlIHJlZmVyZW5jZWQgYnkgdGhpcyB0ZW1wbGF0ZVxuICAgKlxuICAgKiBEb2VzIG5vdCBuZWVkIHRvIGJlIGNhbGxlZCBieSBhcHAgYnVpbGRlcnMuXG4gICAqXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgcHVibGljIGFic3RyYWN0IHJlYWRvbmx5IF9hcnRpZmFjdHNSZWZlcmVuY2VkPzogY29kZXBpcGVsaW5lLkFydGlmYWN0W10gfCB1bmRlZmluZWQ7XG5cbiAgLyoqXG4gICAqIFJlbmRlciB0aGUgdGVtcGxhdGUgdG8gdGhlIHBpcGVsaW5lXG4gICAqXG4gICAqIERvZXMgbm90IG5lZWQgdG8gYmUgY2FsbGVkIGJ5IGFwcCBidWlsZGVycy5cbiAgICpcbiAgICogQGludGVybmFsXG4gICAqL1xuICBwdWJsaWMgYWJzdHJhY3QgX3JlbmRlcigpOiBhbnk7XG59XG5cbi8qKlxuICogV2hlcmUgU3RhY2sgSW5zdGFuY2VzIHdpbGwgYmUgY3JlYXRlZCBmcm9tIHRoZSBTdGFja1NldFxuICovXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgU3RhY2tJbnN0YW5jZXMge1xuICAvKipcbiAgICogQ3JlYXRlIHN0YWNrIGluc3RhbmNlcyBpbiBhIHNldCBvZiBhY2NvdW50cyBhbmQgcmVnaW9ucyBwYXNzZWQgYXMgbGl0ZXJhbCBsaXN0c1xuICAgKlxuICAgKiBTdGFjayBJbnN0YW5jZXMgd2lsbCBiZSBjcmVhdGVkIGluIGV2ZXJ5IGNvbWJpbmF0aW9uIG9mIHJlZ2lvbiBhbmQgYWNjb3VudC5cbiAgICpcbiAgICogPiBOT1RFOiBgU3RhY2tJbnN0YW5jZXMuaW5BY2NvdW50cygpYCBhbmQgYFN0YWNrSW5zdGFuY2VzLmluT3JnYW5pemF0aW9uYWxVbml0cygpYFxuICAgKiA+IGhhdmUgZXhhY3RseSB0aGUgc2FtZSBiZWhhdmlvciwgYW5kIHlvdSBjYW4gdXNlIHRoZW0gaW50ZXJjaGFuZ2VhYmx5IGlmIHlvdSB3YW50LlxuICAgKiA+IFRoZSBvbmx5IGRpZmZlcmVuY2UgYmV0d2VlbiB0aGVtIGlzIHRoYXQgeW91ciBjb2RlIGNsZWFybHkgaW5kaWNhdGVzIHdoYXQgZW50aXR5XG4gICAqID4gaXQncyB3b3JraW5nIHdpdGguXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGluQWNjb3VudHMoYWNjb3VudHM6IHN0cmluZ1tdLCByZWdpb25zOiBzdHJpbmdbXSk6IFN0YWNrSW5zdGFuY2VzIHtcbiAgICByZXR1cm4gU3RhY2tJbnN0YW5jZXMuZnJvbUxpc3QoYWNjb3VudHMsIHJlZ2lvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBzdGFjayBpbnN0YW5jZXMgaW4gYWxsIGFjY291bnRzIGluIGEgc2V0IG9mIE9yZ2FuaXphdGlvbmFsIFVuaXRzIChPVXMpIGFuZCByZWdpb25zIHBhc3NlZCBhcyBsaXRlcmFsIGxpc3RzXG4gICAqXG4gICAqIElmIHlvdSB3YW50IHRvIGRlcGxveSB0byBPcmdhbml6YXRpb24gVW5pdHMsIHlvdSBtdXN0IGNob29zZSBoYXZlIGNyZWF0ZWQgdGhlIFN0YWNrU2V0XG4gICAqIHdpdGggYGRlcGxveW1lbnRNb2RlbDogRGVwbG95bWVudE1vZGVsLm9yZ2FuaXphdGlvbnMoKWAuXG4gICAqXG4gICAqIFN0YWNrIEluc3RhbmNlcyB3aWxsIGJlIGNyZWF0ZWQgaW4gZXZlcnkgY29tYmluYXRpb24gb2YgcmVnaW9uIGFuZCBhY2NvdW50LlxuICAgKlxuICAgKiA+IE5PVEU6IGBTdGFja0luc3RhbmNlcy5pbkFjY291bnRzKClgIGFuZCBgU3RhY2tJbnN0YW5jZXMuaW5Pcmdhbml6YXRpb25hbFVuaXRzKClgXG4gICAqID4gaGF2ZSBleGFjdGx5IHRoZSBzYW1lIGJlaGF2aW9yLCBhbmQgeW91IGNhbiB1c2UgdGhlbSBpbnRlcmNoYW5nZWFibHkgaWYgeW91IHdhbnQuXG4gICAqID4gVGhlIG9ubHkgZGlmZmVyZW5jZSBiZXR3ZWVuIHRoZW0gaXMgdGhhdCB5b3VyIGNvZGUgY2xlYXJseSBpbmRpY2F0ZXMgd2hhdCBlbnRpdHlcbiAgICogPiBpdCdzIHdvcmtpbmcgd2l0aC5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgaW5Pcmdhbml6YXRpb25hbFVuaXRzKG91czogc3RyaW5nW10sIHJlZ2lvbnM6IHN0cmluZ1tdKTogU3RhY2tJbnN0YW5jZXMge1xuICAgIHJldHVybiBTdGFja0luc3RhbmNlcy5mcm9tTGlzdChvdXMsIHJlZ2lvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBzdGFjayBpbnN0YW5jZXMgaW4gYSBzZXQgb2YgYWNjb3VudHMgb3Igb3JnYW5pemF0aW9uYWwgdW5pdHMgdGFrZW4gZnJvbSB0aGUgcGlwZWxpbmUgYXJ0aWZhY3RzLCBhbmQgYSBzZXQgb2YgcmVnaW9uc1xuICAgKlxuICAgKiBUaGUgZmlsZSBtdXN0IGJlIGEgSlNPTiBmaWxlIGNvbnRhaW5pbmcgYSBsaXN0IG9mIHN0cmluZ3MuIEZvciBleGFtcGxlOlxuICAgKlxuICAgKiBgYGBqc29uXG4gICAqIFtcbiAgICogICBcIjExMTExMTExMTExMVwiLFxuICAgKiAgIFwiMjIyMjIyMjIyMjIyXCIsXG4gICAqICAgXCIzMzMzMzMzMzMzMzNcIlxuICAgKiBdXG4gICAqIGBgYFxuICAgKlxuICAgKiBTdGFjayBJbnN0YW5jZXMgd2lsbCBiZSBjcmVhdGVkIGluIGV2ZXJ5IGNvbWJpbmF0aW9uIG9mIHJlZ2lvbiBhbmQgYWNjb3VudCwgb3IgcmVnaW9uIGFuZFxuICAgKiBPcmdhbml6YXRpb25hbCBVbml0cyAoT1VzKS5cbiAgICpcbiAgICogSWYgdGhpcyBpcyBzZXQgb2YgT3JnYW5pemF0aW9uYWwgVW5pdHMsIHlvdSBtdXN0IGhhdmUgc2VsZWN0ZWQgYFN0YWNrU2V0RGVwbG95bWVudE1vZGVsLm9yZ2FuaXphdGlvbnMoKWBcbiAgICogYXMgZGVwbG95bWVudCBtb2RlbC5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZnJvbUFydGlmYWN0UGF0aChhcnRpZmFjdFBhdGg6IGNvZGVwaXBlbGluZS5BcnRpZmFjdFBhdGgsIHJlZ2lvbnM6IHN0cmluZ1tdKTogU3RhY2tJbnN0YW5jZXMge1xuICAgIGlmIChyZWdpb25zLmxlbmd0aCA9PT0gMCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiJ3JlZ2lvbnMnIG1heSBub3QgYmUgYW4gZW1wdHkgbGlzdFwiKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IGNsYXNzIGV4dGVuZHMgU3RhY2tJbnN0YW5jZXMge1xuICAgICAgcHVibGljIHJlYWRvbmx5IF9hcnRpZmFjdHNSZWZlcmVuY2VkPzogY29kZXBpcGVsaW5lLkFydGlmYWN0W10gfCB1bmRlZmluZWQgPSBbYXJ0aWZhY3RQYXRoLmFydGlmYWN0XTtcbiAgICAgIHB1YmxpYyBfYmluZChfc2NvcGU6IENvbnN0cnVjdCk6IFN0YWNrSW5zdGFuY2VzQmluZFJlc3VsdCB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgc3RhY2tTZXRDb25maWd1cmF0aW9uOiB7XG4gICAgICAgICAgICBEZXBsb3ltZW50VGFyZ2V0czogYXJ0aWZhY3RQYXRoLmxvY2F0aW9uLFxuICAgICAgICAgICAgUmVnaW9uczogcmVnaW9ucy5qb2luKCcsJyksXG4gICAgICAgICAgfSxcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9KCk7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlIHN0YWNrIGluc3RhbmNlcyBpbiBhIGxpdGVyYWwgc2V0IG9mIGFjY291bnRzIG9yIG9yZ2FuaXphdGlvbmFsIHVuaXRzLCBhbmQgYSBzZXQgb2YgcmVnaW9uc1xuICAgKlxuICAgKiBTdGFjayBJbnN0YW5jZXMgd2lsbCBiZSBjcmVhdGVkIGluIGV2ZXJ5IGNvbWJpbmF0aW9uIG9mIHJlZ2lvbiBhbmQgYWNjb3VudCwgb3IgcmVnaW9uIGFuZFxuICAgKiBPcmdhbml6YXRpb25hbCBVbml0cyAoT1VzKS5cbiAgICpcbiAgICogSWYgdGhpcyBpcyBzZXQgb2YgT3JnYW5pemF0aW9uYWwgVW5pdHMsIHlvdSBtdXN0IGhhdmUgc2VsZWN0ZWQgYFN0YWNrU2V0RGVwbG95bWVudE1vZGVsLm9yZ2FuaXphdGlvbnMoKWBcbiAgICogYXMgZGVwbG95bWVudCBtb2RlbC5cbiAgICovXG4gIHByaXZhdGUgc3RhdGljIGZyb21MaXN0KHRhcmdldHM6IHN0cmluZ1tdLCByZWdpb25zOiBzdHJpbmdbXSk6IFN0YWNrSW5zdGFuY2VzIHtcbiAgICBpZiAodGFyZ2V0cy5sZW5ndGggPT09IDApIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIid0YXJnZXRzJyBtYXkgbm90IGJlIGFuIGVtcHR5IGxpc3RcIik7XG4gICAgfVxuXG4gICAgaWYgKHJlZ2lvbnMubGVuZ3RoID09PSAwKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCIncmVnaW9ucycgbWF5IG5vdCBiZSBhbiBlbXB0eSBsaXN0XCIpO1xuICAgIH1cblxuICAgIHJldHVybiBuZXcgY2xhc3MgZXh0ZW5kcyBTdGFja0luc3RhbmNlcyB7XG4gICAgICBwdWJsaWMgX2JpbmQoX3Njb3BlOiBDb25zdHJ1Y3QpOiBTdGFja0luc3RhbmNlc0JpbmRSZXN1bHQge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHN0YWNrU2V0Q29uZmlndXJhdGlvbjoge1xuICAgICAgICAgICAgRGVwbG95bWVudFRhcmdldHM6IHRhcmdldHMuam9pbignLCcpLFxuICAgICAgICAgICAgUmVnaW9uczogcmVnaW9ucy5qb2luKCcsJyksXG4gICAgICAgICAgfSxcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9KCk7XG4gIH1cblxuXG4gIC8qKlxuICAgKiBUaGUgYXJ0aWZhY3RzIHJlZmVyZW5jZWQgYnkgdGhlIHByb3BlcnRpZXMgb2YgdGhpcyBkZXBsb3ltZW50IHRhcmdldFxuICAgKlxuICAgKiBEb2VzIG5vdCBuZWVkIHRvIGJlIGNhbGxlZCBieSBhcHAgYnVpbGRlcnMuXG4gICAqXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgcmVhZG9ubHkgX2FydGlmYWN0c1JlZmVyZW5jZWQ/OiBjb2RlcGlwZWxpbmUuQXJ0aWZhY3RbXTtcblxuICAvKipcbiAgICogQ2FsbGVkIHRvIGF0dGFjaCB0aGUgc3RhY2sgc2V0IGluc3RhbmNlcyB0byBhIHN0YWNrc2V0IGFjdGlvblxuICAgKlxuICAgKiBEb2VzIG5vdCBuZWVkIHRvIGJlIGNhbGxlZCBieSBhcHAgYnVpbGRlcnMuXG4gICAqXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgcHVibGljIGFic3RyYWN0IF9iaW5kKHNjb3BlOiBDb25zdHJ1Y3QpOiBTdGFja0luc3RhbmNlc0JpbmRSZXN1bHQ7XG59XG5cbi8qKlxuICogUmV0dXJuZWQgYnkgdGhlIFN0YWNrSW5zdGFuY2VzLmJpbmQoKSBmdW5jdGlvblxuICpcbiAqIERvZXMgbm90IG5lZWQgdG8gYmUgdXNlZCBieSBhcHAgYnVpbGRlcnMuXG4gKlxuICogQGludGVybmFsXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgU3RhY2tJbnN0YW5jZXNCaW5kUmVzdWx0IHtcbiAgLyoqXG4gICAqIFByb3BlcnRpZXMgdG8gbWl4IGludG8gdGhlIEFjdGlvbiBjb25maWd1cmF0aW9uXG4gICAqL1xuICByZWFkb25seSBzdGFja1NldENvbmZpZ3VyYXRpb246IGFueTtcbn1cblxuLyoqXG4gKiBCYXNlIHBhcmFtZXRlcnMgZm9yIHRoZSBTdGFja1NldFxuICovXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgU3RhY2tTZXRQYXJhbWV0ZXJzIHtcbiAgLyoqXG4gICAqIEEgbGlzdCBvZiB0ZW1wbGF0ZSBwYXJhbWV0ZXJzIGZvciB5b3VyIHN0YWNrIHNldC5cbiAgICpcbiAgICogWW91IG11c3Qgc3BlY2lmeSBhbGwgdGVtcGxhdGUgcGFyYW1ldGVycy4gUGFyYW1ldGVycyB5b3UgZG9uJ3Qgc3BlY2lmeSB3aWxsIHJldmVydFxuICAgKiB0byB0aGVpciBgRGVmYXVsdGAgdmFsdWVzIGFzIHNwZWNpZmllZCBpbiB0aGUgdGVtcGxhdGUuXG4gICAqXG4gICAqIFNwZWNpZnkgdGhlIG5hbWVzIG9mIHBhcmFtZXRlcnMgeW91IHdhbnQgdG8gcmV0YWluIHRoZWlyIGV4aXN0aW5nIHZhbHVlcyxcbiAgICogd2l0aG91dCBzcGVjaWZ5aW5nIHdoYXQgdGhvc2UgdmFsdWVzIGFyZSwgaW4gYW4gYXJyYXkgaW4gdGhlIHNlY29uZFxuICAgKiBhcmd1bWVudCB0byB0aGlzIGZ1bmN0aW9uLiBVc2Ugb2YgdGhpcyBmZWF0dXJlIGlzIGRpc2NvdXJhZ2VkLiBDREsgaXMgZm9yXG4gICAqIHNwZWNpZnlpbmcgZGVzaXJlZC1zdGF0ZSBpbmZyYXN0cnVjdHVyZSwgYW5kIHVzZSBvZiB0aGlzIGZlYXR1cmUgbWFrZXMgdGhlXG4gICAqIHBhcmFtZXRlciB2YWx1ZXMgdW5tYW5hZ2VkLlxuICAgKlxuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiBjb25zdCBwYXJhbWV0ZXJzID0gY29kZXBpcGVsaW5lX2FjdGlvbnMuU3RhY2tTZXRQYXJhbWV0ZXJzLmZyb21MaXRlcmFsKHtcbiAgICogIEJ1Y2tldE5hbWU6ICdteS1idWNrZXQnLFxuICAgKiAgQXNzZXQxOiAndHJ1ZScsXG4gICAqIH0pO1xuICAgKi9cbiAgcHVibGljIHN0YXRpYyBmcm9tTGl0ZXJhbChwYXJhbWV0ZXJzOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+LCB1c2VQcmV2aW91c1ZhbHVlcz86IHN0cmluZ1tdKTogU3RhY2tTZXRQYXJhbWV0ZXJzIHtcbiAgICByZXR1cm4gbmV3IGNsYXNzIGV4dGVuZHMgU3RhY2tTZXRQYXJhbWV0ZXJzIHtcbiAgICAgIHB1YmxpYyByZWFkb25seSBfYXJ0aWZhY3RzUmVmZXJlbmNlZDogY29kZXBpcGVsaW5lLkFydGlmYWN0W10gPSBbXTtcblxuICAgICAgX3JlbmRlcigpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gW1xuICAgICAgICAgIC4uLk9iamVjdC5lbnRyaWVzKHBhcmFtZXRlcnMpLm1hcCgoW2tleSwgdmFsdWVdKSA9PlxuICAgICAgICAgICAgYFBhcmFtZXRlcktleT0ke2tleX0sUGFyYW1ldGVyVmFsdWU9JHt2YWx1ZX1gKSxcbiAgICAgICAgICAuLi4odXNlUHJldmlvdXNWYWx1ZXMgPz8gW10pLm1hcCgoa2V5KSA9PlxuICAgICAgICAgICAgYFBhcmFtZXRlcktleT0ke2tleX0sVXNlUHJldmlvdXNWYWx1ZT10cnVlYCksXG4gICAgICAgIF0uam9pbignICcpO1xuICAgICAgfVxuICAgIH0oKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWFkIHRoZSBwYXJhbWV0ZXJzIGZyb20gYSBKU09OIGZpbGUgZnJvbSBvbmUgb2YgdGhlIHBpcGVsaW5lJ3MgYXJ0aWZhY3RzXG4gICAqXG4gICAqIFRoZSBmaWxlIG5lZWRzIHRvIGNvbnRhaW4gYSBsaXN0IG9mIGB7IFBhcmFtZXRlcktleSwgUGFyYW1ldGVyVmFsdWUsIFVzZVByZXZpb3VzVmFsdWUgfWAgb2JqZWN0cywgbGlrZVxuICAgKiB0aGlzOlxuICAgKlxuICAgKiBgYGBcbiAgICogW1xuICAgKiAgICAge1xuICAgKiAgICAgICAgIFwiUGFyYW1ldGVyS2V5XCI6IFwiQnVja2V0TmFtZVwiLFxuICAgKiAgICAgICAgIFwiUGFyYW1ldGVyVmFsdWVcIjogXCJteS1idWNrZXRcIlxuICAgKiAgICAgfSxcbiAgICogICAgIHtcbiAgICogICAgICAgICBcIlBhcmFtZXRlcktleVwiOiBcIkFzc2V0MVwiLFxuICAgKiAgICAgICAgIFwiUGFyYW1ldGVyVmFsdWVcIjogXCJ0cnVlXCJcbiAgICogICAgIH0sXG4gICAqICAgICB7XG4gICAqICAgICAgICAgXCJQYXJhbWV0ZXJLZXlcIjogXCJBc3NldDJcIixcbiAgICogICAgICAgICBcIlVzZVByZXZpb3VzVmFsdWVcIjogdHJ1ZVxuICAgKiAgICAgfVxuICAgKiBdXG4gICAqIGBgYFxuICAgKlxuICAgKiBZb3UgbXVzdCBzcGVjaWZ5IGFsbCB0ZW1wbGF0ZSBwYXJhbWV0ZXJzLiBQYXJhbWV0ZXJzIHlvdSBkb24ndCBzcGVjaWZ5IHdpbGwgcmV2ZXJ0XG4gICAqIHRvIHRoZWlyIGBEZWZhdWx0YCB2YWx1ZXMgYXMgc3BlY2lmaWVkIGluIHRoZSB0ZW1wbGF0ZS5cbiAgICpcbiAgICogRm9yIG9mIHBhcmFtZXRlcnMgeW91IHdhbnQgdG8gcmV0YWluIHRoZWlyIGV4aXN0aW5nIHZhbHVlc1xuICAgKiB3aXRob3V0IHNwZWNpZnlpbmcgd2hhdCB0aG9zZSB2YWx1ZXMgYXJlLCBzZXQgYFVzZVByZXZpb3VzVmFsdWU6IHRydWVgLlxuICAgKiBVc2Ugb2YgdGhpcyBmZWF0dXJlIGlzIGRpc2NvdXJhZ2VkLiBDREsgaXMgZm9yXG4gICAqIHNwZWNpZnlpbmcgZGVzaXJlZC1zdGF0ZSBpbmZyYXN0cnVjdHVyZSwgYW5kIHVzZSBvZiB0aGlzIGZlYXR1cmUgbWFrZXMgdGhlXG4gICAqIHBhcmFtZXRlciB2YWx1ZXMgdW5tYW5hZ2VkLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBmcm9tQXJ0aWZhY3RQYXRoKGFydGlmYWN0UGF0aDogY29kZXBpcGVsaW5lLkFydGlmYWN0UGF0aCk6IFN0YWNrU2V0UGFyYW1ldGVycyB7XG4gICAgcmV0dXJuIG5ldyBjbGFzcyBleHRlbmRzIFN0YWNrU2V0UGFyYW1ldGVycyB7XG4gICAgICBwdWJsaWMgX2FydGlmYWN0c1JlZmVyZW5jZWQ6IGNvZGVwaXBlbGluZS5BcnRpZmFjdFtdID0gW2FydGlmYWN0UGF0aC5hcnRpZmFjdF07XG5cbiAgICAgIHB1YmxpYyBfcmVuZGVyKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiBhcnRpZmFjdFBhdGgubG9jYXRpb247XG4gICAgICB9XG4gICAgfSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFydGlmYWN0cyByZWZlcmVuY2VkIGJ5IHRoaXMgcGFyYW1ldGVyIHNldFxuICAgKlxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIHB1YmxpYyBhYnN0cmFjdCByZWFkb25seSBfYXJ0aWZhY3RzUmVmZXJlbmNlZDogY29kZXBpcGVsaW5lLkFydGlmYWN0W107XG5cbiAgLyoqXG4gICAqIENvbnZlcnRzIFBhcmFtZXRlcnMgdG8gYSBzdHJpbmcuXG4gICAqXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgcHVibGljIGFic3RyYWN0IF9yZW5kZXIoKTogc3RyaW5nO1xufVxuXG4vKipcbiAqIERldGVybWluZXMgaG93IElBTSByb2xlcyBhcmUgY3JlYXRlZCBhbmQgbWFuYWdlZC5cbiAqL1xuZXhwb3J0IGFic3RyYWN0IGNsYXNzIFN0YWNrU2V0RGVwbG95bWVudE1vZGVsIHtcbiAgLyoqXG4gICAqIERlcGxveSB0byBBV1MgT3JnYW5pemF0aW9ucyBhY2NvdW50cy5cbiAgICpcbiAgICogQVdTIENsb3VkRm9ybWF0aW9uIFN0YWNrU2V0cyBhdXRvbWF0aWNhbGx5IGNyZWF0ZXMgdGhlIElBTSByb2xlcyByZXF1aXJlZFxuICAgKiB0byBkZXBsb3kgdG8gYWNjb3VudHMgbWFuYWdlZCBieSBBV1MgT3JnYW5pemF0aW9ucy4gVGhpcyByZXF1aXJlcyBhblxuICAgKiBhY2NvdW50IHRvIGJlIGEgbWVtYmVyIG9mIGFuIE9yZ2FuaXphdGlvbi5cbiAgICpcbiAgICogVXNpbmcgdGhpcyBkZXBsb3ltZW50IG1vZGVsLCB5b3UgY2FuIHNwZWNpZnkgZWl0aGVyIEFXUyBBY2NvdW50IElkcyBvclxuICAgKiBPcmdhbml6YXRpb24gVW5pdCBJZHMgaW4gdGhlIGBzdGFja0luc3RhbmNlc2AgcGFyYW1ldGVyLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBvcmdhbml6YXRpb25zKHByb3BzOiBPcmdhbml6YXRpb25zRGVwbG95bWVudFByb3BzID0ge30pOiBTdGFja1NldERlcGxveW1lbnRNb2RlbCB7XG4gICAgcmV0dXJuIG5ldyBjbGFzcyBleHRlbmRzIFN0YWNrU2V0RGVwbG95bWVudE1vZGVsIHtcbiAgICAgIF9iaW5kKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHN0YWNrU2V0Q29uZmlndXJhdGlvbjoge1xuICAgICAgICAgICAgUGVybWlzc2lvbk1vZGVsOiAnU0VSVklDRV9NQU5BR0VEJyxcbiAgICAgICAgICAgIE9yZ2FuaXphdGlvbnNBdXRvRGVwbG95bWVudDogcHJvcHMuYXV0b0RlcGxveW1lbnQsXG4gICAgICAgICAgfSxcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9KCk7XG4gIH1cblxuICAvKipcbiAgICogRGVwbG95IHRvIEFXUyBBY2NvdW50cyBub3QgbWFuYWdlZCBieSBBV1MgT3JnYW5pemF0aW9uc1xuICAgKlxuICAgKiBZb3UgYXJlIHJlc3BvbnNpYmxlIGZvciBjcmVhdGluZyBFeGVjdXRpb24gUm9sZXMgaW4gZXZlcnkgYWNjb3VudCB5b3Ugd2lsbFxuICAgKiBiZSBkZXBsb3lpbmcgdG8gaW4gYWR2YW5jZSB0byBjcmVhdGUgdGhlIGFjdHVhbCBzdGFjayBpbnN0YW5jZXMuIFVubGVzcyB5b3VcbiAgICogc3BlY2lmeSBvdmVycmlkZXMsIFN0YWNrU2V0cyBleHBlY3RzIHRoZSBleGVjdXRpb24gcm9sZXMgeW91IGNyZWF0ZSB0byBoYXZlXG4gICAqIHRoZSBkZWZhdWx0IG5hbWUgYEFXU0Nsb3VkRm9ybWF0aW9uU3RhY2tTZXRFeGVjdXRpb25Sb2xlYC4gU2VlIHRoZSBbR3JhbnRcbiAgICogc2VsZi1tYW5hZ2VkXG4gICAqIHBlcm1pc3Npb25zXShodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9zdGFja3NldHMtcHJlcmVxcy1zZWxmLW1hbmFnZWQuaHRtbClcbiAgICogc2VjdGlvbiBvZiB0aGUgQ2xvdWRGb3JtYXRpb24gZG9jdW1lbnRhdGlvbi5cbiAgICpcbiAgICogVGhlIENESyB3aWxsIGF1dG9tYXRpY2FsbHkgY3JlYXRlIHRoZSBjZW50cmFsIEFkbWluaXN0cmF0aW9uIFJvbGUgaW4gdGhlXG4gICAqIFBpcGVsaW5lIGFjY291bnQgd2hpY2ggd2lsbCBiZSB1c2VkIHRvIGFzc3VtZSB0aGUgRXhlY3V0aW9uIFJvbGUgaW4gZWFjaCBvZlxuICAgKiB0aGUgdGFyZ2V0IGFjY291bnRzLlxuICAgKlxuICAgKiBJZiB5b3Ugd2lzaCB0byB1c2UgYSBwcmUtY3JlYXRlZCBBZG1pbmlzdHJhdGlvbiBSb2xlLCB1c2UgYFJvbGUuZnJvbVJvbGVOYW1lKClgXG4gICAqIG9yIGBSb2xlLmZyb21Sb2xlQXJuKClgIHRvIGltcG9ydCBpdCwgYW5kIHBhc3MgaXQgdG8gdGhpcyBmdW5jdGlvbjpcbiAgICpcbiAgICogYGBgdHNcbiAgICogY29uc3QgZXhpc3RpbmdBZG1pblJvbGUgPSBpYW0uUm9sZS5mcm9tUm9sZU5hbWUodGhpcywgJ0FkbWluUm9sZScsICdBV1NDbG91ZEZvcm1hdGlvblN0YWNrU2V0QWRtaW5pc3RyYXRpb25Sb2xlJyk7XG4gICAqXG4gICAqIGNvbnN0IGRlcGxveW1lbnRNb2RlbCA9IGNvZGVwaXBlbGluZV9hY3Rpb25zLlN0YWNrU2V0RGVwbG95bWVudE1vZGVsLnNlbGZNYW5hZ2VkKHtcbiAgICogICAvLyBVc2UgYW4gZXhpc3RpbmcgUm9sZS4gTGVhdmUgdGhpcyBvdXQgdG8gY3JlYXRlIGEgbmV3IFJvbGUuXG4gICAqICAgYWRtaW5pc3RyYXRpb25Sb2xlOiBleGlzdGluZ0FkbWluUm9sZSxcbiAgICogfSk7XG4gICAqIGBgYFxuICAgKlxuICAgKiBVc2luZyB0aGlzIGRlcGxveW1lbnQgbW9kZWwsIHlvdSBjYW4gb25seSBzcGVjaWZ5IEFXUyBBY2NvdW50IElkcyBpbiB0aGVcbiAgICogYHN0YWNrSW5zdGFuY2VzYCBwYXJhbWV0ZXIuXG4gICAqXG4gICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvc3RhY2tzZXRzLXByZXJlcXMtc2VsZi1tYW5hZ2VkLmh0bWxcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgc2VsZk1hbmFnZWQocHJvcHM6IFNlbGZNYW5hZ2VkRGVwbG95bWVudFByb3BzID0ge30pOiBTdGFja1NldERlcGxveW1lbnRNb2RlbCB7XG4gICAgcmV0dXJuIG5ldyBjbGFzcyBleHRlbmRzIFN0YWNrU2V0RGVwbG95bWVudE1vZGVsIHtcbiAgICAgIF9iaW5kKHNjb3BlOiBDb25zdHJ1Y3QpIHtcbiAgICAgICAgbGV0IGFkbWluaXN0cmF0aW9uUm9sZSA9IHByb3BzLmFkbWluaXN0cmF0aW9uUm9sZTtcbiAgICAgICAgaWYgKCFhZG1pbmlzdHJhdGlvblJvbGUpIHtcbiAgICAgICAgICBhZG1pbmlzdHJhdGlvblJvbGUgPSBuZXcgaWFtLlJvbGUoc2NvcGUsICdTdGFja1NldEFkbWluaXN0cmF0aW9uUm9sZScsIHtcbiAgICAgICAgICAgIGFzc3VtZWRCeTogbmV3IGlhbS5TZXJ2aWNlUHJpbmNpcGFsKCdjbG91ZGZvcm1hdGlvbi5hbWF6b25hd3MuY29tJywge1xuICAgICAgICAgICAgICBjb25kaXRpb25zOiB7XG4gICAgICAgICAgICAgICAgLy8gQ29uZnVzZWQgZGVwdXR5IHByb3RlY3Rpb25cbiAgICAgICAgICAgICAgICBTdHJpbmdMaWtlOiB7XG4gICAgICAgICAgICAgICAgICAnYXdzOlNvdXJjZUFybic6IGBhcm46JHtjZGsuQXdzLlBBUlRJVElPTn06Y2xvdWRmb3JtYXRpb246Kjoke2Nkay5Bd3MuQUNDT1VOVF9JRH06c3RhY2tzZXQvKmAsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0pLFxuICAgICAgICAgIH0pO1xuICAgICAgICAgIGFkbWluaXN0cmF0aW9uUm9sZS5hZGRUb1ByaW5jaXBhbFBvbGljeShuZXcgaWFtLlBvbGljeVN0YXRlbWVudCh7XG4gICAgICAgICAgICBhY3Rpb25zOiBbJ3N0czpBc3N1bWVSb2xlJ10sXG4gICAgICAgICAgICByZXNvdXJjZXM6IFtgYXJuOiR7Y2RrLkF3cy5QQVJUSVRJT059OmlhbTo6Kjpyb2xlLyR7cHJvcHMuZXhlY3V0aW9uUm9sZU5hbWUgPz8gJ0FXU0Nsb3VkRm9ybWF0aW9uU3RhY2tTZXRFeGVjdXRpb25Sb2xlJ31gXSxcbiAgICAgICAgICB9KSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHN0YWNrU2V0Q29uZmlndXJhdGlvbjoge1xuICAgICAgICAgICAgUGVybWlzc2lvbk1vZGVsOiAnU0VMRl9NQU5BR0VEJyxcbiAgICAgICAgICAgIEFkbWluaXN0cmF0aW9uUm9sZUFybjogYWRtaW5pc3RyYXRpb25Sb2xlLnJvbGVBcm4sXG4gICAgICAgICAgICBFeGVjdXRpb25Sb2xlTmFtZTogcHJvcHMuZXhlY3V0aW9uUm9sZU5hbWUsXG4gICAgICAgICAgfSxcbiAgICAgICAgICBwYXNzZWRSb2xlczogW2FkbWluaXN0cmF0aW9uUm9sZV0sXG4gICAgICAgIH0gYXMgU3RhY2tTZXREZXBsb3ltZW50TW9kZWxCaW5kUmVzdWx0O1xuICAgICAgfVxuICAgIH0oKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBCaW5kIHRvIHRoZSBTdGFjayBTZXQgYWN0aW9uIGFuZCByZXR1cm4gdGhlIEFjdGlvbiBjb25maWd1cmF0aW9uXG4gICAqXG4gICAqIERvZXMgbm90IG5lZWQgdG8gYmUgY2FsbGVkIGJ5IGFwcCBidWlsZGVycy5cbiAgICpcbiAgICogQGludGVybmFsXG4gICAqL1xuICBwdWJsaWMgYWJzdHJhY3QgX2JpbmQoc2NvcGU6IENvbnN0cnVjdCk6IFN0YWNrU2V0RGVwbG95bWVudE1vZGVsQmluZFJlc3VsdDtcbn1cblxuLyoqXG4gKiBSZXR1cm5lZCBieSB0aGUgU3RhY2tTZXREZXBsb3ltZW50TW9kZWwuYmluZCgpIGZ1bmN0aW9uXG4gKlxuICogRG9lcyBub3QgbmVlZCB0byBiZSB1c2VkIGJ5IGFwcCBidWlsZGVycy5cbiAqXG4gKiBAaW50ZXJuYWxcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBTdGFja1NldERlcGxveW1lbnRNb2RlbEJpbmRSZXN1bHQge1xuICAvKipcbiAgICogUHJvcGVydGllcyB0byBtaXggaW50byB0aGUgQWN0aW9uIGNvbmZpZ3VyYXRpb25cbiAgICovXG4gIHJlYWRvbmx5IHN0YWNrU2V0Q29uZmlndXJhdGlvbjogYW55O1xuXG4gIC8qKlxuICAgKiBSb2xlcyB0aGF0IG5lZWQgdG8gYmUgcGFzc2VkIGJ5IHRoZSBwaXBlbGluZSBhY3Rpb25cbiAgICpcbiAgICogQGRlZmF1bHQgLSBObyByb2xlc1xuICAgKi9cbiAgcmVhZG9ubHkgcGFzc2VkUm9sZXM/OiBpYW0uSVJvbGVbXTtcbn1cblxuLyoqXG4gKiBQcm9wZXJ0aWVzIGZvciBjb25maWd1cmluZyBzZXJ2aWNlLW1hbmFnZWQgKE9yZ2FuaXphdGlvbnMpIHBlcm1pc3Npb25zXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgT3JnYW5pemF0aW9uc0RlcGxveW1lbnRQcm9wcyB7XG4gIC8qKlxuICAgKiBBdXRvbWF0aWNhbGx5IGRlcGxveSB0byBuZXcgYWNjb3VudHMgYWRkZWQgdG8gT3JnYW5pemF0aW9uYWwgVW5pdHNcbiAgICpcbiAgICogV2hldGhlciBBV1MgQ2xvdWRGb3JtYXRpb24gU3RhY2tTZXRzIGF1dG9tYXRpY2FsbHkgZGVwbG95cyB0byBBV1NcbiAgICogT3JnYW5pemF0aW9ucyBhY2NvdW50cyB0aGF0IGFyZSBhZGRlZCB0byBhIHRhcmdldCBvcmdhbml6YXRpb24gb3JcbiAgICogb3JnYW5pemF0aW9uYWwgdW5pdCAoT1UpLlxuICAgKlxuICAgKiBAZGVmYXVsdCBEaXNhYmxlZFxuICAgKi9cbiAgcmVhZG9ubHkgYXV0b0RlcGxveW1lbnQ/OiBTdGFja1NldE9yZ2FuaXphdGlvbnNBdXRvRGVwbG95bWVudDtcbn1cblxuLyoqXG4gKiBEZXNjcmliZXMgd2hldGhlciBBV1MgQ2xvdWRGb3JtYXRpb24gU3RhY2tTZXRzIGF1dG9tYXRpY2FsbHkgZGVwbG95cyB0byBBV1MgT3JnYW5pemF0aW9ucyBhY2NvdW50cyB0aGF0IGFyZSBhZGRlZCB0byBhIHRhcmdldCBvcmdhbml6YXRpb24gb3JcbiAqIG9yZ2FuaXphdGlvbmFsIHVuaXQgKE9VKS5cbiAqL1xuZXhwb3J0IGVudW0gU3RhY2tTZXRPcmdhbml6YXRpb25zQXV0b0RlcGxveW1lbnQge1xuICAvKipcbiAgICogU3RhY2tTZXRzIGF1dG9tYXRpY2FsbHkgZGVwbG95cyBhZGRpdGlvbmFsIHN0YWNrIGluc3RhbmNlcyB0byBBV1MgT3JnYW5pemF0aW9ucyBhY2NvdW50cyB0aGF0IGFyZSBhZGRlZCB0byBhIHRhcmdldCBvcmdhbml6YXRpb24gb3JcbiAgICogb3JnYW5pemF0aW9uYWwgdW5pdCAoT1UpIGluIHRoZSBzcGVjaWZpZWQgUmVnaW9ucy4gSWYgYW4gYWNjb3VudCBpcyByZW1vdmVkIGZyb20gYSB0YXJnZXQgb3JnYW5pemF0aW9uIG9yIE9VLCBBV1MgQ2xvdWRGb3JtYXRpb24gU3RhY2tTZXRzXG4gICAqIGRlbGV0ZXMgc3RhY2sgaW5zdGFuY2VzIGZyb20gdGhlIGFjY291bnQgaW4gdGhlIHNwZWNpZmllZCBSZWdpb25zLlxuICAgKi9cbiAgRU5BQkxFRCA9ICdFbmFibGVkJyxcblxuICAvKipcbiAgICogU3RhY2tTZXRzIGRvZXMgbm90IGF1dG9tYXRpY2FsbHkgZGVwbG95IGFkZGl0aW9uYWwgc3RhY2sgaW5zdGFuY2VzIHRvIEFXUyBPcmdhbml6YXRpb25zIGFjY291bnRzIHRoYXQgYXJlIGFkZGVkIHRvIGEgdGFyZ2V0IG9yZ2FuaXphdGlvbiBvclxuICAgKiBvcmdhbml6YXRpb25hbCB1bml0IChPVSkgaW4gdGhlIHNwZWNpZmllZCBSZWdpb25zLlxuICAgKi9cbiAgRElTQUJMRUQgPSAnRGlzYWJsZWQnLFxuXG4gIC8qKlxuICAgKiBTdGFjayByZXNvdXJjZXMgYXJlIHJldGFpbmVkIHdoZW4gYW4gYWNjb3VudCBpcyByZW1vdmVkIGZyb20gYSB0YXJnZXQgb3JnYW5pemF0aW9uIG9yIE9VLlxuICAgKi9cbiAgRU5BQkxFRF9XSVRIX1NUQUNLX1JFVEVOVElPTiA9ICdFbmFibGVkV2l0aFN0YWNrUmV0ZW50aW9uJ1xufVxuXG5cbi8qKlxuICogUHJvcGVydGllcyBmb3IgY29uZmlndXJpbmcgc2VsZi1tYW5hZ2VkIHBlcm1pc3Npb25zXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgU2VsZk1hbmFnZWREZXBsb3ltZW50UHJvcHMge1xuICAvKipcbiAgICogVGhlIElBTSByb2xlIGluIHRoZSBhZG1pbmlzdHJhdG9yIGFjY291bnQgdXNlZCB0byBhc3N1bWUgZXhlY3V0aW9uIHJvbGVzIGluIHRoZSB0YXJnZXQgYWNjb3VudHNcbiAgICpcbiAgICogWW91IG11c3QgY3JlYXRlIHRoaXMgcm9sZSBiZWZvcmUgdXNpbmcgdGhlIFN0YWNrU2V0IGFjdGlvbi5cbiAgICpcbiAgICogVGhlIHJvbGUgbmVlZHMgdG8gYmUgYXNzdW1hYmxlIGJ5IENsb3VkRm9ybWF0aW9uLCBhbmQgaXQgbmVlZHMgdG8gYmUgYWJsZVxuICAgKiB0byBgc3RzOkFzc3VtZVJvbGVgIGVhY2ggb2YgdGhlIGV4ZWN1dGlvbiByb2xlcyAod2hvc2UgbmFtZXMgYXJlIHNwZWNpZmllZFxuICAgKiBpbiB0aGUgYGV4ZWN1dGlvblJvbGVOYW1lYCBwYXJhbWV0ZXIpIGluIGVhY2ggb2YgdGhlIHRhcmdldCBhY2NvdW50cy5cbiAgICpcbiAgICogSWYgeW91IGRvIG5vdCBzcGVjaWZ5IHRoZSByb2xlLCB3ZSBhc3N1bWUgeW91IGhhdmUgY3JlYXRlZCBhIHJvbGUgbmFtZWRcbiAgICogYEFXU0Nsb3VkRm9ybWF0aW9uU3RhY2tTZXRBZG1pbmlzdHJhdGlvblJvbGVgLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIEFzc3VtZSBhbiBleGlzdGluZyByb2xlIG5hbWVkIGBBV1NDbG91ZEZvcm1hdGlvblN0YWNrU2V0QWRtaW5pc3RyYXRpb25Sb2xlYCBpbiB0aGUgc2FtZSBhY2NvdW50IGFzIHRoZSBwaXBlbGluZS5cbiAgICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9zdGFja3NldHMtcHJlcmVxcy1zZWxmLW1hbmFnZWQuaHRtbFxuICAgKi9cbiAgcmVhZG9ubHkgYWRtaW5pc3RyYXRpb25Sb2xlPzogaWFtLklSb2xlO1xuXG4gIC8qKlxuICAgKiBUaGUgbmFtZSBvZiB0aGUgSUFNIHJvbGUgaW4gdGhlIHRhcmdldCBhY2NvdW50cyB1c2VkIHRvIHBlcmZvcm0gc3RhY2sgc2V0IG9wZXJhdGlvbnMuXG4gICAqXG4gICAqIFlvdSBtdXN0IGNyZWF0ZSB0aGVzZSByb2xlcyBpbiBlYWNoIG9mIHRoZSB0YXJnZXQgYWNjb3VudHMgYmVmb3JlIHVzaW5nIHRoZVxuICAgKiBTdGFja1NldCBhY3Rpb24uXG4gICAqXG4gICAqIFRoZSByb2xlcyBuZWVkIHRvIGJlIGFzc3VtYWJsZSBieSBieSB0aGUgYGFkbWluaXN0cmF0aW9uUm9sZWAsIGFuZCBuZWVkIHRvXG4gICAqIGhhdmUgdGhlIHBlcm1pc3Npb25zIG5lY2Vzc2FyeSB0byBzdWNjZXNzZnVsbHkgY3JlYXRlIGFuZCBtb2RpZnkgdGhlXG4gICAqIHJlc291cmNlcyB0aGF0IHRoZSBzdWJzZXF1ZW50IENsb3VkRm9ybWF0aW9uIGRlcGxveW1lbnRzIG5lZWQuXG4gICAqIEFkbWluaXN0cmF0b3IgcGVybWlzc2lvbnMgd291bGQgYmUgY29tbW9ubHkgZ3JhbnRlZCB0byB0aGVzZSwgYnV0IGlmIHlvdSBjYW5cbiAgICogc2NvcGUgdGhlIHBlcm1pc3Npb25zIGRvd24gZnJvbWUgdGhlcmUgeW91IHdvdWxkIGJlIHNhZmVyLlxuICAgKlxuICAgKiBAZGVmYXVsdCBBV1NDbG91ZEZvcm1hdGlvblN0YWNrU2V0RXhlY3V0aW9uUm9sZVxuICAgKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL3N0YWNrc2V0cy1wcmVyZXFzLXNlbGYtbWFuYWdlZC5odG1sXG4gICAqL1xuICByZWFkb25seSBleGVjdXRpb25Sb2xlTmFtZT86IHN0cmluZztcbn1cbiJdfQ==