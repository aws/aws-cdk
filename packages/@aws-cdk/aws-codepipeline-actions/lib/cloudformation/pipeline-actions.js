"use strict";
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CloudFormationDeleteStackAction = exports.CloudFormationCreateUpdateStackAction = exports.CloudFormationCreateReplaceChangeSetAction = exports.CloudFormationExecuteChangeSetAction = void 0;
const jsiiDeprecationWarnings = require("../../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const cloudformation = require("@aws-cdk/aws-cloudformation");
const codepipeline = require("@aws-cdk/aws-codepipeline");
const iam = require("@aws-cdk/aws-iam");
const cdk = require("@aws-cdk/core");
const singleton_policy_1 = require("./private/singleton-policy");
const action_1 = require("../action");
/**
 * Base class for Actions that execute CloudFormation
 */
class CloudFormationAction extends action_1.Action {
    constructor(props, inputs) {
        super({
            ...props,
            provider: 'CloudFormation',
            category: codepipeline.ActionCategory.DEPLOY,
            artifactBounds: {
                minInputs: 0,
                maxInputs: 10,
                minOutputs: 0,
                maxOutputs: 1,
            },
            inputs,
            outputs: props.outputFileName
                ? [props.output || new codepipeline.Artifact(`${props.actionName}_${props.stackName}_Artifact`)]
                : undefined,
        });
        this.props = props;
    }
    bound(_scope, _stage, options) {
        const singletonPolicy = singleton_policy_1.SingletonPolicy.forRole(options.role);
        if ((this.actionProperties.outputs || []).length > 0) {
            options.bucket.grantReadWrite(singletonPolicy);
        }
        else if ((this.actionProperties.inputs || []).length > 0) {
            options.bucket.grantRead(singletonPolicy);
        }
        return {
            configuration: {
                StackName: this.props.stackName,
                OutputFileName: this.props.outputFileName,
            },
        };
    }
}
/**
 * CodePipeline action to execute a prepared change set.
 */
class CloudFormationExecuteChangeSetAction extends CloudFormationAction {
    constructor(props) {
        super(props, undefined);
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_codepipeline_actions_CloudFormationExecuteChangeSetActionProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, CloudFormationExecuteChangeSetAction);
            }
            throw error;
        }
        this.props2 = props;
    }
    bound(scope, stage, options) {
        singleton_policy_1.SingletonPolicy.forRole(options.role).grantExecuteChangeSet(this.props2);
        const actionConfig = super.bound(scope, stage, options);
        return {
            ...actionConfig,
            configuration: {
                ...actionConfig.configuration,
                ActionMode: 'CHANGE_SET_EXECUTE',
                ChangeSetName: this.props2.changeSetName,
            },
        };
    }
}
exports.CloudFormationExecuteChangeSetAction = CloudFormationExecuteChangeSetAction;
_a = JSII_RTTI_SYMBOL_1;
CloudFormationExecuteChangeSetAction[_a] = { fqn: "@aws-cdk/aws-codepipeline-actions.CloudFormationExecuteChangeSetAction", version: "0.0.0" };
/**
 * Base class for all CloudFormation actions that execute or stage deployments.
 */
class CloudFormationDeployAction extends CloudFormationAction {
    constructor(props, inputs) {
        super(props, (props.extraInputs || []).concat(inputs || []));
        this.props2 = props;
    }
    /**
     * Add statement to the service role assumed by CloudFormation while executing this action.
     */
    addToDeploymentRolePolicy(statement) {
        return this.getDeploymentRole('method addToRolePolicy()').addToPolicy(statement);
    }
    get deploymentRole() {
        return this.getDeploymentRole('property role()');
    }
    bound(scope, stage, options) {
        if (this.props2.deploymentRole) {
            this._deploymentRole = this.props2.deploymentRole;
        }
        else {
            const roleStack = cdk.Stack.of(options.role);
            const pipelineStack = cdk.Stack.of(scope);
            if (roleStack.account !== pipelineStack.account) {
                // pass role is not allowed for cross-account access - so,
                // create the deployment Role in the other account!
                this._deploymentRole = new iam.Role(roleStack, `${cdk.Names.nodeUniqueId(stage.pipeline.node)}-${stage.stageName}-${this.actionProperties.actionName}-DeploymentRole`, {
                    assumedBy: new iam.ServicePrincipal('cloudformation.amazonaws.com'),
                    roleName: cdk.PhysicalName.GENERATE_IF_NEEDED,
                });
            }
            else {
                this._deploymentRole = new iam.Role(scope, 'Role', {
                    assumedBy: new iam.ServicePrincipal('cloudformation.amazonaws.com'),
                });
            }
            // the deployment role might need read access to the pipeline's bucket
            // (for example, if it's deploying a Lambda function),
            // and even if it has admin permissions, it won't be enough,
            // as it needs to be added to the key's resource policy
            // (and the bucket's, if the access is cross-account)
            options.bucket.grantRead(this._deploymentRole);
            if (this.props2.adminPermissions) {
                this._deploymentRole.addToPolicy(new iam.PolicyStatement({
                    actions: ['*'],
                    resources: ['*'],
                }));
            }
        }
        singleton_policy_1.SingletonPolicy.forRole(options.role).grantPassRole(this._deploymentRole);
        const providedCapabilities = this.props2.cfnCapabilities ??
            this.props2.capabilities?.map(c => {
                switch (c) {
                    case cloudformation.CloudFormationCapabilities.NONE: return cdk.CfnCapabilities.NONE;
                    case cloudformation.CloudFormationCapabilities.ANONYMOUS_IAM: return cdk.CfnCapabilities.ANONYMOUS_IAM;
                    case cloudformation.CloudFormationCapabilities.NAMED_IAM: return cdk.CfnCapabilities.NAMED_IAM;
                    case cloudformation.CloudFormationCapabilities.AUTO_EXPAND: return cdk.CfnCapabilities.AUTO_EXPAND;
                }
            });
        const capabilities = this.props2.adminPermissions && providedCapabilities === undefined
            ? [cdk.CfnCapabilities.NAMED_IAM]
            : providedCapabilities;
        const actionConfig = super.bound(scope, stage, options);
        return {
            ...actionConfig,
            configuration: {
                ...actionConfig.configuration,
                // None evaluates to empty string which is falsey and results in undefined
                Capabilities: singleton_policy_1.parseCapabilities(capabilities),
                RoleArn: this.deploymentRole.roleArn,
                ParameterOverrides: cdk.Stack.of(scope).toJsonString(this.props2.parameterOverrides),
                TemplateConfiguration: this.props2.templateConfiguration
                    ? this.props2.templateConfiguration.location
                    : undefined,
                StackName: this.props2.stackName,
            },
        };
    }
    getDeploymentRole(member) {
        if (this._deploymentRole) {
            return this._deploymentRole;
        }
        else {
            throw new Error(`Cannot use the ${member} before the Action has been added to a Pipeline`);
        }
    }
}
/**
 * CodePipeline action to prepare a change set.
 *
 * Creates the change set if it doesn't exist based on the stack name and template that you submit.
 * If the change set exists, AWS CloudFormation deletes it, and then creates a new one.
 */
class CloudFormationCreateReplaceChangeSetAction extends CloudFormationDeployAction {
    constructor(props) {
        super(props, props.templateConfiguration
            ? [props.templatePath.artifact, props.templateConfiguration.artifact]
            : [props.templatePath.artifact]);
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_codepipeline_actions_CloudFormationCreateReplaceChangeSetActionProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, CloudFormationCreateReplaceChangeSetAction);
            }
            throw error;
        }
        this.props3 = props;
    }
    bound(scope, stage, options) {
        // the super call order is to preserve the existing order of statements in policies
        const actionConfig = super.bound(scope, stage, options);
        singleton_policy_1.SingletonPolicy.forRole(options.role).grantCreateReplaceChangeSet(this.props3);
        return {
            ...actionConfig,
            configuration: {
                ...actionConfig.configuration,
                ActionMode: 'CHANGE_SET_REPLACE',
                ChangeSetName: this.props3.changeSetName,
                TemplatePath: this.props3.templatePath.location,
            },
        };
    }
}
exports.CloudFormationCreateReplaceChangeSetAction = CloudFormationCreateReplaceChangeSetAction;
_b = JSII_RTTI_SYMBOL_1;
CloudFormationCreateReplaceChangeSetAction[_b] = { fqn: "@aws-cdk/aws-codepipeline-actions.CloudFormationCreateReplaceChangeSetAction", version: "0.0.0" };
/**
 * CodePipeline action to deploy a stack.
 *
 * Creates the stack if the specified stack doesn't exist. If the stack exists,
 * AWS CloudFormation updates the stack. Use this action to update existing
 * stacks.
 *
 * AWS CodePipeline won't replace the stack, and will fail deployment if the
 * stack is in a failed state. Use `ReplaceOnFailure` for an action that
 * will delete and recreate the stack to try and recover from failed states.
 *
 * Use this action to automatically replace failed stacks without recovering or
 * troubleshooting them. You would typically choose this mode for testing.
 */
