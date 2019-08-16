## AWS CodePipeline Actions
<!--BEGIN STABILITY BANNER-->

---

![Stability: Stable](https://img.shields.io/badge/stability-Stable-success.svg?style=for-the-badge)


---
<!--END STABILITY BANNER-->

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
const sourceOutput = new codepipeline.Artifact();
const sourceAction = new codepipeline_actions.CodeCommitSourceAction({
  actionName: 'CodeCommit',
  repository: repo,
  output: sourceOutput,
});
pipeline.addStage({
  stageName: 'Source',
  actions: [sourceAction],
});
```

#### GitHub

To use GitHub as the source of a CodePipeline:

```typescript
// Read the secret from Secrets Manager
const sourceOutput = new codepipeline.Artifact();
const sourceAction = new codepipeline_actions.GitHubSourceAction({
  actionName: 'GitHub_Source',
  owner: 'awslabs',
  repo: 'aws-cdk',
  oauthToken: cdk.SecretValue.secretsManager('my-github-token'),
  output: sourceOutput,
  branch: 'develop', // default: 'master'
  trigger: codepipeline_actions.GitHubTrigger.POLL // default: 'WEBHOOK', 'NONE' is also possible for no Source trigger
});
pipeline.addStage({
  stageName: 'Source',
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
const sourceOutput = new codepipeline.Artifact();
const sourceAction = new codepipeline_actions.S3SourceAction({
  actionName: 'S3Source',
  bucket: sourceBucket,
  bucketKey: 'path/to/file.zip',
  output: sourceOutput,
});
pipeline.addStage({
  stageName: 'Source',
  actions: [sourceAction],
});
```

By default, the Pipeline will poll the Bucket to detect changes.
You can change that behavior to use CloudWatch Events by setting the `trigger`
property to `S3Trigger.EVENTS` (it's `S3Trigger.POLL` by default).
If you do that, make sure the source Bucket is part of an AWS CloudTrail Trail -
otherwise, the CloudWatch Events will not be emitted,
and your Pipeline will not react to changes in the Bucket.
You can do it through the CDK:

```typescript
import cloudtrail = require('@aws-cdk/aws-cloudtrail');

const key = 'some/key.zip';
const trail = new cloudtrail.Trail(this, 'CloudTrail');
trail.addS3EventSelector([sourceBucket.arnForObjects(key)], {
  readWriteType: cloudtrail.ReadWriteType.WRITE_ONLY,
});
const sourceAction = new codepipeline_actions.S3SourceAction({
  actionName: 'S3Source',
  bucketKey: key,
  bucket: sourceBucket,
  output: sourceOutput,
  trigger: codepipeline_actions.S3Trigger.EVENTS, // default: S3Trigger.POLL
});
```

#### AWS ECR

To use an ECR Repository as a source in a Pipeline:

```ts
import ecr = require('@aws-cdk/aws-ecr');

const pipeline = new codepipeline.Pipeline(this, 'MyPipeline');
const sourceOutput = new codepipeline.Artifact();
const sourceAction = new codepipeline_actions.EcrSourceAction({
  actionName: 'ECR',
  repository: ecrRepository,
  imageTag: 'some-tag', // optional, default: 'latest'
  output: sourceOutput,
});
pipeline.addStage({
  stageName: 'Source',
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

const sourceOutput = new codepipeline.Artifact();
const sourceAction = new codepipeline_actions.CodeCommitSourceAction({
  actionName: 'CodeCommit',
  repository,
  output: sourceOutput,
});
const buildAction = new codepipeline_actions.CodeBuildAction({
  actionName: 'CodeBuild',
  project,
  input: sourceOutput,
  outputs: [new codepipeline.Artifact()], // optional
});

new codepipeline.Pipeline(this, 'MyPipeline', {
  stages: [
    {
      stageName: 'Source',
      actions: [sourceAction],
    },
    {
      stageName: 'Build',
      actions: [buildAction],
    },
  ],
});
```

The default category of the CodeBuild Action is `Build`;
if you want a `Test` Action instead,
override the `type` property:

```typescript
const testAction = new codepipeline_actions.CodeBuildAction({
  actionName: 'IntegrationTest',
  project,
  input: sourceOutput,
  type: codepipeline_actions.CodeBuildActionType.TEST, // default is BUILD
});
```

##### Multiple inputs and outputs

When you want to have multiple inputs and/or outputs for a Project used in a
Pipeline, instead of using the `secondarySources` and `secondaryArtifacts`
properties of the `Project` class, you need to use the `extraInputs` and
`extraOutputs` properties of the CodeBuild CodePipeline
Actions. Example:

```ts
const sourceOutput1 = new codepipeline.Artifact();
const sourceAction1 = new codepipeline_actions.CodeCommitSourceAction({
  actionName: 'Source1',
  repository: repository1,
  output: sourceOutput1,
});
const sourceOutput2 = new codepipeline.Artifact('source2');
const sourceAction2 = new codepipeline_actions.CodeCommitSourceAction({
  actionName: 'Source2',
  repository: repository2,
  output: sourceOutput2,
});

const buildAction = new codepipeline_actions.CodeBuildAction({
  actionName: 'Build',
  project,
  input: sourceOutput1,
  extraInputs: [
    sourceOutput2, // this is where 'source2' comes from
  ],
  outputs: [
    new codepipeline.Artifact('artifact1'), // for better buildspec readability - see below
    new codepipeline.Artifact('artifact2'),
  ],
});
```

**Note**: when a CodeBuild Action in a Pipeline has more than one output, it
only uses the `secondary-artifacts` field of the buildspec, never the
primary output specification directly under `artifacts`. Because of that, it
pays to explicitly name all output artifacts of that Action, like we did
above, so that you know what name to use in the buildspec.

Example buildspec for the above project:

```ts
const project = new codebuild.PipelineProject(this, 'MyProject', {
  buildSpec: codebuild.BuildSpec.fromObject({
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
  }),
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
const buildAction = new codepipeline_actions.JenkinsAction({
  actionName: 'JenkinsBuild',
  jenkinsProvider: jenkinsProvider,
  projectName: 'MyProject',
  type: ccodepipeline_actions.JenkinsActionType.BUILD,
});
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

##### Lambda deployed through CodePipeline

If you want to deploy your Lambda through CodePipeline,
and you don't use assets (for example, because your CDK code and Lambda code are separate),
you can use a special Lambda `Code` class, `CfnParametersCode`.
Note that your Lambda must be in a different Stack than your Pipeline.
The Lambda itself will be deployed, alongside the entire Stack it belongs to,
using a CloudFormation CodePipeline Action. Example:

[Example of deploying a Lambda through CodePipeline](test/integ.lambda-deployed-through-codepipeline.lit.ts)

##### Cross-account actions

If you want to update stacks in a different account,
pass the `account` property when creating the action:

```typescript
new codepipeline_actions.CloudFormationCreateUpdateStackAction({
  // ...
  account: '123456789012',
});
```

This will create a new stack, called `<PipelineStackName>-support-123456789012`, in your `App`,
that will contain the role that the pipeline will assume in account 123456789012 before executing this action.
This support stack will automatically be deployed before the stack containing the pipeline.

You can also pass a role explicitly when creating the action -
in that case, the `account` property is ignored,
and the action will operate in the same account the role belongs to:

```typescript
import { PhysicalName } from '@aws-cdk/core';

// in stack for account 123456789012...
const actionRole = new iam.Role(otherAccountStack, 'ActionRole', {
  assumedBy: new iam.AccountPrincipal(pipelineAccount),
  // the role has to have a physical name set
  roleName: PhysicalName.GENERATE_IF_NEEDED,
});

// in the pipeline stack...
new codepipeline_actions.CloudFormationCreateUpdateStackAction({
  // ...
  role: actionRole, // this action will be cross-account as well
});
```

#### AWS CodeDeploy

##### Server deployments

To use CodeDeploy for EC2/on-premise deployments in a Pipeline:

```ts
import codedeploy = require('@aws-cdk/aws-codedeploy');

const pipeline = new codepipeline.Pipeline(this, 'MyPipeline', {
  pipelineName: 'MyPipeline',
});

// add the source and build Stages to the Pipeline...

const deployAction = new codepipeline_actions.CodeDeployServerDeployAction({
  actionName: 'CodeDeploy',
  input: buildOutput,
  deploymentGroup,
});
pipeline.addStage({
  stageName: 'Deploy',
  actions: [deployAction],
});
```

##### Lambda deployments

To use CodeDeploy for blue-green Lambda deployments in a Pipeline:

```typescript
const lambdaCode = lambda.Code.fromCfnParameters();
const func = new lambda.Function(lambdaStack, 'Lambda', {
  code: lambdaCode,
  handler: 'index.handler',
  runtime: lambda.Runtime.NODEJS_8_10,
});
// used to make sure each CDK synthesis produces a different Version
const version = func.addVersion('NewVersion')
const alias = new lambda.Alias(lambdaStack, 'LambdaAlias', {
  aliasName: 'Prod',
  version,
});

new codedeploy.LambdaDeploymentGroup(lambdaStack, 'DeploymentGroup', {
  alias,
  deploymentConfig: codedeploy.LambdaDeploymentConfig.LINEAR_10PERCENT_EVERY_1MINUTE,
});
```

Then, you need to create your Pipeline Stack,
where you will define your Pipeline,
and deploy the `lambdaStack` using a CloudFormation CodePipeline Action
(see above for a complete example).

#### ECS

CodePipeline can deploy an ECS service.
The deploy Action receives one input Artifact which contains the [image definition file]:

```typescript
const deployStage = pipeline.addStage({
  stageName: 'Deploy',
  actions: [
    new codepipeline_actions.EcsDeployAction({
      actionName: 'DeployAction',
      service,
      // if your file is called imagedefinitions.json,
      // use the `input` property,
      // and leave out the `imageFile` property
      input: buildOutput,
      // if your file name is _not_ imagedefinitions.json,
      // use the `imageFile` property,
      // and leave out the `input` property
      imageFile: buildOutput.atPath('imageDef.json'),
    }),
  ],
});
```

[image definition file]: https://docs.aws.amazon.com/codepipeline/latest/userguide/pipelines-create.html#pipelines-create-image-definitions

#### AWS S3

To use an S3 Bucket as a deployment target in CodePipeline:

```ts
const targetBucket = new s3.Bucket(this, 'MyBucket', {});

const pipeline = new codepipeline.Pipeline(this, 'MyPipeline');
const deployAction = new codepipeline_actions.S3DeployAction({
  actionName: 'S3Deploy',
  stage: deployStage,
  bucket: targetBucket,
  input: sourceOutput,
});
const deployStage = pipeline.addStage({
  stageName: 'Deploy',
  actions: [deployAction],
});
```

#### Alexa Skill

You can deploy to Alexa using CodePipeline with the following Action:

```ts
// Read the secrets from ParameterStore
const clientId = cdk.SecretValue.secretsManager('AlexaClientId');
const clientSecret = cdk.SecretValue.secretsManager('AlexaClientSecret');
const refreshToken = cdk.SecretValue.secretsManager('AlexaRefreshToken');

// Add deploy action
new codepipeline_actions.AlexaSkillDeployAction({
  actionName: 'DeploySkill',
  runOrder: 1,
  input: sourceOutput,
  clientId: clientId.toString(),
  clientSecret: clientSecret,
  refreshToken: refreshToken,
  skillId: 'amzn1.ask.skill.12345678-1234-1234-1234-123456789012',
});
```

If you need manifest overrides you can specify them as `parameterOverridesArtifact` in the action:

```ts
const cloudformation = require('@aws-cdk/aws-cloudformation');

// Deploy some CFN change set and store output
const executeOutput = new codepipeline.Artifact('CloudFormation');
const executeChangeSetAction = new codepipeline_actions.CloudFormationExecuteChangeSetAction({
  actionName: 'ExecuteChangesTest',
  runOrder: 2,
  stackName,
  changeSetName,
  outputFileName: 'overrides.json',
  output: executeOutput,
});

// Provide CFN output as manifest overrides
new codepipeline_actions.AlexaSkillDeployAction({
  actionName: 'DeploySkill',
  runOrder: 1,
  input: sourceOutput,
  parameterOverridesArtifact: executeOutput,
  clientId: clientId.toString(),
  clientSecret: clientSecret,
  refreshToken: refreshToken,
  skillId: 'amzn1.ask.skill.12345678-1234-1234-1234-123456789012',
});
```

### Approve & invoke

#### Manual approval Action

This package contains an Action that stops the Pipeline until someone manually clicks the approve button:

```typescript
const manualApprovalAction = new codepipeline_actions.ManualApprovalAction({
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
  stageName: 'Lambda',
  actions: [lambdaAction],
});
```

The Lambda Action can have up to 5 inputs,
and up to 5 outputs:

```typescript

const lambdaAction = new codepipeline_actions.LambdaInvokeAction({
  actionName: 'Lambda',
  inputs: [
    sourceOutput,
    buildOutput,
  ],
  outputs: [
    new codepipeline.Artifact('Out1'),
    new codepipeline.Artifact('Out2'),
  ],
  lambda: fn
});
```

See [the AWS documentation](https://docs.aws.amazon.com/codepipeline/latest/userguide/actions-invoke-lambda-function.html)
on how to write a Lambda function invoked from CodePipeline.
