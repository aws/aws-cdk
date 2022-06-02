# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [2.27.0-alpha.0](https://github.com/aws/aws-cdk/compare/v2.26.0-alpha.0...v2.27.0-alpha.0) (2022-06-02)


### Features

* **integ-runner:** publish integ-runner cli ([#20477](https://github.com/aws/aws-cdk/issues/20477)) ([7779531](https://github.com/aws/aws-cdk/commit/777953106ac550b058fdaa3ccde25b62be07defa))


### Bug Fixes

* **integ-runner:** catch snapshot errors, treat `--from-file` as command-line ([#20523](https://github.com/aws/aws-cdk/issues/20523)) ([cedfde8](https://github.com/aws/aws-cdk/commit/cedfde8cb07eb879ee384bda93bba813ede91699))
* **integ-runner:** don't throw error if tests pass ([#20511](https://github.com/aws/aws-cdk/issues/20511)) ([c274c2f](https://github.com/aws/aws-cdk/commit/c274c2f983de2dfd20ed2886a3c50f7fd3f6b3f4)), closes [#20384](https://github.com/aws/aws-cdk/issues/20384)

## [2.26.0-alpha.0](https://github.com/aws/aws-cdk/compare/v2.25.0-alpha.0...v2.26.0-alpha.0) (2022-05-27)


### Features

* **apprunner:** VpcConnector construct ([#20471](https://github.com/aws/aws-cdk/issues/20471)) ([5052191](https://github.com/aws/aws-cdk/commit/50521911f22f433323d700db77530e883762138a))


### Bug Fixes

* **integ-runner:** always resynth on deploy ([#20508](https://github.com/aws/aws-cdk/issues/20508)) ([7138057](https://github.com/aws/aws-cdk/commit/71380571b878a50fe4b754c7dac78da075a98242))
* **integ-tests:** DeployAssert should be private ([#20466](https://github.com/aws/aws-cdk/issues/20466)) ([0f52813](https://github.com/aws/aws-cdk/commit/0f52813bcf6a48c352f697004a899461dd06935d))

## [2.25.0-alpha.0](https://github.com/aws/aws-cdk/compare/v2.24.1-alpha.0...v2.25.0-alpha.0) (2022-05-20)


### Features

* **cloud9:** configure Connection Type of Ec2Environment ([#20250](https://github.com/aws/aws-cdk/issues/20250)) ([01708bc](https://github.com/aws/aws-cdk/commit/01708bc7cf842eab7e1d1fc58bf42e4724624c0a)), closes [#17027](https://github.com/aws/aws-cdk/issues/17027)
* **integ-tests:** enhancements to integ-tests ([#20180](https://github.com/aws/aws-cdk/issues/20180)) ([3ff3fb7](https://github.com/aws/aws-cdk/commit/3ff3fb7c5ec9636022b3046036376c09a3166fb0))


### Bug Fixes

* **amplify:** custom headers break with tokens ([#20395](https://github.com/aws/aws-cdk/issues/20395)) ([765f441](https://github.com/aws/aws-cdk/commit/765f44177298b645c88a29587b52619e91a8757c))

## [2.24.1-alpha.0](https://github.com/aws/aws-cdk/compare/v2.24.0-alpha.0...v2.24.1-alpha.0) (2022-05-12)

## [2.24.0-alpha.0](https://github.com/aws/aws-cdk/compare/v2.23.0-alpha.0...v2.24.0-alpha.0) (2022-05-11)


### Bug Fixes

* **appsync:** incorrect region used for imported Cognito user pool ([#20193](https://github.com/aws/aws-cdk/issues/20193)) ([3e0393e](https://github.com/aws/aws-cdk/commit/3e0393e63e84d631545734425482deae687520f1)), closes [#20195](https://github.com/aws/aws-cdk/issues/20195)

## [2.23.0-alpha.0](https://github.com/aws/aws-cdk/compare/v2.22.0-alpha.0...v2.23.0-alpha.0) (2022-05-04)


### Features

* **redshift:** expose user.secret as property ([#17520](https://github.com/aws/aws-cdk/issues/17520)) ([#20078](https://github.com/aws/aws-cdk/issues/20078)) ([8da006a](https://github.com/aws/aws-cdk/commit/8da006ab551213ecbdb6dc26860fe90c1d2e95e2))


### Bug Fixes

* **integ-runner:** disable-update-workflow default is 'false' instead of false ([#20073](https://github.com/aws/aws-cdk/issues/20073)) ([9f7aa65](https://github.com/aws/aws-cdk/commit/9f7aa654ab92c16743b015f7121a3dc542a7e01a))
* **integ-runner:** only diff registered stacks ([#20100](https://github.com/aws/aws-cdk/issues/20100)) ([721bd4b](https://github.com/aws/aws-cdk/commit/721bd4b24de8e410fd9181eff7e5431c13bad208))

## [2.22.0-alpha.0](https://github.com/aws/aws-cdk/compare/v2.21.1-alpha.0...v2.22.0-alpha.0) (2022-04-27)


### Features

* **integ-tests:** add `IntegTest` to group test cases ([#20015](https://github.com/aws/aws-cdk/issues/20015)) ([b4f8d91](https://github.com/aws/aws-cdk/commit/b4f8d91318087135c5549c22b43a1e679d70b3ca))
* **integ-tests:** make assertions on deployed infrastructure ([#20071](https://github.com/aws/aws-cdk/issues/20071)) ([8362efe](https://github.com/aws/aws-cdk/commit/8362efe8f1951289236034161d7560f20975b0ec))


### Bug Fixes

* **lambda-python:** handler path is incorrectly generated when using PythonFunction ([#20083](https://github.com/aws/aws-cdk/issues/20083)) ([6787376](https://github.com/aws/aws-cdk/commit/678737607cea769109aa8315520a71bc47eb50ef))
* **lambda-python:** Pipenv projects no longer work for Python 3.6 ([#20019](https://github.com/aws/aws-cdk/issues/20019)) ([c5dcdeb](https://github.com/aws/aws-cdk/commit/c5dcdeb2742fc8f0d41a7211d74934e20a7442c2))
* **lambda-python:** Pipenv projects no longer work for Python 3.6 ([#20019](https://github.com/aws/aws-cdk/issues/20019)) ([5024021](https://github.com/aws/aws-cdk/commit/5024021bec9952ca7b1e3d82e2c257f124c6300c))

## [2.21.1-alpha.0](https://github.com/aws/aws-cdk/compare/v2.21.0-alpha.0...v2.21.1-alpha.0) (2022-04-22)

## [2.21.0-alpha.0](https://github.com/aws/aws-cdk/compare/v2.20.0-alpha.0...v2.21.0-alpha.0) (2022-04-22)


### Features

* **apigatewayv2:** set throttling on stages ([#19776](https://github.com/aws/aws-cdk/issues/19776)) ([3cabd10](https://github.com/aws/aws-cdk/commit/3cabd105288789c03d1a8d508637b2d7f46407a4)), closes [#19626](https://github.com/aws/aws-cdk/issues/19626)
* **integ-runner:** add missing features from the integ manifest ([#19969](https://github.com/aws/aws-cdk/issues/19969)) ([2ca5050](https://github.com/aws/aws-cdk/commit/2ca5050865f94e033fda850961439d8fcb01f468))
* **integ-runner:** integ-runner enhancements ([#19865](https://github.com/aws/aws-cdk/issues/19865)) ([697fdbe](https://github.com/aws/aws-cdk/commit/697fdbe71642c93492c38e834e654ed736a9edb4))
* **integ-runner:** test update path when running tests ([#19915](https://github.com/aws/aws-cdk/issues/19915)) ([d0ace8f](https://github.com/aws/aws-cdk/commit/d0ace8f2db53d56cdb670979c7c173ee17b6bcd8))
* **integ-tests:** Add `IntegTestCase` ([#19829](https://github.com/aws/aws-cdk/issues/19829)) ([ad249c9](https://github.com/aws/aws-cdk/commit/ad249c9943c2d602b2b077435935731f723db715))
* **iotevents:** support comparison operators ([#19329](https://github.com/aws/aws-cdk/issues/19329)) ([95cb3f3](https://github.com/aws/aws-cdk/commit/95cb3f3c7a4c98ebf4a4818af2f4e725fc16aa29))


### Bug Fixes

* **integ-runner:** enable all feature flags by default ([#19955](https://github.com/aws/aws-cdk/issues/19955)) ([ca3920d](https://github.com/aws/aws-cdk/commit/ca3920dbd588ebd9c68f17bfbf420713cf42790a))
* **lambda-python:** Pipenv projects no longer work for Python 3.6 ([#20019](https://github.com/aws/aws-cdk/issues/20019)) ([08cfc2d](https://github.com/aws/aws-cdk/commit/08cfc2d5a2e3727e692311b244b1fcb6c3b3f5f7))

## [2.20.0-alpha.0](https://github.com/aws/aws-cdk/compare/v2.19.0-alpha.0...v2.20.0-alpha.0) (2022-04-07)


### Features

* **synthetics:** new puppeteer 3.5 runtime ([#19673](https://github.com/aws/aws-cdk/issues/19673)) ([ce2b91b](https://github.com/aws/aws-cdk/commit/ce2b91b319da0221adffcdda54321b860db2a56d)), closes [#19634](https://github.com/aws/aws-cdk/issues/19634)

## [2.19.0-alpha.0](https://github.com/aws/aws-cdk/compare/v2.18.0-alpha.0...v2.19.0-alpha.0) (2022-03-31)


### Features

* **kinesisanalytics-flink:** Add metrics to Flink applications ([#19599](https://github.com/aws/aws-cdk/issues/19599)) ([dab6aca](https://github.com/aws/aws-cdk/commit/dab6aca5005c8d6d180aada699a4cebc2ef5aefa))

## [2.18.0-alpha.0](https://github.com/aws/aws-cdk/compare/v2.17.0-alpha.0...v2.18.0-alpha.0) (2022-03-28)


### Features

* **appsync:** support custom domain mappings ([#19368](https://github.com/aws/aws-cdk/issues/19368)) ([8c7a4ac](https://github.com/aws/aws-cdk/commit/8c7a4acbd58975a8f1c4e4ca180ca9a3ea2c750d)), closes [#18040](https://github.com/aws/aws-cdk/issues/18040)
* **synthetics:** add support for puppeteer 3.4 runtime ([#19429](https://github.com/aws/aws-cdk/issues/19429)) ([024b890](https://github.com/aws/aws-cdk/commit/024b890c67392e255ea8e82c1aa58bcc6bcf6f86)), closes [#19382](https://github.com/aws/aws-cdk/issues/19382)

## [2.17.0-alpha.0](https://github.com/aws/aws-cdk/compare/v2.16.0-alpha.0...v2.17.0-alpha.0) (2022-03-17)


### Features

* **appsync:** add OpenSearch domain data source ([#16529](https://github.com/aws/aws-cdk/issues/16529)) ([922a9dc](https://github.com/aws/aws-cdk/commit/922a9dcf07174334ac67b9fcbacb01aafdfd9c6a)), closes [#16528](https://github.com/aws/aws-cdk/issues/16528)
* **iotevents:** support SetVariable action ([#19305](https://github.com/aws/aws-cdk/issues/19305)) ([c222b12](https://github.com/aws/aws-cdk/commit/c222b122206e00dc9932639efd54d78a16ebf6d3))
* **synthetics:** add vpc configuration ([#18447](https://github.com/aws/aws-cdk/issues/18447)) ([c991e92](https://github.com/aws/aws-cdk/commit/c991e92453034330b68daa5b5721119e770b6109)), closes [#11865](https://github.com/aws/aws-cdk/issues/11865) [#9954](https://github.com/aws/aws-cdk/issues/9954)

## [2.16.0-alpha.0](https://github.com/aws/aws-cdk/compare/v2.15.0-alpha.0...v2.16.0-alpha.0) (2022-03-11)


### Features

* **aws-s3objectlambda:** add L2 construct for S3 Object Lambda ([#15833](https://github.com/aws/aws-cdk/issues/15833)) ([fe9f750](https://github.com/aws/aws-cdk/commit/fe9f750bd9dd9974b9ae6f73c78fcd12ab2edd91)), closes [#13675](https://github.com/aws/aws-cdk/issues/13675)
* **iotevents:** support actions ([#18869](https://github.com/aws/aws-cdk/issues/18869)) ([e01654e](https://github.com/aws/aws-cdk/commit/e01654e792708ee283d7a31e1370d0d1ae383171))
* **iotevents:** support setting Events on input and exit for State ([#19249](https://github.com/aws/aws-cdk/issues/19249)) ([ffa9e0d](https://github.com/aws/aws-cdk/commit/ffa9e0d287d0a86e1e0eb7dc2dec16d9f3e84450))
* **servicecatalog:** Service Catalog is now in Developer Preview ([#19204](https://github.com/aws/aws-cdk/issues/19204)) ([6dfc254](https://github.com/aws/aws-cdk/commit/6dfc254e1925597b4ef2ece9c132b1a0e580dd6d))


### Bug Fixes

* **apigatewayv2-integrations:** in case of multiple routes, only one execute permission is created ([#18716](https://github.com/aws/aws-cdk/issues/18716)) ([1e352ca](https://github.com/aws/aws-cdk/commit/1e352ca2ab458bfe4e1de6cf431166654ce9aa58))
* **lambda-python:** asset bundling fails on windows ([#19270](https://github.com/aws/aws-cdk/issues/19270)) ([0da57da](https://github.com/aws/aws-cdk/commit/0da57da9606d982788350a6257f0f0ed6e9fd92a)), closes [#18861](https://github.com/aws/aws-cdk/issues/18861)
* **lambda-python:** docker image gets built even when we don't need to bundle assets  ([#16192](https://github.com/aws/aws-cdk/issues/16192)) ([5dc61ea](https://github.com/aws/aws-cdk/commit/5dc61eabc0ea3e6294f83db5deb8528461a1d5bc)), closes [#14747](https://github.com/aws/aws-cdk/issues/14747)

## [2.15.0-alpha.0](https://github.com/aws/aws-cdk/compare/v2.14.0-alpha.0...v2.15.0-alpha.0) (2022-03-01)


### Bug Fixes

* **aws-lambda-python:** skip default docker build when image passed ([#19143](https://github.com/aws/aws-cdk/issues/19143)) ([7300f2e](https://github.com/aws/aws-cdk/commit/7300f2eee9e1593eef271d7a953edf80a8962e08)), closes [#18082](https://github.com/aws/aws-cdk/issues/18082)

## [2.14.0-alpha.0](https://github.com/aws/aws-cdk/compare/v2.13.0-alpha.0...v2.14.0-alpha.0) (2022-02-25)


### Features

* **apigatewayv2:** Import existing WebSocketApi from attributes ([#18958](https://github.com/aws/aws-cdk/issues/18958)) ([f203845](https://github.com/aws/aws-cdk/commit/f203845d26ae8333f467f1cb91ad965697087d85))

## [2.13.0-alpha.0](https://github.com/aws/aws-cdk/compare/v2.12.0-alpha.0...v2.13.0-alpha.0) (2022-02-18)


### Features

* **iot-actions:** add SNS publish action ([#18839](https://github.com/aws/aws-cdk/issues/18839)) ([3a39f6b](https://github.com/aws/aws-cdk/commit/3a39f6bf34eb428c527db1c614ed682c582821fb)), closes [#17700](https://github.com/aws/aws-cdk/issues/17700)
* **iotevents:** create new module for IoT Events actions ([#18956](https://github.com/aws/aws-cdk/issues/18956)) ([3533ea9](https://github.com/aws/aws-cdk/commit/3533ea9cb7ec7fd9e230abd27556a87d3559bdb8)), closes [/github.com/aws/aws-cdk/pull/18869#discussion_r802719713](https://github.com/aws//github.com/aws/aws-cdk/pull/18869/issues/discussion_r802719713)


### Bug Fixes

* **synthetics:** generated role has incorrect permissions for cloudwatch logs ([#18946](https://github.com/aws/aws-cdk/issues/18946)) ([f8bb85f](https://github.com/aws/aws-cdk/commit/f8bb85fad8f659a2b72d5d05d7a94c97765a76f8)), closes [#18910](https://github.com/aws/aws-cdk/issues/18910)

## [2.12.0-alpha.0](https://github.com/aws/aws-cdk/compare/v2.11.0-alpha.0...v2.12.0-alpha.0) (2022-02-08)


### Features

* **iotevents:** support transition events ([#18768](https://github.com/aws/aws-cdk/issues/18768)) ([ccc1988](https://github.com/aws/aws-cdk/commit/ccc198864f92620857da09c68013123e9cd3f01d)), closes [#17711](https://github.com/aws/aws-cdk/issues/17711)

## [2.11.0-alpha.0](https://github.com/aws/aws-cdk/compare/v2.10.0-alpha.0...v2.11.0-alpha.0) (2022-02-08)


### Features

* **amplify:** support performance mode in Branch ([#18598](https://github.com/aws/aws-cdk/issues/18598)) ([bdeb8eb](https://github.com/aws/aws-cdk/commit/bdeb8eb604f5012ce3180d2f6d887fed1834e4f4)), closes [#18557](https://github.com/aws/aws-cdk/issues/18557)
* **iot:** add Action to republish MQTT messages to another MQTT topic ([#18661](https://github.com/aws/aws-cdk/issues/18661)) ([7ac1215](https://github.com/aws/aws-cdk/commit/7ac121546776cae972bbfb89c2a11949762e7c47))
* **iotevents:** add grant method to Input class ([#18617](https://github.com/aws/aws-cdk/issues/18617)) ([e89688e](https://github.com/aws/aws-cdk/commit/e89688ec1dd7a3b072d23287cddcb73bccc16fd4))


### Bug Fixes

* **aws-appsync:** Strip unsupported characters from Lambda DataSource ([#18765](https://github.com/aws/aws-cdk/issues/18765)) ([bb8d6f6](https://github.com/aws/aws-cdk/commit/bb8d6f6bf5941b76ef0590c99fe8e26440e09c18))

## [2.10.0-alpha.0](https://github.com/aws/aws-cdk/compare/v2.9.0-alpha.0...v2.10.0-alpha.0) (2022-01-29)


### ⚠ BREAKING CHANGES TO EXPERIMENTAL FEATURES

* **servicecatalog:** `TagOptions` now have `scope` and `props` argument in constructor, and data is now passed via a `allowedValueForTags` field in props

### Features

* **iotevents:** add DetectorModel L2 Construct ([#18049](https://github.com/aws/aws-cdk/issues/18049)) ([d0960f1](https://github.com/aws/aws-cdk/commit/d0960f181e5f66daa1eb53be2190b7e62bd66030)), closes [#17711](https://github.com/aws/aws-cdk/issues/17711) [#17711](https://github.com/aws/aws-cdk/issues/17711)
* **iotevents:** allow setting description, evaluation method and key of DetectorModel ([#18644](https://github.com/aws/aws-cdk/issues/18644)) ([2eeaebc](https://github.com/aws/aws-cdk/commit/2eeaebc3cdc9c5c7ef3fa312b3d1abca265dcbb6))
* **lambda-python:** support setting environment vars for bundling ([#18635](https://github.com/aws/aws-cdk/issues/18635)) ([30e2233](https://github.com/aws/aws-cdk/commit/30e223333fef0b0d7f12287dab170a34e092d7fa))
* **servicecatalog:** Create TagOptions Construct ([#18314](https://github.com/aws/aws-cdk/issues/18314)) ([903c4b6](https://github.com/aws/aws-cdk/commit/903c4b6e4adf676fae42265a048dddd0e1386542)), closes [#17753](https://github.com/aws/aws-cdk/issues/17753)


### Bug Fixes

* **apigatewayv2:** websocket api: allow all methods in grant manage connections ([#18544](https://github.com/aws/aws-cdk/issues/18544)) ([41c8a3f](https://github.com/aws/aws-cdk/commit/41c8a3fa6b50a94affb65286d862056050d02e84)), closes [#18410](https://github.com/aws/aws-cdk/issues/18410)
* **synthetics:** correct getbucketlocation policy ([#13573](https://github.com/aws/aws-cdk/issues/13573)) ([e743525](https://github.com/aws/aws-cdk/commit/e743525b6379371110d737bb360f637c41d30ca1)), closes [#13572](https://github.com/aws/aws-cdk/issues/13572)

## [2.9.0-alpha.0](https://github.com/aws/aws-cdk/compare/v2.8.0-alpha.0...v2.9.0-alpha.0) (2022-01-26)


### Features

* **aws-neptune:** add autoMinorVersionUpgrade to cluster props ([#18394](https://github.com/aws/aws-cdk/issues/18394)) ([8b5320a](https://github.com/aws/aws-cdk/commit/8b5320ac5e5c320db46bc74f33b3841977dd3a5d)), closes [#17545](https://github.com/aws/aws-cdk/issues/17545)
* **iot:** add Action to put record to Kinesis Data stream ([#18321](https://github.com/aws/aws-cdk/issues/18321)) ([1480213](https://github.com/aws/aws-cdk/commit/1480213a032549ab7319e0c3a66e02e9b6a9c4ab)), closes [#17703](https://github.com/aws/aws-cdk/issues/17703)

## [2.8.0-alpha.0](https://github.com/aws/aws-cdk/compare/v2.7.0-alpha.0...v2.8.0-alpha.0) (2022-01-13)


### ⚠ BREAKING CHANGES TO EXPERIMENTAL FEATURES

* **apigatewayv2:** `HttpIntegrationType.LAMBDA_PROXY` has been renamed to `HttpIntegrationType.AWS_PROXY`

### Features

* **apigatewayv2:** HttpRouteIntegration supports AWS services integrations ([#18154](https://github.com/aws/aws-cdk/issues/18154)) ([a8094c7](https://github.com/aws/aws-cdk/commit/a8094c7d9970557077f560ccd24882216094ee3c)), closes [#16287](https://github.com/aws/aws-cdk/issues/16287)
* **apigatewayv2:** support for mock integration type ([#18129](https://github.com/aws/aws-cdk/issues/18129)) ([7779c14](https://github.com/aws/aws-cdk/commit/7779c147c7445d9e8ccafa9b732521c9021a6234)), closes [#15008](https://github.com/aws/aws-cdk/issues/15008)

## [2.7.0-alpha.0](https://github.com/aws/aws-cdk/compare/v2.6.0-alpha.0...v2.7.0-alpha.0) (2022-01-12)


### ⚠ BREAKING CHANGES TO EXPERIMENTAL FEATURES

* **iot:** the class `FirehoseStreamAction` has been renamed to `FirehosePutRecordAction`
* **apigatewayv2-authorizers:** `WebSocketLambdaAuthorizerProps.identitySource` default changes from `['$request.header.Authorization']` to `['route.request.header.Authorization']`.

### Features

* **apigatewayv2:** websocket api: api keys ([#16636](https://github.com/aws/aws-cdk/issues/16636)) ([24f8f74](https://github.com/aws/aws-cdk/commit/24f8f74ebec023f5e3f5bd2bdfc89575a53b38f3))


### Bug Fixes

* **apigatewayv2-authorizers:** incorrect `identitySource` default for `WebSocketLambdaAuthorizer` ([#18315](https://github.com/aws/aws-cdk/issues/18315)) ([74eee1e](https://github.com/aws/aws-cdk/commit/74eee1e5b8fa404dde129f001b986d615f435c73)), closes [#16886](https://github.com/aws/aws-cdk/issues/16886) [/docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-authorizer.html#cfn-apigatewayv2](https://github.com/aws//docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-authorizer.html/issues/cfn-apigatewayv2) [#18307](https://github.com/aws/aws-cdk/issues/18307)
* **iot:** `FirehoseStreamAction` is now called `FirehosePutRecordAction` ([#18356](https://github.com/aws/aws-cdk/issues/18356)) ([c016a9f](https://github.com/aws/aws-cdk/commit/c016a9fcf51f2415e6e0fcca2255da384c8abbc1)), closes [/github.com/aws/aws-cdk/pull/18321#discussion_r781620195](https://github.com/aws//github.com/aws/aws-cdk/pull/18321/issues/discussion_r781620195)
* **lambda-python:** asset files are generated inside the 'asset-input' folder ([#18306](https://github.com/aws/aws-cdk/issues/18306)) ([b00b44e](https://github.com/aws/aws-cdk/commit/b00b44efd6e402744725e711906b456a28cebc5b))
* **lambda-python:** asset files are generated inside the 'asset-input' folder ([#18306](https://github.com/aws/aws-cdk/issues/18306)) ([aff607a](https://github.com/aws/aws-cdk/commit/aff607a65e061ade5c3ec9e29f82fdaa8b57f638))
* **lambda-python:** bundle asset files correctly ([#18335](https://github.com/aws/aws-cdk/issues/18335)) ([3822c85](https://github.com/aws/aws-cdk/commit/3822c855cf92ee0cd4539dee33e55f57d995bf89)), closes [/github.com/aws/aws-cdk/pull/18306#discussion_r780186564](https://github.com/aws//github.com/aws/aws-cdk/pull/18306/issues/discussion_r780186564) [#18301](https://github.com/aws/aws-cdk/issues/18301) [/github.com/aws/aws-cdk/pull/18082#issuecomment-1008442363](https://github.com/aws//github.com/aws/aws-cdk/pull/18082/issues/issuecomment-1008442363)

## [2.6.0-alpha.0](https://github.com/aws/aws-cdk/compare/v2.5.0-alpha.0...v2.6.0-alpha.0) (2022-01-12)


### Bug Fixes

* **lambda-python:** asset files are generated inside the 'asset-input' folder (backport [#18306](https://github.com/aws/aws-cdk/issues/18306)) ([#18341](https://github.com/aws/aws-cdk/issues/18341)) ([a1715e4](https://github.com/aws/aws-cdk/commit/a1715e42944ba8a1d06513d288f2d28ca94eeccf))

## [2.5.0-alpha.0](https://github.com/aws/aws-cdk/compare/v2.4.0-alpha.0...v2.5.0-alpha.0) (2022-01-09)

## [2.4.0-alpha.0](https://github.com/aws/aws-cdk/compare/v2.3.0-alpha.0...v2.4.0-alpha.0) (2022-01-06)


### ⚠ BREAKING CHANGES TO EXPERIMENTAL FEATURES

* **lambda-python:** `assetHashType` and `assetHash` properties moved to new `bundling` property.
* **lambda-python:** Runtime is now required for `LambdaPython`
* **appsync:** The `CachingConfig#ttl` property is now required. 

[1]: https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-resolver-cachingconfig.html#cfn-appsync-resolver-cachingconfig-ttl

### Features

* **amplify:** Add Amplify asset deployment resource  ([#16922](https://github.com/aws/aws-cdk/issues/16922)) ([499ba85](https://github.com/aws/aws-cdk/commit/499ba857e75aa54aa90606f22b984692c8271152)), closes [#16208](https://github.com/aws/aws-cdk/issues/16208)
* **apigatewayv2:** http api - IAM authorizer support ([#17519](https://github.com/aws/aws-cdk/issues/17519)) ([fd8e0e3](https://github.com/aws/aws-cdk/commit/fd8e0e33816cb46678f7d1beac80b1623cdb6bac)), closes [#15123](https://github.com/aws/aws-cdk/issues/15123) [/github.com/aws/aws-cdk/pull/14853#discussion_r648952691](https://github.com/aws//github.com/aws/aws-cdk/pull/14853/issues/discussion_r648952691) [#10534](https://github.com/aws/aws-cdk/issues/10534)
* **apigatewayv2:** Lambda authorizer for WebSocket API  ([#16886](https://github.com/aws/aws-cdk/issues/16886)) ([67cce37](https://github.com/aws/aws-cdk/commit/67cce37f8ea3e6096e44a926fe61441dfcbc685b)), closes [#13869](https://github.com/aws/aws-cdk/issues/13869)
* **glue:** support partition index on tables ([#17998](https://github.com/aws/aws-cdk/issues/17998)) ([c071367](https://github.com/aws/aws-cdk/commit/c071367def4382c630057546c74fa56f00d9294c)), closes [#17589](https://github.com/aws/aws-cdk/issues/17589)
* **iot:** Action to send messages to SQS queues ([#18087](https://github.com/aws/aws-cdk/issues/18087)) ([37537fe](https://github.com/aws/aws-cdk/commit/37537fe1c1b016ae226bf7bc4ceeb128d6124872)), closes [#17699](https://github.com/aws/aws-cdk/issues/17699)
* **iot:** add Action to set a CloudWatch alarm ([#18021](https://github.com/aws/aws-cdk/issues/18021)) ([de2369c](https://github.com/aws/aws-cdk/commit/de2369c1d64260ed47cccfc2619320123af64a0f)), closes [#17705](https://github.com/aws/aws-cdk/issues/17705)
* **lambda-python:** support for providing a custom bundling docker image ([#18082](https://github.com/aws/aws-cdk/issues/18082)) ([c3c4a97](https://github.com/aws/aws-cdk/commit/c3c4a97e65071fcab35212be82dea7b29454786f)), closes [#10298](https://github.com/aws/aws-cdk/issues/10298) [#12949](https://github.com/aws/aws-cdk/issues/12949) [#15391](https://github.com/aws/aws-cdk/issues/15391) [#16234](https://github.com/aws/aws-cdk/issues/16234) [#15306](https://github.com/aws/aws-cdk/issues/15306)
* **msk:** add Kafka versions 2.6.3, 2.7.1 and 2.7.2 ([#18191](https://github.com/aws/aws-cdk/issues/18191)) ([8832df1](https://github.com/aws/aws-cdk/commit/8832df1d7497ef67b9ec62110d2f371ffe4781aa))


### Bug Fixes

* **amplify:** deploy asset Custom Resource points to TS file ([#18166](https://github.com/aws/aws-cdk/issues/18166)) ([a1508af](https://github.com/aws/aws-cdk/commit/a1508afab55c3ba0aa88b6aa85ca947badacb4a9))
* **appsync:** `ttl` property of `CachingConfig` is not required ([#17981](https://github.com/aws/aws-cdk/issues/17981)) ([73e5fec](https://github.com/aws/aws-cdk/commit/73e5fec36cb149cf666320afbe63308c968c62dd))
* **lambda-python:** runtime is now required ([#18143](https://github.com/aws/aws-cdk/issues/18143)) ([98f1bb1](https://github.com/aws/aws-cdk/commit/98f1bb147624a942773d191344c8d7242adb8d04)), closes [#10248](https://github.com/aws/aws-cdk/issues/10248)

## [2.3.0-alpha.0](https://github.com/aws/aws-cdk/compare/v2.2.0-alpha.0...v2.3.0-alpha.0) (2021-12-22)

## [2.2.0-alpha.0](https://github.com/aws/aws-cdk/compare/v2.1.0-alpha.0...v2.2.0-alpha.0) (2021-12-15)


### ⚠ BREAKING CHANGES TO EXPERIMENTAL FEATURES

* **glue:** the grantRead API previously included 'glue:BatchDeletePartition', and now it does not.


 

### Features

* **iotevents:** add IoT Events input L2 Construct ([#17847](https://github.com/aws/aws-cdk/issues/17847)) ([9f03dc4](https://github.com/aws/aws-cdk/commit/9f03dc4c5b75225942037fb6c8fa7d6abf35fe11)), closes [/github.com/aws/aws-cdk/issues/17711#issuecomment-986153267](https://github.com/aws//github.com/aws/aws-cdk/issues/17711/issues/issuecomment-986153267)


### Bug Fixes

* **appsync:** empty caching config is created when not provided ([#17947](https://github.com/aws/aws-cdk/issues/17947)) ([3a9f206](https://github.com/aws/aws-cdk/commit/3a9f20669cc8338d05f9ef8684aa7e50748baa3d))
* **glue:** remove `batchDeletePartition` from `grantRead()` permissions ([#17941](https://github.com/aws/aws-cdk/issues/17941)) ([3d64f9b](https://github.com/aws/aws-cdk/commit/3d64f9b8c07e83d4a085e3eaf69629a866bc20d0)), closes [#17935](https://github.com/aws/aws-cdk/issues/17935) [#15116](https://github.com/aws/aws-cdk/issues/15116)

## [2.1.0-alpha.0](https://github.com/aws/aws-cdk/compare/v2.0.0-alpha.11...v2.1.0-alpha.0) (2021-12-08)


### ⚠ BREAKING CHANGES TO EXPERIMENTAL FEATURES

* **apigatewayv2-authorizers:** The default value for the prop `authorizerName`
in `HttpJwtAuthorizerProps` has changed.
* **apigatewayv2-authorizers:** `HttpJwtAuthorizer` now takes the
  construct id and the target jwt issuer as part of its constructor.
* **apigatewayv2-authorizers:** `HttpLambdaAuthorizer` now takes
  the construct id and the target lambda function handler as part of
  its constructor.
* **apigatewayv2-authorizers:** The default value for the prop
  `authorizerName` in `HttpUserPoolAuthorizerProps` has changed.
* **apigatewayv2:** The `HttpIntegration` and `WebSocketIntegration`
classes require an "id" parameter to be provided during its initialization.
* **apigatewayv2-integrations:** The `LambdaWebSocketIntegration` is now
  renamed to `WebSocketLambdaIntegration`. The new class accepts the
  handler to the target lambda function directly in its constructor.
* **apigatewayv2-integrations:** `HttpProxyIntegration` and
  `HttpProxyIntegrationProps` are now renamed to `HttpUrlIntegration`
  and `HttpUrlIntegrationProps` respectively. The new class accepts the
  target url directly in its constructor.
* **apigatewayv2-integrations:** `LambdaProxyIntegration` and
  `LambdaProxyIntegrationProps` are now renamed to
  `HttpLambdaIntegration` and `HttpLambdaIntegrationProps` respectively.
  The new class accepts the lambda function handler directly in its
  constructor.
* **apigatewayv2-integrations:** `HttpAlbIntegration` now accepts the
  ELB listener directly in its constructor.
* **apigatewayv2-integrations:** `HttpNlbIntegration` now accepts the
  ELB listener directly in its constructor.
* **apigatewayv2-integrations:** `HttpServiceDiscoveryIntegration` now
  accepts the service discovery Service directly in its constructor.
* **apigatewayv2-authorizers:** `UserPoolAuthorizerProps` is now
  renamed to `HttpUserPoolAuthorizerProps`.
* **apigatewayv2:** The interface `IHttpRouteIntegration` is replaced by
the abstract class `HttpRouteIntegration`.
* **apigatewayv2:** The interface `IWebSocketRouteIntegration` is now
  replaced by the abstract class `WebSocketRouteIntegration`.
* **apigatewayv2:** Previously, we allowed the usage of integration
  classes to be used with routes defined in multiple `HttpApi` instances
  (or `WebSocketApi` instances). This is now disallowed, and separate
  instances must be created for each instance of `HttpApi` or
  `WebSocketApi`.

### Features

* **iot:** add Action to capture CloudWatch metrics ([#17503](https://github.com/aws/aws-cdk/issues/17503)) ([ec4187c](https://github.com/aws/aws-cdk/commit/ec4187c26d68df970d72d0e766d7d27b42e8b784)), closes [/github.com/aws/aws-cdk/pull/16681#issuecomment-942233029](https://github.com/aws//github.com/aws/aws-cdk/pull/16681/issues/issuecomment-942233029)
* **neptune:** add engine version 1.1.0.0 and instance types t4g, r6g ([#17669](https://github.com/aws/aws-cdk/issues/17669)) ([83e669d](https://github.com/aws/aws-cdk/commit/83e669dcdae9390990598236c75015832af766b4))
* **servicecatalog:** Add TagOptions to a CloudformationProduct ([#17672](https://github.com/aws/aws-cdk/issues/17672)) ([2d19e15](https://github.com/aws/aws-cdk/commit/2d19e1535586d2b006d43da787ffbb0fad8b4978))


### Bug Fixes

* **apigatewayv2:** integration class does not render an integration resource ([#17729](https://github.com/aws/aws-cdk/issues/17729)) ([3b5b97a](https://github.com/aws/aws-cdk/commit/3b5b97ac1f972f53240798df19af43d85ebf6f13)), closes [#13213](https://github.com/aws/aws-cdk/issues/13213)
* **apprunner:** startCommand and environment are ignored in imageConfiguration  ([#16939](https://github.com/aws/aws-cdk/issues/16939)) ([d911c58](https://github.com/aws/aws-cdk/commit/d911c5878c59498a2d0e14ff536e0f8f9f503bfe)), closes [#16812](https://github.com/aws/aws-cdk/issues/16812)
* **appsync:** add caching config to AppSync resolvers ([#17815](https://github.com/aws/aws-cdk/issues/17815)) ([52b535b](https://github.com/aws/aws-cdk/commit/52b535bda5f26b07377fcdfca63a75c62eb5f883))
* **appsync:** remove 'id' suffix to union definition key ([#17787](https://github.com/aws/aws-cdk/issues/17787)) ([86e7780](https://github.com/aws/aws-cdk/commit/86e77806391dc3fe8cd254fec773320cdb425dec)), closes [#17771](https://github.com/aws/aws-cdk/issues/17771)
* **assert:** support multiline strings with `stringLike()` ([#17692](https://github.com/aws/aws-cdk/issues/17692)) ([37596e6](https://github.com/aws/aws-cdk/commit/37596e6be4cf05432dcba3838955484e512beca6))


### Miscellaneous Chores

* **apigatewayv2:** integration api re-organization ([#17752](https://github.com/aws/aws-cdk/issues/17752)) ([29039e8](https://github.com/aws/aws-cdk/commit/29039e8bd13a4fdb7f84254038b3331c179273fd))
* **apigatewayv2-authorizers:** re-organize authorizer api ([#17772](https://github.com/aws/aws-cdk/issues/17772)) ([719f33e](https://github.com/aws/aws-cdk/commit/719f33e20c723f161fc35230fafd7e99bca66a61))

## [2.0.0-alpha.11](https://github.com/aws/aws-cdk/compare/v2.0.0-alpha.10...v2.0.0-alpha.11) (2021-12-02)

## [2.0.0-alpha.10](https://github.com/aws/aws-cdk/compare/v2.0.0-alpha.9...v2.0.0-alpha.10) (2021-11-26)

## [2.0.0-alpha.9](https://github.com/aws/aws-cdk/compare/v2.0.0-alpha.8...v2.0.0-alpha.9) (2021-11-25)

## [2.0.0-alpha.8](https://github.com/aws/aws-cdk/compare/v2.0.0-alpha.7...v2.0.0-alpha.8) (2021-11-23)


### Features

* **apigatewayv2:** domain endpoint type, security policy and endpoint migration ([#17518](https://github.com/aws/aws-cdk/issues/17518)) ([261b331](https://github.com/aws/aws-cdk/commit/261b331e89be01dc996d153c91b4018e7ddfda29))
* **apigatewayv2:** http api - mTLS support  ([#17284](https://github.com/aws/aws-cdk/issues/17284)) ([54be156](https://github.com/aws/aws-cdk/commit/54be1567546ffd52e83fbe52531f901c0b6c29c9)), closes [#12559](https://github.com/aws/aws-cdk/issues/12559)
* **apigatewayv2:** websocket api: grant manage connections ([#16872](https://github.com/aws/aws-cdk/issues/16872)) ([10dfa60](https://github.com/aws/aws-cdk/commit/10dfa60a693db6e38a1188effc6eeebc2b5c49b8)), closes [#14828](https://github.com/aws/aws-cdk/issues/14828)
* **iot:** add Action to put objects in S3 Buckets ([#17307](https://github.com/aws/aws-cdk/issues/17307)) ([49b87db](https://github.com/aws/aws-cdk/commit/49b87dbfe5a37abad8880e0325f7aa8218705407)), closes [/github.com/aws/aws-cdk/pull/16681#issuecomment-942233029](https://github.com/aws//github.com/aws/aws-cdk/pull/16681/issues/issuecomment-942233029)
* **iot:** add Action to put records to a Firehose stream ([#17466](https://github.com/aws/aws-cdk/issues/17466)) ([7cb5f2c](https://github.com/aws/aws-cdk/commit/7cb5f2cc8402aad223eb5c50cdf5ee2e0d56150e)), closes [/github.com/aws/aws-cdk/pull/16681#issuecomment-942233029](https://github.com/aws//github.com/aws/aws-cdk/pull/16681/issues/issuecomment-942233029)
* **msk:** add Kafka version 2.6.2 ([#17497](https://github.com/aws/aws-cdk/issues/17497)) ([5f1f476](https://github.com/aws/aws-cdk/commit/5f1f4762e964345741426fa1242320a5fc117338))
* **redshift:** Add support for distStyle, distKey, sortStyle and sortKey to Table ([#17135](https://github.com/aws/aws-cdk/issues/17135)) ([a137cd1](https://github.com/aws/aws-cdk/commit/a137cd13a90cc3bfdb8207bd8764e2eb05836126)), closes [#17125](https://github.com/aws/aws-cdk/issues/17125)
* **servicecatalog:** support local launch role name in launch role constraint ([#17371](https://github.com/aws/aws-cdk/issues/17371)) ([b307b69](https://github.com/aws/aws-cdk/commit/b307b6996ed13b1f2dedeb41d29409183becb969))


### Bug Fixes

* **iot:** unable to add the same lambda function to two TopicRule Actions ([#17521](https://github.com/aws/aws-cdk/issues/17521)) ([eda1640](https://github.com/aws/aws-cdk/commit/eda1640fcaf6375d7edc5f8edcb5d69c82d130a1)), closes [#17508](https://github.com/aws/aws-cdk/issues/17508)
* **redshift:** tableNameSuffix evaluation ([#17213](https://github.com/aws/aws-cdk/issues/17213)) ([f7c3217](https://github.com/aws/aws-cdk/commit/f7c3217a731804f014526e10b414a9e7f27d575b)), closes [#17064](https://github.com/aws/aws-cdk/issues/17064)

## [2.0.0-alpha.7](https://github.com/aws/aws-cdk/compare/v2.0.0-alpha.6...v2.0.0-alpha.7) (2021-11-17)

## [2.0.0-alpha.6](https://github.com/aws/aws-cdk/compare/v2.0.0-alpha.5...v2.0.0-alpha.6) (2021-11-10)

## [2.0.0-alpha.5](https://github.com/aws/aws-cdk/compare/v2.0.0-alpha.4...v2.0.0-alpha.5) (2021-11-09)


### ⚠ BREAKING CHANGES TO EXPERIMENTAL FEATURES

* **apigatewayv2-authorizers:** `userPoolClient` property in `UserPoolAuthorizerProps`
is now renamed to `userPoolClients`.

### Features

* **apigatewayv2-authorizers:** http api - allow multiple user pool clients per HttpUserPoolAuthorizer  ([#16903](https://github.com/aws/aws-cdk/issues/16903)) ([747eb7c](https://github.com/aws/aws-cdk/commit/747eb7cf5dba4514241103ffebc49e03261d25a9)), closes [#15431](https://github.com/aws/aws-cdk/issues/15431)
* **iot:** allow setting `description` and `enabled` of TopicRule ([#17225](https://github.com/aws/aws-cdk/issues/17225)) ([a9aae09](https://github.com/aws/aws-cdk/commit/a9aae097daad475dd57bbf4842956327a6d5a220)), closes [/github.com/aws/aws-cdk/pull/16681#issuecomment-942233029](https://github.com/aws//github.com/aws/aws-cdk/pull/16681/issues/issuecomment-942233029)
* **iot:** allow setting `errorAction` of TopicRule  ([#17287](https://github.com/aws/aws-cdk/issues/17287)) ([e412308](https://github.com/aws/aws-cdk/commit/e412308bc81ede16b079077cfa4774ceaa2fadeb)), closes [/github.com/aws/aws-cdk/pull/16681#issuecomment-942233029](https://github.com/aws//github.com/aws/aws-cdk/pull/16681/issues/issuecomment-942233029)
* **iot:** allow setting Actions of TopicRule ([#17110](https://github.com/aws/aws-cdk/issues/17110)) ([0cabb9f](https://github.com/aws/aws-cdk/commit/0cabb9f2d2f50c03337cd6f35bf47fc54ada3a21)), closes [#16681](https://github.com/aws/aws-cdk/issues/16681) [/github.com/aws/aws-cdk/pull/16681#discussion_r733912215](https://github.com/aws//github.com/aws/aws-cdk/pull/16681/issues/discussion_r733912215)
* **iot-actions:** Add the action to put CloudWatch Logs ([#17228](https://github.com/aws/aws-cdk/issues/17228)) ([a7c869e](https://github.com/aws/aws-cdk/commit/a7c869e6d57932389df572cd7f104a4c9ea8f8a5)), closes [/github.com/aws/aws-cdk/pull/16681#issuecomment-942233029](https://github.com/aws//github.com/aws/aws-cdk/pull/16681/issues/issuecomment-942233029)
* **servicecatalog:** allow creating a CFN Product Version with CDK code ([#17144](https://github.com/aws/aws-cdk/issues/17144)) ([f8d0ef5](https://github.com/aws/aws-cdk/commit/f8d0ef550df07e43aeab35dde4406c92f7551ed0))
* **synthetics:** add static cron method to schedule class ([#17250](https://github.com/aws/aws-cdk/issues/17250)) ([1ab9b26](https://github.com/aws/aws-cdk/commit/1ab9b265e9899ffcd093b3600d658c8a6519cc69)), closes [#16402](https://github.com/aws/aws-cdk/issues/16402)

## [2.0.0-alpha.4](https://github.com/aws/aws-cdk/compare/v2.0.0-alpha.3...v2.0.0-alpha.4) (2021-10-27)


### Features

* **amplify:** Add support for custom headers in the App ([#17102](https://github.com/aws/aws-cdk/issues/17102)) ([9f3abd7](https://github.com/aws/aws-cdk/commit/9f3abd745c98a65e7314528f40d08ea2ecbe19a6)), closes [#17084](https://github.com/aws/aws-cdk/issues/17084)
* **synthetics:** add syn-nodejs-puppeteer-3.3 runtime ([#17132](https://github.com/aws/aws-cdk/issues/17132)) ([8343bec](https://github.com/aws/aws-cdk/commit/8343beccbee06f453b63387f54768b320fe01339))


### Bug Fixes

* **redshift:** cluster uses key ARN instead of key ID ([#17108](https://github.com/aws/aws-cdk/issues/17108)) ([bdf30c6](https://github.com/aws/aws-cdk/commit/bdf30c696b04b26a8e41548839d5c4cf61d471cc)), closes [#17032](https://github.com/aws/aws-cdk/issues/17032)

## [2.0.0-alpha.3](https://github.com/aws/aws-cdk/compare/v2.0.0-alpha.2...v2.0.0-alpha.3) (2021-10-25)


### Features

* **iot:** create new aws-iot-actions module ([#17112](https://github.com/aws/aws-cdk/issues/17112)) ([06838e6](https://github.com/aws/aws-cdk/commit/06838e66db0c9a48e2aa7da1e7707fda335bb62c)), closes [#16681](https://github.com/aws/aws-cdk/issues/16681) [/github.com/aws/aws-cdk/pull/16681#discussion_r733912215](https://github.com/aws//github.com/aws/aws-cdk/pull/16681/issues/discussion_r733912215)

## [2.0.0-alpha.2](https://github.com/aws/aws-cdk/compare/v2.0.0-alpha.1...v2.0.0-alpha.2) (2021-10-22)


### Features

* **apigatewayv2-integrations:** http api - support for request parameter mapping ([#15630](https://github.com/aws/aws-cdk/issues/15630)) ([0452aed](https://github.com/aws/aws-cdk/commit/0452aed2f00198e05bd65b1d20246f7de0b24e20))
* **iot:** add the TopicRule L2 construct ([#16681](https://github.com/aws/aws-cdk/issues/16681)) ([86f85ce](https://github.com/aws/aws-cdk/commit/86f85ce10f78b86133f9dab9851e56d03fb28cc0)), closes [#16602](https://github.com/aws/aws-cdk/issues/16602)
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
