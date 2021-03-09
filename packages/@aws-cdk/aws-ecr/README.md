# Amazon ECR Construct Library
<!--BEGIN STABILITY BANNER-->

---

![cfn-resources: Stable](https://img.shields.io/badge/cfn--resources-stable-success.svg?style=for-the-badge)

![cdk-constructs: Stable](https://img.shields.io/badge/cdk--constructs-stable-success.svg?style=for-the-badge)

---

<!--END STABILITY BANNER-->

This package contains constructs for working with Amazon Elastic Container Registry.

## Repositories

Define a repository by creating a new instance of `Repository`. A repository
holds multiple verions of a single container image.

```ts
const repository = new ecr.Repository(this, 'Repository');
```

## Image scanning

Amazon ECR image scanning helps in identifying software vulnerabilities in your container images. You can manually scan container images stored in Amazon ECR, or you can configure your repositories to scan images when you push them to a repository. To create a new repository to scan on push, simply enable `imageScanOnPush` in the properties

```ts
const repository = new ecr.Repository(stack, 'Repo', {
  imageScanOnPush: true
});
```

To create an `onImageScanCompleted` event rule and trigger the event target

```ts
repository.onImageScanCompleted('ImageScanComplete')
  .addTarget(...)
```

### Authorization Token

Besides the Amazon ECR APIs, ECR also allows the Docker CLI or a language-specific Docker library to push and pull
images from an ECR repository. However, the Docker CLI does not support native IAM authentication methods and
additional steps must be taken so that Amazon ECR can authenticate and authorize Docker push and pull requests.
More information can be found at at [Registry Authentication](https://docs.aws.amazon.com/AmazonECR/latest/userguide/Registries.html#registry_auth).

A Docker authorization token can be obtained using the `GetAuthorizationToken` ECR API. The following code snippets
grants an IAM user access to call this API.

```ts
import * as iam from '@aws-cdk/aws-iam';
import * as ecr from '@aws-cdk/aws-ecr';

const user = new iam.User(this, 'User', { ... });
ecr.AuthorizationToken.grantRead(user);
```

If you access images in the [Public ECR Gallery](https://gallery.ecr.aws/) as well, it is recommended you authenticate to the registry to benefit from
higher rate and bandwidth limits.

> See `Pricing` in https://aws.amazon.com/blogs/aws/amazon-ecr-public-a-new-public-container-registry/ and [Service quotas](https://docs.aws.amazon.com/AmazonECR/latest/public/public-service-quotas.html).

The following code snippet grants an IAM user access to retrieve an authorization token for the public gallery.

```ts
import * as iam from '@aws-cdk/aws-iam';
import * as ecr from '@aws-cdk/aws-ecr';

const user = new iam.User(this, 'User', { ... });
ecr.PublicGalleryAuthorizationToken.grantRead(user);
```

This user can then proceed to login to the registry using one of the [authentication methods](https://docs.aws.amazon.com/AmazonECR/latest/public/public-registries.html#public-registry-auth).

### Image tag immutability

You can set tag immutability on images in our repository using the `imageTagMutability` construct prop.

```ts
new ecr.Repository(stack, 'Repo', { imageTagMutability: ecr.TagMutability.IMMUTABLE });
```

## Automatically clean up repositories

You can set life cycle rules to automatically clean up old images from your
repository. The first life cycle rule that matches an image will be applied
against that image. For example, the following deletes images older than
30 days, while keeping all images tagged with prod (note that the order
is important here):

```ts
repository.addLifecycleRule({ tagPrefixList: ['prod'], maxImageCount: 9999 });
repository.addLifecycleRule({ maxImageAge: cdk.Duration.days(30) });
```
