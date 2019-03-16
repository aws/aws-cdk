# AWS CodeBuild

AWS CodeBuild is a fully managed continuous integration service that compiles
source code, runs tests, and produces software packages that are ready to
deploy. With CodeBuild, you don’t need to provision, manage, and scale your own
build servers. CodeBuild scales continuously and processes multiple builds
concurrently, so your builds are not left waiting in a queue. You can get
started quickly by using prepackaged build environments, or you can create
custom build environments that use your own build tools. With CodeBuild, you are
charged by the minute for the compute resources you use.

## Installation

Install the module:

```console
$ npm i @aws-cdk/aws-codebuild
```

Import it into your code:

```ts
import codebuild = require('@aws-cdk/aws-codebuild');
```

The `codebuild.Project` construct represents a build project resource. See the
reference documentation for a comprehensive list of initialization properties,
methods and attributes.

## Source

Build projects are usually associated with a _source_, which is specified via
the `source` property which accepts a class that extends the `BuildSource`
abstract base class. The supported sources are:

### `NoSource`

This is the default and implies that no source is associated with this
build project.

The `buildSpec` option is required in this case.

Here's a CodeBuild project with no source which simply prints `Hello,
CodeBuild!`:

[Minimal Example](./test/integ.defaults.lit.ts)

### `CodeCommitSource`

Use an AWS CodeCommit repository as the source of this build:

```ts
import codebuild = require('@aws-cdk/aws-codebuild');
import codecommit = require('@aws-cdk/aws-codecommit');

const repository = new codecommit.Repository(this, 'MyRepo', { repositoryName: 'foo' });
new codebuild.Project(this, 'MyFirstCodeCommitProject', {
  source: new codebuild.CodeCommitSource({ repository }),
});
```

### `S3BucketSource`

Create a CodeBuild project with an S3 bucket as the source:

```ts
import codebuild = require('@aws-cdk/aws-codebuild');
import s3 = require('@aws-cdk/aws-s3');

const bucket = new s3.Bucket(this, 'MyBucket');
new codebuild.Project(this, 'MyProject', {
  source: new codebuild.S3BucketSource({
    bucket: bucket,
    path: 'path/to/file.zip',
  }),
});
```

### `CodePipelineSource`

Used as a special source type when a CodeBuild project is used as a
CodePipeline action.

### `GitHubSource` and `GitHubEnterpriseSource`

These source types can be used to build code from a GitHub repository.
Example:

```typescript
const gitHubSource = new codebuild.GitHubSource({
  owner: 'awslabs',
  repo: 'aws-cdk',
  oauthToken: new cdk.SecretParameter(this, 'GitHubOAuthToken', {
    ssmParameter: 'my-github-token',
  }).value,
  webhook: true, // optional, default: false
});
```

### `BitBucketSource`

This source type can be used to build code from a BitBucket repository.

## Environment

By default, projects use a small instance with an Ubuntu 14.04 image. You
can use the `environment` property to customize the build environment:

* `buildImage` defines the Docker image used. See [Images](#images) below for
  details on how to define build images.
* `computeType` defines the instance type used for the build.
* `privileged` can be set to `true` to allow privileged access.
* `environmentVariables` can be set at this level (and also at the project
  level).

## Images

The CodeBuild library supports both Linux and Windows images via the
`LinuxBuildImage` and `WindowsBuildImage` classes, respectively.

You can either specify one of the predefined Windows/Linux images by using one
of the constants such as `WindowsBuildImage.WIN_SERVER_CORE_2016_BASE` or
`LinuxBuildImage.UBUNTU_14_04_RUBY_2_5_1`.

Alternatively, you can specify a custom image using one of the static methods on
`XxxBuildImage`:

* Use `.fromDockerHub(image)` to reference an image publicly available in Docker
  Hub.
* Use `.fromEcrRepository(repo[, tag])` to reference an image available in an
  ECR repository.
* Use `.fromAsset(this, id, { directory: dir })` to use an image created from a
  local asset.

The following example shows how to define an image from a Docker asset:

[Docker asset example](./test/integ.docker-asset.lit.ts)

The following example shows how to define an image from an ECR repository:

[ECR example](./test/integ.ecr.lit.ts)

## Events

CodeBuild projects can be used either as a source for events or be triggered
by events via an event rule.

### Using Project as an event target

The `Project` construct implements the `IEventRuleTarget` interface. This means
that it can be used as a target for event rules:

```ts
// start build when a commit is pushed
codeCommitRepository.onCommit('OnCommit', project);
```

### Using Project as an event source

To define Amazon CloudWatch event rules for build projects, use one of the `onXxx`
methods:

```ts
const rule = project.onStateChange('BuildStateChange');
rule.addTarget(lambdaFunction);
```

## Using a CodeBuild Project as an AWS CodePipeline action

Example of a Project used in CodePipeline, alongside CodeCommit:

```typescript
import codebuild = require('@aws-cdk/aws-codebuild');
import codecommit = require('@aws-cdk/aws-codecommit');
import codepipeline = require('@aws-cdk/aws-codepipeline');

const repository = new codecommit.Repository(this, 'MyRepository', {
  repositoryName: 'MyRepository',
});
const project = new codebuild.PipelineProject(this, 'MyProject');

