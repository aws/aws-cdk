## AWS CodePipeline Construct Library

### Pipeline

To construct an empty Pipeline:

```ts
import codepipeline = require('@aws-cdk/aws-codepipeline');

const pipeline = new codepipeline.Pipeline(this, 'MyFirstPipeline');
```

To give the Pipeline a nice, human-readable name:

```ts
const pipeline = new codepipeline.Pipeline(this, 'MyFirstPipeline', {
  pipelineName: 'MyPipeline',
});
```

### Stages

You can provide Stages when creating the Pipeline:

```typescript
const pipeline = new codepipeline.Pipeline(this, 'MyFirstPipeline', {
  stages: [
    {
      name: 'Source',
      actions: [
        // see below...
      ],
    },
  ],
});
```

Or append a Stage to an existing Pipeline:

```ts
const sourceStage = pipeline.addStage({
  name: 'Source',
  actions: [ // optional property
    // see below...
  ],
});
```

You can insert the new Stage at an arbitrary point in the Pipeline:

```ts
pipeline.addStage({
  name: 'SomeStage',
  placement: {
    // note: you can only specify one of the below properties
    rightBefore: anotherStage,
    justAfter: anotherStage,
    atIndex: 3, // indexing starts at 0
                // pipeline.stageCount returns the number of Stages currently in the Pipeline
  }
});
```

### Actions

To add an Action to a Stage:

```ts
const sourceAction = new codepipeline.GitHubSourceAction({
  actionName: 'GitHub_Source',
  owner: 'awslabs',
  repo: 'aws-cdk',
  branch: 'develop', // default: 'master'
  oauthToken: ...,
  outputArtifactName: 'SourceOutput', // this will be the name of the output artifact in the Pipeline
});
sourceStage.addAction(sourceAction);
```

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

#### Jenkins Actions

In order to use Jenkins Actions in the Pipeline,
you first need to create a `JenkinsProvider`:

```ts
const jenkinsProvider = new codepipeline.JenkinsProvider(this, 'JenkinsProvider', {
  providerName: 'MyJenkinsProvider',
  serverUrl: 'http://my-jenkins.com:8080',
  version: '2', // optional, default: '1'
});
```

If you've registered a Jenkins provider in a different CDK app,
or outside the CDK (in the CodePipeline AWS Console, for example),
you can import it:

```ts
const jenkinsProvider = codepipeline.JenkinsProvider.import(this, 'JenkinsProvider', {
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
const buildAction = new codepipeline.JenkinsBuildAction({
  actionName: 'JenkinsBuild',
  jenkinsProvider: jenkinsProvider,
  projectName: 'MyProject',
});
// there's also a JenkinsTestAction that works identically
```

You can also add the Action to the Pipeline directly:

```ts
// equivalent to the code above:
const buildAction = jenkinsProvider.toCodePipelineBuildAction({
  actionName: 'JenkinsBuild',
  projectName: 'MyProject',
});

const testAction = jenkinsProvider.toCodePipelineTestAction({
  actionName: 'JenkinsTest',
  projectName: 'MyProject',
});
```

### Cross-region CodePipelines

You can also use the cross-region feature to deploy resources
(currently, only CloudFormation Stacks are supported)
into a different region than your Pipeline is in.

It works like this:

```ts
const pipeline = new codepipeline.Pipeline(this, 'MyFirstPipeline', {
  // ...
  crossRegionReplicationBuckets: {
    'us-west-1': 'my-us-west-1-replication-bucket',
  },
});

// later in the code...
new cloudformation.PipelineCreateUpdateStackAction({
  actionName: 'CFN_US_West_1',
  // ...
  region: 'us-west-1',
});
```

This way, the `CFN_US_West_1` Action will operate in the `us-west-1` region,
regardless of which region your Pipeline is in.

If you don't provide a bucket name for a region (other than the Pipeline's region)
that you're using for an Action with the `crossRegionReplicationBuckets` property,
there will be a new Stack, named `aws-cdk-codepipeline-cross-region-scaffolding-<region>`,
defined for you, containing a replication Bucket.
Note that you have to make sure to `cdk deploy` all of these automatically created Stacks
before you can deploy your main Stack (the one containing your Pipeline).
Use the `cdk ls` command to see all of the Stacks comprising your CDK application.
Example:

```bash
$ cdk ls
MyMainStack
aws-cdk-codepipeline-cross-region-scaffolding-us-west-1
$ cdk deploy aws-cdk-codepipeline-cross-region-scaffolding-us-west-1
# output of cdk deploy here...
$ cdk deploy MyMainStack
```

See [the AWS docs here](https://docs.aws.amazon.com/codepipeline/latest/userguide/actions-create-cross-region.html)
for more information on cross-region CodePipelines.

### Events

#### Using a pipeline as an event target

A pipeline can be used as a target for a CloudWatch event rule:

```ts
// kick off the pipeline every day
const rule = new EventRule(this, 'Daily', { scheduleExpression: 'rate(1 day)' });
rule.addTarget(pipeline);
```

When a pipeline is used as an event target, the
"codepipeline:StartPipelineExecution" permission is granted to the AWS
CloudWatch Events service.

#### Event sources

Pipelines emit CloudWatch events. To define event rules for events emitted by
the pipeline, stages or action, use the `onXxx` methods on the respective
construct:

```ts
myPipeline.onStateChange('MyPipelineStateChage', target);
myStage.onStateChange('MyStageStateChange', target);
myAction.onStateChange('MyActioStateChange', target);
```
