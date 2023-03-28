# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [2.70.0](https://github.com/aws/aws-cdk/compare/v2.69.0...v2.70.0) (2023-03-22)


### Features

* **cfnspec:** cloudformation spec v116.0.0 ([#24662](https://github.com/aws/aws-cdk/issues/24662)) ([e8158af](https://github.com/aws/aws-cdk/commit/e8158af34eb6402c79edbc171746fb5501775c68))
* **cloudwatch:** added defaultInterval prop to cw-dashboard ([#24707](https://github.com/aws/aws-cdk/issues/24707)) ([d4717cf](https://github.com/aws/aws-cdk/commit/d4717cf035c9f7027d8081ea1f15a631044315e8))
* **ec2:** CFN-init support for systemd ([#24683](https://github.com/aws/aws-cdk/issues/24683)) ([f3fe8e1](https://github.com/aws/aws-cdk/commit/f3fe8e1c4348194f89b47a276e6c85328b1044fa))
* **ec2:** SSM sessions ([#24673](https://github.com/aws/aws-cdk/issues/24673)) ([9744a82](https://github.com/aws/aws-cdk/commit/9744a8295fab28f1e8c38a0b980935f7546990e6))
* **ecr:** add option to auto delete images upon ECR repository removal ([#24572](https://github.com/aws/aws-cdk/issues/24572)) ([7de5b00](https://github.com/aws/aws-cdk/commit/7de5b00dcf24c4f6721317860c7e42c485e3ca58)), closes [#15932](https://github.com/aws/aws-cdk/issues/15932) [#12618](https://github.com/aws/aws-cdk/issues/12618) [#15932](https://github.com/aws/aws-cdk/issues/15932)
* **elasticloadbalancing:** classic load balancer supports ec2 instances  ([#24353](https://github.com/aws/aws-cdk/issues/24353)) ([25b6edd](https://github.com/aws/aws-cdk/commit/25b6edd9d83e4766a2cb064b8eb8e3c6198b4f53)), closes [#23500](https://github.com/aws/aws-cdk/issues/23500)
* **servicecatalogappregistry-alpha:** Introduce flag to control application sharing and association behavior for cross-account stacks ([#24408](https://github.com/aws/aws-cdk/issues/24408)) ([2167289](https://github.com/aws/aws-cdk/commit/2167289658e8f3431ec815c741277dc1be1aa110)), closes [aws-cdk/aws-servicecatalogappregistry/lib/aspects/stack-associator.ts#L91-L95](https://github.com/aws-cdk/aws-servicecatalogappregistry/lib/aspects/stack-associator.ts/issues/L91-L95)


### Bug Fixes

* **bootstrap:** remove Security Hub finding KMS.2 ([#24588](https://github.com/aws/aws-cdk/issues/24588)) ([274c3d5](https://github.com/aws/aws-cdk/commit/274c3d54dcc0b9534d1ede287fe3672ec9883dbe)), closes [/docs.aws.amazon.com/securityhub/latest/userguide/kms-controls.html#kms-2](https://github.com/aws//docs.aws.amazon.com/securityhub/latest/userguide/kms-controls.html/issues/kms-2)
* **cli:** no change deployment prints "hotswap deployment skipped" without hotswap flag ([#24602](https://github.com/aws/aws-cdk/issues/24602)) ([79151fd](https://github.com/aws/aws-cdk/commit/79151fd7f4916defeb1e17d3bcdbec1e119ec994))
* **cli:** user agent is reported as `undefined/undefined` ([#24663](https://github.com/aws/aws-cdk/issues/24663)) ([3e8d8d8](https://github.com/aws/aws-cdk/commit/3e8d8d8e1b9a88376a6460094dea0c08ce19742e))
* **eks:** fail to update cluster by disabling logging props ([#24688](https://github.com/aws/aws-cdk/issues/24688)) ([767cf93](https://github.com/aws/aws-cdk/commit/767cf93eb131c707f8243e8f3779dd3bad89271a))
* **sfn:** stop replacing JsonPath.DISCARD with `null` ([#24717](https://github.com/aws/aws-cdk/issues/24717)) ([413b643](https://github.com/aws/aws-cdk/commit/413b64347f333573b2a07150e87244bd4c11d264)), closes [#24593](https://github.com/aws/aws-cdk/issues/24593)
* **toolkit:** RWLock.acquireRead is not re-entrant ([#24702](https://github.com/aws/aws-cdk/issues/24702)) ([3b7431b](https://github.com/aws/aws-cdk/commit/3b7431b6ac27f8557c22a8959ae1ce431f6d2167))
* **WAFv2:** add patch to revert struct names ([#24651](https://github.com/aws/aws-cdk/issues/24651)) ([dfa09d1](https://github.com/aws/aws-cdk/commit/dfa09d133523f0457a9ab2369bde13b44c398c30)), closes [/github.com/aws/aws-cdk/commit/affe040c8443be074822254d1e75a28b264cd801#diff-827a2fd012e049c7ccedffa0360c12e7d967a173f36b8150de73ef6adc42ee4cL175-L357](https://github.com/aws//github.com/aws/aws-cdk/commit/affe040c8443be074822254d1e75a28b264cd801/issues/diff-827a2fd012e049c7ccedffa0360c12e7d967a173f36b8150de73ef6adc42ee4cL175-L357)

## [2.69.0](https://github.com/aws/aws-cdk/compare/v2.68.0...v2.69.0) (2023-03-14)


### Features

* **custom-resources:** AwsCustomResource copy physicalResourceId from request when omit it in onUpdate ([#24194](https://github.com/aws/aws-cdk/issues/24194)) ([21ad7a7](https://github.com/aws/aws-cdk/commit/21ad7a7a0462a00c491ed104163d2065828a9aa1)), closes [#23843](https://github.com/aws/aws-cdk/issues/23843)
* **docdb:** added ability to enable performance insights ([#24039](https://github.com/aws/aws-cdk/issues/24039)) ([c897f44](https://github.com/aws/aws-cdk/commit/c897f44ea438487a8bf48053dead667c35cade02)), closes [#24036](https://github.com/aws/aws-cdk/issues/24036)
* **ecr-assets:** Support cache-from and cache-to flags ([#24024](https://github.com/aws/aws-cdk/issues/24024)) ([4e02566](https://github.com/aws/aws-cdk/commit/4e02566fab0f6c6708c9ee766e2805adbb329f18))
* **eks:** support for Kubernetes version 1.25 ([#24484](https://github.com/aws/aws-cdk/issues/24484)) ([70fd3e9](https://github.com/aws/aws-cdk/commit/70fd3e97e5b3555f4036ada6e562cec4359cadeb)), closes [#24282](https://github.com/aws/aws-cdk/issues/24282)
* **rds:** add support for minor versions of PostgreSQL: 14.7, 13.10, 12.14, and 11.19 ([#24539](https://github.com/aws/aws-cdk/issues/24539)) ([15cb919](https://github.com/aws/aws-cdk/commit/15cb919fab9d20d0e8f0485662131cbb10980269))
* **rds:** PostgreSQL engine version 15.2 ([#24463](https://github.com/aws/aws-cdk/issues/24463)) ([59d795b](https://github.com/aws/aws-cdk/commit/59d795b6e8d77b2d2d099169eaeb83a66c9d6a1a)), closes [#24462](https://github.com/aws/aws-cdk/issues/24462)


### Bug Fixes

* **custom-resource:** custom resources fail with data containing multi-byte utf8 chars ([#24501](https://github.com/aws/aws-cdk/issues/24501)) ([9bd5078](https://github.com/aws/aws-cdk/commit/9bd507842f567ee3e450c3f44e5c3dccc7c42ae6)), closes [#24491](https://github.com/aws/aws-cdk/issues/24491)
* **ecr-assets:** prefix cache arguments correctly ([#24524](https://github.com/aws/aws-cdk/issues/24524)) ([d451b30](https://github.com/aws/aws-cdk/commit/d451b3014a1d39e0a6ea18c2ec79a547b187adc5))
* **pipelines:** Ubuntu 5 images will be slow, move to Ubuntu 6 ([#24544](https://github.com/aws/aws-cdk/issues/24544)) ([1f62c43](https://github.com/aws/aws-cdk/commit/1f62c438fb68332a492b624bad65159cc9c0308f))
* **sfn:** can't override toStateJson() from other languages ([#24593](https://github.com/aws/aws-cdk/issues/24593)) ([e955d18](https://github.com/aws/aws-cdk/commit/e955d18052b8ec397c06ae6994b96bb7558e12bb)), closes [#14639](https://github.com/aws/aws-cdk/issues/14639)

## [2.68.0](https://github.com/aws/aws-cdk/compare/v2.67.0...v2.68.0) (2023-03-08)


### Bug Fixes

* **apprunner-alpha:** env vars and secrets can't solely be added via .add*() methods ([#24346](https://github.com/aws/aws-cdk/issues/24346)) ([45195b6](https://github.com/aws/aws-cdk/commit/45195b6f2e5162eaa795d3a412d89dd09680aa8b)), closes [#24345](https://github.com/aws/aws-cdk/issues/24345)
* **cli:** cannot `cdk import` resources with multiple identifiers ([#24439](https://github.com/aws/aws-cdk/issues/24439)) ([a70ff1a](https://github.com/aws/aws-cdk/commit/a70ff1ad332af780c052e3117b73df060deee7ae)), closes [#20895](https://github.com/aws/aws-cdk/issues/20895)
* **core:** Fix dotnet version check to allow .NET 7.0 ([#24467](https://github.com/aws/aws-cdk/issues/24467)) ([a4856e9](https://github.com/aws/aws-cdk/commit/a4856e997684f84476fe92e00afcd4da76a69b04)), closes [#24466](https://github.com/aws/aws-cdk/issues/24466)
* **lambda-nodejs:** esbuild preCompilation tsconfig precedence is wrong ([#23871](https://github.com/aws/aws-cdk/issues/23871)) ([790a709](https://github.com/aws/aws-cdk/commit/790a709d758333f4622c5fb860d9bbb48dee7106))
* **lambda-nodejs:** Required auto prefix of `handler` with `index.` breaks custom non-`index` handler settings used by layers ([#24406](https://github.com/aws/aws-cdk/issues/24406)) ([d7a1c34](https://github.com/aws/aws-cdk/commit/d7a1c34e540e12413319918a5d807060057a1a1b)), closes [#24403](https://github.com/aws/aws-cdk/issues/24403)
* **rds:** add clusterResourceIdentifier property to database cluster ([#23605](https://github.com/aws/aws-cdk/issues/23605)) ([6bda4e5](https://github.com/aws/aws-cdk/commit/6bda4e5ae4205a917a00714433f136550c59e409))

## [2.67.0](https://github.com/aws/aws-cdk/compare/v2.66.1...v2.67.0) (2023-03-02)


### Features

* **apigateway:** minCompressionSize on SpecRestApi ([#24067](https://github.com/aws/aws-cdk/issues/24067)) ([2a81f0f](https://github.com/aws/aws-cdk/commit/2a81f0f7d9eb73cd0e807904357a5daf7d6e5017)), closes [#22926](https://github.com/aws/aws-cdk/issues/22926)
* **bootstrap:** prevent accidental bootstrap overwrites ([#24302](https://github.com/aws/aws-cdk/issues/24302)) ([3b251a5](https://github.com/aws/aws-cdk/commit/3b251a5e8e74332076c9e5dc810a80775fa77d61))
* **cli:** update csharp & fsharp template to net6.0 ([#23926](https://github.com/aws/aws-cdk/issues/23926)) ([3bd611d](https://github.com/aws/aws-cdk/commit/3bd611dcbdf802dbc918d0ecedaf3ac3d9d73503)), closes [#23921](https://github.com/aws/aws-cdk/issues/23921)
* **codebuild:** adds file asset support to build-spec ([#24289](https://github.com/aws/aws-cdk/issues/24289)) ([7cda567](https://github.com/aws/aws-cdk/commit/7cda5673fd3f6c5cd56ea59d71b14115f2a388f2)), closes [#1138](https://github.com/aws/aws-cdk/issues/1138)
* **ecs:** enable default capacity provider strategy ([#23955](https://github.com/aws/aws-cdk/issues/23955)) ([5a30ea6](https://github.com/aws/aws-cdk/commit/5a30ea6536df0fda0e0e7bb89d45666f57fb8890))
* **eks:** add helm flag --skip-crds ([#24213](https://github.com/aws/aws-cdk/issues/24213)) ([f68dbc2](https://github.com/aws/aws-cdk/commit/f68dbc2ce76a2df51081e959aa70e373a9bf5ac6)), closes [#24296](https://github.com/aws/aws-cdk/issues/24296)
* **sns:** Add FilterPolicyScope support ([#23108](https://github.com/aws/aws-cdk/issues/23108)) ([d986e14](https://github.com/aws/aws-cdk/commit/d986e143df3cf9b42031eba0f5a2d9a71d6d9208))
* **stepfunctions-tasks:** add revision number ([#24226](https://github.com/aws/aws-cdk/issues/24226)) ([643042b](https://github.com/aws/aws-cdk/commit/643042b8a15779b8a535567085b31424f4373515)), closes [#23491](https://github.com/aws/aws-cdk/issues/23491)


### Bug Fixes

* **cdk-assets:** Error when building Docker Image Assets with Podman ([#24003](https://github.com/aws/aws-cdk/issues/24003)) ([4b08e20](https://github.com/aws/aws-cdk/commit/4b08e20be3b829c752e425883da09188b2dcff72)), closes [/github.com/aws/aws-cdk/issues/16209#issue-978267269](https://github.com/aws//github.com/aws/aws-cdk/issues/16209/issues/issue-978267269) [#16209](https://github.com/aws/aws-cdk/issues/16209)
* **cloudwatch:** math expressions incorrectly warn about search and metrics ([#24313](https://github.com/aws/aws-cdk/issues/24313)) ([f3596eb](https://github.com/aws/aws-cdk/commit/f3596eb26f1e4ab360875bf5f79a7de991d2a9ec)), closes [#20136](https://github.com/aws/aws-cdk/issues/20136)
* **ec2:** userData in launchTemplate is created automatically when machineImege is provided ([#23593](https://github.com/aws/aws-cdk/issues/23593)) ([bb4311b](https://github.com/aws/aws-cdk/commit/bb4311bf05b64cc95a89a319743e3883fd3c5b15)), closes [#23592](https://github.com/aws/aws-cdk/issues/23592) [/github.com/aws/aws-cdk/pull/12385#discussion_r564614928](https://github.com/aws//github.com/aws/aws-cdk/pull/12385/issues/discussion_r564614928)
* **ecr-assets:** fix repeated deploys of stacks with tar assets ([#23497](https://github.com/aws/aws-cdk/issues/23497)) ([c2296a8](https://github.com/aws/aws-cdk/commit/c2296a87116c7bbaf6103a03364326c760a8f952)), closes [#18823](https://github.com/aws/aws-cdk/issues/18823) [#18822](https://github.com/aws/aws-cdk/issues/18822)
* **efs:** support tagging for access point ([#24336](https://github.com/aws/aws-cdk/issues/24336)) ([f9af47f](https://github.com/aws/aws-cdk/commit/f9af47f1fe48e66412d95f3eeef931c9322ba5b7)), closes [#20743](https://github.com/aws/aws-cdk/issues/20743)
* **eks:** changing the subnets or securityGroupIds order causes an error ([#24163](https://github.com/aws/aws-cdk/issues/24163)) ([09c2c19](https://github.com/aws/aws-cdk/commit/09c2c19f22979482020652d902a73dfcc4e593bd)), closes [#24162](https://github.com/aws/aws-cdk/issues/24162)
* **eks:** fix helm deploy login for public ECR repositories ([#24104](https://github.com/aws/aws-cdk/issues/24104)) ([71ec6b6](https://github.com/aws/aws-cdk/commit/71ec6b660cf5062c12c5205dadfc28f893251e4f)), closes [#23977](https://github.com/aws/aws-cdk/issues/23977)
* **eks:** integ tests errors ([#24276](https://github.com/aws/aws-cdk/issues/24276)) ([07f2d7b](https://github.com/aws/aws-cdk/commit/07f2d7b0b947cec31ed3132b95372b9975efa01e))
* **secretsmanager:** secret resource policy already exists in stack (under feature flag) ([#24365](https://github.com/aws/aws-cdk/issues/24365)) ([7dd8b7e](https://github.com/aws/aws-cdk/commit/7dd8b7e1ce88a13e597e52ff95353d74ab4807f1)), closes [#24383](https://github.com/aws/aws-cdk/issues/24383)
* **servicecatalog:** wrong asset path is generated in case outdir is absolute ([#24393](https://github.com/aws/aws-cdk/issues/24393)) ([0ebbf58](https://github.com/aws/aws-cdk/commit/0ebbf58bdd3307f536334beb5d1153e3ef660f18)), closes [#24392](https://github.com/aws/aws-cdk/issues/24392)
* **sns:** sns subscription filter policy condition limit should be 150 ([#24269](https://github.com/aws/aws-cdk/issues/24269)) ([1e1131c](https://github.com/aws/aws-cdk/commit/1e1131c207de2df7d5881a57cc28daa59bad975a))
* Correct SamlConsolePrincipal for non-China ([#24277](https://github.com/aws/aws-cdk/issues/24277)) ([e47646c](https://github.com/aws/aws-cdk/commit/e47646c0ff317a421b2f042158fcc0c7ae1aa2cf)), closes [#24243](https://github.com/aws/aws-cdk/issues/24243)

## [2.66.1](https://github.com/aws/aws-cdk/compare/v2.66.0...v2.66.1) (2023-02-23)


### Bug Fixes

* Correct SamlConsolePrincipal for non-China ([#24277](https://github.com/aws/aws-cdk/issues/24277)) ([d562871](https://github.com/aws/aws-cdk/commit/d562871824350483e80bf6a28868280381e9e83e)), closes [#24243](https://github.com/aws/aws-cdk/issues/24243)

## [2.66.0](https://github.com/aws/aws-cdk/compare/v2.65.0...v2.66.0) (2023-02-21)


### Features

* **cloudwatch:** parse all metrics statistics and support long format ([#23095](https://github.com/aws/aws-cdk/issues/23095)) ([853e3d6](https://github.com/aws/aws-cdk/commit/853e3d631ef0490b0e2d14fdcf50df9f745de3eb)), closes [#23074](https://github.com/aws/aws-cdk/issues/23074) [40aws-cdk/aws-cloudwatch/lib/metric.ts#L295-L296](https://github.com/40aws-cdk/aws-cloudwatch/lib/metric.ts/issues/L295-L296)
* **core:** Size.bytes() ([#24136](https://github.com/aws/aws-cdk/issues/24136)) ([9b2a45a](https://github.com/aws/aws-cdk/commit/9b2a45a6757c91011f47a6b3893cdfa0f4891002)), closes [#24106](https://github.com/aws/aws-cdk/issues/24106)
* **efs:** support file system policy ([#24196](https://github.com/aws/aws-cdk/issues/24196)) ([5e0f44b](https://github.com/aws/aws-cdk/commit/5e0f44b05232c70f35f79d27f1294f943fbeb568)), closes [#24042](https://github.com/aws/aws-cdk/issues/24042)
* **logs:** Add support for multiple parse and filter statements in QueryString ([#24022](https://github.com/aws/aws-cdk/issues/24022)) ([75eb933](https://github.com/aws/aws-cdk/commit/75eb9330194824cdf435ae64095813191fcd6e13))
* **stepfunctions:** removal policy for state machines ([#24105](https://github.com/aws/aws-cdk/issues/24105)) ([5f33a26](https://github.com/aws/aws-cdk/commit/5f33a26937a78a7d28f913e86c3a2d0b00746e6a))


### Bug Fixes

* **apigateway:** rest api deployment does not depend on authorizers ([#23215](https://github.com/aws/aws-cdk/issues/23215)) ([12e13c1](https://github.com/aws/aws-cdk/commit/12e13c130cac347d5d042d414086e9e5aac5e31c))
* **cognito:** changing `installLatestAwsSdk` breaks Client Secret reference ([#23798](https://github.com/aws/aws-cdk/issues/23798)) ([844d407](https://github.com/aws/aws-cdk/commit/844d4076c142fd88095f36dbc667d85c12e20bd5)), closes [#23796](https://github.com/aws/aws-cdk/issues/23796)
* **ecs:** validate ecs healthcheck ([#24197](https://github.com/aws/aws-cdk/issues/24197)) ([89802a9](https://github.com/aws/aws-cdk/commit/89802a95360d698921c81a152d11ab6e46b00de3))
* **eks:** nested OCI repository names for private ECR helmchart deployments are not properly handled ([#23378](https://github.com/aws/aws-cdk/issues/23378)) ([72f2a95](https://github.com/aws/aws-cdk/commit/72f2a95e994ef1b129a48bd548303ea39a3d3c9f))
* **lambda:** RuntimeManagementMode.FUNCTION_UPDATE has wrong value ([#24252](https://github.com/aws/aws-cdk/issues/24252)) ([fdb0cf1](https://github.com/aws/aws-cdk/commit/fdb0cf13c0b18a436c02a272626ce9f9dde9c343))

## [2.65.0](https://github.com/aws/aws-cdk/compare/v2.64.0...v2.65.0) (2023-02-15)


### Features

* **autoscaling:** L2 construct for enabling capacity rebalance of autoscaling ([#24025](https://github.com/aws/aws-cdk/issues/24025)) ([d2c63f5](https://github.com/aws/aws-cdk/commit/d2c63f55f8657315ad4e4dd463cfcae07cb66e53)), closes [#22625](https://github.com/aws/aws-cdk/issues/22625)
* **chatbot:** support guardrail policies ([#24114](https://github.com/aws/aws-cdk/issues/24114)) ([4c72a7d](https://github.com/aws/aws-cdk/commit/4c72a7dc3994ba190f1e1aa467d3087228bcb881)), closes [#20788](https://github.com/aws/aws-cdk/issues/20788)
* **core:** Allow passing Docker build secrets ([#23778](https://github.com/aws/aws-cdk/issues/23778)) ([74512fa](https://github.com/aws/aws-cdk/commit/74512fa339e0a2937213f519c109ef1207e9d0c6)), closes [#14910](https://github.com/aws/aws-cdk/issues/14910) [#14395](https://github.com/aws/aws-cdk/issues/14395)
* **elbv2:** add metrics to INetworkTargetGroup and IApplicationTargetGroup ([#23993](https://github.com/aws/aws-cdk/issues/23993)) ([6a9e43f](https://github.com/aws/aws-cdk/commit/6a9e43f0c6f966df4671267eeda21638611dfb1c)), closes [#23853](https://github.com/aws/aws-cdk/issues/23853) [#10850](https://github.com/aws/aws-cdk/issues/10850)
* **lambda:** add insights version 1.0.178.0 ([#23836](https://github.com/aws/aws-cdk/issues/23836)) ([5272908](https://github.com/aws/aws-cdk/commit/527290854d0fa31e7f41497ede0c1b8b0e1b9ad4))


### Bug Fixes

* **bootstrap:** remove Security Hub finding S3.10 ([#24175](https://github.com/aws/aws-cdk/issues/24175)) ([a1da757](https://github.com/aws/aws-cdk/commit/a1da757ce348b4bd66a6d0e7776f2ff8e9f531b6)), closes [/docs.aws.amazon.com/securityhub/latest/userguide/securityhub-standards-fsbp-controls.html#fsbp-s3-10](https://github.com/aws//docs.aws.amazon.com/securityhub/latest/userguide/securityhub-standards-fsbp-controls.html/issues/fsbp-s3-10)
* **codedeploy:** unable to remove alarms from deployment group ([#23308](https://github.com/aws/aws-cdk/issues/23308)) ([eee005f](https://github.com/aws/aws-cdk/commit/eee005f4949d7438467c7448ba8326efa4b79221))
* **codepipeline:** x-env ECS deployment lacking support stack-dependency ([#24053](https://github.com/aws/aws-cdk/issues/24053)) ([adfe4fa](https://github.com/aws/aws-cdk/commit/adfe4fa137bb748961b4a767d538335490e13ed1)), closes [#24050](https://github.com/aws/aws-cdk/issues/24050) [#24051](https://github.com/aws/aws-cdk/issues/24051)
* **core:** messages are displayed multiple times per construct ([#24019](https://github.com/aws/aws-cdk/issues/24019)) ([57770bb](https://github.com/aws/aws-cdk/commit/57770bb12ea6d77373f1e9e8e04f6757b440f277)), closes [#9565](https://github.com/aws/aws-cdk/issues/9565)
* **ec2:** enable set throughput param to CfnVolume ([#24118](https://github.com/aws/aws-cdk/issues/24118)) ([32781f8](https://github.com/aws/aws-cdk/commit/32781f825352f9cb43d8fed5c122b454275b3076)), closes [#24107](https://github.com/aws/aws-cdk/issues/24107) [#24107](https://github.com/aws/aws-cdk/issues/24107)
* **elbv2:** healthcheck interval is overly restrictive ([#24157](https://github.com/aws/aws-cdk/issues/24157)) ([4f83e02](https://github.com/aws/aws-cdk/commit/4f83e02b85229ebdff3f32ba6fd662ffd707d8db)), closes [#24156](https://github.com/aws/aws-cdk/issues/24156)
* **iam:** PrincipalWithConditions.addCondition fails with a new key ([#23782](https://github.com/aws/aws-cdk/issues/23782)) ([8951d01](https://github.com/aws/aws-cdk/commit/8951d013bea5dad54b94a6a683f56275ff4e6dba)), closes [#23781](https://github.com/aws/aws-cdk/issues/23781)
* **iam:** SamlConsolePrincipal does not work in China [#22091](https://github.com/aws/aws-cdk/issues/22091) ([#24034](https://github.com/aws/aws-cdk/issues/24034)) ([2902043](https://github.com/aws/aws-cdk/commit/29020435aeb1a9fb6401572520d0adca8155dc60))
* **pipelines:** SelfMutation CodeBuild project not accessible ([#24073](https://github.com/aws/aws-cdk/issues/24073)) ([5942978](https://github.com/aws/aws-cdk/commit/594297862f2626b64b174d6998886a40f1b316be))
* **rds:** database proxies use ids as their resource names directly (under feature flag) ([#23703](https://github.com/aws/aws-cdk/issues/23703)) ([03a0f79](https://github.com/aws/aws-cdk/commit/03a0f79b40e3be95de5421370703eb54c06b7dd7)), closes [#18578](https://github.com/aws/aws-cdk/issues/18578)
* **s3:** logging bucket blocks KMS_MANAGED encryption ([#23514](https://github.com/aws/aws-cdk/issues/23514)) ([1e8926f](https://github.com/aws/aws-cdk/commit/1e8926fa9bcf561135beaa31379ec1f1e6f79901))

## [2.64.0](https://github.com/aws/aws-cdk/compare/v2.63.2...v2.64.0) (2023-02-09)


### Features

* **cfnspec:** cloudformation spec v109.0.0 ([#23968](https://github.com/aws/aws-cdk/issues/23968)) ([5d59134](https://github.com/aws/aws-cdk/commit/5d5913455da2cdb834feef708fb01f9e77df656f))
* **cfnspec:** cloudformation spec v109.0.0 ([#23984](https://github.com/aws/aws-cdk/issues/23984)) ([affe040](https://github.com/aws/aws-cdk/commit/affe040c8443be074822254d1e75a28b264cd801))
* **cli:** --hotswap will not use CFN anymore, --hotswap-fallback to fall back if necessary ([#23653](https://github.com/aws/aws-cdk/issues/23653)) ([a5317ca](https://github.com/aws/aws-cdk/commit/a5317ca52f05ebc34d9f22196ab0ef36d5cac967)), closes [#22784](https://github.com/aws/aws-cdk/issues/22784) [#21773](https://github.com/aws/aws-cdk/issues/21773) [#21556](https://github.com/aws/aws-cdk/issues/21556) [#23640](https://github.com/aws/aws-cdk/issues/23640)
* **elbv2:** add metrics to INetworkLoadBalancer and IApplicationLoadBalancer ([#23853](https://github.com/aws/aws-cdk/issues/23853)) ([cb889bc](https://github.com/aws/aws-cdk/commit/cb889bc2c267654ca97e3d85a16a99a667d3584c)), closes [#10850](https://github.com/aws/aws-cdk/issues/10850)
* **iam:** implement IGrantable to Policy and ManagedPolicy ([#22712](https://github.com/aws/aws-cdk/issues/22712)) ([d3df40f](https://github.com/aws/aws-cdk/commit/d3df40ff89c70b9243ec175747eb398368067095)), closes [#10308](https://github.com/aws/aws-cdk/issues/10308)
* **lambda:** enable RuntimeManagementConfig  ([#23891](https://github.com/aws/aws-cdk/issues/23891)) ([be4f971](https://github.com/aws/aws-cdk/commit/be4f97129f4237b39d0b99977eb597e2af49ed2a)), closes [#23890](https://github.com/aws/aws-cdk/issues/23890)
* **s3:** allow configuring S3 Object Lock ([#23744](https://github.com/aws/aws-cdk/issues/23744)) ([bdcd6c8](https://github.com/aws/aws-cdk/commit/bdcd6c890878fb71c480bf40964f1b6ea0a5f270)), closes [#5247](https://github.com/aws/aws-cdk/issues/5247) [#21738](https://github.com/aws/aws-cdk/issues/21738)


### Bug Fixes

* Use the correct LB full name when creating metrics for imported LBs ([#23972](https://github.com/aws/aws-cdk/issues/23972)) ([16c23b7](https://github.com/aws/aws-cdk/commit/16c23b7554923bf6c2703ba5f229e6c34b459a2f)), closes [#23853](https://github.com/aws/aws-cdk/issues/23853)
* **cdk-assets:**  asset concurrency leaves a corrupted archive ([#24026](https://github.com/aws/aws-cdk/issues/24026)) ([989454f](https://github.com/aws/aws-cdk/commit/989454f7e27f3cbf33180d8aab29d56472378126))
* **cdk-assets:** packaging assets is broken on Node older than 14.17 ([#23994](https://github.com/aws/aws-cdk/issues/23994)) ([5bde92c](https://github.com/aws/aws-cdk/commit/5bde92c2ae29781aafd8c3817d08e93748c39885)), closes [#23859](https://github.com/aws/aws-cdk/issues/23859)
* **codedeploy:** cross-region referenced groups use wrong config ([#23986](https://github.com/aws/aws-cdk/issues/23986)) ([390ec78](https://github.com/aws/aws-cdk/commit/390ec78437a55ad68757f8ce812535e9bc149a2a))
* **core:** cross-stack reference error doesn't include violation ([#23987](https://github.com/aws/aws-cdk/issues/23987)) ([c7ad66f](https://github.com/aws/aws-cdk/commit/c7ad66fad6ca5aff5f2ae9754d263dea9d1de368))
* **ec2:** Cannot deploy VPC flow log with other resources that requires bucket policies  ([#23889](https://github.com/aws/aws-cdk/issues/23889)) ([e646ad5](https://github.com/aws/aws-cdk/commit/e646ad5b5496b176549f8c039a5ffabbf07403ff)), closes [#18985](https://github.com/aws/aws-cdk/issues/18985)
* **pipelines:** cannot configure actionName for all sources ([#24027](https://github.com/aws/aws-cdk/issues/24027)) ([9cd639b](https://github.com/aws/aws-cdk/commit/9cd639b0f83e65fbe531d56210f68e99874f506e))
* **s3:** infer bucketWebsiteUrl and bucketDomainName suffixes from bucket region ([#23919](https://github.com/aws/aws-cdk/issues/23919)) ([252f052](https://github.com/aws/aws-cdk/commit/252f052d4239b320ac542c7db256683425ad7eba))
* **s3-deployment:** wrong URL in BucketDeployment.deployedBucket.bucketWebsiteUrl ([#24055](https://github.com/aws/aws-cdk/issues/24055)) ([ece46db](https://github.com/aws/aws-cdk/commit/ece46dbd939383f240023172a491767b51eaa722)), closes [#23354](https://github.com/aws/aws-cdk/issues/23354)

## [2.63.2](https://github.com/aws/aws-cdk/compare/v2.63.1...v2.63.2) (2023-02-04)

## [2.63.1](https://github.com/aws/aws-cdk/compare/v2.63.0...v2.63.1) (2023-02-03)


### Reverts

* **cdk-assets:** packaging assets is broken on Node older than 14.17 ([#23994](https://github.com/aws/aws-cdk/issues/23994)) ([1976f1a](https://github.com/aws/aws-cdk/commit/1976f1a7f585b1adb582c5cb557b96ed38418fca)), closes [#23859](https://github.com/aws/aws-cdk/issues/23859)

## [2.63.0](https://github.com/aws/aws-cdk/compare/v2.62.2...v2.63.0) (2023-01-31)


### Features

* **cfnspec:** cloudformation spec v109.0.0 ([#23868](https://github.com/aws/aws-cdk/issues/23868)) ([8ee97b0](https://github.com/aws/aws-cdk/commit/8ee97b039fd6e26fc8a305f285c61a08da4bfdc4))
* **cfnspec:** cloudformation spec v109.0.0 ([#23929](https://github.com/aws/aws-cdk/issues/23929)) ([39f8a30](https://github.com/aws/aws-cdk/commit/39f8a304dfc68c0cbe3bab0b1d567b8d361c99ab))
* **core:** add creation policy configuration for appstream ([#23607](https://github.com/aws/aws-cdk/issues/23607)) ([8909a04](https://github.com/aws/aws-cdk/commit/8909a04e13aa55eb102eac9f9f9ce74721e3fffc)), closes [#23604](https://github.com/aws/aws-cdk/issues/23604)
* **core:** allow asset bundling on docker remote host / docker in docker ([#23576](https://github.com/aws/aws-cdk/issues/23576)) ([afce30a](https://github.com/aws/aws-cdk/commit/afce30a6e84a2f7e4eba499d3e71365a7939bef5)), closes [#8799](https://github.com/aws/aws-cdk/issues/8799)
* **stepfunctions:** task and heartbeat timeout specified by a path ([#23755](https://github.com/aws/aws-cdk/issues/23755)) ([26e48c7](https://github.com/aws/aws-cdk/commit/26e48c7b36fecf114ff771909b377a2570aa36b3)), closes [#15531](https://github.com/aws/aws-cdk/issues/15531)


### Bug Fixes

* **appsync:** sanitized datasource name isn't exported ([#23802](https://github.com/aws/aws-cdk/issues/23802)) ([0b25265](https://github.com/aws/aws-cdk/commit/0b25265e5105d03fe6290e24462e45398695a11e))
* imports from ESM modules cannot find correct type definitions ([#23870](https://github.com/aws/aws-cdk/issues/23870)) ([356a128](https://github.com/aws/aws-cdk/commit/356a128c78b78154ef01ee81ea9d8a60fc569939))
* **eks:** reuse chart name as chart dir for helmchart deployment from OCI repository ([#23392](https://github.com/aws/aws-cdk/issues/23392)) ([070f5ec](https://github.com/aws/aws-cdk/commit/070f5ecebfba8a3f9b5771b251ee9b584aa89b67))
* `aws-cdk-lib` imports from ESM modules are broken ([#23846](https://github.com/aws/aws-cdk/issues/23846)) ([cf2e498](https://github.com/aws/aws-cdk/commit/cf2e498d66f4e2c806ef473414b61e5748d41c7b)), closes [#23813](https://github.com/aws/aws-cdk/issues/23813)

## [2.62.2](https://github.com/aws/aws-cdk/compare/v2.62.1...v2.62.2) (2023-01-27)


### Bug Fixes

* imports from ESM modules cannot find correct type definitions ([#23870](https://github.com/aws/aws-cdk/issues/23870)) ([1b9f3f7](https://github.com/aws/aws-cdk/commit/1b9f3f7d3fa447a21e9ed38026cc428f7797390f))

## [2.62.1](https://github.com/aws/aws-cdk/compare/v2.62.0...v2.62.1) (2023-01-26)


### Bug Fixes

* `aws-cdk-lib` imports from ESM modules are broken ([#23846](https://github.com/aws/aws-cdk/issues/23846)) ([46b93a9](https://github.com/aws/aws-cdk/commit/46b93a913743ab5791b9ae722293dfbeb9692eef)), closes [#23813](https://github.com/aws/aws-cdk/issues/23813)

## [2.62.0](https://github.com/aws/aws-cdk/compare/v2.61.1...v2.62.0) (2023-01-25)


### Features

* **certificatemanager:** deprecate DnsValidatedCertificate ([#21982](https://github.com/aws/aws-cdk/issues/21982)) ([64bfbf9](https://github.com/aws/aws-cdk/commit/64bfbf9b981a32a4db1b07476144d280d6eced32)), closes [#8934](https://github.com/aws/aws-cdk/issues/8934) [#2914](https://github.com/aws/aws-cdk/issues/2914) [#20698](https://github.com/aws/aws-cdk/issues/20698) [#17349](https://github.com/aws/aws-cdk/issues/17349) [#15217](https://github.com/aws/aws-cdk/issues/15217) [#14519](https://github.com/aws/aws-cdk/issues/14519)
* **cfnspec:** cloudformation spec v107.0.0 ([#23750](https://github.com/aws/aws-cdk/issues/23750)) ([3dc40b4](https://github.com/aws/aws-cdk/commit/3dc40b4c9b660a8d50bc07646fa63ecbee6df958))
* **cfnspec:** cloudformation spec v108.0.0 ([#23769](https://github.com/aws/aws-cdk/issues/23769)) ([ff0070d](https://github.com/aws/aws-cdk/commit/ff0070d61f18a6cdd77b027a7f6cd2baf976c3c9))
* **cfnspec:** cloudformation spec v108.0.0 ([#23808](https://github.com/aws/aws-cdk/issues/23808)) ([858ff23](https://github.com/aws/aws-cdk/commit/858ff2363e110b355c2e9823664d087af991bb55))
* **lambda-event-sources:** events source mapping support for sqs max concurrency ([#23714](https://github.com/aws/aws-cdk/issues/23714)) ([6dcec2d](https://github.com/aws/aws-cdk/commit/6dcec2d00363a286906dab19647816ddfd58f33a))
* **logs:** add grantRead function to LogGroup ([#23280](https://github.com/aws/aws-cdk/issues/23280)) ([42ef507](https://github.com/aws/aws-cdk/commit/42ef50706f60a7f452698166fa2d9c93ca54bc0d))


### Bug Fixes

* **appsync:** Populate construct name dynamically for lambda authorizer permission in appsync ([#23777](https://github.com/aws/aws-cdk/issues/23777)) ([92f02e9](https://github.com/aws/aws-cdk/commit/92f02e92905252ee7e4fff32751e76da5052b14b))
* importing `aws-cdk-lib` is slow ([#23813](https://github.com/aws/aws-cdk/issues/23813)) ([8aaeffb](https://github.com/aws/aws-cdk/commit/8aaeffbbb86e8a80cb87fa3314880bd7c2a893be))
* **bootstrap:** bootstrap stack version was not bumped during previous update ([#23669](https://github.com/aws/aws-cdk/issues/23669)) ([f56cb70](https://github.com/aws/aws-cdk/commit/f56cb7004cc4f1017ded4b6a0593a744e8f6271e))
* **cfnspec:** incorrectly handling array result from jsondiff ([#23795](https://github.com/aws/aws-cdk/issues/23795)) ([4a701f1](https://github.com/aws/aws-cdk/commit/4a701f1668177a509f1e2f7f3c5d2249070ec666)), closes [/github.com/andreyvit/json-diff/blob/35582a9d19f8b0b2773360d67937e57ce2866781/test/diff_test.coffee#L78](https://github.com/aws//github.com/andreyvit/json-diff/blob/35582a9d19f8b0b2773360d67937e57ce2866781/test/diff_test.coffee/issues/L78)
* **cli:** only load sourcemap when `--debug` flag is enabled ([#23752](https://github.com/aws/aws-cdk/issues/23752)) ([94102c1](https://github.com/aws/aws-cdk/commit/94102c1210a4d7906a03c81a1845466c988c06e7))
* **codeguruprofiler:** imported profiling group environment configured with stack region ([#23568](https://github.com/aws/aws-cdk/issues/23568)) ([8bfa695](https://github.com/aws/aws-cdk/commit/8bfa695881f6b78a052ca5276a63d78c1a8c0dda))
* **lambda:** lambda functions that use triggers error when invoked ([#23728](https://github.com/aws/aws-cdk/issues/23728)) ([37974ed](https://github.com/aws/aws-cdk/commit/37974ed91fda77a31aa99da75c1d7fb301135a5f)), closes [#23062](https://github.com/aws/aws-cdk/issues/23062) [#23062](https://github.com/aws/aws-cdk/issues/23062) [#23407](https://github.com/aws/aws-cdk/issues/23407) [#23407](https://github.com/aws/aws-cdk/issues/23407)
* **lambda-nodejs:** aws-sdk version detection broken for self-defined runtimes ([#23416](https://github.com/aws/aws-cdk/issues/23416)) ([8a7dffd](https://github.com/aws/aws-cdk/commit/8a7dffdd056ad6e4e1609deb43ba790a020b4997)), closes [#22989](https://github.com/aws/aws-cdk/issues/22989) [/github.com/aws/aws-cdk/pull/22989/files#diff-cd86fbd4f2bbefcbcffc2143adccabafa1debe5981edbcdfcc766b5a705fe770R371-R383](https://github.com/aws//github.com/aws/aws-cdk/pull/22989/files/issues/diff-cd86fbd4f2bbefcbcffc2143adccabafa1debe5981edbcdfcc766b5a705fe770R371-R383)

## [2.61.1](https://github.com/aws/aws-cdk/compare/v2.61.0...v2.61.1) (2023-01-20)


### Bug Fixes

* **lambda:** lambda functions that use triggers error when invoked ([#23728](https://github.com/aws/aws-cdk/issues/23728)) ([5fd9135](https://github.com/aws/aws-cdk/commit/5fd91352e4b625e003ee359563850852a50112ec)), closes [#23062](https://github.com/aws/aws-cdk/issues/23062) [#23062](https://github.com/aws/aws-cdk/issues/23062) [#23407](https://github.com/aws/aws-cdk/issues/23407) [#23407](https://github.com/aws/aws-cdk/issues/23407)

## [2.61.0](https://github.com/aws/aws-cdk/compare/v2.60.0...v2.61.0) (2023-01-18)


### Features

* **cfnspec:** cloudformation spec v107.0.0 ([#23698](https://github.com/aws/aws-cdk/issues/23698)) ([aca8a25](https://github.com/aws/aws-cdk/commit/aca8a256dcaf89b53f7af4f308b2f23e2e766902))
* **core:** stack synthesizers can be shared between stacks ([#23571](https://github.com/aws/aws-cdk/issues/23571)) ([0ce19f0](https://github.com/aws/aws-cdk/commit/0ce19f0e1217a4a41a3a9c27049ab73c7fbc320d))
* **logs:** add unit to metric filter ([#23608](https://github.com/aws/aws-cdk/issues/23608)) ([7cbe8ac](https://github.com/aws/aws-cdk/commit/7cbe8ac9286e5f7c3efb7f75aa859bf6b3bffecf))
* **opensearch:** add support for latest amazon opensearch service 2.3 ([#22943](https://github.com/aws/aws-cdk/issues/22943)) ([0303d6f](https://github.com/aws/aws-cdk/commit/0303d6f7a71d2c70443df4433f0ff7554bcc4e56))
* **pipeline:** enable key rotation ([#23620](https://github.com/aws/aws-cdk/issues/23620)) ([29d7336](https://github.com/aws/aws-cdk/commit/29d733677c4962199a848933a7415b47abb23a2f))
* **route53-patterns:** use `Certificate` as the default certificate (under feature flag) ([#23575](https://github.com/aws/aws-cdk/issues/23575)) ([77709c8](https://github.com/aws/aws-cdk/commit/77709c8328fe664c1fca50223c8e64325cb70461))


### Bug Fixes

* **aws-s3:** log delivery may be incorrectly configured when target bucket is imported ([#23552](https://github.com/aws/aws-cdk/issues/23552)) ([41327d8](https://github.com/aws/aws-cdk/commit/41327d8e815b80c9148bd33751fdf1b70c3bc9cd)), closes [#23547](https://github.com/aws/aws-cdk/issues/23547) [#23588](https://github.com/aws/aws-cdk/issues/23588)
* **cdk-assets:** concurrent asset builds can leave a corrupted archive ([#23677](https://github.com/aws/aws-cdk/issues/23677)) ([18e0481](https://github.com/aws/aws-cdk/commit/18e0481a3bbcb92bd22ce4e83d4f02e03e484307)), closes [#23290](https://github.com/aws/aws-cdk/issues/23290)
* **cli:** can not assume role from 2-level SSO ([#23702](https://github.com/aws/aws-cdk/issues/23702)) ([c3a345b](https://github.com/aws/aws-cdk/commit/c3a345be0eeb26e1b410d68643740f0aea8af4d7)), closes [#23520](https://github.com/aws/aws-cdk/issues/23520)
* **cloudtrail:** Trail fails during resource creation due to invalid template properties when management events are 'None'  ([#23569](https://github.com/aws/aws-cdk/issues/23569)) ([15ced88](https://github.com/aws/aws-cdk/commit/15ced888718531ddc59402f0c886c9b4f1fea67b)), closes [#16387](https://github.com/aws/aws-cdk/issues/16387) [#15488](https://github.com/aws/aws-cdk/issues/15488)
* **lambda:** ever-changing Version hash with LayerVersion from tokens ([#23629](https://github.com/aws/aws-cdk/issues/23629)) ([88fc62d](https://github.com/aws/aws-cdk/commit/88fc62d215d8c4aa3a4c423a06571ec45b51cec6))
* **pipelines:** cross-stack step dependencies have wrong name ([#23594](https://github.com/aws/aws-cdk/issues/23594)) ([0d8142b](https://github.com/aws/aws-cdk/commit/0d8142bf6860cbebab9c1704f6ebf59b17a5704f)), closes [#21843](https://github.com/aws/aws-cdk/issues/21843)
* **servicecatalog:** incorrect objectkey produced from asset relative… ([#23580](https://github.com/aws/aws-cdk/issues/23580)) ([b4a6120](https://github.com/aws/aws-cdk/commit/b4a6120af01b46bc688eebb8f8bb6fbde7f481fe)), closes [#23560](https://github.com/aws/aws-cdk/issues/23560)
* **stepfunctions-tasks:** fix IAM policy statements for step functions API calls ([#22959](https://github.com/aws/aws-cdk/issues/22959)) ([dce662c](https://github.com/aws/aws-cdk/commit/dce662cae6eb493770d3c6f700c92a0b6c235195))

## [2.60.0](https://github.com/aws/aws-cdk/compare/v2.59.0...v2.60.0) (2023-01-11)


### Features

* **appsync:** js resolver support ([#23551](https://github.com/aws/aws-cdk/issues/23551)) ([2318384](https://github.com/aws/aws-cdk/commit/231838409cc1409c137ff27086e853ce2b0fbf1c)), closes [#22921](https://github.com/aws/aws-cdk/issues/22921)
* **appsync:** stabilize appsync module 🎆🎆 🎆  ([#23633](https://github.com/aws/aws-cdk/issues/23633)) ([e5b0230](https://github.com/aws/aws-cdk/commit/e5b023089e168c50eda83a11db0e697b96caf7e9)), closes [#6836](https://github.com/aws/aws-cdk/issues/6836)
* **cfnspec:** cloudformation spec v106.0.0 ([#23586](https://github.com/aws/aws-cdk/issues/23586)) ([f178c98](https://github.com/aws/aws-cdk/commit/f178c98d4473d8bb8d46d80c076fa520d03c623b))
* **cloudfront:** remove headers and server timing ([#23558](https://github.com/aws/aws-cdk/issues/23558)) ([44a4812](https://github.com/aws/aws-cdk/commit/44a4812778d87af27809e5a733c6e5ea6b65004b))
* **cognito:** use secretsmanager secrets for clientSecretValue ([#22885](https://github.com/aws/aws-cdk/issues/22885)) ([4baea78](https://github.com/aws/aws-cdk/commit/4baea78f415566dea499f4ce49fc24d4dc7c4ef7))
* **ec2:** subnet ipv4 cidr blocks on imported vpc ([#23317](https://github.com/aws/aws-cdk/issues/23317)) ([e0885db](https://github.com/aws/aws-cdk/commit/e0885db29c8b45cfe9da1df8b55af2bf78892a04))
* **ecr-assets:** Support docker outputs flag ([#23304](https://github.com/aws/aws-cdk/issues/23304)) ([61e5495](https://github.com/aws/aws-cdk/commit/61e5495105e06aba4c027fb33ae031da09a3ff33)), closes [#20566](https://github.com/aws/aws-cdk/issues/20566)
* **pipelines:** Expose stack output namespaces in custom `pipelines.Step`s ([#23110](https://github.com/aws/aws-cdk/issues/23110)) ([14f6811](https://github.com/aws/aws-cdk/commit/14f6811b89a0ae374863a3b2bdd36997ce67883e)), closes [/github.com/aws/aws-cdk/issues/23000#issuecomment-1324379670](https://github.com/aws//github.com/aws/aws-cdk/issues/23000/issues/issuecomment-1324379670)


### Bug Fixes

* **acm:** domainName length constraint failure due to Tokens ([#23567](https://github.com/aws/aws-cdk/issues/23567)) ([2d7e3c0](https://github.com/aws/aws-cdk/commit/2d7e3c0e9edfb8f3e30dc0c1efaeb03fde19db7c)), closes [#23565](https://github.com/aws/aws-cdk/issues/23565)
* **aws-custom-resource:** switch off `installLatestAwsSdk` by default ([#23591](https://github.com/aws/aws-cdk/issues/23591)) ([c9b2548](https://github.com/aws/aws-cdk/commit/c9b2548126f01fd918009df0a42f0ab4c5e69cc3)), closes [#23113](https://github.com/aws/aws-cdk/issues/23113)
* **bootstrap:** KMS keys cannot be tagged ([#21975](https://github.com/aws/aws-cdk/issues/21975)) ([0e552db](https://github.com/aws/aws-cdk/commit/0e552dbb63a97cd6a7a65cae80ae863609237e61)), closes [#21281](https://github.com/aws/aws-cdk/issues/21281)
* **events:** cross stack rules require concrete environment ([#23549](https://github.com/aws/aws-cdk/issues/23549)) ([22d3341](https://github.com/aws/aws-cdk/commit/22d3341c2239b046473ded3fcbc85b5cbc4a37a1)), closes [#18405](https://github.com/aws/aws-cdk/issues/18405)
* **iam:** create stack based default policies for roles ([#23100](https://github.com/aws/aws-cdk/issues/23100)) ([dea4216](https://github.com/aws/aws-cdk/commit/dea4216a3f2e6727a6bc49d632c03b3f0a416947))
* **lambda:** automatic `currentVersion` conflicts with explicit `Version` resource ([#23636](https://github.com/aws/aws-cdk/issues/23636)) ([de68652](https://github.com/aws/aws-cdk/commit/de6865229ee824c01431ae27509dbcd3e1a83763)), closes [#23225](https://github.com/aws/aws-cdk/issues/23225)

## [2.59.0](https://github.com/aws/aws-cdk/compare/v2.58.1...v2.59.0) (2023-01-03)


### Features

* **cfnspec:** cloudformation spec v105.0.0 ([#23501](https://github.com/aws/aws-cdk/issues/23501)) ([72bd3a0](https://github.com/aws/aws-cdk/commit/72bd3a0ce96c9fd98bbf2f3eb76db1336c8a3029))
* **s3:** use Bucket Policy for Server Access Logging grant (under feature flag) ([#23386](https://github.com/aws/aws-cdk/issues/23386)) ([6975a7e](https://github.com/aws/aws-cdk/commit/6975a7ea06a5680bebd38ad5c26ab5bd566d33b1)), closes [#22183](https://github.com/aws/aws-cdk/issues/22183)
* **servicecatalog:** Add Product Stack Asset Support ([#22857](https://github.com/aws/aws-cdk/issues/22857)) ([ceaac3a](https://github.com/aws/aws-cdk/commit/ceaac3ad49fcfdb89ec80c2784934589542e80b6)), closes [#20690](https://github.com/aws/aws-cdk/issues/20690)


### Bug Fixes

* **lambda-nodejs:** unable to use `nodeModules` with pnpm ([#21911](https://github.com/aws/aws-cdk/issues/21911)) ([7c752db](https://github.com/aws/aws-cdk/commit/7c752db4aa83b242098483fc006c1100d1be11a9)), closes [#21910](https://github.com/aws/aws-cdk/issues/21910)
* **servicecatalog:** make assetBuckets a required property ([#23507](https://github.com/aws/aws-cdk/issues/23507)) ([10b6b96](https://github.com/aws/aws-cdk/commit/10b6b96f35ac32a60aa2bf4ea1856158392ae8ad))

## [2.58.1](https://github.com/aws/aws-cdk/compare/v2.58.0...v2.58.1) (2022-12-30)


### Features

* **cfnspec:** cloudformation spec v105.0.0 ([#23501](https://github.com/aws/aws-cdk/issues/23501)) ([05c3411](https://github.com/aws/aws-cdk/commit/05c3411047ce1d5ad4f2d6e564a6b8d20f76bea6))

## [2.58.0](https://github.com/aws/aws-cdk/compare/v2.57.0...v2.58.0) (2022-12-28)


### Features

* **assertions:** improve printing of match failures ([#23453](https://github.com/aws/aws-cdk/issues/23453)) ([2676386](https://github.com/aws/aws-cdk/commit/267638674474c4cac9be5ca0d7f8b9a538ba2e39))

## [2.57.0](https://github.com/aws/aws-cdk/compare/v2.56.1...v2.57.0) (2022-12-27)


### Features

* **cfnspec:** cloudformation spec v103.0.0 ([#23452](https://github.com/aws/aws-cdk/issues/23452)) ([e49e57d](https://github.com/aws/aws-cdk/commit/e49e57d3106f62c5d64c428cba73b4107d664cba))
* **lambda:** add support for auto-instrumentation with ADOT Lambda layer ([#23027](https://github.com/aws/aws-cdk/issues/23027)) ([fc70535](https://github.com/aws/aws-cdk/commit/fc70535fe699e72332d5ddb4543308e76a89594a))


### Bug Fixes

* **cfnspec:** v101.0.0 introduced specific types on several types that previously were typed as json ([#23448](https://github.com/aws/aws-cdk/issues/23448)) ([4fbc182](https://github.com/aws/aws-cdk/commit/4fbc1827b8978262da0b5b77b1ee9bc0ecfdcc3e))
* **codedeploy:** referenced Applications are not environment-aware ([#23405](https://github.com/aws/aws-cdk/issues/23405)) ([96242d7](https://github.com/aws/aws-cdk/commit/96242d73c0ae853524a567aece86f8a8a514495c))
* **s3:** buckets with SSE-KMS silently fail to receive logs ([#23385](https://github.com/aws/aws-cdk/issues/23385)) ([1b7a384](https://github.com/aws/aws-cdk/commit/1b7a384c330d168d64c0cd82118e5b5473d08a67))

## [2.56.1](https://github.com/aws/aws-cdk/compare/v2.56.0...v2.56.1) (2022-12-23)


### Bug Fixes

* **cfnspec:** v101.0.0 introduced specific types on several types that previously were typed as json ([#23448](https://github.com/aws/aws-cdk/issues/23448)) ([1b4e3a4](https://github.com/aws/aws-cdk/commit/1b4e3a4b503d5d08e976ccf245c20f4430bcba46))

## [2.56.0](https://github.com/aws/aws-cdk/compare/v2.55.1...v2.56.0) (2022-12-21)


### Features

* **aws-cognito:** add AuthSessionValidity property on a UserPoolClient ([#23040](https://github.com/aws/aws-cdk/issues/23040)) ([8896fb9](https://github.com/aws/aws-cdk/commit/8896fb902ad9c8d91a5ddb63df64963186bd09e1)), closes [#22854](https://github.com/aws/aws-cdk/issues/22854)
* **cfnspec:** cloudformation spec v102.0.0 ([#23372](https://github.com/aws/aws-cdk/issues/23372)) ([480b0a5](https://github.com/aws/aws-cdk/commit/480b0a5098e51248bbf36ebf2bcec57cc791c2b0))
* **core:** CfnResource dependency methods ([#23383](https://github.com/aws/aws-cdk/issues/23383)) ([ecedb00](https://github.com/aws/aws-cdk/commit/ecedb00ee3a3cfcaa2564a679fa635aff38f32d8)), closes [#20419](https://github.com/aws/aws-cdk/issues/20419) [#20418](https://github.com/aws/aws-cdk/issues/20418)
* **lambda:** expose all docker run options to container bundling of all lambda variants ([#23318](https://github.com/aws/aws-cdk/issues/23318)) ([02d0876](https://github.com/aws/aws-cdk/commit/02d0876bbb196e9fbeb32d977e7cf65229c8559d)), closes [#22829](https://github.com/aws/aws-cdk/issues/22829)
* **trigger:** Allow trigger to work with Lambda functions with long timeouts ([#23062](https://github.com/aws/aws-cdk/issues/23062)) ([9fd3811](https://github.com/aws/aws-cdk/commit/9fd3811b3213a227b84d79348e635a520fc537c7)), closes [#23058](https://github.com/aws/aws-cdk/issues/23058)


### Bug Fixes

* **apigateway:** allow multi-level base path mapping ([#23362](https://github.com/aws/aws-cdk/issues/23362)) ([86b6c6f](https://github.com/aws/aws-cdk/commit/86b6c6f796cbd15b7c53a4c0482a2b189d45300f)), closes [#23347](https://github.com/aws/aws-cdk/issues/23347)
* **autoscaling:** Allow adding AutoScalingGroup to multiple target groups ([#23044](https://github.com/aws/aws-cdk/issues/23044)) ([07acd18](https://github.com/aws/aws-cdk/commit/07acd180d778b7084d8519234cfc3570bb8846ba)), closes [/github.com/aws/aws-cdk/issues/5667#issuecomment-636657482](https://github.com/aws//github.com/aws/aws-cdk/issues/5667/issues/issuecomment-636657482) [#5667](https://github.com/aws/aws-cdk/issues/5667)
* **aws-eks:** fail to update both logging and access at the same time ([#22957](https://github.com/aws/aws-cdk/issues/22957)) ([606837d](https://github.com/aws/aws-cdk/commit/606837d3de5d048e3fb1674c30a3048e918f680a))
* **cognito:** quote or mime-encode `fromName` to comply RFC 5322 ([#23227](https://github.com/aws/aws-cdk/issues/23227)) ([78d474a](https://github.com/aws/aws-cdk/commit/78d474a12bce7805f88be96df926149c130bf513)), closes [#18903](https://github.com/aws/aws-cdk/issues/18903) [/www.rfc-editor.org/rfc/rfc5322#section-3](https://github.com/aws//www.rfc-editor.org/rfc/rfc5322/issues/section-3)
* **core:** cross region ssm writer update ([#23356](https://github.com/aws/aws-cdk/issues/23356)) ([87bd42d](https://github.com/aws/aws-cdk/commit/87bd42d41f11667aef673d9087c28cecedb87f66))
* **dynamodb:** add kms permissions to grantStreamRead ([#23400](https://github.com/aws/aws-cdk/issues/23400)) ([fcf1bfa](https://github.com/aws/aws-cdk/commit/fcf1bfaab173ee57bbf64d95be62bf10cbb1b851)), closes [40aws-cdk/aws-dynamodb/lib/table.ts#L1025-L1061](https://github.com/40aws-cdk/aws-dynamodb/lib/table.ts/issues/L1025-L1061)
* **s3-deployment:** source markers missing when there are multiple sources ([#23364](https://github.com/aws/aws-cdk/issues/23364)) ([8a7ec37](https://github.com/aws/aws-cdk/commit/8a7ec37e0085e952b59bebab1ecc880167a0691f)), closes [#23321](https://github.com/aws/aws-cdk/issues/23321) [40aws-cdk/aws-s3-deployment/lib/lambda/index.py#L64](https://github.com/40aws-cdk/aws-s3-deployment/lib/lambda/index.py/issues/L64) [40aws-cdk/aws-s3-deployment/lib/lambda/index.py#L137](https://github.com/40aws-cdk/aws-s3-deployment/lib/lambda/index.py/issues/L137)
* **timestream:** magneticStoreWriteProperties and retentionProperties  not working as Json ([#23425](https://github.com/aws/aws-cdk/issues/23425)) ([b705224](https://github.com/aws/aws-cdk/commit/b7052242fb699ba89603ae718ae2d6b0ab9efa6f)), closes [#23404](https://github.com/aws/aws-cdk/issues/23404)

## [2.55.1](https://github.com/aws/aws-cdk/compare/v2.55.0...v2.55.1) (2022-12-16)


### Bug Fixes

* **s3-deployment:** source markers missing when there are multiple sources ([0bb0181](https://github.com/aws/aws-cdk/commit/0bb01815b2fa7708ded6a72e220916e2388993cf)), closes [#23321](https://github.com/aws/aws-cdk/issues/23321) [40aws-cdk/aws-s3-deployment/lib/lambda/index.py#L64](https://github.com/40aws-cdk/aws-s3-deployment/lib/lambda/index.py/issues/L64) [40aws-cdk/aws-s3-deployment/lib/lambda/index.py#L137](https://github.com/40aws-cdk/aws-s3-deployment/lib/lambda/index.py/issues/L137)

## [2.55.0](https://github.com/aws/aws-cdk/compare/v2.54.0...v2.55.0) (2022-12-14)


### Features

* **autoscaling:** support default instance warmup for Auto Scaling groups ([#23285](https://github.com/aws/aws-cdk/issues/23285)) ([3f706e2](https://github.com/aws/aws-cdk/commit/3f706e2210fb1ffe2b70e27862a17594c3337800))
* **cfnspec:** cloudformation spec v101.0.0 ([#23294](https://github.com/aws/aws-cdk/issues/23294)) ([3951f09](https://github.com/aws/aws-cdk/commit/3951f09fb370b74936f3fb45e7188ac6c7343b67))
* **cognito:** add new AdvancedSecurityMode property ([#23261](https://github.com/aws/aws-cdk/issues/23261)) ([9cc9bd3](https://github.com/aws/aws-cdk/commit/9cc9bd34a9d67e7e072292e20aeb9e003e55f158))
* **core:** add volumes-from option to docker run command for bundling ([#22829](https://github.com/aws/aws-cdk/issues/22829)) ([813c2f1](https://github.com/aws/aws-cdk/commit/813c2f17b6c0f1056ed43a8a93f4cffbe9ae9736)), closes [#8799](https://github.com/aws/aws-cdk/issues/8799) [#21660](https://github.com/aws/aws-cdk/issues/21660)
* **s3:** update runtime of notifications-handler to python3.9  ([#23209](https://github.com/aws/aws-cdk/issues/23209)) ([b2d293d](https://github.com/aws/aws-cdk/commit/b2d293d3f8d36547d8cfd7ff3957428718c3827f))
* **s3-deployment:** add additional sources with `addSource` ([#23321](https://github.com/aws/aws-cdk/issues/23321)) ([b34d0b7](https://github.com/aws/aws-cdk/commit/b34d0b7b0152dc5edb2f963054c6af273119006e)), closes [#22857](https://github.com/aws/aws-cdk/issues/22857)


### Bug Fixes

* **cloudwatch:** math expressions incorrectly warn about metricsinsights variable names ([#23316](https://github.com/aws/aws-cdk/issues/23316)) ([55108b9](https://github.com/aws/aws-cdk/commit/55108b969a94f671a492b4536d2ad9d13d11cf9d))
* **core:** cross stack references to string lists break ([#22873](https://github.com/aws/aws-cdk/issues/22873)) ([3ddb8cf](https://github.com/aws/aws-cdk/commit/3ddb8cf44f1e7a285b767f4f4540924a728083c4)), closes [/docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-vpcendpoint.html#aws-resource-ec2](https://github.com/aws//docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-vpcendpoint.html/issues/aws-resource-ec2) [#21682](https://github.com/aws/aws-cdk/issues/21682)
* **custom-resources:** inactive lambda functions fail on invoke ([#22612](https://github.com/aws/aws-cdk/issues/22612)) ([def2971](https://github.com/aws/aws-cdk/commit/def2971d91eedbd327d3acec201d902376129f25)), closes [#20123](https://github.com/aws/aws-cdk/issues/20123)
* **ec2:** Invalid security group ID ([#22859](https://github.com/aws/aws-cdk/issues/22859)) ([c2043c8](https://github.com/aws/aws-cdk/commit/c2043c8dfaaa3189f625dd93c94ee9139e5505e6)), closes [aws-cdk/aws-ec2/lib/peer.ts#L224](https://github.com/aws-cdk/aws-ec2/lib/peer.ts/issues/L224)
* **ecr:** grants for cross-account principals result in failed deployments ([#16376](https://github.com/aws/aws-cdk/issues/16376)) ([84e20f8](https://github.com/aws/aws-cdk/commit/84e20f8da37c22639c033f51c89ef608260e7578)), closes [#15070](https://github.com/aws/aws-cdk/issues/15070)
* **opensearch:** Don't throw a Az count mismatch for imported VPCs ([#22654](https://github.com/aws/aws-cdk/issues/22654)) ([6a28b7f](https://github.com/aws/aws-cdk/commit/6a28b7f0aecf0bc9c5876bf4c7df87d69f0af836)), closes [#22651](https://github.com/aws/aws-cdk/issues/22651)


### Reverts

* "chore: save exclusion rules when bumping the CFN spec ([#22788](https://github.com/aws/aws-cdk/issues/22788))" ([#23282](https://github.com/aws/aws-cdk/issues/23282)) ([cc76cfb](https://github.com/aws/aws-cdk/commit/cc76cfb124a59131996d75d05a82b7985c787ae0))

## [2.54.0](https://github.com/aws/aws-cdk/compare/v2.53.0...v2.54.0) (2022-12-07)


### Features

* **autoscaling:** support for throughput on GP3 volumes ([#22441](https://github.com/aws/aws-cdk/issues/22441)) ([d13b64a](https://github.com/aws/aws-cdk/commit/d13b64af178579ae57ddc6da8d1fb53f26ac9777)), closes [aws-cdk/aws-autoscaling/lib/volume.ts#L1](https://github.com/aws-cdk/aws-autoscaling/lib/volume.ts/issues/L1)
* **aws-cloudwatch:** add missing cloudwatch statistics in exported enum (`p`, `tm`, `iqm`, `wm`, `tc`, `ts`) ([#23074](https://github.com/aws/aws-cdk/issues/23074)) ([47943d2](https://github.com/aws/aws-cdk/commit/47943d206c8ff28923e19028acd5991d8e387ac9)), closes [#21666](https://github.com/aws/aws-cdk/issues/21666) [#14688](https://github.com/aws/aws-cdk/issues/14688)
* **aws-lambda:** Generates a version when currentVersionOptions is set ([#23225](https://github.com/aws/aws-cdk/issues/23225)) ([65eca47](https://github.com/aws/aws-cdk/commit/65eca47e31ad9f9efaf1fbc1753a2460566062e6)), closes [#23002](https://github.com/aws/aws-cdk/issues/23002)
* **cfnspec:** cloudformation spec v100.0.0 ([#23240](https://github.com/aws/aws-cdk/issues/23240)) ([7882e0e](https://github.com/aws/aws-cdk/commit/7882e0e8c935fff682fea8dd1ad2379a54bfe8a2))
* **cfnspec:** cloudformation spec v98.0.0 ([#22971](https://github.com/aws/aws-cdk/issues/22971)) ([2c61405](https://github.com/aws/aws-cdk/commit/2c614059c44939e00c93c924ff2f0aa7a22a2a6e))
* **cfnspec:** cloudformation spec v99.0.0 ([#23007](https://github.com/aws/aws-cdk/issues/23007)) ([d7e0647](https://github.com/aws/aws-cdk/commit/d7e0647fc6fc21710a965efbaa26066328d74795))
* **cli:** show stack progress info in cdk deploy/destroy commands ([#22883](https://github.com/aws/aws-cdk/issues/22883)) ([62c82d7](https://github.com/aws/aws-cdk/commit/62c82d78fcf2255eef9337b6b788086aff93b8e6)), closes [#22879](https://github.com/aws/aws-cdk/issues/22879)
* **cli:** use up-to-date dependencies in init templates ([#23124](https://github.com/aws/aws-cdk/issues/23124)) ([c9fdc8a](https://github.com/aws/aws-cdk/commit/c9fdc8ad992669ac907e21e26bd8d197cfbc86c7))
* **cloudfront:** add convenience grant methods to IDistribution ([#22709](https://github.com/aws/aws-cdk/issues/22709)) ([2eb7d73](https://github.com/aws/aws-cdk/commit/2eb7d73d8647d1b3a9e698bfbdabcad95809eb61)), closes [#13159](https://github.com/aws/aws-cdk/issues/13159)
* **cloudtrail:** enable CloudTrail Insights on Trail ([#23099](https://github.com/aws/aws-cdk/issues/23099)) ([8a1460e](https://github.com/aws/aws-cdk/commit/8a1460e62ce58183a12ecb22c21c49f9b1504d20)), closes [#8335](https://github.com/aws/aws-cdk/issues/8335)
* **cloudwatch:** `Stats` factory class for metric strings ([#23172](https://github.com/aws/aws-cdk/issues/23172)) ([0c9c4b4](https://github.com/aws/aws-cdk/commit/0c9c4b494b489646c9ab1d1fefb59f50c851f774)), closes [#23074](https://github.com/aws/aws-cdk/issues/23074)
* **CloudWatch:** Dashboard TextWidget background support ([#23169](https://github.com/aws/aws-cdk/issues/23169)) ([2506a01](https://github.com/aws/aws-cdk/commit/2506a019aba914db78acd3016356480826e9f510)), closes [#23114](https://github.com/aws/aws-cdk/issues/23114)
* **efs:** support for new `elastic` throughputmode ([#23200](https://github.com/aws/aws-cdk/issues/23200)) ([d7ae159](https://github.com/aws/aws-cdk/commit/d7ae159a1ce3e332b39a6006a7f54683f2559938))
* **eks:** support for Kubernetes version 1.24 ([#22945](https://github.com/aws/aws-cdk/issues/22945)) ([cc957d6](https://github.com/aws/aws-cdk/commit/cc957d619c776244b068fdc19bfa15194192fa32))
* **elbv2:** add desyncMitigationMode for elbv2 ([#22730](https://github.com/aws/aws-cdk/issues/22730)) ([1a11938](https://github.com/aws/aws-cdk/commit/1a11938ce001bb4eb1d455e83d64e2011be2dbef))
* **events:** EventBus policy ([#23243](https://github.com/aws/aws-cdk/issues/23243)) ([7a3de0a](https://github.com/aws/aws-cdk/commit/7a3de0ae89d49ba61d05cf3255da88d31d9474c7))
* **events:** new filtering capabilities ([#23075](https://github.com/aws/aws-cdk/issues/23075)) ([680a755](https://github.com/aws/aws-cdk/commit/680a75534e24598b4ca1faabb3db394a3e131d84))
* **iam:** apply permissions boundary to a `Stage` ([#22913](https://github.com/aws/aws-cdk/issues/22913)) ([ba4896a](https://github.com/aws/aws-cdk/commit/ba4896a4140a5a0fd5665d81db79480f4a52b670)), closes [#22745](https://github.com/aws/aws-cdk/issues/22745)
* **rds:** General Purpose gp3 storage volumes for database instance ([#22864](https://github.com/aws/aws-cdk/issues/22864)) ([82c3646](https://github.com/aws/aws-cdk/commit/82c364631f4680ab701c9edc7ed514bb3097d3ee)), closes [#23036](https://github.com/aws/aws-cdk/issues/23036)
* **rds:** use user-defined security group for db user rotation function ([#23087](https://github.com/aws/aws-cdk/issues/23087)) ([9d8f69e](https://github.com/aws/aws-cdk/commit/9d8f69e69250561fbe45a9f59cedfac402b13f1e)), closes [#23086](https://github.com/aws/aws-cdk/issues/23086)
* **ses:** Virtual Deliverability Manager ([#22908](https://github.com/aws/aws-cdk/issues/22908)) ([41aa72c](https://github.com/aws/aws-cdk/commit/41aa72c005787fa758eabc55658f4db2a02aa1e5))
* **stepfunctions:** support cross-account task invocations ([#23012](https://github.com/aws/aws-cdk/issues/23012)) ([df163ec](https://github.com/aws/aws-cdk/commit/df163ec72c61b521ce6f8d7555872c1342a70745)), closes [#22994](https://github.com/aws/aws-cdk/issues/22994)
* bootstrap arguments for permissions boundary ([#22792](https://github.com/aws/aws-cdk/issues/22792)) ([6224b6d](https://github.com/aws/aws-cdk/commit/6224b6d850ad1e019e60e905b1799baa071cf269)), closes [#22913](https://github.com/aws/aws-cdk/issues/22913)


### Bug Fixes

* **cli:** typescript init templates fails with error in build step ([#23125](https://github.com/aws/aws-cdk/issues/23125)) ([247d0f3](https://github.com/aws/aws-cdk/commit/247d0f3f0a0f208391d4ed1480f9269c6941ae6b)), closes [#23126](https://github.com/aws/aws-cdk/issues/23126)
* **core:** the string 'undefined' is recognized as a valid partition when looking up for fact values ([#23023](https://github.com/aws/aws-cdk/issues/23023)) ([6f4dcfd](https://github.com/aws/aws-cdk/commit/6f4dcfd74a33dcf04d15e3c5a1c1b53bcfe0dbde))
* **integ-test:** limit api response to avoid 4k limit ([#23102](https://github.com/aws/aws-cdk/issues/23102)) ([437c21f](https://github.com/aws/aws-cdk/commit/437c21f39c8ba179ac21e4a98632cfd37500c686))
* **kinesis:** read permissions for stream do not include `kinesis:DescribeStreamConsumer` ([#22794](https://github.com/aws/aws-cdk/issues/22794)) ([e53352d](https://github.com/aws/aws-cdk/commit/e53352d233910acaeaaf4c8d9255043e3bf80665))
* **lambda:** allow tokens in kafka consumer group id ([#22993](https://github.com/aws/aws-cdk/issues/22993)) ([320cc25](https://github.com/aws/aws-cdk/commit/320cc2595c482884089331eea437c80064642539)), closes [#22932](https://github.com/aws/aws-cdk/issues/22932)
* **lambda-nodejs:** AWS SDK v2 is not available for node18.x runtime ([#22989](https://github.com/aws/aws-cdk/issues/22989)) ([55bca78](https://github.com/aws/aws-cdk/commit/55bca78605995bab0fe0e5ae7e8926e0342aa636))
* **logs:** Cannot set log `removalPolicy: destroy` to more than one LogRetention resources ([#22755](https://github.com/aws/aws-cdk/issues/22755)) ([fee2fa2](https://github.com/aws/aws-cdk/commit/fee2fa268dfaa3d20a345f9dcf6076f690409620))
* **route53:** cross-account delegation broken in opt-in regions ([#23082](https://github.com/aws/aws-cdk/issues/23082)) ([5ba35e4](https://github.com/aws/aws-cdk/commit/5ba35e41b0b5f885e72b3f75c6d2f695d2f8808a)), closes [#23081](https://github.com/aws/aws-cdk/issues/23081)
* **toolkit:** endless wait if CDKToolkit stack is `REVIEW_IN_PROGRESS` ([#23230](https://github.com/aws/aws-cdk/issues/23230)) ([477fa85](https://github.com/aws/aws-cdk/commit/477fa851b35954b62917e8319a13d01b446ddeae))
* **triggers:** unable to trigger two lambda functions ([#22124](https://github.com/aws/aws-cdk/issues/22124)) ([a96d69c](https://github.com/aws/aws-cdk/commit/a96d69c0524268e7b642ca1f5e943e4a160b3a1f)), closes [#22110](https://github.com/aws/aws-cdk/issues/22110)
* bootstrapping.integtest.ts ([#23084](https://github.com/aws/aws-cdk/issues/23084)) ([c594918](https://github.com/aws/aws-cdk/commit/c594918729ccecab4e5bee1e48bda1fec10f6761))
* ECS service replacement regression ([#22978](https://github.com/aws/aws-cdk/issues/22978)) ([0292d3f](https://github.com/aws/aws-cdk/commit/0292d3f85b8624ad378347da285eb2f3a9e59f14)), closes [#22467](https://github.com/aws/aws-cdk/issues/22467)


### Reverts

* "chore(deps): Bump aws-actions/stale-issue-cleanup from 5 to 6" ([#23024](https://github.com/aws/aws-cdk/issues/23024)) ([ec8ce8b](https://github.com/aws/aws-cdk/commit/ec8ce8becd4d670f0fec3e6f9901e4a9487dc7ea)), closes [aws/aws-cdk#23008](https://github.com/aws/aws-cdk/issues/23008)
* "chore(deps): Bump aws-actions/stale-issue-cleanup from 5 to 6" ([#23197](https://github.com/aws/aws-cdk/issues/23197)) ([f5fe69a](https://github.com/aws/aws-cdk/commit/f5fe69aadfcf092d3b0c465558ba6e1b23a0912f)), closes [aws/aws-cdk#23111](https://github.com/aws/aws-cdk/issues/23111) [#23199](https://github.com/aws/aws-cdk/issues/23199)
* "refactor(apigateway): Enclose getaway response parameters within single quotes" ([#23037](https://github.com/aws/aws-cdk/issues/23037)) ([dc8f87a](https://github.com/aws/aws-cdk/commit/dc8f87a97d242e7ef798513937a31f39df84ab7d)), closes [aws/aws-cdk#22637](https://github.com/aws/aws-cdk/issues/22637)

## [2.53.0](https://github.com/aws/aws-cdk/compare/v2.52.1...v2.53.0) (2022-11-29)


### Features

* **lambda:** Add SnapStart resource spec patch ([4dda029](https://github.com/aws/aws-cdk/commit/4dda0295ac0ece271886609b140f71efebd3d22d))

## [2.52.1](https://github.com/aws/aws-cdk/compare/v2.52.0...v2.52.1) (2022-11-28)


### Bug Fixes

* **cli:** typescript init templates fails with error in build step ([#23125](https://github.com/aws/aws-cdk/issues/23125)) ([764b725](https://github.com/aws/aws-cdk/commit/764b725a31937abadeef97ba4306cea967afc61f)), closes [#23126](https://github.com/aws/aws-cdk/issues/23126)

## [2.52.0](https://github.com/aws/aws-cdk/compare/v2.51.1...v2.52.0) (2022-11-27)


### Features

* **ecs:** enable Amazon ECS Service Connect ([96ec613](https://github.com/aws/aws-cdk/commit/96ec6139e1ad7637466e95b71e824965b081154f))

## [2.51.1](https://github.com/aws/aws-cdk/compare/v2.51.0...v2.51.1) (2022-11-18)


### Bug Fixes

* ECS service replacement regression ([#22978](https://github.com/aws/aws-cdk/issues/22978)) ([680e048](https://github.com/aws/aws-cdk/commit/680e048abc0c1e778b64c4e29fefcff0704f4d30)), closes [#22467](https://github.com/aws/aws-cdk/issues/22467)

## [2.51.0](https://github.com/aws/aws-cdk/compare/v2.50.0...v2.51.0) (2022-11-18)


### Features

* **assertions:** allResources and allResourcesProperties methods ([#22007](https://github.com/aws/aws-cdk/issues/22007)) ([2430537](https://github.com/aws/aws-cdk/commit/24305376260407ea4101ffc6637470c1ecd97ec5)), closes [#21269](https://github.com/aws/aws-cdk/issues/21269)
* **cfnspec:** cloudformation spec v96.0.0 ([#22775](https://github.com/aws/aws-cdk/issues/22775)) ([aa19ec0](https://github.com/aws/aws-cdk/commit/aa19ec05835a7c71e1aa01dcd649a4d933ef1fd8))
* **cfnspec:** cloudformation spec v97.0.0 ([#22876](https://github.com/aws/aws-cdk/issues/22876)) ([e29df69](https://github.com/aws/aws-cdk/commit/e29df698fbd1f5365edf4f71a91417d47806fc1c))
* **codebuild:** interactive breakpoints using SSM ([#22728](https://github.com/aws/aws-cdk/issues/22728)) ([bf165a1](https://github.com/aws/aws-cdk/commit/bf165a1f76f44114f0c37b0c1dace6f2ac0e828f))
* **cognito:** deletion protection for user pools ([#22765](https://github.com/aws/aws-cdk/issues/22765)) ([9bde9f3](https://github.com/aws/aws-cdk/commit/9bde9f3149cbfa6e7b97204f54e7cef5c9127971))
* **ec2:** change log format in Vpc flow logs ([#22430](https://github.com/aws/aws-cdk/issues/22430)) ([26779f8](https://github.com/aws/aws-cdk/commit/26779f8b233a1ff6ba35fe2b364df4971bfcce9f)), closes [#16279](https://github.com/aws/aws-cdk/issues/16279) [/github.com/aws/aws-cdk/pull/16279#discussion_r808075037](https://github.com/aws//github.com/aws/aws-cdk/pull/16279/issues/discussion_r808075037) [#19316](https://github.com/aws/aws-cdk/issues/19316)
* **iam:** customize IAM role creation behavior ([#22856](https://github.com/aws/aws-cdk/issues/22856)) ([b25e526](https://github.com/aws/aws-cdk/commit/b25e52616717b55a309c5d6d0998f2fd4cc6fe39)), closes [#22749](https://github.com/aws/aws-cdk/issues/22749) [#22862](https://github.com/aws/aws-cdk/issues/22862)
* **lambda:** add nodejs18.x runtime ([#22964](https://github.com/aws/aws-cdk/issues/22964)) ([176feef](https://github.com/aws/aws-cdk/commit/176feefd7ceb4e8dc622283e2b40cab306705580))
* lambda-layer-awscli): depend on @awscdk/asset-awscli-v1 and reduce aws-cdk-lib size ([#22823](https://github.com/aws/aws-cdk/issues/22823)) ([4bdb18e](https://github.com/aws/aws-cdk/commit/4bdb18e6a43c41ad403c16ab836fe7b991f9531c))
* **lambda-layer-kubectl:** depend on @awscdk/asset-kubectl-v20 and reduce aws-cdk-lib size ([#22677](https://github.com/aws/aws-cdk/issues/22677)) ([6c606d0](https://github.com/aws/aws-cdk/commit/6c606d0f103681db2632d614843233632327693e))
* **lambda-layer-node-proxy-agent:** depend on @awscdk/asset-node-proxy-agent-v5 and reduce aws-cdk-lib size ([#22769](https://github.com/aws/aws-cdk/issues/22769)) ([4d4e8cc](https://github.com/aws/aws-cdk/commit/4d4e8cc455a2828d76374a3174a1ce8bb600aac5))


### Bug Fixes

* **cli:** asset prebuild breaks some custom bootstrap scenarios ([#22930](https://github.com/aws/aws-cdk/issues/22930)) ([fc4668d](https://github.com/aws/aws-cdk/commit/fc4668d6ef23702547890549568a9205c79149f8)), closes [#21965](https://github.com/aws/aws-cdk/issues/21965)
* **cli:** assetParallelism option in cdk.json is not recognized ([#22781](https://github.com/aws/aws-cdk/issues/22781)) ([e2a9c77](https://github.com/aws/aws-cdk/commit/e2a9c778f48c098990d2492bf7e269651056d667))
* **cli:** synthesis stops on expired AWS credentials ([#22861](https://github.com/aws/aws-cdk/issues/22861)) ([0a55e91](https://github.com/aws/aws-cdk/commit/0a55e91950c00daa4fc1a29ca8bad268620a64f3))
* **cloudfront:** custom originId not used for multiple behaviors with same origin ([#22830](https://github.com/aws/aws-cdk/issues/22830)) ([2f1e2e9](https://github.com/aws/aws-cdk/commit/2f1e2e9a3c87ecf7b76b253c6445c5099e15218a)), closes [#22758](https://github.com/aws/aws-cdk/issues/22758)
* **cloudfront:** OriginShield not easily disabled once enabled on an origin ([#22791](https://github.com/aws/aws-cdk/issues/22791)) ([6be4cf6](https://github.com/aws/aws-cdk/commit/6be4cf63470239db7ea402a20fdd6099e53a185a))
* **ecs:** adding a circuit breaker causes Service replacement (under feature flag) ([#22467](https://github.com/aws/aws-cdk/issues/22467)) ([9437d4f](https://github.com/aws/aws-cdk/commit/9437d4fd5957419145b70209e9ab06a8d415efa1)), closes [#16126](https://github.com/aws/aws-cdk/issues/16126) [#16919](https://github.com/aws/aws-cdk/issues/16919) [#22328](https://github.com/aws/aws-cdk/issues/22328)
* **events-targets:** encrypted queues get too wide permissions (under feature flag) ([#22740](https://github.com/aws/aws-cdk/issues/22740)) ([a36f2f0](https://github.com/aws/aws-cdk/commit/a36f2f0d3e71e0b2467812a9d93d4b0b26629a60))
* **iam:** oidc provider fetches leaf certificate thumbprint instead of root ([#22802](https://github.com/aws/aws-cdk/issues/22802)) ([280b876](https://github.com/aws/aws-cdk/commit/280b876d426522fd043f13ff0b188e29acaa0fbf)), closes [40aws-cdk/aws-iam/lib/oidc-provider/external.ts#L40](https://github.com/40aws-cdk/aws-iam/lib/oidc-provider/external.ts/issues/L40) [40aws-cdk/aws-iam/lib/oidc-provider/external.ts#L46](https://github.com/40aws-cdk/aws-iam/lib/oidc-provider/external.ts/issues/L46) [40aws-cdk/aws-eks/lib/oidc-provider.ts#L49](https://github.com/40aws-cdk/aws-eks/lib/oidc-provider.ts/issues/L49)
* **s3-deployment:** `responseURL` is in CloudWatch Logs ([#22952](https://github.com/aws/aws-cdk/issues/22952)) ([863548d](https://github.com/aws/aws-cdk/commit/863548d9e5d643c18e939556661cc8a05b6f7742))
* CDK does not work in FIPS-restricted environments ([#22878](https://github.com/aws/aws-cdk/issues/22878)) ([76a56ad](https://github.com/aws/aws-cdk/commit/76a56adf72bde721bd2da22fc25d1730ab751e3a))
* **events-targets:** policy restricts access to the same account as the Queue, not the Rule ([#22766](https://github.com/aws/aws-cdk/issues/22766)) ([0083256](https://github.com/aws/aws-cdk/commit/0083256d2329e6195c96a45589079f678b67a184))
* **iam:** service principals use unnecessary exceptions (under feature flag) ([#22819](https://github.com/aws/aws-cdk/issues/22819)) ([65d8e3d](https://github.com/aws/aws-cdk/commit/65d8e3d7814ac69d6cfa2bfd0d4219817028a14b))
* **region-info:** EC2 service principal is incorrect in GovCloud regions ([#22589](https://github.com/aws/aws-cdk/issues/22589)) ([1c707eb](https://github.com/aws/aws-cdk/commit/1c707eb9456bbe9226471c0930713d3bfde42130))
* **s3:** remove restriction of creating lifecycle rule for noncurrent objects when bucket versionining is not set up ([#22803](https://github.com/aws/aws-cdk/issues/22803)) ([b20a6b4](https://github.com/aws/aws-cdk/commit/b20a6b4964bdb6939c35db20362aaf681192cc95)), closes [#22392](https://github.com/aws/aws-cdk/issues/22392)
* **stepfunctions-tasks:** custom resource uses subprocess with Shell=true ([#22752](https://github.com/aws/aws-cdk/issues/22752)) ([bd056d1](https://github.com/aws/aws-cdk/commit/bd056d1d38a2d3f43efe4f857c4d38b30fb9b681))


### Reverts

* "chore: add AWSLINT_SAVE to the PR buildspec ([#22743](https://github.com/aws/aws-cdk/issues/22743))" ([#22782](https://github.com/aws/aws-cdk/issues/22782)) ([df5830c](https://github.com/aws/aws-cdk/commit/df5830cc20ea3e7010ffba3aee9f29c31a4533e1))

## [2.50.0](https://github.com/aws/aws-cdk/compare/v2.49.1...v2.50.0) (2022-11-01)


### Features

* **aws-ecs-patterns:** entryPoint and command support within ApplicationLoadBalancedFargateService and ApplicationLoadBalancedEc2Service ([#22609](https://github.com/aws/aws-cdk/issues/22609)) ([6925293](https://github.com/aws/aws-cdk/commit/6925293047ff02fbe68234740327f3513a86ef74)), closes [#17092](https://github.com/aws/aws-cdk/issues/17092)
* **codedeploy:** CodeDeploy deployment group construct for ECS ([#22295](https://github.com/aws/aws-cdk/issues/22295)) ([efd24d1](https://github.com/aws/aws-cdk/commit/efd24d1bb9bc1c113e81e033012d99b7d5f8a146)), closes [#1559](https://github.com/aws/aws-cdk/issues/1559)
* **core:** automatic cross stack, cross region references (under feature flag) ([#22008](https://github.com/aws/aws-cdk/issues/22008)) ([f1b5497](https://github.com/aws/aws-cdk/commit/f1b5497879b4ba117723dad4255082f081d4fec7))
* **ec2:** Vpc supports reserving space for future AZs ([#22705](https://github.com/aws/aws-cdk/issues/22705)) ([7b51ea9](https://github.com/aws/aws-cdk/commit/7b51ea9ae1e61d57b8ed6b99510cf26d423bb991))
* **stepfunctions:**  add intrinsic functions ([#22431](https://github.com/aws/aws-cdk/issues/22431)) ([8f85b08](https://github.com/aws/aws-cdk/commit/8f85b081724d425f452babe1f38f4cda211c17b9)), closes [#22068](https://github.com/aws/aws-cdk/issues/22068) [#22629](https://github.com/aws/aws-cdk/issues/22629)


### Bug Fixes

* **opensearch:** log group policies ignore incorrect error code on delete ([#22364](https://github.com/aws/aws-cdk/issues/22364)) ([ebba9e3](https://github.com/aws/aws-cdk/commit/ebba9e371c22542a5ae98bbd0e6a2f130eef77d6))
* revert jsii to version 1.69.0 ([#22715](https://github.com/aws/aws-cdk/issues/22715)) ([0837c1a](https://github.com/aws/aws-cdk/commit/0837c1a6af705474dfe127203c2b99a6ff201d77))
* **apigateway:** race condition exists between stage and cfnaccount in specrestapi ([#22671](https://github.com/aws/aws-cdk/issues/22671)) ([4cb008b](https://github.com/aws/aws-cdk/commit/4cb008bd6d27a8e3366ea600a8b9027f15ae6dcd)), closes [#18925](https://github.com/aws/aws-cdk/issues/18925)
* **aws-events:** restrict eventbus statementId to 64 characters ([#22296](https://github.com/aws/aws-cdk/issues/22296)) ([fadbfc1](https://github.com/aws/aws-cdk/commit/fadbfc1eb07f4f2daecfe623812fee029c81e31a)), closes [#22120](https://github.com/aws/aws-cdk/issues/22120) [#21808](https://github.com/aws/aws-cdk/issues/21808)
* **stepfunctions-tasks:** athenaStartQueryExecution task generates invalid s3 arn ([#22692](https://github.com/aws/aws-cdk/issues/22692)) ([6e0cb2b](https://github.com/aws/aws-cdk/commit/6e0cb2ba2e1bfb55d183e65c811d4e17a80cc4b8)), closes [#22608](https://github.com/aws/aws-cdk/issues/22608)

## [2.49.1](https://github.com/aws/aws-cdk/compare/v2.49.0...v2.49.1) (2022-10-31)


### Bug Fixes

* revert jsii to version 1.69.0 ([#22715](https://github.com/aws/aws-cdk/issues/22715)) ([2b45931](https://github.com/aws/aws-cdk/commit/2b4593125b5b219fcb59d5224a4beea1d0905d0d))

## [2.49.0](https://github.com/aws/aws-cdk/compare/v2.48.0...v2.49.0) (2022-10-27)


### Features

* **eks:** support for Kubernetes version 1.23 ([#22638](https://github.com/aws/aws-cdk/issues/22638)) ([4e858f2](https://github.com/aws/aws-cdk/commit/4e858f2ddd4d04de90453ce50c83b68b8595e87f))


### Bug Fixes

* **eks:** kubectl get handler output includes stderr ([#22658](https://github.com/aws/aws-cdk/issues/22658)) ([66d1ed3](https://github.com/aws/aws-cdk/commit/66d1ed36b1628c116d5f1b3397688308d888c9de))

## [2.48.0](https://github.com/aws/aws-cdk/compare/v2.47.0...v2.48.0) (2022-10-27)


### Features

* **cfnspec:** cloudformation spec v93.0.0 ([#22562](https://github.com/aws/aws-cdk/issues/22562)) ([2afb718](https://github.com/aws/aws-cdk/commit/2afb718b02e8fef70729981c2f1cd5b23449dcde))
* **cfnspec:** cloudformation spec v94.0.0 ([#22599](https://github.com/aws/aws-cdk/issues/22599)) ([e5be100](https://github.com/aws/aws-cdk/commit/e5be10049047d29e9e687f5f4f39037275d51d38))
* **cfnspec:** cloudformation spec v94.0.0 ([#22649](https://github.com/aws/aws-cdk/issues/22649)) ([42160fc](https://github.com/aws/aws-cdk/commit/42160fc2e5532acfb6b97652f6ad0e3354b32baa))
* **cli:** allow disabling parallel asset publishing ([#22579](https://github.com/aws/aws-cdk/issues/22579)) ([69981ac](https://github.com/aws/aws-cdk/commit/69981ac07b40ce3f690f6c1ad0010b51f29103a6)), closes [#19367](https://github.com/aws/aws-cdk/issues/19367)
* **ec2:** Vpc supports allocating CIDR from AWS IPAM ([#22458](https://github.com/aws/aws-cdk/issues/22458)) ([7ed9cd1](https://github.com/aws/aws-cdk/commit/7ed9cd14aa5aaff90badb6438a0941fbca2d370c))
* **eks:** support for Kubernetes version 1.22 ([#22604](https://github.com/aws/aws-cdk/issues/22604)) ([91704aa](https://github.com/aws/aws-cdk/commit/91704aa3632dd6424017ae7aafebda832f309315)), closes [#20263](https://github.com/aws/aws-cdk/issues/20263)
* **rds:** dual-stack mode support ([#22596](https://github.com/aws/aws-cdk/issues/22596)) ([89a7365](https://github.com/aws/aws-cdk/commit/89a73651ccd619b9b1878c40214e4647095803de))


### Bug Fixes

* **apigateway:** relax access log format check to allow either requestId or extendedRequestId ([#22591](https://github.com/aws/aws-cdk/issues/22591)) ([1a16ad0](https://github.com/aws/aws-cdk/commit/1a16ad0bf422e17b8c56d1fe2581eda7c60e7522))
* **eks:** kubectl layer must contain AWS CLI ([#22559](https://github.com/aws/aws-cdk/issues/22559)) ([d8b4c09](https://github.com/aws/aws-cdk/commit/d8b4c091d85eb818c6e106416eea52d26f4fa73b))
* **ssm:** `StringParameter.fromSecureStringParameterAttributes` not working without version ([#22618](https://github.com/aws/aws-cdk/issues/22618)) ([b33b9b0](https://github.com/aws/aws-cdk/commit/b33b9b0a3ce2cfd79082bb743b36c6fda9e8278b)), closes [#18729](https://github.com/aws/aws-cdk/issues/18729) [#22311](https://github.com/aws/aws-cdk/issues/22311)

## [2.47.0](https://github.com/aws/aws-cdk/compare/v2.46.0...v2.47.0) (2022-10-20)


### Features

* **apigateway:** support multi-level paths for custom domains ([#22463](https://github.com/aws/aws-cdk/issues/22463)) ([cdc5753](https://github.com/aws/aws-cdk/commit/cdc5753982d8f674dab2362ea63790abb736fa32)), closes [#15904](https://github.com/aws/aws-cdk/issues/15904)
* **config:** add custom policy rule constructs ([#21794](https://github.com/aws/aws-cdk/issues/21794)) ([09a5cc4](https://github.com/aws/aws-cdk/commit/09a5cc4ff55cb7d001c14059c12ada0a2801acd4)), closes [#21441](https://github.com/aws/aws-cdk/issues/21441)
* **elbv2:** add dropInvalidHeaderFields for elbv2 ([#22466](https://github.com/aws/aws-cdk/issues/22466)) ([91767f0](https://github.com/aws/aws-cdk/commit/91767f03e76db8a63c18882b44854999b15aaff4)), closes [/docs.aws.amazon.com/securityhub/latest/userguide/securityhub-standards-fsbp-controls.html#fsbp-elb-4](https://github.com/aws//docs.aws.amazon.com/securityhub/latest/userguide/securityhub-standards-fsbp-controls.html/issues/fsbp-elb-4)


### Bug Fixes

* breaking change to deployment config props ([#22567](https://github.com/aws/aws-cdk/issues/22567)) ([be6074a](https://github.com/aws/aws-cdk/commit/be6074a67b68ec2f295196ad73ddb6e92984bdf3)), closes [#22566](https://github.com/aws/aws-cdk/issues/22566)
* **apigateway:** validation for path parts does not allow creation of resources with colon ([#22531](https://github.com/aws/aws-cdk/issues/22531)) ([73c443a](https://github.com/aws/aws-cdk/commit/73c443a7cd14ad27776907095bf19100e903093f)), closes [#22477](https://github.com/aws/aws-cdk/issues/22477) [#22477](https://github.com/aws/aws-cdk/issues/22477)
* **cli:** hotswap deploy fails on multiple CfnEvaluationException ([#22339](https://github.com/aws/aws-cdk/issues/22339)) ([7b47f41](https://github.com/aws/aws-cdk/commit/7b47f4178e4a4b9fe3dcb54daa3ec9f94fbd2a31)), closes [#22323](https://github.com/aws/aws-cdk/issues/22323)
* **cloudwatch:** remove region from dashboard ARN ([#22524](https://github.com/aws/aws-cdk/issues/22524)) ([558d192](https://github.com/aws/aws-cdk/commit/558d1925d7c3b01d7681e28f7b85bc851e403556))
* **codeguruprofiler:** incorrect profiling group name is returned when using importing ([#22554](https://github.com/aws/aws-cdk/issues/22554)) ([9934619](https://github.com/aws/aws-cdk/commit/9934619970dcb582106e9b2bf0d373d730de1fee))
* **cognito:** cannot use same lambda function as trigger in multiple user pools ([#22444](https://github.com/aws/aws-cdk/issues/22444)) ([b26fc00](https://github.com/aws/aws-cdk/commit/b26fc007465ce9466cecfaf5c0bb337d741c77e8)), closes [#22315](https://github.com/aws/aws-cdk/issues/22315)
* **config:** Creating multiple rules from the same lambda ([#21594](https://github.com/aws/aws-cdk/issues/21594)) ([0d2b529](https://github.com/aws/aws-cdk/commit/0d2b5291a10a318bed8d77166eae2bd317dee62e)), closes [#17582](https://github.com/aws/aws-cdk/issues/17582)
* **iam:** missing validation for actions added post instantiation of a policy statement ([#21906](https://github.com/aws/aws-cdk/issues/21906)) ([10974d9](https://github.com/aws/aws-cdk/commit/10974d95693dd75e993b8f0b5808b775b55b3afd)), closes [40aws-cdk/aws-iam/lib/policy-statement.ts#L88-L95](https://github.com/40aws-cdk/aws-iam/lib/policy-statement.ts/issues/L88-L95)
* **stepfunctions:** JsonPath.listAt does not accept strings starting with `$[` ([#22472](https://github.com/aws/aws-cdk/issues/22472)) ([6f332ef](https://github.com/aws/aws-cdk/commit/6f332efb1ae5c22f1c3b02221362018e3f4b575f)), closes [#22471](https://github.com/aws/aws-cdk/issues/22471)

## [2.46.0](https://github.com/aws/aws-cdk/compare/v2.45.0...v2.46.0) (2022-10-13)


### Features

* **aws-certificatemanager:** Add ability to specify the certificate name ([#22301](https://github.com/aws/aws-cdk/issues/22301)) ([614ba92](https://github.com/aws/aws-cdk/commit/614ba92ba77e29c10ea4642a64e5b50b5dc775b8))
* **aws-ec2:** add metadata options support for launchTemplate construct ([#22312](https://github.com/aws/aws-cdk/issues/22312)) ([9297bd0](https://github.com/aws/aws-cdk/commit/9297bd04884ebd05888fd14121256329dac82b43))
* **cfnspec:** cloudformation spec v92.0.0 ([#22435](https://github.com/aws/aws-cdk/issues/22435)) ([064a1a6](https://github.com/aws/aws-cdk/commit/064a1a650c6f26d6a3087a8d39971ba33413d8ce))
* **cloudfront-origins:** allow setting a user defined origin id ([#22349](https://github.com/aws/aws-cdk/issues/22349)) ([239215f](https://github.com/aws/aws-cdk/commit/239215fb8ceb4df5cd67669ad5daca39fb65543f)), closes [#2756](https://github.com/aws/aws-cdk/issues/2756)
* **ec2:** adds persist option to user data on windows instances ([#21709](https://github.com/aws/aws-cdk/issues/21709)) ([cb1506f](https://github.com/aws/aws-cdk/commit/cb1506f090e36a6da78b8a8a1edf9a1256478311))
* **sns:** topic name with `.fifo` suffix generated automatically ([#22375](https://github.com/aws/aws-cdk/issues/22375)) ([ba201cf](https://github.com/aws/aws-cdk/commit/ba201cf1d9768f9ac5d3328ec425bf566f088a16)), closes [#18740](https://github.com/aws/aws-cdk/issues/18740)
* **sqs:** add enforceSSL property to enforce encryption of data in transit ([#22363](https://github.com/aws/aws-cdk/issues/22363)) ([f1886cf](https://github.com/aws/aws-cdk/commit/f1886cf82c50abc4e419f1450abfc3df0c5b0324))


### Bug Fixes

* **apigateway:** cannot create an ApiKey with an imported RestApi ([#22368](https://github.com/aws/aws-cdk/issues/22368)) ([83c4123](https://github.com/aws/aws-cdk/commit/83c4123273fda2a2e349b55f1e50d5afa1c7dd9d)), closes [#22102](https://github.com/aws/aws-cdk/issues/22102)
* **apigateway:** CORS OPTIONS method should not require auth ([#22402](https://github.com/aws/aws-cdk/issues/22402)) ([ef72089](https://github.com/aws/aws-cdk/commit/ef72089d7cdf5dbaa1f172eecd29ee525f650b32)), closes [#8615](https://github.com/aws/aws-cdk/issues/8615)
* **core:** asset bundling skipped when using --exclusively with custom stack name ([#21248](https://github.com/aws/aws-cdk/issues/21248)) ([209ddea](https://github.com/aws/aws-cdk/commit/209ddea44744509d74a080fdbd31cbb978fc8a96)), closes [/github.com/aws/aws-cdk/issues/19927#issuecomment-1189916912](https://github.com/aws//github.com/aws/aws-cdk/issues/19927/issues/issuecomment-1189916912)
* some custom resources don't work in opt-in regions ([#22370](https://github.com/aws/aws-cdk/issues/22370)) ([456a2c7](https://github.com/aws/aws-cdk/commit/456a2c75881fe8df3803db3787b48f8d9f97f09e)), closes [#22022](https://github.com/aws/aws-cdk/issues/22022)
* **cli:** state machine hotswap fails if the `DependsOn` change ([#22396](https://github.com/aws/aws-cdk/issues/22396)) ([0d44db2](https://github.com/aws/aws-cdk/commit/0d44db2c211204b85002342ce758aca0552e851c))
* **core:** Custom Resource type length validation ([#22118](https://github.com/aws/aws-cdk/issues/22118)) ([c186e2d](https://github.com/aws/aws-cdk/commit/c186e2ddcffb25647b971ba1b90faa850552d219))
* **custom-resources:** provider can fail if S3 has brown-outs ([#22362](https://github.com/aws/aws-cdk/issues/22362)) ([cdedf60](https://github.com/aws/aws-cdk/commit/cdedf606277f50a2f7e20b09560f6e14b11bbc19))
* **ec2:** cannot deploy SecurityGroup with allowAllIpv6Outbound ([#22414](https://github.com/aws/aws-cdk/issues/22414)) ([bb16d97](https://github.com/aws/aws-cdk/commit/bb16d9729daea2702b32df81fc8259b0afd652fa)), closes [#22407](https://github.com/aws/aws-cdk/issues/22407)
* **ecs:** removed explicit addition of ecs deployment type when circuit breaker is enabled ([#22328](https://github.com/aws/aws-cdk/issues/22328)) ([635129c](https://github.com/aws/aws-cdk/commit/635129ca95313afef7b3d8fc62d077afbfd0c088)), closes [#16126](https://github.com/aws/aws-cdk/issues/16126) [#16919](https://github.com/aws/aws-cdk/issues/16919)
* half-written asset zips can be uploaded if process is interrupted ([#22393](https://github.com/aws/aws-cdk/issues/22393)) ([2ed006e](https://github.com/aws/aws-cdk/commit/2ed006e50b15dfca96395d442ccee648abdbb374)), closes [#18459](https://github.com/aws/aws-cdk/issues/18459)


### Reverts

* "fix(ecs): removed explicit addition of ecs deployment type when circuit breaker is enabled ([#22328](https://github.com/aws/aws-cdk/issues/22328))" ([#22418](https://github.com/aws/aws-cdk/issues/22418)) ([0f002e2](https://github.com/aws/aws-cdk/commit/0f002e2009bbab2e10c08cdf908c5091ba61b754)), closes [/github.com/aws/aws-cdk/issues/16126#issuecomment-1271626957](https://github.com/aws//github.com/aws/aws-cdk/issues/16126/issues/issuecomment-1271626957)

## [2.45.0](https://github.com/aws/aws-cdk/compare/v2.44.0...v2.45.0) (2022-10-06)


### Features

* add `addMetadata()` method to `Stack` ([#22337](https://github.com/aws/aws-cdk/issues/22337)) ([61b2ab7](https://github.com/aws/aws-cdk/commit/61b2ab79f2a044dcceba7fec1a01629873aa4517))
* **apigateway:** add accessLogField static method ([#22322](https://github.com/aws/aws-cdk/issues/22322)) ([3ce8e47](https://github.com/aws/aws-cdk/commit/3ce8e47159c5f108c2f20d10714117762ad99ffd)), closes [#21650](https://github.com/aws/aws-cdk/issues/21650)
* **apigateway:** create BasePathMapping without stage ([#21488](https://github.com/aws/aws-cdk/issues/21488)) ([9bb213c](https://github.com/aws/aws-cdk/commit/9bb213c326ec79aca71bb646decd799f8c4954cd)), closes [#15806](https://github.com/aws/aws-cdk/issues/15806)
* **aws-cloudwatch:** composite alarm actions suppression ([#22330](https://github.com/aws/aws-cdk/issues/22330)) ([19c945e](https://github.com/aws/aws-cdk/commit/19c945e280baa0c074e4d278c5b418042d595fa6))
* **cfn-include:** allow cyclical dependencies  ([#22126](https://github.com/aws/aws-cdk/issues/22126)) ([2c8195a](https://github.com/aws/aws-cdk/commit/2c8195a0ee0b2832ade598259a4bae5e3ea25eaa))
* **cfnspec:** cloudformation spec v91.0.0 ([#22305](https://github.com/aws/aws-cdk/issues/22305)) ([0358d51](https://github.com/aws/aws-cdk/commit/0358d51954b3ae32c6d7bdb490d498ab743770ec))
* **codedeploy:** CodeDeploy deployment config constructs for Lambda and ECS ([#22159](https://github.com/aws/aws-cdk/issues/22159)) ([6840d8e](https://github.com/aws/aws-cdk/commit/6840d8e43381793bd7a51191bddaffc4cb6641d6))
* **codepipeline-actions:** add elastic beanstalk deploy action ([#22135](https://github.com/aws/aws-cdk/issues/22135)) ([d8acc8a](https://github.com/aws/aws-cdk/commit/d8acc8aa07867be1b1b3cad05b67dab2d7bc3252)), closes [#2516](https://github.com/aws/aws-cdk/issues/2516)
* **core:** allow overriding the stage name ([#22223](https://github.com/aws/aws-cdk/issues/22223)) ([3d227e5](https://github.com/aws/aws-cdk/commit/3d227e5e8a7452af85470e6e617dd785dcfb6fbe)), closes [40aws-cdk/core/lib/stage.ts#L139](https://github.com/40aws-cdk/core/lib/stage.ts/issues/L139) [40aws-cdk/core/lib/stack.ts#L1139-L1143](https://github.com/40aws-cdk/core/lib/stack.ts/issues/L1139-L1143) [40aws-cdk/core/lib/stack.ts#L106-L111](https://github.com/40aws-cdk/core/lib/stack.ts/issues/L106-L111)
* **core:** make `StackSynthesizer` easier to subclass ([#22308](https://github.com/aws/aws-cdk/issues/22308)) ([8b2b381](https://github.com/aws/aws-cdk/commit/8b2b38187b709a4e9a37a4de043a84267a9ec937))
* **sqs:** add SQS managed server side encryption ([#21591](https://github.com/aws/aws-cdk/issues/21591)) ([fa137eb](https://github.com/aws/aws-cdk/commit/fa137eb9f57a0956dae512e41b7a400b401d5642)), closes [#17770](https://github.com/aws/aws-cdk/issues/17770)


### Bug Fixes

* **certificatemanager:** unable to set removal policy on DnsValidatedCertificate ([#22122](https://github.com/aws/aws-cdk/issues/22122)) ([bae6554](https://github.com/aws/aws-cdk/commit/bae655419c2f0805c4fa3ea7ef20704539bbb44c)), closes [#22040](https://github.com/aws/aws-cdk/issues/22040) [#22040](https://github.com/aws/aws-cdk/issues/22040) [#20649](https://github.com/aws/aws-cdk/issues/20649) [#14519](https://github.com/aws/aws-cdk/issues/14519)
* **cli:** large context causes E2BIG error during synthesis on Linux ([#21373](https://github.com/aws/aws-cdk/issues/21373)) ([7040168](https://github.com/aws/aws-cdk/commit/7040168f21f81421b78c44955b39cfca21c6c22d)), closes [#21230](https://github.com/aws/aws-cdk/issues/21230) [#19261](https://github.com/aws/aws-cdk/issues/19261)
* **core:** addPropertyOverride doesn't work for all intrinsics ([#22294](https://github.com/aws/aws-cdk/issues/22294)) ([e2deca0](https://github.com/aws/aws-cdk/commit/e2deca0f1981f09c9d32c11c8359400191a7d753)), closes [#20608](https://github.com/aws/aws-cdk/issues/20608) [#19971](https://github.com/aws/aws-cdk/issues/19971)
* **ec2:** cannot allow all ipv6 traffic ([#22279](https://github.com/aws/aws-cdk/issues/22279)) ([f7bbc94](https://github.com/aws/aws-cdk/commit/f7bbc943f00f3e0ceeb0ed03ec03bb36af5b3cb9)), closes [#7094](https://github.com/aws/aws-cdk/issues/7094)
* **init:** freshly generated go project doesn't build ([#22310](https://github.com/aws/aws-cdk/issues/22310)) ([c6a4e71](https://github.com/aws/aws-cdk/commit/c6a4e71067299b0e0ad65f31e9eec15a4e80ebdb))
* **region-info:** SSM service principals are incorrect in opt-in regions ([#22327](https://github.com/aws/aws-cdk/issues/22327)) ([b7f0889](https://github.com/aws/aws-cdk/commit/b7f08895c884c9e4e8b672e62f6c7515fa65b3a8))
* **s3:** Bucket Key cannot be used with KMS_MANAGED key ([#22331](https://github.com/aws/aws-cdk/issues/22331)) ([63d3c54](https://github.com/aws/aws-cdk/commit/63d3c541e571dffe3efab83e69fa9718eef14411))
* **sns:** race condition exists between sqs queue policy and sns subscription ([#21797](https://github.com/aws/aws-cdk/issues/21797)) ([cf43b03](https://github.com/aws/aws-cdk/commit/cf43b03c0c6231f93ca1db0b24df7c623d55dd2b))
* **sqs:** SSE-SQS is enabled by default and can't be disabled ([#22321](https://github.com/aws/aws-cdk/issues/22321)) ([43547d3](https://github.com/aws/aws-cdk/commit/43547d3544a02f76c287abfc26570a02cfae65c6)), closes [#22137](https://github.com/aws/aws-cdk/issues/22137)
* **step-functions:** arn is not valid across partitions ([#22314](https://github.com/aws/aws-cdk/issues/22314)) ([6e16ffe](https://github.com/aws/aws-cdk/commit/6e16ffe8e49f6a5d4ba076ba3d66f564daded96b))
* **stepfunctions-tasks:** emrcontainers has incorrect validation of entry point arguments ([#22242](https://github.com/aws/aws-cdk/issues/22242)) ([a006b9a](https://github.com/aws/aws-cdk/commit/a006b9a9ec7f743ce276f98bfbdac12a8ee13872)), closes [#22061](https://github.com/aws/aws-cdk/issues/22061)

## [2.44.0](https://github.com/aws/aws-cdk/compare/v2.43.1...v2.44.0) (2022-09-28)


### Features

* **assets:** support drop-in docker replacements by setting `$CDK_DOCKER` ([#21838](https://github.com/aws/aws-cdk/issues/21838)) ([d52310e](https://github.com/aws/aws-cdk/commit/d52310ea2104dd1ed13761944d078ffce46a299f)), closes [40aws-cdk/core/lib/bundling.ts#L523](https://github.com/40aws-cdk/core/lib/bundling.ts/issues/L523) [#21836](https://github.com/aws/aws-cdk/issues/21836)
* **backup:** add copy actions to backup plan rules ([#22244](https://github.com/aws/aws-cdk/issues/22244)) ([d87a651](https://github.com/aws/aws-cdk/commit/d87a651608d23f3bfc3c178093d92b5bdda71084)), closes [#22173](https://github.com/aws/aws-cdk/issues/22173)
* **cfnspec:** cloudformation spec v89.0.0 ([#22232](https://github.com/aws/aws-cdk/issues/22232)) ([953d684](https://github.com/aws/aws-cdk/commit/953d6841fa3ed43258d0454e245cebcab6323e0d))
* **cli:** `cdk deploy --method=direct` is faster ([#22079](https://github.com/aws/aws-cdk/issues/22079)) ([dd6ead4](https://github.com/aws/aws-cdk/commit/dd6ead447a80cdec3379a3ced2e04b7d15f9c55d))
* **cloudwatch:** add gauge widget ([#22213](https://github.com/aws/aws-cdk/issues/22213)) ([d9f0e80](https://github.com/aws/aws-cdk/commit/d9f0e809d583d23cb83b4e2855574675a669c33f)), closes [#22136](https://github.com/aws/aws-cdk/issues/22136)
* **core:** 'postCliContext' property allows context that cannot be overridden by the CLI ([#21743](https://github.com/aws/aws-cdk/issues/21743)) ([a618096](https://github.com/aws/aws-cdk/commit/a618096432a27a808a0352ea186fe1e4db2911c4))
* **dynamodb:** Changes how metricForOperation methods are used ([#22097](https://github.com/aws/aws-cdk/issues/22097)) ([fcb311d](https://github.com/aws/aws-cdk/commit/fcb311d615422b76f18b6be60dd466b315fcd6b0)), closes [#21963](https://github.com/aws/aws-cdk/issues/21963)
* **logs:** add dimensions to metric filter ([#21654](https://github.com/aws/aws-cdk/issues/21654)) ([f834a45](https://github.com/aws/aws-cdk/commit/f834a4537643b32131076111be0693c6f8f96b24)), closes [/github.com/aws/aws-cdk/issues/16999#issuecomment-1005172655](https://github.com/aws//github.com/aws/aws-cdk/issues/16999/issues/issuecomment-1005172655) [#16999](https://github.com/aws/aws-cdk/issues/16999)
* **pipelines:** allow disabling use of change sets ([#21619](https://github.com/aws/aws-cdk/issues/21619)) ([05723e7](https://github.com/aws/aws-cdk/commit/05723e74cc0e760f570c36ec02a70e8936287814)), closes [#20827](https://github.com/aws/aws-cdk/issues/20827)
* **s3-deployment:** extract flag to disable automatic unzipping ([#21805](https://github.com/aws/aws-cdk/issues/21805)) ([91898b5](https://github.com/aws/aws-cdk/commit/91898b51573c0bfd0f26ae7610feb6a400bc8159)), closes [#8065](https://github.com/aws/aws-cdk/issues/8065)


### Bug Fixes

* **aws-elasticloadbalancingv2:** Validation for interval and timeout of application-target-group ([#22225](https://github.com/aws/aws-cdk/issues/22225)) ([6128e39](https://github.com/aws/aws-cdk/commit/6128e3908f4f6b6a1db66ebf7f77b6c966d1f9e7))
* **cli:** SSO credentials do not work when using a proxy ([#22115](https://github.com/aws/aws-cdk/issues/22115)) ([c425e8c](https://github.com/aws/aws-cdk/commit/c425e8ca1a3d296eb6a7fd7e005d07c1eadd16aa)), closes [#21328](https://github.com/aws/aws-cdk/issues/21328)
* **elbv2:** Use correct format for parsing imported target group ARNs ([#22153](https://github.com/aws/aws-cdk/issues/22153)) ([4704d4c](https://github.com/aws/aws-cdk/commit/4704d4c4ac065634dbada3732193a6753369dd12))
* **rds:** changing engine versions would fail to update on DBInstances that were part of a DBCluster ([#22185](https://github.com/aws/aws-cdk/issues/22185)) ([c070ace](https://github.com/aws/aws-cdk/commit/c070acea1b12ec4f73c7d2087c5408d7e38a90a3)), closes [#21758](https://github.com/aws/aws-cdk/issues/21758) [#22180](https://github.com/aws/aws-cdk/issues/22180)
* cannot use values that return an instance of a deprecated class for non TS / JS language ([#22204](https://github.com/aws/aws-cdk/issues/22204)) ([4cad2cf](https://github.com/aws/aws-cdk/commit/4cad2cf7e1ca41dedae6adc8866792e5f71b2123))

## [2.43.1](https://github.com/aws/aws-cdk/compare/v2.43.0...v2.43.1) (2022-09-23)


### Bug Fixes

* cannot use values that return an instance of a deprecated class for non TS / JS language ([#22204](https://github.com/aws/aws-cdk/issues/22204)) ([6182d33](https://github.com/aws/aws-cdk/commit/6182d33fdd3b4714e1888305a2e1c689a10e38ea))

## [2.43.0](https://github.com/aws/aws-cdk/compare/v2.42.1...v2.43.0) (2022-09-21)


### Features

* **cfnspec:** cloudformation spec v89.0.0 ([#22105](https://github.com/aws/aws-cdk/issues/22105)) ([9726e8f](https://github.com/aws/aws-cdk/commit/9726e8fa07bcf496c79f8ab3be1c9f04b0e5dc3a))
* **ec2:** flowlog setting add MaxAggregationInterval ([#22098](https://github.com/aws/aws-cdk/issues/22098)) ([dbede40](https://github.com/aws/aws-cdk/commit/dbede408ee21e2e62137867a7fd040890daf77c7))
* **stepfunctions-tasks:** additional IAM statements for AWS SDK service integration ([#22070](https://github.com/aws/aws-cdk/issues/22070)) ([fbb941f](https://github.com/aws/aws-cdk/commit/fbb941f848fc363c93ae79d899532ed4522f31b1)), closes [#22006](https://github.com/aws/aws-cdk/issues/22006)


### Bug Fixes

* **api-gateway:** SpecRestApi ignores disableExecuteApiEndpoint property ([#22133](https://github.com/aws/aws-cdk/issues/22133)) ([a4364ce](https://github.com/aws/aws-cdk/commit/a4364ceb9a5303768c5c1447857af44f1fe9e8ce)), closes [#21295](https://github.com/aws/aws-cdk/issues/21295)
* **certificatemanager:** unable to set removal policy on DnsValidatedCertificate ([#22040](https://github.com/aws/aws-cdk/issues/22040)) ([b3c9464](https://github.com/aws/aws-cdk/commit/b3c9464d0e0d333db132daec96cdd283145a6ce5)), closes [#20649](https://github.com/aws/aws-cdk/issues/20649)
* **cli:** "EACCES: Permission denied" on 'cdk init' ([#22111](https://github.com/aws/aws-cdk/issues/22111)) ([384ba2b](https://github.com/aws/aws-cdk/commit/384ba2b7fc2ae9c5a70d0e5633fcc463b2cea282)), closes [#21049](https://github.com/aws/aws-cdk/issues/21049) [#22090](https://github.com/aws/aws-cdk/issues/22090)
* **cli:** Lambda hotswap fails if environment contains tokens ([#22099](https://github.com/aws/aws-cdk/issues/22099)) ([8280709](https://github.com/aws/aws-cdk/commit/8280709219d95ac4bd76e21bfe8214a02afaa413)), closes [#22088](https://github.com/aws/aws-cdk/issues/22088)
* **codedeploy:** unable to configure disable automatically rollback ([#22083](https://github.com/aws/aws-cdk/issues/22083)) ([ce27789](https://github.com/aws/aws-cdk/commit/ce277899e9df2ae9d69e94bdaa931e130cd4c95a)), closes [#21691](https://github.com/aws/aws-cdk/issues/21691)
* **s3-deployment:** fails when `destinationKeyPrefix` is a token with a long string representation ([#22163](https://github.com/aws/aws-cdk/issues/22163)) ([ce59b6a](https://github.com/aws/aws-cdk/commit/ce59b6aaa7a19ec074547824c3641822ab853213))


## [2.42.1](https://github.com/aws/aws-cdk/compare/v2.42.0...v2.42.1) (2022-09-19)


### Reverts

* **init-templates:** csharp and fsharp app init fails when path contains space ([#22112](https://github.com/aws/aws-cdk/issues/22112)) ([89f64d4](https://github.com/aws/aws-cdk/commit/89f64d4082d1a339caa1eab04a9ffc63b9088d9a)), closes [aws/aws-cdk#21049](https://github.com/aws/aws-cdk/issues/21049)

## [2.42.0](https://github.com/aws/aws-cdk/compare/v2.41.0...v2.42.0) (2022-09-15)


### Features

* **cfnspec:** cloudformation spec v88.0.0 ([#22026](https://github.com/aws/aws-cdk/issues/22026)) ([1f03e8c](https://github.com/aws/aws-cdk/commit/1f03e8c40a682a3b5aae90560c84017cfe62762e))
* **cognito:** add SAML user pool identity provider ([#21879](https://github.com/aws/aws-cdk/issues/21879)) ([76d446b](https://github.com/aws/aws-cdk/commit/76d446b07559ee9a980446516dea5b88bc135049))
* **lambda-event-sources:** add filters to SQS, DynamoDB, and Kinesis event sources ([#21917](https://github.com/aws/aws-cdk/issues/21917)) ([7ba5659](https://github.com/aws/aws-cdk/commit/7ba565967a02f18c66ee07eaa65094365e5f7991)), closes [#17874](https://github.com/aws/aws-cdk/issues/17874)
* **redshift-alpha:** directly add parameters to a parameter group or indirectly through a cluster ([#20944](https://github.com/aws/aws-cdk/issues/20944)) ([0ad307b](https://github.com/aws/aws-cdk/commit/0ad307be1432f82db5295291a51439ede2a36c31)), closes [#20656](https://github.com/aws/aws-cdk/issues/20656) [#20656](https://github.com/aws/aws-cdk/issues/20656)
* **ssm:** reference existing SSM list parameters ([#21880](https://github.com/aws/aws-cdk/issues/21880)) ([8f7ee2b](https://github.com/aws/aws-cdk/commit/8f7ee2ba58b38f3f6d9eb8bebd96c208c3d7d2ce)), closes [#12477](https://github.com/aws/aws-cdk/issues/12477) [#14364](https://github.com/aws/aws-cdk/issues/14364)


### Bug Fixes

* **apigateway:** Add contextOwnerAccountId log pattern ([#21989](https://github.com/aws/aws-cdk/issues/21989)) ([c24027b](https://github.com/aws/aws-cdk/commit/c24027bfcb12e731230ccfcbdfb5b1ca4a233815)), closes [#21731](https://github.com/aws/aws-cdk/issues/21731)
* **aws-lambda:** fail fast if a reserved environment variable is specified ([#22039](https://github.com/aws/aws-cdk/issues/22039)) ([950ccd5](https://github.com/aws/aws-cdk/commit/950ccd56e042abaea85788e5134c5c36fde02803))
* **elasticloadbalancingv2:** securityGroup property is not required in fromApplicationListenerAttributes ([#21934](https://github.com/aws/aws-cdk/issues/21934)) ([e501ac9](https://github.com/aws/aws-cdk/commit/e501ac94c171e6915ddaeba4eb66d0f50c2ea541)), closes [#21930](https://github.com/aws/aws-cdk/issues/21930)
* **elbv2:** connections not created for chained listener actions ([#21939](https://github.com/aws/aws-cdk/issues/21939)) ([46cf825](https://github.com/aws/aws-cdk/commit/46cf825739af125ef7a7369413d8e9ec071f87aa)), closes [#12994](https://github.com/aws/aws-cdk/issues/12994)
* **init-templates:** csharp and fsharp app init fails when path contains space ([#21049](https://github.com/aws/aws-cdk/issues/21049)) ([79c9ca1](https://github.com/aws/aws-cdk/commit/79c9ca1a168c38ceb55376f6e61e7297448a465e)), closes [#18803](https://github.com/aws/aws-cdk/issues/18803)
* **lambda-event-sources:** cannot add sqs event source to an imported function ([#21970](https://github.com/aws/aws-cdk/issues/21970)) ([c33bb81](https://github.com/aws/aws-cdk/commit/c33bb818116eda2407804935c1be10ff40eba92b)), closes [#12607](https://github.com/aws/aws-cdk/issues/12607)
* **route53:** vpc region in template overridden by stack region ([#20530](https://github.com/aws/aws-cdk/issues/20530)) ([aedc888](https://github.com/aws/aws-cdk/commit/aedc8883bfb7ec85b4d3392b3f589bcbfe22e4e0)), closes [#20496](https://github.com/aws/aws-cdk/issues/20496) [#20496](https://github.com/aws/aws-cdk/issues/20496)

## [2.41.0](https://github.com/aws/aws-cdk/compare/v2.40.0...v2.41.0) (2022-09-07)


### Features

* **assertions:** add function for verifying the number of matching resource properties ([#21707](https://github.com/aws/aws-cdk/issues/21707)) ([80cb527](https://github.com/aws/aws-cdk/commit/80cb527c01173a060064606b8fe286d5510f145e))
* **custom-resource:** allow AwsCustomResource to be placed in vpc ([#21357](https://github.com/aws/aws-cdk/issues/21357)) ([62d7bf8](https://github.com/aws/aws-cdk/commit/62d7bf83b4bfe6358e86ecf1c332e51a3909bd8a))
* **ec2:** allow private non-nat subnets ([#21699](https://github.com/aws/aws-cdk/issues/21699)) ([e1794e3](https://github.com/aws/aws-cdk/commit/e1794e346c2a04bf8f2e5f63138095a79f512cfe))
* **ecs:** add `maxSwap` and `swappiness` properties to LinuxParameters ([#18703](https://github.com/aws/aws-cdk/issues/18703)) ([08eb1d6](https://github.com/aws/aws-cdk/commit/08eb1d66ae9caa6589c3ee66c4040a4e116adf52)), closes [#18460](https://github.com/aws/aws-cdk/issues/18460)
* **lambda-event-sources:** add kafka consumerGroupId support ([#21791](https://github.com/aws/aws-cdk/issues/21791)) ([b36bc11](https://github.com/aws/aws-cdk/commit/b36bc1146d06c7b9decface9f4ed9edeca61aa56))
* compress aws-cdk-lib tablet file ([#21854](https://github.com/aws/aws-cdk/issues/21854)) ([5a3db2d](https://github.com/aws/aws-cdk/commit/5a3db2d19dc5525bfef568f17fffa09657b6ef21))
* **ecs:** add function for adding secrets to containers after instantiating them ([#21826](https://github.com/aws/aws-cdk/issues/21826)) ([572f781](https://github.com/aws/aws-cdk/commit/572f7815cc5447aac9413b374ebbfd92bfa610a6)), closes [#18959](https://github.com/aws/aws-cdk/issues/18959)


### Bug Fixes

* **aws-cdk:** cdk bootstrap print JSON template when using --json option ([#21852](https://github.com/aws/aws-cdk/issues/21852)) ([7bc3d18](https://github.com/aws/aws-cdk/commit/7bc3d18ff742140a35238af0241b5dc4c2cf73ee)), closes [#21456](https://github.com/aws/aws-cdk/issues/21456) [#21456](https://github.com/aws/aws-cdk/issues/21456)
* **core:** `--debug` doesn't record stack traces ([#21931](https://github.com/aws/aws-cdk/issues/21931)) ([9f2ea45](https://github.com/aws/aws-cdk/commit/9f2ea458609b29a91eb792165be6de596ce1aea9))
* **events:** additional plaintext header are not set on eventbridge connection ([#21857](https://github.com/aws/aws-cdk/issues/21857)) ([f3f4814](https://github.com/aws/aws-cdk/commit/f3f4814b66ef2b0070fb6b25af9f6566bc1783a0))
* **events-targets:** cannot set retry policy to 0 retry attempts  ([#21900](https://github.com/aws/aws-cdk/issues/21900)) ([5549f16](https://github.com/aws/aws-cdk/commit/5549f1692270bce06a1d9cde952f9cd23a04204b)), closes [40aws-cdk/aws-events-targets/lib/util.ts#L54-L59](https://github.com/40aws-cdk/aws-events-targets/lib/util.ts/issues/L54-L59) [#21864](https://github.com/aws/aws-cdk/issues/21864)
* **stepfunctions:** cfnSpec breaks definitionSubstitutions prop ([#21887](https://github.com/aws/aws-cdk/issues/21887)) ([3adf841](https://github.com/aws/aws-cdk/commit/3adf84188947eb2fde6171f70d0d9c2dcdb78563)), closes [#21653](https://github.com/aws/aws-cdk/issues/21653)

## [2.40.0](https://github.com/aws/aws-cdk/compare/v2.39.1...v2.40.0) (2022-08-31)


### Features

* **cdk-cli-wrapper:** add `progress` argument for cdk deploy ([#21762](https://github.com/aws/aws-cdk/issues/21762)) ([dab83cc](https://github.com/aws/aws-cdk/commit/dab83cc4e70ec477abb4fdf2a2ac6319dff143e9))
* **core:** `Fn::ToJsonString` and `Fn::Length` intrinsic functions ([#21749](https://github.com/aws/aws-cdk/issues/21749)) ([7472fa4](https://github.com/aws/aws-cdk/commit/7472fa484e45cc5dd05c10e4998c02d28f60da65))


### Bug Fixes

* **certificatemanager:** domainName not checked for length ([#21807](https://github.com/aws/aws-cdk/issues/21807)) ([3e55092](https://github.com/aws/aws-cdk/commit/3e55092fb70e0ec74ee7c4144d6e39a29d8757ae))
* **ecs:** secretToken required but declared as optional ([#21745](https://github.com/aws/aws-cdk/issues/21745)) ([26ac81f](https://github.com/aws/aws-cdk/commit/26ac81f77877f504ede97997db8e3b48670f643e)), closes [#21744](https://github.com/aws/aws-cdk/issues/21744)
* **ecs-patterns:** add validation for queue and queue related props ([#21717](https://github.com/aws/aws-cdk/issues/21717)) ([7e9bd7d](https://github.com/aws/aws-cdk/commit/7e9bd7d8419313c333b7a0fffdc489363046e4e2))
* **integ:** write assertion stack name to integ manifest ([#21809](https://github.com/aws/aws-cdk/issues/21809)) ([e2dc2cb](https://github.com/aws/aws-cdk/commit/e2dc2cb76109bcac249f28eac8da3335c8b06e9d)), closes [#21646](https://github.com/aws/aws-cdk/issues/21646)
* **servicecatalog:** incorrect service in portfolio arn generation ([#21770](https://github.com/aws/aws-cdk/issues/21770)) ([f9ca639](https://github.com/aws/aws-cdk/commit/f9ca639175352bad1db78666c750f00955627d1a)), closes [#20849](https://github.com/aws/aws-cdk/issues/20849)

## [2.39.1](https://github.com/aws/aws-cdk/compare/v2.39.0...v2.39.1) (2022-08-29)


### Bug Fixes

* **python:** NameError name 'SubnetSelection' is not defined ([#21790](https://github.com/aws/aws-cdk/issues/21790)) ([eaaba39](https://github.com/aws/aws-cdk/commit/eaaba39e21f8b76dfa01cb5515a25d8600e73eee)), closes [#21790](https://github.com/aws/aws-cdk/issues/21790)

## [2.39.0](https://github.com/aws/aws-cdk/compare/v2.38.1...v2.39.0) (2022-08-25)


### Features

* **aws-cloudwatch:** add support for sparkline graphs in SingleValueWidget  ([#21684](https://github.com/aws/aws-cdk/issues/21684)) ([cf5d115](https://github.com/aws/aws-cdk/commit/cf5d115aaba1bf62239817d4ced78316a9e50490)), closes [#21683](https://github.com/aws/aws-cdk/issues/21683)
* **certificatemanager:** Allow opting out of transparency logging ([#21686](https://github.com/aws/aws-cdk/issues/21686)) ([85b6db0](https://github.com/aws/aws-cdk/commit/85b6db054d1aced18b1ec4fc1b16ed74aa47cf99))
* **cfnspec:** cloudformation spec v85.0.0 ([#21679](https://github.com/aws/aws-cdk/issues/21679)) ([1a560b0](https://github.com/aws/aws-cdk/commit/1a560b05c8f0740f367fc016602fdb9b1d7f7a13))
* **cli:** re-introduce `--concurrency` option ([#21681](https://github.com/aws/aws-cdk/issues/21681)) ([f001f7e](https://github.com/aws/aws-cdk/commit/f001f7e2989254c2ceae6ec22486ad6aee5ee66c)), closes [#20345](https://github.com/aws/aws-cdk/issues/20345) [#21664](https://github.com/aws/aws-cdk/issues/21664) [#21663](https://github.com/aws/aws-cdk/issues/21663) [#21598](https://github.com/aws/aws-cdk/issues/21598) [#21663](https://github.com/aws/aws-cdk/issues/21663)
* **cloudtrail:** add configuration for IsOrganizationTrail ([#21625](https://github.com/aws/aws-cdk/issues/21625)) ([f5a1057](https://github.com/aws/aws-cdk/commit/f5a10574308b9193cba32d398a08fe61b5d15aa3)), closes [#21578](https://github.com/aws/aws-cdk/issues/21578)
* **ecr-assets:** expose property imageTag separately from imageUri in ECR assets  ([#21582](https://github.com/aws/aws-cdk/issues/21582)) ([5f32e0f](https://github.com/aws/aws-cdk/commit/5f32e0f6904e57aec17bc967ac5bbd9f9f0c45b6))


### Bug Fixes

* **autoscaling:** error not thrown when associatePublicIpAddress is set to false when specifying launchTemplate ([#21714](https://github.com/aws/aws-cdk/issues/21714)) ([da61adc](https://github.com/aws/aws-cdk/commit/da61adc1bfadea4e541d34f4eb082f280cc289e1)), closes [#21576](https://github.com/aws/aws-cdk/issues/21576)
* **cli:** build assets before deploying any stacks ([#21513](https://github.com/aws/aws-cdk/issues/21513)) ([5cc0d35](https://github.com/aws/aws-cdk/commit/5cc0d3514dd6c1bedd8233ec48074257b003fed0)), closes [#21511](https://github.com/aws/aws-cdk/issues/21511)
* **cli:** CLI hangs for 10 minutes on expired credentials ([#21052](https://github.com/aws/aws-cdk/issues/21052)) ([1e305e6](https://github.com/aws/aws-cdk/commit/1e305e6eed6b4ede78df10cbaadb8b578c1e6baa))
* **cli:** ECS hotswap breaks Firelens configuration ([#21748](https://github.com/aws/aws-cdk/issues/21748)) ([3d22f70](https://github.com/aws/aws-cdk/commit/3d22f70a8e4e81e2e9056fa76a4c932f3305fd4b)), closes [#21692](https://github.com/aws/aws-cdk/issues/21692)
* **cli:** empty non top-level stack does not get deleted ([#21624](https://github.com/aws/aws-cdk/issues/21624)) ([a6757b0](https://github.com/aws/aws-cdk/commit/a6757b06f764938981aa82c82b2d21feea05b2f4)), closes [/github.com/aws/aws-cdk/blob/92d6d58029595735df6902db5f820b1182dfb27b/packages/aws-cdk/lib/api/cxapp/cloud-assembly.ts#L138](https://github.com/aws//github.com/aws/aws-cdk/blob/92d6d58029595735df6902db5f820b1182dfb27b/packages/aws-cdk/lib/api/cxapp/cloud-assembly.ts/issues/L138) [/github.com/aws/aws-cdk/blob/92d6d58029595735df6902db5f820b1182dfb27b/packages/aws-cdk/test/integ/cli/cli.integtest.ts#L685](https://github.com/aws//github.com/aws/aws-cdk/blob/92d6d58029595735df6902db5f820b1182dfb27b/packages/aws-cdk/test/integ/cli/cli.integtest.ts/issues/L685) [#20822](https://github.com/aws/aws-cdk/issues/20822) [#20822](https://github.com/aws/aws-cdk/issues/20822)
* **codebuild:** ReportGroup missing test permissions when set to CODE_COVERAGE ([#21656](https://github.com/aws/aws-cdk/issues/21656)) ([17a4989](https://github.com/aws/aws-cdk/commit/17a4989385fc7c5aeacdbd0b564e3d3b21530384)), closes [#21534](https://github.com/aws/aws-cdk/issues/21534)
* **core:** feature flag values should be booleans ([#21759](https://github.com/aws/aws-cdk/issues/21759)) ([daf885f](https://github.com/aws/aws-cdk/commit/daf885ff8d20088c93e214dbb07d163cfaa28089)), closes [aws-cdk/aws-lambda/lib/function.ts#L1306](https://github.com/aws-cdk/aws-lambda/lib/function.ts/issues/L1306)
* **ec2:** Internet connectivity not established for private subnets ([#21495](https://github.com/aws/aws-cdk/issues/21495)) ([5b1488d](https://github.com/aws/aws-cdk/commit/5b1488d4368110a17546ece6a5bb869f22adac99)), closes [#21348](https://github.com/aws/aws-cdk/issues/21348)

## [2.38.1](https://github.com/aws/aws-cdk/compare/v2.38.0...v2.38.1) (2022-08-18)

### Reverts

* cli: revert "feat(cli): --concurrency option" ([#21664](https://github.com/aws/aws-cdk/pull/21664)) ([2ad2163b](https://github.com/aws/aws-cdk/commit/2ad2163b96254f9715dff405100a047d6c2c5958))
* cli: revert "feat(cli): cdk watch --concurrency" ([#21665](https://github.com/aws/aws-cdk/pull/21665)) ([6048d4fc](https://github.com/aws/aws-cdk/commit/6048d4fc37239bcd5193d5487464590c786bf56b))

## [2.38.0](https://github.com/aws/aws-cdk/compare/v2.37.1...v2.38.0) (2022-08-17)


### Features

* **aws-cloudwatch-actions:** add ssm incidents as alarm action ([#21167](https://github.com/aws/aws-cdk/issues/21167)) ([471511e](https://github.com/aws/aws-cdk/commit/471511e6628c4f0cc4b18ab232ecb102000ca9e8)), closes [#20553](https://github.com/aws/aws-cdk/issues/20553) [#20552](https://github.com/aws/aws-cdk/issues/20552)
* **cfnspec:** cloudformation spec v84.0.0 ([#21574](https://github.com/aws/aws-cdk/issues/21574)) ([16c0c98](https://github.com/aws/aws-cdk/commit/16c0c988fe47dc8962ebbccc5755613735fedd28))
* **cli:** --concurrency option ([#20345](https://github.com/aws/aws-cdk/issues/20345)) ([0dd34dd](https://github.com/aws/aws-cdk/commit/0dd34dd85379abaee23c23caa3e8e4565b64087c)), closes [#1973](https://github.com/aws/aws-cdk/issues/1973) [#19378](https://github.com/aws/aws-cdk/issues/19378)
* **cli:** cdk watch --concurrency ([#21598](https://github.com/aws/aws-cdk/issues/21598)) ([e48cf15](https://github.com/aws/aws-cdk/commit/e48cf15d6fa0ab1072684337b6ff4ba31b8f9298)), closes [#20345](https://github.com/aws/aws-cdk/issues/20345) [#21597](https://github.com/aws/aws-cdk/issues/21597)
* **cli:** support hotswapping Lambda function's description and environment variables ([#21532](https://github.com/aws/aws-cdk/issues/21532)) ([b1777d2](https://github.com/aws/aws-cdk/commit/b1777d2938b19d5fbb488f19b65a09422bbd0656)), closes [#82dbd4](https://github.com/aws/aws-cdk/issues/82dbd4) [#20787](https://github.com/aws/aws-cdk/issues/20787)
* **cloudfront:** create distributions with HTTP/3 ([#21613](https://github.com/aws/aws-cdk/issues/21613)) ([58101a6](https://github.com/aws/aws-cdk/commit/58101a6edd60eb6ecd73b6b484862353d1df130a))
* **core:** use literal for stack.partition (under feature flag) ([#21420](https://github.com/aws/aws-cdk/issues/21420)) ([401b428](https://github.com/aws/aws-cdk/commit/401b428637cecf322886ba948dd5c3e9b0e46734)), closes [#4092](https://github.com/aws/aws-cdk/issues/4092)
* **ec2:** add P4DE instances (in developer preview) ([#21590](https://github.com/aws/aws-cdk/issues/21590)) ([0c654e9](https://github.com/aws/aws-cdk/commit/0c654e92836011298af178011eddf2d878133d6b)), closes [#20924](https://github.com/aws/aws-cdk/issues/20924) [/github.com/aws/aws-cdk/issues/20924#issuecomment-1204357355](https://github.com/aws//github.com/aws/aws-cdk/issues/20924/issues/issuecomment-1204357355)
* **ecs-patterns:** refactor fargate interfaces and add support for runtimePlatform ([#21529](https://github.com/aws/aws-cdk/issues/21529)) ([b4f9e5e](https://github.com/aws/aws-cdk/commit/b4f9e5eb376a560dcb9a61d72e32ed602bc02c66)), closes [#20756](https://github.com/aws/aws-cdk/issues/20756) [#20756](https://github.com/aws/aws-cdk/issues/20756) [#18462](https://github.com/aws/aws-cdk/issues/18462)
* **pipelines:** add static PipelineBase.isPipeline method ([#21075](https://github.com/aws/aws-cdk/issues/21075)) ([ea11f33](https://github.com/aws/aws-cdk/commit/ea11f33c7380ba2d79c122397576782ed13fe00e))
* **s3:** introduce a `fromCfnBucket()` method ([#20081](https://github.com/aws/aws-cdk/issues/20081)) ([0ec31da](https://github.com/aws/aws-cdk/commit/0ec31da8ef301a948aac23ba4f50958bb95761ce))
* **servicediscovery:** add support for API only services within a DNS namespace ([#21494](https://github.com/aws/aws-cdk/issues/21494)) ([1920313](https://github.com/aws/aws-cdk/commit/19203132f469195e1216812514ad32f6db179b3c))


### Bug Fixes

* **route53:** misleading error message in `fromLookup` if `domainName` is undefined ([#21596](https://github.com/aws/aws-cdk/issues/21596)) ([f44eb98](https://github.com/aws/aws-cdk/commit/f44eb9800ac80b9edde62771377d32a017880701)), closes [#10053](https://github.com/aws/aws-cdk/issues/10053)
* duration doesn't get accurately compared in alb service base ([#21584](https://github.com/aws/aws-cdk/issues/21584)) ([90786d6](https://github.com/aws/aws-cdk/commit/90786d6d2968fd268f30bdd940bfc9915e629fd3)), closes [#21560](https://github.com/aws/aws-cdk/issues/21560)
* **aws-apigateway:** CloudWatch logging should be disabled by default (under feature flag) ([#21546](https://github.com/aws/aws-cdk/issues/21546)) ([78c858f](https://github.com/aws/aws-cdk/commit/78c858f26fe9b688dc0260d7e8a59004b57c388d)), closes [#10878](https://github.com/aws/aws-cdk/issues/10878)
* **cloudfront:** truncate long ResponseHeaderPolicy names ([#21525](https://github.com/aws/aws-cdk/issues/21525)) ([a464ee1](https://github.com/aws/aws-cdk/commit/a464ee12e2717af28053d5f14de95a444f451d23)), closes [#21524](https://github.com/aws/aws-cdk/issues/21524)
* **codepipeline-actions:** cross stack reference causes stack cycle in sources that use CloudWatch Events ([#20149](https://github.com/aws/aws-cdk/issues/20149)) ([adf4022](https://github.com/aws/aws-cdk/commit/adf402213d06087f9380984ab37543fe61b7e9e3)), closes [#3087](https://github.com/aws/aws-cdk/issues/3087) [#8042](https://github.com/aws/aws-cdk/issues/8042) [#10896](https://github.com/aws/aws-cdk/issues/10896)
* **codepipeline-actions:** ecr source action doesn't trigger the pipeline ([#21580](https://github.com/aws/aws-cdk/issues/21580)) ([f135b80](https://github.com/aws/aws-cdk/commit/f135b802a80df22fbbfeb7ecebe6c3c98cc26c1e)), closes [#10901](https://github.com/aws/aws-cdk/issues/10901)
* **kms:** imported key ignores environment from arn ([#21519](https://github.com/aws/aws-cdk/issues/21519)) ([c6dbb96](https://github.com/aws/aws-cdk/commit/c6dbb96f3fcf89a247bf7e7271f3c5b283563144)), closes [#21464](https://github.com/aws/aws-cdk/issues/21464)
* **lambda-event-sources:** `rootCACertificate` does not support `ISecret` ([#21555](https://github.com/aws/aws-cdk/issues/21555)) ([bf0f07b](https://github.com/aws/aws-cdk/commit/bf0f07b7adeef4c0e4e0034b868c22e29353638f)), closes [#21422](https://github.com/aws/aws-cdk/issues/21422)
* **route53-targets:** InterfaceVpcEndpointTarget incorrectly accepts an imported endpoint ([#21523](https://github.com/aws/aws-cdk/issues/21523)) ([cc0b005](https://github.com/aws/aws-cdk/commit/cc0b005b9687455ed84c07eaa36f37af510e1dde)), closes [#10432](https://github.com/aws/aws-cdk/issues/10432)

## [2.37.1](https://github.com/aws/aws-cdk/compare/v2.37.0...v2.37.1) (2022-08-10)

### Bug Fixes

* **eks:** revert "fix(eks): cannot disable cluster logging once it has been enabled" ([#21545](https://github.com/aws/aws-cdk/pull/21545)) ([5515ce4](https://github.com/aws/aws-cdk/commit/5515ce4b439d7917bbba662d852acc29fea9d8a4))

## [2.37.0](https://github.com/aws/aws-cdk/compare/v2.36.0...v2.37.0) (2022-08-09)


### Features

* **apigateway:** add metrics for Stage and Method constructs ([#20617](https://github.com/aws/aws-cdk/issues/20617)) ([3bf1361](https://github.com/aws/aws-cdk/commit/3bf1361e20e2b2d497fcc2197fa45dac91e7eee3))
* **aws-cdk-lib:** aws-cdk-lib assembly file is compressed ([#21481](https://github.com/aws/aws-cdk/issues/21481)) ([0767873](https://github.com/aws/aws-cdk/commit/076787314f6e09c610b3d54a62aa1bff9678e111))
* **cfnspec:** cloudformation spec v82.0.0 ([#21473](https://github.com/aws/aws-cdk/issues/21473)) ([1124cbf](https://github.com/aws/aws-cdk/commit/1124cbfbcdd0d95d2ad71c9116c1a4faf0330fc2))
* **cfnspec:** cloudformation spec v83.0.0 ([#21498](https://github.com/aws/aws-cdk/issues/21498)) ([453b553](https://github.com/aws/aws-cdk/commit/453b553c9c5999ef8aa29e690118a63142d8bd1d))
* **cli:** support hotswapping Lambda function's description and environment variables ([#21305](https://github.com/aws/aws-cdk/issues/21305)) ([fb92703](https://github.com/aws/aws-cdk/commit/fb9270312fc6781b5bf20a0c996ec9e9a2c62c86)), closes [#20787](https://github.com/aws/aws-cdk/issues/20787)
* **cognito:** allow retrieval of UserPoolClient generated client secret ([#21262](https://github.com/aws/aws-cdk/issues/21262)) ([67a24ba](https://github.com/aws/aws-cdk/commit/67a24baf6bd6ed0405dbbe9f3beca40cb8df5b02))
* **core:** add network option to docker run command ([#21450](https://github.com/aws/aws-cdk/issues/21450)) ([86e396a](https://github.com/aws/aws-cdk/commit/86e396a5a93b8f008bf6d0d60de2b8abfa1d9ca7)), closes [#21447](https://github.com/aws/aws-cdk/issues/21447)
* **events:** complex event pattern matching with the `Match` class ([#21310](https://github.com/aws/aws-cdk/issues/21310)) ([fe7651f](https://github.com/aws/aws-cdk/commit/fe7651fdc5463d4834e7c9b3b67e96c73433f230))
* **lambda:** add docker platform support for lambda ([#21405](https://github.com/aws/aws-cdk/issues/21405)) ([48178ac](https://github.com/aws/aws-cdk/commit/48178ac6c4d4d3bb6d85561860d552502a4ead01))
* **lambda-event-sources:** add `rootCACertificate` to `SelfManagedKafkaEventSource` ([#21422](https://github.com/aws/aws-cdk/issues/21422)) ([82a597a](https://github.com/aws/aws-cdk/commit/82a597a117f2d6069d52c50c6f42fd4e9c8201dd))
* **logs:** delete associated log group when stack is deleted ([#21113](https://github.com/aws/aws-cdk/issues/21113)) ([2bdd504](https://github.com/aws/aws-cdk/commit/2bdd5042fe7ed7bacd0f064da7e3668bb0137709))


### Bug Fixes

* **cli:** `--hotswap` does not handle `CfnOutput` change correctly ([#21461](https://github.com/aws/aws-cdk/issues/21461)) ([7ccc644](https://github.com/aws/aws-cdk/commit/7ccc644008d974c91bb789628d23f4f0b510075b)), closes [#19998](https://github.com/aws/aws-cdk/issues/19998) [40aws-cdk/cloudformation-diff/lib/diff/types.ts#L10-L21](https://github.com/40aws-cdk/cloudformation-diff/lib/diff/types.ts/issues/L10-L21)
* **custom-resources:** AwsCustomResource requires a policy which updates immutable roles ([#20966](https://github.com/aws/aws-cdk/issues/20966)) ([a02ef9c](https://github.com/aws/aws-cdk/commit/a02ef9c1583d07b191a171263a6e77aadfb9f2ab)), closes [#13232](https://github.com/aws/aws-cdk/issues/13232)
* **cx-api:** bootstrap stack is validated even if the custom synthesizer does not require it ([#21518](https://github.com/aws/aws-cdk/issues/21518)) ([afb1c2d](https://github.com/aws/aws-cdk/commit/afb1c2df82120a4eeba367bc3c3a3f6a07c6adc2)), closes [#21324](https://github.com/aws/aws-cdk/issues/21324) [40aws-cdk/cx-api/lib/artifacts/asset-manifest-artifact.ts#L38-L41](https://github.com/40aws-cdk/cx-api/lib/artifacts/asset-manifest-artifact.ts/issues/L38-L41) [40aws-cdk/cx-api/lib/artifacts/asset-manifest-artifact.ts#L58](https://github.com/40aws-cdk/cx-api/lib/artifacts/asset-manifest-artifact.ts/issues/L58)
* **ec2:** launch template missing tags ([#21445](https://github.com/aws/aws-cdk/issues/21445)) ([3853728](https://github.com/aws/aws-cdk/commit/3853728c699bd9c47b60fcc24ac6a8b7d65306fe))
* **ecs:** setting updatePolicy results in error due to updateType having default value  ([#21025](https://github.com/aws/aws-cdk/issues/21025)) ([3103784](https://github.com/aws/aws-cdk/commit/3103784889c51e63eda555a3941412dfc5789591))
* **eks:** missing question marks cause update cluster setting failure ([#21463](https://github.com/aws/aws-cdk/issues/21463)) ([1000abe](https://github.com/aws/aws-cdk/commit/1000abe43b111ea933ed9b717c3ebe18f96a4d7b)), closes [#21185](https://github.com/aws/aws-cdk/issues/21185) [#21436](https://github.com/aws/aws-cdk/issues/21436)
* **lambda:** Function allows specifying vpcSubnets without vpc ([#21369](https://github.com/aws/aws-cdk/issues/21369)) ([e9233fa](https://github.com/aws/aws-cdk/commit/e9233fae025ff5ee13cd47d35d22b4ec12fffa9e)), closes [#21357](https://github.com/aws/aws-cdk/issues/21357)
* **opensearchservice:** access denied when creating a new domain in regions without cognito support ([#21395](https://github.com/aws/aws-cdk/issues/21395)) ([0e49aed](https://github.com/aws/aws-cdk/commit/0e49aedfc0518c2da0385434f5d4aeaabd993362)), closes [#21192](https://github.com/aws/aws-cdk/issues/21192)
* **pipelines:** 'ConfirmPermissionsBroadening' incorrectly invokes lambda for AWS CLI v2 ([#21462](https://github.com/aws/aws-cdk/issues/21462)) ([a913d60](https://github.com/aws/aws-cdk/commit/a913d6038c7607659c5c5f5bc01774a605f08cf9))
* **ses:** incorrect DKIM records for EmailIdentity ([#21318](https://github.com/aws/aws-cdk/issues/21318)) ([54bad4c](https://github.com/aws/aws-cdk/commit/54bad4cddc44185f48ae51d410343f24dea4a6f1)), closes [#21306](https://github.com/aws/aws-cdk/issues/21306)

## [2.36.0](https://github.com/aws/aws-cdk/compare/v2.35.0...v2.36.0) (2022-08-08)


### Features

* **aws-cdk-lib:** aws-cdk-lib assembly file is compressed ([#21481](https://github.com/aws/aws-cdk/issues/21481)) ([2e97dfe](https://github.com/aws/aws-cdk/commit/2e97dfe81a9aef09f41648578d7b41c00f8c58e6))

## [2.35.0](https://github.com/aws/aws-cdk/compare/v2.34.2...v2.35.0) (2022-08-02)


### Features

* **config:** add support for eks-cluster-xxx-version managed rule ([#21344](https://github.com/aws/aws-cdk/issues/21344)) ([82e8100](https://github.com/aws/aws-cdk/commit/82e81008c08669429c19c5b864292b256aaf976e)), closes [#21254](https://github.com/aws/aws-cdk/issues/21254)
* **core:** cache fingerprints of large assets ([#21321](https://github.com/aws/aws-cdk/issues/21321)) ([17f1ec8](https://github.com/aws/aws-cdk/commit/17f1ec881ba8fb300bd4cf8674a87640ab05c31a)), closes [#21297](https://github.com/aws/aws-cdk/issues/21297)
* **ec2:** add missing endpoints to InterfaceVpcEndpointAwsService ([#21401](https://github.com/aws/aws-cdk/issues/21401)) ([c64cccb](https://github.com/aws/aws-cdk/commit/c64cccb0f17d014f978b8df38f47dcfa254c89e6)), closes [#21402](https://github.com/aws/aws-cdk/issues/21402) [#21220](https://github.com/aws/aws-cdk/issues/21220) [#21338](https://github.com/aws/aws-cdk/issues/21338) [#19420](https://github.com/aws/aws-cdk/issues/19420)
* **events-targets:** add dlq support for ecs target ([#21396](https://github.com/aws/aws-cdk/issues/21396)) ([e82ba52](https://github.com/aws/aws-cdk/commit/e82ba52ac5c27863cc30309502ecd45810f96803)), closes [#21118](https://github.com/aws/aws-cdk/issues/21118)
* **fsx:** support AutoImportPolicy in LustreFilesystem ([#21301](https://github.com/aws/aws-cdk/issues/21301)) ([b1ce472](https://github.com/aws/aws-cdk/commit/b1ce472ed2a15480980286f21a028fdc20cdb91d))
* **fsx:** support DataCompressionType in LustreConfiguration ([#21392](https://github.com/aws/aws-cdk/issues/21392)) ([214a792](https://github.com/aws/aws-cdk/commit/214a7921616fa2cf3031e17cc26308772878fefd)), closes [#16431](https://github.com/aws/aws-cdk/issues/16431)
* **opensearch:** add support for latest amazon opensearch service 1.3 ([#21413](https://github.com/aws/aws-cdk/issues/21413)) ([aa55715](https://github.com/aws/aws-cdk/commit/aa5571532f046158cde3da6080a8b19d9b1339e0)), closes [#21414](https://github.com/aws/aws-cdk/issues/21414)
* **pipelines:** allow use of custom role for pipeline ([#21299](https://github.com/aws/aws-cdk/issues/21299)) ([ff3c01a](https://github.com/aws/aws-cdk/commit/ff3c01a85d1bd32c149e83fda5bf44ec3253e99d)), closes [#21412](https://github.com/aws/aws-cdk/issues/21412)
* **rds:** add copyTagsToSnapshot to the construct props for ServerlessCluster and ServerlessClusterFromSnapshot ([#21056](https://github.com/aws/aws-cdk/issues/21056)) ([47333a1](https://github.com/aws/aws-cdk/commit/47333a12f83fbac6c8174bd7fe13f1e41159f8ae)), closes [#20968](https://github.com/aws/aws-cdk/issues/20968)


### Bug Fixes

* **appmesh:** routes with weight 0 are assigned a weight of 1 ([#21400](https://github.com/aws/aws-cdk/issues/21400)) ([fa0341f](https://github.com/aws/aws-cdk/commit/fa0341f9caceff040a1af5b6ee7b4f8a736d02bf))
* **cognito:** UserPoolClient doesn't correctly respect authFlows ([#21386](https://github.com/aws/aws-cdk/issues/21386)) ([daf178a](https://github.com/aws/aws-cdk/commit/daf178aa38632c9b830c20924a77b27b04698ce9)), closes [#16236](https://github.com/aws/aws-cdk/issues/16236)
* **core:** asset fingerprint cache invalidation incorrectly uses mtime ([#21374](https://github.com/aws/aws-cdk/issues/21374)) ([65a210a](https://github.com/aws/aws-cdk/commit/65a210aaaf8f45095170bca7779fd274aab54a00)), closes [#21321](https://github.com/aws/aws-cdk/issues/21321)
* **ecs:** ec2Service placement strategies use incorrect casing which causes drift ([#20946](https://github.com/aws/aws-cdk/issues/20946)) ([715158f](https://github.com/aws/aws-cdk/commit/715158f44ae1576361b93ec529f09d7dc0472c3b)), closes [#20812](https://github.com/aws/aws-cdk/issues/20812)
* **ecs:** new arn format not supported (under feature flag) ([#18140](https://github.com/aws/aws-cdk/issues/18140)) ([9749a57](https://github.com/aws/aws-cdk/commit/9749a5725c4f5cb13313a3d28d6b52e85c59548b)), closes [#16634](https://github.com/aws/aws-cdk/issues/16634) [#18137](https://github.com/aws/aws-cdk/issues/18137)
* **eks:** cannot disable cluster logging once it has been enabled ([#21185](https://github.com/aws/aws-cdk/issues/21185)) ([e41b073](https://github.com/aws/aws-cdk/commit/e41b073415bf68c8862219242d8f92c7fb6c16bb)), closes [#18112](https://github.com/aws/aws-cdk/issues/18112) [#20707](https://github.com/aws/aws-cdk/issues/20707) [#19898](https://github.com/aws/aws-cdk/issues/19898)
* **events:** archive construct does not have defaultChild set ([#21345](https://github.com/aws/aws-cdk/issues/21345)) ([de7d825](https://github.com/aws/aws-cdk/commit/de7d825a32e7d4ab7fd168ee61eb4243d87f41ff)), closes [#21263](https://github.com/aws/aws-cdk/issues/21263)


### Reverts

* **cli:** cannot pass objects and numbers as context arguments ([#21387](https://github.com/aws/aws-cdk/issues/21387)) ([2fa85b9](https://github.com/aws/aws-cdk/commit/2fa85b99d643cd35c9685a0bd7d857ffdf55c486)), closes [aws/aws-cdk#20068](https://github.com/aws/aws-cdk/issues/20068)

## [2.34.2](https://github.com/aws/aws-cdk/compare/v2.34.1...v2.34.2) (2022-07-29)

### Bug Fixes

* **cli:** context value type conversion causing parse failures ([21381](https://github.com/aws/aws-cdk/issues/21381))

## [2.34.1](https://github.com/aws/aws-cdk/compare/v2.34.0...v2.34.1) (2022-07-29)

### Bug Fixes

* Revert to `jsii-pacmak@1.62.0` as dynamic runtime type-checking it introduced for Python results in incorrect code being produced.

## [2.34.0](https://github.com/aws/aws-cdk/compare/v2.33.0...v2.34.0) (2022-07-28)


### Features

* **api-gateway:** allow configuration of deployment description ([#21207](https://github.com/aws/aws-cdk/issues/21207)) ([03fc2bd](https://github.com/aws/aws-cdk/commit/03fc2bdbff5b3678e02b1017c575a681d5b9f786))
* **cfnspec:** cloudformation spec v81.1.0 ([#21307](https://github.com/aws/aws-cdk/issues/21307)) ([1f91112](https://github.com/aws/aws-cdk/commit/1f9111249b3955286dd42aa0c647ec0bdace12d9))
* **cli:** cannot pass objects and numbers as context arguments  ([#20068](https://github.com/aws/aws-cdk/issues/20068)) ([ec2d68a](https://github.com/aws/aws-cdk/commit/ec2d68a933342bd1ce0601ab25e677806e1ec4bd))
* **ec2:** add R6A instances ([#21257](https://github.com/aws/aws-cdk/issues/21257)) ([f66f94e](https://github.com/aws/aws-cdk/commit/f66f94e9201b9c9d5e0f1b713a6f30194b323b28))
* **ecs:** add function to grant run permissions to task definition ([#21241](https://github.com/aws/aws-cdk/issues/21241)) ([d7ac3bb](https://github.com/aws/aws-cdk/commit/d7ac3bb1dbe56e6268c74f5853420296596d5793)), closes [#20281](https://github.com/aws/aws-cdk/issues/20281)
* **lambda-event-sources:** add AT_TIMESTAMP event source mapping starting position ([#20741](https://github.com/aws/aws-cdk/issues/20741)) ([76e0768](https://github.com/aws/aws-cdk/commit/76e0768f6d69b555925bb3c016861f517a01ecae))


### Bug Fixes

* **aws-lambda:** FunctionUrl incorrectly uses Alias ARNs ([#21353](https://github.com/aws/aws-cdk/issues/21353)) ([2904d2a](https://github.com/aws/aws-cdk/commit/2904d2a53c2fe7d19e5839fc3fe6c9e94e7971c9))
* **bootstrap:** remove image scanning configuration ([#21342](https://github.com/aws/aws-cdk/issues/21342)) ([2d26916](https://github.com/aws/aws-cdk/commit/2d269165b56c3fb19a75138be9109ca7a44137ac))
* **cli:** add validation of --notification-arns structure ([#21270](https://github.com/aws/aws-cdk/issues/21270)) ([6d157d1](https://github.com/aws/aws-cdk/commit/6d157d1292978ad2fc4cd3fcabe874091a2cf856)), closes [#20806](https://github.com/aws/aws-cdk/issues/20806)
* **ecr:** Repository.addToResourcePolicy returns incorrect result ([#21137](https://github.com/aws/aws-cdk/issues/21137)) ([5435215](https://github.com/aws/aws-cdk/commit/54352150da814fd3c6c347d102b8b30b340a156d))
* **ecs:** firelens configFileValue is unnecessarily required ([#20636](https://github.com/aws/aws-cdk/issues/20636)) ([b79b2e4](https://github.com/aws/aws-cdk/commit/b79b2e4702c77a56f24e516702e7f69d59d9284f))
* **ecs-patterns:** memory limit is not set at the container level ([#21201](https://github.com/aws/aws-cdk/issues/21201)) ([f2098b7](https://github.com/aws/aws-cdk/commit/f2098b727534f90323f9571bcded7390710eb48f))
* **pkglint:** allow dependencies on L1 only modules ([#21208](https://github.com/aws/aws-cdk/issues/21208)) ([f16fd69](https://github.com/aws/aws-cdk/commit/f16fd69f51b817f7715d007992af24fc87ca2201))

## [2.33.0](https://github.com/aws/aws-cdk/compare/v2.32.1...v2.33.0) (2022-07-19)


### Features

* **cfnspec:** cloudformation spec v80.0.0 ([#21159](https://github.com/aws/aws-cdk/issues/21159)) ([db4524a](https://github.com/aws/aws-cdk/commit/db4524a3ea930fc286d83f5ff19071f74b69efeb))
* **cfnspec:** cloudformation spec v81.0.0 ([#21196](https://github.com/aws/aws-cdk/issues/21196)) ([7bf2433](https://github.com/aws/aws-cdk/commit/7bf24337094695e507388deb8cdf5212c3a1f7a6))
* **cli:** allow diffing against a processed template ([#19908](https://github.com/aws/aws-cdk/issues/19908)) ([cd4851a](https://github.com/aws/aws-cdk/commit/cd4851a53b75768fc352bc6255b5e9b2af20cf74))
* **cognito:** added verified attribute changes ([#21180](https://github.com/aws/aws-cdk/issues/21180)) ([ad67594](https://github.com/aws/aws-cdk/commit/ad67594a9304aa5a5aa2f9736143577cf6e0ad52)), closes [#21179](https://github.com/aws/aws-cdk/issues/21179)
* **ec2:** add ICMPv6 protocol  ([#20626](https://github.com/aws/aws-cdk/issues/20626)) ([99831b0](https://github.com/aws/aws-cdk/commit/99831b09a8f58a356c66d561a971290b840cda6d))
* **ecs-patterns:** add capacityProviderStrategies props to (Application/Network)LoadBalanced(Ec2/Fargate)Service ([#20879](https://github.com/aws/aws-cdk/issues/20879)) ([1f0656e](https://github.com/aws/aws-cdk/commit/1f0656e65cd34f66d42814e5523e0cfd943794d5)), closes [#18868](https://github.com/aws/aws-cdk/issues/18868)
* **stepfunctions:** add `fromStateMachineName` to import a state machine by resource name ([#20036](https://github.com/aws/aws-cdk/issues/20036)) ([2b5bd59](https://github.com/aws/aws-cdk/commit/2b5bd596757e27df7d7ec7f46f7ae04c58eb0467))


### Bug Fixes

* **aws-s3-assets:** support asset url with two extension name like tar.gz ([#20874](https://github.com/aws/aws-cdk/issues/20874)) ([673b0d1](https://github.com/aws/aws-cdk/commit/673b0d162b1c8b3ad6d4b3518bdf12bf9702c4de)), closes [#12699](https://github.com/aws/aws-cdk/issues/12699)
* **cfn-include:** preserve unrecognized resource attributes ([#19920](https://github.com/aws/aws-cdk/issues/19920)) ([f7f23a7](https://github.com/aws/aws-cdk/commit/f7f23a7f418aa2e4c694c008f3d8895a8f74101b))
* **cli:** CLI timeout fetching notices prints "unreachable" branch error message ([#20308](https://github.com/aws/aws-cdk/issues/20308)) ([7c4cd96](https://github.com/aws/aws-cdk/commit/7c4cd96dfeea8d4eec5fa140c6fcf026a482756f)), closes [#20069](https://github.com/aws/aws-cdk/issues/20069) [/github.com/aws/aws-cdk/blob/fd306ee05cfa7ebaa8d997007500d89d62868897/packages/aws-cdk/lib/notices.ts#L148-L154](https://github.com/aws//github.com/aws/aws-cdk/blob/fd306ee05cfa7ebaa8d997007500d89d62868897/packages/aws-cdk/lib/notices.ts/issues/L148-L154)
* **core:** CustomResourceProvider assets are staged in node_modules ([#20953](https://github.com/aws/aws-cdk/issues/20953)) ([901b225](https://github.com/aws/aws-cdk/commit/901b225f170555e766d4763d57c11b4a03b75ed3))
* integration test for appsync apikey auth fails with out of bound API key expiration ([#21198](https://github.com/aws/aws-cdk/issues/21198)) ([37a44d7](https://github.com/aws/aws-cdk/commit/37a44d7a86e1e63c186bb81d90ec359f2a1633f4))


## [2.32.1](https://github.com/aws/aws-cdk/compare/v2.32.0...v2.32.1) (2022-07-15)


### Bug Fixes

* **cli:** pin geonamescache dependency to 1.3 (backport [#21152](https://github.com/aws/aws-cdk/issues/21152)) ([#21157](https://github.com/aws/aws-cdk/issues/21157)) ([32846f9](https://github.com/aws/aws-cdk/commit/32846f9680e39813f6ff299339aa060b1840ec73))


### Reverts

* **core:** revert "fix(core): use node.path in skip bundling check for consistency with cdk deploy CLI" ([#21174](https://github.com/aws/aws-cdk/issues/21174)) ([05ac2d8](https://github.com/aws/aws-cdk/commit/05ac2d841b124f341302070c63b80764ffcf8464)), closes [#19950](https://github.com/aws/aws-cdk/issues/19950)

## [2.32.0](https://github.com/aws/aws-cdk/compare/v2.31.2...v2.32.0) (2022-07-14)


### Features

* **backup:** support RDS database cluster and serverless cluster ([#17971](https://github.com/aws/aws-cdk/issues/17971)) ([53a6a47](https://github.com/aws/aws-cdk/commit/53a6a479bf7cd5ae58b29762cde8b371c03f7864)), closes [#16457](https://github.com/aws/aws-cdk/issues/16457)
* **backup:** vault lock ([#21105](https://github.com/aws/aws-cdk/issues/21105)) ([a25677b](https://github.com/aws/aws-cdk/commit/a25677bd6d3931b1b522f5ff0859693fe6dc855d)), closes [#21076](https://github.com/aws/aws-cdk/issues/21076)
* **cfnspec:** cloudformation spec v79.0.0 ([#21053](https://github.com/aws/aws-cdk/issues/21053)) ([68f09b7](https://github.com/aws/aws-cdk/commit/68f09b7c6f8e6c1ddf13fdd4e116d12333d24c46))
* **cli:** --force flag and glob-style key matches for context --reset ([#19890](https://github.com/aws/aws-cdk/issues/19890)) ([39a7c1f](https://github.com/aws/aws-cdk/commit/39a7c1f0bafb1cf3f51fbe09053e443c0d87487e)), closes [#19840](https://github.com/aws/aws-cdk/issues/19840) [#19888](https://github.com/aws/aws-cdk/issues/19888)
* **codebuild:** add support for new codebuild images ([#20992](https://github.com/aws/aws-cdk/issues/20992)) ([9f3d71c](https://github.com/aws/aws-cdk/commit/9f3d71c622203d14f6763221a70e36a8a314393c)), closes [#20960](https://github.com/aws/aws-cdk/issues/20960)
* **core:** add a description parameter for the NestedStackProps ([#20930](https://github.com/aws/aws-cdk/issues/20930)) ([5ef106b](https://github.com/aws/aws-cdk/commit/5ef106b9fbfcaccb0d22b84feebc79b59ff7eea0)), closes [#16337](https://github.com/aws/aws-cdk/issues/16337)
* **ec2:** expose interface endpoint service shortname ([#20965](https://github.com/aws/aws-cdk/issues/20965)) ([ebfbf54](https://github.com/aws/aws-cdk/commit/ebfbf54cd669c6c4fc9f0dfa066e23730a171253))
* **rds:** support rolling instance updates to reduce downtime ([#20054](https://github.com/aws/aws-cdk/issues/20054)) ([86790b6](https://github.com/aws/aws-cdk/commit/86790b632a997645970f310ac222fc52e3e58a47)), closes [#10595](https://github.com/aws/aws-cdk/issues/10595) [#10595](https://github.com/aws/aws-cdk/issues/10595)
* **secretsmanager:** create secret with secretObjectValue ([#21091](https://github.com/aws/aws-cdk/issues/21091)) ([5f0eff2](https://github.com/aws/aws-cdk/commit/5f0eff291b2cac6f2fbddfbe84d06f3a92f70c1d)), closes [#20461](https://github.com/aws/aws-cdk/issues/20461)
* **ses:** DedicatedIpPool, ConfigurationSet and EmailIdentity ([#20997](https://github.com/aws/aws-cdk/issues/20997)) ([541ce1b](https://github.com/aws/aws-cdk/commit/541ce1b46e5e21764d5f58ef73f46946bfd68cd7))
* **stepfunctions-tasks:** support parameters in StepFunctionsInvokeActivity ([#21077](https://github.com/aws/aws-cdk/issues/21077)) ([10f8821](https://github.com/aws/aws-cdk/commit/10f8821275c4db0377d11662e1d14dff1dec2f5d)), closes [#21020](https://github.com/aws/aws-cdk/issues/21020)


### Bug Fixes

* **apigateway:** serialization exception with step functions integration ([#20169](https://github.com/aws/aws-cdk/issues/20169)) ([6640338](https://github.com/aws/aws-cdk/commit/6640338823738017b35cdaa391243aa5782e0bcf))
* **aws-ec2:** flow log destinationOptions requires all properties ([#21042](https://github.com/aws/aws-cdk/issues/21042)) ([0a76009](https://github.com/aws/aws-cdk/commit/0a76009cae7c89f3563ac56a8d19dfaf92f2a83f)), closes [#20765](https://github.com/aws/aws-cdk/issues/20765) [/docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-flowlog.html#cfn-ec2](https://github.com/aws//docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-flowlog.html/issues/cfn-ec2) [#21037](https://github.com/aws/aws-cdk/issues/21037)
* **aws-eks:** cap generated stack names at 128 characters ([#20528](https://github.com/aws/aws-cdk/issues/20528)) ([6e9963c](https://github.com/aws/aws-cdk/commit/6e9963c38e091b37a097f176eae2854ab907ae40)), closes [#20124](https://github.com/aws/aws-cdk/issues/20124)
* **cli:** `--no-fail` flag is ignored in favor of the `enableDiffNoFail` feature flag ([#21107](https://github.com/aws/aws-cdk/issues/21107)) ([cad6fc5](https://github.com/aws/aws-cdk/commit/cad6fc5f0f6d963152ede3101d36d085e399f99a))
* **cli:** CLI errors when run as a non-existent user ([#21018](https://github.com/aws/aws-cdk/issues/21018)) ([e6015a9](https://github.com/aws/aws-cdk/commit/e6015a9ec857ad13cb1d71f8e0aa003e9327d49b)), closes [#7937](https://github.com/aws/aws-cdk/issues/7937)
* **core:** entrypoint option never used ([#21124](https://github.com/aws/aws-cdk/issues/21124)) ([e123087](https://github.com/aws/aws-cdk/commit/e1230877d86fcec9bc3e18c0afce860dd08b33c2))
* **core:** updatedProperties function name is misspelled ([#21071](https://github.com/aws/aws-cdk/issues/21071)) ([7b389f0](https://github.com/aws/aws-cdk/commit/7b389f0e6ab123622677efb48c550ca6050d18bc))
* **core:** use node.path in skip bundling check for consistency with cdk deploy CLI ([#19950](https://github.com/aws/aws-cdk/issues/19950)) ([5cff2d9](https://github.com/aws/aws-cdk/commit/5cff2d9d28c4be0bb72b0febd3f30311252f57f8)), closes [#19927](https://github.com/aws/aws-cdk/issues/19927) [/github.com/aws/aws-cdk/blob/1d0270446b3effa6b8518de3c7d76f0c14e626c5/packages/aws-cdk/lib/api/cxapp/cloud-assembly.ts#L138](https://github.com/aws//github.com/aws/aws-cdk/blob/1d0270446b3effa6b8518de3c7d76f0c14e626c5/packages/aws-cdk/lib/api/cxapp/cloud-assembly.ts/issues/L138) [aws-cdk/cx-api/lib/cloud-artifact.ts#L143-L145](https://github.com/aws-cdk/cx-api/lib/cloud-artifact.ts/issues/L143-L145) [aws-cdk/core/lib/stack-synthesizers/_shared.ts#L66](https://github.com/aws-cdk/core/lib/stack-synthesizers/_shared.ts/issues/L66)
* **ec2:** deprecated `SubnetType` enums are treated incorrectly ([#21140](https://github.com/aws/aws-cdk/issues/21140)) ([0b5123a](https://github.com/aws/aws-cdk/commit/0b5123ada8c7dfdfe6f55ec8882b6fccc3a5168d))
* **events-targets:** api destination target ignores pathParameterValues and queryStringParameters ([#21111](https://github.com/aws/aws-cdk/issues/21111)) ([8446c5c](https://github.com/aws/aws-cdk/commit/8446c5ceb7e400966e573bccaea40378541b0579)), closes [#21101](https://github.com/aws/aws-cdk/issues/21101)
* **iam:** `conditions` parameters accept array values ([#21009](https://github.com/aws/aws-cdk/issues/21009)) ([0aad6c9](https://github.com/aws/aws-cdk/commit/0aad6c988f434403eb2fd946d735d1d40b4a1ca7)), closes [#20974](https://github.com/aws/aws-cdk/issues/20974)
* **kms:** correctly recognize newly created resources ([#21143](https://github.com/aws/aws-cdk/issues/21143)) ([0cd83cc](https://github.com/aws/aws-cdk/commit/0cd83ccf6ec8d72f39cc4b8b066c8f4184174f90)), closes [#19881](https://github.com/aws/aws-cdk/issues/19881)
* **logs:** `ResourcePolicy` does not have a `defaultChild` ([#21039](https://github.com/aws/aws-cdk/issues/21039)) ([4076153](https://github.com/aws/aws-cdk/commit/4076153a1716a25db284c09521ace4b4233d1e43))
* **pipelines:** cannot publish assets to more than 35 environments ([#21010](https://github.com/aws/aws-cdk/issues/21010)) ([4b4af84](https://github.com/aws/aws-cdk/commit/4b4af8475400390dfdeee709961d7ee885358142))
* **pipelines:** reuseCrossRegionSupportStacks=true does not fail when existing pipeline is used ([#20423](https://github.com/aws/aws-cdk/issues/20423)) ([9c0ccca](https://github.com/aws/aws-cdk/commit/9c0ccca817ace858457717f07c29575cd231a461))
* **route53:** publichostedzone import returns IHostedZone instead of IPublicHostedZone ([#21007](https://github.com/aws/aws-cdk/issues/21007)) ([588ddf1](https://github.com/aws/aws-cdk/commit/588ddf1b509029c70eaf60d0cd852bdc834a3caa)), closes [#21004](https://github.com/aws/aws-cdk/issues/21004)
* **sns-subscriptions:** restrict encryption of queue to only the respective sns topic (under feature flag) ([#20521](https://github.com/aws/aws-cdk/issues/20521)) ([4e0c80f](https://github.com/aws/aws-cdk/commit/4e0c80f89353731edc6d5f7aba6539a4f340296c)), closes [#20339](https://github.com/aws/aws-cdk/issues/20339)
* flowlog has no default child ([#21045](https://github.com/aws/aws-cdk/issues/21045)) ([b025abc](https://github.com/aws/aws-cdk/commit/b025abc43b483df958fdf886f5617aeaaffb85e3))
* **triggers:** permissions race condition ([#19455](https://github.com/aws/aws-cdk/issues/19455)) ([8ebb81b](https://github.com/aws/aws-cdk/commit/8ebb81bc61153e0578ff9a31520615e62c745781))

## [2.31.2](https://github.com/aws/aws-cdk/compare/v2.31.1...v2.31.2) (2022-07-13)


### Bug Fixes

* **custom-resources:** Custom resource provider framework not passing `ResponseURL` to user function ([#21117](https://github.com/aws/aws-cdk/issues/21117)) ([f00f952](https://github.com/aws/aws-cdk/commit/f00f95213cbe31d0e78a01b3ada8a68eeda55efa)), closes [aws#21065](https://github.com/aws/aws/issues/21065) [aws#21109](https://github.com/aws/aws/issues/21109) [aws#21058](https://github.com/aws/aws/issues/21058)

## [2.31.1](https://github.com/aws/aws-cdk/compare/v2.31.0...v2.31.1) (2022-07-08)


### Bug Fixes

* **custom-resources:** Custom resource provider framework not passing `ResponseURL` to user function ([#21065](https://github.com/aws/aws-cdk/issues/21065)) ([f7b25b6](https://github.com/aws/aws-cdk/commit/f7b25b671003b8d6c7400811484beb4284bebacb)), closes [#21058](https://github.com/aws/aws-cdk/issues/21058)

## [2.31.0](https://github.com/aws/aws-cdk/compare/v2.30.0...v2.31.0) (2022-07-06)


### Features

* **autoscaling:** step scaling policy supports estimatedInstanceWarmup property ([#20936](https://github.com/aws/aws-cdk/issues/20936)) ([e4c7b97](https://github.com/aws/aws-cdk/commit/e4c7b9770573e3c102e4be0c2ba0378a0b2b8767))
* **aws-s3:** create default bucket policy when required (under feature flag) ([#20765](https://github.com/aws/aws-cdk/issues/20765)) ([cefa453](https://github.com/aws/aws-cdk/commit/cefa453bb3f98eb9c3f894c308ae703522de8f22)), closes [/docs.aws.amazon.com/AmazonCloudWatch/latest/logs/AWS-logs-and-resource-policy.html#AWS-logs-infrastructure-S3](https://github.com/aws//docs.aws.amazon.com/AmazonCloudWatch/latest/logs/AWS-logs-and-resource-policy.html/issues/AWS-logs-infrastructure-S3) [#18816](https://github.com/aws/aws-cdk/issues/18816)
* **cfnspec:** cloudformation spec v78.1.0 ([#20952](https://github.com/aws/aws-cdk/issues/20952)) ([20d6e09](https://github.com/aws/aws-cdk/commit/20d6e0980ba9483fb0187a8cf5a256f5b59a7ba8))
* **dynamodb:** imported tables always grant permissions for indexes ([#20682](https://github.com/aws/aws-cdk/issues/20682)) ([4d003a5](https://github.com/aws/aws-cdk/commit/4d003a50ae96a6c2be915edc2f6ca09eeb747fd5)), closes [#13703](https://github.com/aws/aws-cdk/issues/13703)
* **ec2:** add additional instance type classes ([#20972](https://github.com/aws/aws-cdk/issues/20972)) ([400ad91](https://github.com/aws/aws-cdk/commit/400ad91cb926fb0a6d71039f8eba3bb63e7c8ca8)), closes [#20924](https://github.com/aws/aws-cdk/issues/20924)
* **s3:** Event Bridge notification can be enabled after the bucket is created ([#20913](https://github.com/aws/aws-cdk/issues/20913)) ([b0b7a32](https://github.com/aws/aws-cdk/commit/b0b7a3217b1c110bcbe4580addf1ae2865ebfdf5))


### Bug Fixes

* **cli:** standard log messages are sent to stderr when CI=true ([#20957](https://github.com/aws/aws-cdk/issues/20957)) ([277340d](https://github.com/aws/aws-cdk/commit/277340d4a67f81d3b80907e1899001d091780698)), closes [#7717](https://github.com/aws/aws-cdk/issues/7717)
* **cloudfront:** fromOriginAccessIdentityName is a misnomer ([#20772](https://github.com/aws/aws-cdk/issues/20772)) ([3e58e5a](https://github.com/aws/aws-cdk/commit/3e58e5a3c5e12a859e4076b867444980d4b1e8e9)), closes [#20141](https://github.com/aws/aws-cdk/issues/20141)
* **eks:** latest `AlbController` version isn't compatible with the chart version  ([#20826](https://github.com/aws/aws-cdk/issues/20826)) ([43a0cec](https://github.com/aws/aws-cdk/commit/43a0cec380f39618f18f15da8c60cb0a4a769d37))
* **route53:** cannot delete existing alias record ([#20858](https://github.com/aws/aws-cdk/issues/20858)) ([22681b1](https://github.com/aws/aws-cdk/commit/22681b1bc29ee48b3092d60cfc22726912ae607a)), closes [#20847](https://github.com/aws/aws-cdk/issues/20847)
* **stepfunctions-tasks:** SqsSendMessage is missing KMS permissions ([#20990](https://github.com/aws/aws-cdk/issues/20990)) ([52b7019](https://github.com/aws/aws-cdk/commit/52b70194c946c3074b0205318564775be10f29a8))
* custom resources log sensitive `ResponseURL` field ([#20899](https://github.com/aws/aws-cdk/issues/20899)) ([6b4f92f](https://github.com/aws/aws-cdk/commit/6b4f92f2437c7ff782c88ce23925a04168728d7c))

## [2.30.0](https://github.com/aws/aws-cdk/compare/v2.29.1...v2.30.0) (2022-07-01)

### Features

* **appmesh:** ipv6 support for app mesh ([#20766](https://github.com/aws/aws-cdk/issues/20766)) ([b1e6d62](https://github.com/aws/aws-cdk/commit/b1e6d62ed6b6ede0362d0a68d804660e84efe5cb)), closes [#20737](https://github.com/aws/aws-cdk/issues/20737)
* **cognito:** make `grant()` available on `IUserPool` ([#20799](https://github.com/aws/aws-cdk/issues/20799)) ([a1df570](https://github.com/aws/aws-cdk/commit/a1df570b89c6d456077bb934e0bf08217677ef1f)), closes [#20285](https://github.com/aws/aws-cdk/issues/20285)
* **iam:** PolicyStatements can be frozen ([#20911](https://github.com/aws/aws-cdk/issues/20911)) ([3bf737b](https://github.com/aws/aws-cdk/commit/3bf737bd172eda016d2e9bb7c5f40c001399fd23))
* **lambda:** grant function permissions to an AWS organization ([#19975](https://github.com/aws/aws-cdk/issues/19975)) ([2566017](https://github.com/aws/aws-cdk/commit/2566017a83ec4f9c2c5cefda4585a3f71e3516e7)), closes [#19538](https://github.com/aws/aws-cdk/issues/19538) [#20146](https://github.com/aws/aws-cdk/issues/20146)
* **rds:** add missing aurora postgres versions ([#20830](https://github.com/aws/aws-cdk/issues/20830)) ([2151a0e](https://github.com/aws/aws-cdk/commit/2151a0e9b988723e050e6f37ed1780cced16c519))


### Bug Fixes

* **apigateway:** Explicitly test for undefined instead of falsey for stage default options ([#20868](https://github.com/aws/aws-cdk/issues/20868)) ([b368a31](https://github.com/aws/aws-cdk/commit/b368a315cab0cedf03298083f5f1fb809bd1d1f2))
* **eks:** revert shell=True and allow public ecr to work ([#20724](https://github.com/aws/aws-cdk/issues/20724)) ([de153fc](https://github.com/aws/aws-cdk/commit/de153fcdd47a4cdcd1d156d5e19684969d990c8e))
* **pipelines:** 'ConfirmPermissionsBroadening' uses wrong node version ([#20861](https://github.com/aws/aws-cdk/issues/20861)) ([bac965e](https://github.com/aws/aws-cdk/commit/bac965e9c4d435ae45d5cf16aa809f33bbb05a0f))
* **secretsmanager:** SecretRotation app does not set DeletionPolicy ([#20901](https://github.com/aws/aws-cdk/issues/20901)) ([f2b4eff](https://github.com/aws/aws-cdk/commit/f2b4effc903ab3a36dc925516f3329f236d03a70))

## [2.29.1](https://github.com/aws/aws-cdk/compare/v2.29.0...v2.29.1) (2022-06-24)


### Bug Fixes

* **pipelines:** 'ConfirmPermissionsBroadening' uses wrong node version ([#20861](https://github.com/aws/aws-cdk/issues/20861)) ([47b5ca0](https://github.com/aws/aws-cdk/commit/47b5ca06c50a566af8d1fed4202164b85f793d18))

## [2.29.0](https://github.com/aws/aws-cdk/compare/v2.28.1...v2.29.0) (2022-06-22)


### Features

* **apigateway:** Add LambdaIntegrationOptions to LambdaRestApi ([#17065](https://github.com/aws/aws-cdk/issues/17065)) ([b117469](https://github.com/aws/aws-cdk/commit/b1174699833cff61a839eab293521e14659b00c2)), closes [#3269](https://github.com/aws/aws-cdk/issues/3269)
* **aws-eks:** allow the use of graviton3 processors ([#20543](https://github.com/aws/aws-cdk/issues/20543)) ([98b52de](https://github.com/aws/aws-cdk/commit/98b52def344881b3e119660f08260ef89409103b))
* **cfnspec:** cloudformation spec v76.0.0 ([#20726](https://github.com/aws/aws-cdk/issues/20726)) ([4dbb246](https://github.com/aws/aws-cdk/commit/4dbb2460d658fc8f734773545be6b47ebebaea5c))
* **events-targets:** Add DLQ support for SNS target ([#20062](https://github.com/aws/aws-cdk/issues/20062)) ([1148a47](https://github.com/aws/aws-cdk/commit/1148a47514450769e12a829188071592b2b3e3b6)), closes [#19741](https://github.com/aws/aws-cdk/issues/19741)
* **lambda:** inline function code can exceed 4096 bytes ([#20624](https://github.com/aws/aws-cdk/issues/20624)) ([a014c30](https://github.com/aws/aws-cdk/commit/a014c30d5727afcc48706878dc4bf77a22bb122f))
* **pipelines:** add support for caching to codebuild steps ([#20533](https://github.com/aws/aws-cdk/issues/20533)) ([81ef665](https://github.com/aws/aws-cdk/commit/81ef6650d123726ee01ec6cecba77d37244290e4)), closes [#16375](https://github.com/aws/aws-cdk/issues/16375) [#19084](https://github.com/aws/aws-cdk/issues/19084)
* **route53:** replace existing record sets ([#20416](https://github.com/aws/aws-cdk/issues/20416)) ([2f92c35](https://github.com/aws/aws-cdk/commit/2f92c35b17034859c2ec1514f3b2601d188d31c9))
* **secretsmanager:** exclude characters for hosted rotation ([#20768](https://github.com/aws/aws-cdk/issues/20768)) ([d66534a](https://github.com/aws/aws-cdk/commit/d66534a1a848083a39ffcc9161b050955f0fdc40))
* **servicediscovery:** add hostedzoneid as attribute to namespace ([#20583](https://github.com/aws/aws-cdk/issues/20583)) ([454d60f](https://github.com/aws/aws-cdk/commit/454d60fdfcf348fbc114bfdfe5c6dc8429fb0afd)), closes [#20510](https://github.com/aws/aws-cdk/issues/20510)


### Bug Fixes

* **autoscaling:** osType is wrong when using CloudformationInit with launchTemplate ([#20759](https://github.com/aws/aws-cdk/issues/20759)) ([610b7b5](https://github.com/aws/aws-cdk/commit/610b7b56462f848e4b2659ed6e821852612ece67))
* **codepipeline:** cannot deploy pipeline stack with crossAccountKeys twice (under feature flag) ([#20745](https://github.com/aws/aws-cdk/issues/20745)) ([c262034](https://github.com/aws/aws-cdk/commit/c262034afd2468c5bcf1cf47c45a70116c378d3e)), closes [#18828](https://github.com/aws/aws-cdk/issues/18828)
* **core:** CfnMapping values cannot be used in other stacks ([#20616](https://github.com/aws/aws-cdk/issues/20616)) ([f5c2284](https://github.com/aws/aws-cdk/commit/f5c2284c70b66c5cdf246f68815543a9ea85c868)), closes [#18920](https://github.com/aws/aws-cdk/issues/18920)
* **core:** Durations in the expected unit are not tested for integer-ness ([#20742](https://github.com/aws/aws-cdk/issues/20742)) ([ddb4766](https://github.com/aws/aws-cdk/commit/ddb4766785e27fbd4d672a5ff31fb07c3d3d389a))
* **events-targets:** cloudwatch logs requires specific input template ([#20748](https://github.com/aws/aws-cdk/issues/20748)) ([26ff3c7](https://github.com/aws/aws-cdk/commit/26ff3c7748dbdb1faa5d7adf30242b307db2db47)), closes [#19451](https://github.com/aws/aws-cdk/issues/19451)
* **iam:** add `defaultPolicyName` to prevent policies overwriting each other in multi-stack deployments ([#20705](https://github.com/aws/aws-cdk/issues/20705)) ([703e62e](https://github.com/aws/aws-cdk/commit/703e62e5542508f67ce9060e47b98621b3059115)), closes [#16074](https://github.com/aws/aws-cdk/issues/16074)
* **iam:** duplicate PolicyStatements lead to too many overflow policies ([#20767](https://github.com/aws/aws-cdk/issues/20767)) ([e692ad2](https://github.com/aws/aws-cdk/commit/e692ad29afa9c489829b76acfe51a42ed8b7a5a4))
* **init-templates:** unable to initialize typescript templates ([#20752](https://github.com/aws/aws-cdk/issues/20752)) ([665534d](https://github.com/aws/aws-cdk/commit/665534d63b7c3aea2fa84843dd06965c75b261e5)), closes [#20751](https://github.com/aws/aws-cdk/issues/20751)
* **route53:** improve fromHostedZoneId error message ([#20755](https://github.com/aws/aws-cdk/issues/20755)) ([2cbbb79](https://github.com/aws/aws-cdk/commit/2cbbb7929727983aa4495cbf43e0f91509c2cfed)), closes [#8406](https://github.com/aws/aws-cdk/issues/8406)

## [2.28.1](https://github.com/aws/aws-cdk/compare/v2.28.0...v2.28.1) (2022-06-15)


### Bug Fixes

* **init-templates:** unable to initialize typescript templates ([#20752](https://github.com/aws/aws-cdk/issues/20752)) ([7c06164](https://github.com/aws/aws-cdk/commit/7c061640bc829157ecdcf3fc8c470c5d5aebc3a4)), closes [#20751](https://github.com/aws/aws-cdk/issues/20751)

## [2.28.0](https://github.com/aws/aws-cdk/compare/v2.27.0...v2.28.0) (2022-06-14)


### Features

* **aws-ec2:** control over VPC AZs ([#20562](https://github.com/aws/aws-cdk/issues/20562)) ([58dffd8](https://github.com/aws/aws-cdk/commit/58dffd86f49ced2465fe2d044602a79f173a37a4)), closes [#5847](https://github.com/aws/aws-cdk/issues/5847)
* **cfnspec:** cloudformation spec v75.0.0 ([#20605](https://github.com/aws/aws-cdk/issues/20605)) ([d19e706](https://github.com/aws/aws-cdk/commit/d19e7064f4246ce0c166b40a2474b8d69fc31874))
* **cloudwatch:** add `addWidget` method in widget container classes ([#18615](https://github.com/aws/aws-cdk/issues/18615)) ([9c31446](https://github.com/aws/aws-cdk/commit/9c31446df6bbf7d15a56fc91148f4568da0093eb)), closes [#18466](https://github.com/aws/aws-cdk/issues/18466)
* **codebuild:** adds report group type property ([#20178](https://github.com/aws/aws-cdk/issues/20178)) ([15bcc3c](https://github.com/aws/aws-cdk/commit/15bcc3c5feb36f069538d89d7e6c36a2671bb2c5)), closes [#14279](https://github.com/aws/aws-cdk/issues/14279)
* **core:** allow specifying Docker build targets ([#20654](https://github.com/aws/aws-cdk/issues/20654)) ([f243f9e](https://github.com/aws/aws-cdk/commit/f243f9eb6c5dddb71488173a4cc1b45357e03623))
* **ec2:** allow the use of graviton3 processors ([#20541](https://github.com/aws/aws-cdk/issues/20541)) ([b8d6cc7](https://github.com/aws/aws-cdk/commit/b8d6cc79454b1533571e1c3f41b819523beac658))
* **ecs:** add external network modes to ExternalTaskDefinition and TaskDefinition ([#17762](https://github.com/aws/aws-cdk/issues/17762)) ([dd90feb](https://github.com/aws/aws-cdk/commit/dd90feb401899dc370d5c45a308b5657877c2feb))
* **ecs-patterns:** add ecs exec support ([#18663](https://github.com/aws/aws-cdk/issues/18663)) ([23ee450](https://github.com/aws/aws-cdk/commit/23ee450ecaff49070736d9908bcb50440fe5c3db)), closes [#15769](https://github.com/aws/aws-cdk/issues/15769) [#15197](https://github.com/aws/aws-cdk/issues/15197) [#15497](https://github.com/aws/aws-cdk/issues/15497)
* **lambda:** Migrate away from NODEJS_10_X and NODEJS_12_X to NODEJS_14_X ([#20595](https://github.com/aws/aws-cdk/issues/20595)) ([4537b3f](https://github.com/aws/aws-cdk/commit/4537b3fc1b726dd8cbaadd0c52c35b6f31328e3d)), closes [#20531](https://github.com/aws/aws-cdk/issues/20531) [#20568](https://github.com/aws/aws-cdk/issues/20568) [#19992](https://github.com/aws/aws-cdk/issues/19992) [#20474](https://github.com/aws/aws-cdk/issues/20474)
* **opensearchservice:** When a Domain has enforceHttps true, set the connections defaultPort ([#20602](https://github.com/aws/aws-cdk/issues/20602)) ([a6fe2cb](https://github.com/aws/aws-cdk/commit/a6fe2cbb5af2fe03efdc0fc364bec0fcec1148d5)), closes [#16251](https://github.com/aws/aws-cdk/issues/16251)


### Bug Fixes

* **core:** property overrides sometimes don't work with intrinsics ([#20608](https://github.com/aws/aws-cdk/issues/20608)) ([49b397c](https://github.com/aws/aws-cdk/commit/49b397c343b1a2581b2f4d2c098729b21b4b0290)), closes [#19971](https://github.com/aws/aws-cdk/issues/19971) [#19447](https://github.com/aws/aws-cdk/issues/19447)
* **core:** RemovalPolicy.SNAPSHOT can be added to resources that do not support it ([#20668](https://github.com/aws/aws-cdk/issues/20668)) ([d035c5a](https://github.com/aws/aws-cdk/commit/d035c5ad36b5109825ff401c8327d1dc405ab41e)), closes [#20653](https://github.com/aws/aws-cdk/issues/20653)
* **eks:** add clusterLogging props to Fargate Cluster ([#20707](https://github.com/aws/aws-cdk/issues/20707)) ([1882d7c](https://github.com/aws/aws-cdk/commit/1882d7c14745ab60cb633c232c8c4d0f1eaafd82)), closes [#19302](https://github.com/aws/aws-cdk/issues/19302)
* **events:** eventSourceName does not accept tokens ([#20719](https://github.com/aws/aws-cdk/issues/20719)) ([9b36f2e](https://github.com/aws/aws-cdk/commit/9b36f2eeed7c48a0a8e6b41518d0e8d198092821)), closes [#20718](https://github.com/aws/aws-cdk/issues/20718) [#10772](https://github.com/aws/aws-cdk/issues/10772)
* **iam:** conditions in FederatedPrincipal should be optional ([#20621](https://github.com/aws/aws-cdk/issues/20621)) ([8c388a8](https://github.com/aws/aws-cdk/commit/8c388a8e78bae6da4e4d4ab42bc7825700839277))
* **lambda:** deprecate Python3.6 ([#19988](https://github.com/aws/aws-cdk/issues/19988)) ([#20647](https://github.com/aws/aws-cdk/issues/20647)) ([c8f5cd2](https://github.com/aws/aws-cdk/commit/c8f5cd24c3b52b55eea1b19e71bdc1b8eae68627)), closes [#20085](https://github.com/aws/aws-cdk/issues/20085)
* **servicecatalog:** ProductStackHistory does not accept nested directories ([#20688](https://github.com/aws/aws-cdk/issues/20688)) ([d4fdb4e](https://github.com/aws/aws-cdk/commit/d4fdb4eab834e5cbdb7df45f56dde1e3243ca856)), closes [#20658](https://github.com/aws/aws-cdk/issues/20658)

## [2.27.0](https://github.com/aws/aws-cdk/compare/v2.26.0...v2.27.0) (2022-06-02)


### ⚠ BREAKING CHANGES TO EXPERIMENTAL FEATURES

* **core:** so this PR attempts to smooth a rough edge by "locking"
the `logicalId` when `exportValue` is called. If the user attempts to
override the id _after_ that point, an error message will be thrown

### Features

* **cfnspec:** cloudformation spec v73.1.0 (backport [#20587](https://github.com/aws/aws-cdk/issues/20587)) ([#20592](https://github.com/aws/aws-cdk/issues/20592)) ([01711e8](https://github.com/aws/aws-cdk/commit/01711e863404902146e5b10f7289c7c66e7d8310))
* **cognito:** OpenID Connect identity provider ([#20241](https://github.com/aws/aws-cdk/issues/20241)) ([33acc7c](https://github.com/aws/aws-cdk/commit/33acc7cc03c4a6700c05e840393ef90e5d8f68dc))
* **core:** `addToRolePolicy()` for custom resource provider ([#20449](https://github.com/aws/aws-cdk/issues/20449)) ([7f2fccc](https://github.com/aws/aws-cdk/commit/7f2fccc431f89e505608f8d65a75a5cb24b77bd6))
* **lambda:** add insights version 1.0.135.0 ([#19588](https://github.com/aws/aws-cdk/issues/19588)) ([68761dc](https://github.com/aws/aws-cdk/commit/68761dc3ceadbe77e241fb85544e48544149568a)), closes [/docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Lambda-Insights-extension-versionsx86-64.html#Lambda-Insights-extension-1](https://github.com/aws//docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Lambda-Insights-extension-versionsx86-64.html/issues/Lambda-Insights-extension-1) [/docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Lambda-Insights-extension-versionsARM.html#Lambda-Insights-extension-ARM-1](https://github.com/aws//docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Lambda-Insights-extension-versionsARM.html/issues/Lambda-Insights-extension-ARM-1)
* **pipelines:** pass role to s3 source action ([#20576](https://github.com/aws/aws-cdk/issues/20576)) ([e2768e8](https://github.com/aws/aws-cdk/commit/e2768e8a3eeda8b85f62aa1c77be73f9c96da1af)), closes [#20556](https://github.com/aws/aws-cdk/issues/20556)
* **s3:** adds objectSizeLessThan property for s3 lifecycle rule ([#20429](https://github.com/aws/aws-cdk/issues/20429)) ([2bf30df](https://github.com/aws/aws-cdk/commit/2bf30df223cc5bb43c2fcfaaf32669a8438ad19a)), closes [#20425](https://github.com/aws/aws-cdk/issues/20425) [#20372](https://github.com/aws/aws-cdk/issues/20372)


### Bug Fixes

* **core:** logicalId is consumed prior to being overridden ([#20560](https://github.com/aws/aws-cdk/issues/20560)) ([e44c2c4](https://github.com/aws/aws-cdk/commit/e44c2c436d41a9993714d7e9ff5a9ed95b5677f1)), closes [#14335](https://github.com/aws/aws-cdk/issues/14335)
* **ecr-assets:** cannot build ARM images using modern stack synthesis ([#20563](https://github.com/aws/aws-cdk/issues/20563)) ([9a23575](https://github.com/aws/aws-cdk/commit/9a23575f4590a170caf79f4141c16adf431e7c40)), closes [#20439](https://github.com/aws/aws-cdk/issues/20439)
* **ecs:** canContainersAccessInstanceRole is ignored when passed in AsgCapacityProvider constructor ([#20522](https://github.com/aws/aws-cdk/issues/20522)) ([dacefd6](https://github.com/aws/aws-cdk/commit/dacefd6c4770f06390f853fdf4703d8662beb3f5)), closes [#20293](https://github.com/aws/aws-cdk/issues/20293) [#20293](https://github.com/aws/aws-cdk/issues/20293)
* **ecs:** fix typo from fromServiceAtrributes to fromServiceAttributes ([#20456](https://github.com/aws/aws-cdk/issues/20456)) ([f4439ce](https://github.com/aws/aws-cdk/commit/f4439ceda079dd762ec30c6f4a893d6bcd7ed100)), closes [#20458](https://github.com/aws/aws-cdk/issues/20458)
* **events-targets:** EventBus IAM statements are only added for the first target ([#20479](https://github.com/aws/aws-cdk/issues/20479)) ([74318c7](https://github.com/aws/aws-cdk/commit/74318c7d22bfc00de9e005f68a0a6aaa58c7db39)), closes [#19407](https://github.com/aws/aws-cdk/issues/19407)
* **iam:** referencing the same immutable role twice makes it mutable ([#20497](https://github.com/aws/aws-cdk/issues/20497)) ([264c02e](https://github.com/aws/aws-cdk/commit/264c02e6014552cd73f38acef0df2205811d6c86)), closes [#7255](https://github.com/aws/aws-cdk/issues/7255)
* **lambda:** function version ignores layer version changes ([#20150](https://github.com/aws/aws-cdk/issues/20150)) ([f19ecef](https://github.com/aws/aws-cdk/commit/f19ecefcdde712dfd951106bec3b1f850b66f2a8)), closes [#19098](https://github.com/aws/aws-cdk/issues/19098)
* **rds:** clusters created from snapshots generate incorrect passwords ([#20504](https://github.com/aws/aws-cdk/issues/20504)) ([4a87d39](https://github.com/aws/aws-cdk/commit/4a87d39cafc64bc038d75db71673f22bc75eac04)), closes [#20434](https://github.com/aws/aws-cdk/issues/20434) [#20473](https://github.com/aws/aws-cdk/issues/20473)
* Default username in RoleSessionName ([#20188](https://github.com/aws/aws-cdk/issues/20188)) ([b7bc10c](https://github.com/aws/aws-cdk/commit/b7bc10cc7a734fe3b4a9194dffbc017f2fe3ef43)), closes [#19401](https://github.com/aws/aws-cdk/issues/19401) [#7937](https://github.com/aws/aws-cdk/issues/7937) [#19401](https://github.com/aws/aws-cdk/issues/19401)

## [2.26.0](https://github.com/aws/aws-cdk/compare/v2.25.0...v2.26.0) (2022-05-27)


### Features

* **aws-ecr-assets:** support the --platform option when building docker images ([#20439](https://github.com/aws/aws-cdk/issues/20439)) ([adc0368](https://github.com/aws/aws-cdk/commit/adc0368dc1f137aeaa4bd92de77028269e3a48f4)), closes [#12472](https://github.com/aws/aws-cdk/issues/12472) [#16770](https://github.com/aws/aws-cdk/issues/16770) [#16858](https://github.com/aws/aws-cdk/issues/16858)
* **lambda:** validate function description length ([#20476](https://github.com/aws/aws-cdk/issues/20476)) ([de027e2](https://github.com/aws/aws-cdk/commit/de027e28ce5c95e70fed8874e6531eabba24521c)), closes [#20475](https://github.com/aws/aws-cdk/issues/20475)
* **s3:** adds objectSizeGreaterThan property for s3 lifecycle rule ([#20425](https://github.com/aws/aws-cdk/issues/20425)) ([23690e4](https://github.com/aws/aws-cdk/commit/23690e40b1604839f99da8b8f96168dda8679c47)), closes [#20372](https://github.com/aws/aws-cdk/issues/20372)
* **servicecatalog:** ProductStackHistory can retain old ProductStack iterations ([#20244](https://github.com/aws/aws-cdk/issues/20244)) ([1037b8c](https://github.com/aws/aws-cdk/commit/1037b8c7f58ccd162491b49d75954c38d685d67f))


### Bug Fixes

* **core:** NestedStack defaultChild is undefined ([#20450](https://github.com/aws/aws-cdk/issues/20450)) ([0a49927](https://github.com/aws/aws-cdk/commit/0a49927e9e5bc250f339f664fa843fae2fab92ec)), closes [#11221](https://github.com/aws/aws-cdk/issues/11221)
* **iam:** Role policies cannot grow beyond 10k ([#20400](https://github.com/aws/aws-cdk/issues/20400)) ([75bfce7](https://github.com/aws/aws-cdk/commit/75bfce70dbc57fe688c96b3c5cbb67fc4e6fcc56)), closes [#19276](https://github.com/aws/aws-cdk/issues/19276) [#19939](https://github.com/aws/aws-cdk/issues/19939) [#19835](https://github.com/aws/aws-cdk/issues/19835)
* **lambda:** Fix typo in public subnet warning ([#20470](https://github.com/aws/aws-cdk/issues/20470)) ([85f4e29](https://github.com/aws/aws-cdk/commit/85f4e29e0551d71dd5f2f588584785cbc1ae7b72))
* **pipelines:** too many CodeBuild steps inflate policy size ([#20396](https://github.com/aws/aws-cdk/issues/20396)) ([f334060](https://github.com/aws/aws-cdk/commit/f334060fca02e928bc4f5fdcfd45244060731d78)), closes [#20189](https://github.com/aws/aws-cdk/issues/20189) [#19276](https://github.com/aws/aws-cdk/issues/19276) [#19939](https://github.com/aws/aws-cdk/issues/19939) [#19835](https://github.com/aws/aws-cdk/issues/19835)
* **s3-deployment:** default role does not get `PutAcl` permissions on… ([#20492](https://github.com/aws/aws-cdk/issues/20492)) ([3e6ec5c](https://github.com/aws/aws-cdk/commit/3e6ec5c48cff41cec2b32566990046fd704f4ec1))

## [2.25.0](https://github.com/aws/aws-cdk/compare/v2.24.1...v2.25.0) (2022-05-20)


### Features

* **cfnspec:** cloudformation spec v69.0.0 ([#20240](https://github.com/aws/aws-cdk/issues/20240)) ([e82b63f](https://github.com/aws/aws-cdk/commit/e82b63fc8880ecbd5e29d02e3e623cda3bbce1d6)) and ([#20331](https://github.com/aws/aws-cdk/issues/20331)) ([e9de4e9](https://github.com/aws/aws-cdk/commit/e9de4e9ab6bc44ff691238d91a8945c880a4d97c))
* **cfnspec:** cloudformation spec v72.0.0 ([#20357](https://github.com/aws/aws-cdk/issues/20357)) ([c8fd84c](https://github.com/aws/aws-cdk/commit/c8fd84c12c726e216c10380f9fe7e5d55a892cdf))
* **cli:** make ecr images immutable when created from cdk bootstrap ([#19937](https://github.com/aws/aws-cdk/issues/19937)) ([0ef4bb4](https://github.com/aws/aws-cdk/commit/0ef4bb4bf493a7e3b72b518841f676e91d014ba9)), closes [#18376](https://github.com/aws/aws-cdk/issues/18376)
* **cloudfront:** REST API origin ([#20335](https://github.com/aws/aws-cdk/issues/20335)) ([f7693e3](https://github.com/aws/aws-cdk/commit/f7693e3f981f60886c94fb61876a1e5e0f2c1a02))
* **cognito:** `grant()` for user pool ([#20285](https://github.com/aws/aws-cdk/issues/20285)) ([10d13e4](https://github.com/aws/aws-cdk/commit/10d13e4bc1841721650f9ca9b6b16e18c219ea21))
* **core:** allow disabling of LogicalID Metadata in case of large manifest ([#20433](https://github.com/aws/aws-cdk/pull/20433)) ([88ea829](https://github.com/aws/aws-cdk/commit/88ea829b5d0a64f51848474b6b9f006d1f729fb4)), closes [#20211](https://github.com/aws/aws-cdk/issues/20211)
* **ec2:** more router types ([#20151](https://github.com/aws/aws-cdk/issues/20151)) ([33b983c](https://github.com/aws/aws-cdk/commit/33b983ca76c91f182e60dcab8c6ead6be4d4712d)), closes [#19057](https://github.com/aws/aws-cdk/issues/19057) [/docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-route.html#aws-resource-ec2](https://github.com/aws//docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-route.html/issues/aws-resource-ec2)
* **iam:** validate role path at build time ([#16165](https://github.com/aws/aws-cdk/issues/16165)) ([65a5a46](https://github.com/aws/aws-cdk/commit/65a5a46837c42b2538837a699267ec9cc46ddc51)), closes [#13747](https://github.com/aws/aws-cdk/issues/13747)
* **logs:** additional log retention periods ([#20347](https://github.com/aws/aws-cdk/issues/20347)) ([734faa5](https://github.com/aws/aws-cdk/commit/734faa5ae7489a511d5a00f255d7afd408db880c)), closes [#20346](https://github.com/aws/aws-cdk/issues/20346)
* **s3:** add `noncurrentVersionsToRetain` property to lifecycle rule ([#20348](https://github.com/aws/aws-cdk/issues/20348)) ([85604d9](https://github.com/aws/aws-cdk/commit/85604d929978aa1c645dba8959d682892278f862)), closes [#19784](https://github.com/aws/aws-cdk/issues/19784)


### Bug Fixes

* **apigateway:** arnForExecuteApi fails on tokenized path ([#20323](https://github.com/aws/aws-cdk/issues/20323)) ([f7732a1](https://github.com/aws/aws-cdk/commit/f7732a1b06927d84e79ea1c9fb671ad184a9efea)), closes [#20252](https://github.com/aws/aws-cdk/issues/20252)
* **assets:** parallel docker image publishing fails on macOS ([#20117](https://github.com/aws/aws-cdk/issues/20117)) ([a58a803](https://github.com/aws/aws-cdk/commit/a58a8037b79636e9f973beff2483baecad73f15d)), closes [#20116](https://github.com/aws/aws-cdk/issues/20116)
* **cfn-include:** allow CFN Functions in Tags ([#19923](https://github.com/aws/aws-cdk/issues/19923)) ([4df9a4f](https://github.com/aws/aws-cdk/commit/4df9a4fa9ef24266b2bcde378ecc112c7dcaf8aa)), closes [#16889](https://github.com/aws/aws-cdk/issues/16889)
* **cli:** allow SSO profiles to be used as source profiles ([#20340](https://github.com/aws/aws-cdk/issues/20340)) ([a0b29e9](https://github.com/aws/aws-cdk/commit/a0b29e9f29775bfd94307a8975f5ba3a8faf05fa)), closes [#19897](https://github.com/aws/aws-cdk/issues/19897)
* **cloudwatch-actions:** stack partition is hardcoded 'aws' in action arn ([#20224](https://github.com/aws/aws-cdk/issues/20224)) ([0eb6c3b](https://github.com/aws/aws-cdk/commit/0eb6c3bb5853194f8727fc2cd3b1c9acb6eea20f)), closes [#19765](https://github.com/aws/aws-cdk/issues/19765)
* **eks:** Cluster.FromClusterAttributes ignores KubectlLambdaRole ([#20373](https://github.com/aws/aws-cdk/issues/20373)) ([7e824ab](https://github.com/aws/aws-cdk/commit/7e824ab40772dc888aec7986e343b12ec1032657)), closes [#20008](https://github.com/aws/aws-cdk/issues/20008)
* **iam:** AccountPrincipal accepts values which aren't account IDs ([#20292](https://github.com/aws/aws-cdk/issues/20292)) ([d0163f8](https://github.com/aws/aws-cdk/commit/d0163f8a3d14e38f67b381c569b5bd3af92c4f51)), closes [#20288](https://github.com/aws/aws-cdk/issues/20288)
* **pipelines:** specifying the Action Role for CodeBuild steps ([#18293](https://github.com/aws/aws-cdk/issues/18293)) ([719edfc](https://github.com/aws/aws-cdk/commit/719edfcb949828a423be2367b5c85b0e9a9c1c12)), closes [#18291](https://github.com/aws/aws-cdk/issues/18291) [#18291](https://github.com/aws/aws-cdk/issues/18291)
* **rds:** tokens should not be lowercased ([#20287](https://github.com/aws/aws-cdk/issues/20287)) ([5429e55](https://github.com/aws/aws-cdk/commit/5429e55126db7556dd2eb2d5e30a50976b5f6ee4)), closes [#18802](https://github.com/aws/aws-cdk/issues/18802)
* **secretsmanager:** automatic rotation cannot be disabled ([#18906](https://github.com/aws/aws-cdk/issues/18906)) ([c50d60c](https://github.com/aws/aws-cdk/commit/c50d60ca9417c771ca31cb330521e0e9f988e3fd)), closes [#18749](https://github.com/aws/aws-cdk/issues/18749)

## [2.24.1](https://github.com/aws/aws-cdk/compare/v2.24.0...v2.24.1) (2022-05-12)

## [2.24.0](https://github.com/aws/aws-cdk/compare/v2.23.0...v2.24.0) (2022-05-11)


### Features

* **lambda:** nodejs16.x runtime ([#20261](https://github.com/aws/aws-cdk/issues/20261)) ([edf7c86](https://github.com/aws/aws-cdk/commit/edf7c864f90acc4f29ff78ff0de74e324f8b85ee))


### Bug Fixes

* **cognito:** UserPoolDomain.baseUrl() does not return FIPS-compliant url for gov cloud regions ([#20200](https://github.com/aws/aws-cdk/issues/20200)) ([dd10df1](https://github.com/aws/aws-cdk/commit/dd10df1c84eaa752e3587a6b1f0c7e28b9d508e3)), closes [#20182](https://github.com/aws/aws-cdk/issues/20182) [#12500](https://github.com/aws/aws-cdk/issues/12500)
* **stepfunctions:** map property maxConcurrency is not token-aware ([#20279](https://github.com/aws/aws-cdk/issues/20279)) ([14be764](https://github.com/aws/aws-cdk/commit/14be76497b85f6cd9083620ebe5d890359540aa5)), closes [#20152](https://github.com/aws/aws-cdk/issues/20152)

## [2.23.0](https://github.com/aws/aws-cdk/compare/v2.22.0...v2.23.0) (2022-05-04)


### Features

* **cfnspec:** cloudformation spec v68.0.0 ([#20065](https://github.com/aws/aws-cdk/issues/20065)) ([f199fad](https://github.com/aws/aws-cdk/commit/f199faddc0b8e565aa413e480e51d25fed5321bf))
* **cloudwatch:** Add CustomWidget ([#19327](https://github.com/aws/aws-cdk/issues/19327)) ([489340e](https://github.com/aws/aws-cdk/commit/489340ea383c9130c315853afae0137b1fa03eb0)), closes [#17579](https://github.com/aws/aws-cdk/issues/17579)
* **cloudwatch:** expose dashboardName property on the L2 Dashboard construct ([#17721](https://github.com/aws/aws-cdk/issues/17721)) ([8cb5dff](https://github.com/aws/aws-cdk/commit/8cb5dff400e0143b86494f11c565d981c74f875a)), closes [#17648](https://github.com/aws/aws-cdk/issues/17648)
* **ec2:** add i4i instance type ([#20134](https://github.com/aws/aws-cdk/issues/20134)) ([64c5064](https://github.com/aws/aws-cdk/commit/64c50640e7f5897f08af3f86cd28a1dab3cd2430))
* **iam:** add convenience method `inOrganization` to ArnPrincipal ([#20109](https://github.com/aws/aws-cdk/issues/20109)) ([c545bfe](https://github.com/aws/aws-cdk/commit/c545bfe2a3ccb53fa5ae2eb725a1696677703c0a)), closes [/github.com/aws/aws-cdk/pull/19975#discussion_r857385168](https://github.com/aws//github.com/aws/aws-cdk/pull/19975/issues/discussion_r857385168) [#19975](https://github.com/aws/aws-cdk/issues/19975)
* **lambda:** `function.addAlias()` simplifies Alias creation ([#20034](https://github.com/aws/aws-cdk/issues/20034)) ([a79bc47](https://github.com/aws/aws-cdk/commit/a79bc47aaa6737628562c251e2f1990b2c7b88ef))
* **rds:** add secret rotation to `DatabaseClusterFromSnapshot` ([#20020](https://github.com/aws/aws-cdk/issues/20020)) ([abc3502](https://github.com/aws/aws-cdk/commit/abc3502eef9b1b950f4e9d2c3f5f44b7e2f6476d)), closes [#12877](https://github.com/aws/aws-cdk/issues/12877)
* **servicecatalog:** graduate to stable 🚀 ([#19515](https://github.com/aws/aws-cdk/issues/19515)) ([4764591](https://github.com/aws/aws-cdk/commit/4764591a59d63026584f1898046974a1a166e166))


### Bug Fixes

* **lambda:** grant invoke twice with different principals ([#20174](https://github.com/aws/aws-cdk/issues/20174)) ([bb4c950](https://github.com/aws/aws-cdk/commit/bb4c9506c7395fc3c84725fb8e6054ac23ca2bf7))
* **ubergen:** expose exports in core module for v2 ([#20176](https://github.com/aws/aws-cdk/issues/20176)) ([fc2cd48](https://github.com/aws/aws-cdk/commit/fc2cd48a3aabaf0d5214b322794c6a49d9c700c9)), closes [#19773](https://github.com/aws/aws-cdk/issues/19773)

## [2.22.0](https://github.com/aws/aws-cdk/compare/v2.21.1...v2.22.0) (2022-04-27)


### Features

* **aws-cognito:** send emails with a verified domain ([#19790](https://github.com/aws/aws-cdk/issues/19790)) ([1d2b1d3](https://github.com/aws/aws-cdk/commit/1d2b1d30b4357961ef72fd275a58038dd755de17)), closes [#19762](https://github.com/aws/aws-cdk/issues/19762)
* **aws-eks:** add annotations and labels to service accounts ([#19609](https://github.com/aws/aws-cdk/issues/19609)) ([82aec9d](https://github.com/aws/aws-cdk/commit/82aec9db1fcd23f0c39c75c950c5b2a165d0f99a)), closes [#19607](https://github.com/aws/aws-cdk/issues/19607)
* **cloudwatch:** expose dashboardArn for CloudWatch dashboard L2 construct ([#20059](https://github.com/aws/aws-cdk/issues/20059)) ([df9814f](https://github.com/aws/aws-cdk/commit/df9814f48b6d94a2c2297cacd9e7cea958993766))
* **rds:** allow `DatabaseClusterFromSnapshot` to set `copyTagsToSnapshot` property ([#19932](https://github.com/aws/aws-cdk/issues/19932)) ([40a6ceb](https://github.com/aws/aws-cdk/commit/40a6ceb9983694a3645edd78167e93825a9049e9)), closes [#19884](https://github.com/aws/aws-cdk/issues/19884)


### Bug Fixes

* **tooling:** container user's uid does not match host's uid ([#20082](https://github.com/aws/aws-cdk/issues/20082)) ([e9670c8](https://github.com/aws/aws-cdk/commit/e9670c85819203069ca597b71e305b6a20313d1f)), closes [#19979](https://github.com/aws/aws-cdk/issues/19979)
* deploy monitor count is off if there are > 100 changes ([#20067](https://github.com/aws/aws-cdk/issues/20067)) ([fd306ee](https://github.com/aws/aws-cdk/commit/fd306ee05cfa7ebaa8d997007500d89d62868897)), closes [#11805](https://github.com/aws/aws-cdk/issues/11805)
* **eks:** cluster cannot be created in opt-in regions ([#20009](https://github.com/aws/aws-cdk/issues/20009)) ([ec06f48](https://github.com/aws/aws-cdk/commit/ec06f4893d62f371ef92fccaa52d38f4350d6712)), closes [#13748](https://github.com/aws/aws-cdk/issues/13748) [#15579](https://github.com/aws/aws-cdk/issues/15579)
* **eks:** remove incomplete support for k8s v1.22 ([#20000](https://github.com/aws/aws-cdk/issues/20000)) ([d38a9e4](https://github.com/aws/aws-cdk/commit/d38a9e44af184e6e7fa8cde14a84ff2c72cec5f9)), closes [#19756](https://github.com/aws/aws-cdk/issues/19756) [#19919](https://github.com/aws/aws-cdk/issues/19919)
* **imagebuilder:** AmiDistributionConfiguration renders empty ([#20045](https://github.com/aws/aws-cdk/issues/20045)) ([7bd7139](https://github.com/aws/aws-cdk/commit/7bd7139abafa0f36d0494be2fa6f03b5149702ef))
* **imagebuilder:** revert property field typings ([b2e0eb5](https://github.com/aws/aws-cdk/commit/b2e0eb501e87bb954e985081d28ceecaf42a1ddd))
* **region-info:** EMR service principal incorrect in China ([#20014](https://github.com/aws/aws-cdk/issues/20014)) ([84649b8](https://github.com/aws/aws-cdk/commit/84649b87aec769be690c627832f73a8472fb785f)), closes [#19867](https://github.com/aws/aws-cdk/issues/19867)

## [2.21.1](https://github.com/aws/aws-cdk/compare/v2.21.0...v2.21.1) (2022-04-22)


### Bug Fixes

* **imagebuilder:** revert property field typings ([5e4dca2](https://github.com/aws/aws-cdk/commit/5e4dca2c0429b2a4fb8723c282565a0481e29c0a))

## [2.21.0](https://github.com/aws/aws-cdk/compare/v2.20.0...v2.21.0) (2022-04-22)


### Features

* **autoscaling:** Auto Scaling Group with Launch Template ([#19066](https://github.com/aws/aws-cdk/issues/19066)) ([1581af0](https://github.com/aws/aws-cdk/commit/1581af0e91cd68ace2c76c236be811a4e48bffe6)), closes [#6734](https://github.com/aws/aws-cdk/issues/6734)
* **aws-ecr:** make it easy to reference image tag or digest, use everywhere ([#19799](https://github.com/aws/aws-cdk/issues/19799)) ([380774e](https://github.com/aws/aws-cdk/commit/380774edd5f8c42294651ead3541eebcf029251c)), closes [#13299](https://github.com/aws/aws-cdk/issues/13299) [#15333](https://github.com/aws/aws-cdk/issues/15333)
* **cfnspec:** cloudformation spec v66.0.0 ([#19812](https://github.com/aws/aws-cdk/issues/19812)) ([43735fd](https://github.com/aws/aws-cdk/commit/43735fd85cff3d5f9cdf4e6c9f62ffe4c93a72b4)), closes [#19798](https://github.com/aws/aws-cdk/issues/19798)
* **cfnspec:** cloudformation spec v66.1.0 ([#19929](https://github.com/aws/aws-cdk/issues/19929)) ([8c8b6b6](https://github.com/aws/aws-cdk/commit/8c8b6b68b98e090580357172c247267ce92f2668))
* **cli:** glob-style key matching to context --reset ([#19840](https://github.com/aws/aws-cdk/issues/19840)) ([edb4119](https://github.com/aws/aws-cdk/commit/edb411925cf84ebe38e5a45acdec20f339087ea6)), closes [#19797](https://github.com/aws/aws-cdk/issues/19797)
* **codebuild:** add ability to customize build status reporting for third-party Git sources ([#19408](https://github.com/aws/aws-cdk/issues/19408)) ([423d72f](https://github.com/aws/aws-cdk/commit/423d72f79b979d6f5f8ba70df05b7e1580d6a349))
* **codepipeline:** allow to disable stage transition ([#19911](https://github.com/aws/aws-cdk/issues/19911)) ([ac9901a](https://github.com/aws/aws-cdk/commit/ac9901ada20e0bcadcae0e6f59e5c58220328714)), closes [#1649](https://github.com/aws/aws-cdk/issues/1649)
* **lambda:** function URLs ([#19817](https://github.com/aws/aws-cdk/issues/19817)) ([4fd515a](https://github.com/aws/aws-cdk/commit/4fd515a3a1de87977ad71329bb7cecb0527558f4)), closes [#19798](https://github.com/aws/aws-cdk/issues/19798)
* **logs:** add QueryDefinition L2 Construct ([#18655](https://github.com/aws/aws-cdk/issues/18655)) ([fcf981b](https://github.com/aws/aws-cdk/commit/fcf981b31c12f0366e49e15d5aa67d412e84caf0))
* **route53:** fromPublicHostedZoneAttributes method with zoneName ([#19771](https://github.com/aws/aws-cdk/issues/19771)) ([7867dc4](https://github.com/aws/aws-cdk/commit/7867dc499af50edad11c9263c37cb71e72193c04)), closes [#18700](https://github.com/aws/aws-cdk/issues/18700)
* **s3-deployment:** ephemeral storage size property for bucket deployment ([#19958](https://github.com/aws/aws-cdk/issues/19958)) ([3ce40b4](https://github.com/aws/aws-cdk/commit/3ce40b4455215b066833fa0ebe0e0a99a2928573)), closes [#19947](https://github.com/aws/aws-cdk/issues/19947)
* check for accidental exposure of secrets ([#19543](https://github.com/aws/aws-cdk/issues/19543)) ([789e8d2](https://github.com/aws/aws-cdk/commit/789e8d2aaa0aefb6d17e4ebc0d56c17e9999add0))


### Bug Fixes

* **autoscaling:** update validation on maxInstanceLifetime ([#19584](https://github.com/aws/aws-cdk/issues/19584)) ([d115b47](https://github.com/aws/aws-cdk/commit/d115b476688eb39a935074490435f855f7fee9c0))
* **aws-cloudfront:** Add sslSupportMethod ([#19737](https://github.com/aws/aws-cdk/issues/19737)) ([c5a9679](https://github.com/aws/aws-cdk/commit/c5a96793818f57141efc78ab60f13b48a3b1e460)), closes [#19476](https://github.com/aws/aws-cdk/issues/19476)
* **aws-ecr-assets:** correct file existence validation in tests ([#19945](https://github.com/aws/aws-cdk/issues/19945)) ([d4c13c0](https://github.com/aws/aws-cdk/commit/d4c13c01c2d2a910a09db7c6fdfc67f410d6b195)), closes [40aws-cdk/aws-ecr-assets/test/image-asset.test.ts#L387](https://github.com/40aws-cdk/aws-ecr-assets/test/image-asset.test.ts/issues/L387) [#19944](https://github.com/aws/aws-cdk/issues/19944)
* **cfn-diff:** allow resources to change types ([#19891](https://github.com/aws/aws-cdk/issues/19891)) ([4f3a340](https://github.com/aws/aws-cdk/commit/4f3a340ab8794ce793b903042a6ba9470bec8955)), closes [#13921](https://github.com/aws/aws-cdk/issues/13921)
* **cfn-include:** detect a resource cycle in the included template ([#19871](https://github.com/aws/aws-cdk/issues/19871)) ([2c2bc0b](https://github.com/aws/aws-cdk/commit/2c2bc0b4ba2be87706a87c141f35f32fbe1ea615)), closes [#16654](https://github.com/aws/aws-cdk/issues/16654)
* **cfnspec:** aws-sam deployment preferences hooks ([#19732](https://github.com/aws/aws-cdk/issues/19732)) ([a205734](https://github.com/aws/aws-cdk/commit/a205734f609202c168119dddf1fdc30080f18744))
* **cfnSpec:** wrong type for SAM API properties GatewayResponses and Models ([#19885](https://github.com/aws/aws-cdk/issues/19885)) ([b214ede](https://github.com/aws/aws-cdk/commit/b214ede1bd264afc1de7f34541bfc4220fa507bc)), closes [#19870](https://github.com/aws/aws-cdk/issues/19870)
* **cli:** hangs on retrieving notices ([#19967](https://github.com/aws/aws-cdk/issues/19967)) ([daeeafa](https://github.com/aws/aws-cdk/commit/daeeafa5855d3bbb5b5070f10fd7cba52d035112)), closes [#19542](https://github.com/aws/aws-cdk/issues/19542)
* **cli:** stack monitor prints over error messages ([#19859](https://github.com/aws/aws-cdk/issues/19859)) ([42e5d08](https://github.com/aws/aws-cdk/commit/42e5d08be2b505b4cf6ca818844c02b95bc43e43)), closes [#19742](https://github.com/aws/aws-cdk/issues/19742)
* **cloudwatch:** MathExpression `id` contract is not clear ([#19825](https://github.com/aws/aws-cdk/issues/19825)) ([5472b11](https://github.com/aws/aws-cdk/commit/5472b11ab1d10514dd5f67dfaf5e21eba979d572)), closes [#13942](https://github.com/aws/aws-cdk/issues/13942) [#17126](https://github.com/aws/aws-cdk/issues/17126)
* **core:** exportValue does not work on number attributes ([#19818](https://github.com/aws/aws-cdk/issues/19818)) ([12459ca](https://github.com/aws/aws-cdk/commit/12459ca368012a81bfc11c023a100764cf8fd0ed)), closes [#19537](https://github.com/aws/aws-cdk/issues/19537)
* **docdb:** make most attributes of DatabaseClusterAttributes optional ([#19625](https://github.com/aws/aws-cdk/issues/19625)) ([5f6d20c](https://github.com/aws/aws-cdk/commit/5f6d20c2a881ffd9decaa8afe3d35dd677b601f1)), closes [#14492](https://github.com/aws/aws-cdk/issues/14492)
* **ecr:** scanOnPush not supported in certain regions ([#19940](https://github.com/aws/aws-cdk/issues/19940)) ([2ff3143](https://github.com/aws/aws-cdk/commit/2ff3143ad47d4dcf963fdb5d0e333a3a86ef8a2e)), closes [#19918](https://github.com/aws/aws-cdk/issues/19918)
* **ecs:** get rid of EFS casing warnings ([#19681](https://github.com/aws/aws-cdk/issues/19681)) ([eafc11a](https://github.com/aws/aws-cdk/commit/eafc11afbd6a09451afbecd8110c1e0a1a9088a4)), closes [#15025](https://github.com/aws/aws-cdk/issues/15025)
* **eks:** malformed command when installing helm chart from OCI artifact  ([#19778](https://github.com/aws/aws-cdk/issues/19778)) ([f8babb8](https://github.com/aws/aws-cdk/commit/f8babb8f0f88fec6216bcb5de95ac4ec57be39db)), closes [/github.com/aws/aws-cdk/pull/18547#issuecomment-1088737549](https://github.com/aws//github.com/aws/aws-cdk/pull/18547/issues/issuecomment-1088737549)
* **iam:** role/group/user's path not included in ARN ([#13258](https://github.com/aws/aws-cdk/issues/13258)) ([ef2b480](https://github.com/aws/aws-cdk/commit/ef2b480699f687aace64481ece654842461a9f13)), closes [#13156](https://github.com/aws/aws-cdk/issues/13156)
* **lambda-event-sources:** unsupported property `onFailure` for KafkaEventSources ([#19995](https://github.com/aws/aws-cdk/issues/19995)) ([383171b](https://github.com/aws/aws-cdk/commit/383171b54873705a01b7f113a7c6b5c98be2117b)), closes [#19917](https://github.com/aws/aws-cdk/issues/19917)
* **rds:** MySQL 8.0 uses wrong Parameter for S3 export ([#19775](https://github.com/aws/aws-cdk/issues/19775)) ([5a895a3](https://github.com/aws/aws-cdk/commit/5a895a308ef2b6e66a330038c7ae35ea95a0fba4)), closes [#19735](https://github.com/aws/aws-cdk/issues/19735)
* **stepfunctions:** incorrect default documentation for integrationPattern ([#19936](https://github.com/aws/aws-cdk/issues/19936)) ([4cb3b2b](https://github.com/aws/aws-cdk/commit/4cb3b2bdb959ae398ffe2f8a5a927280f5d63306)), closes [#19815](https://github.com/aws/aws-cdk/issues/19815)


### Reverts

* "feat(cli): glob-style key matching to context --reset ([#19840](https://github.com/aws/aws-cdk/issues/19840))" ([#19888](https://github.com/aws/aws-cdk/issues/19888)) ([89ec597](https://github.com/aws/aws-cdk/commit/89ec5972e855695fee61628440e61df79c12fdc5))

## [2.20.0](https://github.com/aws/aws-cdk/compare/v2.19.0...v2.20.0) (2022-04-07)


### Features

* **cfnspec:** cloudformation spec v63.0.0 ([#19679](https://github.com/aws/aws-cdk/issues/19679)) ([dba96a9](https://github.com/aws/aws-cdk/commit/dba96a9ec6193f630baf6c0d306def903024a56d))
* **cfnspec:** cloudformation spec v65.0.0 ([#19745](https://github.com/aws/aws-cdk/issues/19745)) ([796fc64](https://github.com/aws/aws-cdk/commit/796fc6401124c00b835cbb8679b47cd373811209))
* **cli:** add --build option ([#19663](https://github.com/aws/aws-cdk/issues/19663)) ([eb9b8e2](https://github.com/aws/aws-cdk/commit/eb9b8e23906e2e1375f45f795d71b905bc0a52af)), closes [#19667](https://github.com/aws/aws-cdk/issues/19667)
* **cli:** preview of `cdk import` ([#17666](https://github.com/aws/aws-cdk/issues/17666)) ([4f12209](https://github.com/aws/aws-cdk/commit/4f122099e2d4a6b3bdf6edfb2e99986dd266a71e))
* **core:** throw error when stack name exceeds max length ([#19725](https://github.com/aws/aws-cdk/issues/19725)) ([1ffd45e](https://github.com/aws/aws-cdk/commit/1ffd45e5aa179aef0622902306701a526f6dfa6c))
* **eks:** add k8s v1.22 ([#19756](https://github.com/aws/aws-cdk/issues/19756)) ([9a518c5](https://github.com/aws/aws-cdk/commit/9a518c59f5fcb74dd73df1a91681039b6c150fec))
* **opensearch:** Add latest Opensearch Version 1.2 ([#19749](https://github.com/aws/aws-cdk/issues/19749)) ([a2ac36e](https://github.com/aws/aws-cdk/commit/a2ac36e6dbe486aa87e46d17f5472d6af6c39397))
* add new integration test runner ([#19754](https://github.com/aws/aws-cdk/issues/19754)) ([1b4d010](https://github.com/aws/aws-cdk/commit/1b4d010ed29cfb4a8f7f5a8ecc22c7c97bccde4e))
* **eks:** alb-controller v2.4.1 ([#19653](https://github.com/aws/aws-cdk/issues/19653)) ([1ec08df](https://github.com/aws/aws-cdk/commit/1ec08dfc85122fc6f3d9e3c28abc7cd116f08d91))
* **lambda:** add support for ephemeral storage ([#19552](https://github.com/aws/aws-cdk/issues/19552)) ([f1d9b6a](https://github.com/aws/aws-cdk/commit/f1d9b6aa39c10a85c61ab3aaceabac88789bd2cf)), closes [#19605](https://github.com/aws/aws-cdk/issues/19605)
* **s3:** EventBridge bucket notifications ([#18614](https://github.com/aws/aws-cdk/issues/18614)) ([d8e602b](https://github.com/aws/aws-cdk/commit/d8e602b6c1b4cb8ca7038f4b21a7a7092ea8466d)), closes [#18076](https://github.com/aws/aws-cdk/issues/18076)


### Bug Fixes

* **aws_applicationautoscaling:** Add missing members to PredefinedMetric enum ([#18978](https://github.com/aws/aws-cdk/issues/18978)) ([75a6fa7](https://github.com/aws/aws-cdk/commit/75a6fa75d053fc1172e83b57a27e4b450bb79729)), closes [#18969](https://github.com/aws/aws-cdk/issues/18969)
* **cli:** apps with many resources scroll resource output offscreen ([#19742](https://github.com/aws/aws-cdk/issues/19742)) ([053d22c](https://github.com/aws/aws-cdk/commit/053d22cb77016e0e65157c8713fefedb3c0bf91b)), closes [#19160](https://github.com/aws/aws-cdk/issues/19160)
* **cli:** support attributes of DynamoDB Tables for hotswapping ([#19620](https://github.com/aws/aws-cdk/issues/19620)) ([2321ece](https://github.com/aws/aws-cdk/commit/2321eced6cc16925c6d50e35b140f9ad4008d758)), closes [#19421](https://github.com/aws/aws-cdk/issues/19421)
* **cloudwatch:** automatic metric math label cannot be suppressed ([#17639](https://github.com/aws/aws-cdk/issues/17639)) ([7fa3bf2](https://github.com/aws/aws-cdk/commit/7fa3bf2e385451171fcaeda388a93602cb12f4d8))
* **codedeploy:** add name validation for Application, Deployment Group and Deployment Configuration ([#19473](https://github.com/aws/aws-cdk/issues/19473)) ([9185042](https://github.com/aws/aws-cdk/commit/91850423db97e7fa244d125a115477fa007a12a0))
* **codedeploy:** the Service Principal is wrong in isolated regions ([#19729](https://github.com/aws/aws-cdk/issues/19729)) ([7e9a43d](https://github.com/aws/aws-cdk/commit/7e9a43dcad55645a8e816e39af54feeb04d7a8cf)), closes [#19399](https://github.com/aws/aws-cdk/issues/19399)
* **core:** `Fn.select` incorrectly short-circuits complex expressions ([#19680](https://github.com/aws/aws-cdk/issues/19680)) ([7f26fad](https://github.com/aws/aws-cdk/commit/7f26fad5241756cdb6b15c9fb20995a96bba71f2))
* **core:** detect and resolve stringified number tokens ([#19578](https://github.com/aws/aws-cdk/issues/19578)) ([7d9ab2a](https://github.com/aws/aws-cdk/commit/7d9ab2a783d1d3ae4508760149dee7ac263fdd44)), closes [#19546](https://github.com/aws/aws-cdk/issues/19546) [#19550](https://github.com/aws/aws-cdk/issues/19550)
* **core:** reduce CFN template indent size to save bytes ([#19656](https://github.com/aws/aws-cdk/issues/19656)) ([fd63ca3](https://github.com/aws/aws-cdk/commit/fd63ca3995fb74b563a348589adf5fb06b4ef771))
* **ecs:** 'desiredCount' and 'ephemeralStorageGiB' cannot be tokens ([#19453](https://github.com/aws/aws-cdk/issues/19453)) ([c852239](https://github.com/aws/aws-cdk/commit/c852239936b79581dbcf0dc8d56e3bb76a52e2dc)), closes [#16648](https://github.com/aws/aws-cdk/issues/16648)
* **ecs:** remove unnecessary error when adding volume to external task definition ([#19774](https://github.com/aws/aws-cdk/issues/19774)) ([5446ded](https://github.com/aws/aws-cdk/commit/5446ded3d858098655b6427c9fdea56e77e2c0cd)), closes [#19259](https://github.com/aws/aws-cdk/issues/19259)
* **iam:** policies aren't minimized as far as possible ([#19764](https://github.com/aws/aws-cdk/issues/19764)) ([876ed8a](https://github.com/aws/aws-cdk/commit/876ed8ad1726d6b77e7450eadbd1a4ded8236544)), closes [#19751](https://github.com/aws/aws-cdk/issues/19751)
* **logs:** Faulty Resource Policy Generated ([#19640](https://github.com/aws/aws-cdk/issues/19640)) ([1fdf122](https://github.com/aws/aws-cdk/commit/1fdf1223304e15d905723553a40640b8bcb0ec56)), closes [#17544](https://github.com/aws/aws-cdk/issues/17544)

## [2.19.0](https://github.com/aws/aws-cdk/compare/v2.18.0...v2.19.0) (2022-03-31)


### Features

* **aws-ec2:** Enable/disable EC2 "Detailed Monitoring" ([#19437](https://github.com/aws/aws-cdk/issues/19437)) ([94f9d27](https://github.com/aws/aws-cdk/commit/94f9d27e626bced5fc68a6ebbd653fea21c6e21e))
* **core:** add size.isUnresolved ([#19569](https://github.com/aws/aws-cdk/issues/19569)) ([ed26731](https://github.com/aws/aws-cdk/commit/ed26731a0a6263482d76441fc06e9607963ac838))
* **ecs-patterns:** PlacementStrategy and PlacementConstraint for many patterns ([#19612](https://github.com/aws/aws-cdk/issues/19612)) ([0096e67](https://github.com/aws/aws-cdk/commit/0096e672e02123a2ae4e094ba9bb11af3aef20b2))
* **elbv2:** use `addAction()` on an imported application listener ([#19293](https://github.com/aws/aws-cdk/issues/19293)) ([18a6b0c](https://github.com/aws/aws-cdk/commit/18a6b0cecb5e8a419d09a1456953cb2f422a6d76)), closes [#10902](https://github.com/aws/aws-cdk/issues/10902)
* **lambda:** warn if you use `function.grantInvoke` while also using `currentVersion` ([#19464](https://github.com/aws/aws-cdk/issues/19464)) ([fd1fff9](https://github.com/aws/aws-cdk/commit/fd1fff904a70d18dc9c7863aefc03b3ee44c2863)), closes [#19273](https://github.com/aws/aws-cdk/issues/19273) [#19318](https://github.com/aws/aws-cdk/issues/19318)


### Bug Fixes

* **apigateway:** allow using GENERATE_IF_NEEDED for the physical name in LambdaRestApi ([#19638](https://github.com/aws/aws-cdk/issues/19638)) ([e817381](https://github.com/aws/aws-cdk/commit/e8173812aad5f482b1bfcc6737f63cfef0c4841c)), closes [#9374](https://github.com/aws/aws-cdk/issues/9374)
* **apigateway:** id in schema model maps to $id  ([#15113](https://github.com/aws/aws-cdk/issues/15113)) ([ac5a345](https://github.com/aws/aws-cdk/commit/ac5a3458fe3687014166b20aefe30442867d162a)), closes [#14585](https://github.com/aws/aws-cdk/issues/14585)
* **aws-cognito:** Lambda::Permission of lambdaTrigger should have a SourceArn ([#19622](https://github.com/aws/aws-cdk/issues/19622)) ([c62eeb7](https://github.com/aws/aws-cdk/commit/c62eeb7162d85c8cb162f8c0ad4b93fb5bccf981)), closes [#19604](https://github.com/aws/aws-cdk/issues/19604)
* **docdb:** DB Instance ARN uses 'docdb' as the service component instead of 'rds' ([#19555](https://github.com/aws/aws-cdk/issues/19555)) ([6a63924](https://github.com/aws/aws-cdk/commit/6a63924c0b184342befd92903b8867e45b158252)), closes [#19554](https://github.com/aws/aws-cdk/issues/19554)
* **eks:** incorrect version of aws-node-termination-handler ([#19510](https://github.com/aws/aws-cdk/issues/19510)) ([9c712cc](https://github.com/aws/aws-cdk/commit/9c712cc457ccb80d7180fee67a101b76fc01d207))
* **elbv2:** unable to add multiple certificates to NLB ([#19289](https://github.com/aws/aws-cdk/issues/19289)) ([e8142e9](https://github.com/aws/aws-cdk/commit/e8142e944ac5fae9948e5c010fe475806b83c94b)), closes [#13490](https://github.com/aws/aws-cdk/issues/13490) [#8918](https://github.com/aws/aws-cdk/issues/8918) [#15328](https://github.com/aws/aws-cdk/issues/15328)
* **rds:** `SnapshotCredentials.fromSecret()` takes a `Secret`, not `ISecret` ([#19639](https://github.com/aws/aws-cdk/issues/19639)) ([a74d82e](https://github.com/aws/aws-cdk/commit/a74d82e667ba3cfbb3341392f7c641b0e29d47f0)), closes [#19409](https://github.com/aws/aws-cdk/issues/19409)

## [2.18.0](https://github.com/aws/aws-cdk/compare/v2.17.0...v2.18.0) (2022-03-28)


### Features


* **cognito:** configure SNS region for UserPool SMS messages ([#19519](https://github.com/aws/aws-cdk/issues/19519)) ([6eb775e](https://github.com/aws/aws-cdk/commit/6eb775e829d62913bff849d43ed7339f9910d8de)), closes [#19434](https://github.com/aws/aws-cdk/issues/19434)
* cloudformation spec v62.0.0 ([#19553](https://github.com/aws/aws-cdk/issues/19553)) ([0352dee](https://github.com/aws/aws-cdk/commit/0352deedb445f070ed0cd27406a75872fb71ea53))
* **autoscaling:** support warm pools ([#19214](https://github.com/aws/aws-cdk/issues/19214)) ([737e611](https://github.com/aws/aws-cdk/commit/737e611577c97b6ad01eaeb05fc544258a9de5ad))
* **cfnspec:** cloudformation spec v61.0.0 ([#19457](https://github.com/aws/aws-cdk/issues/19457)) ([16d7552](https://github.com/aws/aws-cdk/commit/16d7552683ea05ea1a24b214b925836dcb72871d))
* **cli:** support SSO ([#19454](https://github.com/aws/aws-cdk/issues/19454)) ([eba6052](https://github.com/aws/aws-cdk/commit/eba6052e1c8011d7163c782e669e86f5d2fd44d0))
* **cloudwatch:** Additional Properties for Cloudwatch AlarmStatusWidget ([#19387](https://github.com/aws/aws-cdk/issues/19387)) ([3c9ea5f](https://github.com/aws/aws-cdk/commit/3c9ea5f31e3113fb0d2ba5c633fcd665294a70eb)), closes [#19386](https://github.com/aws/aws-cdk/issues/19386)
* **ec2:** add support for x2iezn instances ([#19517](https://github.com/aws/aws-cdk/issues/19517)) ([8f6e20e](https://github.com/aws/aws-cdk/commit/8f6e20e5a070fc3ac2c234013b915315a0e7dcfb))


### Bug Fixes

* **apigateway:** `StepFunctionsIntegration` does not create required role and responses ([#19486](https://github.com/aws/aws-cdk/issues/19486)) ([d59bee9](https://github.com/aws/aws-cdk/commit/d59bee99768b20427503853eb2ec436959ae7e6f))
* **bootstrap:** rebootstrap breaks container Functions ([#19446](https://github.com/aws/aws-cdk/issues/19446)) ([49ea263](https://github.com/aws/aws-cdk/commit/49ea26304760801e03dae5479ae03540eaa63f6e)), closes [#18473](https://github.com/aws/aws-cdk/issues/18473)
* **cli:** templates don't include `.gitignore` ([#19482](https://github.com/aws/aws-cdk/issues/19482)) ([5ce0983](https://github.com/aws/aws-cdk/commit/5ce0983955628c5119340d659abf0201da58bcb6))
* **core:** Aspects from symlinked modules are not applied ([#19491](https://github.com/aws/aws-cdk/issues/19491)) ([eaeaed7](https://github.com/aws/aws-cdk/commit/eaeaed7a508cdb9c84c96911327b085e907aed98)), closes [#18921](https://github.com/aws/aws-cdk/issues/18921) [#18778](https://github.com/aws/aws-cdk/issues/18778) [#19390](https://github.com/aws/aws-cdk/issues/19390) [#18914](https://github.com/aws/aws-cdk/issues/18914)
* **ecr:** setting imageScanningConfiguration to false does nothing on existing repository ([#18078](https://github.com/aws/aws-cdk/issues/18078)) ([78bc870](https://github.com/aws/aws-cdk/commit/78bc8703bb932822ceeb16fd57fa576714aa5732)), closes [#18077](https://github.com/aws/aws-cdk/issues/18077)
* **events:** cannot have more than one cross-account Rule  ([#19441](https://github.com/aws/aws-cdk/issues/19441)) ([a257846](https://github.com/aws/aws-cdk/commit/a2578462119d112c6095e06668add97e7721d570)), closes [#12479](https://github.com/aws/aws-cdk/issues/12479) [#12538](https://github.com/aws/aws-cdk/issues/12538)
* **iam:** IAM Policies are too large to deploy ([#19114](https://github.com/aws/aws-cdk/issues/19114)) ([3a4fe33](https://github.com/aws/aws-cdk/commit/3a4fe3304ba32bc205cbf4833f7397f633cc1ece)), closes [#18774](https://github.com/aws/aws-cdk/issues/18774) [#16350](https://github.com/aws/aws-cdk/issues/16350) [#18457](https://github.com/aws/aws-cdk/issues/18457) [#18564](https://github.com/aws/aws-cdk/issues/18564) [#19276](https://github.com/aws/aws-cdk/issues/19276)
* **lambda:** support Lambda's new `Invoke` with `Qualifier` authorization strategy ([#19318](https://github.com/aws/aws-cdk/issues/19318)) ([d06b27f](https://github.com/aws/aws-cdk/commit/d06b27fd4bf351cc9ba5c603352f756c679c34fc)), closes [#19273](https://github.com/aws/aws-cdk/issues/19273)
* **secretsmanager:** secret rotation uses old application versions ([#19490](https://github.com/aws/aws-cdk/issues/19490)) ([0c983ad](https://github.com/aws/aws-cdk/commit/0c983ad748fa57c0717d9bdf852051046f88b3a9)), closes [#19487](https://github.com/aws/aws-cdk/issues/19487)

## [2.17.0](https://github.com/aws/aws-cdk/compare/v2.16.0...v2.17.0) (2022-03-17)


### Features

* **assertions:** Add the `hasNoXXX` methods. ([#19330](https://github.com/aws/aws-cdk/issues/19330)) ([6bdc9eb](https://github.com/aws/aws-cdk/commit/6bdc9eb52608329f1e66c420cb6c61aa942d17b0)), closes [#18874](https://github.com/aws/aws-cdk/issues/18874)
* **aws-lambda-nodejs:** support additional esbuild configurations ([#17788](https://github.com/aws/aws-cdk/issues/17788)) ([ab313a4](https://github.com/aws/aws-cdk/commit/ab313a4abbec14a1886a7c87673dbc66354811ef))
* **cfnspec:** cloudformation spec v60.0.0 ([#19347](https://github.com/aws/aws-cdk/issues/19347)) ([20da648](https://github.com/aws/aws-cdk/commit/20da648cebddd6feaf8a54d2bf40f3ba3bd30979))
* **cli:** parallel asset publishing ([#19367](https://github.com/aws/aws-cdk/issues/19367)) ([c8cafef](https://github.com/aws/aws-cdk/commit/c8cafefc4cd98e7217973cd9eb0e92263a916b4f)), closes [#19193](https://github.com/aws/aws-cdk/issues/19193)
* **ec2:** add support for x2idn and x2iedn instances ([#19334](https://github.com/aws/aws-cdk/issues/19334)) ([9699efc](https://github.com/aws/aws-cdk/commit/9699efc0c0b0e2b265daf824147be2827555cafa))
* **elbv2:** add name validation for target group and load balancer names ([#19385](https://github.com/aws/aws-cdk/issues/19385)) ([97e0973](https://github.com/aws/aws-cdk/commit/97e09730cbb7c155e6697ace166348064d810449)), closes [/docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-targetgroup.html#cfn-elasticloadbalancingv2](https://github.com/aws//docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-targetgroup.html/issues/cfn-elasticloadbalancingv2) [/docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-loadbalancer.html#cfn-elasticloadbalancingv2](https://github.com/aws//docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-loadbalancer.html/issues/cfn-elasticloadbalancingv2)
* **lambda:** dotnet6 runtime ([#19144](https://github.com/aws/aws-cdk/issues/19144)) ([bbed27d](https://github.com/aws/aws-cdk/commit/bbed27d95ab2724db937964d01aec5564a77e84f))


### Bug Fixes

* **cli:** failure to load malformed YAML is swallowed ([#19338](https://github.com/aws/aws-cdk/issues/19338)) ([1875c28](https://github.com/aws/aws-cdk/commit/1875c28865690d59c22939039a5d0e37039ab63c)), closes [#19335](https://github.com/aws/aws-cdk/issues/19335)
* **lambda-event-sources:** increase batch size restriction ([#19317](https://github.com/aws/aws-cdk/issues/19317)) ([1bc5144](https://github.com/aws/aws-cdk/commit/1bc5144b05938829f90b89001ccda8fd4aefe343)), closes [#19285](https://github.com/aws/aws-cdk/issues/19285)
* **lambda-nodejs:** cannot use esbuildArgs with older esbuild versions ([#19343](https://github.com/aws/aws-cdk/issues/19343)) ([59a4d81](https://github.com/aws/aws-cdk/commit/59a4d81cc712eedfd755232d157a2e492eb3d886))
* **stepfunctions-tasks:** migrate from deprecated batch properties ([#19298](https://github.com/aws/aws-cdk/issues/19298)) ([75f5b3b](https://github.com/aws/aws-cdk/commit/75f5b3b69abf592b2c6d0ec6c19c374754e50f97)), closes [#18993](https://github.com/aws/aws-cdk/issues/18993)

## [2.16.0](https://github.com/aws/aws-cdk/compare/v2.15.0...v2.16.0) (2022-03-11)


### Features

* **aws-apigateway:** add ability to include authorizer context in apigw sfn integration ([#18892](https://github.com/aws/aws-cdk/issues/18892)) ([e7c0c75](https://github.com/aws/aws-cdk/commit/e7c0c75dbc7cf71164673626dc0ab63fb3706223)), closes [#18891](https://github.com/aws/aws-cdk/issues/18891)
* **cfnspec:** cloudformation spec v59.0.0 ([#19236](https://github.com/aws/aws-cdk/issues/19236)) ([f46a14d](https://github.com/aws/aws-cdk/commit/f46a14da9bec1aad7096b62666cb80ce42f04b53))
* **codebuild:** improved support for ARM build images ([#19052](https://github.com/aws/aws-cdk/issues/19052)) ([4eac4de](https://github.com/aws/aws-cdk/commit/4eac4deb98411e921e5a2e6477185207b8588f75)), closes [#18916](https://github.com/aws/aws-cdk/issues/18916) [#9817](https://github.com/aws/aws-cdk/issues/9817)
* **eks:** Service Account names validation ([#19251](https://github.com/aws/aws-cdk/issues/19251)) ([7c3099e](https://github.com/aws/aws-cdk/commit/7c3099e958d7bf0ddb5a7b08afb672a0c652b27d)), closes [#18189](https://github.com/aws/aws-cdk/issues/18189)
* **elasticsearch:** Decouple setting access policies from domain constructor ([#15876](https://github.com/aws/aws-cdk/issues/15876)) ([cefdfd3](https://github.com/aws/aws-cdk/commit/cefdfd384eeac1752567f672452296def68b1206))
* **lambda-nodejs:** support esbuild inject ([#19221](https://github.com/aws/aws-cdk/issues/19221)) ([3432c45](https://github.com/aws/aws-cdk/commit/3432c457fe38a83743d7ce2a5cb6c36a6ec01b8f)), closes [#19133](https://github.com/aws/aws-cdk/issues/19133)
* **s3:** add `s3:ObjectRestore:Delete` to `EventType` for notification ([#19250](https://github.com/aws/aws-cdk/issues/19250)) ([e0f863a](https://github.com/aws/aws-cdk/commit/e0f863a4c56041860e14c75b9aa5a6d35860fae6)), closes [#19223](https://github.com/aws/aws-cdk/issues/19223)


### Bug Fixes

* **aws-apigateway:** missing comma to make failure response payload valid json ([#19253](https://github.com/aws/aws-cdk/issues/19253)) ([b1fce4f](https://github.com/aws/aws-cdk/commit/b1fce4f1641c90a4b7d1d33139453260b452d5cd)), closes [#19252](https://github.com/aws/aws-cdk/issues/19252)
* **aws-route53-targets:** add support for custom cname_prefix urls in elastic beanstalk environment endpoint target ([#18804](https://github.com/aws/aws-cdk/issues/18804)) ([289a794](https://github.com/aws/aws-cdk/commit/289a79467d9974ee3582c9e30843b0eb9e90b467))
* **cli:** `watch` logs always end with the 'truncated' message ([#19241](https://github.com/aws/aws-cdk/issues/19241)) ([d3fdfe5](https://github.com/aws/aws-cdk/commit/d3fdfe5264e64cb333795b32edbad36cfaab3dc7)), closes [#18805](https://github.com/aws/aws-cdk/issues/18805)
* **cli:** deprecated stack ids printed at the end of synth ([#19216](https://github.com/aws/aws-cdk/issues/19216)) ([7d8a479](https://github.com/aws/aws-cdk/commit/7d8a4792a142f45109f35a51c6e1b3888d4111d3)), closes [#18599](https://github.com/aws/aws-cdk/issues/18599)
* **cli:** notices refresh doesn't respect the --no-notices flag ([#19226](https://github.com/aws/aws-cdk/issues/19226)) ([b3c5fe8](https://github.com/aws/aws-cdk/commit/b3c5fe8d0b695e06558bce23a6dd39b20265594f))
* **efs:** fix bug when setting both lifecyclePolicy and outOfInfrequentAccessPolicy ([#19082](https://github.com/aws/aws-cdk/issues/19082)) ([d435ab6](https://github.com/aws/aws-cdk/commit/d435ab6120c47464427489d98bea9347983a2123)), closes [#19058](https://github.com/aws/aws-cdk/issues/19058)
* **lambda-nodejs:** local tsc detection with pre compilation ([#19266](https://github.com/aws/aws-cdk/issues/19266)) ([5de7b86](https://github.com/aws/aws-cdk/commit/5de7b86d916be6ab892e75e18c54a327fe1f65ff)), closes [#19242](https://github.com/aws/aws-cdk/issues/19242)
* **rds:** allow cluster from snapshot to enable encrypted storage ([#19175](https://github.com/aws/aws-cdk/issues/19175)) ([bd4141d](https://github.com/aws/aws-cdk/commit/bd4141d864612974829c95d530085d4f18bdfeb8)), closes [#17241](https://github.com/aws/aws-cdk/issues/17241)
* **rds:** read replica instance cannot join domain ([#19202](https://github.com/aws/aws-cdk/issues/19202)) ([cef8fec](https://github.com/aws/aws-cdk/commit/cef8fec1b0410daa6b57c152e9bad73dcc034397)), closes [#18786](https://github.com/aws/aws-cdk/issues/18786)
* **rds:** subnet selection not respected for multi user secret rotation ([#19237](https://github.com/aws/aws-cdk/issues/19237)) ([dc7a17c](https://github.com/aws/aws-cdk/commit/dc7a17cd20198a6eb52c2ab25857e73bd7048d26)), closes [#19233](https://github.com/aws/aws-cdk/issues/19233)

## [2.15.0](https://github.com/aws/aws-cdk/compare/v2.14.0...v2.15.0) (2022-03-01)


### Features

* **cfnspec:** cloudformation spec v58.0.0 ([#19153](https://github.com/aws/aws-cdk/issues/19153)) ([a6b0a10](https://github.com/aws/aws-cdk/commit/a6b0a1018694a0696ed27635d4def5d1630b8f9a))
* **cli:** hotswap support for resources in nested stacks ([#18950](https://github.com/aws/aws-cdk/issues/18950)) ([2ea9da1](https://github.com/aws/aws-cdk/commit/2ea9da118794809265d215e3d2f554bbcb91b271))
* **ec2:** add c6a instances ([#19113](https://github.com/aws/aws-cdk/issues/19113)) ([427cdfd](https://github.com/aws/aws-cdk/commit/427cdfde5e8c48ed7c1f86b275ccb2516a901239))


### Bug Fixes

* **apigateway:** fix strange vtl template for cors preflight request ([#19104](https://github.com/aws/aws-cdk/issues/19104)) ([59ef06a](https://github.com/aws/aws-cdk/commit/59ef06ae2a70fcb1800fcc1f40eec671c77440f0)), closes [/datatracker.ietf.org/doc/html/rfc6454#section-7](https://github.com/aws//datatracker.ietf.org/doc/html/rfc6454/issues/section-7)
* **aws-apigateway:** api gateway usage plan ([#19023](https://github.com/aws/aws-cdk/issues/19023)) ([5b764cc](https://github.com/aws/aws-cdk/commit/5b764cc397de4f4b203f5c69fa0128c6dced49f9)), closes [#18994](https://github.com/aws/aws-cdk/issues/18994)
* **cli:** cdk version displays notices ([#19181](https://github.com/aws/aws-cdk/issues/19181)) ([fa16f7a](https://github.com/aws/aws-cdk/commit/fa16f7a9c11981da75e44ffc83adcdc6edad94fc))
* **cli:** long connection timeout slows the CLI down ([#19187](https://github.com/aws/aws-cdk/issues/19187)) ([6595d04](https://github.com/aws/aws-cdk/commit/6595d044e29fb262fb62430783ad08359e16bc30))
* **custom-resources:** physical resource id must be determined before isComplete ([#18630](https://github.com/aws/aws-cdk/issues/18630)) ([c190367](https://github.com/aws/aws-cdk/commit/c1903678aba31ca5b23a3bebb84249921e15dd5c))
* **dynamodb:** `grant*Data()` methods are missing the `dynamodb:DescribeTable` permission ([#19129](https://github.com/aws/aws-cdk/issues/19129)) ([4a44a65](https://github.com/aws/aws-cdk/commit/4a44a65bb4634081e04811966d5f4e2fd49bc7c6)), closes [#18773](https://github.com/aws/aws-cdk/issues/18773)
* **dynamodb:** `Table.grantWriteData()` doesn't include enough KMS permissions ([#19102](https://github.com/aws/aws-cdk/issues/19102)) ([77f1e0b](https://github.com/aws/aws-cdk/commit/77f1e0b57bd4508ade86be7733e71e94a47d7f4c)), closes [#10010](https://github.com/aws/aws-cdk/issues/10010)
* **ec2:** invalid volume type check for iops ([#19073](https://github.com/aws/aws-cdk/issues/19073)) ([3f49f02](https://github.com/aws/aws-cdk/commit/3f49f020090142c77feb892894c54e62dc4de7ae))
* **eks:** Helm charts fail to install when provided as an asset ([#19180](https://github.com/aws/aws-cdk/issues/19180)) ([9961257](https://github.com/aws/aws-cdk/commit/99612574bbaf97379482e9e424e1d1115809d74b))
* **lambda-nodejs:** `logLevel` property of `BundlingOptions` is ignored when `nodeModules` are defined ([#18456](https://github.com/aws/aws-cdk/issues/18456)) ([5c40b90](https://github.com/aws/aws-cdk/commit/5c40b90707b869f62e59613d50d5deaafbaa52f1)), closes [#18383](https://github.com/aws/aws-cdk/issues/18383)
* **stepfunctions-tasks:** RUN_JOB integration pattern not supported for CallAwsService ([#19186](https://github.com/aws/aws-cdk/issues/19186)) ([4b134b7](https://github.com/aws/aws-cdk/commit/4b134b785115f026a0eaa37b699cd32c85ff8e73)), closes [#19174](https://github.com/aws/aws-cdk/issues/19174)
* apply tags to nested stack ([#19128](https://github.com/aws/aws-cdk/issues/19128)) ([3af329b](https://github.com/aws/aws-cdk/commit/3af329bcb66b9dffce0c03f0816b33e91e901808)), closes [#17463](https://github.com/aws/aws-cdk/issues/17463)
* **rds:** MySQL Cluster version 8.0 uses wrong Parameter for S3 import ([#19145](https://github.com/aws/aws-cdk/issues/19145)) ([96b2034](https://github.com/aws/aws-cdk/commit/96b2034c44b441a96cfe19855d343b0f983c8772)), closes [#19126](https://github.com/aws/aws-cdk/issues/19126)
* **triggers:** not published as part of v2 ([#19168](https://github.com/aws/aws-cdk/issues/19168)) ([8f727d1](https://github.com/aws/aws-cdk/commit/8f727d15f8f87d4ca323fee449826908db7971a4)), closes [#19164](https://github.com/aws/aws-cdk/issues/19164)
* construct paths are not printed for nested stacks in CLI output ([#18725](https://github.com/aws/aws-cdk/issues/18725)) ([b0e0155](https://github.com/aws/aws-cdk/commit/b0e0155f87a65c34a75e11776f98d55b83d2b220))

## [2.14.0](https://github.com/aws/aws-cdk/compare/v2.13.0...v2.14.0) (2022-02-25)


### Features

* **cli:** bundle dependencies ([#18667](https://github.com/aws/aws-cdk/issues/18667)) ([31d135f](https://github.com/aws/aws-cdk/commit/31d135fb51d3cd4e26fbdc132e03815a1416da75))
* **cli:** support for matching notices with arbitrary module names ([#19088](https://github.com/aws/aws-cdk/issues/19088)) ([a87dee7](https://github.com/aws/aws-cdk/commit/a87dee756057e554909207237b70f80af185b110))
* **cli:** support for notices ([#18936](https://github.com/aws/aws-cdk/issues/18936)) ([d37fbbb](https://github.com/aws/aws-cdk/commit/d37fbbbb31003d69da88b9340a6a9c9e1e927ac5))
* **cloudfront-origins:** extend max keepaliveTimeout of HttpOrigin to 180 ([#18837](https://github.com/aws/aws-cdk/issues/18837)) ([171fdcd](https://github.com/aws/aws-cdk/commit/171fdcdf595fcff5b2567b17e6fa73bf0d42e1bc)), closes [#18697](https://github.com/aws/aws-cdk/issues/18697)
* **eks:** Allow helm pull from OCI repositories ([#18547](https://github.com/aws/aws-cdk/issues/18547)) ([7e624d9](https://github.com/aws/aws-cdk/commit/7e624d994c94dbd584643c4cb6e9f8df53dabc18))
* **lambda:** add a fromFunctionName() method ([#19076](https://github.com/aws/aws-cdk/issues/19076)) ([5b92cc3](https://github.com/aws/aws-cdk/commit/5b92cc3a31eea29b40814498fca614eb1c7c8724)), closes [#18255](https://github.com/aws/aws-cdk/issues/18255) [#19031](https://github.com/aws/aws-cdk/issues/19031)
* **pipelines:** ECR source action  ([#16385](https://github.com/aws/aws-cdk/issues/16385)) ([fc11ae2](https://github.com/aws/aws-cdk/commit/fc11ae2c4ec3bd9dfe3ff813aa831c744d8ac444)), closes [#16378](https://github.com/aws/aws-cdk/issues/16378)
* **pipelines:** step outputs ([#19024](https://github.com/aws/aws-cdk/issues/19024)) ([0dec2ee](https://github.com/aws/aws-cdk/commit/0dec2ee78a70832c3a697be26c67498460a587dd)), closes [#17189](https://github.com/aws/aws-cdk/issues/17189) [#18893](https://github.com/aws/aws-cdk/issues/18893) [#15943](https://github.com/aws/aws-cdk/issues/15943) [#16407](https://github.com/aws/aws-cdk/issues/16407)
* **rds:** make VPC optional for serverless Clusters ([#17413](https://github.com/aws/aws-cdk/issues/17413)) ([4f7818d](https://github.com/aws/aws-cdk/commit/4f7818dd76bd48ed652407f4852cc97ba57d7395)), closes [#17401](https://github.com/aws/aws-cdk/issues/17401)


### Bug Fixes

* **cli:** hotswapping is slow for many resources deployed at once ([#19081](https://github.com/aws/aws-cdk/issues/19081)) ([040238e](https://github.com/aws/aws-cdk/commit/040238e9285945d1c48ef79474e527b871e7824c)), closes [#19021](https://github.com/aws/aws-cdk/issues/19021)
* **s3-notifications:** notifications allowed with imported kms keys ([#18989](https://github.com/aws/aws-cdk/issues/18989)) ([7441418](https://github.com/aws/aws-cdk/commit/7441418fbf9ffdf8d85a573e3c81c45c5648fe8a))
* API compatibility check fails in CI pipeline ([#19069](https://github.com/aws/aws-cdk/issues/19069)) ([6ec1005](https://github.com/aws/aws-cdk/commit/6ec1005c9cfa9723520885748d759b00be5cd2fa)), closes [#19070](https://github.com/aws/aws-cdk/issues/19070)
* **cloudfront:** trim autogenerated cache policy name ([#18953](https://github.com/aws/aws-cdk/issues/18953)) ([c7394c9](https://github.com/aws/aws-cdk/commit/c7394c96c42cb6a5af1e309bee2a5f11eb3ad35c)), closes [#18918](https://github.com/aws/aws-cdk/issues/18918)
* **elasticloadbalancingv2:** validate port/protocol are not provided for lambda targets ([#19043](https://github.com/aws/aws-cdk/issues/19043)) ([64d26cc](https://github.com/aws/aws-cdk/commit/64d26cc22b1fe456777c3367769ddbe860f26cf3)), closes [#12514](https://github.com/aws/aws-cdk/issues/12514)
* **route53:** fix cross account delegation deployment dependency ([#19047](https://github.com/aws/aws-cdk/issues/19047)) ([692a0d0](https://github.com/aws/aws-cdk/commit/692a0d06f2865503d1d88b0ba8af38ecceaec871)), closes [#19041](https://github.com/aws/aws-cdk/issues/19041)

## [2.13.0](https://github.com/aws/aws-cdk/compare/v2.12.0...v2.13.0) (2022-02-18)


### Features

* **aws-stepfunctions-tasks:** add environment property for SageMakerCreateTrainingJob ([#18976](https://github.com/aws/aws-cdk/issues/18976)) ([60d6e66](https://github.com/aws/aws-cdk/commit/60d6e66baef9d30db23e93b16f7c6d159ddf58c4)), closes [#18919](https://github.com/aws/aws-cdk/issues/18919)
* **cfnspec:** cloudformation spec v56.0.0 ([#18930](https://github.com/aws/aws-cdk/issues/18930)) ([24a52ae](https://github.com/aws/aws-cdk/commit/24a52ae1c250ec1875e64d6fc4ef8bec2f47399a))
* **cfnspec:** cloudformation spec v57.0.0 ([#19030](https://github.com/aws/aws-cdk/issues/19030)) ([f0acbc4](https://github.com/aws/aws-cdk/commit/f0acbc469d835ad8808f4176eed53bf2af7c66e2))
* **cli:** hotswap for appsync vtl mapping template changes ([#18881](https://github.com/aws/aws-cdk/issues/18881)) ([9858002](https://github.com/aws/aws-cdk/commit/985800228d04b9c2f3ac117e3b41c7f089547d38))
* **codepipeline:** add support for CloudFormation StackSet actions ([#14225](https://github.com/aws/aws-cdk/issues/14225)) ([d8bc0d0](https://github.com/aws/aws-cdk/commit/d8bc0d08a9796724bb31cc5d7552cf99297678d9))
* **config:** S3_BUCKET_LEVEL_PUBLIC_ACCESS_PROHIBITED managed rule ([#18890](https://github.com/aws/aws-cdk/issues/18890)) ([1a7e3e2](https://github.com/aws/aws-cdk/commit/1a7e3e20e005b4165a27506615c7245b88ce998b)), closes [#18888](https://github.com/aws/aws-cdk/issues/18888)
* **core:** stack synthesizer that uses CLI credentials ([#18963](https://github.com/aws/aws-cdk/issues/18963)) ([a36b72b](https://github.com/aws/aws-cdk/commit/a36b72b5045fceada7c96d00770d8c48f2ca1415)), closes [#16888](https://github.com/aws/aws-cdk/issues/16888)
* **ec2:** allow imdsv2 usage on bastion host ([#18955](https://github.com/aws/aws-cdk/issues/18955)) ([8c6777c](https://github.com/aws/aws-cdk/commit/8c6777c904588f9b911d8b8a5d63a65ae1c7aad9))
* **ecs:** support version stages and ids for Secrets ([#18174](https://github.com/aws/aws-cdk/issues/18174)) ([6d091c2](https://github.com/aws/aws-cdk/commit/6d091c2da7749a81c3752953d0bc7db65ab48f45)), closes [#18123](https://github.com/aws/aws-cdk/issues/18123)
* **events:** API Destinations ([#13729](https://github.com/aws/aws-cdk/issues/13729)) ([2adbc14](https://github.com/aws/aws-cdk/commit/2adbc14bae8266a6bd357e752185133a32e4ca87))
* **lambda:** allow Topic to be dlq for Lambda ([#18546](https://github.com/aws/aws-cdk/issues/18546)) ([f8d8fe4](https://github.com/aws/aws-cdk/commit/f8d8fe4e1397e3d8da91a3a44f025475c8b7f592)), closes [#16246](https://github.com/aws/aws-cdk/issues/16246)
* **logs:** custom Role for Kinesis destination ([#13553](https://github.com/aws/aws-cdk/issues/13553)) ([bb96621](https://github.com/aws/aws-cdk/commit/bb96621d642fedcf1e22086a249034ca1ab63f73)), closes [#7661](https://github.com/aws/aws-cdk/issues/7661)
* **rds:** simpler way to configure parameters for instance and cluster ([#18126](https://github.com/aws/aws-cdk/issues/18126)) ([3ba9088](https://github.com/aws/aws-cdk/commit/3ba90881dab49f47220872e6e5afef3a7732ef13)), closes [#18124](https://github.com/aws/aws-cdk/issues/18124)
* **s3-deployment:** add `deployedBucket` attribute for sequencing ([#15384](https://github.com/aws/aws-cdk/issues/15384)) ([edac101](https://github.com/aws/aws-cdk/commit/edac1011574f3cf38bb0ac39400bf41c66337ffd))


### Bug Fixes

* **assertions:** 'pattern.indexOf' is not a function ([#19009](https://github.com/aws/aws-cdk/issues/19009)) ([6df26e7](https://github.com/aws/aws-cdk/commit/6df26e7ed73455b77b07707debef5bb26ae78909))
* **assertions:** incorrect assertions when >1 messages on a resource ([#18948](https://github.com/aws/aws-cdk/issues/18948)) ([072e1b9](https://github.com/aws/aws-cdk/commit/072e1b990a43768b88a05dd436dd6d6d9649c13a)), closes [#18840](https://github.com/aws/aws-cdk/issues/18840)
* **aws-cdk:** include nested stacks when building changesets ([#17396](https://github.com/aws/aws-cdk/issues/17396)) ([a7dbeef](https://github.com/aws/aws-cdk/commit/a7dbeef9eae3e00e209d06f5cc5bb3bf3d084d18)), closes [#5722](https://github.com/aws/aws-cdk/issues/5722)
* **cli:** handle attributes of AWS::Events::EventBus when hotswapping ([#18834](https://github.com/aws/aws-cdk/issues/18834)) ([a30a32a](https://github.com/aws/aws-cdk/commit/a30a32aaa5dfb764022370fe7867564d57640bfb)), closes [#18831](https://github.com/aws/aws-cdk/issues/18831)
* **core:** undeployable due to invalid mapping ([#18922](https://github.com/aws/aws-cdk/issues/18922)) ([db28485](https://github.com/aws/aws-cdk/commit/db28485f4d2ea243e4184dd06b52395b4980beba)), closes [#18789](https://github.com/aws/aws-cdk/issues/18789) [#18789](https://github.com/aws/aws-cdk/issues/18789)
* **lambda:** unlock use case for cross-account functions w/ preconfigured permissions ([#18979](https://github.com/aws/aws-cdk/issues/18979)) ([023108a](https://github.com/aws/aws-cdk/commit/023108ac080ba34c82ef0b60fee20014c4a78428)), closes [#18228](https://github.com/aws/aws-cdk/issues/18228) [#18781](https://github.com/aws/aws-cdk/issues/18781) [#18967](https://github.com/aws/aws-cdk/issues/18967) [#18781](https://github.com/aws/aws-cdk/issues/18781)
* **lambda:** Validate Lambda "functionName" parameter ([#17970](https://github.com/aws/aws-cdk/issues/17970)) ([a416a2d](https://github.com/aws/aws-cdk/commit/a416a2d68f14c0711d42b38e81b0091d160dfd6f)), closes [#13264](https://github.com/aws/aws-cdk/issues/13264)
* **pipelines:** self-mutate always adds analytics ([#19010](https://github.com/aws/aws-cdk/issues/19010)) ([bc47b29](https://github.com/aws/aws-cdk/commit/bc47b2937a806d6522a4d9106976200bf6810024)), closes [#18933](https://github.com/aws/aws-cdk/issues/18933)
* **stepfunctions:** imported State Machine sill has region and account from its Stack, instead of its ARN ([#19026](https://github.com/aws/aws-cdk/issues/19026)) ([23329b4](https://github.com/aws/aws-cdk/commit/23329b4ac7c845efe7d0e0d7ce03499e7dd723ac)), closes [#17982](https://github.com/aws/aws-cdk/issues/17982)
* python3 version check with Python 3.10 ([#18754](https://github.com/aws/aws-cdk/issues/18754)) ([0ef6527](https://github.com/aws/aws-cdk/commit/0ef65279cc5f2269046e0bae05d44f5aabc43eb9))
* **stepfunctions-tasks:** EMR Create Cluster does not support dynamic allocation of step concurrency level ([#18972](https://github.com/aws/aws-cdk/issues/18972)) ([d19e538](https://github.com/aws/aws-cdk/commit/d19e5386f737aa58f27c7ac2082306006dcd6d95))

## [2.12.0](https://github.com/aws/aws-cdk/compare/v2.11.0...v2.12.0) (2022-02-08)


### ⚠ BREAKING CHANGES TO EXPERIMENTAL FEATURES

* **cxapi:** of behavior.

Instead, this PR gets rid of the entire set of `FUTURE_FLAGS_DEFAULTS`
set to `false` -- there's no point to having them anyway, and it
gets rid of the associated merge conflicts.

Also shore up the docs for these flags a little.

### Miscellaneous Chores

* **cxapi:** reduce merge conflicts in feature flags ([#18411](https://github.com/aws/aws-cdk/issues/18411)) ([dcdb58a](https://github.com/aws/aws-cdk/commit/dcdb58a0481448031ef18c171535c1c4f5872bdd))

## [2.11.0](https://github.com/aws/aws-cdk/compare/v2.10.0...v2.11.0) (2022-02-08)


### Features

* **assets:** support networking mode for DockerImageAsset ([#18114](https://github.com/aws/aws-cdk/issues/18114)) ([a7b39f5](https://github.com/aws/aws-cdk/commit/a7b39f527976e29a7f39c1ba1813efba2e0aa209)), closes [#15516](https://github.com/aws/aws-cdk/issues/15516)
* **cfnspec:** cloudformation spec v54.0.0 ([#18764](https://github.com/aws/aws-cdk/issues/18764)) ([71601c1](https://github.com/aws/aws-cdk/commit/71601c115a6460b4532a34c83100ae70a476fad2))
* **cfnspec:** cloudformation spec v55.0.0 ([#18827](https://github.com/aws/aws-cdk/issues/18827)) ([a1d94b3](https://github.com/aws/aws-cdk/commit/a1d94b3624eb1b6b543d8ce209ec85af8e85beda))
* **cli:** `cdk diff` works for Nested Stacks ([#18207](https://github.com/aws/aws-cdk/issues/18207)) ([1337b24](https://github.com/aws/aws-cdk/commit/1337b247e82d9462074416623e665cf9526d2cc0)), closes [#5722](https://github.com/aws/aws-cdk/issues/5722)
* **cloudwatch-actions:** add ssm opsitem action for cloudwatch alarm  ([#16923](https://github.com/aws/aws-cdk/issues/16923)) ([9380885](https://github.com/aws/aws-cdk/commit/93808851415bff269418f28d9de3c61727e143d3)), closes [#16861](https://github.com/aws/aws-cdk/issues/16861)
* **dynamodb:** allow setting TableClass for a Table ([#18719](https://github.com/aws/aws-cdk/issues/18719)) ([73a889e](https://github.com/aws/aws-cdk/commit/73a889eba85d0aa542ac96a1124f3ae4f1d351bc)), closes [#18718](https://github.com/aws/aws-cdk/issues/18718)
* **ec2:** support KMS keys for block device mappings for both instances and launch templates ([#18326](https://github.com/aws/aws-cdk/issues/18326)) ([17dbe5f](https://github.com/aws/aws-cdk/commit/17dbe5f476ac1ccc0c0e6a0905b0de5ae6186704)), closes [#18309](https://github.com/aws/aws-cdk/issues/18309)
* **ecr:** add server-side encryption configuration  ([#16966](https://github.com/aws/aws-cdk/issues/16966)) ([c46acd5](https://github.com/aws/aws-cdk/commit/c46acd5f13442c43d0c2ed339e3091dd46002741)), closes [#15400](https://github.com/aws/aws-cdk/issues/15400) [#15571](https://github.com/aws/aws-cdk/issues/15571)
* **ecs:** expose image name in container definition ([#17793](https://github.com/aws/aws-cdk/issues/17793)) ([1947d7c](https://github.com/aws/aws-cdk/commit/1947d7cc809fda0765bee3dbb2286190ec2847f7))
* **fsx:** add support for FSx Lustre Persistent_2 deployment type ([#18626](https://github.com/aws/aws-cdk/issues/18626)) ([6036d99](https://github.com/aws/aws-cdk/commit/6036d9927bb3607e31a57361bf304976ff1891f7))
* **s3-deployment:** deploy data with deploy-time values ([#18659](https://github.com/aws/aws-cdk/issues/18659)) ([d40e332](https://github.com/aws/aws-cdk/commit/d40e332578f7590a0c949fdd01622a644cf9359b)), closes [#12903](https://github.com/aws/aws-cdk/issues/12903)


### Bug Fixes

* **core:** correctly reference versionless secure parameters ([#18730](https://github.com/aws/aws-cdk/issues/18730)) ([9f6e10e](https://github.com/aws/aws-cdk/commit/9f6e10ed0a751c06fe0cc1d79f38d5fb4b686087)), closes [#18729](https://github.com/aws/aws-cdk/issues/18729)
* **ec2:** `UserData.addSignalOnExitCommand` does not work in combination with `userDataCausesReplacement` ([#18726](https://github.com/aws/aws-cdk/issues/18726)) ([afdc550](https://github.com/aws/aws-cdk/commit/afdc550ee372dd25d9d2eef81a545da1e923f796)), closes [#12749](https://github.com/aws/aws-cdk/issues/12749)
* **tooling:** update vscode devcontainer image ([#18455](https://github.com/aws/aws-cdk/issues/18455)) ([28647f7](https://github.com/aws/aws-cdk/commit/28647f7105da6bd02975aa7d90300d77fe85d0e6))
* **vpc:** Vpc.fromLookup should throw if subnet group name tag is explicitly given and does not exist ([#18714](https://github.com/aws/aws-cdk/issues/18714)) ([13e1c7f](https://github.com/aws/aws-cdk/commit/13e1c7f10b81fc350953fe69fcccb61ff5aa9c1e)), closes [#13962](https://github.com/aws/aws-cdk/issues/13962)


### Reverts

* "chore(cloudfront): encryption and enforceSSL on distribution s3 loggingBucket ([#18264](https://github.com/aws/aws-cdk/issues/18264))" ([#18772](https://github.com/aws/aws-cdk/issues/18772)) ([121e4a1](https://github.com/aws/aws-cdk/commit/121e4a1dec13d31644f6176d0a1d703952dc1ba3)), closes [#18271](https://github.com/aws/aws-cdk/issues/18271) [/docs.aws.amazon.com/AmazonCloudWatch/latest/logs/AWS-logs-and-resource-policy.html#AWS-logs-infrastructure-S3](https://github.com/aws//docs.aws.amazon.com/AmazonCloudWatch/latest/logs/AWS-logs-and-resource-policy.html/issues/AWS-logs-infrastructure-S3) [#18676](https://github.com/aws/aws-cdk/issues/18676)
* "chore(ec2): enforceSSL on flowLog s3 bucket ([#18271](https://github.com/aws/aws-cdk/issues/18271))" ([#18770](https://github.com/aws/aws-cdk/issues/18770)) ([a2eb092](https://github.com/aws/aws-cdk/commit/a2eb092b2b468bffa2acde9b98ca34cefa3e48f1)), closes [/docs.aws.amazon.com/AmazonCloudWatch/latest/logs/AWS-logs-and-resource-policy.html#AWS-logs-infrastructure-S3](https://github.com/aws//docs.aws.amazon.com/AmazonCloudWatch/latest/logs/AWS-logs-and-resource-policy.html/issues/AWS-logs-infrastructure-S3) [#18676](https://github.com/aws/aws-cdk/issues/18676)

## [2.10.0](https://github.com/aws/aws-cdk/compare/v2.9.0...v2.10.0) (2022-01-29)


### Features

* **assertions:** support assertions on stack messages ([#18521](https://github.com/aws/aws-cdk/issues/18521)) ([cb86e30](https://github.com/aws/aws-cdk/commit/cb86e30391aefdda13e6b0d4b3be2fedf76477c8)), closes [#18347](https://github.com/aws/aws-cdk/issues/18347)
* **aws-ecs-patterns:** adding support for custom HealthCheck while creating QueueProcessingFargateService ([#18219](https://github.com/aws/aws-cdk/issues/18219)) ([0ca81a1](https://github.com/aws/aws-cdk/commit/0ca81a118d3d54b87d2d05a53fb72e4efe03b591)), closes [#15636](https://github.com/aws/aws-cdk/issues/15636)
* **certificatemanager:** DnsValidatedCertificate DNS record cleanup ([#18311](https://github.com/aws/aws-cdk/issues/18311)) ([36d356d](https://github.com/aws/aws-cdk/commit/36d356d0b3e422f7451f4b0dd2f971aa0378210e)), closes [#3333](https://github.com/aws/aws-cdk/issues/3333) [#7063](https://github.com/aws/aws-cdk/issues/7063)
* **cfnspec:** cloudformation spec v53.1.0 ([#18588](https://github.com/aws/aws-cdk/issues/18588)) ([a283a48](https://github.com/aws/aws-cdk/commit/a283a482dead64e94383ba21cc7908f10c4459a2))
* **cfnspec:** cloudformation spec v53.1.0 ([#18658](https://github.com/aws/aws-cdk/issues/18658)) ([2eda19e](https://github.com/aws/aws-cdk/commit/2eda19e510374426190531810cff518d582644ad))
* **cfnspec:** cloudformation spec v53.1.0 ([#18680](https://github.com/aws/aws-cdk/issues/18680)) ([f385059](https://github.com/aws/aws-cdk/commit/f38505911a3e140a9cb6b269bdf22abe9803c515))
* **cloudfront-origins:** extend `readTimeout` maximum value for `HttpOriginProps` ([#18697](https://github.com/aws/aws-cdk/issues/18697)) ([e64de67](https://github.com/aws/aws-cdk/commit/e64de677cdfc014f68e92b204f4728e60a8bb111)), closes [#18628](https://github.com/aws/aws-cdk/issues/18628)
* **ec2:** session timeout and login banner for client vpn endpoint ([#18590](https://github.com/aws/aws-cdk/issues/18590)) ([7294118](https://github.com/aws/aws-cdk/commit/72941180a7188e5560a58f1509554ef038544ec4))
* **ecs:** add `BaseService.fromServiceArnWithCluster()` for use in CodePipeline ([#18530](https://github.com/aws/aws-cdk/issues/18530)) ([3d192a9](https://github.com/aws/aws-cdk/commit/3d192a9a832857cb246d719a68b4b8f40d807fed))
* **eks:** cluster logging ([#18112](https://github.com/aws/aws-cdk/issues/18112)) ([872277b](https://github.com/aws/aws-cdk/commit/872277b9e853dbf5f2cac84b5afb6d26e0ed5659)), closes [#4159](https://github.com/aws/aws-cdk/issues/4159)
* **lambda-nodejs:** Allow setting mainFields for esbuild ([#18569](https://github.com/aws/aws-cdk/issues/18569)) ([0e78aeb](https://github.com/aws/aws-cdk/commit/0e78aeb9ad62226e67f72f23c0008ba749b3a73b))
* **s3:** custom role for the bucket notifications handler ([#17794](https://github.com/aws/aws-cdk/issues/17794)) ([43f232d](https://github.com/aws/aws-cdk/commit/43f232ddc0a18e9a2fada2fbead758ab3538adc2)), closes [#9918](https://github.com/aws/aws-cdk/issues/9918) [#13241](https://github.com/aws/aws-cdk/issues/13241)


### Bug Fixes

* **aws-apigateway:** cross region authorizer ref ([#18444](https://github.com/aws/aws-cdk/issues/18444)) ([0e0a092](https://github.com/aws/aws-cdk/commit/0e0a0922ba1d538abdfeb61a260c262109115038))
* **aws-lambda-nodejs:** pre compilation with tsc is not being run ([#18062](https://github.com/aws/aws-cdk/issues/18062)) ([7ac7221](https://github.com/aws/aws-cdk/commit/7ac7221aff3c612ab80e7812c371b11c56e5db0a)), closes [#18002](https://github.com/aws/aws-cdk/issues/18002)
* **cli:** hotswap should wait for lambda's `updateFunctionCode` to complete ([#18536](https://github.com/aws/aws-cdk/issues/18536)) ([0e08eeb](https://github.com/aws/aws-cdk/commit/0e08eebd2f13ab0da6cac7b91288845cad530192)), closes [#18386](https://github.com/aws/aws-cdk/issues/18386) [#18386](https://github.com/aws/aws-cdk/issues/18386)
* **elasticloadbalancingv2:** ApplicationLoadBalancer.logAccessLogs does not grant all necessary permissions ([#18558](https://github.com/aws/aws-cdk/issues/18558)) ([bde1795](https://github.com/aws/aws-cdk/commit/bde17950293309b7449fc412301634770b47111f)), closes [#18367](https://github.com/aws/aws-cdk/issues/18367)
* **pipelines:** undeployable due to dependency cycle ([#18686](https://github.com/aws/aws-cdk/issues/18686)) ([009d689](https://github.com/aws/aws-cdk/commit/009d68912267de9dcf4136a7d80a652a891b7bb9)), closes [#18492](https://github.com/aws/aws-cdk/issues/18492) [#18673](https://github.com/aws/aws-cdk/issues/18673)
* **region-info:** incorrect codedeploy service principals ([#18505](https://github.com/aws/aws-cdk/issues/18505)) ([16db963](https://github.com/aws/aws-cdk/commit/16db9639e86f1fd6f26a1054f4d6df24801d0f05))
* **route53:** add RoutingControlArn to HealthCheck patch ([#18645](https://github.com/aws/aws-cdk/issues/18645)) ([c58e8bb](https://github.com/aws/aws-cdk/commit/c58e8bbbcb0a66c37b65cddc1da8d19dfbf26b4f)), closes [#18570](https://github.com/aws/aws-cdk/issues/18570)
* **s3:** add missing safe actions to `grantWrite`, `grantReadWrite` and `grantPut` methods ([#18494](https://github.com/aws/aws-cdk/issues/18494)) ([940d043](https://github.com/aws/aws-cdk/commit/940d0439cd347f06d755f3e3dd0582470749f710)), closes [#13616](https://github.com/aws/aws-cdk/issues/13616)
* **secretsmanager:** SecretRotation for secret imported by name has incorrect permissions ([#18567](https://github.com/aws/aws-cdk/issues/18567)) ([9ed263c](https://github.com/aws/aws-cdk/commit/9ed263cde0b41959ff267720c0978bfe7449337a)), closes [#18424](https://github.com/aws/aws-cdk/issues/18424)
* **stepfunctions:** task token integration cannot be used with API Gateway ([#18595](https://github.com/aws/aws-cdk/issues/18595)) ([678eede](https://github.com/aws/aws-cdk/commit/678eeded5d5631dbacff43ead697ecbd3bd4b27d)), closes [#14184](https://github.com/aws/aws-cdk/issues/14184) [#14181](https://github.com/aws/aws-cdk/issues/14181)
* **stepfunctions-tasks:** cluster creation fails with unresolved release labels ([#18288](https://github.com/aws/aws-cdk/issues/18288)) ([9940952](https://github.com/aws/aws-cdk/commit/9940952d67bdf07f3d737dc88676dc7f7c435a12))

## [2.9.0](https://github.com/aws/aws-cdk/compare/v2.8.0...v2.9.0) (2022-01-26)


### Features

* **assertions:** `stringLikeRegexp()` matcher ([#18491](https://github.com/aws/aws-cdk/issues/18491)) ([b49b002](https://github.com/aws/aws-cdk/commit/b49b002e40f5b901935f52827f417bb3851badc2))
* **assertions:** support for conditions ([#18577](https://github.com/aws/aws-cdk/issues/18577)) ([55ff1b2](https://github.com/aws/aws-cdk/commit/55ff1b2e69f1b42bbbecd9dc95e17f2ffc35f94e)), closes [#18560](https://github.com/aws/aws-cdk/issues/18560)
* **assertions:** support for parameters ([#18469](https://github.com/aws/aws-cdk/issues/18469)) ([d0d6fc5](https://github.com/aws/aws-cdk/commit/d0d6fc520491351b44cac78aa90284c82a9499b2)), closes [#16720](https://github.com/aws/aws-cdk/issues/16720)
* **cfnspec:** cloudformation spec v53.0.0 ([#18468](https://github.com/aws/aws-cdk/issues/18468)) ([50637e0](https://github.com/aws/aws-cdk/commit/50637e08590c2051d9a1e446ee7ded47e85d02b3))
* **cfnspec:** cloudformation spec v53.0.0 ([#18480](https://github.com/aws/aws-cdk/issues/18480)) ([38e1fe4](https://github.com/aws/aws-cdk/commit/38e1fe42d8b30d6afaf4a3ccc90dd15d6a5d8255))
* **cfnspec:** cloudformation spec v53.0.0 ([#18524](https://github.com/aws/aws-cdk/issues/18524)) ([517d517](https://github.com/aws/aws-cdk/commit/517d517a0bb3f7f6e98538dca736086b86b206c8))
* **cfnspec:** cloudformation spec v53.0.0 ([#18551](https://github.com/aws/aws-cdk/issues/18551)) ([926310b](https://github.com/aws/aws-cdk/commit/926310bace65a763972d56c0df5730cdc44f8f82))
* **cli:** support hotswapping Lambda functions that use Docker images ([#18319](https://github.com/aws/aws-cdk/issues/18319)) ([6b553b7](https://github.com/aws/aws-cdk/commit/6b553b7f84e5cde8a1fc533af95ad440c020e834)), closes [#18302](https://github.com/aws/aws-cdk/issues/18302) [#18408](https://github.com/aws/aws-cdk/issues/18408)
* **cli:** support hotswapping Lambda functions with inline code ([#18408](https://github.com/aws/aws-cdk/issues/18408)) ([d0b8512](https://github.com/aws/aws-cdk/commit/d0b8512449759bf74bb53aabbb6d5224b5f8c5ae)), closes [#18319](https://github.com/aws/aws-cdk/issues/18319)
* **cognito:** identity pools ([#16190](https://github.com/aws/aws-cdk/issues/16190)) ([59fe395](https://github.com/aws/aws-cdk/commit/59fe395a5adcd35bd59c6d9c74f4a2606aec88b0))
* **ec2:** add Hpc6a instances ([#18445](https://github.com/aws/aws-cdk/issues/18445)) ([c7f39ca](https://github.com/aws/aws-cdk/commit/c7f39ca97874c1d8d5286ab347a97fc458547830))
* **ec2:** add support for al2022 and amzn2 with kernel 5.x ([#18117](https://github.com/aws/aws-cdk/issues/18117)) ([6b73d1d](https://github.com/aws/aws-cdk/commit/6b73d1d3d0ac05042c1e43a64068938138fe8421))
* **ec2:** create Peers via security group ids ([#18248](https://github.com/aws/aws-cdk/issues/18248)) ([9d1b2c7](https://github.com/aws/aws-cdk/commit/9d1b2c7b1f0147089f912c32a61d7ba86edb543c)), closes [#7111](https://github.com/aws/aws-cdk/issues/7111)
* **opensearch:** added opensearch 1.1 to engineversion ([#18432](https://github.com/aws/aws-cdk/issues/18432)) ([e01a57a](https://github.com/aws/aws-cdk/commit/e01a57aa3085a8282123afbc3583b1b78a075c9a)), closes [#18431](https://github.com/aws/aws-cdk/issues/18431)


### Bug Fixes

* **apigateway:** `enabled` property of `ApiKeyProps` is ignored ([#18407](https://github.com/aws/aws-cdk/issues/18407)) ([c31f9b4](https://github.com/aws/aws-cdk/commit/c31f9b44165f872f8dd51605e00f4801ed611d4d))
* **applicationautoscaling:** typo in `DYANMODB_WRITE_CAPACITY_UTILIZATION` ([#18085](https://github.com/aws/aws-cdk/issues/18085)) ([626e6aa](https://github.com/aws/aws-cdk/commit/626e6aa1a27feffe7ce60a46a6fdcf26f317eaef)), closes [#17209](https://github.com/aws/aws-cdk/issues/17209)
* **assertions:** object partiality is dropped passing through arrays ([#18525](https://github.com/aws/aws-cdk/issues/18525)) ([eb29e6f](https://github.com/aws/aws-cdk/commit/eb29e6ff0308eb320ec772cc35cdbf781168198e))
* **cli:** `cdk watch` constantly prints 'messages suppressed'  ([#18486](https://github.com/aws/aws-cdk/issues/18486)) ([9b266f4](https://github.com/aws/aws-cdk/commit/9b266f49643d058709771892f908f1c2ae248f95)), closes [#18451](https://github.com/aws/aws-cdk/issues/18451)
* **cli:** warning to upgrade to bootstrap version >= undefined ([#18489](https://github.com/aws/aws-cdk/issues/18489)) ([da5a305](https://github.com/aws/aws-cdk/commit/da5a305875f0b82b896861be3fcb12fddaa0cc7b))
* **ec2:** interface endpoints do not work with `Vpc.fromLookup()` ([#18554](https://github.com/aws/aws-cdk/issues/18554)) ([f55cd2b](https://github.com/aws/aws-cdk/commit/f55cd2bd86405cc61d3eb24c2b827c2cd133363d)), closes [#17600](https://github.com/aws/aws-cdk/issues/17600)
* **ec2:** launch template names in imdsv2 not unique across stacks (under feature flag) ([#17766](https://github.com/aws/aws-cdk/issues/17766)) ([2a80e4b](https://github.com/aws/aws-cdk/commit/2a80e4b113bac0716f5aa1d4806e425759da1743))
* **ecs:** only works in 'aws' partition ([#18496](https://github.com/aws/aws-cdk/issues/18496)) ([525ac07](https://github.com/aws/aws-cdk/commit/525ac07369e33e2f36b7a0eea7913e43649484db)), closes [#18429](https://github.com/aws/aws-cdk/issues/18429)
* **ecs-patterns:** Fix Network Load Balancer Port assignments in ECS Patterns ([#18157](https://github.com/aws/aws-cdk/issues/18157)) ([1393729](https://github.com/aws/aws-cdk/commit/13937299596d0b858d56e9116bf7a7dbe039d4b4)), closes [#18073](https://github.com/aws/aws-cdk/issues/18073)
* **elbv2:** BaseLoadBalancer.vpc is not optional ([#18474](https://github.com/aws/aws-cdk/issues/18474)) ([f511c17](https://github.com/aws/aws-cdk/commit/f511c17aac8ca4d3fa94ace051d9946dc23f40a3)), closes [aws/jsii#3342](https://github.com/aws/jsii/issues/3342)
* **pipelines:** "Maximum schema version supported" error ([#18404](https://github.com/aws/aws-cdk/issues/18404)) ([a684ff4](https://github.com/aws/aws-cdk/commit/a684ff47d56038a94c82cdbad9588da939963351)), closes [#18370](https://github.com/aws/aws-cdk/issues/18370)
* **pipelines:** CodeBuild projects are hard to tell apart ([#18492](https://github.com/aws/aws-cdk/issues/18492)) ([f6dab8d](https://github.com/aws/aws-cdk/commit/f6dab8d8c5aa4cf56d6846e2d13c1d5641136f72))
* **pipelines:** graphnode dependencies can have duplicates ([#18450](https://github.com/aws/aws-cdk/issues/18450)) ([2b0b5ea](https://github.com/aws/aws-cdk/commit/2b0b5ea5db7ce8103a641c1267b1c213453ac145))
* **secretsmanager:** Secret requires KMS key for some same-account access ([#17812](https://github.com/aws/aws-cdk/issues/17812)) ([91f3539](https://github.com/aws/aws-cdk/commit/91f3539f4aa8383adcb2273790ddb469fb1274a6)), closes [#15450](https://github.com/aws/aws-cdk/issues/15450)


### Reverts

* **s3:** add EventBridge bucket notifications ([#18150](https://github.com/aws/aws-cdk/issues/18150)) ([#18507](https://github.com/aws/aws-cdk/issues/18507)) ([2041278](https://github.com/aws/aws-cdk/commit/204127862d5fb1d2e6dd573a1621254e52eca4aa))

## [2.8.0](https://github.com/aws/aws-cdk/compare/v2.7.0...v2.8.0) (2022-01-13)


### Features

* **aws-s3:** support number of newer versions to retain in lifecycle policy ([#18225](https://github.com/aws/aws-cdk/issues/18225)) ([e1731b1](https://github.com/aws/aws-cdk/commit/e1731b11c9417a9a4d6cf0f2089c62a721e8d074)), closes [#17996](https://github.com/aws/aws-cdk/issues/17996) [#17996](https://github.com/aws/aws-cdk/issues/17996)
* **cli:** watch streams resources' CloudWatch logs to the terminal ([#18159](https://github.com/aws/aws-cdk/issues/18159)) ([a9038ae](https://github.com/aws/aws-cdk/commit/a9038ae9c7d9b15b89ae24cfa24aefa6012674bc)), closes [#18122](https://github.com/aws/aws-cdk/issues/18122)
* **ecs-service-extensions:** Enable default logging to CloudWatch for extensions (under feature flag) ([#17817](https://github.com/aws/aws-cdk/issues/17817)) ([06666f4](https://github.com/aws/aws-cdk/commit/06666f4727b9745d001bc20f027b535538bb8250))


### Bug Fixes

* **ecs:** respect LogGroup's region for aws-log-driver ([#18212](https://github.com/aws/aws-cdk/issues/18212)) ([b6e3e51](https://github.com/aws/aws-cdk/commit/b6e3e517ac42b7951bc4ca4c1fd62422e3b49092)), closes [#17747](https://github.com/aws/aws-cdk/issues/17747)

## [2.7.0](https://github.com/aws/aws-cdk/compare/v2.6.0...v2.7.0) (2022-01-12)


### Features

* **aws-ecs:** support runtime platform property for create fargate windows runtime. ([#17622](https://github.com/aws/aws-cdk/issues/17622)) ([fa8f2e2](https://github.com/aws/aws-cdk/commit/fa8f2e2180d60e5621d2ae9606a3d1b2dcb681d9)), closes [#17242](https://github.com/aws/aws-cdk/issues/17242)
* **cli:** diff now uses the lookup Role for new-style synthesis ([#18277](https://github.com/aws/aws-cdk/issues/18277)) ([2256680](https://github.com/aws/aws-cdk/commit/225668050caef9bfdaa25b8ae984d3886108397f))
* **eks:** cluster tagging ([#4995](https://github.com/aws/aws-cdk/issues/4995)) ([#18109](https://github.com/aws/aws-cdk/issues/18109)) ([304f5b6](https://github.com/aws/aws-cdk/commit/304f5b6974f1121a8a5ff802076dffe2eff9f407))
* **iam:** generate AccessKeys ([#18180](https://github.com/aws/aws-cdk/issues/18180)) ([beb5706](https://github.com/aws/aws-cdk/commit/beb5706e0c80300c8adba2b75b573f6c6def3de6)), closes [#8432](https://github.com/aws/aws-cdk/issues/8432)
* **lambda-event-sources:** adds `AuthenticationMethod.CLIENT_CERTIFICATE_TLS_AUTH` to kafka ([#17920](https://github.com/aws/aws-cdk/issues/17920)) ([93cd776](https://github.com/aws/aws-cdk/commit/93cd7769b7b68ab6985c357c4d2f2137bb631553))
* **lambda-nodejs:** ES modules ([#18346](https://github.com/aws/aws-cdk/issues/18346)) ([e23b63f](https://github.com/aws/aws-cdk/commit/e23b63fc106c4781e3dd39a16d4a3e3c81bdd874)), closes [#13274](https://github.com/aws/aws-cdk/issues/13274)
* **s3:** add EventBridge bucket notifications ([#18150](https://github.com/aws/aws-cdk/issues/18150)) ([912aeda](https://github.com/aws/aws-cdk/commit/912aeda295820920ed880b9c85a98c56421647b8)), closes [#18076](https://github.com/aws/aws-cdk/issues/18076)


### Bug Fixes

* **aws-lambda-event-sources:** unsupported properties for SelfManagedKafkaEventSource and ManagedKafkaEventSource ([#17965](https://github.com/aws/aws-cdk/issues/17965)) ([5ddaef4](https://github.com/aws/aws-cdk/commit/5ddaef491d7962616f75f170cf7547cd9229338f)), closes [#17934](https://github.com/aws/aws-cdk/issues/17934)
* **cli:** assets are KMS-encrypted using wrong key ([#18340](https://github.com/aws/aws-cdk/issues/18340)) ([64ae9f3](https://github.com/aws/aws-cdk/commit/64ae9f3dc8a169ad0a7a2d02cb04f857debd3653)), closes [#17668](https://github.com/aws/aws-cdk/issues/17668) [#18262](https://github.com/aws/aws-cdk/issues/18262)
* **cli:** breaks due to faulty version of `colors` ([#18324](https://github.com/aws/aws-cdk/issues/18324)) ([43bf9ae](https://github.com/aws/aws-cdk/commit/43bf9aec0b3c5e06d5382b29f4e8e0c91cd796ca))
* **cli:** breaks due to faulty version of `colors` ([#18324](https://github.com/aws/aws-cdk/issues/18324)) ([ddc2bc6](https://github.com/aws/aws-cdk/commit/ddc2bc6ae64fe14ddb4a03122c90dfcf954f149f))
* **pipelines:** `DockerCredential.dockerHub()` silently fails auth ([#18313](https://github.com/aws/aws-cdk/issues/18313)) ([c2c87d9](https://github.com/aws/aws-cdk/commit/c2c87d9dd861a25dcbd9aa830e81ecb4d76ba509)), closes [/github.com/moby/moby/blob/1e71c6cffedb79e3def696652753ea43cdc47b99/registry/config.go#L35](https://github.com/aws//github.com/moby/moby/blob/1e71c6cffedb79e3def696652753ea43cdc47b99/registry/config.go/issues/L35) [/github.com/aws/aws-cdk/blob/4fb0309e3b93be276ab3e2d510ffc2ce35823dcd/packages/cdk-assets/bin/docker-credential-cdk-assets.ts#L32-L38](https://github.com/aws//github.com/aws/aws-cdk/blob/4fb0309e3b93be276ab3e2d510ffc2ce35823dcd/packages/cdk-assets/bin/docker-credential-cdk-assets.ts/issues/L32-L38) [#15737](https://github.com/aws/aws-cdk/issues/15737)

## [2.6.0](https://github.com/aws/aws-cdk/compare/v2.5.0...v2.6.0) (2022-01-12)


### Bug Fixes

* **appmesh:** allow a Virtual Node have as a backend a Virtual Service whose provider is that Node ([#18265](https://github.com/aws/aws-cdk/issues/18265)) ([272b6b1](https://github.com/aws/aws-cdk/commit/272b6b1abe22b7415eed5cdba82056d154fc31d7)), closes [#17322](https://github.com/aws/aws-cdk/issues/17322)

## [2.5.0](https://github.com/aws/aws-cdk/compare/v2.4.0...v2.5.0) (2022-01-09)


### Bug Fixes

* **aws-kinesis:** remove default shard count when stream mode is on-demand and set default mode to provisioned ([#18221](https://github.com/aws/aws-cdk/issues/18221)) ([cac11bb](https://github.com/aws/aws-cdk/commit/cac11bba2ea0714dec8e23b069496d1b9d940685)), closes [#18139](https://github.com/aws/aws-cdk/issues/18139)
* **cli:** breaks due to faulty version of `colors` ([#18324](https://github.com/aws/aws-cdk/issues/18324)) ([#18328](https://github.com/aws/aws-cdk/issues/18328)) ([b851bc3](https://github.com/aws/aws-cdk/commit/b851bc340ce0aeb0f6b99c6f54bceda892bfad0e))

## [2.4.0](https://github.com/aws/aws-cdk/compare/v2.3.0...v2.4.0) (2022-01-06)


### ⚠ BREAKING CHANGES TO EXPERIMENTAL FEATURES

* **cfn2ts:** some "complex" property types within the generated
CloudFormation interfaces (i.e: properties of `Cfn*` constructs) with
names starting with a capital letter `I` followed by another capital
letter are no longer incorrectly treated as behavioral interfaces, and
might hence have different usage patterns in non-TypeScript languages.
Such interfaces were previously very difficult to use in non-TypeScript
languages, and required convoluted workarounds, which can now be removed.
* **opensearchservice:** imported domain property `domainEndpoint` used to contain `https://` prefix, now the prefix is dropped and it returns the same value as a `domainEndpoint` on a created domain

### Features

* **apigateway:** Add stage ARN attribute ([#18170](https://github.com/aws/aws-cdk/issues/18170)) ([be7acfd](https://github.com/aws/aws-cdk/commit/be7acfd54fbfe41a608fb8469657701de2b2a383)), closes [/docs.aws.amazon.com/apigateway/latest/developerguide/arn-format-reference.html#apigateway-v1](https://github.com/aws//docs.aws.amazon.com/apigateway/latest/developerguide/arn-format-reference.html/issues/apigateway-v1)
* **aws-autoscaling:** Add support for termination policies ([#17936](https://github.com/aws/aws-cdk/issues/17936)) ([9e6f977](https://github.com/aws/aws-cdk/commit/9e6f977d8ac4ad7ab2852536cc20c4469fe74f03)), closes [#15654](https://github.com/aws/aws-cdk/issues/15654)
* **aws-ec2:** add g4ad instance types ([#17927](https://github.com/aws/aws-cdk/issues/17927)) ([8cb6a76](https://github.com/aws/aws-cdk/commit/8cb6a768cd4310628925fa117b674ae456aa8474)), closes [/docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-instance.html#cfn-ec2](https://github.com/aws//docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-instance.html/issues/cfn-ec2) [#17565](https://github.com/aws/aws-cdk/issues/17565)
* **aws-kinesis:** add support for data streams capacity modes ([#18074](https://github.com/aws/aws-cdk/issues/18074)) ([b265e46](https://github.com/aws/aws-cdk/commit/b265e4612a45af44defb7b6e1ff4a51c0231d10e)), closes [#18050](https://github.com/aws/aws-cdk/issues/18050)
* **aws-s3:** Adding Intelligent Tiering to Bucket ([#18013](https://github.com/aws/aws-cdk/issues/18013)) ([890c4c5](https://github.com/aws/aws-cdk/commit/890c4c5f9d4835b39c8448e47c781b5e8334cd60)), closes [#16191](https://github.com/aws/aws-cdk/issues/16191)
* **backup:** support continuous backup and point-in-time restores ([#17602](https://github.com/aws/aws-cdk/issues/17602)) ([24c6ef5](https://github.com/aws/aws-cdk/commit/24c6ef5164c66fa79b16fd5c8645e82764a52f87)), closes [#15922](https://github.com/aws/aws-cdk/issues/15922)
* **bootstrap:** ECR `ScanOnPush` is now enabled by default ([#17994](https://github.com/aws/aws-cdk/issues/17994)) ([7588b51](https://github.com/aws/aws-cdk/commit/7588b517eb17bb5198f91056113eb79a34830867))
* **cfnspec:** add CloudFormation documentation to L1 classes ([#18101](https://github.com/aws/aws-cdk/issues/18101)) ([0ed661d](https://github.com/aws/aws-cdk/commit/0ed661df0b060d0ec4c502b92511b3e777144854))
* **cfnspec:** cloudformation spec v51.0.0 ([#18274](https://github.com/aws/aws-cdk/issues/18274)) ([c208e60](https://github.com/aws/aws-cdk/commit/c208e6043e4a184b4d3ac2508ebef1cb31bace43))
* **cli:** add message when resource is hotswapped ([#18058](https://github.com/aws/aws-cdk/issues/18058)) ([e828c22](https://github.com/aws/aws-cdk/commit/e828c2229394fdf29699fd167c380bc229ea48e3)), closes [#17778](https://github.com/aws/aws-cdk/issues/17778)
* **cli:** hotswap deployments for CodeBuild projects ([#18161](https://github.com/aws/aws-cdk/issues/18161)) ([4ae4df8](https://github.com/aws/aws-cdk/commit/4ae4df8388e6346d4bcb8700059e8268d7e1daac))
* **cli:** show how long `cdk deploy` steps take  ([#18230](https://github.com/aws/aws-cdk/issues/18230)) ([82fa742](https://github.com/aws/aws-cdk/commit/82fa7428d1a66e3a95692551bd4dae30a5fee771)), closes [#18213](https://github.com/aws/aws-cdk/issues/18213)
* **cli:** support for hotswapping Lambda Versions and Aliases ([#18145](https://github.com/aws/aws-cdk/issues/18145)) ([13d77b7](https://github.com/aws/aws-cdk/commit/13d77b75327eede6bce63a57f6c319c86aead6ec)), closes [#18058](https://github.com/aws/aws-cdk/issues/18058) [#17043](https://github.com/aws/aws-cdk/issues/17043)
* **cli:** support hotswapping Lambda function tags ([#17818](https://github.com/aws/aws-cdk/issues/17818)) ([e4485f4](https://github.com/aws/aws-cdk/commit/e4485f4371dd5aafa538efeb82e016c40d197789)), closes [#17664](https://github.com/aws/aws-cdk/issues/17664)
* **cli:** watch command now starts with a deployment ([#18057](https://github.com/aws/aws-cdk/issues/18057)) ([ace37a2](https://github.com/aws/aws-cdk/commit/ace37a24fda06616f7bbb5e2c9de01877d2ef0d7)), closes [#17776](https://github.com/aws/aws-cdk/issues/17776)
* **codecommit:** allow initializing a Repository with contents ([#17968](https://github.com/aws/aws-cdk/issues/17968)) ([54b6cc6](https://github.com/aws/aws-cdk/commit/54b6cc677f2b1c0ffd6a183fe6b935ad1012cf63)), closes [#17967](https://github.com/aws/aws-cdk/issues/17967) [#16958](https://github.com/aws/aws-cdk/issues/16958)
* **codedeploy:** loadbalancer support for imported Target Groups ([#17848](https://github.com/aws/aws-cdk/issues/17848)) ([32f1c80](https://github.com/aws/aws-cdk/commit/32f1c807a34464e8c13a8d03bfdcb6a3006f51ba)), closes [#9677](https://github.com/aws/aws-cdk/issues/9677)
* **codepipeline:** add ability to not reuse cross-region support Stacks ([#18043](https://github.com/aws/aws-cdk/issues/18043)) ([dcc9e59](https://github.com/aws/aws-cdk/commit/dcc9e59d55d17dd71217659573d5f1879295eb1b)), closes [#18018](https://github.com/aws/aws-cdk/issues/18018) [#18018](https://github.com/aws/aws-cdk/issues/18018)
* **codepipeline:** variables for CodeStar Connections source Action ([#18086](https://github.com/aws/aws-cdk/issues/18086)) ([c99da16](https://github.com/aws/aws-cdk/commit/c99da16aae68437d1546c8ad431d7050f954ffac)), closes [#17807](https://github.com/aws/aws-cdk/issues/17807)
* **custom-resources:** NoEcho for sensitive data in provider framework ([#18097](https://github.com/aws/aws-cdk/issues/18097)) ([621a410](https://github.com/aws/aws-cdk/commit/621a410471fcda0e388a7a53bb0e3cdb77be759c))
* **docdb:** allow setting log retention ([#18120](https://github.com/aws/aws-cdk/issues/18120)) ([002202f](https://github.com/aws/aws-cdk/commit/002202fd7e32192214017772a99f9e17072bd0d8)), closes [#13191](https://github.com/aws/aws-cdk/issues/13191)
* **ec2:** add Windows Server 2022 WindowsVersions ([#18203](https://github.com/aws/aws-cdk/issues/18203)) ([dee732d](https://github.com/aws/aws-cdk/commit/dee732d063c0658b768bf7b9f24087b8baed2ed6)), closes [#18199](https://github.com/aws/aws-cdk/issues/18199)
* **efs:** add support for transitioning files from infrequent access to primary storage  ([#16522](https://github.com/aws/aws-cdk/issues/16522)) ([65414c6](https://github.com/aws/aws-cdk/commit/65414c655bfd08fab0c8113c7cfae19871a611c3))
* **eks:** imported kubectl provider for imported clusters ([#14689](https://github.com/aws/aws-cdk/issues/14689)) ([19a287f](https://github.com/aws/aws-cdk/commit/19a287f02bc427644837956466213ee65457a857)), closes [issue#12107](https://github.com/aws/issue/issues/12107)
* **eks:** install helm chart from asset ([#17217](https://github.com/aws/aws-cdk/issues/17217)) ([d3fc8c0](https://github.com/aws/aws-cdk/commit/d3fc8c07e2262a9f871e3a2b91f6e85471efd794)), closes [#13496](https://github.com/aws/aws-cdk/issues/13496) [#15899](https://github.com/aws/aws-cdk/issues/15899) [/github.com/aws/aws-cdk/pull/15899/files#r683431181](https://github.com/aws//github.com/aws/aws-cdk/pull/15899/files/issues/r683431181) [#9273](https://github.com/aws/aws-cdk/issues/9273)
* **iam:** session tagging ([#17689](https://github.com/aws/aws-cdk/issues/17689)) ([9f22b2f](https://github.com/aws/aws-cdk/commit/9f22b2f89d6fe6930cbc57a37d0c72e823b58cf8)), closes [#15908](https://github.com/aws/aws-cdk/issues/15908) [#16725](https://github.com/aws/aws-cdk/issues/16725) [#2041](https://github.com/aws/aws-cdk/issues/2041) [#1578](https://github.com/aws/aws-cdk/issues/1578)
* **pipelines:** step dependencies ([#18256](https://github.com/aws/aws-cdk/issues/18256)) ([e3359e0](https://github.com/aws/aws-cdk/commit/e3359e0b79a8b999ed32c93fdbd19625bbbefaf8)), closes [#17945](https://github.com/aws/aws-cdk/issues/17945)
* **pipelines:** support timeout in CodeBuildStep ([#17351](https://github.com/aws/aws-cdk/issues/17351)) ([2aa3b8e](https://github.com/aws/aws-cdk/commit/2aa3b8e6e3ce75aaa7d4158f55e162eb26050ba1))
* **rds:** Aurora clusters from snapshots ([#17759](https://github.com/aws/aws-cdk/issues/17759)) ([e5259ee](https://github.com/aws/aws-cdk/commit/e5259eec0c7df3129844bce3120eb32ffb575303)), closes [#10936](https://github.com/aws/aws-cdk/issues/10936) [#10130](https://github.com/aws/aws-cdk/issues/10130)
* **secretsmanager:** create secrets with specified values ([#18098](https://github.com/aws/aws-cdk/issues/18098)) ([dd90b8e](https://github.com/aws/aws-cdk/commit/dd90b8e9b3fe46ccc18a2472623ff27ef7989fbb)), closes [#5810](https://github.com/aws/aws-cdk/issues/5810)
* **sqs:** add DLQ readonly property to Queue ([#18232](https://github.com/aws/aws-cdk/issues/18232)) ([caa6788](https://github.com/aws/aws-cdk/commit/caa6788781690c629226a54bb1f9529722d67887)), closes [#18083](https://github.com/aws/aws-cdk/issues/18083)
* **ssm:** reference latest version of secure string parameters ([#18187](https://github.com/aws/aws-cdk/issues/18187)) ([7d0680a](https://github.com/aws/aws-cdk/commit/7d0680a5a858633f92aeb78353cac22b9a391fa7)), closes [#17091](https://github.com/aws/aws-cdk/issues/17091)


### Bug Fixes

* **acm:** DnsValidatedCertificate intermittently fails with "Cannot read property 'Name' of undefined" ([#18033](https://github.com/aws/aws-cdk/issues/18033)) ([2b6c2da](https://github.com/aws/aws-cdk/commit/2b6c2dadc039f7c4255f6864386ba1dd28b6fc4f)), closes [#8282](https://github.com/aws/aws-cdk/issues/8282)
* **apigateway:** race condition between Stage and CfnAccount ([#18011](https://github.com/aws/aws-cdk/issues/18011)) ([f11766e](https://github.com/aws/aws-cdk/commit/f11766ed774af3c5da83de2722e638878c1b321c))
* **cfn2ts:** some property times have behavioral-interface names ([#18275](https://github.com/aws/aws-cdk/issues/18275)) ([6359c12](https://github.com/aws/aws-cdk/commit/6359c12e3242e23d9b3bf0a42cac7c361c8d4d8a))
* **cloudfront-origins:** policy not added for custom OAI ([#18192](https://github.com/aws/aws-cdk/issues/18192)) ([c894ba1](https://github.com/aws/aws-cdk/commit/c894ba1d628acdd88be5dfbc57117a273547b32c)), closes [#18185](https://github.com/aws/aws-cdk/issues/18185)
* **codebuild:** setting Cache.none() renders nothing in the template ([#18194](https://github.com/aws/aws-cdk/issues/18194)) ([cd51a5d](https://github.com/aws/aws-cdk/commit/cd51a5dae1780e34aecd90d85783fb6d3c239903)), closes [#18165](https://github.com/aws/aws-cdk/issues/18165)
* **core:** `Duration.toString()` throws an error ([#18243](https://github.com/aws/aws-cdk/issues/18243)) ([df03df8](https://github.com/aws/aws-cdk/commit/df03df8b5c97fae6c349822ae97245512571a1dc)), closes [#18176](https://github.com/aws/aws-cdk/issues/18176)
* **core:** overriding of `Stack.addFileAsset()` no longer has effect ([#18116](https://github.com/aws/aws-cdk/issues/18116)) ([2290681](https://github.com/aws/aws-cdk/commit/2290681a774667bcb969058c3bdb77e0b0b60044)), closes [#17328](https://github.com/aws/aws-cdk/issues/17328)
* **eks:** can't deploy with Bottlerocket amiType  ([#17775](https://github.com/aws/aws-cdk/issues/17775)) ([b7be71c](https://github.com/aws/aws-cdk/commit/b7be71c55051916d3e1f7b09b8d178fa8783eae4)), closes [#17641](https://github.com/aws/aws-cdk/issues/17641) [#17641](https://github.com/aws/aws-cdk/issues/17641)
* **eks:** cannot customize alb controller repository and version ([#18081](https://github.com/aws/aws-cdk/issues/18081)) ([e4256c8](https://github.com/aws/aws-cdk/commit/e4256c8f36e49aedb7b9f9b91fb4a88a031bdb49)), closes [#18054](https://github.com/aws/aws-cdk/issues/18054)
* **eks:** the `defaultChild` of a `KubernetesManifest` is not a `CfnResource` ([#18052](https://github.com/aws/aws-cdk/issues/18052)) ([ef8ab72](https://github.com/aws/aws-cdk/commit/ef8ab7245630f54b5a633925e27b34c31b712abc))
* **events:** event bus name only generated if no props passed ([#18153](https://github.com/aws/aws-cdk/issues/18153)) ([9b81662](https://github.com/aws/aws-cdk/commit/9b81662a2b281443502bbb4e8a98d9f1087388d7)), closes [#18070](https://github.com/aws/aws-cdk/issues/18070)
* **lambda:** imported Function still has region and account from its Stack, instead of its ARN ([#18255](https://github.com/aws/aws-cdk/issues/18255)) ([01bbe4c](https://github.com/aws/aws-cdk/commit/01bbe4ca6c38ca7fe2239f8885bbec5ab537c9ad)), closes [#18228](https://github.com/aws/aws-cdk/issues/18228)
* **logs:** respect region when importing log group ([#18215](https://github.com/aws/aws-cdk/issues/18215)) ([be909bc](https://github.com/aws/aws-cdk/commit/be909bc90822db947ec0a932621709d0cb07e50e)), closes [#18214](https://github.com/aws/aws-cdk/issues/18214)
* **opensearchservice:** imported domain's `domainendpoint` is a url not an endpoint ([#18027](https://github.com/aws/aws-cdk/issues/18027)) ([fd149b1](https://github.com/aws/aws-cdk/commit/fd149b1e6557337b01d2232e2ba0fd410ba903dd)), closes [#18017](https://github.com/aws/aws-cdk/issues/18017)
* **pipelines:** can't use exports from very long stack names ([#18039](https://github.com/aws/aws-cdk/issues/18039)) ([465dabf](https://github.com/aws/aws-cdk/commit/465dabf34ed86e3c4367cb28313955cead44ecdd)), closes [#17436](https://github.com/aws/aws-cdk/issues/17436)
* **rds:** unable to use tokens as port in `DatabaseInstance` ([#17995](https://github.com/aws/aws-cdk/issues/17995)) ([0745193](https://github.com/aws/aws-cdk/commit/0745193e4c18ecb118ba3330a380f7474b527a2b)), closes [#17948](https://github.com/aws/aws-cdk/issues/17948)
* **region-info:** ssm service principal - fix more regions ([#18135](https://github.com/aws/aws-cdk/issues/18135)) ([ed30c44](https://github.com/aws/aws-cdk/commit/ed30c4459666840a5c0396e943916e67c76b7135)), closes [#16188](https://github.com/aws/aws-cdk/issues/16188)
* **region-info:** ssm service principal is wrong in majority of regions ([#17984](https://github.com/aws/aws-cdk/issues/17984)) ([77144f5](https://github.com/aws/aws-cdk/commit/77144f5a1072feea7409b4222fbc80bd2bc86e71)), closes [#16188](https://github.com/aws/aws-cdk/issues/16188) [#17646](https://github.com/aws/aws-cdk/issues/17646)
* **route53:** support multiple cross account DNS delegations ([#17837](https://github.com/aws/aws-cdk/issues/17837)) ([76b5c0d](https://github.com/aws/aws-cdk/commit/76b5c0d12e1e692efcf6a557ee4ddb6df3709e4d)), closes [#17836](https://github.com/aws/aws-cdk/issues/17836)
* ResponseURL is logged by S3Deployment ([#18048](https://github.com/aws/aws-cdk/issues/18048)) ([ed19828](https://github.com/aws/aws-cdk/commit/ed19828e64d2bcd1be950f3e989ec2d14ad244a7))


### Reverts

* **cfnspec:** add CloudFormation documentation to L1 classes ([#18177](https://github.com/aws/aws-cdk/issues/18177)) ([2530016](https://github.com/aws/aws-cdk/commit/253001685990e19fd23f9aa2205615f2f3e3c508))

## [2.3.0](https://github.com/aws/aws-cdk/compare/v2.2.0...v2.3.0) (2021-12-22)

## [2.2.0](https://github.com/aws/aws-cdk/compare/v2.1.0...v2.2.0) (2021-12-15)


### Features

* **apigateway:** add option to set the base path when adding a domain name to a Rest API ([#17915](https://github.com/aws/aws-cdk/issues/17915)) ([9af5b4d](https://github.com/aws/aws-cdk/commit/9af5b4dba57e816754673fc11a1246d6d4215c5e))
* **aws-applicationautoscaling:** Allow autoscaling with "M out of N" datapoints ([#17441](https://github.com/aws/aws-cdk/issues/17441)) ([c21320d](https://github.com/aws/aws-cdk/commit/c21320d32a22b9bd5f202acbdd2626ba4d90fbca)), closes [#17433](https://github.com/aws/aws-cdk/issues/17433)
* **aws-applicationautoscaling:** enabling autoscaling for ElastiCache Redis cluster ([#17919](https://github.com/aws/aws-cdk/issues/17919)) ([7f54ed6](https://github.com/aws/aws-cdk/commit/7f54ed667607025666c714299036a6ca770065c9))
* **aws-ecs:** expose environment from containerDefinition ([#17889](https://github.com/aws/aws-cdk/issues/17889)) ([4937cd0](https://github.com/aws/aws-cdk/commit/4937cd0d0057d7d389809f4c4ef56fc6020a954f)), closes [#17867](https://github.com/aws/aws-cdk/issues/17867)
* **aws-s3:** add support for BucketOwnerEnforced to S3 ObjectOwnershipType ([#17961](https://github.com/aws/aws-cdk/issues/17961)) ([93fafc5](https://github.com/aws/aws-cdk/commit/93fafc5c93f0a8a0a05f4c261df3918256f71e5e)), closes [#17926](https://github.com/aws/aws-cdk/issues/17926)
* **cfnspec:** cloudformation spec v50.0.0 ([#17844](https://github.com/aws/aws-cdk/issues/17844)) ([cd3f24e](https://github.com/aws/aws-cdk/commit/cd3f24ec2a928e62ec538827860f936e650e8798)), closes [#17840](https://github.com/aws/aws-cdk/issues/17840) [#17858](https://github.com/aws/aws-cdk/issues/17858)
* **cfnspec:** cloudformation spec v51.0.0 ([#17955](https://github.com/aws/aws-cdk/issues/17955)) ([c6b7a49](https://github.com/aws/aws-cdk/commit/c6b7a496122ef2e03ccc267e2cccf03ab439fdc7)), closes [#17943](https://github.com/aws/aws-cdk/issues/17943)
* **cli:** Hotswapping Support for S3 Bucket Deployments ([#17638](https://github.com/aws/aws-cdk/issues/17638)) ([1df478b](https://github.com/aws/aws-cdk/commit/1df478b9777afcdb5401df6c4a1a9708849dca42))
* **ec2:** add d3 and d3en instances ([#17782](https://github.com/aws/aws-cdk/issues/17782)) ([8b52196](https://github.com/aws/aws-cdk/commit/8b52196d9971f0925acedf067150e1c465be7a1e)), closes [/docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-instance.html#cfn-ec2](https://github.com/aws//docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-instance.html/issues/cfn-ec2)
* **ec2:** add high memory instances u-6tb1, u-9tb1, u-12tb1, u-18tb1, and u-24tb1 ([#17964](https://github.com/aws/aws-cdk/issues/17964)) ([5497525](https://github.com/aws/aws-cdk/commit/54975259fc2425e43cbdcb99f82341d7c0d0aa47))
* **ec2:** add im4gn and is4gen instances ([#17780](https://github.com/aws/aws-cdk/issues/17780)) ([e057c8f](https://github.com/aws/aws-cdk/commit/e057c8fffd32d5e0ad70880f96a2adc5e1b28eea)), closes [/docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-instance.html#cfn-ec2](https://github.com/aws//docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-instance.html/issues/cfn-ec2)
* **ec2:** add vpcName property to the VPC ([#17940](https://github.com/aws/aws-cdk/issues/17940)) ([794e7cd](https://github.com/aws/aws-cdk/commit/794e7cd63c83aac3c6ace933f4d953fea0b909ad))
* **ec2:** propagate EC2 tags to volumes ([#17840](https://github.com/aws/aws-cdk/issues/17840)) ([42cf186](https://github.com/aws/aws-cdk/commit/42cf1861c1b493be7fd5ec0d6d7e8fc64987cacd)), closes [/docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-instance.html#cfn-ec2](https://github.com/aws//docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-instance.html/issues/cfn-ec2) [#17844](https://github.com/aws/aws-cdk/issues/17844)
* **lambda:** add cloudwatch lambda insights arm support ([#17665](https://github.com/aws/aws-cdk/issues/17665)) ([02749b4](https://github.com/aws/aws-cdk/commit/02749b43d5169b973e543100c5a7b0c2df04ce2b)), closes [#17133](https://github.com/aws/aws-cdk/issues/17133)


### Bug Fixes

* **apigateway:** dataTraceEnabled does not default to false ([#17906](https://github.com/aws/aws-cdk/issues/17906)) ([cc3bb1f](https://github.com/aws/aws-cdk/commit/cc3bb1f1bdd1b71be41393b40353e4a103c71cf8))
* **appmesh:** adding support with gateway route priority ([#17694](https://github.com/aws/aws-cdk/issues/17694)) ([a61576f](https://github.com/aws/aws-cdk/commit/a61576fd43fdcca44e364fc6bfa017c8aef3fc07)), closes [#16821](https://github.com/aws/aws-cdk/issues/16821)
* **assets:** remove the original-path metadata ([#17901](https://github.com/aws/aws-cdk/issues/17901)) ([2b759ca](https://github.com/aws/aws-cdk/commit/2b759caddc16de9fcb41c3a0941c21ef94647cb3)), closes [#17706](https://github.com/aws/aws-cdk/issues/17706)
* **aws-autoscaling:** notificationTargetArn should be optional in LifecycleHook ([#16187](https://github.com/aws/aws-cdk/issues/16187)) ([4e7a275](https://github.com/aws/aws-cdk/commit/4e7a2758eec6999aee5432b3e9e6bbe7626a2d6b)), closes [#14641](https://github.com/aws/aws-cdk/issues/14641)
* **aws-cdk-migration:** Construct imports not rewritten ([#17931](https://github.com/aws/aws-cdk/issues/17931)) ([f02fcb4](https://github.com/aws/aws-cdk/commit/f02fcb4cf49e6d34f0038c4baf120ccc8dff2abe)), closes [#17826](https://github.com/aws/aws-cdk/issues/17826)
* **aws-lambda-nodejs:** use closest lockfile when autodetecting  ([#16629](https://github.com/aws/aws-cdk/issues/16629)) ([c4ecd96](https://github.com/aws/aws-cdk/commit/c4ecd9636087332d8ae9bc5e120d890e8c677f35)), closes [#15847](https://github.com/aws/aws-cdk/issues/15847) [40aws-cdk/aws-lambda-nodejs/lib/function.ts#L137-L139](https://github.com/40aws-cdk/aws-lambda-nodejs/lib/function.ts/issues/L137-L139) [/github.com/aws/aws-cdk/issues/15847#issuecomment-903830384](https://github.com/aws//github.com/aws/aws-cdk/issues/15847/issues/issuecomment-903830384)
* **cli:** asset publishing broken cross account ([#18007](https://github.com/aws/aws-cdk/issues/18007)) ([2fc6895](https://github.com/aws/aws-cdk/commit/2fc68954cfbc3c65694e767b00a2318f9cc4a501)), closes [#17668](https://github.com/aws/aws-cdk/issues/17668) [#17988](https://github.com/aws/aws-cdk/issues/17988)
* **cli:** hotswapping StateMachines with a name fails ([#17892](https://github.com/aws/aws-cdk/issues/17892)) ([de67aae](https://github.com/aws/aws-cdk/commit/de67aae18cfed2694e9002a10e739a56f294040f)), closes [#17716](https://github.com/aws/aws-cdk/issues/17716)
* **codepipeline:** default cross-region S3 buckets allow public access ([#17722](https://github.com/aws/aws-cdk/issues/17722)) ([0b80db5](https://github.com/aws/aws-cdk/commit/0b80db54e92fb5bc0e106093b2f363f9926bd5bd)), closes [#16411](https://github.com/aws/aws-cdk/issues/16411)
* **cognito:** remove invalid SES region check ([#17868](https://github.com/aws/aws-cdk/issues/17868)) ([450f7ca](https://github.com/aws/aws-cdk/commit/450f7ca695f5f0bab758c31f3fd8390649adce51)), closes [#17795](https://github.com/aws/aws-cdk/issues/17795)
* **custom-resources:** assumedRole from AwsCustomResource invocation leaked to next execution ([#15776](https://github.com/aws/aws-cdk/issues/15776)) ([e138188](https://github.com/aws/aws-cdk/commit/e13818854c89591606ac74496969b841f6a1fa8e)), closes [#15425](https://github.com/aws/aws-cdk/issues/15425)
* **iam:** AWS Managed Policy ARNs are not deduped ([#17623](https://github.com/aws/aws-cdk/issues/17623)) ([ed4a4b4](https://github.com/aws/aws-cdk/commit/ed4a4b4b70e72e3fa9a76af871d1d1e84447140a)), closes [#17552](https://github.com/aws/aws-cdk/issues/17552)
* **logs:** log retention fails with OperationAbortedException ([#17688](https://github.com/aws/aws-cdk/issues/17688)) ([95b8da9](https://github.com/aws/aws-cdk/commit/95b8da94a1880d8c34cab80c9b484307260047d9)), closes [#17546](https://github.com/aws/aws-cdk/issues/17546)

## [2.1.0](https://github.com/aws/aws-cdk/compare/v2.0.0...v2.1.0) (2021-12-08)


### Features

* **apigateway:** step functions integration  ([#16827](https://github.com/aws/aws-cdk/issues/16827)) ([cb31547](https://github.com/aws/aws-cdk/commit/cb3154789da52b94e4688d645adba87ef2ebf39f)), closes [#15081](https://github.com/aws/aws-cdk/issues/15081)
* **assertions:** major improvements to the capture feature ([#17713](https://github.com/aws/aws-cdk/issues/17713)) ([9a67ce7](https://github.com/aws/aws-cdk/commit/9a67ce7a1792a111e7668cbc7b7f0799314bd7d6)), closes [#17009](https://github.com/aws/aws-cdk/issues/17009)
* **aws-s3-deployment:** log retention option ([#17779](https://github.com/aws/aws-cdk/issues/17779)) ([b60dc63](https://github.com/aws/aws-cdk/commit/b60dc63f99ede0cfaa859cdef33a6f4ddd2d1d25))
* **backup:** enable WindowsVss Backup ([#15934](https://github.com/aws/aws-cdk/issues/15934)) ([12fcb18](https://github.com/aws/aws-cdk/commit/12fcb18212c8d9e74f5292b07f42ce24cd7b02b3)), closes [#14803](https://github.com/aws/aws-cdk/issues/14803) [#14891](https://github.com/aws/aws-cdk/issues/14891)
* **cfnspec:** cloudformation spec v49.0.0 ([#17727](https://github.com/aws/aws-cdk/issues/17727)) ([7e0c9a3](https://github.com/aws/aws-cdk/commit/7e0c9a341e2bc2837d5c5d671339fe968714d9ce))
* **cloudfront:** Add support for response headers policy ([#17359](https://github.com/aws/aws-cdk/issues/17359)) ([ea0acff](https://github.com/aws/aws-cdk/commit/ea0acff28c3f64c9511fdd580f52211df9460a45)), closes [#17290](https://github.com/aws/aws-cdk/issues/17290)
* **cognito:** user pool: adds custom sender (Email/SMS) lambda triggers ([#17740](https://github.com/aws/aws-cdk/issues/17740)) ([7f45de4](https://github.com/aws/aws-cdk/commit/7f45de4ba3cdf99846ca1966549b1630929aebbe))
* **core:** add applyRemovalPolicy to IResource ([#17746](https://github.com/aws/aws-cdk/issues/17746)) ([d64057f](https://github.com/aws/aws-cdk/commit/d64057f9462f8261f61795c6584d21ef56a9be34)), closes [#17728](https://github.com/aws/aws-cdk/issues/17728)
* **custom-resources:** fixed Lambda function name ([#17670](https://github.com/aws/aws-cdk/issues/17670)) ([5710fe5](https://github.com/aws/aws-cdk/commit/5710fe5a80cd4cc6ef415ec624a3399e86a3e603))
* **docdb:** implement audit and profiler logs ([#17570](https://github.com/aws/aws-cdk/issues/17570)) ([4982aca](https://github.com/aws/aws-cdk/commit/4982aca6f95ca864a285ed9955a9618a20ca0415)), closes [#17478](https://github.com/aws/aws-cdk/issues/17478)
* **ec2:** add g5g instances ([#17765](https://github.com/aws/aws-cdk/issues/17765)) ([1799f7e](https://github.com/aws/aws-cdk/commit/1799f7e08d06b8846c9918f1cb130f20570a99be)), closes [/docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-instance.html#cfn-ec2](https://github.com/aws//docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-instance.html/issues/cfn-ec2)
* **ec2:** add m5zn instances ([#17757](https://github.com/aws/aws-cdk/issues/17757)) ([845be10](https://github.com/aws/aws-cdk/commit/845be1012593a9f28457c73c9054bd98ea44d659)), closes [/docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-instance.html#cfn-ec2](https://github.com/aws//docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-instance.html/issues/cfn-ec2)
* **ec2:** add m6a instances ([#17764](https://github.com/aws/aws-cdk/issues/17764)) ([b06f120](https://github.com/aws/aws-cdk/commit/b06f120916acd63293c020eef368401b4428ce0a)), closes [/docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-instance.html#cfn-ec2](https://github.com/aws//docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-instance.html/issues/cfn-ec2)
* **ec2:** add mac1 instance ([#17677](https://github.com/aws/aws-cdk/issues/17677)) ([88a5204](https://github.com/aws/aws-cdk/commit/88a5204a295874e3cffcc041469d8fffbd32b57d)), closes [/docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-instance.html#cfn-ec2](https://github.com/aws//docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-instance.html/issues/cfn-ec2) [40aws-cdk/aws-ec2/lib/instance-types.ts#L573](https://github.com/40aws-cdk/aws-ec2/lib/instance-types.ts/issues/L573)
* **ec2:** add r6i instances ([#17663](https://github.com/aws/aws-cdk/issues/17663)) ([0138292](https://github.com/aws/aws-cdk/commit/01382921f979b944df1917964f080ce311e99ad2)), closes [/docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-instance.html#cfn-ec2](https://github.com/aws//docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-instance.html/issues/cfn-ec2)
* **ec2:** add vt1 instances ([#17756](https://github.com/aws/aws-cdk/issues/17756)) ([245c059](https://github.com/aws/aws-cdk/commit/245c059eabf59d0fb0b352dac5e49d5ab4ef9ee2)), closes [/docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-instance.html#cfn-ec2](https://github.com/aws//docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-instance.html/issues/cfn-ec2)
* **ec2:** explicit mapPublicIpOnLaunch configuration for public subnets ([#17346](https://github.com/aws/aws-cdk/issues/17346)) ([a1685c6](https://github.com/aws/aws-cdk/commit/a1685c62071846d41eb47234fbf2c94884453c17))
* **ec2:** extend BastionHostLinux to support CloudFormationInit ([#17507](https://github.com/aws/aws-cdk/issues/17507)) ([c62377e](https://github.com/aws/aws-cdk/commit/c62377e14caae677deb7e4eae692eaccb2020c67))
* **ecs-service-extensions:** Auto scaling for Queue Extension ([#17430](https://github.com/aws/aws-cdk/issues/17430)) ([df7b9b4](https://github.com/aws/aws-cdk/commit/df7b9b41bd99534abb8a6becccc23320a3b6cb41))
* **iam:** support `fromGroupName()` for IAM groups ([#17243](https://github.com/aws/aws-cdk/issues/17243)) ([29b379c](https://github.com/aws/aws-cdk/commit/29b379cdc49dd396f793782b91d3eca215446a48))
* **lambda:** function construct exposes configured timeout ([#17594](https://github.com/aws/aws-cdk/issues/17594)) ([87fd60f](https://github.com/aws/aws-cdk/commit/87fd60f047e9f1994459de874b54e901d1871e6e))
* **lambda-event-sources:** sqs: support reportBatchItemFailures ([#17733](https://github.com/aws/aws-cdk/issues/17733)) ([3623982](https://github.com/aws/aws-cdk/commit/3623982fc1a64c2c67a0dba18a6d3eeeb171e898)), closes [#17690](https://github.com/aws/aws-cdk/issues/17690)
* **rds:** parameter group for replica instances ([#17822](https://github.com/aws/aws-cdk/issues/17822)) ([b606a23](https://github.com/aws/aws-cdk/commit/b606a2321769d5e8f15072a62848aaba35bb1d35)), closes [#17580](https://github.com/aws/aws-cdk/issues/17580)
* **s3:** add GLACIER_IR storage class ([#17829](https://github.com/aws/aws-cdk/issues/17829)) ([c291c44](https://github.com/aws/aws-cdk/commit/c291c4427480472402ef6b0a7c854ac38505ae97))
* **s3:** support Transfer Acceleration ([#17636](https://github.com/aws/aws-cdk/issues/17636)) ([b432822](https://github.com/aws/aws-cdk/commit/b432822ae45e329a900293eb43712fa4a1d74aa5)), closes [#12570](https://github.com/aws/aws-cdk/issues/12570)
* **secretsmanager:** support secrets rotation in GovCloud ([#17673](https://github.com/aws/aws-cdk/issues/17673)) ([a01678b](https://github.com/aws/aws-cdk/commit/a01678b838a7feb2bde40c435c6c585473d35b22)), closes [#14608](https://github.com/aws/aws-cdk/issues/14608)
* **stepfunctions-tasks:** add 'Emr on Eks' tasks ([#17103](https://github.com/aws/aws-cdk/issues/17103)) ([f2bf322](https://github.com/aws/aws-cdk/commit/f2bf322e043ced0193a1b47ae4abd370b095ec1c)), closes [#15262](https://github.com/aws/aws-cdk/issues/15262) [#15234](https://github.com/aws/aws-cdk/issues/15234)


### Bug Fixes

* **aws-cdk:** `cdk diff` always fails on diff ([#17862](https://github.com/aws/aws-cdk/issues/17862)) ([6bb4a46](https://github.com/aws/aws-cdk/commit/6bb4a46792d0b9665e4a72896869a063e8fa1af9)), closes [#4721](https://github.com/aws/aws-cdk/issues/4721)
* **aws-ec2:** imported VPC subnets never recognized as PRIVATE_ISOLATED ([#17496](https://github.com/aws/aws-cdk/issues/17496)) ([ba6a8ef](https://github.com/aws/aws-cdk/commit/ba6a8efc65288bd96ebf004d81026ab61485ff06))
* **aws-elasticloadbalancingv2:** Set stickiness.enabled unless target type is lambda ([#17271](https://github.com/aws/aws-cdk/issues/17271)) ([168a98f](https://github.com/aws/aws-cdk/commit/168a98fb213184dfef29ae38b986704b5abeb99e)), closes [#17261](https://github.com/aws/aws-cdk/issues/17261)
* **cli:** S3 asset uploads are rejected by commonly referenced encryption SCP (introduces bootstrap stack v9) ([#17668](https://github.com/aws/aws-cdk/issues/17668)) ([8191f1f](https://github.com/aws/aws-cdk/commit/8191f1f1d4072feeba74844a31c942909cee7d83)), closes [#11265](https://github.com/aws/aws-cdk/issues/11265)
* **codepipeline:** cannot trigger on all tags anymore in EcrSourceAction ([#17270](https://github.com/aws/aws-cdk/issues/17270)) ([39fe11b](https://github.com/aws/aws-cdk/commit/39fe11bc1b0d12920111331dca560150006a0733)), closes [aws#13818](https://github.com/aws/aws/issues/13818) [aws#13818](https://github.com/aws/aws/issues/13818)
* **codepipeline:** cross-env pipeline cannot be created in `Stage` ([#17730](https://github.com/aws/aws-cdk/issues/17730)) ([f17f29e](https://github.com/aws/aws-cdk/commit/f17f29e94265eb450d8f11bdbdbe719f3e511ea2)), closes [#17643](https://github.com/aws/aws-cdk/issues/17643)
* **core:** bundling skipped with --exclusively option and stacks under stage ([#17210](https://github.com/aws/aws-cdk/issues/17210)) ([cda6601](https://github.com/aws/aws-cdk/commit/cda66013afa6f8aa16d802bb2ab08dab1e5124cf)), closes [#12898](https://github.com/aws/aws-cdk/issues/12898) [#15346](https://github.com/aws/aws-cdk/issues/15346)
* **docdb:** secret rotation ignores excluded characters in password ([#17609](https://github.com/aws/aws-cdk/issues/17609)) ([1fe2215](https://github.com/aws/aws-cdk/commit/1fe2215dc40eb58f1babc2c3fbca501a5e89b09f)), closes [#17347](https://github.com/aws/aws-cdk/issues/17347) [#17575](https://github.com/aws/aws-cdk/issues/17575)
* **dynamodb:** add missing DynamoDB operations to enum ([#17738](https://github.com/aws/aws-cdk/issues/17738)) ([f38e0ac](https://github.com/aws/aws-cdk/commit/f38e0ac5b90bd83630a5a602e9ada2556689d826))
* **dynamodb:** changing `waitForReplicationToFinish` fails deployment ([#17842](https://github.com/aws/aws-cdk/issues/17842)) ([36b8fdb](https://github.com/aws/aws-cdk/commit/36b8fdb026c7e82eb590c1a8d604ca3b44642900)), closes [#16983](https://github.com/aws/aws-cdk/issues/16983)
* **ecs-patterns:** removeDefaultDesiredCount feature flag not expired properly ([#17865](https://github.com/aws/aws-cdk/issues/17865)) ([7fb639a](https://github.com/aws/aws-cdk/commit/7fb639af1d9fa3c0d910df6d3af21aac6aaff5eb))
* **lambda:** recognizeVersionProps featureFlag not defaulting correctly ([#17866](https://github.com/aws/aws-cdk/issues/17866)) ([f19fc39](https://github.com/aws/aws-cdk/commit/f19fc39032696ce133fc55aad0d058f616d9f9f8)), closes [#17810](https://github.com/aws/aws-cdk/issues/17810)
* **lambda-nodejs:** bundling fails with a file dependency in `nodeModules` ([#17851](https://github.com/aws/aws-cdk/issues/17851)) ([5737c33](https://github.com/aws/aws-cdk/commit/5737c336b3a2d7942196ffcad9291b4af6a23375)), closes [#17830](https://github.com/aws/aws-cdk/issues/17830)
* **lambda-nodejs:** bundling with `nodeModules` fails with paths containing spaces ([#17632](https://github.com/aws/aws-cdk/issues/17632)) ([986f291](https://github.com/aws/aws-cdk/commit/986f291a51cee46299428298ca6b39a9636d6dd2)), closes [#17631](https://github.com/aws/aws-cdk/issues/17631)
* **pipelines:** stack outputs used in stackSteps not recognized ([#17311](https://github.com/aws/aws-cdk/issues/17311)) ([5e4a219](https://github.com/aws/aws-cdk/commit/5e4a21959e67ff967d163fce6b0405a053bafdc2)), closes [#17272](https://github.com/aws/aws-cdk/issues/17272)
* **stepfunctions:** prefixes not appended to states in parallel branches ([#17806](https://github.com/aws/aws-cdk/issues/17806)) ([a1da772](https://github.com/aws/aws-cdk/commit/a1da77272fa35b9722694557a4d5bdc83e2ad834)), closes [#17354](https://github.com/aws/aws-cdk/issues/17354)

## [2.0.0](https://github.com/aws/aws-cdk/compare/v2.0.0-rc.33...v2.0.0) (2021-12-02)


### Features

* aws-cdk-lib is now stable! ([fa2ecc9](https://github.com/aws/aws-cdk/commit/fa2ecc971cd756ea0cbf2dace64076ce964f88bc))

## [2.0.0-rc.33](https://github.com/aws/aws-cdk/compare/v2.0.0-rc.32...v2.0.0-rc.33) (2021-11-26)

## [2.0.0-rc.32](https://github.com/aws/aws-cdk/compare/v2.0.0-rc.31...v2.0.0-rc.32) (2021-11-25)

## [2.0.0-rc.31](https://github.com/aws/aws-cdk/compare/v2.0.0-rc.30...v2.0.0-rc.31) (2021-11-23)


### Features

* **assertions:** support assertions over nested stacks ([#16972](https://github.com/aws/aws-cdk/issues/16972)) ([bde44e7](https://github.com/aws/aws-cdk/commit/bde44e7a767b88762ecb1370e605e6e5dfc85b52))
* **aws-eks:** support bottlerocket managed nodegroup ([#17323](https://github.com/aws/aws-cdk/issues/17323)) ([2e6a1a9](https://github.com/aws/aws-cdk/commit/2e6a1a941dc37fdb0cffd79af4887be182eaacd1))
* **cfnspec:** cloudformation spec v48.0.0 ([#17484](https://github.com/aws/aws-cdk/issues/17484)) ([6e8de96](https://github.com/aws/aws-cdk/commit/6e8de96c401c1a019742490850b43e398b561a62))
* **cfnspec:** cloudformation spec v49.0.0 ([#17585](https://github.com/aws/aws-cdk/issues/17585)) ([d44d0e7](https://github.com/aws/aws-cdk/commit/d44d0e7d06bf3b420adae320e0fae4123d731451))
* **cfnspec:** cloudformation spec v49.0.0 ([#17621](https://github.com/aws/aws-cdk/issues/17621)) ([ce638b4](https://github.com/aws/aws-cdk/commit/ce638b407ac9efc6a3ee4d5ecd22c68ab68b8e58))
* **cognito:** user pool: send emails using Amazon SES ([#17117](https://github.com/aws/aws-cdk/issues/17117)) ([503720f](https://github.com/aws/aws-cdk/commit/503720ffb90c67ac1a3a0f80faeca87c0428f2d3)), closes [#6768](https://github.com/aws/aws-cdk/issues/6768)
* **docdb:** add option to set the name of the generated Secret ([#17574](https://github.com/aws/aws-cdk/issues/17574)) ([18c9ef7](https://github.com/aws/aws-cdk/commit/18c9ef713717fcb2f84e687c1e34c887a50264bd)), closes [#17572](https://github.com/aws/aws-cdk/issues/17572)
* **ec2:** add G5 instances ([#17499](https://github.com/aws/aws-cdk/issues/17499)) ([eed70a0](https://github.com/aws/aws-cdk/commit/eed70a0bab1885b6293ae8db4dc41b7dfd8724d8)), closes [/docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-instance.html#cfn-ec2](https://github.com/aws//docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-instance.html/issues/cfn-ec2)
* **ec2:** add m5n and m5dn instance types ([#17488](https://github.com/aws/aws-cdk/issues/17488)) ([df30d4f](https://github.com/aws/aws-cdk/commit/df30d4f7fa6c1a5c381411904526be17796f2103))
* **ec2:** lookup security group by name ([#17246](https://github.com/aws/aws-cdk/issues/17246)) ([5bf0d07](https://github.com/aws/aws-cdk/commit/5bf0d074854ff90c5d9521f5d7f0fc9ff31c5eb5)), closes [#4241](https://github.com/aws/aws-cdk/issues/4241)
* **ec2:** vpc endpoints for codeguru ([#17498](https://github.com/aws/aws-cdk/issues/17498)) ([21c2d2b](https://github.com/aws/aws-cdk/commit/21c2d2b258f18f32c6adfbe9f3cdd3f7f2424551)), closes [#16788](https://github.com/aws/aws-cdk/issues/16788)
* **ecs:** Add SystemControls to ContainerDefinition  ([#16970](https://github.com/aws/aws-cdk/issues/16970)) ([b12a2c6](https://github.com/aws/aws-cdk/commit/b12a2c68063c5739c81c032f32c82bb85c590053)), closes [#16025](https://github.com/aws/aws-cdk/issues/16025)
* **eks:** ALB Controller ([#17618](https://github.com/aws/aws-cdk/issues/17618)) ([1faf31d](https://github.com/aws/aws-cdk/commit/1faf31d1ec7ffec4c6323a050126b0b054094c63))
* **rds:** validate backup retention for read replica instances ([#17569](https://github.com/aws/aws-cdk/issues/17569)) ([9b2158b](https://github.com/aws/aws-cdk/commit/9b2158bf9228a876d8f434dd5e025dbb74dbe4d5)), closes [#17356](https://github.com/aws/aws-cdk/issues/17356)
* warn users when deprecated elements are used ([#17328](https://github.com/aws/aws-cdk/issues/17328)) ([3721358](https://github.com/aws/aws-cdk/commit/3721358fa1501e42b3514b8a8f15f05c9615f149))
* **eks:** Allow passing of custom IAM role to Kube Ctl Lambda ([#17196](https://github.com/aws/aws-cdk/issues/17196)) ([8fa293a](https://github.com/aws/aws-cdk/commit/8fa293a79fc8957410637dfd3a4de2069dead36b))
* **lambda:** singleton function: access runtime, log group and configure layers and environment ([#17372](https://github.com/aws/aws-cdk/issues/17372)) ([ec5b102](https://github.com/aws/aws-cdk/commit/ec5b102e560e241b21c63773817114fc44f7898a))
* **stepfunctions-tasks:** Support `DynamoAttributeValue.listFromJsonPath` ([#17376](https://github.com/aws/aws-cdk/issues/17376)) ([bc10e6f](https://github.com/aws/aws-cdk/commit/bc10e6ffb6164c212336ada745923e91adb8fe05)), closes [#17375](https://github.com/aws/aws-cdk/issues/17375)


### Bug Fixes

* **apigateway:** SAM CLI asset metadata missing from SpecRestApi ([#17293](https://github.com/aws/aws-cdk/issues/17293)) ([841cf99](https://github.com/aws/aws-cdk/commit/841cf990001dd64605873a65b8a155e37fc4541f)), closes [#14593](https://github.com/aws/aws-cdk/issues/14593)
* **assets:** add missing SAM asset metadata information ([#17591](https://github.com/aws/aws-cdk/issues/17591)) ([55df760](https://github.com/aws/aws-cdk/commit/55df760fdd9514384de019e5ce338d5250c7df97)), closes [#14593](https://github.com/aws/aws-cdk/issues/14593)
* **assets:** SAM asset metadata missing from log retention and custom resource provider functions ([#17551](https://github.com/aws/aws-cdk/issues/17551)) ([a90e959](https://github.com/aws/aws-cdk/commit/a90e959618fede4ea871bf5d36147a65f4ba9da8))
* **autoscaling:** add timezone property to Scheduled Action ([#17330](https://github.com/aws/aws-cdk/issues/17330)) ([3154a58](https://github.com/aws/aws-cdk/commit/3154a58bfc5ae4b845994c7a0ab45771f5af4cd0))
* **aws-codebuild:** add @aws-cdk/asserts to package deps ([#17435](https://github.com/aws/aws-cdk/issues/17435)) ([9c77e94](https://github.com/aws/aws-cdk/commit/9c77e941252ad16a2744577b6333ee5054302a30))
* **aws-ecs:** check for invalid capacityProviderName ([#17291](https://github.com/aws/aws-cdk/issues/17291)) ([6e2fde4](https://github.com/aws/aws-cdk/commit/6e2fde452de73c51011ddb14ede40ca0471d3663)), closes [#17321](https://github.com/aws/aws-cdk/issues/17321)
* **aws-lambda-event-sources:** `Function.addEventSource` fails for `ManagedKafkaEventSource` typed parameters ([#17490](https://github.com/aws/aws-cdk/issues/17490)) ([a474ee8](https://github.com/aws/aws-cdk/commit/a474ee8fb6b708f4147122deeacb8fc13debaed4))
* **aws-logs:** include new `policy.ts` exports in `index.ts` exports ([#17403](https://github.com/aws/aws-cdk/issues/17403)) ([a391468](https://github.com/aws/aws-cdk/commit/a39146840a10472c8afee71bf1a1cfc3cacb5f72))
* **cli:** improve asset publishing times by up to 30% ([#17409](https://github.com/aws/aws-cdk/issues/17409)) ([40d6a48](https://github.com/aws/aws-cdk/commit/40d6a48eb31b09edf2ba0ea1b0a1e212156c1784)), closes [#17266](https://github.com/aws/aws-cdk/issues/17266)
* **cli:** skip bundling for the 'watch' command ([#17455](https://github.com/aws/aws-cdk/issues/17455)) ([af61b7f](https://github.com/aws/aws-cdk/commit/af61b7f2fec17d4f817e78db21d09d471d8e2baf)), closes [#17391](https://github.com/aws/aws-cdk/issues/17391)
* **cloudwatch:** render agnostic alarms in legacy style ([#17538](https://github.com/aws/aws-cdk/issues/17538)) ([7c50ef8](https://github.com/aws/aws-cdk/commit/7c50ef8de4cad7237b442c43460695518bfb1fdc))
* **ec2:** Duplicate EIP when NatGatewayProps.eipAllocationIds is provided ([#17235](https://github.com/aws/aws-cdk/issues/17235)) ([050f6fa](https://github.com/aws/aws-cdk/commit/050f6fa74a3888fff2a495042c0ebad368775ab1))
* **eks:** Allow specifying subnets in Pinger ([#17429](https://github.com/aws/aws-cdk/issues/17429)) ([6acee52](https://github.com/aws/aws-cdk/commit/6acee5219eef91ac3686f9b6722877cea5fff6e5))
* **kinesis:** add required rights to trigger Lambda from Kinesis. Fixes issue [#17312](https://github.com/aws/aws-cdk/issues/17312). ([#17358](https://github.com/aws/aws-cdk/issues/17358)) ([0bfc15c](https://github.com/aws/aws-cdk/commit/0bfc15c991cc3373bc7c1b0cd1f5e9241398ac2c))
* **lambda:** SAM CLI asset metadata missing from image Functions ([#17368](https://github.com/aws/aws-cdk/issues/17368)) ([f52d9bf](https://github.com/aws/aws-cdk/commit/f52d9bf13d2bb3c066ba227259a2d98a5947982b))
* **NestedStack:** add asset metadata to NestedStack resources for local tooling ([#17343](https://github.com/aws/aws-cdk/issues/17343)) ([4ba40dc](https://github.com/aws/aws-cdk/commit/4ba40dcf275bbed0dbcca4cf6cf295edde5e9894))
* **opensearch:** correctly validate ebs configuration against instance types  ([#16911](https://github.com/aws/aws-cdk/issues/16911)) ([34af598](https://github.com/aws/aws-cdk/commit/34af5988b7c1ff003d10612150191803f762a79f)), closes [#11898](https://github.com/aws/aws-cdk/issues/11898)
* **s3-deployment:** updating memoryLimit or vpc results in stack update failure ([#17530](https://github.com/aws/aws-cdk/issues/17530)) ([2ba40d1](https://github.com/aws/aws-cdk/commit/2ba40d16e0e7e59cedc723dc4f9a9a615c313309)), closes [#7128](https://github.com/aws/aws-cdk/issues/7128)
* **sns-subscriptions:** enable cross region subscriptions to sqs and lambda ([#17273](https://github.com/aws/aws-cdk/issues/17273)) ([3cd8d48](https://github.com/aws/aws-cdk/commit/3cd8d481906fc4e3abdd1211908844e5b8bd2509)), closes [#7044](https://github.com/aws/aws-cdk/issues/7044) [#13707](https://github.com/aws/aws-cdk/issues/13707)
* **ssm:** fix service principals for all regions since ap-east-1  ([#17047](https://github.com/aws/aws-cdk/issues/17047)) ([5900548](https://github.com/aws/aws-cdk/commit/59005483ea1224a147db479471f541e2efb9ba23)), closes [#16188](https://github.com/aws/aws-cdk/issues/16188)

## [2.0.0-rc.30](https://github.com/aws/aws-cdk/compare/v2.0.0-rc.29...v2.0.0-rc.30) (2021-11-17)

## [2.0.0-rc.29](https://github.com/aws/aws-cdk/compare/v2.0.0-rc.28...v2.0.0-rc.29) (2021-11-10)

## [2.0.0-rc.28](https://github.com/aws/aws-cdk/compare/v2.0.0-rc.27...v2.0.0-rc.28) (2021-11-09)


### Features

* **stepfunctions-tasks:** add `AutoTerminationPolicy` to `EmrCreateCluster`  ([#16976](https://github.com/aws/aws-cdk/issues/16976)) ([27ad7d8](https://github.com/aws/aws-cdk/commit/27ad7d86824b6378d470cda7304e7ae89ebbebf4))
* the assertions module is now stable! ([#17395](https://github.com/aws/aws-cdk/issues/17395)) ([ede5e22](https://github.com/aws/aws-cdk/commit/ede5e22da2e59218534c17c33a21cab98a3001a9))
* **aws-route53-targets:** Support for Elastic Beanstalk environment URLs ([#16305](https://github.com/aws/aws-cdk/issues/16305)) ([bc07cb0](https://github.com/aws/aws-cdk/commit/bc07cb0e383aa64280a9c7f8ac4870d296830cf7))
* **certificatemanager:** requesting private certificates issued by Private Certificate Authority  ([#16315](https://github.com/aws/aws-cdk/issues/16315)) ([e26f5be](https://github.com/aws/aws-cdk/commit/e26f5befc2adedeb524fd263424c7920989b2288)), closes [#10076](https://github.com/aws/aws-cdk/issues/10076)
* **cfnspec:** cloudformation spec v46.0.0 ([#17223](https://github.com/aws/aws-cdk/issues/17223)) ([d9f7b58](https://github.com/aws/aws-cdk/commit/d9f7b58a91a625ffd9bc366767794a3101b0afeb))
* **cfnspec:** cloudformation spec v46.0.0 ([#17334](https://github.com/aws/aws-cdk/issues/17334)) ([e0f1180](https://github.com/aws/aws-cdk/commit/e0f118046c4a0350bdd614fbff4b96ba7772402e))
* **cfnspec:** cloudformation spec v47.0.0 ([#17350](https://github.com/aws/aws-cdk/issues/17350)) ([ea71b4e](https://github.com/aws/aws-cdk/commit/ea71b4ed7466d8799bde4fdd5adfed9fc8febb9c)), closes [#17290](https://github.com/aws/aws-cdk/issues/17290) [#17223](https://github.com/aws/aws-cdk/issues/17223)
* **cfnspec:** cloudformation spec v47.0.0 ([#17353](https://github.com/aws/aws-cdk/issues/17353)) ([7886607](https://github.com/aws/aws-cdk/commit/7886607528b0cb005fa1176803b2a45d3e948f48))
* **cfnspec:** cloudformation spec v47.0.0 ([#17392](https://github.com/aws/aws-cdk/issues/17392)) ([7100d43](https://github.com/aws/aws-cdk/commit/7100d43ba7b9e9ce74fb64b33403aa8eaee63255))
* **cli:** added `build` field to cdk.json ([#17176](https://github.com/aws/aws-cdk/issues/17176)) ([57ad1e0](https://github.com/aws/aws-cdk/commit/57ad1e087edef653d672c1426b920b12962f0f0f))
* **cli:** deployment progress shows stack name ([#16604](https://github.com/aws/aws-cdk/issues/16604)) ([322cf10](https://github.com/aws/aws-cdk/commit/322cf10ef3257b9d20d898882a14de91110a0033))
* **cli:** introduce the 'watch' command ([#17240](https://github.com/aws/aws-cdk/issues/17240)) ([0adc8b7](https://github.com/aws/aws-cdk/commit/0adc8b7e13011956929fc945e083f75edec16698))
* **codebuild:** add fromEcrRepository to LinuxGpuBuildImage ([#17170](https://github.com/aws/aws-cdk/issues/17170)) ([7585680](https://github.com/aws/aws-cdk/commit/758568007bf82a97ed6edba3ef4717735b224bf9)), closes [#16500](https://github.com/aws/aws-cdk/issues/16500)
* **codepipeline:** add construct for registering custom Actions ([#17041](https://github.com/aws/aws-cdk/issues/17041)) ([c66ac89](https://github.com/aws/aws-cdk/commit/c66ac89f43d3d2cee2b5842c54dc00e14ccdd2f4)), closes [#17039](https://github.com/aws/aws-cdk/issues/17039)
* **core:** Docker tags can be prefixed ([#17028](https://github.com/aws/aws-cdk/issues/17028)) ([d298696](https://github.com/aws/aws-cdk/commit/d298696a7d8978296a34294484cea80f91ebe880))
* **core:** subtract Durations ([#16734](https://github.com/aws/aws-cdk/issues/16734)) ([7a333b0](https://github.com/aws/aws-cdk/commit/7a333b018c9bb2430165177d3e65614cf1d66519)), closes [#16535](https://github.com/aws/aws-cdk/issues/16535)
* **docdb:** add the ability to exclude characters when generating passwords ([#17262](https://github.com/aws/aws-cdk/issues/17262)) ([135f7d3](https://github.com/aws/aws-cdk/commit/135f7d33db5e96c3af4a8691c13b419e7b14ceae)), closes [#15732](https://github.com/aws/aws-cdk/issues/15732)
* **ec2:** add c5ad instances ([#16428](https://github.com/aws/aws-cdk/issues/16428)) ([0318253](https://github.com/aws/aws-cdk/commit/0318253b423bb65ca7e6bf65411df767f2734296))
* **ec2:** add c6i instances ([#17237](https://github.com/aws/aws-cdk/issues/17237)) ([25cea18](https://github.com/aws/aws-cdk/commit/25cea1807539a8d45f3f4ff8b775b3417387d6fe)), closes [/docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-instance.html#cfn-ec2](https://github.com/aws//docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-instance.html/issues/cfn-ec2)
* **ec2:** include p4d instance class ([#17147](https://github.com/aws/aws-cdk/issues/17147)) ([6e13adc](https://github.com/aws/aws-cdk/commit/6e13adc281722a491c0708954d7ed637ad45033b))
* **ec2:** VPC endpoint for AWS Xray  ([#16788](https://github.com/aws/aws-cdk/issues/16788)) ([c24af54](https://github.com/aws/aws-cdk/commit/c24af54946d3668afa596dbf2a776b7cf21f8a99)), closes [#16306](https://github.com/aws/aws-cdk/issues/16306)
* **ecs-service-extensions:** Target tracking policies for Service Extensions ([#17101](https://github.com/aws/aws-cdk/issues/17101)) ([6420b18](https://github.com/aws/aws-cdk/commit/6420b1817d4319924d11cfccb8b6a29d4a2d5008))
* **eks:** expose FargateCluster's defaultProfile ([#17130](https://github.com/aws/aws-cdk/issues/17130)) ([e461601](https://github.com/aws/aws-cdk/commit/e4616010c1915206758be3bf4cd6da9f14d2101a)), closes [#16149](https://github.com/aws/aws-cdk/issues/16149)
* **events:** DLQ support for EventBus target  ([#16383](https://github.com/aws/aws-cdk/issues/16383)) ([dbb3f25](https://github.com/aws/aws-cdk/commit/dbb3f25904403bfc020a081e94270f5c16a7606f)), closes [#15954](https://github.com/aws/aws-cdk/issues/15954)
* **lambda-nodejs:** add sourcesContent in BundlingOptions ([#17280](https://github.com/aws/aws-cdk/issues/17280)) ([ea56e69](https://github.com/aws/aws-cdk/commit/ea56e6925422ebb987dbd87952511f23832ac7b6)), closes [#17256](https://github.com/aws/aws-cdk/issues/17256)
* **lambda-nodejs:** custom asset hash ([#16412](https://github.com/aws/aws-cdk/issues/16412)) ([90da730](https://github.com/aws/aws-cdk/commit/90da730244513f9614604f6be3a77adbb6b17f79)), closes [#16157](https://github.com/aws/aws-cdk/issues/16157)
* **lambda-nodejs:** esbuild charset option ([#16726](https://github.com/aws/aws-cdk/issues/16726)) ([56033a2](https://github.com/aws/aws-cdk/commit/56033a2a6d4be0444694d9f88260c574a4fa1a1d)), closes [#16668](https://github.com/aws/aws-cdk/issues/16668)
* **lambda-nodejs:** typescript emitDecoratorMetadata support ([#16543](https://github.com/aws/aws-cdk/issues/16543)) ([55d3c50](https://github.com/aws/aws-cdk/commit/55d3c507707192d7aa5ea4a38ee0d1cb58f07e06)), closes [#13767](https://github.com/aws/aws-cdk/issues/13767)
* **logs:** add support for cloudwatch logs resource policy  ([#17015](https://github.com/aws/aws-cdk/issues/17015)) ([e9a461d](https://github.com/aws/aws-cdk/commit/e9a461d6dcbad933fcb9d671a8c5b5ad8f5ece8d)), closes [#5343](https://github.com/aws/aws-cdk/issues/5343) [aws-cdk/aws-elasticsearch/lib/log-group-resource-policy.ts#L25](https://github.com/aws-cdk/aws-elasticsearch/lib/log-group-resource-policy.ts/issues/L25) [aws-cdk/aws-events-targets/lib/log-group-resource-policy.ts#L26](https://github.com/aws-cdk/aws-events-targets/lib/log-group-resource-policy.ts/issues/L26) [aws-cdk/aws-events-targets/lib/log-group-resource-policy.ts#L26](https://github.com/aws-cdk/aws-events-targets/lib/log-group-resource-policy.ts/issues/L26) [#5343](https://github.com/aws/aws-cdk/issues/5343)
* **rds:** support backtrackWindow in DatabaseCluster ([#17160](https://github.com/aws/aws-cdk/issues/17160)) ([fcd17e9](https://github.com/aws/aws-cdk/commit/fcd17e9c9a9e1b83a29c140d558f696c0290bfd7)), closes [#9369](https://github.com/aws/aws-cdk/issues/9369) [#9369](https://github.com/aws/aws-cdk/issues/9369)
* **sns:** addSubscription returns the created Subscription ([#16785](https://github.com/aws/aws-cdk/issues/16785)) ([62f389e](https://github.com/aws/aws-cdk/commit/62f389ea0522cbaefca5ca17080228031d401ce6))


### Bug Fixes

* **cli:** `wmic not found` on modern Windows systems ([#17070](https://github.com/aws/aws-cdk/issues/17070)) ([332ce4d](https://github.com/aws/aws-cdk/commit/332ce4d9ae995bd1336fef13e2c7f9fc0c12f34d)), closes [#16419](https://github.com/aws/aws-cdk/issues/16419)
* **cli:** cdk ls --long outputs less-friendly stack IDs for nested assemblies ([#17263](https://github.com/aws/aws-cdk/issues/17263)) ([864c50e](https://github.com/aws/aws-cdk/commit/864c50ed2f3ae133af0cffd17ed77a6cf32ac6f4)), closes [#14379](https://github.com/aws/aws-cdk/issues/14379)
* **cli:** downgrade bootstrap stack error message needs a hint for new-style synthesis ([#16237](https://github.com/aws/aws-cdk/issues/16237)) ([e55301b](https://github.com/aws/aws-cdk/commit/e55301b635374a87822f78870981a9e06e13d99e))
* **codecommit:** notifyOnPullRequestMerged method has a typo in its name ([#17348](https://github.com/aws/aws-cdk/issues/17348)) ([cac5726](https://github.com/aws/aws-cdk/commit/cac572620210a435f679cf7d7d9f8b6e733b340c))
* **opensearch:** domain doesn't handle tokens in capacity configuration ([#17131](https://github.com/aws/aws-cdk/issues/17131)) ([2627939](https://github.com/aws/aws-cdk/commit/2627939108a2e979e385bf2942da1c05d48c678c)), closes [#15014](https://github.com/aws/aws-cdk/issues/15014)
* java and python templates are broken ([#17357](https://github.com/aws/aws-cdk/issues/17357)) ([5f6d550](https://github.com/aws/aws-cdk/commit/5f6d550677d1998a5a2720aabbff1ed2c3815aeb))
* **aws-eks:** proxy support and allow assigning a security group to all cluster handler functions ([#17200](https://github.com/aws/aws-cdk/issues/17200)) ([7bbd10d](https://github.com/aws/aws-cdk/commit/7bbd10deb322daf8ef1504ceb84ad3c895f291ae)), closes [40aws-cdk/aws-eks/lib/cluster-resource-provider.ts#L69-L96](https://github.com/40aws-cdk/aws-eks/lib/cluster-resource-provider.ts/issues/L69-L96) [/github.com/aws/aws-cdk/issues/12469#issuecomment-758674418](https://github.com/aws//github.com/aws/aws-cdk/issues/12469/issues/issuecomment-758674418) [40aws-cdk/aws-eks/lib/cluster-resource-handler/index.ts#L48](https://github.com/40aws-cdk/aws-eks/lib/cluster-resource-handler/index.ts/issues/L48) [40aws-cdk/aws-eks/lib/cluster-resource-handler/common.ts#L59](https://github.com/40aws-cdk/aws-eks/lib/cluster-resource-handler/common.ts/issues/L59) [40aws-cdk/aws-eks/lib/cluster-resource-handler/cluster.ts#L56](https://github.com/40aws-cdk/aws-eks/lib/cluster-resource-handler/cluster.ts/issues/L56) [40aws-cdk/aws-eks/lib/cluster-resource-handler/cluster.ts#L196](https://github.com/40aws-cdk/aws-eks/lib/cluster-resource-handler/cluster.ts/issues/L196) [40aws-cdk/aws-eks/lib/cluster-resource-handler/cluster.ts#L198](https://github.com/40aws-cdk/aws-eks/lib/cluster-resource-handler/cluster.ts/issues/L198) [40aws-cdk/aws-eks/lib/kubectl-provider.ts#L83](https://github.com/40aws-cdk/aws-eks/lib/kubectl-provider.ts/issues/L83)
* **cli:** no longer disable rollback by default for hotswap deployments ([#17317](https://github.com/aws/aws-cdk/issues/17317)) ([e32b616](https://github.com/aws/aws-cdk/commit/e32b61652b5d01c44b05c2ac6d5fb1e99b50e059)), closes [#17267](https://github.com/aws/aws-cdk/issues/17267)
* **cognito:** ambiguous error message when same trigger is added twice  ([#16917](https://github.com/aws/aws-cdk/issues/16917)) ([4ae78b0](https://github.com/aws/aws-cdk/commit/4ae78b07af20ea3ef049079ac5b892f9ee8476e5))
* **core:** SecretValue.secretsManager fails for tokenized secret-id  ([#16230](https://github.com/aws/aws-cdk/issues/16230)) ([5831456](https://github.com/aws/aws-cdk/commit/5831456465fa44af96a268de56db0e3a8d3c2ea6)), closes [#16166](https://github.com/aws/aws-cdk/issues/16166)
* **custom-resources:** invalid service name leads to unhelpful error message ([#16718](https://github.com/aws/aws-cdk/issues/16718)) ([354686b](https://github.com/aws/aws-cdk/commit/354686b189377dd1daae7ba616e8fb62488d9855)), closes [#7312](https://github.com/aws/aws-cdk/issues/7312)
* **ec2:** functions addIngressRule and addEgressRule detect unresolved tokens as duplicates ([#17221](https://github.com/aws/aws-cdk/issues/17221)) ([d4952c3](https://github.com/aws/aws-cdk/commit/d4952c3cbe12e7c8c27e1bca7f9d8536d93fd3cb)), closes [#17201](https://github.com/aws/aws-cdk/issues/17201)
* **elasticloadbalancingv2:** always set stickiness ([#17111](https://github.com/aws/aws-cdk/issues/17111)) ([0a23953](https://github.com/aws/aws-cdk/commit/0a23953d92df070736f7d036cc2b24e68de4bf64)), closes [#16620](https://github.com/aws/aws-cdk/issues/16620)
* **lambda-event-sources:** dynamo batch size cannot be a CfnParameter ([#16540](https://github.com/aws/aws-cdk/issues/16540)) ([56974ac](https://github.com/aws/aws-cdk/commit/56974ac4152bc082470d56dd66e4ef7aad042815)), closes [#16221](https://github.com/aws/aws-cdk/issues/16221)
* **lambda-nodejs:** yarn berry goes into immutable mode in CI ([#17086](https://github.com/aws/aws-cdk/issues/17086)) ([cc8dd69](https://github.com/aws/aws-cdk/commit/cc8dd694e6746b9c6fc4663775aaa3b68d19ef61)), closes [#17082](https://github.com/aws/aws-cdk/issues/17082)
* **logs:** Apply tags to log retention Lambda  ([#17029](https://github.com/aws/aws-cdk/issues/17029)) ([a6aaa64](https://github.com/aws/aws-cdk/commit/a6aaa64bf9779b984f20d18881b4f6e510ac091a)), closes [#15032](https://github.com/aws/aws-cdk/issues/15032)
* **pipelines:** `additionalInputs` not working ([#17279](https://github.com/aws/aws-cdk/issues/17279)) ([9e81dc7](https://github.com/aws/aws-cdk/commit/9e81dc731993a55fbc05c642ce96151f12ed69da)), closes [#17224](https://github.com/aws/aws-cdk/issues/17224)
* **s3:** enforce that fromBucketAttributes supplies a valid bucket name ([#16915](https://github.com/aws/aws-cdk/issues/16915)) ([30ac0cc](https://github.com/aws/aws-cdk/commit/30ac0cc2d95ef3fd79d0658428975ea675b6916f))


### Reverts

* "chore: activate 'rosetta infuse' feature ([#17191](https://github.com/aws/aws-cdk/issues/17191))" ([#17329](https://github.com/aws/aws-cdk/issues/17329)) ([c8cd515](https://github.com/aws/aws-cdk/commit/c8cd515b3984ce0d8bfbe2d19cd56d299785e78b))

## [2.0.0-rc.27](https://github.com/aws/aws-cdk/compare/v2.0.0-rc.26...v2.0.0-rc.27) (2021-10-27)


### Features

* **cloudfront:** add amplify managed cache policy  ([#16880](https://github.com/aws/aws-cdk/issues/16880)) ([8d0c555](https://github.com/aws/aws-cdk/commit/8d0c555d048c07518c89e69951a1e9f21ba99bd7))
* **ec2:** add region parameter for UserData via addS3DownloadCommand  ([#16667](https://github.com/aws/aws-cdk/issues/16667)) ([691d377](https://github.com/aws/aws-cdk/commit/691d3771d32002b3cd4cb1221af92762b749e716)), closes [#8287](https://github.com/aws/aws-cdk/issues/8287)
* **ec2:** add vpcArn to IVpc and Vpc ([#16666](https://github.com/aws/aws-cdk/issues/16666)) ([7b31376](https://github.com/aws/aws-cdk/commit/7b31376e6349440f7b215d6e11c3dd900d50df34)), closes [#16493](https://github.com/aws/aws-cdk/issues/16493)
* **ec2:** add X2g instances (for RDS) ([#17081](https://github.com/aws/aws-cdk/issues/17081)) ([443a23e](https://github.com/aws/aws-cdk/commit/443a23e8c1e0de97f6ae05a3e451b0407165a447)), closes [/github.com/aws/aws-cdk/issues/16948#issuecomment-946254267](https://github.com/aws//github.com/aws/aws-cdk/issues/16948/issues/issuecomment-946254267) [#16948](https://github.com/aws/aws-cdk/issues/16948)
* **ec2:** look up VPC from different regions ([#16728](https://github.com/aws/aws-cdk/issues/16728)) ([f1e244b](https://github.com/aws/aws-cdk/commit/f1e244b331f95253030bae0525775683b5a350c4)), closes [#10208](https://github.com/aws/aws-cdk/issues/10208)
* **route53:** Expose VpcEndpointServiceDomainName domain name as a property  ([#16458](https://github.com/aws/aws-cdk/issues/16458)) ([e063fbd](https://github.com/aws/aws-cdk/commit/e063fbd3a31bdce046b2598e4a429c45d016f055))


### Bug Fixes

* **rds:** using both Instance imports & exports for Postgres fails deployment ([#17060](https://github.com/aws/aws-cdk/issues/17060)) ([ab627c6](https://github.com/aws/aws-cdk/commit/ab627c69e9edac82b1fd07d2c9ee1b05f7dc3166)), closes [#16757](https://github.com/aws/aws-cdk/issues/16757)

## [2.0.0-rc.26](https://github.com/aws/aws-cdk/compare/v2.0.0-rc.25...v2.0.0-rc.26) (2021-10-25)


### Bug Fixes

* **core:** `DefaultSynthesizer` deployments are never skipped ([#17099](https://github.com/aws/aws-cdk/issues/17099)) ([c74b012](https://github.com/aws/aws-cdk/commit/c74b0127af95f8e86b95a0be2f2c6cb30fab1103)), closes [#16959](https://github.com/aws/aws-cdk/issues/16959)

## [2.0.0-rc.25](https://github.com/aws/aws-cdk/compare/v2.0.0-rc.24...v2.0.0-rc.25) (2021-10-22)


### Features

* **aws-autoscaling:** add flag and aspect to require imdsv2 ([#16052](https://github.com/aws/aws-cdk/issues/16052)) ([ef7e20d](https://github.com/aws/aws-cdk/commit/ef7e20df08b4321f210bfc050afa42d7b4901931))
* **codebuild:** add support for small ARM machine type ([#16635](https://github.com/aws/aws-cdk/issues/16635)) ([55fbc86](https://github.com/aws/aws-cdk/commit/55fbc866ef0195fdfc722206e4d69a1f4469cd40)), closes [#16633](https://github.com/aws/aws-cdk/issues/16633)
* **codepipeline:** add support for string user parameters to the Lambda invoke action ([#16946](https://github.com/aws/aws-cdk/issues/16946)) ([e19ea31](https://github.com/aws/aws-cdk/commit/e19ea31dbf62446edaf5131c75246098ab05da6e)), closes [#16776](https://github.com/aws/aws-cdk/issues/16776)
* **dynamodb:** add option to skip waiting for global replication to finish ([#16983](https://github.com/aws/aws-cdk/issues/16983)) ([254601f](https://github.com/aws/aws-cdk/commit/254601f477a4da309e81f5384140427f1b958bfd)), closes [#16611](https://github.com/aws/aws-cdk/issues/16611)
* **ec2:** add aspect to require imdsv2 ([#16051](https://github.com/aws/aws-cdk/issues/16051)) ([0947b21](https://github.com/aws/aws-cdk/commit/0947b21c1e3186042324820ec5ab433237246f58))
* **eks:** configure serviceIpv4Cidr on the cluster ([#16957](https://github.com/aws/aws-cdk/issues/16957)) ([72102c7](https://github.com/aws/aws-cdk/commit/72102c750bfd6564cd51c1a5d8abc79b1ba1d3ce)), closes [/docs.aws.amazon.com/eks/latest/APIReference/API_KubernetesNetworkConfigRequest.html#AmazonEKS-Type-KubernetesNetworkConfigRequest-serviceIpv4](https://github.com/aws//docs.aws.amazon.com/eks/latest/APIReference/API_KubernetesNetworkConfigRequest.html/issues/AmazonEKS-Type-KubernetesNetworkConfigRequest-serviceIpv4) [#16541](https://github.com/aws/aws-cdk/issues/16541)
* **events:** Add DLQ support for SQS target ([#16916](https://github.com/aws/aws-cdk/issues/16916)) ([7fda903](https://github.com/aws/aws-cdk/commit/7fda90318e18b3a5d126b040e35a0146634d5f2d)), closes [#16417](https://github.com/aws/aws-cdk/issues/16417)
* **stepfunctions-tasks:** add `enableNetworkIsolation` property to `SageMakerCreateTrainingJobProps`  ([#16792](https://github.com/aws/aws-cdk/issues/16792)) ([69ac520](https://github.com/aws/aws-cdk/commit/69ac520452b219bf242f2fbb4740f6b1b8b8790f)), closes [#16779](https://github.com/aws/aws-cdk/issues/16779)


### Bug Fixes

* **cfn-diff:** correctly handle Date strings in diff ([#16591](https://github.com/aws/aws-cdk/issues/16591)) ([86f2714](https://github.com/aws/aws-cdk/commit/86f2714613f06aaf2bcee27da2f66066c8e863d0)), closes [#16444](https://github.com/aws/aws-cdk/issues/16444)
* **core:** asset hash is different between linux and windows ([#16945](https://github.com/aws/aws-cdk/issues/16945)) ([59950dd](https://github.com/aws/aws-cdk/commit/59950dd331635fb707aac819529614c0f3e47ee5)), closes [#14555](https://github.com/aws/aws-cdk/issues/14555) [#16928](https://github.com/aws/aws-cdk/issues/16928)
* **custom-resources:** Role Session Name can exceed maximum size ([#16680](https://github.com/aws/aws-cdk/issues/16680)) ([3617b70](https://github.com/aws/aws-cdk/commit/3617b70527516237955b8415fcfc8b58d3e23b3c))
* **ecs:** imported services don't have account & region set correctly ([#16997](https://github.com/aws/aws-cdk/issues/16997)) ([dc6f743](https://github.com/aws/aws-cdk/commit/dc6f7433f01b9bc2c8206fb03d72ab8404fe4f6a)), closes [#11199](https://github.com/aws/aws-cdk/issues/11199) [#11199](https://github.com/aws/aws-cdk/issues/11199) [#15944](https://github.com/aws/aws-cdk/issues/15944)
* **ecs-patterns:** minScalingCapacity cannot be set to 0 ([#16961](https://github.com/aws/aws-cdk/issues/16961)) ([589f284](https://github.com/aws/aws-cdk/commit/589f284acec8530aa9824b75a5daef4632e98985)), closes [#15632](https://github.com/aws/aws-cdk/issues/15632) [#14336](https://github.com/aws/aws-cdk/issues/14336)
* **events:** PhysicalName.GENERATE_IF_NEEDED does not work for EventBus ([#17008](https://github.com/aws/aws-cdk/issues/17008)) ([707fa00](https://github.com/aws/aws-cdk/commit/707fa003a458039878a1ae5173b6665a84c1170b)), closes [#14337](https://github.com/aws/aws-cdk/issues/14337)
* **lambda:** docker image function fails when insightsVersion is specified ([#16781](https://github.com/aws/aws-cdk/issues/16781)) ([d0e15cc](https://github.com/aws/aws-cdk/commit/d0e15ccaca22c5e05b9186aa1a241e744d67c96a)), closes [#16642](https://github.com/aws/aws-cdk/issues/16642)
* **lambda-layer-node-proxy-agent:** Replace use of package.json with Dockerfile command `npm install [package]@[version]` ([#17078](https://github.com/aws/aws-cdk/issues/17078)) ([a129046](https://github.com/aws/aws-cdk/commit/a129046495a926561f94f5ce1f41c34b1df3afde))
* **opensearch:** add validation to domainName property ([#17017](https://github.com/aws/aws-cdk/issues/17017)) ([3ec6832](https://github.com/aws/aws-cdk/commit/3ec683283e96159d588797bd46d33c82ff3076f1)), closes [#17016](https://github.com/aws/aws-cdk/issues/17016)
* **pipelines:** `additionalInputs` fails for deep directory ([#17074](https://github.com/aws/aws-cdk/issues/17074)) ([403d3ce](https://github.com/aws/aws-cdk/commit/403d3ce3bc0f4e30e9694e5c20743f0032009464)), closes [#16936](https://github.com/aws/aws-cdk/issues/16936)
* **ssm:**  StringParameter accepts ParameterType.AWS_EC2_IMAGE_ID as type ([#16884](https://github.com/aws/aws-cdk/issues/16884)) ([2b353be](https://github.com/aws/aws-cdk/commit/2b353be5291cbcdc56a8863038eed4a5f2adc65f)), closes [#16806](https://github.com/aws/aws-cdk/issues/16806)

## [2.0.0-rc.24](https://github.com/aws/aws-cdk/compare/v2.0.0-rc.23...v2.0.0-rc.24) (2021-10-13)


### Features

* **aws-chatbot:** allow adding a sns topic in existing SlackChannel ([#16643](https://github.com/aws/aws-cdk/issues/16643)) ([d29a20b](https://github.com/aws/aws-cdk/commit/d29a20bece48829e5dddbf3fd9045a96f1440c02)), closes [#15588](https://github.com/aws/aws-cdk/issues/15588)
* **aws-ec2:** userdata cfn-signal signal resource which is different than the attached resource ([#16264](https://github.com/aws/aws-cdk/issues/16264)) ([f24a1ae](https://github.com/aws/aws-cdk/commit/f24a1ae21b30868146b30a0897dc659f99241de4))
* **backup:** expose method to add statements to the vault policy ([#16597](https://github.com/aws/aws-cdk/issues/16597)) ([3ff1537](https://github.com/aws/aws-cdk/commit/3ff15378c1463920d010231df7d4c801d28b4486))
* **backup:** option to prevent recovery point deletions ([#16282](https://github.com/aws/aws-cdk/issues/16282)) ([6e71806](https://github.com/aws/aws-cdk/commit/6e718067b6c4e1a2c905fedcc60a6863ba3add12))
* **cfnspec:** cloudformation spec v41.1.0 ([#16472](https://github.com/aws/aws-cdk/issues/16472)) ([28875f9](https://github.com/aws/aws-cdk/commit/28875f9dda4911d3a2fcfcdc6e6d8358bee7c689))
* **cfnspec:** cloudformation spec v41.1.0 ([#16524](https://github.com/aws/aws-cdk/issues/16524)) ([124a7a1](https://github.com/aws/aws-cdk/commit/124a7a1c20981c72bfdce0c857c87c46c6cb5f51))
* **cfnspec:** cloudformation spec v41.2.0 ([#16550](https://github.com/aws/aws-cdk/issues/16550)) ([e047bd8](https://github.com/aws/aws-cdk/commit/e047bd80ab08f49a22408eb8c5401f4306747eff))
* **cfnspec:** cloudformation spec v42.0.0 ([#16639](https://github.com/aws/aws-cdk/issues/16639)) ([2157acd](https://github.com/aws/aws-cdk/commit/2157acd4287dc9df1ae4642bbe049c181e3432b6))
* **cfnspec:** cloudformation spec v43.0.0 ([#16748](https://github.com/aws/aws-cdk/issues/16748)) ([7c473a6](https://github.com/aws/aws-cdk/commit/7c473a6efa1f7e07799a96f649cb32f66d178e43))
* **cfnspec:** cloudformation spec v43.0.0 ([#16820](https://github.com/aws/aws-cdk/issues/16820)) ([071756c](https://github.com/aws/aws-cdk/commit/071756c695ca5d7fdbf94552efdf08511acdbee4))
* **cfnspec:** cloudformation spec v43.0.0 ([#16842](https://github.com/aws/aws-cdk/issues/16842)) ([ebb211b](https://github.com/aws/aws-cdk/commit/ebb211ba889acdcddbfb9338a4258009ccd494a2))
* **cli:** hotswap deployments for ECS Services ([#16864](https://github.com/aws/aws-cdk/issues/16864)) ([ad7288f](https://github.com/aws/aws-cdk/commit/ad7288f35a17fcfbecd7080e99ece4873fa99ad2))
* **cli:** hotswap deployments for StepFunctions State Machines ([#16489](https://github.com/aws/aws-cdk/issues/16489)) ([c3417f6](https://github.com/aws/aws-cdk/commit/c3417f651e45170efd339960fbb0e4957bcbd3a3))
* **cloudfront:** support Behavior-specific viewer protocol policy for CloudFrontWebDistribution ([#16389](https://github.com/aws/aws-cdk/issues/16389)) ([5c028c5](https://github.com/aws/aws-cdk/commit/5c028c54aa7635dd55095257ebe81bdf2158ea39)), closes [#7086](https://github.com/aws/aws-cdk/issues/7086)
* **cloudwatch:** support cross-environment search expressions ([#16539](https://github.com/aws/aws-cdk/issues/16539)) ([c165138](https://github.com/aws/aws-cdk/commit/c165138fa7c3456e530ffeab9b7a038914cc2dca)), closes [#9039](https://github.com/aws/aws-cdk/issues/9039)
* **config:** EC2_INSTANCE_PROFILE_ATTACHED managed rule ([#16011](https://github.com/aws/aws-cdk/issues/16011)) ([816a319](https://github.com/aws/aws-cdk/commit/816a31984b5c6e08c4c7dd740919e0c1f5d0e196))
* **ec2:** add X2gd instances ([#16810](https://github.com/aws/aws-cdk/issues/16810)) ([6d468d2](https://github.com/aws/aws-cdk/commit/6d468d2f742aad8bc9de6bfe9650c3cdccd30a32)), closes [#16794](https://github.com/aws/aws-cdk/issues/16794)
* **ec2/ecs:** `cacheInContext` properties for machine images ([#16021](https://github.com/aws/aws-cdk/issues/16021)) ([430f50a](https://github.com/aws/aws-cdk/commit/430f50a546e9c575f8cdbd259367e440d985e68f)), closes [#12484](https://github.com/aws/aws-cdk/issues/12484)
* **ecr-assets:** control docker image asset hash ([#16070](https://github.com/aws/aws-cdk/issues/16070)) ([13f67e7](https://github.com/aws/aws-cdk/commit/13f67e7dbcf2ca7a921e7ffb932f260c74005408)), closes [#15936](https://github.com/aws/aws-cdk/issues/15936)
* **ecs-service-extensions:** Publish Extension ([#16326](https://github.com/aws/aws-cdk/issues/16326)) ([c6c5941](https://github.com/aws/aws-cdk/commit/c6c594159c7fbda66f40fe8666f70b6806bb2d5e))
* **eks:** `connectAutoScalingGroupCapacity` on imported clusters ([#14650](https://github.com/aws/aws-cdk/issues/14650)) ([7f7be08](https://github.com/aws/aws-cdk/commit/7f7be089fa84afd0ab009a7feca2df4315749bc3))
* **eks:** add warning to fargateProfile ([#16631](https://github.com/aws/aws-cdk/issues/16631)) ([41fdebb](https://github.com/aws/aws-cdk/commit/41fdebb974a2b29ba461757d210fa3a8b8cdc73d)), closes [#16349](https://github.com/aws/aws-cdk/issues/16349)
* **elbv2:** support ALB target for NLB ([#16687](https://github.com/aws/aws-cdk/issues/16687)) ([27cc821](https://github.com/aws/aws-cdk/commit/27cc82186c73db5e68e00448133dd6e79e13d90c)), closes [#16679](https://github.com/aws/aws-cdk/issues/16679)
* **lambda:** configure workdir for docker image based functions ([#16111](https://github.com/aws/aws-cdk/issues/16111)) ([b3eafc2](https://github.com/aws/aws-cdk/commit/b3eafc2dc61ed69de20196fa08a4df3c29ecc894))
* **lambda:** docker platform for architecture ([#16858](https://github.com/aws/aws-cdk/issues/16858)) ([5c258a3](https://github.com/aws/aws-cdk/commit/5c258a30367a4922e404eb26e5aa076720846fbe))
* **lambda:** support for ARM architecture ([b3ba35e](https://github.com/aws/aws-cdk/commit/b3ba35e9b8b157303a29350031885eff0c73b05b))
* **lambda:** support for ARM architecture ([#16719](https://github.com/aws/aws-cdk/issues/16719)) ([67b4921](https://github.com/aws/aws-cdk/commit/67b4921ef19a357314697fb3737849a5ff426090))
* **lambda:** use bundling docker image from ECR public for dotnet and go runtimes ([#16281](https://github.com/aws/aws-cdk/issues/16281)) ([9bbfd18](https://github.com/aws/aws-cdk/commit/9bbfd185c2383612e2be7317a091b72cc5e7a120))
* **lambda-event-sources:** self managed kafka: support sasl/plain authentication ([#16712](https://github.com/aws/aws-cdk/issues/16712)) ([d4ad93f](https://github.com/aws/aws-cdk/commit/d4ad93f30877b26b851caa81d3a4a1d80df55164))
* **opensearch:** rebrand Elasticsearch as OpenSearch ([e6c4ca5](https://github.com/aws/aws-cdk/commit/e6c4ca5e71934e890eabe41190e9c2d0bd42aefb)), closes [aws/aws-cdk#16467](https://github.com/aws/aws-cdk/issues/16467)
* **opensearch:** rebrand Elasticsearch as OpenSearch ([#16517](https://github.com/aws/aws-cdk/issues/16517)) ([fad855e](https://github.com/aws/aws-cdk/commit/fad855e7fb046844258e36e2699234407fbb64ec))
* **pipeline:** allow enabling KMS key rotation for cross-region Stacks ([#16468](https://github.com/aws/aws-cdk/issues/16468)) ([2a629dd](https://github.com/aws/aws-cdk/commit/2a629dd7a86cc36c3a503bfc5957880c9edd4d49)), closes [#14381](https://github.com/aws/aws-cdk/issues/14381)
* **pipelines:** stack-level steps ([#16215](https://github.com/aws/aws-cdk/issues/16215)) ([d499c85](https://github.com/aws/aws-cdk/commit/d499c85e4c09cc00b457ca7f2f4611a925ca8aeb)), closes [#16148](https://github.com/aws/aws-cdk/issues/16148)
* **rds:** region replication for generated secrets ([#16497](https://github.com/aws/aws-cdk/issues/16497)) ([1e9d8be](https://github.com/aws/aws-cdk/commit/1e9d8be0a81e1f875bf8b31c701e1069bb98728e)), closes [#16480](https://github.com/aws/aws-cdk/issues/16480)
* **s3-deployment:** enable efs support for handling large files in lambda ([#15220](https://github.com/aws/aws-cdk/issues/15220)) ([2737119](https://github.com/aws/aws-cdk/commit/27371197a24ce6c9212fc99e120c5d77fa08065e))
* **sns:** adding support for firehose subscription protocol ([#15764](https://github.com/aws/aws-cdk/issues/15764)) ([18aff6b](https://github.com/aws/aws-cdk/commit/18aff6b4c0a5e17c64685ac384b243c16cd910f1))
* **stepfunctions-tasks:** add step concurrency level to EmrCreateCluster ([#15242](https://github.com/aws/aws-cdk/issues/15242)) ([1deea90](https://github.com/aws/aws-cdk/commit/1deea9005656c2f0f25c56e773145b6e0ebcbb1b)), closes [#15223](https://github.com/aws/aws-cdk/issues/15223)
* **stepfunctions-tasks:** AWS SDK service integrations ([#16746](https://github.com/aws/aws-cdk/issues/16746)) ([ae840ff](https://github.com/aws/aws-cdk/commit/ae840ff1abb8283a1290dae5859f5729a9cf72b1)), closes [#16780](https://github.com/aws/aws-cdk/issues/16780)
* allow stale bot trigger manually ([#16586](https://github.com/aws/aws-cdk/issues/16586)) ([fc8cfee](https://github.com/aws/aws-cdk/commit/fc8cfee77008314d59eda8f18d2c91c23e2a23ab))
* **stepfunctions-tasks:** support Associate Workflow Executions on StepFunctionsStartExecution via associateWithParent property ([#16475](https://github.com/aws/aws-cdk/issues/16475)) ([7d3b90b](https://github.com/aws/aws-cdk/commit/7d3b90b2097aa9b7170a77befcee5822d5d0c3e7)), closes [#14778](https://github.com/aws/aws-cdk/issues/14778)


### Bug Fixes

* use registry.npmjs.com to fix shinkwrap resolves ([#16607](https://github.com/aws/aws-cdk/issues/16607)) ([8f91531](https://github.com/aws/aws-cdk/commit/8f91531c3c25900316d40d5564450566a03e27ee))
* **assets:** run executable command of container assets in cloud assembly root directory ([#16094](https://github.com/aws/aws-cdk/issues/16094)) ([c2852c9](https://github.com/aws/aws-cdk/commit/c2852c9c524a639a312bf296f7f23b0e3b112f6b)), closes [#15721](https://github.com/aws/aws-cdk/issues/15721)
* **autoscaling:** EbsDeviceVolumeType.IO2 is not a valid CloudFormation value ([#16028](https://github.com/aws/aws-cdk/issues/16028)) ([492d33b](https://github.com/aws/aws-cdk/commit/492d33b27bc5b935e3da75f0bddd875bb6f9c15d)), closes [#16027](https://github.com/aws/aws-cdk/issues/16027)
* **aws-ecs:** add ASG capacity via Capacity Provider by not specifying machineImageType ([#16361](https://github.com/aws/aws-cdk/issues/16361)) ([93b3fdc](https://github.com/aws/aws-cdk/commit/93b3fdce80f0997d7b809f9ef7e3edd1e75e1f42)), closes [#16360](https://github.com/aws/aws-cdk/issues/16360)
* **aws-eks:** Support for http proxy in EKS onEvent lambda ([#16609](https://github.com/aws/aws-cdk/issues/16609)) ([cf22280](https://github.com/aws/aws-cdk/commit/cf222806f781c3476dd942c57787ad0f4924dc04)), closes [/github.com/aws/aws-cdk/blob/7dae114b7aac46321b8d8572e6837428b4c633b2/tools/pkglint/lib/rules.ts#L1332](https://github.com/aws//github.com/aws/aws-cdk/blob/7dae114b7aac46321b8d8572e6837428b4c633b2/tools/pkglint/lib/rules.ts/issues/L1332)
* **aws-eks:** support http proxy in EKS onEvent lambda ([#16657](https://github.com/aws/aws-cdk/issues/16657)) ([87c9570](https://github.com/aws/aws-cdk/commit/87c957029ba5adecc9dddd72d9190d8a7abb913f)), closes [/github.com/aws/aws-cdk/pull/16657#issuecomment-928260661](https://github.com/aws//github.com/aws/aws-cdk/pull/16657/issues/issuecomment-928260661) [/github.com/aws/aws-cdk/pull/16657#issuecomment-928529421](https://github.com/aws//github.com/aws/aws-cdk/pull/16657/issues/issuecomment-928529421) [/github.com/aws/aws-cdk/blob/7dae114b7aac46321b8d8572e6837428b4c633b2/tools/pkglint/lib/rules.ts#L1332](https://github.com/aws//github.com/aws/aws-cdk/blob/7dae114b7aac46321b8d8572e6837428b4c633b2/tools/pkglint/lib/rules.ts/issues/L1332)
* **cli:** 'deploy' and 'diff' silently does nothing when given unknown stack name ([#16150](https://github.com/aws/aws-cdk/issues/16150)) ([74776f3](https://github.com/aws/aws-cdk/commit/74776f393462f7e7d23cb1953ef786a823adc896)), closes [#15866](https://github.com/aws/aws-cdk/issues/15866)
* **cli:** progress bar overshoots count by 1 for stack updates ([#16168](https://github.com/aws/aws-cdk/issues/16168)) ([0c8ecb8](https://github.com/aws/aws-cdk/commit/0c8ecb8cfc2cec9fd8c9f238c049b604a0f149fe))
* **cloudformation-diff:** cdk diff not picking up differences if old/new value is in format n.n.n ([#16050](https://github.com/aws/aws-cdk/issues/16050)) ([38426c9](https://github.com/aws/aws-cdk/commit/38426c985d5e0713bbbf14fa639520eca6294124)), closes [#15935](https://github.com/aws/aws-cdk/issues/15935)
* **cloudfront:** EdgeFunctions cannot be created when IDs contain spaces ([#16845](https://github.com/aws/aws-cdk/issues/16845)) ([b0752c5](https://github.com/aws/aws-cdk/commit/b0752c5dcd0f1fa64b39d1b80ab2c0e0a99a72b0)), closes [#16832](https://github.com/aws/aws-cdk/issues/16832)
* **cloudwatch:** alarms with accountId fails in regions that don't support cross-account alarms ([#16875](https://github.com/aws/aws-cdk/issues/16875)) ([54472a0](https://github.com/aws/aws-cdk/commit/54472a0ccebe208dca3402367626a938731544b0)), closes [#16874](https://github.com/aws/aws-cdk/issues/16874)
* **cloudwatch:** cross account alarms does not support math expressions ([#16333](https://github.com/aws/aws-cdk/issues/16333)) ([1ffd897](https://github.com/aws/aws-cdk/commit/1ffd89714f8b1c1389d4e43383cc77d16d00ed9e)), closes [#16331](https://github.com/aws/aws-cdk/issues/16331)
* **codebuild:** add build image AMAZON_LINUX_2_ARM_2 ([#16931](https://github.com/aws/aws-cdk/issues/16931)) ([370cb31](https://github.com/aws/aws-cdk/commit/370cb310cce3fccc5381d8d53130e21b266de868)), closes [#16930](https://github.com/aws/aws-cdk/issues/16930)
* **config:** add SourceAccount condition to Lambda permission ([#16617](https://github.com/aws/aws-cdk/issues/16617)) ([cfcaf45](https://github.com/aws/aws-cdk/commit/cfcaf452da163efa33df752b0ff026b3ea608dfc))
* **config:** the IGW mapping to correct resource type ([#16464](https://github.com/aws/aws-cdk/issues/16464)) ([23d9b6a](https://github.com/aws/aws-cdk/commit/23d9b6a7d5b213e4a1ba4a71984e8e19e3657bd7)), closes [#16463](https://github.com/aws/aws-cdk/issues/16463)
* **core:** asset hash of symlinked dir is wrong ([#16429](https://github.com/aws/aws-cdk/issues/16429)) ([36ff738](https://github.com/aws/aws-cdk/commit/36ff73809a37998e15176cb8815c118e7ea0c295))
* **ec2:** set proper role for --role argument of cfn-init ([#16503](https://github.com/aws/aws-cdk/issues/16503)) ([cdbd65d](https://github.com/aws/aws-cdk/commit/cdbd65dc525147810650b4c32d48664a38abede1)), closes [#16501](https://github.com/aws/aws-cdk/issues/16501)
* **elasticloadbalancingv2:** Incorrect validation on `NetworkLoadBalancer.configureHealthCheck()` ([#16445](https://github.com/aws/aws-cdk/issues/16445)) ([140892a](https://github.com/aws/aws-cdk/commit/140892af639c78eebebecf687eb1b37ab75d643d))
* **iam:** `User.fromUserArn` does not work for ARNs that include a path ([#16269](https://github.com/aws/aws-cdk/issues/16269)) ([5c69c94](https://github.com/aws/aws-cdk/commit/5c69c941bc5e7284f5873110e7c7c86cdeba42fb)), closes [40aws-cdk/aws-iam/lib/role.ts#L191-L194](https://github.com/40aws-cdk/aws-iam/lib/role.ts/issues/L191-L194) [#16256](https://github.com/aws/aws-cdk/issues/16256)
* **iam:** not possible to represent `Principal: *` ([#16843](https://github.com/aws/aws-cdk/issues/16843)) ([6829a2a](https://github.com/aws/aws-cdk/commit/6829a2abe4d020d6a6eae7ff31e23b43d8762920))
* **lambda:** currentVersion fails when architecture specified ([#16849](https://github.com/aws/aws-cdk/issues/16849)) ([8a0d369](https://github.com/aws/aws-cdk/commit/8a0d3699d7fc3dff70aa6416d30a30b57d29ff7e)), closes [#16814](https://github.com/aws/aws-cdk/issues/16814)
* **revert:** "fix: CDK does not honor NO_PROXY settings ([#16751](https://github.com/aws/aws-cdk/issues/16751))" ([#16761](https://github.com/aws/aws-cdk/issues/16761)) ([eda7e84](https://github.com/aws/aws-cdk/commit/eda7e84400d766b8045972c496851e975544c38f)), closes [/github.com/aws/aws-cdk/pull/16751/files#r720549975](https://github.com/aws//github.com/aws/aws-cdk/pull/16751/files/issues/r720549975)
* **route53-targets:** ApiGateway does not accept RestApiBase ([#16610](https://github.com/aws/aws-cdk/issues/16610)) ([20071bb](https://github.com/aws/aws-cdk/commit/20071bb12648adeab96e4dbcb31f5bd50c5f631d)), closes [#16227](https://github.com/aws/aws-cdk/issues/16227)
* **s3:** auto-delete fails when bucket has been deleted manually ([#16645](https://github.com/aws/aws-cdk/issues/16645)) ([7b4fa72](https://github.com/aws/aws-cdk/commit/7b4fa721deac1d263d86c1d552c984fa1486f42e)), closes [#16619](https://github.com/aws/aws-cdk/issues/16619)
* **s3:** setting `autoDeleteObjects` to `false` empties the bucket ([#16756](https://github.com/aws/aws-cdk/issues/16756)) ([21836f2](https://github.com/aws/aws-cdk/commit/21836f249395045a4a697fbfe553fe17e1c5e6a1)), closes [#16603](https://github.com/aws/aws-cdk/issues/16603)
* CDK does not honor NO_PROXY settings ([#16751](https://github.com/aws/aws-cdk/issues/16751)) ([ceab036](https://github.com/aws/aws-cdk/commit/ceab036fa9dfcd13c58c7d818339cd05ed515bec)), closes [#7121](https://github.com/aws/aws-cdk/issues/7121)
* correct package names in support scripts ([ebfd5f2](https://github.com/aws/aws-cdk/commit/ebfd5f2b203106135b2474b327727b2fee400380))
* remove invalid entry from stale issue bot config ([#16587](https://github.com/aws/aws-cdk/issues/16587)) ([5461859](https://github.com/aws/aws-cdk/commit/546185977cb245b2ed4ddf31da7612d52a20706e))
* set ROSETTA_MAX_WORKER_COUNT in pack.sh ([#16738](https://github.com/aws/aws-cdk/issues/16738)) ([5d06641](https://github.com/aws/aws-cdk/commit/5d06641cc82d05917a89da21cd79392ec9092c51))
* **iam:** permissions boundary aspect doesn't always recognize roles ([#16154](https://github.com/aws/aws-cdk/issues/16154)) ([c8bfcf6](https://github.com/aws/aws-cdk/commit/c8bfcf650070a0138b148645f997f542431f70cf))
* **logs:** log retention fails with OperationAbortedException ([#16083](https://github.com/aws/aws-cdk/issues/16083)) ([3e9f04d](https://github.com/aws/aws-cdk/commit/3e9f04dbbd7aadb8ab4394fefd6281f1d6d30fe0)), closes [aws#15709](https://github.com/aws/aws/issues/15709)
* **sns:** cannot use numeric filter policy with 0 values ([#16551](https://github.com/aws/aws-cdk/issues/16551)) ([62b6762](https://github.com/aws/aws-cdk/commit/62b6762195324cf04758ab96ed20925b4939b773)), closes [#16549](https://github.com/aws/aws-cdk/issues/16549)
* **SSM API docs:** Typo `SecretString` -> `SecureString` and note how SecureStrings cannot be created via CDK ([#16228](https://github.com/aws/aws-cdk/issues/16228)) ([950e875](https://github.com/aws/aws-cdk/commit/950e875bfb431c051b5ee2fd405aaf7f2b47bfeb))


### Reverts

* **aws-eks:** "fix(aws-eks): Support for http proxy in EKS onEvent lambda" ([#16651](https://github.com/aws/aws-cdk/issues/16651)) ([376c837](https://github.com/aws/aws-cdk/commit/376c83749cd4b5260df724dabe2e44e0dc3f792a))

## [2.0.0-rc.23](https://github.com/aws/aws-cdk/compare/v2.0.0-rc.22...v2.0.0-rc.23) (2021-09-22)

## [2.0.0-rc.22](https://github.com/aws/aws-cdk/compare/v2.0.0-rc.21...v2.0.0-rc.22) (2021-09-15)

## [2.0.0-rc.21](https://github.com/aws/aws-cdk/compare/v2.0.0-rc.20...v2.0.0-rc.21) (2021-09-08)


### Features

* **aws-cloudfront-origins:** add custom headers to S3Origin ([#16161](https://github.com/aws/aws-cdk/issues/16161)) ([f42b233](https://github.com/aws/aws-cdk/commit/f42b233a76ae810634fa43a25604dbc65bdd63b9)), closes [#16160](https://github.com/aws/aws-cdk/issues/16160)
* **cfnspec:** cloudformation spec v40.1.0 ([#16254](https://github.com/aws/aws-cdk/issues/16254)) ([fe81be7](https://github.com/aws/aws-cdk/commit/fe81be78322e3f1c23d2b02e59b56faa3b06e554))
* **cli:** hotswap deployments ([#15748](https://github.com/aws/aws-cdk/issues/15748)) ([6e55c95](https://github.com/aws/aws-cdk/commit/6e55c952d683f87bb815deb29124b9a37824749a))
* **cli:** support `--no-rollback` flag ([#16293](https://github.com/aws/aws-cdk/issues/16293)) ([d763d90](https://github.com/aws/aws-cdk/commit/d763d9092289d0b28b2695b8474b44ed7d0bce54)), closes [#16289](https://github.com/aws/aws-cdk/issues/16289)
* **codecommit:** make Repository a source for CodeStar Notifications ([#15739](https://github.com/aws/aws-cdk/issues/15739)) ([ae34d4a](https://github.com/aws/aws-cdk/commit/ae34d4a69a5073d8f0175b5282fa8bf92139fab5))
* **core:** normalize line endings in asset hash calculation ([#16276](https://github.com/aws/aws-cdk/issues/16276)) ([01bf6e2](https://github.com/aws/aws-cdk/commit/01bf6e2922994e7d41c8c6b171aa1693835f2b53))
* **ec2:** add m6i instances ([#16081](https://github.com/aws/aws-cdk/issues/16081)) ([a42a1ea](https://github.com/aws/aws-cdk/commit/a42a1ea5a122f864936cdb0113b16fe92cc7205e))
* **ecs:** add support for Fargate PV1.4 ephemeral storage ([#15440](https://github.com/aws/aws-cdk/issues/15440)) ([f1bf935](https://github.com/aws/aws-cdk/commit/f1bf935c47006096b33fb7bf0c847ffab9230870)), closes [#14570](https://github.com/aws/aws-cdk/issues/14570)
* **ecs-patterns:** add capacity provider strategies to queue processing service pattern ([#15684](https://github.com/aws/aws-cdk/issues/15684)) ([f40e8d6](https://github.com/aws/aws-cdk/commit/f40e8d6a502dd42e0a52d81f72abecaa2cdd920a)), closes [#14781](https://github.com/aws/aws-cdk/issues/14781)
* **ecs-patterns:** Allow configuration of SSL policy for listeners created by ECS patterns ([#15210](https://github.com/aws/aws-cdk/issues/15210)) ([2c3d21e](https://github.com/aws/aws-cdk/commit/2c3d21e2f1117a54510ba92748588ee95ab3631c)), closes [#11841](https://github.com/aws/aws-cdk/issues/11841) [#8816](https://github.com/aws/aws-cdk/issues/8816)
* **ecs-service-extensions:** Subscribe Extension ([#16049](https://github.com/aws/aws-cdk/issues/16049)) ([66baca5](https://github.com/aws/aws-cdk/commit/66baca58adc294d5c5924cf8f8c5fa122c6d6dfc))
* **rds:** support 's3export' for Postgres database instances ([#16124](https://github.com/aws/aws-cdk/issues/16124)) ([1d54a45](https://github.com/aws/aws-cdk/commit/1d54a456cd5e2ff65251097f9a684e1ac200cc52)), closes [#14546](https://github.com/aws/aws-cdk/issues/14546) [#10370](https://github.com/aws/aws-cdk/issues/10370) [#14546](https://github.com/aws/aws-cdk/issues/14546)
* **stepfunctions-tasks:** await the eval so async ops can be passed to tasks.EvaluateExpression ([#16290](https://github.com/aws/aws-cdk/issues/16290)) ([174b066](https://github.com/aws/aws-cdk/commit/174b066634755c76d1b78d05ca9b403145dedc47))
* **stepfunctions-tasks:** support allocation strategies in EMR CreateCluster ([#16296](https://github.com/aws/aws-cdk/issues/16296)) ([5a5da57](https://github.com/aws/aws-cdk/commit/5a5da573149d45bf6e29bf7155715fa926804871)), closes [#16252](https://github.com/aws/aws-cdk/issues/16252)


### Bug Fixes

* **aws-rds:** fromDatabaseInstanceAttributes incorrectly stringifies ports with tokens ([#16286](https://github.com/aws/aws-cdk/issues/16286)) ([41b831a](https://github.com/aws/aws-cdk/commit/41b831a6698ee6c7a3c8968bff8273a0c7f35448)), closes [#11813](https://github.com/aws/aws-cdk/issues/11813)
* **core:** allow asset bundling when selinux is enabled ([#15742](https://github.com/aws/aws-cdk/issues/15742)) ([dbfebb4](https://github.com/aws/aws-cdk/commit/dbfebb47a8ae61b2bb0557b6ba79a7b073f9d0df))
* **core:** inconsistent analytics string across operating systems ([#16300](https://github.com/aws/aws-cdk/issues/16300)) ([ff6082c](https://github.com/aws/aws-cdk/commit/ff6082caf7e534989fb8ee6b4c63c0c02e9a5ec0)), closes [#15322](https://github.com/aws/aws-cdk/issues/15322)
* **docs:** unnecessary log group in Step Functions state machine x-ray example ([#16159](https://github.com/aws/aws-cdk/issues/16159)) ([04d4547](https://github.com/aws/aws-cdk/commit/04d45474d80d3687a3fdf27f4d76dd1c8521eff0))
* **elasticloadbalancingv2:** target group health check does not validate interval versus timeout ([#16107](https://github.com/aws/aws-cdk/issues/16107)) ([a85ad39](https://github.com/aws/aws-cdk/commit/a85ad392459c815d5c8e645dd3e8240d059024e6)), closes [#3703](https://github.com/aws/aws-cdk/issues/3703)
* **s3:** bucket is not emptied before update when the name changes ([#16203](https://github.com/aws/aws-cdk/issues/16203)) ([b1d69d7](https://github.com/aws/aws-cdk/commit/b1d69d7b06cd2a2ae8f578e217bdf7fef50a0163)), closes [#14011](https://github.com/aws/aws-cdk/issues/14011)


### Reverts

* temporarily transfer [@skinny85](https://github.com/skinny85) module ownership ([#16206](https://github.com/aws/aws-cdk/issues/16206)) ([e678f10](https://github.com/aws/aws-cdk/commit/e678f104df4fb0377c6ad5c8abc4132433363871))

## [2.0.0-rc.20](https://github.com/aws/aws-cdk/compare/v2.0.0-rc.19...v2.0.0-rc.20) (2021-09-01)


### Features

* **cloudwatch:** add support for cross-account alarms ([#16007](https://github.com/aws/aws-cdk/issues/16007)) ([e547ba0](https://github.com/aws/aws-cdk/commit/e547ba0d1491af0abe703132fa06fe786ffd7070)), closes [#15959](https://github.com/aws/aws-cdk/issues/15959)
* **cognito:** user pools - device tracking ([#16055](https://github.com/aws/aws-cdk/issues/16055)) ([64019bb](https://github.com/aws/aws-cdk/commit/64019bbf090e156261feb626a5a4bd7ff4f26545)), closes [#15013](https://github.com/aws/aws-cdk/issues/15013)
* **docdb:** cluster - deletion protection ([#15216](https://github.com/aws/aws-cdk/issues/15216)) ([0f7beb2](https://github.com/aws/aws-cdk/commit/0f7beb29be18d809052f4d46e415a0394c9299ab))
* **lambda:** nodejs14.x supports inline code ([#16131](https://github.com/aws/aws-cdk/issues/16131)) ([305f683](https://github.com/aws/aws-cdk/commit/305f683e86cca221705c0138572faa38043396eb))


### Bug Fixes

* (aws-ec2): fix vpc endpoint incorrect issue in China region ([#16139](https://github.com/aws/aws-cdk/issues/16139)) ([0d0db38](https://github.com/aws/aws-cdk/commit/0d0db38e3cdb557b4a641c5993068400847cc7df)), closes [#9864](https://github.com/aws/aws-cdk/issues/9864)
* **resourcegroups:** ResourceGroup not using TagType.STANDARD, causes deploy failure ([#16211](https://github.com/aws/aws-cdk/issues/16211)) ([cdee1af](https://github.com/aws/aws-cdk/commit/cdee1af03c34a1c08988e672bae6edc2538a8877)), closes [#12986](https://github.com/aws/aws-cdk/issues/12986)
* **sqs:** unable to import a FIFO queue when the queue ARN is a token ([#15976](https://github.com/aws/aws-cdk/issues/15976)) ([a1a65bc](https://github.com/aws/aws-cdk/commit/a1a65bc9a38b06ec51dff462e52b1beb8d421a56)), closes [#12466](https://github.com/aws/aws-cdk/issues/12466)
* **ssm:** StringParameter.fromStringParameterAttributes cannot accept version as a numeric Token ([#16048](https://github.com/aws/aws-cdk/issues/16048)) ([eb54cd4](https://github.com/aws/aws-cdk/commit/eb54cd416a48708898e30986058491e21125b2f7)), closes [#11913](https://github.com/aws/aws-cdk/issues/11913)

## [2.0.0-rc.19](https://github.com/aws/aws-cdk/compare/v2.0.0-rc.18...v2.0.0-rc.19) (2021-08-25)


### Features

* **assets:** exclude "cdk.out" from docker assets ([#16034](https://github.com/aws/aws-cdk/issues/16034)) ([84a831a](https://github.com/aws/aws-cdk/commit/84a831ab804244d426321504fc0971d74f6181fd)), closes [#14841](https://github.com/aws/aws-cdk/issues/14841) [#14841](https://github.com/aws/aws-cdk/issues/14841) [#14842](https://github.com/aws/aws-cdk/issues/14842)
* **aws-stepfunctions:** add support to heartbeat error inside catch block ([#16078](https://github.com/aws/aws-cdk/issues/16078)) ([2372b3c](https://github.com/aws/aws-cdk/commit/2372b3c360d13fb0224fc981a7bb1ae318581265)), closes [#16084](https://github.com/aws/aws-cdk/issues/16084)
* **cfnspec:** cloudformation spec v39.10.0 ([#16114](https://github.com/aws/aws-cdk/issues/16114)) ([7e0ad5d](https://github.com/aws/aws-cdk/commit/7e0ad5d17b30150922d0dfd81f42da11fadb8beb))
* **cfnspec:** cloudformation spec v40.0.0 ([#16183](https://github.com/aws/aws-cdk/issues/16183)) ([b059124](https://github.com/aws/aws-cdk/commit/b059124b238e27751217cbdaaa01c38b00e80fc9))
* **ecs:** add support for Bottlerocket on ARM64 ([#15454](https://github.com/aws/aws-cdk/issues/15454)) ([cd280a8](https://github.com/aws/aws-cdk/commit/cd280a8f4f46eb50be3a25d80c00a807881832c4)), closes [#14466](https://github.com/aws/aws-cdk/issues/14466)
* **s3-deployment:** exclude and include filters ([#16054](https://github.com/aws/aws-cdk/issues/16054)) ([d42e89e](https://github.com/aws/aws-cdk/commit/d42e89e01034dcba08c8f8ac0390a743143c4531)), closes [#14362](https://github.com/aws/aws-cdk/issues/14362) [#14362](https://github.com/aws/aws-cdk/issues/14362)


### Bug Fixes

* KubectlHandler - insecure kubeconfig warning ([#16063](https://github.com/aws/aws-cdk/issues/16063)) ([82dd282](https://github.com/aws/aws-cdk/commit/82dd2822a86431d0aa0be896550d421810b80c67)), closes [#14560](https://github.com/aws/aws-cdk/issues/14560)
* **cfnspec:** changes to resource-level documentation not supported ([#16170](https://github.com/aws/aws-cdk/issues/16170)) ([82e4b4f](https://github.com/aws/aws-cdk/commit/82e4b4f07be202e2d6c6afa4f9ed0d9d6146f0a8))
* **cli:** 'deploy' and 'diff' silently does nothing when given unknown stack name ([#16073](https://github.com/aws/aws-cdk/issues/16073)) ([f35b032](https://github.com/aws/aws-cdk/commit/f35b032cea4354992d3320e78c1ed0e2878a3fe7)), closes [#15866](https://github.com/aws/aws-cdk/issues/15866)
* **cli:** Python init template does not work in directory with '-' ([#15939](https://github.com/aws/aws-cdk/issues/15939)) ([3b2c790](https://github.com/aws/aws-cdk/commit/3b2c790c2b7d210868576540feab4e088376ab6c)), closes [#15938](https://github.com/aws/aws-cdk/issues/15938)
* **cli:** unknown command pytest in build container fails integration tests ([#16134](https://github.com/aws/aws-cdk/issues/16134)) ([0f7c0b4](https://github.com/aws/aws-cdk/commit/0f7c0b421327f1ffed28de79692191af187f23ca)), closes [#15939](https://github.com/aws/aws-cdk/issues/15939)
* **ec2:** opaque error when insufficient NAT EIPs are configured ([#16040](https://github.com/aws/aws-cdk/issues/16040)) ([a308cac](https://github.com/aws/aws-cdk/commit/a308cacf1fc48e24311caec246b768ffe6ae9153)), closes [#16039](https://github.com/aws/aws-cdk/issues/16039)
* **events:** cross-account event targets that have a Role are broken ([#15717](https://github.com/aws/aws-cdk/issues/15717)) ([f570c94](https://github.com/aws/aws-cdk/commit/f570c94a7bc99cd5bebc96ee388d152220f9f613)), closes [#15639](https://github.com/aws/aws-cdk/issues/15639)
* **s3-deployment:** BucketDeployment doesn't validate that distribution paths start with "/" ([#15865](https://github.com/aws/aws-cdk/issues/15865)) ([f8d8795](https://github.com/aws/aws-cdk/commit/f8d8795a610c3f49e31967001695caa648730d6d)), closes [#9317](https://github.com/aws/aws-cdk/issues/9317)
* **ses:** drop spam rule appears in the incorrect order ([#16146](https://github.com/aws/aws-cdk/issues/16146)) ([677fedc](https://github.com/aws/aws-cdk/commit/677fedcc5351b8b5346970fac03e5e342f36265b)), closes [#16091](https://github.com/aws/aws-cdk/issues/16091)


### Reverts

* **cli:** 'deploy' and 'diff' silently does nothing when given unknown stack name ([#16125](https://github.com/aws/aws-cdk/issues/16125)) ([f2d77d3](https://github.com/aws/aws-cdk/commit/f2d77d336d535ef718813b4ed6b88b5d2af05cb9)), closes [aws/aws-cdk#16073](https://github.com/aws/aws-cdk/issues/16073)

## [2.0.0-rc.18](https://github.com/aws/aws-cdk/compare/v2.0.0-rc.17...v2.0.0-rc.18) (2021-08-18)


### Features

* **aws-apigateway:** import existing usage plan ([#15771](https://github.com/aws/aws-cdk/issues/15771)) ([97fc290](https://github.com/aws/aws-cdk/commit/97fc29032c05edb7914c48efee0124be0126a5c4)), closes [#12677](https://github.com/aws/aws-cdk/issues/12677)
* **aws-elbv2:** ALB target group routing algorithms ([#15622](https://github.com/aws/aws-cdk/issues/15622)) ([6b32b2f](https://github.com/aws/aws-cdk/commit/6b32b2fb0c6ed2a21eb929e39930c6c9cf668dae)), closes [#15160](https://github.com/aws/aws-cdk/issues/15160)
* **cfnspec:** cloudformation spec v39.9.0 ([#15987](https://github.com/aws/aws-cdk/issues/15987)) ([e0d6181](https://github.com/aws/aws-cdk/commit/e0d61810ab78f7cab1af53bce82c60790a814f71))
* **cognito:** add support for token revocation in UserPoolClient ([#15317](https://github.com/aws/aws-cdk/issues/15317)) ([8cb0e97](https://github.com/aws/aws-cdk/commit/8cb0e97ea663e0447af77842e1a8efa8aee917eb)), closes [#15126](https://github.com/aws/aws-cdk/issues/15126)
* **pipelines:** add `synthCodeBuildDefaults` ([#15627](https://github.com/aws/aws-cdk/issues/15627)) ([04b8d40](https://github.com/aws/aws-cdk/commit/04b8d400b2653aff4f48709e8b420c6adb996ef5))


### Bug Fixes

* **core:** asset bundling fails for non-existent user ([#15313](https://github.com/aws/aws-cdk/issues/15313)) ([bf5882f](https://github.com/aws/aws-cdk/commit/bf5882f8def0676bbfaee7c2ff4fab6bf39df281)), closes [#15415](https://github.com/aws/aws-cdk/issues/15415) [#15415](https://github.com/aws/aws-cdk/issues/15415)
* **ec2:** "clientVpnEndoint" => "clientVpnEndpoint" ([#14902](https://github.com/aws/aws-cdk/issues/14902)) ([c3b872a](https://github.com/aws/aws-cdk/commit/c3b872ad47ff3bdf2c841aa195b6fa6922c03769)), closes [#13810](https://github.com/aws/aws-cdk/issues/13810)
* **pipelines:** repos with dashes cannot be used as additionalInputs ([#16017](https://github.com/aws/aws-cdk/issues/16017)) ([400a59d](https://github.com/aws/aws-cdk/commit/400a59d19ee63fbd9318da34760b4ed8c9ba99b9)), closes [#15753](https://github.com/aws/aws-cdk/issues/15753)

## [2.0.0-rc.17](https://github.com/aws/aws-cdk/compare/v2.0.0-rc.16...v2.0.0-rc.17) (2021-08-11)


### Features

* **aws-cloudfront:** add enabled to web distribution ([#15433](https://github.com/aws/aws-cdk/issues/15433)) ([7ad9348](https://github.com/aws/aws-cdk/commit/7ad9348b49ab3b9dde1b4f1db3d888ddec423a9f))
* **aws-ec2:** Add SubnetFilter for Id and CIDR netmask ([#15373](https://github.com/aws/aws-cdk/issues/15373)) ([407b02d](https://github.com/aws/aws-cdk/commit/407b02d62bd8b3eb77e53fc74197b64148640b5a)), closes [#15228](https://github.com/aws/aws-cdk/issues/15228)
* **cfnspec:** cloudformation spec v39.7.0 ([#15719](https://github.com/aws/aws-cdk/issues/15719)) ([2c4ef01](https://github.com/aws/aws-cdk/commit/2c4ef0131893e77d373c52b41c62d31847023446))
* **cfnspec:** cloudformation spec v39.7.0 ([#15796](https://github.com/aws/aws-cdk/issues/15796)) ([dbe4641](https://github.com/aws/aws-cdk/commit/dbe4641666c918c7bba36010fb4656d050ef5556))
* **cfnspec:** cloudformation spec v39.8.0 ([#15885](https://github.com/aws/aws-cdk/issues/15885)) ([60e6b41](https://github.com/aws/aws-cdk/commit/60e6b4186680af98b538a21e82146fb0a0e84f33))
* **cloudfront:** Origin Shield support ([#15453](https://github.com/aws/aws-cdk/issues/15453)) ([08ebbae](https://github.com/aws/aws-cdk/commit/08ebbae4cffdf85a66775f4e8f5ea9d7400bf358)), closes [#12872](https://github.com/aws/aws-cdk/issues/12872) [/github.com/aws/aws-cdk/issues/12872#issuecomment-775873384](https://github.com/aws//github.com/aws/aws-cdk/issues/12872/issues/issuecomment-775873384)
* **cloudfront:** use TLS_V1_2_2021 SecurityPolicy as default version (under feature flag) ([#15477](https://github.com/aws/aws-cdk/issues/15477)) ([7b64abf](https://github.com/aws/aws-cdk/commit/7b64abf51c52cd2f6f585d7fd9201030fdba8163))
* **codebuild:** add support for setting a BuildEnvironment Certificate ([#15738](https://github.com/aws/aws-cdk/issues/15738)) ([76fb481](https://github.com/aws/aws-cdk/commit/76fb4811bb9f5d5fc1bd340954840032cb23698b)), closes [#15701](https://github.com/aws/aws-cdk/issues/15701)
* **core:** lazy mappings will only synthesize if keys are unresolved ([#15617](https://github.com/aws/aws-cdk/issues/15617)) ([32ed229](https://github.com/aws/aws-cdk/commit/32ed2290f8efb27bf622998f98808ff18a8cdef1))
* **ec2:** Add Transcribe interface endpoint ([#15465](https://github.com/aws/aws-cdk/issues/15465)) ([929d6ae](https://github.com/aws/aws-cdk/commit/929d6aef84eb21aea0d9a4fff953a0f39246288e))
* **eks:** support Kubernetes 1.21 ([#15774](https://github.com/aws/aws-cdk/issues/15774)) ([83dd318](https://github.com/aws/aws-cdk/commit/83dd318959b1b1e5f94b5a31030d03379638c9ad)), closes [#15758](https://github.com/aws/aws-cdk/issues/15758)
* **lambda:** cloudwatch lambda insights ([#15439](https://github.com/aws/aws-cdk/issues/15439)) ([9efd800](https://github.com/aws/aws-cdk/commit/9efd800b4eea3a849edc5710975e4d70ec14a5cd))
* **pipelines:** CDK Pipelines is now Generally Available ([#15667](https://github.com/aws/aws-cdk/issues/15667)) ([2e4cfae](https://github.com/aws/aws-cdk/commit/2e4cfaeb8612179c79e293ba52a8afcdcfd6ef52))
* **Route53:** add support for RemovalPolicy in CrossAccountZoneDelegationRecord ([#15782](https://github.com/aws/aws-cdk/issues/15782)) ([9eea4b8](https://github.com/aws/aws-cdk/commit/9eea4b8d454f7bc23930e6254651029b1a348a2c)), closes [#15211](https://github.com/aws/aws-cdk/issues/15211)
* **s3-deployment:** control object access ([#15730](https://github.com/aws/aws-cdk/issues/15730)) ([f58cf3c](https://github.com/aws/aws-cdk/commit/f58cf3c95eb32e9a4dc797665160e1b508ace2e1))
* **stepfunctions:** allow intrinsic functions for json path ([#15320](https://github.com/aws/aws-cdk/issues/15320)) ([d9285cb](https://github.com/aws/aws-cdk/commit/d9285cb75745028ede8c36afcee34f7a53d27993))
* **stepfunctions-tasks:** add sns publish with message attributes ([#14817](https://github.com/aws/aws-cdk/issues/14817)) ([bc99e82](https://github.com/aws/aws-cdk/commit/bc99e8271d443b10928d99437593c52efd763d7c)), closes [#4702](https://github.com/aws/aws-cdk/issues/4702)


### Bug Fixes

* **aws-cloudwatch:** unable to use generic extended statistics for cloudwatch alarms ([#15720](https://github.com/aws/aws-cdk/issues/15720)) ([f593311](https://github.com/aws/aws-cdk/commit/f59331193b5a2cc4a33d71d775f6650d66bb1bf8))
* **aws-eks:** Allow desiredsize minsize and maxsize to accept CfnParameters. ([#15487](https://github.com/aws/aws-cdk/issues/15487)) ([fb43769](https://github.com/aws/aws-cdk/commit/fb437693c0f1568ddc53e9a198e54be3b9a01592))
* **chatbot:** ARN validation in fromSlackChannelConfigurationArn fails for tokenized values ([#15849](https://github.com/aws/aws-cdk/issues/15849)) ([440ca35](https://github.com/aws/aws-cdk/commit/440ca35cf0f0e9f6f86bef445bd9aa6ef05ff9be)), closes [#15842](https://github.com/aws/aws-cdk/issues/15842)
* **cli:** move fail option into the diff command ([#15829](https://github.com/aws/aws-cdk/issues/15829)) ([473c1d8](https://github.com/aws/aws-cdk/commit/473c1d8248ae84bd8b4bb3863334e05e5328fddc))
* **ec2:** volumename doesn't set name of volume ([#15832](https://github.com/aws/aws-cdk/issues/15832)) ([b842702](https://github.com/aws/aws-cdk/commit/b842702cbb7aa6632dd2fc4b4981abdd3a773826)), closes [#15831](https://github.com/aws/aws-cdk/issues/15831)
* **elasticsearch:** advancedOptions in domain has no effect ([#15330](https://github.com/aws/aws-cdk/issues/15330)) ([81cbfec](https://github.com/aws/aws-cdk/commit/81cbfec5ddf065aac442d925484a358ee8cd26a1)), closes [#14067](https://github.com/aws/aws-cdk/issues/14067)
* **elasticsearch:** slow logs incorrectly disabled for Elasticsearch versions lower than 5.1 ([#15714](https://github.com/aws/aws-cdk/issues/15714)) ([91cf79b](https://github.com/aws/aws-cdk/commit/91cf79bc55ffd72b1c79e2218eb76921fbac32b4)), closes [#15532](https://github.com/aws/aws-cdk/issues/15532) [#15532](https://github.com/aws/aws-cdk/issues/15532)
* **elbv2:** unresolved listener priority throws error ([#15804](https://github.com/aws/aws-cdk/issues/15804)) ([fce9ac7](https://github.com/aws/aws-cdk/commit/fce9ac73fe6da5e604f0659d9f101001dcef830a))
* **pipelines:** new pipeline stages aren't validated ([#15665](https://github.com/aws/aws-cdk/issues/15665)) ([309b9b4](https://github.com/aws/aws-cdk/commit/309b9b4cf554474c87fe3d833a5205498e200ecf))
* **pipelines:** permissions check in legacy API does not work ([#15660](https://github.com/aws/aws-cdk/issues/15660)) ([5e3cf2b](https://github.com/aws/aws-cdk/commit/5e3cf2b0558401fab25f75da319fac587df1bcfb))
* **pipelines:** Prepare stage doesn't have AUTO_EXPAND capability ([#15819](https://github.com/aws/aws-cdk/issues/15819)) ([a6fac49](https://github.com/aws/aws-cdk/commit/a6fac4974fa17949b836c72d04e1cc4504bc920a)), closes [#15711](https://github.com/aws/aws-cdk/issues/15711)
* **pipelines:** Secrets Manager permissions not added to asset projects ([#15718](https://github.com/aws/aws-cdk/issues/15718)) ([7668400](https://github.com/aws/aws-cdk/commit/7668400ec8d4e6ee042c05976f95e42147993375)), closes [#15628](https://github.com/aws/aws-cdk/issues/15628)
* **s3:** notifications are broken in some regions ([#15884](https://github.com/aws/aws-cdk/issues/15884)) ([ee19196](https://github.com/aws/aws-cdk/commit/ee191961a8b057a0585e731a67c15a7edd59c79e))
* **stepfunctions:** non-object arguments to recurseObject are incorrectly treated as objects ([#14631](https://github.com/aws/aws-cdk/issues/14631)) ([e133bca](https://github.com/aws/aws-cdk/commit/e133bca61b95b71d51b509b646ff1720099ee31e)), closes [#12935](https://github.com/aws/aws-cdk/issues/12935) [aws-cdk/aws-stepfunctions/lib/input.ts#L65](https://github.com/aws-cdk/aws-stepfunctions/lib/input.ts/issues/L65)
* **stepfunctions-tasks:** instance type cannot be provided to SageMakerCreateTransformJob as input path ([#15726](https://github.com/aws/aws-cdk/issues/15726)) ([6f2384d](https://github.com/aws/aws-cdk/commit/6f2384ddc180e944c9564a543351b8df2f75c1a7))
* **stepfunctions-tasks:** Stage field not included in CallApiGatewayHttpApiEndpoint task definition ([#15755](https://github.com/aws/aws-cdk/issues/15755)) ([4f38fe1](https://github.com/aws/aws-cdk/commit/4f38fe1c3e5515ae22f2820712644ed763dbc248)), closes [#14242](https://github.com/aws/aws-cdk/issues/14242)

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
