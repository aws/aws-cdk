# AWS::AppRunner Construct Library
<!--BEGIN STABILITY BANNER-->

---

![cfn-resources: Stable](https://img.shields.io/badge/cfn--resources-stable-success.svg?style=for-the-badge)

> All classes with the `Cfn` prefix in this module ([CFN Resources]) are always stable and safe to use.
>
> [CFN Resources]: https://docs.aws.amazon.com/cdk/latest/guide/constructs.html#constructs_lib

![cdk-constructs: Experimental](https://img.shields.io/badge/cdk--constructs-experimental-important.svg?style=for-the-badge)

> The APIs of higher level constructs in this module are experimental and under active development.
> They are subject to non-backward compatible changes or removal in any future version. These are
> not subject to the [Semantic Versioning](https://semver.org/) model and breaking changes will be
> announced in the release notes. This means that while you may use them, you may need to update
> your source code when upgrading to a newer version of this package.

---

<!--END STABILITY BANNER-->

This module is part of the [AWS Cloud Development Kit](https://github.com/aws/aws-cdk) project.

```ts nofixture
import * as apprunner from '@aws-cdk/aws-apprunner';
```

## Introduction

AWS App Runner is a fully managed service that makes it easy for developers to quickly deploy containerized web applications and APIs, at scale and with no prior infrastructure experience required. Start with your source code or a container image. App Runner automatically builds and deploys the web application and load balances traffic with encryption. App Runner also scales up or down automatically to meet your traffic needs. With App Runner, rather than thinking about servers or scaling, you have more time to focus on your applications.

## Service

The `Service` construct allows you to create AWS App Runner services with `ECR Public`, `ECR` or `Github` with the `source` property in the following scenarios:

- `Source.fromEcr()` - To define the source repository from `ECR`.
- `Source.fromEcrPublic()` - To define the source repository from `ECR Public`.
- `Source.fromGitHub()` - To define the source repository from the `Github repository`.
- `Source.fromAsset()` - To define the source from local asset directory. 


## ECR Public

To create a `Service` with ECR Public:

```ts
new apprunner.Service(this, 'Service', {
  source: apprunner.Source.fromEcrPublic({
    imageConfiguration: { port: 8000 },
    imageIdentifier: 'public.ecr.aws/aws-containers/hello-app-runner:latest',
  }),
});
```

## ECR

To create a `Service` from an existing ECR repository:

```ts
import * as ecr from '@aws-cdk/aws-ecr';

new apprunner.Service(this, 'Service', {
  source: apprunner.Source.fromEcr({
    imageConfiguration: { port: 80 },
    repository: ecr.Repository.fromRepositoryName(this, 'NginxRepository', 'nginx'),
    tagOrDigest: 'latest',
  }),
});
```

To create a `Service` from local docker image asset directory  built and pushed to Amazon ECR:

```ts
import * as assets from '@aws-cdk/aws-ecr-assets';

const imageAsset = new assets.DockerImageAsset(this, 'ImageAssets', {
  directory: path.join(__dirname, './docker.assets'),
});
new apprunner.Service(this, 'Service', {
  source: apprunner.Source.fromAsset({
    imageConfiguration: { port: 8000 },
    asset: imageAsset,
  }),
});
```

## GitHub

To create a `Service` from the GitHub repository, you need to specify an existing App Runner `Connection`.

See [Managing App Runner connections](https://docs.aws.amazon.com/apprunner/latest/dg/manage-connections.html) for more details.

```ts
new apprunner.Service(this, 'Service', {
  source: apprunner.Source.fromGitHub({
    repositoryUrl: 'https://github.com/aws-containers/hello-app-runner',
    branch: 'main',
    configurationSource: apprunner.ConfigurationSourceType.REPOSITORY,
    connection: apprunner.GitHubConnection.fromConnectionArn('CONNECTION_ARN'),
  }),
});
```

Use `codeConfigurationValues` to override configuration values with the `API` configuration source type.

```ts
new apprunner.Service(this, 'Service', {
  source: apprunner.Source.fromGitHub({
    repositoryUrl: 'https://github.com/aws-containers/hello-app-runner',
    branch: 'main',
    configurationSource: apprunner.ConfigurationSourceType.API,
    codeConfigurationValues: {
      runtime: apprunner.Runtime.PYTHON_3,
      port: '8000',
      startCommand: 'python app.py',
      buildCommand: 'yum install -y pycairo && pip install -r requirements.txt',
    },
    connection: apprunner.GitHubConnection.fromConnectionArn('CONNECTION_ARN'),
  }),
});
```

## IAM Roles

You are allowed to define `instanceRole` and `accessRole` for the `Service`.

`instanceRole` - The IAM role that provides permissions to your App Runner service. These are permissions that
your code needs when it calls any AWS APIs. 

`accessRole` - The IAM role that grants the App Runner service access to a source repository. It's required for
ECR image repositories (but not for ECR Public repositories). If not defined, a new access role will be generated
when required.

See [App Runner IAM Roles](https://docs.aws.amazon.com/apprunner/latest/dg/security_iam_service-with-iam.html#security_iam_service-with-iam-roles) for more details.