class CloudFormationCreateUpdateStackAction extends CloudFormationDeployAction {
    constructor(props) {
        super(props, props.templateConfiguration
            ? [props.templatePath.artifact, props.templateConfiguration.artifact]
            : [props.templatePath.artifact]);
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_codepipeline_actions_CloudFormationCreateUpdateStackActionProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, CloudFormationCreateUpdateStackAction);
            }
            throw error;
        }
        this.props3 = props;
    }
    bound(scope, stage, options) {
        // the super call order is to preserve the existing order of statements in policies
        const actionConfig = super.bound(scope, stage, options);
        singleton_policy_1.SingletonPolicy.forRole(options.role).grantCreateUpdateStack(this.props3);
        return {
            ...actionConfig,
            configuration: {
                ...actionConfig.configuration,
                ActionMode: this.props3.replaceOnFailure ? 'REPLACE_ON_FAILURE' : 'CREATE_UPDATE',
                TemplatePath: this.props3.templatePath.location,
            },
        };
    }
}
exports.CloudFormationCreateUpdateStackAction = CloudFormationCreateUpdateStackAction;
_c = JSII_RTTI_SYMBOL_1;
CloudFormationCreateUpdateStackAction[_c] = { fqn: "@aws-cdk/aws-codepipeline-actions.CloudFormationCreateUpdateStackAction", version: "0.0.0" };
/**
 * CodePipeline action to delete a stack.
 *
 * Deletes a stack. If you specify a stack that doesn't exist, the action completes successfully
 * without deleting a stack.
 */
