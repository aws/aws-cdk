## AWS CodeBuild Construct Library

Define a project. This will also create an IAM Role and IAM Policy for CodeBuild to use.

### Using CodeBuild with other AWS services

#### CodeCommit

Create a CodeBuild project with CodeCommit as the source:

```ts
import codebuild = require('@aws-cdk/aws-codebuild');
import codecommit = require('@aws-cdk/aws-codecommit');

const repo = new codecommit.Repository(this, 'MyRepo', { repositoryName: 'foo' });
new codebuild.Project(this, 'MyFirstCodeCommitProject', {
    source: new codebuild.CodeCommitSource({
        repository: repo,
    }),
});
```

#### S3

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

#### CodePipeline

Example of a Project used in CodePipeline,
alongside CodeCommit:

```ts
import codebuild = require('@aws-cdk/aws-codebuild');
import codecommit = require('@aws-cdk/aws-codecommit');
import codepipeline = require('@aws-cdk/aws-codepipeline');

const repository = new codecommit.Repository(this, 'MyRepository', {
    repositoryName: 'MyRepository',
});

const project = new codebuild.PipelineProject(this, 'MyProject');

const pipeline = new codepipeline.Pipeline(this, 'MyPipeline');

const sourceStage = pipeline.addStage('Source');
repository.addToPipeline(sourceStage, 'CodeCommit');

const buildStage = pipeline.addStage('Build');
new codebuild.PipelineBuildAction(this, 'CodeBuild', {
    stage: buildStage,
    project,
});
```

The `PipelineProject` utility class is a simple sugar around the `Project` class,
it's equivalent to:

```ts
const project = new codebuild.Project(this, 'MyProject', {
    source: new codebuild.CodePipelineSource(),
    artifacts: new codebuild.CodePipelineBuildArtifacts(),
    // rest of the properties from PipelineProject are passed unchanged...
}
```

You can also add the Project to the Pipeline directly:

```ts
// equivalent to the code above:
const buildAction = project.addBuildToPipeline(buildStage, 'CodeBuild');
```

In addition to the build Action,
there is also a test Action.
It works very similarly to the build Action,
the only difference is that the test Action does not always produce an output artifact.

Examples:

```ts
new codebuild.PipelineTestAction(this, 'IntegrationTest', {
    stage: buildStage,
    project,
    // outputArtifactName is optional - if you don't specify it,
    // the Action will have an undefined `outputArtifact` property
    outputArtifactName: 'IntegrationTestOutput',
});

// equivalent to the code above:
project.addTestToPipeline(buildStage, 'IntegrationTest', {
    // of course, this property is optional here as well
    outputArtifactName: 'IntegrationTestOutput',
});
```

### Using Project as an event target

The `Project` construct implements the `IEventRuleTarget` interface. This means that it can be
used as a target for event rules:

```ts
// start build when a commit is pushed
codeCommitRepository.onCommit('OnCommit', project);
```

### Using Project as an event source

To define CloudWatch event rules for build projects, use one of the `onXxx` methods:

```ts
const rule = project.onStateChange('BuildStateChange');
rule.addTarget(lambdaFunction);
```

### Secondary sources and artifacts

CodeBuild Projects can get their sources from multiple places,
and produce multiple outputs. For example:

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

Note that the `identifier` property is required for both secondary sources and artifacts.

The contents of the secondary source will be available to the build under the directory
specified by the `CODEBUILD_SRC_DIR_<identifier>` environment variable
(so, `CODEBUILD_SRC_DIR_source2` in the above case).

The secondary artifacts have their own section in the buildspec,
under the regular `artifacts` one.
Each secondary artifact has its own section,
beginning with their identifier.

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

#### Multiple inputs and outputs in CodePipeline

When you want to have multiple inputs and/or outputs for a Project used in a Pipeline,
instead of using the `secondarySources` and `secondaryArtifacts` properties,
you need to use the `additionalInputArtifacts` and `additionalOutputArtifactNames`
properties of the CodeBuild CodePipeline Actions.
Example:

```ts
const sourceStage = pipeline.addStage('Source');
const sourceAction1 = repository1.addToPipeline(sourceStage, 'Source1');
const sourceAction2 = repository2.addToPipeline(sourceStage, 'Source2', {
    outputArtifactName: 'source2',
});

const buildStage = pipeline.addStage('Build');
const buildAction = project.addBuildToPipeline(buildStage, 'Build', {
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

**Note**: when a CodeBuild Action in a Pipeline has more than one output,
it will only use the `secondary-artifacts` field of the buildspec,
never the primary output specification directly under `artifacts`.
Because of that, it pays to name even your primary output artifact on the Pipeline,
like we did above, so that you know what name to use in the buildspec.

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
