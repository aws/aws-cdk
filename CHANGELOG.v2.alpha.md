# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [2.0.0-alpha.1](https://github.com/aws/aws-cdk/compare/v2.0.0-alpha.0...v2.0.0-alpha.1) (2021-09-29)


### ⚠ BREAKING CHANGES TO EXPERIMENTAL FEATURES

* **assertions:** the `findResources()` API previously returned a list of resources, but now returns a map of logical id to resource.
* **assertions:** the `findOutputs()` API previously returned a list of outputs, but now returns a map of logical id to output.
* **assertions:** the `findMappings()` API previously returned a list of mappings, but now returns a map of logical id to mapping.

### Features

* **assertions:** capture matching value ([#16426](https://github.com/aws/aws-cdk/issues/16426)) ([cc74f92](https://github.com/aws/aws-cdk/commit/cc74f92f275a338cb53caa7d6f124ab0dd960f0b))
* **assertions:** findXxx() APIs now includes the logical id as part of its result ([#16454](https://github.com/aws/aws-cdk/issues/16454)) ([532a72b](https://github.com/aws/aws-cdk/commit/532a72b133e6ebd0c7b8b7c65b273bb0e6f3293c))
* **assertions:** match into serialized json ([#16456](https://github.com/aws/aws-cdk/issues/16456)) ([fed30fc](https://github.com/aws/aws-cdk/commit/fed30fc815bac1006003524ac6232778f3c3babe))
* **batch:** fargate support for jobs ([#15848](https://github.com/aws/aws-cdk/issues/15848)) ([066bcb1](https://github.com/aws/aws-cdk/commit/066bcb1e5d53192bd465190c8a4f81c5838987f4)), closes [#13591](https://github.com/aws/aws-cdk/issues/13591) [#13590](https://github.com/aws/aws-cdk/issues/13590) [#13591](https://github.com/aws/aws-cdk/issues/13591)
* **glue:** Job construct ([#12506](https://github.com/aws/aws-cdk/issues/12506)) ([fc74110](https://github.com/aws/aws-cdk/commit/fc74110ff7eae544d9cfc11b2f6779169f17d145)), closes [#12443](https://github.com/aws/aws-cdk/issues/12443)
* **neptune:** add engine version 1.0.5.0 ([#16394](https://github.com/aws/aws-cdk/issues/16394)) ([deaac4a](https://github.com/aws/aws-cdk/commit/deaac4a16e957bd046f24a6c26d735fc4cf980bd)), closes [#16388](https://github.com/aws/aws-cdk/issues/16388)
* **redshift:** manage database users and tables via cdk ([#15931](https://github.com/aws/aws-cdk/issues/15931)) ([a9d5118](https://github.com/aws/aws-cdk/commit/a9d51185a144cd4962c85227ae5b904510399fa4)), closes [#9815](https://github.com/aws/aws-cdk/issues/9815)


### Bug Fixes

* **apigatewayv2:** ApiMapping does not depend on DomainName ([#16201](https://github.com/aws/aws-cdk/issues/16201)) ([1e247d8](https://github.com/aws/aws-cdk/commit/1e247d89adbc09ff79b87753fcd78b238a6752e8)), closes [#15464](https://github.com/aws/aws-cdk/issues/15464)
* **route53resolver:** FirewallDomainList throws with wildcard domains ([#16538](https://github.com/aws/aws-cdk/issues/16538)) ([643e5ee](https://github.com/aws/aws-cdk/commit/643e5ee519095968a758942220f1e3a6c20f54b3)), closes [#16527](https://github.com/aws/aws-cdk/issues/16527)
