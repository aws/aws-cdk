## The CDK Construct Library for AWS CodeDeploy

### Use in CodePipeline

This module contains an Action that allows you to use CodeDeploy with AWS CodePipeline.

Example:

```ts
import codedeploy = require('@aws-cdk/aws-codedeploy');
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
