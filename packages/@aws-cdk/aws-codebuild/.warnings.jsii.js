function _aws_cdk_aws_codebuild_StateChangeEvent(p) {
}
function _aws_cdk_aws_codebuild_PhaseChangeEvent(p) {
}
function _aws_cdk_aws_codebuild_PipelineProjectProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.buildSpec))
            _aws_cdk_aws_codebuild_BuildSpec(p.buildSpec);
        if (!visitedObjects.has(p.cache))
            _aws_cdk_aws_codebuild_Cache(p.cache);
        if (!visitedObjects.has(p.environment))
            _aws_cdk_aws_codebuild_BuildEnvironment(p.environment);
        if (p.environmentVariables != null)
            for (const o of Object.values(p.environmentVariables))
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_codebuild_BuildEnvironmentVariable(o);
        if (p.fileSystemLocations != null)
            for (const o of p.fileSystemLocations)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_codebuild_IFileSystemLocation(o);
        if (!visitedObjects.has(p.logging))
            _aws_cdk_aws_codebuild_LoggingOptions(p.logging);
        if (p.securityGroups != null)
            for (const o of p.securityGroups)
                if (!visitedObjects.has(o))
                    require("@aws-cdk/aws-ec2/.warnings.jsii.js")._aws_cdk_aws_ec2_ISecurityGroup(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_codebuild_PipelineProject(p) {
}
function _aws_cdk_aws_codebuild_BatchBuildConfig(p) {
}
function _aws_cdk_aws_codebuild_BuildEnvironmentCertificate(p) {
}
function _aws_cdk_aws_codebuild_ProjectNotifyOnOptions(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (p.events != null)
            for (const o of p.events)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_codebuild_ProjectNotificationEvents(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_codebuild_IProject(p) {
}
function _aws_cdk_aws_codebuild_CommonProjectProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.buildSpec))
            _aws_cdk_aws_codebuild_BuildSpec(p.buildSpec);
        if (!visitedObjects.has(p.cache))
            _aws_cdk_aws_codebuild_Cache(p.cache);
        if (!visitedObjects.has(p.environment))
            _aws_cdk_aws_codebuild_BuildEnvironment(p.environment);
        if (p.environmentVariables != null)
            for (const o of Object.values(p.environmentVariables))
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_codebuild_BuildEnvironmentVariable(o);
        if (p.fileSystemLocations != null)
            for (const o of p.fileSystemLocations)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_codebuild_IFileSystemLocation(o);
        if (!visitedObjects.has(p.logging))
            _aws_cdk_aws_codebuild_LoggingOptions(p.logging);
        if (p.securityGroups != null)
            for (const o of p.securityGroups)
                if (!visitedObjects.has(o))
                    require("@aws-cdk/aws-ec2/.warnings.jsii.js")._aws_cdk_aws_ec2_ISecurityGroup(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_codebuild_ProjectProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.artifacts))
            _aws_cdk_aws_codebuild_IArtifacts(p.artifacts);
        if (p.secondaryArtifacts != null)
            for (const o of p.secondaryArtifacts)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_codebuild_IArtifacts(o);
        if (p.secondarySources != null)
            for (const o of p.secondarySources)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_codebuild_ISource(o);
        if (!visitedObjects.has(p.source))
            _aws_cdk_aws_codebuild_ISource(p.source);
        if (!visitedObjects.has(p.buildSpec))
            _aws_cdk_aws_codebuild_BuildSpec(p.buildSpec);
        if (!visitedObjects.has(p.cache))
            _aws_cdk_aws_codebuild_Cache(p.cache);
        if (!visitedObjects.has(p.environment))
            _aws_cdk_aws_codebuild_BuildEnvironment(p.environment);
        if (p.environmentVariables != null)
            for (const o of Object.values(p.environmentVariables))
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_codebuild_BuildEnvironmentVariable(o);
        if (p.fileSystemLocations != null)
            for (const o of p.fileSystemLocations)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_codebuild_IFileSystemLocation(o);
        if (!visitedObjects.has(p.logging))
            _aws_cdk_aws_codebuild_LoggingOptions(p.logging);
        if (p.securityGroups != null)
            for (const o of p.securityGroups)
                if (!visitedObjects.has(o))
                    require("@aws-cdk/aws-ec2/.warnings.jsii.js")._aws_cdk_aws_ec2_ISecurityGroup(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_codebuild_BindToCodePipelineOptions(p) {
}
function _aws_cdk_aws_codebuild_Project(p) {
}
function _aws_cdk_aws_codebuild_ComputeType(p) {
}
function _aws_cdk_aws_codebuild_ImagePullPrincipalType(p) {
}
function _aws_cdk_aws_codebuild_BuildEnvironment(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.buildImage))
            _aws_cdk_aws_codebuild_IBuildImage(p.buildImage);
        if (!visitedObjects.has(p.certificate))
            _aws_cdk_aws_codebuild_BuildEnvironmentCertificate(p.certificate);
        if (!visitedObjects.has(p.computeType))
            _aws_cdk_aws_codebuild_ComputeType(p.computeType);
        if (p.environmentVariables != null)
            for (const o of Object.values(p.environmentVariables))
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_codebuild_BuildEnvironmentVariable(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_codebuild_IBuildImage(p) {
}
function _aws_cdk_aws_codebuild_BuildImageBindOptions(p) {
}
function _aws_cdk_aws_codebuild_BuildImageConfig(p) {
}
function _aws_cdk_aws_codebuild_IBindableBuildImage(p) {
}
function _aws_cdk_aws_codebuild_DockerImageOptions(p) {
}
function _aws_cdk_aws_codebuild_LinuxBuildImage(p) {
}
function _aws_cdk_aws_codebuild_WindowsImageType(p) {
}
function _aws_cdk_aws_codebuild_WindowsBuildImage(p) {
}
function _aws_cdk_aws_codebuild_BuildEnvironmentVariable(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.type))
            _aws_cdk_aws_codebuild_BuildEnvironmentVariableType(p.type);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_codebuild_BuildEnvironmentVariableType(p) {
}
function _aws_cdk_aws_codebuild_ProjectNotificationEvents(p) {
}
function _aws_cdk_aws_codebuild_S3LoggingOptions(p) {
}
function _aws_cdk_aws_codebuild_CloudWatchLoggingOptions(p) {
}
function _aws_cdk_aws_codebuild_LoggingOptions(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.cloudWatch))
            _aws_cdk_aws_codebuild_CloudWatchLoggingOptions(p.cloudWatch);
        if (!visitedObjects.has(p.s3))
            _aws_cdk_aws_codebuild_S3LoggingOptions(p.s3);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_codebuild_IReportGroup(p) {
}
function _aws_cdk_aws_codebuild_ReportGroupType(p) {
}
function _aws_cdk_aws_codebuild_ReportGroupProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.type))
            _aws_cdk_aws_codebuild_ReportGroupType(p.type);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_codebuild_ReportGroup(p) {
}
function _aws_cdk_aws_codebuild_SourceConfig(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.sourceProperty))
            _aws_cdk_aws_codebuild_CfnProject_SourceProperty(p.sourceProperty);
        if (!visitedObjects.has(p.buildTriggers))
            _aws_cdk_aws_codebuild_CfnProject_ProjectTriggersProperty(p.buildTriggers);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_codebuild_ISource(p) {
}
function _aws_cdk_aws_codebuild_SourceProps(p) {
}
function _aws_cdk_aws_codebuild_Source(p) {
}
function _aws_cdk_aws_codebuild_EventAction(p) {
}
function _aws_cdk_aws_codebuild_FilterGroup(p) {
}
function _aws_cdk_aws_codebuild_CodeCommitSourceProps(p) {
}
function _aws_cdk_aws_codebuild_S3SourceProps(p) {
}
function _aws_cdk_aws_codebuild_GitHubSourceProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (p.webhookFilters != null)
            for (const o of p.webhookFilters)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_codebuild_FilterGroup(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_codebuild_GitHubEnterpriseSourceProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (p.webhookFilters != null)
            for (const o of p.webhookFilters)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_codebuild_FilterGroup(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_codebuild_BitBucketSourceProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (p.webhookFilters != null)
            for (const o of p.webhookFilters)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_codebuild_FilterGroup(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_codebuild_GitHubSourceCredentialsProps(p) {
}
function _aws_cdk_aws_codebuild_GitHubSourceCredentials(p) {
}
function _aws_cdk_aws_codebuild_GitHubEnterpriseSourceCredentialsProps(p) {
}
function _aws_cdk_aws_codebuild_GitHubEnterpriseSourceCredentials(p) {
}
function _aws_cdk_aws_codebuild_BitBucketSourceCredentialsProps(p) {
}
function _aws_cdk_aws_codebuild_BitBucketSourceCredentials(p) {
}
function _aws_cdk_aws_codebuild_ArtifactsConfig(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.artifactsProperty))
            _aws_cdk_aws_codebuild_CfnProject_ArtifactsProperty(p.artifactsProperty);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_codebuild_IArtifacts(p) {
}
function _aws_cdk_aws_codebuild_ArtifactsProps(p) {
}
function _aws_cdk_aws_codebuild_Artifacts(p) {
}
function _aws_cdk_aws_codebuild_S3ArtifactsProps(p) {
}
function _aws_cdk_aws_codebuild_BucketCacheOptions(p) {
}
function _aws_cdk_aws_codebuild_LocalCacheMode(p) {
}
function _aws_cdk_aws_codebuild_Cache(p) {
}
function _aws_cdk_aws_codebuild_BuildSpec(p) {
}
function _aws_cdk_aws_codebuild_FileSystemConfig(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.location))
            _aws_cdk_aws_codebuild_CfnProject_ProjectFileSystemLocationProperty(p.location);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_codebuild_IFileSystemLocation(p) {
}
function _aws_cdk_aws_codebuild_FileSystemLocation(p) {
}
function _aws_cdk_aws_codebuild_EfsFileSystemLocationProps(p) {
}
function _aws_cdk_aws_codebuild_LinuxGpuBuildImage(p) {
}
function _aws_cdk_aws_codebuild_UntrustedCodeBoundaryPolicyProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (p.additionalStatements != null)
            for (const o of p.additionalStatements)
                if (!visitedObjects.has(o))
                    require("@aws-cdk/aws-iam/.warnings.jsii.js")._aws_cdk_aws_iam_PolicyStatement(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_codebuild_UntrustedCodeBoundaryPolicy(p) {
}
function _aws_cdk_aws_codebuild_LinuxArmBuildImage(p) {
}
function _aws_cdk_aws_codebuild_CfnProjectProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.source))
            _aws_cdk_aws_codebuild_CfnProject_SourceProperty(p.source);
        if (p.tags != null)
            for (const o of p.tags)
                if (!visitedObjects.has(o))
                    require("@aws-cdk/core/.warnings.jsii.js")._aws_cdk_core_CfnTag(o);
        if (!visitedObjects.has(p.triggers))
            _aws_cdk_aws_codebuild_CfnProject_ProjectTriggersProperty(p.triggers);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_codebuild_CfnProject(p) {
}
function _aws_cdk_aws_codebuild_CfnProject_ArtifactsProperty(p) {
}
function _aws_cdk_aws_codebuild_CfnProject_BatchRestrictionsProperty(p) {
}
function _aws_cdk_aws_codebuild_CfnProject_BuildStatusConfigProperty(p) {
}
function _aws_cdk_aws_codebuild_CfnProject_CloudWatchLogsConfigProperty(p) {
}
function _aws_cdk_aws_codebuild_CfnProject_EnvironmentProperty(p) {
}
function _aws_cdk_aws_codebuild_CfnProject_EnvironmentVariableProperty(p) {
}
function _aws_cdk_aws_codebuild_CfnProject_GitSubmodulesConfigProperty(p) {
}
function _aws_cdk_aws_codebuild_CfnProject_LogsConfigProperty(p) {
}
function _aws_cdk_aws_codebuild_CfnProject_ProjectBuildBatchConfigProperty(p) {
}
function _aws_cdk_aws_codebuild_CfnProject_ProjectCacheProperty(p) {
}
function _aws_cdk_aws_codebuild_CfnProject_ProjectFileSystemLocationProperty(p) {
}
function _aws_cdk_aws_codebuild_CfnProject_ProjectSourceVersionProperty(p) {
}
function _aws_cdk_aws_codebuild_CfnProject_ProjectTriggersProperty(p) {
}
function _aws_cdk_aws_codebuild_CfnProject_RegistryCredentialProperty(p) {
}
function _aws_cdk_aws_codebuild_CfnProject_S3LogsConfigProperty(p) {
}
function _aws_cdk_aws_codebuild_CfnProject_SourceProperty(p) {
}
function _aws_cdk_aws_codebuild_CfnProject_SourceAuthProperty(p) {
}
function _aws_cdk_aws_codebuild_CfnProject_VpcConfigProperty(p) {
}
function _aws_cdk_aws_codebuild_CfnProject_WebhookFilterProperty(p) {
}
function _aws_cdk_aws_codebuild_CfnReportGroupProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (p.tags != null)
            for (const o of p.tags)
                if (!visitedObjects.has(o))
                    require("@aws-cdk/core/.warnings.jsii.js")._aws_cdk_core_CfnTag(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_codebuild_CfnReportGroup(p) {
}
function _aws_cdk_aws_codebuild_CfnReportGroup_ReportExportConfigProperty(p) {
}
function _aws_cdk_aws_codebuild_CfnReportGroup_S3ReportExportConfigProperty(p) {
}
function _aws_cdk_aws_codebuild_CfnSourceCredentialProps(p) {
}
function _aws_cdk_aws_codebuild_CfnSourceCredential(p) {
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
module.exports = { print, getPropertyDescriptor, DeprecationError, _aws_cdk_aws_codebuild_StateChangeEvent, _aws_cdk_aws_codebuild_PhaseChangeEvent, _aws_cdk_aws_codebuild_PipelineProjectProps, _aws_cdk_aws_codebuild_PipelineProject, _aws_cdk_aws_codebuild_BatchBuildConfig, _aws_cdk_aws_codebuild_BuildEnvironmentCertificate, _aws_cdk_aws_codebuild_ProjectNotifyOnOptions, _aws_cdk_aws_codebuild_IProject, _aws_cdk_aws_codebuild_CommonProjectProps, _aws_cdk_aws_codebuild_ProjectProps, _aws_cdk_aws_codebuild_BindToCodePipelineOptions, _aws_cdk_aws_codebuild_Project, _aws_cdk_aws_codebuild_ComputeType, _aws_cdk_aws_codebuild_ImagePullPrincipalType, _aws_cdk_aws_codebuild_BuildEnvironment, _aws_cdk_aws_codebuild_IBuildImage, _aws_cdk_aws_codebuild_BuildImageBindOptions, _aws_cdk_aws_codebuild_BuildImageConfig, _aws_cdk_aws_codebuild_IBindableBuildImage, _aws_cdk_aws_codebuild_DockerImageOptions, _aws_cdk_aws_codebuild_LinuxBuildImage, _aws_cdk_aws_codebuild_WindowsImageType, _aws_cdk_aws_codebuild_WindowsBuildImage, _aws_cdk_aws_codebuild_BuildEnvironmentVariable, _aws_cdk_aws_codebuild_BuildEnvironmentVariableType, _aws_cdk_aws_codebuild_ProjectNotificationEvents, _aws_cdk_aws_codebuild_S3LoggingOptions, _aws_cdk_aws_codebuild_CloudWatchLoggingOptions, _aws_cdk_aws_codebuild_LoggingOptions, _aws_cdk_aws_codebuild_IReportGroup, _aws_cdk_aws_codebuild_ReportGroupType, _aws_cdk_aws_codebuild_ReportGroupProps, _aws_cdk_aws_codebuild_ReportGroup, _aws_cdk_aws_codebuild_SourceConfig, _aws_cdk_aws_codebuild_ISource, _aws_cdk_aws_codebuild_SourceProps, _aws_cdk_aws_codebuild_Source, _aws_cdk_aws_codebuild_EventAction, _aws_cdk_aws_codebuild_FilterGroup, _aws_cdk_aws_codebuild_CodeCommitSourceProps, _aws_cdk_aws_codebuild_S3SourceProps, _aws_cdk_aws_codebuild_GitHubSourceProps, _aws_cdk_aws_codebuild_GitHubEnterpriseSourceProps, _aws_cdk_aws_codebuild_BitBucketSourceProps, _aws_cdk_aws_codebuild_GitHubSourceCredentialsProps, _aws_cdk_aws_codebuild_GitHubSourceCredentials, _aws_cdk_aws_codebuild_GitHubEnterpriseSourceCredentialsProps, _aws_cdk_aws_codebuild_GitHubEnterpriseSourceCredentials, _aws_cdk_aws_codebuild_BitBucketSourceCredentialsProps, _aws_cdk_aws_codebuild_BitBucketSourceCredentials, _aws_cdk_aws_codebuild_ArtifactsConfig, _aws_cdk_aws_codebuild_IArtifacts, _aws_cdk_aws_codebuild_ArtifactsProps, _aws_cdk_aws_codebuild_Artifacts, _aws_cdk_aws_codebuild_S3ArtifactsProps, _aws_cdk_aws_codebuild_BucketCacheOptions, _aws_cdk_aws_codebuild_LocalCacheMode, _aws_cdk_aws_codebuild_Cache, _aws_cdk_aws_codebuild_BuildSpec, _aws_cdk_aws_codebuild_FileSystemConfig, _aws_cdk_aws_codebuild_IFileSystemLocation, _aws_cdk_aws_codebuild_FileSystemLocation, _aws_cdk_aws_codebuild_EfsFileSystemLocationProps, _aws_cdk_aws_codebuild_LinuxGpuBuildImage, _aws_cdk_aws_codebuild_UntrustedCodeBoundaryPolicyProps, _aws_cdk_aws_codebuild_UntrustedCodeBoundaryPolicy, _aws_cdk_aws_codebuild_LinuxArmBuildImage, _aws_cdk_aws_codebuild_CfnProjectProps, _aws_cdk_aws_codebuild_CfnProject, _aws_cdk_aws_codebuild_CfnProject_ArtifactsProperty, _aws_cdk_aws_codebuild_CfnProject_BatchRestrictionsProperty, _aws_cdk_aws_codebuild_CfnProject_BuildStatusConfigProperty, _aws_cdk_aws_codebuild_CfnProject_CloudWatchLogsConfigProperty, _aws_cdk_aws_codebuild_CfnProject_EnvironmentProperty, _aws_cdk_aws_codebuild_CfnProject_EnvironmentVariableProperty, _aws_cdk_aws_codebuild_CfnProject_GitSubmodulesConfigProperty, _aws_cdk_aws_codebuild_CfnProject_LogsConfigProperty, _aws_cdk_aws_codebuild_CfnProject_ProjectBuildBatchConfigProperty, _aws_cdk_aws_codebuild_CfnProject_ProjectCacheProperty, _aws_cdk_aws_codebuild_CfnProject_ProjectFileSystemLocationProperty, _aws_cdk_aws_codebuild_CfnProject_ProjectSourceVersionProperty, _aws_cdk_aws_codebuild_CfnProject_ProjectTriggersProperty, _aws_cdk_aws_codebuild_CfnProject_RegistryCredentialProperty, _aws_cdk_aws_codebuild_CfnProject_S3LogsConfigProperty, _aws_cdk_aws_codebuild_CfnProject_SourceProperty, _aws_cdk_aws_codebuild_CfnProject_SourceAuthProperty, _aws_cdk_aws_codebuild_CfnProject_VpcConfigProperty, _aws_cdk_aws_codebuild_CfnProject_WebhookFilterProperty, _aws_cdk_aws_codebuild_CfnReportGroupProps, _aws_cdk_aws_codebuild_CfnReportGroup, _aws_cdk_aws_codebuild_CfnReportGroup_ReportExportConfigProperty, _aws_cdk_aws_codebuild_CfnReportGroup_S3ReportExportConfigProperty, _aws_cdk_aws_codebuild_CfnSourceCredentialProps, _aws_cdk_aws_codebuild_CfnSourceCredential };
