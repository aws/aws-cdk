## Amazon ECR Construct Library
<!--BEGIN STABILITY BANNER-->
---

![cfn-resources: Stable](https://img.shields.io/badge/cfn--resources-stable-success.svg?style=for-the-badge)

![cdk-constructs: Stable](https://img.shields.io/badge/cdk--constructs-stable-success.svg?style=for-the-badge)

---
<!--END STABILITY BANNER-->

This package contains constructs for working with Amazon Elastic Container Registry.

### Repositories

Define a repository by creating a new instance of `Repository`. A repository
holds multiple verions of a single container image.

```ts
const repository = new ecr.Repository(this, 'Repository');
```

### Image scanning

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


### Automatically clean up repositories

You can set life cycle rules to automatically clean up old images from your
repository. The first life cycle rule that matches an image will be applied
against that image. For example, the following deletes images older than
30 days, while keeping all images tagged with prod (note that the order
is important here):

```ts
repository.addLifecycleRule({ tagPrefixList: ['prod'], maxImageCount: 9999 });
repository.addLifecycleRule({ maxImageAge: cdk.Duration.days(30) });
```
