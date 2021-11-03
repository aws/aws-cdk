# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [2.0.0-rc.28](https://github.com/aws/aws-cdk/compare/v2.0.0-rc.27...v2.0.0-rc.28) (2021-11-03)


### Features

* **aws-route53-targets:** Support for Elastic Beanstalk environment URLs ([#16305](https://github.com/aws/aws-cdk/issues/16305)) ([bc07cb0](https://github.com/aws/aws-cdk/commit/bc07cb0e383aa64280a9c7f8ac4870d296830cf7))
* **certificatemanager:** requesting private certificates issued by Private Certificate Authority  ([#16315](https://github.com/aws/aws-cdk/issues/16315)) ([e26f5be](https://github.com/aws/aws-cdk/commit/e26f5befc2adedeb524fd263424c7920989b2288)), closes [#10076](https://github.com/aws/aws-cdk/issues/10076)
* **cli:** deployment progress shows stack name ([#16604](https://github.com/aws/aws-cdk/issues/16604)) ([322cf10](https://github.com/aws/aws-cdk/commit/322cf10ef3257b9d20d898882a14de91110a0033))
* **codebuild:** add fromEcrRepository to LinuxGpuBuildImage ([#17170](https://github.com/aws/aws-cdk/issues/17170)) ([7585680](https://github.com/aws/aws-cdk/commit/758568007bf82a97ed6edba3ef4717735b224bf9)), closes [#16500](https://github.com/aws/aws-cdk/issues/16500)
* **core:** Docker tags can be prefixed ([#17028](https://github.com/aws/aws-cdk/issues/17028)) ([d298696](https://github.com/aws/aws-cdk/commit/d298696a7d8978296a34294484cea80f91ebe880))
* **core:** subtract Durations ([#16734](https://github.com/aws/aws-cdk/issues/16734)) ([7a333b0](https://github.com/aws/aws-cdk/commit/7a333b018c9bb2430165177d3e65614cf1d66519)), closes [#16535](https://github.com/aws/aws-cdk/issues/16535)
* **docdb:** add the ability to exclude characters when generating passwords ([#17262](https://github.com/aws/aws-cdk/issues/17262)) ([135f7d3](https://github.com/aws/aws-cdk/commit/135f7d33db5e96c3af4a8691c13b419e7b14ceae)), closes [#15732](https://github.com/aws/aws-cdk/issues/15732)
* **ec2:** add c5ad instances ([#16428](https://github.com/aws/aws-cdk/issues/16428)) ([0318253](https://github.com/aws/aws-cdk/commit/0318253b423bb65ca7e6bf65411df767f2734296))
* **ec2:** add c6i instances ([#17237](https://github.com/aws/aws-cdk/issues/17237)) ([25cea18](https://github.com/aws/aws-cdk/commit/25cea1807539a8d45f3f4ff8b775b3417387d6fe)), closes [/docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-instance.html#cfn-ec2](https://github.com/aws//docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-instance.html/issues/cfn-ec2)
* **ec2:** include p4d instance class ([#17147](https://github.com/aws/aws-cdk/issues/17147)) ([6e13adc](https://github.com/aws/aws-cdk/commit/6e13adc281722a491c0708954d7ed637ad45033b))
* **ec2:** VPC endpoint for AWS Xray  ([#16788](https://github.com/aws/aws-cdk/issues/16788)) ([c24af54](https://github.com/aws/aws-cdk/commit/c24af54946d3668afa596dbf2a776b7cf21f8a99)), closes [#16306](https://github.com/aws/aws-cdk/issues/16306)
* **events:** DLQ support for EventBus target  ([#16383](https://github.com/aws/aws-cdk/issues/16383)) ([dbb3f25](https://github.com/aws/aws-cdk/commit/dbb3f25904403bfc020a081e94270f5c16a7606f)), closes [#15954](https://github.com/aws/aws-cdk/issues/15954)
* **lambda-nodejs:** esbuild charset option ([#16726](https://github.com/aws/aws-cdk/issues/16726)) ([56033a2](https://github.com/aws/aws-cdk/commit/56033a2a6d4be0444694d9f88260c574a4fa1a1d)), closes [#16668](https://github.com/aws/aws-cdk/issues/16668)
* **lambda-nodejs:** typescript emitDecoratorMetadata support ([#16543](https://github.com/aws/aws-cdk/issues/16543)) ([55d3c50](https://github.com/aws/aws-cdk/commit/55d3c507707192d7aa5ea4a38ee0d1cb58f07e06)), closes [#13767](https://github.com/aws/aws-cdk/issues/13767)
* **logs:** add support for cloudwatch logs resource policy  ([#17015](https://github.com/aws/aws-cdk/issues/17015)) ([e9a461d](https://github.com/aws/aws-cdk/commit/e9a461d6dcbad933fcb9d671a8c5b5ad8f5ece8d)), closes [#5343](https://github.com/aws/aws-cdk/issues/5343) [aws-cdk/aws-elasticsearch/lib/log-group-resource-policy.ts#L25](https://github.com/aws-cdk/aws-elasticsearch/lib/log-group-resource-policy.ts/issues/L25) [aws-cdk/aws-events-targets/lib/log-group-resource-policy.ts#L26](https://github.com/aws-cdk/aws-events-targets/lib/log-group-resource-policy.ts/issues/L26) [aws-cdk/aws-events-targets/lib/log-group-resource-policy.ts#L26](https://github.com/aws-cdk/aws-events-targets/lib/log-group-resource-policy.ts/issues/L26) [#5343](https://github.com/aws/aws-cdk/issues/5343)
* **rds:** support backtrackWindow in DatabaseCluster ([#17160](https://github.com/aws/aws-cdk/issues/17160)) ([fcd17e9](https://github.com/aws/aws-cdk/commit/fcd17e9c9a9e1b83a29c140d558f696c0290bfd7)), closes [#9369](https://github.com/aws/aws-cdk/issues/9369) [#9369](https://github.com/aws/aws-cdk/issues/9369)
* **sns:** addSubscription returns the created Subscription ([#16785](https://github.com/aws/aws-cdk/issues/16785)) ([62f389e](https://github.com/aws/aws-cdk/commit/62f389ea0522cbaefca5ca17080228031d401ce6))


### Bug Fixes

* **cli:** cdk ls --long outputs less-friendly stack IDs for nested assemblies ([#17263](https://github.com/aws/aws-cdk/issues/17263)) ([864c50e](https://github.com/aws/aws-cdk/commit/864c50ed2f3ae133af0cffd17ed77a6cf32ac6f4)), closes [#14379](https://github.com/aws/aws-cdk/issues/14379)
* **cli:** downgrade bootstrap stack error message needs a hint for new-style synthesis ([#16237](https://github.com/aws/aws-cdk/issues/16237)) ([e55301b](https://github.com/aws/aws-cdk/commit/e55301b635374a87822f78870981a9e06e13d99e))
* **core:** SecretValue.secretsManager fails for tokenized secret-id  ([#16230](https://github.com/aws/aws-cdk/issues/16230)) ([5831456](https://github.com/aws/aws-cdk/commit/5831456465fa44af96a268de56db0e3a8d3c2ea6)), closes [#16166](https://github.com/aws/aws-cdk/issues/16166)
* **custom-resources:** invalid service name leads to unhelpful error message ([#16718](https://github.com/aws/aws-cdk/issues/16718)) ([354686b](https://github.com/aws/aws-cdk/commit/354686b189377dd1daae7ba616e8fb62488d9855)), closes [#7312](https://github.com/aws/aws-cdk/issues/7312)
* **ec2:** functions addIngressRule and addEgressRule detect unresolved tokens as duplicates ([#17221](https://github.com/aws/aws-cdk/issues/17221)) ([d4952c3](https://github.com/aws/aws-cdk/commit/d4952c3cbe12e7c8c27e1bca7f9d8536d93fd3cb)), closes [#17201](https://github.com/aws/aws-cdk/issues/17201)
* **elasticloadbalancingv2:** always set stickiness ([#17111](https://github.com/aws/aws-cdk/issues/17111)) ([0a23953](https://github.com/aws/aws-cdk/commit/0a23953d92df070736f7d036cc2b24e68de4bf64)), closes [#16620](https://github.com/aws/aws-cdk/issues/16620)
* **lambda-event-sources:** dynamo batch size cannot be a CfnParameter ([#16540](https://github.com/aws/aws-cdk/issues/16540)) ([56974ac](https://github.com/aws/aws-cdk/commit/56974ac4152bc082470d56dd66e4ef7aad042815)), closes [#16221](https://github.com/aws/aws-cdk/issues/16221)
* **logs:** Apply tags to log retention Lambda  ([#17029](https://github.com/aws/aws-cdk/issues/17029)) ([a6aaa64](https://github.com/aws/aws-cdk/commit/a6aaa64bf9779b984f20d18881b4f6e510ac091a)), closes [#15032](https://github.com/aws/aws-cdk/issues/15032)

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
