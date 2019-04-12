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
  webhook: true, // optional, default: false
});
```

### `BitBucketSource`

This source type can be used to build code from a BitBucket repository.

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

Include these settings in your VPC configuration:

* For VPC ID, choose the VPC that CodeBuild uses.
* For Subnets, choose a private subnet SubnetSelection with NAT translation that includes or has routes to the resources used CodeBuild.
* For Security Groups, choose the security groups that CodeBuild uses to allow access to resources in the VPCs.

For example:

```ts
const stack = new cdk.Stack(app, 'aws-cdk-codebuild-project-vpc');
const vpc = new ec2.VpcNetwork(stack, 'MyVPC');
const securityGroup = new ec2.SecurityGroup(stack, 'SecurityGroup1', {
    allowAllOutbound: true,
    description: 'Example',
    groupName: 'MySecurityGroup',
    vpc: vpc,
});
new Project(stack, 'MyProject', {
    buildScriptAsset: new assets.ZipDirectoryAsset(stack, 'Bundle', { path: 'script_bundle' }),
    securityGroups: [securityGroup],
    vpc: vpc
});
```