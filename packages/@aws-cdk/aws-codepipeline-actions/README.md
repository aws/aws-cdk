## AWS CodePipeline Actions

This package contains Actions that can be used in a CodePipeline.

```typescript
import codepipeline = require('@aws-cdk/aws-codepipeline');
import codepipeline_actions = require('@aws-cdk/aws-codepipeline-actions');
```

### Sources

#### AWS CodeCommit

To use a CodeCommit Repository in a CodePipeline:

```ts
import codecommit = require('@aws-cdk/aws-codecommit');

const repo = new codecommit.Repository(this, 'Repo', {
  // ...
});

const pipeline = new codepipeline.Pipeline(this, 'MyPipeline', {
  pipelineName: 'MyPipeline',
});
const sourceAction = new codepipeline_actions.CodeCommitSourceAction({
  actionName: 'CodeCommit',
  repository: repo,
});
pipeline.addStage({
  name: 'Source',
  actions: [sourceAction],
});
```

#### GitHub

To use GitHub as the source of a CodePipeline:

```typescript
// Read the secret from ParameterStore
const token = new cdk.SecretParameter(this, 'GitHubToken', { ssmParameter: 'my-github-token' });
const sourceAction = new codepipeline_actions.GitHubSourceAction({
  actionName: 'GitHub_Source',
  owner: 'awslabs',
  repo: 'aws-cdk',
  oauthToken: token.value,
  outputArtifactName: 'SourceOutput', // this will be the name of the output artifact in the Pipeline
  branch: 'develop', // default: 'master'
});
pipeline.addStage({
  name: 'Source',
  actions: [sourceAction],
});
```

#### AWS S3

To use an S3 Bucket as a source in CodePipeline:

```ts
import s3 = require('@aws-cdk/aws-s3');

const sourceBucket = new s3.Bucket(this, 'MyBucket', {
  versioned: true, // a Bucket used as a source in CodePipeline must be versioned
});

const pipeline = new codepipeline.Pipeline(this, 'MyPipeline');
const sourceAction = new codepipeline_actions.S3SourceAction({
  actionName: 'S3Source',
  bucket: sourceBucket,
  bucketKey: 'path/to/file.zip',
});
pipeline.addStage({
  name: 'Source',
  actions: [sourceAction],
});
```

