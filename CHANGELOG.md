# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [1.52.0](https://github.com/aws/aws-cdk/compare/v1.51.0...v1.52.0) (2020-07-18)


### ⚠ BREAKING CHANGES

* **rds:** the property 'version' has been changed from string to an engine-specific
  version class; use VersionClass.of() if you need to create a specific version of an engine from a string
* **rds**: the property ParameterGroupProps.family has been renamed to engine, and its type changed from string to IEngine
* **rds**: the property engineVersion in IClusterEngine changed from a string to EngineVersion
* **rds**: the property engineVersion in IInstanceEngine changed from a string to EngineVersion
* **rds**: the property parameterGroupFamily in IClusterEngine changed from required to optional
* **rds**: the property parameterGroupFamily in IInstanceEngine changed from required to optional
* **rds:** the class ClusterParameterGroup has been removed -
  use ParameterGroup instead
* **rds:** `DatabaseProxyProps.secret` => `DatabaseProxyProps.secrets[]`
* **apigateway:** `defaultMethodOptions`, `defaultCorsPreflightOptions`
and `defaultIntegration` have been removed from `SpecRestApiProps`.
These can be specifed directly in the OpenAPI spec or via `addMethod()`
 and `addResource()` APIs.
* **glue:** The default location of glue data will be the root of an s3 bucket, instead of `/data`
* **rds:** the class `DatabaseClusterEngine` has been replaced with the interface `IClusterEngine` in the type of `DatabaseClusterProps.engine`
* **rds**: the class `DatabaseInstanceEngine` has been replaced with the interface `IInstanceEngine` in the type of `DatabaseInstanceSourceProps.engine`
* **rds**: `DatabaseClusterProps.engineVersion` has been removed; instead, create an `IClusterEngine` with a specific version using the static factory methods in `DatabaseClusterEngine`
* **rds**: `DatabaseInstanceSourceProps.engineVersion` has been removed; instead, create an `IInstanceEngine` with a specific version using the static factory methods in `DatabaseInstanceEngine`
* **rds**: the property `majorEngineVersion` can no longer be passed when creating an `OptionGroup`; instead, create an `IInstanceEngine` with a specific version using the static factory methods in `DatabaseInstanceEngine`

### Features

* **aws-stepfunctions-tasks:** allow lambda invocations to combine input and function results ([#9022](https://github.com/aws/aws-cdk/issues/9022)) ([846a222](https://github.com/aws/aws-cdk/commit/846a222140984d0aaed948d5bb1f3127a2cc6eb1)), closes [#8943](https://github.com/aws/aws-cdk/issues/8943)
* **certificatemanager:** native CloudFormation DNS validated certificate ([#8552](https://github.com/aws/aws-cdk/issues/8552)) ([337279f](https://github.com/aws/aws-cdk/commit/337279fcce009badc1bb878bdfbcf51ecbef0a38)), closes [#5831](https://github.com/aws/aws-cdk/issues/5831) [#5835](https://github.com/aws/aws-cdk/issues/5835) [#6081](https://github.com/aws/aws-cdk/issues/6081) [#6516](https://github.com/aws/aws-cdk/issues/6516) [#7150](https://github.com/aws/aws-cdk/issues/7150) [#7941](https://github.com/aws/aws-cdk/issues/7941) [#7995](https://github.com/aws/aws-cdk/issues/7995) [#7996](https://github.com/aws/aws-cdk/issues/7996) [#8282](https://github.com/aws/aws-cdk/issues/8282) [#8659](https://github.com/aws/aws-cdk/issues/8659) [#8783](https://github.com/aws/aws-cdk/issues/8783)
* **cfn-include:** add support for nested stacks ([#8980](https://github.com/aws/aws-cdk/issues/8980)) ([bf12456](https://github.com/aws/aws-cdk/commit/bf12456671e171eab16690fc8b54fae6841cf711)), closes [#8978](https://github.com/aws/aws-cdk/issues/8978)
* **cloudfront:** Initial CloudFront redesign ([#8982](https://github.com/aws/aws-cdk/issues/8982)) ([d30fa9d](https://github.com/aws/aws-cdk/commit/d30fa9dda0726230f077c181833fddd40450d6ae))
* **codepipeline:** add support for a StepFunctions invoke action ([#8931](https://github.com/aws/aws-cdk/issues/8931)) ([499776d](https://github.com/aws/aws-cdk/commit/499776de6000b7a18b021b5e17d22078e55f66d9))
* **core:** cloudformation resource metadata ([#9063](https://github.com/aws/aws-cdk/issues/9063)) ([b0f8729](https://github.com/aws/aws-cdk/commit/b0f8729002b90c1c90ca46a4db9e297a69fef174)), closes [#8788](https://github.com/aws/aws-cdk/issues/8788)
* **core:** Duration.plus for adding durations ([a127048](https://github.com/aws/aws-cdk/commit/a127048bb3d18b3edb9094130022b8030b817fab))
* **custom-resources:** custom resource provider log retention ([#9024](https://github.com/aws/aws-cdk/issues/9024)) ([18c024c](https://github.com/aws/aws-cdk/commit/18c024c7b1f07bc0d8baff047d09605579f3c02f))
* **glue:** default data location for tables is the root of the bucket ([#8999](https://github.com/aws/aws-cdk/issues/8999)) ([28949bd](https://github.com/aws/aws-cdk/commit/28949bdada49231dbe844097e0076e34ef41f60b)), closes [#8472](https://github.com/aws/aws-cdk/issues/8472)
* **lambda:** codeguru profiling groups ([#8852](https://github.com/aws/aws-cdk/issues/8852)) ([8c01420](https://github.com/aws/aws-cdk/commit/8c0142030dce359591aa76fe314f19fce9eddbe6))
* **lambda-nodejs:** support build args ([#9035](https://github.com/aws/aws-cdk/issues/9035)) ([e27658e](https://github.com/aws/aws-cdk/commit/e27658e0f3a8d6e82d7d73dfcb49ce9491a3cf64)), closes [#8117](https://github.com/aws/aws-cdk/issues/8117)
* **rds:** Allow multiple secrets to be passed to an RDS Proxy ([#9103](https://github.com/aws/aws-cdk/issues/9103)) ([2ab329f](https://github.com/aws/aws-cdk/commit/2ab329f56d06c376f1fa7c23246ce74958a08bac)), closes [#9098](https://github.com/aws/aws-cdk/issues/9098)
* **rds:** introduce type-safe engine versions ([#9016](https://github.com/aws/aws-cdk/issues/9016)) ([fab7e28](https://github.com/aws/aws-cdk/commit/fab7e28f1cdae2eb65dddd32142fe64dc6955d63)), closes [#6532](https://github.com/aws/aws-cdk/issues/6532)
* **rds:** the RDS Construct Library is now in Developer Preview ([#9119](https://github.com/aws/aws-cdk/issues/9119)) ([92e620c](https://github.com/aws/aws-cdk/commit/92e620c5ee4262736d5fa576193793d7771ec47c))
* **rds:** unify ParameterGroup and ClusterParameterGroup ([#8959](https://github.com/aws/aws-cdk/issues/8959)) ([17b690b](https://github.com/aws/aws-cdk/commit/17b690bc4573a9b57de7a0aa6591c4e2f98a3f2e)), closes [#8932](https://github.com/aws/aws-cdk/issues/8932)
* **stepfunctions-tasks:** assign boolean value in DynamoDB from state input (Json path) ([#9088](https://github.com/aws/aws-cdk/issues/9088)) ([7b8ef5b](https://github.com/aws/aws-cdk/commit/7b8ef5b1d61912f33bde11aad626621ce6336d0e)), closes [#9007](https://github.com/aws/aws-cdk/issues/9007)


### Bug Fixes

* **appsync:** erroneous api key created when additional authorization is not configured ([#9057](https://github.com/aws/aws-cdk/issues/9057)) ([6f934e9](https://github.com/aws/aws-cdk/commit/6f934e979e9e4b5535738f84d867ef539c994363)), closes [#9054](https://github.com/aws/aws-cdk/issues/9054)
* **cfn-include:** fix issues in Conditions handling ([#9142](https://github.com/aws/aws-cdk/issues/9142)) ([e8d0776](https://github.com/aws/aws-cdk/commit/e8d077628e28ee055ac222d54c5cb4546ab82be3))
* **cli:** diff against multiple stacks do not always fail if any have a diff ([#7690](https://github.com/aws/aws-cdk/issues/7690)) ([85f4a83](https://github.com/aws/aws-cdk/commit/85f4a83c8fcf4033e29823c27b038d0aae5eda34)), closes [#7492](https://github.com/aws/aws-cdk/issues/7492)
* **cli:** unable to update stacks in UPDATE_ROLLBACK_COMPLETE ([#8948](https://github.com/aws/aws-cdk/issues/8948)) ([72ec59b](https://github.com/aws/aws-cdk/commit/72ec59b2108fabea4b52f32dbb0184b12d591aff)), closes [#8779](https://github.com/aws/aws-cdk/issues/8779) [/github.com/aws/aws-cdk/pull/8779#issuecomment-655258569](https://github.com/aws//github.com/aws/aws-cdk/pull/8779/issues/issuecomment-655258569) [#8126](https://github.com/aws/aws-cdk/issues/8126) [#5151](https://github.com/aws/aws-cdk/issues/5151)
* **core:** fix Duration.toIsoString() for millseconds ([#9042](https://github.com/aws/aws-cdk/issues/9042)) ([8559117](https://github.com/aws/aws-cdk/commit/8559117006f23155b90642a204792953b3d15a72))
* **core:** use any type for context ([#9014](https://github.com/aws/aws-cdk/issues/9014)) ([375335e](https://github.com/aws/aws-cdk/commit/375335eb4ce69c0306cd2cb2b26f466e17aa39bb)), closes [#8865](https://github.com/aws/aws-cdk/issues/8865)
* **custom-resources:** Fix typo in README ([#9126](https://github.com/aws/aws-cdk/issues/9126)) ([1e16a7f](https://github.com/aws/aws-cdk/commit/1e16a7f0d6922d1ebb50fde4afd0affd60790b24)), closes [#9024](https://github.com/aws/aws-cdk/issues/9024)
* **ec2:** Remove validation of availabilityZone from Volume ([#9082](https://github.com/aws/aws-cdk/issues/9082)) ([8d470b2](https://github.com/aws/aws-cdk/commit/8d470b2e7f9883ff0d16a76193d719de31241ea0))
* **eks:** cluster creation fails due to missing `ec2:DescribeVpcs` permission ([#9029](https://github.com/aws/aws-cdk/issues/9029)) ([4a714ee](https://github.com/aws/aws-cdk/commit/4a714eea4becfee45c71fb6c68144dc6d8275082))
* **lambda-event-sources:** use of CfnParameter for maxBatchSize, retryAttempts & parallelizationFactor fails ([#9064](https://github.com/aws/aws-cdk/issues/9064)) ([4470e89](https://github.com/aws/aws-cdk/commit/4470e899ae52a8a7076fec9c00dfbdaad6e0b263)), closes [#9044](https://github.com/aws/aws-cdk/issues/9044)
* **lambda-nodejs:** parcel tries to install @babel/core ([#9067](https://github.com/aws/aws-cdk/issues/9067)) ([8d4c635](https://github.com/aws/aws-cdk/commit/8d4c635b5707e0d7cb34a78aed873796a4df7656)), closes [#9032](https://github.com/aws/aws-cdk/issues/9032)
* **stepfunctions:** Choice state does not allow state input as a condition ([#8991](https://github.com/aws/aws-cdk/issues/8991)) ([db9d29b](https://github.com/aws/aws-cdk/commit/db9d29b5ab881cd359764e9900c9c12801bee21d)), closes [#8990](https://github.com/aws/aws-cdk/issues/8990)
* **stepfunctions:** Map state does not render JSON paths from state input ([#9008](https://github.com/aws/aws-cdk/issues/9008)) ([767da12](https://github.com/aws/aws-cdk/commit/767da12b466d8b9c733332dcaca051b4cff9de80)), closes [#8992](https://github.com/aws/aws-cdk/issues/8992)
* **apigateway:** remove default properties from SpecRestApi ([#9099](https://github.com/aws/aws-cdk/issues/9099)) ([06842d6](https://github.com/aws/aws-cdk/commit/06842d6389c8216bbfd18a397ef3d6f3b15316fb)), closes [#8347](https://github.com/aws/aws-cdk/issues/8347) [/github.com/aws/aws-cdk/issues/8347#issuecomment-651900511](https://github.com/aws//github.com/aws/aws-cdk/issues/8347/issues/issuecomment-651900511) [/github.com/aws/aws-cdk/issues/8347#issuecomment-652779763](https://github.com/aws//github.com/aws/aws-cdk/issues/8347/issues/issuecomment-652779763)
* **rds:** change the way Engines are modeled ([#8686](https://github.com/aws/aws-cdk/issues/8686)) ([63cc1b4](https://github.com/aws/aws-cdk/commit/63cc1b443b6a22a8190ae8a7905175614ba48324)), closes [#2213](https://github.com/aws/aws-cdk/issues/2213) [#2512](https://github.com/aws/aws-cdk/issues/2512) [#4150](https://github.com/aws/aws-cdk/issues/4150) [#5126](https://github.com/aws/aws-cdk/issues/5126) [#7072](https://github.com/aws/aws-cdk/issues/7072)

## [1.51.0](https://github.com/aws/aws-cdk/compare/v1.50.0...v1.51.0) (2020-07-09)


### Features

* **cloudfront:** Add connectionAttempts, connectionTimeout in origin configuration ([#8573](https://github.com/aws/aws-cdk/issues/8573)) ([84b923f](https://github.com/aws/aws-cdk/commit/84b923fb853d674e0a07f4296f2b23800d139366)), closes [#8572](https://github.com/aws/aws-cdk/issues/8572)
* Developer Preview of CDK Pipelines ([#8868](https://github.com/aws/aws-cdk/issues/8868)) ([d2609bd](https://github.com/aws/aws-cdk/commit/d2609bdbd0ba0347ff617267e928a2b54482e78a)), closes [aws/aws-cdk-rfcs#49](https://github.com/aws/aws-cdk-rfcs/issues/49)


### Bug Fixes

* **appmesh:** Update enums for appmesh ([#8716](https://github.com/aws/aws-cdk/issues/8716)) ([64e3d88](https://github.com/aws/aws-cdk/commit/64e3d888a66da84c066298564ad2875cb93bfd27))
* **cli:** Python sample app template does not follow PEP8 ([#8936](https://github.com/aws/aws-cdk/issues/8936)) ([0717919](https://github.com/aws/aws-cdk/commit/07179194d8fc4e3beaeafbe6cf04a2f3d1addd2c))
* **codepipeline:** set correct header assignment in S3 deployment cache control ([#8864](https://github.com/aws/aws-cdk/issues/8864)) ([be1094b](https://github.com/aws/aws-cdk/commit/be1094b4f4ef1eb194333faaf804db610535fea1)), closes [#8774](https://github.com/aws/aws-cdk/issues/8774)
* **ec2:** VpcEndpoint AZ lookup fails for AWS services ([#8386](https://github.com/aws/aws-cdk/issues/8386)) ([54e5c36](https://github.com/aws/aws-cdk/commit/54e5c3658241320244ae3055ec3ef7ca18926001))
* **iam:** cannot import service role with a principal in its path ([#8692](https://github.com/aws/aws-cdk/issues/8692)) ([55eb7d7](https://github.com/aws/aws-cdk/commit/55eb7d794450702e540246819f622a2bba22380e)), closes [#8691](https://github.com/aws/aws-cdk/issues/8691)

## [1.50.0](https://github.com/aws/aws-cdk/compare/v1.49.1...v1.50.0) (2020-07-07)


### ⚠ BREAKING CHANGES

* **eks:** `version` is now a mandatory property

### Features

* **apigatewayv2:** http api - custom domain & stage mapping ([#8027](https://github.com/aws/aws-cdk/issues/8027)) ([5e43348](https://github.com/aws/aws-cdk/commit/5e43348ecdb6a8da865bb0db22c4782b6fa4bc96)), closes [#7847](https://github.com/aws/aws-cdk/issues/7847)
* **autoscaling:** allow setting autoscaling group name ([#8853](https://github.com/aws/aws-cdk/issues/8853)) ([38d8414](https://github.com/aws/aws-cdk/commit/38d84149bae213d0e285d5192265043a8c0de1aa))
* **cfn-include:** add support for retrieving Output objects from the template ([#8821](https://github.com/aws/aws-cdk/issues/8821)) ([0b09bbb](https://github.com/aws/aws-cdk/commit/0b09bbb1d43192db71f682ff4f3ad125eb231d91)), closes [#8820](https://github.com/aws/aws-cdk/issues/8820)
* **custom-resources:** include handler log group in error messages ([#8839](https://github.com/aws/aws-cdk/issues/8839)) ([8e055d4](https://github.com/aws/aws-cdk/commit/8e055d449808f97436b92b6d6e57f8053e289653))
* **eks:** document how to add a manifest from url ([#8802](https://github.com/aws/aws-cdk/issues/8802)) ([b5acfaa](https://github.com/aws/aws-cdk/commit/b5acfaac89351ff6285acfdb36145bccca4b6b65)), closes [#8340](https://github.com/aws/aws-cdk/issues/8340)
* **eks:** support cluster version pinning ([#8889](https://github.com/aws/aws-cdk/issues/8889)) ([a732d14](https://github.com/aws/aws-cdk/commit/a732d149ff33f6958b83d539ba3429a025dcd631)), closes [#7762](https://github.com/aws/aws-cdk/issues/7762)
* **lambda:** efs filesystems ([#8602](https://github.com/aws/aws-cdk/issues/8602)) ([8529387](https://github.com/aws/aws-cdk/commit/8529387cb901fd1fea9e0ee1af1284de3ad98ce7)), closes [#8595](https://github.com/aws/aws-cdk/issues/8595)
* **lambda-nodejs:** allow jsx and tsx entry files ([#8892](https://github.com/aws/aws-cdk/issues/8892)) ([4ba20fd](https://github.com/aws/aws-cdk/commit/4ba20fd2f1579034483683995fac1e18e97a1b12))
* **s3-deployment:** prune - keep missing files on destination bucket ([#8263](https://github.com/aws/aws-cdk/issues/8263)) ([57914c7](https://github.com/aws/aws-cdk/commit/57914c7f430b69ae54c9d2d9fac4da1092b45b42)), closes [#953](https://github.com/aws/aws-cdk/issues/953)
* **stepfunctions:** stepfunctions and stepfunctions-tasks modules are now stable! ([#8912](https://github.com/aws/aws-cdk/issues/8912)) ([ae2378c](https://github.com/aws/aws-cdk/commit/ae2378cc2a537277025c9104bc43a4cc68318650)), closes [#6489](https://github.com/aws/aws-cdk/issues/6489)
* **stepfunctions-tasks:** task for invoking a Step Functions activity worker ([#8840](https://github.com/aws/aws-cdk/issues/8840)) ([021533c](https://github.com/aws/aws-cdk/commit/021533caa8f4e515299d1f0cdaadd9f625d6f64d))


### Bug Fixes

* **apigateway:** Lambda integration for imported functions ([#8870](https://github.com/aws/aws-cdk/issues/8870)) ([8420f96](https://github.com/aws/aws-cdk/commit/8420f96ffd6201656e908d6d7f61cdbbc3331cc1)), closes [#8869](https://github.com/aws/aws-cdk/issues/8869)
* **config:** cannot scope a custom rule without configurationChanges on ([#8738](https://github.com/aws/aws-cdk/issues/8738)) ([841060d](https://github.com/aws/aws-cdk/commit/841060d6adde4ea6d58e008f85cc155b8c3a3768))
* **core:** asset bundling fails with BuildKit ([#8911](https://github.com/aws/aws-cdk/issues/8911)) ([c1d4e0f](https://github.com/aws/aws-cdk/commit/c1d4e0fecbdf716eb55578ad5721a0ead4b306e2))
* **eks:** incorrect enableDockerBridge value when enabled ([#8895](https://github.com/aws/aws-cdk/issues/8895)) ([ea0552a](https://github.com/aws/aws-cdk/commit/ea0552a4378d61cffd14483896abadad7afa5a0a)), closes [#5786](https://github.com/aws/aws-cdk/issues/5786)
* **eks:** kubectl resources fail before fargate profiles are created ([#8859](https://github.com/aws/aws-cdk/issues/8859)) ([4fad9bc](https://github.com/aws/aws-cdk/commit/4fad9bcbd75702e89eea02a140aa010f8952329a)), closes [#8854](https://github.com/aws/aws-cdk/issues/8854) [#8574](https://github.com/aws/aws-cdk/issues/8574)
* **eks:** missing nodegroup identity in aws-auth after awsAuth.addMasterRole ([#8901](https://github.com/aws/aws-cdk/issues/8901)) ([a9c66f7](https://github.com/aws/aws-cdk/commit/a9c66f780b233ce3c25e12f39e3b1122636411b3)), closes [#7595](https://github.com/aws/aws-cdk/issues/7595)
* **lambda-nodejs:** maximum call stack size exceeded with relative entry file path ([#8907](https://github.com/aws/aws-cdk/issues/8907)) ([c585e18](https://github.com/aws/aws-cdk/commit/c585e1873e437341ac1b90afbe85a9cb9e6dc2d6)), closes [#8902](https://github.com/aws/aws-cdk/issues/8902)
* **rds:** proxy for db cluster fails with model validation error ([#8896](https://github.com/aws/aws-cdk/issues/8896)) ([7d47cfb](https://github.com/aws/aws-cdk/commit/7d47cfb39ba40a223ccc511e5706f471b9225c52)), closes [#8885](https://github.com/aws/aws-cdk/issues/8885) [#8476](https://github.com/aws/aws-cdk/issues/8476)

## [1.49.1](https://github.com/aws/aws-cdk/compare/v1.49.0...v1.49.1) (2020-07-02)

### Bug Fixes

* **apigateway:** Lambda integration for imported functions ([#8870](https://github.com/aws/aws-cdk/issues/8870)) ([c017f88](https://github.com/aws/aws-cdk/commit/c017f887770174437de3b772edf0034604890ac3)), closes [#8869](https://github.com/aws/aws-cdk/issues/8869)

## [1.49.0](https://github.com/aws/aws-cdk/compare/v1.48.0...v1.49.0) (2020-07-02)


### Features

* **core:** improved docker bundling performance on mac os ([#8766](https://github.com/aws/aws-cdk/issues/8766)) ([99c12f5](https://github.com/aws/aws-cdk/commit/99c12f5de61ac328e9198c83398852c7a4f90628)), closes [#8544](https://github.com/aws/aws-cdk/issues/8544)
* **eks:** document how to define dependencies for resources and charts ([#8780](https://github.com/aws/aws-cdk/issues/8780)) ([e38b692](https://github.com/aws/aws-cdk/commit/e38b692233c509a1ca36864e2d5f28bc90d465d3)), closes [#7592](https://github.com/aws/aws-cdk/issues/7592) [#6806](https://github.com/aws/aws-cdk/issues/6806)
* **rds:** database proxy ([#8476](https://github.com/aws/aws-cdk/issues/8476)) ([e0e5e03](https://github.com/aws/aws-cdk/commit/e0e5e034a198425ec9c55c219398df0e71b10815)), closes [#8475](https://github.com/aws/aws-cdk/issues/8475)


### Bug Fixes

* **apigateway:** permission error in lambda integration when function name is modified ([#8813](https://github.com/aws/aws-cdk/issues/8813)) ([f1b37ef](https://github.com/aws/aws-cdk/commit/f1b37ef8c75d055efea9b2f862555e9dd64634ff)), closes [#5306](https://github.com/aws/aws-cdk/issues/5306)
* **codebuild:** project didn't have permissions to retrieve secret of image with credentials ([#8845](https://github.com/aws/aws-cdk/issues/8845)) ([4326f24](https://github.com/aws/aws-cdk/commit/4326f245e0d89f6ec250334a74a254fbfb742ee1))
* **elasticloadbalancingv2:** dualstack ALB missing default IPv6 ingress rule ([#8798](https://github.com/aws/aws-cdk/issues/8798)) ([66f9634](https://github.com/aws/aws-cdk/commit/66f963494fc10db61cd61e36550de813821561e4)), closes [#7043](https://github.com/aws/aws-cdk/issues/7043)
* **lambda-nodejs:** parcel build cannot find target ([#8838](https://github.com/aws/aws-cdk/issues/8838)) ([ce7a015](https://github.com/aws/aws-cdk/commit/ce7a015a973d4936e9456ff98d5f1bef58642730)), closes [#8837](https://github.com/aws/aws-cdk/issues/8837)

## [1.48.0](https://github.com/aws/aws-cdk/compare/v1.47.1...v1.48.0) (2020-07-01)


### ⚠ BREAKING CHANGES

* **stepfunctions-tasks:** `containerName` is not supported as an override anymore and has been replaced by `containerDefinition`
* **stepfunctions-tasks:** `EvaluateExpression` is now a construct representing a task state rather than an embedded property called `task`
* **backup:** existing vaults that use a generated name will be replaced but
existing recovery points won't be lost. The default vault removal policy is
`RETAIN` and if it was set to `DESTROY` the deployment will fail because
vault with recovery points cannot be deleted.

### Features

* **autoscaling:** bring your own security group ([3698f47](https://github.com/aws/aws-cdk/commit/3698f47bad970be6f3765e4f145d64f59ded4276))
* **aws-cloudwatch:** add comparison operators ([#8812](https://github.com/aws/aws-cdk/issues/8812)) ([7003a09](https://github.com/aws/aws-cdk/commit/7003a09c4cc5390c4b1c125e79d50cf7ba2c9723)), closes [#8808](https://github.com/aws/aws-cdk/issues/8808)
* **cfn-include:** add support for YAML templates ([#8746](https://github.com/aws/aws-cdk/issues/8746)) ([293a937](https://github.com/aws/aws-cdk/commit/293a937a6c24681319ae7ca210ffdd0b2ba7d88a)), closes [#8745](https://github.com/aws/aws-cdk/issues/8745)
* **cfnspec:** cloudformation spec v16.0.0 ([#8807](https://github.com/aws/aws-cdk/issues/8807)) ([4ce27f4](https://github.com/aws/aws-cdk/commit/4ce27f4195c70bd9e365ec0e0df5c0ede863bc8a))
* **cli:** support multiple verbosity levels ([#8749](https://github.com/aws/aws-cdk/issues/8749)) ([fa4196b](https://github.com/aws/aws-cdk/commit/fa4196b11a4b843af1401cbcfd3fe075986ec5c0))
* **ec2:** `Volume` construct ([#8219](https://github.com/aws/aws-cdk/issues/8219)) ([7490dee](https://github.com/aws/aws-cdk/commit/7490deef3390f024dede3da8b95bcec6140ce1be))
* **ec2:** add 6xlarge InstanceSize ([#8701](https://github.com/aws/aws-cdk/issues/8701)) ([4917c04](https://github.com/aws/aws-cdk/commit/4917c04a23852608c4c697bff02a1085fdfd4b8c))
* **ec2:** natGateways=0 disables private subnets ([#8817](https://github.com/aws/aws-cdk/issues/8817)) ([7f432ff](https://github.com/aws/aws-cdk/commit/7f432ffd2c4755bd0976c1777021dad4c7cf2e26)), closes [#4814](https://github.com/aws/aws-cdk/issues/4814)
* **efs:** Filesystem.addAccessPoint() ([#8737](https://github.com/aws/aws-cdk/issues/8737)) ([127547a](https://github.com/aws/aws-cdk/commit/127547a8d64c25fef7c330abee06fd890354afec))
* **lambda-nodejs:** external and install modules ([#8681](https://github.com/aws/aws-cdk/issues/8681)) ([401594e](https://github.com/aws/aws-cdk/commit/401594ea6cd1c9dc7c4f62ffeee95a720a0ec337)), closes [#6323](https://github.com/aws/aws-cdk/issues/6323) [#7912](https://github.com/aws/aws-cdk/issues/7912)
* **secretsmanager:** add grantUpdate method ([#8600](https://github.com/aws/aws-cdk/issues/8600)) ([4e72d1e](https://github.com/aws/aws-cdk/commit/4e72d1e9f00ff464c9e645fe55f9178e30ad44df)), closes [#8491](https://github.com/aws/aws-cdk/issues/8491)
* **stepfunctions:** class for working with Json paths to retrieve state machine data and context ([#8647](https://github.com/aws/aws-cdk/issues/8647)) ([67978a1](https://github.com/aws/aws-cdk/commit/67978a1cc92c9e7bea389e533b893efedd204c66))
* **stepfunctions-tasks:** evaluate expression as a task construct ([#8555](https://github.com/aws/aws-cdk/issues/8555)) ([83fd2ae](https://github.com/aws/aws-cdk/commit/83fd2aee6389d03cfe69260b996d7d09398bbf99))
* **stepfunctions-tasks:** task construct to call `RunJob` on ECS ([#8451](https://github.com/aws/aws-cdk/issues/8451)) ([13deb26](https://github.com/aws/aws-cdk/commit/13deb266f030a28890b5672a0c12b658d253f57e)), closes [#8610](https://github.com/aws/aws-cdk/issues/8610)


### Bug Fixes

* **apigateway:** error defining lambda integration on imported RestApi ([#8785](https://github.com/aws/aws-cdk/issues/8785)) ([05aaf42](https://github.com/aws/aws-cdk/commit/05aaf422e71e12ea6ec91ea26bfbce81ebfea7f4)), closes [#8679](https://github.com/aws/aws-cdk/issues/8679)
* **backup:** correctly validate Vault name ([#8689](https://github.com/aws/aws-cdk/issues/8689)) ([07b330c](https://github.com/aws/aws-cdk/commit/07b330cf39be2a98fbee93915f07c2c34136e105))
* **backup:** vault name may exceed 50 characters ([#8653](https://github.com/aws/aws-cdk/issues/8653)) ([d09c121](https://github.com/aws/aws-cdk/commit/d09c121e84c0c106f25a129066b0990fb237b841)), closes [#8627](https://github.com/aws/aws-cdk/issues/8627)
* **batch:** Invalid spot fleet service role ([#8325](https://github.com/aws/aws-cdk/issues/8325)) ([034bc35](https://github.com/aws/aws-cdk/commit/034bc354ace24965cd091f423b8f2ef91f487a7a)), closes [#6706](https://github.com/aws/aws-cdk/issues/6706)
* **cli:** post install warnings are not clearly visible when running cdk init ([#8723](https://github.com/aws/aws-cdk/issues/8723)) ([2662db3](https://github.com/aws/aws-cdk/commit/2662db3218387a6264b37190c231e3b0006eb6b6)), closes [#8720](https://github.com/aws/aws-cdk/issues/8720)
* **cli:** unable to use "legacy" bootstrap with --public-access-block-configuration=false ([#8755](https://github.com/aws/aws-cdk/issues/8755)) ([88f8e1e](https://github.com/aws/aws-cdk/commit/88f8e1e9475c66114796dd2840c67a3f4e11f57f)), closes [#8728](https://github.com/aws/aws-cdk/issues/8728)
* **cognito:** cannot add multiple route53 targets to the same user pool domain ([#8622](https://github.com/aws/aws-cdk/issues/8622)) ([32b54a5](https://github.com/aws/aws-cdk/commit/32b54a504357922e55ac98850a8e4acc9a0349f5)), closes [#8603](https://github.com/aws/aws-cdk/issues/8603)
* **core:** bundling directory access permission is too restrictive ([#8767](https://github.com/aws/aws-cdk/issues/8767)) ([1842168](https://github.com/aws/aws-cdk/commit/18421686c4109deb018cc77429ec6deefb7d5689)), closes [#8757](https://github.com/aws/aws-cdk/issues/8757)
* **eks:** Helm chart timeout expects duration ([#8773](https://github.com/aws/aws-cdk/issues/8773)) ([d1c2ef2](https://github.com/aws/aws-cdk/commit/d1c2ef2fc8a845446c956e5e1eb32745f1810ee9)), closes [#8718](https://github.com/aws/aws-cdk/issues/8718)
* **elbv2:** Add missing accounts to ELBv2 Log Delivery. ([#8715](https://github.com/aws/aws-cdk/issues/8715)) ([8914899](https://github.com/aws/aws-cdk/commit/8914899aafcaa28d8b7ca2d2901f86b016179b50))
* **rewrite:** script ignores list of files ([#8777](https://github.com/aws/aws-cdk/issues/8777)) ([bb514c1](https://github.com/aws/aws-cdk/commit/bb514c1eb1098ccbe5cee4d7570d11bc8d9155c3))
* **route53-targets:** A/AAAA Alias Record to ELB cannot resolve IPv6 addresses ([#8747](https://github.com/aws/aws-cdk/issues/8747)) ([87e2651](https://github.com/aws/aws-cdk/commit/87e265114590d8fcc69e18b42d777b8ca201307c)), closes [#6271](https://github.com/aws/aws-cdk/issues/6271)
* **s3-notifications:** broken permissions query in `LambdaDestination` ([#8741](https://github.com/aws/aws-cdk/issues/8741)) ([10bd8e4](https://github.com/aws/aws-cdk/commit/10bd8e49709330624eee5f2c2662dee11e19e130)), closes [#8538](https://github.com/aws/aws-cdk/issues/8538)

## [1.47.1](https://github.com/aws/aws-cdk/compare/v1.47.0...v1.47.1) (2020-06-30)

### Bug Fixes

* Don't publish cdk.out directories ([#8803](https://github.com/aws/aws-cdk/pull/8803)) ([aa21858](https://github.com/aws/aws-cdk/commit/c337d4a89dfad2080e7efa1d37c751fcbaa21858))

## [1.47.0](https://github.com/aws/aws-cdk/compare/v1.46.0...v1.47.0) (2020-06-24)


### ⚠ BREAKING CHANGES

* **stepfunctions-tasks:** `Dynamo*` tasks no longer implement`IStepFunctionsTask` and have been replaced by constructs that can be instantiated directly. See README for examples

### Features

* **cfn-include:** add support for retrieving parameter objects ([#8658](https://github.com/aws/aws-cdk/issues/8658)) ([52dc123](https://github.com/aws/aws-cdk/commit/52dc123ba8696abcfad99d8093e98cd39b5b104f)), closes [#8657](https://github.com/aws/aws-cdk/issues/8657)
* **cfn-include:** support logical id overrides ([#8529](https://github.com/aws/aws-cdk/issues/8529)) ([d9c4f5e](https://github.com/aws/aws-cdk/commit/d9c4f5e67c54e1a2a436978fbc28fffd92b24cd6)), closes [#7375](https://github.com/aws/aws-cdk/issues/7375)
* **cloudwatch:** CompositeAlarm ([#8498](https://github.com/aws/aws-cdk/issues/8498)) ([1e6d293](https://github.com/aws/aws-cdk/commit/1e6d293f4c445318b11bd6fe998325688a675807))
* **efs:** access point ([#8631](https://github.com/aws/aws-cdk/issues/8631)) ([dde0ef5](https://github.com/aws/aws-cdk/commit/dde0ef52cc0cdbc40fd212f518f3cee4f30450b9))
* **stepfunctions:** grant APIs for state machine construct ([#8486](https://github.com/aws/aws-cdk/issues/8486)) ([fe71364](https://github.com/aws/aws-cdk/commit/fe71364b6cd8274e937cc2dc9185249dcbbb9388)), closes [#5933](https://github.com/aws/aws-cdk/issues/5933)
* **stepfunctions-tasks:** task constructs to call DynamoDB APIs ([#8466](https://github.com/aws/aws-cdk/issues/8466)) ([a7cb3b7](https://github.com/aws/aws-cdk/commit/a7cb3b7633c433ecb0619c030914bfa497ee39bc)), closes [#8108](https://github.com/aws/aws-cdk/issues/8108)


### Bug Fixes

* **appsync:** Not to throw an Error even if 'additionalAuthorizationModes' is undefined ([#8673](https://github.com/aws/aws-cdk/issues/8673)) ([6b5d77b](https://github.com/aws/aws-cdk/commit/6b5d77b452bccb35564d6acee118112156149eb0)), closes [#8666](https://github.com/aws/aws-cdk/issues/8666) [#8668](https://github.com/aws/aws-cdk/issues/8668)
* **cli:** cannot change policies or trust after initial bootstrap ([#8677](https://github.com/aws/aws-cdk/issues/8677)) ([6e6b23e](https://github.com/aws/aws-cdk/commit/6e6b23e329d8a1b6455210768371a5ab9de478ef)), closes [#6581](https://github.com/aws/aws-cdk/issues/6581)
* **cli:** crash on tiny reported terminal width ([#8675](https://github.com/aws/aws-cdk/issues/8675)) ([a186c24](https://github.com/aws/aws-cdk/commit/a186c24918fddc697270b794b6603add5a47e947)), closes [#8667](https://github.com/aws/aws-cdk/issues/8667)
* **toolkit:** CLI tool fails on CloudFormation Throttling ([#8711](https://github.com/aws/aws-cdk/issues/8711)) ([e512a40](https://github.com/aws/aws-cdk/commit/e512a4057b21d32432d4dc7ac14ae7caa812265d)), closes [#5637](https://github.com/aws/aws-cdk/issues/5637)

## [1.46.0](https://github.com/aws/aws-cdk/compare/v1.45.0...v1.46.0) (2020-06-19)


### ⚠ BREAKING CHANGES

* **stepfunctions-tasks:** constructs for `EMR*` have been introduced to replace
previous implementation which implemented `IStepFUnctionsTask`.
* **stepfunctions-tasks:** `sizeInGB` property in `VolumeSpecification` has been renamed to `volumeSize` and is of type `cdk.Size` as we want to enable specifying any unit
* **stepfunctions-tasks:** `ebsRootVolumeSize` property in `EmrCreateCluster` is now of type `cdk.Size` as we want to enable specifying any unit
* **stepfunctions-tasks:** `Tags` in `EmrCreateCluster` type has changed from `cdk.CfnTag[]` to a map of string to string as we do not want to leak `Cfn` types
* **rds:** the attribute securityGroupId has been removed from IDatabaseCluster,
use cluster.connections.securityGroups instead
* **rds**: DatabaseClusterAttributes.securityGroup has been changed to securityGroups, and its type to an array
* **rds**: InstanceProps.securityGroup has been changed to securityGroups, and its type to an array
* **rds:** the property `engine` can no longer be passed when creating a DatabaseInstanceReadReplica
* **rds:** the property 'instanceClass' in DatabaseInstanceNewProps has been renamed to 'instanceType'
* **appsync:** Changes way of auth config even for existing supported methods viz., User Pools and API Key.

### Features

* **amplify:** add "404 (Rewrite)" RedirectStatus ([#7944](https://github.com/aws/aws-cdk/issues/7944)) ([21dda30](https://github.com/aws/aws-cdk/commit/21dda300fcf4fc67abc742cc6bb2ef61ea1cf7aa))
* **amplify:** support for GitLab source code provider ([#8353](https://github.com/aws/aws-cdk/issues/8353)) ([f10da03](https://github.com/aws/aws-cdk/commit/f10da031ff3e6a07acc4000a321bfa8834fad77d))
* **apigateway:** define Resources on imported RestApi ([#8270](https://github.com/aws/aws-cdk/issues/8270)) ([21a1de3](https://github.com/aws/aws-cdk/commit/21a1de308101a5f7e07558ff8c786f27e5235289)), closes [#7391](https://github.com/aws/aws-cdk/issues/7391) [#1477](https://github.com/aws/aws-cdk/issues/1477) [#7391](https://github.com/aws/aws-cdk/issues/7391) [#8347](https://github.com/aws/aws-cdk/issues/8347)
* **appsync:** add Construct for AppSync HTTP DataSource ([#8009](https://github.com/aws/aws-cdk/issues/8009)) ([0592b36](https://github.com/aws/aws-cdk/commit/0592b36f3949bddd9b6a367ac0df198da983b41e)), closes [#8007](https://github.com/aws/aws-cdk/issues/8007)
* **appsync:** enhances and completes auth config ([#7878](https://github.com/aws/aws-cdk/issues/7878)) ([6d7ce65](https://github.com/aws/aws-cdk/commit/6d7ce65ae969e53494920cad9b8913b9aef60838))
* **autoscaling:** add instanceMonitoring option ([#8213](https://github.com/aws/aws-cdk/issues/8213)) ([6e23ae7](https://github.com/aws/aws-cdk/commit/6e23ae75184116953833ce93e87853fe9f933037)), closes [#8212](https://github.com/aws/aws-cdk/issues/8212)
* **awslint:** publish as an external module ([#8558](https://github.com/aws/aws-cdk/issues/8558)) ([378939c](https://github.com/aws/aws-cdk/commit/378939ca2a06910bf40267c314d9562388f9b3e7))
* **cfn-include:** add support for all remaining CloudFormation functions except Fn::Sub ([#8591](https://github.com/aws/aws-cdk/issues/8591)) ([8d699c5](https://github.com/aws/aws-cdk/commit/8d699c5af8b617c2cebe85286299cd0eba67b567)), closes [#8590](https://github.com/aws/aws-cdk/issues/8590)
* **cfn-include:** add support for CreationPolicy and UpdatePolicy resource attributes ([#8457](https://github.com/aws/aws-cdk/issues/8457)) ([2fc5372](https://github.com/aws/aws-cdk/commit/2fc5372c437fd02b000a4b1f976e4999620ef4b5))
* **cfnspec:** cloudformation spec v15.1.0 ([#8547](https://github.com/aws/aws-cdk/issues/8547)) ([50f4a21](https://github.com/aws/aws-cdk/commit/50f4a21f1b103910f029328d84347c5bfa0c7d56))
* **cli:** allow disabling of Public Access Block Configuration on bootstrap Bucket ([#8171](https://github.com/aws/aws-cdk/issues/8171)) ([33f4746](https://github.com/aws/aws-cdk/commit/33f4746b3da9ccd5dbc2bcf879feabf05e52baf0))
* **cli:** new deployment monitoring ([#8165](https://github.com/aws/aws-cdk/issues/8165)) ([f066c52](https://github.com/aws/aws-cdk/commit/f066c527dd5ad058b422bedc878833a21229c1cd))
* **cloudtrail:** cloudtrail module is now stable! ([#8651](https://github.com/aws/aws-cdk/issues/8651)) ([835f375](https://github.com/aws/aws-cdk/commit/835f375ad5a88b236297b4501d7dd13f3437b530))
* **cloudwatch:** liveData in GraphWidget ([#8579](https://github.com/aws/aws-cdk/issues/8579)) ([831092e](https://github.com/aws/aws-cdk/commit/831092eb05b3886affa968515043ddf68e3bbdd3)), closes [#8376](https://github.com/aws/aws-cdk/issues/8376)
* **cognito:** user pool - account recovery ([#8531](https://github.com/aws/aws-cdk/issues/8531)) ([1112abb](https://github.com/aws/aws-cdk/commit/1112abb74a6a69089bbf75702dc493901cbaa794)), closes [#8502](https://github.com/aws/aws-cdk/issues/8502)
* **cognito:** user pool - identity provider attribute mapping ([#8445](https://github.com/aws/aws-cdk/issues/8445)) ([1bd513b](https://github.com/aws/aws-cdk/commit/1bd513b605bfa7b5c2d5e2a1bdbf99aae00c271c))
* **cognito:** user pool client - disable OAuth easily ([#8496](https://github.com/aws/aws-cdk/issues/8496)) ([f69cdfd](https://github.com/aws/aws-cdk/commit/f69cdfdcfcb95252fe44a312313e1f7b25fee50b)), closes [#8429](https://github.com/aws/aws-cdk/issues/8429)
* **logs:** MetricFilter exposes extracted Metric object ([#8556](https://github.com/aws/aws-cdk/issues/8556)) ([a35a53b](https://github.com/aws/aws-cdk/commit/a35a53b5acadca668c12aaea533af8d6360edac0)), closes [#1353](https://github.com/aws/aws-cdk/issues/1353)
* upgrade JSII to version 1.7.0 ([#8632](https://github.com/aws/aws-cdk/issues/8632)) ([1d26dbd](https://github.com/aws/aws-cdk/commit/1d26dbda134f0ff2b9ee34998bd702a893fdb5db))
* **cognito:** user pools are now in developer preview ([#8522](https://github.com/aws/aws-cdk/issues/8522)) ([4fcad9a](https://github.com/aws/aws-cdk/commit/4fcad9ab771b772e6b157e3af19b158b18c34680))
* **core,s3-assets:** custom bundling docker command ([#8481](https://github.com/aws/aws-cdk/issues/8481)) ([2a6d90c](https://github.com/aws/aws-cdk/commit/2a6d90cec248640251f43dda1ee4957ba5579c50)), closes [#8460](https://github.com/aws/aws-cdk/issues/8460)
* **ec2:** Add Step Functions interface endpoint ([#8512](https://github.com/aws/aws-cdk/issues/8512)) ([d21231f](https://github.com/aws/aws-cdk/commit/d21231f53a1c8096a70b70172531ee641fb6da85))
* **efs:** removal policy on FileSystem ([#8593](https://github.com/aws/aws-cdk/issues/8593)) ([b17863b](https://github.com/aws/aws-cdk/commit/b17863b214d8f87d184fde9fb09a3ea9439f927d))
* **eks:** expose cluster security group and encryption configuration ([#8317](https://github.com/aws/aws-cdk/issues/8317)) ([03e85eb](https://github.com/aws/aws-cdk/commit/03e85eb5629f87b34005422dfeb367d5581e85e8)), closes [#8276](https://github.com/aws/aws-cdk/issues/8276) [#8276](https://github.com/aws/aws-cdk/issues/8276) [#8236](https://github.com/aws/aws-cdk/issues/8236)
* **eks:** timeout option helm charts ([#8338](https://github.com/aws/aws-cdk/issues/8338)) ([d1403cc](https://github.com/aws/aws-cdk/commit/d1403cc9849fd4e20278a2a5d3d80855c7e16f72)), closes [#8215](https://github.com/aws/aws-cdk/issues/8215)
* **globalaccelerator:** support Accelerator, Listener and EndpointGroup ([#8221](https://github.com/aws/aws-cdk/issues/8221)) ([e4e8270](https://github.com/aws/aws-cdk/commit/e4e827044848d858d63371b092b8b382e9624266)), closes [#5527](https://github.com/aws/aws-cdk/issues/5527)
* **kms:** import an Alias by name ([#8299](https://github.com/aws/aws-cdk/issues/8299)) ([4611e69](https://github.com/aws/aws-cdk/commit/4611e690014204d0895045d75e8821f3de3e9470)), closes [#5953](https://github.com/aws/aws-cdk/issues/5953)
* **lambda:** configurable retries for log retention custom resource ([#8258](https://github.com/aws/aws-cdk/issues/8258)) ([e17a49a](https://github.com/aws/aws-cdk/commit/e17a49aa7e6e4e42c78edccc8ed1bac09d75ab01)), closes [#8257](https://github.com/aws/aws-cdk/issues/8257)
* **rds:** multiple security groups in Cluster and Instance ([#8510](https://github.com/aws/aws-cdk/issues/8510)) ([31925c1](https://github.com/aws/aws-cdk/commit/31925c1916f4570de0f3bbe5be40f639a3d6eafd))
* **sns-subscriptions:** Add support for SMS subscriptions ([#8582](https://github.com/aws/aws-cdk/issues/8582)) ([82d8f11](https://github.com/aws/aws-cdk/commit/82d8f11842b26dd2dd5ffa2591157d38a642636a)), closes [#7882](https://github.com/aws/aws-cdk/issues/7882)


### Bug Fixes

* **apigateway:** deployment fails when domain name has uppercase letters ([#8456](https://github.com/aws/aws-cdk/issues/8456)) ([1e6a8e9](https://github.com/aws/aws-cdk/commit/1e6a8e99d1d14fe0c68fd84392385f347aeb7be6)), closes [#8428](https://github.com/aws/aws-cdk/issues/8428)
* **appsync:** don't mix the json result with setting variables ([#8290](https://github.com/aws/aws-cdk/issues/8290)) ([7ca74e0](https://github.com/aws/aws-cdk/commit/7ca74e08a92f21cbefe3cdb231fd63105ca80a74)), closes [#7026](https://github.com/aws/aws-cdk/issues/7026)
* **autoscaling:** can't configure notificationTypes ([#8294](https://github.com/aws/aws-cdk/issues/8294)) ([01ef1ca](https://github.com/aws/aws-cdk/commit/01ef1ca9818b2bd9f219de04ce2ec657de4e2149))
* **cli:** bootstrapping cannot be retried ([#8577](https://github.com/aws/aws-cdk/issues/8577)) ([cad6649](https://github.com/aws/aws-cdk/commit/cad66499aa9944ab088d87987c9e82aafd841319))
* **cloudtrail:** Invalid arn partition for GovCloud ([#8248](https://github.com/aws/aws-cdk/issues/8248)) ([5189170](https://github.com/aws/aws-cdk/commit/5189170e15d2a93c617891232ae75f070877269d)), closes [#8247](https://github.com/aws/aws-cdk/issues/8247)
* **core:** asset bundling runs as root ([#8492](https://github.com/aws/aws-cdk/issues/8492)) ([6df546f](https://github.com/aws/aws-cdk/commit/6df546f24d237a4985d1870497e3de41b394a1c1)), closes [#8489](https://github.com/aws/aws-cdk/issues/8489)
* **core:** asset staging custom hash generates invalid file names ([#8521](https://github.com/aws/aws-cdk/issues/8521)) ([4521ae3](https://github.com/aws/aws-cdk/commit/4521ae3734f7e76c864d2b883fc290091b5fcf3d)), closes [#8513](https://github.com/aws/aws-cdk/issues/8513)
* **core:** cannot use container assets with new-style synthesis ([#8575](https://github.com/aws/aws-cdk/issues/8575)) ([357d5f7](https://github.com/aws/aws-cdk/commit/357d5f7a20a3e9d7860e12afae9e494fe7ed7f3c)), closes [#8540](https://github.com/aws/aws-cdk/issues/8540)
* **core:** incorrect temp directory when bundling assets ([#8469](https://github.com/aws/aws-cdk/issues/8469)) ([9dc2e04](https://github.com/aws/aws-cdk/commit/9dc2e04c34379a4806566657115d53299eb51db1)), closes [#8465](https://github.com/aws/aws-cdk/issues/8465)
* **core:** s3-deployments don't work with new bootstrap stack ([#8578](https://github.com/aws/aws-cdk/issues/8578)) ([b2006c3](https://github.com/aws/aws-cdk/commit/b2006c3efc4eab6a9b5d984a148586eb9fa7b410)), closes [#8541](https://github.com/aws/aws-cdk/issues/8541)
* **ec2:** can't set natGateways=0 using reserved private subnets ([#8407](https://github.com/aws/aws-cdk/issues/8407)) ([d7bf724](https://github.com/aws/aws-cdk/commit/d7bf72452e588f1f474debda5d8e2a8a85e71430)), closes [#8203](https://github.com/aws/aws-cdk/issues/8203)
* **eks:** can't define a cluster with multiple Fargate profiles ([#8374](https://github.com/aws/aws-cdk/issues/8374)) ([1e78a68](https://github.com/aws/aws-cdk/commit/1e78a68d0a4968a649990a7e15df24881d690de2)), closes [#6084](https://github.com/aws/aws-cdk/issues/6084)
* **eks:** fargate profile deployment fails with missing iam:PassRole ([#8548](https://github.com/aws/aws-cdk/issues/8548)) ([d6190f2](https://github.com/aws/aws-cdk/commit/d6190f23b7cc17b005de6295cc2c35c703054b44)), closes [#8546](https://github.com/aws/aws-cdk/issues/8546)
* **eks:** fargate profile role not added to aws-auth by the cdk ([#8447](https://github.com/aws/aws-cdk/issues/8447)) ([f656ea7](https://github.com/aws/aws-cdk/commit/f656ea7926f593811ea1df224636015a5c820f7a)), closes [#7981](https://github.com/aws/aws-cdk/issues/7981)
* **elbv2:** allow non-TCP protocols in NLB TargetGroup ([#8525](https://github.com/aws/aws-cdk/issues/8525)) ([387c1a8](https://github.com/aws/aws-cdk/commit/387c1a8d495e7f0e51fe3bacd132f43aa34c341e))
* **rds:** 'engine' is no longer required in DatabaseInstanceReadReplica ([#8509](https://github.com/aws/aws-cdk/issues/8509)) ([86d84e6](https://github.com/aws/aws-cdk/commit/86d84e6d592b2bee110ca0fd9890ce32e46055c3))
* **rds:** rename 'instanceClass' in DatabaseInstance to 'instanceType' ([#8507](https://github.com/aws/aws-cdk/issues/8507)) ([e35cb1a](https://github.com/aws/aws-cdk/commit/e35cb1a7355606180c20dad56fa4ca0ea6652bf7))
* **secretsmanager:** rotation function name can exceed 64 chars ([#7896](https://github.com/aws/aws-cdk/issues/7896)) ([24e474b](https://github.com/aws/aws-cdk/commit/24e474b68ceada06271194a122e0bcdbd41e6c31)), closes [#7885](https://github.com/aws/aws-cdk/issues/7885), [#8442](https://github.com/aws/aws-cdk/issues/8442)

## [1.45.0](https://github.com/aws/aws-cdk/compare/v1.44.0...v1.45.0) (2020-06-09)


### ⚠ BREAKING CHANGES

* **stepfunctions-tasks:** constructs for `SageMakerCreateTrainingJob` and
`SageMakerCreateTransformJob` replace previous implementation that
implemented `IStepFunctionsTask`.
* **stepfunctions-tasks:** `volumeSizeInGB` property in `ResourceConfig` for
SageMaker tasks are now type `core.Size`
* **stepfunctions-tasks:** `maxPayload` property in `SagemakerTransformProps`
is now type `core.Size`
* **stepfunctions-tasks:** `volumeKmsKeyId` property in `SageMakerCreateTrainingJob` is now `volumeEncryptionKey`
* **cognito:** `requiredAttributes` on `UserPool` construct is now replaced with `standardAttributes` with a slightly modified signature.
* **rds:** DatabaseClusterProps.kmsKey has been renamed to storageEncryptionKey
* **rds**: DatabaseInstanceNewProps.performanceInsightKmsKey has been renamed to performanceInsightEncryptionKey
* **rds**: DatabaseInstanceSourceProps.secretKmsKey has been renamed to masterUserPasswordEncryptionKey
* **rds**: DatabaseInstanceProps.kmsKey has been renamed to storageEncryptionKey
* **rds**: DatabaseInstanceReadReplicaProps.kmsKey has been renamed to storageEncryptionKey
* **rds**: Login.kmsKey has been renamed to encryptionKey

### Features

* **assert:** more powerful matchers ([#8444](https://github.com/aws/aws-cdk/issues/8444)) ([ed6f763](https://github.com/aws/aws-cdk/commit/ed6f763bddbb2090bbf07e5bbd6c7710a54dd33d))
* **cloud9:** support AWS CodeCommit repository clone on launch ([#8205](https://github.com/aws/aws-cdk/issues/8205)) ([4781f94](https://github.com/aws/aws-cdk/commit/4781f94ee530ef66488fbf7b3728a753fa5718cd)), closes [#8204](https://github.com/aws/aws-cdk/issues/8204)
* **codestar:** support the GitHubRepository resource ([#8209](https://github.com/aws/aws-cdk/issues/8209)) ([02ddab8](https://github.com/aws/aws-cdk/commit/02ddab8c1e76c59ccaff4f45986de68d538d54eb)), closes [#8210](https://github.com/aws/aws-cdk/issues/8210)
* **cognito:** allow mutable attributes for requiredAttributes ([#7754](https://github.com/aws/aws-cdk/issues/7754)) ([1fabd98](https://github.com/aws/aws-cdk/commit/1fabd9819d4dbe64d175e73400078e435235d1d2))
* **core,s3-assets,lambda:** custom asset bundling ([#7898](https://github.com/aws/aws-cdk/issues/7898)) ([888b412](https://github.com/aws/aws-cdk/commit/888b412797b2bcd7b8f1b8c5cbc0c25d94f91a5f))
* **rds:** rename 'kmsKey' properties to 'encryptionKey' ([#8324](https://github.com/aws/aws-cdk/issues/8324)) ([4eefbbe](https://github.com/aws/aws-cdk/commit/4eefbbe612d4bd643bffd4dee525d88a921439cb))
* **secretsmanager:** deletionPolicy for secretsmanager ([#8188](https://github.com/aws/aws-cdk/issues/8188)) ([f6fe36a](https://github.com/aws/aws-cdk/commit/f6fe36a0281a60ad65474b6ce0e22d0182ed2bea)), closes [#6527](https://github.com/aws/aws-cdk/issues/6527)
* **secretsmanager:** Secret.grantRead() also gives DescribeSecret permissions ([#8409](https://github.com/aws/aws-cdk/issues/8409)) ([f44ae60](https://github.com/aws/aws-cdk/commit/f44ae607670bccee21dfd390effa7d0e8701efd4)), closes [#6444](https://github.com/aws/aws-cdk/issues/6444) [#7953](https://github.com/aws/aws-cdk/issues/7953)
* **stepfunctions-tasks:** task constructs for creating and transforming SageMaker jobs ([#8391](https://github.com/aws/aws-cdk/issues/8391)) ([480d4c0](https://github.com/aws/aws-cdk/commit/480d4c004122f37533c22a14c6ecb89b5da07011))


### Bug Fixes

* **apigateway:** authorizerUri does not resolve to the correct partition ([#8152](https://github.com/aws/aws-cdk/issues/8152)) ([f455273](https://github.com/aws/aws-cdk/commit/f4552733909cd0734a7d829a35d0c1277b2ca4fc)), closes [#8098](https://github.com/aws/aws-cdk/issues/8098)
* **apigateway:** methodArn not replacing path parameters with asterisks ([#8206](https://github.com/aws/aws-cdk/issues/8206)) ([8fc3751](https://github.com/aws/aws-cdk/commit/8fc37513477f4d9a8a37e4b6979a79e8ba6a1efd)), closes [#8036](https://github.com/aws/aws-cdk/issues/8036)
* **aws-s3-deployment:** Set proper s-maxage Cache Control header ([#8434](https://github.com/aws/aws-cdk/issues/8434)) ([8d5b801](https://github.com/aws/aws-cdk/commit/8d5b801971ddaba82e0767c74fe7640d3e802c2f)), closes [#6292](https://github.com/aws/aws-cdk/issues/6292)
* **cognito:** error when using parameter for `domainPrefix` ([#8399](https://github.com/aws/aws-cdk/issues/8399)) ([681b3bb](https://github.com/aws/aws-cdk/commit/681b3bbc7de517c06ac0bd848b73cc6d7267dfa1)), closes [#8314](https://github.com/aws/aws-cdk/issues/8314)
* **dynamodb:** old global table replicas cannot be deleted ([#8224](https://github.com/aws/aws-cdk/issues/8224)) ([00884c7](https://github.com/aws/aws-cdk/commit/00884c752d6746864f2a71d093502d4fb2422037)), closes [#7189](https://github.com/aws/aws-cdk/issues/7189)
* **elbv2:** addAction ignores conditions ([#8385](https://github.com/aws/aws-cdk/issues/8385)) ([729cc0b](https://github.com/aws/aws-cdk/commit/729cc0b1705cab64696682f21985d97ce6c41607)), closes [#8328](https://github.com/aws/aws-cdk/issues/8328)
* **elbv2:** missing permission to write NLB access logs to S3 bucket ([#8114](https://github.com/aws/aws-cdk/issues/8114)) ([d6a1265](https://github.com/aws/aws-cdk/commit/d6a126508e4bb03f6f9d874c2c6648c3e3661a41)), closes [#8113](https://github.com/aws/aws-cdk/issues/8113)

## [1.44.0](https://github.com/aws/aws-cdk/compare/v1.43.0...v1.44.0) (2020-06-04)


### Features

* **ecs-patterns:** support min and max health percentage in queueprocessingservice ([#8312](https://github.com/aws/aws-cdk/issues/8312)) ([6da564d](https://github.com/aws/aws-cdk/commit/6da564d68c5195c88c5959b7375e2973c2b07676))

## [1.43.0](https://github.com/aws/aws-cdk/compare/v1.42.1...v1.43.0) (2020-06-03)


### ⚠ BREAKING CHANGES

* **rds:** the default retention policy for RDS Cluster and DbInstance is now 'Snapshot'
* **cognito:** OAuth flows `authorizationCodeGrant` and
`implicitCodeGrant` in `UserPoolClient` are enabled by default.
* **cognito:** `callbackUrl` property in `UserPoolClient` is now
optional and has a default.
* **cognito:** All OAuth scopes in a `UserPoolClient` are now enabled
by default.

### Features

* **cfn-include:** add support for Conditions ([#8144](https://github.com/aws/aws-cdk/issues/8144)) ([33212d2](https://github.com/aws/aws-cdk/commit/33212d2c3adfc5a06ec4557787aea1b3cd1e8143))
* **cognito:** addDomain() on an imported user pool ([#8123](https://github.com/aws/aws-cdk/issues/8123)) ([49c9f99](https://github.com/aws/aws-cdk/commit/49c9f99c4dfd73bf53a461a844a1d9b0c02d3761))
* **cognito:** sign in url for a UserPoolDomain ([#8155](https://github.com/aws/aws-cdk/issues/8155)) ([e942936](https://github.com/aws/aws-cdk/commit/e94293675b0a9ebeb5876283d6a54427391469bd))
* **cognito:** user pool identity provider with support for Facebook & Amazon ([#8134](https://github.com/aws/aws-cdk/issues/8134)) ([1ad919f](https://github.com/aws/aws-cdk/commit/1ad919fecf7cda45293efc3c0805b2eb5b49ed69))
* **dynamodb:** allow providing indexes when importing a Table ([#8245](https://github.com/aws/aws-cdk/issues/8245)) ([9ee61eb](https://github.com/aws/aws-cdk/commit/9ee61eb96de54fcbb71e41a2db2c1c9ec6b7b8d9)), closes [#6392](https://github.com/aws/aws-cdk/issues/6392)
* **events-targets:** kinesis stream as event rule target ([#8176](https://github.com/aws/aws-cdk/issues/8176)) ([21ebc2d](https://github.com/aws/aws-cdk/commit/21ebc2dfdcc202bac47083d4c7d06e1ae4df0709)), closes [#2997](https://github.com/aws/aws-cdk/issues/2997)
* **lambda-nodejs:** allow passing env vars to container ([#8169](https://github.com/aws/aws-cdk/issues/8169)) ([1755cf2](https://github.com/aws/aws-cdk/commit/1755cf274b4da446272f109b55b20680beb34fe7)), closes [#8031](https://github.com/aws/aws-cdk/issues/8031)
* **rds:** change the default retention policy of Cluster and DB Instance to Snapshot ([#8023](https://github.com/aws/aws-cdk/issues/8023)) ([2d83328](https://github.com/aws/aws-cdk/commit/2d833280be7a8550ab4a713e7213f1dd351f9767)), closes [#3298](https://github.com/aws/aws-cdk/issues/3298)
* **redshift:** add initial L2 Redshift construct ([#5730](https://github.com/aws/aws-cdk/issues/5730)) ([703f0fa](https://github.com/aws/aws-cdk/commit/703f0fa6e2ba5e668d6a92200493d19d2af626c0)), closes [#5711](https://github.com/aws/aws-cdk/issues/5711)
* **s3:** supports RemovalPolicy for BucketPolicy ([#8158](https://github.com/aws/aws-cdk/issues/8158)) ([cb71f34](https://github.com/aws/aws-cdk/commit/cb71f340343011a2a2de9758879a56e898b8e12c)), closes [#7415](https://github.com/aws/aws-cdk/issues/7415)
* **stepfunctions-tasks:** start a nested state machine execution as a construct ([#8178](https://github.com/aws/aws-cdk/issues/8178)) ([3000dd5](https://github.com/aws/aws-cdk/commit/3000dd58cbe05cc483e30da6c8b18e9e3bf27e0f))
* **stepfunctions-tasks:** task state construct to submit a job to AWS Batch ([#8115](https://github.com/aws/aws-cdk/issues/8115)) ([bc41cd5](https://github.com/aws/aws-cdk/commit/bc41cd5662314202c9bd8af87587990ad0b50282))


### Bug Fixes

* **apigateway:** deployment is not updated when OpenAPI definition is updated ([#8207](https://github.com/aws/aws-cdk/issues/8207)) ([d28c947](https://github.com/aws/aws-cdk/commit/d28c9473e0f480eba06e7dc9c260e4372501fc36)), closes [#8159](https://github.com/aws/aws-cdk/issues/8159)
* **app-delivery:** could not use PipelineDeployStackAction more than once in a Stage ([#8217](https://github.com/aws/aws-cdk/issues/8217)) ([9a54447](https://github.com/aws/aws-cdk/commit/9a54447f2a7d7e3a5d31a57bb3b2e2b0555430a1)), closes [#3984](https://github.com/aws/aws-cdk/issues/3984) [#8183](https://github.com/aws/aws-cdk/issues/8183)
* **cli:** termination protection not updated when change set has no changes ([#8275](https://github.com/aws/aws-cdk/issues/8275)) ([29d3145](https://github.com/aws/aws-cdk/commit/29d3145d1f4d7e17cd20f197d3c4955f48d07b37))
* **codepipeline:** allow multiple CodeCommit source actions using events ([#8018](https://github.com/aws/aws-cdk/issues/8018)) ([103c144](https://github.com/aws/aws-cdk/commit/103c1449683ffc131b696faff8b16f0935a3c3f4)), closes [#7802](https://github.com/aws/aws-cdk/issues/7802)
* **codepipeline:** correctly handle CODEBUILD_CLONE_REF in BitBucket source ([#7107](https://github.com/aws/aws-cdk/issues/7107)) ([ac001b8](https://github.com/aws/aws-cdk/commit/ac001b86bbff1801005cac1509e4480a30bf8f15))
* **codepipeline:** unhelpful artifact validation messages ([#8256](https://github.com/aws/aws-cdk/issues/8256)) ([2a2406e](https://github.com/aws/aws-cdk/commit/2a2406e5cc16e3bcce4e355f54b31ca8a7c2ace6))
* **core:** CFN version and description template sections were merged incorrectly ([#8251](https://github.com/aws/aws-cdk/issues/8251)) ([b7e328d](https://github.com/aws/aws-cdk/commit/b7e328da4e7720c27bd7e828ffe3d3ae9dc1d070)), closes [#8151](https://github.com/aws/aws-cdk/issues/8151)
* **lambda:** `SingletonFunction.grantInvoke()` API fails with error 'No child with id' ([#8296](https://github.com/aws/aws-cdk/issues/8296)) ([a8b1815](https://github.com/aws/aws-cdk/commit/a8b1815f47b140b0fb06a3df0314c0fe28816fb6)), closes [#8240](https://github.com/aws/aws-cdk/issues/8240)
* **rds:** cannot delete a stack with DbCluster set to 'Retain' ([#8110](https://github.com/aws/aws-cdk/issues/8110)) ([c2e534e](https://github.com/aws/aws-cdk/commit/c2e534ecab219be8cd8174b60da3b58072dcfd47)), closes [#5282](https://github.com/aws/aws-cdk/issues/5282)
* **sqs:** unable to use CfnParameter 'valueAsNumber' to specify queue properties ([#8252](https://github.com/aws/aws-cdk/issues/8252)) ([8ec405f](https://github.com/aws/aws-cdk/commit/8ec405f5c016d0cbe1b9eeea6649e1e68f9b76e7)), closes [#7126](https://github.com/aws/aws-cdk/issues/7126)

## [1.42.1](https://github.com/aws/aws-cdk/compare/v1.42.0...v1.42.1) (2020-06-01)


### Bug Fixes

* **lambda:** `SingletonFunction.grantInvoke()` API fails with error 'No child with id' ([#8296](https://github.com/aws/aws-cdk/issues/8296)) ([b4e264c](https://github.com/aws/aws-cdk/commit/b4e264c024bc58053412be1343bed6458628f7cb)), closes [#8240](https://github.com/aws/aws-cdk/issues/8240)

## [1.42.0](https://github.com/aws/aws-cdk/compare/v1.41.0...v1.42.0) (2020-05-27)


### ⚠ BREAKING CHANGES

* **cloudtrail:** API signatures of `addS3EventSelectors` and
`addLambdaEventSelectors` have changed. Their parameters are now
strongly typed to accept `IBucket` and `IFunction` respectively.
* **cloudtrail:** `addS3EventSelectors` and `addLambdaEventSelectors`
can no longer be used to configure all S3 data events or all Lambda data
events. Two new APIs `logAllS3DataEvents()` and
`logAllLambdaDataEvents()` have been introduced to achieve this.
* **cloudtrail:** The property `snsTopic` is now of the type `ITopic`.

### Features

* **cfnspec:** cloudformation spec v14.4.0 ([#8195](https://github.com/aws/aws-cdk/issues/8195)) ([99e7330](https://github.com/aws/aws-cdk/commit/99e7330fc5fc140964c47d8c6dbaee2b46b382e1))
* **cloudtrail:** create cloudwatch event without needing to create a Trail ([#8076](https://github.com/aws/aws-cdk/issues/8076)) ([0567a23](https://github.com/aws/aws-cdk/commit/0567a2360ac713e3171c9a82767611174dadb6c6)), closes [#6716](https://github.com/aws/aws-cdk/issues/6716)
* **cloudtrail:** user specified log group ([#8079](https://github.com/aws/aws-cdk/issues/8079)) ([0a3785b](https://github.com/aws/aws-cdk/commit/0a3785b7626633fcbdf26ab793c70f2bc017314b)), closes [#6162](https://github.com/aws/aws-cdk/issues/6162)
* **codeguruprofiler:** ProfilingGroup ([#7895](https://github.com/aws/aws-cdk/issues/7895)) ([995088a](https://github.com/aws/aws-cdk/commit/995088abb00d9c75adbb65845998a8328bb5ba14))
* **codepipeline:** use a special bootstrapless synthesizer for cross-region support Stacks ([#8091](https://github.com/aws/aws-cdk/issues/8091)) ([575f1db](https://github.com/aws/aws-cdk/commit/575f1db0474327c61c4ac626608c9f443ce231d2)), closes [#8082](https://github.com/aws/aws-cdk/issues/8082)
* **cognito:** user pool - case sensitivity for sign in ([460394f](https://github.com/aws/aws-cdk/commit/460394f3dc4737cee80504d6c8ef106ecc3b67d5)), closes [#7988](https://github.com/aws/aws-cdk/issues/7988) [#7235](https://github.com/aws/aws-cdk/issues/7235)
* **core:** CfnJson enables intrinsics in hash keys ([#8099](https://github.com/aws/aws-cdk/issues/8099)) ([195cd40](https://github.com/aws/aws-cdk/commit/195cd405d9f0869875de2ec78661aee3af2c7c7d)), closes [#8084](https://github.com/aws/aws-cdk/issues/8084)
* **eks:** improve security using IRSA conditions ([#8084](https://github.com/aws/aws-cdk/issues/8084)) ([35a01a0](https://github.com/aws/aws-cdk/commit/35a01a079af40da291007da08af6690c9a81c101))
* **elbv2:** Supports new types of listener rule conditions ([#7848](https://github.com/aws/aws-cdk/issues/7848)) ([3d30ffa](https://github.com/aws/aws-cdk/commit/3d30ffa38c51ae26686287e993af445ea3067766)), closes [#3888](https://github.com/aws/aws-cdk/issues/3888)
* **secretsmanager:** adds grantWrite to Secret ([#7858](https://github.com/aws/aws-cdk/issues/7858)) ([3fed84b](https://github.com/aws/aws-cdk/commit/3fed84ba9eec3f53c662966e366aa629209b7bf5))
* **sns:** add support for subscription DLQ in SNS ([383cdb8](https://github.com/aws/aws-cdk/commit/383cdb86effeafdf5d0767ed379b16b3d78a933b))
* **stepfunctions:** new service integration classes for Lambda, SNS, and SQS ([#7946](https://github.com/aws/aws-cdk/issues/7946)) ([c038848](https://github.com/aws/aws-cdk/commit/c0388483524832ca7863de4ee9c472b8ab39de8e)), closes [#6715](https://github.com/aws/aws-cdk/issues/6715) [#6489](https://github.com/aws/aws-cdk/issues/6489)
* **stepfunctions:** support paths in Pass state ([#8070](https://github.com/aws/aws-cdk/issues/8070)) ([86eac6a](https://github.com/aws/aws-cdk/commit/86eac6af074bf78a921c52d613eca0dd4a514a49)), closes [#7181](https://github.com/aws/aws-cdk/issues/7181)
* **stepfunctions-tasks:** task for starting a job run in AWS Glue ([#8143](https://github.com/aws/aws-cdk/issues/8143)) ([a721e67](https://github.com/aws/aws-cdk/commit/a721e670cdc9888cd67ef1a24021004e18bfd23c))


### Bug Fixes

* **apigateway:** contextAccountId in AccessLogField incorrectly resolves to requestId ([7b89e80](https://github.com/aws/aws-cdk/commit/7b89e805c716fa73d41cc97fcb728634e7a59136)), closes [#7952](https://github.com/aws/aws-cdk/issues/7952) [#7951](https://github.com/aws/aws-cdk/issues/7951)
* **autoscaling:** add noDevice as a volume type ([#7253](https://github.com/aws/aws-cdk/issues/7253)) ([751958b](https://github.com/aws/aws-cdk/commit/751958b69225fdfc52622781c618f5a77f881fb6)), closes [#7242](https://github.com/aws/aws-cdk/issues/7242)
* **aws-eks:** kubectlEnabled: false conflicts with addNodegroup ([#8119](https://github.com/aws/aws-cdk/issues/8119)) ([8610889](https://github.com/aws/aws-cdk/commit/86108890a51443dc06ec6325038c7b19cbdaee76)), closes [#7993](https://github.com/aws/aws-cdk/issues/7993)
* **cli:** paper cuts ([#8164](https://github.com/aws/aws-cdk/issues/8164)) ([af2ea60](https://github.com/aws/aws-cdk/commit/af2ea60e7ae4aaab17ddd10a9142e1809b4c8246))
* **dynamodb:** the maximum number of nonKeyAttributes is 100, not 20 ([#8186](https://github.com/aws/aws-cdk/issues/8186)) ([0393528](https://github.com/aws/aws-cdk/commit/03935280f1addef392c9b4460737cce8bb2eb8c9)), closes [#8095](https://github.com/aws/aws-cdk/issues/8095)
* **eks:** unable to add multiple service accounts ([#8122](https://github.com/aws/aws-cdk/issues/8122)) ([524440c](https://github.com/aws/aws-cdk/commit/524440c5454d15276c92581a08d4ee7cad1790eb))
* **events:** cannot use the same target account for 2 cross-account event sources ([#8068](https://github.com/aws/aws-cdk/issues/8068)) ([395c07c](https://github.com/aws/aws-cdk/commit/395c07c0cac7739743fc71d71fddd8880b608ead)), closes [#8010](https://github.com/aws/aws-cdk/issues/8010)
* **lambda-nodejs:** build fails on Windows ([#8140](https://github.com/aws/aws-cdk/issues/8140)) ([04490b1](https://github.com/aws/aws-cdk/commit/04490b134a05ec34523541a3ca282ba8957a7964)), closes [#8107](https://github.com/aws/aws-cdk/issues/8107)
* **cloudtrail:** better typed event selector apis ([#8097](https://github.com/aws/aws-cdk/issues/8097)) ([0028778](https://github.com/aws/aws-cdk/commit/0028778c0f00f2faa8dad25345cd17f311fad5da))

## [1.41.0](https://github.com/aws/aws-cdk/compare/v1.40.0...v1.41.0) (2020-05-21)


### Features

* **cloudtrail:** create cloudwatch event without needing to create a Trail ([#8076](https://github.com/aws/aws-cdk/issues/8076)) ([0567a23](https://github.com/aws/aws-cdk/commit/0567a2360ac713e3171c9a82767611174dadb6c6)), closes [#6716](https://github.com/aws/aws-cdk/issues/6716)
* **cognito:** user pool - case sensitivity for sign in ([460394f](https://github.com/aws/aws-cdk/commit/460394f3dc4737cee80504d6c8ef106ecc3b67d5)), closes [#7988](https://github.com/aws/aws-cdk/issues/7988) [#7235](https://github.com/aws/aws-cdk/issues/7235)
* **core:** CfnJson enables intrinsics in hash keys ([#8099](https://github.com/aws/aws-cdk/issues/8099)) ([195cd40](https://github.com/aws/aws-cdk/commit/195cd405d9f0869875de2ec78661aee3af2c7c7d)), closes [#8084](https://github.com/aws/aws-cdk/issues/8084)
* **secretsmanager:** adds grantWrite to Secret ([#7858](https://github.com/aws/aws-cdk/issues/7858)) ([3fed84b](https://github.com/aws/aws-cdk/commit/3fed84ba9eec3f53c662966e366aa629209b7bf5))
* **sns:** add support for subscription DLQ in SNS ([383cdb8](https://github.com/aws/aws-cdk/commit/383cdb86effeafdf5d0767ed379b16b3d78a933b))
* **stepfunctions:** new service integration classes for Lambda, SNS, and SQS ([#7946](https://github.com/aws/aws-cdk/issues/7946)) ([c038848](https://github.com/aws/aws-cdk/commit/c0388483524832ca7863de4ee9c472b8ab39de8e)), closes [#6715](https://github.com/aws/aws-cdk/issues/6715) [#6489](https://github.com/aws/aws-cdk/issues/6489)


### Bug Fixes

* **apigateway:** contextAccountId in AccessLogField incorrectly resolves to requestId ([7b89e80](https://github.com/aws/aws-cdk/commit/7b89e805c716fa73d41cc97fcb728634e7a59136)), closes [#7952](https://github.com/aws/aws-cdk/issues/7952) [#7951](https://github.com/aws/aws-cdk/issues/7951)
* **autoscaling:** add noDevice as a volume type ([#7253](https://github.com/aws/aws-cdk/issues/7253)) ([751958b](https://github.com/aws/aws-cdk/commit/751958b69225fdfc52622781c618f5a77f881fb6)), closes [#7242](https://github.com/aws/aws-cdk/issues/7242)

## [1.40.0](https://github.com/aws/aws-cdk/compare/v1.39.0...v1.40.0) (2020-05-20)


### Features

* add support for Gitpod workspaces ([20d5511](https://github.com/aws/aws-cdk/commit/20d551142ea13c57981ad8b24ac61d03091da6b9))
* **autoscaling:** support max instance lifetime  ([d126c46](https://github.com/aws/aws-cdk/commit/d126c46f8429b30e1937e2e970011bc6fac8b5a2)), closes [#7758](https://github.com/aws/aws-cdk/issues/7758)
* **cfn-include:** add support for the DependsOn attribute ([613df1b](https://github.com/aws/aws-cdk/commit/613df1b8e4b794a772d6124a22463072617aef62))
* **docdb:** high level constrcuts for db clusters and instances ([#6511](https://github.com/aws/aws-cdk/issues/6511)) ([a376dd3](https://github.com/aws/aws-cdk/commit/a376dd326e180462044b610c6925998482bd04d2))
* **eks:** IAM roles for service accounts ([3f0d2c8](https://github.com/aws/aws-cdk/commit/3f0d2c82ef6102fb6b8cea23e397f559fa6a4d61)), closes [#6062](https://github.com/aws/aws-cdk/issues/6062) [#5388](https://github.com/aws/aws-cdk/issues/5388) [#3949](https://github.com/aws/aws-cdk/issues/3949)
* **elbv2:** full Action support ([2939105](https://github.com/aws/aws-cdk/commit/29391059a571fc41d94275f36cf54e08c6f5441f)), closes [#2563](https://github.com/aws/aws-cdk/issues/2563) [#6310](https://github.com/aws/aws-cdk/issues/6310) [#6308](https://github.com/aws/aws-cdk/issues/6308)
* **region-info:** add information for us-gov, us-iso, and us-isob regions ([afe0b00](https://github.com/aws/aws-cdk/commit/afe0b00b12afe383da49dcfa07f85b578728a0d1)), closes [#7876](https://github.com/aws/aws-cdk/issues/7876) [#4669](https://github.com/aws/aws-cdk/issues/4669)
* **s3-asset:** add httpUrl and s3ObjectUrl ([eeff393](https://github.com/aws/aws-cdk/commit/eeff39324e4735096f85b32d37c95011881467b6)), closes [#7509](https://github.com/aws/aws-cdk/issues/7509) [#7221](https://github.com/aws/aws-cdk/issues/7221)

## [1.39.0](https://github.com/aws/aws-cdk/compare/v1.38.0...v1.39.0) (2020-05-15)


### ⚠ BREAKING CHANGES

* **cognito:** An invalid template placeholder has been removed
from the default verification email body in a user pool.

### Features

* **apigateway:** create RestApi from an OpenAPI spec ([31014ca](https://github.com/aws/aws-cdk/commit/31014ca7c34b3efbf5dca159a1168d5fbce633ec)), closes [#4421](https://github.com/aws/aws-cdk/issues/4421)
* **apigateway:** import existing VpcLink ([#7811](https://github.com/aws/aws-cdk/issues/7811)) ([7b42f7f](https://github.com/aws/aws-cdk/commit/7b42f7f11030577d98714185259c3de210fff0e2)), closes [#4178](https://github.com/aws/aws-cdk/issues/4178)
* initial version of an improved CloudFormation template include experience ([0132251](https://github.com/aws/aws-cdk/commit/0132251e84a7d8dad747b4eb0661365414a114aa)), closes [#3537](https://github.com/aws/aws-cdk/issues/3537)
* **apigateway:** specify API key name and value in `addApiKey()` ([#7714](https://github.com/aws/aws-cdk/issues/7714)) ([e93da2c](https://github.com/aws/aws-cdk/commit/e93da2cf48a297b31f2ca0c1e96b905fc128914b)), closes [#3233](https://github.com/aws/aws-cdk/issues/3233) [#7767](https://github.com/aws/aws-cdk/issues/7767)
* **apigatewayv2:** HTTP API - configure CORS preflight ([#7923](https://github.com/aws/aws-cdk/issues/7923)) ([9f35104](https://github.com/aws/aws-cdk/commit/9f35104d2e6612032f2c6d8d7193baddceb30d15)), closes [#7922](https://github.com/aws/aws-cdk/issues/7922)
* **cognito:** user pool client - prevent user existence errors ([c7f15f2](https://github.com/aws/aws-cdk/commit/c7f15f255ede6411f4afb68f5b9f1d54abe47df3)), closes [#7406](https://github.com/aws/aws-cdk/issues/7406)
* **dynamodb:** support for Customer-managed CMK ([#7425](https://github.com/aws/aws-cdk/issues/7425)) ([ff8219b](https://github.com/aws/aws-cdk/commit/ff8219ba0e2582ec25d59498804073776d8ebf14)), closes [#7142](https://github.com/aws/aws-cdk/issues/7142)
* **ec2:** lookup available AZs for Interface Endpoints ([9fa3221](https://github.com/aws/aws-cdk/commit/9fa3221f7dbedb6e6fb388c97e21a4fdcfd9a892))
* **events-targets:** support multiple security groups for an ECS task ([#7857](https://github.com/aws/aws-cdk/issues/7857)) ([c6504e6](https://github.com/aws/aws-cdk/commit/c6504e6433d540414a417b9fb23fb9950a44eb5c)), closes [#3312](https://github.com/aws/aws-cdk/issues/3312)
* **init/java:** model CDK version in property in Maven POMs ([#7931](https://github.com/aws/aws-cdk/issues/7931)) ([ce5b8fb](https://github.com/aws/aws-cdk/commit/ce5b8fbe77a4414b13b67845aca171aa00794d55)), closes [#7862](https://github.com/aws/aws-cdk/issues/7862)


### Bug Fixes

* **cli:** cdk bootstrap cannot be used without supplying the --app argument ([#7970](https://github.com/aws/aws-cdk/issues/7970)) ([540a7e6](https://github.com/aws/aws-cdk/commit/540a7e6d020a2af867adbd9928d32bfec30c97ae)), closes [#7510](https://github.com/aws/aws-cdk/issues/7510) [#7906](https://github.com/aws/aws-cdk/issues/7906)
* **cognito:** invalid default for verification email ([#7790](https://github.com/aws/aws-cdk/issues/7790)) ([cb3c184](https://github.com/aws/aws-cdk/commit/cb3c184d41bcd5c995f9a01fe875fdbf15ce5564)), closes [#7597](https://github.com/aws/aws-cdk/issues/7597)
* **core:** consistent sorting of resource tags ([0105efd](https://github.com/aws/aws-cdk/commit/0105efdd22e6e24af0f1547d57e6528eee999155)), closes [#7707](https://github.com/aws/aws-cdk/issues/7707)
* **core:** hangs when used with yarn PnP ([8579100](https://github.com/aws/aws-cdk/commit/8579100db0de0b8ec78186caa82aa5e0432774db)), closes [yarnpkg/berry#1298](https://github.com/yarnpkg/berry/issues/1298)
* **elbv2:** race condition for Lambda backends ([1819a6b](https://github.com/aws/aws-cdk/commit/1819a6b5920bb22a60d09de870ea625455b90395)), closes [#4663](https://github.com/aws/aws-cdk/issues/4663) [#7236](https://github.com/aws/aws-cdk/issues/7236)
* **iot1click:** incorrect type for Project.deviceTemplates ([#8000](https://github.com/aws/aws-cdk/issues/8000)) ([338ef92](https://github.com/aws/aws-cdk/commit/338ef92ced25563a80fb93b90f75853fe29ce6b7)), closes [#8001](https://github.com/aws/aws-cdk/issues/8001)
* **lambda:** SingletonFunction ignores explicit declared dependencies ([#7997](https://github.com/aws/aws-cdk/issues/7997)) ([91f913f](https://github.com/aws/aws-cdk/commit/91f913f09cfe0ee402b5e6269a7cc8cbcb32d58b)), closes [#7568](https://github.com/aws/aws-cdk/issues/7568)
* **stepfunctions-tasks:** EvaluateExpression is limited to expressions that contain state paths ([#7774](https://github.com/aws/aws-cdk/issues/7774)) ([97f4f01](https://github.com/aws/aws-cdk/commit/97f4f019b8514bb9a2ce5d06237fb724d1b1ad84)), closes [#7655](https://github.com/aws/aws-cdk/issues/7655)

## [1.38.0](https://github.com/aws/aws-cdk/compare/v1.37.0...v1.38.0) (2020-05-08)


### Features

* **cloudfront:** support geo restrictions for cloudfront distribution ([#7345](https://github.com/aws/aws-cdk/issues/7345)) ([cf25ba0](https://github.com/aws/aws-cdk/commit/cf25ba0dc3baae8db40219611f7aa919b108c739)), closes [#3456](https://github.com/aws/aws-cdk/issues/3456)
* **cloudwatch:** legend positions in GraphWidgets ([ada0de1](https://github.com/aws/aws-cdk/commit/ada0de1f051a72768523544b5bca27e0768632a9)), closes [#3625](https://github.com/aws/aws-cdk/issues/3625)
* **codebuild:** add support for test reports ([4befefc](https://github.com/aws/aws-cdk/commit/4befefc4792c6d6415f356f8d40e115e9e602802)), closes [#7367](https://github.com/aws/aws-cdk/issues/7367)
* **core:** custom resource provider helper ([4a76973](https://github.com/aws/aws-cdk/commit/4a7697370c9d04fdbb2c9fb0be71d67122573390))
* **ec2:** EBS volume configuration for BastionHostLinux ([207a8ec](https://github.com/aws/aws-cdk/commit/207a8ecf233511ad478827620b9caf0ff5fbb815)), closes [#6945](https://github.com/aws/aws-cdk/issues/6945)
* **ecs:** support multiple security groups when creating an ecs service ([#7850](https://github.com/aws/aws-cdk/issues/7850)) ([456c469](https://github.com/aws/aws-cdk/commit/456c469dd4b92a6a863e4c40125adf573d4df239))
* **iam:** openid connect providers ([20621ac](https://github.com/aws/aws-cdk/commit/20621acf6c1adbf144d47a029888fe481d5abb78)), closes [#5388](https://github.com/aws/aws-cdk/issues/5388) [#3949](https://github.com/aws/aws-cdk/issues/3949) [#6308](https://github.com/aws/aws-cdk/issues/6308)
* add an example construct package ([#7748](https://github.com/aws/aws-cdk/issues/7748)) ([2223584](https://github.com/aws/aws-cdk/commit/2223584d5f9811294125c6d6068d1f5bb4e48349))
* **lambda-nodejs:** run parcel in a docker container ([d86e500](https://github.com/aws/aws-cdk/commit/d86e5001e08c21b846c47ed051f6c17fc9826d1a)), closes [#7169](https://github.com/aws/aws-cdk/issues/7169)
* cloudformation spec v14.1.0 ([#7822](https://github.com/aws/aws-cdk/issues/7822)) ([e133027](https://github.com/aws/aws-cdk/commit/e1330273fbc700285d737e57a8d20f2857be2f82))
* **s3:** new `s3UrlForObject` method on `IBucket` ([#7508](https://github.com/aws/aws-cdk/issues/7508)) ([8fe4015](https://github.com/aws/aws-cdk/commit/8fe4015a9357623434fb2825e3342ffc145a13f8)), closes [#7507](https://github.com/aws/aws-cdk/issues/7507)
* **stepfunctions:** custom state as an escape hatch ([c498f60](https://github.com/aws/aws-cdk/commit/c498f60d34b5bd01fc95f7999bc605e10edbb717))


### Bug Fixes

* **assets:** invalid fingerprint when 'exclude' captures root directory name ([#7719](https://github.com/aws/aws-cdk/issues/7719)) ([a5c06a3](https://github.com/aws/aws-cdk/commit/a5c06a3a27b39a5315d0cfd0d34b3c1b25cfc464)), closes [#7718](https://github.com/aws/aws-cdk/issues/7718)
* **aws-batch:** gpuCount was ignored in JobDefinition creation ([#7587](https://github.com/aws/aws-cdk/issues/7587)) ([0f1bf23](https://github.com/aws/aws-cdk/commit/0f1bf23817774eb94505a6c68f1daa8a117bbd42))
* **cli:** parameter value reuse is not configurable ([44310c9](https://github.com/aws/aws-cdk/commit/44310c93af939f8aaf9ca4245c944b5c93f61ab7)), closes [#7041](https://github.com/aws/aws-cdk/issues/7041)
* **core:** docs refer to "createNamingScheme" which was renamed to "allocateLogicalId" ([#7840](https://github.com/aws/aws-cdk/issues/7840)) ([d79595d](https://github.com/aws/aws-cdk/commit/d79595d854adf160c0a6395a5f535ee270bbdf69)), closes [#7527](https://github.com/aws/aws-cdk/issues/7527)
* **ecs:** update minHealthyPercent constrain for ec2service using daemon strategy ([#7814](https://github.com/aws/aws-cdk/issues/7814)) ([19e3fd8](https://github.com/aws/aws-cdk/commit/19e3fd800af5a32dfb359f4be4717fbf3adb91df))
* **ecs:** using secret JSON field with fargate task does not fail ([#7317](https://github.com/aws/aws-cdk/issues/7317)) ([cb03a60](https://github.com/aws/aws-cdk/commit/cb03a601599b56539081caf602647d1f431d2d59)), closes [#7272](https://github.com/aws/aws-cdk/issues/7272)
* **eks:** "vendor response doesn't contain attribute" when updating version ([#7830](https://github.com/aws/aws-cdk/issues/7830)) ([8cabae0](https://github.com/aws/aws-cdk/commit/8cabae0a03cc526f5f7fbfebf22978ad88efcb4f)), closes [#7526](https://github.com/aws/aws-cdk/issues/7526) [#7794](https://github.com/aws/aws-cdk/issues/7794)
* **s3:** grantDelete with KMS SSE ([#7528](https://github.com/aws/aws-cdk/issues/7528)) ([c6d1a21](https://github.com/aws/aws-cdk/commit/c6d1a21b09967d787404101829058106ed74852a)), closes [#4380](https://github.com/aws/aws-cdk/issues/4380)
* **secretsmanager:** add kms policy to allow secret to use kms key ([5460717](https://github.com/aws/aws-cdk/commit/54607175115663bd49d8a57cb82b814414e7e78a))

## [1.37.0](https://github.com/aws/aws-cdk/compare/v1.36.0...v1.37.0) (2020-05-05)


### ⚠ BREAKING CHANGES

* **amplify:** `mapSubDomain()` called with an empty string for `prefix` now
maps to the domain root.

### Features

* **amplify:** add SPA redirect custom rule ([#7320](https://github.com/aws/aws-cdk/issues/7320)) ([0ef9883](https://github.com/aws/aws-cdk/commit/0ef98836c0eb583556e59274a464386e7258ca8c))
* **apigatewayv2:** http api ([#6432](https://github.com/aws/aws-cdk/issues/6432)) ([f3219c3](https://github.com/aws/aws-cdk/commit/f3219c310f8c0edbf929bfc9ef1bb7363b1506ae)), closes [#5301](https://github.com/aws/aws-cdk/issues/5301)
* **appsync:** export configured API key ([#7380](https://github.com/aws/aws-cdk/issues/7380)) ([fa8c13c](https://github.com/aws/aws-cdk/commit/fa8c13c753c0a6e195eed313d59ce74f1505cf6e))
* **aws-fsx:** L2 construct for FSx for Lustre ([#6653](https://github.com/aws/aws-cdk/issues/6653)) ([7363912](https://github.com/aws/aws-cdk/commit/7363912eb15d05dcda7b9febdb6aa76463e305b1))
* **cfnspec:** cloudformation spec v14.0.0 ([#7664](https://github.com/aws/aws-cdk/issues/7664)) ([fa21274](https://github.com/aws/aws-cdk/commit/fa2127487cd568d155e03e6f7b78036f857fee7c))
* **cloudwatch:** LogGroup Query Widget ([1275952](https://github.com/aws/aws-cdk/commit/127595214fe653f6881fac84e5ee33002545e780)), closes [#3681](https://github.com/aws/aws-cdk/issues/3681)
* **codebuild:** allow taking the artifact name from the buildspec ([f7d3cd6](https://github.com/aws/aws-cdk/commit/f7d3cd6dccade93354948374a7ff435c978ad44b)), closes [#5955](https://github.com/aws/aws-cdk/issues/5955)
* **core:** move all types from "assets" to "core" ([#7708](https://github.com/aws/aws-cdk/issues/7708)) ([4a84c96](https://github.com/aws/aws-cdk/commit/4a84c960e225ad3db28e3b2ec5da5f70b3b21413))
* **core:** move all types from "aws-cloudformation" to "core" ([#7736](https://github.com/aws/aws-cdk/issues/7736)) ([40fa93a](https://github.com/aws/aws-cdk/commit/40fa93a22ffbdf18b0563d1cef63bbf5814dcc3f)), closes [#4896](https://github.com/aws/aws-cdk/issues/4896) [#7035](https://github.com/aws/aws-cdk/issues/7035) [#7034](https://github.com/aws/aws-cdk/issues/7034)
* **core:** stack termination protection ([#7610](https://github.com/aws/aws-cdk/issues/7610)) ([7ed60b8](https://github.com/aws/aws-cdk/commit/7ed60b8a5d42e93e556e3b6e9ee3618931747ac2)), closes [#1682](https://github.com/aws/aws-cdk/issues/1682)
* **ecr:** support imageScanOnPush when creating the repository ([9df5486](https://github.com/aws/aws-cdk/commit/9df5486306fda01d963f4b1195fe8c8532cc4668)), closes [#7471](https://github.com/aws/aws-cdk/issues/7471)


### Bug Fixes

* **amplify:** cannot map branch to domain root ([#7621](https://github.com/aws/aws-cdk/issues/7621)) ([da7c508](https://github.com/aws/aws-cdk/commit/da7c508a9959dd8a04e3132abf6fe07d87537ead)), closes [#7590](https://github.com/aws/aws-cdk/issues/7590)
* **cdk-assets:** assets archiving corruption ([#7653](https://github.com/aws/aws-cdk/issues/7653)) ([f8eddb8](https://github.com/aws/aws-cdk/commit/f8eddb8ea9dca2ac68883a332b868c98008961e6)), closes [#6925](https://github.com/aws/aws-cdk/issues/6925)
* **cli:** cdk deploy cannot update stacks in REVIEW_IN_PROGRESS status ([#7731](https://github.com/aws/aws-cdk/issues/7731)) ([a52b3e3](https://github.com/aws/aws-cdk/commit/a52b3e33fcebd7534ad7cc0f8654599b3f8782b1)), closes [#6674](https://github.com/aws/aws-cdk/issues/6674)
* **cli:** CLI can't be used in Lambda Function ([0e96415](https://github.com/aws/aws-cdk/commit/0e96415ea9f365db93aa4b26e7464096b3d62af2)), closes [#7530](https://github.com/aws/aws-cdk/issues/7530)
* **cli:** CLI ignores profile in cdk.json ([#7398](https://github.com/aws/aws-cdk/issues/7398)) ([6784dc3](https://github.com/aws/aws-cdk/commit/6784dc30b77c2508fab06f461cdda72a2fc9837c)), closes [#3007](https://github.com/aws/aws-cdk/issues/3007)
* **cloudwatch:** Alarm can't use `MathExpression` without submetrics ([b59aed0](https://github.com/aws/aws-cdk/commit/b59aed01c2a7a6ddcac1cd6530f0603707594a9c)), closes [#7155](https://github.com/aws/aws-cdk/issues/7155)
* **ec2:** `new Instance` fails in lookup Vpc ([3161de8](https://github.com/aws/aws-cdk/commit/3161de872e51e25cecbbdf2b0ea18391856e87b1)), closes [#7580](https://github.com/aws/aws-cdk/issues/7580)
* **ec2:** `Vpc.fromLookup()` does not work in unit tests ([e869a0d](https://github.com/aws/aws-cdk/commit/e869a0dedc93d64141a11a7006a58eec5222fdc4)), closes [#6045](https://github.com/aws/aws-cdk/issues/6045)
* **ec2:** can't add VPN connections to a VPC progressively ([9498e05](https://github.com/aws/aws-cdk/commit/9498e057e2e4aee0649ca48bfdb906d004cb9c81))
* **ec2:** default gateway endpoint fails without private subnets ([c475783](https://github.com/aws/aws-cdk/commit/c4757831bc5ccb8ac510694d083f17d39a423033)), closes [#7619](https://github.com/aws/aws-cdk/issues/7619)
* **ec2:** NAT instances don't route ICMP or UDP ([a93534f](https://github.com/aws/aws-cdk/commit/a93534f42cb6ecf8bdde1987f0d85919c55dbacb)), closes [#7459](https://github.com/aws/aws-cdk/issues/7459)
* **eks:** impossible to define multiple spot capacities ([be6666b](https://github.com/aws/aws-cdk/commit/be6666b0fe5743c9f8a7747768101fb86380eb38)), closes [#7136](https://github.com/aws/aws-cdk/issues/7136) [#7524](https://github.com/aws/aws-cdk/issues/7524)
* **eks:** missing required permission for fargate profile ([723813f](https://github.com/aws/aws-cdk/commit/723813faac9c999c2f3504388d0dc393b0b25b7e)), closes [#7614](https://github.com/aws/aws-cdk/issues/7614)
* **eks:** ssm path for amazon linux 2 gpu ami is invalid ([#7672](https://github.com/aws/aws-cdk/issues/7672)) ([5861d18](https://github.com/aws/aws-cdk/commit/5861d186893d1b6df27e4a200acfda63313f9da5)), closes [#6891](https://github.com/aws/aws-cdk/issues/6891)
* **iam:** principal with implicit conditions overwrite each other ([e72c353](https://github.com/aws/aws-cdk/commit/e72c3538280dc2056a8097d9e4483229d0bc0f42)), closes [#3227](https://github.com/aws/aws-cdk/issues/3227)
* **logs:** grants don't work on imported LogGroups ([5a1a929](https://github.com/aws/aws-cdk/commit/5a1a929db7eb8f7be4ad973abc1cccda1cb24d23)), closes [#7096](https://github.com/aws/aws-cdk/issues/7096)
* **rds:** Cluster does not work with imported VPC ([#7666](https://github.com/aws/aws-cdk/issues/7666)) ([95c66a7](https://github.com/aws/aws-cdk/commit/95c66a7500efd83ae4d840c97b0e7663689fe401)), closes [#6115](https://github.com/aws/aws-cdk/issues/6115)

## [1.36.1](https://github.com/aws/aws-cdk/compare/v1.36.0...v1.36.1) (2020-04-29)

### Bug Fixes

* multiple breakages due to jest version upgrade ([#7667](https://github.com/aws/aws-cdk/pull/7667)) ([e18312](https://github.com/aws/aws-cdk/commit/e18312c4de42857d893913bd3124bd06bb16982e)), closes [#7657](https://github.com/aws/aws-cdk/issues/7657)

## [1.36.0](https://github.com/aws/aws-cdk/compare/v1.35.0...v1.36.0) (2020-04-28)


### ⚠ BREAKING CHANGES

* **stepfunctions-tasks:** `payload` in RunLambdaTask is now of type `TaskInput` and has a default of the state input instead of the empty object.
You can migrate your current assignment to payload by supplying it to the `TaskInput.fromObject()` API

### Features

* **apigateway:** gateway responses ([#7441](https://github.com/aws/aws-cdk/issues/7441)) ([b0a65c1](https://github.com/aws/aws-cdk/commit/b0a65c1b7bb4532722adf20a10f653fff88d152a)), closes [#7071](https://github.com/aws/aws-cdk/issues/7071)
* **aws-ecs:** add support for IPC and PID Mode for EC2 Task Definitions ([1ee629e](https://github.com/aws/aws-cdk/commit/1ee629e418fccec30b8a94e43682ed2c47ddd8da)), closes [#7186](https://github.com/aws/aws-cdk/issues/7186)


### Bug Fixes

* **apigateway:** authorizer is not attached to RestApi across projects ([#7596](https://github.com/aws/aws-cdk/issues/7596)) ([1423c53](https://github.com/aws/aws-cdk/commit/1423c53fec4172ba21946ca6d33f63fc7a9d8337)), closes [#7377](https://github.com/aws/aws-cdk/issues/7377)
* **cli:** can't bootstrap environment not in app ([9566cca](https://github.com/aws/aws-cdk/commit/9566cca8c77b99922e8214567b87fa5680fe06ef))
* **cli:** context keys specified in `cdk.json` get moved to `cdk.context.json` ([022eb66](https://github.com/aws/aws-cdk/commit/022eb66b85abba46c1a4d980259f440c31036d57)), closes [#7399](https://github.com/aws/aws-cdk/issues/7399)
* **dynamodb:** grant() is not available on ITable ([#7618](https://github.com/aws/aws-cdk/issues/7618)) ([3b0a397](https://github.com/aws/aws-cdk/commit/3b0a3977e153e5a6a17967dfab360926712bff9e)), closes [#7473](https://github.com/aws/aws-cdk/issues/7473)
* **dynamodb:** grantXxx() does not grant in replication regions ([98429e0](https://github.com/aws/aws-cdk/commit/98429e019e347459c74cccf3bb99994e58341377)), closes [#7362](https://github.com/aws/aws-cdk/issues/7362)
* **eks:** version update completes prematurely ([#7526](https://github.com/aws/aws-cdk/issues/7526)) ([307c8b0](https://github.com/aws/aws-cdk/commit/307c8b021d5c00c1d675f4ce3cba8004a6a4a0a8)), closes [#7457](https://github.com/aws/aws-cdk/issues/7457)
* **stepfunctions-tasks:** cannot specify part of execution data or task context as input to the `RunLambda` service integration ([#7428](https://github.com/aws/aws-cdk/issues/7428)) ([a1d9884](https://github.com/aws/aws-cdk/commit/a1d98845a209e7ed650d8adaaa1a724a3109b6a2)), closes [#7371](https://github.com/aws/aws-cdk/issues/7371)

## [1.35.0](https://github.com/aws/aws-cdk/compare/v1.34.1...v1.35.0) (2020-04-23)


### ⚠ BREAKING CHANGES

* **assets:** `cdk deploy` now needs `s3:ListBucket` instead of `s3:HeadObject`.
* **efs:** Exported types no longer have the `Efs` prefix.
* **efs:** `provisionedThroughputInMibps` property is renamed to `provisionedThroughputPerSecond` and has the type `Size`.
* **efs:** The property `fileSystemID` is now renamed to `fileSystemId` in the now named `FileSystemAttributes` (previously, `EfsFileSystemAttributes`).
* **efs:** `LifecyclePolicyProperty` is now renamed to `LifecyclePolicy`.

### Features

* **backup:** Vault, Plan and Selection ([#7074](https://github.com/aws/aws-cdk/issues/7074)) ([c8aa92d](https://github.com/aws/aws-cdk/commit/c8aa92d1a0b87afc380fecaf91fc1048a74f670f))
* **cfnspec:** cloudformation spec v13.0.0 ([#7504](https://github.com/aws/aws-cdk/issues/7504)) ([6903869](https://github.com/aws/aws-cdk/commit/6903869def944f8100c8eef51dd7145c181984e2))
* **cloudtrail:** Lambda Function data events ([4a70138](https://github.com/aws/aws-cdk/commit/4a70138faf2e863be37a66bec23ed29a784b486a))
* **cognito:** user pool domain ([#7224](https://github.com/aws/aws-cdk/issues/7224)) ([feadd6c](https://github.com/aws/aws-cdk/commit/feadd6cb643b415ae002191ba2cb4622221a5af6)), closes [#6787](https://github.com/aws/aws-cdk/issues/6787)
* **stepfunctions:** retrieve all reachable states from a given state in a state machine definition ([#7324](https://github.com/aws/aws-cdk/issues/7324)) ([ac3b330](https://github.com/aws/aws-cdk/commit/ac3b330c71ef258afd145b86fd90a06db5d1c990)), closes [#7256](https://github.com/aws/aws-cdk/issues/7256)


### Bug Fixes

* **assets:** infrequent "ValidationError: S3 error: Access Denied" ([#7556](https://github.com/aws/aws-cdk/issues/7556)) ([00c9deb](https://github.com/aws/aws-cdk/commit/00c9deb975fe794eef9003cd26a6453abc514928)), closes [#6430](https://github.com/aws/aws-cdk/issues/6430) [#7553](https://github.com/aws/aws-cdk/issues/7553)
* **route53:** cannot add tags to `HostedZone` ([#7531](https://github.com/aws/aws-cdk/issues/7531)) ([2729804](https://github.com/aws/aws-cdk/commit/272980492dc6b98d71ce9c3b23cab38f656dc632)), closes [#7445](https://github.com/aws/aws-cdk/issues/7445)
* **efs:** drop Efs prefix from all exported types ([#7481](https://github.com/aws/aws-cdk/issues/7481)) ([ddd47cd](https://github.com/aws/aws-cdk/commit/ddd47cd7e0735424d2e47891c32e4b7813035067))

## [1.34.1](https://github.com/aws/aws-cdk/compare/v1.34.0...v1.34.1) (2020-04-22)


### Bug Fixes

* **cli:** Javascript init-templates cannot be synthesized ([ce4b8dd](https://github.com/aws/aws-cdk/commit/ce4b8dde205ca03891e0aee21b473b974d674154)), closes [#7356](https://github.com/aws/aws-cdk/issues/7356)

## [1.34.0](https://github.com/aws/aws-cdk/compare/v1.33.1...v1.34.0) (2020-04-21)


### ⚠ BREAKING CHANGES

* **glue:** `DateFormat` constant names are now **UPPERCASE** (`JSON, AVRO, LOGSTASH, ...`)

### Features

* **cognito:** add mutable property in cognito user pool custom attribute ([#7190](https://github.com/aws/aws-cdk/issues/7190)) ([16e85df](https://github.com/aws/aws-cdk/commit/16e85df5c3077496d3ebe7c4fa8230514756c027)), closes [#7011](https://github.com/aws/aws-cdk/issues/7011) [#7011](https://github.com/aws/aws-cdk/issues/7011) [#7011](https://github.com/aws/aws-cdk/issues/7011) [#7011](https://github.com/aws/aws-cdk/issues/7011)
* **ecs:** add Fargate 1.4.0 support ([#7267](https://github.com/aws/aws-cdk/issues/7267)) ([5c83a46](https://github.com/aws/aws-cdk/commit/5c83a46920525d9e3891794d1f4c41f0e8e7982c))


### Bug Fixes

* **cloudwatch:** can't override Alarm statistic with percentile ([d5918c3](https://github.com/aws/aws-cdk/commit/d5918c330b6770b84efc5417ce1109a68c22119b)), closes [#7341](https://github.com/aws/aws-cdk/issues/7341)
* **glue:** DataFormat constants are not visible in non-JS languages ([#7458](https://github.com/aws/aws-cdk/issues/7458)) ([e5d4c31](https://github.com/aws/aws-cdk/commit/e5d4c31f4580218d39473258342dafda8d64338a))
* **monocdk:** assert package has incorrect imports ([#7404](https://github.com/aws/aws-cdk/issues/7404)) ([825c9e1](https://github.com/aws/aws-cdk/commit/825c9e1b443568c5d898b3fa0c543d5a7747396c))
* **stepfunctions-tasks:** encryptionKey is Key instead of IKey ([#7429](https://github.com/aws/aws-cdk/issues/7429)) ([f1e2c67](https://github.com/aws/aws-cdk/commit/f1e2c675b1234a4806ce88f7416b1b9753a347fa))

## [1.33.1](https://github.com/aws/aws-cdk/compare/v1.33.0...v1.33.1) (2020-04-19)


### Bug Fixes

* jsii version conflict due to upgrade from v1.1.0 to v1.3.0 ([f2fdfe5](https://github.com/aws/aws-cdk/commit/f2fdfe57759248eec23d6e8579b367058a619a97)), closes [#7426](https://github.com/aws/aws-cdk/issues/7426)

## [1.33.0](https://github.com/aws/aws-cdk/compare/v1.32.2...v1.33.0) (2020-04-17)


### ⚠ BREAKING CHANGES

* **kinesis:** `grantRead()` API  no longer provides permissions to `kinesis:DescribeStream` as it provides permissions to `kinesis:DescribeStreamSummary` and `kinesis:SubscribeToShard` in it's place. If it's still desired, it can be added through the `grant()` API on the stream.
* **kinesis:** `grantWrite()` API no longer has `DescribeStream` permissions as it has been replaced by `ListShards` for shard discovery

### Features

* **cfnspec:** cloudformation spec v12.2.0 ([#7248](https://github.com/aws/aws-cdk/issues/7248)) ([1475d5a](https://github.com/aws/aws-cdk/commit/1475d5a0d6a7b317f4cc1603ca17b030c4b2c987))
* Support AppSync DataSource type: NONE ([f35a4db](https://github.com/aws/aws-cdk/commit/f35a4db7fd6a5794f5c5449f226610915c03c053))
* **cfnspec:** cloudformation spec v12.3.0 ([#7359](https://github.com/aws/aws-cdk/issues/7359)) ([a80918f](https://github.com/aws/aws-cdk/commit/a80918f3403f2388a1baeb383f42a3f3f8974436))
* **ec2:** expose blockDevices in CommonAutoScalingGroupProps ([#7291](https://github.com/aws/aws-cdk/issues/7291)) ([5fe4480](https://github.com/aws/aws-cdk/commit/5fe4480c75aa9ab7ce95780731ae7bf3ae17815a))
* **ec2:** filtering selected subnets by availability zone ([2d3e612](https://github.com/aws/aws-cdk/commit/2d3e61225c7e9d4964e57212c1f6b7e0116717ed))
* **eks:** support a new option to create `bottlerocket` capacity. ([e9f691f](https://github.com/aws/aws-cdk/commit/e9f691f9615a5b150ddc0462e70965d5379881a5)), closes [#7268](https://github.com/aws/aws-cdk/issues/7268)
* **kinesis:** `grantRead` now allows the `ListShards` action and `grant` is now public ([#6141](https://github.com/aws/aws-cdk/issues/6141)) ([563fba4](https://github.com/aws/aws-cdk/commit/563fba4e067269662f4f922ace1679ac467d5043)), closes [#3357](https://github.com/aws/aws-cdk/issues/3357)
* **kinesis:** add `grant` API to IStream to add permissions to a Stream ([#7354](https://github.com/aws/aws-cdk/issues/7354)) ([c223406](https://github.com/aws/aws-cdk/commit/c2234066c437c8dee547e70a2b2bf2ddd298852c))
* **kinesis:** the `aws-kinesis` module is now stable ([#7349](https://github.com/aws/aws-cdk/issues/7349)) ([4ab3ffa](https://github.com/aws/aws-cdk/commit/4ab3ffad23b18f71bc119efbf631fa697e904aa7)), closes [#5874](https://github.com/aws/aws-cdk/issues/5874)
* update "constructs" to 3.x ([#7408](https://github.com/aws/aws-cdk/issues/7408)) ([8f8d20f](https://github.com/aws/aws-cdk/commit/8f8d20f88d4bceb629dc37600b6f5b13ad8d04d1)), closes [#6978](https://github.com/aws/aws-cdk/issues/6978)


### Bug Fixes

* **appsync:** Don't create serviceRole for datasource type NONE ([6d1cb11](https://github.com/aws/aws-cdk/commit/6d1cb11b1a4481667fbb044f280df1edbe729401)), closes [#7360](https://github.com/aws/aws-cdk/issues/7360)
* **cli:** --app command does not work when executing a command without arguments ([#7249](https://github.com/aws/aws-cdk/issues/7249)) ([994414c](https://github.com/aws/aws-cdk/commit/994414ce36483659cede0b66ad91d897a2415c8d)), closes [#6930](https://github.com/aws/aws-cdk/issues/6930)
* **cli:** parameter values with multiple `=` symbols get truncated ([#7226](https://github.com/aws/aws-cdk/issues/7226)) ([b7ddf5b](https://github.com/aws/aws-cdk/commit/b7ddf5badeadb27e59f987aafa8c2a30660b828e)), closes [#7246](https://github.com/aws/aws-cdk/issues/7246)
* **cloudwatch:** Alarm annotation ignores datapointsToAlarm  ([#7202](https://github.com/aws/aws-cdk/issues/7202)) ([92fb853](https://github.com/aws/aws-cdk/commit/92fb853ea7d31e7bf3d60bd50ce18b95c4189da6)), closes [#7152](https://github.com/aws/aws-cdk/issues/7152)
* **cloudwatch:** Dashboard Spacer doesn't require empty props object ([ca2f923](https://github.com/aws/aws-cdk/commit/ca2f923e0e3e8bc7643ba148546b7d66f4c5d174))
* new IAM Condition type is unusable in Java ([#7270](https://github.com/aws/aws-cdk/issues/7270)) ([ffb2e1e](https://github.com/aws/aws-cdk/commit/ffb2e1e8830d8345171552b4f420e65c47dae7b8))
* **core:** unable to reference resources across multiple nested stacks ([#7187](https://github.com/aws/aws-cdk/issues/7187))  ([000f0c2](https://github.com/aws/aws-cdk/commit/000f0c2286b9d1b2fd2cf6760dc32d7ecfc7a0b9)), closes [#6473](https://github.com/aws/aws-cdk/issues/6473) [#7059](https://github.com/aws/aws-cdk/issues/7059) [#7059](https://github.com/aws/aws-cdk/issues/7059) [#5888](https://github.com/aws/aws-cdk/issues/5888)
* **ec2:** can reference VpcEndpointService id and service name ([1007a22](https://github.com/aws/aws-cdk/commit/1007a2237006f10dab16e3c9998cec1299eaf952))
* **efs:** support tagging + filesystem naming ([3dd8058](https://github.com/aws/aws-cdk/commit/3dd805825d30d23f0a9718a2cb542a986e81b26d))
* **eks:**  missing permissions to add and remove tags when creating EKS cluster resource ([#7302](https://github.com/aws/aws-cdk/issues/7302)) ([b14172d](https://github.com/aws/aws-cdk/commit/b14172d2ac86da55a0ebf7efdbe25b6ef35f832c)), closes [#7163](https://github.com/aws/aws-cdk/issues/7163)
* **eks:** unable to create KubernetesResources in another stack ([#7322](https://github.com/aws/aws-cdk/issues/7322)) ([54129c8](https://github.com/aws/aws-cdk/commit/54129c88de0ac53ae29b1bc456d8e73e3b81a564)), closes [#7231](https://github.com/aws/aws-cdk/issues/7231)
* **elbv2:** imported LoadBalancer ignores pathPatterns prop ([8ed2e0c](https://github.com/aws/aws-cdk/commit/8ed2e0cb47e084a7dbd32329de472c519ab3ac6d)), closes [#7303](https://github.com/aws/aws-cdk/issues/7303)
* **route53-patterns:** HttpsRedirect redirects to index.html ([278fe29](https://github.com/aws/aws-cdk/commit/278fe2918990b7a64fcc24a49d5944c14ed9c5fa)), closes [/github.com/aws/aws-cdk/issues/5700#issuecomment-614112813](https://github.com/aws//github.com/aws/aws-cdk/issues/5700/issues/issuecomment-614112813) [/github.com/aws/aws-cdk/issues/5700#issuecomment-614816819](https://github.com/aws//github.com/aws/aws-cdk/issues/5700/issues/issuecomment-614816819)
* **s3:** allow accessLogsPrefix without accessLogsBucket ([#6709](https://github.com/aws/aws-cdk/issues/6709)) ([4c199f6](https://github.com/aws/aws-cdk/commit/4c199f6578ee36d7a8841b640d015f360331ec51)), closes [#6599](https://github.com/aws/aws-cdk/issues/6599)

## [1.32.2](https://github.com/aws/aws-cdk/compare/v1.32.1...v1.32.2) (2020-04-10)

### Bug Fixes

* **cli:** profile AssumeRole credentials don't work via proxy ([#7292](https://github.com/aws/aws-cdk/pull/7292))

## [1.32.1](https://github.com/aws/aws-cdk/compare/v1.32.0...v1.32.1) (2020-04-09)


### Bug Fixes

* **iam:** new IAM Condition type is unusable in Java ([#7270](https://github.com/aws/aws-cdk/issues/7270)) ([85f606a](https://github.com/aws/aws-cdk/commit/85f606ad13e4e51b9f66330379a55ef76310a8ca))

## [1.32.0](https://github.com/aws/aws-cdk/compare/v1.31.0...v1.32.0) (2020-04-07)


### ⚠ BREAKING CHANGES

* **cognito:** `UserPoolClient` construct no longer has the property
`userPoolClientClientSecret`. The functionality to retrieve the client
secret never existed in CloudFormation, so this property was not
working in the first place.
* **cognito:** The `userPoolClientName` property on the `UserPoolClient`
construct will throw an error if client name was not configured on the
`UserPoolClient` during initialization. This property was previously
incorrectly configured and was returning a not-implemented message from
CloudFormation every time.
* **amplify:** use the `sourceCodeProvider` prop to connect your app to a source
code provider. The props `repository`, `accessToken` and `oauthToken` do not exist
anymore in `AppProps`.
* **kinesis:** `retentionPeriodHours` is now `retentionPeriod` and of type `Duration`
* **eks:** `Cluster` now creates a default managed nodegroup as its default capacity. Set the new cluster property `defaultCapacityType` to `DefaultCapacityType.EC2` to preserve `EC2` as its default capacity.
* **cognito:** `add*Trigger()` methods to configure
lambda triggers has now been replaced  by a single
`addTrigger()` method.
* **cognito:** `addTrigger()` method will fail if a trigger
was already configured for that user pool operation.
* **iam:** methods accepting iam conditions now requires passing `{[key: string]: any}` instead of plain `any`. You were always supposed to pass a map/dictionary in these locations, but the type system didn't enforce it. It now does.

### Features

* **amplify:** source code providers ([#6921](https://github.com/aws/aws-cdk/issues/6921)) ([3dc3d75](https://github.com/aws/aws-cdk/commit/3dc3d75b17855d344b45a1dc48eb6b422237bff6)), closes [#6818](https://github.com/aws/aws-cdk/issues/6818)
* **apigateway:** access logging ([#6559](https://github.com/aws/aws-cdk/issues/6559)) ([7484935](https://github.com/aws/aws-cdk/commit/7484935fb3935997638e22241df7614f76097733)), closes [#6501](https://github.com/aws/aws-cdk/issues/6501)
* **apigateway:** auto-create RequestValidator from options to addMethod() ([#6780](https://github.com/aws/aws-cdk/issues/6780)) ([573464d](https://github.com/aws/aws-cdk/commit/573464d0b214f943fa31fdfa5af0091adc593de6)), closes [#6193](https://github.com/aws/aws-cdk/issues/6193)
* **applicationautoscaling:** add PredefinedMetric for Lambda provisioned concurrency autoscaling ([#6394](https://github.com/aws/aws-cdk/issues/6394)) ([45b68d5](https://github.com/aws/aws-cdk/commit/45b68d5c7905559b70ef41867060ea42f03a3015)), closes [#6369](https://github.com/aws/aws-cdk/issues/6369)
* **aws-codebuild:** add from codebuild image option ([#7117](https://github.com/aws/aws-cdk/issues/7117)) ([de8e670](https://github.com/aws/aws-cdk/commit/de8e670159065e1c1fe6d69a51c1596755dcbcc6)), closes [#2606](https://github.com/aws/aws-cdk/issues/2606)
* **aws-codebuild:** add ProjectFileSystemLocation property to codebuild ([#6539](https://github.com/aws/aws-cdk/issues/6539)) ([2195cc2](https://github.com/aws/aws-cdk/commit/2195cc20840138eb29836e3b38f9950d42eef008)), closes [#6533](https://github.com/aws/aws-cdk/issues/6533)
* **bootstrap:** require `aws:SecureTransport` for staging bucket ([#7192](https://github.com/aws/aws-cdk/issues/7192)) ([ed106ea](https://github.com/aws/aws-cdk/commit/ed106eab36835fa7cb0140cc1c6971932ede5f5e))
* **cfnspec:** cloudformation spec v11.6.0 ([#6995](https://github.com/aws/aws-cdk/issues/6995)) ([9a552c2](https://github.com/aws/aws-cdk/commit/9a552c275ee011fd794b27735503d139f538f70a))
* **cli:** write stack outputs to a file ([#7020](https://github.com/aws/aws-cdk/issues/7020)) ([75d5ee9](https://github.com/aws/aws-cdk/commit/75d5ee9e41935a9525fa6cfe5a059398d0a799cd)), closes [#1773](https://github.com/aws/aws-cdk/issues/1773)
* **codebuild:** expose aws/windows/base:2.0 image ([#7004](https://github.com/aws/aws-cdk/issues/7004)) ([9374642](https://github.com/aws/aws-cdk/commit/937464272d5c11033b67b970fea039bfc35f2d12))
* **codebuild:** support AL2 3.0 & Standard 4.0 ([#6968](https://github.com/aws/aws-cdk/issues/6968)) ([3254c5d](https://github.com/aws/aws-cdk/commit/3254c5d09c3708a904cc1f1a0344c32d807d6a74))
* **cognito:** import an existing user pool client ([#7091](https://github.com/aws/aws-cdk/issues/7091)) ([abc2144](https://github.com/aws/aws-cdk/commit/abc2144a5e1ed3e18c1b6d1631f26ab7e29d1760))
* **cognito:** user pool - OAuth2.0 authentication ([#7141](https://github.com/aws/aws-cdk/issues/7141)) ([09852d0](https://github.com/aws/aws-cdk/commit/09852d05242fff9ba9080df9121537f81af9d131))
* **core:** `Size` unit representing digital information quantity ([#6940](https://github.com/aws/aws-cdk/issues/6940)) ([22a560d](https://github.com/aws/aws-cdk/commit/22a560dd4a49d74a9ff217c27c77a7e03d7b38de))
* **ec2:** EFS interface VPC endpoint ([#6961](https://github.com/aws/aws-cdk/issues/6961)) ([6e61889](https://github.com/aws/aws-cdk/commit/6e618898a3d742d7d47da78dd6cbf2ec21b24f92)), closes [#6960](https://github.com/aws/aws-cdk/issues/6960)
* **ecs:** secret JSON key for environment variables ([#6435](https://github.com/aws/aws-cdk/issues/6435)) ([97959f6](https://github.com/aws/aws-cdk/commit/97959f6ba40a4a576fc914772206623900d72add)), closes [#5665](https://github.com/aws/aws-cdk/issues/5665)
* **eks:** managed nodegroup support ([#6759](https://github.com/aws/aws-cdk/issues/6759)) ([74169bf](https://github.com/aws/aws-cdk/commit/74169bf57c7c21aabb1f9b4a6cfac260b77d4b5a)), closes [#5086](https://github.com/aws/aws-cdk/issues/5086)
* **elbv2:** health checks for Lambda targets ([#7023](https://github.com/aws/aws-cdk/issues/7023)) ([cf8c831](https://github.com/aws/aws-cdk/commit/cf8c83126cbcc0e6f14ba59a3ee32e8567bc5ac2))
* **iam:** add arbitrary conditions to existing principals ([#7015](https://github.com/aws/aws-cdk/issues/7015)) ([64bad91](https://github.com/aws/aws-cdk/commit/64bad91736da5576f212dae08bd1aa3f9414741c)), closes [#5855](https://github.com/aws/aws-cdk/issues/5855)
* **kinesis:** stream encryption with the Kinesis master key ([#7057](https://github.com/aws/aws-cdk/issues/7057)) ([bded683](https://github.com/aws/aws-cdk/commit/bded68336265a4c77804726208d3638fc5cbd260)), closes [#751](https://github.com/aws/aws-cdk/issues/751)
* **kinesis:** streams are encrypted by default ([#7102](https://github.com/aws/aws-cdk/issues/7102)) ([d6ecf44](https://github.com/aws/aws-cdk/commit/d6ecf44e84cb326bcbfe48583fdae66829a86adb))
* **lambda:** .net core 3.1 runtime ([#7105](https://github.com/aws/aws-cdk/issues/7105)) ([ca2585c](https://github.com/aws/aws-cdk/commit/ca2585c99e1f81d45b8bf835638f65a311fbbf9a))
* **lambda:** currentVersion, version.addAlias() ([#6771](https://github.com/aws/aws-cdk/issues/6771)) ([c94ce62](https://github.com/aws/aws-cdk/commit/c94ce62bc71387d031cf291dbce40243feb50e83)), closes [#6750](https://github.com/aws/aws-cdk/issues/6750) [#5334](https://github.com/aws/aws-cdk/issues/5334)
* **lambda:** ruby 2.7 runtime ([#7024](https://github.com/aws/aws-cdk/issues/7024)) ([4994e0d](https://github.com/aws/aws-cdk/commit/4994e0de8f4681eb49a174b903236d15d32372ba)), closes [#6979](https://github.com/aws/aws-cdk/issues/6979)
* cloudformation spec v12.0.0 ([#7113](https://github.com/aws/aws-cdk/issues/7113)) ([1956ded](https://github.com/aws/aws-cdk/commit/1956ded4eb75613d46a3ea163c3041f402d98fa5))
* Support passing AssetOptions ([#7099](https://github.com/aws/aws-cdk/issues/7099)) ([3925d9a](https://github.com/aws/aws-cdk/commit/3925d9aee3b408a3b2160bff5306cb80a0a9a3ab))
* **rds:** aurora - iam role to import and export data from s3 ([#6611](https://github.com/aws/aws-cdk/issues/6611)) ([aa60f89](https://github.com/aws/aws-cdk/commit/aa60f8901257bcf7de4db0d8207661ce70d6c42a)), closes [#6610](https://github.com/aws/aws-cdk/issues/6610)
* **rds:** database instance - auto scale allocated storage ([#6788](https://github.com/aws/aws-cdk/issues/6788)) ([22ffae3](https://github.com/aws/aws-cdk/commit/22ffae337b15476b4aad32c6e4f6d1c14c0eb347)), closes [#6666](https://github.com/aws/aws-cdk/issues/6666)
* **stepfunctions:** execution history logging options ([#6933](https://github.com/aws/aws-cdk/issues/6933)) ([adb6954](https://github.com/aws/aws-cdk/commit/adb69542ec726288aee477642747d060a9965842)), closes [#5754](https://github.com/aws/aws-cdk/issues/5754)
* **stepfunctions-tasks:** dynamodb tasks ([#6654](https://github.com/aws/aws-cdk/issues/6654)) ([435b66f](https://github.com/aws/aws-cdk/commit/435b66f2c4421193590e3fdf2e13d87445e25044)), closes [#6468](https://github.com/aws/aws-cdk/issues/6468)


### Bug Fixes

* **acm-certificatemanager:** DnsValidatedCertificateHandler support for `SubjectAlternativeNames` ([#7050](https://github.com/aws/aws-cdk/issues/7050)) ([a711c01](https://github.com/aws/aws-cdk/commit/a711c0167de8c41796ee20a0b85b763bdfa4a643)), closes [#4659](https://github.com/aws/aws-cdk/issues/4659)
* **aws-ecs-patterns:** revert commit f31f4e1 ([#6987](https://github.com/aws/aws-cdk/issues/6987)) ([0af2d2e](https://github.com/aws/aws-cdk/commit/0af2d2eac4be3a6af5e327e79624a5a46af24ebd))
* **aws-kinesis:** test assume order between stacks ([#7065](https://github.com/aws/aws-cdk/issues/7065)) ([17aab37](https://github.com/aws/aws-cdk/commit/17aab3723f5e4ae8b06dac832774d457909722f8))
* **cli:** can't use credential providers for stacks with assets ([#7022](https://github.com/aws/aws-cdk/issues/7022)) ([afd7045](https://github.com/aws/aws-cdk/commit/afd70453de70e8e54bfd941404efda74d594e0e6)), closes [#7005](https://github.com/aws/aws-cdk/issues/7005)
* **cloudtrail:** include s3KeyPrefix in bucket policy resource ([#7053](https://github.com/aws/aws-cdk/issues/7053)) ([b49881f](https://github.com/aws/aws-cdk/commit/b49881f4a21e02491088961860ea853428f49000)), closes [#6741](https://github.com/aws/aws-cdk/issues/6741)
* **cognito:** user pool - `passwordPolicy.minLength` is not optional in all cases ([#6971](https://github.com/aws/aws-cdk/issues/6971)) ([49cdd8f](https://github.com/aws/aws-cdk/commit/49cdd8f198f6d797130bde0c15783fc77e6084f5))
* **dynamodb:** cannot use attribute as key in a GSI, non-key in another ([#7075](https://github.com/aws/aws-cdk/issues/7075)) ([a6bd34f](https://github.com/aws/aws-cdk/commit/a6bd34fe6ef0831fdca89063348a6965848c7555)), closes [#4398](https://github.com/aws/aws-cdk/issues/4398)
* **ecs:** default Service throws in a VPC without private subnets ([#7188](https://github.com/aws/aws-cdk/issues/7188)) ([0ef6a95](https://github.com/aws/aws-cdk/commit/0ef6a95b19e6001c62bbefbdf867dadcc4ab1f89)), closes [#7062](https://github.com/aws/aws-cdk/issues/7062)
* **events:** Batch target does not work ([#7191](https://github.com/aws/aws-cdk/issues/7191)) ([6f00783](https://github.com/aws/aws-cdk/commit/6f00783c4ffafe7a74609a76544232689b9cca1b)), closes [#7137](https://github.com/aws/aws-cdk/issues/7137)
* **kinesis:** retention period does not use Duration type ([#7037](https://github.com/aws/aws-cdk/issues/7037)) ([1186227](https://github.com/aws/aws-cdk/commit/1186227b01e73cb05425549aeac88630c9a5ff58)), closes [#7036](https://github.com/aws/aws-cdk/issues/7036)
* **rewrite-imports:** incorrect main in package.json ([#7021](https://github.com/aws/aws-cdk/issues/7021)) ([2bf85b3](https://github.com/aws/aws-cdk/commit/2bf85b3e24be27a1f3fe5772b9a8646277615be5))
* **stepfunctions-tasks:** batch job - can not use task input as array size ([#7008](https://github.com/aws/aws-cdk/issues/7008)) ([923d2a1](https://github.com/aws/aws-cdk/commit/923d2a145e9090658fba5e922f99340f0f94347b)), closes [#6922](https://github.com/aws/aws-cdk/issues/6922)
* **stepfunctions-tasks:** confusion between multiple ways to run a Lambda ([#6796](https://github.com/aws/aws-cdk/issues/6796)) ([7485448](https://github.com/aws/aws-cdk/commit/74854488f1c5d9a479bd18aceda2c1817a5e201c)), closes [#4801](https://github.com/aws/aws-cdk/issues/4801)


* **cognito:** clean up and document triggers ([#6816](https://github.com/aws/aws-cdk/issues/6816)) ([32834cb](https://github.com/aws/aws-cdk/commit/32834cb9a33ec053cf3efb7a54efba9b2c0b5131))

## [1.31.0](https://github.com/aws/aws-cdk/compare/v1.30.0...v1.31.0) (2020-03-24)


### ⚠ BREAKING CHANGES

* .NET Core v3.1 is required with JSII v1.1

### Features

* **cloud9:** Support Cloud9 EC2 Environment  ([#6298](https://github.com/aws/aws-cdk/issues/6298)) ([f50b876](https://github.com/aws/aws-cdk/commit/f50b8769548c34a66cf05079d1ac721c83992840))
* **codepipeline:** add experimental support for the BitBucket source action ([#6756](https://github.com/aws/aws-cdk/issues/6756)) ([95bb1ad](https://github.com/aws/aws-cdk/commit/95bb1ad60e600007421acd6d160e0d7fb9bc0389)), closes [#6710](https://github.com/aws/aws-cdk/issues/6710)
* **eks:** KubernetesPatch ([#6753](https://github.com/aws/aws-cdk/issues/6753)) ([c7fab5b](https://github.com/aws/aws-cdk/commit/c7fab5b29aca518fb6e1c8f2868d915885fedf04)), closes [#6723](https://github.com/aws/aws-cdk/issues/6723)
* **events:** AWS Batch event target ([#6570](https://github.com/aws/aws-cdk/issues/6570)) ([73899a9](https://github.com/aws/aws-cdk/commit/73899a95ffe52c51ff77155fd654c2b4cdef7241))


### Bug Fixes

* **acm:** Allow tokens as a part of the hosted zone name ([#6685](https://github.com/aws/aws-cdk/issues/6685)) ([acfb6ef](https://github.com/aws/aws-cdk/commit/acfb6ef8b5f94c04206c3afc8d12bfaf87c1a650)), closes [#6133](https://github.com/aws/aws-cdk/issues/6133)
* **aws-ecs-patterns:** only create an A record if LB is public ([#6895](https://github.com/aws/aws-cdk/issues/6895)) ([f31f4e1](https://github.com/aws/aws-cdk/commit/f31f4e128d5f9dd8d673ac2a3c28d792d1427dda)), closes [#6702](https://github.com/aws/aws-cdk/issues/6702)
* **cdk-assets:** context path not honored by Docker asset build ([#6957](https://github.com/aws/aws-cdk/issues/6957)) ([1edd507](https://github.com/aws/aws-cdk/commit/1edd5076e8a5b4e2194c73e395d1712f74cd2ba1)), closes [#6954](https://github.com/aws/aws-cdk/issues/6954) [#6814](https://github.com/aws/aws-cdk/issues/6814)
* **cloudwatch:** unhelpful error when reusing metric IDs ([#6892](https://github.com/aws/aws-cdk/issues/6892)) ([60253a3](https://github.com/aws/aws-cdk/commit/60253a319d6f185cf807ca45dac4ce0be4ab5777))
* **cognito:** user pool - link style email verification fails to deploy ([#6938](https://github.com/aws/aws-cdk/issues/6938)) ([b5c60d5](https://github.com/aws/aws-cdk/commit/b5c60d50a6c4fb7e93185c5874a2651ba40d0247)), closes [#6811](https://github.com/aws/aws-cdk/issues/6811)
* **ec2:** spelling error in Instance's subnet selection logic. ([#6752](https://github.com/aws/aws-cdk/issues/6752)) ([564561a](https://github.com/aws/aws-cdk/commit/564561a5462b78bc29cd6d6968abe6b05a670df2))
* **iam:** immutable role cannot be used as a construct ([#6920](https://github.com/aws/aws-cdk/issues/6920)) ([56be032](https://github.com/aws/aws-cdk/commit/56be032149f3e698120f7653e36ef1fea565f952)), closes [#6885](https://github.com/aws/aws-cdk/issues/6885)


* .NET Core 3.1 is required with JSII v1.1 ([#6951](https://github.com/aws/aws-cdk/issues/6951)) ([24f12d6](https://github.com/aws/aws-cdk/commit/24f12d6931fc107cc959404516e5c33001c6f7f5))

## [1.30.0](https://github.com/aws/aws-cdk/compare/v1.29.0...v1.30.0) (2020-03-18)


### Features

* **cloudwatch:** standard set of graph colors ([#6747](https://github.com/aws/aws-cdk/issues/6747)) ([97ae931](https://github.com/aws/aws-cdk/commit/97ae931ea4d8333d1846fc3bc801430b000fa606))


### Bug Fixes

* **core:** IConstruct no longer extends IDependable ([#6794](https://github.com/aws/aws-cdk/issues/6794)) ([19bb16a](https://github.com/aws/aws-cdk/commit/19bb16a0feb5b482223dd193354447065ac06f8f)), closes [#6792](https://github.com/aws/aws-cdk/issues/6792)

## [1.29.0](https://github.com/aws/aws-cdk/compare/v1.28.0...v1.29.0) (2020-03-18)

:rocket: To enable new CDK projects such as [CDK for Kubernetes](https://github.com/awslabs/cdk8s), we have released the **constructs programming model** as an independent library called [constructs](https://github.com/aws/constructs). The `@aws-cdk/core.Construct` class is now a subclass of the base `constructs.Construct`.

### ⚠ BREAKING CHANGES

* **cognito:** `UserPoolAttribute` has been removed. It is no longer
required to defined a `UserPool`.
* **ec2:** if you implemented a custom subclass of `IMachineImage` it must now always return a `userData` object.

### Features

* **cli:** add permissions to the bootstrap action role for `cdk deploy` ([#6684](https://github.com/aws/aws-cdk/issues/6684)) ([52fd078](https://github.com/aws/aws-cdk/commit/52fd078abcc93876aa7423949e1e6090644cf95d))
* **codebuild:** add support for Source Credentials ([#6722](https://github.com/aws/aws-cdk/issues/6722)) ([a6e2d28](https://github.com/aws/aws-cdk/commit/a6e2d288a07b75c2b97c86f90d1d82b850f81620))
* **cognito:** user pool - custom & mandatory standard attributes ([#6487](https://github.com/aws/aws-cdk/issues/6487)) ([6dfb677](https://github.com/aws/aws-cdk/commit/6dfb67726dfc9c70f2fc448fac58eb3b550296a1)), closes [#1747](https://github.com/aws/aws-cdk/issues/1747)
* **cognito:** user pool - MFA, password policy and email settings ([#6717](https://github.com/aws/aws-cdk/issues/6717)) ([cc35dad](https://github.com/aws/aws-cdk/commit/cc35dadacc94bfbdba1d83faa55bf1c4cf534485))
* **core:** the "constructs" module ([#6623](https://github.com/aws/aws-cdk/issues/6623)) ([eded95b](https://github.com/aws/aws-cdk/commit/eded95bc0dac7c292a0093365708aba8c11ca09a))
* **ec2:** availabilityZone is optional when importing subnet ([d10fe67](https://github.com/aws/aws-cdk/commit/d10fe67664f01db568da7f81af12ff647e75fa05)), closes [#6607](https://github.com/aws/aws-cdk/issues/6607)
* **lambda-event-sources:** failure handling for stream event sources  ([#5929](https://github.com/aws/aws-cdk/issues/5929)) ([5028009](https://github.com/aws/aws-cdk/commit/50280092ab2c0a2c8e19177c4a70f8a7c0f3c5fb)), closes [#5236](https://github.com/aws/aws-cdk/issues/5236)


### Bug Fixes

* **aws-ecs-pattern:** allow ScheduledTaskBase to run on a public subnet ([#6624](https://github.com/aws/aws-cdk/issues/6624)) ([b9a1408](https://github.com/aws/aws-cdk/commit/b9a14087c9d7260c71cce9a96718dcb75ece538e)), closes [#6312](https://github.com/aws/aws-cdk/issues/6312)
* SecretValue.secretManager validates non-ARN ids do not contain : ([#6371](https://github.com/aws/aws-cdk/issues/6371)) ([7cb8c3f](https://github.com/aws/aws-cdk/commit/7cb8c3fb6d0c150bf4325ca0f51688806c8f29d1))
* **aws-logs:** remove validation of retentionInDays for unresolved tokens ([#6727](https://github.com/aws/aws-cdk/issues/6727)) ([43a3420](https://github.com/aws/aws-cdk/commit/43a3420c91a3f4989f22d3eda9d7d448658f9aeb)), closes [#6690](https://github.com/aws/aws-cdk/issues/6690)
* **ec2:** MachineImages create appropriate UserData ([7a10f0f](https://github.com/aws/aws-cdk/commit/7a10f0f9b9e8e4c9816a4f28335cca77a915b15f))

## [1.28.0](https://github.com/aws/aws-cdk/compare/v1.27.0...v1.28.0) (2020-03-16)


### ⚠ BREAKING CHANGES

* **batch:** `computeEnvironments` is now required
* **batch:** the `allocationStrategy` property was moved from `ComputeEnvironmentProps` to the `ComputeResources` interface, which is where it semantically belongs.
* **custom-resources:** `getDataString` was renamed to `getResponseField`.
* **custom-resources:** `getData` was renamed to `getResponseFieldReference`.
* **custom-resources:** `catchErrorPattern` was renamed to `ignoreErrorCodesMatching`. In addition, a few synth time validations were added when using this property. See [Error Handling](https://github.com/aws/aws-cdk/tree/master/packages/%40aws-cdk/custom-resources#error-handling-1) for details.
* **custom-resources:** `policyStatements` property was removed in favor of a required `policy` property. Refer to [Execution Policy](https://github.com/aws/aws-cdk/tree/master/packages/%40aws-cdk/custom-resources#execution-policy-1) for more details.

### Features

* **amplify:** App, Branch and Domain ([#5177](https://github.com/aws/aws-cdk/issues/5177)) ([e126048](https://github.com/aws/aws-cdk/commit/e126048ccae3965eb1c65ab748b1e670d75f9e44))
* **apigateway:** authorizationScopes for a Method ([#6502](https://github.com/aws/aws-cdk/issues/6502)) ([3887cd2](https://github.com/aws/aws-cdk/commit/3887cd2d16a5bdf3cfde535e614c475aa0263c6b))
* **apigateway:** DomainName supports SecurityPolicy ([#6374](https://github.com/aws/aws-cdk/issues/6374)) ([e8c2e0c](https://github.com/aws/aws-cdk/commit/e8c2e0c6483d5b245577af64ec535818c522e93b))
* **apigateway:** rate limited API key ([#6509](https://github.com/aws/aws-cdk/issues/6509)) ([040906f](https://github.com/aws/aws-cdk/commit/040906f86899d8429f0429e840ed6642dc0bb527)), closes [#6405](https://github.com/aws/aws-cdk/issues/6405)
* **batch:** ec2 launch template support ([#6602](https://github.com/aws/aws-cdk/issues/6602)) ([2b02693](https://github.com/aws/aws-cdk/commit/2b02693d1432ce7bce5bf0a78fe4a9175dd6ad91))
* **cfnspec:** cloudformation spec v11.3.0 ([#6598](https://github.com/aws/aws-cdk/issues/6598)) ([ee3a530](https://github.com/aws/aws-cdk/commit/ee3a5300eb9ec44b12fec6c70ad018f42e182859))
* **cli:** pass CloudFormation parameters to "cdk deploy" ([#6385](https://github.com/aws/aws-cdk/issues/6385)) ([6551124](https://github.com/aws/aws-cdk/commit/6551124794b63a6b9a1de179fdc9a27ba10e0dfb)), closes [#1237](https://github.com/aws/aws-cdk/issues/1237)
* **core:** duration.toHumanString() ([#6691](https://github.com/aws/aws-cdk/issues/6691)) ([d833bea](https://github.com/aws/aws-cdk/commit/d833bead0fc22bf7eaeb7e369d789e4262b3ee5f))
* **custom-resources:** enforce user opt-in when auto-generating SDK call policies ([0f5c24e](https://github.com/aws/aws-cdk/commit/0f5c24ed23cd2d394ffbab7f883c43a537747777)), closes [#5873](https://github.com/aws/aws-cdk/issues/5873)
* **custom-resources:** log retention for AwsCustomResource ([#6698](https://github.com/aws/aws-cdk/issues/6698)) ([bf5ab69](https://github.com/aws/aws-cdk/commit/bf5ab69fd8c7b25386f7bf5d8cf607f87a22cba4))
* **custom-resources:** module is now stable :) ([#6584](https://github.com/aws/aws-cdk/issues/6584)) ([a2a738c](https://github.com/aws/aws-cdk/commit/a2a738cf5df369b92c4039fc7442adddc2350180))
* **custom-resources:** rename `catchErrorPattern` to `ignoreErrorCodesMatching` ([#6553](https://github.com/aws/aws-cdk/issues/6553)) ([94599f8](https://github.com/aws/aws-cdk/commit/94599f8b95d950dd7efba15c925d7c918ed111ff)), closes [#5873](https://github.com/aws/aws-cdk/issues/5873)
* **custom-resources:** rename `getData*` to `getResponseField*` ([#6556](https://github.com/aws/aws-cdk/issues/6556)) ([d5867b4](https://github.com/aws/aws-cdk/commit/d5867b40e144464e033f24a83947cab0aee93fdb)), closes [#5873](https://github.com/aws/aws-cdk/issues/5873)
* **dynamodb:** expose stream features on ITable ([#6635](https://github.com/aws/aws-cdk/issues/6635)) ([52e8b95](https://github.com/aws/aws-cdk/commit/52e8b957a3750431a5e68e62e860441894f9b68c)), closes [#6344](https://github.com/aws/aws-cdk/issues/6344)
* **efs:** create EFS file systems ([#6373](https://github.com/aws/aws-cdk/issues/6373)) ([a0fb518](https://github.com/aws/aws-cdk/commit/a0fb5187a4b0c74c32333e14af1098b0c1f25705)), closes [#6286](https://github.com/aws/aws-cdk/issues/6286) [#6286](https://github.com/aws/aws-cdk/issues/6286)
* **elbv2:** support pathpattern array ([#6558](https://github.com/aws/aws-cdk/issues/6558)) ([c3ee413](https://github.com/aws/aws-cdk/commit/c3ee41366b3f0a59864decd47d2feea9849fd095)), closes [#6497](https://github.com/aws/aws-cdk/issues/6497)
* **iam:** policy document from json ([#6486](https://github.com/aws/aws-cdk/issues/6486)) ([bf08988](https://github.com/aws/aws-cdk/commit/bf08988f65714a07cf1783285ceb18e025802118))
* **prlinter:** support exempting checks from pr based on a label ([#6693](https://github.com/aws/aws-cdk/issues/6693)) ([77cbe80](https://github.com/aws/aws-cdk/commit/77cbe805c9d82278592db97f08e88414a6f66175))
* **stepfunctions-tasks:** run batch job ([#6396](https://github.com/aws/aws-cdk/issues/6396)) ([de1a36b](https://github.com/aws/aws-cdk/commit/de1a36bb5d4c78e617f3b78a06b42dfbd45475dc)), closes [#6467](https://github.com/aws/aws-cdk/issues/6467)
* cloudformation spec v11.4.0 ([#6700](https://github.com/aws/aws-cdk/issues/6700)) ([b28b427](https://github.com/aws/aws-cdk/commit/b28b4271a1ad9832777dd3b935c918106a0a11cb))


### Bug Fixes

* **apigateway:** type mismatch in C# when setting identitySources ([#6649](https://github.com/aws/aws-cdk/issues/6649)) ([2d3e7b1](https://github.com/aws/aws-cdk/commit/2d3e7b1daeb7b7459383f687ef1b33c639cfda80)), closes [#6538](https://github.com/aws/aws-cdk/issues/6538) [40aws-cdk/aws-apigateway/test/authorizers/integ.request-authorizer.ts#L26](https://github.com/40aws-cdk/aws-apigateway/test/authorizers/integ.request-authorizer.ts/issues/L26)
* **batch:** `computeEnvironments` is now required for JobQueue ([#6616](https://github.com/aws/aws-cdk/issues/6616)) ([0b6c865](https://github.com/aws/aws-cdk/commit/0b6c86559d641c1ef0b8c200be84356010a88b70)), closes [#6615](https://github.com/aws/aws-cdk/issues/6615)
* **batch:** managed compute environment now properly works with compute resources and instanceRole has correct docstring and type definition ([#6549](https://github.com/aws/aws-cdk/issues/6549)) ([4e81334](https://github.com/aws/aws-cdk/commit/4e813345b62c0db73b0c2116d5592ebcb9def3d2))
* **certificatemanager:** Route53 endpoint cannot be set and does not work for aws-cn ([#6480](https://github.com/aws/aws-cdk/issues/6480)) ([9858cdb](https://github.com/aws/aws-cdk/commit/9858cdb1b11e9713ab83d57256ded9b9a9df7c53))
* **cli:** codepipeline cloudformation action in cross account fail writing outputArtifacts ([#6594](https://github.com/aws/aws-cdk/issues/6594)) ([05cf78b](https://github.com/aws/aws-cdk/commit/05cf78bc9395bb3b46565bb89a264f4ede76a827))
* **cloudwatch:** missing LessThanLowerOrGreaterThanUpperThreshold ([#6597](https://github.com/aws/aws-cdk/issues/6597)) ([9731555](https://github.com/aws/aws-cdk/commit/973155543c28af661095f3ed8edba4cf8934f70d))
* **codepipeline-actions:** use IBaseService instead of BaseService in EcsDeployActionProps ([#6412](https://github.com/aws/aws-cdk/issues/6412)) ([bed5357](https://github.com/aws/aws-cdk/commit/bed53578df64b6a77c6a6e434c235ef4aefde300))
* **eks:** cannot upgrade version of clusters with an explicit name ([#6064](https://github.com/aws/aws-cdk/issues/6064)) ([1dd7104](https://github.com/aws/aws-cdk/commit/1dd7104ff4510005a0b6ff14372846747c572ed1))
* **eks:** sporadic broken pipe when deploying helm charts ([#6522](https://github.com/aws/aws-cdk/issues/6522)) ([03df1f1](https://github.com/aws/aws-cdk/commit/03df1f1c5f152ff0a14e872095df3b97b0d25fa0)), closes [#6381](https://github.com/aws/aws-cdk/issues/6381)
* **iam:** cannot add multiple conditions using same operator ([348a952](https://github.com/aws/aws-cdk/commit/348a952db68c838d73258cd8355322e151ae1080))

## [1.27.0](https://github.com/aws/aws-cdk/compare/v1.26.0...v1.27.0) (2020-03-03)


### ⚠ BREAKING CHANGES

* **cognito:** `UserPool.fromUserPoolAttributes()` has been replaced
  by `fromUserPoolId()` and `fromUserPoolArn()`.
* **cognito:** `IUserPool` no longer contains `userPoolProviderName`
  and `userPoolProviderUrl`.
* **cognito:** The property `signInType` of `UserPool` has been
  renamed to `signInAliases` and given a new type `SignInAliases`. The
  list of sign in types are now specified via boolean properties.
* **cognito:** The property `usernameAliasAttributes` of `UserPool` has
  been dropped and its functionality merged with the `signInAliases`
  property.
* **cognito:** The property `autoVerifiedAttributes` for `UserPool` is
  now renamed to `autoVerify` and its default has now changed. The new
  default is now determined by the value of `signInAliases`.
* **appsync:** Configuration the user pool authorization is now done through the
  authorizationConfig property. This allows us to specify a default
  authorization mode out of the supported ones, currently limited to
  Cognito user pools and API keys.
* **custom-resources:** `physicalResourceId` and `physicalResourceIdPath`
  were unified to a concrete type under the `physicalResourceId` property.
  Use `PhysicalResourceId.fromResponse` and `PhysicalResourceId.of` factory
  functions to specify it.

### Features

* **appsync:** extend authorization configuration ([#6260](https://github.com/aws/aws-cdk/issues/6260)) ([948881a](https://github.com/aws/aws-cdk/commit/948881a242053aad221487c6ca537145230de87f)), closes [#6246](https://github.com/aws/aws-cdk/issues/6246) [#6247](https://github.com/aws/aws-cdk/issues/6247)
* **aws-ec2:** signal, download and execute helpers for UserData ([#6029](https://github.com/aws/aws-cdk/issues/6029)) ([ee8f169](https://github.com/aws/aws-cdk/commit/ee8f16936c0e5cb412fbdd0f210045261374dac9)), closes [#623](https://github.com/aws/aws-cdk/issues/623)
* **cognito:** refresh modeling of import APIs, sign in & autoverified attrs ([#6422](https://github.com/aws/aws-cdk/issues/6422)) ([c02e852](https://github.com/aws/aws-cdk/commit/c02e8528ac12ff8eb2b5ded7695b544c379e51e2))
* **contributors:** use 0.0.0 as a version marker ([#6463](https://github.com/aws/aws-cdk/issues/6463)) ([d5f88c7](https://github.com/aws/aws-cdk/commit/d5f88c7b3a01e20c202bcb1a5f7baf6c72949b86)), closes [/github.com/aws/aws-cdk/pull/6463/files#diff-6a3371457528722a734f3c51d9238c13](https://github.com/aws//github.com/aws/aws-cdk/pull/6463/files/issues/diff-6a3371457528722a734f3c51d9238c13)
* **custom-resources:** physical resource id union type ([#6518](https://github.com/aws/aws-cdk/issues/6518)) ([d5000bc](https://github.com/aws/aws-cdk/commit/d5000bc1182efb4b218510a2ae211f5362f806d1))
* **lambda-event-sources:** expose `eventSourceMappingId` ([#5689](https://github.com/aws/aws-cdk/issues/5689)) ([5ea2679](https://github.com/aws/aws-cdk/commit/5ea2679c00f706c04ed8cb14f59746475f31e7db)), closes [#5430](https://github.com/aws/aws-cdk/issues/5430)
* **rds:** master secret in DatabaseSecret ([#6415](https://github.com/aws/aws-cdk/issues/6415)) ([a9e5b60](https://github.com/aws/aws-cdk/commit/a9e5b609b20eff9edaf5775cfbe0802177852475)), closes [#6358](https://github.com/aws/aws-cdk/issues/6358)
* **stepfunctions-tasks:** add step functions task to run glue job ([#6258](https://github.com/aws/aws-cdk/issues/6258)) ([15d9bd7](https://github.com/aws/aws-cdk/commit/15d9bd79690c2cb86c541dcb16c9dc88d8e338ad)), closes [#5266](https://github.com/aws/aws-cdk/issues/5266)


### Bug Fixes

* **assert:** `haveResourceLike` and `countResourcesLike` compatibility ([#6202](https://github.com/aws/aws-cdk/issues/6202)) ([86c04f3](https://github.com/aws/aws-cdk/commit/86c04f354b472e6ff0c4af2cb8235ea9017d1c00))
* **cli:** fast "no-op" deploys do not consider tags ([#6472](https://github.com/aws/aws-cdk/issues/6472)) ([5de87c1](https://github.com/aws/aws-cdk/commit/5de87c18b554b0cb903c7d0a68cf75ae32d0eb71)), closes [#6463](https://github.com/aws/aws-cdk/issues/6463)
* **codepipeline:** an action's role imported in a different stack adds a dependency to the CodePipeline stack ([#6458](https://github.com/aws/aws-cdk/issues/6458)) ([86ea564](https://github.com/aws/aws-cdk/commit/86ea564665cf0f90341193755233238e2fd46f54))
* **codepipeline:** automatically named artifacts could contain illegal characters from stage/action names ([#6460](https://github.com/aws/aws-cdk/issues/6460)) ([34aaca4](https://github.com/aws/aws-cdk/commit/34aaca4150e0001b58e154e164be1bedf4ca7f31))
* **core:** adds enableVersionUpgrade property to CfnUpdatePolicy ([#6434](https://github.com/aws/aws-cdk/issues/6434)) ([f8cacb9](https://github.com/aws/aws-cdk/commit/f8cacb9ae24ef7af45362a5212fddde351e67572)), closes [#6158](https://github.com/aws/aws-cdk/issues/6158)
* **custom-resources:** AwsCustomResource with delete only action fails ([#6363](https://github.com/aws/aws-cdk/issues/6363)) ([61a99e7](https://github.com/aws/aws-cdk/commit/61a99e7145e43793f0a27b693a76d85dd2cb61aa)), closes [#6061](https://github.com/aws/aws-cdk/issues/6061)
* **docker:** cannot use cdk docker assets as base image ([#6471](https://github.com/aws/aws-cdk/issues/6471)) ([983dd40](https://github.com/aws/aws-cdk/commit/983dd403d1293f7b1a01dd18f65d65cfee964eba)), closes [#6466](https://github.com/aws/aws-cdk/issues/6466)
* **rds:** setting timezone on DatabaseInstance causes internal failure ([#6534](https://github.com/aws/aws-cdk/issues/6534)) ([9e2ac91](https://github.com/aws/aws-cdk/commit/9e2ac91b98540cc79550346f390eca1561c79744)), closes [#6439](https://github.com/aws/aws-cdk/issues/6439)
* **stepfunctions:** valid reference path '$' fails with an error ([#6483](https://github.com/aws/aws-cdk/issues/6483)) ([221c83b](https://github.com/aws/aws-cdk/commit/221c83b470bb6b5de3df5aa62d8a55056aa6eb24)), closes [#6388](https://github.com/aws/aws-cdk/issues/6388)

## [1.26.0](https://github.com/aws/aws-cdk/compare/v1.25.0...v1.26.0) (2020-02-25)


### ⚠ BREAKING CHANGES

* **apigateway:** the interface now accepts endpointconfiguration property instead of endpoint type as defined by cfn
* **lambda-nodejs:** `parcel-bundler` v1.x is now a peer dependency of `@aws-cdk/aws-lambda-nodejs`. Please add it to your `package.json`.

### Features

* **apigateway:** expose endpointconfiguration to include vpcEndpointIds ([#6078](https://github.com/aws/aws-cdk/issues/6078)) ([99de6ca](https://github.com/aws/aws-cdk/commit/99de6ca6940f8e7e66e44d1cc68f0e1f1cb80b94)), closes [#6038](https://github.com/aws/aws-cdk/issues/6038)
* **apigateway:** lambda request authorizer ([#5642](https://github.com/aws/aws-cdk/issues/5642)) ([031932d](https://github.com/aws/aws-cdk/commit/031932d79511c3750f3f4177d74ead4609cab541))
* **appsync:** mapping template for lambda proxy ([#6288](https://github.com/aws/aws-cdk/pull/6288)) ([f865d5e](https://github.com/aws/aws-cdk/commit/f865d5ec25df9b3232a66d8e3e9aa32e23cb8aa5))
* **batch:** add JobQueue, ComputeEnvironment and JobDefinition constructs ([c8a22b1](https://github.com/aws/aws-cdk/commit/c8a22b176cdee7da2cde15c38a6fc107686cf2d0))
* **cdk-assets:** asset uploading tool ([c505348](https://github.com/aws/aws-cdk/commit/c5053480b057b307c4ebf33d2792839f07a09bb6))
* **cli:** faster "no-op" deployments ([#6346](https://github.com/aws/aws-cdk/issues/6346)) ([d4a132b](https://github.com/aws/aws-cdk/commit/d4a132bff91ab8e78ed38dc5ee41842554347ecf)), closes [#6046](https://github.com/aws/aws-cdk/issues/6046) [#2553](https://github.com/aws/aws-cdk/issues/2553) [#6216](https://github.com/aws/aws-cdk/issues/6216)
* **cfn:** CloudFormation Resource Specification 11.1.0 ([#6424](https://github.com/aws/aws-cdk/issues/6424)) ([ab9b77c](https://github.com/aws/aws-cdk/commit/ab9b77cc9857b5ea34952d4efb3f67c1d8a51311))
* **cognito:** user pool verification and invitation messages ([#6282](https://github.com/aws/aws-cdk/issues/6282)) ([faf6693](https://github.com/aws/aws-cdk/commit/faf6693e2590fbe7332be8737afd35874f6719f1))
* **ecs-patterns:** create dlq when queue is not provided for QueueProcessingService ([#6356](https://github.com/aws/aws-cdk/issues/6356)) ([e307d7f](https://github.com/aws/aws-cdk/commit/e307d7fa721a54ee54d8ad8e4b3f13e6c45c342a))
* **kms:** `trustAccountIdentities` avoids cyclic stack dependencies ([03f4ef2](https://github.com/aws/aws-cdk/commit/03f4ef27408822d288c75790c8d1270e007a0842))
* **rds:** attach description to database secret ([d5a4854](https://github.com/aws/aws-cdk/commit/d5a48545f83efe7ca39cab75579b2cd91f55800b))
* **sns:** support multiple tokens as url and email subscriptions ([#6357](https://github.com/aws/aws-cdk/issues/6357)) ([e5493bd](https://github.com/aws/aws-cdk/commit/e5493bd2cea897a2d4e1576d3084e9fb2e9f6b7f)), closes [#3996](https://github.com/aws/aws-cdk/issues/3996)
* **ssm:** add ability to specify SSM Parameter tier ([#6326](https://github.com/aws/aws-cdk/issues/6326)) ([9209ef6](https://github.com/aws/aws-cdk/commit/9209ef6e4879c64a9b374a14e2fb7b09b5c51052))


### Bug Fixes

* **aws-ecs:** propagate dnsTtl property part of cloudMapOptions ([#6370](https://github.com/aws/aws-cdk/issues/6370)) ([747bdb2](https://github.com/aws/aws-cdk/commit/747bdb240296c69430dbd8970f809aa1540da11d)), closes [#6223](https://github.com/aws/aws-cdk/issues/6223)
* **cli:** `cdk deploy` hangs when stack deployment fails ([#6433](https://github.com/aws/aws-cdk/issues/6433)) ([4b11d99](https://github.com/aws/aws-cdk/commit/4b11d998a09b2ecdff720dea0cd3ace718cb5b1d))
* **cli:** Python init templates are missing .gitignore file ([#6350](https://github.com/aws/aws-cdk/issues/6350)) ([cd6cd42](https://github.com/aws/aws-cdk/commit/cd6cd42e4d0debbd9161bcf4d4bf22ef1a92f128)), closes [#5566](https://github.com/aws/aws-cdk/issues/5566)
* **core:** top-level resources cannot use long logical ids ([#6419](https://github.com/aws/aws-cdk/issues/6419)) ([2a418b9](https://github.com/aws/aws-cdk/commit/2a418b9490f65ddcc34d96afb64c0d49041ae049)), closes [#6190](https://github.com/aws/aws-cdk/issues/6190) [#6190](https://github.com/aws/aws-cdk/issues/6190)
* **ecs:** support file as firelens config type ([#6322](https://github.com/aws/aws-cdk/issues/6322)) ([f9996f3](https://github.com/aws/aws-cdk/commit/f9996f3e72460068f53d2cb551f00fb32386e9c9))
* **lambda:** erroneous inline code support for ruby ([#6365](https://github.com/aws/aws-cdk/issues/6365)) ([8e21e78](https://github.com/aws/aws-cdk/commit/8e21e783d50bf75550298d7c111ad3ddb97f5343)), closes [#6302](https://github.com/aws/aws-cdk/issues/6302)
* **lambda-nodejs:** parcel is too big to bundle ([a93e4d5](https://github.com/aws/aws-cdk/commit/a93e4d5418af1409f1b3278bffb8ace360d28a19)), closes [#6340](https://github.com/aws/aws-cdk/issues/6340)

## [1.25.0](https://github.com/aws/aws-cdk/compare/v1.24.0...v1.25.0) (2020-02-18)


### ⚠ BREAKING CHANGES

* **appsync:** Changes `MappingTemplate.dynamoDbPutItem()` to accept
`PrimaryKey` and `AttributeValues`, which allow configuring the primary
key and to project an object to a set of attribute values.

### Features

* **appsync:** more general mapping template for DynamoDB PutItem ([#6236](https://github.com/aws/aws-cdk/issues/6236)) ([e9937d3](https://github.com/aws/aws-cdk/commit/e9937d3717d07c679d7732db21231a6b4da80130)), closes [#6225](https://github.com/aws/aws-cdk/issues/6225)
* **aws-applicationautoscaling:** support Lambda and Comprehend ([#6191](https://github.com/aws/aws-cdk/issues/6191)) ([bdab747](https://github.com/aws/aws-cdk/commit/bdab7477b8464e04730a2b4b09841008bc6e8ab9))
* **cfn:** update CloudFormation spec to v11.0.0 ([#6311](https://github.com/aws/aws-cdk/issues/6311)) ([ea272fa](https://github.com/aws/aws-cdk/commit/ea272fa270fd7dc09e0388a90e82bfb27a88491f))


### Bug Fixes

* **aws-lambda-nodejs:** Fix parcel invocation when invoked from globally installed cdk cli ([#6206](https://github.com/aws/aws-cdk/issues/6206)) ([ce96e08](https://github.com/aws/aws-cdk/commit/ce96e08a10f86361515f9210a52a37c9101e98fe)), closes [#6204](https://github.com/aws/aws-cdk/issues/6204)
* **codepipeline:** fixed typo in method docs within action.ts ([78a39b7](https://github.com/aws/aws-cdk/commit/78a39b7a07f35b4675fe63cb2134c166f846c6be))
* **eks:** Helm release name length & `--wait` option. ([#6276](https://github.com/aws/aws-cdk/issues/6276)) ([1811e00](https://github.com/aws/aws-cdk/commit/1811e00ff7e90f235198f855051f11f1d457b3a4)), closes [/github.com/helm/helm/blob/b63822ed12de1badbb61736d2f7ea4e756ef757d/pkg/action/install.go#L52-L55](https://github.com/aws//github.com/helm/helm/blob/b63822ed12de1badbb61736d2f7ea4e756ef757d/pkg/action/install.go/issues/L52-L55)
* **lambda-nodejs:** not meaningful parcel error message when build fails ([#6277](https://github.com/aws/aws-cdk/issues/6277)) ([a97b48a](https://github.com/aws/aws-cdk/commit/a97b48ae4a7dafe050997e00bb57bf64117b551b)), closes [#6274](https://github.com/aws/aws-cdk/issues/6274)

## [1.24.0](https://github.com/aws/aws-cdk/compare/v1.23.0...v1.24.0) (2020-02-13)


### Features

* **assert:** add countResourcesLike method ([#6168](https://github.com/aws/aws-cdk/issues/6168)) ([491e2d9](https://github.com/aws/aws-cdk/commit/491e2d970c849cbc00e7cb3def927b12054d572f))
* **cx-api:** clean up features.ts ([#6181](https://github.com/aws/aws-cdk/issues/6181)) ([efd6f3d](https://github.com/aws/aws-cdk/commit/efd6f3d7c7ccd985f386b29dffed47e2b3c6fa7c)), closes [#6098](https://github.com/aws/aws-cdk/issues/6098)
* **dynamodb:** add metrics for dynamodb table ([#6149](https://github.com/aws/aws-cdk/issues/6149)) ([295391e](https://github.com/aws/aws-cdk/commit/295391e901798a8f99415fd72a6b4fa664d75f44))
* **dynamodb:** global tables version 2019.11.21 ([#5821](https://github.com/aws/aws-cdk/issues/5821)) ([8c0c2b1](https://github.com/aws/aws-cdk/commit/8c0c2b130060215509cd6db83f8d6b18f92f857b)), closes [#5752](https://github.com/aws/aws-cdk/issues/5752)
* **ec2:** smarter default for VPN route propagation ([#6071](https://github.com/aws/aws-cdk/issues/6071)) ([5dd8aca](https://github.com/aws/aws-cdk/commit/5dd8aca97c314a2293473f4c6695e844f14aaa62)), closes [#6008](https://github.com/aws/aws-cdk/issues/6008)
* **ec2:** VPC flow logs ([a2fddec](https://github.com/aws/aws-cdk/commit/a2fddec4aa1893d4bf68fdfbb5c9379e58cd19f3)), closes [#3493](https://github.com/aws/aws-cdk/issues/3493)
* **iam:** add ability to create IAM role descriptions ([cee8825](https://github.com/aws/aws-cdk/commit/cee882540527feb2b6f0fee866eb96cccc2eae36))
* **iam:** descriptions for IAM Roles ([a1294d3](https://github.com/aws/aws-cdk/commit/a1294d35015faaf27f44a894a2367fe5791856a6))
* **cfnspec**: update CloudFormation spec to 10.5.0 ([#6195](https://github.com/aws/aws-cdk/issues/6195)) ([47a9949](https://github.com/aws/aws-cdk/commit/47a994916cc7744a2335ae4c7496ad11be86e366))
* **iam:** lookup ManagedPolicy via ARN ([2df2023](https://github.com/aws/aws-cdk/commit/2df2023755d696af0e82a1c83bfd2d4b4e54950d)), closes [#6186](https://github.com/aws/aws-cdk/issues/6186)
* **lambda:** expose `function.deadLetterQueue` ([6656047](https://github.com/aws/aws-cdk/commit/66560479c9417003c8cc61021155b8a8b732fb39)), closes [#6170](https://github.com/aws/aws-cdk/issues/6170)
* **step-functions:** `grantStartExecution` available on imported StateMachine ([5ae81cd](https://github.com/aws/aws-cdk/commit/5ae81cdddd75abedbcef7d856bdb20458fac5fcb)), closes [#6173](https://github.com/aws/aws-cdk/issues/6173)
* **stepfunctions:** EMR service integrations ([c69b6d2](https://github.com/aws/aws-cdk/commit/c69b6d2d712f9c307dd9de214acc96f5f944cc7d)), closes [#5224](https://github.com/aws/aws-cdk/issues/5224)


### Bug Fixes

* **cli**: truncated 'cdk diff' output in pipes ([aba1485](https://github.com/aws/aws-cdk/commit/aba1485765a4ac31e5acabaa945b1b4adde94c6a))
* **apigateway:** deployment fails when Model's contentType is not specified ([#6199](https://github.com/aws/aws-cdk/issues/6199)) ([0bf1403](https://github.com/aws/aws-cdk/commit/0bf1403a9f669556ed7942b5e1dd966f94ba812c)), closes [#6161](https://github.com/aws/aws-cdk/issues/6161)
* **apigateway:** stack deployment fails when a Stage is explicitly specified ([#6165](https://github.com/aws/aws-cdk/issues/6165)) ([879601e](https://github.com/aws/aws-cdk/commit/879601ead3c009cc10bd5d49dbc9d1132fa9ba82)), closes [#6068](https://github.com/aws/aws-cdk/issues/6068)
* **cli:** wrongly assume aws config file always exists ([#6196](https://github.com/aws/aws-cdk/issues/6196)) ([23f8b9f](https://github.com/aws/aws-cdk/commit/23f8b9f5e97f5f229faa9322d840339f6322a234))
* **codebuild:** badge is not allowed for CodeCommit sources ([#6211](https://github.com/aws/aws-cdk/issues/6211)) ([433d957](https://github.com/aws/aws-cdk/commit/433d95763210f8798c604bf62560d2a4ba39d9c6)), closes [#6205](https://github.com/aws/aws-cdk/issues/6205)
* **ec2:** `onePerAz` does not work for looked-up VPCs ([3332d06](https://github.com/aws/aws-cdk/commit/3332d06982c6eb04e4f88c5b01ad745ed18d7e82)), closes [#3126](https://github.com/aws/aws-cdk/issues/3126)
* **ecs-patterns:** allow imported load balancers as inputs ([7f8c90d](https://github.com/aws/aws-cdk/commit/7f8c90decd58d2016611e6f94fc506156e047b59))
* **elasticloadbalancingv2:** logAccessLogs in Base Load Balancer ([#6197](https://github.com/aws/aws-cdk/issues/6197)) ([adbc3b9](https://github.com/aws/aws-cdk/commit/adbc3b93e062b6687c048b36ef4d26ce2c784e53)), closes [#3794](https://github.com/aws/aws-cdk/issues/3794)
* **elbv2:** validate rule priority is a positive number ([#6222](https://github.com/aws/aws-cdk/issues/6222)) ([1fbaafe](https://github.com/aws/aws-cdk/commit/1fbaafe34ce3f45a84a2141f7171e02fb8ec4801)), closes [#3794](https://github.com/aws/aws-cdk/issues/3794)
* **kms:** add TagResource & UntagResource IAM permissions to default key policy ([#6125](https://github.com/aws/aws-cdk/issues/6125)) ([e65a326](https://github.com/aws/aws-cdk/commit/e65a326b7de3d97675e27af7f3cb9f2f8735a01d)), closes [#6102](https://github.com/aws/aws-cdk/issues/6102)

## [1.23.0](https://github.com/aws/aws-cdk/compare/v1.22.0...v1.23.0) (2020-02-07)


### Features

* **appsync:** add support for mapping DynamoDB queries ([#5940](https://github.com/aws/aws-cdk/issues/5940)) ([2240e97](https://github.com/aws/aws-cdk/commit/2240e97eded2578aa09ccd3af282bfb6db5667d7)), closes [#5861](https://github.com/aws/aws-cdk/issues/5861)
* **aws-codebuild:** allow github sourceversion branch ([#5890](https://github.com/aws/aws-cdk/issues/5890)) ([155b80e](https://github.com/aws/aws-cdk/commit/155b80ea30cf7c22e50fe4acdbc68978ae8be173)), closes [#5777](https://github.com/aws/aws-cdk/issues/5777)
* **cloudformation:** update Resource Specification to v10.4.0 ([#5982](https://github.com/aws/aws-cdk/issues/5982)) ([178ca5e](https://github.com/aws/aws-cdk/commit/178ca5ee75f3133c059077f0678b159c1d366c5f))
* **ecs:** add support for enabling container insights ([#5601](https://github.com/aws/aws-cdk/issues/5601)) ([6236634](https://github.com/aws/aws-cdk/commit/6236634d86d3615f58153cca50595fa0d7a4540c))
* **ecs:** ContainerImage.fromDockerImageAsset ([b94577a](https://github.com/aws/aws-cdk/commit/b94577a0acb0aa76e257fb15267faf6c0954700a)), closes [#5791](https://github.com/aws/aws-cdk/issues/5791) [#5983](https://github.com/aws/aws-cdk/issues/5983)
* **ecs:** ContainerImage.fromDockerImageAsset ([#6093](https://github.com/aws/aws-cdk/issues/6093)) ([38e9865](https://github.com/aws/aws-cdk/commit/38e9865509df4ddb8a875d37cee2a88a3db9f169)), closes [#5791](https://github.com/aws/aws-cdk/issues/5791) [#5983](https://github.com/aws/aws-cdk/issues/5983)
* **ecs:** Firelens log driver support ([#5457](https://github.com/aws/aws-cdk/issues/5457)) ([4acf0f7](https://github.com/aws/aws-cdk/commit/4acf0f7441eafdc7dc93d6d44a0f4bfb2e8fb47e))
* **lambda:** avail function log group in the CDK ([#5878](https://github.com/aws/aws-cdk/issues/5878)) ([fd54a17](https://github.com/aws/aws-cdk/commit/fd54a17a82605ac1301e5776aa68f03bbfb63910)), closes [#3838](https://github.com/aws/aws-cdk/issues/3838)
* **lambda:** higher level construct for Node.js ([#5532](https://github.com/aws/aws-cdk/issues/5532)) ([02d0e2a](https://github.com/aws/aws-cdk/commit/02d0e2aa0075eec5e42b6b6a10ddd7a0e53b97c6))



### Bug Fixes

* **assets:** add exclude glob patterns to calculating fingerprint for staging ([#6085](https://github.com/aws/aws-cdk/issues/6085)) ([d9a043b](https://github.com/aws/aws-cdk/commit/d9a043b6f604d70525a94e69db0c94589221e720)), closes [#5238](https://github.com/aws/aws-cdk/issues/5238)
* **aws-s3-deployment:** fix server side encryption parameters ([#6006](https://github.com/aws/aws-cdk/issues/6006)) ([c7197c0](https://github.com/aws/aws-cdk/commit/c7197c0048474f69e253b752e289abad6e72554f)), closes [#6002](https://github.com/aws/aws-cdk/issues/6002)
* **cli:** colored text is unreadable when using light themes  ([#5250](https://github.com/aws/aws-cdk/issues/5250)) ([b4573ef](https://github.com/aws/aws-cdk/commit/b4573ef19e8b41121065d5d0830554b9d6b03565))
* **cli:** parse equals sign in context values ([#5773](https://github.com/aws/aws-cdk/issues/5773)) ([667443c](https://github.com/aws/aws-cdk/commit/667443c99683dcb6b02073350bdabc8aa482d1c2)), closes [#5738](https://github.com/aws/aws-cdk/issues/5738)
* **codepipeline:** manual approval action doesn't have configuration without a topic ([#6106](https://github.com/aws/aws-cdk/issues/6106)) ([a63cbf8](https://github.com/aws/aws-cdk/commit/a63cbf803535e7e3043cadf9c4a4de1f8da45a9a)), closes [#6100](https://github.com/aws/aws-cdk/issues/6100)
* **cognito:** standard attr timezone unexpectedly creates custom attr ([#5973](https://github.com/aws/aws-cdk/issues/5973)) ([acf3ffc](https://github.com/aws/aws-cdk/commit/acf3ffce5b7dacd25b6611d07835f30c85d53006))
* **ec2:** add `MachineImage` factory, document instance replacement ([#6065](https://github.com/aws/aws-cdk/issues/6065)) ([435d810](https://github.com/aws/aws-cdk/commit/435d81014a481d0828bddbf10a0a155f6efc2e7e)), closes [#5675](https://github.com/aws/aws-cdk/issues/5675) [#6025](https://github.com/aws/aws-cdk/issues/6025)
* **ec2:** private DNS for custom endpoints has incorrect default ([d681d96](https://github.com/aws/aws-cdk/commit/d681d964b91048eaf2044a27c8c70c05b2b9e2bc))
* **ecr-assets:** docker images are not built if .dockerignore includes an entry that ignores the dockerfile. ([#6007](https://github.com/aws/aws-cdk/issues/6007)) ([e7ef5e5](https://github.com/aws/aws-cdk/commit/e7ef5e5660457eb82252e8992214da775b83c41c))
* **ecs:** fix splunk-sourcetype ([#6128](https://github.com/aws/aws-cdk/issues/6128)) ([6456a7c](https://github.com/aws/aws-cdk/commit/6456a7c508c6cc68e98ebdcf8c0f4336cb3c0b89))
* **ecs-patterns:** queue service grant permission automatically ([#6110](https://github.com/aws/aws-cdk/issues/6110)) ([0d0794e](https://github.com/aws/aws-cdk/commit/0d0794e4853f00d971d4e00f76fcced780fe0413))
* **ecs-patterns:** remove duplicated schedule property for scheduled task pattern ([#6101](https://github.com/aws/aws-cdk/issues/6101)) ([15b6aa7](https://github.com/aws/aws-cdk/commit/15b6aa72e17b37f53b745dc33d0626d1c5d9ff4b))
* **eks:** missing VPC permissions for fargate profiles ([#6074](https://github.com/aws/aws-cdk/issues/6074)) ([0a586fc](https://github.com/aws/aws-cdk/commit/0a586fc3e1c2c44dc4cf2d365d84103393682153))
* **glue:** Make Glue Database locationUri optional. ([#5784](https://github.com/aws/aws-cdk/issues/5784)) ([a065169](https://github.com/aws/aws-cdk/commit/a0651693fb3eb00482f6b3ee70d1982d78ea0013)), closes [#5268](https://github.com/aws/aws-cdk/issues/5268) [#5268](https://github.com/aws/aws-cdk/issues/5268) [#5268](https://github.com/aws/aws-cdk/issues/5268) [#5268](https://github.com/aws/aws-cdk/issues/5268)
* **iam:** policies added to immutably imported role ([#6090](https://github.com/aws/aws-cdk/issues/6090)) ([f1f5319](https://github.com/aws/aws-cdk/commit/f1f53194b9b41031640987822f5ed562f1b2ecec)), closes [#5569](https://github.com/aws/aws-cdk/issues/5569) [#5943](https://github.com/aws/aws-cdk/issues/5943)
* **init-templates:** JavaScript, TypeScript, and Python init templates are broken in 1.21.0 ([#5989](https://github.com/aws/aws-cdk/issues/5989)) ([505c91e](https://github.com/aws/aws-cdk/commit/505c91e8b02c7c054d01e51f89e440f24f43ac8e)), closes [#5986](https://github.com/aws/aws-cdk/issues/5986)
* **route53:** CaaAmazonRecord ignores recordName ([#6027](https://github.com/aws/aws-cdk/issues/6027)) ([16f9721](https://github.com/aws/aws-cdk/commit/16f9721955b2aacec5ed3850b8b8d399ffecfe75)), closes [#5764](https://github.com/aws/aws-cdk/issues/5764)
* **route53:** correct import example in README.md ([#5946](https://github.com/aws/aws-cdk/issues/5946)) ([ed71931](https://github.com/aws/aws-cdk/commit/ed719317cd8422182df9512807294c2822d470ea))
* **s3-deployment:** passing any system metadata causes lambda to fail on "Unknown options:" when invoking aws cli. ([#6086](https://github.com/aws/aws-cdk/issues/6086)) ([b30add8](https://github.com/aws/aws-cdk/commit/b30add8c70dcf6239c137a38eb764513ce1e1f29))

## [1.22.0](https://github.com/aws/aws-cdk/compare/v1.21.1...v1.22.0) (2020-01-23)


### ⚠ BREAKING CHANGES

* **eks:** (experimental module) the `Mapping` struct was renamed to `AwsAuthMapping`.
* **core:** Arn.parseArn now returns empty string for nullable Arn components. Users who were depending on an undefined value will now receive the falsy empty string.
* **ecr-assets:** all docker image assets are now pushed to a single ECR repository named `aws-cdk/assets` with an image tag based on the hash of the docker build source directory (the directory where your `Dockerfile` resides). See PR #5733 for details and discussion.
* **autoscaling:** AutoScaling by using `scaleOnMetric` will no longer force the alarm period to 1 minute, but use the period from the Metric object instead (5 minutes by default). Use `metric.with({ period: Duration.minute(1) })` to create a high-frequency scaling policy.

### Features

* **apigatewayv2:** fork APIGatewayV2 into its own package ([#5816](https://github.com/aws/aws-cdk/issues/5816)) ([d58667e](https://github.com/aws/aws-cdk/commit/d58667e473c1e07ac8f2f073b3a541569a014e01))
* **cloudformation:** upgrade the CloudFormation resource specification to v10.3.0 ([#5882](https://github.com/aws/aws-cdk/issues/5882)) ([e5e4725](https://github.com/aws/aws-cdk/commit/e5e47252b39ee1aedba1eaf81f32a0110ac2ab32))
* **ecr-assets:** simplify docker asset publishing ([#5733](https://github.com/aws/aws-cdk/issues/5733)) ([b52b43d](https://github.com/aws/aws-cdk/commit/b52b43ddfea0398b3f6e05002bf5b97bc831d1a7)), closes [#3463](https://github.com/aws/aws-cdk/issues/3463) [#5807](https://github.com/aws/aws-cdk/issues/5807)
* **eks:** fargate profiles ([#5589](https://github.com/aws/aws-cdk/issues/5589)) ([450a127](https://github.com/aws/aws-cdk/commit/450a12789f3f145d3409db4a7a9d1eb06ae48e37)), closes [#5303](https://github.com/aws/aws-cdk/issues/5303)
* **lambda:** allow inline code for nodejs12.x runtime ([#5710](https://github.com/aws/aws-cdk/issues/5710)) ([a1cd743](https://github.com/aws/aws-cdk/commit/a1cd7432eb817a0a9361c907445c01eea4cb1321))
* **lambda-destinations:** option to auto-extract the payload when using LambdaDestination ([#5503](https://github.com/aws/aws-cdk/issues/5503)) ([321372f](https://github.com/aws/aws-cdk/commit/321372fb68ba2a9928069d24d500061efec188f8))
* **route53-targets:** Add aws-route53-targets/InterfaceVpcEndpointTarget ([#4868](https://github.com/aws/aws-cdk/issues/4868)) ([6969562](https://github.com/aws/aws-cdk/commit/696956240f36fc7235f77b0d4f2d286ab580f78d))
* bump JSII to version 0.21.2 ([#5919](https://github.com/aws/aws-cdk/issues/5919)) ([dd18456](https://github.com/aws/aws-cdk/commit/dd184563521f2b4eca72af650c98e91177f2831d))


### Bug Fixes

* **apigateway:** LambdaRestApi fails when a user defined Stage is attached ([#5838](https://github.com/aws/aws-cdk/issues/5838)) ([05719d7](https://github.com/aws/aws-cdk/commit/05719d75edefce45781516f440e1e685741006df)), closes [#5744](https://github.com/aws/aws-cdk/issues/5744)
* **autoscaling:** can't use `MathExpression` in `scaleOnMetric` ([d4c1b0e](https://github.com/aws/aws-cdk/commit/d4c1b0ee84abb1c0ca24ddf1260a4b2161dde7b8)), closes [#5776](https://github.com/aws/aws-cdk/issues/5776)
* `SecretsManagerRDSPostgreSQLRotationMultiUser` not working ([49032ee](https://github.com/aws/aws-cdk/commit/49032eef373d6d05f580abf2d3e1cc2a66b31042))
* **autoscaling:** can't use block devices ([fee1324](https://github.com/aws/aws-cdk/commit/fee1324548350842d81fbc646b011db214b59de3)), closes [#5868](https://github.com/aws/aws-cdk/issues/5868)
* **core:** allow empty string components in parseArn ([#5875](https://github.com/aws/aws-cdk/issues/5875)) ([5ed5eb4](https://github.com/aws/aws-cdk/commit/5ed5eb416ec92f12c6bda352bc81b684f7a54517)), closes [#5808](https://github.com/aws/aws-cdk/issues/5808)
* **lambda:** setting log retention to INFINITE causes failure ([#5876](https://github.com/aws/aws-cdk/issues/5876)) ([19ed739](https://github.com/aws/aws-cdk/commit/19ed7397f721e42841ef494bd4fdcc0131505554))
* **route53:** incorrect domain name produced when using HTTPS in ApplicationLoadBalancedFargateService  ([#5802](https://github.com/aws/aws-cdk/issues/5802)) ([5ba5a5e](https://github.com/aws/aws-cdk/commit/5ba5a5ea1627046524408d0cf9648d552f0e4b7a))

## [1.21.1](https://github.com/aws/aws-cdk/compare/v1.21.0...v1.21.1) (2020-01-16)

### Bug Fixes

* **ecr-assets:** cannot build docker images outside the source tree (i.e. against a cdk.out directory) ([#5836](https://github.com/aws/aws-cdk/pull/5836)) ([6bc8ecc](https://github.com/aws/aws-cdk/pull/5833/commits/6bc8eccdba21a10944c81ababe07df37c07481d0)), fixes ([#5807](https://github.com/aws/aws-cdk/issues/5807))
* **cli:** `cdk init` fails if run under a directory where `cdk.json` exists, reverts ([#5772](https://github.com/aws/aws-cdk/pull/5772)) due to an issue which will be fixed in a subsequent version ([#5836](https://github.com/aws/aws-cdk/pull/5836)) ([da9c626](https://github.com/aws/aws-cdk/pull/5833/commits/da9c6262fd262a5cfd8c150c2c165e46ecbc95b1))
, fixes ([#5826](https://github.com/aws/aws-cdk/issues/5826))
## [1.21.0](https://github.com/aws/aws-cdk/compare/v1.20.0...v1.21.0) (2020-01-15)


### Features

* **assert:** cdk assert: implement 'haveOutput' assertion ([#5366](https://github.com/aws/aws-cdk/issues/5366)) ([ee6decb](https://github.com/aws/aws-cdk/commit/ee6decbb4f2b90454777632f8750eae8674b1be2)), closes [#1906](https://github.com/aws/aws-cdk/issues/1906)
* **cli:** run cdk from inner directories ([#5772](https://github.com/aws/aws-cdk/issues/5772)) ([a54630d](https://github.com/aws/aws-cdk/commit/a54630db99716e1a7a19e4320fa4c55a42e5ea68))
* **codepipeline:** add CannedACL and CacheControl to S3 deploy action ([#5698](https://github.com/aws/aws-cdk/issues/5698)) ([b3e7978](https://github.com/aws/aws-cdk/commit/b3e7978dff2ce20d8e0327db13186922205a1b4c))
* **codepipeline:** add support for externalEntityLink in the manual approval action ([#5558](https://github.com/aws/aws-cdk/issues/5558)) ([be2e3e3](https://github.com/aws/aws-cdk/commit/be2e3e305eee5d90552c08512a4d476db74b91d0))
* **codepipeline:** Pipeline Variables ([#5604](https://github.com/aws/aws-cdk/issues/5604)) ([34d3e7d](https://github.com/aws/aws-cdk/commit/34d3e7de39dc197510013f6e4f91170b4c2e29f7)), closes [#5219](https://github.com/aws/aws-cdk/issues/5219)
* **ec2:** `VpcEndpointService` construct ([#5498](https://github.com/aws/aws-cdk/issues/5498)) ([a2713f3](https://github.com/aws/aws-cdk/commit/a2713f35d65bd26fb9ff878c6daed072ffed5f15))
* recommend matching commands ([#5668](https://github.com/aws/aws-cdk/issues/5668)) ([6108b91](https://github.com/aws/aws-cdk/commit/6108b91d6d3c087a61ac9b3990030a5a52a08808))
* **elbv2:** default config for internal load balancer will fall back to Isolated subnets ([#5696](https://github.com/aws/aws-cdk/pull/5696)) ([8b9c1fc](https://github.com/aws/aws-cdk/commit/8b9c1fc652673083ffd92f58a97931c1bbb834c9))
* **iam:** `Role.withoutPolicyUpdates()` ([#5569](https://github.com/aws/aws-cdk/issues/5569)) ([ea4ca3e](https://github.com/aws/aws-cdk/commit/ea4ca3ea251e54921c39ee79f321cae2701837ad)), closes [#2985](https://github.com/aws/aws-cdk/issues/2985) [#4465](https://github.com/aws/aws-cdk/issues/4465) [#4501](https://github.com/aws/aws-cdk/issues/4501)
* **iam:** support importing service roles ([#5701](https://github.com/aws/aws-cdk/issues/5701)) ([0f02dad](https://github.com/aws/aws-cdk/commit/0f02dad9ffa9d01912f29edc0c8d91869a6c4824)), closes [#2651](https://github.com/aws/aws-cdk/issues/2651)
* **s3:** server access logs ([#5072](https://github.com/aws/aws-cdk/issues/5072)) ([c9b074b](https://github.com/aws/aws-cdk/commit/c9b074b28b26a537fb81b9a4a431df6412964c59))


### Bug Fixes

* **acm:** `DnsValidatedCertificate` in non-aws partitions ([#5771](https://github.com/aws/aws-cdk/issues/5771)) ([e3305d8](https://github.com/aws/aws-cdk/commit/e3305d8d09b3fd87a0609606c3638332c4eeef33))
* **apigateway:** authorizer name is not optional ([#5731](https://github.com/aws/aws-cdk/issues/5731)) ([21c425e](https://github.com/aws/aws-cdk/commit/21c425e066dec3ec44daedfa980f9e4d96488755)), closes [#5678](https://github.com/aws/aws-cdk/issues/5678)
* **apigateway:** unable to associate RestApi as a route53 target for late bound domains ([#5555](https://github.com/aws/aws-cdk/issues/5555)) ([c02741e](https://github.com/aws/aws-cdk/commit/c02741ed53ecc834acfb5c3c4d5fc0deab6f2726))
* **cli:** Fix various init templates & their tests ([#5693](https://github.com/aws/aws-cdk/issues/5693)) ([a85da79](https://github.com/aws/aws-cdk/commit/a85da79c0da05f57af84d388efe7775502cf0039))
* **cli:** proxy support is broken ([#5803](https://github.com/aws/aws-cdk/issues/5803)) ([3a63f57](https://github.com/aws/aws-cdk/commit/3a63f57b3f36f914ac086d9bfe08274f0ddec574)), closes [#5743](https://github.com/aws/aws-cdk/issues/5743) [#5791](https://github.com/aws/aws-cdk/issues/5791)
* **cloudformation:** nested stack example in readme is broken ([#5729](https://github.com/aws/aws-cdk/issues/5729)) ([c53356a](https://github.com/aws/aws-cdk/commit/c53356a3cc4c4a96d326d73bfa28d791100391bc)), closes [#5686](https://github.com/aws/aws-cdk/issues/5686)
* **cloudwatch:** cross-account metrics in env-agnostic stack ([#5775](https://github.com/aws/aws-cdk/issues/5775)) ([5292bd5](https://github.com/aws/aws-cdk/commit/5292bd56ad4f7c2bf68767861c5e252b13282f34)), closes [aws/aws-cdk#5628](https://github.com/aws/aws-cdk/issues/5628)
* **codepipeline:** Action.onStateChange() has wrong detail type ([#5721](https://github.com/aws/aws-cdk/issues/5721)) ([8686dd5](https://github.com/aws/aws-cdk/commit/8686dd5bae583df08f2b25a8133c7e9296f7a643)), closes [#3614](https://github.com/aws/aws-cdk/issues/3614)
* **custom-resources:** missing physical resource id for delete calls ([#5805](https://github.com/aws/aws-cdk/issues/5805)) ([9b7236a](https://github.com/aws/aws-cdk/commit/9b7236abb4b08c2d080858059dc2b531031da6fe)), closes [#5796](https://github.com/aws/aws-cdk/issues/5796)
* **ecr-assets:** unable to use one Dockerfile to build multiple images ([#5705](https://github.com/aws/aws-cdk/issues/5705)) ([ff3f27f](https://github.com/aws/aws-cdk/commit/ff3f27fe56dc2300032c307cf09f50a3cd7a997e)), closes [#5683](https://github.com/aws/aws-cdk/issues/5683)
* **ecs:** cannot separate `Cluster` and `Ec2Service` behind ALB ([#5813](https://github.com/aws/aws-cdk/issues/5813)) ([eb3c517](https://github.com/aws/aws-cdk/commit/eb3c5170e1c3f5243ee437ab7627dd84d68d5740))
* **glue:** empty string in Table.s3prefix is not undefined ([#5783](https://github.com/aws/aws-cdk/issues/5783)) ([18e15de](https://github.com/aws/aws-cdk/commit/18e15de64dfcadd9b5cacef54ed5d93a9a91189a)), closes [#5763](https://github.com/aws/aws-cdk/issues/5763)
* **iam:** can't use `OrganizationPrincipal` for assuming Role ([#5746](https://github.com/aws/aws-cdk/issues/5746)) ([6c3d4c4](https://github.com/aws/aws-cdk/commit/6c3d4c40b7f4cef1c3d484bf9b3409ee6f33cc27)), closes [#5732](https://github.com/aws/aws-cdk/issues/5732)
* **rds:** pass the ARN of master instead of its ID in DatabaseInstanceReadReplica ([#5702](https://github.com/aws/aws-cdk/issues/5702)) ([d323c0c](https://github.com/aws/aws-cdk/commit/d323c0c13aaf475f59615a41969bb60cbb678be8)), closes [#5530](https://github.com/aws/aws-cdk/issues/5530)

## [1.20.0](https://github.com/aws/aws-cdk/compare/v1.19.0...v1.20.0) (2020-01-07)


### ⚠ BREAKING CHANGES

* **autoscaling:** AutoScalingGroups without `desiredCapacity` are now
initially scaled to their minimum capacity (instead of their maximum
capaciety).
* **rds:** `addRotationSingleUser(id: string, options: SecretRotationOptions)` is now `addRotationSingleUser(automaticallyAfter?: Duration)`
* **glue:** InputFormat. TEXT_INPUT_FORMAT has been renamed to TEXT. OutputFormat. HIVE_IGNORE_KEY_TEXT_OUTPUT_FORMAT has been renamed to HIVE_IGNORE_KEY_TEXT

### Features

* **apigateway:** lambda token authorizer ([#5197](https://github.com/aws/aws-cdk/issues/5197)) ([5c16744](https://github.com/aws/aws-cdk/commit/5c167448f16ea368efc8192abc26e281f976ec7f)), closes [#5584](https://github.com/aws/aws-cdk/issues/5584)
* **aws-stepfunctions:** support StateMachineType ([#5398](https://github.com/aws/aws-cdk/issues/5398)) ([ea095f0](https://github.com/aws/aws-cdk/commit/ea095f0198ebe1efd2f20621cac111b71ee68bd7)), closes [#5397](https://github.com/aws/aws-cdk/issues/5397)
* **cli:** support custom CA certificate bundles ([ac748c1](https://github.com/aws/aws-cdk/commit/ac748c1786e68774f5d0ea9cfbec439034166c40)), closes [#5294](https://github.com/aws/aws-cdk/issues/5294)
* **cloudformation:** update cloudformation spec to v10.2.0 ([#5542](https://github.com/aws/aws-cdk/issues/5542)) ([cb65da3](https://github.com/aws/aws-cdk/commit/cb65da3cd31425265aadd2f2e806a45b244fab8b))
* **cloudwatch:** make Metric objects region-aware ([212687c](https://github.com/aws/aws-cdk/commit/212687c1427b4e0e6dde11c69139e5036a1ce087))
* **cloudwatch:** support for metric math ([#5582](https://github.com/aws/aws-cdk/issues/5582)) ([a7f189e](https://github.com/aws/aws-cdk/commit/a7f189e980fdc21b44b8d20fcb491d798ffb682e)), closes [#1077](https://github.com/aws/aws-cdk/issues/1077) [#5449](https://github.com/aws/aws-cdk/issues/5449) [#5261](https://github.com/aws/aws-cdk/issues/5261) [#4716](https://github.com/aws/aws-cdk/issues/4716)
* **codebuild:** add 2X_Large compute type option ([#5429](https://github.com/aws/aws-cdk/issues/5429)) ([1291ef6](https://github.com/aws/aws-cdk/commit/1291ef6b4eb7b8333247b243bcf37bdcb8aaa07f)), closes [#5401](https://github.com/aws/aws-cdk/issues/5401)
* **core:** add support for the ref intrinsic function ([#5468](https://github.com/aws/aws-cdk/issues/5468)) ([#5470](https://github.com/aws/aws-cdk/issues/5470)) ([cad5bc1](https://github.com/aws/aws-cdk/commit/cad5bc148bfdd088c1307932b919899a98fd860a))
* **custom-resource:** Allow custom ResourceTypes on CustomResources ([#5248](https://github.com/aws/aws-cdk/issues/5248)) ([c605ceb](https://github.com/aws/aws-cdk/commit/c605ceb40a49528505669bac61403673b38da5ba))
* **custom-resources:** getDataString for AwsCustomResource ([#5578](https://github.com/aws/aws-cdk/issues/5578)) ([faa368d](https://github.com/aws/aws-cdk/commit/faa368dfa7d6706669a9eaca2279cb86d2dd42c7)), closes [#5570](https://github.com/aws/aws-cdk/issues/5570)
* **custom-resources:** ignore DELETE after failed CREATE ([#5525](https://github.com/aws/aws-cdk/issues/5525)) ([9ab989e](https://github.com/aws/aws-cdk/commit/9ab989e4aba7b4fdeee062097dda01b25d41675d)), closes [#5524](https://github.com/aws/aws-cdk/issues/5524)
* **custom-resources:** use latest SDK in AwsCustomResource ([#5442](https://github.com/aws/aws-cdk/issues/5442)) ([a111cdd](https://github.com/aws/aws-cdk/commit/a111cdd97928280b206c3dcfc522e642106e3a70)), closes [#2689](https://github.com/aws/aws-cdk/issues/2689) [#5063](https://github.com/aws/aws-cdk/issues/5063)
* **dynamodb:** Implement importing existing dynamodb table. ([#5280](https://github.com/aws/aws-cdk/issues/5280)) ([8d9b58b](https://github.com/aws/aws-cdk/commit/8d9b58bbf58c0b7281dbce79720e471e533a18c0)), closes [#3895](https://github.com/aws/aws-cdk/issues/3895)
* **ec2:** add `privateIpAddress` to Instance ([a00906d](https://github.com/aws/aws-cdk/commit/a00906d22317103156acacc597623aafa660acbb)), closes [#4004](https://github.com/aws/aws-cdk/issues/4004)
* **ec2:** support block devices for `Instance` ([#5567](https://github.com/aws/aws-cdk/issues/5567)) ([1085a27](https://github.com/aws/aws-cdk/commit/1085a27d6d57621b47f415a3e2a11166702e8709)), closes [#4773](https://github.com/aws/aws-cdk/issues/4773) [#4781](https://github.com/aws/aws-cdk/issues/4781)
* **ecr-assets:** custom docker files ([#5652](https://github.com/aws/aws-cdk/issues/5652)) ([1b25a4b](https://github.com/aws/aws-cdk/commit/1b25a4b44e992f076d0bcf2d805880fdbebca34a))
* **ecs-patterns:** higher-level constructs for ECS service with multiple target groups ([#5083](https://github.com/aws/aws-cdk/issues/5083)) ([c0a7192](https://github.com/aws/aws-cdk/commit/c0a7192c7a3b4a69a0415af679c684f7783c95c8))
* **eks:** EKS-Optimized AMI with GPU support for G4 instance ([#5479](https://github.com/aws/aws-cdk/issues/5479)) ([7b34d56](https://github.com/aws/aws-cdk/commit/7b34d5635ecda5db337dfab32711443f57ad1518))
* **eks:** helm chart support ([#5390](https://github.com/aws/aws-cdk/issues/5390)) ([394313e](https://github.com/aws/aws-cdk/commit/394313ee931e38bc20fc3dcb1cd2fd1b6f66822e))
* **glue:** add support for more DataFormats ([#5246](https://github.com/aws/aws-cdk/issues/5246)) ([ca535d0](https://github.com/aws/aws-cdk/commit/ca535d0b1f1e993e3cc452e9ebc2a4a268032998))
* **lambda:** configuration for async invocations ([#5299](https://github.com/aws/aws-cdk/issues/5299)) ([746ba32](https://github.com/aws/aws-cdk/commit/746ba3247a86a0cca60a1bb7897dd12848d904e9))
* **logs:** import a LogGroup from its name ([#5580](https://github.com/aws/aws-cdk/issues/5580)) ([9cbbaea](https://github.com/aws/aws-cdk/commit/9cbbaeae66311921c2db459e91f2a6943628577e))
* **rds:** more extensive secret rotation support ([#5281](https://github.com/aws/aws-cdk/issues/5281)) ([b700b77](https://github.com/aws/aws-cdk/commit/b700b778e74822e520867dbc5ff5524fb0c82eaf)), closes [#5194](https://github.com/aws/aws-cdk/issues/5194)
* **codebuild:** add Secrets Manager to CodeBuild environment variable types ([#5464](https://github.com/aws/aws-cdk/issues/5464)) ([ff1fa68](https://github.com/aws/aws-cdk/commit/ff1fa68408136f9677326f0d2d92a891396c0709))


### Bug Fixes

* **autoscaling:** every deployment resets capacity ([#5507](https://github.com/aws/aws-cdk/issues/5507)) ([0adf6c7](https://github.com/aws/aws-cdk/commit/0adf6c75c1f0aa4acc131915970a496326dc559f)), closes [#5215](https://github.com/aws/aws-cdk/issues/5215) [#5208](https://github.com/aws/aws-cdk/issues/5208)
* **aws-cdk:** upgrade canaries lambda node version ([#5674](https://github.com/aws/aws-cdk/issues/5674)) ([96b802b](https://github.com/aws/aws-cdk/commit/96b802b23f347a83617aa292e320cee20793b0c1))
* **codebuild:** ARM images have the wrong type and compute kind ([#5541](https://github.com/aws/aws-cdk/issues/5541)) ([6999baf](https://github.com/aws/aws-cdk/commit/6999baf4c493ce618e66c3a4e4f6f4970540a5d1)), closes [#5517](https://github.com/aws/aws-cdk/issues/5517)
* **codebuild:** cannot use immutable roles for Project ([6103180](https://github.com/aws/aws-cdk/commit/6103180c5427bb887fe1734330b109579874649d)), closes [#1408](https://github.com/aws/aws-cdk/issues/1408)
* **codebuild:** rename CodeBuild VPC policy to be unique ([#5385](https://github.com/aws/aws-cdk/issues/5385)) ([16a1200](https://github.com/aws/aws-cdk/commit/16a1200b7132f72772a5d5230e137f793cd56d7a))
* **core:** nested Fn.join with token fails ([#5679](https://github.com/aws/aws-cdk/issues/5679)) ([24ded60](https://github.com/aws/aws-cdk/commit/24ded60d82482b17bb08f98cba262f4f9bd23493)), closes [#5655](https://github.com/aws/aws-cdk/issues/5655)
* **cli:** java sample-app init template does not have a src/ directory ([#5546](https://github.com/aws/aws-cdk/issues/5546)) ([71947b5](https://github.com/aws/aws-cdk/commit/71947b5d7417e9ff26b59f16b6610fd176195662))
* **core:** nested stacks does not report missing context [#5594](https://github.com/aws/aws-cdk/issues/5594) ([#5638](https://github.com/aws/aws-cdk/issues/5638)) ([9472e09](https://github.com/aws/aws-cdk/commit/9472e0956c9e2ebe657462afe581fab5675c55cd))
* **core:** tags not working for cognito user pools ([#4225](https://github.com/aws/aws-cdk/issues/4225)) ([a67f0ef](https://github.com/aws/aws-cdk/commit/a67f0efb736f71ee8dd9c9ec31f8c867618849df)), closes [#3882](https://github.com/aws/aws-cdk/issues/3882)
* **custom-resources:** default timeout of 2 minutes for AwsCustomResource ([#5658](https://github.com/aws/aws-cdk/issues/5658)) ([e0c41d4](https://github.com/aws/aws-cdk/commit/e0c41d4246fc0588a298bb27efd743fc05439b36))
* **ec2:** allow ingress to VPC interface endpoints ([#4938](https://github.com/aws/aws-cdk/issues/4938)) ([d5ed97a](https://github.com/aws/aws-cdk/commit/d5ed97a84d91e4eb7b13c11c4b0b826625f564d4)), closes [#4937](https://github.com/aws/aws-cdk/issues/4937)
* **eks:** aws-auth username not set by default ([#5649](https://github.com/aws/aws-cdk/issues/5649)) ([87befa6](https://github.com/aws/aws-cdk/commit/87befa6f725072cb0fa3712e8819f97ef3698602)), closes [#5263](https://github.com/aws/aws-cdk/issues/5263)
* **eks:** default capacity uses desiredCapacity which is an anti-pattern ([#5651](https://github.com/aws/aws-cdk/issues/5651)) ([a883fed](https://github.com/aws/aws-cdk/commit/a883fed02a520068221c91ea3755cf63dd493f4e)), closes [#5215](https://github.com/aws/aws-cdk/issues/5215) [#5507](https://github.com/aws/aws-cdk/issues/5507) [#5650](https://github.com/aws/aws-cdk/issues/5650)
* **eks:** failures when creating or updating clusters ([#5540](https://github.com/aws/aws-cdk/issues/5540)) ([a13cfe6](https://github.com/aws/aws-cdk/commit/a13cfe683412f81198f65aa7639d52100ce3aa17)), closes [#5544](https://github.com/aws/aws-cdk/issues/5544) [#4087](https://github.com/aws/aws-cdk/issues/4087) [#4695](https://github.com/aws/aws-cdk/issues/4695) [#5259](https://github.com/aws/aws-cdk/issues/5259) [#5501](https://github.com/aws/aws-cdk/issues/5501)
* **eks:** generated cluster name can exceed 100 characters ([#5597](https://github.com/aws/aws-cdk/issues/5597)) ([3256a41](https://github.com/aws/aws-cdk/commit/3256a41787c365a67b01bee193bd75e48645f7a0)), closes [#5596](https://github.com/aws/aws-cdk/issues/5596)
* **eks:** kubernetes cannot create external load balancers ([#5448](https://github.com/aws/aws-cdk/issues/5448)) ([384d22d](https://github.com/aws/aws-cdk/commit/384d22da7198c1885df019e3cf985c16c59a825b)), closes [#5443](https://github.com/aws/aws-cdk/issues/5443)
* **iam:** policy added to resource for immutable Role ([#5568](https://github.com/aws/aws-cdk/issues/5568)) ([950a5f7](https://github.com/aws/aws-cdk/commit/950a5f76185f7e1197f006535d2638c6e79db2d2))
* **java:** resolve Java class naming error ([#5602](https://github.com/aws/aws-cdk/issues/5602)) ([e9ede13](https://github.com/aws/aws-cdk/commit/e9ede138b7681115f1fdf9e60b710fabd5bf14b4))
* **rds:** do not allow aurora engines when using DatabaseInstance ([#5367](https://github.com/aws/aws-cdk/issues/5367)) ([03b3b7a](https://github.com/aws/aws-cdk/commit/03b3b7a9ea0f8449e60d46370e9e4daec81d7c54)), closes [#5345](https://github.com/aws/aws-cdk/issues/5345)
* **s3n:** s3n lambda destination works with function by arn ([#5599](https://github.com/aws/aws-cdk/issues/5599)) ([7ceee6d](https://github.com/aws/aws-cdk/commit/7ceee6dacc268a3e2daecbec254c59886d28add6)), closes [#5592](https://github.com/aws/aws-cdk/issues/5592)
* **stepfunctions:** permission race condition on state machine deletion ([#5466](https://github.com/aws/aws-cdk/issues/5466)) ([c3ac965](https://github.com/aws/aws-cdk/commit/c3ac965b5c4cb816e9ecc974b741dc7e29fb86b1)), closes [#5336](https://github.com/aws/aws-cdk/issues/5336)
* **tests:** flaky integration tests in release pipeline ([#5485](https://github.com/aws/aws-cdk/issues/5485)) ([01800cf](https://github.com/aws/aws-cdk/commit/01800cfd848b84a3d7646738128946ef58eebf60))
* increase IAM wait timeout in integ test ([#5504](https://github.com/aws/aws-cdk/issues/5504)) ([f10b3e6](https://github.com/aws/aws-cdk/commit/f10b3e64feab9c9ccc78c9820dc99a8b6b0971ec))

## [1.19.0](https://github.com/aws/aws-cdk/compare/v1.18.0...v1.19.0) (2019-12-17)


### ⚠ BREAKING CHANGES

* **route53:** the value of `hostedZoneId` will no longer include `/hostedzone/` prefix and only includes the hostedZoneId when using  `HostedZone.fromLookup` or `fromHostedZoneAttributes`
* **cloudfront:** (experimental module) `S3OriginConfig.originAccessIdentityId` or type `string` has been removed in favor of `S3OriginConfig.originAccessIdentity` of type `IOriginAccessIdentity`.
* **cli:** `cdk diff` now exits with 0 even when there's a diff, use `--fail` to exit with 1. To enable this feature for old projects, add the context key `"aws-cdk:diffNoFail": "true"` in your `cdk.json` file.

### Features

* **appsync:** add L2 constuct for AppSync ([#4438](https://github.com/aws/aws-cdk/issues/4438)) ([226b27a](https://github.com/aws/aws-cdk/commit/226b27afe719093d074187bafb84231448e7b933))
* **cfnspec:** Update CloudFormation spec to v10.1.0 ([#5431](https://github.com/aws/aws-cdk/issues/5431)) ([ac905ac](https://github.com/aws/aws-cdk/commit/ac905aca92f2d3484b95739e16a796a49df6bcf6))
* **cli:** always exit with 0 on cdk diff (under feature flag) ([#4721](https://github.com/aws/aws-cdk/issues/4721)) ([3ffd810](https://github.com/aws/aws-cdk/commit/3ffd810879eae4144778a9a5c995aad88fa6d9d8)), closes [#4650](https://github.com/aws/aws-cdk/issues/4650) [#4708](https://github.com/aws/aws-cdk/issues/4708)
* **cloudformation:** import CloudFormation resource specification v9.1.1 ([#5297](https://github.com/aws/aws-cdk/issues/5297)) ([7f33541](https://github.com/aws/aws-cdk/commit/7f33541146ed96acb0ef8123f6a91e36d56e3e4e))
* **cloudformation:** update Resource Specification to v10.0.0 ([#5339](https://github.com/aws/aws-cdk/issues/5339)) ([3db8565](https://github.com/aws/aws-cdk/commit/3db856573498214e57afb9ffbf30697ba152e7b5)), closes [#5302](https://github.com/aws/aws-cdk/issues/5302)
* **cloudfront:** CloudFrontOriginAccessIdentity ([#4491](https://github.com/aws/aws-cdk/issues/4491)) ([8623fe5](https://github.com/aws/aws-cdk/commit/8623fe56d0d38bc9e02f1742601014924bd5250f))
* **codebuild:** support AL2 2.0 & Standard 3.0 ([#5226](https://github.com/aws/aws-cdk/issues/5226)) ([e6ef981](https://github.com/aws/aws-cdk/commit/e6ef98127d070e7e5aabf839cecc198594700e1b))
* **codebuild:** Support ARM-based AL2 image ([#5233](https://github.com/aws/aws-cdk/issues/5233)) ([8fc5622](https://github.com/aws/aws-cdk/commit/8fc562222f4a6ff37c125247b2a4a532524aba8a))
* **codepipeline:** allow retrieving created stages and actions ([#5206](https://github.com/aws/aws-cdk/issues/5206)) ([a5b056b](https://github.com/aws/aws-cdk/commit/a5b056b71e57b79aa568434fbe98bca207f2113f)), closes [#4878](https://github.com/aws/aws-cdk/issues/4878)
* **ec2:** access gateways created by NatProvider ([#4948](https://github.com/aws/aws-cdk/issues/4948)) ([5907055](https://github.com/aws/aws-cdk/commit/590705586eb545c2c55cea1c0733b6d5f0876765)), closes [#4858](https://github.com/aws/aws-cdk/issues/4858)
* **ec2:** Add missing EC2 instance types ([#5349](https://github.com/aws/aws-cdk/issues/5349)) ([#5350](https://github.com/aws/aws-cdk/issues/5350)) ([bc161d6](https://github.com/aws/aws-cdk/commit/bc161d6e2db80091fd82dc7b13a450fff5a7aa80))
* **ec2:** Add REKOGNITION_FIPS interface endpoint ([#5316](https://github.com/aws/aws-cdk/issues/5316)) ([b291280](https://github.com/aws/aws-cdk/commit/b291280d82677ae4f58ee1f78c44803b194864fd)), closes [#5314](https://github.com/aws/aws-cdk/issues/5314)
* **ecs:** Add support for ECS DeploymentController ([#5402](https://github.com/aws/aws-cdk/issues/5402)) ([58e67e6](https://github.com/aws/aws-cdk/commit/58e67e6185fae008d797c68417f1653b1ecee2d6))
* **ecs-patterns:** healthyPercent on ALB, NLB, Fargate ([#4820](https://github.com/aws/aws-cdk/issues/4820)) ([150e65c](https://github.com/aws/aws-cdk/commit/150e65cababe8ba44183436b9964f7b70f47eb0c))
* **events:** add static grantPutEvents() to EventBus ([#5133](https://github.com/aws/aws-cdk/issues/5133)) ([0823396](https://github.com/aws/aws-cdk/commit/08233965e7a1a32e518b08a4d6671ffe702a239d))
* **lambda:** function can be attached to a list of security groups in the vpc ([#5049](https://github.com/aws/aws-cdk/issues/5049)) ([4c1a9ec](https://github.com/aws/aws-cdk/commit/4c1a9ec2fbb08b7d3406e767e69e43a42fd935a9))
* **lambda:** provisioned concurrency ([#5308](https://github.com/aws/aws-cdk/issues/5308)) ([d50344a](https://github.com/aws/aws-cdk/commit/d50344abb643f6f2c200bba15cfce4d469485dd9)), closes [#5298](https://github.com/aws/aws-cdk/issues/5298)
* **region-info:** throw exception when no fact found ([#5166](https://github.com/aws/aws-cdk/issues/5166)) ([88df1eb](https://github.com/aws/aws-cdk/commit/88df1ebdbe9faf3717ed32a7daf96e3668bb483e)), closes [#3194](https://github.com/aws/aws-cdk/issues/3194)
* **sns:** support KMS masterKey on SNS ([#5052](https://github.com/aws/aws-cdk/issues/5052)) ([edd5395](https://github.com/aws/aws-cdk/commit/edd53959af38969339205a5c33aaab11acc72fa6)), closes [#1729](https://github.com/aws/aws-cdk/issues/1729)
* Make activating Python virtualenv easier on Windows ([#5014](https://github.com/aws/aws-cdk/issues/5014)) ([fc73747](https://github.com/aws/aws-cdk/commit/fc73747cc7c56ba7e2911745c3dc92e2d25b001b))


### Bug Fixes

* **apigateway:** unable to enable cors with a root proxy and LambdaRestApi ([#5249](https://github.com/aws/aws-cdk/issues/5249)) ([f3d5fc9](https://github.com/aws/aws-cdk/commit/f3d5fc98fefdf379f62925bbdf30bb7eecfa0a52)), closes [#5232](https://github.com/aws/aws-cdk/issues/5232)
* **cdk-dasm:** prevent duplicate imports ([#5293](https://github.com/aws/aws-cdk/issues/5293)) ([d4562b7](https://github.com/aws/aws-cdk/commit/d4562b78627599f5f2efbaf6573addd51ee932e2))
* **cli:** fix the behaviour for the `--generate-only` flag ([#5253](https://github.com/aws/aws-cdk/issues/5253)) ([ecbe0b6](https://github.com/aws/aws-cdk/commit/ecbe0b6ab2e652454d561879f699821bfb18b81a))
* **cli:** this.node.addError does not cause `cdk diff` to fail [#4700](https://github.com/aws/aws-cdk/issues/4700) ([#5284](https://github.com/aws/aws-cdk/issues/5284)) ([1b12dba](https://github.com/aws/aws-cdk/commit/1b12dba660acbff1b64780198db768f9b4f481ed))
* **cloudfront:** associated lambda role requires edgelambda.amazonaws.com ([#5191](https://github.com/aws/aws-cdk/issues/5191)) ([173d886](https://github.com/aws/aws-cdk/commit/173d8862f3ad8237357f4704c16ddfbcc0708a04)), closes [#5180](https://github.com/aws/aws-cdk/issues/5180)
* **codebuild:** add deprecation warning for UBUNTU_14_04 ([#5234](https://github.com/aws/aws-cdk/issues/5234)) ([c1b575f](https://github.com/aws/aws-cdk/commit/c1b575fb7ecc864600769d0fff2e85dc2e84db9c))
* **codepipeline:** CloudFormation deployment role always gets pipeline bucket and key permissions ([#5190](https://github.com/aws/aws-cdk/issues/5190)) ([d5c0f3e](https://github.com/aws/aws-cdk/commit/d5c0f3edd9b4315ad208af4d2a4308ec80f273ce)), closes [#5183](https://github.com/aws/aws-cdk/issues/5183)
* **core:** dependencies across stack boundaries of all kinds ([#5211](https://github.com/aws/aws-cdk/issues/5211)) ([d1f0dd5](https://github.com/aws/aws-cdk/commit/d1f0dd5b3192877329879e058f5cffb9b312cef5)), closes [#4460](https://github.com/aws/aws-cdk/issues/4460) [#4474](https://github.com/aws/aws-cdk/issues/4474)
* **dockerfile:** `docker build` is missing `dotnet` ([#5091](https://github.com/aws/aws-cdk/issues/5091)) ([18fa3aa](https://github.com/aws/aws-cdk/commit/18fa3aa985346d7764da0d700fdc70011b5e44ad))
* **docs:** update removed subscribeLambda method example ([#5060](https://github.com/aws/aws-cdk/issues/5060)) ([d2a86a5](https://github.com/aws/aws-cdk/commit/d2a86a575377737b7d5772afb6d012aa80fa2b0f))
* **dynamodb:** add missing permission for read stream data ([#5074](https://github.com/aws/aws-cdk/issues/5074)) ([22688ce](https://github.com/aws/aws-cdk/commit/22688ce838de5cd97d8ef3cf9694ce2e346d00dd))
* **dynamodb:** stacks created by GlobalTable correctly inherit their account. ([#5202](https://github.com/aws/aws-cdk/issues/5202)) ([5ad5407](https://github.com/aws/aws-cdk/commit/5ad54075fb3f7e363ab63c9cf02e01e1db4685b5)), closes [#4882](https://github.com/aws/aws-cdk/issues/4882)
* **ec2:** can't add non-default routes to subnets ([#5332](https://github.com/aws/aws-cdk/issues/5332)) ([e4309ab](https://github.com/aws/aws-cdk/commit/e4309abf07f3b0cc9f2f2f89789f14669f3d3581))
* **ec2:** CIDR for "any" IPv6 too long ([#5179](https://github.com/aws/aws-cdk/issues/5179)) ([3695d8c](https://github.com/aws/aws-cdk/commit/3695d8c64e070efc9b3ea42384aaf24e12af18ce))
* **ec2:** Fix CODEBUILD_FIPS interface endpoint ([#5315](https://github.com/aws/aws-cdk/issues/5315)) ([465c848](https://github.com/aws/aws-cdk/commit/465c8484c65acc69141acd3dad6a61e5955e7cc6))
* **ecr:** remove deprecated requirement on docs and comments ([#5428](https://github.com/aws/aws-cdk/issues/5428)) ([40ec78e](https://github.com/aws/aws-cdk/commit/40ec78e31cb476d42b329fee2cf35aaed7faed02)), closes [#2857](https://github.com/aws/aws-cdk/issues/2857) [#2857](https://github.com/aws/aws-cdk/issues/2857) [#3273](https://github.com/aws/aws-cdk/issues/3273)
* **init-templates:** use pytest for Python sample-app init template ([#5325](https://github.com/aws/aws-cdk/issues/5325)) ([6c25da7](https://github.com/aws/aws-cdk/commit/6c25da77089d38954d75d9b726b8b92845546057)), closes [#5313](https://github.com/aws/aws-cdk/issues/5313)
* **route53:** return plain hosted zone id without /hostedzone/ prefix ([#5230](https://github.com/aws/aws-cdk/issues/5230)) ([5e08753](https://github.com/aws/aws-cdk/commit/5e0875341fae8eee4489bcda495a6dcc246cad63))
* **sfn:** Task `parameters` property does nothing ([#5408](https://github.com/aws/aws-cdk/issues/5408)) ([01df7c6](https://github.com/aws/aws-cdk/commit/01df7c659bd8734f927b981e6e40aa675999671a)), closes [#5267](https://github.com/aws/aws-cdk/issues/5267)
* **test:** fix .nycrc symlinking ([#5245](https://github.com/aws/aws-cdk/issues/5245)) ([d2496e0](https://github.com/aws/aws-cdk/commit/d2496e0e1e4fa0b15604fa089105854e8e937e1f))

## [1.18.0](https://github.com/aws/aws-cdk/compare/v1.17.1...v1.18.0) (2019-11-25)

### General Availability of AWS CDK for .NET and Java!! 🎉🎉🥂🥂🍾🍾

We are excited to announce the general availability of support for the .NET family of languages (C#,
F#, ...) as well as Java!

We want to express our gratitude to all of our early customers as well as the amazing contributors
for all the help and support in making this release possible. Thank you for all the feedback
provided during the Developer Preview of .NET and Java support, without which the product would not
be what it is today.

Special thanks go out to a handful of amazing people who have provided instrumental support in
bringing .NET and Java support to this point:

* [Aaron Costley](http://github.com/costleya)
* [Ben Maizels](http://github.com/bmaizels)
* [Daniel Dinu](http://github.com/ddinu)
* [Erik Karlsson](http://github.com/McDoit)
* [Hamza Assyad](http://github.com/assyadh)
* [Jerry Kindall](http://github.com/Jerry-AWS)
* [Noah Litov](http://github.com/NGL321)
* [Richard Boyd](http://github.com/rhboyd)


Of course, we continue to be amazed and thrilled by the community contributions we received besides
language support. The passion demonstrated by the CDK community is heartwarming and largely
contributes to making maintaining the CDK an enjoyable, enriching experience!

### Features

* **lambda:** node12.x, python3.8 and java11 runtimes ([#5107](https://github.com/aws/aws-cdk/issues/5107)) ([e62f9fb](https://github.com/aws/aws-cdk/commit/e62f9fbe6b5658e9aad41452c6b8aecbc2fa94bc))
* **lambda:** unlock the lambda environment variables restriction in China regions ([#5122](https://github.com/aws/aws-cdk/issues/5122)) ([cc13009](https://github.com/aws/aws-cdk/commit/cc1300929b7823669a958283a1ed48311ce77e37))


### Bug Fixes

* **init/chsarp:** correct README for sample-app C# template ([#5144](https://github.com/aws/aws-cdk/issues/5144)) ([b2031f6](https://github.com/aws/aws-cdk/commit/b2031f673356a170012a48235a12e576ed4219f9))
* **init/sample-app:** numerous fixes and additions to the sample-app init templates ([#5119](https://github.com/aws/aws-cdk/issues/5119)) ([02c3b05](https://github.com/aws/aws-cdk/commit/02c3b0592b9640221909b8dd494f1dfc93b53539)), closes [#5130](https://github.com/aws/aws-cdk/issues/5130) [#5130](https://github.com/aws/aws-cdk/issues/5130)
* **init/java:** add -e to mvn command so errors aren't hidden ([#5129](https://github.com/aws/aws-cdk/issues/5129)) ([5427106](https://github.com/aws/aws-cdk/commit/5427106efab1629218c225c0e85dd627bf2ec76f)), closes [#5128](https://github.com/aws/aws-cdk/issues/5128)
* **init/csharp:** .NET semantic fixes for init templates ([#5154](https://github.com/aws/aws-cdk/issues/5154)) ([04a1b32](https://github.com/aws/aws-cdk/commit/04a1b326b7162896218ee8d2d3acd51353ddedfd))

### Known Issues

The following known issues were identified that specifically affect .NET and Java support in the CDK,
and which will be promptly addressed in upcoming CDK releases (in no particular order). See the
GitHub issues for more information and workarounds where applicable.

* **.NET** and **Java**: [`aws/jsii#1011`] - abstract members are not marked as such on their **.NET** and **Java** representations
* **.NET**: [`aws/jsii#1029`] - user-defined classes implementing CDK interfaces must extend `Amazon.Jsii.Runtime.Deputy.DeputyBase`
* **.NET**: [`aws/jsii#1042`] - Parameters typed object accept only primitive types, instances of CDK types, `Dictionary<string,?>`
* **.NET**: [`aws/jsii#1044`] - Unable to pass interface instance through in a `Dictionary<string,object>`
* **Java**: [`aws/jsii#1034`] - Implementing or overriding overloaded methods in Java does not work consistently
* **Java**: [`aws/jsii#1035`] - Returning `Lazy.anyValue` from an method whose return type is `java.lang.Object` may result in Resolution Errors
* **Java**: [`aws/jsii#1005`] - property getter implementations (e.g: from an interface) may be ignored

[`aws/jsii#1011`]: https://github.com/aws/jsii/issues/1011
[`aws/jsii#1029`]: https://github.com/aws/jsii/issues/1029
[`aws/jsii#1042`]: https://github.com/aws/jsii/issues/1042
[`aws/jsii#1044`]: https://github.com/aws/jsii/issues/1044
[`aws/jsii#1034`]: https://github.com/aws/jsii/issues/1034
[`aws/jsii#1035`]: https://github.com/aws/jsii/issues/1035
[`aws/jsii#1005`]: https://github.com/aws/jsii/issues/1005
[TypeScript API Reference]: https://docs.aws.amazon.com/cdk/api/latest/typescript/api/index.html

## [1.17.1](https://github.com/aws/aws-cdk/compare/v1.17.0...v1.17.1) (2019-11-19)


### Bug Fixes

* align all jsii deps to 0.20.7 ([15770f4](https://github.com/aws/aws-cdk/commit/15770f48a040ad0ac66d2381cb47c587e397f528))

## [1.17.0](https://github.com/aws/aws-cdk/compare/v1.16.1...v1.17.0) (2019-11-19)


### Features

* **cfnspec:** update CloudFormation Resource Specification to v8.0.0 ([#5031](https://github.com/aws/aws-cdk/issues/5031)) ([1896de2](https://github.com/aws/aws-cdk/commit/1896de2cea8d2d6e922db4354c9b82574bb762d9))
* **cli:** adding new option to `cdk deploy` to indicate whether ChangeSet should be executed ([#4852](https://github.com/aws/aws-cdk/issues/4852)) ([c02c9e5](https://github.com/aws/aws-cdk/commit/c02c9e5518bfb2d8f8195322b7fd97343f5ca63b)), closes [#4739](https://github.com/aws/aws-cdk/issues/4739)
* **custom-resources:** python handler skeleton in readme ([#4977](https://github.com/aws/aws-cdk/issues/4977)) ([f0a62fd](https://github.com/aws/aws-cdk/commit/f0a62fd5324cc368752bc75f0bdae620a13e826d)
* upgrade all uses of node8.10 lambda runtime to node10.x ([#5075](https://github.com/aws/aws-cdk/issues/5075)) ([7a3a3b1](https://github.com/aws/aws-cdk/commit/7a3a3b1c45fd5d773db71c2a6c45a3ff64c5510c)), [#4655](https://github.com/aws/aws-cdk/issues/4655) [#4653](https://github.com/aws/aws-cdk/issues/4653) [#4642](https://github.com/aws/aws-cdk/issues/4642)
* upgrade to jsii 0.20.7 ([#5103](https://github.com/aws/aws-cdk/issues/5103)) ([5ebc633](https://github.com/aws/aws-cdk/commit/5ebc633e0160d684084cf05eaa590caebedd9b2f)), closes [aws/aws-cdk#4316](https://github.com/aws/aws-cdk/issues/4316) [#994](https://github.com/aws/aws-cdk/issues/994) [aws/aws-cdk#5066](https://github.com/aws/aws-cdk/issues/5066) [#904](https://github.com/aws/aws-cdk/issues/904) [#925](https://github.com/aws/aws-cdk/issues/925)

### Bug Fixes

* **cli:** cdk bootstrap is broken due to --no-execute ([#5092](https://github.com/aws/aws-cdk/issues/5092)) ([7acc588](https://github.com/aws/aws-cdk/commit/7acc588d5e6c7a15edfd7ff275453d6da6741199))
* **cli:** cdk version prints to STDERR instead of STDOUT like --version ([#5095](https://github.com/aws/aws-cdk/issues/5095)) ([ae5170c](https://github.com/aws/aws-cdk/commit/ae5170c9b4fa1c693ab7ae190aa07732d74911c7)), closes [#4720](https://github.com/aws/aws-cdk/issues/4720)
* **core:** unable to find stack by name using the cli in legacy mode ([#4998](https://github.com/aws/aws-cdk/issues/4998)) ([26bba19](https://github.com/aws/aws-cdk/commit/26bba196abc6e67b3d6424b281beee6aa60079d3)), closes [#4895](https://github.com/aws/aws-cdk/issues/4895) [#4997](https://github.com/aws/aws-cdk/issues/4997)
* **custom-resources:** flatten objects with null values in AwsCustomResource ([#5073](https://github.com/aws/aws-cdk/issues/5073)) ([f4ea264](https://github.com/aws/aws-cdk/commit/f4ea264708c309675a4248a54939af7ee1c93342)), closes [#5061](https://github.com/aws/aws-cdk/issues/5061)
* **ecs-patterns:** Fix issue related to protocol being passed to target group ([#4988](https://github.com/aws/aws-cdk/issues/4988)) ([a257d4d](https://github.com/aws/aws-cdk/commit/a257d4d07f11cba666a7dd1b8005736ca7113bc3))
* **init-templates:** update init templates for csharp and java ([#5059](https://github.com/aws/aws-cdk/issues/5059)) ([2d92ab3](https://github.com/aws/aws-cdk/commit/2d92ab3e22130408056257d87620a3e03d75b226))
* **logs:** cannot use same Lambda for multiple SubscriptionFilters ([#4975](https://github.com/aws/aws-cdk/issues/4975)) ([94f5017](https://github.com/aws/aws-cdk/commit/94f501729af80e17eee67c9107a897840d8347ce)), closes [#4951](https://github.com/aws/aws-cdk/issues/4951)

## [1.16.3](https://github.com/aws/aws-cdk/compare/v1.16.2...v1.16.3) (2019-11-13)


### Bug Fixes

* **ecs-patterns:** Fix issue related to protocol being passed to target group ([#4988](https://github.com/aws/aws-cdk/issues/4988)) ([6bb29b5](https://github.com/aws/aws-cdk/commit/6bb29b5b7d4ed200ebb0e217f2f4de2630fa18cd))
* **core:** unable to find stack by name using the cli in legacy mode ([#4998](https://github.com/aws/aws-cdk/issues/4998)) ([26bba19](https://github.com/aws/aws-cdk/commit/26bba196abc6e67b3d6424b281beee6aa60079d3))

## [1.16.2](https://github.com/aws/aws-cdk/compare/v1.16.1...v1.16.2) (2019-11-12)


### Bug Fixes

* **python:** correct handling of inline-dict for nested props ([7666264](https://github.com/aws/aws-cdk/commit/76662640a8e9f113e4997b1a981410b1718da1c1))

## [1.16.1](https://github.com/aws/aws-cdk/compare/v1.16.0...v1.16.1) (2019-11-11)


### Bug Fixes

* **jsii:** correct handling of mappings into `object` parameters ([0d23eb3](https://github.com/aws/aws-cdk/commit/0d23eb35245271e6ad43058f83ce4028999c1f7d))

## [1.16.0](https://github.com/aws/aws-cdk/compare/v1.15.0...v1.16.0) (2019-11-11)


### ⚠ BREAKING CHANGES

* **core:** template file names in `cdk.out` for new projects created by `cdk init` will use `stack.artifactId` instead of the physical stack name to enable multiple stacks to use the same name. In most cases the artifact ID is the same as the stack name. To enable this fix for old projects, add the context key `@aws-cdk/core:enableStackNameDuplicates: true` in your `cdk.json` file.

### Features

* **apigateway:** publish api endpoint through an export name [#3662](https://github.com/aws/aws-cdk/issues/3662)  ([#4849](https://github.com/aws/aws-cdk/issues/4849)) ([652a8f5](https://github.com/aws/aws-cdk/commit/652a8f5b4d253babb57dfb3f900794071509a565))
* **aws-ecr:** add onImageScanCompleted() support ([#4819](https://github.com/aws/aws-cdk/issues/4819)) ([5bdd9bb](https://github.com/aws/aws-cdk/commit/5bdd9bb04ecfbaeba9a37235c5286756ad6c67ef)), closes [#4818](https://github.com/aws/aws-cdk/issues/4818)
* **aws-eks:** support aws/aws-node-termination-handler as the default spot draining handler ([#4931](https://github.com/aws/aws-cdk/issues/4931)) ([f4a41d1](https://github.com/aws/aws-cdk/commit/f4a41d1c68a42e796294692ef00c1fbc83d5dcff))
* **aws-events:** Adds EventBus resources ([#4609](https://github.com/aws/aws-cdk/issues/4609)) ([bbec8c5](https://github.com/aws/aws-cdk/commit/bbec8c5c3995b9400cfd6ad0d7a71e8f8646a3b9))
* **cfnspec:** update CloudFormation spec to 7.3.0 ([#4838](https://github.com/aws/aws-cdk/issues/4838)) ([ed904cb](https://github.com/aws/aws-cdk/commit/ed904cbad7a562acf32e4868de7f2c29c9e6d889))
* **cli:** add @types/node to typescript init templates ([#4947](https://github.com/aws/aws-cdk/issues/4947)) ([efde8e9](https://github.com/aws/aws-cdk/commit/efde8e948f548f86c1c090fe2b7ea255271c7f56)), closes [#3839](https://github.com/aws/aws-cdk/issues/3839) [#4462](https://github.com/aws/aws-cdk/issues/4462) [#3840](https://github.com/aws/aws-cdk/issues/3840)
* **cli:** cdk version command ([#4720](https://github.com/aws/aws-cdk/issues/4720)) ([3459982](https://github.com/aws/aws-cdk/commit/345998259296d2d320898d7bc060c25d585c5994))
* **cli:** docker image asset scanning by default ([#4874](https://github.com/aws/aws-cdk/issues/4874)) ([87421c9](https://github.com/aws/aws-cdk/commit/87421c927e3ea60b4de6101791f3cf7dcdf877f9))
* **cli:** dotnet init templates come with Roslyn Analyzers ([#4765](https://github.com/aws/aws-cdk/issues/4765)) ([fbd007e](https://github.com/aws/aws-cdk/commit/fbd007e7271ca939f57703a9e7f9c90cc5c0c0ae))
* **cloudwatch:** allow overriding of metric graph rendering ([#4571](https://github.com/aws/aws-cdk/issues/4571)) ([3643130](https://github.com/aws/aws-cdk/commit/36431300677c5984525362a0f16d1da9bdd4b489))
* **core:** add resource type and properties for all CfnResource constructs to tree.json ([#4894](https://github.com/aws/aws-cdk/issues/4894)) ([4037155](https://github.com/aws/aws-cdk/commit/4037155eaa23ed66ee5d5ca708a70e192050eb3b)), closes [#4562](https://github.com/aws/aws-cdk/issues/4562)
* **core:** cdk init --generate-only ([#4826](https://github.com/aws/aws-cdk/issues/4826)) ([9cc1e52](https://github.com/aws/aws-cdk/commit/9cc1e52553fd4a0faa5958197d8a94b5928be40f))
* **custom-resources:** allow specifying role for AwsCustomResource ([#4909](https://github.com/aws/aws-cdk/issues/4909)) ([98fb888](https://github.com/aws/aws-cdk/commit/98fb88803a3cef250a230780f221167c3ad4daf1)), closes [#4906](https://github.com/aws/aws-cdk/issues/4906)
* **custom-resources:** implement IGrantable for AwsCustomResource ([#4790](https://github.com/aws/aws-cdk/issues/4790)) ([b840784](https://github.com/aws/aws-cdk/commit/b840784505232aa2399ab94a960e60f5d6d0faa1)), closes [#4710](https://github.com/aws/aws-cdk/issues/4710)
* **ec2:** allow using existing security groups with interface VPC endpoints ([#4908](https://github.com/aws/aws-cdk/issues/4908)) ([bda28e8](https://github.com/aws/aws-cdk/commit/bda28e874ca48b3f20876f478df21e07d63c4af3)), closes [#4589](https://github.com/aws/aws-cdk/issues/4589) [#2699](https://github.com/aws/aws-cdk/issues/2699) [#3446](https://github.com/aws/aws-cdk/issues/3446)
* **ec2:** support NAT instances, AMI lookups ([#4898](https://github.com/aws/aws-cdk/issues/4898)) ([dca9a24](https://github.com/aws/aws-cdk/commit/dca9a242058d93c29213e3bd75e27ac709255e9f)), closes [#4876](https://github.com/aws/aws-cdk/issues/4876)
* **ecs:** add cloudMapNamespace as a property of cloudMapOptions ([#4890](https://github.com/aws/aws-cdk/issues/4890)) ([06caf4f](https://github.com/aws/aws-cdk/commit/06caf4f2b9165337bdcb6042e5cd03b08cc9a37b))
* feature flags rfc ([#4925](https://github.com/aws/aws-cdk/issues/4925)) ([db50ab0](https://github.com/aws/aws-cdk/commit/db50ab01a74fcd2369845fe0226373e4a0755d62))
* **custom-resources:** provider framework ([#4572](https://github.com/aws/aws-cdk/issues/4572)) ([f9eec04](https://github.com/aws/aws-cdk/commit/f9eec0437273e946eca8d833aede49c08b238478))
* **ecs-patterns:** add listener port as a property for network/application load balanced services ([#4825](https://github.com/aws/aws-cdk/issues/4825)) ([20b8e5d](https://github.com/aws/aws-cdk/commit/20b8e5dd6e3030bcc6f139f2fa07658d65cf77d4)), closes [#4793](https://github.com/aws/aws-cdk/issues/4793)
* **elbv2:** add redirect action of ALB's listener ([#4606](https://github.com/aws/aws-cdk/issues/4606)) ([c770d3c](https://github.com/aws/aws-cdk/commit/c770d3cd167760ef6fb9b13c8fea89e16bceec64)), closes [#4546](https://github.com/aws/aws-cdk/issues/4546)
* **events:** support event bus for rule ([#4839](https://github.com/aws/aws-cdk/issues/4839)) ([f5858ba](https://github.com/aws/aws-cdk/commit/f5858baa1d849c913807d6ed1fedfe5b8d66966b))
* **s3:** onCloudTrailWriteObject matches all update events ([#4723](https://github.com/aws/aws-cdk/issues/4723)) ([46d9885](https://github.com/aws/aws-cdk/commit/46d9885f9765f4a54233ee1c5652812aec571bb9)), closes [#4634](https://github.com/aws/aws-cdk/issues/4634)
* **sns:** support cross-region subscription on imported topics ([#4917](https://github.com/aws/aws-cdk/issues/4917)) ([3dd194d](https://github.com/aws/aws-cdk/commit/3dd194d47b40bd4779b8b242810d3a01ebef9623)), closes [#3842](https://github.com/aws/aws-cdk/issues/3842)
* **stepfunctions:** add `EvaluateExpression` task ([#4602](https://github.com/aws/aws-cdk/issues/4602)) ([6dba637](https://github.com/aws/aws-cdk/commit/6dba6371b86fc190ddaa7e511e59703bc265f658))
* **vpc:** allow Vpc.fromLookup() to discover asymmetric subnets ([#4544](https://github.com/aws/aws-cdk/issues/4544)) ([2ccb745](https://github.com/aws/aws-cdk/commit/2ccb74574fe8e9522b9a63a63048e14e0c37456f)), closes [#3407](https://github.com/aws/aws-cdk/issues/3407)


### Bug Fixes

* **apigateway:** allow multiple api keys to the same usage plan ([#4903](https://github.com/aws/aws-cdk/issues/4903)) ([142bd0e](https://github.com/aws/aws-cdk/commit/142bd0e2fe33de239fc34f72d7f74aab81457607)), closes [#4860](https://github.com/aws/aws-cdk/issues/4860)
* **assets:** support exceptions to exclude patterns ([#4473](https://github.com/aws/aws-cdk/issues/4473)) ([b7b4336](https://github.com/aws/aws-cdk/commit/b7b43367d120a3190f75a88755e428f7bb8883d1))
* **cloudfront:** aliasConfiguration fallback identifier conflict ([#4760](https://github.com/aws/aws-cdk/issues/4760)) ([4d16f79](https://github.com/aws/aws-cdk/commit/4d16f79b3a5bb167aa667406d423e0ea8b89a762))
* **cloudfront:** revert certificate region verification ([#4734](https://github.com/aws/aws-cdk/issues/4734)) ([de0eb47](https://github.com/aws/aws-cdk/commit/de0eb47fb5b4f970f88d3a6823b822197ca94f5a))
* **core:** cannot use the same stack name for multiple stacks (under feature flag) ([#4895](https://github.com/aws/aws-cdk/issues/4895)) ([658f100](https://github.com/aws/aws-cdk/commit/658f100b0afcdd121f242509859478fb59db9f23)), closes [#4412](https://github.com/aws/aws-cdk/issues/4412)
* **dockerfile:** add yarn ([#4844](https://github.com/aws/aws-cdk/issues/4844)) ([2f8d06a](https://github.com/aws/aws-cdk/commit/2f8d06a480228ef5a58e14e1af8b67bd466d21b2))
* **dynamodb:** Fix AutoScaling role ARN ([#4854](https://github.com/aws/aws-cdk/issues/4854)) ([fc054e9](https://github.com/aws/aws-cdk/commit/fc054e915594c5c539bacd94b53f102617fc4d08))
* **dynamodb-global:** cannot deploy global tables due to unresolved resource dependencies ([45f0e02](https://github.com/aws/aws-cdk/commit/45f0e02735f6e12becccc606447607c2dda9c3a5)), closes [#4676](https://github.com/aws/aws-cdk/issues/4676)
* **ecs-patterns:** handle desired task count being set to 0 ([#4722](https://github.com/aws/aws-cdk/issues/4722)) ([c31ca27](https://github.com/aws/aws-cdk/commit/c31ca27f199d194e077632768df0ad1292068c9e))
* **eks:** pass `--use-max-pods` to bootstrap options when false ([#4753](https://github.com/aws/aws-cdk/issues/4753)) ([22fe0ce](https://github.com/aws/aws-cdk/commit/22fe0ce5d5c39564c85f2a4af6f150bd8fac1bae))
* **elbv2:** update region/account map of elbv2 ([#4738](https://github.com/aws/aws-cdk/issues/4738)) ([5d98e7f](https://github.com/aws/aws-cdk/commit/5d98e7f3556852f29dc7fa1d240be07742c2a1e2))
* **init:** 'cdk init' doesn't leave .d.ts files ([#4841](https://github.com/aws/aws-cdk/issues/4841)) ([10b5b3c](https://github.com/aws/aws-cdk/commit/10b5b3c37d944543a83d6ebcb7092c163e08f9a7))
* **init:** remove automatic JSII Roslyn analyzer dependency ([#4835](https://github.com/aws/aws-cdk/issues/4835)) ([5029f0e](https://github.com/aws/aws-cdk/commit/5029f0e0edbfb1bea7ce9a051fe5922fa9091c4f))
* **init/csharp:** correct cdk.json 'app' command ([#4778](https://github.com/aws/aws-cdk/issues/4778)) ([d89504f](https://github.com/aws/aws-cdk/commit/d89504fec52df8cb9378c8f2b10eb0fce236c510))
* **ssm:** malformed ARNs for parameters with physical names that use path notation ([#4842](https://github.com/aws/aws-cdk/issues/4842)) ([43f276a](https://github.com/aws/aws-cdk/commit/43f276ad526cb0e257bcfd1d5061be9624b945c4))

In addition to the above, several bugs in the Python, .NET and Java release of the CDK have been addressed.

## [1.15.0](https://github.com/aws/aws-cdk/compare/v1.14.0...v1.15.0) (2019-10-28)


### ⚠ BREAKING CHANGES

* **rds:** `securityGroup: ec2.ISecurityGroup` is now `securityGroups: ec2.ISecurityGroup[]` in `DatabaseInstanceAttributes`
* **rds:** removed `securityGroupId` from `IDatabaseInstance`

### Bug Fixes

* **acm:** update CertificateRequestorFunction runtime ([#4612](https://github.com/aws/aws-cdk/issues/4612)) ([a711425](https://github.com/aws/aws-cdk/commit/a711425)), closes [#4610](https://github.com/aws/aws-cdk/issues/4610)
* **assets:** docker asset versions are pushed to separate repositories ([#4537](https://github.com/aws/aws-cdk/issues/4537)) ([8484114](https://github.com/aws/aws-cdk/commit/8484114)), closes [#4535](https://github.com/aws/aws-cdk/issues/4535)
* **aws-lambda:** update deprecation warning for node.js 8.10 ([#4624](https://github.com/aws/aws-cdk/issues/4624)) ([ace8041](https://github.com/aws/aws-cdk/commit/ace8041))
* **cli:** add Cloud Assembly backwards compat tests ([#4625](https://github.com/aws/aws-cdk/issues/4625)) ([5d2e5e3](https://github.com/aws/aws-cdk/commit/5d2e5e3)), closes [#4475](https://github.com/aws/aws-cdk/issues/4475) [#4544](https://github.com/aws/aws-cdk/issues/4544)
* **cloudformation:** cannot reference resource attributes with "." in nested stacks ([#4684](https://github.com/aws/aws-cdk/issues/4684)) ([561bb73](https://github.com/aws/aws-cdk/commit/561bb73))
* **codebuild:** revert validation that only a project with source CODEPIPELINE can be added to a pipeline ([#4689](https://github.com/aws/aws-cdk/issues/4689)) ([8e72720](https://github.com/aws/aws-cdk/commit/8e72720)), closes [#4646](https://github.com/aws/aws-cdk/issues/4646)
* **codepipeline:** the CodeBuild action now works with imported projects ([#4637](https://github.com/aws/aws-cdk/issues/4637)) ([6c4085e](https://github.com/aws/aws-cdk/commit/6c4085e)), closes [#4613](https://github.com/aws/aws-cdk/issues/4613)
* **core:** fix docs for CfnInclude ([#4703](https://github.com/aws/aws-cdk/issues/4703)) ([ba38b76](https://github.com/aws/aws-cdk/commit/ba38b76)), closes [#3424](https://github.com/aws/aws-cdk/issues/3424)
* **core:** removalpolicy correct default ([#4499](https://github.com/aws/aws-cdk/issues/4499)) ([09d89c3](https://github.com/aws/aws-cdk/commit/09d89c3)), closes [#4416](https://github.com/aws/aws-cdk/issues/4416)
* **custom-resources:** increase and expose timeout for AwsCustomResource ([#4623](https://github.com/aws/aws-cdk/issues/4623)) ([f17f809](https://github.com/aws/aws-cdk/commit/f17f809)), closes [#3272](https://github.com/aws/aws-cdk/issues/3272)
* **eks:** cannot update cluster configuration ([#4696](https://github.com/aws/aws-cdk/issues/4696)) ([e17ba55](https://github.com/aws/aws-cdk/commit/e17ba55)), closes [#4311](https://github.com/aws/aws-cdk/issues/4311) [#4310](https://github.com/aws/aws-cdk/issues/4310)
* **elbv2:** fix disabling proxy protocol v2 attribute for NetworkTargetGroup ([#4596](https://github.com/aws/aws-cdk/issues/4596)) ([8b598c4](https://github.com/aws/aws-cdk/commit/8b598c4)), closes [#4574](https://github.com/aws/aws-cdk/issues/4574)
* **iam:** fix `managedPolicyName`, cross-account references ([#4630](https://github.com/aws/aws-cdk/issues/4630)) ([9b7d2d0](https://github.com/aws/aws-cdk/commit/9b7d2d0)), closes [#4581](https://github.com/aws/aws-cdk/issues/4581) [#4567](https://github.com/aws/aws-cdk/issues/4567)
* **ssm:** invalid parameter arn ([#4685](https://github.com/aws/aws-cdk/issues/4685)) ([e26a36c](https://github.com/aws/aws-cdk/commit/e26a36c)), closes [#4672](https://github.com/aws/aws-cdk/issues/4672)


### Features

* **apigateway:** add convenience url property at resource level ([#4686](https://github.com/aws/aws-cdk/issues/4686)) ([012eeed](https://github.com/aws/aws-cdk/commit/012eeed))
* **autoscaling:** let AutoScalingGroup be IGrantable ([#4654](https://github.com/aws/aws-cdk/issues/4654)) ([406dc8e](https://github.com/aws/aws-cdk/commit/406dc8e))
* **cloudfront:** complete viewerCertificate support ([#4579](https://github.com/aws/aws-cdk/issues/4579)) ([80b4ac9](https://github.com/aws/aws-cdk/commit/80b4ac9))
* **codedeploy:** Model ECS deployment resources and pipeline action ([#4600](https://github.com/aws/aws-cdk/issues/4600)) ([ed639ca](https://github.com/aws/aws-cdk/commit/ed639ca))
* **codepipeline:** add ability to override env variables in CodeBuild actions ([#4502](https://github.com/aws/aws-cdk/issues/4502)) ([c0c0513](https://github.com/aws/aws-cdk/commit/c0c0513)), closes [#4531](https://github.com/aws/aws-cdk/issues/4531)
* **ec2:** Support explicit Subnet selection ([#4622](https://github.com/aws/aws-cdk/issues/4622)) ([203a605](https://github.com/aws/aws-cdk/commit/203a605))
* **ecs:** add support for start and stop timeout in ContainerDefinition ([#4638](https://github.com/aws/aws-cdk/issues/4638)) ([b00c0af](https://github.com/aws/aws-cdk/commit/b00c0af))
* **ecs-patterns:** add family name to load balanced service properties ([#4688](https://github.com/aws/aws-cdk/issues/4688)) ([d7654e7](https://github.com/aws/aws-cdk/commit/d7654e7))
* **ecs-patterns:** add service name to queue processing service properties ([#4505](https://github.com/aws/aws-cdk/issues/4505)) ([3202720](https://github.com/aws/aws-cdk/commit/3202720)), closes [#4504](https://github.com/aws/aws-cdk/issues/4504) [#4504](https://github.com/aws/aws-cdk/issues/4504)
* **rds:** allow using existing security groups for new instance ([#4495](https://github.com/aws/aws-cdk/issues/4495)) ([ef1ce5e](https://github.com/aws/aws-cdk/commit/ef1ce5e)), closes [#2949](https://github.com/aws/aws-cdk/issues/2949)
* **vpc:** additional validation around Subnet Types ([#4668](https://github.com/aws/aws-cdk/issues/4668)) ([9a96c37](https://github.com/aws/aws-cdk/commit/9a96c37)), closes [#3704](https://github.com/aws/aws-cdk/issues/3704)

## [1.14.0](https://github.com/aws/aws-cdk/compare/v1.13.1...v1.14.0) (2019-10-22)

**NOTICE**: since Node.js 8.x is going out of maintenance [early next year](https://nodejs.org/en/about/releases), starting in the next release, we will only test the AWS CDK against Node.js 10.x. If you are using an older version of Node.js, we recommend to [upgrade](https://nodejs.org/en/).

### Bug Fixes

* **apigateway:** deployment not invalidated when integration is changed ([#4552](https://github.com/aws/aws-cdk/issues/4552)) ([eac7695](https://github.com/aws/aws-cdk/commit/eac7695)), closes [#4551](https://github.com/aws/aws-cdk/issues/4551) [aws-samples/aws-cdk-intro-workshop#83](https://github.com/aws-samples/aws-cdk-intro-workshop/issues/83)
* **cli:** patch security vulnerability in https-proxy-agent (npm advisory 1184) ([#4603](https://github.com/aws/aws-cdk/issues/4603)) ([ddb05f9](https://github.com/aws/aws-cdk/commit/ddb05f9))
* **cli:** upgrade proxy-agent to address security volnarability ([#4618](https://github.com/aws/aws-cdk/issues/4618)) ([5a941a2](https://github.com/aws/aws-cdk/commit/5a941a2))
* **cloudfront:** expose CfnDistribution as defaultChild ([#4556](https://github.com/aws/aws-cdk/issues/4556)) ([8a79cad](https://github.com/aws/aws-cdk/commit/8a79cad))
* **codepipeline:** work around CodeBuild's pipeline key bug ([#4183](https://github.com/aws/aws-cdk/issues/4183)) ([b149b02](https://github.com/aws/aws-cdk/commit/b149b02)), closes [#4033](https://github.com/aws/aws-cdk/issues/4033)
* **core:** child stack assembly metadata is duplidated on parent ([#4540](https://github.com/aws/aws-cdk/issues/4540)) ([eeb5ae9](https://github.com/aws/aws-cdk/commit/eeb5ae9)), closes [#2900](https://github.com/aws/aws-cdk/issues/2900)
* **eks:** invalid arn when mapping users to rbac ([#4549](https://github.com/aws/aws-cdk/issues/4549)) ([8f4a38d](https://github.com/aws/aws-cdk/commit/8f4a38d)), closes [#4545](https://github.com/aws/aws-cdk/issues/4545)
* **elbv2:** correct wrong invalidation rules ([#4583](https://github.com/aws/aws-cdk/issues/4583)) ([5f50e5f](https://github.com/aws/aws-cdk/commit/5f50e5f))
* **region-info:** add eu-west-1 to AWS_OLDER_REGIONS ([#4584](https://github.com/aws/aws-cdk/issues/4584)) ([7055ee3](https://github.com/aws/aws-cdk/commit/7055ee3))
* **s3:** access denied when adding an event notification to a s3 bucket ([#4219](https://github.com/aws/aws-cdk/issues/4219)) ([6f22446](https://github.com/aws/aws-cdk/commit/6f22446)), closes [#3318](https://github.com/aws/aws-cdk/issues/3318)
* **s3:** bucket notifications deleted during stack update ([#4458](https://github.com/aws/aws-cdk/issues/4458)) ([f5daa6e](https://github.com/aws/aws-cdk/commit/f5daa6e)), closes [#1566](https://github.com/aws/aws-cdk/issues/1566)
* **ssm:** allow specifying encryption key ([#4511](https://github.com/aws/aws-cdk/issues/4511)) ([02a447f](https://github.com/aws/aws-cdk/commit/02a447f)), closes [#4498](https://github.com/aws/aws-cdk/issues/4498)
* **stepfunctions:** map state validation fix ([#4382](https://github.com/aws/aws-cdk/issues/4382)) ([bbe0380](https://github.com/aws/aws-cdk/commit/bbe0380))
* **stepfunctions-tasks:** update resourceArn in service integrations ([#4598](https://github.com/aws/aws-cdk/issues/4598)) ([b0f8a74](https://github.com/aws/aws-cdk/commit/b0f8a74)), closes [#4597](https://github.com/aws/aws-cdk/issues/4597)


### Features

* **apigateway:** cors preflight support ([#4211](https://github.com/aws/aws-cdk/issues/4211)) ([0f06223](https://github.com/aws/aws-cdk/commit/0f06223))
* **ec2:** mutable? param for imported SecurityGroups ([#4493](https://github.com/aws/aws-cdk/issues/4493)) ([9764996](https://github.com/aws/aws-cdk/commit/9764996))
* **ecs-patterns:** add family name to queue processing service properties ([#4508](https://github.com/aws/aws-cdk/issues/4508)) ([b0874bb](https://github.com/aws/aws-cdk/commit/b0874bb)), closes [#4507](https://github.com/aws/aws-cdk/issues/4507)

## [1.13.1](https://github.com/aws/aws-cdk/compare/v1.13.0...v1.13.1) (2019-10-15)


### Bug Fixes

* **cli:** fix bootstrap so that it has a default for tags on the stack. ([#4519](https://github.com/aws/aws-cdk/issues/4519)) ([f4a20a6](https://github.com/aws/aws-cdk/commit/f4a20a6)), closes [#4320](https://github.com/aws/aws-cdk/issues/4320) [#4518](https://github.com/aws/aws-cdk/issues/4518)

## [1.13.0](https://github.com/aws/aws-cdk/compare/v1.12.0...v1.13.0) (2019-10-15)


### Bug Fixes

* **codepipeline:** allow adding an S3 source action with the same bucket multiple times ([#4481](https://github.com/aws/aws-cdk/issues/4481)) ([87458c1](https://github.com/aws/aws-cdk/commit/87458c1)), closes [#4237](https://github.com/aws/aws-cdk/issues/4237)
* use fixed dependency versions between CDK packages ([#4470](https://github.com/aws/aws-cdk/issues/4470)) ([1d1b8bc](https://github.com/aws/aws-cdk/commit/1d1b8bc))
* **cli:** remove warning about assets not included in diff ([#4454](https://github.com/aws/aws-cdk/issues/4454)) ([123c594](https://github.com/aws/aws-cdk/commit/123c594)), closes [#395](https://github.com/aws/aws-cdk/issues/395)
* **cli:** Use RegionalDomainName attribute in output of Toolkit stack for GovCloud and CN compatibility ([#4427](https://github.com/aws/aws-cdk/issues/4427)) ([adbc2e3](https://github.com/aws/aws-cdk/commit/adbc2e3)), closes [#1469](https://github.com/aws/aws-cdk/issues/1469)
* **codepipeline:** do not retain the default bucket key and alias ([#4400](https://github.com/aws/aws-cdk/issues/4400)) ([9740ed3](https://github.com/aws/aws-cdk/commit/9740ed3)), closes [#4336](https://github.com/aws/aws-cdk/issues/4336)
* **elbv2:** add new FS security policies ([#4425](https://github.com/aws/aws-cdk/issues/4425)) ([a4e63bd](https://github.com/aws/aws-cdk/commit/a4e63bd))
* **elbv2:** validate healthcheck intervals ([#4280](https://github.com/aws/aws-cdk/issues/4280)) ([3627e23](https://github.com/aws/aws-cdk/commit/3627e23)), closes [#4279](https://github.com/aws/aws-cdk/issues/4279)
* **s3-deployment:** lambda "src" not included in published module ([#4430](https://github.com/aws/aws-cdk/issues/4430)) ([d16080a](https://github.com/aws/aws-cdk/commit/d16080a)), closes [#4404](https://github.com/aws/aws-cdk/issues/4404)


### Features

* **aws-s3-deployment:** support specifying objects metadata ([#4288](https://github.com/aws/aws-cdk/issues/4288)) ([63cb2da](https://github.com/aws/aws-cdk/commit/63cb2da))
* **cli:** add tags to CDKToolkit stack through bootstrap cli command ([#4320](https://github.com/aws/aws-cdk/issues/4320)) ([4284aa2](https://github.com/aws/aws-cdk/commit/4284aa2)), closes [#4227](https://github.com/aws/aws-cdk/issues/4227)
* **cli:** notify option in deploy command to specify SNS Notification ARNs ([#4420](https://github.com/aws/aws-cdk/issues/4420)) ([7d6b474](https://github.com/aws/aws-cdk/commit/7d6b474)), closes [#2528](https://github.com/aws/aws-cdk/issues/2528)
* **codepipeline:** support cross-environment deployments for all actions ([#4276](https://github.com/aws/aws-cdk/issues/4276)) ([1eebf92](https://github.com/aws/aws-cdk/commit/1eebf92)), closes [#3389](https://github.com/aws/aws-cdk/issues/3389)
* **core:** Add ability to set stack description ([#4457](https://github.com/aws/aws-cdk/issues/4457)) ([#4477](https://github.com/aws/aws-cdk/issues/4477)) ([443394c](https://github.com/aws/aws-cdk/commit/443394c))
* **ecs:** add automated spot instance draining support ([#4360](https://github.com/aws/aws-cdk/issues/4360)) ([9c208d0](https://github.com/aws/aws-cdk/commit/9c208d0))
* **elbv2:** support `UDP` and `TCP_UDP` protocols ([#4390](https://github.com/aws/aws-cdk/issues/4390)) ([1958f26](https://github.com/aws/aws-cdk/commit/1958f26))
* **s3-deployment:** optional role override for bucket-deployment ([#4284](https://github.com/aws/aws-cdk/issues/4284)) ([e1b48bc](https://github.com/aws/aws-cdk/commit/e1b48bc))

## [1.12.0](https://github.com/aws/aws-cdk/compare/v1.11.0...v1.12.0) (2019-10-07)


### Bug Fixes

* **apigateway:** defaultChild on RestApi returns the underlying L1 ([#4318](https://github.com/aws/aws-cdk/issues/4318)) ([53db8bc](https://github.com/aws/aws-cdk/commit/53db8bc)), closes [#3234](https://github.com/aws/aws-cdk/issues/3234)
* **cloudmap:** fix CloudMap Service import, expose ECS CloudMap Service ([#4313](https://github.com/aws/aws-cdk/issues/4313)) ([c968c96](https://github.com/aws/aws-cdk/commit/c968c96)), closes [#4286](https://github.com/aws/aws-cdk/issues/4286)
* **codebuild:** validate if a CodePipeline action that is cross-account does not have outputs ([#4171](https://github.com/aws/aws-cdk/issues/4171)) ([1744f8a](https://github.com/aws/aws-cdk/commit/1744f8a)), closes [#4032](https://github.com/aws/aws-cdk/issues/4032)
* **custom-resources:** support region for AwsCustomResource ([#4298](https://github.com/aws/aws-cdk/issues/4298)) ([934d36f](https://github.com/aws/aws-cdk/commit/934d36f)), closes [#4292](https://github.com/aws/aws-cdk/issues/4292)
* **ecr-assets:** `exclude` option ([#4354](https://github.com/aws/aws-cdk/issues/4354)) ([f96b2fb](https://github.com/aws/aws-cdk/commit/f96b2fb)), closes [#4353](https://github.com/aws/aws-cdk/issues/4353) [#4353](https://github.com/aws/aws-cdk/issues/4353)
* **ecs:** nat network mode for windows tasks ([#4317](https://github.com/aws/aws-cdk/issues/4317)) ([9ceb995](https://github.com/aws/aws-cdk/commit/9ceb995)), closes [#4272](https://github.com/aws/aws-cdk/issues/4272)
* **lambda-event-sources:** add missing export of streams.ts ([#4362](https://github.com/aws/aws-cdk/issues/4362)) ([032b70c](https://github.com/aws/aws-cdk/commit/032b70c)), closes [#4352](https://github.com/aws/aws-cdk/issues/4352)


### Features

* **cloudformation:** nested stacks ([#2821](https://github.com/aws/aws-cdk/issues/2821)) ([5225306](https://github.com/aws/aws-cdk/commit/5225306)), closes [#239](https://github.com/aws/aws-cdk/issues/239) [#395](https://github.com/aws/aws-cdk/issues/395) [#3437](https://github.com/aws/aws-cdk/issues/3437) [#1439](https://github.com/aws/aws-cdk/issues/1439) [#3463](https://github.com/aws/aws-cdk/issues/3463)
* **ecs:** add a new API for registering ECS targets ([#4212](https://github.com/aws/aws-cdk/issues/4212)) ([de84c4a](https://github.com/aws/aws-cdk/commit/de84c4a))
* **ecs:** add support for ProxyConfiguration in ECS TaskDefinition ([#4007](https://github.com/aws/aws-cdk/issues/4007)) ([68e1e85](https://github.com/aws/aws-cdk/commit/68e1e85))
* **ecs:** Add warning message when pulling ECR image ([#4334](https://github.com/aws/aws-cdk/issues/4334)) ([bd36c6c](https://github.com/aws/aws-cdk/commit/bd36c6c))
* **ecs-patterns:** add CloudMapOptions to load balanced services ([#4369](https://github.com/aws/aws-cdk/issues/4369)) ([de0a028](https://github.com/aws/aws-cdk/commit/de0a028))
* **rds:** add support for monitoring to database cluster ([#2828](https://github.com/aws/aws-cdk/issues/2828)) ([910c8bf](https://github.com/aws/aws-cdk/commit/910c8bf)), closes [#2826](https://github.com/aws/aws-cdk/issues/2826)
* **stepfunctions:** add support for Map state ([#4145](https://github.com/aws/aws-cdk/issues/4145)) ([c8f0bcf](https://github.com/aws/aws-cdk/commit/c8f0bcf))


### BREAKING CHANGES

* **cloudmap:** `cloudmap.Service.fromServiceAttributes` takes a newly
required argument `namespace`.


## [1.11.0](https://github.com/aws/aws-cdk/compare/v1.10.1...v1.11.0) (2019-10-02)


### Bug Fixes

* **cli:** make new CLI work with old assembly versions ([#4307](https://github.com/aws/aws-cdk/issues/4307)) ([2f979b7](https://github.com/aws/aws-cdk/commit/2f979b7)), closes [#4294](https://github.com/aws/aws-cdk/issues/4294)
* **iam:** validate actions ([#4278](https://github.com/aws/aws-cdk/issues/4278)) ([3917c4b](https://github.com/aws/aws-cdk/commit/3917c4b))
* **stepfunctions:** allow condition on array ([#4340](https://github.com/aws/aws-cdk/issues/4340)) ([47203f4](https://github.com/aws/aws-cdk/commit/47203f4))


### Features

* **codepipeline:** validate that source actions are in the same region as the pipeline ([#4303](https://github.com/aws/aws-cdk/issues/4303)) ([c35091f](https://github.com/aws/aws-cdk/commit/c35091f))
* update CloudFormation resource specification to v6.2.0 ([#4309](https://github.com/aws/aws-cdk/issues/4309)) ([92b05a6](https://github.com/aws/aws-cdk/commit/92b05a6))
* **cli:** Add Jest tests to JavaScript init templates ([#4282](https://github.com/aws/aws-cdk/issues/4282)) ([22a5ada](https://github.com/aws/aws-cdk/commit/22a5ada)), closes [#4027](https://github.com/aws/aws-cdk/issues/4027)
* **ecs-patterns:** Allow overriding `loadBalancer` and `taskDefinition` ([#4213](https://github.com/aws/aws-cdk/issues/4213)) ([f2a6d46](https://github.com/aws/aws-cdk/commit/f2a6d46))
* **lambda:** event-source maxBatchingWindow property ([#4260](https://github.com/aws/aws-cdk/issues/4260)) ([4040032](https://github.com/aws/aws-cdk/commit/4040032))



## [1.10.1](https://github.com/aws/aws-cdk/compare/v1.10.0...v1.10.1) (2019-10-01)


### Bug Fixes

* **cli:** make new CLI work with old assembly versions ([#4307](https://github.com/aws/aws-cdk/issues/4307)) ([9222447](https://github.com/aws/aws-cdk/commit/9222447)), closes [#4294](https://github.com/aws/aws-cdk/issues/4294)


## [1.10.0](https://github.com/aws/aws-cdk/compare/v1.9.0...v1.10.0) (2019-09-27)


### Bug Fixes

* **acm:** on delete, wait for certificate to become unused ([#4191](https://github.com/aws/aws-cdk/issues/4191)) ([db77bfe](https://github.com/aws/aws-cdk/commit/db77bfe)), closes [#4179](https://github.com/aws/aws-cdk/issues/4179)
* **acm:** support Tokens for domainName in Certificate ([#4251](https://github.com/aws/aws-cdk/issues/4251)) ([ee1283d](https://github.com/aws/aws-cdk/commit/ee1283d)), closes [#4232](https://github.com/aws/aws-cdk/issues/4232)
* **apigateway:** honour requestParameters passed via defaultMethodOptions ([#4249](https://github.com/aws/aws-cdk/issues/4249)) ([b347c35](https://github.com/aws/aws-cdk/commit/b347c35))
* **apigateway:** proxy method options are not duplicated to root ([#4192](https://github.com/aws/aws-cdk/issues/4192)) ([0d235fe](https://github.com/aws/aws-cdk/commit/0d235fe))
* **appmesh:** actually set listener healthCheck.path ([#4218](https://github.com/aws/aws-cdk/issues/4218)) ([602bac2](https://github.com/aws/aws-cdk/commit/602bac2))
* **cloudtrail:** fix use of imported bucket with CloudTrail ([#4270](https://github.com/aws/aws-cdk/issues/4270)) ([7adb5ea](https://github.com/aws/aws-cdk/commit/7adb5ea)), closes [#4256](https://github.com/aws/aws-cdk/issues/4256)
* **cloudwatch:** can use percentile override in `Alarm` ([#4253](https://github.com/aws/aws-cdk/issues/4253)) ([859e4d1](https://github.com/aws/aws-cdk/commit/859e4d1)), closes [#3845](https://github.com/aws/aws-cdk/issues/3845)
* **ecr-assets:** docker build targets ([#4185](https://github.com/aws/aws-cdk/issues/4185)) ([91cda9d](https://github.com/aws/aws-cdk/commit/91cda9d)), closes [#4184](https://github.com/aws/aws-cdk/issues/4184)
* **ecr-assets:** give accurate error when Tokens are being used ([#4255](https://github.com/aws/aws-cdk/issues/4255)) ([1381b2d](https://github.com/aws/aws-cdk/commit/1381b2d)), closes [#3795](https://github.com/aws/aws-cdk/issues/3795)
* **ecs:** FargateTaskDefinition supports Tokens for `cpu` and `memory` ([#4224](https://github.com/aws/aws-cdk/issues/4224)) ([c9529f9](https://github.com/aws/aws-cdk/commit/c9529f9))
* **glue:** expose CfnTable as defaultChild ([#4197](https://github.com/aws/aws-cdk/issues/4197)) ([467d855](https://github.com/aws/aws-cdk/commit/467d855))
* **lambda:** asset metadata invalid for layers ([#4205](https://github.com/aws/aws-cdk/issues/4205)) ([d998e46](https://github.com/aws/aws-cdk/commit/d998e46)), closes [#4076](https://github.com/aws/aws-cdk/issues/4076) [awslabs/aws-sam-cli#1411](https://github.com/awslabs/aws-sam-cli/issues/1411)
* **route53:** use static s3 website endpoint ([#4250](https://github.com/aws/aws-cdk/issues/4250)) ([3c252c4](https://github.com/aws/aws-cdk/commit/3c252c4))
* **rule:** make `ruleName` accessible on `Rule` object ([#4252](https://github.com/aws/aws-cdk/issues/4252)) ([be06fd5](https://github.com/aws/aws-cdk/commit/be06fd5)), closes [#3809](https://github.com/aws/aws-cdk/issues/3809)
* **s3:** missing http on website url ([#4189](https://github.com/aws/aws-cdk/issues/4189)) ([960d71f](https://github.com/aws/aws-cdk/commit/960d71f))
* **ssm:** AWS::EC2::Image::Id parameter type ([#4161](https://github.com/aws/aws-cdk/issues/4161)) ([48c26c2](https://github.com/aws/aws-cdk/commit/48c26c2))


### Features

* **appmesh:** eagerly validate `healthCheck` settings ([#4221](https://github.com/aws/aws-cdk/issues/4221)) ([84a1b45](https://github.com/aws/aws-cdk/commit/84a1b45))
* **core:** context lookup errors are reported to CX app ([#3772](https://github.com/aws/aws-cdk/issues/3772)) ([b0267e4](https://github.com/aws/aws-cdk/commit/b0267e4)), closes [#3654](https://github.com/aws/aws-cdk/issues/3654)
* **ec2:** add custom userdata factory ([#4193](https://github.com/aws/aws-cdk/issues/4193)) ([3a9f4c8](https://github.com/aws/aws-cdk/commit/3a9f4c8))
* **ec2:** add sourceDestCheck to instance ([#4186](https://github.com/aws/aws-cdk/issues/4186)) ([6e75168](https://github.com/aws/aws-cdk/commit/6e75168))
* **ec2:** let Instance be IGrantable ([#4190](https://github.com/aws/aws-cdk/issues/4190)) ([87f096e](https://github.com/aws/aws-cdk/commit/87f096e))
* **ecr-assets:** Support .dockerignore (faster Docker builds) ([#4104](https://github.com/aws/aws-cdk/issues/4104)) ([8389eeb](https://github.com/aws/aws-cdk/commit/8389eeb))
* **ecs:** add protocol option and default certificate for HTTPS services ([#4120](https://github.com/aws/aws-cdk/issues/4120)) ([e02c6cc](https://github.com/aws/aws-cdk/commit/e02c6cc))
* **ecs:** add URL output for LB services ([#4238](https://github.com/aws/aws-cdk/issues/4238)) ([38d78ed](https://github.com/aws/aws-cdk/commit/38d78ed))
* **ecs-patterns:** support `propagateTags` and `ecsManagedTags` ([#4100](https://github.com/aws/aws-cdk/issues/4100)) ([caa0077](https://github.com/aws/aws-cdk/commit/caa0077)), closes [#3979](https://github.com/aws/aws-cdk/issues/3979)
* **eks:** retrieve ami with ssm ([#4156](https://github.com/aws/aws-cdk/issues/4156)) ([622a4e1](https://github.com/aws/aws-cdk/commit/622a4e1))
* **eks:** upgrade latest kubertenes version to 1.14 ([#4157](https://github.com/aws/aws-cdk/issues/4157)) ([c7def91](https://github.com/aws/aws-cdk/commit/c7def91))
* **elasticloadbalancingv2:** add Instance target ([#4187](https://github.com/aws/aws-cdk/issues/4187)) ([f11bece](https://github.com/aws/aws-cdk/commit/f11bece))
* **s3-deployment:** allow specifying memory limit ([#4204](https://github.com/aws/aws-cdk/issues/4204)) ([84e1d4b](https://github.com/aws/aws-cdk/commit/84e1d4b)), closes [#4058](https://github.com/aws/aws-cdk/issues/4058)
* **ses-actions:** move SES rule actions to separate package ([#4163](https://github.com/aws/aws-cdk/issues/4163)) ([a9fef66](https://github.com/aws/aws-cdk/commit/a9fef66)), closes [#3726](https://github.com/aws/aws-cdk/issues/3726)
* publish construct tree into the cloud assembly ([#4194](https://github.com/aws/aws-cdk/issues/4194)) ([3cca03d](https://github.com/aws/aws-cdk/commit/3cca03d))


### BREAKING CHANGES

* **ses-actions:** adding an action to a receipt rule now requires an integration
object from the `@aws-cdk/aws-ses-actions` package.


## [1.9.0](https://github.com/aws/aws-cdk/compare/v1.8.0...v1.9.0) (2019-09-19)


### Bug Fixes

* **apigateway:** cross-stack lambda integration causes a cyclic reference ([#4010](https://github.com/aws/aws-cdk/issues/4010)) ([17fc967](https://github.com/aws/aws-cdk/commit/17fc967)), closes [#3705](https://github.com/aws/aws-cdk/issues/3705) [#3000](https://github.com/aws/aws-cdk/issues/3000)
* **apigateway:** json schema additionalProperties should be boolean ([#3997](https://github.com/aws/aws-cdk/issues/3997)) ([73a1de1](https://github.com/aws/aws-cdk/commit/73a1de1))
* **cloudfront:** actually default 'compress' to true ([#3359](https://github.com/aws/aws-cdk/issues/3359)) ([364fd56](https://github.com/aws/aws-cdk/commit/364fd56))
* **core:** `stack.urlSuffix` is no longer scoped ([#4011](https://github.com/aws/aws-cdk/issues/4011)) ([82e08bc](https://github.com/aws/aws-cdk/commit/82e08bc)), closes [#3970](https://github.com/aws/aws-cdk/issues/3970)
* **ec2:** fix subnet selection on looked-up VPCs ([#4090](https://github.com/aws/aws-cdk/issues/4090)) ([4a113e6](https://github.com/aws/aws-cdk/commit/4a113e6)), closes [#3650](https://github.com/aws/aws-cdk/issues/3650)
* **ec2:** improve errors around subnet selection ([#4089](https://github.com/aws/aws-cdk/issues/4089)) ([2392108](https://github.com/aws/aws-cdk/commit/2392108)), closes [#3859](https://github.com/aws/aws-cdk/issues/3859)
* **elbv2:** allow multiple certificates on ALB listener ([#4116](https://github.com/aws/aws-cdk/issues/4116)) ([d1f8e5c](https://github.com/aws/aws-cdk/commit/d1f8e5c)), closes [#3757](https://github.com/aws/aws-cdk/issues/3757)
* **elbv2:** fix cross-stack use of ALB ([#4111](https://github.com/aws/aws-cdk/issues/4111)) ([7dfd6be](https://github.com/aws/aws-cdk/commit/7dfd6be))
* **elbv2:** unhealthyHostCount metric case fix ([#4133](https://github.com/aws/aws-cdk/issues/4133)) ([899656c](https://github.com/aws/aws-cdk/commit/899656c))
* **events:** remove custom resource for fargate event target ([#3952](https://github.com/aws/aws-cdk/issues/3952)) ([920f12f](https://github.com/aws/aws-cdk/commit/920f12f)), closes [#3930](https://github.com/aws/aws-cdk/issues/3930)
* **events:** remove policy statement from CF template when using AwsApi ([#4037](https://github.com/aws/aws-cdk/issues/4037)) ([2e67c2d](https://github.com/aws/aws-cdk/commit/2e67c2d))
* **route53:** remove `http://` from bucket target ([#4070](https://github.com/aws/aws-cdk/issues/4070)) ([621441d](https://github.com/aws/aws-cdk/commit/621441d))


### Features

* **codebuild:** add support of Amazon Linux 2 image ([#4052](https://github.com/aws/aws-cdk/issues/4052)) ([#4055](https://github.com/aws/aws-cdk/issues/4055)) ([f63bf6f](https://github.com/aws/aws-cdk/commit/f63bf6f))
* **codepipeline:** cross-environment (account+region) actions ([#3694](https://github.com/aws/aws-cdk/issues/3694)) ([69bff3d](https://github.com/aws/aws-cdk/commit/69bff3d)), closes [#52](https://github.com/aws/aws-cdk/issues/52) [#1584](https://github.com/aws/aws-cdk/issues/1584) [#2517](https://github.com/aws/aws-cdk/issues/2517) [#2569](https://github.com/aws/aws-cdk/issues/2569) [#3275](https://github.com/aws/aws-cdk/issues/3275) [#3138](https://github.com/aws/aws-cdk/issues/3138) [#3388](https://github.com/aws/aws-cdk/issues/3388)
* **codepipeline:** handle non-CFN cross-region actions ([#3777](https://github.com/aws/aws-cdk/issues/3777)) ([b8b4c4d](https://github.com/aws/aws-cdk/commit/b8b4c4d)), closes [#3387](https://github.com/aws/aws-cdk/issues/3387)
* **cognito:** add PreTokenGeneration lambda trigger support ([#3910](https://github.com/aws/aws-cdk/issues/3910)) ([e9f46da](https://github.com/aws/aws-cdk/commit/e9f46da)), closes [#2497](https://github.com/aws/aws-cdk/issues/2497)
* **ecs:** add additional log drivers ([#3762](https://github.com/aws/aws-cdk/issues/3762)) ([f308f1d](https://github.com/aws/aws-cdk/commit/f308f1d)), closes [#3761](https://github.com/aws/aws-cdk/issues/3761)
* **ecs:** allow load balancing to any container and port of service ([#4107](https://github.com/aws/aws-cdk/issues/4107)) ([c3b3c93](https://github.com/aws/aws-cdk/commit/c3b3c93))
* **iam:** support NotPrincipal in policy statements ([#4077](https://github.com/aws/aws-cdk/issues/4077)) ([9945d9e](https://github.com/aws/aws-cdk/commit/9945d9e))
* **route53:** Domain redirect pattern ([#3946](https://github.com/aws/aws-cdk/issues/3946)) ([3ac4671](https://github.com/aws/aws-cdk/commit/3ac4671)), closes [#3893](https://github.com/aws/aws-cdk/issues/3893)
* **s3-deployment:** allow multiple Sources for single Deployment ([#4105](https://github.com/aws/aws-cdk/issues/4105)) ([2ce4a87](https://github.com/aws/aws-cdk/commit/2ce4a87))
* update baseline requirement for node engine to 10.3.0 ([#4135](https://github.com/aws/aws-cdk/issues/4135)) ([d5ab865](https://github.com/aws/aws-cdk/commit/d5ab865))
* **sns:** add support for attribute key matching in message filtering ([#3709](https://github.com/aws/aws-cdk/issues/3709)) ([dbf0134](https://github.com/aws/aws-cdk/commit/dbf0134))
* upgrade CloudFormation resource specification to v6.1.0 ([#4112](https://github.com/aws/aws-cdk/issues/4112)) ([3d693e6](https://github.com/aws/aws-cdk/commit/3d693e6))
* **toolkit:** conditionally emit AWS::CDK::Metadata resource ([#3692](https://github.com/aws/aws-cdk/issues/3692)) ([5901d6e](https://github.com/aws/aws-cdk/commit/5901d6e)), closes [#3648](https://github.com/aws/aws-cdk/issues/3648)


### BREAKING CHANGES

* **s3-deployment:** Property `source` is now `sources` and is a `Source` array



## [1.8.0](https://github.com/aws/aws-cdk/compare/v1.7.0...v1.8.0) (2019-09-10)


### Bug Fixes

* **app-delivery:** action template filename incorrect ([#3986](https://github.com/aws/aws-cdk/issues/3986)) ([f6ef79d](https://github.com/aws/aws-cdk/commit/f6ef79d)), closes [#3595](https://github.com/aws/aws-cdk/issues/3595)
* **certificatemanager:** increase minimum validation total timeout ([#3914](https://github.com/aws/aws-cdk/issues/3914)) ([4973a8c](https://github.com/aws/aws-cdk/commit/4973a8c))
* **custom-resources:** correctly handle booleans conversion ([#4000](https://github.com/aws/aws-cdk/issues/4000)) ([77105ab](https://github.com/aws/aws-cdk/commit/77105ab)), closes [#3933](https://github.com/aws/aws-cdk/issues/3933)
* **dynamodb:** prevent "StreamARN not found for resource" errors ([#3935](https://github.com/aws/aws-cdk/issues/3935)) ([617ef82](https://github.com/aws/aws-cdk/commit/617ef82))
* **ecs:** separate application and network load balanced services ([#3719](https://github.com/aws/aws-cdk/issues/3719)) ([21eb835](https://github.com/aws/aws-cdk/commit/21eb835))
* **events:** `fromObject`  handles regular and field tokens together ([#3916](https://github.com/aws/aws-cdk/issues/3916)) ([b01f62d](https://github.com/aws/aws-cdk/commit/b01f62d)), closes [#3915](https://github.com/aws/aws-cdk/issues/3915)
* **iam:** only attach policies to imported roles if the accounts match ([#3716](https://github.com/aws/aws-cdk/issues/3716)) ([87db7aa](https://github.com/aws/aws-cdk/commit/87db7aa)), closes [#2985](https://github.com/aws/aws-cdk/issues/2985) [#3025](https://github.com/aws/aws-cdk/issues/3025)


### Code Refactoring

* **assets:** remove content hash attribute ([#4003](https://github.com/aws/aws-cdk/issues/4003)) ([181b58b](https://github.com/aws/aws-cdk/commit/181b58b))


### Features

* **cli:** [#3971](https://github.com/aws/aws-cdk/issues/3971) changed cdk synth to rebuild app ([#3972](https://github.com/aws/aws-cdk/issues/3972)) ([198f45f](https://github.com/aws/aws-cdk/commit/198f45f))
* **ec2:** support configuring network ACLs ([#3699](https://github.com/aws/aws-cdk/issues/3699)) ([3f10543](https://github.com/aws/aws-cdk/commit/3f10543)), closes [#3621](https://github.com/aws/aws-cdk/issues/3621)
* **ecr-assets:** fail if tokens are used in buildArgs ([#3989](https://github.com/aws/aws-cdk/issues/3989)) ([56ce9ff](https://github.com/aws/aws-cdk/commit/56ce9ff)), closes [#3981](https://github.com/aws/aws-cdk/issues/3981)
* **eks:** add EKS AMis for 1.14 ([#3950](https://github.com/aws/aws-cdk/issues/3950)) ([741ef43](https://github.com/aws/aws-cdk/commit/741ef43))
* **eks:** spot capacity and bootstrap options ([#3937](https://github.com/aws/aws-cdk/issues/3937)) ([5da6b36](https://github.com/aws/aws-cdk/commit/5da6b36)), closes [#3523](https://github.com/aws/aws-cdk/issues/3523) [#3857](https://github.com/aws/aws-cdk/issues/3857) [#3929](https://github.com/aws/aws-cdk/issues/3929) [#3938](https://github.com/aws/aws-cdk/issues/3938) [#3939](https://github.com/aws/aws-cdk/issues/3939)
* **events:** allow passing a role to the CodePipeline target ([#4006](https://github.com/aws/aws-cdk/issues/4006)) ([c4054ce](https://github.com/aws/aws-cdk/commit/c4054ce)), closes [#3999](https://github.com/aws/aws-cdk/issues/3999)


### BREAKING CHANGES

* **assets:** assets no longer expose a property `contentHash`. Use `sourceHash`
as a good approximation. if you have a strong use case for content hashes, please
raise a github issue and we will figure out a solution.
* **dynamodb:** fix
* **ecs:** The LoadBalancedServiceBase, LoadBalancedEc2Service and LoadBalancedFargateService constructs have been separated out into Application and Network LoadBalancedService constructs for both Ec2 and Fargate Services.



## [1.7.0](https://github.com/aws/aws-cdk/compare/v1.6.1...v1.7.0) (2019-09-05)


### Bug Fixes

* **codepipeline:** insufficient deploy cross-account CFN role S3 permissions ([#3855](https://github.com/aws/aws-cdk/issues/3855)) ([09304f7](https://github.com/aws/aws-cdk/commit/09304f7)), closes [#3765](https://github.com/aws/aws-cdk/issues/3765)
* **ecs:** default ecsmanagedtags and propagatetags to be undefined ([#3887](https://github.com/aws/aws-cdk/issues/3887)) ([1f589a3](https://github.com/aws/aws-cdk/commit/1f589a3))
* **init-templates:** add typesRoot compiler option for TypeScript templates ([#3865](https://github.com/aws/aws-cdk/issues/3865)) ([2c9bafa](https://github.com/aws/aws-cdk/commit/2c9bafa)), closes [#3830](https://github.com/aws/aws-cdk/issues/3830)
* **init-templates:** fix to include environments and CDK files to .gitignore for Python templates ([#3863](https://github.com/aws/aws-cdk/issues/3863)) ([e4f9677](https://github.com/aws/aws-cdk/commit/e4f9677)), closes [#2842](https://github.com/aws/aws-cdk/issues/2842)
* **lambda:** environment var values are strings ([#3858](https://github.com/aws/aws-cdk/issues/3858)) ([f892312](https://github.com/aws/aws-cdk/commit/f892312)), closes [#3337](https://github.com/aws/aws-cdk/issues/3337)
* **s3-deployment:** CallerReference has to be unique ([#3880](https://github.com/aws/aws-cdk/issues/3880)) ([16eb658](https://github.com/aws/aws-cdk/commit/16eb658))


### Features

* **ecs,lambda,rds:** specify allowAllOutbound when importing security groups ([#3833](https://github.com/aws/aws-cdk/issues/3833)) ([5ef34a1](https://github.com/aws/aws-cdk/commit/5ef34a1))
* **events:** validate MessageGroupId is specified only for FIFO queues ([#3811](https://github.com/aws/aws-cdk/issues/3811)) ([cc88f1a](https://github.com/aws/aws-cdk/commit/cc88f1a))
* upgrade to CloudFormation specification 6.0.0 ([#3942](https://github.com/aws/aws-cdk/issues/3942)) ([27de0a0](https://github.com/aws/aws-cdk/commit/27de0a0))


### BREAKING CHANGES

* **ecs,lambda,rds:** `securityGroupId: string` replaced by `securityGroup: ISecurityGroup` when
importing a cluster/instance in `@aws-cdk/aws-rds`



## [1.6.1](https://github.com/aws/aws-cdk/compare/v1.6.0...v1.6.1) (2019-08-29)


### Bug Fixes

* **cloudwatch:** don't ignore 'stacked' property in GraphWidget class ([#2103](https://github.com/aws/aws-cdk/issues/2103)) ([#3796](https://github.com/aws/aws-cdk/issues/3796)) ([527b362](https://github.com/aws/aws-cdk/commit/527b362))
* **init-templates:** remove dependency on @types/node ([#3840](https://github.com/aws/aws-cdk/issues/3840)) ([f46ce18](https://github.com/aws/aws-cdk/commit/f46ce18)), closes [#3839](https://github.com/aws/aws-cdk/issues/3839)
* **toolkit:** do not deploy empty stacks ([#3144](https://github.com/aws/aws-cdk/issues/3144)) ([64ace90](https://github.com/aws/aws-cdk/commit/64ace90))
* **vpc:** recognize Public subnets by Internet Gateway ([#3784](https://github.com/aws/aws-cdk/issues/3784)) ([54599e5](https://github.com/aws/aws-cdk/commit/54599e5)), closes [#3706](https://github.com/aws/aws-cdk/issues/3706)



## [1.6.0](https://github.com/aws/aws-cdk/compare/v1.5.0...v1.6.0) (2019-08-27)


### Bug Fixes

* **aws-stepfunctions:** refactor sagemaker tasks and fix default role issue ([#3014](https://github.com/aws/aws-cdk/issues/3014)) ([d8fcb50](https://github.com/aws/aws-cdk/commit/d8fcb50))
* **cli:** update bit.ly link to use GitHub link directly ([#3782](https://github.com/aws/aws-cdk/issues/3782)) ([042fb53](https://github.com/aws/aws-cdk/commit/042fb53))
* **ec2:** also add egress rules for `allowInternally()` ([#3741](https://github.com/aws/aws-cdk/issues/3741)) ([051aacb](https://github.com/aws/aws-cdk/commit/051aacb)), closes [#3254](https://github.com/aws/aws-cdk/issues/3254)
* **ec2:** fix error when using Tokens in Vpc.fromLookup() ([#3740](https://github.com/aws/aws-cdk/issues/3740)) ([004077f](https://github.com/aws/aws-cdk/commit/004077f)), closes [#3600](https://github.com/aws/aws-cdk/issues/3600)
* **ec2:** throw useful error when using lazy CIDR in VPC ([#3739](https://github.com/aws/aws-cdk/issues/3739)) ([c92e9a9](https://github.com/aws/aws-cdk/commit/c92e9a9)), closes [#3617](https://github.com/aws/aws-cdk/issues/3617)
* **ecs:** IAM role ARN must not specific region. ([#3755](https://github.com/aws/aws-cdk/issues/3755)) ([210ed8f](https://github.com/aws/aws-cdk/commit/210ed8f)), closes [#3733](https://github.com/aws/aws-cdk/issues/3733)
* **events:** fix ECS target in Isolated subnet ([#3786](https://github.com/aws/aws-cdk/issues/3786)) ([8bbc7e6](https://github.com/aws/aws-cdk/commit/8bbc7e6))
* **iam:** make User implement IUser ([#3738](https://github.com/aws/aws-cdk/issues/3738)) ([05e13f3](https://github.com/aws/aws-cdk/commit/05e13f3)), closes [#3490](https://github.com/aws/aws-cdk/issues/3490)
* **lambda:** generate correct metrics for aliases ([#3728](https://github.com/aws/aws-cdk/issues/3728)) ([ce08853](https://github.com/aws/aws-cdk/commit/ce08853)), closes [#3724](https://github.com/aws/aws-cdk/issues/3724)
* **lambda/rds:** allow to specify a role for log retention lambda ([#3730](https://github.com/aws/aws-cdk/issues/3730)) ([013cab6](https://github.com/aws/aws-cdk/commit/013cab6)), closes [#3685](https://github.com/aws/aws-cdk/issues/3685)
* **scaling:** don't fail when using Tokens ([#3758](https://github.com/aws/aws-cdk/issues/3758)) ([0a2ed3d](https://github.com/aws/aws-cdk/commit/0a2ed3d))


### Features

* **acm:** validated certificate can use existing Role ([#3785](https://github.com/aws/aws-cdk/issues/3785)) ([b51723c](https://github.com/aws/aws-cdk/commit/b51723c)), closes [#3519](https://github.com/aws/aws-cdk/issues/3519) [#3753](https://github.com/aws/aws-cdk/issues/3753)
* **appmesh:** add support for AWS AppMesh ([#2299](https://github.com/aws/aws-cdk/issues/2299)) ([98863f9](https://github.com/aws/aws-cdk/commit/98863f9)), closes [#2297](https://github.com/aws/aws-cdk/issues/2297)
* **cloudfront:** define lambda@edge as resolvable resource ([#2861](https://github.com/aws/aws-cdk/issues/2861)) ([c39d659](https://github.com/aws/aws-cdk/commit/c39d659)), closes [#1575](https://github.com/aws/aws-cdk/issues/1575)
* **cloudtrail:** accept existing S3 bucket ([#3680](https://github.com/aws/aws-cdk/issues/3680)) ([c2d6847](https://github.com/aws/aws-cdk/commit/c2d6847)), closes [#3651](https://github.com/aws/aws-cdk/issues/3651)
* **core:** stack.templateFile ([#3808](https://github.com/aws/aws-cdk/issues/3808)) ([ac54e14](https://github.com/aws/aws-cdk/commit/ac54e14)), closes [#3807](https://github.com/aws/aws-cdk/issues/3807)
* **ec2:** add Instance and Bastion Host ([#3697](https://github.com/aws/aws-cdk/issues/3697)) ([ef09aba](https://github.com/aws/aws-cdk/commit/ef09aba)), closes [#3174](https://github.com/aws/aws-cdk/issues/3174) [#1713](https://github.com/aws/aws-cdk/issues/1713)
* **ec2:** imported SecurityGroups don't create egress rules ([#3386](https://github.com/aws/aws-cdk/issues/3386)) ([04710d0](https://github.com/aws/aws-cdk/commit/04710d0)), closes [#3355](https://github.com/aws/aws-cdk/issues/3355)
* **ec2:** Validate IP addresses passed to CidrIPvX ([#3642](https://github.com/aws/aws-cdk/issues/3642)) ([b67b0f3](https://github.com/aws/aws-cdk/commit/b67b0f3)), closes [#3639](https://github.com/aws/aws-cdk/issues/3639)
* **ecs:** add GPU support in container definition ([#3044](https://github.com/aws/aws-cdk/issues/3044)) ([2590327](https://github.com/aws/aws-cdk/commit/2590327))
* **ecs:** support ecs tag propagation and ecs managed tags ([#3420](https://github.com/aws/aws-cdk/issues/3420)) ([1e81053](https://github.com/aws/aws-cdk/commit/1e81053))
* **eks:** updated AMI and EC2 instance sizes ([#3805](https://github.com/aws/aws-cdk/issues/3805)) ([2d165ad](https://github.com/aws/aws-cdk/commit/2d165ad)), closes [#3751](https://github.com/aws/aws-cdk/issues/3751)
* **elbv2:** add support for Lambda targets ([#3348](https://github.com/aws/aws-cdk/issues/3348)) ([f003dcc](https://github.com/aws/aws-cdk/commit/f003dcc)), closes [#1921](https://github.com/aws/aws-cdk/issues/1921)
* **events:** add target to make AWS API calls ([#3720](https://github.com/aws/aws-cdk/issues/3720)) ([b6f055a](https://github.com/aws/aws-cdk/commit/b6f055a)), closes [#2538](https://github.com/aws/aws-cdk/issues/2538)
* **region-info:** report availability of metadata service in Bahrein & Hong-Kong ([#3799](https://github.com/aws/aws-cdk/issues/3799)) ([95d8ac3](https://github.com/aws/aws-cdk/commit/95d8ac3))
* updated CloudFormation Resource specification 5.3.0 ([#3789](https://github.com/aws/aws-cdk/issues/3789)) ([39ee810](https://github.com/aws/aws-cdk/commit/39ee810))


### BREAKING CHANGES

* **ec2:** By default, egress rules are not created anymore on imported security groups. This can be configured by setting `allowAllOutbound: false` upon importing.


## [1.5.0](https://github.com/aws/aws-cdk/compare/v1.4.0...v1.5.0) (2019-08-20)


### Bug Fixes

* **aws-cdk:** update Java template to new builder style ([#3723](https://github.com/aws/aws-cdk/issues/3723)) ([ab07af1](https://github.com/aws/aws-cdk/commit/ab07af1))
* **ecr:** set correct resource policy for ecr repository ([#3590](https://github.com/aws/aws-cdk/issues/3590)) ([30f3968](https://github.com/aws/aws-cdk/commit/30f3968))
* **events-targets:** allow adding same fargate task to multiple rules ([#3576](https://github.com/aws/aws-cdk/issues/3576)) ([5b109f9](https://github.com/aws/aws-cdk/commit/5b109f9)), closes [#3574](https://github.com/aws/aws-cdk/issues/3574)
* **iam:** support NotActions/NotResources ([#964](https://github.com/aws/aws-cdk/issues/964)) ([#3677](https://github.com/aws/aws-cdk/issues/3677)) ([a8ee987](https://github.com/aws/aws-cdk/commit/a8ee987))
* **kms:** append aliasName only after first ([#3659](https://github.com/aws/aws-cdk/issues/3659)) ([77671ad](https://github.com/aws/aws-cdk/commit/77671ad))
* **region-info:** IAM service principal for China regions ([#3491](https://github.com/aws/aws-cdk/issues/3491)) ([013c181](https://github.com/aws/aws-cdk/commit/013c181))
* **s3-deployment:** custom resource fails to run aws-cli  ([#3668](https://github.com/aws/aws-cdk/issues/3668)) ([6eabe6d](https://github.com/aws/aws-cdk/commit/6eabe6d)), closes [#3656](https://github.com/aws/aws-cdk/issues/3656)


### Features

* **bootstrap:** force toolkit bucket private ([#3695](https://github.com/aws/aws-cdk/issues/3695)) ([d1ee4ba](https://github.com/aws/aws-cdk/commit/d1ee4ba))
* **cloudformation:** Update CloudFormation spec to 5.2.0 ([#3710](https://github.com/aws/aws-cdk/issues/3710)) ([ab86df7](https://github.com/aws/aws-cdk/commit/ab86df7))
* **cloudformation:** update cloudformation spec to v5.1.0 ([#3670](https://github.com/aws/aws-cdk/issues/3670)) ([15f01d0](https://github.com/aws/aws-cdk/commit/15f01d0))
* **eks:** output update-kubeconfig command ([04d88fb](https://github.com/aws/aws-cdk/commit/04d88fb)), closes [#3664](https://github.com/aws/aws-cdk/issues/3664)
* **eks:** output update-kubeconfig command ([#3669](https://github.com/aws/aws-cdk/issues/3669)) ([9e46532](https://github.com/aws/aws-cdk/commit/9e46532)), closes [#3664](https://github.com/aws/aws-cdk/issues/3664)
* **events-targets:** allow specifying event for codebuild project target ([#3637](https://github.com/aws/aws-cdk/issues/3637)) ([c240e1e](https://github.com/aws/aws-cdk/commit/c240e1e))


### BREAKING CHANGES

* **aws-cdk:** Java builders no longer use the "with" prefix.
* **eks:** cluster name output will not be synthesized by default. instead we synthesize an output that includes the full `aws eks update-kubeconfig` command. You can enable synthesis of the cluster name output using the `outputClusterName: true` options.


## [1.4.0](https://github.com/aws/aws-cdk/compare/v1.3.0...v1.4.0) (2019-08-14)


### Bug Fixes

* **acm:** validated certificate survives eventual consistency in service ([#3528](https://github.com/aws/aws-cdk/issues/3528)) ([e7eabca](https://github.com/aws/aws-cdk/commit/e7eabca)), closes [#3527](https://github.com/aws/aws-cdk/issues/3527)
* **ec2:** allow adding gateway endpoints to imported VPC ([#3509](https://github.com/aws/aws-cdk/issues/3509)) ([b5db88d](https://github.com/aws/aws-cdk/commit/b5db88d)), closes [#3171](https://github.com/aws/aws-cdk/issues/3171) [#3472](https://github.com/aws/aws-cdk/issues/3472)
* typo in restapi.ts ([#3530](https://github.com/aws/aws-cdk/issues/3530)) ([8381683](https://github.com/aws/aws-cdk/commit/8381683))
* **apigateway:** allow reusing lambda integration for multiple apis ([#3532](https://github.com/aws/aws-cdk/issues/3532)) ([6e6440a](https://github.com/aws/aws-cdk/commit/6e6440a))
* **apigateway:** invalid schema generated due to un-mapped `ref` ([#3258](https://github.com/aws/aws-cdk/issues/3258)) ([254f62c](https://github.com/aws/aws-cdk/commit/254f62c))
* **asg/ec2:** fix value of `defaultChild` ([#3572](https://github.com/aws/aws-cdk/issues/3572)) ([c95eab6](https://github.com/aws/aws-cdk/commit/c95eab6)), closes [#3478](https://github.com/aws/aws-cdk/issues/3478)
* **aws-ecs:** ensure cluster attributes are accessible from constructor’s props ([#3020](https://github.com/aws/aws-cdk/issues/3020)) ([24ebec8](https://github.com/aws/aws-cdk/commit/24ebec8))
* **cdk-dasm:** update README and fix small typo ([#3565](https://github.com/aws/aws-cdk/issues/3565)) ([92b5c2d](https://github.com/aws/aws-cdk/commit/92b5c2d))
* **ci:** add "do-not-merge" label auto-merge block ([#3553](https://github.com/aws/aws-cdk/issues/3553)) ([0c806a6](https://github.com/aws/aws-cdk/commit/0c806a6))
* **cli:** support aws:// prefix for bootstrap command ([#3599](https://github.com/aws/aws-cdk/issues/3599)) ([8ac7389](https://github.com/aws/aws-cdk/commit/8ac7389))
* **core:** correct return type of Fn.getAtt ([#3559](https://github.com/aws/aws-cdk/issues/3559)) ([02ef2dc](https://github.com/aws/aws-cdk/commit/02ef2dc))
* **core:** fix detection of references in Fn.join ([#3569](https://github.com/aws/aws-cdk/issues/3569)) ([0a2540b](https://github.com/aws/aws-cdk/commit/0a2540b)), closes [#3554](https://github.com/aws/aws-cdk/issues/3554)
* **core:** fix use of references in toJsonString() ([#3568](https://github.com/aws/aws-cdk/issues/3568)) ([0fc2c3b](https://github.com/aws/aws-cdk/commit/0fc2c3b))
* **ecs:** update driverOpts type definition from array to map ([#3358](https://github.com/aws/aws-cdk/issues/3358)) ([65e4a5d](https://github.com/aws/aws-cdk/commit/65e4a5d))
* **events:** simplify the cache key for cross-account targets ([#3526](https://github.com/aws/aws-cdk/issues/3526)) ([db7dc2e](https://github.com/aws/aws-cdk/commit/db7dc2e))
* **java:** surpress maven output in cdk.json ([#3624](https://github.com/aws/aws-cdk/issues/3624)) ([02e097b](https://github.com/aws/aws-cdk/commit/02e097b)), closes [#3571](https://github.com/aws/aws-cdk/issues/3571)
* **kms:** allow multiple `addAlias` calls on single key ([#3596](https://github.com/aws/aws-cdk/issues/3596)) ([54f8ea9](https://github.com/aws/aws-cdk/commit/54f8ea9))
* **lambda:** allow ArnPrincipal in grantInvoke ([#3501](https://github.com/aws/aws-cdk/issues/3501)) ([e222e87](https://github.com/aws/aws-cdk/commit/e222e87)), closes [#3264](https://github.com/aws/aws-cdk/issues/3264)
* **sqs:** do not emit grants to the AWS-managed encryption key ([#3169](https://github.com/aws/aws-cdk/issues/3169)) ([07f017b](https://github.com/aws/aws-cdk/commit/07f017b)), closes [#2794](https://github.com/aws/aws-cdk/issues/2794)
* **ssm:** add GetParameters action to grantRead() ([#3546](https://github.com/aws/aws-cdk/issues/3546)) ([ebaa1b5](https://github.com/aws/aws-cdk/commit/ebaa1b5))


### Code Refactoring

* **stepfunctions-tasks:** make integrationPattern an enum ([#3115](https://github.com/aws/aws-cdk/issues/3115)) ([fa48e89](https://github.com/aws/aws-cdk/commit/fa48e89)), closes [#3114](https://github.com/aws/aws-cdk/issues/3114)


### Features

* **apigateway:** support imported roles for integrations ([#3369](https://github.com/aws/aws-cdk/issues/3369)) ([15df3c7](https://github.com/aws/aws-cdk/commit/15df3c7)), closes [#2860](https://github.com/aws/aws-cdk/issues/2860)
* **autoscaling:** blockDevices property ([#3622](https://github.com/aws/aws-cdk/issues/3622)) ([6953e03](https://github.com/aws/aws-cdk/commit/6953e03))
* **autoscaling:** health check configuration ([#3390](https://github.com/aws/aws-cdk/issues/3390)) ([#3436](https://github.com/aws/aws-cdk/issues/3436)) ([76e5173](https://github.com/aws/aws-cdk/commit/76e5173)), closes [#3381](https://github.com/aws/aws-cdk/issues/3381)
* **aws-codebuild:** support pull_request_merged eventaction type ([#3575](https://github.com/aws/aws-cdk/issues/3575)) ([5d4a275](https://github.com/aws/aws-cdk/commit/5d4a275)), closes [#3557](https://github.com/aws/aws-cdk/issues/3557)
* **aws-stepfunctions-tasks:** support step functions state machine execution from a task state ([#3522](https://github.com/aws/aws-cdk/issues/3522)) ([ac77990](https://github.com/aws/aws-cdk/commit/ac77990)), closes [#3521](https://github.com/aws/aws-cdk/issues/3521)
* **bootstrap:** add kms option to cdk bootstrap ([#3634](https://github.com/aws/aws-cdk/issues/3634)) ([d915aac](https://github.com/aws/aws-cdk/commit/d915aac))
* **cloudformation:** update Resource Specification to v5.0.0 ([#3605](https://github.com/aws/aws-cdk/issues/3605)) ([1509399](https://github.com/aws/aws-cdk/commit/1509399))
* **codepipeline:** allow cross-account CloudFormation actions ([#3208](https://github.com/aws/aws-cdk/issues/3208)) ([8df4b7e](https://github.com/aws/aws-cdk/commit/8df4b7e))
* **ec2:** add `GenericWindowsImage` ([#3454](https://github.com/aws/aws-cdk/issues/3454)) ([f4ca41c](https://github.com/aws/aws-cdk/commit/f4ca41c)), closes [#3400](https://github.com/aws/aws-cdk/issues/3400)
* **ecs:** container dependencies ([#3032](https://github.com/aws/aws-cdk/issues/3032)) ([56656e0](https://github.com/aws/aws-cdk/commit/56656e0)), closes [#2490](https://github.com/aws/aws-cdk/issues/2490)
* **ecs-patterns:** allow customizing logdriver ([#3550](https://github.com/aws/aws-cdk/issues/3550)) ([8ffba4b](https://github.com/aws/aws-cdk/commit/8ffba4b))
* **eks:** add HKG (ap-east-1) EKS AMIs ([#3533](https://github.com/aws/aws-cdk/issues/3533)) ([e9f9907](https://github.com/aws/aws-cdk/commit/e9f9907))
* **eks:** default capacity ([#3633](https://github.com/aws/aws-cdk/issues/3633)) ([91af473](https://github.com/aws/aws-cdk/commit/91af473)), closes [#3541](https://github.com/aws/aws-cdk/issues/3541)
* **eks:** default vpc ([#3632](https://github.com/aws/aws-cdk/issues/3632)) ([3a96c27](https://github.com/aws/aws-cdk/commit/3a96c27)), closes [#3541](https://github.com/aws/aws-cdk/issues/3541)
* **eks:** programmatic definition of kubernetes resources ([#3510](https://github.com/aws/aws-cdk/issues/3510)) ([4e11d86](https://github.com/aws/aws-cdk/commit/4e11d86))
* **elasticloadbalancing:** add subnet selection ([#2833](https://github.com/aws/aws-cdk/issues/2833)) ([#3415](https://github.com/aws/aws-cdk/issues/3415)) ([14e4bc9](https://github.com/aws/aws-cdk/commit/14e4bc9))
* **iam:** add Role.externalIds property ([#3598](https://github.com/aws/aws-cdk/issues/3598)) ([ba2a4df](https://github.com/aws/aws-cdk/commit/ba2a4df))
* **iam:** customer managed policies ([#3578](https://github.com/aws/aws-cdk/issues/3578)) ([4681d01](https://github.com/aws/aws-cdk/commit/4681d01))
* png and svg of official aws-cdk logo ([#3567](https://github.com/aws/aws-cdk/issues/3567)) ([7158e45](https://github.com/aws/aws-cdk/commit/7158e45)), closes [#3561](https://github.com/aws/aws-cdk/issues/3561)
* **iam:** support permissions boundary policy for User and Role ([#3584](https://github.com/aws/aws-cdk/issues/3584)) ([661a95e](https://github.com/aws/aws-cdk/commit/661a95e))
* **.net:** templatized csharp sample app and moved from init to sample-app.   Changed hook code to allow templating. ([#3525](https://github.com/aws/aws-cdk/issues/3525)) ([dd52cec](https://github.com/aws/aws-cdk/commit/dd52cec))
* **route53:** add classic elb target support ([#3380](https://github.com/aws/aws-cdk/issues/3380)) ([b0720dd](https://github.com/aws/aws-cdk/commit/b0720dd))
* **route53-targets:** s3 bucket website target support ([#3618](https://github.com/aws/aws-cdk/issues/3618)) ([bccc11f](https://github.com/aws/aws-cdk/commit/bccc11f))
* **s3:** website routing rules ([#3411](https://github.com/aws/aws-cdk/issues/3411)) ([33f3554](https://github.com/aws/aws-cdk/commit/33f3554))
* **s3-deployment:** CloudFront invalidation ([#3213](https://github.com/aws/aws-cdk/issues/3213)) ([e84bdd6](https://github.com/aws/aws-cdk/commit/e84bdd6)), closes [#3106](https://github.com/aws/aws-cdk/issues/3106)


### BREAKING CHANGES

* **eks:** clusters will be created with a default capacity of x2 m5.large instances.
  You can specify `defaultCapacity: 0` if you wish to disable.
* **stepfunctions-tasks:** To define a callback task, users should specify "serviceIntegrationPattern: sfn.ServiceIntegrationPattern.WAIT_FOR_TASK_TOKEN" instead of "waitForTaskToken: true".
  For a sync task, users should use "serviceIntegrationPattern: sfn.ServiceIntegrationPattern.SYNC" in the place of "synchronous: true".



## [1.3.0](https://github.com/aws/aws-cdk/compare/v1.2.0...v1.3.0) (2019-08-02)


### Bug Fixes

* **aws-ecs-patterns:** update ecs-patterns to be consistent across constructs ([#3404](https://github.com/aws/aws-cdk/issues/3404)) ([f7fbbe0](https://github.com/aws/aws-cdk/commit/f7fbbe0))
* **aws-kms:** Incomplete KMS Resource Policy Permissions ([#3459](https://github.com/aws/aws-cdk/issues/3459)) ([1280071](https://github.com/aws/aws-cdk/commit/1280071)), closes [#3458](https://github.com/aws/aws-cdk/issues/3458) [#3458](https://github.com/aws/aws-cdk/issues/3458)
* **cli:** conversion of "tags" filter for EC2 DescribeVpcs call ([#3393](https://github.com/aws/aws-cdk/issues/3393)) ([cf2e3f6](https://github.com/aws/aws-cdk/commit/cf2e3f6)), closes [#3372](https://github.com/aws/aws-cdk/issues/3372)
* **cli:** correctly handle tags when deploying multiple stacks ([#3455](https://github.com/aws/aws-cdk/issues/3455)) ([4cb9755](https://github.com/aws/aws-cdk/commit/4cb9755)), closes [#3471](https://github.com/aws/aws-cdk/issues/3471)
* **core:** stop relying on === to find PhysicalName.GENERATE_IF_NEEDED ([#3506](https://github.com/aws/aws-cdk/issues/3506)) ([c7e9dfb](https://github.com/aws/aws-cdk/commit/c7e9dfb))
* **iam:** correctly limit the default PolicyName to 128 characters ([#3487](https://github.com/aws/aws-cdk/issues/3487)) ([8259756](https://github.com/aws/aws-cdk/commit/8259756)), closes [#3402](https://github.com/aws/aws-cdk/issues/3402)
* **toolkit:** avoid EMFILE and preserve mode when zipping ([#3428](https://github.com/aws/aws-cdk/issues/3428)) ([750708b](https://github.com/aws/aws-cdk/commit/750708b)), closes [#3145](https://github.com/aws/aws-cdk/issues/3145) [#3344](https://github.com/aws/aws-cdk/issues/3344) [#3413](https://github.com/aws/aws-cdk/issues/3413)


### Features

* **codepipeline:** make Pipeline importable by ARN ([#3469](https://github.com/aws/aws-cdk/issues/3469)) ([8a100e5](https://github.com/aws/aws-cdk/commit/8a100e5)), closes [#3467](https://github.com/aws/aws-cdk/issues/3467)
* **core:** improved API for tags ([#3465](https://github.com/aws/aws-cdk/issues/3465)) ([e15d391](https://github.com/aws/aws-cdk/commit/e15d391))
* **ecs:** ECS optimized Windows images ([#3376](https://github.com/aws/aws-cdk/issues/3376)) ([6c0bf4a](https://github.com/aws/aws-cdk/commit/6c0bf4a)), closes [#3398](https://github.com/aws/aws-cdk/issues/3398) [#2574](https://github.com/aws/aws-cdk/issues/2574)
* **ecs:** make cluster and vpc optional for higher level constructs ([#2773](https://github.com/aws/aws-cdk/issues/2773)) ([979f6fd](https://github.com/aws/aws-cdk/commit/979f6fd))
* **ecs:** support secret environment variables ([#2994](https://github.com/aws/aws-cdk/issues/2994)) ([bc233fa](https://github.com/aws/aws-cdk/commit/bc233fa)), closes [#1478](https://github.com/aws/aws-cdk/issues/1478)
* **events:** ability to add cross-account targets ([#3323](https://github.com/aws/aws-cdk/issues/3323)) ([3b794ea](https://github.com/aws/aws-cdk/commit/3b794ea))



## [1.2.0](https://github.com/aws/aws-cdk/compare/v1.1.0...v1.2.0) (2019-07-25)


### Bug Fixes

* **assert:** CfnParameter MatchStyle diff support ([#3408](https://github.com/aws/aws-cdk/issues/3408)) ([2747a76](https://github.com/aws/aws-cdk/commit/2747a76)), closes [#3399](https://github.com/aws/aws-cdk/issues/3399)
* **ecs:** make registry URL domain-suffix dependent ([#3394](https://github.com/aws/aws-cdk/issues/3394)) ([c989fa4](https://github.com/aws/aws-cdk/commit/c989fa4)), closes [#3377](https://github.com/aws/aws-cdk/issues/3377)
* **events:** allow adding the same target to rule multiple times ([#3353](https://github.com/aws/aws-cdk/issues/3353)) ([5879178](https://github.com/aws/aws-cdk/commit/5879178)), closes [#3173](https://github.com/aws/aws-cdk/issues/3173)
* **s3:** fail early with bad notification filters ([#3397](https://github.com/aws/aws-cdk/issues/3397)) ([cd0e9bd](https://github.com/aws/aws-cdk/commit/cd0e9bd)), closes [#3347](https://github.com/aws/aws-cdk/issues/3347) [#3398](https://github.com/aws/aws-cdk/issues/3398)


### Features

* **cli:** VPC context provider looks up RouteTable IDs ([#3171](https://github.com/aws/aws-cdk/issues/3171)) ([6d762f9](https://github.com/aws/aws-cdk/commit/6d762f9))
* **cloudformation:** update to Resource Specification v4.2.0 ([#3351](https://github.com/aws/aws-cdk/issues/3351)) ([9ec57af](https://github.com/aws/aws-cdk/commit/9ec57af))
* **cloudwatch:** dashboardName validation ([#3382](https://github.com/aws/aws-cdk/issues/3382)) ([f53f845](https://github.com/aws/aws-cdk/commit/f53f845)), closes [#2976](https://github.com/aws/aws-cdk/issues/2976)
* **core:** allow multiple transforms on ITemplateOptions ([#3395](https://github.com/aws/aws-cdk/issues/3395)) ([9565b9b](https://github.com/aws/aws-cdk/commit/9565b9b)), closes [#3366](https://github.com/aws/aws-cdk/issues/3366)
* **s3:** bucket access control ([#3391](https://github.com/aws/aws-cdk/issues/3391)) ([820575b](https://github.com/aws/aws-cdk/commit/820575b)), closes [/docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket.html#cfn-s3](https://github.com//docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket.html/issues/cfn-s3) [#3383](https://github.com/aws/aws-cdk/issues/3383)
* **s3:** bucket websiteRedirect ([#3392](https://github.com/aws/aws-cdk/issues/3392)) ([dd574cc](https://github.com/aws/aws-cdk/commit/dd574cc)), closes [/docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-websiteconfiguration.html#cfn-s3](https://github.com//docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-websiteconfiguration.html/issues/cfn-s3) [#1083](https://github.com/aws/aws-cdk/issues/1083)



## [1.1.0](https://github.com/aws/aws-cdk/compare/v1.0.0...v1.1.0) (2019-07-18)


### Bug Fixes

* **codepipeline:** invoked Lambda doesn't have permissions to the pipeline bucket ([#3303](https://github.com/aws/aws-cdk/issues/3303)) ([50c7319](https://github.com/aws/aws-cdk/commit/50c7319)), closes [#3274](https://github.com/aws/aws-cdk/issues/3274)
* **logs:** fix infinite retention for jsii users ([#3250](https://github.com/aws/aws-cdk/issues/3250)) ([0b1ea76](https://github.com/aws/aws-cdk/commit/0b1ea76))


### Features

* **acm:** add support for validationMethod ([#3252](https://github.com/aws/aws-cdk/issues/3252)) ([ceb857d](https://github.com/aws/aws-cdk/commit/ceb857d))
* **codebuild:** make artifact encryption configurable ([#3230](https://github.com/aws/aws-cdk/issues/3230)) ([792a260](https://github.com/aws/aws-cdk/commit/792a260))
* **ec2:** add new EC2 instance types [#3308](https://github.com/aws/aws-cdk/issues/3308) ([#3309](https://github.com/aws/aws-cdk/issues/3309)) ([184b93f](https://github.com/aws/aws-cdk/commit/184b93f))
* **eks:** update Kubernetes AMIs and latest version ([#3331](https://github.com/aws/aws-cdk/issues/3331)) ([3fcdb45](https://github.com/aws/aws-cdk/commit/3fcdb45))



## [1.0.0](https://github.com/aws/aws-cdk/compare/v0.39.0...v1.0.0) (2019-07-09)


### General Availability of the AWS Cloud Development Kit!! 🎉🎉🥂🥂🍾🍾

We are excited to announce the 1.0.0 release of the AWS CDK –
including GA support for TypeScript, JavaScript, and Python!

We want to thank all of our early customers, and the hundreds of contributors,
for all the help and support in making this release a reality.
Thank you for the patience to deal with the many, many breaking changes that happened along the way.
This product would not be what it is today if it weren't for all the feedback,
diligent issue reporting (bugs, missing features, unclear documentation, etc.),
and code contributions from the community.

Special thanks go out to a few of our most prolific contributors who went above and beyond to help improve the CDK:

* [Mike Cowgill](https://github.com/moofish32)
* [Jonathan Goldwasser](https://github.com/jogold)
* [Breland Miley](https://github.com/mindstorms6)
* [Piradeep Kandasamy](https://github.com/pkandasamy91)
* [Hsing-Hui Hsu](https://github.com/SoManyHs)
* [Simon-Pierre Gingras](https://github.com/spg)
* [Jungseok Lee](https://github.com/jungseoklee)
* [Clare Liguori](https://github.com/clareliguori)
* [Yenlin Chen](https://github.com/hencrice)
* [Lee Packham](https://github.com/leepa)

1.0.0 is a huge milestone for us, but it's still only the beginning!
We are excited to continue evolving the CDK, to introduce support for new languages and capabilities,
and to continue working closely with the open-source community.


### Bug Fixes

* **cli:** output message when successfully synthesizing multiple stacks ([#3259](https://github.com/aws/aws-cdk/issues/3259)) ([0c30f12](https://github.com/aws/aws-cdk/commit/0c30f12))
* **python:** Make sure stack name in the init template does not contain illegal characters ([#3261](https://github.com/aws/aws-cdk/issues/3261)) ([7d22b2c](https://github.com/aws/aws-cdk/commit/7d22b2c))


## [0.39.0](https://github.com/aws/aws-cdk/compare/v0.38.0...v0.39.0) (2019-07-08)


### Bug Fixes

* **codepipeline:** mark crossRegionReplicationBuckets and crossRegionSupport as experimental. ([#3226](https://github.com/aws/aws-cdk/issues/3226)) ([f8256e7](https://github.com/aws/aws-cdk/commit/f8256e7))
* **assets:** packages `assets`, `aws-ecr-assets` and `aws-s3-assets` are now experimental instead of stable


### BREAKING CHANGES

* **codepipeline:** Pipeline.crossRegionReplicationBuckets is now experimental
* **codepipeline:** Pipeline.crossRegionSupport is now experimental
* **codepipeline:** CrossRegionSupport is now experimental
* **assets:** package `assets`is now experimental instead of stable
* **aws-ecr-assets:** package `aws-ecr-assets`is now experimental instead of stable
* **aws-s3-assets:** package `aws-s3-assets`is now experimental instead of stable


## [0.38.0](https://github.com/aws/aws-cdk/compare/v0.37.0...v0.38.0) (2019-07-08)


### Bug Fixes

* **cli:** exclusively is also '-e' for destroy ([#3216](https://github.com/aws/aws-cdk/issues/3216)) ([d6f5207](https://github.com/aws/aws-cdk/commit/d6f5207)), closes [#2367](https://github.com/aws/aws-cdk/issues/2367)
* **cloudwatch:** AlarmWidget takes IAlarm ([#3219](https://github.com/aws/aws-cdk/issues/3219)) ([9948bfd](https://github.com/aws/aws-cdk/commit/9948bfd)), closes [#3068](https://github.com/aws/aws-cdk/issues/3068)
* **core:** fix build errors in fsharp init-template ([#3229](https://github.com/aws/aws-cdk/issues/3229)) ([7d020f1](https://github.com/aws/aws-cdk/commit/7d020f1))
* **core:** UpdateReplacePolicy mirrors DeletionPolicy ([#3217](https://github.com/aws/aws-cdk/issues/3217)) ([d61bd2c](https://github.com/aws/aws-cdk/commit/d61bd2c)), closes [#2901](https://github.com/aws/aws-cdk/issues/2901)
* **ecr:** repository grant uses correct resource ARN ([#3220](https://github.com/aws/aws-cdk/issues/3220)) ([cc2275c](https://github.com/aws/aws-cdk/commit/cc2275c)), closes [#2473](https://github.com/aws/aws-cdk/issues/2473)
* **iam:** fix managed policies for User ([#3221](https://github.com/aws/aws-cdk/issues/3221)) ([ec1c5b7](https://github.com/aws/aws-cdk/commit/ec1c5b7)), closes [#2557](https://github.com/aws/aws-cdk/issues/2557)
* make capitalization of Ip/Az consistent ([#3202](https://github.com/aws/aws-cdk/issues/3202)) ([d60d673](https://github.com/aws/aws-cdk/commit/d60d673))


### Features

* use classes for structs in Python ([#3232](https://github.com/aws/aws-cdk/issues/3232)) ([161a459](https://github.com/aws/aws-cdk/commit/161a459))
* **codebuild:** allow specifying principals and credentials for pulling build images. ([#3049](https://github.com/aws/aws-cdk/issues/3049)) ([3319fe5](https://github.com/aws/aws-cdk/commit/3319fe5)), closes [#2175](https://github.com/aws/aws-cdk/issues/2175)


### BREAKING CHANGES

* **codebuild:** `LinuxBuildImage.fromDockerHub()` has been renamed to `fromDockerRegistry()` and `WindowsBuildImage.fromDockerHub()` has been renamed to `fromDockerRegistry()`
* **iam:** `aws-iam.User` and `Group`: `managedPolicyArns` =>
`managedPolicies`.
* in all identifiers, renamed `IPv4` => `Ipv4`, `IPv6` =>
`Ipv6`, `AZs` => `Azs`.


## [0.37.0](https://github.com/aws/aws-cdk/compare/v0.36.2...v0.37.0) (2019-07-04)


### Bug Fixes

* **core:** fix some return types ([#3192](https://github.com/aws/aws-cdk/issues/3192)) ([b5997c3](https://github.com/aws/aws-cdk/commit/b5997c3))
* **ecs:** grant drain-hook policy container-instance permissions ([#3199](https://github.com/aws/aws-cdk/issues/3199)) ([7796cd7](https://github.com/aws/aws-cdk/commit/7796cd7)), closes [#3190](https://github.com/aws/aws-cdk/issues/3190)
* **sns:** allow tokens to be used in UrlSubscription ([#2938](https://github.com/aws/aws-cdk/issues/2938)) ([5ce4141](https://github.com/aws/aws-cdk/commit/5ce4141))
* **ssm:** correctly deduplicate parameter names ([#3183](https://github.com/aws/aws-cdk/issues/3183)) ([47bf435](https://github.com/aws/aws-cdk/commit/47bf435)), closes [#3076](https://github.com/aws/aws-cdk/issues/3076)
* **stepfunctions:** Downscope SageMaker permissions ([#2991](https://github.com/aws/aws-cdk/issues/2991)) ([69c82c8](https://github.com/aws/aws-cdk/commit/69c82c8))


### BREAKING CHANGES

* **core:** `construct.findChild()` now only looks up direct children
* **ec2:** `Port.toRuleJSON` was renamed to `toRuleJson`
* **codebuild:** `PipelineProject.addSecondaryArtifact` now returns void (formerly any)
* **codebuild:** `Project.addSecondaryArtifact` now returns void (formerly any)

## [0.36.2](https://github.com/aws/aws-cdk/compare/v0.36.1...v0.36.2) (2019-07-03)


### Bug Fixes

* **cli:** generate metadata resource for region-independent stacks ([#3149](https://github.com/aws/aws-cdk/issues/3149)) ([0fb7ea3](https://github.com/aws/aws-cdk/commit/0fb7ea3)), closes [#3142](https://github.com/aws/aws-cdk/issues/3142)
* **cli:** stop processing on metadata errors ([#3168](https://github.com/aws/aws-cdk/issues/3168)) ([0936bde](https://github.com/aws/aws-cdk/commit/0936bde))
* **codepipeline:** correctly pass the replication buckets to Action.bind() ([#3131](https://github.com/aws/aws-cdk/issues/3131)) ([99ae5e7](https://github.com/aws/aws-cdk/commit/99ae5e7))
* **codepipeline:** grant missing permisisons to the CloudFormationExecuteChangeSetAction. ([#3178](https://github.com/aws/aws-cdk/issues/3178)) ([958acc2](https://github.com/aws/aws-cdk/commit/958acc2)), closes [#3160](https://github.com/aws/aws-cdk/issues/3160)
* **codepipeline:** grant the CodeCommit source Action read-write permissions to the Pipeline's Bucket. ([#3175](https://github.com/aws/aws-cdk/issues/3175)) ([bd46e49](https://github.com/aws/aws-cdk/commit/bd46e49)), closes [#3170](https://github.com/aws/aws-cdk/issues/3170)
* **core:** prevent volatile physical name generation ([#2984](https://github.com/aws/aws-cdk/issues/2984)) ([af2680c](https://github.com/aws/aws-cdk/commit/af2680c))
* **ecs:** remove temporary workaround for long arn support ([#3072](https://github.com/aws/aws-cdk/issues/3072)) ([9fdb63f](https://github.com/aws/aws-cdk/commit/9fdb63f)), closes [#2176](https://github.com/aws/aws-cdk/issues/2176)


### Features

* **codedeploy:** allow setting a Deployment Configuration for an imported Lambda Deployment Group. ([#3158](https://github.com/aws/aws-cdk/issues/3158)) ([05a49f0](https://github.com/aws/aws-cdk/commit/05a49f0))
* **iam:** can configure 'deny' for policy statements ([#3165](https://github.com/aws/aws-cdk/issues/3165)) ([6679e86](https://github.com/aws/aws-cdk/commit/6679e86))


## [0.36.1](https://github.com/aws/aws-cdk/compare/v0.36.0...v0.36.1) (2019-07-01)

### Bug Fixes

* **aws-codepipeline-actions:** use SecretValue ([#3097](https://github.com/aws/aws-cdk/issues/3097)) ([b84caab](https://github.com/aws/aws-cdk/commit/b84caab))
* **cli:** fix broken sample-app templates for TypeScript and JavaScript ([#3101](https://github.com/aws/aws-cdk/issues/3101)) ([800ecf2](https://github.com/aws/aws-cdk/commit/800ecf2))
* **cli:** fix broken test in Java init template ([#3108](https://github.com/aws/aws-cdk/issues/3108)) ([f696efc](https://github.com/aws/aws-cdk/commit/f696efc)), closes [#3065](https://github.com/aws/aws-cdk/issues/3065)
* **cli:** fix Python sample-app template ([#3071](https://github.com/aws/aws-cdk/issues/3071)) ([796d6bb](https://github.com/aws/aws-cdk/commit/796d6bb)), closes [#3058](https://github.com/aws/aws-cdk/issues/3058) [#3069](https://github.com/aws/aws-cdk/issues/3069)
* **cli:** improve description of --json to reflect behavior ([#3086](https://github.com/aws/aws-cdk/issues/3086)) ([68cfa54](https://github.com/aws/aws-cdk/commit/68cfa54)), closes [#2965](https://github.com/aws/aws-cdk/issues/2965)
* **cli:** Python blank app should call app.synth(), not app.run() ([16345dc](https://github.com/aws/aws-cdk/commit/16345dc)), closes [#3123](https://github.com/aws/aws-cdk/issues/3123)
* **cli:** update TypeScript lib init template ([#3134](https://github.com/aws/aws-cdk/issues/3134)) ([629e963](https://github.com/aws/aws-cdk/commit/629e963))
* **code:** make CfnResource#_toCloudFormation null-safe ([#3121](https://github.com/aws/aws-cdk/issues/3121)) ([71cb421](https://github.com/aws/aws-cdk/commit/71cb421)), closes [#3093](https://github.com/aws/aws-cdk/issues/3093)
* **codepipeline-actions:** set service as backing resource for EcsDeployAction ([#3085](https://github.com/aws/aws-cdk/issues/3085)) ([f2293e0](https://github.com/aws/aws-cdk/commit/f2293e0))
* **core:** improve context providers error message for env-agnostic stacks ([#3137](https://github.com/aws/aws-cdk/issues/3137)) ([5b80146](https://github.com/aws/aws-cdk/commit/5b80146)), closes [#2922](https://github.com/aws/aws-cdk/issues/2922) [#3078](https://github.com/aws/aws-cdk/issues/3078) [#3120](https://github.com/aws/aws-cdk/issues/3120) [#3130](https://github.com/aws/aws-cdk/issues/3130)
* **documentation:** auto-labeling fixed ([#3089](https://github.com/aws/aws-cdk/issues/3089)) ([7fb82ad](https://github.com/aws/aws-cdk/commit/7fb82ad))
* **documentation:** removed duplicate generated template ([#3090](https://github.com/aws/aws-cdk/issues/3090)) ([590b05c](https://github.com/aws/aws-cdk/commit/590b05c))
* **elasticloadbalancingv2:** fix to be able to set deregistrationDelay ([#3075](https://github.com/aws/aws-cdk/issues/3075)) ([22ab4b4](https://github.com/aws/aws-cdk/commit/22ab4b4))
* **events:** correct token resolution in RuleTargetInput ([#3127](https://github.com/aws/aws-cdk/issues/3127)) ([a20c841](https://github.com/aws/aws-cdk/commit/a20c841)), closes [#3119](https://github.com/aws/aws-cdk/issues/3119)
* **sns:** create subscriptions in consumer scope ([#3065](https://github.com/aws/aws-cdk/issues/3065)) ([64a203f](https://github.com/aws/aws-cdk/commit/64a203f)), closes [#3064](https://github.com/aws/aws-cdk/issues/3064)


### Features

* **apigateway:** support custom domain names ([#3135](https://github.com/aws/aws-cdk/issues/3135)) ([52b136b](https://github.com/aws/aws-cdk/commit/52b136b)), closes [#3103](https://github.com/aws/aws-cdk/issues/3103)
* **aws-apigateway:** expand RestApi support to models, parameters and validators ([#2960](https://github.com/aws/aws-cdk/issues/2960)) ([12e6380](https://github.com/aws/aws-cdk/commit/12e6380)), closes [#905](https://github.com/aws/aws-cdk/issues/905) [#1695](https://github.com/aws/aws-cdk/issues/1695) [#727](https://github.com/aws/aws-cdk/issues/727) [#723](https://github.com/aws/aws-cdk/issues/723) [#2957](https://github.com/aws/aws-cdk/issues/2957)
* **codepipeline:** generate a Role for every AWS-owned Action used in a Pipeline. ([#3105](https://github.com/aws/aws-cdk/issues/3105)) ([921dcc9](https://github.com/aws/aws-cdk/commit/921dcc9))
* **core:** add Tokenization.isResolvable for aspects ([#3122](https://github.com/aws/aws-cdk/issues/3122)) ([d3a417e](https://github.com/aws/aws-cdk/commit/d3a417e)), closes [#3026](https://github.com/aws/aws-cdk/issues/3026)
* **dynamodb:** support RemovalPolicy ([#3028](https://github.com/aws/aws-cdk/issues/3028)) ([a6175be](https://github.com/aws/aws-cdk/commit/a6175be)), closes [#2710](https://github.com/aws/aws-cdk/issues/2710)


## [0.36.0](https://github.com/aws/aws-cdk/compare/v0.35.0...v0.36.0) (2019-06-24)

### Bug Fixes

* **certificatemanager:** increase wait time for DNS validation ([#2961](https://github.com/aws/aws-cdk/issues/2961)) ([5b5ca48](https://github.com/aws/aws-cdk/commit/5b5ca48)), closes [#2914](https://github.com/aws/aws-cdk/issues/2914)
* **cli:** disable line folding in YAML ([#2964](https://github.com/aws/aws-cdk/issues/2964)) ([0dabb02](https://github.com/aws/aws-cdk/commit/0dabb02)), closes [#2703](https://github.com/aws/aws-cdk/issues/2703)
* **cloudfront:** fixes typos in cloudfront docs ([#3021](https://github.com/aws/aws-cdk/issues/3021)) ([46b3292](https://github.com/aws/aws-cdk/commit/46b3292)), closes [#3019](https://github.com/aws/aws-cdk/issues/3019)
* **core:** incorrect arg type on Fn.eachMemberIn ([#2958](https://github.com/aws/aws-cdk/issues/2958)) ([5baa31f](https://github.com/aws/aws-cdk/commit/5baa31f)), closes [#2950](https://github.com/aws/aws-cdk/issues/2950)
* **core:** record DependableTrait directly on instance ([#2962](https://github.com/aws/aws-cdk/issues/2962)) ([e535929](https://github.com/aws/aws-cdk/commit/e535929)), closes [#2713](https://github.com/aws/aws-cdk/issues/2713)
* **elbv2:** restrict ALB access logs bucket permissions to minimum ([#2929](https://github.com/aws/aws-cdk/issues/2929)) ([370b905](https://github.com/aws/aws-cdk/commit/370b905))
* **rds:** correctly expose DatabaseCluster's read endpoint ([#2970](https://github.com/aws/aws-cdk/issues/2970)) ([2d50c18](https://github.com/aws/aws-cdk/commit/2d50c18)), closes [#2969](https://github.com/aws/aws-cdk/issues/2969)
* **ecr:** align IRepository events to RepositoryBase ([#3036](https://github.com/aws/aws-cdk/issues/3036)) ([f51760f](https://github.com/aws/aws-cdk/commit/f51760f)), closes [#2921](https://github.com/aws/aws-cdk/issues/2921)
* **route53:** dummy hosted zone has right name ([#2995](https://github.com/aws/aws-cdk/issues/2995)) ([76b5309](https://github.com/aws/aws-cdk/commit/76b5309)), closes [#2076](https://github.com/aws/aws-cdk/issues/2076)
* **sfn:** pass support non-object Result types ([#2811](https://github.com/aws/aws-cdk/issues/2811)) ([5282a08](https://github.com/aws/aws-cdk/commit/5282a08))
* **stepfunctions:** fix passing of Token in RunLambdaTask ([#2939](https://github.com/aws/aws-cdk/issues/2939)) ([58a80ab](https://github.com/aws/aws-cdk/commit/58a80ab)), closes [#2937](https://github.com/aws/aws-cdk/issues/2937)
* **cli:** ensure asset zips are consistently produced ([#2931](https://github.com/aws/aws-cdk/issues/2931)) ([9101161](https://github.com/aws/aws-cdk/commit/9101161)), closes [#1997](https://github.com/aws/aws-cdk/issues/1997) [#2759](https://github.com/aws/aws-cdk/issues/2759)

### Code Refactoring

* rename all L1 enum-like members to ALL_CAPS [#3024](https://github.com/aws/aws-cdk/issues/3024) [#3023](https://github.com/aws/aws-cdk/issues/3023), [#3018](https://github.com/aws/aws-cdk/issues/3018) [#980](https://github.com/aws/aws-cdk/issues/980) [#2989](https://github.com/aws/aws-cdk/issues/2989) [#2918](https://github.com/aws/aws-cdk/issues/2918) [#2287](https://github.com/aws/aws-cdk/issues/2287)
* **cx-api:** bump cli <=> cdk protocol version ([#2956](https://github.com/aws/aws-cdk/issues/2956)) ([8ab84ec](https://github.com/aws/aws-cdk/commit/8ab84ec)), closes [#2922](https://github.com/aws/aws-cdk/issues/2922)
* **cloudformation:** extract "custom-resources" module ([#3027](https://github.com/aws/aws-cdk/issues/3027)) ([767687d](https://github.com/aws/aws-cdk/commit/767687d)), closes [#2951](https://github.com/aws/aws-cdk/issues/2951)
* **codepipeline:** API cleanup. ([#2982](https://github.com/aws/aws-cdk/issues/2982)) ([13025c4](https://github.com/aws/aws-cdk/commit/13025c4))
* **codepipeline:** change the API of cross-region replication Buckets. ([#2977](https://github.com/aws/aws-cdk/issues/2977)) ([98afdeb](https://github.com/aws/aws-cdk/commit/98afdeb))
* **codepipeline:** introduce IAction and unify the Action.bind() signature ([#3012](https://github.com/aws/aws-cdk/issues/3012)) ([089fc93](https://github.com/aws/aws-cdk/commit/089fc93))
* **core:** additional api cleanups ([#2972](https://github.com/aws/aws-cdk/issues/2972)) ([7fb6fd6](https://github.com/aws/aws-cdk/commit/7fb6fd6)), closes [#2971](https://github.com/aws/aws-cdk/issues/2971)
* **core:** CfnResource.options => cfnOptions ([#3030](https://github.com/aws/aws-cdk/issues/3030)) ([e537e4c](https://github.com/aws/aws-cdk/commit/e537e4c))
* **core:** rename "Stack.autoRun" to "autoSynth" ([#3016](https://github.com/aws/aws-cdk/issues/3016)) ([3b44791](https://github.com/aws/aws-cdk/commit/3b44791))
* **core:** rename @aws-cdk/cdk to @aws-cdk/core ([#2932](https://github.com/aws/aws-cdk/issues/2932)) ([4a0272d](https://github.com/aws/aws-cdk/commit/4a0272d)), closes [#2733](https://github.com/aws/aws-cdk/issues/2733)
* **ecs:** hide `clusterName` from Services ([#2980](https://github.com/aws/aws-cdk/issues/2980)) ([a6e4f6a](https://github.com/aws/aws-cdk/commit/a6e4f6a))

### Features

* Support physical names in the entire Construct Library ([#2894](https://github.com/aws/aws-cdk/issues/2894)) ([d9d3a99](https://github.com/aws/aws-cdk/commit/d9d3a99))
* **codepipeline-actions:** Add CAPABILITY_AUTO_EXPAND ([#2851](https://github.com/aws/aws-cdk/issues/2851)) ([#2852](https://github.com/aws/aws-cdk/issues/2852)) ([c9340a6](https://github.com/aws/aws-cdk/commit/c9340a6))
* **core:** environment-agnostic cloud assemblies ([#2922](https://github.com/aws/aws-cdk/issues/2922)) ([c75d245](https://github.com/aws/aws-cdk/commit/c75d245)), closes [#2866](https://github.com/aws/aws-cdk/issues/2866)
* **core:** Introduced Duration class ([#2857](https://github.com/aws/aws-cdk/issues/2857)) ([2ceec6c](https://github.com/aws/aws-cdk/commit/2ceec6c))
* **ecs:** change the default Amazon Linux generation to v2 ([#3009](https://github.com/aws/aws-cdk/issues/3009)) ([32e3421](https://github.com/aws/aws-cdk/commit/32e3421)), closes [#3005](https://github.com/aws/aws-cdk/issues/3005)
* **ecs:** set default health check grace period to 60s ([#2942](https://github.com/aws/aws-cdk/issues/2942)) ([0535d36](https://github.com/aws/aws-cdk/commit/0535d36)), closes [#2936](https://github.com/aws/aws-cdk/issues/2936)
* **events:** make target optional in `onXxx()` methods ([#2921](https://github.com/aws/aws-cdk/issues/2921)) ([ea10f0d](https://github.com/aws/aws-cdk/commit/ea10f0d)), closes [#2913](https://github.com/aws/aws-cdk/issues/2913)
* **issues:** new format for issue templates ([#2917](https://github.com/aws/aws-cdk/issues/2917)) ([67f6de0](https://github.com/aws/aws-cdk/commit/67f6de0))
* **sns:** add support for subscription filter policy ([#2778](https://github.com/aws/aws-cdk/issues/2778)) ([ae789ed](https://github.com/aws/aws-cdk/commit/ae789ed))

### BREAKING CHANGES

* *IMPORTANT*: previous versions of the CDK CLI will not be fully compatible with this version of the framework and vice versa.
* **core:** the `@aws-cdk/cdk` module was renamed to `@aws-cdk/core`, **python:** `aws_cdk.core`, **java:** the artifact `cdk` in groupId `software.amazon.awscdk` was renamed to `core`
* all enum and public static readonly members have been renamed to use "ALL_CAPS" capitalization
* properties throughout the AWS Construct Libraries that represent lengths of time have been re-typed to be `@aws-cdk/cdk.Duration` instead of `number`, and were renamed to exclude any unit indication.
* **core:** The deprecated `app.run()` has been removed (use `app.synth()`).
* **core:** The `CfnResource.options` property was renamed to `CfnResource.cfnOptions` to avoid conflicts with properties introduced by derived classes.
* **core** `CfnXxx.cfnResourceTypeName` is now `CFN_RESOURCE_TYPE_NAME` in generated CFN resources.
* **core:** `ContextProvider` is no longer designed to be extended. Use `ContextProvider.getValue` and `ContextProvider.getKey` as utilities.
* **core:** `Context.getSsmParameter` has been removed. Use `ssm.StringParameter.valueFromLookup`
* **core:** `Context.getAvailabilityZones` has been removed. Use `stack.availabilityZones`
* **core:** `Context.getDefaultAccount` and `getDefaultRegion` have been removed an no longer available. Use the environment variables `CDK_DEFAULT_ACCOUNT` and `CDK_DEFAULT_REGION` instead.
* **core:** `StackProps.autoRun` was renamed to `StackProps.autoSynth`.
* **core:** `CfnElement.refAsString` renamed to `ref` of `string` type. The `IResolvable` version have been removed.
* **core:** `IStringValue` renamed to `IStringProducer`
* **core:** `Include` renamed to `CfnInclude`
* **core:** `Cfn` prefix was added to the following types: `CfnCreationPolicy`, `CfnResourceAutoScalingCreationPolicy`, `CfnResourceAutoScalingCreationPolicy`, `CfnDeletionPolicy`, `CfnUpdatePolicy`, `CfnAutoScalingRollingUpdate`, `CfnAutoScalingReplacingUpdate`, `CfnAutoScalingScheduledAction`, `CfnCodeDeployLambdaAliasUpdate`, `CfnTag` `CfnRuleAssertion`, `CfnDynamicReferenceProps`
* **core:** `deepMerge` is no longer exported.
* **core:** `CfnOutputProps.export` was renamed to `exportName`.
* **core:** `CfnOutput` all properties are now private
* **core:** `StringListCfnOutput` has been removed
* **core:** all instance methods of `Fn` were made `static`, and the `Fn` constructor was made private.
* **ec2:** `VpcNetworkProvider` has been removed. Use `Vpc.fromLookup`.
* **ec2:** `ec2.MachineImage` will now resolve AMIs from SSM during deployment.
* **ecs:** `ecs.EcsOptimizedAmi` will now resolve AMis from SSM during deployment.
* **ecs:** previously, the default generation is conditionally set to Amazon Linux v1 if `hardwareType` was `STANDARD`. Now it always defaults to Amazon Linux v2.
* **ecs:** `service.clusterName` has been replaced with `.cluster`.
* **sam** `requiredTransform` is now `REQUIRED_TRANSFORM` in generated code.
* **cloudformation:** the `AwsCustomResource` class was moved to a new module called @aws-cdk/custom-resource
* **codepipeline**: the `capabilities` property is now an array to support multiple capabilities.
* **codepipeline:** the Pipeline construction property crossRegionReplicationBuckets now takes values of type IBucket instead of string.
* **corepipeline:** the property `Pipeline.crossRegionScaffoldStacks` has been renamed to `crossRegionSupport`, and its type changed from `CrossRegionScaffoldStack` to `CrossRegionSupport`.
* **codepipeline-actions:** rename `CodeCommitAction.pollForSourceChanges` to `trigger` and make it an enum.
* **codepipeline-actions:** rename S3SourceAction.pollForSourceChanges to `trigger`, and make it an enum.
* **codepipeline-actions:** rename StageAddToPipelineProps interface to StageOptions.
* **codepipeline-actions:** remove the classes `CloudFormationAction` and `CloudFormationDeployAction`.
* **route52:** `HostedZoneProvider` has been removed. Use `HostedZone.fromLookup`.

## [0.35.0](https://github.com/aws/aws-cdk/compare/v0.34.0...v0.35.0) (2019-06-19)


### Bug Fixes

* **cli:** Move version check TTL file to home directory ([#2774](https://github.com/aws/aws-cdk/issues/2774)) ([1ae11c0](https://github.com/aws/aws-cdk/commit/1ae11c0))
* **cli:** correctly pass Stack-level Tags ([#2829](https://github.com/aws/aws-cdk/issues/2829)) ([e0718ef](https://github.com/aws/aws-cdk/commit/e0718ef)), closes [#2822](https://github.com/aws/aws-cdk/issues/2822)
* **cli:** Hide @types/yargs types from types ([#2907](https://github.com/aws/aws-cdk/issues/2907)) ([095d8e2](https://github.com/aws/aws-cdk/commit/095d8e2)), closes [#2895](https://github.com/aws/aws-cdk/issues/2895)
* **cloudformation-diff:** string.replace error on `cdk context` ([#2870](https://github.com/aws/aws-cdk/issues/2870)) ([b8a1c8e](https://github.com/aws/aws-cdk/commit/b8a1c8e)), closes [#2854](https://github.com/aws/aws-cdk/issues/2854)
* **codebuild:** API cleanup. ([#2745](https://github.com/aws/aws-cdk/issues/2745)) ([c3667d7](https://github.com/aws/aws-cdk/commit/c3667d7))
* **codebuild:** correctly handle permissions for Projects inside VPC. ([#2662](https://github.com/aws/aws-cdk/issues/2662)) ([390baf1](https://github.com/aws/aws-cdk/commit/390baf1)), closes [#2651](https://github.com/aws/aws-cdk/issues/2651) [#2652](https://github.com/aws/aws-cdk/issues/2652)
* **core:** make IResolvable.creationStack required ([#2912](https://github.com/aws/aws-cdk/issues/2912)) ([7c6ebb6](https://github.com/aws/aws-cdk/commit/7c6ebb6))
* **core:** use default account/region when environment is not specified ([#2867](https://github.com/aws/aws-cdk/issues/2867)) ([e9a4a79](https://github.com/aws/aws-cdk/commit/e9a4a79)), closes [#2728](https://github.com/aws/aws-cdk/issues/2728) [#2853](https://github.com/aws/aws-cdk/issues/2853) [#2866](https://github.com/aws/aws-cdk/issues/2866)
* **ecs:** downscope permissions required by instance draining hook ([#2761](https://github.com/aws/aws-cdk/issues/2761)) ([9ea6148](https://github.com/aws/aws-cdk/commit/9ea6148))
* **ecs-patterns:** update constructs for ECS/Fargate consistency ([#2795](https://github.com/aws/aws-cdk/issues/2795)) ([1378e2d](https://github.com/aws/aws-cdk/commit/1378e2d))
* **events-targets:** event targets can have the same construct id ([#2744](https://github.com/aws/aws-cdk/issues/2744)) ([210dd0f](https://github.com/aws/aws-cdk/commit/210dd0f)), closes [#2377](https://github.com/aws/aws-cdk/issues/2377)
* **iam:** support adding permissions to imported roles ([#2805](https://github.com/aws/aws-cdk/issues/2805)) ([936464f](https://github.com/aws/aws-cdk/commit/936464f)), closes [#2381](https://github.com/aws/aws-cdk/issues/2381) [#2651](https://github.com/aws/aws-cdk/issues/2651) [#2652](https://github.com/aws/aws-cdk/issues/2652) [#2662](https://github.com/aws/aws-cdk/issues/2662)
* **cli:** Correct java init template ([#2889](https://github.com/aws/aws-cdk/issues/2889)) ([b3b3ba9](https://github.com/aws/aws-cdk/commit/b3b3ba9))
* **rds:** allow setting backupRetentionPeriod=0 ([#2875](https://github.com/aws/aws-cdk/issues/2875)) ([b0730dd](https://github.com/aws/aws-cdk/commit/b0730dd))
* **rds:** fix unresolved endpoint socket address ([#2846](https://github.com/aws/aws-cdk/issues/2846)) ([902636a](https://github.com/aws/aws-cdk/commit/902636a)), closes [#2711](https://github.com/aws/aws-cdk/issues/2711)
* **sqs:** remove 'Batch' permissions ([#2806](https://github.com/aws/aws-cdk/issues/2806)) ([654cb37](https://github.com/aws/aws-cdk/commit/654cb37)), closes [#2381](https://github.com/aws/aws-cdk/issues/2381)


### Code Refactoring

* **apigateway:** API cleanups ([#2903](https://github.com/aws/aws-cdk/issues/2903)) ([53e1191](https://github.com/aws/aws-cdk/commit/53e1191))
* **assets:** API cleanups ([#2910](https://github.com/aws/aws-cdk/issues/2910)) ([83eee09](https://github.com/aws/aws-cdk/commit/83eee09))
* **codebuild:** introduce BuildSpec object ([#2820](https://github.com/aws/aws-cdk/issues/2820)) ([86a2192](https://github.com/aws/aws-cdk/commit/86a2192))
* **codepipeline:** rename `name` in `StageProps` to `stageName`. ([#2882](https://github.com/aws/aws-cdk/issues/2882)) ([be574a1](https://github.com/aws/aws-cdk/commit/be574a1))
* **core:** revisit the Stack API ([#2818](https://github.com/aws/aws-cdk/issues/2818)) ([47afdc2](https://github.com/aws/aws-cdk/commit/47afdc2)), closes [#2728](https://github.com/aws/aws-cdk/issues/2728)
* **dynamodb:** API cleanups ([#2905](https://github.com/aws/aws-cdk/issues/2905)) ([d229836](https://github.com/aws/aws-cdk/commit/d229836))
* **ecs:** Asset ContainerImage no longer takes Construct arguments ([#2906](https://github.com/aws/aws-cdk/issues/2906)) ([8f400e7](https://github.com/aws/aws-cdk/commit/8f400e7))
* **ecs:** rename `hwType` to `hardwareType` ([#2916](https://github.com/aws/aws-cdk/issues/2916)) ([1aa0589](https://github.com/aws/aws-cdk/commit/1aa0589)), closes [#2896](https://github.com/aws/aws-cdk/issues/2896)
* **lambda:** renamed the lambda.Runtime enum values from NodeJS to Nodejs ([#2815](https://github.com/aws/aws-cdk/issues/2815)) ([10c37dd](https://github.com/aws/aws-cdk/commit/10c37dd)), closes [#980](https://github.com/aws/aws-cdk/issues/980)
* **lambda:** Standardize Lambda API ([#2876](https://github.com/aws/aws-cdk/issues/2876)) ([6446b78](https://github.com/aws/aws-cdk/commit/6446b78))
* **logs:** API cleanups ([#2909](https://github.com/aws/aws-cdk/issues/2909)) ([06221ac](https://github.com/aws/aws-cdk/commit/06221ac))
* **secretsmanager:** API cleanups ([#2908](https://github.com/aws/aws-cdk/issues/2908)) ([60f46c8](https://github.com/aws/aws-cdk/commit/60f46c8))
* **ssm:** API cleanups ([#2904](https://github.com/aws/aws-cdk/issues/2904)) ([bd1bcf5](https://github.com/aws/aws-cdk/commit/bd1bcf5))
* clean up API for removal policy across the library ([#2893](https://github.com/aws/aws-cdk/issues/2893)) ([65014ab](https://github.com/aws/aws-cdk/commit/65014ab))
* **sns:** move subscribers to `aws-sns-subscribers` ([#2804](https://github.com/aws/aws-cdk/issues/2804)) ([9ef899c](https://github.com/aws/aws-cdk/commit/9ef899c))
* **events:** clean up Events APIs (#2840) ([1e23921](https://github.com/aws/aws-cdk/commit/1e23921)), closes [#2840](https://github.com/aws/aws-cdk/issues/2840)
* **iam:** cleanup of IAM library (#2823) ([b735d1c](https://github.com/aws/aws-cdk/commit/b735d1c)), closes [#2823](https://github.com/aws/aws-cdk/issues/2823)


### Features

* **cli:** Expose props in CFN resources and remove propertyOverrides ([#2372](https://github.com/aws/aws-cdk/issues/2372)) ([#2372](https://github.com/aws/aws-cdk/issues/2372)) ([aa61dfb](https://github.com/aws/aws-cdk/commit/aa61dfb)), closes [#2100](https://github.com/aws/aws-cdk/issues/2100)
* **cli:** deploy/destory require explicit stack selection if app contains more than a single stack ([#2772](https://github.com/aws/aws-cdk/issues/2772)) ([118a716](https://github.com/aws/aws-cdk/commit/118a716)), closes [#2731](https://github.com/aws/aws-cdk/issues/2731)
* **cli:** Remove stack rename support ([#2819](https://github.com/aws/aws-cdk/issues/2819)) ([0f30e39](https://github.com/aws/aws-cdk/commit/0f30e39)), closes [#2670](https://github.com/aws/aws-cdk/issues/2670)
* **cloudformation:** add option to restrict data returned AwsCustomResource ([#2859](https://github.com/aws/aws-cdk/issues/2859)) ([a691900](https://github.com/aws/aws-cdk/commit/a691900)), closes [#2825](https://github.com/aws/aws-cdk/issues/2825)
* **cloudformation:** Add removalPolicy on CustomResource ([#2770](https://github.com/aws/aws-cdk/issues/2770)) ([859248a](https://github.com/aws/aws-cdk/commit/859248a))
* **cloudfront:** add Lambda associations ([#2760](https://github.com/aws/aws-cdk/issues/2760)) ([b088c8c](https://github.com/aws/aws-cdk/commit/b088c8c))
* **codepipeline:** final form of the CodeBuild Pipeline action. ([#2716](https://github.com/aws/aws-cdk/issues/2716)) ([c10fc9a](https://github.com/aws/aws-cdk/commit/c10fc9a))
* **core:** show token creation stack trace upon resolve error ([#2886](https://github.com/aws/aws-cdk/issues/2886)) ([f4c8dcd](https://github.com/aws/aws-cdk/commit/f4c8dcd))
* **ecs:** add metrics for Fargate services ([#2798](https://github.com/aws/aws-cdk/issues/2798)) ([acf015d](https://github.com/aws/aws-cdk/commit/acf015d))
* **ecs-patterns:** LoadBalancedFargateService - allow specifying containerName and role ([#2764](https://github.com/aws/aws-cdk/issues/2764)) ([df12197](https://github.com/aws/aws-cdk/commit/df12197))
* **elasticloadbalancing:** add crossZone load balancing ([#2787](https://github.com/aws/aws-cdk/issues/2787)) ([192bab7](https://github.com/aws/aws-cdk/commit/192bab7)), closes [#2786](https://github.com/aws/aws-cdk/issues/2786)
* **lambda:** Expose $LATEST function version ([#2792](https://github.com/aws/aws-cdk/issues/2792)) ([55d1bc8](https://github.com/aws/aws-cdk/commit/55d1bc8)), closes [#2776](https://github.com/aws/aws-cdk/issues/2776)
* **s3:** add CORS Property to S3 Bucket ([#2101](https://github.com/aws/aws-cdk/issues/2101)) ([#2843](https://github.com/aws/aws-cdk/issues/2843)) ([1a386d8](https://github.com/aws/aws-cdk/commit/1a386d8))
* **s3:** add missing storage classes and API cleanups ([#2834](https://github.com/aws/aws-cdk/issues/2834)) ([5cd9609](https://github.com/aws/aws-cdk/commit/5cd9609)), closes [#2708](https://github.com/aws/aws-cdk/issues/2708)
* **stepfunctions:** add grantStartExecution() ([#2793](https://github.com/aws/aws-cdk/issues/2793)) ([da32176](https://github.com/aws/aws-cdk/commit/da32176))
* **stepfunctions:** add support for AmazonSageMaker APIs ([#2808](https://github.com/aws/aws-cdk/issues/2808)) ([8b1f3ed](https://github.com/aws/aws-cdk/commit/8b1f3ed)), closes [#1314](https://github.com/aws/aws-cdk/issues/1314)
* **stepfunctions:** waitForTaskToken for Lambda, SQS, SNS ([#2686](https://github.com/aws/aws-cdk/issues/2686)) ([d017a14](https://github.com/aws/aws-cdk/commit/d017a14)), closes [#2658](https://github.com/aws/aws-cdk/issues/2658) [#2735](https://github.com/aws/aws-cdk/issues/2735)
* formalize the concept of physical names, and use them for cross-environment CodePipelines. ([#1924](https://github.com/aws/aws-cdk/issues/1924)) ([6daaca8](https://github.com/aws/aws-cdk/commit/6daaca8))


### BREAKING CHANGES

* **assets:** `AssetProps.packaging` has been removed and is now automatically discovered based on the file type.
* **assets:** `ZipDirectoryAsset` has been removed, use `aws-s3-assets.Asset`.
* **assets:** `FileAsset` has been removed, use `aws-s3-assets.Asset`.
* **lambda:** `Code.directory` and `Code.file` have been removed. Use `Code.asset`.
* **assets-docker:** The module has been renamed to **aws-ecr-assets**
* **ecs:** the property that specifies the type of EC2 AMI optimized for ECS was renamed to `hardwareType` from `hwType`.
* **codebuild:** the method addToRoleInlinePolicy in CodeBuild's Project class has been removed.
* **dynamodb:** `TableOptions.pitrEnabled` renamed to `pointInTimeRecovery`.
* **dynamodb:** `TableOptions.sseEnabled` renamed to `serverSideEncryption`.
* **dynamodb:** `TableOptions.ttlAttributeName` renamed to `timeToLiveAttribute`.
* **dynamodb:** `TableOptions.streamSpecification` renamed `stream`.
* **ecs:** `ContainerImage.fromAsset()` now takes only build directory
  directly (no need to pass `scope` or `id` anymore).
* **secretsmanager:** `ISecret.secretJsonValue` renamed to `secretValueFromJson`.
* **ssm:** `ParameterStoreString` has been removed. Use `StringParameter.fromStringParameterAttributes`.
* **ssm:** `ParameterStoreSecureString` has been removed. Use `StringParameter.fromSecureStringParameterAttributes`.
* **ssm:** `ParameterOptions.name` was renamed to `parameterName`.
* **logs:** `newStream` renamed to `addStream` and doesn't need a scope
* **logs:** `newSubscriptionFilter` renamed to `addSubscriptionFilter` and doesn't need a scope
* **logs:** `newMetricFilter` renamed to `addMetricFilter` and doesn't need a scope
* **logs:** `NewSubscriptionFilterProps` renamed to `SubscriptionProps`
* **logs:** `NewLogStreamProps` renamed to `LogStreamOptions`
* **logs:** `NewMetricFilterProps` renamed to `MetricFilterOptions`
* **logs:** `JSONPattern` renamed to `JsonPattern`
* **apigateway:** `MethodOptions.authorizerId` is now called `authorizer` and accepts an `IAuthorizer` which is a placeholder interface for the authorizer resource.
* **apigateway:** `restapi.executeApiArn` renamed to `arnForExecuteApi`.
* **apigateway:** `restapi.latestDeployment` and `deploymentStage` are now read-only.
* **events**: `EventPattern.detail` is now a map.
* **events**: `scheduleExpression: string` is now `schedule: Schedule`.
* multiple modules have been changed to use `cdk.RemovalPolicy`
to configure the resource's removal policy.
* **core:** `applyRemovalPolicy` is now `CfnResource.applyRemovalPolicy`.
* **core:** `RemovalPolicy.Orphan` has been renamed to `Retain`.
* **core:** `RemovalPolicy.Forbid` has been removed, use `Retain`.
* **ecr:** `RepositoryProps.retain` is now `removalPolicy`, and defaults to `Retain` instead of remove since ECR is a stateful resource
* **kms:** `KeyProps.retain` is now `removalPolicy`
* **logs:** `LogGroupProps.retainLogGroup` is now `removalPolicy`
* **logs:** `LogStreamProps.retainLogStream` is now `removalPolicy`
* **rds:** `DatabaseClusterProps.deleteReplacePolicy` is now `removalPolicy`
* **rds:** `DatabaseInstanceNewProps.deleteReplacePolicy` is now `removalPolicy`
* **codebuild:** rename BuildSource to Source, S3BucketSource to S3Source, BuildArtifacts to Artifacts, S3BucketBuildArtifacts to S3Artifacts
* **codebuild:** the classes CodePipelineBuildSource, CodePipelineBuildArtifacts, NoBuildSource, and NoBuildArtifacts have been removed
* **codebuild:** rename buildScriptAsset and buildScriptAssetEntrypoint to buildScript and buildScriptEntrypoint, respectively
* **cli:** All L1 ("Cfn") Resources attributes are now prefixed with
`attr` instead of the resource type. For example, in S3 `bucket.bucketArn` is now `bucket.attrArn`.
* `propertyOverrides` has been removed from all "Cfn" resources, instead
users can now read/write resource properties directly on the resource class. For example, instead of `lambda.propertyOverrides.runtime` just use `lambda.runtime`.
* **codepipeline:** the property designating the name of the stage when creating a CodePipeline is now called `stageName` instead of `name`
* **codepipeline:** the output and extraOutputs properties of the CodeBuildAction were merged into one property, outputs.
* **lambda:**
  - Renamed `Function.addLayer` to `addLayers` and made it variadic
  - Removed `IFunction.handler` property
  - Removed `IVersion.versionArn` property (the value is at `functionArn`)
  - Removed `SingletonLayerVersion`
  - Stopped exporting `LogRetention`
* **cli:** if an app includes more than one stack "cdk deploy" and "cdk destroy" now require that an explicit selector will be passed. Use "cdk deploy '*'" if you want to select all stacks.
* **iam**: `PolicyStatement` no longer has a fluid API, and accepts a
  props object to be able to set the important fields.
* **iam**: rename `ImportedResourcePrincipal` to `UnknownPrincipal`.
* **iam**: `managedPolicyArns` renamed to `managedPolicies`, takes
  return value from `ManagedPolicy.fromAwsManagedPolicyName()`.
* **iam**: `PolicyDocument.postProcess()` is now removed.
* **iam**: `PolicyDocument.addStatement()` renamed to `addStatements`.
* **iam**: `PolicyStatement` is no longer `IResolvable`, call `.toStatementJson()`
  to retrieve the IAM policy statement JSON.
* **iam**:  `AwsPrincipal` has been removed, use `ArnPrincipal` instead.
* **s3:** `s3.StorageClass` is now an enum-like class instead of a regular
enum. This means that you need to call `.value` in order to obtain it's value.
* **s3:** `s3.Coordinates` renamed to `s3.Location`
* **codepipeline:** `Artifact.s3Coordinates` renamed to `Artifact.s3Location`.
* **codebuild:** buildSpec argument is now a `BuildSpec` object.
* **lambda:** `lambda.Runtime.NodeJS*` are now `lambda.Runtime.Nodejs*`
* **core:** multiple changes to the `Stack` API
* **core:** `stack.name` renamed to `stack.stackName`
* **core:** `stack.stackName` will return the concrete stack name. Use `Aws.stackName` to indicate { Ref: "AWS::StackName" }.
* **core:** `stack.account` and `stack.region` will return the concrete account/region only if they are explicitly specified when the stack is defined (under the `env` prop). Otherwise, they will return a token that resolves to the AWS::AccountId and AWS::Region intrinsic references. Use `Context.getDefaultAccount()` and `Context.getDefaultRegion()` to obtain the defaults passed through the toolkit in case those are needed. Use `Token.isUnresolved(v)` to check if you have a concrete or intrinsic.
* **core:** `stack.logicalId` has been removed. Use `stack.getLogicalId()`
* **core:** `stack.env` has been removed, use `stack.account`, `stack.region` and `stack.environment` instead
* **core:** `stack.accountId` renamed to `stack.account` (to allow treating account more abstractly)
* **core:** `AvailabilityZoneProvider` can now be accessed through `Context.getAvailabilityZones()`
* **core:** `SSMParameterProvider` can now be accessed through `Context.getSsmParameter()`
* **core:** `parseArn` is now `Arn.parse`
* **core:** `arnFromComponents` is now `arn.format`
* **core:** `node.lock` and `node.unlock` are now private
* **core:** `stack.requireRegion` and `requireAccountId` have been removed. Use `Token.unresolved(stack.region)` instead
* **core:** `stack.parentApp` have been removed. Use `App.isApp(stack.node.root)` instead.
* **core:** `stack.missingContext` is now private
* **core:** `stack.renameLogical` have been renamed to `stack.renameLogicalId`
* **core:** `IAddressingScheme`, `HashedAddressingScheme` and `LogicalIDs` are now internal. Override `Stack.allocateLogicalId` to customize how logical IDs are allocated to resources.
* **cli:** The CLI no longer accepts `--rename`, and the stack
                 names are now immutable on the stack artifact.
* **sns:** using a queue, lambda, email, URL as SNS Subscriber now
requires an integration object from the `@aws-cdk/aws-sns-subscribers`
package.
* **ecs-patterns:** Renamed QueueWorkerService for base, ec2 and fargate to QueueProcessingService, QueueProcessingEc2Service, and QueueProcessingFargateService.
* **iam:** `roleName` in `RoleProps` is now of type `PhysicalName`
* **s3:** `bucketName` in `BucketProps` is now of type `PhysicalName`
* **codebuild:** `roleName` in `RoleProps` is now of type `PhysicalName`



## [0.34.0](https://github.com/aws/aws-cdk/compare/v0.33.0...v0.34.0) (2019-06-07)

### Bug Fixes

* **build:** Correct buildspec so it does not fail ([#2737](https://github.com/aws/aws-cdk/issues/2737)) ([e362ac8](https://github.com/aws/aws-cdk/commit/e362ac8))
* **certificatemanager:** correct certificateArn typo in the README ([#2712](https://github.com/aws/aws-cdk/issues/2712)) ([2bfc1c2](https://github.com/aws/aws-cdk/commit/2bfc1c2))
* **cli:** don't fail if region cannot be determined ([#2721](https://github.com/aws/aws-cdk/issues/2721)) ([0c72ef3](https://github.com/aws/aws-cdk/commit/0c72ef3)), closes [#2697](https://github.com/aws/aws-cdk/issues/2697)
* **cli:** remove support for applets ([#2691](https://github.com/aws/aws-cdk/issues/2691)) ([0997ee2](https://github.com/aws/aws-cdk/commit/0997ee2))
* **cloudwatch:** move SNS Alarm Action to `aws-cloudwatch-actions` ([#2688](https://github.com/aws/aws-cdk/issues/2688)) ([e3df21a](https://github.com/aws/aws-cdk/commit/e3df21a))
* **codebuild:** grant the Project's Role permissions to the KMS Key if it was passed. ([#2715](https://github.com/aws/aws-cdk/issues/2715)) ([4e12fe6](https://github.com/aws/aws-cdk/commit/4e12fe6))
* **core:** apply overrides after rendering properties ([#2685](https://github.com/aws/aws-cdk/issues/2685)) ([f2636e5](https://github.com/aws/aws-cdk/commit/f2636e5)), closes [#2677](https://github.com/aws/aws-cdk/issues/2677)
* **core:** Make filterUndefined null-safe ([#2789](https://github.com/aws/aws-cdk/issues/2789)) ([e4fb811](https://github.com/aws/aws-cdk/commit/e4fb811)), closes [awslabs/jsii#523](https://github.com/aws/jsii/issues/523)
* **ecs:** remove LoadBalancedFargateServiceApplet, no longer supported ([#2779](https://github.com/aws/aws-cdk/issues/2779)) ([a610017](https://github.com/aws/aws-cdk/commit/a610017))
* **ecs-patterns:** expose service on queue worker services ([#2780](https://github.com/aws/aws-cdk/issues/2780)) ([6d83cb9](https://github.com/aws/aws-cdk/commit/6d83cb9))
* **pkglint:** Adjust stability banner style ([#2768](https://github.com/aws/aws-cdk/issues/2768)) ([da94d8b](https://github.com/aws/aws-cdk/commit/da94d8b))
* **route53:** support zone roots as record names ([#2705](https://github.com/aws/aws-cdk/issues/2705)) ([08a2852](https://github.com/aws/aws-cdk/commit/08a2852))
* **stepfunctions:** improve Task payload encoding ([#2706](https://github.com/aws/aws-cdk/issues/2706)) ([1c13faa](https://github.com/aws/aws-cdk/commit/1c13faa))


### Code Refactoring

* Construct props must not use the 'any' type (awslint:props-no-any) ([#2701](https://github.com/aws/aws-cdk/issues/2701)) ([cb2b334](https://github.com/aws/aws-cdk/commit/cb2b334)), closes [#2673](https://github.com/aws/aws-cdk/issues/2673)
* remove deprecated modules ([#2693](https://github.com/aws/aws-cdk/issues/2693)) ([421bf6d](https://github.com/aws/aws-cdk/commit/421bf6d))
* **core:** improvements to Construct API ([#2767](https://github.com/aws/aws-cdk/issues/2767)) ([3f7a0ad](https://github.com/aws/aws-cdk/commit/3f7a0ad)), closes [#1934](https://github.com/aws/aws-cdk/issues/1934) [#2766](https://github.com/aws/aws-cdk/issues/2766)
* **core:** misc cleanups to App-related APIs ([#2731](https://github.com/aws/aws-cdk/issues/2731)) ([b2e1964](https://github.com/aws/aws-cdk/commit/b2e1964)), closes [#1891](https://github.com/aws/aws-cdk/issues/1891) [#2750](https://github.com/aws/aws-cdk/issues/2750)
* **kms:** Rename EncryptionKeyAlias to Alias ([#2769](https://github.com/aws/aws-cdk/issues/2769)) ([da8e1d5](https://github.com/aws/aws-cdk/commit/da8e1d5))


### Features

* **core:** node.defaultChild as a shortcut to escape hatch ([#2684](https://github.com/aws/aws-cdk/issues/2684)) ([8cd3c23](https://github.com/aws/aws-cdk/commit/8cd3c23)), closes [#2290](https://github.com/aws/aws-cdk/issues/2290)
* **core+cli:** support tagging of stacks ([#2185](https://github.com/aws/aws-cdk/issues/2185)) ([d0e19d5](https://github.com/aws/aws-cdk/commit/d0e19d5)), closes [#932](https://github.com/aws/aws-cdk/issues/932)
* **event-targets:** add support for fargate/awsvpc tasks ([#2707](https://github.com/aws/aws-cdk/issues/2707)) ([2754dde](https://github.com/aws/aws-cdk/commit/2754dde))
* **events:** support SQS queues as rule targets ([#2683](https://github.com/aws/aws-cdk/issues/2683)) ([078e34a](https://github.com/aws/aws-cdk/commit/078e34a)), closes [#1786](https://github.com/aws/aws-cdk/issues/1786)
* **rds:** add engineVersion to DatabaseCluster ([#2698](https://github.com/aws/aws-cdk/issues/2698)) ([0593d51](https://github.com/aws/aws-cdk/commit/0593d51)), closes [#2212](https://github.com/aws/aws-cdk/issues/2212)
* **rds:** add support for database instances ([#2187](https://github.com/aws/aws-cdk/issues/2187)) ([b864041](https://github.com/aws/aws-cdk/commit/b864041)), closes [#2075](https://github.com/aws/aws-cdk/issues/2075) [#1693](https://github.com/aws/aws-cdk/issues/1693)
* **route53:** improve constructs for basic records ([#2741](https://github.com/aws/aws-cdk/issues/2741)) ([696f53f](https://github.com/aws/aws-cdk/commit/696f53f))
* **s3:** default to KMS if encryptionKey is specified ([#2719](https://github.com/aws/aws-cdk/issues/2719)) ([ae4a04f](https://github.com/aws/aws-cdk/commit/ae4a04f)), closes [#2714](https://github.com/aws/aws-cdk/issues/2714)
* **tokens:** enable type coercion ([#2680](https://github.com/aws/aws-cdk/issues/2680)) ([0f54698](https://github.com/aws/aws-cdk/commit/0f54698)), closes [#2679](https://github.com/aws/aws-cdk/issues/2679)


### BREAKING CHANGES

* **route53:** `recordValue: string` prop in `route53.TxtRecord` changed to `values: string[]`
* `recordValue` prop in `route53.CnameRecord` renamed to `domainName`
* `route53.AliasRecord` has been removed, use `route53.ARecord` or `route53.AaaaRecord` with the `target` prop.
* **kms:** The `EncryptionKeyAlias` class was renamed to `Alias`.
Associated types (such as `EncryptionKeyAliasProps`) were renamed in the
same way.
* **cli:** This release requires CDK CLI >= 0.34.0
* **core:** `App.run()` was renamed to `App.synth()` (soft deprecation, it will be removed in the next release).
* **core:** `node.stack` is now `Stack.of(construct)` (fixes #2766)
* **core:** `node.resolve` has been moved to `stack.resolve`.
* **core:** `node.stringifyJson` has been moved to `stack.stringifyJson`.
* **core:** `node.validateTree` is now `ConstructNode.validate(node)`
* **core:** `node.prepareTree` is now `ConstructNode.prepare(node)`
* **core:** `node.getContext` is now `node.tryGetContext`
* **core:** `node.recordReference` is now `node.addReference`
* **core:** `node.apply` is now `node.applyAspect`
* **core:** `node.ancestors()` is now `node.scopes`
* **core:** `node.required` has been removed.
* **core:** `node.typename` has been removed.
* **core:** `node.addChild` is now private
* **core:** `node.findReferences()` is now `node.references`
* **core:** `node.findDependencies()` is now `node.dependencies`
* **core:** `stack.dependencies()` is now `stack.dependencies`
* **core:** `CfnElement.stackPath` has been removed.
* **core:** `CloudFormationLang` is now internal (use `stack.toJsonString()`)
* **cloudwatch:** using an SNS topic as CloudWatch Alarm Actxion now
requires an integration object from the `@aws-cdk/aws-cloudwatch-actions`
package.
* **event-targets:** `targets.EcsEc2Task` renamed to `targets.EcsTask`
* SNS - Subscription `endpoint` is now type `string` (previously `any`)
* Step Functions - `result` in the Pass state is now type `map` (previously `any`)
* the following modules are no longer released: `@aws-cdk/applet-js`, `@aws-cdk/aws-autoscaling-api`, `@aws-cdk/aws-codedeploy-api`
* **cli:** applets are no longer supported as an app type, use "decdk" instead.
* **core:** Properties passed to `addPropertyOverride` should match in capitalization to the CloudFormation schema (normally pascal case). For example, `addPropertyOverride('accessControl', 'xxx')` should now be `addPropertyOverride('AccessControl', 'xxx')`.
* **rds**: `rds.RotationSingleUser` renamed to `rds.SecretRotation`
* **rds**: `rds.ClusterParameterGroup` no longer has `setParameter()` and `removeParameter()` methods, use the parameters prop directly in the constructor instead.



## [0.33.0](https://github.com/aws/aws-cdk/compare/v0.32.0...v0.33.0) (2019-05-30)

**IMPORTANT**: apps created with the CDK version 0.33.0 and above cannot be used with an older CLI version.

### Bug Fixes

* **core:** Fn.cidr should return a list and not a string ([#2678](https://github.com/aws/aws-cdk/issues/2678)) ([9d2ea2a](https://github.com/aws/aws-cdk/commit/9d2ea2a)), closes [#2671](https://github.com/aws/aws-cdk/issues/2671)
* **cli:** fix ts-node usage on Windows ([#2660](https://github.com/aws/aws-cdk/issues/2660)) ([5fe0af5](https://github.com/aws/aws-cdk/commit/5fe0af5))
* **cli:** make `cdk docs` open the new API reference ([#2633](https://github.com/aws/aws-cdk/issues/2633)) ([6450758](https://github.com/aws/aws-cdk/commit/6450758))
* **cli:** correctly pass build args to docker build ([#2634](https://github.com/aws/aws-cdk/issues/2634)) ([9c58d6f](https://github.com/aws/aws-cdk/commit/9c58d6f))
* **core:** hide `dependencyRoots` from public API ([#2668](https://github.com/aws/aws-cdk/issues/2668)) ([2ba5ad2](https://github.com/aws/aws-cdk/commit/2ba5ad2)), closes [#2348](https://github.com/aws/aws-cdk/issues/2348)
* **autoscaling:** move lifecycle hook targets to their own module ([#2628](https://github.com/aws/aws-cdk/issues/2628)) ([b282132](https://github.com/aws/aws-cdk/commit/b282132)), closes [#2447](https://github.com/aws/aws-cdk/issues/2447)
* **codepipeline:** no longer allow providing an index when adding a Stage to a Pipeline. ([#2624](https://github.com/aws/aws-cdk/issues/2624)) ([ce39b12](https://github.com/aws/aws-cdk/commit/ce39b12))
* **codepipeline-actions:** correctly serialize the userParameters passed to the Lambda invoke Action. ([#2537](https://github.com/aws/aws-cdk/issues/2537)) ([ceaf54a](https://github.com/aws/aws-cdk/commit/ceaf54a))
* **cx-api:** improve compatibility messages for cli <=> app ([#2676](https://github.com/aws/aws-cdk/issues/2676)) ([38a9894](https://github.com/aws/aws-cdk/commit/38a9894))
* **ecs:** move high level ECS constructs into aws-ecs-patterns ([#2623](https://github.com/aws/aws-cdk/issues/2623)) ([f901313](https://github.com/aws/aws-cdk/commit/f901313))
* **logs:** move log destinations into 'aws-logs-destinations' ([#2655](https://github.com/aws/aws-cdk/issues/2655)) ([01601c2](https://github.com/aws/aws-cdk/commit/01601c2)), closes [#2444](https://github.com/aws/aws-cdk/issues/2444)
* **s3:** move notification destinations into their own module ([#2659](https://github.com/aws/aws-cdk/issues/2659)) ([185951c](https://github.com/aws/aws-cdk/commit/185951c)), closes [#2445](https://github.com/aws/aws-cdk/issues/2445)

### Features

* **cli:** decouple "synth" and "deploy" through cloud assemblies ([#2636](https://github.com/aws/aws-cdk/issues/2636)) ([c52bcfc](https://github.com/aws/aws-cdk/commit/c52bcfc)), closes [#1893](https://github.com/aws/aws-cdk/issues/1893) [#2093](https://github.com/aws/aws-cdk/issues/2093) [#1954](https://github.com/aws/aws-cdk/issues/1954) [#2310](https://github.com/aws/aws-cdk/issues/2310) [#2073](https://github.com/aws/aws-cdk/issues/2073) [#1245](https://github.com/aws/aws-cdk/issues/1245) [#341](https://github.com/aws/aws-cdk/issues/341) [#956](https://github.com/aws/aws-cdk/issues/956) [#233](https://github.com/aws/aws-cdk/issues/233) [#2016](https://github.com/aws/aws-cdk/issues/2016)
* **acm:** allow specifying region for validated certificates ([#2626](https://github.com/aws/aws-cdk/issues/2626)) ([1a7d4db](https://github.com/aws/aws-cdk/commit/1a7d4db))
* **apigateway:** support for UsagePlan, ApiKey, UsagePlanKey ([#2564](https://github.com/aws/aws-cdk/issues/2564)) ([203f114](https://github.com/aws/aws-cdk/commit/203f114)), closes [#723](https://github.com/aws/aws-cdk/issues/723)
* **autoscaling:** allow setting spotPrice ([#2571](https://github.com/aws/aws-cdk/issues/2571)) ([d640055](https://github.com/aws/aws-cdk/commit/d640055)), closes [#2208](https://github.com/aws/aws-cdk/issues/2208)
* **cfn:** update CloudFormation spec to v3.3.0 ([#2669](https://github.com/aws/aws-cdk/issues/2669)) ([0f553ee](https://github.com/aws/aws-cdk/commit/0f553ee))
* **cli:** disable `noUnusedLocals` and `noUnusedParameters` from typescript templates ([#2654](https://github.com/aws/aws-cdk/issues/2654)) ([b061826](https://github.com/aws/aws-cdk/commit/b061826))
* **cloudformation:** aws-api custom resource ([#1850](https://github.com/aws/aws-cdk/issues/1850)) ([9a48b66](https://github.com/aws/aws-cdk/commit/9a48b66))
* **cloudwatch:** support all Y-Axis properties ([#2406](https://github.com/aws/aws-cdk/issues/2406)) ([8904c3e](https://github.com/aws/aws-cdk/commit/8904c3e)), closes [#2385](https://github.com/aws/aws-cdk/issues/2385)


### BREAKING CHANGES

* **logs:** using a Lambda or Kinesis Stream as CloudWatch log subscription destination now requires an integration object from the `@aws-cdk/aws-logs-destinations` package.
* **codepipeline-actions:** removed the `addPutJobResultPolicy` property when creating LambdaInvokeAction.
* **cli:** `--interactive` has been removed
* **cli:** `--numbered` has been removed
* **cli:** `--staging` is now a boolean flag that indicates whether assets should be copied to the `--output` directory or directly referenced (`--no-staging` is useful for e.g. local debugging with SAM CLI)
* **assets:** Assets (e.g. Lambda code assets) are now referenced relative to the output directory.
* **assert:** `SynthUtils.templateForStackName` has been removed (use `SynthUtils.synthesize(stack).template`).
* **cx-api:** `cxapi.SynthesizedStack` renamed to `cxapi.CloudFormationStackArtifact` with multiple API changes.
* **core:** `cdk.App.run()` now returns a `cxapi.CloudAssembly` instead of `cdk.ISynthesisSession`.
* **s3:** using a Topic, Queue or Lambda as bucket notification destination now requires an integration object from the `@aws-cdk/aws-s3-notifications` package.
* **autoscaling:** using a Topic, Queue or Lambda as Lifecycle Hook Target now requires an integration object from the `@aws-cdk/aws-autoscaling-hooktargets` package.
* **codepipeline:** the property atIndex has been removed from the StagePlacement interface.
* **aws-ecs:** These changes move all L3 and higher constructs out of the aws-ecs module into the aws-ecs-patterns module. The following constructs have been moved into the aws-ecs-patterns module: `EcsQueueWorkerService`, `FargateQueueWorkerService`, `LoadBalancedEcsService`, `LoadBalancedFargateService` and `LoadBalancedFargateServiceApplets`.
* **cloudwatch:** rename `leftAxisRange` => `leftYAxis`, `rightAxisRange` => `rightYAxis`, rename `YAxisRange` => `YAxisProps`.


## [0.32.0](https://github.com/aws/aws-cdk/compare/v0.31.0...v0.32.0) (2019-05-24)

### Bug Fixes

* update all 'onXxx' methods to be CloudWatch Events ([#2609](https://github.com/aws/aws-cdk/issues/2609)) ([28942d2](https://github.com/aws/aws-cdk/commit/28942d2)), closes [#2278](https://github.com/aws/aws-cdk/issues/2278)
* **appscaling:** fix StepScaling ([#2522](https://github.com/aws/aws-cdk/issues/2522)) ([1f004f6](https://github.com/aws/aws-cdk/commit/1f004f6))
* **aws-ecs:** allow linux parameters to be settable ([#2397](https://github.com/aws/aws-cdk/issues/2397)) ([417e5e8](https://github.com/aws/aws-cdk/commit/417e5e8)), closes [#2380](https://github.com/aws/aws-cdk/issues/2380)
* **aws-glue:** fix glue tableArn and integer schema name ([#2585](https://github.com/aws/aws-cdk/issues/2585)) ([99e173e](https://github.com/aws/aws-cdk/commit/99e173e))
* **cdk:** CfnMapping.findInMap with tokens ([#2531](https://github.com/aws/aws-cdk/issues/2531)) ([756e2b6](https://github.com/aws/aws-cdk/commit/756e2b6)), closes [#1363](https://github.com/aws/aws-cdk/issues/1363)
* **cloudfront:** Use regional endpoint for S3 bucket origins ([64c3c6b](https://github.com/aws/aws-cdk/commit/64c3c6b))
* **codebuild:** correctly pass the VPC subnet IDs to the Policy Statement's condition when using a VPC. ([#2506](https://github.com/aws/aws-cdk/issues/2506)) ([145da28](https://github.com/aws/aws-cdk/commit/145da28)), closes [#2335](https://github.com/aws/aws-cdk/issues/2335)
* **codecommit:** add a Repository.fromRepositoryName() method. ([#2515](https://github.com/aws/aws-cdk/issues/2515)) ([6fc3718](https://github.com/aws/aws-cdk/commit/6fc3718)), closes [#2514](https://github.com/aws/aws-cdk/issues/2514)
* **codedeploy:** change the load balancer API in server Deployment Group. ([#2548](https://github.com/aws/aws-cdk/issues/2548)) ([8e05d49](https://github.com/aws/aws-cdk/commit/8e05d49)), closes [#2449](https://github.com/aws/aws-cdk/issues/2449)
* **codepipeline:** correctly validate Artifacts used by Actions in the same Stage. ([#2558](https://github.com/aws/aws-cdk/issues/2558)) ([cfe46f6](https://github.com/aws/aws-cdk/commit/cfe46f6)), closes [#2549](https://github.com/aws/aws-cdk/issues/2549)
* **core:** Correctly search for loaded modules in node 12 ([#2612](https://github.com/aws/aws-cdk/issues/2612)) ([286866a](https://github.com/aws/aws-cdk/commit/286866a)), closes [nodejs/node#27583](https://github.com/nodejs/node/issues/27583)
* **ec2:** allow disabling privateDnsEnabled on VPCs ([#2596](https://github.com/aws/aws-cdk/issues/2596)) ([4d2fbe9](https://github.com/aws/aws-cdk/commit/4d2fbe9)), closes [#2556](https://github.com/aws/aws-cdk/issues/2556)
* **ec2:** fix VPC endpoint name for SageMaker Notebooks ([#2598](https://github.com/aws/aws-cdk/issues/2598)) ([aec8ec2](https://github.com/aws/aws-cdk/commit/aec8ec2))
* **iam:** allow CompositePrincipal construction with spread ([#2507](https://github.com/aws/aws-cdk/issues/2507)) ([eb13741](https://github.com/aws/aws-cdk/commit/eb13741))
* **lambda:** compare Runtimes by value instead of identity ([#2543](https://github.com/aws/aws-cdk/issues/2543)) ([584579e](https://github.com/aws/aws-cdk/commit/584579e))
* **lambda:** deprecate old Lambda runtimes ([#2594](https://github.com/aws/aws-cdk/issues/2594)) ([20f4ec1](https://github.com/aws/aws-cdk/commit/20f4ec1))
* **route53-targets:** move Alias Targets into their own package  ([#2617](https://github.com/aws/aws-cdk/issues/2617)) ([f40fe98](https://github.com/aws/aws-cdk/commit/f40fe98)), closes [#2448](https://github.com/aws/aws-cdk/issues/2448)
* **s3:** Make IBucket.arnForObject accept only (exactly) one key pattern ([5ac6e77](https://github.com/aws/aws-cdk/commit/5ac6e77))


### Code Refactoring

* remove "export"s and normalize resource names ([#2580](https://github.com/aws/aws-cdk/issues/2580)) ([68efa04](https://github.com/aws/aws-cdk/commit/68efa04)), closes [#2577](https://github.com/aws/aws-cdk/issues/2577) [#2578](https://github.com/aws/aws-cdk/issues/2578) [#2458](https://github.com/aws/aws-cdk/issues/2458) [#2419](https://github.com/aws/aws-cdk/issues/2419) [#2579](https://github.com/aws/aws-cdk/issues/2579) [#2313](https://github.com/aws/aws-cdk/issues/2313) [#2551](https://github.com/aws/aws-cdk/issues/2551)
* use construct interfaces in public api (awslint:ref-via-interface) ([#2499](https://github.com/aws/aws-cdk/issues/2499)) ([f9c6ad6](https://github.com/aws/aws-cdk/commit/f9c6ad6)), closes [#2412](https://github.com/aws/aws-cdk/issues/2412)


### Features

* **assets:** Add deploy-time content hash ([#2334](https://github.com/aws/aws-cdk/issues/2334)) ([9b4db42](https://github.com/aws/aws-cdk/commit/9b4db42)), closes [#1400](https://github.com/aws/aws-cdk/issues/1400)
* **aws-cdk:** use ts-node for TypeScript templates ([#2527](https://github.com/aws/aws-cdk/issues/2527)) ([4f7b48d](https://github.com/aws/aws-cdk/commit/4f7b48d)), closes [#1532](https://github.com/aws/aws-cdk/issues/1532)
* **aws-codepipeline:** Pipeline now accepts existing IAM role ([#2587](https://github.com/aws/aws-cdk/issues/2587)) ([eb35807](https://github.com/aws/aws-cdk/commit/eb35807)), closes [#2572](https://github.com/aws/aws-cdk/issues/2572)
* **aws-ecs:** add ECS/Fargate QueueWorkerService constructs ([#2568](https://github.com/aws/aws-cdk/issues/2568)) ([7dd0e1a](https://github.com/aws/aws-cdk/commit/7dd0e1a))
* **aws-ecs:** include GPU & ARM based ECS optimized AMI options ([#2453](https://github.com/aws/aws-cdk/issues/2453)) ([45abfcd](https://github.com/aws/aws-cdk/commit/45abfcd))
* **aws-ecs-patterns:** add ScheduledEc2Task L3 construct ([#2336](https://github.com/aws/aws-cdk/issues/2336)) ([b9cbb6a](https://github.com/aws/aws-cdk/commit/b9cbb6a))
* **cdk:** support encoding Tokens as numbers ([#2534](https://github.com/aws/aws-cdk/issues/2534)) ([b9eeaa0](https://github.com/aws/aws-cdk/commit/b9eeaa0)), closes [#1455](https://github.com/aws/aws-cdk/issues/1455)
* **cli:** Add javascript for init-templates/app ([#2525](https://github.com/aws/aws-cdk/issues/2525)) ([2c5676a](https://github.com/aws/aws-cdk/commit/2c5676a)), closes [#398](https://github.com/aws/aws-cdk/issues/398)
* **cli:** add javascript init-templates 'sample-app' ([#2535](https://github.com/aws/aws-cdk/issues/2535)) ([67960f8](https://github.com/aws/aws-cdk/commit/67960f8))
* **codebuild:** add support for local cache modes ([#2529](https://github.com/aws/aws-cdk/issues/2529)) ([e7ad990](https://github.com/aws/aws-cdk/commit/e7ad990)), closes [#1956](https://github.com/aws/aws-cdk/issues/1956)
* **codebuild:** rename standard 1.0 image and add standard 2.0 image ([#2541](https://github.com/aws/aws-cdk/issues/2541)) ([e4e24ab](https://github.com/aws/aws-cdk/commit/e4e24ab)), closes [#2306](https://github.com/aws/aws-cdk/issues/2306)
* **config:** AWS Config, Managed and Custom rules ([#2326](https://github.com/aws/aws-cdk/issues/2326)) ([deed353](https://github.com/aws/aws-cdk/commit/deed353))
* **ecs:** allow to specify log retention for aws log driver ([#2511](https://github.com/aws/aws-cdk/issues/2511)) ([1feda0c](https://github.com/aws/aws-cdk/commit/1feda0c))
* **events:** group CW Event Targets in module ([#2576](https://github.com/aws/aws-cdk/issues/2576)) ([7cb8e5e](https://github.com/aws/aws-cdk/commit/7cb8e5e)), closes [#2403](https://github.com/aws/aws-cdk/issues/2403) [#2404](https://github.com/aws/aws-cdk/issues/2404) [#2581](https://github.com/aws/aws-cdk/issues/2581)
* **lambda:** add NodeJS10x runtime ([#2544](https://github.com/aws/aws-cdk/issues/2544)) ([553577a](https://github.com/aws/aws-cdk/commit/553577a))
* **s3:** add MetricsConfiguration Property to S3 Bucket ([#2163](https://github.com/aws/aws-cdk/issues/2163)) ([1cc43b3](https://github.com/aws/aws-cdk/commit/1cc43b3))
* **stepfunctions:** add service integrations ([#1646](https://github.com/aws/aws-cdk/issues/1646)) ([e4ac767](https://github.com/aws/aws-cdk/commit/e4ac767))
* **stepfunctions:** ExecutionTime metric ([#2498](https://github.com/aws/aws-cdk/issues/2498)) ([84fda45](https://github.com/aws/aws-cdk/commit/84fda45))
* **toolkit:** allow to pass build args to docker build ([#2604](https://github.com/aws/aws-cdk/issues/2604)) ([c51596e](https://github.com/aws/aws-cdk/commit/c51596e))
* **toolkit:** show when new version is available ([#2484](https://github.com/aws/aws-cdk/issues/2484)) ([6cf4bd3](https://github.com/aws/aws-cdk/commit/6cf4bd3)), closes [#297](https://github.com/aws/aws-cdk/issues/297)


### BREAKING CHANGES

* **route53-targets:** using a CloudFront Distribution or an ELBv2
Load Balancer as an Alias Record Target now requires an integration
object from the `@aws-cdk/aws-route53-targets` package.
* **s3:** The `IBucket.arnForObject` method no longer
concatenates path fragments on your behalf. Pass the `/`-concatenated
key pattern instead.
* All `export` methods from all AWS resources have been removed. CloudFormation Exports are now automatically created when attributes are referenced across stacks within the same app. To export resources manually, you can explicitly define a `CfnOutput`.
* **kms:** `kms.EncryptionKey` renamed to `kms.Key`
* **ec2:** `ec2.VpcNetwork` renamed to `ec2.Vpc`
* **ec2:** `ec2.VpcSubnet` renamed to `ec2.Subnet`
* **cloudtrail:** `cloudtrail.CloudTrail` renamed `to `cloudtrail.Trail`
* Deleted a few `XxxAttribute` and `XxxImportProps` interfaces which were no longer in used after their corresponding `export` method was deleted and there was no use for them in imports.
* **ecs:** `ecs.ClusterAttributes` now accepts `IVpc` and `ISecurityGroup` instead of attributes. You can use their
corresponding `fromXxx` methods to import them as needed.
* **servicediscovery:** `servicediscovery.CnameInstance.instanceCname` renamed to `cname`.
* **glue:** `glue.IDatabase.locationUrl` is now only in `glue.Database` (not on the interface)
* **ec2:** `ec2.TcpPortFromAttribute` and `UdpPortFromAttribute` removed. Use `TcpPort` and `UdpPort` with `new Token(x).toNumber` instead.
* **ec2:** `ec2.VpcNetwork.importFromContext` renamed to `ec2.Vpc.fromLookup`
* **iam:** `iam.IRole.roleId` has been removed from the interface, but `Role.roleId` is still available for owned resources.
* **codedeploy:** the type of the `loadBalancer` property in ServerDeploymentGroupProps has been changed.
* **apigateway:** `apigateway.ResourceBase.trackChild` is now internal.
* **cloudfront:** `cloudfront.S3OriginConfig.originAccessIdentity` is now `originAccessIdentityId`
* **codedeploy:** `codedeploy.LambdaDeploymentGroup.alarms` is now `cloudwatch.IAlarm[]` (previously `cloudwatch.Alarm[]`)
* **codepipeline:** `codepipeline.crossRegionScaffoldingStacks` renamed to `crossRegionScaffolding`
* **codepipeline:** `codepipeline.CrossRegionScaffoldingStack` renamed to `codepipeline.CrossRegionScaffolding` and cannot be instantiated (abstract)
* **ec2:** `ec2.VpcSubnet.addDefaultRouteToNAT` renamed to `addDefaultNatRoute` and made public
* **ec2:** `ec2.VpcSubnet.addDefaultRouteToIGW` renamed to `addDefaultInternetRoute`, made public and first argument is the gateway ID (string) and not the CFN L1 class
* **ecs:** `ecs.Ec2EventRuleTarget.taskDefinition` is now `ITaskDefinition` (previously `TaskDefinition`)
* **lambda:** `lambda.IEventSource.bind` now accepts `IFunction` instead of `FunctionBase`. Use `IFunction.addEventSourceMapping` to add an event source mapping under the function.
* **lambda:** `lambda.Layer.grantUsage` renamed to `lambda.layer.addPermission` and returns void
* **stepfunctions:** `stepfunctions.StateMachine.role` is now `iam.IRole` (previously `iam.Role`)
* **cloudwatch-events:** the events API has been significantly re-worked
  - **⚠️ This new API is still being discussed (see [#2609](https://github.com/aws/aws-cdk/pull/2609)) and might change again in the next release!**
  - All `onXxx()` CloudWatch Event methods now have the signature:
    ```ts
    resource.onEvent('SomeId', {
        target: new SomeTarget(...),
        // options
    });
    ```
  - CloudWatch:
    + `onAlarm` was renamed to `addAlarmAction`
    + `onOk` was renamed to `addOkAction`
    + `onInsufficientData` was renamed to `addInsufficientDataAction`
  - AutoScaling:
    + `onLifecycleTransition` was renamed to `addLifecycleHook`
  - LambdaDeploymentGroup
    + `onPreHook` was renamed to `addPreHook`
    + `onPostHook` was renamed to `addPostHook`
  - UserPool:
    + all `onXxx` were renamed to `addXxxTrigger`
  - Repository:
    + `onImagePushed` was renamed to `onCloudTrailImagePushed`
  - Bucket:
    + `onEvent` was renamed to `addEventNotification`
    + `onObjectCreated` was renamed to `addObjectCreatedNotification`
    + `onObjectRemoved` was renamed to `addObjectRemovedNotification`
    + `onPutObject` was renamed to `onCloudTrailPutObject`


## [0.31.0](https://github.com/aws/aws-cdk/compare/v0.30.0...v0.31.0) (2019-05-06)


### Bug Fixes

* **aws-ecs:** expose readonly service on LoadBalancedEc2Service ([#2395](https://github.com/aws/aws-cdk/issues/2395)) ([52af870](https://github.com/aws/aws-cdk/commit/52af870)), closes [#2378](https://github.com/aws/aws-cdk/issues/2378)
* **ecs:** correct logic of healthcheck command ([#2462](https://github.com/aws/aws-cdk/issues/2462)) ([fa29d3b](https://github.com/aws/aws-cdk/commit/fa29d3b)), closes [#2461](https://github.com/aws/aws-cdk/issues/2461)
* **ecs:** fix memoryReservationLimit in LoadBalancedEcsService ([#2463](https://github.com/aws/aws-cdk/issues/2463)) ([6b50927](https://github.com/aws/aws-cdk/commit/6b50927)), closes [#2263](https://github.com/aws/aws-cdk/issues/2263)
* **lambda:** allow grantInvoke with principals ([#2391](https://github.com/aws/aws-cdk/issues/2391)) ([b3792aa](https://github.com/aws/aws-cdk/commit/b3792aa))
* update jsii to 0.10.5 ([#2482](https://github.com/aws/aws-cdk/issues/2482)) ([e4ec30a](https://github.com/aws/aws-cdk/commit/e4ec30a))
* update jsii to v10.0.4 ([#2479](https://github.com/aws/aws-cdk/issues/2479)) ([1df4e2d](https://github.com/aws/aws-cdk/commit/1df4e2d)), closes [#2478](https://github.com/aws/aws-cdk/issues/2478)


### Code Refactoring

* convert "import" to "from" methods ([#2456](https://github.com/aws/aws-cdk/issues/2456)) ([862ed7b](https://github.com/aws/aws-cdk/commit/862ed7b)), closes [#2450](https://github.com/aws/aws-cdk/issues/2450) [#2428](https://github.com/aws/aws-cdk/issues/2428) [#2424](https://github.com/aws/aws-cdk/issues/2424) [#2429](https://github.com/aws/aws-cdk/issues/2429) [#2425](https://github.com/aws/aws-cdk/issues/2425) [#2422](https://github.com/aws/aws-cdk/issues/2422) [#2423](https://github.com/aws/aws-cdk/issues/2423) [#89](https://github.com/aws/aws-cdk/issues/89)


### Features

* **bootstrap:** allow specifying the toolkit staging bucket name ([#2407](https://github.com/aws/aws-cdk/issues/2407)) ([3bfc641](https://github.com/aws/aws-cdk/commit/3bfc641)), closes [#2390](https://github.com/aws/aws-cdk/issues/2390)
* **codebuild:** add webhook Filter Groups. ([#2319](https://github.com/aws/aws-cdk/issues/2319)) ([fd74d07](https://github.com/aws/aws-cdk/commit/fd74d07)), closes [#1842](https://github.com/aws/aws-cdk/issues/1842)
* **elbv2:** add fixed response support for application load balancers ([#2328](https://github.com/aws/aws-cdk/issues/2328)) ([750bc8b](https://github.com/aws/aws-cdk/commit/750bc8b))


### BREAKING CHANGES

* all `Foo.import` static methods are now `Foo.fromFooAttributes`
* all `FooImportProps` structs are now called `FooAttributes`
* `stepfunctions.StateMachine.export` has been removed.
* `ses.ReceiptRule.name` is now `ses.ReceiptRule.receiptRuleName`
* `ses.ReceiptRuleSet.name` is now `ses.ReceiptRuleSet.receiptRuleSetName`
* `secretsmanager.AttachedSecret` is now called `secretsmanager.SecretTargetAttachment` to match service semantics
* `ecr.Repository.export` has been removed
* `s3.Bucket.bucketUrl` is now called `s3.Bucket.bucketWebsiteUrl`
* `lambda.Version.functionVersion` is now called `lambda.Version.version`
* `ec2.SecurityGroup.groupName` is now `ec2.SecurityGroup.securityGroupName`
* `cognito.UserPoolClient.clientId` is now `cognito.UserPoolClient.userPoolClientId`
* `apigateway.IRestApiResource` is now `apigateway.IResource`
* `apigateway.IResource.resourcePath` is now `apigateway.IResource.path`
* `apigateway.IResource.resourceApi` is now `apigateway.IResource.restApi`


## [0.30.0](https://github.com/aws/aws-cdk/compare/v0.29.0...v0.30.0) (2019-05-02)

### Bug Fixes

* **cdk-dasm:** fix bin for cdk-dasm ([#2383](https://github.com/aws/aws-cdk/issues/2383)) ([760f518](https://github.com/aws/aws-cdk/commit/760f518))

### Code Refactoring

* **awslint:** construct-base-is-private, resource-attribute ([#2349](https://github.com/aws/aws-cdk/issues/2349)) ([973b506](https://github.com/aws/aws-cdk/commit/973b506)), closes [#2426](https://github.com/aws/aws-cdk/issues/2426) [#2409](https://github.com/aws/aws-cdk/issues/2409)

### Features

* **cdk-test:** check API compatibility ([#2356](https://github.com/aws/aws-cdk/issues/2356)) ([1642925](https://github.com/aws/aws-cdk/commit/1642925)), closes [#145](https://github.com/aws/aws-cdk/issues/145)
* **codepipeline:** allow creation of GitHub Pipelines without source trigger ([#2332](https://github.com/aws/aws-cdk/issues/2332)) ([ed39a8c](https://github.com/aws/aws-cdk/commit/ed39a8c))
* **elbv2:** add TLS listener for NLB ([#2122](https://github.com/aws/aws-cdk/issues/2122)) ([71d694f](https://github.com/aws/aws-cdk/commit/71d694f))



### BREAKING CHANGES

* `s3.Bucket.domainName` renamed to `s3.Bucket.bucketDomainName`.
* `codedeploy.IXxxDeploymentConfig.deploymentConfigArn` is now a property and not a method.
* `ec2.SecurityGroupBase` is now private
* `ec2.VpcNetworkBase` is now private
* `kinesis.StreamBase` is now private
* `kms.EncryptionKeyBase` is now private
* `logs.LogGroupBase` is now private
* `ssm.ParameterBase` is now private
* `eks.ClusterBase` is now private
* `codebuild.ProjectBase` is now private
* `codecommit.RepositoryBase` is now private
* `codedeploy.ServerDeploymentGroupBase` is now private
* `eks.ClusterBase` is now private
* `lambda.LayerVersionBase` is now private
* `rds.DatabaseClusterBase` is now private
* `secretsmanager.SecretBase` is now private
* `ses.ReceiptRuleSetBase` is now private
* **codepipeline:** the `pollForSourceChanges` property in `GitHubSourceAction` has been renamed to `trigger`, and its type changed from a `boolean` to an enum.


## [0.29.0](https://github.com/aws/aws-cdk/compare/v0.28.0...v0.29.0) (2019-04-24)

### Bug Fixes

* **acm:** enabled validation of certificates on the zone name ([#2133](https://github.com/aws/aws-cdk/issues/2133)) ([f216f96](https://github.com/aws/aws-cdk/commit/f216f96))
* **aws-apigateway:** add integrationHttpMethod prop to AwsIntegration ([#2160](https://github.com/aws/aws-cdk/issues/2160)) ([dfc6665](https://github.com/aws/aws-cdk/commit/dfc6665)), closes [#2105](https://github.com/aws/aws-cdk/issues/2105)
* **aws-cloudwatch:** remove workaround on optional DashboardName  ([6c73d8a](https://github.com/aws/aws-cdk/commit/6c73d8a)), closes [#213](https://github.com/aws/aws-cdk/issues/213)
* **aws-ecs:** fix default daemon deploymentConfig values ([#2210](https://github.com/aws/aws-cdk/issues/2210)) ([c2e806b](https://github.com/aws/aws-cdk/commit/c2e806b)), closes [#2209](https://github.com/aws/aws-cdk/issues/2209)
* **aws-ecs:** handle long ARN formats for services ([#2176](https://github.com/aws/aws-cdk/issues/2176)) ([66df1c8](https://github.com/aws/aws-cdk/commit/66df1c8)), closes [#1849](https://github.com/aws/aws-cdk/issues/1849)
* **aws-lambda:** fix circular dependency with lambda and codedeploy ([#2236](https://github.com/aws/aws-cdk/issues/2236)) ([382da6a](https://github.com/aws/aws-cdk/commit/382da6a))
* **certificatemanager:** remove bundled lambda devdependencies ([#2186](https://github.com/aws/aws-cdk/issues/2186)) ([6728b41](https://github.com/aws/aws-cdk/commit/6728b41))
* **codebuild:** add validation for Source when the badge property is true ([#2242](https://github.com/aws/aws-cdk/issues/2242)) ([07812b2](https://github.com/aws/aws-cdk/commit/07812b2)), closes [#1749](https://github.com/aws/aws-cdk/issues/1749)
* **core:** allow CfnMapping.findInMap to use pseudo functions/params ([#2220](https://github.com/aws/aws-cdk/issues/2220)) ([464cb6f](https://github.com/aws/aws-cdk/commit/464cb6f)), closes [#1363](https://github.com/aws/aws-cdk/issues/1363)
* **core:** Use different symbol for Stack.isStack versus CfnReference.isCfnReference ([#2305](https://github.com/aws/aws-cdk/issues/2305)) ([c1e41ed](https://github.com/aws/aws-cdk/commit/c1e41ed))
* **decdk:** set the timeout in the schema tests to 10 seconds. ([#2250](https://github.com/aws/aws-cdk/issues/2250)) ([8521b6f](https://github.com/aws/aws-cdk/commit/8521b6f))
* **dynamodb:** remove global secondary index limit ([#2301](https://github.com/aws/aws-cdk/issues/2301)) ([43afa3a](https://github.com/aws/aws-cdk/commit/43afa3a)), closes [#2262](https://github.com/aws/aws-cdk/issues/2262)
* **ecr:** Fix typo in ImportRepository error message ([#2217](https://github.com/aws/aws-cdk/issues/2217)) ([b7c9b21](https://github.com/aws/aws-cdk/commit/b7c9b21))
* **elasticloadbalancingv2:** dependency between ALB and logging bucket ([#2221](https://github.com/aws/aws-cdk/issues/2221)) ([99e085d](https://github.com/aws/aws-cdk/commit/99e085d)), closes [#1633](https://github.com/aws/aws-cdk/issues/1633)
* **java-app-template:** invoke `app.run()` ([#2300](https://github.com/aws/aws-cdk/issues/2300)) ([47ff448](https://github.com/aws/aws-cdk/commit/47ff448)), closes [#2289](https://github.com/aws/aws-cdk/issues/2289) [awslabs/jsii#456](https://github.com/aws/jsii/issues/456)
* **lambda:** avoid OperationAbortedException when using log retention ([#2237](https://github.com/aws/aws-cdk/issues/2237)) ([12a118c](https://github.com/aws/aws-cdk/commit/12a118c))
* **s3:** Add validations for S3 bucket names ([#2256](https://github.com/aws/aws-cdk/issues/2256)) ([f810265](https://github.com/aws/aws-cdk/commit/f810265)), closes [#1308](https://github.com/aws/aws-cdk/issues/1308)
* **servicediscovery:** allow to register multiple instances on a service ([#2207](https://github.com/aws/aws-cdk/issues/2207)) ([9f88696](https://github.com/aws/aws-cdk/commit/9f88696))
* **toolkit:** don't fail when terminal width is 0 ([#2355](https://github.com/aws/aws-cdk/issues/2355)) ([9c2220c](https://github.com/aws/aws-cdk/commit/9c2220c)), closes [#2253](https://github.com/aws/aws-cdk/issues/2253)
* **toolkit:** fix broken confirmation prompt ([#2333](https://github.com/aws/aws-cdk/issues/2333)) ([4112c84](https://github.com/aws/aws-cdk/commit/4112c84))
* **toolkit:** options requiring arguments fail if not supplied ([#2197](https://github.com/aws/aws-cdk/issues/2197)) ([0f6ce56](https://github.com/aws/aws-cdk/commit/0f6ce56)), closes [#2192](https://github.com/aws/aws-cdk/issues/2192)
* **toolkit:** remove metadata warning if region does not have resource ([#2216](https://github.com/aws/aws-cdk/issues/2216)) ([22ed67c](https://github.com/aws/aws-cdk/commit/22ed67c))
* **toolkit:** stop 'cdk doctor' from printing AWS_ variables ([#2357](https://github.com/aws/aws-cdk/issues/2357)) ([6209c6b](https://github.com/aws/aws-cdk/commit/6209c6b)), closes [#1931](https://github.com/aws/aws-cdk/issues/1931)
* **codebuild:** remove oauthToken property from source  (#2252) ([8705af3](https://github.com/aws/aws-cdk/commit/8705af3)), closes [#2252](https://github.com/aws/aws-cdk/issues/2252) [#2199](https://github.com/aws/aws-cdk/issues/2199)
* **aws-ec2:** correct InstanceSize.Nano spelling (#2215) ([d22a154](https://github.com/aws/aws-cdk/commit/d22a154)), closes [#2215](https://github.com/aws/aws-cdk/issues/2215) [#2214](https://github.com/aws/aws-cdk/issues/2214)


### Features

* **aws-dynamodb-global:** global dynamodb tables (experimental) ([#2251](https://github.com/aws/aws-cdk/issues/2251)) ([ec367c8](https://github.com/aws/aws-cdk/commit/ec367c8))
* **aws-events-targets:** centralized module for cloudwatch event targets ([#2343](https://github.com/aws/aws-cdk/issues/2343)) ([1069938](https://github.com/aws/aws-cdk/commit/1069938))
* **cdk-dasm:** generate cdk code from cloudformation ([#2244](https://github.com/aws/aws-cdk/issues/2244)) ([b707782](https://github.com/aws/aws-cdk/commit/b707782))
* **cloudwatch:** add support for time ranges in dashboards ([#2248](https://github.com/aws/aws-cdk/issues/2248)) ([18c1723](https://github.com/aws/aws-cdk/commit/18c1723))
* **codebuild:** add support for more images ([#2233](https://github.com/aws/aws-cdk/issues/2233)) ([87b1ea0](https://github.com/aws/aws-cdk/commit/87b1ea0)), closes [#2079](https://github.com/aws/aws-cdk/issues/2079)
* **codepipeline:** add ECS deploy Action. ([#2050](https://github.com/aws/aws-cdk/issues/2050)) ([d46b814](https://github.com/aws/aws-cdk/commit/d46b814)), closes [#1386](https://github.com/aws/aws-cdk/issues/1386)
* **codepipeline:** change to stand-alone Artifacts. ([#2338](https://github.com/aws/aws-cdk/issues/2338)) ([b778e10](https://github.com/aws/aws-cdk/commit/b778e10))
* **codepipeline:** make the default CodePipeline Bucket have an encryption key ([#2241](https://github.com/aws/aws-cdk/issues/2241)) ([ef9bba5](https://github.com/aws/aws-cdk/commit/ef9bba5)), closes [#1924](https://github.com/aws/aws-cdk/issues/1924)
* **core:** verify CfnOutput has a value and fix VPC export ([#2219](https://github.com/aws/aws-cdk/issues/2219)) ([9e87661](https://github.com/aws/aws-cdk/commit/9e87661)), closes [#2012](https://github.com/aws/aws-cdk/issues/2012)
* **events-targets:** LambdaFunction ([#2350](https://github.com/aws/aws-cdk/issues/2350)) ([48d536b](https://github.com/aws/aws-cdk/commit/48d536b)), closes [#1663](https://github.com/aws/aws-cdk/issues/1663)
* **ec2:** add support for vpc endpoints ([#2104](https://github.com/aws/aws-cdk/issues/2104)) ([bbb3f34](https://github.com/aws/aws-cdk/commit/bbb3f34))
* **lambda:** introduce a new kind of `Code`, `CfnParametersCode`. ([#2027](https://github.com/aws/aws-cdk/issues/2027)) ([4247966](https://github.com/aws/aws-cdk/commit/4247966))
* **cfnspec:** update CloudFormation resources to v2.30.0 ([#2239](https://github.com/aws/aws-cdk/issues/2239)) ([aebcde5](https://github.com/aws/aws-cdk/commit/aebcde5))
* **toolkit:** stage assets under .cdk.assets ([#2182](https://github.com/aws/aws-cdk/issues/2182)) ([2f74eb4](https://github.com/aws/aws-cdk/commit/2f74eb4)), closes [#1716](https://github.com/aws/aws-cdk/issues/1716) [#2096](https://github.com/aws/aws-cdk/issues/2096)


### BREAKING CHANGES

* **cloudwatch:** Renamed `MetricCustomization` to `MetricOptions`.
* **codepipeline:** CodePipeline Actions no longer have the `outputArtifact` and `outputArtifacts` properties.
* **codepipeline:** `inputArtifact(s)` and `additionalInputArtifacts` properties were renamed to `input(s)` and `extraInputs`.
* **codepipeline:** `outputArtifactName(s)` and `additionalOutputArtifactNames` properties were renamed to `output(s)` and `extraOutputs`.
* **codepipeline:** The classes `CodeBuildBuildAction` and `CodeBuildTestAction` were merged into one class `CodeBuildAction`.
* **codepipeline:** The classes `JenkinsBuildAction` and `JenkinsTestAction` were merged into one class `JenkinsAction`.
* **events-targets:** `lambda.Function` no longer implements `IEventRuleTarget`. Instead, use `@aws-cdk/aws-events-targets.LambdaFunction`.
* **aws-events-targets:** `sns.Topic` no longer implements `IEventRuleTarget`. Use `@aws-cdk/aws-events-targets.SnsTopic` instead.
* **codebuild:** `codebuild.Project` no longer implements `IEventRuleTarget`. Use `@aws-cdk/aws-events-targets.CodeBuildProject`.
* **core:** the `cdk.Root` construct has been removed. Use `cdk.App` instead.
* **stepfunctions:** In `stepfunctions.WaitProps`: the props `seconds`, `timestamp`, `secondsPath` and `timestampPath` are now `duration` of a union-like class `WaitDuration` (e.g. `duration: WaitDuration.seconds(n)`)
* **codedeploy:** In `codedeploy.ServerDeploymentConfigProps`: the props `minHealthyHostCount` and `minHealthyHostPercentage` are now `minimumHealthyHosts` of union-like class `MinimumHealthyHosts` (e.g. `minimumHealthyHosts: MinimumHealthyHosts.percentage(50)`)
* **cloudformation:** In `cloudformation.CustomResourceProps`: the props `topicProvider` and `lambdaProvider` are now `provider` of union-like class `CustomResourceProvider` (e.g. `CustomResourceProvider.lambda(fn)`
* **cloudformation:** `cloudformation.CustomResource` no longer extends `CfnCustomResource`.
* **ssm:** `ssm.ParameterProps` renamed to `ssm.ParameterOptions`.
* **codepipeline:** customers who use GitHub, GitHubEnterprise or Bitbucket as source will need to remove the oauthToken field as it's no longer available.
* **codebuild:** change the default image from UBUNTU_14_04_BASE to UBUNTU_18_04_STANDARD.
* **ec2:** `aws-ec2.InstanceSize.None` was renamed to `InstanceSize.Nano`
* **ec2:** * `vpc.selectSubnetIds(...)` has been replaced with `vpc.selectSubnets(...).subnetIds`.
* You will not be able to combine jsii libraries written against previous versions of jsii with this version of the CDK.


## [0.28.0](https://github.com/aws/aws-cdk/compare/v0.27.0...v0.28.0) (2019-04-04)


### Bug Fixes

* **aws-ecs:** use executionRole for event rule target ([#2165](https://github.com/aws/aws-cdk/issues/2165)) ([aa6f7bc](https://github.com/aws/aws-cdk/commit/aa6f7bc)), closes [#2015](https://github.com/aws/aws-cdk/issues/2015)
* **core:** remove cdk.Secret ([#2068](https://github.com/aws/aws-cdk/issues/2068)) ([b53d04d](https://github.com/aws/aws-cdk/commit/b53d04d)), closes [#2064](https://github.com/aws/aws-cdk/issues/2064)


*  feat(aws-iam): refactor grants, add OrganizationPrincipal  (#1623) ([1bb8ca9](https://github.com/aws/aws-cdk/commit/1bb8ca9)), closes [#1623](https://github.com/aws/aws-cdk/issues/1623) [#236](https://github.com/aws/aws-cdk/issues/236)


### Code Refactoring

* **cdk:** introduce SecretValue to represent secrets ([#2161](https://github.com/aws/aws-cdk/issues/2161)) ([a3d9f2e](https://github.com/aws/aws-cdk/commit/a3d9f2e))

### Features

* **codepipeline:** move all of the Pipeline Actions to their dedicated package. ([#2098](https://github.com/aws/aws-cdk/issues/2098)) ([b314ecf](https://github.com/aws/aws-cdk/commit/b314ecf))
* **codepipeline:** re-factor the CodePipeline Action `bind` method to take a Role separately from the Pipeline. ([#2085](https://github.com/aws/aws-cdk/issues/2085)) ([ffe0046](https://github.com/aws/aws-cdk/commit/ffe0046))
* **ec2:** support reserving IP space in VPCs ([#2090](https://github.com/aws/aws-cdk/issues/2090)) ([4819ff4](https://github.com/aws/aws-cdk/commit/4819ff4))
* Add python support to cdk init ([#2130](https://github.com/aws/aws-cdk/issues/2130)) ([997dbcc](https://github.com/aws/aws-cdk/commit/997dbcc))
* **ecs:** support AWS Cloud Map (service discovery) ([#2065](https://github.com/aws/aws-cdk/issues/2065)) ([4864cc8](https://github.com/aws/aws-cdk/commit/4864cc8)), closes [#1554](https://github.com/aws/aws-cdk/issues/1554)
* **lambda:** add a `newVersion` method. ([#2099](https://github.com/aws/aws-cdk/issues/2099)) ([6fc179a](https://github.com/aws/aws-cdk/commit/6fc179a))
* update CloudFormation resource spec to v2.29.0 ([#2170](https://github.com/aws/aws-cdk/issues/2170)) ([ebc490d](https://github.com/aws/aws-cdk/commit/ebc490d))


### BREAKING CHANGES

* The `secretsmanager.SecretString` class has been removed in favor of `cdk.SecretValue.secretsManager(id[, options])`
* The following prop types have been changed from `string` to `cdk.SecretValue`: `codepipeline-actions.AlexaSkillDeployAction.clientSecret`, `codepipeline-actions.AlexaSkillDeployAction.refreshToken`, `codepipeline-actions.GitHubSourceAction.oauthToken`, `iam.User.password`
* `secretsmanager.Secret.stringValue` and `jsonFieldValue` have been removed. Use `secretsmanage.Secret.secretValue` and `secretJsonValue` instead.
* `secretsmanager.Secret.secretString` have been removed. Use `cdk.SecretValue.secretsManager()` or `secretsmanager.Secret.import(..).secretValue`.
* The class `cdk.Secret` has been removed. Use `cdk.SecretValue` instead.
* The class `cdk.DynamicReference` is no longer a construct, and it's constructor signature was changed and was renamed `cdk.CfnDynamicReference`.
* `grant(function.role)` and `grant(project.role)` are now `grant(function)` and `grant(role)`.
* **core:** Replace use of `cdk.Secret` with `secretsmanager.SecretString` (preferred) or `ssm.ParameterStoreSecureString`.
* **codepipeline:** this changes the package of all CodePipeline Actions to be aws-codepipeline-actions.
* **codepipeline:** this moves all classes from the aws-codepipeline-api package to the aws-codepipeline package.
* **codepipeline:** this changes the CodePipeline Action naming scheme from <service>.Pipeline<Category>Action (s3.PipelineSourceAction) to codepipeline_actions.<Service><Category>Action (codepipeline_actions.S3SourceAction).



## [0.27.0](https://github.com/aws/aws-cdk/compare/v0.26.0...v0.27.0) (2019-03-28)

### Highlights

* Python support (experimental)
* You can now run the CLI through `npx cdk`
* Make sure to go through the BREAKING CHANGES section below

### Bug Fixes

* **autoscaling:** verify public subnets for associatePublicIpAddress ([#2077](https://github.com/aws/aws-cdk/issues/2077)) ([1e3d41e](https://github.com/aws/aws-cdk/commit/1e3d41e))
* **ec2:** descriptive error message when selecting 0 subnets ([#2025](https://github.com/aws/aws-cdk/issues/2025)) ([0de2206](https://github.com/aws/aws-cdk/commit/0de2206)), closes [#2011](https://github.com/aws/aws-cdk/issues/2011)
* **lambda:** use Alias ARN directly ([#2091](https://github.com/aws/aws-cdk/issues/2091)) ([bc40494](https://github.com/aws/aws-cdk/commit/bc40494))
* **rds:** remove Instance class ([#2081](https://github.com/aws/aws-cdk/issues/2081)) ([6699fed](https://github.com/aws/aws-cdk/commit/6699fed))
* **secretsmanager:** allow templated string creation ([#2010](https://github.com/aws/aws-cdk/issues/2010)) ([4e105a3](https://github.com/aws/aws-cdk/commit/4e105a3))
* **secretsmanager/ssm:** verify presence of parameter name ([#2066](https://github.com/aws/aws-cdk/issues/2066)) ([b93350f](https://github.com/aws/aws-cdk/commit/b93350f))
* **serverless:** rename aws-serverless to aws-sam ([#2074](https://github.com/aws/aws-cdk/issues/2074)) ([4a82f13](https://github.com/aws/aws-cdk/commit/4a82f13))
* **stepfunctions:** make Fail.error optional ([#2042](https://github.com/aws/aws-cdk/issues/2042)) ([86e9d03](https://github.com/aws/aws-cdk/commit/86e9d03))


### Code Refactoring

* readonly struct properties and hide internals ([#2106](https://github.com/aws/aws-cdk/issues/2106)) ([66dd228](https://github.com/aws/aws-cdk/commit/66dd228)), closes [awslabs/cdk-ops#321](https://github.com/awslabs/cdk-ops/issues/321)


### Features

* **toolkit:**: new 'cdk' package to allow executing the cli through `npx cdk` ([#2113](https://github.com/aws/aws-cdk/issues/2113)) ([32bca05](https://github.com/aws/aws-cdk/commit/32bca05))
* Python Support ([#2009](https://github.com/aws/aws-cdk/issues/2009)) ([e6083fa](https://github.com/aws/aws-cdk/commit/e6083fa))
* **core:** present reason for cyclic references ([#2061](https://github.com/aws/aws-cdk/issues/2061)) ([e82e208](https://github.com/aws/aws-cdk/commit/e82e208))
* **lambda:** add support for log retention ([#2067](https://github.com/aws/aws-cdk/issues/2067)) ([63132ec](https://github.com/aws/aws-cdk/commit/63132ec)), closes [#667](https://github.com/aws/aws-cdk/issues/667) [#667](https://github.com/aws/aws-cdk/issues/667)
* **rds:** cluster retention, reference KMS key by object ([#2063](https://github.com/aws/aws-cdk/issues/2063)) ([99ab46d](https://github.com/aws/aws-cdk/commit/99ab46d))
* **secretsmanager/rds:** support credential rotation ([#2052](https://github.com/aws/aws-cdk/issues/2052)) ([bf79c82](https://github.com/aws/aws-cdk/commit/bf79c82))
* **toolkit:** introduce the concept of auto-deployed Stacks. ([#2046](https://github.com/aws/aws-cdk/issues/2046)) ([abacc66](https://github.com/aws/aws-cdk/commit/abacc66))


### BREAKING CHANGES

* **lambda:** `cloudWatchLogsRetentionTimeDays` in `@aws-cdk/aws-cloudtrail`
now uses a `logs.RetentionDays` instead of a `LogRetention`.
* **core:** `stack._toCloudFormation` method is now unavailable and is replaced by `@aws-cdk/assert.SynthUtils.toCloudFormation(stack)`.
* **rds:** replaced `kmsKeyArn: string` by `kmsKey: kms.IEncryptionKey` in `DatabaseClusterProps`
* **autoscaling:** `VpcNetwork.isPublicSubnet()` has been renamed to
`VpcNetwork.isPublicSubnetIds()`.
* **serverless:** renamed `aws-serverless` to `aws-sam`
* **ec2:** `vpcPlacement` has been renamed to `vpcSubnets`
on all objects, `subnetsToUse` has been renamed to `subnetType`.
`natGatewayPlacement` has been renamed to `natGatewaySubnets`.
* All properties of all structs (interfaces that do not begin with an "I") are now readonly since it is passed by-value and not by-ref (Python is the first language to require that). This may impact code in all languages that assumed it is possible to mutate these structs. Let us know if this blocks you in any way.


## [0.26.0](https://github.com/aws/aws-cdk/compare/v0.25.3...v0.26.0) (2019-03-20)

### Bug Fixes

* **aws-cdk:** fix VpcNetwork.importFromContext() ([#2008](https://github.com/aws/aws-cdk/issues/2008)) ([e1a1a7b](https://github.com/aws/aws-cdk/commit/e1a1a7b)), closes [#1998](https://github.com/aws/aws-cdk/issues/1998)
* **aws-cdk:** update F# template to latest CDK version ([#2006](https://github.com/aws/aws-cdk/issues/2006)) ([bda12f2](https://github.com/aws/aws-cdk/commit/bda12f2))
* **cdk:** merge cloudFormation tags with aspect tags ([#1762](https://github.com/aws/aws-cdk/issues/1762)) ([bfb14b6](https://github.com/aws/aws-cdk/commit/bfb14b6)), closes [#1725](https://github.com/aws/aws-cdk/issues/1725)
* **cfn2ts:** properly de-Tokenize L1 string-arrays ([#2033](https://github.com/aws/aws-cdk/issues/2033)) ([1e50383](https://github.com/aws/aws-cdk/commit/1e50383)), closes [#2030](https://github.com/aws/aws-cdk/issues/2030)
* **core:** allow embedding condition expression as strings ([#2007](https://github.com/aws/aws-cdk/issues/2007)) ([6afa87f](https://github.com/aws/aws-cdk/commit/6afa87f)), closes [#1984](https://github.com/aws/aws-cdk/issues/1984)
* **ecs:** make TaskDefinition accept IRoles ([#2034](https://github.com/aws/aws-cdk/issues/2034)) ([f32431a](https://github.com/aws/aws-cdk/commit/f32431a)), closes [#1925](https://github.com/aws/aws-cdk/issues/1925)
* **lambda:** expose underlying function's role on the alias ([#2024](https://github.com/aws/aws-cdk/issues/2024)) ([de296de](https://github.com/aws/aws-cdk/commit/de296de))
* **stepfunctions:** Actually perform rendering of NotCondition ([06b59d9](https://github.com/aws/aws-cdk/commit/06b59d9))
* **toolkit:** 'cdk deploy' support updates to Outputs ([#2029](https://github.com/aws/aws-cdk/issues/2029)) ([23509ae](https://github.com/aws/aws-cdk/commit/23509ae)), closes [#778](https://github.com/aws/aws-cdk/issues/778)
* **toolkit:** increase number of retries ([#2053](https://github.com/aws/aws-cdk/issues/2053)) ([133dc98](https://github.com/aws/aws-cdk/commit/133dc98)), closes [#1647](https://github.com/aws/aws-cdk/issues/1647)
* rename core classes adding a Cfn prefix ([#1960](https://github.com/aws/aws-cdk/issues/1960)) ([5886bf6](https://github.com/aws/aws-cdk/commit/5886bf6)), closes [#1462](https://github.com/aws/aws-cdk/issues/1462) [#288](https://github.com/aws/aws-cdk/issues/288)


### Code Refactoring

* name "toCloudFormation" internal (renamed to `_toCloudFormation`) ([#2047](https://github.com/aws/aws-cdk/issues/2047)) ([515868b](https://github.com/aws/aws-cdk/commit/515868b)), closes [#2044](https://github.com/aws/aws-cdk/issues/2044) [#2016](https://github.com/aws/aws-cdk/issues/2016)


### Features

* **aws-cdk:** support fixed repository name for DockerImageAsset ([#2032](https://github.com/aws/aws-cdk/issues/2032)) ([942f938](https://github.com/aws/aws-cdk/commit/942f938))
* **aws-rds:** ability to add an existing security group to RDS cluster ([#2021](https://github.com/aws/aws-cdk/issues/2021)) ([1f24336](https://github.com/aws/aws-cdk/commit/1f24336))
* **cfn2ts:** make cfn2ts output TSDoc-compatible docblocks ([#2000](https://github.com/aws/aws-cdk/issues/2000)) ([c6c66e9](https://github.com/aws/aws-cdk/commit/c6c66e9))
* **cfnspec:** update to version 2.28.0 ([#2035](https://github.com/aws/aws-cdk/issues/2035)) ([6a671f2](https://github.com/aws/aws-cdk/commit/6a671f2))
* **cloudformation:** allow specifying additional inputs for deploy Actions ([#2020](https://github.com/aws/aws-cdk/issues/2020)) ([2d463be](https://github.com/aws/aws-cdk/commit/2d463be)), closes [#1247](https://github.com/aws/aws-cdk/issues/1247)
* **core:** can use Constructs to model applications  ([#1940](https://github.com/aws/aws-cdk/issues/1940)) ([32c2377](https://github.com/aws/aws-cdk/commit/32c2377)), closes [#1479](https://github.com/aws/aws-cdk/issues/1479)
* **ecs:** support private registry authentication ([#1737](https://github.com/aws/aws-cdk/issues/1737)) ([11ed691](https://github.com/aws/aws-cdk/commit/11ed691)), closes [#1698](https://github.com/aws/aws-cdk/issues/1698)
* **glue:** add L2 resources for `Database` and `Table` ([#1988](https://github.com/aws/aws-cdk/issues/1988)) ([3117cd3](https://github.com/aws/aws-cdk/commit/3117cd3))
* **region-info:** Model region-specific information ([#1839](https://github.com/aws/aws-cdk/issues/1839)) ([946b444](https://github.com/aws/aws-cdk/commit/946b444)), closes [#1282](https://github.com/aws/aws-cdk/issues/1282)
* **servicediscovery:** AWS Cloud Map construct library ([#1804](https://github.com/aws/aws-cdk/issues/1804)) ([1187366](https://github.com/aws/aws-cdk/commit/1187366))
* **ses:** add constructs for email receiving ([#1971](https://github.com/aws/aws-cdk/issues/1971)) ([3790858](https://github.com/aws/aws-cdk/commit/3790858))
* add more directories excluded and treated as source in the JetBrains script. ([#1961](https://github.com/aws/aws-cdk/issues/1961)) ([a1df717](https://github.com/aws/aws-cdk/commit/a1df717))


### BREAKING CHANGES

* “toCloudFormation” is now internal and should not be called directly. Instead use “app.synthesizeStack”
* **ecs:** `ContainerImage.fromDockerHub` has been renamed to `ContainerImage.fromRegistry`.
* rename Condition to CfnCondition.
* rename StackElement to CfnElement.
* rename Parameter to CfnParameter.
* rename Resource to CfnResource.
* rename Output to CfnOutput.
* rename Mapping to CfnMapping.
* rename Referenceable to CfnRefElement.
* rename IConditionExpression to ICfnConditionExpression.
* rename CfnReference to Reference.
* rename Rule to CfnRule.


## [0.25.3](https://github.com/aws/aws-cdk/compare/v0.25.2...v0.25.3) (2019-03-12)


### Bug Fixes

* **aws-cloudtrail:** correct created log policy when sendToCloudWatchLogs is true ([#1966](https://github.com/aws/aws-cdk/issues/1966)) ([f06ff8e](https://github.com/aws/aws-cdk/commit/f06ff8e))
* **aws-ec2:** All SSM WindowsVersion entries ([#1977](https://github.com/aws/aws-cdk/issues/1977)) ([85a1840](https://github.com/aws/aws-cdk/commit/85a1840))
* **decdk:** relax validation when not using constructs ([#1999](https://github.com/aws/aws-cdk/issues/1999)) ([afbd591](https://github.com/aws/aws-cdk/commit/afbd591))


### Features

* **core:** add fsharp init-template ([#1912](https://github.com/aws/aws-cdk/issues/1912)) ([dfefb58](https://github.com/aws/aws-cdk/commit/dfefb58))
* **ec2:** vpn metrics ([#1979](https://github.com/aws/aws-cdk/issues/1979)) ([9319e13](https://github.com/aws/aws-cdk/commit/9319e13))

## [0.25.2](https://github.com/aws/aws-cdk/compare/v0.25.1...v0.25.2) (2019-03-07)


### Bug Fixes

* **awslint:** Don't fail if the `@aws-cdk/cdk` module is not present ([#1953](https://github.com/aws/aws-cdk/issues/1953)) ([929e854](https://github.com/aws/aws-cdk/commit/929e854))
* **cdk-integ:** Update cdk-integ to use new context file ([#1962](https://github.com/aws/aws-cdk/issues/1962)) ([dbd2401](https://github.com/aws/aws-cdk/commit/dbd2401))
* **cloudfront:** allow IBucket as CloudFront source ([855f1f5](https://github.com/aws/aws-cdk/commit/855f1f5)), closes [#1946](https://github.com/aws/aws-cdk/issues/1946)
* **cloudfront:** pass `viewerProtocolPolicy` to the distribution's behaviors ([#1932](https://github.com/aws/aws-cdk/issues/1932)) ([615ecd4](https://github.com/aws/aws-cdk/commit/615ecd4))
* **eks:** remove 'const' from NodeType enum ([#1970](https://github.com/aws/aws-cdk/issues/1970)) ([ac52989](https://github.com/aws/aws-cdk/commit/ac52989)), closes [#1969](https://github.com/aws/aws-cdk/issues/1969)
* **init:** update the C# init sample with the new `App` API ([#1919](https://github.com/aws/aws-cdk/issues/1919)) ([02f991d](https://github.com/aws/aws-cdk/commit/02f991d))


### Features

* **aws-certificatemanager:** add DNSValidatedCertificate ([#1797](https://github.com/aws/aws-cdk/issues/1797)) ([ae8870d](https://github.com/aws/aws-cdk/commit/ae8870d)), closes [#605](https://github.com/aws/aws-cdk/issues/605)
* **aws-ecs:** add Fargate version 1.3.0 ([#1968](https://github.com/aws/aws-cdk/issues/1968)) ([b529ad7](https://github.com/aws/aws-cdk/commit/b529ad7))
* **core:** democratize synthesis and introduce artifacts ([#1889](https://github.com/aws/aws-cdk/issues/1889)) ([4ab1cd3](https://github.com/aws/aws-cdk/commit/4ab1cd3)), closes [#1716](https://github.com/aws/aws-cdk/issues/1716) [#1893](https://github.com/aws/aws-cdk/issues/1893)
* **ec2:** add support for vpn connections ([#1899](https://github.com/aws/aws-cdk/issues/1899)) ([e150648](https://github.com/aws/aws-cdk/commit/e150648)), closes [awslabs/jsii#231](https://github.com/aws/jsii/issues/231)
* **toolkit:** add '--reuse-asset' option ([#1918](https://github.com/aws/aws-cdk/issues/1918)) ([1767b61](https://github.com/aws/aws-cdk/commit/1767b61)), closes [#1916](https://github.com/aws/aws-cdk/issues/1916)


## [0.25.1](https://github.com/aws/aws-cdk/compare/v0.25.0...v0.25.1) (2019-03-04)


### Bug Fixes

* **toolkit:** fix context passed in from command-line ([#1939](https://github.com/aws/aws-cdk/issues/1939)) ([bec4a02](https://github.com/aws/aws-cdk/commit/bec4a02)), closes [#1911](https://github.com/aws/aws-cdk/issues/1911)

## [0.25.0](https://github.com/aws/aws-cdk/compare/v0.24.1...v0.25.0) (2019-02-28)


### Bug Fixes

* **toolkit:** Don't collect runtime information when versionReporting is disabled ([#1890](https://github.com/aws/aws-cdk/issues/1890)) ([f827a88](https://github.com/aws/aws-cdk/commit/f827a88))
* **aws-codepipeline:** update CFN example. ([#1653](https://github.com/aws/aws-cdk/issues/1653)) ([5dec01a](https://github.com/aws/aws-cdk/commit/5dec01a))
* **aws-s3-deployment:** add setup.cfg to fix pip install bug on mac ([#1826](https://github.com/aws/aws-cdk/issues/1826)) ([759c708](https://github.com/aws/aws-cdk/commit/759c708))
* **cdk:** move apply() from Construct to ConstructNode ([#1738](https://github.com/aws/aws-cdk/issues/1738)) ([642c8a6](https://github.com/aws/aws-cdk/commit/642c8a6)), closes [#1732](https://github.com/aws/aws-cdk/issues/1732)
* **cloudtrail:** addS3EventSelector does not expose all options ([#1854](https://github.com/aws/aws-cdk/issues/1854)) ([5c3431b](https://github.com/aws/aws-cdk/commit/5c3431b)), closes [#1841](https://github.com/aws/aws-cdk/issues/1841)
* **cloudtrail:** Invalid resource for policy when using sendToCloudWatchLogs ([#1851](https://github.com/aws/aws-cdk/issues/1851)) ([816cfc0](https://github.com/aws/aws-cdk/commit/816cfc0)), closes [#1848](https://github.com/aws/aws-cdk/issues/1848)
* **cloudwatch:** fix name of 'MetricAlarmProps' ([#1765](https://github.com/aws/aws-cdk/issues/1765)) ([c87f09a](https://github.com/aws/aws-cdk/commit/c87f09a)), closes [#1760](https://github.com/aws/aws-cdk/issues/1760)
* **codebuild:** accept IRole instead of Role ([#1781](https://github.com/aws/aws-cdk/issues/1781)) ([f08ca15](https://github.com/aws/aws-cdk/commit/f08ca15)), closes [#1778](https://github.com/aws/aws-cdk/issues/1778)
* **codedeploy:** LambdaDeploymentGroup now takes IRole ([#1840](https://github.com/aws/aws-cdk/issues/1840)) ([f6adb7c](https://github.com/aws/aws-cdk/commit/f6adb7c)), closes [#1833](https://github.com/aws/aws-cdk/issues/1833)
* **codepipeline:** allow providing Tokens as the physical name of the Pipeline. ([#1800](https://github.com/aws/aws-cdk/issues/1800)) ([f6aea1b](https://github.com/aws/aws-cdk/commit/f6aea1b)), closes [#1788](https://github.com/aws/aws-cdk/issues/1788)
* **core:** improve error message if construct names conflict ([#1706](https://github.com/aws/aws-cdk/issues/1706)) ([0ea4a78](https://github.com/aws/aws-cdk/commit/0ea4a78))
* **core:** performance improvements ([#1750](https://github.com/aws/aws-cdk/issues/1750)) ([77b516f](https://github.com/aws/aws-cdk/commit/77b516f))
* **ecs:** rename capacity adding methods ([#1715](https://github.com/aws/aws-cdk/issues/1715)) ([e3738ac](https://github.com/aws/aws-cdk/commit/e3738ac))
* **elbv2:** explicitly implement IApplicationTargetGroup ([#1806](https://github.com/aws/aws-cdk/issues/1806)) ([828a2d7](https://github.com/aws/aws-cdk/commit/828a2d7)), closes [#1799](https://github.com/aws/aws-cdk/issues/1799)
* **init:** add new parameter to C# example ([#1831](https://github.com/aws/aws-cdk/issues/1831)) ([c7b99d8](https://github.com/aws/aws-cdk/commit/c7b99d8))
* **kms:** have EncryptionKeyBase implement IEncryptionKey ([#1728](https://github.com/aws/aws-cdk/issues/1728)) ([49080c6](https://github.com/aws/aws-cdk/commit/49080c6))
* **lambda:** Add 'provided' runtime ([#1764](https://github.com/aws/aws-cdk/issues/1764)) ([73d5bef](https://github.com/aws/aws-cdk/commit/73d5bef)), closes [#1761](https://github.com/aws/aws-cdk/issues/1761)
* **lambda:** add region check for environment variables ([#1690](https://github.com/aws/aws-cdk/issues/1690)) ([846ed9f](https://github.com/aws/aws-cdk/commit/846ed9f))
* **ssm:** Generate correct SSM Parameter ARN ([#1726](https://github.com/aws/aws-cdk/issues/1726)) ([39df456](https://github.com/aws/aws-cdk/commit/39df456))
* **toolkit:** correctly reset context from the shell command ([#1903](https://github.com/aws/aws-cdk/issues/1903)) ([58025c0](https://github.com/aws/aws-cdk/commit/58025c0))
* **toolkit:** correcty load cdk.json file without context ([#1900](https://github.com/aws/aws-cdk/issues/1900)) ([7731565](https://github.com/aws/aws-cdk/commit/7731565))
* **toolkit:** ignore hidden files for 'cdk init' ([#1766](https://github.com/aws/aws-cdk/issues/1766)) ([afdd173](https://github.com/aws/aws-cdk/commit/afdd173)), closes [#1758](https://github.com/aws/aws-cdk/issues/1758)
* **toolkit:** only fail if errors are on selected stacks ([#1807](https://github.com/aws/aws-cdk/issues/1807)) ([9c0cf8d](https://github.com/aws/aws-cdk/commit/9c0cf8d)), closes [#1784](https://github.com/aws/aws-cdk/issues/1784) [#1783](https://github.com/aws/aws-cdk/issues/1783)
* **toolkit:** support diff on multiple stacks ([#1855](https://github.com/aws/aws-cdk/issues/1855)) ([72d2535](https://github.com/aws/aws-cdk/commit/72d2535))
* **build:** Npm ignores files and folders named "core" by default ([#1767](https://github.com/aws/aws-cdk/issues/1767)) ([42876e7](https://github.com/aws/aws-cdk/commit/42876e7)), closes [npm/npm-packlist#24](https://github.com/npm/npm-packlist/issues/24)
* **core:** stack.partition is never scoped ([#1763](https://github.com/aws/aws-cdk/issues/1763)) ([c968588](https://github.com/aws/aws-cdk/commit/c968588))


### Features

* **apigateway:** add support for MethodResponse to aws-apigateway. ([#1572](https://github.com/aws/aws-cdk/issues/1572)) ([46236d9](https://github.com/aws/aws-cdk/commit/46236d9))
* **autoscaling:** bring your own IAM role ([#1727](https://github.com/aws/aws-cdk/issues/1727)) ([2016b8d](https://github.com/aws/aws-cdk/commit/2016b8d)), closes [#1701](https://github.com/aws/aws-cdk/issues/1701)
* **aws-eks:** add construct library for EKS ([#1655](https://github.com/aws/aws-cdk/issues/1655)) ([22fc8b9](https://github.com/aws/aws-cdk/commit/22fc8b9)), closes [#991](https://github.com/aws/aws-cdk/issues/991)
* **cfnspec:** manually add VPCEndpointService ([#1734](https://github.com/aws/aws-cdk/issues/1734)) ([f782958](https://github.com/aws/aws-cdk/commit/f782958)), closes [#1659](https://github.com/aws/aws-cdk/issues/1659)
* **codebuild:** add support for setting the gitCloneDepth property on Project sources. ([#1798](https://github.com/aws/aws-cdk/issues/1798)) ([5408a53](https://github.com/aws/aws-cdk/commit/5408a53)), closes [#1789](https://github.com/aws/aws-cdk/issues/1789)
* **core:** Add `construct.node.stack` attribute ([#1753](https://github.com/aws/aws-cdk/issues/1753)) ([a46cfd8](https://github.com/aws/aws-cdk/commit/a46cfd8)), closes [#798](https://github.com/aws/aws-cdk/issues/798)
* **dynamodb:** partitionKey and sortKey are now immutable ([#1744](https://github.com/aws/aws-cdk/issues/1744)) ([63ae0b4](https://github.com/aws/aws-cdk/commit/63ae0b4))
* **ecs:** allow ECS to be used declaratively ([#1745](https://github.com/aws/aws-cdk/issues/1745)) ([2480f0f](https://github.com/aws/aws-cdk/commit/2480f0f)), closes [#1618](https://github.com/aws/aws-cdk/issues/1618)
* **kms:** Allow opting out of "Retain" deletion policy ([#1685](https://github.com/aws/aws-cdk/issues/1685)) ([7706302](https://github.com/aws/aws-cdk/commit/7706302))
* **lambda:** allow specify event sources in props ([#1746](https://github.com/aws/aws-cdk/issues/1746)) ([a84157d](https://github.com/aws/aws-cdk/commit/a84157d))
* **lambda-event-sources:** "api" event source ([#1742](https://github.com/aws/aws-cdk/issues/1742)) ([5c11680](https://github.com/aws/aws-cdk/commit/5c11680))
* **route53:** Convenience API for creating zone delegations ([#1853](https://github.com/aws/aws-cdk/issues/1853)) ([f974531](https://github.com/aws/aws-cdk/commit/f974531)), closes [#1847](https://github.com/aws/aws-cdk/issues/1847)
* **sns:** Support raw message delivery ([#1827](https://github.com/aws/aws-cdk/issues/1827)) ([cc0a28c](https://github.com/aws/aws-cdk/commit/cc0a28c))
* **ssm:** allow referencing "latest" version of SSM parameter ([#1768](https://github.com/aws/aws-cdk/issues/1768)) ([9af36af](https://github.com/aws/aws-cdk/commit/9af36af)), closes [#1587](https://github.com/aws/aws-cdk/issues/1587)
* **toolkit:** improve docker build time in CI ([#1776](https://github.com/aws/aws-cdk/issues/1776)) ([1060b95](https://github.com/aws/aws-cdk/commit/1060b95)), closes [#1748](https://github.com/aws/aws-cdk/issues/1748)
* **codepipelines:** re-structure the CodePipeline Construct library API. ([#1590](https://github.com/aws/aws-cdk/issues/1590)) ([3c3db07](https://github.com/aws/aws-cdk/commit/3c3db07))
* **decdk:** Prototype for declarative CDK (decdk) ([#1618](https://github.com/aws/aws-cdk/pull/1618)) ([8713ac6](https://github.com/aws/aws-cdk/commit/8713ac6))


### BREAKING CHANGES

* **cloudtrail:** The `CloudTrail.addS3EventSelector` accepts an options
object instead of only a `ReadWriteType` value.
* **codedeploy:** If an existing role is provided to a LambdaDeploymentGroup,
you will need to provide the assuming service principal (`codedeploy.amazonaws.com`)
yourself.
* **core:**$$** 'Aws' class returns unscoped Tokens, introduce a
new class 'ScopedAws' which returns scoped Tokens.
* **ssm:** Rename `parameter.valueAsString` =>
`parameter.stringValue`, rename `parameter.valueAsList` =>
`parameter.stringListValue`, rename `ssmParameter.parameterValue` =>
`ssmParameter.stringValue` or `ssmParameter.stringListValue` depending
on type, rename `secretString.value` => `secretString.stringValue`,
rename `secret.toSecretString()` =>`secret.secretString`
* **cloudwatch:** Rename 'MetricAarmProps' => 'MetricAlarmProps'.
* **core:** `Stack.find(c)` and `Stack.tryFind(c)` were
replaced by `c.node.stack`.
* **dynamodb:** `partitionKey` is now a required property when defining a
`dynamodb.Table`. The `addPartitionKey` and `addSortKey` methods have been removed.
* **cdk:** Tag aspects use this feature and any consumers of this
implementation must change from `myConstruct.apply( ... )` to
`myConstruct.node.apply( ... )`.
* **ecs:** Rename 'addDefaultAutoScalingGroupCapacity' =>
'addCapacity', 'addAutoScalingGroupCapacity' => 'addAutoScalingGroup'.
* **codepipelines:** the CodePipeline Stage class is no longer a Construct,
and cannot be instantiated directly, only through calling Pipeline#addStage;
which now takes an Object argument instead of a String.
* **codepipelines:** the CodePipeline Actions are no longer Constructs.
* **codepipelines:** the CodePipeline Action name is now part of the Action props,
instead of being a separate parameter.
* **codepipelines:** the Pipeline#addToPipeline methods in Resources like S3, CodeBuild, CodeCommit etc.
have been renamed to `toCodePipelineAction`.
* **aws-eks:** For `AutoScalingGroup`, renamed `minSize` =>
`minCapacity`, `maxSize` => `maxCapacity`, for consistency with
`desiredCapacity` and also Application AutoScaling.
For ECS's `addDefaultAutoScalingGroupCapacity()`, `instanceCount` =>
`desiredCapacity` and the function now takes an ID (pass
`"DefaultAutoScalingGroup"` to avoid interruption to your deployments).



## [0.24.1](https://github.com/aws/aws-cdk/compare/v0.24.0...v0.24.1) (2019-02-07)


### Bug Fixes

* reference documentation is missing ([8fba8bc](https://github.com/aws/aws-cdk/commit/8fba8bc))


## [0.24.0](https://github.com/aws/aws-cdk/compare/v0.23.0...v0.24.0) (2019-02-06)


### Bug Fixes

* **aws-ecs:** correctly sets MinimumHealthyPercentage to 0 ([#1661](https://github.com/aws/aws-cdk/issues/1661)) ([ce5966f](https://github.com/aws/aws-cdk/commit/ce5966f)), closes [#1660](https://github.com/aws/aws-cdk/issues/1660)
* **cdk:** only make Outputs Exports when necessary ([#1624](https://github.com/aws/aws-cdk/issues/1624)) ([ebb8aa1](https://github.com/aws/aws-cdk/commit/ebb8aa1)), closes [#903](https://github.com/aws/aws-cdk/issues/903) [#1611](https://github.com/aws/aws-cdk/issues/1611)
* **elbv2:** fix specifying TargetGroup name ([#1684](https://github.com/aws/aws-cdk/issues/1684)) ([1d7198a](https://github.com/aws/aws-cdk/commit/1d7198a)), closes [#1674](https://github.com/aws/aws-cdk/issues/1674)
* **sns:** create subscription object under subscriber ([#1645](https://github.com/aws/aws-cdk/issues/1645)) ([0cc11ca](https://github.com/aws/aws-cdk/commit/0cc11ca)), closes [#1643](https://github.com/aws/aws-cdk/issues/1643) [#1534](https://github.com/aws/aws-cdk/issues/1534)


### Features

* **aws-s3:** add option to specify block public access settings ([#1664](https://github.com/aws/aws-cdk/issues/1664)) ([299fb6a](https://github.com/aws/aws-cdk/commit/299fb6a))
* **cdk:** aspect framework and tag implementation ([#1451](https://github.com/aws/aws-cdk/issues/1451)) ([f7c8531](https://github.com/aws/aws-cdk/commit/f7c8531)), closes [#1136](https://github.com/aws/aws-cdk/issues/1136) [#1497](https://github.com/aws/aws-cdk/issues/1497) [#360](https://github.com/aws/aws-cdk/issues/360)
* **cdk:** metric functions now automatically generated ([#1617](https://github.com/aws/aws-cdk/issues/1617)) ([36cfca8](https://github.com/aws/aws-cdk/commit/36cfca8))
* **cognito:** Implement user pool and user pool client constructs  ([#1615](https://github.com/aws/aws-cdk/issues/1615)) ([8e03ed6](https://github.com/aws/aws-cdk/commit/8e03ed6))
* **core:** overrideLogicalId: override IDs of CFN elements ([#1670](https://github.com/aws/aws-cdk/issues/1670)) ([823a1e8](https://github.com/aws/aws-cdk/commit/823a1e8)), closes [#1594](https://github.com/aws/aws-cdk/issues/1594)
* **secretsmanager:** L2 construct for Secret ([#1686](https://github.com/aws/aws-cdk/issues/1686)) ([8da9115](https://github.com/aws/aws-cdk/commit/8da9115))
* **serverless:** add AWS::Serverless::Application to CFN spec ([#1634](https://github.com/aws/aws-cdk/issues/1634)) ([bfa40b1](https://github.com/aws/aws-cdk/commit/bfa40b1))
* **ssm:** Add L2 resource for SSM Parameters ([#1515](https://github.com/aws/aws-cdk/issues/1515)) ([9858a64](https://github.com/aws/aws-cdk/commit/9858a64))


### BREAKING CHANGES

* **cdk:** if you are using TagManager the API for this object has completely changed. You should no longer use TagManager directly, but instead replace this with Tag Aspects. `cdk.Tag` has been renamed to `cdk.CfnTag` to enable `cdk.Tag` to be the Tag Aspect.

## [0.23.0](https://github.com/aws/aws-cdk/compare/v0.22.0...v0.23.0) (2019-02-04)


### Bug Fixes

* **apig:** Move `selectionPattern` to `integrationResponses` ([#1636](https://github.com/aws/aws-cdk/issues/1636)) ([7cdbcec](https://github.com/aws/aws-cdk/commit/7cdbcec)), closes [#1608](https://github.com/aws/aws-cdk/issues/1608)
* **aws-cdk:** Improvements to IAM diff rendering ([#1542](https://github.com/aws/aws-cdk/issues/1542)) ([3270b47](https://github.com/aws/aws-cdk/commit/3270b47)), closes [#1458](https://github.com/aws/aws-cdk/issues/1458) [#1495](https://github.com/aws/aws-cdk/issues/1495) [#1549](https://github.com/aws/aws-cdk/issues/1549)
* **aws-cdk:** Java init template works on Windows ([#1503](https://github.com/aws/aws-cdk/issues/1503)) ([24f521a](https://github.com/aws/aws-cdk/commit/24f521a))
* **sns:** create subscription object under subscriber ([5c4a9e5](https://github.com/aws/aws-cdk/commit/5c4a9e5)), closes [#1643](https://github.com/aws/aws-cdk/issues/1643) [#1534](https://github.com/aws/aws-cdk/issues/1534)
* Improve error message in SSMParameterProvider ([#1630](https://github.com/aws/aws-cdk/issues/1630)) ([6a8e010](https://github.com/aws/aws-cdk/commit/6a8e010)), closes [#1621](https://github.com/aws/aws-cdk/issues/1621)
* **aws-ec2:** CfnNetworkAclEntry.CidrBlock should be optional ([#1565](https://github.com/aws/aws-cdk/issues/1565)) ([4af7c0d](https://github.com/aws/aws-cdk/commit/4af7c0d)), closes [#1517](https://github.com/aws/aws-cdk/issues/1517)
* **aws-ec2:** change maxAZs default for VPCs to 3 ([#1543](https://github.com/aws/aws-cdk/issues/1543)) ([32a4b29](https://github.com/aws/aws-cdk/commit/32a4b29)), closes [#996](https://github.com/aws/aws-cdk/issues/996)
* **aws-events:** ergonomics improvements to CloudWatch Events ([#1570](https://github.com/aws/aws-cdk/issues/1570)) ([5e91a0a](https://github.com/aws/aws-cdk/commit/5e91a0a)), closes [#1514](https://github.com/aws/aws-cdk/issues/1514) [#1198](https://github.com/aws/aws-cdk/issues/1198) [#1275](https://github.com/aws/aws-cdk/issues/1275)
* **aws-s3-deployment:** clean up tempfiles after deployment ([#1367](https://github.com/aws/aws-cdk/issues/1367)) ([e291d37](https://github.com/aws/aws-cdk/commit/e291d37))
* **dynamodb:** grant also gives access to indexes ([#1564](https://github.com/aws/aws-cdk/issues/1564)) ([33c2a6d](https://github.com/aws/aws-cdk/commit/33c2a6d)), closes [#1540](https://github.com/aws/aws-cdk/issues/1540)
* Report stack metadata in assertions ([#1547](https://github.com/aws/aws-cdk/issues/1547)) ([c2d17f5](https://github.com/aws/aws-cdk/commit/c2d17f5))


### Features

* **alexa-ask:** Add deploy action for Alexa ([#1613](https://github.com/aws/aws-cdk/issues/1613)) ([0deea61](https://github.com/aws/aws-cdk/commit/0deea61))
* **apigateway:** support function alias in LambdaIntegration ([9f8bfa5](https://github.com/aws/aws-cdk/commit/9f8bfa5))
* **app:** add source map support to TS app template ([#1581](https://github.com/aws/aws-cdk/issues/1581)) ([5df22d9](https://github.com/aws/aws-cdk/commit/5df22d9)), closes [#1579](https://github.com/aws/aws-cdk/issues/1579)
* **autoscaling:** Support AssociatePublicIpAddress ([#1604](https://github.com/aws/aws-cdk/issues/1604)) ([23c9afc](https://github.com/aws/aws-cdk/commit/23c9afc)), closes [#1603](https://github.com/aws/aws-cdk/issues/1603)
* **aws-codepipeline:** support setting a Role for a CFN Action ([#1449](https://github.com/aws/aws-cdk/issues/1449)) ([77fe077](https://github.com/aws/aws-cdk/commit/77fe077))
* **aws-ecs:** add additional configuration to Volume ([#1357](https://github.com/aws/aws-cdk/issues/1357)) ([ff96f3f](https://github.com/aws/aws-cdk/commit/ff96f3f))
* **aws-ecs:** add support for Event Targets ([#1571](https://github.com/aws/aws-cdk/issues/1571)) ([aa68db5](https://github.com/aws/aws-cdk/commit/aa68db5)), closes [#1370](https://github.com/aws/aws-cdk/issues/1370)
* **aws-ecs:** ECS service scaling on ALB RequestCount ([#1574](https://github.com/aws/aws-cdk/issues/1574)) ([2b491d4](https://github.com/aws/aws-cdk/commit/2b491d4))
* **aws-s3:** add the option to not poll to the CodePipeline Action. ([#1260](https://github.com/aws/aws-cdk/issues/1260)) ([876b26d](https://github.com/aws/aws-cdk/commit/876b26d))
* **cdk:** Support UpdateReplacePolicy on Resources ([#1610](https://github.com/aws/aws-cdk/issues/1610)) ([f49c33b](https://github.com/aws/aws-cdk/commit/f49c33b))
* **cdk:** treat the "fake" CFN intrinsics (Fn::GetArtifactAtt, Fn::GetParam) specially when stringifying JSON. ([#1605](https://github.com/aws/aws-cdk/issues/1605)) ([2af2426](https://github.com/aws/aws-cdk/commit/2af2426)), closes [#1588](https://github.com/aws/aws-cdk/issues/1588)
* **cfnspec:** Upgrade to CFN Resource Specification v2.21.0 ([#1622](https://github.com/aws/aws-cdk/issues/1622)) ([21a5529](https://github.com/aws/aws-cdk/commit/21a5529))
* **cloudwatch:** Support 'datapointsToAlarm' on Alarms ([#1631](https://github.com/aws/aws-cdk/issues/1631)) ([828ac20](https://github.com/aws/aws-cdk/commit/828ac20)), closes [#1626](https://github.com/aws/aws-cdk/issues/1626)
* **core:** Generalization of dependencies ([#1583](https://github.com/aws/aws-cdk/issues/1583)) ([53e68257](https://github.com/aws/aws-cdk/commit/53e68257))
* **ecs:** environment variables for LoadBalancedXxxService ([#1537](https://github.com/aws/aws-cdk/issues/1537)) ([b633505](https://github.com/aws/aws-cdk/commit/b633505))
* **ecs:** VPC link for API Gatweay and ECS services ([#1541](https://github.com/aws/aws-cdk/issues/1541)) ([6642ca2](https://github.com/aws/aws-cdk/commit/6642ca2))
* **iam:** Make `roleName` available on `IRole` ([#1589](https://github.com/aws/aws-cdk/issues/1589)) ([9128390](https://github.com/aws/aws-cdk/commit/9128390))
* **lambda:** reserved concurrent executions ([#1560](https://github.com/aws/aws-cdk/issues/1560)) ([f7469c1](https://github.com/aws/aws-cdk/commit/f7469c1))
* **lambda:** Support AWS Lambda Layers ([#1411](https://github.com/aws/aws-cdk/issues/1411)) ([036cfdf](https://github.com/aws/aws-cdk/commit/036cfdf))
* **s3:** Add DeployAction for codepipeline ([#1596](https://github.com/aws/aws-cdk/issues/1596)) ([8f1a5e8](https://github.com/aws/aws-cdk/commit/8f1a5e8))
* **s3:** export bucket websiteURL ([#1521](https://github.com/aws/aws-cdk/issues/1521)) ([#1544](https://github.com/aws/aws-cdk/issues/1544)) ([4e46d3c](https://github.com/aws/aws-cdk/commit/4e46d3c))
* **s3:** imported bucket format option for website URL format ([#1550](https://github.com/aws/aws-cdk/issues/1550)) ([28a423d](https://github.com/aws/aws-cdk/commit/28a423d))
* **toolkit:** disable colors if a terminal is not attached to stdout ([#1641](https://github.com/aws/aws-cdk/issues/1641)) ([58b4685](https://github.com/aws/aws-cdk/commit/58b4685))


### BREAKING CHANGES

* **aws-codepipeline:** the `role` property in the CloudFormation Actions has been renamed to `deploymentRole`.
* **aws-codepipeline:** the `role` property in the `app-delivery` package has been renamed to `deploymentRole`.



## [0.22.0](https://github.com/aws/aws-cdk/compare/v0.21.0...v0.22.0) (2019-01-10)

This is a major release with multiple breaking changes in the core layers.
Please consult the __breaking changes__ section below for details.

We are focusing these days on finalizing the common patterns and APIs of the CDK
framework and the AWS Construct Library, which is why you are seeing all these
breaking changes. Expect a few more releases with changes of that nature as we
stabilize these APIs, so you might want to hold off with upgrading. We will
communicate when this foundational work is complete.

### Bug Fixes

* **core:** automatic cross-stack refs for CFN resources ([#1510](https://github.com/aws/aws-cdk/issues/1510)) ([ca5ee35](https://github.com/aws/aws-cdk/commit/ca5ee35))
* **ecs:** correct typo and other minor mistakes in ecs readme ([#1448](https://github.com/aws/aws-cdk/issues/1448)) ([9c91b20](https://github.com/aws/aws-cdk/commit/9c91b20))
* **elbv2:** unable to specify load balancer name ([#1486](https://github.com/aws/aws-cdk/issues/1486)) ([5b24583](https://github.com/aws/aws-cdk/commit/5b24583)), closes [#973](https://github.com/aws/aws-cdk/issues/973) [#1481](https://github.com/aws/aws-cdk/issues/1481)
* **lambda:** use IRole instead of Role to allow imports ([#1509](https://github.com/aws/aws-cdk/issues/1509)) ([b909dcd](https://github.com/aws/aws-cdk/commit/b909dcd))
* **toolkit:** fix typo in --rename option description ([#1438](https://github.com/aws/aws-cdk/issues/1438)) ([1dd56d4](https://github.com/aws/aws-cdk/commit/1dd56d4))
* **toolkit:** support multiple toolkit stacks in the same environment ([#1427](https://github.com/aws/aws-cdk/issues/1427)) ([095da14](https://github.com/aws/aws-cdk/commit/095da14)), closes [#1416](https://github.com/aws/aws-cdk/issues/1416)

### Features

* **apigateway:** add tracingEnabled property to APIGW Stage ([#1482](https://github.com/aws/aws-cdk/issues/1482)) ([fefa764](https://github.com/aws/aws-cdk/commit/fefa764))
* **assets:** enable local tooling scenarios such as lambda debugging ([#1433](https://github.com/aws/aws-cdk/issues/1433)) ([0d2b633](https://github.com/aws/aws-cdk/commit/0d2b633)), closes [#1432](https://github.com/aws/aws-cdk/issues/1432)
* **aws-cdk:** better stack dependency handling ([#1511](https://github.com/aws/aws-cdk/issues/1511)) ([b4bbaf0](https://github.com/aws/aws-cdk/commit/b4bbaf0)), closes [#1508](https://github.com/aws/aws-cdk/issues/1508) [#1505](https://github.com/aws/aws-cdk/issues/1505)
* **aws-codepipeline:** jenkins build and test actions ([#1216](https://github.com/aws/aws-cdk/issues/1216)) ([471e8eb](https://github.com/aws/aws-cdk/commit/471e8eb))
* **aws-codepipeline:** support notifications on the ManualApprovalAction ([#1368](https://github.com/aws/aws-cdk/issues/1368)) ([068fa46](https://github.com/aws/aws-cdk/commit/068fa46)), closes [#1222](https://github.com/aws/aws-cdk/issues/1222)
* **aws-ecs:** add support Amazon Linux 2 ([#1484](https://github.com/aws/aws-cdk/issues/1484)) ([82ec0ff](https://github.com/aws/aws-cdk/commit/82ec0ff)), closes [#1483](https://github.com/aws/aws-cdk/issues/1483)
* **aws-kms:** allow tagging kms keys ([#1485](https://github.com/aws/aws-cdk/issues/1485)) ([f43b4d4](https://github.com/aws/aws-cdk/commit/f43b4d4))
* **aws-lambda:** add input and output artifacts to the CodePipeline action ([#1390](https://github.com/aws/aws-cdk/issues/1390)) ([fbd7728](https://github.com/aws/aws-cdk/commit/fbd7728)), closes [#1384](https://github.com/aws/aws-cdk/issues/1384)
* **cdk:** transparently use constructs from another stack ([d7371f0](https://github.com/aws/aws-cdk/commit/d7371f0)), closes [#1324](https://github.com/aws/aws-cdk/issues/1324)
* **cli:** allow specifying options using env vars ([#1447](https://github.com/aws/aws-cdk/issues/1447)) ([7cd84a0](https://github.com/aws/aws-cdk/commit/7cd84a0))
* aws resource api linting (breaking changes) ([#1434](https://github.com/aws/aws-cdk/issues/1434)) ([8c17ca7](https://github.com/aws/aws-cdk/commit/8c17ca7)), closes [#742](https://github.com/aws/aws-cdk/issues/742) [#1428](https://github.com/aws/aws-cdk/issues/1428)
* **core:** cloudformation condition chaining ([#1494](https://github.com/aws/aws-cdk/issues/1494)) ([2169015](https://github.com/aws/aws-cdk/commit/2169015)), closes [#1457](https://github.com/aws/aws-cdk/issues/1457)
* **diff:** better diff of arbitrary json objects ([#1488](https://github.com/aws/aws-cdk/issues/1488)) ([607f997](https://github.com/aws/aws-cdk/commit/607f997))
* **route53:** support cname records ([#1487](https://github.com/aws/aws-cdk/issues/1487)) ([17eddd1](https://github.com/aws/aws-cdk/commit/17eddd1)), closes [#1420](https://github.com/aws/aws-cdk/issues/1420)
* **step-functions:** support parameters option ([#1492](https://github.com/aws/aws-cdk/issues/1492)) ([935054a](https://github.com/aws/aws-cdk/commit/935054a)), closes [#1480](https://github.com/aws/aws-cdk/issues/1480)
* **core:** construct base class changes (breaking) ([#1444](https://github.com/aws/aws-cdk/issues/1444)) ([fb22a32](https://github.com/aws/aws-cdk/commit/fb22a32)), closes [#1431](https://github.com/aws/aws-cdk/issues/1431) [#1441](https://github.com/aws/aws-cdk/issues/1441) [#189](https://github.com/aws/aws-cdk/issues/189) [#1441](https://github.com/aws/aws-cdk/issues/1441) [#1431](https://github.com/aws/aws-cdk/issues/1431)
* **core:** idiomize cloudformation intrinsics functions ([#1428](https://github.com/aws/aws-cdk/issues/1428)) ([04217a5](https://github.com/aws/aws-cdk/commit/04217a5)), closes [#202](https://github.com/aws/aws-cdk/issues/202)
* **cloudformation:** no more generated attribute types in CFN layer (L1) ([#1489](https://github.com/aws/aws-cdk/issues/1489)) ([4d6d5ca](https://github.com/aws/aws-cdk/commit/4d6d5ca)), closes [#1455](https://github.com/aws/aws-cdk/issues/1455) [#1406](https://github.com/aws/aws-cdk/issues/1406)
* **cloudformation:** stop generating legacy cloudformation resources ([#1493](https://github.com/aws/aws-cdk/issues/1493)) ([81b4174](https://github.com/aws/aws-cdk/commit/81b4174))


### BREAKING CHANGES

* **Cross-stack references:** if you are using `export()` and `import()` to share constructs between stacks, you can stop doing that, instead of `FooImportProps` accept an `IFoo` directly on the consuming stack, and use that object as usual.
* `ArnUtils.fromComponents()` and `ArnUtils.parse()` have been moved onto `Stack`.
* All CloudFormation pseudo-parameter (such as `AWS::AccountId` etc) are now also accessible via `Stack`, as `stack.accountId` etc.
* All CloudFormation intrinsic functions are now represented as static methods under the `Fn` class (e.g. `Fn.join(...)` instead of `new FnJoin(...).toString()`)
* `resolve()` has been moved to `this.node.resolve()`.
* `CloudFormationJSON.stringify()` has been moved to `this.node.stringifyJson()`. `validate()` now should be `protected`.
* The deprecated `cloudformation.XxxResource` classes have been removed. Use the `CfnXxx` classes instead.
* Any `CfnXxx` resource attributes that represented a list of strings are now typed as `string[]`s (via #1144). Attributes that represent strings, are still typed as `string` (#712) and all other attribute types are represented as `cdk.Token`.
* **route53:** The `route53.TXTRecord` class was renamed to `route53.TxtRecord`.
* **route53:** record classes now require a `zone` when created (not assuming zone is the parent construct).
* **lambda:** the static "metric" methods moved from `lambda.FunctionRef` to `lambda.Function`.
* Many AWS resource classes have been changed to conform to API guidelines:
  - `XxxRef` abstract classes are now `IXxx` interfaces
  - `XxxRefProps` are now `XxxImportProps`
  - `XxxRef.import(...)` are now `Xxx.import(...)` accept `XxxImportProps` and return `IXxx`
  - `export(): XxxImportProps` is now defined in `IXxx` and implemented by imported resources


## [0.21.0](https://github.com/aws/aws-cdk/compare/v0.20.0...v0.21.0) (2018-12-20)


### Bug Fixes

* **aws-cloudformation:** change the type of Role in CodePipeline Actions to IRole. ([#1364](https://github.com/aws/aws-cdk/issues/1364)) ([3d07e48](https://github.com/aws/aws-cdk/commit/3d07e48)), closes [#1361](https://github.com/aws/aws-cdk/issues/1361)
* **codebuild:** Rename includeBuildID property of S3BucketBuildArtifacts ([#1354](https://github.com/aws/aws-cdk/issues/1354)) ([84eb7ad](https://github.com/aws/aws-cdk/commit/84eb7ad)), closes [#1347](https://github.com/aws/aws-cdk/issues/1347)
* **toolkit:** scrutiny dialog should fail with no tty ([#1382](https://github.com/aws/aws-cdk/issues/1382)) ([478a714](https://github.com/aws/aws-cdk/commit/478a714)), closes [#1380](https://github.com/aws/aws-cdk/issues/1380)


### Features

* **aws-codebuild:** change the API of GitHub and BitBucket Sources. ([#1345](https://github.com/aws/aws-cdk/issues/1345)) ([9cebf0d](https://github.com/aws/aws-cdk/commit/9cebf0d))
* add "engines.node" key to all packages ([#1358](https://github.com/aws/aws-cdk/issues/1358)) ([b595cf0](https://github.com/aws/aws-cdk/commit/b595cf0)), closes [#1337](https://github.com/aws/aws-cdk/issues/1337)
* deprecate "cloudformation" namespace in favor of "CfnXxx" ([#1311](https://github.com/aws/aws-cdk/issues/1311)) ([d20938c](https://github.com/aws/aws-cdk/commit/d20938c)), closes [#878](https://github.com/aws/aws-cdk/issues/878) [awslabs/jsii#283](https://github.com/aws/jsii/issues/283) [awslabs/jsii#270](https://github.com/aws/jsii/issues/270)
* update CloudFormation resources v2.18.0 ([#1407](https://github.com/aws/aws-cdk/issues/1407)) ([0f80b56](https://github.com/aws/aws-cdk/commit/0f80b56)), closes [#1409](https://github.com/aws/aws-cdk/issues/1409)
* **aws-codebuild:** allow setting Webhook for GitHub Sources. ([#1387](https://github.com/aws/aws-cdk/issues/1387)) ([d5cae61](https://github.com/aws/aws-cdk/commit/d5cae61))
* **aws-ec2:** can now use PrefixList in ingress rules ([#1360](https://github.com/aws/aws-cdk/issues/1360)) ([c3cfcd5](https://github.com/aws/aws-cdk/commit/c3cfcd5))
* **aws-iam:** configure ExternalId for Role ([#1359](https://github.com/aws/aws-cdk/issues/1359)) ([3d200c9](https://github.com/aws/aws-cdk/commit/3d200c9)), closes [#235](https://github.com/aws/aws-cdk/issues/235)
* **aws-lambda:** Add python 3.7 runtime ([#1379](https://github.com/aws/aws-cdk/issues/1379)) ([8c733ef](https://github.com/aws/aws-cdk/commit/8c733ef))
* **cdk:** add the CodeDeployLambdaAlias Update Policy. ([#1346](https://github.com/aws/aws-cdk/issues/1346)) ([d648b58](https://github.com/aws/aws-cdk/commit/d648b58)), closes [#1177](https://github.com/aws/aws-cdk/issues/1177)
* **core:** convert "/" in construct id to "--" and disallow tokens ([#1375](https://github.com/aws/aws-cdk/issues/1375)) ([011aac0](https://github.com/aws/aws-cdk/commit/011aac0)), closes [#1351](https://github.com/aws/aws-cdk/issues/1351) [#1374](https://github.com/aws/aws-cdk/issues/1374)
* **iam:** CompositePrincipal and allow multiple principal types ([#1377](https://github.com/aws/aws-cdk/issues/1377)) ([b942ae5](https://github.com/aws/aws-cdk/commit/b942ae5)), closes [#1201](https://github.com/aws/aws-cdk/issues/1201)


### BREAKING CHANGES

* **aws-cloudformation:** this changes the type of the `role` property in CFN CodePipeline Actions
from `Role` to `IRole`. This is needed to use imported Roles when creating Actions.
* **aws-codebuild:** this changes the API of CodeBuild's GitHub and BitBucket Sources
to take an owner/repo pair instead of an entire cloneUrl,
to make it consistent with the GitHubSourceAction in the CodePipeline package. Also adds handling the reportBuildStatus and insecureSsl Source properties.
* **codebuild:** the `includeBuildID` property of
`S3BucketBuildArtifacts` was renamed to `includeBuildId` (note the
lower-case trailing `d`).



## [0.20.0](https://github.com/aws/aws-cdk/compare/v0.19.0...v0.20.0) (2018-12-13)


### Bug Fixes

* **assert:** Adjust assertion behavior to be stricter ([#1289](https://github.com/aws/aws-cdk/issues/1289)) ([0919bf4](https://github.com/aws/aws-cdk/commit/0919bf4)), closes [awslabs/cdk-ops#186](https://github.com/awslabs/cdk-ops/issues/186)
* **aws-cdk:** fix profile use in non-'aws' partitions ([#1283](https://github.com/aws/aws-cdk/issues/1283)) ([5478913](https://github.com/aws/aws-cdk/commit/5478913)), closes [#1262](https://github.com/aws/aws-cdk/issues/1262) [#1109](https://github.com/aws/aws-cdk/issues/1109)
* upgrade jsii to v0.7.12 ([#1328](https://github.com/aws/aws-cdk/issues/1328)) ([62b7941](https://github.com/aws/aws-cdk/commit/62b7941))
* **aws-cdk:** fix YAML line wrapping issue ([#1334](https://github.com/aws/aws-cdk/issues/1334)) ([48b9bdd](https://github.com/aws/aws-cdk/commit/48b9bdd)), closes [#1309](https://github.com/aws/aws-cdk/issues/1309)
* **aws-codecommit:** make the onCommit CloudWatch Event respect creating the branch as well. ([#1320](https://github.com/aws/aws-cdk/issues/1320)) ([cb1aed9](https://github.com/aws/aws-cdk/commit/cb1aed9))
* **aws-ecr:** add the `addToPipeline` method to IRepository. ([#1329](https://github.com/aws/aws-cdk/issues/1329)) ([c4a9b74](https://github.com/aws/aws-cdk/commit/c4a9b74))
* **aws-ecs:** fix healthCheckGracePeriodSeconds ([#1266](https://github.com/aws/aws-cdk/issues/1266)) ([3a89e21](https://github.com/aws/aws-cdk/commit/3a89e21)), closes [#1265](https://github.com/aws/aws-cdk/issues/1265)
* **aws-ecs:** set permissions for 'awslogs' log driver ([#1291](https://github.com/aws/aws-cdk/issues/1291)) ([f5bc59b](https://github.com/aws/aws-cdk/commit/f5bc59b)), closes [#1279](https://github.com/aws/aws-cdk/issues/1279)
* **aws-lambda:** code.asset now supports jar files, fixes [#1294](https://github.com/aws/aws-cdk/issues/1294) ([#1330](https://github.com/aws/aws-cdk/issues/1330)) ([3076070](https://github.com/aws/aws-cdk/commit/3076070))
* **aws-logs:** set default log retention of LogGroup to 731 instead of 730 ([#1344](https://github.com/aws/aws-cdk/issues/1344)) ([71dc09f](https://github.com/aws/aws-cdk/commit/71dc09f)), closes [#1343](https://github.com/aws/aws-cdk/issues/1343)


### Features

* **aws-cdk:** directory assets follow symlinks ([#1318](https://github.com/aws/aws-cdk/issues/1318)) ([2dfd593](https://github.com/aws/aws-cdk/commit/2dfd593)), closes [#731](https://github.com/aws/aws-cdk/issues/731)
* **aws-s3:** orphan buckets by default ([#1273](https://github.com/aws/aws-cdk/issues/1273)) ([2eb47ad](https://github.com/aws/aws-cdk/commit/2eb47ad)), closes [#1269](https://github.com/aws/aws-cdk/issues/1269)
* **core:** include jsii runtime version in analytics ([#1288](https://github.com/aws/aws-cdk/issues/1288)) ([f06de18](https://github.com/aws/aws-cdk/commit/f06de18)), closes [awslabs/jsii#325](https://github.com/aws/jsii/issues/325) [#1258](https://github.com/aws/aws-cdk/issues/1258) [awslabs/cdk-ops#127](https://github.com/awslabs/cdk-ops/issues/127)
* **core:** only include cdk libs in version reporting ([#1290](https://github.com/aws/aws-cdk/issues/1290)) ([6184423](https://github.com/aws/aws-cdk/commit/6184423)), closes [awslabs/cdk-ops#172](https://github.com/awslabs/cdk-ops/issues/172)
* **docs:** add design process description & basic style guide ([#1229](https://github.com/aws/aws-cdk/issues/1229)) ([5ffa7e2](https://github.com/aws/aws-cdk/commit/5ffa7e2)), closes [awslabs/cdk-ops#177](https://github.com/awslabs/cdk-ops/issues/177)
* **toolkit:** include toolkit version in AWS::CDK::Metadata ([#1287](https://github.com/aws/aws-cdk/issues/1287)) ([5004f50](https://github.com/aws/aws-cdk/commit/5004f50)), closes [#1286](https://github.com/aws/aws-cdk/issues/1286)


### BREAKING CHANGES

* **assert:** the behavior change of `haveResource` can cause tests to
fail. If allowing extension of the expected values is the intended behavior, you can
switch to the `haveResourceLike` matcher instead, which exposes the previous
behavior.



## [0.19.0](https://github.com/aws/aws-cdk/compare/v0.18.1...v0.19.0) (2018-12-04)


### Bug Fixes

* **aws-cdk:** add '-h' flag to bring up help ([#1274](https://github.com/aws/aws-cdk/issues/1274)) ([47dafb0](https://github.com/aws/aws-cdk/commit/47dafb0)), closes [#1259](https://github.com/aws/aws-cdk/issues/1259)
* **aws-cloudfront:** Allow to disable IPv6 on cloudfront distribution ([#1244](https://github.com/aws/aws-cdk/issues/1244)) ([10b7092](https://github.com/aws/aws-cdk/commit/10b7092)), closes [#1243](https://github.com/aws/aws-cdk/issues/1243)
* **aws-cloudtrail:** correct S3 bucket policy and dependency chain ([#1268](https://github.com/aws/aws-cdk/issues/1268)) ([0de2da8](https://github.com/aws/aws-cdk/commit/0de2da8)), closes [#1172](https://github.com/aws/aws-cdk/issues/1172)
* **aws-ec2:** fix code generation of IcmpPing ([#1235](https://github.com/aws/aws-cdk/issues/1235)) ([6a13a18](https://github.com/aws/aws-cdk/commit/6a13a18)), closes [#1231](https://github.com/aws/aws-cdk/issues/1231)
* **cdk:** don't use instanceof in App ([#1249](https://github.com/aws/aws-cdk/issues/1249)) ([a45c3bd](https://github.com/aws/aws-cdk/commit/a45c3bd)), closes [#1245](https://github.com/aws/aws-cdk/issues/1245)
* **cdk init:** rename 'dotnet' to 'csharp' ([#1210](https://github.com/aws/aws-cdk/issues/1210)) ([da6a799](https://github.com/aws/aws-cdk/commit/da6a799)), closes [#1123](https://github.com/aws/aws-cdk/issues/1123)
* **cdk init:** update 'app' init template ([#1209](https://github.com/aws/aws-cdk/issues/1209)) ([0287109](https://github.com/aws/aws-cdk/commit/0287109)), closes [#1124](https://github.com/aws/aws-cdk/issues/1124) [#1128](https://github.com/aws/aws-cdk/issues/1128) [#1214](https://github.com/aws/aws-cdk/issues/1214)


### Features

* **aws-codebuild:** allow using docker image assets as build images ([#1233](https://github.com/aws/aws-cdk/issues/1233)) ([72413c1](https://github.com/aws/aws-cdk/commit/72413c1)), closes [#1232](https://github.com/aws/aws-cdk/issues/1232) [#1219](https://github.com/aws/aws-cdk/issues/1219)
* **aws-codebuild:** rename the Project methods for adding Actions to CodePipeline. ([#1254](https://github.com/aws/aws-cdk/issues/1254)) ([825e448](https://github.com/aws/aws-cdk/commit/825e448)), closes [#1211](https://github.com/aws/aws-cdk/issues/1211)
* **aws-ecr:** add an ECR Repository source CodePipeline Action. ([#1255](https://github.com/aws/aws-cdk/issues/1255)) ([01cc8a2](https://github.com/aws/aws-cdk/commit/01cc8a2))
* **app-delivery:** IAM policy for deploy stack (#1165) ([edc9a21](https://github.com/aws/aws-cdk/commit/edc9a21)), closes [#1165](https://github.com/aws/aws-cdk/issues/1165) [#1151](https://github.com/aws/aws-cdk/issues/1151)
* Update to CloudFormation spec v2.16.0 ([#1280](https://github.com/aws/aws-cdk/issues/1280)) ([9df5c54](https://github.com/aws/aws-cdk/commit/9df5c54))


### BREAKING CHANGES

* **aws-codebuild:** `ecr.RepositoryRef` has been replaced by `ecr.IRepository`, which
means that `RepositoryRef.import` is now `Repository.import`. Futhermore, the CDK
Toolkit must also be upgraded since the docker asset protocol was modified.
`IRepository.grantUseImage` was renamed to `IRepository.grantPull`.
* **aws-codebuild:** `addBuildToPipeline` was renamed to `addToPipeline`
and `addTestToPipeline` was renamed to `addPipelineToTest` in order to align
with naming conventions.
* `CloudFormationCapabilities.IAM` renamed to
`CloudFormation.AnonymousIAM` and `PipelineCloudFormationDeployActionProps.capabilities?: CloudFormationCapabilities[]` has been changed to
`PipelineCloudFormationDeployActionProps.capabilities?:
CloudFormationCapabilities` no longer an array.
`PipelineCloudFormationDeployActionProps.fullPermissions?:` has been
renamed to `PipelineCloudFormationDeployActionProps.adminPermissions:`
and is required instead of optional.



<a name="0.18.1"></a>
## [0.18.1](https://github.com/aws/aws-cdk/compare/v0.18.0...v0.18.1) (2018-11-21)


### Bug Fixes

* **aws-autoscaling:** Add hook ordering dependency ([#1218](https://github.com/aws/aws-cdk/issues/1218)) ([7e6ad84](https://github.com/aws/aws-cdk/commit/7e6ad84)), closes [#1212](https://github.com/aws/aws-cdk/issues/1212)
* **aws-elasticloadbalancingv2:** target group metrics ([#1226](https://github.com/aws/aws-cdk/issues/1226)) ([de488df](https://github.com/aws/aws-cdk/commit/de488df)), closes [#1213](https://github.com/aws/aws-cdk/issues/1213)


## [0.18.0](https://github.com/aws/aws-cdk/compare/v0.17.0...v0.18.0) (2018-11-19)

### Bug Fixes

- **aws-cdk:** make bootstrapping not require --app ([#1191](https://github.com/aws/aws-cdk/issues/1191)) ([c7b1004](https://github.com/aws/aws-cdk/commit/c7b1004)), closes [#1188](https://github.com/aws/aws-cdk/issues/1188)
- **aws-ecs:** don't emit DesiredCount in daemon mode ([#1199](https://github.com/aws/aws-cdk/issues/1199)) ([7908de4](https://github.com/aws/aws-cdk/commit/7908de4)), closes [#1197](https://github.com/aws/aws-cdk/issues/1197)
- **aws-elasticloadbalancingv2:** 'targetType' on groups ([#1174](https://github.com/aws/aws-cdk/issues/1174)) ([b4293f2](https://github.com/aws/aws-cdk/commit/b4293f2))
- **aws-elasticloadbalancingv2:** fix rule dependency ([#1170](https://github.com/aws/aws-cdk/issues/1170)) ([aeb0f4f](https://github.com/aws/aws-cdk/commit/aeb0f4f)), closes [#1160](https://github.com/aws/aws-cdk/issues/1160)
- **deps:** upgrade jsii to 0.7.11 ([#1202](https://github.com/aws/aws-cdk/issues/1202)) ([f3a5f12](https://github.com/aws/aws-cdk/commit/f3a5f12))
- **docs:** fix "getting started" documentation ([#1045](https://github.com/aws/aws-cdk/issues/1045)) ([29b611f](https://github.com/aws/aws-cdk/commit/29b611f))
- **toolkit:** typo in `cdk bootstrap` output ([#1176](https://github.com/aws/aws-cdk/issues/1176)) ([b83fe85](https://github.com/aws/aws-cdk/commit/b83fe85))

### Features

- **aws-autoscaling:** add instance AutoScaling ([#1134](https://github.com/aws/aws-cdk/issues/1134)) ([d397dd7](https://github.com/aws/aws-cdk/commit/d397dd7)), closes [#1042](https://github.com/aws/aws-cdk/issues/1042) [#1113](https://github.com/aws/aws-cdk/issues/1113)
- **aws-codebuild:** add support for additional sources and artifact in Projects. ([#1110](https://github.com/aws/aws-cdk/issues/1110)) ([d911b08](https://github.com/aws/aws-cdk/commit/d911b08))
- **aws-ec2:** add VPC context provider ([#1168](https://github.com/aws/aws-cdk/issues/1168)) ([e8380fa](https://github.com/aws/aws-cdk/commit/e8380fa)), closes [#1095](https://github.com/aws/aws-cdk/issues/1095)
- **aws-ecs:** expose service and target group on the LoadBalancedFargateService ([#1175](https://github.com/aws/aws-cdk/issues/1175)) ([e799699](https://github.com/aws/aws-cdk/commit/e799699))
- **aws-ecs:** instance autoscaling and drain hook ([#1192](https://github.com/aws/aws-cdk/issues/1192)) ([811462e](https://github.com/aws/aws-cdk/commit/811462e)), closes [#1162](https://github.com/aws/aws-cdk/issues/1162)
- **aws-ecs:** Support HTTPS in load balanced Fargate service ([#1115](https://github.com/aws/aws-cdk/issues/1115)) ([76a5cc7](https://github.com/aws/aws-cdk/commit/76a5cc7))
- **aws-ecs:** TLS support for Fargate service applet ([#1184](https://github.com/aws/aws-cdk/issues/1184)) ([18166ce](https://github.com/aws/aws-cdk/commit/18166ce))
- update to CloudFormation spec v2.13.0 ([#1203](https://github.com/aws/aws-cdk/issues/1203)) ([c531c84](https://github.com/aws/aws-cdk/commit/c531c84))
- **aws-elasticloadbalancingv2:** add metrics ([#1173](https://github.com/aws/aws-cdk/issues/1173)) ([68d481d](https://github.com/aws/aws-cdk/commit/68d481d)), closes [#853](https://github.com/aws/aws-cdk/issues/853)
- **docs:** getting started instructions for csharp ([#1185](https://github.com/aws/aws-cdk/issues/1185)) ([2915ac1](https://github.com/aws/aws-cdk/commit/2915ac1)), closes [#696](https://github.com/aws/aws-cdk/issues/696)
- **toolkit:** add 'cdk context' command ([#1169](https://github.com/aws/aws-cdk/issues/1169)) ([2db536e](https://github.com/aws/aws-cdk/commit/2db536e)), closes [#311](https://github.com/aws/aws-cdk/issues/311)
- **toolkit:** by default hide AWS::CDK::Metadata from "cdk diff" ([#1186](https://github.com/aws/aws-cdk/issues/1186)) ([ef0017a](https://github.com/aws/aws-cdk/commit/ef0017a)), closes [#465](https://github.com/aws/aws-cdk/issues/465)
- **toolkit:** improve diff user interface ([#1187](https://github.com/aws/aws-cdk/issues/1187)) ([9c3c5c7](https://github.com/aws/aws-cdk/commit/9c3c5c7)), closes [#1121](https://github.com/aws/aws-cdk/issues/1121) [#1120](https://github.com/aws/aws-cdk/issues/1120)
- **aws-codepipeline**: switch to webhooks instead of polling by default for the GitHub ([#1074](https://github.com/aws/aws-cdk/issues/1074))

### BREAKING CHANGES

- **aws-codebuild:** this changes the way CodeBuild Sources are constructed (we moved away from multiple parameters in the constructor, in favor of the more idiomatic property interface).
- **aws-elasticloadbalancingv2:** `targetGroup.listenerDependency()` has been renamed to `targetGroup.loadBalancerDependency()`.

## [0.17.0](https://github.com/aws/aws-cdk/compare/v0.16.0...v0.17.0) (2018-11-14)

### Bug Fixes

- **aws-ecs**: remove DockerHub constructor class ([#1153](https://github.com/aws/aws-cdk/issues/1153)) ([ed14638](https://github.com/aws/aws-cdk/commit/ed14638))
- **aws-ec2:** add dependency on gateway attachment for public routes ([#1142](https://github.com/aws/aws-cdk/issues/1142)) ([15b255c](https://github.com/aws/aws-cdk/commit/15b255c)), closes [#1140](https://github.com/aws/aws-cdk/issues/1140)
- **s3-deployment:** bundle modules correctly ([#1154](https://github.com/aws/aws-cdk/issues/1154)) ([0cb1adf](https://github.com/aws/aws-cdk/commit/0cb1adf))

### Features

- **aws-codedeploy:** add an `addToPipeline` method to Deployment Group. ([#1166](https://github.com/aws/aws-cdk/issues/1166)) ([bdbeb7c](https://github.com/aws/aws-cdk/commit/bdbeb7c))
- **aws-codepipeline, aws-cloudformation:** support cross-region CloudFormation pipeline action ([#1152](https://github.com/aws/aws-cdk/issues/1152)) ([8e701ad](https://github.com/aws/aws-cdk/commit/8e701ad))
- **toolkit:** print available templates when --language is omitted ([#1159](https://github.com/aws/aws-cdk/issues/1159)) ([5726c45](https://github.com/aws/aws-cdk/commit/5726c45))

### BREAKING CHANGES

- **aws-ec2:** Method signature of VpcPublicSubnet.addDefaultIGWRouteEntry changed in order to add a dependency on gateway attachment completing before creating the public route to the gateway. Instead of passing a gateway ID string, pass in a cloudformation.InternetGatewayResource object and a cloudformation.VPCGatewayAttachmentResource object.
- If you were using `DockerHub.image()` to reference docker hub images, use `ContainerImage.fromDockerHub()` instead.

[]()

## [0.16.0](https://github.com/aws/aws-cdk/compare/v0.15.2...v0.16.0) (2018-11-12)

### Bug Fixes

- **aws-elasticloadbalancingv2:** listener dependency ([#1146](https://github.com/aws/aws-cdk/issues/1146)) ([e9d3d93](https://github.com/aws/aws-cdk/commit/e9d3d93)), closes [#1139](https://github.com/aws/aws-cdk/issues/1139)
- **aws-elasticloadbalancingv2:** unhealthy threshold ([#1145](https://github.com/aws/aws-cdk/issues/1145)) ([a70a50d](https://github.com/aws/aws-cdk/commit/a70a50d))

### Features

- **aws-codedeploy:** CodeDeploy Pipeline Action using the L2 DeploymentGroup Construct. ([#1085](https://github.com/aws/aws-cdk/issues/1085)) ([ce999b6](https://github.com/aws/aws-cdk/commit/ce999b6))
- **aws-route53:** route53 Alias record support ([#1131](https://github.com/aws/aws-cdk/issues/1131)) ([72f0124](https://github.com/aws/aws-cdk/commit/72f0124))
- **cdk:** allow Tokens to be encoded as lists ([#1144](https://github.com/aws/aws-cdk/issues/1144)) ([cd7947c](https://github.com/aws/aws-cdk/commit/cd7947c)), closes [#744](https://github.com/aws/aws-cdk/issues/744)

### BREAKING CHANGES

- **aws-codedeploy:** this changes the API of the CodeDeploy Pipeline Action to take the DeploymentGroup AWS Construct as an argument instead of the names of the Application and Deployment Group.

[]()

## [0.15.2](https://github.com/aws/aws-cdk/compare/v0.15.1...v0.15.2) (2018-11-08)

### Bug Fixes

- correctly emit quoted YAML for account numbers ([#1105](https://github.com/aws/aws-cdk/issues/1105)) ([b4d9155](https://github.com/aws/aws-cdk/commit/b4d9155)), closes [#1100](https://github.com/aws/aws-cdk/issues/1100) [#1098](https://github.com/aws/aws-cdk/issues/1098)
- **aws-ecs:** fix use of published NPM package with TypeScript ([#1117](https://github.com/aws/aws-cdk/issues/1117)) ([ebfb522](https://github.com/aws/aws-cdk/commit/ebfb522))

### Features

- **aws-ecs:** Add desired count to LoadBalanced[Fargate|EC2]Service ([#1111](https://github.com/aws/aws-cdk/issues/1111)) ([cafcc11](https://github.com/aws/aws-cdk/commit/cafcc11))

[]()

## [0.15.1](https://github.com/aws/aws-cdk/compare/v0.15.0...v0.15.1) (2018-11-06)

### Bug Fixes

- Update peer dependencies to refer to correct version so NPM installs don't fail.
- Switch back to `js-yaml` as `yaml` was emitting unquoted single colons as list elements.

[]()

## [0.15.0](https://github.com/aws/aws-cdk/compare/v0.14.1...v0.15.0) (2018-11-06)

### Bug Fixes

- **aws-autoscaling:** allow minSize to be set to 0 ([#1015](https://github.com/aws/aws-cdk/issues/1015)) ([67f7fa1](https://github.com/aws/aws-cdk/commit/67f7fa1))
- **aws-codebuild:** correctly pass the timeout property to CFN when creating a Project. ([#1071](https://github.com/aws/aws-cdk/issues/1071)) ([b1322bb](https://github.com/aws/aws-cdk/commit/b1322bb))
- **aws-codebuild:** correctly set S3 path when using it as artifact. ([#1072](https://github.com/aws/aws-cdk/issues/1072)) ([f32cba9](https://github.com/aws/aws-cdk/commit/f32cba9))
- **aws-kms:** add output value when exporting an encryption key ([#1036](https://github.com/aws/aws-cdk/issues/1036)) ([cb490be](https://github.com/aws/aws-cdk/commit/cb490be))
- Switch from `js-yaml` to `yaml` ([#1092](https://github.com/aws/aws-cdk/issues/1092)) ([0b132b5](https://github.com/aws/aws-cdk/commit/0b132b5))

### Features

- don't upload the same asset multiple times ([#1011](https://github.com/aws/aws-cdk/issues/1011)) ([35937b6](https://github.com/aws/aws-cdk/commit/35937b6)), closes [#989](https://github.com/aws/aws-cdk/issues/989)
- **app-delivery:** CI/CD for CDK Stacks ([#1022](https://github.com/aws/aws-cdk/issues/1022)) ([f2fe4e9](https://github.com/aws/aws-cdk/commit/f2fe4e9))
- add a new construct library for ECS ([#1058](https://github.com/aws/aws-cdk/issues/1058)) ([ae03ddb](https://github.com/aws/aws-cdk/commit/ae03ddb))
- **applets:** integrate into toolkit ([#1039](https://github.com/aws/aws-cdk/issues/1039)) ([fdabe95](https://github.com/aws/aws-cdk/commit/fdabe95)), closes [#849](https://github.com/aws/aws-cdk/issues/849) [#342](https://github.com/aws/aws-cdk/issues/342) [#291](https://github.com/aws/aws-cdk/issues/291)
- **aws-codecommit:** use CloudWatch Events instead of polling by default in the CodePipeline Action. ([#1026](https://github.com/aws/aws-cdk/issues/1026)) ([d09d30c](https://github.com/aws/aws-cdk/commit/d09d30c))
- **aws-dynamodb:** allow specifying partition/sort keys in props ([#1054](https://github.com/aws/aws-cdk/issues/1054)) ([ec87331](https://github.com/aws/aws-cdk/commit/ec87331)), closes [#1051](https://github.com/aws/aws-cdk/issues/1051)
- **aws-ec2:** AmazonLinuxImage supports AL2 ([#1081](https://github.com/aws/aws-cdk/issues/1081)) ([97b57a5](https://github.com/aws/aws-cdk/commit/97b57a5)), closes [#1062](https://github.com/aws/aws-cdk/issues/1062)
- **aws-lambda:** high level API for event sources ([#1063](https://github.com/aws/aws-cdk/issues/1063)) ([1be3442](https://github.com/aws/aws-cdk/commit/1be3442))
- **aws-sqs:** improvements to IAM grants API ([#1052](https://github.com/aws/aws-cdk/issues/1052)) ([6f2475e](https://github.com/aws/aws-cdk/commit/6f2475e))
- **codepipeline/cfn:** Use fewer statements for pipeline permissions ([#1009](https://github.com/aws/aws-cdk/issues/1009)) ([8f4c2ab](https://github.com/aws/aws-cdk/commit/8f4c2ab))
- **pkglint:** Make sure .snk files are ignored ([#1049](https://github.com/aws/aws-cdk/issues/1049)) ([53c8d76](https://github.com/aws/aws-cdk/commit/53c8d76)), closes [#643](https://github.com/aws/aws-cdk/issues/643)
- **toolkit:** deployment ui improvements ([#1067](https://github.com/aws/aws-cdk/issues/1067)) ([c832eaf](https://github.com/aws/aws-cdk/commit/c832eaf))
- Update to CloudFormation resource specification v2.11.0

### BREAKING CHANGES

- The ec2.Connections object has been changed to be able to manage multiple security groups. The relevant property has been changed from `securityGroup` to `securityGroups` (an array of security group objects).
- **aws-codecommit:** this modifies the default behavior of the CodeCommit Action. It also changes the internal API contract between the aws-codepipeline-api module and the CodePipeline Actions in the service packages.
- **applets:** The applet schema has changed to allow Multiple applets can be define in one file by structuring the files like this:
- **applets:** The applet schema has changed to allow definition of multiple applets in the same file.

The schema now looks like this:

```
applets:
  MyApplet:
    type: ./my-applet-file
    properties:
      property1: value
      ...
```

By starting an applet specifier with npm://, applet modules can directly be referenced in NPM. You can include a version specifier (@1.2.3) to reference specific versions.

- **aws-sqs:** `queue.grantReceiveMessages` has been removed. It is unlikely that this would be sufficient to interact with a queue. Alternatively you can use `queue.grantConsumeMessages` or `queue.grant('sqs:ReceiveMessage')` if there's a need to only grant this action.

[]()

## [0.14.1](https://github.com/aws/aws-cdk/compare/v0.14.0...v0.14.1) (2018-10-26)

### Bug Fixes

- **aws-cdk:** fix bug in SSM Parameter Provider ([#1023](https://github.com/aws/aws-cdk/issues/1023)) ([6e6aa1d](https://github.com/aws/aws-cdk/commit/6e6aa1d))

[]()

## [0.14.0](https://github.com/aws/aws-cdk/compare/v0.13.0...v0.14.0) (2018-10-26)

**IMPORTANT NOTE**: when upgrading to this version of the CDK framework, you must also upgrade your installation the CDK Toolkit to the matching version:

```shell
$ npm i -g aws-cdk
$ cdk --version
0.14.0 (build ...)
```

### Bug Fixes

- remove CloudFormation property renames ([#973](https://github.com/aws/aws-cdk/issues/973)) ([3f86603](https://github.com/aws/aws-cdk/commit/3f86603)), closes [#852](https://github.com/aws/aws-cdk/issues/852)
- **aws-ec2:** fix retention of all egress traffic rule ([#998](https://github.com/aws/aws-cdk/issues/998)) ([b9d5b43](https://github.com/aws/aws-cdk/commit/b9d5b43)), closes [#987](https://github.com/aws/aws-cdk/issues/987)
- **aws-s3-deployment:** avoid deletion during update using physical ids ([#1006](https://github.com/aws/aws-cdk/issues/1006)) ([bca99c6](https://github.com/aws/aws-cdk/commit/bca99c6)), closes [#981](https://github.com/aws/aws-cdk/issues/981) [#981](https://github.com/aws/aws-cdk/issues/981)
- **cloudformation-diff:** ignore changes to DependsOn ([#1005](https://github.com/aws/aws-cdk/issues/1005)) ([3605f9c](https://github.com/aws/aws-cdk/commit/3605f9c)), closes [#274](https://github.com/aws/aws-cdk/issues/274)
- **cloudformation-diff:** track replacements ([#1003](https://github.com/aws/aws-cdk/issues/1003)) ([a83ac5f](https://github.com/aws/aws-cdk/commit/a83ac5f)), closes [#1001](https://github.com/aws/aws-cdk/issues/1001)
- **docs:** fix EC2 readme for "natgatway" configuration ([#994](https://github.com/aws/aws-cdk/issues/994)) ([0b1e7cc](https://github.com/aws/aws-cdk/commit/0b1e7cc))
- **docs:** updates to contribution guide ([#997](https://github.com/aws/aws-cdk/issues/997)) ([b42e742](https://github.com/aws/aws-cdk/commit/b42e742))
- **iam:** Merge multiple principals correctly ([#983](https://github.com/aws/aws-cdk/issues/983)) ([3fc5c8c](https://github.com/aws/aws-cdk/commit/3fc5c8c)), closes [#924](https://github.com/aws/aws-cdk/issues/924) [#916](https://github.com/aws/aws-cdk/issues/916) [#958](https://github.com/aws/aws-cdk/issues/958)

### Features

- add construct library for Application AutoScaling ([#933](https://github.com/aws/aws-cdk/issues/933)) ([7861c6f](https://github.com/aws/aws-cdk/commit/7861c6f)), closes [#856](https://github.com/aws/aws-cdk/issues/856) [#861](https://github.com/aws/aws-cdk/issues/861) [#640](https://github.com/aws/aws-cdk/issues/640) [#644](https://github.com/aws/aws-cdk/issues/644)
- add HostedZone context provider ([#823](https://github.com/aws/aws-cdk/issues/823)) ([1626c37](https://github.com/aws/aws-cdk/commit/1626c37))
- **assert:** haveResource lists failing properties ([#1016](https://github.com/aws/aws-cdk/issues/1016)) ([7f6f3fd](https://github.com/aws/aws-cdk/commit/7f6f3fd))
- **aws-cdk:** add CDK app version negotiation ([#988](https://github.com/aws/aws-cdk/issues/988)) ([db4e718](https://github.com/aws/aws-cdk/commit/db4e718)), closes [#891](https://github.com/aws/aws-cdk/issues/891)
- **aws-codebuild:** Introduce a CodePipeline test Action. ([#873](https://github.com/aws/aws-cdk/issues/873)) ([770f9aa](https://github.com/aws/aws-cdk/commit/770f9aa))
- **aws-sqs:** Add grantXxx() methods ([#1004](https://github.com/aws/aws-cdk/issues/1004)) ([8c90350](https://github.com/aws/aws-cdk/commit/8c90350))
- **core:** Pre-concatenate Fn::Join ([#967](https://github.com/aws/aws-cdk/issues/967)) ([33c32a8](https://github.com/aws/aws-cdk/commit/33c32a8)), closes [#916](https://github.com/aws/aws-cdk/issues/916) [#958](https://github.com/aws/aws-cdk/issues/958)

### BREAKING CHANGES

- DynamoDB AutoScaling: Instead of `addReadAutoScaling()`, call `autoScaleReadCapacity()`, and similar for write scaling.
- CloudFormation resource usage: If you use L1s, you may need to change some `XxxName` properties back into `Name`. These will match the CloudFormation property names.
- You must use the matching `aws-cdk` toolkit when upgrading to this version, or context providers will cease to work. All existing cached context values in `cdk.json` will be invalidated and refreshed.

[]()

## [0.13.0](https://github.com/aws/aws-cdk/compare/v0.12.0...v0.13.0) (2018-10-19)

### Highlights

- **A new construct library for AWS Step Functions** ([docs](https://github.com/aws/aws-cdk/blob/master/packages/%40aws-cdk/aws-stepfunctions/README.md)). The library provides rich APIs for modeling state machines by exposing a programmatic interface for [Amazon State Language](https://docs.aws.amazon.com/step-functions/latest/dg/concepts-amazon-states-language.html).
- **A new construct library for Amazon S3 bucket deployments** ([docs](https://github.com/aws/aws-cdk/blob/master/packages/%40aws-cdk/aws-s3-deployment/README.md)). You can use now automatically populate an S3 Bucket from a .zip file or a local directory. This is a building block for end-to-end support for static websites in the AWS CDK.

### Bug Fixes

- **aws-apigateway:** make LambdaRestApi proxy by default ([#963](https://github.com/aws/aws-cdk/issues/963)) ([a5f5e2c](https://github.com/aws/aws-cdk/commit/a5f5e2c)), closes [#959](https://github.com/aws/aws-cdk/issues/959)
- **aws-cdk:** Allow use of assumed roles behind a proxy ([#898](https://github.com/aws/aws-cdk/issues/898)) ([f2b1048](https://github.com/aws/aws-cdk/commit/f2b1048))
- **aws-cdk:** Auto-delete stacks that failed creating before new attempt ([#917](https://github.com/aws/aws-cdk/issues/917)) ([2af8309](https://github.com/aws/aws-cdk/commit/2af8309))
- **aws-cloudfront:** expose distributionId ([#938](https://github.com/aws/aws-cdk/issues/938)) ([f58d98c](https://github.com/aws/aws-cdk/commit/f58d98c))
- **aws-dynamodb:** don't emit empty array properties ([#909](https://github.com/aws/aws-cdk/issues/909)) ([841975a](https://github.com/aws/aws-cdk/commit/841975a))
- **docs:** use ..code to display file structure in "writing constructs" ([#935](https://github.com/aws/aws-cdk/issues/935)) ([b743362](https://github.com/aws/aws-cdk/commit/b743362))

### Features

- **assets:** isZipArchive indicates if this is a zip asset ([#944](https://github.com/aws/aws-cdk/issues/944)) ([65190f9](https://github.com/aws/aws-cdk/commit/65190f9))
- **aws-cdk:** deploy supports CloudFormation Role ([#940](https://github.com/aws/aws-cdk/issues/940)) ([393be6f](https://github.com/aws/aws-cdk/commit/393be6f)), closes [#735](https://github.com/aws/aws-cdk/issues/735)
- **aws-cloudformation:** allow specifying custom resource type ([#943](https://github.com/aws/aws-cdk/issues/943)) ([9de3a84](https://github.com/aws/aws-cdk/commit/9de3a84))
- **aws-cloudformation:** correctly handle the templateConfiguration property in the CreateUpdateStack Pipeline Action. ([#923](https://github.com/aws/aws-cdk/issues/923)) ([d251a46](https://github.com/aws/aws-cdk/commit/d251a46))
- **aws-cloudfront:** add support for "webAclId" ([#969](https://github.com/aws/aws-cdk/issues/969)) ([3ec9d76](https://github.com/aws/aws-cdk/commit/3ec9d76))
- **aws-codedeploy:** add auto rollback configuration to server Deployment Group. ([#925](https://github.com/aws/aws-cdk/issues/925)) ([7ee91cf](https://github.com/aws/aws-cdk/commit/7ee91cf))
- **aws-codedeploy:** add instance tag filter support for server Deployment Groups. ([#824](https://github.com/aws/aws-cdk/issues/824)) ([e6e8c51](https://github.com/aws/aws-cdk/commit/e6e8c51))
- **aws-codedeploy:** add support for setting CloudWatch alarms on a server Deployment Group. ([#926](https://github.com/aws/aws-cdk/issues/926)) ([27b26b1](https://github.com/aws/aws-cdk/commit/27b26b1))
- add support for Step Functions ([#827](https://github.com/aws/aws-cdk/issues/827)) ([81b533c](https://github.com/aws/aws-cdk/commit/81b533c))
- **aws-lambda:** add grantInvoke() method ([#962](https://github.com/aws/aws-cdk/issues/962)) ([1ee8135](https://github.com/aws/aws-cdk/commit/1ee8135)), closes [#961](https://github.com/aws/aws-cdk/issues/961)
- **aws-lambda:** improvements to the code and runtime APIs ([#945](https://github.com/aws/aws-cdk/issues/945)) ([36f29b6](https://github.com/aws/aws-cdk/commit/36f29b6)), closes [#902](https://github.com/aws/aws-cdk/issues/902) [#188](https://github.com/aws/aws-cdk/issues/188) [#947](https://github.com/aws/aws-cdk/issues/947) [#947](https://github.com/aws/aws-cdk/issues/947) [#664](https://github.com/aws/aws-cdk/issues/664)
- **aws-logs:** extractMetric() returns Metric object ([#939](https://github.com/aws/aws-cdk/issues/939)) ([5558fff](https://github.com/aws/aws-cdk/commit/5558fff)), closes [#850](https://github.com/aws/aws-cdk/issues/850)
- **aws-s3:** initial support for website hosting ([#946](https://github.com/aws/aws-cdk/issues/946)) ([2d3661c](https://github.com/aws/aws-cdk/commit/2d3661c))
- **aws-s3-deployment:** bucket deployments ([#971](https://github.com/aws/aws-cdk/issues/971)) ([84d6876](https://github.com/aws/aws-cdk/commit/84d6876)), closes [#952](https://github.com/aws/aws-cdk/issues/952) [#953](https://github.com/aws/aws-cdk/issues/953) [#954](https://github.com/aws/aws-cdk/issues/954)
- **docs:** added link to CloudFormation concepts ([#934](https://github.com/aws/aws-cdk/issues/934)) ([666bbba](https://github.com/aws/aws-cdk/commit/666bbba))

### BREAKING CHANGES

- **aws-apigateway:** specifying a path no longer works. If you used to provide a '/', remove it. Otherwise, you will have to supply `proxy: false` and construct more complex resource paths yourself.
- **aws-lambda:** The construct `lambda.InlineJavaScriptLambda` is no longer supported. Use `lambda.Code.inline` instead; `lambda.Runtime.NodeJS43Edge` runtime is removed. CloudFront docs [stipulate](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/lambda-requirements-limits.html#lambda-requirements-lambda-function-configuration) that you should use node6.10 or node8.10\. It is always possible to use any value by instantiating a `lambda.Runtime` object.

[]()

## [0.12.0](https://github.com/aws/aws-cdk/compare/v0.11.0...v0.12.0) (2018-10-12)

**IMPORTANT NOTE**: This release includes a [fix](https://github.com/aws/aws-cdk/pull/911) for a bug that would make the toolkit unusable for multi-stack applications. In order to benefit from this fix, a globally installed CDK toolkit must also be updated:

```shell
$ npm i -g aws-cdk
$ cdk --version
0.12.0 (build ...)
```

Like always, you will also need to update your project's library versions:

Language                    | Update?
--------------------------- | ------------------------------------------------------------------------------------------------------------------
JavaScript/TypeScript (npm) | [`npx npm-check-updates -u`](https://www.npmjs.com/package/npm-check-updates)
Java (maven)                | [`mvn versions:use-latest-versions`](https://www.mojohaus.org/versions-maven-plugin/use-latest-versions-mojo.html)
.NET (NuGet)                | [`nuget update`](https://docs.microsoft.com/en-us/nuget/tools/cli-ref-update)

### Bug Fixes

- **aws-codebuild:** allow passing oauth token to GitHubEnterpriseSource ([#908](https://github.com/aws/aws-cdk/issues/908)) ([c23da91](https://github.com/aws/aws-cdk/commit/c23da91))
- **toolkit:** multi-stack apps cannot be synthesized or deployed ([#911](https://github.com/aws/aws-cdk/issues/911)) ([5511076](https://github.com/aws/aws-cdk/commit/5511076)), closes [#868](https://github.com/aws/aws-cdk/issues/868) [#294](https://github.com/aws/aws-cdk/issues/294) [#910](https://github.com/aws/aws-cdk/issues/910)

### Features

- **aws-cloudformation:** add permission management to CreateUpdate and Delete Stack CodePipeline Actions. ([#880](https://github.com/aws/aws-cdk/issues/880)) ([8b3ae43](https://github.com/aws/aws-cdk/commit/8b3ae43))
- **aws-codepipeline:** make input and output artifact names optional when creating Actions. ([#845](https://github.com/aws/aws-cdk/issues/845)) ([3d91c93](https://github.com/aws/aws-cdk/commit/3d91c93))

### BREAKING CHANGES

- **aws-codepipeline:** this commit contains the following breaking changes:

  - Rename 'artifactName' in Action construction properties to 'outputArtifactName'
  - Rename the 'artifact' property of Actions to 'outputArtifact'
  - No longer allow adding output artifacts to Actions by instantiating the Artifact class
  - Rename Action#input/outputArtifacts properties to _input/_outputArtifacts

Previously, we always required customers to explicitly name the output artifacts the Actions used in the Pipeline, and to explicitly "wire together" the outputs of one Action as inputs to another. With this change, the CodePipeline Construct generates artifact names, if the customer didn't provide one explicitly, and tries to find the first available output artifact to use as input to a newly created Action that needs it, thus turning both the input and output artifacts from required to optional properties.

[]()

## [0.11.0](https://github.com/aws/aws-cdk/compare/v0.10.0...v0.11.0) (2018-10-11)

**IMPORTANT NOTE**: This release includes a [breaking change](https://github.com/aws/aws-cdk/issues/868) in the toolkit <=> app protocol. This means that in order to synthesize CDK apps that use this version, the globally installed CDK toolkit must also be updated:

```shell
$ npm i -g aws-cdk
$ cdk --version
0.11.0 (build ...)
```

Like always, you will also need to update your project's library versions:

Language                    | Update?
--------------------------- | ------------------------------------------------------------------------------------------------------------------
JavaScript/TypeScript (npm) | [`npx npm-check-updates -u`](https://www.npmjs.com/package/npm-check-updates)
Java (maven)                | [`mvn versions:use-latest-versions`](https://www.mojohaus.org/versions-maven-plugin/use-latest-versions-mojo.html)
.NET (NuGet)                | [`nuget update`](https://docs.microsoft.com/en-us/nuget/tools/cli-ref-update)

### Bug Fixes

- **aws-apigateway:** allow + in path parts ([#769](https://github.com/aws/aws-cdk/issues/769)) ([0c50d27](https://github.com/aws/aws-cdk/commit/0c50d27)), closes [#768](https://github.com/aws/aws-cdk/issues/768)
- **aws-cdk:** continue after exceptions in stack monitor ([#791](https://github.com/aws/aws-cdk/issues/791)) ([b0f3298](https://github.com/aws/aws-cdk/commit/b0f3298)), closes [#787](https://github.com/aws/aws-cdk/issues/787)
- **aws-cloudfront:** check for undefined and determining of the defaultRootObject prop is set or not ([#801](https://github.com/aws/aws-cdk/issues/801)) ([32a74c6](https://github.com/aws/aws-cdk/commit/32a74c6))
- **aws-cloudfront:** properly support loggingConfig ([#809](https://github.com/aws/aws-cdk/issues/809)) ([5512f70](https://github.com/aws/aws-cdk/commit/5512f70)), closes [#721](https://github.com/aws/aws-cdk/issues/721)
- **aws-codecommit:** typo in README ([#780](https://github.com/aws/aws-cdk/issues/780)) ([0e79c2d](https://github.com/aws/aws-cdk/commit/0e79c2d))
- **aws-ec2:** Add Burstable Generation 3 Instances ([#812](https://github.com/aws/aws-cdk/issues/812)) ([d36ee6d](https://github.com/aws/aws-cdk/commit/d36ee6d))
- **aws-ec2:** fix capitalization of "VPCEndpointType" to "VpcEndpointType" ([#789](https://github.com/aws/aws-cdk/issues/789)) ([7a8ee2c](https://github.com/aws/aws-cdk/commit/7a8ee2c)), closes [#765](https://github.com/aws/aws-cdk/issues/765)
- **aws-ec2:** fix typo in resource identifier ([#818](https://github.com/aws/aws-cdk/issues/818)) ([f529c80](https://github.com/aws/aws-cdk/commit/f529c80))
- **aws-elbv2:** fix load balancer registration ([#890](https://github.com/aws/aws-cdk/issues/890)) ([8cc9abe](https://github.com/aws/aws-cdk/commit/8cc9abe))
- **aws-s3:** properly export bucketDomainName ([#844](https://github.com/aws/aws-cdk/issues/844)) ([a65060d](https://github.com/aws/aws-cdk/commit/a65060d))
- **aws-sqs:** Queue.import() doesn't return a value ([#885](https://github.com/aws/aws-cdk/issues/885)) ([c592b7f](https://github.com/aws/aws-cdk/commit/c592b7f)), closes [#879](https://github.com/aws/aws-cdk/issues/879)
- **cdk:** fix TagManager to evaluate to undefined if no tags are included ([#882](https://github.com/aws/aws-cdk/issues/882)) ([477c827](https://github.com/aws/aws-cdk/commit/477c827))
- **cdk:** init templates were not upgraded to typescript ^3.0.0 ([#904](https://github.com/aws/aws-cdk/issues/904)) ([2cc7475](https://github.com/aws/aws-cdk/commit/2cc7475))
- **cdk:** jsx support conflicts with React usage ([#884](https://github.com/aws/aws-cdk/issues/884)) ([76d8031](https://github.com/aws/aws-cdk/commit/76d8031)), closes [#830](https://github.com/aws/aws-cdk/issues/830)
- **cfn2ts:** expect Token instead of CloudFormationToken ([#896](https://github.com/aws/aws-cdk/issues/896)) ([6eee1d2](https://github.com/aws/aws-cdk/commit/6eee1d2))
- **docs:** fix issue [#718](https://github.com/aws/aws-cdk/issues/718) (Aurora DB example) ([#783](https://github.com/aws/aws-cdk/issues/783)) ([016f3a8](https://github.com/aws/aws-cdk/commit/016f3a8))
- **docs:** update supported languages in README ([#819](https://github.com/aws/aws-cdk/issues/819), [#450](https://github.com/aws/aws-cdk/issues/450)) ([#820](https://github.com/aws/aws-cdk/issues/820)) ([ffac98c](https://github.com/aws/aws-cdk/commit/ffac98c))
- Correct heading level of CHANGELOG.md 0.10.0 ([40d9ef0](https://github.com/aws/aws-cdk/commit/40d9ef0))
- Emit valid YAML-1.1 ([#876](https://github.com/aws/aws-cdk/issues/876)) ([ff857ea](https://github.com/aws/aws-cdk/commit/ff857ea)), closes [#875](https://github.com/aws/aws-cdk/issues/875)
- **toolkit:** improve error message for large templates ([#900](https://github.com/aws/aws-cdk/issues/900)) ([a41f48f](https://github.com/aws/aws-cdk/commit/a41f48f)), closes [#34](https://github.com/aws/aws-cdk/issues/34)

### Code Refactoring

- **aws-iam:** move IAM classes cdk to aws-iam ([#866](https://github.com/aws/aws-cdk/issues/866)) ([d46a95b](https://github.com/aws/aws-cdk/commit/d46a95b)), closes [#196](https://github.com/aws/aws-cdk/issues/196)
- **util:** remove [@aws-cdk](https://github.com/aws-cdk)/util ([#745](https://github.com/aws/aws-cdk/issues/745)) ([10015cb](https://github.com/aws/aws-cdk/commit/10015cb)), closes [#709](https://github.com/aws/aws-cdk/issues/709)
- **framework:** remove app boilerplate and improvements to cx protocol ([#868](https://github.com/aws/aws-cdk/issues/868)) ([005beec](https://github.com/aws/aws-cdk/commit/005beec)), closes [#216](https://github.com/aws/aws-cdk/issues/216)

### Features

- **aws-apigateway:** "LambdaRestApi" and "addProxy" routes ([#867](https://github.com/aws/aws-cdk/issues/867)) ([905a95d](https://github.com/aws/aws-cdk/commit/905a95d))
- **aws-cdk:** add maven wrapper to java template ([#811](https://github.com/aws/aws-cdk/issues/811)) ([72aa872](https://github.com/aws/aws-cdk/commit/72aa872))
- **aws-cloudformation:** rename the CFN CodePipeline Actions. ([#771](https://github.com/aws/aws-cdk/issues/771)) ([007e7b4](https://github.com/aws/aws-cdk/commit/007e7b4))
- **aws-cloudformation:** update the ReadMe of the module to reflect the new Action names. ([#775](https://github.com/aws/aws-cdk/issues/775)) ([6c0e75b](https://github.com/aws/aws-cdk/commit/6c0e75b)), closes [#771](https://github.com/aws/aws-cdk/issues/771)
- **aws-cloudfront:** Support Security Policy ([#804](https://github.com/aws/aws-cdk/issues/804)) ([b39bf11](https://github.com/aws/aws-cdk/commit/b39bf11)), closes [#795](https://github.com/aws/aws-cdk/issues/795)
- **aws-codedeploy:** Add the auto-scaling groups property to ServerDeploymentGroup. ([#739](https://github.com/aws/aws-cdk/issues/739)) ([0b28886](https://github.com/aws/aws-cdk/commit/0b28886))
- **aws-codedeploy:** Deployment Configuration Construct. ([#653](https://github.com/aws/aws-cdk/issues/653)) ([e6b67ad](https://github.com/aws/aws-cdk/commit/e6b67ad))
- **aws-codedeploy:** support setting a load balancer on a Deployment Group. ([#786](https://github.com/aws/aws-cdk/issues/786)) ([e7af9f5](https://github.com/aws/aws-cdk/commit/e7af9f5))
- **aws-codepipeline:** allow specifying the runOrder property when creating Actions. ([#776](https://github.com/aws/aws-cdk/issues/776)) ([d146c8d](https://github.com/aws/aws-cdk/commit/d146c8d))
- **aws-codepipeline, aws-codecommit, aws-s3:** change the convention for naming the source Actions to XxxSourceAction. ([#753](https://github.com/aws/aws-cdk/issues/753)) ([9c3ce7f](https://github.com/aws/aws-cdk/commit/9c3ce7f))
- **aws-dynamodb:** IAM grants support ([#870](https://github.com/aws/aws-cdk/issues/870)) ([c5a4200](https://github.com/aws/aws-cdk/commit/c5a4200))
- **aws-dynamodb:** support Global Secondary Indexes ([#760](https://github.com/aws/aws-cdk/issues/760)) ([3601440](https://github.com/aws/aws-cdk/commit/3601440))
- **aws-dynamodb:** tags support ([#814](https://github.com/aws/aws-cdk/issues/814)) ([924c84e](https://github.com/aws/aws-cdk/commit/924c84e))
- **aws-dynamodB:** support Local Secondary Indexes ([#825](https://github.com/aws/aws-cdk/issues/825)) ([3175af3](https://github.com/aws/aws-cdk/commit/3175af3))
- **aws-ec2:** add support for ICMP protocol's classification Types & Codes to SecurityGroupRule ([#893](https://github.com/aws/aws-cdk/issues/893)) ([85bd3c0](https://github.com/aws/aws-cdk/commit/85bd3c0))
- **aws-ec2:** allow configuring subnets for NAT gateway ([#874](https://github.com/aws/aws-cdk/issues/874)) ([8ec761c](https://github.com/aws/aws-cdk/commit/8ec761c))
- **aws-ec2:** support UDP port ranges in SecurityGroups ([#835](https://github.com/aws/aws-cdk/issues/835)) ([b42ef90](https://github.com/aws/aws-cdk/commit/b42ef90))
- **aws-elasticloadbalancingv2:** support for ALB/NLB ([#750](https://github.com/aws/aws-cdk/issues/750)) ([bd9ee01](https://github.com/aws/aws-cdk/commit/bd9ee01))
- **aws-s3:** support granting public access to objects ([#886](https://github.com/aws/aws-cdk/issues/886)) ([bdee191](https://github.com/aws/aws-cdk/commit/bdee191)), closes [#877](https://github.com/aws/aws-cdk/issues/877)
- **cdk:** Add support for UseOnlineResharding with UpdatePolicies ([#881](https://github.com/aws/aws-cdk/issues/881)) ([1f717e1](https://github.com/aws/aws-cdk/commit/1f717e1))
- **cdk:** configurable default SSM context provider ([#889](https://github.com/aws/aws-cdk/issues/889)) ([353412b](https://github.com/aws/aws-cdk/commit/353412b))
- **core:** resource overrides (escape hatch) ([#784](https://github.com/aws/aws-cdk/issues/784)) ([5054eef](https://github.com/aws/aws-cdk/commit/5054eef)), closes [#606](https://github.com/aws/aws-cdk/issues/606)
- **aws-codepipeline**: Manage IAM permissions for (some) CFN CodePipeline actions ([#843](https://github.com/aws/aws-cdk/issues/843)) ([4c69118](https://github.com/aws/aws-cdk/commit/4c69118))
- **toolkit:** Stop creating 'empty' stacks ([#779](https://github.com/aws/aws-cdk/issues/779)) ([1dddd8a](https://github.com/aws/aws-cdk/commit/1dddd8a))
- **aws-autoscaling, aws-ec2:** Tagging support for AutoScaling/SecurityGroup ([#766](https://github.com/aws/aws-cdk/issues/766)) ([3d48eb2](https://github.com/aws/aws-cdk/commit/3d48eb2))

### BREAKING CHANGES

- **framework:** The `cdk.App` constructor doesn't accept any arguments, and `app.run()` does not return a `string` anymore. All AWS CDK apps in all languages would need to be modified to adhere to the new API of the `cdk.App` construct.

  Instead of:

  ```
  const app = new App(process.argv); // ERROR
  // add stacks
  process.stdout.write(app.run());   // ERROR
  ```

  The new usage is:

  ```
  const app = new App();
  // add stacks
  app.run();
  ```

- **framework:** The CDK is no longer shipped with built-in support for JSX. You can still use JSX but you will have to manually configure it.
- **aws-iam:** `PolicyDocument`, `PolicyStatement` and all `PolicyPrincipal` classes moved from the @aws-cdk/cdk module and into the @aws-cdk/aws-iam module.
- **aws-codepipeline-api**: `Artifact.subartifact` method of the CodePipeline API was renamed to `Artifact.atPath`.
- constructor signature of `TagManager` has changed. `initialTags` is now passed inside a props object.
- **util:** @aws-cdk/util is no longer available
- **aws-elasticloadbalancingv2:** Adds classes for modeling Application and Network Load Balancers. AutoScalingGroups now implement the interface that makes constructs a load balancing target. The breaking change is that Security Group rule identifiers have been changed in order to make adding rules more reliable. No code changes are necessary but existing deployments may experience unexpected changes.
- **aws-cloudformation:** this renames all CloudFormation Actions for CodePipeline to bring them in line with Actions defined in other service packages.
- **aws-codepipeline, aws-codecommit, aws-s3:** change the names of the source Actions from XxxSource to XxxSourceAction. This is to align them with the other Actions, like Build. Also, CodeBuild has the concept of Sources, so it makes sense to strongly differentiate between the two.

[]()

## [0.10.0](https://github.com/aws/aws-cdk/compare/v0.9.2...v0.10.0) (2018-09-27)

This release introduces a better way to "escape" L2 constructs in case of missing features by adding the ability to add arbitrary overrides for resource properties:

```typescript
const bucket = new s3.Bucket(this, 'L2Bucket');

// access L1
const bucketResource = bucket.findChild('Resource') as s3.cloudformation.BucketResource;

// strongly-typed overrides
bucketResource.propertyOverrides.bucketName = 'NewBucketName';

// weakly-typed overrides
bucketResource.addPropertyOverride('BucketName', 'NewerBucketName');
```

### Bug Fixes

- **aws-codecommit:** typo in README ([#780](https://github.com/aws/aws-cdk/issues/780)) ([0e79c2d](https://github.com/aws/aws-cdk/commit/0e79c2d))
- **aws-ec2:** fix capitalization of "VPCEndpointType" to "VpcEndpointType" ([#789](https://github.com/aws/aws-cdk/issues/789)) ([7a8ee2c](https://github.com/aws/aws-cdk/commit/7a8ee2c)), closes [#765](https://github.com/aws/aws-cdk/issues/765)
- **docs:** fix issue [#718](https://github.com/aws/aws-cdk/issues/718) (Aurora DB example) ([#783](https://github.com/aws/aws-cdk/issues/783)) ([016f3a8](https://github.com/aws/aws-cdk/commit/016f3a8))

### Code Refactoring

- **util:** remove [@aws-cdk](https://github.com/aws-cdk)/util ([#745](https://github.com/aws/aws-cdk/issues/745)) ([10015cb](https://github.com/aws/aws-cdk/commit/10015cb)), closes [#709](https://github.com/aws/aws-cdk/issues/709)

### Features

- **aws-cloudformation:** rename the CodePipeline actions ([#771](https://github.com/aws/aws-cdk/issues/771)) ([007e7b4](https://github.com/aws/aws-cdk/commit/007e7b4))
- **aws-cloudformation:** update the README of the module to reflect the new action names ([#775](https://github.com/aws/aws-cdk/issues/775)) ([6c0e75b](https://github.com/aws/aws-cdk/commit/6c0e75b)), closes [#771](https://github.com/aws/aws-cdk/issues/771)
- **aws-codedeploy:** add auto-scaling groups property to ServerDeploymentGroup ([#739](https://github.com/aws/aws-cdk/issues/739)) ([0b28886](https://github.com/aws/aws-cdk/commit/0b28886))
- **aws-codedeploy:** add deployment configuration construct ([#653](https://github.com/aws/aws-cdk/issues/653)) ([e6b67ad](https://github.com/aws/aws-cdk/commit/e6b67ad))
- **aws-codepipeline, aws-codecommit, aws-s3:** change the convention for naming the source Actions to XxxSourceAction ([#753](https://github.com/aws/aws-cdk/issues/753)) ([9c3ce7f](https://github.com/aws/aws-cdk/commit/9c3ce7f))
- **aws-elasticloadbalancingv2:** support for ALB/NLB ([#750](https://github.com/aws/aws-cdk/issues/750)) ([bd9ee01](https://github.com/aws/aws-cdk/commit/bd9ee01))
- tagging support for AutoScaling/SecurityGroup ([#766](https://github.com/aws/aws-cdk/issues/766)) ([3d48eb2](https://github.com/aws/aws-cdk/commit/3d48eb2))
- **core:** resource overrides (escape hatch) ([#784](https://github.com/aws/aws-cdk/issues/784)) ([5054eef](https://github.com/aws/aws-cdk/commit/5054eef)), closes [#606](https://github.com/aws/aws-cdk/issues/606)
- **toolkit:** stop creating 'empty' stacks ([#779](https://github.com/aws/aws-cdk/issues/779)) ([1dddd8a](https://github.com/aws/aws-cdk/commit/1dddd8a))

### BREAKING CHANGES

- **cdk**: the constructor signature of `TagManager` has changed. `initialTags` is now passed inside a props object.
- **util:** `@aws-cdk/util` is no longer available
- **aws-elasticloadbalancingv2:** adds classes for modeling Application and Network Load Balancers. AutoScalingGroups now implement the interface that makes constructs a load balancing target. The breaking change is that Security Group rule identifiers have been changed in order to make adding rules more reliable. No code changes are necessary but existing deployments may experience unexpected changes.
- **aws-cloudformation:** this renames all CloudFormation Actions for CodePipeline to bring them in line with Actions defined in other service packages.
- **aws-codepipeline, aws-codecommit, aws-s3:** change the names of the source Actions from XxxSource to XxxSourceAction. This is to align them with the other Actions, like Build. Also, CodeBuild has the concept of Sources, so it makes sense to strongly differentiate between the two.

### CloudFormation Changes

- **@aws-cdk/cfnspec**: Updated [CloudFormation resource specification] to `v2.8.0` ([@RomainMuller] in [#767](https://github.com/aws/aws-cdk/pull/767))

  - **New Construct Libraries**

    - `@aws-cdk/aws-amazonmq`
    - `@aws-cdk/aws-iot1click`

  - **New Resource Types**

    - AWS::IoT1Click::Device
    - AWS::IoT1Click::Placement
    - AWS::IoT1Click::Project

  - **Attribute Changes**

    - AWS::EC2::VPCEndpoint CreationTimestamp (**added**)
    - AWS::EC2::VPCEndpoint DnsEntries (**added**)
    - AWS::EC2::VPCEndpoint NetworkInterfaceIds (**added**)

  - **Property Changes**

    - AWS::ApiGateway::Deployment DeploymentCanarySettings (**added**)
    - AWS::ApiGateway::Method AuthorizationScopes (**added**)
    - AWS::ApiGateway::Stage AccessLogSetting (**added**)
    - AWS::ApiGateway::Stage CanarySetting (**added**)
    - AWS::AutoScaling::AutoScalingGroup LaunchTemplate (**added**)
    - AWS::CodeBuild::Project LogsConfig (**added**)
    - AWS::CodeBuild::Project SecondaryArtifacts (**added**)
    - AWS::CodeBuild::Project SecondarySources (**added**)
    - AWS::CodeDeploy::DeploymentGroup Ec2TagSet (**added**)
    - AWS::CodeDeploy::DeploymentGroup OnPremisesTagSet (**added**)
    - AWS::EC2::FlowLog LogDestination (**added**)
    - AWS::EC2::FlowLog LogDestinationType (**added**)
    - AWS::EC2::FlowLog DeliverLogsPermissionArn.Required (**changed**)

      - Old: true
      - New: false

    - AWS::EC2::FlowLog LogGroupName.Required (**changed**)

      - Old: true
      - New: false

    - AWS::EC2::VPCEndpoint IsPrivateDnsEnabled (**deleted**)
    - AWS::EC2::VPCEndpoint PrivateDnsEnabled (**added**)
    - AWS::EC2::VPCEndpoint RouteTableIds.DuplicatesAllowed (**added**)
    - AWS::EC2::VPCEndpoint SecurityGroupIds.DuplicatesAllowed (**added**)
    - AWS::EC2::VPCEndpoint SubnetIds.DuplicatesAllowed (**added**)
    - AWS::EC2::VPCEndpoint VPCEndpointType.UpdateType (**changed**)

      - Old: Mutable
      - New: Immutable

    - AWS::ECS::Service SchedulingStrategy (**added**)
    - AWS::ECS::Service ServiceRegistries.UpdateType (**changed**)

      - Old: Mutable
      - New: Immutable

    - AWS::ElastiCache::ReplicationGroup NodeGroupConfiguration.UpdateType (**changed**)

      - Old: Immutable
      - New: Conditional

    - AWS::ElastiCache::ReplicationGroup NumNodeGroups.UpdateType (**changed**)

      - Old: Immutable
      - New: Conditional

    - AWS::RDS::DBCluster EngineMode (**added**)
    - AWS::RDS::DBCluster ScalingConfiguration (**added**)
    - AWS::SageMaker::NotebookInstance LifecycleConfigName.UpdateType (**changed**)

      - Old: Immutable
      - New: Mutable

  - **Property Type Changes**

    - AWS::ApiGateway::Deployment.AccessLogSetting (**added**)
    - AWS::ApiGateway::Deployment.CanarySetting (**added**)
    - AWS::ApiGateway::Deployment.DeploymentCanarySettings (**added**)
    - AWS::ApiGateway::Stage.AccessLogSetting (**added**)
    - AWS::ApiGateway::Stage.CanarySetting (**added**)
    - AWS::AutoScaling::AutoScalingGroup.LaunchTemplateSpecification (**added**)
    - AWS::CodeBuild::Project.CloudWatchLogsConfig (**added**)
    - AWS::CodeBuild::Project.LogsConfig (**added**)
    - AWS::CodeBuild::Project.S3LogsConfig (**added**)
    - AWS::CodeDeploy::DeploymentGroup.EC2TagSet (**added**)
    - AWS::CodeDeploy::DeploymentGroup.EC2TagSetListObject (**added**)
    - AWS::CodeDeploy::DeploymentGroup.OnPremisesTagSet (**added**)
    - AWS::CodeDeploy::DeploymentGroup.OnPremisesTagSetListObject (**added**)
    - AWS::EC2::SpotFleet.ClassicLoadBalancer (**added**)
    - AWS::EC2::SpotFleet.ClassicLoadBalancersConfig (**added**)
    - AWS::EC2::SpotFleet.FleetLaunchTemplateSpecification (**added**)
    - AWS::EC2::SpotFleet.LaunchTemplateConfig (**added**)
    - AWS::EC2::SpotFleet.LaunchTemplateOverrides (**added**)
    - AWS::EC2::SpotFleet.LoadBalancersConfig (**added**)
    - AWS::EC2::SpotFleet.TargetGroup (**added**)
    - AWS::EC2::SpotFleet.TargetGroupsConfig (**added**)
    - AWS::ECS::TaskDefinition.DockerVolumeConfiguration (**added**)
    - AWS::ECS::TaskDefinition.RepositoryCredentials (**added**)
    - AWS::ECS::TaskDefinition.Tmpfs (**added**)
    - AWS::Events::Rule.SqsParameters (**added**)
    - AWS::RDS::DBCluster.ScalingConfiguration (**added**)
    - AWS::ApiGateway::Deployment.StageDescription AccessLogSetting (**added**)
    - AWS::ApiGateway::Deployment.StageDescription CanarySetting (**added**)
    - AWS::ApiGateway::Method.Integration ConnectionId (**added**)
    - AWS::ApiGateway::Method.Integration ConnectionType (**added**)
    - AWS::ApiGateway::Method.Integration TimeoutInMillis (**added**)
    - AWS::ApiGateway::UsagePlan.ApiStage Throttle (**added**)
    - AWS::CodeBuild::Project.Artifacts ArtifactIdentifier (**added**)
    - AWS::CodeBuild::Project.Source SourceIdentifier (**added**)
    - AWS::CodeBuild::Project.VpcConfig SecurityGroupIds.Required (**changed**)

      - Old: true
      - New: false

    - AWS::CodeBuild::Project.VpcConfig Subnets.Required (**changed**)

      - Old: true
      - New: false

    - AWS::CodeBuild::Project.VpcConfig VpcId.Required (**changed**)

      - Old: true
      - New: false

    - AWS::CodeDeploy::DeploymentGroup.EC2TagFilter Key.Documentation (**changed**)

      - Old: <http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codedeploy-deploymentgroup-ec2tagfilters.html#cfn-properties-codedeploy-deploymentgroup-ec2tagfilters-key>
      - New: <http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codedeploy-deploymentgroup-ec2tagfilter.html#cfn-codedeploy-deploymentgroup-ec2tagfilter-key>

    - AWS::CodeDeploy::DeploymentGroup.EC2TagFilter Type.Documentation (**changed**)

      - Old: <http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codedeploy-deploymentgroup-ec2tagfilters.html#cfn-properties-codedeploy-deploymentgroup-ec2tagfilters-type>
      - New: <http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codedeploy-deploymentgroup-ec2tagfilter.html#cfn-codedeploy-deploymentgroup-ec2tagfilter-type>

    - AWS::CodeDeploy::DeploymentGroup.EC2TagFilter Value.Documentation (**changed**)

      - Old: <http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codedeploy-deploymentgroup-ec2tagfilters.html#cfn-properties-codedeploy-deploymentgroup-ec2tagfilters-value>
      - New: <http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codedeploy-deploymentgroup-ec2tagfilter.html#cfn-codedeploy-deploymentgroup-ec2tagfilter-value>

    - AWS::CodeDeploy::DeploymentGroup.TagFilter Key.Documentation (**changed**)

      - Old: <http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codedeploy-deploymentgroup-onpremisesinstancetagfilters.html#cfn-properties-codedeploy-deploymentgroup-onpremisesinstancetagfilters-key>
      - New: <http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codedeploy-deploymentgroup-tagfilter.html#cfn-codedeploy-deploymentgroup-tagfilter-key>

    - AWS::CodeDeploy::DeploymentGroup.TagFilter Type.Documentation (**changed**)

      - Old: <http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codedeploy-deploymentgroup-onpremisesinstancetagfilters.html#cfn-properties-codedeploy-deploymentgroup-onpremisesinstancetagfilters-type>
      - New: <http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codedeploy-deploymentgroup-tagfilter.html#cfn-codedeploy-deploymentgroup-tagfilter-type>

    - AWS::CodeDeploy::DeploymentGroup.TagFilter Value.Documentation (**changed**)

      - Old: <http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codedeploy-deploymentgroup-onpremisesinstancetagfilters.html#cfn-properties-codedeploy-deploymentgroup-onpremisesinstancetagfilters-value>
      - New: <http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codedeploy-deploymentgroup-tagfilter.html#cfn-codedeploy-deploymentgroup-tagfilter-value>

    - AWS::EC2::SpotFleet.SpotFleetRequestConfigData InstanceInterruptionBehavior (**added**)
    - AWS::EC2::SpotFleet.SpotFleetRequestConfigData LaunchTemplateConfigs (**added**)
    - AWS::EC2::SpotFleet.SpotFleetRequestConfigData LoadBalancersConfig (**added**)
    - AWS::EC2::SpotFleet.SpotPlacement Tenancy (**added**)
    - AWS::ECS::Service.ServiceRegistry ContainerName (**added**)
    - AWS::ECS::Service.ServiceRegistry ContainerPort (**added**)
    - AWS::ECS::Service.ServiceRegistry Port.UpdateType (**changed**)

      - Old: Mutable
      - New: Immutable

    - AWS::ECS::Service.ServiceRegistry RegistryArn.UpdateType (**changed**)

      - Old: Mutable
      - New: Immutable

    - AWS::ECS::TaskDefinition.ContainerDefinition RepositoryCredentials (**added**)
    - AWS::ECS::TaskDefinition.LinuxParameters SharedMemorySize (**added**)
    - AWS::ECS::TaskDefinition.LinuxParameters Tmpfs (**added**)
    - AWS::ECS::TaskDefinition.Volume DockerVolumeConfiguration (**added**)
    - AWS::ElastiCache::ReplicationGroup.NodeGroupConfiguration NodeGroupId (**added**)
    - AWS::Events::Rule.Target SqsParameters (**added**)
    - AWS::RDS::OptionGroup.OptionConfiguration OptionSettings.DuplicatesAllowed (**added**)
    - AWS::RDS::OptionGroup.OptionConfiguration OptionSettings.ItemType (**added**)
    - AWS::RDS::OptionGroup.OptionConfiguration OptionSettings.Type (**changed**)

      - Old: OptionSetting
      - New: List

[]()

## [0.9.2](https://github.com/aws/aws-cdk/compare/v0.9.1...v0.9.2) (2018-09-20)

**NOTICE**: This release includes a framework-wide [**breaking change**](https://github.com/aws/aws-cdk/issues/712) which changes the type of all the string resource attributes across the framework. Instead of using strong-types that extend `cdk.Token` (such as `QueueArn`, `TopicName`, etc), we now represent all these attributes as normal `string`s, and codify the tokens into the string (using the feature introduced in [#168](https://github.com/aws/aws-cdk/issues/168)).

Furthermore, the `cdk.Arn` type has been removed. In order to format/parse ARNs, use the static methods on `cdk.ArnUtils`.

See motivation and discussion in [#695](https://github.com/aws/aws-cdk/issues/695).

### Breaking Changes

- **cfn2ts:** use stringified tokens for resource attributes instead of strong types ([#712](https://github.com/aws/aws-cdk/issues/712)) ([6508f78](https://github.com/aws/aws-cdk/commit/6508f78)), closes [#518](https://github.com/aws/aws-cdk/issues/518) [#695](https://github.com/aws/aws-cdk/issues/695) [#744](https://github.com/aws/aws-cdk/issues/744)
- **aws-dynamodb:** Attribute type for keys, changes the signature of the `addPartitionKey` and `addSortKey` methods to be consistent across the board. ([#720](https://github.com/aws/aws-cdk/issues/720)) ([e6cc189](https://github.com/aws/aws-cdk/commit/e6cc189))
- **aws-codebuild:** fix typo "priviledged" -> "privileged

### Bug Fixes

- **assets:** can't use multiple assets in the same stack ([#725](https://github.com/aws/aws-cdk/issues/725)) ([bba2e5b](https://github.com/aws/aws-cdk/commit/bba2e5b)), closes [#706](https://github.com/aws/aws-cdk/issues/706)
- **aws-codebuild:** typo in BuildEnvironment "priviledged" -> "privileged ([#734](https://github.com/aws/aws-cdk/issues/734)) ([72fec36](https://github.com/aws/aws-cdk/commit/72fec36))
- **aws-ecr:** fix addToResourcePolicy ([#737](https://github.com/aws/aws-cdk/issues/737)) ([eadbda5](https://github.com/aws/aws-cdk/commit/eadbda5))
- **aws-events:** ruleName can now be specified ([#726](https://github.com/aws/aws-cdk/issues/726)) ([a7bc5ee](https://github.com/aws/aws-cdk/commit/a7bc5ee)), closes [#708](https://github.com/aws/aws-cdk/issues/708)
- **aws-lambda:** jsii use no long requires 'sourceAccount' ([#728](https://github.com/aws/aws-cdk/issues/728)) ([9e7d311](https://github.com/aws/aws-cdk/commit/9e7d311)), closes [#714](https://github.com/aws/aws-cdk/issues/714)
- **aws-s3:** remove `policy` argument ([#730](https://github.com/aws/aws-cdk/issues/730)) ([a79190c](https://github.com/aws/aws-cdk/commit/a79190c)), closes [#672](https://github.com/aws/aws-cdk/issues/672)
- **cdk:** "cdk init" java template is broken ([#732](https://github.com/aws/aws-cdk/issues/732)) ([281c083](https://github.com/aws/aws-cdk/commit/281c083)), closes [#711](https://github.com/aws/aws-cdk/issues/711) [awslabs/jsii#233](https://github.com/aws/jsii/issues/233)

### Features

- **aws-apigateway:** new API Gateway Construct Library ([#665](https://github.com/aws/aws-cdk/issues/665)) ([b0f3857](https://github.com/aws/aws-cdk/commit/b0f3857))
- **aws-cdk:** detect presence of EC2 credentials ([#724](https://github.com/aws/aws-cdk/issues/724)) ([8e8c295](https://github.com/aws/aws-cdk/commit/8e8c295)), closes [#702](https://github.com/aws/aws-cdk/issues/702) [#130](https://github.com/aws/aws-cdk/issues/130)
- **aws-codepipeline:** make the Stage insertion API in CodePipeline more flexible ([#460](https://github.com/aws/aws-cdk/issues/460)) ([d182818](https://github.com/aws/aws-cdk/commit/d182818))
- **aws-codepipeline:** new "Pipeline#addStage" convenience method ([#647](https://github.com/aws/aws-cdk/issues/647)) ([25c9fa0](https://github.com/aws/aws-cdk/commit/25c9fa0))
- **aws-rds:** add support for parameter groups ([#729](https://github.com/aws/aws-cdk/issues/729)) ([2541508](https://github.com/aws/aws-cdk/commit/2541508)), closes [#719](https://github.com/aws/aws-cdk/issues/719)
- **docs:** add documentation for CDK toolkit plugings ([#733](https://github.com/aws/aws-cdk/issues/733)) ([965b918](https://github.com/aws/aws-cdk/commit/965b918))
- **dependencies:** upgrade to [jsii 0.7.6](https://github.com/aws/jsii/releases/tag/v0.7.6)

[]()

## [0.9.1](https://github.com/aws/aws-cdk/compare/v0.9.0...v0.9.1) (2018-09-13)

### Bug Fixes

- **aws-cdk:** Fix proxy support for account lookup ([#693](https://github.com/aws/aws-cdk/issues/693)) ([5468225](https://github.com/aws/aws-cdk/commit/5468225)), closes [#645](https://github.com/aws/aws-cdk/issues/645)

### Features

- **aws-ec2** BREAKING: Move LoadBalancer to aws-elasticloadbalancing package ([#705](https://github.com/aws/aws-cdk/issues/705)) ([4bd1cf2](https://github.com/aws/aws-cdk/commit/4bd1cf2a793c00a2aa3938b0dff6d4147690bd22))
- **aws-serverless** BREAKING: Rename @aws-cdk/aws-serverless to @aws-cdk/aws-sam ([#704](https://github.com/aws/aws-cdk/pull/704)) ([3a67d5d](https://github.com/aws/aws-cdk/commit/3a67d5d91673294024c68088ed0e9224b8ebd857))
- **aws-dynamodb:** Support DynamoDB TTL ([#691](https://github.com/aws/aws-cdk/issues/691)) ([35b6206](https://github.com/aws/aws-cdk/commit/35b6206))
- **aws-dynamodb:** Support DynamoDB PITR ([#701](https://github.com/aws/aws-cdk/issues/701)) ([7a4d7b7](https://github.com/aws/aws-cdk/commit/7a4d7b7))
- **aws-ecr:** Add support for ECR repositories ([#697](https://github.com/aws/aws-cdk/issues/697)) ([c6c09bf](https://github.com/aws/aws-cdk/commit/c6c09bf))
- **aws-lambda:** Add support for XRay Tracing ([#675](https://github.com/aws/aws-cdk/issues/675)) ([b4435cc](https://github.com/aws/aws-cdk/commit/b4435cc))
- **cfnspec:** Add DeploymentPreference Patch for SAM Spec ([#681](https://github.com/aws/aws-cdk/issues/681)) ([#681](https://github.com/aws/aws-cdk/issues/681)) ([f96c487](https://github.com/aws/aws-cdk/commit/f96c487))

## 0.9.0 -- 2018-09-10

The headliners of this release are **.NET support**, and a wealth of commits by external contributors who are stepping up to fix the CDK for their use cases! Thanks all for the effort put into this release!

### Features

- Add strongly-named .NET targets, and a `cdk init` template for C# projects ([@mpiroc] in [#617](https://github.com/aws/aws-cdk/pull/617), [#643](https://github.com/aws/aws-cdk/pull/643)).
- **@aws-cdk/aws-autoscaling**: Allow attaching additional security groups to Launch Configuration ([@moofish32] in [#636](https://github.com/aws/aws-cdk/pull/636)).
- **@aws-cdk/aws-autoscaling**: Support update and creation policies on AutoScalingGroups ([@rix0rrr] in [#595](https://github.com/aws/aws-cdk/pull/595)).
- **@aws-cdk/aws-codebuild**: Add support for running script from an asset ([@rix0rrr] in [#677](https://github.com/aws/aws-cdk/pull/677)).
- **@aws-cdk/aws-codebuild**: New method `addBuildToPipeline` on Project ([@skinny85] in [783dcb3](https://github.com/aws/aws-cdk/commit/783dcb3bd10058a25785d0964b37c181617a203a)).
- **@aws-cdk/aws-codecommit**: New method `addToPipeline` on Repository ([@skinny85] in [#616](https://github.com/aws/aws-cdk/pull/616)).
- **@aws-cdk/aws-codedeploy**: Add initial support for CodeDeploy ([@skinny85] in [#593](https://github.com/aws/aws-cdk/pull/593), [#641](https://github.com/aws/aws-cdk/pull/641)).
- **@aws-cdk/aws-dynamodb**: Add support for DynamoDB autoscaling ([@SeekerWing] in [#637](https://github.com/aws/aws-cdk/pull/637)).
- **@aws-cdk/aws-dynamodb**: Add support for DynamoDB streams ([@rhboyd] in [#633](https://github.com/aws/aws-cdk/pull/633)).
- **@aws-cdk/aws-dynamodb**: Add support for server-side encryption ([@jungseoklee] in [#684](https://github.com/aws/aws-cdk/pull/864)).
- **@aws-cdk/aws-ec2** (_**BREAKING**_): SecurityGroup can now be used as a Connectable [#582](https://github.com/aws/aws-cdk/pull/582)).
- **@aws-cdk/aws-ec2**: Add VPC tagging ([@moofish] in [#538](https://github.com/aws/aws-cdk/pull/538)).
- **@aws-cdk/aws-ec2**: Add support for `InstanceSize.Nano` ([@rix0rrr] in [#581](https://github.com/aws/aws-cdk/pull/581))
- **@aws-cdk/aws-lambda**: Add support for dead letter queues ([@SeekerWing] in [#663](https://github.com/aws/aws-cdk/pull/663)).
- **@aws-cdk/aws-lambda**: Add support for placing a Lambda in a VPC ([@rix0rrr] in [#598](https://github.com/aws/aws-cdk/pull/598)).
- **@aws-cdk/aws-logs**: Add `extractMetric()` helper function ([@rix0rrr] in [#676](https://github.com/aws/aws-cdk/pull/676)).
- **@aws-cdk/aws-rds**: Add support for Aurora PostreSQL/MySQL engines ([@cookejames] in [#586](https://github.com/aws/aws-cdk/pull/586))
- **@aws-cdk/aws-s3**: Additional grant methods for Buckets ([@eladb] in [#591](https://github.com/aws/aws-cdk/pull/591))
- **@aws-cdk/aws-s3**: New method `addToPipeline` on Bucket ([@skinny85] in [c8b7a49](https://github.com/aws/aws-cdk/commit/c8b7a494259ad08bbd722564591e320888e47c48)).
- **aws-cdk**: Add support for HTTP proxies ([@rix0rrr] in [#666](https://github.com/aws/aws-cdk/pull/666)).
- **aws-cdk**: Toolkit now shows failure reason if stack update fails ([@rix0rrr] in [#609](https://github.com/aws/aws-cdk/pull/609)).
- **cdk-build-tools**: Add support for running experiment JSII versions ([@RomainMuller] in [#649](https://github.com/aws/aws-cdk/pull/649)).

### Changes

- _**BREAKING**_: Generate classes and types for the CloudFormation resource `.ref` attributes ([@rix0rrr] in [#627](https://github.com/aws/aws-cdk/pull/627)).
- _**BREAKING**_: Make types accepted in Policy-related classes narrower (from `any` to `Arn`, for example) to reduce typing mistakes ([@rix0rrr] in [#629](https://github.com/aws/aws-cdk/pull/629)).
- **@aws-cdk/aws-codepipeline** (_**BREAKING**_): Align the CodePipeline APIs ([@skinny85] in [#492](https://github.com/aws/aws-cdk/pull/492), [#568](https://github.com/aws/aws-cdk/pull/568))
- **@aws-cdk/aws-ec2** (_**BREAKING**_): Move Fleet/AutoScalingGroup to its own package ([@rix0rrr] in [#608](https://github.com/aws/aws-cdk/pull/608)).
- **aws-cdk**: Simplify plugin protocol ([@RomainMuller] in [#646](https://github.com/aws/aws-cdk/pull/646)).

### Bug Fixes

- **@aws-cdk/aws-cloudfront**: Fix CloudFront behavior for ViewerProtocolPolicy ([@mindstorms6] in [#615](https://github.com/aws/aws-cdk/pull/615)).
- **@aws-cdk/aws-ec2**: VPC Placement now supports picking Isolated subnets ([@rix0rrr] in [#610](https://github.com/aws/aws-cdk/pull/610)).
- **@aws-cdk/aws-logs**: Add `export()/import()` capabilities ([@rix0rrr] in [#630](https://github.com/aws/aws-cdk/pull/630)).
- **@aws-cdk/aws-rds**: Fix a bug where a cluster with 1 instance could not be created ([@cookejames] in [#578](https://github.com/aws/aws-cdk/pull/578))
- **@aws-cdk/aws-s3**: Bucket notifications can now add dependencies, fixing creation order ([@eladb] in [#584](https://github.com/aws/aws-cdk/pull/584)).
- **@aws-cdk/aws-s3**: Remove useless bucket name validation ([@rix0rrr] in [#628](https://github.com/aws/aws-cdk/pull/628)).
- **@aws-cdk/aws-sqs**: Make `QueueRef.encryptionMasterKey` readonly ([@RomainMuller] in [#650](https://github.com/aws/aws-cdk/pull/650)).
- **assets**: S3 read permissions are granted on a prefix to fix lost permissions during asset update ([@rix0rrr] in [#510](https://github.com/aws/aws-cdk/pull/510)).
- **aws-cdk**: Remove bootstrapping error if multiple stacks are in the same environment ([@RomainMuller] in [#625](https://github.com/aws/aws-cdk/pull/625)).
- **aws-cdk**: Report and continue if git throws errors during `cdk init` ([@rix0rrr] in [#587](https://github.com/aws/aws-cdk/pull/587)).

### CloudFormation Changes

- **@aws-cdk/cfnspec**: Updated [CloudFormation resource specification] to `v2.6.0` ([@RomainMuller] in [#594](https://github.com/aws/aws-cdk/pull/594))

  - **New AWS Construct Library**

    - `@aws-cdk/aws-sagemaker` supports AWS::SageMaker resources

  - **New Resource Types**

    - AWS::AmazonMQ::Broker
    - AWS::AmazonMQ::Configuration
    - AWS::CodePipeline::Webhook
    - AWS::Config::AggregationAuthorization
    - AWS::Config::ConfigurationAggregator
    - AWS::EC2::VPCEndpointConnectionNotification
    - AWS::EC2::VPCEndpointServicePermissions
    - AWS::IAM::ServiceLinkedRole
    - AWS::SSM::ResourceDataSync
    - AWS::SageMaker::Endpoint
    - AWS::SageMaker::EndpointConfig
    - AWS::SageMaker::Model
    - AWS::SageMaker::NotebookInstance
    - AWS::SageMaker::NotebookInstanceLifecycleConfig

  - **Attribute Changes**

    - AWS::CodePipeline::Pipeline Version (**added**)

  - **Property Changes**

    - AWS::AppSync::DataSource HttpConfig (**added**)
    - AWS::DAX::Cluster SSESpecification (**added**)
    - AWS::DynamoDB::Table Stream (**added**)
    - AWS::DynamoDB::Table AutoScalingSupport (**added**)
    - AWS::EC2::VPCEndpoint IsPrivateDnsEnabled (**added**)
    - AWS::EC2::VPCEndpoint SecurityGroupIds (**added**)
    - AWS::EC2::VPCEndpoint SubnetIds (**added**)
    - AWS::EC2::VPCEndpoint VPCEndpointType (**added**)
    - AWS::EC2::VPCEndpoint RouteTableIds.DuplicatesAllowed (**deleted**)
    - AWS::EC2::VPCPeeringConnection PeerRegion (**added**)
    - AWS::EFS::FileSystem ProvisionedThroughputInMibps (**added**)
    - AWS::EFS::FileSystem ThroughputMode (**added**)
    - AWS::EMR::Cluster KerberosAttributes (**added**)
    - AWS::Glue::Classifier JsonClassifier (**added**)
    - AWS::Glue::Classifier XMLClassifier (**added**)
    - AWS::Glue::Crawler Configuration (**added**)
    - AWS::Lambda::Lambda DLQConfigurationSupport (**added**)
    - AWS::Neptune::DBInstance DBSubnetGroupName.UpdateType (**changed**)

      - Old: Mutable
      - New: Immutable

    - AWS::SNS::Subscription DeliveryPolicy (**added**)
    - AWS::SNS::Subscription FilterPolicy (**added**)
    - AWS::SNS::Subscription RawMessageDelivery (**added**)
    - AWS::SNS::Subscription Region (**added**)
    - AWS::SQS::Queue Tags (**added**)
    - AWS::ServiceDiscovery::Service HealthCheckCustomConfig (**added**)

  - **Property Type Changes**

    - AWS::AppSync::DataSource.HttpConfig (**added**)
    - AWS::DAX::Cluster.SSESpecification (**added**)
    - AWS::EMR::Cluster.KerberosAttributes (**added**)
    - AWS::Glue::Classifier.JsonClassifier (**added**)
    - AWS::Glue::Classifier.XMLClassifier (**added**)
    - AWS::ServiceDiscovery::Service.HealthCheckCustomConfig (**added**)
    - AWS::CloudFront::Distribution.CacheBehavior FieldLevelEncryptionId (**added**)
    - AWS::CloudFront::Distribution.DefaultCacheBehavior FieldLevelEncryptionId (**added**)
    - AWS::CodeBuild::Project.Artifacts EncryptionDisabled (**added**)
    - AWS::CodeBuild::Project.Artifacts OverrideArtifactName (**added**)
    - AWS::CodeBuild::Project.Environment Certificate (**added**)
    - AWS::CodeBuild::Project.Source ReportBuildStatus (**added**)
    - AWS::ServiceDiscovery::Service.DnsConfig RoutingPolicy (**added**)
    - AWS::WAF::WebACL.ActivatedRule Action.Required (**changed**)

      - Old: true
      - New: false

- **@aws-cdk/cfnspec**: Updated Serverless Application Model (SAM) Resource Specification ([@RomainMuller] in [#594](https://github.com/aws/aws-cdk/pull/594))

  - **Property Changes**

    - AWS::Serverless::Api MethodSettings (**added**)

  - **Property Type Changes**

    - AWS::Serverless::Function.SQSEvent (**added**)
    - AWS::Serverless::Function.EventSource Properties.Types (**changed**)

      - Added SQSEvent

## 0.8.2 - 2018-08-15

### Features

- **@aws-cdk/cdk**: Tokens can now be transparently embedded into strings and encoded into JSON without losing their semantics. This makes it possible to treat late-bound (deploy-time) values as if they were regular strings ([@rix0rrr] in [#518](https://github.com/aws/aws-cdk/pull/518)).
- **@aws-cdk/aws-s3**: add support for bucket notifications to Lambda, SNS, and SQS targets ([@eladb] in [#201](https://github.com/aws/aws-cdk/pull/201), [#560](https://github.com/aws/aws-cdk/pull/560), [#561](https://github.com/aws/aws-cdk/pull/561), [#564](https://github.com/aws/aws-cdk/pull/564))
- **@aws-cdk/cdk**: non-alphanumeric characters can now be used as construct identifiers ([@eladb] in [#556](https://github.com/aws/aws-cdk/pull/556))
- **@aws-cdk/aws-iam**: add support for `maxSessionDuration` for Roles ([@eladb] in [#545](https://github.com/aws/aws-cdk/pull/545)).

### Changes

- **@aws-cdk/aws-lambda** (_**BREAKING**_): most classes renamed to be shorter and more in line with official service naming (`Lambda` renamed to `Function` or ommitted) ([@eladb] in [#550](https://github.com/aws/aws-cdk/pull/550))
- **@aws-cdk/aws-codepipeline** (_**BREAKING**_): move all CodePipeline actions from `@aws-cdk/aws-xxx-codepipeline` packages into the regular `@aws-cdk/aws-xxx` service packages ([@skinny85] in [#459](https://github.com/aws/aws-cdk/pull/459)).
- **@aws-cdk/aws-custom-resources** (_**BREAKING**_): package was removed, and the Custom Resource construct added to the **@aws-cdk/aws-cloudformation** package ([@rix0rrr] in [#513](https://github.com/aws/aws-cdk/pull/513))

### Fixes

- **@aws-cdk/aws-lambda**: Lambdas that are triggered by CloudWatch Events now show up in the console, and can only be triggered the indicated Event Rule. _**BREAKING**_ for middleware writers (as this introduces an API change), but transparent to regular consumers ([@eladb] in [#558](https://github.com/aws/aws-cdk/pull/558))
- **@aws-cdk/aws-codecommit**: fix a bug where `pollForSourceChanges` could not be set to `false` ([@maciejwalkowiak] in [#534](https://github.com/aws/aws-cdk/pull/534))
- **aws-cdk**: don't fail if the `~/.aws/credentials` file is missing ([@RomainMuller] in [#541](https://github.com/aws/aws-cdk/pull/541))
- **@aws-cdk/aws-cloudformation**: fix a bug in the CodePipeline actions to correctly support TemplateConfiguration ([@mindstorms6] in [#571](https://github.com/aws/aws-cdk/pull/571)).
- **@aws-cdk/aws-cloudformation**: fix a bug in the CodePipeline actions to correctly support ParameterOverrides ([@mindstorms6] in [#574](https://github.com/aws/aws-cdk/pull/574)).

### Known Issues

- `cdk init` will try to init a `git` repository and fail if no global `user.name` and `user.email` have been configured.

## 0.8.1 - 2018-08-08

### Features

- **aws-cdk**: Support `--profile` in command-line toolkit ([@rix0rrr] in [#517](https://github.com/aws/aws-cdk/issues/517))
- **@aws-cdk/cdk**: Introduce `Default` construct id ([@rix0rrr] in [#496](https://github.com/aws/aws-cdk/issues/496))
- **@aws-cdk/aws-lambda**: Add `LambdaRuntime.DotNetCore21` ([@Mortifera] in [#507](https://github.com/aws/aws-cdk/issues/507))
- **@aws-cdk/runtime-values** (_**BREAKING**_): rename 'rtv' to 'runtime-values' ([@rix0rrr] in [#494](https://github.com/aws/aws-cdk/issues/494))
- **@aws-cdk/aws-ec2**: Combine `Connections` and `DefaultConnections` classes ([@rix0rrr] in [#453](https://github.com/aws/aws-cdk/issues/453))
- **@aws-cdk/aws-codebuild**: allow `buildSpec` parameter to take a filename ([@rix0rrr] in [#470](https://github.com/aws/aws-cdk/issues/470))
- **@aws-cdk/aws-cloudformation-codepipeline**: add support for CloudFormation CodePipeline actions ([@mindstorms6] and [@rix0rrr] in [#525](https://github.com/aws/aws-cdk/pull/525)).
- **docs**: Improvements to Getting Started ([@eladb] in [#462](https://github.com/aws/aws-cdk/issues/462))
- **docs**: Updates to README ([@Doug-AWS] in [#456](https://github.com/aws/aws-cdk/issues/456))
- **docs**: Upgraded `jsii-pacmak` to `0.6.4`, which includes "language-native" type names and package coordinates ([@RomainMuller] in [awslabs/jsii#130](https://github.com/aws/jsii/pull/130))

### Bug fixes

- **aws-cdk** (toolkit): Fix java `cdk init` template ([@RomainMuller] in [#490](https://github.com/aws/aws-cdk/issues/490))
- **@aws-cdk/cdk** (_**BREAKING**_): Align `FnJoin` signature to CloudFormation ([@RomainMuller] in [#516](https://github.com/aws/aws-cdk/issues/516))
- **@aws-cdk/aws-cloudfront**: Fix origin error ([@mindstorms6] in [#514](https://github.com/aws/aws-cdk/issues/514))
- **@aws-cdk/aws-lambda**: Invalid cast for inline LambdaRuntime members in Java ([@eladb] in [#505](https://github.com/aws/aws-cdk/issues/505))
- **examples**: Fixed java examples ([@RomainMuller] in [#498](https://github.com/aws/aws-cdk/issues/498))

## 0.8.0 - 2018-07-31

**_This is the first public release of the AWS CDK!_**

- Change license to Apache-2.0 ([@RomainMuller] in [#428])
- Multiple README updates, including animated gif screencast, as preparation for public release ([@rix0rrr] in [#433], [@eladb] in [#439])
- Multiple documentation updates for public release ([@Doug-AWS] in [#420], [@eladb] in [#436])
- Toolkit (**bug fix**): Correctly account for `CDK::Metadata` in `cdk diff` ([@RomainMuller] in [#435])
- AWS CodeBuild (_**BREAKING**_): Usability improvements for the CodeBuild library ([@skinny85] in [#412])

## 0.7.4 - 2018-07-26

### Highlights

- A huge shout-out to our first external contributor, [@moofish32], for many valuable improvements to the EC2 VPC construct ([@moofish32] in [#250]).
- The `AWS::CDK::Metadata` resource is injected to templates to analyze usage and notify about deprecated modules to improve security. To opt-out, use the switch `--no-version-reporting` or set `version-reporting` to `false` in your `cdk.json` ([@RomainMuller] in [#221]).
- Added capability for bundling local assets (files/directories) and referencing them in CDK constructs. This allows, for example, to define Lambda functions with runtime code in the same project and deploy them using the toolkit ([@eladb] in [#371]).
- Reorganization of CodePipeline actions into separate libraries ([@skinny85] in [#401] and [#402]).
- A new library for CloudWatch Logs ([@rix0rrr] in [#307]).

### AWS Construct Library

- _**BREAKING**_: All AWS libraries renamed from `@aws-cdk/xxx` to `@aws-cdk/aws-xxx` in order to avoid conflicts with framework modules ([@RomainMuller] in [#384]).
- _**BREAKING**_: The **@aws-cdk/resources** module has been removed. Low-level CloudFormation resources (e.g. `BucketResource`) are now integrated into their respective library under the `cloudformation` namespace to improves discoverability and organization of the layers ([@RomainMuller] in [#264]).

### Framework

- Introducing **CDK Assets** which are local files or directories that can be "bundled" into CDK constructs and apps. During deployment assets are packaged (i.e. zipped), uploaded to S3 and their deployed location can be referenced in CDK apps via the `s3BucketName` and `s3ObjectKey` and `s3Url` and read permissions can be granted via `asset.grantRead(principal)` ([@eladb] in [#371])
- Return dummy values instead of fail synthesis if environmental context (AZs, SSM parameters) doesn't exist in order to support unit tests. When synthesizing through the toolkit, an error will be displayed if the context cannot be found ([@eladb] in [#227])
- Added `construct.addError(msg)`, `addWarning(msg)` and `addInfo(msg)` which will emit messages during synthesis via the toolkit. Errors will fail synthesis (unless `--ignore-errors` is used), warnings will be displayed and will fail synthesis if `--strict` is used ([@eladb] in [#227])

### Command Line Toolkit

- The toolkit now injects a special CloudFormation resource `AWS::CDK::Metadata` to all synthesized templates which includes library versions used in the app. This allows the CDK team to analyze usage and notify users if they use deprecated versions ([@RomainMuller] in [#221]).
- **Bug fix**: Fixed "unknown command: docs" ([@RomainMuller] in [#256])
- Changed output of `cdk list` to just print stack names (scripting-compatible). Use `cdk ls -l` to print full info ([@eladb] in [#380])

### AWS EC2

- _**BREAKING**_: Add the ability customize subnet configurations. Subnet allocation was changed to improve IP space efficiency. `VpcNetwork` instances will need to be replaced ([@moofish32] in [#250])
- _**BREAKING**_: Renamed `Fleet` to `AutoScalingGroup` to align with service terminology ([@RomainMuller] in [#318])

### AWS Lambda

- Supports runtime code via local files or directories through assets ([@eladb] in [#405])
- Support custom execution role in props ([@rix0rrr] in [#205])
- Add static `metricAllConcurrentExecutions` and `metricAllUnreservedConcurrentExecutions` which returns account/region-level metrics for all functions ([@rix0rrr] in [#379])

### AWS CloudWatch

- Added `Metric.grantMetricPutData` which grants cloudwatch:PutData to IAM principals ([@rix0rrr] in [#214])
- **Bug fix**: Allow text included in dashboard widgets to include characters that require JSON-escaping ([@eladb] in [#406]).

### AWS CloudWatch Logs (new)

- A new construct library for AWS CloudWatch Logs with support for log groups, metric filters, and subscription filters ([@rix0rrr] in [#307]).

### AWS S3

- Added `bucketUrl` and `urlForObject(key)` to `BucketRef` ([@eladb] in [#370])

### AWS CodeBuild

- Add CloudWatch metrics to `BuildProject` ([@eladb] in [#407])

### AWS CodePipeline

- _**BREAKING**_: Moved CodeCommit and CodeBuild and LambdaInvoke actions from the CodePipeline library to `@aws-cdk/aws-xxx-codepipline` modules ([@skinny85] in [#401] and [#402]).
- Added attributes `pipelineName` and `pipelineVersion` ([@eladb] in [#408])

### Docs

- **fix**: add instructions and fix Windows setup ([@mpiroc] in [#320])
- **fix**: show emphasis of modified code in code snippets ([@eladb] in [#396])

## 0.7.3 - 2018-07-09

### Highlights

- Introducing Java support (see the **Getting Started** documentation topic for instructions on how to set up a Java project).
- Introduce a new programming model for CloudWatch metrics, alarms and dashboards (see the [@aws-cdk/cloudwatch documentation]).
- Multiple documentation improvements (open with `cdk docs`).

### Known Issues

- Missing instructions for Windows Setup ([#138])
- `cdk docs` works but a message **Unknown command: docs** is printed ([#256])
- Java: passing `null` behaves differently than no arguments. Workaround is to build an empty object ([#157])

### Changes

- Introduce Java support ([@eladb] in [#229], [#245], [#148], [#149])
- Changed the way the beta archive is structured to no longer bundle a pre-installed `node_modules` directory but rather only a local npm repository. This changes the setup instructions to require `y-npm i -g aws-cdk` to install the toolkit on the system, which is more inline with the setup experience post-beta ([@RomainMuller] in [#161], [#162] and [awslabs/jsii#43]).
- CloudWatch (new): introduce a rich programming model for metrics, alarms and dashboards ([@rix0rrr] in [#180], [#194])
- S3 (feature): add support for SSE-S3 encryption ([@rix0rrr] in [#257])
- Lambda (feature): add support for node.js 8.10 runtime ([@RomainMuller] in [#187])
- Runtime Values (fix): use allowed characters in SSM parameter name when advertising a runtime value ([@eladb] in [#208])
- SNS (docs): convert examples in README into compiled code ([@rix0rrr] in [#107])
- Toolkit (feature): introduce `cdk doctor` to collect information for diagnostics ([@RomainMuller] in [#177])
- Toolkit (feature): align AWS credentials behavior to AWS CLI ([@RomainMuller] in [#175])
- Toolkit (performance): cache default AWS account ID on disk ([@eladb] in [#220])
- Docs: multiple updates ([@Doug-AWS] in [#142])
- Docs: improve topic on logical IDs ([@eladb] in [#209])
- Docs: add support for code snippets in multiple tabs ([@eladb] in [#231])
- Docs: rewrote the "Getting Started" documentation topic to include step-by-step project setup details instead of using `cdk-init`. This is in order to improve understanding of how the CDK works when users get started ([@eladb] in [#245])
- Resource bundler: generate `.d.ts` ([@rix0rrr] in [#172])

## 0.7.2 - 2018-06-19

- Add: initial construct library for [AWS Kinesis Data Streams] ([@sam-goodwin] in [#86])
- Update low-level resources from [CloudFormation resource specification]
- Update dependencies ([@eladb] in [#119])
- Fix: Adopt SDK-standard behavior when no environment is specified ([@RomainMuller] in [#128])
- Fix: Have cdk diff output render 'number' value changes ([@RomainMuller] in [#136])

### Known issues

- Windows setup has not been vetted and might be broken - **no workaround** ([#138])
- If region is not defined, error message is unclear - **workaround**: make sure to define `region` when running `aws configure` ([#131])
- `cdk docs` opens the index instead of the welcome page - **workaround**: click on "Welcome" in the sidebar ([#129])
- The runtime values library (**@aws-cdk/rtv**) is broken ([#151])

## 0.7.1 - 2018-06-15

### Framework

- Two-way IAM policy statement additions have been removed for S3 and SNS, because those services treat resource and identity policies as additive. KMS grants are still added on both resource and identity because KMS requires permissions set from both sides.

### Toolkit

- `cdk init` interface changed to accept the template name as a positional argument, and the language as an option. A `--list` option was added to allow listing available templates.
- `cdk-beta-npm` is a wrapper to `npm` that executes commands with a local registry that has the CDK packages available. It should be used instead of `npm` for subcommands such as `npm install`.
- CDK now respects `AWS_DEFAULT_REGION` environment variable if set.

## 0.7.0 - 2018-06-13

### Framework

- _BREAKING_: All CDK packages are non under the scope `@aws-cdk` (e.g. `@aws-cdk/s3`).
- _BREAKING_: The `jsii` compiler now configures `tsconfig.json` to produce definition files (files with a .d.ts extension). This requires updating your existing `package.json` files `types` key to replace the .ts extension with a .d.ts extension.
- Java bindings now include static methods and constants.
- `SecretParameter` can be used to load values from the SSM parameter store during deployment and use them as `Secret`s.
- `Stack` is locked for mutations during synthesis to protect against accidental changes in lazy values.
- An overhaul of documentation updates, edits and improvements.

### ACM

- Fix: `cloudFrontDefaultCertificate` is mutually exclusive with `acmCertificateArn`.

### CloudFront (new)

- Added a new construct library for AWS CloudFront.

### CodeBuild

- Added support for specifying environment variables at the container and project levels.

### CodePipeline

- Fix: GitHub action "owner" changed to `ThirdParty`.
- Removed all fluent APIs
- Use "master" as the default branch for Source actions
- _BREAKING_: `AmazonS3SourceProps` - renamed `key` to `bucketKey`

### Custom Resources

- _BREAKING_: Require that Lambda is referenced explicitly when defining a custom resource. `SingletonLambda` can be used to encapsulate the custom resource's lambda function but only have a single instance of it in the stack.

### Events (new)

A new cross-stack programming model is introduced to support CloudWatch Events. Event sources implement `onXxx` methods for various events that can emitted by that source and event targets implement `IEventRuleTarget`, so they can be polymorphically added to rules.

```typescript
const repo = new Repository(stack, 'MyRepo', { repositoryName: 'my-repo' });
const project = new BuildProject(stack, 'MyProject', { source: new CodeCommitSource(repo) });

const topic = new Topic(stack, 'MyTopic');
topic.subscribeEmail('Personal', 'myteam@mycompany.com');

project.onStateChange(topic);
```

Coverage to all event sources and target will be added in subsequent releases.

Supported targets:

- `codebuild.BuildProject`
- `codepipline.Pipeline`
- `sns.Topic`

Supported sources:

- **CodeBuild**: `onStateChange`, `onPhaseChange`, `onBuildStarted`, `onBuildFailed`, `onBuildSucceeded`.
- **CodeCommit**: `onEvent`, `onStateChange`, `onReferenceCreated`, `onReferenceUpdated`, `onReferenceDeleted`, `onPullRequestStateChange`, `onCommentOnPullRequest`, `onCommentOnCommit`, `onCommit`.
- **CodePipeline**: `pipeline.onStateChange`, `stage.onStateChange`, `action.onStateChange`.

### IAM

- Add `CanonicalUserPrincipal`
- Add `statementCount` to `PolicyDocumennt`.
- Extended support for `FederatedPrincipal`.

### Lambda

- Add `initialPolicy` prop which allows specifying a set of `PolicyStatement`s upon definition.

### S3

- Added support for lifecycle rules
- Add `domainName` and `dualstackDomainName` attributes

### Serverless

- `version` field of `FunctionResource` is now optional.

### SNS

- _BREAKING_: `subscribeXxx` APIs now do not require a name when possible (for queue, Lambda).
- Unique SID assigned to resource policy statements.

### Toolkit

- `cdk docs` opens your browser with the bundled documentation content.
- `cdk init` interface changed to specify `--lang` and `--type` separately.
- Plug-in architecture improved.

## 0.6.0 - 2018-05-16

### AWS Construct Libraries

The main theme for this release is the stabilization of our framework APIs and an initial set of **AWS Construct Libraries**.

Previously, CDK users would normally to program against the `@aws-cdk/resources` library which included generated classes for all CloudFormation resources. For example, the `sqs.QueueResource` defined the **AWS::SQS::Queue** CloudFormation resource.

Starting in 0.6, we recommend that users define their infrastructure using a new set of _hand-crafted libraries_ we refer to as **AWS Construct Libraries** (we used to call these "Layer 2" or "L2"). These libraries include CDK constructs with rich and powerful object-oriented APIs for defining infrastructure.

For example:

```typescript
const vpc = new VpcNetwork(this, 'MyVpc');

const fleet = new Fleet(this, 'MyFleet', {
    vpc, instanceType: new InstanceTypePair(InstanceClass.M4, InstanceSize.XLarge),
    machineImage: new AmazonLinuxImage()
});

const clb = new ClassicLoadBalancer(this, 'LB', {
    vpc, internetFacing: true
});

clb.addListener({ externalPort: 80 });
clb.addTarget(fleet);
```

Synthesizing this stack to the us-east-1 region (which has 6 availability zones) will result in a CloudFormation template that contains 72 resources of 17 different resource types.

### Construct initializers now include a name

All constructs in a CDK stack must have a name unique amongst its siblings. Names are used to allocate stack-wide logical IDs for each CloudFormation resource. Prior to this release, the name of the class was implicitly used as a default name for the construct. As much as this was convenient, we realized it was misleading and potentially unsafe, since a change in a class name will result in changes to all logical IDs for all resources created within that tree, and changes to logical IDs result in **resource replacement** since CloudFormation cannot associate the existing resource with the new resource (this is the purpose of logical IDs in CloudFormation).

Therefore, we decided construct names deserve an explicit and prominent place in our programming model and starting from this release, they have been promoted to the 2nd argument of all initializers.

```typescript
new MyConstruct(parent, name, props);
```

### New scheme for allocating CloudFormation logical IDs

In order to ensure uniqueness of logical IDs within a stack, we need to reflect the resource's full CDK path within it's logical ID. Prior to this release, logical IDs were a simple concatenation of the path components leading up to the resource. However, this could potentially create unresolvable conflicts ("a/b/c" == "ab/c").

Since logical IDs may only use alphanumeric characters and also restricted in length, we are unable to simply use a delimited path as the logical ID. Instead IDs are allocated by concatenating a human-friendly rendition from the path (components, de-duplicate, trim) with a short MD5 hash of the delimited path:

```
VPCPrivateSubnet2RouteTable0A19E10E
<-----------human---------><-hash->
```

One exception to this scheme is resources which are direct children of the `Stack`. Such resources will use their name as a logical ID (without the hash). This is done to support easier migration from existing CloudFormation templates.

### Renaming logical IDs to avoid destruction of resources

If you have CDK stacks deployed with persistent resources such as S3 buckets or DynamoDB tables, you may want to explicitly "rename" the new logical IDs to match your existing resources.

First, make sure you compare the newly synthesized template with any deployed stacks. `cdk diff` will tell you which resources will be destroyed if you deploy this update:

```
[-] Destroying MyTable (type: AWS::DynamoDB::Table)
[+] Creating MyTableCD117FA1 (type: AWS::DynamoDB::Table)
```

In order to avoid this, you can use `stack.renameLogical(from, to)` as follows. Note that `renameLogical` must be called **before** the resource is defined as logical IDs are allocated during initialization:

```typescript
// must be before defining the table (this instanceof Stack)
this.renameLogical('MyTableCD117FA1', 'MyTable');
new dynamodb.Table(this, 'MyTable', { /* .. */ });
```

Now, `cdk diff` should indicate no differences.

### All "props" types are now interfaces instead of classes

In order to improve the developer experience, we have changed the way we model construct "Props" and now they are defined as TypeScript interfaces. This has a few implications on how to use them:

In TypeScript, `new XxxProps()` won't work, you will have to simply assign an object literal:

```typescript
new Queue(this, 'MyQueue', { visibilityTimeoutSec: 300 });
```

In Java, you can create a concrete object using a builder:

```java
new Queue(this, "MyQueue", QueueProps.builder()
    .withVisibilityTimeout(300)
    .build());
```

### A design pattern for exporting/importing resources

All AWS constructs implement a common pattern which allows treating resources defined within the current stack and existing resources to be treated via a common interface:

For example, when defining a `Pipeline`, you can supply an artifacts bucket.

The bucket is defined within the same stack:

```typescript
const bucket = new Bucket(this, 'MyArtifactsBucket');
new Pipeline(this, 'MyCoolPipeline', { artifactsBucket: bucket });
```

You can also import a bucket by just specifying its name:

```typescript
const bucket = Bucket.import({ bucketName: new BucketName('my-bucket') });
new Pipeline(this, 'MyCoolPipeline', { artifactsBucket: bucket });
```

Or you can export the bucket from another stack and import it:

```typescript
// some other stack:
const bucket = new Bucket(otherStack, 'MyBucket');
const externalBucket = bucket.export();
// bucketRef contains tokens that allow you to pass it into `import`.

// my stack:
const importedBucket = Bucket.import(this, 'OtherArtifactsBucket', externalBucket);
new Pipeline(this, 'MyCoolPipeline', { artifactsBucket: importedBucket });
```

### Region-aware APIs for working with machine images (AMIs)

The **@aws-cdk/ec2** library exposes a new API for region-aware AMI discovery:

```typescript
const ami = new AmazonLinuxImage({
    edition: AmazonLinuxEdition.Standard, // default
    virtualization: AmazonLinuxVirt.HVM,  // default
    storage: AmazonLinuxStorage.EBS       // default is GeneralPurpose
});

new Fleet(this, 'MyAmazonLinuxFleet', { machineImage: ami, ... });
```

For Windows:

```typescript
const ami = new WindowsImage(WindowsVersion.WindowsServer2016EnglishNanoBase);
new Fleet(this, 'MyWindowsFleet', { machineImage: ami, ... });
```

Or, a mapping utility:

```typescript
const ami = new GenericLinuxImage({
    'us-east-1': 'ami-62bda218',
    'eu-west-1': 'ami-773acbcc'
});

new Fleet(this, 'MySuseFleet', { machineImage: ami, ... });
```

### A rich programming model for Code Suite services

The **@aws-cdk/codebuild**, **@aws-cdk/codecommit** and **@aws-cdk/codepipeline** construct libraries include rich APIs for defining continuous integration pipelines and builds.

The following code defines a pipeline with a CodeCommit source and CodeBuild build step. The pipeline is created with an artifacts bucket and a role, and least-privilege policy documents are automatically generated.

```typescript
// define a CodeCommit repository
const repo = new Repository(stack, 'MyRepo', { repositoryName: 'my-repo' });

// define a pipeline with two stages ("source" and "build")
const pipeline  = new Pipeline(stack, 'Pipeline');
const sourceStage = new Stage(pipeline, 'source');
const buildStage  = new Stage(pipeline, 'build');

// associate the source stage with the code commit repository
const source = new codecommit.PipelineSource(sourceStage, 'source', {
    artifactName: 'SourceArtifact',
    repository: repo,
});

// associate the build stage with code build project
new codebuild.PipelineBuildAction(buildStage, 'build', {
    project: new BuildProject(stack, 'MyBuildProject', { source: new CodePipelineSource() },
    source
});
```

### Inline JavaScript Lambda Functions

The **@aws-cdk/lambda** library includes an `InlineJavaScriptLambda` construct which makes it very easy to implement simple node.js Lambda functions with code inline in the CDK.

This CDK program defines an S3 Bucket and a Lambda function, and sets all the needed permissions. When the function is invoked, a file named 'myfile.txt' will be uploaded to the bucket with the text "Hello, world". The physical bucket name is passed through via the `BUCKET_NAME` environment variable.

```typescript
const bucket = new Bucket(this, 'MyBucket');

const lambda = new InlineJavaScriptLambda(this, 'MyLambda', {
    environment: {
        BUCKET_NAME: bucket.bucketName
    },
    handler: {
        fn: (event: any, context: any, callback: any) => {
            const s3 = new require('aws-sdk').S3();

            const req = {
                Bucket: process.env.BUCKET_NAME,
                Key: 'myfile.txt',
                Body: 'Hello, world'
            };

            return s3.upload(req, (err, data) => {
                if (err) return callback(err);
                console.log(data);
                return callback();
            });
        }
    }
});

// grant the Lambda execution role read/write permissions for the bucket
// this also adds a corresponding bucket resource policy
bucket.grantReadWrite(lambda.role);
```

### Resource and role IAM policies and grants

All AWS constructs now expose APIs for naturally adding statements to their resource or role policies. Constructs may have `addToRolePolicy(statement)` or `addToResourcePolicy(statement)` methods, which can be used to mutate the policies associated with a resource.

The `statement` is a `PolicyStatement` object with a rich API for producing IAM statements. This is an excerpt from the implementation of `topic.subscribeQueue`:

```typescript
queue.addToResourcePolicy(new PolicyStatement()
    .addResource(queue.queueArn)
    .addAction('sqs:SendMessage')
    .addServicePrincipal('sns.amazonaws.com')
    .setCondition('ArnEquals', { 'aws:SourceArn': this.topicArn }));
```

The S3 bucket construct has a set of "grant" methods (`grantRead`, `grantReadWrite`) which accept a principal resource (user, role or group) and an optional key prefix pattern and will render reciprocal IAM permissions, both in the principal's policy and the bucket policy:

```typescript
const reader = new User(this, 'Reader');
const bucket = new Bucket(this, 'MyBucket');
bucket.grantRead(reader);
```

Synthesizes to:

```yaml
Resources:
  ReaderF7BF189D:
    Type: AWS::IAM::User
  ReaderDefaultPolicy151F3818:
    Type: AWS::IAM::Policy
    Properties:
      PolicyDocument:
        Statement:
        - Action: [ "s3:GetObject*", "s3:GetBucket*", "s3:List*" ]
          Effect: Allow
          Resource:
          - { "Fn::GetAtt": [ "MyBucketF68F3FF0", "Arn" ] }
          - { "Fn::Join": [ "", [ { "Fn::GetAtt": [ "MyBucketF68F3FF0", "Arn" ] }, "/", "*" ] ] }
        Version: '2012-10-17'
      PolicyName: ReaderDefaultPolicy151F3818
      Users: [ { "Ref": "ReaderF7BF189D" } ]
  MyBucketF68F3FF0:
    Type: AWS::S3::Bucket
  MyBucketPolicyE7FBAC7B:
    Type: AWS::S3::BucketPolicy
    Properties:
      Bucket: { "Ref": "MyBucketF68F3FF0" }
      PolicyDocument:
        Statement:
        - Action: [ "s3:GetObject*", "s3:GetBucket*", "s3:List*" ]
          Effect: Allow
          Principal:
            AWS: { "Fn::GetAtt": [ "ReaderF7BF189D", "Arn" ] }
          Resource:
          - { "Fn::GetAtt": [ "MyBucketF68F3FF0", "Arn" ] }]
          - { "Fn::Join": [ "", [ { "Fn::GetAtt": [ "MyBucketF68F3FF0", "Arn" ] }, "/", "*" ] ] }
        Version: '2012-10-17'
```

### Security group connections framework

The **@aws-cdk/ec2** library includes a rich framework for modeling security group connections between resources such as a fleet, load balancers and databases.

For example, these automatically create appropriate ingress and egress rules in both security groups:

```typescript
// allow fleet1 top connect to fleet2 on port 80
fleet1.connections.allowTo(fleet2, new TcpPort(80), 'Allow between fleets');

// allow fleet3 to accept connections from a load balancer on ports 60000-65535
fleet3.connections.allowFrom(loadBalancer, new TcpPortRange(60000, 65535), 'Allow from load balancer');
```

### Improvements to attribute classes and tokens

- Remove the "Attribute" postfix from all generated attribute types. So now, it is `QueueArn` instead of `QueueArnAttribute`. "Attribute" postfix from attribute types
- Simplify the initialization of `Token` objects (all attribute types are Tokens). They can now be either initialized with a simple value or a lazy function. This means, that now you can write `new QueueArn('foo')`. This is useful when importing external resources into the stack.

### Improvements to the CDK Toolkit

The toolkit now outputs YAML instead of JSON by default.

Added active progress reporting for stack updates.

The diff output has been dramatically improved and provides a structure-aware diff. For example:

```
[~] Updating TableCD117FA1 (type: AWS::DynamoDB::Table)
        .ProvisionedThroughput:
            .WriteCapacityUnits: 10
    Creating MyQueueE6CA6235 (type: AWS::SQS::Queue)
```

### Library for unit and integration testing

The CDK is now shipped with a library called **@aws-cdk/assert** which aims to make it easy to write unit and integration tests for CDK libraries and apps. The library leverages the same powerful template diff mechanism used in the toolkit to print rich descriptions.

```typescript
import { expect } from '@aws-cdk/assert';

const stack = new Stack();
new Queue(stack, 'MyQueue', { visibilityTimeout: 300 });

expect(stack).to(haveResource('AWS::SQS::Queue', { VisibilityTimeout: 300 }));
expect(stack).to(countResources('AWS::SQS::Queue', 1));
expect(stack).toMatch({
    Resources: {
        MyQueue: {
            Type: 'AWS::SQS::Queue',
            Properties: {
                VisibilityTimeout: 300
            }
        }
    }
});
```

An initial integration testing utility is now available to allow users to implement manually executed CDK integration tests and ensure they are kept up-to-date if the code changes. This is an initial approach until we have a great way to automatically execute them during CI/CD.

### Updates to the IAM policy library

The APIs in the IAM policy library have been improved and now provide a richer and more strongly-typed experience.

A class hierarchy around `PolicyPrincipal` was created to reflect the various principals available: `AccountPrincipal`, `ServicePrincipal`, `ArnPrincipal`, `AccountRootPrincipal`.

The `Arn` type now has the ability to format and parse to/from its components:

```typescript
Arn.fromComponents({
    service: 'dynamodb',
    resource: 'table',
    account: '123456789012',
    region: 'us-east-1',
    partition: 'aws-cn',
    resourceName: 'mytable/stream/label'
});

// and
const bucketArn = Arn.parse('arn:aws:s3:::my_corporate_bucket')
// bucketArn === { partition: 'aws', service: 's3', resource: 'my_corporate_bucket' }
```

The `Permission` class was renamed to `PolicyStatement` and enriched with more strongly typed APIs.

### A new library for defining custom CloudFormation resources

A library to facilitate the definition of custom CloudFormation resources and exposing them as regular CDK constructs is now shipped with the CDK.

## 0.5.0 - 2018-03-29

### AWS Resource Constructs (L1)

- All CloudFormation resource constructs are now available from the **@aws-cdk/resources** package under their dedicated AWS service's namespace. we have been calling these resource constructs **Layer 1** (or "L1 constructs").
- All resource constructs now have the **Resource** suffix (**TableResource** instead of `Table`). This helps differentiate them from the rich AWS constructs we are also introducing in this release.
- The CloudFormation resource property "Name" is now called "xxxName" (where "xxx" is the name of the resource, like "queue") instead of "resourceName".
- Updated resources based on the latest CloudFormation resource specification.

Before:

```javascript
import { Pipeline } from '@aws-cdk/codepipeline';

new Pipeline(this, {
    resourceName: 'MyPipelineName'
});
```

After:

```javascript
import { codepipeline } from '@aws-cdk/resources';

new codepipeline.PipelineResource(this, {
    pipelineName: 'MyPipelineName'
});
```

### Framework

- Introducing **CDK Applets** which allow instantiating specific CDK stacks using a declarative YAML syntax.
- As a first step to enable diagnostics features in the toolkit, record logical ID (and stack trace) in metadata for stack elements.
- Introduce a new scheme for generating CloudFormation logical IDs which adds a hash of the construct path to the generated ID to avoid ID collisions. To opt-in for the new scheme, set `hashedLogicalIDs` to `true` when creating a **Stack**.
- Allow specifying explicit **logicalID** for stack elements like **Resource** **Parameter** and **Output**.
- `async exec()` changed to `run()` and `validate` was changed to be a synchronous method instead of async.
- Merged **@aws-cdk/core** into **aws-cdk**, which now where the core classes of the CDK framework live.
- The **Runtime Values** library, which was under **@aws-cdk/rtv** is now **@aws-cdk/rtv**.
- Bugfix: Tags could not be used because they failed validation.
- Bugfix: Allow "-" in stack names.

### Toolkit

- The toolkit is now called **CDK Toolkit** instead of "cx Toolkit". This means that the `cx` command-command line program is now called `cdk`.
- Added support **large CloudFormation templates** using a "toolkit stack" which contains an S3 bucket. This approach may be extended to provide other environment-related facilities in the future and requires that users "bootstrap" the toolkit stack into their environments. The current behavior will not require this stack unless you are trying to deploy a large template.
- It is now possible to **synthesize all stacks into a directory**.
- Allow using globs in `cdk deploy` to select multiple stacks.
- Default account ID lookup result is now cached.
- Better error messages.
- Improve deploy output.
- Bugfix: Better error message when the app has no stacks.
- Bugfix: Distinguish actual "stack missing" from "no credentials".
- Bugfix: Delete stack in unrecoverable state.
- Bugfix: Fix an issue where 'deploy' fails because subsequent invocations use the same argument array.
- Bugfix: prevent crash if ~/.aws/config doesn't exist.

### Documentation and Examples

- Implemented a few **advanced examples** These examples show how to use IAM policies, environmental context, template inclusion, nested stacks, resource references and using various CloudFormation semantics in the CDK

## 0.4.0 - 2018-03-05

### New Features

- **Environments** - this version extends the fidelity of a CDK deployment target from only _region_ to _region + account_, also referred to as an **_environment_**. This allows modeling complete apps that span multiple accounts/regions. To preserve the current behavior, if region/account is not specified, the CDK will default to the AWS SDK region/credential provider chain (`~/.aws/config`). We will add support for AWS SDK Profiles in a future release. See the **Environments** section of the CDK README for details).
- **Environmental Context** (such as availability zones and SSM parameters) - there are use-cases where CDK stacks need to consult with account and region-specific information when they are synthesized (we call this information "environmental context"). For example, the set of supported **availability zones** is specific to account _and_ region; the specific ID of certain public **AMIs** (Amazon Machine Image IDs) as published to the SSM parameter store is specific to each region. See the **Environmental Context** section in the CDK README for details .
- **Runtime Values** - a new mechanism for advertising values such as resource attributes and constants from construction-time to runtime code via the SSM parameter store. See the **Runtime Values** section in the CDK README for details.
- **Construct Validation** - it is now possible to implement a method `validate(): string[]` for any construct at any layer. Validation methods are all executed before a stack is synthesized and provide an opportunity for constructs to implement validation logic. See the **Construct Validation** section in the CDK README for details.
- **User-specific cx.json** - the toolkit will now incorporate settings from `~/.cx.json`. This allows users to supply user-specific settings. Note this file is applied _before_ the project-specific `cx.json` file is applied.
- **IAM Library Improvements** - allow creating IAM documents with a base document, a new class `AssumeRolePolicyDocument`, allow specifying multiple actions when creating a `Permission` ob object.
- **`stack.findResource(logicalId)`** - allows retriving a resource object from a stack based on it's calculated logical ID.
- **Windows AMIs are read from SSM parameter store**.

### Bug Fixes

- **cx Toolkit** returns a non-zero exit code when an error occurs.
- **Retain original names of CloudFormation properties** instead of auto-capitalizing based on heuristics, which caused some unexpected behavior in certain scenarios.
- **CAPABILITY_NAMED_IAM** was added to "cx deploy" by default.

## 0.3.0 - 2018-01-30

### Highlights

- Java support:

```java
class HelloJavaStack extends Stack {
    public HelloJavaStack(final Construct parent, final StackProps props) {
        super(parent, props);

        VpcNetwork vpc = new VpcNetwork(this);

        new Fleet(this, new FleetProps()
                .withVpcSubnetwork(vpc.getPrivateSubnetwork())
                .withInstanceType(new InstanceType("t2.micro"))
                .withMachineImage(new WindowsMachineImage(0)));
    }
}
```

- **cx Toolkit** now supports standard AWS credentials.

- CloudFormation pseudo parameters and intrinsic functions are now implemented as normal classes (`AwsRegion`, `AwsStackId`, `FnConcat`) instead of static methods. We might introduce functional sugar at a later stage, but at the lower-level, we want to represent both intrinsic functions and pseudo parameters as classes so we can model their relationship more accurately. For example, all pseudo parameters extend `PseudoParameter`, all functions extends the `Fn`, all condition functions extend `FnCondition`, etc.

Before:

```javascript
Fn.if_(Fn.equals(param.ref, 'True'), 'Encrypted', Pseudo.NO_VALUE)
```

After:

```javascript
new FnIf(Fn.equals(param.ref, 'True'), 'Encrypted', new AwsNoValue())
```

- CloudFormation template options (`templateFormatVersion`, `description` and `transform`) are now grouped under `Stack.templateOptions` instead of directly under `Stack`.

Before:

```javascript
stack.description = 'This is my awesome template'
```

After:

```javascript
stack.templateOptions.description = 'This is my awesome template'
```

### Known Issues

- Stack names are limited to alphanumeric characters, so it won't be possible to set stack names to match existing deployed stacks. As a workaround you can use `cx --rename` to specify the actual stack name to use for `diff` or `deploy`. Thanks rmuller@ for reporting.
- When synthesizing templates, we transform all JSON keys to pascal case to conform with CloudFormation standards, but this also affects JSON blobs that are not CloudFormation such as IAM documents or environment variables.

### Non-breaking Changes

- Added support for **CloudFormation Rules**.
- **Cloud Executable Interface (CXI)**: changed semantics from "construct" to "synthesize" (backwards compatible).
- **Tokens**: improve error reporting when unable to resolve tokens.

## 0.2.0 - 2017-12-07

### Highlights

### Construct Names

- The initializer signature for constructs has changed and is now: `new Construct(parent[, props])`, where `props` is may include an _optional_ `name` property ("id" is now called "name").
- If `name` is not specified, the **type name** is used as the name. This will only be allowed when there is a single construct of a certain type under a parent.
- If a parent has more than a single child of the same type, all children must have an explicit names to avoid ambiguity when generating CloudFormation logical IDs.
- JSX support updated to use `name` instead of `id` when producing construct trees.

Before:

```javascript
new BeautifulConstruct(this, 'MyBeautifulConstruct', { ...props })
```

After:

```javascript
new BeautifulConstruct(this) // use defaults
new BeautifulConstruct(this, { ...props })
// or
new BeautifulConstruct(this, { name: 'MyBeautifulConstruct', ...props })
```

### Resource Attribute Types

- CloudFormation resource attribute properties now return a specialized type per attribute. For example, the `sqs.queueArn` property returns a `QueueArnAttribute` object instead of a `Token`.
- The `Attribute` and `ArnAttribute` classes extend `Token` and used as base classes for attribute types.
- Resource names are now added as a prefix to attribute properties (`queueArn` instead of `arn`). This is required for future support for duck-typing and polymorphic use of resources of multiple types via a single container.

Before:

```javascript
const t = new aws.dynamodb.Table(this);
assert(t.arn instanceof Token);
```

After:

```javascript
const t = new aws.dynamodb.Table(this);
assert(t.tableArn instanceOf TableArnAttribute);
assert(t.tableArn instanceOf ArnAttribute);
assert(t.tableArn instanceOf Token);
```

### Construct Metadata

- Constructs can now have **metadata** entries attached to them via `addMetadata(type,data)`.
- Each entry will also include the _stack trace_ from which the entry was added, which will later be used to improve the diagnosability of deployment errors.
- Stack metadata can be obtained using cx-Toolkit via `cx metadata`.
- `construct.addWarning(msg)` attaches a "warning" metadata entry to a construct, which is displayed as a warning when synthesizing or deploying the stack.
- cx-Toolkit will show warnings upon synthesis also supports `--strict` mode which will refuse to deploy stacks with warnings.

Example:

```javascript
const c = new Construct(this);
c.addWarning('this is a warning');
c.addMetadata('type', 'data');
```

```bash
$ cx metadata
{
  "/Stack/Construct": [
    {
      "type": "type",
      "data": "data",
      "trace": [ ... ]
    },
    {
      "type": "warning",
      "data": "this is a warning",
      "trace": [ ... ]
    }
  ]
}
```

```bash
$ cx synth
Warning: this is a warning (at /Stack/Construct)
...
```

### Resource Enrichments

- Replaced `topic.subscribeToXxx` with `topic.subscribe(target)` where `target` is anything that adheres to the `SubscriptionTarget` interface (technically it's an abstract class because jsii doesn't support interfaces yet).
- Removed `function.addExecutionRole()` - an execution role is automatically created when invoking `function.addPermission(p)`.

### Tokens

- The `evaluate` method is now called `resolve`.

### CX Toolkit Usability Improvements

- If an app contains a single stack, no need to specify the stack name.
- `synth --interactive` (or `synth --interactive --verbose`) now displays real-time updates of a template's contents. Really nice for fast iteration;
- The toolkit now reads `cx.json` for default arguments. Very useful, for example, to remove the need to specify `--app` in every invocation.

[#107]: https://github.com/aws/aws-cdk/pull/107
[#119]: https://github.com/aws/aws-cdk/pull/119
[#128]: https://github.com/aws/aws-cdk/pull/128
[#129]: https://github.com/aws/aws-cdk/pull/129
[#131]: https://github.com/aws/aws-cdk/pull/131
[#136]: https://github.com/aws/aws-cdk/pull/136
[#138]: https://github.com/aws/aws-cdk/pull/138
[#142]: https://github.com/aws/aws-cdk/pull/142
[#148]: https://github.com/aws/aws-cdk/pull/148
[#149]: https://github.com/aws/aws-cdk/pull/149
[#151]: https://github.com/aws/aws-cdk/issues/151
[#157]: https://github.com/aws/aws-cdk/pull/157
[#161]: https://github.com/aws/aws-cdk/pull/161
[#162]: https://github.com/aws/aws-cdk/pull/162
[#172]: https://github.com/aws/aws-cdk/pull/172
[#175]: https://github.com/aws/aws-cdk/pull/175
[#177]: https://github.com/aws/aws-cdk/pull/177
[#180]: https://github.com/aws/aws-cdk/pull/180
[#187]: https://github.com/aws/aws-cdk/pull/187
[#194]: https://github.com/aws/aws-cdk/pull/194
[#205]: https://github.com/aws/aws-cdk/issues/205
[#208]: https://github.com/aws/aws-cdk/pull/208
[#209]: https://github.com/aws/aws-cdk/pull/209
[#214]: https://github.com/aws/aws-cdk/issues/214
[#220]: https://github.com/aws/aws-cdk/pull/220
[#227]: https://github.com/aws/aws-cdk/issues/227
[#229]: https://github.com/aws/aws-cdk/pull/229
[#231]: https://github.com/aws/aws-cdk/pull/231
[#238]: https://github.com/aws/aws-cdk/issues/238
[#245]: https://github.com/aws/aws-cdk/pull/245
[#250]: https://github.com/aws/aws-cdk/issues/409
[#256]: https://github.com/aws/aws-cdk/pull/256
[#257]: https://github.com/aws/aws-cdk/pull/257
[#258]: https://github.com/aws/aws-cdk/issues/258
[#264]: https://github.com/aws/aws-cdk/issues/264
[#307]: https://github.com/aws/aws-cdk/issues/307
[#318]: https://github.com/aws/aws-cdk/issues/318
[#320]: https://github.com/aws/aws-cdk/issues/320
[#370]: https://github.com/aws/aws-cdk/issues/370
[#371]: https://github.com/aws/aws-cdk/issues/371
[#379]: https://github.com/aws/aws-cdk/issues/379
[#380]: https://github.com/aws/aws-cdk/issues/380
[#384]: https://github.com/aws/aws-cdk/issues/384
[#396]: https://github.com/aws/aws-cdk/issues/396
[#401]: https://github.com/aws/aws-cdk/issues/401
[#402]: https://github.com/aws/aws-cdk/issues/402
[#405]: https://github.com/aws/aws-cdk/issues/405
[#406]: https://github.com/aws/aws-cdk/issues/406
[#408]: https://github.com/aws/aws-cdk/issues/408
[#412]: https://github.com/aws/aws-cdk/issues/412
[#420]: https://github.com/aws/aws-cdk/issues/420
[#428]: https://github.com/aws/aws-cdk/issues/428
[#433]: https://github.com/aws/aws-cdk/issues/433
[#435]: https://github.com/aws/aws-cdk/issues/435
[#436]: https://github.com/aws/aws-cdk/issues/436
[#439]: https://github.com/aws/aws-cdk/issues/439
[#86]: https://github.com/aws/aws-cdk/pull/86
[@aws-cdk/cloudwatch documentation]: https://github.com/aws/aws-cdk/blob/master/packages/%40aws-cdk/cloudwatch/README.md
[@cookejames]: https://github.com/cookejames
[@doug-aws]: https://github.com/Doug-AWS
[@eladb]: https://github.com/eladb
[@jungseoklee]: https://github.com/jungseoklee
[@maciejwalkowiak]: https://github.com/maciejwalkowiak
[@mindstorms6]: https://github.com/mindstorms6
[@moofish32]: https://github.com/moofish32
[@mortifera]: https://github.com/Mortifera
[@mpiroc]: https://github.com/mpiroc
[@rhboyd]: https://github.com/rhboyd
[@rix0rrr]: https://github.com/rix0rrr
[@romainmuller]: https://github.com/RomainMuller
[@sam-goodwin]: https://github.com/sam-goodwin
[@seekerwing]: https://github.com/SeekerWing
[@skinny85]: https://github.com/skinny85
[aws kinesis data streams]: https://aws.amazon.com/kinesis/data-streams
[awslabs/jsii#43]: https://github.com/aws/jsii/pull/43
[cloudformation resource specification]: https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-resource-specification.html
