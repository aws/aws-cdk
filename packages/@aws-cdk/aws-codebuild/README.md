## AWS CodeBuild Construct Library
<!--BEGIN STABILITY BANNER-->

---

![Stability: Stable](https://img.shields.io/badge/stability-Stable-success.svg?style=for-the-badge)


---
<!--END STABILITY BANNER-->

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
the `source` property which accepts a class that extends the `Source`
abstract base class.
The default is to have no source associated with the build project;
the `buildSpec` option is required in that case.

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
  source: codebuild.Source.codeCommit({ repository }),
});
```

### `S3Source`

Create a CodeBuild project with an S3 bucket as the source:

```ts
import codebuild = require('@aws-cdk/aws-codebuild');
import s3 = require('@aws-cdk/aws-s3');

const bucket = new s3.Bucket(this, 'MyBucket');
new codebuild.Project(this, 'MyProject', {
  source: codebuild.Source.s3({
    bucket,
    path: 'path/to/file.zip',
  }),
});
```

### `GitHubSource` and `GitHubEnterpriseSource`

These source types can be used to build code from a GitHub repository.
Example:

```typescript
const gitHubSource = codebuild.Source.gitHub({
  owner: 'awslabs',
  repo: 'aws-cdk',
  webhook: true, // optional, default: true if `webhookFilteres` were provided, false otherwise
  webhookFilters: [
    codebuild.FilterGroup.inEventOf(codebuild.EventAction.PUSH).andBranchIs('master'),
  ], // optional, by default all pushes and Pull Requests will trigger a build
});
```

To provide GitHub credentials, please either go to AWS CodeBuild Console to connect
or call `ImportSourceCredentials` to persist your personal access token.
Example:

```
aws codebuild import-source-credentials --server-type GITHUB --auth-type PERSONAL_ACCESS_TOKEN --token <token_value>
```

### `BitBucketSource`

This source type can be used to build code from a BitBucket repository.

```ts
const bbSource = codebuild.Source.bitBucket({
  owner: 'owner',
  repo: 'repo',
});
```

## CodePipeline

To add a CodeBuild Project as an Action to CodePipeline,
use the `PipelineProject` class instead of `Project`.
It's a simple class that doesn't allow you to specify `sources`,
`secondarySources`, `artifacts` or `secondaryArtifacts`,
as these are handled by setting input and output CodePipeline `Artifact` instances on the Action,
instead of setting them on the Project.

```typescript
const project = new codebuild.PipelineProject(this, 'Project', {
  // properties as above...
})
```

For more details, see the readme of the `@aws-cdk/@aws-codepipeline` package.

## Caching

You can save time when your project builds by using a cache. A cache can store reusable pieces of your build environment and use them across multiple builds. Your build project can use one of two types of caching: Amazon S3 or local. In general, S3 caching is a good option for small and intermediate build artifacts that are more expensive to build than to download. Local caching is a good option for large intermediate build artifacts because the cache is immediately available on the build host.

### S3 Caching

With S3 caching, the cache is stored in an S3 bucket which is available from multiple hosts.

```typescript
new codebuild.Project(this, 'Project', {
  source: codebuild.Source.bitBucket({
    owner: 'awslabs',
    repo: 'aws-cdk',
  }),
  cache: codebuild.Cache.bucket(new Bucket(this, 'Bucket'))
});
```

### Local Caching

With local caching, the cache is stored on the codebuild instance itself. This is simple,
cheap and fast, but CodeBuild cannot guarantee a reuse of instance and hence cannot
guarantee cache hits. For example, when a build starts and caches files locally, if two subsequent builds start at the same time afterwards only one of those builds would get the cache. Three different cache modes are supported, which can be turned on individually.

* `LocalCacheMode.Source` caches Git metadata for primary and secondary sources.
* `LocalCacheMode.DockerLayer` caches existing Docker layers.
* `LocalCacheMode.Custom` caches directories you specify in the buildspec file.

```typescript
new codebuild.Project(this, 'Project', {
  source: codebuild.Source.gitHubEnterprise({
    httpsCloneUrl: 'https://my-github-enterprise.com/owner/repo',
  }),

  // Enable Docker AND custom caching
  cache: codebuild.Cache.local(LocalCacheMode.DockerLayer, LocalCacheMode.Custom)
});
```

## Environment

By default, projects use a small instance with an Ubuntu 18.04 image. You
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

* Use `.fromDockerRegistry(image[, { secretsManagerCredentials }])` to reference an image in any public or private Docker registry.
* Use `.fromEcrRepository(repo[, tag])` to reference an image available in an
  ECR repository.
* Use `.fromAsset(directory)` to use an image created from a
  local asset.

The following example shows how to define an image from a Docker asset:

[Docker asset example](./test/integ.docker-asset.lit.ts)

The following example shows how to define an image from an ECR repository:

[ECR example](./test/integ.ecr.lit.ts)

The following example shows how to define an image from a private docker registry:

[Docker Registry example](./test/integ.docker-registry.lit.ts)

## Events

CodeBuild projects can be used either as a source for events or be triggered
by events via an event rule.

### Using Project as an event target

The `@aws-cdk/aws-events-targets.CodeBuildProject` allows using an AWS CodeBuild
project as a AWS CloudWatch event rule target:

```ts
// start build when a commit is pushed
const targets = require('@aws-cdk/aws-events-targets');

