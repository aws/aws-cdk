# AWS::AppRunner Construct Library
<!--BEGIN STABILITY BANNER-->

---

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
import * as apprunner from '@aws-cdk/aws-apprunner-alpha';
```

## Introduction

AWS App Runner is a fully managed service that makes it easy for developers to quickly deploy containerized web applications and APIs, at scale and with no prior infrastructure experience required. Start with your source code or a container image. App Runner automatically builds and deploys the web application and load balances traffic with encryption. App Runner also scales up or down automatically to meet your traffic needs. With App Runner, rather than thinking about servers or scaling, you have more time to focus on your applications.

## Service

The `Service` construct allows you to create AWS App Runner services with `ECR Public`, `ECR` or `Github` with the `source` property in the following scenarios:

- `Source.fromEcr()` - To define the source repository from `ECR`.
- `Source.fromEcrPublic()` - To define the source repository from `ECR Public`.
- `Source.fromGitHub()` - To define the source repository from the `Github repository`.
- `Source.fromAsset()` - To define the source from local asset directory. 


The `Service` construct implements `IGrantable`.

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
import * as ecr from 'aws-cdk-lib/aws-ecr';

new apprunner.Service(this, 'Service', {
  source: apprunner.Source.fromEcr({
    imageConfiguration: { port: 80 },
    repository: ecr.Repository.fromRepositoryName(this, 'NginxRepository', 'nginx'),
    tagOrDigest: 'latest',
  }),
});
```

To create a `Service` from local docker image asset directory built and pushed to Amazon ECR:

You can specify whether to enable continuous integration from the source repository with the `autoDeploymentsEnabled` flag.

```ts
import * as assets from 'aws-cdk-lib/aws-ecr-assets';

const imageAsset = new assets.DockerImageAsset(this, 'ImageAssets', {
  directory: path.join(__dirname, './docker.assets'),
});
new apprunner.Service(this, 'Service', {
  source: apprunner.Source.fromAsset({
    imageConfiguration: { port: 8000 },
    asset: imageAsset,
  }),
  autoDeploymentsEnabled: true,
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
your code needs when it calls any AWS APIs. If not defined, a new instance role will be generated
when required.

To add IAM policy statements to this role, use `addToRolePolicy()`:

```ts
import * as iam from 'aws-cdk-lib/aws-iam';

const service = new apprunner.Service(this, 'Service', {
  source: apprunner.Source.fromEcrPublic({
    imageConfiguration: { port: 8000 },
    imageIdentifier: 'public.ecr.aws/aws-containers/hello-app-runner:latest',
  }),
});

service.addToRolePolicy(new iam.PolicyStatement({
  effect: iam.Effect.ALLOW,
  actions: ['s3:GetObject'],
  resources: ['*'],
}))
```

`accessRole` - The IAM role that grants the App Runner service access to a source repository. It's required for
ECR image repositories (but not for ECR Public repositories). If not defined, a new access role will be generated
when required.

See [App Runner IAM Roles](https://docs.aws.amazon.com/apprunner/latest/dg/security_iam_service-with-iam.html#security_iam_service-with-iam-roles) for more details.

## VPC Connector

To associate an App Runner service with a custom VPC, define `vpcConnector` for the service.

```ts
import * as ec2 from 'aws-cdk-lib/aws-ec2';

const vpc = new ec2.Vpc(this, 'Vpc', {
  ipAddresses: ec2.IpAddresses.cidr('10.0.0.0/16')
});

const vpcConnector = new apprunner.VpcConnector(this, 'VpcConnector', {
  vpc,
  vpcSubnets: vpc.selectSubnets({ subnetType: ec2.SubnetType.PUBLIC }),
  vpcConnectorName: 'MyVpcConnector',
});

new apprunner.Service(this, 'Service', {
  source: apprunner.Source.fromEcrPublic({
    imageConfiguration: { port: 8000 },
    imageIdentifier: 'public.ecr.aws/aws-containers/hello-app-runner:latest',
  }),
  vpcConnector,
});
```

## Secrets Manager

To include environment variables integrated with AWS Secrets Manager, use the `environmentSecrets` attribute.
You can use the `addSecret` method from the App Runner `Service` class to include secrets from outside the 
service definition.

```ts
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import * as ssm from 'aws-cdk-lib/aws-ssm';

declare const stack: Stack;

const secret = new secretsmanager.Secret(stack, 'Secret');
const parameter = ssm.StringParameter.fromSecureStringParameterAttributes(stack, 'Parameter', {
  parameterName: '/name',
  version: 1,
});

const service = new apprunner.Service(stack, 'Service', {
  source: apprunner.Source.fromEcrPublic({
    imageConfiguration: {
      port: 8000,
      environmentSecrets: {
        SECRET: apprunner.Secret.fromSecretsManager(secret),
        PARAMETER: apprunner.Secret.fromSsmParameter(parameter),
        SECRET_ID: apprunner.Secret.fromSecretsManagerVersion(secret, { versionId: 'version-id' }),
        SECRET_STAGE: apprunner.Secret.fromSecretsManagerVersion(secret, { versionStage: 'version-stage' }),
      },
    },
    imageIdentifier: 'public.ecr.aws/aws-containers/hello-app-runner:latest',
  })
});

service.addSecret('LATER_SECRET', apprunner.Secret.fromSecretsManager(secret, 'field'));
```

## HealthCheck

To configure the health check for the service, use the `healthCheck` attribute.

You can specify it by static methods `HealthCheck.http` or `HealthCheck.tcp`.

```ts
new apprunner.Service(this, 'Service', {
  source: apprunner.Source.fromEcrPublic({
    imageConfiguration: { port: 8000 },
    imageIdentifier: 'public.ecr.aws/aws-containers/hello-app-runner:latest',
  }),
  healthCheck: apprunner.HealthCheck.http({
    healthyThreshold: 5,
    interval: Duration.seconds(10),
    path: '/',
    timeout: Duration.seconds(10),
    unhealthyThreshold: 10,
  }),
});
```
