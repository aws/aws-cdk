# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [2.0.0-alpha.2](https://github.com/aws/aws-cdk/compare/v2.0.0-alpha.1...v2.0.0-alpha.2) (2021-01-27)


### ⚠ BREAKING CHANGES TO EXPERIMENTAL FEATURES

* **s3-deployment:** User metadata keys of bucket objects will change from `x-amz-meta-x-amz-meta-x-amzn-meta-mykey` to `x-amz-meta-mykey`.
* **core:** users of modern synthesis (`DefaultSynthesizer`,
used by CDK Pipelines) must upgrade their bootstrap stacks. Run `cdk bootstrap`.

### Features

* **aws-codepipeline-actions:** Add Full Clone support for CodeCommit ([#12558](https://github.com/aws/aws-cdk/issues/12558)) ([d169688](https://github.com/aws/aws-cdk/commit/d169688f35bc78c88c44ff9a7d8fa0dfea71f904)), closes [#12236](https://github.com/aws/aws-cdk/issues/12236)
* **eks:** Graduate to stable ([#12640](https://github.com/aws/aws-cdk/issues/12640)) ([b5ba7cd](https://github.com/aws/aws-cdk/commit/b5ba7cdd61714bcfbf2135240790340a77ee1a8b))
* **stepfunctions-tasks:** EcsRunTask now uses taskDefinition family instead of ARN ([#12436](https://github.com/aws/aws-cdk/issues/12436)) ([abde96b](https://github.com/aws/aws-cdk/commit/abde96b046358fc5435545692eba4fd63d503914)), closes [#12080](https://github.com/aws/aws-cdk/issues/12080)
* **stepfunctions-tasks:** support databrew startJobRun task ([#12532](https://github.com/aws/aws-cdk/issues/12532)) ([eacd2f7](https://github.com/aws/aws-cdk/commit/eacd2f7ea67c83d50c839acf29fbe953ae49d987))


### Bug Fixes

* **apigatewayv2:** multiple http integrations are created for each route ([#12528](https://github.com/aws/aws-cdk/issues/12528)) ([855ce59](https://github.com/aws/aws-cdk/commit/855ce59039a577d142d68720e86d81610edffc64)), closes [40aws-cdk/aws-apigatewayv2/lib/http/route.ts#L128](https://github.com/40aws-cdk/aws-apigatewayv2/lib/http/route.ts/issues/L128)
* **core:** modern deployments fail if bootstrap stack is renamed ([#12594](https://github.com/aws/aws-cdk/issues/12594)) ([e5c616f](https://github.com/aws/aws-cdk/commit/e5c616f73eac395492636341f57fb6a716d1ea69)), closes [#11952](https://github.com/aws/aws-cdk/issues/11952) [#11420](https://github.com/aws/aws-cdk/issues/11420) [#9053](https://github.com/aws/aws-cdk/issues/9053)
* **pipelines:** assets broken in Pipelines synthesized from Windows ([#12573](https://github.com/aws/aws-cdk/issues/12573)) ([5c3dce5](https://github.com/aws/aws-cdk/commit/5c3dce56c71083321069a31213aaa5bce40f51d3)), closes [#12540](https://github.com/aws/aws-cdk/issues/12540)
* **pipelines:** can't use CodePipeline variables in Synth environment variables ([#12602](https://github.com/aws/aws-cdk/issues/12602)) ([736b260](https://github.com/aws/aws-cdk/commit/736b260db7f21d89e220591007580f62b22fea3a)), closes [#12061](https://github.com/aws/aws-cdk/issues/12061) [#11178](https://github.com/aws/aws-cdk/issues/11178)
* **pipelines:** unable to publish assets inside VPC ([#12331](https://github.com/aws/aws-cdk/issues/12331)) ([a16f09c](https://github.com/aws/aws-cdk/commit/a16f09c9ea675caf5b1e50a4e1cc288e5afd1237)), closes [#11815](https://github.com/aws/aws-cdk/issues/11815)
* **s3-deployment:** User metadata keys have redundant triple `x-amz` prefix ([#12414](https://github.com/aws/aws-cdk/issues/12414)) ([6716181](https://github.com/aws/aws-cdk/commit/671618152dc585ef0703f6c3501f6ee5a366b4a9)), closes [#8459](https://github.com/aws/aws-cdk/issues/8459)
* **secretsmanager:** fromSecretPartialArn() has incorrect grant policies ([#12665](https://github.com/aws/aws-cdk/issues/12665)) ([560915e](https://github.com/aws/aws-cdk/commit/560915ece87a919f499a64452b919a0b291394ee)), closes [#12411](https://github.com/aws/aws-cdk/issues/12411)

## [1.86.0](https://github.com/aws/aws-cdk/compare/v1.85.0...v1.86.0) (2021-01-21)


### Features

* **cfnspec:** cloudformation spec v24.0.0 ([#12615](https://github.com/aws/aws-cdk/issues/12615)) ([98ebe96](https://github.com/aws/aws-cdk/commit/98ebe964fcd1f528fc4796bf39dc574b222b0014)), closes [#12474](https://github.com/aws/aws-cdk/issues/12474)
* **cognito:** allow to set read and write attributes in Cognito UserPoolClient ([#7607](https://github.com/aws/aws-cdk/issues/7607)) ([552e1e9](https://github.com/aws/aws-cdk/commit/552e1e9d649528875680a8a1cb2aad8f0a0ebcea)), closes [#7407](https://github.com/aws/aws-cdk/issues/7407)
* **ec2:** Support for new EBS types ([#12074](https://github.com/aws/aws-cdk/issues/12074)) ([6a2ce55](https://github.com/aws/aws-cdk/commit/6a2ce55e7213bb8356f2f37dbd02f1a3d52883be)), closes [#12071](https://github.com/aws/aws-cdk/issues/12071)
* **s3:** Bucket keys  ([#12376](https://github.com/aws/aws-cdk/issues/12376)) ([d126fcc](https://github.com/aws/aws-cdk/commit/d126fcca685346c0607babfbbf4d341f669a9e81)), closes [#11828](https://github.com/aws/aws-cdk/issues/11828)


### Bug Fixes

* **apigateway:** cannot remove first api key from usage plan ([#12505](https://github.com/aws/aws-cdk/issues/12505)) ([96cbe32](https://github.com/aws/aws-cdk/commit/96cbe32d2399d82a2ad6c3bf6dc1fd65396882d4)), closes [#11876](https://github.com/aws/aws-cdk/issues/11876)
* **aws-ecs:** Invalid user data defined for windows autoscaling groups ([#12585](https://github.com/aws/aws-cdk/issues/12585)) ([638b995](https://github.com/aws/aws-cdk/commit/638b995cb72b0819a1965a7ccf451b6ed9034a1b)), closes [#12583](https://github.com/aws/aws-cdk/issues/12583)
* **synthetics:** default execution role breaks in non aws partitions ([#12096](https://github.com/aws/aws-cdk/issues/12096)) ([c01272c](https://github.com/aws/aws-cdk/commit/c01272c14be9b7ff635281952f3cfeed971a352e)), closes [#12094](https://github.com/aws/aws-cdk/issues/12094)

## [2.0.0-alpha.1](https://github.com/aws/aws-cdk/compare/v1.85.0...v2.0.0-alpha.1) (2021-01-21)


### Features

* remove the construct compatibility layer ([#12054](https://github.com/aws/aws-cdk/issues/12054)) ([8d3c02c](https://github.com/aws/aws-cdk/commit/8d3c02c117072433bf649003af0c4fee4a1f8c4b))
* **elasticsearch:** UltraWarm nodes ([#12265](https://github.com/aws/aws-cdk/issues/12265)) ([3a9056d](https://github.com/aws/aws-cdk/commit/3a9056d87b0c739247013fc74678ab54fd3eb382)), closes [#6462](https://github.com/aws/aws-cdk/issues/6462)


### Bug Fixes

* **ec2:** Vpc.fromVpcAttributes cannot be used with EKS ([#12569](https://github.com/aws/aws-cdk/issues/12569)) ([1cdc244](https://github.com/aws/aws-cdk/commit/1cdc244e940396c962147d4e3ada4a0722923321)), closes [#12040](https://github.com/aws/aws-cdk/issues/12040) [#12160](https://github.com/aws/aws-cdk/issues/12160)
* **iam:** Groups are erroneously accepted as the Principal of a policy ([#11479](https://github.com/aws/aws-cdk/issues/11479)) ([#12549](https://github.com/aws/aws-cdk/issues/12549)) ([c9b0859](https://github.com/aws/aws-cdk/commit/c9b085996319e8d4d7d2db19184fb2f2148889a3))

## [2.0.0-alpha.0](https://github.com/aws/aws-cdk/compare/v1.77.0...v2.0.0-alpha.0) (2020-12-11)


### Bug Fixes

* **scripts:** lerna not found in merge-forward ([#11672](https://github.com/aws/aws-cdk/issues/11672)) ([b1a8e33](https://github.com/aws/aws-cdk/commit/b1a8e336c94f7d2a93a023d6dc853d23934bfa06))

## 2.0.0-alpha.0 (2020-12-11)

This is the first alpha release of CDK 2.0. 🎉 
