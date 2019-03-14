# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [0.25.3](https://github.com/awslabs/aws-cdk/compare/v0.25.2...v0.25.3) (2019-03-12)


### Bug Fixes

* **aws-cloudtrail:** correct created log policy when sendToCloudWatchLogs is true ([#1966](https://github.com/awslabs/aws-cdk/issues/1966)) ([f06ff8e](https://github.com/awslabs/aws-cdk/commit/f06ff8e))
* **aws-ec2:** All SSM WindowsVersion entries ([#1977](https://github.com/awslabs/aws-cdk/issues/1977)) ([85a1840](https://github.com/awslabs/aws-cdk/commit/85a1840))
* **decdk:** relax validation when not using constructs ([#1999](https://github.com/awslabs/aws-cdk/issues/1999)) ([afbd591](https://github.com/awslabs/aws-cdk/commit/afbd591))


### Features

* **core:** add fsharp init-template ([#1912](https://github.com/awslabs/aws-cdk/issues/1912)) ([dfefb58](https://github.com/awslabs/aws-cdk/commit/dfefb58))
* **ec2:** vpn metrics ([#1979](https://github.com/awslabs/aws-cdk/issues/1979)) ([9319e13](https://github.com/awslabs/aws-cdk/commit/9319e13))

## [0.25.2](https://github.com/awslabs/aws-cdk/compare/v0.25.1...v0.25.2) (2019-03-07)


### Bug Fixes

* **awslint:** Don't fail if the `@aws-cdk/cdk` module is not present ([#1953](https://github.com/awslabs/aws-cdk/issues/1953)) ([929e854](https://github.com/awslabs/aws-cdk/commit/929e854))
* **cdk-integ:** Update cdk-integ to use new context file ([#1962](https://github.com/awslabs/aws-cdk/issues/1962)) ([dbd2401](https://github.com/awslabs/aws-cdk/commit/dbd2401))
* **cloudfront:** allow IBucket as CloudFront source ([855f1f5](https://github.com/awslabs/aws-cdk/commit/855f1f5)), closes [#1946](https://github.com/awslabs/aws-cdk/issues/1946)
* **cloudfront:** pass `viewerProtocolPolicy` to the distribution's behaviors ([#1932](https://github.com/awslabs/aws-cdk/issues/1932)) ([615ecd4](https://github.com/awslabs/aws-cdk/commit/615ecd4))
* **eks:** remove 'const' from NodeType enum ([#1970](https://github.com/awslabs/aws-cdk/issues/1970)) ([ac52989](https://github.com/awslabs/aws-cdk/commit/ac52989)), closes [#1969](https://github.com/awslabs/aws-cdk/issues/1969)
* **init:** update the C# init sample with the new `App` API ([#1919](https://github.com/awslabs/aws-cdk/issues/1919)) ([02f991d](https://github.com/awslabs/aws-cdk/commit/02f991d))


### Features

* **aws-certificatemanager:** add DNSValidatedCertificate ([#1797](https://github.com/awslabs/aws-cdk/issues/1797)) ([ae8870d](https://github.com/awslabs/aws-cdk/commit/ae8870d)), closes [#605](https://github.com/awslabs/aws-cdk/issues/605)
* **aws-ecs:** add Fargate version 1.3.0 ([#1968](https://github.com/awslabs/aws-cdk/issues/1968)) ([b529ad7](https://github.com/awslabs/aws-cdk/commit/b529ad7))
* **core:** democratize synthesis and introduce artifacts ([#1889](https://github.com/awslabs/aws-cdk/issues/1889)) ([4ab1cd3](https://github.com/awslabs/aws-cdk/commit/4ab1cd3)), closes [#1716](https://github.com/awslabs/aws-cdk/issues/1716) [#1893](https://github.com/awslabs/aws-cdk/issues/1893)
* **ec2:** add support for vpn connections ([#1899](https://github.com/awslabs/aws-cdk/issues/1899)) ([e150648](https://github.com/awslabs/aws-cdk/commit/e150648)), closes [awslabs/jsii#231](https://github.com/awslabs/jsii/issues/231)
* **toolkit:** add '--reuse-asset' option ([#1918](https://github.com/awslabs/aws-cdk/issues/1918)) ([1767b61](https://github.com/awslabs/aws-cdk/commit/1767b61)), closes [#1916](https://github.com/awslabs/aws-cdk/issues/1916)


## [0.25.1](https://github.com/awslabs/aws-cdk/compare/v0.25.0...v0.25.1) (2019-03-04)


### Bug Fixes

* **toolkit:** fix context passed in from command-line ([#1939](https://github.com/awslabs/aws-cdk/issues/1939)) ([bec4a02](https://github.com/awslabs/aws-cdk/commit/bec4a02)), closes [#1911](https://github.com/awslabs/aws-cdk/issues/1911)

## [0.25.0](https://github.com/awslabs/aws-cdk/compare/v0.24.1...v0.25.0) (2019-02-28)


### Bug Fixes

* **toolkit:** Don't collect runtime information when versionReporting is disabled ([#1890](https://github.com/awslabs/aws-cdk/issues/1890)) ([f827a88](https://github.com/awslabs/aws-cdk/commit/f827a88))
* **aws-codepipeline:** update CFN example. ([#1653](https://github.com/awslabs/aws-cdk/issues/1653)) ([5dec01a](https://github.com/awslabs/aws-cdk/commit/5dec01a))
* **aws-s3-deployment:** add setup.cfg to fix pip install bug on mac ([#1826](https://github.com/awslabs/aws-cdk/issues/1826)) ([759c708](https://github.com/awslabs/aws-cdk/commit/759c708))
* **cdk:** move apply() from Construct to ConstructNode ([#1738](https://github.com/awslabs/aws-cdk/issues/1738)) ([642c8a6](https://github.com/awslabs/aws-cdk/commit/642c8a6)), closes [#1732](https://github.com/awslabs/aws-cdk/issues/1732)
* **cloudtrail:** addS3EventSelector does not expose all options ([#1854](https://github.com/awslabs/aws-cdk/issues/1854)) ([5c3431b](https://github.com/awslabs/aws-cdk/commit/5c3431b)), closes [#1841](https://github.com/awslabs/aws-cdk/issues/1841)
* **cloudtrail:** Invalid resource for policy when using sendToCloudWatchLogs ([#1851](https://github.com/awslabs/aws-cdk/issues/1851)) ([816cfc0](https://github.com/awslabs/aws-cdk/commit/816cfc0)), closes [#1848](https://github.com/awslabs/aws-cdk/issues/1848)
* **cloudwatch:** fix name of 'MetricAlarmProps' ([#1765](https://github.com/awslabs/aws-cdk/issues/1765)) ([c87f09a](https://github.com/awslabs/aws-cdk/commit/c87f09a)), closes [#1760](https://github.com/awslabs/aws-cdk/issues/1760)
* **codebuild:** accept IRole instead of Role ([#1781](https://github.com/awslabs/aws-cdk/issues/1781)) ([f08ca15](https://github.com/awslabs/aws-cdk/commit/f08ca15)), closes [#1778](https://github.com/awslabs/aws-cdk/issues/1778)
* **codedeploy:** LambdaDeploymentGroup now takes IRole ([#1840](https://github.com/awslabs/aws-cdk/issues/1840)) ([f6adb7c](https://github.com/awslabs/aws-cdk/commit/f6adb7c)), closes [#1833](https://github.com/awslabs/aws-cdk/issues/1833)
* **codepipeline:** allow providing Tokens as the physical name of the Pipeline. ([#1800](https://github.com/awslabs/aws-cdk/issues/1800)) ([f6aea1b](https://github.com/awslabs/aws-cdk/commit/f6aea1b)), closes [#1788](https://github.com/awslabs/aws-cdk/issues/1788)
* **core:** improve error message if construct names conflict ([#1706](https://github.com/awslabs/aws-cdk/issues/1706)) ([0ea4a78](https://github.com/awslabs/aws-cdk/commit/0ea4a78))
* **core:** performance improvements ([#1750](https://github.com/awslabs/aws-cdk/issues/1750)) ([77b516f](https://github.com/awslabs/aws-cdk/commit/77b516f))
* **ecs:** rename capacity adding methods ([#1715](https://github.com/awslabs/aws-cdk/issues/1715)) ([e3738ac](https://github.com/awslabs/aws-cdk/commit/e3738ac))
* **elbv2:** explicitly implement IApplicationTargetGroup ([#1806](https://github.com/awslabs/aws-cdk/issues/1806)) ([828a2d7](https://github.com/awslabs/aws-cdk/commit/828a2d7)), closes [#1799](https://github.com/awslabs/aws-cdk/issues/1799)
* **init:** add new parameter to C# example ([#1831](https://github.com/awslabs/aws-cdk/issues/1831)) ([c7b99d8](https://github.com/awslabs/aws-cdk/commit/c7b99d8))
* **kms:** have EncryptionKeyBase implement IEncryptionKey ([#1728](https://github.com/awslabs/aws-cdk/issues/1728)) ([49080c6](https://github.com/awslabs/aws-cdk/commit/49080c6))
* **lambda:** Add 'provided' runtime ([#1764](https://github.com/awslabs/aws-cdk/issues/1764)) ([73d5bef](https://github.com/awslabs/aws-cdk/commit/73d5bef)), closes [#1761](https://github.com/awslabs/aws-cdk/issues/1761)
* **lambda:** add region check for environment variables ([#1690](https://github.com/awslabs/aws-cdk/issues/1690)) ([846ed9f](https://github.com/awslabs/aws-cdk/commit/846ed9f))
* **ssm:** Generate correct SSM Parameter ARN ([#1726](https://github.com/awslabs/aws-cdk/issues/1726)) ([39df456](https://github.com/awslabs/aws-cdk/commit/39df456))
* **toolkit:** correctly reset context from the shell command ([#1903](https://github.com/awslabs/aws-cdk/issues/1903)) ([58025c0](https://github.com/awslabs/aws-cdk/commit/58025c0))
* **toolkit:** correcty load cdk.json file without context ([#1900](https://github.com/awslabs/aws-cdk/issues/1900)) ([7731565](https://github.com/awslabs/aws-cdk/commit/7731565))
* **toolkit:** ignore hidden files for 'cdk init' ([#1766](https://github.com/awslabs/aws-cdk/issues/1766)) ([afdd173](https://github.com/awslabs/aws-cdk/commit/afdd173)), closes [#1758](https://github.com/awslabs/aws-cdk/issues/1758)
* **toolkit:** only fail if errors are on selected stacks ([#1807](https://github.com/awslabs/aws-cdk/issues/1807)) ([9c0cf8d](https://github.com/awslabs/aws-cdk/commit/9c0cf8d)), closes [#1784](https://github.com/awslabs/aws-cdk/issues/1784) [#1783](https://github.com/awslabs/aws-cdk/issues/1783)
* **toolkit:** support diff on multiple stacks ([#1855](https://github.com/awslabs/aws-cdk/issues/1855)) ([72d2535](https://github.com/awslabs/aws-cdk/commit/72d2535))
* **build:** Npm ignores files and folders named "core" by default ([#1767](https://github.com/awslabs/aws-cdk/issues/1767)) ([42876e7](https://github.com/awslabs/aws-cdk/commit/42876e7)), closes [npm/npm-packlist#24](https://github.com/npm/npm-packlist/issues/24)
* **core:** stack.partition is never scoped ([#1763](https://github.com/awslabs/aws-cdk/issues/1763)) ([c968588](https://github.com/awslabs/aws-cdk/commit/c968588))


### Features

* **apigateway:** add support for MethodResponse to aws-apigateway. ([#1572](https://github.com/awslabs/aws-cdk/issues/1572)) ([46236d9](https://github.com/awslabs/aws-cdk/commit/46236d9))
* **autoscaling:** bring your own IAM role ([#1727](https://github.com/awslabs/aws-cdk/issues/1727)) ([2016b8d](https://github.com/awslabs/aws-cdk/commit/2016b8d)), closes [#1701](https://github.com/awslabs/aws-cdk/issues/1701)
* **aws-eks:** add construct library for EKS ([#1655](https://github.com/awslabs/aws-cdk/issues/1655)) ([22fc8b9](https://github.com/awslabs/aws-cdk/commit/22fc8b9)), closes [#991](https://github.com/awslabs/aws-cdk/issues/991)
* **cfnspec:** manually add VPCEndpointService ([#1734](https://github.com/awslabs/aws-cdk/issues/1734)) ([f782958](https://github.com/awslabs/aws-cdk/commit/f782958)), closes [#1659](https://github.com/awslabs/aws-cdk/issues/1659)
* **codebuild:** add support for setting the gitCloneDepth property on Project sources. ([#1798](https://github.com/awslabs/aws-cdk/issues/1798)) ([5408a53](https://github.com/awslabs/aws-cdk/commit/5408a53)), closes [#1789](https://github.com/awslabs/aws-cdk/issues/1789)
* **core:** Add `construct.node.stack` attribute ([#1753](https://github.com/awslabs/aws-cdk/issues/1753)) ([a46cfd8](https://github.com/awslabs/aws-cdk/commit/a46cfd8)), closes [#798](https://github.com/awslabs/aws-cdk/issues/798)
* **dynamodb:** partitionKey and sortKey are now immutable ([#1744](https://github.com/awslabs/aws-cdk/issues/1744)) ([63ae0b4](https://github.com/awslabs/aws-cdk/commit/63ae0b4))
* **ecs:** allow ECS to be used declaratively ([#1745](https://github.com/awslabs/aws-cdk/issues/1745)) ([2480f0f](https://github.com/awslabs/aws-cdk/commit/2480f0f)), closes [#1618](https://github.com/awslabs/aws-cdk/issues/1618)
* **kms:** Allow opting out of "Retain" deletion policy ([#1685](https://github.com/awslabs/aws-cdk/issues/1685)) ([7706302](https://github.com/awslabs/aws-cdk/commit/7706302))
* **lambda:** allow specify event sources in props ([#1746](https://github.com/awslabs/aws-cdk/issues/1746)) ([a84157d](https://github.com/awslabs/aws-cdk/commit/a84157d))
* **lambda-event-sources:** "api" event source ([#1742](https://github.com/awslabs/aws-cdk/issues/1742)) ([5c11680](https://github.com/awslabs/aws-cdk/commit/5c11680))
* **route53:** Convenience API for creating zone delegations ([#1853](https://github.com/awslabs/aws-cdk/issues/1853)) ([f974531](https://github.com/awslabs/aws-cdk/commit/f974531)), closes [#1847](https://github.com/awslabs/aws-cdk/issues/1847)
* **sns:** Support raw message delivery ([#1827](https://github.com/awslabs/aws-cdk/issues/1827)) ([cc0a28c](https://github.com/awslabs/aws-cdk/commit/cc0a28c))
* **ssm:** allow referencing "latest" version of SSM parameter ([#1768](https://github.com/awslabs/aws-cdk/issues/1768)) ([9af36af](https://github.com/awslabs/aws-cdk/commit/9af36af)), closes [#1587](https://github.com/awslabs/aws-cdk/issues/1587)
* **toolkit:** improve docker build time in CI ([#1776](https://github.com/awslabs/aws-cdk/issues/1776)) ([1060b95](https://github.com/awslabs/aws-cdk/commit/1060b95)), closes [#1748](https://github.com/awslabs/aws-cdk/issues/1748)
* **codepipelines:** re-structure the CodePipeline Construct library API. ([#1590](https://github.com/awslabs/aws-cdk/issues/1590)) ([3c3db07](https://github.com/awslabs/aws-cdk/commit/3c3db07))
* **decdk:** Prototype for declarative CDK (decdk) ([#1618](https://github.com/awslabs/aws-cdk/pull/1618)) ([8713ac6](https://github.com/awslabs/aws-cdk/commit/8713ac6))


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



## [0.24.1](https://github.com/awslabs/aws-cdk/compare/v0.24.0...v0.24.1) (2019-02-07)


### Bug Fixes

* reference documentation is missing ([8fba8bc](https://github.com/awslabs/aws-cdk/commit/8fba8bc))


## [0.24.0](https://github.com/awslabs/aws-cdk/compare/v0.23.0...v0.24.0) (2019-02-06)


### Bug Fixes

* **aws-ecs:** correctly sets MinimumHealthyPercentage to 0 ([#1661](https://github.com/awslabs/aws-cdk/issues/1661)) ([ce5966f](https://github.com/awslabs/aws-cdk/commit/ce5966f)), closes [#1660](https://github.com/awslabs/aws-cdk/issues/1660)
* **cdk:** only make Outputs Exports when necessary ([#1624](https://github.com/awslabs/aws-cdk/issues/1624)) ([ebb8aa1](https://github.com/awslabs/aws-cdk/commit/ebb8aa1)), closes [#903](https://github.com/awslabs/aws-cdk/issues/903) [#1611](https://github.com/awslabs/aws-cdk/issues/1611)
* **elbv2:** fix specifying TargetGroup name ([#1684](https://github.com/awslabs/aws-cdk/issues/1684)) ([1d7198a](https://github.com/awslabs/aws-cdk/commit/1d7198a)), closes [#1674](https://github.com/awslabs/aws-cdk/issues/1674)
* **sns:** create subscription object under subscriber ([#1645](https://github.com/awslabs/aws-cdk/issues/1645)) ([0cc11ca](https://github.com/awslabs/aws-cdk/commit/0cc11ca)), closes [#1643](https://github.com/awslabs/aws-cdk/issues/1643) [#1534](https://github.com/awslabs/aws-cdk/issues/1534)


### Features

* **aws-s3:** add option to specify block public access settings ([#1664](https://github.com/awslabs/aws-cdk/issues/1664)) ([299fb6a](https://github.com/awslabs/aws-cdk/commit/299fb6a))
* **cdk:** aspect framework and tag implementation ([#1451](https://github.com/awslabs/aws-cdk/issues/1451)) ([f7c8531](https://github.com/awslabs/aws-cdk/commit/f7c8531)), closes [#1136](https://github.com/awslabs/aws-cdk/issues/1136) [#1497](https://github.com/awslabs/aws-cdk/issues/1497) [#360](https://github.com/awslabs/aws-cdk/issues/360)
* **cdk:** metric functions now automatically generated ([#1617](https://github.com/awslabs/aws-cdk/issues/1617)) ([36cfca8](https://github.com/awslabs/aws-cdk/commit/36cfca8))
* **cognito:** Implement user pool and user pool client constructs  ([#1615](https://github.com/awslabs/aws-cdk/issues/1615)) ([8e03ed6](https://github.com/awslabs/aws-cdk/commit/8e03ed6))
* **core:** overrideLogicalId: override IDs of CFN elements ([#1670](https://github.com/awslabs/aws-cdk/issues/1670)) ([823a1e8](https://github.com/awslabs/aws-cdk/commit/823a1e8)), closes [#1594](https://github.com/awslabs/aws-cdk/issues/1594)
* **secretsmanager:** L2 construct for Secret ([#1686](https://github.com/awslabs/aws-cdk/issues/1686)) ([8da9115](https://github.com/awslabs/aws-cdk/commit/8da9115))
* **serverless:** add AWS::Serverless::Application to CFN spec ([#1634](https://github.com/awslabs/aws-cdk/issues/1634)) ([bfa40b1](https://github.com/awslabs/aws-cdk/commit/bfa40b1))
* **ssm:** Add L2 resource for SSM Parameters ([#1515](https://github.com/awslabs/aws-cdk/issues/1515)) ([9858a64](https://github.com/awslabs/aws-cdk/commit/9858a64))


### BREAKING CHANGES

* **cdk:** if you are using TagManager the API for this object has completely changed. You should no longer use TagManager directly, but instead replace this with Tag Aspects. `cdk.Tag` has been renamed to `cdk.CfnTag` to enable `cdk.Tag` to be the Tag Aspect.

## [0.23.0](https://github.com/awslabs/aws-cdk/compare/v0.22.0...v0.23.0) (2019-02-04)


### Bug Fixes

* **apig:** Move `selectionPattern` to `integrationResponses` ([#1636](https://github.com/awslabs/aws-cdk/issues/1636)) ([7cdbcec](https://github.com/awslabs/aws-cdk/commit/7cdbcec)), closes [#1608](https://github.com/awslabs/aws-cdk/issues/1608)
* **aws-cdk:** Improvements to IAM diff rendering ([#1542](https://github.com/awslabs/aws-cdk/issues/1542)) ([3270b47](https://github.com/awslabs/aws-cdk/commit/3270b47)), closes [#1458](https://github.com/awslabs/aws-cdk/issues/1458) [#1495](https://github.com/awslabs/aws-cdk/issues/1495) [#1549](https://github.com/awslabs/aws-cdk/issues/1549)
* **aws-cdk:** Java init template works on Windows ([#1503](https://github.com/awslabs/aws-cdk/issues/1503)) ([24f521a](https://github.com/awslabs/aws-cdk/commit/24f521a))
* **sns:** create subscription object under subscriber ([5c4a9e5](https://github.com/awslabs/aws-cdk/commit/5c4a9e5)), closes [#1643](https://github.com/awslabs/aws-cdk/issues/1643) [#1534](https://github.com/awslabs/aws-cdk/issues/1534)
* Improve error message in SSMParameterProvider ([#1630](https://github.com/awslabs/aws-cdk/issues/1630)) ([6a8e010](https://github.com/awslabs/aws-cdk/commit/6a8e010)), closes [#1621](https://github.com/awslabs/aws-cdk/issues/1621)
* **aws-ec2:** CfnNetworkAclEntry.CidrBlock should be optional ([#1565](https://github.com/awslabs/aws-cdk/issues/1565)) ([4af7c0d](https://github.com/awslabs/aws-cdk/commit/4af7c0d)), closes [#1517](https://github.com/awslabs/aws-cdk/issues/1517)
* **aws-ec2:** change maxAZs default for VPCs to 3 ([#1543](https://github.com/awslabs/aws-cdk/issues/1543)) ([32a4b29](https://github.com/awslabs/aws-cdk/commit/32a4b29)), closes [#996](https://github.com/awslabs/aws-cdk/issues/996)
* **aws-events:** ergonomics improvements to CloudWatch Events ([#1570](https://github.com/awslabs/aws-cdk/issues/1570)) ([5e91a0a](https://github.com/awslabs/aws-cdk/commit/5e91a0a)), closes [#1514](https://github.com/awslabs/aws-cdk/issues/1514) [#1198](https://github.com/awslabs/aws-cdk/issues/1198) [#1275](https://github.com/awslabs/aws-cdk/issues/1275)
* **aws-s3-deployment:** clean up tempfiles after deployment ([#1367](https://github.com/awslabs/aws-cdk/issues/1367)) ([e291d37](https://github.com/awslabs/aws-cdk/commit/e291d37))
* **dynamodb:** grant also gives access to indexes ([#1564](https://github.com/awslabs/aws-cdk/issues/1564)) ([33c2a6d](https://github.com/awslabs/aws-cdk/commit/33c2a6d)), closes [#1540](https://github.com/awslabs/aws-cdk/issues/1540)
* Report stack metadata in assertions ([#1547](https://github.com/awslabs/aws-cdk/issues/1547)) ([c2d17f5](https://github.com/awslabs/aws-cdk/commit/c2d17f5))


### Features

* **alexa-ask:** Add deploy action for Alexa ([#1613](https://github.com/awslabs/aws-cdk/issues/1613)) ([0deea61](https://github.com/awslabs/aws-cdk/commit/0deea61))
* **apigateway:** support function alias in LambdaIntegration ([9f8bfa5](https://github.com/awslabs/aws-cdk/commit/9f8bfa5))
* **app:** add source map support to TS app template ([#1581](https://github.com/awslabs/aws-cdk/issues/1581)) ([5df22d9](https://github.com/awslabs/aws-cdk/commit/5df22d9)), closes [#1579](https://github.com/awslabs/aws-cdk/issues/1579)
* **autoscaling:** Support AssociatePublicIpAddress ([#1604](https://github.com/awslabs/aws-cdk/issues/1604)) ([23c9afc](https://github.com/awslabs/aws-cdk/commit/23c9afc)), closes [#1603](https://github.com/awslabs/aws-cdk/issues/1603)
* **aws-codepipeline:** support setting a Role for a CFN Action ([#1449](https://github.com/awslabs/aws-cdk/issues/1449)) ([77fe077](https://github.com/awslabs/aws-cdk/commit/77fe077))
* **aws-ecs:** add additional configuration to Volume ([#1357](https://github.com/awslabs/aws-cdk/issues/1357)) ([ff96f3f](https://github.com/awslabs/aws-cdk/commit/ff96f3f))
* **aws-ecs:** add support for Event Targets ([#1571](https://github.com/awslabs/aws-cdk/issues/1571)) ([aa68db5](https://github.com/awslabs/aws-cdk/commit/aa68db5)), closes [#1370](https://github.com/awslabs/aws-cdk/issues/1370)
* **aws-ecs:** ECS service scaling on ALB RequestCount ([#1574](https://github.com/awslabs/aws-cdk/issues/1574)) ([2b491d4](https://github.com/awslabs/aws-cdk/commit/2b491d4))
* **aws-s3:** add the option to not poll to the CodePipeline Action. ([#1260](https://github.com/awslabs/aws-cdk/issues/1260)) ([876b26d](https://github.com/awslabs/aws-cdk/commit/876b26d))
* **cdk:** Support UpdateReplacePolicy on Resources ([#1610](https://github.com/awslabs/aws-cdk/issues/1610)) ([f49c33b](https://github.com/awslabs/aws-cdk/commit/f49c33b))
* **cdk:** treat the "fake" CFN intrinsics (Fn::GetArtifactAtt, Fn::GetParam) specially when stringifying JSON. ([#1605](https://github.com/awslabs/aws-cdk/issues/1605)) ([2af2426](https://github.com/awslabs/aws-cdk/commit/2af2426)), closes [#1588](https://github.com/awslabs/aws-cdk/issues/1588)
* **cfnspec:** Upgrade to CFN Resource Specification v2.21.0 ([#1622](https://github.com/awslabs/aws-cdk/issues/1622)) ([21a5529](https://github.com/awslabs/aws-cdk/commit/21a5529))
* **cloudwatch:** Support 'datapointsToAlarm' on Alarms ([#1631](https://github.com/awslabs/aws-cdk/issues/1631)) ([828ac20](https://github.com/awslabs/aws-cdk/commit/828ac20)), closes [#1626](https://github.com/awslabs/aws-cdk/issues/1626)
* **core:** Generalization of dependencies ([#1583](https://github.com/awslabs/aws-cdk/issues/1583)) ([53e68257](https://github.com/awslabs/aws-cdk/commit/53e68257))
* **ecs:** environment variables for LoadBalancedXxxService ([#1537](https://github.com/awslabs/aws-cdk/issues/1537)) ([b633505](https://github.com/awslabs/aws-cdk/commit/b633505))
* **ecs:** VPC link for API Gatweay and ECS services ([#1541](https://github.com/awslabs/aws-cdk/issues/1541)) ([6642ca2](https://github.com/awslabs/aws-cdk/commit/6642ca2))
* **iam:** Make `roleName` available on `IRole` ([#1589](https://github.com/awslabs/aws-cdk/issues/1589)) ([9128390](https://github.com/awslabs/aws-cdk/commit/9128390))
* **lambda:** reserved concurrent executions ([#1560](https://github.com/awslabs/aws-cdk/issues/1560)) ([f7469c1](https://github.com/awslabs/aws-cdk/commit/f7469c1))
* **lambda:** Support AWS Lambda Layers ([#1411](https://github.com/awslabs/aws-cdk/issues/1411)) ([036cfdf](https://github.com/awslabs/aws-cdk/commit/036cfdf))
* **s3:** Add DeployAction for codepipeline ([#1596](https://github.com/awslabs/aws-cdk/issues/1596)) ([8f1a5e8](https://github.com/awslabs/aws-cdk/commit/8f1a5e8))
* **s3:** export bucket websiteURL ([#1521](https://github.com/awslabs/aws-cdk/issues/1521)) ([#1544](https://github.com/awslabs/aws-cdk/issues/1544)) ([4e46d3c](https://github.com/awslabs/aws-cdk/commit/4e46d3c))
* **s3:** imported bucket format option for website URL format ([#1550](https://github.com/awslabs/aws-cdk/issues/1550)) ([28a423d](https://github.com/awslabs/aws-cdk/commit/28a423d))
* **toolkit:** disable colors if a terminal is not attached to stdout ([#1641](https://github.com/awslabs/aws-cdk/issues/1641)) ([58b4685](https://github.com/awslabs/aws-cdk/commit/58b4685))


### BREAKING CHANGES

* **aws-codepipeline:** the `role` property in the CloudFormation Actions has been renamed to `deploymentRole`.
* **aws-codepipeline:** the `role` property in the `app-delivery` package has been renamed to `deploymentRole`.



## [0.22.0](https://github.com/awslabs/aws-cdk/compare/v0.21.0...v0.22.0) (2019-01-10)

This is a major release with multiple breaking changes in the core layers.
Please consult the __breaking changes__ section below for details.

We are focusing these days on finalizing the common patterns and APIs of the CDK
framework and the AWS Construct Library, which is why you are seeing all these
breaking changes. Expect a few more releases with changes of that nature as we
stabilize these APIs, so you might want to hold off with upgrading. We will
communicate when this foundational work is complete.

### Bug Fixes

* **core:** automatic cross-stack refs for CFN resources ([#1510](https://github.com/awslabs/aws-cdk/issues/1510)) ([ca5ee35](https://github.com/awslabs/aws-cdk/commit/ca5ee35))
* **ecs:** correct typo and other minor mistakes in ecs readme ([#1448](https://github.com/awslabs/aws-cdk/issues/1448)) ([9c91b20](https://github.com/awslabs/aws-cdk/commit/9c91b20))
* **elbv2:** unable to specify load balancer name ([#1486](https://github.com/awslabs/aws-cdk/issues/1486)) ([5b24583](https://github.com/awslabs/aws-cdk/commit/5b24583)), closes [#973](https://github.com/awslabs/aws-cdk/issues/973) [#1481](https://github.com/awslabs/aws-cdk/issues/1481)
* **lambda:** use IRole instead of Role to allow imports ([#1509](https://github.com/awslabs/aws-cdk/issues/1509)) ([b909dcd](https://github.com/awslabs/aws-cdk/commit/b909dcd))
* **toolkit:** fix typo in --rename option description ([#1438](https://github.com/awslabs/aws-cdk/issues/1438)) ([1dd56d4](https://github.com/awslabs/aws-cdk/commit/1dd56d4))
* **toolkit:** support multiple toolkit stacks in the same environment ([#1427](https://github.com/awslabs/aws-cdk/issues/1427)) ([095da14](https://github.com/awslabs/aws-cdk/commit/095da14)), closes [#1416](https://github.com/awslabs/aws-cdk/issues/1416)

### Features

* **apigateway:** add tracingEnabled property to APIGW Stage ([#1482](https://github.com/awslabs/aws-cdk/issues/1482)) ([fefa764](https://github.com/awslabs/aws-cdk/commit/fefa764))
* **assets:** enable local tooling scenarios such as lambda debugging ([#1433](https://github.com/awslabs/aws-cdk/issues/1433)) ([0d2b633](https://github.com/awslabs/aws-cdk/commit/0d2b633)), closes [#1432](https://github.com/awslabs/aws-cdk/issues/1432)
* **aws-cdk:** better stack dependency handling ([#1511](https://github.com/awslabs/aws-cdk/issues/1511)) ([b4bbaf0](https://github.com/awslabs/aws-cdk/commit/b4bbaf0)), closes [#1508](https://github.com/awslabs/aws-cdk/issues/1508) [#1505](https://github.com/awslabs/aws-cdk/issues/1505)
* **aws-codepipeline:** jenkins build and test actions ([#1216](https://github.com/awslabs/aws-cdk/issues/1216)) ([471e8eb](https://github.com/awslabs/aws-cdk/commit/471e8eb))
* **aws-codepipeline:** support notifications on the ManualApprovalAction ([#1368](https://github.com/awslabs/aws-cdk/issues/1368)) ([068fa46](https://github.com/awslabs/aws-cdk/commit/068fa46)), closes [#1222](https://github.com/awslabs/aws-cdk/issues/1222)
* **aws-ecs:** add support Amazon Linux 2 ([#1484](https://github.com/awslabs/aws-cdk/issues/1484)) ([82ec0ff](https://github.com/awslabs/aws-cdk/commit/82ec0ff)), closes [#1483](https://github.com/awslabs/aws-cdk/issues/1483)
* **aws-kms:** allow tagging kms keys ([#1485](https://github.com/awslabs/aws-cdk/issues/1485)) ([f43b4d4](https://github.com/awslabs/aws-cdk/commit/f43b4d4))
* **aws-lambda:** add input and output artifacts to the CodePipeline action ([#1390](https://github.com/awslabs/aws-cdk/issues/1390)) ([fbd7728](https://github.com/awslabs/aws-cdk/commit/fbd7728)), closes [#1384](https://github.com/awslabs/aws-cdk/issues/1384)
* **cdk:** transparently use constructs from another stack ([d7371f0](https://github.com/awslabs/aws-cdk/commit/d7371f0)), closes [#1324](https://github.com/awslabs/aws-cdk/issues/1324)
* **cli:** allow specifying options using env vars ([#1447](https://github.com/awslabs/aws-cdk/issues/1447)) ([7cd84a0](https://github.com/awslabs/aws-cdk/commit/7cd84a0))
* aws resource api linting (breaking changes) ([#1434](https://github.com/awslabs/aws-cdk/issues/1434)) ([8c17ca7](https://github.com/awslabs/aws-cdk/commit/8c17ca7)), closes [#742](https://github.com/awslabs/aws-cdk/issues/742) [#1428](https://github.com/awslabs/aws-cdk/issues/1428)
* **core:** cloudformation condition chaining ([#1494](https://github.com/awslabs/aws-cdk/issues/1494)) ([2169015](https://github.com/awslabs/aws-cdk/commit/2169015)), closes [#1457](https://github.com/awslabs/aws-cdk/issues/1457)
* **diff:** better diff of arbitrary json objects ([#1488](https://github.com/awslabs/aws-cdk/issues/1488)) ([607f997](https://github.com/awslabs/aws-cdk/commit/607f997))
* **route53:** support cname records ([#1487](https://github.com/awslabs/aws-cdk/issues/1487)) ([17eddd1](https://github.com/awslabs/aws-cdk/commit/17eddd1)), closes [#1420](https://github.com/awslabs/aws-cdk/issues/1420)
* **step-functions:** support parameters option ([#1492](https://github.com/awslabs/aws-cdk/issues/1492)) ([935054a](https://github.com/awslabs/aws-cdk/commit/935054a)), closes [#1480](https://github.com/awslabs/aws-cdk/issues/1480)
* **core:** construct base class changes (breaking) ([#1444](https://github.com/awslabs/aws-cdk/issues/1444)) ([fb22a32](https://github.com/awslabs/aws-cdk/commit/fb22a32)), closes [#1431](https://github.com/awslabs/aws-cdk/issues/1431) [#1441](https://github.com/awslabs/aws-cdk/issues/1441) [#189](https://github.com/awslabs/aws-cdk/issues/189) [#1441](https://github.com/awslabs/aws-cdk/issues/1441) [#1431](https://github.com/awslabs/aws-cdk/issues/1431)
* **core:** idiomize cloudformation intrinsics functions ([#1428](https://github.com/awslabs/aws-cdk/issues/1428)) ([04217a5](https://github.com/awslabs/aws-cdk/commit/04217a5)), closes [#202](https://github.com/awslabs/aws-cdk/issues/202)
* **cloudformation:** no more generated attribute types in CFN layer (L1) ([#1489](https://github.com/awslabs/aws-cdk/issues/1489)) ([4d6d5ca](https://github.com/awslabs/aws-cdk/commit/4d6d5ca)), closes [#1455](https://github.com/awslabs/aws-cdk/issues/1455) [#1406](https://github.com/awslabs/aws-cdk/issues/1406)
* **cloudformation:** stop generating legacy cloudformation resources ([#1493](https://github.com/awslabs/aws-cdk/issues/1493)) ([81b4174](https://github.com/awslabs/aws-cdk/commit/81b4174))


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


# [0.21.0](https://github.com/awslabs/aws-cdk/compare/v0.20.0...v0.21.0) (2018-12-20)


### Bug Fixes

* **aws-cloudformation:** change the type of Role in CodePipeline Actions to IRole. ([#1364](https://github.com/awslabs/aws-cdk/issues/1364)) ([3d07e48](https://github.com/awslabs/aws-cdk/commit/3d07e48)), closes [#1361](https://github.com/awslabs/aws-cdk/issues/1361)
* **codebuild:** Rename includeBuildID property of S3BucketBuildArtifacts ([#1354](https://github.com/awslabs/aws-cdk/issues/1354)) ([84eb7ad](https://github.com/awslabs/aws-cdk/commit/84eb7ad)), closes [#1347](https://github.com/awslabs/aws-cdk/issues/1347)
* **toolkit:** scrutiny dialog should fail with no tty ([#1382](https://github.com/awslabs/aws-cdk/issues/1382)) ([478a714](https://github.com/awslabs/aws-cdk/commit/478a714)), closes [#1380](https://github.com/awslabs/aws-cdk/issues/1380)


### Features

* **aws-codebuild:** change the API of GitHub and BitBucket Sources. ([#1345](https://github.com/awslabs/aws-cdk/issues/1345)) ([9cebf0d](https://github.com/awslabs/aws-cdk/commit/9cebf0d))
* add "engines.node" key to all packages ([#1358](https://github.com/awslabs/aws-cdk/issues/1358)) ([b595cf0](https://github.com/awslabs/aws-cdk/commit/b595cf0)), closes [#1337](https://github.com/awslabs/aws-cdk/issues/1337)
* deprecate "cloudformation" namespace in favor of "CfnXxx" ([#1311](https://github.com/awslabs/aws-cdk/issues/1311)) ([d20938c](https://github.com/awslabs/aws-cdk/commit/d20938c)), closes [#878](https://github.com/awslabs/aws-cdk/issues/878) [awslabs/jsii#283](https://github.com/awslabs/jsii/issues/283) [awslabs/jsii#270](https://github.com/awslabs/jsii/issues/270)
* update CloudFormation resources v2.18.0 ([#1407](https://github.com/awslabs/aws-cdk/issues/1407)) ([0f80b56](https://github.com/awslabs/aws-cdk/commit/0f80b56)), closes [#1409](https://github.com/awslabs/aws-cdk/issues/1409)
* **aws-codebuild:** allow setting Webhook for GitHub Sources. ([#1387](https://github.com/awslabs/aws-cdk/issues/1387)) ([d5cae61](https://github.com/awslabs/aws-cdk/commit/d5cae61))
* **aws-ec2:** can now use PrefixList in ingress rules ([#1360](https://github.com/awslabs/aws-cdk/issues/1360)) ([c3cfcd5](https://github.com/awslabs/aws-cdk/commit/c3cfcd5))
* **aws-iam:** configure ExternalId for Role ([#1359](https://github.com/awslabs/aws-cdk/issues/1359)) ([3d200c9](https://github.com/awslabs/aws-cdk/commit/3d200c9)), closes [#235](https://github.com/awslabs/aws-cdk/issues/235)
* **aws-lambda:** Add python 3.7 runtime ([#1379](https://github.com/awslabs/aws-cdk/issues/1379)) ([8c733ef](https://github.com/awslabs/aws-cdk/commit/8c733ef))
* **cdk:** add the CodeDeployLambdaAlias Update Policy. ([#1346](https://github.com/awslabs/aws-cdk/issues/1346)) ([d648b58](https://github.com/awslabs/aws-cdk/commit/d648b58)), closes [#1177](https://github.com/awslabs/aws-cdk/issues/1177)
* **core:** convert "/" in construct id to "--" and disallow tokens ([#1375](https://github.com/awslabs/aws-cdk/issues/1375)) ([011aac0](https://github.com/awslabs/aws-cdk/commit/011aac0)), closes [#1351](https://github.com/awslabs/aws-cdk/issues/1351) [#1374](https://github.com/awslabs/aws-cdk/issues/1374)
* **iam:** CompositePrincipal and allow multiple principal types ([#1377](https://github.com/awslabs/aws-cdk/issues/1377)) ([b942ae5](https://github.com/awslabs/aws-cdk/commit/b942ae5)), closes [#1201](https://github.com/awslabs/aws-cdk/issues/1201)


### BREAKING CHANGES

* **aws-cloudformation:** this changes the type of the `role` property in CFN CodePipeline Actions
from `Role` to `IRole`. This is needed to use imported Roles when creating Actions.
* **aws-codebuild:** this changes the API of CodeBuild's GitHub and BitBucket Sources
to take an owner/repo pair instead of an entire cloneUrl,
to make it consistent with the GitHubSourceAction in the CodePipeline package. Also adds handling the reportBuildStatus and insecureSsl Source properties.
* **codebuild:** the `includeBuildID` property of
`S3BucketBuildArtifacts` was renamed to `includeBuildId` (note the
lower-case trailing `d`).



## [0.20.0](https://github.com/awslabs/aws-cdk/compare/v0.19.0...v0.20.0) (2018-12-13)


### Bug Fixes

* **assert:** Adjust assertion behavior to be stricter ([#1289](https://github.com/awslabs/aws-cdk/issues/1289)) ([0919bf4](https://github.com/awslabs/aws-cdk/commit/0919bf4)), closes [awslabs/cdk-ops#186](https://github.com/awslabs/cdk-ops/issues/186)
* **aws-cdk:** fix profile use in non-'aws' partitions ([#1283](https://github.com/awslabs/aws-cdk/issues/1283)) ([5478913](https://github.com/awslabs/aws-cdk/commit/5478913)), closes [#1262](https://github.com/awslabs/aws-cdk/issues/1262) [#1109](https://github.com/awslabs/aws-cdk/issues/1109)
* upgrade jsii to v0.7.12 ([#1328](https://github.com/awslabs/aws-cdk/issues/1328)) ([62b7941](https://github.com/awslabs/aws-cdk/commit/62b7941))
* **aws-cdk:** fix YAML line wrapping issue ([#1334](https://github.com/awslabs/aws-cdk/issues/1334)) ([48b9bdd](https://github.com/awslabs/aws-cdk/commit/48b9bdd)), closes [#1309](https://github.com/awslabs/aws-cdk/issues/1309)
* **aws-codecommit:** make the onCommit CloudWatch Event respect creating the branch as well. ([#1320](https://github.com/awslabs/aws-cdk/issues/1320)) ([cb1aed9](https://github.com/awslabs/aws-cdk/commit/cb1aed9))
* **aws-ecr:** add the `addToPipeline` method to IRepository. ([#1329](https://github.com/awslabs/aws-cdk/issues/1329)) ([c4a9b74](https://github.com/awslabs/aws-cdk/commit/c4a9b74))
* **aws-ecs:** fix healthCheckGracePeriodSeconds ([#1266](https://github.com/awslabs/aws-cdk/issues/1266)) ([3a89e21](https://github.com/awslabs/aws-cdk/commit/3a89e21)), closes [#1265](https://github.com/awslabs/aws-cdk/issues/1265)
* **aws-ecs:** set permissions for 'awslogs' log driver ([#1291](https://github.com/awslabs/aws-cdk/issues/1291)) ([f5bc59b](https://github.com/awslabs/aws-cdk/commit/f5bc59b)), closes [#1279](https://github.com/awslabs/aws-cdk/issues/1279)
* **aws-lambda:** code.asset now supports jar files, fixes [#1294](https://github.com/awslabs/aws-cdk/issues/1294) ([#1330](https://github.com/awslabs/aws-cdk/issues/1330)) ([3076070](https://github.com/awslabs/aws-cdk/commit/3076070))
* **aws-logs:** set default log retention of LogGroup to 731 instead of 730 ([#1344](https://github.com/awslabs/aws-cdk/issues/1344)) ([71dc09f](https://github.com/awslabs/aws-cdk/commit/71dc09f)), closes [#1343](https://github.com/awslabs/aws-cdk/issues/1343)


### Features

* **aws-cdk:** directory assets follow symlinks ([#1318](https://github.com/awslabs/aws-cdk/issues/1318)) ([2dfd593](https://github.com/awslabs/aws-cdk/commit/2dfd593)), closes [#731](https://github.com/awslabs/aws-cdk/issues/731)
* **aws-s3:** orphan buckets by default ([#1273](https://github.com/awslabs/aws-cdk/issues/1273)) ([2eb47ad](https://github.com/awslabs/aws-cdk/commit/2eb47ad)), closes [#1269](https://github.com/awslabs/aws-cdk/issues/1269)
* **core:** include jsii runtime version in analytics ([#1288](https://github.com/awslabs/aws-cdk/issues/1288)) ([f06de18](https://github.com/awslabs/aws-cdk/commit/f06de18)), closes [awslabs/jsii#325](https://github.com/awslabs/jsii/issues/325) [#1258](https://github.com/awslabs/aws-cdk/issues/1258) [awslabs/cdk-ops#127](https://github.com/awslabs/cdk-ops/issues/127)
* **core:** only include cdk libs in version reporting ([#1290](https://github.com/awslabs/aws-cdk/issues/1290)) ([6184423](https://github.com/awslabs/aws-cdk/commit/6184423)), closes [awslabs/cdk-ops#172](https://github.com/awslabs/cdk-ops/issues/172)
* **docs:** add design process description & basic style guide ([#1229](https://github.com/awslabs/aws-cdk/issues/1229)) ([5ffa7e2](https://github.com/awslabs/aws-cdk/commit/5ffa7e2)), closes [awslabs/cdk-ops#177](https://github.com/awslabs/cdk-ops/issues/177)
* **toolkit:** include toolkit version in AWS::CDK::Metadata ([#1287](https://github.com/awslabs/aws-cdk/issues/1287)) ([5004f50](https://github.com/awslabs/aws-cdk/commit/5004f50)), closes [#1286](https://github.com/awslabs/aws-cdk/issues/1286)


### BREAKING CHANGES

* **assert:** the behavior change of `haveResource` can cause tests to
fail. If allowing extension of the expected values is the intended behavior, you can
switch to the `haveResourceLike` matcher instead, which exposes the previous
behavior.



## [0.19.0](https://github.com/awslabs/aws-cdk/compare/v0.18.1...v0.19.0) (2018-12-04)


### Bug Fixes

* **aws-cdk:** add '-h' flag to bring up help ([#1274](https://github.com/awslabs/aws-cdk/issues/1274)) ([47dafb0](https://github.com/awslabs/aws-cdk/commit/47dafb0)), closes [#1259](https://github.com/awslabs/aws-cdk/issues/1259)
* **aws-cloudfront:** Allow to disable IPv6 on cloudfront distribution ([#1244](https://github.com/awslabs/aws-cdk/issues/1244)) ([10b7092](https://github.com/awslabs/aws-cdk/commit/10b7092)), closes [#1243](https://github.com/awslabs/aws-cdk/issues/1243)
* **aws-cloudtrail:** correct S3 bucket policy and dependency chain ([#1268](https://github.com/awslabs/aws-cdk/issues/1268)) ([0de2da8](https://github.com/awslabs/aws-cdk/commit/0de2da8)), closes [#1172](https://github.com/awslabs/aws-cdk/issues/1172)
* **aws-ec2:** fix code generation of IcmpPing ([#1235](https://github.com/awslabs/aws-cdk/issues/1235)) ([6a13a18](https://github.com/awslabs/aws-cdk/commit/6a13a18)), closes [#1231](https://github.com/awslabs/aws-cdk/issues/1231)
* **cdk:** don't use instanceof in App ([#1249](https://github.com/awslabs/aws-cdk/issues/1249)) ([a45c3bd](https://github.com/awslabs/aws-cdk/commit/a45c3bd)), closes [#1245](https://github.com/awslabs/aws-cdk/issues/1245)
* **cdk init:** rename 'dotnet' to 'csharp' ([#1210](https://github.com/awslabs/aws-cdk/issues/1210)) ([da6a799](https://github.com/awslabs/aws-cdk/commit/da6a799)), closes [#1123](https://github.com/awslabs/aws-cdk/issues/1123)
* **cdk init:** update 'app' init template ([#1209](https://github.com/awslabs/aws-cdk/issues/1209)) ([0287109](https://github.com/awslabs/aws-cdk/commit/0287109)), closes [#1124](https://github.com/awslabs/aws-cdk/issues/1124) [#1128](https://github.com/awslabs/aws-cdk/issues/1128) [#1214](https://github.com/awslabs/aws-cdk/issues/1214)


### Features

* **aws-codebuild:** allow using docker image assets as build images ([#1233](https://github.com/awslabs/aws-cdk/issues/1233)) ([72413c1](https://github.com/awslabs/aws-cdk/commit/72413c1)), closes [#1232](https://github.com/awslabs/aws-cdk/issues/1232) [#1219](https://github.com/awslabs/aws-cdk/issues/1219)
* **aws-codebuild:** rename the Project methods for adding Actions to CodePipeline. ([#1254](https://github.com/awslabs/aws-cdk/issues/1254)) ([825e448](https://github.com/awslabs/aws-cdk/commit/825e448)), closes [#1211](https://github.com/awslabs/aws-cdk/issues/1211)
* **aws-ecr:** add an ECR Repository source CodePipeline Action. ([#1255](https://github.com/awslabs/aws-cdk/issues/1255)) ([01cc8a2](https://github.com/awslabs/aws-cdk/commit/01cc8a2))
* **app-delivery:** IAM policy for deploy stack (#1165) ([edc9a21](https://github.com/awslabs/aws-cdk/commit/edc9a21)), closes [#1165](https://github.com/awslabs/aws-cdk/issues/1165) [#1151](https://github.com/awslabs/aws-cdk/issues/1151)
* Update to CloudFormation spec v2.16.0 ([#1280](https://github.com/awslabs/aws-cdk/issues/1280)) ([9df5c54](https://github.com/awslabs/aws-cdk/commit/9df5c54))


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
## [0.18.1](https://github.com/awslabs/aws-cdk/compare/v0.18.0...v0.18.1) (2018-11-21)


### Bug Fixes

* **aws-autoscaling:** Add hook ordering dependency ([#1218](https://github.com/awslabs/aws-cdk/issues/1218)) ([7e6ad84](https://github.com/awslabs/aws-cdk/commit/7e6ad84)), closes [#1212](https://github.com/awslabs/aws-cdk/issues/1212)
* **aws-elasticloadbalancingv2:** target group metrics ([#1226](https://github.com/awslabs/aws-cdk/issues/1226)) ([de488df](https://github.com/awslabs/aws-cdk/commit/de488df)), closes [#1213](https://github.com/awslabs/aws-cdk/issues/1213)


## [0.18.0](https://github.com/awslabs/aws-cdk/compare/v0.17.0...v0.18.0) (2018-11-19)

## Bug Fixes

- **aws-cdk:** make bootstrapping not require --app ([#1191](https://github.com/awslabs/aws-cdk/issues/1191)) ([c7b1004](https://github.com/awslabs/aws-cdk/commit/c7b1004)), closes [#1188](https://github.com/awslabs/aws-cdk/issues/1188)
- **aws-ecs:** don't emit DesiredCount in daemon mode ([#1199](https://github.com/awslabs/aws-cdk/issues/1199)) ([7908de4](https://github.com/awslabs/aws-cdk/commit/7908de4)), closes [#1197](https://github.com/awslabs/aws-cdk/issues/1197)
- **aws-elasticloadbalancingv2:** 'targetType' on groups ([#1174](https://github.com/awslabs/aws-cdk/issues/1174)) ([b4293f2](https://github.com/awslabs/aws-cdk/commit/b4293f2))
- **aws-elasticloadbalancingv2:** fix rule dependency ([#1170](https://github.com/awslabs/aws-cdk/issues/1170)) ([aeb0f4f](https://github.com/awslabs/aws-cdk/commit/aeb0f4f)), closes [#1160](https://github.com/awslabs/aws-cdk/issues/1160)
- **deps:** upgrade jsii to 0.7.11 ([#1202](https://github.com/awslabs/aws-cdk/issues/1202)) ([f3a5f12](https://github.com/awslabs/aws-cdk/commit/f3a5f12))
- **docs:** fix "getting started" documentation ([#1045](https://github.com/awslabs/aws-cdk/issues/1045)) ([29b611f](https://github.com/awslabs/aws-cdk/commit/29b611f))
- **toolkit:** typo in `cdk bootstrap` output ([#1176](https://github.com/awslabs/aws-cdk/issues/1176)) ([b83fe85](https://github.com/awslabs/aws-cdk/commit/b83fe85))

## Features

- **aws-autoscaling:** add instance AutoScaling ([#1134](https://github.com/awslabs/aws-cdk/issues/1134)) ([d397dd7](https://github.com/awslabs/aws-cdk/commit/d397dd7)), closes [#1042](https://github.com/awslabs/aws-cdk/issues/1042) [#1113](https://github.com/awslabs/aws-cdk/issues/1113)
- **aws-codebuild:** add support for additional sources and artifact in Projects. ([#1110](https://github.com/awslabs/aws-cdk/issues/1110)) ([d911b08](https://github.com/awslabs/aws-cdk/commit/d911b08))
- **aws-ec2:** add VPC context provider ([#1168](https://github.com/awslabs/aws-cdk/issues/1168)) ([e8380fa](https://github.com/awslabs/aws-cdk/commit/e8380fa)), closes [#1095](https://github.com/awslabs/aws-cdk/issues/1095)
- **aws-ecs:** expose service and target group on the LoadBalancedFargateService ([#1175](https://github.com/awslabs/aws-cdk/issues/1175)) ([e799699](https://github.com/awslabs/aws-cdk/commit/e799699))
- **aws-ecs:** instance autoscaling and drain hook ([#1192](https://github.com/awslabs/aws-cdk/issues/1192)) ([811462e](https://github.com/awslabs/aws-cdk/commit/811462e)), closes [#1162](https://github.com/awslabs/aws-cdk/issues/1162)
- **aws-ecs:** Support HTTPS in load balanced Fargate service ([#1115](https://github.com/awslabs/aws-cdk/issues/1115)) ([76a5cc7](https://github.com/awslabs/aws-cdk/commit/76a5cc7))
- **aws-ecs:** TLS support for Fargate service applet ([#1184](https://github.com/awslabs/aws-cdk/issues/1184)) ([18166ce](https://github.com/awslabs/aws-cdk/commit/18166ce))
- update to CloudFormation spec v2.13.0 ([#1203](https://github.com/awslabs/aws-cdk/issues/1203)) ([c531c84](https://github.com/awslabs/aws-cdk/commit/c531c84))
- **aws-elasticloadbalancingv2:** add metrics ([#1173](https://github.com/awslabs/aws-cdk/issues/1173)) ([68d481d](https://github.com/awslabs/aws-cdk/commit/68d481d)), closes [#853](https://github.com/awslabs/aws-cdk/issues/853)
- **docs:** getting started instructions for csharp ([#1185](https://github.com/awslabs/aws-cdk/issues/1185)) ([2915ac1](https://github.com/awslabs/aws-cdk/commit/2915ac1)), closes [#696](https://github.com/awslabs/aws-cdk/issues/696)
- **toolkit:** add 'cdk context' command ([#1169](https://github.com/awslabs/aws-cdk/issues/1169)) ([2db536e](https://github.com/awslabs/aws-cdk/commit/2db536e)), closes [#311](https://github.com/awslabs/aws-cdk/issues/311)
- **toolkit:** by default hide AWS::CDK::Metadata from "cdk diff" ([#1186](https://github.com/awslabs/aws-cdk/issues/1186)) ([ef0017a](https://github.com/awslabs/aws-cdk/commit/ef0017a)), closes [#465](https://github.com/awslabs/aws-cdk/issues/465)
- **toolkit:** improve diff user interface ([#1187](https://github.com/awslabs/aws-cdk/issues/1187)) ([9c3c5c7](https://github.com/awslabs/aws-cdk/commit/9c3c5c7)), closes [#1121](https://github.com/awslabs/aws-cdk/issues/1121) [#1120](https://github.com/awslabs/aws-cdk/issues/1120)
- **aws-codepipeline**: switch to webhooks instead of polling by default for the GitHub ([#1074](https://github.com/awslabs/aws-cdk/issues/1074))

## BREAKING CHANGES

- **aws-codebuild:** this changes the way CodeBuild Sources are constructed (we moved away from multiple parameters in the constructor, in favor of the more idiomatic property interface).
- **aws-elasticloadbalancingv2:** `targetGroup.listenerDependency()` has been renamed to `targetGroup.loadBalancerDependency()`.

## [0.17.0](https://github.com/awslabs/aws-cdk/compare/v0.16.0...v0.17.0) (2018-11-14)

## Bug Fixes

- **aws-ecs**: remove DockerHub constructor class ([#1153](https://github.com/awslabs/aws-cdk/issues/1153)) ([ed14638](https://github.com/awslabs/aws-cdk/commit/ed14638))
- **aws-ec2:** add dependency on gateway attachment for public routes ([#1142](https://github.com/awslabs/aws-cdk/issues/1142)) ([15b255c](https://github.com/awslabs/aws-cdk/commit/15b255c)), closes [#1140](https://github.com/awslabs/aws-cdk/issues/1140)
- **s3-deployment:** bundle modules correctly ([#1154](https://github.com/awslabs/aws-cdk/issues/1154)) ([0cb1adf](https://github.com/awslabs/aws-cdk/commit/0cb1adf))

## Features

- **aws-codedeploy:** add an `addToPipeline` method to Deployment Group. ([#1166](https://github.com/awslabs/aws-cdk/issues/1166)) ([bdbeb7c](https://github.com/awslabs/aws-cdk/commit/bdbeb7c))
- **aws-codepipeline, aws-cloudformation:** support cross-region CloudFormation pipeline action ([#1152](https://github.com/awslabs/aws-cdk/issues/1152)) ([8e701ad](https://github.com/awslabs/aws-cdk/commit/8e701ad))
- **toolkit:** print available templates when --language is omitted ([#1159](https://github.com/awslabs/aws-cdk/issues/1159)) ([5726c45](https://github.com/awslabs/aws-cdk/commit/5726c45))

## BREAKING CHANGES

- **aws-ec2:** Method signature of VpcPublicSubnet.addDefaultIGWRouteEntry changed in order to add a dependency on gateway attachment completing before creating the public route to the gateway. Instead of passing a gateway ID string, pass in a cloudformation.InternetGatewayResource object and a cloudformation.VPCGatewayAttachmentResource object.
- If you were using `DockerHub.image()` to reference docker hub images, use `ContainerImage.fromDockerHub()` instead.

[]()

# [0.16.0](https://github.com/awslabs/aws-cdk/compare/v0.15.2...v0.16.0) (2018-11-12)

## Bug Fixes

- **aws-elasticloadbalancingv2:** listener dependency ([#1146](https://github.com/awslabs/aws-cdk/issues/1146)) ([e9d3d93](https://github.com/awslabs/aws-cdk/commit/e9d3d93)), closes [#1139](https://github.com/awslabs/aws-cdk/issues/1139)
- **aws-elasticloadbalancingv2:** unhealthy threshold ([#1145](https://github.com/awslabs/aws-cdk/issues/1145)) ([a70a50d](https://github.com/awslabs/aws-cdk/commit/a70a50d))

## Features

- **aws-codedeploy:** CodeDeploy Pipeline Action using the L2 DeploymentGroup Construct. ([#1085](https://github.com/awslabs/aws-cdk/issues/1085)) ([ce999b6](https://github.com/awslabs/aws-cdk/commit/ce999b6))
- **aws-route53:** route53 Alias record support ([#1131](https://github.com/awslabs/aws-cdk/issues/1131)) ([72f0124](https://github.com/awslabs/aws-cdk/commit/72f0124))
- **cdk:** allow Tokens to be encoded as lists ([#1144](https://github.com/awslabs/aws-cdk/issues/1144)) ([cd7947c](https://github.com/awslabs/aws-cdk/commit/cd7947c)), closes [#744](https://github.com/awslabs/aws-cdk/issues/744)

## BREAKING CHANGES

- **aws-codedeploy:** this changes the API of the CodeDeploy Pipeline Action to take the DeploymentGroup AWS Construct as an argument instead of the names of the Application and Deployment Group.

[]()

# [0.15.2](https://github.com/awslabs/aws-cdk/compare/v0.15.1...v0.15.2) (2018-11-08)

## Bug Fixes

- correctly emit quoted YAML for account numbers ([#1105](https://github.com/awslabs/aws-cdk/issues/1105)) ([b4d9155](https://github.com/awslabs/aws-cdk/commit/b4d9155)), closes [#1100](https://github.com/awslabs/aws-cdk/issues/1100) [#1098](https://github.com/awslabs/aws-cdk/issues/1098)
- **aws-ecs:** fix use of published NPM package with TypeScript ([#1117](https://github.com/awslabs/aws-cdk/issues/1117)) ([ebfb522](https://github.com/awslabs/aws-cdk/commit/ebfb522))

## Features

- **aws-ecs:** Add desired count to LoadBalanced[Fargate|EC2]Service ([#1111](https://github.com/awslabs/aws-cdk/issues/1111)) ([cafcc11](https://github.com/awslabs/aws-cdk/commit/cafcc11))

[]()

# [0.15.1](https://github.com/awslabs/aws-cdk/compare/v0.15.0...v0.15.1) (2018-11-06)

## Bug Fixes

- Update peer dependencies to refer to correct version so NPM installs don't fail.
- Switch back to `js-yaml` as `yaml` was emitting unquoted single colons as list elements.

[]()

# [0.15.0](https://github.com/awslabs/aws-cdk/compare/v0.14.1...v0.15.0) (2018-11-06)

## Bug Fixes

- **aws-autoscaling:** allow minSize to be set to 0 ([#1015](https://github.com/awslabs/aws-cdk/issues/1015)) ([67f7fa1](https://github.com/awslabs/aws-cdk/commit/67f7fa1))
- **aws-codebuild:** correctly pass the timeout property to CFN when creating a Project. ([#1071](https://github.com/awslabs/aws-cdk/issues/1071)) ([b1322bb](https://github.com/awslabs/aws-cdk/commit/b1322bb))
- **aws-codebuild:** correctly set S3 path when using it as artifact. ([#1072](https://github.com/awslabs/aws-cdk/issues/1072)) ([f32cba9](https://github.com/awslabs/aws-cdk/commit/f32cba9))
- **aws-kms:** add output value when exporting an encryption key ([#1036](https://github.com/awslabs/aws-cdk/issues/1036)) ([cb490be](https://github.com/awslabs/aws-cdk/commit/cb490be))
- Switch from `js-yaml` to `yaml` ([#1092](https://github.com/awslabs/aws-cdk/issues/1092)) ([0b132b5](https://github.com/awslabs/aws-cdk/commit/0b132b5))

## Features

- don't upload the same asset multiple times ([#1011](https://github.com/awslabs/aws-cdk/issues/1011)) ([35937b6](https://github.com/awslabs/aws-cdk/commit/35937b6)), closes [#989](https://github.com/awslabs/aws-cdk/issues/989)
- **app-delivery:** CI/CD for CDK Stacks ([#1022](https://github.com/awslabs/aws-cdk/issues/1022)) ([f2fe4e9](https://github.com/awslabs/aws-cdk/commit/f2fe4e9))
- add a new construct library for ECS ([#1058](https://github.com/awslabs/aws-cdk/issues/1058)) ([ae03ddb](https://github.com/awslabs/aws-cdk/commit/ae03ddb))
- **applets:** integrate into toolkit ([#1039](https://github.com/awslabs/aws-cdk/issues/1039)) ([fdabe95](https://github.com/awslabs/aws-cdk/commit/fdabe95)), closes [#849](https://github.com/awslabs/aws-cdk/issues/849) [#342](https://github.com/awslabs/aws-cdk/issues/342) [#291](https://github.com/awslabs/aws-cdk/issues/291)
- **aws-codecommit:** use CloudWatch Events instead of polling by default in the CodePipeline Action. ([#1026](https://github.com/awslabs/aws-cdk/issues/1026)) ([d09d30c](https://github.com/awslabs/aws-cdk/commit/d09d30c))
- **aws-dynamodb:** allow specifying partition/sort keys in props ([#1054](https://github.com/awslabs/aws-cdk/issues/1054)) ([ec87331](https://github.com/awslabs/aws-cdk/commit/ec87331)), closes [#1051](https://github.com/awslabs/aws-cdk/issues/1051)
- **aws-ec2:** AmazonLinuxImage supports AL2 ([#1081](https://github.com/awslabs/aws-cdk/issues/1081)) ([97b57a5](https://github.com/awslabs/aws-cdk/commit/97b57a5)), closes [#1062](https://github.com/awslabs/aws-cdk/issues/1062)
- **aws-lambda:** high level API for event sources ([#1063](https://github.com/awslabs/aws-cdk/issues/1063)) ([1be3442](https://github.com/awslabs/aws-cdk/commit/1be3442))
- **aws-sqs:** improvements to IAM grants API ([#1052](https://github.com/awslabs/aws-cdk/issues/1052)) ([6f2475e](https://github.com/awslabs/aws-cdk/commit/6f2475e))
- **codepipeline/cfn:** Use fewer statements for pipeline permissions ([#1009](https://github.com/awslabs/aws-cdk/issues/1009)) ([8f4c2ab](https://github.com/awslabs/aws-cdk/commit/8f4c2ab))
- **pkglint:** Make sure .snk files are ignored ([#1049](https://github.com/awslabs/aws-cdk/issues/1049)) ([53c8d76](https://github.com/awslabs/aws-cdk/commit/53c8d76)), closes [#643](https://github.com/awslabs/aws-cdk/issues/643)
- **toolkit:** deployment ui improvements ([#1067](https://github.com/awslabs/aws-cdk/issues/1067)) ([c832eaf](https://github.com/awslabs/aws-cdk/commit/c832eaf))
- Update to CloudFormation resource specification v2.11.0

## BREAKING CHANGES

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

# [0.14.1](https://github.com/awslabs/aws-cdk/compare/v0.14.0...v0.14.1) (2018-10-26)

## Bug Fixes

- **aws-cdk:** fix bug in SSM Parameter Provider ([#1023](https://github.com/awslabs/aws-cdk/issues/1023)) ([6e6aa1d](https://github.com/awslabs/aws-cdk/commit/6e6aa1d))

[]()

# [0.14.0](https://github.com/awslabs/aws-cdk/compare/v0.13.0...v0.14.0) (2018-10-26)

**IMPORTANT NOTE**: when upgrading to this version of the CDK framework, you must also upgrade your installation the CDK Toolkit to the matching version:

```shell
$ npm i -g aws-cdk
$ cdk --version
0.14.0 (build ...)
```

## Bug Fixes

- remove CloudFormation property renames ([#973](https://github.com/awslabs/aws-cdk/issues/973)) ([3f86603](https://github.com/awslabs/aws-cdk/commit/3f86603)), closes [#852](https://github.com/awslabs/aws-cdk/issues/852)
- **aws-ec2:** fix retention of all egress traffic rule ([#998](https://github.com/awslabs/aws-cdk/issues/998)) ([b9d5b43](https://github.com/awslabs/aws-cdk/commit/b9d5b43)), closes [#987](https://github.com/awslabs/aws-cdk/issues/987)
- **aws-s3-deployment:** avoid deletion during update using physical ids ([#1006](https://github.com/awslabs/aws-cdk/issues/1006)) ([bca99c6](https://github.com/awslabs/aws-cdk/commit/bca99c6)), closes [#981](https://github.com/awslabs/aws-cdk/issues/981) [#981](https://github.com/awslabs/aws-cdk/issues/981)
- **cloudformation-diff:** ignore changes to DependsOn ([#1005](https://github.com/awslabs/aws-cdk/issues/1005)) ([3605f9c](https://github.com/awslabs/aws-cdk/commit/3605f9c)), closes [#274](https://github.com/awslabs/aws-cdk/issues/274)
- **cloudformation-diff:** track replacements ([#1003](https://github.com/awslabs/aws-cdk/issues/1003)) ([a83ac5f](https://github.com/awslabs/aws-cdk/commit/a83ac5f)), closes [#1001](https://github.com/awslabs/aws-cdk/issues/1001)
- **docs:** fix EC2 readme for "natgatway" configuration ([#994](https://github.com/awslabs/aws-cdk/issues/994)) ([0b1e7cc](https://github.com/awslabs/aws-cdk/commit/0b1e7cc))
- **docs:** updates to contribution guide ([#997](https://github.com/awslabs/aws-cdk/issues/997)) ([b42e742](https://github.com/awslabs/aws-cdk/commit/b42e742))
- **iam:** Merge multiple principals correctly ([#983](https://github.com/awslabs/aws-cdk/issues/983)) ([3fc5c8c](https://github.com/awslabs/aws-cdk/commit/3fc5c8c)), closes [#924](https://github.com/awslabs/aws-cdk/issues/924) [#916](https://github.com/awslabs/aws-cdk/issues/916) [#958](https://github.com/awslabs/aws-cdk/issues/958)

## Features

- add construct library for Application AutoScaling ([#933](https://github.com/awslabs/aws-cdk/issues/933)) ([7861c6f](https://github.com/awslabs/aws-cdk/commit/7861c6f)), closes [#856](https://github.com/awslabs/aws-cdk/issues/856) [#861](https://github.com/awslabs/aws-cdk/issues/861) [#640](https://github.com/awslabs/aws-cdk/issues/640) [#644](https://github.com/awslabs/aws-cdk/issues/644)
- add HostedZone context provider ([#823](https://github.com/awslabs/aws-cdk/issues/823)) ([1626c37](https://github.com/awslabs/aws-cdk/commit/1626c37))
- **assert:** haveResource lists failing properties ([#1016](https://github.com/awslabs/aws-cdk/issues/1016)) ([7f6f3fd](https://github.com/awslabs/aws-cdk/commit/7f6f3fd))
- **aws-cdk:** add CDK app version negotiation ([#988](https://github.com/awslabs/aws-cdk/issues/988)) ([db4e718](https://github.com/awslabs/aws-cdk/commit/db4e718)), closes [#891](https://github.com/awslabs/aws-cdk/issues/891)
- **aws-codebuild:** Introduce a CodePipeline test Action. ([#873](https://github.com/awslabs/aws-cdk/issues/873)) ([770f9aa](https://github.com/awslabs/aws-cdk/commit/770f9aa))
- **aws-sqs:** Add grantXxx() methods ([#1004](https://github.com/awslabs/aws-cdk/issues/1004)) ([8c90350](https://github.com/awslabs/aws-cdk/commit/8c90350))
- **core:** Pre-concatenate Fn::Join ([#967](https://github.com/awslabs/aws-cdk/issues/967)) ([33c32a8](https://github.com/awslabs/aws-cdk/commit/33c32a8)), closes [#916](https://github.com/awslabs/aws-cdk/issues/916) [#958](https://github.com/awslabs/aws-cdk/issues/958)

## BREAKING CHANGES

- DynamoDB AutoScaling: Instead of `addReadAutoScaling()`, call `autoScaleReadCapacity()`, and similar for write scaling.
- CloudFormation resource usage: If you use L1s, you may need to change some `XxxName` properties back into `Name`. These will match the CloudFormation property names.
- You must use the matching `aws-cdk` toolkit when upgrading to this version, or context providers will cease to work. All existing cached context values in `cdk.json` will be invalidated and refreshed.

[]()

# [0.13.0](https://github.com/awslabs/aws-cdk/compare/v0.12.0...v0.13.0) (2018-10-19)

## Highlights

- **A new construct library for AWS Step Functions** ([docs](https://github.com/awslabs/aws-cdk/blob/master/packages/%40aws-cdk/aws-stepfunctions/README.md)). The library provides rich APIs for modeling state machines by exposing a programmatic interface for [Amazon State Language](https://docs.aws.amazon.com/step-functions/latest/dg/concepts-amazon-states-language.html).
- **A new construct library for Amazon S3 bucket deployments** ([docs](https://github.com/awslabs/aws-cdk/blob/master/packages/%40aws-cdk/aws-s3-deployment/README.md)). You can use now automatically populate an S3 Bucket from a .zip file or a local directory. This is a building block for end-to-end support for static websites in the AWS CDK.

## Bug Fixes

- **aws-apigateway:** make LambdaRestApi proxy by default ([#963](https://github.com/awslabs/aws-cdk/issues/963)) ([a5f5e2c](https://github.com/awslabs/aws-cdk/commit/a5f5e2c)), closes [#959](https://github.com/awslabs/aws-cdk/issues/959)
- **aws-cdk:** Allow use of assumed roles behind a proxy ([#898](https://github.com/awslabs/aws-cdk/issues/898)) ([f2b1048](https://github.com/awslabs/aws-cdk/commit/f2b1048))
- **aws-cdk:** Auto-delete stacks that failed creating before new attempt ([#917](https://github.com/awslabs/aws-cdk/issues/917)) ([2af8309](https://github.com/awslabs/aws-cdk/commit/2af8309))
- **aws-cloudfront:** expose distributionId ([#938](https://github.com/awslabs/aws-cdk/issues/938)) ([f58d98c](https://github.com/awslabs/aws-cdk/commit/f58d98c))
- **aws-dynamodb:** don't emit empty array properties ([#909](https://github.com/awslabs/aws-cdk/issues/909)) ([841975a](https://github.com/awslabs/aws-cdk/commit/841975a))
- **docs:** use ..code to display file structure in "writing constructs" ([#935](https://github.com/awslabs/aws-cdk/issues/935)) ([b743362](https://github.com/awslabs/aws-cdk/commit/b743362))

## Features

- **assets:** isZipArchive indicates if this is a zip asset ([#944](https://github.com/awslabs/aws-cdk/issues/944)) ([65190f9](https://github.com/awslabs/aws-cdk/commit/65190f9))
- **aws-cdk:** deploy supports CloudFormation Role ([#940](https://github.com/awslabs/aws-cdk/issues/940)) ([393be6f](https://github.com/awslabs/aws-cdk/commit/393be6f)), closes [#735](https://github.com/awslabs/aws-cdk/issues/735)
- **aws-cloudformation:** allow specifying custom resource type ([#943](https://github.com/awslabs/aws-cdk/issues/943)) ([9de3a84](https://github.com/awslabs/aws-cdk/commit/9de3a84))
- **aws-cloudformation:** correctly handle the templateConfiguration property in the CreateUpdateStack Pipeline Action. ([#923](https://github.com/awslabs/aws-cdk/issues/923)) ([d251a46](https://github.com/awslabs/aws-cdk/commit/d251a46))
- **aws-cloudfront:** add support for "webAclId" ([#969](https://github.com/awslabs/aws-cdk/issues/969)) ([3ec9d76](https://github.com/awslabs/aws-cdk/commit/3ec9d76))
- **aws-codedeploy:** add auto rollback configuration to server Deployment Group. ([#925](https://github.com/awslabs/aws-cdk/issues/925)) ([7ee91cf](https://github.com/awslabs/aws-cdk/commit/7ee91cf))
- **aws-codedeploy:** add instance tag filter support for server Deployment Groups. ([#824](https://github.com/awslabs/aws-cdk/issues/824)) ([e6e8c51](https://github.com/awslabs/aws-cdk/commit/e6e8c51))
- **aws-codedeploy:** add support for setting CloudWatch alarms on a server Deployment Group. ([#926](https://github.com/awslabs/aws-cdk/issues/926)) ([27b26b1](https://github.com/awslabs/aws-cdk/commit/27b26b1))
- add support for Step Functions ([#827](https://github.com/awslabs/aws-cdk/issues/827)) ([81b533c](https://github.com/awslabs/aws-cdk/commit/81b533c))
- **aws-lambda:** add grantInvoke() method ([#962](https://github.com/awslabs/aws-cdk/issues/962)) ([1ee8135](https://github.com/awslabs/aws-cdk/commit/1ee8135)), closes [#961](https://github.com/awslabs/aws-cdk/issues/961)
- **aws-lambda:** improvements to the code and runtime APIs ([#945](https://github.com/awslabs/aws-cdk/issues/945)) ([36f29b6](https://github.com/awslabs/aws-cdk/commit/36f29b6)), closes [#902](https://github.com/awslabs/aws-cdk/issues/902) [#188](https://github.com/awslabs/aws-cdk/issues/188) [#947](https://github.com/awslabs/aws-cdk/issues/947) [#947](https://github.com/awslabs/aws-cdk/issues/947) [#664](https://github.com/awslabs/aws-cdk/issues/664)
- **aws-logs:** extractMetric() returns Metric object ([#939](https://github.com/awslabs/aws-cdk/issues/939)) ([5558fff](https://github.com/awslabs/aws-cdk/commit/5558fff)), closes [#850](https://github.com/awslabs/aws-cdk/issues/850)
- **aws-s3:** initial support for website hosting ([#946](https://github.com/awslabs/aws-cdk/issues/946)) ([2d3661c](https://github.com/awslabs/aws-cdk/commit/2d3661c))
- **aws-s3-deployment:** bucket deployments ([#971](https://github.com/awslabs/aws-cdk/issues/971)) ([84d6876](https://github.com/awslabs/aws-cdk/commit/84d6876)), closes [#952](https://github.com/awslabs/aws-cdk/issues/952) [#953](https://github.com/awslabs/aws-cdk/issues/953) [#954](https://github.com/awslabs/aws-cdk/issues/954)
- **docs:** added link to CloudFormation concepts ([#934](https://github.com/awslabs/aws-cdk/issues/934)) ([666bbba](https://github.com/awslabs/aws-cdk/commit/666bbba))

## BREAKING CHANGES

- **aws-apigateway:** specifying a path no longer works. If you used to provide a '/', remove it. Otherwise, you will have to supply `proxy: false` and construct more complex resource paths yourself.
- **aws-lambda:** The construct `lambda.InlineJavaScriptLambda` is no longer supported. Use `lambda.Code.inline` instead; `lambda.Runtime.NodeJS43Edge` runtime is removed. CloudFront docs [stipulate](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/lambda-requirements-limits.html#lambda-requirements-lambda-function-configuration) that you should use node6.10 or node8.10\. It is always possible to use any value by instantiating a `lambda.Runtime` object.

[]()

# [0.12.0](https://github.com/awslabs/aws-cdk/compare/v0.11.0...v0.12.0) (2018-10-12)

**IMPORTANT NOTE**: This release includes a [fix](https://github.com/awslabs/aws-cdk/pull/911) for a bug that would make the toolkit unusable for multi-stack applications. In order to benefit from this fix, a globally installed CDK toolkit must also be updated:

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

## Bug Fixes

- **aws-codebuild:** allow passing oauth token to GitHubEnterpriseSource ([#908](https://github.com/awslabs/aws-cdk/issues/908)) ([c23da91](https://github.com/awslabs/aws-cdk/commit/c23da91))
- **toolkit:** multi-stack apps cannot be synthesized or deployed ([#911](https://github.com/awslabs/aws-cdk/issues/911)) ([5511076](https://github.com/awslabs/aws-cdk/commit/5511076)), closes [#868](https://github.com/awslabs/aws-cdk/issues/868) [#294](https://github.com/awslabs/aws-cdk/issues/294) [#910](https://github.com/awslabs/aws-cdk/issues/910)

## Features

- **aws-cloudformation:** add permission management to CreateUpdate and Delete Stack CodePipeline Actions. ([#880](https://github.com/awslabs/aws-cdk/issues/880)) ([8b3ae43](https://github.com/awslabs/aws-cdk/commit/8b3ae43))
- **aws-codepipeline:** make input and output artifact names optional when creating Actions. ([#845](https://github.com/awslabs/aws-cdk/issues/845)) ([3d91c93](https://github.com/awslabs/aws-cdk/commit/3d91c93))

## BREAKING CHANGES

- **aws-codepipeline:** this commit contains the following breaking changes:

  - Rename 'artifactName' in Action construction properties to 'outputArtifactName'
  - Rename the 'artifact' property of Actions to 'outputArtifact'
  - No longer allow adding output artifacts to Actions by instantiating the Artifact class
  - Rename Action#input/outputArtifacts properties to _input/_outputArtifacts

Previously, we always required customers to explicitly name the output artifacts the Actions used in the Pipeline, and to explicitly "wire together" the outputs of one Action as inputs to another. With this change, the CodePipeline Construct generates artifact names, if the customer didn't provide one explicitly, and tries to find the first available output artifact to use as input to a newly created Action that needs it, thus turning both the input and output artifacts from required to optional properties.

[]()

# [0.11.0](https://github.com/awslabs/aws-cdk/compare/v0.10.0...v0.11.0) (2018-10-11)

**IMPORTANT NOTE**: This release includes a [breaking change](https://github.com/awslabs/aws-cdk/issues/868) in the toolkit <=> app protocol. This means that in order to synthesize CDK apps that use this version, the globally installed CDK toolkit must also be updated:

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

## Bug Fixes

- **aws-apigateway:** allow + in path parts ([#769](https://github.com/awslabs/aws-cdk/issues/769)) ([0c50d27](https://github.com/awslabs/aws-cdk/commit/0c50d27)), closes [#768](https://github.com/awslabs/aws-cdk/issues/768)
- **aws-cdk:** continue after exceptions in stack monitor ([#791](https://github.com/awslabs/aws-cdk/issues/791)) ([b0f3298](https://github.com/awslabs/aws-cdk/commit/b0f3298)), closes [#787](https://github.com/awslabs/aws-cdk/issues/787)
- **aws-cloudfront:** check for undefined and determining of the defaultRootObject prop is set or not ([#801](https://github.com/awslabs/aws-cdk/issues/801)) ([32a74c6](https://github.com/awslabs/aws-cdk/commit/32a74c6))
- **aws-cloudfront:** properly support loggingConfig ([#809](https://github.com/awslabs/aws-cdk/issues/809)) ([5512f70](https://github.com/awslabs/aws-cdk/commit/5512f70)), closes [#721](https://github.com/awslabs/aws-cdk/issues/721)
- **aws-codecommit:** typo in README ([#780](https://github.com/awslabs/aws-cdk/issues/780)) ([0e79c2d](https://github.com/awslabs/aws-cdk/commit/0e79c2d))
- **aws-ec2:** Add Burstable Generation 3 Instances ([#812](https://github.com/awslabs/aws-cdk/issues/812)) ([d36ee6d](https://github.com/awslabs/aws-cdk/commit/d36ee6d))
- **aws-ec2:** fix capitalization of "VPCEndpointType" to "VpcEndpointType" ([#789](https://github.com/awslabs/aws-cdk/issues/789)) ([7a8ee2c](https://github.com/awslabs/aws-cdk/commit/7a8ee2c)), closes [#765](https://github.com/awslabs/aws-cdk/issues/765)
- **aws-ec2:** fix typo in resource identifier ([#818](https://github.com/awslabs/aws-cdk/issues/818)) ([f529c80](https://github.com/awslabs/aws-cdk/commit/f529c80))
- **aws-elbv2:** fix load balancer registration ([#890](https://github.com/awslabs/aws-cdk/issues/890)) ([8cc9abe](https://github.com/awslabs/aws-cdk/commit/8cc9abe))
- **aws-s3:** properly export bucketDomainName ([#844](https://github.com/awslabs/aws-cdk/issues/844)) ([a65060d](https://github.com/awslabs/aws-cdk/commit/a65060d))
- **aws-sqs:** Queue.import() doesn't return a value ([#885](https://github.com/awslabs/aws-cdk/issues/885)) ([c592b7f](https://github.com/awslabs/aws-cdk/commit/c592b7f)), closes [#879](https://github.com/awslabs/aws-cdk/issues/879)
- **cdk:** fix TagManager to evaluate to undefined if no tags are included ([#882](https://github.com/awslabs/aws-cdk/issues/882)) ([477c827](https://github.com/awslabs/aws-cdk/commit/477c827))
- **cdk:** init templates were not upgraded to typescript ^3.0.0 ([#904](https://github.com/awslabs/aws-cdk/issues/904)) ([2cc7475](https://github.com/awslabs/aws-cdk/commit/2cc7475))
- **cdk:** jsx support conflicts with React usage ([#884](https://github.com/awslabs/aws-cdk/issues/884)) ([76d8031](https://github.com/awslabs/aws-cdk/commit/76d8031)), closes [#830](https://github.com/awslabs/aws-cdk/issues/830)
- **cfn2ts:** expect Token instead of CloudFormationToken ([#896](https://github.com/awslabs/aws-cdk/issues/896)) ([6eee1d2](https://github.com/awslabs/aws-cdk/commit/6eee1d2))
- **docs:** fix issue [#718](https://github.com/awslabs/aws-cdk/issues/718) (Aurora DB example) ([#783](https://github.com/awslabs/aws-cdk/issues/783)) ([016f3a8](https://github.com/awslabs/aws-cdk/commit/016f3a8))
- **docs:** update supported languages in README ([#819](https://github.com/awslabs/aws-cdk/issues/819), [#450](https://github.com/awslabs/aws-cdk/issues/450)) ([#820](https://github.com/awslabs/aws-cdk/issues/820)) ([ffac98c](https://github.com/awslabs/aws-cdk/commit/ffac98c))
- Correct heading level of CHANGELOG.md 0.10.0 ([40d9ef0](https://github.com/awslabs/aws-cdk/commit/40d9ef0))
- Emit valid YAML-1.1 ([#876](https://github.com/awslabs/aws-cdk/issues/876)) ([ff857ea](https://github.com/awslabs/aws-cdk/commit/ff857ea)), closes [#875](https://github.com/awslabs/aws-cdk/issues/875)
- **toolkit:** improve error message for large templates ([#900](https://github.com/awslabs/aws-cdk/issues/900)) ([a41f48f](https://github.com/awslabs/aws-cdk/commit/a41f48f)), closes [#34](https://github.com/awslabs/aws-cdk/issues/34)

## Code Refactoring

- **aws-iam:** move IAM classes cdk to aws-iam ([#866](https://github.com/awslabs/aws-cdk/issues/866)) ([d46a95b](https://github.com/awslabs/aws-cdk/commit/d46a95b)), closes [#196](https://github.com/awslabs/aws-cdk/issues/196)
- **util:** remove [@aws-cdk](https://github.com/aws-cdk)/util ([#745](https://github.com/awslabs/aws-cdk/issues/745)) ([10015cb](https://github.com/awslabs/aws-cdk/commit/10015cb)), closes [#709](https://github.com/awslabs/aws-cdk/issues/709)
- **framework:** remove app boilerplate and improvements to cx protocol ([#868](https://github.com/awslabs/aws-cdk/issues/868)) ([005beec](https://github.com/awslabs/aws-cdk/commit/005beec)), closes [#216](https://github.com/awslabs/aws-cdk/issues/216)

## Features

- **aws-apigateway:** "LambdaRestApi" and "addProxy" routes ([#867](https://github.com/awslabs/aws-cdk/issues/867)) ([905a95d](https://github.com/awslabs/aws-cdk/commit/905a95d))
- **aws-cdk:** add maven wrapper to java template ([#811](https://github.com/awslabs/aws-cdk/issues/811)) ([72aa872](https://github.com/awslabs/aws-cdk/commit/72aa872))
- **aws-cloudformation:** rename the CFN CodePipeline Actions. ([#771](https://github.com/awslabs/aws-cdk/issues/771)) ([007e7b4](https://github.com/awslabs/aws-cdk/commit/007e7b4))
- **aws-cloudformation:** update the ReadMe of the module to reflect the new Action names. ([#775](https://github.com/awslabs/aws-cdk/issues/775)) ([6c0e75b](https://github.com/awslabs/aws-cdk/commit/6c0e75b)), closes [#771](https://github.com/awslabs/aws-cdk/issues/771)
- **aws-cloudfront:** Support Security Policy ([#804](https://github.com/awslabs/aws-cdk/issues/804)) ([b39bf11](https://github.com/awslabs/aws-cdk/commit/b39bf11)), closes [#795](https://github.com/awslabs/aws-cdk/issues/795)
- **aws-codedeploy:** Add the auto-scaling groups property to ServerDeploymentGroup. ([#739](https://github.com/awslabs/aws-cdk/issues/739)) ([0b28886](https://github.com/awslabs/aws-cdk/commit/0b28886))
- **aws-codedeploy:** Deployment Configuration Construct. ([#653](https://github.com/awslabs/aws-cdk/issues/653)) ([e6b67ad](https://github.com/awslabs/aws-cdk/commit/e6b67ad))
- **aws-codedeploy:** support setting a load balancer on a Deployment Group. ([#786](https://github.com/awslabs/aws-cdk/issues/786)) ([e7af9f5](https://github.com/awslabs/aws-cdk/commit/e7af9f5))
- **aws-codepipeline:** allow specifying the runOrder property when creating Actions. ([#776](https://github.com/awslabs/aws-cdk/issues/776)) ([d146c8d](https://github.com/awslabs/aws-cdk/commit/d146c8d))
- **aws-codepipeline, aws-codecommit, aws-s3:** change the convention for naming the source Actions to XxxSourceAction. ([#753](https://github.com/awslabs/aws-cdk/issues/753)) ([9c3ce7f](https://github.com/awslabs/aws-cdk/commit/9c3ce7f))
- **aws-dynamodb:** IAM grants support ([#870](https://github.com/awslabs/aws-cdk/issues/870)) ([c5a4200](https://github.com/awslabs/aws-cdk/commit/c5a4200))
- **aws-dynamodb:** support Global Secondary Indexes ([#760](https://github.com/awslabs/aws-cdk/issues/760)) ([3601440](https://github.com/awslabs/aws-cdk/commit/3601440))
- **aws-dynamodb:** tags support ([#814](https://github.com/awslabs/aws-cdk/issues/814)) ([924c84e](https://github.com/awslabs/aws-cdk/commit/924c84e))
- **aws-dynamodB:** support Local Secondary Indexes ([#825](https://github.com/awslabs/aws-cdk/issues/825)) ([3175af3](https://github.com/awslabs/aws-cdk/commit/3175af3))
- **aws-ec2:** add support for ICMP protocol's classification Types & Codes to SecurityGroupRule ([#893](https://github.com/awslabs/aws-cdk/issues/893)) ([85bd3c0](https://github.com/awslabs/aws-cdk/commit/85bd3c0))
- **aws-ec2:** allow configuring subnets for NAT gateway ([#874](https://github.com/awslabs/aws-cdk/issues/874)) ([8ec761c](https://github.com/awslabs/aws-cdk/commit/8ec761c))
- **aws-ec2:** support UDP port ranges in SecurityGroups ([#835](https://github.com/awslabs/aws-cdk/issues/835)) ([b42ef90](https://github.com/awslabs/aws-cdk/commit/b42ef90))
- **aws-elasticloadbalancingv2:** support for ALB/NLB ([#750](https://github.com/awslabs/aws-cdk/issues/750)) ([bd9ee01](https://github.com/awslabs/aws-cdk/commit/bd9ee01))
- **aws-s3:** support granting public access to objects ([#886](https://github.com/awslabs/aws-cdk/issues/886)) ([bdee191](https://github.com/awslabs/aws-cdk/commit/bdee191)), closes [#877](https://github.com/awslabs/aws-cdk/issues/877)
- **cdk:** Add support for UseOnlineResharding with UpdatePolicies ([#881](https://github.com/awslabs/aws-cdk/issues/881)) ([1f717e1](https://github.com/awslabs/aws-cdk/commit/1f717e1))
- **cdk:** configurable default SSM context provider ([#889](https://github.com/awslabs/aws-cdk/issues/889)) ([353412b](https://github.com/awslabs/aws-cdk/commit/353412b))
- **core:** resource overrides (escape hatch) ([#784](https://github.com/awslabs/aws-cdk/issues/784)) ([5054eef](https://github.com/awslabs/aws-cdk/commit/5054eef)), closes [#606](https://github.com/awslabs/aws-cdk/issues/606)
- **aws-codepipeline**: Manage IAM permissions for (some) CFN CodePipeline actions ([#843](https://github.com/awslabs/aws-cdk/issues/843)) ([4c69118](https://github.com/awslabs/aws-cdk/commit/4c69118))
- **toolkit:** Stop creating 'empty' stacks ([#779](https://github.com/awslabs/aws-cdk/issues/779)) ([1dddd8a](https://github.com/awslabs/aws-cdk/commit/1dddd8a))
- **aws-autoscaling, aws-ec2:** Tagging support for AutoScaling/SecurityGroup ([#766](https://github.com/awslabs/aws-cdk/issues/766)) ([3d48eb2](https://github.com/awslabs/aws-cdk/commit/3d48eb2))

## BREAKING CHANGES

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

# [0.10.0](https://github.com/awslabs/aws-cdk/compare/v0.9.2...v0.10.0) (2018-09-27)

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

## Bug Fixes

- **aws-codecommit:** typo in README ([#780](https://github.com/awslabs/aws-cdk/issues/780)) ([0e79c2d](https://github.com/awslabs/aws-cdk/commit/0e79c2d))
- **aws-ec2:** fix capitalization of "VPCEndpointType" to "VpcEndpointType" ([#789](https://github.com/awslabs/aws-cdk/issues/789)) ([7a8ee2c](https://github.com/awslabs/aws-cdk/commit/7a8ee2c)), closes [#765](https://github.com/awslabs/aws-cdk/issues/765)
- **docs:** fix issue [#718](https://github.com/awslabs/aws-cdk/issues/718) (Aurora DB example) ([#783](https://github.com/awslabs/aws-cdk/issues/783)) ([016f3a8](https://github.com/awslabs/aws-cdk/commit/016f3a8))

## Code Refactoring

- **util:** remove [@aws-cdk](https://github.com/aws-cdk)/util ([#745](https://github.com/awslabs/aws-cdk/issues/745)) ([10015cb](https://github.com/awslabs/aws-cdk/commit/10015cb)), closes [#709](https://github.com/awslabs/aws-cdk/issues/709)

## Features

- **aws-cloudformation:** rename the CodePipeline actions ([#771](https://github.com/awslabs/aws-cdk/issues/771)) ([007e7b4](https://github.com/awslabs/aws-cdk/commit/007e7b4))
- **aws-cloudformation:** update the README of the module to reflect the new action names ([#775](https://github.com/awslabs/aws-cdk/issues/775)) ([6c0e75b](https://github.com/awslabs/aws-cdk/commit/6c0e75b)), closes [#771](https://github.com/awslabs/aws-cdk/issues/771)
- **aws-codedeploy:** add auto-scaling groups property to ServerDeploymentGroup ([#739](https://github.com/awslabs/aws-cdk/issues/739)) ([0b28886](https://github.com/awslabs/aws-cdk/commit/0b28886))
- **aws-codedeploy:** add deployment configuration construct ([#653](https://github.com/awslabs/aws-cdk/issues/653)) ([e6b67ad](https://github.com/awslabs/aws-cdk/commit/e6b67ad))
- **aws-codepipeline, aws-codecommit, aws-s3:** change the convention for naming the source Actions to XxxSourceAction ([#753](https://github.com/awslabs/aws-cdk/issues/753)) ([9c3ce7f](https://github.com/awslabs/aws-cdk/commit/9c3ce7f))
- **aws-elasticloadbalancingv2:** support for ALB/NLB ([#750](https://github.com/awslabs/aws-cdk/issues/750)) ([bd9ee01](https://github.com/awslabs/aws-cdk/commit/bd9ee01))
- tagging support for AutoScaling/SecurityGroup ([#766](https://github.com/awslabs/aws-cdk/issues/766)) ([3d48eb2](https://github.com/awslabs/aws-cdk/commit/3d48eb2))
- **core:** resource overrides (escape hatch) ([#784](https://github.com/awslabs/aws-cdk/issues/784)) ([5054eef](https://github.com/awslabs/aws-cdk/commit/5054eef)), closes [#606](https://github.com/awslabs/aws-cdk/issues/606)
- **toolkit:** stop creating 'empty' stacks ([#779](https://github.com/awslabs/aws-cdk/issues/779)) ([1dddd8a](https://github.com/awslabs/aws-cdk/commit/1dddd8a))

## BREAKING CHANGES

- **cdk**: the constructor signature of `TagManager` has changed. `initialTags` is now passed inside a props object.
- **util:** `@aws-cdk/util` is no longer available
- **aws-elasticloadbalancingv2:** adds classes for modeling Application and Network Load Balancers. AutoScalingGroups now implement the interface that makes constructs a load balancing target. The breaking change is that Security Group rule identifiers have been changed in order to make adding rules more reliable. No code changes are necessary but existing deployments may experience unexpected changes.
- **aws-cloudformation:** this renames all CloudFormation Actions for CodePipeline to bring them in line with Actions defined in other service packages.
- **aws-codepipeline, aws-codecommit, aws-s3:** change the names of the source Actions from XxxSource to XxxSourceAction. This is to align them with the other Actions, like Build. Also, CodeBuild has the concept of Sources, so it makes sense to strongly differentiate between the two.

## CloudFormation Changes

- **@aws-cdk/cfnspec**: Updated [CloudFormation resource specification] to `v2.8.0` ([@RomainMuller] in [#767](https://github.com/awslabs/aws-cdk/pull/767))

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

# [0.9.2](https://github.com/awslabs/aws-cdk/compare/v0.9.1...v0.9.2) (2018-09-20)

**NOTICE**: This release includes a framework-wide [**breaking change**](https://github.com/awslabs/aws-cdk/issues/712) which changes the type of all the string resource attributes across the framework. Instead of using strong-types that extend `cdk.Token` (such as `QueueArn`, `TopicName`, etc), we now represent all these attributes as normal `string`s, and codify the tokens into the string (using the feature introduced in [#168](https://github.com/awslabs/aws-cdk/issues/168)).

Furthermore, the `cdk.Arn` type has been removed. In order to format/parse ARNs, use the static methods on `cdk.ArnUtils`.

See motivation and discussion in [#695](https://github.com/awslabs/aws-cdk/issues/695).

## Breaking Changes

- **cfn2ts:** use stringified tokens for resource attributes instead of strong types ([#712](https://github.com/awslabs/aws-cdk/issues/712)) ([6508f78](https://github.com/awslabs/aws-cdk/commit/6508f78)), closes [#518](https://github.com/awslabs/aws-cdk/issues/518) [#695](https://github.com/awslabs/aws-cdk/issues/695) [#744](https://github.com/awslabs/aws-cdk/issues/744)
- **aws-dynamodb:** Attribute type for keys, changes the signature of the `addPartitionKey` and `addSortKey` methods to be consistent across the board. ([#720](https://github.com/awslabs/aws-cdk/issues/720)) ([e6cc189](https://github.com/awslabs/aws-cdk/commit/e6cc189))
- **aws-codebuild:** fix typo "priviledged" -> "privileged

## Bug Fixes

- **assets:** can't use multiple assets in the same stack ([#725](https://github.com/awslabs/aws-cdk/issues/725)) ([bba2e5b](https://github.com/awslabs/aws-cdk/commit/bba2e5b)), closes [#706](https://github.com/awslabs/aws-cdk/issues/706)
- **aws-codebuild:** typo in BuildEnvironment "priviledged" -> "privileged ([#734](https://github.com/awslabs/aws-cdk/issues/734)) ([72fec36](https://github.com/awslabs/aws-cdk/commit/72fec36))
- **aws-ecr:** fix addToResourcePolicy ([#737](https://github.com/awslabs/aws-cdk/issues/737)) ([eadbda5](https://github.com/awslabs/aws-cdk/commit/eadbda5))
- **aws-events:** ruleName can now be specified ([#726](https://github.com/awslabs/aws-cdk/issues/726)) ([a7bc5ee](https://github.com/awslabs/aws-cdk/commit/a7bc5ee)), closes [#708](https://github.com/awslabs/aws-cdk/issues/708)
- **aws-lambda:** jsii use no long requires 'sourceAccount' ([#728](https://github.com/awslabs/aws-cdk/issues/728)) ([9e7d311](https://github.com/awslabs/aws-cdk/commit/9e7d311)), closes [#714](https://github.com/awslabs/aws-cdk/issues/714)
- **aws-s3:** remove `policy` argument ([#730](https://github.com/awslabs/aws-cdk/issues/730)) ([a79190c](https://github.com/awslabs/aws-cdk/commit/a79190c)), closes [#672](https://github.com/awslabs/aws-cdk/issues/672)
- **cdk:** "cdk init" java template is broken ([#732](https://github.com/awslabs/aws-cdk/issues/732)) ([281c083](https://github.com/awslabs/aws-cdk/commit/281c083)), closes [#711](https://github.com/awslabs/aws-cdk/issues/711) [awslabs/jsii#233](https://github.com/awslabs/jsii/issues/233)

## Features

- **aws-apigateway:** new API Gateway Construct Library ([#665](https://github.com/awslabs/aws-cdk/issues/665)) ([b0f3857](https://github.com/awslabs/aws-cdk/commit/b0f3857))
- **aws-cdk:** detect presence of EC2 credentials ([#724](https://github.com/awslabs/aws-cdk/issues/724)) ([8e8c295](https://github.com/awslabs/aws-cdk/commit/8e8c295)), closes [#702](https://github.com/awslabs/aws-cdk/issues/702) [#130](https://github.com/awslabs/aws-cdk/issues/130)
- **aws-codepipeline:** make the Stage insertion API in CodePipeline more flexible ([#460](https://github.com/awslabs/aws-cdk/issues/460)) ([d182818](https://github.com/awslabs/aws-cdk/commit/d182818))
- **aws-codepipeline:** new "Pipeline#addStage" convenience method ([#647](https://github.com/awslabs/aws-cdk/issues/647)) ([25c9fa0](https://github.com/awslabs/aws-cdk/commit/25c9fa0))
- **aws-rds:** add support for parameter groups ([#729](https://github.com/awslabs/aws-cdk/issues/729)) ([2541508](https://github.com/awslabs/aws-cdk/commit/2541508)), closes [#719](https://github.com/awslabs/aws-cdk/issues/719)
- **docs:** add documentation for CDK toolkit plugings ([#733](https://github.com/awslabs/aws-cdk/issues/733)) ([965b918](https://github.com/awslabs/aws-cdk/commit/965b918))
- **dependencies:** upgrade to [jsii 0.7.6](https://github.com/awslabs/jsii/releases/tag/v0.7.6)

[]()

# [0.9.1](https://github.com/awslabs/aws-cdk/compare/v0.9.0...v0.9.1) (2018-09-13)

## Bug Fixes

- **aws-cdk:** Fix proxy support for account lookup ([#693](https://github.com/awslabs/aws-cdk/issues/693)) ([5468225](https://github.com/awslabs/aws-cdk/commit/5468225)), closes [#645](https://github.com/awslabs/aws-cdk/issues/645)

## Features

- **aws-ec2** BREAKING: Move LoadBalancer to aws-elasticloadbalancing package ([#705](https://github.com/awslabs/aws-cdk/issues/705)) ([4bd1cf2](https://github.com/awslabs/aws-cdk/commit/4bd1cf2a793c00a2aa3938b0dff6d4147690bd22))
- **aws-serverless** BREAKING: Rename @aws-cdk/aws-serverless to @aws-cdk/aws-sam ([#704](https://github.com/awslabs/aws-cdk/pull/704)) ([3a67d5d](https://github.com/awslabs/aws-cdk/commit/3a67d5d91673294024c68088ed0e9224b8ebd857))
- **aws-dynamodb:** Support DynamoDB TTL ([#691](https://github.com/awslabs/aws-cdk/issues/691)) ([35b6206](https://github.com/awslabs/aws-cdk/commit/35b6206))
- **aws-dynamodb:** Support DynamoDB PITR ([#701](https://github.com/awslabs/aws-cdk/issues/701)) ([7a4d7b7](https://github.com/awslabs/aws-cdk/commit/7a4d7b7))
- **aws-ecr:** Add support for ECR repositories ([#697](https://github.com/awslabs/aws-cdk/issues/697)) ([c6c09bf](https://github.com/awslabs/aws-cdk/commit/c6c09bf))
- **aws-lambda:** Add support for XRay Tracing ([#675](https://github.com/awslabs/aws-cdk/issues/675)) ([b4435cc](https://github.com/awslabs/aws-cdk/commit/b4435cc))
- **cfnspec:** Add DeploymentPreference Patch for SAM Spec ([#681](https://github.com/awslabs/aws-cdk/issues/681)) ([#681](https://github.com/awslabs/aws-cdk/issues/681)) ([f96c487](https://github.com/awslabs/aws-cdk/commit/f96c487))

# 0.9.0 -- 2018-09-10

The headliners of this release are **.NET support**, and a wealth of commits by external contributors who are stepping up to fix the CDK for their use cases! Thanks all for the effort put into this release!

## Features

- Add strongly-named .NET targets, and a `cdk init` template for C# projects ([@mpiroc] in [#617](https://github.com/awslabs/aws-cdk/pull/617), [#643](https://github.com/awslabs/aws-cdk/pull/643)).
- **@aws-cdk/aws-autoscaling**: Allow attaching additional security groups to Launch Configuration ([@moofish32] in [#636](https://github.com/awslabs/aws-cdk/pull/636)).
- **@aws-cdk/aws-autoscaling**: Support update and creation policies on AutoScalingGroups ([@rix0rrr] in [#595](https://github.com/awslabs/aws-cdk/pull/595)).
- **@aws-cdk/aws-codebuild**: Add support for running script from an asset ([@rix0rrr] in [#677](https://github.com/awslabs/aws-cdk/pull/677)).
- **@aws-cdk/aws-codebuild**: New method `addBuildToPipeline` on Project ([@skinny85] in [783dcb3](https://github.com/awslabs/aws-cdk/commit/783dcb3bd10058a25785d0964b37c181617a203a)).
- **@aws-cdk/aws-codecommit**: New method `addToPipeline` on Repository ([@skinny85] in [#616](https://github.com/awslabs/aws-cdk/pull/616)).
- **@aws-cdk/aws-codedeploy**: Add initial support for CodeDeploy ([@skinny85] in [#593](https://github.com/awslabs/aws-cdk/pull/593), [#641](https://github.com/awslabs/aws-cdk/pull/641)).
- **@aws-cdk/aws-dynamodb**: Add support for DynamoDB autoscaling ([@SeekerWing] in [#637](https://github.com/awslabs/aws-cdk/pull/637)).
- **@aws-cdk/aws-dynamodb**: Add support for DynamoDB streams ([@rhboyd] in [#633](https://github.com/awslabs/aws-cdk/pull/633)).
- **@aws-cdk/aws-dynamodb**: Add support for server-side encryption ([@jungseoklee] in [#684](https://github.com/awslabs/aws-cdk/pull/864)).
- **@aws-cdk/aws-ec2** (_**BREAKING**_): SecurityGroup can now be used as a Connectable [#582](https://github.com/awslabs/aws-cdk/pull/582)).
- **@aws-cdk/aws-ec2**: Add VPC tagging ([@moofish] in [#538](https://github.com/awslabs/aws-cdk/pull/538)).
- **@aws-cdk/aws-ec2**: Add support for `InstanceSize.Nano` ([@rix0rrr] in [#581](https://github.com/awslabs/aws-cdk/pull/581))
- **@aws-cdk/aws-lambda**: Add support for dead letter queues ([@SeekerWing] in [#663](https://github.com/awslabs/aws-cdk/pull/663)).
- **@aws-cdk/aws-lambda**: Add support for placing a Lambda in a VPC ([@rix0rrr] in [#598](https://github.com/awslabs/aws-cdk/pull/598)).
- **@aws-cdk/aws-logs**: Add `extractMetric()` helper function ([@rix0rrr] in [#676](https://github.com/awslabs/aws-cdk/pull/676)).
- **@aws-cdk/aws-rds**: Add support for Aurora PostreSQL/MySQL engines ([@cookejames] in [#586](https://github.com/awslabs/aws-cdk/pull/586))
- **@aws-cdk/aws-s3**: Additional grant methods for Buckets ([@eladb] in [#591](https://github.com/awslabs/aws-cdk/pull/591))
- **@aws-cdk/aws-s3**: New method `addToPipeline` on Bucket ([@skinny85] in [c8b7a49](https://github.com/awslabs/aws-cdk/commit/c8b7a494259ad08bbd722564591e320888e47c48)).
- **aws-cdk**: Add support for HTTP proxies ([@rix0rrr] in [#666](https://github.com/awslabs/aws-cdk/pull/666)).
- **aws-cdk**: Toolkit now shows failure reason if stack update fails ([@rix0rrr] in [#609](https://github.com/awslabs/aws-cdk/pull/609)).
- **cdk-build-tools**: Add support for running experiment JSII versions ([@RomainMuller] in [#649](https://github.com/awslabs/aws-cdk/pull/649)).

## Changes

- _**BREAKING**_: Generate classes and types for the CloudFormation resource `.ref` attributes ([@rix0rrr] in [#627](https://github.com/awslabs/aws-cdk/pull/627)).
- _**BREAKING**_: Make types accepted in Policy-related classes narrower (from `any` to `Arn`, for example) to reduce typing mistakes ([@rix0rrr] in [#629](https://github.com/awslabs/aws-cdk/pull/629)).
- **@aws-cdk/aws-codepipeline** (_**BREAKING**_): Align the CodePipeline APIs ([@skinny85] in [#492](https://github.com/awslabs/aws-cdk/pull/492), [#568](https://github.com/awslabs/aws-cdk/pull/568))
- **@aws-cdk/aws-ec2** (_**BREAKING**_): Move Fleet/AutoScalingGroup to its own package ([@rix0rrr] in [#608](https://github.com/awslabs/aws-cdk/pull/608)).
- **aws-cdk**: Simplify plugin protocol ([@RomainMuller] in [#646](https://github.com/awslabs/aws-cdk/pull/646)).

## Bug Fixes

- **@aws-cdk/aws-cloudfront**: Fix CloudFront behavior for ViewerProtocolPolicy ([@mindstorms6] in [#615](https://github.com/awslabs/aws-cdk/pull/615)).
- **@aws-cdk/aws-ec2**: VPC Placement now supports picking Isolated subnets ([@rix0rrr] in [#610](https://github.com/awslabs/aws-cdk/pull/610)).
- **@aws-cdk/aws-logs**: Add `export()/import()` capabilities ([@rix0rrr] in [#630](https://github.com/awslabs/aws-cdk/pull/630)).
- **@aws-cdk/aws-rds**: Fix a bug where a cluster with 1 instance could not be created ([@cookejames] in [#578](https://github.com/awslabs/aws-cdk/pull/578))
- **@aws-cdk/aws-s3**: Bucket notifications can now add dependencies, fixing creation order ([@eladb] in [#584](https://github.com/awslabs/aws-cdk/pull/584)).
- **@aws-cdk/aws-s3**: Remove useless bucket name validation ([@rix0rrr] in [#628](https://github.com/awslabs/aws-cdk/pull/628)).
- **@aws-cdk/aws-sqs**: Make `QueueRef.encryptionMasterKey` readonly ([@RomainMuller] in [#650](https://github.com/awslabs/aws-cdk/pull/650)).
- **assets**: S3 read permissions are granted on a prefix to fix lost permissions during asset update ([@rix0rrr] in [#510](https://github.com/awslabs/aws-cdk/pull/510)).
- **aws-cdk**: Remove bootstrapping error if multiple stacks are in the same environment ([@RomainMuller] in [#625](https://github.com/awslabs/aws-cdk/pull/625)).
- **aws-cdk**: Report and continue if git throws errors during `cdk init` ([@rix0rrr] in [#587](https://github.com/awslabs/aws-cdk/pull/587)).

## CloudFormation Changes

- **@aws-cdk/cfnspec**: Updated [CloudFormation resource specification] to `v2.6.0` ([@RomainMuller] in [#594](https://github.com/awslabs/aws-cdk/pull/594))

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

- **@aws-cdk/cfnspec**: Updated Serverless Application Model (SAM) Resource Specification ([@RomainMuller] in [#594](https://github.com/awslabs/aws-cdk/pull/594))

  - **Property Changes**

    - AWS::Serverless::Api MethodSettings (**added**)

  - **Property Type Changes**

    - AWS::Serverless::Function.SQSEvent (**added**)
    - AWS::Serverless::Function.EventSource Properties.Types (**changed**)

      - Added SQSEvent

# 0.8.2 - 2018-08-15

## Features

- **@aws-cdk/cdk**: Tokens can now be transparently embedded into strings and encoded into JSON without losing their semantics. This makes it possible to treat late-bound (deploy-time) values as if they were regular strings ([@rix0rrr] in [#518](https://github.com/awslabs/aws-cdk/pull/518)).
- **@aws-cdk/aws-s3**: add support for bucket notifications to Lambda, SNS, and SQS targets ([@eladb] in [#201](https://github.com/awslabs/aws-cdk/pull/201), [#560](https://github.com/awslabs/aws-cdk/pull/560), [#561](https://github.com/awslabs/aws-cdk/pull/561), [#564](https://github.com/awslabs/aws-cdk/pull/564))
- **@aws-cdk/cdk**: non-alphanumeric characters can now be used as construct identifiers ([@eladb] in [#556](https://github.com/awslabs/aws-cdk/pull/556))
- **@aws-cdk/aws-iam**: add support for `maxSessionDuration` for Roles ([@eladb] in [#545](https://github.com/awslabs/aws-cdk/pull/545)).

## Changes

- **@aws-cdk/aws-lambda** (_**BREAKING**_): most classes renamed to be shorter and more in line with official service naming (`Lambda` renamed to `Function` or ommitted) ([@eladb] in [#550](https://github.com/awslabs/aws-cdk/pull/550))
- **@aws-cdk/aws-codepipeline** (_**BREAKING**_): move all CodePipeline actions from `@aws-cdk/aws-xxx-codepipeline` packages into the regular `@aws-cdk/aws-xxx` service packages ([@skinny85] in [#459](https://github.com/awslabs/aws-cdk/pull/459)).
- **@aws-cdk/aws-custom-resources** (_**BREAKING**_): package was removed, and the Custom Resource construct added to the **@aws-cdk/aws-cloudformation** package ([@rix0rrr] in [#513](https://github.com/awslabs/aws-cdk/pull/513))

## Fixes

- **@aws-cdk/aws-lambda**: Lambdas that are triggered by CloudWatch Events now show up in the console, and can only be triggered the indicated Event Rule. _**BREAKING**_ for middleware writers (as this introduces an API change), but transparent to regular consumers ([@eladb] in [#558](https://github.com/awslabs/aws-cdk/pull/558))
- **@aws-cdk/aws-codecommit**: fix a bug where `pollForSourceChanges` could not be set to `false` ([@maciejwalkowiak] in [#534](https://github.com/awslabs/aws-cdk/pull/534))
- **aws-cdk**: don't fail if the `~/.aws/credentials` file is missing ([@RomainMuller] in [#541](https://github.com/awslabs/aws-cdk/pull/541))
- **@aws-cdk/aws-cloudformation**: fix a bug in the CodePipeline actions to correctly support TemplateConfiguration ([@mindstorms6] in [#571](https://github.com/awslabs/aws-cdk/pull/571)).
- **@aws-cdk/aws-cloudformation**: fix a bug in the CodePipeline actions to correctly support ParameterOverrides ([@mindstorms6] in [#574](https://github.com/awslabs/aws-cdk/pull/574)).

## Known Issues

- `cdk init` will try to init a `git` repository and fail if no global `user.name` and `user.email` have been configured.

# 0.8.1 - 2018-08-08

## Features

- **aws-cdk**: Support `--profile` in command-line toolkit ([@rix0rrr] in [#517](https://github.com/awslabs/aws-cdk/issues/517))
- **@aws-cdk/cdk**: Introduce `Default` construct id ([@rix0rrr] in [#496](https://github.com/awslabs/aws-cdk/issues/496))
- **@aws-cdk/aws-lambda**: Add `LambdaRuntime.DotNetCore21` ([@Mortifera] in [#507](https://github.com/awslabs/aws-cdk/issues/507))
- **@aws-cdk/runtime-values** (_**BREAKING**_): rename 'rtv' to 'runtime-values' ([@rix0rrr] in [#494](https://github.com/awslabs/aws-cdk/issues/494))
- **@aws-cdk/aws-ec2**: Combine `Connections` and `DefaultConnections` classes ([@rix0rrr] in [#453](https://github.com/awslabs/aws-cdk/issues/453))
- **@aws-cdk/aws-codebuild**: allow `buildSpec` parameter to take a filename ([@rix0rrr] in [#470](https://github.com/awslabs/aws-cdk/issues/470))
- **@aws-cdk/aws-cloudformation-codepipeline**: add support for CloudFormation CodePipeline actions ([@mindstorms6] and [@rix0rrr] in [#525](https://github.com/awslabs/aws-cdk/pull/525)).
- **docs**: Improvements to Getting Started ([@eladb] in [#462](https://github.com/awslabs/aws-cdk/issues/462))
- **docs**: Updates to README ([@Doug-AWS] in [#456](https://github.com/awslabs/aws-cdk/issues/456))
- **docs**: Upgraded `jsii-pacmak` to `0.6.4`, which includes "language-native" type names and package coordinates ([@RomainMuller] in [awslabs/jsii#130](https://github.com/awslabs/jsii/pull/130))

## Bug fixes

- **aws-cdk** (toolkit): Fix java `cdk init` template ([@RomainMuller] in [#490](https://github.com/awslabs/aws-cdk/issues/490))
- **@aws-cdk/cdk** (_**BREAKING**_): Align `FnJoin` signature to CloudFormation ([@RomainMuller] in [#516](https://github.com/awslabs/aws-cdk/issues/516))
- **@aws-cdk/aws-cloudfront**: Fix origin error ([@mindstorms6] in [#514](https://github.com/awslabs/aws-cdk/issues/514))
- **@aws-cdk/aws-lambda**: Invalid cast for inline LambdaRuntime members in Java ([@eladb] in [#505](https://github.com/awslabs/aws-cdk/issues/505))
- **examples**: Fixed java examples ([@RomainMuller] in [#498](https://github.com/awslabs/aws-cdk/issues/498))

# 0.8.0 - 2018-07-31

**_This is the first public release of the AWS CDK!_**

- Change license to Apache-2.0 ([@RomainMuller] in [#428])
- Multiple README updates, including animated gif screencast, as preparation for public release ([@rix0rrr] in [#433], [@eladb] in [#439])
- Multiple documentation updates for public release ([@Doug-AWS] in [#420], [@eladb] in [#436])
- Toolkit (**bug fix**): Correctly account for `CDK::Metadata` in `cdk diff` ([@RomainMuller] in [#435])
- AWS CodeBuild (_**BREAKING**_): Usability improvements for the CodeBuild library ([@skinny85] in [#412])

# 0.7.4 - 2018-07-26

## Highlights

- A huge shout-out to our first external contributor, [@moofish32], for many valuable improvements to the EC2 VPC construct ([@moofish32] in [#250]).
- The `AWS::CDK::Metadata` resource is injected to templates to analyze usage and notify about deprecated modules to improve security. To opt-out, use the switch `--no-version-reporting` or set `version-reporting` to `false` in your `cdk.json` ([@RomainMuller] in [#221]).
- Added capability for bundling local assets (files/directories) and referencing them in CDK constructs. This allows, for example, to define Lambda functions with runtime code in the same project and deploy them using the toolkit ([@eladb] in [#371]).
- Reorganization of CodePipeline actions into separate libraries ([@skinny85] in [#401] and [#402]).
- A new library for CloudWatch Logs ([@rix0rrr] in [#307]).

## AWS Construct Library

- _**BREAKING**_: All AWS libraries renamed from `@aws-cdk/xxx` to `@aws-cdk/aws-xxx` in order to avoid conflicts with framework modules ([@RomainMuller] in [#384]).
- _**BREAKING**_: The **@aws-cdk/resources** module has been removed. Low-level CloudFormation resources (e.g. `BucketResource`) are now integrated into their respective library under the `cloudformation` namespace to improves discoverability and organization of the layers ([@RomainMuller] in [#264]).

## Framework

- Introducing **CDK Assets** which are local files or directories that can be "bundled" into CDK constructs and apps. During deployment assets are packaged (i.e. zipped), uploaded to S3 and their deployed location can be referenced in CDK apps via the `s3BucketName` and `s3ObjectKey` and `s3Url` and read permissions can be granted via `asset.grantRead(principal)` ([@eladb] in [#371])
- Return dummy values instead of fail synthesis if environmental context (AZs, SSM parameters) doesn't exist in order to support unit tests. When synthesizing through the toolkit, an error will be displayed if the context cannot be found ([@eladb] in [#227])
- Added `construct.addError(msg)`, `addWarning(msg)` and `addInfo(msg)` which will emit messages during synthesis via the toolkit. Errors will fail synthesis (unless `--ignore-errors` is used), warnings will be displayed and will fail synthesis if `--strict` is used ([@eladb] in [#227])

## Command Line Toolkit

- The toolkit now injects a special CloudFormation resource `AWS::CDK::Metadata` to all synthesized templates which includes library versions used in the app. This allows the CDK team to analyze usage and notify users if they use deprecated versions ([@RomainMuller] in [#221]).
- **Bug fix**: Fixed "unknown command: docs" ([@RomainMuller] in [#256])
- Changed output of `cdk list` to just print stack names (scripting-compatible). Use `cdk ls -l` to print full info ([@eladb] in [#380])

## AWS EC2

- _**BREAKING**_: Add the ability customize subnet configurations. Subnet allocation was changed to improve IP space efficiency. `VpcNetwork` instances will need to be replaced ([@moofish32] in [#250])
- _**BREAKING**_: Renamed `Fleet` to `AutoScalingGroup` to align with service terminology ([@RomainMuller] in [#318])

## AWS Lambda

- Supports runtime code via local files or directories through assets ([@eladb] in [#405])
- Support custom execution role in props ([@rix0rrr] in [#205])
- Add static `metricAllConcurrentExecutions` and `metricAllUnreservedConcurrentExecutions` which returns account/region-level metrics for all functions ([@rix0rrr] in [#379])

## AWS CloudWatch

- Added `Metric.grantMetricPutData` which grants cloudwatch:PutData to IAM principals ([@rix0rrr] in [#214])
- **Bug fix**: Allow text included in dashboard widgets to include characters that require JSON-escaping ([@eladb] in [#406]).

## AWS CloudWatch Logs (new)

- A new construct library for AWS CloudWatch Logs with support for log groups, metric filters, and subscription filters ([@rix0rrr] in [#307]).

## AWS S3

- Added `bucketUrl` and `urlForObject(key)` to `BucketRef` ([@eladb] in [#370])

## AWS CodeBuild

- Add CloudWatch metrics to `BuildProject` ([@eladb] in [#407])

## AWS CodePipeline

- _**BREAKING**_: Moved CodeCommit and CodeBuild and LambdaInvoke actions from the CodePipeline library to `@aws-cdk/aws-xxx-codepipline` modules ([@skinny85] in [#401] and [#402]).
- Added attributes `pipelineName` and `pipelineVersion` ([@eladb] in [#408])

## Docs

- **fix**: add instructions and fix Windows setup ([@mpiroc] in [#320])
- **fix**: show emphasis of modified code in code snippets ([@eladb] in [#396])

# 0.7.3 - 2018-07-09

## Highlights

- Introducing Java support (see the **Getting Started** documentation topic for instructions on how to set up a Java project).
- Introduce a new programming model for CloudWatch metrics, alarms and dashboards (see the [@aws-cdk/cloudwatch documentation]).
- Multiple documentation improvements (open with `cdk docs`).

## Known Issues

- Missing instructions for Windows Setup ([#138])
- `cdk docs` works but a message **Unknown command: docs** is printed ([#256])
- Java: passing `null` behaves differently than no arguments. Workaround is to build an empty object ([#157])

## Changes

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

# 0.7.2 - 2018-06-19

- Add: initial construct library for [AWS Kinesis Data Streams] ([@sam-goodwin] in [#86])
- Update low-level resources from [CloudFormation resource specification]
- Update dependencies ([@eladb] in [#119])
- Fix: Adopt SDK-standard behavior when no environment is specified ([@RomainMuller] in [#128])
- Fix: Have cdk diff output render 'number' value changes ([@RomainMuller] in [#136])

## Known issues

- Windows setup has not been vetted and might be broken - **no workaround** ([#138])
- If region is not defined, error message is unclear - **workaround**: make sure to define `region` when running `aws configure` ([#131])
- `cdk docs` opens the index instead of the welcome page - **workaround**: click on "Welcome" in the sidebar ([#129])
- The runtime values library (**@aws-cdk/rtv**) is broken ([#151])

# 0.7.1 - 2018-06-15

## Framework

- Two-way IAM policy statement additions have been removed for S3 and SNS, because those services treat resource and identity policies as additive. KMS grants are still added on both resource and identity because KMS requires permissions set from both sides.

## Toolkit

- `cdk init` interface changed to accept the template name as a positional argument, and the language as an option. A `--list` option was added to allow listing available templates.
- `cdk-beta-npm` is a wrapper to `npm` that executes commands with a local registry that has the CDK packages available. It should be used instead of `npm` for subcommands such as `npm install`.
- CDK now respects `AWS_DEFAULT_REGION` environment variable if set.

# 0.7.0 - 2018-06-13

## Framework

- _BREAKING_: All CDK packages are non under the scope `@aws-cdk` (e.g. `@aws-cdk/s3`).
- _BREAKING_: The `jsii` compiler now configures `tsconfig.json` to produce definition files (files with a .d.ts extension). This requires updating your existing `package.json` files `types` key to replace the .ts extension with a .d.ts extension.
- Java bindings now include static methods and constants.
- `SecretParameter` can be used to load values from the SSM parameter store during deployment and use them as `Secret`s.
- `Stack` is locked for mutations during synthesis to protect against accidental changes in lazy values.
- An overhaul of documentation updates, edits and improvements.

## ACM

- Fix: `cloudFrontDefaultCertificate` is mutually exclusive with `acmCertificateArn`.

## CloudFront (new)

- Added a new construct library for AWS CloudFront.

## CodeBuild

- Added support for specifying environment variables at the container and project levels.

## CodePipeline

- Fix: GitHub action "owner" changed to `ThirdParty`.
- Removed all fluent APIs
- Use "master" as the default branch for Source actions
- _BREAKING_: `AmazonS3SourceProps` - renamed `key` to `bucketKey`

## Custom Resources

- _BREAKING_: Require that Lambda is referenced explicitly when defining a custom resource. `SingletonLambda` can be used to encapsulate the custom resource's lambda function but only have a single instance of it in the stack.

## Events (new)

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

## IAM

- Add `CanonicalUserPrincipal`
- Add `statementCount` to `PolicyDocumennt`.
- Extended support for `FederatedPrincipal`.

## Lambda

- Add `initialPolicy` prop which allows specifying a set of `PolicyStatement`s upon definition.

## S3

- Added support for lifecycle rules
- Add `domainName` and `dualstackDomainName` attributes

## Serverless

- `version` field of `FunctionResource` is now optional.

## SNS

- _BREAKING_: `subscribeXxx` APIs now do not require a name when possible (for queue, Lambda).
- Unique SID assigned to resource policy statements.

## Toolkit

- `cdk docs` opens your browser with the bundled documentation content.
- `cdk init` interface changed to specify `--lang` and `--type` separately.
- Plug-in architecture improved.

# 0.6.0 - 2018-05-16

## AWS Construct Libraries

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

## Construct initializers now include a name

All constructs in a CDK stack must have a name unique amongst its siblings. Names are used to allocate stack-wide logical IDs for each CloudFormation resource. Prior to this release, the name of the class was implicitly used as a default name for the construct. As much as this was convenient, we realized it was misleading and potentially unsafe, since a change in a class name will result in changes to all logical IDs for all resources created within that tree, and changes to logical IDs result in **resource replacement** since CloudFormation cannot associate the existing resource with the new resource (this is the purpose of logical IDs in CloudFormation).

Therefore, we decided construct names deserve an explicit and prominent place in our programming model and starting from this release, they have been promoted to the 2nd argument of all initializers.

```typescript
new MyConstruct(parent, name, props);
```

## New scheme for allocating CloudFormation logical IDs

In order to ensure uniqueness of logical IDs within a stack, we need to reflect the resource's full CDK path within it's logical ID. Prior to this release, logical IDs were a simple concatenation of the path components leading up to the resource. However, this could potentially create unresolvable conflicts ("a/b/c" == "ab/c").

Since logical IDs may only use alphanumeric characters and also restricted in length, we are unable to simply use a delimited path as the logical ID. Instead IDs are allocated by concatenating a human-friendly rendition from the path (components, de-duplicate, trim) with a short MD5 hash of the delimited path:

```
VPCPrivateSubnet2RouteTable0A19E10E
<-----------human---------><-hash->
```

One exception to this scheme is resources which are direct children of the `Stack`. Such resources will use their name as a logical ID (without the hash). This is done to support easier migration from existing CloudFormation templates.

## Renaming logical IDs to avoid destruction of resources

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

## All "props" types are now interfaces instead of classes

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

## A design pattern for exporting/importing resources

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

## Region-aware APIs for working with machine images (AMIs)

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

## A rich programming model for Code Suite services

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

## Inline JavaScript Lambda Functions

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

## Resource and role IAM policies and grants

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

## Security group connections framework

The **@aws-cdk/ec2** library includes a rich framework for modeling security group connections between resources such as a fleet, load balancers and databases.

For example, these automatically create appropriate ingress and egress rules in both security groups:

```typescript
// allow fleet1 top connect to fleet2 on port 80
fleet1.connections.allowTo(fleet2, new TcpPort(80), 'Allow between fleets');

// allow fleet3 to accept connections from a load balancer on ports 60000-65535
fleet3.connections.allowFrom(loadBalancer, new TcpPortRange(60000, 65535), 'Allow from load balancer');
```

## Improvements to attribute classes and tokens

- Remove the "Attribute" postfix from all generated attribute types. So now, it is `QueueArn` instead of `QueueArnAttribute`. "Attribute" postfix from attribute types
- Simplify the initialization of `Token` objects (all attribute types are Tokens). They can now be either initialized with a simple value or a lazy function. This means, that now you can write `new QueueArn('foo')`. This is useful when importing external resources into the stack.

## Improvements to the CDK Toolkit

The toolkit now outputs YAML instead of JSON by default.

Added active progress reporting for stack updates.

The diff output has been dramatically improved and provides a structure-aware diff. For example:

```
[~] Updating TableCD117FA1 (type: AWS::DynamoDB::Table)
        .ProvisionedThroughput:
            .WriteCapacityUnits: 10
    Creating MyQueueE6CA6235 (type: AWS::SQS::Queue)
```

## Library for unit and integration testing

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

## Updates to the IAM policy library

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

## A new library for defining custom CloudFormation resources

A library to facilitate the definition of custom CloudFormation resources and exposing them as regular CDK constructs is now shipped with the CDK.

# 0.5.0 - 2018-03-29

## AWS Resource Constructs (L1)

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

## Framework

- Introducing **CDK Applets** which allow instantiating specific CDK stacks using a declarative YAML syntax.
- As a first step to enable diagnostics features in the toolkit, record logical ID (and stack trace) in metadata for stack elements.
- Introduce a new scheme for generating CloudFormation logical IDs which adds a hash of the construct path to the generated ID to avoid ID collisions. To opt-in for the new scheme, set `hashedLogicalIDs` to `true` when creating a **Stack**.
- Allow specifying explicit **logicalID** for stack elements like **Resource** **Parameter** and **Output**.
- `async exec()` changed to `run()` and `validate` was changed to be a synchronous method instead of async.
- Merged **@aws-cdk/core** into **aws-cdk**, which now where the core classes of the CDK framework live.
- The **Runtime Values** library, which was under **@aws-cdk/rtv** is now **@aws-cdk/rtv**.
- Bugfix: Tags could not be used because they failed validation.
- Bugfix: Allow "-" in stack names.

## Toolkit

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

## Documentation and Examples

- Implemented a few **advanced examples** These examples show how to use IAM policies, environmental context, template inclusion, nested stacks, resource references and using various CloudFormation semantics in the CDK

# 0.4.0 - 2018-03-05

## New Features

- **Environments** - this version extends the fidelity of a CDK deployment target from only _region_ to _region + account_, also referred to as an **_environment_**. This allows modeling complete apps that span multiple accounts/regions. To preserve the current behavior, if region/account is not specified, the CDK will default to the AWS SDK region/credential provider chain (`~/.aws/config`). We will add support for AWS SDK Profiles in a future release. See the **Environments** section of the CDK README for details).
- **Environmental Context** (such as availability zones and SSM parameters) - there are use-cases where CDK stacks need to consult with account and region-specific information when they are synthesized (we call this information "environmental context"). For example, the set of supported **availability zones** is specific to account _and_ region; the specific ID of certain public **AMIs** (Amazon Machine Image IDs) as published to the SSM parameter store is specific to each region. See the **Environmental Context** section in the CDK README for details .
- **Runtime Values** - a new mechanism for advertising values such as resource attributes and constants from construction-time to runtime code via the SSM parameter store. See the **Runtime Values** section in the CDK README for details.
- **Construct Validation** - it is now possible to implement a method `validate(): string[]` for any construct at any layer. Validation methods are all executed before a stack is synthesized and provide an opportunity for constructs to implement validation logic. See the **Construct Validation** section in the CDK README for details.
- **User-specific cx.json** - the toolkit will now incorporate settings from `~/.cx.json`. This allows users to supply user-specific settings. Note this file is applied _before_ the project-specific `cx.json` file is applied.
- **IAM Library Improvements** - allow creating IAM documents with a base document, a new class `AssumeRolePolicyDocument`, allow specifying multiple actions when creating a `Permission` ob object.
- **`stack.findResource(logicalId)`** - allows retriving a resource object from a stack based on it's calculated logical ID.
- **Windows AMIs are read from SSM parameter store**.

## Bug Fixes

- **cx Toolkit** returns a non-zero exit code when an error occurs.
- **Retain original names of CloudFormation properties** instead of auto-capitalizing based on heuristics, which caused some unexpected behavior in certain scenarios.
- **CAPABILITY_NAMED_IAM** was added to "cx deploy" by default.

# 0.3.0 - 2018-01-30

## Highlights

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

## Known Issues

- Stack names are limited to alphanumeric characters, so it won't be possible to set stack names to match existing deployed stacks. As a workaround you can use `cx --rename` to specify the actual stack name to use for `diff` or `deploy`. Thanks rmuller@ for reporting.
- When synthesizing templates, we transform all JSON keys to pascal case to conform with CloudFormation standards, but this also affects JSON blobs that are not CloudFormation such as IAM documents or environment variables.

## Non-breaking Changes

- Added support for **CloudFormation Rules**.
- **Cloud Executable Interface (CXI)**: changed semantics from "construct" to "synthesize" (backwards compatible).
- **Tokens**: improve error reporting when unable to resolve tokens.

# 0.2.0 - 2017-12-07

## Highlights

## Construct Names

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

## Resource Attribute Types

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

## Construct Metadata

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

## Resource Enrichments

- Replaced `topic.subscribeToXxx` with `topic.subscribe(target)` where `target` is anything that adheres to the `SubscriptionTarget` interface (technically it's an abstract class because jsii doesn't support interfaces yet).
- Removed `function.addExecutionRole()` - an execution role is automatically created when invoking `function.addPermission(p)`.

## Tokens

- The `evaluate` method is now called `resolve`.

## CX Toolkit Usability Improvements

- If an app contains a single stack, no need to specify the stack name.
- `synth --interactive` (or `synth --interactive --verbose`) now displays real-time updates of a template's contents. Really nice for fast iteration;
- The toolkit now reads `cx.json` for default arguments. Very useful, for example, to remove the need to specify `--app` in every invocation.

[#107]: https://github.com/awslabs/aws-cdk/pull/107
[#119]: https://github.com/awslabs/aws-cdk/pull/119
[#128]: https://github.com/awslabs/aws-cdk/pull/128
[#129]: https://github.com/awslabs/aws-cdk/pull/129
[#131]: https://github.com/awslabs/aws-cdk/pull/131
[#136]: https://github.com/awslabs/aws-cdk/pull/136
[#138]: https://github.com/awslabs/aws-cdk/pull/138
[#142]: https://github.com/awslabs/aws-cdk/pull/142
[#148]: https://github.com/awslabs/aws-cdk/pull/148
[#149]: https://github.com/awslabs/aws-cdk/pull/149
[#151]: https://github.com/awslabs/aws-cdk/issues/151
[#157]: https://github.com/awslabs/aws-cdk/pull/157
[#161]: https://github.com/awslabs/aws-cdk/pull/161
[#162]: https://github.com/awslabs/aws-cdk/pull/162
[#172]: https://github.com/awslabs/aws-cdk/pull/172
[#175]: https://github.com/awslabs/aws-cdk/pull/175
[#177]: https://github.com/awslabs/aws-cdk/pull/177
[#180]: https://github.com/awslabs/aws-cdk/pull/180
[#187]: https://github.com/awslabs/aws-cdk/pull/187
[#194]: https://github.com/awslabs/aws-cdk/pull/194
[#205]: https://github.com/awslabs/aws-cdk/issues/205
[#208]: https://github.com/awslabs/aws-cdk/pull/208
[#209]: https://github.com/awslabs/aws-cdk/pull/209
[#214]: https://github.com/awslabs/aws-cdk/issues/214
[#220]: https://github.com/awslabs/aws-cdk/pull/220
[#227]: https://github.com/awslabs/aws-cdk/issues/227
[#229]: https://github.com/awslabs/aws-cdk/pull/229
[#231]: https://github.com/awslabs/aws-cdk/pull/231
[#238]: https://github.com/awslabs/aws-cdk/issues/238
[#245]: https://github.com/awslabs/aws-cdk/pull/245
[#250]: https://github.com/awslabs/aws-cdk/issues/409
[#256]: https://github.com/awslabs/aws-cdk/pull/256
[#257]: https://github.com/awslabs/aws-cdk/pull/257
[#258]: https://github.com/awslabs/aws-cdk/issues/258
[#264]: https://github.com/awslabs/aws-cdk/issues/264
[#307]: https://github.com/awslabs/aws-cdk/issues/307
[#318]: https://github.com/awslabs/aws-cdk/issues/318
[#320]: https://github.com/awslabs/aws-cdk/issues/320
[#370]: https://github.com/awslabs/aws-cdk/issues/370
[#371]: https://github.com/awslabs/aws-cdk/issues/371
[#379]: https://github.com/awslabs/aws-cdk/issues/379
[#380]: https://github.com/awslabs/aws-cdk/issues/380
[#384]: https://github.com/awslabs/aws-cdk/issues/384
[#396]: https://github.com/awslabs/aws-cdk/issues/396
[#401]: https://github.com/awslabs/aws-cdk/issues/401
[#402]: https://github.com/awslabs/aws-cdk/issues/402
[#405]: https://github.com/awslabs/aws-cdk/issues/405
[#406]: https://github.com/awslabs/aws-cdk/issues/406
[#408]: https://github.com/awslabs/aws-cdk/issues/408
[#412]: https://github.com/awslabs/aws-cdk/issues/412
[#420]: https://github.com/awslabs/aws-cdk/issues/420
[#428]: https://github.com/awslabs/aws-cdk/issues/428
[#433]: https://github.com/awslabs/aws-cdk/issues/433
[#435]: https://github.com/awslabs/aws-cdk/issues/435
[#436]: https://github.com/awslabs/aws-cdk/issues/436
[#439]: https://github.com/awslabs/aws-cdk/issues/439
[#86]: https://github.com/awslabs/aws-cdk/pull/86
[@aws-cdk/cloudwatch documentation]: https://github.com/awslabs/aws-cdk/blob/master/packages/%40aws-cdk/cloudwatch/README.md
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
[awslabs/jsii#43]: https://github.com/awslabs/jsii/pull/43
[cloudformation resource specification]: https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-resource-specification.html
