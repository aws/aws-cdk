## Amazon ECR Construct Library
<!--BEGIN STABILITY BANNER-->

---

![Stability: Stable](https://img.shields.io/badge/stability-Stable-success.svg?style=for-the-badge)


---
<!--END STABILITY BANNER-->

This package contains constructs for working with Amazon Elastic Container Registry.

### Repositories

Define a repository by creating a new instance of `Repository`. A repository
holds multiple verions of a single container image.

```ts
const repository = new ecr.Repository(this, 'Repository');
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
