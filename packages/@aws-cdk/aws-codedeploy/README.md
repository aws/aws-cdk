## The CDK Construct Library for AWS CodeDeploy

### Applications

To create a new CodeDeploy Application that deploys to EC2/on-premise instances:

```ts
import codedeploy = require('@aws-cdk/aws-codedeploy');

const application = new codedeploy.ServerApplication(this, 'CodeDeployApplication', {
    applicationName: 'MyApplication', // optional property
});
```

To import an already existing Application:

```ts
const application = codedeploy.ServerApplicationRef.import(this, 'ExistingCodeDeployApplication', {
    applicationName: new codedeploy.ApplicationName('MyExistingApplication'),
});
```

### Deployment Groups

To create a new CodeDeploy Deployment Group that deploys to EC2/on-premise instances:

```ts
const deploymentGroup = new codedeploy.ServerDeploymentGroup(this, 'CodeDeployDeploymentGroup', {
    application,
    deploymentGroupName: 'MyDeploymentGroup',
});
```

All properties are optional - if you don't provide an Application,
one will be automatically created.

To import an already existing Deployment Group:

```ts
const deploymentGroup = codedeploy.ServerDeploymentGroupRef.import(this, 'ExistingCodeDeployDeploymentGroup', {
    application,
    deploymentGroupName: new codedeploy.DeploymentGroupName('MyExistingDeploymentGroup'),
});
```

### Use in CodePipeline

This module also contains an Action that allows you to use CodeDeploy with AWS CodePipeline.

Example:

```ts
import codepipeline = require('@aws-cdk/aws-codepipeline');

const pipeline = new codepipeline.Pipeline(this, 'MyPipeline', {
    pipelineName: 'MyPipeline',
});

// add the source and build Stages to the Pipeline...

const deployStage = new codepipeline.Stage(this, 'Deploy', {
    pipeline,
}));
new codedeploy.PipelineDeployAction(this, 'CodeDeploy', {
    stage: deployStage,
    inputArtifact: buildAction.artifact, // taken from a build Action in a previous Stage
    applicationName: 'YourCodeDeployApplicationName',
    deploymentGroupName: 'YourCodeDeployDeploymentGroupName',
});
```