class CloudFormationDeleteStackAction extends CloudFormationDeployAction {
    constructor(props) {
        super(props, undefined);
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_codepipeline_actions_CloudFormationDeleteStackActionProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, CloudFormationDeleteStackAction);
            }
            throw error;
        }
        this.props3 = props;
    }
    bound(scope, stage, options) {
        // the super call order is to preserve the existing order of statements in policies
        const actionConfig = super.bound(scope, stage, options);
        singleton_policy_1.SingletonPolicy.forRole(options.role).grantDeleteStack(this.props3);
        return {
            ...actionConfig,
            configuration: {
                ...actionConfig.configuration,
                ActionMode: 'DELETE_ONLY',
            },
        };
    }
}
exports.CloudFormationDeleteStackAction = CloudFormationDeleteStackAction;
_d = JSII_RTTI_SYMBOL_1;
CloudFormationDeleteStackAction[_d] = { fqn: "@aws-cdk/aws-codepipeline-actions.CloudFormationDeleteStackAction", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGlwZWxpbmUtYWN0aW9ucy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInBpcGVsaW5lLWFjdGlvbnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsOERBQThEO0FBQzlELDBEQUEwRDtBQUMxRCx3Q0FBd0M7QUFDeEMscUNBQXFDO0FBRXJDLGlFQUFnRjtBQUNoRixzQ0FBbUM7QUFzRG5DOztHQUVHO0FBQ0gsTUFBZSxvQkFBcUIsU0FBUSxlQUFNO0lBR2hELFlBQVksS0FBZ0MsRUFBRSxNQUEyQztRQUN2RixLQUFLLENBQUM7WUFDSixHQUFHLEtBQUs7WUFDUixRQUFRLEVBQUUsZ0JBQWdCO1lBQzFCLFFBQVEsRUFBRSxZQUFZLENBQUMsY0FBYyxDQUFDLE1BQU07WUFDNUMsY0FBYyxFQUFFO2dCQUNkLFNBQVMsRUFBRSxDQUFDO2dCQUNaLFNBQVMsRUFBRSxFQUFFO2dCQUNiLFVBQVUsRUFBRSxDQUFDO2dCQUNiLFVBQVUsRUFBRSxDQUFDO2FBQ2Q7WUFDRCxNQUFNO1lBQ04sT0FBTyxFQUFFLEtBQUssQ0FBQyxjQUFjO2dCQUMzQixDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsTUFBTSxJQUFJLElBQUksWUFBWSxDQUFDLFFBQVEsQ0FBQyxHQUFHLEtBQUssQ0FBQyxVQUFVLElBQUksS0FBSyxDQUFDLFNBQVMsV0FBVyxDQUFDLENBQUM7Z0JBQ2hHLENBQUMsQ0FBQyxTQUFTO1NBQ2QsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7S0FDcEI7SUFFUyxLQUFLLENBQUMsTUFBaUIsRUFBRSxNQUEyQixFQUFFLE9BQXVDO1FBRXJHLE1BQU0sZUFBZSxHQUFHLGtDQUFlLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUU5RCxJQUFJLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sSUFBSSxFQUFFLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO1lB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OztHQUtHO0FBQ0gsTUFBYSwrQkFBZ0MsU0FBUSwwQkFBMEI7SUFHN0UsWUFBWSxLQUEyQztRQUNyRCxLQUFLLENBQUMsS0FBSyxFQUFFLFNBQVMsQ0FBQyxDQUFDOzs7Ozs7K0NBSmYsK0JBQStCOzs7O1FBTXhDLElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO0tBQ3JCO0lBRVMsS0FBSyxDQUFDLEtBQWdCLEVBQUUsS0FBMEIsRUFBRSxPQUF1QztRQUVuRyxtRkFBbUY7UUFDbkYsTUFBTSxZQUFZLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBRXhELGtDQUFlLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFFcEUsT0FBTztZQUNMLEdBQUcsWUFBWTtZQUNmLGFBQWEsRUFBRTtnQkFDYixHQUFHLFlBQVksQ0FBQyxhQUFhO2dCQUM3QixVQUFVLEVBQUUsYUFBYTthQUMxQjtTQUNGLENBQUM7S0FDSDs7QUF2QkgsMEVBd0JDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgY2xvdWRmb3JtYXRpb24gZnJvbSAnQGF3cy1jZGsvYXdzLWNsb3VkZm9ybWF0aW9uJztcbmltcG9ydCAqIGFzIGNvZGVwaXBlbGluZSBmcm9tICdAYXdzLWNkay9hd3MtY29kZXBpcGVsaW5lJztcbmltcG9ydCAqIGFzIGlhbSBmcm9tICdAYXdzLWNkay9hd3MtaWFtJztcbmltcG9ydCAqIGFzIGNkayBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0IHsgcGFyc2VDYXBhYmlsaXRpZXMsIFNpbmdsZXRvblBvbGljeSB9IGZyb20gJy4vcHJpdmF0ZS9zaW5nbGV0b24tcG9saWN5JztcbmltcG9ydCB7IEFjdGlvbiB9IGZyb20gJy4uL2FjdGlvbic7XG5cbi8qKlxuICogUHJvcGVydGllcyBjb21tb24gdG8gYWxsIENsb3VkRm9ybWF0aW9uIGFjdGlvbnNcbiAqL1xuaW50ZXJmYWNlIENsb3VkRm9ybWF0aW9uQWN0aW9uUHJvcHMgZXh0ZW5kcyBjb2RlcGlwZWxpbmUuQ29tbW9uQXdzQWN0aW9uUHJvcHMge1xuICAvKipcbiAgICogVGhlIG5hbWUgb2YgdGhlIHN0YWNrIHRvIGFwcGx5IHRoaXMgYWN0aW9uIHRvXG4gICAqL1xuICByZWFkb25seSBzdGFja05hbWU6IHN0cmluZztcblxuICAvKipcbiAgICogQSBuYW1lIGZvciB0aGUgZmlsZW5hbWUgaW4gdGhlIG91dHB1dCBhcnRpZmFjdCB0byBzdG9yZSB0aGUgQVdTIENsb3VkRm9ybWF0aW9uIGNhbGwncyByZXN1bHQuXG4gICAqXG4gICAqIFRoZSBmaWxlIHdpbGwgY29udGFpbiB0aGUgcmVzdWx0IG9mIHRoZSBjYWxsIHRvIEFXUyBDbG91ZEZvcm1hdGlvbiAoZm9yIGV4YW1wbGVcbiAgICogdGhlIGNhbGwgdG8gVXBkYXRlU3RhY2sgb3IgQ3JlYXRlQ2hhbmdlU2V0KS5cbiAgICpcbiAgICogQVdTIENvZGVQaXBlbGluZSBhZGRzIHRoZSBmaWxlIHRvIHRoZSBvdXRwdXQgYXJ0aWZhY3QgYWZ0ZXIgcGVyZm9ybWluZ1xuICAgKiB0aGUgc3BlY2lmaWVkIGFjdGlvbi5cbiAgICpcbiAgICogQGRlZmF1bHQgTm8gb3V0cHV0IGFydGlmYWN0IGdlbmVyYXRlZFxuICAgKi9cbiAgcmVhZG9ubHkgb3V0cHV0RmlsZU5hbWU/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBuYW1lIG9mIHRoZSBvdXRwdXQgYXJ0aWZhY3QgdG8gZ2VuZXJhdGVcbiAgICpcbiAgICogT25seSBhcHBsaWVkIGlmIGBvdXRwdXRGaWxlTmFtZWAgaXMgc2V0IGFzIHdlbGwuXG4gICAqXG4gICAqIEBkZWZhdWx0IEF1dG9tYXRpY2FsbHkgZ2VuZXJhdGVkIGFydGlmYWN0IG5hbWUuXG4gICAqL1xuICByZWFkb25seSBvdXRwdXQ/OiBjb2RlcGlwZWxpbmUuQXJ0aWZhY3Q7XG5cbiAgLyoqXG4gICAqIFRoZSBBV1MgcmVnaW9uIHRoZSBnaXZlbiBBY3Rpb24gcmVzaWRlcyBpbi5cbiAgICogTm90ZSB0aGF0IGEgY3Jvc3MtcmVnaW9uIFBpcGVsaW5lIHJlcXVpcmVzIHJlcGxpY2F0aW9uIGJ1Y2tldHMgdG8gZnVuY3Rpb24gY29ycmVjdGx5LlxuICAgKiBZb3UgY2FuIHByb3ZpZGUgdGhlaXIgbmFtZXMgd2l0aCB0aGUgYFBpcGVsaW5lUHJvcHMjY3Jvc3NSZWdpb25SZXBsaWNhdGlvbkJ1Y2tldHNgIHByb3BlcnR5LlxuICAgKiBJZiB5b3UgZG9uJ3QsIHRoZSBDb2RlUGlwZWxpbmUgQ29uc3RydWN0IHdpbGwgY3JlYXRlIG5ldyBTdGFja3MgaW4geW91ciBDREsgYXBwIGNvbnRhaW5pbmcgdGhvc2UgYnVja2V0cyxcbiAgICogdGhhdCB5b3Ugd2lsbCBuZWVkIHRvIGBjZGsgZGVwbG95YCBiZWZvcmUgZGVwbG95aW5nIHRoZSBtYWluLCBQaXBlbGluZS1jb250YWluaW5nIFN0YWNrLlxuICAgKlxuICAgKiBAZGVmYXVsdCB0aGUgQWN0aW9uIHJlc2lkZXMgaW4gdGhlIHNhbWUgcmVnaW9uIGFzIHRoZSBQaXBlbGluZVxuICAgKi9cbiAgcmVhZG9ubHkgcmVnaW9uPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgQVdTIGFjY291bnQgdGhpcyBBY3Rpb24gaXMgc3VwcG9zZWQgdG8gb3BlcmF0ZSBpbi5cbiAgICogKipOb3RlKio6IGlmIHlvdSBzcGVjaWZ5IHRoZSBgcm9sZWAgcHJvcGVydHksXG4gICAqIHRoaXMgaXMgaWdub3JlZCAtIHRoZSBhY3Rpb24gd2lsbCBvcGVyYXRlIGluIHRoZSBzYW1lIHJlZ2lvbiB0aGUgcGFzc2VkIHJvbGUgZG9lcy5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBhY3Rpb24gcmVzaWRlcyBpbiB0aGUgc2FtZSBhY2NvdW50IGFzIHRoZSBwaXBlbGluZVxuICAgKi9cbiAgcmVhZG9ubHkgYWNjb3VudD86IHN0cmluZztcbn1cblxuLyoqXG4gKiBCYXNlIGNsYXNzIGZvciBBY3Rpb25zIHRoYXQgZXhlY3V0ZSBDbG91ZEZvcm1hdGlvblxuICovXG5hYnN0cmFjdCBjbGFzcyBDbG91ZEZvcm1hdGlvbkFjdGlvbiBleHRlbmRzIEFjdGlvbiB7XG4gIHByaXZhdGUgcmVhZG9ubHkgcHJvcHM6IENsb3VkRm9ybWF0aW9uQWN0aW9uUHJvcHM7XG5cbiAgY29uc3RydWN0b3IocHJvcHM6IENsb3VkRm9ybWF0aW9uQWN0aW9uUHJvcHMsIGlucHV0czogY29kZXBpcGVsaW5lLkFydGlmYWN0W10gfCB1bmRlZmluZWQpIHtcbiAgICBzdXBlcih7XG4gICAgICAuLi5wcm9wcyxcbiAgICAgIHByb3ZpZGVyOiAnQ2xvdWRGb3JtYXRpb24nLFxuICAgICAgY2F0ZWdvcnk6IGNvZGVwaXBlbGluZS5BY3Rpb25DYXRlZ29yeS5ERVBMT1ksXG4gICAgICBhcnRpZmFjdEJvdW5kczoge1xuICAgICAgICBtaW5JbnB1dHM6IDAsXG4gICAgICAgIG1heElucHV0czogMTAsXG4gICAgICAgIG1pbk91dHB1dHM6IDAsXG4gICAgICAgIG1heE91dHB1dHM6IDEsXG4gICAgICB9LFxuICAgICAgaW5wdXRzLFxuICAgICAgb3V0cHV0czogcHJvcHMub3V0cHV0RmlsZU5hbWVcbiAgICAgICAgPyBbcHJvcHMub3V0cHV0IHx8IG5ldyBjb2RlcGlwZWxpbmUuQXJ0aWZhY3QoYCR7cHJvcHMuYWN0aW9uTmFtZX1fJHtwcm9wcy5zdGFja05hbWV9X0FydGlmYWN0YCldXG4gICAgICAgIDogdW5kZWZpbmVkLFxuICAgIH0pO1xuXG4gICAgdGhpcy5wcm9wcyA9IHByb3BzO1xuICB9XG5cbiAgcHJvdGVjdGVkIGJvdW5kKF9zY29wZTogQ29uc3RydWN0LCBfc3RhZ2U6IGNvZGVwaXBlbGluZS5JU3RhZ2UsIG9wdGlvbnM6IGNvZGVwaXBlbGluZS5BY3Rpb25CaW5kT3B0aW9ucyk6XG4gIGNvZGVwaXBlbGluZS5BY3Rpb25Db25maWcge1xuICAgIGNvbnN0IHNpbmdsZXRvblBvbGljeSA9IFNpbmdsZXRvblBvbGljeS5mb3JSb2xlKG9wdGlvbnMucm9sZSk7XG5cbiAgICBpZiAoKHRoaXMuYWN0aW9uUHJvcGVydGllcy5vdXRwdXRzIHx8IFtdKS5sZW5ndGggPiAwKSB7XG4gICAgICBvcHRpb25zLmJ1Y2tldC5ncmFudFJlYWRXcml0ZShzaW5nbGV0b25Qb2xpY3kpO1xuICAgIH0gZWxzZSBpZiAoKHRoaXMuYWN0aW9uUHJvcGVydGllcy5pbnB1dHMgfHwgW10pLmxlbmd0aCA+IDApIHtcbiAgICAgIG9wdGlvbnMuYnVja2V0LmdyYW50UmVhZChzaW5nbGV0b25Qb2xpY3kpO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICBjb25maWd1cmF0aW9uOiB7XG4gICAgICAgIFN0YWNrTmFtZTogdGhpcy5wcm9wcy5zdGFja05hbWUsXG4gICAgICAgIE91dHB1dEZpbGVOYW1lOiB0aGlzLnByb3BzLm91dHB1dEZpbGVOYW1lLFxuICAgICAgfSxcbiAgICB9O1xuICB9XG59XG5cbi8qKlxuICogUHJvcGVydGllcyBmb3IgdGhlIENsb3VkRm9ybWF0aW9uRXhlY3V0ZUNoYW5nZVNldEFjdGlvbi5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBDbG91ZEZvcm1hdGlvbkV4ZWN1dGVDaGFuZ2VTZXRBY3Rpb25Qcm9wcyBleHRlbmRzIENsb3VkRm9ybWF0aW9uQWN0aW9uUHJvcHMge1xuICAvKipcbiAgICogTmFtZSBvZiB0aGUgY2hhbmdlIHNldCB0byBleGVjdXRlLlxuICAgKi9cbiAgcmVhZG9ubHkgY2hhbmdlU2V0TmFtZTogc3RyaW5nO1xufVxuXG4vKipcbiAqIENvZGVQaXBlbGluZSBhY3Rpb24gdG8gZXhlY3V0ZSBhIHByZXBhcmVkIGNoYW5nZSBzZXQuXG4gKi9cbmV4cG9ydCBjbGFzcyBDbG91ZEZvcm1hdGlvbkV4ZWN1dGVDaGFuZ2VTZXRBY3Rpb24gZXh0ZW5kcyBDbG91ZEZvcm1hdGlvbkFjdGlvbiB7XG4gIHByaXZhdGUgcmVhZG9ubHkgcHJvcHMyOiBDbG91ZEZvcm1hdGlvbkV4ZWN1dGVDaGFuZ2VTZXRBY3Rpb25Qcm9wcztcblxuICBjb25zdHJ1Y3Rvcihwcm9wczogQ2xvdWRGb3JtYXRpb25FeGVjdXRlQ2hhbmdlU2V0QWN0aW9uUHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcywgdW5kZWZpbmVkKTtcblxuICAgIHRoaXMucHJvcHMyID0gcHJvcHM7XG4gIH1cblxuICBwcm90ZWN0ZWQgYm91bmQoc2NvcGU6IENvbnN0cnVjdCwgc3RhZ2U6IGNvZGVwaXBlbGluZS5JU3RhZ2UsIG9wdGlvbnM6IGNvZGVwaXBlbGluZS5BY3Rpb25CaW5kT3B0aW9ucyk6XG4gIGNvZGVwaXBlbGluZS5BY3Rpb25Db25maWcge1xuICAgIFNpbmdsZXRvblBvbGljeS5mb3JSb2xlKG9wdGlvbnMucm9sZSkuZ3JhbnRFeGVjdXRlQ2hhbmdlU2V0KHRoaXMucHJvcHMyKTtcblxuICAgIGNvbnN0IGFjdGlvbkNvbmZpZyA9IHN1cGVyLmJvdW5kKHNjb3BlLCBzdGFnZSwgb3B0aW9ucyk7XG4gICAgcmV0dXJuIHtcbiAgICAgIC4uLmFjdGlvbkNvbmZpZyxcbiAgICAgIGNvbmZpZ3VyYXRpb246IHtcbiAgICAgICAgLi4uYWN0aW9uQ29uZmlnLmNvbmZpZ3VyYXRpb24sXG4gICAgICAgIEFjdGlvbk1vZGU6ICdDSEFOR0VfU0VUX0VYRUNVVEUnLFxuICAgICAgICBDaGFuZ2VTZXROYW1lOiB0aGlzLnByb3BzMi5jaGFuZ2VTZXROYW1lLFxuICAgICAgfSxcbiAgICB9O1xuICB9XG59XG5cbi8qKlxuICogUHJvcGVydGllcyBjb21tb24gdG8gQ2xvdWRGb3JtYXRpb24gYWN0aW9ucyB0aGF0IHN0YWdlIGRlcGxveW1lbnRzXG4gKi9cbmludGVyZmFjZSBDbG91ZEZvcm1hdGlvbkRlcGxveUFjdGlvblByb3BzIGV4dGVuZHMgQ2xvdWRGb3JtYXRpb25BY3Rpb25Qcm9wcyB7XG4gIC8qKlxuICAgKiBJQU0gcm9sZSB0byBhc3N1bWUgd2hlbiBkZXBsb3lpbmcgY2hhbmdlcy5cbiAgICpcbiAgICogSWYgbm90IHNwZWNpZmllZCwgYSBmcmVzaCByb2xlIGlzIGNyZWF0ZWQuIFRoZSByb2xlIGlzIGNyZWF0ZWQgd2l0aCB6ZXJvXG4gICAqIHBlcm1pc3Npb25zIHVubGVzcyBgYWRtaW5QZXJtaXNzaW9uc2AgaXMgdHJ1ZSwgaW4gd2hpY2ggY2FzZSB0aGUgcm9sZSB3aWxsIGhhdmVcbiAgICogZnVsbCBwZXJtaXNzaW9ucy5cbiAgICpcbiAgICogQGRlZmF1bHQgQSBmcmVzaCByb2xlIHdpdGggZnVsbCBvciBubyBwZXJtaXNzaW9ucyAoZGVwZW5kaW5nIG9uIHRoZSB2YWx1ZSBvZiBgYWRtaW5QZXJtaXNzaW9uc2ApLlxuICAgKi9cbiAgcmVhZG9ubHkgZGVwbG95bWVudFJvbGU/OiBpYW0uSVJvbGU7XG5cbiAgLyoqXG4gICAqIEFja25vd2xlZGdlIGNlcnRhaW4gY2hhbmdlcyBtYWRlIGFzIHBhcnQgb2YgZGVwbG95bWVudFxuICAgKlxuICAgKiBGb3Igc3RhY2tzIHRoYXQgY29udGFpbiBjZXJ0YWluIHJlc291cmNlcywgZXhwbGljaXQgYWNrbm93bGVkZ2VtZW50IHRoYXQgQVdTIENsb3VkRm9ybWF0aW9uXG4gICAqIG1pZ2h0IGNyZWF0ZSBvciB1cGRhdGUgdGhvc2UgcmVzb3VyY2VzLiBGb3IgZXhhbXBsZSwgeW91IG11c3Qgc3BlY2lmeSBgQW5vbnltb3VzSUFNYCBvciBgTmFtZWRJQU1gXG4gICAqIGlmIHlvdXIgc3RhY2sgdGVtcGxhdGUgY29udGFpbnMgQVdTIElkZW50aXR5IGFuZCBBY2Nlc3MgTWFuYWdlbWVudCAoSUFNKSByZXNvdXJjZXMuIEZvciBtb3JlXG4gICAqIGluZm9ybWF0aW9uIHNlZSB0aGUgbGluayBiZWxvdy5cbiAgICpcbiAgICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS91c2luZy1pYW0tdGVtcGxhdGUuaHRtbCN1c2luZy1pYW0tY2FwYWJpbGl0aWVzXG4gICAqIEBkZWZhdWx0IE5vbmUsIHVubGVzcyBgYWRtaW5QZXJtaXNzaW9uc2AgaXMgdHJ1ZVxuICAgKiBAZGVwcmVjYXRlZCB1c2UgYGNmbkNhcGFiaWxpdGllc2AgaW5zdGVhZFxuICAgKi9cbiAgcmVhZG9ubHkgY2FwYWJpbGl0aWVzPzogY2xvdWRmb3JtYXRpb24uQ2xvdWRGb3JtYXRpb25DYXBhYmlsaXRpZXNbXTtcblxuICAvKipcbiAgICogQWNrbm93bGVkZ2UgY2VydGFpbiBjaGFuZ2VzIG1hZGUgYXMgcGFydCBvZiBkZXBsb3ltZW50LlxuICAgKlxuICAgKiBGb3Igc3RhY2tzIHRoYXQgY29udGFpbiBjZXJ0YWluIHJlc291cmNlcyxcbiAgICogZXhwbGljaXQgYWNrbm93bGVkZ2VtZW50IGlzIHJlcXVpcmVkIHRoYXQgQVdTIENsb3VkRm9ybWF0aW9uIG1pZ2h0IGNyZWF0ZSBvciB1cGRhdGUgdGhvc2UgcmVzb3VyY2VzLlxuICAgKiBGb3IgZXhhbXBsZSwgeW91IG11c3Qgc3BlY2lmeSBgQU5PTllNT1VTX0lBTWAgb3IgYE5BTUVEX0lBTWAgaWYgeW91ciBzdGFjayB0ZW1wbGF0ZSBjb250YWlucyBBV1NcbiAgICogSWRlbnRpdHkgYW5kIEFjY2VzcyBNYW5hZ2VtZW50IChJQU0pIHJlc291cmNlcy5cbiAgICogRm9yIG1vcmUgaW5mb3JtYXRpb24sIHNlZSB0aGUgbGluayBiZWxvdy5cbiAgICpcbiAgICogQGRlZmF1bHQgTm9uZSwgdW5sZXNzIGBhZG1pblBlcm1pc3Npb25zYCBpcyB0cnVlXG4gICAqXG4gICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvdXNpbmctaWFtLXRlbXBsYXRlLmh0bWwjdXNpbmctaWFtLWNhcGFiaWxpdGllc1xuICAgKi9cbiAgcmVhZG9ubHkgY2ZuQ2FwYWJpbGl0aWVzPzogY2RrLkNmbkNhcGFiaWxpdGllc1tdO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRvIGdyYW50IGZ1bGwgcGVybWlzc2lvbnMgdG8gQ2xvdWRGb3JtYXRpb24gd2hpbGUgZGVwbG95aW5nIHRoaXMgdGVtcGxhdGUuXG4gICAqXG4gICAqIFNldHRpbmcgdGhpcyB0byBgdHJ1ZWAgYWZmZWN0cyB0aGUgZGVmYXVsdHMgZm9yIGByb2xlYCBhbmQgYGNhcGFiaWxpdGllc2AsIGlmIHlvdVxuICAgKiBkb24ndCBzcGVjaWZ5IGFueSBhbHRlcm5hdGl2ZXMuXG4gICAqXG4gICAqIFRoZSBkZWZhdWx0IHJvbGUgdGhhdCB3aWxsIGJlIGNyZWF0ZWQgZm9yIHlvdSB3aWxsIGhhdmUgZnVsbCAoaS5lLiwgYCpgKVxuICAgKiBwZXJtaXNzaW9ucyBvbiBhbGwgcmVzb3VyY2VzLCBhbmQgdGhlIGRlcGxveW1lbnQgd2lsbCBoYXZlIG5hbWVkIElBTVxuICAgKiBjYXBhYmlsaXRpZXMgKGkuZS4sIGFibGUgdG8gY3JlYXRlIGFsbCBJQU0gcmVzb3VyY2VzKS5cbiAgICpcbiAgICogVGhpcyBpcyBhIHNob3J0aGFuZCB0aGF0IHlvdSBjYW4gdXNlIGlmIHlvdSBmdWxseSB0cnVzdCB0aGUgdGVtcGxhdGVzIHRoYXRcbiAgICogYXJlIGRlcGxveWVkIGluIHRoaXMgcGlwZWxpbmUuIElmIHlvdSB3YW50IG1vcmUgZmluZS1ncmFpbmVkIHBlcm1pc3Npb25zLFxuICAgKiB1c2UgYGFkZFRvUm9sZVBvbGljeWAgYW5kIGBjYXBhYmlsaXRpZXNgIHRvIGNvbnRyb2wgd2hhdCB0aGUgQ2xvdWRGb3JtYXRpb25cbiAgICogZGVwbG95bWVudCBpcyBhbGxvd2VkIHRvIGRvLlxuICAgKi9cbiAgcmVhZG9ubHkgYWRtaW5QZXJtaXNzaW9uczogYm9vbGVhbjtcblxuICAvKipcbiAgICogSW5wdXQgYXJ0aWZhY3QgdG8gdXNlIGZvciB0ZW1wbGF0ZSBwYXJhbWV0ZXJzIHZhbHVlcyBhbmQgc3RhY2sgcG9saWN5LlxuICAgKlxuICAgKiBUaGUgdGVtcGxhdGUgY29uZmlndXJhdGlvbiBmaWxlIHNob3VsZCBjb250YWluIGEgSlNPTiBvYmplY3QgdGhhdCBzaG91bGQgbG9vayBsaWtlIHRoaXM6XG4gICAqIGB7IFwiUGFyYW1ldGVyc1wiOiB7Li4ufSwgXCJUYWdzXCI6IHsuLi59LCBcIlN0YWNrUG9saWN5XCI6IHsuLi4gfX1gLiBGb3IgbW9yZSBpbmZvcm1hdGlvbixcbiAgICogc2VlIFtBV1MgQ2xvdWRGb3JtYXRpb24gQXJ0aWZhY3RzXShodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9jb250aW51b3VzLWRlbGl2ZXJ5LWNvZGVwaXBlbGluZS1jZm4tYXJ0aWZhY3RzLmh0bWwpLlxuICAgKlxuICAgKiBOb3RlIHRoYXQgaWYgeW91IGluY2x1ZGUgc2Vuc2l0aXZlIGluZm9ybWF0aW9uLCBzdWNoIGFzIHBhc3N3b3JkcywgcmVzdHJpY3QgYWNjZXNzIHRvIHRoaXNcbiAgICogZmlsZS5cbiAgICpcbiAgICogQGRlZmF1bHQgTm8gdGVtcGxhdGUgY29uZmlndXJhdGlvbiBiYXNlZCBvbiBpbnB1dCBhcnRpZmFjdHNcbiAgICovXG4gIHJlYWRvbmx5IHRlbXBsYXRlQ29uZmlndXJhdGlvbj86IGNvZGVwaXBlbGluZS5BcnRpZmFjdFBhdGg7XG5cbiAgLyoqXG4gICAqIEFkZGl0aW9uYWwgdGVtcGxhdGUgcGFyYW1ldGVycy5cbiAgICpcbiAgICogVGVtcGxhdGUgcGFyYW1ldGVycyBzcGVjaWZpZWQgaGVyZSB0YWtlIHByZWNlZGVuY2Ugb3ZlciB0ZW1wbGF0ZSBwYXJhbWV0ZXJzXG4gICAqIGZvdW5kIGluIHRoZSBhcnRpZmFjdCBzcGVjaWZpZWQgYnkgdGhlIGB0ZW1wbGF0ZUNvbmZpZ3VyYXRpb25gIHByb3BlcnR5LlxuICAgKlxuICAgKiBXZSByZWNvbW1lbmQgdGhhdCB5b3UgdXNlIHRoZSB0ZW1wbGF0ZSBjb25maWd1cmF0aW9uIGZpbGUgdG8gc3BlY2lmeVxuICAgKiBtb3N0IG9mIHlvdXIgcGFyYW1ldGVyIHZhbHVlcy4gVXNlIHBhcmFtZXRlciBvdmVycmlkZXMgdG8gc3BlY2lmeSBvbmx5XG4gICAqIGR5bmFtaWMgcGFyYW1ldGVyIHZhbHVlcyAodmFsdWVzIHRoYXQgYXJlIHVua25vd24gdW50aWwgeW91IHJ1biB0aGVcbiAgICogcGlwZWxpbmUpLlxuICAgKlxuICAgKiBBbGwgcGFyYW1ldGVyIG5hbWVzIG11c3QgYmUgcHJlc2VudCBpbiB0aGUgc3RhY2sgdGVtcGxhdGUuXG4gICAqXG4gICAqIE5vdGU6IHRoZSBlbnRpcmUgb2JqZWN0IGNhbm5vdCBiZSBtb3JlIHRoYW4gMWtCLlxuICAgKlxuICAgKiBAZGVmYXVsdCBObyBvdmVycmlkZXNcbiAgICovXG4gIHJlYWRvbmx5IHBhcmFtZXRlck92ZXJyaWRlcz86IHsgW25hbWU6IHN0cmluZ106IGFueSB9O1xuXG4gIC8qKlxuICAgKiBUaGUgbGlzdCBvZiBhZGRpdGlvbmFsIGlucHV0IEFydGlmYWN0cyBmb3IgdGhpcyBBY3Rpb24uXG4gICAqIFRoaXMgaXMgZXNwZWNpYWxseSB1c2VmdWwgd2hlbiB1c2VkIGluIGNvbmp1bmN0aW9uIHdpdGggdGhlIGBwYXJhbWV0ZXJPdmVycmlkZXNgIHByb3BlcnR5LlxuICAgKiBGb3IgZXhhbXBsZSwgaWYgeW91IGhhdmU6XG4gICAqXG4gICAqICAgcGFyYW1ldGVyT3ZlcnJpZGVzOiB7XG4gICAqICAgICAnUGFyYW0xJzogYWN0aW9uMS5vdXRwdXRBcnRpZmFjdC5idWNrZXROYW1lLFxuICAgKiAgICAgJ1BhcmFtMic6IGFjdGlvbjIub3V0cHV0QXJ0aWZhY3Qub2JqZWN0S2V5LFxuICAgKiAgIH1cbiAgICpcbiAgICogLCBpZiB0aGUgb3V0cHV0IEFydGlmYWN0cyBvZiBgYWN0aW9uMWAgYW5kIGBhY3Rpb24yYCB3ZXJlIG5vdCB1c2VkIHRvXG4gICAqIHNldCBlaXRoZXIgdGhlIGB0ZW1wbGF0ZUNvbmZpZ3VyYXRpb25gIG9yIHRoZSBgdGVtcGxhdGVQYXRoYCBwcm9wZXJ0aWVzLFxuICAgKiB5b3UgbmVlZCB0byBtYWtlIHN1cmUgdG8gaW5jbHVkZSB0aGVtIGluIHRoZSBgZXh0cmFJbnB1dHNgIC1cbiAgICogb3RoZXJ3aXNlLCB5b3UnbGwgZ2V0IGFuIFwidW5yZWNvZ25pemVkIEFydGlmYWN0XCIgZXJyb3IgZHVyaW5nIHlvdXIgUGlwZWxpbmUncyBleGVjdXRpb24uXG4gICAqL1xuICByZWFkb25seSBleHRyYUlucHV0cz86IGNvZGVwaXBlbGluZS5BcnRpZmFjdFtdO1xufVxuXG4vKipcbiAqIEJhc2UgY2xhc3MgZm9yIGFsbCBDbG91ZEZvcm1hdGlvbiBhY3Rpb25zIHRoYXQgZXhlY3V0ZSBvciBzdGFnZSBkZXBsb3ltZW50cy5cbiAqL1xuYWJzdHJhY3QgY2xhc3MgQ2xvdWRGb3JtYXRpb25EZXBsb3lBY3Rpb24gZXh0ZW5kcyBDbG91ZEZvcm1hdGlvbkFjdGlvbiB7XG4gIHByaXZhdGUgX2RlcGxveW1lbnRSb2xlPzogaWFtLklSb2xlO1xuICBwcml2YXRlIHJlYWRvbmx5IHByb3BzMjogQ2xvdWRGb3JtYXRpb25EZXBsb3lBY3Rpb25Qcm9wcztcblxuICBjb25zdHJ1Y3Rvcihwcm9wczogQ2xvdWRGb3JtYXRpb25EZXBsb3lBY3Rpb25Qcm9wcywgaW5wdXRzOiBjb2RlcGlwZWxpbmUuQXJ0aWZhY3RbXSB8IHVuZGVmaW5lZCkge1xuICAgIHN1cGVyKHByb3BzLCAocHJvcHMuZXh0cmFJbnB1dHMgfHwgW10pLmNvbmNhdChpbnB1dHMgfHwgW10pKTtcblxuICAgIHRoaXMucHJvcHMyID0gcHJvcHM7XG4gIH1cblxuICAvKipcbiAgICogQWRkIHN0YXRlbWVudCB0byB0aGUgc2VydmljZSByb2xlIGFzc3VtZWQgYnkgQ2xvdWRGb3JtYXRpb24gd2hpbGUgZXhlY3V0aW5nIHRoaXMgYWN0aW9uLlxuICAgKi9cbiAgcHVibGljIGFkZFRvRGVwbG95bWVudFJvbGVQb2xpY3koc3RhdGVtZW50OiBpYW0uUG9saWN5U3RhdGVtZW50KSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0RGVwbG95bWVudFJvbGUoJ21ldGhvZCBhZGRUb1JvbGVQb2xpY3koKScpLmFkZFRvUG9saWN5KHN0YXRlbWVudCk7XG4gIH1cblxuICBwdWJsaWMgZ2V0IGRlcGxveW1lbnRSb2xlKCk6IGlhbS5JUm9sZSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0RGVwbG95bWVudFJvbGUoJ3Byb3BlcnR5IHJvbGUoKScpO1xuICB9XG5cbiAgcHJvdGVjdGVkIGJvdW5kKHNjb3BlOiBDb25zdHJ1Y3QsIHN0YWdlOiBjb2RlcGlwZWxpbmUuSVN0YWdlLCBvcHRpb25zOiBjb2RlcGlwZWxpbmUuQWN0aW9uQmluZE9wdGlvbnMpOlxuICBjb2RlcGlwZWxpbmUuQWN0aW9uQ29uZmlnIHtcbiAgICBpZiAodGhpcy5wcm9wczIuZGVwbG95bWVudFJvbGUpIHtcbiAgICAgIHRoaXMuX2RlcGxveW1lbnRSb2xlID0gdGhpcy5wcm9wczIuZGVwbG95bWVudFJvbGU7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IHJvbGVTdGFjayA9IGNkay5TdGFjay5vZihvcHRpb25zLnJvbGUpO1xuICAgICAgY29uc3QgcGlwZWxpbmVTdGFjayA9IGNkay5TdGFjay5vZihzY29wZSk7XG4gICAgICBpZiAocm9sZVN0YWNrLmFjY291bnQgIT09IHBpcGVsaW5lU3RhY2suYWNjb3VudCkge1xuICAgICAgICAvLyBwYXNzIHJvbGUgaXMgbm90IGFsbG93ZWQgZm9yIGNyb3NzLWFjY291bnQgYWNjZXNzIC0gc28sXG4gICAgICAgIC8vIGNyZWF0ZSB0aGUgZGVwbG95bWVudCBSb2xlIGluIHRoZSBvdGhlciBhY2NvdW50IVxuICAgICAgICB0aGlzLl9kZXBsb3ltZW50Um9sZSA9IG5ldyBpYW0uUm9sZShyb2xlU3RhY2ssXG4gICAgICAgICAgYCR7Y2RrLk5hbWVzLm5vZGVVbmlxdWVJZChzdGFnZS5waXBlbGluZS5ub2RlKX0tJHtzdGFnZS5zdGFnZU5hbWV9LSR7dGhpcy5hY3Rpb25Qcm9wZXJ0aWVzLmFjdGlvbk5hbWV9LURlcGxveW1lbnRSb2xlYCwge1xuICAgICAgICAgICAgYXNzdW1lZEJ5OiBuZXcgaWFtLlNlcnZpY2VQcmluY2lwYWwoJ2Nsb3VkZm9ybWF0aW9uLmFtYXpvbmF3cy5jb20nKSxcbiAgICAgICAgICAgIHJvbGVOYW1lOiBjZGsuUGh5c2ljYWxOYW1lLkdFTkVSQVRFX0lGX05FRURFRCxcbiAgICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX2RlcGxveW1lbnRSb2xlID0gbmV3IGlhbS5Sb2xlKHNjb3BlLCAnUm9sZScsIHtcbiAgICAgICAgICBhc3N1bWVkQnk6IG5ldyBpYW0uU2VydmljZVByaW5jaXBhbCgnY2xvdWRmb3JtYXRpb24uYW1hem9uYXdzLmNvbScpLFxuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgLy8gdGhlIGRlcGxveW1lbnQgcm9sZSBtaWdodCBuZWVkIHJlYWQgYWNjZXNzIHRvIHRoZSBwaXBlbGluZSdzIGJ1Y2tldFxuICAgICAgLy8gKGZvciBleGFtcGxlLCBpZiBpdCdzIGRlcGxveWluZyBhIExhbWJkYSBmdW5jdGlvbiksXG4gICAgICAvLyBhbmQgZXZlbiBpZiBpdCBoYXMgYWRtaW4gcGVybWlzc2lvbnMsIGl0IHdvbid0IGJlIGVub3VnaCxcbiAgICAgIC8vIGFzIGl0IG5lZWRzIHRvIGJlIGFkZGVkIHRvIHRoZSBrZXkncyByZXNvdXJjZSBwb2xpY3lcbiAgICAgIC8vIChhbmQgdGhlIGJ1Y2tldCdzLCBpZiB0aGUgYWNjZXNzIGlzIGNyb3NzLWFjY291bnQpXG4gICAgICBvcHRpb25zLmJ1Y2tldC5ncmFudFJlYWQodGhpcy5fZGVwbG95bWVudFJvbGUpO1xuXG4gICAgICBpZiAodGhpcy5wcm9wczIuYWRtaW5QZXJtaXNzaW9ucykge1xuICAgICAgICB0aGlzLl9kZXBsb3ltZW50Um9sZS5hZGRUb1BvbGljeShuZXcgaWFtLlBvbGljeVN0YXRlbWVudCh7XG4gICAgICAgICAgYWN0aW9uczogWycqJ10sXG4gICAgICAgICAgcmVzb3VyY2VzOiBbJyonXSxcbiAgICAgICAgfSkpO1xuICAgICAgfVxuICAgIH1cblxuICAgIFNpbmdsZXRvblBvbGljeS5mb3JSb2xlKG9wdGlvbnMucm9sZSkuZ3JhbnRQYXNzUm9sZSh0aGlzLl9kZXBsb3ltZW50Um9sZSk7XG5cbiAgICBjb25zdCBwcm92aWRlZENhcGFiaWxpdGllcyA9IHRoaXMucHJvcHMyLmNmbkNhcGFiaWxpdGllcyA/P1xuICAgICAgdGhpcy5wcm9wczIuY2FwYWJpbGl0aWVzPy5tYXAoYyA9PiB7XG4gICAgICAgIHN3aXRjaCAoYykge1xuICAgICAgICAgIGNhc2UgY2xvdWRmb3JtYXRpb24uQ2xvdWRGb3JtYXRpb25DYXBhYmlsaXRpZXMuTk9ORTogcmV0dXJuIGNkay5DZm5DYXBhYmlsaXRpZXMuTk9ORTtcbiAgICAgICAgICBjYXNlIGNsb3VkZm9ybWF0aW9uLkNsb3VkRm9ybWF0aW9uQ2FwYWJpbGl0aWVzLkFOT05ZTU9VU19JQU06IHJldHVybiBjZGsuQ2ZuQ2FwYWJpbGl0aWVzLkFOT05ZTU9VU19JQU07XG4gICAgICAgICAgY2FzZSBjbG91ZGZvcm1hdGlvbi5DbG91ZEZvcm1hdGlvbkNhcGFiaWxpdGllcy5OQU1FRF9JQU06IHJldHVybiBjZGsuQ2ZuQ2FwYWJpbGl0aWVzLk5BTUVEX0lBTTtcbiAgICAgICAgICBjYXNlIGNsb3VkZm9ybWF0aW9uLkNsb3VkRm9ybWF0aW9uQ2FwYWJpbGl0aWVzLkFVVE9fRVhQQU5EOiByZXR1cm4gY2RrLkNmbkNhcGFiaWxpdGllcy5BVVRPX0VYUEFORDtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgY29uc3QgY2FwYWJpbGl0aWVzID0gdGhpcy5wcm9wczIuYWRtaW5QZXJtaXNzaW9ucyAmJiBwcm92aWRlZENhcGFiaWxpdGllcyA9PT0gdW5kZWZpbmVkXG4gICAgICA/IFtjZGsuQ2ZuQ2FwYWJpbGl0aWVzLk5BTUVEX0lBTV1cbiAgICAgIDogcHJvdmlkZWRDYXBhYmlsaXRpZXM7XG5cbiAgICBjb25zdCBhY3Rpb25Db25maWcgPSBzdXBlci5ib3VuZChzY29wZSwgc3RhZ2UsIG9wdGlvbnMpO1xuICAgIHJldHVybiB7XG4gICAgICAuLi5hY3Rpb25Db25maWcsXG4gICAgICBjb25maWd1cmF0aW9uOiB7XG4gICAgICAgIC4uLmFjdGlvbkNvbmZpZy5jb25maWd1cmF0aW9uLFxuICAgICAgICAvLyBOb25lIGV2YWx1YXRlcyB0byBlbXB0eSBzdHJpbmcgd2hpY2ggaXMgZmFsc2V5IGFuZCByZXN1bHRzIGluIHVuZGVmaW5lZFxuICAgICAgICBDYXBhYmlsaXRpZXM6IHBhcnNlQ2FwYWJpbGl0aWVzKGNhcGFiaWxpdGllcyksXG4gICAgICAgIFJvbGVBcm46IHRoaXMuZGVwbG95bWVudFJvbGUucm9sZUFybixcbiAgICAgICAgUGFyYW1ldGVyT3ZlcnJpZGVzOiBjZGsuU3RhY2sub2Yoc2NvcGUpLnRvSnNvblN0cmluZyh0aGlzLnByb3BzMi5wYXJhbWV0ZXJPdmVycmlkZXMpLFxuICAgICAgICBUZW1wbGF0ZUNvbmZpZ3VyYXRpb246IHRoaXMucHJvcHMyLnRlbXBsYXRlQ29uZmlndXJhdGlvblxuICAgICAgICAgID8gdGhpcy5wcm9wczIudGVtcGxhdGVDb25maWd1cmF0aW9uLmxvY2F0aW9uXG4gICAgICAgICAgOiB1bmRlZmluZWQsXG4gICAgICAgIFN0YWNrTmFtZTogdGhpcy5wcm9wczIuc3RhY2tOYW1lLFxuICAgICAgfSxcbiAgICB9O1xuICB9XG5cbiAgcHJpdmF0ZSBnZXREZXBsb3ltZW50Um9sZShtZW1iZXI6IHN0cmluZyk6IGlhbS5JUm9sZSB7XG4gICAgaWYgKHRoaXMuX2RlcGxveW1lbnRSb2xlKSB7XG4gICAgICByZXR1cm4gdGhpcy5fZGVwbG95bWVudFJvbGU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgQ2Fubm90IHVzZSB0aGUgJHttZW1iZXJ9IGJlZm9yZSB0aGUgQWN0aW9uIGhhcyBiZWVuIGFkZGVkIHRvIGEgUGlwZWxpbmVgKTtcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBQcm9wZXJ0aWVzIGZvciB0aGUgQ2xvdWRGb3JtYXRpb25DcmVhdGVSZXBsYWNlQ2hhbmdlU2V0QWN0aW9uLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIENsb3VkRm9ybWF0aW9uQ3JlYXRlUmVwbGFjZUNoYW5nZVNldEFjdGlvblByb3BzIGV4dGVuZHMgQ2xvdWRGb3JtYXRpb25EZXBsb3lBY3Rpb25Qcm9wcyB7XG4gIC8qKlxuICAgKiBOYW1lIG9mIHRoZSBjaGFuZ2Ugc2V0IHRvIGNyZWF0ZSBvciB1cGRhdGUuXG4gICAqL1xuICByZWFkb25seSBjaGFuZ2VTZXROYW1lOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIElucHV0IGFydGlmYWN0IHdpdGggdGhlIENoYW5nZVNldCdzIENsb3VkRm9ybWF0aW9uIHRlbXBsYXRlXG4gICAqL1xuICByZWFkb25seSB0ZW1wbGF0ZVBhdGg6IGNvZGVwaXBlbGluZS5BcnRpZmFjdFBhdGg7XG59XG5cbi8qKlxuICogQ29kZVBpcGVsaW5lIGFjdGlvbiB0byBwcmVwYXJlIGEgY2hhbmdlIHNldC5cbiAqXG4gKiBDcmVhdGVzIHRoZSBjaGFuZ2Ugc2V0IGlmIGl0IGRvZXNuJ3QgZXhpc3QgYmFzZWQgb24gdGhlIHN0YWNrIG5hbWUgYW5kIHRlbXBsYXRlIHRoYXQgeW91IHN1Ym1pdC5cbiAqIElmIHRoZSBjaGFuZ2Ugc2V0IGV4aXN0cywgQVdTIENsb3VkRm9ybWF0aW9uIGRlbGV0ZXMgaXQsIGFuZCB0aGVuIGNyZWF0ZXMgYSBuZXcgb25lLlxuICovXG5leHBvcnQgY2xhc3MgQ2xvdWRGb3JtYXRpb25DcmVhdGVSZXBsYWNlQ2hhbmdlU2V0QWN0aW9uIGV4dGVuZHMgQ2xvdWRGb3JtYXRpb25EZXBsb3lBY3Rpb24ge1xuICBwcml2YXRlIHJlYWRvbmx5IHByb3BzMzogQ2xvdWRGb3JtYXRpb25DcmVhdGVSZXBsYWNlQ2hhbmdlU2V0QWN0aW9uUHJvcHM7XG5cbiAgY29uc3RydWN0b3IocHJvcHM6IENsb3VkRm9ybWF0aW9uQ3JlYXRlUmVwbGFjZUNoYW5nZVNldEFjdGlvblByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMsIHByb3BzLnRlbXBsYXRlQ29uZmlndXJhdGlvblxuICAgICAgPyBbcHJvcHMudGVtcGxhdGVQYXRoLmFydGlmYWN0LCBwcm9wcy50ZW1wbGF0ZUNvbmZpZ3VyYXRpb24uYXJ0aWZhY3RdXG4gICAgICA6IFtwcm9wcy50ZW1wbGF0ZVBhdGguYXJ0aWZhY3RdKTtcblxuICAgIHRoaXMucHJvcHMzID0gcHJvcHM7XG4gIH1cblxuICBwcm90ZWN0ZWQgYm91bmQoc2NvcGU6IENvbnN0cnVjdCwgc3RhZ2U6IGNvZGVwaXBlbGluZS5JU3RhZ2UsIG9wdGlvbnM6IGNvZGVwaXBlbGluZS5BY3Rpb25CaW5kT3B0aW9ucyk6XG4gIGNvZGVwaXBlbGluZS5BY3Rpb25Db25maWcge1xuICAgIC8vIHRoZSBzdXBlciBjYWxsIG9yZGVyIGlzIHRvIHByZXNlcnZlIHRoZSBleGlzdGluZyBvcmRlciBvZiBzdGF0ZW1lbnRzIGluIHBvbGljaWVzXG4gICAgY29uc3QgYWN0aW9uQ29uZmlnID0gc3VwZXIuYm91bmQoc2NvcGUsIHN0YWdlLCBvcHRpb25zKTtcblxuICAgIFNpbmdsZXRvblBvbGljeS5mb3JSb2xlKG9wdGlvbnMucm9sZSkuZ3JhbnRDcmVhdGVSZXBsYWNlQ2hhbmdlU2V0KHRoaXMucHJvcHMzKTtcblxuICAgIHJldHVybiB7XG4gICAgICAuLi5hY3Rpb25Db25maWcsXG4gICAgICBjb25maWd1cmF0aW9uOiB7XG4gICAgICAgIC4uLmFjdGlvbkNvbmZpZy5jb25maWd1cmF0aW9uLFxuICAgICAgICBBY3Rpb25Nb2RlOiAnQ0hBTkdFX1NFVF9SRVBMQUNFJyxcbiAgICAgICAgQ2hhbmdlU2V0TmFtZTogdGhpcy5wcm9wczMuY2hhbmdlU2V0TmFtZSxcbiAgICAgICAgVGVtcGxhdGVQYXRoOiB0aGlzLnByb3BzMy50ZW1wbGF0ZVBhdGgubG9jYXRpb24sXG4gICAgICB9LFxuICAgIH07XG4gIH1cbn1cblxuLyoqXG4gKiBQcm9wZXJ0aWVzIGZvciB0aGUgQ2xvdWRGb3JtYXRpb25DcmVhdGVVcGRhdGVTdGFja0FjdGlvbi5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBDbG91ZEZvcm1hdGlvbkNyZWF0ZVVwZGF0ZVN0YWNrQWN0aW9uUHJvcHMgZXh0ZW5kcyBDbG91ZEZvcm1hdGlvbkRlcGxveUFjdGlvblByb3BzIHtcbiAgLyoqXG4gICAqIElucHV0IGFydGlmYWN0IHdpdGggdGhlIENsb3VkRm9ybWF0aW9uIHRlbXBsYXRlIHRvIGRlcGxveVxuICAgKi9cbiAgcmVhZG9ubHkgdGVtcGxhdGVQYXRoOiBjb2RlcGlwZWxpbmUuQXJ0aWZhY3RQYXRoO1xuXG4gIC8qKlxuICAgKiBSZXBsYWNlIHRoZSBzdGFjayBpZiBpdCdzIGluIGEgZmFpbGVkIHN0YXRlLlxuICAgKlxuICAgKiBJZiB0aGlzIGlzIHNldCB0byB0cnVlIGFuZCB0aGUgc3RhY2sgaXMgaW4gYSBmYWlsZWQgc3RhdGUgKG9uZSBvZlxuICAgKiBST0xMQkFDS19DT01QTEVURSwgUk9MTEJBQ0tfRkFJTEVELCBDUkVBVEVfRkFJTEVELCBERUxFVEVfRkFJTEVELCBvclxuICAgKiBVUERBVEVfUk9MTEJBQ0tfRkFJTEVEKSwgQVdTIENsb3VkRm9ybWF0aW9uIGRlbGV0ZXMgdGhlIHN0YWNrIGFuZCB0aGVuXG4gICAqIGNyZWF0ZXMgYSBuZXcgc3RhY2suXG4gICAqXG4gICAqIElmIHRoaXMgaXMgbm90IHNldCB0byB0cnVlIGFuZCB0aGUgc3RhY2sgaXMgaW4gYSBmYWlsZWQgc3RhdGUsXG4gICAqIHRoZSBkZXBsb3ltZW50IGZhaWxzLlxuICAgKlxuICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgKi9cbiAgcmVhZG9ubHkgcmVwbGFjZU9uRmFpbHVyZT86IGJvb2xlYW47XG59XG5cbi8qKlxuICogQ29kZVBpcGVsaW5lIGFjdGlvbiB0byBkZXBsb3kgYSBzdGFjay5cbiAqXG4gKiBDcmVhdGVzIHRoZSBzdGFjayBpZiB0aGUgc3BlY2lmaWVkIHN0YWNrIGRvZXNuJ3QgZXhpc3QuIElmIHRoZSBzdGFjayBleGlzdHMsXG4gKiBBV1MgQ2xvdWRGb3JtYXRpb24gdXBkYXRlcyB0aGUgc3RhY2suIFVzZSB0aGlzIGFjdGlvbiB0byB1cGRhdGUgZXhpc3RpbmdcbiAqIHN0YWNrcy5cbiAqXG4gKiBBV1MgQ29kZVBpcGVsaW5lIHdvbid0IHJlcGxhY2UgdGhlIHN0YWNrLCBhbmQgd2lsbCBmYWlsIGRlcGxveW1lbnQgaWYgdGhlXG4gKiBzdGFjayBpcyBpbiBhIGZhaWxlZCBzdGF0ZS4gVXNlIGBSZXBsYWNlT25GYWlsdXJlYCBmb3IgYW4gYWN0aW9uIHRoYXRcbiAqIHdpbGwgZGVsZXRlIGFuZCByZWNyZWF0ZSB0aGUgc3RhY2sgdG8gdHJ5IGFuZCByZWNvdmVyIGZyb20gZmFpbGVkIHN0YXRlcy5cbiAqXG4gKiBVc2UgdGhpcyBhY3Rpb24gdG8gYXV0b21hdGljYWxseSByZXBsYWNlIGZhaWxlZCBzdGFja3Mgd2l0aG91dCByZWNvdmVyaW5nIG9yXG4gKiB0cm91Ymxlc2hvb3RpbmcgdGhlbS4gWW91IHdvdWxkIHR5cGljYWxseSBjaG9vc2UgdGhpcyBtb2RlIGZvciB0ZXN0aW5nLlxuICovXG5leHBvcnQgY2xhc3MgQ2xvdWRGb3JtYXRpb25DcmVhdGVVcGRhdGVTdGFja0FjdGlvbiBleHRlbmRzIENsb3VkRm9ybWF0aW9uRGVwbG95QWN0aW9uIHtcbiAgcHJpdmF0ZSByZWFkb25seSBwcm9wczM6IENsb3VkRm9ybWF0aW9uQ3JlYXRlVXBkYXRlU3RhY2tBY3Rpb25Qcm9wcztcblxuICBjb25zdHJ1Y3Rvcihwcm9wczogQ2xvdWRGb3JtYXRpb25DcmVhdGVVcGRhdGVTdGFja0FjdGlvblByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMsIHByb3BzLnRlbXBsYXRlQ29uZmlndXJhdGlvblxuICAgICAgPyBbcHJvcHMudGVtcGxhdGVQYXRoLmFydGlmYWN0LCBwcm9wcy50ZW1wbGF0ZUNvbmZpZ3VyYXRpb24uYXJ0aWZhY3RdXG4gICAgICA6IFtwcm9wcy50ZW1wbGF0ZVBhdGguYXJ0aWZhY3RdKTtcblxuICAgIHRoaXMucHJvcHMzID0gcHJvcHM7XG4gIH1cblxuICBwcm90ZWN0ZWQgYm91bmQoc2NvcGU6IENvbnN0cnVjdCwgc3RhZ2U6IGNvZGVwaXBlbGluZS5JU3RhZ2UsIG9wdGlvbnM6IGNvZGVwaXBlbGluZS5BY3Rpb25CaW5kT3B0aW9ucyk6XG4gIGNvZGVwaXBlbGluZS5BY3Rpb25Db25maWcge1xuICAgIC8vIHRoZSBzdXBlciBjYWxsIG9yZGVyIGlzIHRvIHByZXNlcnZlIHRoZSBleGlzdGluZyBvcmRlciBvZiBzdGF0ZW1lbnRzIGluIHBvbGljaWVzXG4gICAgY29uc3QgYWN0aW9uQ29uZmlnID0gc3VwZXIuYm91bmQoc2NvcGUsIHN0YWdlLCBvcHRpb25zKTtcblxuICAgIFNpbmdsZXRvblBvbGljeS5mb3JSb2xlKG9wdGlvbnMucm9sZSkuZ3JhbnRDcmVhdGVVcGRhdGVTdGFjayh0aGlzLnByb3BzMyk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgLi4uYWN0aW9uQ29uZmlnLFxuICAgICAgY29uZmlndXJhdGlvbjoge1xuICAgICAgICAuLi5hY3Rpb25Db25maWcuY29uZmlndXJhdGlvbixcbiAgICAgICAgQWN0aW9uTW9kZTogdGhpcy5wcm9wczMucmVwbGFjZU9uRmFpbHVyZSA/ICdSRVBMQUNFX09OX0ZBSUxVUkUnIDogJ0NSRUFURV9VUERBVEUnLFxuICAgICAgICBUZW1wbGF0ZVBhdGg6IHRoaXMucHJvcHMzLnRlbXBsYXRlUGF0aC5sb2NhdGlvbixcbiAgICAgIH0sXG4gICAgfTtcbiAgfVxufVxuXG4vKipcbiAqIFByb3BlcnRpZXMgZm9yIHRoZSBDbG91ZEZvcm1hdGlvbkRlbGV0ZVN0YWNrQWN0aW9uLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIENsb3VkRm9ybWF0aW9uRGVsZXRlU3RhY2tBY3Rpb25Qcm9wcyBleHRlbmRzIENsb3VkRm9ybWF0aW9uRGVwbG95QWN0aW9uUHJvcHMge1xufVxuXG4vKipcbiAqIENvZGVQaXBlbGluZSBhY3Rpb24gdG8gZGVsZXRlIGEgc3RhY2suXG4gKlxuICogRGVsZXRlcyBhIHN0YWNrLiBJZiB5b3Ugc3BlY2lmeSBhIHN0YWNrIHRoYXQgZG9lc24ndCBleGlzdCwgdGhlIGFjdGlvbiBjb21wbGV0ZXMgc3VjY2Vzc2Z1bGx5XG4gKiB3aXRob3V0IGRlbGV0aW5nIGEgc3RhY2suXG4gKi9cbmV4cG9ydCBjbGFzcyBDbG91ZEZvcm1hdGlvbkRlbGV0ZVN0YWNrQWN0aW9uIGV4dGVuZHMgQ2xvdWRGb3JtYXRpb25EZXBsb3lBY3Rpb24ge1xuICBwcml2YXRlIHJlYWRvbmx5IHByb3BzMzogQ2xvdWRGb3JtYXRpb25EZWxldGVTdGFja0FjdGlvblByb3BzO1xuXG4gIGNvbnN0cnVjdG9yKHByb3BzOiBDbG91ZEZvcm1hdGlvbkRlbGV0ZVN0YWNrQWN0aW9uUHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcywgdW5kZWZpbmVkKTtcblxuICAgIHRoaXMucHJvcHMzID0gcHJvcHM7XG4gIH1cblxuICBwcm90ZWN0ZWQgYm91bmQoc2NvcGU6IENvbnN0cnVjdCwgc3RhZ2U6IGNvZGVwaXBlbGluZS5JU3RhZ2UsIG9wdGlvbnM6IGNvZGVwaXBlbGluZS5BY3Rpb25CaW5kT3B0aW9ucyk6XG4gIGNvZGVwaXBlbGluZS5BY3Rpb25Db25maWcge1xuICAgIC8vIHRoZSBzdXBlciBjYWxsIG9yZGVyIGlzIHRvIHByZXNlcnZlIHRoZSBleGlzdGluZyBvcmRlciBvZiBzdGF0ZW1lbnRzIGluIHBvbGljaWVzXG4gICAgY29uc3QgYWN0aW9uQ29uZmlnID0gc3VwZXIuYm91bmQoc2NvcGUsIHN0YWdlLCBvcHRpb25zKTtcblxuICAgIFNpbmdsZXRvblBvbGljeS5mb3JSb2xlKG9wdGlvbnMucm9sZSkuZ3JhbnREZWxldGVTdGFjayh0aGlzLnByb3BzMyk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgLi4uYWN0aW9uQ29uZmlnLFxuICAgICAgY29uZmlndXJhdGlvbjoge1xuICAgICAgICAuLi5hY3Rpb25Db25maWcuY29uZmlndXJhdGlvbixcbiAgICAgICAgQWN0aW9uTW9kZTogJ0RFTEVURV9PTkxZJyxcbiAgICAgIH0sXG4gICAgfTtcbiAgfVxufVxuIl19