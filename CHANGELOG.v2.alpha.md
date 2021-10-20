# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [2.0.0-alpha.2](https://github.com/aws/aws-cdk/compare/v2.0.0-alpha.1...v2.0.0-alpha.2) (2021-10-20)


### Features

* **apigatewayv2-integrations:** http api - support for request parameter mapping ([#15630](https://github.com/aws/aws-cdk/issues/15630)) ([0452aed](https://github.com/aws/aws-cdk/commit/0452aed2f00198e05bd65b1d20246f7de0b24e20))
* **msk:** add Kafka version 2.8.1 ([#16881](https://github.com/aws/aws-cdk/issues/16881)) ([7db5c8c](https://github.com/aws/aws-cdk/commit/7db5c8cdafe7b9b22b6b40cb25ed8bd1946301f4))


### Bug Fixes

* **apigatewayv2:** unable to retrieve domain url for default stage ([#16854](https://github.com/aws/aws-cdk/issues/16854)) ([c6db91e](https://github.com/aws/aws-cdk/commit/c6db91eee2cb658ce347c7ac6d6e3c95bc5977dc)), closes [#16638](https://github.com/aws/aws-cdk/issues/16638)

## [2.0.0-alpha.1](https://github.com/aws/aws-cdk/compare/v2.0.0-alpha.0...v2.0.0-alpha.1) (2021-10-13)


### ⚠ BREAKING CHANGES TO EXPERIMENTAL FEATURES

* **assertions:** Starting this release, the `assertions` module will be
published to Maven with the name 'assertions' instead of
'cdk-assertions'.
* **assertions:** `Match.absentProperty()` becomes `Match.absent()`, and its type changes from `string` to `Matcher`.
* **assertions:** The `templateMatches()` API previously performed
an exact match. The default behavior has been updated to be
"object-like".
* **assertions:** the `findResources()` API previously returned a list of resources, but now returns a map of logical id to resource.
* **assertions:** the `findOutputs()` API previously returned a list of outputs, but now returns a map of logical id to output.
* **assertions:** the `findMappings()` API previously returned a list of mappings, but now returns a map of logical id to mapping.

### Features

* **appsync:** Lambda Authorizer for AppSync GraphqlApi ([#16743](https://github.com/aws/aws-cdk/issues/16743)) ([bdbe8b6](https://github.com/aws/aws-cdk/commit/bdbe8b6cf6ab1ae261dddeb39576749e768183b3)), closes [#16380](https://github.com/aws/aws-cdk/issues/16380)
* **assertions:** capture matching value ([#16426](https://github.com/aws/aws-cdk/issues/16426)) ([cc74f92](https://github.com/aws/aws-cdk/commit/cc74f92f275a338cb53caa7d6f124ab0dd960f0b))
* **assertions:** findXxx() APIs now includes the logical id as part of its result ([#16454](https://github.com/aws/aws-cdk/issues/16454)) ([532a72b](https://github.com/aws/aws-cdk/commit/532a72b133e6ebd0c7b8b7c65b273bb0e6f3293c))
* **assertions:** match into serialized json ([#16456](https://github.com/aws/aws-cdk/issues/16456)) ([fed30fc](https://github.com/aws/aws-cdk/commit/fed30fc815bac1006003524ac6232778f3c3babe))
* **assertions:** matcher support for `templateMatches()` API ([#16789](https://github.com/aws/aws-cdk/issues/16789)) ([0fb2179](https://github.com/aws/aws-cdk/commit/0fb21799b0da3185c2d4ba91a8ef9729c71fbd5a))
* **aws-apprunner:** support the Service L2 construct ([#15810](https://github.com/aws/aws-cdk/issues/15810)) ([3cea941](https://github.com/aws/aws-cdk/commit/3cea9419b6c02b3b5eb952b7e03b5a132e5e9630)), closes [#14813](https://github.com/aws/aws-cdk/issues/14813)
* **batch:** fargate support for jobs ([#15848](https://github.com/aws/aws-cdk/issues/15848)) ([066bcb1](https://github.com/aws/aws-cdk/commit/066bcb1e5d53192bd465190c8a4f81c5838987f4)), closes [#13591](https://github.com/aws/aws-cdk/issues/13591) [#13590](https://github.com/aws/aws-cdk/issues/13590) [#13591](https://github.com/aws/aws-cdk/issues/13591)
* **glue:** Job construct ([#12506](https://github.com/aws/aws-cdk/issues/12506)) ([fc74110](https://github.com/aws/aws-cdk/commit/fc74110ff7eae544d9cfc11b2f6779169f17d145)), closes [#12443](https://github.com/aws/aws-cdk/issues/12443)
* **neptune:** add engine version 1.0.5.0 ([#16394](https://github.com/aws/aws-cdk/issues/16394)) ([deaac4a](https://github.com/aws/aws-cdk/commit/deaac4a16e957bd046f24a6c26d735fc4cf980bd)), closes [#16388](https://github.com/aws/aws-cdk/issues/16388)
* **redshift:** manage database users and tables via cdk ([#15931](https://github.com/aws/aws-cdk/issues/15931)) ([a9d5118](https://github.com/aws/aws-cdk/commit/a9d51185a144cd4962c85227ae5b904510399fa4)), closes [#9815](https://github.com/aws/aws-cdk/issues/9815)


### Bug Fixes

* **apigatewayv2:** ApiMapping does not depend on DomainName ([#16201](https://github.com/aws/aws-cdk/issues/16201)) ([1e247d8](https://github.com/aws/aws-cdk/commit/1e247d89adbc09ff79b87753fcd78b238a6752e8)), closes [#15464](https://github.com/aws/aws-cdk/issues/15464)
* **assertions:** `hasResourceProperties` is incompatible with `Match.not` and `Match.absent` ([#16678](https://github.com/aws/aws-cdk/issues/16678)) ([6f0a507](https://github.com/aws/aws-cdk/commit/6f0a5076b1e074fd33ed118af8e48b72d7593418)), closes [#16626](https://github.com/aws/aws-cdk/issues/16626)
* **aws-servicecatalog:** Allow users to create multiple product versions from assets.  ([#16914](https://github.com/aws/aws-cdk/issues/16914)) ([958d755](https://github.com/aws/aws-cdk/commit/958d755ff7acaf016e3f8969bf5ab07d4dc2977b))
* **route53resolver:** FirewallDomainList throws with wildcard domains ([#16538](https://github.com/aws/aws-cdk/issues/16538)) ([643e5ee](https://github.com/aws/aws-cdk/commit/643e5ee519095968a758942220f1e3a6c20f54b3)), closes [#16527](https://github.com/aws/aws-cdk/issues/16527)


### Miscellaneous Chores

* **assertions:** consistent naming in maven ([#16921](https://github.com/aws/aws-cdk/issues/16921)) ([0dcd9ec](https://github.com/aws/aws-cdk/commit/0dcd9eca3a1014c39f92d9e052b67974fc751af0))
* **assertions:** replace `absentProperty()` with `absent()` and support it as a `Matcher` type ([#16653](https://github.com/aws/aws-cdk/issues/16653)) ([c980185](https://github.com/aws/aws-cdk/commit/c980185142c58821b7ae7ef0b88c6c98ca8f0246))
