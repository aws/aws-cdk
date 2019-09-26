# Continuous Delivery for CDK Apps

This is a specification for the continuous delivery support feature for CDK apps. It describes the requirements, proposed APIs and developer workflow.

**_Goal_: Full CI/CD for CDK apps at any complexity.**

The desired developer experience is that teams will be able to "git push" a change into their CDK app repo and have this change automatically picked up, built, tested and deployed according to a deployment flow they define.

Any changes in resources, assets *or stacks* in their apps will automatically be added. To that end, the deployment pipeline itself will also be continuously delivered and updated throughout the same workflow. No manual deployments to production (incl. the pipeline) will be required.

The only caveat is that **new environments** (account/region) will need to be bootstrapped in advance in order to establish trust with the central pipeline environment and set-up resources needed for deployment such as the assets S3 bucket.

- [Requirements](#requirements)
- [Approach](#approach)
- [Build](#build)
- [Synthesis](#synthesis)
- [Bootstrapping](#bootstrapping)
- [Mutation](#mutation)
- [Publishing](#publishing)
- [Deployment](#deployment)
- [Walkthrough](#walkthrough)
  - [Bootstrapping](#bootstrapping-1)
  - [Source](#source)
  - [Synthesis](#synthesis-1)
  - [Mutation](#mutation-1)
  - [Publishing](#publishing-1)
  - [Deployment](#deployment-1)

## Requirements

This list describes only the minimal set of requirements from this feature. After we release these building blocks, we will look into vending higher-level "one liner" APIs that will make it very easy to get started.

1. **Deployment system**: the design should focus on building blocks that can be easily integrated into various deployment systems. This spec
1. **Assets**: Support apps that include all supported assets (S3 files, ECR images)
1. **Multi-environment**: Support apps that have stacks that target multiple environments (accounts/regions)
1. **Orchestration**: Allow developers to express complex deployment orchestration based on the capabilities of CodePipeline
1. **User-defined build+synth runtime**: the runtime environment in which the code is built and the CDK app is synthesized should be fully customizable by the user
1. **Restricted deployment runtime**: for security reasons, the runtime environment in which deployment is executed will be fully controlled and will not allow running user code or user-defined image
1. **Bootstrapping**: It should be possible to update bootstrapping resources automatically if possible and least discover that the bootstrap environment is not up-to-date.
1. **Custom replication**: In order to support isolated and air-gapped regions, as well as deployment across partitions, the solution should support customizing how and where assets are published and replicated to.

_Considerations:_

* Prefer to use standard CloudFormation pipeline actions to reduce costs, leverage UI and allow restriction of the deployment role to the CloudFormation service principal.
* Execution of `cdk synth` or `docker build` should not be done in a context with administrative privileges to avoid injection of malicious code into a privileged environment.

_Non-requirements/assumptions:_

* We assume that **cdk.context.json** is committed into the repo. Any context-fetching will be done manually by users and committed to the repository.
* There’s a one-to-one mapping between an app and a pipeline. We are not optimizing the experience for multiple apps per pipeline (although technically it should be possible to do it, but it’s not a use case we are focused on).
* Dependency management, repository and project structure are out of scope: we don’t want to be opinionated about how users should structure their projects. They should be able to use the tools they are familiar with and are available to their teams to structure and modularize their applications.
* Assets will not be supported in environment-agnostic stacks. [#4131](https://github.com/aws/aws-cdk/pull/4131) proposes that `cdk deploy` will default `env` to the current account/region, which means that the CLI use case will no longer treat stacks as environment-agnostic.

## Approach

At a high-level, we will model the deployment process of a CDK app as follows:

```
bootstrap => source => build => synthesis => mutate => publish => deploy
```

1. **bootstrap**: manually pre-provision resources required to deploy CDK apps into this environment (such as an S3 bucket, ECR repository and various IAM roles that trust the central deployment account).
2. **source**: the code is pulled from a source repository (e.g. CodeCommit, GitHub or S3), like any other app.
3. **build**: compiles the CDK app code into an executable program (user-defined).
4. **synthesis**: invokes the compiled executable to produce a [cloud assembly](https://github.com/aws/aws-cdk/blob/master/design/cloud-assembly.md) from the app. It includes a CloudFormation template for each stack and asset sources (docker images, s3 files, etc) that must be packaged and published to the asset store in each environment that consumes them.
5. **mutate**: update stack(s) required by the pipeline. This includes pipeline resources and other auxiliary resources such as regional replication buckets. These stacks are limited to 50KiB and are not allowed to use assets, so they can be deployed without bootstrapping resources.
6. **publish**: package and publish all assets to asset stores (S3 bucket, ECR repository) so they can be consumed.
7. **deploy**: stage(s), stacks are deployed to the various environments through some orchestration process (e.g. deploy first to this region, run these canaries, wait for errors, continue to the next stage, etc).

NOTE: The deployment phase can include any number of stack deployment actions. Each deployment action is responsible deploy a single stack, along with any assets it references.

This following sections describes the design of each component in the toolchain.

## Build

In this stage we compile the CDK app to an executable program through a user-defined build system.

We assume a single source repository which masters the CDK app itself. This repo can be structured in any way users wish, and may include multiple modules or just a single one. If users choose to organize their project into modules and master different modules in other repositories, eventually the build artifacts from these builds should be available when the app is synthesized.

The only requirement from the build step is the it will have an output artifact that is a cloud-assembly directory which is obtained through `cdk synth` (defaults to `./cdk.out`). Other than that, users can fully control their build environment.

## Synthesis

The CDK synthesizes a CloudFormation template for each stack defined in the CDK app.

When stacks are defined, users can specify the target environment (account and region) into which the stack should be deployed:

```ts
new Stack(this, 'my-stack', { env: { account: '123456789012', region: 'us-east-1' } });
```

**Deployment Across Environments**

In order to support deploying stacks from a centralized (pipeline/development) environment to other environments, the bootstrap stack includes a set of named IAM roles which trust the central account for publishing and deployment.

In order to encourage separation of concerns and allow customizability, we will add role information to the assembly manifest.

For each stack, we will encode additional two IAM roles:

1. Administrator CloudFormation IAM role which can only be assumed by the CloudFormation service principal
1. Deployment IAM role which can be assumed by any principal from the central account and has permissions to "pass role" on the administrator role.

This is the recommended setup for cross-account CloudFormation deployments.

**Assets**

Users can reference "assets" within their CDK app. Assets represent artifacts produced from local files and used by the app at runtime. The CDK currently supports file assets served from Amazon S3 and docker image assets served from Amazon ECR.

For example, this is a definition of an AWS Lambda function that uses the code from the `my-handler` directory:

```ts
new lambda.Function(this, 'MyFunction', {
  handler: 'index.handler',
  runtime: lambda.Runtime.NODEJS_10,
  code: lambda.Code.fromAsset('./my-handler')
});
```

In order for this to work, this is what needs to happen:

1. A zip archive needs to be created from the contents of `my-handler`.
2. The file needs to be uploaded to an S3 bucket in the stack’s environment.
3. The `Code` property in the synthesized `AWS::Lambda::Function` resource should point to the S3 URL that will contains this zip file when the stack is deployed.

A similar set of requirements exist for a Docker image built from a local `Dockerfile`, pushed to an ECR repository in the target environment and referenced in the `Image` property of the `AWS::ECS::TaskDefinition` resource.

**Asset Identity**

Assets will be identified throughout the system using a sha256 hash calculated from their source. This is the contents of the asset source directory, Dockerfile or specific file. Using a consistent source hash allows the various tools in the system to avoid duplicated work such as building docker images or transferring large amount of information.

> **NOTE:** docker builds are technically not deterministic, but this scheme will cause them to be. If the source (Dockerfile or accompanying files) didn’t change, the source hash will stay the same and the asset will not be rebuild/updated. Operationally this is actually a good thing as it will protect against out-of-band updates (we only want commits to cause production updates), but users may rely on this non-deterministic behavior and we need to communicate/enforce somehow.

**Asset Stores**

The S3 bucket and ECR repository that are used to serve asset artifacts in each target environment are called the "**asset store**". They will be provisioned and populated **before** stacks which use assets can be deployed to this environment. The process of provisioning deployment resources in an AWS environment is called "**bootstrapping**". It provisions the asset store and various IAM roles with permissions to publish assets and to deploy CloudFormation stacks to the environment.

In order to minimize the amount of configuration required throughout the deployment pipeline, we decided to double-down on the CDK design tenet that favors early (synthesis-time) binding. In the current implementation, if a CDK stack used asset, CloudFormation parameters are added to templates so that the asset locations were late-bound and resolved by the CLI only after the asset has been published. This approach has two problems:

1. It resulted in the proliferation of asset parameters (currently 2-3 parameters per asset).
2. It requires the deployment tool to "wire" the asset parameters to the stack during deployment.

The main issue is #2. Different deployment tools have different ways to configure how parameters are passed to CloudFormation stacks, which makes it difficult to find a general purpose way to convey this information to the deployment stage. Additionally, the publishing and consumption locations must be customizable since different deployment systems may have different ways to publish and replicate assets across environments (for example, a deployment system which needs to be able to deploy to air-gapped regions and requires that all assets are published to a centralized store and then copied to target environments through air gaps).

The solution is to resolve asset locations **during synthesis** and use naming conventions for bootstrapping resources. This means that asset locations will be concrete values and we can also encode all publishing information to the assembly manifest. It will also allow customizing all publishing behavior from within the CDK app, without the need to supply additional plugin capabilities.

We will synthesize a file called `assets.json`, which will include preparation and publishing instructions for each asset.

For file assets:

* Source file or directory (relative to cloud assembly)
* Packaging format (zip/file)
* Destinations:
  * Bucket name
  * Object key
  * Publishing Role ARN to assume

For image assets:

* Source directory (relative to cloud assembly): where Dockerfile resides
* Docker build arguments (optional)
* Dockerfile name (optional)
* Destinations:
  * ECR repository name
  * Image name
  * Publishing Role ARN to assume

**Customizability**

Asset consumption and publishing locations should be fully customizable. To that end, the `core.Stack` base class will expose an API that will be used by the asset framework to resolve consumption locations and synthesize `assets.json`. This will allow users to provide their own implementation based on their specific needs.

**Asset Source Staging**

During synthesis, the CDK app will _copy the sources_ of all assets from their original location on disk into the cloud assembly output directory. This allows the cloud assembly to be self-contained and is important for the CI/CD use cases (both internal and external) where the cloud assembly is the only artifact needed after build is complete.

**Asset Providers**

Users should be able to vend custom asset providers to allow customizing how assets are being referenced or packaged.

For example, a company might have an internal system that manages software artifacts. They can internally vend custom implementations for the `lambda.Code` and `ecs.ContainerImage` classes which will allow users to reference these artifacts and synthesize placeholders into the cloud assembly, which will later be resolved during the publishing stage and identified through a user-defined unique identifier.

**Environment-agnostic Stacks**

When a stack is defined, users can specify `env` (account and/or region).

If `account` and/or `region` use the pseudo references `Aws.ACCOUNT_ID` and `Aws.REGION`, respectively, the stack is called "environment-agnostic". Certain features in the CDK, like VPC lookups for example, are not supported for environment-agnostic stacks since the specific account/region is required during synthesis.

The proposal described in [PR#4131](https://github.com/aws/aws-cdk/pull/4131) suggests that environment-agnostics stacks cannot be deployed using the CDK. However, it also proposes that the default behavior for `env` will be to use ("inherit") the CLI configured environment when a stack is deployed through `cdk deploy`.

This means that the only way to produce environment-agnostic templates will be to explicitly indicate it when a stack is defined.

Since the specific account and region are required when resolving asset consumption and publishing locations, the current plan is for the default asset store implementation to **fail if assets are used from environment-agnostic stacks**. Again, bear in mind that the current behavior (where the default is environment-agnostic stacks) is going to be changed.

## Bootstrapping

The CDK already has a dedicated tool for bootstrapping environments called **`cdk bootstrap`**. An environment is bootstrapped once, and from that point, it is possible to deploy CDK apps into this environment.

Environment bootstrapping doesn't have to be performed by the development team, and does not require deep knowledge of the application structure, besides the set of accounts and regions into which the app needs to be deployed.

The current implementation only provisions an S3 bucket, but in order to be able to continuously deploy CDK stacks that use asses, we will need the following resources:

For publishing:

* **S3 Bucket**: for file asset and CloudFormation templates
* **ECR Repository**: for docker image assets
* **Publishing Role**: IAM role trusted by the deployment account, and allows publishing to the S3 bucket and the ECR repository.

For deployment:

* **CloudFormation Role**: IAM role which allows the CloudFormation service principal to deploy stacks into the environment (this role usually has administrative privileges).
* **Deployment Role**: IAM role which allows anyone from the deployment account to create, update and describe CloudFormation change sets and s"pass" the CloudFormation role (`iam:PassRole`).

To accommodate these requirements we will make the following changes to how `cdk bootstrap` works:

1. Extend the bootstrap stack to include these resources.
2. Use explicit convention-based physical names for all resources.
3. Allow specifying a list of *trusted accounts* from which the CloudFormation service principal can deploy to this account.
4. Allow specifying a list of accounts from which principals can deploy to this account from the CLI.
5. Allow specifying the managed policy to use for the deployment role (mostly it will be the administrator managed policy).
6. Allow specifying an optional qualifier for the physical names of all resources to address bucket hijacking concerns and allow multiple bootstraps to the same environment for whatever reason.

**Resource Names**

We need to be able to synthesize asset locations into the templates for consumption and publishing. We also need to be able to assume a role in order to be able to publish to the environment.

This means that we cannot rely on CloudFormation physical name generation since it requires accessing the account in order to resolve these names.

We will employ a naming convention which encodes `account`, `region` and an optional `qualifier` (such as `cdk-account-region[-qualifier]-xxxx`). This is because not all AWS resource names are environment-local: IAM roles are account-wide and S3 buckets are global.

It is important that we do not rely on hashing or parsing account and region in order to be able to support environment-agnostic stacks (in which case "account" resolves to `{ "Ref": "AWS::AccountId" }`, etc.

In order to address the risk of S3 bucket hijacking, we need to be ale to support an optional `qualifier` postfix. This means that we need to allow users to specify this qualifier when they define the Stack's `env`. Perhaps we need to encode this into `aws://account/region[/qualifier]`

> **Alternative considered**: one way to implement environment-specific name-spacing would have been to export the bootstrapping resources through a CloudFormation Export and then reference them using Fn::ImportValue. This would have worked for templates, but means that we would need a way to resolve import values during publishing as well (and as a result also Fn::Join, etc).

**User Interface**

This is the proposed API for `cdk-bootstrap`:

```
$ cdk bootstrap --profile XXX [--yes] aws://account/region --trust-account ACCOUNT_ID
WARNING: any principal from <ACCOUNT_ID> will have administrative access to the account <account>.
Please confirm (Y/N):
```

We should consider allowing users to specify a profile map that will allow bootstrapping multiple environments at the same time, but this can easily be achieved through a shell script:

```bash
#!/bin/sh
cdk bootstrap --yes --profile prod-us aws://111111111111/us-east-1 --trust-account $PIPELINE_ACCOUNT
cdk bootstrap --yes --profile prod-eu aws://222222222222/eu-west-2 --trust-account $PIPELINE_ACCOUNT
```

## Mutation

Deployment of complex cloud application often involves a business-specific process which includes rolling out the app throughout multiple deployment phases and environments. This means that there is strong coupling between the structure of the application and the structure of its deployment pipeline. To enable users to represent this relationship naturally in their code, the CDK should support defining the app's deployment infrastructure as part of the CDK app.

Therefore, we recommend that all resources needed for the deployment pipeline are defined as part of the CDK app itself in one or more stacks. After synthesis, the cloud assembly will include a set of CloudFormation templates for the pipeline stack(s).

We can't begin to deploy an app before we provision and update the required the deployment resources based on the structure of the app. This is the purpose of the "**mutation**" stage.

The initial creation of the pipeline will be performed manually using `cdk deploy pipeline-main` (where `pipeline-main` is name of the main pipeline stack), but from that point forward, any changes to the pipeline will be done by pushing a commit into the repo, and letting the pipeline pick it up.

For example, if we use CodePipeline for deploying an app to multiple environments,the deployment infrastructure will consist of a central pipeline stack, which contains the pipeline itself, it's artifacts bucket and other related resources such as CodeBuild projects. It will also require a stack in each region that includes a CodePipeline regional replication bucket (and key).

In CodePipeline, we will implement this stage using a CodeBuild action which runs `cdk deploy "pipeline-*"`. This will deploy all stacks that begin with the `pipeline-` prefix. These stacks can be deployed to any bootstrapped environment since `cdk deploy` can assume the deployment role.


## Publishing

The [`cdk-assets`](./cdk-assets.md) tool is responsible for _packaging_ and _publishing_ application assets to "**asset stores**" in AWS environments so they can be consumed by stacks deployed to these environments.

See the [cdk-assets specification](./cdk-assets.md) for additional details.

```shell
cdk-assets publish cdk.out [ASSET-ID,ASSET-ID,...]
```

The input is the *cloud assembly* (`cdk.out`), which includes an asset manifest `assets.json`:

The manifest is synthesized by the app and, for each asset (identified by their source hash) includes the `source` information (within the cloud assembly) and as set of `destinations` with a list of locations into which the asset should be published. The idea is that this manifest is all the information the publish needs.

A list of asset IDs (source hashes) can also be included in order to only publish a subset of the assets. This can be used to implement concurrent publishing of assets (e.g. through CodePipeline).

Then, for each asset, cdk-assets will perform the following operation:

1. Assume the **publishing IAM role** in the target environment.
2. Check if the asset is already published to this location. Assets are identified by their source hash. If it is, skip.
3. If the asset doesn’t exists locally (e.g. docker image already exists, zip file already exists in local cache), package (docker build, zip directory).
4. Publish the asset to the target location.

In order for the publish to be able to execute `docker build`, this command must be executed in an environment that has docker available (in CodeBuild this means the project must be "privileged").

**Templates as Assets**

Some deployment systems (e.g. the CDK CLI) require that CloudFormation templates will be uploaded an S3 location before they can be deployed (this is done automatically in CodePipeline). Due to S3 eventual consistency, these files must be immutable, so we need to upload a new template file every time the template changes.

To that end, we will treat all CloudFormation templates in the assembly like any other asset. They will be identified by their source hash (the hash of the template) and uploaded to the asset store in the environment in which they are expected to be deployed, like any other file asset.

## Deployment

At this point, all assets are published to asset stores in their target environments, so we can simply use standard CloudFormation deployment tools to deploy templates from the cloud assembly. Any references to assets were already resolved during synthesis.

To deploy a stack to an environment, the deployment will need to:

1. Assume the **Deployment IAM Role** from the target environment.
2. Create a CloudFormation change-set for the stack.
3. Execute the change-set by requesting CloudFormation to assume the administrative **CloudFormation IAM
Role**.

## Walkthrough

In this section we will walk through the process of deploying a complex CDK app and how each one of the components in the toolchain is used within the workflow.

### Bootstrapping

We go to our ops team and ask them to prepare three AWS accounts for our application:

1. `111111111DEP`: Deployment account
2. `2222222222US`: US account
3. `3333333333EU`: EU account

The ops team will also bootstrap our environments:

```shell
$ cdk bootstrap aws://111111111DEP/us-west-2
$ cdk bootstrap aws://2222222222US/us-east-1 --trust-account 111111111DEP
$ cdk bootstrap aws://3333333333EU/eu-west-2 --trust-account 111111111DEP
```

> NOTE: each bootstrap command will be executed with the appropriate AWS credentials configured.

The bootstrapping process will create the following resources:

* 111111111DEP/us-west-2:
  * `aws-cdk-files-111111111DEP-us-west-2`: S3 bucket
  * `aws-cdk-images-111111111DEP-us-west-2`: ECR repository
  * `aws-cdk-publish-111111111DEP-us-west-2`: IAM role for publishing (assumable by 111111111DEP), permissions to read/write from the S3/ECR
  * `aws-cdk-deploy-111111111DEP-us-west-2`: IAM role for deployment (assumable by 111111111DEP), with pass-role to the CloudFormation role
  * `aws-cdk-admin-111111111DEP-us-west-2`: IAM role for CloudFormation (assumable by the CloudFormation service principal)
* 2222222222US/us-east-1:
  * `aws-cdk-files-2222222222EU-us-east-1`: S3 bucket
  * `aws-cdk-images-2222222222EU-us-east-1`: ECR repository
  * `aws-cdk-publish-2222222222EU-us-east-1`: IAM role for publishing (assumable by 111111111DEP), permissions to read/write from the S3/ECR
  * `aws-cdk-deploy-2222222222EU-us-east-1`: IAM role for deployment (assumable by 111111111DEP), with pass-role to the CloudFormation role
  * `aws-cdk-admin-2222222222EU-us-east-1`: IAM role for CloudFormation (assumable by the CloudFormation service principal)
* 3333333333EU/eu-west-2:
  * `aws-cdk-files-3333333333EU-eu-west-2`: S3 bucket
  * `aws-cdk-images-3333333333EU-eu-west-2`: ECR repository
  * `aws-cdk-publish-3333333333EU-eu-west-2`: IAM role for publishing (assumable by 111111111DEP), permissions to read/write from the S3/ECR
  * `aws-cdk-deploy-3333333333EU-eu-west-2`: IAM role for deployment (assumable by 111111111DEP), with pass-role to the CloudFormation role
  * `aws-cdk-admin-3333333333EU-eu-west-2`: IAM role for CloudFormation (assumable by the CloudFormation service principal)

Notice that all bootstrapping resources have conventional physical names so asset locations can be resolved during synthesis without needing to access the accounts.

### Source

This section describes the sample app we will use for our walkthrough in order to demonstrate how the various pieces work together.

Our app needs to be deployed to two geographies: US (in us-east-1) and EU (in eu-west-2).

In each geography, we will split our app into two stacks: one that includes the VPC resources (`vpc-us` and `vpc-eu`) and the other that includes the service resources (`service-us` and `service-eu`). This is just an example of course, apps should be able to define any layout they desire.

The service stack will use two assets: one docker image created from a Dockerfile in our project and one zip file created from a directory.

Deployment resources (pipeline, buckets, etc) will be defined in a separate set of stacks (`pipeline-main`, `pipeline-us-east-1` and `pipeline-eu-west-2`). The pipeline has the following stages:

1. Source: monitors a git repository and kicks off the pipeline.
2. Build: a CodeBuild action which compiles the app and invokes `cdk synth`. The output artifact is `cdk.out`.
3. Mutate: a CodeBuild action which runs `cdk deploy pipeline-*` to update all pipeline stacks
4. Publish: includes a CodeBuild action for each asset (2 in our case) which runs `cdk-publish ASSET_ID`
5. VPC Deployment Stage: includes two cross-environment CloudFormation deployment actions for deploying the VPC stack to US and EU
6. Service Deployment Stage: includes two cross-environment CloudFormation deployment actions for deploying the service stack to US and EU

NOTES:

* The "Build" stage is defined by the user and expected to always have `cdk.out` as the output artifact (by convention).
* The "Mutate" and "Publish" stage will be provided as ready-made building blocks
* The order and structure of the "Deployment" stages are just an example. Users may choose the orchestration they need.
* The AWS CodePipeline module in the CDK will automatically define all auxiliary stacks required for the pipeline based on the actual structure (`pipeline-REGION`).

### Synthesis

After the app is compiled, `cdk synth` will produce a `cdk.out` directory (cloud assembly) which includes the following files:

1. `manifest.json`
2. `assets.json`
3. `pipeline-main.template.json`: the pipeline itself and auxiliary resources
4. `pipeline-us-east-1.template.json`: pipeline replication resources needed for US deployment
5. `pipeline-eu-west-2.template.json`: pipeline replication resources needed for EU deployment
6. `vpc-us.template.json`: VPC stack for the US deployment
7. `vpc-eu.template.json`: VPC stack for the EU deployment
8. `service-us.template.json`: service stack for the US deployment
9. `service-eu.template.json`: service stack for the EU deployment

The `manifest.json` file will include an entry for each stack defined above (like today), but each stack will also include the IAM roles to assume if you wish to deploy this stack:

```json
{
  "version": "0.36.0",
  "artifacts": {
    "vpc-us": {
      "type": "aws:cloudformation:stack",
      "environment": "aws://2222222222US/us-east-1",
      "properties": {
        "templateFile": "vpc-us.template.json",
        "deployRoleArn": "aws-cdk-deploy-2222222222EU-us-east-1",
        "adminRoleArn": "aws-cdk-admin-2222222222EU-us-east-1"
      }
    },
    "service-us": {
      "type": "aws:cloudformation:stack",
      "environment": "aws://2222222222US/us-east-1",
      "properties": {
        "templateFile": "service-us.template.json",
        "deployRoleArn": "aws-cdk-deploy-2222222222EU-us-east-1",
        "adminRoleArn": "aws-cdk-admin-2222222222EU-us-east-1"
      }
    },
    "vpc-eu": {
      "type": "aws:cloudformation:stack",
      "environment": "aws://3333333333EU/eu-west-2",
      "properties": {
        "templateFile": "vpc-eu.template.json",
        "deployRoleArn": "aws-cdk-deploy-3333333333EU-eu-west-2",
        "adminRoleArn": "aws-cdk-admin-3333333333EU-eu-west-2"
      }
    },
    "service-eu": {
      "type": "aws:cloudformation:stack",
      "environment": "aws://3333333333EU/eu-west-2",
      "properties": {
        "templateFile": "service-eu.template.json",
        "deployRoleArn": "aws-cdk-deploy-3333333333EU-eu-west-2",
        "adminRoleArn": "aws-cdk-admin-3333333333EU-eu-west-2"
      }
    },
    "pipeline-main": {
      "type": "aws:cloudformation:stack",
      "environment": "aws://111111111DEP/us-west-2",
      "properties": {
        "templateFile": "pipeline-main.template.json",
        "deployRoleArn": "aws-cdk-deploy-111111111DEP-us-west-2",
        "adminRoleArn": "aws-cdk-admin-111111111DEP-us-west-2"
      }
    },
    "pipeline-us-east-1": {
      "type": "aws:cloudformation:stack",
      "environment": "aws://111111111DEP/us-east-1",
      "properties": {
        "templateFile": "pipeline-main.template.json",
        "deployRoleArn": "aws-cdk-deploy-111111111DEP-us-east-1",
        "adminRoleArn": "aws-cdk-admin-111111111DEP-us-east-1"
      }
    },
    "pipeline-eu-west-2": {
      "type": "aws:cloudformation:stack",
      "environment": "aws://111111111DEP/eu-west-2",
      "properties": {
        "templateFile": "pipeline-main.template.json",
        "deployRoleArn": "aws-cdk-deploy-111111111DEP-eu-west-2",
        "adminRoleArn": "aws-cdk-admin-111111111DEP-eu-west-2"
      }
    }
  }
}
```

The `assets.json` file will look like this:

```json
{
  "version": "assets-1.0",
  "images": {
    "d31ca1aef8d1b68217852e7aea70b1e857d107b47637d5160f9f9a1b24882d2a": {
      "source": {
        "packaging": "docker",
        "sourceHash": "d31ca1aef8d1b68217852e7aea70b1e857d107b47637d5160f9f9a1b24882d2a",
        "sourcePath": "my-image",
        "dockerfile": "CustomDockerFile"
      },
      "destinations": [
        {
          "repositoryName": "aws-cdk-images-2222222222US-us-east-1",
          "imageName": "d31ca1aef8d1b68217852e7aea70b1e857d107b47637d5160f9f9a1b24882d2a",
          "assumeRoleArn": "arn:aws:iam::2222222222US:role/aws-cdk-publish-2222222222US-us-east-1"
        },
        {
          "repositoryName": "aws-cdk-images-3333333333EU-eu-west-2",
          "imageName": "d31ca1aef8d1b68217852e7aea70b1e857d107b47637d5160f9f9a1b24882d2a",
          "assumeRoleArn": "arn:aws:iam::3333333333EU:role/aws-cdk-publish-3333333333EU-eu-west-2"
        }
      ]
    }
  },
  "files": {
    "a0bae29e7b47044a66819606c65d26a92b1e844f4b3124a5539efc0167a09e57": {
      "source": {
        "packaging": "zip",
        "sourceHash": "a0bae29e7b47044a66819606c65d26a92b1e844f4b3124a5539efc0167a09e57",
        "sourcePath": "asset.a0bae29e7b47044a66819606c65d26a92b1e844f4b3124a5539efc0167a09e57"
      },
      "destinations": [
        {
          "bucketName": "aws-cdk-files-2222222222US-us-east-1",
          "objectKey": "a0bae29e7b47044a66819606c65d26a92b1e844f4b3124a5539efc0167a09e57",
          "assumeRoleArn": "arn:aws:iam::2222222222US:role/aws-cdk-publish-2222222222US-us-east-1"
        },
        {
          "bucketName": "aws-cdk-files-3333333333EU-us-west-2",
          "objectKey": "a0bae29e7b47044a66819606c65d26a92b1e844f4b3124a5539efc0167a09e57",
          "assumeRoleArn": "arn:aws:iam::3333333333EU:role/aws-cdk-publish-3333333333EU-eu-west-2"
        }
      ]
    }
  }
}
```

It lists the two assets (one file asset and one image asset) and, for each, it lists the publishing locations which include repository, key and publishing IAM role to assume.

### Mutation

The first stage in our pipeline is the mutation stage. This stage will include a single CodeBuild action that will simply execute:

```console
$ cdk deploy pipeline-*
```

This will update all the stacks with names that begin with "pipeline-". Namely, it includes the pipeline stack itself, and the auxiliary stacks that include the pipeline's regional replication buckets. Since we are using `cdk deploy` here, we can technically deploy any stack to any environment in this stage because `cdk deploy` can assume the deployment role in any of the environments which trust the deployment account.

Notice that this stage happens **before** the publish stage. This is because the structure of the publish stage is dependent on which assets the app uses (we synthesize an action per asset for maximal parallelism), so we want to make sure the pipeline will be updated before publishing.

> NOTE: if there is a constraint that does not allow the pipeline to be updated before publishing, it simply means that we have to publish all assets from a single action (`cdk-assets publish cdk.out`).

In our example, there are 3 pipeline stacks:

1. `pipeline-main`: contains the pipeline resource, the main artifacts bucket and other related resources
2. `pipeline-us-east-1`: contains the pipeline replication bucket and key for us-east-1
3. `pipeline-eu-west-2`: contains the pipeline replication bucket and key for eu-west-2

Once we deploy these stacks, our pipeline will be ready to deploy the rest of our app.

### Publishing

The next stage in the process is the publishing stage.

In our example, this stage will consist of two CodeBuild actions that will run the following commands concurrently. These command will package & upload the asset to all the environments. It will consult `assets.json` to determine the exact location into which to publish each asset and which cross-account role to assume.

The first action will run this command:

```shell
cdk-assets publish cdk.out d31ca1aef8d1b68217852e7aea70b1e857d107b47637d5160f9f9a1b24882d2a
```

This will build the docker image from `cdk.out/my-image` using `CustomDockerFile` as a dockerfile. Then, it will assume the roles in the destinations specified in `assets.json` and push the image to the specified ECR locations.

The second action will run this command:

```shell
cdk-assets publish cdk.out a0bae29e7b47044a66819606c65d26a92b1e844f4b3124a5539efc0167a09e57
```

This will create a zip archive from the files under `asset.a0bae29e7b47044a66819606c65d26a92b1e844f4b3124a5539efc0167a09e57`, and then will assume the roles and upload the file to the destination S3 locations.

### Deployment

Once publishing is complete, we can commence deployment. Deployment can happen at any desired order and use the standard CloudFormation deployment actions.

Each action will be responsible to deploy a single stack to a specific environment. The input artifact will be the cloud assembly, and the template file name will be the template

In our example, we decided to first deploy the VPC stack to all geographies and then deploy the service stack, so we will have two deployment stages, each one with two CloudFormation deployment actions.

All actions will use `cdk.out` as their input artifact, with the specified template name, account, region, deploy and CloudFormation IAM roles.

CodePipeline will use the regional replication buckets to transfer cdk.out to the destination regions and then assume the deployment role that will invoke the CloudFormation API, passing it the CloudFormation role.

That's it basically.

