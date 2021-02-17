# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

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
