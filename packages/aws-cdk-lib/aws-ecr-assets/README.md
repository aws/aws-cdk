# AWS CDK Docker Image Assets


This module allows bundling Docker images as assets.

## Images from Dockerfile

Images are built from a local Docker context directory (with a `Dockerfile`),
uploaded to Amazon Elastic Container Registry (ECR) by the CDK toolkit
and/or your app's CI/CD pipeline, and can be naturally referenced in your CDK app.

```ts
import { DockerImageAsset } from 'aws-cdk-lib/aws-ecr-assets';

const asset = new DockerImageAsset(this, 'MyBuildImage', {
  directory: path.join(__dirname, 'my-image'),

  // Optional: describe the purpose of the asset with a human-readable string
  displayName: 'Source for my function',
});
```

The directory `my-image` must include a `Dockerfile`.

This will instruct the toolkit to build a Docker image from `my-image`, push it
to an Amazon ECR repository and wire the name of the repository as CloudFormation
parameters to your stack.

By default, all files in the given directory will be copied into the docker
*build context*. If there is a large directory that you know you definitely
don't need in the build context you can improve the performance by adding the
names of files and directories to ignore to a file called `.dockerignore`, or
pass them via the `exclude` property. If both are available, the patterns
found in `exclude` are appended to the patterns found in `.dockerignore`.

The `ignoreMode` property controls how the set of ignore patterns is
interpreted. The recommended setting for Docker image assets is
`IgnoreMode.DOCKER`. If the context flag
`@aws-cdk/aws-ecr-assets:dockerIgnoreSupport` is set to `true` in your
`cdk.json` (this is by default for new projects, but must be set manually for
old projects) then `IgnoreMode.DOCKER` is the default and you don't need to
configure it on the asset itself.

Use `asset.imageUri` to reference the image. It includes both the ECR image URL
and tag.

Use `asset.imageTag` to reference only the image tag.

You can optionally pass build args to the `docker build` command by specifying
the `buildArgs` property. It is recommended to skip hashing of `buildArgs` for
values that can change between different machines to maintain a consistent
asset hash.

Additionally, you can supply `buildSecrets`. Your system must have Buildkit
enabled, see https://docs.docker.com/build/buildkit/.

