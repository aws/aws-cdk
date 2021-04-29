# List of deprecated APIs in v1

| Module | API Element | Message |
|--------|-------------|---------|
| @aws-cdk/core | AppProps.runtimeInfo | use `versionReporting` instead |
| @aws-cdk/core | AssetHashType.BUNDLE | use `OUTPUT` instead |
| @aws-cdk/core | AssetStaging.sourceHash | see `assetHash`. |
| @aws-cdk/core | AssetStaging.stagedPath | Use `absoluteStagedPath` instead. |
| @aws-cdk/core | BundlingDockerImage | use DockerImage |
| @aws-cdk/core | BundlingDockerImage.image | use DockerImage |
| @aws-cdk/core | BundlingDockerImage.fromAsset() | use DockerImage.fromBuild() |
| @aws-cdk/core | BundlingDockerImage.fromRegistry() | use DockerImage |
| @aws-cdk/core | BundlingDockerImage.cp() | use DockerImage |
| @aws-cdk/core | BundlingDockerImage.run() | use DockerImage |
| @aws-cdk/core | BundlingDockerImage.toJSON() | use DockerImage |
| @aws-cdk/core | CfnInclude | use the CfnInclude class from the cloudformation-include module instead |
| @aws-cdk/core | CfnInclude.template | use the CfnInclude class from the cloudformation-include module instead |
| @aws-cdk/core | CfnIncludeProps | use the CfnInclude class from the cloudformation-include module instead |
| @aws-cdk/core | CfnIncludeProps.template | use the CfnInclude class from the cloudformation-include module instead |
| @aws-cdk/core | ConstructNode.metadata | use `metadataEntry` |
| @aws-cdk/core | ConstructNode.uniqueId | use `node.addr` to obtain a consistent 42 character address for this node (see https://github.com/aws/constructs/pull/314) |
| @aws-cdk/core | ConstructNode.prepare() | Use `app.synth()` instead |
| @aws-cdk/core | ConstructNode.synth() | Use `app.synth()` or `stage.synth()` instead |
| @aws-cdk/core | ConstructNode.addError() | use `Annotations.of(construct).addError()` |
| @aws-cdk/core | ConstructNode.addInfo() | use `Annotations.of(construct).addInfo()` |
| @aws-cdk/core | ConstructNode.addWarning() | use `Annotations.of(construct).addWarning()` |
| @aws-cdk/core | ConstructNode.applyAspect() | This API is going to be removed in the next major version of the AWS CDK. Please use `Aspects.of(scope).add()` instead. |
| @aws-cdk/core | CustomResourceProviderRuntime.NODEJS_12 | Use {@link NODEJS_12_X} |
| @aws-cdk/core | DefaultStackSynthesizerProps.fileAssetKeyArnExportName | This property is not used anymore |
| @aws-cdk/core | DockerImageAssetSource.repositoryName | repository name should be specified at the environment-level and not at the image level |
| @aws-cdk/core | Duration.toISOString() | Use `toIsoString()` instead. |
| @aws-cdk/core | FileAssetLocation.kmsKeyArn | Since bootstrap bucket v4, the key policy properly allows use of the key via the bucket and no additional parameters have to be granted anymore. |
| @aws-cdk/core | FileAssetLocation.s3Url | use `httpUrl` |
| @aws-cdk/core | ITemplateOptions.transform | use `transforms` instead. |
| @aws-cdk/core | Lazy.anyValue() | Use `Lazy.any()` or `Lazy.uncachedAny()` instead. |
| @aws-cdk/core | Lazy.listValue() | Use `Lazy.list()` or `Lazy.uncachedList()` instead. |
| @aws-cdk/core | Lazy.numberValue() | Use `Lazy.number()` or `Lazy.uncachedNumber()` instead. |
| @aws-cdk/core | Lazy.stringValue() | Use `Lazy.string()` or `Lazy.uncachedString()` instead. |
| @aws-cdk/core | Size.pebibyte() | use `pebibytes` instead |
| @aws-cdk/core | Stack.parentStack | use `nestedStackParent` |
| @aws-cdk/core | Stack.addDockerImageAsset() | Use `stack.synthesizer.addDockerImageAsset()` if you are calling, and a different `IStackSynthesizer` class if you are implementing. |
| @aws-cdk/core | Stack.addFileAsset() | Use `stack.synthesizer.addFileAsset()` if you are calling, and a different IStackSynthesizer class if you are implementing. |
| @aws-cdk/core | Stack.prepareCrossReference() | cross reference handling has been moved to `App.prepare()`. |
| @aws-cdk/core | Stack.reportMissingContext() | use `reportMissingContextKey()` |
| @aws-cdk/core | SynthesisOptions | use `app.synth()` or `stage.synth()` instead |
| @aws-cdk/core | SynthesisOptions.outdir | use `app.synth()` or `stage.synth()` instead |
| @aws-cdk/core | SynthesisOptions.skipValidation | use `app.synth()` or `stage.synth()` instead |
| @aws-cdk/core | Tag.add() | use `Tags.of(scope).add()` |
| @aws-cdk/core | Tag.remove() | use `Tags.of(scope).remove()` |
| @aws-cdk/cloud-assembly-schema | ContainerImageAssetMetadataEntry.imageNameParameter | specify `repositoryName` and `imageTag` instead, and then you know where the image will go. |
| @aws-cdk/cloud-assembly-schema | Manifest.load() | use `loadAssemblyManifest()` |
| @aws-cdk/cloud-assembly-schema | Manifest.save() | use `saveAssemblyManifest()` |
| @aws-cdk/cx-api | AssemblyBuildOptions.runtimeInfo | All template modifications that should result from this should have already been inserted into the template. |
| @aws-cdk/cx-api | CloudAssembly.getStack() | renamed to `getStackByName` (or `getStackArtifact(id)`) |
| @aws-cdk/cx-api | CloudFormationStackArtifact.name | renamed to `stackName` |
| @aws-cdk/cx-api | MetadataEntry | moved to package 'cloud-assembly-schema' |
| @aws-cdk/cx-api | MissingContext | moved to package 'cloud-assembly-schema' |
| @aws-cdk/cx-api | MissingContext.key | moved to package 'cloud-assembly-schema' |
| @aws-cdk/cx-api | MissingContext.props | moved to package 'cloud-assembly-schema' |
| @aws-cdk/cx-api | MissingContext.provider | moved to package 'cloud-assembly-schema' |
| @aws-cdk/cx-api | RuntimeInfo | moved to package 'cloud-assembly-schema' |
| constructs | Construct.onValidate() | use `Node.addValidation()` to subscribe validation functions on this construct instead of overriding this method. |
| constructs | Node.uniqueId | please avoid using this property and use `uid` instead. This algorithm uses MD5, which is not FIPS-complient and also excludes the identity of the root construct from the calculation. |
| @aws-cdk/assets | CopyOptions | see `core.CopyOptions` |
| @aws-cdk/assets | CopyOptions.exclude | see `core.CopyOptions` |
| @aws-cdk/assets | CopyOptions.follow | use `followSymlinks` instead |
| @aws-cdk/assets | CopyOptions.ignoreMode | see `core.CopyOptions` |
| @aws-cdk/assets | FingerprintOptions | see `core.FingerprintOptions` |
| @aws-cdk/assets | FingerprintOptions.extraHash | see `core.FingerprintOptions` |
| @aws-cdk/assets | FollowMode | see `core.SymlinkFollowMode` |
| @aws-cdk/assets | FollowMode.NEVER | see `core.SymlinkFollowMode` |
| @aws-cdk/assets | FollowMode.ALWAYS | see `core.SymlinkFollowMode` |
| @aws-cdk/assets | FollowMode.EXTERNAL | see `core.SymlinkFollowMode` |
| @aws-cdk/assets | FollowMode.BLOCK_EXTERNAL | see `core.SymlinkFollowMode` |
| @aws-cdk/assets | IAsset | use `core.IAsset` |
| @aws-cdk/assets | IAsset.sourceHash | use `core.IAsset` |
| @aws-cdk/assets | Staging | use `core.AssetStaging` |
| @aws-cdk/assets | StagingProps | use `core.AssetStagingProps` |
| @aws-cdk/assets | StagingProps.sourcePath | use `core.AssetStagingProps` |
| @aws-cdk/aws-iam | Anyone | use `AnyPrincipal` |
| @aws-cdk/aws-iam | IPrincipal.addToPolicy() | Use `addToPrincipalPolicy` instead. |
| @aws-cdk/aws-iam | RoleProps.externalId | see {@link externalIds} |
| @aws-cdk/aws-kms | KeyProps.trustAccountIdentities | redundant with the `@aws-cdk/aws-kms:defaultKeyPolicies` feature flag |
| @aws-cdk/aws-codebuild | LinuxBuildImage.UBUNTU_14_04_ANDROID_JAVA8_24_4_1 | Use {@link STANDARD_2_0} and specify runtime in buildspec runtime-versions section |
| @aws-cdk/aws-codebuild | LinuxBuildImage.UBUNTU_14_04_ANDROID_JAVA8_26_1_1 | Use {@link STANDARD_2_0} and specify runtime in buildspec runtime-versions section |
| @aws-cdk/aws-codebuild | LinuxBuildImage.UBUNTU_14_04_BASE | Use {@link STANDARD_2_0} and specify runtime in buildspec runtime-versions section |
| @aws-cdk/aws-codebuild | LinuxBuildImage.UBUNTU_14_04_DOCKER_17_09_0 | Use {@link STANDARD_2_0} and specify runtime in buildspec runtime-versions section |
| @aws-cdk/aws-codebuild | LinuxBuildImage.UBUNTU_14_04_DOCKER_18_09_0 | Use {@link STANDARD_2_0} and specify runtime in buildspec runtime-versions section |
| @aws-cdk/aws-codebuild | LinuxBuildImage.UBUNTU_14_04_DOTNET_CORE_1_1 | Use {@link STANDARD_2_0} and specify runtime in buildspec runtime-versions section |
| @aws-cdk/aws-codebuild | LinuxBuildImage.UBUNTU_14_04_DOTNET_CORE_2_0 | Use {@link STANDARD_2_0} and specify runtime in buildspec runtime-versions section |
| @aws-cdk/aws-codebuild | LinuxBuildImage.UBUNTU_14_04_DOTNET_CORE_2_1 | Use {@link STANDARD_2_0} and specify runtime in buildspec runtime-versions section |
| @aws-cdk/aws-codebuild | LinuxBuildImage.UBUNTU_14_04_GOLANG_1_10 | Use {@link STANDARD_2_0} and specify runtime in buildspec runtime-versions section |
| @aws-cdk/aws-codebuild | LinuxBuildImage.UBUNTU_14_04_GOLANG_1_11 | Use {@link STANDARD_2_0} and specify runtime in buildspec runtime-versions section |
| @aws-cdk/aws-codebuild | LinuxBuildImage.UBUNTU_14_04_NODEJS_10_1_0 | Use {@link STANDARD_2_0} and specify runtime in buildspec runtime-versions section |
| @aws-cdk/aws-codebuild | LinuxBuildImage.UBUNTU_14_04_NODEJS_10_14_1 | Use {@link STANDARD_2_0} and specify runtime in buildspec runtime-versions section |
| @aws-cdk/aws-codebuild | LinuxBuildImage.UBUNTU_14_04_NODEJS_6_3_1 | Use {@link STANDARD_2_0} and specify runtime in buildspec runtime-versions section |
| @aws-cdk/aws-codebuild | LinuxBuildImage.UBUNTU_14_04_NODEJS_8_11_0 | Use {@link STANDARD_2_0} and specify runtime in buildspec runtime-versions section |
| @aws-cdk/aws-codebuild | LinuxBuildImage.UBUNTU_14_04_OPEN_JDK_11 | Use {@link STANDARD_2_0} and specify runtime in buildspec runtime-versions section |
| @aws-cdk/aws-codebuild | LinuxBuildImage.UBUNTU_14_04_OPEN_JDK_8 | Use {@link STANDARD_2_0} and specify runtime in buildspec runtime-versions section |
| @aws-cdk/aws-codebuild | LinuxBuildImage.UBUNTU_14_04_OPEN_JDK_9 | Use {@link STANDARD_2_0} and specify runtime in buildspec runtime-versions section |
| @aws-cdk/aws-codebuild | LinuxBuildImage.UBUNTU_14_04_PHP_5_6 | Use {@link STANDARD_2_0} and specify runtime in buildspec runtime-versions section |
| @aws-cdk/aws-codebuild | LinuxBuildImage.UBUNTU_14_04_PHP_7_0 | Use {@link STANDARD_2_0} and specify runtime in buildspec runtime-versions section |
| @aws-cdk/aws-codebuild | LinuxBuildImage.UBUNTU_14_04_PHP_7_1 | Use {@link STANDARD_2_0} and specify runtime in buildspec runtime-versions section |
| @aws-cdk/aws-codebuild | LinuxBuildImage.UBUNTU_14_04_PYTHON_2_7_12 | Use {@link STANDARD_2_0} and specify runtime in buildspec runtime-versions section |
| @aws-cdk/aws-codebuild | LinuxBuildImage.UBUNTU_14_04_PYTHON_3_3_6 | Use {@link STANDARD_2_0} and specify runtime in buildspec runtime-versions section |
| @aws-cdk/aws-codebuild | LinuxBuildImage.UBUNTU_14_04_PYTHON_3_4_5 | Use {@link STANDARD_2_0} and specify runtime in buildspec runtime-versions section |
| @aws-cdk/aws-codebuild | LinuxBuildImage.UBUNTU_14_04_PYTHON_3_5_2 | Use {@link STANDARD_2_0} and specify runtime in buildspec runtime-versions section |
| @aws-cdk/aws-codebuild | LinuxBuildImage.UBUNTU_14_04_PYTHON_3_6_5 | Use {@link STANDARD_2_0} and specify runtime in buildspec runtime-versions section |
| @aws-cdk/aws-codebuild | LinuxBuildImage.UBUNTU_14_04_PYTHON_3_7_1 | Use {@link STANDARD_2_0} and specify runtime in buildspec runtime-versions section |
| @aws-cdk/aws-codebuild | LinuxBuildImage.UBUNTU_14_04_RUBY_2_2_5 | Use {@link STANDARD_2_0} and specify runtime in buildspec runtime-versions section |
| @aws-cdk/aws-codebuild | LinuxBuildImage.UBUNTU_14_04_RUBY_2_3_1 | Use {@link STANDARD_2_0} and specify runtime in buildspec runtime-versions section |
| @aws-cdk/aws-codebuild | LinuxBuildImage.UBUNTU_14_04_RUBY_2_5_1 | Use {@link STANDARD_2_0} and specify runtime in buildspec runtime-versions section |
| @aws-cdk/aws-codebuild | LinuxBuildImage.UBUNTU_14_04_RUBY_2_5_3 | Use {@link STANDARD_2_0} and specify runtime in buildspec runtime-versions section |
| @aws-cdk/aws-codebuild | WindowsBuildImage.WIN_SERVER_CORE_2016_BASE | `WindowsBuildImage.WINDOWS_BASE_2_0` should be used instead. |
| @aws-cdk/aws-cloudwatch | CreateAlarmOptions.period | Use `metric.with({ period: ... })` to encode the period into the Metric object |
| @aws-cdk/aws-cloudwatch | CreateAlarmOptions.statistic | Use `metric.with({ statistic: ... })` to encode the period into the Metric object |
| @aws-cdk/aws-cloudwatch | IMetric.toAlarmConfig() | Use `toMetricsConfig()` instead. |
| @aws-cdk/aws-cloudwatch | IMetric.toGraphConfig() | Use `toMetricsConfig()` instead. |
| @aws-cdk/aws-cloudwatch | MathExpression.toAlarmConfig() | use toMetricConfig() |
| @aws-cdk/aws-cloudwatch | MathExpression.toGraphConfig() | use toMetricConfig() |
| @aws-cdk/aws-cloudwatch | Metric.toAlarmConfig() | use toMetricConfig() |
| @aws-cdk/aws-cloudwatch | Metric.toGraphConfig() | use toMetricConfig() |
| @aws-cdk/aws-cloudwatch | MetricAlarmConfig | Replaced by MetricConfig |
| @aws-cdk/aws-cloudwatch | MetricAlarmConfig.metricName | Replaced by MetricConfig |
| @aws-cdk/aws-cloudwatch | MetricAlarmConfig.namespace | Replaced by MetricConfig |
| @aws-cdk/aws-cloudwatch | MetricAlarmConfig.period | Replaced by MetricConfig |
| @aws-cdk/aws-cloudwatch | MetricAlarmConfig.dimensions | Replaced by MetricConfig |
| @aws-cdk/aws-cloudwatch | MetricAlarmConfig.extendedStatistic | Replaced by MetricConfig |
| @aws-cdk/aws-cloudwatch | MetricAlarmConfig.statistic | Replaced by MetricConfig |
| @aws-cdk/aws-cloudwatch | MetricAlarmConfig.unit | Replaced by MetricConfig |
| @aws-cdk/aws-cloudwatch | MetricGraphConfig | Replaced by MetricConfig |
| @aws-cdk/aws-cloudwatch | MetricGraphConfig.metricName | Replaced by MetricConfig |
| @aws-cdk/aws-cloudwatch | MetricGraphConfig.namespace | Replaced by MetricConfig |
| @aws-cdk/aws-cloudwatch | MetricGraphConfig.period | Use `period` in `renderingProperties` |
| @aws-cdk/aws-cloudwatch | MetricGraphConfig.renderingProperties | Replaced by MetricConfig |
| @aws-cdk/aws-cloudwatch | MetricGraphConfig.color | Use `color` in `renderingProperties` |
| @aws-cdk/aws-cloudwatch | MetricGraphConfig.dimensions | Replaced by MetricConfig |
| @aws-cdk/aws-cloudwatch | MetricGraphConfig.label | Use `label` in `renderingProperties` |
| @aws-cdk/aws-cloudwatch | MetricGraphConfig.statistic | Use `stat` in `renderingProperties` |
| @aws-cdk/aws-cloudwatch | MetricGraphConfig.unit | not used in dashboard widgets |
| @aws-cdk/aws-cloudwatch | MetricRenderingProperties | Replaced by MetricConfig. |
| @aws-cdk/aws-cloudwatch | MetricRenderingProperties.period | Replaced by MetricConfig. |
| @aws-cdk/aws-cloudwatch | MetricRenderingProperties.color | Replaced by MetricConfig. |
| @aws-cdk/aws-cloudwatch | MetricRenderingProperties.label | Replaced by MetricConfig. |
| @aws-cdk/aws-cloudwatch | MetricRenderingProperties.stat | Replaced by MetricConfig. |
| @aws-cdk/aws-events | EventBus.grantPutEvents() | use grantAllPutEvents instead |
| @aws-cdk/aws-events | RuleTargetConfig.id | no replacement. we will always use an autogenerated id. |
| @aws-cdk/aws-ec2 | InterfaceVpcEndpoint.securityGroupId | use the `connections` object |
| @aws-cdk/aws-ec2 | InterfaceVpcEndpointAttributes.securityGroupId | use `securityGroups` instead |
| @aws-cdk/aws-ec2 | NatInstanceProps.allowAllTraffic | Use `defaultAllowedTraffic`. |
| @aws-cdk/aws-ec2 | SubnetSelection.subnetName | Use `subnetGroupName` instead |
| @aws-cdk/aws-ec2 | Vpc.natDependencies | This value is no longer used. |
| @aws-cdk/aws-ec2 | Vpc.addDynamoDbEndpoint() | use `addGatewayEndpoint()` instead |
| @aws-cdk/aws-ec2 | Vpc.addS3Endpoint() | use `addGatewayEndpoint()` instead |
| @aws-cdk/aws-ec2 | VpcEndpointService.whitelistedPrincipals | use `allowedPrincipals` |
| @aws-cdk/aws-ec2 | VpcEndpointServiceProps.vpcEndpointServiceName | This property is not used |
| @aws-cdk/aws-ec2 | VpcEndpointServiceProps.whitelistedPrincipals | use `allowedPrincipals` |
| @aws-cdk/aws-ec2 | WindowsVersion.WINDOWS_SERVER_2016_GERMAL_FULL_BASE | use WINDOWS_SERVER_2016_GERMAN_FULL_BASE |
| @aws-cdk/aws-ec2 | WindowsVersion.WINDOWS_SERVER_2012_R2_SP1_PORTUGESE_BRAZIL_64BIT_CORE | use WINDOWS_SERVER_2012_R2_SP1_PORTUGUESE_BRAZIL_64BIT_CORE |
| @aws-cdk/aws-ec2 | WindowsVersion.WINDOWS_SERVER_2016_PORTUGESE_PORTUGAL_FULL_BASE | use WINDOWS_SERVER_2016_PORTUGUESE_PORTUGAL_FULL_BASE |
| @aws-cdk/aws-ec2 | WindowsVersion.WINDOWS_SERVER_2012_R2_RTM_PORTUGESE_BRAZIL_64BIT_BASE | use WINDOWS_SERVER_2012_R2_RTM_PORTUGUESE_BRAZIL_64BIT_BASE |
| @aws-cdk/aws-ec2 | WindowsVersion.WINDOWS_SERVER_2012_R2_RTM_PORTUGESE_PORTUGAL_64BIT_BASE | use WINDOWS_SERVER_2012_R2_RTM_PORTUGUESE_PORTUGAL_64BIT_BASE |
| @aws-cdk/aws-ec2 | WindowsVersion.WINDOWS_SERVER_2016_PORTUGESE_BRAZIL_FULL_BASE | use WINDOWS_SERVER_2016_PORTUGUESE_BRAZIL_FULL_BASE |
| @aws-cdk/aws-ec2 | WindowsVersion.WINDOWS_SERVER_2012_SP2_PORTUGESE_BRAZIL_64BIT_BASE | use WINDOWS_SERVER_2012_SP2_PORTUGUESE_BRAZIL_64BIT_BASE |
| @aws-cdk/aws-ec2 | WindowsVersion.WINDOWS_SERVER_2012_RTM_PORTUGESE_BRAZIL_64BIT_BASE | use WINDOWS_SERVER_2012_RTM_PORTUGUESE_BRAZIL_64BIT_BASE |
| @aws-cdk/aws-ec2 | WindowsVersion.WINDOWS_SERVER_2008_R2_SP1_PORTUGESE_BRAZIL_64BIT_BASE | use WINDOWS_SERVER_2008_R2_SP1_PORTUGUESE_BRAZIL_64BIT_BASE |
| @aws-cdk/aws-ec2 | WindowsVersion.WINDOWS_SERVER_2008_SP2_PORTUGESE_BRAZIL_32BIT_BASE | use WINDOWS_SERVER_2008_SP2_PORTUGUESE_BRAZIL_32BIT_BASE |
| @aws-cdk/aws-ec2 | WindowsVersion.WINDOWS_SERVER_2012_RTM_PORTUGESE_PORTUGAL_64BIT_BASE | use WINDOWS_SERVER_2012_RTM_PORTUGUESE_PORTUGAL_64BIT_BASE |
| @aws-cdk/aws-ec2 | WindowsVersion.WINDOWS_SERVER_2019_PORTUGESE_BRAZIL_FULL_BASE | use WINDOWS_SERVER_2019_PORTUGUESE_BRAZIL_FULL_BASE |
| @aws-cdk/aws-ec2 | WindowsVersion.WINDOWS_SERVER_2019_PORTUGESE_PORTUGAL_FULL_BASE | use WINDOWS_SERVER_2019_PORTUGUESE_PORTUGAL_FULL_BASE |
| @aws-cdk/aws-s3-assets | Asset.s3Url | use `httpUrl` |
| @aws-cdk/aws-s3-assets | Asset.sourceHash | see `assetHash` |
| @aws-cdk/aws-s3-assets | AssetOptions.sourceHash | see `assetHash` and `assetHashType` |
| @aws-cdk/aws-ecr-assets | DockerImageAsset.sourceHash | use assetHash |
| @aws-cdk/aws-ecr-assets | DockerImageAssetOptions.repositoryName | to control the location of docker image assets, please override `Stack.addDockerImageAsset`. this feature will be removed in future releases. |
| @aws-cdk/aws-secretsmanager | AttachedSecretOptions | use `secret.attach()` instead |
| @aws-cdk/aws-secretsmanager | AttachedSecretOptions.target | use `secret.attach()` instead |
| @aws-cdk/aws-secretsmanager | AttachmentTargetType.INSTANCE | use RDS_DB_INSTANCE instead |
| @aws-cdk/aws-secretsmanager | AttachmentTargetType.CLUSTER | use RDS_DB_CLUSTER instead |
| @aws-cdk/aws-secretsmanager | Secret.fromSecretArn() | use `fromSecretCompleteArn` or `fromSecretPartialArn` |
| @aws-cdk/aws-secretsmanager | Secret.fromSecretName() | use `fromSecretNameV2` |
| @aws-cdk/aws-secretsmanager | Secret.addTargetAttachment() | use `attach()` instead |
| @aws-cdk/aws-secretsmanager | SecretAttributes.secretArn | use `secretCompleteArn` or `secretPartialArn` instead. |
| @aws-cdk/aws-lambda | Code.isInline | this value is ignored since inline is now determined based on the the `inlineCode` field of `CodeConfig` returned from `bind()`. |
| @aws-cdk/aws-lambda | Code.asset() | use `fromAsset` |
| @aws-cdk/aws-lambda | Code.bucket() | use `fromBucket` |
| @aws-cdk/aws-lambda | Code.cfnParameters() | use `fromCfnParameters` |
| @aws-cdk/aws-lambda | Code.inline() | use `fromInline` |
| @aws-cdk/aws-lambda | Function.addVersion() | This method will create an AWS::Lambda::Version resource which snapshots the AWS Lambda function *at the time of its creation* and it won't get updated when the function changes. Instead, use `this.currentVersion` to obtain a reference to a version resource that gets automatically recreated when the function configuration (or code) changes. |
| @aws-cdk/aws-lambda | FunctionAttributes.securityGroupId | use `securityGroup` instead |
| @aws-cdk/aws-lambda | FunctionOptions.securityGroup | This property is deprecated, use securityGroups instead |
| @aws-cdk/aws-lambda | LogRetention | use `LogRetention` from ' |
| @aws-cdk/aws-lambda | LogRetentionProps | use `LogRetentionProps` from ' |
| @aws-cdk/aws-lambda | Runtime.bundlingDockerImage | use `bundlingImage` |
| @aws-cdk/aws-apigateway | CfnApiMappingV2 | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnApiMappingV2.CFN_RESOURCE_TYPE_NAME | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnApiMappingV2.cfnProperties | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnApiMappingV2.apiId | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnApiMappingV2.domainName | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnApiMappingV2.stage | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnApiMappingV2.apiMappingKey | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnApiMappingV2.inspect() | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnApiMappingV2.renderProperties() | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnApiMappingV2Props | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnApiMappingV2Props.apiId | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnApiMappingV2Props.domainName | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnApiMappingV2Props.stage | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnApiMappingV2Props.apiMappingKey | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnApiV2 | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnApiV2.CFN_RESOURCE_TYPE_NAME | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnApiV2.cfnProperties | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnApiV2.tags | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnApiV2.body | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnApiV2.apiKeySelectionExpression | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnApiV2.basePath | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnApiV2.bodyS3Location | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnApiV2.corsConfiguration | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnApiV2.credentialsArn | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnApiV2.description | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnApiV2.disableSchemaValidation | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnApiV2.failOnWarnings | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnApiV2.name | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnApiV2.protocolType | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnApiV2.routeKey | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnApiV2.routeSelectionExpression | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnApiV2.target | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnApiV2.version | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnApiV2.inspect() | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnApiV2.renderProperties() | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | BodyS3LocationProperty | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | BodyS3LocationProperty.bucket | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | BodyS3LocationProperty.etag | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | BodyS3LocationProperty.key | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | BodyS3LocationProperty.version | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CorsProperty | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CorsProperty.allowCredentials | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CorsProperty.allowHeaders | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CorsProperty.allowMethods | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CorsProperty.allowOrigins | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CorsProperty.exposeHeaders | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CorsProperty.maxAge | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnApiV2Props | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnApiV2Props.apiKeySelectionExpression | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnApiV2Props.basePath | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnApiV2Props.body | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnApiV2Props.bodyS3Location | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnApiV2Props.corsConfiguration | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnApiV2Props.credentialsArn | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnApiV2Props.description | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnApiV2Props.disableSchemaValidation | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnApiV2Props.failOnWarnings | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnApiV2Props.name | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnApiV2Props.protocolType | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnApiV2Props.routeKey | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnApiV2Props.routeSelectionExpression | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnApiV2Props.tags | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnApiV2Props.target | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnApiV2Props.version | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnAuthorizerV2 | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnAuthorizerV2.CFN_RESOURCE_TYPE_NAME | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnAuthorizerV2.cfnProperties | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnAuthorizerV2.apiId | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnAuthorizerV2.authorizerType | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnAuthorizerV2.identitySource | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnAuthorizerV2.name | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnAuthorizerV2.authorizerCredentialsArn | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnAuthorizerV2.authorizerResultTtlInSeconds | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnAuthorizerV2.authorizerUri | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnAuthorizerV2.identityValidationExpression | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnAuthorizerV2.jwtConfiguration | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnAuthorizerV2.inspect() | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnAuthorizerV2.renderProperties() | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | JWTConfigurationProperty | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | JWTConfigurationProperty.audience | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | JWTConfigurationProperty.issuer | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnAuthorizerV2Props | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnAuthorizerV2Props.apiId | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnAuthorizerV2Props.authorizerType | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnAuthorizerV2Props.identitySource | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnAuthorizerV2Props.name | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnAuthorizerV2Props.authorizerCredentialsArn | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnAuthorizerV2Props.authorizerResultTtlInSeconds | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnAuthorizerV2Props.authorizerUri | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnAuthorizerV2Props.identityValidationExpression | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnAuthorizerV2Props.jwtConfiguration | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnDeploymentV2 | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnDeploymentV2.CFN_RESOURCE_TYPE_NAME | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnDeploymentV2.cfnProperties | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnDeploymentV2.apiId | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnDeploymentV2.description | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnDeploymentV2.stageName | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnDeploymentV2.inspect() | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnDeploymentV2.renderProperties() | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnDeploymentV2Props | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnDeploymentV2Props.apiId | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnDeploymentV2Props.description | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnDeploymentV2Props.stageName | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnDomainNameV2 | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnDomainNameV2.CFN_RESOURCE_TYPE_NAME | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnDomainNameV2.attrRegionalDomainName | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnDomainNameV2.attrRegionalHostedZoneId | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnDomainNameV2.cfnProperties | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnDomainNameV2.tags | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnDomainNameV2.domainName | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnDomainNameV2.domainNameConfigurations | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnDomainNameV2.inspect() | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnDomainNameV2.renderProperties() | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | DomainNameConfigurationProperty | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | DomainNameConfigurationProperty.certificateArn | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | DomainNameConfigurationProperty.certificateName | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | DomainNameConfigurationProperty.endpointType | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnDomainNameV2Props | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnDomainNameV2Props.domainName | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnDomainNameV2Props.domainNameConfigurations | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnDomainNameV2Props.tags | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnIntegrationResponseV2 | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnIntegrationResponseV2.CFN_RESOURCE_TYPE_NAME | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnIntegrationResponseV2.cfnProperties | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnIntegrationResponseV2.apiId | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnIntegrationResponseV2.integrationId | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnIntegrationResponseV2.integrationResponseKey | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnIntegrationResponseV2.responseParameters | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnIntegrationResponseV2.responseTemplates | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnIntegrationResponseV2.contentHandlingStrategy | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnIntegrationResponseV2.templateSelectionExpression | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnIntegrationResponseV2.inspect() | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnIntegrationResponseV2.renderProperties() | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnIntegrationResponseV2Props | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnIntegrationResponseV2Props.apiId | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnIntegrationResponseV2Props.integrationId | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnIntegrationResponseV2Props.integrationResponseKey | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnIntegrationResponseV2Props.contentHandlingStrategy | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnIntegrationResponseV2Props.responseParameters | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnIntegrationResponseV2Props.responseTemplates | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnIntegrationResponseV2Props.templateSelectionExpression | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnIntegrationV2 | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnIntegrationV2.CFN_RESOURCE_TYPE_NAME | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnIntegrationV2.cfnProperties | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnIntegrationV2.apiId | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnIntegrationV2.integrationType | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnIntegrationV2.requestParameters | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnIntegrationV2.requestTemplates | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnIntegrationV2.connectionType | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnIntegrationV2.contentHandlingStrategy | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnIntegrationV2.credentialsArn | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnIntegrationV2.description | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnIntegrationV2.integrationMethod | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnIntegrationV2.integrationUri | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnIntegrationV2.passthroughBehavior | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnIntegrationV2.payloadFormatVersion | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnIntegrationV2.templateSelectionExpression | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnIntegrationV2.timeoutInMillis | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnIntegrationV2.inspect() | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnIntegrationV2.renderProperties() | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnIntegrationV2Props | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnIntegrationV2Props.apiId | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnIntegrationV2Props.integrationType | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnIntegrationV2Props.connectionType | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnIntegrationV2Props.contentHandlingStrategy | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnIntegrationV2Props.credentialsArn | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnIntegrationV2Props.description | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnIntegrationV2Props.integrationMethod | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnIntegrationV2Props.integrationUri | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnIntegrationV2Props.passthroughBehavior | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnIntegrationV2Props.payloadFormatVersion | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnIntegrationV2Props.requestParameters | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnIntegrationV2Props.requestTemplates | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnIntegrationV2Props.templateSelectionExpression | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnIntegrationV2Props.timeoutInMillis | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnModelV2 | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnModelV2.CFN_RESOURCE_TYPE_NAME | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnModelV2.cfnProperties | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnModelV2.apiId | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnModelV2.name | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnModelV2.schema | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnModelV2.contentType | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnModelV2.description | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnModelV2.inspect() | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnModelV2.renderProperties() | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnModelV2Props | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnModelV2Props.apiId | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnModelV2Props.name | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnModelV2Props.schema | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnModelV2Props.contentType | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnModelV2Props.description | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnRouteResponseV2 | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnRouteResponseV2.CFN_RESOURCE_TYPE_NAME | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnRouteResponseV2.cfnProperties | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnRouteResponseV2.apiId | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnRouteResponseV2.responseModels | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnRouteResponseV2.responseParameters | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnRouteResponseV2.routeId | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnRouteResponseV2.routeResponseKey | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnRouteResponseV2.modelSelectionExpression | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnRouteResponseV2.inspect() | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnRouteResponseV2.renderProperties() | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | ParameterConstraintsProperty | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | ParameterConstraintsProperty.required | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnRouteResponseV2Props | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnRouteResponseV2Props.apiId | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnRouteResponseV2Props.routeId | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnRouteResponseV2Props.routeResponseKey | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnRouteResponseV2Props.modelSelectionExpression | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnRouteResponseV2Props.responseModels | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnRouteResponseV2Props.responseParameters | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnRouteV2 | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnRouteV2.CFN_RESOURCE_TYPE_NAME | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnRouteV2.cfnProperties | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnRouteV2.apiId | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnRouteV2.requestModels | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnRouteV2.requestParameters | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnRouteV2.routeKey | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnRouteV2.apiKeyRequired | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnRouteV2.authorizationScopes | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnRouteV2.authorizationType | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnRouteV2.authorizerId | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnRouteV2.modelSelectionExpression | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnRouteV2.operationName | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnRouteV2.routeResponseSelectionExpression | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnRouteV2.target | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnRouteV2.inspect() | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnRouteV2.renderProperties() | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | ParameterConstraintsProperty | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | ParameterConstraintsProperty.required | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnRouteV2Props | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnRouteV2Props.apiId | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnRouteV2Props.routeKey | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnRouteV2Props.apiKeyRequired | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnRouteV2Props.authorizationScopes | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnRouteV2Props.authorizationType | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnRouteV2Props.authorizerId | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnRouteV2Props.modelSelectionExpression | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnRouteV2Props.operationName | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnRouteV2Props.requestModels | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnRouteV2Props.requestParameters | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnRouteV2Props.routeResponseSelectionExpression | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnRouteV2Props.target | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnStageV2 | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnStageV2.CFN_RESOURCE_TYPE_NAME | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnStageV2.cfnProperties | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnStageV2.tags | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnStageV2.apiId | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnStageV2.routeSettings | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnStageV2.stageName | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnStageV2.stageVariables | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnStageV2.accessLogSettings | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnStageV2.autoDeploy | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnStageV2.clientCertificateId | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnStageV2.defaultRouteSettings | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnStageV2.deploymentId | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnStageV2.description | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnStageV2.inspect() | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnStageV2.renderProperties() | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | AccessLogSettingsProperty | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | AccessLogSettingsProperty.destinationArn | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | AccessLogSettingsProperty.format | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | RouteSettingsProperty | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | RouteSettingsProperty.dataTraceEnabled | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | RouteSettingsProperty.detailedMetricsEnabled | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | RouteSettingsProperty.loggingLevel | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | RouteSettingsProperty.throttlingBurstLimit | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | RouteSettingsProperty.throttlingRateLimit | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnStageV2Props | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnStageV2Props.apiId | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnStageV2Props.stageName | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnStageV2Props.accessLogSettings | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnStageV2Props.autoDeploy | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnStageV2Props.clientCertificateId | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnStageV2Props.defaultRouteSettings | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnStageV2Props.deploymentId | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnStageV2Props.description | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnStageV2Props.routeSettings | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnStageV2Props.stageVariables | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | CfnStageV2Props.tags | moved to package aws-apigatewayv2 |
| @aws-cdk/aws-apigateway | EmptyModel | You should use |
| @aws-cdk/aws-apigateway | EmptyModel.modelId | You should use |
| @aws-cdk/aws-apigateway | ErrorModel | You should use |
| @aws-cdk/aws-apigateway | ErrorModel.modelId | You should use |
| @aws-cdk/aws-apigateway | IResource.restApi | Throws an error if this Resource is not associated with an instance of `RestApi`. Use `api` instead. |
| @aws-cdk/aws-apigateway | LambdaRestApiProps.options | the `LambdaRestApiProps` now extends `RestApiProps`, so all options are just available here. Note that the options specified in `options` will be overridden by any props specified at the root level. |
| @aws-cdk/aws-apigateway | Method.restApi | Throws an error if this Resource is not associated with an instance of `RestApi`. Use `api` instead. |
| @aws-cdk/aws-apigateway | Resource.restApi | Throws an error if this Resource is not associated with an instance of `RestApi`. Use `api` instead. |
| @aws-cdk/aws-apigateway | ResourceBase.restApi | Throws an error if this Resource is not associated with an instance of `RestApi`. Use `api` instead. |
| @aws-cdk/aws-apigateway | ResourceBase.url | Throws error in some use cases that have been enabled since this deprecation notice. Use `RestApi.urlForPath()` instead. |
| @aws-cdk/aws-apigateway | RestApiBase.configureCloudWatchRole() | This method will be made internal. No replacement |
| @aws-cdk/aws-apigateway | RestApiBase.configureDeployment() | This method will be made internal. No replacement |
| @aws-cdk/aws-apigateway | RestApiOptions | superseded by `RestApiBaseProps` |
| @aws-cdk/aws-apigateway | UsagePlanProps.apiKey | use `addApiKey()` |
| @aws-cdk/aws-certificatemanager | CertificateProps.validationDomains | use `validation` instead. |
| @aws-cdk/aws-certificatemanager | CertificateProps.validationMethod | use `validation` instead. |
| @aws-cdk/aws-route53 | AddressRecordTarget | Use RecordTarget |
| @aws-cdk/custom-resources | Provider.bind() | use `provider.serviceToken` instead |
| @aws-cdk/aws-cloudformation | CloudFormationCapabilities | use `core.CfnCapabilities` |
| @aws-cdk/aws-cloudformation | CloudFormationCapabilities.NONE | use `core.CfnCapabilities` |
| @aws-cdk/aws-cloudformation | CloudFormationCapabilities.ANONYMOUS_IAM | use `core.CfnCapabilities` |
| @aws-cdk/aws-cloudformation | CloudFormationCapabilities.NAMED_IAM | use `core.CfnCapabilities` |
| @aws-cdk/aws-cloudformation | CloudFormationCapabilities.AUTO_EXPAND | use `core.CfnCapabilities` |
| @aws-cdk/aws-cloudformation | CustomResource | use `core.CustomResource` |
| @aws-cdk/aws-cloudformation | CustomResourceProps | use `core.CustomResourceProps` |
| @aws-cdk/aws-cloudformation | CustomResourceProps.provider | use `core.CustomResourceProps` |
| @aws-cdk/aws-cloudformation | CustomResourceProps.properties | use `core.CustomResourceProps` |
| @aws-cdk/aws-cloudformation | CustomResourceProps.removalPolicy | use `core.CustomResourceProps` |
| @aws-cdk/aws-cloudformation | CustomResourceProps.resourceType | use `core.CustomResourceProps` |
| @aws-cdk/aws-cloudformation | CustomResourceProvider | use core.CustomResource instead |
| @aws-cdk/aws-cloudformation | CustomResourceProvider.serviceToken | use core.CustomResource instead |
| @aws-cdk/aws-cloudformation | CustomResourceProvider.fromLambda() | use core.CustomResource instead |
| @aws-cdk/aws-cloudformation | CustomResourceProvider.fromTopic() | use core.CustomResource instead |
| @aws-cdk/aws-cloudformation | CustomResourceProvider.lambda() | use `fromLambda` |
| @aws-cdk/aws-cloudformation | CustomResourceProvider.topic() | use `fromTopic` |
| @aws-cdk/aws-cloudformation | CustomResourceProvider.bind() | use core.CustomResource instead |
| @aws-cdk/aws-cloudformation | CustomResourceProviderConfig | used in {@link ICustomResourceProvider} which is now deprecated |
| @aws-cdk/aws-cloudformation | CustomResourceProviderConfig.serviceToken | used in {@link ICustomResourceProvider} which is now deprecated |
| @aws-cdk/aws-cloudformation | ICustomResourceProvider | use `core.ICustomResourceProvider` |
| @aws-cdk/aws-cloudformation | ICustomResourceProvider.bind() | use `core.ICustomResourceProvider` |
| @aws-cdk/aws-cloudformation | NestedStack | use core.NestedStack instead |
| @aws-cdk/aws-cloudformation | NestedStackProps | use core.NestedStackProps instead |
| @aws-cdk/aws-cloudformation | NestedStackProps.notifications | use core.NestedStackProps instead |
| @aws-cdk/aws-cloudformation | NestedStackProps.parameters | use core.NestedStackProps instead |
| @aws-cdk/aws-cloudformation | NestedStackProps.timeout | use core.NestedStackProps instead |
| @aws-cdk/aws-sns | NumericConditions.whitelist | use `allowlist` |
| @aws-cdk/aws-sns | StringConditions.blacklist | use `denylist` |
| @aws-cdk/aws-sns | StringConditions.whitelist | use `allowlist` |
| @aws-cdk/aws-elasticloadbalancingv2 | AddFixedResponseProps | Use `ApplicationListener.addAction` instead. |
| @aws-cdk/aws-elasticloadbalancingv2 | AddRedirectResponseProps | Use `ApplicationListener.addAction` instead. |
| @aws-cdk/aws-elasticloadbalancingv2 | AddRuleProps.hostHeader | Use `conditions` instead. |
| @aws-cdk/aws-elasticloadbalancingv2 | AddRuleProps.pathPattern | Use `conditions` instead. |
| @aws-cdk/aws-elasticloadbalancingv2 | AddRuleProps.pathPatterns | Use `conditions` instead. |
| @aws-cdk/aws-elasticloadbalancingv2 | ApplicationListener.addCertificateArns() | Use `addCertificates` instead. |
| @aws-cdk/aws-elasticloadbalancingv2 | ApplicationListener.addFixedResponse() | Use `addAction()` instead |
| @aws-cdk/aws-elasticloadbalancingv2 | ApplicationListener.addRedirectResponse() | Use `addAction()` instead |
| @aws-cdk/aws-elasticloadbalancingv2 | ApplicationListenerAttributes.securityGroupAllowsAllOutbound | use `securityGroup` instead |
| @aws-cdk/aws-elasticloadbalancingv2 | ApplicationListenerAttributes.securityGroupId | use `securityGroup` instead |
| @aws-cdk/aws-elasticloadbalancingv2 | ApplicationListenerCertificateProps.certificateArns | Use `certificates` instead. |
| @aws-cdk/aws-elasticloadbalancingv2 | ApplicationListenerRule.addFixedResponse() | Use configureAction instead |
| @aws-cdk/aws-elasticloadbalancingv2 | ApplicationListenerRule.addRedirectResponse() | Use configureAction instead |
| @aws-cdk/aws-elasticloadbalancingv2 | ApplicationListenerRule.addTargetGroup() | Use configureAction instead |
| @aws-cdk/aws-elasticloadbalancingv2 | ApplicationListenerRule.setCondition() | use `addCondition` instead. |
| @aws-cdk/aws-elasticloadbalancingv2 | ApplicationTargetGroup.import() | Use `fromTargetGroupAttributes` instead |
| @aws-cdk/aws-elasticloadbalancingv2 | BaseApplicationListenerProps.certificateArns | Use the `certificates` property instead |
| @aws-cdk/aws-elasticloadbalancingv2 | BaseApplicationListenerRuleProps.fixedResponse | Use `action` instead. |
| @aws-cdk/aws-elasticloadbalancingv2 | BaseApplicationListenerRuleProps.hostHeader | Use `conditions` instead. |
| @aws-cdk/aws-elasticloadbalancingv2 | BaseApplicationListenerRuleProps.pathPattern | Use `conditions` instead. |
| @aws-cdk/aws-elasticloadbalancingv2 | BaseApplicationListenerRuleProps.pathPatterns | Use `conditions` instead. |
| @aws-cdk/aws-elasticloadbalancingv2 | BaseApplicationListenerRuleProps.redirectResponse | Use `action` instead. |
| @aws-cdk/aws-elasticloadbalancingv2 | ContentType | superceded by `FixedResponseOptions`. |
| @aws-cdk/aws-elasticloadbalancingv2 | ContentType.TEXT_PLAIN | superceded by `FixedResponseOptions`. |
| @aws-cdk/aws-elasticloadbalancingv2 | ContentType.TEXT_CSS | superceded by `FixedResponseOptions`. |
| @aws-cdk/aws-elasticloadbalancingv2 | ContentType.TEXT_HTML | superceded by `FixedResponseOptions`. |
| @aws-cdk/aws-elasticloadbalancingv2 | ContentType.APPLICATION_JAVASCRIPT | superceded by `FixedResponseOptions`. |
| @aws-cdk/aws-elasticloadbalancingv2 | ContentType.APPLICATION_JSON | superceded by `FixedResponseOptions`. |
| @aws-cdk/aws-elasticloadbalancingv2 | FixedResponse | superceded by `ListenerAction.fixedResponse()`. |
| @aws-cdk/aws-elasticloadbalancingv2 | FixedResponse.statusCode | superceded by `ListenerAction.fixedResponse()`. |
| @aws-cdk/aws-elasticloadbalancingv2 | FixedResponse.contentType | superceded by `ListenerAction.fixedResponse()`. |
| @aws-cdk/aws-elasticloadbalancingv2 | FixedResponse.messageBody | superceded by `ListenerAction.fixedResponse()`. |
| @aws-cdk/aws-elasticloadbalancingv2 | IApplicationListener.addCertificateArns() | use `addCertificates()` |
| @aws-cdk/aws-elasticloadbalancingv2 | INetworkListenerCertificateProps | Use IListenerCertificate instead |
| @aws-cdk/aws-elasticloadbalancingv2 | InstanceTarget | Use IpTarget from the |
| @aws-cdk/aws-elasticloadbalancingv2 | InstanceTarget.attachToApplicationTargetGroup() | Use IpTarget from the |
| @aws-cdk/aws-elasticloadbalancingv2 | InstanceTarget.attachToNetworkTargetGroup() | Use IpTarget from the |
| @aws-cdk/aws-elasticloadbalancingv2 | IpTarget | Use IpTarget from the |
| @aws-cdk/aws-elasticloadbalancingv2 | IpTarget.attachToApplicationTargetGroup() | Use IpTarget from the |
| @aws-cdk/aws-elasticloadbalancingv2 | IpTarget.attachToNetworkTargetGroup() | Use IpTarget from the |
| @aws-cdk/aws-elasticloadbalancingv2 | NetworkLoadBalancer.metricHealthyHostCount() | use ``NetworkTargetGroup.metricHealthyHostCount`` instead |
| @aws-cdk/aws-elasticloadbalancingv2 | NetworkLoadBalancer.metricUnHealthyHostCount() | use ``NetworkTargetGroup.metricUnHealthyHostCount`` instead |
| @aws-cdk/aws-elasticloadbalancingv2 | NetworkTargetGroup.import() | Use `fromTargetGroupAttributes` instead |
| @aws-cdk/aws-elasticloadbalancingv2 | RedirectResponse | superceded by `ListenerAction.redirect()`. |
| @aws-cdk/aws-elasticloadbalancingv2 | RedirectResponse.statusCode | superceded by `ListenerAction.redirect()`. |
| @aws-cdk/aws-elasticloadbalancingv2 | RedirectResponse.host | superceded by `ListenerAction.redirect()`. |
| @aws-cdk/aws-elasticloadbalancingv2 | RedirectResponse.path | superceded by `ListenerAction.redirect()`. |
| @aws-cdk/aws-elasticloadbalancingv2 | RedirectResponse.port | superceded by `ListenerAction.redirect()`. |
| @aws-cdk/aws-elasticloadbalancingv2 | RedirectResponse.protocol | superceded by `ListenerAction.redirect()`. |
| @aws-cdk/aws-elasticloadbalancingv2 | RedirectResponse.query | superceded by `ListenerAction.redirect()`. |
| @aws-cdk/aws-elasticloadbalancingv2 | TargetGroupAttributes.defaultPort | This property is unused and the wrong type. No need to use it. |
| @aws-cdk/aws-elasticloadbalancingv2 | TargetGroupImportProps | Use TargetGroupAttributes instead |
| @aws-cdk/aws-apigatewayv2 | IHttpApi.httpApiId | use apiId instead |
| @aws-cdk/aws-dynamodb | ITable.metricSystemErrors() | use `metricSystemErrorsForOperations` |
| @aws-cdk/aws-dynamodb | Table.grantListStreams() | Use {@link #grantTableListStreams} for more granular permission |
| @aws-cdk/aws-dynamodb | Table.metricSystemErrors() | use `metricSystemErrorsForOperations`. |
| @aws-cdk/aws-dynamodb | TableOptions.serverSideEncryption | This property is deprecated. In order to obtain the same behavior as enabling this, set the `encryption` property to `TableEncryption.AWS_MANAGED` instead. |
| @aws-cdk/aws-rds | Credentials.fromUsername() | use `fromGeneratedSecret()` or `fromPassword()` for new Clusters and Instances. Note that switching from `fromUsername()` to `fromGeneratedSecret()` or `fromPassword()` for already deployed Clusters or Instances will result in their replacement! |
| @aws-cdk/aws-rds | CredentialsFromUsernameOptions | supporting API `fromUsername()` has been deprecated. See deprecation notice of the API. |
| @aws-cdk/aws-rds | CredentialsFromUsernameOptions.password | supporting API `fromUsername()` has been deprecated. See deprecation notice of the API. |
| @aws-cdk/aws-rds | DatabaseInstanceEngine.MARIADB | using unversioned engines is an availability risk. We recommend using versioned engines created using the {@link mariaDb()} method |
| @aws-cdk/aws-rds | DatabaseInstanceEngine.MYSQL | using unversioned engines is an availability risk. We recommend using versioned engines created using the {@link mysql()} method |
| @aws-cdk/aws-rds | DatabaseInstanceEngine.ORACLE_EE | using unversioned engines is an availability risk. We recommend using versioned engines created using the {@link oracleEe()} method |
| @aws-cdk/aws-rds | DatabaseInstanceEngine.ORACLE_SE | instances can no longer be created with this engine. See https://forums.aws.amazon.com/ann.jspa?annID=7341 |
| @aws-cdk/aws-rds | DatabaseInstanceEngine.ORACLE_SE1 | instances can no longer be created with this engine. See https://forums.aws.amazon.com/ann.jspa?annID=7341 |
| @aws-cdk/aws-rds | DatabaseInstanceEngine.ORACLE_SE2 | using unversioned engines is an availability risk. We recommend using versioned engines created using the {@link oracleSe2()} method |
| @aws-cdk/aws-rds | DatabaseInstanceEngine.POSTGRES | using unversioned engines is an availability risk. We recommend using versioned engines created using the {@link postgres()} method |
| @aws-cdk/aws-rds | DatabaseInstanceEngine.SQL_SERVER_EE | using unversioned engines is an availability risk. We recommend using versioned engines created using the {@link sqlServerEe()} method |
| @aws-cdk/aws-rds | DatabaseInstanceEngine.SQL_SERVER_EX | using unversioned engines is an availability risk. We recommend using versioned engines created using the {@link sqlServerEx()} method |
| @aws-cdk/aws-rds | DatabaseInstanceEngine.SQL_SERVER_SE | using unversioned engines is an availability risk. We recommend using versioned engines created using the {@link sqlServerSe()} method |
| @aws-cdk/aws-rds | DatabaseInstanceEngine.SQL_SERVER_WEB | using unversioned engines is an availability risk. We recommend using versioned engines created using the {@link sqlServerWeb()} method |
| @aws-cdk/aws-rds | DatabaseInstanceEngine.oracleSe() | instances can no longer be created with this engine. See https://forums.aws.amazon.com/ann.jspa?annID=7341 |
| @aws-cdk/aws-rds | DatabaseInstanceEngine.oracleSe1() | instances can no longer be created with this engine. See https://forums.aws.amazon.com/ann.jspa?annID=7341 |
| @aws-cdk/aws-rds | DatabaseInstanceNewProps.vpcPlacement | use `vpcSubnets` |
| @aws-cdk/aws-rds | OracleLegacyEngineVersion | instances can no longer be created with these engine versions. See https://forums.aws.amazon.com/ann.jspa?annID=7341 |
| @aws-cdk/aws-rds | OracleLegacyEngineVersion.VER_11_2 | instances can no longer be created with these engine versions. See https://forums.aws.amazon.com/ann.jspa?annID=7341 |
| @aws-cdk/aws-rds | OracleLegacyEngineVersion.VER_11_2_0_2_V2 | instances can no longer be created with these engine versions. See https://forums.aws.amazon.com/ann.jspa?annID=7341 |
| @aws-cdk/aws-rds | OracleLegacyEngineVersion.VER_11_2_0_4_V1 | instances can no longer be created with these engine versions. See https://forums.aws.amazon.com/ann.jspa?annID=7341 |
| @aws-cdk/aws-rds | OracleLegacyEngineVersion.VER_11_2_0_4_V10 | instances can no longer be created with these engine versions. See https://forums.aws.amazon.com/ann.jspa?annID=7341 |
| @aws-cdk/aws-rds | OracleLegacyEngineVersion.VER_11_2_0_4_V11 | instances can no longer be created with these engine versions. See https://forums.aws.amazon.com/ann.jspa?annID=7341 |
| @aws-cdk/aws-rds | OracleLegacyEngineVersion.VER_11_2_0_4_V12 | instances can no longer be created with these engine versions. See https://forums.aws.amazon.com/ann.jspa?annID=7341 |
| @aws-cdk/aws-rds | OracleLegacyEngineVersion.VER_11_2_0_4_V13 | instances can no longer be created with these engine versions. See https://forums.aws.amazon.com/ann.jspa?annID=7341 |
| @aws-cdk/aws-rds | OracleLegacyEngineVersion.VER_11_2_0_4_V14 | instances can no longer be created with these engine versions. See https://forums.aws.amazon.com/ann.jspa?annID=7341 |
| @aws-cdk/aws-rds | OracleLegacyEngineVersion.VER_11_2_0_4_V15 | instances can no longer be created with these engine versions. See https://forums.aws.amazon.com/ann.jspa?annID=7341 |
| @aws-cdk/aws-rds | OracleLegacyEngineVersion.VER_11_2_0_4_V16 | instances can no longer be created with these engine versions. See https://forums.aws.amazon.com/ann.jspa?annID=7341 |
| @aws-cdk/aws-rds | OracleLegacyEngineVersion.VER_11_2_0_4_V17 | instances can no longer be created with these engine versions. See https://forums.aws.amazon.com/ann.jspa?annID=7341 |
| @aws-cdk/aws-rds | OracleLegacyEngineVersion.VER_11_2_0_4_V18 | instances can no longer be created with these engine versions. See https://forums.aws.amazon.com/ann.jspa?annID=7341 |
| @aws-cdk/aws-rds | OracleLegacyEngineVersion.VER_11_2_0_4_V19 | instances can no longer be created with these engine versions. See https://forums.aws.amazon.com/ann.jspa?annID=7341 |
| @aws-cdk/aws-rds | OracleLegacyEngineVersion.VER_11_2_0_4_V20 | instances can no longer be created with these engine versions. See https://forums.aws.amazon.com/ann.jspa?annID=7341 |
| @aws-cdk/aws-rds | OracleLegacyEngineVersion.VER_11_2_0_4_V21 | instances can no longer be created with these engine versions. See https://forums.aws.amazon.com/ann.jspa?annID=7341 |
| @aws-cdk/aws-rds | OracleLegacyEngineVersion.VER_11_2_0_4_V22 | instances can no longer be created with these engine versions. See https://forums.aws.amazon.com/ann.jspa?annID=7341 |
| @aws-cdk/aws-rds | OracleLegacyEngineVersion.VER_11_2_0_4_V23 | instances can no longer be created with these engine versions. See https://forums.aws.amazon.com/ann.jspa?annID=7341 |
| @aws-cdk/aws-rds | OracleLegacyEngineVersion.VER_11_2_0_4_V24 | instances can no longer be created with these engine versions. See https://forums.aws.amazon.com/ann.jspa?annID=7341 |
| @aws-cdk/aws-rds | OracleLegacyEngineVersion.VER_11_2_0_4_V25 | instances can no longer be created with these engine versions. See https://forums.aws.amazon.com/ann.jspa?annID=7341 |
| @aws-cdk/aws-rds | OracleLegacyEngineVersion.VER_11_2_0_4_V3 | instances can no longer be created with these engine versions. See https://forums.aws.amazon.com/ann.jspa?annID=7341 |
| @aws-cdk/aws-rds | OracleLegacyEngineVersion.VER_11_2_0_4_V4 | instances can no longer be created with these engine versions. See https://forums.aws.amazon.com/ann.jspa?annID=7341 |
| @aws-cdk/aws-rds | OracleLegacyEngineVersion.VER_11_2_0_4_V5 | instances can no longer be created with these engine versions. See https://forums.aws.amazon.com/ann.jspa?annID=7341 |
| @aws-cdk/aws-rds | OracleLegacyEngineVersion.VER_11_2_0_4_V6 | instances can no longer be created with these engine versions. See https://forums.aws.amazon.com/ann.jspa?annID=7341 |
| @aws-cdk/aws-rds | OracleLegacyEngineVersion.VER_11_2_0_4_V7 | instances can no longer be created with these engine versions. See https://forums.aws.amazon.com/ann.jspa?annID=7341 |
| @aws-cdk/aws-rds | OracleLegacyEngineVersion.VER_11_2_0_4_V8 | instances can no longer be created with these engine versions. See https://forums.aws.amazon.com/ann.jspa?annID=7341 |
| @aws-cdk/aws-rds | OracleLegacyEngineVersion.VER_11_2_0_4_V9 | instances can no longer be created with these engine versions. See https://forums.aws.amazon.com/ann.jspa?annID=7341 |
| @aws-cdk/aws-rds | OracleLegacyEngineVersion.oracleLegacyFullVersion | instances can no longer be created with these engine versions. See https://forums.aws.amazon.com/ann.jspa?annID=7341 |
| @aws-cdk/aws-rds | OracleLegacyEngineVersion.oracleLegacyMajorVersion | instances can no longer be created with these engine versions. See https://forums.aws.amazon.com/ann.jspa?annID=7341 |
| @aws-cdk/aws-rds | OracleSe1InstanceEngineProps | instances can no longer be created with this engine. See https://forums.aws.amazon.com/ann.jspa?annID=7341 |
| @aws-cdk/aws-rds | OracleSe1InstanceEngineProps.version | instances can no longer be created with this engine. See https://forums.aws.amazon.com/ann.jspa?annID=7341 |
| @aws-cdk/aws-rds | OracleSeInstanceEngineProps | instances can no longer be created with this engine. See https://forums.aws.amazon.com/ann.jspa?annID=7341 |
| @aws-cdk/aws-rds | OracleSeInstanceEngineProps.version | instances can no longer be created with this engine. See https://forums.aws.amazon.com/ann.jspa?annID=7341 |
| @aws-cdk/aws-rds | PostgresEngineVersion.VER_9_5 | PostgreSQL 9.5 will reach end of life on February 16, 2021 |
| @aws-cdk/aws-rds | PostgresEngineVersion.VER_9_5_10 | PostgreSQL 9.5 will reach end of life on February 16, 2021 |
| @aws-cdk/aws-rds | PostgresEngineVersion.VER_9_5_12 | PostgreSQL 9.5 will reach end of life on February 16, 2021 |
| @aws-cdk/aws-rds | PostgresEngineVersion.VER_9_5_13 | PostgreSQL 9.5 will reach end of life on February 16, 2021 |
| @aws-cdk/aws-rds | PostgresEngineVersion.VER_9_5_14 | PostgreSQL 9.5 will reach end of life on February 16, 2021 |
| @aws-cdk/aws-rds | PostgresEngineVersion.VER_9_5_15 | PostgreSQL 9.5 will reach end of life on February 16, 2021 |
| @aws-cdk/aws-rds | PostgresEngineVersion.VER_9_5_16 | PostgreSQL 9.5 will reach end of life on February 16, 2021 |
| @aws-cdk/aws-rds | PostgresEngineVersion.VER_9_5_18 | PostgreSQL 9.5 will reach end of life on February 16, 2021 |
| @aws-cdk/aws-rds | PostgresEngineVersion.VER_9_5_19 | PostgreSQL 9.5 will reach end of life on February 16, 2021 |
| @aws-cdk/aws-rds | PostgresEngineVersion.VER_9_5_2 | PostgreSQL 9.5 will reach end of life on February 16, 2021 |
| @aws-cdk/aws-rds | PostgresEngineVersion.VER_9_5_20 | PostgreSQL 9.5 will reach end of life on February 16, 2021 |
| @aws-cdk/aws-rds | PostgresEngineVersion.VER_9_5_21 | PostgreSQL 9.5 will reach end of life on February 16, 2021 |
| @aws-cdk/aws-rds | PostgresEngineVersion.VER_9_5_22 | PostgreSQL 9.5 will reach end of life on February 16, 2021 |
| @aws-cdk/aws-rds | PostgresEngineVersion.VER_9_5_23 | PostgreSQL 9.5 will reach end of life on February 16, 2021 |
| @aws-cdk/aws-rds | PostgresEngineVersion.VER_9_5_4 | PostgreSQL 9.5 will reach end of life on February 16, 2021 |
| @aws-cdk/aws-rds | PostgresEngineVersion.VER_9_5_6 | PostgreSQL 9.5 will reach end of life on February 16, 2021 |
| @aws-cdk/aws-rds | PostgresEngineVersion.VER_9_5_7 | PostgreSQL 9.5 will reach end of life on February 16, 2021 |
| @aws-cdk/aws-rds | PostgresEngineVersion.VER_9_5_9 | PostgreSQL 9.5 will reach end of life on February 16, 2021 |
| @aws-cdk/aws-rds | PostgresEngineVersion.VER_9_6 | PostgreSQL 9.6 will reach end of life in November 2021 |
| @aws-cdk/aws-rds | PostgresEngineVersion.VER_9_6_1 | PostgreSQL 9.6 will reach end of life in November 2021 |
| @aws-cdk/aws-rds | PostgresEngineVersion.VER_9_6_10 | PostgreSQL 9.6 will reach end of life in November 2021 |
| @aws-cdk/aws-rds | PostgresEngineVersion.VER_9_6_11 | PostgreSQL 9.6 will reach end of life in November 2021 |
| @aws-cdk/aws-rds | PostgresEngineVersion.VER_9_6_12 | PostgreSQL 9.6 will reach end of life in November 2021 |
| @aws-cdk/aws-rds | PostgresEngineVersion.VER_9_6_14 | PostgreSQL 9.6 will reach end of life in November 2021 |
| @aws-cdk/aws-rds | PostgresEngineVersion.VER_9_6_15 | PostgreSQL 9.6 will reach end of life in November 2021 |
| @aws-cdk/aws-rds | PostgresEngineVersion.VER_9_6_16 | PostgreSQL 9.6 will reach end of life in November 2021 |
| @aws-cdk/aws-rds | PostgresEngineVersion.VER_9_6_17 | PostgreSQL 9.6 will reach end of life in November 2021 |
| @aws-cdk/aws-rds | PostgresEngineVersion.VER_9_6_18 | PostgreSQL 9.6 will reach end of life in November 2021 |
| @aws-cdk/aws-rds | PostgresEngineVersion.VER_9_6_19 | PostgreSQL 9.6 will reach end of life in November 2021 |
| @aws-cdk/aws-rds | PostgresEngineVersion.VER_9_6_2 | PostgreSQL 9.6 will reach end of life in November 2021 |
| @aws-cdk/aws-rds | PostgresEngineVersion.VER_9_6_3 | PostgreSQL 9.6 will reach end of life in November 2021 |
| @aws-cdk/aws-rds | PostgresEngineVersion.VER_9_6_5 | PostgreSQL 9.6 will reach end of life in November 2021 |
| @aws-cdk/aws-rds | PostgresEngineVersion.VER_9_6_6 | PostgreSQL 9.6 will reach end of life in November 2021 |
| @aws-cdk/aws-rds | PostgresEngineVersion.VER_9_6_8 | PostgreSQL 9.6 will reach end of life in November 2021 |
| @aws-cdk/aws-rds | PostgresEngineVersion.VER_9_6_9 | PostgreSQL 9.6 will reach end of life in November 2021 |
| @aws-cdk/aws-rds | SnapshotCredentials.fromGeneratedPassword() | use `fromGeneratedSecret()` for new Clusters and Instances. Note that switching from `fromGeneratedPassword()` to `fromGeneratedSecret()` for already deployed Clusters or Instances will update their master password. |
| @aws-cdk/aws-autoscaling | BlockDevice.mappingEnabled | use `BlockDeviceVolume.noDevice()` as the volume to supress a mapping. |
| @aws-cdk/aws-autoscaling | CommonAutoScalingGroupProps.notificationsTopic | use `notifications` |
| @aws-cdk/aws-autoscaling | CommonAutoScalingGroupProps.replacingUpdateMinSuccessfulInstancesPercent | Use `signals` instead |
| @aws-cdk/aws-autoscaling | CommonAutoScalingGroupProps.resourceSignalCount | Use `signals` instead. |
| @aws-cdk/aws-autoscaling | CommonAutoScalingGroupProps.resourceSignalTimeout | Use `signals` instead. |
| @aws-cdk/aws-autoscaling | CommonAutoScalingGroupProps.rollingUpdateConfiguration | Use `updatePolicy` instead |
| @aws-cdk/aws-autoscaling | CommonAutoScalingGroupProps.updateType | Use `updatePolicy` instead |
| @aws-cdk/aws-autoscaling | RequestCountScalingProps.targetRequestsPerSecond | Use 'targetRequestsPerMinute' instead |
| @aws-cdk/aws-autoscaling | RollingUpdateConfiguration | use `UpdatePolicy.rollingUpdate()` |
| @aws-cdk/aws-autoscaling | RollingUpdateConfiguration.maxBatchSize | use `UpdatePolicy.rollingUpdate()` |
| @aws-cdk/aws-autoscaling | RollingUpdateConfiguration.minInstancesInService | use `UpdatePolicy.rollingUpdate()` |
| @aws-cdk/aws-autoscaling | RollingUpdateConfiguration.minSuccessfulInstancesPercent | use `UpdatePolicy.rollingUpdate()` |
| @aws-cdk/aws-autoscaling | RollingUpdateConfiguration.pauseTime | use `UpdatePolicy.rollingUpdate()` |
| @aws-cdk/aws-autoscaling | RollingUpdateConfiguration.suspendProcesses | use `UpdatePolicy.rollingUpdate()` |
| @aws-cdk/aws-autoscaling | RollingUpdateConfiguration.waitOnResourceSignals | use `UpdatePolicy.rollingUpdate()` |
| @aws-cdk/aws-autoscaling | UpdateType | Use UpdatePolicy instead |
| @aws-cdk/aws-autoscaling | UpdateType.NONE | Use UpdatePolicy instead |
| @aws-cdk/aws-autoscaling | UpdateType.REPLACING_UPDATE | Use UpdatePolicy instead |
| @aws-cdk/aws-autoscaling | UpdateType.ROLLING_UPDATE | Use UpdatePolicy instead |
| @aws-cdk/aws-elasticloadbalancing | LoadBalancerListener.sslCertificateId | use sslCertificateArn instead |
| @aws-cdk/aws-ecs | BaseService.configureAwsVpcNetworking() | use configureAwsVpcNetworkingWithSecurityGroups instead. |
| @aws-cdk/aws-ecs | Ec2ServiceProps.propagateTaskTagsFrom | Use `propagateTags` instead. |
| @aws-cdk/aws-ecs | Ec2ServiceProps.securityGroup | use securityGroups instead. |
| @aws-cdk/aws-ecs | EcsOptimizedAmi | see {@link EcsOptimizedImage#amazonLinux}, {@link EcsOptimizedImage#amazonLinux} and {@link EcsOptimizedImage#windows} |
| @aws-cdk/aws-ecs | EcsOptimizedAmi.getImage() | see {@link EcsOptimizedImage#amazonLinux}, {@link EcsOptimizedImage#amazonLinux} and {@link EcsOptimizedImage#windows} |
| @aws-cdk/aws-ecs | EcsOptimizedAmiProps | see {@link EcsOptimizedImage} |
| @aws-cdk/aws-ecs | EcsOptimizedAmiProps.generation | see {@link EcsOptimizedImage} |
| @aws-cdk/aws-ecs | EcsOptimizedAmiProps.hardwareType | see {@link EcsOptimizedImage} |
| @aws-cdk/aws-ecs | EcsOptimizedAmiProps.windowsVersion | see {@link EcsOptimizedImage} |
| @aws-cdk/aws-ecs | FargateServiceProps.propagateTaskTagsFrom | Use `propagateTags` instead. |
| @aws-cdk/aws-ecs | FargateServiceProps.securityGroup | use securityGroups instead. |
| @aws-cdk/aws-cloudfront | AliasConfiguration | see {@link CloudFrontWebDistributionProps#viewerCertificate} with {@link ViewerCertificate#acmCertificate} |
| @aws-cdk/aws-cloudfront | AliasConfiguration.acmCertRef | see {@link CloudFrontWebDistributionProps#viewerCertificate} with {@link ViewerCertificate#acmCertificate} |
| @aws-cdk/aws-cloudfront | AliasConfiguration.names | see {@link CloudFrontWebDistributionProps#viewerCertificate} with {@link ViewerCertificate#acmCertificate} |
| @aws-cdk/aws-cloudfront | AliasConfiguration.securityPolicy | see {@link CloudFrontWebDistributionProps#viewerCertificate} with {@link ViewerCertificate#acmCertificate} |
| @aws-cdk/aws-cloudfront | AliasConfiguration.sslMethod | see {@link CloudFrontWebDistributionProps#viewerCertificate} with {@link ViewerCertificate#acmCertificate} |
| @aws-cdk/aws-cloudfront | Behavior.trustedSigners | We recommend using trustedKeyGroups instead of trustedSigners. |
| @aws-cdk/aws-cloudfront | CloudFrontWebDistribution.domainName | Use `distributionDomainName` instead. |
| @aws-cdk/aws-cloudfront | CloudFrontWebDistributionProps.aliasConfiguration | see {@link CloudFrontWebDistributionProps#viewerCertificate} with {@link ViewerCertificate#acmCertificate} |
| @aws-cdk/aws-cloudfront | GeoRestriction.blacklist() | use `denylist` |
| @aws-cdk/aws-cloudfront | GeoRestriction.whitelist() | use `allowlist` |
| @aws-cdk/aws-cloudfront | IDistribution.domainName | Use `distributionDomainName` instead. |
| @aws-cdk/aws-cloudfront | SourceConfiguration.originHeaders | Use originHeaders on s3OriginSource or customOriginSource |
| @aws-cdk/aws-cloudfront | SourceConfiguration.originPath | Use originPath on s3OriginSource or customOriginSource |
| @aws-cdk/aws-cloudtrail | Trail.onCloudTrailEvent() | use Trail.onEvent() |
| @aws-cdk/aws-cloudtrail | TrailProps.kmsKey | use encryptionKey instead. |
| @aws-cdk/aws-codepipeline-actions | BitBucketSourceAction | use CodeStarConnectionsSourceAction instead |
| @aws-cdk/aws-codepipeline-actions | BitBucketSourceAction.actionProperties | use CodeStarConnectionsSourceAction instead |
| @aws-cdk/aws-codepipeline-actions | BitBucketSourceAction.bind() | use CodeStarConnectionsSourceAction instead |
| @aws-cdk/aws-codepipeline-actions | BitBucketSourceAction.onStateChange() | use CodeStarConnectionsSourceAction instead |
| @aws-cdk/aws-codepipeline-actions | BitBucketSourceActionProps | use CodeStarConnectionsSourceActionProps instead |
| @aws-cdk/aws-codepipeline-actions | CloudFormationCreateReplaceChangeSetActionProps.capabilities | use {@link cfnCapabilities} instead |
| @aws-cdk/aws-codepipeline-actions | CloudFormationCreateUpdateStackActionProps.capabilities | use {@link cfnCapabilities} instead |
| @aws-cdk/aws-codepipeline-actions | CloudFormationDeleteStackActionProps.capabilities | use {@link cfnCapabilities} instead |
| @aws-cdk/aws-events-targets | EcsTask.securityGroup | use securityGroups instead. |
| @aws-cdk/aws-events-targets | EcsTaskProps.securityGroup | use securityGroups instead |
| @aws-cdk/aws-stepfunctions | Context | replaced by `JsonPath` |
| @aws-cdk/aws-stepfunctions | Context.entireContext | replaced by `JsonPath` |
| @aws-cdk/aws-stepfunctions | Context.taskToken | replaced by `JsonPath` |
| @aws-cdk/aws-stepfunctions | Context.numberAt() | replaced by `JsonPath` |
| @aws-cdk/aws-stepfunctions | Context.stringAt() | replaced by `JsonPath` |
| @aws-cdk/aws-stepfunctions | Data | replaced by `JsonPath` |
| @aws-cdk/aws-stepfunctions | Data.entirePayload | replaced by `JsonPath` |
| @aws-cdk/aws-stepfunctions | Data.isJsonPathString() | replaced by `JsonPath` |
| @aws-cdk/aws-stepfunctions | Data.listAt() | replaced by `JsonPath` |
| @aws-cdk/aws-stepfunctions | Data.numberAt() | replaced by `JsonPath` |
| @aws-cdk/aws-stepfunctions | Data.stringAt() | replaced by `JsonPath` |
| @aws-cdk/aws-stepfunctions | IStepFunctionsTask | replaced by `TaskStateBase`. |
| @aws-cdk/aws-stepfunctions | IStepFunctionsTask.bind() | replaced by `TaskStateBase`. |
| @aws-cdk/aws-stepfunctions | StepFunctionsTaskConfig | used by `IStepFunctionsTask`. `IStepFunctionsTask` is deprecated and replaced by `TaskStateBase`. |
| @aws-cdk/aws-stepfunctions | StepFunctionsTaskConfig.resourceArn | used by `IStepFunctionsTask`. `IStepFunctionsTask` is deprecated and replaced by `TaskStateBase`. |
| @aws-cdk/aws-stepfunctions | StepFunctionsTaskConfig.heartbeat | used by `IStepFunctionsTask`. `IStepFunctionsTask` is deprecated and replaced by `TaskStateBase`. |
| @aws-cdk/aws-stepfunctions | StepFunctionsTaskConfig.metricDimensions | used by `IStepFunctionsTask`. `IStepFunctionsTask` is deprecated and replaced by `TaskStateBase`. |
| @aws-cdk/aws-stepfunctions | StepFunctionsTaskConfig.metricPrefixPlural | used by `IStepFunctionsTask`. `IStepFunctionsTask` is deprecated and replaced by `TaskStateBase`. |
| @aws-cdk/aws-stepfunctions | StepFunctionsTaskConfig.metricPrefixSingular | used by `IStepFunctionsTask`. `IStepFunctionsTask` is deprecated and replaced by `TaskStateBase`. |
| @aws-cdk/aws-stepfunctions | StepFunctionsTaskConfig.parameters | used by `IStepFunctionsTask`. `IStepFunctionsTask` is deprecated and replaced by `TaskStateBase`. |
| @aws-cdk/aws-stepfunctions | StepFunctionsTaskConfig.policyStatements | used by `IStepFunctionsTask`. `IStepFunctionsTask` is deprecated and replaced by `TaskStateBase`. |
| @aws-cdk/aws-stepfunctions | Task | replaced by service integration specific classes (i.e. LambdaInvoke, SnsPublish) |
| @aws-cdk/aws-stepfunctions | Task.endStates | replaced by service integration specific classes (i.e. LambdaInvoke, SnsPublish) |
| @aws-cdk/aws-stepfunctions | Task.addCatch() | replaced by service integration specific classes (i.e. LambdaInvoke, SnsPublish) |
| @aws-cdk/aws-stepfunctions | Task.addRetry() | replaced by service integration specific classes (i.e. LambdaInvoke, SnsPublish) |
| @aws-cdk/aws-stepfunctions | Task.metric() | replaced by service integration specific classes (i.e. LambdaInvoke, SnsPublish) |
| @aws-cdk/aws-stepfunctions | Task.metricFailed() | replaced by service integration specific classes (i.e. LambdaInvoke, SnsPublish) |
| @aws-cdk/aws-stepfunctions | Task.metricHeartbeatTimedOut() | replaced by service integration specific classes (i.e. LambdaInvoke, SnsPublish) |
| @aws-cdk/aws-stepfunctions | Task.metricRunTime() | replaced by service integration specific classes (i.e. LambdaInvoke, SnsPublish) |
| @aws-cdk/aws-stepfunctions | Task.metricScheduled() | replaced by service integration specific classes (i.e. LambdaInvoke, SnsPublish) |
| @aws-cdk/aws-stepfunctions | Task.metricScheduleTime() | replaced by service integration specific classes (i.e. LambdaInvoke, SnsPublish) |
| @aws-cdk/aws-stepfunctions | Task.metricStarted() | replaced by service integration specific classes (i.e. LambdaInvoke, SnsPublish) |
| @aws-cdk/aws-stepfunctions | Task.metricSucceeded() | replaced by service integration specific classes (i.e. LambdaInvoke, SnsPublish) |
| @aws-cdk/aws-stepfunctions | Task.metricTime() | replaced by service integration specific classes (i.e. LambdaInvoke, SnsPublish) |
| @aws-cdk/aws-stepfunctions | Task.metricTimedOut() | replaced by service integration specific classes (i.e. LambdaInvoke, SnsPublish) |
| @aws-cdk/aws-stepfunctions | Task.next() | replaced by service integration specific classes (i.e. LambdaInvoke, SnsPublish) |
| @aws-cdk/aws-stepfunctions | Task.toStateJson() | replaced by service integration specific classes (i.e. LambdaInvoke, SnsPublish) |
| @aws-cdk/aws-stepfunctions | Task.whenBoundToGraph() | replaced by service integration specific classes (i.e. LambdaInvoke, SnsPublish) |
| @aws-cdk/aws-stepfunctions | TaskProps | replaced by service integration specific classes (i.e. LambdaInvoke, SnsPublish) |
| @aws-cdk/aws-stepfunctions | TaskProps.task | replaced by service integration specific classes (i.e. LambdaInvoke, SnsPublish) |
| @aws-cdk/aws-stepfunctions | TaskProps.comment | replaced by service integration specific classes (i.e. LambdaInvoke, SnsPublish) |
| @aws-cdk/aws-stepfunctions | TaskProps.inputPath | replaced by service integration specific classes (i.e. LambdaInvoke, SnsPublish) |
| @aws-cdk/aws-stepfunctions | TaskProps.outputPath | replaced by service integration specific classes (i.e. LambdaInvoke, SnsPublish) |
| @aws-cdk/aws-stepfunctions | TaskProps.parameters | replaced by service integration specific classes (i.e. LambdaInvoke, SnsPublish) |
| @aws-cdk/aws-stepfunctions | TaskProps.resultPath | replaced by service integration specific classes (i.e. LambdaInvoke, SnsPublish) |
| @aws-cdk/aws-stepfunctions | TaskProps.timeout | replaced by service integration specific classes (i.e. LambdaInvoke, SnsPublish) |
| @aws-cdk/aws-ecs-patterns | ApplicationLoadBalancedServiceBase.desiredCount | Use `internalDesiredCount` instead. |
| @aws-cdk/aws-ecs-patterns | ApplicationMultipleTargetGroupsServiceBase.desiredCount | Use `internalDesiredCount` instead. |
| @aws-cdk/aws-ecs-patterns | NetworkLoadBalancedServiceBase.desiredCount | Use `internalDesiredCount` instead. |
| @aws-cdk/aws-ecs-patterns | NetworkMultipleTargetGroupsServiceBase.desiredCount | Use `internalDesiredCount` instead. |
| @aws-cdk/aws-ecs-patterns | QueueProcessingServiceBase.desiredCount | Use `minCapacity` instead. |
| @aws-cdk/aws-ecs-patterns | QueueProcessingServiceBaseProps.desiredTaskCount | Use `minScalingCapacity` or a literal object instead. |
| @aws-cdk/aws-eks | NodegroupOptions.instanceType | Use `instanceTypes` instead. |
| @aws-cdk/aws-eks | ServiceAccount.addToPolicy() | use `addToPrincipalPolicy()` |
| @aws-cdk/aws-s3-deployment | Expires | use core.Expiration |
| @aws-cdk/aws-s3-deployment | Expires.value | use core.Expiration |
| @aws-cdk/aws-s3-deployment | Expires.after() | use core.Expiration |
| @aws-cdk/aws-s3-deployment | Expires.atDate() | use core.Expiration |
| @aws-cdk/aws-s3-deployment | Expires.atTimestamp() | use core.Expiration |
| @aws-cdk/aws-s3-deployment | Expires.fromString() | use core.Expiration |
| @aws-cdk/aws-ses | WhiteListReceiptFilter | use `AllowListReceiptFilter` |
| @aws-cdk/aws-ses | WhiteListReceiptFilterProps | use `AllowListReceiptFilterProps` |
| @aws-cdk/aws-stepfunctions-tasks | EcsRunTaskBase | No replacement |
| @aws-cdk/aws-stepfunctions-tasks | EcsRunTaskBase.connections | No replacement |
| @aws-cdk/aws-stepfunctions-tasks | EcsRunTaskBase.bind() | No replacement |
| @aws-cdk/aws-stepfunctions-tasks | EcsRunTaskBase.configureAwsVpcNetworking() | No replacement |
| @aws-cdk/aws-stepfunctions-tasks | EcsRunTaskBaseProps | No replacement |
| @aws-cdk/aws-stepfunctions-tasks | EcsRunTaskBaseProps.parameters | No replacement |
| @aws-cdk/aws-stepfunctions-tasks | InvocationType | use `LambdaInvocationType` |
| @aws-cdk/aws-stepfunctions-tasks | InvocationType.REQUEST_RESPONSE | use `LambdaInvocationType` |
| @aws-cdk/aws-stepfunctions-tasks | InvocationType.EVENT | use `LambdaInvocationType` |
| @aws-cdk/aws-stepfunctions-tasks | InvocationType.DRY_RUN | use `LambdaInvocationType` |
| @aws-cdk/aws-stepfunctions-tasks | InvokeActivity | use `StepFunctionsInvokeActivity` |
| @aws-cdk/aws-stepfunctions-tasks | InvokeActivity.bind() | use `StepFunctionsInvokeActivity` |
| @aws-cdk/aws-stepfunctions-tasks | InvokeActivityProps | use `StepFunctionsInvokeActivity` and `StepFunctionsInvokeActivityProps`. |
| @aws-cdk/aws-stepfunctions-tasks | InvokeActivityProps.heartbeat | use `StepFunctionsInvokeActivity` and `StepFunctionsInvokeActivityProps`. |
| @aws-cdk/aws-stepfunctions-tasks | InvokeFunction | Use `LambdaInvoke` |
| @aws-cdk/aws-stepfunctions-tasks | InvokeFunction.bind() | Use `LambdaInvoke` |
| @aws-cdk/aws-stepfunctions-tasks | InvokeFunctionProps | use `LambdaInvoke` |
| @aws-cdk/aws-stepfunctions-tasks | InvokeFunctionProps.payload | use `LambdaInvoke` |
| @aws-cdk/aws-stepfunctions-tasks | PublishToTopic | Use `SnsPublish` |
| @aws-cdk/aws-stepfunctions-tasks | PublishToTopic.bind() | Use `SnsPublish` |
| @aws-cdk/aws-stepfunctions-tasks | PublishToTopicProps | Use `SnsPublish` |
| @aws-cdk/aws-stepfunctions-tasks | PublishToTopicProps.message | Use `SnsPublish` |
| @aws-cdk/aws-stepfunctions-tasks | PublishToTopicProps.integrationPattern | Use `SnsPublish` |
| @aws-cdk/aws-stepfunctions-tasks | PublishToTopicProps.messagePerSubscriptionType | Use `SnsPublish` |
| @aws-cdk/aws-stepfunctions-tasks | PublishToTopicProps.subject | Use `SnsPublish` |
| @aws-cdk/aws-stepfunctions-tasks | RunBatchJob | use `BatchSubmitJob` |
| @aws-cdk/aws-stepfunctions-tasks | RunBatchJob.bind() | use `BatchSubmitJob` |
| @aws-cdk/aws-stepfunctions-tasks | RunBatchJobProps | use `BatchSubmitJob` |
| @aws-cdk/aws-stepfunctions-tasks | RunBatchJobProps.jobDefinitionArn | use `BatchSubmitJob` |
| @aws-cdk/aws-stepfunctions-tasks | RunBatchJobProps.jobName | use `BatchSubmitJob` |
| @aws-cdk/aws-stepfunctions-tasks | RunBatchJobProps.jobQueueArn | use `BatchSubmitJob` |
| @aws-cdk/aws-stepfunctions-tasks | RunBatchJobProps.arraySize | use `BatchSubmitJob` |
| @aws-cdk/aws-stepfunctions-tasks | RunBatchJobProps.attempts | use `BatchSubmitJob` |
| @aws-cdk/aws-stepfunctions-tasks | RunBatchJobProps.containerOverrides | use `BatchSubmitJob` |
| @aws-cdk/aws-stepfunctions-tasks | RunBatchJobProps.dependsOn | use `BatchSubmitJob` |
| @aws-cdk/aws-stepfunctions-tasks | RunBatchJobProps.integrationPattern | use `BatchSubmitJob` |
| @aws-cdk/aws-stepfunctions-tasks | RunBatchJobProps.payload | use `BatchSubmitJob` |
| @aws-cdk/aws-stepfunctions-tasks | RunBatchJobProps.timeout | use `BatchSubmitJob` |
| @aws-cdk/aws-stepfunctions-tasks | RunEcsEc2Task | replaced by `EcsRunTask` |
| @aws-cdk/aws-stepfunctions-tasks | RunEcsEc2TaskProps | use `EcsRunTask` and `EcsRunTaskProps` |
| @aws-cdk/aws-stepfunctions-tasks | RunEcsEc2TaskProps.placementConstraints | use `EcsRunTask` and `EcsRunTaskProps` |
| @aws-cdk/aws-stepfunctions-tasks | RunEcsEc2TaskProps.placementStrategies | use `EcsRunTask` and `EcsRunTaskProps` |
| @aws-cdk/aws-stepfunctions-tasks | RunEcsEc2TaskProps.securityGroup | use `EcsRunTask` and `EcsRunTaskProps` |
| @aws-cdk/aws-stepfunctions-tasks | RunEcsEc2TaskProps.subnets | use `EcsRunTask` and `EcsRunTaskProps` |
| @aws-cdk/aws-stepfunctions-tasks | RunEcsFargateTask | replaced by `EcsRunTask` |
| @aws-cdk/aws-stepfunctions-tasks | RunEcsFargateTaskProps | replaced by `EcsRunTask` and `EcsRunTaskProps` |
| @aws-cdk/aws-stepfunctions-tasks | RunEcsFargateTaskProps.assignPublicIp | replaced by `EcsRunTask` and `EcsRunTaskProps` |
| @aws-cdk/aws-stepfunctions-tasks | RunEcsFargateTaskProps.platformVersion | replaced by `EcsRunTask` and `EcsRunTaskProps` |
| @aws-cdk/aws-stepfunctions-tasks | RunEcsFargateTaskProps.securityGroup | replaced by `EcsRunTask` and `EcsRunTaskProps` |
| @aws-cdk/aws-stepfunctions-tasks | RunEcsFargateTaskProps.subnets | replaced by `EcsRunTask` and `EcsRunTaskProps` |
| @aws-cdk/aws-stepfunctions-tasks | RunGlueJobTask | use `GlueStartJobRun` |
| @aws-cdk/aws-stepfunctions-tasks | RunGlueJobTask.bind() | use `GlueStartJobRun` |
| @aws-cdk/aws-stepfunctions-tasks | RunGlueJobTaskProps | use `GlueStartJobRun` |
| @aws-cdk/aws-stepfunctions-tasks | RunGlueJobTaskProps.arguments | use `GlueStartJobRun` |
| @aws-cdk/aws-stepfunctions-tasks | RunGlueJobTaskProps.integrationPattern | use `GlueStartJobRun` |
| @aws-cdk/aws-stepfunctions-tasks | RunGlueJobTaskProps.notifyDelayAfter | use `GlueStartJobRun` |
| @aws-cdk/aws-stepfunctions-tasks | RunGlueJobTaskProps.securityConfiguration | use `GlueStartJobRun` |
| @aws-cdk/aws-stepfunctions-tasks | RunGlueJobTaskProps.timeout | use `GlueStartJobRun` |
| @aws-cdk/aws-stepfunctions-tasks | RunLambdaTask | Use `LambdaInvoke` |
| @aws-cdk/aws-stepfunctions-tasks | RunLambdaTask.bind() | Use `LambdaInvoke` |
| @aws-cdk/aws-stepfunctions-tasks | RunLambdaTaskProps | Use `LambdaInvoke` |
| @aws-cdk/aws-stepfunctions-tasks | RunLambdaTaskProps.clientContext | Use `LambdaInvoke` |
| @aws-cdk/aws-stepfunctions-tasks | RunLambdaTaskProps.integrationPattern | Use `LambdaInvoke` |
| @aws-cdk/aws-stepfunctions-tasks | RunLambdaTaskProps.invocationType | Use `LambdaInvoke` |
| @aws-cdk/aws-stepfunctions-tasks | RunLambdaTaskProps.payload | Use `LambdaInvoke` |
| @aws-cdk/aws-stepfunctions-tasks | RunLambdaTaskProps.qualifier | Use `LambdaInvoke` |
| @aws-cdk/aws-stepfunctions-tasks | SendToQueue | Use `SqsSendMessage` |
| @aws-cdk/aws-stepfunctions-tasks | SendToQueue.bind() | Use `SqsSendMessage` |
| @aws-cdk/aws-stepfunctions-tasks | SendToQueueProps | Use `SqsSendMessage` |
| @aws-cdk/aws-stepfunctions-tasks | SendToQueueProps.messageBody | Use `SqsSendMessage` |
| @aws-cdk/aws-stepfunctions-tasks | SendToQueueProps.delay | Use `SqsSendMessage` |
| @aws-cdk/aws-stepfunctions-tasks | SendToQueueProps.integrationPattern | Use `SqsSendMessage` |
| @aws-cdk/aws-stepfunctions-tasks | SendToQueueProps.messageDeduplicationId | Use `SqsSendMessage` |
| @aws-cdk/aws-stepfunctions-tasks | SendToQueueProps.messageGroupId | Use `SqsSendMessage` |
| @aws-cdk/aws-stepfunctions-tasks | StartExecution | use 'StepFunctionsStartExecution' |
| @aws-cdk/aws-stepfunctions-tasks | StartExecution.bind() | use 'StepFunctionsStartExecution' |
| @aws-cdk/aws-stepfunctions-tasks | StartExecutionProps | use 'StepFunctionsStartExecution' |
| @aws-cdk/aws-stepfunctions-tasks | StartExecutionProps.input | use 'StepFunctionsStartExecution' |
| @aws-cdk/aws-stepfunctions-tasks | StartExecutionProps.integrationPattern | use 'StepFunctionsStartExecution' |
| @aws-cdk/aws-stepfunctions-tasks | StartExecutionProps.name | use 'StepFunctionsStartExecution' |
| @aws-cdk/pipelines | SimpleSynthActionProps.buildCommand | Use `buildCommands` instead |
| @aws-cdk/pipelines | SimpleSynthActionProps.installCommand | Use `installCommands` instead |