By default, the Pipeline will poll the Bucket to detect changes.
You can change that behavior to use CloudWatch Events by setting the `pollForSourceChanges`
property to `false` (it's `true` by default).
If you do that, make sure the source Bucket is part of an AWS CloudTrail Trail -
otherwise, the CloudWatch Events will not be emitted,
and your Pipeline will not react to changes in the Bucket.
You can do it through the CDK:

```typescript
import cloudtrail = require('@aws-cdk/aws-cloudtrail');

const key = 'some/key.zip';
const trail = new cloudtrail.CloudTrail(this, 'CloudTrail');
trail.addS3EventSelector([sourceBucket.arnForObjects(key)], cloudtrail.ReadWriteType.WriteOnly);
const sourceAction = new codepipeline_actions.S3SourceAction({
  actionName: 'S3Source',
  bucketKey: key,
  bucket: sourceBucket,
  pollForSourceChanges: false, // default: true
});
```

#### AWS ECR

To use an ECR Repository as a source in a Pipeline:

```ts
import ecr = require('@aws-cdk/aws-ecr');

const pipeline = new codepipeline.Pipeline(this, 'MyPipeline');
const sourceAction = new codepipeline_actions.EcrSourceAction({
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

### Build & test

#### AWS CodeBuild

Example of a CodeBuild Project used in a Pipeline, alongside CodeCommit:

```typescript
import codebuild = require('@aws-cdk/aws-codebuild');
import codecommit = require('@aws-cdk/aws-codecommit');

const repository = new codecommit.Repository(this, 'MyRepository', {
  repositoryName: 'MyRepository',
});
const project = new codebuild.PipelineProject(this, 'MyProject');

const sourceAction = new codepipeline_actions.CodeCommitSourceAction({
  actionName: 'CodeCommit',
  repository,
});
const buildAction = new codepipeline_actions.CodeBuildBuildAction({
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

In addition to the build Action, there is also a test Action. It works very
similarly to the build Action, the only difference is that the test Action does
not always produce an output artifact. Example:

```typescript
const testAction = new codepipeline_actions.CodeBuildTestAction({
  actionName: 'IntegrationTest',
  project,
  inputArtifact: sourceAction.outputArtifact,
  // outputArtifactName is optional - if you don't specify it,
  // the Action will have an undefined `outputArtifact` property
  outputArtifactName: 'IntegrationTestOutput',
});
```

##### Multiple inputs and outputs

When you want to have multiple inputs and/or outputs for a Project used in a
Pipeline, instead of using the `secondarySources` and `secondaryArtifacts`
properties of the `Project` class, you need to use the `additionalInputArtifacts` and
`additionalOutputArtifactNames` properties of the CodeBuild CodePipeline
Actions. Example:

```ts
const sourceAction1 = new codepipeline_actions.CodeCommitSourceAction({
  actionName: 'Source1',
  repository: repository1,
});
const sourceAction2 = new codepipeline_actions.CodeCommitSourceAction({
  actionName: 'Source2',
  repository: repository2,
  outputArtifactName: 'source2',
});

const buildAction = new codepipeline_actions.CodeBuildBuildAction({
  actionName: 'Build',
  project,
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

#### Jenkins

In order to use Jenkins Actions in the Pipeline,
you first need to create a `JenkinsProvider`:

```ts
const jenkinsProvider = new codepipeline_actions.JenkinsProvider(this, 'JenkinsProvider', {
  providerName: 'MyJenkinsProvider',
  serverUrl: 'http://my-jenkins.com:8080',
  version: '2', // optional, default: '1'
});
```

If you've registered a Jenkins provider in a different CDK app,
or outside the CDK (in the CodePipeline AWS Console, for example),
you can import it:

```ts
const jenkinsProvider = codepipeline_actions.JenkinsProvider.import(this, 'JenkinsProvider', {
  providerName: 'MyJenkinsProvider',
  serverUrl: 'http://my-jenkins.com:8080',
  version: '2', // optional, default: '1'
});
```

Note that a Jenkins provider
(identified by the provider name-category(build/test)-version tuple)
must always be registered in the given account, in the given AWS region,
before it can be used in CodePipeline.

With a `JenkinsProvider`,
we can create a Jenkins Action:

```ts
const buildAction = new codepipeline_actions.JenkinsBuildAction({
  actionName: 'JenkinsBuild',
  jenkinsProvider: jenkinsProvider,
  projectName: 'MyProject',
});
// there's also a JenkinsTestAction that works identically
```

### Deploy

#### AWS CloudFormation

This module contains Actions that allows you to deploy to CloudFormation from AWS CodePipeline.

For example, the following code fragment defines a pipeline that automatically deploys a CloudFormation template
directly from a CodeCommit repository, with a manual approval step in between to confirm the changes:

[example Pipeline to deploy CloudFormation](test/integ.cfn-template-from-repo.lit.ts)

See [the AWS documentation](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/continuous-delivery-codepipeline.html)
for more details about using CloudFormation in CodePipeline.

##### Actions defined by this package

This package defines the following actions:

* **CloudFormationCreateUpdateStackAction** - Deploy a CloudFormation template directly from the pipeline. The indicated stack is created,
  or updated if it already exists. If the stack is in a failure state, deployment will fail (unless `replaceOnFailure`
  is set to `true`, in which case it will be destroyed and recreated).
* **CloudFormationDeleteStackAction** - Delete the stack with the given name.
* **CloudFormationCreateReplaceChangeSetAction** - Prepare a change set to be applied later. You will typically use change sets if you want
  to manually verify the changes that are being staged, or if you want to separate the people (or system) preparing the
  changes from the people (or system) applying the changes.
* **CloudFormationExecuteChangeSetAction** - Execute a change set prepared previously.

#### AWS CodeDeploy

To use CodeDeploy in a Pipeline:

```ts
import codedeploy = require('@aws-cdk/aws-codedeploy');

const pipeline = new codepipeline.Pipeline(this, 'MyPipeline', {
  pipelineName: 'MyPipeline',
});

// add the source and build Stages to the Pipeline...

const deployAction = new codepipeline_actions.CodeDeployServerDeployAction({
  actionName: 'CodeDeploy',
  inputArtifact: buildAction.outputArtifact,
  deploymentGroup,
});
pipeline.addStage({
  name: 'Deploy',
  actions: [deployAction],
});
```

#### AWS S3

To use an S3 Bucket as a deployment target in CodePipeline:

```ts
const targetBucket = new s3.Bucket(this, 'MyBucket', {});

const pipeline = new codepipeline.Pipeline(this, 'MyPipeline');
const deployAction = new codepipeline_actions.S3DeployAction({
  actionName: 'S3Deploy',
  stage: deployStage,
  bucket: targetBucket,
  inputArtifact: sourceAction.outputArtifact,
});
const deployStage = pipeline.addStage({
  name: 'Deploy',
  actions: [deployAction],
});
```

#### Alexa Skill

You can deploy to Alexa using CodePipeline with the following Action:

```ts
// Read the secrets from ParameterStore
const clientId = new cdk.SecretParameter(this, 'AlexaClientId', { ssmParameter: '/Alexa/ClientId' });
const clientSecret = new cdk.SecretParameter(this, 'AlexaClientSecret', { ssmParameter: '/Alexa/ClientSecret' });
const refreshToken = new cdk.SecretParameter(this, 'AlexaRefreshToken', { ssmParameter: '/Alexa/RefreshToken' });

// Add deploy action
new codepipeline_actions.AlexaSkillDeployAction({
  actionName: 'DeploySkill',
  runOrder: 1,
  inputArtifact: sourceAction.outputArtifact,
  clientId: clientId.value,
  clientSecret: clientSecret.value,
  refreshToken: refreshToken.value,
  skillId: 'amzn1.ask.skill.12345678-1234-1234-1234-123456789012',
});
```

If you need manifest overrides you can specify them as `parameterOverridesArtifact` in the action:

```ts
const cloudformation = require('@aws-cdk/aws-cloudformation');

// Deploy some CFN change set and store output
const executeChangeSetAction = new codepipeline_actions.CloudFormationExecuteChangeSetAction({
  actionName: 'ExecuteChangesTest',
  runOrder: 2,
  stackName,
  changeSetName,
  outputFileName: 'overrides.json',
  outputArtifactName: 'CloudFormation',
});

// Provide CFN output as manifest overrides
new codepipeline_actions.AlexaSkillDeployAction({
  actionName: 'DeploySkill',
  runOrder: 1,
  inputArtifact: sourceAction.outputArtifact,
  parameterOverridesArtifact: executeChangeSetAction.outputArtifact,
  clientId: clientId.value,
  clientSecret: clientSecret.value,
  refreshToken: refreshToken.value,
  skillId: 'amzn1.ask.skill.12345678-1234-1234-1234-123456789012',
});
```

### Approve & invoke

#### Manual approval Action

This package contains an Action that stops the Pipeline until someone manually clicks the approve button:

```typescript
const manualApprovalAction = new codepipeline.ManualApprovalAction({
  actionName: 'Approve',
  notificationTopic: new sns.Topic(this, 'Topic'), // optional
  notifyEmails: [
    'some_email@example.com',
  ], // optional
  additionalInformation: 'additional info', // optional
});
approveStage.addAction(manualApprovalAction);
// `manualApprovalAction.notificationTopic` can be used to access the Topic
// after the Action has been added to a Pipeline
```

If the `notificationTopic` has not been provided,
but `notifyEmails` were,
a new SNS Topic will be created
(and accessible through the `notificationTopic` property of the Action).

#### AWS Lambda

This module contains an Action that allows you to invoke a Lambda function in a Pipeline:

```ts
import lambda = require('@aws-cdk/aws-lambda');

const pipeline = new codepipeline.Pipeline(this, 'MyPipeline');
const lambdaAction = new codepipeline_actions.LambdaInvokeAction({
  actionName: 'Lambda',
  lambda: fn,
});
pipeline.addStage({
  actionName: 'Lambda',
  actions: [lambdaAction],
});
```

The Lambda Action can have up to 5 inputs,
and up to 5 outputs:

```typescript
const lambdaAction = new codepipeline_actions.LambdaInvokeAction({
  actionName: 'Lambda',
  inputArtifacts: [
    sourceAction.outputArtifact,
    buildAction.outputArtifact,
  ],
  outputArtifactNames: [
    'Out1',
    'Out2',
  ],
});

lambdaAction.outputArtifacts(); // returns the list of output Artifacts
lambdaAction.outputArtifact('Out2'); // returns the named output Artifact, or throws an exception if not found
```

See [the AWS documentation](https://docs.aws.amazon.com/codepipeline/latest/userguide/actions-invoke-lambda-function.html)
on how to write a Lambda function invoked from CodePipeline.