const sourceAction = repository.toCodePipelineSourceAction({ actionName: 'CodeCommit' });
const buildAction = new codebuild.PipelineBuildAction({
  actionName: 'CodeBuild',
  project,
  inputArtifact: sourceAction.outputArtifact,
});

new codepipeline.Pipeline(this, 'MyPipeline', {
  stages: [
    {
      name: 'Source',
      actions: [sourceAction],
    },
    {
      name: 'Build',
      actions: [buildAction],
    },
  ],
});
```

The `PipelineProject` utility class is a simple sugar around the `Project`
class, it's equivalent to:

```ts
const project = new codebuild.Project(this, 'MyProject', {
  source: new codebuild.CodePipelineSource(),
  artifacts: new codebuild.CodePipelineBuildArtifacts(),
  // rest of the properties from PipelineProject are passed unchanged...
}
```

You can also create the action from the Project directly:

```ts
// equivalent to the code above:
const buildAction = project.toCodePipelineBuildAction({
  actionName: 'CodeBuild',
  inputArtifact: sourceAction.outputArtifact,
});
```

In addition to the build Action, there is also a test Action. It works very
similarly to the build Action, the only difference is that the test Action does
not always produce an output artifact.

Examples:

```typescript
const testAction = new codebuild.PipelineTestAction({
  actionName: 'IntegrationTest',
  project,
  inputArtifact: sourceAction.outputArtifact,
  // outputArtifactName is optional - if you don't specify it,
  // the Action will have an undefined `outputArtifact` property
  outputArtifactName: 'IntegrationTestOutput',
});

// equivalent to the code above:
const testAction = project.toCodePipelineTestAction({
  actionName: 'IntegrationTest',
  inputArtifact: sourceAction.outputArtifact,
  // of course, this property is optional here as well
  outputArtifactName: 'IntegrationTestOutput',
});
```

## Secondary sources and artifacts

CodeBuild Projects can get their sources from multiple places, and produce
multiple outputs. For example:

```ts
const project = new codebuild.Project(this, 'MyProject', {
  secondarySources: [
    new codebuild.CodeCommitSource({
    identifier: 'source2',
    repository: repo,
    }),
  ],
  secondaryArtifacts: [
    new codebuild.S3BucketBuildArtifacts({
    identifier: 'artifact2',
    bucket: bucket,
    path: 'some/path',
    name: 'file.zip',
    }),
  ],
  // ...
});
```

Note that the `identifier` property is required for both secondary sources and
artifacts.

The contents of the secondary source is available to the build under the
directory specified by the `CODEBUILD_SRC_DIR_<identifier>` environment variable
(so, `CODEBUILD_SRC_DIR_source2` in the above case).

The secondary artifacts have their own section in the buildspec, under the
regular `artifacts` one. Each secondary artifact has its own section, beginning
with their identifier.

So, a buildspec for the above Project could look something like this:

```ts
const project = new codebuild.Project(this, 'MyProject', {
  // secondary sources and artifacts as above...
  buildSpec: {
    version: '0.2',
    phases: {
    build: {
      commands: [
        'cd $CODEBUILD_SRC_DIR_source2',
        'touch output2.txt',
      ],
    },
    },
    artifacts: {
    'secondary-artifacts': {
      'artifact2': {
        'base-directory': '$CODEBUILD_SRC_DIR_source2',
        'files': [
        'output2.txt',
        ],
      },
    },
    },
  },
});
```

### Multiple inputs and outputs in CodePipeline

When you want to have multiple inputs and/or outputs for a Project used in a
Pipeline, instead of using the `secondarySources` and `secondaryArtifacts`
properties, you need to use the `additionalInputArtifacts` and
`additionalOutputArtifactNames` properties of the CodeBuild CodePipeline
Actions. Example:

```ts
const sourceAction1 = repository1.toCodePipelineSourceAction({
  actionName: 'Source1',
});
const sourceAction2 = repository2.toCodePipelineSourceAction({
  actionName: 'Source2',
  outputArtifactName: 'source2',
});

const buildAction = project.toCodePipelineBuildAction({
  actionName: 'Build',
  inputArtifact: sourceAction1.outputArtifact,
  outputArtifactName: 'artifact1', // for better buildspec readability - see below
  additionalInputArtifacts: [
    sourceAction2.outputArtifact, // this is where 'source2' comes from
  ],
  additionalOutputArtifactNames: [
    'artifact2',
  ],
});
```

**Note**: when a CodeBuild Action in a Pipeline has more than one output, it
only uses the `secondary-artifacts` field of the buildspec, never the
primary output specification directly under `artifacts`. Because of that, it
pays to name even your primary output artifact on the Pipeline, like we did
above, so that you know what name to use in the buildspec.

Example buildspec for the above project:

```ts
const project = new codebuild.PipelineProject(this, 'MyProject', {
  buildSpec: {
    version: '0.2',
    phases: {
    build: {
      commands: [
        // By default, you're in a directory with the contents of the repository from sourceAction1.
          // Use the CODEBUILD_SRC_DIR_source2 environment variable
          // to get a path to the directory with the contents of the second input repository.
        ],
      },
    },
    artifacts: {
      'secondary-artifacts': {
        'artifact1': {
          // primary Action output artifact,
          // available as buildAction.outputArtifact
        },
        'artifact2': {
          // additional output artifact,
          // available as buildAction.additionalOutputArtifact('artifact2')
        },
      },
    },
  },
  // ...
});
```
