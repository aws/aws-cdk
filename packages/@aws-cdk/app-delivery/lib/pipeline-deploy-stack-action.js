"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PipelineDeployStackAction = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const cfn = require("@aws-cdk/aws-cloudformation");
const cpactions = require("@aws-cdk/aws-codepipeline-actions");
const cxschema = require("@aws-cdk/cloud-assembly-schema");
const cdk = require("@aws-cdk/core");
/**
 * A class to deploy a stack that is part of a CDK App, using CodePipeline.
 * This composite Action takes care of preparing and executing a CloudFormation ChangeSet.
 *
 * It currently does *not* support stacks that make use of ``Asset``s, and
 * requires the deployed stack is in the same account and region where the
 * CodePipeline is hosted.
 */
class PipelineDeployStackAction {
    constructor(props) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/app-delivery.PipelineDeployStackAction", "");
            jsiiDeprecationWarnings._aws_cdk_app_delivery_PipelineDeployStackActionProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, PipelineDeployStackAction);
            }
            throw error;
        }
        this.stack = props.stack;
        const assets = this.stack.node.metadata.filter(md => md.type === cxschema.ArtifactMetadataEntryType.ASSET);
        if (assets.length > 0) {
            // FIXME: Implement the necessary actions to publish assets
            throw new Error(`Cannot deploy the stack ${this.stack.stackName} because it references ${assets.length} asset(s)`);
        }
        const createChangeSetRunOrder = props.createChangeSetRunOrder || 1;
        const executeChangeSetRunOrder = props.executeChangeSetRunOrder || (createChangeSetRunOrder + 1);
        if (createChangeSetRunOrder >= executeChangeSetRunOrder) {
            throw new Error(`createChangeSetRunOrder (${createChangeSetRunOrder}) must be < executeChangeSetRunOrder (${executeChangeSetRunOrder})`);
        }
        const changeSetName = props.changeSetName || 'CDK-CodePipeline-ChangeSet';
        const capabilities = cfnCapabilities(props.adminPermissions, props.capabilities);
        this.prepareChangeSetAction = new cpactions.CloudFormationCreateReplaceChangeSetAction({
            actionName: props.createChangeSetActionName ?? 'ChangeSet',
            changeSetName,
            runOrder: createChangeSetRunOrder,
            stackName: props.stack.stackName,
            templatePath: props.input.atPath(props.stack.templateFile),
            adminPermissions: props.adminPermissions,
            deploymentRole: props.role,
            capabilities,
        });
        this.executeChangeSetAction = new cpactions.CloudFormationExecuteChangeSetAction({
            actionName: props.executeChangeSetActionName ?? 'Execute',
            changeSetName,
            runOrder: executeChangeSetRunOrder,
            stackName: this.stack.stackName,
        });
    }
    bind(scope, stage, options) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/app-delivery.PipelineDeployStackAction#bind", "");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.bind);
            }
            throw error;
        }
        if (this.stack.environment !== cdk.Stack.of(scope).environment) {
            // FIXME: Add the necessary to extend to stacks in a different account
            throw new Error('Cross-environment deployment is not supported');
        }
        stage.addAction(this.prepareChangeSetAction);
        this._deploymentRole = this.prepareChangeSetAction.deploymentRole;
        return this.executeChangeSetAction.bind(scope, stage, options);
    }
    get deploymentRole() {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/app-delivery.PipelineDeployStackAction#deploymentRole", "");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, jsiiDeprecationWarnings.getPropertyDescriptor(this, "deploymentRole").get);
            }
            throw error;
        }
        if (!this._deploymentRole) {
            throw new Error('Use this action in a pipeline first before accessing \'deploymentRole\'');
        }
        return this._deploymentRole;
    }
    /**
     * Add policy statements to the role deploying the stack.
     *
     * This role is passed to CloudFormation and must have the IAM permissions
     * necessary to deploy the stack or you can grant this role `adminPermissions`
     * by using that option during creation. If you do not grant
     * `adminPermissions` you need to identify the proper statements to add to
     * this role based on the CloudFormation Resources in your stack.
     */
    addToDeploymentRolePolicy(statement) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/app-delivery.PipelineDeployStackAction#addToDeploymentRolePolicy", "");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.addToDeploymentRolePolicy);
            }
            throw error;
        }
        this.deploymentRole.addToPolicy(statement);
    }
    onStateChange(name, target, options) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/app-delivery.PipelineDeployStackAction#onStateChange", "");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.onStateChange);
            }
            throw error;
        }
        return this.executeChangeSetAction.onStateChange(name, target, options);
    }
    get actionProperties() {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/app-delivery.PipelineDeployStackAction#actionProperties", "");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, jsiiDeprecationWarnings.getPropertyDescriptor(this, "actionProperties").get);
            }
            throw error;
        }
        return this.executeChangeSetAction.actionProperties;
    }
}
exports.PipelineDeployStackAction = PipelineDeployStackAction;
_a = JSII_RTTI_SYMBOL_1;
PipelineDeployStackAction[_a] = { fqn: "@aws-cdk/app-delivery.PipelineDeployStackAction", version: "0.0.0" };
function cfnCapabilities(adminPermissions, capabilities) {
    if (adminPermissions && capabilities === undefined) {
        // admin true default capability to NamedIAM and AutoExpand
        return [cfn.CloudFormationCapabilities.NAMED_IAM, cfn.CloudFormationCapabilities.AUTO_EXPAND];
    }
    else if (capabilities === undefined) {
        // else capabilities are undefined set AnonymousIAM and AutoExpand
        return [cfn.CloudFormationCapabilities.ANONYMOUS_IAM, cfn.CloudFormationCapabilities.AUTO_EXPAND];
    }
    else {
        // else capabilities are defined use them
        return capabilities;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGlwZWxpbmUtZGVwbG95LXN0YWNrLWFjdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInBpcGVsaW5lLWRlcGxveS1zdGFjay1hY3Rpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsbURBQW1EO0FBRW5ELCtEQUErRDtBQUcvRCwyREFBMkQ7QUFDM0QscUNBQXFDO0FBNEZyQzs7Ozs7OztHQU9HO0FBQ0gsTUFBYSx5QkFBeUI7SUFVcEMsWUFBWSxLQUFxQzs7Ozs7OzsrQ0FWdEMseUJBQXlCOzs7O1FBV2xDLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQztRQUN6QixNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLElBQUksS0FBSyxRQUFRLENBQUMseUJBQXlCLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDM0csSUFBSSxNQUFNLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtZQUNyQiwyREFBMkQ7WUFDM0QsTUFBTSxJQUFJLEtBQUssQ0FBQywyQkFBMkIsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLDBCQUEwQixNQUFNLENBQUMsTUFBTSxXQUFXLENBQUMsQ0FBQztTQUNwSDtRQUVELE1BQU0sdUJBQXVCLEdBQUcsS0FBSyxDQUFDLHVCQUF1QixJQUFJLENBQUMsQ0FBQztRQUNuRSxNQUFNLHdCQUF3QixHQUFHLEtBQUssQ0FBQyx3QkFBd0IsSUFBSSxDQUFDLHVCQUF1QixHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ2pHLElBQUksdUJBQXVCLElBQUksd0JBQXdCLEVBQUU7WUFDdkQsTUFBTSxJQUFJLEtBQUssQ0FBQyw0QkFBNEIsdUJBQXVCLHlDQUF5Qyx3QkFBd0IsR0FBRyxDQUFDLENBQUM7U0FDMUk7UUFFRCxNQUFNLGFBQWEsR0FBRyxLQUFLLENBQUMsYUFBYSxJQUFJ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QUFDLFdBQVcsQ0FBQyxDQUFDO0tBQ25HO1NBQU07UUFDTCx5Q0FBeUM7UUFDekMsT0FBTyxZQUFZLENBQUM7S0FDckI7QUFDSCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgY2ZuIGZyb20gJ0Bhd3MtY2RrL2F3cy1jbG91ZGZvcm1hdGlvbic7XG5pbXBvcnQgKiBhcyBjb2RlcGlwZWxpbmUgZnJvbSAnQGF3cy1jZGsvYXdzLWNvZGVwaXBlbGluZSc7XG5pbXBvcnQgKiBhcyBjcGFjdGlvbnMgZnJvbSAnQGF3cy1jZGsvYXdzLWNvZGVwaXBlbGluZS1hY3Rpb25zJztcbmltcG9ydCAqIGFzIGV2ZW50cyBmcm9tICdAYXdzLWNkay9hd3MtZXZlbnRzJztcbmltcG9ydCAqIGFzIGlhbSBmcm9tICdAYXdzLWNkay9hd3MtaWFtJztcbmltcG9ydCAqIGFzIGN4c2NoZW1hIGZyb20gJ0Bhd3MtY2RrL2Nsb3VkLWFzc2VtYmx5LXNjaGVtYSc7XG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcblxuZXhwb3J0IGludGVyZmFjZSBQaXBlbGluZURlcGxveVN0YWNrQWN0aW9uUHJvcHMge1xuICAvKipcbiAgICogVGhlIENESyBzdGFjayB0byBiZSBkZXBsb3llZC5cbiAgICovXG4gIHJlYWRvbmx5IHN0YWNrOiBjZGsuU3RhY2s7XG5cbiAgLyoqXG4gICAqIFRoZSBDb2RlUGlwZWxpbmUgYXJ0aWZhY3QgdGhhdCBob2xkcyB0aGUgc3ludGhlc2l6ZWQgYXBwLCB3aGljaCBpcyB0aGVcbiAgICogY29udGVudHMgb2YgdGhlIGBgPGRpcmVjdG9yeT5gYCB3aGVuIHJ1bm5pbmcgYGBjZGsgc3ludGggLW8gPGRpcmVjdG9yeT5gYC5cbiAgICovXG4gIHJlYWRvbmx5IGlucHV0OiBjb2RlcGlwZWxpbmUuQXJ0aWZhY3Q7XG5cbiAgLyoqXG4gICAqIFRoZSBuYW1lIHRvIHVzZSB3aGVuIGNyZWF0aW5nIGEgQ2hhbmdlU2V0IGZvciB0aGUgc3RhY2suXG4gICAqXG4gICAqIEBkZWZhdWx0IENESy1Db2RlUGlwZWxpbmUtQ2hhbmdlU2V0XG4gICAqL1xuICByZWFkb25seSBjaGFuZ2VTZXROYW1lPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgcnVuT3JkZXIgZm9yIHRoZSBDb2RlUGlwZWxpbmUgYWN0aW9uIGNyZWF0aW5nIHRoZSBDaGFuZ2VTZXQuXG4gICAqXG4gICAqIEBkZWZhdWx0IDFcbiAgICovXG4gIHJlYWRvbmx5IGNyZWF0ZUNoYW5nZVNldFJ1bk9yZGVyPzogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBUaGUgbmFtZSBvZiB0aGUgQ29kZVBpcGVsaW5lIGFjdGlvbiBjcmVhdGluZyB0aGUgQ2hhbmdlU2V0LlxuICAgKlxuICAgKiBAZGVmYXVsdCAnQ2hhbmdlU2V0J1xuICAgKi9cbiAgcmVhZG9ubHkgY3JlYXRlQ2hhbmdlU2V0QWN0aW9uTmFtZT86IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIHJ1bk9yZGVyIGZvciB0aGUgQ29kZVBpcGVsaW5lIGFjdGlvbiBleGVjdXRpbmcgdGhlIENoYW5nZVNldC5cbiAgICpcbiAgICogQGRlZmF1bHQgYGBjcmVhdGVDaGFuZ2VTZXRSdW5PcmRlciArIDFgYFxuICAgKi9cbiAgcmVhZG9ubHkgZXhlY3V0ZUNoYW5nZVNldFJ1bk9yZGVyPzogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBUaGUgbmFtZSBvZiB0aGUgQ29kZVBpcGVsaW5lIGFjdGlvbiBjcmVhdGluZyB0aGUgQ2hhbmdlU2V0LlxuICAgKlxuICAgKiBAZGVmYXVsdCAnRXhlY3V0ZSdcbiAgICovXG4gIHJlYWRvbmx5IGV4ZWN1dGVDaGFuZ2VTZXRBY3Rpb25OYW1lPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBJQU0gcm9sZSB0byBhc3N1bWUgd2hlbiBkZXBsb3lpbmcgY2hhbmdlcy5cbiAgICpcbiAgICogSWYgbm90IHNwZWNpZmllZCwgYSBmcmVzaCByb2xlIGlzIGNyZWF0ZWQuIFRoZSByb2xlIGlzIGNyZWF0ZWQgd2l0aCB6ZXJvXG4gICAqIHBlcm1pc3Npb25zIHVubGVzcyBgYWRtaW5QZXJtaXNzaW9uc2AgaXMgdHJ1ZSwgaW4gd2hpY2ggY2FzZSB0aGUgcm9sZSB3aWxsIGhhdmVcbiAgICogYWRtaW4gcGVybWlzc2lvbnMuXG4gICAqXG4gICAqIEBkZWZhdWx0IEEgZnJlc2ggcm9sZSB3aXRoIGFkbWluIG9yIG5vIHBlcm1pc3Npb25zIChkZXBlbmRpbmcgb24gdGhlIHZhbHVlIG9mIGBhZG1pblBlcm1pc3Npb25zYCkuXG4gICAqL1xuICByZWFkb25seSByb2xlPzogaWFtLklSb2xlO1xuXG4gIC8qKlxuICAgKiBBY2tub3dsZWRnZSBjZXJ0YWluIGNoYW5nZXMgbWFkZSBhcyBwYXJ0IG9mIGRlcGxveW1lbnRcbiAgICpcbiAgICogRm9yIHN0YWNrcyB0aGF0IGNvbnRhaW4gY2VydGFpbiByZXNvdXJjZXMsIGV4cGxpY2l0IGFja25vd2xlZGdlbWVudCB0aGF0IEFXUyBDbG91ZEZvcm1hdGlvblxuICAgKiBtaWdodCBjcmVhdGUgb3IgdXBkYXRlIHRob3NlIHJlc291cmNlcy4gRm9yIGV4YW1wbGUsIHlvdSBtdXN0IHNwZWNpZnkgQW5vbnltb3VzSUFNIGlmIHlvdXJcbiAgICogc3RhY2sgdGVtcGxhdGUgY29udGFpbnMgQVdTIElkZW50aXR5IGFuZCBBY2Nlc3MgTWFuYWdlbWVudCAoSUFNKSByZXNvdXJjZXMuIEZvciBtb3JlXG4gICAqIGluZm9ybWF0aW9uXG4gICAqXG4gICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvdXNpbmctaWFtLXRlbXBsYXRlLmh0bWwjdXNpbmctaWFtLWNhcGFiaWxpdGllc1xuICAgKiBAZGVmYXVsdCBbQW5vbnltb3VzSUFNLCBBdXRvRXhwYW5kXSwgdW5sZXNzIGBhZG1pblBlcm1pc3Npb25zYCBpcyB0cnVlXG4gICAqL1xuICByZWFkb25seSBjYXBhYmlsaXRpZXM/OiBjZm4uQ2xvdWRGb3JtYXRpb25DYXBhYmlsaXRpZXNbXTtcblxuICAvKipcbiAgICogV2hldGhlciB0byBncmFudCBhZG1pbiBwZXJtaXNzaW9ucyB0byBDbG91ZEZvcm1hdGlvbiB3aGlsZSBkZXBsb3lpbmcgdGhpcyB0ZW1wbGF0ZS5cbiAgICpcbiAgICogU2V0dGluZyB0aGlzIHRvIGB0cnVlYCBhZmZlY3RzIHRoZSBkZWZhdWx0cyBmb3IgYHJvbGVgIGFuZCBgY2FwYWJpbGl0aWVzYCwgaWYgeW91XG4gICAqIGRvbid0IHNwZWNpZnkgYW55IGFsdGVybmF0aXZlcy5cbiAgICpcbiAgICogVGhlIGRlZmF1bHQgcm9sZSB0aGF0IHdpbGwgYmUgY3JlYXRlZCBmb3IgeW91IHdpbGwgaGF2ZSBhZG1pbiAoaS5lLiwgYCpgKVxuICAgKiBwZXJtaXNzaW9ucyBvbiBhbGwgcmVzb3VyY2VzLCBhbmQgdGhlIGRlcGxveW1lbnQgd2lsbCBoYXZlIG5hbWVkIElBTVxuICAgKiBjYXBhYmlsaXRpZXMgKGkuZS4sIGFibGUgdG8gY3JlYXRlIGFsbCBJQU0gcmVzb3VyY2VzKS5cbiAgICpcbiAgICogVGhpcyBpcyBhIHNob3J0aGFuZCB0aGF0IHlvdSBjYW4gdXNlIGlmIHlvdSBmdWxseSB0cnVzdCB0aGUgdGVtcGxhdGVzIHRoYXRcbiAgICogYXJlIGRlcGxveWVkIGluIHRoaXMgcGlwZWxpbmUuIElmIHlvdSB3YW50IG1vcmUgZmluZS1ncmFpbmVkIHBlcm1pc3Npb25zLFxuICAgKiB1c2UgYGFkZFRvUm9sZVBvbGljeWAgYW5kIGBjYXBhYmlsaXRpZXNgIHRvIGNvbnRyb2wgd2hhdCB0aGUgQ2xvdWRGb3JtYXRpb25cbiAgICogZGVwbG95bWVudCBpcyBhbGxvd2VkIHRvIGRvLlxuICAgKi9cbiAgcmVhZG9ubHkgYWRtaW5QZXJtaXNzaW9uczogYm9vbGVhbjtcbn1cblxuLyoqXG4gKiBBIGNsYXNzIHRvIGRlcGxveSBhIHN0YWNrIHRoYXQgaXMgcGFydCBvZiBhIENESyBBcHAsIHVzaW5nIENvZGVQaXBlbGluZS5cbiAqIFRoaXMgY29tcG9zaXRlIEFjdGlvbiB0YWtlcyBjYXJlIG9mIHByZXBhcmluZyBhbmQgZXhlY3V0aW5nIGEgQ2xvdWRGb3JtYXRpb24gQ2hhbmdlU2V0LlxuICpcbiAqIEl0IGN1cnJlbnRseSBkb2VzICpub3QqIHN1cHBvcnQgc3RhY2tzIHRoYXQgbWFrZSB1c2Ugb2YgYGBBc3NldGBgcywgYW5kXG4gKiByZXF1aXJlcyB0aGUgZGVwbG95ZWQgc3RhY2sgaXMgaW4gdGhlIHNhbWUgYWNjb3VudCBhbmQgcmVnaW9uIHdoZXJlIHRoZVxuICogQ29kZVBpcGVsaW5lIGlzIGhvc3RlZC5cbiAqL1xuZXhwb3J0IGNsYXNzIFBpcGVsaW5lRGVwbG95U3RhY2tBY3Rpb24gaW1wbGVtZW50cyBjb2RlcGlwZWxpbmUuSUFjdGlvbiB7XG4gIC8qKlxuICAgKiBUaGUgcm9sZSB1c2VkIGJ5IENsb3VkRm9ybWF0aW9uIGZvciB0aGUgZGVwbG95IGFjdGlvblxuICAgKi9cbiAgcHJpdmF0ZSBfZGVwbG95bWVudFJvbGU/OiBpYW0uSVJvbGU7XG5cbiAgcHJpdmF0ZSByZWFkb25seSBzdGFjazogY2RrLlN0YWNrO1xuICBwcml2YXRlIHJlYWRvbmx5IHByZXBhcmVDaGFuZ2VTZXRBY3Rpb246IGNwYWN0aW9ucy5DbG91ZEZvcm1hdGlvbkNyZWF0ZVJlcGxhY2VDaGFuZ2VTZXRBY3Rpb247XG4gIHByaXZhdGUgcmVhZG9ubHkgZXhlY3V0ZUNoYW5nZVNldEFjdGlvbjogY3BhY3Rpb25zLkNsb3VkRm9ybWF0aW9uRXhlY3V0ZUNoYW5nZVNldEFjdGlvbjtcblxuICBjb25zdHJ1Y3Rvcihwcm9wczogUGlwZWxpbmVEZXBsb3lTdGFja0FjdGlvblByb3BzKSB7XG4gICAgdGhpcy5zdGFjayA9IHByb3BzLnN0YWNrO1xuICAgIGNvbnN0IGFzc2V0cyA9IHRoaXMuc3RhY2subm9kZS5tZXRhZGF0YS5maWx0ZXIobWQgPT4gbWQudHlwZSA9PT0gY3hzY2hlbWEuQXJ0aWZhY3RNZXRhZGF0YUVudHJ5VHlwZS5BU1NFVCk7XG4gICAgaWYgKGFzc2V0cy5sZW5ndGggPiAwKSB7XG4gICAgICAvLyBGSVhNRTogSW1wbGVtZW50IHRoZSBuZWNlc3NhcnkgYWN0aW9ucyB0byBwdWJsaXNoIGFzc2V0c1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBDYW5ub3QgZGVwbG95IHRoZSBzdGFjayAke3RoaXMuc3RhY2suc3RhY2tOYW1lfSBiZWNhdXNlIGl0IHJlZmVyZW5jZXMgJHthc3NldHMubGVuZ3RofSBhc3NldChzKWApO1xuICAgIH1cblxuICAgIGNvbnN0IGNyZWF0ZUNoYW5nZVNldFJ1bk9yZGVyID0gcHJvcHMuY3JlYXRlQ2hhbmdlU2V0UnVuT3JkZXIgfHwgMTtcbiAgICBjb25zdCBleGVjdXRlQ2hhbmdlU2V0UnVuT3JkZXIgPSBwcm9wcy5leGVjdXRlQ2hhbmdlU2V0UnVuT3JkZXIgfHwgKGNyZWF0ZUNoYW5nZVNldFJ1bk9yZGVyICsgMSk7XG4gICAgaWYgKGNyZWF0ZUNoYW5nZVNldFJ1bk9yZGVyID49IGV4ZWN1dGVDaGFuZ2VTZXRSdW5PcmRlcikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBjcmVhdGVDaGFuZ2VTZXRSdW5PcmRlciAoJHtjcmVhdGVDaGFuZ2VTZXRSdW5PcmRlcn0pIG11c3QgYmUgPCBleGVjdXRlQ2hhbmdlU2V0UnVuT3JkZXIgKCR7ZXhlY3V0ZUNoYW5nZVNldFJ1bk9yZGVyfSlgKTtcbiAgICB9XG5cbiAgICBjb25zdCBjaGFuZ2VTZXROYW1lID0gcHJvcHMuY2hhbmdlU2V0TmFtZSB8fCAnQ0RLLUNvZGVQaXBlbGluZS1DaGFuZ2VTZXQnO1xuICAgIGNvbnN0IGNhcGFiaWxpdGllcyA9IGNmbkNhcGFiaWxpdGllcyhwcm9wcy5hZG1pblBlcm1pc3Npb25zLCBwcm9wcy5jYXBhYmlsaXRpZXMpO1xuICAgIHRoaXMucHJlcGFyZUNoYW5nZVNldEFjdGlvbiA9IG5ldyBjcGFjdGlvbnMuQ2xvdWRGb3JtYXRpb25DcmVhdGVSZXBsYWNlQ2hhbmdlU2V0QWN0aW9uKHtcbiAgICAgIGFjdGlvbk5hbWU6IHByb3BzLmNyZWF0ZUNoYW5nZVNldEFjdGlvbk5hbWUgPz8gJ0NoYW5nZVNldCcsXG4gICAgICBjaGFuZ2VTZXROYW1lLFxuICAgICAgcnVuT3JkZXI6IGNyZWF0ZUNoYW5nZVNldFJ1bk9yZGVyLFxuICAgICAgc3RhY2tOYW1lOiBwcm9wcy5zdGFjay5zdGFja05hbWUsXG4gICAgICB0ZW1wbGF0ZVBhdGg6IHByb3BzLmlucHV0LmF0UGF0aChwcm9wcy5zdGFjay50ZW1wbGF0ZUZpbGUpLFxuICAgICAgYWRtaW5QZXJtaXNzaW9uczogcHJvcHMuYWRtaW5QZXJtaXNzaW9ucyxcbiAgICAgIGRlcGxveW1lbnRSb2xlOiBwcm9wcy5yb2xlLFxuICAgICAgY2FwYWJpbGl0aWVzLFxuICAgIH0pO1xuICAgIHRoaXMuZXhlY3V0ZUNoYW5nZVNldEFjdGlvbiA9IG5ldyBjcGFjdGlvbnMuQ2xvdWRGb3JtYXRpb25FeGVjdXRlQ2hhbmdlU2V0QWN0aW9uKHtcbiAgICAgIGFjdGlvbk5hbWU6IHByb3BzLmV4ZWN1dGVDaGFuZ2VTZXRBY3Rpb25OYW1lID8/ICdFeGVjdXRlJyxcbiAgICAgIGNoYW5nZVNldE5hbWUsXG4gICAgICBydW5PcmRlcjogZXhlY3V0ZUNoYW5nZVNldFJ1bk9yZGVyLFxuICAgICAgc3RhY2tOYW1lOiB0aGlzLnN0YWNrLnN0YWNrTmFtZSxcbiAgICB9KTtcbiAgfVxuXG4gIHB1YmxpYyBiaW5kKHNjb3BlOiBDb25zdHJ1Y3QsIHN0YWdlOiBjb2RlcGlwZWxpbmUuSVN0YWdlLCBvcHRpb25zOiBjb2RlcGlwZWxpbmUuQWN0aW9uQmluZE9wdGlvbnMpOlxuICBjb2RlcGlwZWxpbmUuQWN0aW9uQ29uZmlnIHtcbiAgICBpZiAodGhpcy5zdGFjay5lbnZpcm9ubWVudCAhPT0gY2RrLlN0YWNrLm9mKHNjb3BlKS5lbnZpcm9ubWVudCkge1xuICAgICAgLy8gRklYTUU6IEFkZCB0aGUgbmVjZXNzYXJ5IHRvIGV4dGVuZCB0byBzdGFja3MgaW4gYSBkaWZmZXJlbnQgYWNjb3VudFxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdDcm9zcy1lbnZpcm9ubWVudCBkZXBsb3ltZW50IGlzIG5vdCBzdXBwb3J0ZWQnKTtcbiAgICB9XG5cbiAgICBzdGFnZS5hZGRBY3Rpb24odGhpcy5wcmVwYXJlQ2hhbmdlU2V0QWN0aW9uKTtcbiAgICB0aGlzLl9kZXBsb3ltZW50Um9sZSA9IHRoaXMucHJlcGFyZUNoYW5nZVNldEFjdGlvbi5kZXBsb3ltZW50Um9sZTtcblxuICAgIHJldHVybiB0aGlzLmV4ZWN1dGVDaGFuZ2VTZXRBY3Rpb24uYmluZChzY29wZSwgc3RhZ2UsIG9wdGlvbnMpO1xuICB9XG5cbiAgcHVibGljIGdldCBkZXBsb3ltZW50Um9sZSgpOiBpYW0uSVJvbGUge1xuICAgIGlmICghdGhpcy5fZGVwbG95bWVudFJvbGUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignVXNlIHRoaXMgYWN0aW9uIGluIGEgcGlwZWxpbmUgZmlyc3QgYmVmb3JlIGFjY2Vzc2luZyBcXCdkZXBsb3ltZW50Um9sZVxcJycpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLl9kZXBsb3ltZW50Um9sZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgcG9saWN5IHN0YXRlbWVudHMgdG8gdGhlIHJvbGUgZGVwbG95aW5nIHRoZSBzdGFjay5cbiAgICpcbiAgICogVGhpcyByb2xlIGlzIHBhc3NlZCB0byBDbG91ZEZvcm1hdGlvbiBhbmQgbXVzdCBoYXZlIHRoZSBJQU0gcGVybWlzc2lvbnNcbiAgICogbmVjZXNzYXJ5IHRvIGRlcGxveSB0aGUgc3RhY2sgb3IgeW91IGNhbiBncmFudCB0aGlzIHJvbGUgYGFkbWluUGVybWlzc2lvbnNgXG4gICAqIGJ5IHVzaW5nIHRoYXQgb3B0aW9uIGR1cmluZyBjcmVhdGlvbi4gSWYgeW91IGRvIG5vdCBncmFudFxuICAgKiBgYWRtaW5QZXJtaXNzaW9uc2AgeW91IG5lZWQgdG8gaWRlbnRpZnkgdGhlIHByb3BlciBzdGF0ZW1lbnRzIHRvIGFkZCB0b1xuICAgKiB0aGlzIHJvbGUgYmFzZWQgb24gdGhlIENsb3VkRm9ybWF0aW9uIFJlc291cmNlcyBpbiB5b3VyIHN0YWNrLlxuICAgKi9cbiAgcHVibGljIGFkZFRvRGVwbG95bWVudFJvbGVQb2xpY3koc3RhdGVtZW50OiBpYW0uUG9saWN5U3RhdGVtZW50KSB7XG4gICAgdGhpcy5kZXBsb3ltZW50Um9sZS5hZGRUb1BvbGljeShzdGF0ZW1lbnQpO1xuICB9XG5cbiAgcHVibGljIG9uU3RhdGVDaGFuZ2UobmFtZTogc3RyaW5nLCB0YXJnZXQ/OiBldmVudHMuSVJ1bGVUYXJnZXQsIG9wdGlvbnM/OiBldmVudHMuUnVsZVByb3BzKTogZXZlbnRzLlJ1bGUge1xuICAgIHJldHVybiB0aGlzLmV4ZWN1dGVDaGFuZ2VTZXRBY3Rpb24ub25TdGF0ZUNoYW5nZShuYW1lLCB0YXJnZXQsIG9wdGlvbnMpO1xuICB9XG5cbiAgcHVibGljIGdldCBhY3Rpb25Qcm9wZXJ0aWVzKCk6IGNvZGVwaXBlbGluZS5BY3Rpb25Qcm9wZXJ0aWVzIHtcbiAgICByZXR1cm4gdGhpcy5leGVjdXRlQ2hhbmdlU2V0QWN0aW9uLmFjdGlvblByb3BlcnRpZXM7XG4gIH1cbn1cblxuZnVuY3Rpb24gY2ZuQ2FwYWJpbGl0aWVzKGFkbWluUGVybWlzc2lvbnM6IGJvb2xlYW4sIGNhcGFiaWxpdGllcz86IGNmbi5DbG91ZEZvcm1hdGlvbkNhcGFiaWxpdGllc1tdKTogY2ZuLkNsb3VkRm9ybWF0aW9uQ2FwYWJpbGl0aWVzW10ge1xuICBpZiAoYWRtaW5QZXJtaXNzaW9ucyAmJiBjYXBhYmlsaXRpZXMgPT09IHVuZGVmaW5lZCkge1xuICAgIC8vIGFkbWluIHRydWUgZGVmYXVsdCBjYXBhYmlsaXR5IHRvIE5hbWVkSUFNIGFuZCBBdXRvRXhwYW5kXG4gICAgcmV0dXJuIFtjZm4uQ2xvdWRGb3JtYXRpb25DYXBhYmlsaXRpZXMuTkFNRURfSUFNLCBjZm4uQ2xvdWRGb3JtYXRpb25DYXBhYmlsaXRpZXMuQVVUT19FWFBBTkRdO1xuICB9IGVsc2UgaWYgKGNhcGFiaWxpdGllcyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgLy8gZWxzZSBjYXBhYmlsaXRpZXMgYXJlIHVuZGVmaW5lZCBzZXQgQW5vbnltb3VzSUFNIGFuZCBBdXRvRXhwYW5kXG4gICAgcmV0dXJuIFtjZm4uQ2xvdWRGb3JtYXRpb25DYXBhYmlsaXRpZXMuQU5PTllNT1VTX0lBTSwgY2ZuLkNsb3VkRm9ybWF0aW9uQ2FwYWJpbGl0aWVzLkFVVE9fRVhQQU5EXTtcbiAgfSBlbHNlIHtcbiAgICAvLyBlbHNlIGNhcGFiaWxpdGllcyBhcmUgZGVmaW5lZCB1c2UgdGhlbVxuICAgIHJldHVybiBjYXBhYmlsaXRpZXM7XG4gIH1cbn1cbiJdfQ==