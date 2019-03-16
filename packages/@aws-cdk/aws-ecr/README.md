## Amazon Elastic Container Registry Construct Library

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

### Using with CodePipeline

This package also contains a source Action that allows you to use an ECR Repository as a source for CodePipeline.
Example:

```ts
import codepipeline = require('@aws-cdk/aws-codepipeline');

const pipeline = new codepipeline.Pipeline(this, 'MyPipeline');
const sourceAction = new ecr.PipelineSourceAction({
  actionName: 'ECR',
  repository: ecrRepository,
  imageTag: 'some-tag', // optional, default: 'latest'
  outputArtifactName: 'SomeName', // optional
});
pipeline.addStage({
  actionName: 'Source',
  actions: [sourceAction],
});
```

You can also create the action from the Repository directly:

```ts
// equivalent to the code above:
const sourceAction = ecrRepository.toCodePipelineSourceAction({ actionName: 'ECR' });
```