codeCommitRepository.onCommit('OnCommit', new targets.CodeBuildProject(project));
```

### Using Project as an event source

To define Amazon CloudWatch event rules for build projects, use one of the `onXxx`
methods:

```ts
const rule = project.onStateChange('BuildStateChange', {
  target: new targets.LambdaFunction(fn)
});
```

## Secondary sources and artifacts

CodeBuild Projects can get their sources from multiple places, and produce
multiple outputs. For example:

```ts
const project = new codebuild.Project(this, 'MyProject', {
  secondarySources: [
    codebuild.Source.codeCommit({
      identifier: 'source2',
      repository: repo,
    }),
  ],
  secondaryArtifacts: [
    codebuild.Artifacts.s3({
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

```typescript
const project = new codebuild.Project(this, 'MyProject', {
  // secondary sources and artifacts as above...
  buildSpec: codebuild.BuildSpec.fromObject({
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
  }),
});
```

### Definition of VPC configuration in CodeBuild Project

Typically, resources in an VPC are not accessible by AWS CodeBuild. To enable
access, you must provide additional VPC-specific configuration information as
part of your CodeBuild project configuration. This includes the VPC ID, the
VPC subnet IDs, and the VPC security group IDs. VPC-enabled builds are then
able to access resources inside your VPC.

For further Information see https://docs.aws.amazon.com/codebuild/latest/userguide/vpc-support.html

**Use Cases**
VPC connectivity from AWS CodeBuild builds makes it possible to:

* Run integration tests from your build against data in an Amazon RDS database that's isolated on a private subnet.
* Query data in an Amazon ElastiCache cluster directly from tests.
* Interact with internal web services hosted on Amazon EC2, Amazon ECS, or services that use internal Elastic Load Balancing.
* Retrieve dependencies from self-hosted, internal artifact repositories, such as PyPI for Python, Maven for Java, and npm for Node.js.
* Access objects in an Amazon S3 bucket configured to allow access through an Amazon VPC endpoint only.
* Query external web services that require fixed IP addresses through the Elastic IP address of the NAT gateway or NAT instance associated with your subnet(s).

Your builds can access any resource that's hosted in your VPC.

**Enable Amazon VPC Access in your CodeBuild Projects**

Pass the VPC when defining your Project, then make sure to
give the CodeBuild's security group the right permissions
to access the resources that it needs by using the
`connections` object.

For example:

```ts
const vpc = new ec2.Vpc(this, 'MyVPC');
const project = new codebuild.Project(this, 'MyProject', {
    vpc: vpc,
    buildSpec: codebuild.BuildSpec.fromObject({
      // ...
    }),
});

project.connections.allowTo(loadBalancer, ec2.Port.tcp(443));
```
