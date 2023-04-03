function _aws_cdk_aws_lambda_AdotInstrumentationConfig(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.execWrapper))
            _aws_cdk_aws_lambda_AdotLambdaExecWrapper(p.execWrapper);
        if (!visitedObjects.has(p.layerVersion))
            _aws_cdk_aws_lambda_AdotLayerVersion(p.layerVersion);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_lambda_AdotLayerVersion(p) {
}
function _aws_cdk_aws_lambda_AdotLambdaExecWrapper(p) {
}
function _aws_cdk_aws_lambda_AdotLambdaLayerJavaSdkVersion(p) {
}
function _aws_cdk_aws_lambda_AdotLambdaLayerJavaAutoInstrumentationVersion(p) {
}
function _aws_cdk_aws_lambda_AdotLambdaLayerPythonSdkVersion(p) {
}
function _aws_cdk_aws_lambda_AdotLambdaLayerJavaScriptSdkVersion(p) {
}
function _aws_cdk_aws_lambda_AdotLambdaLayerGenericVersion(p) {
}
function _aws_cdk_aws_lambda_IAlias(p) {
}
function _aws_cdk_aws_lambda_AliasOptions(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (p.additionalVersions != null)
            for (const o of p.additionalVersions)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_lambda_VersionWeight(o);
        if (!visitedObjects.has(p.onFailure))
            _aws_cdk_aws_lambda_IDestination(p.onFailure);
        if (!visitedObjects.has(p.onSuccess))
            _aws_cdk_aws_lambda_IDestination(p.onSuccess);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_lambda_AliasProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.version))
            _aws_cdk_aws_lambda_IVersion(p.version);
        if (p.additionalVersions != null)
            for (const o of p.additionalVersions)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_lambda_VersionWeight(o);
        if (!visitedObjects.has(p.onFailure))
            _aws_cdk_aws_lambda_IDestination(p.onFailure);
        if (!visitedObjects.has(p.onSuccess))
            _aws_cdk_aws_lambda_IDestination(p.onSuccess);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_lambda_AliasAttributes(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.aliasVersion))
            _aws_cdk_aws_lambda_IVersion(p.aliasVersion);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_lambda_Alias(p) {
}
function _aws_cdk_aws_lambda_VersionWeight(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.version))
            _aws_cdk_aws_lambda_IVersion(p.version);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_lambda_DlqDestinationConfig(p) {
}
function _aws_cdk_aws_lambda_IEventSourceDlq(p) {
}
function _aws_cdk_aws_lambda_IFunction(p) {
}
function _aws_cdk_aws_lambda_FunctionAttributes(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.architecture))
            _aws_cdk_aws_lambda_Architecture(p.architecture);
        if ("securityGroupId" in p)
            print("@aws-cdk/aws-lambda.FunctionAttributes#securityGroupId", "use `securityGroup` instead");
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_lambda_FunctionBase(p) {
}
function _aws_cdk_aws_lambda_QualifiedFunctionBase(p) {
}
function _aws_cdk_aws_lambda_Tracing(p) {
}
function _aws_cdk_aws_lambda_FunctionOptions(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.adotInstrumentation))
            _aws_cdk_aws_lambda_AdotInstrumentationConfig(p.adotInstrumentation);
        if (!visitedObjects.has(p.architecture))
            _aws_cdk_aws_lambda_Architecture(p.architecture);
        if ("architectures" in p)
            print("@aws-cdk/aws-lambda.FunctionOptions#architectures", "use `architecture`");
        if (p.architectures != null)
            for (const o of p.architectures)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_lambda_Architecture(o);
        if (!visitedObjects.has(p.codeSigningConfig))
            _aws_cdk_aws_lambda_ICodeSigningConfig(p.codeSigningConfig);
        if (!visitedObjects.has(p.currentVersionOptions))
            _aws_cdk_aws_lambda_VersionOptions(p.currentVersionOptions);
        if (p.events != null)
            for (const o of p.events)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_lambda_IEventSource(o);
        if (!visitedObjects.has(p.filesystem))
            _aws_cdk_aws_lambda_FileSystem(p.filesystem);
        if (p.initialPolicy != null)
            for (const o of p.initialPolicy)
                if (!visitedObjects.has(o))
                    require("@aws-cdk/aws-iam/.warnings.jsii.js")._aws_cdk_aws_iam_PolicyStatement(o);
        if (!visitedObjects.has(p.insightsVersion))
            _aws_cdk_aws_lambda_LambdaInsightsVersion(p.insightsVersion);
        if (p.layers != null)
            for (const o of p.layers)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_lambda_ILayerVersion(o);
        if (!visitedObjects.has(p.logRetentionRetryOptions))
            _aws_cdk_aws_lambda_LogRetentionRetryOptions(p.logRetentionRetryOptions);
        if (!visitedObjects.has(p.runtimeManagementMode))
            _aws_cdk_aws_lambda_RuntimeManagementMode(p.runtimeManagementMode);
        if ("securityGroup" in p)
            print("@aws-cdk/aws-lambda.FunctionOptions#securityGroup", "- This property is deprecated, use securityGroups instead");
        if (p.securityGroups != null)
            for (const o of p.securityGroups)
                if (!visitedObjects.has(o))
                    require("@aws-cdk/aws-ec2/.warnings.jsii.js")._aws_cdk_aws_ec2_ISecurityGroup(o);
        if (!visitedObjects.has(p.tracing))
            _aws_cdk_aws_lambda_Tracing(p.tracing);
        if (!visitedObjects.has(p.onFailure))
            _aws_cdk_aws_lambda_IDestination(p.onFailure);
        if (!visitedObjects.has(p.onSuccess))
            _aws_cdk_aws_lambda_IDestination(p.onSuccess);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_lambda_FunctionProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.code))
            _aws_cdk_aws_lambda_Code(p.code);
        if (!visitedObjects.has(p.runtime))
            _aws_cdk_aws_lambda_Runtime(p.runtime);
        if (!visitedObjects.has(p.adotInstrumentation))
            _aws_cdk_aws_lambda_AdotInstrumentationConfig(p.adotInstrumentation);
        if (!visitedObjects.has(p.architecture))
            _aws_cdk_aws_lambda_Architecture(p.architecture);
        if ("architectures" in p)
            print("@aws-cdk/aws-lambda.FunctionOptions#architectures", "use `architecture`");
        if (p.architectures != null)
            for (const o of p.architectures)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_lambda_Architecture(o);
        if (!visitedObjects.has(p.codeSigningConfig))
            _aws_cdk_aws_lambda_ICodeSigningConfig(p.codeSigningConfig);
        if (!visitedObjects.has(p.currentVersionOptions))
            _aws_cdk_aws_lambda_VersionOptions(p.currentVersionOptions);
        if (p.events != null)
            for (const o of p.events)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_lambda_IEventSource(o);
        if (!visitedObjects.has(p.filesystem))
            _aws_cdk_aws_lambda_FileSystem(p.filesystem);
        if (p.initialPolicy != null)
            for (const o of p.initialPolicy)
                if (!visitedObjects.has(o))
                    require("@aws-cdk/aws-iam/.warnings.jsii.js")._aws_cdk_aws_iam_PolicyStatement(o);
        if (!visitedObjects.has(p.insightsVersion))
            _aws_cdk_aws_lambda_LambdaInsightsVersion(p.insightsVersion);
        if (p.layers != null)
            for (const o of p.layers)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_lambda_ILayerVersion(o);
        if (!visitedObjects.has(p.logRetentionRetryOptions))
            _aws_cdk_aws_lambda_LogRetentionRetryOptions(p.logRetentionRetryOptions);
        if (!visitedObjects.has(p.runtimeManagementMode))
            _aws_cdk_aws_lambda_RuntimeManagementMode(p.runtimeManagementMode);
        if ("securityGroup" in p)
            print("@aws-cdk/aws-lambda.FunctionOptions#securityGroup", "- This property is deprecated, use securityGroups instead");
        if (p.securityGroups != null)
            for (const o of p.securityGroups)
                if (!visitedObjects.has(o))
                    require("@aws-cdk/aws-ec2/.warnings.jsii.js")._aws_cdk_aws_ec2_ISecurityGroup(o);
        if (!visitedObjects.has(p.tracing))
            _aws_cdk_aws_lambda_Tracing(p.tracing);
        if (!visitedObjects.has(p.onFailure))
            _aws_cdk_aws_lambda_IDestination(p.onFailure);
        if (!visitedObjects.has(p.onSuccess))
            _aws_cdk_aws_lambda_IDestination(p.onSuccess);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_lambda_Function(p) {
}
function _aws_cdk_aws_lambda_EnvironmentOptions(p) {
}
function _aws_cdk_aws_lambda_FunctionVersionUpgrade(p) {
}
function _aws_cdk_aws_lambda_Handler(p) {
}
function _aws_cdk_aws_lambda_DockerImageFunctionProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.code))
            _aws_cdk_aws_lambda_DockerImageCode(p.code);
        if (!visitedObjects.has(p.adotInstrumentation))
            _aws_cdk_aws_lambda_AdotInstrumentationConfig(p.adotInstrumentation);
        if (!visitedObjects.has(p.architecture))
            _aws_cdk_aws_lambda_Architecture(p.architecture);
        if ("architectures" in p)
            print("@aws-cdk/aws-lambda.FunctionOptions#architectures", "use `architecture`");
        if (p.architectures != null)
            for (const o of p.architectures)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_lambda_Architecture(o);
        if (!visitedObjects.has(p.codeSigningConfig))
            _aws_cdk_aws_lambda_ICodeSigningConfig(p.codeSigningConfig);
        if (!visitedObjects.has(p.currentVersionOptions))
            _aws_cdk_aws_lambda_VersionOptions(p.currentVersionOptions);
        if (p.events != null)
            for (const o of p.events)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_lambda_IEventSource(o);
        if (!visitedObjects.has(p.filesystem))
            _aws_cdk_aws_lambda_FileSystem(p.filesystem);
        if (p.initialPolicy != null)
            for (const o of p.initialPolicy)
                if (!visitedObjects.has(o))
                    require("@aws-cdk/aws-iam/.warnings.jsii.js")._aws_cdk_aws_iam_PolicyStatement(o);
        if (!visitedObjects.has(p.insightsVersion))
            _aws_cdk_aws_lambda_LambdaInsightsVersion(p.insightsVersion);
        if (p.layers != null)
            for (const o of p.layers)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_lambda_ILayerVersion(o);
        if (!visitedObjects.has(p.logRetentionRetryOptions))
            _aws_cdk_aws_lambda_LogRetentionRetryOptions(p.logRetentionRetryOptions);
        if (!visitedObjects.has(p.runtimeManagementMode))
            _aws_cdk_aws_lambda_RuntimeManagementMode(p.runtimeManagementMode);
        if ("securityGroup" in p)
            print("@aws-cdk/aws-lambda.FunctionOptions#securityGroup", "- This property is deprecated, use securityGroups instead");
        if (p.securityGroups != null)
            for (const o of p.securityGroups)
                if (!visitedObjects.has(o))
                    require("@aws-cdk/aws-ec2/.warnings.jsii.js")._aws_cdk_aws_ec2_ISecurityGroup(o);
        if (!visitedObjects.has(p.tracing))
            _aws_cdk_aws_lambda_Tracing(p.tracing);
        if (!visitedObjects.has(p.onFailure))
            _aws_cdk_aws_lambda_IDestination(p.onFailure);
        if (!visitedObjects.has(p.onSuccess))
            _aws_cdk_aws_lambda_IDestination(p.onSuccess);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_lambda_DockerImageCode(p) {
}
function _aws_cdk_aws_lambda_DockerImageFunction(p) {
}
function _aws_cdk_aws_lambda_LayerVersionOptions(p) {
}
function _aws_cdk_aws_lambda_LayerVersionProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.code))
            _aws_cdk_aws_lambda_Code(p.code);
        if (p.compatibleArchitectures != null)
            for (const o of p.compatibleArchitectures)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_lambda_Architecture(o);
        if (p.compatibleRuntimes != null)
            for (const o of p.compatibleRuntimes)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_lambda_Runtime(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_lambda_ILayerVersion(p) {
}
function _aws_cdk_aws_lambda_LayerVersionPermission(p) {
}
function _aws_cdk_aws_lambda_LayerVersionAttributes(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (p.compatibleRuntimes != null)
            for (const o of p.compatibleRuntimes)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_lambda_Runtime(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_lambda_LayerVersion(p) {
}
function _aws_cdk_aws_lambda_Permission(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.functionUrlAuthType))
            _aws_cdk_aws_lambda_FunctionUrlAuthType(p.functionUrlAuthType);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_lambda_LambdaRuntimeProps(p) {
}
function _aws_cdk_aws_lambda_RuntimeFamily(p) {
}
function _aws_cdk_aws_lambda_Runtime(p) {
}
function _aws_cdk_aws_lambda_Code(p) {
}
function _aws_cdk_aws_lambda_CodeConfig(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.image))
            _aws_cdk_aws_lambda_CodeImageConfig(p.image);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_lambda_CodeImageConfig(p) {
}
function _aws_cdk_aws_lambda_S3Code(p) {
}
function _aws_cdk_aws_lambda_InlineCode(p) {
}
function _aws_cdk_aws_lambda_AssetCode(p) {
}
function _aws_cdk_aws_lambda_ResourceBindOptions(p) {
}
function _aws_cdk_aws_lambda_CfnParametersCodeProps(p) {
}
function _aws_cdk_aws_lambda_CfnParametersCode(p) {
}
function _aws_cdk_aws_lambda_EcrImageCodeProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if ("tag" in p)
            print("@aws-cdk/aws-lambda.EcrImageCodeProps#tag", "use `tagOrDigest`");
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_lambda_EcrImageCode(p) {
}
function _aws_cdk_aws_lambda_AssetImageCodeProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (p.cacheFrom != null)
            for (const o of p.cacheFrom)
                if (!visitedObjects.has(o))
                    require("@aws-cdk/aws-ecr-assets/.warnings.jsii.js")._aws_cdk_aws_ecr_assets_DockerCacheOption(o);
        if ("repositoryName" in p)
            print("@aws-cdk/aws-ecr-assets.DockerImageAssetOptions#repositoryName", "to control the location of docker image assets, please override\n`Stack.addDockerImageAsset`. this feature will be removed in future\nreleases.");
        if ("follow" in p)
            print("@aws-cdk/assets.CopyOptions#follow", "use `followSymlinks` instead");
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_lambda_AssetImageCode(p) {
}
function _aws_cdk_aws_lambda_DockerBuildAssetOptions(p) {
}
function _aws_cdk_aws_lambda_FileSystemConfig(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (p.policies != null)
            for (const o of p.policies)
                if (!visitedObjects.has(o))
                    require("@aws-cdk/aws-iam/.warnings.jsii.js")._aws_cdk_aws_iam_PolicyStatement(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_lambda_FileSystem(p) {
}
function _aws_cdk_aws_lambda_IVersion(p) {
}
function _aws_cdk_aws_lambda_VersionOptions(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.onFailure))
            _aws_cdk_aws_lambda_IDestination(p.onFailure);
        if (!visitedObjects.has(p.onSuccess))
            _aws_cdk_aws_lambda_IDestination(p.onSuccess);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_lambda_VersionProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.lambda))
            _aws_cdk_aws_lambda_IFunction(p.lambda);
        if (!visitedObjects.has(p.onFailure))
            _aws_cdk_aws_lambda_IDestination(p.onFailure);
        if (!visitedObjects.has(p.onSuccess))
            _aws_cdk_aws_lambda_IDestination(p.onSuccess);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_lambda_VersionAttributes(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.lambda))
            _aws_cdk_aws_lambda_IFunction(p.lambda);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_lambda_Version(p) {
}
function _aws_cdk_aws_lambda_SingletonFunctionProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.code))
            _aws_cdk_aws_lambda_Code(p.code);
        if (!visitedObjects.has(p.runtime))
            _aws_cdk_aws_lambda_Runtime(p.runtime);
        if (!visitedObjects.has(p.adotInstrumentation))
            _aws_cdk_aws_lambda_AdotInstrumentationConfig(p.adotInstrumentation);
        if (!visitedObjects.has(p.architecture))
            _aws_cdk_aws_lambda_Architecture(p.architecture);
        if ("architectures" in p)
            print("@aws-cdk/aws-lambda.FunctionOptions#architectures", "use `architecture`");
        if (p.architectures != null)
            for (const o of p.architectures)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_lambda_Architecture(o);
        if (!visitedObjects.has(p.codeSigningConfig))
            _aws_cdk_aws_lambda_ICodeSigningConfig(p.codeSigningConfig);
        if (!visitedObjects.has(p.currentVersionOptions))
            _aws_cdk_aws_lambda_VersionOptions(p.currentVersionOptions);
        if (p.events != null)
            for (const o of p.events)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_lambda_IEventSource(o);
        if (!visitedObjects.has(p.filesystem))
            _aws_cdk_aws_lambda_FileSystem(p.filesystem);
        if (p.initialPolicy != null)
            for (const o of p.initialPolicy)
                if (!visitedObjects.has(o))
                    require("@aws-cdk/aws-iam/.warnings.jsii.js")._aws_cdk_aws_iam_PolicyStatement(o);
        if (!visitedObjects.has(p.insightsVersion))
            _aws_cdk_aws_lambda_LambdaInsightsVersion(p.insightsVersion);
        if (p.layers != null)
            for (const o of p.layers)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_lambda_ILayerVersion(o);
        if (!visitedObjects.has(p.logRetentionRetryOptions))
            _aws_cdk_aws_lambda_LogRetentionRetryOptions(p.logRetentionRetryOptions);
        if (!visitedObjects.has(p.runtimeManagementMode))
            _aws_cdk_aws_lambda_RuntimeManagementMode(p.runtimeManagementMode);
        if ("securityGroup" in p)
            print("@aws-cdk/aws-lambda.FunctionOptions#securityGroup", "- This property is deprecated, use securityGroups instead");
        if (p.securityGroups != null)
            for (const o of p.securityGroups)
                if (!visitedObjects.has(o))
                    require("@aws-cdk/aws-ec2/.warnings.jsii.js")._aws_cdk_aws_ec2_ISecurityGroup(o);
        if (!visitedObjects.has(p.tracing))
            _aws_cdk_aws_lambda_Tracing(p.tracing);
        if (!visitedObjects.has(p.onFailure))
            _aws_cdk_aws_lambda_IDestination(p.onFailure);
        if (!visitedObjects.has(p.onSuccess))
            _aws_cdk_aws_lambda_IDestination(p.onSuccess);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_lambda_SingletonFunction(p) {
}
function _aws_cdk_aws_lambda_IEventSource(p) {
}
function _aws_cdk_aws_lambda_SourceAccessConfigurationType(p) {
}
function _aws_cdk_aws_lambda_SourceAccessConfiguration(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.type))
            _aws_cdk_aws_lambda_SourceAccessConfigurationType(p.type);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_lambda_EventSourceMappingOptions(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.onFailure))
            _aws_cdk_aws_lambda_IEventSourceDlq(p.onFailure);
        if (p.sourceAccessConfigurations != null)
            for (const o of p.sourceAccessConfigurations)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_lambda_SourceAccessConfiguration(o);
        if (!visitedObjects.has(p.startingPosition))
            _aws_cdk_aws_lambda_StartingPosition(p.startingPosition);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_lambda_EventSourceMappingProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.target))
            _aws_cdk_aws_lambda_IFunction(p.target);
        if (!visitedObjects.has(p.onFailure))
            _aws_cdk_aws_lambda_IEventSourceDlq(p.onFailure);
        if (p.sourceAccessConfigurations != null)
            for (const o of p.sourceAccessConfigurations)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_lambda_SourceAccessConfiguration(o);
        if (!visitedObjects.has(p.startingPosition))
            _aws_cdk_aws_lambda_StartingPosition(p.startingPosition);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_lambda_IEventSourceMapping(p) {
}
function _aws_cdk_aws_lambda_EventSourceMapping(p) {
}
function _aws_cdk_aws_lambda_StartingPosition(p) {
}
function _aws_cdk_aws_lambda_FilterRule(p) {
}
function _aws_cdk_aws_lambda_FilterCriteria(p) {
}
function _aws_cdk_aws_lambda_DestinationConfig(p) {
}
function _aws_cdk_aws_lambda_DestinationType(p) {
}
function _aws_cdk_aws_lambda_DestinationOptions(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.type))
            _aws_cdk_aws_lambda_DestinationType(p.type);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_lambda_IDestination(p) {
}
function _aws_cdk_aws_lambda_EventInvokeConfigOptions(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.onFailure))
            _aws_cdk_aws_lambda_IDestination(p.onFailure);
        if (!visitedObjects.has(p.onSuccess))
            _aws_cdk_aws_lambda_IDestination(p.onSuccess);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_lambda_EventInvokeConfigProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.function))
            _aws_cdk_aws_lambda_IFunction(p.function);
        if (!visitedObjects.has(p.onFailure))
            _aws_cdk_aws_lambda_IDestination(p.onFailure);
        if (!visitedObjects.has(p.onSuccess))
            _aws_cdk_aws_lambda_IDestination(p.onSuccess);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_lambda_EventInvokeConfig(p) {
}
function _aws_cdk_aws_lambda_IScalableFunctionAttribute(p) {
}
function _aws_cdk_aws_lambda_UtilizationScalingOptions(p) {
}
function _aws_cdk_aws_lambda_AutoScalingOptions(p) {
}
function _aws_cdk_aws_lambda_UntrustedArtifactOnDeployment(p) {
}
function _aws_cdk_aws_lambda_ICodeSigningConfig(p) {
}
function _aws_cdk_aws_lambda_CodeSigningConfigProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (p.signingProfiles != null)
            for (const o of p.signingProfiles)
                if (!visitedObjects.has(o))
                    require("@aws-cdk/aws-signer/.warnings.jsii.js")._aws_cdk_aws_signer_ISigningProfile(o);
        if (!visitedObjects.has(p.untrustedArtifactOnDeployment))
            _aws_cdk_aws_lambda_UntrustedArtifactOnDeployment(p.untrustedArtifactOnDeployment);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_lambda_CodeSigningConfig(p) {
}
function _aws_cdk_aws_lambda_LambdaInsightsVersion(p) {
}
function _aws_cdk_aws_lambda_LogRetentionRetryOptions(p) {
}
function _aws_cdk_aws_lambda_LogRetentionProps(p) {
}
function _aws_cdk_aws_lambda_LogRetention(p) {
}
function _aws_cdk_aws_lambda_Architecture(p) {
}
function _aws_cdk_aws_lambda_FunctionUrlAuthType(p) {
}
function _aws_cdk_aws_lambda_HttpMethod(p) {
}
function _aws_cdk_aws_lambda_FunctionUrlCorsOptions(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (p.allowedMethods != null)
            for (const o of p.allowedMethods)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_lambda_HttpMethod(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_lambda_IFunctionUrl(p) {
}
function _aws_cdk_aws_lambda_FunctionUrlOptions(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.authType))
            _aws_cdk_aws_lambda_FunctionUrlAuthType(p.authType);
        if (!visitedObjects.has(p.cors))
            _aws_cdk_aws_lambda_FunctionUrlCorsOptions(p.cors);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_lambda_FunctionUrlProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.function))
            _aws_cdk_aws_lambda_IFunction(p.function);
        if (!visitedObjects.has(p.authType))
            _aws_cdk_aws_lambda_FunctionUrlAuthType(p.authType);
        if (!visitedObjects.has(p.cors))
            _aws_cdk_aws_lambda_FunctionUrlCorsOptions(p.cors);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_lambda_FunctionUrl(p) {
}
function _aws_cdk_aws_lambda_RuntimeManagementMode(p) {
}
function _aws_cdk_aws_lambda_CfnAliasProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.provisionedConcurrencyConfig))
            _aws_cdk_aws_lambda_CfnAlias_ProvisionedConcurrencyConfigurationProperty(p.provisionedConcurrencyConfig);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_lambda_CfnAlias(p) {
}
function _aws_cdk_aws_lambda_CfnAlias_AliasRoutingConfigurationProperty(p) {
}
function _aws_cdk_aws_lambda_CfnAlias_ProvisionedConcurrencyConfigurationProperty(p) {
}
function _aws_cdk_aws_lambda_CfnAlias_VersionWeightProperty(p) {
}
function _aws_cdk_aws_lambda_CfnCodeSigningConfigProps(p) {
}
function _aws_cdk_aws_lambda_CfnCodeSigningConfig(p) {
}
function _aws_cdk_aws_lambda_CfnCodeSigningConfig_AllowedPublishersProperty(p) {
}
function _aws_cdk_aws_lambda_CfnCodeSigningConfig_CodeSigningPoliciesProperty(p) {
}
function _aws_cdk_aws_lambda_CfnEventInvokeConfigProps(p) {
}
function _aws_cdk_aws_lambda_CfnEventInvokeConfig(p) {
}
function _aws_cdk_aws_lambda_CfnEventInvokeConfig_DestinationConfigProperty(p) {
}
function _aws_cdk_aws_lambda_CfnEventInvokeConfig_OnFailureProperty(p) {
}
function _aws_cdk_aws_lambda_CfnEventInvokeConfig_OnSuccessProperty(p) {
}
function _aws_cdk_aws_lambda_CfnEventSourceMappingProps(p) {
}
function _aws_cdk_aws_lambda_CfnEventSourceMapping(p) {
}
function _aws_cdk_aws_lambda_CfnEventSourceMapping_AmazonManagedKafkaEventSourceConfigProperty(p) {
}
function _aws_cdk_aws_lambda_CfnEventSourceMapping_DestinationConfigProperty(p) {
}
function _aws_cdk_aws_lambda_CfnEventSourceMapping_EndpointsProperty(p) {
}
function _aws_cdk_aws_lambda_CfnEventSourceMapping_FilterProperty(p) {
}
function _aws_cdk_aws_lambda_CfnEventSourceMapping_FilterCriteriaProperty(p) {
}
function _aws_cdk_aws_lambda_CfnEventSourceMapping_OnFailureProperty(p) {
}
function _aws_cdk_aws_lambda_CfnEventSourceMapping_ScalingConfigProperty(p) {
}
function _aws_cdk_aws_lambda_CfnEventSourceMapping_SelfManagedEventSourceProperty(p) {
}
function _aws_cdk_aws_lambda_CfnEventSourceMapping_SelfManagedKafkaEventSourceConfigProperty(p) {
}
function _aws_cdk_aws_lambda_CfnEventSourceMapping_SourceAccessConfigurationProperty(p) {
}
function _aws_cdk_aws_lambda_CfnFunctionProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.runtimeManagementConfig))
            _aws_cdk_aws_lambda_CfnFunction_RuntimeManagementConfigProperty(p.runtimeManagementConfig);
        if (p.tags != null)
            for (const o of p.tags)
                if (!visitedObjects.has(o))
                    require("@aws-cdk/core/.warnings.jsii.js")._aws_cdk_core_CfnTag(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_lambda_CfnFunction(p) {
}
function _aws_cdk_aws_lambda_CfnFunction_CodeProperty(p) {
}
function _aws_cdk_aws_lambda_CfnFunction_DeadLetterConfigProperty(p) {
}
function _aws_cdk_aws_lambda_CfnFunction_EnvironmentProperty(p) {
}
function _aws_cdk_aws_lambda_CfnFunction_EphemeralStorageProperty(p) {
}
function _aws_cdk_aws_lambda_CfnFunction_FileSystemConfigProperty(p) {
}
function _aws_cdk_aws_lambda_CfnFunction_ImageConfigProperty(p) {
}
function _aws_cdk_aws_lambda_CfnFunction_RuntimeManagementConfigProperty(p) {
}
function _aws_cdk_aws_lambda_CfnFunction_SnapStartProperty(p) {
}
function _aws_cdk_aws_lambda_CfnFunction_SnapStartResponseProperty(p) {
}
function _aws_cdk_aws_lambda_CfnFunction_TracingConfigProperty(p) {
}
function _aws_cdk_aws_lambda_CfnFunction_VpcConfigProperty(p) {
}
function _aws_cdk_aws_lambda_CfnLayerVersionProps(p) {
}
function _aws_cdk_aws_lambda_CfnLayerVersion(p) {
}
function _aws_cdk_aws_lambda_CfnLayerVersion_ContentProperty(p) {
}
function _aws_cdk_aws_lambda_CfnLayerVersionPermissionProps(p) {
}
function _aws_cdk_aws_lambda_CfnLayerVersionPermission(p) {
}
function _aws_cdk_aws_lambda_CfnPermissionProps(p) {
}
function _aws_cdk_aws_lambda_CfnPermission(p) {
}
function _aws_cdk_aws_lambda_CfnUrlProps(p) {
}
function _aws_cdk_aws_lambda_CfnUrl(p) {
}
function _aws_cdk_aws_lambda_CfnUrl_CorsProperty(p) {
}
function _aws_cdk_aws_lambda_CfnVersionProps(p) {
}
function _aws_cdk_aws_lambda_CfnVersion(p) {
}
function _aws_cdk_aws_lambda_CfnVersion_ProvisionedConcurrencyConfigurationProperty(p) {
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
module.exports = { print, getPropertyDescriptor, DeprecationError, _aws_cdk_aws_lambda_AdotInstrumentationConfig, _aws_cdk_aws_lambda_AdotLayerVersion, _aws_cdk_aws_lambda_AdotLambdaExecWrapper, _aws_cdk_aws_lambda_AdotLambdaLayerJavaSdkVersion, _aws_cdk_aws_lambda_AdotLambdaLayerJavaAutoInstrumentationVersion, _aws_cdk_aws_lambda_AdotLambdaLayerPythonSdkVersion, _aws_cdk_aws_lambda_AdotLambdaLayerJavaScriptSdkVersion, _aws_cdk_aws_lambda_AdotLambdaLayerGenericVersion, _aws_cdk_aws_lambda_IAlias, _aws_cdk_aws_lambda_AliasOptions, _aws_cdk_aws_lambda_AliasProps, _aws_cdk_aws_lambda_AliasAttributes, _aws_cdk_aws_lambda_Alias, _aws_cdk_aws_lambda_VersionWeight, _aws_cdk_aws_lambda_DlqDestinationConfig, _aws_cdk_aws_lambda_IEventSourceDlq, _aws_cdk_aws_lambda_IFunction, _aws_cdk_aws_lambda_FunctionAttributes, _aws_cdk_aws_lambda_FunctionBase, _aws_cdk_aws_lambda_QualifiedFunctionBase, _aws_cdk_aws_lambda_Tracing, _aws_cdk_aws_lambda_FunctionOptions, _aws_cdk_aws_lambda_FunctionProps, _aws_cdk_aws_lambda_Function, _aws_cdk_aws_lambda_EnvironmentOptions, _aws_cdk_aws_lambda_FunctionVersionUpgrade, _aws_cdk_aws_lambda_Handler, _aws_cdk_aws_lambda_DockerImageFunctionProps, _aws_cdk_aws_lambda_DockerImageCode, _aws_cdk_aws_lambda_DockerImageFunction, _aws_cdk_aws_lambda_LayerVersionOptions, _aws_cdk_aws_lambda_LayerVersionProps, _aws_cdk_aws_lambda_ILayerVersion, _aws_cdk_aws_lambda_LayerVersionPermission, _aws_cdk_aws_lambda_LayerVersionAttributes, _aws_cdk_aws_lambda_LayerVersion, _aws_cdk_aws_lambda_Permission, _aws_cdk_aws_lambda_LambdaRuntimeProps, _aws_cdk_aws_lambda_RuntimeFamily, _aws_cdk_aws_lambda_Runtime, _aws_cdk_aws_lambda_Code, _aws_cdk_aws_lambda_CodeConfig, _aws_cdk_aws_lambda_CodeImageConfig, _aws_cdk_aws_lambda_S3Code, _aws_cdk_aws_lambda_InlineCode, _aws_cdk_aws_lambda_AssetCode, _aws_cdk_aws_lambda_ResourceBindOptions, _aws_cdk_aws_lambda_CfnParametersCodeProps, _aws_cdk_aws_lambda_CfnParametersCode, _aws_cdk_aws_lambda_EcrImageCodeProps, _aws_cdk_aws_lambda_EcrImageCode, _aws_cdk_aws_lambda_AssetImageCodeProps, _aws_cdk_aws_lambda_AssetImageCode, _aws_cdk_aws_lambda_DockerBuildAssetOptions, _aws_cdk_aws_lambda_FileSystemConfig, _aws_cdk_aws_lambda_FileSystem, _aws_cdk_aws_lambda_IVersion, _aws_cdk_aws_lambda_VersionOptions, _aws_cdk_aws_lambda_VersionProps, _aws_cdk_aws_lambda_VersionAttributes, _aws_cdk_aws_lambda_Version, _aws_cdk_aws_lambda_SingletonFunctionProps, _aws_cdk_aws_lambda_SingletonFunction, _aws_cdk_aws_lambda_IEventSource, _aws_cdk_aws_lambda_SourceAccessConfigurationType, _aws_cdk_aws_lambda_SourceAccessConfiguration, _aws_cdk_aws_lambda_EventSourceMappingOptions, _aws_cdk_aws_lambda_EventSourceMappingProps, _aws_cdk_aws_lambda_IEventSourceMapping, _aws_cdk_aws_lambda_EventSourceMapping, _aws_cdk_aws_lambda_StartingPosition, _aws_cdk_aws_lambda_FilterRule, _aws_cdk_aws_lambda_FilterCriteria, _aws_cdk_aws_lambda_DestinationConfig, _aws_cdk_aws_lambda_DestinationType, _aws_cdk_aws_lambda_DestinationOptions, _aws_cdk_aws_lambda_IDestination, _aws_cdk_aws_lambda_EventInvokeConfigOptions, _aws_cdk_aws_lambda_EventInvokeConfigProps, _aws_cdk_aws_lambda_EventInvokeConfig, _aws_cdk_aws_lambda_IScalableFunctionAttribute, _aws_cdk_aws_lambda_UtilizationScalingOptions, _aws_cdk_aws_lambda_AutoScalingOptions, _aws_cdk_aws_lambda_UntrustedArtifactOnDeployment, _aws_cdk_aws_lambda_ICodeSigningConfig, _aws_cdk_aws_lambda_CodeSigningConfigProps, _aws_cdk_aws_lambda_CodeSigningConfig, _aws_cdk_aws_lambda_LambdaInsightsVersion, _aws_cdk_aws_lambda_LogRetentionRetryOptions, _aws_cdk_aws_lambda_LogRetentionProps, _aws_cdk_aws_lambda_LogRetention, _aws_cdk_aws_lambda_Architecture, _aws_cdk_aws_lambda_FunctionUrlAuthType, _aws_cdk_aws_lambda_HttpMethod, _aws_cdk_aws_lambda_FunctionUrlCorsOptions, _aws_cdk_aws_lambda_IFunctionUrl, _aws_cdk_aws_lambda_FunctionUrlOptions, _aws_cdk_aws_lambda_FunctionUrlProps, _aws_cdk_aws_lambda_FunctionUrl, _aws_cdk_aws_lambda_RuntimeManagementMode, _aws_cdk_aws_lambda_CfnAliasProps, _aws_cdk_aws_lambda_CfnAlias, _aws_cdk_aws_lambda_CfnAlias_AliasRoutingConfigurationProperty, _aws_cdk_aws_lambda_CfnAlias_ProvisionedConcurrencyConfigurationProperty, _aws_cdk_aws_lambda_CfnAlias_VersionWeightProperty, _aws_cdk_aws_lambda_CfnCodeSigningConfigProps, _aws_cdk_aws_lambda_CfnCodeSigningConfig, _aws_cdk_aws_lambda_CfnCodeSigningConfig_AllowedPublishersProperty, _aws_cdk_aws_lambda_CfnCodeSigningConfig_CodeSigningPoliciesProperty, _aws_cdk_aws_lambda_CfnEventInvokeConfigProps, _aws_cdk_aws_lambda_CfnEventInvokeConfig, _aws_cdk_aws_lambda_CfnEventInvokeConfig_DestinationConfigProperty, _aws_cdk_aws_lambda_CfnEventInvokeConfig_OnFailureProperty, _aws_cdk_aws_lambda_CfnEventInvokeConfig_OnSuccessProperty, _aws_cdk_aws_lambda_CfnEventSourceMappingProps, _aws_cdk_aws_lambda_CfnEventSourceMapping, _aws_cdk_aws_lambda_CfnEventSourceMapping_AmazonManagedKafkaEventSourceConfigProperty, _aws_cdk_aws_lambda_CfnEventSourceMapping_DestinationConfigProperty, _aws_cdk_aws_lambda_CfnEventSourceMapping_EndpointsProperty, _aws_cdk_aws_lambda_CfnEventSourceMapping_FilterProperty, _aws_cdk_aws_lambda_CfnEventSourceMapping_FilterCriteriaProperty, _aws_cdk_aws_lambda_CfnEventSourceMapping_OnFailureProperty, _aws_cdk_aws_lambda_CfnEventSourceMapping_ScalingConfigProperty, _aws_cdk_aws_lambda_CfnEventSourceMapping_SelfManagedEventSourceProperty, _aws_cdk_aws_lambda_CfnEventSourceMapping_SelfManagedKafkaEventSourceConfigProperty, _aws_cdk_aws_lambda_CfnEventSourceMapping_SourceAccessConfigurationProperty, _aws_cdk_aws_lambda_CfnFunctionProps, _aws_cdk_aws_lambda_CfnFunction, _aws_cdk_aws_lambda_CfnFunction_CodeProperty, _aws_cdk_aws_lambda_CfnFunction_DeadLetterConfigProperty, _aws_cdk_aws_lambda_CfnFunction_EnvironmentProperty, _aws_cdk_aws_lambda_CfnFunction_EphemeralStorageProperty, _aws_cdk_aws_lambda_CfnFunction_FileSystemConfigProperty, _aws_cdk_aws_lambda_CfnFunction_ImageConfigProperty, _aws_cdk_aws_lambda_CfnFunction_RuntimeManagementConfigProperty, _aws_cdk_aws_lambda_CfnFunction_SnapStartProperty, _aws_cdk_aws_lambda_CfnFunction_SnapStartResponseProperty, _aws_cdk_aws_lambda_CfnFunction_TracingConfigProperty, _aws_cdk_aws_lambda_CfnFunction_VpcConfigProperty, _aws_cdk_aws_lambda_CfnLayerVersionProps, _aws_cdk_aws_lambda_CfnLayerVersion, _aws_cdk_aws_lambda_CfnLayerVersion_ContentProperty, _aws_cdk_aws_lambda_CfnLayerVersionPermissionProps, _aws_cdk_aws_lambda_CfnLayerVersionPermission, _aws_cdk_aws_lambda_CfnPermissionProps, _aws_cdk_aws_lambda_CfnPermission, _aws_cdk_aws_lambda_CfnUrlProps, _aws_cdk_aws_lambda_CfnUrl, _aws_cdk_aws_lambda_CfnUrl_CorsProperty, _aws_cdk_aws_lambda_CfnVersionProps, _aws_cdk_aws_lambda_CfnVersion, _aws_cdk_aws_lambda_CfnVersion_ProvisionedConcurrencyConfigurationProperty };
