function _aws_cdk_core_IAspect(p) {
}
function _aws_cdk_core_Aspects(p) {
}
function _aws_cdk_core_TagProps(p) {
}
function _aws_cdk_core_Tag(p) {
}
function _aws_cdk_core_Tags(p) {
}
function _aws_cdk_core_RemoveTag(p) {
}
function _aws_cdk_core_TokenComparison(p) {
}
function _aws_cdk_core_Token(p) {
}
function _aws_cdk_core_Tokenization(p) {
}
function _aws_cdk_core_JsonNull(p) {
}
function _aws_cdk_core_ReverseOptions(p) {
}
function _aws_cdk_core_ResolveOptions(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.resolver))
            _aws_cdk_core_ITokenResolver(p.resolver);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_core_EncodingOptions(p) {
}
function _aws_cdk_core_IResolveContext(p) {
}
function _aws_cdk_core_ResolveChangeContextOptions(p) {
}
function _aws_cdk_core_IResolvable(p) {
}
function _aws_cdk_core_IPostProcessor(p) {
}
function _aws_cdk_core_ITokenResolver(p) {
}
function _aws_cdk_core_IFragmentConcatenator(p) {
}
function _aws_cdk_core_StringConcat(p) {
}
function _aws_cdk_core_DefaultTokenResolver(p) {
}
function _aws_cdk_core_ResolutionTypeHint(p) {
}
function _aws_cdk_core_IStringProducer(p) {
}
function _aws_cdk_core_IStableStringProducer(p) {
}
function _aws_cdk_core_IListProducer(p) {
}
function _aws_cdk_core_IStableListProducer(p) {
}
function _aws_cdk_core_INumberProducer(p) {
}
function _aws_cdk_core_IStableNumberProducer(p) {
}
function _aws_cdk_core_IAnyProducer(p) {
}
function _aws_cdk_core_IStableAnyProducer(p) {
}
function _aws_cdk_core_LazyStringValueOptions(p) {
}
function _aws_cdk_core_LazyListValueOptions(p) {
}
function _aws_cdk_core_LazyAnyValueOptions(p) {
}
function _aws_cdk_core_Lazy(p) {
}
function _aws_cdk_core_ITaggable(p) {
}
function _aws_cdk_core_TagManagerOptions(p) {
}
function _aws_cdk_core_TagManager(p) {
}
function _aws_cdk_core_TokenizedStringFragments(p) {
}
function _aws_cdk_core_ITokenMapper(p) {
}
function _aws_cdk_core_IStackSynthesizer(p) {
}
function _aws_cdk_core_IReusableStackSynthesizer(p) {
}
function _aws_cdk_core_IBoundStackSynthesizer(p) {
}
function _aws_cdk_core_ISynthesisSession(p) {
}
function _aws_cdk_core_DefaultStackSynthesizerProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if ("fileAssetKeyArnExportName" in p)
            print("@aws-cdk/core.DefaultStackSynthesizerProps#fileAssetKeyArnExportName", "This property is not used anymore");
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_core_DefaultStackSynthesizer(p) {
}
function _aws_cdk_core_LegacyStackSynthesizer(p) {
}
function _aws_cdk_core_BootstraplessSynthesizerProps(p) {
}
function _aws_cdk_core_BootstraplessSynthesizer(p) {
}
function _aws_cdk_core_NestedStackSynthesizer(p) {
}
function _aws_cdk_core_StackSynthesizer(p) {
}
function _aws_cdk_core_SynthesizeStackArtifactOptions(p) {
}
function _aws_cdk_core_CliCredentialsStackSynthesizerProps(p) {
}
function _aws_cdk_core_CliCredentialsStackSynthesizer(p) {
}
function _aws_cdk_core_AssetManifestBuilder(p) {
}
function _aws_cdk_core_AssetManifestFileDestination(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.role))
            _aws_cdk_core_RoleOptions(p.role);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_core_AssetManifestDockerImageDestination(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.role))
            _aws_cdk_core_RoleOptions(p.role);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_core_RoleOptions(p) {
}
function _aws_cdk_core_Reference(p) {
}
function _aws_cdk_core_CfnConditionProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.expression))
            _aws_cdk_core_ICfnConditionExpression(p.expression);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_core_CfnCondition(p) {
}
function _aws_cdk_core_ICfnConditionExpression(p) {
}
function _aws_cdk_core_ICfnRuleConditionExpression(p) {
}
function _aws_cdk_core_Fn(p) {
}
function _aws_cdk_core_CfnHookProps(p) {
}
function _aws_cdk_core_CfnHook(p) {
}
function _aws_cdk_core_CfnTrafficRoutingType(p) {
}
function _aws_cdk_core_CfnTrafficRoutingTimeBasedCanary(p) {
}
function _aws_cdk_core_CfnTrafficRoutingTimeBasedLinear(p) {
}
function _aws_cdk_core_CfnTrafficRoutingConfig(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.type))
            _aws_cdk_core_CfnTrafficRoutingType(p.type);
        if (!visitedObjects.has(p.timeBasedCanary))
            _aws_cdk_core_CfnTrafficRoutingTimeBasedCanary(p.timeBasedCanary);
        if (!visitedObjects.has(p.timeBasedLinear))
            _aws_cdk_core_CfnTrafficRoutingTimeBasedLinear(p.timeBasedLinear);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_core_CfnCodeDeployBlueGreenAdditionalOptions(p) {
}
function _aws_cdk_core_CfnCodeDeployBlueGreenLifecycleEventHooks(p) {
}
function _aws_cdk_core_CfnCodeDeployBlueGreenApplicationTarget(p) {
}
function _aws_cdk_core_CfnTrafficRoute(p) {
}
function _aws_cdk_core_CfnTrafficRouting(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.prodTrafficRoute))
            _aws_cdk_core_CfnTrafficRoute(p.prodTrafficRoute);
        if (!visitedObjects.has(p.testTrafficRoute))
            _aws_cdk_core_CfnTrafficRoute(p.testTrafficRoute);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_core_CfnCodeDeployBlueGreenEcsAttributes(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.trafficRouting))
            _aws_cdk_core_CfnTrafficRouting(p.trafficRouting);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_core_CfnCodeDeployBlueGreenApplication(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.ecsAttributes))
            _aws_cdk_core_CfnCodeDeployBlueGreenEcsAttributes(p.ecsAttributes);
        if (!visitedObjects.has(p.target))
            _aws_cdk_core_CfnCodeDeployBlueGreenApplicationTarget(p.target);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_core_CfnCodeDeployBlueGreenHookProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (p.applications != null)
            for (const o of p.applications)
                if (!visitedObjects.has(o))
                    _aws_cdk_core_CfnCodeDeployBlueGreenApplication(o);
        if (!visitedObjects.has(p.additionalOptions))
            _aws_cdk_core_CfnCodeDeployBlueGreenAdditionalOptions(p.additionalOptions);
        if (!visitedObjects.has(p.lifecycleEventHooks))
            _aws_cdk_core_CfnCodeDeployBlueGreenLifecycleEventHooks(p.lifecycleEventHooks);
        if (!visitedObjects.has(p.trafficRoutingConfig))
            _aws_cdk_core_CfnTrafficRoutingConfig(p.trafficRoutingConfig);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_core_CfnCodeDeployBlueGreenHook(p) {
}
function _aws_cdk_core_CfnIncludeProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if ("template" in p)
            print("@aws-cdk/core.CfnIncludeProps#template", "use the CfnInclude class from the cloudformation-include module instead");
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_core_CfnInclude(p) {
}
function _aws_cdk_core_CfnMappingProps(p) {
}
function _aws_cdk_core_CfnMapping(p) {
}
function _aws_cdk_core_CfnOutputProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.condition))
            _aws_cdk_core_CfnCondition(p.condition);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_core_CfnOutput(p) {
}
function _aws_cdk_core_CfnParameterProps(p) {
}
function _aws_cdk_core_CfnParameter(p) {
}
function _aws_cdk_core_Aws(p) {
}
function _aws_cdk_core_ScopedAws(p) {
}
function _aws_cdk_core_CfnResourceProps(p) {
}
function _aws_cdk_core_CfnResource(p) {
}
function _aws_cdk_core_TagType(p) {
}
function _aws_cdk_core_ICfnResourceOptions(p) {
}
function _aws_cdk_core_CfnCreationPolicy(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.autoScalingCreationPolicy))
            _aws_cdk_core_CfnResourceAutoScalingCreationPolicy(p.autoScalingCreationPolicy);
        if (!visitedObjects.has(p.resourceSignal))
            _aws_cdk_core_CfnResourceSignal(p.resourceSignal);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_core_CfnResourceAutoScalingCreationPolicy(p) {
}
function _aws_cdk_core_CfnResourceSignal(p) {
}
function _aws_cdk_core_CfnDeletionPolicy(p) {
}
function _aws_cdk_core_CfnUpdatePolicy(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.autoScalingReplacingUpdate))
            _aws_cdk_core_CfnAutoScalingReplacingUpdate(p.autoScalingReplacingUpdate);
        if (!visitedObjects.has(p.autoScalingRollingUpdate))
            _aws_cdk_core_CfnAutoScalingRollingUpdate(p.autoScalingRollingUpdate);
        if (!visitedObjects.has(p.autoScalingScheduledAction))
            _aws_cdk_core_CfnAutoScalingScheduledAction(p.autoScalingScheduledAction);
        if (!visitedObjects.has(p.codeDeployLambdaAliasUpdate))
            _aws_cdk_core_CfnCodeDeployLambdaAliasUpdate(p.codeDeployLambdaAliasUpdate);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_core_CfnAutoScalingRollingUpdate(p) {
}
function _aws_cdk_core_CfnAutoScalingReplacingUpdate(p) {
}
function _aws_cdk_core_CfnAutoScalingScheduledAction(p) {
}
function _aws_cdk_core_CfnCodeDeployLambdaAliasUpdate(p) {
}
function _aws_cdk_core_CfnRuleProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (p.assertions != null)
            for (const o of p.assertions)
                if (!visitedObjects.has(o))
                    _aws_cdk_core_CfnRuleAssertion(o);
        if (!visitedObjects.has(p.ruleCondition))
            _aws_cdk_core_ICfnConditionExpression(p.ruleCondition);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_core_CfnRule(p) {
}
function _aws_cdk_core_CfnRuleAssertion(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.assert))
            _aws_cdk_core_ICfnConditionExpression(p.assert);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_core_StackProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.env))
            _aws_cdk_core_Environment(p.env);
        if (!visitedObjects.has(p.permissionsBoundary))
            _aws_cdk_core_PermissionsBoundary(p.permissionsBoundary);
        if (!visitedObjects.has(p.synthesizer))
            _aws_cdk_core_IStackSynthesizer(p.synthesizer);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_core_Stack(p) {
}
function _aws_cdk_core_ITemplateOptions(p) {
}
function _aws_cdk_core_ExportValueOptions(p) {
}
function _aws_cdk_core_StageProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.env))
            _aws_cdk_core_Environment(p.env);
        if (!visitedObjects.has(p.permissionsBoundary))
            _aws_cdk_core_PermissionsBoundary(p.permissionsBoundary);
        if (p.policyValidationBeta1 != null)
            for (const o of p.policyValidationBeta1)
                if (!visitedObjects.has(o))
                    _aws_cdk_core_IPolicyValidationPluginBeta1(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_core_Stage(p) {
}
function _aws_cdk_core_StageSynthesisOptions(p) {
}
function _aws_cdk_core_CfnElement(p) {
}
function _aws_cdk_core_CfnRefElement(p) {
}
function _aws_cdk_core_CfnDynamicReferenceProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.service))
            _aws_cdk_core_CfnDynamicReferenceService(p.service);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_core_CfnDynamicReference(p) {
}
function _aws_cdk_core_CfnDynamicReferenceService(p) {
}
function _aws_cdk_core_CfnTag(p) {
}
function _aws_cdk_core_CfnJsonProps(p) {
}
function _aws_cdk_core_CfnJson(p) {
}
function _aws_cdk_core_RemovalPolicy(p) {
}
function _aws_cdk_core_RemovalPolicyOptions(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.default))
            _aws_cdk_core_RemovalPolicy(p.default);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_core_ArnFormat(p) {
}
function _aws_cdk_core_ArnComponents(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.arnFormat))
            _aws_cdk_core_ArnFormat(p.arnFormat);
        if ("sep" in p)
            print("@aws-cdk/core.ArnComponents#sep", "use arnFormat instead");
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_core_Arn(p) {
}
function _aws_cdk_core_Duration(p) {
}
function _aws_cdk_core_TimeConversionOptions(p) {
}
function _aws_cdk_core_Expiration(p) {
}
function _aws_cdk_core_Size(p) {
}
function _aws_cdk_core_SizeRoundingBehavior(p) {
}
function _aws_cdk_core_SizeConversionOptions(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.rounding))
            _aws_cdk_core_SizeRoundingBehavior(p.rounding);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_core_AppProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.defaultStackSynthesizer))
            _aws_cdk_core_IReusableStackSynthesizer(p.defaultStackSynthesizer);
        if (p.policyValidationBeta1 != null)
            for (const o of p.policyValidationBeta1)
                if (!visitedObjects.has(o))
                    _aws_cdk_core_IPolicyValidationPluginBeta1(o);
        if ("runtimeInfo" in p)
            print("@aws-cdk/core.AppProps#runtimeInfo", "use `versionReporting` instead");
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_core_App(p) {
}
function _aws_cdk_core_GetContextKeyOptions(p) {
}
function _aws_cdk_core_GetContextValueOptions(p) {
}
function _aws_cdk_core_GetContextKeyResult(p) {
}
function _aws_cdk_core_GetContextValueResult(p) {
}
function _aws_cdk_core_ContextProvider(p) {
}
function _aws_cdk_core_Environment(p) {
}
function _aws_cdk_core_Annotations(p) {
}
function _aws_cdk_core_ValidationResult(p) {
}
function _aws_cdk_core_ValidationResults(p) {
}
function _aws_cdk_core_SecretValue(p) {
}
function _aws_cdk_core_SecretsManagerSecretOptions(p) {
}
function _aws_cdk_core_ResourceEnvironment(p) {
}
function _aws_cdk_core_IResource(p) {
}
function _aws_cdk_core_ResourceProps(p) {
}
function _aws_cdk_core_Resource(p) {
}
function _aws_cdk_core_PhysicalName(p) {
}
function _aws_cdk_core_IAsset(p) {
}
function _aws_cdk_core_AssetOptions(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.assetHashType))
            _aws_cdk_core_AssetHashType(p.assetHashType);
        if (!visitedObjects.has(p.bundling))
            _aws_cdk_core_BundlingOptions(p.bundling);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_core_AssetHashType(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        const ns = require("./lib/assets.js");
        if (Object.values(ns.AssetHashType).filter(x => x === p).length > 1)
            return;
        if (p === ns.AssetHashType.BUNDLE)
            print("@aws-cdk/core.AssetHashType#BUNDLE", "use `OUTPUT` instead");
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_core_FileAssetSource(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.packaging))
            _aws_cdk_core_FileAssetPackaging(p.packaging);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_core_DockerImageAssetSource(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (p.dockerCacheFrom != null)
            for (const o of p.dockerCacheFrom)
                if (!visitedObjects.has(o))
                    _aws_cdk_core_DockerCacheOption(o);
        if (!visitedObjects.has(p.dockerCacheTo))
            _aws_cdk_core_DockerCacheOption(p.dockerCacheTo);
        if ("repositoryName" in p)
            print("@aws-cdk/core.DockerImageAssetSource#repositoryName", "repository name should be specified at the environment-level and not at the image level");
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_core_FileAssetPackaging(p) {
}
function _aws_cdk_core_FileAssetLocation(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if ("s3Url" in p)
            print("@aws-cdk/core.FileAssetLocation#s3Url", "use `httpUrl`");
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_core_DockerImageAssetLocation(p) {
}
function _aws_cdk_core_DockerCacheOption(p) {
}
function _aws_cdk_core_TreeInspector(p) {
}
function _aws_cdk_core_IInspectable(p) {
}
function _aws_cdk_core_AssetStagingProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.follow))
            _aws_cdk_core_SymlinkFollowMode(p.follow);
        if (!visitedObjects.has(p.ignoreMode))
            _aws_cdk_core_IgnoreMode(p.ignoreMode);
        if (!visitedObjects.has(p.assetHashType))
            _aws_cdk_core_AssetHashType(p.assetHashType);
        if (!visitedObjects.has(p.bundling))
            _aws_cdk_core_BundlingOptions(p.bundling);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_core_AssetStaging(p) {
}
function _aws_cdk_core_DockerBuildSecret(p) {
}
function _aws_cdk_core_BundlingOptions(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.image))
            _aws_cdk_core_DockerImage(p.image);
        if (!visitedObjects.has(p.bundlingFileAccess))
            _aws_cdk_core_BundlingFileAccess(p.bundlingFileAccess);
        if (!visitedObjects.has(p.local))
            _aws_cdk_core_ILocalBundling(p.local);
        if (!visitedObjects.has(p.outputType))
            _aws_cdk_core_BundlingOutput(p.outputType);
        if (p.volumes != null)
            for (const o of p.volumes)
                if (!visitedObjects.has(o))
                    _aws_cdk_core_DockerVolume(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_core_BundlingOutput(p) {
}
function _aws_cdk_core_ILocalBundling(p) {
}
function _aws_cdk_core_BundlingFileAccess(p) {
}
function _aws_cdk_core_BundlingDockerImage(p) {
}
function _aws_cdk_core_DockerImage(p) {
}
function _aws_cdk_core_DockerVolume(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.consistency))
            _aws_cdk_core_DockerVolumeConsistency(p.consistency);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_core_DockerVolumeConsistency(p) {
}
function _aws_cdk_core_DockerRunOptions(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (p.volumes != null)
            for (const o of p.volumes)
                if (!visitedObjects.has(o))
                    _aws_cdk_core_DockerVolume(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_core_DockerBuildOptions(p) {
}
function _aws_cdk_core_FileSystem(p) {
}
function _aws_cdk_core_IgnoreStrategy(p) {
}
function _aws_cdk_core_GlobIgnoreStrategy(p) {
}
function _aws_cdk_core_GitIgnoreStrategy(p) {
}
function _aws_cdk_core_DockerIgnoreStrategy(p) {
}
function _aws_cdk_core_SymlinkFollowMode(p) {
}
function _aws_cdk_core_IgnoreMode(p) {
}
function _aws_cdk_core_CopyOptions(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.follow))
            _aws_cdk_core_SymlinkFollowMode(p.follow);
        if (!visitedObjects.has(p.ignoreMode))
            _aws_cdk_core_IgnoreMode(p.ignoreMode);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_core_FileCopyOptions(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.followSymlinks))
            _aws_cdk_core_SymlinkFollowMode(p.followSymlinks);
        if (!visitedObjects.has(p.ignoreMode))
            _aws_cdk_core_IgnoreMode(p.ignoreMode);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_core_FingerprintOptions(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.follow))
            _aws_cdk_core_SymlinkFollowMode(p.follow);
        if (!visitedObjects.has(p.ignoreMode))
            _aws_cdk_core_IgnoreMode(p.ignoreMode);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_core_FileFingerprintOptions(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.followSymlinks))
            _aws_cdk_core_SymlinkFollowMode(p.followSymlinks);
        if (!visitedObjects.has(p.ignoreMode))
            _aws_cdk_core_IgnoreMode(p.ignoreMode);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_core_CustomResourceProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.removalPolicy))
            _aws_cdk_core_RemovalPolicy(p.removalPolicy);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_core_CustomResource(p) {
}
function _aws_cdk_core_NestedStackProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.removalPolicy))
            _aws_cdk_core_RemovalPolicy(p.removalPolicy);
        if (!visitedObjects.has(p.timeout))
            _aws_cdk_core_Duration(p.timeout);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_core_NestedStack(p) {
}
function _aws_cdk_core_CustomResourceProviderProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.runtime))
            _aws_cdk_core_CustomResourceProviderRuntime(p.runtime);
        if (!visitedObjects.has(p.memorySize))
            _aws_cdk_core_Size(p.memorySize);
        if (!visitedObjects.has(p.timeout))
            _aws_cdk_core_Duration(p.timeout);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_core_CustomResourceProviderRuntime(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        const ns = require("./lib/custom-resource-provider/custom-resource-provider.js");
        if (Object.values(ns.CustomResourceProviderRuntime).filter(x => x === p).length > 1)
            return;
        if (p === ns.CustomResourceProviderRuntime.NODEJS_12)
            print("@aws-cdk/core.CustomResourceProviderRuntime#NODEJS_12", "Use `NODEJS_14_X`");
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_core_CustomResourceProvider(p) {
}
function _aws_cdk_core_CfnCapabilities(p) {
}
function _aws_cdk_core_CfnCustomResourceProps(p) {
}
function _aws_cdk_core_CfnCustomResource(p) {
}
function _aws_cdk_core_CfnHookDefaultVersionProps(p) {
}
function _aws_cdk_core_CfnHookDefaultVersion(p) {
}
function _aws_cdk_core_CfnHookTypeConfigProps(p) {
}
function _aws_cdk_core_CfnHookTypeConfig(p) {
}
function _aws_cdk_core_CfnHookVersionProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.loggingConfig))
            _aws_cdk_core_IResolvable(p.loggingConfig);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_core_CfnHookVersion(p) {
}
function _aws_cdk_core_CfnHookVersion_LoggingConfigProperty(p) {
}
function _aws_cdk_core_CfnMacroProps(p) {
}
function _aws_cdk_core_CfnMacro(p) {
}
function _aws_cdk_core_CfnModuleDefaultVersionProps(p) {
}
function _aws_cdk_core_CfnModuleDefaultVersion(p) {
}
function _aws_cdk_core_CfnModuleVersionProps(p) {
}
function _aws_cdk_core_CfnModuleVersion(p) {
}
function _aws_cdk_core_CfnPublicTypeVersionProps(p) {
}
function _aws_cdk_core_CfnPublicTypeVersion(p) {
}
function _aws_cdk_core_CfnPublisherProps(p) {
}
function _aws_cdk_core_CfnPublisher(p) {
}
function _aws_cdk_core_CfnResourceDefaultVersionProps(p) {
}
function _aws_cdk_core_CfnResourceDefaultVersion(p) {
}
function _aws_cdk_core_CfnResourceVersionProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.loggingConfig))
            _aws_cdk_core_IResolvable(p.loggingConfig);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_core_CfnResourceVersion(p) {
}
function _aws_cdk_core_CfnResourceVersion_LoggingConfigProperty(p) {
}
function _aws_cdk_core_CfnStackProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.parameters))
            _aws_cdk_core_IResolvable(p.parameters);
        if (p.tags != null)
            for (const o of p.tags)
                if (!visitedObjects.has(o))
                    _aws_cdk_core_CfnTag(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_core_CfnStack(p) {
}
function _aws_cdk_core_CfnStackSetProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.autoDeployment))
            _aws_cdk_core_IResolvable(p.autoDeployment);
        if (!visitedObjects.has(p.operationPreferences))
            _aws_cdk_core_IResolvable(p.operationPreferences);
        if (!visitedObjects.has(p.parameters))
            _aws_cdk_core_IResolvable(p.parameters);
        if (!visitedObjects.has(p.stackInstancesGroup))
            _aws_cdk_core_IResolvable(p.stackInstancesGroup);
        if (p.tags != null)
            for (const o of p.tags)
                if (!visitedObjects.has(o))
                    _aws_cdk_core_CfnTag(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_core_CfnStackSet(p) {
}
function _aws_cdk_core_CfnStackSet_AutoDeploymentProperty(p) {
}
function _aws_cdk_core_CfnStackSet_DeploymentTargetsProperty(p) {
}
function _aws_cdk_core_CfnStackSet_ManagedExecutionProperty(p) {
}
function _aws_cdk_core_CfnStackSet_OperationPreferencesProperty(p) {
}
function _aws_cdk_core_CfnStackSet_ParameterProperty(p) {
}
function _aws_cdk_core_CfnStackSet_StackInstancesProperty(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.deploymentTargets))
            _aws_cdk_core_IResolvable(p.deploymentTargets);
        if (!visitedObjects.has(p.parameterOverrides))
            _aws_cdk_core_IResolvable(p.parameterOverrides);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_core_CfnTypeActivationProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.loggingConfig))
            _aws_cdk_core_IResolvable(p.loggingConfig);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_core_CfnTypeActivation(p) {
}
function _aws_cdk_core_CfnTypeActivation_LoggingConfigProperty(p) {
}
function _aws_cdk_core_CfnWaitConditionProps(p) {
}
function _aws_cdk_core_CfnWaitCondition(p) {
}
function _aws_cdk_core_CfnWaitConditionHandle(p) {
}
function _aws_cdk_core_FeatureFlags(p) {
}
function _aws_cdk_core_PermissionsBoundaryBindOptions(p) {
}
function _aws_cdk_core_PermissionsBoundary(p) {
}
function _aws_cdk_core_IPolicyValidationPluginBeta1(p) {
}
function _aws_cdk_core_IPolicyValidationContextBeta1(p) {
}
function _aws_cdk_core_PolicyViolationBeta1(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (p.violatingResources != null)
            for (const o of p.violatingResources)
                if (!visitedObjects.has(o))
                    _aws_cdk_core_PolicyViolatingResourceBeta1(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_core_PolicyViolatingResourceBeta1(p) {
}
function _aws_cdk_core_PolicyValidationReportStatusBeta1(p) {
}
function _aws_cdk_core_PolicyValidationPluginReportBeta1(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (p.violations != null)
            for (const o of p.violations)
                if (!visitedObjects.has(o))
                    _aws_cdk_core_PolicyViolationBeta1(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_core_IntrinsicProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.typeHint))
            _aws_cdk_core_ResolutionTypeHint(p.typeHint);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_core_Intrinsic(p) {
}
function _aws_cdk_core_UniqueResourceNameOptions(p) {
}
function _aws_cdk_core_Names(p) {
}
function _aws_cdk_core_TimeZone(p) {
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
module.exports = { print, getPropertyDescriptor, DeprecationError, _aws_cdk_core_IAspect, _aws_cdk_core_Aspects, _aws_cdk_core_TagProps, _aws_cdk_core_Tag, _aws_cdk_core_Tags, _aws_cdk_core_RemoveTag, _aws_cdk_core_TokenComparison, _aws_cdk_core_Token, _aws_cdk_core_Tokenization, _aws_cdk_core_JsonNull, _aws_cdk_core_ReverseOptions, _aws_cdk_core_ResolveOptions, _aws_cdk_core_EncodingOptions, _aws_cdk_core_IResolveContext, _aws_cdk_core_ResolveChangeContextOptions, _aws_cdk_core_IResolvable, _aws_cdk_core_IPostProcessor, _aws_cdk_core_ITokenResolver, _aws_cdk_core_IFragmentConcatenator, _aws_cdk_core_StringConcat, _aws_cdk_core_DefaultTokenResolver, _aws_cdk_core_ResolutionTypeHint, _aws_cdk_core_IStringProducer, _aws_cdk_core_IStableStringProducer, _aws_cdk_core_IListProducer, _aws_cdk_core_IStableListProducer, _aws_cdk_core_INumberProducer, _aws_cdk_core_IStableNumberProducer, _aws_cdk_core_IAnyProducer, _aws_cdk_core_IStableAnyProducer, _aws_cdk_core_LazyStringValueOptions, _aws_cdk_core_LazyListValueOptions, _aws_cdk_core_LazyAnyValueOptions, _aws_cdk_core_Lazy, _aws_cdk_core_ITaggable, _aws_cdk_core_TagManagerOptions, _aws_cdk_core_TagManager, _aws_cdk_core_TokenizedStringFragments, _aws_cdk_core_ITokenMapper, _aws_cdk_core_IStackSynthesizer, _aws_cdk_core_IReusableStackSynthesizer, _aws_cdk_core_IBoundStackSynthesizer, _aws_cdk_core_ISynthesisSession, _aws_cdk_core_DefaultStackSynthesizerProps, _aws_cdk_core_DefaultStackSynthesizer, _aws_cdk_core_LegacyStackSynthesizer, _aws_cdk_core_BootstraplessSynthesizerProps, _aws_cdk_core_BootstraplessSynthesizer, _aws_cdk_core_NestedStackSynthesizer, _aws_cdk_core_StackSynthesizer, _aws_cdk_core_SynthesizeStackArtifactOptions, _aws_cdk_core_CliCredentialsStackSynthesizerProps, _aws_cdk_core_CliCredentialsStackSynthesizer, _aws_cdk_core_AssetManifestBuilder, _aws_cdk_core_AssetManifestFileDestination, _aws_cdk_core_AssetManifestDockerImageDestination, _aws_cdk_core_RoleOptions, _aws_cdk_core_Reference, _aws_cdk_core_CfnConditionProps, _aws_cdk_core_CfnCondition, _aws_cdk_core_ICfnConditionExpression, _aws_cdk_core_ICfnRuleConditionExpression, _aws_cdk_core_Fn, _aws_cdk_core_CfnHookProps, _aws_cdk_core_CfnHook, _aws_cdk_core_CfnTrafficRoutingType, _aws_cdk_core_CfnTrafficRoutingTimeBasedCanary, _aws_cdk_core_CfnTrafficRoutingTimeBasedLinear, _aws_cdk_core_CfnTrafficRoutingConfig, _aws_cdk_core_CfnCodeDeployBlueGreenAdditionalOptions, _aws_cdk_core_CfnCodeDeployBlueGreenLifecycleEventHooks, _aws_cdk_core_CfnCodeDeployBlueGreenApplicationTarget, _aws_cdk_core_CfnTrafficRoute, _aws_cdk_core_CfnTrafficRouting, _aws_cdk_core_CfnCodeDeployBlueGreenEcsAttributes, _aws_cdk_core_CfnCodeDeployBlueGreenApplication, _aws_cdk_core_CfnCodeDeployBlueGreenHookProps, _aws_cdk_core_CfnCodeDeployBlueGreenHook, _aws_cdk_core_CfnIncludeProps, _aws_cdk_core_CfnInclude, _aws_cdk_core_CfnMappingProps, _aws_cdk_core_CfnMapping, _aws_cdk_core_CfnOutputProps, _aws_cdk_core_CfnOutput, _aws_cdk_core_CfnParameterProps, _aws_cdk_core_CfnParameter, _aws_cdk_core_Aws, _aws_cdk_core_ScopedAws, _aws_cdk_core_CfnResourceProps, _aws_cdk_core_CfnResource, _aws_cdk_core_TagType, _aws_cdk_core_ICfnResourceOptions, _aws_cdk_core_CfnCreationPolicy, _aws_cdk_core_CfnResourceAutoScalingCreationPolicy, _aws_cdk_core_CfnResourceSignal, _aws_cdk_core_CfnDeletionPolicy, _aws_cdk_core_CfnUpdatePolicy, _aws_cdk_core_CfnAutoScalingRollingUpdate, _aws_cdk_core_CfnAutoScalingReplacingUpdate, _aws_cdk_core_CfnAutoScalingScheduledAction, _aws_cdk_core_CfnCodeDeployLambdaAliasUpdate, _aws_cdk_core_CfnRuleProps, _aws_cdk_core_CfnRule, _aws_cdk_core_CfnRuleAssertion, _aws_cdk_core_StackProps, _aws_cdk_core_Stack, _aws_cdk_core_ITemplateOptions, _aws_cdk_core_ExportValueOptions, _aws_cdk_core_StageProps, _aws_cdk_core_Stage, _aws_cdk_core_StageSynthesisOptions, _aws_cdk_core_CfnElement, _aws_cdk_core_CfnRefElement, _aws_cdk_core_CfnDynamicReferenceProps, _aws_cdk_core_CfnDynamicReference, _aws_cdk_core_CfnDynamicReferenceService, _aws_cdk_core_CfnTag, _aws_cdk_core_CfnJsonProps, _aws_cdk_core_CfnJson, _aws_cdk_core_RemovalPolicy, _aws_cdk_core_RemovalPolicyOptions, _aws_cdk_core_ArnFormat, _aws_cdk_core_ArnComponents, _aws_cdk_core_Arn, _aws_cdk_core_Duration, _aws_cdk_core_TimeConversionOptions, _aws_cdk_core_Expiration, _aws_cdk_core_Size, _aws_cdk_core_SizeRoundingBehavior, _aws_cdk_core_SizeConversionOptions, _aws_cdk_core_AppProps, _aws_cdk_core_App, _aws_cdk_core_GetContextKeyOptions, _aws_cdk_core_GetContextValueOptions, _aws_cdk_core_GetContextKeyResult, _aws_cdk_core_GetContextValueResult, _aws_cdk_core_ContextProvider, _aws_cdk_core_Environment, _aws_cdk_core_Annotations, _aws_cdk_core_ValidationResult, _aws_cdk_core_ValidationResults, _aws_cdk_core_SecretValue, _aws_cdk_core_SecretsManagerSecretOptions, _aws_cdk_core_ResourceEnvironment, _aws_cdk_core_IResource, _aws_cdk_core_ResourceProps, _aws_cdk_core_Resource, _aws_cdk_core_PhysicalName, _aws_cdk_core_IAsset, _aws_cdk_core_AssetOptions, _aws_cdk_core_AssetHashType, _aws_cdk_core_FileAssetSource, _aws_cdk_core_DockerImageAssetSource, _aws_cdk_core_FileAssetPackaging, _aws_cdk_core_FileAssetLocation, _aws_cdk_core_DockerImageAssetLocation, _aws_cdk_core_DockerCacheOption, _aws_cdk_core_TreeInspector, _aws_cdk_core_IInspectable, _aws_cdk_core_AssetStagingProps, _aws_cdk_core_AssetStaging, _aws_cdk_core_DockerBuildSecret, _aws_cdk_core_BundlingOptions, _aws_cdk_core_BundlingOutput, _aws_cdk_core_ILocalBundling, _aws_cdk_core_BundlingFileAccess, _aws_cdk_core_BundlingDockerImage, _aws_cdk_core_DockerImage, _aws_cdk_core_DockerVolume, _aws_cdk_core_DockerVolumeConsistency, _aws_cdk_core_DockerRunOptions, _aws_cdk_core_DockerBuildOptions, _aws_cdk_core_FileSystem, _aws_cdk_core_IgnoreStrategy, _aws_cdk_core_GlobIgnoreStrategy, _aws_cdk_core_GitIgnoreStrategy, _aws_cdk_core_DockerIgnoreStrategy, _aws_cdk_core_SymlinkFollowMode, _aws_cdk_core_IgnoreMode, _aws_cdk_core_CopyOptions, _aws_cdk_core_FileCopyOptions, _aws_cdk_core_FingerprintOptions, _aws_cdk_core_FileFingerprintOptions, _aws_cdk_core_CustomResourceProps, _aws_cdk_core_CustomResource, _aws_cdk_core_NestedStackProps, _aws_cdk_core_NestedStack, _aws_cdk_core_CustomResourceProviderProps, _aws_cdk_core_CustomResourceProviderRuntime, _aws_cdk_core_CustomResourceProvider, _aws_cdk_core_CfnCapabilities, _aws_cdk_core_CfnCustomResourceProps, _aws_cdk_core_CfnCustomResource, _aws_cdk_core_CfnHookDefaultVersionProps, _aws_cdk_core_CfnHookDefaultVersion, _aws_cdk_core_CfnHookTypeConfigProps, _aws_cdk_core_CfnHookTypeConfig, _aws_cdk_core_CfnHookVersionProps, _aws_cdk_core_CfnHookVersion, _aws_cdk_core_CfnHookVersion_LoggingConfigProperty, _aws_cdk_core_CfnMacroProps, _aws_cdk_core_CfnMacro, _aws_cdk_core_CfnModuleDefaultVersionProps, _aws_cdk_core_CfnModuleDefaultVersion, _aws_cdk_core_CfnModuleVersionProps, _aws_cdk_core_CfnModuleVersion, _aws_cdk_core_CfnPublicTypeVersionProps, _aws_cdk_core_CfnPublicTypeVersion, _aws_cdk_core_CfnPublisherProps, _aws_cdk_core_CfnPublisher, _aws_cdk_core_CfnResourceDefaultVersionProps, _aws_cdk_core_CfnResourceDefaultVersion, _aws_cdk_core_CfnResourceVersionProps, _aws_cdk_core_CfnResourceVersion, _aws_cdk_core_CfnResourceVersion_LoggingConfigProperty, _aws_cdk_core_CfnStackProps, _aws_cdk_core_CfnStack, _aws_cdk_core_CfnStackSetProps, _aws_cdk_core_CfnStackSet, _aws_cdk_core_CfnStackSet_AutoDeploymentProperty, _aws_cdk_core_CfnStackSet_DeploymentTargetsProperty, _aws_cdk_core_CfnStackSet_ManagedExecutionProperty, _aws_cdk_core_CfnStackSet_OperationPreferencesProperty, _aws_cdk_core_CfnStackSet_ParameterProperty, _aws_cdk_core_CfnStackSet_StackInstancesProperty, _aws_cdk_core_CfnTypeActivationProps, _aws_cdk_core_CfnTypeActivation, _aws_cdk_core_CfnTypeActivation_LoggingConfigProperty, _aws_cdk_core_CfnWaitConditionProps, _aws_cdk_core_CfnWaitCondition, _aws_cdk_core_CfnWaitConditionHandle, _aws_cdk_core_FeatureFlags, _aws_cdk_core_PermissionsBoundaryBindOptions, _aws_cdk_core_PermissionsBoundary, _aws_cdk_core_IPolicyValidationPluginBeta1, _aws_cdk_core_IPolicyValidationContextBeta1, _aws_cdk_core_PolicyViolationBeta1, _aws_cdk_core_PolicyViolatingResourceBeta1, _aws_cdk_core_PolicyValidationReportStatusBeta1, _aws_cdk_core_PolicyValidationPluginReportBeta1, _aws_cdk_core_IntrinsicProps, _aws_cdk_core_Intrinsic, _aws_cdk_core_UniqueResourceNameOptions, _aws_cdk_core_Names, _aws_cdk_core_TimeZone };
