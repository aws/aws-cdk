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

```ts
import apprunner = require('@aws-cdk/aws-apprunner');
```

## Introduction

AWS App Runner is a fully managed service that makes it easy for developers to quickly deploy containerized web applications and APIs, at scale and with no prior infrastructure experience required. Start with your source code or a container image. App Runner automatically builds and deploys the web application and load balances traffic with encryption. App Runner also scales up or down automatically to meet your traffic needs. With App Runner, rather than thinking about servers or scaling, you have more time to focus on your applications.

## Service

The `Service` construct allows you to create AWS App Runner services with `ECR Public`, `ECR` or `Github`. You need specify either `image` or `code` for different scenarios.

## ECR Public

To create a `Service` with ECR Public, define the `image` property with `ContainerImage.fromEcrPublic()`:

```ts
new Service(stack, 'Service', {
  image: ContainerImage.fromEcrPublic('public.ecr.aws/aws-containers/hello-app-runner:latest'),
  port: 80,
});
```

## ECR

To create a `Service` from an existing ECR repository, use `ContainerImage.fromEcrRepository()`:

```ts
// import the existing ECR repository by name
const repo = ecr.Repository.fromRepositoryName(stack, 'ExistingRepository', 'existing-repo');
new Service(stack, 'Service', {
  image: ContainerImage.fromEcrRepository(repo),
  port: 80,
});
```


To create a `Service` from local docker image assets being built and pushed to Amazon ECR,
use `ContainerImage.fromDockerImageAssets()`:

```ts
const imageAssets = new assets.DockerImageAsset(stack, 'ImageAssets', {
  directory, // your code assets directory with Dockerfile
});
new Service(stack, 'Service', {
  image: ContainerImage.fromDockerImageAssets(imageAssets),
  port: 80,
});
```

## Github

To create a `Service` from the Github repository, you need to specify an existing App Runner Connection.

See [Managing App Runner connections](https://docs.aws.amazon.com/apprunner/latest/dg/manage-connections.html) for more details.

```ts
new Service(stack, 'Service', {
  connection: Connection.fromConnectionArn(connectionArn),
  code: CodeRepository.fromGithubRepository({
    repositoryUrl: 'https://github.com/aws-containers/hello-app-runner',
    branch: 'main',
    runtime: CodeRuntime.PYTHON_3,
  }),
});
```

## IAM Role

You are allowed to define `instanceRole` and `accessRole` for the `Service`.

`instanceRole` - The IAM role that provides permissions to your App Runner service. These are permissions that
your code needs when it calls any AWS APIs. 

`accessRole` - The IAM role that grants the App Runner service access to a source repository. It's required for
ECR image repositories (but not for ECR Public repositories). If not defined, a new access role will be generated.

See [App Runner IAM Roles](https://docs.aws.amazon.com/apprunner/latest/dg/security_iam_service-with-iam.html#security_iam_service-with-iam-roles) for more details.

