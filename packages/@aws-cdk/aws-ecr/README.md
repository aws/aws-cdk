## Amazon ECR Construct Library
<div class="stability_label"
     style="background-color: #EC5315; color: white !important; margin: 0 0 1rem 0; padding: 1rem; line-height: 1.5;">
  Stability: 1 - Experimental. This API is still under active development and subject to non-backward
  compatible changes or removal in any future version. Use of the API is not recommended in production
  environments. Experimental APIs are not subject to the Semantic Versioning model.
</div>


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
repository.addLifecycleRule({ maxImageAgeDays: 30 });
```
