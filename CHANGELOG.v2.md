# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [2.0.0-rc.16](https://github.com/aws/aws-cdk/compare/v2.0.0-rc.15...v2.0.0-rc.16) (2021-08-04)

## [2.0.0-rc.15](https://github.com/aws/aws-cdk/compare/v2.0.0-rc.14...v2.0.0-rc.15) (2021-07-28)


### Features

* **lambda-nodejs:** source map mode ([#15621](https://github.com/aws/aws-cdk/issues/15621)) ([b934976](https://github.com/aws/aws-cdk/commit/b934976f057cd395de660dc4099e2303415cdc78)), closes [#14857](https://github.com/aws/aws-cdk/issues/14857)
* **rds:** allow setting copyTagsToSnapshot on Clusters ([#15553](https://github.com/aws/aws-cdk/issues/15553)) ([f7c6289](https://github.com/aws/aws-cdk/commit/f7c628948e7f71df7a95cb00cdc2746e2e46dc03)), closes [#15521](https://github.com/aws/aws-cdk/issues/15521)


### Bug Fixes

* **iam:** `PrincipalWithConditions.addCondition` does not work ([#15414](https://github.com/aws/aws-cdk/issues/15414)) ([fdce08c](https://github.com/aws/aws-cdk/commit/fdce08cee6f0eb58aad93572641a1dd4b59e8d37))

## [2.0.0-rc.14](https://github.com/aws/aws-cdk/compare/v2.0.0-rc.13...v2.0.0-rc.14) (2021-07-21)

## [2.0.0-rc.13](https://github.com/aws/aws-cdk/compare/v2.0.0-rc.12...v2.0.0-rc.13) (2021-07-20)

## [2.0.0-rc.12](https://github.com/aws/aws-cdk/compare/v2.0.0-rc.11...v2.0.0-rc.12) (2021-07-14)

### ⚠ BREAKING CHANGES TO EXPERIMENTAL FEATURES

- **appmesh**: static methods from `TlsCertificate` have been changed to accept positional arguments
- **appmesh**: the type `TlsListener` has been renamed to `ListenerTlsOptions`

### Features

* **apigateway:** disable execute api endpoint ([#14526](https://github.com/aws/aws-cdk/issues/14526)) ([b3a7d5b](https://github.com/aws/aws-cdk/commit/b3a7d5ba67bec09e422c0c843d7dee4653fe9aec))
* **aws-backup:** Add arn attribute and grant method to backup vault ([#14997](https://github.com/aws/aws-cdk/issues/14997)) ([04c0a07](https://github.com/aws/aws-cdk/commit/04c0a076c842683280dc1dc483cfc605641bd0fa)), closes [#14996](https://github.com/aws/aws-cdk/issues/14996)
* **cdk-assets:** externally-configured Docker credentials ([#15290](https://github.com/aws/aws-cdk/issues/15290)) ([e530195](https://github.com/aws/aws-cdk/commit/e530195c352c74d3bd3f297c9bf923c35d1ed013)), closes [#10999](https://github.com/aws/aws-cdk/issues/10999) [#11774](https://github.com/aws/aws-cdk/issues/11774)
* **cfnspec:** cloudformation spec v38.0.0 ([#15044](https://github.com/aws/aws-cdk/issues/15044)) ([271d948](https://github.com/aws/aws-cdk/commit/271d948883c7b26d2afd773ae1b3b05478bb6abd))
* **cfnspec:** cloudformation spec v38.0.0 ([#15044](https://github.com/aws/aws-cdk/issues/15044)) ([632d518](https://github.com/aws/aws-cdk/commit/632d518f7de772aeac3f25f32f89e0406e6ddb33))
* **cfnspec:** cloudformation spec v39.1.0 ([#15144](https://github.com/aws/aws-cdk/issues/15144)) ([abc457e](https://github.com/aws/aws-cdk/commit/abc457e40396e5863ba460fd8a3bcce0da3ef385))
* **cfnspec:** cloudformation spec v39.3.0 ([#15311](https://github.com/aws/aws-cdk/issues/15311)) ([94eb3a8](https://github.com/aws/aws-cdk/commit/94eb3a8a02eed77581d81efc02214dc976ba6bfc))
* **cli:** read outputs-file parameter from cdk.json ([#15095](https://github.com/aws/aws-cdk/issues/15095)) ([9e933ca](https://github.com/aws/aws-cdk/commit/9e933ca21677ab3b77a4b415bf15ad9ab708082c)), closes [#14307](https://github.com/aws/aws-cdk/issues/14307)
* **cloudfront:** add fromFile for CF functions ([#14980](https://github.com/aws/aws-cdk/issues/14980)) ([31c9338](https://github.com/aws/aws-cdk/commit/31c933895e58a68d4d2edc72917fcc43a8e7304e)), closes [#14967](https://github.com/aws/aws-cdk/issues/14967)
* **cloudwatch:** use `string` instead of `any` for cloudwatch dimension values ([#15097](https://github.com/aws/aws-cdk/issues/15097)) ([dc3cf13](https://github.com/aws/aws-cdk/commit/dc3cf130d779c276569500bff54e44d4eb0c4763)), closes [#14978](https://github.com/aws/aws-cdk/issues/14978)
* **codepipeline:** allow granting manual approval permissions ([#15102](https://github.com/aws/aws-cdk/issues/15102)) ([b2037d3](https://github.com/aws/aws-cdk/commit/b2037d3b1a63715f71587681c84a5fd34be939a7))
* **codestarnotifications:** new L2 constructs ([#10833](https://github.com/aws/aws-cdk/issues/10833)) ([645ebe1](https://github.com/aws/aws-cdk/commit/645ebe119f7aa4484e72b83770b8ceb433eb7d2d)), closes [#9680](https://github.com/aws/aws-cdk/issues/9680)
* **core:** allow user to provide docker --security-opt when bundling ([#14682](https://github.com/aws/aws-cdk/issues/14682)) ([a418ea6](https://github.com/aws/aws-cdk/commit/a418ea67c3481cf95209844df232e84c323b5bb8))
* **core:** Support platform flag during asset build ([#14908](https://github.com/aws/aws-cdk/issues/14908)) ([0189a9a](https://github.com/aws/aws-cdk/commit/0189a9af921dcaffab8a44868be27df0608503d6))
* **dynamodb:** allow using Kinesis stream in Table ([#15199](https://github.com/aws/aws-cdk/issues/15199)) ([7bc6c6e](https://github.com/aws/aws-cdk/commit/7bc6c6eb14ee73c490caa649aeff509e34eb2c52)), closes [#14534](https://github.com/aws/aws-cdk/issues/14534)
* **dynamodb:** exposes schema method to return partition and sort key of table or secondary indexes ([#15111](https://github.com/aws/aws-cdk/issues/15111)) ([1137eb7](https://github.com/aws/aws-cdk/commit/1137eb70d5a0afd6a39667c41bbb36fea5fca90a)), closes [#7680](https://github.com/aws/aws-cdk/issues/7680)
* **ecs-patterns:** Add ability to configure VisibilityTimeout on QueueProcessing service pattern ([#15052](https://github.com/aws/aws-cdk/issues/15052)) ([350d783](https://github.com/aws/aws-cdk/commit/350d7834e6110498bddcec7e4a5ce59e86211c97))
* **ecs-patterns:** allow specifying security groups on ScheduledTask pattern ([#15096](https://github.com/aws/aws-cdk/issues/15096)) ([6bdf1c0](https://github.com/aws/aws-cdk/commit/6bdf1c0382e4cce4e300a7ff50ddb9f2adf3d76b)), closes [#5213](https://github.com/aws/aws-cdk/issues/5213) [#14220](https://github.com/aws/aws-cdk/issues/14220)
* **ecs-patterns:** expose task target on ScheduledTask pattern ([#15127](https://github.com/aws/aws-cdk/issues/15127)) ([c31c59a](https://github.com/aws/aws-cdk/commit/c31c59a00cd7a43ddd31b9225785fe96c61e944d)), closes [#14971](https://github.com/aws/aws-cdk/issues/14971) [#14953](https://github.com/aws/aws-cdk/issues/14953) [#12609](https://github.com/aws/aws-cdk/issues/12609)
* **eks:** taints for managed node groups ([#14792](https://github.com/aws/aws-cdk/issues/14792)) ([0556e6b](https://github.com/aws/aws-cdk/commit/0556e6b710c53dacf6b65926b4cc5b82fb082ee6))
* **events:** allows importing event bus from name ([#15087](https://github.com/aws/aws-cdk/issues/15087)) ([e39b6c5](https://github.com/aws/aws-cdk/commit/e39b6c5b8b044e32b11d146675ef869aa9c22288)), closes [#14072](https://github.com/aws/aws-cdk/issues/14072)
* **lambda-event-sources:** streams - report batch item failures ([#14458](https://github.com/aws/aws-cdk/issues/14458)) ([3d4a13e](https://github.com/aws/aws-cdk/commit/3d4a13ee7ec241da72100c433a8728c40ca9f46e)), closes [#12654](https://github.com/aws/aws-cdk/issues/12654)
* **logs:** make the addition of permissions to Lambda functions optional ([#14222](https://github.com/aws/aws-cdk/issues/14222)) ([0c50ec9](https://github.com/aws/aws-cdk/commit/0c50ec920bb7941cc510ac66bc36c21d95c92027)), closes [#14198](https://github.com/aws/aws-cdk/issues/14198)
* **migration:** add constructs migration to rewrite script ([#14916](https://github.com/aws/aws-cdk/issues/14916)) ([37a4c8d](https://github.com/aws/aws-cdk/commit/37a4c8d49b6ed1d09eb084088487768e0f2346d0))
* **s3:** notifications to existing buckets ([#15158](https://github.com/aws/aws-cdk/issues/15158)) ([7d218c2](https://github.com/aws/aws-cdk/commit/7d218c22e5cbfeaf19b1573b537fc34dd07f7b22)), closes [#2004](https://github.com/aws/aws-cdk/issues/2004)
* **secretsmanager:** Allow cross account grant ([#14834](https://github.com/aws/aws-cdk/issues/14834)) ([ea40cfe](https://github.com/aws/aws-cdk/commit/ea40cfe1b85ce4aee9c8f871de08d3c3739589d1))
* **secretsmanager:** automatically grant permissions to rotation Lambda ([#14882](https://github.com/aws/aws-cdk/issues/14882)) ([ad283b6](https://github.com/aws/aws-cdk/commit/ad283b6e56b1f90fd75409189441a7252d76a225))
* cloudformation spec v39.1.0 ([af74354](https://github.com/aws/aws-cdk/commit/af7435494ba938b036e85435b5dcb590082fc378))
* **sns:** add sns service trust to keys for encrypted queue subscriptions ([#14960](https://github.com/aws/aws-cdk/issues/14960)) ([ccc2e30](https://github.com/aws/aws-cdk/commit/ccc2e30bdcc227ef549b0edef99c16282140ae00)), closes [#2504](https://github.com/aws/aws-cdk/issues/2504)
* **sqs:** add support for high throughput fifo ([#15202](https://github.com/aws/aws-cdk/issues/15202)) ([d0c9602](https://github.com/aws/aws-cdk/commit/d0c96021adcead538c302fc9b1d0ec3baf69cb4f)), closes [#15063](https://github.com/aws/aws-cdk/issues/15063)

### Bug Fixes

* **aws-elasticloadbalancingv2:** cannot clear access logging bucket prefix ([#15149](https://github.com/aws/aws-cdk/issues/15149)) ([2e93fb9](https://github.com/aws/aws-cdk/commit/2e93fb9a195b6043265562163a3e5c2798a4d122)), closes [#14044](https://github.com/aws/aws-cdk/issues/14044)
* **aws-iam:** prevent adding duplicate resources and actions ([#14712](https://github.com/aws/aws-cdk/issues/14712)) ([a8298cb](https://github.com/aws/aws-cdk/commit/a8298cb378e8dea21ceca66bfc09dd02baec4158)), closes [#13611](https://github.com/aws/aws-cdk/issues/13611)
* **bootstrap:** `deploy-role` could directly access buckets in target account ([#15192](https://github.com/aws/aws-cdk/issues/15192)) ([d04e288](https://github.com/aws/aws-cdk/commit/d04e28862a872ab90c00306193732c72a90c5e7c)), closes [#12985](https://github.com/aws/aws-cdk/issues/12985) [#14082](https://github.com/aws/aws-cdk/issues/14082) [#13422](https://github.com/aws/aws-cdk/issues/13422)
* **cdk-assets:** content type not correctly set when publishing files ([#15069](https://github.com/aws/aws-cdk/issues/15069)) ([9b1a4f9](https://github.com/aws/aws-cdk/commit/9b1a4f9b78bb1c3b057f576411a71b0baf18c3cf))
* **cfn-include:** NestedStack's Parameters are not converted to strings ([#15098](https://github.com/aws/aws-cdk/issues/15098)) ([8ad33b8](https://github.com/aws/aws-cdk/commit/8ad33b8b1ca23b46bd40e768f0fc44e113ea84e7)), closes [#15092](https://github.com/aws/aws-cdk/issues/15092)
* **cli:** `cdk synth` too eager with validation in Pipelines ([#15147](https://github.com/aws/aws-cdk/issues/15147)) ([ae98e88](https://github.com/aws/aws-cdk/commit/ae98e88a71a57866a3cea31396d3014dda5605bd)), closes [#14613](https://github.com/aws/aws-cdk/issues/14613) [#15130](https://github.com/aws/aws-cdk/issues/15130)
* **cli:** cdk synth doesn't output yaml for stacks with dependency stacks ([#14805](https://github.com/aws/aws-cdk/issues/14805)) ([44feee6](https://github.com/aws/aws-cdk/commit/44feee6d21abe66a55718a53e3a6cf60747ea0f7)), closes [#3721](https://github.com/aws/aws-cdk/issues/3721)
* **cli:** deployment error traceback overwritten by progress bar ([#14812](https://github.com/aws/aws-cdk/issues/14812)) ([d4a0af1](https://github.com/aws/aws-cdk/commit/d4a0af1317b062cd68dca88bf889cf3db80392f8)), closes [#14780](https://github.com/aws/aws-cdk/issues/14780)
* **cli:** HTTP timeout is too low for some asset uploads ([#13575](https://github.com/aws/aws-cdk/issues/13575)) ([23c58d6](https://github.com/aws/aws-cdk/commit/23c58d6908ae56d2ea3328bf2beef1a8c0ac4e76)), closes [#13183](https://github.com/aws/aws-cdk/issues/13183)
* **cli:** option `--all` selects stacks in nested assemblies ([#15046](https://github.com/aws/aws-cdk/issues/15046)) ([0d00e50](https://github.com/aws/aws-cdk/commit/0d00e50743074e31b40bcb46e6d4e0869a11419b))
* **cli:** partition is not being resolved at missing value lookup ([#15146](https://github.com/aws/aws-cdk/issues/15146)) ([cc7191e](https://github.com/aws/aws-cdk/commit/cc7191e223ee3a19db3d46fd815236ca68bd36e4)), closes [#15119](https://github.com/aws/aws-cdk/issues/15119)
* **cli:** stack glob patterns only select one stack ([#15071](https://github.com/aws/aws-cdk/issues/15071)) ([fcd2a6e](https://github.com/aws/aws-cdk/commit/fcd2a6ee1466577b905e379238e9483607deb560))
* **cloudfront:** cannot set header including 'authorization' in OriginRequestPolicy ([#15327](https://github.com/aws/aws-cdk/issues/15327)) ([3a2f642](https://github.com/aws/aws-cdk/commit/3a2f642ed6f2a785e58299cf303e680685454cf8)), closes [#15286](https://github.com/aws/aws-cdk/issues/15286)
* **codebuild:** Project's Role has permissions to the entire Bucket when using S3 as the source ([#15112](https://github.com/aws/aws-cdk/issues/15112)) ([9d01b4f](https://github.com/aws/aws-cdk/commit/9d01b4fabdf50a1e6691c054a674d768e5816a3c))
* **codebuild:** Secret env variable as token from another account fails on Key decryption ([#14483](https://github.com/aws/aws-cdk/issues/14483)) ([91e80d7](https://github.com/aws/aws-cdk/commit/91e80d7a4b69726a525e4af0e603788343cf1615)), closes [#14477](https://github.com/aws/aws-cdk/issues/14477)
* **codepipeline-actions:** reduce S3SourceAction role permissions to just the key ([#15304](https://github.com/aws/aws-cdk/issues/15304)) ([d2c76aa](https://github.com/aws/aws-cdk/commit/d2c76aa23f5ac0d596bce7c648753f05a8dd718f)), closes [#15112](https://github.com/aws/aws-cdk/issues/15112)
* **core:** `1 hour` renders as `60 minutes` ([#15125](https://github.com/aws/aws-cdk/issues/15125)) ([adcd8c3](https://github.com/aws/aws-cdk/commit/adcd8c31c4a3c5d453fea931b32d40534763daa5))
* **core:** CloudFormation dynamic references can't be assigned to num… ([#14913](https://github.com/aws/aws-cdk/issues/14913)) ([39aacc8](https://github.com/aws/aws-cdk/commit/39aacc81e4a97f6de504de52d276a8d082059a0c)), closes [#14824](https://github.com/aws/aws-cdk/issues/14824)
* **core:** parsing an ARN with a slash after a colon in the resource part fails ([#15166](https://github.com/aws/aws-cdk/issues/15166)) ([16b8a4e](https://github.com/aws/aws-cdk/commit/16b8a4e24d13948c9a7092df183693ddd2d4be0b)), closes [/github.com/aws/aws-cdk/pull/15140/files#r653112073](https://github.com/aws//github.com/aws/aws-cdk/pull/15140/files/issues/r653112073)
* **ecs:** TagParameterContainerImage cannot be used across accounts ([#15073](https://github.com/aws/aws-cdk/issues/15073)) ([486f2e5](https://github.com/aws/aws-cdk/commit/486f2e5518ab5abb69a3e3986e4f3581aa42d15b)), closes [#15070](https://github.com/aws/aws-cdk/issues/15070)
* **eks:** kubectl version 1.21.0 breaks object pruning  ([#15314](https://github.com/aws/aws-cdk/issues/15314)) ([623689d](https://github.com/aws/aws-cdk/commit/623689dc0fe7a46ef8ae5c0b04ad7f8fd4bc2b58)), closes [#15072](https://github.com/aws/aws-cdk/issues/15072)
* **eks:** kubectl version 1.21.0 breaks object pruning  ([#15314](https://github.com/aws/aws-cdk/issues/15314)) ([74da5c1](https://github.com/aws/aws-cdk/commit/74da5c1a2b7f6f2132ac5909d60e02ee109184a2)), closes [#15072](https://github.com/aws/aws-cdk/issues/15072)
* **elasticsearch:** Domain.fromDomainAttributes gives "Invalid URL" when endpoint is a token ([#15219](https://github.com/aws/aws-cdk/issues/15219)) ([ecb5af8](https://github.com/aws/aws-cdk/commit/ecb5af8128ff907125910184dafca19fa9d672e3)), closes [#15188](https://github.com/aws/aws-cdk/issues/15188)
* **lambda:** deployment failure when layers are added to container functions ([#15037](https://github.com/aws/aws-cdk/issues/15037)) ([8127cf2](https://github.com/aws/aws-cdk/commit/8127cf29ef7a3fc9d85c94c41a3cc78b3d3d703f)), closes [#14143](https://github.com/aws/aws-cdk/issues/14143)
* **lambda-event-sources:** kafka event source expects credentials even when accessed via vpc ([#14804](https://github.com/aws/aws-cdk/issues/14804)) ([5eb1e75](https://github.com/aws/aws-cdk/commit/5eb1e7503d04f193e9194c87f7f0120afff4520a))
* **lambda-nodejs:** unstable asset hashes with bundling.nodeModules ([#15229](https://github.com/aws/aws-cdk/issues/15229)) ([4b5418c](https://github.com/aws/aws-cdk/commit/4b5418c786764fbe7cb68d80cbe0cafec7d756b5)), closes [#15023](https://github.com/aws/aws-cdk/issues/15023)
* **secretsmanager:** support secrets rotation in partition 'aws-cn' ([#14608](https://github.com/aws/aws-cdk/issues/14608)) ([5061a8d](https://github.com/aws/aws-cdk/commit/5061a8d9c59bc7380290de93aa13e4d6e8119932)), closes [#13385](https://github.com/aws/aws-cdk/issues/13385)
* **stepfunctions-tasks:** checking for task token in EcsRunTask containerOverrides causes memory explosion ([#15187](https://github.com/aws/aws-cdk/issues/15187)) ([af53798](https://github.com/aws/aws-cdk/commit/af53798d8fdd7d244da344585602f4f24c09806b)), closes [#15124](https://github.com/aws/aws-cdk/issues/15124)
* **stepfunctions-tasks:** EcsRunTask containerOverrides throws if container name doesn't match construct ID ([#15190](https://github.com/aws/aws-cdk/issues/15190)) ([5f59787](https://github.com/aws/aws-cdk/commit/5f597877c75f9e92d3bf08eedb5007ecc3cb001e)), closes [#15171](https://github.com/aws/aws-cdk/issues/15171)
* **stepfunctions-tasks:** instance type for SageMakerCreateTrainingJob cannot be specified dynamically through JSONPath ([#15215](https://github.com/aws/aws-cdk/issues/15215)) ([9280d95](https://github.com/aws/aws-cdk/commit/9280d95afa522b77b1044140e48da5895f742112)), closes [#11928](https://github.com/aws/aws-cdk/issues/11928)

## [2.0.0-rc.11](https://github.com/aws/aws-cdk/compare/v2.0.0-rc.10...v2.0.0-rc.11) (2021-07-07)

## [2.0.0-rc.10](https://github.com/aws/aws-cdk/compare/v2.0.0-rc.9...v2.0.0-rc.10) (2021-06-30)

## [2.0.0-rc.9](https://github.com/aws/aws-cdk/compare/v2.0.0-rc.8...v2.0.0-rc.9) (2021-06-23)

## [2.0.0-rc.8](https://github.com/aws/aws-cdk/compare/v2.0.0-rc.7...v2.0.0-rc.8) (2021-06-16)

### Features

* **ecs-patterns:** Add Load Balancer name to ApplicationLoadBalancedFargateService props ([#14831](https://github.com/aws/aws-cdk/issues/14831)) ([c432fb4](https://github.com/aws/aws-cdk/commit/c432fb40e793bac27fdf9197bb2ef7b0765c5daa))
* **ecs-patterns:** Add support for Docker labels to ECS Patterns ([#14783](https://github.com/aws/aws-cdk/issues/14783)) ([00c11b5](https://github.com/aws/aws-cdk/commit/00c11b512b45a65c632c24893ccd576e076a98d3))

### Bug Fixes

* **ecs:** Can't enable both Fargate and ASG capacity providers on ECS Cluster ([#15012](https://github.com/aws/aws-cdk/issues/15012)) ([6b2d0e0](https://github.com/aws/aws-cdk/commit/6b2d0e0c867651cd632be9ca99c6e342fb3c1067)), closes [#14730](https://github.com/aws/aws-cdk/issues/14730)

## [2.0.0-rc.7](https://github.com/aws/aws-cdk/compare/v2.0.0-rc.6...v2.0.0-rc.7) (2021-06-09)

### ⚠ BREAKING CHANGES TO EXPERIMENTAL FEATURES

* **cfnspec:** `imageScanningConfiguration` property of `ecr.CfnRepository` now accepts `scanOnPush` instead of `ScanOnPush` (notice the casing change).
- **appmesh**: the creation property `clientPolicy` in `VirtualGateway` has been renamed to `tlsClientPolicy`, and its type changed to `TlsClientPolicy`
- **appmesh**: to create `TlsClientPolicy`, `validation` property must be defined.

### Features

* **cfnspec:** cloudformation spec v37.1.0 ([#14951](https://github.com/aws/aws-cdk/issues/14951)) ([aee0f58](https://github.com/aws/aws-cdk/commit/aee0f58b3c36b2bf8441b1f02c3cc936b55ab6f6))
* **cli:** new bootstrap supports cross-account lookups ([#14874](https://github.com/aws/aws-cdk/issues/14874)) ([f66f4b8](https://github.com/aws/aws-cdk/commit/f66f4b80da22b4d24d4419acc3984b56d5690b2e)), closes [#8905](https://github.com/aws/aws-cdk/issues/8905)
* **cloudfront:** add L2 support for CloudFront functions ([#14511](https://github.com/aws/aws-cdk/issues/14511)) ([40d2ff9](https://github.com/aws/aws-cdk/commit/40d2ff964c97954c70d79a09d60fcb795ef16791))
* **cognito:** user pool - customize mfa message ([#14241](https://github.com/aws/aws-cdk/issues/14241)) ([a12db62](https://github.com/aws/aws-cdk/commit/a12db624ce394f5b9e786a5eea35be6716265673))
* **custom-resources:** support custom lambda role in provider framework ([#12131](https://github.com/aws/aws-cdk/issues/12131)) ([bc01207](https://github.com/aws/aws-cdk/commit/bc0120719b8e16737b484c6b504b99d99656d1e1)), closes [#12126](https://github.com/aws/aws-cdk/issues/12126)
* **ec2:** Implement UserData methods in MultipartUserData ([#14347](https://github.com/aws/aws-cdk/issues/14347)) ([d1b6ce4](https://github.com/aws/aws-cdk/commit/d1b6ce44f6058c8ae037696a4e0d0557f9375062))
* **ecs:** Adding support for ECS Exec ([#14670](https://github.com/aws/aws-cdk/issues/14670)) ([b35328c](https://github.com/aws/aws-cdk/commit/b35328c1197dfed572532e114d1ded89ddb523ac))
* **eks:** support Kubernetes 1.20 ([#14758](https://github.com/aws/aws-cdk/issues/14758)) ([1956ef6](https://github.com/aws/aws-cdk/commit/1956ef6708d59329da61fbdd6056de4727e1e2e1)), closes [#14756](https://github.com/aws/aws-cdk/issues/14756)
* **elb:** set accessLoggingPolicy property with L2 LoadBalancer ([#14983](https://github.com/aws/aws-cdk/issues/14983)) ([252dfa2](https://github.com/aws/aws-cdk/commit/252dfa2f84f24ef57ab632e8ee5092544c850a5f)), closes [#14972](https://github.com/aws/aws-cdk/issues/14972)
* **events:** support embedded string variables ([#13487](https://github.com/aws/aws-cdk/issues/13487)) ([a5d27aa](https://github.com/aws/aws-cdk/commit/a5d27aabc7cab223f4000946506aa0c06c5f34b5)), closes [#9191](https://github.com/aws/aws-cdk/issues/9191) [#9191](https://github.com/aws/aws-cdk/issues/9191)
* **kms:** introduce `fromCfnKey()` method ([#14859](https://github.com/aws/aws-cdk/issues/14859)) ([1ff5b9e](https://github.com/aws/aws-cdk/commit/1ff5b9e5b728116171cb1922a861c1ecd4105292)), closes [#9719](https://github.com/aws/aws-cdk/issues/9719) [#14795](https://github.com/aws/aws-cdk/issues/14795) [#14809](https://github.com/aws/aws-cdk/issues/14809)
* **route-53:** add ability to create DS Records ([#14726](https://github.com/aws/aws-cdk/issues/14726)) ([f0c9726](https://github.com/aws/aws-cdk/commit/f0c9726487f9a46a4637f093725b7e0eb5dd4791))
* Parameterize bootstrap stack version ([#14626](https://github.com/aws/aws-cdk/issues/14626)) ([a37108c](https://github.com/aws/aws-cdk/commit/a37108cef1132d21443561cc36771a30a7a53598))
* **route53-targets:** route53 record target ([#14820](https://github.com/aws/aws-cdk/issues/14820)) ([b22da80](https://github.com/aws/aws-cdk/commit/b22da808ff124fddc643adc3b66dbd6e435cf175)), closes [#14800](https://github.com/aws/aws-cdk/issues/14800)
* **s3:** support ExpiredObjectDeleteMarker ([#14970](https://github.com/aws/aws-cdk/issues/14970)) ([f932e0f](https://github.com/aws/aws-cdk/commit/f932e0fbcf95f755d11bd322e6ac9c350b38c149)), closes [#14752](https://github.com/aws/aws-cdk/issues/14752)

### Bug Fixes

* **cli:** cross account docker image assets upload no longer works ([#14816](https://github.com/aws/aws-cdk/issues/14816)) ([14fbb11](https://github.com/aws/aws-cdk/commit/14fbb11af407a5834dedb6aeb095285dd44695ba)), closes [#14815](https://github.com/aws/aws-cdk/issues/14815)
* **cli:** image publishing role doesn't have docker pull permissions ([#14662](https://github.com/aws/aws-cdk/issues/14662)) ([beaffa9](https://github.com/aws/aws-cdk/commit/beaffa9aec25875649ad4ef02d0885d8de0f5eac)), closes [#14656](https://github.com/aws/aws-cdk/issues/14656)
* **core:** property overrides fail for references ([#15018](https://github.com/aws/aws-cdk/issues/15018)) ([ebac8bc](https://github.com/aws/aws-cdk/commit/ebac8bc08885d6862f75b1133752b639dcf54b1c))
* **docs:** fixed typos in documentation ([#14760](https://github.com/aws/aws-cdk/issues/14760)) ([ced9b38](https://github.com/aws/aws-cdk/commit/ced9b38e0e30613befd48a9e198086412d19c175))
* **ec2:** add missing entry for XLARGE3 ([#14750](https://github.com/aws/aws-cdk/issues/14750)) ([af6d49f](https://github.com/aws/aws-cdk/commit/af6d49f2e245b60ae3bbea3bb2c5d283beedba3f))
* **elasticsearch:** 'r6gd' not marked as supported type for instance storage ([#14894](https://github.com/aws/aws-cdk/issues/14894)) ([d07a49f](https://github.com/aws/aws-cdk/commit/d07a49ff00ae07ea013ce6cc83d768e7729225a8)), closes [#14773](https://github.com/aws/aws-cdk/issues/14773)
* **events:** AwsApi warns if service does not exist ([#13352](https://github.com/aws/aws-cdk/issues/13352)) ([3bad98f](https://github.com/aws/aws-cdk/commit/3bad98f9cafa88c4c8a26502798afea3c3f0e146)), closes [#13090](https://github.com/aws/aws-cdk/issues/13090)
* **lambda-nodejs:** cannot bundle locally when consuming a node module with a NodejsFunction ([#14914](https://github.com/aws/aws-cdk/issues/14914)) ([52da59c](https://github.com/aws/aws-cdk/commit/52da59c34c4be74d696af0637521eeb0d6e69fa9)), closes [#14739](https://github.com/aws/aws-cdk/issues/14739)
* **lambda-nodejs:** pnpm exec command ([#14954](https://github.com/aws/aws-cdk/issues/14954)) ([df16d40](https://github.com/aws/aws-cdk/commit/df16d40352e56c2d4b33b2066f3fe030792d32d6)), closes [#14757](https://github.com/aws/aws-cdk/issues/14757) [#14772](https://github.com/aws/aws-cdk/issues/14772)
* **s3:** `autoDeleteObjects` had redundant `GetObject*` permissions ([#14573](https://github.com/aws/aws-cdk/issues/14573)) ([f9be15d](https://github.com/aws/aws-cdk/commit/f9be15d9bd130519735077cda079c2e6e9e43a02)), closes [#14572](https://github.com/aws/aws-cdk/issues/14572)
* **stepfunctions:** repeated object references not allowed even if not a circular reference ([#14628](https://github.com/aws/aws-cdk/issues/14628)) ([486990f](https://github.com/aws/aws-cdk/commit/486990f9d771779cacb008dfe347a65705146818)), closes [#14596](https://github.com/aws/aws-cdk/issues/14596)

## [2.0.0-rc.6](https://github.com/aws/aws-cdk/compare/v2.0.0-rc.5...v2.0.0-rc.6) (2021-06-02)

## [2.0.0-rc.5](https://github.com/aws/aws-cdk/compare/v2.0.0-rc.4...v2.0.0-rc.5) (2021-05-28)

### ⚠ BREAKING CHANGES TO EXPERIMENTAL FEATURES

- **appmesh**: the creation property `tlsCertificate` in `VirtualGatewayListener` has been renamed to `tls`, and its type changed to `TlsListener`
- **appmesh**: the `tlsMode` property has been removed from the options when creating a `TlsCertificate`, moved to the new `TlsListener` interface, and renamed `mode`
* **lambda-nodejs:** using `banner` and `footer` now requires `esbuild` >= 0.9.0

### Features

* **dynamodb:** add ability to enable contributor insights on Table ([#14742](https://github.com/aws/aws-cdk/issues/14742)) ([3c7a89d](https://github.com/aws/aws-cdk/commit/3c7a89de6edaf7a1910bf716419dbe5568d79374))
* allow taskRole to be passed in on creation of an ECS service ([3e257a0](https://github.com/aws/aws-cdk/commit/3e257a0e554851b7393f52bbbea2f5187673e8a7))
* **cfnspec:** cloudformation spec v36.0.0 ([#14791](https://github.com/aws/aws-cdk/issues/14791)) ([3a9f56d](https://github.com/aws/aws-cdk/commit/3a9f56d5167aab6a1bd0bf8b29b53dd8658a2313))
* **cfnspec:** cloudformation spec v37.0.0 ([#14873](https://github.com/aws/aws-cdk/issues/14873)) ([8bb4357](https://github.com/aws/aws-cdk/commit/8bb4357036f549af1235de81f2f5c528f5fa80f8))
* **cloudwatch:** GraphWidget supports period and statistic ([#14679](https://github.com/aws/aws-cdk/issues/14679)) ([b240f6e](https://github.com/aws/aws-cdk/commit/b240f6ece74d129e5f43b210e8ad12f95c4a2971))
* **custom-resources:** restrict output of AwsCustomResource to list of paths ([#14041](https://github.com/aws/aws-cdk/issues/14041)) ([773ca8c](https://github.com/aws/aws-cdk/commit/773ca8c5d2a845f392f530d7710020075b884c72)), closes [/github.com/aws/aws-cdk/issues/2825#issuecomment-814999890](https://github.com/aws//github.com/aws/aws-cdk/issues/2825/issues/issuecomment-814999890)
* **lambda:** support Principal conditions in Permission ([#14674](https://github.com/aws/aws-cdk/issues/14674)) ([b78a1bb](https://github.com/aws/aws-cdk/commit/b78a1bbf445743d96c8e4f54e7d2e7cac204342a)), closes [#8116](https://github.com/aws/aws-cdk/issues/8116)
* **lambda-nodejs:** pnpm support ([#14772](https://github.com/aws/aws-cdk/issues/14772)) ([b02311c](https://github.com/aws/aws-cdk/commit/b02311cd55b5bdbe408085488dd17816f181fd2c)), closes [#14757](https://github.com/aws/aws-cdk/issues/14757)
* **stepfunctions:** Add support for ResultSelector ([#14648](https://github.com/aws/aws-cdk/issues/14648)) ([50d486a](https://github.com/aws/aws-cdk/commit/50d486ad4e7d175dfac048dbb4abf5e4084ce4fe)), closes [#9904](https://github.com/aws/aws-cdk/issues/9904)

### Bug Fixes

* **cli:** Updated typo user to uses ([#14357](https://github.com/aws/aws-cdk/issues/14357)) ([7fe329c](https://github.com/aws/aws-cdk/commit/7fe329cd17502cf04c451153f6d19955621952dc))
* **cognito:** user pool - phoneNumberVerified attribute fails deployment ([#14699](https://github.com/aws/aws-cdk/issues/14699)) ([cd2589f](https://github.com/aws/aws-cdk/commit/cd2589f560600294cc50988a98e69b091c42e3f8)), closes [#14175](https://github.com/aws/aws-cdk/issues/14175)
* **core:** cannot determine packaging when bundling that produces an archive is skipped ([#14372](https://github.com/aws/aws-cdk/issues/14372)) ([163e812](https://github.com/aws/aws-cdk/commit/163e8122db994d0bea7077f025876dbeac490ead)), closes [#14369](https://github.com/aws/aws-cdk/issues/14369)
* **ecr:** add validations for ECR repository names ([#12613](https://github.com/aws/aws-cdk/issues/12613)) ([396dca9](https://github.com/aws/aws-cdk/commit/396dca965b56bfbe8a7aedb2bcaddb196b5560c4)), closes [#9877](https://github.com/aws/aws-cdk/issues/9877)
* **ecs:** Classes FargateService and Ec2Service have no defaultChild ([#14691](https://github.com/aws/aws-cdk/issues/14691)) ([348e11e](https://github.com/aws/aws-cdk/commit/348e11e26edc0ff90b623b7cec778f4935e61e6d)), closes [#14665](https://github.com/aws/aws-cdk/issues/14665)
* **events-targets:** circular dependency when adding a KMS-encrypted SQS queue  ([#14638](https://github.com/aws/aws-cdk/issues/14638)) ([3063818](https://github.com/aws/aws-cdk/commit/3063818aa7c3c3ff56cf55254b0f6561db190a3e)), closes [#11158](https://github.com/aws/aws-cdk/issues/11158)
* **iam:** permissions boundaries not added to custom resource roles ([#14754](https://github.com/aws/aws-cdk/issues/14754)) ([f36feb5](https://github.com/aws/aws-cdk/commit/f36feb52a750a326842903ac4dc23be83e4aee1a)), closes [#13310](https://github.com/aws/aws-cdk/issues/13310)
* **lambda:** changing reserved concurrency fails lambda version deployment ([#14586](https://github.com/aws/aws-cdk/issues/14586)) ([f47d5cb](https://github.com/aws/aws-cdk/commit/f47d5cb48e641515b503bae092cd32071dae2ed9)), closes [#11537](https://github.com/aws/aws-cdk/issues/11537)
* **lambda:** unable to access SingletonFunction vpc connections ([#14533](https://github.com/aws/aws-cdk/issues/14533)) ([49d18ab](https://github.com/aws/aws-cdk/commit/49d18ab8e8f55f8b36584f7fb95427106139a140)), closes [#6261](https://github.com/aws/aws-cdk/issues/6261)
* **lambda-nodejs:** banner and footer values not escaped ([#14743](https://github.com/aws/aws-cdk/issues/14743)) ([81aa612](https://github.com/aws/aws-cdk/commit/81aa61213b4f5e3bd9cbbc155264252bd64d0f5b)), closes [#13576](https://github.com/aws/aws-cdk/issues/13576)
* **lambda-nodejs:** esbuild detection with Yarn 2 in PnP mode ([#14739](https://github.com/aws/aws-cdk/issues/14739)) ([5c84696](https://github.com/aws/aws-cdk/commit/5c84696a88f9319af1b2782b747e10f408c4c8fb))
* **rds:** Add exception throw when az is defined for multi-az db instance ([#14837](https://github.com/aws/aws-cdk/issues/14837)) ([fd8445f](https://github.com/aws/aws-cdk/commit/fd8445ff1bf94b3dde26211c497bda7211b54dc0)), closes [#10949](https://github.com/aws/aws-cdk/issues/10949) [#10949](https://github.com/aws/aws-cdk/issues/10949)

## [2.0.0-rc.4](https://github.com/aws/aws-cdk/compare/v2.0.0-rc.3...v2.0.0-rc.4) (2021-05-19)

### ⚠ BREAKING CHANGES TO EXPERIMENTAL FEATURES

fixes https://github.com/aws/aws-cdk/issues/11640

### Features

* **cfnspec:** cloudformation spec v35.2.0 ([#14610](https://github.com/aws/aws-cdk/issues/14610)) ([799ce1a](https://github.com/aws/aws-cdk/commit/799ce1a7d5fb261cae92d514b4f7e315d8f0e589))
* **cloudwatch:** time range support for GraphWidget ([#14659](https://github.com/aws/aws-cdk/issues/14659)) ([010a6b1](https://github.com/aws/aws-cdk/commit/010a6b1a14f14be5001779644df3d3a2e27d4e71)), closes [#4649](https://github.com/aws/aws-cdk/issues/4649)
* **cloudwatch:** validate parameters for a metric dimensions (closes [#3116](https://github.com/aws/aws-cdk/issues/3116)) ([#14365](https://github.com/aws/aws-cdk/issues/14365)) ([4a24d61](https://github.com/aws/aws-cdk/commit/4a24d61654ef77557350e35443ddab7597d61736))
* **ecs:** add support for EC2 Capacity Providers ([#14386](https://github.com/aws/aws-cdk/issues/14386)) ([114f7cc](https://github.com/aws/aws-cdk/commit/114f7ccdaf736988834fe2be487363a992a31369))
* **elbv2:** preserveClientIp for NetworkTargetGroup ([#14589](https://github.com/aws/aws-cdk/issues/14589)) ([d676ffc](https://github.com/aws/aws-cdk/commit/d676ffccb28d530a18d0e1630df0940632122a27))
* **kms:** allow specifying key spec and key usage ([#14478](https://github.com/aws/aws-cdk/issues/14478)) ([10ae1a9](https://github.com/aws/aws-cdk/commit/10ae1a902383e69d15a17585268dd836ffb4087b)), closes [#5639](https://github.com/aws/aws-cdk/issues/5639)
* **secretsmanager:** Automatically grant permissions to rotation Lambda ([#14471](https://github.com/aws/aws-cdk/issues/14471)) ([85e00fa](https://github.com/aws/aws-cdk/commit/85e00faf1e3bcc32c2f7aa881d42c6d1f6c17f63))

### Bug Fixes

* **cli:** synth fails if there was an error when synthesizing the stack ([#14613](https://github.com/aws/aws-cdk/issues/14613)) ([71c61e8](https://github.com/aws/aws-cdk/commit/71c61e81ca58c95979f66d7d7b8100777d3c7b99))
* **lambda:** custom resource fails to connect to efs filesystem ([#14431](https://github.com/aws/aws-cdk/issues/14431)) ([10a633c](https://github.com/aws/aws-cdk/commit/10a633c8cda9f21b85c82f911d88641f3a362c4d))
* **lambda-event-sources:** incorrect documented defaults for stream types ([#14562](https://github.com/aws/aws-cdk/issues/14562)) ([0ea24e9](https://github.com/aws/aws-cdk/commit/0ea24e95939412765c0e09133a7793557f779c76)), closes [#13908](https://github.com/aws/aws-cdk/issues/13908)
* **lambda-nodejs:** handler filename missing from error message ([#14564](https://github.com/aws/aws-cdk/issues/14564)) ([256fd4c](https://github.com/aws/aws-cdk/commit/256fd4c6fcdbe6519bc70f62415557dbeae950a1))

## [2.0.0-rc.3](https://github.com/aws/aws-cdk/compare/v2.0.0-rc.1...v2.0.0-rc.3) (2021-05-12)

### ⚠ BREAKING CHANGES TO EXPERIMENTAL FEATURES

`IApi` interface. The existing ones are moved into `IHttpApi` and new
ones will be added to `IWebsocketApi`.
the `IStage` interface. The existing ones are moved into `IHttpStage`
and new ones will be added to the `IWebsocketStage`.
* **lambda-nodejs:** the default runtime version for `NodejsFunction` is now always `NODEJS_14_X` (previously the version was derived from the local NodeJS runtime and could be either 12.x or 14.x).

### Features

* **aws-ecs:** Expose logdriver "mode" property ([#13965](https://github.com/aws/aws-cdk/issues/13965)) ([28fce22](https://github.com/aws/aws-cdk/commit/28fce2264448820495d921ed08ae0d3084442876)), closes [#13845](https://github.com/aws/aws-cdk/issues/13845)
* **cfnspec:** cloudformation spec v35.0.0 ([#14411](https://github.com/aws/aws-cdk/issues/14411)) ([49e49e7](https://github.com/aws/aws-cdk/commit/49e49e7ef50ee008be66b1887e4e15e51a4ae576))
* **cfnspec:** cloudformation spec v35.1.0 ([#14518](https://github.com/aws/aws-cdk/issues/14518)) ([bcdff3d](https://github.com/aws/aws-cdk/commit/bcdff3dcd4ecc624e8c1121a12e23683804a9aaf))
* **cli:** directly deploy stacks in nested assemblies ([#14379](https://github.com/aws/aws-cdk/issues/14379)) ([5a6fa7f](https://github.com/aws/aws-cdk/commit/5a6fa7fa17a5dce5e429eed4ebfe2dbbac3d6d07))
* **docdb:** Support multiple security groups to DatabaseCluster ([#13290](https://github.com/aws/aws-cdk/issues/13290)) ([1a97b66](https://github.com/aws/aws-cdk/commit/1a97b6664f9124ec21a6db39be600cee0411ab8c))
* **elasticsearch:** Support version 7.10 ([#14320](https://github.com/aws/aws-cdk/issues/14320)) ([f3a830c](https://github.com/aws/aws-cdk/commit/f3a830cb0d5b68e8f402791c3aaa5d1bcf2df673))
* **kinesis:** Basic stream level metrics ([#12556](https://github.com/aws/aws-cdk/issues/12556)) ([5f1b576](https://github.com/aws/aws-cdk/commit/5f1b57603330e707bc68f56c267a9e45faa29e55)), closes [#12555](https://github.com/aws/aws-cdk/issues/12555)
* **rds:** allow turning on IAM authentication for Clusters ([#13958](https://github.com/aws/aws-cdk/issues/13958)) ([0e59708](https://github.com/aws/aws-cdk/commit/0e597087bb375a02ac1ce3134d52cf3ee03bb54e)), closes [#13722](https://github.com/aws/aws-cdk/issues/13722)

### Bug Fixes

* **aws-cloudwatch:** fix for space in alarm name in alarms for compos… ([#13963](https://github.com/aws/aws-cdk/issues/13963)) ([7cdd541](https://github.com/aws/aws-cdk/commit/7cdd5412e9fed7f9bf877c448196b42725b8edbf))
* **cfn-include:** correctly parse Fn::Sub expressions containing serialized JSON ([#14512](https://github.com/aws/aws-cdk/issues/14512)) ([fd6d6d0](https://github.com/aws/aws-cdk/commit/fd6d6d0a563816ace616dfe48b3a03f4559636f7)), closes [#14095](https://github.com/aws/aws-cdk/issues/14095)
* `assert` matches more than the template on multiple CDK copies ([#14544](https://github.com/aws/aws-cdk/issues/14544)) ([f8abdbf](https://github.com/aws/aws-cdk/commit/f8abdbfb37ba9efd9e24414f5b64d90f4cf3f7cb)), closes [#14468](https://github.com/aws/aws-cdk/issues/14468)
* **cli:** 'cdk deploy *' should not deploy stacks in nested assemblies ([#14542](https://github.com/aws/aws-cdk/issues/14542)) ([93a3549](https://github.com/aws/aws-cdk/commit/93a3549e7a9791b5074dc95909f3289970800c10))
* **cli:** 'cdk synth' not able to fail if stacks have errors ([#14475](https://github.com/aws/aws-cdk/issues/14475)) ([963d1c7](https://github.com/aws/aws-cdk/commit/963d1c7755e23ea819481724d7e8c78e31d82294))
* **CodeBuild:** add resource only once per secret ([#14510](https://github.com/aws/aws-cdk/issues/14510)) ([affaaad](https://github.com/aws/aws-cdk/commit/affaaad4d65e6d4e42a7af465ed990954a0c122a))
* **lambda-nodejs:** non-deterministic runtime version ([#14538](https://github.com/aws/aws-cdk/issues/14538)) ([527f662](https://github.com/aws/aws-cdk/commit/527f6622146f007035ca669c33ad73861afe608a)), closes [#13893](https://github.com/aws/aws-cdk/issues/13893)
* **rds:** instance identifiers and endpoints of a Cluster are blank ([#14394](https://github.com/aws/aws-cdk/issues/14394)) ([9597d97](https://github.com/aws/aws-cdk/commit/9597d974bc710afd506606dcc7dd11e32b86cff5)), closes [#14377](https://github.com/aws/aws-cdk/issues/14377)
* **s3:** urlForObject does not consider explicit bucket region ([#14315](https://github.com/aws/aws-cdk/issues/14315)) ([e11d537](https://github.com/aws/aws-cdk/commit/e11d5378c33bea609ed09c998b305fdfd28999a9))
* **ssm:** dynamic SSM parameter reference breaks with lists ([#14527](https://github.com/aws/aws-cdk/issues/14527)) ([3d1baac](https://github.com/aws/aws-cdk/commit/3d1baaca015443d7ee0eecdec9e81dd61e8920ad)), closes [#14205](https://github.com/aws/aws-cdk/issues/14205) [#14476](https://github.com/aws/aws-cdk/issues/14476)

## [2.0.0-rc.2](https://github.com/aws/aws-cdk/compare/v2.0.0-rc.1...v2.0.0-rc.2) (2021-05-11)

### ⚠ BREAKING CHANGES TO EXPERIMENTAL FEATURES

`IApi` interface. The existing ones are moved into `IHttpApi` and new
ones will be added to `IWebsocketApi`.
the `IStage` interface. The existing ones are moved into `IHttpStage`
and new ones will be added to the `IWebsocketStage`.
* **lambda-nodejs:** the default runtime version for `NodejsFunction` is now always `NODEJS_14_X` (previously the version was derived from the local NodeJS runtime and could be either 12.x or 14.x).

### Features

* **aws-ecs:** Expose logdriver "mode" property ([#13965](https://github.com/aws/aws-cdk/issues/13965)) ([28fce22](https://github.com/aws/aws-cdk/commit/28fce2264448820495d921ed08ae0d3084442876)), closes [#13845](https://github.com/aws/aws-cdk/issues/13845)
* **cfnspec:** cloudformation spec v35.0.0 ([#14411](https://github.com/aws/aws-cdk/issues/14411)) ([49e49e7](https://github.com/aws/aws-cdk/commit/49e49e7ef50ee008be66b1887e4e15e51a4ae576))
* **cfnspec:** cloudformation spec v35.1.0 ([#14518](https://github.com/aws/aws-cdk/issues/14518)) ([bcdff3d](https://github.com/aws/aws-cdk/commit/bcdff3dcd4ecc624e8c1121a12e23683804a9aaf))
* **cli:** directly deploy stacks in nested assemblies ([#14379](https://github.com/aws/aws-cdk/issues/14379)) ([5a6fa7f](https://github.com/aws/aws-cdk/commit/5a6fa7fa17a5dce5e429eed4ebfe2dbbac3d6d07))
* **docdb:** Support multiple security groups to DatabaseCluster ([#13290](https://github.com/aws/aws-cdk/issues/13290)) ([1a97b66](https://github.com/aws/aws-cdk/commit/1a97b6664f9124ec21a6db39be600cee0411ab8c))
* **elasticsearch:** Support version 7.10 ([#14320](https://github.com/aws/aws-cdk/issues/14320)) ([f3a830c](https://github.com/aws/aws-cdk/commit/f3a830cb0d5b68e8f402791c3aaa5d1bcf2df673))
* **kinesis:** Basic stream level metrics ([#12556](https://github.com/aws/aws-cdk/issues/12556)) ([5f1b576](https://github.com/aws/aws-cdk/commit/5f1b57603330e707bc68f56c267a9e45faa29e55)), closes [#12555](https://github.com/aws/aws-cdk/issues/12555)
* **rds:** allow turning on IAM authentication for Clusters ([#13958](https://github.com/aws/aws-cdk/issues/13958)) ([0e59708](https://github.com/aws/aws-cdk/commit/0e597087bb375a02ac1ce3134d52cf3ee03bb54e)), closes [#13722](https://github.com/aws/aws-cdk/issues/13722)

### Bug Fixes

* **aws-cloudwatch:** fix for space in alarm name in alarms for compos… ([#13963](https://github.com/aws/aws-cdk/issues/13963)) ([7cdd541](https://github.com/aws/aws-cdk/commit/7cdd5412e9fed7f9bf877c448196b42725b8edbf))
* **cfn-include:** correctly parse Fn::Sub expressions containing serialized JSON ([#14512](https://github.com/aws/aws-cdk/issues/14512)) ([fd6d6d0](https://github.com/aws/aws-cdk/commit/fd6d6d0a563816ace616dfe48b3a03f4559636f7)), closes [#14095](https://github.com/aws/aws-cdk/issues/14095)
* `assert` matches more than the template on multiple CDK copies ([#14544](https://github.com/aws/aws-cdk/issues/14544)) ([f8abdbf](https://github.com/aws/aws-cdk/commit/f8abdbfb37ba9efd9e24414f5b64d90f4cf3f7cb)), closes [#14468](https://github.com/aws/aws-cdk/issues/14468)
* **cli:** 'cdk deploy *' should not deploy stacks in nested assemblies ([#14542](https://github.com/aws/aws-cdk/issues/14542)) ([93a3549](https://github.com/aws/aws-cdk/commit/93a3549e7a9791b5074dc95909f3289970800c10))
* **cli:** 'cdk synth' not able to fail if stacks have errors ([#14475](https://github.com/aws/aws-cdk/issues/14475)) ([963d1c7](https://github.com/aws/aws-cdk/commit/963d1c7755e23ea819481724d7e8c78e31d82294))
* **CodeBuild:** add resource only once per secret ([#14510](https://github.com/aws/aws-cdk/issues/14510)) ([affaaad](https://github.com/aws/aws-cdk/commit/affaaad4d65e6d4e42a7af465ed990954a0c122a))
* **lambda-nodejs:** non-deterministic runtime version ([#14538](https://github.com/aws/aws-cdk/issues/14538)) ([527f662](https://github.com/aws/aws-cdk/commit/527f6622146f007035ca669c33ad73861afe608a)), closes [#13893](https://github.com/aws/aws-cdk/issues/13893)
* **rds:** instance identifiers and endpoints of a Cluster are blank ([#14394](https://github.com/aws/aws-cdk/issues/14394)) ([9597d97](https://github.com/aws/aws-cdk/commit/9597d974bc710afd506606dcc7dd11e32b86cff5)), closes [#14377](https://github.com/aws/aws-cdk/issues/14377)
* **s3:** urlForObject does not consider explicit bucket region ([#14315](https://github.com/aws/aws-cdk/issues/14315)) ([e11d537](https://github.com/aws/aws-cdk/commit/e11d5378c33bea609ed09c998b305fdfd28999a9))
* **ssm:** dynamic SSM parameter reference breaks with lists ([#14527](https://github.com/aws/aws-cdk/issues/14527)) ([3d1baac](https://github.com/aws/aws-cdk/commit/3d1baaca015443d7ee0eecdec9e81dd61e8920ad)), closes [#14205](https://github.com/aws/aws-cdk/issues/14205) [#14476](https://github.com/aws/aws-cdk/issues/14476)

## [2.0.0-rc.1](https://github.com/aws/aws-cdk/compare/v2.0.0-alpha.14...v2.0.0-rc.1) (2021-04-28)

## [2.0.0-alpha.14](https://github.com/aws/aws-cdk/compare/v2.0.0-alpha.13...v2.0.0-alpha.14) (2021-04-28)


### ⚠ BREAKING CHANGES TO EXPERIMENTAL FEATURES

* **neptune:** `InstanceType` changed from enum to enum-like static factory.

### Features

* **aws-autoscaling:** add support for NewInstancesProtectedFromScaleIn ([#14283](https://github.com/aws/aws-cdk/issues/14283)) ([da9828b](https://github.com/aws/aws-cdk/commit/da9828b829df248d1c3cf8c6011507561328fd5e))
* **custom-resources:**  AwsSdkCall can assume Role for cross-account custom resources ([#13916](https://github.com/aws/aws-cdk/issues/13916)) ([a0690b9](https://github.com/aws/aws-cdk/commit/a0690b970e5c260b17ccf92df052b6bb1291df99))
* **ec2:** create NAT Gateways with fixed IPs ([#14250](https://github.com/aws/aws-cdk/issues/14250)) ([24c992a](https://github.com/aws/aws-cdk/commit/24c992ac779fd18829d3597f45dd53141d49594a)), closes [#11884](https://github.com/aws/aws-cdk/issues/11884) [#4067](https://github.com/aws/aws-cdk/issues/4067)
* **events:** API Gateway target ([#13823](https://github.com/aws/aws-cdk/issues/13823)) ([ce789bf](https://github.com/aws/aws-cdk/commit/ce789bf6a451e5f93a846cdcc672c2bba071dd20)), closes [#12708](https://github.com/aws/aws-cdk/issues/12708)
* **iam:** add imported user to a group ([#13698](https://github.com/aws/aws-cdk/issues/13698)) ([bf513bc](https://github.com/aws/aws-cdk/commit/bf513bc55e324d5d0ac23c2ddaa1d570a8d2ea1a))
* **neptune:** change InstanceType to class that is built from string ([#14273](https://github.com/aws/aws-cdk/issues/14273)) ([fc618f9](https://github.com/aws/aws-cdk/commit/fc618f97128ab1dc25b735bd634c52f2c47ef457)), closes [#13923](https://github.com/aws/aws-cdk/issues/13923)
* **secretsmanager:** replicate secrets to multiple regions ([#14266](https://github.com/aws/aws-cdk/issues/14266)) ([b3c288d](https://github.com/aws/aws-cdk/commit/b3c288d7c5781ecb5de90c962a2b68191ed072e1)), closes [#14061](https://github.com/aws/aws-cdk/issues/14061)


### Bug Fixes

* **aws-ecs-patterns, aws-elasticloadbalancingv2:** Pass TargetGroup P… ([#14092](https://github.com/aws/aws-cdk/issues/14092)) ([a655819](https://github.com/aws/aws-cdk/commit/a655819128c11309d88d5f5535678e8c02e292a9)), closes [#14091](https://github.com/aws/aws-cdk/issues/14091)
* **codebuild:** Secret env variable from another account fails on Key decryption ([#14226](https://github.com/aws/aws-cdk/issues/14226)) ([8214338](https://github.com/aws/aws-cdk/commit/82143381ef886a3ae39246ba780efca8e24d679d)), closes [#14043](https://github.com/aws/aws-cdk/issues/14043)
* **codepipeline-actions:** CodeCommit source action fails when it's cross-account ([#14260](https://github.com/aws/aws-cdk/issues/14260)) ([1508e60](https://github.com/aws/aws-cdk/commit/1508e6076aa1d2df3129d734a80defd5e11480e3)), closes [#12391](https://github.com/aws/aws-cdk/issues/12391) [#14156](https://github.com/aws/aws-cdk/issues/14156)
* **ec2:** r5ad instance-type has incorrect value ([#14179](https://github.com/aws/aws-cdk/issues/14179)) ([c80e1cf](https://github.com/aws/aws-cdk/commit/c80e1cfc2ae42158bff544ce48394ee1d1ae9a7b))
* **iam:** unable to configure name of SAML Provider ([#14296](https://github.com/aws/aws-cdk/issues/14296)) ([904202a](https://github.com/aws/aws-cdk/commit/904202a63760afffadc368e73c22bf4ef4021eee)), closes [#14294](https://github.com/aws/aws-cdk/issues/14294)
* **pipelines:** Use LinuxBuildImage.STANDARD_5_0 for Assets and UpdatePipeline stages ([#14338](https://github.com/aws/aws-cdk/issues/14338)) ([f93d940](https://github.com/aws/aws-cdk/commit/f93d9401309cb2af6ea45760c9bc6442fc608def))

## [2.0.0-alpha.13](https://github.com/aws/aws-cdk/compare/v2.0.0-alpha.12...v2.0.0-alpha.13) (2021-04-21)

## [2.0.0-alpha.12](https://github.com/aws/aws-cdk/compare/v2.0.0-alpha.11...v2.0.0-alpha.12) (2021-04-21)


### ⚠ BREAKING CHANGES TO EXPERIMENTAL FEATURES

* **appmesh:** HTTP2 `VirtualNodeListener`s must be now created with `Http2VirtualNodeListenerOptions`
* **appmesh**: HTTP2 `VirtualGatewayListener`s must be now created with `Http2VirtualGatewayListenerOptions`

### Features

* **apigateway:** integration timeout ([#14154](https://github.com/aws/aws-cdk/issues/14154)) ([d02770e](https://github.com/aws/aws-cdk/commit/d02770ead89d87e55d36490f5d1fa2a4b8a591f2)), closes [#14123](https://github.com/aws/aws-cdk/issues/14123)
* **appmesh:** add Connection Pools for VirtualNode and VirtualGateway ([#13917](https://github.com/aws/aws-cdk/issues/13917)) ([8a949dc](https://github.com/aws/aws-cdk/commit/8a949dc24b13f8b7da17c102501050bac7323bf7)), closes [#11647](https://github.com/aws/aws-cdk/issues/11647)


### Bug Fixes

* **codepipeline:** detect the account of the Action from its backing resource's account, not its Stack's account ([#14224](https://github.com/aws/aws-cdk/issues/14224)) ([d88e915](https://github.com/aws/aws-cdk/commit/d88e915c45378cac6a1c7eb31b015391e74f6503)), closes [#14165](https://github.com/aws/aws-cdk/issues/14165)
* **pipelines:** incorrect BuildSpec in synth step if synthesized with `--output` ([#14211](https://github.com/aws/aws-cdk/issues/14211)) ([0f5c74f](https://github.com/aws/aws-cdk/commit/0f5c74f76ad023b163777b8b95f8dbc357994087)), closes [#13303](https://github.com/aws/aws-cdk/issues/13303)

## [2.0.0-alpha.11](https://github.com/aws/aws-cdk/compare/v2.0.0-alpha.10...v2.0.0-alpha.11) (2021-04-19)


### ⚠ BREAKING CHANGES TO EXPERIMENTAL FEATURES

* **codepipeline-actions:** the Action `ServiceCatalogDeployAction` has been renamed to `ServiceCatalogDeployActionBeta1`
* **codepipeline-actions**: the type `ServiceCatalogDeployActionProps` has been renamed to `ServiceCatalogDeployActionBeta1Props`

### Features

* **certificatemanager:** allow tagging DnsValidatedCertificate ([#13990](https://github.com/aws/aws-cdk/issues/13990)) ([8360feb](https://github.com/aws/aws-cdk/commit/8360feb58fdc7b1150eca87767e3b71a5e30f50d)), closes [#12382](https://github.com/aws/aws-cdk/issues/12382) [#12382](https://github.com/aws/aws-cdk/issues/12382)
* **codebuild:** allow setting concurrent build limit ([#14185](https://github.com/aws/aws-cdk/issues/14185)) ([3107d03](https://github.com/aws/aws-cdk/commit/3107d03ed2de331ba0eae8ca028aa9a7dbf5a881))
* **codepipeline:** introduce the Action abstract class ([#14009](https://github.com/aws/aws-cdk/issues/14009)) ([4b6a6cc](https://github.com/aws/aws-cdk/commit/4b6a6cc0e11fd2057b9e23105791098b47c5ca35))
* **ecs:** add support for elastic inference accelerators in ECS task defintions ([#13950](https://github.com/aws/aws-cdk/issues/13950)) ([23986d7](https://github.com/aws/aws-cdk/commit/23986d70c5cd69ce212b5ffdc1bcf059f438f15b)), closes [#12460](https://github.com/aws/aws-cdk/issues/12460)
* **eks:** Pass bootstrap.sh args to avoid DescribeCluster call and make nodes join the cluster faster ([#12659](https://github.com/aws/aws-cdk/issues/12659)) ([f5616cc](https://github.com/aws/aws-cdk/commit/f5616cc4692975b22db5db4625562dfd0d641045))
* **elasticloadbalancing:** rename 'sslCertificateId' property of LB listener to 'sslCertificateArn'; deprecate sslCertificateId  property ([#13766](https://github.com/aws/aws-cdk/issues/13766)) ([1a30272](https://github.com/aws/aws-cdk/commit/1a30272c8bd99a919bde695b5b1b1f5cb458cb64)), closes [#9303](https://github.com/aws/aws-cdk/issues/9303) [#9303](https://github.com/aws/aws-cdk/issues/9303)


### Bug Fixes

* **aws-cloudfront:** distribution comment length not validated ([#14020](https://github.com/aws/aws-cdk/issues/14020)) ([#14094](https://github.com/aws/aws-cdk/issues/14094)) ([54fddc6](https://github.com/aws/aws-cdk/commit/54fddc64c7b541f9192fb904fa9a3b44b8aacf90))
* **aws-ecs-patterns:** fixes [#11123](https://github.com/aws/aws-cdk/issues/11123) allow for https listeners to use non Route 53 DNS if a certificate is provided ([#14004](https://github.com/aws/aws-cdk/issues/14004)) ([e6c85e4](https://github.com/aws/aws-cdk/commit/e6c85e4167cdb38ed056eda17b869e179a6dd1c5))
* **cfn-include:** allow deploy-time values in Parameter substitutions in Fn::Sub expressions ([#14068](https://github.com/aws/aws-cdk/issues/14068)) ([111d26a](https://github.com/aws/aws-cdk/commit/111d26a30d220a319bbb7b1b1696aafac865e009)), closes [#14047](https://github.com/aws/aws-cdk/issues/14047)
* **core:** `toJsonString()` does not deal correctly with list tokens ([#14138](https://github.com/aws/aws-cdk/issues/14138)) ([1a6d39f](https://github.com/aws/aws-cdk/commit/1a6d39fc3f22e2fc36949226e8a07f59a92a0bbf)), closes [#14088](https://github.com/aws/aws-cdk/issues/14088)
* **fsx:** Weekday.SUNDAY incorrectly evaluates to 0 (should be 7) ([#14081](https://github.com/aws/aws-cdk/issues/14081)) ([708f23e](https://github.com/aws/aws-cdk/commit/708f23e78fb0eff2aa17593c530500eb0b94067a)), closes [#14080](https://github.com/aws/aws-cdk/issues/14080)
* **rds:** allow Instances to be referenced across environments ([#13865](https://github.com/aws/aws-cdk/issues/13865)) ([74c7fff](https://github.com/aws/aws-cdk/commit/74c7ffffb48fe5578a405b319cc0df973ceb9989)), closes [#13832](https://github.com/aws/aws-cdk/issues/13832)


* **codepipeline-actions:** change the name of the ServiceCatalogDeployAction ([#13780](https://github.com/aws/aws-cdk/issues/13780)) ([a99e901](https://github.com/aws/aws-cdk/commit/a99e9015b2308c99c6b68c3727f839aa039e4fe3))

## [2.0.0-alpha.10](https://github.com/aws/aws-cdk/compare/v2.0.0-alpha.6...v2.0.0-alpha.10) (2021-03-31)


### ⚠ BREAKING CHANGES TO EXPERIMENTAL FEATURES

* **core:** The type of the `image` property in `BundlingOptions`
is changed from `BundlingDockerImage` to `DockerImage`.
* **core:** The return type of the `DockerImage.fromBuild()` API is
changed from `BundlingDockerImage` to `DockerImage`.
* **lambda-nodejs:** The type of `image` property in the
`Bundling` class is changed from `BundlingDockerImage` to
`DockerImage`.
* **lambda-nodejs**: The type of `dockerImage` property in
`BundlingOptions` is changed from `BundlingDockerImage` to
`DockerImage`.
* **apigatewayv2:** The type of `allowMethods` property under `corsPreflight`
section is changed from `HttpMethod` to `CorsHttpMethod`.
* **lambda-nodejs:** the default runtime of a `NodejsFunction` is now Node.js 14.x if the environment from which it is deployed uses Node.js >= 14 and Node.js 12.x otherwise.
* **appmesh:** Backend, backend default and Virtual Service client policies structures are being altered
* **appmesh**: you must use the backend default interface to define backend defaults in `VirtualGateway`.
  The property name also changed from `backendsDefaultClientPolicy` to `backendDefaults`
* **appmesh**:  you must use the backend default interface to define backend defaults in `VirtualNode`,
  (the property name also changed from `backendsDefaultClientPolicy` to `backendDefaults`),
  and the `Backend` class to define a backend
* **appmesh**: you can no longer attach a client policy to a `VirtualService`
* **apigatewayv2:** `HttpApiMapping` (and related interfaces for `Attributed` and `Props`) has been renamed to `ApiMapping`
* **apigatewayv2:** `CommonStageOptions` has been renamed to `StageOptions`
* **apigatewayv2:** `HttpStage.fromStageName` has been removed in favour of `HttpStage.fromHttpStageAttributes`
* **apigatewayv2:** `DefaultDomainMappingOptions` has been removed in favour of `DomainMappingOptions`
* **apigatewayv2:** `HttpApiProps.defaultDomainMapping` has been changed from `DefaultDomainMappingOptions` to `DomainMappingOptions`
* **apigatewayv2:** `HttpApi.defaultStage` has been changed from `HttpStage` to `IStage`
* **apigatewayv2:** `IHttpApi.defaultStage` has been removed

### Features

* **acmpca:** make the ACM PCA module Generally Available (stable) ([#13778](https://github.com/aws/aws-cdk/issues/13778)) ([7ca79ff](https://github.com/aws/aws-cdk/commit/7ca79ffad7c18692edaa2dd26cd0d4d441ecf468))
* **amplify-domain:** Added config for auto subdomain creation ([#13342](https://github.com/aws/aws-cdk/issues/13342)) ([4c63f09](https://github.com/aws/aws-cdk/commit/4c63f09f1e9644877eaffbe78eede3854bec08ab))
* **apigatewayv2:** http api - default authorizer options ([#13172](https://github.com/aws/aws-cdk/issues/13172)) ([53d9661](https://github.com/aws/aws-cdk/commit/53d96618ac006d7b3f6282c8b5c4ae7aeed2b104))
* **apigatewayv2:** websocket api ([#13031](https://github.com/aws/aws-cdk/issues/13031)) ([fe1c839](https://github.com/aws/aws-cdk/commit/fe1c8393e0840fb273c4a5f325cb3cebc784bf4b)), closes [#2872](https://github.com/aws/aws-cdk/issues/2872)
* **appmesh:** add missing route match features ([#13350](https://github.com/aws/aws-cdk/issues/13350)) ([b71efd9](https://github.com/aws/aws-cdk/commit/b71efd9d12843ab4b495d53e565cec97d60748f3)), closes [#11645](https://github.com/aws/aws-cdk/issues/11645)
* **appmesh:** add route retry policies ([#13353](https://github.com/aws/aws-cdk/issues/13353)) ([66f7053](https://github.com/aws/aws-cdk/commit/66f7053a6c1f5cab540e975b30f5a2c6e35df58a)), closes [#11642](https://github.com/aws/aws-cdk/issues/11642)
* **aws-elasticloadbalancingv2:** add protocol version for ALB TargetGroups ([#13570](https://github.com/aws/aws-cdk/issues/13570)) ([165a3d8](https://github.com/aws/aws-cdk/commit/165a3d877b7ab23f29e42e1e74ee7c5cb35b7f24)), closes [#12869](https://github.com/aws/aws-cdk/issues/12869)
* **aws-events:** Event Bus target ([#12926](https://github.com/aws/aws-cdk/issues/12926)) ([ea91aa3](https://github.com/aws/aws-cdk/commit/ea91aa31db9e2f31c734ad6d7e1f64d5d432dfd4)), closes [#9473](https://github.com/aws/aws-cdk/issues/9473)
* **aws-route53-targets:** add global accelerator target to route53 alias targets ([#13407](https://github.com/aws/aws-cdk/issues/13407)) ([2672a55](https://github.com/aws/aws-cdk/commit/2672a55c393e5ce7dd9a230d921ec1be1a23e32a)), closes [#12839](https://github.com/aws/aws-cdk/issues/12839)
* **cfnspec:** cloudformation spec v30.0.0 ([#13365](https://github.com/aws/aws-cdk/issues/13365)) ([ae0185d](https://github.com/aws/aws-cdk/commit/ae0185dd089e3bb7c5639ebc1bce3f95e126f71c))
* **cfnspec:** cloudformation spec v30.1.0 ([#13519](https://github.com/aws/aws-cdk/issues/13519)) ([7711981](https://github.com/aws/aws-cdk/commit/7711981ea30bfdffd21dd840d676be4a2b45c9ba))
* **cfnspec:** cloudformation spec v31.0.0 ([#13633](https://github.com/aws/aws-cdk/issues/13633)) ([9b1c786](https://github.com/aws/aws-cdk/commit/9b1c786846f68fdac94b04b76d546c3d47e2251c))
* **cfnspec:** cloudformation spec v31.1.0 ([#13763](https://github.com/aws/aws-cdk/issues/13763)) ([41a2b2e](https://github.com/aws/aws-cdk/commit/41a2b2ef39a3d2b46ae6e2c6f3480e786e8022b9))
* **cloudwatch:** EC2 actions ([#13281](https://github.com/aws/aws-cdk/issues/13281)) ([319cfcd](https://github.com/aws/aws-cdk/commit/319cfcdaaf92e4e6edb8c2388d04dce0971aaf86)), closes [#13228](https://github.com/aws/aws-cdk/issues/13228)
* **codebuild:** allow setting queued timeout ([#13467](https://github.com/aws/aws-cdk/issues/13467)) ([e09250b](https://github.com/aws/aws-cdk/commit/e09250bc92c62cb8ee0a8706ce90d0e82faf2d84)), closes [#11364](https://github.com/aws/aws-cdk/issues/11364)
* **codepipeline-actions:** Add detectChanges option to BitBucketSourceAction ([#13656](https://github.com/aws/aws-cdk/issues/13656)) ([f2436bf](https://github.com/aws/aws-cdk/commit/f2436bf4ff3ce7665a6cde318ad3fc7716ca941f))
* **cognito:** user pools - sign in with apple ([#13160](https://github.com/aws/aws-cdk/issues/13160)) ([b965589](https://github.com/aws/aws-cdk/commit/b965589358f4c281aea36404276f08128e6ff3db))
* **core:** `description` parameter in the CustomResourceProvider ([#13275](https://github.com/aws/aws-cdk/issues/13275)) ([78831cf](https://github.com/aws/aws-cdk/commit/78831cf9dec0407e7d827711183ac47be070f480)), closes [#13277](https://github.com/aws/aws-cdk/issues/13277) [#13276](https://github.com/aws/aws-cdk/issues/13276)
* **core:** customize bundling output packaging ([#13152](https://github.com/aws/aws-cdk/issues/13152)) ([6eca979](https://github.com/aws/aws-cdk/commit/6eca979f65542f3e44461588d8220e8c0bf76a6e))
* **dynamodb:** custom timeout for replication operation ([#13354](https://github.com/aws/aws-cdk/issues/13354)) ([6a5a4f2](https://github.com/aws/aws-cdk/commit/6a5a4f2d9bb6b09ad0d10066200fe53bb45f0737)), closes [#10249](https://github.com/aws/aws-cdk/issues/10249)
* **ec2:** Add VPC endpoint for RDS ([#12497](https://github.com/aws/aws-cdk/issues/12497)) ([fc87574](https://github.com/aws/aws-cdk/commit/fc8757437c37a0947cced720ff363b8858850f72)), closes [#12402](https://github.com/aws/aws-cdk/issues/12402)
* **ec2:** client vpn endpoint ([#12234](https://github.com/aws/aws-cdk/issues/12234)) ([4fde59a](https://github.com/aws/aws-cdk/commit/4fde59ac64e8440a05d17a9b5c5622a9dfb43b1f)), closes [#4206](https://github.com/aws/aws-cdk/issues/4206)
* **ec2:** ESP and AH IPsec protocols for Security Groups ([#13471](https://github.com/aws/aws-cdk/issues/13471)) ([f5a6647](https://github.com/aws/aws-cdk/commit/f5a6647bbe1885ba86029d10550a3ffaf80b6561)), closes [#13403](https://github.com/aws/aws-cdk/issues/13403)
* **ec2:** multipart user data ([#11843](https://github.com/aws/aws-cdk/issues/11843)) ([ed94c5e](https://github.com/aws/aws-cdk/commit/ed94c5ef1b9dd3042128b0e0c5bb14b3d9c7d497)), closes [#8315](https://github.com/aws/aws-cdk/issues/8315)
* **ecr:** add imageTagMutability prop ([#10557](https://github.com/aws/aws-cdk/issues/10557)) ([c4dc3bc](https://github.com/aws/aws-cdk/commit/c4dc3bce02790903593d80b070fca81fe7b7f08c)), closes [#4640](https://github.com/aws/aws-cdk/issues/4640)
* **ecs:** ability to access tag parameter value of TagParameterContainerImage ([#13340](https://github.com/aws/aws-cdk/issues/13340)) ([e567a41](https://github.com/aws/aws-cdk/commit/e567a410d47366855ee3e6011aa096ba987b8099)), closes [#13202](https://github.com/aws/aws-cdk/issues/13202)
* **ecs:** add port mappings to containers with props ([#13262](https://github.com/aws/aws-cdk/issues/13262)) ([f511639](https://github.com/aws/aws-cdk/commit/f511639bba156f6edd15896a4dd8e27b07671ea1)), closes [#13261](https://github.com/aws/aws-cdk/issues/13261)
* **ecs:** allow selection of container and port for SRV service discovery records ([#12798](https://github.com/aws/aws-cdk/issues/12798)) ([a452bc3](https://github.com/aws/aws-cdk/commit/a452bc385640762a043392a717d49de29abcc64e)), closes [#12796](https://github.com/aws/aws-cdk/issues/12796)
* **ecs:** allow users to provide a CloudMap service to associate with an ECS service ([#13192](https://github.com/aws/aws-cdk/issues/13192)) ([a7d314c](https://github.com/aws/aws-cdk/commit/a7d314c73b9473208d94bac29ad9bd8018e00204)), closes [#10057](https://github.com/aws/aws-cdk/issues/10057)
* **ecs-patterns:** Add ECS deployment circuit breaker support to higher-level constructs ([#12719](https://github.com/aws/aws-cdk/issues/12719)) ([e80a98a](https://github.com/aws/aws-cdk/commit/e80a98aa8839e9b9b89701158d82b991e9ebaa65)), closes [#12534](https://github.com/aws/aws-cdk/issues/12534) [#12360](https://github.com/aws/aws-cdk/issues/12360)
* **elbv2:** allow control of ingress rules on redirect listener ([#12768](https://github.com/aws/aws-cdk/issues/12768)) ([b7b441f](https://github.com/aws/aws-cdk/commit/b7b441f74a07d26fd8de23df84e7ab4663c89c0c)), closes [#12766](https://github.com/aws/aws-cdk/issues/12766)
* **events:** `EventBus.grantPutEventsTo` method for granular grants ([#13429](https://github.com/aws/aws-cdk/issues/13429)) ([122a232](https://github.com/aws/aws-cdk/commit/122a232343699304d8f206d3024fcddfb2a94bc8)), closes [#11228](https://github.com/aws/aws-cdk/issues/11228)
* **events:** archive events ([#12060](https://github.com/aws/aws-cdk/issues/12060)) ([465cd9c](https://github.com/aws/aws-cdk/commit/465cd9c434acff74070ca6d33891e1481e253128)), closes [#11531](https://github.com/aws/aws-cdk/issues/11531)
* **events:** dead letter queue for Lambda Targets ([#11617](https://github.com/aws/aws-cdk/issues/11617)) ([1bb3650](https://github.com/aws/aws-cdk/commit/1bb3650c5dd2087b05793a5e903cdfb80fc5c1ad)), closes [#11612](https://github.com/aws/aws-cdk/issues/11612)
* **events:** dead-letter queue support for CodeBuild  ([#13448](https://github.com/aws/aws-cdk/issues/13448)) ([abfc0ea](https://github.com/aws/aws-cdk/commit/abfc0ea63c10d8033a529b7497cf093e318fdf12)), closes [#13447](https://github.com/aws/aws-cdk/issues/13447)
* **events:** dead-letter queue support for StepFunctions ([#13450](https://github.com/aws/aws-cdk/issues/13450)) ([0ebcb41](https://github.com/aws/aws-cdk/commit/0ebcb4160ee16f0f7ff1072a40c8951f9a983048)), closes [#13449](https://github.com/aws/aws-cdk/issues/13449)
* **events:** retry-policy support ([#13660](https://github.com/aws/aws-cdk/issues/13660)) ([7966f8d](https://github.com/aws/aws-cdk/commit/7966f8d48c4bff26beb22856d289f9d0c7e7081d)), closes [#13659](https://github.com/aws/aws-cdk/issues/13659)
* **events,applicationautoscaling:** schedule can be a token ([#13064](https://github.com/aws/aws-cdk/issues/13064)) ([b1449a1](https://github.com/aws/aws-cdk/commit/b1449a178b0f9a8a951c2546428f8d75c6431f0f))
* **iam:** SAML identity provider ([#13393](https://github.com/aws/aws-cdk/issues/13393)) ([faa0c06](https://github.com/aws/aws-cdk/commit/faa0c060dad9a5045495707e28fc85f223d4db5d)), closes [#5320](https://github.com/aws/aws-cdk/issues/5320)
* **init-templates:** app template comes with hint comments for 'env' ([#13696](https://github.com/aws/aws-cdk/issues/13696)) ([b940710](https://github.com/aws/aws-cdk/commit/b9407102304f043adcd9a4fc1cde4d23d3da9004)), closes [#12321](https://github.com/aws/aws-cdk/issues/12321)
* **lambda:** Code.fromDockerBuild ([#13318](https://github.com/aws/aws-cdk/issues/13318)) ([ad01099](https://github.com/aws/aws-cdk/commit/ad01099d5b8f835c3b87d7d20fd2dc1a5df2fd6f)), closes [#13273](https://github.com/aws/aws-cdk/issues/13273)
* **lambda-event-sources:** msk and self-managed kafka event sources ([#12507](https://github.com/aws/aws-cdk/issues/12507)) ([73209e1](https://github.com/aws/aws-cdk/commit/73209e17f314cf61f703d51ef3b9f197d2f1bdc3)), closes [#12099](https://github.com/aws/aws-cdk/issues/12099)
* **lambda-event-sources:** support for batching window to sqs event source ([#13406](https://github.com/aws/aws-cdk/issues/13406)) ([6743e3b](https://github.com/aws/aws-cdk/commit/6743e3bb79a8281a4be5677fff018d702c85038d)), closes [#11722](https://github.com/aws/aws-cdk/issues/11722) [#11724](https://github.com/aws/aws-cdk/issues/11724) [#13770](https://github.com/aws/aws-cdk/issues/13770)
* **lambda-event-sources:** tumbling window ([#13412](https://github.com/aws/aws-cdk/issues/13412)) ([e9f2773](https://github.com/aws/aws-cdk/commit/e9f2773aedeb7f01ebf2a05face719be9bb8b0d7)), closes [#13411](https://github.com/aws/aws-cdk/issues/13411)
* **neptune:** high level constructs for db clusters and instances ([#12763](https://github.com/aws/aws-cdk/issues/12763)) ([c366837](https://github.com/aws/aws-cdk/commit/c36683701d88eb0c53fdd2add66b10c47c05f56b)), closes [aws#12762](https://github.com/aws/aws/issues/12762)
* **neptune:** Support IAM authentication ([#13462](https://github.com/aws/aws-cdk/issues/13462)) ([6c5b1f4](https://github.com/aws/aws-cdk/commit/6c5b1f42fb73a132d47945b529bab73557f2b9d8)), closes [#13461](https://github.com/aws/aws-cdk/issues/13461)
* **rds:** make rds secret name configurable ([#13626](https://github.com/aws/aws-cdk/issues/13626)) ([62a91b7](https://github.com/aws/aws-cdk/commit/62a91b7a30f8b6419a983d7ea7bdb3c39f2fdfd0)), closes [#8984](https://github.com/aws/aws-cdk/issues/8984)
* **region-info:** added AppMesh ECR account for af-south-1 region ([#12814](https://github.com/aws/aws-cdk/issues/12814)) ([b3fba43](https://github.com/aws/aws-cdk/commit/b3fba43a047df61e713e8d2271d6deee7e07b716))
* **sns:** enable passing PolicyDocument to TopicPolicy ([#10559](https://github.com/aws/aws-cdk/issues/10559)) ([0d9c300](https://github.com/aws/aws-cdk/commit/0d9c300f5244d3e5720832343830947f6cc5b352)), closes [#7934](https://github.com/aws/aws-cdk/issues/7934)
* **stepfunctions-tasks:** Support calling ApiGateway REST and HTTP APIs ([#13033](https://github.com/aws/aws-cdk/issues/13033)) ([cc608d0](https://github.com/aws/aws-cdk/commit/cc608d055ffefb798ad6378ab07f36cb241897da)), closes [#11565](https://github.com/aws/aws-cdk/issues/11565) [#11566](https://github.com/aws/aws-cdk/issues/11566) [#11565](https://github.com/aws/aws-cdk/issues/11565)


### Bug Fixes

* **apigatewayv2:** error while configuring ANY as an allowed method in CORS ([#13313](https://github.com/aws/aws-cdk/issues/13313)) ([34bb338](https://github.com/aws/aws-cdk/commit/34bb338bfc8e2976691a23969baa5fd9d84727e8)), closes [#13280](https://github.com/aws/aws-cdk/issues/13280) [#13643](https://github.com/aws/aws-cdk/issues/13643)
* **appmesh:** Move Client Policy from Virtual Service to backend structure ([#12943](https://github.com/aws/aws-cdk/issues/12943)) ([d3f4284](https://github.com/aws/aws-cdk/commit/d3f428435976c55ca950279cfc841665fd504370)), closes [#11996](https://github.com/aws/aws-cdk/issues/11996)
* **autoscaling:** AutoScaling on percentile metrics doesn't work ([#13366](https://github.com/aws/aws-cdk/issues/13366)) ([46114bb](https://github.com/aws/aws-cdk/commit/46114bb1f4702019a8873b9162d0a9f10763bc61)), closes [#13144](https://github.com/aws/aws-cdk/issues/13144)
* **aws-ecs:** drain hook lambda allows tasks to stop gracefully ([#13559](https://github.com/aws/aws-cdk/issues/13559)) ([3e1148e](https://github.com/aws/aws-cdk/commit/3e1148e74dce0e15379e2cfa372bd367183f9c6f)), closes [#13506](https://github.com/aws/aws-cdk/issues/13506)
* **cfn-include:** allow boolean values for string-typed properties ([#13508](https://github.com/aws/aws-cdk/issues/13508)) ([e5dab7c](https://github.com/aws/aws-cdk/commit/e5dab7cbc67c234d191c38a8b8b84b634070b15b))
* **cfn-include:** allow dynamic mappings to be used in Fn::FindInMap ([#13428](https://github.com/aws/aws-cdk/issues/13428)) ([623675d](https://github.com/aws/aws-cdk/commit/623675d2f8fb2786f23beb87994e687e8a7c6612))
* **cloudfront:** cannot add two EdgeFunctions with same aliases ([#13324](https://github.com/aws/aws-cdk/issues/13324)) ([1f35351](https://github.com/aws/aws-cdk/commit/1f3535145d22b2b13ebbcbfe31a3bfd73519352d)), closes [#13237](https://github.com/aws/aws-cdk/issues/13237)
* **cloudwatch:** cannot create Alarms from labeled metrics that start with a digit ([#13560](https://github.com/aws/aws-cdk/issues/13560)) ([278029f](https://github.com/aws/aws-cdk/commit/278029f25b41d956091835364e5a8de91429712c)), closes [#13434](https://github.com/aws/aws-cdk/issues/13434)
* **cloudwatch:** MathExpression period of <5 minutes is not respected ([#13078](https://github.com/aws/aws-cdk/issues/13078)) ([d9ee914](https://github.com/aws/aws-cdk/commit/d9ee91432918aa113f728abdd61295096ed1512f)), closes [#9156](https://github.com/aws/aws-cdk/issues/9156)
* **cloudwatch:** metric `label` not rendered into Alarms ([#13070](https://github.com/aws/aws-cdk/issues/13070)) ([cbcc712](https://github.com/aws/aws-cdk/commit/cbcc712e0c4c44c83c7f4d1e8a544bccfa26bb56))
* **codebuild:** allow FILE_PATH webhook filter for BitBucket ([#13186](https://github.com/aws/aws-cdk/issues/13186)) ([cbed348](https://github.com/aws/aws-cdk/commit/cbed3488f03bdfba16f3950bda653535c8999db1)), closes [#13175](https://github.com/aws/aws-cdk/issues/13175)
* **codebuild:** allow passing the ARN of the Secret in environment variables ([#13706](https://github.com/aws/aws-cdk/issues/13706)) ([6f6e079](https://github.com/aws/aws-cdk/commit/6f6e079569fcdb7e0631717fbe269e94f8f7b127)), closes [#12703](https://github.com/aws/aws-cdk/issues/12703)
* **codebuild:** Fixed build spec file format to return yaml ([#13445](https://github.com/aws/aws-cdk/issues/13445)) ([fab93c6](https://github.com/aws/aws-cdk/commit/fab93c63ba68c6398499e7df87a56a70d854ab88))
* **codebuild:** module fails to load with error "Cannot use import statement outside a module" ([b1ffd33](https://github.com/aws/aws-cdk/commit/b1ffd335b6c41a26c1f88db2fc5a739c4c18c7fe)), closes [#13699](https://github.com/aws/aws-cdk/issues/13699) [#13699](https://github.com/aws/aws-cdk/issues/13699)
* **codedeploy:** script installing CodeDeploy agent fails ([#13758](https://github.com/aws/aws-cdk/issues/13758)) ([25e8d04](https://github.com/aws/aws-cdk/commit/25e8d04d7266a2642f11154750bef49a31b1892e)), closes [#13755](https://github.com/aws/aws-cdk/issues/13755)
* **codedeploy:** Use aws-cli instead of awscli for yum ([#13655](https://github.com/aws/aws-cdk/issues/13655)) ([449ce12](https://github.com/aws/aws-cdk/commit/449ce129b860ddc302e1e5270d5819ebe5aa27bf))
* **codepipeline-actions:** BitBucketAction fails with S3 "Access denied" error ([#13637](https://github.com/aws/aws-cdk/issues/13637)) ([77ce45d](https://github.com/aws/aws-cdk/commit/77ce45d878f2d1cb453e36ae4d83228bee878ef1)), closes [#13557](https://github.com/aws/aws-cdk/issues/13557)
* **cognito:** imported userpool not retaining environment from arn ([#13715](https://github.com/aws/aws-cdk/issues/13715)) ([aa9fd9c](https://github.com/aws/aws-cdk/commit/aa9fd9cd9bbaea4149927e08d57d29e547933f49)), closes [#13691](https://github.com/aws/aws-cdk/issues/13691)
* **core:** `toJsonString()` cannot handle list intrinsics ([#13544](https://github.com/aws/aws-cdk/issues/13544)) ([a5be042](https://github.com/aws/aws-cdk/commit/a5be04270c2a372132964ab13d080a16f1a6f00c)), closes [#13465](https://github.com/aws/aws-cdk/issues/13465)
* **core:** custom resource provider NODEJS_12 now looks like Lambda's NODEJS_12_X, add Node 14 ([#13301](https://github.com/aws/aws-cdk/issues/13301)) ([3413b2f](https://github.com/aws/aws-cdk/commit/3413b2f887596d11dfb53c0e99c2a1788095a2ad))
* **dynamodb:** replicas not created on table replacement ([#13300](https://github.com/aws/aws-cdk/issues/13300)) ([c7c424f](https://github.com/aws/aws-cdk/commit/c7c424fec42f1f14ab8bdc3011f5bdb602918aa3)), closes [#12332](https://github.com/aws/aws-cdk/issues/12332)
* **ec2:** fix typo's in WindowsImage constants ([#13446](https://github.com/aws/aws-cdk/issues/13446)) ([781aa97](https://github.com/aws/aws-cdk/commit/781aa97d53fdb7511c34ddde884fdcd84c3f68a6))
* **ec2:** NAT provider's default outbound rules cannot be disabled ([#12674](https://github.com/aws/aws-cdk/issues/12674)) ([664133a](https://github.com/aws/aws-cdk/commit/664133a35da2bd096a237971ce662f3dd38b297f)), closes [#12673](https://github.com/aws/aws-cdk/issues/12673)
* **ec2:** readme grammar ([#13180](https://github.com/aws/aws-cdk/issues/13180)) ([fe4f056](https://github.com/aws/aws-cdk/commit/fe4f05678c06d634d3fe9e1b608e444a57f67b9c))
* **ec2:** Security Groups support all protocols ([#13593](https://github.com/aws/aws-cdk/issues/13593)) ([8c6b3eb](https://github.com/aws/aws-cdk/commit/8c6b3ebea464e27f68ffcab32857d8baec29c413)), closes [#13403](https://github.com/aws/aws-cdk/issues/13403)
* **ec2:** Throw error on empty InitFile content ([#13009](https://github.com/aws/aws-cdk/issues/13009)) ([#13119](https://github.com/aws/aws-cdk/issues/13119)) ([81a78a3](https://github.com/aws/aws-cdk/commit/81a78a31408276ebb020e45b15ddca7a2c57ae50))
* **ecr:** Allow referencing an EcrImage by digest instead of tag ([#13299](https://github.com/aws/aws-cdk/issues/13299)) ([266a621](https://github.com/aws/aws-cdk/commit/266a621abfc34c62ff1e26de9cb8cf0687588f89)), closes [#5082](https://github.com/aws/aws-cdk/issues/5082)
* **ecr:** Generate valid CloudFormation for imageScanOnPush ([#13420](https://github.com/aws/aws-cdk/issues/13420)) ([278fba5](https://github.com/aws/aws-cdk/commit/278fba5df4a3d785e49bdb57ccf88fd34bacacbb)), closes [#13418](https://github.com/aws/aws-cdk/issues/13418)
* **ecs:** services essential container exceptions thrown too soon ([#13240](https://github.com/aws/aws-cdk/issues/13240)) ([c174f6c](https://github.com/aws/aws-cdk/commit/c174f6c2f4dd909e07be34b66bd6b3a92d5e8484)), closes [#13239](https://github.com/aws/aws-cdk/issues/13239)
* **elasticloadbalancingv2:** should allow more than 2 certificates ([#13332](https://github.com/aws/aws-cdk/issues/13332)) ([d3155e9](https://github.com/aws/aws-cdk/commit/d3155e97fd9331a4732396941ce4ad20613fe81c)), closes [#13150](https://github.com/aws/aws-cdk/issues/13150)
* **elasticloadbalancingv2:** upgrade to v1.92.0 drops certificates on ALB if more than 2 certificates exist ([#13490](https://github.com/aws/aws-cdk/issues/13490)) ([01b94f8](https://github.com/aws/aws-cdk/commit/01b94f8aa6c88b5e676c784aec4c879acddc042f)), closes [#13332](https://github.com/aws/aws-cdk/issues/13332) [#13437](https://github.com/aws/aws-cdk/issues/13437)
* **events:** cannot trigger multiple Lambdas from the same Rule ([#13260](https://github.com/aws/aws-cdk/issues/13260)) ([c8c1762](https://github.com/aws/aws-cdk/commit/c8c1762c213aad1062c3a0bc48b22b05c3a0a185)), closes [#13231](https://github.com/aws/aws-cdk/issues/13231)
* **init:** Python init template's stack ID doesn't match other languages ([#13480](https://github.com/aws/aws-cdk/issues/13480)) ([3f1c02d](https://github.com/aws/aws-cdk/commit/3f1c02dac7a50ce7caebce1e7f8953f6e4937e6b))
* use NodeJS 14 for all packaged custom resources ([#13488](https://github.com/aws/aws-cdk/issues/13488)) ([20a2820](https://github.com/aws/aws-cdk/commit/20a2820ee4d022663fcd0928fbc0f61153ae953f)), closes [#13534](https://github.com/aws/aws-cdk/issues/13534) [#13484](https://github.com/aws/aws-cdk/issues/13484)
* **events:** imported ECS Task Definition cannot be used as target ([#13293](https://github.com/aws/aws-cdk/issues/13293)) ([6f7cebd](https://github.com/aws/aws-cdk/commit/6f7cebdf61073cc1fb358fcac5f5b2156389cb81)), closes [#12811](https://github.com/aws/aws-cdk/issues/12811)
* **events:** imported EventBus does not correctly register source account ([#13481](https://github.com/aws/aws-cdk/issues/13481)) ([57e5404](https://github.com/aws/aws-cdk/commit/57e540432c1446f2233a9b0c0f4caba4e9e155d9)), closes [#13469](https://github.com/aws/aws-cdk/issues/13469)
* **events,applicationautoscaling:** specifying a schedule rate in seconds results in an error ([#13689](https://github.com/aws/aws-cdk/issues/13689)) ([5d62331](https://github.com/aws/aws-cdk/commit/5d6233164611d69ac1bf5c73e1518eb14dbace8d)), closes [#13566](https://github.com/aws/aws-cdk/issues/13566)
* **iam:** oidc-provider can't pull from hosts requiring SNI ([#13397](https://github.com/aws/aws-cdk/issues/13397)) ([90dbfb5](https://github.com/aws/aws-cdk/commit/90dbfb5eec19559717ac6b30f25451461027e731))
* **iam:** policy statement tries to validate tokens ([#13493](https://github.com/aws/aws-cdk/issues/13493)) ([8d592ea](https://github.com/aws/aws-cdk/commit/8d592ea89c0eda19329d5a31517522ec02ceb874)), closes [#13479](https://github.com/aws/aws-cdk/issues/13479)
* **lambda:** fromDockerBuild output is located under /asset ([#13539](https://github.com/aws/aws-cdk/issues/13539)) ([77449f6](https://github.com/aws/aws-cdk/commit/77449f61e7075fef1240fc52becb8ea60b9ea9ad)), closes [#13439](https://github.com/aws/aws-cdk/issues/13439)
* **lambda:** incorrect values for prop UntrustedArtifactOnDeployment ([#13667](https://github.com/aws/aws-cdk/issues/13667)) ([0757686](https://github.com/aws/aws-cdk/commit/0757686790c25ab1cc0f040d9f6039cef6648d44)), closes [#13586](https://github.com/aws/aws-cdk/issues/13586)
* **lambda-nodejs:** paths with spaces break esbuild ([#13312](https://github.com/aws/aws-cdk/issues/13312)) ([f983fbb](https://github.com/aws/aws-cdk/commit/f983fbb474ecd6727b0c5a35333718cc55d78bf1)), closes [#13311](https://github.com/aws/aws-cdk/issues/13311)
* **neptune:** create correct IAM statement in grantConnect() ([#13641](https://github.com/aws/aws-cdk/issues/13641)) ([2e7f046](https://github.com/aws/aws-cdk/commit/2e7f0462fef80714abb923cf0c14ed01d698b4fa)), closes [#13640](https://github.com/aws/aws-cdk/issues/13640)
* **python:** change Python namespace to `aws_cdk` ([#13489](https://github.com/aws/aws-cdk/issues/13489)) ([2ff5ca1](https://github.com/aws/aws-cdk/commit/2ff5ca1b4fa34ad6ed9e34c01bd49cc1583cab55))
* **rds:** fail with a descriptive error if Cluster's instance count is a deploy-time value ([#13765](https://github.com/aws/aws-cdk/issues/13765)) ([dd22e8f](https://github.com/aws/aws-cdk/commit/dd22e8fc29f1fc33d391d1bb9ae93963bfd82563)), closes [#13558](https://github.com/aws/aws-cdk/issues/13558)
* **region-info:** ap-northeast-3 data not correctly registered ([#13564](https://github.com/aws/aws-cdk/issues/13564)) ([64da84b](https://github.com/aws/aws-cdk/commit/64da84be5c60bb8132551bcc27a7ca9c7effe95d)), closes [#13561](https://github.com/aws/aws-cdk/issues/13561)
* **s3:** Notifications fail to deploy due to incompatible node runtime ([#13624](https://github.com/aws/aws-cdk/issues/13624)) ([26bc3d4](https://github.com/aws/aws-cdk/commit/26bc3d4951a96a4bdf3e3e10464a4e3b80ed563f))
* **s3:** Notifications fail to deploy due to incompatible node runtime ([#13624](https://github.com/aws/aws-cdk/issues/13624)) ([aa32cf6](https://github.com/aws/aws-cdk/commit/aa32cf64d20e4ba1eb2bc8236daeb05e89e4c12d))
* **stepfunctions:** `SageMakeUpdateEndpoint` adds insufficient permissions ([#13170](https://github.com/aws/aws-cdk/issues/13170)) ([6126e49](https://github.com/aws/aws-cdk/commit/6126e499e5ca22b5f751af4f4f05d74f696829f1)), closes [#11594](https://github.com/aws/aws-cdk/issues/11594)
* **stepfunctions:** no validation on state machine name ([#13387](https://github.com/aws/aws-cdk/issues/13387)) ([6c3d407](https://github.com/aws/aws-cdk/commit/6c3d4071746179dde30f615602592c2523daa56e)), closes [#13289](https://github.com/aws/aws-cdk/issues/13289)


* **core:** remove all references to BundlingDockerImage in the public API ([#13814](https://github.com/aws/aws-cdk/issues/13814)) ([9cceb3f](https://github.com/aws/aws-cdk/commit/9cceb3f855b1ece2effe60b5a8b84f2986c270c4))
* **lambda-nodejs:** prepare code to reduce merge conflicts when deprecated APIs are stripped ([#13738](https://github.com/aws/aws-cdk/issues/13738)) ([ca391b5](https://github.com/aws/aws-cdk/commit/ca391b596fae1c3130a8811088d32df21a23a434))
* **lambda-nodejs:** update default runtime ([#13664](https://github.com/aws/aws-cdk/issues/13664)) ([ca42461](https://github.com/aws/aws-cdk/commit/ca42461acd4f42a8bd7c0fb05788c7ea50834de2))

## [2.0.0-alpha.9](https://github.com/aws/aws-cdk/compare/v2.0.0-alpha.6...v2.0.0-alpha.9) (2021-03-24)


### ⚠ BREAKING CHANGES TO EXPERIMENTAL FEATURES

* **lambda-nodejs:** the default runtime of a `NodejsFunction` is now Node.js 14.x if the environment from which it is deployed uses Node.js >= 14 and Node.js 12.x otherwise.
* **appmesh:** Backend, backend default and Virtual Service client policies structures are being altered
* **appmesh**: you must use the backend default interface to define backend defaults in `VirtualGateway`.
  The property name also changed from `backendsDefaultClientPolicy` to `backendDefaults`
* **appmesh**:  you must use the backend default interface to define backend defaults in `VirtualNode`,
  (the property name also changed from `backendsDefaultClientPolicy` to `backendDefaults`),
  and the `Backend` class to define a backend
* **appmesh**: you can no longer attach a client policy to a `VirtualService`
* **apigatewayv2:** `HttpApiMapping` (and related interfaces for `Attributed` and `Props`) has been renamed to `ApiMapping`
* **apigatewayv2:** `CommonStageOptions` has been renamed to `StageOptions`
* **apigatewayv2:** `HttpStage.fromStageName` has been removed in favour of `HttpStage.fromHttpStageAttributes`
* **apigatewayv2:** `DefaultDomainMappingOptions` has been removed in favour of `DomainMappingOptions`
* **apigatewayv2:** `HttpApiProps.defaultDomainMapping` has been changed from `DefaultDomainMappingOptions` to `DomainMappingOptions`
* **apigatewayv2:** `HttpApi.defaultStage` has been changed from `HttpStage` to `IStage`
* **apigatewayv2:** `IHttpApi.defaultStage` has been removed

### Features

* **amplify-domain:** Added config for auto subdomain creation ([#13342](https://github.com/aws/aws-cdk/issues/13342)) ([4c63f09](https://github.com/aws/aws-cdk/commit/4c63f09f1e9644877eaffbe78eede3854bec08ab))
* **apigatewayv2:** http api - default authorizer options ([#13172](https://github.com/aws/aws-cdk/issues/13172)) ([53d9661](https://github.com/aws/aws-cdk/commit/53d96618ac006d7b3f6282c8b5c4ae7aeed2b104))
* **apigatewayv2:** websocket api ([#13031](https://github.com/aws/aws-cdk/issues/13031)) ([fe1c839](https://github.com/aws/aws-cdk/commit/fe1c8393e0840fb273c4a5f325cb3cebc784bf4b)), closes [#2872](https://github.com/aws/aws-cdk/issues/2872)
* **appmesh:** add missing route match features ([#13350](https://github.com/aws/aws-cdk/issues/13350)) ([b71efd9](https://github.com/aws/aws-cdk/commit/b71efd9d12843ab4b495d53e565cec97d60748f3)), closes [#11645](https://github.com/aws/aws-cdk/issues/11645)
* **appmesh:** add route retry policies ([#13353](https://github.com/aws/aws-cdk/issues/13353)) ([66f7053](https://github.com/aws/aws-cdk/commit/66f7053a6c1f5cab540e975b30f5a2c6e35df58a)), closes [#11642](https://github.com/aws/aws-cdk/issues/11642)
* **aws-elasticloadbalancingv2:** add protocol version for ALB TargetGroups ([#13570](https://github.com/aws/aws-cdk/issues/13570)) ([165a3d8](https://github.com/aws/aws-cdk/commit/165a3d877b7ab23f29e42e1e74ee7c5cb35b7f24)), closes [#12869](https://github.com/aws/aws-cdk/issues/12869)
* **aws-events:** Event Bus target ([#12926](https://github.com/aws/aws-cdk/issues/12926)) ([ea91aa3](https://github.com/aws/aws-cdk/commit/ea91aa31db9e2f31c734ad6d7e1f64d5d432dfd4)), closes [#9473](https://github.com/aws/aws-cdk/issues/9473)
* **aws-route53-targets:** add global accelerator target to route53 alias targets ([#13407](https://github.com/aws/aws-cdk/issues/13407)) ([2672a55](https://github.com/aws/aws-cdk/commit/2672a55c393e5ce7dd9a230d921ec1be1a23e32a)), closes [#12839](https://github.com/aws/aws-cdk/issues/12839)
* **cfnspec:** cloudformation spec v30.0.0 ([#13365](https://github.com/aws/aws-cdk/issues/13365)) ([ae0185d](https://github.com/aws/aws-cdk/commit/ae0185dd089e3bb7c5639ebc1bce3f95e126f71c))
* **cfnspec:** cloudformation spec v30.1.0 ([#13519](https://github.com/aws/aws-cdk/issues/13519)) ([7711981](https://github.com/aws/aws-cdk/commit/7711981ea30bfdffd21dd840d676be4a2b45c9ba))
* **cfnspec:** cloudformation spec v31.0.0 ([#13633](https://github.com/aws/aws-cdk/issues/13633)) ([9b1c786](https://github.com/aws/aws-cdk/commit/9b1c786846f68fdac94b04b76d546c3d47e2251c))
* **cloudwatch:** EC2 actions ([#13281](https://github.com/aws/aws-cdk/issues/13281)) ([319cfcd](https://github.com/aws/aws-cdk/commit/319cfcdaaf92e4e6edb8c2388d04dce0971aaf86)), closes [#13228](https://github.com/aws/aws-cdk/issues/13228)
* **codebuild:** allow setting queued timeout ([#13467](https://github.com/aws/aws-cdk/issues/13467)) ([e09250b](https://github.com/aws/aws-cdk/commit/e09250bc92c62cb8ee0a8706ce90d0e82faf2d84)), closes [#11364](https://github.com/aws/aws-cdk/issues/11364)
* **cognito:** user pools - sign in with apple ([#13160](https://github.com/aws/aws-cdk/issues/13160)) ([b965589](https://github.com/aws/aws-cdk/commit/b965589358f4c281aea36404276f08128e6ff3db))
* **core:** `description` parameter in the CustomResourceProvider ([#13275](https://github.com/aws/aws-cdk/issues/13275)) ([78831cf](https://github.com/aws/aws-cdk/commit/78831cf9dec0407e7d827711183ac47be070f480)), closes [#13277](https://github.com/aws/aws-cdk/issues/13277) [#13276](https://github.com/aws/aws-cdk/issues/13276)
* **core:** customize bundling output packaging ([#13152](https://github.com/aws/aws-cdk/issues/13152)) ([6eca979](https://github.com/aws/aws-cdk/commit/6eca979f65542f3e44461588d8220e8c0bf76a6e))
* **dynamodb:** custom timeout for replication operation ([#13354](https://github.com/aws/aws-cdk/issues/13354)) ([6a5a4f2](https://github.com/aws/aws-cdk/commit/6a5a4f2d9bb6b09ad0d10066200fe53bb45f0737)), closes [#10249](https://github.com/aws/aws-cdk/issues/10249)
* **ec2:** Add VPC endpoint for RDS ([#12497](https://github.com/aws/aws-cdk/issues/12497)) ([fc87574](https://github.com/aws/aws-cdk/commit/fc8757437c37a0947cced720ff363b8858850f72)), closes [#12402](https://github.com/aws/aws-cdk/issues/12402)
* **ec2:** ESP and AH IPsec protocols for Security Groups ([#13471](https://github.com/aws/aws-cdk/issues/13471)) ([f5a6647](https://github.com/aws/aws-cdk/commit/f5a6647bbe1885ba86029d10550a3ffaf80b6561)), closes [#13403](https://github.com/aws/aws-cdk/issues/13403)
* **ec2:** multipart user data ([#11843](https://github.com/aws/aws-cdk/issues/11843)) ([ed94c5e](https://github.com/aws/aws-cdk/commit/ed94c5ef1b9dd3042128b0e0c5bb14b3d9c7d497)), closes [#8315](https://github.com/aws/aws-cdk/issues/8315)
* **ecr:** add imageTagMutability prop ([#10557](https://github.com/aws/aws-cdk/issues/10557)) ([c4dc3bc](https://github.com/aws/aws-cdk/commit/c4dc3bce02790903593d80b070fca81fe7b7f08c)), closes [#4640](https://github.com/aws/aws-cdk/issues/4640)
* **ecs:** ability to access tag parameter value of TagParameterContainerImage ([#13340](https://github.com/aws/aws-cdk/issues/13340)) ([e567a41](https://github.com/aws/aws-cdk/commit/e567a410d47366855ee3e6011aa096ba987b8099)), closes [#13202](https://github.com/aws/aws-cdk/issues/13202)
* **ecs:** add port mappings to containers with props ([#13262](https://github.com/aws/aws-cdk/issues/13262)) ([f511639](https://github.com/aws/aws-cdk/commit/f511639bba156f6edd15896a4dd8e27b07671ea1)), closes [#13261](https://github.com/aws/aws-cdk/issues/13261)
* **ecs:** allow selection of container and port for SRV service discovery records ([#12798](https://github.com/aws/aws-cdk/issues/12798)) ([a452bc3](https://github.com/aws/aws-cdk/commit/a452bc385640762a043392a717d49de29abcc64e)), closes [#12796](https://github.com/aws/aws-cdk/issues/12796)
* **ecs:** allow users to provide a CloudMap service to associate with an ECS service ([#13192](https://github.com/aws/aws-cdk/issues/13192)) ([a7d314c](https://github.com/aws/aws-cdk/commit/a7d314c73b9473208d94bac29ad9bd8018e00204)), closes [#10057](https://github.com/aws/aws-cdk/issues/10057)
* **ecs-patterns:** Add ECS deployment circuit breaker support to higher-level constructs ([#12719](https://github.com/aws/aws-cdk/issues/12719)) ([e80a98a](https://github.com/aws/aws-cdk/commit/e80a98aa8839e9b9b89701158d82b991e9ebaa65)), closes [#12534](https://github.com/aws/aws-cdk/issues/12534) [#12360](https://github.com/aws/aws-cdk/issues/12360)
* **elbv2:** allow control of ingress rules on redirect listener ([#12768](https://github.com/aws/aws-cdk/issues/12768)) ([b7b441f](https://github.com/aws/aws-cdk/commit/b7b441f74a07d26fd8de23df84e7ab4663c89c0c)), closes [#12766](https://github.com/aws/aws-cdk/issues/12766)
* **events:** `EventBus.grantPutEventsTo` method for granular grants ([#13429](https://github.com/aws/aws-cdk/issues/13429)) ([122a232](https://github.com/aws/aws-cdk/commit/122a232343699304d8f206d3024fcddfb2a94bc8)), closes [#11228](https://github.com/aws/aws-cdk/issues/11228)
* **events:** archive events ([#12060](https://github.com/aws/aws-cdk/issues/12060)) ([465cd9c](https://github.com/aws/aws-cdk/commit/465cd9c434acff74070ca6d33891e1481e253128)), closes [#11531](https://github.com/aws/aws-cdk/issues/11531)
* **events:** dead letter queue for Lambda Targets ([#11617](https://github.com/aws/aws-cdk/issues/11617)) ([1bb3650](https://github.com/aws/aws-cdk/commit/1bb3650c5dd2087b05793a5e903cdfb80fc5c1ad)), closes [#11612](https://github.com/aws/aws-cdk/issues/11612)
* **events:** dead-letter queue support for CodeBuild  ([#13448](https://github.com/aws/aws-cdk/issues/13448)) ([abfc0ea](https://github.com/aws/aws-cdk/commit/abfc0ea63c10d8033a529b7497cf093e318fdf12)), closes [#13447](https://github.com/aws/aws-cdk/issues/13447)
* **events:** dead-letter queue support for StepFunctions ([#13450](https://github.com/aws/aws-cdk/issues/13450)) ([0ebcb41](https://github.com/aws/aws-cdk/commit/0ebcb4160ee16f0f7ff1072a40c8951f9a983048)), closes [#13449](https://github.com/aws/aws-cdk/issues/13449)
* **events,applicationautoscaling:** schedule can be a token ([#13064](https://github.com/aws/aws-cdk/issues/13064)) ([b1449a1](https://github.com/aws/aws-cdk/commit/b1449a178b0f9a8a951c2546428f8d75c6431f0f))
* **iam:** SAML identity provider ([#13393](https://github.com/aws/aws-cdk/issues/13393)) ([faa0c06](https://github.com/aws/aws-cdk/commit/faa0c060dad9a5045495707e28fc85f223d4db5d)), closes [#5320](https://github.com/aws/aws-cdk/issues/5320)
* **lambda:** Code.fromDockerBuild ([#13318](https://github.com/aws/aws-cdk/issues/13318)) ([ad01099](https://github.com/aws/aws-cdk/commit/ad01099d5b8f835c3b87d7d20fd2dc1a5df2fd6f)), closes [#13273](https://github.com/aws/aws-cdk/issues/13273)
* **lambda-event-sources:** msk and self-managed kafka event sources ([#12507](https://github.com/aws/aws-cdk/issues/12507)) ([73209e1](https://github.com/aws/aws-cdk/commit/73209e17f314cf61f703d51ef3b9f197d2f1bdc3)), closes [#12099](https://github.com/aws/aws-cdk/issues/12099)
* **neptune:** high level constructs for db clusters and instances ([#12763](https://github.com/aws/aws-cdk/issues/12763)) ([c366837](https://github.com/aws/aws-cdk/commit/c36683701d88eb0c53fdd2add66b10c47c05f56b)), closes [aws#12762](https://github.com/aws/aws/issues/12762)
* **neptune:** Support IAM authentication ([#13462](https://github.com/aws/aws-cdk/issues/13462)) ([6c5b1f4](https://github.com/aws/aws-cdk/commit/6c5b1f42fb73a132d47945b529bab73557f2b9d8)), closes [#13461](https://github.com/aws/aws-cdk/issues/13461)
* **rds:** make rds secret name configurable ([#13626](https://github.com/aws/aws-cdk/issues/13626)) ([62a91b7](https://github.com/aws/aws-cdk/commit/62a91b7a30f8b6419a983d7ea7bdb3c39f2fdfd0)), closes [#8984](https://github.com/aws/aws-cdk/issues/8984)
* **region-info:** added AppMesh ECR account for af-south-1 region ([#12814](https://github.com/aws/aws-cdk/issues/12814)) ([b3fba43](https://github.com/aws/aws-cdk/commit/b3fba43a047df61e713e8d2271d6deee7e07b716))
* **sns:** enable passing PolicyDocument to TopicPolicy ([#10559](https://github.com/aws/aws-cdk/issues/10559)) ([0d9c300](https://github.com/aws/aws-cdk/commit/0d9c300f5244d3e5720832343830947f6cc5b352)), closes [#7934](https://github.com/aws/aws-cdk/issues/7934)
* **stepfunctions-tasks:** Support calling ApiGateway REST and HTTP APIs ([#13033](https://github.com/aws/aws-cdk/issues/13033)) ([cc608d0](https://github.com/aws/aws-cdk/commit/cc608d055ffefb798ad6378ab07f36cb241897da)), closes [#11565](https://github.com/aws/aws-cdk/issues/11565) [#11566](https://github.com/aws/aws-cdk/issues/11566) [#11565](https://github.com/aws/aws-cdk/issues/11565)


### Bug Fixes

* **appmesh:** Move Client Policy from Virtual Service to backend structure ([#12943](https://github.com/aws/aws-cdk/issues/12943)) ([d3f4284](https://github.com/aws/aws-cdk/commit/d3f428435976c55ca950279cfc841665fd504370)), closes [#11996](https://github.com/aws/aws-cdk/issues/11996)
* **autoscaling:** AutoScaling on percentile metrics doesn't work ([#13366](https://github.com/aws/aws-cdk/issues/13366)) ([46114bb](https://github.com/aws/aws-cdk/commit/46114bb1f4702019a8873b9162d0a9f10763bc61)), closes [#13144](https://github.com/aws/aws-cdk/issues/13144)
* **aws-ecs:** drain hook lambda allows tasks to stop gracefully ([#13559](https://github.com/aws/aws-cdk/issues/13559)) ([3e1148e](https://github.com/aws/aws-cdk/commit/3e1148e74dce0e15379e2cfa372bd367183f9c6f)), closes [#13506](https://github.com/aws/aws-cdk/issues/13506)
* **cfn-include:** allow boolean values for string-typed properties ([#13508](https://github.com/aws/aws-cdk/issues/13508)) ([e5dab7c](https://github.com/aws/aws-cdk/commit/e5dab7cbc67c234d191c38a8b8b84b634070b15b))
* **cfn-include:** allow dynamic mappings to be used in Fn::FindInMap ([#13428](https://github.com/aws/aws-cdk/issues/13428)) ([623675d](https://github.com/aws/aws-cdk/commit/623675d2f8fb2786f23beb87994e687e8a7c6612))
* **cloudfront:** cannot add two EdgeFunctions with same aliases ([#13324](https://github.com/aws/aws-cdk/issues/13324)) ([1f35351](https://github.com/aws/aws-cdk/commit/1f3535145d22b2b13ebbcbfe31a3bfd73519352d)), closes [#13237](https://github.com/aws/aws-cdk/issues/13237)
* **cloudwatch:** cannot create Alarms from labeled metrics that start with a digit ([#13560](https://github.com/aws/aws-cdk/issues/13560)) ([278029f](https://github.com/aws/aws-cdk/commit/278029f25b41d956091835364e5a8de91429712c)), closes [#13434](https://github.com/aws/aws-cdk/issues/13434)
* **cloudwatch:** MathExpression period of <5 minutes is not respected ([#13078](https://github.com/aws/aws-cdk/issues/13078)) ([d9ee914](https://github.com/aws/aws-cdk/commit/d9ee91432918aa113f728abdd61295096ed1512f)), closes [#9156](https://github.com/aws/aws-cdk/issues/9156)
* **cloudwatch:** metric `label` not rendered into Alarms ([#13070](https://github.com/aws/aws-cdk/issues/13070)) ([cbcc712](https://github.com/aws/aws-cdk/commit/cbcc712e0c4c44c83c7f4d1e8a544bccfa26bb56))
* **codebuild:** allow FILE_PATH webhook filter for BitBucket ([#13186](https://github.com/aws/aws-cdk/issues/13186)) ([cbed348](https://github.com/aws/aws-cdk/commit/cbed3488f03bdfba16f3950bda653535c8999db1)), closes [#13175](https://github.com/aws/aws-cdk/issues/13175)
* **codedeploy:** Use aws-cli instead of awscli for yum ([#13655](https://github.com/aws/aws-cdk/issues/13655)) ([449ce12](https://github.com/aws/aws-cdk/commit/449ce129b860ddc302e1e5270d5819ebe5aa27bf))
* **core:** `toJsonString()` cannot handle list intrinsics ([#13544](https://github.com/aws/aws-cdk/issues/13544)) ([a5be042](https://github.com/aws/aws-cdk/commit/a5be04270c2a372132964ab13d080a16f1a6f00c)), closes [#13465](https://github.com/aws/aws-cdk/issues/13465)
* **core:** custom resource provider NODEJS_12 now looks like Lambda's NODEJS_12_X, add Node 14 ([#13301](https://github.com/aws/aws-cdk/issues/13301)) ([3413b2f](https://github.com/aws/aws-cdk/commit/3413b2f887596d11dfb53c0e99c2a1788095a2ad))
* **dynamodb:** replicas not created on table replacement ([#13300](https://github.com/aws/aws-cdk/issues/13300)) ([c7c424f](https://github.com/aws/aws-cdk/commit/c7c424fec42f1f14ab8bdc3011f5bdb602918aa3)), closes [#12332](https://github.com/aws/aws-cdk/issues/12332)
* **ec2:** fix typo's in WindowsImage constants ([#13446](https://github.com/aws/aws-cdk/issues/13446)) ([781aa97](https://github.com/aws/aws-cdk/commit/781aa97d53fdb7511c34ddde884fdcd84c3f68a6))
* **ec2:** NAT provider's default outbound rules cannot be disabled ([#12674](https://github.com/aws/aws-cdk/issues/12674)) ([664133a](https://github.com/aws/aws-cdk/commit/664133a35da2bd096a237971ce662f3dd38b297f)), closes [#12673](https://github.com/aws/aws-cdk/issues/12673)
* **ec2:** readme grammar ([#13180](https://github.com/aws/aws-cdk/issues/13180)) ([fe4f056](https://github.com/aws/aws-cdk/commit/fe4f05678c06d634d3fe9e1b608e444a57f67b9c))
* **ec2:** Security Groups support all protocols ([#13593](https://github.com/aws/aws-cdk/issues/13593)) ([8c6b3eb](https://github.com/aws/aws-cdk/commit/8c6b3ebea464e27f68ffcab32857d8baec29c413)), closes [#13403](https://github.com/aws/aws-cdk/issues/13403)
* **ec2:** Throw error on empty InitFile content ([#13009](https://github.com/aws/aws-cdk/issues/13009)) ([#13119](https://github.com/aws/aws-cdk/issues/13119)) ([81a78a3](https://github.com/aws/aws-cdk/commit/81a78a31408276ebb020e45b15ddca7a2c57ae50))
* **ecr:** Allow referencing an EcrImage by digest instead of tag ([#13299](https://github.com/aws/aws-cdk/issues/13299)) ([266a621](https://github.com/aws/aws-cdk/commit/266a621abfc34c62ff1e26de9cb8cf0687588f89)), closes [#5082](https://github.com/aws/aws-cdk/issues/5082)
* **ecr:** Generate valid CloudFormation for imageScanOnPush ([#13420](https://github.com/aws/aws-cdk/issues/13420)) ([278fba5](https://github.com/aws/aws-cdk/commit/278fba5df4a3d785e49bdb57ccf88fd34bacacbb)), closes [#13418](https://github.com/aws/aws-cdk/issues/13418)
* **ecs:** services essential container exceptions thrown too soon ([#13240](https://github.com/aws/aws-cdk/issues/13240)) ([c174f6c](https://github.com/aws/aws-cdk/commit/c174f6c2f4dd909e07be34b66bd6b3a92d5e8484)), closes [#13239](https://github.com/aws/aws-cdk/issues/13239)
* **elasticloadbalancingv2:** should allow more than 2 certificates ([#13332](https://github.com/aws/aws-cdk/issues/13332)) ([d3155e9](https://github.com/aws/aws-cdk/commit/d3155e97fd9331a4732396941ce4ad20613fe81c)), closes [#13150](https://github.com/aws/aws-cdk/issues/13150)
* **elasticloadbalancingv2:** upgrade to v1.92.0 drops certificates on ALB if more than 2 certificates exist ([#13490](https://github.com/aws/aws-cdk/issues/13490)) ([01b94f8](https://github.com/aws/aws-cdk/commit/01b94f8aa6c88b5e676c784aec4c879acddc042f)), closes [#13332](https://github.com/aws/aws-cdk/issues/13332) [#13437](https://github.com/aws/aws-cdk/issues/13437)
* **events:** cannot trigger multiple Lambdas from the same Rule ([#13260](https://github.com/aws/aws-cdk/issues/13260)) ([c8c1762](https://github.com/aws/aws-cdk/commit/c8c1762c213aad1062c3a0bc48b22b05c3a0a185)), closes [#13231](https://github.com/aws/aws-cdk/issues/13231)
* **events:** imported ECS Task Definition cannot be used as target ([#13293](https://github.com/aws/aws-cdk/issues/13293)) ([6f7cebd](https://github.com/aws/aws-cdk/commit/6f7cebdf61073cc1fb358fcac5f5b2156389cb81)), closes [#12811](https://github.com/aws/aws-cdk/issues/12811)
* **events:** imported EventBus does not correctly register source account ([#13481](https://github.com/aws/aws-cdk/issues/13481)) ([57e5404](https://github.com/aws/aws-cdk/commit/57e540432c1446f2233a9b0c0f4caba4e9e155d9)), closes [#13469](https://github.com/aws/aws-cdk/issues/13469)
* **iam:** oidc-provider can't pull from hosts requiring SNI ([#13397](https://github.com/aws/aws-cdk/issues/13397)) ([90dbfb5](https://github.com/aws/aws-cdk/commit/90dbfb5eec19559717ac6b30f25451461027e731))
* **iam:** policy statement tries to validate tokens ([#13493](https://github.com/aws/aws-cdk/issues/13493)) ([8d592ea](https://github.com/aws/aws-cdk/commit/8d592ea89c0eda19329d5a31517522ec02ceb874)), closes [#13479](https://github.com/aws/aws-cdk/issues/13479)
* **init:** Python init template's stack ID doesn't match other languages ([#13480](https://github.com/aws/aws-cdk/issues/13480)) ([3f1c02d](https://github.com/aws/aws-cdk/commit/3f1c02dac7a50ce7caebce1e7f8953f6e4937e6b))
* **lambda:** fromDockerBuild output is located under /asset ([#13539](https://github.com/aws/aws-cdk/issues/13539)) ([77449f6](https://github.com/aws/aws-cdk/commit/77449f61e7075fef1240fc52becb8ea60b9ea9ad)), closes [#13439](https://github.com/aws/aws-cdk/issues/13439)
* **lambda:** incorrect values for prop UntrustedArtifactOnDeployment ([#13667](https://github.com/aws/aws-cdk/issues/13667)) ([0757686](https://github.com/aws/aws-cdk/commit/0757686790c25ab1cc0f040d9f6039cef6648d44)), closes [#13586](https://github.com/aws/aws-cdk/issues/13586)
* **lambda-nodejs:** paths with spaces break esbuild ([#13312](https://github.com/aws/aws-cdk/issues/13312)) ([f983fbb](https://github.com/aws/aws-cdk/commit/f983fbb474ecd6727b0c5a35333718cc55d78bf1)), closes [#13311](https://github.com/aws/aws-cdk/issues/13311)
* **neptune:** create correct IAM statement in grantConnect() ([#13641](https://github.com/aws/aws-cdk/issues/13641)) ([2e7f046](https://github.com/aws/aws-cdk/commit/2e7f0462fef80714abb923cf0c14ed01d698b4fa)), closes [#13640](https://github.com/aws/aws-cdk/issues/13640)
* **python:** change Python namespace to `aws_cdk` ([#13489](https://github.com/aws/aws-cdk/issues/13489)) ([2ff5ca1](https://github.com/aws/aws-cdk/commit/2ff5ca1b4fa34ad6ed9e34c01bd49cc1583cab55))
* **region-info:** ap-northeast-3 data not correctly registered ([#13564](https://github.com/aws/aws-cdk/issues/13564)) ([64da84b](https://github.com/aws/aws-cdk/commit/64da84be5c60bb8132551bcc27a7ca9c7effe95d)), closes [#13561](https://github.com/aws/aws-cdk/issues/13561)
* **s3:** Notifications fail to deploy due to incompatible node runtime ([#13624](https://github.com/aws/aws-cdk/issues/13624)) ([aa32cf6](https://github.com/aws/aws-cdk/commit/aa32cf64d20e4ba1eb2bc8236daeb05e89e4c12d))
* **s3:** Notifications fail to deploy due to incompatible node runtime ([#13624](https://github.com/aws/aws-cdk/issues/13624)) ([26bc3d4](https://github.com/aws/aws-cdk/commit/26bc3d4951a96a4bdf3e3e10464a4e3b80ed563f))
* **stepfunctions:** `SageMakeUpdateEndpoint` adds insufficient permissions ([#13170](https://github.com/aws/aws-cdk/issues/13170)) ([6126e49](https://github.com/aws/aws-cdk/commit/6126e499e5ca22b5f751af4f4f05d74f696829f1)), closes [#11594](https://github.com/aws/aws-cdk/issues/11594)
* **stepfunctions:** no validation on state machine name ([#13387](https://github.com/aws/aws-cdk/issues/13387)) ([6c3d407](https://github.com/aws/aws-cdk/commit/6c3d4071746179dde30f615602592c2523daa56e)), closes [#13289](https://github.com/aws/aws-cdk/issues/13289)
* use NodeJS 14 for all packaged custom resources ([#13488](https://github.com/aws/aws-cdk/issues/13488)) ([20a2820](https://github.com/aws/aws-cdk/commit/20a2820ee4d022663fcd0928fbc0f61153ae953f)), closes [#13534](https://github.com/aws/aws-cdk/issues/13534) [#13484](https://github.com/aws/aws-cdk/issues/13484)


* **lambda-nodejs:** update default runtime ([#13664](https://github.com/aws/aws-cdk/issues/13664)) ([ca42461](https://github.com/aws/aws-cdk/commit/ca42461acd4f42a8bd7c0fb05788c7ea50834de2))

## [2.0.0-alpha.8](https://github.com/aws/aws-cdk/compare/v2.0.0-alpha.6...v2.0.0-alpha.8) (2021-03-17)


### ⚠ BREAKING CHANGES TO EXPERIMENTAL FEATURES

* **apigatewayv2:** `HttpApiMapping` (and related interfaces for `Attributed` and `Props`) has been renamed to `ApiMapping`
* **apigatewayv2:** `CommonStageOptions` has been renamed to `StageOptions`
* **apigatewayv2:** `HttpStage.fromStageName` has been removed in favour of `HttpStage.fromHttpStageAttributes`
* **apigatewayv2:** `DefaultDomainMappingOptions` has been removed in favour of `DomainMappingOptions`
* **apigatewayv2:** `HttpApiProps.defaultDomainMapping` has been changed from `DefaultDomainMappingOptions` to `DomainMappingOptions`
* **apigatewayv2:** `HttpApi.defaultStage` has been changed from `HttpStage` to `IStage`
* **apigatewayv2:** `IHttpApi.defaultStage` has been removed

### Features

* **apigatewayv2:** websocket api ([#13031](https://github.com/aws/aws-cdk/issues/13031)) ([fe1c839](https://github.com/aws/aws-cdk/commit/fe1c8393e0840fb273c4a5f325cb3cebc784bf4b)), closes [#2872](https://github.com/aws/aws-cdk/issues/2872)
* **aws-events:** Event Bus target ([#12926](https://github.com/aws/aws-cdk/issues/12926)) ([ea91aa3](https://github.com/aws/aws-cdk/commit/ea91aa31db9e2f31c734ad6d7e1f64d5d432dfd4)), closes [#9473](https://github.com/aws/aws-cdk/issues/9473)
* **aws-route53-targets:** add global accelerator target to route53 alias targets ([#13407](https://github.com/aws/aws-cdk/issues/13407)) ([2672a55](https://github.com/aws/aws-cdk/commit/2672a55c393e5ce7dd9a230d921ec1be1a23e32a)), closes [#12839](https://github.com/aws/aws-cdk/issues/12839)
* **cfnspec:** cloudformation spec v30.0.0 ([#13365](https://github.com/aws/aws-cdk/issues/13365)) ([ae0185d](https://github.com/aws/aws-cdk/commit/ae0185dd089e3bb7c5639ebc1bce3f95e126f71c))
* **cloudwatch:** EC2 actions ([#13281](https://github.com/aws/aws-cdk/issues/13281)) ([319cfcd](https://github.com/aws/aws-cdk/commit/319cfcdaaf92e4e6edb8c2388d04dce0971aaf86)), closes [#13228](https://github.com/aws/aws-cdk/issues/13228)
* **codebuild:** allow setting queued timeout ([#13467](https://github.com/aws/aws-cdk/issues/13467)) ([e09250b](https://github.com/aws/aws-cdk/commit/e09250bc92c62cb8ee0a8706ce90d0e82faf2d84)), closes [#11364](https://github.com/aws/aws-cdk/issues/11364)
* **cognito:** user pools - sign in with apple ([#13160](https://github.com/aws/aws-cdk/issues/13160)) ([b965589](https://github.com/aws/aws-cdk/commit/b965589358f4c281aea36404276f08128e6ff3db))
* **core:** `description` parameter in the CustomResourceProvider ([#13275](https://github.com/aws/aws-cdk/issues/13275)) ([78831cf](https://github.com/aws/aws-cdk/commit/78831cf9dec0407e7d827711183ac47be070f480)), closes [#13277](https://github.com/aws/aws-cdk/issues/13277) [#13276](https://github.com/aws/aws-cdk/issues/13276)
* **core:** customize bundling output packaging ([#13152](https://github.com/aws/aws-cdk/issues/13152)) ([6eca979](https://github.com/aws/aws-cdk/commit/6eca979f65542f3e44461588d8220e8c0bf76a6e))
* **dynamodb:** custom timeout for replication operation ([#13354](https://github.com/aws/aws-cdk/issues/13354)) ([6a5a4f2](https://github.com/aws/aws-cdk/commit/6a5a4f2d9bb6b09ad0d10066200fe53bb45f0737)), closes [#10249](https://github.com/aws/aws-cdk/issues/10249)
* **ec2:** Add VPC endpoint for RDS ([#12497](https://github.com/aws/aws-cdk/issues/12497)) ([fc87574](https://github.com/aws/aws-cdk/commit/fc8757437c37a0947cced720ff363b8858850f72)), closes [#12402](https://github.com/aws/aws-cdk/issues/12402)
* **ec2:** ESP and AH IPsec protocols for Security Groups ([#13471](https://github.com/aws/aws-cdk/issues/13471)) ([f5a6647](https://github.com/aws/aws-cdk/commit/f5a6647bbe1885ba86029d10550a3ffaf80b6561)), closes [#13403](https://github.com/aws/aws-cdk/issues/13403)
* **ec2:** multipart user data ([#11843](https://github.com/aws/aws-cdk/issues/11843)) ([ed94c5e](https://github.com/aws/aws-cdk/commit/ed94c5ef1b9dd3042128b0e0c5bb14b3d9c7d497)), closes [#8315](https://github.com/aws/aws-cdk/issues/8315)
* **ecr:** add imageTagMutability prop ([#10557](https://github.com/aws/aws-cdk/issues/10557)) ([c4dc3bc](https://github.com/aws/aws-cdk/commit/c4dc3bce02790903593d80b070fca81fe7b7f08c)), closes [#4640](https://github.com/aws/aws-cdk/issues/4640)
* **ecs:** ability to access tag parameter value of TagParameterContainerImage ([#13340](https://github.com/aws/aws-cdk/issues/13340)) ([e567a41](https://github.com/aws/aws-cdk/commit/e567a410d47366855ee3e6011aa096ba987b8099)), closes [#13202](https://github.com/aws/aws-cdk/issues/13202)
* **ecs:** add port mappings to containers with props ([#13262](https://github.com/aws/aws-cdk/issues/13262)) ([f511639](https://github.com/aws/aws-cdk/commit/f511639bba156f6edd15896a4dd8e27b07671ea1)), closes [#13261](https://github.com/aws/aws-cdk/issues/13261)
* **ecs:** allow selection of container and port for SRV service discovery records ([#12798](https://github.com/aws/aws-cdk/issues/12798)) ([a452bc3](https://github.com/aws/aws-cdk/commit/a452bc385640762a043392a717d49de29abcc64e)), closes [#12796](https://github.com/aws/aws-cdk/issues/12796)
* **ecs:** allow users to provide a CloudMap service to associate with an ECS service ([#13192](https://github.com/aws/aws-cdk/issues/13192)) ([a7d314c](https://github.com/aws/aws-cdk/commit/a7d314c73b9473208d94bac29ad9bd8018e00204)), closes [#10057](https://github.com/aws/aws-cdk/issues/10057)
* **elbv2:** allow control of ingress rules on redirect listener ([#12768](https://github.com/aws/aws-cdk/issues/12768)) ([b7b441f](https://github.com/aws/aws-cdk/commit/b7b441f74a07d26fd8de23df84e7ab4663c89c0c)), closes [#12766](https://github.com/aws/aws-cdk/issues/12766)
* **events:** `EventBus.grantPutEventsTo` method for granular grants ([#13429](https://github.com/aws/aws-cdk/issues/13429)) ([122a232](https://github.com/aws/aws-cdk/commit/122a232343699304d8f206d3024fcddfb2a94bc8)), closes [#11228](https://github.com/aws/aws-cdk/issues/11228)
* **events:** archive events ([#12060](https://github.com/aws/aws-cdk/issues/12060)) ([465cd9c](https://github.com/aws/aws-cdk/commit/465cd9c434acff74070ca6d33891e1481e253128)), closes [#11531](https://github.com/aws/aws-cdk/issues/11531)
* **events:** dead letter queue for Lambda Targets ([#11617](https://github.com/aws/aws-cdk/issues/11617)) ([1bb3650](https://github.com/aws/aws-cdk/commit/1bb3650c5dd2087b05793a5e903cdfb80fc5c1ad)), closes [#11612](https://github.com/aws/aws-cdk/issues/11612)
* **events:** dead-letter queue support for CodeBuild  ([#13448](https://github.com/aws/aws-cdk/issues/13448)) ([abfc0ea](https://github.com/aws/aws-cdk/commit/abfc0ea63c10d8033a529b7497cf093e318fdf12)), closes [#13447](https://github.com/aws/aws-cdk/issues/13447)
* **events:** dead-letter queue support for StepFunctions ([#13450](https://github.com/aws/aws-cdk/issues/13450)) ([0ebcb41](https://github.com/aws/aws-cdk/commit/0ebcb4160ee16f0f7ff1072a40c8951f9a983048)), closes [#13449](https://github.com/aws/aws-cdk/issues/13449)
* **events,applicationautoscaling:** schedule can be a token ([#13064](https://github.com/aws/aws-cdk/issues/13064)) ([b1449a1](https://github.com/aws/aws-cdk/commit/b1449a178b0f9a8a951c2546428f8d75c6431f0f))
* **iam:** SAML identity provider ([#13393](https://github.com/aws/aws-cdk/issues/13393)) ([faa0c06](https://github.com/aws/aws-cdk/commit/faa0c060dad9a5045495707e28fc85f223d4db5d)), closes [#5320](https://github.com/aws/aws-cdk/issues/5320)
* **lambda:** Code.fromDockerBuild ([#13318](https://github.com/aws/aws-cdk/issues/13318)) ([ad01099](https://github.com/aws/aws-cdk/commit/ad01099d5b8f835c3b87d7d20fd2dc1a5df2fd6f)), closes [#13273](https://github.com/aws/aws-cdk/issues/13273)
* **neptune:** high level constructs for db clusters and instances ([#12763](https://github.com/aws/aws-cdk/issues/12763)) ([c366837](https://github.com/aws/aws-cdk/commit/c36683701d88eb0c53fdd2add66b10c47c05f56b)), closes [aws#12762](https://github.com/aws/aws/issues/12762)
* **neptune:** Support IAM authentication ([#13462](https://github.com/aws/aws-cdk/issues/13462)) ([6c5b1f4](https://github.com/aws/aws-cdk/commit/6c5b1f42fb73a132d47945b529bab73557f2b9d8)), closes [#13461](https://github.com/aws/aws-cdk/issues/13461)
* **region-info:** added AppMesh ECR account for af-south-1 region ([#12814](https://github.com/aws/aws-cdk/issues/12814)) ([b3fba43](https://github.com/aws/aws-cdk/commit/b3fba43a047df61e713e8d2271d6deee7e07b716))


### Bug Fixes

* **cfn-include:** allow boolean values for string-typed properties ([#13508](https://github.com/aws/aws-cdk/issues/13508)) ([e5dab7c](https://github.com/aws/aws-cdk/commit/e5dab7cbc67c234d191c38a8b8b84b634070b15b))
* **cfn-include:** allow dynamic mappings to be used in Fn::FindInMap ([#13428](https://github.com/aws/aws-cdk/issues/13428)) ([623675d](https://github.com/aws/aws-cdk/commit/623675d2f8fb2786f23beb87994e687e8a7c6612))
* **cloudfront:** cannot add two EdgeFunctions with same aliases ([#13324](https://github.com/aws/aws-cdk/issues/13324)) ([1f35351](https://github.com/aws/aws-cdk/commit/1f3535145d22b2b13ebbcbfe31a3bfd73519352d)), closes [#13237](https://github.com/aws/aws-cdk/issues/13237)
* **cloudwatch:** MathExpression period of <5 minutes is not respected ([#13078](https://github.com/aws/aws-cdk/issues/13078)) ([d9ee914](https://github.com/aws/aws-cdk/commit/d9ee91432918aa113f728abdd61295096ed1512f)), closes [#9156](https://github.com/aws/aws-cdk/issues/9156)
* **cloudwatch:** metric `label` not rendered into Alarms ([#13070](https://github.com/aws/aws-cdk/issues/13070)) ([cbcc712](https://github.com/aws/aws-cdk/commit/cbcc712e0c4c44c83c7f4d1e8a544bccfa26bb56))
* **codebuild:** allow FILE_PATH webhook filter for BitBucket ([#13186](https://github.com/aws/aws-cdk/issues/13186)) ([cbed348](https://github.com/aws/aws-cdk/commit/cbed3488f03bdfba16f3950bda653535c8999db1)), closes [#13175](https://github.com/aws/aws-cdk/issues/13175)
* **core:** custom resource provider NODEJS_12 now looks like Lambda's NODEJS_12_X, add Node 14 ([#13301](https://github.com/aws/aws-cdk/issues/13301)) ([3413b2f](https://github.com/aws/aws-cdk/commit/3413b2f887596d11dfb53c0e99c2a1788095a2ad))
* **dynamodb:** replicas not created on table replacement ([#13300](https://github.com/aws/aws-cdk/issues/13300)) ([c7c424f](https://github.com/aws/aws-cdk/commit/c7c424fec42f1f14ab8bdc3011f5bdb602918aa3)), closes [#12332](https://github.com/aws/aws-cdk/issues/12332)
* **ec2:** fix typo's in WindowsImage constants ([#13446](https://github.com/aws/aws-cdk/issues/13446)) ([781aa97](https://github.com/aws/aws-cdk/commit/781aa97d53fdb7511c34ddde884fdcd84c3f68a6))
* **ec2:** NAT provider's default outbound rules cannot be disabled ([#12674](https://github.com/aws/aws-cdk/issues/12674)) ([664133a](https://github.com/aws/aws-cdk/commit/664133a35da2bd096a237971ce662f3dd38b297f)), closes [#12673](https://github.com/aws/aws-cdk/issues/12673)
* **ec2:** readme grammar ([#13180](https://github.com/aws/aws-cdk/issues/13180)) ([fe4f056](https://github.com/aws/aws-cdk/commit/fe4f05678c06d634d3fe9e1b608e444a57f67b9c))
* **ec2:** Throw error on empty InitFile content ([#13009](https://github.com/aws/aws-cdk/issues/13009)) ([#13119](https://github.com/aws/aws-cdk/issues/13119)) ([81a78a3](https://github.com/aws/aws-cdk/commit/81a78a31408276ebb020e45b15ddca7a2c57ae50))
* **ecr:** Allow referencing an EcrImage by digest instead of tag ([#13299](https://github.com/aws/aws-cdk/issues/13299)) ([266a621](https://github.com/aws/aws-cdk/commit/266a621abfc34c62ff1e26de9cb8cf0687588f89)), closes [#5082](https://github.com/aws/aws-cdk/issues/5082)
* **ecr:** Generate valid CloudFormation for imageScanOnPush ([#13420](https://github.com/aws/aws-cdk/issues/13420)) ([278fba5](https://github.com/aws/aws-cdk/commit/278fba5df4a3d785e49bdb57ccf88fd34bacacbb)), closes [#13418](https://github.com/aws/aws-cdk/issues/13418)
* **ecs:** services essential container exceptions thrown too soon ([#13240](https://github.com/aws/aws-cdk/issues/13240)) ([c174f6c](https://github.com/aws/aws-cdk/commit/c174f6c2f4dd909e07be34b66bd6b3a92d5e8484)), closes [#13239](https://github.com/aws/aws-cdk/issues/13239)
* **elasticloadbalancingv2:** should allow more than 2 certificates ([#13332](https://github.com/aws/aws-cdk/issues/13332)) ([d3155e9](https://github.com/aws/aws-cdk/commit/d3155e97fd9331a4732396941ce4ad20613fe81c)), closes [#13150](https://github.com/aws/aws-cdk/issues/13150)
* **elasticloadbalancingv2:** upgrade to v1.92.0 drops certificates on ALB if more than 2 certificates exist ([#13490](https://github.com/aws/aws-cdk/issues/13490)) ([01b94f8](https://github.com/aws/aws-cdk/commit/01b94f8aa6c88b5e676c784aec4c879acddc042f)), closes [#13332](https://github.com/aws/aws-cdk/issues/13332) [#13437](https://github.com/aws/aws-cdk/issues/13437)
* **events:** cannot trigger multiple Lambdas from the same Rule ([#13260](https://github.com/aws/aws-cdk/issues/13260)) ([c8c1762](https://github.com/aws/aws-cdk/commit/c8c1762c213aad1062c3a0bc48b22b05c3a0a185)), closes [#13231](https://github.com/aws/aws-cdk/issues/13231)
* **events:** imported ECS Task Definition cannot be used as target ([#13293](https://github.com/aws/aws-cdk/issues/13293)) ([6f7cebd](https://github.com/aws/aws-cdk/commit/6f7cebdf61073cc1fb358fcac5f5b2156389cb81)), closes [#12811](https://github.com/aws/aws-cdk/issues/12811)
* **events:** imported EventBus does not correctly register source account ([#13481](https://github.com/aws/aws-cdk/issues/13481)) ([57e5404](https://github.com/aws/aws-cdk/commit/57e540432c1446f2233a9b0c0f4caba4e9e155d9)), closes [#13469](https://github.com/aws/aws-cdk/issues/13469)
* **iam:** oidc-provider can't pull from hosts requiring SNI ([#13397](https://github.com/aws/aws-cdk/issues/13397)) ([90dbfb5](https://github.com/aws/aws-cdk/commit/90dbfb5eec19559717ac6b30f25451461027e731))
* **init:** Python init template's stack ID doesn't match other languages ([#13480](https://github.com/aws/aws-cdk/issues/13480)) ([3f1c02d](https://github.com/aws/aws-cdk/commit/3f1c02dac7a50ce7caebce1e7f8953f6e4937e6b))
* **lambda-nodejs:** paths with spaces break esbuild ([#13312](https://github.com/aws/aws-cdk/issues/13312)) ([f983fbb](https://github.com/aws/aws-cdk/commit/f983fbb474ecd6727b0c5a35333718cc55d78bf1)), closes [#13311](https://github.com/aws/aws-cdk/issues/13311)
* **python:** change Python namespace to `aws_cdk` ([#13489](https://github.com/aws/aws-cdk/issues/13489)) ([90f5311](https://github.com/aws/aws-cdk/commit/90f5311b8bfd32d3b2fb348264cdcb026a5975f5))
* **stepfunctions:** `SageMakeUpdateEndpoint` adds insufficient permissions ([#13170](https://github.com/aws/aws-cdk/issues/13170)) ([6126e49](https://github.com/aws/aws-cdk/commit/6126e499e5ca22b5f751af4f4f05d74f696829f1)), closes [#11594](https://github.com/aws/aws-cdk/issues/11594)
* **stepfunctions:** no validation on state machine name ([#13387](https://github.com/aws/aws-cdk/issues/13387)) ([6c3d407](https://github.com/aws/aws-cdk/commit/6c3d4071746179dde30f615602592c2523daa56e)), closes [#13289](https://github.com/aws/aws-cdk/issues/13289)

## [2.0.0-alpha.7](https://github.com/aws/aws-cdk/compare/v2.0.0-alpha.6...v2.0.0-alpha.7) (2021-03-10)


### ⚠ BREAKING CHANGES TO EXPERIMENTAL FEATURES

* **apigatewayv2:** `HttpApiMapping` (and related interfaces for `Attributed` and `Props`) has been renamed to `ApiMapping`
* **apigatewayv2:** `CommonStageOptions` has been renamed to `StageOptions`
* **apigatewayv2:** `HttpStage.fromStageName` has been removed in favour of `HttpStage.fromHttpStageAttributes`
* **apigatewayv2:** `DefaultDomainMappingOptions` has been removed in favour of `DomainMappingOptions`
* **apigatewayv2:** `HttpApiProps.defaultDomainMapping` has been changed from `DefaultDomainMappingOptions` to `DomainMappingOptions`
* **apigatewayv2:** `HttpApi.defaultStage` has been changed from `HttpStage` to `IStage`
* **apigatewayv2:** `IHttpApi.defaultStage` has been removed

### Features

* **apigatewayv2:** websocket api ([#13031](https://github.com/aws/aws-cdk/issues/13031)) ([fe1c839](https://github.com/aws/aws-cdk/commit/fe1c8393e0840fb273c4a5f325cb3cebc784bf4b)), closes [#2872](https://github.com/aws/aws-cdk/issues/2872)
* **aws-events:** Event Bus target ([#12926](https://github.com/aws/aws-cdk/issues/12926)) ([ea91aa3](https://github.com/aws/aws-cdk/commit/ea91aa31db9e2f31c734ad6d7e1f64d5d432dfd4)), closes [#9473](https://github.com/aws/aws-cdk/issues/9473)
* **aws-route53-targets:** add global accelerator target to route53 alias targets ([#13407](https://github.com/aws/aws-cdk/issues/13407)) ([2672a55](https://github.com/aws/aws-cdk/commit/2672a55c393e5ce7dd9a230d921ec1be1a23e32a)), closes [#12839](https://github.com/aws/aws-cdk/issues/12839)
* **cfnspec:** cloudformation spec v30.0.0 ([#13365](https://github.com/aws/aws-cdk/issues/13365)) ([ae0185d](https://github.com/aws/aws-cdk/commit/ae0185dd089e3bb7c5639ebc1bce3f95e126f71c))
* **cloudwatch:** EC2 actions ([#13281](https://github.com/aws/aws-cdk/issues/13281)) ([319cfcd](https://github.com/aws/aws-cdk/commit/319cfcdaaf92e4e6edb8c2388d04dce0971aaf86)), closes [#13228](https://github.com/aws/aws-cdk/issues/13228)
* **codebuild:** allow setting queued timeout ([#13467](https://github.com/aws/aws-cdk/issues/13467)) ([e09250b](https://github.com/aws/aws-cdk/commit/e09250bc92c62cb8ee0a8706ce90d0e82faf2d84)), closes [#11364](https://github.com/aws/aws-cdk/issues/11364)
* **cognito:** user pools - sign in with apple ([#13160](https://github.com/aws/aws-cdk/issues/13160)) ([b965589](https://github.com/aws/aws-cdk/commit/b965589358f4c281aea36404276f08128e6ff3db))
* **core:** `description` parameter in the CustomResourceProvider ([#13275](https://github.com/aws/aws-cdk/issues/13275)) ([78831cf](https://github.com/aws/aws-cdk/commit/78831cf9dec0407e7d827711183ac47be070f480)), closes [#13277](https://github.com/aws/aws-cdk/issues/13277) [#13276](https://github.com/aws/aws-cdk/issues/13276)
* **core:** customize bundling output packaging ([#13152](https://github.com/aws/aws-cdk/issues/13152)) ([6eca979](https://github.com/aws/aws-cdk/commit/6eca979f65542f3e44461588d8220e8c0bf76a6e))
* **dynamodb:** custom timeout for replication operation ([#13354](https://github.com/aws/aws-cdk/issues/13354)) ([6a5a4f2](https://github.com/aws/aws-cdk/commit/6a5a4f2d9bb6b09ad0d10066200fe53bb45f0737)), closes [#10249](https://github.com/aws/aws-cdk/issues/10249)
* **ec2:** Add VPC endpoint for RDS ([#12497](https://github.com/aws/aws-cdk/issues/12497)) ([fc87574](https://github.com/aws/aws-cdk/commit/fc8757437c37a0947cced720ff363b8858850f72)), closes [#12402](https://github.com/aws/aws-cdk/issues/12402)
* **ec2:** multipart user data ([#11843](https://github.com/aws/aws-cdk/issues/11843)) ([ed94c5e](https://github.com/aws/aws-cdk/commit/ed94c5ef1b9dd3042128b0e0c5bb14b3d9c7d497)), closes [#8315](https://github.com/aws/aws-cdk/issues/8315)
* **ecs:** ability to access tag parameter value of TagParameterContainerImage ([#13340](https://github.com/aws/aws-cdk/issues/13340)) ([e567a41](https://github.com/aws/aws-cdk/commit/e567a410d47366855ee3e6011aa096ba987b8099)), closes [#13202](https://github.com/aws/aws-cdk/issues/13202)
* **ecs:** add port mappings to containers with props ([#13262](https://github.com/aws/aws-cdk/issues/13262)) ([f511639](https://github.com/aws/aws-cdk/commit/f511639bba156f6edd15896a4dd8e27b07671ea1)), closes [#13261](https://github.com/aws/aws-cdk/issues/13261)
* **ecs:** allow selection of container and port for SRV service discovery records ([#12798](https://github.com/aws/aws-cdk/issues/12798)) ([a452bc3](https://github.com/aws/aws-cdk/commit/a452bc385640762a043392a717d49de29abcc64e)), closes [#12796](https://github.com/aws/aws-cdk/issues/12796)
* **elbv2:** allow control of ingress rules on redirect listener ([#12768](https://github.com/aws/aws-cdk/issues/12768)) ([b7b441f](https://github.com/aws/aws-cdk/commit/b7b441f74a07d26fd8de23df84e7ab4663c89c0c)), closes [#12766](https://github.com/aws/aws-cdk/issues/12766)
* **events:** archive events ([#12060](https://github.com/aws/aws-cdk/issues/12060)) ([465cd9c](https://github.com/aws/aws-cdk/commit/465cd9c434acff74070ca6d33891e1481e253128)), closes [#11531](https://github.com/aws/aws-cdk/issues/11531)
* **events:** dead letter queue for Lambda Targets ([#11617](https://github.com/aws/aws-cdk/issues/11617)) ([1bb3650](https://github.com/aws/aws-cdk/commit/1bb3650c5dd2087b05793a5e903cdfb80fc5c1ad)), closes [#11612](https://github.com/aws/aws-cdk/issues/11612)
* **events:** dead-letter queue support for StepFunctions ([#13450](https://github.com/aws/aws-cdk/issues/13450)) ([0ebcb41](https://github.com/aws/aws-cdk/commit/0ebcb4160ee16f0f7ff1072a40c8951f9a983048)), closes [#13449](https://github.com/aws/aws-cdk/issues/13449)
* **iam:** SAML identity provider ([#13393](https://github.com/aws/aws-cdk/issues/13393)) ([faa0c06](https://github.com/aws/aws-cdk/commit/faa0c060dad9a5045495707e28fc85f223d4db5d)), closes [#5320](https://github.com/aws/aws-cdk/issues/5320)
* **lambda:** Code.fromDockerBuild ([#13318](https://github.com/aws/aws-cdk/issues/13318)) ([ad01099](https://github.com/aws/aws-cdk/commit/ad01099d5b8f835c3b87d7d20fd2dc1a5df2fd6f)), closes [#13273](https://github.com/aws/aws-cdk/issues/13273)
* **neptune:** high level constructs for db clusters and instances ([#12763](https://github.com/aws/aws-cdk/issues/12763)) ([c366837](https://github.com/aws/aws-cdk/commit/c36683701d88eb0c53fdd2add66b10c47c05f56b)), closes [aws#12762](https://github.com/aws/aws/issues/12762)
* **neptune:** Support IAM authentication ([#13462](https://github.com/aws/aws-cdk/issues/13462)) ([6c5b1f4](https://github.com/aws/aws-cdk/commit/6c5b1f42fb73a132d47945b529bab73557f2b9d8)), closes [#13461](https://github.com/aws/aws-cdk/issues/13461)
* **region-info:** added AppMesh ECR account for af-south-1 region ([#12814](https://github.com/aws/aws-cdk/issues/12814)) ([b3fba43](https://github.com/aws/aws-cdk/commit/b3fba43a047df61e713e8d2271d6deee7e07b716))


### Bug Fixes

* **cfn-include:** allow dynamic mappings to be used in Fn::FindInMap ([#13428](https://github.com/aws/aws-cdk/issues/13428)) ([623675d](https://github.com/aws/aws-cdk/commit/623675d2f8fb2786f23beb87994e687e8a7c6612))
* **cloudfront:** cannot add two EdgeFunctions with same aliases ([#13324](https://github.com/aws/aws-cdk/issues/13324)) ([1f35351](https://github.com/aws/aws-cdk/commit/1f3535145d22b2b13ebbcbfe31a3bfd73519352d)), closes [#13237](https://github.com/aws/aws-cdk/issues/13237)
* **cloudwatch:** MathExpression period of <5 minutes is not respected ([#13078](https://github.com/aws/aws-cdk/issues/13078)) ([d9ee914](https://github.com/aws/aws-cdk/commit/d9ee91432918aa113f728abdd61295096ed1512f)), closes [#9156](https://github.com/aws/aws-cdk/issues/9156)
* **cloudwatch:** metric `label` not rendered into Alarms ([#13070](https://github.com/aws/aws-cdk/issues/13070)) ([cbcc712](https://github.com/aws/aws-cdk/commit/cbcc712e0c4c44c83c7f4d1e8a544bccfa26bb56))
* **codebuild:** allow FILE_PATH webhook filter for BitBucket ([#13186](https://github.com/aws/aws-cdk/issues/13186)) ([cbed348](https://github.com/aws/aws-cdk/commit/cbed3488f03bdfba16f3950bda653535c8999db1)), closes [#13175](https://github.com/aws/aws-cdk/issues/13175)
* **core:** custom resource provider NODEJS_12 now looks like Lambda's NODEJS_12_X, add Node 14 ([#13301](https://github.com/aws/aws-cdk/issues/13301)) ([3413b2f](https://github.com/aws/aws-cdk/commit/3413b2f887596d11dfb53c0e99c2a1788095a2ad))
* **dynamodb:** replicas not created on table replacement ([#13300](https://github.com/aws/aws-cdk/issues/13300)) ([c7c424f](https://github.com/aws/aws-cdk/commit/c7c424fec42f1f14ab8bdc3011f5bdb602918aa3)), closes [#12332](https://github.com/aws/aws-cdk/issues/12332)
* **ec2:** NAT provider's default outbound rules cannot be disabled ([#12674](https://github.com/aws/aws-cdk/issues/12674)) ([664133a](https://github.com/aws/aws-cdk/commit/664133a35da2bd096a237971ce662f3dd38b297f)), closes [#12673](https://github.com/aws/aws-cdk/issues/12673)
* **ec2:** readme grammar ([#13180](https://github.com/aws/aws-cdk/issues/13180)) ([fe4f056](https://github.com/aws/aws-cdk/commit/fe4f05678c06d634d3fe9e1b608e444a57f67b9c))
* **ec2:** Throw error on empty InitFile content ([#13009](https://github.com/aws/aws-cdk/issues/13009)) ([#13119](https://github.com/aws/aws-cdk/issues/13119)) ([81a78a3](https://github.com/aws/aws-cdk/commit/81a78a31408276ebb020e45b15ddca7a2c57ae50))
* **ecr:** Allow referencing an EcrImage by digest instead of tag ([#13299](https://github.com/aws/aws-cdk/issues/13299)) ([266a621](https://github.com/aws/aws-cdk/commit/266a621abfc34c62ff1e26de9cb8cf0687588f89)), closes [#5082](https://github.com/aws/aws-cdk/issues/5082)
* **ecr:** Generate valid CloudFormation for imageScanOnPush ([#13420](https://github.com/aws/aws-cdk/issues/13420)) ([278fba5](https://github.com/aws/aws-cdk/commit/278fba5df4a3d785e49bdb57ccf88fd34bacacbb)), closes [#13418](https://github.com/aws/aws-cdk/issues/13418)
* **ecs:** services essential container exceptions thrown too soon ([#13240](https://github.com/aws/aws-cdk/issues/13240)) ([c174f6c](https://github.com/aws/aws-cdk/commit/c174f6c2f4dd909e07be34b66bd6b3a92d5e8484)), closes [#13239](https://github.com/aws/aws-cdk/issues/13239)
* **elasticloadbalancingv2:** should allow more than 2 certificates ([#13332](https://github.com/aws/aws-cdk/issues/13332)) ([d3155e9](https://github.com/aws/aws-cdk/commit/d3155e97fd9331a4732396941ce4ad20613fe81c)), closes [#13150](https://github.com/aws/aws-cdk/issues/13150)
* **events:** cannot trigger multiple Lambdas from the same Rule ([#13260](https://github.com/aws/aws-cdk/issues/13260)) ([c8c1762](https://github.com/aws/aws-cdk/commit/c8c1762c213aad1062c3a0bc48b22b05c3a0a185)), closes [#13231](https://github.com/aws/aws-cdk/issues/13231)
* **events:** imported ECS Task Definition cannot be used as target ([#13293](https://github.com/aws/aws-cdk/issues/13293)) ([6f7cebd](https://github.com/aws/aws-cdk/commit/6f7cebdf61073cc1fb358fcac5f5b2156389cb81)), closes [#12811](https://github.com/aws/aws-cdk/issues/12811)
* **iam:** oidc-provider can't pull from hosts requiring SNI ([#13397](https://github.com/aws/aws-cdk/issues/13397)) ([90dbfb5](https://github.com/aws/aws-cdk/commit/90dbfb5eec19559717ac6b30f25451461027e731))
* **lambda-nodejs:** paths with spaces break esbuild ([#13312](https://github.com/aws/aws-cdk/issues/13312)) ([f983fbb](https://github.com/aws/aws-cdk/commit/f983fbb474ecd6727b0c5a35333718cc55d78bf1)), closes [#13311](https://github.com/aws/aws-cdk/issues/13311)
* **python:** change Python namespace to `aws_cdk` ([#13489](https://github.com/aws/aws-cdk/issues/13489)) ([90f5311](https://github.com/aws/aws-cdk/commit/90f5311b8bfd32d3b2fb348264cdcb026a5975f5))
* **stepfunctions:** `SageMakeUpdateEndpoint` adds insufficient permissions ([#13170](https://github.com/aws/aws-cdk/issues/13170)) ([6126e49](https://github.com/aws/aws-cdk/commit/6126e499e5ca22b5f751af4f4f05d74f696829f1)), closes [#11594](https://github.com/aws/aws-cdk/issues/11594)

## [2.0.0-alpha.6](https://github.com/aws/aws-cdk/compare/v2.0.0-alpha.5...v2.0.0-alpha.6) (2021-03-03)


### ⚠ BREAKING CHANGES TO EXPERIMENTAL FEATURES

* **ecs-patterns:** ** the desiredCount property stored on the above constructs will be optional, allowing them to be undefined. This is enabled through the `@aws-cdk/aws-ecs-patterns:removeDefaultDesiredCount` feature flag. We would recommend all aws-cdk users to set the `REMOVE_DEFAULT_DESIRED_COUNT` flag to true for all of their existing applications. 

Fixes: https://github.com/aws/aws-cdk/issues/12990
* **aws-appsync:** RdsDataSource now takes a ServerlessCluster instead of a DatabaseCluster

### Features

* **apigateway:** integrate with aws services in a different region ([#13251](https://github.com/aws/aws-cdk/issues/13251)) ([d942699](https://github.com/aws/aws-cdk/commit/d9426996c07ff909993594ed91cfcf2b5761414b)), closes [#7009](https://github.com/aws/aws-cdk/issues/7009)
* **aws-s3:** adds s3 bucket AWS FSBP option ([#12804](https://github.com/aws/aws-cdk/issues/12804)) ([b9cdd52](https://github.com/aws/aws-cdk/commit/b9cdd52274eca55940c65b830939132d0e074365)), closes [#10969](https://github.com/aws/aws-cdk/issues/10969)
* **cfnspec:** cloudformation spec v29.0.0 ([#13249](https://github.com/aws/aws-cdk/issues/13249)) ([6318e26](https://github.com/aws/aws-cdk/commit/6318e2632297783bc8b5b2609bba096dd83a1113))
* **cli:** Configurable --change-set-name CLI flag ([#13024](https://github.com/aws/aws-cdk/issues/13024)) ([18184df](https://github.com/aws/aws-cdk/commit/18184df05f5b8478ef9cae1285e45e61a0833822)), closes [#11075](https://github.com/aws/aws-cdk/issues/11075) [/github.com/aws/aws-cdk/pull/12683#issuecomment-778465771](https://github.com/aws//github.com/aws/aws-cdk/pull/12683/issues/issuecomment-778465771)
* **ecs-patterns:** remove default desiredCount to align with cfn behaviour (under feature flag) ([#13130](https://github.com/aws/aws-cdk/issues/13130)) ([a9caa45](https://github.com/aws/aws-cdk/commit/a9caa455b708e08f1cf2d366ac32892d4faa59b4))
* **elasticloadbalancingv2:** Add support for application cookies ([#13142](https://github.com/aws/aws-cdk/issues/13142)) ([23385dd](https://github.com/aws/aws-cdk/commit/23385ddeb0decd227a0104d7b0aff06939acaad9))
* **lambda:** code signing config ([#12656](https://github.com/aws/aws-cdk/issues/12656)) ([778ea27](https://github.com/aws/aws-cdk/commit/778ea2759a8a4504dc232eb6b1d77a38f8ee7aef)), closes [#12216](https://github.com/aws/aws-cdk/issues/12216)
* **stepfunctions-tasks:** add EKS call to SFN-tasks ([#12779](https://github.com/aws/aws-cdk/issues/12779)) ([296a10d](https://github.com/aws/aws-cdk/commit/296a10d76a9f6fc2a374d1a6461c460bcc3eeb79))
* **synthetics:** Update CloudWatch Synthetics NodeJS runtimes ([#12907](https://github.com/aws/aws-cdk/issues/12907)) ([6aac3b6](https://github.com/aws/aws-cdk/commit/6aac3b6a9bb1586ee16e7a85ca657b544d0f8304)), closes [#12906](https://github.com/aws/aws-cdk/issues/12906)


### Bug Fixes

* **appsync:** revert to allow resolver creation from data source ([#12973](https://github.com/aws/aws-cdk/issues/12973)) ([d35f032](https://github.com/aws/aws-cdk/commit/d35f03226d6d7fb5be246b4d3584ee9205b0ef2d)), closes [#12635](https://github.com/aws/aws-cdk/issues/12635) [#11522](https://github.com/aws/aws-cdk/issues/11522)
* **aws-appsync:** use serverlessCluster on rdsDataSource ([#13206](https://github.com/aws/aws-cdk/issues/13206)) ([45cf387](https://github.com/aws/aws-cdk/commit/45cf3873fb48d4043e7a22284d36695ea6bde6ef)), closes [#12567](https://github.com/aws/aws-cdk/issues/12567)
* **custom-resources:** unable to use a resource attributes as dictionary keys in AwsCustomResource ([#13074](https://github.com/aws/aws-cdk/issues/13074)) ([3cb3104](https://github.com/aws/aws-cdk/commit/3cb31043a42b035f6dcd2a318836d4bfc4973151)), closes [#13063](https://github.com/aws/aws-cdk/issues/13063)
* **eks:** `KubectlProvider` creates un-necessary security group ([#13178](https://github.com/aws/aws-cdk/issues/13178)) ([c5e8b6d](https://github.com/aws/aws-cdk/commit/c5e8b6df1e5f0359d51d025edcc68508ab5daef1))
* **lambda-nodejs:** 'must use "outdir"' error with spaces in paths ([#13268](https://github.com/aws/aws-cdk/issues/13268)) ([09723f5](https://github.com/aws/aws-cdk/commit/09723f58ed3034fc2cb46316e6d798cb8f2bf96e)), closes [#13210](https://github.com/aws/aws-cdk/issues/13210)
* **lambda-nodejs:** invalid sample in documentation ([#12404](https://github.com/aws/aws-cdk/issues/12404)) ([520c263](https://github.com/aws/aws-cdk/commit/520c263ca3c6b0ea7d9c09c23e509a3373ee2b8a))
* **lambda-python:** asset hash is non-deterministic ([#12984](https://github.com/aws/aws-cdk/issues/12984)) ([37debc0](https://github.com/aws/aws-cdk/commit/37debc0513c5174ca3d918fce94a138d5d34b586)), closes [#12770](https://github.com/aws/aws-cdk/issues/12770) [#12684](https://github.com/aws/aws-cdk/issues/12684)
* incorrect peerDependency on "constructs" ([#13255](https://github.com/aws/aws-cdk/issues/13255)) ([17244af](https://github.com/aws/aws-cdk/commit/17244af0d181a28b908fa161250c5a3285521c53))
* UserPool, Volume, ElasticSearch, FSx are now RETAIN by default ([#12920](https://github.com/aws/aws-cdk/issues/12920)) ([5a54741](https://github.com/aws/aws-cdk/commit/5a54741a414d3f8b7913163f4785759b984b41d8)), closes [#12563](https://github.com/aws/aws-cdk/issues/12563)

## [2.0.0-alpha.5](https://github.com/aws/aws-cdk/compare/v2.0.0-alpha.4...v2.0.0-alpha.5) (2021-02-17)


### Features

* **apigatewayv2:** http api - jwt and cognito user pool authorizers ([#10972](https://github.com/aws/aws-cdk/issues/10972)) ([dd90e54](https://github.com/aws/aws-cdk/commit/dd90e5464b24e097a3e41a81556924018a422181)), closes [#10534](https://github.com/aws/aws-cdk/issues/10534)
* **aws-kinesisanalyticsv2:** L2 construct for Flink applications ([#12464](https://github.com/aws/aws-cdk/issues/12464)) ([94279f3](https://github.com/aws/aws-cdk/commit/94279f35e4f5ef961e0ba8528e34a8fccb9ef3fe)), closes [/github.com/aws-samples/amazon-kinesis-analytics-streaming-etl/blob/master/cdk/lib/streaming-etl.ts#L100](https://github.com/aws//github.com/aws-samples/amazon-kinesis-analytics-streaming-etl/blob/master/cdk/lib/streaming-etl.ts/issues/L100)
* **cfnspec:** cloudformation spec v27.0.0 ([#12960](https://github.com/aws/aws-cdk/issues/12960)) ([7730ac8](https://github.com/aws/aws-cdk/commit/7730ac8c6c7aedb233a24c665666b9651b2401a5))
* **cli:** change set name is now a constant, and --no-execute will always produce one (even if empty) ([#12683](https://github.com/aws/aws-cdk/issues/12683)) ([00cdd2a](https://github.com/aws/aws-cdk/commit/00cdd2a2188d146af8b8df998e97da91c77dc270)), closes [#11075](https://github.com/aws/aws-cdk/issues/11075)
* **core:** configure bundling docker entrypoint ([#12660](https://github.com/aws/aws-cdk/issues/12660)) ([6597a09](https://github.com/aws/aws-cdk/commit/6597a09310fbc13d43389eca91b0e4b26f8ca680)), closes [#11984](https://github.com/aws/aws-cdk/issues/11984)
* **elasticsearch:** add custom endpoint options ([#12904](https://github.com/aws/aws-cdk/issues/12904)) ([f67ab86](https://github.com/aws/aws-cdk/commit/f67ab8689dc38803253067c4f9632b9bc5ea653f)), closes [#12261](https://github.com/aws/aws-cdk/issues/12261)
* **redshift:** add missing current generation RA3 NodeTypes ([#12784](https://github.com/aws/aws-cdk/issues/12784)) ([f91a3f1](https://github.com/aws/aws-cdk/commit/f91a3f1302c395e8c7ffe9d6164e8f3b252f9a27)), closes [#12783](https://github.com/aws/aws-cdk/issues/12783)
* **stepfunctions:** Implement IGrantable ([#12830](https://github.com/aws/aws-cdk/issues/12830)) ([3b5ff05](https://github.com/aws/aws-cdk/commit/3b5ff0562090059f3a94140161acce53e484776c)), closes [#12829](https://github.com/aws/aws-cdk/issues/12829)
* future flags 'core:enableStackNameDuplicates', 'aws-secretsmanager:parseOwnedSecretName' and 'aws-kms:defaultKeyPolicies' are no longer supported ([#12644](https://github.com/aws/aws-cdk/issues/12644)) ([7554246](https://github.com/aws/aws-cdk/commit/7554246ab6d0819bc57d5e67cd9e4e10a3b7e742))


### Bug Fixes

* **cfn-diff:** correctly handle version strings like '0.0.0' ([#13022](https://github.com/aws/aws-cdk/issues/13022)) ([34a921b](https://github.com/aws/aws-cdk/commit/34a921b9667402b6d90731f1fd9e3de1ef27f8bf)), closes [#13016](https://github.com/aws/aws-cdk/issues/13016)
* **cfn2ts:** correctly choose between string and object without required properties in a union ([#12954](https://github.com/aws/aws-cdk/issues/12954)) ([b7137c5](https://github.com/aws/aws-cdk/commit/b7137c59d04f14a6ad890bff1faf0f36cae131b0)), closes [#12854](https://github.com/aws/aws-cdk/issues/12854)
* **codedeploy:** allow the install agent script's commands to exit with errors ([#12782](https://github.com/aws/aws-cdk/issues/12782)) ([23d52a5](https://github.com/aws/aws-cdk/commit/23d52a570b591f080eebfbd9dc679a9ef2daeebf)), closes [#12764](https://github.com/aws/aws-cdk/issues/12764)
* **codepipeline-actions:** use BatchGetBuildBatches permission for batch builds ([#13018](https://github.com/aws/aws-cdk/issues/13018)) ([09ba573](https://github.com/aws/aws-cdk/commit/09ba573a816cc4fa9898c1700136bb332801721c))
* **ec2:** MachineImage.genericLinux/Windows don't work in environment-agnostic stacks ([#12546](https://github.com/aws/aws-cdk/issues/12546)) ([fbe7e89](https://github.com/aws/aws-cdk/commit/fbe7e89ba764093ddec9caa7de3ca921f3dc68ac)), closes [#8759](https://github.com/aws/aws-cdk/issues/8759)
* **ec2:** Subnet cidr missing for Vpc.from_lookup() ([#12878](https://github.com/aws/aws-cdk/issues/12878)) ([9028269](https://github.com/aws/aws-cdk/commit/90282693999efdc43330b9526b9d7f4cd0fa5736)), closes [#11821](https://github.com/aws/aws-cdk/issues/11821)
* **ec2:** volume props validations are incorrect ([#12821](https://github.com/aws/aws-cdk/issues/12821)) ([12cddff](https://github.com/aws/aws-cdk/commit/12cddffcfa38cc0522e4c36327f193e6a605f441)), closes [#12816](https://github.com/aws/aws-cdk/issues/12816) [#12816](https://github.com/aws/aws-cdk/issues/12816) [#12074](https://github.com/aws/aws-cdk/issues/12074)
* **ec2:** VpnConnection fails if `ip` is a Token ([#12923](https://github.com/aws/aws-cdk/issues/12923)) ([953957a](https://github.com/aws/aws-cdk/commit/953957a2c3e630b5ad2196e113f943e27ee21067)), closes [#11633](https://github.com/aws/aws-cdk/issues/11633)
* **kms:** cross-environment usage fails when trustAccountIdentities is set ([#12925](https://github.com/aws/aws-cdk/issues/12925)) ([2b917ec](https://github.com/aws/aws-cdk/commit/2b917eceb598b3365123781445df7e2bd8a80b74)), closes [#12921](https://github.com/aws/aws-cdk/issues/12921) [#12741](https://github.com/aws/aws-cdk/issues/12741)
* **lambda-python:** cryptography >= 3.4 is not supported by older pip version ([#12934](https://github.com/aws/aws-cdk/issues/12934)) ([b68acf8](https://github.com/aws/aws-cdk/commit/b68acf828e04841dd7e62b30fe80db8c25e5d96e)), closes [/cryptography.io/en/3.4/changelog.html#v3-4](https://github.com/aws//cryptography.io/en/3.4/changelog.html/issues/v3-4)
* **tools:** doc block links not clickable in VS Code ([#12336](https://github.com/aws/aws-cdk/issues/12336)) ([4f17f92](https://github.com/aws/aws-cdk/commit/4f17f923edc5e55b0977dcb250c9908027297d1b))

## [2.0.0-alpha.4](https://github.com/aws/aws-cdk/compare/v2.0.0-alpha.3...v2.0.0-alpha.4) (2021-02-10)


### ⚠ BREAKING CHANGES TO EXPERIMENTAL FEATURES

* **appmesh:** the properties virtualRouter and virtualNode of VirtualServiceProps have been replaced with the union-like class VirtualServiceProvider
* **appmesh**: the method `addVirtualService` has been removed from `IMesh`
* **cloudfront:** experimental EdgeFunction stack names have changed from 'edge-lambda-stack-${region}' to 'edge-lambda-stack-${stackid}' to support multiple independent CloudFront distributions with EdgeFunctions.

### Features

* **apigateway:** cognito user pool authorizer ([#12786](https://github.com/aws/aws-cdk/issues/12786)) ([ff1e5b3](https://github.com/aws/aws-cdk/commit/ff1e5b3c580119c107fe26c67fe3cc220f9ee7c9)), closes [#5618](https://github.com/aws/aws-cdk/issues/5618)
* **apigateway:** import an existing Resource ([#12785](https://github.com/aws/aws-cdk/issues/12785)) ([8a1a9b8](https://github.com/aws/aws-cdk/commit/8a1a9b82a36e681334fd45be595f6ecdf904ad34)), closes [#4432](https://github.com/aws/aws-cdk/issues/4432)
* **appmesh:** change VirtualService provider to a union-like class ([#11978](https://github.com/aws/aws-cdk/issues/11978)) ([dfc765a](https://github.com/aws/aws-cdk/commit/dfc765af44c755f10be8f6c1c2eae55f62e2aa08)), closes [#9490](https://github.com/aws/aws-cdk/issues/9490)
* **aws-route53:** cross account DNS delegations ([#12680](https://github.com/aws/aws-cdk/issues/12680)) ([126a693](https://github.com/aws/aws-cdk/commit/126a6935cacc1f68b1d1155e484912d4ed6978f2)), closes [#8776](https://github.com/aws/aws-cdk/issues/8776)
* **cfnspec:** cloudformation spec v26.0.0 ([#12841](https://github.com/aws/aws-cdk/issues/12841)) ([f959b3a](https://github.com/aws/aws-cdk/commit/f959b3a2eeb5a9a9e44ea3f88622f77f7667bfa4))
* **cloudfront:** add PublicKey and KeyGroup L2 constructs  ([#12743](https://github.com/aws/aws-cdk/issues/12743)) ([59cb6d0](https://github.com/aws/aws-cdk/commit/59cb6d032a55515ec5e9903f899de588d18d4cb5))
* **cloudfront:** add support for TrustedKeyGroups in Distribution and CloudFrontWebDistribution ([#12847](https://github.com/aws/aws-cdk/issues/12847)) ([349a6e2](https://github.com/aws/aws-cdk/commit/349a6e2bfaa72440deb3767fb1e28e38cc4d73ef)), closes [#11791](https://github.com/aws/aws-cdk/issues/11791)
* **core:** `stack.exportValue()` can be used to solve "deadly embrace" ([#12778](https://github.com/aws/aws-cdk/issues/12778)) ([3b66088](https://github.com/aws/aws-cdk/commit/3b66088010b6f2315a215e92505d5279680f16d4)), closes [#7602](https://github.com/aws/aws-cdk/issues/7602) [#2036](https://github.com/aws/aws-cdk/issues/2036)
* **ec2:** can define Launch Templates (not use them yet) ([#12385](https://github.com/aws/aws-cdk/issues/12385)) ([32c0de7](https://github.com/aws/aws-cdk/commit/32c0de74cf40f08a291c8589fd85f3dd636749ea))
* **ecr:** Public Gallery authorization token ([#12775](https://github.com/aws/aws-cdk/issues/12775)) ([8434294](https://github.com/aws/aws-cdk/commit/84342943ad9f2ea8a83773f00816a0b8117c4d17))
* **ecs-patterns:** Add PlatformVersion option to ScheduledFargateTask props ([#12676](https://github.com/aws/aws-cdk/issues/12676)) ([3cbf38b](https://github.com/aws/aws-cdk/commit/3cbf38b09a9e66a6c009f833481fb25b8c5fc26c)), closes [#12623](https://github.com/aws/aws-cdk/issues/12623)
* **elbv2:** support for 2020 SSL policy ([#12710](https://github.com/aws/aws-cdk/issues/12710)) ([1dd3d05](https://github.com/aws/aws-cdk/commit/1dd3d0518dc2a70c725f87dd5d4377338389125c)), closes [#12595](https://github.com/aws/aws-cdk/issues/12595)
* **iam:** Permissions Boundaries ([#12777](https://github.com/aws/aws-cdk/issues/12777)) ([415eb86](https://github.com/aws/aws-cdk/commit/415eb861c65829cc53eabbbb8706f83f08c74570)), closes [aws/aws-cdk-rfcs#5](https://github.com/aws/aws-cdk-rfcs/issues/5) [#3242](https://github.com/aws/aws-cdk/issues/3242)
* **lambda:** inline code for Python 3.8 ([#12788](https://github.com/aws/aws-cdk/issues/12788)) ([8d3aaba](https://github.com/aws/aws-cdk/commit/8d3aabaffe436e6a3eebc0a58fe361c5b4b93f08)), closes [#6503](https://github.com/aws/aws-cdk/issues/6503)
* **lambda:** layer version removal policy ([#12792](https://github.com/aws/aws-cdk/issues/12792)) ([5664480](https://github.com/aws/aws-cdk/commit/5664480a97958263ee7cb903c2aff0276e738dc3)), closes [#12718](https://github.com/aws/aws-cdk/issues/12718)
* **lambda:** nodejs14.x runtime ([#12861](https://github.com/aws/aws-cdk/issues/12861)) ([12c224a](https://github.com/aws/aws-cdk/commit/12c224a0f54230b6226de8defa527f7b53f9bc65))


### Bug Fixes

* **apigateway:** stack update fails to replace api key ([38cbe62](https://github.com/aws/aws-cdk/commit/38cbe620859d6efabda95dbdd3185a480ab43894)), closes [#12698](https://github.com/aws/aws-cdk/issues/12698)
* **apigateway:** stack update fails to replace api key ([#12745](https://github.com/aws/aws-cdk/issues/12745)) ([ffe7e42](https://github.com/aws/aws-cdk/commit/ffe7e425e605144a465cea9befa68d4fe19f9d8c)), closes [#12698](https://github.com/aws/aws-cdk/issues/12698)
* **cfn-include:** AWS::CloudFormation resources fail in monocdk ([#12758](https://github.com/aws/aws-cdk/issues/12758)) ([5060782](https://github.com/aws/aws-cdk/commit/5060782b00e17bdf44e225f8f5ef03344be238c7)), closes [#11595](https://github.com/aws/aws-cdk/issues/11595)
* **cli, codepipeline:** renamed bootstrap stack still not supported ([#12771](https://github.com/aws/aws-cdk/issues/12771)) ([40b32bb](https://github.com/aws/aws-cdk/commit/40b32bbda272b6e2f92fd5dd8de7ca5bf405ce52)), closes [#12594](https://github.com/aws/aws-cdk/issues/12594) [#12732](https://github.com/aws/aws-cdk/issues/12732)
* **cloudfront:** use node addr for edgeStackId name ([#12702](https://github.com/aws/aws-cdk/issues/12702)) ([c429bb7](https://github.com/aws/aws-cdk/commit/c429bb7df2406346426dce22d716cabc484ec7e6)), closes [#12323](https://github.com/aws/aws-cdk/issues/12323)
* **codedeploy:** wrong syntax on Windows 'installAgent' flag ([#12736](https://github.com/aws/aws-cdk/issues/12736)) ([238742e](https://github.com/aws/aws-cdk/commit/238742e4323310ce850d8edc70abe4b0e9f53186)), closes [#12734](https://github.com/aws/aws-cdk/issues/12734)
* **codepipeline:** permission denied for Action-level environment variables ([#12761](https://github.com/aws/aws-cdk/issues/12761)) ([99fd074](https://github.com/aws/aws-cdk/commit/99fd074a07ead624f64d3fe64685ba67c798976e)), closes [#12742](https://github.com/aws/aws-cdk/issues/12742)
* **core:** append file extension to s3 asset key in new style synthesizer ([#12765](https://github.com/aws/aws-cdk/issues/12765)) ([77b9d39](https://github.com/aws/aws-cdk/commit/77b9d3930ec722be3a40e4013cd9335f90b0d945)), closes [#12740](https://github.com/aws/aws-cdk/issues/12740)
* **core:** incorrect GetParameter permissions in nonstandard partitions ([#12813](https://github.com/aws/aws-cdk/issues/12813)) ([be7202f](https://github.com/aws/aws-cdk/commit/be7202fa229435607e81d480726e9ce7f625b85a))
* **ec2:** ARM-backed bastion hosts try to run x86-based Amazon Linux AMI ([#12280](https://github.com/aws/aws-cdk/issues/12280)) ([1a73d76](https://github.com/aws/aws-cdk/commit/1a73d761ad2363842567a1b6e0488ceb093e70b2)), closes [#12279](https://github.com/aws/aws-cdk/issues/12279)
* **efs:** EFS fails to create when using a VPC with multiple subnets per availability zone ([#12097](https://github.com/aws/aws-cdk/issues/12097)) ([889d673](https://github.com/aws/aws-cdk/commit/889d6734c10174f2661e45057c345cd112a44187)), closes [#10170](https://github.com/aws/aws-cdk/issues/10170)
* **iam:** cannot use the same Role for multiple Config Rules ([#12724](https://github.com/aws/aws-cdk/issues/12724)) ([2f6521a](https://github.com/aws/aws-cdk/commit/2f6521a1d8670b2653f7dee281309351181cf918)), closes [#12714](https://github.com/aws/aws-cdk/issues/12714)
* **lambda:** codeguru profiler not set up for Node runtime ([#12712](https://github.com/aws/aws-cdk/issues/12712)) ([59db763](https://github.com/aws/aws-cdk/commit/59db763e7d05d68fd85b6fd37246d69d4670d7d5)), closes [#12624](https://github.com/aws/aws-cdk/issues/12624)

## [2.0.0-alpha.3](https://github.com/aws/aws-cdk/compare/v2.0.0-alpha.2...v2.0.0-alpha.3) (2021-02-03)


### Features

* **aws-codebuild:** add `enableBatchBuilds()` to Project ([#12531](https://github.com/aws/aws-cdk/issues/12531)) ([0568390](https://github.com/aws/aws-cdk/commit/05683907d6ffc9ab12b6744c1b59b0df096789e1))
* **batch:** Compute Resources placement group ([#12203](https://github.com/aws/aws-cdk/issues/12203)) ([fe37174](https://github.com/aws/aws-cdk/commit/fe37174ec29b7d3b60b252df08ceecf1aa057098))

## [2.0.0-alpha.2](https://github.com/aws/aws-cdk/compare/v2.0.0-alpha.1...v2.0.0-alpha.2) (2021-01-27)


### ⚠ BREAKING CHANGES TO EXPERIMENTAL FEATURES

* **s3-deployment:** User metadata keys of bucket objects will change from `x-amz-meta-x-amz-meta-x-amzn-meta-mykey` to `x-amz-meta-mykey`.
* **core:** users of modern synthesis (`DefaultSynthesizer`,
used by CDK Pipelines) must upgrade their bootstrap stacks. Run `cdk bootstrap`.

### Features

* **aws-codepipeline-actions:** Add Full Clone support for CodeCommit ([#12558](https://github.com/aws/aws-cdk/issues/12558)) ([d169688](https://github.com/aws/aws-cdk/commit/d169688f35bc78c88c44ff9a7d8fa0dfea71f904)), closes [#12236](https://github.com/aws/aws-cdk/issues/12236)
* **cfnspec:** cloudformation spec v24.0.0 ([#12615](https://github.com/aws/aws-cdk/issues/12615)) ([98ebe96](https://github.com/aws/aws-cdk/commit/98ebe964fcd1f528fc4796bf39dc574b222b0014)), closes [#12474](https://github.com/aws/aws-cdk/issues/12474)
* **cognito:** allow to set read and write attributes in Cognito UserPoolClient ([#7607](https://github.com/aws/aws-cdk/issues/7607)) ([552e1e9](https://github.com/aws/aws-cdk/commit/552e1e9d649528875680a8a1cb2aad8f0a0ebcea)), closes [#7407](https://github.com/aws/aws-cdk/issues/7407)
* **ec2:** Support for new EBS types ([#12074](https://github.com/aws/aws-cdk/issues/12074)) ([6a2ce55](https://github.com/aws/aws-cdk/commit/6a2ce55e7213bb8356f2f37dbd02f1a3d52883be)), closes [#12071](https://github.com/aws/aws-cdk/issues/12071)
* **eks:** Graduate to stable ([#12640](https://github.com/aws/aws-cdk/issues/12640)) ([b5ba7cd](https://github.com/aws/aws-cdk/commit/b5ba7cdd61714bcfbf2135240790340a77ee1a8b))
* **s3:** Bucket keys  ([#12376](https://github.com/aws/aws-cdk/issues/12376)) ([d126fcc](https://github.com/aws/aws-cdk/commit/d126fcca685346c0607babfbbf4d341f669a9e81)), closes [#11828](https://github.com/aws/aws-cdk/issues/11828)
* **stepfunctions-tasks:** EcsRunTask now uses taskDefinition family instead of ARN ([#12436](https://github.com/aws/aws-cdk/issues/12436)) ([abde96b](https://github.com/aws/aws-cdk/commit/abde96b046358fc5435545692eba4fd63d503914)), closes [#12080](https://github.com/aws/aws-cdk/issues/12080)
* **stepfunctions-tasks:** support databrew startJobRun task ([#12532](https://github.com/aws/aws-cdk/issues/12532)) ([eacd2f7](https://github.com/aws/aws-cdk/commit/eacd2f7ea67c83d50c839acf29fbe953ae49d987))


### Bug Fixes

* **apigateway:** cannot remove first api key from usage plan ([#12505](https://github.com/aws/aws-cdk/issues/12505)) ([96cbe32](https://github.com/aws/aws-cdk/commit/96cbe32d2399d82a2ad6c3bf6dc1fd65396882d4)), closes [#11876](https://github.com/aws/aws-cdk/issues/11876)
* **apigatewayv2:** multiple http integrations are created for each route ([#12528](https://github.com/aws/aws-cdk/issues/12528)) ([855ce59](https://github.com/aws/aws-cdk/commit/855ce59039a577d142d68720e86d81610edffc64)), closes [40aws-cdk/aws-apigatewayv2/lib/http/route.ts#L128](https://github.com/40aws-cdk/aws-apigatewayv2/lib/http/route.ts/issues/L128)
* **aws-ecs:** Invalid user data defined for windows autoscaling groups ([#12585](https://github.com/aws/aws-cdk/issues/12585)) ([638b995](https://github.com/aws/aws-cdk/commit/638b995cb72b0819a1965a7ccf451b6ed9034a1b)), closes [#12583](https://github.com/aws/aws-cdk/issues/12583)
* **core:** modern deployments fail if bootstrap stack is renamed ([#12594](https://github.com/aws/aws-cdk/issues/12594)) ([e5c616f](https://github.com/aws/aws-cdk/commit/e5c616f73eac395492636341f57fb6a716d1ea69)), closes [#11952](https://github.com/aws/aws-cdk/issues/11952) [#11420](https://github.com/aws/aws-cdk/issues/11420) [#9053](https://github.com/aws/aws-cdk/issues/9053)
* **pipelines:** assets broken in Pipelines synthesized from Windows ([#12573](https://github.com/aws/aws-cdk/issues/12573)) ([5c3dce5](https://github.com/aws/aws-cdk/commit/5c3dce56c71083321069a31213aaa5bce40f51d3)), closes [#12540](https://github.com/aws/aws-cdk/issues/12540)
* **pipelines:** can't use CodePipeline variables in Synth environment variables ([#12602](https://github.com/aws/aws-cdk/issues/12602)) ([736b260](https://github.com/aws/aws-cdk/commit/736b260db7f21d89e220591007580f62b22fea3a)), closes [#12061](https://github.com/aws/aws-cdk/issues/12061) [#11178](https://github.com/aws/aws-cdk/issues/11178)
* **pipelines:** unable to publish assets inside VPC ([#12331](https://github.com/aws/aws-cdk/issues/12331)) ([a16f09c](https://github.com/aws/aws-cdk/commit/a16f09c9ea675caf5b1e50a4e1cc288e5afd1237)), closes [#11815](https://github.com/aws/aws-cdk/issues/11815)
* **s3-deployment:** User metadata keys have redundant triple `x-amz` prefix ([#12414](https://github.com/aws/aws-cdk/issues/12414)) ([6716181](https://github.com/aws/aws-cdk/commit/671618152dc585ef0703f6c3501f6ee5a366b4a9)), closes [#8459](https://github.com/aws/aws-cdk/issues/8459)
* **secretsmanager:** fromSecretPartialArn() has incorrect grant policies ([#12665](https://github.com/aws/aws-cdk/issues/12665)) ([560915e](https://github.com/aws/aws-cdk/commit/560915ece87a919f499a64452b919a0b291394ee)), closes [#12411](https://github.com/aws/aws-cdk/issues/12411)
* **synthetics:** default execution role breaks in non aws partitions ([#12096](https://github.com/aws/aws-cdk/issues/12096)) ([c01272c](https://github.com/aws/aws-cdk/commit/c01272c14be9b7ff635281952f3cfeed971a352e)), closes [#12094](https://github.com/aws/aws-cdk/issues/12094)

## [2.0.0-alpha.1](https://github.com/aws/aws-cdk/compare/v2.0.0-alpha.0...v2.0.0-alpha.1) (2021-01-21)


### ⚠ BREAKING CHANGES TO EXPERIMENTAL FEATURES

* **apigatewayv2:** `subnets` prop in `VpcLink` resource now takes `SubnetSelection` instead of `ISubnet[]`
* **eks:** Existing self managed nodes may loose the ability to host additional services of type `LoadBalancer` . See https://github.com/aws/aws-cdk/pull/12269#issuecomment-752161190 for possible mitigations.
* **eks:** the `@aws-cdk/eks.KubectlLayer` layer class has been moved to `@aws-cdk/lambda-layer-kubectl.KubectlLayer`.
* **eks:** `LegacyCluster` was removed since it existed only for a transition period to allow gradual migration to the current cluster class.

- eks: `kubectlEnabled` property was removed, all clusters now support `kubectl`.
* **core:** Creation stack traces for `Lazy` values are no longer
captured by default in order to speed up tests. Run with
`CDK_DEBUG=true` (or `cdk --debug`) to capture stack traces.
* **apigatewayv2:** `HttpApi.fromApiId()` has been replaced with
`HttpApi.fromHttpApiAttributes()`.
* **elasticsearch:** ES Domain LogGroup LogicalId will change, which will trigger new log group resources to be created
* **cloudfront-origins:** Default minimum origin SSL protocol for `HttpOrigin` and `LoadBalancerOrigin` changed from SSLv3 to TLSv1.2.

### Features

* **apigatewayv2:** http api - disable execute api endpoint ([#12426](https://github.com/aws/aws-cdk/issues/12426)) ([1724da7](https://github.com/aws/aws-cdk/commit/1724da758666ec92f7b923c899d2f2f439083ba2)), closes [#12241](https://github.com/aws/aws-cdk/issues/12241)
* **appmesh:** add listener TLS certificates for VirtualNodes and VirtualGateways ([#11863](https://github.com/aws/aws-cdk/issues/11863)) ([175a257](https://github.com/aws/aws-cdk/commit/175a2570465d484aa0a73a7bded34e686da493ed)), closes [#10051](https://github.com/aws/aws-cdk/issues/10051)
* **appmesh:** add timeout support to Routes ([#11973](https://github.com/aws/aws-cdk/issues/11973)) ([78c185d](https://github.com/aws/aws-cdk/commit/78c185d15e64e81ee86ee71cd6430cd80fdbb8fe))
* **aws-cloudfront:** support minimum security protocol  ([#12231](https://github.com/aws/aws-cdk/issues/12231)) ([40976d9](https://github.com/aws/aws-cdk/commit/40976d9d71bb5c77d6dd9962f67129c4a7e91d0b)), closes [#12199](https://github.com/aws/aws-cdk/issues/12199)
* **aws-kms:** support waiting period ([#12224](https://github.com/aws/aws-cdk/issues/12224)) ([9f451bd](https://github.com/aws/aws-cdk/commit/9f451bda33ae83e41e395799d9bb3f07ce4e100d)), closes [#12218](https://github.com/aws/aws-cdk/issues/12218)
* **aws-lambda-nodejs:** add esbuild `define` bundling option ([#12424](https://github.com/aws/aws-cdk/issues/12424)) ([581f6af](https://github.com/aws/aws-cdk/commit/581f6af3d1f71737ca93b6ecb9b004bdade149a8)), closes [#12423](https://github.com/aws/aws-cdk/issues/12423)
* **cdk-assets:** add external asset support ([#12259](https://github.com/aws/aws-cdk/issues/12259)) ([05a9980](https://github.com/aws/aws-cdk/commit/05a998065b3333854715c456b20b7cc5d5daac67))
* **cfnspec:** CloudFormation resource specification update to v23.0.0 ([#12490](https://github.com/aws/aws-cdk/issues/12490)) ([a7a2236](https://github.com/aws/aws-cdk/commit/a7a2236367f8f01b00b6d90f1d3fe7bf674b1aee))
* **cfnspec:** cloudformation spec v22.0.0 ([#12204](https://github.com/aws/aws-cdk/issues/12204)) ([a5be2e9](https://github.com/aws/aws-cdk/commit/a5be2e9d57862a5cc9a108d9fdedd1398e492645)), closes [#12170](https://github.com/aws/aws-cdk/issues/12170) [#11974](https://github.com/aws/aws-cdk/issues/11974) [#12114](https://github.com/aws/aws-cdk/issues/12114) [#12028](https://github.com/aws/aws-cdk/issues/12028)
* **cli:** `--quiet` does not print template in `cdk synth` ([#12178](https://github.com/aws/aws-cdk/issues/12178)) ([74458a0](https://github.com/aws/aws-cdk/commit/74458a0e9eebce4ee254673aad8933d39588d843)), closes [#11970](https://github.com/aws/aws-cdk/issues/11970)
* **cloudfront:** allow to specify stack ID for Lambda@Edge ([#12163](https://github.com/aws/aws-cdk/issues/12163)) ([049e70c](https://github.com/aws/aws-cdk/commit/049e70c3fc32c2287623a5f7bd3ae2c38ce29409)), closes [#12136](https://github.com/aws/aws-cdk/issues/12136)
* **cloudfront-origins:** ability to specify minimum origin SSL protocol ([#11997](https://github.com/aws/aws-cdk/issues/11997)) ([a0aa61d](https://github.com/aws/aws-cdk/commit/a0aa61d5bc1134accef7bab2707edb497fce2c57)), closes [#11994](https://github.com/aws/aws-cdk/issues/11994)
* **cloudfront-origins:** CloudFront Origins is now Generally Available ([#12011](https://github.com/aws/aws-cdk/issues/12011)) ([daace16](https://github.com/aws/aws-cdk/commit/daace1684638b8fb8b89b60bf39b24c65a769d64)), closes [#11919](https://github.com/aws/aws-cdk/issues/11919)
* **cloudwatch:** full precision for SingleValueWidgets ([#12274](https://github.com/aws/aws-cdk/issues/12274)) ([45d78f0](https://github.com/aws/aws-cdk/commit/45d78f0b132380e95a585ea7bec96f08f2069edc)), closes [#8940](https://github.com/aws/aws-cdk/issues/8940) [#12066](https://github.com/aws/aws-cdk/issues/12066)
* **codebuild:** add `startBatchBuild` option ([#11743](https://github.com/aws/aws-cdk/issues/11743)) ([d9353b7](https://github.com/aws/aws-cdk/commit/d9353b7625420595401620709828de2f44c66597)), closes [/github.com/aws-cloudformation/aws-cloudformation-coverage-roadmap/issues/621#issuecomment-732336650](https://github.com/aws//github.com/aws-cloudformation/aws-cloudformation-coverage-roadmap/issues/621/issues/issuecomment-732336650) [#11663](https://github.com/aws/aws-cdk/issues/11663)
* **codebuild:** prevent using Secrets in plain-text environment variables ([#12150](https://github.com/aws/aws-cdk/issues/12150)) ([998af8f](https://github.com/aws/aws-cdk/commit/998af8f0e574b7b07083f0f347dc4934a6da1966))
* **codebuild:** support Standard 5.0 ([#12434](https://github.com/aws/aws-cdk/issues/12434)) ([422dc8e](https://github.com/aws/aws-cdk/commit/422dc8e9d50105af4e710d409a4f301079d43f3f)), closes [#12433](https://github.com/aws/aws-cdk/issues/12433)
* **codecommit:** HTTPS GRC clone URL ([#12312](https://github.com/aws/aws-cdk/issues/12312)) ([36b081e](https://github.com/aws/aws-cdk/commit/36b081e470674005b54c190b50da9b2ed3d9ad9c))
* **core:** expose custom resource provider's role ([#11923](https://github.com/aws/aws-cdk/issues/11923)) ([06f26d3](https://github.com/aws/aws-cdk/commit/06f26d390707b0e2a4e05e36405a4751c907a234)), closes [/github.com/aws/aws-cdk/pull/9751#issuecomment-723554595](https://github.com/aws//github.com/aws/aws-cdk/pull/9751/issues/issuecomment-723554595)
* **core:** validate maximum amount of resources in a stack ([#12193](https://github.com/aws/aws-cdk/issues/12193)) ([26121c8](https://github.com/aws/aws-cdk/commit/26121c81abf0fb92de97567c758a1ecf60f85f63)), closes [#276](https://github.com/aws/aws-cdk/issues/276)
* **ec2:** add m6gd and r6gd metadata ([#12302](https://github.com/aws/aws-cdk/issues/12302)) ([ce4eb20](https://github.com/aws/aws-cdk/commit/ce4eb2037f40148062784addb82ee8cf9881d129)), closes [#12301](https://github.com/aws/aws-cdk/issues/12301)
* **ec2:** add r5b instance type to instance class ([#12027](https://github.com/aws/aws-cdk/issues/12027)) ([d276b02](https://github.com/aws/aws-cdk/commit/d276b020e61ee4455c7ed9f093436d1aab319e76)), closes [#12025](https://github.com/aws/aws-cdk/issues/12025)
* **ec2:** Add VPC endpoints for Athena and Glue ([#12073](https://github.com/aws/aws-cdk/issues/12073)) ([73ef6b1](https://github.com/aws/aws-cdk/commit/73ef6b180c8a7c3d8e984b308149eeb9eb78b40b)), closes [#12072](https://github.com/aws/aws-cdk/issues/12072)
* **ecs:** deployment circuit breaker support ([#12168](https://github.com/aws/aws-cdk/issues/12168)) ([e8801a0](https://github.com/aws/aws-cdk/commit/e8801a0ddb04e75de87ba34f3a58b1adebae5301))
* **ecs-patterns:** Add DeploymentController option to Fargate services ([#10452](https://github.com/aws/aws-cdk/issues/10452)) ([2cd233a](https://github.com/aws/aws-cdk/commit/2cd233a94fc2f3cb06211157738e59e8c7ee85e5)), closes [aws/containers-roadmap#130](https://github.com/aws/containers-roadmap/issues/130) [#10971](https://github.com/aws/aws-cdk/issues/10971)
* **ecs-patterns:** add ruleName optional parameter for ScheduledTask constructs ([#12190](https://github.com/aws/aws-cdk/issues/12190)) ([b1318bd](https://github.com/aws/aws-cdk/commit/b1318bda54d1c0955a371eccce76b748d312b570))
* **ecs-patterns:** containerName for QueueProcessingEc2Service ([88d4149](https://github.com/aws/aws-cdk/commit/88d4149432d55e65b23448fd58d8ec3e96f3e72c)), closes [#10517](https://github.com/aws/aws-cdk/issues/10517)
* **eks:** attach cluster security group to self-managed nodes ([#12042](https://github.com/aws/aws-cdk/issues/12042)) ([1078bea](https://github.com/aws/aws-cdk/commit/1078bea4c90afaac76a5e81328a9d6ec44a79e9a))
* **eks:** aws-node-termination-handler for spot instances now pulls the image from public ECR ([#12141](https://github.com/aws/aws-cdk/issues/12141)) ([c752fab](https://github.com/aws/aws-cdk/commit/c752fabf2022b5e697b6bf900e7878076f28b31a)), closes [#12134](https://github.com/aws/aws-cdk/issues/12134)
* **eks:** bundle kubectl, helm and awscli instead of SAR app ([#12129](https://github.com/aws/aws-cdk/issues/12129)) ([63bc98f](https://github.com/aws/aws-cdk/commit/63bc98f0d4a85b1c544d78420fd44579ce46a806)), closes [#11874](https://github.com/aws/aws-cdk/issues/11874)
* **eks:** connect all custom resources to the cluster VPC ([#10200](https://github.com/aws/aws-cdk/issues/10200)) ([eaa8222](https://github.com/aws/aws-cdk/commit/eaa82222349fcce1ef4b80e873a35002d6f036e5))
* **eks:** option to disable manifest validation ([#12012](https://github.com/aws/aws-cdk/issues/12012)) ([579b923](https://github.com/aws/aws-cdk/commit/579b9235706d6848847a258bbb607a9bff6a9e11)), closes [#11763](https://github.com/aws/aws-cdk/issues/11763)
* **eks:** spot interruption handler can be disabled for self managed nodes ([#12453](https://github.com/aws/aws-cdk/issues/12453)) ([6ac1f4f](https://github.com/aws/aws-cdk/commit/6ac1f4fdef5853785d8e57652ec4c4e1d770844d)), closes [#12451](https://github.com/aws/aws-cdk/issues/12451)
* **eks:** spot support for managed nodegroups ([#11962](https://github.com/aws/aws-cdk/issues/11962)) ([6ccd00f](https://github.com/aws/aws-cdk/commit/6ccd00fc7641f3696559367d65733b66df707fa7)), closes [#11827](https://github.com/aws/aws-cdk/issues/11827)
* **elasticsearch:** add support for version 7_8 and 7_9 ([#12222](https://github.com/aws/aws-cdk/issues/12222)) ([09d1f6c](https://github.com/aws/aws-cdk/commit/09d1f6cae610477c17234eab4a02fc731e34e2cf)), closes [#12202](https://github.com/aws/aws-cdk/issues/12202)
* **elasticsearch:** Support `EnableVersionUpgrade` update policy ([#12239](https://github.com/aws/aws-cdk/issues/12239)) ([14f8b06](https://github.com/aws/aws-cdk/commit/14f8b06686368da15211dbd528928ad4000d9eb8)), closes [#12210](https://github.com/aws/aws-cdk/issues/12210)
* **elasticsearch:** support audit logs ([#12106](https://github.com/aws/aws-cdk/issues/12106)) ([d10ea63](https://github.com/aws/aws-cdk/commit/d10ea631f8699385cadf61d6e0a067b68da37df6)), closes [#12105](https://github.com/aws/aws-cdk/issues/12105)
* **elasticsearch:** UltraWarm nodes ([#12265](https://github.com/aws/aws-cdk/issues/12265)) ([3a9056d](https://github.com/aws/aws-cdk/commit/3a9056d87b0c739247013fc74678ab54fd3eb382)), closes [#6462](https://github.com/aws/aws-cdk/issues/6462)
* **ivs:** add IVS L2 Constructs ([#11454](https://github.com/aws/aws-cdk/issues/11454)) ([f813bff](https://github.com/aws/aws-cdk/commit/f813bff2da4792cfa7bfce6f572a7d2bb5c4759d))
* **lambda:** encryption key for environment variables ([#11893](https://github.com/aws/aws-cdk/issues/11893)) ([ccbaf83](https://github.com/aws/aws-cdk/commit/ccbaf8399c3a9f3ff6e60758e0b713d82f37420b)), closes [#10837](https://github.com/aws/aws-cdk/issues/10837)
* **lambda-nodejs:** expose more esbuild options ([#12063](https://github.com/aws/aws-cdk/issues/12063)) ([bab21b3](https://github.com/aws/aws-cdk/commit/bab21b377593b7475b047d05a54914344352c054)), closes [#12046](https://github.com/aws/aws-cdk/issues/12046)
* **lambda-nodejs:** Expose optional props for advanced usage of esbuild ([#12123](https://github.com/aws/aws-cdk/issues/12123)) ([ecc98ac](https://github.com/aws/aws-cdk/commit/ecc98ac75acb1adbb4f5e66f853dc3226e490c98))
* **rds:** add grantConnect for RDS Proxy ([#12243](https://github.com/aws/aws-cdk/issues/12243)) ([eb45ca8](https://github.com/aws/aws-cdk/commit/eb45ca816626b243daacbd3a8916ac1e5db202ea)), closes [#10133](https://github.com/aws/aws-cdk/issues/10133)
* **rds:** add support for setting public accessibility ([#12164](https://github.com/aws/aws-cdk/issues/12164)) ([b8f48e5](https://github.com/aws/aws-cdk/commit/b8f48e514c09d2f46d8bbae27171877df61e7f2a)), closes [#12093](https://github.com/aws/aws-cdk/issues/12093)
* **route53:** Vpc endpoint service private dns ([#10780](https://github.com/aws/aws-cdk/issues/10780)) ([8f6f9a8](https://github.com/aws/aws-cdk/commit/8f6f9a8678496e131a43ca4c76e561d50a0a0de8))
* **s3:** option to auto delete objects upon bucket removal ([#12090](https://github.com/aws/aws-cdk/issues/12090)) ([32e9c23](https://github.com/aws/aws-cdk/commit/32e9c23be2852cfca79a57c90e52b9301b1c7081)), closes [#3297](https://github.com/aws/aws-cdk/issues/3297) [#9751](https://github.com/aws/aws-cdk/issues/9751)
* **s3-deployment:** support vpc in BucketDeploymentProps ([#12035](https://github.com/aws/aws-cdk/issues/12035)) ([6caf72f](https://github.com/aws/aws-cdk/commit/6caf72f67d6d3373186e57f32671369c2cc8b56e)), closes [#11734](https://github.com/aws/aws-cdk/issues/11734)
* **sns:** fifo topic with content-based deduplication support [#11127](https://github.com/aws/aws-cdk/issues/11127) ([#11588](https://github.com/aws/aws-cdk/issues/11588)) ([7e60d8e](https://github.com/aws/aws-cdk/commit/7e60d8e7aa7a6507675a24991d9c9832017ddfed))
* **stepfunctions-tasks:** add support for ModelClientConfig to SageMakerCreateTransformJob ([#11892](https://github.com/aws/aws-cdk/issues/11892)) ([bf05092](https://github.com/aws/aws-cdk/commit/bf050928c033328b259746c0a7f33038aadc4c17))
* **synthetics:** Update Cloudwatch Synthetics canaries NodeJS runtimes ([#11866](https://github.com/aws/aws-cdk/issues/11866)) ([4f6e377](https://github.com/aws/aws-cdk/commit/4f6e377ae3f35c3fa010e1597c3d71ef6e6e9a04)), closes [#11870](https://github.com/aws/aws-cdk/issues/11870)
* Configre containerName for QueueProcessingFargateService ([fad27f6](https://github.com/aws/aws-cdk/commit/fad27f65a73dc3b9c208439c5e474295491381da))
* remove the construct compatibility layer ([#12054](https://github.com/aws/aws-cdk/issues/12054)) ([8d3c02c](https://github.com/aws/aws-cdk/commit/8d3c02c117072433bf649003af0c4fee4a1f8c4b))


### Bug Fixes

* **apigatewayv2:** vpclink - explicit subnet specification still causes private subnets to be included ([#12401](https://github.com/aws/aws-cdk/issues/12401)) ([336a58f](https://github.com/aws/aws-cdk/commit/336a58f06a3b3a9f5db2a79350f8721244767e3b)), closes [#12083](https://github.com/aws/aws-cdk/issues/12083)
* **appsync:** rds data source configured with cluster arn ([#12255](https://github.com/aws/aws-cdk/issues/12255)) ([d0305f3](https://github.com/aws/aws-cdk/commit/d0305f33da41ce1f07a5d571eb21c0ee9ea852d0)), closes [#11536](https://github.com/aws/aws-cdk/issues/11536)
* **aws-ecs:** Support configuring Windows capacity for cluster ASGs ([#12365](https://github.com/aws/aws-cdk/issues/12365)) ([6d9a0f1](https://github.com/aws/aws-cdk/commit/6d9a0f1ea0c05e7902ccca4d0fc4040e688846e5))
* **aws-ecs:** update desired count to be optional ([#12223](https://github.com/aws/aws-cdk/issues/12223)) ([455540b](https://github.com/aws/aws-cdk/commit/455540b0915742c1612e924fc2d7c0987b1bc592))
* **cfn-include:** cfn-include fails in monocdk ([#11595](https://github.com/aws/aws-cdk/issues/11595)) ([45e43f2](https://github.com/aws/aws-cdk/commit/45e43f28f5d175bba654ee44d683aa3fc1854f9a)), closes [#11342](https://github.com/aws/aws-cdk/issues/11342)
* **cli:** CLI doesn't read context from ~/.cdk.json ([#12394](https://github.com/aws/aws-cdk/issues/12394)) ([2389a9b](https://github.com/aws/aws-cdk/commit/2389a9b5742583f1d58c66a4f513ee4d833baab5)), closes [#10823](https://github.com/aws/aws-cdk/issues/10823) [#4802](https://github.com/aws/aws-cdk/issues/4802)
* **cli:** cross account asset upload no longer works ([#12155](https://github.com/aws/aws-cdk/issues/12155)) ([1c8cb11](https://github.com/aws/aws-cdk/commit/1c8cb11961c53fad499668aa39600f2038dce9d7))
* **cli:** cross-account deployment no longer works ([#11966](https://github.com/aws/aws-cdk/issues/11966)) ([6fb3448](https://github.com/aws/aws-cdk/commit/6fb34483432b5cdcc485bbf6bfdb7bbb74f4b895)), closes [#11350](https://github.com/aws/aws-cdk/issues/11350) [#11792](https://github.com/aws/aws-cdk/issues/11792) [#11792](https://github.com/aws/aws-cdk/issues/11792)
* **cloudfront:** cross-region EdgeFunction does not work within a Stage ([#12103](https://github.com/aws/aws-cdk/issues/12103)) ([98d781c](https://github.com/aws/aws-cdk/commit/98d781cf9bc39d4c57454c4c60390c699326e84d)), closes [#12092](https://github.com/aws/aws-cdk/issues/12092)
* **cloudfront:** EdgeFunction fails with newStyleStackSynthesis ([#12356](https://github.com/aws/aws-cdk/issues/12356)) ([fb02736](https://github.com/aws/aws-cdk/commit/fb02736e7fb471b8ebd0d80e352f68f3cbf5270e)), closes [#12172](https://github.com/aws/aws-cdk/issues/12172)
* **codebuild:** missing permissions for SecretsManager environment variables ([#12121](https://github.com/aws/aws-cdk/issues/12121)) ([1a13d8f](https://github.com/aws/aws-cdk/commit/1a13d8fbb3ea4edd4ff8fb0a2608547f63b902f9))
* **codebuild:** Project lacks permissions to its log destinations ([#12213](https://github.com/aws/aws-cdk/issues/12213)) ([b92ed51](https://github.com/aws/aws-cdk/commit/b92ed51c6ff11f8453755b6381a3cf1f12b0fcc1)), closes [#11444](https://github.com/aws/aws-cdk/issues/11444) [#12179](https://github.com/aws/aws-cdk/issues/12179)
* **codepipeline-actions:** use codebuild batch iam permissions when `executeBatchBuild: true` ([#12181](https://github.com/aws/aws-cdk/issues/12181)) ([5279f37](https://github.com/aws/aws-cdk/commit/5279f37288283a37c952440a7f2082517c56af3a))
* **core:** capturing stack traces still takes a long time ([#12180](https://github.com/aws/aws-cdk/issues/12180)) ([71cd38c](https://github.com/aws/aws-cdk/commit/71cd38c8fac276e34b79ad416305b214a57af25a)), closes [#11170](https://github.com/aws/aws-cdk/issues/11170)
* **core:** DefaultStackSynthesizer bucket prefix missing for template assets ([#11855](https://github.com/aws/aws-cdk/issues/11855)) ([50a3d3a](https://github.com/aws/aws-cdk/commit/50a3d3acf3e413d9b4e51197d2be4ea1349c0955)), closes [#10710](https://github.com/aws/aws-cdk/issues/10710) [#11327](https://github.com/aws/aws-cdk/issues/11327)
* **dynamodb:** allow global replicas with Provisioned billing mode ([#12159](https://github.com/aws/aws-cdk/issues/12159)) ([ab5a383](https://github.com/aws/aws-cdk/commit/ab5a38379999bb57f28bbf22ec09d315df6b358a)), closes [#11346](https://github.com/aws/aws-cdk/issues/11346)
* **dynamodb:** missing grantRead for ConditionCheckItem ([#12313](https://github.com/aws/aws-cdk/issues/12313)) ([e157007](https://github.com/aws/aws-cdk/commit/e1570072440b07b6b82219c1a4371386c541fb1c))
* **ec2:** 'encoded list token' error using Vpc imported from deploy-time lists ([#12040](https://github.com/aws/aws-cdk/issues/12040)) ([0690da9](https://github.com/aws/aws-cdk/commit/0690da925144c821a73bfab4ae8d678a8c074357))
* **ec2:** fromInterfaceVpcEndpointAttributes: Security Groups should not be required ([#11857](https://github.com/aws/aws-cdk/issues/11857)) ([86ae5d6](https://github.com/aws/aws-cdk/commit/86ae5d6ec5291f7a8da37bbf021c31f88e66d283)), closes [#11050](https://github.com/aws/aws-cdk/issues/11050)
* **ec2:** interface endpoint AZ lookup does not guard against broken situations ([#12033](https://github.com/aws/aws-cdk/issues/12033)) ([80f0bfd](https://github.com/aws/aws-cdk/commit/80f0bfd167430a015e71b00506e0ecc280068e86))
* **ec2:** Vpc.fromVpcAttributes cannot be used with EKS ([#12569](https://github.com/aws/aws-cdk/issues/12569)) ([1cdc244](https://github.com/aws/aws-cdk/commit/1cdc244e940396c962147d4e3ada4a0722923321)), closes [#12040](https://github.com/aws/aws-cdk/issues/12040) [#12160](https://github.com/aws/aws-cdk/issues/12160)
* **eks:** aws-node-termination-handler incorrectly deployed to on-demand instances as well ([#12369](https://github.com/aws/aws-cdk/issues/12369)) ([05c0b5f](https://github.com/aws/aws-cdk/commit/05c0b5f5a31c3fe89c47c6db8d9051f7165641a9)), closes [#12368](https://github.com/aws/aws-cdk/issues/12368)
* **eks:** failure to deploy cluster since aws-auth configmap exists ([#12068](https://github.com/aws/aws-cdk/issues/12068)) ([dc8a98a](https://github.com/aws/aws-cdk/commit/dc8a98a5436a7a2347fa9676d84f73a8cf00cd49)), closes [#12053](https://github.com/aws/aws-cdk/issues/12053)
* **eks:** k8s resources accidentally deleted due to logical ID change ([#12053](https://github.com/aws/aws-cdk/issues/12053)) ([019852e](https://github.com/aws/aws-cdk/commit/019852e4834327d848c9fe8dc271f1d4d5117fb8)), closes [#10397](https://github.com/aws/aws-cdk/issues/10397) [#10397](https://github.com/aws/aws-cdk/issues/10397)
* **eks:** nodegroup synthesis fails when configured with an AMI type that is not compatible to the default instance type ([#12441](https://github.com/aws/aws-cdk/issues/12441)) ([5f6f0f9](https://github.com/aws/aws-cdk/commit/5f6f0f9d46dbd460ac03dd5f9f4874eaa41611d8)), closes [40aws-cdk/aws-eks/lib/managed-nodegroup.ts#L294](https://github.com/40aws-cdk/aws-eks/lib/managed-nodegroup.ts/issues/L294) [40aws-cdk/aws-eks/lib/managed-nodegroup.ts#L302-L304](https://github.com/40aws-cdk/aws-eks/lib/managed-nodegroup.ts/issues/L302-L304) [40aws-cdk/aws-eks/lib/managed-nodegroup.ts#L329-L330](https://github.com/40aws-cdk/aws-eks/lib/managed-nodegroup.ts/issues/L329-L330) [40aws-cdk/aws-eks/lib/managed-nodegroup.ts#L324-L325](https://github.com/40aws-cdk/aws-eks/lib/managed-nodegroup.ts/issues/L324-L325)
* **eks:** Self managed nodes cannot be added to LoadBalancers created via the `LoadBalancer` service type ([#12269](https://github.com/aws/aws-cdk/issues/12269)) ([470a881](https://github.com/aws/aws-cdk/commit/470a8811ec18c7f0764018398ec7c3da05b7baac))
* **elasticsearch:** Defining 2 domains with logging enabled in the same stack fails on construct id conflict ([#12055](https://github.com/aws/aws-cdk/issues/12055)) ([ec3ce19](https://github.com/aws/aws-cdk/commit/ec3ce19bc8203703cb1abcecdb2afc674c2013f6)), closes [#12017](https://github.com/aws/aws-cdk/issues/12017)
* **elasticsearch:** domain configured with access policies and a custom kms key fails to deploy ([#11699](https://github.com/aws/aws-cdk/issues/11699)) ([245ee6a](https://github.com/aws/aws-cdk/commit/245ee6a1253eeaa79177e960c164bf3a409d2e57))
* **elasticsearch:** domain fails due to log publishing keys on unsupported cluster versions ([#11622](https://github.com/aws/aws-cdk/issues/11622)) ([e6bb96f](https://github.com/aws/aws-cdk/commit/e6bb96ff6bae96e3167c82f6de97807217ddb3be))
* **elasticsearch:** log policies are overwritten when creating 2 domains which also results in a failure while destroying the stack   ([#12056](https://github.com/aws/aws-cdk/issues/12056)) ([889d089](https://github.com/aws/aws-cdk/commit/889d0892bae10243e03900f0ae6db078fc7eb320)), closes [#12016](https://github.com/aws/aws-cdk/issues/12016)
* **elbv2:** can't import two application listeners into the same scope ([#12373](https://github.com/aws/aws-cdk/issues/12373)) ([6534dcf](https://github.com/aws/aws-cdk/commit/6534dcf3e04a55f5c6d28203192cbbddb5d119e6)), closes [#12132](https://github.com/aws/aws-cdk/issues/12132)
* **iam:** Groups are erroneously accepted as the Principal of a policy ([#11479](https://github.com/aws/aws-cdk/issues/11479)) ([#12549](https://github.com/aws/aws-cdk/issues/12549)) ([c9b0859](https://github.com/aws/aws-cdk/commit/c9b085996319e8d4d7d2db19184fb2f2148889a3))
* **lambda:** make the Version hash calculation stable ([#12364](https://github.com/aws/aws-cdk/issues/12364)) ([4da50e5](https://github.com/aws/aws-cdk/commit/4da50e5bd9845d6e32687b147b6212decb422301))
* **lambda-layer-*:** unable to calculate layer asset hash due to missing file ([#12293](https://github.com/aws/aws-cdk/issues/12293)) ([646f098](https://github.com/aws/aws-cdk/commit/646f0983143c77c2b6c68598a0bc8b290b5f6184)), closes [#12291](https://github.com/aws/aws-cdk/issues/12291)
* **lambda-nodejs:** local bundling fails with relative depsLockFilePath ([#12125](https://github.com/aws/aws-cdk/issues/12125)) ([d5afb55](https://github.com/aws/aws-cdk/commit/d5afb555b983c8c034f63dd58d1fa24b82b6e9fe)), closes [#12115](https://github.com/aws/aws-cdk/issues/12115)
* **logs:** custom resource Lambda uses old NodeJS version ([#12228](https://github.com/aws/aws-cdk/issues/12228)) ([29c4943](https://github.com/aws/aws-cdk/commit/29c4943466f4a911f65a2a13cf9e776ade9b8dfe))
* **rds:** add the dependency on proxy targets to ensure dbInstance ([#12237](https://github.com/aws/aws-cdk/issues/12237)) ([8f74169](https://github.com/aws/aws-cdk/commit/8f74169f57f3be745cf6395149e2697d6dc497ee)), closes [#11311](https://github.com/aws/aws-cdk/issues/11311)
* **s3:** Bucket.grantWrite() no longer adds s3:PutObject* permission ([#12391](https://github.com/aws/aws-cdk/issues/12391)) ([cd437cf](https://github.com/aws/aws-cdk/commit/cd437cf630266086a3ddf9e326f215b5d1acdfd7))
* **s3-deployment:** stop using deprecated API's that will cause breakage post 01/31/21 ([#12491](https://github.com/aws/aws-cdk/issues/12491)) ([f50f928](https://github.com/aws/aws-cdk/commit/f50f92880bbc219c331c858eaace712e0757507d))
* **sns:** require topic name for fifo topic [#12386](https://github.com/aws/aws-cdk/issues/12386) ([#12437](https://github.com/aws/aws-cdk/issues/12437)) ([37d8ccc](https://github.com/aws/aws-cdk/commit/37d8ccc763f532999bc9f114264f3d29725b0f28))
* **stepfunctions-tasks:** EvaluateExpression does not support JSON paths with dash ([#12248](https://github.com/aws/aws-cdk/issues/12248)) ([da1ed08](https://github.com/aws/aws-cdk/commit/da1ed08a6a2de584f5ddf43dab4efbb530541419)), closes [#12221](https://github.com/aws/aws-cdk/issues/12221)
* **stepfunctions-tasks:** policies created for EMR tasks have ARNs that are not partition-aware ([#11553](https://github.com/aws/aws-cdk/issues/11553)) ([1cf6713](https://github.com/aws/aws-cdk/commit/1cf6713b778c789af7a420ad890910a9516473f0)), closes [#11503](https://github.com/aws/aws-cdk/issues/11503)


* **apigatewayv2:** apiEndpoint is elevated to the IHttpApi interface ([#11988](https://github.com/aws/aws-cdk/issues/11988)) ([bc5b9b6](https://github.com/aws/aws-cdk/commit/bc5b9b659444bfbef9cfc3c8666fce7e6f45465a))
* **eks:** Remove legacy and deprecated code ([#12189](https://github.com/aws/aws-cdk/issues/12189)) ([6a20e61](https://github.com/aws/aws-cdk/commit/6a20e61dd2ed8366cbff1451c943a02b79380de2))

## 2.0.0-alpha.0 (2020-12-11)

This is the first alpha release of CDK 2.0. 🎉