Also, similarly to `@aws-cdk/aws-s3-assets`, you can set the CDK_DOCKER environment
variable in order to provide a custom Docker executable command or path. This may sometimes
be needed when building in environments where the standard docker cannot be executed
(see https://github.com/aws/aws-cdk/issues/8460 for details).

SSH agent sockets or keys may be passed to docker build via `buildSsh`.

```ts
import { DockerImageAsset } from 'aws-cdk-lib/aws-ecr-assets';

const asset = new DockerImageAsset(this, 'MyBuildImage', {
  directory: path.join(__dirname, 'my-image'),
  buildArgs: {
    HTTP_PROXY: 'http://10.20.30.2:1234',
  },
  invalidation: {
    buildArgs: false,
  },
});
```

You can optionally pass a target to the `docker build` command by specifying
the `target` property:

```ts
import { DockerImageAsset } from 'aws-cdk-lib/aws-ecr-assets';

const asset = new DockerImageAsset(this, 'MyBuildImage', {
  directory: path.join(__dirname, 'my-image'),
  target: 'a-target',
});
```

You can optionally pass networking mode to the `docker build` command by specifying
the `networkMode` property:

```ts
import { DockerImageAsset, NetworkMode } from 'aws-cdk-lib/aws-ecr-assets';

const asset = new DockerImageAsset(this, 'MyBuildImage', {
  directory: path.join(__dirname, 'my-image'),
  networkMode: NetworkMode.HOST,
})
```

You can optionally pass an alternate platform to the `docker build` command by specifying
the `platform` property:

```ts
import { DockerImageAsset, Platform } from 'aws-cdk-lib/aws-ecr-assets';

const asset = new DockerImageAsset(this, 'MyBuildImage', {
  directory: path.join(__dirname, 'my-image'),
  platform: Platform.LINUX_ARM64,
})
```

You can optionally pass an array of outputs to the `docker build` command by specifying
the `outputs` property:

```ts
import { DockerImageAsset, Platform } from 'aws-cdk-lib/aws-ecr-assets';

const asset = new DockerImageAsset(this, 'MyBuildImage', {
  directory: path.join(__dirname, 'my-image'),
  outputs: ['type=local,dest=out'],
})
```

You can optionally pass cache from and cache to options to cache images:

```ts
import { DockerImageAsset, Platform } from 'aws-cdk-lib/aws-ecr-assets';

const asset = new DockerImageAsset(this, 'MyBuildImage', {
  directory: path.join(__dirname, 'my-image'),
  cacheFrom: [{ type: 'registry', params: { ref: 'ghcr.io/myorg/myimage:cache' }}],
  cacheTo: { type: 'registry', params: { ref: 'ghcr.io/myorg/myimage:cache', mode: 'max', compression: 'zstd' }}
})
```

You can optionally disable the cache:

```ts
import { DockerImageAsset, Platform } from 'aws-cdk-lib/aws-ecr-assets';

const asset = new DockerImageAsset(this, 'MyBuildImage', {
  directory: path.join(__dirname, 'my-image'),
  cacheDisabled: true,
})
```

## Images from Tarball

Images are loaded from a local tarball, uploaded to ECR by the CDK toolkit and/or your app's CI-CD pipeline, and can be
naturally referenced in your CDK app.

```ts
import { TarballImageAsset } from 'aws-cdk-lib/aws-ecr-assets';

const asset = new TarballImageAsset(this, 'MyBuildImage', {
  tarballFile: 'local-image.tar',
});
```

This will instruct the toolkit to add the tarball as a file asset. During deployment it will load the container image
from `local-image.tar`, push it to an Amazon ECR repository and wire the name of the repository as CloudFormation parameters
to your stack.

Similar to `DockerImageAsset`, you can set the `CDK_DOCKER` environment variable to provide a custom Docker executable 
command or path. This may be needed when building in environments where the standard docker cannot be executed or when 
using alternative container runtimes like Finch.

## Publishing images to ECR repositories

`DockerImageAsset` is designed for seamless build & consumption of image assets by CDK code deployed to multiple environments
through the CDK CLI or through CI/CD workflows. To that end, the ECR repository behind this construct is controlled by the AWS CDK.
The mechanics of where these images are published and how are intentionally kept as an implementation detail, and by default the construct itself sets the ECR repository, name, and tags.

### Using externally managed ECR repositories

If you need to publish images to an **existing ECR repository that is managed outside of your CDK application**, 
you can specify the `ecrRepository` property to reference an externally created repository. You can also customize 
image tags using the `imageTag` or `imageTagPrefix` properties.

> **Important**: The ECR repository **must already exist** before deploying your CDK application, as CDK publishes 
> assets before stack deployment begins. The repository cannot be created in the same CDK application that uses it 
> for Docker image assets.

**Use cases for externally managed repositories:**

- Using pre-existing ECR repositories with specific lifecycle policies and governance requirements
- Publishing to shared repositories managed by a central platform team
- Integrating with existing CI/CD workflows that require specific repository structures

```ts
import * as ecr from 'aws-cdk-lib/aws-ecr';

// Reference an EXISTING ECR repository (created outside this CDK app)
// Option 1: Import by repository ARN
const existingRepo = ecr.Repository.fromRepositoryArn(
  this, 
  'ExistingRepo',
  'arn:aws:ecr:us-east-1:123456789012:repository/my-existing-repo'
);

// Option 2: Import by repository name (must exist in the same account/region)
const existingRepo = ecr.Repository.fromRepositoryName(
  this,
  'ExistingRepo', 
  'my-existing-repo'
);

// Use the existing repository for your Docker image asset
const asset = new DockerImageAsset(this, 'MyAsset', {
  directory: path.join(__dirname, 'my-image'),
  ecrRepository: existingRepo,         // Use existing external repository
  imageTag: 'v1.2.3',                 // Custom tag (optional)
  // OR
  imageTagPrefix: 'feature-branch-',   // Tag prefix + asset hash (optional)
});
```

> **Warning**: When using externally managed repositories, you are responsible for:
> - Ensuring the repository exists before deployment
> - Managing repository lifecycle policies
> - Configuring appropriate IAM permissions for CDK to push images
> - Handling image cleanup and retention

### Custom image tags with CDK-managed repositories

Even when using the default CDK-managed ECR repositories, you can customize the image tags:

```ts
// Use custom tag with default CDK-managed repository
const asset = new DockerImageAsset(this, 'MyAsset', {
  directory: path.join(__dirname, 'my-image'),
  imageTag: 'v1.0.0',                    // Fixed tag
});

// Or use a tag prefix combined with the asset hash
const asset = new DockerImageAsset(this, 'MyAsset', {
  directory: path.join(__dirname, 'my-image'),
  imageTagPrefix: 'prod-',               // Results in: prod-<asset-hash>
});
```

> **Note**: Custom tags affect the asset hash, so different tags will create different assets.

### Alternative solutions for image lifecycle management

If you need more advanced ECR repository management, consider these CDK-recommended approaches:

**1. App Staging Synthesizer (Recommended for per-app isolation)**

The [App Staging Synthesizer](https://docs.aws.amazon.com/cdk/api/v2/docs/app-staging-synthesizer-alpha-readme.html)
creates separate support stacks for each CDK application. Unlike the default stack synthesizer, the App Staging
Synthesizer creates unique ECR repositories for each `DockerImageAsset`, allowing lifecycle policies to only retain the
last `n` images. This is a great way to keep your ECR repositories clean and reduce cost. You can learn more about
this feature in [this blog post](https://aws.amazon.com/blogs/devops/enhancing-resource-isolation-in-aws-cdk-with-the-app-staging-synthesizer/).

**2. CDK ECR Deployment (For copying images to well-known locations)**

If you need to publish image assets to a specific ECR repository in your control (e.g., for consumption by other teams), 
consider using [cdklabs/cdk-ecr-deployment], which can replicate an image asset from the CDK-controlled ECR repository 
to a repository of your choice.

Here an example from the [cdklabs/cdk-ecr-deployment] project:

```text
// This example available in TypeScript only

import { DockerImageAsset } from 'aws-cdk-lib/aws-ecr-assets';
import * as ecrdeploy from 'cdk-ecr-deployment';

const image = new DockerImageAsset(this, 'CDKDockerImage', {
  directory: path.join(__dirname, 'docker'),
});

new ecrdeploy.ECRDeployment(this, 'DeployDockerImage', {
  src: new ecrdeploy.DockerImageName(image.imageUri),
  dest: new ecrdeploy.DockerImageName(`${cdk.Aws.ACCOUNT_ID}.dkr.ecr.us-west-2.amazonaws.com/test:nginx`),
});
```

⚠️ Please note that this is a 3rd-party construct library and is not officially supported by AWS.
You are welcome to +1 [this GitHub issue](https://github.com/aws/aws-cdk/issues/12597) if you would like to see
native support for this use-case in the AWS CDK.

[cdklabs/cdk-ecr-deployment]: https://github.com/cdklabs/cdk-ecr-deployment

## Pull Permissions

Depending on the consumer of your image asset, you will need to make sure
the principal has permissions to pull the image.

In most cases, you should use the `asset.repository.grantPull(principal)`
method. This will modify the IAM policy of the principal to allow it to
pull images from this repository.

If the pulling principal is not in the same account or is an AWS service that
doesn't assume a role in your account (e.g. AWS CodeBuild), you must either copy the image to a new repository, or
grant pull permissions on the resource policy of the repository. Since the repository is managed by the CDK bootstrap stack,
the following permissions must be granted there, or granted manually on the repository: "ecr:GetDownloadUrlForLayer",
"ecr:BatchGetImage" and "ecr:BatchCheckLayerAvailability".
