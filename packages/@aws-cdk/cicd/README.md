## Continuous Integration / Continuous Delivery for CDK Applications

### Getting Started
In order to add the `PipelineDeployStackAction` to your *CodePipeline*, you need to have a *CodePipeline* artifact that
contains the result of invoking `cdk synth` on your *CDK App*. You can for example achieve this using a *CodeBuild*
project.

Then, simply add your stacks to be deployed by your *CodePipeline* like so:
```ts
import cicd = require('@aws-cdk/cicd');

// Assuming we already have the following:
const stackToDeploy: cdk.Stack;
const synthesizedApp: codepipeline_api.Artifact;
const deployStage: codepipeline_api.IStage;

// Add actions to deploy the stack in the deploy stage:
new cicd.PipelineDeployStackAction(this, 'DeployStack', {
  stage: deployStage,
  stack: stackToDeploy,
  changeSetName: 'CodePipeline-ChangeSet',
  inputArtifact: synthesizedApp,
});
```

### Limitations
The construct library in it's current form has the following limitations:
1. It can only deploy stacks that are hosted in the same AWS account and region as the *CodePipeline* is.
2. Stacks that make use of `Asset`s cannot be deployed successfully.

This module is part of the [AWS Cloud Development Kit](https://github.com/awslabs/aws-cdk) project.
