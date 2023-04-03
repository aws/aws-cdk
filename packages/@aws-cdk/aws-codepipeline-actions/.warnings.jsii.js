function _aws_cdk_aws_codepipeline_actions_AlexaSkillDeployActionProps(p) {
}
function _aws_cdk_aws_codepipeline_actions_AlexaSkillDeployAction(p) {
}
function _aws_cdk_aws_codepipeline_actions_BitBucketSourceActionProps(p) {
}
function _aws_cdk_aws_codepipeline_actions_BitBucketSourceAction(p) {
}
function _aws_cdk_aws_codepipeline_actions_CodeStarSourceVariables(p) {
}
function _aws_cdk_aws_codepipeline_actions_CodeStarConnectionsSourceActionProps(p) {
}
function _aws_cdk_aws_codepipeline_actions_CodeStarConnectionsSourceAction(p) {
}
function _aws_cdk_aws_codepipeline_actions_CloudFormationExecuteChangeSetActionProps(p) {
}
function _aws_cdk_aws_codepipeline_actions_CloudFormationExecuteChangeSetAction(p) {
}
function _aws_cdk_aws_codepipeline_actions_CloudFormationCreateReplaceChangeSetActionProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if ("capabilities" in p)
            print("@aws-cdk/aws-codepipeline-actions.CloudFormationCreateReplaceChangeSetActionProps#capabilities", "use `cfnCapabilities` instead");
        if (p.capabilities != null)
            for (const o of p.capabilities)
                if (!visitedObjects.has(o))
                    require("@aws-cdk/aws-cloudformation/.warnings.jsii.js")._aws_cdk_aws_cloudformation_CloudFormationCapabilities(o);
        if (p.cfnCapabilities != null)
            for (const o of p.cfnCapabilities)
                if (!visitedObjects.has(o))
                    require("@aws-cdk/core/.warnings.jsii.js")._aws_cdk_core_CfnCapabilities(o);
        if (p.extraInputs != null)
            for (const o of p.extraInputs)
                if (!visitedObjects.has(o))
                    require("@aws-cdk/aws-codepipeline/.warnings.jsii.js")._aws_cdk_aws_codepipeline_Artifact(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_codepipeline_actions_CloudFormationCreateReplaceChangeSetAction(p) {
}
function _aws_cdk_aws_codepipeline_actions_CloudFormationCreateUpdateStackActionProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if ("capabilities" in p)
            print("@aws-cdk/aws-codepipeline-actions.CloudFormationCreateUpdateStackActionProps#capabilities", "use `cfnCapabilities` instead");
        if (p.capabilities != null)
            for (const o of p.capabilities)
                if (!visitedObjects.has(o))
                    require("@aws-cdk/aws-cloudformation/.warnings.jsii.js")._aws_cdk_aws_cloudformation_CloudFormationCapabilities(o);
        if (p.cfnCapabilities != null)
            for (const o of p.cfnCapabilities)
                if (!visitedObjects.has(o))
                    require("@aws-cdk/core/.warnings.jsii.js")._aws_cdk_core_CfnCapabilities(o);
        if (p.extraInputs != null)
            for (const o of p.extraInputs)
                if (!visitedObjects.has(o))
                    require("@aws-cdk/aws-codepipeline/.warnings.jsii.js")._aws_cdk_aws_codepipeline_Artifact(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_codepipeline_actions_CloudFormationCreateUpdateStackAction(p) {
}
function _aws_cdk_aws_codepipeline_actions_CloudFormationDeleteStackActionProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if ("capabilities" in p)
            print("@aws-cdk/aws-codepipeline-actions.CloudFormationDeleteStackActionProps#capabilities", "use `cfnCapabilities` instead");
        if (p.capabilities != null)
            for (const o of p.capabilities)
                if (!visitedObjects.has(o))
                    require("@aws-cdk/aws-cloudformation/.warnings.jsii.js")._aws_cdk_aws_cloudformation_CloudFormationCapabilities(o);
        if (p.cfnCapabilities != null)
            for (const o of p.cfnCapabilities)
                if (!visitedObjects.has(o))
                    require("@aws-cdk/core/.warnings.jsii.js")._aws_cdk_core_CfnCapabilities(o);
        if (p.extraInputs != null)
            for (const o of p.extraInputs)
                if (!visitedObjects.has(o))
                    require("@aws-cdk/aws-codepipeline/.warnings.jsii.js")._aws_cdk_aws_codepipeline_Artifact(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_codepipeline_actions_CloudFormationDeleteStackAction(p) {
}
function _aws_cdk_aws_codepipeline_actions_CloudFormationDeployStackSetActionProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.template))
            _aws_cdk_aws_codepipeline_actions_StackSetTemplate(p.template);
        if (p.cfnCapabilities != null)
            for (const o of p.cfnCapabilities)
                if (!visitedObjects.has(o))
                    require("@aws-cdk/core/.warnings.jsii.js")._aws_cdk_core_CfnCapabilities(o);
        if (!visitedObjects.has(p.deploymentModel))
            _aws_cdk_aws_codepipeline_actions_StackSetDeploymentModel(p.deploymentModel);
        if (!visitedObjects.has(p.parameters))
            _aws_cdk_aws_codepipeline_actions_StackSetParameters(p.parameters);
        if (!visitedObjects.has(p.stackInstances))
            _aws_cdk_aws_codepipeline_actions_StackInstances(p.stackInstances);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_codepipeline_actions_CloudFormationDeployStackSetAction(p) {
}
function _aws_cdk_aws_codepipeline_actions_CloudFormationDeployStackInstancesActionProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.stackInstances))
            _aws_cdk_aws_codepipeline_actions_StackInstances(p.stackInstances);
        if (!visitedObjects.has(p.parameterOverrides))
            _aws_cdk_aws_codepipeline_actions_StackSetParameters(p.parameterOverrides);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_codepipeline_actions_CloudFormationDeployStackInstancesAction(p) {
}
function _aws_cdk_aws_codepipeline_actions_CommonCloudFormationStackSetOptions(p) {
}
function _aws_cdk_aws_codepipeline_actions_StackSetTemplate(p) {
}
function _aws_cdk_aws_codepipeline_actions_StackInstances(p) {
}
function _aws_cdk_aws_codepipeline_actions_StackSetParameters(p) {
}
function _aws_cdk_aws_codepipeline_actions_StackSetDeploymentModel(p) {
}
function _aws_cdk_aws_codepipeline_actions_OrganizationsDeploymentProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.autoDeployment))
            _aws_cdk_aws_codepipeline_actions_StackSetOrganizationsAutoDeployment(p.autoDeployment);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_codepipeline_actions_StackSetOrganizationsAutoDeployment(p) {
}
function _aws_cdk_aws_codepipeline_actions_SelfManagedDeploymentProps(p) {
}
function _aws_cdk_aws_codepipeline_actions_CodeBuildActionType(p) {
}
function _aws_cdk_aws_codepipeline_actions_CodeBuildActionProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (p.environmentVariables != null)
            for (const o of Object.values(p.environmentVariables))
                if (!visitedObjects.has(o))
                    require("@aws-cdk/aws-codebuild/.warnings.jsii.js")._aws_cdk_aws_codebuild_BuildEnvironmentVariable(o);
        if (p.extraInputs != null)
            for (const o of p.extraInputs)
                if (!visitedObjects.has(o))
                    require("@aws-cdk/aws-codepipeline/.warnings.jsii.js")._aws_cdk_aws_codepipeline_Artifact(o);
        if (p.outputs != null)
            for (const o of p.outputs)
                if (!visitedObjects.has(o))
                    require("@aws-cdk/aws-codepipeline/.warnings.jsii.js")._aws_cdk_aws_codepipeline_Artifact(o);
        if (!visitedObjects.has(p.type))
            _aws_cdk_aws_codepipeline_actions_CodeBuildActionType(p.type);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_codepipeline_actions_CodeBuildAction(p) {
}
function _aws_cdk_aws_codepipeline_actions_CodeCommitTrigger(p) {
}
function _aws_cdk_aws_codepipeline_actions_CodeCommitSourceVariables(p) {
}
function _aws_cdk_aws_codepipeline_actions_CodeCommitSourceActionProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.trigger))
            _aws_cdk_aws_codepipeline_actions_CodeCommitTrigger(p.trigger);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_codepipeline_actions_CodeCommitSourceAction(p) {
}
function _aws_cdk_aws_codepipeline_actions_CodeDeployEcsContainerImageInput(p) {
}
function _aws_cdk_aws_codepipeline_actions_CodeDeployEcsDeployActionProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (p.containerImageInputs != null)
            for (const o of p.containerImageInputs)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_codepipeline_actions_CodeDeployEcsContainerImageInput(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_codepipeline_actions_CodeDeployEcsDeployAction(p) {
}
function _aws_cdk_aws_codepipeline_actions_CodeDeployServerDeployActionProps(p) {
}
function _aws_cdk_aws_codepipeline_actions_CodeDeployServerDeployAction(p) {
}
function _aws_cdk_aws_codepipeline_actions_EcrSourceVariables(p) {
}
function _aws_cdk_aws_codepipeline_actions_EcrSourceActionProps(p) {
}
function _aws_cdk_aws_codepipeline_actions_EcrSourceAction(p) {
}
function _aws_cdk_aws_codepipeline_actions_EcsDeployActionProps(p) {
}
function _aws_cdk_aws_codepipeline_actions_EcsDeployAction(p) {
}
function _aws_cdk_aws_codepipeline_actions_ElasticBeanstalkDeployActionProps(p) {
}
function _aws_cdk_aws_codepipeline_actions_ElasticBeanstalkDeployAction(p) {
}
function _aws_cdk_aws_codepipeline_actions_GitHubTrigger(p) {
}
function _aws_cdk_aws_codepipeline_actions_GitHubSourceVariables(p) {
}
function _aws_cdk_aws_codepipeline_actions_GitHubSourceActionProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.trigger))
            _aws_cdk_aws_codepipeline_actions_GitHubTrigger(p.trigger);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_codepipeline_actions_GitHubSourceAction(p) {
}
function _aws_cdk_aws_codepipeline_actions_JenkinsActionType(p) {
}
function _aws_cdk_aws_codepipeline_actions_JenkinsActionProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.jenkinsProvider))
            _aws_cdk_aws_codepipeline_actions_IJenkinsProvider(p.jenkinsProvider);
        if (!visitedObjects.has(p.type))
            _aws_cdk_aws_codepipeline_actions_JenkinsActionType(p.type);
        if (p.inputs != null)
            for (const o of p.inputs)
                if (!visitedObjects.has(o))
                    require("@aws-cdk/aws-codepipeline/.warnings.jsii.js")._aws_cdk_aws_codepipeline_Artifact(o);
        if (p.outputs != null)
            for (const o of p.outputs)
                if (!visitedObjects.has(o))
                    require("@aws-cdk/aws-codepipeline/.warnings.jsii.js")._aws_cdk_aws_codepipeline_Artifact(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_codepipeline_actions_JenkinsAction(p) {
}
function _aws_cdk_aws_codepipeline_actions_IJenkinsProvider(p) {
}
function _aws_cdk_aws_codepipeline_actions_JenkinsProviderAttributes(p) {
}
function _aws_cdk_aws_codepipeline_actions_JenkinsProviderProps(p) {
}
function _aws_cdk_aws_codepipeline_actions_BaseJenkinsProvider(p) {
}
function _aws_cdk_aws_codepipeline_actions_JenkinsProvider(p) {
}
function _aws_cdk_aws_codepipeline_actions_LambdaInvokeActionProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (p.inputs != null)
            for (const o of p.inputs)
                if (!visitedObjects.has(o))
                    require("@aws-cdk/aws-codepipeline/.warnings.jsii.js")._aws_cdk_aws_codepipeline_Artifact(o);
        if (p.outputs != null)
            for (const o of p.outputs)
                if (!visitedObjects.has(o))
                    require("@aws-cdk/aws-codepipeline/.warnings.jsii.js")._aws_cdk_aws_codepipeline_Artifact(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_codepipeline_actions_LambdaInvokeAction(p) {
}
function _aws_cdk_aws_codepipeline_actions_ManualApprovalActionProps(p) {
}
function _aws_cdk_aws_codepipeline_actions_ManualApprovalAction(p) {
}
function _aws_cdk_aws_codepipeline_actions_CacheControl(p) {
}
function _aws_cdk_aws_codepipeline_actions_S3DeployActionProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (p.cacheControl != null)
            for (const o of p.cacheControl)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_codepipeline_actions_CacheControl(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_codepipeline_actions_S3DeployAction(p) {
}
function _aws_cdk_aws_codepipeline_actions_S3Trigger(p) {
}
function _aws_cdk_aws_codepipeline_actions_S3SourceVariables(p) {
}
function _aws_cdk_aws_codepipeline_actions_S3SourceActionProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.trigger))
            _aws_cdk_aws_codepipeline_actions_S3Trigger(p.trigger);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_codepipeline_actions_S3SourceAction(p) {
}
function _aws_cdk_aws_codepipeline_actions_StateMachineInput(p) {
}
function _aws_cdk_aws_codepipeline_actions_StepFunctionsInvokeActionProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.stateMachineInput))
            _aws_cdk_aws_codepipeline_actions_StateMachineInput(p.stateMachineInput);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_codepipeline_actions_StepFunctionInvokeAction(p) {
}
function _aws_cdk_aws_codepipeline_actions_ServiceCatalogDeployActionBeta1Props(p) {
}
function _aws_cdk_aws_codepipeline_actions_ServiceCatalogDeployActionBeta1(p) {
}
function _aws_cdk_aws_codepipeline_actions_Action(p) {
}
function print(name, deprecationMessage) {
    const deprecated = process.env.JSII_DEPRECATED;
    const deprecationMode = ["warn", "fail", "quiet"].includes(deprecated) ? deprecated : "warn";
    const message = `${name} is deprecated.\n  ${deprecationMessage.trim()}\n  This API will be removed in the next major release.`;
    switch (deprecationMode) {
        case "fail":
            throw new DeprecationError(message);
        case "warn":
            console.warn("[WARNING]", message);
            break;
    }
}
function getPropertyDescriptor(obj, prop) {
    const descriptor = Object.getOwnPropertyDescriptor(obj, prop);
    if (descriptor) {
        return descriptor;
    }
    const proto = Object.getPrototypeOf(obj);
    const prototypeDescriptor = proto && getPropertyDescriptor(proto, prop);
    if (prototypeDescriptor) {
        return prototypeDescriptor;
    }
    return {};
}
const visitedObjects = new Set();
class DeprecationError extends Error {
    constructor(...args) {
        super(...args);
        Object.defineProperty(this, "name", {
            configurable: false,
            enumerable: true,
            value: "DeprecationError",
            writable: false,
        });
    }
}
module.exports = { print, getPropertyDescriptor, DeprecationError, _aws_cdk_aws_codepipeline_actions_AlexaSkillDeployActionProps, _aws_cdk_aws_codepipeline_actions_AlexaSkillDeployAction, _aws_cdk_aws_codepipeline_actions_BitBucketSourceActionProps, _aws_cdk_aws_codepipeline_actions_BitBucketSourceAction, _aws_cdk_aws_codepipeline_actions_CodeStarSourceVariables, _aws_cdk_aws_codepipeline_actions_CodeStarConnectionsSourceActionProps, _aws_cdk_aws_codepipeline_actions_CodeStarConnectionsSourceAction, _aws_cdk_aws_codepipeline_actions_CloudFormationExecuteChangeSetActionProps, _aws_cdk_aws_codepipeline_actions_CloudFormationExecuteChangeSetAction, _aws_cdk_aws_codepipeline_actions_CloudFormationCreateReplaceChangeSetActionProps, _aws_cdk_aws_codepipeline_actions_CloudFormationCreateReplaceChangeSetAction, _aws_cdk_aws_codepipeline_actions_CloudFormationCreateUpdateStackActionProps, _aws_cdk_aws_codepipeline_actions_CloudFormationCreateUpdateStackAction, _aws_cdk_aws_codepipeline_actions_CloudFormationDeleteStackActionProps, _aws_cdk_aws_codepipeline_actions_CloudFormationDeleteStackAction, _aws_cdk_aws_codepipeline_actions_CloudFormationDeployStackSetActionProps, _aws_cdk_aws_codepipeline_actions_CloudFormationDeployStackSetAction, _aws_cdk_aws_codepipeline_actions_CloudFormationDeployStackInstancesActionProps, _aws_cdk_aws_codepipeline_actions_CloudFormationDeployStackInstancesAction, _aws_cdk_aws_codepipeline_actions_CommonCloudFormationStackSetOptions, _aws_cdk_aws_codepipeline_actions_StackSetTemplate, _aws_cdk_aws_codepipeline_actions_StackInstances, _aws_cdk_aws_codepipeline_actions_StackSetParameters, _aws_cdk_aws_codepipeline_actions_StackSetDeploymentModel, _aws_cdk_aws_codepipeline_actions_OrganizationsDeploymentProps, _aws_cdk_aws_codepipeline_actions_StackSetOrganizationsAutoDeployment, _aws_cdk_aws_codepipeline_actions_SelfManagedDeploymentProps, _aws_cdk_aws_codepipeline_actions_CodeBuildActionType, _aws_cdk_aws_codepipeline_actions_CodeBuildActionProps, _aws_cdk_aws_codepipeline_actions_CodeBuildAction, _aws_cdk_aws_codepipeline_actions_CodeCommitTrigger, _aws_cdk_aws_codepipeline_actions_CodeCommitSourceVariables, _aws_cdk_aws_codepipeline_actions_CodeCommitSourceActionProps, _aws_cdk_aws_codepipeline_actions_CodeCommitSourceAction, _aws_cdk_aws_codepipeline_actions_CodeDeployEcsContainerImageInput, _aws_cdk_aws_codepipeline_actions_CodeDeployEcsDeployActionProps, _aws_cdk_aws_codepipeline_actions_CodeDeployEcsDeployAction, _aws_cdk_aws_codepipeline_actions_CodeDeployServerDeployActionProps, _aws_cdk_aws_codepipeline_actions_CodeDeployServerDeployAction, _aws_cdk_aws_codepipeline_actions_EcrSourceVariables, _aws_cdk_aws_codepipeline_actions_EcrSourceActionProps, _aws_cdk_aws_codepipeline_actions_EcrSourceAction, _aws_cdk_aws_codepipeline_actions_EcsDeployActionProps, _aws_cdk_aws_codepipeline_actions_EcsDeployAction, _aws_cdk_aws_codepipeline_actions_ElasticBeanstalkDeployActionProps, _aws_cdk_aws_codepipeline_actions_ElasticBeanstalkDeployAction, _aws_cdk_aws_codepipeline_actions_GitHubTrigger, _aws_cdk_aws_codepipeline_actions_GitHubSourceVariables, _aws_cdk_aws_codepipeline_actions_GitHubSourceActionProps, _aws_cdk_aws_codepipeline_actions_GitHubSourceAction, _aws_cdk_aws_codepipeline_actions_JenkinsActionType, _aws_cdk_aws_codepipeline_actions_JenkinsActionProps, _aws_cdk_aws_codepipeline_actions_JenkinsAction, _aws_cdk_aws_codepipeline_actions_IJenkinsProvider, _aws_cdk_aws_codepipeline_actions_JenkinsProviderAttributes, _aws_cdk_aws_codepipeline_actions_JenkinsProviderProps, _aws_cdk_aws_codepipeline_actions_BaseJenkinsProvider, _aws_cdk_aws_codepipeline_actions_JenkinsProvider, _aws_cdk_aws_codepipeline_actions_LambdaInvokeActionProps, _aws_cdk_aws_codepipeline_actions_LambdaInvokeAction, _aws_cdk_aws_codepipeline_actions_ManualApprovalActionProps, _aws_cdk_aws_codepipeline_actions_ManualApprovalAction, _aws_cdk_aws_codepipeline_actions_CacheControl, _aws_cdk_aws_codepipeline_actions_S3DeployActionProps, _aws_cdk_aws_codepipeline_actions_S3DeployAction, _aws_cdk_aws_codepipeline_actions_S3Trigger, _aws_cdk_aws_codepipeline_actions_S3SourceVariables, _aws_cdk_aws_codepipeline_actions_S3SourceActionProps, _aws_cdk_aws_codepipeline_actions_S3SourceAction, _aws_cdk_aws_codepipeline_actions_StateMachineInput, _aws_cdk_aws_codepipeline_actions_StepFunctionsInvokeActionProps, _aws_cdk_aws_codepipeline_actions_StepFunctionInvokeAction, _aws_cdk_aws_codepipeline_actions_ServiceCatalogDeployActionBeta1Props, _aws_cdk_aws_codepipeline_actions_ServiceCatalogDeployActionBeta1, _aws_cdk_aws_codepipeline_actions_Action };
